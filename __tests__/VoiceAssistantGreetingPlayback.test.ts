import {
  WakeWordRepliesService,
  DEFAULT_PREDEFINED_REPLIES,
} from '../src/Services/Voice/wakeWordReplies';
import { RegiusSpeechService } from '../src/Services/RegiusSpeechService';
import { KokoroTTSService } from '../src/Services/Kokoro/KokoroTTSService';
import { AudioPlayerService } from '../src/Services/AudioPlayerService';
import { VoiceStateMachine } from '../src/Services/Voice/VoiceStateMachine';
import { VOICES } from '../src/Screens/Settings/Components/types';

// Mock dependencies
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(() => Promise.resolve(null)),
  setItem: jest.fn(() => Promise.resolve()),
}));

jest.mock('../src/Services/VoiceSettingsService', () => ({
  VoiceSettingsService: {
    getSettings: jest.fn(() =>
      Promise.resolve({
        selectedVoiceId: 'af_bella',
        speechSpeed: 1.0,
        autoSpeakReplies: true,
      }),
    ),
  },
}));

jest.mock('../src/Services/AudioPlayerService', () => ({
  AudioPlayerService: {
    setup: jest.fn(() => Promise.resolve(true)),
    play: jest.fn(() => Promise.resolve()),
    playWithCallbacks: jest.fn((track, callbacks) => {
      callbacks?.onStart?.();
      callbacks?.onEnded?.();
      return Promise.resolve(true);
    }),
    stop: jest.fn(() => Promise.resolve()),
  },
}));

