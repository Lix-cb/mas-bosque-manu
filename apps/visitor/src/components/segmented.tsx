import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { Txt } from '@/components/typography';
import { color, minTouchTarget, radius, space } from '@/constants/theme';

export type SegmentOption<T extends string> = { value: T; label: string };

/**
 * Segmented control (e.g. `Rutas | Lugares | Señales`).
 * The selected option changes background, border and font weight, so the state
 * is not conveyed by color alone.
 */
export function Segmented<T extends string>({
  options,
  value,
  onChange,
  style,
}: {
  options: SegmentOption<T>[];
  value: T;
  onChange: (value: T) => void;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <View style={[styles.group, style]} accessibilityRole="tablist">
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <Pressable
            key={option.value}
            onPress={() => onChange(option.value)}
            accessibilityRole="tab"
            accessibilityState={{ selected }}
            accessibilityLabel={option.label}
            style={({ pressed }) => [
              styles.segment,
              selected ? styles.segmentSelected : styles.segmentIdle,
              pressed && styles.pressed,
            ]}
          >
            <Txt
              variant="bodyStrong"
              style={selected ? styles.labelSelected : styles.labelIdle}
              numberOfLines={1}
            >
              {option.label}
            </Txt>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  group: { flexDirection: 'row', gap: space.sm },
  segment: {
    flex: 1,
    minHeight: minTouchTarget,
    borderRadius: radius.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: space.sm,
  },
  segmentIdle: { backgroundColor: color.surface, borderColor: color.border },
  segmentSelected: { backgroundColor: color.surfaceSoft, borderColor: color.primary },
  labelIdle: { color: color.textSecondary, fontWeight: '400' },
  labelSelected: { color: color.primaryDeep, fontWeight: '600' },
  pressed: { opacity: 0.78 },
});
