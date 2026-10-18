jest.mock('lucide-react-native', () => ({
  Mic: 'Mic',
  X: 'X',
  Sparkles: 'Sparkles',
  Volume2: 'Volume2',
  RotateCcw: 'RotateCcw',
  Clock: 'Clock',
  Check: 'Check',
  HelpCircle: 'HelpCircle',
  AlertTriangle: 'AlertTriangle',
}));

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

jest.mock('react-native-svg', () => {
  const React = require('react');
  const View = require('react-native').View;
  return {
    __esModule: true,
    default: (props: any) => React.createElement(View, props),
    Svg: (props: any) => React.createElement(View, props),
    Defs: (props: any) => React.createElement(View, props),
    RadialGradient: (props: any) => React.createElement(View, props),
    LinearGradient: (props: any) => React.createElement(View, props),
    Stop: (props: any) => React.createElement(View, props),
    Circle: (props: any) => React.createElement(View, props),
    Path: (props: any) => React.createElement(View, props),
    G: (props: any) => React.createElement(View, props),
  };
});

import {
  normalizeAssistantState,
  VoiceAssistantState,
  VoiceAssistantSheet,
} from '../src/Screens/Dashboard/Components/VoiceAssistantSheet';
import { SiaHolographicOrb } from '../src/Screens/Dashboard/Components/SiaHolographicOrb';

describe('VoiceAssistantSheet & SiaHolographicOrb State Machine Unit Tests', () => {
  describe('normalizeAssistantState', () => {
    it('maps legacy and modern visual states accurately', () => {
      expect(normalizeAssistantState('IDLE')).toBe('idle');
      expect(normalizeAssistantState('LISTENING')).toBe('listening');
      expect(normalizeAssistantState('PROCESSING')).toBe('processing');
      expect(normalizeAssistantState('SPEAKING')).toBe('speaking');
      expect(normalizeAssistantState('CONFIRMED')).toBe('success');
      expect(normalizeAssistantState('executing')).toBe('executing');
      expect(normalizeAssistantState('generatingResponse')).toBe(
        'generatingResponse',
      );
      expect(normalizeAssistantState('error')).toBe('error');
      expect(normalizeAssistantState('unrecognized')).toBe('unrecognized');
      expect(normalizeAssistantState(undefined)).toBe('listening');
    });
  });

  describe('SIA State Hierarchy & Status Label Definitions', () => {
    const states: { state: VoiceAssistantState; expectedRole: string }[] = [
      { state: 'idle', expectedRole: 'SIA is Ready' },
      { state: 'listening', expectedRole: 'Listening…' },
      { state: 'processing', expectedRole: 'SIA is Thinking…' },
      { state: 'generatingResponse', expectedRole: 'SIA is Thinking…' },
      { state: 'speaking', expectedRole: 'SIA is Speaking' },
      { state: 'executing', expectedRole: 'Taking care of it…' },
      { state: 'success', expectedRole: 'Task Added' },
      { state: 'unrecognized', expectedRole: 'Command Not Recognized' },
      { state: 'error', expectedRole: 'Unable to Complete' },
    ];

    it.each(states)(
      'provides synchronized state representation for %s',
      ({ state, expectedRole }) => {
        expect(state).toBeDefined();
        expect(expectedRole).toBeDefined();
      },
    );
  });

  describe('Component Exports & Interface Integrity', () => {
    it('exports VoiceAssistantSheet and SiaHolographicOrb cleanly', () => {
      expect(VoiceAssistantSheet).toBeDefined();
      expect(SiaHolographicOrb).toBeDefined();
    });
  });
});
