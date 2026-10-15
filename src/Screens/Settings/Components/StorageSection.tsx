import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import { Database, Cloud, Trash2, ChevronRight } from 'lucide-react-native';
import { Typography } from '../../../Theme/Typographys';
import ResponsivePixels from '../../../Assets/StyleUtilities/ResponsivePixels';
import { useSettingsTheme } from './types';

interface StorageSectionProps {
  cloudSync: boolean;
  onToggleCloudSync: (val: boolean) => void;
  cacheSize: string;
  onClearCachePress: () => void;
}

export const StorageSection: React.FC<StorageSectionProps> = ({
  cloudSync,
  onToggleCloudSync,
  cacheSize,
  onClearCachePress,
}) => {
  const { isDarkMode, cardBg, textPrimary, textSecondary, borderLight } =
    useSettingsTheme();

  return (
    <>
      <View style={styles.sectionHeaderRow}>
        <View style={styles.sectionTitleWithIcon}>
          <Database size={18} color="#165DFF" strokeWidth={2.4} />
          <Text style={[styles.sectionTitle, { color: textPrimary }]}>
            Cloud & Data Storage
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
                { backgroundColor: isDarkMode ? '#2C3035' : '#EFF4FE' },
              ]}
            >
              <Cloud size={18} color="#165DFF" strokeWidth={2.2} />
            </View>
            <View style={styles.settingItemMeta}>
              <Text style={[styles.settingItemTitle, { color: textPrimary }]}>
                Cloud Backup & Sync
              </Text>
              <Text style={[styles.settingItemDesc, { color: textSecondary }]}>
                Sync schedule across devices • Last synced 2m ago
              </Text>
            </View>
          </View>
          <Switch
            value={cloudSync}
            onValueChange={onToggleCloudSync}
            trackColor={{ false: '#D9D9D9', true: '#165DFF' }}
            thumbColor="#FFFFFF"
          />
        </View>

        <View style={[styles.itemDivider, { backgroundColor: borderLight }]} />

        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.settingItemRow}
          onPress={onClearCachePress}
        >
          <View style={styles.settingItemLeft}>
            <View
              style={[
                styles.iconSquare,
                { backgroundColor: isDarkMode ? '#2C3035' : '#FFF0F0' },
              ]}
            >
              <Trash2 size={18} color="#FF3B30" strokeWidth={2.2} />
            </View>
            <View style={styles.settingItemMeta}>
              <Text style={[styles.settingItemTitle, { color: textPrimary }]}>
                Clear Cache & Temp Files
              </Text>
              <Text style={[styles.settingItemDesc, { color: textSecondary }]}>
                Free up local storage without losing tasks
              </Text>
            </View>
          </View>
          <View style={styles.settingItemRight}>
            <View style={styles.cachePill}>
              <Text style={styles.cachePillText}>{cacheSize}</Text>
            </View>
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
  cachePill: {
    backgroundColor: '#FFF0F0',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  cachePillText: {
    ...Typography.bodySmallPoppinsSemiBold,
    fontSize: 11,
    color: '#FF3B30',
  },
  itemDivider: {
    height: 1,
    width: '100%',
  },
});

export default StorageSection;
