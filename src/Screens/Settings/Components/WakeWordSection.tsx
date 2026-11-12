import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import {
  Radio,
  SlidersHorizontal,
  RotateCcw,
  Sparkles,
} from 'lucide-react-native';
import Toast from 'react-native-toast-message';
import { Typography } from '../../../Theme/Typographys';
import { Fonts } from '../../../Theme/fonts';
import {
  Colors as StaticColors,
  withAlpha,
} from '../../../Assets/StyleUtilities/Colors';
import ResponsivePixels from '../../../Assets/StyleUtilities/ResponsivePixels';
import { HeaderActionButton } from '../../../Common/HeaderActionButton';
import { useTheme } from '../../../Theme/ThemeContext';
import { useSettingsTheme } from './types';
import {
  DEFAULT_WAKE_WORD_PHRASE,
  SUPPORTED_WAKE_WORD_PRESETS,
  DEFAULT_WAKE_WORD_PRESET,
} from '../../../Services/WakeWord/WakeWordPresets';

interface WakeWordSectionProps {
  wakeWordEnabled: boolean;
  onToggleWakeWord: (val: boolean) => void;
  wakeWordPhrase?: string;
  onConfigureWakeWord?: () => void;
  onSelectPresetPhrase?: (phrase: string) => void;
  onResetDefaults?: () => void;
}

