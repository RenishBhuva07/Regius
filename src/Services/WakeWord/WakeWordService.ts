import { Platform, PermissionsAndroid } from 'react-native';
import Voice, {
  SpeechResultsEvent,
  SpeechErrorEvent,
} from '@react-native-voice/voice';
import { VoiceSettingsService } from '../VoiceSettingsService';
import {
  WakeWordPreset,
  WakeWordMatchResult,
  WakeWordValidationResult,
  WakeWordTestResult,
  WakeWordMatchType,
} from './WakeWordTypes';
import {
  SUPPORTED_WAKE_WORD_PRESETS,
  DEFAULT_WAKE_WORD_PRESET,
  DEFAULT_WAKE_WORD_ID,
  DEFAULT_WAKE_WORD_PHRASE,
} from './WakeWordPresets';
import {
  detectWakeWordInTranscript,
  isWakeWordOnly,
  validateWakePhrase,
  testWakeWordRecognition,
  formatWakePhrase,
  ENGINE_LIMITATIONS,
} from './WakeWordDetectionEngine';

// Re-exports for consumers
export type {
  WakeWordPreset,
  WakeWordMatchResult,
  WakeWordValidationResult,
  WakeWordTestResult,
  WakeWordMatchType,
};
export {
  SUPPORTED_WAKE_WORD_PRESETS,
  DEFAULT_WAKE_WORD_PRESET,
  DEFAULT_WAKE_WORD_ID,
  DEFAULT_WAKE_WORD_PHRASE,
  detectWakeWordInTranscript,
  isWakeWordOnly,
  validateWakePhrase,
  testWakeWordRecognition,
  formatWakePhrase,
  ENGINE_LIMITATIONS,
};

export type AssistantFlowState =
  | 'idle'
  | 'initializing'
  | 'listening'
  | 'wakeWordDetected'
  | 'generatingSpeech'
  | 'speaking'
  | 'error';

class WakeWordServiceClass {
  private isEnabled: boolean = false;
  private isCapturing: boolean = false;
  private currentState: AssistantFlowState = 'idle';
  private lastTriggerTimestamp: number = 0;
  private readonly cooldownMs: number = 2500; // Guard against multiple triggers
  private currentWakePhrase: string = DEFAULT_WAKE_WORD_PRESET.phrase;

  private onWakeWordDetectedCallback:
    | ((match: WakeWordMatchResult) => void)
    | null = null;
  private onStateChangeCallback: ((state: AssistantFlowState) => void) | null =
    null;
  private onErrorCallback: ((err: string) => void) | null = null;

  constructor() {
    this.setupListeners();
    this.loadSavedConfiguration();
  }

  private async loadSavedConfiguration() {
    try {
      const settings = await VoiceSettingsService.getSettings();
      if (settings.wakeWordPhrase) {
        this.currentWakePhrase = settings.wakeWordPhrase;
      }
    } catch {
      // Use default
    }
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
    if (
      this.currentState === 'speaking' ||
      this.currentState === 'generatingSpeech'
    ) {
      return;
    }

    const now = Date.now();
    if (now - this.lastTriggerTimestamp < this.cooldownMs) {
      return;
    }

    for (const text of results) {
      if (!text) continue;
      const match = detectWakeWordInTranscript(text, this.currentWakePhrase);
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

  public setWakePhrase(phrase: string): void {
    const formatted = formatWakePhrase(phrase);
    this.currentWakePhrase = formatted;
  }

  public getWakePhrase(): string {
    return this.currentWakePhrase;
  }

  public getSupportedPresets(): WakeWordPreset[] {
    return SUPPORTED_WAKE_WORD_PRESETS;
  }

  public validatePhrase(phrase: string): WakeWordValidationResult {
    return validateWakePhrase(phrase);
  }

  public testRecognition(transcript: string): WakeWordTestResult {
    return testWakeWordRecognition(transcript, this.currentWakePhrase);
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
            message: `Regius requires microphone access for hands-free "${this.currentWakePhrase}" wake word detection and voice assistance.`,
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
    if (
      this.currentState === 'speaking' ||
      this.currentState === 'generatingSpeech'
    ) {
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
        this.onErrorCallback(
          e?.message || 'Failed to start microphone listener',
        );
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
