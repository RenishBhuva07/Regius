import { Platform, PermissionsAndroid } from 'react-native';
import Voice, {
  SpeechResultsEvent,
  SpeechErrorEvent,
} from '@react-native-voice/voice';

export type AssistantFlowState =
  | 'idle'
  | 'initializing'
  | 'listening'
  | 'wakeWordDetected'
  | 'generatingSpeech'
  | 'speaking'
  | 'error';

export interface WakeWordMatchResult {
  detected: boolean;
  matchedPhrase?: string;
  command?: string;
}

// Regex patterns for phonetic variants and STT misrecognitions of "Hey Regius"
const WAKE_WORD_PATTERNS = [
  /\b(?:hey|hay|hi|hello|ok|okay|ay|he)?\s*(?:regius|regis|regions|regeus|rejius|regus|rejus|reach\s+us|read\s+just|ready\s+us|radius|religious|rage\s+us|raygeus|radios|radious|rijus|regias|regios)\b/i,
];

function cleanPunctuation(text: string): string {
  return text
    .toLowerCase()
    .replace(/[.,/#!$%^&*;:{}=\-_`~()?]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function levenshtein(a: string, b: string): number {
  const an = a ? a.length : 0;
  const bn = b ? b.length : 0;
  if (an === 0) return bn;
  if (bn === 0) return an;
  const matrix: number[][] = Array.from({ length: bn + 1 }, (_, i) => [i]);
  for (let j = 0; j <= an; j++) matrix[0][j] = j;

  for (let i = 1; i <= bn; i++) {
    for (let j = 1; j <= an; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1,
        );
      }
    }
  }
  return matrix[bn][an];
}

export function detectWakeWordInTranscript(transcript: string): WakeWordMatchResult {
  const normalized = cleanPunctuation(transcript);

  // 1. Direct regex match
  for (const pattern of WAKE_WORD_PATTERNS) {
    const match = normalized.match(pattern);
    if (match) {
      const command = normalized.replace(pattern, '').trim();
      return { detected: true, matchedPhrase: match[0], command };
    }
  }

  // 2. Token-level fuzzy phonetic match
  const tokens = normalized.split(/\s+/);
  for (let i = 0; i < tokens.length; i++) {
    const word = tokens[i];
    if (levenshtein(word, 'regius') <= 2 || levenshtein(word, 'regis') <= 1) {
      const prevWord = i > 0 ? tokens[i - 1] : '';
      const isGreeting = ['hey', 'hay', 'hi', 'hello', 'ok', 'okay', 'ay', 'he'].includes(prevWord);
      const commandTokens = [...tokens];
      if (isGreeting) {
        commandTokens.splice(i - 1, 2);
      } else {
        commandTokens.splice(i, 1);
      }
      return {
        detected: true,
        matchedPhrase: isGreeting ? `${prevWord} ${word}` : word,
        command: commandTokens.join(' ').trim(),
      };
    }
  }

  return { detected: false };
}

class WakeWordServiceClass {
  private isEnabled: boolean = false;
  private isCapturing: boolean = false;
  private currentState: AssistantFlowState = 'idle';
  private lastTriggerTimestamp: number = 0;
  private readonly cooldownMs: number = 2500; // Guard against multiple triggers

  private onWakeWordDetectedCallback: ((match: WakeWordMatchResult) => void) | null = null;
  private onStateChangeCallback: ((state: AssistantFlowState) => void) | null = null;
  private onErrorCallback: ((err: string) => void) | null = null;

  constructor() {
    this.setupListeners();
  }

