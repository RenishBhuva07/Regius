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
import {
  Colors,
  IllustrationColors,
  withAlpha,
} from '../../../../Assets/StyleUtilities/Colors';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export interface VoiceAcousticDoodleSvgProps {
  width?: number;
  height?: number;
  isDarkMode?: boolean;
  state?: VoiceAssistantState;
}

// Vector illustration for the voice assistant background.
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
  const auraColor1 = isDarkMode ? Colors.LavenderPurple : Colors.SiaOrbViolet;
  const auraColor2 = isDarkMode
    ? Colors.AccentYellow
    : Colors.VoiceMichaelBorder;
  const dashColor = isDarkMode
    ? withAlpha(Colors.PureWhite, 0.22)
    : Colors.BentoWarmGoldMuted;
  const goldColor = isDarkMode ? Colors.Amber400 : Colors.AccentYellow;
  const lavenderColor = isDarkMode ? Colors.Violet400 : Colors.LavenderPurple;
  const mintColor = isDarkMode
    ? Colors.ToastSuccessCardBevelLight
    : Colors.ToastSuccessAccent;
  const coralColor = isDarkMode
    ? Colors.CategoryRoseAccent
    : Colors.CoralWarmth;

  return (
    <View style={[styles.container, { width, height }]} pointerEvents="none">
      <Svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        fill="none"
      >
        <Defs>
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
              stopColor={
                isDarkMode ? Colors.VoiceSheetDarkBg : Colors.CreamSurfaceAlt
              }
              stopOpacity={0}
            />
          </RadialGradient>
          <LinearGradient id="vadGold" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor={Colors.CreamBackground} />
            <Stop offset="45%" stopColor={Colors.AccentYellow} />
            <Stop offset="100%" stopColor={Colors.HabitBurnishedAmber} />
          </LinearGradient>
          <LinearGradient id="vadLavender" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor={Colors.BadgePurpleBg} />
            <Stop offset="50%" stopColor={Colors.LavenderPurple} />
            <Stop offset="100%" stopColor={IllustrationColors.AcousticIndigo} />
          </LinearGradient>
          <LinearGradient id="vadMint" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor={Colors.ToastSuccessBadgeBgLight} />
            <Stop offset="50%" stopColor={Colors.ToastSuccessAccent} />
            <Stop offset="100%" stopColor={Colors.Emerald700} />
          </LinearGradient>
          <LinearGradient id="vadCoral" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor={IllustrationColors.AcousticRoseMist} />
            <Stop offset="50%" stopColor={Colors.CoralWarmth} />
            <Stop offset="100%" stopColor={Colors.CategoryRoseCheck} />
          </LinearGradient>
        </Defs>
        <Circle
          cx={orbCenterX}
          cy={orbCenterY}
          r={Math.min(width * 0.46, 175)}
          fill="url(#voiceOrbAura)"
        />
        <Circle
          cx={orbCenterX}
          cy={orbCenterY}
          r={Math.min(width * 0.38, 142)}
          stroke={dashColor}
          strokeWidth={1.2}
          strokeDasharray="4 6"
          opacity={0.65}
        />
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
        <G
          transform={`translate(28, ${Math.max(orbCenterY - 180, 24)})`}
          opacity={0.92}
        >
          <Path
            d="M 10 0 Q 10 10, 20 10 Q 10 10, 10 20 Q 10 10, 0 10 Q 10 10, 10 0 Z"
            fill="url(#vadGold)"
          />
          <Circle cx={10} cy={10} r={1.8} fill={Colors.PureWhite} />
        </G>
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
          <Circle cx={9} cy={9} r={1.6} fill={Colors.PureWhite} />
        </G>
        <G transform={`translate(22, ${orbCenterY + 70})`} opacity={0.85}>
          <Path
            d="M 6.5 0 Q 6.5 6.5, 13 6.5 Q 6.5 6.5, 6.5 13 Q 6.5 6.5, 0 6.5 Q 6.5 6.5, 6.5 0 Z"
            fill="url(#vadMint)"
          />
          <Circle cx={6.5} cy={6.5} r={1.2} fill={Colors.PureWhite} />
        </G>
        <G
          transform={`translate(${width - 42}, ${orbCenterY + 65})`}
          opacity={0.88}
        >
          <Path
            d="M 6 0 Q 6 6, 12 6 Q 6 6, 6 12 Q 6 6, 0 6 Q 6 6, 6 0 Z"
            fill="url(#vadCoral)"
          />
          <Circle cx={6} cy={6} r={1.2} fill={Colors.PureWhite} />
        </G>
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
        <G
          transform={`translate(48, ${Math.max(
            orbCenterY - 145,
            55,
          )}) rotate(-8)`}
          opacity={0.92}
        >
          <Path
            d="M 4 20 C 8 10, 24 10, 28 20 Z"
            fill={isDarkMode ? Colors.SvgRoyalPlumDeep : Colors.BadgePurpleBg}
            stroke={lavenderColor}
            strokeWidth={0.8}
          />
          <Path
            d="M 2 20 L 5 8 L 11 14 L 16 5 L 21 14 L 27 8 L 30 20 Z"
            fill="url(#vadGold)"
            stroke={Colors.Amber800}
            strokeWidth={0.8}
            strokeLinejoin="round"
          />
          <Circle cx={5} cy={8} r={1.5} fill={Colors.CreamBackground} />
          <Circle cx={16} cy={5} r={1.8} fill={Colors.CreamBackground} />
          <Circle cx={27} cy={8} r={1.5} fill={Colors.CreamBackground} />
          <Path
            d="M 1 20 C 10 23, 22 23, 31 20 L 31 23 C 22 26, 10 26, 1 23 Z"
            fill="url(#vadGold)"
            stroke={Colors.Amber900}
            strokeWidth={0.7}
          />
          <Circle cx={16} cy={22} r={1.2} fill="url(#vadCoral)" />
          <Line
            x1={16}
            y1={1}
            x2={16}
            y2={3}
            stroke={Colors.AccentYellow}
            strokeWidth={1}
            strokeLinecap="round"
          />
        </G>
        <G
          transform={`translate(${width - 76}, ${Math.max(
            orbCenterY - 148,
            50,
          )}) rotate(12)`}
          opacity={0.92}
        >
          <Circle cx={8} cy={18} r={4} fill="url(#vadLavender)" />
          <Path
            d="M 12 18 L 12 4 C 18 2, 22 7, 24 10"
            stroke={lavenderColor}
            strokeWidth={1.8}
            strokeLinecap="round"
            fill="none"
          />
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
        <G
          transform={`translate(${width - 48}, ${orbCenterY - 20}) rotate(14)`}
          opacity={0.9}
        >
          <Polygon
            points="6,0 0,8 4.5,8 1,16 9,7 4.5,7"
            fill="url(#vadGold)"
            stroke={Colors.HabitBurnishedAmber}
            strokeWidth={0.8}
            strokeLinejoin="round"
          />
        </G>
        <G transform={`translate(28, ${orbCenterY - 24})`} opacity={0.75}>
          <Path
            d="M 2 18 C 14 2, 26 2, 22 18 C 18 30, 6 22, 14 12 C 20 4, 32 10, 36 24"
            stroke={dashColor}
            strokeWidth={1.3}
            strokeLinecap="round"
            fill="none"
          />
        </G>
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
