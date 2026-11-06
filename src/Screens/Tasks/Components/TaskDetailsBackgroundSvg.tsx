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

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export interface TaskDetailsBackgroundSvgProps {
  accentColor?: string;
  width?: number;
  height?: number;
}

/**
 * Luxury ambient background canvas for TaskDetailsScreen.
 * Provides artisanal warm stationery canvas textures, radiant execution auras,
 * and precision geometry behind screen content.
 */
export const TaskDetailsBackgroundSvg: React.FC<TaskDetailsBackgroundSvgProps> =
  React.memo(
    ({ accentColor = '#F5C518', width: propWidth, height: propHeight }) => {
      const { isDarkMode } = useTheme();
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
                id="taskDetailsBgSheen"
                x1="0"
                y1="0"
                x2="0"
                y2="100%"
              >
                <Stop
                  offset="0%"
                  stopColor={isDarkMode ? '#161821' : '#FFFDF6'}
                  stopOpacity={0.98}
                />
                <Stop
                  offset="35%"
                  stopColor={isDarkMode ? '#121417' : '#FAF7EF'}
                  stopOpacity={isDarkMode ? 0.99 : 0.96}
                />
                <Stop
                  offset="70%"
                  stopColor={isDarkMode ? '#0F1014' : '#F5ECE0'}
                  stopOpacity={isDarkMode ? 0.99 : 0.95}
                />
                <Stop
                  offset="100%"
                  stopColor={isDarkMode ? '#0B0C0E' : '#ECE3D3'}
                  stopOpacity={isDarkMode ? 1 : 0.98}
                />
              </LinearGradient>

              {/* Dynamic Category Accent Aura (Top Right) */}
              <RadialGradient
                id="taskDetailsAccentGlow"
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
                <Stop offset="100%" stopColor="#000000" stopOpacity={0} />
              </RadialGradient>

              {/* Warm Execution Gold Aura (Top Left) */}
              <RadialGradient
                id="taskDetailsGoldGlow"
                cx="15%"
                cy="28%"
                rx="55%"
                ry="45%"
              >
                <Stop
                  offset="0%"
                  stopColor="#F5C518"
                  stopOpacity={isDarkMode ? 0.14 : 0.09}
                />
                <Stop
                  offset="65%"
                  stopColor="#D97706"
                  stopOpacity={isDarkMode ? 0.03 : 0.015}
                />
                <Stop offset="100%" stopColor="#000000" stopOpacity={0} />
              </RadialGradient>

              {/* Bottom Grounding Aura */}
              <RadialGradient
                id="taskDetailsBottomAura"
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
                <Stop offset="100%" stopColor="#000000" stopOpacity={0} />
              </RadialGradient>
            </Defs>

            {/* Base Canvas */}
            <Rect width="100%" height="100%" fill="url(#taskDetailsBgSheen)" />
            <Rect
              width="100%"
              height="100%"
              fill="url(#taskDetailsAccentGlow)"
            />
            <Rect width="100%" height="100%" fill="url(#taskDetailsGoldGlow)" />
            <Rect
              width="100%"
              height="100%"
              fill="url(#taskDetailsBottomAura)"
            />

            {/* Subtle Geometric Precision Lines */}
            <G
              opacity={isDarkMode ? 0.22 : 0.35}
              stroke={isDarkMode ? '#3A3F4D' : '#DCD5C5'}
              strokeWidth={1}
            >
              <Circle
                cx={W - 40}
                cy={120}
                r={65}
                fill="none"
                strokeDasharray="3 6"
              />
              <Circle cx={W - 40} cy={120} r={110} fill="none" opacity={0.5} />
              <Path
                d={`M 0 ${Math.min(H * 0.42, 380)} Q ${W * 0.45} ${
                  Math.min(H * 0.42, 380) - 40
                } ${W} ${Math.min(H * 0.42, 380)}`}
                fill="none"
                opacity={0.3}
              />
            </G>
          </Svg>
        </View>
      );
    },
  );

export default TaskDetailsBackgroundSvg;
