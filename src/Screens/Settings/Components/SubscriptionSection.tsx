import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
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
import Colors, { withAlpha } from '../../../Assets/StyleUtilities/Colors';
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
    activeThemeId,
    cardBg,
    textPrimary,
    textSecondary,
    canvasTextPrimary,
    borderLight,
    surfaceAlt,
  } = useSettingsTheme();
  const { isPremium, currentPlan, isTrialActive } = usePremium();

  return (
    <View style={styles.container}>
      <View style={styles.sectionHeaderRow}>
        <View style={styles.sectionTitleWithIcon}>
          <Crown size={ResponsivePixels.size18} color={Colors.AccentYellow} strokeWidth={2.4} />
          <Text style={[styles.sectionTitle, { color: canvasTextPrimary }]}>
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
            borderColor:
              activeThemeId === 'cyprus_sand'
                ? Colors.CyprusBorderDarkCard
                : isDarkMode
                ? withAlpha(Colors.PureWhite, 0.12)
                : Colors.PureWhite,
            borderBottomColor:
              activeThemeId === 'cyprus_sand'
                ? Colors.SandstoneBorder
                : isDarkMode
                ? Colors.DarkSurfaceDeep
                : Colors.WarmStoneBorder,
            shadowColor:
              activeThemeId === 'cyprus_sand'
                ? withAlpha(Colors.CyprusTeal, 0.16)
                : isDarkMode
                ? Colors.PureBlack
                : withAlpha(Colors.AccentYellow, 0.15),
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
                  backgroundColor:
                    activeThemeId === 'cyprus_sand'
                      ? Colors.MilestoneCreamBg
                      : isPremium
                      ? isDarkMode
                        ? Colors.SubscriptionDarkGoldBg
                        : Colors.WorkSoftHighlight
                      : isDarkMode
                      ? Colors.DarkCharcoalSurface
                      : Colors.WorkLightBg,
                  borderColor: isPremium
                    ? Colors.AccentYellow
                    : Colors.VoiceMichaelBorder,
                },
              ]}
            >
              <Crown
                size={ResponsivePixels.size22}
                color={Colors.AccentYellow}
                fill={isPremium ? Colors.AccentYellow : 'none'}
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
                  <CheckCircle2
                    size={ResponsivePixels.size16}
                    color={Colors.LuminousGreen}
                    strokeWidth={2.4}
                  />
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

            <ChevronRight size={ResponsivePixels.size18} color={textSecondary} strokeWidth={2} />
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
              <Sparkles
                size={ResponsivePixels.size13}
                color={Colors.AccentYellow}
                strokeWidth={2.2}
              />
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
                  {
                    color: isPremium ? textSecondary : Colors.BadgeYellowText,
                  },
                ]}
              >
                {isPremium ? 'View' : 'Upgrade'}
              </Text>
              <ChevronRight
                size={ResponsivePixels.size14}
                color={isPremium ? textSecondary : Colors.BadgeYellowText}
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
    paddingVertical: ResponsivePixels.size14,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 14,
    elevation: 4,
  },
  cardTouchWrapper: {
    gap: ResponsivePixels.size12,
  },
  topInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ResponsivePixels.size12,
  },
  iconBadgeBox: {
    width: ResponsivePixels.size44,
    height: ResponsivePixels.size44,
    borderRadius: ResponsivePixels.size14,
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
    gap: ResponsivePixels.size6,
  },
  planTitle: {
    fontFamily: Fonts.poppins.bold,
    fontSize: ResponsivePixels.size14_5,
  },
  planSubtitle: {
    fontFamily: Fonts.poppins.regular,
    fontSize: ResponsivePixels.size11_5,
    lineHeight: ResponsivePixels.size16,
    marginTop: ResponsivePixels.size2,
  },
  perksRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: ResponsivePixels.size6,
  },
  actionPillRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: ResponsivePixels.size8,
    paddingHorizontal: ResponsivePixels.size12,
    borderRadius: ResponsivePixels.size14,
    borderWidth: 1,
    marginTop: ResponsivePixels.size2,
  },
  actionPillLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ResponsivePixels.size6,
  },
  actionPillText: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: ResponsivePixels.size11_5,
  },
  arrowWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ResponsivePixels.size2,
  },
  viewDetailsText: {
    fontFamily: Fonts.poppins.bold,
    fontSize: ResponsivePixels.size11_5,
  },
});

export default SubscriptionSection;
