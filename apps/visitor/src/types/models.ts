/**
 * Domain models for the visitor app.
 * Every record is mock data (`isDemo: true`); nothing here is sent over a network.
 */

/** Eight-step alert lifecycle defined in the design system ("cycle badges"). */
export type AlertStage =
  | 'preparing'
  | 'pending'
  | 'transmitted'
  | 'received'
  | 'mobilized'
  | 'on_site'
  | 'evacuated'
  | 'closed';

export type GpsState = 'available' | 'unavailable' | 'denied';
export type Connectivity = 'online' | 'offline';
export type MapPackageState = 'missing' | 'downloading' | 'saved' | 'failed';
export type TipsResourceState = 'saved' | 'missing' | 'loading';
export type PermissionState = 'granted' | 'denied' | 'pending' | 'undefined';

export type ReferenceCategory = 'rutas' | 'lugares' | 'senales';

export type DemoReference = {
  id: string;
  name: string;
  category: ReferenceCategory;
  /** Secondary line shown under the name. */
  detail: string;
  /** Long description shown in the map sheet (V11-a). */
  sheet?: string;
  /** Type label shown in the map sheet. */
  sheetBadge?: string;
  isDemo: true;
};

export type DemoKit = {
  id: string;
  name: string;
  trailName: string;
  description: string;
  /** Approximate coordinates from the mockup, always labelled as sample data. */
  positionLabel: string;
  distanceLabel: string;
  nearbyLabel: string;
  contentsLabel: string;
  isDemo: true;
};

export type DemoTip = {
  id: string;
  icon: 'signpost' | 'water' | 'battery' | 'weather';
  title: string;
  body: string;
  isDemo: true;
};

export type DemoPermissions = {
  location: PermissionState;
  bluetooth: PermissionState;
  notifications: PermissionState;
};

export type AlertEvent = {
  stage: AlertStage;
  time: string;
};

export type DemoAlert = {
  /** Local ID. It is kept across retries (V09-a). */
  id: string;
  createdAt: string;
  createdTime: string;
  stage: AlertStage;
  lastEventTime: string;
  description: string;
  referenceId: string | null;
  /** True when the reference was picked by hand because GPS was unavailable (V06-a). */
  referenceIsManual: boolean;
  history: AlertEvent[];
  isDemo: true;
};

/** SOS request being filled in (V06/V07) before it becomes an alert. */
export type AlertDraft = {
  description: string;
  referenceId: string | null;
  referenceIsManual: boolean;
};

/** Simulated device conditions that drive the alternative screen states. */
export type DemoEnvironment = {
  gps: GpsState;
  connectivity: Connectivity;
  mapPackage: MapPackageState;
  tips: TipsResourceState;
  permissions: DemoPermissions;
  /** When false, the local reference catalog is empty (V07-a). */
  referencesAvailable: boolean;
  /** Fixed progress value shown in V14-b. */
  downloadProgress: number;
};
