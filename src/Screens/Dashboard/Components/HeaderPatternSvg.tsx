import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, {
  Path,
  Circle,
  G,
  Defs,
  LinearGradient,
  Stop,
} from 'react-native-svg';

interface HeaderPatternSvgProps {
  width: number;
  insetsTop: number;
}

export const HeaderPatternSvg: React.FC<HeaderPatternSvgProps> = ({
  width,
  insetsTop,
}) => {
  const totalHeight = insetsTop + 70;

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <Svg
        width={width}
        height={totalHeight}
        viewBox={`0 0 ${width} ${totalHeight}`}
        fill="none"
      >
        <Defs>
          <LinearGradient id="goldShine" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#FFFCE3" stopOpacity={0.9} />
            <Stop offset="100%" stopColor="#F5C518" stopOpacity={0.8} />
          </LinearGradient>

          <LinearGradient id="softWhite" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor="#FFFFFF" stopOpacity={0.25} />
            <Stop offset="100%" stopColor="#FFFFFF" stopOpacity={0.05} />
          </LinearGradient>
        </Defs>
        <Circle
          cx={40}
          cy={insetsTop + 24}
          r={38}
          stroke="rgba(255, 255, 255, 0.08)"
          strokeWidth={1}
          fill="none"
        />
        <Circle
          cx={40}
          cy={insetsTop + 24}
          r={56}
          stroke="rgba(255, 255, 255, 0.04)"
          strokeWidth={1}
          strokeDasharray="3 4"
          fill="none"
        />
        <Circle
          cx={width - 55}
          cy={insetsTop + 14}
          r={45}
          stroke="rgba(255, 255, 255, 0.12)"
          strokeWidth={1}
          fill="none"
        />
        <Circle
          cx={width - 55}
          cy={insetsTop + 14}
          r={70}
          stroke="rgba(255, 255, 255, 0.08)"
          strokeWidth={1.2}
          strokeDasharray="4 5"
          fill="none"
        />
        <Circle
          cx={width - 55}
          cy={insetsTop + 14}
          r={105}
          stroke="rgba(255, 255, 255, 0.05)"
          strokeWidth={1}
          fill="none"
        />
        <Path
          d={`M -20 ${insetsTop + 40} Q ${width * 0.28} ${insetsTop + 16}, ${
            width * 0.52
          } ${insetsTop + 44} T ${width + 20} ${insetsTop + 24}`}
          stroke="rgba(255, 255, 255, 0.13)"
          strokeWidth={1.2}
          strokeLinecap="round"
          fill="none"
        />
        <Path
          d={`M -10 ${insetsTop + 52} Q ${width * 0.32} ${insetsTop + 32}, ${
            width * 0.58
          } ${insetsTop + 56} T ${width + 20} ${insetsTop + 38}`}
          stroke="rgba(255, 255, 255, 0.07)"
          strokeWidth={1}
          strokeDasharray="5 6"
          strokeLinecap="round"
          fill="none"
        />
        <G
          transform={`translate(${width * 0.45 - 14}, ${
            insetsTop + 2
          }) scale(1.15)`}
          opacity={0.12}
        >
          <Path
            d="M3 18L4.6 9L9.2 13L12 5.5L14.8 13L19.4 9L21 18H3Z"
            stroke="#FFFCE3"
            strokeWidth={1.2}
            strokeLinejoin="round"
            fill="none"
          />
          <Path
            d="M12 9.6L13.8 12.3L12 15L10.2 12.3Z"
            stroke="#FFFCE3"
            strokeWidth={0.9}
            fill="none"
          />
          <Path
            d="M3 19.8H21"
            stroke="#FFFCE3"
            strokeWidth={1.4}
            strokeLinecap="round"
          />
          <Circle cx={12} cy={4} r={1.3} fill="#FFFCE3" />
          <Circle cx={4.6} cy={8} r={1} fill="#FFFCE3" />
          <Circle cx={19.4} cy={8} r={1} fill="#FFFCE3" />
        </G>
        <G
          transform={`translate(${width * 0.41}, ${
            insetsTop + 14
          }) scale(0.95)`}
        >
          <Path
            d="M6 0L7.5 4.5L12 6L7.5 7.5L6 12L4.5 7.5L0 6L4.5 4.5Z"
            fill="url(#goldShine)"
          />
        </G>
        <G
          transform={`translate(${width * 0.54}, ${
            insetsTop + 34
          }) scale(0.72)`}
          opacity={0.6}
        >
          <Path
            d="M6 0L7.5 4.5L12 6L7.5 7.5L6 12L4.5 7.5L0 6L4.5 4.5Z"
            fill="#FFFFFF"
          />
        </G>
        <G
          transform={`translate(${width * 0.64}, ${insetsTop + 8}) scale(0.6)`}
          opacity={0.7}
        >
          <Path
            d="M6 0L7.5 4.5L12 6L7.5 7.5L6 12L4.5 7.5L0 6L4.5 4.5Z"
            fill="#F5C518"
          />
        </G>
        <G
          transform={`translate(${width * 0.35}, ${insetsTop + 38}) scale(0.5)`}
          opacity={0.45}
        >
          <Path
            d="M6 0L7.5 4.5L12 6L7.5 7.5L6 12L4.5 7.5L0 6L4.5 4.5Z"
            fill="#FFFCE3"
          />
        </G>
        <Circle
          cx={width * 0.38}
          cy={insetsTop + 18}
          r={1.4}
          fill="#FFFCE3"
          opacity={0.55}
        />
        <Circle
          cx={width * 0.49}
          cy={insetsTop + 26}
          r={1.2}
          fill="#F5C518"
          opacity={0.65}
        />
        <Circle
          cx={width * 0.6}
          cy={insetsTop + 22}
          r={1.4}
          fill="#FFFCE3"
          opacity={0.5}
        />
        <Circle
          cx={width * 0.7}
          cy={insetsTop + 40}
          r={1.1}
          fill="#FFFCE3"
          opacity={0.4}
        />
        <Circle
          cx={width * 0.28}
          cy={insetsTop + 46}
          r={1.2}
          fill="#FFFCE3"
          opacity={0.35}
        />
      </Svg>
    </View>
  );
};

export default HeaderPatternSvg;
