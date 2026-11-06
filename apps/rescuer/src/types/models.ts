/**
 * Domain models for the rescuer app.
 * All incidents, people and teams are fictional, and no action leaves the device.
 */

/**
 * Response lifecycle shown in R05 and R06:
 * Recibido → Despachado → En sitio → Evacuado → Cerrado.
 * "nueva" is the inbox state before any acknowledgement (R02).
 */
export type IncidentStatus =
  | 'nueva'
  | 'recibido'
  | 'despachado'
  | 'en_sitio'
  | 'evacuado'
  | 'cerrado';

export type IncidentPriority = 'alta' | 'media' | 'baja';

export type IncidentCategory = 'lesion' | 'caida' | 'rescate' | 'consulta' | 'otro';

export type IncidentEvent = {
  id: string;
  time: string;
  status: IncidentStatus;
  title: string;
  detail: string;
};

export type DemoIncident = {
  id: string;
  /** Short title used on the inbox card (R02). */
  summary: string;
  /** Long title used on the detail screen (R03). */
  title: string;
  category: IncidentCategory;
  priority: IncidentPriority;
  status: IncidentStatus;
  receivedAt: string;
  ageLabel: string;
  zoneLabel: string;
  description: string;
  gpsLabel: string;
  assignedTeamId: string | null;
  history: IncidentEvent[];
  /** Notes typed in R05. They only live in memory. */
  notes: string[];
  isDemo: true;
};

export type DemoTeam = {
  id: string;
  name: string;
  availability: 'en_linea' | 'ocupado' | 'inactivo';
  note: string;
  isDemo: true;
};

export type DemoProfile = {
  displayName: string;
  role: string;
  teamId: string;
  stationLabel: string;
  isDemo: true;
};

export type SyncState = 'conectado' | 'sin_conexion';

/** Status change saved on the phone while the simulated control center is offline (R08). */
export type PendingChange = {
  id: string;
  incidentId: string;
  status: IncidentStatus;
  note: string;
  createdAt: string;
};
