import { createContext, useCallback, useMemo, useRef, useState, type ReactNode } from 'react';

import { STATUS_LABEL, STATUS_ORDER } from '@/constants/incident-status';
import { incidents as seedIncidents, profile } from '@/data/fixtures';
import type { DemoIncident, IncidentStatus, PendingChange, SyncState } from '@/types/models';

/**
 * In-memory state for the rescuer demo.
 *
 * A change saved on the phone is not the same as a change received by the control
 * center (R08). Every status update is therefore queued as pending while the
 * simulated control center is offline, and only applied once it is back online.
 */

type DemoState = {
  incidents: DemoIncident[];
  sync: SyncState;
  pending: PendingChange[];
  signedIn: boolean;
  /** R09 scenario: the inbox is shown empty. */
  inboxEmpty: boolean;
};

type DemoActions = {
  signIn: () => void;
  signOut: () => void;
  setSync: (sync: SyncState) => void;
  setInboxEmpty: (value: boolean) => void;
  /** Returns true when the simulated control center accepted the change. */
  advanceIncident: (incidentId: string, status: IncidentStatus, note: string) => boolean;
  /** R08 retry: applies the pending changes if the simulated network is back. */
  retrySync: () => boolean;
  resetDemo: () => void;
};

export type DemoContextValue = DemoState &
  DemoActions & {
    getIncident: (id: string) => DemoIncident | undefined;
    /** Statuses the lifecycle allows from the current one. */
    allowedNextStatuses: (incident: DemoIncident) => IncidentStatus[];
  };

export const DemoContext = createContext<DemoContextValue | null>(null);

const initialState: DemoState = {
  incidents: seedIncidents,
  sync: 'conectado',
  pending: [],
  signedIn: false,
  inboxEmpty: false,
};

/**
 * Fixed sample times for new log entries. The device clock is not used, so the log
 * always reads as demo data rather than a live response.
 */
const DEMO_TIMES = ['11:02', '11:14', '11:27', '11:38', '11:49', '12:03'];

const EVENT_DETAIL: Partial<Record<IncidentStatus, string>> = {
  recibido: 'Sistema central recibió la solicitud',
  despachado: 'Equipo Alfa movilizado',
  en_sitio: 'Personal informó llegada',
  evacuado: 'Evacuación registrada en la simulación',
  cerrado: 'Cierre autorizado de demostración',
};

export function DemoProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<DemoState>(initialState);
  const changeSeq = useRef(0);
  const timeIndex = useRef(0);

  const nextTimeLabel = useCallback(() => {
    const value = DEMO_TIMES[Math.min(timeIndex.current, DEMO_TIMES.length - 1)];
    timeIndex.current += 1;
    return value;
  }, []);

  const getIncident = useCallback(
    (id: string) => state.incidents.find((incident) => incident.id === id),
    [state.incidents],
  );

  // Only the next step is offered, which rules out skipping stages (R05).
  const allowedNextStatuses = useCallback((incident: DemoIncident): IncidentStatus[] => {
    const index = STATUS_ORDER.indexOf(incident.status);
    if (index < 0 || index >= STATUS_ORDER.length - 1) return [];
    return [STATUS_ORDER[index + 1]];
  }, []);

  const applyChange = useCallback((change: Omit<PendingChange, 'id'>) => {
    setState((prev) => ({
      ...prev,
      incidents: prev.incidents.map((incident) => {
        if (incident.id !== change.incidentId) return incident;
        // A replayed change must still move the incident forward. This also drops
        // duplicates when the same step was queued twice while offline.
        if (STATUS_ORDER.indexOf(change.status) <= STATUS_ORDER.indexOf(incident.status)) {
          return incident;
        }
        const note = change.note.trim();
        return {
          ...incident,
          status: change.status,
          // Dispatching from this app means the user's own team was mobilized.
          assignedTeamId:
            change.status === 'despachado' ? incident.assignedTeamId ?? profile.teamId : incident.assignedTeamId,
          history: [
            ...incident.history,
            {
              id: `e${incident.history.length + 1}`,
              time: change.createdAt,
              status: change.status,
              title: STATUS_LABEL[change.status],
              detail: EVENT_DETAIL[change.status] ?? 'Registro de demostración',
            },
          ],
          notes: note ? [...incident.notes, note] : incident.notes,
        };
      }),
    }));
  }, []);

  const advanceIncident = useCallback<DemoActions['advanceIncident']>(
    (incidentId, status, note) => {
      const change = { incidentId, status, note, createdAt: nextTimeLabel() };
      if (state.sync === 'sin_conexion') {
        changeSeq.current += 1;
        const id = `c${changeSeq.current}`;
        setState((prev) => ({ ...prev, pending: [...prev.pending, { id, ...change }] }));
        return false;
      }
      applyChange(change);
      return true;
    },
    [applyChange, nextTimeLabel, state.sync],
  );

  const retrySync = useCallback(() => {
    if (state.sync === 'sin_conexion') return false;
    state.pending.forEach(applyChange);
    setState((prev) => ({ ...prev, pending: [] }));
    return true;
  }, [applyChange, state.pending, state.sync]);

  const value = useMemo<DemoContextValue>(
    () => ({
      ...state,
      getIncident,
      allowedNextStatuses,
      advanceIncident,
      retrySync,
      signIn: () => setState((prev) => ({ ...prev, signedIn: true })),
      signOut: () => setState((prev) => ({ ...prev, signedIn: false })),
      setSync: (sync) => setState((prev) => ({ ...prev, sync })),
      setInboxEmpty: (inboxEmpty) => setState((prev) => ({ ...prev, inboxEmpty })),
      // Keeps the session open so the user stays on the profile screen.
      resetDemo: () => {
        changeSeq.current = 0;
        timeIndex.current = 0;
        setState((prev) => ({ ...initialState, signedIn: prev.signedIn }));
      },
    }),
    [state, getIncident, allowedNextStatuses, advanceIncident, retrySync],
  );

  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>;
}
