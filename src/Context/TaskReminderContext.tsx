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
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '../Assets/StyleUtilities/Colors';
import { BadgeVariant } from '../Common/Badge';
import {
  OfficeBagIcon,
  HeartEmblemIcon,
  PictureEmblemIcon,
  SparkleEmblemIcon,
  FlameEmblemIcon,
} from '../Common/EmblemIcons';
import {
  TaskRecurrence,
  toLocalISODate,
  formatDisplayDate,
  normalizeTaskDateInput,
  resolveTaskDueDate,
  getNextOccurrenceISO,
} from '../Utils/taskDateUtils';

const TASKS_STORAGE_KEY = '@regius_tasks_v1';
const TASK_CATEGORIES_STORAGE_KEY = '@regius_task_categories_v1';

export type TaskCategoryIconKey =
  | 'bag'
  | 'heart'
  | 'picture'
  | 'sparkles'
  | 'flame';

export interface TaskCategoryItem {
  id: string;
  label: string;
  bgColor: string;
  borderColor: string;
  shadowColor: string;
  accentColor: string;
  checkColor: string;
  badgeVariant?: BadgeVariant;
  iconKey: TaskCategoryIconKey;
  Icon: React.ComponentType<any>;
  isCustom?: boolean;
}

export interface TaskModalPrefill {
  dueDate?: string | null;
  category?: string;
}

export function resolveCategoryIconComponent(
  iconKey?: TaskCategoryIconKey,
): React.ComponentType<any> {
  switch (iconKey) {
    case 'heart':
      return HeartEmblemIcon;
    case 'picture':
      return PictureEmblemIcon;
    case 'sparkles':
      return SparkleEmblemIcon;
    case 'flame':
      return FlameEmblemIcon;
    case 'bag':
    default:
      return OfficeBagIcon;
  }
}

export function inferCategoryIconKey(
  Icon?: React.ComponentType<any>,
): TaskCategoryIconKey {
  if (Icon === HeartEmblemIcon) return 'heart';
  if (Icon === PictureEmblemIcon) return 'picture';
  if (Icon === SparkleEmblemIcon) return 'sparkles';
  if (Icon === FlameEmblemIcon) return 'flame';
  return 'bag';
}

export const DEFAULT_TASK_CATEGORIES: TaskCategoryItem[] = [
  {
    id: 'works',
    label: 'Works',
    bgColor: Colors.WorkLightBg,
    borderColor: Colors.WorkLightBorder,
    shadowColor: Colors.PureBlack,
    accentColor: Colors.TaskGoldVivid,
    checkColor: Colors.HabitBurnishedAmber,
    badgeVariant: 'yellow',
    iconKey: 'bag',
    Icon: OfficeBagIcon,
  },
  {
    id: 'sport',
    label: 'Sport',
    bgColor: Colors.WellnessLightBg,
    borderColor: Colors.WellnessLightBorder,
    shadowColor: Colors.PureBlack,
    accentColor: Colors.AccentGreen,
    checkColor: Colors.GreenGracious,
    badgeVariant: 'green',
    iconKey: 'heart',
    Icon: HeartEmblemIcon,
  },
  {
    id: 'habits',
    label: 'Habits',
    bgColor: Colors.MindfulLightBg,
    borderColor: Colors.MindfulLightBorder,
    shadowColor: Colors.PureBlack,
    accentColor: Colors.LavenderPurple,
    checkColor: Colors.MindfulTextAccent,
    badgeVariant: 'purple',
    iconKey: 'picture',
    Icon: PictureEmblemIcon,
  },
];

export interface Task {
  id: string;
  label: string;
  iconType: 'mail' | 'users';
  done: boolean;
  category?: string;
  note?: string;
  priority?: 'low' | 'medium' | 'high';
  date?: string;
  dueDate?: string | null;
  time?: string;
  dueTime?: string | null;
  recurrence?: TaskRecurrence;
  subtasks?: { id: string; text: string; done: boolean }[];
  voiceNudge?: boolean;
  createdAt?: string;
  completedAt?: string | null;
}

