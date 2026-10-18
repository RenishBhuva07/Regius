import {
  detectWakeWordInTranscript,
  isWakeWordOnly,
  validateWakePhrase,
  testWakeWordRecognition,
  setActiveWakePhrase,
  getActiveWakePhrase,
} from '../src/Services/WakeWord/WakeWordDetectionEngine';
import { SUPPORTED_WAKE_WORD_PRESETS } from '../src/Services/WakeWord/WakeWordPresets';

describe('Dynamic & Configurable Wake Word Detection Engine', () => {
  beforeEach(() => {
    setActiveWakePhrase('Hey Regius');
  });

  describe('1. Supported Presets Detection', () => {
    it('detects default "Hey Regius" with exact phrase and case variations', () => {
      const res = detectWakeWordInTranscript(
        'hey regius what is my schedule today',
        'Hey Regius',
      );
      expect(res.detected).toBe(true);
      expect(res.matchedPhrase?.toLowerCase()).toContain('regius');
      expect(res.command).toBe('what is my schedule today');
      expect(res.matchType).toBe('exact_phrase');
    });

    it('detects "Hey Aria" when configured', () => {
      setActiveWakePhrase('Hey Aria');
      const res = detectWakeWordInTranscript(
        'Hey Aria add a task to review designs',
        'Hey Aria',
      );
      expect(res.detected).toBe(true);
      expect(res.matchedPhrase?.toLowerCase()).toContain('aria');
      expect(res.command).toBe('add a task to review designs');
      expect(res.wakeWordName).toBe('Aria');
    });

    it('detects "Hello Nova" when configured', () => {
      setActiveWakePhrase('Hello Nova');
      const res = detectWakeWordInTranscript(
        'Hello Nova remind me at 3 PM',
        'Hello Nova',
      );
      expect(res.detected).toBe(true);
      expect(res.matchedPhrase?.toLowerCase()).toContain('nova');
      expect(res.command).toBe('remind me at 3 pm');
      expect(res.wakeWordName).toBe('Nova');
    });

    it('detects "Hey Sia" when configured', () => {
      setActiveWakePhrase('Hey Sia');
      const res = detectWakeWordInTranscript(
        'Hey Sia schedule sprint review tomorrow',
        'Hey Sia',
      );
      expect(res.detected).toBe(true);
      expect(res.matchedPhrase?.toLowerCase()).toContain('sia');
      expect(res.command).toBe('schedule sprint review tomorrow');
      expect(res.wakeWordName).toBe('Sia');
    });

    it('detects "Hey Jarvis" and "Hey Echo"', () => {
      const resJarvis = detectWakeWordInTranscript(
        'Hey Jarvis log my workout',
        'Hey Jarvis',
      );
      expect(resJarvis.detected).toBe(true);
      expect(resJarvis.command).toBe('log my workout');

      const resEcho = detectWakeWordInTranscript(
        'Hey Echo start 25 min timer',
        'Hey Echo',
      );
      expect(resEcho.detected).toBe(true);
      expect(resEcho.command).toBe('start 25 min timer');
    });
  });

  describe('2. STT Phonetic Misrecognition Tolerance', () => {
    it('tolerates common mobile STT misrecognitions of "Hey Regius" (regions, regis, reach us)', () => {
      const testCases = [
        'regions what is the time',
        'hey regis add a task',
        'regeus remind me tonight',
        'reach us create habit',
        'radius schedule meeting',
      ];

      for (const utterance of testCases) {
        const res = detectWakeWordInTranscript(utterance, 'Hey Regius');
        expect(res.detected).toBe(true);
      }
    });

    it('tolerates phonetic STT misrecognitions of "Hey Aria" (arya, area, ariel)', () => {
      const res1 = detectWakeWordInTranscript(
        'arya set a reminder for tomorrow',
        'Hey Aria',
      );
      expect(res1.detected).toBe(true);
      expect(res1.command).toBe('set a reminder for tomorrow');

      const res2 = detectWakeWordInTranscript(
        'hey area check my tasks',
        'Hey Aria',
      );
      expect(res2.detected).toBe(true);
      expect(res2.command).toBe('check my tasks');
    });

    it('tolerates phonetic STT misrecognitions of "Hello Nova" (noah, noba, know the)', () => {
      const res1 = detectWakeWordInTranscript(
        'hey noah log water habit',
        'Hello Nova',
      );
      expect(res1.detected).toBe(true);
      expect(res1.command).toBe('log water habit');
    });

    it('tolerates phonetic STT misrecognitions of "Hey Sia" (siya, see ya, seeya, cia)', () => {
      const res1 = detectWakeWordInTranscript(
        'siya start focus timer',
        'Hey Sia',
      );
      expect(res1.detected).toBe(true);
      expect(res1.command).toBe('start focus timer');

      const res2 = detectWakeWordInTranscript(
        'see ya add task to call dentist',
        'Hey Sia',
      );
      expect(res2.detected).toBe(true);
      expect(res2.command).toBe('add task to call dentist');

      const res3 = detectWakeWordInTranscript(
        'hey seeya play morning briefing',
        'Hey Sia',
      );
      expect(res3.detected).toBe(true);
      expect(res3.command).toBe('play morning briefing');
    });
  });

  describe('3. Dynamic Switching & Non-Interference', () => {
    it('does NOT trigger on old phrase after switching to a new phrase', () => {
      // Configured as "Hey Aria"
      setActiveWakePhrase('Hey Aria');

      // User says "Hey Regius" -> should NOT detect as Aria
      const resRegius = detectWakeWordInTranscript(
        'Hey Regius add a task',
        'Hey Aria',
      );
      expect(resRegius.detected).toBe(false);

      // User says "Hey Aria" -> should detect cleanly
      const resAria = detectWakeWordInTranscript(
        'Hey Aria add a task',
        'Hey Aria',
      );
      expect(resAria.detected).toBe(true);
      expect(resAria.command).toBe('add a task');
    });

    it('updates detection dynamically without requiring restarts', () => {
      // 1. Initial: Nova
      let phrase = 'Hello Nova';
      expect(
        detectWakeWordInTranscript('Hello Nova help me', phrase).detected,
      ).toBe(true);
      expect(
        detectWakeWordInTranscript('Hey Jarvis help me', phrase).detected,
      ).toBe(false);

      // 2. Switch to Jarvis
      phrase = 'Hey Jarvis';
      expect(
        detectWakeWordInTranscript('Hello Nova help me', phrase).detected,
      ).toBe(false);
      expect(
        detectWakeWordInTranscript('Hey Jarvis help me', phrase).detected,
      ).toBe(true);
    });
  });

  describe('4. Custom Wake Phrase Support', () => {
    it('supports custom phrases via dynamic regex and fuzzy distance', () => {
      const customPhrase = 'Hey Luna';
      const res = detectWakeWordInTranscript(
        'Hey Luna start focus session',
        customPhrase,
      );
      expect(res.detected).toBe(true);
      expect(res.command).toBe('start focus session');
      expect(res.wakeWordName).toBe('Luna');
    });
  });

  describe('5. isWakeWordOnly Utterance Detection', () => {
    it('returns true when speech contains only the active wake word', () => {
      expect(isWakeWordOnly('Hey Regius', 'Hey Regius')).toBe(true);
      expect(isWakeWordOnly('Regius.', 'Hey Regius')).toBe(true);
      expect(isWakeWordOnly('Hey Aria', 'Hey Aria')).toBe(true);
      expect(isWakeWordOnly('Hello Nova', 'Hello Nova')).toBe(true);
    });

    it('returns false when speech contains an actual command', () => {
      expect(
        isWakeWordOnly('Hey Regius add task to buy groceries', 'Hey Regius'),
      ).toBe(false);
      expect(isWakeWordOnly('Hey Aria remind me at 8 PM', 'Hey Aria')).toBe(
        false,
      );
      expect(isWakeWordOnly('Hello Nova log my workout', 'Hello Nova')).toBe(
        false,
      );
    });
  });

  describe('6. Validation & Engine Limitation Guardrails', () => {
    it('validates supported presets with high confidence', () => {
      for (const preset of SUPPORTED_WAKE_WORD_PRESETS) {
        const val = validateWakePhrase(preset.phrase);
        expect(val.isValid).toBe(true);
        expect(val.isPreset).toBe(true);
        expect(val.matchedPreset).toBeDefined();
        expect(val.error).toBeUndefined();
      }
    });

    it('rejects empty or single character phrases', () => {
      const valEmpty = validateWakePhrase('');
      expect(valEmpty.isValid).toBe(false);
      expect(valEmpty.error).toBeDefined();

      const valSingle = validateWakePhrase('a');
      expect(valSingle.isValid).toBe(false);
    });

    it('rejects English stop words that would cause continuous false triggers', () => {
      const stopWords = ['the', 'is', 'for', 'in', 'it', 'to'];
      for (const word of stopWords) {
        const val = validateWakePhrase(word);
        expect(val.isValid).toBe(false);
        expect(val.error).toContain('stop-word');
      }
    });

    it('warns on single word custom phrases due to mobile STT characteristics', () => {
      const val = validateWakePhrase('Luna');
      expect(val.isValid).toBe(true);
      expect(val.warning).toContain('Single-word wake phrases');
    });

    it('accepts properly formed 2-word custom phrases', () => {
      const val = validateWakePhrase('Hey Luna');
      expect(val.isValid).toBe(true);
      expect(val.name).toBe('Luna');
      expect(val.warning).toBeUndefined();
    });
  });

  describe('7. Interactive Developer Recognition Tester', () => {
    it('returns comprehensive diagnostic analysis for matched triggers', () => {
      const test = testWakeWordRecognition(
        'hey aria remind me to take vitamins',
        'Hey Aria',
      );
      expect(test.detected).toBe(true);
      expect(test.remainingCommand).toBe('remind me to take vitamins');
      expect(test.analysis).toContain('Matched via');
      expect(test.confidence).toBeGreaterThan(0.7);
    });

    it('returns clear diagnostic analysis for non-matching transcripts', () => {
      const test = testWakeWordRecognition('good morning everyone', 'Hey Aria');
      expect(test.detected).toBe(false);
      expect(test.remainingCommand).toBeUndefined();
      expect(test.analysis).toContain('No wake word match found');
    });
  });
});
