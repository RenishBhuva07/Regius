import {
  toLocalISODate,
  parseLocalISODate,
  addDaysToISO,
  parseTimeToMinutes,
  formatDisplayDate,
  formatShortDateBadge,
  normalizeTaskDateInput,
  classifyTaskHorizon,
  isTaskRelevantToday,
  getNextOccurrenceISO,
  parseNaturalFutureDate,
} from '../src/Utils/taskDateUtils';

describe('taskDateUtils', () => {
  const fixedToday = new Date(2026, 10, 26, 9, 30, 0); // Thu Nov 26 2026
  const todayISO = toLocalISODate(fixedToday);

  it('converts local Dates to YYYY-MM-DD and back safely', () => {
    expect(todayISO).toBe('2026-11-26');
    const parsed = parseLocalISODate('2026-11-26');
    expect(parsed).not.toBeNull();
    expect(parsed?.getFullYear()).toBe(2026);
    expect(parsed?.getMonth()).toBe(10);
    expect(parsed?.getDate()).toBe(26);
    expect(parseLocalISODate('2026-02-30')).toBeNull();
  });

  it('adds days cleanly across month and year boundaries', () => {
    expect(addDaysToISO('2026-11-26', 5)).toBe('2026-12-01');
    expect(addDaysToISO('2026-12-30', 3)).toBe('2027-01-02');
  });

  it('parses clock times and treats Anytime/empty as unscheduled (9999)', () => {
    expect(parseTimeToMinutes('09:00 AM')).toBe(540);
    expect(parseTimeToMinutes('03:30 PM')).toBe(930);
    expect(parseTimeToMinutes('Anytime')).toBe(9999);
    expect(parseTimeToMinutes(null)).toBe(9999);
  });

  it('formats Today, Tomorrow, future dates, and next-year dates cleanly', () => {
    expect(formatDisplayDate('2026-11-26', todayISO)).toBe('Today, Nov 26');
    expect(formatDisplayDate('2026-11-27', todayISO)).toBe('Tomorrow, Nov 27');
    expect(formatDisplayDate('2026-12-18', todayISO)).toBe('Fri, Dec 18');
    expect(formatDisplayDate('2027-02-14', todayISO)).toBe('Sun, Feb 14, 2027');
    expect(formatDisplayDate(null, todayISO)).toBe('Anytime');

    expect(formatShortDateBadge('2026-11-26', todayISO)).toBe('Today');
    expect(formatShortDateBadge('2026-11-27', todayISO)).toBe('Tomorrow');
    expect(formatShortDateBadge('2027-02-14', todayISO)).toBe("Feb 14 '27");
  });

  it('normalizes legacy strings, ISO strings, and Anytime inputs', () => {
    expect(normalizeTaskDateInput('Today, Nov 26', fixedToday).dueDate).toBe(
      '2026-11-26',
    );
    expect(normalizeTaskDateInput('Tomorrow', fixedToday).dueDate).toBe(
      '2026-11-27',
    );
    expect(normalizeTaskDateInput('2027-01-15', fixedToday).dueDate).toBe(
      '2027-01-15',
    );
    expect(normalizeTaskDateInput('Anytime', fixedToday)).toEqual({
      dueDate: null,
      displayDate: 'Anytime',
    });
  });

  it('classifies overdue, today, upcoming, and anytime horizons accurately', () => {
    expect(
      classifyTaskHorizon({ dueDate: '2026-11-24', done: false }, todayISO),
    ).toBe('overdue');
    expect(
      classifyTaskHorizon({ dueDate: '2026-11-24', done: true }, todayISO),
    ).toBe('today');
    expect(
      classifyTaskHorizon({ dueDate: '2026-11-26', done: false }, todayISO),
    ).toBe('today');
    expect(
      classifyTaskHorizon({ dueDate: '2026-12-10', done: false }, todayISO),
    ).toBe('upcoming');
    expect(classifyTaskHorizon({ dueDate: null, done: false }, todayISO)).toBe(
      'anytime',
    );

    expect(
      isTaskRelevantToday({ dueDate: '2026-12-10', done: false }, todayISO),
    ).toBe(false);
    expect(
      isTaskRelevantToday({ dueDate: '2026-11-24', done: false }, todayISO),
    ).toBe(true);
  });

  it('computes next recurrence occurrences across daily, weekdays, weekly, and monthly', () => {
    expect(getNextOccurrenceISO('2026-11-26', 'daily')).toBe('2026-11-27');
    expect(getNextOccurrenceISO('2026-11-27', 'weekdays')).toBe('2026-11-30');
    expect(getNextOccurrenceISO('2026-11-26', 'weekly')).toBe('2026-12-03');
    expect(getNextOccurrenceISO('2027-01-31', 'monthly')).toBe('2027-02-28');
  });

  it('parses natural-language future date phrases accurately', () => {
    expect(parseNaturalFutureDate('in 3 days', fixedToday)?.dueDate).toBe(
      '2026-11-29',
    );
    expect(parseNaturalFutureDate('in 2 weeks', fixedToday)?.dueDate).toBe(
      '2026-12-10',
    );
    expect(parseNaturalFutureDate('next month', fixedToday)?.dueDate).toBe(
      '2026-12-26',
    );
    expect(parseNaturalFutureDate('on Friday', fixedToday)?.dueDate).toBe(
      '2026-11-27',
    );
    expect(parseNaturalFutureDate('next Monday', fixedToday)?.dueDate).toBe(
      '2026-11-30',
    );
    expect(parseNaturalFutureDate('on December 18', fixedToday)?.dueDate).toBe(
      '2026-12-18',
    );
    expect(
      parseNaturalFutureDate('on 5th of January 2027', fixedToday)?.dueDate,
    ).toBe('2027-01-05');
  });
});
