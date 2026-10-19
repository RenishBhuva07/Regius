import React from 'react';
import { Text, StyleSheet, TextStyle, StyleProp, View } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { Fonts } from '../Theme/fonts';
import { Colors } from '../Assets/StyleUtilities/Colors';

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
    fontSize: 17,
    lineHeight: 22,
    letterSpacing: 0.5,
    emblemSize: 18,
    sparkleSize: 8,
    emblemGap: 6,
  },
  md: {
    fontSize: 22,
    lineHeight: 26,
    letterSpacing: 0.6,
    emblemSize: 22,
    sparkleSize: 9,
    emblemGap: 7,
  },
  lg: {
    fontSize: 28,
    lineHeight: 34,
    letterSpacing: 0.8,
    emblemSize: 26,
    sparkleSize: 11,
    emblemGap: 8,
  },
  xl: {
    fontSize: 36,
    lineHeight: 44,
    letterSpacing: 1.0,
    emblemSize: 32,
    sparkleSize: 13,
    emblemGap: 10,
  },
};

const VARIANT_THEME_MAP: Record<RegiusLogoVariant, VariantVisualConfig> = {
  default: {
    textColor: '#1B1C19',
    emblemColor: Colors.LavenderPurple,
    diamondColor: '#FFFCE3',
    starTipColor: '#F5C518',
    sparkleColor: '#F5C518',
  },
  dark: {
    textColor: Colors.MidnightCharcoal,
    emblemColor: Colors.LavenderPurple,
    diamondColor: Colors.DefaultWhite,
    starTipColor: '#F5C518',
    sparkleColor: '#F5C518',
  },
  light: {
    textColor: Colors.DefaultWhite,
    emblemColor: Colors.DefaultWhite,
    diamondColor: Colors.LavenderPurple,
    starTipColor: '#F5C518',
    sparkleColor: '#F5C518',
  },
  gold: {
    textColor: '#B38F48',
    emblemColor: '#F5C518',
    diamondColor: '#FFFCE3',
    starTipColor: '#B38F48',
    sparkleColor: '#F5C518',
  },
  muted: {
    textColor: Colors.SlateGraphiteText,
    emblemColor: Colors.SlateGraphiteText,
    diamondColor: '#FFFFFF',
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
          letterSpacing: 0.6,
          emblemSize: Math.round(size * 0.95),
          sparkleSize: Math.round(size * 0.38),
          emblemGap: 7,
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
      {/* ── Regal Architectural Crown Crest ── */}
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
            {/* Architectural Crown Body */}
            <Path
              d="M3 18L4.6 9L9.2 13L12 5.5L14.8 13L19.4 9L21 18H3Z"
              fill={visualConfig.emblemColor}
              stroke={visualConfig.emblemColor}
              strokeWidth={1}
              strokeLinejoin="round"
            />
            {/* Center Faceted Diamond Core Cutout */}
            <Path
              d="M12 9.6L13.8 12.3L12 15L10.2 12.3Z"
              fill={visualConfig.diamondColor}
            />
            {/* Royal Foundation Base Bar */}
            <Path
              d="M3 19.8H21"
              stroke={visualConfig.emblemColor}
              strokeWidth={2.2}
              strokeLinecap="round"
            />
            {/* Center Star Diamond Peak Jewel */}
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

      {/* ── Stylized Wordmark with Royal Sparkle Accent ── */}
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
    marginLeft: 3,
    marginTop: -2,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default RegiusLogo;
