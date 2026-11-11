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
import Colors from '../../../Assets/StyleUtilities/Colors';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export interface ReminderDetailsBackgroundSvgProps {
  accentColor?: string;
  width?: number;
  height?: number;
}

/**
 * Luxury ambient background canvas for ReminderDetailsScreen.
 * Provides artisanal warm stationery canvas textures, radiant alert auras,
 * and concentric chime waves behind screen content.
 */
export const ReminderDetailsBackgroundSvg: React.FC<ReminderDetailsBackgroundSvgProps> =
  React.memo(
    ({
      accentColor = Colors.AccentGreen,
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
              {/* Canvas Sheen Gradient */}
              <LinearGradient
                id="reminderDetailsBgSheen"
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

              {/* Dynamic Category Accent Aura (Top Right) */}
              <RadialGradient
                id="reminderDetailsAccentGlow"
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

              {/* Soft Mint Alert Glow (Top Left) */}
              <RadialGradient
                id="reminderDetailsMintGlow"
                cx="15%"
                cy="28%"
                rx="55%"
                ry="45%"
              >
                <Stop
                  offset="0%"
                  stopColor={Colors.GreenGracious}
                  stopOpacity={isDarkMode ? 0.14 : 0.09}
                />
                <Stop
                  offset="65%"
                  stopColor={Colors.AccentGreen}
                  stopOpacity={isDarkMode ? 0.03 : 0.015}
                />
                <Stop offset="100%" stopColor={Colors.PureBlack} stopOpacity={0} />
              </RadialGradient>

              {/* Bottom Grounding Aura */}
              <RadialGradient
                id="reminderDetailsBottomAura"
                cx="50%"
                cy="92%"
                rx="70%"
                ry="40%"
              >
                <Stop
                  offset="0%"
                  stopColor={accentColor}
                  stopOpacity={isDarkMode ? 0.12 : 0.07}
                />
                <Stop offset="100%" stopColor={Colors.PureBlack} stopOpacity={0} />
              </RadialGradient>
            </Defs>

            {/* Base Canvas */}
            <Rect
              width="100%"
              height="100%"
              fill="url(#reminderDetailsBgSheen)"
            />
            <Rect
              width="100%"
              height="100%"
              fill="url(#reminderDetailsAccentGlow)"
            />
            <Rect
              width="100%"
              height="100%"
              fill="url(#reminderDetailsMintGlow)"
            />
            <Rect
              width="100%"
              height="100%"
              fill="url(#reminderDetailsBottomAura)"
            />

            {/* Subtle Concentric Chime Ripples */}
            <G
              opacity={isDarkMode ? 0.22 : 0.35}
              stroke={
                isDarkMode
                  ? Colors.HabitCardMutedBorderDark
                  : Colors.SvgDetailsWarmStone
              }
              strokeWidth={1}
            >
              <Circle
                cx={W - 40}
                cy={120}
                r={55}
                fill="none"
                strokeDasharray="4 6"
              />
              <Circle cx={W - 40} cy={120} r={95} fill="none" opacity={0.5} />
              <Circle cx={W - 40} cy={120} r={140} fill="none" opacity={0.25} />
              <Path
                d={`M 0 ${Math.min(H * 0.44, 390)} Q ${W * 0.5} ${
                  Math.min(H * 0.44, 390) - 30
                } ${W} ${Math.min(H * 0.44, 390)}`}
                fill="none"
                opacity={0.3}
              />
            </G>
          </Svg>
        </View>
      );
    },
  );

export default ReminderDetailsBackgroundSvg;
