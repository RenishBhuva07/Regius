import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, {
  Circle,
  Defs,
  LinearGradient,
  Stop,
} from 'react-native-svg';
import { useTheme } from '../Theme/ThemeContext';
import { Colors } from '../Assets/StyleUtilities/Colors';
import ResponsivePixels from '../Assets/StyleUtilities/ResponsivePixels';

interface PlusButtonPatternSvgProps {
  size?: number;
}

const VIEW_SIZE = 54;

// Pattern background for the floating center Plus button.
export const PlusButtonPatternSvg: React.FC<PlusButtonPatternSvgProps> =
  React.memo(({ size = ResponsivePixels.size54 }) => {
    const { activeThemeId } = useTheme();
    const center = VIEW_SIZE / 2;

    const getPlusBtnGradient = () => {
      if (activeThemeId === 'cyprus_sand') {
        return {
          c0: Colors.SvgCyprusTealGlow,
          c30: Colors.CyprusTealLight,
          c70: Colors.CyprusTeal,
          c100: Colors.CyprusTealDeep,
          coreAura: Colors.CyprusTealLight,
          rimSheen: Colors.CyprusTealAbyss,
        };
      }
      if (activeThemeId === 'emerald_velvet') {
        return {
          c0: Colors.EmeraldVibrant,
          c30: Colors.SvgEmeraldOrbMid,
          c70: Colors.GreenGracious,
          c100: Colors.SvgEmeraldOrbDeep,
          coreAura: Colors.EmeraldVibrant,
          rimSheen: Colors.EmeraldButtonTextDark,
        };
      }
      if (activeThemeId === 'celestial_azure') {
        return {
          c0: Colors.AzureSkyAccent,
          c30: Colors.AzureRoyal,
          c70: Colors.Blue600,
          c100: Colors.SvgAzureOrbDeep,
          coreAura: Colors.AzureSkyAccent,
          rimSheen: Colors.AzureButtonTextDark,
        };
      }
      if (activeThemeId === 'classic_dark' || activeThemeId === 'obsidian_gold') {
        return {
          c0: Colors.SvgGoldSheenLight,
          c30: Colors.AccentYellow,
          c70: Colors.WorkDarkBorder,
          c100: Colors.WorkTextAccent,
          coreAura: Colors.AccentYellow,
          rimSheen: Colors.ObsidianDarkBar,
        };
      }
      // Warm Cream
      return {
        c0: Colors.SvgOrbLavenderLight,
        c30: Colors.SvgOrbVioletMid,
        c70: Colors.SvgOrbIndigoMid,
        c100: Colors.SvgOrbIndigoDeep,
        coreAura: Colors.SvgOrbVioletMid,
        rimSheen: Colors.SvgOrbIndigoRim,
      };
    };

    const plusGrad = getPlusBtnGradient();

    return (
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <Svg
          width={size}
          height={size}
          viewBox={`0 0 ${VIEW_SIZE} ${VIEW_SIZE}`}
          fill="none"
        >
          <Defs>
            <LinearGradient id="plusBtnBg" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0%" stopColor={plusGrad.c0} stopOpacity={1} />
              <Stop offset="30%" stopColor={plusGrad.c30} stopOpacity={1} />
              <Stop offset="70%" stopColor={plusGrad.c70} stopOpacity={1} />
              <Stop offset="100%" stopColor={plusGrad.c100} stopOpacity={1} />
            </LinearGradient>
            <LinearGradient id="plusRimSheen" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0%" stopColor={Colors.PureWhite} stopOpacity={0.55} />
              <Stop offset="45%" stopColor={Colors.PureWhite} stopOpacity={0.15} />
              <Stop offset="100%" stopColor={plusGrad.rimSheen} stopOpacity={0.45} />
            </LinearGradient>
          </Defs>
          <Circle cx={center} cy={center} r={center} fill="url(#plusBtnBg)" />
          <Circle
            cx={center}
            cy={center}
            r={center - 1}
            stroke="url(#plusRimSheen)"
            strokeWidth={1}
            fill="none"
          />
        </Svg>
      </View>
    );
  });

export default PlusButtonPatternSvg;
