import { WakeWordPreset } from './WakeWordTypes';

export const SUPPORTED_WAKE_WORD_PRESETS: WakeWordPreset[] = [
  {
    id: 'hey_regius',
    name: 'Regius',
    phrase: 'Hey Regius',
    aliases: [
      'regius',
      'regis',
      'regions',
      'regeus',
      'rejius',
      'regus',
      'rejus',
      'reach us',
      'read just',
      'ready us',
      'radius',
      'religious',
      'rage us',
      'raygeus',
      'radios',
      'radious',
      'rijus',
      'regias',
      'regios',
    ],
    pattern:
      /\b(?:hey|hay|hi|hello|ok|okay|ay|he)?\s*(?:regius|regis|regions|regeus|rejius|regus|rejus|reach\s+us|read\s+just|ready\s+us|radius|religious|rage\s+us|raygeus|radios|radious|rijus|regias|regios)\b/i,
    description:
      'Default voice identity with extensive phonetic STT misrecognition tuning.',
    sampleGreeting: 'Hey there! Regius here, ready when you are.',
    supported: true,
    category: 'official',
  },
  {
    id: 'hey_aria',
    name: 'Aria',
    phrase: 'Hey Aria',
    aliases: [
      'aria',
      'arya',
      'area',
      'ariel',
      'auria',
      'ariyah',
      'oriya',
      'raya',
    ],
    pattern:
      /\b(?:hey|hay|hi|hello|ok|okay|ay|he)?\s*(?:aria|arya|area|ariel|auria|ariyah|oriya|raya)\b/i,
    description: 'Smooth, modern conversational assistant wake phrase.',
    sampleGreeting: 'Hey there! Aria here. What can I do for you?',
    supported: true,
    category: 'official',
  },
  {
    id: 'hello_nova',
    name: 'Nova',
    phrase: 'Hello Nova',
    aliases: ['nova', 'noah', 'noba', 'novah', 'know the'],
    pattern:
      /\b(?:hey|hay|hi|hello|ok|okay|ay|he)?\s*(?:nova|noah|noba|novah|know\s+the)\b/i,
    description: 'Energetic and crisp wake phrase suitable for quick captures.',
    sampleGreeting: "Hello! Nova listening. What's on your mind?",
    supported: true,
    category: 'official',
  },
  {
    id: 'hey_jarvis',
    name: 'Jarvis',
    phrase: 'Hey Jarvis',
    aliases: ['jarvis', 'jarves', 'jarbus', 'travis', 'service', 'jervis'],
    pattern:
      /\b(?:hey|hay|hi|hello|ok|okay|ay|he)?\s*(?:jarvis|jarves|jarbus|travis|service|jervis)\b/i,
    description: 'Classic executive assistant wake phrase.',
    sampleGreeting: 'At your service. What would you like to achieve today?',
    supported: true,
    category: 'official',
  },
  {
    id: 'hey_echo',
    name: 'Echo',
    phrase: 'Hey Echo',
    aliases: ['echo', 'ekho', 'eko', 'ico', 'ecko'],
    pattern:
      /\b(?:hey|hay|hi|hello|ok|okay|ay|he)?\s*(?:echo|ekho|eko|ico|ecko)\b/i,
    description: 'Short acoustic resonant wake word.',
    sampleGreeting: 'Echo ready. Go ahead with your command.',
    supported: true,
    category: 'official',
  },
  {
    id: 'hey_sia',
    name: 'Sia',
    phrase: 'Hey Sia',
    aliases: [
      'sia',
      'siya',
      'siri',
      'sierra',
      'see ya',
      'seeya',
      'cia',
      'ceea',
      'ceeya',
      'shia',
      'theia',
      'cyan',
      'syra',
      'cera',
      'seri',
      'seera',
      'saya',
      'shya',
      'cira',
      'sera',
    ],
    pattern:
      /\b(?:hey|hay|hi|hello|ok|okay|ay|he)?\s*(?:sia|siya|siri|sierra|see\s+ya|seeya|ceea|ceeya|cia|shia|cyan|syra|cera|seri|seera|saya|shya|cira|sera)\b/i,
    description:
      'Crisp, minimalist assistant wake phrase with STT phonetic tuning.',
    sampleGreeting: 'Hey there! Sia here, how can I help you today?',
    supported: true,
    category: 'official',
  },
];

/**
 * 🌟 SINGLE SOURCE OF TRUTH:
 * Change this one key ID to switch the app-wide default wake word.
 * Options: 'hey_regius' | 'hey_sia' | 'hey_aria' | 'hello_nova' | 'hey_jarvis' | 'hey_echo'
 */
export type SupportedWakeWordId =
  | 'hey_regius'
  | 'hey_sia'
  | 'hey_aria'
  | 'hello_nova'
  | 'hey_jarvis'
  | 'hey_echo';

export const DEFAULT_WAKE_WORD_ID: SupportedWakeWordId = 'hey_sia';

export const DEFAULT_WAKE_WORD_PRESET: WakeWordPreset =
  SUPPORTED_WAKE_WORD_PRESETS.find(p => p.id === DEFAULT_WAKE_WORD_ID) ??
  SUPPORTED_WAKE_WORD_PRESETS[0];

export const DEFAULT_WAKE_WORD_PHRASE: string = DEFAULT_WAKE_WORD_PRESET.phrase;
