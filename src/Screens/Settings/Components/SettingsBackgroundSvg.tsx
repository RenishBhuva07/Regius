import React, { useState, useCallback } from 'react';
import { StyleSheet, View, Dimensions, LayoutChangeEvent } from 'react-native';
import Svg, {
  Path,
  Circle,
  Rect,
  G,
  Defs,
  LinearGradient,
  RadialGradient,
  Stop,
  Line,
} from 'react-native-svg';
import { useSettingsTheme } from './types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export interface SettingsBackgroundSvgProps {
  width?: number;
  height?: number;
}

// Background pattern for Settings screen.
export const SettingsBackgroundSvg: React.FC<SettingsBackgroundSvgProps> =
  React.memo(({ width: propWidth, height: propHeight }) => {
    const { isDarkMode } = useSettingsTheme();

    const [dimensions, setDimensions] = useState<{
      width: number;
      height: number;
    }>({
      width: propWidth || SCREEN_WIDTH,
      height: propHeight || 1350,
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
    const centerX = W / 2;

    return (
      <View
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
        onLayout={handleLayout}
      >
        <Svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} fill="none">
          <Defs>
            <LinearGradient
              id="extraBgBase"
              x1="0"
              y1="0"
              x2="0"
              y2={H}
              gradientUnits="userSpaceOnUse"
            >
              <Stop
                offset="0%"
                stopColor={isDarkMode ? '#121417' : '#FFFDF2'}
                stopOpacity={1}
              />
              <Stop
                offset="30%"
                stopColor={isDarkMode ? '#161920' : '#FFFCE8'}
                stopOpacity={1}
              />
              <Stop
                offset="70%"
                stopColor={isDarkMode ? '#191C24' : '#FAF5E8'}
                stopOpacity={1}
              />
              <Stop
                offset="100%"
                stopColor={isDarkMode ? '#121417' : '#F5EFE0'}
                stopOpacity={1}
              />
            </LinearGradient>
            <RadialGradient
              id="extraGoldAura"
              cx={centerX}
              cy={80}
              r={280}
              gradientUnits="userSpaceOnUse"
            >
              <Stop
                offset="0%"
                stopColor="#F5C518"
                stopOpacity={isDarkMode ? 0.32 : 0.38}
              />
              <Stop
                offset="45%"
                stopColor="#DEAA14"
                stopOpacity={isDarkMode ? 0.16 : 0.22}
              />
              <Stop
                offset="80%"
                stopColor="#B47804"
                stopOpacity={isDarkMode ? 0.05 : 0.08}
              />
              <Stop
                offset="100%"
                stopColor={isDarkMode ? '#121417' : '#FFFCE8'}
                stopOpacity={0}
              />
            </RadialGradient>
            <RadialGradient
              id="extraLavenderAura"
              cx={W - 20}
              cy={360}
              r={260}
              gradientUnits="userSpaceOnUse"
            >
              <Stop
                offset="0%"
                stopColor="#9C9CE3"
                stopOpacity={isDarkMode ? 0.28 : 0.32}
              />
              <Stop
                offset="50%"
                stopColor="#8383D6"
                stopOpacity={isDarkMode ? 0.12 : 0.16}
              />
              <Stop
                offset="100%"
                stopColor={isDarkMode ? '#121417' : '#FAF5E8'}
                stopOpacity={0}
              />
            </RadialGradient>
            <RadialGradient
              id="extraMintAura"
              cx={30}
              cy={800}
              r={240}
              gradientUnits="userSpaceOnUse"
            >
              <Stop
                offset="0%"
                stopColor="#52D22E"
                stopOpacity={isDarkMode ? 0.18 : 0.24}
              />
              <Stop
                offset="60%"
                stopColor="#1B9A72"
                stopOpacity={isDarkMode ? 0.06 : 0.09}
              />
              <Stop
                offset="100%"
                stopColor={isDarkMode ? '#121417' : '#FAF5E8'}
                stopOpacity={0}
              />
            </RadialGradient>
            <LinearGradient
              id="extraStarGold"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <Stop offset="0%" stopColor="#FFFFFF" stopOpacity={0.95} />
              <Stop offset="30%" stopColor="#FFFCE3" stopOpacity={0.9} />
              <Stop offset="100%" stopColor="#F5C518" stopOpacity={0.8} />
            </LinearGradient>
          </Defs>
          <Rect width={W} height={H} fill="url(#extraBgBase)" />
          <Rect width={W} height={H} fill="url(#extraGoldAura)" />
          <Rect width={W} height={H} fill="url(#extraLavenderAura)" />
          <Rect width={W} height={H} fill="url(#extraMintAura)" />
          <Circle
            cx={centerX}
            cy={60}
            r={100}
            stroke={
              isDarkMode
                ? 'rgba(245, 197, 24, 0.28)'
                : 'rgba(217, 155, 15, 0.35)'
            }
            strokeWidth={1.5}
            strokeDasharray="5 7"
            fill="none"
          />
          <Circle
            cx={centerX}
            cy={60}
            r={160}
            stroke={
              isDarkMode
                ? 'rgba(245, 197, 24, 0.18)'
                : 'rgba(217, 155, 15, 0.25)'
            }
            strokeWidth={1.2}
            fill="none"
          />
          <Circle
            cx={centerX}
            cy={60}
            r={230}
            stroke={
              isDarkMode
                ? 'rgba(156, 156, 227, 0.16)'
                : 'rgba(131, 131, 214, 0.22)'
            }
            strokeWidth={1.2}
            strokeDasharray="3 9"
            fill="none"
          />
          <Line
            x1={centerX - 130}
            y1={-10}
            x2={centerX + 130}
            y2={130}
            stroke={
              isDarkMode
                ? 'rgba(245, 197, 24, 0.15)'
                : 'rgba(217, 155, 15, 0.20)'
            }
            strokeWidth={1}
            strokeDasharray="4 8"
          />
          <Line
            x1={centerX + 130}
            y1={-10}
            x2={centerX - 130}
            y2={130}
            stroke={
              isDarkMode
                ? 'rgba(245, 197, 24, 0.15)'
                : 'rgba(217, 155, 15, 0.20)'
            }
            strokeWidth={1}
            strokeDasharray="4 8"
          />
          <Path
            d={`M -30 290 C ${W * 0.25} 230, ${W * 0.65} 350, ${W + 30} 270`}
            stroke={
              isDarkMode
                ? 'rgba(156, 156, 227, 0.26)'
                : 'rgba(131, 131, 214, 0.35)'
            }
            strokeWidth={2}
            strokeLinecap="round"
            fill="none"
          />
          <Path
            d={`M -30 330 C ${W * 0.35} 380, ${W * 0.75} 270, ${W + 30} 340`}
            stroke={
              isDarkMode
                ? 'rgba(245, 197, 24, 0.22)'
                : 'rgba(217, 155, 15, 0.30)'
            }
            strokeWidth={1.6}
            strokeDasharray="6 7"
            strokeLinecap="round"
            fill="none"
          />
          <Path
            d={`M -20 740 C ${W * 0.3} 680, ${W * 0.7} 790, ${W + 20} 720`}
            stroke={
              isDarkMode
                ? 'rgba(82, 210, 46, 0.20)'
                : 'rgba(27, 154, 114, 0.28)'
            }
            strokeWidth={1.8}
            strokeLinecap="round"
            fill="none"
          />
          <Line
            x1={20}
            y1={500}
            x2={W - 20}
            y2={500}
            stroke={
              isDarkMode
                ? 'rgba(255, 255, 255, 0.08)'
                : 'rgba(216, 185, 92, 0.22)'
            }
            strokeWidth={1}
            strokeDasharray="3 9"
          />
          <Line
            x1={20}
            y1={860}
            x2={W - 20}
            y2={860}
            stroke={
              isDarkMode
                ? 'rgba(255, 255, 255, 0.08)'
                : 'rgba(216, 185, 92, 0.20)'
            }
            strokeWidth={1}
            strokeDasharray="3 9"
          />
          <G transform={`translate(${W - 54}, 110)`}>
            <Path
              d="M 8 0 Q 8 8, 16 8 Q 8 8, 8 16 Q 8 8, 0 8 Q 8 8, 8 0 Z"
              fill="url(#extraStarGold)"
            />
          </G>
          <G transform="translate(32, 210)">
            <Path
              d="M 7 0 Q 7 7, 14 7 Q 7 7, 7 14 Q 7 7, 0 7 Q 7 7, 7 0 Z"
              fill="url(#extraStarGold)"
            />
          </G>
          <G transform={`translate(${W - 42}, 640)`}>
            <Path
              d="M 7 0 Q 7 7, 14 7 Q 7 7, 7 14 Q 7 7, 0 7 Q 7 7, 7 0 Z"
              fill="#9C9CE3"
              opacity={0.85}
            />
          </G>
          <G transform="translate(48, 920)">
            <Path
              d="M 6 0 Q 6 6, 12 6 Q 6 6, 6 12 Q 6 6, 0 6 Q 6 6, 6 0 Z"
              fill="url(#extraStarGold)"
              opacity={0.8}
            />
          </G>
          <Circle
            cx={44}
            cy={115}
            r={3}
            fill={isDarkMode ? '#F5C518' : '#D99B0F'}
            opacity={0.85}
          />
          <Circle
            cx={W - 86}
            cy={430}
            r={2.8}
            fill={isDarkMode ? '#9C9CE3' : '#8383D6'}
            opacity={0.8}
          />
          <Circle
            cx={36}
            cy={660}
            r={3.2}
            fill={isDarkMode ? '#52D22E' : '#22C55E'}
            opacity={0.8}
          />
          <Circle
            cx={W - 68}
            cy={880}
            r={2.8}
            fill={isDarkMode ? '#F5C518' : '#D99B0F'}
            opacity={0.75}
          />
        </Svg>
      </View>
    );
  });

export default SettingsBackgroundSvg;
