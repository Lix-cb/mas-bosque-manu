import { Feather } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, StyleSheet, TextInput, View, type StyleProp, type ViewStyle } from 'react-native';

import { Txt } from '@/components/typography';
import { color, iconSize, minTouchTarget, radius, space, typography } from '@/constants/theme';

/**
 * Text input with an always-visible label. Optional fields never block an SOS
 * request.
 */
export function FormField({
  label,
  value,
  onChangeText,
  placeholder,
  multiline = false,
  style,
}: {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
  multiline?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <View style={style}>
      <Txt variant="bodyStrong" style={styles.label}>
        {label}
      </Txt>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={color.textMuted}
        multiline={multiline}
        accessibilityLabel={label}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={[
          styles.input,
          multiline && styles.inputMultiline,
          focused && styles.inputFocused,
        ]}
      />
    </View>
  );
}

/** Select-like field that opens the local reference picker (V06). It behaves as a button. */
export function SelectField({
  label,
  valueLabel,
  placeholder,
  onPress,
  style,
}: {
  label: string;
  valueLabel?: string | null;
  placeholder: string;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <View style={style}>
      <Txt variant="bodyStrong" style={styles.label}>
        {label}
      </Txt>
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={`${label}. ${valueLabel ?? placeholder}`}
        accessibilityHint="Abre las referencias locales"
        style={({ pressed }) => [styles.input, styles.select, pressed && styles.pressed]}
      >
        <Txt variant="body" style={valueLabel ? styles.selectValue : styles.selectPlaceholder} numberOfLines={1}>
          {valueLabel ?? placeholder}
        </Txt>
        <Feather name="chevron-down" size={iconSize.sm} color={color.textSecondary} />
      </Pressable>
    </View>
  );
}

/** Search box for local data (V11). */
export function SearchInput({
  value,
  onChangeText,
  placeholder,
  label,
  style,
}: {
  value: string;
  onChangeText: (value: string) => void;
  placeholder: string;
  label?: string;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <View style={style}>
      {label ? (
        <Txt variant="bodyStrong" style={styles.label}>
          {label}
        </Txt>
      ) : null}
      <View style={styles.searchWrapper}>
        <Feather name="search" size={iconSize.sm} color={color.textSecondary} />
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={color.textMuted}
          accessibilityLabel={label ?? placeholder}
          style={styles.searchInput}
        />
        {value.length > 0 ? (
          <Pressable
            onPress={() => onChangeText('')}
            accessibilityRole="button"
            accessibilityLabel="Limpiar búsqueda"
            hitSlop={8}
          >
            <Feather name="x" size={iconSize.sm} color={color.textSecondary} />
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

/** Radio list option, used in V07 to pick a reference. */
export function RadioRow({
  label,
  detail,
  selected,
  onPress,
}: {
  label: string;
  detail?: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      accessibilityLabel={label}
      style={({ pressed }) => [
        styles.radioRow,
        selected ? styles.radioRowSelected : styles.radioRowIdle,
        pressed && styles.pressed,
      ]}
    >
      <View style={[styles.radioOuter, selected && styles.radioOuterSelected]}>
        {selected ? <View style={styles.radioInner} /> : null}
      </View>
      <View style={styles.radioText}>
        <Txt variant="bodyStrong" style={selected ? styles.radioLabelSelected : undefined}>
          {label}
        </Txt>
        {detail ? <Txt variant="support">{detail}</Txt> : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  label: { marginBottom: space.sm },
  input: {
    minHeight: minTouchTarget,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: color.border,
    backgroundColor: color.surface,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: color.textPrimary,
    ...typography.body,
  },
  inputMultiline: { minHeight: 84, textAlignVertical: 'top' },
  inputFocused: { borderColor: color.primary, borderWidth: 2 },
  select: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: space.sm },
  selectValue: { color: color.textPrimary, flex: 1 },
  selectPlaceholder: { color: color.textMuted, flex: 1 },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    minHeight: minTouchTarget,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: color.border,
    backgroundColor: color.surface,
    paddingHorizontal: 14,
  },
  searchInput: { flex: 1, color: color.textPrimary, paddingVertical: 12, ...typography.body },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    borderRadius: radius.md,
    borderWidth: 1,
    padding: 14,
    minHeight: minTouchTarget,
  },
  radioRowIdle: { backgroundColor: color.surface, borderColor: color.border },
  radioRowSelected: { backgroundColor: color.surfaceSoft, borderColor: color.surfaceSoft },
  radioOuter: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.5,
    borderColor: color.textSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  radioOuterSelected: { borderColor: color.primaryDeep },
  radioInner: { width: 9, height: 9, borderRadius: 5, backgroundColor: color.primaryDeep },
  radioText: { flex: 1, gap: 2 },
  radioLabelSelected: { color: color.primaryDeep },
  pressed: { opacity: 0.78 },
});
