import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, {
  Path,
  Circle,
  G,
  Defs,
  LinearGradient,
  RadialGradient,
  Stop,
  Polygon,
} from 'react-native-svg';
import { Colors, IllustrationColors } from '../../../Assets/StyleUtilities/Colors';
import ResponsivePixels from '../../../Assets/StyleUtilities/ResponsivePixels';

export interface MilestoneWatermarkDoodleSvgProps {
  width?: number;
  height?: number;
  isDarkMode?: boolean;
}

export const MilestoneWatermarkDoodleSvg: React.FC<
  MilestoneWatermarkDoodleSvgProps
> = ({
  width = ResponsivePixels.size140,
  height = ResponsivePixels.size148,
  isDarkMode = false,
}) => {
  const mountainBaseColor = isDarkMode
    ? Colors.RoadLabelDarkBg
    : IllustrationColors.MilestoneBaseWarm;
  const mountainStroke = isDarkMode
    ? Colors.RoadNodeLockedLightBg
    : IllustrationColors.MilestoneStrokeWarm;
  const dashStroke = isDarkMode
    ? IllustrationColors.MilestoneDashSlate
    : IllustrationColors.MilestoneDashWarm;
  const flagPoleColor = isDarkMode
    ? Colors.AccentYellow
    : Colors.SvgDoodleGoldShadow;

  return (
    <View style={[styles.container, { width, height }]} pointerEvents="none">
      <Svg width={width} height={height} viewBox="0 0 140 148" fill="none">
        <Defs>
          <RadialGradient id="summitAura" cx="50%" cy="50%" r="50%">
            <Stop offset="0%" stopColor={Colors.AccentYellow} stopOpacity={0.25} />
            <Stop offset="60%" stopColor={Colors.LavenderPurple} stopOpacity={0.08} />
            <Stop offset="100%" stopColor={Colors.WarmParchment} stopOpacity={0} />
          </RadialGradient>
          <LinearGradient
            id="milestoneGold"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <Stop offset="0%" stopColor={Colors.CreamBackground} />
            <Stop offset="35%" stopColor={Colors.AccentYellow} />
            <Stop offset="75%" stopColor={Colors.HabitBurnishedAmber} />
            <Stop offset="100%" stopColor={Colors.Amber800} />
          </LinearGradient>
          <LinearGradient id="flagGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <Stop offset="0%" stopColor={Colors.AccentYellow} />
            <Stop offset="50%" stopColor={Colors.Amber400} />
            <Stop offset="100%" stopColor={Colors.HabitBurnishedAmber} />
          </LinearGradient>
          <LinearGradient
            id="accentLavender"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <Stop offset="0%" stopColor={IllustrationColors.Violet300} />
            <Stop offset="100%" stopColor={Colors.LavenderPurple} />
          </LinearGradient>
        </Defs>
        <Circle cx="80" cy="46" r="38" fill="url(#summitAura)" />
        <Path
          d="M 14 126 C 26 100, 48 108, 62 88 C 72 74, 76 56, 80 44"
          stroke={dashStroke}
          strokeWidth={1.5}
          strokeDasharray="3 4"
          strokeLinecap="round"
        />
        <Polygon
          points="24,134 52,82 82,134"
          fill={mountainBaseColor}
          stroke={mountainStroke}
          strokeWidth={1.2}
          strokeLinejoin="round"
          opacity={0.65}
        />
        <Polygon
          points="46,134 82,48 122,134"
          fill={
            isDarkMode
              ? Colors.MilestoneCloseBtnDarkBg
              : IllustrationColors.MilestonePeakWarm
          }
          stroke={mountainStroke}
          strokeWidth={1.5}
          strokeLinejoin="round"
        />
        <Polygon
          points="82,48 68,76 76,73 82,78 88,72 96,76"
          fill="url(#milestoneGold)"
          opacity={0.88}
        />
        <Path
          d="M 82 48 L 82 20"
          stroke={flagPoleColor}
          strokeWidth={2}
          strokeLinecap="round"
        />
        <Path
          d="M 82 22 C 94 18, 100 28, 114 23 C 104 31, 96 26, 82 34 Z"
          fill="url(#flagGrad)"
          stroke={Colors.Amber700}
          strokeWidth={0.8}
        />
        <Circle cx="82" cy="19" r="2.4" fill="url(#milestoneGold)" />
        <G transform="translate(112, 42)">
          <Path
            d="M 0 -8 Q 0 0 8 0 Q 0 0 0 8 Q 0 0 -8 0 Q 0 0 0 -8 Z"
            fill="url(#milestoneGold)"
          />
          <Circle cx="0" cy="0" r="1.6" fill={Colors.PureWhite} />
        </G>
        <G transform="translate(42, 34)">
          <Path
            d="M 0 -5 Q 0 0 5 0 Q 0 0 0 5 Q 0 0 -5 0 Q 0 0 0 -5 Z"
            fill="url(#accentLavender)"
          />
        </G>
        <G transform="translate(120, 96)">
          <Path
            d="M 0 -4 Q 0 0 4 0 Q 0 0 0 4 Q 0 0 -4 0 Q 0 0 0 -4 Z"
            fill="url(#milestoneGold)"
          />
        </G>
        <Circle cx="30" cy="56" r="1.3" fill={dashStroke} />
        <Circle cx="104" cy="74" r="1.4" fill={dashStroke} />
        <Circle cx="58" cy="22" r="1.2" fill={dashStroke} />
        <Circle
          cx="126"
          cy="30"
          r="1.5"
          fill={Colors.AccentYellow}
          opacity={0.8}
        />
        <Path
          d="M 10 134 Q 72 138 132 134"
          stroke={mountainStroke}
          strokeWidth={1.4}
          strokeLinecap="round"
        />
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

export default MilestoneWatermarkDoodleSvg;
