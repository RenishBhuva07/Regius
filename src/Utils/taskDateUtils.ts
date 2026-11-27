export type TaskHorizon = 'overdue' | 'today' | 'upcoming' | 'anytime';

export type DiurnalPhase = 'day' | 'night';

/**
 * Maps a given Date (or hour number) to a natural diurnal phase:
 * - 'day': 06:00 - 19:59 (Sun & Soft Clouds)
 * - 'night': 20:00 - 05:59 (Crescent Moon & Stars)
 */
export function getDiurnalPhase(dateOrHour: Date | number): DiurnalPhase {
  const hour =
    typeof dateOrHour === 'number' ? dateOrHour : dateOrHour.getHours();
  if (hour >= 6 && hour < 20) {
    return 'day';
  }
  return 'night';
}

export type TaskRecurrence =
  | 'none'
  | 'daily'
  | 'weekdays'
  | 'weekly'
  | 'monthly';

const MONTH_SHORT = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

const MONTH_INDEX: Record<string, number> = {
  jan: 0,
  january: 0,
  feb: 1,
  february: 1,
  mar: 2,
  march: 2,
  apr: 3,
  april: 3,
  may: 4,
  jun: 5,
  june: 5,
  jul: 6,
  july: 6,
  aug: 7,
  august: 7,
  sep: 8,
  sept: 8,
  september: 8,
  oct: 9,
  october: 9,
  nov: 10,
  november: 10,
  dec: 11,
  december: 11,
};

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

/** Converts a local Date to canonical YYYY-MM-DD without UTC offset drift. */
export function toLocalISODate(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/** Parses a canonical YYYY-MM-DD string into a local midnight Date. */
export function parseLocalISODate(iso?: string | null): Date | null {
  if (!iso || !ISO_DATE_RE.test(iso.trim())) return null;
  const [y, m, d] = iso.trim().split('-').map(Number);
  const parsed = new Date(y, m - 1, d, 0, 0, 0, 0);
  if (
    parsed.getFullYear() !== y ||
    parsed.getMonth() !== m - 1 ||
    parsed.getDate() !== d
  ) {
    return null;
  }
  return parsed;
}

/** Returns a new local YYYY-MM-DD shifted by the given number of days. */
export function addDaysToISO(iso: string, days: number): string {
  const base = parseLocalISODate(iso) || new Date();
  const next = new Date(
    base.getFullYear(),
    base.getMonth(),
    base.getDate() + days,
  );
  return toLocalISODate(next);
}

/** Parses 12h/24h time string into minutes since midnight (9999 = unscheduled). */
export function parseTimeToMinutes(timeStr?: string | null): number {
  if (!timeStr) return 9999;
  const clean = timeStr.trim().toUpperCase();
  if (!clean || clean === 'ANYTIME' || clean === 'FLEXIBLE') return 9999;

  const match = clean.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/);
  if (!match) return 9999;

  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const modifier = match[3];

  if (modifier === 'PM' && hours < 12) hours += 12;
  if (modifier === 'AM' && hours === 12) hours = 0;

  return hours * 60 + minutes;
}

/** Hydrates a Date object from a time string like '03:30 PM' for picker initialization. */
export function parseTimeStringToDate(
  timeStr?: string | null,
  baseDate: Date = new Date(),
): Date {
  const result = new Date(
    baseDate.getFullYear(),
    baseDate.getMonth(),
    baseDate.getDate(),
    10,
    0,
    0,
    0,
  );
  const mins = parseTimeToMinutes(timeStr);
  if (mins < 9999) {
    result.setHours(Math.floor(mins / 60), mins % 60, 0, 0);
  }
  return result;
}

