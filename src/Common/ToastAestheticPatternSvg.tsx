import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, {
  Path,
  Circle,
  Rect,
  G,
  Defs,
  LinearGradient,
  RadialGradient,
  Stop,
} from 'react-native-svg';

export type ToastAestheticVariant = 'success' | 'error' | 'warning' | 'info';

interface ToastAestheticPatternSvgProps {
  variant: ToastAestheticVariant;
  isDarkMode?: boolean;
}

interface AestheticColorPalette {
  gradStart: string;
  gradMid: string;
  gradEnd: string;
  auraColor: string;
  auraOpacity: number;
  ringColor: string;
  ringOpacity: number;
  waveColor: string;
  waveOpacity: number;
  rimColor: string;
  rimOpacity: number;
}

const LIGHT_PALETTES: Record<ToastAestheticVariant, AestheticColorPalette> = {
  success: {
    gradStart: '#F0FDF5',
    gradMid: '#E6FAF0',
    gradEnd: '#DCFCE7',
    auraColor: '#10B981',
    auraOpacity: 0.2,
    ringColor: '#059669',
    ringOpacity: 0.12,
    waveColor: '#10B981',
    waveOpacity: 0.14,
    rimColor: '#FFFFFF',
    rimOpacity: 0.85,
  },
  warning: {
    gradStart: '#FFFDF2',
    gradMid: '#FFF8D0',
    gradEnd: '#FEF08A',
    auraColor: '#F5C518',
    auraOpacity: 0.22,
    ringColor: '#B47804',
    ringOpacity: 0.12,
    waveColor: '#D97706',
    waveOpacity: 0.15,
    rimColor: '#FFFFFF',
    rimOpacity: 0.85,
  },
  error: {
    gradStart: '#FFF1F2',
    gradMid: '#FEEFEF',
    gradEnd: '#FECDD3',
    auraColor: '#FF3B30',
    auraOpacity: 0.18,
    ringColor: '#DC2626',
    ringOpacity: 0.12,
    waveColor: '#EF4444',
    waveOpacity: 0.14,
    rimColor: '#FFFFFF',
    rimOpacity: 0.85,
  },
  info: {
    gradStart: '#F4F5FE',
    gradMid: '#EEF0FD',
    gradEnd: '#E2E5FC',
    auraColor: '#8383D6',
    auraOpacity: 0.24,
    ringColor: '#6366F1',
    ringOpacity: 0.12,
    waveColor: '#8383D6',
    waveOpacity: 0.15,
    rimColor: '#FFFFFF',
    rimOpacity: 0.85,
  },
};

const DARK_PALETTES: Record<ToastAestheticVariant, AestheticColorPalette> = {
  success: {
    gradStart: '#0F241A',
    gradMid: '#142E22',
    gradEnd: '#0A1C14',
    auraColor: '#10B981',
    auraOpacity: 0.35,
    ringColor: '#34D399',
    ringOpacity: 0.16,
    waveColor: '#10B981',
    waveOpacity: 0.18,
    rimColor: '#6EE7B7',
    rimOpacity: 0.35,
  },
  warning: {
    gradStart: '#2A1F08',
    gradMid: '#33270B',
    gradEnd: '#1F1604',
    auraColor: '#F5C518',
    auraOpacity: 0.35,
    ringColor: '#FBBF24',
    ringOpacity: 0.16,
    waveColor: '#F5C518',
    waveOpacity: 0.18,
    rimColor: '#FDE047',
    rimOpacity: 0.35,
  },
  error: {
    gradStart: '#2D1013',
    gradMid: '#3A1519',
    gradEnd: '#220B0D',
    auraColor: '#FF3B30',
    auraOpacity: 0.35,
    ringColor: '#F87171',
    ringOpacity: 0.16,
    waveColor: '#FF3B30',
    waveOpacity: 0.18,
    rimColor: '#FCA5A5',
    rimOpacity: 0.35,
  },
  info: {
    gradStart: '#18162E',
    gradMid: '#201D3D',
    gradEnd: '#121024',
    auraColor: '#8383D6',
    auraOpacity: 0.35,
    ringColor: '#A5B4FC',
    ringOpacity: 0.16,
    waveColor: '#8383D6',
    waveOpacity: 0.18,
    rimColor: '#C7D2FE',
    rimOpacity: 0.35,
  },
};

