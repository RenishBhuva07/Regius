import vocabData from './vocab.json';
import { phonemize } from './phonemizer';
import { normalizeText } from './normalizer';

const VOCAB: Record<string, number> = vocabData as Record<string, number>;
const PAD_START_END_TOKEN = VOCAB['$'] ?? 0;
const SPACE_TOKEN = VOCAB[' '] ?? 16;
const MAX_TOKENS = 510;

// Convert phonemes to Kokoro token IDs bounded by '$'
export function phonemesToTokens(phonemes: string): number[] {
  if (!phonemes || phonemes.trim().length === 0) {
    return [PAD_START_END_TOKEN, PAD_START_END_TOKEN];
  }

  const tokens: number[] = [PAD_START_END_TOKEN];

  for (let i = 0; i < phonemes.length; i++) {
    if (tokens.length >= MAX_TOKENS) {
      break;
    }
    const char = phonemes[i];
    if (VOCAB[char] !== undefined) {
      tokens.push(VOCAB[char]);
    } else {
      // If unknown symbol, collapse to space if not duplicate
      if (tokens[tokens.length - 1] !== SPACE_TOKEN) {
        tokens.push(SPACE_TOKEN);
      }
    }
  }

  tokens.push(PAD_START_END_TOKEN);
  return tokens;
}

// Normalize, phonemize, and tokenize text
export function tokenizeText(text: string): number[] {
  const normalized = normalizeText(text);
  const phonemes = phonemize(normalized);
  return phonemesToTokens(phonemes);
}
