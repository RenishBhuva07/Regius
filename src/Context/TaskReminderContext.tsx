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
  }) => void;
  toggleTask: (id: string) => void;
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
  }) => void;
  toggleReminder: (id: string) => void;
  selectedReminders: Set<string>;
  setSelectedReminders: React.Dispatch<React.SetStateAction<Set<string>>>;
  selectAllReminders: () => void;

  isTaskModalOpen: boolean;
  openTaskModal: () => void;
  closeTaskModal: () => void;

  isReminderModalOpen: boolean;
  openReminderModal: () => void;
  closeReminderModal: () => void;
}

const TaskReminderContext = createContext<TaskReminderContextType>({
  tasks: INITIAL_TASKS,
  addTask: () => {},
  toggleTask: () => {},
  selectedTasks: new Set(['1']),
  setSelectedTasks: () => {},
  selectAllTasks: () => {},

  reminders: INITIAL_REMINDERS,
  addReminder: () => {},
  toggleReminder: () => {},
  selectedReminders: new Set(['2']),
  setSelectedReminders: () => {},
  selectAllReminders: () => {},

  isTaskModalOpen: false,
  openTaskModal: () => {},
  closeTaskModal: () => {},

  isReminderModalOpen: false,
  openReminderModal: () => {},
  closeReminderModal: () => {},
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
  }) => {
    if (!data.title.trim()) return;
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
  };

  const toggleTask = (id: string) => {
    setTasks(prev =>
      prev.map(t => (t.id === id ? { ...t, done: !t.done } : t)),
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
  }) => {
    if (!data.title.trim()) return;
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
  };

  const toggleReminder = (id: string) => {
    setReminders(prev =>
      prev.map(r => (r.id === id ? { ...r, done: !r.done } : r)),
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
    ],
  );

  return (
    <TaskReminderContext.Provider value={value}>
      {children}
    </TaskReminderContext.Provider>
  );
};

export const useTaskReminder = () => useContext(TaskReminderContext);
