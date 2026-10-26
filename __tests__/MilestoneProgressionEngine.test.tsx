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
import {
  MilestoneFullScreenSheet,
  ThreeDStatusBadge,
  GameRoadCheckpoint,
  ZigzagGameRoad,
  MilestoneLevelDetailModal,
} from '../src/Screens/Milestones';

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

    it('renders MilestoneFullScreenSheet globally without crashing', () => {
      let tree: any;
      act(() => {
        tree = ReactTestRenderer.create(<MilestoneFullScreenSheet />);
      });

      expect(tree).toBeDefined();
    });

    it('renders 3D status badge with 3D unlocked right sign', () => {
      let unlockedTree: any;
      act(() => {
        unlockedTree = ReactTestRenderer.create(
          <ThreeDStatusBadge state="unlocked" />,
        );
      });
      const unlockedJson = JSON.stringify(unlockedTree.toJSON());
      expect(unlockedJson).toContain('UNLOCKED');

      let currentTree: any;
      act(() => {
        currentTree = ReactTestRenderer.create(
          <ThreeDStatusBadge state="current" />,
        );
      });
      const currentJson = JSON.stringify(currentTree.toJSON());
      expect(currentJson).toContain('CURRENT');

      let lockedTree: any;
      act(() => {
        lockedTree = ReactTestRenderer.create(
          <ThreeDStatusBadge state="locked" requiredXp={300} />,
        );
      });
      const lockedJson = JSON.stringify(lockedTree.toJSON());
      expect(lockedJson).toContain('LOCKED');
    });

    it('renders ZigzagGameRoad with 5 game level checkpoints', () => {
      let tree: any;
      const onSelectMock = jest.fn();
      act(() => {
        tree = ReactTestRenderer.create(
          <ZigzagGameRoad
            tiers={MILESTONE_TIERS}
            currentTier={MILESTONE_TIERS[1]}
            nextTier={MILESTONE_TIERS[2]}
            totalXp={141}
            onSelectTier={onSelectMock}
            isDarkMode={false}
          />,
        );
      });
      expect(tree).toBeDefined();
      const json = JSON.stringify(tree.toJSON());
      expect(json).toContain('Novice Initiate');
      expect(json).toContain('Focused Vanguard');
      expect(json).toContain('Habitual Artisan');
      expect(json).toContain('Productive Master');
      expect(json).toContain('Regius Sovereign');
    });

    it('renders MilestoneLevelDetailModal with themes and perks', () => {
      let tree: any;
      const onCloseMock = jest.fn();
      const onApplyMock = jest.fn();
      act(() => {
        tree = ReactTestRenderer.create(
          <MilestoneLevelDetailModal
            tier={MILESTONE_TIERS[1]}
            visible={true}
            onClose={onCloseMock}
            totalXp={141}
            currentTierLevel={2}
            nextTier={MILESTONE_TIERS[2]}
            tierProgress={0.2}
            currentInTier={41}
            requiredForTier={200}
            activeThemeId="champagne_gold"
            onApplyTheme={onApplyMock}
            isDarkMode={false}
          />,
        );
      });
      expect(tree).toBeDefined();
      const json = JSON.stringify(tree.toJSON());
      expect(json).toContain('Focused Vanguard');
      expect(json).toContain('Luxury Bespoke Themes');
      expect(json).toContain('Champagne Gold');
      expect(json).toContain('Haptic Intensity Curves');
    });
  });
});