export interface Reminder {
  id: string;
  title: string;
  notes?: string;
  time: string;
  date: string;
  category: string;
  repeat: string;
  done: boolean;
  color?: string;
  remindBefore?: string;
  sound?: string;
  urgentAlarm?: boolean;
}

export interface HabitItem {
  id: string;
  title: string;
  category: 'morning' | 'mindful' | 'evening';
  streak: number;
  frequency: string;
  completed: boolean;
  timeOfDay: string;
  accentColor: string;
}

export const INITIAL_HABITS: HabitItem[] = [
  {
    id: 'h-1',
    title: 'Morning Sunlight & 500ml Water',
    category: 'morning',
    streak: 18,
    frequency: 'Daily',
    completed: true,
    timeOfDay: '07:30 AM',
    accentColor: Colors.HabitForestSage,
  },
  {
    id: 'h-2',
    title: '20-min Posture & Breath Reset',
    category: 'mindful',
    streak: 9,
    frequency: 'Daily',
    completed: false,
    timeOfDay: '01:15 PM',
    accentColor: Colors.HabitIrisViolet,
  },
  {
    id: 'h-3',
    title: 'Evening 5km Mindful Pace Run',
    category: 'mindful',
    streak: 5,
    frequency: 'Mon, Wed, Fri',
    completed: false,
    timeOfDay: '06:00 PM',
    accentColor: Colors.HabitBurnishedAmber,
  },
  {
    id: 'h-4',
    title: 'Read 15 Pages Screen-Free',
    category: 'evening',
    streak: 12,
    frequency: 'Daily',
    completed: false,
    timeOfDay: '08:30 PM',
    accentColor: Colors.HabitRoyalIndigo,
  },
  {
    id: 'h-5',
    title: 'Cold Hydration & Cortisol Reset',
    category: 'morning',
    streak: 21,
    frequency: 'Daily',
    completed: true,
    timeOfDay: '08:00 AM',
    accentColor: Colors.HabitCeruleanSky,
  },
];

const TODAY_ISO_SEED = toLocalISODate();
const TODAY_LABEL_SEED = formatDisplayDate(TODAY_ISO_SEED, TODAY_ISO_SEED);

export const INITIAL_TASKS: Task[] = [
  {
    id: '1',
    label: 'Email Check & Inbox Zero',
    iconType: 'mail',
    done: true,
    category: 'works',
    date: TODAY_LABEL_SEED,
    dueDate: TODAY_ISO_SEED,
    time: '09:00 AM',
    dueTime: '09:00 AM',
    note: 'Processed 14 critical communications. Focus block active.',
    completedAt: new Date().toISOString(),
  },
  {
    id: '2',
    label: 'Weekly Team Strategy & Review',
    iconType: 'users',
    done: false,
    category: 'works',
    date: TODAY_LABEL_SEED,
    dueDate: TODAY_ISO_SEED,
    time: '11:30 AM',
    dueTime: '11:30 AM',
    note: 'Regius will chime 5 minutes prior with talking points.',
  },
  {
    id: '3',
    label: 'Product Design & Dev Handoff',
    iconType: 'users',
    done: false,
    category: 'works',
    date: TODAY_LABEL_SEED,
    dueDate: TODAY_ISO_SEED,
    time: '03:30 PM',
    dueTime: '03:30 PM',
    note: 'Review interactive timeline component specs.',
  },
  {
    id: '4',
    label: '5km Aerobic Run & Core Stretch',
    iconType: 'users',
    done: false,
    category: 'sport',
    date: TODAY_LABEL_SEED,
    dueDate: TODAY_ISO_SEED,
    time: '05:30 PM',
    dueTime: '05:30 PM',
    note: 'Cardio endurance and post-run mobility routine.',
  },
  {
    id: '5',
    label: 'Evening Mindful Reading & Reflection',
    iconType: 'mail',
    done: false,
    category: 'habits',
    date: TODAY_LABEL_SEED,
    dueDate: TODAY_ISO_SEED,
    time: '09:00 PM',
    dueTime: '09:00 PM',
    note: 'Read 15 pages screen-free before sleep.',
  },
];

