import { Feather } from '@expo/vector-icons';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type TextProps,
  type TextStyle,
  type ViewStyle,
} from 'react-native';

import { color, controlHeight, elevation, iconSize, minTouchTarget, radius, space, typography } from '@/constants/theme';

type Variant = keyof typeof typography;

/** Text with the app's type scale. Supporting text defaults to the secondary color. */
export function Txt({
  variant = 'body',
  tone,
  center,
  style,
  ...rest
}: TextProps & {
  variant?: Variant;
  tone?: keyof typeof color;
  center?: boolean;
  style?: StyleProp<TextStyle>;
}) {
  const fallback =
    variant === 'support' || variant === 'caption' ? color.textSecondary : color.textBody;
  return (
    <Text
      {...rest}
      style={[
        typography[variant],
        { color: tone ? color[tone] : fallback },
        center && { textAlign: 'center' },
        style,
      ]}
    />
  );
}

type ButtonKind = 'primary' | 'secondary' | 'danger' | 'ghost';

/** Button with an optional hint that explains why it is disabled. */
export function Button({
  label,
  onPress,
  kind = 'primary',
  disabled = false,
  disabledHint,
  accessibilityHint,
  fullWidth = true,
  style,
}: {
  label: string;
  onPress?: () => void;
  kind?: ButtonKind;
  disabled?: boolean;
  disabledHint?: string;
  accessibilityHint?: string;
  fullWidth?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <View style={style}>
      <Pressable
        onPress={disabled ? undefined : onPress}
        disabled={disabled}
        accessibilityRole="button"
        accessibilityLabel={label}
        accessibilityHint={accessibilityHint}
        accessibilityState={{ disabled }}
        style={({ pressed }) => [
          styles.button,
          !fullWidth && styles.buttonInline,
          kind === 'primary' && styles.buttonPrimary,
          kind === 'secondary' && styles.buttonSecondary,
          kind === 'danger' && styles.buttonDanger,
          kind === 'ghost' && styles.buttonGhost,
          disabled && styles.buttonDisabled,
          pressed && !disabled && styles.pressed,
        ]}
      >
        <Txt
          variant="button"
          style={[
            kind === 'primary' || kind === 'danger' ? styles.buttonLabelSolid : styles.buttonLabelLight,
            disabled && styles.buttonLabelDisabled,
          ]}
        >
          {label}
        </Txt>
      </Pressable>
      {disabled && disabledHint ? (
        <Txt variant="support" tone="warning" style={styles.buttonHint}>
          {disabledHint}
        </Txt>
      ) : null}
    </View>
  );
}

export function Card({
  children,
  tone = 'surface',
  style,
}: {
  children: React.ReactNode;
  tone?: 'surface' | 'soft' | 'success' | 'danger' | 'warning';
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <View
      style={[
        styles.card,
        tone === 'surface' && styles.cardSurface,
        tone === 'soft' && styles.cardSoft,
        tone === 'success' && styles.cardSuccess,
        tone === 'danger' && styles.cardDanger,
        tone === 'warning' && styles.cardWarning,
        style,
      ]}
    >
      {children}
    </View>
  );
}

/** Row with an icon in a tinted square (R03, R05, R06, R07). */
export function IconRow({
  icon,
  title,
  detail,
  tone = 'info',
  style,
}: {
  icon: React.ComponentProps<typeof Feather>['name'];
  title: string;
  detail?: string;
  tone?: 'info' | 'success' | 'warning';
  style?: StyleProp<ViewStyle>;
}) {
  const palette = {
    info: { bg: color.surfaceSoft, fg: color.primary },
    success: { bg: color.successSurface, fg: color.success },
    warning: { bg: color.warningSurface, fg: color.warning },
  }[tone];

  return (
    <View style={[styles.iconRow, style]}>
      <View style={[styles.iconBadge, { backgroundColor: palette.bg }]}>
        <Feather name={icon} size={iconSize.sm} color={palette.fg} />
      </View>
      <View style={styles.iconRowText}>
        <Txt variant="bodyStrong" tone="textPrimary">
          {title}
        </Txt>
        {detail ? (
          <Txt variant="support" style={styles.iconRowDetail}>
            {detail}
          </Txt>
        ) : null}
      </View>
    </View>
  );
}