  private setupListeners() {
    Voice.onSpeechStart = () => {
      this.isCapturing = true;
    };

    Voice.onSpeechPartialResults = (e: SpeechResultsEvent) => {
      this.handleResults(e.value || []);
    };

    Voice.onSpeechResults = (e: SpeechResultsEvent) => {
      this.handleResults(e.value || []);
    };

    Voice.onSpeechError = (_e: SpeechErrorEvent) => {
      // Auto-recover and restart listening if enabled and in listening state
      if (this.isEnabled && this.currentState === 'listening') {
        setTimeout(() => {
          if (this.isEnabled && this.currentState === 'listening') {
            this.startListening();
          }
        }, 350);
      }
    };

    Voice.onSpeechEnd = () => {
      this.isCapturing = false;
      // Loop listening while enabled and in listening state
      if (this.isEnabled && this.currentState === 'listening') {
        setTimeout(() => {
          if (this.isEnabled && this.currentState === 'listening') {
            this.startListening();
          }
        }, 200);
      }
    };
  }

  private handleResults(results: string[]) {
    // If speaking or generating speech, mute/ignore input
    if (this.currentState === 'speaking' || this.currentState === 'generatingSpeech') {
      return;
    }

    const now = Date.now();
    if (now - this.lastTriggerTimestamp < this.cooldownMs) {
      return;
    }

    for (const text of results) {
      if (!text) continue;
      const match = detectWakeWordInTranscript(text);
      if (match.detected) {
        this.lastTriggerTimestamp = now;
        this.setState('wakeWordDetected');
        if (this.onWakeWordDetectedCallback) {
          this.onWakeWordDetectedCallback(match);
        }
        break;
      }
    }
  }

  public setState(state: AssistantFlowState) {
    this.currentState = state;
    if (this.onStateChangeCallback) {
      this.onStateChangeCallback(state);
    }
  }

  public getState(): AssistantFlowState {
    return this.currentState;
  }

  public async requestMicrophonePermission(): Promise<boolean> {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          {
            title: 'Microphone Permission',
            message:
              'Regius requires microphone access for hands-free "Hey Regius" wake word detection and voice assistance.',
            buttonPositive: 'Allow',
            buttonNegative: 'Deny',
          },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn('[WakeWordService] Permission request failed:', err);
        return false;
      }
    }
    // iOS permissions are handled via Info.plist and system prompt on first Voice.start()
    return true;
  }

  public async startListening(): Promise<boolean> {
    if (!this.isEnabled) return false;
    if (this.currentState === 'speaking' || this.currentState === 'generatingSpeech') {
      return false;
    }

    try {
      await Voice.stop();
      await Voice.start('en-US');
      this.isCapturing = true;
      this.setState('listening');
      return true;
    } catch (e: any) {
      console.warn('[WakeWordService] Error starting Voice engine:', e);
      if (this.onErrorCallback) {
        this.onErrorCallback(e?.message || 'Failed to start microphone listener');
      }
      return false;
    }
  }

  public async pauseListening(): Promise<void> {
    try {
      this.isCapturing = false;
      await Voice.stop();
    } catch {
      // Ignore
    }
  }

  public async stopListening(): Promise<void> {
    this.isEnabled = false;
    this.isCapturing = false;
    this.setState('idle');
    try {
      await Voice.stop();
      await Voice.destroy();
    } catch {
      // Ignore
    }
  }

  public setEnabled(enabled: boolean) {
    this.isEnabled = enabled;
    if (enabled) {
      this.startListening();
    } else {
      this.stopListening();
    }
  }

  public getIsEnabled(): boolean {
    return this.isEnabled;
  }

  public onWakeWordDetected(cb: (match: WakeWordMatchResult) => void) {
    this.onWakeWordDetectedCallback = cb;
  }

  public onStateChange(cb: (state: AssistantFlowState) => void) {
    this.onStateChangeCallback = cb;
  }

  public onError(cb: (err: string) => void) {
    this.onErrorCallback = cb;
  }

  public async destroy() {
    await this.stopListening();
    this.onWakeWordDetectedCallback = null;
    this.onStateChangeCallback = null;
    this.onErrorCallback = null;
  }
}

export const WakeWordService = new WakeWordServiceClass();
