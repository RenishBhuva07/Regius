import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import {
  Moon,
  Sun,
  Smartphone,
  Globe,
  ChevronRight,
} from 'lucide-react-native';
import Toast from 'react-native-toast-message';
import { Typography } from '../../../Theme/Typographys';
import { Colors as StaticColors } from '../../../Assets/StyleUtilities/Colors';
import ResponsivePixels from '../../../Assets/StyleUtilities/ResponsivePixels';
import { useSettingsTheme } from './types';

interface AppearanceSectionProps {
  hapticFeedback: boolean;
  onToggleHapticFeedback: (val: boolean) => void;
}

export const AppearanceSection: React.FC<AppearanceSectionProps> = ({
  hapticFeedback,
  onToggleHapticFeedback,
}) => {
  const {
    isDarkMode,
    toggleTheme,
    cardBg,
    textPrimary,
    textSecondary,
    borderLight,
  } = useSettingsTheme();

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

      <View
        style={[
          styles.settingsGroupCard,
          { backgroundColor: cardBg, borderColor: borderLight },
        ]}
      >
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

        <View style={[styles.itemDivider, { backgroundColor: borderLight }]} />

        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.settingItemRow}
          onPress={() => {
            Toast.show({
              type: 'info',
              text2: 'Currently set to English (US)',
            });
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
    ...Typography.h6Bold,
    fontSize: 16,
  },
  settingsGroupCard: {
    borderRadius: 22,
    borderWidth: 1.5,
    paddingHorizontal: ResponsivePixels.size16,
    paddingVertical: ResponsivePixels.size6,
    marginBottom: ResponsivePixels.size24,
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
});

export default AppearanceSection;
