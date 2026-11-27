import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import notifee, {
  AndroidImportance,
  AndroidCategory,
  AuthorizationStatus,
  EventType,
  RepeatFrequency,
  TimestampTrigger,
  TriggerType,
  Event,
} from '@notifee/react-native';
import { Reminder } from './types';
import {
  getEffectiveFireTimestamp,
  format24hTo12h,
} from '../../Utils/reminderDateUtils';
import { buildNotificationId, createNextOccurrenceReminder } from './ReminderService';

export const REMINDERS_STORAGE_KEY = '@regius_reminders_v2';
export const NOTIFICATION_PERMISSION_ASKED_KEY = '@regius_notif_asked_v1';

const CHANNEL_DEFAULT = 'regius_reminders';
const CHANNEL_URGENT = 'regius_reminders_urgent';
const IOS_CATEGORY_REMINDER = 'REMINDER_ACTIONS';

export interface ForegroundNotificationCallbacks {
  onDelivered?: (reminderId: string, title: string, body?: string) => void;
  onPressReminder?: (reminderId: string) => void;
  onActionComplete?: (reminderId: string) => void;
  onActionSnooze?: (reminderId: string, minutes: number) => void;
}

class ReminderNotificationServiceImpl {
  private initialized = false;

  async init(): Promise<void> {
    if (this.initialized) return;
    try {
      if (Platform.OS === 'android') {
        await notifee.createChannel({
          id: CHANNEL_DEFAULT,
          name: 'Reminders',
          description: 'Scheduled reminder alerts and gentle nudges',
          importance: AndroidImportance.HIGH,
          sound: 'default',
          vibration: true,
        });

        await notifee.createChannel({
          id: CHANNEL_URGENT,
          name: 'Urgent Reminders',
          description: 'High-priority time-sensitive alerts',
          importance: AndroidImportance.HIGH,
          sound: 'default',
          vibration: true,
          vibrationPattern: [300, 500, 300, 500],
        });
      }

      if (Platform.OS === 'ios') {
        await notifee.setNotificationCategories([
          {
            id: IOS_CATEGORY_REMINDER,
            actions: [
              { id: 'complete', title: 'Complete' },
              { id: 'snooze', title: 'Snooze 10m' },
            ],
          },
        ]);
      }
      this.initialized = true;
    } catch {
      // Safe no-op in environments without native Notifee bridge (e.g. Jest)
    }
  }

  async hasPermission(): Promise<boolean> {
    try {
      const settings = await notifee.getNotificationSettings();
      return (
        settings.authorizationStatus === AuthorizationStatus.AUTHORIZED ||
        settings.authorizationStatus === AuthorizationStatus.PROVISIONAL
      );
    } catch {
      return false;
    }
  }

  async requestPermission(): Promise<boolean> {
    try {
      await AsyncStorage.setItem(NOTIFICATION_PERMISSION_ASKED_KEY, 'true');
      const settings = await notifee.requestPermission({
        alert: true,
        badge: true,
        sound: true,
      });
      return (
        settings.authorizationStatus === AuthorizationStatus.AUTHORIZED ||
        settings.authorizationStatus === AuthorizationStatus.PROVISIONAL
      );
    } catch {
      return false;
    }
  }

  async hasAskedPermissionBefore(): Promise<boolean> {
    try {
      const val = await AsyncStorage.getItem(NOTIFICATION_PERMISSION_ASKED_KEY);
      return val === 'true';
    } catch {
      return false;
    }
  }

  async cancelNotification(notificationId?: string | null): Promise<void> {
    if (!notificationId) return;
    try {
      await notifee.cancelNotification(notificationId);
    } catch {
      // Idempotent cancel
    }
  }

