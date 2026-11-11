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
import { Colors, withAlpha } from '../../../Assets/StyleUtilities/Colors';

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
            <Stop offset="0%" stopColor={Colors.SvgBadgeTopSlate} stopOpacity={0.9} />
            <Stop offset="50%" stopColor={Colors.VocalPlayPillDarkBg} stopOpacity={0.95} />
            <Stop offset="100%" stopColor={Colors.SvgSurfaceVoid} stopOpacity={1} />
          </LinearGradient>

          <RadialGradient
            id="flowBadgeLavenderGlow"
            cx="50%"
            cy="0%"
            rx="60%"
            ry="80%"
          >
            <Stop offset="0%" stopColor={Colors.PeriwinkleSoft} stopOpacity={0.22} />
            <Stop offset="55%" stopColor={Colors.LavenderPurple} stopOpacity={0.07} />
            <Stop offset="100%" stopColor={Colors.SvgSurfaceVoid} stopOpacity={0} />
          </RadialGradient>

          <RadialGradient
            id="flowBadgeGoldDawn"
            cx="14%"
            cy="85%"
            rx="48%"
            ry="55%"
          >
            <Stop offset="0%" stopColor={Colors.AccentYellow} stopOpacity={0.16} />
            <Stop offset="60%" stopColor={Colors.WorkTextAccent} stopOpacity={0.04} />
            <Stop offset="100%" stopColor={Colors.SvgSurfaceVoid} stopOpacity={0} />
          </RadialGradient>

          <RadialGradient
            id="flowBadgeMintAura"
            cx="86%"
            cy="85%"
            rx="48%"
            ry="55%"
          >
            <Stop offset="0%" stopColor={Colors.AccentGreen} stopOpacity={0.1} />
            <Stop offset="60%" stopColor={Colors.GreenGracious} stopOpacity={0.02} />
            <Stop offset="100%" stopColor={Colors.SvgSurfaceVoid} stopOpacity={0} />
          </RadialGradient>

          <LinearGradient id="flowBadgeRim" x1="0%" y1="0%" x2="100%" y2="0%">
            <Stop offset="0%" stopColor={Colors.PureWhite} stopOpacity={0.04} />
            <Stop offset="50%" stopColor={Colors.PureWhite} stopOpacity={0.32} />
            <Stop offset="100%" stopColor={Colors.PureWhite} stopOpacity={0.04} />
          </LinearGradient>

          <LinearGradient
            id="flowBadgeGoldStar"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <Stop offset="0%" stopColor={Colors.CreamBackground} stopOpacity={0.95} />
            <Stop offset="100%" stopColor={Colors.AccentYellow} stopOpacity={0.8} />
          </LinearGradient>
        </Defs>
        <Rect width="100%" height="100%" fill="url(#flowBadgeBg)" />
        <Rect width="100%" height="100%" fill="url(#flowBadgeLavenderGlow)" />
        <Rect width="100%" height="100%" fill="url(#flowBadgeGoldDawn)" />
        <Rect width="100%" height="100%" fill="url(#flowBadgeMintAura)" />
        <Path
          d="M 28 1 L 162 1"
          stroke="url(#flowBadgeRim)"
          strokeWidth={1}
          strokeLinecap="round"
        />
        <Circle
          cx={24}
          cy={26}
          r={16}
          stroke={withAlpha(Colors.PureWhite, 0.08)}
          strokeWidth={1}
          fill="none"
        />
        <Circle
          cx={24}
          cy={26}
          r={28}
          stroke={withAlpha(Colors.MindfulLightBorder, 0.05)}
          strokeWidth={1}
          strokeDasharray="3 4"
          fill="none"
        />
        <Circle
          cx={24}
          cy={26}
          r={42}
          stroke={withAlpha(Colors.PureWhite, 0.03)}
          strokeWidth={1}
          fill="none"
        />
        <Circle
          cx={166}
          cy={26}
          r={16}
          stroke={withAlpha(Colors.PureWhite, 0.08)}
          strokeWidth={1}
          fill="none"
        />
        <Circle
          cx={166}
          cy={26}
          r={28}
          stroke={withAlpha(Colors.AccentYellow, 0.06)}
          strokeWidth={1}
          strokeDasharray="3 4"
          fill="none"
        />
        <Circle
          cx={166}
          cy={26}
          r={42}
          stroke={withAlpha(Colors.PureWhite, 0.03)}
          strokeWidth={1}
          fill="none"
        />
        <Path
          d="M -5 34 Q 50 16, 95 32 T 195 24"
          stroke={withAlpha(Colors.PureWhite, 0.09)}
          strokeWidth={1.2}
          strokeLinecap="round"
          fill="none"
        />
        <Path
          d="M -5 42 Q 55 24, 100 40 T 195 34"
          stroke={withAlpha(Colors.MindfulLightBorder, 0.05)}
          strokeWidth={1}
          strokeDasharray="4 5"
          strokeLinecap="round"
          fill="none"
        />
        <G transform="translate(18, 24)">
          <Path
            d="M 0 -4 Q 0 0 4 0 Q 0 0 0 4 Q 0 0 -4 0 Q 0 0 0 -4 Z"
            fill="url(#flowBadgeGoldStar)"
          />
          <Circle cx={0} cy={0} r={0.65} fill={Colors.PureWhite} />
        </G>

        <G transform="translate(172, 24)">
          <Path
            d="M 0 -4 Q 0 0 4 0 Q 0 0 0 4 Q 0 0 -4 0 Q 0 0 0 -4 Z"
            fill="url(#flowBadgeGoldStar)"
          />
          <Circle cx={0} cy={0} r={0.65} fill={Colors.PureWhite} />
        </G>
        <Circle cx={12} cy={14} r={0.8} fill={Colors.CreamBackground} opacity={0.4} />
        <Circle cx={24} cy={38} r={0.7} fill={Colors.PeriwinkleSoft} opacity={0.35} />
        <Circle cx={178} cy={14} r={0.8} fill={Colors.CreamBackground} opacity={0.4} />
        <Circle cx={166} cy={38} r={0.7} fill={Colors.AccentYellow} opacity={0.35} />
      </Svg>
    </View>
  );
});

export default FlowBadgePatternSvg;
