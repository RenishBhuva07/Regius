import {
  WakeWordPreset,
  WakeWordMatchResult,
  WakeWordValidationResult,
  WakeWordTestResult,
} from './WakeWordTypes';
import {
  SUPPORTED_WAKE_WORD_PRESETS,
  DEFAULT_WAKE_WORD_PRESET,
} from './WakeWordPresets';

/**
 * ENGINE-SPECIFIC ARCHITECTURAL CHARACTERISTICS & LIMITATIONS:
 *
 * 1. Architecture: Regius utilizes mobile OS Speech-to-Text streaming transcription
 *    via `@react-native-voice/voice` (Apple Speech framework on iOS, Google SpeechRecognizer on Android).
 *
 * 2. Distinction from Acoustic Keyword Spotters:
 *    Unlike hardware/DSP-based keyword engines (such as Picovoice Porcupine, Snowboy, or custom
 *    TensorFlow Lite acoustic models) which operate directly on raw audio MFCC spectrogram frames
 *    at low power, this engine parses intermediate and final textual transcriptions output by the OS STT.
 *
 * 3. STT Vocabulary & Phonetic Misrecognitions:
 *    Because the OS STT engine transcribes speech into words from its general dictionary, names that
 *    are uncommon or invented (e.g. "Regius") are frequently transcribed as phonetic approximations
 *    (such as "regis", "regions", "reach us", "radius"). The supported presets in `SUPPORTED_WAKE_WORD_PRESETS`
 *    have custom-tuned phonetic aliases and regex patterns to bridge this STT limitation.
 *
 * 4. Custom Phrases Limitation:
 *    Arbitrary custom phrases do NOT have pre-trained phonetic STT misrecognition maps. While the engine
 *    applies dynamic fuzzy Levenshtein and prefix tokenization, recognition reliability on custom words
 *    depends heavily on whether the device's OS speech recognizer transcribes the syllables accurately.
 */
export const ENGINE_LIMITATIONS = [
  'Engine Type: OS Speech-to-Text Transcript Matcher (@react-native-voice/voice).',
  'Presets ("Hey Regius", "Hey Aria", "Hello Nova", "Hey Jarvis", "Hey Echo") include fine-tuned phonetic and acoustic misrecognition mappings.',
  'Arbitrary custom phrases use dynamic fuzzy token matching; uncommon words or single-syllable phrases may have reduced recognition accuracy.',
  'Best accuracy requires a 2-word phrase starting with a prefix particle ("Hey", "Hello", "Hi", "OK") followed by a 2+ syllable name.',
];

const GREETING_PARTICLES = [
  'hey',
  'hay',
  'hi',
  'hello',
  'ok',
  'okay',
  'ay',
  'he',
];

let currentActiveWakePhrase: string = DEFAULT_WAKE_WORD_PRESET.phrase;

export function getActiveWakePhrase(): string {
  return currentActiveWakePhrase;
}

export function setActiveWakePhrase(phrase: string): void {
  currentActiveWakePhrase = formatWakePhrase(phrase);
}

export function cleanPunctuation(text: string): string {
  if (!text) return '';
  return text
    .toLowerCase()
    .replace(/[.,/#!$%^&*;:{}=\-_`~()?]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function levenshtein(a: string, b: string): number {
  const an = a ? a.length : 0;
  const bn = b ? b.length : 0;
  if (an === 0) return bn;
  if (bn === 0) return an;
  const matrix: number[][] = Array.from({ length: bn + 1 }, (_, i) => [i]);
  for (let j = 0; j <= an; j++) matrix[0][j] = j;

  for (let i = 1; i <= bn; i++) {
    for (let j = 1; j <= an; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1,
        );
      }
    }
  }
  return matrix[bn][an];
}

/**
 * Finds a matching preset by ID, name, or phrase (case-insensitive).
 */
export function findPreset(phraseOrName: string): WakeWordPreset | undefined {
  if (!phraseOrName) return undefined;
  const clean = cleanPunctuation(phraseOrName);
  return SUPPORTED_WAKE_WORD_PRESETS.find(preset => {
    if (preset.id.toLowerCase() === clean) return true;
    if (cleanPunctuation(preset.name) === clean) return true;
    if (cleanPunctuation(preset.phrase) === clean) return true;
    // Check if phrase includes the preset name (e.g. "hey aria" -> "aria")
    const words = clean.split(' ');
    if (words.includes(cleanPunctuation(preset.name))) return true;
    return false;
  });
}

/**
 * Extracts the assistant's name from any wake phrase (e.g. "Hey Aria" -> "Aria").
 */
export function extractNameFromPhrase(phrase: string): string {
  const preset = findPreset(phrase);
  if (preset) return preset.name;

  const clean = cleanPunctuation(phrase);
  const words = clean.split(' ').filter(Boolean);
  if (words.length === 0) return 'Assistant';

  // If first word is a greeting particle like "hey", take the subsequent words
  if (words.length > 1 && GREETING_PARTICLES.includes(words[0])) {
    const namePart = words.slice(1).join(' ');
    return namePart.charAt(0).toUpperCase() + namePart.slice(1);
  }

  // Capitalize first letter of phrase
  return clean.charAt(0).toUpperCase() + clean.slice(1);
}