/** Formats a Date into '03:30 PM' display format. */
export function formatTimeFromDate(date: Date): string {
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const meridiem = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(
    2,
    '0',
  )} ${meridiem}`;
}

/** Formats an ISO date into Regius display label ('Today, Nov 26', 'Mon, Dec 14', 'Feb 14, 2027'). */
export function formatDisplayDate(
  dueDate?: string | null,
  todayISO: string = toLocalISODate(),
): string {
  if (!dueDate) return 'Anytime';
  const parsed = parseLocalISODate(dueDate);
  if (!parsed) return 'Anytime';

  const tomorrowISO = addDaysToISO(todayISO, 1);
  const monthShort = MONTH_SHORT[parsed.getMonth()];
  const dayNum = parsed.getDate();

  if (dueDate === todayISO) {
    return `Today, ${monthShort} ${dayNum}`;
  }
  if (dueDate === tomorrowISO) {
    return `Tomorrow, ${monthShort} ${dayNum}`;
  }

  const todayDate = parseLocalISODate(todayISO) || new Date();
  const dayOfWeek = DAY_NAMES[parsed.getDay()];
  if (parsed.getFullYear() !== todayDate.getFullYear()) {
    return `${dayOfWeek}, ${monthShort} ${dayNum}, ${parsed.getFullYear()}`;
  }
  return `${dayOfWeek}, ${monthShort} ${dayNum}`;
}

/** Compact badge-friendly date label ('Today', 'Tomorrow', 'Nov 30', "Feb 14 '27"). */
export function formatShortDateBadge(
  dueDate?: string | null,
  todayISO: string = toLocalISODate(),
): string {
  if (!dueDate) return 'Anytime';
  const parsed = parseLocalISODate(dueDate);
  if (!parsed) return 'Anytime';

  if (dueDate === todayISO) return 'Today';
  if (dueDate === addDaysToISO(todayISO, 1)) return 'Tomorrow';

  const todayDate = parseLocalISODate(todayISO) || new Date();
  const monthShort = MONTH_SHORT[parsed.getMonth()];
  const dayNum = parsed.getDate();

  if (parsed.getFullYear() !== todayDate.getFullYear()) {
    const yr = String(parsed.getFullYear()).slice(-2);
    return `${monthShort} ${dayNum} '${yr}`;
  }
  return `${monthShort} ${dayNum}`;
}

/** Normalizes legacy string dates or ISO inputs into canonical YYYY-MM-DD + display label. */
export function normalizeTaskDateInput(
  input?: string | null,
  today: Date = new Date(),
): { dueDate: string | null; displayDate: string } {
  const todayISO = toLocalISODate(today);

  if (input === null) {
    return { dueDate: null, displayDate: 'Anytime' };
  }
  if (!input || !input.trim()) {
    return {
      dueDate: todayISO,
      displayDate: formatDisplayDate(todayISO, todayISO),
    };
  }

  const raw = input.trim();
  const lower = raw.toLowerCase();

  if (lower === 'anytime' || lower === 'someday' || lower === 'unscheduled') {
    return { dueDate: null, displayDate: 'Anytime' };
  }

  if (ISO_DATE_RE.test(raw)) {
    const parsed = parseLocalISODate(raw);
    if (parsed) {
      return { dueDate: raw, displayDate: formatDisplayDate(raw, todayISO) };
    }
  }

  if (lower.startsWith('today') || lower === 'tonight') {
    return {
      dueDate: todayISO,
      displayDate: formatDisplayDate(todayISO, todayISO),
    };
  }

  if (lower.startsWith('tomorrow')) {
    const tomorrowISO = addDaysToISO(todayISO, 1);
    return {
      dueDate: tomorrowISO,
      displayDate: formatDisplayDate(tomorrowISO, todayISO),
    };
  }

  if (lower === 'next week') {
    const dayOfWeek = today.getDay();
    const daysUntilMonday = dayOfWeek === 0 ? 1 : 8 - dayOfWeek;
    const nextMonISO = addDaysToISO(todayISO, daysUntilMonday);
    return {
      dueDate: nextMonISO,
      displayDate: formatDisplayDate(nextMonISO, todayISO),
    };
  }

  // Match patterns like "Sat, Nov 28" or "Nov 28, 2027" or "December 15"
  const monthDayMatch = raw.match(
    /\b(jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:t(?:ember)?)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)\s+(\d{1,2})(?:st|nd|rd|th)?(?:,?\s*(\d{4}))?\b/i,
  );
  if (monthDayMatch) {
    const monthIdx = MONTH_INDEX[monthDayMatch[1].toLowerCase()];
    const dayNum = parseInt(monthDayMatch[2], 10);
    const explicitYear = monthDayMatch[3]
      ? parseInt(monthDayMatch[3], 10)
      : undefined;

    if (monthIdx !== undefined && dayNum >= 1 && dayNum <= 31) {
      let year = explicitYear ?? today.getFullYear();
      let candidate = new Date(year, monthIdx, dayNum);
      if (
        !explicitYear &&
        toLocalISODate(candidate) < addDaysToISO(todayISO, -7)
      ) {
        year += 1;
        candidate = new Date(year, monthIdx, dayNum);
      }
      if (candidate.getMonth() === monthIdx && candidate.getDate() === dayNum) {
        const iso = toLocalISODate(candidate);
        return { dueDate: iso, displayDate: formatDisplayDate(iso, todayISO) };
      }
    }
  }

  return {
    dueDate: todayISO,
    displayDate: formatDisplayDate(todayISO, todayISO),
  };
}

