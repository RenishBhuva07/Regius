jest.mock('react-native-track-player', () => ({
  setupPlayer: jest.fn().mockResolvedValue(undefined),
  updateOptions: jest.fn().mockResolvedValue(undefined),
  add: jest.fn().mockResolvedValue(undefined),
  play: jest.fn().mockResolvedValue(undefined),
  pause: jest.fn().mockResolvedValue(undefined),
  stop: jest.fn().mockResolvedValue(undefined),
  reset: jest.fn().mockResolvedValue(undefined),
  getState: jest.fn().mockResolvedValue('idle'),
  getProgress: jest.fn().mockResolvedValue({ position: 0, duration: 80 }),
  addEventListener: jest.fn().mockReturnValue({ remove: jest.fn() }),
  registerPlaybackService: jest.fn(),
  Capability: { Play: 'play', Pause: 'pause', Stop: 'stop' },
  Event: {
    PlaybackState: 'playback-state',
    PlaybackTrackChanged: 'playback-track-changed',
    PlaybackQueueEnded: 'playback-queue-ended',
    PlaybackError: 'playback-error',
  },
  State: {
    None: 'none',
    Ready: 'ready',
    Playing: 'playing',
    Paused: 'paused',
    Stopped: 'stopped',
    Buffering: 'buffering',
    Connecting: 'connecting',
  },
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn().mockResolvedValue(null),
  setItem: jest.fn().mockResolvedValue(null),
  removeItem: jest.fn().mockResolvedValue(null),
  clear: jest.fn().mockResolvedValue(null),
}));

jest.mock('@react-native-voice/voice', () => ({
  onSpeechStart: jest.fn(),
  onSpeechRecognized: jest.fn(),
  onSpeechEnd: jest.fn(),
  onSpeechError: jest.fn(),
  onSpeechResults: jest.fn(),
  onSpeechPartialResults: jest.fn(),
  start: jest.fn().mockResolvedValue(undefined),
  stop: jest.fn().mockResolvedValue(undefined),
  destroy: jest.fn().mockResolvedValue(undefined),
  removeAllListeners: jest.fn(),
  isRecognizing: jest.fn().mockResolvedValue(false),
}));

import { HabitsScreen } from '../src/Screens/Habits/HabitsScreen';
import { HabitDetailsScreen } from '../src/Screens/Habits/HabitDetailsScreen';
import { HabitConsistencyBento } from '../src/Screens/Habits/Components/HabitConsistencyBento';
import { HabitCategoryFilters } from '../src/Screens/Habits/Components/HabitCategoryFilters';
import { HabitItemCard } from '../src/Screens/Habits/Components/HabitItemCard';
import { HabitSectionBackgroundSvg } from '../src/Screens/Habits/Components/HabitSectionBackgroundSvg';
import { HabitNotesDoodleSvg } from '../src/Screens/Habits/Components/HabitNotesDoodleSvg';
import { AddHabitModal } from '../src/Components/AddHabitModal';
import { INITIAL_HABITS, HabitItem } from '../src/Context/TaskReminderContext';

describe('Habits Redesign Suite', () => {
  describe('Component Definitions', () => {
    it('cleanly exports all Habit components and screens', () => {
      expect(HabitsScreen).toBeDefined();
      expect(HabitDetailsScreen).toBeDefined();
      expect(HabitConsistencyBento).toBeDefined();
      expect(HabitCategoryFilters).toBeDefined();
      expect(HabitItemCard).toBeDefined();
      expect(HabitSectionBackgroundSvg).toBeDefined();
      expect(HabitNotesDoodleSvg).toBeDefined();
      expect(AddHabitModal).toBeDefined();
    });
  });

  describe('Habits Calculations & Logic', () => {
    it('correctly calculates longest streak from initial habits', () => {
      const longest = Math.max(...INITIAL_HABITS.map(h => h.streak), 0);
      expect(longest).toBe(21); // Cold Hydration & Cortisol Reset has streak 21
    });

    it('correctly calculates completed percentage and count', () => {
      const completed = INITIAL_HABITS.filter(h => h.completed).length;
      const total = INITIAL_HABITS.length;
      const percent = Math.round((completed / total) * 100);
      expect(completed).toBe(2);
      expect(total).toBe(5);
      expect(percent).toBe(40);
    });

    it('correctly filters habits by category', () => {
      const morningHabits = INITIAL_HABITS.filter(
        h => h.category === 'morning',
      );
      const mindfulHabits = INITIAL_HABITS.filter(
        h => h.category === 'mindful',
      );
      const eveningHabits = INITIAL_HABITS.filter(
        h => h.category === 'evening',
      );

      expect(morningHabits.length).toBe(2);
      expect(mindfulHabits.length).toBe(2);
      expect(eveningHabits.length).toBe(1);
    });

    it('simulates toggling a habit from uncompleted to completed and updates streak', () => {
      const habit: HabitItem = {
        id: 'test-1',
        title: 'Morning Yoga',
        category: 'morning',
        streak: 5,
        frequency: 'Daily',
        completed: false,
        timeOfDay: '06:30 AM',
        accentColor: '#4A7C59',
      };

      const toggled: HabitItem = {
        ...habit,
        completed: !habit.completed,
        streak: !habit.completed
          ? habit.streak + 1
          : Math.max(habit.streak - 1, 0),
      };

      expect(toggled.completed).toBe(true);
      expect(toggled.streak).toBe(6);
    });

    it('simulates updating habit attributes with updateHabit payload', () => {
      const habit: HabitItem = {
        id: 'test-1',
        title: 'Morning Yoga',
        category: 'morning',
        streak: 5,
        frequency: 'Daily',
        completed: false,
        timeOfDay: '06:30 AM',
        accentColor: '#4A7C59',
      };

      const updates = {
        title: 'Morning Yoga & Breathwork',
        timeOfDay: '07:00 AM',
        frequency: 'Mon, Wed, Fri',
      };

      const updated = { ...habit, ...updates };

      expect(updated.title).toBe('Morning Yoga & Breathwork');
      expect(updated.timeOfDay).toBe('07:00 AM');
      expect(updated.frequency).toBe('Mon, Wed, Fri');
      expect(updated.streak).toBe(5);
      expect(updated.id).toBe('test-1');
    });
  });

  describe('Habit Details & Swipe Flows', () => {
    it('verifies habit details resolution by ID', () => {
      const targetId = 'h-1';
      const targetHabit = INITIAL_HABITS.find(h => h.id === targetId);

      expect(targetHabit).toBeDefined();
      expect(targetHabit?.title).toBe('Morning Sunlight & 500ml Water');
      expect(targetHabit?.category).toBe('morning');
      expect(targetHabit?.streak).toBe(18);
      expect(targetHabit?.timeOfDay).toBe('07:30 AM');
    });

    it('validates 7-day consistency metric formula for habit details screen', () => {
      const habit = INITIAL_HABITS[0]; // streak 18, completed: true
      const streak = habit.streak;
      const isCompleted = habit.completed;
      const consistencyRate = Math.min(
        100,
        Math.round(((streak + (isCompleted ? 1 : 0)) / (streak + 1 || 1)) * 100),
      );

      expect(consistencyRate).toBe(100);
    });

    it('verifies categories have tailored themes and motivations', () => {
      const categories = ['morning', 'mindful', 'evening'] as const;
      categories.forEach(cat => {
        const matches = INITIAL_HABITS.filter(h => h.category === cat);
        expect(matches.length).toBeGreaterThan(0);
      });
    });
  });
});