  async scheduleReminder(reminder: Reminder, warmBody?: string): Promise<string | undefined> {
    if (reminder.done || reminder.status === 'dismissed') {
      await this.cancelNotification(reminder.notificationId);
      return undefined;
    }

    await this.init();

    if (reminder.notificationId) {
      await this.cancelNotification(reminder.notificationId);
    }

    const fireDate = getEffectiveFireTimestamp(reminder);
    if (!fireDate || fireDate.getTime() <= Date.now()) {
      return undefined;
    }

    const notificationId =
      reminder.notificationId ||
      buildNotificationId(
        reminder.id,
        reminder.scheduledDate,
        reminder.scheduledTime,
      );

    let repeatFrequency: RepeatFrequency | undefined;
    if (!reminder.snoozedUntil) {
      if (reminder.recurrence === 'daily') {
        repeatFrequency = RepeatFrequency.DAILY;
      } else if (reminder.recurrence === 'weekly') {
        repeatFrequency = RepeatFrequency.WEEKLY;
      }
    }

    const trigger: TimestampTrigger = {
      type: TriggerType.TIMESTAMP,
      timestamp: fireDate.getTime(),
      ...(repeatFrequency !== undefined ? { repeatFrequency } : {}),
      alarmManager: {
        allowWhileIdle: true,
      },
    };

    const subtitleTime = format24hTo12h(reminder.scheduledTime);
    const body = warmBody
      ?? (reminder.notes ? `${subtitleTime} · ${reminder.notes}` : `Scheduled for ${subtitleTime}`);

    try {
      await notifee.createTriggerNotification(
        {
          id: notificationId,
          title: reminder.urgentAlarm
            ? `Urgent: ${reminder.title}`
            : reminder.title,
          body,
          data: {
            reminderId: reminder.id,
            type: 'reminder',
          },
          android: {
            channelId: reminder.urgentAlarm ? CHANNEL_URGENT : CHANNEL_DEFAULT,
            category: reminder.urgentAlarm
              ? AndroidCategory.ALARM
              : AndroidCategory.REMINDER,
            pressAction: { id: 'default' },
            actions: [
              { title: 'Complete', pressAction: { id: 'complete' } },
              { title: 'Snooze 10m', pressAction: { id: 'snooze' } },
            ],
          },
          ios: {
            categoryId: IOS_CATEGORY_REMINDER,
            sound: 'default',
            interruptionLevel: reminder.urgentAlarm ? 'timeSensitive' : 'active',
          },
        },
        trigger,
      );
      return notificationId;
    } catch {
      return undefined;
    }
  }

  async snoozeReminder(
    reminder: Reminder,
    offsetMinutes: number,
    warmBody?: string,
  ): Promise<{ notificationId?: string; snoozedUntil: string }> {
    const snoozeDate = new Date(Date.now() + offsetMinutes * 60 * 1000);
    const snoozedUntil = snoozeDate.toISOString();
    const updated: Reminder = {
      ...reminder,
      done: false,
      status: 'pending',
      snoozedUntil,
    };
    const notificationId = await this.scheduleReminder(updated, warmBody);
    return { notificationId, snoozedUntil };
  }

  /**
   * Reconciles OS-scheduled trigger notifications with stored reminders.
   * Respects iOS 64-pending-notification limit by prioritizing soonest reminders.
   */
  async syncNotificationsWithStorage(
    reminders: Reminder[],
    warmBodyProvider?: (reminder: Reminder) => string | undefined,
  ): Promise<void> {
    try {
      await this.init();
      const permitted = await this.hasPermission();
      if (!permitted) return;

      const scheduledIds = new Set(await notifee.getTriggerNotificationIds());
      const now = Date.now();

      const activeFuture = reminders
        .filter(r => {
          if (r.done || r.status === 'dismissed') return false;
          const fireDate = getEffectiveFireTimestamp(r);
          return fireDate !== null && fireDate.getTime() > now;
        })
        .sort((a, b) => {
          const tA = getEffectiveFireTimestamp(a)?.getTime() ?? 0;
          const tB = getEffectiveFireTimestamp(b)?.getTime() ?? 0;
          return tA - tB;
        });

      // Cap at 56 to stay safely under iOS 64 local notification limit
      const capped = Platform.OS === 'ios' ? activeFuture.slice(0, 56) : activeFuture;
      const desiredIds = new Set(
        capped
          .map(
            r =>
              r.notificationId ||
              buildNotificationId(r.id, r.scheduledDate, r.scheduledTime),
          )
          .filter(Boolean),
      );

      // Cancel stale reminder triggers
      for (const existingId of scheduledIds) {
        if (existingId.startsWith('rem_') && !desiredIds.has(existingId)) {
          await this.cancelNotification(existingId);
        }
      }

      // Schedule missing triggers
      for (const rem of capped) {
        const expectedId =
          rem.notificationId ||
          buildNotificationId(rem.id, rem.scheduledDate, rem.scheduledTime);
        if (!scheduledIds.has(expectedId)) {
          const warmBody = warmBodyProvider ? warmBodyProvider(rem) : undefined;
          await this.scheduleReminder(rem, warmBody);
        }
      }
    } catch {
      // Non-fatal in background/test environments
    }
  }

