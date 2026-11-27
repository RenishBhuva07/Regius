export type ReminderRecurrence =
  | 'none'
  | 'daily'
  | 'weekdays'
  | 'weekly'
  | 'monthly'
  | 'yearly';

export type ReminderStatus =
  | 'pending'
  | 'overdue'
  | 'completed'
  | 'dismissed';

export type RemindBefore = 0 | 5 | 15 | 60 | 1440;

export interface Reminder {
  id: string;
  title: string;
  notes?: string;

  /** Canonical ISO 8601 date ('YYYY-MM-DD') */
  scheduledDate: string;
  /** Canonical 24-hour time ('HH:MM') */
  scheduledTime: string;

  /** Display-formatted time ('04:30 PM') kept in sync for UI & legacy consumers */
  time: string;
  /** Display-formatted date ('Today', 'Tomorrow', 'Sat, Nov 28') kept in sync */
  date: string;

  category: string;
  recurrence: ReminderRecurrence;
  /** Display-formatted repeat label ('Once', 'Daily', etc.) */
  repeat: string;

  done: boolean;
  status: ReminderStatus;
  snoozedUntil?: string | null;

  notificationId?: string;
  remindBeforeMinutes: RemindBefore;
  remindBefore?: string;
  urgentAlarm: boolean;
  voiceNudge: boolean;
  sound?: string;
  color?: string;

  createdAt: string;
  completedAt?: string | null;
}

export interface AddReminderInput {
  title: string;
  notes?: string;
  scheduledDate?: string;
  scheduledTime?: string;
  time?: string;
  date?: string;
  category?: string;
  recurrence?: ReminderRecurrence;
  repeat?: string;
  remindBeforeMinutes?: RemindBefore;
  remindBefore?: string;
  sound?: string;
  urgentAlarm?: boolean;
  voiceNudge?: boolean;
}
