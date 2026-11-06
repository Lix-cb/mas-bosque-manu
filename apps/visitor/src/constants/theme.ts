import { Platform, type TextStyle } from 'react-native';

/**
 * Design tokens for the visitor app, taken from the "00 — Design system" section of
 * the Figma board (`references/Stage 2 Mobile Development.png`).
 */
export const color = {
  // Brand and status colors
  primary: '#146B45',
  primaryDeep: '#104A34',
  danger: '#D93636',
  warning: '#92600C',
  info: '#2563EB',
  admin: '#6437B5',

  // Surfaces
  background: '#F7F9F7',
  surface: '#FFFFFF',
  surfaceSoft: '#E7F3EA',
  canvas: '#EEF2EE',

  // Text
  textPrimary: '#172B24',
  textSecondary: '#586B62',
  textMuted: '#848B90',
  textOnPrimary: '#FFFFFF',

  // Lines
  border: '#E4E9E5',
  divider: '#D8E3DC',

  // Notice tones
  infoSurface: '#EAF2FF',
  infoBorder: '#D0DBEE',
  infoText: '#173B73',

  successSurface: '#E7F3EA',
  successBorder: '#DAEBE0',
  successText: '#146B45',

  warningSurface: '#FFF3D6',
  warningBorder: '#F2E0BD',
  warningText: '#92600C',

  dangerSurface: '#FDECEC',
  dangerBorder: '#F9D6D6',
  dangerText: '#D93636',

  neutralSurface: '#F1F3F1',
  neutralText: '#586B62',

  // Schematic map
  mapFill: '#BED4B8',
  mapFillSoft: '#CFE0C9',
  mapContour: '#D8E3DC',
  mapTrail: '#146B45',
  mapUser: '#2563EB',
} as const;

/** Spacing scale: 4 / 8 / 16 / 24 / 32 / 48. */
export const space = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

/** Corner radii: 8 / 12 / 20. */
export const radius = {
  sm: 8,
  md: 12,
  lg: 20,
  pill: 999,
} as const;

/** Icon sizes: 20 / 24 (32 for large glyphs). */
export const iconSize = {
  sm: 20,
  md: 24,
  lg: 32,
} as const;

/** Horizontal margin of the 390 × 844 mobile grid. */
export const screenPadding = 24;

/** Buttons are 52 px tall; 48 px is the minimum touch target. */
export const controlHeight = 52;
export const minTouchTarget = 48;

/**
 * The design uses Inter. We rely on the system font stack instead of bundling the
 * font file (see ADR-006 in `docs/DECISIONS.md`).
 */
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

/**
 * Type scale: body 14–16, supporting text 12–14, sections 18–22, headings 24–28.
 * Line height is about 1.4 for body text and 1.2 for headings.
 */
export const typography: Record<Variant, TextStyle> = {
  display: { fontFamily: familyMedium, fontSize: 28, lineHeight: 34, fontWeight: '700' },
  title: { fontFamily: familyMedium, fontSize: 24, lineHeight: 29, fontWeight: '700' },
  section: { fontFamily: familyMedium, fontSize: 20, lineHeight: 24, fontWeight: '700' },
  subtitle: { fontFamily: familyMedium, fontSize: 17, lineHeight: 22, fontWeight: '600' },
  body: { fontFamily: family, fontSize: 15, lineHeight: 21, fontWeight: '400' },
  bodyStrong: { fontFamily: familyMedium, fontSize: 15, lineHeight: 21, fontWeight: '600' },
  support: { fontFamily: family, fontSize: 13, lineHeight: 18, fontWeight: '400' },
  caption: { fontFamily: family, fontSize: 12, lineHeight: 17, fontWeight: '400' },
  overline: { fontFamily: familyMedium, fontSize: 11, lineHeight: 15, fontWeight: '700', letterSpacing: 0.6 },
  button: { fontFamily: familyMedium, fontSize: 16, lineHeight: 20, fontWeight: '600' },
};

/** The design avoids gradients and heavy shadows, so cards get a very soft elevation. */
export const elevation = {
  card: {
    shadowColor: '#0D2B1E',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
} as const;
