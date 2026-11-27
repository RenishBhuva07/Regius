import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  useCallback,
  useEffect,
  useRef,
  ReactNode,
} from 'react';
import { AppState, AppStateStatus } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import { Colors } from '../Assets/StyleUtilities/Colors';
import { toLocalISODate, addDaysToISO, formatDisplayDate } from '../Utils/taskDateUtils';
import {
  computeReminderStatus,
  format24hTo12h,
  getDefaultReminderTime24h,
  getReminderScheduledDateTime,
} from '../Utils/reminderDateUtils';
import {
  AddReminderInput,
  Reminder,
  ReminderRecurrence,
  ReminderStatus,
  RemindBefore,
} from '../Services/Reminders/types';
import {
  createNextOccurrenceReminder,
  createReminderEntity,
  hydrateStoredReminder,
  updateReminderEntity,
} from '../Services/Reminders/ReminderService';
import {
  REMINDERS_STORAGE_KEY,
  ReminderNotificationService,
} from '../Services/Reminders/ReminderNotificationService';
import { navigationRef } from '../Navigators/Navigator';
import { VoiceSettingsService } from '../Services/VoiceSettingsService';
import { RegiusSpeechService } from '../Services/RegiusSpeechService';
import { ReminderVoiceScriptService } from '../Services/Reminders/ReminderVoiceScriptService';

export type { Reminder, ReminderRecurrence, ReminderStatus, RemindBefore, AddReminderInput };

const TODAY_ISO = toLocalISODate();
const TOMORROW_ISO = addDaysToISO(TODAY_ISO, 1);
const SEED_CREATED_AT = new Date().toISOString();

export const INITIAL_REMINDERS: Reminder[] = [
  {
    id: '1',
    title: 'Morning Meditation & Breathing',
    notes: '15 mins mindfulness',
    scheduledDate: TODAY_ISO,
    scheduledTime: '07:30',
    time: '07:30 AM',
    date: 'Today',
    category: 'health',
    recurrence: 'daily',
    repeat: 'Daily',
    done: false,
    status: 'pending',
    remindBeforeMinutes: 5,
    remindBefore: '5 mins before',
    urgentAlarm: false,
    voiceNudge: true,
    sound: 'Gentle Bell',
    color: Colors.AccentGreen,
    createdAt: SEED_CREATED_AT,
    completedAt: null,
  },
  {
    id: '2',
    title: 'Product Strategy Sync Call',
    notes: 'Google Meet with product team',
    scheduledDate: TODAY_ISO,
    scheduledTime: '11:00',
    time: '11:00 AM',
    date: 'Today',
    category: 'work',
    recurrence: 'none',
    repeat: 'Once',
    done: true,
    status: 'completed',
    remindBeforeMinutes: 5,
    remindBefore: '5 mins before',
    urgentAlarm: false,
    voiceNudge: true,
    sound: 'Gentle Bell',
    color: Colors.LavenderPurple,
    createdAt: SEED_CREATED_AT,
    completedAt: SEED_CREATED_AT,
  },
  {
    id: '3',
    title: 'Hydration & 2L Water Refill',
    notes: 'Keep bottle full',
    scheduledDate: TODAY_ISO,
    scheduledTime: '14:00',
    time: '02:00 PM',
    date: 'Today',
    category: 'daily',
    recurrence: 'daily',
    repeat: 'Daily',
    done: false,
    status: 'pending',
    remindBeforeMinutes: 0,
    remindBefore: 'At time of event',
    urgentAlarm: false,
    voiceNudge: true,
    sound: 'Gentle Bell',
    color: Colors.AccentYellow,
    createdAt: SEED_CREATED_AT,
    completedAt: null,
  },
  {
    id: '4',
    title: 'Evening Workout & Cardio',
    notes: 'Gym session',
    scheduledDate: TODAY_ISO,
    scheduledTime: '18:30',
    time: '06:30 PM',
    date: 'Today',
    category: 'health',
    recurrence: 'daily',
    repeat: 'Daily',
    done: false,
    status: 'pending',
    remindBeforeMinutes: 15,
    remindBefore: '15 mins before',
    urgentAlarm: false,
    voiceNudge: true,
    sound: 'Gentle Bell',
    color: Colors.AccentGreen,
    createdAt: SEED_CREATED_AT,
    completedAt: null,
  },
  {
    id: '5',
    title: 'Quarterly Team Dinner',
    notes: 'Downtown bistro',
    scheduledDate: TOMORROW_ISO,
    scheduledTime: '20:00',
    time: '08:00 PM',
    date: 'Tomorrow',
    category: 'events',
    recurrence: 'none',
    repeat: 'Once',
    done: false,
    status: 'pending',
    remindBeforeMinutes: 60,
    remindBefore: '1 hour before',
    urgentAlarm: false,
    voiceNudge: true,
    sound: 'Gentle Bell',
    color: Colors.AccentAmber,
    createdAt: SEED_CREATED_AT,
    completedAt: null,
  },
];

