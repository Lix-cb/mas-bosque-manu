import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';

import { Txt } from '@/components/ui';
import { color, radius, screenPadding, space } from '@/constants/theme';

/**
 * Navy operations header used in R01–R09: brand, bell, profile, screen title and
 * the DEMO pill (which is part of the original design).
 * Set `showActions={false}` before sign-in: the bell and profile icons stay visible
 * but are decorative, since the profile screen needs a session.
 */
export function OperationHeader({ title, showActions = true }: { title: string; showActions?: boolean }) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.header, { paddingTop: insets.top + space.sm }]}>
      <View style={styles.headerTop}>
        <View style={styles.brandMark}>
          <ShieldGlyph />
        </View>
        <View style={styles.brandText}>
          <Txt variant="overline" style={styles.brandName}>
            MAS BOSQUE MANU
          </Txt>
          <Txt variant="caption" style={styles.brandRole}>
            CENTRAL DE RESCATE
          </Txt>
        </View>
        <HeaderAction icon="bell" label="Notificaciones de demostración" enabled={showActions} />
        <HeaderAction icon="user" label="Perfil del rescatista" enabled={showActions} />
      </View>

      <View style={styles.headerBottom}>
        <Txt variant="display" style={styles.headerTitle} numberOfLines={1}>
          {title}
        </Txt>
        <View style={styles.demoPill}>
          <Txt variant="overline" style={styles.demoPillText}>
            DEMO
          </Txt>
        </View>
      </View>
    </View>
  );
}

/** Header icon that opens the Perfil tab, or a plain icon when `enabled` is false. */
function HeaderAction({
  icon,
  label,
  enabled,
}: {
  icon: 'bell' | 'user';
  label: string;
  enabled: boolean;
}) {
  const glyph = <Feather name={icon} size={20} color={color.textOnDark} />;

  if (!enabled) {
    return (
      <View style={styles.headerAction} importantForAccessibility="no-hide-descendants" accessibilityElementsHidden>
        {glyph}
      </View>
    );
  }

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={() => router.push('/(tabs)/perfil')}
      hitSlop={8}
      style={({ pressed }) => [styles.headerAction, pressed && styles.pressed]}
    >
      {glyph}
    </Pressable>
  );
}

/** Screen container with the operations header and a scroll view. */
export function OperationScreen({
  title,
  children,
  contentStyle,
  showActions = true,
}: {
  title: string;
  children: React.ReactNode;
  contentStyle?: StyleProp<ViewStyle>;
  showActions?: boolean;
}) {
  const insets = useSafeAreaInsets();
  return (
    <View style={styles.screen}>
      <OperationHeader title={title} showActions={showActions} />
      <ScrollView
        style={styles.flex}
        contentContainerStyle={[styles.content, { paddingBottom: space.xl + insets.bottom }, contentStyle]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ScrollView>
    </View>
  );
}

/** Shield with a check mark (app logo). */
export function ShieldGlyph({ size = 20, tint = color.textOnDark }: { size?: number; tint?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M12 2.5 4.5 5.5v6c0 4.5 3.2 8.6 7.5 10 4.3-1.4 7.5-5.5 7.5-10v-6L12 2.5Z"
        stroke={tint}
        strokeWidth={1.7}
        fill="none"
        strokeLinejoin="round"
      />
      <Path d="M8.8 11.9l2.2 2.2 4.2-4.3" stroke={tint} strokeWidth={1.7} strokeLinecap="round" fill="none" />
    </Svg>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  screen: { flex: 1, backgroundColor: color.background },
  content: { paddingHorizontal: screenPadding, paddingTop: space.md },
  header: {
    backgroundColor: color.headerNavy,
    paddingHorizontal: screenPadding,
    paddingBottom: space.md,
  },
  headerTop: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  brandMark: {
    width: 32,
    height: 32,
    borderRadius: radius.sm,
    backgroundColor: color.headerCard,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandText: { flex: 1 },
  brandName: { color: color.textOnDark },
  brandRole: { color: color.textOnDarkMuted, letterSpacing: 0.4 },
  headerAction: {
    minWidth: 36,
    minHeight: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerBottom: { flexDirection: 'row', alignItems: 'center', gap: space.sm, marginTop: space.md },
  headerTitle: { flex: 1, color: color.textOnDark },
  demoPill: {
    backgroundColor: color.headerCard,
    borderRadius: radius.sm,
    paddingVertical: 6,
    paddingHorizontal: 12,
    minHeight: 28,
    justifyContent: 'center',
  },
  demoPillText: { color: color.textOnDark },
  pressed: { opacity: 0.7 },
});
