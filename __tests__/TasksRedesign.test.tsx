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

import TasksScreen from '../src/Screens/Tasks/TasksScreen';
import { TaskProductivityBento } from '../src/Screens/Tasks/Components/TaskProductivityBento';
import { TaskCategoryCarousel } from '../src/Screens/Tasks/Components/TaskCategoryCarousel';
import { TaskCardItem } from '../src/Screens/Tasks/Components/TaskCardItem';
import { TaskSectionBackgroundSvg } from '../src/Screens/Tasks/Components/TaskSectionBackgroundSvg';
import { TaskCompleteDoodleSvg } from '../src/Screens/Tasks/Components/TaskCompleteDoodleSvg';
import { INITIAL_TASKS, Task } from '../src/Context/TaskReminderContext';

describe('Tasks Redesign Suite', () => {
  describe('Component Definitions', () => {
    it('cleanly exports all Tasks components and screens', () => {
      expect(TasksScreen).toBeDefined();
      expect(TaskProductivityBento).toBeDefined();
      expect(TaskCategoryCarousel).toBeDefined();
      expect(TaskCardItem).toBeDefined();
      expect(TaskSectionBackgroundSvg).toBeDefined();
      expect(TaskCompleteDoodleSvg).toBeDefined();
    });
  });

  describe('Tasks Calculations & Filtering Logic', () => {
    it('correctly calculates completed and pending task counts', () => {
      const completed = INITIAL_TASKS.filter(t => t.done).length;
      const pending = INITIAL_TASKS.filter(t => !t.done).length;
      const total = INITIAL_TASKS.length;
      const progressPercent = Math.round((completed / total) * 100);

      expect(completed).toBe(1); // Email Check is done
      expect(pending).toBe(4);
      expect(total).toBe(5);
      expect(progressPercent).toBe(20);
    });

    it('correctly filters active task list vs completed tasks', () => {
      const pendingList = INITIAL_TASKS.filter(t => !t.done);
      const completedList = INITIAL_TASKS.filter(t => t.done);

      expect(pendingList.length).toBe(4);
      expect(completedList.length).toBe(1);
      expect(completedList[0].label).toBe('Email Check & Inbox Zero');
    });

    it('correctly filters tasks by category', () => {
      const worksTasks = INITIAL_TASKS.filter(
        t => t.category === 'works' || !t.category,
      );
      const sportTasks = INITIAL_TASKS.filter(t => t.category === 'sport');
      const habitTasks = INITIAL_TASKS.filter(t => t.category === 'habits');

      expect(worksTasks.length).toBe(3);
      expect(sportTasks.length).toBe(1);
      expect(habitTasks.length).toBe(1);
    });

    it('simulates toggling a task from incomplete to complete', () => {
      const task: Task = {
        id: 'task-test-toggle',
        label: 'Design System Review',
        iconType: 'users',
        done: false,
        category: 'works',
      };

      const toggled = { ...task, done: !task.done };
      expect(toggled.done).toBe(true);

      const untoggled = { ...toggled, done: !toggled.done };
      expect(untoggled.done).toBe(false);
    });
  });
});
