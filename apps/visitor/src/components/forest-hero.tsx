import React from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import Svg, { Circle, Path, Rect } from 'react-native-svg';

import { radius } from '@/constants/theme';

/**
 * Cover illustration for V01. The design uses a flat vector scene rather than a
 * photo, so it is drawn with SVG shapes and needs no image assets.
 */
export function ForestHero({ height = 180, style }: { height?: number; style?: StyleProp<ViewStyle> }) {
  return (
    <View
      style={[styles.wrapper, { height }, style]}
      accessible
      accessibilityRole="image"
      accessibilityLabel="Ilustración de un bosque con senderos y coníferas"
    >
      <Svg width="100%" height="100%" viewBox="0 0 342 180" preserveAspectRatio="xMidYMid slice">
        <Rect x={0} y={0} width={342} height={180} fill="#DCEBDF" />
        <Circle cx={248} cy={44} r={26} fill="#F2D99A" />
        <Path d="M0 108 C 70 74, 150 118, 230 92 S 320 70, 342 84 V180 H0 Z" fill="#B9D3BC" />
        <Path d="M0 136 C 90 112, 180 150, 260 128 S 330 116, 342 122 V180 H0 Z" fill="#A6C7AB" />
        <Path d="M96 180 C 108 140, 150 128, 168 104 C 186 80, 214 78, 232 70" stroke="#E7F3EA" strokeWidth={12} fill="none" strokeLinecap="round" />
        {conifer(46, 128, 34, 62, '#1F6B48')}
        {conifer(84, 118, 28, 52, '#2C7D56')}
        {conifer(214, 136, 38, 68, '#17573A')}
        {conifer(258, 124, 30, 56, '#246F4C')}
        {conifer(298, 142, 24, 44, '#2C7D56')}
      </Svg>
    </View>
  );
}

/** Stylized conifer: three triangular tiers and a trunk. */
function conifer(cx: number, baseY: number, width: number, height: number, fill: string) {
  const half = width / 2;
  const tiers = [0, 1, 2].map((i) => {
    const top = baseY - height + (height / 3.4) * i;
    const spread = half * (0.56 + i * 0.22);
    const bottom = top + height / 2.4;
    return `M${cx} ${top} L${cx + spread} ${bottom} L${cx - spread} ${bottom} Z`;
  });
  return (
    <React.Fragment key={`${cx}-${baseY}`}>
      <Rect x={cx - 2.5} y={baseY - 10} width={5} height={12} fill="#6B5636" rx={1.5} />
      {tiers.map((d) => (
        <Path key={d} d={d} fill={fill} />
      ))}
    </React.Fragment>
  );
}

const styles = StyleSheet.create({
  wrapper: { borderRadius: radius.lg, overflow: 'hidden' },
});
