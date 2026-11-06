import { Feather } from '@expo/vector-icons';
import type { ComponentProps } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { color, radius, typography } from '@/constants/theme';

/** Tab icon. The active tab gets a light blue pill behind the icon. */
export function TabBarIcon({
  name,
  focused,
}: {
  name: ComponentProps<typeof Feather>['name'];
  focused: boolean;
}) {
  return (
    <View style={[styles.pill, focused && styles.pillActive]}>
      <Feather name={name} size={21} color={focused ? color.primary : color.textSecondary} />
    </View>
  );
}

/**
 * Custom tab label. The default one sets `numberOfLines={1}`, which turns into
 * `text-overflow: ellipsis` on web and hides the whole word in narrow windows.
 */
export function TabBarLabel({ focused, children }: { focused: boolean; children: string }) {
  return (
    <Text
      allowFontScaling={false}
      style={[styles.label, { color: focused ? color.primary : color.textSecondary }]}
    >
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  label: {
    ...typography.caption,
    fontWeight: '600',
    lineHeight: 15,
    textAlign: 'center',
    includeFontPadding: false,
  },
  pill: {
    minWidth: 56,
    paddingVertical: 4,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillActive: { backgroundColor: color.surfaceSoft },
});