export const INITIAL_REMINDERS: Reminder[] = [
  {
    id: '1',
    title: 'Morning Meditation & Breathing',
    notes: '15 mins mindfulness',
    time: '07:30 AM',
    date: 'Today',
    category: 'health',
    repeat: 'Daily',
    done: false,
    color: Colors.AccentGreen,
  },
  {
    id: '2',
    title: 'Product Strategy Sync Call',
    notes: 'Google Meet with product team',
    time: '11:00 AM',
    date: 'Today',
    category: 'work',
    repeat: 'Once',
    done: true,
    color: Colors.LavenderPurple,
  },
  {
    id: '3',
    title: 'Hydration & 2L Water Refill',
    notes: 'Keep bottle full',
    time: '02:00 PM',
    date: 'Today',
    category: 'daily',
    repeat: 'Every 2 hrs',
    done: false,
    color: Colors.AccentYellow,
  },
  {
    id: '4',
    title: 'Evening Workout & Cardio',
    notes: 'Gym session',
    time: '06:30 PM',
    date: 'Today',
    category: 'health',
    repeat: 'Daily',
    done: false,
    color: Colors.AccentGreen,
  },
  {
    id: '5',
    title: 'Quarterly Team Dinner',
    notes: 'Downtown bistro',
    time: '08:00 PM',
    date: 'Tomorrow',
    category: 'events',
    repeat: 'Once',
    done: false,
    color: Colors.AccentAmber,
  },
];

export interface AddTaskInput {
  title: string;
  note?: string;
  category?: string;
  iconType?: 'mail' | 'users';
  priority?: 'low' | 'medium' | 'high';
  date?: string;
  dueDate?: string | null;
  time?: string;
  dueTime?: string | null;
  recurrence?: TaskRecurrence;
  subtasks?: { id: string; text: string; done: boolean }[];
  voiceNudge?: boolean;
}

interface StoredCustomCategory {
  id: string;
  label: string;
  bgColor: string;
  borderColor: string;
  shadowColor: string;
  accentColor: string;
  checkColor: string;
  badgeVariant?: BadgeVariant;
  iconKey: TaskCategoryIconKey;
}

function hydrateStoredTask(raw: Task): Task {
  const todayISO = toLocalISODate();
  const normalizedDate =
    raw.dueDate !== undefined
      ? {
          dueDate: raw.dueDate,
          displayDate: raw.dueDate
            ? formatDisplayDate(raw.dueDate, todayISO)
            : 'Anytime',
        }
      : normalizeTaskDateInput(raw.date);

  const dueTime =
    raw.dueTime !== undefined
      ? raw.dueTime
      : raw.time && raw.time.toLowerCase() !== 'anytime'
      ? raw.time
      : null;

  return {
    ...raw,
    dueDate: normalizedDate.dueDate,
    date: raw.date || normalizedDate.displayDate,
    dueTime,
    time: dueTime || undefined,
    recurrence: raw.recurrence || 'none',
  };
}

interface TaskReminderContextType {
  tasks: Task[];
  isTasksHydrated: boolean;
  addTask: (data: AddTaskInput) => Task | null;
  toggleTask: (id: string) => Task | null;
  updateTask: (id: string, updates: Partial<Omit<Task, 'id'>>) => Task | null;
  deleteTask: (id: string) => void;
  rescheduleTask: (
    id: string,
    dueDate: string | null,
    dueTime?: string | null,
  ) => Task | null;
  rescheduleOverdueToToday: (targetIds?: string[]) => number;
  selectedTasks: Set<string>;
  setSelectedTasks: React.Dispatch<React.SetStateAction<Set<string>>>;
  selectAllTasks: (markDone?: boolean, targetIds?: string[]) => void;

  taskCategories: TaskCategoryItem[];
  addTaskCategory: (
    category: Omit<TaskCategoryItem, 'iconKey' | 'Icon'> & {
      iconKey?: TaskCategoryIconKey;
      Icon?: React.ComponentType<any>;
    },
  ) => TaskCategoryItem;

