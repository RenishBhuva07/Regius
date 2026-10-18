/**
 * TranscriptNormalizer.ts
 *
 * Reusable transcript normalization and conversational signal detection for SIA Voice Assistant.
 *
 * Normalizes speech input across:
 * - Casing and whitespace
 * - Contractions ("that's" -> "that is", "i'm" -> "i am", etc.)
 * - Punctuation and filler words ("okay", "well", "alright", "yeah", etc.)
 * - Conversational intents: gratitude, goodbyes, declines, confirmations, cancellations.
 */

export interface NormalizedTranscript {
  raw: string;
  cleanRaw: string;
  normalized: string;
  strippedFillers: string;
  tokens: string[];
}

/**
 * Common English contractions mapped to expanded forms.
 */
const CONTRACTION_MAP: Record<string, string> = {
  "that's": 'that is',
  'that’s': 'that is',
  "i'm": 'i am',
  'i’m': 'i am',
  "it's": 'it is',
  'it’s': 'it is',
  "don't": 'do not',
  'don’t': 'do not',
  "doesn't": 'does not',
  'doesn’t': 'does not',
  "can't": 'cannot',
  'can’t': 'cannot',
  "won't": 'will not',
  'won’t': 'will not',
  "let's": 'let us',
  'let’s': 'let us',
  "you're": 'you are',
  'you’re': 'you are',
  "we're": 'we are',
  'we’re': 'we are',
  "there's": 'there is',
  'there’s': 'there is',
  "what's": 'what is',
  'what’s': 'what is',
  "who's": 'who is',
  'who’s': 'who is',
  "didn't": 'did not',
  'didn’t': 'did not',
  "isn't": 'is not',
  'isn’t': 'is not',
  "aren't": 'are not',
  'aren’t': 'are not',
  "haven't": 'have not',
  'haven’t': 'have not',
  "hasn't": 'has not',
  'hasn’t': 'has not',
};

/**
 * Natural conversational filler words that often prefix or pad spoken commands.
 */
const LEADING_FILLERS_REGEX =
  /^(?:okay|ok|well|alright|all\s+right|yeah|yep|ya|so|um|uh|hey|hi|please|can\s+you|could\s+you|would\s+you|will\s+you)\b[\s,]*/i;

/**
 * Normalizes speech transcript for conversational intelligence.
 */