/**
 * Normalizes wake phrase to standard format (e.g. "hey aria" -> "Hey Aria").
 */
export function formatWakePhrase(phrase: string): string {
  const preset = findPreset(phrase);
  if (preset) return preset.phrase;

  return phrase
    .trim()
    .split(/\s+/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

/**
 * Builds dynamic regex for an arbitrary custom phrase.
 */
function buildCustomRegex(phrase: string): RegExp {
  const clean = cleanPunctuation(phrase);
  const words = clean.split(' ').filter(Boolean);
  const escapedWords = words.map(w => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));

  if (escapedWords.length > 1 && GREETING_PARTICLES.includes(escapedWords[0])) {
    const greeting = escapedWords[0];
    const rest = escapedWords.slice(1).join('\\s+');
    return new RegExp(
      `\\b(?:${greeting}|hey|hay|hi|hello|ok|okay)?\\s*${rest}\\b`,
      'i',
    );
  }

  const joined = escapedWords.join('\\s+');
  return new RegExp(`\\b(?:hey|hay|hi|hello|ok|okay)?\\s*${joined}\\b`, 'i');
}

/**
 * Detects whether the wake word is present in a transcript.
 */
export function detectWakeWordInTranscript(
  transcript: string,
  activePhrase: string = DEFAULT_WAKE_WORD_PRESET.phrase,
): WakeWordMatchResult {
  if (!transcript || !transcript.trim()) {
    return { detected: false };
  }

  const normalized = cleanPunctuation(transcript);
  if (!normalized) return { detected: false };

  const preset = findPreset(activePhrase);

  if (preset) {
    // 1. Direct Regex Match with Preset's tuned pattern
    const match = normalized.match(preset.pattern);
    if (match) {
      const command = normalized.replace(preset.pattern, '').trim();
      return {
        detected: true,
        matchedPhrase: match[0],
        command,
        matchType: 'exact_phrase',
        confidence: 1.0,
        wakeWordName: preset.name,
      };
    }

    // 2. Token-level match against phonetic aliases
    const tokens = normalized.split(/\s+/);
    const presetNameLower = preset.name.toLowerCase();

    for (let i = 0; i < tokens.length; i++) {
      const word = tokens[i];

      // Exact match with one of the phonetic aliases
      const isAliasMatch = preset.aliases.includes(word);
      // Or close fuzzy distance to main name
      const distanceToName = levenshtein(word, presetNameLower);
      const isFuzzyMatch =
        distanceToName <= (presetNameLower.length > 4 ? 2 : 1);

      if (isAliasMatch || isFuzzyMatch) {
        const prevWord = i > 0 ? tokens[i - 1] : '';
        const isGreeting = GREETING_PARTICLES.includes(prevWord);
        const commandTokens = [...tokens];
        if (isGreeting) {
          commandTokens.splice(i - 1, 2);
        } else {
          commandTokens.splice(i, 1);
        }

        return {
          detected: true,
          matchedPhrase: isGreeting ? `${prevWord} ${word}` : word,
          command: commandTokens.join(' ').trim(),
          matchType: isAliasMatch ? 'phonetic_alias' : 'fuzzy_levenshtein',
          confidence: isAliasMatch ? 0.92 : 0.78,
          wakeWordName: preset.name,
        };
      }
    }

    return { detected: false };
  }

  // --- Dynamic Custom Wake Phrase Matching ---
  const customRegex = buildCustomRegex(activePhrase);
  const regexMatch = normalized.match(customRegex);
  if (regexMatch) {
    const command = normalized.replace(customRegex, '').trim();
    return {
      detected: true,
      matchedPhrase: regexMatch[0],
      command,
      matchType: 'exact_phrase',
      confidence: 0.95,
      wakeWordName: extractNameFromPhrase(activePhrase),
    };
  }

  // Fuzzy token matching on custom keywords
  const customClean = cleanPunctuation(activePhrase);
  const customWords = customClean
    .split(' ')
    .filter(w => !GREETING_PARTICLES.includes(w));
  const mainCustomKeyword = customWords[customWords.length - 1] || customClean;

  if (mainCustomKeyword && mainCustomKeyword.length >= 3) {
    const tokens = normalized.split(/\s+/);
    for (let i = 0; i < tokens.length; i++) {
      const word = tokens[i];
      const dist = levenshtein(word, mainCustomKeyword);
      const threshold = mainCustomKeyword.length >= 6 ? 2 : 1;
      if (dist <= threshold) {
        const prevWord = i > 0 ? tokens[i - 1] : '';
        const isGreeting = GREETING_PARTICLES.includes(prevWord);
        const commandTokens = [...tokens];
        if (isGreeting) {
          commandTokens.splice(i - 1, 2);
        } else {
          commandTokens.splice(i, 1);
        }

        return {
          detected: true,
          matchedPhrase: isGreeting ? `${prevWord} ${word}` : word,
          command: commandTokens.join(' ').trim(),
          matchType: 'fuzzy_levenshtein',
          confidence: 0.75,
          wakeWordName: extractNameFromPhrase(activePhrase),
        };
      }
    }
  }

  return { detected: false };
}

/**
 * Checks if the utterance contains only the wake word without a command.
 */
export function isWakeWordOnly(
  transcript: string,
  activePhrase: string = DEFAULT_WAKE_WORD_PRESET.phrase,
): boolean {
  const norm = cleanPunctuation(transcript);
  if (!norm) return true;

  const result = detectWakeWordInTranscript(norm, activePhrase);
  if (result.detected) {
    return !result.command || result.command.trim().length === 0;
  }

  // If text is extremely short and matches any alias of active preset
  const preset = findPreset(activePhrase);
  if (preset) {
    const tokens = norm.split(/\s+/);
    if (tokens.length <= 2) {
      for (const t of tokens) {
        if (
          preset.aliases.includes(t) ||
          levenshtein(t, preset.name.toLowerCase()) <= 1
        ) {
          return true;
        }
      }
    }
  }

  return false;
}

/**
 * Validates a wake phrase and provides detailed engine compatibility feedback.
 */
export function validateWakePhrase(phrase: string): WakeWordValidationResult {
  const trimmed = (phrase || '').trim();
  const clean = cleanPunctuation(trimmed);

  if (!clean || clean.length < 2) {
    return {
      isValid: false,
      phrase: trimmed,
      name: '',
      isPreset: false,
      error: 'Wake phrase cannot be empty or fewer than 2 characters.',
      engineLimitations: ENGINE_LIMITATIONS,
    };
  }

  const commonStopWords = [
    'the',
    'is',
    'a',
    'an',
    'at',
    'in',
    'on',
    'it',
    'to',
    'for',
    'of',
    'and',
  ];
  if (commonStopWords.includes(clean)) {
    return {
      isValid: false,
      phrase: trimmed,
      name: '',
      isPreset: false,
      error: `"${trimmed}" is a common English stop-word and cannot be used as a wake word (would trigger false positives).`,
      engineLimitations: ENGINE_LIMITATIONS,
    };
  }

  const preset = findPreset(trimmed);
  if (preset) {
    return {
      isValid: true,
      phrase: preset.phrase,
      name: preset.name,
      isPreset: true,
      matchedPreset: preset,
      engineLimitations: ENGINE_LIMITATIONS,
    };
  }

  const words = clean.split(' ').filter(Boolean);
  const name = extractNameFromPhrase(trimmed);

  let warning: string | undefined;
  if (words.length === 1) {
    warning =
      'Single-word wake phrases may experience higher false triggers or miss detections with mobile STT. Adding a prefix particle like "Hey ' +
      name +
      '" or "Hello ' +
      name +
      '" is strongly recommended.';
  } else if (words.length > 4) {
    warning =
      'Wake phrase is relatively long. Long phrases can increase recognition latency.';
  }

  return {
    isValid: true,
    phrase: formatWakePhrase(trimmed),
    name,
    isPreset: false,
    warning,
    engineLimitations: ENGINE_LIMITATIONS,
  };
}

/**
 * Interactive developer validation tester.
 */
export function testWakeWordRecognition(
  inputTranscript: string,
  targetPhrase: string,
): WakeWordTestResult {
  const match = detectWakeWordInTranscript(inputTranscript, targetPhrase);
  const preset = findPreset(targetPhrase);

  let analysis = '';
  if (match.detected) {
    analysis = `Matched via ${match.matchType} (Confidence: ${Math.round(
      (match.confidence || 0.8) * 100,
    )}%).`;
    if (preset) {
      analysis += ` Utilizing optimized preset "${preset.phrase}" with phonetic alias support.`;
    } else {
      analysis += ` Utilizing dynamic phonetic STT matcher for custom phrase "${targetPhrase}".`;
    }
    if (match.command) {
      analysis += ` Extracted command: "${match.command}".`;
    } else {
      analysis += ' No subsequent command detected (Wake-Word Only).';
    }
  } else {
    analysis = `No wake word match found in transcript for "${targetPhrase}".`;
    if (preset) {
      analysis += ` Checked direct regex, ${preset.aliases.length} phonetic STT aliases, and fuzzy Levenshtein distance.`;
    } else {
      analysis +=
        ' Checked dynamic prefix regex and token-level fuzzy distance.';
    }
  }

  return {
    inputTranscript,
    targetPhrase,
    detected: match.detected,
    matchedPhrase: match.matchedPhrase,
    remainingCommand: match.command,
    matchType: match.matchType,
    confidence: match.confidence,
    analysis,
  };
}
