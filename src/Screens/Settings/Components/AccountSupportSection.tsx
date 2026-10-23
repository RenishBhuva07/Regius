import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import {
  Shield,
  HelpCircle,
  LogOut,
  ChevronRight,
  Crown,
} from 'lucide-react-native';
import Toast from 'react-native-toast-message';
import { Typography } from '../../../Theme/Typographys';
import { Colors as StaticColors } from '../../../Assets/StyleUtilities/Colors';
import ResponsivePixels from '../../../Assets/StyleUtilities/ResponsivePixels';
import { useSettingsTheme } from './types';

interface AccountSupportSectionProps {
  profileEmail: string;
  onSignOutPress: () => void;
  onHelpFaqPress?: () => void;
  onPrivacySecurityPress?: () => void;
  onSubscriptionPress?: () => void;
}

export const AccountSupportSection: React.FC<AccountSupportSectionProps> = ({
  profileEmail,
  onSignOutPress,
  onHelpFaqPress,
  onPrivacySecurityPress,
  onSubscriptionPress,
}) => {
  const { isDarkMode, cardBg, textPrimary, textSecondary, borderLight } =
    useSettingsTheme();

  return (
    <>
      <View style={styles.sectionHeaderRow}>
        <View style={styles.sectionTitleWithIcon}>
          <Shield
            size={18}
            color={StaticColors.LavenderPurple}
            strokeWidth={2.4}
          />
          <Text style={[styles.sectionTitle, { color: textPrimary }]}>
            Support & Account
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
            shadowColor: isDarkMode ? '#000000' : 'rgba(131, 131, 214, 0.12)',
          },
        ]}
      >
        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.settingItemRow}
          onPress={() => {
            if (onHelpFaqPress) {
              onHelpFaqPress();
            } else {
              Toast.show({
                type: 'info',
                text2: 'Regius Help Center & Documentation',
              });
            }
          }}
        >
          <View style={styles.settingItemLeft}>
            <View
              style={[
                styles.iconSquare,
                { backgroundColor: isDarkMode ? '#2C3035' : '#EFF2FE' },
              ]}
            >
              <HelpCircle
                size={18}
                color={StaticColors.LavenderPurple}
                strokeWidth={2.2}
              />
            </View>
            <View style={styles.settingItemMeta}>
              <Text style={[styles.settingItemTitle, { color: textPrimary }]}>
                Help & FAQs
              </Text>
              <Text style={[styles.settingItemDesc, { color: textSecondary }]}>
                Guides, tutorials & keyboard shortcuts
              </Text>
            </View>
          </View>
          <ChevronRight size={16} color={textSecondary} strokeWidth={2} />
        </TouchableOpacity>

        <View style={[styles.itemDivider, { backgroundColor: borderLight }]} />

        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.settingItemRow}
          onPress={() => {
            if (onPrivacySecurityPress) {
              onPrivacySecurityPress();
            } else {
              Toast.show({
                type: 'info',
                text2: 'Regius Privacy Policy & Terms of Service',
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
              <Shield size={18} color="#21AF85" strokeWidth={2.2} />
            </View>
            <View style={styles.settingItemMeta}>
              <Text style={[styles.settingItemTitle, { color: textPrimary }]}>
                Privacy & Data Security
              </Text>
              <Text style={[styles.settingItemDesc, { color: textSecondary }]}>
                End-to-end encrypted AI storage
              </Text>
            </View>
          </View>
          <ChevronRight size={16} color={textSecondary} strokeWidth={2} />
        </TouchableOpacity>

        <View style={[styles.itemDivider, { backgroundColor: borderLight }]} />

        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.settingItemRow}
          onPress={() => {
            if (onSubscriptionPress) {
              onSubscriptionPress();
            } else {
              Toast.show({
                type: 'info',
                text2: 'Regius Royal Membership',
              });
            }
          }}
        >
          <View style={styles.settingItemLeft}>
            <View
              style={[
                styles.iconSquare,
                { backgroundColor: isDarkMode ? '#2C3035' : '#FFFCEB' },
              ]}
            >
              <Crown size={18} color="#F5C518" strokeWidth={2.2} />
            </View>
            <View style={styles.settingItemMeta}>
              <Text style={[styles.settingItemTitle, { color: textPrimary }]}>
                Subscription & Plans
              </Text>
              <Text style={[styles.settingItemDesc, { color: textSecondary }]}>
                Manage your Regius Royal membership
              </Text>
            </View>
          </View>
          <ChevronRight size={16} color={textSecondary} strokeWidth={2} />
        </TouchableOpacity>

        <View style={[styles.itemDivider, { backgroundColor: borderLight }]} />

        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.settingItemRow}
          onPress={onSignOutPress}
        >
          <View style={styles.settingItemLeft}>
            <View
              style={[
                styles.iconSquare,
                { backgroundColor: isDarkMode ? '#2C3035' : '#FFF0F0' },
              ]}
            >
              <LogOut size={18} color="#FF3B30" strokeWidth={2.2} />
            </View>
            <View style={styles.settingItemMeta}>
              <Text style={[styles.settingItemTitle, { color: '#FF3B30' }]}>
                Sign Out of Regius
              </Text>
              <Text style={[styles.settingItemDesc, { color: textSecondary }]}>
                Signed in as {profileEmail}
              </Text>
            </View>
          </View>
          <ChevronRight size={16} color={textSecondary} strokeWidth={2} />
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

export default AccountSupportSection;
