import { Feather } from '@expo/vector-icons';
import type { ComponentProps } from 'react';
import { StyleSheet, Text } from 'react-native';

import { color, typography } from '@/constants/theme';

export function TabBarIcon({
  name,
  focused,
}: {
  name: ComponentProps<typeof Feather>['name'];
  focused: boolean;
}) {
  return <Feather name={name} size={22} color={focused ? color.primary : color.textSecondary} />;
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
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '600',
    textAlign: 'center',
    includeFontPadding: false,
  },
});