  setupForegroundHandler(
    callbacks: ForegroundNotificationCallbacks,
  ): () => void {
    try {
      return notifee.onForegroundEvent((event: Event) => {
        const reminderId = event.detail.notification?.data?.reminderId as
          | string
          | undefined;
        if (!reminderId) return;

        if (event.type === EventType.DELIVERED) {
          callbacks.onDelivered?.(
            reminderId,
            event.detail.notification?.title || 'Reminder',
            event.detail.notification?.body,
          );
        } else if (event.type === EventType.PRESS) {
          callbacks.onPressReminder?.(reminderId);
        } else if (event.type === EventType.ACTION_PRESS) {
          const actionId = event.detail.pressAction?.id;
          if (actionId === 'complete') {
            callbacks.onActionComplete?.(reminderId);
          } else if (actionId === 'snooze') {
            callbacks.onActionSnooze?.(reminderId, 10);
          }
        }
      });
    } catch {
      return () => {};
    }
  }

  registerBackgroundHandler(): void {
    try {
      notifee.onBackgroundEvent(async (event: Event) => {
        const reminderId = event.detail.notification?.data?.reminderId as
          | string
          | undefined;
        if (!reminderId || event.type !== EventType.ACTION_PRESS) return;

        const actionId = event.detail.pressAction?.id;
        if (actionId !== 'complete' && actionId !== 'snooze') return;

        try {
          const raw = await AsyncStorage.getItem(REMINDERS_STORAGE_KEY);
          if (!raw) return;
          const list: Reminder[] = JSON.parse(raw);
          if (!Array.isArray(list)) return;

          const now = new Date();
          let spawned: Reminder | null = null;
          const updatedList = list.map(r => {
            if (r.id !== reminderId) return r;
            if (actionId === 'complete') {
              const completed: Reminder = {
                ...r,
                done: true,
                status: 'completed',
                completedAt: now.toISOString(),
                snoozedUntil: null,
              };
              spawned = createNextOccurrenceReminder(completed, now);
              return completed;
            }
            const snoozeDate = new Date(now.getTime() + 10 * 60 * 1000);
            return {
              ...r,
              done: false,
              status: 'pending' as const,
              snoozedUntil: snoozeDate.toISOString(),
            };
          });

          const finalList = spawned ? [spawned, ...updatedList] : updatedList;
          await AsyncStorage.setItem(
            REMINDERS_STORAGE_KEY,
            JSON.stringify(finalList),
          );

          if (actionId === 'complete') {
            await this.cancelNotification(event.detail.notification?.id);
            if (spawned) {
              await this.scheduleReminder(spawned);
            }
          } else if (actionId === 'snooze') {
            const target = finalList.find(r => r.id === reminderId);
            if (target) {
              await this.scheduleReminder(target);
            }
          }
        } catch {
          // Safe background fallback
        }
      });
    } catch {
      // Safe no-op in Jest
    }
  }
}

export const ReminderNotificationService = new ReminderNotificationServiceImpl();
