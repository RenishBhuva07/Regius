import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Check } from 'lucide-react-native';

import { Fonts } from '../../../Theme/fonts';
import { Badge } from '../../../Common/Badge';
import {
  SubscriptionPlan,
  SubscriptionPlanId,
} from '../../../Context/PremiumContext';

export interface SubscriptionPlanItemProps {
  plan: SubscriptionPlan;
  isSelected: boolean;
  isDarkMode: boolean;
  onSelect: (planId: SubscriptionPlanId) => void;
}

export const SubscriptionPlanItem: React.FC<SubscriptionPlanItemProps> =
  React.memo(({ plan, isSelected, isDarkMode, onSelect }) => {
    const cardBg = isDarkMode ? '#1E2228' : '#FFFFFF';
    const textPrimary = isDarkMode ? '#FFFFFF' : '#111111';
    const textSecondary = isDarkMode ? '#A3A8B1' : '#666665';
    const borderLight = isDarkMode ? '#2C3035' : '#EAE5D9';

    return (
      <TouchableOpacity
        activeOpacity={0.88}
        onPress={() => onSelect(plan.id)}
        style={[
          styles.planCard,
          {
            backgroundColor: isSelected
              ? isDarkMode
                ? '#26241D'
                : '#FFFDF0'
              : cardBg,
            borderColor: isSelected ? '#F5C518' : borderLight,
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
                  ? '#F5C518'
                  : isDarkMode
                  ? '#4B5563'
                  : '#D1D5DB',
                backgroundColor: isSelected ? '#F5C518' : 'transparent',
              },
            ]}
          >
            {isSelected && <Check size={12} color="#1F2228" strokeWidth={3} />}
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
    borderRadius: 20,
    padding: 16,
    position: 'relative',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  selectedPlanGlow: {
    shadowColor: '#F5C518',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 5,
  },
  planBadgeWrap: {
    position: 'absolute',
    top: -10,
    right: 18,
    zIndex: 10,
  },
  planCardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  selectionCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  planNameColumn: {
    flex: 1,
  },
  planNameText: {
    fontFamily: Fonts.poppins.bold,
    fontSize: 15,
  },
  planEquivalentText: {
    fontFamily: Fonts.poppins.medium,
    fontSize: 11,
    marginTop: 1,
  },
  planPriceColumn: {
    alignItems: 'flex-end',
  },
  planPrice: {
    fontFamily: Fonts.ranade.bold,
    fontSize: 18,
  },
  planPeriod: {
    fontFamily: Fonts.poppins.regular,
    fontSize: 11,
  },
  planBillingDesc: {
    fontFamily: Fonts.poppins.regular,
    fontSize: 11.5,
    marginLeft: 34,
  },
});

export default SubscriptionPlanItem;
