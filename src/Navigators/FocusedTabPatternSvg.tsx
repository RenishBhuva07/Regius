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

interface FocusedTabPatternSvgProps {
  width?: number;
  height?: number;
}

export const FocusedTabPatternSvg: React.FC<FocusedTabPatternSvgProps> =
  React.memo(({ width = 66, height = 50 }) => {
    return (
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <Svg
          width="100%"
          height="100%"
          viewBox={`0 0 ${width} ${height}`}
          fill="none"
        >
          <Defs>
            <LinearGradient id="focusedTabBg" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0%" stopColor="#262934" stopOpacity={0.9} />
              <Stop offset="50%" stopColor="#14151C" stopOpacity={0.95} />
              <Stop offset="100%" stopColor="#0B0C0E" stopOpacity={1} />
            </LinearGradient>

            <RadialGradient
              id="tabLavenderGlow"
              cx="50%"
              cy="100%"
              rx="65%"
              ry="65%"
            >
              <Stop offset="0%" stopColor="#9C9CE3" stopOpacity={0.22} />
              <Stop offset="60%" stopColor="#8383D6" stopOpacity={0.08} />
              <Stop offset="100%" stopColor="#0B0C0E" stopOpacity={0} />
            </RadialGradient>

            <RadialGradient
              id="tabGoldCorner"
              cx="90%"
              cy="12%"
              rx="55%"
              ry="55%"
            >
              <Stop offset="0%" stopColor="#F5C518" stopOpacity={0.16} />
              <Stop offset="60%" stopColor="#B48216" stopOpacity={0.04} />
              <Stop offset="100%" stopColor="#0B0C0E" stopOpacity={0} />
            </RadialGradient>

            <LinearGradient id="tabTopRim" x1="0%" y1="0%" x2="100%" y2="0%">
              <Stop offset="0%" stopColor="#FFFFFF" stopOpacity={0.05} />
              <Stop offset="50%" stopColor="#FFFFFF" stopOpacity={0.38} />
              <Stop offset="100%" stopColor="#FFFFFF" stopOpacity={0.05} />
            </LinearGradient>

            <LinearGradient
              id="tabGoldStar"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <Stop offset="0%" stopColor="#FFFCE3" stopOpacity={0.95} />
              <Stop offset="100%" stopColor="#F5C518" stopOpacity={0.8} />
            </LinearGradient>
          </Defs>
          <Rect width="100%" height="100%" rx={16} fill="url(#focusedTabBg)" />
          <Rect
            width="100%"
            height="100%"
            rx={16}
            fill="url(#tabLavenderGlow)"
          />
          <Rect width="100%" height="100%" rx={16} fill="url(#tabGoldCorner)" />
          <Path
            d={`M 12 1 L ${width - 12} 1`}
            stroke="url(#tabTopRim)"
            strokeWidth={1}
            strokeLinecap="round"
          />
          <Circle
            cx={6}
            cy={height - 6}
            r={14}
            stroke="rgba(255, 255, 255, 0.08)"
            strokeWidth={1}
            fill="none"
          />
          <Circle
            cx={6}
            cy={height - 6}
            r={24}
            stroke="rgba(216, 219, 255, 0.05)"
            strokeWidth={1}
            strokeDasharray="3 3"
            fill="none"
          />
          <Circle
            cx={width - 6}
            cy={6}
            r={14}
            stroke="rgba(255, 255, 255, 0.09)"
            strokeWidth={1}
            fill="none"
          />
          <Circle
            cx={width - 6}
            cy={6}
            r={24}
            stroke="rgba(245, 197, 24, 0.07)"
            strokeWidth={1}
            strokeDasharray="3 3"
            fill="none"
          />
          <Path
            d={`M -5 ${height - 12} Q ${width * 0.5} ${height - 4}, ${
              width + 5
            } ${height - 14}`}
            stroke="rgba(255, 255, 255, 0.06)"
            strokeWidth={1}
            strokeLinecap="round"
            fill="none"
          />
          <G transform={`translate(${width - 13}, 11)`}>
            <Path
              d="M 0 -4 Q 0 0 4 0 Q 0 0 0 4 Q 0 0 -4 0 Q 0 0 0 -4 Z"
              fill="url(#tabGoldStar)"
            />
            <Circle cx={0} cy={0} r={0.7} fill="#FFFFFF" />
          </G>
          <Circle cx={12} cy={12} r={0.8} fill="#FFFCE3" opacity={0.35} />
          <Circle
            cx={width - 18}
            cy={24}
            r={0.65}
            fill="#FFFCE3"
            opacity={0.3}
          />
          <Circle
            cx={width - 10}
            cy={height - 14}
            r={0.75}
            fill="#9C9CE3"
            opacity={0.4}
          />
          <Rect
            x={0.75}
            y={0.75}
            width={width - 1.5}
            height={height - 1.5}
            rx={15.25}
            stroke="rgba(255, 255, 255, 0.14)"
            strokeWidth={1}
            fill="none"
          />
        </Svg>
      </View>
    );
  });

export default FocusedTabPatternSvg;
