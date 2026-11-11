import React from 'react';
import { Dimensions } from 'react-native';
import Svg, {
  Defs,
  RadialGradient,
  LinearGradient,
  Stop,
  Circle,
  Path,
  G,
  SvgProps,
} from 'react-native-svg';
import { Colors, withAlpha } from '../../../Assets/StyleUtilities/Colors';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface IntroAestheticBackgroundSvgProps extends SvgProps {
  isDark?: boolean;
  accentColor?: string;
  canvasColor?: string;
}

const IntroAestheticBackgroundSvgComponent: React.FC<
  IntroAestheticBackgroundSvgProps
> = ({
  isDark = false,
  accentColor = Colors.AccentYellow,
  canvasColor,
  ...props
}) => {
  const W = SCREEN_WIDTH;
  const H = SCREEN_HEIGHT;
  const CX = W / 2;
  const DOCK_CY = H * 0.88; // Lower primary button anchor
  const CARD_CY = H * 0.68; // Carousel text slide anchor

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
        {/* Dynamic Category Ambient Aura */}
        <RadialGradient id="introCategoryAura" cx="50%" cy="50%" r="50%">
          <Stop
            offset="0%"
            stopColor={accentColor}
            stopOpacity={isDark ? 0.22 : 0.38}
          />
          <Stop
            offset="60%"
            stopColor={accentColor}
            stopOpacity={isDark ? 0.08 : 0.14}
          />
          <Stop
            offset="100%"
            stopColor={
              canvasColor ||
              (isDark ? Colors.DarkBackground : Colors.CreamBackground)
            }
            stopOpacity={0}
          />
        </RadialGradient>

        {/* Dawn Core Halo behind Dock */}
        <RadialGradient id="introDawnHalo" cx="50%" cy="50%" r="50%">
          <Stop
            offset="0%"
            stopColor={isDark ? Colors.AccentYellow : Colors.BadgeYellowBg}
            stopOpacity={isDark ? 0.25 : 0.65}
          />
          <Stop
            offset="100%"
            stopColor={
              canvasColor ||
              (isDark ? Colors.DarkBackground : Colors.CreamBackground)
            }
            stopOpacity={0}
          />
        </RadialGradient>

        {/* Subtle Wave Ribbon Gradient */}
        <LinearGradient
          id="introWaveGrad"
          x1="0"
          y1="0"
          x2={W}
          y2={0}
          gradientUnits="userSpaceOnUse"
        >
          <Stop
            offset="0%"
            stopColor={accentColor}
            stopOpacity={isDark ? 0.15 : 0.25}
          />
          <Stop
            offset="50%"
            stopColor={isDark ? Colors.LavenderPurple : Colors.RingBorder}
            stopOpacity={isDark ? 0.1 : 0.2}
          />
          <Stop offset="100%" stopColor={accentColor} stopOpacity={0.05} />
        </LinearGradient>
      </Defs>

      {/* ── Dynamic Atmospheric Glowing Auras ── */}
      <Circle cx={CX} cy={CARD_CY} r={160} fill="url(#introCategoryAura)" />
      <Circle cx={CX} cy={DOCK_CY} r={110} fill="url(#introDawnHalo)" />

      {/* ── Concentric Acoustic Resonance Rings around Dock ── */}
      <G opacity={isDark ? 0.3 : 0.55}>
        <Circle
          cx={CX}
          cy={DOCK_CY}
          r={56}
          stroke={accentColor}
          strokeWidth={1.2}
        />
        <Circle
          cx={CX}
          cy={DOCK_CY}
          r={86}
          stroke={isDark ? Colors.PureWhite : Colors.SvgPaperWarmRim}
          strokeWidth={1}
          strokeDasharray="4 6"
        />
        <Circle
          cx={CX}
          cy={DOCK_CY}
          r={128}
          stroke={isDark ? Colors.LavenderPurple : Colors.LoginInputLightBevel}
          strokeWidth={1.2}
        />
      </G>

      {/* ── Flowing Harmonic Wave Ribbons ── */}
      <Path
        d={`M -20 ${CARD_CY - 70} Q ${W * 0.28} ${CARD_CY - 120} ${CX} ${
          CARD_CY - 75
        } T ${W + 20} ${CARD_CY - 90}`}
        stroke="url(#introWaveGrad)"
        strokeWidth={1.4}
        fill="none"
      />
      <Path
        d={`M -20 ${CARD_CY + 85} Q ${W * 0.38} ${CARD_CY + 130} ${CX} ${
          CARD_CY + 80
        } T ${W + 20} ${CARD_CY + 105}`}
        stroke={
          isDark
            ? withAlpha(Colors.PureWhite, 0.06)
            : withAlpha(Colors.PureBlack, 0.04)
        }
        strokeWidth={1.2}
        fill="none"
      />

      {/* ── Signature Regius 4-Point Diamond Celestial Stars ── */}
      <Path
        d={`M ${CX - 135} ${CARD_CY - 50} Q ${CX - 135} ${CARD_CY - 46} ${
          CX - 131
        } ${CARD_CY - 46} Q ${CX - 135} ${CARD_CY - 46} ${CX - 135} ${
          CARD_CY - 42
        } Q ${CX - 135} ${CARD_CY - 46} ${CX - 139} ${CARD_CY - 46} Q ${
          CX - 135
        } ${CARD_CY - 46} ${CX - 135} ${CARD_CY - 50} Z`}
        fill={accentColor}
        opacity={isDark ? 0.9 : 0.8}
      />
      <Path
        d={`M ${CX + 140} ${CARD_CY - 30} Q ${CX + 140} ${CARD_CY - 26} ${
          CX + 144
        } ${CARD_CY - 26} Q ${CX + 140} ${CARD_CY - 26} ${CX + 140} ${
          CARD_CY - 22
        } Q ${CX + 140} ${CARD_CY - 26} ${CX + 136} ${CARD_CY - 26} Q ${
          CX + 140
        } ${CARD_CY - 26} ${CX + 140} ${CARD_CY - 30} Z`}
        fill={Colors.AccentYellow}
        opacity={isDark ? 0.85 : 0.75}
      />
      <Path
        d={`M ${CX + 115} ${DOCK_CY - 45} Q ${CX + 115} ${DOCK_CY - 41} ${
          CX + 119
        } ${DOCK_CY - 41} Q ${CX + 115} ${DOCK_CY - 41} ${CX + 115} ${
          DOCK_CY - 37
        } Q ${CX + 115} ${DOCK_CY - 41} ${CX + 111} ${DOCK_CY - 41} Q ${
          CX + 115
        } ${DOCK_CY - 41} ${CX + 115} ${DOCK_CY - 45} Z`}
        fill={accentColor}
        opacity={isDark ? 0.85 : 0.75}
      />

      {/* Micro Starlight Points */}
      <Circle
        cx={CX - 110}
        cy={CARD_CY + 50}
        r={1.5}
        fill={accentColor}
        opacity={0.65}
      />
      <Circle
        cx={CX + 125}
        cy={CARD_CY + 60}
        r={1.8}
        fill={isDark ? Colors.PureWhite : Colors.LavenderPurple}
        opacity={0.6}
      />
      <Circle
        cx={CX - 90}
        cy={DOCK_CY - 35}
        r={1.5}
        fill={isDark ? Colors.AccentYellow : Colors.WorkTextAccent}
        opacity={0.55}
      />
      <Circle
        cx={CX + 85}
        cy={DOCK_CY + 45}
        r={1.4}
        fill={accentColor}
        opacity={0.5}
      />
    </Svg>
  );
};

export const IntroAestheticBackgroundSvg = React.memo(
  IntroAestheticBackgroundSvgComponent,
);
