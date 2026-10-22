import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Svg, {
  Path,
  Circle,
  G,
  Defs,
  LinearGradient,
  RadialGradient,
  Stop,
  Line,
  Polygon,
} from 'react-native-svg';
import { VoiceAssistantState } from '../../../../Services/Voice/VoiceStateMachine';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export interface VoiceAcousticDoodleSvgProps {
  width?: number;
  height?: number;
  isDarkMode?: boolean;
  state?: VoiceAssistantState;
}

/**
 * Extraordinary Voice Acoustic Doodle & Celestial Neural Atmosphere:
 * - Concentric dashed acoustic resonance orbits encircling the holographic orb
 * - Sonic reverberation wave arcs emanating dynamically (chime resonance)
 * - Regius Signature 4-Point Diamond Celestial Stars in 24K Gold, Lavender & Emerald Mint
 * - Hand-drawn acoustic music note doodle (♫) with soundwave rings
 * - Imperial Regius micro-crown doodle of triumph & luxury
 * - Electric ambition lightning spark & speed burst flourishes
 * - Swirling stardust dashed loops & ambient cosmic micro-particles
 * - Warm ambient radial glow aura adapting seamlessly to Light/Dark mode
 */
export const VoiceAcousticDoodleSvg: React.FC<VoiceAcousticDoodleSvgProps> = ({
  width = SCREEN_WIDTH,
  height = SCREEN_HEIGHT * 0.85,
  isDarkMode = false,
  state: _state,
}) => {
  // Center of the orb on the sheet - tuned so the round doodle frames the holograph slightly below its visual center
  const orbCenterX = width / 2;
  const orbCenterY = Math.round(Math.min(SCREEN_HEIGHT * 0.38, 318));

  // Theme-adaptive color accents
  const auraColor1 = isDarkMode ? '#8383D6' : '#9D9BF0';
  const auraColor2 = isDarkMode ? '#F5C518' : '#FDE68A';
  const dashColor = isDarkMode ? 'rgba(255, 255, 255, 0.22)' : '#D4CCA8';
  const goldColor = isDarkMode ? '#FBBF24' : '#F5C518';
  const lavenderColor = isDarkMode ? '#A78BFA' : '#8383D6';
  const mintColor = isDarkMode ? '#34D399' : '#10B981';
  const coralColor = isDarkMode ? '#FB7185' : '#FF8772';

  return (
    <View style={[styles.container, { width, height }]} pointerEvents="none">
      <Svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        fill="none"
      >
        <Defs>
          {/* 1. Ambient Warm Radial Luminous Aura behind Orb */}
          <RadialGradient id="voiceOrbAura" cx="50%" cy="50%" r="50%">
            <Stop
              offset="0%"
              stopColor={auraColor1}
              stopOpacity={isDarkMode ? 0.32 : 0.18}
            />
            <Stop
              offset="55%"
              stopColor={auraColor2}
              stopOpacity={isDarkMode ? 0.16 : 0.1}
            />
            <Stop
              offset="100%"
              stopColor={isDarkMode ? '#111317' : '#FAF8F5'}
              stopOpacity={0}
            />
          </RadialGradient>

          {/* 2. Imperial 24K Gold Starlight Gradient */}
          <LinearGradient id="vadGold" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#FFFCE3" />
            <Stop offset="45%" stopColor="#F5C518" />
            <Stop offset="100%" stopColor="#D97706" />
          </LinearGradient>

          {/* 3. Royal Lavender Gem Gradient */}
          <LinearGradient id="vadLavender" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#EEF0FD" />
            <Stop offset="50%" stopColor="#8383D6" />
            <Stop offset="100%" stopColor="#5B58E6" />
          </LinearGradient>

          {/* 4. Fresh Mint Gradient */}
          <LinearGradient id="vadMint" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#D1FAE5" />
            <Stop offset="50%" stopColor="#10B981" />
            <Stop offset="100%" stopColor="#047857" />
          </LinearGradient>

          {/* 5. Electric Coral Gradient */}
          <LinearGradient id="vadCoral" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#FFE4E6" />
            <Stop offset="50%" stopColor="#FF8772" />
            <Stop offset="100%" stopColor="#E11D48" />
          </LinearGradient>
        </Defs>

        {/* ─── Layer 1: Ambient Luminous Aura ─── */}
        <Circle
          cx={orbCenterX}
          cy={orbCenterY}
          r={Math.min(width * 0.46, 175)}
          fill="url(#voiceOrbAura)"
        />

        {/* ─── Layer 2: Hand-Drawn Cosmic Speed & Acoustic Orbits ─── */}
        {/* Inner concentric dashed acoustic orbit */}
        <Circle
          cx={orbCenterX}
          cy={orbCenterY}
          r={Math.min(width * 0.38, 142)}
          stroke={dashColor}
          strokeWidth={1.2}
          strokeDasharray="4 6"
          opacity={0.65}
        />

        {/* Outer tilted elliptical orbit */}
        <Path
          d={`M ${orbCenterX - 165} ${orbCenterY - 20} C ${orbCenterX - 140} ${
            orbCenterY - 110
          }, ${orbCenterX + 140} ${orbCenterY - 110}, ${orbCenterX + 165} ${
            orbCenterY - 20
          } C ${orbCenterX + 140} ${orbCenterY + 80}, ${orbCenterX - 140} ${
            orbCenterY + 80
          }, ${orbCenterX - 165} ${orbCenterY - 20}`}
          stroke={lavenderColor}
          strokeWidth={1.2}
          strokeDasharray="3 5"
          opacity={0.5}
        />

        {/* Wide sweeping planetary acoustic arc (bottom-left to upper-right) */}
        <Path
          d={`M 18 ${orbCenterY + 95} C 40 ${orbCenterY - 80}, ${width - 60} ${
            orbCenterY - 130
          }, ${width - 16} ${orbCenterY - 45}`}
          stroke={dashColor}
          strokeWidth={1.1}
          strokeDasharray="4 6"
          opacity={0.55}
          strokeLinecap="round"
        />

        {/* ─── Layer 3: Acoustic Reverberation Sound Waves ─── */}
        {/* Left acoustic soundwaves ))) */}
        <G opacity={0.75}>
          <Path
            d={`M ${orbCenterX - 150} ${orbCenterY - 32} C ${
              orbCenterX - 165
            } ${orbCenterY - 10}, ${orbCenterX - 165} ${orbCenterY + 10}, ${
              orbCenterX - 150
            } ${orbCenterY + 32}`}
            stroke={goldColor}
            strokeWidth={1.8}
            strokeLinecap="round"
          />
          <Path
            d={`M ${orbCenterX - 164} ${orbCenterY - 45} C ${
              orbCenterX - 182
            } ${orbCenterY - 15}, ${orbCenterX - 182} ${orbCenterY + 15}, ${
              orbCenterX - 164
            } ${orbCenterY + 45}`}
            stroke={lavenderColor}
            strokeWidth={1.5}
            strokeDasharray="2 3"
            strokeLinecap="round"
          />
          <Path
            d={`M ${orbCenterX - 178} ${orbCenterY - 22} C ${
              orbCenterX - 192
            } ${orbCenterY - 6}, ${orbCenterX - 192} ${orbCenterY + 6}, ${
              orbCenterX - 178
            } ${orbCenterY + 22}`}
            stroke={mintColor}
            strokeWidth={1.3}
            strokeLinecap="round"
          />
        </G>

        {/* Right acoustic soundwaves ((( */}
        <G opacity={0.75}>
          <Path
            d={`M ${orbCenterX + 150} ${orbCenterY - 32} C ${
              orbCenterX + 165
            } ${orbCenterY - 10}, ${orbCenterX + 165} ${orbCenterY + 10}, ${
              orbCenterX + 150
            } ${orbCenterY + 32}`}
            stroke={lavenderColor}
            strokeWidth={1.8}
            strokeLinecap="round"
          />
          <Path
            d={`M ${orbCenterX + 164} ${orbCenterY - 45} C ${
              orbCenterX + 182
            } ${orbCenterY - 15}, ${orbCenterX + 182} ${orbCenterY + 15}, ${
              orbCenterX + 164
            } ${orbCenterY + 45}`}
            stroke={goldColor}
            strokeWidth={1.5}
            strokeDasharray="2 3"
            strokeLinecap="round"
          />
          <Path
            d={`M ${orbCenterX + 178} ${orbCenterY - 22} C ${
              orbCenterX + 192
            } ${orbCenterY - 6}, ${orbCenterX + 192} ${orbCenterY + 6}, ${
              orbCenterX + 178
            } ${orbCenterY + 22}`}
            stroke={coralColor}
            strokeWidth={1.3}
            strokeLinecap="round"
          />
        </G>

        {/* ─── Layer 4: Regius Signature 4-Point Celestial Diamond Stars ─── */}
        {/* Top-Left Grand 24K Gold Celestial Diamond Star */}
        <G
          transform={`translate(28, ${Math.max(orbCenterY - 180, 24)})`}
          opacity={0.92}
        >
          <Path
            d="M 10 0 Q 10 10, 20 10 Q 10 10, 10 20 Q 10 10, 0 10 Q 10 10, 10 0 Z"
            fill="url(#vadGold)"
          />
          <Circle cx={10} cy={10} r={1.8} fill="#FFFFFF" />
        </G>

        {/* Top-Right Royal Lavender Celestial Diamond Star */}
        <G
          transform={`translate(${width - 48}, ${Math.max(
            orbCenterY - 175,
            26,
          )})`}
          opacity={0.9}
        >
          <Path
            d="M 9 0 Q 9 9, 18 9 Q 9 9, 9 18 Q 9 9, 0 9 Q 9 9, 9 0 Z"
            fill="url(#vadLavender)"
          />
          <Circle cx={9} cy={9} r={1.6} fill="#FFFFFF" />
        </G>

        {/* Mid-Left Mint Diamond Sparkle */}
        <G transform={`translate(22, ${orbCenterY + 70})`} opacity={0.85}>
          <Path
            d="M 6.5 0 Q 6.5 6.5, 13 6.5 Q 6.5 6.5, 6.5 13 Q 6.5 6.5, 0 6.5 Q 6.5 6.5, 6.5 0 Z"
            fill="url(#vadMint)"
          />
          <Circle cx={6.5} cy={6.5} r={1.2} fill="#FFFFFF" />
        </G>

        {/* Mid-Right Coral Diamond Sparkle */}
        <G
          transform={`translate(${width - 42}, ${orbCenterY + 65})`}
          opacity={0.88}
        >
          <Path
            d="M 6 0 Q 6 6, 12 6 Q 6 6, 6 12 Q 6 6, 0 6 Q 6 6, 6 0 Z"
            fill="url(#vadCoral)"
          />
          <Circle cx={6} cy={6} r={1.2} fill="#FFFFFF" />
        </G>

        {/* Upper-Center Delicate Mini Gold Star */}
        <G
          transform={`translate(${orbCenterX + 70}, ${Math.max(
            orbCenterY - 190,
            16,
          )})`}
          opacity={0.82}
        >
          <Path
            d="M 4.5 0 Q 4.5 4.5, 9 4.5 Q 4.5 4.5, 4.5 9 Q 4.5 4.5, 0 4.5 Q 4.5 4.5, 4.5 0 Z"
            fill="url(#vadGold)"
          />
        </G>

        {/* ─── Layer 5: Extraordinary Hand-Drawn Feature Doodles ─── */}
        {/* DOODLE A: Regius Tilted Micro-Crown of Luxury (Top-Left) */}
        <G
          transform={`translate(48, ${Math.max(
            orbCenterY - 145,
            55,
          )}) rotate(-8)`}
          opacity={0.92}
        >
          {/* Crown base velvet cushion dome */}
          <Path
            d="M 4 20 C 8 10, 24 10, 28 20 Z"
            fill={isDarkMode ? '#311068' : '#EEF0FD'}
            stroke={lavenderColor}
            strokeWidth={0.8}
          />
          {/* Crown 3-point gold filigree peaks */}
          <Path
            d="M 2 20 L 5 8 L 11 14 L 16 5 L 21 14 L 27 8 L 30 20 Z"
            fill="url(#vadGold)"
            stroke="#92400E"
            strokeWidth={0.8}
            strokeLinejoin="round"
          />
          {/* Pearl finials on the 3 peaks */}
          <Circle cx={5} cy={8} r={1.5} fill="#FFFCE3" />
          <Circle cx={16} cy={5} r={1.8} fill="#FFFCE3" />
          <Circle cx={27} cy={8} r={1.5} fill="#FFFCE3" />
          {/* Crown headband rim */}
          <Path
            d="M 1 20 C 10 23, 22 23, 31 20 L 31 23 C 22 26, 10 26, 1 23 Z"
            fill="url(#vadGold)"
            stroke="#78350F"
            strokeWidth={0.7}
          />
          {/* Tiny center jewel */}
          <Circle cx={16} cy={22} r={1.2} fill="url(#vadCoral)" />
          {/* Crown sparkle beam */}
          <Line
            x1={16}
            y1={1}
            x2={16}
            y2={3}
            stroke="#F5C518"
            strokeWidth={1}
            strokeLinecap="round"
          />
        </G>

        {/* DOODLE B: Acoustic Melody Note & Chime Rings (Top-Right) */}
        <G
          transform={`translate(${width - 76}, ${Math.max(
            orbCenterY - 148,
            50,
          )}) rotate(12)`}
          opacity={0.92}
        >
          {/* Hand-drawn Musical Eighth Note */}
          <Circle cx={8} cy={18} r={4} fill="url(#vadLavender)" />
          <Path
            d="M 12 18 L 12 4 C 18 2, 22 7, 24 10"
            stroke={lavenderColor}
            strokeWidth={1.8}
            strokeLinecap="round"
            fill="none"
          />
          {/* Melody sound chime rings */}
          <Path
            d="M 20 2 C 24 4, 26 8, 26 12"
            stroke={goldColor}
            strokeWidth={1.2}
            strokeLinecap="round"
            fill="none"
          />
          <Path
            d="M 23 0 C 28 3, 30 8, 30 14"
            stroke={dashColor}
            strokeWidth={1}
            strokeDasharray="2 2"
            strokeLinecap="round"
            fill="none"
          />
        </G>

        {/* DOODLE C: Electric Ambition Lightning Bolt (Mid-Right) */}
        <G
          transform={`translate(${width - 48}, ${orbCenterY - 20}) rotate(14)`}
          opacity={0.9}
        >
          <Polygon
            points="6,0 0,8 4.5,8 1,16 9,7 4.5,7"
            fill="url(#vadGold)"
            stroke="#D97706"
            strokeWidth={0.8}
            strokeLinejoin="round"
          />
        </G>

        {/* DOODLE D: Playful Flourish Loop-de-loop (Mid-Left) */}
        <G transform={`translate(28, ${orbCenterY - 24})`} opacity={0.75}>
          <Path
            d="M 2 18 C 14 2, 26 2, 22 18 C 18 30, 6 22, 14 12 C 20 4, 32 10, 36 24"
            stroke={dashColor}
            strokeWidth={1.3}
            strokeLinecap="round"
            fill="none"
          />
        </G>

        {/* ─── Layer 6: Ambient Celestial Stardust Micro-Dots ─── */}
        <Circle
          cx={orbCenterX - 85}
          cy={orbCenterY - 155}
          r={1.4}
          fill={goldColor}
          opacity={0.75}
        />
        <Circle
          cx={orbCenterX + 105}
          cy={orbCenterY - 145}
          r={1.2}
          fill={lavenderColor}
          opacity={0.7}
        />
        <Circle
          cx={orbCenterX - 130}
          cy={orbCenterY + 45}
          r={1.5}
          fill={mintColor}
          opacity={0.65}
        />
        <Circle
          cx={orbCenterX + 125}
          cy={orbCenterY + 50}
          r={1.3}
          fill={goldColor}
          opacity={0.7}
        />
        <Circle
          cx={38}
          cy={orbCenterY - 45}
          r={1.2}
          fill={lavenderColor}
          opacity={0.6}
        />
        <Circle
          cx={width - 55}
          cy={orbCenterY + 20}
          r={1.4}
          fill={coralColor}
          opacity={0.65}
        />
        <Circle
          cx={orbCenterX}
          cy={orbCenterY - 185}
          r={1.3}
          fill={goldColor}
          opacity={0.6}
        />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default VoiceAcousticDoodleSvg;
