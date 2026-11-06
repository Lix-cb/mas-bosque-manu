import { createContext } from 'react';

import type {
  DemoContent,
  DemoGeoPoint,
  DemoIncident,
  DemoService,
  DemoTeam,
  IncidentStatus,
} from '../types/models';

/**
 * Shape of the admin demo state and the React context that carries it.
 * It lives apart from the provider because Fast Refresh needs component files to
 * export components only.
 */

export type AdminScenario = 'con-datos' | 'sin-datos' | 'error';

export type DemoState = {
  signedIn: boolean;
  scenario: AdminScenario;
  incidents: DemoIncident[];
  teams: DemoTeam[];
  geoPoints: DemoGeoPoint[];
  contents: DemoContent[];
  services: DemoService[];
  /** Message for the "saved" toast after the last simulated action. */
  lastSaveLabel: string | null;
};

export type DemoActions = {
  signIn: () => void;
  signOut: () => void;
  setScenario: (scenario: AdminScenario) => void;
  updateIncidentStatus: (id: string, status: IncidentStatus) => void;
  assignIncident: (id: string, teamId: string | null) => void;
  addIncident: (incident: DemoIncident) => void;
  addGeoPoint: (point: DemoGeoPoint) => void;
  removeGeoPoint: (id: string) => void;
  saveContent: (content: DemoContent) => void;
  addContent: (content: DemoContent) => void;
  setTeamAvailability: (id: string, availability: DemoTeam['availability']) => void;
  addTeam: (team: DemoTeam) => void;
  clearSaveLabel: () => void;
  resetDemo: () => void;
};

export type DemoContextValue = DemoState &
  DemoActions & {
    /** Empty on purpose in the "sin-datos" scenario. */
    visibleIncidents: DemoIncident[];
  };

export const DemoContext = createContext<DemoContextValue | null>(null);