export function normalizeTranscript(raw: string): NormalizedTranscript {
  const trimmed = (raw || '').trim();

  // Strip trailing punctuation from raw text (keeping original casing)
  const cleanRaw = trimmed.replace(/[.,!?;:]+$/g, '').trim();

  // 1. Lowercase
  let lower = trimmed.toLowerCase();

  // 2. Expand contractions
  for (const [contraction, expansion] of Object.entries(CONTRACTION_MAP)) {
    lower = lower.split(contraction).join(expansion);
  }

  // 3. Remove punctuation except alphanumeric characters and spaces
  let noPunct = lower.replace(/[.,/#!$%^&*;:{}=\-_`~()?"'“”’]/g, ' ');

  // 4. Collapse multiple spaces
  let normalized = noPunct.replace(/\s+/g, ' ').trim();

  // Normalize common phonetic variations
  normalized = normalized
    .replace(/\bokay\b/g, 'ok')
    .replace(/\bok\b/g, 'okay')
    .replace(/\balright\b/g, 'all right')
    .replace(/\bbye\s+bye\b/g, 'bye-bye')
    .replace(/\s+/g, ' ')
    .trim();

  // 5. Strip leading filler words for secondary matching
  let strippedFillers = normalized.replace(LEADING_FILLERS_REGEX, '').trim();

  const tokens = normalized.split(' ').filter(Boolean);

  return {
    raw: trimmed,
    cleanRaw,
    normalized,
    strippedFillers,
    tokens,
  };
}

/**
 * Determines whether the user utterance expresses pure gratitude.
 * (e.g. "Thanks", "Thank you", "Okay, thanks", "Thank you so much", "Cool, thanks")
 */
export function isGratitudeIntent(normalizedText: string): boolean {
  const { normalized, strippedFillers } = normalizeTranscript(normalizedText);

  // Exclude combined goodbye / decline intents first (e.g. "thanks, bye", "that's all, thanks")
  if (isGoodbyeIntent(normalizedText) || isDeclineIntent(normalizedText)) {
    return false;
  }

  const gratitudePatterns = [
    /^(?:okay\s+|all\s+right\s+|cool\s+|great\s+|perfect\s+|awesome\s+)?(?:thanks|thank\s+you)(?:\s+(?:a\s+lot|so\s+much|very\s+much|regius|sia))?$/,
    /^(?:appreciate\s+it|that\s+is\s+helpful|glad\s+to\s+help)$/,
  ];

  return (
    gratitudePatterns.some(p => p.test(normalized)) ||
    gratitudePatterns.some(p => p.test(strippedFillers))
  );
}

/**
 * Determines whether the user utterance expresses goodbye / ending the session.
 * Covers direct goodbyes ("Bye", "Goodbye", "See you later", "I'm done", "That's all for now")
 * and combined phrases ("Thanks, bye", "Okay, thanks, that's all", "No, thank you").
 */
export function isGoodbyeIntent(normalizedText: string): boolean {
  const { normalized, strippedFillers } = normalizeTranscript(normalizedText);

  // Combined gratitude + goodbye (e.g., "thanks bye", "okay thanks that is all", "thanks that is all")
  if (
    /(?:thanks|thank\s+you).*(?:bye|that\s+is\s+all|that\s+is\s+it|i\s+am\s+done)/.test(
      normalized,
    ) ||
    /(?:that\s+is\s+all|that\s+is\s+it|bye).*(?:thanks|thank\s+you)/.test(
      normalized,
    )
  ) {
    return true;
  }

  // Combined decline + thank you (e.g. "no thank you", "no thanks", "no thanks bye")
  if (/^no\s+(?:thanks|thank\s+you)(?:\s+bye)?$/.test(normalized)) {
    return true;
  }

  // Direct goodbye expressions
  const goodbyePatterns = [
    /^(?:okay\s+|all\s+right\s+)?(?:goodbye|bye|bye-bye|see\s+you|see\s+you\s+later|talk\s+to\s+you\s+later|have\s+a\s+good\s+day)$/,
    /^(?:that\s+is\s+all(?:\s+for\s+now)?|that\s+is\s+it|nothing\s+else|i\s+am\s+done|i\s+am\s+leaving|close|exit|stop)$/,
    /^(?:i\s+am\s+good\s+you\s+can\s+stop\s+now|no\s+that\s+is\s+enough\s+for\s+today)$/,
  ];

  return (
    goodbyePatterns.some(p => p.test(normalized)) ||
    goodbyePatterns.some(p => p.test(strippedFillers))
  );
}

/**
 * Determines whether the utterance expresses a decline/negative response in a follow-up context.
 * e.g. "No", "No thanks", "Nothing else", "I'm good", "I'm all set", "That's it", "That's all", "Nope"
 */
export function isDeclineIntent(normalizedText: string): boolean {
  const { normalized, strippedFillers } = normalizeTranscript(normalizedText);

  const declinePatterns = [
    /^(?:no|nope|nah)$/,
    /^no\s+(?:thanks|thank\s+you)$/,
    /^(?:no\s+)?(?:that\s+is\s+all|that\s+is\s+it)$/,
    /^(?:no\s+)?(?:nothing\s+else|nothing)$/,
    /^(?:no\s+)?(?:i\s+am\s+good|i\s+am\s+all\s+set|i\s+am\s+done)$/,
    /^no\s+(?:bye|bye-bye)$/,
    /^(?:no\s+)?that\s+is\s+enough(?:\s+for\s+today)?$/,
  ];

  return (
    declinePatterns.some(p => p.test(normalized)) ||
    declinePatterns.some(p => p.test(strippedFillers))
  );
}

/**
 * Determines whether the utterance is a cancellation request.
 * e.g. "cancel", "never mind", "dismiss", "forget it"
 */
export function isCancellationIntent(normalizedText: string): boolean {
  const { normalized, strippedFillers } = normalizeTranscript(normalizedText);

  const cancelPatterns = [
    /^(?:cancel|cancel\s+that|never\s*mind|dismiss|forget\s*it|do\s+not\s+do\s+that|stop)$/,
  ];

  return (
    cancelPatterns.some(p => p.test(normalized)) ||
    cancelPatterns.some(p => p.test(strippedFillers))
  );
}

/**
 * Checks if the word "no" in an utterance is merely part of a larger, unrelated sentence
 * (such as "Add a task: no meeting today" or "Remind me not to forget my keys").
 * Returns true if the sentence has substantive content beyond the negative word.
 */
export function isSubstantiveSentenceWithNegative(rawText: string): boolean {
  const { normalized } = normalizeTranscript(rawText);

  // Check if utterance actually contains a negation word
  if (!/\b(?:no|not|do\s+not|never)\b/i.test(normalized)) {
    return false;
  }

  // If it's a pure decline or cancellation or goodbye phrase, it is NOT an unrelated substantive sentence
  if (
    isDeclineIntent(normalized) ||
    isCancellationIntent(normalized) ||
    isGoodbyeIntent(normalized)
  ) {
    return false;
  }

  // If the sentence starts with or contains command indicators or task verbs
  if (
    /\b(?:task|reminder|habit|schedule|call|meeting|email|doctor|buy|read|workout|run|meditat|focus|brief)\b/i.test(
      normalized,
    )
  ) {
    return true;
  }

  const tokens = normalized.split(' ').filter(Boolean);
  return tokens.length >= 3;
}