export interface ReminderModalPrefill {
  title?: string;
  scheduledDate?: string;
  scheduledTime?: string;
  category?: string;
}

interface ReminderContextType {
  reminders: Reminder[];
  isRemindersHydrated: boolean;
  hasNotificationPermission: boolean;
  isPermissionSheetVisible: boolean;
  addReminder: (data: AddReminderInput) => Reminder | null;
  toggleReminder: (id: string) => Reminder | null;
  updateReminder: (
    id: string,
    updates: Partial<Omit<Reminder, 'id'>>,
  ) => Reminder | null;
  deleteReminder: (id: string) => void;
  snoozeReminder: (id: string, offsetMinutes: number) => Promise<Reminder | null>;
  rescheduleReminder: (
    id: string,
    scheduledDate: string,
    scheduledTime?: string,
  ) => Reminder | null;
  rescheduleOverdueToToday: (targetIds?: string[]) => number;
  completeAllReminders: (targetIds?: string[]) => number;
  restoreAllReminders: (targetIds?: string[]) => number;
  requestNotificationPermission: () => Promise<boolean>;
  dismissPermissionSheet: () => void;
  openPermissionSheet: () => void;
  isReminderModalOpen: boolean;
  reminderModalPrefill: ReminderModalPrefill | null;
  openReminderModal: (prefill?: ReminderModalPrefill) => void;
  closeReminderModal: () => void;
}

const ReminderContext = createContext<ReminderContextType>({
  reminders: INITIAL_REMINDERS,
  isRemindersHydrated: false,
  hasNotificationPermission: false,
  isPermissionSheetVisible: false,
  addReminder: () => null,
  toggleReminder: () => null,
  updateReminder: () => null,
  deleteReminder: () => {},
  snoozeReminder: async () => null,
  rescheduleReminder: () => null,
  rescheduleOverdueToToday: () => 0,
  completeAllReminders: () => 0,
  restoreAllReminders: () => 0,
  requestNotificationPermission: async () => false,
  dismissPermissionSheet: () => {},
  openPermissionSheet: () => {},
  isReminderModalOpen: false,
  reminderModalPrefill: null,
  openReminderModal: () => {},
  closeReminderModal: () => {},
});

