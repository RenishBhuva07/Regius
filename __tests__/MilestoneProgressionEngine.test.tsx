import React from 'react';
import ReactTestRenderer, { act } from 'react-test-renderer';

jest.mock('react-native-toast-message', () => ({
  show: jest.fn(),
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn().mockResolvedValue(null),
  setItem: jest.fn().mockResolvedValue(null),
}));

jest.mock('react-native-safe-area-context', () => {
  const actual = jest.requireActual('react-native-safe-area-context');
  return {
    ...actual,
    useSafeAreaInsets: () => ({ top: 47, bottom: 34, left: 0, right: 0 }),
  };
});

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    goBack: jest.fn(),
    navigate: jest.fn(),
  }),
}));

import {
  MilestoneService,
  MILESTONE_TIERS,
} from '../src/Services/Milestone/MilestoneService';
import { MilestoneSection } from '../src/Screens/Settings/Components/MilestoneSection';
import { MilestoneJourneyModal } from '../src/Screens/Settings/Components/MilestoneJourneyModal';
import { MilestoneFullScreenSheet } from '../src/Screens/Milestones';

describe('Milestone Progression & Pro Unlocking Engine', () => {
  describe('Mathematical Tier Calculations', () => {
    it('accurately resolves Tier 1 for low XP', () => {
      const tier = MilestoneService.getTierByXp(45);
      expect(tier.level).toBe(1);
      expect(tier.title).toBe('Novice Initiate');
    });

    it('accurately resolves Tier 2 (Focused Vanguard) at 100 XP', () => {
      const tier = MilestoneService.getTierByXp(120);
      expect(tier.level).toBe(2);
      expect(tier.title).toBe('Focused Vanguard');
    });

    it('accurately resolves Tier 3 (Habitual Artisan) at 300 XP', () => {
      const tier = MilestoneService.getTierByXp(350);
      expect(tier.level).toBe(3);
      expect(tier.title).toBe('Habitual Artisan');
    });

    it('accurately resolves Tier 4 (Productive Master) at 600 XP', () => {
      const tier = MilestoneService.getTierByXp(750);
      expect(tier.level).toBe(4);
      expect(tier.title).toBe('Productive Master');
    });

    it('accurately resolves Tier 5 (Regius Sovereign) at 1000+ XP', () => {
      const tier = MilestoneService.getTierByXp(1500);
      expect(tier.level).toBe(5);
      expect(tier.title).toBe('Regius Sovereign');
    });

    it('computes tier progress ratio properly', () => {
      const tier2 = MILESTONE_TIERS[1]; // min: 100, max: 300 (diff: 200)
      const { progress, currentInTier, requiredForTier } =
        MilestoneService.calculateTierProgress(200, tier2);

      expect(currentInTier).toBe(100);
      expect(requiredForTier).toBe(200);
      expect(progress).toBeCloseTo(0.5);
    });
  });

  describe('Theme & Feature Entitlement Checks', () => {
    it('locks Champagne Gold for Tier 1 non-pro users, unlocks at Tier 2', () => {
      expect(MilestoneService.isThemeUnlocked('champagne_gold', 1, false)).toBe(
        false,
      );
      expect(MilestoneService.isThemeUnlocked('champagne_gold', 2, false)).toBe(
        true,
      );
    });

    it('locks Emerald Velvet for Tier 2 non-pro users, unlocks at Tier 3', () => {
      expect(MilestoneService.isThemeUnlocked('emerald_velvet', 2, false)).toBe(
        false,
      );
      expect(MilestoneService.isThemeUnlocked('emerald_velvet', 3, false)).toBe(
        true,
      );
    });

    it('unlocks all luxury themes when isPremium is true regardless of level', () => {
      expect(MilestoneService.isThemeUnlocked('obsidian_gold', 1, true)).toBe(
        true,
      );
      expect(
        MilestoneService.isFeatureUnlocked('wakeword_studio', 1, true),
      ).toBe(true);
    });
  });

  describe('UI Component Rendering', () => {
    it('renders MilestoneSection without crashing', () => {
      const onOpenMock = jest.fn();
      const currentTier = MILESTONE_TIERS[1];
      const nextTier = MILESTONE_TIERS[2];

      let tree: any;
      act(() => {
        tree = ReactTestRenderer.create(
          <MilestoneSection
            currentTier={currentTier}
            nextTier={nextTier}
            totalXp={180}
            tierProgress={0.4}
            currentInTier={80}
            requiredForTier={200}
            onOpenMilestoneJourney={onOpenMock}
          />,
        );
      });

      const jsonStr = JSON.stringify(tree.toJSON());
      expect(jsonStr).toContain('Milestones & Pro Unlocks');
      expect(jsonStr).toContain('Focused Vanguard');
      expect(jsonStr).toContain('180 XP');
    });

    it('renders MilestoneJourneyModal as bottom sheet without crashing', () => {
      const onCloseMock = jest.fn();
      const currentTier = MILESTONE_TIERS[1];
      const nextTier = MILESTONE_TIERS[2];

      let tree: any;
      act(() => {
        tree = ReactTestRenderer.create(
          <MilestoneJourneyModal
            visible={true}
            onClose={onCloseMock}
            currentTier={currentTier}
            nextTier={nextTier}
            totalXp={180}
            tierProgress={0.4}
            currentInTier={80}
            requiredForTier={200}
            completedTasksCount={12}
            completedRemindersCount={4}
            habitsFollowedCount={6}
          />,
        );
      });

      const jsonStr = JSON.stringify(tree.toJSON());
      expect(jsonStr).toContain('Milestone Journey');
      expect(jsonStr).toContain('Prestige Tier Roadmap');
      expect(jsonStr).toContain('Novice Initiate');
    });

    it('renders MilestoneFullScreenSheet globally without crashing', () => {
      let tree: any;
      act(() => {
        tree = ReactTestRenderer.create(<MilestoneFullScreenSheet />);
      });

      expect(tree).toBeDefined();
    });
  });
});

