import { STAGE_TIMES } from '@/data/fixtures';
import type { AlertStage } from '@/types/models';

export type CycleRowState = 'done' | 'pending';

export type StagePresentation = {
  /** Main heading of V08 and its variants. */
  title: string;
  /** Badge under the header. */
  badgeLabel: string;
  badgeTone: 'warning' | 'success';
  /** The three fixed "response cycle" rows. */
  cycle: {
    preparation: { state: CycleRowState; detail: string };
    transmission: { state: CycleRowState; detail: string };
    reception: { state: CycleRowState; detail: string };
  };
  /** Bottom banner. */
  notice: { tone: 'warning' | 'success'; text: string };
};

/**
 * Copy for each alert stage, matching frames V08 to V08-g.
 * Stages after "transmitted" need an acknowledgement from the backend, so the app
 * never reaches them on its own (see the demo scenarios menu).
 */
export function stagePresentation(stage: AlertStage): StagePresentation {
  const receivedCycle = {
    preparation: { state: 'done' as const, detail: 'Lista · Registro local de muestra' },
    transmission: { state: 'done' as const, detail: 'Transmitida · Transporte simulado' },
    reception: { state: 'done' as const, detail: `Acuse simulado · ${STAGE_TIMES.received}` },
  };

  switch (stage) {
    case 'preparing':
      return {
        title: 'Preparando alerta',
        badgeLabel: 'Sin acuse de recepción',
        badgeTone: 'warning',
        cycle: {
          preparation: { state: 'pending', detail: 'En proceso · En este dispositivo' },
          transmission: { state: 'pending', detail: 'Pendiente · No enviada' },
          reception: { state: 'pending', detail: 'No confirmada por el personal' },
        },
        notice: {
          tone: 'warning',
          text: 'La transmisión no confirma que alguien recibió tu solicitud. No hay despacho confirmado.',
        },
      };
    case 'pending':
      return {
        title: 'Pendiente de transmisión',
        badgeLabel: 'Sin acuse de recepción',
        badgeTone: 'warning',
        cycle: {
          preparation: { state: 'done', detail: 'Lista · Registro local de muestra' },
          transmission: { state: 'pending', detail: 'Pendiente · No enviada' },
          reception: { state: 'pending', detail: 'No confirmada por el personal' },
        },
        notice: {
          tone: 'warning',
          text: 'La transmisión no confirma que alguien recibió tu solicitud. No hay despacho confirmado.',
        },
      };
    case 'transmitted':
      return {
        title: 'Transmitida, sin confirmación',
        badgeLabel: 'Sin acuse de recepción',
        badgeTone: 'warning',
        cycle: {
          preparation: { state: 'done', detail: 'Lista · Registro local de muestra' },
          transmission: { state: 'done', detail: 'Transmitida · Transporte simulado' },
          reception: { state: 'pending', detail: 'No confirmada por el personal' },
        },
        notice: {
          tone: 'warning',
          text: 'La transmisión no confirma que alguien recibió tu solicitud. No hay despacho confirmado.',
        },
      };
    case 'received':
      return {
        title: 'Recibida',
        badgeLabel: 'Actualización simulada',
        badgeTone: 'success',
        cycle: receivedCycle,
        notice: {
          tone: 'success',
          text: 'Acuse simulado recibido. Aún no hay despacho confirmado.',
        },
      };
    case 'mobilized':
      return {
        title: 'Rescatistas movilizados',
        badgeLabel: 'Actualización simulada',
        badgeTone: 'success',
        cycle: receivedCycle,
        notice: {
          tone: 'success',
          text: `Despacho simulado a las ${STAGE_TIMES.mobilized}. No hay tiempo de llegada confirmado.`,
        },
      };
    case 'on_site':
      return {
        title: 'En sitio',
        badgeLabel: 'Actualización simulada',
        badgeTone: 'success',
        cycle: receivedCycle,
        notice: {
          tone: 'success',
          text: `Llegada registrada a las ${STAGE_TIMES.on_site}, en esta simulación.`,
        },
      };
    case 'evacuated':
      return {
        title: 'Evacuado',
        badgeLabel: 'Actualización simulada',
        badgeTone: 'success',
        cycle: receivedCycle,
        notice: {
          tone: 'success',
          text: `Evacuación registrada a las ${STAGE_TIMES.evacuated}, en esta simulación.`,
        },
      };
    case 'closed':
      return {
        title: 'Cerrado',
        badgeLabel: 'Actualización simulada',
        badgeTone: 'success',
        cycle: receivedCycle,
        notice: {
          tone: 'success',
          text: `Cierre autorizado simulado a las ${STAGE_TIMES.closed}. No representa atención real.`,
        },
      };
  }
}

/** Short label used in the lifecycle badges. */
export const STAGE_LABEL: Record<AlertStage, string> = {
  preparing: 'Preparando alerta',
  pending: 'Pendiente de transmisión',
  transmitted: 'Transmitida, sin confirmación',
  received: 'Recibida',
  mobilized: 'Rescatistas movilizados',
  on_site: 'En sitio',
  evacuated: 'Evacuado',
  closed: 'Cerrado',
};

export const STAGE_ORDER: AlertStage[] = [
  'preparing',
  'pending',
  'transmitted',
  'received',
  'mobilized',
  'on_site',
  'evacuated',
  'closed',
];
