import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
  ReactNode,
} from 'react';
import {
  MilestoneTier,
  MILESTONE_TIERS,
  MilestoneService,
  XP_RULES,
  MilestoneProgressData,
  DEFAULT_PROGRESS_DATA,
} from '../Services/Milestone/MilestoneService';
import { useTaskReminder } from './TaskReminderContext';
import { usePremium } from './PremiumContext';

interface MilestoneContextType {
  totalXp: number;
  currentTier: MilestoneTier;
  nextTier: MilestoneTier | null;
  tierProgress: number; // 0.0 to 1.0
  currentInTier: number;
  requiredForTier: number;
  completedTasksCount: number;
  completedRemindersCount: number;
  habitsFollowedCount: number;
  isThemeUnlocked: (themeId: string) => boolean;
  isFeatureUnlocked: (featureId: string) => boolean;
  recordTaskAction: () => void;
  recordReminderAction: () => void;
  recordHabitAction: (streakBonus?: number) => void;
  isMilestoneModalVisible: boolean;
  openMilestoneModal: () => void;
  closeMilestoneModal: () => void;
  openMilestones: () => void;
  closeMilestones: () => void;
  allTiers: MilestoneTier[];
}

const MilestoneContext = createContext<MilestoneContextType>({
  totalXp: 0,
  currentTier: MILESTONE_TIERS[0],
  nextTier: MILESTONE_TIERS[1],
  tierProgress: 0,
  currentInTier: 0,
  requiredForTier: 100,
  completedTasksCount: 0,
  completedRemindersCount: 0,
  habitsFollowedCount: 0,
  isThemeUnlocked: () => true,
  isFeatureUnlocked: () => true,
  recordTaskAction: () => {},
  recordReminderAction: () => {},
  recordHabitAction: () => {},
  isMilestoneModalVisible: false,
  openMilestoneModal: () => {},
  closeMilestoneModal: () => {},
  openMilestones: () => {},
  closeMilestones: () => {},
  allTiers: MILESTONE_TIERS,
});

export const MilestoneProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { tasks, reminders, habits } = useTaskReminder();
  const { isPremium } = usePremium();

  const [persistentData, setPersistentData] = useState<MilestoneProgressData>(
    DEFAULT_PROGRESS_DATA,
  );
  const [isMilestoneModalVisible, setIsMilestoneModalVisible] = useState(false);

  // Load persisted progress on mount
  useEffect(() => {
    MilestoneService.loadProgressData().then(data => {
      setPersistentData(data);
    });
  }, []);

  // Calculate live counts
  const liveTasksDone = useMemo(
    () => tasks.filter(t => t.done).length,
    [tasks],
  );
  const liveRemindersDone = useMemo(
    () => reminders.filter(r => r.done).length,
    [reminders],
  );
  const liveHabitsDone = useMemo(
    () => habits.filter(h => h.completed).length,
    [habits],
  );

  // Calculate total counts
  const completedTasksCount =
    liveTasksDone + persistentData.historicalTasksCompleted;
  const completedRemindersCount =
    liveRemindersDone + persistentData.historicalRemindersCompleted;
  const habitsFollowedCount =
    liveHabitsDone + persistentData.historicalHabitsCompleted;

  // Streak bonus from completed habits
  const habitStreakBonus = useMemo(() => {
    return habits
      .filter(h => h.completed)
      .reduce(
        (sum, h) =>
          sum +
          Math.min(
            h.streak * XP_RULES.HABIT_STREAK_BONUS_PER_DAY,
            40, // Cap streak bonus per habit
          ),
        0,
      );
  }, [habits]);

  // Compute total XP
  const totalXp = useMemo(() => {
    const taskXp = completedTasksCount * XP_RULES.TASK_COMPLETION;
    const reminderXp = completedRemindersCount * XP_RULES.REMINDER_COMPLETION;
    const habitXp = habitsFollowedCount * XP_RULES.HABIT_CHECKIN;
    return (
      taskXp + reminderXp + habitXp + habitStreakBonus + persistentData.bonusXp
    );
  }, [
    completedTasksCount,
    completedRemindersCount,
    habitsFollowedCount,
    habitStreakBonus,
    persistentData.bonusXp,
  ]);

  // Current tier & next tier
  const currentTier = useMemo(
    () => MilestoneService.getTierByXp(totalXp),
    [totalXp],
  );
  const nextTier = useMemo(
    () => MilestoneService.getNextTier(currentTier.level),
    [currentTier.level],
  );

  // Progress metrics within current tier
  const {
    progress: tierProgress,
    currentInTier,
    requiredForTier,
  } = useMemo(
    () => MilestoneService.calculateTierProgress(totalXp, currentTier),
    [totalXp, currentTier],
  );

  const isThemeUnlocked = useCallback(
    (themeId: string) => {
      return MilestoneService.isThemeUnlocked(
        themeId,
        currentTier.level,
        isPremium,
      );
    },
    [currentTier.level, isPremium],
  );

  const isFeatureUnlocked = useCallback(
    (featureId: string) => {
      return MilestoneService.isFeatureUnlocked(
        featureId,
        currentTier.level,
        isPremium,
      );
    },
    [currentTier.level, isPremium],
  );

  const recordTaskAction = useCallback(() => {
    setPersistentData(prev => {
      const next = {
        ...prev,
        historicalTasksCompleted: prev.historicalTasksCompleted + 1,
      };
      MilestoneService.saveProgressData(next);
      return next;
    });
  }, []);

  const recordReminderAction = useCallback(() => {
    setPersistentData(prev => {
      const next = {
        ...prev,
        historicalRemindersCompleted: prev.historicalRemindersCompleted + 1,
      };
      MilestoneService.saveProgressData(next);
      return next;
    });
  }, []);

  const recordHabitAction = useCallback((streakBonus = 0) => {
    setPersistentData(prev => {
      const next = {
        ...prev,
        historicalHabitsCompleted: prev.historicalHabitsCompleted + 1,
        bonusXp: prev.bonusXp + streakBonus,
      };
      MilestoneService.saveProgressData(next);
      return next;
    });
  }, []);

  const openMilestoneModal = useCallback(() => {
    setIsMilestoneModalVisible(true);
  }, []);

  const closeMilestoneModal = useCallback(() => {
    setIsMilestoneModalVisible(false);
  }, []);

  const value = useMemo(
    () => ({
      totalXp,
      currentTier,
      nextTier,
      tierProgress,
      currentInTier,
      requiredForTier,
      completedTasksCount,
      completedRemindersCount,
      habitsFollowedCount,
      isThemeUnlocked,
      isFeatureUnlocked,
      recordTaskAction,
      recordReminderAction,
      recordHabitAction,
      isMilestoneModalVisible,
      openMilestoneModal,
      closeMilestoneModal,
      openMilestones: openMilestoneModal,
      closeMilestones: closeMilestoneModal,
      allTiers: MILESTONE_TIERS,
    }),
    [
      totalXp,
      currentTier,
      nextTier,
      tierProgress,
      currentInTier,
      requiredForTier,
      completedTasksCount,
      completedRemindersCount,
      habitsFollowedCount,
      isThemeUnlocked,
      isFeatureUnlocked,
      recordTaskAction,
      recordReminderAction,
      recordHabitAction,
      isMilestoneModalVisible,
      openMilestoneModal,
      closeMilestoneModal,
    ],
  );

  return (
    <MilestoneContext.Provider value={value}>
      {children}
    </MilestoneContext.Provider>
  );
};

export const useMilestones = () => useContext(MilestoneContext);
