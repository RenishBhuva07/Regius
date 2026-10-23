import AsyncStorage from '@react-native-async-storage/async-storage';

export interface MilestoneTier {
  level: number;
  title: string;
  subtitle: string;
  minXp: number;
  maxXp: number; // -1 for max level
  badgeVariant: 'neutral' | 'yellow' | 'green' | 'purple' | 'orange';
  accentColor: string;
  unlockedThemes: { id: string; name: string; hex: string; desc: string }[];
  unlockedFeatures: { id: string; name: string; desc: string }[];
}

export const MILESTONE_TIERS: MilestoneTier[] = [
  {
    level: 1,
    title: 'Novice Initiate',
    subtitle: 'Beginning your journey to royal focus',
    minXp: 0,
    maxXp: 100,
    badgeVariant: 'neutral',
    accentColor: '#8E95A5',
    unlockedThemes: [
      {
        id: 'classic_light',
        name: 'Warm Cream',
        hex: '#FFFCE3',
        desc: 'Default warm cream canvas',
      },
      {
        id: 'classic_dark',
        name: 'Obsidian Night',
        hex: '#121417',
        desc: 'Signature obsidian dark mode',
      },
    ],
    unlockedFeatures: [
      {
        id: 'core_tasks',
        name: 'Daily Task Scheduling',
        desc: 'Standard task and reminder management',
      },
      {
        id: 'standard_voice',
        name: 'Kokoro Neural Voice',
        desc: 'Standard speech playback at 1.0x speed',
      },
    ],
  },
  {
    level: 2,
    title: 'Focused Vanguard',
    subtitle: 'Consistent execution and daily momentum',
    minXp: 100,
    maxXp: 300,
    badgeVariant: 'yellow',
    accentColor: '#F5C518',
    unlockedThemes: [
      {
        id: 'champagne_gold',
        name: 'Champagne Gold',
        hex: '#D4AF37',
        desc: 'Radiant champagne accents with warm bronze tint',
      },
    ],
    unlockedFeatures: [
      {
        id: 'custom_haptics',
        name: 'Haptic Intensity Curves',
        desc: 'Fine-tune subtle, medium, or crisp tactile feedback',
      },
      {
        id: 'wakeword_presets',
        name: 'Quick Wake Word Presets',
        desc: 'Switch between luxury wake phrases instantly',
      },
    ],
  },
  {
    level: 3,
    title: 'Habitual Artisan',
    subtitle: 'Disciplined habit builder and routine master',
    minXp: 300,
    maxXp: 600,
    badgeVariant: 'green',
    accentColor: '#2ECC71',
    unlockedThemes: [
      {
        id: 'emerald_velvet',
        name: 'Emerald Velvet',
        hex: '#1E392A',
        desc: 'Deep imperial emerald tones with mint luster',
      },
    ],
    unlockedFeatures: [
      {
        id: 'priority_tts',
        name: 'Priority Neural Voice',
        desc: 'Ultra-fast Kokoro-82M neural voice synthesis',
      },
      {
        id: 'cache_flush_tools',
        name: 'Smart Storage Flush',
        desc: 'Automated audio cache optimization',
      },
    ],
  },
  {
    level: 4,
    title: 'Productive Master',
    subtitle: 'Elite productivity with automated workflows',
    minXp: 600,
    maxXp: 1000,
    badgeVariant: 'purple',
    accentColor: '#8383D6',
    unlockedThemes: [
      {
        id: 'celestial_azure',
        name: 'Celestial Azure',
        hex: '#1A233A',
        desc: 'Royal sapphire navy with celestial lavender highlights',
      },
    ],
    unlockedFeatures: [
      {
        id: 'wakeword_studio',
        name: 'Custom Wake Word Studio',
        desc: 'Configure custom voice models and acoustic thresholds',
      },
      {
        id: 'smart_categorization',
        name: 'Smart AI Categorization',
        desc: 'Automatic tag classification for tasks and reminders',
      },
    ],
  },
  {
    level: 5,
    title: 'Regius Sovereign',
    subtitle: 'Supreme mastery of time and execution',
    minXp: 1000,
    maxXp: -1, // Supreme level cap
    badgeVariant: 'orange',
    accentColor: '#FF9800',
    unlockedThemes: [
      {
        id: 'obsidian_gold',
        name: 'Obsidian Sovereign',
        hex: '#0A0A0C',
        desc: 'High-gloss jet black accented with pure 24K gold',
      },
    ],
    unlockedFeatures: [
      {
        id: 'all_pro_unlocked',
        name: 'All Pro Features Unlocked',
        desc: 'Permanent lifetime access to all future Pro features',
      },
      {
        id: 'crown_badge',
        name: 'Imperial Crown Profile Accent',
        desc: 'Exclusive sovereign badge on your profile and dashboard',
      },
    ],
  },
];

