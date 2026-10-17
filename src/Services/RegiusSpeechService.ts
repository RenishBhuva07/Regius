import { AudioPlayerService, AudioPlaybackCallbacks } from './AudioPlayerService';
import { VoiceSettingsService } from './VoiceSettingsService';
import { VOICES, VoiceOption } from '../Screens/Settings/Components/types';
import { KokoroTTSService } from './Kokoro/KokoroTTSService';
import {
  DEFAULT_PREDEFINED_REPLIES,
  WakeWordRepliesService,
} from './Voice/wakeWordReplies';

/**
 * Predefined replies for "Hey Regius".
 */
export const SIRI_WAKE_GREETINGS: string[] = DEFAULT_PREDEFINED_REPLIES.map(
  r => r.reply,
);

/**
 * Returns a configured reply from predefined responses.
 */
export function getRandomWakeGreeting(): string {
  return WakeWordRepliesService.getNextReply('random');
}

/**
 * Service to manage speaking text out loud via the user's default selected Kokoro voice.
 */
export const RegiusSpeechService = {
  /**
   * Retrieves the currently selected voice option from user settings.
   */
  async getActiveVoice(): Promise<{
    voice: VoiceOption;
    speed: number;
    autoSpeak: boolean;
  }> {
    const settings = await VoiceSettingsService.getSettings();
    const voice =
      VOICES.find(v => v.id === settings.selectedVoiceId) || VOICES[0];
    const speed = settings.speechSpeed || 1.0;
    const autoSpeak = settings.autoSpeakReplies ?? true;
    return { voice, speed, autoSpeak };
  },

  /**
   * Warm up / pre-synthesizes wake word greetings for the active voice in the background.
   */
  async warmupVoice(voiceId?: string): Promise<void> {
    try {
      const active = await this.getActiveVoice();
      const targetVoiceId = voiceId || active.voice.kokoroVoiceId;
      const targetSpeed = active.speed;
      const replies = DEFAULT_PREDEFINED_REPLIES.map(r => r.reply);
      // Run prewarm in background non-blocking
      KokoroTTSService.prewarm(replies, targetVoiceId, targetSpeed).catch(() => {});
    } catch {}
  },

  /**
   * Returns an instant pre-warmed greeting if available (0ms instant playback), otherwise random.
   */
  async getFastWakeGreeting(): Promise<string> {
    const active = await this.getActiveVoice();
    const voiceId = active.voice.kokoroVoiceId;
    const speed = active.speed;

    const cachedReplies: string[] = [];
    for (const item of DEFAULT_PREDEFINED_REPLIES) {
      if (KokoroTTSService.isCached(item.reply, voiceId, speed)) {
        cachedReplies.push(item.reply);
      }
    }

    if (cachedReplies.length > 0) {
      const idx = Math.floor(Math.random() * cachedReplies.length);
      return cachedReplies[idx];
    }

    // Trigger background warm up if not yet cached
    this.warmupVoice(voiceId).catch(() => {});
    return getRandomWakeGreeting();
  },

  /**
   * Speaks the wake greeting dynamically with the user's selected Kokoro voice.
   * Runs real-time neural TTS inference and coordinates playback with callbacks.
   */
  async speakGreeting(
    text: string,
    callbacks?: AudioPlaybackCallbacks,
  ): Promise<boolean> {
    return this.speakResponse(text, callbacks);
  },

  /**
   * Speaks any dynamic response or clarification sentence out loud.
   * Coordinates playback lifecycle events with the voice assistant state machine.
   */
  async speakResponse(
    text: string,
    callbacks?: AudioPlaybackCallbacks,
  ): Promise<boolean> {
    try {
      const { voice, speed } = await this.getActiveVoice();
      return await KokoroTTSService.speakAndWait(
        text,
        {
          voiceId: voice.kokoroVoiceId,
          speed,
        },
        callbacks,
      );
    } catch (error) {
      console.warn('[RegiusSpeechService] Kokoro speech playback notice:', error);
      callbacks?.onError?.(error);
      return false;
    }
  },

  /**
   * Speaks arbitrary user text dynamically with Kokoro TTS.
   */
  async speak(text: string, voiceId?: string, speed?: number): Promise<boolean> {
    return await KokoroTTSService.speak(text, { voiceId, speed });
  },

  /**
   * Immediately stops any active speech playback.
   */
  async stop(): Promise<void> {
    try {
      await KokoroTTSService.stop();
      await AudioPlayerService.stop();
    } catch (e) {
      console.warn('[RegiusSpeechService] Error stopping audio:', e);
    }
  },
};
