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
import Colors from '../Assets/StyleUtilities/Colors';

export type ToastAestheticVariant = 'success' | 'error' | 'warning' | 'info';

interface ToastAestheticPatternSvgProps {
  variant: ToastAestheticVariant;
  isDarkMode?: boolean;
  activeThemeId?: string;
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
    gradStart: Colors.ToastSuccessCardLightStart,
    gradMid: Colors.ToastSuccessCardLightMid,
    gradEnd: Colors.ToastSuccessCardLightEnd,
    auraColor: Colors.ToastSuccessAccent,
    auraOpacity: 0.2,
    ringColor: Colors.ToastSuccessIcon,
    ringOpacity: 0.12,
    waveColor: Colors.ToastSuccessAccent,
    waveOpacity: 0.14,
    rimColor: Colors.PureWhite,
    rimOpacity: 0.85,
  },
  warning: {
    gradStart: Colors.SvgWarmIvoryMist,
    gradMid: Colors.BadgeYellowBg,
    gradEnd: Colors.Yellow200,
    auraColor: Colors.AccentYellow,
    auraOpacity: 0.22,
    ringColor: Colors.BadgeYellowText,
    ringOpacity: 0.12,
    waveColor: Colors.HabitBurnishedAmber,
    waveOpacity: 0.15,
    rimColor: Colors.PureWhite,
    rimOpacity: 0.85,
  },
  error: {
    gradStart: Colors.CategoryRoseBg,
    gradMid: Colors.BadgeRedBg,
    gradEnd: Colors.CategoryRoseBorder,
    auraColor: Colors.CrimsonPulse,
    auraOpacity: 0.18,
    ringColor: Colors.CategoryRedCheck,
    ringOpacity: 0.12,
    waveColor: Colors.CategoryRedAccent,
    waveOpacity: 0.14,
    rimColor: Colors.PureWhite,
    rimOpacity: 0.85,
  },
  info: {
    gradStart: Colors.ToastInfoCardLightMid,
    gradMid: Colors.BadgePurpleBg,
    gradEnd: Colors.ToastInfoCardLightEnd,
    auraColor: Colors.LavenderPurple,
    auraOpacity: 0.24,
    ringColor: Colors.IndigoAccent,
    ringOpacity: 0.12,
    waveColor: Colors.LavenderPurple,
    waveOpacity: 0.15,
    rimColor: Colors.PureWhite,
    rimOpacity: 0.85,
  },
};

const DARK_PALETTES: Record<ToastAestheticVariant, AestheticColorPalette> = {
  success: {
    gradStart: Colors.ToastSuccessCardDarkStart,
    gradMid: Colors.ToastSuccessCardDarkMid,
    gradEnd: Colors.ToastSuccessCardDarkEnd,
    auraColor: Colors.ToastSuccessAccent,
    auraOpacity: 0.35,
    ringColor: Colors.ToastSuccessCardBevelLight,
    ringOpacity: 0.16,
    waveColor: Colors.ToastSuccessAccent,
    waveOpacity: 0.18,
    rimColor: Colors.ToastSuccessBadgeBevelLight,
    rimOpacity: 0.35,
  },
  warning: {
    gradStart: Colors.ToastWarningCardDarkStart,
    gradMid: Colors.ToastWarningCardDarkMid,
    gradEnd: Colors.ToastWarningCardDarkEnd,
    auraColor: Colors.AccentYellow,
    auraOpacity: 0.35,
    ringColor: Colors.Amber400,
    ringOpacity: 0.16,
    waveColor: Colors.AccentYellow,
    waveOpacity: 0.18,
    rimColor: Colors.ToastWarningCardBorderLight,
    rimOpacity: 0.35,
  },
  error: {
    gradStart: Colors.ToastErrorCardDarkStart,
    gradMid: Colors.ToastErrorCardDarkMid,
    gradEnd: Colors.ToastErrorCardDarkEnd,
    auraColor: Colors.CrimsonPulse,
    auraOpacity: 0.35,
    ringColor: Colors.ToastErrorCardBevelLight,
    ringOpacity: 0.16,
    waveColor: Colors.CrimsonPulse,
    waveOpacity: 0.18,
    rimColor: Colors.ToastErrorBadgeBevelLight,
    rimOpacity: 0.35,
  },
  info: {
    gradStart: Colors.ToastInfoCardDarkStart,
    gradMid: Colors.ToastInfoCardDarkMid,
    gradEnd: Colors.ToastInfoCardDarkEnd,
    auraColor: Colors.LavenderPurple,
    auraOpacity: 0.35,
    ringColor: Colors.ToastInfoBadgeBevelLight,
    ringOpacity: 0.16,
    waveColor: Colors.LavenderPurple,
    waveOpacity: 0.18,
    rimColor: Colors.ToastInfoCardBorderLight,
    rimOpacity: 0.35,
  },
};

