import AsyncStorage from '@react-native-async-storage/async-storage';

export interface VoiceSettings {
  selectedVoiceId: string;
  speechSpeed: number;
  autoSpeakReplies: boolean;
  wakeWordEnabled: boolean;
}

export const DEFAULT_VOICE_SETTINGS: VoiceSettings = {
  selectedVoiceId: 'af_bella', // Maps to Kokoro af_bella (Bella)
  speechSpeed: 1.0,
  autoSpeakReplies: true,
  wakeWordEnabled: true,
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
};
