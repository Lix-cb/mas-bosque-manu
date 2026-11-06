import { Feather } from '@expo/vector-icons';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { Txt } from '@/components/typography';
import { color, radius, space } from '@/constants/theme';

export type Tone = 'info' | 'success' | 'warning' | 'danger' | 'neutral';

const toneTokens: Record<Tone, { surface: string; border: string; text: string }> = {
  info: { surface: color.infoSurface, border: color.infoBorder, text: color.infoText },
  success: { surface: color.successSurface, border: color.successBorder, text: color.successText },
  warning: { surface: color.warningSurface, border: color.warningBorder, text: color.warningText },
  danger: { surface: color.dangerSurface, border: color.dangerBorder, text: color.dangerText },
  neutral: { surface: color.neutralSurface, border: color.border, text: color.neutralText },
};

const toneIcon: Record<Tone, React.ComponentProps<typeof Feather>['name']> = {
  info: 'info',
  success: 'check-circle',
  warning: 'alert-triangle',
  danger: 'alert-circle',
  neutral: 'circle',
};

/**
 * Inline notice. The icon and the wording carry the meaning too, so the message
 * does not depend on color alone.
 */
export function Notice({
  tone,
  children,
  style,
}: {
  tone: Tone;
  children: string;
  style?: StyleProp<ViewStyle>;
}) {
  const t = toneTokens[tone];
  return (
    <View
      accessibilityRole="alert"
      style={[styles.notice, { backgroundColor: t.surface, borderColor: t.border }, style]}
    >
      <Feather name={toneIcon[tone]} size={16} color={t.text} style={styles.noticeIcon} />
      <Txt variant="support" style={[styles.noticeText, { color: t.text }]}>
        {children}
      </Txt>
    </View>
  );
}

/** Small pill with a colored dot and a label. */
export function Badge({
  label,
  tone = 'neutral',
  style,
}: {
  label: string;
  tone?: Tone;
  style?: StyleProp<ViewStyle>;
}) {
  const t = toneTokens[tone];
  return (
    <View style={[styles.badge, { backgroundColor: t.surface }, style]}>
      <View style={[styles.dot, { backgroundColor: t.text }]} />
      <Txt variant="caption" style={{ color: t.text, fontWeight: '600' }}>
        {label}
      </Txt>
    </View>
  );
}

/** Static progress bar with a numeric label (V14-b). */
export function ProgressBar({ percent, label }: { percent: number; label: string }) {
  const clamped = Math.max(0, Math.min(100, percent));
  return (
    <View>
      <Badge label={label} tone="info" style={styles.progressBadge} />
      <View
        accessibilityRole="progressbar"
        accessibilityValue={{ now: clamped, min: 0, max: 100 }}
        style={styles.track}
      >
        <View style={[styles.fill, { width: `${clamped}%` }]} />
      </View>
    </View>
  );
}

/** Static loading placeholder (V13-b). The design asks for no animation here. */
export function SkeletonCard() {
  return (
    <View style={styles.skeletonCard}>
      <View style={[styles.skeletonLine, styles.skeletonAccent, { width: '48%' }]} />
      <View style={[styles.skeletonLine, { width: '100%' }]} />
      <View style={[styles.skeletonLine, { width: '72%' }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  notice: {
    flexDirection: 'row',
    gap: space.sm,
    borderRadius: radius.md,
    borderWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  noticeIcon: { marginTop: 1 },
  noticeText: { flex: 1 },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 6,
    borderRadius: radius.pill,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  dot: { width: 6, height: 6, borderRadius: 3 },
  progressBadge: { marginBottom: space.sm },
  track: {
    height: 8,
    borderRadius: 4,
    backgroundColor: color.border,
    overflow: 'hidden',
  },
  fill: { height: 8, borderRadius: 4, backgroundColor: color.primary },
  skeletonCard: {
    backgroundColor: color.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: color.border,
    padding: space.md,
    gap: 10,
  },
  skeletonLine: { height: 10, borderRadius: 5, backgroundColor: color.border },
  skeletonAccent: { backgroundColor: color.successBorder },
});