export const ToastAestheticPatternSvg: React.FC<ToastAestheticPatternSvgProps> =
  React.memo(({ variant, isDarkMode = false, activeThemeId }) => {
    let palette =
      (isDarkMode ? DARK_PALETTES : LIGHT_PALETTES)[variant] ||
      (isDarkMode ? DARK_PALETTES.info : LIGHT_PALETTES.info);

    if (activeThemeId === 'cyprus_sand' && variant === 'info') {
      palette = isDarkMode
        ? {
            gradStart: Colors.CyprusTealDeep,
            gradMid: Colors.CyprusTealDark,
            gradEnd: Colors.CyprusTealAbyss,
            auraColor: Colors.CyprusTealLight,
            auraOpacity: 0.45,
            ringColor: Colors.CyprusSandPaper,
            ringOpacity: 0.22,
            waveColor: Colors.CyprusTealLight,
            waveOpacity: 0.25,
            rimColor: Colors.CyprusSandPaper,
            rimOpacity: 0.4,
          }
        : {
            gradStart: Colors.CreamSurfaceAlt,
            gradMid: Colors.CyprusSandPaper,
            gradEnd: Colors.CyprusSandAlt,
            auraColor: Colors.CyprusTealLight,
            auraOpacity: 0.24,
            ringColor: Colors.CyprusTeal,
            ringOpacity: 0.15,
            waveColor: Colors.CyprusTealLight,
            waveOpacity: 0.18,
            rimColor: Colors.PureWhite,
            rimOpacity: 0.85,
          };
    }

    const gradId = `toastGrad_${variant}_${activeThemeId || 'default'}_${isDarkMode ? 'dark' : 'light'}`;
    const auraId = `toastAura_${variant}_${activeThemeId || 'default'}_${isDarkMode ? 'dark' : 'light'}`;
    const rimId = `toastRim_${variant}_${activeThemeId || 'default'}_${isDarkMode ? 'dark' : 'light'}`;

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
              <Stop offset="0%" stopColor={Colors.CreamBackground} stopOpacity={0.95} />
              <Stop offset="100%" stopColor={Colors.AccentYellow} stopOpacity={0.8} />
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
            <Circle cx={0} cy={0} r={0.7} fill={Colors.PureWhite} />
          </G>
          <G transform="translate(338, 50)">
            <Path
              d="M 0 -3 Q 0 0 3 0 Q 0 0 0 3 Q 0 0 -3 0 Q 0 0 0 -3 Z"
              fill="url(#toastGoldStar)"
            />
            <Circle cx={0} cy={0} r={0.5} fill={Colors.PureWhite} />
          </G>
          <Circle
            cx={285}
            cy={22}
            r={0.75}
            fill={Colors.CreamBackground}
            opacity={isDarkMode ? 0.6 : 0.45}
          />
          <Circle
            cx={326}
            cy={38}
            r={0.7}
            fill={Colors.AccentYellow}
            opacity={isDarkMode ? 0.6 : 0.45}
          />
        </Svg>
      </View>
    );
  });

export default ToastAestheticPatternSvg;
