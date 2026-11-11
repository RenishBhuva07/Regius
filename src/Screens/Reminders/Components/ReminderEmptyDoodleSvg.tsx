import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, {
  Path,
  Circle,
  G,
  Defs,
  LinearGradient,
  Stop,
} from 'react-native-svg';
import { Colors, IllustrationColors } from '../../../Assets/StyleUtilities/Colors';

export interface ReminderEmptyDoodleSvgProps {
  width?: number;
  height?: number;
}

export const ReminderEmptyDoodleSvg: React.FC<ReminderEmptyDoodleSvgProps> = ({
  width = 130,
  height = 140,
}) => {
  return (
    <View style={[styles.container, { width, height }]} pointerEvents="none">
      <Svg width={width} height={height} viewBox="0 0 130 140" fill="none">
        <Defs>
          <LinearGradient
            id="remDoodleGold"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <Stop offset="0%" stopColor={Colors.WorkLightBorder} />
            <Stop offset="50%" stopColor={Colors.AccentYellow} />
            <Stop offset="100%" stopColor={Colors.SvgDoodleGoldShadow} />
          </LinearGradient>
          <LinearGradient
            id="remDoodlePurple"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <Stop offset="0%" stopColor={Colors.MindfulLightBorder} />
            <Stop offset="50%" stopColor={Colors.LavenderPurple} />
            <Stop offset="100%" stopColor={Colors.BentoVioletStopDeep} />
          </LinearGradient>
        </Defs>
        <Circle
          cx={65}
          cy={70}
          r={52}
          stroke={IllustrationColors.ReminderDoodleLinen}
          strokeWidth={1.5}
          strokeDasharray="4 4"
        />
        <G transform="translate(40, 42)">
          <Path
            d="M 20 6 C 20 2, 30 2, 30 6"
            stroke="url(#remDoodleGold)"
            strokeWidth={3}
            strokeLinecap="round"
            fill="none"
          />
          <Path
            d="M 25 8 C 15 8, 10 24, 6 36 C 4 40, 2 44, 2 46 L 48 46 C 48 44, 46 40, 44 36 C 40 24, 35 8, 25 8 Z"
            fill="url(#remDoodleGold)"
            opacity={0.88}
          />
          <Path
            d="M 0 46 C 0 44, 50 44, 50 46 C 50 49, 0 49, 0 46 Z"
            fill={Colors.SvgDoodleGoldShadow}
          />
          <Circle cx={25} cy={52} r={4.5} fill={Colors.LavenderPurple} />
        </G>
        <Path
          d="M 24 55 C 20 62, 20 78, 24 85"
          stroke="url(#remDoodlePurple)"
          strokeWidth={2.4}
          strokeLinecap="round"
          fill="none"
        />
        <Path
          d="M 16 48 C 10 58, 10 82, 16 92"
          stroke="url(#remDoodlePurple)"
          strokeWidth={1.6}
          strokeLinecap="round"
          strokeDasharray="3 3"
          fill="none"
        />
        <Path
          d="M 106 55 C 110 62, 110 78, 106 85"
          stroke="url(#remDoodlePurple)"
          strokeWidth={2.4}
          strokeLinecap="round"
          fill="none"
        />
        <Path
          d="M 114 48 C 120 58, 120 82, 114 92"
          stroke="url(#remDoodlePurple)"
          strokeWidth={1.6}
          strokeLinecap="round"
          strokeDasharray="3 3"
          fill="none"
        />
        <Path
          d="M 92 24 L 94 30 L 100 32 L 94 34 L 92 40 L 90 34 L 84 32 L 90 30 Z"
          fill={Colors.AccentYellow}
        />
        <Path
          d="M 32 20 L 33 24 L 37 25 L 33 26 L 32 30 L 31 26 L 27 25 L 31 24 Z"
          fill={Colors.LavenderPurple}
        />
        <Circle cx={96} cy={95} r={3} fill={Colors.AccentGreen} opacity={0.7} />
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

export default ReminderEmptyDoodleSvg;
