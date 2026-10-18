/**
 * Configurable inactivity, silence, and timeout policy for Regius Voice Assistant.
 * Controls when the assistant prompts "Are you still there?" and when it closes gracefully.
 */

export interface VoiceSessionPolicy {
  /** Silence duration before prompting "Are you still there?" (Default: 10,000ms = 10s) */
  inactivityPromptDelayMs: number;
  /** Silence duration after prompt before gracefully closing the session (Default: 7,000ms = 7s) */
  inactivityGracePeriodMs: number;
  /** Maximum continuous utterance duration guard against background noise (Default: 20,000ms = 20s) */
  maxUtteranceDurationMs: number;
  /** Debounce delay after user stops speaking to finalize the utterance (Default: 1,400ms = 1.4s) */
  speechDebounceDelayMs: number;
  /** Prompt spoken when user has been silent during active listening */
  inactivityPromptText: string;
  /** Farewell text spoken when the session terminates due to inactivity */
  inactivityFarewellText?: string;
  /** Farewell text spoken when user explicitly says "Goodbye" or "That's all" */
  explicitGoodbyeText: string;
}

export const DEFAULT_VOICE_SESSION_CONFIG: VoiceSessionPolicy = {
  inactivityPromptDelayMs: 10000, // 10 seconds
  inactivityGracePeriodMs: 7000,  // 7 seconds
  maxUtteranceDurationMs: 20000,  // 20 seconds
  speechDebounceDelayMs: 1400,    // 1.4 seconds
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
