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
import {
  Colors as StaticColors,
  withAlpha,
} from '../../../Assets/StyleUtilities/Colors';
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
    activeThemeId,
    cardBg,
    textPrimary,
    textSecondary,
    canvasTextPrimary,
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
          <Database
            size={ResponsivePixels.size18}
            color={StaticColors.PrimaryBlue}
            strokeWidth={2.4}
          />
          <Text style={[styles.sectionTitle, { color: canvasTextPrimary }]}>
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
                : withAlpha(StaticColors.PrimaryBlue, 0.12),
          },
        ]}
      >
        {/* Cloud Backup Toggle Row */}
        <View style={styles.settingItemRow}>
          <View style={styles.settingItemLeft}>
            <View
              style={[
                styles.iconSquare,
                {
                  backgroundColor: isDarkMode
                    ? StaticColors.CarbonSlate
                    : StaticColors.VoiceGeorgeBg,
                },
              ]}
            >
              <Cloud
                size={ResponsivePixels.size18}
                color={StaticColors.PrimaryBlue}
                strokeWidth={2.2}
              />
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
            trackColor={{
              false: StaticColors.FogGrey,
              true: StaticColors.PrimaryBlue,
            }}
            thumbColor={StaticColors.PureWhite}
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
              <CheckCircle2
                size={ResponsivePixels.size13}
                color={StaticColors.ToastSuccessAccent}
                strokeWidth={2.4}
              />
            ) : (
              <Clock size={ResponsivePixels.size13} color={textSecondary} strokeWidth={2.2} />
            )}
            <Text
              style={[
                styles.lastSyncedPillText,
                {
                  color:
                    lastSyncedText === 'just now'
                      ? StaticColors.ToastSuccessAccent
                      : textSecondary,
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
              <RefreshCw
                size={ResponsivePixels.size12}
                color={StaticColors.PureWhite}
                strokeWidth={2.4}
              />
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
                {
                  backgroundColor: isDarkMode
                    ? StaticColors.CarbonSlate
                    : StaticColors.VoiceBellaBg,
                },
              ]}
            >
              <Trash2
                size={ResponsivePixels.size18}
                color={StaticColors.CrimsonPulse}
                strokeWidth={2.2}
              />
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
                  backgroundColor: isDarkMode
                    ? StaticColors.CarbonSlate
                    : StaticColors.PureWhite,
                  borderColor: isDarkMode
                    ? StaticColors.DarkSoftLinen
                    : StaticColors.PureWhite,
                  borderBottomColor: isDarkMode
                    ? StaticColors.DarkSectionDivider
                    : StaticColors.HomeIndicator,
                },
              ]}
            >
              <Text style={styles.cachePillText}>{cacheSize}</Text>
            </View>
            <ChevronRight size={ResponsivePixels.size16} color={textSecondary} strokeWidth={2} />
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
    gap: ResponsivePixels.size8,
  },
  sectionTitle: {
    fontFamily: Fonts.ranade.bold,
    fontSize: ResponsivePixels.size17,
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
  syncPillContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: ResponsivePixels.size12,
    paddingVertical: ResponsivePixels.size8,
    borderRadius: ResponsivePixels.size14,
    borderWidth: 1,
    marginBottom: ResponsivePixels.size8,
    marginTop: ResponsivePixels.size2,
  },
  lastSyncedInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ResponsivePixels.size6,
  },
  lastSyncedPillText: {
    fontFamily: Fonts.poppins.medium,
    fontSize: ResponsivePixels.size11_5,
  },
  syncNowBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ResponsivePixels.size5,
    backgroundColor: StaticColors.PrimaryBlue,
    borderColor: StaticColors.PureWhite,
    borderWidth: 1,
    borderBottomWidth: 2.2,
    borderBottomColor: StaticColors.PrimaryBlueBevel,
    paddingHorizontal: ResponsivePixels.size12,
    paddingVertical: ResponsivePixels.size5_5,
    borderRadius: ResponsivePixels.size16,
    shadowColor: StaticColors.PrimaryBlue,
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
    fontSize: ResponsivePixels.size11,
    color: StaticColors.PureWhite,
    letterSpacing: 0.2,
  },
  settingItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ResponsivePixels.size8,
  },
  cachePill: {
    paddingHorizontal: ResponsivePixels.size10,
    paddingVertical: ResponsivePixels.size3_5,
    borderRadius: ResponsivePixels.size14,
    borderWidth: 1,
    borderBottomWidth: 2,
    shadowColor: StaticColors.PureBlack,
    shadowOffset: { width: 0, height: 1.5 },
    shadowOpacity: 0.1,
    shadowRadius: 2.5,
    elevation: 2,
  },
  cachePillText: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: ResponsivePixels.size11,
    color: StaticColors.CrimsonPulse,
  },
  itemDivider: {
    height: 1,
    width: '100%',
  },
});

export default StorageSection;
