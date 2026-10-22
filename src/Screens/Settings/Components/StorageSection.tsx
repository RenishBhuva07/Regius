import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Animated,
  Easing,
  Vibration,
} from 'react-native';
import {
  Database,
  Cloud,
  Trash2,
  ChevronRight,
  RefreshCw,
  Clock,
  CheckCircle2,
} from 'lucide-react-native';
import Toast from 'react-native-toast-message';
import { Typography } from '../../../Theme/Typographys';
import { Fonts } from '../../../Theme/fonts';
import ResponsivePixels from '../../../Assets/StyleUtilities/ResponsivePixels';
import { useSettingsTheme } from './types';

interface StorageSectionProps {
  cloudSync: boolean;
  onToggleCloudSync: (val: boolean) => void;
  cacheSize: string;
  onClearCachePress: () => void;
  onSyncNow?: () => Promise<void> | void;
}

export const StorageSection: React.FC<StorageSectionProps> = ({
  cloudSync,
  onToggleCloudSync,
  cacheSize,
  onClearCachePress,
  onSyncNow,
}) => {
  const {
    isDarkMode,
    cardBg,
    textPrimary,
    textSecondary,
    borderLight,
    surfaceAlt,
  } = useSettingsTheme();

  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncedText, setLastSyncedText] = useState('2m ago');
  const spinAnim = useRef(new Animated.Value(0)).current;

  const handleSyncNow = async () => {
    if (isSyncing) return;
    setIsSyncing(true);
    Vibration.vibrate(20);

    // Continuous 360-degree spin animation
    spinAnim.setValue(0);
    const spinLoop = Animated.loop(
      Animated.timing(spinAnim, {
        toValue: 1,
        duration: 800,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );
    spinLoop.start();

    try {
      if (onSyncNow) {
        await onSyncNow();
      } else {
        // Realistic simulated sync
        await new Promise<void>(resolve => setTimeout(() => resolve(), 1200));
      }

      setLastSyncedText('just now');
      Vibration.vibrate(30);
      Toast.show({
        type: 'success',
        text2: 'Cloud schedule synchronized successfully',
      });
    } catch {
      Toast.show({
        type: 'error',
        text2: 'Failed to synchronize cloud storage',
      });
    } finally {
      spinLoop.stop();
      spinAnim.setValue(0);
      setIsSyncing(false);
    }
  };

  const spin = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

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

      {/* 3D Tactile Settings Bento Card */}
      <View
        style={[
          styles.settingsGroupCard,
          {
            backgroundColor: cardBg,
            borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.12)' : '#FFFFFF',
            borderBottomColor: isDarkMode ? '#171A20' : '#E2DCD0',
            shadowColor: isDarkMode ? '#000000' : 'rgba(22, 93, 255, 0.12)',
          },
        ]}
      >
        {/* Cloud Backup Toggle Row */}
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
                Sync schedule and AI memory across all devices
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

        {/* Live Interactive Sync Pill Bar */}
        <View
          style={[
            styles.syncPillContainer,
            { backgroundColor: surfaceAlt, borderColor: borderLight },
          ]}
        >
          <View style={styles.lastSyncedInfo}>
            {lastSyncedText === 'just now' ? (
              <CheckCircle2 size={13} color="#10B981" strokeWidth={2.4} />
            ) : (
              <Clock size={13} color={textSecondary} strokeWidth={2.2} />
            )}
            <Text
              style={[
                styles.lastSyncedPillText,
                {
                  color:
                    lastSyncedText === 'just now' ? '#10B981' : textSecondary,
                },
              ]}
            >
              Last synced {lastSyncedText}
            </Text>
          </View>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleSyncNow}
            disabled={isSyncing || !cloudSync}
            style={[
              styles.syncNowBtn,
              (!cloudSync || isSyncing) && styles.syncNowBtnDisabled,
            ]}
            accessibilityRole="button"
            accessibilityLabel="Sync Now with Cloud"
          >
            <Animated.View style={{ transform: [{ rotate: spin }] }}>
              <RefreshCw size={12} color="#FFFFFF" strokeWidth={2.4} />
            </Animated.View>
            <Text style={styles.syncNowBtnText}>
              {isSyncing ? 'Syncing...' : 'Sync Now'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.itemDivider, { backgroundColor: borderLight }]} />

        {/* Clear Cache Row */}
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
                Free up local audio storage without losing tasks
              </Text>
            </View>
          </View>
          <View style={styles.settingItemRight}>
            <View
              style={[
                styles.cachePill,
                {
                  backgroundColor: isDarkMode ? '#2C3035' : '#FFFFFF',
                  borderColor: isDarkMode ? '#3A3F46' : '#FFFFFF',
                  borderBottomColor: isDarkMode ? '#1E2126' : '#D5D0C5',
                },
              ]}
            >
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
  syncPillContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 8,
    marginTop: 2,
  },
  lastSyncedInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  lastSyncedPillText: {
    fontFamily: Fonts.poppins.medium,
    fontSize: 11.5,
  },
  syncNowBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#165DFF',
    borderColor: '#FFFFFF',
    borderWidth: 1,
    borderBottomWidth: 2.2,
    borderBottomColor: '#0E3DA6',
    paddingHorizontal: 12,
    paddingVertical: 5.5,
    borderRadius: 16,
    shadowColor: '#165DFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 3,
  },
  syncNowBtnDisabled: {
    opacity: 0.55,
  },
  syncNowBtnText: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: 11,
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
  settingItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cachePill: {
    paddingHorizontal: 10,
    paddingVertical: 3.5,
    borderRadius: 14,
    borderWidth: 1,
    borderBottomWidth: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1.5 },
    shadowOpacity: 0.1,
    shadowRadius: 2.5,
    elevation: 2,
  },
  cachePillText: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: 11,
    color: '#FF3B30',
  },
  itemDivider: {
    height: 1,
    width: '100%',
  },
});

export default StorageSection;
