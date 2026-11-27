import { Colors } from '../../Assets/StyleUtilities/Colors';
import {
  formatDisplayDate,
  toLocalISODate,
} from '../../Utils/taskDateUtils';
import {
  computeReminderStatus,
  format24hTo12h,
  formatRecurrenceLabel,
  formatRemindBeforeLabel,
  getDefaultReminderTime24h,
  getNextReminderDateISO,
  getReminderScheduledDateTime,
  normalizeReminderRecurrence,
  normalizeReminderScheduleDate,
  normalizeRemindBeforeMinutes,
  to24HourTime,
} from '../../Utils/reminderDateUtils';
import { AddReminderInput, Reminder } from './types';

export function resolveReminderCategoryColor(category: string): string {
  switch (category) {
    case 'health':
    case 'sport':
      return Colors.AccentGreen;
    case 'work':
    case 'works':
      return Colors.LavenderPurple;
    case 'events':
      return Colors.AccentAmber;
    case 'daily':
    default:
      return Colors.AccentYellow;
  }
}

export function normalizeReminderCategory(category?: string): string {
  if (!category) return 'daily';
  const clean = category.trim().toLowerCase();
  if (clean === 'works') return 'work';
  if (clean === 'sport') return 'health';
  return clean;
}

export function buildNotificationId(
  id: string,
  scheduledDate: string,
  scheduledTime: string,
): string {
  return `rem_${id}_${scheduledDate}_${scheduledTime.replace(':', '')}`;
}

export function createReminderEntity(
  data: AddReminderInput,
  now: Date = new Date(),
): Reminder {
  const todayISO = toLocalISODate(now);
  const scheduledDate = data.scheduledDate
    ? data.scheduledDate
    : data.date
    ? normalizeReminderScheduleDate(data.date, now).scheduledDate
    : todayISO;

  const scheduledTime = data.scheduledTime
    ? to24HourTime(data.scheduledTime)
    : data.time
    ? to24HourTime(data.time)
    : getDefaultReminderTime24h(now);

  const recurrence =
    data.recurrence ?? normalizeReminderRecurrence(data.repeat);
  const remindBeforeMinutes =
    data.remindBeforeMinutes ?? normalizeRemindBeforeMinutes(data.remindBefore);
  const category = normalizeReminderCategory(data.category);
  const id = `${Date.now()}-${Math.floor(Math.random() * 1000)}`;

  const base: Reminder = {
    id,
    title: data.title.replace(/[\r\n]+/g, ' ').trim(),
    notes: data.notes?.trim() || undefined,
    scheduledDate,
    scheduledTime,
    date: formatDisplayDate(scheduledDate, todayISO),
    time: format24hTo12h(scheduledTime),
    category,
    recurrence,
    repeat: formatRecurrenceLabel(recurrence),
    done: false,
    status: 'pending',
    snoozedUntil: null,
    notificationId: buildNotificationId(id, scheduledDate, scheduledTime),
    remindBeforeMinutes,
    remindBefore: formatRemindBeforeLabel(remindBeforeMinutes),
    urgentAlarm: data.urgentAlarm ?? false,
    voiceNudge: data.voiceNudge ?? true,
    sound: data.sound || 'Gentle Bell',
    color: resolveReminderCategoryColor(category),
    createdAt: now.toISOString(),
    completedAt: null,
  };

  return {
    ...base,
    status: computeReminderStatus(base, now),
  };
}

export function updateReminderEntity(
  existing: Reminder,
  updates: Partial<Omit<Reminder, 'id'>>,
  now: Date = new Date(),
): Reminder {
  const todayISO = toLocalISODate(now);

  let scheduledDate = existing.scheduledDate;
  if (updates.scheduledDate !== undefined) {
    scheduledDate = updates.scheduledDate;
  } else if (updates.date !== undefined) {
    scheduledDate = normalizeReminderScheduleDate(updates.date, now)
      .scheduledDate;
  }

  let scheduledTime = existing.scheduledTime;
  if (updates.scheduledTime !== undefined) {
    scheduledTime = to24HourTime(updates.scheduledTime);
  } else if (updates.time !== undefined) {
    scheduledTime = to24HourTime(updates.time);
  }

  const recurrence =
    updates.recurrence ??
    (updates.repeat !== undefined
      ? normalizeReminderRecurrence(updates.repeat)
      : existing.recurrence);

  const remindBeforeMinutes =
    updates.remindBeforeMinutes ??
    (updates.remindBefore !== undefined
      ? normalizeRemindBeforeMinutes(updates.remindBefore)
      : existing.remindBeforeMinutes);

  const category = updates.category
    ? normalizeReminderCategory(updates.category)
    : existing.category;

  const merged: Reminder = {
    ...existing,
    ...updates,
    category,
    scheduledDate,
    scheduledTime,
    date: formatDisplayDate(scheduledDate, todayISO),
    time: format24hTo12h(scheduledTime),
    recurrence,
    repeat: formatRecurrenceLabel(recurrence),
    remindBeforeMinutes,
    remindBefore: formatRemindBeforeLabel(remindBeforeMinutes),
    color: updates.color || resolveReminderCategoryColor(category),
  };

  return {
    ...merged,
    status: computeReminderStatus(merged, now),
  };
}

