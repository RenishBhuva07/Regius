import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Vibration,
  Platform,
  ScrollView,
} from 'react-native';
import {
  Smartphone,
  Globe,
  ChevronRight,
  Sliders,
  Palette,
  Lock,
  Check,
} from 'lucide-react-native';
import Toast from 'react-native-toast-message';
import { Typography } from '../../../Theme/Typographys';
import { Fonts } from '../../../Theme/fonts';
import { Colors as StaticColors } from '../../../Assets/StyleUtilities/Colors';
import ResponsivePixels from '../../../Assets/StyleUtilities/ResponsivePixels';
import { useSettingsTheme } from './types';
import { useTheme, isLightColor } from '../../../Theme/ThemeContext';
import { useMilestones } from '../../../Context/MilestoneContext';

export type HapticIntensity = 'subtle' | 'medium' | 'crisp';

interface AppearanceSectionProps {
  hapticFeedback: boolean;
  onToggleHapticFeedback: (val: boolean) => void;
  hapticIntensity?: HapticIntensity;
  onChangeHapticIntensity?: (intensity: HapticIntensity) => void;
  onOpenLanguage?: () => void;
  onOpenMilestones?: () => void;
  onOpenTheme?: () => void;
}

export const AppearanceSection: React.FC<AppearanceSectionProps> = ({
  hapticFeedback,
  onToggleHapticFeedback,
  hapticIntensity: controlledIntensity,
  onChangeHapticIntensity,
  onOpenLanguage,
  onOpenMilestones,
  onOpenTheme,
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
  const { activeThemeId, setActiveThemeId, themePresets } = useTheme();
  const { isThemeUnlocked } = useMilestones();

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
          <Palette size={18} color="#F5C518" strokeWidth={2.4} />
          <Text style={[styles.sectionTitle, { color: textPrimary }]}>
            Appearance & Themes
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
        {/* Bespoke Luxury Themes (Unlocked via Milestones) */}
        <View
          style={[
            styles.themesContainer,
            { backgroundColor: surfaceAlt, borderColor: borderLight },
          ]}
        >
          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.themesHeader}
            onPress={onOpenTheme}
            accessibilityRole="button"
            accessibilityLabel="Open all prestige themes"
          >
            <View style={styles.themesHeaderLeft}>
              <Palette size={14} color="#F5C518" strokeWidth={2.2} />
              <Text
                style={[styles.themesHeaderTitle, { color: textSecondary }]}
              >
                Prestige Themes ({themePresets.length}):
              </Text>
            </View>
            <View style={styles.themesHeaderRight}>
              <Text style={styles.viewAllThemesText}>View All & Colors</Text>
              <ChevronRight size={14} color="#F5C518" strokeWidth={2.4} />
            </View>
          </TouchableOpacity>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.themesScroll}
            contentContainerStyle={styles.themesScrollContent}
          >
            {themePresets.map(theme => {
              const unlocked = isThemeUnlocked(theme.id);
              const isSelected = activeThemeId === theme.id;
              const [cCanvas, cSurface, cAccent, cForeground] = theme.palette;
              return (
                <TouchableOpacity
                  key={theme.id}
                  activeOpacity={0.85}
                  style={styles.roundThemeItem}
                  onPress={() => {
                    if (unlocked) {
                      setActiveThemeId(theme.id);
                      Toast.show({
                        type: 'info',
                        text2: `Theme switched to ${theme.name}`,
                      });
                    } else {
                      Toast.show({
                        type: 'info',
                        text2: `🔒 Unlocks at Tier ${theme.requiredTierLevel}! Complete more tasks, reminders & habits.`,
                      });
                      onOpenMilestones?.();
                    }
                  }}
                  accessibilityRole="button"
                  accessibilityLabel={`${theme.name} theme, ${
                    unlocked
                      ? isSelected
                        ? 'Active theme'
                        : 'Unlocked'
                      : `Locked, requires Tier ${theme.requiredTierLevel}`
                  }`}
                >
                  <View
                    style={[
                      styles.roundThemeCircleWrap,
                      isSelected && {
                        borderColor: theme.accent,
                        shadowColor: theme.accent,
                        shadowOpacity: 0.35,
                        elevation: 4,
                      },
                    ]}
                  >
                    {/* 4-Quadrant Color Disc */}
                    <View style={styles.quadCircle}>
                      <View style={styles.quadRow}>
                        <View
                          style={[
                            styles.quadQuarter,
                            { backgroundColor: cCanvas.hex },
                          ]}
                        />
                        <View
                          style={[
                            styles.quadQuarter,
                            { backgroundColor: cSurface.hex },
                          ]}
                        />
                      </View>
                      <View style={styles.quadRow}>
                        <View
                          style={[
                            styles.quadQuarter,
                            { backgroundColor: cAccent.hex },
                          ]}
                        />
                        <View
                          style={[
                            styles.quadQuarter,
                            { backgroundColor: cForeground.hex },
                          ]}
                        />
                      </View>
                    </View>

                    {/* Unlocked & Selected Check Badge */}
                    {unlocked ? (
                      isSelected && (
                        <View
                          style={[
                            styles.roundCheckBadge,
                            { backgroundColor: theme.accent },
                          ]}
                        >
                          <Check
                            size={9}
                            color={
                              isLightColor(theme.accent) ? '#000000' : '#FFFFFF'
                            }
                            strokeWidth={3}
                          />
                        </View>
                      )
                    ) : (
                      /* Locked Overlay with Lock Icon */
                      <View style={styles.roundLockedOverlay}>
                        <Lock size={12} color="#FFFFFF" strokeWidth={2.4} />
                      </View>
                    )}
                  </View>

                  {/* Theme Name */}
                  <Text
                    style={[
                      styles.roundThemeName,
                      {
                        color: isSelected ? textPrimary : textSecondary,
                        fontFamily: isSelected
                          ? Fonts.poppins.semiBold
                          : Fonts.poppins.medium,
                      },
                    ]}
                    numberOfLines={1}
                  >
                    {theme.name}
                  </Text>

                  {/* Tier indicator if locked */}
                  {!unlocked && (
                    <Text style={styles.roundThemeTierText}>
                      Tier {theme.requiredTierLevel}
                    </Text>
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
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
  themesContainer: {
    borderRadius: ResponsivePixels.size14,
    borderWidth: 1,
    padding: ResponsivePixels.size10,
    marginTop: ResponsivePixels.size10,
    marginBottom: ResponsivePixels.size4,
    overflow: 'hidden',
  },
  themesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: ResponsivePixels.size8,
  },
  themesHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ResponsivePixels.size6,
  },
  themesHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ResponsivePixels.size3,
  },
  viewAllThemesText: {
    fontFamily: Fonts.poppins.bold,
    fontSize: 11,
    color: '#F5C518',
  },
  themesHeaderTitle: {
    fontFamily: Fonts.poppins.medium,
    fontSize: 11.5,
  },
  themesScroll: {
    marginHorizontal: -ResponsivePixels.size10,
  },
  themesScrollContent: {
    flexDirection: 'row',
    gap: ResponsivePixels.size8,
    paddingVertical: ResponsivePixels.size6,
    paddingHorizontal: ResponsivePixels.size10,
  },
  roundThemeItem: {
    alignItems: 'center',
    width: ResponsivePixels.size66,
  },
  roundThemeCircleWrap: {
    width: ResponsivePixels.size52,
    height: ResponsivePixels.size52,
    borderRadius: ResponsivePixels.size26,
    borderWidth: 2,
    borderColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  quadCircle: {
    width: ResponsivePixels.size44,
    height: ResponsivePixels.size44,
    borderRadius: ResponsivePixels.size22,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.12)',
  },
  quadRow: {
    flex: 1,
    flexDirection: 'row',
  },
  quadQuarter: {
    flex: 1,
  },
  roundCheckBadge: {
    position: 'absolute',
    bottom: -1,
    right: -1,
    width: ResponsivePixels.size16,
    height: ResponsivePixels.size16,
    borderRadius: ResponsivePixels.size8,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  roundLockedOverlay: {
    position: 'absolute',
    width: ResponsivePixels.size44,
    height: ResponsivePixels.size44,
    borderRadius: ResponsivePixels.size22,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  roundThemeName: {
    ...Typography.bodySmallPoppinsRegular,
    fontSize: 10.5,
    marginTop: ResponsivePixels.size6,
    textAlign: 'center',
  },
  roundThemeTierText: {
    fontFamily: Fonts.poppins.bold,
    fontSize: 9,
    color: '#8E95A5',
    marginTop: 1,
  },
});

export default AppearanceSection;
