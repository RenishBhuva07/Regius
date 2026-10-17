import { Task, Reminder, HabitItem } from '../../Context/TaskReminderContext';
import { VoiceCommandIntent } from './VoiceCommandService';

export type CommandOperationType =
  | 'ADD_TASK'
  | 'COMPLETE_TASK'
  | 'SHOW_TASKS'
  | 'ADD_REMINDER'
  | 'SHOW_REMINDERS'
  | 'ADD_HABIT'
  | 'LOG_HABIT'
  | 'START_FOCUS'
  | 'EXTEND_FOCUS'
  | 'PLAY_BRIEF'
  | 'SCHEDULE_SPRINT'
  | 'RESHUFFLE'
  | 'CANCEL'
  | 'UNRECOGNIZED';

export interface CommandOperationData {
  task?: Task;
  reminder?: Reminder;
  habit?: HabitItem;
  title?: string;
  date?: string;
  time?: string;
  category?: string;
  durationMinutes?: number;
  count?: number;
  items?: string[];
  query?: string;
  [key: string]: any;
}

export interface OperationExecutionResult {
  success: boolean;
  intent: VoiceCommandIntent;
  operationType: CommandOperationType;
  data?: CommandOperationData;
  error?: string;
}

export interface BuiltConfirmationMessage {
  spokenText: string;
  displayTitle: string;
  displayBody: string;
  resultSummary: string;
  contextualExecutingText: string;
}

function cleanTitleForSpeech(title: string): string {
  return title
    .replace(/^to\s+/i, '')
    .replace(/^my\s+/i, '')
    .trim();
}

/**
 * Builds contextual in-progress executing text for each command type.
 */
export function getContextualExecutingText(intent: VoiceCommandIntent, title?: string): string {
  switch (intent) {
    case 'ADD_TASK':
      return title ? `Adding "${cleanTitleForSpeech(title)}" to tasks...` : 'Adding your task...';
    case 'COMPLETE_TASK':
      return title ? `Completing "${cleanTitleForSpeech(title)}"...` : 'Marking task complete...';
    case 'ADD_REMINDER':
      return title ? `Setting reminder for "${cleanTitleForSpeech(title)}"...` : 'Setting your reminder...';
    case 'ADD_HABIT':
      return title ? `Adding "${cleanTitleForSpeech(title)}" habit...` : 'Adding your habit...';
    case 'LOG_HABIT':
      return title ? `Logging "${cleanTitleForSpeech(title)}"...` : 'Logging your habit...';
    case 'START_FOCUS':
      return 'Starting your focus session...';
    case 'EXTEND_FOCUS':
      return 'Extending focus session...';
    case 'PLAY_BRIEF':
      return 'Preparing Morning Brief...';
    case 'SCHEDULE_SPRINT':
      return 'Scheduling sprint review...';
    case 'RESHUFFLE':
      return 'Resequencing your timeline...';
    default:
      return 'Working on your request...';
  }
}

/**
 * Builds user-facing confirmation text and summaries from the ACTUAL operation result.
 * Supports task creation, reminders, habits, focus sessions, morning brief, sprint reviews, etc.
 */
