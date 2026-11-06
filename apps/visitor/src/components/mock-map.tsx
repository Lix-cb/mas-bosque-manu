import { Feather } from '@expo/vector-icons';
import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import Svg, { Circle, Path, Rect } from 'react-native-svg';

import { Txt } from '@/components/typography';
import { color, radius, space } from '@/constants/theme';

/**
 * Illustrative map, not real cartography. It is a hand-drawn SVG (contour lines, a
 * dashed trail, the user dot and a few markers) with no map SDK, tiles or projected
 * coordinates. The "Mapa de muestra · No usar para navegar" label is always shown.
 */

export type MapMarker = {
  id: string;
  kind: 'kit' | 'signal';
  /** Position inside the canvas, from 0 to 1. */
  x: number;
  y: number;
  label: string;
};

const CONTOURS = [
  'M0 46 C 70 26, 140 66, 210 44 S 330 20, 400 40',
  'M0 80 C 80 60, 150 96, 220 76 S 340 54, 400 72',
  'M0 116 C 60 100, 130 134, 205 112 S 330 92, 400 108',
  'M0 152 C 90 134, 160 168, 230 148 S 340 128, 400 142',
  'M0 190 C 70 172, 150 204, 225 184 S 335 164, 400 178',
];

const TRAIL = 'M44 212 C 92 198, 118 150, 168 128 S 258 108, 300 54';

export function MockMap({
  height = 150,
  showUser = true,
  markers = defaultMarkers,
  selectedMarkerId,
  onSelectMarker,
  areaLabel = 'Sendero La Mesa',
  style,
}: {
  height?: number;
  showUser?: boolean;
  markers?: MapMarker[];
  selectedMarkerId?: string | null;
  onSelectMarker?: (marker: MapMarker) => void;
  areaLabel?: string;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <View style={[styles.wrapper, { height }, style]}>
      <Svg width="100%" height="100%" viewBox="0 0 400 240" preserveAspectRatio="xMidYMid slice">
        <Rect x={0} y={0} width={400} height={240} fill={color.mapFill} />
        <Path d="M0 0 H400 V96 C 300 118, 180 70, 0 104 Z" fill={color.mapFillSoft} opacity={0.75} />
        <Path d="M0 172 C 120 150, 250 196, 400 168 V240 H0 Z" fill={color.mapFillSoft} opacity={0.6} />
        {CONTOURS.map((d) => (
          <Path key={d} d={d} stroke={color.mapContour} strokeWidth={2} fill="none" opacity={0.9} />
        ))}
        <Path
          d={TRAIL}
          stroke={color.mapTrail}
          strokeWidth={3.5}
          strokeLinecap="round"
          strokeDasharray="10 9"
          fill="none"
        />
        {showUser ? (
          <>
            <Circle cx={168} cy={128} r={11} fill={color.mapUser} opacity={0.22} />
            <Circle cx={168} cy={128} r={6.5} fill={color.mapUser} />
          </>
        ) : null}
      </Svg>

      {markers.map((marker) => (
        <MarkerPin
          key={marker.id}
          marker={marker}
          selected={selectedMarkerId === marker.id}
          onPress={onSelectMarker ? () => onSelectMarker(marker) : undefined}
        />
      ))}

      {areaLabel ? (
        <Txt variant="caption" tone="primaryDeep" style={styles.areaLabel}>
          {areaLabel}
        </Txt>
      ) : null}

      <View style={styles.disclaimer}>
        <Txt variant="caption" tone="textSecondary">
          Mapa de muestra · No usar para navegar
        </Txt>
      </View>
    </View>
  );
}

function MarkerPin({
  marker,
  selected,
  onPress,
}: {
  marker: MapMarker;
  selected: boolean;
  onPress?: () => void;
}) {
  const content = (
    <View style={[styles.marker, selected && styles.markerSelected]}>
      {marker.kind === 'kit' ? (
        <Feather name="plus-square" size={18} color={color.primary} />
      ) : (
        <Feather name="bookmark" size={16} color={color.primary} />
      )}
    </View>
  );

  const positioned: StyleProp<ViewStyle> = {
    position: 'absolute',
    left: `${marker.x * 100}%`,
    top: `${marker.y * 100}%`,
    transform: [{ translateX: -17 }, { translateY: -17 }],
  };

  if (!onPress) return <View style={positioned}>{content}</View>;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={marker.label}
      accessibilityState={{ selected }}
      hitSlop={8}
      style={positioned}
    >
      {content}
    </Pressable>
  );
}

export const defaultMarkers: MapMarker[] = [
  { id: 'kit-la-mesa', kind: 'kit', x: 0.74, y: 0.45, label: 'Kit médico · Sendero La Mesa' },
  { id: 'senal-m03', kind: 'signal', x: 0.26, y: 0.56, label: 'Señal M-03' },
];

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: radius.md,
    overflow: 'hidden',
    backgroundColor: color.mapFill,
    justifyContent: 'flex-end',
  },
  marker: {
    width: 34,
    height: 34,
    borderRadius: radius.sm,
    backgroundColor: color.surface,
    borderWidth: 1.5,
    borderColor: color.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  markerSelected: { backgroundColor: color.surfaceSoft, borderWidth: 2.5 },
  areaLabel: {
    position: 'absolute',
    top: space.sm,
    left: space.sm,
    fontWeight: '600',
  },
  disclaimer: {
    position: 'absolute',
    left: space.sm,
    bottom: space.sm,
    backgroundColor: color.surface,
    borderRadius: radius.sm,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
});
