import { createContext, useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';

import { STAGE_ORDER } from '@/data/alert-stages';
import { DEMO_ALERT_ID, DEMO_DATE, STAGE_TIMES, defaultEnvironment } from '@/data/fixtures';
import type { AlertDraft, AlertStage, DemoAlert, DemoEnvironment } from '@/types/models';

/**
 * In-memory state for the visitor demo. It is not persisted and it is not shared
 * with the rescuer or admin apps. "Restablecer datos de demostración" resets it.
 */

type DemoState = {
  environment: DemoEnvironment;
  alert: DemoAlert | null;
  draft: AlertDraft;
  /** Forces the next transmission attempt to fail (V09 scenario). */
  forceTransmissionFailure: boolean;
  /** Forces the next map download to fail (V14-c scenario). */
  forceDownloadFailure: boolean;
  /** True while the simulated transmission is running. */
  isTransmitting: boolean;
  /** True when the last transmission attempt failed (V09). */
  transmissionFailed: boolean;
};

type DemoActions = {
  patchEnvironment: (patch: Partial<DemoEnvironment>) => void;
  patchDraft: (patch: Partial<AlertDraft>) => void;
  setPermission: (key: keyof DemoEnvironment['permissions'], value: DemoEnvironment['permissions']['location']) => void;
  /** Creates the local request and starts the simulated transmission (V06 → V08). */
  createAlert: (input: AlertDraft) => void;
  /** Retry from V09. Keeps the same local ID. */
  retryTransmission: () => void;
  /** Jumps straight to a stage. Only used by the demo scenarios menu. */
  setStage: (stage: AlertStage) => void;
  clearAlert: () => void;
  setForceTransmissionFailure: (value: boolean) => void;
  setForceDownloadFailure: (value: boolean) => void;
  /** Simulated map download (V14-b). Ends in "saved" or "failed" depending on the scenario. */
  startDownload: () => void;
  cancelDownload: () => void;
  resetDemo: () => void;
};

export type DemoContextValue = DemoState & DemoActions;

export const DemoContext = createContext<DemoContextValue | null>(null);

const TRANSMISSION_DELAY_MS = 1400;
const DOWNLOAD_DELAY_MS = 1800;

const emptyDraft: AlertDraft = { description: '', referenceId: null, referenceIsManual: false };

const initialState: DemoState = {
  environment: defaultEnvironment,
  alert: null,
  draft: emptyDraft,
  forceTransmissionFailure: false,
  forceDownloadFailure: false,
  isTransmitting: false,
  transmissionFailed: false,
};

export function DemoProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<DemoState>(initialState);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearTimers = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }, []);

  const schedule = useCallback((fn: () => void, ms: number) => {
    timers.current.push(setTimeout(fn, ms));
  }, []);

  useEffect(() => clearTimers, [clearTimers]);

  const patchEnvironment = useCallback((patch: Partial<DemoEnvironment>) => {
    setState((prev) => ({ ...prev, environment: { ...prev.environment, ...patch } }));
  }, []);

  const patchDraft = useCallback((patch: Partial<AlertDraft>) => {
    setState((prev) => ({ ...prev, draft: { ...prev.draft, ...patch } }));
  }, []);

  const setPermission = useCallback<DemoActions['setPermission']>((key, value) => {
    setState((prev) => ({
      ...prev,
      environment: { ...prev.environment, permissions: { ...prev.environment.permissions, [key]: value } },
    }));
  }, []);

  // The outcome depends only on the selected demo scenario. No network is involved.
  const runTransmission = useCallback(() => {
    clearTimers();
    setState((prev) => ({ ...prev, isTransmitting: true, transmissionFailed: false }));
    schedule(() => {
      setState((prev) => {
        if (!prev.alert) return { ...prev, isTransmitting: false };
        const failed = prev.forceTransmissionFailure;
        const offline = prev.environment.connectivity === 'offline';
        const next: AlertStage = failed || offline ? 'pending' : 'transmitted';
        return {
          ...prev,
          isTransmitting: false,
          transmissionFailed: failed,
          alert: {
            ...prev.alert,
            stage: next,
            lastEventTime: STAGE_TIMES[next],
            history: [...prev.alert.history, { stage: next, time: STAGE_TIMES[next] }],
          },
        };
      });
    }, TRANSMISSION_DELAY_MS);
  }, [clearTimers, schedule]);

  const createAlert = useCallback<DemoActions['createAlert']>(
    (input) => {
      setState((prev) => ({
        ...prev,
        alert: {
          id: DEMO_ALERT_ID,
          createdAt: DEMO_DATE,
          createdTime: STAGE_TIMES.preparing,
          stage: 'preparing',
          lastEventTime: STAGE_TIMES.preparing,
          description: input.description,
          referenceId: input.referenceId,
          referenceIsManual: input.referenceIsManual,
          history: [{ stage: 'preparing', time: STAGE_TIMES.preparing }],
          isDemo: true,
        },
      }));
      runTransmission();
    },
    [runTransmission],
  );

  const setStage = useCallback(
    (stage: AlertStage) => {
      clearTimers();
      setState((prev) => {
        const base: DemoAlert = prev.alert ?? {
          id: DEMO_ALERT_ID,
          createdAt: DEMO_DATE,
          createdTime: STAGE_TIMES.preparing,
          stage: 'preparing',
          lastEventTime: STAGE_TIMES.preparing,
          description: '',
          referenceId: 'ruta-la-mesa',
          referenceIsManual: false,
          history: [],
          isDemo: true,
        };
        const reached = STAGE_ORDER.slice(0, STAGE_ORDER.indexOf(stage) + 1);
        return {
          ...prev,
          isTransmitting: false,
          transmissionFailed: false,
          alert: {
            ...base,
            stage,
            lastEventTime: STAGE_TIMES[stage],
            history: reached.map((s) => ({ stage: s, time: STAGE_TIMES[s] })),
          },
        };
      });
    },
    [clearTimers],
  );

  const clearAlert = useCallback(() => {
    clearTimers();
    setState((prev) => ({
      ...prev,
      alert: null,
      draft: emptyDraft,
      isTransmitting: false,
      transmissionFailed: false,
    }));
  }, [clearTimers]);

  const setForceTransmissionFailure = useCallback((value: boolean) => {
    setState((prev) => ({ ...prev, forceTransmissionFailure: value }));
  }, []);

  const setForceDownloadFailure = useCallback((value: boolean) => {
    setState((prev) => ({ ...prev, forceDownloadFailure: value }));
  }, []);

  // The progress bar in V14-b is static on purpose; only the final state changes.
  const startDownload = useCallback(() => {
    clearTimers();
    setState((prev) => ({ ...prev, environment: { ...prev.environment, mapPackage: 'downloading' } }));
    schedule(() => {
      setState((prev) => ({
        ...prev,
        environment: {
          ...prev.environment,
          mapPackage: prev.forceDownloadFailure ? 'failed' : 'saved',
        },
      }));
    }, DOWNLOAD_DELAY_MS);
  }, [clearTimers, schedule]);

  const cancelDownload = useCallback(() => {
    clearTimers();
    setState((prev) => ({ ...prev, environment: { ...prev.environment, mapPackage: 'missing' } }));
  }, [clearTimers]);

  const resetDemo = useCallback(() => {
    clearTimers();
    setState(initialState);
  }, [clearTimers]);

  const value = useMemo<DemoContextValue>(
    () => ({
      ...state,
      patchEnvironment,
      patchDraft,
      setPermission,
      createAlert,
      // The same local ID is reused on retry (V09-a), so retrying is just another run.
      retryTransmission: runTransmission,
      setStage,
      clearAlert,
      setForceTransmissionFailure,
      setForceDownloadFailure,
      startDownload,
      cancelDownload,
      resetDemo,
    }),
    [
      state,
      patchEnvironment,
      patchDraft,
      setPermission,
      createAlert,
      runTransmission,
      setStage,
      clearAlert,
      setForceTransmissionFailure,
      setForceDownloadFailure,
      startDownload,
      cancelDownload,
      resetDemo,
    ],
  );

  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>;
}
