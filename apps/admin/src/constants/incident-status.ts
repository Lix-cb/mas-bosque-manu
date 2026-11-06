import type { TagTone } from '../components/ui';
import type { IncidentStatus } from '../types/models';

export const STATUS_LABEL: Record<IncidentStatus, string> = {
  nueva: 'Nueva',
  recibido: 'Recibido',
  despachado: 'Despachado',
  en_sitio: 'En sitio',
  evacuado: 'Evacuado',
  cerrado: 'Cerrado',
};

/** Every status except "cerrado". */
export const OPEN_STATUSES: IncidentStatus[] = ['nueva', 'recibido', 'despachado', 'en_sitio', 'evacuado'];

/** Tag tone for each status (A03, A04 and the incident detail). */
export const statusTone: Record<IncidentStatus, TagTone> = {
  nueva: 'info',
  recibido: 'info',
  despachado: 'warning',
  en_sitio: 'warning',
  evacuado: 'success',
  cerrado: 'neutral',
};
