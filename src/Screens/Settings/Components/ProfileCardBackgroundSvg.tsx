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
import { Colors, withAlpha } from '../../../Assets/StyleUtilities/Colors';

// Background pattern for Settings profile card.
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
        <LinearGradient id="profileBgSheen" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor={Colors.BentoStopSlate} stopOpacity={0.7} />
          <Stop offset="50%" stopColor={Colors.NeroBlack} stopOpacity={0.2} />
          <Stop offset="100%" stopColor={Colors.BentoStopAbyss} stopOpacity={0.75} />
        </LinearGradient>
        <RadialGradient
          id="profileGoldDawn"
          cx="16%"
          cy="26%"
          rx="60%"
          ry="60%"
        >
          <Stop offset="0%" stopColor={Colors.AccentYellow} stopOpacity={0.26} />
          <Stop offset="40%" stopColor={Colors.WorkDarkBorder} stopOpacity={0.1} />
          <Stop offset="80%" stopColor={Colors.SvgAntiqueBronze} stopOpacity={0.02} />
          <Stop offset="100%" stopColor={Colors.NeroBlack} stopOpacity={0} />
        </RadialGradient>
        <RadialGradient
          id="profileLavenderAura"
          cx="88%"
          cy="18%"
          rx="55%"
          ry="55%"
        >
          <Stop offset="0%" stopColor={Colors.PeriwinkleSoft} stopOpacity={0.32} />
          <Stop offset="45%" stopColor={Colors.LavenderPurple} stopOpacity={0.14} />
          <Stop offset="100%" stopColor={Colors.NeroBlack} stopOpacity={0} />
        </RadialGradient>
        <RadialGradient
          id="profileMintGlow"
          cx="80%"
          cy="85%"
          rx="40%"
          ry="40%"
        >
          <Stop offset="0%" stopColor={Colors.AccentGreen} stopOpacity={0.08} />
          <Stop offset="100%" stopColor={Colors.NeroBlack} stopOpacity={0} />
        </RadialGradient>
        <LinearGradient
          id="profileStarGold"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <Stop offset="0%" stopColor={Colors.CreamBackground} stopOpacity={0.95} />
          <Stop offset="100%" stopColor={Colors.AccentYellow} stopOpacity={0.8} />
        </LinearGradient>
      </Defs>
      <Rect width="100%" height="100%" fill="url(#profileBgSheen)" />
      <Rect width="100%" height="100%" fill="url(#profileGoldDawn)" />
      <Rect width="100%" height="100%" fill="url(#profileLavenderAura)" />
      <Rect width="100%" height="100%" fill="url(#profileMintGlow)" />
      <Circle
        cx={54}
        cy={52}
        r={38}
        stroke={withAlpha(Colors.AccentYellow, 0.18)}
        strokeWidth={1}
        fill="none"
      />
      <Circle
        cx={54}
        cy={52}
        r={58}
        stroke={withAlpha(Colors.WorkLightBorder, 0.1)}
        strokeWidth={1}
        strokeDasharray="4 4"
        fill="none"
      />
      <Circle
        cx={54}
        cy={52}
        r={82}
        stroke={withAlpha(Colors.PureWhite, 0.04)}
        strokeWidth={1}
        fill="none"
      />
      <Path
        d="M -10 110 C 80 70, 160 140, 260 90 S 340 120, 390 95"
        stroke={withAlpha(Colors.PeriwinkleSoft, 0.14)}
        strokeWidth={1.2}
        strokeLinecap="round"
        fill="none"
      />
      <Path
        d="M 315 28 Q 315 34, 321 34 Q 315 34, 315 40 Q 315 34, 309 34 Q 315 34, 315 28 Z"
        fill="url(#profileStarGold)"
      />
      <Circle
        cx={335}
        cy={54}
        r={1.5}
        fill={Colors.CreamBackground}
        opacity={0.65}
      />
      <Circle
        cx={275}
        cy={22}
        r={1.2}
        fill={Colors.PeriwinkleSoft}
        opacity={0.5}
      />
      <Circle
        cx={145}
        cy={18}
        r={1.2}
        fill={Colors.AccentYellow}
        opacity={0.6}
      />
    </Svg>
  </View>
));

export default ProfileCardBackgroundSvg;