describe('Voice Assistant Greeting Playback & Restoration Suite', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('1. Dynamic Greeting Variations & Collection Integrity', () => {
    it('preserves all original greeting sentences and supports natural user variations', () => {
      const allReplies = WakeWordRepliesService.getAllReplies();
      expect(allReplies.length).toBeGreaterThanOrEqual(10);

      const replyTexts = allReplies.map(r => r.reply);
      expect(replyTexts).toContain('Hey! How can I help you?');
      expect(replyTexts).toContain("I'm listening, what can I do for you?");
      expect(replyTexts).toContain('Hey! Ready when you are.');
      expect(replyTexts).toContain("I'm here. What would you like me to do?");
      expect(replyTexts).toContain(
        "Hey there! I'm listening. What can I help you with?",
      );
    });

    it('dynamically interpolates the assistant name "Sia"', () => {
      const reply = WakeWordRepliesService.getNextReply('random', 'Sia');
      expect(typeof reply).toBe('string');
      expect(reply.length).toBeGreaterThan(0);
      // If the template contained "Regius", it must be replaced by "Sia"
      expect(reply).not.toMatch(/\bRegius\b/);
    });

    it('produces variety across multiple wake word greeting invocations', () => {
      const distinctReplies = new Set<string>();
      for (let i = 0; i < 30; i++) {
        distinctReplies.add(
          WakeWordRepliesService.getNextReply('random', 'Sia'),
        );
      }
      // Out of 30 random draws from >=10 items, there should be multiple distinct items
      expect(distinctReplies.size).toBeGreaterThan(1);
    });
  });

  describe('2. RegiusSpeechService Greeting Lifecycle', () => {
    it('returns a fast wake greeting interpolated for Sia', async () => {
      const greeting = await RegiusSpeechService.getFastWakeGreeting('Sia');
      expect(typeof greeting).toBe('string');
      expect(greeting.length).toBeGreaterThan(0);
      expect(greeting).not.toMatch(/\bRegius\b/);
    });

    it('speaks greeting and invokes lifecycle onStart and onEnded callbacks', async () => {
      const onStart = jest.fn();
      const onEnded = jest.fn();
      const onError = jest.fn();

      jest
        .spyOn(KokoroTTSService, 'getCachedUrl')
        .mockReturnValue('https://cached_greeting.wav');

      const result = await RegiusSpeechService.speakGreeting(
        'Hey! How can I help you?',
        {
          onStart,
          onEnded,
          onError,
        },
      );

      expect(result).toBe(true);
      expect(onStart).toHaveBeenCalledTimes(1);
      expect(onEnded).toHaveBeenCalledTimes(1);
      expect(onError).not.toHaveBeenCalled();
    });
  });

  describe('3. KokoroTTSService Greeting Synthesis & Playback', () => {
    it('plays pre-cached greeting instantly with AudioPlayerService', async () => {
      const voice = VOICES[0];
      const greetingText = 'Hey! How can I help you?';

      // Mock getCachedUrl to return a cached URL
      jest
        .spyOn(KokoroTTSService, 'getCachedUrl')
        .mockReturnValue('https://cached.wav');

      const onStart = jest.fn();
      const onEnded = jest.fn();

      const res = await KokoroTTSService.speakGreetingAndWait(
        greetingText,
        voice,
        1.0,
        { onStart, onEnded },
      );

      expect(res).toBe(true);
      expect(AudioPlayerService.playWithCallbacks).toHaveBeenCalledWith(
        expect.objectContaining({
          url: 'https://cached.wav',
          title: greetingText,
        }),
        expect.any(Object),
        20000,
      );
    });

    it('synthesizes greeting dynamically when not cached', async () => {
      const voice = VOICES[0];
      const greetingText = "I'm listening, what can I do for you?";

      jest.spyOn(KokoroTTSService, 'getCachedUrl').mockReturnValue(null);
      jest
        .spyOn(KokoroTTSService, 'synthesize')
        .mockResolvedValue('https://synthesized.wav');

      const res = await KokoroTTSService.speakGreetingAndWait(
        greetingText,
        voice,
        1.0,
      );

      expect(res).toBe(true);
      expect(KokoroTTSService.synthesize).toHaveBeenCalledWith(
        greetingText,
        voice.kokoroVoiceId,
        1.0,
        false,
      );
      expect(AudioPlayerService.playWithCallbacks).toHaveBeenCalledWith(
        expect.objectContaining({
          url: 'https://synthesized.wav',
          title: greetingText,
        }),
        undefined,
        20000,
      );
    });

    it('falls back to bundled voice asset when dynamic synthesis is unavailable so Sia always speaks', async () => {
      const voice = VOICES[0];
      const greetingText = 'Custom greeting phrase';
      const callbacks = {
        onStart: jest.fn(),
        onEnded: jest.fn(),
      };

      jest.spyOn(KokoroTTSService, 'getCachedUrl').mockReturnValue(null);
      jest.spyOn(KokoroTTSService, 'synthesize').mockResolvedValue(null);

      const res = await KokoroTTSService.speakGreetingAndWait(
        greetingText,
        voice,
        1.0,
        callbacks,
      );

      expect(res).toBe(true);
      expect(AudioPlayerService.playWithCallbacks).toHaveBeenCalledWith(
        expect.objectContaining({
          url: voice.previewUrl,
        }),
        callbacks,
        20000,
      );
    });

    it('handles audio playback failure gracefully without throwing', async () => {
      const voice = VOICES[0];
      const greetingText = 'At your service.';
      const callbacks = {
        onEnded: jest.fn(),
      };

      jest.spyOn(KokoroTTSService, 'getCachedUrl').mockReturnValue(null);
      jest.spyOn(KokoroTTSService, 'synthesize').mockResolvedValue(null);
      (
        AudioPlayerService.playWithCallbacks as jest.Mock
      ).mockImplementationOnce((_track, cbs) => {
        cbs?.onEnded?.();
        return Promise.resolve(false);
      });

      const res = await KokoroTTSService.speakGreetingAndWait(
        greetingText,
        voice,
        1.0,
        callbacks,
      );

      expect(res).toBe(false);
      expect(callbacks.onEnded).toHaveBeenCalled();
    });
  });

  describe('4. Voice State Machine Greeting -> Speaking -> Listening Transition Sequence', () => {
    it('follows the strict wakeWordDetected -> greeting -> speaking -> listening flow', () => {
      const sm = new VoiceStateMachine('idle');
      const sessionId = sm.startNewSession();

      // 1. Wake word detected
      expect(sm.transitionTo('wakeWordDetected', sessionId)).toBe(true);
      expect(sm.getState()).toBe('wakeWordDetected');

      // 2. Greeting phase
      expect(sm.transitionTo('greeting', sessionId)).toBe(true);
      expect(sm.getState()).toBe('greeting');

      // 3. Audio begins playback (speaking)
      expect(sm.transitionTo('speaking', sessionId)).toBe(true);
      expect(sm.getState()).toBe('speaking');

      // 4. Audio completes playback -> transitions into listening for user command
      expect(sm.transitionTo('listening', sessionId)).toBe(true);
      expect(sm.getState()).toBe('listening');

      // 5. User speaks command -> processing
      expect(sm.transitionTo('processing', sessionId)).toBe(true);
      expect(sm.getState()).toBe('processing');

      // 6. Action execution
      expect(sm.transitionTo('executingAction', sessionId)).toBe(true);
      expect(sm.getState()).toBe('executingAction');

      // 7. Success confirmation
      expect(sm.transitionTo('completed', sessionId)).toBe(true);
      expect(sm.getState()).toBe('completed');
    });

    it('rejects stale session transitions during greeting playback', () => {
      const sm = new VoiceStateMachine('idle');
      const session1 = sm.startNewSession();
      sm.transitionTo('wakeWordDetected', session1);
      sm.transitionTo('greeting', session1);

      // Start new session 2 (e.g., user restarted or re-woke)
      const session2 = sm.startNewSession();

      // Session 1 tries to finish speaking
      const result = sm.transitionTo('speaking', session1);
      expect(result).toBe(false);
      expect(sm.getSessionId()).toBe(session2);
    });
  });
});
