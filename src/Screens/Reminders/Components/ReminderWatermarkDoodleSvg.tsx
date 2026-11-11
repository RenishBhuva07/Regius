import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, {
  Path,
  Circle,
  Rect,
  G,
  Defs,
  LinearGradient,
  Stop,
  Line,
} from 'react-native-svg';
import { Colors, IllustrationColors } from '../../../Assets/StyleUtilities/Colors';

export interface ReminderWatermarkDoodleSvgProps {
  width?: number;
  height?: number;
}

// Vector illustration for the Reminders footer watermark.
export const ReminderWatermarkDoodleSvg: React.FC<
  ReminderWatermarkDoodleSvgProps
> = ({ width = 135, height = 145 }) => {
  return (
    <View style={[styles.container, { width, height }]} pointerEvents="none">
      <Svg width={width} height={height} viewBox="0 0 135 145" fill="none">
        <Defs>
          <LinearGradient
            id="remDoodleGold"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <Stop offset="0%" stopColor={Colors.CreamBackground} />
            <Stop offset="40%" stopColor={Colors.AccentYellow} />
            <Stop offset="100%" stopColor={Colors.SvgDoodleGoldShadow} />
          </LinearGradient>
          <LinearGradient
            id="remDoodleLavender"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <Stop offset="0%" stopColor={Colors.MindfulLightBorder} />
            <Stop offset="50%" stopColor={Colors.LavenderPurple} />
            <Stop offset="100%" stopColor={Colors.BentoVioletStopDeep} />
          </LinearGradient>
          <LinearGradient
            id="remDoodleMint"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <Stop offset="0%" stopColor={Colors.Green300} />
            <Stop offset="50%" stopColor={Colors.Green500} />
            <Stop offset="100%" stopColor={Colors.Green700} />
          </LinearGradient>
          <LinearGradient id="remDialGlow" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor={Colors.PureWhite} stopOpacity={0.95} />
            <Stop
              offset="100%"
              stopColor={IllustrationColors.ReminderDoodlePaper}
              stopOpacity={0.9}
            />
          </LinearGradient>
        </Defs>
        <Path
          d="M 14 115 C 2 75, 30 30, 78 18"
          stroke={Colors.BentoWarmGoldMuted}
          strokeWidth={1.2}
          strokeDasharray="3 4"
          opacity={0.6}
          strokeLinecap="round"
        />
        <G transform="translate(16, 18)" opacity={0.85}>
          <Path
            d="M 8 0 Q 8 8, 16 8 Q 8 8, 8 16 Q 8 8, 0 8 Q 8 8, 8 0 Z"
            fill="url(#remDoodleGold)"
          />
        </G>
        <G transform="translate(114, 26)" opacity={0.75}>
          <Path
            d="M 6 0 Q 6 6, 12 6 Q 6 6, 6 12 Q 6 6, 0 6 Q 6 6, 6 0 Z"
            fill="url(#remDoodleGold)"
          />
        </G>
        <G transform="translate(12, 122)" opacity={0.65}>
          <Path
            d="M 4 0 Q 4 4, 8 4 Q 4 4, 4 8 Q 4 4, 0 4 Q 4 4, 4 0 Z"
            fill={Colors.LavenderPurple}
          />
        </G>
        <G transform="translate(24, 26) rotate(8, 42, 50)">
          <Path
            d="M 28 6 C 28 -2, 56 -2, 56 6"
            stroke={Colors.SvgGraphiteContour}
            strokeWidth={3}
            strokeLinecap="round"
            fill="none"
          />
          <G transform="translate(10, 4) rotate(-35, 12, 8)">
            <Rect
              x={0}
              y={0}
              width={24}
              height={14}
              rx={7}
              fill="url(#remDoodleGold)"
              stroke={Colors.SvgDoodleGoldShadow}
              strokeWidth={1.2}
            />
          </G>
          <G transform="translate(50, -10) rotate(35, 12, 8)">
            <Rect
              x={0}
              y={0}
              width={24}
              height={14}
              rx={7}
              fill="url(#remDoodleGold)"
              stroke={Colors.SvgDoodleGoldShadow}
              strokeWidth={1.2}
            />
          </G>
          <Circle cx={42} cy={8} r={3} fill={Colors.SvgGraphiteContour} />
          <Line
            x1={20}
            y1={76}
            x2={14}
            y2={86}
            stroke={Colors.SvgGraphiteContour}
            strokeWidth={3}
            strokeLinecap="round"
          />
          <Line
            x1={64}
            y1={76}
            x2={70}
            y2={86}
            stroke={Colors.SvgGraphiteContour}
            strokeWidth={3}
            strokeLinecap="round"
          />
          <Circle
            cx={42}
            cy={46}
            r={36}
            fill={Colors.SvgGraphiteContour}
            stroke={Colors.DarkBevelTop}
            strokeWidth={1.8}
          />
          <Circle
            cx={42}
            cy={46}
            r={32}
            fill="url(#remDialGlow)"
            stroke="url(#remDoodleGold)"
            strokeWidth={1.6}
          />
          <Circle cx={42} cy={19} r={1.6} fill={Colors.SvgGraphiteContour} />
          <Circle cx={69} cy={46} r={1.6} fill={Colors.SvgGraphiteContour} />
          <Circle cx={42} cy={73} r={1.6} fill={Colors.SvgGraphiteContour} />
          <Circle cx={15} cy={46} r={1.6} fill={Colors.SvgGraphiteContour} />
          <Line
            x1={42}
            y1={46}
            x2={26}
            y2={32}
            stroke={Colors.SvgGraphiteContour}
            strokeWidth={2.4}
            strokeLinecap="round"
          />
          <Line
            x1={42}
            y1={46}
            x2={58}
            y2={30}
            stroke={Colors.LavenderPurple}
            strokeWidth={2}
            strokeLinecap="round"
          />
          <Line
            x1={42}
            y1={46}
            x2={42}
            y2={62}
            stroke={Colors.AccentYellow}
            strokeWidth={1.2}
            strokeLinecap="round"
          />
          <Circle cx={42} cy={46} r={3} fill={Colors.AccentYellow} />
        </G>
        <G opacity={0.8}>
          <Path
            d="M 16 38 C 10 46, 10 60, 16 68"
            stroke="url(#remDoodleLavender)"
            strokeWidth={2.2}
            strokeLinecap="round"
            fill="none"
          />
          <Path
            d="M 8 32 C 0 44, 0 66, 8 78"
            stroke="url(#remDoodleLavender)"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeDasharray="3 3"
            fill="none"
          />
          <Path
            d="M 116 42 C 122 50, 122 64, 116 72"
            stroke="url(#remDoodleLavender)"
            strokeWidth={2.2}
            strokeLinecap="round"
            fill="none"
          />
          <Path
            d="M 124 36 C 132 48, 132 70, 124 82"
            stroke="url(#remDoodleLavender)"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeDasharray="3 3"
            fill="none"
          />
        </G>
        <G transform="translate(86, 92) rotate(-8, 18, 18)">
          <Circle
            cx={18}
            cy={18}
            r={18}
            fill={Colors.PureWhite}
            stroke={Colors.Green300}
            strokeWidth={1.5}
          />
          <Circle
            cx={18}
            cy={18}
            r={15}
            fill={Colors.RadarEmeraldLightBg}
            stroke={Colors.Green500}
            strokeWidth={1}
            strokeDasharray="2 2"
          />
          <Path
            d="M 11 18 L 16 23 L 26 12"
            stroke={Colors.Green600}
            strokeWidth={2.4}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </G>
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ReminderWatermarkDoodleSvg;
