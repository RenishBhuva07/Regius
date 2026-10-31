import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Vibration,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Crown, Sparkles, CheckCircle2 } from 'lucide-react-native';
import Toast from 'react-native-toast-message';

import { Fonts } from '../../Theme/fonts';
import { Colors } from '../../Assets/StyleUtilities/Colors';
import {
  SubScreenHeader,
  SUB_SCREEN_HEADER_HEIGHT,
} from '../../Common/SubScreenHeader';
import { useScrollReactiveHeader } from '../../Common/useScrollReactiveHeader';
import { ProBadge } from '../../Common/ProBadge';
import { StickyActionDock } from '../../Common/StickyActionDock';
import { useTheme } from '../../Theme/ThemeContext';
import { usePremium, SubscriptionPlanId } from '../../Context/PremiumContext';
import { SettingsBackgroundSvg } from '../Settings/Components/SettingsBackgroundSvg';
import {
  RoyalHeroCard,
  RoyalPerksGrid,
  SubscriptionPlanItem,
  SocialProofCard,
} from './Components';

const HEADER_HEIGHT = SUB_SCREEN_HEADER_HEIGHT;

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
  } = usePremium();

  const [selectedPlanId, setSelectedPlanId] =
    useState<SubscriptionPlanId>('annual');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);

  // Scroll tracking for reactive header layer
  const { scrollY, isScrolled, handleScroll } = useScrollReactiveHeader();

  const bgMain = isDarkMode ? '#121417' : Colors.CreamBackground;
  const textPrimary = isDarkMode ? '#FFFFFF' : '#111111';
  const textSecondary = isDarkMode ? '#A3A8B1' : '#666665';

  const selectedPlan = plans.find(p => p.id === selectedPlanId) || plans[0];

  const handleSelectPlan = useCallback((planId: SubscriptionPlanId) => {
    Vibration.vibrate(20);
    setSelectedPlanId(planId);
  }, []);

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
        {/* Imperial Monarch Hero Bento Card */}
        <RoyalHeroCard isPremium={isPremium} currentPlan={currentPlan} />

        {/* Perks Bento Matrix */}
        <RoyalPerksGrid isDarkMode={isDarkMode} />

        {/* Sculpted Plan Selector */}
        <View style={styles.sectionHeaderRow}>
          <Sparkles size={18} color="#F5C518" strokeWidth={2.4} />
          <Text style={[styles.sectionTitle, { color: textPrimary }]}>
            Choose Your Plan
          </Text>
        </View>

        <View style={styles.plansContainer}>
          {plans.map(plan => (
            <SubscriptionPlanItem
              key={plan.id}
              plan={plan}
              isSelected={selectedPlanId === plan.id}
              isDarkMode={isDarkMode}
              onSelect={handleSelectPlan}
            />
          ))}
        </View>

        {/* Social Proof & Testimonial Card */}
        <SocialProofCard isDarkMode={isDarkMode} />

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

      {/* Sticky Bottom Action Dock */}
      <StickyActionDock>
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
      </StickyActionDock>
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
  plansContainer: {
    gap: 12,
    marginBottom: 20,
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
