import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, {
  Path,
  Circle,
  G,
  Defs,
  LinearGradient,
  RadialGradient,
  Stop,
} from 'react-native-svg';

interface PlusButtonPatternSvgProps {
  size?: number;
}

// Pattern background for the floating center Plus button.
export const PlusButtonPatternSvg: React.FC<PlusButtonPatternSvgProps> =
  React.memo(({ size = 54 }) => {
    const center = size / 2;

    // 4-point diamond star path generator centered at (cx, cy)
    const star = (cx: number, cy: number, s: number) =>
      `M ${cx} ${cy - s} Q ${cx} ${cy}, ${cx + s} ${cy} Q ${cx} ${cy}, ${cx} ${
        cy + s
      } Q ${cx} ${cy}, ${cx - s} ${cy} Q ${cx} ${cy}, ${cx} ${cy - s} Z`;

    // Coordinates for diagonal stars at 45°, 135°, 225°, 315° at radius 14.5
    const dist = 14.5;
    const diag = dist * Math.SQRT1_2; // ~10.25
    const starSize = 1.6;

    return (
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <Svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          fill="none"
        >
          <Defs>
            <LinearGradient id="plusBtnBg" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0%" stopColor="#A2A2F8" stopOpacity={1} />
              <Stop offset="30%" stopColor="#8A8AE6" stopOpacity={1} />
              <Stop offset="70%" stopColor="#7171CE" stopOpacity={1} />
              <Stop offset="100%" stopColor="#5656B2" stopOpacity={1} />
            </LinearGradient>
            <RadialGradient
              id="plusCoreGlow"
              cx="50%"
              cy="50%"
              rx="46%"
              ry="46%"
            >
              <Stop offset="0%" stopColor="#FFFCE3" stopOpacity={0.35} />
              <Stop offset="45%" stopColor="#F5C518" stopOpacity={0.15} />
              <Stop offset="100%" stopColor="#8A8AE6" stopOpacity={0} />
            </RadialGradient>
            <RadialGradient
              id="plusLensGloss"
              cx="50%"
              cy="14%"
              rx="54%"
              ry="38%"
            >
              <Stop offset="0%" stopColor="#FFFFFF" stopOpacity={0.42} />
              <Stop offset="55%" stopColor="#FFFFFF" stopOpacity={0.08} />
              <Stop offset="100%" stopColor="#FFFFFF" stopOpacity={0} />
            </RadialGradient>
            <LinearGradient id="plusRimSheen" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0%" stopColor="#FFFFFF" stopOpacity={0.55} />
              <Stop offset="45%" stopColor="#FFFFFF" stopOpacity={0.15} />
              <Stop offset="100%" stopColor="#2E2E6E" stopOpacity={0.45} />
            </LinearGradient>
            <LinearGradient
              id="plusGoldStar"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <Stop offset="0%" stopColor="#FFFCE3" stopOpacity={0.98} />
              <Stop offset="60%" stopColor="#F5C518" stopOpacity={0.85} />
              <Stop offset="100%" stopColor="#B48216" stopOpacity={0.7} />
            </LinearGradient>
          </Defs>
          <Circle cx={center} cy={center} r={center} fill="url(#plusBtnBg)" />
          <Circle
            cx={center}
            cy={center}
            r={center}
            fill="url(#plusCoreGlow)"
          />
          <Circle
            cx={center}
            cy={center}
            r={center}
            fill="url(#plusLensGloss)"
          />
          <Circle
            cx={center}
            cy={center}
            r={21.5}
            stroke="rgba(255, 255, 255, 0.22)"
            strokeWidth={0.8}
            strokeDasharray="2.5 3"
            fill="none"
          />
          <Circle
            cx={center}
            cy={center}
            r={18}
            stroke="rgba(255, 255, 255, 0.16)"
            strokeWidth={0.7}
            fill="none"
          />
          <Circle cx={center} cy={center - 21.5} r={0.9} fill="#FFFCE3" />
          <Circle cx={center + 21.5} cy={center} r={0.9} fill="#FFFCE3" />
          <Circle cx={center} cy={center + 21.5} r={0.9} fill="#FFFCE3" />
          <Circle cx={center - 21.5} cy={center} r={0.9} fill="#FFFCE3" />
          <Path
            d={star(center + diag, center - diag, starSize)}
            fill="url(#plusGoldStar)"
          />
          <Path
            d={star(center + diag, center + diag, starSize)}
            fill="url(#plusGoldStar)"
          />
          <Path
            d={star(center - diag, center + diag, starSize)}
            fill="url(#plusGoldStar)"
          />
          <Path
            d={star(center - diag, center - diag, starSize)}
            fill="url(#plusGoldStar)"
          />
          <Circle
            cx={center}
            cy={center}
            r={center - 1}
            stroke="url(#plusRimSheen)"
            strokeWidth={1}
            fill="none"
          />
        </Svg>
      </View>
    );
  });

export default PlusButtonPatternSvg;
