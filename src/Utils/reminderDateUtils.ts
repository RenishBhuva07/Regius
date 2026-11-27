import {
  toLocalISODate,
  parseLocalISODate,
  addDaysToISO,
  parseTimeToMinutes,
  formatDisplayDate,
  normalizeTaskDateInput,
} from './taskDateUtils';
import {
  Reminder,
  ReminderRecurrence,
  ReminderStatus,
  RemindBefore,
} from '../Services/Reminders/types';

/** Converts '04:30 PM' or '16:30' into canonical 24h 'HH:MM'. */
export function to24HourTime(timeStr?: string | null): string {
  const mins = parseTimeToMinutes(timeStr);
  if (mins >= 9999) {
    return '09:00';
  }
  const h = Math.floor(mins / 60) % 24;
  const m = mins % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

/** Converts 24h 'HH:MM' (or 12h string) into '04:30 PM' display format. */
export function format24hTo12h(timeStr?: string | null): string {
  const mins = parseTimeToMinutes(timeStr);
  if (mins >= 9999) {
    return '09:00 AM';
  }
  let h = Math.floor(mins / 60) % 24;
  const m = mins % 60;
  const meridiem = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')} ${meridiem}`;
}

/** Normalizes any repeat label or recurrence key to ReminderRecurrence. */
export function normalizeReminderRecurrence(
  input?: string | null,
): ReminderRecurrence {
  if (!input) return 'none';
  const clean = input.trim().toLowerCase();
  if (clean === 'daily' || clean === 'every day' || clean.includes('every 2')) {
    return 'daily';
  }
  if (clean === 'weekdays' || clean === 'weekday') {
    return 'weekdays';
  }
  if (clean === 'weekly' || clean === 'every week') {
    return 'weekly';
  }
  if (clean === 'monthly' || clean === 'every month') {
    return 'monthly';
  }
  if (clean === 'yearly' || clean === 'annually' || clean === 'every year') {
    return 'yearly';
  }
  return 'none';
}

export function formatRecurrenceLabel(recurrence: ReminderRecurrence): string {
  switch (recurrence) {
    case 'daily':
      return 'Daily';
    case 'weekdays':
      return 'Weekdays';
    case 'weekly':
      return 'Weekly';
    case 'monthly':
      return 'Monthly';
    case 'yearly':
      return 'Yearly';
    case 'none':
    default:
      return 'Once';
  }
}

export function normalizeRemindBeforeMinutes(
  input?: string | number | null,
): RemindBefore {
  if (typeof input === 'number') {
    if (input === 5 || input === 15 || input === 60 || input === 1440) {
      return input;
    }
    return 0;
  }
  if (!input) return 0;
  const clean = input.trim().toLowerCase();
  if (clean.includes('5 min')) return 5;
  if (clean.includes('15 min')) return 15;
  if (clean.includes('1 hour') || clean.includes('60')) return 60;
  if (clean.includes('1 day') || clean.includes('day before')) return 1440;
  return 0;
}

export function formatRemindBeforeLabel(minutes: RemindBefore): string {
  switch (minutes) {
    case 5:
      return '5 mins before';
    case 15:
      return '15 mins before';
    case 60:
      return '1 hour before';
    case 1440:
      return '1 day before';
    case 0:
    default:
      return 'At time of event';
  }
}

/**
 * Computes the exact scheduled Date for a reminder.
 * If snoozedUntil is set and in the future (or active), returns the snoozed Date.
 */
export function getReminderScheduledDateTime(
  reminder: Pick<Reminder, 'scheduledDate' | 'scheduledTime' | 'snoozedUntil'>,
): Date | null {
  if (reminder.snoozedUntil) {
    const snoozed = new Date(reminder.snoozedUntil);
    if (!Number.isNaN(snoozed.getTime())) {
      return snoozed;
    }
  }
  const baseDate = parseLocalISODate(reminder.scheduledDate);
  if (!baseDate) return null;
  const [hh, mm] = (reminder.scheduledTime || '09:00')
    .split(':')
    .map(n => parseInt(n, 10));
  baseDate.setHours(Number.isNaN(hh) ? 9 : hh, Number.isNaN(mm) ? 0 : mm, 0, 0);
  return baseDate;
}

/**
 * Computes the notification fire timestamp (accounting for remindBeforeMinutes).
 * If snoozedUntil is active, fires exactly at snoozedUntil.
 */
export function getEffectiveFireTimestamp(
  reminder: Pick<
    Reminder,
    'scheduledDate' | 'scheduledTime' | 'snoozedUntil' | 'remindBeforeMinutes'
  >,
): Date | null {
  if (reminder.snoozedUntil) {
    const snoozed = new Date(reminder.snoozedUntil);
    if (!Number.isNaN(snoozed.getTime())) {
      return snoozed;
    }
  }
  const scheduled = getReminderScheduledDateTime(reminder);
  if (!scheduled) return null;
  const offsetMs = (reminder.remindBeforeMinutes || 0) * 60 * 1000;
  return new Date(scheduled.getTime() - offsetMs);
}

/** Returns true if reminder is not done and its scheduled time has passed. */
export function isReminderOverdue(
  reminder: Pick<
    Reminder,
    'done' | 'scheduledDate' | 'scheduledTime' | 'snoozedUntil'
  >,
  now: Date = new Date(),
): boolean {
  if (reminder.done) return false;
  const dt = getReminderScheduledDateTime(reminder);
  if (!dt) return false;
  return dt.getTime() < now.getTime();
}

export function computeReminderStatus(
  reminder: Pick<
    Reminder,
    'done' | 'status' | 'scheduledDate' | 'scheduledTime' | 'snoozedUntil'
  >,
  now: Date = new Date(),
): ReminderStatus {
  if (reminder.done) return 'completed';
  if (reminder.status === 'dismissed') return 'dismissed';
  return isReminderOverdue(reminder, now) ? 'overdue' : 'pending';
}

/** Computes next ISO occurrence date for a recurring reminder, clamping month-end days. */
export function getNextReminderDateISO(
  scheduledDate: string,
  recurrence: ReminderRecurrence,
  today: Date = new Date(),
): string {
  const todayISO = toLocalISODate(today);
  const parsed = parseLocalISODate(scheduledDate) || today;
  const baseISO = toLocalISODate(parsed);
  const anchorISO = baseISO < todayISO ? todayISO : baseISO;
  const anchor = parseLocalISODate(anchorISO) || today;

  switch (recurrence) {
    case 'daily':
      return addDaysToISO(anchorISO, 1);
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
      return addDaysToISO(anchorISO, 7);
    case 'monthly': {
      const targetDay = parsed.getDate();
      const nextMonthFirst = new Date(
        anchor.getFullYear(),
        anchor.getMonth() + 1,
        1,
      );
      const maxDays = new Date(
        nextMonthFirst.getFullYear(),
        nextMonthFirst.getMonth() + 1,
        0,
      ).getDate();
      return toLocalISODate(
        new Date(
          nextMonthFirst.getFullYear(),
          nextMonthFirst.getMonth(),
          Math.min(targetDay, maxDays),
        ),
      );
    }
    case 'yearly': {
      const targetDay = parsed.getDate();
      const targetMonth = parsed.getMonth();
      const nextYear = anchor.getFullYear() + 1;
      const maxDays = new Date(nextYear, targetMonth + 1, 0).getDate();
      return toLocalISODate(
        new Date(nextYear, targetMonth, Math.min(targetDay, maxDays)),
      );
    }
    case 'none':
    default:
      return scheduledDate;
  }
}

/** Human-readable relative countdown or overdue age. */
export function formatTimeUntil(
  targetDate: Date,
  now: Date = new Date(),
): string {
  const diffMs = targetDate.getTime() - now.getTime();
  const absMins = Math.round(Math.abs(diffMs) / 60000);

  if (absMins < 1) {
    return diffMs >= 0 ? 'now' : 'just now';
  }

  const days = Math.floor(absMins / 1440);
  const hours = Math.floor((absMins % 1440) / 60);
  const mins = absMins % 60;

  let span = '';
  if (days > 0) {
    span = hours > 0 ? `${days}d ${hours}h` : `${days}d`;
  } else if (hours > 0) {
    span = mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  } else {
    span = `${mins}m`;
  }

  return diffMs >= 0 ? `in ${span}` : `${span} overdue`;
}

/** Normalizes a date input (ISO or display label) into ISO 'YYYY-MM-DD' + display label. */
export function normalizeReminderScheduleDate(
  input?: string | null,
  today: Date = new Date(),
): { scheduledDate: string; displayDate: string } {
  const todayISO = toLocalISODate(today);
  const res = normalizeTaskDateInput(input, today);
  const scheduledDate = res.dueDate || todayISO;
  return {
    scheduledDate,
    displayDate: formatDisplayDate(scheduledDate, todayISO),
  };
}

/** Default time rounded up to the next hour (used for new reminder creation). */
export function getDefaultReminderTime24h(now: Date = new Date()): string {
  const next = new Date(now.getTime() + 60 * 60 * 1000);
  next.setMinutes(0, 0, 0);
  return `${String(next.getHours()).padStart(2, '0')}:00`;
}
