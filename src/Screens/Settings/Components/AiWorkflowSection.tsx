import React from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';
import { Zap, Sparkles, Bell, Volume2 } from 'lucide-react-native';
import { Typography } from '../../../Theme/Typographys';
import {
  Colors as StaticColors,
  withAlpha,
} from '../../../Assets/StyleUtilities/Colors';
import ResponsivePixels from '../../../Assets/StyleUtilities/ResponsivePixels';
import { useSettingsTheme } from './types';

interface AiWorkflowSectionProps {
  smartCategorization: boolean;
  onToggleSmartCategorization: (val: boolean) => void;
  morningBriefing: boolean;
  onToggleMorningBriefing: (val: boolean) => void;
  notificationsEnabled: boolean;
  onToggleNotifications: (val: boolean) => void;
}

export const AiWorkflowSection: React.FC<AiWorkflowSectionProps> = ({
  smartCategorization,
  onToggleSmartCategorization,
  morningBriefing,
  onToggleMorningBriefing,
  notificationsEnabled,
  onToggleNotifications,
}) => {
  const {
    isDarkMode,
    activeThemeId,
    cardBg,
    textPrimary,
    textSecondary,
    canvasTextPrimary,
    borderLight,
    accent,
  } = useSettingsTheme();

  return (
    <>
      <View style={styles.sectionHeaderRow}>
        <View style={styles.sectionTitleWithIcon}>
          <Zap
            size={ResponsivePixels.size18}
            color={StaticColors.AccentGreen}
            strokeWidth={2.4}
          />
          <Text style={[styles.sectionTitle, { color: canvasTextPrimary }]}>
            AI Workflow & Notifications
          </Text>
        </View>
      </View>

      <View
        style={[
          styles.settingsGroupCard,
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
                : withAlpha(StaticColors.AccentGreen, 0.12),
          },
        ]}
      >
        <View style={styles.settingItemRow}>
          <View style={styles.settingItemLeft}>
            <View
              style={[
                styles.iconSquare,
                {
                  backgroundColor: isDarkMode
                    ? StaticColors.CarbonSlate
                    : StaticColors.WellnessLightBg,
                },
              ]}
            >
              <Sparkles
                size={ResponsivePixels.size18}
                color={StaticColors.AccentGreen}
                strokeWidth={2.2}
              />
            </View>
            <View style={styles.settingItemMeta}>
              <Text style={[styles.settingItemTitle, { color: textPrimary }]}>
                Smart Auto-Categorization
              </Text>
              <Text style={[styles.settingItemDesc, { color: textSecondary }]}>
                Automatically group tasks into Works, Sport, and Habits
              </Text>
            </View>
          </View>
          <Switch
            value={smartCategorization}
            onValueChange={onToggleSmartCategorization}
            trackColor={{
              false: StaticColors.FogGrey,
              true: StaticColors.AccentGreen,
            }}
            thumbColor={StaticColors.PureWhite}
          />
        </View>

        <View style={[styles.itemDivider, { backgroundColor: borderLight }]} />

        <View style={styles.settingItemRow}>
          <View style={styles.settingItemLeft}>
            <View
              style={[
                styles.iconSquare,
                {
                  backgroundColor: isDarkMode
                    ? StaticColors.CarbonSlate
                    : StaticColors.WorkLightBg,
                },
              ]}
            >
              <Bell
                size={ResponsivePixels.size18}
                color={StaticColors.AccentYellow}
                strokeWidth={2.2}
              />
            </View>
            <View style={styles.settingItemMeta}>
              <Text style={[styles.settingItemTitle, { color: textPrimary }]}>
                Daily Morning Briefing
              </Text>
              <Text style={[styles.settingItemDesc, { color: textSecondary }]}>
                AI assistant vocal breakdown at 08:00 AM
              </Text>
            </View>
          </View>
          <Switch
            value={morningBriefing}
            onValueChange={onToggleMorningBriefing}
            trackColor={{
              false: StaticColors.FogGrey,
              true: StaticColors.AccentYellow,
            }}
            thumbColor={StaticColors.PureWhite}
          />
        </View>

        <View style={[styles.itemDivider, { backgroundColor: borderLight }]} />

        <View style={styles.settingItemRow}>
          <View style={styles.settingItemLeft}>
            <View
              style={[
                styles.iconSquare,
                {
                  backgroundColor: isDarkMode
                    ? StaticColors.CarbonSlate
                    : StaticColors.WellnessLightBg,
                },
              ]}
            >
              <Volume2
                size={ResponsivePixels.size18}
                color={
                  isDarkMode
                    ? StaticColors.AccentGreen
                    : StaticColors.GreenGracious
                }
                strokeWidth={2.2}
              />
            </View>
            <View style={styles.settingItemMeta}>
              <Text style={[styles.settingItemTitle, { color: textPrimary }]}>
                Reminder Sound & Alerts
              </Text>
              <Text style={[styles.settingItemDesc, { color: textSecondary }]}>
                Receive real-time banners and reminder bells
              </Text>
            </View>
          </View>
          <Switch
            value={notificationsEnabled}
            onValueChange={onToggleNotifications}
            trackColor={{
              false: StaticColors.FogGrey,
              true: StaticColors.AccentGreen,
            }}
            thumbColor={StaticColors.PureWhite}
          />
        </View>
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
    gap: ResponsivePixels.size8,
  },
  sectionTitle: {
    ...Typography.h6Bold,
    fontSize: ResponsivePixels.size16,
  },
  settingsGroupCard: {
    borderRadius: ResponsivePixels.size22,
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
    gap: ResponsivePixels.size12,
    flex: 1,
    paddingRight: ResponsivePixels.size10,
  },
  iconSquare: {
    width: ResponsivePixels.size38,
    height: ResponsivePixels.size38,
    borderRadius: ResponsivePixels.size12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingItemMeta: {
    flex: 1,
  },
  settingItemTitle: {
    ...Typography.bodyMediumPoppinsSemiBold,
    fontSize: ResponsivePixels.size14,
  },
  settingItemDesc: {
    ...Typography.bodySmallPoppinsRegular,
    fontSize: ResponsivePixels.size11,
    marginTop: ResponsivePixels.size1,
  },
  itemDivider: {
    height: 1,
    width: '100%',
  },
});

export default AiWorkflowSection;
