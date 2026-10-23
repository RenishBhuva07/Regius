import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Platform,
  Vibration,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import {
  ChevronLeft,
  Crown,
  Sparkles,
  Palette,
  Mic,
  Zap,
  ShieldCheck,
  Check,
  Star,
  CheckCircle2,
  Volume2,
} from 'lucide-react-native';
import Toast from 'react-native-toast-message';

import { Typography } from '../../Theme/Typographys';
import { Fonts } from '../../Theme/fonts';
import { Colors } from '../../Assets/StyleUtilities/Colors';
import ResponsivePixels from '../../Assets/StyleUtilities/ResponsivePixels';
import { Badge } from '../../Common/Badge';
import { ProBadge } from '../../Common/ProBadge';
import { useTheme } from '../../Theme/ThemeContext';
import {
  usePremium,
  SubscriptionPlanId,
  SubscriptionPlan,
} from '../../Context/PremiumContext';

export const SubscriptionScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const { isDarkMode } = useTheme();
  const {
    isPremium,
    currentPlan,
    plans,
    purchasePlan,
    restorePurchases,
    cancelSubscription,
    isTrialActive,
  } = usePremium();

  const [selectedPlanId, setSelectedPlanId] =
    useState<SubscriptionPlanId>('annual');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);

  const bgMain = isDarkMode ? '#121417' : Colors.CreamBackground;
  const cardBg = isDarkMode ? '#1E2228' : '#FFFFFF';
  const textPrimary = isDarkMode ? '#FFFFFF' : '#111111';
  const textSecondary = isDarkMode ? '#A3A8B1' : '#666665';
  const borderLight = isDarkMode ? '#2C3035' : '#EAE5D9';
  const surfaceAlt = isDarkMode ? '#181B20' : '#F7F5EC';

  const selectedPlan = plans.find(p => p.id === selectedPlanId) || plans[0];

  const handleSelectPlan = (planId: SubscriptionPlanId) => {
    Vibration.vibrate(20);
    setSelectedPlanId(planId);
  };

  const handlePurchase = async () => {
    if (isPremium) {
      Toast.show({
        type: 'info',
        text1: 'Royal Membership Active',
        text2: 'You already have full access to all Regius Royal perks.',
      });
      return;
    }

    setIsProcessing(true);
    Vibration.vibrate(35);

    try {
      // Simulate real store payment sheet transition
      await new Promise<void>(resolve => {
        setTimeout(() => resolve(), 800);
      });
      const success = await purchasePlan(selectedPlanId);
      if (success) {
        Vibration.vibrate([0, 40, 80, 50]);
        Toast.show({
          type: 'success',
          text1: '👑 Welcome to Regius Royal!',
          text2: `Your ${selectedPlan.name} is now active. All perks unlocked.`,
        });
        setTimeout(() => {
          navigation.goBack();
        }, 1200);
      }
    } catch {
      Toast.show({
        type: 'error',
        text1: 'Purchase Failed',
        text2: 'Could not complete the purchase. Please try again.',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRestore = async () => {
    setIsRestoring(true);
    Vibration.vibrate(20);
    try {
      const restored = await restorePurchases();
      if (restored) {
        Toast.show({
          type: 'success',
          text1: 'Purchases Restored',
          text2: 'Your Regius Royal membership has been restored successfully.',
        });
      } else {
        Toast.show({
          type: 'info',
          text1: 'No Active Subscription Found',
          text2: 'We could not find an active past purchase for this account.',
        });
      }
    } catch {
      Toast.show({
        type: 'error',
        text1: 'Restore Error',
        text2: 'Could not restore purchases at this time.',
      });
    } finally {
      setIsRestoring(false);
    }
  };

  const handleCancelSub = async () => {
    Vibration.vibrate(25);
    await cancelSubscription();
    Toast.show({
      type: 'info',
      text1: 'Subscription Reset',
      text2: 'Reverted back to the free tier.',
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: bgMain }]}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        {...(Platform.OS === 'android' ? { backgroundColor: bgMain } : {})}
      />

      {/* Top Navigation Bar */}
      <View
        style={[
          styles.headerBar,
          {
            paddingTop: Math.max(insets.top, 16),
            backgroundColor: bgMain,
            borderBottomColor: borderLight,
          },
        ]}
      >
        <TouchableOpacity
          activeOpacity={0.7}
          style={[
            styles.roundBackBtn,
            {
              backgroundColor: cardBg,
              borderColor: borderLight,
            },
          ]}
          onPress={() => navigation.goBack()}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <ChevronLeft size={22} color={textPrimary} strokeWidth={2.4} />
        </TouchableOpacity>

        <View style={styles.headerTitleWrap}>
          <Text style={[styles.headerTitle, { color: textPrimary }]}>
            Regius Royal
          </Text>
          <ProBadge size="sm" />
        </View>

        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.restoreBtn}
          onPress={handleRestore}
          disabled={isRestoring}
          accessibilityRole="button"
          accessibilityLabel="Restore Purchases"
        >
          {isRestoring ? (
            <ActivityIndicator size="small" color="#F5C518" />
          ) : (
            <Text style={styles.restoreBtnText}>Restore</Text>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 120 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Signature Hero Bento Card (2-layer wrapper adhering strictly to DESIGN_SYSTEM.md) */}
        <View style={styles.heroOuterWrapper}>
          <View style={styles.cardShadowWrapper}>
            <View style={styles.card}>
              <View style={styles.heroGlowCircle} />

              <View style={styles.heroCardContent}>
                {/* Top Badge & Crown Row */}
                <View style={styles.heroTopRow}>
                  <View style={styles.crownIconBox}>
                    <Crown
                      size={24}
                      color="#F5C518"
                      fill="#F5C518"
                      strokeWidth={2.2}
                    />
                  </View>
                  <View style={styles.heroBadgeGroup}>
                    <Badge
                      label={isPremium ? 'ROYAL MONARCH' : 'ELITE PASS'}
                      variant="yellow"
                      size="sm"
                    />
                  </View>
                </View>

                {/* Hero Title */}
                <Text style={styles.heroTitle}>
                  {isPremium
                    ? 'Regius Royal Active'
                    : 'Elevate Your Mindful Productivity'}
                </Text>

                {/* Hero Description */}
                <Text style={styles.heroDesc}>
                  {isPremium
                    ? `You are enjoying full unlimited access with the ${
                        currentPlan === 'lifetime'
                          ? 'Monarch Lifetime License'
                          : currentPlan === 'monthly'
                          ? 'Royal Monthly Membership'
                          : 'Royal Annual Pass'
                      }.`
                    : 'Experience Regius without boundaries. Unleash unlimited AI voice synthesis, custom neural wake phrases, and all artisanal theme palettes.'}
                </Text>

                {/* Hero Feature Pills */}
                <View style={styles.heroPillsRow}>
                  <View style={styles.heroPill}>
                    <Sparkles size={12} color="#F5C518" strokeWidth={2.4} />
                    <Text style={styles.heroPillText}>Unlimited AI Voice</Text>
                  </View>
                  <View style={styles.heroPill}>
                    <Palette size={12} color="#F5C518" strokeWidth={2.4} />
                    <Text style={styles.heroPillText}>8 Luxury Themes</Text>
                  </View>
                  <View style={styles.heroPill}>
                    <Zap size={12} color="#F5C518" strokeWidth={2.4} />
                    <Text style={styles.heroPillText}>2x XP Boost</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Perks Section Title */}
        <View style={styles.sectionHeaderRow}>
          <Crown size={18} color="#F5C518" strokeWidth={2.4} />
          <Text style={[styles.sectionTitle, { color: textPrimary }]}>
            Everything Included in Royal
          </Text>
        </View>

        {/* Perks Bento Grid */}
        <View style={styles.perksContainer}>
          <View
            style={[
              styles.perkCard,
              {
                backgroundColor: cardBg,
                borderColor: borderLight,
              },
            ]}
          >
            <View
              style={[
                styles.perkIconBox,
                { backgroundColor: isDarkMode ? '#2C3035' : '#EFF2FE' },
              ]}
            >
              <Volume2 size={20} color="#8383D6" strokeWidth={2.2} />
            </View>
            <View style={styles.perkInfo}>
              <Text style={[styles.perkTitle, { color: textPrimary }]}>
                Unlimited Neural TTS Voice
              </Text>
              <Text style={[styles.perkDesc, { color: textSecondary }]}>
                Kokoro-82M cloud synthesis with zero rate limits, studio-grade
                clarity, and all 7 voice personas.
              </Text>
            </View>
          </View>

          <View
            style={[
              styles.perkCard,
              {
                backgroundColor: cardBg,
                borderColor: borderLight,
              },
            ]}
          >
            <View
              style={[
                styles.perkIconBox,
                { backgroundColor: isDarkMode ? '#2C3035' : '#FFFCEB' },
              ]}
            >
              <Palette size={20} color="#F5C518" strokeWidth={2.2} />
            </View>
            <View style={styles.perkInfo}>
              <Text style={[styles.perkTitle, { color: textPrimary }]}>
                All 8 Luxury Artisan Themes
              </Text>
              <Text style={[styles.perkDesc, { color: textSecondary }]}>
                Instantly unlock Imperial Obsidian, Midnight Velvet, Tuscan
                Amber, and all high-tier palettes.
              </Text>
            </View>
          </View>

          <View
            style={[
              styles.perkCard,
              {
                backgroundColor: cardBg,
                borderColor: borderLight,
              },
            ]}
          >
            <View
              style={[
                styles.perkIconBox,
                { backgroundColor: isDarkMode ? '#2C3035' : '#FFF3E0' },
              ]}
            >
              <Mic size={20} color="#FF9800" strokeWidth={2.2} />
            </View>
            <View style={styles.perkInfo}>
              <Text style={[styles.perkTitle, { color: textPrimary }]}>
                Custom Wake Word Studio
              </Text>
              <Text style={[styles.perkDesc, { color: textSecondary }]}>
                Create and train custom wake-word phrases with real-time
                on-device acoustic sensitivity.
              </Text>
            </View>
          </View>

          <View
            style={[
              styles.perkCard,
              {
                backgroundColor: cardBg,
                borderColor: borderLight,
              },
            ]}
          >
            <View
              style={[
                styles.perkIconBox,
                { backgroundColor: isDarkMode ? '#2C3035' : '#EEF2FF' },
              ]}
            >
              <Zap size={20} color="#6366F1" strokeWidth={2.2} />
            </View>
            <View style={styles.perkInfo}>
              <Text style={[styles.perkTitle, { color: textPrimary }]}>
                2x Milestone XP Multiplier
              </Text>
              <Text style={[styles.perkDesc, { color: textSecondary }]}>
                Earn double XP for every completed task, reminder, and habit to
                reach Tier 5 Grand Monarch faster.
              </Text>
            </View>
          </View>

          <View
            style={[
              styles.perkCard,
              {
                backgroundColor: cardBg,
                borderColor: borderLight,
              },
            ]}
          >
            <View
              style={[
                styles.perkIconBox,
                { backgroundColor: isDarkMode ? '#2C3035' : '#EDFDF5' },
              ]}
            >
              <ShieldCheck size={20} color="#21AF85" strokeWidth={2.2} />
            </View>
            <View style={styles.perkInfo}>
              <Text style={[styles.perkTitle, { color: textPrimary }]}>
                Encrypted Cloud Sync & Backup
              </Text>
              <Text style={[styles.perkDesc, { color: textSecondary }]}>
                Continuous zero-knowledge cloud backup across all your devices
                with instant recovery.
              </Text>
            </View>
          </View>
        </View>

        {/* Plan Selector */}
        <View style={styles.sectionHeaderRow}>
          <Sparkles size={18} color="#F5C518" strokeWidth={2.4} />
          <Text style={[styles.sectionTitle, { color: textPrimary }]}>
            Choose Your Plan
          </Text>
        </View>

        <View style={styles.plansContainer}>
          {plans.map(plan => {
            const isSelected = selectedPlanId === plan.id;
            return (
              <TouchableOpacity
                key={plan.id}
                activeOpacity={0.88}
                onPress={() => handleSelectPlan(plan.id)}
                style={[
                  styles.planCard,
                  {
                    backgroundColor: cardBg,
                    borderColor: isSelected
                      ? '#F5C518'
                      : isDarkMode
                      ? '#2C3035'
                      : '#EAE5D9',
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
                    {isSelected && (
                      <Check size={12} color="#1F2228" strokeWidth={3} />
                    )}
                  </View>

                  <View style={styles.planNameColumn}>
                    <Text style={[styles.planNameText, { color: textPrimary }]}>
                      {plan.name}
                    </Text>
                    {plan.monthlyEquivalent && (
                      <Text
                        style={[
                          styles.planEquivalentText,
                          { color: textSecondary },
                        ]}
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
                <Text
                  style={[styles.planBillingDesc, { color: textSecondary }]}
                >
                  {plan.billingText}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Social Proof / Guarantee */}
        <View
          style={[
            styles.trustCard,
            {
              backgroundColor: surfaceAlt,
              borderColor: borderLight,
            },
          ]}
        >
          <View style={styles.starsRow}>
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={14}
                color="#F5C518"
                fill="#F5C518"
                strokeWidth={2}
              />
            ))}
            <Text style={[styles.ratingText, { color: textPrimary }]}>
              4.9/5 from 12,000+ members
            </Text>
          </View>
          <Text style={[styles.guaranteeDesc, { color: textSecondary }]}>
            “Regius transformed how I organize my days with voice and elegant
            tactile focus. Upgrading was the easiest decision of the year.”
          </Text>
          <Text style={[styles.guaranteeAuthor, { color: textPrimary }]}>
            — Marcus Vance, Design Principal
          </Text>
        </View>

        {/* If Subscribed, show Cancel / Management option */}
        {isPremium && (
          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.cancelSubBtn}
            onPress={handleCancelSub}
            accessibilityRole="button"
            accessibilityLabel="Reset subscription to free tier"
          >
            <Text style={styles.cancelSubBtnText}>
              Reset to Free Tier (For Testing)
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>

      {/* Sticky Bottom Action Container */}
      <View
        style={[
          styles.bottomActionContainer,
          {
            paddingBottom: Math.max(insets.bottom, 16),
            backgroundColor: bgMain,
            borderTopColor: borderLight,
          },
        ]}
      >
        <TouchableOpacity
          activeOpacity={0.88}
          style={[
            styles.ctaButton,
            isPremium && styles.ctaButtonActive,
            isProcessing && { opacity: 0.8 },
          ]}
          onPress={handlePurchase}
          disabled={isProcessing}
          accessibilityRole="button"
          accessibilityLabel={
            isPremium
              ? 'Regius Royal Active'
              : selectedPlan.trialDays > 0
              ? `Start ${selectedPlan.trialDays}-day free trial`
              : `Upgrade to ${selectedPlan.name}`
          }
        >
          {isProcessing ? (
            <ActivityIndicator size="small" color="#1F2228" />
          ) : isPremium ? (
            <View style={styles.ctaContentRow}>
              <CheckCircle2 size={18} color="#1F2228" strokeWidth={2.4} />
              <Text style={styles.ctaButtonText}>Royal Access Active</Text>
            </View>
          ) : (
            <View style={styles.ctaContentRow}>
              <Crown size={18} color="#1F2228" strokeWidth={2.4} />
              <Text style={styles.ctaButtonText}>
                {selectedPlan.trialDays > 0
                  ? `Start ${selectedPlan.trialDays}-Day Free Trial`
                  : `Upgrade to ${selectedPlan.name}`}
              </Text>
            </View>
          )}
        </TouchableOpacity>

        <Text style={[styles.legalMicrocopy, { color: textSecondary }]}>
          Recurring billing • Cancel anytime in store settings • Zero commitment
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: ResponsivePixels.size16,
    paddingBottom: ResponsivePixels.size12,
    borderBottomWidth: 1,
    zIndex: 10,
  },
  roundBackBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitleWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    ...Typography.h1RanadeBold,
    fontSize: 20,
  },
  restoreBtn: {
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  restoreBtnText: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: 13,
    color: '#B47804',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: ResponsivePixels.size16,
    paddingTop: ResponsivePixels.size14,
  },
  heroOuterWrapper: {
    paddingHorizontal: 2,
    marginBottom: ResponsivePixels.size20,
  },
  cardShadowWrapper: {
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.28,
        shadowRadius: 18,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  card: {
    backgroundColor: Colors.NeroBlack,
    borderRadius: 24,
    borderWidth: 4,
    borderColor: 'rgba(255, 255, 255, 0.9)',
    overflow: 'hidden',
    position: 'relative',
  },
  heroGlowCircle: {
    position: 'absolute',
    top: -40,
    right: -40,
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(245, 197, 24, 0.18)',
  },
  heroCardContent: {
    padding: ResponsivePixels.size20,
  },
  heroTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: ResponsivePixels.size12,
  },
  crownIconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(245, 197, 24, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(245, 197, 24, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroBadgeGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  heroTitle: {
    ...Typography.h1RanadeBold,
    color: '#FFFFFF',
    fontSize: 22,
    lineHeight: 28,
    marginBottom: ResponsivePixels.size8,
  },
  heroDesc: {
    fontFamily: Fonts.poppins.regular,
    fontSize: 12.5,
    lineHeight: 18,
    color: '#D1D5DB',
    marginBottom: ResponsivePixels.size16,
  },
  heroPillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  heroPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  heroPillText: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: 11,
    color: '#FFFFFF',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: ResponsivePixels.size8,
    marginBottom: ResponsivePixels.size12,
  },
  sectionTitle: {
    ...Typography.h6Bold,
    fontSize: 16,
  },
  perksContainer: {
    gap: 10,
    marginBottom: ResponsivePixels.size24,
  },
  perkCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: ResponsivePixels.size14,
    borderRadius: 18,
    borderWidth: 1.2,
    gap: 12,
  },
  perkIconBox: {
    width: 42,
    height: 42,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  perkInfo: {
    flex: 1,
  },
  perkTitle: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: 13.5,
    marginBottom: 2,
  },
  perkDesc: {
    fontFamily: Fonts.poppins.regular,
    fontSize: 11.5,
    lineHeight: 16,
  },
  plansContainer: {
    gap: 12,
    marginBottom: ResponsivePixels.size24,
  },
  planCard: {
    borderRadius: 20,
    padding: ResponsivePixels.size16,
    position: 'relative',
  },
  selectedPlanGlow: {
    ...Platform.select({
      ios: {
        shadowColor: '#F5C518',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  planBadgeWrap: {
    position: 'absolute',
    top: -10,
    right: 16,
    zIndex: 2,
  },
  planCardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 6,
  },
  selectionCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  planNameColumn: {
    flex: 1,
  },
  planNameText: {
    fontFamily: Fonts.poppins.bold,
    fontSize: 15,
  },
  planEquivalentText: {
    fontFamily: Fonts.poppins.regular,
    fontSize: 11,
    marginTop: 1,
  },
  planPriceColumn: {
    alignItems: 'flex-end',
  },
  planPrice: {
    fontFamily: Fonts.poppins.bold,
    fontSize: 17,
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
  trustCard: {
    borderRadius: 18,
    borderWidth: 1,
    padding: ResponsivePixels.size14,
    marginBottom: ResponsivePixels.size20,
  },
  starsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 6,
  },
  ratingText: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: 11.5,
    marginLeft: 4,
  },
  guaranteeDesc: {
    fontFamily: Fonts.poppins.regular,
    fontSize: 11.5,
    lineHeight: 16,
    fontStyle: 'italic',
    marginBottom: 4,
  },
  guaranteeAuthor: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: 11,
  },
  cancelSubBtn: {
    alignSelf: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  cancelSubBtnText: {
    fontFamily: Fonts.poppins.regular,
    fontSize: 12,
    color: '#FF3B30',
    textDecorationLine: 'underline',
  },
  bottomActionContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: ResponsivePixels.size16,
    paddingTop: ResponsivePixels.size12,
    borderTopWidth: 1,
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  ctaButton: {
    backgroundColor: '#F5C518',
    borderRadius: 28,
    paddingVertical: ResponsivePixels.size14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: ResponsivePixels.size8,
    borderBottomWidth: 3,
    borderBottomColor: '#D97706',
    ...Platform.select({
      ios: {
        shadowColor: '#F5C518',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.35,
        shadowRadius: 10,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  ctaButtonActive: {
    backgroundColor: '#C6FFDD',
    borderBottomColor: '#21AF85',
  },
  ctaContentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  ctaButtonText: {
    fontFamily: Fonts.poppins.bold,
    fontSize: 15,
    color: '#1F2228',
    letterSpacing: 0.3,
  },
  legalMicrocopy: {
    textAlign: 'center',
    fontFamily: Fonts.poppins.regular,
    fontSize: 10.5,
  },
});

export default SubscriptionScreen;
