import React from 'react';
import Svg, {
  Path,
  Rect,
  Circle,
  Defs,
  LinearGradient,
  Stop,
  SvgProps,
} from 'react-native-svg';

// Auth SVG icons and illustrations
export const RegiusCrownCrestSvg: React.FC<
  SvgProps & { glowColor?: string }
> = ({ glowColor: _glowColor, ...props }) => {
  return (
    <Svg width={96} height={96} viewBox="0 0 96 96" fill="none" {...props}>
      <Defs>
        <LinearGradient
          id="crestGrad"
          x1="0"
          y1="0"
          x2="96"
          y2="96"
          gradientUnits="userSpaceOnUse"
        >
          <Stop offset="0%" stopColor="#FFFFFF" />
          <Stop offset="100%" stopColor="#FFFCE3" />
        </LinearGradient>
        <LinearGradient
          id="purpleGrad"
          x1="16"
          y1="16"
          x2="80"
          y2="80"
          gradientUnits="userSpaceOnUse"
        >
          <Stop offset="0%" stopColor="#9C9CE8" />
          <Stop offset="100%" stopColor="#8383D6" />
        </LinearGradient>
        <LinearGradient
          id="goldGrad"
          x1="28"
          y1="28"
          x2="68"
          y2="68"
          gradientUnits="userSpaceOnUse"
        >
          <Stop offset="0%" stopColor="#FFE066" />
          <Stop offset="100%" stopColor="#F5C518" />
        </LinearGradient>
      </Defs>

      {/* Outer Soft Halo Ring */}
      <Circle cx={48} cy={48} r={46} fill="#FFFFFF" fillOpacity={0.7} />
      <Circle cx={48} cy={48} r={45} stroke="#E8E2D5" strokeWidth={1.5} />

      {/* Inner Elevated Shield */}
      <Circle cx={48} cy={48} r={38} fill="url(#crestGrad)" />
      <Circle cx={48} cy={48} r={38} stroke="#D8DBFF" strokeWidth={1.5} />

      {/* Regius Signature Purple Core */}
      <Circle cx={48} cy={48} r={28} fill="url(#purpleGrad)" />

      {/* Crown Motif */}
      <Path
        d="M36 56H60L58 45L52 50L48 40L44 50L38 45L36 56Z"
        fill="url(#goldGrad)"
        stroke="#FFF"
        strokeWidth={1}
        strokeLinejoin="round"
      />

      {/* Crown Jewels */}
      <Circle cx={38} cy={43} r={2} fill="#FFFFFF" />
      <Circle cx={48} cy={38} r={2.5} fill="#FFFFFF" />
      <Circle cx={58} cy={43} r={2} fill="#FFFFFF" />

      {/* Base Ribbon Line */}
      <Path
        d="M35 58H61"
        stroke="#FFFFFF"
        strokeWidth={2}
        strokeLinecap="round"
      />

      {/* Sparkles */}
      <Path
        d="M68 28L69.5 32.5L74 34L69.5 35.5L68 40L66.5 35.5L62 34L66.5 32.5L68 28Z"
        fill="#F5C518"
      />
      <Path
        d="M26 62L27 65L30 66L27 67L26 70L25 67L22 66L25 65L26 62Z"
        fill="#8383D6"
      />
    </Svg>
  );
};

export const DecorativeHeaderWavesSvg: React.FC<
  SvgProps & { isDark?: boolean }
> = ({ isDark = false, ...props }) => {
  const fillColor1 = isDark ? '#1E2228' : '#FAF6E8';
  const fillColor2 = isDark ? '#262B33' : '#EFF3FE';
  const fillColor3 = isDark ? '#16191F' : '#FFFDEB';

  return (
    <Svg
      width="100%"
      height={220}
      viewBox="0 0 375 220"
      fill="none"
      preserveAspectRatio="none"
      {...props}
    >
      <Defs>
        <LinearGradient
          id="waveGrad1"
          x1="0"
          y1="0"
          x2="375"
          y2="220"
          gradientUnits="userSpaceOnUse"
        >
          <Stop offset="0%" stopColor={fillColor1} stopOpacity={0.7} />
          <Stop offset="100%" stopColor={fillColor3} stopOpacity={0.15} />
        </LinearGradient>
        <LinearGradient
          id="waveGrad2"
          x1="375"
          y1="0"
          x2="0"
          y2="200"
          gradientUnits="userSpaceOnUse"
        >
          <Stop offset="0%" stopColor={fillColor2} stopOpacity={0.5} />
          <Stop offset="100%" stopColor={fillColor1} stopOpacity={0} />
        </LinearGradient>
      </Defs>

      {/* Gentle organic wash */}
      <Path
        d="M0 0H375V135C310 170 260 115 190 150C120 185 60 155 0 175V0Z"
        fill="url(#waveGrad1)"
      />

      {/* Layered pastel accent aura */}
      <Path
        d="M375 0H0V100C60 130 140 85 220 120C300 155 330 125 375 145V0Z"
        fill="url(#waveGrad2)"
      />

      {/* Ambient glowing celestial orbs matching screen layout */}
      <Circle
        cx={315}
        cy={65}
        r={28}
        fill={isDark ? '#2E3540' : '#EDFDF5'}
        fillOpacity={0.55}
      />
      <Circle
        cx={55}
        cy={125}
        r={18}
        fill={isDark ? '#2C3038' : '#FFFCEB'}
        fillOpacity={0.8}
      />
      <Circle
        cx={338}
        cy={155}
        r={8}
        fill={isDark ? '#3A424F' : '#D8DBFF'}
        fillOpacity={0.75}
      />
    </Svg>
  );
};