export function hydrateStoredReminder(
  raw: Partial<Reminder>,
  now: Date = new Date(),
): Reminder {
  const todayISO = toLocalISODate(now);
  const scheduledDate = raw.scheduledDate
    ? raw.scheduledDate
    : normalizeReminderScheduleDate(raw.date, now).scheduledDate;
  const scheduledTime = raw.scheduledTime
    ? to24HourTime(raw.scheduledTime)
    : to24HourTime(raw.time);
  const recurrence =
    raw.recurrence ?? normalizeReminderRecurrence(raw.repeat);
  const remindBeforeMinutes =
    raw.remindBeforeMinutes ?? normalizeRemindBeforeMinutes(raw.remindBefore);
  const category = normalizeReminderCategory(raw.category);
  const id = raw.id || `${Date.now()}-${Math.floor(Math.random() * 1000)}`;

  const hydrated: Reminder = {
    id,
    title: raw.title || 'Untitled Reminder',
    notes: raw.notes,
    scheduledDate,
    scheduledTime,
    date: formatDisplayDate(scheduledDate, todayISO),
    time: format24hTo12h(scheduledTime),
    category,
    recurrence,
    repeat: formatRecurrenceLabel(recurrence),
    done: Boolean(raw.done),
    status: raw.status || (raw.done ? 'completed' : 'pending'),
    snoozedUntil: raw.snoozedUntil ?? null,
    notificationId:
      raw.notificationId ||
      buildNotificationId(id, scheduledDate, scheduledTime),
    remindBeforeMinutes,
    remindBefore: formatRemindBeforeLabel(remindBeforeMinutes),
    urgentAlarm: Boolean(raw.urgentAlarm),
    voiceNudge: raw.voiceNudge ?? true,
    sound: raw.sound || 'Gentle Bell',
    color: raw.color || resolveReminderCategoryColor(category),
    createdAt: raw.createdAt || now.toISOString(),
    completedAt: raw.completedAt ?? null,
  };

  return {
    ...hydrated,
    status: computeReminderStatus(hydrated, now),
  };
}

export function createNextOccurrenceReminder(
  completedReminder: Reminder,
  now: Date = new Date(),
): Reminder | null {
  if (!completedReminder.recurrence || completedReminder.recurrence === 'none') {
    return null;
  }

  const todayISO = toLocalISODate(now);
  const nextDateISO = getNextReminderDateISO(
    completedReminder.scheduledDate,
    completedReminder.recurrence,
    now,
  );
  const id = `${Date.now()}-${Math.floor(Math.random() * 1000)}`;

  const next: Reminder = {
    ...completedReminder,
    id,
    scheduledDate: nextDateISO,
    date: formatDisplayDate(nextDateISO, todayISO),
    done: false,
    status: 'pending',
    snoozedUntil: null,
    notificationId: buildNotificationId(
      id,
      nextDateISO,
      completedReminder.scheduledTime,
    ),
    createdAt: now.toISOString(),
    completedAt: null,
  };

  return {
    ...next,
    status: computeReminderStatus(next, now),
  };
}

export function sortRemindersBySchedule(reminders: Reminder[]): Reminder[] {
  return [...reminders].sort((a, b) => {
    const dtA = getReminderScheduledDateTime(a)?.getTime() ?? Number.MAX_SAFE_INTEGER;
    const dtB = getReminderScheduledDateTime(b)?.getTime() ?? Number.MAX_SAFE_INTEGER;
    if (dtA !== dtB) return dtA - dtB;
    return a.title.localeCompare(b.title);
  });
}

export function getNextUpcomingReminder(
  reminders: Reminder[],
  now: Date = new Date(),
): Reminder | null {
  const pending = sortRemindersBySchedule(reminders.filter(r => !r.done));
  if (pending.length === 0) return null;
  const future = pending.find(r => {
    const dt = getReminderScheduledDateTime(r);
    return dt ? dt.getTime() >= now.getTime() : false;
  });
  return future || pending[0];
}
