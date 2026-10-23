import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, {
  Defs,
  LinearGradient,
  RadialGradient,
  Stop,
  Rect,
  Circle,
  Path,
  G,
  Line,
} from 'react-native-svg';

export interface TaskCardAestheticBgProps {
  category: 'works' | 'sport' | 'habits' | string;
  width?: number;
  height?: number;
}

export const TaskCardAestheticBg: React.FC<TaskCardAestheticBgProps> = ({
  category,
  width = 340,
  height = 240,
}) => {
  const getTheme = () => {
    switch (category) {
      case 'sport':
        return {
          auraColor: '#52D22E',
          accentColor: '#1B9A72',
          sheenStart: '#FFFFFF',
          sheenEnd: '#F2FAF5',
          sparkleColor: '#1B9A72',
          starColor: '#52D22E',
        };
      case 'habits':
        return {
          auraColor: '#8383D6',
          accentColor: '#7059C8',
          sheenStart: '#FFFFFF',
          sheenEnd: '#F4F5FD',
          sparkleColor: '#7059C8',
          starColor: '#8383D6',
        };
      case 'works':
      default:
        return {
          auraColor: '#F5C518',
          accentColor: '#B48216',
          sheenStart: '#FFFFFF',
          sheenEnd: '#FDFBF4',
          sparkleColor: '#B48216',
          starColor: '#F5C518',
        };
    }
  };

  const theme = getTheme();
  const W = Math.max(width, 100);
  const H = Math.max(height, 100);

  const diamondStar = (cx: number, cy: number, s: number) =>
    `M ${cx} ${cy - s} Q ${cx} ${cy}, ${cx + s} ${cy} Q ${cx} ${cy}, ${cx} ${
      cy + s
    } Q ${cx} ${cy}, ${cx - s} ${cy} Q ${cx} ${cy}, ${cx} ${cy - s} Z`;

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <Svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="none"
      >
        <Defs>
          {/* Subtle soft gradient background */}
          <LinearGradient
            id="cardSheenGrad"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <Stop offset="0%" stopColor={theme.sheenStart} stopOpacity={0.98} />
            <Stop
              offset="55%"
              stopColor={theme.sheenStart}
              stopOpacity={0.94}
            />
            <Stop offset="100%" stopColor={theme.sheenEnd} stopOpacity={0.97} />
          </LinearGradient>

          {/* Top-Right Ambient Theme Aura */}
          <RadialGradient
            id="cornerAura"
            cx={W - 20}
            cy={20}
            r={130}
            gradientUnits="userSpaceOnUse"
          >
            <Stop offset="0%" stopColor={theme.auraColor} stopOpacity={0.22} />
            <Stop offset="50%" stopColor={theme.auraColor} stopOpacity={0.06} />
            <Stop offset="100%" stopColor={theme.auraColor} stopOpacity={0} />
          </RadialGradient>

          {/* Bottom-Left Ambient Glow */}
          <RadialGradient
            id="bottomAura"
            cx={15}
            cy={H - 25}
            r={110}
            gradientUnits="userSpaceOnUse"
          >
            <Stop offset="0%" stopColor={theme.auraColor} stopOpacity={0.14} />
            <Stop offset="55%" stopColor={theme.auraColor} stopOpacity={0.03} />
            <Stop offset="100%" stopColor={theme.auraColor} stopOpacity={0} />
          </RadialGradient>
        </Defs>

        {/* 1. Base Gradient Canvas */}
        <Rect
          x="0"
          y="0"
          width={W}
          height={H}
          rx={22}
          fill="url(#cardSheenGrad)"
        />

        {/* 2. Ambient Color Auras */}
        <Rect
          x="0"
          y="0"
          width={W}
          height={H}
          rx={22}
          fill="url(#cornerAura)"
        />
        <Rect
          x="0"
          y="0"
          width={W}
          height={H}
          rx={22}
          fill="url(#bottomAura)"
        />

        {/* 3. Delicate Constellation & Geometric Arcs in Top-Right Corner */}
        <G opacity={0.35}>
          <Circle
            cx={W - 24}
            cy={24}
            r={44}
            stroke={theme.auraColor}
            strokeWidth={1}
            strokeDasharray="3 5"
            fill="none"
          />
          <Circle
            cx={W - 24}
            cy={24}
            r={70}
            stroke={theme.auraColor}
            strokeWidth={0.8}
            fill="none"
          />
        </G>

        {/* 4. Fine Diamond Starlight Sparkles */}
        <Path
          d={diamondStar(W - 48, 28, 4)}
          fill={theme.starColor}
          opacity={0.55}
        />
        <Path
          d={diamondStar(W - 25, 68, 3)}
          fill={theme.starColor}
          opacity={0.4}
        />
        <Path
          d={diamondStar(26, H - 36, 3.5)}
          fill={theme.starColor}
          opacity={0.45}
        />
        <Circle
          cx={W - 85}
          cy={22}
          r={1.5}
          fill={theme.sparkleColor}
          opacity={0.45}
        />
        <Circle
          cx={W - 32}
          cy={95}
          r={1.4}
          fill={theme.sparkleColor}
          opacity={0.35}
        />
        <Circle
          cx={45}
          cy={H - 24}
          r={1.6}
          fill={theme.sparkleColor}
          opacity={0.4}
        />

        {/* 5. Minimal Corner Flourish Tick Marks */}
        <G opacity={0.25}>
          <Line
            x1={W - 40}
            y1={12}
            x2={W - 28}
            y2={12}
            stroke={theme.accentColor}
            strokeWidth={1}
            strokeLinecap="round"
          />
          <Line
            x1={W - 12}
            y1={28}
            x2={W - 12}
            y2={40}
            stroke={theme.accentColor}
            strokeWidth={1}
            strokeLinecap="round"
          />
        </G>
      </Svg>
    </View>
  );
};

export default TaskCardAestheticBg;
