import React, { useState, useCallback } from 'react';
import { StyleSheet, View, Dimensions, LayoutChangeEvent } from 'react-native';
import Svg, {
  Defs,
  LinearGradient,
  RadialGradient,
  Stop,
  Rect,
  Circle,
  Path,
  G,
} from 'react-native-svg';
import { useTheme } from '../../../Theme/ThemeContext';
import { Colors, withAlpha } from '../../../Assets/StyleUtilities/Colors';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export interface HabitDetailsBackgroundSvgProps {
  accentColor?: string;
  width?: number;
  height?: number;
}

/**
 * Luxury ambient background canvas for HabitDetailsScreen.
 * Provides artisanal physical notebook textures, radiant category/streak auras,
 * and celestial linework behind screen content.
 */
export const HabitDetailsBackgroundSvg: React.FC<HabitDetailsBackgroundSvgProps> =
  React.memo(
    ({
      accentColor = Colors.LavenderPurple,
      width: propWidth,
      height: propHeight,
    }) => {
      const { isDarkMode, Colors: themeColors } = useTheme();
      const [dimensions, setDimensions] = useState<{
        width: number;
        height: number;
      }>({
        width: propWidth || SCREEN_WIDTH,
        height: propHeight || SCREEN_HEIGHT,
      });

      const handleLayout = useCallback((e: LayoutChangeEvent) => {
        const { width, height } = e.nativeEvent.layout;
        if (width > 0 && height > 0) {
          setDimensions(prev => {
            if (
              Math.abs(prev.width - width) < 1 &&
              Math.abs(prev.height - height) < 1
            ) {
              return prev;
            }
            return { width, height };
          });
        }
      }, []);

      const W = Math.round(propWidth || dimensions.width);
      const H = Math.round(propHeight || dimensions.height);

      return (
        <View
          style={StyleSheet.absoluteFill}
          pointerEvents="none"
          onLayout={handleLayout}
        >
          <Svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} fill="none">
            <Defs>
              {/* Canvas Sheen */}
              <LinearGradient
                id="detailsBgSheen"
                x1="0"
                y1="0"
                x2="0"
                y2="100%"
              >
                <Stop
                  offset="0%"
                  stopColor={
                    isDarkMode
                      ? Colors.DetailDarkSectionBg
                      : Colors.SvgCreamHighlight
                  }
                  stopOpacity={0.98}
                />
                <Stop
                  offset="35%"
                  stopColor={
                    isDarkMode
                      ? themeColors.Background || Colors.DarkBackground
                      : Colors.WarmParchment
                  }
                  stopOpacity={isDarkMode ? 0.99 : 0.96}
                />
                <Stop
                  offset="70%"
                  stopColor={
                    isDarkMode
                      ? Colors.SvgCanvasAbyssMid
                      : Colors.KeepsakeLightBottom
                  }
                  stopOpacity={isDarkMode ? 0.99 : 0.95}
                />
                <Stop
                  offset="100%"
                  stopColor={
                    isDarkMode
                      ? Colors.SvgCanvasAbyss
                      : Colors.SvgDetailsParchment
                  }
                  stopOpacity={isDarkMode ? 1 : 0.98}
                />
              </LinearGradient>

              {/* Category Accent Aura (Top Right) */}
              <RadialGradient
                id="detailsAccentGlow"
                cx="85%"
                cy="12%"
                rx="60%"
                ry="50%"
              >
                <Stop
                  offset="0%"
                  stopColor={accentColor}
                  stopOpacity={isDarkMode ? 0.22 : 0.16}
                />
                <Stop
                  offset="60%"
                  stopColor={accentColor}
                  stopOpacity={isDarkMode ? 0.05 : 0.03}
                />
                <Stop offset="100%" stopColor={Colors.PureBlack} stopOpacity={0} />
              </RadialGradient>

              {/* Streak Amber Glow (Top Left) */}
              <RadialGradient
                id="detailsStreakGlow"
                cx="15%"
                cy="25%"
                rx="55%"
                ry="45%"
              >
                <Stop
                  offset="0%"
                  stopColor={Colors.AccentAmber}
                  stopOpacity={isDarkMode ? 0.16 : 0.11}
                />
                <Stop
                  offset="55%"
                  stopColor={Colors.AccentAmber}
                  stopOpacity={isDarkMode ? 0.04 : 0.02}
                />
                <Stop offset="100%" stopColor={Colors.PureBlack} stopOpacity={0} />
              </RadialGradient>

              {/* Mid-Canvas Violet Ambient Aura */}
              <RadialGradient
                id="detailsMidAura"
                cx="50%"
                cy="65%"
                rx="65%"
                ry="40%"
              >
                <Stop
                  offset="0%"
                  stopColor={Colors.LavenderPurple}
                  stopOpacity={isDarkMode ? 0.12 : 0.08}
                />
                <Stop offset="100%" stopColor={Colors.PureBlack} stopOpacity={0} />
              </RadialGradient>
            </Defs>

            <Rect width={W} height={H} fill="url(#detailsBgSheen)" />
            <Rect width={W} height={H} fill="url(#detailsAccentGlow)" />
            <Rect width={W} height={H} fill="url(#detailsStreakGlow)" />
            <Rect width={W} height={H} fill="url(#detailsMidAura)" />

            {/* Artisanal Celestial Linework & Rings */}
            <G opacity={isDarkMode ? 0.35 : 0.45}>
              {/* Top Right Orbital Rings */}
              <Circle
                cx={W - 40}
                cy={110}
                r={90}
                stroke={
                  isDarkMode
                    ? withAlpha(Colors.PureWhite, 0.07)
                    : withAlpha(Colors.LavenderPurple, 0.18)
                }
                strokeWidth={1}
                strokeDasharray="4 6"
                fill="none"
              />
              <Circle
                cx={W - 40}
                cy={110}
                r={140}
                stroke={
                  isDarkMode
                    ? withAlpha(Colors.PureWhite, 0.04)
                    : withAlpha(Colors.LavenderPurple, 0.1)
                }
                strokeWidth={1}
                fill="none"
              />

              {/* Mid-Canvas Subtle Guilloche Waves */}
              <Path
                d={`M -20 ${H * 0.45} Q ${W * 0.25} ${H * 0.42}, ${W * 0.5} ${
                  H * 0.46
                } T ${W + 20} ${H * 0.44}`}
                stroke={
                  isDarkMode
                    ? withAlpha(Colors.PureWhite, 0.05)
                    : withAlpha(Colors.LavenderPurple, 0.12)
                }
                strokeWidth={1}
                fill="none"
              />
              <Path
                d={`M -20 ${H * 0.47} Q ${W * 0.25} ${H * 0.44}, ${W * 0.5} ${
                  H * 0.48
                } T ${W + 20} ${H * 0.46}`}
                stroke={
                  isDarkMode
                    ? withAlpha(Colors.PureWhite, 0.03)
                    : withAlpha(Colors.LavenderPurple, 0.08)
                }
                strokeWidth={0.8}
                strokeDasharray="3 5"
                fill="none"
              />

              {/* Micro Sparkle Constellation Marks */}
              <Circle
                cx={W * 0.18}
                cy={170}
                r={1.8}
                fill={
                  isDarkMode
                    ? Colors.StreakFlameOrangeTop
                    : Colors.EventTextAccent
                }
                opacity={0.6}
              />
              <Circle
                cx={W * 0.82}
                cy={260}
                r={1.5}
                fill={isDarkMode ? Colors.PureWhite : accentColor}
                opacity={0.5}
              />
              <Circle
                cx={W * 0.12}
                cy={H * 0.72}
                r={1.4}
                fill={isDarkMode ? Colors.PureWhite : Colors.LavenderPurple}
                opacity={0.4}
              />
              <Circle
                cx={W * 0.88}
                cy={H * 0.82}
                r={1.6}
                fill={
                  isDarkMode ? Colors.StreakFlameOrangeTop : Colors.AccentAmber
                }
                opacity={0.5}
              />
            </G>
          </Svg>
        </View>
      );
    },
  );

export default HabitDetailsBackgroundSvg;
