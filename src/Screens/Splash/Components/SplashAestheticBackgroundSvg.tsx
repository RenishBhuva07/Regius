import React from 'react';
import { Dimensions } from 'react-native';
import Svg, {
  Defs,
  LinearGradient,
  RadialGradient,
  Stop,
  Circle,
  Path,
  G,
  SvgProps,
} from 'react-native-svg';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface SplashAestheticBackgroundSvgProps extends SvgProps {
  isDark?: boolean;
}

export const SplashAestheticBackgroundSvg: React.FC<
  SplashAestheticBackgroundSvgProps
> = ({ isDark = false, ...props }) => {
  const W = SCREEN_WIDTH;
  const H = SCREEN_HEIGHT;
  const CX = W / 2;
  const CY = H * 0.42; // Centered around the avatar vessel

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
        {/* Core Dawn Radiant Halo */}
        <RadialGradient
          id="splashDawnHalo"
          cx="50%"
          cy="50%"
          r="50%"
          fx="50%"
          fy="50%"
        >
          <Stop
            offset="0%"
            stopColor={isDark ? '#F5C518' : '#FFF9D2'}
            stopOpacity={isDark ? 0.22 : 0.75}
          />
          <Stop
            offset="55%"
            stopColor={isDark ? '#8383D6' : '#FFF3B8'}
            stopOpacity={isDark ? 0.1 : 0.35}
          />
          <Stop
            offset="100%"
            stopColor={isDark ? '#121417' : '#FFFCE3'}
            stopOpacity={0}
          />
        </RadialGradient>

        {/* Diagonal Velvet Lavender Accent Aura */}
        <RadialGradient id="splashLavenderAura" cx="50%" cy="50%" r="50%">
          <Stop
            offset="0%"
            stopColor="#8383D6"
            stopOpacity={isDark ? 0.18 : 0.32}
          />
          <Stop offset="100%" stopColor="#8383D6" stopOpacity={0} />
        </RadialGradient>

        {/* Diagonal Mint Productivity Accent Aura */}
        <RadialGradient id="splashMintAura" cx="50%" cy="50%" r="50%">
          <Stop
            offset="0%"
            stopColor="#52D22E"
            stopOpacity={isDark ? 0.14 : 0.22}
          />
          <Stop offset="100%" stopColor="#52D22E" stopOpacity={0} />
        </RadialGradient>

        {/* Subtle Wave Ribbon Gradient */}
        <LinearGradient
          id="splashWaveGrad"
          x1="0"
          y1="0"
          x2={W}
          y2={H * 0.3}
          gradientUnits="userSpaceOnUse"
        >
          <Stop
            offset="0%"
            stopColor={isDark ? '#2C3038' : '#F2ECE0'}
            stopOpacity={isDark ? 0.35 : 0.55}
          />
          <Stop
            offset="100%"
            stopColor={isDark ? '#1E2228' : '#FAF6ED'}
            stopOpacity={0.05}
          />
        </LinearGradient>
      </Defs>

      {/* ── Soft Luminous Ambient Auras ── */}
      <Circle cx={CX} cy={CY} r={170} fill="url(#splashDawnHalo)" />
      <Circle
        cx={CX + 110}
        cy={CY - 90}
        r={120}
        fill="url(#splashLavenderAura)"
      />
      <Circle cx={CX - 110} cy={CY + 100} r={110} fill="url(#splashMintAura)" />

      {/* ── Concentric Acoustic Resonance Orbital Rings ── */}
      <G opacity={isDark ? 0.28 : 0.55}>
        <Circle
          cx={CX}
          cy={CY}
          r={98}
          stroke={isDark ? '#FFFFFF' : '#E8E1D3'}
          strokeWidth={1.2}
        />
        <Circle
          cx={CX}
          cy={CY}
          r={138}
          stroke={isDark ? '#8383D6' : '#DDD6C6'}
          strokeWidth={1}
          strokeDasharray="4 6"
        />
        <Circle
          cx={CX}
          cy={CY}
          r={185}
          stroke={isDark ? '#FFFFFF' : '#EAE4D7'}
          strokeWidth={1.2}
        />
        <Circle
          cx={CX}
          cy={CY}
          r={235}
          stroke={isDark ? '#F5C518' : '#E0D8C8'}
          strokeWidth={1}
          strokeDasharray="6 8"
        />
      </G>

      {/* ── Harmonic Guilloché Ribbon Waves ── */}
      <Path
        d={`M -20 ${CY - 160} Q ${W * 0.25} ${CY - 220} ${CX} ${CY - 170} T ${
          W + 20
        } ${CY - 190}`}
        stroke={isDark ? 'rgba(255,255,255,0.08)' : 'rgba(131, 131, 214, 0.16)'}
        strokeWidth={1.4}
        fill="none"
      />
      <Path
        d={`M -20 ${CY + 190} Q ${W * 0.35} ${CY + 240} ${CX} ${CY + 180} T ${
          W + 20
        } ${CY + 210}`}
        stroke={isDark ? 'rgba(245, 197, 24, 0.1)' : 'rgba(245, 197, 24, 0.2)'}
        strokeWidth={1.2}
        fill="none"
      />

      {/* ── Signature Regius 4-Point Diamond Celestial Stars (✦) ── */}
      {/* Top Left Gold Star */}
      <Path
        d={`M ${CX - 128} ${CY - 125} Q ${CX - 128} ${CY - 120} ${CX - 123} ${
          CY - 120
        } Q ${CX - 128} ${CY - 120} ${CX - 128} ${CY - 115} Q ${CX - 128} ${
          CY - 120
        } ${CX - 133} ${CY - 120} Q ${CX - 128} ${CY - 120} ${CX - 128} ${
          CY - 125
        } Z`}
        fill="#F5C518"
        opacity={isDark ? 0.85 : 0.75}
      />
      <Circle cx={CX - 128} cy={CY - 120} r={1.2} fill="#FFFFFF" />

      {/* Top Right Lavender Star */}
      <Path
        d={`M ${CX + 132} ${CY - 105} Q ${CX + 132} ${CY - 100} ${CX + 137} ${
          CY - 100
        } Q ${CX + 132} ${CY - 100} ${CX + 132} ${CY - 95} Q ${CX + 132} ${
          CY - 100
        } ${CX + 127} ${CY - 100} Q ${CX + 132} ${CY - 100} ${CX + 132} ${
          CY - 105
        } Z`}
        fill="#8383D6"
        opacity={isDark ? 0.9 : 0.8}
      />
      <Circle cx={CX + 132} cy={CY - 100} r={1.2} fill="#FFFFFF" />

      {/* Bottom Right Mint Star */}
      <Path
        d={`M ${CX + 120} ${CY + 130} Q ${CX + 120} ${CY + 135} ${CX + 125} ${
          CY + 135
        } Q ${CX + 120} ${CY + 135} ${CX + 120} ${CY + 140} Q ${CX + 120} ${
          CY + 135
        } ${CX + 115} ${CY + 135} Q ${CX + 120} ${CY + 135} ${CX + 120} ${
          CY + 130
        } Z`}
        fill="#10B981"
        opacity={isDark ? 0.85 : 0.75}
      />

      {/* Bottom Left Gold Star */}
      <Path
        d={`M ${CX - 115} ${CY + 145} Q ${CX - 115} ${CY + 149} ${CX - 111} ${
          CY + 149
        } Q ${CX - 115} ${CY + 149} ${CX - 115} ${CY + 153} Q ${CX - 115} ${
          CY + 149
        } ${CX - 119} ${CY + 149} Q ${CX - 115} ${CY + 149} ${CX - 115} ${
          CY + 145
        } Z`}
        fill="#F5C518"
        opacity={isDark ? 0.8 : 0.7}
      />

      {/* Micro Starlight Points */}
      <Circle
        cx={CX - 85}
        cy={CY - 165}
        r={1.5}
        fill={isDark ? '#F5C518' : '#B48216'}
        opacity={0.65}
      />
      <Circle
        cx={CX + 95}
        cy={CY - 155}
        r={1.8}
        fill={isDark ? '#FFFFFF' : '#8383D6'}
        opacity={0.6}
      />
      <Circle
        cx={CX - 145}
        cy={CY + 50}
        r={1.4}
        fill={isDark ? '#10B981' : '#1B9A72'}
        opacity={0.55}
      />
      <Circle
        cx={CX + 148}
        cy={CY + 60}
        r={1.6}
        fill={isDark ? '#F5C518' : '#D97706'}
        opacity={0.6}
      />
      <Circle
        cx={CX}
        cy={CY + 215}
        r={2}
        fill={isDark ? '#8383D6' : '#8383D6'}
        opacity={0.5}
      />
    </Svg>
  );
};
