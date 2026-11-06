import { Text, type StyleProp, type TextProps, type TextStyle } from 'react-native';

import { color, typography } from '@/constants/theme';

type Variant = keyof typeof typography;

type TxtProps = TextProps & {
  variant?: Variant;
  /** Color token. Defaults to `textPrimary`, or `textSecondary` for supporting text. */
  tone?: keyof typeof color;
  center?: boolean;
  style?: StyleProp<TextStyle>;
};

const secondaryByDefault: Variant[] = ['support', 'caption'];

export function Txt({ variant = 'body', tone, center, style, ...rest }: TxtProps) {
  const fallback = secondaryByDefault.includes(variant) ? color.textSecondary : color.textPrimary;
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
