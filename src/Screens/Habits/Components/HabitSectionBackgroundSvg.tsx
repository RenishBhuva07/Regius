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

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export interface HabitSectionBackgroundSvgProps {
  width?: number;
  height?: number;
}

/**
 * Dynamic luxury aesthetic background for Habits Section:
 * - Differentiated from Today's Flow with sacred habit growth rings, solar chronometer ticks,
 *   emerald vitality auras, geometric habit lattice grid, and streak flame watermarks.
 * - Dynamically adapts to any container dimensions via layout measurement.
 */
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

    const W = Math.round(propWidth || dimensions.width);
    const H = Math.round(propHeight || dimensions.height);
    const centerX = W / 2;

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
            {/* Base warm luxury parchment sheen */}
            <LinearGradient
              id="habitBgSheen"
              x1="0"
              y1="0"
              x2="0"
              y2={H}
              gradientUnits="userSpaceOnUse"
            >
              <Stop offset="0%" stopColor="#FFFDF7" stopOpacity={0.98} />
              <Stop offset="20%" stopColor="#FAF7EF" stopOpacity={0.97} />
              <Stop offset="65%" stopColor="#F5EFE3" stopOpacity={0.96} />
              <Stop offset="100%" stopColor="#ECE4D4" stopOpacity={0.98} />
            </LinearGradient>

            {/* Solar Amber Dawn Aura under center crest badge */}
            <RadialGradient
              id="habitCrestAura"
              cx={centerX}
              cy={0}
              r={170}
              gradientUnits="userSpaceOnUse"
            >
              <Stop offset="0%" stopColor="#F5C518" stopOpacity={0.22} />
              <Stop offset="40%" stopColor="#E2A612" stopOpacity={0.08} />
              <Stop offset="100%" stopColor="#FAF7EF" stopOpacity={0} />
            </RadialGradient>

            {/* Golden radiance under top-right floating plus button */}
            <RadialGradient
              id="habitPlusAura"
              cx={W - 37}
              cy={0}
              r={110}
              gradientUnits="userSpaceOnUse"
            >
              <Stop offset="0%" stopColor="#F5C518" stopOpacity={0.24} />
              <Stop offset="50%" stopColor="#D99B0F" stopOpacity={0.06} />
              <Stop offset="100%" stopColor="#FAF7EF" stopOpacity={0} />
            </RadialGradient>

            {/* Emerald Vitality Aura on upper-left representing fresh habits & growth */}
            <RadialGradient
              id="habitEmeraldAura"
              cx={24}
              cy={60}
              r={150}
              gradientUnits="userSpaceOnUse"
            >
              <Stop offset="0%" stopColor="#1B9A72" stopOpacity={0.16} />
              <Stop offset="50%" stopColor="#2EE29F" stopOpacity={0.05} />
              <Stop offset="100%" stopColor="#FAF7EF" stopOpacity={0} />
            </RadialGradient>

            {/* Mindful Lavender Twilight Aura in center-right */}
            <RadialGradient
              id="habitMindfulAura"
              cx={W - 15}
              cy={Math.min(H * 0.45, 340)}
              r={160}
              gradientUnits="userSpaceOnUse"
            >
              <Stop offset="0%" stopColor="#7059C8" stopOpacity={0.14} />
              <Stop offset="55%" stopColor="#9C9CE3" stopOpacity={0.04} />
              <Stop offset="100%" stopColor="#F5EFE3" stopOpacity={0} />
            </RadialGradient>

            {/* Flame streak warmth aura in bottom-right */}
            <RadialGradient
              id="habitStreakAura"
              cx={W - 30}
              cy={H - 50}
              r={150}
              gradientUnits="userSpaceOnUse"
            >
              <Stop offset="0%" stopColor="#E65100" stopOpacity={0.12} />
              <Stop offset="50%" stopColor="#FF9800" stopOpacity={0.04} />
              <Stop offset="100%" stopColor="#ECE4D4" stopOpacity={0} />
            </RadialGradient>

            {/* Bottom-left grounding sage aura */}
            <RadialGradient
              id="habitSageAura"
              cx={30}
              cy={H - 40}
              r={140}
              gradientUnits="userSpaceOnUse"
            >
              <Stop offset="0%" stopColor="#1B9A72" stopOpacity={0.11} />
              <Stop offset="55%" stopColor="#34D399" stopOpacity={0.03} />
              <Stop offset="100%" stopColor="#ECE4D4" stopOpacity={0} />
            </RadialGradient>

            {/* Gold gradient for spark nodes */}
            <LinearGradient
              id="habitGoldNode"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <Stop offset="0%" stopColor="#FFFCE3" stopOpacity={0.95} />
              <Stop offset="50%" stopColor="#F5C518" stopOpacity={0.85} />
              <Stop offset="100%" stopColor="#B48216" stopOpacity={0.65} />
            </LinearGradient>

            {/* Emerald gradient for growth nodes */}
            <LinearGradient
              id="habitEmeraldNode"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <Stop offset="0%" stopColor="#E8FDF0" stopOpacity={0.95} />
              <Stop offset="50%" stopColor="#1B9A72" stopOpacity={0.85} />
              <Stop offset="100%" stopColor="#0E654A" stopOpacity={0.7} />
            </LinearGradient>

            {/* Delicate top specular light rim */}
            <LinearGradient
              id="habitRimLight"
              x1="0"
              y1="0"
              x2="0"
              y2={H}
              gradientUnits="userSpaceOnUse"
            >
              <Stop offset="0%" stopColor="#FFFFFF" stopOpacity={0.95} />
              <Stop offset="15%" stopColor="#FFFFFF" stopOpacity={0.3} />
              <Stop offset="100%" stopColor="#DACFBE" stopOpacity={0.4} />
            </LinearGradient>
          </Defs>

          {/* 1. Base Gradient Canvas */}
          <Rect x={0} y={0} width={W} height={H} fill="url(#habitBgSheen)" />

          {/* 2. Ambient Color Auras */}
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

          {/* 3. Sacred Concentric Growth Rings radiating from center crest badge */}
          <G opacity={0.65}>
            {/* Primary inner growth ring */}
            <Circle
              cx={centerX}
              cy={0}
              r={60}
              stroke="#D4CCA8"
              strokeWidth={1}
              strokeDasharray="4 6"
              fill="none"
              opacity={0.4}
            />
            {/* Solar golden mid-ring */}
            <Circle
              cx={centerX}
              cy={0}
              r={95}
              stroke="#F5C518"
              strokeWidth={1.2}
              fill="none"
              opacity={0.32}
            />
            {/* Vitality emerald ring */}
            <Circle
              cx={centerX}
              cy={0}
              r={135}
              stroke="#1B9A72"
              strokeWidth={1}
              strokeDasharray="8 8"
              fill="none"
              opacity={0.28}
            />
            {/* Fine outer orbital ring */}
            <Circle
              cx={centerX}
              cy={0}
              r={180}
              stroke="#D8D0BA"
              strokeWidth={1}
              fill="none"
              opacity={0.25}
            />
            <Circle
              cx={centerX}
              cy={0}
              r={230}
              stroke="#D0C8B0"
              strokeWidth={0.9}
              strokeDasharray="3 7"
              fill="none"
              opacity={0.2}
            />
            <Circle
              cx={centerX}
              cy={0}
              r={285}
              stroke="#C4BC9E"
              strokeWidth={0.8}
              fill="none"
              opacity={0.16}
            />

            {/* Radial Solar Habit Chronometer Ticks radiating from crest */}
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
                  stroke={i % 2 === 0 ? '#F5C518' : '#1B9A72'}
                  strokeWidth={1.2}
                  opacity={0.28}
                  strokeLinecap="round"
                />
              );
            })}
          </G>

          {/* 4. Geometric Sacred Habit Lattice (Subtle Diamond Grid) */}
          <G opacity={0.35}>
            {/* Diagonal lattice diagonals running top-left to bottom-right */}
            <Line
              x1={0}
              y1={120}
              x2={Math.min(W, 360)}
              y2={Math.min(H, 480)}
              stroke="#DFD7C2"
              strokeWidth={0.9}
              strokeDasharray="3 5"
            />
            <Line
              x1={0}
              y1={240}
              x2={Math.min(W, 360)}
              y2={Math.min(H, 600)}
              stroke="#DFD7C2"
              strokeWidth={0.9}
              strokeDasharray="3 5"
            />
            {/* Diagonal lattice diagonals running top-right to bottom-left */}
            <Line
              x1={W}
              y1={120}
              x2={Math.max(0, W - 360)}
              y2={Math.min(H, 480)}
              stroke="#DFD7C2"
              strokeWidth={0.9}
              strokeDasharray="3 5"
            />
            <Line
              x1={W}
              y1={240}
              x2={Math.max(0, W - 360)}
              y2={Math.min(H, 600)}
              stroke="#DFD7C2"
              strokeWidth={0.9}
              strokeDasharray="3 5"
            />
          </G>

          {/* 5. Botanical Habit Growth Vine Ribbon on Left Flank */}
          <Path
            d={`M 0 160 Q 30 220 18 300 T 32 440 T 12 580 T 24 ${H - 30}`}
            stroke="#1B9A72"
            strokeWidth={1.2}
            strokeDasharray="5 7"
            fill="none"
            opacity={0.16}
          />
          {/* Micro leaf sprout nodes on the left vine */}
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

          {/* 6. Sacred Streak Flame Watermark on Bottom-Right */}
          <G transform={`translate(${W - 74}, ${H - 145})`} opacity={0.15}>
            {/* Elegant continuous-line streak flame silhouette */}
            <Path
              d="M 28 65 C 10 52 4 35 16 18 C 19 26 23 30 27 28 C 24 16 32 6 42 0 C 42 12 48 20 54 22 C 58 14 62 10 65 14 C 70 28 66 50 48 62 C 40 68 34 68 28 65 Z"
              stroke="#E65100"
              strokeWidth={1.4}
              strokeLinejoin="round"
              fill="none"
            />
            {/* Inner flame core */}
            <Path
              d="M 33 55 C 25 46 22 36 29 26 C 31 31 34 33 37 32 C 37 24 43 18 47 16 C 47 24 50 28 53 30 C 55 38 52 48 41 54 Z"
              stroke="#F5C518"
              strokeWidth={1}
              fill="none"
              opacity={0.7}
            />
          </G>

          {/* 7. Golden Habit Diamond Stars & Constellation Nodes */}
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

          {/* Starlight micro nodes */}
          <Circle cx={W * 0.22} cy={85} r={1.6} fill="#F5C518" opacity={0.45} />
          <Circle cx={W * 0.78} cy={90} r={1.6} fill="#F5C518" opacity={0.45} />
          <Circle cx={W * 0.15} cy={260} r={1.8} fill="#1B9A72" opacity={0.4} />
          <Circle cx={W * 0.86} cy={330} r={1.8} fill="#7059C8" opacity={0.4} />
          <Circle
            cx={W * 0.32}
            cy={490}
            r={1.6}
            fill="#F5C518"
            opacity={0.35}
          />

          {/* 8. Crisp Top-Down Specular Light Rim (1.5px bevel edge) */}
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
