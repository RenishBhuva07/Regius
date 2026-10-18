import { Task, Reminder, HabitItem } from '../../Context/TaskReminderContext';

export type VoiceCommandIntent =
  | 'ADD_TASK'
  | 'COMPLETE_TASK'
  | 'SHOW_TASKS'
  | 'ADD_REMINDER'
  | 'SHOW_REMINDERS'
  | 'ADD_HABIT'
  | 'LOG_HABIT'
  | 'SHOW_HABITS'
  | 'START_FOCUS'
  | 'EXTEND_FOCUS'
  | 'PLAY_BRIEF'
  | 'SCHEDULE_SPRINT'
  | 'RESHUFFLE'
  | 'THANKS'
  | 'CANCEL'
  | 'GOODBYE'
  | 'WAKE_WORD_ONLY'
  | 'UNRECOGNIZED';

export type MissingSlotType =
  | 'title'
  | 'time'
  | 'date'
  | 'recurrence'
  | 'frequency'
  | 'target_item'
  | 'both';

export interface ExtractedSlots {
  title?: string;
  date?: string;
  time?: string;
  repeat?: string; // 'Once' | 'Daily' | 'Weekly' | 'Monthly' | custom
  isRecurring?: boolean;
  frequency?: string; // 'Daily' | 'Weekly' | 'Mon, Wed, Fri' | custom
  category?: string;
  priority?: 'low' | 'medium' | 'high';
  durationMinutes?: number;
  query?: string;
  note?: string;
}

export interface PendingClarification {
  id?: string;
  intent: 'ADD_REMINDER' | 'ADD_TASK' | 'ADD_HABIT' | 'COMPLETE_TASK' | 'LOG_HABIT';
  collectedData: ExtractedSlots;
  missingSlot: MissingSlotType;
  question: string;
  candidateOptions?: string[];
  createdAt?: number;
}

export interface InterpretedVoiceCommand {
  intent: VoiceCommandIntent;
  originalTranscript: string;
  parameters: ExtractedSlots;
  needsClarification?: PendingClarification;
  spokenConfirmation?: string;
  displayTitle?: string;
  displayBody?: string;
  shouldEndSession?: boolean;
}

export interface ExecutionContext {
  tasks: Task[];
  addTask: (data: {
    title: string;
    note?: string;
    category?: string;
    iconType?: 'mail' | 'users';
    priority?: 'low' | 'medium' | 'high';
    date?: string;
    time?: string;
  }) => any;
  toggleTask: (id: string) => any;

  reminders: Reminder[];
  addReminder: (data: {
    title: string;
    notes?: string;
    time?: string;
    date?: string;
    category?: string;
    repeat?: string;
  }) => any;
  toggleReminder: (id: string) => any;

  habits: HabitItem[];
  addHabit: (data: {
    title: string;
    category?: 'morning' | 'mindful' | 'evening';
    frequency?: string;
    timeOfDay?: string;
    accentColor?: string;
  }) => any;
  toggleHabit: (id: string) => any;
}

export interface ExecutionResult {
  success: boolean;
  intent: VoiceCommandIntent;
  displayTitle: string;
  displayBody: string;
  spokenResponse: string;
  resultSummary?: string;
  operationResult?: any;
  error?: string;
  shouldEndSession?: boolean;
}