export const ToastAestheticPatternSvg: React.FC<ToastAestheticPatternSvgProps> =
  React.memo(({ variant, isDarkMode = false }) => {
    const palette =
      (isDarkMode ? DARK_PALETTES : LIGHT_PALETTES)[variant] ||
      (isDarkMode ? DARK_PALETTES.info : LIGHT_PALETTES.info);

    const gradId = `toastGrad_${variant}_${isDarkMode ? 'dark' : 'light'}`;
    const auraId = `toastAura_${variant}_${isDarkMode ? 'dark' : 'light'}`;
    const rimId = `toastRim_${variant}_${isDarkMode ? 'dark' : 'light'}`;

    return (
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <Svg
          width="100%"
          height="100%"
          viewBox="0 0 360 68"
          preserveAspectRatio="none"
          fill="none"
        >
          <Defs>
            <LinearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor={palette.gradStart} stopOpacity={1} />
              <Stop offset="50%" stopColor={palette.gradMid} stopOpacity={1} />
              <Stop offset="100%" stopColor={palette.gradEnd} stopOpacity={1} />
            </LinearGradient>
            <RadialGradient id={auraId} cx="12%" cy="50%" rx="45%" ry="75%">
              <Stop
                offset="0%"
                stopColor={palette.auraColor}
                stopOpacity={palette.auraOpacity}
              />
              <Stop
                offset="100%"
                stopColor={palette.auraColor}
                stopOpacity={0}
              />
            </RadialGradient>
            <LinearGradient id={rimId} x1="0%" y1="0%" x2="100%" y2="0%">
              <Stop
                offset="0%"
                stopColor={palette.rimColor}
                stopOpacity={0.05}
              />
              <Stop
                offset="25%"
                stopColor={palette.rimColor}
                stopOpacity={palette.rimOpacity}
              />
              <Stop
                offset="75%"
                stopColor={palette.rimColor}
                stopOpacity={palette.rimOpacity * 0.7}
              />
              <Stop
                offset="100%"
                stopColor={palette.rimColor}
                stopOpacity={0.05}
              />
            </LinearGradient>
            <LinearGradient
              id="toastGoldStar"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <Stop offset="0%" stopColor="#FFFCE3" stopOpacity={0.95} />
              <Stop offset="100%" stopColor="#F5C518" stopOpacity={0.8} />
            </LinearGradient>
          </Defs>
          <Rect width="100%" height="100%" fill={`url(#${gradId})`} />
          <Rect width="100%" height="100%" fill={`url(#${auraId})`} />
          <Path
            d="M 20 1 L 340 1"
            stroke={`url(#${rimId})`}
            strokeWidth={1.2}
            strokeLinecap="round"
          />
          <Circle
            cx={34}
            cy={34}
            r={18}
            stroke={palette.ringColor}
            strokeWidth={1}
            strokeOpacity={palette.ringOpacity}
            fill="none"
          />
          <Circle
            cx={34}
            cy={34}
            r={32}
            stroke={palette.ringColor}
            strokeWidth={1}
            strokeDasharray="3 4"
            strokeOpacity={palette.ringOpacity * 0.8}
            fill="none"
          />
          <Circle
            cx={34}
            cy={34}
            r={48}
            stroke={palette.ringColor}
            strokeWidth={0.9}
            strokeOpacity={palette.ringOpacity * 0.5}
            fill="none"
          />
          <Path
            d="M 60 48 Q 140 20, 220 42 T 345 32"
            stroke={palette.waveColor}
            strokeWidth={1}
            strokeOpacity={palette.waveOpacity}
            strokeLinecap="round"
            fill="none"
          />
          <Path
            d="M 50 56 Q 150 28, 240 50 T 350 40"
            stroke={palette.waveColor}
            strokeWidth={1}
            strokeDasharray="4 5"
            strokeOpacity={palette.waveOpacity * 0.65}
            strokeLinecap="round"
            fill="none"
          />
          <G transform="translate(305, 16)">
            <Path
              d="M 0 -4.5 Q 0 0 4.5 0 Q 0 0 0 4.5 Q 0 0 -4.5 0 Q 0 0 0 -4.5 Z"
              fill="url(#toastGoldStar)"
            />
            <Circle cx={0} cy={0} r={0.7} fill="#FFFFFF" />
          </G>
          <G transform="translate(338, 50)">
            <Path
              d="M 0 -3 Q 0 0 3 0 Q 0 0 0 3 Q 0 0 -3 0 Q 0 0 0 -3 Z"
              fill="url(#toastGoldStar)"
            />
            <Circle cx={0} cy={0} r={0.5} fill="#FFFFFF" />
          </G>
          <Circle
            cx={285}
            cy={22}
            r={0.75}
            fill="#FFFCE3"
            opacity={isDarkMode ? 0.6 : 0.45}
          />
          <Circle
            cx={326}
            cy={38}
            r={0.7}
            fill="#F5C518"
            opacity={isDarkMode ? 0.6 : 0.45}
          />
        </Svg>
      </View>
    );
  });

export default ToastAestheticPatternSvg;
