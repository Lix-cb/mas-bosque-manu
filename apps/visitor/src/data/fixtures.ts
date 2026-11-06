import type { AlertStage, DemoEnvironment, DemoKit, DemoReference, DemoTip } from '@/types/models';

/**
 * Local mock data for the visitor app.
 *
 * Names that appear in the mockup (Sendero La Mesa, Circuito del Encino, Señal M-03,
 * MBM-0248) are kept as-is. Extra entries fill the lists and filters and carry the
 * "· Muestra" suffix so nobody mistakes them for real trail data.
 */

export const DEMO_ALERT_ID = 'MBM-0248';
export const DEMO_DATE = '20/10/2026';

/** Timestamp shown for each alert stage (taken from frames V08 to V08-g). */
export const STAGE_TIMES: Record<AlertStage, string> = {
  preparing: '10:24',
  pending: '10:24',
  transmitted: '10:24',
  received: '10:26',
  mobilized: '10:28',
  on_site: '10:42',
  evacuated: '11:05',
  closed: '11:18',
};

export const references: DemoReference[] = [
  {
    id: 'ruta-la-mesa',
    name: 'Sendero La Mesa',
    category: 'rutas',
    detail: 'Ruta de muestra · Pendiente de validar',
    sheet: 'Sendero de muestra con pendiente moderada. Trazo aproximado, pendiente de validación.',
    sheetBadge: 'Ruta · Referencia local',
    isDemo: true,
  },
  {
    id: 'ruta-encino',
    name: 'Circuito del Encino · Muestra',
    category: 'rutas',
    detail: 'Ruta de muestra · Pendiente de validar',
    sheet: 'Circuito corto de muestra. La longitud mostrada es ilustrativa.',
    sheetBadge: 'Ruta · Referencia local',
    isDemo: true,
  },
  {
    id: 'ruta-arroyo',
    name: 'Vereda del Arroyo · Muestra',
    category: 'rutas',
    detail: 'Ruta de muestra · Pendiente de validar',
    sheet: 'Vereda de muestra junto al cauce. No sustituye la señalización del bosque.',
    sheetBadge: 'Ruta · Referencia local',
    isDemo: true,
  },
  {
    id: 'lugar-kit-la-mesa',
    name: 'Kit médico · Sendero La Mesa',
    category: 'lugares',
    detail: 'Punto de primeros auxilios · Muestra',
    sheet: 'Punto de primeros auxilios de muestra. Stock no confirmado.',
    sheetBadge: 'Lugar · Referencia local',
    isDemo: true,
  },
  {
    id: 'lugar-mirador',
    name: 'Mirador El Tepopote · Muestra',
    category: 'lugares',
    detail: 'Punto de referencia · Muestra',
    sheet: 'Mirador de muestra sobre el valle. Posición aproximada.',
    sheetBadge: 'Lugar · Referencia local',
    isDemo: true,
  },
  {
    id: 'lugar-acceso',
    name: 'Acceso Norte · Muestra',
    category: 'lugares',
    detail: 'Entrada de muestra · Pendiente de validar',
    sheet: 'Acceso de muestra al área. Horario y disponibilidad por validar.',
    sheetBadge: 'Lugar · Referencia local',
    isDemo: true,
  },
  {
    id: 'senal-m03',
    name: 'Señal M-03',
    category: 'senales',
    detail: 'Señal de muestra · Pendiente de validar',
    sheet: 'Cruce de muestra junto al Sendero La Mesa. Posición aproximada, pendiente de validación.',
    sheetBadge: 'Señal · Referencia local',
    isDemo: true,
  },
  {
    id: 'senal-m07',
    name: 'Señal M-07 · Muestra',
    category: 'senales',
    detail: 'Señal de muestra · Pendiente de validar',
    sheet: 'Bifurcación de muestra hacia el Circuito del Encino. Pendiente de validación.',
    sheetBadge: 'Señal · Referencia local',
    isDemo: true,
  },
  {
    id: 'senal-m12',
    name: 'Señal M-12 · Muestra',
    category: 'senales',
    detail: 'Señal de muestra · Pendiente de validar',
    sheet: 'Punto de reunión de muestra. Ubicación por confirmar en campo.',
    sheetBadge: 'Señal · Referencia local',
    isDemo: true,
  },
];

export const kits: DemoKit[] = [
  {
    id: 'kit-la-mesa',
    name: 'Kit médico — Sendero La Mesa',
    trailName: 'Sendero La Mesa',
    description:
      'Punto de primeros auxilios destinado a brindar asistencia básica ante lesiones menores.',
    positionLabel: 'Posición aproximada: 20.6511, −103.5586',
    distanceLabel: 'A 650 m de muestra · Cerca de Señal M-03',
    nearbyLabel: 'Ubicación y distancia por validar.',
    contentsLabel: 'Posible contenido: vendas, gasas, antisépticos y material básico de curación.',
    isDemo: true,
  },
];

export const tips: DemoTip[] = [
  {
    id: 'tip-rutas',
    icon: 'signpost',
    title: 'Sigue las rutas señalizadas',
    body: 'Evita atajos y zonas restringidas. No uses este mapa de muestra para orientarte.',
    isDemo: true,
  },
  {
    id: 'tip-agua',
    icon: 'water',
    title: 'Lleva suficiente agua',
    body: 'Planea la cantidad para tu recorrido y las condiciones de calor.',
    isDemo: true,
  },
  {
    id: 'tip-bateria',
    icon: 'battery',
    title: 'Cuida tu batería',
    body: 'Reduce el brillo y cierra aplicaciones que no necesites.',
    isDemo: true,
  },
  {
    id: 'tip-clima',
    icon: 'weather',
    title: 'Revisa el clima',
    body: 'Evita exponerte a tormentas, incendios o condiciones de riesgo.',
    isDemo: true,
  },
];

/** Highlighted card at the end of V13. */
export const sosFallbackTip = {
  title: 'Si el SOS no se transmite',
  body:
    'No asumas que alguien recibió tu alerta. Si es seguro, intenta comunicarte por un medio disponible y pide apoyo a una persona cercana. Mantente lejos de riesgos y conserva batería; no te desplaces solo para buscar señal si eso te expone.',
};

/** Starting scenario: the "happy path" used in the demo script. */
export const defaultEnvironment: DemoEnvironment = {
  gps: 'available',
  connectivity: 'online',
  mapPackage: 'saved',
  tips: 'saved',
  permissions: {
    location: 'granted',
    bluetooth: 'undefined',
    notifications: 'pending',
  },
  referencesAvailable: true,
  downloadProgress: 48,
};
