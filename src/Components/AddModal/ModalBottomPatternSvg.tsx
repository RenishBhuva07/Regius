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
import { Colors, withAlpha } from '../../Assets/StyleUtilities/Colors';

export interface ModalBottomPatternSvgProps {
  width: number;
  height: number;
}

export const ModalBottomPatternSvg: React.FC<ModalBottomPatternSvgProps> = ({
  width,
  height,
}) => {
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <Svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        fill="none"
      >
        <Defs>
          <LinearGradient id="goldShineBottom" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor={Colors.CreamBackground} stopOpacity={0.9} />
            <Stop offset="100%" stopColor={Colors.AccentYellow} stopOpacity={0.8} />
          </LinearGradient>

          <LinearGradient id="softWhiteBottom" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor={Colors.PureWhite} stopOpacity={0.25} />
            <Stop offset="100%" stopColor={Colors.PureWhite} stopOpacity={0.05} />
          </LinearGradient>
        </Defs>

        {/* Left orbital concentric circles */}
        <Circle
          cx={44}
          cy={38}
          r={36}
          stroke={withAlpha(Colors.PureWhite, 0.08)}
          strokeWidth={1}
          fill="none"
        />
        <Circle
          cx={44}
          cy={38}
          r={54}
          stroke={withAlpha(Colors.PureWhite, 0.04)}
          strokeWidth={1}
          strokeDasharray="3 4"
          fill="none"
        />

        {/* Right orbital concentric rings */}
        <Circle
          cx={width - 50}
          cy={32}
          r={42}
          stroke={withAlpha(Colors.PureWhite, 0.12)}
          strokeWidth={1}
          fill="none"
        />
        <Circle
          cx={width - 50}
          cy={32}
          r={68}
          stroke={withAlpha(Colors.PureWhite, 0.08)}
          strokeWidth={1.2}
          strokeDasharray="4 5"
          fill="none"
        />
        <Circle
          cx={width - 50}
          cy={32}
          r={98}
          stroke={withAlpha(Colors.PureWhite, 0.05)}
          strokeWidth={1}
          fill="none"
        />

        {/* Flowing curvilinear paths across the top rim */}
        <Path
          d={`M -20 28 Q ${width * 0.28} 12, ${width * 0.52} 32 T ${width + 20} 18`}
          stroke={withAlpha(Colors.PureWhite, 0.14)}
          strokeWidth={1.2}
          strokeLinecap="round"
          fill="none"
        />
        <Path
          d={`M -10 38 Q ${width * 0.32} 22, ${width * 0.58} 42 T ${width + 20} 28`}
          stroke={withAlpha(Colors.PureWhite, 0.08)}
          strokeWidth={1}
          strokeDasharray="5 6"
          strokeLinecap="round"
          fill="none"
        />

        {/* Regius Imperial Crown Motif centered */}
        <G
          transform={`translate(${width * 0.5 - 13}, 8) scale(1.1)`}
          opacity={0.14}
        >
          <Path
            d="M3 18L4.6 9L9.2 13L12 5.5L14.8 13L19.4 9L21 18H3Z"
            stroke={Colors.CreamBackground}
            strokeWidth={1.2}
            strokeLinejoin="round"
            fill="none"
          />
          <Path
            d="M12 9.6L13.8 12.3L12 15L10.2 12.3Z"
            stroke={Colors.CreamBackground}
            strokeWidth={0.9}
            fill="none"
          />
          <Path
            d="M3 19.8H21"
            stroke={Colors.CreamBackground}
            strokeWidth={1.4}
            strokeLinecap="round"
          />
          <Circle cx={12} cy={4} r={1.3} fill={Colors.CreamBackground} />
          <Circle cx={4.6} cy={8} r={1} fill={Colors.CreamBackground} />
          <Circle cx={19.4} cy={8} r={1} fill={Colors.CreamBackground} />
        </G>

        {/* Sparkling astral diamonds */}
        <G transform={`translate(${width * 0.36}, 16) scale(0.9)`}>
          <Path
            d="M6 0L7.5 4.5L12 6L7.5 7.5L6 12L4.5 7.5L0 6L4.5 4.5Z"
            fill="url(#goldShineBottom)"
          />
        </G>
        <G transform={`translate(${width * 0.62}, 28) scale(0.7)`} opacity={0.65}>
          <Path
            d="M6 0L7.5 4.5L12 6L7.5 7.5L6 12L4.5 7.5L0 6L4.5 4.5Z"
            fill={Colors.PureWhite}
          />
        </G>
        <G transform={`translate(${width * 0.72}, 12) scale(0.6)`} opacity={0.7}>
          <Path
            d="M6 0L7.5 4.5L12 6L7.5 7.5L6 12L4.5 7.5L0 6L4.5 4.5Z"
            fill={Colors.AccentYellow}
          />
        </G>
        <G transform={`translate(${width * 0.24}, 32) scale(0.55)`} opacity={0.45}>
          <Path
            d="M6 0L7.5 4.5L12 6L7.5 7.5L6 12L4.5 7.5L0 6L4.5 4.5Z"
            fill={Colors.CreamBackground}
          />
        </G>

        {/* Floating stardust dots */}
        <Circle cx={width * 0.3} cy={20} r={1.4} fill={Colors.CreamBackground} opacity={0.55} />
        <Circle cx={width * 0.44} cy={26} r={1.2} fill={Colors.AccentYellow} opacity={0.65} />
        <Circle cx={width * 0.58} cy={22} r={1.3} fill={Colors.CreamBackground} opacity={0.5} />
        <Circle cx={width * 0.8} cy={34} r={1.1} fill={Colors.CreamBackground} opacity={0.4} />
        <Circle cx={width * 0.16} cy={36} r={1.2} fill={Colors.CreamBackground} opacity={0.35} />
      </Svg>
    </View>
  );
};

export default ModalBottomPatternSvg;

