import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  DEFAULT_WAKE_WORD_PHRASE,
  SUPPORTED_WAKE_WORD_PRESETS,
} from './WakeWord/WakeWordPresets';

export interface VoiceSettings {
  selectedVoiceId: string;
  speechSpeed: number;
  autoSpeakReplies: boolean;
  wakeWordEnabled: boolean;
  wakeWordPhrase: string;
  voiceRemindersEnabled: boolean;
}

export const DEFAULT_VOICE_SETTINGS: VoiceSettings = {
  selectedVoiceId: 'af_bella', // Maps to Kokoro af_bella (Bella)
  speechSpeed: 1.0,
  autoSpeakReplies: true,
  wakeWordEnabled: true,
  wakeWordPhrase: DEFAULT_WAKE_WORD_PHRASE,
  voiceRemindersEnabled: true,
};

const STORAGE_KEYS = {
  VOICE_SETTINGS: '@regius_voice_settings',
};

export const VoiceSettingsService = {
  async getSettings(): Promise<VoiceSettings> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.VOICE_SETTINGS);
      if (data) {
        return { ...DEFAULT_VOICE_SETTINGS, ...JSON.parse(data) };
      }
    } catch (error) {
      console.warn('Failed to load voice settings from AsyncStorage:', error);
    }
    return DEFAULT_VOICE_SETTINGS;
  },

  async saveSettings(settings: Partial<VoiceSettings>): Promise<VoiceSettings> {
    try {
      const current = await this.getSettings();
      const updated = { ...current, ...settings };
      await AsyncStorage.setItem(
        STORAGE_KEYS.VOICE_SETTINGS,
        JSON.stringify(updated),
      );
      return updated;
    } catch (error) {
      console.warn('Failed to save voice settings to AsyncStorage:', error);
      return DEFAULT_VOICE_SETTINGS;
    }
  },

  async setSelectedVoice(voiceId: string): Promise<void> {
    await this.saveSettings({ selectedVoiceId: voiceId });
  },

  async setSpeechSpeed(speed: number): Promise<void> {
    await this.saveSettings({ speechSpeed: speed });
  },

  async setAutoSpeakReplies(enabled: boolean): Promise<void> {
    await this.saveSettings({ autoSpeakReplies: enabled });
  },

  async setWakeWordPhrase(phrase: string): Promise<void> {
    await this.saveSettings({ wakeWordPhrase: phrase });
  },

  async getWakeWordPhrase(): Promise<string> {
    const settings = await this.getSettings();
    return settings.wakeWordPhrase || DEFAULT_VOICE_SETTINGS.wakeWordPhrase;
  },

  async getAssistantName(): Promise<string> {
    const phrase = await this.getWakeWordPhrase();
    const preset = SUPPORTED_WAKE_WORD_PRESETS.find(
      p => p.phrase.toLowerCase() === phrase.toLowerCase(),
    );
    return preset?.name || 'Sia';
  },

  // Revert voice settings to defaults in AsyncStorage
  async clearSettings(): Promise<VoiceSettings> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.VOICE_SETTINGS);
    } catch (error) {
      console.warn('Failed to clear voice settings from AsyncStorage:', error);
    }
    return {
      ...DEFAULT_VOICE_SETTINGS,
      wakeWordPhrase: DEFAULT_WAKE_WORD_PHRASE,
    };
  },

  async resetToDefaults(): Promise<VoiceSettings> {
    return this.clearSettings();
  },
};
