import { Feather } from '@expo/vector-icons';
import { router, usePathname } from 'expo-router';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { IconButton } from '@/components/buttons';
import { Txt } from '@/components/typography';
import { color, iconSize, minTouchTarget, radius, screenPadding, space } from '@/constants/theme';

/**
 * Amber "academic prototype" strip shown above every visitor screen.
 * Tapping it opens the demo scenarios menu (`/demo`), so alternative states can be
 * reached without touching the code (see ADR-007 in `docs/DECISIONS.md`).
 */
export function DemoNoticeBar() {
  const pathname = usePathname();
  if (pathname === '/demo') return null;
  return (
    <Pressable
      onPress={() => router.push('/demo')}
      accessibilityRole="button"
      accessibilityLabel="Prototipo académico. No envía alertas reales."
      accessibilityHint="Abre el menú de escenarios de demostración"
      style={({ pressed }) => [styles.demoBar, pressed && styles.pressed]}
    >
      <Txt variant="caption" style={styles.demoBarText}>
        Prototipo académico · No envía alertas reales
      </Txt>
    </Pressable>
  );
}

/**
 * Header with a back arrow and a title (V02–V14).
 * When there is no history to go back to, it replaces the route with `backTo`.
 */
export function TopBar({
  title,
  backTo,
  showBack = true,
}: {
  title: string;
  backTo?: Parameters<typeof router.replace>[0];
  showBack?: boolean;
}) {
  const goBack = () => {
    if (router.canGoBack()) router.back();
    else if (backTo) router.replace(backTo);
  };

  return (
    <View style={styles.topBar}>
      {showBack ? (
        <IconButton onPress={goBack} accessibilityLabel="Volver" style={styles.backButton}>
          <Feather name="arrow-left" size={iconSize.md} color={color.primary} />
        </IconButton>
      ) : (
        <View style={styles.backSpacer} />
      )}
      <Txt variant="section" style={styles.topBarTitle} numberOfLines={1}>
        {title}
      </Txt>
    </View>
  );
}

/** Brand header used in V01 and V04: green shield plus "Más Bosque / MANU". */
export function BrandHeader() {
  return (
    <View style={styles.brand}>
      <View style={styles.brandMark}>
        <Feather name="shield" size={18} color={color.textOnPrimary} />
      </View>
      <View>
        <Txt variant="subtitle" style={styles.brandName}>
          Más Bosque
        </Txt>
        <Txt variant="overline" tone="textSecondary">
          MANU
        </Txt>
      </View>
    </View>
  );
}

/**
 * Screen container: safe area, demo strip and vertical scroll.
 * Uses the 24 px side margin from the mobile grid.
 */
export function Screen({
  children,
  scroll = true,
  contentStyle,
  footer,
  padded = true,
}: {
  children: React.ReactNode;
  scroll?: boolean;
  contentStyle?: StyleProp<ViewStyle>;
  footer?: React.ReactNode;
  padded?: boolean;
}) {
  const insets = useSafeAreaInsets();
  const padding = padded ? screenPadding : 0;

  const body = scroll ? (
    <ScrollView
      style={styles.flex}
      contentContainerStyle={[
        { paddingHorizontal: padding, paddingBottom: space.xl + insets.bottom },
        contentStyle,
      ]}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      {children}
    </ScrollView>
  ) : (
    <View style={[styles.flex, { paddingHorizontal: padding }, contentStyle]}>{children}</View>
  );

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <DemoNoticeBar />
      {body}
      {footer}
    </View>
  );
}

/** Small status chip used in V04 (GPS and connectivity). */
export function StatusChip({
  label,
  tone,
}: {
  label: string;
  tone: 'success' | 'info' | 'warning';
}) {
  const palette = {
    success: { bg: color.successSurface, fg: color.successText },
    info: { bg: color.infoSurface, fg: color.infoText },
    warning: { bg: color.warningSurface, fg: color.warningText },
  }[tone];
  return (
    <View style={[styles.chip, { backgroundColor: palette.bg }]}>
      <View style={[styles.chipDot, { backgroundColor: palette.fg }]} />
      <Txt variant="caption" style={{ color: palette.fg, fontWeight: '600' }}>
        {label}
      </Txt>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  screen: { flex: 1, backgroundColor: color.background },
  demoBar: {
    backgroundColor: color.warningSurface,
    paddingVertical: 7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  demoBarText: { color: color.warningText },
  pressed: { opacity: 0.75 },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
    minHeight: minTouchTarget,
    marginTop: space.sm,
    marginBottom: space.md,
  },
  backButton: { marginLeft: -12 },
  backSpacer: { width: 0 },
  topBarTitle: { flex: 1 },
  brand: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: space.md },
  brandMark: {
    width: 34,
    height: 34,
    borderRadius: radius.sm,
    backgroundColor: color.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandName: { color: color.textPrimary },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: radius.pill,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  chipDot: { width: 6, height: 6, borderRadius: 3 },
});