export const XP_RULES = {
  TASK_COMPLETION: 15,
  REMINDER_COMPLETION: 10,
  HABIT_CHECKIN: 20,
  HABIT_STREAK_BONUS_PER_DAY: 2,
};

export const MILESTONE_STORAGE_KEY = '@regius_milestone_progression';

export interface MilestoneProgressData {
  historicalTasksCompleted: number;
  historicalRemindersCompleted: number;
  historicalHabitsCompleted: number;
  bonusXp: number;
}

export const DEFAULT_PROGRESS_DATA: MilestoneProgressData = {
  historicalTasksCompleted: 0,
  historicalRemindersCompleted: 0,
  historicalHabitsCompleted: 0,
  bonusXp: 0,
};

export class MilestoneService {
  static getTierByXp(xp: number): MilestoneTier {
    for (let i = MILESTONE_TIERS.length - 1; i >= 0; i--) {
      if (xp >= MILESTONE_TIERS[i].minXp) {
        return MILESTONE_TIERS[i];
      }
    }
    return MILESTONE_TIERS[0];
  }

  static getNextTier(currentLevel: number): MilestoneTier | null {
    const next = MILESTONE_TIERS.find(t => t.level === currentLevel + 1);
    return next || null;
  }

  static calculateTierProgress(
    xp: number,
    tier: MilestoneTier,
  ): { progress: number; currentInTier: number; requiredForTier: number } {
    if (tier.maxXp === -1) {
      return {
        progress: 1.0,
        currentInTier: xp - tier.minXp,
        requiredForTier: 0,
      };
    }
    const requiredForTier = tier.maxXp - tier.minXp;
    const currentInTier = Math.max(0, xp - tier.minXp);
    const progress = Math.min(
      1.0,
      Math.max(0.0, currentInTier / requiredForTier),
    );
    return { progress, currentInTier, requiredForTier };
  }

  static async loadProgressData(): Promise<MilestoneProgressData> {
    try {
      const json = await AsyncStorage.getItem(MILESTONE_STORAGE_KEY);
      if (json) {
        return { ...DEFAULT_PROGRESS_DATA, ...JSON.parse(json) };
      }
    } catch {
      // Fallback to default
    }
    return DEFAULT_PROGRESS_DATA;
  }

  static async saveProgressData(data: MilestoneProgressData): Promise<void> {
    try {
      await AsyncStorage.setItem(MILESTONE_STORAGE_KEY, JSON.stringify(data));
    } catch {
      // Silently ignore storage errors
    }
  }

  static isThemeUnlocked(
    themeId: string,
    currentLevel: number,
    isPremium: boolean,
  ): boolean {
    if (isPremium) return true;
    for (const tier of MILESTONE_TIERS) {
      if (tier.unlockedThemes.some(t => t.id === themeId)) {
        return currentLevel >= tier.level;
      }
    }
    return true; // default themes
  }

  static isFeatureUnlocked(
    featureId: string,
    currentLevel: number,
    isPremium: boolean,
  ): boolean {
    if (isPremium) return true;
    for (const tier of MILESTONE_TIERS) {
      if (tier.unlockedFeatures.some(f => f.id === featureId)) {
        return currentLevel >= tier.level;
      }
    }
    return true;
  }
}
