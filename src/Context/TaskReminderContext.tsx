import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  useCallback,
  ReactNode,
} from 'react';

export interface Task {
  id: string;
  label: string;
  iconType: 'mail' | 'users';
  done: boolean;
  category?: string;
  note?: string;
  priority?: 'low' | 'medium' | 'high';
  date?: string;
  time?: string;
  subtasks?: { id: string; text: string; done: boolean }[];
  voiceNudge?: boolean;
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
    accentColor: '#4A7C59',
  },
  {
    id: 'h-2',
    title: '20-min Posture & Breath Reset',
    category: 'mindful',
    streak: 9,
    frequency: 'Daily',
    completed: false,
    timeOfDay: '01:15 PM',
    accentColor: '#7C68EE',
  },
  {
    id: 'h-3',
    title: 'Evening 5km Mindful Pace Run',
    category: 'mindful',
    streak: 5,
    frequency: 'Mon, Wed, Fri',
    completed: false,
    timeOfDay: '06:00 PM',
    accentColor: '#D97706',
  },
  {
    id: 'h-4',
    title: 'Read 15 Pages Screen-Free',
    category: 'evening',
    streak: 12,
    frequency: 'Daily',
    completed: false,
    timeOfDay: '08:30 PM',
    accentColor: '#4F46E5',
  },
  {
    id: 'h-5',
    title: 'Cold Hydration & Cortisol Reset',
    category: 'morning',
    streak: 21,
    frequency: 'Daily',
    completed: true,
    timeOfDay: '08:00 AM',
    accentColor: '#0EA5E9',
  },
];

export const INITIAL_TASKS: Task[] = [
  {
    id: '1',
    label: 'Email Check',
    iconType: 'mail',
    done: true,
    category: 'works',
  },
  {
    id: '2',
    label: 'Weekly Meeting',
    iconType: 'users',
    done: false,
    category: 'works',
  },
  {
    id: '3',
    label: 'Team Discussion',
    iconType: 'users',
    done: false,
    category: 'works',
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
    color: '#52D22E',
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
    color: '#8383D6',
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
    color: '#F5C518',
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
    color: '#52D22E',
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
    color: '#FF9800',
  },
];

interface TaskReminderContextType {
  tasks: Task[];
  addTask: (data: {
    title: string;
    note?: string;
    category?: string;
    iconType?: 'mail' | 'users';
    priority?: 'low' | 'medium' | 'high';
    date?: string;
    time?: string;
    subtasks?: { id: string; text: string; done: boolean }[];
    voiceNudge?: boolean;
  }) => Task | null;
  toggleTask: (id: string) => Task | null;
  selectedTasks: Set<string>;
  setSelectedTasks: React.Dispatch<React.SetStateAction<Set<string>>>;
  selectAllTasks: () => void;

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
  selectedReminders: Set<string>;
  setSelectedReminders: React.Dispatch<React.SetStateAction<Set<string>>>;
  selectAllReminders: () => void;

  isTaskModalOpen: boolean;
  openTaskModal: () => void;
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
  deleteHabit: (id: string) => void;
  isHabitModalOpen: boolean;
  openHabitModal: () => void;
  closeHabitModal: () => void;
}

const TaskReminderContext = createContext<TaskReminderContextType>({
  tasks: INITIAL_TASKS,
  addTask: () => null,
  toggleTask: () => null,
  selectedTasks: new Set(['1']),
  setSelectedTasks: () => {},
  selectAllTasks: () => {},

  reminders: INITIAL_REMINDERS,
  addReminder: () => null,
  toggleReminder: () => null,
  selectedReminders: new Set(['2']),
  setSelectedReminders: () => {},
  selectAllReminders: () => {},

  isTaskModalOpen: false,
  openTaskModal: () => {},
  closeTaskModal: () => {},

  isReminderModalOpen: false,
  openReminderModal: () => {},
  closeReminderModal: () => {},

  habits: INITIAL_HABITS,
  addHabit: () => null,
  toggleHabit: () => null,
  deleteHabit: () => {},
  isHabitModalOpen: false,
  openHabitModal: () => {},
  closeHabitModal: () => {},
});

