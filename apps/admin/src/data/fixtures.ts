import type {
  DemoContent,
  DemoGeoPoint,
  DemoIncident,
  DemoService,
  DemoTeam,
  MonthlyPoint,
} from '../types/models';

/**
 * Local mock data for the admin panel.
 *
 * Records shown in frames A02–A08 are kept as-is (MBM-0248 to MBM-0251, teams Alfa,
 * Bravo and Charlie, the four A06 contents and the three A08 services). The rest
 * gives the tables, filters and chart enough volume.
 * This copy is independent from the visitor and rescuer data: the apps are not synced.
 */

export const incidents: DemoIncident[] = [
  {
    id: 'MBM-0248',
    category: 'Lesión',
    status: 'recibido',
    priority: 'alta',
    zone: 'La Mesa',
    title: 'Ciclista lesionado',
    description: 'Posible lesión; requiere ayuda para evacuar. Rescatista no asignado.',
    receivedAt: '10:24',
    assignedTeamId: null,
    isDemo: true,
  },
  {
    id: 'MBM-0249',
    category: 'Caída',
    status: 'despachado',
    priority: 'media',
    zone: 'Norte',
    title: 'Caída en sendero',
    description: 'Caída reportada por un tercero; estado por confirmar.',
    receivedAt: '10:18',
    assignedTeamId: 'alfa',
    isDemo: true,
  },
  {
    id: 'MBM-0250',
    category: 'Consulta',
    status: 'cerrado',
    priority: 'baja',
    zone: 'Ruta 07',
    title: 'Consulta de referencia',
    description: 'Consulta atendida sin traslado.',
    receivedAt: '10:22',
    assignedTeamId: 'charlie',
    isDemo: true,
  },
  {
    id: 'MBM-0251',
    category: 'Rescate',
    status: 'en_sitio',
    priority: 'alta',
    zone: 'Área 03',
    title: 'Persona en zona alta',
    description: 'Persona sin posibilidad de descenso autónomo.',
    receivedAt: '09:41',
    assignedTeamId: 'bravo',
    isDemo: true,
  },
  {
    id: 'MBM-0247',
    category: 'Consulta',
    status: 'cerrado',
    priority: 'baja',
    zone: 'Circuito del Encino',
    title: 'Consulta de ruta',
    description: 'Consulta atendida sin traslado.',
    receivedAt: '08:52',
    assignedTeamId: 'charlie',
    isDemo: true,
  },
  {
    id: 'MBM-0246',
    category: 'Lesión',
    status: 'cerrado',
    priority: 'media',
    zone: 'Mirador',
    title: 'Deshidratación reportada',
    description: 'Atención en sitio; sin traslado.',
    receivedAt: '08:10',
    assignedTeamId: 'alfa',
    isDemo: true,
  },
  {
    id: 'MBM-0245',
    category: 'Otro',
    status: 'cerrado',
    priority: 'baja',
    zone: 'Acceso Norte',
    title: 'Reporte sin seguimiento',
    description: 'Solicitud sin descripción adjunta; cerrada sin acción.',
    receivedAt: '07:36',
    assignedTeamId: null,
    isDemo: true,
  },
];

export const teams: DemoTeam[] = [
  { id: 'alfa', name: 'Equipo Alfa', note: 'MBM-0248 · Turno activo', availability: 'ocupado', members: 4, isDemo: true },
  { id: 'bravo', name: 'Equipo Bravo', note: 'Sin asignación reciente', availability: 'en_linea', members: 3, isDemo: true },
  { id: 'charlie', name: 'Equipo Charlie', note: 'Fuera de turno', availability: 'inactivo', members: 3, isDemo: true },
  { id: 'coordinacion', name: 'Coordinación', note: 'Roles y credenciales', availability: 'gestion', members: 2, isDemo: true },
];

