import React from 'react';
import { Dimensions } from 'react-native';
import Svg, {
  Defs,
  LinearGradient,
  RadialGradient,
  Stop,
  Path,
  Circle,
  G,
  SvgProps,
} from 'react-native-svg';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface LoginAestheticBackgroundSvgProps extends SvgProps {
  isDark?: boolean;
}

export const LoginAestheticBackgroundSvg: React.FC<
  LoginAestheticBackgroundSvgProps
> = ({ isDark = false, ...props }) => {
  const W = SCREEN_WIDTH;
  const H = SCREEN_HEIGHT;
  const CX = W / 2;
  const CREST_CY = 100;
  const CARD_CY = H * 0.52;

  const fillColor1 = isDark ? '#1E2228' : '#FAF6E8';
  const fillColor2 = isDark ? '#262B33' : '#EFF3FE';
  const fillColor3 = isDark ? '#16191F' : '#FFFDEB';

  return (
    <Svg
      width={W}
      height={H}
      viewBox={`0 0 ${W} ${H}`}
      fill="none"
      pointerEvents="none"
      {...props}
    >
      <Defs>
        {/* Top Header Organic Wave Gradients */}
        <LinearGradient
          id="loginWaveGrad1"
          x1="0"
          y1="0"
          x2={W}
          y2={220}
          gradientUnits="userSpaceOnUse"
        >
          <Stop offset="0%" stopColor={fillColor1} stopOpacity={0.7} />
          <Stop offset="100%" stopColor={fillColor3} stopOpacity={0.15} />
        </LinearGradient>

        <LinearGradient
          id="loginWaveGrad2"
          x1={W}
          y1="0"
          x2="0"
          y2="200"
          gradientUnits="userSpaceOnUse"
        >
          <Stop offset="0%" stopColor={fillColor2} stopOpacity={0.5} />
          <Stop offset="100%" stopColor={fillColor1} stopOpacity={0} />
        </LinearGradient>

        {/* Crest Golden Dawn Halo */}
        <RadialGradient id="loginCrestHalo" cx="50%" cy="50%" r="50%">
          <Stop
            offset="0%"
            stopColor={isDark ? '#F5C518' : '#FFF8D0'}
            stopOpacity={isDark ? 0.22 : 0.7}
          />
          <Stop
            offset="60%"
            stopColor={isDark ? '#8383D6' : '#FFF3B8'}
            stopOpacity={isDark ? 0.08 : 0.25}
          />
          <Stop
            offset="100%"
            stopColor={isDark ? '#121417' : '#FFFCE3'}
            stopOpacity={0}
          />
        </RadialGradient>

        {/* Form Card Ambient Lavender Aura */}
        <RadialGradient id="loginLavenderAura" cx="50%" cy="50%" r="50%">
          <Stop
            offset="0%"
            stopColor="#8383D6"
            stopOpacity={isDark ? 0.18 : 0.28}
          />
          <Stop offset="100%" stopColor="#8383D6" stopOpacity={0} />
        </RadialGradient>

        {/* Bottom Mint Accent Aura */}
        <RadialGradient id="loginMintAura" cx="50%" cy="50%" r="50%">
          <Stop
            offset="0%"
            stopColor="#52D22E"
            stopOpacity={isDark ? 0.12 : 0.2}
          />
          <Stop offset="100%" stopColor="#52D22E" stopOpacity={0} />
        </RadialGradient>
      </Defs>

      {/* ── Top Signature Organic Wave Geometry ── */}
      <Path
        d={`M 0 0 H ${W} V 135 C ${W * 0.82} 170 ${W * 0.69} 115 ${
          W * 0.5
        } 150 C ${W * 0.32} 185 ${W * 0.16} 155 0 175 V 0 Z`}
        fill="url(#loginWaveGrad1)"
      />
      <Path
        d={`M ${W} 0 H 0 V 100 C ${W * 0.16} 130 ${W * 0.37} 85 ${
          W * 0.58
        } 120 C ${W * 0.8} 155 ${W * 0.88} 125 ${W} 145 V 0 Z`}
        fill="url(#loginWaveGrad2)"
      />

      {/* ── Ambient Glowing Auras ── */}
      <Circle cx={CX} cy={CREST_CY} r={120} fill="url(#loginCrestHalo)" />
      <Circle
        cx={W - 40}
        cy={CARD_CY - 50}
        r={140}
        fill="url(#loginLavenderAura)"
      />
      <Circle cx={40} cy={CARD_CY + 120} r={130} fill="url(#loginMintAura)" />

      {/* ── Acoustic Resonance Rings behind Crest ── */}
      <G opacity={isDark ? 0.26 : 0.45}>
        <Circle
          cx={CX}
          cy={CREST_CY}
          r={58}
          stroke={isDark ? '#FFFFFF' : '#EAE4D7'}
          strokeWidth={1.2}
        />
        <Circle
          cx={CX}
          cy={CREST_CY}
          r={82}
          stroke={isDark ? '#8383D6' : '#DDD6C6'}
          strokeWidth={1}
          strokeDasharray="4 6"
        />
        <Circle
          cx={CX}
          cy={CREST_CY}
          r={112}
          stroke={isDark ? '#F5C518' : '#E8E1D3'}
          strokeWidth={1.2}
        />
      </G>

      {/* ── Subtle Harmonic Wave Ribbons ── */}
      <Path
        d={`M -20 ${H * 0.82} Q ${W * 0.3} ${H * 0.86} ${CX} ${H * 0.81} T ${
          W + 20
        } ${H * 0.84}`}
        stroke={isDark ? 'rgba(255,255,255,0.06)' : 'rgba(131, 131, 214, 0.14)'}
        strokeWidth={1.2}
        fill="none"
      />

      {/* ── Signature Regius 4-Point Celestial Stars ── */}
      <Path
        d={`M ${CX - 120} ${CREST_CY - 25} Q ${CX - 120} ${CREST_CY - 21} ${
          CX - 116
        } ${CREST_CY - 21} Q ${CX - 120} ${CREST_CY - 21} ${CX - 120} ${
          CREST_CY - 17
        } Q ${CX - 120} ${CREST_CY - 21} ${CX - 124} ${CREST_CY - 21} Q ${
          CX - 120
        } ${CREST_CY - 21} ${CX - 120} ${CREST_CY - 25} Z`}
        fill="#F5C518"
        opacity={isDark ? 0.85 : 0.75}
      />
      <Path
        d={`M ${CX + 122} ${CREST_CY - 15} Q ${CX + 122} ${CREST_CY - 11} ${
          CX + 126
        } ${CREST_CY - 11} Q ${CX + 122} ${CREST_CY - 11} ${CX + 122} ${
          CREST_CY - 7
        } Q ${CX + 122} ${CREST_CY - 11} ${CX + 118} ${CREST_CY - 11} Q ${
          CX + 122
        } ${CREST_CY - 11} ${CX + 122} ${CREST_CY - 15} Z`}
        fill="#8383D6"
        opacity={isDark ? 0.9 : 0.8}
      />
      <Path
        d={`M ${W - 35} ${CARD_CY + 180} Q ${W - 35} ${CARD_CY + 184} ${
          W - 31
        } ${CARD_CY + 184} Q ${W - 35} ${CARD_CY + 184} ${W - 35} ${
          CARD_CY + 188
        } Q ${W - 35} ${CARD_CY + 184} ${W - 39} ${CARD_CY + 184} Q ${W - 35} ${
          CARD_CY + 184
        } ${W - 35} ${CARD_CY + 180} Z`}
        fill="#52D22E"
        opacity={isDark ? 0.8 : 0.7}
      />

      {/* Micro Starlight Points */}
      <Circle
        cx={CX - 80}
        cy={CREST_CY + 65}
        r={1.6}
        fill={isDark ? '#F5C518' : '#B48216'}
        opacity={0.6}
      />
      <Circle
        cx={CX + 90}
        cy={CREST_CY + 55}
        r={1.8}
        fill={isDark ? '#FFFFFF' : '#8383D6'}
        opacity={0.65}
      />
      <Circle
        cx={35}
        cy={CARD_CY + 180}
        r={1.5}
        fill={isDark ? '#F5C518' : '#D97706'}
        opacity={0.55}
      />
      <Circle
        cx={W - 45}
        cy={CARD_CY - 110}
        r={1.6}
        fill={isDark ? '#8383D6' : '#8383D6'}
        opacity={0.6}
      />
      <Circle
        cx={CX}
        cy={H * 0.92}
        r={1.8}
        fill={isDark ? '#8383D6' : '#B48216'}
        opacity={0.5}
      />
    </Svg>
  );
};
