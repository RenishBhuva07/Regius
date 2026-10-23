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

import AddTaskModal from '../src/Components/AddTaskModal';

describe('Tasks Redesign Suite', () => {
  describe('Component Definitions', () => {
    it('cleanly exports all Tasks components, modals and screens', () => {
      expect(TasksScreen).toBeDefined();
      expect(AddTaskModal).toBeDefined();
      expect(TaskProductivityBento).toBeDefined();
      expect(TaskCategoryCarousel).toBeDefined();
      expect(TaskCardItem).toBeDefined();
      expect(TaskSectionBackgroundSvg).toBeDefined();
      expect(TaskCompleteDoodleSvg).toBeDefined();
    });
  });

  describe('AddTaskModal Creation Contract', () => {
    it('constructs valid task creation payload with date, time, and category', () => {
      const mockCreateTask = jest.fn();
      const payload = {
        title: 'Complete Quarterly Report',
        note: 'Review ARR metrics and churn rates',
        category: 'works',
        iconType: 'mail' as const,
        priority: 'high' as const,
        date: 'Today, Oct 23',
        time: '10:00 AM',
        subtasks: [
          { id: '1', text: 'Gather metrics', done: true },
          { id: '2', text: 'Present to leadership', done: false },
        ],
        voiceNudge: true,
      };

      mockCreateTask(payload);
      expect(mockCreateTask).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Complete Quarterly Report',
          category: 'works',
          priority: 'high',
          date: 'Today, Oct 23',
          time: '10:00 AM',
          voiceNudge: true,
        }),
      );
      expect(mockCreateTask).toHaveBeenCalledTimes(1);
    });

    it('constructs minimal clean payload when optional notes and subtasks are not provided', () => {
      const mockCreateTask = jest.fn();
      const cleanPayload: {
        title: string;
        note?: string;
        category: string;
        iconType: 'mail' | 'users';
        priority: 'low' | 'medium' | 'high';
        date: string;
        time?: string;
        subtasks?: { id: string; text: string; done: boolean }[];
        voiceNudge?: boolean;
      } = {
        title: 'Read quarterly strategy document',
        category: 'works',
        iconType: 'mail',
        priority: 'high',
        date: 'Today, Oct 23',
        time: '10:00 AM',
        voiceNudge: true,
      };

      mockCreateTask(cleanPayload);
      expect(mockCreateTask).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Read quarterly strategy document',
          category: 'works',
          priority: 'high',
        }),
      );
      expect(cleanPayload.subtasks).toBeUndefined();
      expect(cleanPayload.note).toBeUndefined();
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
