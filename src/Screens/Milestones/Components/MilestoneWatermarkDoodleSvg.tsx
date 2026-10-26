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

export interface MilestoneWatermarkDoodleSvgProps {
  width?: number;
  height?: number;
  isDarkMode?: boolean;
}

export const MilestoneWatermarkDoodleSvg: React.FC<
  MilestoneWatermarkDoodleSvgProps
> = ({ width = 140, height = 148, isDarkMode = false }) => {
  const mountainBaseColor = isDarkMode ? '#1E232B' : '#E8E2D2';
  const mountainStroke = isDarkMode ? '#3A4250' : '#C8C0AC';
  const dashStroke = isDarkMode ? '#4D586B' : '#B5AD98';
  const flagPoleColor = isDarkMode ? '#F5C518' : '#D99B0F';

  return (
    <View style={[styles.container, { width, height }]} pointerEvents="none">
      <Svg width={width} height={height} viewBox="0 0 140 148" fill="none">
        <Defs>
          {/* Radiant Summit Gold Aura */}
          <RadialGradient id="summitAura" cx="50%" cy="50%" r="50%">
            <Stop offset="0%" stopColor="#F5C518" stopOpacity={0.25} />
            <Stop offset="60%" stopColor="#8383D6" stopOpacity={0.08} />
            <Stop offset="100%" stopColor="#FAF7EF" stopOpacity={0} />
          </RadialGradient>

          {/* Victory Gold Gradient */}
          <LinearGradient
            id="milestoneGold"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <Stop offset="0%" stopColor="#FFFCE3" />
            <Stop offset="35%" stopColor="#F5C518" />
            <Stop offset="75%" stopColor="#D97706" />
            <Stop offset="100%" stopColor="#92400E" />
          </LinearGradient>

          {/* Flag Banner Gradient */}
          <LinearGradient id="flagGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <Stop offset="0%" stopColor="#F5C518" />
            <Stop offset="50%" stopColor="#FBBF24" />
            <Stop offset="100%" stopColor="#D97706" />
          </LinearGradient>

          {/* Violet Lavender Accent */}
          <LinearGradient
            id="accentLavender"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <Stop offset="0%" stopColor="#C4B5FD" />
            <Stop offset="100%" stopColor="#8383D6" />
          </LinearGradient>
        </Defs>

        {/* Ambient Summit Aura Glow */}
        <Circle cx="80" cy="46" r="38" fill="url(#summitAura)" />

        {/* Ascending Dashed Trail / Roadmap Loop */}
        <Path
          d="M 14 126 C 26 100, 48 108, 62 88 C 72 74, 76 56, 80 44"
          stroke={dashStroke}
          strokeWidth={1.5}
          strokeDasharray="3 4"
          strokeLinecap="round"
        />

        {/* Mountain Silhouette Base: Secondary peak */}
        <Polygon
          points="24,134 52,82 82,134"
          fill={mountainBaseColor}
          stroke={mountainStroke}
          strokeWidth={1.2}
          strokeLinejoin="round"
          opacity={0.65}
        />

        {/* Mountain Silhouette Main Summit: Majestic Center/Right Peak */}
        <Polygon
          points="46,134 82,48 122,134"
          fill={isDarkMode ? '#242A35' : '#DDD6C4'}
          stroke={mountainStroke}
          strokeWidth={1.5}
          strokeLinejoin="round"
        />

        {/* Mountain Snowcap / Crest Facet */}
        <Polygon
          points="82,48 68,76 76,73 82,78 88,72 96,76"
          fill="url(#milestoneGold)"
          opacity={0.88}
        />

        {/* Summit Flagpole */}
        <Path
          d="M 82 48 L 82 20"
          stroke={flagPoleColor}
          strokeWidth={2}
          strokeLinecap="round"
        />

        {/* Fluttering Summit Victory Flag */}
        <Path
          d="M 82 22 C 94 18, 100 28, 114 23 C 104 31, 96 26, 82 34 Z"
          fill="url(#flagGrad)"
          stroke="#B45309"
          strokeWidth={0.8}
        />

        {/* Finial Ball on Top of Flagpole */}
        <Circle cx="82" cy="19" r="2.4" fill="url(#milestoneGold)" />

        {/* Floating Radiant 4-Point Golden Starburst at Summit Apex */}
        <G transform="translate(112, 42)">
          <Path
            d="M 0 -8 Q 0 0 8 0 Q 0 0 0 8 Q 0 0 -8 0 Q 0 0 0 -8 Z"
            fill="url(#milestoneGold)"
          />
          <Circle cx="0" cy="0" r="1.6" fill="#FFFFFF" />
        </G>

        {/* Secondary Sparkle Star (Top Left) */}
        <G transform="translate(42, 34)">
          <Path
            d="M 0 -5 Q 0 0 5 0 Q 0 0 0 5 Q 0 0 -5 0 Q 0 0 0 -5 Z"
            fill="url(#accentLavender)"
          />
        </G>

        {/* Tiny Sparkle Star (Bottom Right) */}
        <G transform="translate(120, 96)">
          <Path
            d="M 0 -4 Q 0 0 4 0 Q 0 0 0 4 Q 0 0 -4 0 Q 0 0 0 -4 Z"
            fill="url(#milestoneGold)"
          />
        </G>

        {/* Stardust Celestial Dots */}
        <Circle cx="30" cy="56" r="1.3" fill={dashStroke} />
        <Circle cx="104" cy="74" r="1.4" fill={dashStroke} />
        <Circle cx="58" cy="22" r="1.2" fill={dashStroke} />
        <Circle cx="126" cy="30" r="1.5" fill="#F5C518" opacity={0.8} />

        {/* Base Ground Contour Arc */}
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
