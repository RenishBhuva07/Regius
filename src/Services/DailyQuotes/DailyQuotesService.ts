import { DAILY_QUOTES, ScreenQuoteKey } from './dailyQuotesData';

/**
 * 32-bit FNV-1a string hash algorithm.
 */
function hashString(str: string): number {
  let hash = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

/**
 * Mulberry32 32-bit pseudo-random number generator.
 */
function createMulberry32(seed: number): () => number {
  let current = seed;
  return function (): number {
    let t = (current += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Shuffles an array of strings deterministically using a seed.
 */
function shuffleQuotes(quotes: readonly string[], seed: number): string[] {
  const result = [...quotes];
  const rng = createMulberry32(seed);
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    const temp = result[i];
    result[i] = result[j];
    result[j] = temp;
  }
  return result;
}

/**
 * Returns the local date string in YYYY-MM-DD format.
 */
export function getLocalDateKey(date: Date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * Computes milliseconds remaining until the upcoming 12:00:00 AM midnight.
 */
export function getMsUntilNextMidnight(now: Date = new Date()): number {
  const nextMidnight = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + 1,
    0,
    0,
    0,
    0,
  );
  return Math.max(1000, nextMidnight.getTime() - now.getTime());
}

/**
 * Computes the weekly randomized quote schedule for a screen and week Sunday.
 */
function getWeekSchedule(screen: ScreenQuoteKey, sundayDate: Date): string[] {
  const sundayKey = getLocalDateKey(sundayDate);
  const seed = hashString(`${screen}:${sundayKey}`);
  const pool = DAILY_QUOTES[screen];
  const shuffled = shuffleQuotes(pool, seed);

  // Cross-week boundary guard: prevent Sunday matching previous Saturday
  const prevSundayDate = new Date(
    sundayDate.getFullYear(),
    sundayDate.getMonth(),
    sundayDate.getDate() - 7,
    0,
    0,
    0,
    0,
  );
  const prevSundayKey = getLocalDateKey(prevSundayDate);
  const prevSeed = hashString(`${screen}:${prevSundayKey}`);
  const prevShuffled = shuffleQuotes(pool, prevSeed);
  const prevSaturdayQuote = prevShuffled[6 % prevShuffled.length];

  if (shuffled[0] === prevSaturdayQuote && shuffled.length > 1) {
    const swapTarget = shuffled.length > 2 ? 2 : 1;
    const temp = shuffled[0];
    shuffled[0] = shuffled[swapTarget];
    shuffled[swapTarget] = temp;
  }

  return shuffled;
}

/**
 * Retrieves the daily quote for a given screen and date.
 * - Changes deterministically every calendar day at 12:00 AM midnight.
 * - Provides non-repeating randomized distribution across the week.
 */
export function getDailyQuote(
  screen: ScreenQuoteKey,
  targetDate: Date = new Date(),
): string {
  const dayOfWeek = targetDate.getDay(); // 0 (Sun) to 6 (Sat)
  const sundayDate = new Date(
    targetDate.getFullYear(),
    targetDate.getMonth(),
    targetDate.getDate() - dayOfWeek,
    0,
    0,
    0,
    0,
  );

  const schedule = getWeekSchedule(screen, sundayDate);
  return schedule[dayOfWeek % schedule.length];
}
