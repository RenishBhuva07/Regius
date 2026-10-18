export type WakeWordCategory = 'official' | 'community' | 'custom';

export type WakeWordMatchType =
  | 'exact_phrase'
  | 'phonetic_alias'
  | 'fuzzy_levenshtein';

export interface WakeWordPreset {
  id: string;
  name: string;
  phrase: string;
  aliases: string[];
  pattern: RegExp;
  description: string;
  sampleGreeting: string;
  supported: boolean;
  category: WakeWordCategory;
}

export interface WakeWordMatchResult {
  detected: boolean;
  matchedPhrase?: string;
  command?: string;
  matchType?: WakeWordMatchType;
  confidence?: number;
  wakeWordName?: string;
}

export interface WakeWordValidationResult {
  isValid: boolean;
  phrase: string;
  name: string;
  isPreset: boolean;
  matchedPreset?: WakeWordPreset;
  warning?: string;
  error?: string;
  engineLimitations: string[];
}

export interface WakeWordTestResult {
  inputTranscript: string;
  targetPhrase: string;
  detected: boolean;
  matchedPhrase?: string;
  remainingCommand?: string;
  matchType?: WakeWordMatchType;
  confidence?: number;
  analysis: string;
}
