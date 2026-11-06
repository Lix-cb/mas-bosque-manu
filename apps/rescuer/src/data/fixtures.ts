import type { DemoIncident, DemoProfile, DemoTeam } from '@/types/models';

/**
 * Local mock data for the rescuer app.
 *
 * IDs, titles and times shown in frames R02–R07 are kept as-is (MBM-0248 to
 * MBM-0250, 10:24, 10:31, 11:02); the rest fills the inbox and filters.
 * This copy is independent from the visitor and admin data: the apps are not synced.
 */

export const teams: DemoTeam[] = [
  { id: 'alfa', name: 'Equipo Alfa', availability: 'ocupado', note: 'MBM-0248 · Turno activo', isDemo: true },
  { id: 'bravo', name: 'Equipo Bravo', availability: 'en_linea', note: 'Sin asignación reciente', isDemo: true },
  { id: 'charlie', name: 'Equipo Charlie', availability: 'inactivo', note: 'Fuera de turno', isDemo: true },
];

export const profile: DemoProfile = {
  displayName: 'Operador de demostración',
  role: 'Rescatista · Equipo Alfa',
  teamId: 'alfa',
  stationLabel: 'Central de rescate · Entorno demostrativo',
  isDemo: true,
};

export const incidents: DemoIncident[] = [
  {
    id: 'MBM-0248',
    summary: 'Lesión durante ciclismo · La Mesa',
    title: 'Ciclista lesionado',
    category: 'lesion',
    priority: 'alta',
    status: 'recibido',
    receivedAt: '10:24',
    ageLabel: 'Hace 12 min',
    zoneLabel: 'Sendero La Mesa · referencia de prueba',
    description: 'Posible lesión; requiere ayuda para evacuar',
    gpsLabel: 'Coordenadas simuladas / precisión incierta',
    assignedTeamId: null,
    history: [
      {
        id: 'e1',
        time: '10:24',
        status: 'recibido',
        title: 'Recibido',
        detail: 'Sistema central recibió la solicitud',
      },
    ],
    notes: [],
    isDemo: true,
  },
  {
    id: 'MBM-0249',
    summary: 'Caída reportada · Sendero Norte',
    title: 'Caída en sendero',
    category: 'caida',
    priority: 'media',
    status: 'despachado',
    receivedAt: '10:18',
    ageLabel: 'Hace 12 min',
    zoneLabel: 'Sendero Norte · referencia de prueba',
    description: 'Caída reportada por un tercero; estado por confirmar',
    gpsLabel: 'Coordenadas simuladas / precisión incierta',
    assignedTeamId: 'alfa',
    history: [
      { id: 'e1', time: '10:18', status: 'recibido', title: 'Recibido', detail: 'Sistema central recibió la solicitud' },
      { id: 'e2', time: '10:35', status: 'despachado', title: 'Despachado', detail: 'Equipo Alfa movilizado' },
    ],
    notes: [],
    isDemo: true,
  },
  {
    id: 'MBM-0250',
    summary: 'Solicitud de ayuda · Marcador 07',
    title: 'Solicitud sin detalle',
    category: 'otro',
    priority: 'baja',
    status: 'nueva',
    receivedAt: '10:22',
    ageLabel: 'Hace 12 min',
    zoneLabel: 'Marcador 07 · referencia de prueba',
    description: 'Solicitud sin descripción adjunta',
    gpsLabel: 'Sin coordenadas asociadas',
    assignedTeamId: null,
    history: [],
    notes: [],
    isDemo: true,
  },
  {
    id: 'MBM-0251',
    summary: 'Rescate en zona alta · Área 03',
    title: 'Persona en zona alta',
    category: 'rescate',
    priority: 'alta',
    status: 'en_sitio',
    receivedAt: '09:41',
    ageLabel: 'Hace 54 min',
    zoneLabel: 'Área 03 · referencia de prueba',
    description: 'Persona sin posibilidad de descenso autónomo',
    gpsLabel: 'Coordenadas simuladas / precisión incierta',
    assignedTeamId: 'bravo',
    history: [
      { id: 'e1', time: '09:41', status: 'recibido', title: 'Recibido', detail: 'Sistema central recibió la solicitud' },
      { id: 'e2', time: '09:58', status: 'despachado', title: 'Despachado', detail: 'Equipo Bravo movilizado' },
      { id: 'e3', time: '10:36', status: 'en_sitio', title: 'En sitio', detail: 'Personal informó llegada' },
    ],
    notes: [],
    isDemo: true,
  },
  {
    id: 'MBM-0247',
    summary: 'Consulta de ruta · Circuito del Encino',
    title: 'Consulta de ruta',
    category: 'consulta',
    priority: 'baja',
    status: 'cerrado',
    receivedAt: '08:52',
    ageLabel: 'Hace 1 h 43 min',
    zoneLabel: 'Circuito del Encino · referencia de prueba',
    description: 'Consulta atendida sin traslado',
    gpsLabel: 'Coordenadas simuladas / precisión incierta',
    assignedTeamId: 'charlie',
    history: [
      { id: 'e1', time: '08:52', status: 'recibido', title: 'Recibido', detail: 'Sistema central recibió la solicitud' },
      { id: 'e2', time: '09:05', status: 'cerrado', title: 'Cerrado', detail: 'Cierre autorizado de demostración' },
    ],
    notes: [],
    isDemo: true,
  },
  {
    id: 'MBM-0246',
    summary: 'Deshidratación reportada · Mirador',
    title: 'Deshidratación reportada',
    category: 'lesion',
    priority: 'media',
    status: 'cerrado',
    receivedAt: '08:10',
    ageLabel: 'Hace 2 h 25 min',
    zoneLabel: 'Mirador El Tepopote · referencia de prueba',
    description: 'Atención en sitio; sin traslado',
    gpsLabel: 'Coordenadas simuladas / precisión incierta',
    assignedTeamId: 'alfa',
    history: [
      { id: 'e1', time: '08:10', status: 'recibido', title: 'Recibido', detail: 'Sistema central recibió la solicitud' },
      { id: 'e2', time: '08:26', status: 'despachado', title: 'Despachado', detail: 'Equipo Alfa movilizado' },
      { id: 'e3', time: '08:51', status: 'en_sitio', title: 'En sitio', detail: 'Personal informó llegada' },
      { id: 'e4', time: '09:14', status: 'evacuado', title: 'Evacuado', detail: 'Evacuación registrada en la simulación' },
      { id: 'e5', time: '09:30', status: 'cerrado', title: 'Cerrado', detail: 'Cierre autorizado de demostración' },
    ],
    notes: [],
    isDemo: true,
  },
];

/** Time shown in R06 as "Última actualización confirmada". */
export const LAST_CONFIRMED_UPDATE = '11:02';
