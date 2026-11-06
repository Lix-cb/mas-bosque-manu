import type { IncidentStatus } from '@/types/models';

export const STATUS_LABEL: Record<IncidentStatus, string> = {
  nueva: 'Nueva',
  recibido: 'Recibido',
  despachado: 'Despachado',
  en_sitio: 'En sitio',
  evacuado: 'Evacuado',
  cerrado: 'Cerrado',
};

/** Lifecycle order. An incident can only move to the next step in this list. */
export const STATUS_ORDER: IncidentStatus[] = [
  'nueva',
  'recibido',
  'despachado',
  'en_sitio',
  'evacuado',
  'cerrado',
];

/** Statuses from which an incident may be closed (R07). */
export const CLOSABLE_STATUSES: IncidentStatus[] = ['en_sitio', 'evacuado'];