export function buildConfirmationMessage(
  result: OperationExecutionResult,
): BuiltConfirmationMessage {
  const { operationType, data } = result;

  switch (operationType) {
    case 'ADD_TASK': {
      const title = data?.task?.label || data?.title || 'task';
      const clean = cleanTitleForSpeech(title);
      const date = data?.task?.date || data?.date;
      const time = data?.task?.time || data?.time;

      let spokenText = `Your task to ${clean} has been added.`;
      if (date && date !== 'Today' && time) {
        spokenText = `Your task to ${clean} has been added for ${date.toLowerCase()} at ${time}.`;
      } else if (date && date !== 'Today') {
        spokenText = `Your task to ${clean} has been added for ${date.toLowerCase()}.`;
      } else if (time && time !== '10:00 AM') {
        spokenText = `Your task to ${clean} has been added for ${time}.`;
      }

      const displayTitle = `Task Added: ${clean}`;
      const scheduleDetail = date || time ? `Scheduled for ${date || 'Today'}${time ? ' at ' + time : ''}.` : 'Added to your daily schedule.';

      return {
        spokenText,
        displayTitle,
        displayBody: scheduleDetail,
        resultSummary: `Task added: ${clean}`,
        contextualExecutingText: `Adding task: ${clean}...`,
      };
    }

    case 'COMPLETE_TASK': {
      const title = data?.task?.label || data?.title || 'task';
      const clean = cleanTitleForSpeech(title);
      return {
        spokenText: `Your task to ${clean} has been marked as complete.`,
        displayTitle: `Task Completed: ${clean}`,
        displayBody: `Marked "${clean}" as complete in your flow schedule.`,
        resultSummary: `Task completed: ${clean}`,
        contextualExecutingText: `Marking "${clean}" complete...`,
      };
    }

    case 'ADD_REMINDER': {
      const title = data?.reminder?.title || data?.title || 'reminder';
      const clean = cleanTitleForSpeech(title);
      const date = data?.reminder?.date || data?.date || 'Today';
      const time = data?.reminder?.time || data?.time;

      let spokenText = 'Your reminder has been set successfully.';
      if (time && date === 'Tonight') {
        spokenText = `Your reminder to ${clean} is set for ${time} tonight.`;
      } else if (time && date && date !== 'Today') {
        spokenText = `Your reminder to ${clean} is set for ${date.toLowerCase()} at ${time}.`;
      } else if (time && time.startsWith('In ')) {
        spokenText = `Your reminder to ${clean} is set for ${time.toLowerCase()}.`;
      } else if (time) {
        spokenText = `Your reminder to ${clean} is set for ${time}.`;
      } else {
        spokenText = 'Your reminder has been set successfully.';
      }

      return {
        spokenText,
        displayTitle: `Reminder Set: ${clean}`,
        displayBody: `Scheduled for ${date}${time ? ' at ' + time : ''}.`,
        resultSummary: `Reminder set: ${clean}`,
        contextualExecutingText: `Setting reminder: ${clean}...`,
      };
    }

    case 'ADD_HABIT': {
      const title = data?.habit?.title || data?.title || 'habit';
      const clean = cleanTitleForSpeech(title);
      return {
        spokenText: `I've added that to your daily habits.`,
        displayTitle: `Habit Added: ${clean}`,
        displayBody: `Added "${clean}" to your daily rituals.`,
        resultSummary: `Habit added: ${clean}`,
        contextualExecutingText: `Adding habit: ${clean}...`,
      };
    }

    case 'LOG_HABIT': {
      const title = data?.habit?.title || data?.title || 'meditation';
      const isMeditation = /meditat/i.test(title);
      const spokenText = isMeditation
        ? 'Your meditation has been logged successfully.'
        : `Your ${cleanTitleForSpeech(title)} has been logged successfully.`;

      return {
        spokenText,
        displayTitle: `Habit Logged: ${title} 🔥`,
        displayBody: `Logged your ${title} ritual for today. Streak updated!`,
        resultSummary: `Habit logged: ${title}`,
        contextualExecutingText: `Logging habit: ${title}...`,
      };
    }

    case 'START_FOCUS': {
      const minutes = data?.durationMinutes || 25;
      return {
        spokenText: 'Your focus session has started.',
        displayTitle: `Focus Session Started (${minutes}m) ⏱️`,
        displayBody: `High-cognitive clarity block initialized for ${minutes} minutes.`,
        resultSummary: `Focus started (${minutes}m)`,
        contextualExecutingText: `Starting ${minutes}-min focus session...`,
      };
    }

    case 'EXTEND_FOCUS': {
      const minutes = data?.durationMinutes || 15;
      return {
        spokenText: `I've added ${minutes} minutes to your focus session.`,
        displayTitle: `Focus Block Extended (+${minutes}m) ⏱️`,
        displayBody: `Added +${minutes} minutes to your active focus flow.`,
        resultSummary: `Focus extended (+${minutes}m)`,
        contextualExecutingText: `Extending focus by ${minutes}m...`,
      };
    }

    case 'PLAY_BRIEF': {
      return {
        spokenText: 'Your Morning Brief is ready.',
        displayTitle: 'Morning Brief Ready 🎧',
        displayBody: 'Playing personalized audio briefing for today.',
        resultSummary: 'Morning Brief ready',
        contextualExecutingText: 'Preparing Morning Brief...',
      };
    }

    case 'SCHEDULE_SPRINT': {
      const time = data?.time || '03:00 PM';
      return {
        spokenText: `I've scheduled your sprint review for ${time}.`,
        displayTitle: `Sprint Review Scheduled (${time}) 🎯`,
        displayBody: `Added "Sprint Review & Strategy" for ${time} today.`,
        resultSummary: `Sprint scheduled at ${time}`,
        contextualExecutingText: 'Scheduling sprint review...',
      };
    }

    case 'RESHUFFLE': {
      return {
        spokenText: "I've resequenced your timeline flow.",
        displayTitle: 'Flow Resequenced ✨',
        displayBody: 'Timeline re-balanced around your peak cognitive energy.',
        resultSummary: 'Flow resequenced',
        contextualExecutingText: 'Resequencing timeline flow...',
      };
    }

    case 'SHOW_TASKS': {
      const count = data?.count || 0;
      const items = data?.items || [];
      const itemNames = items.slice(0, 3).join(', ');
      const spokenText = count === 0
        ? 'You have no pending tasks for today. Great job!'
        : `You have ${count} pending task${count === 1 ? '' : 's'}${itemNames ? ': ' + itemNames : ''}.`;

      return {
        spokenText,
        displayTitle: `Today's Tasks (${count} Pending)`,
        displayBody: spokenText,
        resultSummary: `${count} pending task${count === 1 ? '' : 's'}`,
        contextualExecutingText: 'Fetching your tasks...',
      };
    }

    case 'SHOW_REMINDERS': {
      const count = data?.count || 0;
      const spokenText = count === 0
        ? 'You have no scheduled reminders.'
        : `You have ${count} scheduled reminder${count === 1 ? '' : 's'}.`;

      return {
        spokenText,
        displayTitle: `Upcoming Reminders (${count})`,
        displayBody: spokenText,
        resultSummary: `${count} scheduled reminder${count === 1 ? '' : 's'}`,
        contextualExecutingText: 'Fetching your reminders...',
      };
    }

    default: {
      return {
        spokenText: 'Action completed successfully.',
        displayTitle: 'Command Completed',
        displayBody: 'Successfully executed your requested operation.',
        resultSummary: 'Action completed',
        contextualExecutingText: 'Completing operation...',
      };
    }
  }
}