export const MailFieldSvg: React.FC<SvgProps & { color?: string }> = ({
  color = '#8383D6',
  ...props
}) => (
  <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" {...props}>
    <Rect
      x={2}
      y={4}
      width={20}
      height={16}
      rx={4}
      stroke={color}
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M2.5 7L10.5858 13.0643C11.4172 13.6879 12.5828 13.6879 13.4142 13.0643L21.5 7"
      stroke={color}
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const LockFieldSvg: React.FC<SvgProps & { color?: string }> = ({
  color = '#8383D6',
  ...props
}) => (
  <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" {...props}>
    <Rect
      x={4}
      y={10}
      width={16}
      height={11}
      rx={3}
      stroke={color}
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M7 10V7C7 4.23858 9.23858 2 12 2C14.7614 2 17 4.23858 17 7V10"
      stroke={color}
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Circle cx={12} cy={15.5} r={1.5} fill={color} />
  </Svg>
);

export const UserFieldSvg: React.FC<SvgProps & { color?: string }> = ({
  color = '#8383D6',
  ...props
}) => (
  <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" {...props}>
    <Circle cx={12} cy={7} r={4} stroke={color} strokeWidth={1.8} />
    <Path
      d="M4 21C4 17.134 7.58172 14 12 14C16.4183 14 20 17.134 20 21"
      stroke={color}
      strokeWidth={1.8}
      strokeLinecap="round"
    />
  </Svg>
);

export const EyeOpenSvg: React.FC<SvgProps & { color?: string }> = ({
  color = '#7E838F',
  ...props
}) => (
  <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z"
      stroke={color}
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Circle cx={12} cy={12} r={3} stroke={color} strokeWidth={1.8} />
  </Svg>
);

export const EyeClosedSvg: React.FC<SvgProps & { color?: string }> = ({
  color = '#7E838F',
  ...props
}) => (
  <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M17.94 17.94A10.07 10.07 0 0112 20C5 20 1 12 1 12A18.45 18.45 0 015.06 6.06M9.9 4.24A9.12 9.12 0 0112 4C19 4 23 12 23 12A18.5 18.5 0 0119.78 16.22M1 1L23 23"
      stroke={color}
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M9.88 9.88A3 3 0 1014.12 14.12"
      stroke={color}
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const TactileCheckmarkSvg: React.FC<SvgProps & { color?: string }> = ({
  color = '#52D22E',
  ...props
}) => (
  <Svg width={14} height={14} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M20 6L9 17L4 12"
      stroke={color}
      strokeWidth={3.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const GoogleLogoSvg: React.FC<SvgProps & { size?: number }> = ({
  size = 20,
  ...props
}) => (
  <Svg width={size} height={size} viewBox="0 0 48 48" {...props}>
    <Path
      fill="#EA4335"
      d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.7 17.74 9.5 24 9.5z"
    />
    <Path
      fill="#4285F4"
      d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
    />
    <Path
      fill="#FBBC05"
      d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
    />
    <Path
      fill="#34A853"
      d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
    />
  </Svg>
);

export const AppleLogoSvg: React.FC<
  SvgProps & { size?: number; color?: string }
> = ({ size = 20, color = '#FFFFFF', ...props }) => (
  <Svg width={size} height={size} viewBox="0 0 384 512" {...props}>
    <Path
      fill={color}
      d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"
    />
  </Svg>
);

export const SparkleSvg: React.FC<
  SvgProps & { color?: string; size?: number }
> = ({ color = '#F5C518', size = 18, ...props }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z"
      fill={color}
    />
  </Svg>
);