  reminders: Reminder[];
  addReminder: (data: {
    title: string;
    notes?: string;
    time?: string;
    date?: string;
    category?: string;
    repeat?: string;
    remindBefore?: string;
    sound?: string;
    urgentAlarm?: boolean;
  }) => Reminder | null;
  toggleReminder: (id: string) => Reminder | null;
  updateReminder: (
    id: string,
    updates: Partial<Omit<Reminder, 'id'>>,
  ) => Reminder | null;
  deleteReminder: (id: string) => void;
  selectedReminders: Set<string>;
  setSelectedReminders: React.Dispatch<React.SetStateAction<Set<string>>>;
  selectAllReminders: () => void;

  isTaskModalOpen: boolean;
  taskModalPrefill: TaskModalPrefill | null;
  openTaskModal: (prefill?: TaskModalPrefill) => void;
  closeTaskModal: () => void;

  isReminderModalOpen: boolean;
  openReminderModal: () => void;
  closeReminderModal: () => void;

  habits: HabitItem[];
  addHabit: (data: {
    title: string;
    category?: 'morning' | 'mindful' | 'evening';
    frequency?: string;
    timeOfDay?: string;
    accentColor?: string;
  }) => HabitItem | null;
  toggleHabit: (id: string) => HabitItem | null;
  updateHabit: (
    id: string,
    updates: Partial<Omit<HabitItem, 'id'>>,
  ) => HabitItem | null;
  deleteHabit: (id: string) => void;
  isHabitModalOpen: boolean;
  openHabitModal: () => void;
  closeHabitModal: () => void;
}

const TaskReminderContext = createContext<TaskReminderContextType>({
  tasks: INITIAL_TASKS,
  isTasksHydrated: false,
  addTask: () => null,
  toggleTask: () => null,
  updateTask: () => null,
  deleteTask: () => {},
  rescheduleTask: () => null,
  rescheduleOverdueToToday: () => 0,
  selectedTasks: new Set(['1']),
  setSelectedTasks: () => {},
  selectAllTasks: () => {},

  taskCategories: DEFAULT_TASK_CATEGORIES,
  addTaskCategory: cat => ({
    ...cat,
    iconKey: cat.iconKey || 'bag',
    Icon: cat.Icon || OfficeBagIcon,
  }),

  reminders: INITIAL_REMINDERS,
  addReminder: () => null,
  toggleReminder: () => null,
  updateReminder: () => null,
  deleteReminder: () => {},
  selectedReminders: new Set(['2']),
  setSelectedReminders: () => {},
  selectAllReminders: () => {},

  isTaskModalOpen: false,
  taskModalPrefill: null,
  openTaskModal: () => {},
  closeTaskModal: () => {},

  isReminderModalOpen: false,
  openReminderModal: () => {},
  closeReminderModal: () => {},

  habits: INITIAL_HABITS,
  addHabit: () => null,
  toggleHabit: () => null,
  updateHabit: () => null,
  deleteHabit: () => {},
  isHabitModalOpen: false,
  openHabitModal: () => {},
  closeHabitModal: () => {},
});

