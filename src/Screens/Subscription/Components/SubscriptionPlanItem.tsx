import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Check } from 'lucide-react-native';

import { Colors } from '../../../Assets/StyleUtilities/Colors';
import { Fonts } from '../../../Theme/fonts';
import { Badge } from '../../../Common/Badge';
import { useTheme } from '../../../Theme/ThemeContext';
import {
  SubscriptionPlan,
  SubscriptionPlanId,
} from '../../../Context/PremiumContext';
import ResponsivePixels from '../../../Assets/StyleUtilities/ResponsivePixels';

export interface SubscriptionPlanItemProps {
  plan: SubscriptionPlan;
  isSelected: boolean;
  isDarkMode: boolean;
  onSelect: (planId: SubscriptionPlanId) => void;
}

export const SubscriptionPlanItem: React.FC<SubscriptionPlanItemProps> =
  React.memo(({ plan, isSelected, isDarkMode, onSelect }) => {
    const { Colors: themeColors } = useTheme();
    const cardBg =
      themeColors.CardBackground ||
      (isDarkMode ? Colors.DarkCardBackground : Colors.PureWhite);
    const textPrimary =
      themeColors.PrimaryText ||
      (isDarkMode ? Colors.PureWhite : Colors.NoirBlack);
    const textSecondary =
      themeColors.SecondaryText ||
      (isDarkMode ? Colors.SteelMist : Colors.SubtitleGray);
    const borderLight =
      themeColors.BorderLight ||
      (isDarkMode ? Colors.CarbonSlate : Colors.WarmParchmentBorder);

    return (
      <TouchableOpacity
        activeOpacity={0.88}
        onPress={() => onSelect(plan.id)}
        style={[
          styles.planCard,
          {
            backgroundColor: isSelected
              ? isDarkMode
                ? Colors.SubscriptionPlanSelectedDarkBg
                : Colors.ObsidianTextLight
              : cardBg,
            borderColor: isSelected ? Colors.AccentYellow : borderLight,
            borderWidth: isSelected ? 2.5 : 1.5,
          },
          isSelected && styles.selectedPlanGlow,
        ]}
        accessibilityRole="radio"
        accessibilityState={{ selected: isSelected }}
        accessibilityLabel={`${plan.name}, ${plan.price} ${plan.period}`}
      >
        {/* Header Tag / Badge */}
        {plan.badgeText ? (
          <View style={styles.planBadgeWrap}>
            <Badge
              label={plan.badgeText}
              variant={plan.popular ? 'yellow' : 'purple'}
              size="sm"
            />
          </View>
        ) : null}

        <View style={styles.planCardTopRow}>
          {/* Radio / Selection Circle */}
          <View
            style={[
              styles.selectionCircle,
              {
                borderColor: isSelected
                  ? Colors.AccentYellow
                  : isDarkMode
                  ? Colors.Gray600
                  : Colors.Gray300,
                backgroundColor: isSelected
                  ? Colors.AccentYellow
                  : Colors.Transparent,
              },
            ]}
          >
            {isSelected && (
              <Check size={ResponsivePixels.size12} color={Colors.MidnightCharcoal} strokeWidth={3} />
            )}
          </View>

          <View style={styles.planNameColumn}>
            <Text style={[styles.planNameText, { color: textPrimary }]}>
              {plan.name}
            </Text>
            {plan.monthlyEquivalent && (
              <Text
                style={[styles.planEquivalentText, { color: textSecondary }]}
              >
                Just {plan.monthlyEquivalent}
              </Text>
            )}
          </View>

          <View style={styles.planPriceColumn}>
            <Text style={[styles.planPrice, { color: textPrimary }]}>
              {plan.price}
            </Text>
            <Text style={[styles.planPeriod, { color: textSecondary }]}>
              {plan.period}
            </Text>
          </View>
        </View>

        {/* Subtext info */}
        <Text style={[styles.planBillingDesc, { color: textSecondary }]}>
          {plan.billingText}
        </Text>
      </TouchableOpacity>
    );
  });

const styles = StyleSheet.create({
  planCard: {
    borderRadius: ResponsivePixels.size20,
    padding: ResponsivePixels.size16,
    position: 'relative',
    shadowColor: Colors.PureBlack,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  selectedPlanGlow: {
    shadowColor: Colors.AccentYellow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 5,
  },
  planBadgeWrap: {
    position: 'absolute',
    top: -ResponsivePixels.size10,
    right: ResponsivePixels.size18,
    zIndex: 10,
  },
  planCardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: ResponsivePixels.size8,
  },
  selectionCircle: {
    width: ResponsivePixels.size22,
    height: ResponsivePixels.size22,
    borderRadius: ResponsivePixels.size11,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: ResponsivePixels.size12,
  },
  planNameColumn: {
    flex: 1,
  },
  planNameText: {
    fontFamily: Fonts.poppins.bold,
    fontSize: ResponsivePixels.size15,
  },
  planEquivalentText: {
    fontFamily: Fonts.poppins.medium,
    fontSize: ResponsivePixels.size11,
    marginTop: ResponsivePixels.size1,
  },
  planPriceColumn: {
    alignItems: 'flex-end',
  },
  planPrice: {
    fontFamily: Fonts.ranade.bold,
    fontSize: ResponsivePixels.size18,
  },
  planPeriod: {
    fontFamily: Fonts.poppins.regular,
    fontSize: ResponsivePixels.size11,
  },
  planBillingDesc: {
    fontFamily: Fonts.poppins.regular,
    fontSize: ResponsivePixels.size11_5,
    marginLeft: ResponsivePixels.size34,
  },
});

export default SubscriptionPlanItem;
