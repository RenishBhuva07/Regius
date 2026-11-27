import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Animated, Easing } from 'react-native';
import Svg, {
  Defs,
  LinearGradient,
  RadialGradient,
  Stop,
  Rect,
  Circle,
  Path,
  G,
  Line,
} from 'react-native-svg';
import { Colors, IllustrationColors } from '../Assets/StyleUtilities/Colors';
import { DiurnalPhase } from '../Utils/taskDateUtils';

export interface PickerAestheticBgProps {
  type: 'date' | 'time';
  isDarkMode?: boolean;
  timePeriod?: DiurnalPhase | 'day' | 'night';
  width?: number;
  height?: number;
}

export const PickerAestheticBg: React.FC<PickerAestheticBgProps> = React.memo(
  ({
    type,
    isDarkMode = false,
    timePeriod = 'day',
    width = 400,
    height = 340,
  }) => {
    const isDate = type === 'date';
    const isNight = !isDate && timePeriod === 'night';
    const W = Math.max(width, 100);
    const H = Math.max(height, 100);

    // Diurnal transition animation: 0 = Day (Sun up, Moon down), 1 = Night (Moon up, Sun down)
    const animValue = useRef(new Animated.Value(isNight ? 1 : 0)).current;

    useEffect(() => {
      if (isDate) return;
      Animated.timing(animValue, {
        toValue: isNight ? 1 : 0,
        duration: 480,
        easing: Easing.bezier(0.22, 1, 0.36, 1),
        useNativeDriver: true,
      }).start();
    }, [isNight, isDate, animValue]);

    // Sun animations: Day = up at 0, Night = sinks down +65
    const sunTranslateY = animValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 65],
    });
    const sunOpacity = animValue.interpolate({
      inputRange: [0, 0.65, 1],
      outputRange: [1, 0.15, 0],
    });
    const sunScale = animValue.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 0.78],
    });

    // Moon animations: Night = up at 0, Day = sinks down +65
    const moonTranslateY = animValue.interpolate({
      inputRange: [0, 1],
      outputRange: [65, 0],
    });
    const moonOpacity = animValue.interpolate({
      inputRange: [0, 0.35, 1],
      outputRange: [0, 0.15, 1],
    });
    const moonScale = animValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0.78, 1],
    });

    const diamondStar = (cx: number, cy: number, s: number) =>
      `M ${cx} ${cy - s} Q ${cx} ${cy}, ${cx + s} ${cy} Q ${cx} ${cy}, ${cx} ${
        cy + s
      } Q ${cx} ${cy}, ${cx - s} ${cy} Q ${cx} ${cy}, ${cx} ${cy - s} Z`;

    // 8 Solar Solstice ticks for Date mode only
    const dateSolarTicks = Array.from({ length: 8 }).map((_, i) => {
      const angle = ((i * 360) / 8) * (Math.PI / 180);
      return (
        <Line
          key={`date-solar-tick-${i}`}
          x1={340 + 72 * Math.cos(angle)}
          y1={60 + 72 * Math.sin(angle)}
          x2={340 + 84 * Math.cos(angle)}
          y2={60 + 84 * Math.sin(angle)}
          stroke={isDarkMode ? Colors.AccentYellow : Colors.SolarGoldStroke}
          strokeWidth={1.3}
          strokeLinecap="round"
        />
      );
    });

    // 12 Radiant Sunbeams radiating around the Sun at (295, 165)
    const sunburstRays = Array.from({ length: 12 }).map((_, i) => {
      const angle = ((i * 360) / 12) * (Math.PI / 180);
      const isMajor = i % 3 === 0;
      const isLong = i % 2 === 0;
      const rInner = 28;
      const rOuter = isMajor ? 44 : isLong ? 39 : 35;
      return (
        <Line
          key={`sun-ray-${i}`}
          x1={295 + rInner * Math.cos(angle)}
          y1={165 + rInner * Math.sin(angle)}
          x2={295 + rOuter * Math.cos(angle)}
          y2={165 + rOuter * Math.sin(angle)}
          stroke={
            isMajor
              ? Colors.AccentYellow
              : isLong
              ? Colors.HeroSunGlowYellow
              : Colors.SolarGoldStroke
          }
          strokeWidth={isMajor ? 2.2 : isLong ? 1.6 : 1.1}
          strokeLinecap="round"
          strokeOpacity={isDarkMode ? 0.75 : 0.88}
        />
      );
    });

    // Canvas Background Gradients
    let gradStart = Colors.PureWhite;
    let gradMid = Colors.PickerDateSheenMid;
    let gradEnd = Colors.PickerDateSheenEnd;
    let topAuraColor = Colors.AccentYellow;
    let bottomAuraColor = Colors.SolarGoldAura;

    if (isNight) {
      gradStart = Colors.BentoStopSlate;
      gradMid = Colors.ToastInfoCardDarkMid;
      gradEnd = Colors.ToastInfoCardDarkEnd;
      topAuraColor = Colors.LavenderPurple;
      bottomAuraColor = Colors.MindfulTextAccent;
    } else if (!isDate) {
      if (isDarkMode) {
        gradStart = Colors.DarkCardBackground;
        gradMid = '#171B22';
        gradEnd = Colors.SvgSectionVoid;
      } else {
        gradStart = '#FFFDF8';
        gradMid = '#FAF7EE';
        gradEnd = '#F5EFE1';
      }
      topAuraColor = Colors.HeroSunGlowYellow;
      bottomAuraColor = Colors.CategorySkyAccent;
    } else if (isDate) {
      if (isDarkMode) {
        gradStart = Colors.DarkCardBackground;
        gradMid = Colors.WorkDarkBg;
        gradEnd = Colors.SvgSectionVoid;
      } else {
        gradStart = Colors.PureWhite;
        gradMid = Colors.PickerDateSheenMid;
        gradEnd = Colors.PickerDateSheenEnd;
      }
      topAuraColor = Colors.AccentYellow;
      bottomAuraColor = Colors.SolarGoldAura;
    }

    const gradSuffix = `${type}-${isNight ? 'night' : 'day'}-${
      isDarkMode ? 'dark' : 'light'
    }`;

    return (
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        {/* BASE CANVAS LAYER: Background gradient sheen & ambient auras (fills card) */}
        <Svg
          width="100%"
          height="100%"
          viewBox={`0 0 ${W} ${H}`}
          preserveAspectRatio="none"
        >
          <Defs>
            <LinearGradient
              id={`pickerSheenGrad-${gradSuffix}`}
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <Stop offset="0%" stopColor={gradStart} stopOpacity={0.99} />
              <Stop offset="55%" stopColor={gradMid} stopOpacity={0.97} />
              <Stop offset="100%" stopColor={gradEnd} stopOpacity={0.99} />
            </LinearGradient>
            <RadialGradient
              id={`pickerTopAura-${gradSuffix}`}
              cx={W - 60}
              cy={140}
              r={175}
              gradientUnits="userSpaceOnUse"
            >
              <Stop
                offset="0%"
                stopColor={topAuraColor}
                stopOpacity={isNight ? 0.38 : isDarkMode ? 0.22 : 0.26}
              />
              <Stop
                offset="50%"
                stopColor={topAuraColor}
                stopOpacity={isNight ? 0.14 : isDarkMode ? 0.08 : 0.08}
              />
              <Stop offset="100%" stopColor={topAuraColor} stopOpacity={0} />
            </RadialGradient>
            <RadialGradient
              id={`pickerBottomAura-${gradSuffix}`}
              cx={40}
              cy={H - 40}
              r={145}
              gradientUnits="userSpaceOnUse"
            >
              <Stop
                offset="0%"
                stopColor={bottomAuraColor}
                stopOpacity={isNight ? 0.24 : isDarkMode ? 0.14 : 0.16}
              />
              <Stop
                offset="50%"
                stopColor={bottomAuraColor}
                stopOpacity={isNight ? 0.08 : isDarkMode ? 0.05 : 0.05}
              />
              <Stop offset="100%" stopColor={bottomAuraColor} stopOpacity={0} />
            </RadialGradient>
          </Defs>

          <Rect
            x="0"
            y="0"
            width={W}
            height={H}
            fill={`url(#pickerSheenGrad-${gradSuffix})`}
          />
          <Rect
            x="0"
            y="0"
            width={W}
            height={H}
            fill={`url(#pickerTopAura-${gradSuffix})`}
          />
          <Rect
            x="0"
            y="0"
            width={W}
            height={H}
            fill={`url(#pickerBottomAura-${gradSuffix})`}
          />

          {/* DATE MODE ARTWORK: Astronomical Solstice Dial & Celestial Rings */}
          {isDate && (
            <>
              <G opacity={isDarkMode ? 0.26 : 0.34}>
                <Circle
                  cx={340}
                  cy={60}
                  r={50}
                  stroke={Colors.AccentYellow}
                  strokeWidth={1}
                  fill="none"
                />
                <Circle
                  cx={340}
                  cy={60}
                  r={72}
                  stroke={Colors.SolarGoldStroke}
                  strokeWidth={1}
                  strokeDasharray="4 6"
                  fill="none"
                />
                <Circle
                  cx={340}
                  cy={60}
                  r={110}
                  stroke={Colors.AccentYellow}
                  strokeWidth={0.8}
                  fill="none"
                />
                <Circle
                  cx={340}
                  cy={60}
                  r={145}
                  stroke={Colors.SolarGoldStroke}
                  strokeWidth={0.6}
                  strokeDasharray="3 5"
                  fill="none"
                />
              </G>
              <G opacity={isDarkMode ? 0.3 : 0.4}>{dateSolarTicks}</G>
              <G opacity={isDarkMode ? 0.24 : 0.3}>
                <Circle
                  cx={40}
                  cy={H - 50}
                  r={48}
                  stroke={Colors.SolarGoldStroke}
                  strokeWidth={1}
                  strokeDasharray="3 4"
                  fill="none"
                />
                <Circle
                  cx={40}
                  cy={H - 50}
                  r={80}
                  stroke={Colors.AccentYellow}
                  strokeWidth={0.8}
                  fill="none"
                />
              </G>
              <Path
                d={diamondStar(320, 45, 5)}
                fill={Colors.SolarGoldSpark}
                opacity={0.55}
              />
              <Path
                d={diamondStar(345, 135, 3.5)}
                fill={Colors.SolarGoldStroke}
                opacity={0.45}
              />
              <Path
                d={diamondStar(70, H - 75, 4.5)}
                fill={Colors.AccentYellow}
                opacity={0.5}
              />
            </>
          )}
        </Svg>

        {/* TIME MODE ANIMATED LAYERS (Uniform scaling preserves perfect circles) */}
        {!isDate && (
          <>
            {/* 1. DAY CELESTIAL LAYER: Radiant Sun & Soft Clouds (rises up on Day, descends on Night) */}
            <Animated.View
              style={[
                StyleSheet.absoluteFill,
                {
                  opacity: sunOpacity,
                  transform: [{ translateY: sunTranslateY }, { scale: sunScale }],
                },
              ]}
              pointerEvents="none"
            >
              <Svg
                width="100%"
                height="100%"
                viewBox={`0 0 ${W} ${H}`}
                preserveAspectRatio="xMidYMid meet"
              >
                {/* Soft Solar Radiance Rings centered at safe (295, 165) */}
                <G opacity={isDarkMode ? 0.28 : 0.38}>
                  <Circle
                    cx={295}
                    cy={165}
                    r={42}
                    stroke={Colors.AccentYellow}
                    strokeWidth={1}
                    fill="none"
                  />
                  <Circle
                    cx={295}
                    cy={165}
                    r={65}
                    stroke={Colors.SolarGoldStroke}
                    strokeWidth={0.8}
                    strokeDasharray="4 6"
                    fill="none"
                  />
                </G>

                {/* Radiant Sunbeams */}
                <G>{sunburstRays}</G>

                {/* Luminous Sun Disc at (295, 165) - Safe from all buttons and chips */}
                <Circle
                  cx={295}
                  cy={165}
                  r={24}
                  fill={Colors.HeroSunGlowYellow}
                  opacity={isDarkMode ? 0.8 : 0.95}
                />
                <Circle
                  cx={295}
                  cy={165}
                  r={18}
                  fill={IllustrationColors.SunburstYellow}
                  opacity={isDarkMode ? 0.9 : 0.98}
                />
                <Circle
                  cx={291}
                  cy={161}
                  r={5.5}
                  fill={Colors.PureWhite}
                  opacity={0.5}
                />

                {/* Back Cloud (Drifting upper left of the sun) */}
                <Path
                  d="M 205 150 A 14 14 0 0 1 228 140 A 18 18 0 0 1 258 144 A 13 13 0 0 1 275 157 A 11 11 0 0 1 266 169 L 210 169 A 11 11 0 0 1 205 150 Z"
                  fill={
                    isDarkMode
                      ? 'rgba(255, 255, 255, 0.12)'
                      : 'rgba(255, 255, 255, 0.88)'
                  }
                  stroke={
                    isDarkMode
                      ? 'rgba(255, 255, 255, 0.22)'
                      : 'rgba(235, 230, 218, 0.85)'
                  }
                  strokeWidth={0.9}
                />

                {/* Front Cloud (Floating across lower edge of the sun) */}
                <Path
                  d="M 250 174 A 16 16 0 0 1 279 161 A 22 22 0 0 1 317 165 A 17 17 0 0 1 339 179 A 13 13 0 0 1 327 194 L 257 194 A 13 13 0 0 1 250 174 Z"
                  fill={
                    isDarkMode
                      ? 'rgba(255, 255, 255, 0.18)'
                      : 'rgba(255, 255, 255, 0.96)'
                  }
                  stroke={
                    isDarkMode
                      ? 'rgba(255, 255, 255, 0.28)'
                      : 'rgba(228, 222, 208, 0.95)'
                  }
                  strokeWidth={1.2}
                />

                {/* Daylight Sparkles */}
                <Path
                  d={diamondStar(235, 122, 4.5)}
                  fill={Colors.SolarGoldSpark}
                  opacity={0.65}
                />
                <Path
                  d={diamondStar(340, 135, 4)}
                  fill={Colors.HeroSunGlowYellow}
                  opacity={0.8}
                />
                <Path
                  d={diamondStar(55, 150, 4.5)}
                  fill={Colors.CategorySkyAccent}
                  opacity={0.55}
                />
                <Path
                  d={diamondStar(115, H - 45, 3)}
                  fill={Colors.SolarGoldSpark}
                  opacity={0.45}
                />
              </Svg>
            </Animated.View>

            {/* 2. NIGHT CELESTIAL LAYER: Iconic Crescent Moon & Multiple Stars (rises up on Night, descends on Day) */}
            <Animated.View
              style={[
                StyleSheet.absoluteFill,
                {
                  opacity: moonOpacity,
                  transform: [{ translateY: moonTranslateY }, { scale: moonScale }],
                },
              ]}
              pointerEvents="none"
            >
              <Svg
                width="100%"
                height="100%"
                viewBox={`0 0 ${W} ${H}`}
                preserveAspectRatio="xMidYMid meet"
              >
                {/* Soft Moonlight Glow centered at (295, 165) */}
                <Circle
                  cx={295}
                  cy={165}
                  r={44}
                  fill={Colors.LavenderPurple}
                  opacity={0.22}
                />
                <Circle
                  cx={295}
                  cy={165}
                  r={32}
                  fill={Colors.PeriwinkleSoft}
                  opacity={0.18}
                />
                <Circle
                  cx={295}
                  cy={165}
                  r={58}
                  stroke={Colors.PeriwinkleSoft}
                  strokeWidth={0.8}
                  strokeDasharray="3 4"
                  fill="none"
                  opacity={0.35}
                />

                {/* ICONIC CRESCENT MOON (Scaled Lucide/Feather dual-circle formula: 100% distortion-free) */}
                <G
                  transform="translate(268, 138) scale(2.25)"
                >
                  <Path
                    d="M 21 12.79 A 9 9 0 1 1 11.21 3 A 7 7 0 0 0 21 12.79 Z"
                    fill={Colors.PureWhite}
                    opacity={0.96}
                  />
                  <Path
                    d="M 21 12.79 A 9 9 0 1 1 11.21 3 A 7 7 0 0 0 21 12.79 Z"
                    fill={Colors.SvgOrbLavenderLight}
                    opacity={0.35}
                  />
                </G>

                {/* MULTIPLE STARS: Scattered across the entire open night sky */}
                {/* A. Top Sky Stars (Visible between Title and Done button) */}
                <Path
                  d={diamondStar(175, 36, 5)}
                  fill={Colors.PureWhite}
                  opacity={0.9}
                />
                <Path
                  d={diamondStar(220, 48, 3.8)}
                  fill={Colors.PeriwinkleSoft}
                  opacity={0.8}
                />
                <Circle
                  cx={198}
                  cy={28}
                  r={1.6}
                  fill={Colors.PureWhite}
                  opacity={0.85}
                />
                <Circle
                  cx={245}
                  cy={38}
                  r={1.3}
                  fill={Colors.SvgOrbLavenderLight}
                  opacity={0.7}
                />

                {/* B. Left Sky Stars (In the open left canvas beside the wheel) */}
                <Path
                  d={diamondStar(45, 125, 5.5)}
                  fill={Colors.PureWhite}
                  opacity={0.92}
                />
                <Path
                  d={diamondStar(82, 148, 3.8)}
                  fill={Colors.PeriwinkleSoft}
                  opacity={0.8}
                />
                <Path
                  d={diamondStar(32, 185, 4.2)}
                  fill={Colors.SvgOrbLavenderLight}
                  opacity={0.75}
                />
                <Path
                  d={diamondStar(74, 218, 4.6)}
                  fill={Colors.PureWhite}
                  opacity={0.85}
                />
                <Circle
                  cx={58}
                  cy={105}
                  r={1.7}
                  fill={Colors.PureWhite}
                  opacity={0.85}
                />
                <Circle
                  cx={26}
                  cy={155}
                  r={1.4}
                  fill={Colors.PeriwinkleSoft}
                  opacity={0.7}
                />
                <Circle
                  cx={88}
                  cy={182}
                  r={1.3}
                  fill={Colors.PureWhite}
                  opacity={0.65}
                />

                {/* C. Stars Surrounding the Crescent Moon */}
                <Path
                  d={diamondStar(255, 115, 4)}
                  fill={Colors.PureWhite}
                  opacity={0.88}
                />
                <Path
                  d={diamondStar(335, 118, 4.2)}
                  fill={Colors.SvgOrbLavenderLight}
                  opacity={0.82}
                />
                <Path
                  d={diamondStar(348, 175, 4.5)}
                  fill={Colors.PeriwinkleSoft}
                  opacity={0.78}
                />
                <Path
                  d={diamondStar(245, 195, 3.8)}
                  fill={Colors.PureWhite}
                  opacity={0.85}
                />
                <Path
                  d={diamondStar(330, 220, 4.5)}
                  fill={Colors.PureWhite}
                  opacity={0.9}
                />
                <Circle
                  cx={260}
                  cy={155}
                  r={1.7}
                  fill={Colors.PureWhite}
                  opacity={0.8}
                />
                <Circle
                  cx={350}
                  cy={150}
                  r={1.5}
                  fill={Colors.PeriwinkleSoft}
                  opacity={0.75}
                />
                <Circle
                  cx={300}
                  cy={225}
                  r={1.6}
                  fill={Colors.PureWhite}
                  opacity={0.8}
                />

                {/* D. Lower Sky Stars (Bottom-left & bottom-right horizon) */}
                <Path
                  d={diamondStar(65, H - 55, 4.8)}
                  fill={Colors.SvgOrbLavenderLight}
                  opacity={0.75}
                />
                <Path
                  d={diamondStar(120, H - 35, 3.5)}
                  fill={Colors.PureWhite}
                  opacity={0.7}
                />
                <Path
                  d={diamondStar(280, H - 50, 4)}
                  fill={Colors.PeriwinkleSoft}
                  opacity={0.75}
                />
                <Circle
                  cx={95}
                  cy={H - 45}
                  r={1.6}
                  fill={Colors.PureWhite}
                  opacity={0.75}
                />
                <Circle
                  cx={250}
                  cy={H - 35}
                  r={1.4}
                  fill={Colors.PeriwinkleSoft}
                  opacity={0.7}
                />
              </Svg>
            </Animated.View>
          </>
        )}
      </View>
    );
  },
);

export default PickerAestheticBg;
