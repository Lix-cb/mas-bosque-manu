/**
 * Domain models for the admin panel.
 * Everything is fictional and lives in memory: no backend, database or API.
 */

export type IncidentStatus = 'nueva' | 'recibido' | 'despachado' | 'en_sitio' | 'evacuado' | 'cerrado';
export type IncidentPriority = 'alta' | 'media' | 'baja';
export type IncidentCategory = 'Lesión' | 'Caída' | 'Consulta' | 'Rescate' | 'Otro';

export type DemoIncident = {
  id: string;
  category: IncidentCategory;
  status: IncidentStatus;
  priority: IncidentPriority;
  zone: string;
  title: string;
  description: string;
  receivedAt: string;
  assignedTeamId: string | null;
  isDemo: true;
};

export type TeamAvailability = 'en_linea' | 'ocupado' | 'inactivo' | 'gestion';

export type DemoTeam = {
  id: string;
  name: string;
  note: string;
  availability: TeamAvailability;
  members: number;
  isDemo: true;
};

export type GeoLayer = 'rutas' | 'lugares' | 'senales';

export type DemoGeoPoint = {
  id: string;
  name: string;
  layer: GeoLayer;
  detail: string;
  /** Position inside the schematic canvas, from 0 to 1. */
  x: number;
  y: number;
  isDemo: true;
};

export type ContentStatus = 'publicado' | 'borrador';

export type DemoContent = {
  id: string;
  title: string;
  summary: string;
  body: string;
  status: ContentStatus;
  icon: 'shield' | 'map' | 'alert' | 'folder';
  isDemo: true;
};

export type DemoServiceState = 'seguro' | 'demo' | 'pendiente';

export type DemoService = {
  id: string;
  name: string;
  detail: string;
  state: DemoServiceState;
  icon: 'shield' | 'alert' | 'wifi';
  isDemo: true;
};

export type MonthlyPoint = { label: string; value: number };
