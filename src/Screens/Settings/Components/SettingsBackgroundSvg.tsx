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
import { Colors, withAlpha } from '../../../Assets/StyleUtilities/Colors';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export interface SettingsBackgroundSvgProps {
  width?: number;
  height?: number;
}

// Background pattern for Settings screen.
export const SettingsBackgroundSvg: React.FC<SettingsBackgroundSvgProps> =
  React.memo(({ width: propWidth, height: propHeight }) => {
    const { isDarkMode, bgMain } = useSettingsTheme();

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
                stopColor={isDarkMode ? bgMain : Colors.SvgWarmIvoryMist}
                stopOpacity={1}
              />
              <Stop
                offset="30%"
                stopColor={isDarkMode ? bgMain : Colors.SvgSettingsCreamGlow}
                stopOpacity={1}
              />
              <Stop
                offset="70%"
                stopColor={isDarkMode ? bgMain : Colors.KeepsakeLightMid}
                stopOpacity={1}
              />
              <Stop
                offset="100%"
                stopColor={isDarkMode ? bgMain : Colors.FaqChevronIdleLightBg}
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
                stopColor={Colors.AccentYellow}
                stopOpacity={isDarkMode ? 0.32 : 0.38}
              />
              <Stop
                offset="45%"
                stopColor={Colors.WorkDarkBorder}
                stopOpacity={isDarkMode ? 0.16 : 0.22}
              />
              <Stop
                offset="80%"
                stopColor={Colors.BadgeYellowText}
                stopOpacity={isDarkMode ? 0.05 : 0.08}
              />
              <Stop
                offset="100%"
                stopColor={isDarkMode ? bgMain : Colors.SvgSettingsCreamGlow}
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
                stopColor={Colors.PeriwinkleSoft}
                stopOpacity={isDarkMode ? 0.28 : 0.32}
              />
              <Stop
                offset="50%"
                stopColor={Colors.LavenderPurple}
                stopOpacity={isDarkMode ? 0.12 : 0.16}
              />
              <Stop
                offset="100%"
                stopColor={isDarkMode ? bgMain : Colors.KeepsakeLightMid}
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
                stopColor={Colors.AccentGreen}
                stopOpacity={isDarkMode ? 0.18 : 0.24}
              />
              <Stop
                offset="60%"
                stopColor={Colors.GreenGracious}
                stopOpacity={isDarkMode ? 0.06 : 0.09}
              />
              <Stop
                offset="100%"
                stopColor={isDarkMode ? bgMain : Colors.KeepsakeLightMid}
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
              <Stop offset="0%" stopColor={Colors.PureWhite} stopOpacity={0.95} />
              <Stop offset="30%" stopColor={Colors.CreamBackground} stopOpacity={0.9} />
              <Stop offset="100%" stopColor={Colors.AccentYellow} stopOpacity={0.8} />
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
                ? withAlpha(Colors.AccentYellow, 0.28)
                : withAlpha(Colors.SvgDoodleGoldShadow, 0.35)
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
                ? withAlpha(Colors.AccentYellow, 0.18)
                : withAlpha(Colors.SvgDoodleGoldShadow, 0.25)
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
                ? withAlpha(Colors.PeriwinkleSoft, 0.16)
                : withAlpha(Colors.LavenderPurple, 0.22)
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
                ? withAlpha(Colors.AccentYellow, 0.15)
                : withAlpha(Colors.SvgDoodleGoldShadow, 0.2)
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
                ? withAlpha(Colors.AccentYellow, 0.15)
                : withAlpha(Colors.SvgDoodleGoldShadow, 0.2)
            }
            strokeWidth={1}
            strokeDasharray="4 8"
          />
          <Path
            d={`M -30 290 C ${W * 0.25} 230, ${W * 0.65} 350, ${W + 30} 270`}
            stroke={
              isDarkMode
                ? withAlpha(Colors.PeriwinkleSoft, 0.26)
                : withAlpha(Colors.LavenderPurple, 0.35)
            }
            strokeWidth={2}
            strokeLinecap="round"
            fill="none"
          />
          <Path
            d={`M -30 330 C ${W * 0.35} 380, ${W * 0.75} 270, ${W + 30} 340`}
            stroke={
              isDarkMode
                ? withAlpha(Colors.AccentYellow, 0.22)
                : withAlpha(Colors.SvgDoodleGoldShadow, 0.3)
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
                ? withAlpha(Colors.AccentGreen, 0.2)
                : withAlpha(Colors.GreenGracious, 0.28)
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
                ? withAlpha(Colors.PureWhite, 0.08)
                : withAlpha(Colors.SvgWarmHoneyGold, 0.22)
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
                ? withAlpha(Colors.PureWhite, 0.08)
                : withAlpha(Colors.SvgWarmHoneyGold, 0.2)
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
              fill={Colors.PeriwinkleSoft}
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
            fill={
              isDarkMode ? Colors.AccentYellow : Colors.SvgDoodleGoldShadow
            }
            opacity={0.85}
          />
          <Circle
            cx={W - 86}
            cy={430}
            r={2.8}
            fill={
              isDarkMode ? Colors.PeriwinkleSoft : Colors.LavenderPurple
            }
            opacity={0.8}
          />
          <Circle
            cx={36}
            cy={660}
            r={3.2}
            fill={isDarkMode ? Colors.AccentGreen : Colors.Green500}
            opacity={0.8}
          />
          <Circle
            cx={W - 68}
            cy={880}
            r={2.8}
            fill={
              isDarkMode ? Colors.AccentYellow : Colors.SvgDoodleGoldShadow
            }
            opacity={0.75}
          />
        </Svg>
      </View>
    );
  });

export default SettingsBackgroundSvg;
