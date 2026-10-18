import React from 'react';
import renderer from 'react-test-renderer';

jest.mock('lucide-react-native', () => {
  const React = require('react');
  const View = require('react-native').View;
  const MockIcon = (props: any) => React.createElement(View, props);
  return {
    __esModule: true,
    Mic: MockIcon,
    X: MockIcon,
    Sparkles: MockIcon,
    Volume2: MockIcon,
    RotateCcw: MockIcon,
    Clock: MockIcon,
    Check: MockIcon,
    HelpCircle: MockIcon,
    AlertCircle: MockIcon,
    AlertTriangle: MockIcon,
    Square: MockIcon,
  };
});

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 47, bottom: 34, left: 0, right: 0 }),
}));

jest.mock('lottie-react-native', () => {
  const React = require('react');
  const View = require('react-native').View;
  return {
    __esModule: true,
    default: (props: any) => React.createElement(View, props),
  };
});

jest.mock('react-native-responsive-fontsize', () => ({
  RFPercentage: (val: number) => val,
  RFValue: (val: number) => val,
}));

import {
  VoiceCommandService,
  ExecutionContext,
} from '../src/Services/Voice/VoiceCommandService';
import { VoiceStateMachine } from '../src/Services/Voice/VoiceStateMachine';
import { buildConfirmationMessage } from '../src/Services/Voice/VoiceConfirmationBuilder';
import {
  VoiceAssistantSheet,
  normalizeAssistantState,
} from '../src/Screens/Dashboard/Components/VoiceAssistantSheet';
import { AssistantHeader } from '../src/Screens/Dashboard/Components/VoiceAssistant/AssistantHeader';
import { AssistantStatus } from '../src/Screens/Dashboard/Components/VoiceAssistant/AssistantStatus';
import { ConversationSurface } from '../src/Screens/Dashboard/Components/VoiceAssistant/ConversationSurface';
import { VoiceInputControls } from '../src/Screens/Dashboard/Components/VoiceAssistant/VoiceInputControls';
import { getAssistantTheme } from '../src/Screens/Dashboard/Components/VoiceAssistant/theme';