export type ChipTone = 'danger' | 'warning' | 'info' | 'success' | 'neutral';

const chipPalette: Record<ChipTone, { bg: string; fg: string }> = {
  danger: { bg: color.dangerSurface, fg: color.danger },
  warning: { bg: color.warningSurface, fg: color.warning },
  info: { bg: color.surfaceSoft, fg: color.primary },
  success: { bg: color.successSurface, fg: color.success },
  neutral: { bg: color.neutralSurface, fg: color.textSecondary },
};

/** Uppercase pill used for priority and status (ALTA, NUEVA, RECIBIDO…). */
export function Tag({ label, tone, style }: { label: string; tone: ChipTone; style?: StyleProp<ViewStyle> }) {
  const palette = chipPalette[tone];
  return (
    <View style={[styles.tag, { backgroundColor: palette.bg }, style]}>
      <Txt variant="overline" style={{ color: palette.fg }}>
        {label.toLocaleUpperCase('es-MX')}
      </Txt>
    </View>
  );
}

/** Inline notice. Icon and wording carry the meaning, not just the color. */
export function Notice({
  tone,
  children,
  style,
}: {
  tone: 'info' | 'warning' | 'danger' | 'success';
  children: string;
  style?: StyleProp<ViewStyle>;
}) {
  const palette = {
    info: { bg: color.surfaceSoft, border: color.infoBorder, fg: color.primaryDeep, icon: 'info' as const },
    warning: { bg: color.warningSurface, border: color.warningBorder, fg: color.warning, icon: 'alert-triangle' as const },
    danger: { bg: color.dangerSurface, border: color.dangerBorder, fg: color.danger, icon: 'alert-circle' as const },
    success: { bg: color.successSurface, border: color.successBorder, fg: color.success, icon: 'check-circle' as const },
  }[tone];

  return (
    <View
      accessibilityRole="alert"
      style={[styles.notice, { backgroundColor: palette.bg, borderColor: palette.border }, style]}
    >
      <Feather name={palette.icon} size={16} color={palette.fg} style={styles.noticeIcon} />
      <Txt variant="support" style={[styles.noticeText, { color: palette.fg }]}>
        {children}
      </Txt>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    height: controlHeight,
    minHeight: minTouchTarget,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: space.lg,
  },
  buttonInline: { alignSelf: 'flex-start' },
  buttonPrimary: { backgroundColor: color.primary },
  buttonSecondary: { backgroundColor: color.surface, borderWidth: 1, borderColor: color.border },
  buttonDanger: { backgroundColor: color.danger },
  buttonGhost: { backgroundColor: 'transparent' },
  buttonDisabled: { backgroundColor: color.border },
  buttonLabelSolid: { color: color.textOnDark },
  buttonLabelLight: { color: color.primary },
  buttonLabelDisabled: { color: color.textMuted },
  buttonHint: { marginTop: space.sm },
  pressed: { opacity: 0.78 },

  card: { borderRadius: radius.md, padding: space.md },
  cardSurface: { backgroundColor: color.surface, borderWidth: 1, borderColor: color.border, ...elevation.card },
  cardSoft: { backgroundColor: color.surfaceSoft },
  cardSuccess: { backgroundColor: color.successSurface },
  cardDanger: { backgroundColor: color.dangerSurface },
  cardWarning: { backgroundColor: color.warningSurface },

  iconRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, paddingVertical: 10 },
  iconBadge: {
    width: 36,
    height: 36,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconRowText: { flex: 1, paddingTop: 2 },
  iconRowDetail: { marginTop: 2 },

  tag: { borderRadius: radius.pill, paddingVertical: 5, paddingHorizontal: 10, alignSelf: 'flex-start' },

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
});
