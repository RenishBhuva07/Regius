import React from 'react';
import ReactTestRenderer, { act } from 'react-test-renderer';
import { Vibration } from 'react-native';

const mockStorage: Record<string, string> = {};

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn((key: string) => Promise.resolve(mockStorage[key] || null)),
  setItem: jest.fn((key: string, value: string) => {
    mockStorage[key] = value;
    return Promise.resolve(null);
  }),
  removeItem: jest.fn((key: string) => {
    delete mockStorage[key];
    return Promise.resolve(null);
  }),
  clear: jest.fn(() => {
    Object.keys(mockStorage).forEach(k => delete mockStorage[k]);
    return Promise.resolve(null);
  }),
}));

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    canGoBack: () => true,
    goBack: jest.fn(),
    navigate: jest.fn(),
  }),
}));

jest.mock('react-native-toast-message', () => ({
  show: jest.fn(),
}));

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 47, bottom: 34, left: 0, right: 0 }),
}));

import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  PremiumProvider,
  usePremium,
  SUBSCRIPTION_PLANS,
} from '../src/Context/PremiumContext';
import { SubscriptionSection } from '../src/Screens/Settings/Components/SubscriptionSection';
import { SubscriptionScreen } from '../src/Screens/Subscription/SubscriptionScreen';

describe('Subscription & Royal Membership Flow Suite', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    jest.spyOn(Vibration, 'vibrate').mockImplementation(jest.fn());
    await AsyncStorage.clear();
  });

  describe('PremiumContext & Plans Model', () => {
    it('contains all 3 tier plans with correct trials and pricing', () => {
      expect(SUBSCRIPTION_PLANS).toHaveLength(3);

      const annual = SUBSCRIPTION_PLANS.find(p => p.id === 'annual');
      const monthly = SUBSCRIPTION_PLANS.find(p => p.id === 'monthly');
      const lifetime = SUBSCRIPTION_PLANS.find(p => p.id === 'lifetime');

      expect(annual).toBeDefined();
      expect(annual?.price).toBe('$59.99');
      expect(annual?.trialDays).toBe(14);
      expect(annual?.popular).toBe(true);

      expect(monthly).toBeDefined();
      expect(monthly?.price).toBe('$9.99');
      expect(monthly?.trialDays).toBe(7);

      expect(lifetime).toBeDefined();
      expect(lifetime?.price).toBe('$149.99');
      expect(lifetime?.trialDays).toBe(0);
    });

    it('manages plan purchasing and AsyncStorage persistence', async () => {
      let contextVal: ReturnType<typeof usePremium> | null = null;

      const Consumer = () => {
        contextVal = usePremium();
        return null;
      };

      await act(async () => {
        ReactTestRenderer.create(
          <PremiumProvider>
            <Consumer />
          </PremiumProvider>,
        );
      });

      expect(contextVal).not.toBeNull();
      expect((contextVal as any).isPremium).toBe(false);

      // Purchase Annual Plan
      await act(async () => {
        await (contextVal as any).purchasePlan('annual');
      });

      expect((contextVal as any).isPremium).toBe(true);
      expect((contextVal as any).currentPlan).toBe('annual');
      expect((contextVal as any).isTrialActive).toBe(true);
      expect((contextVal as any).trialDaysRemaining).toBe(14);

      // Verify AsyncStorage
      const stored = await AsyncStorage.getItem('@regius_subscription_data');
      expect(stored).not.toBeNull();
      const parsed = JSON.parse(stored!);
      expect(parsed.isPremium).toBe(true);
      expect(parsed.currentPlan).toBe('annual');

      // Cancel / Reset subscription
      await act(async () => {
        await (contextVal as any).cancelSubscription();
      });

      expect((contextVal as any).isPremium).toBe(false);
      expect((contextVal as any).currentPlan).toBeNull();
    });

    it('restores previous purchases cleanly', async () => {
      await AsyncStorage.setItem(
        '@regius_subscription_data',
        JSON.stringify({
          isPremium: true,
          currentPlan: 'lifetime',
          subscribedAt: new Date().toISOString(),
          expiresAt: null,
          isTrialActive: false,
          trialDaysRemaining: 0,
        }),
      );

      let contextVal: ReturnType<typeof usePremium> | null = null;
      const Consumer = () => {
        contextVal = usePremium();
        return null;
      };

      await act(async () => {
        ReactTestRenderer.create(
          <PremiumProvider>
            <Consumer />
          </PremiumProvider>,
        );
      });

      expect(contextVal).not.toBeNull();
      expect((contextVal as any).isPremium).toBe(true);
      expect((contextVal as any).currentPlan).toBe('lifetime');
    });
  });

  describe('Settings SubscriptionSection Component', () => {
    it('renders free tier upgrade prompt correctly', async () => {
      const onUpgradePress = jest.fn();
      let tree: any;

      await act(async () => {
        tree = ReactTestRenderer.create(
          <PremiumProvider>
            <SubscriptionSection onUpgradePress={onUpgradePress} />
          </PremiumProvider>,
        );
      });

      const jsonStr = JSON.stringify(tree.toJSON());
      expect(jsonStr).toContain('Membership & Subscription');
      expect(jsonStr).toContain('Regius Royal Membership');
      expect(jsonStr).toContain('Start 14-Day Free Trial');
    });

    it('renders active membership details when premium is active', async () => {
      const onUpgradePress = jest.fn();
      let contextVal: any = null;

      const Consumer = () => {
        contextVal = usePremium();
        return <SubscriptionSection onUpgradePress={onUpgradePress} />;
      };

      let tree: any;
      await act(async () => {
        tree = ReactTestRenderer.create(
          <PremiumProvider>
            <Consumer />
          </PremiumProvider>,
        );
      });

      await act(async () => {
        await contextVal.purchasePlan('annual');
      });

      const jsonStr = JSON.stringify(tree.toJSON());
      expect(jsonStr).toContain('Royal Annual Pass');
      expect(jsonStr).toContain('Manage Plan & Billing');
    });
  });

  describe('SubscriptionScreen Paywall Flow', () => {
    it('renders hero bento card, plans, and sticky CTA', async () => {
      let tree: any;

      await act(async () => {
        tree = ReactTestRenderer.create(
          <PremiumProvider>
            <SubscriptionScreen />
          </PremiumProvider>,
        );
      });

      const jsonStr = JSON.stringify(tree.toJSON());
      expect(jsonStr).toContain('Regius Royal');
      expect(jsonStr).toContain('Elevate Your Mindful Productivity');
      expect(jsonStr).toContain('Royal Annual');
      expect(jsonStr).toContain('Royal Monthly');
      expect(jsonStr).toContain('Monarch Lifetime');
      expect(jsonStr).toContain('Start 14-Day Free Trial');
    });
  });
});
