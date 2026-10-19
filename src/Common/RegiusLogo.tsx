import React from 'react';
import { Text, StyleSheet, TextStyle, StyleProp, View } from 'react-native';
import { Fonts } from '../Theme/fonts';
import { Colors } from '../Assets/StyleUtilities/Colors';

export type RegiusLogoSize = 'sm' | 'md' | 'lg' | 'xl';
export type RegiusLogoVariant = 'default' | 'dark' | 'light' | 'gold' | 'muted';

export interface RegiusLogoProps {
  size?: RegiusLogoSize | number;
  variant?: RegiusLogoVariant;
  style?: StyleProp<TextStyle>;
  accessibilityLabel?: string;
}

const SIZE_MAP: Record<
  RegiusLogoSize,
  { fontSize: number; lineHeight: number; letterSpacing: number }
> = {
  sm: { fontSize: 18, lineHeight: 22, letterSpacing: 0.4 },
  md: { fontSize: 24, lineHeight: 28, letterSpacing: 0.5 },
  lg: { fontSize: 30, lineHeight: 36, letterSpacing: 0.7 },
  xl: { fontSize: 36, lineHeight: 44, letterSpacing: 0.9 },
};

const VARIANT_COLOR_MAP: Record<RegiusLogoVariant, string> = {
  default: '#1B1C19',
  dark: Colors.MidnightCharcoal,
  light: Colors.DefaultWhite,
  gold: '#B38F48',
  muted: Colors.SlateGraphiteText,
};

export const RegiusLogo: React.FC<RegiusLogoProps> = ({
  size = 'md',
  variant = 'default',
  style,
  accessibilityLabel = 'Regius',
}) => {
  const sizeConfig =
    typeof size === 'number'
      ? {
          fontSize: size,
          lineHeight: Math.round(size * 1.2),
          letterSpacing: 0.5,
        }
      : SIZE_MAP[size] || SIZE_MAP.md;

  const color = VARIANT_COLOR_MAP[variant] || VARIANT_COLOR_MAP.default;

  return (
    <View style={styles.container} pointerEvents="box-none">
      <Text
        accessibilityRole="header"
        accessibilityLabel={accessibilityLabel}
        style={[
          styles.logoText,
          {
            fontSize: sizeConfig.fontSize,
            lineHeight: sizeConfig.lineHeight,
            letterSpacing: sizeConfig.letterSpacing,
            color,
          },
          style,
        ]}
      >
        Regius
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  logoText: {
    fontFamily: Fonts.ranade.bold,
    fontWeight: '700',
    includeFontPadding: false,
  },
});

export default RegiusLogo;