export const WakeWordSection: React.FC<WakeWordSectionProps> = ({
  wakeWordEnabled,
  onToggleWakeWord,
  wakeWordPhrase = DEFAULT_WAKE_WORD_PHRASE,
  onConfigureWakeWord,
  onSelectPresetPhrase,
  onResetDefaults,
}) => {
  const {
    isDarkMode,
    cardBg,
    textPrimary,
    textSecondary,
    canvasTextPrimary,
    borderLight,
    surfaceAlt,
    accent,
  } = useSettingsTheme();
  const { activeThemeId } = useTheme();

  const themeAccent =
    activeThemeId === 'cyprus_sand'
      ? isDarkMode
        ? StaticColors.CyprusTealLight
        : StaticColors.CyprusTeal
      : accent;

  return (
    <View style={styles.container}>
      {/* Section Header */}
      <View style={styles.sectionHeaderRow}>
        <View style={styles.sectionTitleWithIcon}>
          <Radio
            size={ResponsivePixels.size18}
            color={themeAccent}
            strokeWidth={2.4}
          />
          <Text style={[styles.sectionTitle, { color: canvasTextPrimary }]}>
            Wake Word Engine
          </Text>
        </View>

        {onConfigureWakeWord && (
          <HeaderActionButton
            label="Configure"
            icon={SlidersHorizontal}
            iconPosition="left"
            onPress={onConfigureWakeWord}
            accessibilityLabel="Configure wake word sensitivity"
          />
        )}
      </View>

      {/* Main 3D Tactile Wake Word Card */}
      <View
        style={[
          styles.wakeWordCard,
          {
            backgroundColor: cardBg,
            borderColor:
              activeThemeId === 'cyprus_sand'
                ? StaticColors.CyprusBorderDarkCard
                : isDarkMode
                ? withAlpha(StaticColors.PureWhite, 0.12)
                : StaticColors.PureWhite,
            borderBottomColor:
              activeThemeId === 'cyprus_sand'
                ? StaticColors.SandstoneBorder
                : isDarkMode
                ? StaticColors.DarkSurfaceDeep
                : StaticColors.WarmStoneBorder,
            shadowColor:
              activeThemeId === 'cyprus_sand'
                ? withAlpha(StaticColors.CyprusTeal, 0.16)
                : isDarkMode
                ? StaticColors.PureBlack
                : withAlpha(StaticColors.LavenderPurple, 0.14),
          },
        ]}
      >
        {/* Toggle Row */}
        <View style={styles.toggleRow}>
          <View style={styles.toggleMeta}>
            <View style={styles.wakeWordTitleRow}>
              <Text style={[styles.toggleTitle, { color: textPrimary }]}>
                Hands-Free Trigger
              </Text>
              <View
                style={[
                  styles.phrasePill,
                  {
                    backgroundColor:
                      activeThemeId === 'cyprus_sand'
                        ? StaticColors.WakeWarmLightBorder
                        : isDarkMode
                        ? StaticColors.WakeVioletDarkBg
                        : StaticColors.WakeVioletLightBg,
                    borderColor:
                      activeThemeId === 'cyprus_sand'
                        ? StaticColors.CyprusBorderDarkCard
                        : isDarkMode
                        ? StaticColors.WakeVioletDarkBorder
                        : StaticColors.WakeVioletLightBorder,
                  },
                ]}
              >
                <Sparkles size={ResponsivePixels.size11} color={themeAccent} />
                <Text style={[styles.phrasePillText, { color: themeAccent }]}>
                  &ldquo;{wakeWordPhrase}&rdquo;
                </Text>
              </View>
            </View>
            <Text style={[styles.toggleDesc, { color: textSecondary }]}>
              Hands-free voice trigger when app is open
            </Text>
          </View>
          <Switch
            value={wakeWordEnabled}
            onValueChange={onToggleWakeWord}
            trackColor={{
              false: StaticColors.FogGrey,
              true: themeAccent,
            }}
            thumbColor={StaticColors.PureWhite}
          />
        </View>

        {/* Live Status Indicator Badge */}
        <View
          style={[
            styles.statusBadge,
            {
              backgroundColor: wakeWordEnabled
                ? isDarkMode
                  ? StaticColors.WakeGreenDarkBg
                  : StaticColors.WellnessLightBg
                : surfaceAlt,
              borderColor: wakeWordEnabled
                ? isDarkMode
                  ? StaticColors.WakeGreenDarkBorder
                  : StaticColors.ToastSuccessCardBorderLight
                : borderLight,
            },
          ]}
        >
          <View
            style={[
              styles.statusDot,
              {
                backgroundColor: wakeWordEnabled
                  ? StaticColors.ToastSuccessAccent
                  : StaticColors.Gray400,
                shadowColor: wakeWordEnabled
                  ? StaticColors.ToastSuccessAccent
                  : StaticColors.Transparent,
              },
            ]}
          />
          <Text
            style={[
              styles.statusText,
              {
                color: wakeWordEnabled
                  ? isDarkMode
                    ? StaticColors.ToastSuccessBadgeBevelLight
                    : StaticColors.Emerald800
                  : textSecondary,
              },
            ]}
          >
            {wakeWordEnabled
              ? `Wake word "${wakeWordPhrase}" is active & listening`
              : 'Wake word detection is currently disabled'}
          </Text>
        </View>

        {/* Supported Presets Selection */}
        {wakeWordEnabled && onSelectPresetPhrase && (
          <View style={styles.presetsBlock}>
            <Text style={[styles.presetsTitle, { color: textSecondary }]}>
              Supported Trigger Presets:
            </Text>
            <View style={styles.presetsWrap}>
              {SUPPORTED_WAKE_WORD_PRESETS.map(preset => {
                const isActive =
                  wakeWordPhrase.toLowerCase() === preset.phrase.toLowerCase();
                const isDefault =
                  preset.phrase.toLowerCase() ===
                  DEFAULT_WAKE_WORD_PRESET.phrase.toLowerCase();
                return (
                  <TouchableOpacity
                    key={preset.id}
                    activeOpacity={0.75}
                    style={[
                      styles.presetChip,
                      {
                        backgroundColor: isActive
                          ? isDarkMode
                            ? activeThemeId === 'cyprus_sand'
                              ? StaticColors.CyprusTealDark
                              : StaticColors.WakeChipDarkVioletBg
                            : activeThemeId === 'cyprus_sand'
                            ? StaticColors.WarmCreamBorder
                            : StaticColors.Purple100
                          : surfaceAlt,
                        borderColor: isActive
                          ? themeAccent
                          : borderLight,
                      },
                    ]}
                    onPress={() => {
                      onSelectPresetPhrase(preset.phrase);
                      Toast.show({
                        type: 'success',
                        text2: `Wake word set to "${preset.phrase}"`,
                      });
                    }}
                  >
                    <Text
                      style={[
                        styles.presetChipText,
                        {
                          color: isActive
                            ? themeAccent
                            : textSecondary,
                          fontFamily: isActive
                            ? Fonts.poppins.semiBold
                            : Fonts.poppins.medium,
                        },
                      ]}
                    >
                      {preset.phrase}
                      {isDefault ? ' (Default)' : ''}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

        {/* Sensitivity & Hardware Callout Tile */}
        {onConfigureWakeWord && (
          <TouchableOpacity
            activeOpacity={0.75}
            onPress={onConfigureWakeWord}
            style={[
              styles.configFooterCallout,
              { borderColor: borderLight, backgroundColor: surfaceAlt },
            ]}
            accessibilityRole="button"
            accessibilityLabel="Test acoustic microphone threshold and sensitivity"
          >
            <SlidersHorizontal
              size={ResponsivePixels.size13}
              color={themeAccent}
              strokeWidth={2}
            />
            <Text style={[styles.configFooterText, { color: textSecondary }]}>
              Tap to test acoustic microphone threshold & sensitivity
            </Text>
          </TouchableOpacity>
        )}

        {/* Reset Action Placed Inside the Section Itself */}
        {onResetDefaults && (
          <TouchableOpacity
            activeOpacity={0.7}
            style={[styles.insideResetRow, { borderTopColor: borderLight }]}
            onPress={onResetDefaults}
            accessibilityRole="button"
            accessibilityLabel="Reset wake word defaults"
          >
            <RotateCcw
              size={ResponsivePixels.size12}
              color={themeAccent}
              strokeWidth={2.2}
            />
            <Text style={[styles.insideResetText, { color: themeAccent }]}>Reset Wake Word Defaults</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: ResponsivePixels.size24,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: ResponsivePixels.size12,
  },
  sectionTitleWithIcon: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: ResponsivePixels.size8,
    marginRight: ResponsivePixels.size8,
  },
  sectionTitle: {
    fontFamily: Fonts.ranade.bold,
    fontSize: ResponsivePixels.size17,
    flexShrink: 1,
  },
  insideResetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: ResponsivePixels.size6,
    marginTop: ResponsivePixels.size14,
    paddingTop: ResponsivePixels.size12,
    borderTopWidth: 1,
  },
  insideResetText: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: ResponsivePixels.size11_5,
    color: StaticColors.LavenderPurple,
  },
  wakeWordCard: {
    borderRadius: ResponsivePixels.size22,
    borderWidth: 1.5,
    borderBottomWidth: 3.5,
    padding: ResponsivePixels.size16,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 14,
    elevation: 4,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  toggleMeta: {
    flex: 1,
    paddingRight: ResponsivePixels.size12,
  },
  wakeWordTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: ResponsivePixels.size8,
    marginBottom: ResponsivePixels.size4,
  },
  toggleTitle: {
    ...Typography.bodyMediumPoppinsSemiBold,
    fontSize: ResponsivePixels.size14_5,
  },
  phrasePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ResponsivePixels.size4,
    paddingHorizontal: ResponsivePixels.size8,
    paddingVertical: ResponsivePixels.size2,
    borderRadius: ResponsivePixels.size12,
    borderWidth: 1,
  },
  phrasePillText: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: ResponsivePixels.size11,
    color: StaticColors.LavenderPurple,
  },
  toggleDesc: {
    ...Typography.bodySmallPoppinsRegular,
    fontSize: ResponsivePixels.size11_5,
    lineHeight: ResponsivePixels.size16,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ResponsivePixels.size8,
    paddingHorizontal: ResponsivePixels.size12,
    paddingVertical: ResponsivePixels.size9,
    borderRadius: ResponsivePixels.size12,
    borderWidth: 1,
    marginTop: ResponsivePixels.size14,
  },
  statusDot: {
    width: ResponsivePixels.size8,
    height: ResponsivePixels.size8,
    borderRadius: ResponsivePixels.size4,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 4,
    elevation: 2,
  },
  statusText: {
    fontFamily: Fonts.poppins.medium,
    fontSize: ResponsivePixels.size12,
    flex: 1,
  },
  presetsBlock: {
    marginTop: ResponsivePixels.size14,
    paddingTop: ResponsivePixels.size12,
    borderTopWidth: 1,
    borderTopColor: withAlpha(StaticColors.PureBlack, 0.05),
  },
  presetsTitle: {
    fontFamily: Fonts.poppins.medium,
    fontSize: ResponsivePixels.size11_5,
    marginBottom: ResponsivePixels.size8,
  },
  presetsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: ResponsivePixels.size8,
  },
  presetChip: {
    paddingHorizontal: ResponsivePixels.size12,
    paddingVertical: ResponsivePixels.size6,
    borderRadius: ResponsivePixels.size16,
    borderWidth: 1.5,
  },
  presetChipText: {
    fontSize: ResponsivePixels.size11_5,
  },
  configFooterCallout: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ResponsivePixels.size8,
    marginTop: ResponsivePixels.size12,
    paddingHorizontal: ResponsivePixels.size12,
    paddingVertical: ResponsivePixels.size10,
    borderRadius: ResponsivePixels.size12,
    borderWidth: 1,
  },
  configFooterText: {
    fontFamily: Fonts.poppins.medium,
    fontSize: ResponsivePixels.size11,
    flex: 1,
  },
});

export default WakeWordSection;