export const TaskReminderProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [selectedTasks, setSelectedTasks] = useState<Set<string>>(
    new Set(['1']),
  );

  const [reminders, setReminders] = useState<Reminder[]>(INITIAL_REMINDERS);
  const [selectedReminders, setSelectedReminders] = useState<Set<string>>(
    new Set(['2']),
  );

  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);

  const addTask = (data: {
    title: string;
    note?: string;
    category?: string;
    iconType?: 'mail' | 'users';
    priority?: 'low' | 'medium' | 'high';
    date?: string;
    time?: string;
    subtasks?: { id: string; text: string; done: boolean }[];
    voiceNudge?: boolean;
  }): Task | null => {
    if (!data.title.trim()) return null;
    const newTask: Task = {
      id: Date.now().toString(),
      label: data.title.trim(),
      iconType: data.iconType || 'mail',
      done: false,
      category: data.category || 'works',
      note: data.note,
      priority: data.priority || 'medium',
      date: data.date || 'Today',
      time: data.time || '10:00 AM',
      subtasks: data.subtasks,
      voiceNudge: data.voiceNudge ?? true,
    };
    setTasks(prev => [newTask, ...prev]);
    return newTask;
  };

  const toggleTask = (id: string): Task | null => {
    let updatedTask: Task | null = null;
    setTasks(prev =>
      prev.map(t => {
        if (t.id === id) {
          updatedTask = { ...t, done: !t.done };
          return updatedTask;
        }
        return t;
      }),
    );
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
  };

  const selectAllTasks = useCallback(() => {
    if (selectedTasks.size === tasks.length) {
      setSelectedTasks(new Set());
    } else {
      setSelectedTasks(new Set(tasks.map(t => t.id)));
    }
  }, [selectedTasks.size, tasks]);

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
          ? '#52D22E'
          : data.category === 'work' || data.category === 'works'
          ? '#F5C518'
          : data.category === 'events'
          ? '#FF9800'
          : '#8383D6',
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

  const selectAllReminders = useCallback(() => {
    if (selectedReminders.size === reminders.length) {
      setSelectedReminders(new Set());
    } else {
      setSelectedReminders(new Set(reminders.map(r => r.id)));
    }
  }, [selectedReminders.size, reminders]);

  const openTaskModal = () => setIsTaskModalOpen(true);
  const closeTaskModal = () => setIsTaskModalOpen(false);

  const openReminderModal = () => setIsReminderModalOpen(true);
  const closeReminderModal = () => setIsReminderModalOpen(false);

  // ─── Habits State & Handlers ──────────────────────────────
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
      accentColor: data.accentColor || '#4A7C59',
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

  const deleteHabit = (id: string) => {
    setHabits(prev => prev.filter(h => h.id !== id));
  };

  const openHabitModal = () => setIsHabitModalOpen(true);
  const closeHabitModal = () => setIsHabitModalOpen(false);

  const value = useMemo(
    () => ({
      tasks,
      addTask,
      toggleTask,
      selectedTasks,
      setSelectedTasks,
      selectAllTasks,

      reminders,
      addReminder,
      toggleReminder,
      selectedReminders,
      setSelectedReminders,
      selectAllReminders,

      isTaskModalOpen,
      openTaskModal,
      closeTaskModal,

      isReminderModalOpen,
      openReminderModal,
      closeReminderModal,

      habits,
      addHabit,
      toggleHabit,
      deleteHabit,
      isHabitModalOpen,
      openHabitModal,
      closeHabitModal,
    }),
    [
      tasks,
      selectedTasks,
      selectAllTasks,
      reminders,
      selectedReminders,
      selectAllReminders,
      isTaskModalOpen,
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