describe('Voice Assistant Refactor Test Suite — Regius', () => {
  let mockContext: ExecutionContext;

  beforeEach(() => {
    mockContext = {
      tasks: [],
      addTask: jest.fn(data => ({
        id: 'task-new',
        label: data.title,
        iconType: 'mail',
        done: false,
        date: data.date,
        time: data.time,
      })),
      toggleTask: jest.fn(),
      reminders: [],
      addReminder: jest.fn(data => ({
        id: 'rem-new',
        title: data.title,
        date: data.date,
        time: data.time,
      })),
      toggleReminder: jest.fn(),
      habits: [],
      addHabit: jest.fn(data => ({
        id: 'habit-new',
        title: data.title,
      })),
      toggleHabit: jest.fn(),
    };
  });

  describe('1. Natural Language Variations (Phase 5 Required Cases)', () => {
    it('understands "Add a task to play badminton."', () => {
      const res = VoiceCommandService.interpret('Add a task to play badminton.');
      expect(res.intent).toBe('ADD_TASK');
      expect(res.parameters.title?.toLowerCase()).toContain('play badminton');
    });

    it('understands "I need to play badminton."', () => {
      const res = VoiceCommandService.interpret('I need to play badminton.');
      expect(res.intent).toBe('ADD_TASK');
      expect(res.parameters.title?.toLowerCase()).toContain('play badminton');
    });

    it('understands "Put badminton on my list."', () => {
      const res = VoiceCommandService.interpret('Put badminton on my list.');
      expect(res.intent).toBe('ADD_TASK');
      expect(res.parameters.title?.toLowerCase()).toBe('badminton');
    });

    it('understands "Remind me about playing badminton." and asks for clarification', () => {
      const res = VoiceCommandService.interpret('Remind me about playing badminton.');
      expect(res.intent).toBe('ADD_REMINDER');
      expect(res.needsClarification?.missingSlot).toBe('time');
      expect(res.needsClarification?.question).toContain('When');
    });

    it('understands "Can you remind me to call Mom this evening?" with evening time', () => {
      const res = VoiceCommandService.interpret('Can you remind me to call Mom this evening?');
      expect(res.intent).toBe('ADD_REMINDER');
      expect(res.parameters.title?.toLowerCase()).toBe('call mom');
      expect(res.parameters.date).toBe('Tonight');
      expect(res.parameters.time).toBe('07:00 PM');
    });

    it('understands "Log a 20-minute meditation."', () => {
      const res = VoiceCommandService.interpret('Log a 20-minute meditation.');
      expect(res.intent).toBe('LOG_HABIT');
      expect(res.parameters.title).toBe('20-min Meditation');
    });

    it('understands "Move my focus timer forward by 15 minutes."', () => {
      const res = VoiceCommandService.interpret('Move my focus timer forward by 15 minutes.');
      expect(res.intent).toBe('EXTEND_FOCUS');
      expect(res.parameters.durationMinutes).toBe(15);
    });

    it('understands "Play my morning briefing."', () => {
      const res = VoiceCommandService.interpret('Play my morning briefing.');
      expect(res.intent).toBe('PLAY_BRIEF');
    });
  });

  describe('2. State Machine Transitions & Lifecycle (Phase 3)', () => {
    it('handles comprehensive state flow without illegal transitions', () => {
      const sm = new VoiceStateMachine('idle');
      const sessionId = sm.startNewSession();

      // idle -> requestingPermission
      expect(sm.transitionTo('requestingPermission', sessionId)).toBe(true);

      // requestingPermission -> listening
      expect(sm.transitionTo('listening', sessionId)).toBe(true);

      // listening -> processingTranscript
      expect(sm.transitionTo('processingTranscript', sessionId)).toBe(true);

      // processingTranscript -> understanding
      expect(sm.transitionTo('understanding', sessionId)).toBe(true);

      // understanding -> awaitingClarification
      expect(sm.transitionTo('awaitingClarification', sessionId)).toBe(true);

      // awaitingClarification -> listening
      expect(sm.transitionTo('listening', sessionId)).toBe(true);

      // listening -> understanding
      expect(sm.transitionTo('understanding', sessionId)).toBe(true);

      // understanding -> executingAction
      expect(sm.transitionTo('executingAction', sessionId)).toBe(true);

      // executingAction -> responding
      expect(sm.transitionTo('responding', sessionId)).toBe(true);

      // responding -> completed
      expect(sm.transitionTo('completed', sessionId)).toBe(true);
      expect(sm.getState()).toBe('completed');
    });

    it('rejects stale sessionId updates to prevent race conditions', () => {
      const sm = new VoiceStateMachine('idle');
      const session1 = sm.startNewSession();
      sm.transitionTo('listening', session1);

      const session2 = sm.startNewSession();
      // An old network response from session1 should be rejected
      const transitionAccepted = sm.transitionTo('completed', session1);
      expect(transitionAccepted).toBe(false);
      expect(sm.getState()).toBe('listening');
      expect(sm.getSessionId()).toBe(session2);
    });

    it('normalizes legacy visual states accurately', () => {
      expect(normalizeAssistantState('IDLE')).toBe('idle');
      expect(normalizeAssistantState('LISTENING')).toBe('listening');
      expect(normalizeAssistantState('PROCESSING')).toBe('processing');
      expect(normalizeAssistantState('SPEAKING')).toBe('speaking');
      expect(normalizeAssistantState('CONFIRMED')).toBe('success');
      expect(normalizeAssistantState('awaitingClarification')).toBe('awaitingClarification');
      expect(normalizeAssistantState('executingAction')).toBe('executingAction');
    });
  });

  describe('3. Scheduling Correctness (Phase 5)', () => {
    it('does not claim product default 10:00 AM was user-requested for unscheduled tasks', () => {
      const cmd = VoiceCommandService.interpret('Add a task to play badminton.');
      const result = VoiceCommandService.execute(cmd, mockContext);

      expect(result.success).toBe(true);
      // Confirms task is in daily schedule without falsely displaying "at 10:00 AM"
      expect(result.displayBody).toBe('Added to your daily schedule.');
      expect(result.spokenResponse).not.toContain('10:00 AM');
    });

    it('explicitly reports user-specified time when requested', () => {
      const cmd = VoiceCommandService.interpret('Add a task to play badminton at 4 PM.');
      const result = VoiceCommandService.execute(cmd, mockContext);

      expect(result.success).toBe(true);
      expect(result.displayBody).toContain('4 PM');
      expect(result.spokenResponse).toContain('4 PM');
    });
  });

  describe('4. Modular UI Components & Dynamic Assistant Identity', () => {
    const lightTheme = getAssistantTheme(false);
    const darkTheme = getAssistantTheme(true);

    it('provides complete design tokens for light and dark modes', () => {
      expect(lightTheme.background).toBe('#FAF8F5');
      expect(lightTheme.textPrimary).toBe('#181A1F');
      expect(darkTheme.background).toBe('#111317');
      expect(darkTheme.textPrimary).toBe('#FFFFFF');
    });

    it('exports all modular assistant components cleanly', () => {
      expect(AssistantHeader).toBeDefined();
      expect(AssistantStatus).toBeDefined();
      expect(ConversationSurface).toBeDefined();
      expect(VoiceInputControls).toBeDefined();
      expect(VoiceAssistantSheet).toBeDefined();
    });
  });
});
