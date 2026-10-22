import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, {
  Path,
  Circle,
  G,
  Defs,
  LinearGradient,
  Stop,
  Rect,
} from 'react-native-svg';

export interface SettingsWatermarkDoodleSvgProps {
  width?: number;
  height?: number;
}

/**
 * Hand-Drawn Royal Regius Crown & AI Neural Sparkle Doodle:
 * - Instantly recognizable 3-peaked royal crown with jewel tips
 * - Decorative royal headband with hand-drawn etched gemstone details
 * - Acoustic resonance soundwave arcs radiating from the crown
 * - Celebratory 4-pointed luxury starbursts and floating stardust
 * - Perfectly embodies "Regius • Crafted with AI & Precision"
 */
export const SettingsWatermarkDoodleSvg: React.FC<
  SettingsWatermarkDoodleSvgProps
> = ({ width = 135, height = 135 }) => {
  return (
    <View style={[styles.container, { width, height }]} pointerEvents="none">
      <Svg width={width} height={height} viewBox="0 0 135 135" fill="none">
        <Defs>
          {/* Imperial Gold Shimmer */}
          <LinearGradient
            id="regiusCrownGold"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <Stop offset="0%" stopColor="#FFFCE3" />
            <Stop offset="30%" stopColor="#F5C518" />
            <Stop offset="75%" stopColor="#DEAA14" />
            <Stop offset="100%" stopColor="#B47804" />
          </LinearGradient>

          {/* Crown Base Gradient */}
          <LinearGradient
            id="regiusCrownBase"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="0%"
          >
            <Stop offset="0%" stopColor="#F5C518" />
            <Stop offset="50%" stopColor="#FFF8D0" />
            <Stop offset="100%" stopColor="#D99B0F" />
          </LinearGradient>

          {/* Acoustic Lavender Resonance */}
          <LinearGradient
            id="regiusCrownLavender"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <Stop offset="0%" stopColor="#D8DBFF" />
            <Stop offset="50%" stopColor="#8383D6" />
            <Stop offset="100%" stopColor="#5E5EB2" />
          </LinearGradient>
        </Defs>

        {/* 1. Acoustic Resonance Radiating Wave Arcs (Left & Right) */}
        <Path
          d="M 16 68 C 10 52, 16 34, 28 22"
          stroke="url(#regiusCrownLavender)"
          strokeWidth={1.8}
          strokeLinecap="round"
          strokeDasharray="4 3"
          opacity={0.7}
        />
        <Path
          d="M 118 68 C 124 52, 118 34, 106 22"
          stroke="url(#regiusCrownLavender)"
          strokeWidth={1.8}
          strokeLinecap="round"
          strokeDasharray="4 3"
          opacity={0.7}
        />

        {/* 2. Celestial Starburst (Top Left) */}
        <G transform="translate(18, 12)">
          <Path
            d="M 7 0 Q 7 7, 14 7 Q 7 7, 7 14 Q 7 7, 0 7 Q 7 7, 7 0 Z"
            fill="url(#regiusCrownGold)"
          />
        </G>

        {/* 3. Celestial Starburst (Top Right) */}
        <G transform="translate(104, 16)">
          <Path
            d="M 6 0 Q 6 6, 12 6 Q 6 6, 6 12 Q 6 6, 0 6 Q 6 6, 6 0 Z"
            fill="url(#regiusCrownGold)"
          />
        </G>

        {/* 4. Mini Starburst (Mid Center Top) */}
        <G transform="translate(62, 4)">
          <Path
            d="M 4 0 Q 4 4, 8 4 Q 4 4, 4 8 Q 4 4, 0 4 Q 4 4, 4 0 Z"
            fill="url(#regiusCrownGold)"
          />
        </G>

        {/* 5. Main Royal Regius Crown (Distinct & Unmistakable) */}
        <G transform="translate(24, 26)">
          {/* Main Crown Silhouette Body */}
          <Path
            d="M 8 72 
               L 4 32 
               L 26 50 
               L 44 14 
               L 62 50 
               L 84 32 
               L 80 72 
               Z"
            fill="url(#regiusCrownGold)"
            stroke="#B47804"
            strokeWidth={2.4}
            strokeLinejoin="round"
            opacity={0.95}
          />

          {/* Left Peak Jewel Pearl */}
          <Circle
            cx={4}
            cy={30}
            r={5.5}
            fill="#FFFCE3"
            stroke="#B47804"
            strokeWidth={2}
          />
          <Circle cx={3} cy={28.5} r={1.5} fill="#FFFFFF" />

          {/* Center Highest Peak Jewel Pearl */}
          <Circle
            cx={44}
            cy={12}
            r={7}
            fill="#FFFCE3"
            stroke="#B47804"
            strokeWidth={2.2}
          />
          <Circle cx={42.5} cy={10} r={2} fill="#FFFFFF" />

          {/* Right Peak Jewel Pearl */}
          <Circle
            cx={84}
            cy={30}
            r={5.5}
            fill="#FFFCE3"
            stroke="#B47804"
            strokeWidth={2}
          />
          <Circle cx={83} cy={28.5} r={1.5} fill="#FFFFFF" />

          {/* Inner Decorative Arch Ribs */}
          <Path
            d="M 26 50 Q 35 62, 44 68 Q 53 62, 62 50"
            stroke="#FFFCE3"
            strokeWidth={2}
            strokeLinecap="round"
            fill="none"
            opacity={0.8}
          />

          {/* Royal Crown Headband Base */}
          <Rect
            x={6}
            y={70}
            width={76}
            height={14}
            rx={4}
            fill="url(#regiusCrownBase)"
            stroke="#B47804"
            strokeWidth={2}
          />

          {/* Headband Gemstones */}
          <Circle cx={18} cy={77} r={2.8} fill="#8383D6" />
          <Circle cx={31} cy={77} r={3.2} fill="#52D22E" />
          <Circle cx={44} cy={77} r={3.8} fill="#FF5B65" />
          <Circle cx={57} cy={77} r={3.2} fill="#52D22E" />
          <Circle cx={70} cy={77} r={2.8} fill="#8383D6" />
        </G>

        {/* 6. Surrounding Floating Stardust & Shimmer */}
        <Circle cx={20} cy={95} r={2} fill="#F5C518" opacity={0.8} />
        <Circle cx={116} cy={88} r={2.2} fill="#8383D6" opacity={0.75} />
        <Circle cx={28} cy={114} r={1.5} fill="#F5C518" opacity={0.6} />
        <Circle cx={102} cy={110} r={1.8} fill="#F5C518" opacity={0.7} />
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

export default SettingsWatermarkDoodleSvg;
