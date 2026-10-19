// Inactivity, silence, and timeout policy for voice assistant
export interface VoiceSessionPolicy {
  inactivityPromptDelayMs: number;
  inactivityGracePeriodMs: number;
  maxUtteranceDurationMs: number;
  speechDebounceDelayMs: number;
  inactivityPromptText: string;
  inactivityFarewellText?: string;
  explicitGoodbyeText: string;
}

export const DEFAULT_VOICE_SESSION_CONFIG: VoiceSessionPolicy = {
  inactivityPromptDelayMs: 10000, // 10 seconds
  inactivityGracePeriodMs: 7000, // 7 seconds
  maxUtteranceDurationMs: 20000, // 20 seconds
  speechDebounceDelayMs: 1400, // 1.4 seconds
  inactivityPromptText: 'Are you still there?',
  inactivityFarewellText: 'Closing for now. Say "Hey Regius" when you need me.',
  explicitGoodbyeText: 'Goodbye! Have a great day.',
};

class VoiceSessionConfigService {
  private config: VoiceSessionPolicy = { ...DEFAULT_VOICE_SESSION_CONFIG };

  public getConfig(): VoiceSessionPolicy {
    return { ...this.config };
  }

  public get inactivityPromptDelayMs(): number {
    return this.config.inactivityPromptDelayMs;
  }

  public get silencePromptDelayMs(): number {
    return this.config.inactivityPromptDelayMs;
  }

  public get inactivityGracePeriodMs(): number {
    return this.config.inactivityGracePeriodMs;
  }

  public get silenceGracePeriodMs(): number {
    return this.config.inactivityGracePeriodMs;
  }

  public get stillTherePrompt(): string {
    return this.config.inactivityPromptText;
  }

  public get idleClosingFarewell(): string {
    return this.config.inactivityFarewellText || '';
  }

  public get explicitGoodbyeText(): string {
    return this.config.explicitGoodbyeText;
  }

  public updateConfig(partial: Partial<VoiceSessionPolicy>): void {
    this.config = { ...this.config, ...partial };
  }

  public resetToDefaults(): void {
    this.config = { ...DEFAULT_VOICE_SESSION_CONFIG };
  }
}

export const VoiceSessionConfig = new VoiceSessionConfigService();
