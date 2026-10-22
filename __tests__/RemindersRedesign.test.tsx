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

import RemindersScreen from '../src/Screens/Reminders/RemindersScreen';
import { ReminderScheduleBento } from '../src/Screens/Reminders/Components/ReminderScheduleBento';
import { ReminderCategoryCarousel } from '../src/Screens/Reminders/Components/ReminderCategoryCarousel';
import { ReminderCardItem } from '../src/Screens/Reminders/Components/ReminderCardItem';
import { ReminderSectionBackgroundSvg } from '../src/Screens/Reminders/Components/ReminderSectionBackgroundSvg';
import { ReminderEmptyDoodleSvg } from '../src/Screens/Reminders/Components/ReminderEmptyDoodleSvg';
import {
  INITIAL_REMINDERS,
  Reminder,
} from '../src/Context/TaskReminderContext';

describe('Reminders Redesign Suite', () => {
  describe('Component Definitions', () => {
    it('cleanly exports all Reminders components and screens', () => {
      expect(RemindersScreen).toBeDefined();
      expect(ReminderScheduleBento).toBeDefined();
      expect(ReminderCategoryCarousel).toBeDefined();
      expect(ReminderCardItem).toBeDefined();
      expect(ReminderSectionBackgroundSvg).toBeDefined();
      expect(ReminderEmptyDoodleSvg).toBeDefined();
    });
  });

  describe('Reminders Calculations & Filtering Logic', () => {
    it('correctly calculates completed and pending reminder counts', () => {
      const completed = INITIAL_REMINDERS.filter(r => r.done).length;
      const pending = INITIAL_REMINDERS.filter(r => !r.done).length;
      const total = INITIAL_REMINDERS.length;
      const progressPercent = Math.round((completed / total) * 100);

      expect(completed).toBe(1); // Product Strategy Sync is done
      expect(pending).toBe(4);
      expect(total).toBe(5);
      expect(progressPercent).toBe(20);
    });

    it('correctly filters active reminders vs completed reminders', () => {
      const pendingList = INITIAL_REMINDERS.filter(r => !r.done);
      const completedList = INITIAL_REMINDERS.filter(r => r.done);

      expect(pendingList.length).toBe(4);
      expect(completedList.length).toBe(1);
      expect(completedList[0].title).toBe('Product Strategy Sync Call');
    });

    it('correctly filters reminders by category', () => {
      const dailyReminders = INITIAL_REMINDERS.filter(
        r => r.category === 'daily',
      );
      const workReminders = INITIAL_REMINDERS.filter(
        r => r.category === 'work',
      );
      const healthReminders = INITIAL_REMINDERS.filter(
        r => r.category === 'health',
      );
      const eventsReminders = INITIAL_REMINDERS.filter(
        r => r.category === 'events',
      );

      expect(dailyReminders.length).toBe(1);
      expect(workReminders.length).toBe(1);
      expect(healthReminders.length).toBe(2);
      expect(eventsReminders.length).toBe(1);
    });

    it('identifies next upcoming alert properly', () => {
      const pendingList = INITIAL_REMINDERS.filter(r => !r.done);
      expect(pendingList.length).toBeGreaterThan(0);
      expect(pendingList[0].title).toBe('Morning Meditation & Breathing');
      expect(pendingList[0].time).toBe('07:30 AM');
    });
  });
});
