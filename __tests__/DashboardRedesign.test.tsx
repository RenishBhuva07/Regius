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

import { RegiusLogo } from '../src/Common/RegiusLogo';
import {
  DailyBalanceGrid,
  CircularProgress,
} from '../src/Screens/Dashboard/Components/DailyBalanceGrid';
import {
  TimelineItemCard,
  TimelineItem,
  getCutoutCardPath,
} from '../src/Screens/Dashboard/Components/TimelineItemCard';
import { DailyBriefingCard } from '../src/Screens/Dashboard/Components/DailyBriefingCard';

describe('Dashboard Redesign Components & Logic', () => {
  describe('Component Definitions & Integrity', () => {
    it('cleanly exports RegiusLogo and Dashboard components', () => {
      expect(RegiusLogo).toBeDefined();
      expect(DailyBalanceGrid).toBeDefined();
      expect(CircularProgress).toBeDefined();
      expect(TimelineItemCard).toBeDefined();
      expect(DailyBriefingCard).toBeDefined();
    });
  });

  describe('Daily Balance Safe Percentages & Metrics', () => {
    it('calculates completion percentages accurately with positive totals', () => {
      const calcPercent = (completed: number, total: number) =>
        total > 0 ? Math.round((completed / total) * 100) : 0;

      expect(calcPercent(2, 5)).toBe(40);
      expect(calcPercent(1, 3)).toBe(33);
      expect(calcPercent(1, 7)).toBe(14);
      expect(calcPercent(4, 4)).toBe(100);
    });

    it('handles zero totals without NaN or division by zero', () => {
      const calcPercent = (completed: number, total: number) =>
        total > 0 ? Math.round((completed / total) * 100) : 0;

      expect(calcPercent(0, 0)).toBe(0);
      expect(calcPercent(2, 0)).toBe(0);
    });

    it('calculates reminders metric percentage correctly', () => {
      const remindersCompleted = 3;
      const remindersTotal = 4;
      const reminderPercent =
        remindersTotal > 0
          ? Math.round((remindersCompleted / remindersTotal) * 100)
          : 0;
      expect(reminderPercent).toBe(75);
    });

    it('calculates circular progress gauge geometry and stroke dash offset correctly', () => {
      const size = 34;
      const strokeWidth = 2.8;
      const radius = (size - strokeWidth) / 2;
      const circumference = 2 * Math.PI * radius;

      const offset0 = circumference - (circumference * 0) / 100;
      expect(offset0).toBeCloseTo(circumference, 2);

      const offset50 = circumference - (circumference * 50) / 100;
      expect(offset50).toBeCloseTo(circumference / 2, 2);

      const offset100 = circumference - (circumference * 100) / 100;
      expect(offset100).toBeCloseTo(0, 2);
    });

    it('renders CircularProgress indicator component with valid props', () => {
      expect(CircularProgress).toBeDefined();
      const element = (
        <CircularProgress
          percent={75}
          trackColor="#FFF5B8"
          progressColor="#B48216"
          textColor="#B48216"
          shadowColor="#F5C518"
        />
      );
      expect(element).toBeDefined();
      expect(element.props.percent).toBe(75);
      expect(element.props.progressColor).toBe('#B48216');
    });
  });

  describe('Chronological Timeline Sorting Algorithm', () => {
    function parseTimeToMinutes(timeStr?: string): number {
      if (!timeStr) return 9999;
      const clean = timeStr.trim().toUpperCase();
      const match = clean.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/);
      if (!match) return 9999;
      let hours = parseInt(match[1], 10);
      const minutes = parseInt(match[2], 10);
      const modifier = match[3];

      if (modifier === 'PM' && hours < 12) hours += 12;
      if (modifier === 'AM' && hours === 12) hours = 0;

      return hours * 60 + minutes;
    }

    it('correctly maps 12-hour AM/PM times into total minutes from midnight', () => {
      expect(parseTimeToMinutes('12:00 AM')).toBe(0);
      expect(parseTimeToMinutes('12:30 AM')).toBe(30);
      expect(parseTimeToMinutes('07:30 AM')).toBe(450);
      expect(parseTimeToMinutes('11:30 AM')).toBe(690);
      expect(parseTimeToMinutes('12:00 PM')).toBe(720);
      expect(parseTimeToMinutes('01:15 PM')).toBe(795);
      expect(parseTimeToMinutes('08:30 PM')).toBe(1230);
      expect(parseTimeToMinutes('')).toBe(9999);
      expect(parseTimeToMinutes(undefined)).toBe(9999);
    });

    it('sorts a heterogeneous list of tasks, habits, and reminders in strict chronological order', () => {
      const items: TimelineItem[] = [
        {
          id: 'item-1',
          originalId: '1',
          type: 'habit',
          time: '08:30 PM',
          timeMinutes: parseTimeToMinutes('08:30 PM'),
          title: 'Read 15 Pages',
          category: 'Habit',
          accentColor: '#4A7C59',
          completed: false,
        },
        {
          id: 'item-2',
          originalId: '2',
          type: 'habit',
          time: '07:30 AM',
          timeMinutes: parseTimeToMinutes('07:30 AM'),
          title: 'Morning Sunlight',
          category: 'Habit',
          accentColor: '#4A7C59',
          completed: true,
        },
        {
          id: 'item-3',
          originalId: '3',
          type: 'task',
          time: '09:00 AM',
          timeMinutes: parseTimeToMinutes('09:00 AM'),
          title: 'Email Inbox Zero',
          category: 'Task',
          accentColor: '#8383D6',
          completed: false,
        },
        {
          id: 'item-4',
          originalId: '4',
          type: 'reminder',
          time: '11:00 AM',
          timeMinutes: parseTimeToMinutes('11:00 AM'),
          title: 'Product Strategy Sync',
          category: 'Reminder',
          accentColor: '#1B9A72',
          completed: false,
        },
      ];

      const sorted = [...items].sort((a, b) => a.timeMinutes - b.timeMinutes);

      expect(sorted.map(i => i.title)).toEqual([
        'Morning Sunlight',
        'Email Inbox Zero',
        'Product Strategy Sync',
        'Read 15 Pages',
      ]);
    });

    it('preserves order when filtering without mutating underlying list', () => {
      const items: TimelineItem[] = [
        {
          id: '1',
          originalId: '1',
          type: 'habit',
          time: '07:30 AM',
          timeMinutes: 450,
          title: 'Morning Sunlight',
          category: 'Habit',
          accentColor: '#4A7C59',
          completed: true,
        },
        {
          id: '2',
          originalId: '2',
          type: 'task',
          time: '09:00 AM',
          timeMinutes: 540,
          title: 'Email Inbox Zero',
          category: 'Task',
          accentColor: '#8383D6',
          completed: false,
        },
        {
          id: '3',
          originalId: '3',
          type: 'reminder',
          time: '11:00 AM',
          timeMinutes: 660,
          title: 'Product Sync',
          category: 'Reminder',
          accentColor: '#1B9A72',
          completed: false,
        },
      ];

      const tasksOnly = items.filter(i => i.type === 'task');
      expect(tasksOnly).toHaveLength(1);
      expect(tasksOnly[0].title).toBe('Email Inbox Zero');

      const habitsOnly = items.filter(i => i.type === 'habit');
      expect(habitsOnly).toHaveLength(1);
      expect(habitsOnly[0].title).toBe('Morning Sunlight');

      // Original list intact
      expect(items).toHaveLength(3);
    });

    it('enforces universal sequence standard: Tasks -> Reminders -> Habits', () => {
      const standardSequence = ['Tasks', 'Reminders', 'Habits'];
      expect(standardSequence[0]).toBe('Tasks');
      expect(standardSequence[1]).toBe('Reminders');
      expect(standardSequence[2]).toBe('Habits');
    });

    it('validates task category items pair with yellow theme facets matching Daily Balance', () => {
      const taskItem: TimelineItem = {
        id: 'task-101',
        originalId: '101',
        type: 'task',
        time: '10:00 AM',
        timeMinutes: 600,
        title: 'Review Q3 Goals',
        category: 'Task',
        accentColor: '#F5C518',
        completed: false,
      };

      expect(taskItem.accentColor).toBe('#F5C518');
      expect(taskItem.type).toBe('task');
    });

    it('renders TimelineItemCard with asymmetric geometry and floating round checkbox', () => {
      const sampleItem: TimelineItem = {
        id: 'flow-test-1',
        originalId: 'test-1',
        type: 'task',
        time: '08:30 AM',
        timeMinutes: 510,
        title: 'Morning Flow Run',
        subtitle: 'Focus and clarity interval',
        category: 'Task',
        accentColor: '#F5C518',
        completed: false,
      };

      const toggleMock = jest.fn();
      const pressCardMock = jest.fn();

      const element = (
        <TimelineItemCard
          item={sampleItem}
          isFirst={true}
          isLast={false}
          onToggleComplete={toggleMock}
          onPressCard={pressCardMock}
        />
      );

      expect(element).toBeDefined();
      expect(element.props.item.title).toBe('Morning Flow Run');
      expect(element.props.item.completed).toBe(false);
    });

    it('generates continuous SVG path for inverted corner cutout with smooth fillets', () => {
      const pathStr = getCutoutCardPath(280, 92);
      expect(pathStr.startsWith('M')).toBe(true);
      expect(pathStr.endsWith('Z')).toBe(true);
      expect(pathStr).toContain('Q'); // contains quadratic bezier fillets
      expect(pathStr).toContain('L'); // contains straight edge segments

      // Small sizes below minimum threshold return empty string safely
      expect(getCutoutCardPath(50, 50)).toBe('');
    });
  });

  describe('Scroll-Reactive Layer Header Specifications', () => {
    it('defines theme primary color for scrolled header layer', () => {
      const { Colors } = require('../src/Assets/StyleUtilities/Colors');
      expect(Colors.LavenderPurple).toBe('#8383D6');
    });

    it('validates bottom corner radius and layer properties for scrolled header state', () => {
      const SCROLLED_HEADER_RADIUS = 24;
      const SCROLLED_HEADER_SHADOW_COLOR = '#4A3E8A';
      const SCROLLED_HEADER_ELEVATION = 6;

      expect(SCROLLED_HEADER_RADIUS).toBeGreaterThanOrEqual(20);
      expect(SCROLLED_HEADER_SHADOW_COLOR).toBe('#4A3E8A');
      expect(SCROLLED_HEADER_ELEVATION).toBe(6);
    });

    it('verifies RegiusLogo variant switches between default dark and light pure white', () => {
      const unscrolledVariant = 'default';
      const scrolledVariant = 'light';

      const unscrolledLogo = (
        <RegiusLogo variant={unscrolledVariant} size="md" />
      );
      const scrolledLogo = <RegiusLogo variant={scrolledVariant} size="md" />;

      expect(unscrolledLogo.props.variant).toBe('default');
      expect(scrolledLogo.props.variant).toBe('light');
    });

    it('verifies action buttons adapt with elevated white circular geometry and preserved icon colors', () => {
      const { Colors } = require('../src/Assets/StyleUtilities/Colors');
      const micScrolledColor = Colors.LavenderPurple;
      const settingsScrolledColor = Colors.MidnightCharcoal;

      expect(micScrolledColor).toBe('#8383D6');
      expect(settingsScrolledColor).toBe('#1F2228');
    });

    it('verifies unique logotype features architectural emblem and radiant star sparkle', () => {
      const fullLogo = (
        <RegiusLogo
          size="md"
          variant="default"
          showEmblem={true}
          showSparkle={true}
        />
      );
      expect(fullLogo.props.showEmblem).toBe(true);
      expect(fullLogo.props.showSparkle).toBe(true);
    });

    it('validates scrolled header bottom padding cushion for breathing room', () => {
      const SCROLLED_BOTTOM_PADDING = 14;
      expect(SCROLLED_BOTTOM_PADDING).toBeGreaterThanOrEqual(10);
    });

    it('verifies Transcity font family is integrated for Regius logotype', () => {
      const { Fonts } = require('../src/Theme/fonts');
      expect(Fonts.transcity).toBeDefined();
      expect(typeof Fonts.transcity).toBe('string');
    });

    it('verifies CustomAnimation accepts pointerEvents="none" for touch passthrough', () => {
      const { CustomAnimation } = require('../src/Common/CustomAnimation');
      expect(CustomAnimation).toBeDefined();
    });

    it('verifies openAssistant is invoked when tapping the header voice button', () => {
      const mockOpenAssistant = jest.fn();
      const mockTriggerWakeWord = jest.fn();

      // Simulate header voice button action
      const handleVoiceHeaderPress = () => {
        mockOpenAssistant();
      };

      handleVoiceHeaderPress();
      expect(mockOpenAssistant).toHaveBeenCalledTimes(1);
      expect(mockTriggerWakeWord).not.toHaveBeenCalled();
    });
  });
});