/**
 * Builds a truthful failure message when an operation cannot be completed.
 */
export function buildFailureMessage(
  intent: VoiceCommandIntent,
  errorMessage?: string,
): { spokenText: string; displayTitle: string; displayBody: string; resultSummary: string } {
  let spokenText = 'There was an error completing your request.';
  let displayTitle = 'Operation Failed';

  switch (intent) {
    case 'ADD_TASK':
      spokenText = 'I was unable to add that task.';
      displayTitle = 'Unable to Add Task';
      break;
    case 'ADD_REMINDER':
      spokenText = 'I was unable to set that reminder.';
      displayTitle = 'Unable to Set Reminder';
      break;
    case 'ADD_HABIT':
    case 'LOG_HABIT':
      spokenText = 'I was unable to update that habit.';
      displayTitle = 'Habit Update Failed';
      break;
    case 'COMPLETE_TASK':
      spokenText = 'I was unable to mark that task complete.';
      displayTitle = 'Unable to Complete Task';
      break;
    default:
      spokenText = 'There was an error completing your request.';
      displayTitle = 'Command Failed';
      break;
  }

  return {
    spokenText,
    displayTitle,
    displayBody: errorMessage || 'Could not complete the operation. Please try again.',
    resultSummary: displayTitle,
  };
}
