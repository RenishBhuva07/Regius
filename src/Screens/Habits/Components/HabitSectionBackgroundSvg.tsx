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
import { useTheme } from '../../../Theme/ThemeContext';
import { Colors } from '../../../Assets/StyleUtilities/Colors';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export interface HabitSectionBackgroundSvgProps {
  width?: number;
  height?: number;
}

// Background pattern for the Habits section.
export const HabitSectionBackgroundSvg: React.FC<HabitSectionBackgroundSvgProps> =
  React.memo(({ width: propWidth, height: propHeight }) => {
    const [dimensions, setDimensions] = useState<{
      width: number;
      height: number;
    }>({
      width: propWidth || SCREEN_WIDTH - 20,
      height: propHeight || 700,
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

    const { isDarkMode, activeThemeId, Colors: themeColors } = useTheme();
    const W = Math.round(propWidth || dimensions.width);
    const H = Math.round(propHeight || dimensions.height);
    const centerX = W / 2;

    const isSandTheme = !isDarkMode || activeThemeId === 'cyprus_sand';
    const bgStop0 = isSandTheme
      ? Colors.WorkTintCream
      : themeColors.SurfaceAlt || Colors.DarkSurfacePressed;
    const bgStop20 = isSandTheme
      ? Colors.WarmParchment
      : themeColors.Background || Colors.DarkCanvasDeep;
    const bgStop65 = isSandTheme
      ? Colors.SvgSectionCreamBase
      : themeColors.AccentDeep || Colors.RoadCurbEdgeDark;
    const bgStop100 = isSandTheme
      ? Colors.SvgSectionParchment
      : themeColors.AccentDark || Colors.SvgSectionVoid;
    const fadeColor = isSandTheme
      ? Colors.WarmParchment
      : themeColors.SurfaceAlt || Colors.DarkSurfacePressed;
    const fadeColorMid = isSandTheme
      ? Colors.SvgSectionCreamBase
      : themeColors.Background || Colors.DarkCanvasDeep;
    const fadeColorBottom = isSandTheme
      ? Colors.SvgSectionParchment
      : themeColors.AccentDeep || Colors.RoadCurbEdgeDark;
    const themeAura =
      activeThemeId === 'cyprus_sand'
        ? Colors.CyprusTeal
        : themeColors.Accent || Colors.MindfulTextAccent;

    // Diamond habit spark generator
    const habitDiamond = (cx: number, cy: number, s: number) =>
      `M ${cx} ${cy - s} Q ${cx} ${cy}, ${cx + s} ${cy} Q ${cx} ${cy}, ${cx} ${
        cy + s
      } Q ${cx} ${cy}, ${cx - s} ${cy} Q ${cx} ${cy}, ${cx} ${cy - s} Z`;

    return (
      <View
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
        onLayout={handleLayout}
      >
        <Svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} fill="none">
          <Defs>
            <LinearGradient
              id="habitBgSheen"
              x1="0"
              y1="0"
              x2="0"
              y2={H}
              gradientUnits="userSpaceOnUse"
            >
              <Stop offset="0%" stopColor={bgStop0} stopOpacity={0.98} />
              <Stop offset="20%" stopColor={bgStop20} stopOpacity={0.97} />
              <Stop offset="65%" stopColor={bgStop65} stopOpacity={0.96} />
              <Stop offset="100%" stopColor={bgStop100} stopOpacity={0.98} />
            </LinearGradient>
            <RadialGradient
              id="habitCrestAura"
              cx={centerX}
              cy={0}
              r={170}
              gradientUnits="userSpaceOnUse"
            >
              <Stop offset="0%" stopColor={Colors.AccentYellow} stopOpacity={0.22} />
              <Stop
                offset="40%"
                stopColor={Colors.SvgGoldAuraMid}
                stopOpacity={0.08}
              />
              <Stop offset="100%" stopColor={fadeColor} stopOpacity={0} />
            </RadialGradient>
            <RadialGradient
              id="habitPlusAura"
              cx={W - 37}
              cy={0}
              r={110}
              gradientUnits="userSpaceOnUse"
            >
              <Stop offset="0%" stopColor={Colors.AccentYellow} stopOpacity={0.24} />
              <Stop
                offset="50%"
                stopColor={Colors.SvgDoodleGoldShadow}
                stopOpacity={0.06}
              />
              <Stop offset="100%" stopColor={fadeColor} stopOpacity={0} />
            </RadialGradient>
            <RadialGradient
              id="habitEmeraldAura"
              cx={24}
              cy={60}
              r={150}
              gradientUnits="userSpaceOnUse"
            >
              <Stop
                offset="0%"
                stopColor={Colors.GreenGracious}
                stopOpacity={0.16}
              />
              <Stop
                offset="50%"
                stopColor={Colors.SvgHabitMintAura}
                stopOpacity={0.05}
              />
              <Stop offset="100%" stopColor={fadeColor} stopOpacity={0} />
            </RadialGradient>
            <RadialGradient
              id="habitMindfulAura"
              cx={W - 15}
              cy={Math.min(H * 0.45, 340)}
              r={160}
              gradientUnits="userSpaceOnUse"
            >
              <Stop offset="0%" stopColor={themeAura} stopOpacity={0.14} />
              <Stop offset="55%" stopColor={themeAura} stopOpacity={0.04} />
              <Stop offset="100%" stopColor={fadeColorMid} stopOpacity={0} />
            </RadialGradient>
            <RadialGradient
              id="habitStreakAura"
              cx={W - 30}
              cy={H - 50}
              r={150}
              gradientUnits="userSpaceOnUse"
            >
              <Stop
                offset="0%"
                stopColor={Colors.EventTextAccent}
                stopOpacity={0.12}
              />
              <Stop
                offset="50%"
                stopColor={Colors.AccentAmber}
                stopOpacity={0.04}
              />
              <Stop offset="100%" stopColor={fadeColorBottom} stopOpacity={0} />
            </RadialGradient>
            <RadialGradient
              id="habitSageAura"
              cx={30}
              cy={H - 40}
              r={140}
              gradientUnits="userSpaceOnUse"
            >
              <Stop
                offset="0%"
                stopColor={Colors.GreenGracious}
                stopOpacity={0.11}
              />
              <Stop
                offset="55%"
                stopColor={Colors.ToastSuccessCardBevelLight}
                stopOpacity={0.03}
              />
              <Stop
                offset="100%"
                stopColor={Colors.SvgSectionParchment}
                stopOpacity={0}
              />
            </RadialGradient>
            <RadialGradient
              id="habitFooterAura"
              cx={centerX}
              cy={H - 110}
              r={210}
              gradientUnits="userSpaceOnUse"
            >
              <Stop
                offset="0%"
                stopColor={Colors.GreenGracious}
                stopOpacity={0.15}
              />
              <Stop
                offset="45%"
                stopColor={Colors.AccentYellow}
                stopOpacity={0.06}
              />
              <Stop
                offset="100%"
                stopColor={Colors.SvgSectionParchment}
                stopOpacity={0}
              />
            </RadialGradient>
            <LinearGradient
              id="habitGoldNode"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <Stop
                offset="0%"
                stopColor={Colors.CreamBackground}
                stopOpacity={0.95}
              />
              <Stop
                offset="50%"
                stopColor={Colors.AccentYellow}
                stopOpacity={0.85}
              />
              <Stop
                offset="100%"
                stopColor={Colors.WorkTextAccent}
                stopOpacity={0.65}
              />
            </LinearGradient>
            <LinearGradient
              id="habitEmeraldNode"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <Stop
                offset="0%"
                stopColor={Colors.BadgeGreenBg}
                stopOpacity={0.95}
              />
              <Stop
                offset="50%"
                stopColor={Colors.GreenGracious}
                stopOpacity={0.85}
              />
              <Stop
                offset="100%"
                stopColor={Colors.SvgHabitEmeraldEdge}
                stopOpacity={0.7}
              />
            </LinearGradient>
            <LinearGradient
              id="habitRimLight"
              x1="0"
              y1="0"
              x2="0"
              y2={H}
              gradientUnits="userSpaceOnUse"
            >
              <Stop offset="0%" stopColor={Colors.PureWhite} stopOpacity={0.95} />
              <Stop offset="15%" stopColor={Colors.PureWhite} stopOpacity={0.3} />
              <Stop
                offset="100%"
                stopColor={Colors.SvgSectionWarmTaupe}
                stopOpacity={0.4}
              />
            </LinearGradient>
          </Defs>
          <Rect x={0} y={0} width={W} height={H} fill="url(#habitBgSheen)" />
          <Rect x={0} y={0} width={W} height={H} fill="url(#habitCrestAura)" />
          <Rect x={0} y={0} width={W} height={H} fill="url(#habitPlusAura)" />
          <Rect
            x={0}
            y={0}
            width={W}
            height={H}
            fill="url(#habitEmeraldAura)"
          />
          <Rect
            x={0}
            y={0}
            width={W}
            height={H}
            fill="url(#habitMindfulAura)"
          />
          <Rect x={0} y={0} width={W} height={H} fill="url(#habitStreakAura)" />
          <Rect x={0} y={0} width={W} height={H} fill="url(#habitSageAura)" />
          <Rect x={0} y={0} width={W} height={H} fill="url(#habitFooterAura)" />
          <G opacity={0.65}>
            <Circle
              cx={centerX}
              cy={0}
              r={60}
              stroke={Colors.BentoWarmGoldMuted}
              strokeWidth={1}
              strokeDasharray="4 6"
              fill="none"
              opacity={0.4}
            />
            <Circle
              cx={centerX}
              cy={0}
              r={95}
              stroke={Colors.AccentYellow}
              strokeWidth={1.2}
              fill="none"
              opacity={0.32}
            />
            <Circle
              cx={centerX}
              cy={0}
              r={135}
              stroke={Colors.GreenGracious}
              strokeWidth={1}
              strokeDasharray="8 8"
              fill="none"
              opacity={0.28}
            />
            <Circle
              cx={centerX}
              cy={0}
              r={180}
              stroke={Colors.SvgSectionSandstone}
              strokeWidth={1}
              fill="none"
              opacity={0.25}
            />
            <Circle
              cx={centerX}
              cy={0}
              r={230}
              stroke={Colors.SvgSectionKhakiLine}
              strokeWidth={0.9}
              strokeDasharray="3 7"
              fill="none"
              opacity={0.2}
            />
            <Circle
              cx={centerX}
              cy={0}
              r={285}
              stroke={Colors.SvgHabitGoldTaupe}
              strokeWidth={0.8}
              fill="none"
              opacity={0.16}
            />
            {[-60, -45, -30, -15, 0, 15, 30, 45, 60].map((deg, i) => {
              const rad = (deg * Math.PI) / 180;
              const r1 = 80;
              const r2 = i % 2 === 0 ? 110 : 100;
              const x1 = centerX + Math.sin(rad) * r1;
              const y1 = Math.cos(rad) * r1;
              const x2 = centerX + Math.sin(rad) * r2;
              const y2 = Math.cos(rad) * r2;
              return (
                <Line
                  key={`radial-tick-${deg}`}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke={i % 2 === 0 ? Colors.AccentYellow : Colors.GreenGracious}
                  strokeWidth={1.2}
                  opacity={0.28}
                  strokeLinecap="round"
                />
              );
            })}
          </G>
          <G opacity={0.35}>
            <Line
              x1={0}
              y1={120}
              x2={Math.min(W, 360)}
              y2={Math.min(H, 480)}
              stroke={Colors.SvgSectionLinen}
              strokeWidth={0.9}
              strokeDasharray="3 5"
            />
            <Line
              x1={0}
              y1={240}
              x2={Math.min(W, 360)}
              y2={Math.min(H, 600)}
              stroke={Colors.SvgSectionLinen}
              strokeWidth={0.9}
              strokeDasharray="3 5"
            />
            <Line
              x1={W}
              y1={120}
              x2={Math.max(0, W - 360)}
              y2={Math.min(H, 480)}
              stroke={Colors.SvgSectionLinen}
              strokeWidth={0.9}
              strokeDasharray="3 5"
            />
            <Line
              x1={W}
              y1={240}
              x2={Math.max(0, W - 360)}
              y2={Math.min(H, 600)}
              stroke={Colors.SvgSectionLinen}
              strokeWidth={0.9}
              strokeDasharray="3 5"
            />
          </G>
          <Path
            d={`M 0 160 Q 30 220 18 300 T 32 440 T 12 580 T 24 ${H - 30}`}
            stroke={Colors.GreenGracious}
            strokeWidth={1.2}
            strokeDasharray="5 7"
            fill="none"
            opacity={0.16}
          />
          <Circle
            cx={22}
            cy={210}
            r={2.5}
            fill="url(#habitEmeraldNode)"
            opacity={0.45}
          />
          <Circle
            cx={19}
            cy={298}
            r={3}
            fill="url(#habitEmeraldNode)"
            opacity={0.5}
          />
          <Circle
            cx={31}
            cy={440}
            r={2.8}
            fill="url(#habitEmeraldNode)"
            opacity={0.45}
          />
          <Circle
            cx={13}
            cy={578}
            r={2.5}
            fill="url(#habitEmeraldNode)"
            opacity={0.4}
          />
          <G transform={`translate(${W - 68}, 235)`} opacity={0.22}>
            <Path
              d="M -25 35 Q -8 32 4 16"
              stroke={Colors.AccentYellow}
              strokeWidth={1}
              strokeDasharray="2 3"
              fill="none"
            />
            <Rect
              x={0}
              y={0}
              width={34}
              height={38}
              rx={6}
              stroke={Colors.BentoWarmGoldMuted}
              strokeWidth={1}
              fill="none"
            />
            <Line
              x1={0}
              y1={10}
              x2={34}
              y2={10}
              stroke={Colors.AccentYellow}
              strokeWidth={1}
            />
            <Circle cx={8} cy={18} r={2} fill={Colors.GreenGracious} />
            <Circle cx={17} cy={18} r={2} fill={Colors.GreenGracious} />
            <Circle cx={26} cy={18} r={2} fill={Colors.GreenGracious} />
            <Circle cx={8} cy={28} r={2} fill={Colors.GreenGracious} />
            <Circle cx={17} cy={28} r={2} fill={Colors.AccentYellow} />
            <Circle
              cx={26}
              cy={28}
              r={2}
              stroke={Colors.BentoWarmGoldMuted}
              strokeWidth={0.8}
              fill="none"
            />
          </G>
          <G
            transform={`translate(28, ${Math.min(390, H * 0.48)})`}
            opacity={0.18}
          >
            <Rect
              x={0}
              y={0}
              width={34}
              height={42}
              rx={6}
              stroke={Colors.BentoWarmGoldMuted}
              strokeWidth={1}
              fill="none"
            />
            <Rect
              x={8}
              y={-3}
              width={18}
              height={4}
              rx={2}
              stroke={Colors.AccentYellow}
              strokeWidth={1}
              fill="none"
            />
            <Path
              d="M 22 -3 L 22 18 L 24 16 L 26 18 L 26 -3"
              fill={Colors.GreenGracious}
              opacity={0.7}
            />
            <Rect
              x={5}
              y={8}
              width={6}
              height={6}
              rx={1.5}
              stroke={Colors.GreenGracious}
              strokeWidth={0.9}
              fill="none"
            />
            <Line
              x1={15}
              y1={11}
              x2={28}
              y2={11}
              stroke={Colors.SvgSectionTaupeBorder}
              strokeWidth={1}
              strokeLinecap="round"
            />
            <Rect
              x={5}
              y={19}
              width={6}
              height={6}
              rx={1.5}
              stroke={Colors.EventTextAccent}
              strokeWidth={0.9}
              fill="none"
            />
            <Line
              x1={15}
              y1={22}
              x2={27}
              y2={22}
              stroke={Colors.SvgSectionTaupeBorder}
              strokeWidth={1}
              strokeLinecap="round"
            />
            <Rect
              x={5}
              y={30}
              width={6}
              height={6}
              rx={1.5}
              stroke={Colors.AccentYellow}
              strokeWidth={0.9}
              fill="none"
            />
            <Line
              x1={15}
              y1={33}
              x2={25}
              y2={33}
              stroke={Colors.SvgSectionTaupeBorder}
              strokeWidth={1}
              strokeLinecap="round"
            />
          </G>
          <G transform={`translate(22, ${H - 225})`} opacity={0.2}>
            <Path
              d="M 6 34 Q 16 48 24 54 Q 38 30 56 8"
              stroke={Colors.GreenGracious}
              strokeWidth={2.4}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            <Circle cx={58} cy={7} r={2.2} fill={Colors.GreenGracious} />
            <Circle cx={6} cy={34} r={1.6} fill={Colors.AccentYellow} />
          </G>
          <G transform={`translate(${W - 74}, ${H - 145})`} opacity={0.16}>
            <Path
              d="M 28 65 C 10 52 4 35 16 18 C 19 26 23 30 27 28 C 24 16 32 6 42 0 C 42 12 48 20 54 22 C 58 14 62 10 65 14 C 70 28 66 50 48 62 C 40 68 34 68 28 65 Z"
              stroke={Colors.EventTextAccent}
              strokeWidth={1.4}
              strokeLinejoin="round"
              fill="none"
            />
            <Path
              d="M 33 55 C 25 46 22 36 29 26 C 31 31 34 33 37 32 C 37 24 43 18 47 16 C 47 24 50 28 53 30 C 55 38 52 48 41 54 Z"
              stroke={Colors.AccentYellow}
              strokeWidth={1}
              fill="none"
              opacity={0.7}
            />
          </G>
          <Path
            d={habitDiamond(38, 115, 6)}
            fill="url(#habitGoldNode)"
            opacity={0.55}
          />
          <Path
            d={habitDiamond(W - 48, 120, 5.5)}
            fill="url(#habitGoldNode)"
            opacity={0.55}
          />
          <Path
            d={habitDiamond(W - 28, 240, 5)}
            fill="url(#habitGoldNode)"
            opacity={0.45}
          />
          <Path
            d={habitDiamond(42, 380, 5)}
            fill="url(#habitGoldNode)"
            opacity={0.4}
          />
          <Path
            d={habitDiamond(W - 40, 460, 6)}
            fill="url(#habitGoldNode)"
            opacity={0.45}
          />
          <Path
            d={habitDiamond(W - 45, H - 75, 6)}
            fill="url(#habitGoldNode)"
            opacity={0.55}
          />
          <Path
            d={habitDiamond(48, H - 90, 5)}
            fill="url(#habitGoldNode)"
            opacity={0.45}
          />
          <Path
            d={habitDiamond(W * 0.52, H - 120, 4.5)}
            fill="url(#habitGoldNode)"
            opacity={0.4}
          />
          <Circle
            cx={W * 0.22}
            cy={85}
            r={1.6}
            fill={Colors.AccentYellow}
            opacity={0.45}
          />
          <Circle
            cx={W * 0.78}
            cy={90}
            r={1.6}
            fill={Colors.AccentYellow}
            opacity={0.45}
          />
          <Circle
            cx={W * 0.15}
            cy={260}
            r={1.8}
            fill={Colors.GreenGracious}
            opacity={0.4}
          />
          <Circle
            cx={W * 0.86}
            cy={330}
            r={1.8}
            fill={Colors.MindfulTextAccent}
            opacity={0.4}
          />
          <Circle
            cx={W * 0.32}
            cy={490}
            r={1.6}
            fill={Colors.AccentYellow}
            opacity={0.35}
          />
          <Circle
            cx={W * 0.45}
            cy={H - 50}
            r={2}
            fill={Colors.AccentYellow}
            opacity={0.4}
          />
          <Circle
            cx={W * 0.72}
            cy={H - 100}
            r={2.2}
            fill={Colors.GreenGracious}
            opacity={0.45}
          />
          <Path
            d={`M 1.5 ${H - 1.5} L 1.5 32 Q 1.5 1.5 32 1.5 L ${W - 32} 1.5 Q ${
              W - 1.5
            } 1.5 ${W - 1.5} 32 L ${W - 1.5} ${H - 1.5}`}
            stroke="url(#habitRimLight)"
            strokeWidth={1.5}
            fill="none"
          />
        </Svg>
      </View>
    );
  });

export default HabitSectionBackgroundSvg;
