import {
  DAILY_QUOTES,
  ScreenQuoteKey,
  getDailyQuote,
  getLocalDateKey,
  getMsUntilNextMidnight,
} from '../src/Services/DailyQuotes';

describe('DailyQuotesService', () => {
  const screens: ScreenQuoteKey[] = [
    'dashboard',
    'tasks',
    'reminders',
    'habits',
    'milestones',
  ];

  describe('Quote Pools Definition', () => {
    it('defines exactly 7 quotes for Dashboard', () => {
      expect(DAILY_QUOTES.dashboard).toHaveLength(7);
      expect(DAILY_QUOTES.dashboard).toContain(
        'Make today a little legendary!',
      );
      expect(DAILY_QUOTES.dashboard).toContain(
        'Even ordinary days hold a little magic!',
      );
    });

    it('defines exactly 8 quotes for Tasks', () => {
      expect(DAILY_QUOTES.tasks).toHaveLength(8);
      expect(DAILY_QUOTES.tasks).toContain('Dreams move when you do!');
      expect(DAILY_QUOTES.tasks).toContain(
        'Tiny victories make legendary stories!',
      );
    });

    it('defines exactly 8 quotes for Reminders', () => {
      expect(DAILY_QUOTES.reminders).toHaveLength(8);
      expect(DAILY_QUOTES.reminders).toContain(
        "Because your best ideas shouldn't slip away!",
      );
      expect(DAILY_QUOTES.reminders).toContain(
        'The keeper of your priorities!',
      );
    });

    it('defines exactly 7 quotes for Habits', () => {
      expect(DAILY_QUOTES.habits).toHaveLength(7);
      expect(DAILY_QUOTES.habits).toContain(
        'Your future self is taking notes!',
      );
      expect(DAILY_QUOTES.habits).toContain(
        "You're building a version of you that lasts!",
      );
    });

    it('defines exactly 7 quotes for Milestones', () => {
      expect(DAILY_QUOTES.milestones).toHaveLength(7);
      expect(DAILY_QUOTES.milestones).toContain(
        'Every summit begins with a single step!',
      );
      expect(DAILY_QUOTES.milestones).toContain(
        'From humble beginnings to sovereign heights!',
      );
    });
  });

  describe('getDailyQuote Selection & Daily Rollover', () => {
    it('returns a valid quote from the respective screen pool', () => {
      screens.forEach(screen => {
        const quote = getDailyQuote(screen);
        expect(DAILY_QUOTES[screen]).toContain(quote);
      });
    });

    it('is stable and deterministic for the same day', () => {
      const fixedDate = new Date(2026, 9, 22, 14, 30, 0); // Oct 22, 2026 2:30 PM
      screens.forEach(screen => {
        const quote1 = getDailyQuote(screen, fixedDate);
        const quote2 = getDailyQuote(screen, fixedDate);
        expect(quote1).toBe(quote2);
      });
    });

    it('changes quote between 11:59:59 PM and 12:00:00 AM (midnight rollover)', () => {
      const night = new Date(2026, 9, 22, 23, 59, 59);
      const nextMidnight = new Date(2026, 9, 23, 0, 0, 0);

      screens.forEach(screen => {
        const quoteNight = getDailyQuote(screen, night);
        const quoteMidnight = getDailyQuote(screen, nextMidnight);
        expect(quoteNight).not.toBe(quoteMidnight);
      });
    });

    it('guarantees no repeats across all 7 days of any week', () => {
      screens.forEach(screen => {
        // Test a full week from Sunday to Saturday
        const weekQuotes = new Set<string>();
        for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
          const date = new Date(2026, 9, 18 + dayOffset, 12, 0, 0); // Oct 18 is Sunday
          const quote = getDailyQuote(screen, date);
          expect(DAILY_QUOTES[screen]).toContain(quote);
          weekQuotes.add(quote);
        }
        // In a 7-day week, all 7 quotes picked must be distinct
        expect(weekQuotes.size).toBe(7);
      });
    });

    it('prevents identical quotes on consecutive days across week boundaries', () => {
      screens.forEach(screen => {
        // Test 28 consecutive days (4 full weeks)
        let prevQuote = '';
        for (let day = 1; day <= 28; day++) {
          const date = new Date(2026, 9, day, 12, 0, 0);
          const currentQuote = getDailyQuote(screen, date);
          if (prevQuote !== '') {
            expect(currentQuote).not.toBe(prevQuote);
          }
          prevQuote = currentQuote;
        }
      });
    });
  });

  describe('Midnight Timer Utilities', () => {
    it('calculates milliseconds until upcoming midnight correctly', () => {
      const evening = new Date(2026, 9, 22, 23, 0, 0); // 1 hour until midnight
      const ms = getMsUntilNextMidnight(evening);
      expect(ms).toBe(3600000); // exactly 1 hour = 3600000 ms
    });

    it('formats local date key as YYYY-MM-DD', () => {
      const date = new Date(2026, 0, 5); // Jan 5, 2026
      expect(getLocalDateKey(date)).toBe('2026-01-05');
    });
  });
});
