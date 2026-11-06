import { Platform, type TextStyle } from 'react-native';

/**
 * Design tokens for the rescuer app, taken from frames R01–R09 of the Figma board.
 */
export const color = {
  // Operations header
  headerNavy: '#102D58',
  headerCard: '#1C4876',
  primary: '#2563EB',
  primaryDeep: '#173B73',

  // Surfaces
  background: '#F4F7FC',
  surface: '#FFFFFF',
  surfaceSoft: '#EAF2FF',

  // Text
  textPrimary: '#102D58',
  textBody: '#1F2D3D',
  textSecondary: '#5B6B82',
  textMuted: '#8494A8',
  textOnDark: '#FFFFFF',
  textOnDarkMuted: '#B9CBE4',

  // Lines
  border: '#DBE5F2',
  divider: '#E6EDF7',

  // Priority and status colors
  danger: '#D93636',
  dangerSurface: '#FDECEC',
  dangerBorder: '#F9D6D6',
  warning: '#92600C',
  warningSurface: '#FFF3D6',
  warningBorder: '#F2E0BD',
  success: '#146B45',
  successSurface: '#E7F3EA',
  successBorder: '#DAEBE0',
  infoSurface: '#EAF2FF',
  infoBorder: '#D0DBEE',
  neutralSurface: '#EEF2F7',

  // Schematic map
  mapFill: '#D7E8D4',
  mapFillSoft: '#C6DDC3',
  mapTrack: '#2563EB',
  mapPath: '#FFFFFF',
  mapStart: '#146B45',
  mapEnd: '#D93636',
} as const;

export const space = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48 } as const;
export const radius = { sm: 8, md: 12, lg: 20, pill: 999 } as const;
export const iconSize = { sm: 20, md: 24, lg: 32 } as const;

export const screenPadding = 20;
export const controlHeight = 52;
export const minTouchTarget = 48;

const family = Platform.select({
  android: 'sans-serif',
  ios: 'System',
  default: 'Inter, system-ui, -apple-system, Segoe UI, Roboto, sans-serif',
});
const familyMedium = Platform.select({
  android: 'sans-serif-medium',
  ios: 'System',
  default: 'Inter, system-ui, -apple-system, Segoe UI, Roboto, sans-serif',
});

type Variant =
  | 'display'
  | 'title'
  | 'section'
  | 'subtitle'
  | 'body'
  | 'bodyStrong'
  | 'support'
  | 'caption'
  | 'overline'
  | 'button';

export const typography: Record<Variant, TextStyle> = {
  display: { fontFamily: familyMedium, fontSize: 26, lineHeight: 32, fontWeight: '700' },
  title: { fontFamily: familyMedium, fontSize: 22, lineHeight: 27, fontWeight: '700' },
  section: { fontFamily: familyMedium, fontSize: 19, lineHeight: 24, fontWeight: '700' },
  subtitle: { fontFamily: familyMedium, fontSize: 16, lineHeight: 21, fontWeight: '600' },
  body: { fontFamily: family, fontSize: 15, lineHeight: 21, fontWeight: '400' },
  bodyStrong: { fontFamily: familyMedium, fontSize: 15, lineHeight: 21, fontWeight: '600' },
  support: { fontFamily: family, fontSize: 13, lineHeight: 18, fontWeight: '400' },
  caption: { fontFamily: family, fontSize: 12, lineHeight: 16, fontWeight: '400' },
  overline: { fontFamily: familyMedium, fontSize: 11, lineHeight: 14, fontWeight: '700', letterSpacing: 0.7 },
  button: { fontFamily: familyMedium, fontSize: 16, lineHeight: 20, fontWeight: '600' },
};

export const elevation = {
  card: {
    shadowColor: '#0B2545',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
} as const;
