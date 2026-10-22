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
import { Colors as StaticColors } from '../../../Assets/StyleUtilities/Colors';
import ResponsivePixels from '../../../Assets/StyleUtilities/ResponsivePixels';
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
    borderLight,
    surfaceAlt,
  } = useSettingsTheme();

  return (
    <View style={styles.container}>
      {/* Section Header */}
      <View style={styles.sectionHeaderRow}>
        <View style={styles.sectionTitleWithIcon}>
          <Radio
            size={18}
            color={StaticColors.LavenderPurple}
            strokeWidth={2.4}
          />
          <Text style={[styles.sectionTitle, { color: textPrimary }]}>
            Wake Word Engine
          </Text>
        </View>

        {onConfigureWakeWord && (
          <TouchableOpacity
            activeOpacity={0.7}
            style={[
              styles.sectionHeaderAction,
              { backgroundColor: surfaceAlt, borderColor: borderLight },
            ]}
            onPress={onConfigureWakeWord}
            accessibilityRole="button"
            accessibilityLabel="Configure wake word sensitivity"
          >
            <SlidersHorizontal
              size={12}
              color={StaticColors.LavenderPurple}
              strokeWidth={2.2}
            />
            <Text style={styles.sectionHeaderActionText}>Configure</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Main 3D Tactile Wake Word Card */}
      <View
        style={[
          styles.wakeWordCard,
          {
            backgroundColor: cardBg,
            borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.12)' : '#FFFFFF',
            borderBottomColor: isDarkMode ? '#171A20' : '#E2DCD0',
            shadowColor: isDarkMode ? '#000000' : 'rgba(131, 131, 214, 0.14)',
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
                    backgroundColor: isDarkMode ? '#2A243D' : '#F4EEFF',
                    borderColor: isDarkMode ? '#473668' : '#D8CBFF',
                  },
                ]}
              >
                <Sparkles size={11} color={StaticColors.LavenderPurple} />
                <Text style={styles.phrasePillText}>
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
              false: '#D9D9D9',
              true: StaticColors.LavenderPurple,
            }}
            thumbColor="#FFFFFF"
          />
        </View>

        {/* Live Status Indicator Badge */}
        <View
          style={[
            styles.statusBadge,
            {
              backgroundColor: wakeWordEnabled
                ? isDarkMode
                  ? '#0E281C'
                  : '#EDFDF5'
                : surfaceAlt,
              borderColor: wakeWordEnabled
                ? isDarkMode
                  ? '#164E34'
                  : '#A7F3D0'
                : borderLight,
            },
          ]}
        >
          <View
            style={[
              styles.statusDot,
              {
                backgroundColor: wakeWordEnabled ? '#10B981' : '#9CA3AF',
                shadowColor: wakeWordEnabled ? '#10B981' : 'transparent',
              },
            ]}
          />
          <Text
            style={[
              styles.statusText,
              {
                color: wakeWordEnabled
                  ? isDarkMode
                    ? '#6EE7B7'
                    : '#065F46'
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
                            ? '#2E2248'
                            : '#F3E8FF'
                          : surfaceAlt,
                        borderColor: isActive
                          ? StaticColors.LavenderPurple
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
                            ? StaticColors.LavenderPurple
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
              size={13}
              color={StaticColors.LavenderPurple}
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
              size={12}
              color={StaticColors.LavenderPurple}
              strokeWidth={2.2}
            />
            <Text style={styles.insideResetText}>Reset Wake Word Defaults</Text>
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
    gap: 8,
    marginRight: 8,
  },
  sectionTitle: {
    fontFamily: Fonts.ranade.bold,
    fontSize: 17,
    flexShrink: 1,
  },
  insideResetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
  },
  insideResetText: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: 11.5,
    color: StaticColors.LavenderPurple,
  },
  sectionHeaderAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
    borderWidth: 1,
  },
  sectionHeaderActionText: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: 11,
    color: StaticColors.LavenderPurple,
  },
  wakeWordCard: {
    borderRadius: 22,
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
    paddingRight: 12,
  },
  wakeWordTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 4,
  },
  toggleTitle: {
    ...Typography.bodyMediumPoppinsSemiBold,
    fontSize: 14.5,
  },
  phrasePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    borderWidth: 1,
  },
  phrasePillText: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: 11,
    color: StaticColors.LavenderPurple,
  },
  toggleDesc: {
    ...Typography.bodySmallPoppinsRegular,
    fontSize: 11.5,
    lineHeight: 16,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 14,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 4,
    elevation: 2,
  },
  statusText: {
    fontFamily: Fonts.poppins.medium,
    fontSize: 12,
    flex: 1,
  },
  presetsBlock: {
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  presetsTitle: {
    fontFamily: Fonts.poppins.medium,
    fontSize: 11.5,
    marginBottom: 8,
  },
  presetsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  presetChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1.5,
  },
  presetChipText: {
    fontSize: 11.5,
  },
  configFooterCallout: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
  },
  configFooterText: {
    fontFamily: Fonts.poppins.medium,
    fontSize: 11,
    flex: 1,
  },
});

export default WakeWordSection;
