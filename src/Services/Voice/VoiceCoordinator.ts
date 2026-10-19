import { KokoroTTSService } from '../Kokoro/KokoroTTSService';
import {
  WakeWordService,
  AssistantFlowState,
} from '../WakeWord/WakeWordService';
import { WakeWordRepliesService } from './wakeWordReplies';
import { VoiceSettingsService } from '../VoiceSettingsService';
import { VOICES } from '../../Screens/Settings/Components/types';

export interface CoordinatorEventHandlers {
  onStateChange?: (state: AssistantFlowState) => void;
  onReplyStarted?: (replyText: string, voiceName: string) => void;
  onReplyFinished?: () => void;
  onError?: (err: string) => void;
}

class VoiceCoordinatorClass {
  private handlers: CoordinatorEventHandlers = {};
  private isProcessingWakeWord: boolean = false;

  constructor() {
    this.setupWakeWordBinding();
  }

  private setupWakeWordBinding() {
    WakeWordService.onWakeWordDetected(async match => {
      await this.handleWakeWordTrigger(match.command);
    });

    WakeWordService.onStateChange(state => {
      if (this.handlers.onStateChange) {
        this.handlers.onStateChange(state);
      }
    });

    WakeWordService.onError(err => {
      if (this.handlers.onError) {
        this.handlers.onError(err);
      }
    });
  }

  public setHandlers(handlers: CoordinatorEventHandlers) {
    this.handlers = { ...this.handlers, ...handlers };
  }

  // Handles wake word detection flow
  public async handleWakeWordTrigger(_pendingCommand?: string): Promise<void> {
    if (this.isProcessingWakeWord) return;
    this.isProcessingWakeWord = true;

    try {
      // 1. Immediately pause microphone capture to prevent Regius from hearing itself
      await WakeWordService.pauseListening();
      WakeWordService.setState('wakeWordDetected');

      // 2. Select predefined reply
      const replyText = WakeWordRepliesService.getNextReply('random');

      // 3. Retrieve user's configured Kokoro voice & speed
      const settings = await VoiceSettingsService.getSettings();
      const voiceOption =
        VOICES.find(v => v.id === settings.selectedVoiceId) || VOICES[0];
      const speed = settings.speechSpeed || 1.0;

      if (this.handlers.onReplyStarted) {
        this.handlers.onReplyStarted(replyText, voiceOption.name);
      }

      // 4. Generate dynamic speech using Kokoro
      WakeWordService.setState('generatingSpeech');
      const audioUri = await KokoroTTSService.synthesize(
        replyText,
        voiceOption.kokoroVoiceId,
        speed,
      );

      // 5. Play synthesized audio and wait for completion
      WakeWordService.setState('speaking');

      if (audioUri) {
        await KokoroTTSService.speakAndWait(replyText, {
          voiceId: voiceOption.kokoroVoiceId,
          speed,
        });
      }

      if (this.handlers.onReplyFinished) {
        this.handlers.onReplyFinished();
      }

      // 6. Resume wake word listening safely if still enabled
      WakeWordService.setState('idle');
      if (WakeWordService.getIsEnabled()) {
        setTimeout(async () => {
          if (WakeWordService.getIsEnabled()) {
            await WakeWordService.startListening();
          }
        }, 300);
      }
    } catch (err: any) {
      console.warn('[VoiceCoordinator] Error handling wake word trigger:', err);
      WakeWordService.setState('error');
      if (this.handlers.onError) {
        this.handlers.onError(
          err?.message || 'Error executing wake-word reply',
        );
      }
    } finally {
      this.isProcessingWakeWord = false;
    }
  }

  // Speaks text with Kokoro, muting mic during playback
  public async speakText(
    text: string,
    voiceId?: string,
    speed?: number,
  ): Promise<boolean> {
    const wasListening = WakeWordService.getIsEnabled();
    if (wasListening) {
      await WakeWordService.pauseListening();
    }

    WakeWordService.setState('generatingSpeech');
    try {
      const success = await KokoroTTSService.speak(text, { voiceId, speed });
      WakeWordService.setState('speaking');
      return success;
    } catch {
      WakeWordService.setState('error');
      return false;
    }
  }

  // Stops active speech immediately
  public async stop(): Promise<void> {
    await KokoroTTSService.stop();
    WakeWordService.setState('idle');
    if (WakeWordService.getIsEnabled()) {
      await WakeWordService.startListening();
    }
  }
}

export const VoiceCoordinator = new VoiceCoordinatorClass();
