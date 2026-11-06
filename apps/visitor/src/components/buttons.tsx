import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { Txt } from '@/components/typography';
import { color, controlHeight, minTouchTarget, radius, space } from '@/constants/theme';

type Kind = 'primary' | 'secondary' | 'danger' | 'ghost';

type ButtonProps = {
  label: string;
  onPress?: () => void;
  kind?: Kind;
  disabled?: boolean;
  /** Explains why the button is disabled (pattern used in V14-a). */
  disabledHint?: string;
  accessibilityHint?: string;
  style?: StyleProp<ViewStyle>;
};

/**
 * 52 px button with a 12 px radius. Kinds: solid green primary, outlined white
 * secondary, red danger (emergency) and a borderless ghost variant.
 */
export function Button({
  label,
  onPress,
  kind = 'primary',
  disabled = false,
  disabledHint,
  accessibilityHint,
  style,
}: ButtonProps) {
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
          styles.base,
          kind === 'primary' && styles.primary,
          kind === 'secondary' && styles.secondary,
          kind === 'danger' && styles.danger,
          kind === 'ghost' && styles.ghost,
          disabled && styles.disabled,
          pressed && !disabled && styles.pressed,
        ]}
      >
        <Txt
          variant="button"
          style={[
            kind === 'primary' || kind === 'danger' ? styles.labelOnSolid : styles.labelOnLight,
            disabled && styles.labelDisabled,
          ]}
        >
          {label}
        </Txt>
      </Pressable>
      {disabled && disabledHint ? (
        <Txt variant="support" tone="warningText" style={styles.hint}>
          {disabledHint}
        </Txt>
      ) : null}
    </View>
  );
}

/** Icon-only button. The accessibility label is required. */
export function IconButton({
  onPress,
  accessibilityLabel,
  children,
  style,
}: {
  onPress?: () => void;
  accessibilityLabel: string;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      hitSlop={8}
      style={({ pressed }) => [styles.iconButton, pressed && styles.pressed, style]}
    >
      {children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    height: controlHeight,
    minHeight: minTouchTarget,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: space.md,
  },
  primary: { backgroundColor: color.primary },
  secondary: { backgroundColor: color.surface, borderWidth: 1, borderColor: color.border },
  danger: { backgroundColor: color.danger },
  ghost: { backgroundColor: 'transparent' },
  disabled: { backgroundColor: color.border, borderWidth: 0 },
  pressed: { opacity: 0.78 },
  labelOnSolid: { color: color.textOnPrimary },
  labelOnLight: { color: color.primary },
  labelDisabled: { color: color.textMuted },
  hint: { marginTop: space.sm },
  iconButton: {
    minWidth: minTouchTarget,
    minHeight: minTouchTarget,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
