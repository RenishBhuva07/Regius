import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, {
  Path,
  Circle,
  Rect,
  G,
  Defs,
  LinearGradient,
  RadialGradient,
  Stop,
} from 'react-native-svg';

export const FlowBadgePatternSvg: React.FC = React.memo(() => {
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <Svg
        width="100%"
        height="100%"
        viewBox="0 0 190 52"
        preserveAspectRatio="none"
        fill="none"
      >
        <Defs>
          <LinearGradient id="flowBadgeBg" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor="#282B38" stopOpacity={0.9} />
            <Stop offset="50%" stopColor="#151720" stopOpacity={0.95} />
            <Stop offset="100%" stopColor="#0B0C0F" stopOpacity={1} />
          </LinearGradient>

          <RadialGradient
            id="flowBadgeLavenderGlow"
            cx="50%"
            cy="0%"
            rx="60%"
            ry="80%"
          >
            <Stop offset="0%" stopColor="#9C9CE3" stopOpacity={0.22} />
            <Stop offset="55%" stopColor="#8383D6" stopOpacity={0.07} />
            <Stop offset="100%" stopColor="#0B0C0F" stopOpacity={0} />
          </RadialGradient>

          <RadialGradient
            id="flowBadgeGoldDawn"
            cx="14%"
            cy="85%"
            rx="48%"
            ry="55%"
          >
            <Stop offset="0%" stopColor="#F5C518" stopOpacity={0.16} />
            <Stop offset="60%" stopColor="#B48216" stopOpacity={0.04} />
            <Stop offset="100%" stopColor="#0B0C0F" stopOpacity={0} />
          </RadialGradient>

          <RadialGradient
            id="flowBadgeMintAura"
            cx="86%"
            cy="85%"
            rx="48%"
            ry="55%"
          >
            <Stop offset="0%" stopColor="#52D22E" stopOpacity={0.1} />
            <Stop offset="60%" stopColor="#1B9A72" stopOpacity={0.02} />
            <Stop offset="100%" stopColor="#0B0C0F" stopOpacity={0} />
          </RadialGradient>

          <LinearGradient id="flowBadgeRim" x1="0%" y1="0%" x2="100%" y2="0%">
            <Stop offset="0%" stopColor="#FFFFFF" stopOpacity={0.04} />
            <Stop offset="50%" stopColor="#FFFFFF" stopOpacity={0.32} />
            <Stop offset="100%" stopColor="#FFFFFF" stopOpacity={0.04} />
          </LinearGradient>

          <LinearGradient
            id="flowBadgeGoldStar"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <Stop offset="0%" stopColor="#FFFCE3" stopOpacity={0.95} />
            <Stop offset="100%" stopColor="#F5C518" stopOpacity={0.8} />
          </LinearGradient>
        </Defs>

        {/* Base multi-layer obsidian & glowing volumes */}
        <Rect width="100%" height="100%" fill="url(#flowBadgeBg)" />
        <Rect width="100%" height="100%" fill="url(#flowBadgeLavenderGlow)" />
        <Rect width="100%" height="100%" fill="url(#flowBadgeGoldDawn)" />
        <Rect width="100%" height="100%" fill="url(#flowBadgeMintAura)" />

        {/* Top highlight rim */}
        <Path
          d="M 28 1 L 162 1"
          stroke="url(#flowBadgeRim)"
          strokeWidth={1}
          strokeLinecap="round"
        />

        {/* Left acoustic orbital flow rings */}
        <Circle
          cx={24}
          cy={26}
          r={16}
          stroke="rgba(255, 255, 255, 0.08)"
          strokeWidth={1}
          fill="none"
        />
        <Circle
          cx={24}
          cy={26}
          r={28}
          stroke="rgba(216, 219, 255, 0.05)"
          strokeWidth={1}
          strokeDasharray="3 4"
          fill="none"
        />
        <Circle
          cx={24}
          cy={26}
          r={42}
          stroke="rgba(255, 255, 255, 0.03)"
          strokeWidth={1}
          fill="none"
        />

        {/* Right acoustic orbital flow rings */}
        <Circle
          cx={166}
          cy={26}
          r={16}
          stroke="rgba(255, 255, 255, 0.08)"
          strokeWidth={1}
          fill="none"
        />
        <Circle
          cx={166}
          cy={26}
          r={28}
          stroke="rgba(245, 197, 24, 0.06)"
          strokeWidth={1}
          strokeDasharray="3 4"
          fill="none"
        />
        <Circle
          cx={166}
          cy={26}
          r={42}
          stroke="rgba(255, 255, 255, 0.03)"
          strokeWidth={1}
          fill="none"
        />

        {/* Flow waves across the badge */}
        <Path
          d="M -5 34 Q 50 16, 95 32 T 195 24"
          stroke="rgba(255, 255, 255, 0.09)"
          strokeWidth={1.2}
          strokeLinecap="round"
          fill="none"
        />
        <Path
          d="M -5 42 Q 55 24, 100 40 T 195 34"
          stroke="rgba(216, 219, 255, 0.05)"
          strokeWidth={1}
          strokeDasharray="4 5"
          strokeLinecap="round"
          fill="none"
        />

        {/* Royal 4-pointed micro sparkles positioned in the outer wings (clear of text) */}
        <G transform="translate(18, 24)">
          <Path
            d="M 0 -4 Q 0 0 4 0 Q 0 0 0 4 Q 0 0 -4 0 Q 0 0 0 -4 Z"
            fill="url(#flowBadgeGoldStar)"
          />
          <Circle cx={0} cy={0} r={0.65} fill="#FFFFFF" />
        </G>

        <G transform="translate(172, 24)">
          <Path
            d="M 0 -4 Q 0 0 4 0 Q 0 0 0 4 Q 0 0 -4 0 Q 0 0 0 -4 Z"
            fill="url(#flowBadgeGoldStar)"
          />
          <Circle cx={0} cy={0} r={0.65} fill="#FFFFFF" />
        </G>

        {/* Stardust dots positioned safely in the lateral wings */}
        <Circle cx={12} cy={14} r={0.8} fill="#FFFCE3" opacity={0.4} />
        <Circle cx={24} cy={38} r={0.7} fill="#9C9CE3" opacity={0.35} />
        <Circle cx={178} cy={14} r={0.8} fill="#FFFCE3" opacity={0.4} />
        <Circle cx={166} cy={38} r={0.7} fill="#F5C518" opacity={0.35} />
      </Svg>
    </View>
  );
});

export default FlowBadgePatternSvg;
