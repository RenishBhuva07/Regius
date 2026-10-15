import vocabData from './vocab.json';

const VOCAB: Record<string, number> = vocabData as Record<string, number>;

/**
 * Basic phoneme/text normalizer and tokenizer for Kokoro-82M.
 * Kokoro accepts tokens matching its 177-symbol vocabulary enclosed by '$' (token 0).
 */
export function tokenizeText(text: string): number[] {
  if (!text || text.trim().length === 0) {
    return [0, 0];
  }

  // Basic normalization: trim and replace multiple spaces
  const normalized = text.trim().replace(/\s+/g, ' ');

  const tokens: number[] = [VOCAB['$'] ?? 0];

  for (let i = 0; i < normalized.length; i++) {
    const char = normalized[i];
    if (VOCAB[char] !== undefined) {
      tokens.push(VOCAB[char]);
    } else {
      // If uppercase not found, try lowercase or fallback to space
      const lower = char.toLowerCase();
      if (VOCAB[lower] !== undefined) {
        tokens.push(VOCAB[lower]);
      } else {
        // Unknown symbol -> treat as space if not consecutive
        const spaceToken = VOCAB[' '] ?? 16;
        if (tokens[tokens.length - 1] !== spaceToken) {
          tokens.push(spaceToken);
        }
      }
    }
  }

  tokens.push(VOCAB['$'] ?? 0);
  return tokens;
}