export const geoPoints: DemoGeoPoint[] = [
  { id: 'ruta-la-mesa', name: 'Sendero La Mesa', layer: 'rutas', detail: 'Ruta de muestra · Pendiente de validar', x: 0.3, y: 0.62, isDemo: true },
  { id: 'ruta-encino', name: 'Circuito del Encino', layer: 'rutas', detail: 'Ruta de muestra · Pendiente de validar', x: 0.52, y: 0.44, isDemo: true },
  { id: 'ruta-arroyo', name: 'Vereda del Arroyo', layer: 'rutas', detail: 'Ruta de muestra · Pendiente de validar', x: 0.18, y: 0.38, isDemo: true },
  { id: 'kit-la-mesa', name: 'Kit médico · La Mesa', layer: 'lugares', detail: 'Punto de primeros auxilios · Stock no confirmado', x: 0.72, y: 0.3, isDemo: true },
  { id: 'kit-norte', name: 'Kit médico · Acceso Norte', layer: 'lugares', detail: 'Punto de primeros auxilios · Stock no confirmado', x: 0.42, y: 0.74, isDemo: true },
  { id: 'mirador', name: 'Mirador El Tepopote', layer: 'lugares', detail: 'Punto de referencia · Posición aproximada', x: 0.84, y: 0.56, isDemo: true },
  { id: 'senal-m03', name: 'Señal M-03', layer: 'senales', detail: 'Cruce de muestra · Pendiente de validar', x: 0.24, y: 0.5, isDemo: true },
  { id: 'senal-m07', name: 'Señal M-07', layer: 'senales', detail: 'Bifurcación de muestra · Pendiente de validar', x: 0.6, y: 0.66, isDemo: true },
  { id: 'senal-m12', name: 'Señal M-12', layer: 'senales', detail: 'Punto de reunión de muestra · Por confirmar', x: 0.66, y: 0.2, isDemo: true },
];

export const contents: DemoContent[] = [
  {
    id: 'antes',
    title: 'Antes de la visita',
    summary: 'Equipo, agua y preparación',
    body:
      'Prepara la aplicación y sus recursos antes de entrar al bosque. Descarga la copia local de referencias y revisa tu batería.',
    status: 'publicado',
    icon: 'shield',
    isDemo: true,
  },
  {
    id: 'durante',
    title: 'Durante el recorrido',
    summary: 'Rutas y recomendaciones',
    body:
      'Permanece en rutas señalizadas. La cartografía de muestra es ilustrativa y no reemplaza la señalización del bosque.',
    status: 'publicado',
    icon: 'map',
    isDemo: true,
  },
  {
    id: 'emergencia',
    title: 'En una emergencia',
    summary: 'Qué hacer ante falta de señal',
    body:
      'No asumas que alguien recibió tu alerta. Si es seguro, comunícate por un medio disponible y pide apoyo a una persona cercana.',
    status: 'borrador',
    icon: 'alert',
    isDemo: true,
  },
  {
    id: 'clima',
    title: 'Consejos de clima',
    summary: 'Actualización pendiente',
    body: 'Evita exponerte a tormentas, incendios o condiciones de riesgo. Contenido pendiente de revisión.',
    status: 'borrador',
    icon: 'folder',
    isDemo: true,
  },
];

export const services: DemoService[] = [
  { id: 'auth', name: 'Autenticación', detail: 'Acceso protegido / demo', state: 'seguro', icon: 'shield', isDemo: true },
  { id: 'api', name: 'API de incidentes', detail: 'Conexión simulada', state: 'demo', icon: 'alert', isDemo: true },
  { id: 'sos', name: 'Transporte de SOS', detail: 'BLE / Wi-Fi / LoRa por definir', state: 'pendiente', icon: 'wifi', isDemo: true },
];

/** Series for the "Incidentes por periodo" chart (A02 and A07). */
export const monthlyIncidents: MonthlyPoint[] = [
  { label: 'Ene', value: 9 },
  { label: 'Feb', value: 14 },
  { label: 'Mar', value: 11 },
  { label: 'Abr', value: 19 },
  { label: 'May', value: 13 },
  { label: 'Jun', value: 8 },
  { label: 'Jul', value: 18 },
  { label: 'Ago', value: 12 },
];

/** A07 indicators, as written in the mockup. */
export const reportMetrics = {
  incidents: 24,
  averageResponse: '15 min',
  closed: 18,
};

export const auditEvents = [
  { id: 'a1', label: 'Accesos administrativos', detail: 'Eventos de ejemplo' },
];
