/**
 * Normalizes arbitrary user text for the Kokoro TTS pipeline.
 * Expands numbers, dates, times, abbreviations, and splits long paragraphs
 * into clauses/sentences suitable for Kokoro synthesis.
 */

const NUMBER_MAP: Record<number, string> = {
  0: 'zero',
  1: 'one',
  2: 'two',
  3: 'three',
  4: 'four',
  5: 'five',
  6: 'six',
  7: 'seven',
  8: 'eight',
  9: 'nine',
  10: 'ten',
  11: 'eleven',
  12: 'twelve',
  13: 'thirteen',
  14: 'fourteen',
  15: 'fifteen',
  16: 'sixteen',
  17: 'seventeen',
  18: 'eighteen',
  19: 'nineteen',
  20: 'twenty',
  30: 'thirty',
  40: 'forty',
  50: 'fifty',
  60: 'sixty',
  70: 'seventy',
  80: 'eighty',
  90: 'ninety',
};

function numberToWords(num: number): string {
  if (num < 0) return `negative ${numberToWords(-num)}`;
  if (num in NUMBER_MAP) return NUMBER_MAP[num];
  if (num < 100) {
    const tens = Math.floor(num / 10) * 10;
    const units = num % 10;
    return `${NUMBER_MAP[tens]}-${NUMBER_MAP[units]}`;
  }
  if (num < 1000) {
    const hundreds = Math.floor(num / 100);
    const rest = num % 100;
    return `${NUMBER_MAP[hundreds]} hundred${rest > 0 ? ` and ${numberToWords(rest)}` : ''}`;
  }
  if (num < 1000000) {
    const thousands = Math.floor(num / 1000);
    const rest = num % 1000;
    return `${numberToWords(thousands)} thousand${rest > 0 ? ` ${numberToWords(rest)}` : ''}`;
  }
  return num.toString();
}

const ABBREVIATIONS: Record<string, string> = {
  'dr.': 'doctor',
  'mr.': 'mister',
  'mrs.': 'missus',
  'ms.': 'miss',
  'prof.': 'professor',
  'apt.': 'apartment',
  'approx.': 'approximately',
  'dept.': 'department',
  'est.': 'estimated',
  'govt.': 'government',
  'min.': 'minute',
  'mins.': 'minutes',
  'sec.': 'second',
  'secs.': 'seconds',
  'hr.': 'hour',
  'hrs.': 'hours',
  'vs.': 'versus',
  'etc.': 'et cetera',
  'e.g.': 'for example',
  'i.e.': 'that is',
  'p.m.': 'P M',
  'pm': 'P M',
  'a.m.': 'A M',
  'am': 'A M',
  'w/': 'with',
  'w/o': 'without',
};

export function normalizeText(rawText: string): string {
  if (!rawText) return '';

  let text = rawText.trim();

  // 1. Normalize currency
  text = text.replace(/\$(\d+(?:\.\d+)?)/g, (_, val) => {
    return `${val} dollars`;
  });

  // 2. Normalize percentages
  text = text.replace(/(\d+)%/g, '$1 percent');

  // 3. Normalize times like 3:00 or 10:30
  text = text.replace(/\b(\d{1,2}):(\d{2})\b/g, (_, h, m) => {
    const min = parseInt(m, 10);
    if (min === 0) return `${h} o'clock`;
    return `${h} ${numberToWords(min)}`;
  });

  // 4. Normalize standalone numbers (e.g. "4 items" -> "four items")
  text = text.replace(/\b\d+\b/g, match => {
    const n = parseInt(match, 10);
    if (!isNaN(n) && n <= 999999) {
      return numberToWords(n);
    }
    return match;
  });

  // 5. Replace common abbreviations (case-insensitive)
  for (const [abbr, expanded] of Object.entries(ABBREVIATIONS)) {
    const escaped = abbr.replace('.', '\\.');
    const regex = new RegExp(`\\b${escaped}(?=\\s|$|[.,!?])`, 'gi');
    text = text.replace(regex, expanded);
  }

  // 6. Clean up excess whitespace and dashes
  text = text.replace(/[\r\n\t]+/g, ' ');
  text = text.replace(/\s+/g, ' ');
  text = text.trim();

  return text;
}

/**
 * Splits arbitrary text into sentence chunks under maxChars to prevent
 * Kokoro sequence token overflow while preserving natural pause phrasing.
 */
export function splitIntoChunks(text: string, maxChars: number = 280): string[] {
  const normalized = normalizeText(text);
  if (normalized.length <= maxChars) {
    return [normalized];
  }

  // Split on sentence boundaries: periods, exclamation marks, question marks
  const sentenceRegex = /([^.!?]+[.!?]+|\S+)/g;
  const matches = normalized.match(sentenceRegex) || [normalized];

  const chunks: string[] = [];
  let currentChunk = '';

  for (const piece of matches) {
    const trimmed = piece.trim();
    if (!trimmed) continue;

    if (currentChunk.length + trimmed.length + 1 <= maxChars) {
      currentChunk = currentChunk ? `${currentChunk} ${trimmed}` : trimmed;
    } else {
      if (currentChunk) chunks.push(currentChunk);
      currentChunk = trimmed;
    }
  }

  if (currentChunk) {
    chunks.push(currentChunk);
  }

  return chunks;
}
