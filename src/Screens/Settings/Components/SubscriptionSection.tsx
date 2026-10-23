import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import {
  Crown,
  ChevronRight,
  Sparkles,
  CheckCircle2,
} from 'lucide-react-native';
import { Typography } from '../../../Theme/Typographys';
import { Fonts } from '../../../Theme/fonts';
import ResponsivePixels from '../../../Assets/StyleUtilities/ResponsivePixels';
import { Badge } from '../../../Common/Badge';
import { ProBadge } from '../../../Common/ProBadge';
import { useSettingsTheme } from './types';
import { usePremium } from '../../../Context/PremiumContext';

interface SubscriptionSectionProps {
  onUpgradePress: () => void;
}

export const SubscriptionSection: React.FC<SubscriptionSectionProps> = ({
  onUpgradePress,
}) => {
  const {
    isDarkMode,
    cardBg,
    textPrimary,
    textSecondary,
    borderLight,
    surfaceAlt,
  } = useSettingsTheme();
  const { isPremium, currentPlan, isTrialActive } = usePremium();

  return (
    <View style={styles.container}>
      <View style={styles.sectionHeaderRow}>
        <View style={styles.sectionTitleWithIcon}>
          <Crown size={18} color="#F5C518" strokeWidth={2.4} />
          <Text style={[styles.sectionTitle, { color: textPrimary }]}>
            Membership & Subscription
          </Text>
        </View>
        {isPremium ? (
          <ProBadge size="sm" />
        ) : (
          <Badge label="FREE TIER" variant="yellow" size="sm" />
        )}
      </View>

      {/* 3D Tactile Settings Bento Card */}
      <View
        style={[
          styles.settingsGroupCard,
          {
            backgroundColor: cardBg,
            borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.12)' : '#FFFFFF',
            borderBottomColor: isDarkMode ? '#171A20' : '#E2DCD0',
            shadowColor: isDarkMode ? '#000000' : 'rgba(245, 197, 24, 0.15)',
          },
        ]}
      >
        <TouchableOpacity
          activeOpacity={0.75}
          style={styles.cardTouchWrapper}
          onPress={onUpgradePress}
          accessibilityRole="button"
          accessibilityLabel={
            isPremium
              ? 'Manage Regius Royal Subscription'
              : 'Upgrade to Regius Royal'
          }
        >
          {/* Main Content Row */}
          <View style={styles.topInfoRow}>
            <View
              style={[
                styles.iconBadgeBox,
                {
                  backgroundColor: isPremium
                    ? isDarkMode
                      ? '#2A2615'
                      : '#FFF9E0'
                    : isDarkMode
                    ? '#22252A'
                    : '#FFFCEB',
                  borderColor: isPremium ? '#F5C518' : '#FDE68A',
                },
              ]}
            >
              <Crown
                size={22}
                color="#F5C518"
                fill={isPremium ? '#F5C518' : 'none'}
                strokeWidth={2.2}
              />
            </View>

            <View style={styles.textColumn}>
              <View style={styles.titleRow}>
                <Text style={[styles.planTitle, { color: textPrimary }]}>
                  {isPremium
                    ? currentPlan === 'lifetime'
                      ? 'Monarch Lifetime'
                      : currentPlan === 'monthly'
                      ? 'Royal Monthly Pass'
                      : 'Royal Annual Pass'
                    : 'Regius Royal Membership'}
                </Text>
                {isPremium && (
                  <CheckCircle2 size={16} color="#21AF85" strokeWidth={2.4} />
                )}
              </View>

              <Text style={[styles.planSubtitle, { color: textSecondary }]}>
                {isPremium
                  ? isTrialActive
                    ? 'Free trial active • All features unlocked'
                    : 'Active membership • All perks unlocked'
                  : 'Unlimited Kokoro AI voices, all 8 luxury themes & 2x XP boost'}
              </Text>
            </View>

            <ChevronRight size={18} color={textSecondary} strokeWidth={2} />
          </View>

          {/* Perks Chip Row */}
          <View style={styles.perksRow}>
            {isPremium ? (
              <>
                <Badge label="8 Themes Active" variant="green" size="sm" />
                <Badge label="Unlimited Voices" variant="purple" size="sm" />
                <Badge label="2x XP Boost" variant="yellow" size="sm" />
              </>
            ) : (
              <>
                <Badge label="All 8 Themes" variant="purple" size="sm" />
                <Badge label="Unlimited Voices" variant="yellow" size="sm" />
                <Badge label="Custom Wake Words" variant="orange" size="sm" />
              </>
            )}
          </View>

          {/* Action Row / Bottom Pill */}
          <View
            style={[
              styles.actionPillRow,
              {
                backgroundColor: surfaceAlt,
                borderColor: borderLight,
              },
            ]}
          >
            <View style={styles.actionPillLeft}>
              <Sparkles size={13} color="#F5C518" strokeWidth={2.2} />
              <Text style={[styles.actionPillText, { color: textPrimary }]}>
                {isPremium
                  ? 'Manage Plan & Billing'
                  : 'Start 14-Day Free Trial • Save 50%'}
              </Text>
            </View>
            <View style={styles.arrowWrap}>
              <Text
                style={[
                  styles.viewDetailsText,
                  { color: isPremium ? textSecondary : '#B47804' },
                ]}
              >
                {isPremium ? 'View' : 'Upgrade'}
              </Text>
              <ChevronRight
                size={14}
                color={isPremium ? textSecondary : '#B47804'}
                strokeWidth={2.2}
              />
            </View>
          </View>
        </TouchableOpacity>
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
    paddingVertical: ResponsivePixels.size14,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 14,
    elevation: 4,
  },
  cardTouchWrapper: {
    gap: 12,
  },
  topInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconBadgeBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textColumn: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  planTitle: {
    fontFamily: Fonts.poppins.bold,
    fontSize: 14.5,
  },
  planSubtitle: {
    fontFamily: Fonts.poppins.regular,
    fontSize: 11.5,
    lineHeight: 16,
    marginTop: 2,
  },
  perksRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
  },
  actionPillRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 14,
    borderWidth: 1,
    marginTop: 2,
  },
  actionPillLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  actionPillText: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: 11.5,
  },
  arrowWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  viewDetailsText: {
    fontFamily: Fonts.poppins.bold,
    fontSize: 11.5,
  },
});

export default SubscriptionSection;
