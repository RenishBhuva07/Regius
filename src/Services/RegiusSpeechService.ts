import {
  AudioPlayerService,
  AudioPlaybackCallbacks,
} from './AudioPlayerService';
import { VoiceSettingsService } from './VoiceSettingsService';
import { VOICES, VoiceOption } from '../Screens/Settings/Components/types';
import { KokoroTTSService } from './Kokoro/KokoroTTSService';
import {
  DEFAULT_PREDEFINED_REPLIES,
  WakeWordRepliesService,
} from './Voice/wakeWordReplies';

// Predefined wake replies
export const SIRI_WAKE_GREETINGS: string[] = DEFAULT_PREDEFINED_REPLIES.map(
  r => r.reply,
);

// Get configured reply from presets
export function getRandomWakeGreeting(assistantName?: string): string {
  return WakeWordRepliesService.getNextReply('random', assistantName);
}

// Speaks text aloud using selected Kokoro voice
export const RegiusSpeechService = {
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

  // Pre-warm greetings in background
  async warmupVoice(voiceId?: string, assistantName?: string): Promise<void> {
    try {
      const active = await this.getActiveVoice();
      const targetVoiceId = voiceId || active.voice.kokoroVoiceId;
      const targetSpeed = active.speed;
      const allReplies = WakeWordRepliesService.getAllReplies().map(r => {
        if (assistantName && assistantName.toLowerCase() !== 'regius') {
          return r.reply.replace(/\bRegius\b/gi, assistantName);
        }
        return r.reply;
      });
      KokoroTTSService.prewarm(allReplies, targetVoiceId, targetSpeed).catch(
        () => {},
      );
    } catch {}
  },

  // Get pre-cached greeting if available, else random
  async getFastWakeGreeting(assistantName?: string): Promise<string> {
    const active = await this.getActiveVoice();
    const voiceId = active.voice.kokoroVoiceId;
    const speed = active.speed;

    const allReplies = WakeWordRepliesService.getAllReplies().map(r => {
      if (assistantName && assistantName.toLowerCase() !== 'regius') {
        return r.reply.replace(/\bRegius\b/gi, assistantName);
      }
      return r.reply;
    });

    const cachedReplies: string[] = allReplies.filter(reply =>
      KokoroTTSService.isCached(reply, voiceId, speed),
    );

    if (cachedReplies.length > 0) {
      const idx = Math.floor(Math.random() * cachedReplies.length);
      return cachedReplies[idx];
    }

    // Trigger background warm up if not yet cached
    this.warmupVoice(voiceId, assistantName).catch(() => {});
    return getRandomWakeGreeting(assistantName);
  },

  // Speak wake greeting dynamically
  async speakGreeting(
    text: string,
    callbacks?: AudioPlaybackCallbacks,
  ): Promise<boolean> {
    try {
      const { voice, speed } = await this.getActiveVoice();
      return await KokoroTTSService.speakGreetingAndWait(
        text,
        voice,
        speed,
        callbacks,
      );
    } catch (error) {
      console.warn(
        '[RegiusSpeechService] Kokoro greeting speech playback notice:',
        error,
      );
      callbacks?.onError?.(error);
      return false;
    }
  },

  // Speak response or clarification text
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
      console.warn(
        '[RegiusSpeechService] Kokoro speech playback notice:',
        error,
      );
      callbacks?.onError?.(error);
      return false;
    }
  },

  async speak(
    text: string,
    voiceId?: string,
    speed?: number,
  ): Promise<boolean> {
    return await KokoroTTSService.speak(text, { voiceId, speed });
  },

  async stop(): Promise<void> {
    try {
      await KokoroTTSService.stop();
      await AudioPlayerService.stop();
    } catch (e) {
      console.warn('[RegiusSpeechService] Error stopping audio:', e);
    }
  },
};
