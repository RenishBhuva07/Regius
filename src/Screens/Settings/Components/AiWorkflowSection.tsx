import React from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';
import { Zap, Sparkles, Bell, Volume2 } from 'lucide-react-native';
import { Typography } from '../../../Theme/Typographys';
import { Colors as StaticColors } from '../../../Assets/StyleUtilities/Colors';
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
  const { isDarkMode, cardBg, textPrimary, textSecondary, borderLight } =
    useSettingsTheme();

  return (
    <>
      <View style={styles.sectionHeaderRow}>
        <View style={styles.sectionTitleWithIcon}>
          <Zap size={18} color="#52D22E" strokeWidth={2.4} />
          <Text style={[styles.sectionTitle, { color: textPrimary }]}>
            AI Workflow & Notifications
          </Text>
        </View>
      </View>

      <View
        style={[
          styles.settingsGroupCard,
          {
            backgroundColor: cardBg,
            borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.12)' : '#FFFFFF',
            borderBottomColor: isDarkMode ? '#171A20' : '#E2DCD0',
            shadowColor: isDarkMode ? '#000000' : 'rgba(82, 210, 46, 0.12)',
          },
        ]}
      >
        <View style={styles.settingItemRow}>
          <View style={styles.settingItemLeft}>
            <View
              style={[
                styles.iconSquare,
                { backgroundColor: isDarkMode ? '#2C3035' : '#EDFDF5' },
              ]}
            >
              <Sparkles size={18} color="#52D22E" strokeWidth={2.2} />
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
            trackColor={{ false: '#D9D9D9', true: '#52D22E' }}
            thumbColor="#FFFFFF"
          />
        </View>

        <View style={[styles.itemDivider, { backgroundColor: borderLight }]} />

        <View style={styles.settingItemRow}>
          <View style={styles.settingItemLeft}>
            <View
              style={[
                styles.iconSquare,
                { backgroundColor: isDarkMode ? '#2C3035' : '#FFFCEB' },
              ]}
            >
              <Bell size={18} color="#F5C518" strokeWidth={2.2} />
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
              <Volume2
                size={18}
                color={StaticColors.LavenderPurple}
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
              false: '#D9D9D9',
              true: StaticColors.LavenderPurple,
            }}
            thumbColor="#FFFFFF"
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
    gap: 8,
  },
  sectionTitle: {
    ...Typography.h6Bold,
    fontSize: 16,
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
  itemDivider: {
    height: 1,
    width: '100%',
  },
});

export default AiWorkflowSection;
