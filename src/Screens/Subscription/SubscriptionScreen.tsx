import React, { useState, useRef, useCallback } from 'react';
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
  Animated,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import {
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
  Flame,
  Radio,
} from 'lucide-react-native';
import Toast from 'react-native-toast-message';

import { Typography } from '../../Theme/Typographys';
import { Fonts } from '../../Theme/fonts';
import { Colors } from '../../Assets/StyleUtilities/Colors';
import ResponsivePixels from '../../Assets/StyleUtilities/ResponsivePixels';
import { Badge } from '../../Common/Badge';
import {
  SubScreenHeader,
  SUB_SCREEN_HEADER_HEIGHT,
} from '../../Common/SubScreenHeader';
import { useScrollReactiveHeader } from '../../Common/useScrollReactiveHeader';
import { ProBadge } from '../../Common/ProBadge';
import { useTheme } from '../../Theme/ThemeContext';
import {
  usePremium,
  SubscriptionPlanId,
  SubscriptionPlan,
} from '../../Context/PremiumContext';
import { SettingsBackgroundSvg } from '../Settings/Components/SettingsBackgroundSvg';

const HEADER_HEIGHT = SUB_SCREEN_HEADER_HEIGHT;

export const SubscriptionScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const { isDarkMode } = useTheme();
  const { width: screenWidth } = Dimensions.get('window');

  const {
    isPremium,
    currentPlan,
    plans,
    purchasePlan,
    restorePurchases,
    cancelSubscription,
  } = usePremium();

  const [selectedPlanId, setSelectedPlanId] =
    useState<SubscriptionPlanId>('annual');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);

  // Scroll tracking for reactive header layer
  const { scrollY, isScrolled, handleScroll } = useScrollReactiveHeader();

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
      {/* Luxury Background Artwork */}
      <SettingsBackgroundSvg />

      {/* Scroll-Reactive Header */}
      <SubScreenHeader
        title={
          <View style={styles.titleRow}>
            <Text
              style={[
                styles.headerTitle,
                isScrolled
                  ? styles.headerTitleScrolled
                  : { color: textPrimary },
              ]}
              numberOfLines={1}
            >
              Regius Royal
            </Text>
            <ProBadge size="sm" />
          </View>
        }
        scrollY={scrollY}
        isScrolled={isScrolled}
        rightAction={
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
              <Text
                style={[
                  styles.restoreBtnText,
                  isScrolled && styles.restoreBtnTextScrolled,
                ]}
              >
                Restore
              </Text>
            )}
          </TouchableOpacity>
        }
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: insets.top + HEADER_HEIGHT + 14,
            paddingBottom: insets.bottom + 124,
          },
        ]}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {/* Imperial Monarch */}
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

        {/* Perks Bento Matrix (6 Category Trios) */}
        <View style={styles.sectionHeaderRow}>
          <Crown size={18} color="#F5C518" strokeWidth={2.4} />
          <Text style={[styles.sectionTitle, { color: textPrimary }]}>
            Everything Included in Royal
          </Text>
        </View>

        <View style={styles.perksContainer}>
          {[
            {
              icon: Volume2,
              title: 'Unlimited Neural TTS Voice',
              desc: 'Kokoro-82M cloud synthesis with zero rate limits, studio-grade clarity, and all 7 voice personas.',
              accent: '#8383D6',
              bg: isDarkMode ? '#23273A' : '#EFF2FE',
              border: isDarkMode ? '#484E70' : '#D8DBFF',
            },
            {
              icon: Palette,
              title: 'All 8 Luxury Artisan Themes',
              desc: 'Instantly unlock Imperial Obsidian, Midnight Velvet, Tuscan Amber, and all high-tier palettes.',
              accent: '#F5C518',
              bg: isDarkMode ? '#332918' : '#FFFCEB',
              border: isDarkMode ? '#665126' : '#FFF5B8',
            },
            {
              icon: Mic,
              title: 'Custom Wake Word Studio',
              desc: 'Create and train custom wake-word phrases with real-time on-device acoustic sensitivity.',
              accent: '#FF9800',
              bg: isDarkMode ? '#331F18' : '#FFF0DE',
              border: isDarkMode ? '#663B26' : '#FFB86B',
            },
            {
              icon: Zap,
              title: '2x Milestone XP Multiplier',
              desc: 'Earn double XP for every completed task, reminder, and habit to reach Tier 5 Grand Monarch faster.',
              accent: '#6366F1',
              bg: isDarkMode ? '#242540' : '#EEF2FF',
              border: isDarkMode ? '#424578' : '#D5DAFD',
            },
            {
              icon: ShieldCheck,
              title: 'Encrypted Cloud Sync & Backup',
              desc: 'Continuous zero-knowledge cloud backup across all your devices with instant recovery.',
              accent: '#21AF85',
              bg: isDarkMode ? '#172B22' : '#EDFDF5',
              border: isDarkMode ? '#2E5B47' : '#C6FFDD',
            },
            {
              icon: Sparkles,
              title: 'Executive Spoken Briefing',
              desc: 'Start each morning with an artisanal neural audio digest of your day’s schedule and focus rituals.',
              accent: '#FF8772',
              bg: isDarkMode ? '#362220' : '#FFF2F0',
              border: isDarkMode ? '#6B3E3A' : '#FFD9D4',
            },
          ].map((perk, idx) => {
            const IconComp = perk.icon;
            return (
              <View
                key={idx}
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
                    {
                      backgroundColor: perk.bg,
                      borderColor: perk.border,
                    },
                  ]}
                >
                  <IconComp size={20} color={perk.accent} strokeWidth={2.4} />
                </View>
                <View style={styles.perkInfo}>
                  <Text style={[styles.perkTitle, { color: textPrimary }]}>
                    {perk.title}
                  </Text>
                  <Text style={[styles.perkDesc, { color: textSecondary }]}>
                    {perk.desc}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>

        {/* Sculpted Plan Selector */}
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

        {/* Social Proof & Testimonial Card */}
        <View
          style={[
            styles.trustCard,
            {
              backgroundColor: cardBg,
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

      {/* Sticky Dawn Bottom Action Dock */}
      <View
        style={[
          styles.bottomActionContainer,
          {
            paddingBottom: Math.max(insets.bottom, 16),
            backgroundColor: isDarkMode
              ? 'rgba(18, 20, 23, 0.94)'
              : 'rgba(255, 252, 227, 0.95)',
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

export default SubscriptionScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontFamily: Fonts.ranade.bold,
    fontSize: 18,
    letterSpacing: -0.3,
  },
  headerTitleScrolled: {
    color: Colors.DefaultWhite,
  },
  restoreBtn: {
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  restoreBtnText: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: 13,
    color: '#D4AF37',
  },
  restoreBtnTextScrolled: {
    color: Colors.DefaultWhite,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
  },
  heroOuterWrapper: {
    marginBottom: 24,
  },
  cardShadowWrapper: {
    borderRadius: 24,
    backgroundColor: Colors.NeroBlack,
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.32,
        shadowRadius: 20,
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
    padding: 20,
  },
  heroGlowCircle: {
    position: 'absolute',
    top: -50,
    right: -50,
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(245, 197, 24, 0.15)',
  },
  heroCardContent: {
    position: 'relative',
    zIndex: 1,
  },
  heroTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  crownIconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(245, 197, 24, 0.18)',
    borderWidth: 1.5,
    borderColor: 'rgba(245, 197, 24, 0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroBadgeGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  heroTitle: {
    fontFamily: Fonts.ranade.bold,
    fontSize: 22,
    color: '#FFFFFF',
    letterSpacing: -0.5,
    lineHeight: 28,
    marginBottom: 8,
  },
  heroDesc: {
    fontFamily: Fonts.poppins.regular,
    fontSize: 12.5,
    color: '#D1D5DB',
    lineHeight: 18,
    marginBottom: 18,
  },
  heroPillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  heroPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
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
    marginBottom: 12,
    marginLeft: 2,
  },
  sectionTitle: {
    fontFamily: Fonts.ranade.bold,
    fontSize: 18,
    letterSpacing: -0.3,
  },
  perksContainer: {
    gap: 10,
    marginBottom: 24,
  },
  perkCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderRadius: 18,
    borderWidth: 1.5,
    padding: 14,
    gap: 12,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 5,
    elevation: 2,
  },
  perkIconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  perkInfo: {
    flex: 1,
  },
  perkTitle: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: 14,
    marginBottom: 3,
  },
  perkDesc: {
    fontFamily: Fonts.poppins.regular,
    fontSize: 11.5,
    lineHeight: 16,
  },
  plansContainer: {
    gap: 12,
    marginBottom: 20,
  },
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
  trustCard: {
    borderRadius: 18,
    borderWidth: 1.5,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 5,
    elevation: 2,
  },
  starsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 8,
  },
  ratingText: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: 12,
    marginLeft: 6,
  },
  guaranteeDesc: {
    fontFamily: Fonts.poppins.regular,
    fontSize: 12,
    lineHeight: 18,
    fontStyle: 'italic',
    marginBottom: 6,
  },
  guaranteeAuthor: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: 11.5,
  },
  cancelSubBtn: {
    alignSelf: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  cancelSubBtnText: {
    fontFamily: Fonts.poppins.medium,
    fontSize: 12,
    color: '#EF4444',
  },
  bottomActionContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 1,
    paddingTop: 12,
    paddingHorizontal: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 10,
    zIndex: 20,
  },
  ctaButton: {
    backgroundColor: '#F5C518',
    borderRadius: 28,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#F5C518',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 8,
  },
  ctaButtonActive: {
    backgroundColor: '#34D399',
    shadowColor: '#34D399',
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
    letterSpacing: 0.2,
  },
  legalMicrocopy: {
    fontFamily: Fonts.poppins.regular,
    fontSize: 10.5,
    textAlign: 'center',
  },
});