/** Resolves canonical dueDate for a task object (supporting legacy tasks without dueDate). */
export function resolveTaskDueDate(
  task: { dueDate?: string | null; date?: string },
  todayISO: string = toLocalISODate(),
): string | null {
  if (task.dueDate !== undefined) {
    return task.dueDate;
  }
  if (task.date) {
    return normalizeTaskDateInput(
      task.date,
      parseLocalISODate(todayISO) || new Date(),
    ).dueDate;
  }
  return todayISO;
}

/** Classifies a task into its temporal horizon relative to todayISO. */
export function classifyTaskHorizon(
  task: { dueDate?: string | null; date?: string; done?: boolean },
  todayISO: string = toLocalISODate(),
): TaskHorizon {
  const dueDate = resolveTaskDueDate(task, todayISO);
  if (!dueDate) return 'anytime';
  if (dueDate < todayISO && !task.done) return 'overdue';
  if (dueDate > todayISO) return 'upcoming';
  return 'today';
}

/** Determines whether a task belongs in Today's Flow / Today's Focus metrics. */
export function isTaskRelevantToday(
  task: {
    dueDate?: string | null;
    date?: string;
    done?: boolean;
    completedAt?: string | null;
  },
  todayISO: string = toLocalISODate(),
): boolean {
  const dueDate = resolveTaskDueDate(task, todayISO);
  if (dueDate === todayISO) return true;
  if (dueDate !== null && dueDate < todayISO && !task.done) return true;
  if (
    task.done &&
    task.completedAt &&
    task.completedAt.slice(0, 10) === todayISO
  ) {
    return true;
  }
  return false;
}

/** Computes the next future ISO occurrence date when a recurring task is completed. */
export function getNextOccurrenceISO(
  dueDate: string,
  recurrence: TaskRecurrence,
): string {
  const base = parseLocalISODate(dueDate) || new Date();
  const todayISO = toLocalISODate();
  const anchor =
    toLocalISODate(base) < todayISO ? parseLocalISODate(todayISO)! : base;

  switch (recurrence) {
    case 'daily':
      return addDaysToISO(toLocalISODate(anchor), 1);
    case 'weekdays': {
      let next = new Date(
        anchor.getFullYear(),
        anchor.getMonth(),
        anchor.getDate() + 1,
      );
      while (next.getDay() === 0 || next.getDay() === 6) {
        next = new Date(
          next.getFullYear(),
          next.getMonth(),
          next.getDate() + 1,
        );
      }
      return toLocalISODate(next);
    }
    case 'weekly':
      return addDaysToISO(toLocalISODate(anchor), 7);
    case 'monthly': {
      const targetDay = anchor.getDate();
      const nextMonth = new Date(
        anchor.getFullYear(),
        anchor.getMonth() + 1,
        1,
      );
      const maxDays = new Date(
        nextMonth.getFullYear(),
        nextMonth.getMonth() + 1,
        0,
      ).getDate();
      return toLocalISODate(
        new Date(
          nextMonth.getFullYear(),
          nextMonth.getMonth(),
          Math.min(targetDay, maxDays),
        ),
      );
    }
    default:
      return dueDate;
  }
}

const WEEKDAY_INDEX: Record<string, number> = {
  sunday: 0,
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6,
};

