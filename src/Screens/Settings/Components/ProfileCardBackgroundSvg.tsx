import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, {
  Rect,
  Circle,
  Path,
  Defs,
  LinearGradient,
  RadialGradient,
  Stop,
} from 'react-native-svg';
import Colors from '../../../Assets/StyleUtilities/Colors';

/**
 * Specular luxury ambient background for Settings ProfileCard:
 * - Radiant Solar Gold dawn aura illuminating the profile avatar and PRO badge
 * - Concentric acoustic orbital rings
 * - Royal Lavender resonance aura on top-right
 * - 4-pointed luxury starbursts and celestial stardust constellations
 */
export const ProfileCardBackgroundSvg: React.FC = React.memo(() => (
  <View style={StyleSheet.absoluteFill} pointerEvents="none">
    <Svg
      width="100%"
      height="100%"
      viewBox="0 0 360 210"
      preserveAspectRatio="xMidYMid slice"
      fill="none"
    >
      <Defs>
        {/* Soft Multi-Layer Background Gradients */}
        <LinearGradient id="profileBgSheen" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor="#252733" stopOpacity={0.7} />
          <Stop offset="50%" stopColor={Colors.NeroBlack} stopOpacity={0.2} />
          <Stop offset="100%" stopColor="#141519" stopOpacity={0.75} />
        </LinearGradient>

        {/* Top-Left Solar Gold Dawn Aura behind Avatar & PRO badge */}
        <RadialGradient
          id="profileGoldDawn"
          cx="16%"
          cy="26%"
          rx="60%"
          ry="60%"
        >
          <Stop offset="0%" stopColor="#F5C518" stopOpacity={0.26} />
          <Stop offset="40%" stopColor="#DEAA14" stopOpacity={0.1} />
          <Stop offset="80%" stopColor="#8A6409" stopOpacity={0.02} />
          <Stop offset="100%" stopColor={Colors.NeroBlack} stopOpacity={0} />
        </RadialGradient>

        {/* Top-Right Lavender / Purple Resonance Aura */}
        <RadialGradient
          id="profileLavenderAura"
          cx="88%"
          cy="18%"
          rx="55%"
          ry="55%"
        >
          <Stop offset="0%" stopColor="#9C9CE3" stopOpacity={0.32} />
          <Stop offset="45%" stopColor="#8383D6" stopOpacity={0.14} />
          <Stop offset="100%" stopColor={Colors.NeroBlack} stopOpacity={0} />
        </RadialGradient>

        {/* Bottom-Right Mint Ambient Glow */}
        <RadialGradient
          id="profileMintGlow"
          cx="80%"
          cy="85%"
          rx="40%"
          ry="40%"
        >
          <Stop offset="0%" stopColor="#52D22E" stopOpacity={0.08} />
          <Stop offset="100%" stopColor={Colors.NeroBlack} stopOpacity={0} />
        </RadialGradient>

        {/* Gold Shine for Stars */}
        <LinearGradient
          id="profileStarGold"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <Stop offset="0%" stopColor="#FFFCE3" stopOpacity={0.95} />
          <Stop offset="100%" stopColor="#F5C518" stopOpacity={0.8} />
        </LinearGradient>
      </Defs>

      {/* ── Base Ambient Glow Volumes ── */}
      <Rect width="100%" height="100%" fill="url(#profileBgSheen)" />
      <Rect width="100%" height="100%" fill="url(#profileGoldDawn)" />
      <Rect width="100%" height="100%" fill="url(#profileLavenderAura)" />
      <Rect width="100%" height="100%" fill="url(#profileMintGlow)" />

      {/* ── Concentric Orbital Rings around Avatar ── */}
      <Circle
        cx={54}
        cy={52}
        r={38}
        stroke="rgba(245, 197, 24, 0.18)"
        strokeWidth={1}
        fill="none"
      />
      <Circle
        cx={54}
        cy={52}
        r={58}
        stroke="rgba(255, 245, 184, 0.10)"
        strokeWidth={1}
        strokeDasharray="4 4"
        fill="none"
      />
      <Circle
        cx={54}
        cy={52}
        r={82}
        stroke="rgba(255, 255, 255, 0.04)"
        strokeWidth={1}
        fill="none"
      />

      {/* ── Acoustic Wave Ribbon across card ── */}
      <Path
        d="M -10 110 C 80 70, 160 140, 260 90 S 340 120, 390 95"
        stroke="rgba(156, 156, 227, 0.14)"
        strokeWidth={1.2}
        strokeLinecap="round"
        fill="none"
      />

      {/* ── Luxury 4-Point Starbursts ── */}
      <Path
        d="M 315 28 Q 315 34, 321 34 Q 315 34, 315 40 Q 315 34, 309 34 Q 315 34, 315 28 Z"
        fill="url(#profileStarGold)"
      />
      <Circle cx={335} cy={54} r={1.5} fill="#FFFCE3" opacity={0.65} />
      <Circle cx={275} cy={22} r={1.2} fill="#9C9CE3" opacity={0.5} />
      <Circle cx={145} cy={18} r={1.2} fill="#F5C518" opacity={0.6} />
    </Svg>
  </View>
));

export default ProfileCardBackgroundSvg;
