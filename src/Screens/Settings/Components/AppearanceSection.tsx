import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Vibration,
  Platform,
} from 'react-native';
import {
  Moon,
  Sun,
  Smartphone,
  Globe,
  ChevronRight,
  Sliders,
} from 'lucide-react-native';
import Toast from 'react-native-toast-message';
import { Typography } from '../../../Theme/Typographys';
import { Fonts } from '../../../Theme/fonts';
import { Colors as StaticColors } from '../../../Assets/StyleUtilities/Colors';
import ResponsivePixels from '../../../Assets/StyleUtilities/ResponsivePixels';
import { useSettingsTheme } from './types';

export type HapticIntensity = 'subtle' | 'medium' | 'crisp';

interface AppearanceSectionProps {
  hapticFeedback: boolean;
  onToggleHapticFeedback: (val: boolean) => void;
  hapticIntensity?: HapticIntensity;
  onChangeHapticIntensity?: (intensity: HapticIntensity) => void;
  onOpenLanguage?: () => void;
}

export const AppearanceSection: React.FC<AppearanceSectionProps> = ({
  hapticFeedback,
  onToggleHapticFeedback,
  hapticIntensity: controlledIntensity,
  onChangeHapticIntensity,
  onOpenLanguage,
}) => {
  const {
    isDarkMode,
    toggleTheme,
    cardBg,
    textPrimary,
    textSecondary,
    borderLight,
    surfaceAlt,
  } = useSettingsTheme();

  const [localIntensity, setLocalIntensity] =
    useState<HapticIntensity>('medium');
  const currentIntensity = controlledIntensity ?? localIntensity;

  const handleSelectIntensity = (intensity: HapticIntensity) => {
    setLocalIntensity(intensity);
    onChangeHapticIntensity?.(intensity);

    // Live tactile preview
    if (intensity === 'subtle') {
      Vibration.vibrate(15);
    } else if (intensity === 'medium') {
      Vibration.vibrate(35);
    } else if (intensity === 'crisp') {
      if (Platform.OS === 'android') {
        Vibration.vibrate([0, 30, 25, 45]);
      } else {
        Vibration.vibrate(50);
      }
    }

    Toast.show({
      type: 'info',
      text2: `Haptic intensity set to ${
        intensity.charAt(0).toUpperCase() + intensity.slice(1)
      }`,
    });
  };

  const intensities: { key: HapticIntensity; label: string; desc: string }[] = [
    { key: 'subtle', label: 'Subtle', desc: 'Light' },
    { key: 'medium', label: 'Medium', desc: 'Balanced' },
    { key: 'crisp', label: 'Crisp', desc: 'Sharp' },
  ];

  return (
    <>
      <View style={styles.sectionHeaderRow}>
        <View style={styles.sectionTitleWithIcon}>
          <Moon size={18} color="#F5C518" strokeWidth={2.4} />
          <Text style={[styles.sectionTitle, { color: textPrimary }]}>
            Appearance & Theme
          </Text>
        </View>
      </View>

      {/* 3D Tactile Settings Bento Card */}
      <View
        style={[
          styles.settingsGroupCard,
          {
            backgroundColor: cardBg,
            borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.12)' : '#FFFFFF',
            borderBottomColor: isDarkMode ? '#171A20' : '#E2DCD0',
            shadowColor: isDarkMode ? '#000000' : 'rgba(131, 131, 214, 0.12)',
          },
        ]}
      >
        {/* Dark / Light Mode Switch */}
        <View style={styles.settingItemRow}>
          <View style={styles.settingItemLeft}>
            <View
              style={[
                styles.iconSquare,
                { backgroundColor: isDarkMode ? '#2C3035' : '#FFFCEB' },
              ]}
            >
              {isDarkMode ? (
                <Moon size={18} color="#F5C518" strokeWidth={2.2} />
              ) : (
                <Sun size={18} color="#F5C518" strokeWidth={2.2} />
              )}
            </View>
            <View style={styles.settingItemMeta}>
              <Text style={[styles.settingItemTitle, { color: textPrimary }]}>
                Dark Theme
              </Text>
              <Text style={[styles.settingItemDesc, { color: textSecondary }]}>
                {isDarkMode
                  ? 'Dark obsidian mode active'
                  : 'Warm cream light mode active'}
              </Text>
            </View>
          </View>
          <Switch
            value={isDarkMode}
            onValueChange={toggleTheme}
            trackColor={{ false: '#D9D9D9', true: '#F5C518' }}
            thumbColor="#FFFFFF"
          />
        </View>

        <View style={[styles.itemDivider, { backgroundColor: borderLight }]} />

        {/* Haptic Feedback Toggle */}
        <View style={styles.settingItemRow}>
          <View style={styles.settingItemLeft}>
            <View
              style={[
                styles.iconSquare,
                { backgroundColor: isDarkMode ? '#2C3035' : '#EFF2FE' },
              ]}
            >
              <Smartphone
                size={18}
                color={StaticColors.LavenderPurple}
                strokeWidth={2.2}
              />
            </View>
            <View style={styles.settingItemMeta}>
              <Text style={[styles.settingItemTitle, { color: textPrimary }]}>
                Haptic Feedback
              </Text>
              <Text style={[styles.settingItemDesc, { color: textSecondary }]}>
                Vibrate lightly when completing tasks or clicking
              </Text>
            </View>
          </View>
          <Switch
            value={hapticFeedback}
            onValueChange={onToggleHapticFeedback}
            trackColor={{
              false: '#D9D9D9',
              true: StaticColors.LavenderPurple,
            }}
            thumbColor="#FFFFFF"
          />
        </View>

        {/* Haptic Feedback Intensity Selector (When enabled) */}
        {hapticFeedback && (
          <View
            style={[
              styles.intensityContainer,
              { backgroundColor: surfaceAlt, borderColor: borderLight },
            ]}
          >
            <View style={styles.intensityHeader}>
              <Sliders
                size={13}
                color={StaticColors.LavenderPurple}
                strokeWidth={2.2}
              />
              <Text
                style={[styles.intensityHeaderTitle, { color: textSecondary }]}
              >
                Haptic Intensity (Live Preview):
              </Text>
            </View>

            <View style={styles.intensityPillsRow}>
              {intensities.map(({ key, label }) => {
                const isActive = currentIntensity === key;
                return (
                  <TouchableOpacity
                    key={key}
                    activeOpacity={0.8}
                    style={[
                      styles.intensityPill,
                      isActive && styles.intensityPillActive,
                      {
                        backgroundColor: isActive
                          ? StaticColors.LavenderPurple
                          : cardBg,
                        borderColor: isActive ? '#FFFFFF' : borderLight,
                        borderBottomColor: isActive
                          ? '#4D4DB8'
                          : isDarkMode
                          ? '#1A1D22'
                          : '#D5D0C5',
                        shadowColor: isActive
                          ? StaticColors.LavenderPurple
                          : 'transparent',
                      },
                    ]}
                    onPress={() => handleSelectIntensity(key)}
                    accessibilityRole="button"
                    accessibilityLabel={`Set haptic intensity to ${label}`}
                  >
                    <Text
                      style={[
                        styles.intensityPillText,
                        {
                          color: isActive ? '#FFFFFF' : textPrimary,
                          fontFamily: isActive
                            ? Fonts.poppins.bold
                            : Fonts.poppins.medium,
                        },
                      ]}
                    >
                      {label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

        <View style={[styles.itemDivider, { backgroundColor: borderLight }]} />

        {/* Language Selection */}
        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.settingItemRow}
          onPress={() => {
            if (onOpenLanguage) {
              onOpenLanguage();
            } else {
              Toast.show({
                type: 'info',
                text2: 'Currently set to English (US)',
              });
            }
          }}
        >
          <View style={styles.settingItemLeft}>
            <View
              style={[
                styles.iconSquare,
                { backgroundColor: isDarkMode ? '#2C3035' : '#EDFDF5' },
              ]}
            >
              <Globe size={18} color="#21AF85" strokeWidth={2.2} />
            </View>
            <View style={styles.settingItemMeta}>
              <Text style={[styles.settingItemTitle, { color: textPrimary }]}>
                App Language
              </Text>
              <Text style={[styles.settingItemDesc, { color: textSecondary }]}>
                English (United States)
              </Text>
            </View>
          </View>
          <View style={styles.settingItemRight}>
            <Text style={[styles.settingValueLabel, { color: textSecondary }]}>
              English
            </Text>
            <ChevronRight size={16} color={textSecondary} strokeWidth={2} />
          </View>
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: ResponsivePixels.size12,
    marginTop: ResponsivePixels.size4,
  },
  sectionTitleWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: {
    fontFamily: Fonts.ranade.bold,
    fontSize: 17,
  },
  settingsGroupCard: {
    borderRadius: 22,
    borderWidth: 1.5,
    borderBottomWidth: 3.5,
    paddingHorizontal: ResponsivePixels.size16,
    paddingVertical: ResponsivePixels.size6,
    marginBottom: ResponsivePixels.size24,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 14,
    elevation: 4,
  },
  settingItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: ResponsivePixels.size12,
  },
  settingItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
    paddingRight: 10,
  },
  iconSquare: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingItemMeta: {
    flex: 1,
  },
  settingItemTitle: {
    ...Typography.bodyMediumPoppinsSemiBold,
    fontSize: 14,
  },
  settingItemDesc: {
    ...Typography.bodySmallPoppinsRegular,
    fontSize: 11,
    marginTop: 1,
  },
  settingItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  settingValueLabel: {
    ...Typography.bodySmallPoppinsRegular,
    fontSize: 13,
  },
  itemDivider: {
    height: 1,
    width: '100%',
  },
  intensityContainer: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
    marginTop: 2,
  },
  intensityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  intensityHeaderTitle: {
    fontFamily: Fonts.poppins.medium,
    fontSize: 11.5,
  },
  intensityPillsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  intensityPill: {
    flex: 1,
    paddingVertical: 7,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
    borderWidth: 1,
    borderBottomWidth: 2.2,
  },
  intensityPillActive: {
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  intensityPillText: {
    fontSize: 12,
    letterSpacing: 0.3,
  },
});

export default AppearanceSection;
