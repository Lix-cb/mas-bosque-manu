import { useCallback, useMemo, useState, type ReactNode } from 'react';

import { DemoContext, type DemoActions, type DemoContextValue, type DemoState } from './demo-context';
import {
  contents as seedContents,
  geoPoints as seedGeoPoints,
  incidents as seedIncidents,
  services as seedServices,
  teams as seedTeams,
} from '../data/fixtures';

/**
 * In-memory state for the admin panel. It is lost on reload, and
 * "Restablecer datos de demostración" brings it back to the seed data.
 */

const initialState: DemoState = {
  signedIn: false,
  scenario: 'con-datos',
  incidents: seedIncidents,
  teams: seedTeams,
  geoPoints: seedGeoPoints,
  contents: seedContents,
  services: seedServices,
  lastSaveLabel: null,
};

export function DemoProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<DemoState>(initialState);

  const patch = useCallback((updater: (prev: DemoState) => DemoState) => setState(updater), []);

  const actions = useMemo<DemoActions>(
    () => ({
      signIn: () => patch((prev) => ({ ...prev, signedIn: true })),
      signOut: () => patch((prev) => ({ ...prev, signedIn: false })),
      setScenario: (scenario) => patch((prev) => ({ ...prev, scenario })),
      updateIncidentStatus: (id, status) =>
        patch((prev) => ({
          ...prev,
          incidents: prev.incidents.map((incident) =>
            incident.id === id ? { ...incident, status } : incident,
          ),
          lastSaveLabel: `Estado de ${id} actualizado en la demostración local.`,
        })),
      assignIncident: (id, teamId) =>
        patch((prev) => ({
          ...prev,
          incidents: prev.incidents.map((incident) =>
            incident.id === id ? { ...incident, assignedTeamId: teamId } : incident,
          ),
          lastSaveLabel: `Asignación de ${id} guardada en la demostración local.`,
        })),
      addIncident: (incident) =>
        patch((prev) => ({
          ...prev,
          incidents: [incident, ...prev.incidents],
          lastSaveLabel: `${incident.id} creado como registro de demostración.`,
        })),
      addGeoPoint: (point) =>
        patch((prev) => ({
          ...prev,
          geoPoints: [...prev.geoPoints, point],
          lastSaveLabel: `«${point.name}» añadido al catálogo de demostración.`,
        })),
      removeGeoPoint: (id) =>
        patch((prev) => ({
          ...prev,
          geoPoints: prev.geoPoints.filter((point) => point.id !== id),
          lastSaveLabel: 'Punto retirado del catálogo de demostración.',
        })),
      saveContent: (content) =>
        patch((prev) => ({
          ...prev,
          contents: prev.contents.map((item) => (item.id === content.id ? content : item)),
          lastSaveLabel: `«${content.title}» guardado localmente. No se publicó nada.`,
        })),
      addContent: (content) =>
        patch((prev) => ({
          ...prev,
          contents: [...prev.contents, content],
          lastSaveLabel: `«${content.title}» creado como borrador de demostración.`,
        })),
      setTeamAvailability: (id, availability) =>
        patch((prev) => ({
          ...prev,
          teams: prev.teams.map((team) => (team.id === id ? { ...team, availability } : team)),
          lastSaveLabel: 'Disponibilidad actualizada en la demostración local.',
        })),
      addTeam: (team) =>
        patch((prev) => ({
          ...prev,
          teams: [...prev.teams, team],
          lastSaveLabel: `«${team.name}» añadido como registro de demostración.`,
        })),
      clearSaveLabel: () => patch((prev) => ({ ...prev, lastSaveLabel: null })),
      resetDemo: () => setState(initialState),
    }),
    [patch],
  );

  const value = useMemo<DemoContextValue>(
    () => ({
      ...state,
      ...actions,
      visibleIncidents: state.scenario === 'sin-datos' ? [] : state.incidents,
    }),
    [state, actions],
  );

  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>;
}

