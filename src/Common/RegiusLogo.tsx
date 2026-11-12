import React from 'react';
import { Text, StyleSheet, TextStyle, StyleProp, View } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { Fonts } from '../Theme/fonts';
import { Colors } from '../Assets/StyleUtilities/Colors';
import ResponsivePixels from '../Assets/StyleUtilities/ResponsivePixels';

export type RegiusLogoSize = 'sm' | 'md' | 'lg' | 'xl';
export type RegiusLogoVariant = 'default' | 'dark' | 'light' | 'gold' | 'muted';

export interface RegiusLogoProps {
  size?: RegiusLogoSize | number;
  variant?: RegiusLogoVariant;
  style?: StyleProp<TextStyle>;
  showEmblem?: boolean;
  showSparkle?: boolean;
  accessibilityLabel?: string;
}

interface VariantVisualConfig {
  textColor: string;
  emblemColor: string;
  diamondColor: string;
  starTipColor: string;
  sparkleColor: string;
}

const SIZE_MAP: Record<
  RegiusLogoSize,
  {
    fontSize: number;
    lineHeight: number;
    letterSpacing: number;
    emblemSize: number;
    sparkleSize: number;
    emblemGap: number;
  }
> = {
  sm: {
    fontSize: ResponsivePixels.size17,
    lineHeight: ResponsivePixels.size22,
    letterSpacing: ResponsivePixels.size0_5,
    emblemSize: ResponsivePixels.size18,
    sparkleSize: ResponsivePixels.size8,
    emblemGap: ResponsivePixels.size6,
  },
  md: {
    fontSize: ResponsivePixels.size22,
    lineHeight: ResponsivePixels.size26,
    letterSpacing: ResponsivePixels.size0_6,
    emblemSize: ResponsivePixels.size22,
    sparkleSize: ResponsivePixels.size9,
    emblemGap: ResponsivePixels.size7,
  },
  lg: {
    fontSize: ResponsivePixels.size28,
    lineHeight: ResponsivePixels.size34,
    letterSpacing: ResponsivePixels.size0_8,
    emblemSize: ResponsivePixels.size26,
    sparkleSize: ResponsivePixels.size11,
    emblemGap: ResponsivePixels.size8,
  },
  xl: {
    fontSize: ResponsivePixels.size36,
    lineHeight: ResponsivePixels.size44,
    letterSpacing: ResponsivePixels.size1,
    emblemSize: ResponsivePixels.size32,
    sparkleSize: ResponsivePixels.size13,
    emblemGap: ResponsivePixels.size10,
  },
};

const VARIANT_THEME_MAP: Record<RegiusLogoVariant, VariantVisualConfig> = {
  default: {
    textColor: Colors.RegiusInk,
    emblemColor: Colors.LavenderPurple,
    diamondColor: Colors.CreamBackground,
    starTipColor: Colors.AccentYellow,
    sparkleColor: Colors.AccentYellow,
  },
  dark: {
    textColor: Colors.MidnightCharcoal,
    emblemColor: Colors.LavenderPurple,
    diamondColor: Colors.PureWhite,
    starTipColor: Colors.AccentYellow,
    sparkleColor: Colors.AccentYellow,
  },
  light: {
    textColor: Colors.PureWhite,
    emblemColor: Colors.PureWhite,
    diamondColor: Colors.LavenderPurple,
    starTipColor: Colors.AccentYellow,
    sparkleColor: Colors.AccentYellow,
  },
  gold: {
    textColor: Colors.SovereignWarmGold,
    emblemColor: Colors.AccentYellow,
    diamondColor: Colors.CreamBackground,
    starTipColor: Colors.SovereignWarmGold,
    sparkleColor: Colors.AccentYellow,
  },
  muted: {
    textColor: Colors.SlateGraphiteText,
    emblemColor: Colors.SlateGraphiteText,
    diamondColor: Colors.PureWhite,
    starTipColor: Colors.LavenderPurple,
    sparkleColor: Colors.LavenderPurple,
  },
};

export const RegiusLogo: React.FC<RegiusLogoProps> = ({
  size = 'md',
  variant = 'default',
  showEmblem = true,
  showSparkle = true,
  style,
  accessibilityLabel = 'Regius',
}) => {
  const sizeConfig =
    typeof size === 'number'
      ? {
          fontSize: size,
          lineHeight: Math.round(size * 1.2),
          letterSpacing: ResponsivePixels.size0_6,
          emblemSize: Math.round(size * 0.95),
          sparkleSize: Math.round(size * 0.38),
          emblemGap: ResponsivePixels.size7,
        }
      : SIZE_MAP[size] || SIZE_MAP.md;

  const visualConfig = VARIANT_THEME_MAP[variant] || VARIANT_THEME_MAP.default;

  return (
    <View
      style={styles.container}
      pointerEvents="box-none"
      accessibilityRole="header"
      accessibilityLabel={accessibilityLabel}
    >
      {showEmblem && (
        <View
          style={[styles.emblemWrap, { marginRight: sizeConfig.emblemGap }]}
        >
          <Svg
            width={sizeConfig.emblemSize}
            height={sizeConfig.emblemSize}
            viewBox="0 0 24 24"
            fill="none"
          >
            <Path
              d="M3 18L4.6 9L9.2 13L12 5.5L14.8 13L19.4 9L21 18H3Z"
              fill={visualConfig.emblemColor}
              stroke={visualConfig.emblemColor}
              strokeWidth={1}
              strokeLinejoin="round"
            />
            <Path
              d="M12 9.6L13.8 12.3L12 15L10.2 12.3Z"
              fill={visualConfig.diamondColor}
            />
            <Path
              d="M3 19.8H21"
              stroke={visualConfig.emblemColor}
              strokeWidth={2.2}
              strokeLinecap="round"
            />
            <Circle cx={12} cy={3.8} r={1.6} fill={visualConfig.starTipColor} />
            <Circle cx={4.6} cy={7.8} r={1.2} fill={visualConfig.emblemColor} />
            <Circle
              cx={19.4}
              cy={7.8}
              r={1.2}
              fill={visualConfig.emblemColor}
            />
          </Svg>
        </View>
      )}
      <View style={styles.textWrap}>
        <Text
          style={[
            styles.logoText,
            {
              fontSize: sizeConfig.fontSize,
              lineHeight: sizeConfig.lineHeight,
              letterSpacing: sizeConfig.letterSpacing,
              color: visualConfig.textColor,
            },
            style,
          ]}
        >
          Regius
        </Text>

        {showSparkle && (
          <View
            style={[
              styles.sparkleWrap,
              {
                width: sizeConfig.sparkleSize,
                height: sizeConfig.sparkleSize,
              },
            ]}
          >
            <Svg
              width={sizeConfig.sparkleSize}
              height={sizeConfig.sparkleSize}
              viewBox="0 0 12 12"
              fill="none"
            >
              <Path
                d="M6 0L7.5 4.5L12 6L7.5 7.5L6 12L4.5 7.5L0 6L4.5 4.5Z"
                fill={visualConfig.sparkleColor}
              />
            </Svg>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  emblemWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  textWrap: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    position: 'relative',
  },
  logoText: {
    fontFamily: Fonts.transcity,
    includeFontPadding: false,
  },
  sparkleWrap: {
    marginLeft: ResponsivePixels.size3,
    marginTop: -ResponsivePixels.size2,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default RegiusLogo;
