import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  useEffect,
  useCallback,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type SubscriptionPlanId = 'annual' | 'monthly' | 'lifetime';

export interface SubscriptionPlan {
  id: SubscriptionPlanId;
  name: string;
  badgeText?: string;
  price: string;
  period: string;
  billingText: string;
  monthlyEquivalent?: string;
  trialDays: number;
  savingsPercent?: number;
  popular?: boolean;
  features: string[];
}

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'annual',
    name: 'Royal Annual',
    badgeText: 'BEST VALUE • SAVE 50%',
    price: '$59.99',
    period: '/year',
    monthlyEquivalent: '$4.99/mo',
    billingText: '$59.99 billed annually after 14-day free trial',
    trialDays: 14,
    savingsPercent: 50,
    popular: true,
    features: [
      '14-Day Risk-Free Trial',
      'All 8 Luxury Themes Unlocked',
      'Unlimited Neural Voice Generations',
      'Custom Wake Word Training',
      '2x Milestone XP Accelerator',
      'End-to-End Encrypted Cloud Sync',
    ],
  },
  {
    id: 'monthly',
    name: 'Royal Monthly',
    badgeText: 'FLEXIBLE',
    price: '$9.99',
    period: '/month',
    billingText: '$9.99 billed monthly after 7-day free trial',
    trialDays: 7,
    features: [
      '7-Day Risk-Free Trial',
      'All 8 Luxury Themes Unlocked',
      'Unlimited Neural Voice Generations',
      'Custom Wake Word Training',
      '2x Milestone XP Accelerator',
      'Cancel anytime with 1 tap',
    ],
  },
  {
    id: 'lifetime',
    name: 'Monarch Lifetime',
    badgeText: 'ONE-TIME PAYMENT',
    price: '$149.99',
    period: 'one-time',
    billingText: 'Pay once, enjoy Regius Royal forever',
    trialDays: 0,
    features: [
      'Lifetime Access to All Future Features',
      'All 8 Luxury Themes Unlocked',
      'Unlimited Neural Voice Generations',
      'Custom Wake Word Studio',
      'Priority Executive Support',
      'Zero Recurring Fees Forever',
    ],
  },
];

export interface PremiumContextType {
  isPremium: boolean;
  currentPlan: SubscriptionPlanId | null;
  subscribedAt: string | null;
  expiresAt: string | null;
  isTrialActive: boolean;
  trialDaysRemaining: number;
  plans: SubscriptionPlan[];
  purchasePlan: (planId: SubscriptionPlanId) => Promise<boolean>;
  restorePurchases: () => Promise<boolean>;
  cancelSubscription: () => Promise<void>;
  completePayment: () => void;
}

const STORAGE_KEY = '@regius_subscription_data';

const PremiumContext = createContext<PremiumContextType>({
  isPremium: false,
  currentPlan: null,
  subscribedAt: null,
  expiresAt: null,
  isTrialActive: false,
  trialDaysRemaining: 0,
  plans: SUBSCRIPTION_PLANS,
  purchasePlan: async () => false,
  restorePurchases: async () => false,
  cancelSubscription: async () => {},
  completePayment: () => {},
});

export const PremiumProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isPremium, setIsPremium] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<SubscriptionPlanId | null>(
    null,
  );
  const [subscribedAt, setSubscribedAt] = useState<string | null>(null);
  const [expiresAt, setExpiresAt] = useState<string | null>(null);
  const [isTrialActive, setIsTrialActive] = useState(false);
  const [trialDaysRemaining, setTrialDaysRemaining] = useState(0);

  // Rehydrate subscription state from storage on app load
  useEffect(() => {
    const hydrateSubscription = async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed.isPremium) {
            setIsPremium(true);
            setCurrentPlan(parsed.currentPlan || 'annual');
            setSubscribedAt(parsed.subscribedAt || new Date().toISOString());
            setExpiresAt(parsed.expiresAt || null);
            setIsTrialActive(Boolean(parsed.isTrialActive));
            setTrialDaysRemaining(parsed.trialDaysRemaining || 0);
          }
        }
      } catch {
        // Storage failure fallback to defaults
      }
    };

    hydrateSubscription();
  }, []);

  const persistState = useCallback(
    async (
      premium: boolean,
      plan: SubscriptionPlanId | null,
      subDate: string | null,
      expDate: string | null,
      trial: boolean,
      trialDays: number,
    ) => {
      try {
        await AsyncStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({
            isPremium: premium,
            currentPlan: plan,
            subscribedAt: subDate,
            expiresAt: expDate,
            isTrialActive: trial,
            trialDaysRemaining: trialDays,
          }),
        );
      } catch {
        // Non-blocking
      }
    },
    [],
  );

  const purchasePlan = useCallback(
    async (planId: SubscriptionPlanId): Promise<boolean> => {
      const now = new Date();
      const plan = SUBSCRIPTION_PLANS.find(p => p.id === planId);
      const trialDays = plan?.trialDays || 0;
      const trialActive = trialDays > 0;

      let expDate: Date | null = null;
      if (planId === 'annual') {
        expDate = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000);
      } else if (planId === 'monthly') {
        expDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
      }

      const subDateStr = now.toISOString();
      const expDateStr = expDate ? expDate.toISOString() : null;

      setIsPremium(true);
      setCurrentPlan(planId);
      setSubscribedAt(subDateStr);
      setExpiresAt(expDateStr);
      setIsTrialActive(trialActive);
      setTrialDaysRemaining(trialDays);

      await persistState(
        true,
        planId,
        subDateStr,
        expDateStr,
        trialActive,
        trialDays,
      );

      return true;
    },
    [persistState],
  );

  const restorePurchases = useCallback(async (): Promise<boolean> => {
    // Check storage or mock receipt validation
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.isPremium) {
          setIsPremium(true);
          setCurrentPlan(parsed.currentPlan || 'annual');
          setSubscribedAt(parsed.subscribedAt);
          setExpiresAt(parsed.expiresAt);
          setIsTrialActive(Boolean(parsed.isTrialActive));
          setTrialDaysRemaining(parsed.trialDaysRemaining || 0);
          return true;
        }
      }
    } catch {
      // Ignore
    }
    return false;
  }, []);

  const cancelSubscription = useCallback(async () => {
    setIsPremium(false);
    setCurrentPlan(null);
    setSubscribedAt(null);
    setExpiresAt(null);
    setIsTrialActive(false);
    setTrialDaysRemaining(0);
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore
    }
  }, []);

  const completePayment = useCallback(() => {
    purchasePlan('annual');
  }, [purchasePlan]);

  const value = useMemo(
    () => ({
      isPremium,
      currentPlan,
      subscribedAt,
      expiresAt,
      isTrialActive,
      trialDaysRemaining,
      plans: SUBSCRIPTION_PLANS,
      purchasePlan,
      restorePurchases,
      cancelSubscription,
      completePayment,
    }),
    [
      isPremium,
      currentPlan,
      subscribedAt,
      expiresAt,
      isTrialActive,
      trialDaysRemaining,
      purchasePlan,
      restorePurchases,
      cancelSubscription,
      completePayment,
    ],
  );

  return (
    <PremiumContext.Provider value={value}>{children}</PremiumContext.Provider>
  );
};

export const usePremium = () => useContext(PremiumContext);
