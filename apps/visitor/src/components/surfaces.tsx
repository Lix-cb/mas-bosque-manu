import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { color, elevation, radius, space } from '@/constants/theme';

/** White card with a 12 px radius and a soft border. */
export function Card({
  children,
  style,
  tone = 'surface',
}: {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  tone?: 'surface' | 'soft' | 'plain';
}) {
  return (
    <View
      style={[
        styles.card,
        tone === 'surface' && styles.cardSurface,
        tone === 'soft' && styles.cardSoft,
        tone === 'plain' && styles.cardPlain,
        style,
      ]}
    >
      {children}
    </View>
  );
}

/** 1 px divider used inside list cards. */
export function Divider({ style }: { style?: StyleProp<ViewStyle> }) {
  return <View style={[styles.divider, style]} />;
}

const styles = StyleSheet.create({
  card: { borderRadius: radius.md, padding: space.md },
  cardSurface: {
    backgroundColor: color.surface,
    borderWidth: 1,
    borderColor: color.border,
    ...elevation.card,
  },
  cardSoft: { backgroundColor: color.surfaceSoft },
  cardPlain: { backgroundColor: 'transparent', padding: 0 },
  divider: { height: 1, backgroundColor: color.border },
});