export const TaskReminderProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [isTasksHydrated, setIsTasksHydrated] = useState(false);
  const [customCategories, setCustomCategories] = useState<TaskCategoryItem[]>(
    [],
  );
  const [selectedTasks, setSelectedTasks] = useState<Set<string>>(
    new Set(['1']),
  );

  const [reminders, setReminders] = useState<Reminder[]>(INITIAL_REMINDERS);
  const [selectedReminders, setSelectedReminders] = useState<Set<string>>(
    new Set(['2']),
  );

  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [taskModalPrefill, setTaskModalPrefill] =
    useState<TaskModalPrefill | null>(null);
  const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);

  const hasHydratedRef = useRef(false);

  useEffect(() => {
    let mounted = true;
    const hydrate = async () => {
      try {
        const [storedTasksRaw, storedCatsRaw] = await Promise.all([
          AsyncStorage.getItem(TASKS_STORAGE_KEY),
          AsyncStorage.getItem(TASK_CATEGORIES_STORAGE_KEY),
        ]);
        if (!mounted) return;

        if (storedTasksRaw) {
          const parsed = JSON.parse(storedTasksRaw);
          if (Array.isArray(parsed)) {
            const hydrated = parsed.map(hydrateStoredTask);
            setTasks(hydrated);
            setSelectedTasks(
              new Set(hydrated.filter(t => t.done).map(t => t.id)),
            );
          }
        }

        if (storedCatsRaw) {
          const parsedCats: StoredCustomCategory[] = JSON.parse(storedCatsRaw);
          if (Array.isArray(parsedCats)) {
            setCustomCategories(
              parsedCats.map(cat => ({
                ...cat,
                Icon: resolveCategoryIconComponent(cat.iconKey),
                isCustom: true,
              })),
            );
          }
        }
      } catch {
        // Fallback silently to initial seed data if storage is unavailable
      } finally {
        if (mounted) {
          hasHydratedRef.current = true;
          setIsTasksHydrated(true);
        }
      }
    };

    hydrate();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!hasHydratedRef.current) return;
    AsyncStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks)).catch(
      () => {},
    );
  }, [tasks]);

  useEffect(() => {
    if (!hasHydratedRef.current) return;
    const serializable: StoredCustomCategory[] = customCategories.map(cat => ({
      id: cat.id,
      label: cat.label,
      bgColor: cat.bgColor,
      borderColor: cat.borderColor,
      shadowColor: cat.shadowColor,
      accentColor: cat.accentColor,
      checkColor: cat.checkColor,
      badgeVariant: cat.badgeVariant,
      iconKey: cat.iconKey,
    }));
    AsyncStorage.setItem(
      TASK_CATEGORIES_STORAGE_KEY,
      JSON.stringify(serializable),
    ).catch(() => {});
  }, [customCategories]);

  const taskCategories = useMemo(
    () => [...DEFAULT_TASK_CATEGORIES, ...customCategories],
    [customCategories],
  );

  const addTaskCategory = useCallback(
    (
      cat: Omit<TaskCategoryItem, 'iconKey' | 'Icon'> & {
        iconKey?: TaskCategoryIconKey;
        Icon?: React.ComponentType<any>;
      },
    ): TaskCategoryItem => {
      const iconKey = cat.iconKey || inferCategoryIconKey(cat.Icon);
      const nextCategory: TaskCategoryItem = {
        ...cat,
        id: cat.id || `custom_${Date.now()}`,
        iconKey,
        Icon: cat.Icon || resolveCategoryIconComponent(iconKey),
        isCustom: true,
      };
      setCustomCategories(prev => {
        if (prev.some(existing => existing.id === nextCategory.id)) {
          return prev;
        }
        return [...prev, nextCategory];
      });
      return nextCategory;
    },
    [],
  );

  const addTask = useCallback((data: AddTaskInput): Task | null => {
    if (!data.title.trim()) return null;
    const todayISO = toLocalISODate();

    let resolvedDueDate: string | null;
    let resolvedDisplayDate: string;

    if (data.dueDate !== undefined) {
      resolvedDueDate = data.dueDate;
      resolvedDisplayDate = data.dueDate
        ? formatDisplayDate(data.dueDate, todayISO)
        : 'Anytime';
    } else if (data.date !== undefined) {
      const normalized = normalizeTaskDateInput(data.date);
      resolvedDueDate = normalized.dueDate;
      resolvedDisplayDate = normalized.displayDate;
    } else {
      resolvedDueDate = todayISO;
      resolvedDisplayDate = formatDisplayDate(todayISO, todayISO);
    }

    let resolvedDueTime: string | null;
    if (data.dueTime !== undefined) {
      resolvedDueTime = data.dueTime;
    } else if (data.time !== undefined) {
      const cleanTime = data.time.trim();
      resolvedDueTime =
        !cleanTime || cleanTime.toLowerCase() === 'anytime'
          ? null
          : cleanTime;
    } else {
      resolvedDueTime = '10:00 AM';
    }

    const newTask: Task = {
      id: Date.now().toString(),
      label: data.title.trim(),
      iconType: data.iconType || 'mail',
      done: false,
      category: data.category || 'works',
      note: data.note,
      priority: data.priority || 'medium',
      date: resolvedDisplayDate,
      dueDate: resolvedDueDate,
      time: resolvedDueTime || undefined,
      dueTime: resolvedDueTime,
      recurrence: data.recurrence || 'none',
      subtasks: data.subtasks,
      voiceNudge: data.voiceNudge ?? true,
      createdAt: new Date().toISOString(),
      completedAt: null,
    };
    setTasks(prev => [newTask, ...prev]);
    return newTask;
  }, []);

  const toggleTask = useCallback((id: string): Task | null => {
    let updatedTask: Task | null = null;
    setTasks(prev => {
      const nextTasks: Task[] = [];
      let spawnedTask: Task | null = null;

      for (const t of prev) {
        if (t.id === id) {
          const nextDone = !t.done;
          updatedTask = {
            ...t,
            done: nextDone,
            completedAt: nextDone ? new Date().toISOString() : null,
          };
          nextTasks.push(updatedTask);

          if (
            nextDone &&
            t.recurrence &&
            t.recurrence !== 'none'
          ) {
            const anchorISO = resolveTaskDueDate(t) || toLocalISODate();
            const nextDueISO = getNextOccurrenceISO(anchorISO, t.recurrence);
            spawnedTask = {
              ...t,
              id: `${Date.now()}-${Math.floor(Math.random() * 1000)}`,
              done: false,
              dueDate: nextDueISO,
              date: formatDisplayDate(nextDueISO),
              completedAt: null,
              createdAt: new Date().toISOString(),
              subtasks: t.subtasks?.map(s => ({ ...s, done: false })),
            };
          }
        } else {
          nextTasks.push(t);
        }
      }

      if (spawnedTask) {
        return [spawnedTask, ...nextTasks];
      }
      return nextTasks;
    });

    setSelectedTasks(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
    return updatedTask;
  }, []);

  const updateTask = useCallback(
    (
      id: string,
      updates: Partial<Omit<Task, 'id'>> & { title?: string },
    ): Task | null => {
      let updated: Task | null = null;
      const todayISO = toLocalISODate();
      const normalized: Partial<Omit<Task, 'id'>> = { ...updates };
      if (typeof updates.title === 'string' && updates.title.trim()) {
        normalized.label = updates.title.trim();
      }
      delete (normalized as { title?: string }).title;

      if (updates.dueDate !== undefined) {
        normalized.dueDate = updates.dueDate;
        normalized.date = updates.dueDate
          ? formatDisplayDate(updates.dueDate, todayISO)
          : 'Anytime';
      } else if (updates.date !== undefined) {
        const res = normalizeTaskDateInput(updates.date);
        normalized.dueDate = res.dueDate;
        normalized.date = res.displayDate;
      }

      if (updates.dueTime !== undefined) {
        normalized.dueTime = updates.dueTime;
        normalized.time = updates.dueTime || undefined;
      } else if (updates.time !== undefined) {
        const cleanTime = updates.time.trim();
        const isAnytime = !cleanTime || cleanTime.toLowerCase() === 'anytime';
        normalized.dueTime = isAnytime ? null : cleanTime;
        normalized.time = isAnytime ? undefined : cleanTime;
      }

      setTasks(prev =>
        prev.map(t => {
          if (t.id === id) {
            updated = { ...t, ...normalized };
            return updated;
          }
          return t;
        }),
      );
      return updated;
    },
    [],
  );

  const deleteTask = useCallback((id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
    setSelectedTasks(prev => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }, []);

  const rescheduleTask = useCallback(
    (
      id: string,
      dueDate: string | null,
      dueTime?: string | null,
    ): Task | null => {
      const updates: Partial<Omit<Task, 'id'>> = {
        dueDate,
        date: dueDate ? formatDisplayDate(dueDate) : 'Anytime',
      };
      if (dueTime !== undefined) {
        updates.dueTime = dueTime;
        updates.time = dueTime || undefined;
      }
      return updateTask(id, updates);
    },
    [updateTask],
  );

  const rescheduleOverdueToToday = useCallback((targetIds?: string[]): number => {
    const todayISO = toLocalISODate();
    const displayToday = formatDisplayDate(todayISO, todayISO);
    const idsSet = targetIds ? new Set(targetIds) : null;
    let movedCount = 0;

    setTasks(prev =>
      prev.map(t => {
        if (t.done) return t;
        if (idsSet && !idsSet.has(t.id)) return t;
        const resolved = resolveTaskDueDate(t, todayISO);
        if (resolved && resolved < todayISO) {
          movedCount += 1;
          return {
            ...t,
            dueDate: todayISO,
            date: displayToday,
          };
        }
        return t;
      }),
    );

    return movedCount;
  }, []);

  const selectAllTasks = useCallback(
    (markDone?: boolean, targetIds?: string[]) => {
      const nowISO = new Date().toISOString();
      setTasks(prev => {
        const idsSet = targetIds ? new Set(targetIds) : null;
        const relevant = idsSet ? prev.filter(t => idsSet.has(t.id)) : prev;
        const shouldComplete =
          markDone !== undefined ? markDone : !relevant.every(t => t.done);

        const updated = prev.map(t => {
          if (!idsSet || idsSet.has(t.id)) {
            return {
              ...t,
              done: shouldComplete,
              completedAt: shouldComplete ? nowISO : null,
            };
          }
          return t;
        });

        setSelectedTasks(new Set(updated.filter(t => t.done).map(t => t.id)));
        return updated;
      });
    },
    [],
  );

  const addReminder = (data: {
    title: string;
    notes?: string;
    time?: string;
    date?: string;
    category?: string;
    repeat?: string;
    remindBefore?: string;
    sound?: string;
    urgentAlarm?: boolean;
  }): Reminder | null => {
    if (!data.title.trim()) return null;
    const newRem: Reminder = {
      id: Date.now().toString(),
      title: data.title.trim(),
      notes: data.notes,
      time: data.time || '04:30 PM',
      date: data.date || 'Today, Oct 14',
      category: data.category || 'works',
      repeat: data.repeat || 'Daily',
      done: false,
      color:
        data.category === 'health' || data.category === 'sport'
          ? Colors.AccentGreen
          : data.category === 'work' || data.category === 'works'
          ? Colors.AccentYellow
          : data.category === 'events'
          ? Colors.AccentAmber
          : Colors.LavenderPurple,
      remindBefore: data.remindBefore || '5 mins before',
      sound: data.sound || 'Gentle Bell',
      urgentAlarm: data.urgentAlarm ?? false,
    };
    setReminders(prev => [newRem, ...prev]);
    return newRem;
  };

  const toggleReminder = (id: string): Reminder | null => {
    let updatedRem: Reminder | null = null;
    setReminders(prev =>
      prev.map(r => {
        if (r.id === id) {
          updatedRem = { ...r, done: !r.done };
          return updatedRem;
        }
        return r;
      }),
    );
    setSelectedReminders(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
    return updatedRem;
  };

  const updateReminder = (
    id: string,
    updates: Partial<Omit<Reminder, 'id'>>,
  ): Reminder | null => {
    let updated: Reminder | null = null;
    setReminders(prev =>
      prev.map(r => {
        if (r.id === id) {
          updated = { ...r, ...updates };
          return updated;
        }
        return r;
      }),
    );
    return updated;
  };

  const deleteReminder = (id: string) => {
    setReminders(prev => prev.filter(r => r.id !== id));
    setSelectedReminders(prev => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  const selectAllReminders = useCallback(() => {
    if (selectedReminders.size === reminders.length) {
      setSelectedReminders(new Set());
    } else {
      setSelectedReminders(new Set(reminders.map(r => r.id)));
    }
  }, [selectedReminders.size, reminders]);

  const openTaskModal = useCallback((prefill?: TaskModalPrefill) => {
    const validPrefill =
      prefill &&
      (prefill.dueDate !== undefined || prefill.category !== undefined)
        ? { dueDate: prefill.dueDate, category: prefill.category }
        : null;
    setTaskModalPrefill(validPrefill);
    setIsTaskModalOpen(true);
  }, []);

  const closeTaskModal = useCallback(() => {
    setIsTaskModalOpen(false);
    setTaskModalPrefill(null);
  }, []);

  const openReminderModal = () => setIsReminderModalOpen(true);
  const closeReminderModal = () => setIsReminderModalOpen(false);

  // Habits state and handlers
  const [habits, setHabits] = useState<HabitItem[]>(INITIAL_HABITS);
  const [isHabitModalOpen, setIsHabitModalOpen] = useState(false);

  const addHabit = (data: {
    title: string;
    category?: 'morning' | 'mindful' | 'evening';
    frequency?: string;
    timeOfDay?: string;
    accentColor?: string;
  }): HabitItem | null => {
    if (!data.title.trim()) return null;
    const newHabit: HabitItem = {
      id: `habit-${Date.now()}`,
      title: data.title.trim(),
      category: data.category || 'morning',
      streak: 1,
      frequency: data.frequency || 'Daily',
      completed: false,
      timeOfDay: data.timeOfDay || '08:00 AM',
      accentColor: data.accentColor || Colors.HabitForestSage,
    };
    setHabits(prev => [newHabit, ...prev]);
    return newHabit;
  };

  const toggleHabit = (id: string): HabitItem | null => {
    let updatedHabit: HabitItem | null = null;
    setHabits(prev =>
      prev.map(h => {
        if (h.id === id) {
          const next = !h.completed;
          updatedHabit = {
            ...h,
            completed: next,
            streak: next ? h.streak + 1 : Math.max(h.streak - 1, 0),
          };
          return updatedHabit;
        }
        return h;
      }),
    );
    return updatedHabit;
  };

  const updateHabit = (
    id: string,
    updates: Partial<Omit<HabitItem, 'id'>>,
  ): HabitItem | null => {
    let updated: HabitItem | null = null;
    setHabits(prev =>
      prev.map(h => {
        if (h.id === id) {
          updated = { ...h, ...updates };
          return updated;
        }
        return h;
      }),
    );
    return updated;
  };

  const deleteHabit = (id: string) => {
    setHabits(prev => prev.filter(h => h.id !== id));
  };

  const openHabitModal = () => setIsHabitModalOpen(true);
  const closeHabitModal = () => setIsHabitModalOpen(false);

  const value = useMemo(
    () => ({
      tasks,
      isTasksHydrated,
      addTask,
      toggleTask,
      updateTask,
      deleteTask,
      rescheduleTask,
      rescheduleOverdueToToday,
      selectedTasks,
      setSelectedTasks,
      selectAllTasks,

      taskCategories,
      addTaskCategory,

      reminders,
      addReminder,
      toggleReminder,
      updateReminder,
      deleteReminder,
      selectedReminders,
      setSelectedReminders,
      selectAllReminders,

      isTaskModalOpen,
      taskModalPrefill,
      openTaskModal,
      closeTaskModal,

      isReminderModalOpen,
      openReminderModal,
      closeReminderModal,

      habits,
      addHabit,
      toggleHabit,
      updateHabit,
      deleteHabit,
      isHabitModalOpen,
      openHabitModal,
      closeHabitModal,
    }),
    [
      tasks,
      isTasksHydrated,
      addTask,
      toggleTask,
      updateTask,
      deleteTask,
      rescheduleTask,
      rescheduleOverdueToToday,
      selectedTasks,
      selectAllTasks,
      taskCategories,
      addTaskCategory,
      reminders,
      selectedReminders,
      selectAllReminders,
      isTaskModalOpen,
      taskModalPrefill,
      openTaskModal,
      closeTaskModal,
      isReminderModalOpen,
      habits,
      isHabitModalOpen,
    ],
  );

  return (
    <TaskReminderContext.Provider value={value}>
      {children}
    </TaskReminderContext.Provider>
  );
};

export const useTaskReminder = () => useContext(TaskReminderContext);