/** Parses natural-language future date phrases (weekdays, relative offsets, Month Day). */
export function parseNaturalFutureDate(
  text: string,
  today: Date = new Date(),
): { dueDate: string; displayDate: string; matchedText: string } | null {
  const todayISO = toLocalISODate(today);

  // 1. "day after tomorrow"
  const dayAfterMatch = text.match(/\b(?:the\s+)?day\s+after\s+tomorrow\b/i);
  if (dayAfterMatch) {
    const iso = addDaysToISO(todayISO, 2);
    return {
      dueDate: iso,
      displayDate: formatDisplayDate(iso, todayISO),
      matchedText: dayAfterMatch[0],
    };
  }

  // 2. "this weekend"
  const weekendMatch = text.match(/\b(?:this|for|on)\s+weekend\b/i);
  if (weekendMatch) {
    const dayOfWeek = today.getDay();
    const daysUntilSat = dayOfWeek === 6 ? 7 : 6 - dayOfWeek;
    const iso = addDaysToISO(todayISO, daysUntilSat);
    return {
      dueDate: iso,
      displayDate: formatDisplayDate(iso, todayISO),
      matchedText: weekendMatch[0],
    };
  }

  // 3. "in X days" / "in X weeks"
  const inDaysMatch = text.match(/\bin\s+(\d+)\s+(days?|weeks?)\b/i);
  if (inDaysMatch) {
    const count = parseInt(inDaysMatch[1], 10);
    const isWeeks = /^week/i.test(inDaysMatch[2]);
    if (count > 0) {
      const iso = addDaysToISO(todayISO, isWeeks ? count * 7 : count);
      return {
        dueDate: iso,
        displayDate: formatDisplayDate(iso, todayISO),
        matchedText: inDaysMatch[0],
      };
    }
  }

  // 4. "next month"
  const nextMonthMatch = text.match(/\bnext\s+month\b/i);
  if (nextMonthMatch) {
    const nextM = new Date(today.getFullYear(), today.getMonth() + 1, 1);
    const maxDays = new Date(
      nextM.getFullYear(),
      nextM.getMonth() + 1,
      0,
    ).getDate();
    const target = new Date(
      nextM.getFullYear(),
      nextM.getMonth(),
      Math.min(today.getDate(), maxDays),
    );
    const iso = toLocalISODate(target);
    return {
      dueDate: iso,
      displayDate: formatDisplayDate(iso, todayISO),
      matchedText: nextMonthMatch[0],
    };
  }

  // 5. Weekday references: "next Monday", "on Friday", "this Saturday"
  const weekdayMatch = text.match(
    /\b(?:(next|this)\s+|(?:on|for)\s+(?:(next|this)\s+)?)?(monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/i,
  );
  if (
    weekdayMatch &&
    (weekdayMatch[1] ||
      weekdayMatch[2] ||
      /\b(?:on|for)\b/i.test(weekdayMatch[0]))
  ) {
    const modifier = (weekdayMatch[1] || weekdayMatch[2] || '').toLowerCase();
    const targetWeekday = WEEKDAY_INDEX[weekdayMatch[3].toLowerCase()];
    if (targetWeekday !== undefined) {
      const currentWeekday = today.getDay();
      let delta = (targetWeekday - currentWeekday + 7) % 7;
      if (delta === 0) delta = 7;
      if (modifier === 'next' && delta <= 7) {
        const daysToNextWeekSunday = 7 - currentWeekday;
        if (delta < daysToNextWeekSunday) {
          delta += 7;
        }
      }
      const iso = addDaysToISO(todayISO, delta);
      return {
        dueDate: iso,
        displayDate: formatDisplayDate(iso, todayISO),
        matchedText: weekdayMatch[0],
      };
    }
  }

  // 6. Explicit Month Day: "on December 18", "Dec 25th, 2027"
  const monthDayMatch = text.match(
    /\b(?:(?:on|for)\s+)?(jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:t(?:ember)?)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)\s+(\d{1,2})(?:st|nd|rd|th)?(?:,?\s*(\d{4}))?\b/i,
  );
  if (monthDayMatch) {
    const monthIdx = MONTH_INDEX[monthDayMatch[1].toLowerCase()];
    const dayNum = parseInt(monthDayMatch[2], 10);
    const explicitYear = monthDayMatch[3]
      ? parseInt(monthDayMatch[3], 10)
      : undefined;
    if (monthIdx !== undefined && dayNum >= 1 && dayNum <= 31) {
      let year = explicitYear ?? today.getFullYear();
      let candidate = new Date(year, monthIdx, dayNum);
      if (!explicitYear && toLocalISODate(candidate) < todayISO) {
        year += 1;
        candidate = new Date(year, monthIdx, dayNum);
      }
      if (candidate.getMonth() === monthIdx && candidate.getDate() === dayNum) {
        const iso = toLocalISODate(candidate);
        return {
          dueDate: iso,
          displayDate: formatDisplayDate(iso, todayISO),
          matchedText: monthDayMatch[0],
        };
      }
    }
  }

  // 7. Day Month: "on 18th December", "5th of Jan 2027"
  const dayMonthMatch = text.match(
    /\b(?:(?:on|for)\s+)?(\d{1,2})(?:st|nd|rd|th)?\s+(?:of\s+)?(jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:t(?:ember)?)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)(?:,?\s*(\d{4}))?\b/i,
  );
  if (dayMonthMatch) {
    const dayNum = parseInt(dayMonthMatch[1], 10);
    const monthIdx = MONTH_INDEX[dayMonthMatch[2].toLowerCase()];
    const explicitYear = dayMonthMatch[3]
      ? parseInt(dayMonthMatch[3], 10)
      : undefined;
    if (monthIdx !== undefined && dayNum >= 1 && dayNum <= 31) {
      let year = explicitYear ?? today.getFullYear();
      let candidate = new Date(year, monthIdx, dayNum);
      if (!explicitYear && toLocalISODate(candidate) < todayISO) {
        year += 1;
        candidate = new Date(year, monthIdx, dayNum);
      }
      if (candidate.getMonth() === monthIdx && candidate.getDate() === dayNum) {
        const iso = toLocalISODate(candidate);
        return {
          dueDate: iso,
          displayDate: formatDisplayDate(iso, todayISO),
          matchedText: dayMonthMatch[0],
        };
      }
    }
  }

  return null;
}