export const ReminderProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [reminders, setReminders] = useState<Reminder[]>(INITIAL_REMINDERS);
  const [isRemindersHydrated, setIsRemindersHydrated] = useState(false);
  const [hasNotificationPermission, setHasNotificationPermission] =
    useState(false);
  const [isPermissionSheetVisible, setIsPermissionSheetVisible] =
    useState(false);
  const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);
  const [reminderModalPrefill, setReminderModalPrefill] =
    useState<ReminderModalPrefill | null>(null);

  const hasHydratedRef = useRef(false);
  const remindersRef = useRef<Reminder[]>(reminders);
  remindersRef.current = reminders;

  // Voice reminder state
  const voiceRemindersEnabledRef = useRef(true);
  const isSpeakingReminderRef = useRef(false);
  // Promise chain queues concurrent voice deliveries to prevent overlap
  const voiceDeliveryQueueRef = useRef<Promise<void>>(Promise.resolve());

  // Hydrate from AsyncStorage on mount
  useEffect(() => {
    let mounted = true;
    const hydrate = async () => {
      try {
        const [storedRaw, permitted, voiceSettings] = await Promise.all([
          AsyncStorage.getItem(REMINDERS_STORAGE_KEY),
          ReminderNotificationService.hasPermission(),
          VoiceSettingsService.getSettings(),
        ]);
        if (!mounted) return;
        setHasNotificationPermission(permitted);
        voiceRemindersEnabledRef.current = voiceSettings.voiceRemindersEnabled;

        // Warm the user & assistant names into the script service cache
        await ReminderVoiceScriptService.resolveAndCachePreferences().catch(() => {});

        let initialList = INITIAL_REMINDERS;
        if (storedRaw) {
          const parsed = JSON.parse(storedRaw);
          if (Array.isArray(parsed)) {
            initialList = parsed.map(item => hydrateStoredReminder(item));
          }
        } else {
          initialList = INITIAL_REMINDERS.map(item =>
            hydrateStoredReminder(item),
          );
        }

        setReminders(initialList);
        if (permitted) {
          ReminderNotificationService.syncNotificationsWithStorage(
            initialList,
            r =>
              r.voiceNudge
                ? ReminderVoiceScriptService.generateNotificationBody(r)
                : undefined,
          ).catch(() => {});
        }
      } catch {
        // Fallback silently to seed reminders
      } finally {
        if (mounted) {
          hasHydratedRef.current = true;
          setIsRemindersHydrated(true);
        }
      }
    };

    hydrate();
    return () => {
      mounted = false;
    };
  }, []);

  // Persist on every mutation after hydration
  useEffect(() => {
    if (!hasHydratedRef.current) return;
    AsyncStorage.setItem(
      REMINDERS_STORAGE_KEY,
      JSON.stringify(reminders),
    ).catch(() => {});
  }, [reminders]);

  // Refresh overdue status & notification permission when app returns to foreground
  useEffect(() => {
    const handleAppState = async (nextState: AppStateStatus) => {
      if (nextState !== 'active') return;
      const now = new Date();
      setReminders(prev =>
        prev.map(r => {
          const nextStatus = computeReminderStatus(r, now);
          return nextStatus === r.status ? r : { ...r, status: nextStatus };
        }),
      );
      const permitted = await ReminderNotificationService.hasPermission();
      setHasNotificationPermission(permitted);
    };

    const sub = AppState.addEventListener('change', handleAppState);
    return () => sub.remove();
  }, []);

  const addReminder = useCallback((data: AddReminderInput): Reminder | null => {
    if (!data.title.trim()) return null;
    const newRem = createReminderEntity(data);
    setReminders(prev => [newRem, ...prev]);

    ReminderNotificationService.hasPermission().then(async permitted => {
      setHasNotificationPermission(permitted);
      if (permitted) {
        // Generate warm notification body for background delivery
        const warmBody = newRem.voiceNudge
          ? ReminderVoiceScriptService.generateNotificationBody(newRem)
          : undefined;
        await ReminderNotificationService.scheduleReminder(newRem, warmBody);
        // Pre-warm TTS cache for instant foreground delivery
        ReminderVoiceScriptService.prewarmScript(newRem).catch(() => {});
      } else {
        const asked = await ReminderNotificationService.hasAskedPermissionBefore();
        if (!asked) {
          setIsPermissionSheetVisible(true);
        }
      }
    });

    return newRem;
  }, []);

  const toggleReminder = useCallback((id: string): Reminder | null => {
    const now = new Date();
    let updatedRem: Reminder | null = null;
    let spawnedNext: Reminder | null = null;

    setReminders(prev => {
      const nextList: Reminder[] = [];
      for (const r of prev) {
        if (r.id === id) {
          const nextDone = !r.done;
          updatedRem = {
            ...r,
            done: nextDone,
            status: nextDone ? 'completed' : computeReminderStatus({ ...r, done: false }, now),
            completedAt: nextDone ? now.toISOString() : null,
            snoozedUntil: nextDone ? null : r.snoozedUntil,
          };
          nextList.push(updatedRem);

          if (nextDone) {
            ReminderNotificationService.cancelNotification(r.notificationId).catch(
              () => {},
            );
            spawnedNext = createNextOccurrenceReminder(updatedRem, now);
            if (spawnedNext) {
              ReminderNotificationService.scheduleReminder(spawnedNext).catch(
                () => {},
              );
            }
          } else {
            ReminderNotificationService.scheduleReminder(updatedRem).catch(
              () => {},
            );
          }
        } else {
          nextList.push(r);
        }
      }
      return spawnedNext ? [spawnedNext, ...nextList] : nextList;
    });

    return updatedRem;
  }, []);

  const updateReminder = useCallback(
    (
      id: string,
      updates: Partial<Omit<Reminder, 'id'>>,
    ): Reminder | null => {
      let updated: Reminder | null = null;
      setReminders(prev =>
        prev.map(r => {
          if (r.id === id) {
            ReminderNotificationService.cancelNotification(r.notificationId).catch(
              () => {},
            );
            updated = updateReminderEntity(r, updates);
            if (!updated.done) {
              const warmBody = updated.voiceNudge
                ? ReminderVoiceScriptService.generateNotificationBody(updated)
                : undefined;
              ReminderNotificationService.scheduleReminder(updated, warmBody).catch(
                () => {},
              );
            }
            return updated;
          }
          return r;
        }),
      );
      return updated;
    },
    [],
  );

  const deleteReminder = useCallback((id: string) => {
    const target = remindersRef.current.find(r => r.id === id);
    if (target?.notificationId) {
      ReminderNotificationService.cancelNotification(target.notificationId).catch(
        () => {},
      );
    }
    setReminders(prev => prev.filter(r => r.id !== id));
  }, []);

  const snoozeReminder = useCallback(
    async (id: string, offsetMinutes: number): Promise<Reminder | null> => {
      const target = remindersRef.current.find(r => r.id === id);
      if (!target) return null;

      const warmBody = target.voiceNudge
        ? ReminderVoiceScriptService.generateNotificationBody(target)
        : undefined;

      const { notificationId, snoozedUntil } =
        await ReminderNotificationService.snoozeReminder(target, offsetMinutes, warmBody);

      let updated: Reminder | null = null;
      setReminders(prev =>
        prev.map(r => {
          if (r.id === id) {
            updated = {
              ...r,
              done: false,
              status: 'pending',
              snoozedUntil,
              notificationId: notificationId || r.notificationId,
            };
            return updated;
          }
          return r;
        }),
      );
      return updated;
    },
    [],
  );

  const rescheduleReminder = useCallback(
    (
      id: string,
      scheduledDate: string,
      scheduledTime?: string,
    ): Reminder | null => {
      const updates: Partial<Omit<Reminder, 'id'>> = {
        scheduledDate,
        snoozedUntil: null,
        done: false,
      };
      if (scheduledTime) {
        updates.scheduledTime = scheduledTime;
      }
      return updateReminder(id, updates);
    },
    [updateReminder],
  );

  const rescheduleOverdueToToday = useCallback(
    (targetIds?: string[]): number => {
      const now = new Date();
      const todayISO = toLocalISODate(now);
      const displayToday = formatDisplayDate(todayISO, todayISO);
      const idsSet = targetIds ? new Set(targetIds) : null;
      let movedCount = 0;

      setReminders(prev =>
        prev.map(r => {
          if (r.done) return r;
          if (idsSet && !idsSet.has(r.id)) return r;
          const dt = getReminderScheduledDateTime(r);
          if (!dt || dt.getTime() >= now.getTime()) return r;

          movedCount += 1;
          // If the reminder's time already passed today, bump to next hour
          const candidateToday = updateReminderEntity(
            r,
            { scheduledDate: todayISO, snoozedUntil: null },
            now,
          );
          const candidateDt = getReminderScheduledDateTime(candidateToday);
          const finalTime =
            candidateDt && candidateDt.getTime() <= now.getTime()
              ? getDefaultReminderTime24h(now)
              : r.scheduledTime;

          const updated = updateReminderEntity(
            r,
            {
              scheduledDate: todayISO,
              date: displayToday,
              scheduledTime: finalTime,
              time: format24hTo12h(finalTime),
              snoozedUntil: null,
            },
            now,
          );

          ReminderNotificationService.cancelNotification(r.notificationId).catch(
            () => {},
          );
          ReminderNotificationService.scheduleReminder(updated).catch(() => {});
          return updated;
        }),
      );

      return movedCount;
    },
    [],
  );

  const completeAllReminders = useCallback((targetIds?: string[]): number => {
    const now = new Date();
    const idsSet = targetIds ? new Set(targetIds) : null;
    let completedCount = 0;

    setReminders(prev => {
      const spawnedList: Reminder[] = [];
      const updated = prev.map(r => {
        if (r.done) return r;
        if (idsSet && !idsSet.has(r.id)) return r;

        completedCount += 1;
        ReminderNotificationService.cancelNotification(r.notificationId).catch(
          () => {},
        );
        const doneRem: Reminder = {
          ...r,
          done: true,
          status: 'completed',
          completedAt: now.toISOString(),
          snoozedUntil: null,
        };
        const nextOcc = createNextOccurrenceReminder(doneRem, now);
        if (nextOcc) {
          spawnedList.push(nextOcc);
          ReminderNotificationService.scheduleReminder(nextOcc).catch(() => {});
        }
        return doneRem;
      });
      return [...spawnedList, ...updated];
    });

    return completedCount;
  }, []);

  const restoreAllReminders = useCallback((targetIds?: string[]): number => {
    const now = new Date();
    const idsSet = targetIds ? new Set(targetIds) : null;
    let restoredCount = 0;

    setReminders(prev =>
      prev.map(r => {
        if (!r.done) return r;
        if (idsSet && !idsSet.has(r.id)) return r;

        restoredCount += 1;
        const restored: Reminder = {
          ...r,
          done: false,
          completedAt: null,
          status: computeReminderStatus({ ...r, done: false }, now),
        };
        ReminderNotificationService.scheduleReminder(restored).catch(() => {});
        return restored;
      }),
    );

    return restoredCount;
  }, []);

  const requestNotificationPermission = useCallback(async (): Promise<boolean> => {
    const granted = await ReminderNotificationService.requestPermission();
    setHasNotificationPermission(granted);
    setIsPermissionSheetVisible(false);
    if (granted) {
      await ReminderNotificationService.syncNotificationsWithStorage(
        remindersRef.current,
        r =>
          r.voiceNudge
            ? ReminderVoiceScriptService.generateNotificationBody(r)
            : undefined,
      );
    }
    return granted;
  }, []);

  const dismissPermissionSheet = useCallback(() => {
    setIsPermissionSheetVisible(false);
  }, []);

  const openPermissionSheet = useCallback(() => {
    setIsPermissionSheetVisible(true);
  }, []);

  const openReminderModal = useCallback((prefill?: ReminderModalPrefill) => {
    setReminderModalPrefill(prefill || null);
    setIsReminderModalOpen(true);
  }, []);

  const closeReminderModal = useCallback(() => {
    setIsReminderModalOpen(false);
    setReminderModalPrefill(null);
  }, []);

  // Foreground Notifee event listener + voice delivery
  useEffect(() => {
    const deliverReminderVoice = async (reminder: Reminder): Promise<void> => {
      if (isSpeakingReminderRef.current) return;
      try {
        // Reload voice settings to respect latest user preferences
        const settings = await VoiceSettingsService.getSettings();
        if (!settings.voiceRemindersEnabled || !settings.autoSpeakReplies) return;

        isSpeakingReminderRef.current = true;

        // Half-duplex safety: 200ms audio session handoff before playback
        await new Promise<void>(resolve => setTimeout(resolve, 200));

        const script = ReminderVoiceScriptService.generateScript(reminder);
        await RegiusSpeechService.speakResponse(script);
      } catch {
        // Non-fatal — notification was already delivered
      } finally {
        isSpeakingReminderRef.current = false;
      }
    };

    const unsubscribe = ReminderNotificationService.setupForegroundHandler({
      onDelivered: (reminderId, title, body) => {
        // Always show Toast (visual confirmation)
        Toast.show({
          type: 'info',
          text1: title,
          text2: body || 'Scheduled reminder alert',
        });

        // Voice delivery — queue to prevent concurrent playback
        const reminder = remindersRef.current.find(r => r.id === reminderId);
        if (
          reminder &&
          reminder.voiceNudge &&
          voiceRemindersEnabledRef.current &&
          !reminder.done
        ) {
          voiceDeliveryQueueRef.current = voiceDeliveryQueueRef.current
            .then(() => deliverReminderVoice(reminder))
            .catch(() => {});
        }
      },
      onPressReminder: reminderId => {
        if (navigationRef.isReady()) {
          (navigationRef as any).navigate('ReminderDetailsScreen', {
            reminderId,
          });
        }
      },
      onActionComplete: reminderId => {
        toggleReminder(reminderId);
      },
      onActionSnooze: (reminderId, minutes) => {
        snoozeReminder(reminderId, minutes);
      },
    });
    return unsubscribe;
  }, [toggleReminder, snoozeReminder]);

  const value = useMemo<ReminderContextType>(
    () => ({
      reminders,
      isRemindersHydrated,
      hasNotificationPermission,
      isPermissionSheetVisible,
      addReminder,
      toggleReminder,
      updateReminder,
      deleteReminder,
      snoozeReminder,
      rescheduleReminder,
      rescheduleOverdueToToday,
      completeAllReminders,
      restoreAllReminders,
      requestNotificationPermission,
      dismissPermissionSheet,
      openPermissionSheet,
      isReminderModalOpen,
      reminderModalPrefill,
      openReminderModal,
      closeReminderModal,
    }),
    [
      reminders,
      isRemindersHydrated,
      hasNotificationPermission,
      isPermissionSheetVisible,
      addReminder,
      toggleReminder,
      updateReminder,
      deleteReminder,
      snoozeReminder,
      rescheduleReminder,
      rescheduleOverdueToToday,
      completeAllReminders,
      restoreAllReminders,
      requestNotificationPermission,
      dismissPermissionSheet,
      openPermissionSheet,
      isReminderModalOpen,
      reminderModalPrefill,
      openReminderModal,
      closeReminderModal,
    ],
  );

  return (
    <ReminderContext.Provider value={value}>
      {children}
    </ReminderContext.Provider>
  );
};

export const useReminders = () => useContext(ReminderContext);
