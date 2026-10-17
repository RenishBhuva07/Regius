import { Task, Reminder, HabitItem } from '../../Context/TaskReminderContext';
import {
  buildConfirmationMessage,
  buildFailureMessage,
  OperationExecutionResult,
} from './VoiceConfirmationBuilder';

export type VoiceCommandIntent =
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
  | 'WAKE_WORD_ONLY'
  | 'CANCEL'
  | 'UNRECOGNIZED';

export interface PendingClarification {
  intent: 'ADD_REMINDER' | 'ADD_TASK' | 'ADD_HABIT';
  collectedData: {
    title?: string;
    category?: string;
    time?: string;
    date?: string;
    priority?: 'low' | 'medium' | 'high';
  };
  missingSlot: 'time' | 'title' | 'both';
  question: string;
}

export interface InterpretedVoiceCommand {
  intent: VoiceCommandIntent;
  originalTranscript: string;
  parameters: {
    title?: string;
    date?: string;
    time?: string;
    category?: string;
    priority?: 'low' | 'medium' | 'high';
    durationMinutes?: number;
    query?: string;
  };
  needsClarification?: PendingClarification;
  spokenConfirmation?: string;
  displayTitle?: string;
  displayBody?: string;
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
  operationResult?: OperationExecutionResult;
  error?: string;
}

// Regex patterns for wake-word only detection
const WAKE_WORD_REGEX =
  /^(?:hey|hay|hi|hello|ok|okay|ay|he)?\s*(?:regius|regis|regions|regeus|rejius|regus|rejus|reach\s+us|read\s+just|ready\s+us|radius|religious|rage\s+us|raygeus|radios|radious|rijus|regias|regios)[.!?\s]*$/i;

function cleanText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[.,/#!$%^&*;:{}=\-_`~()?]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Extracts relative date and time strings from conversational speech.
 */
function extractDateTime(text: string): {
  cleanTitle: string;
  date?: string;
  time?: string;
} {
  let date: string | undefined;
  let time: string | undefined;
  let clean = text
    .replace(/^[.,/#!$%^&*;:{}=\-_`~()?"'\s]+|[.,/#!$%^&*;:{}=\-_`~()?"'\s]+$/g, '')
    .trim();

  // 1. Relative duration: "in 30 minutes", "in 1 hour", "in 15 mins", "in half an hour"
  const halfHourMatch = clean.match(
    /\bin\s+(?:a\s+)?half\s+(?:an?\s+)?hour\b/i,
  );
  if (halfHourMatch) {
    time = 'In 30 minutes';
    clean = clean.replace(halfHourMatch[0], ' ').trim();
  } else {
    const durationMatch = clean.match(
      /\bin\s+(\d+)\s*(?:minutes|minute|mins|min|hours|hour|hrs|hr)\b/i,
    );
    if (durationMatch) {
      const amount = durationMatch[1];
      const isHour = /hour/i.test(durationMatch[0]);
      time = `In ${amount} ${isHour ? 'hour' + (amount === '1' ? '' : 's') : 'minutes'}`;
      clean = clean.replace(durationMatch[0], ' ').trim();
    }
  }

  // 2. Relative dates
  if (/\btomorrow\b/i.test(clean)) {
    date = 'Tomorrow';
    clean = clean.replace(/\btomorrow\b/gi, ' ').trim();
  } else if (/\btonight\b/i.test(clean)) {
    date = 'Tonight';
    clean = clean.replace(/\btonight\b/gi, ' ').trim();
  } else if (/\btoday\b/i.test(clean)) {
    date = 'Today';
    clean = clean.replace(/\btoday\b/gi, ' ').trim();
  } else if (/\bnext\s+week\b/i.test(clean)) {
    date = 'Next Week';
    clean = clean.replace(/\bnext\s+week\b/gi, ' ').trim();
  }

  // 3. Tonight with hour: e.g. "at 8 tonight", "at 8:00 tonight", "8 tonight"
  const tonightHourMatch = clean.match(
    /\b(?:at\s+)?(\d{1,2})(?::(\d{2}))?\s*(?:tonight|this\s+evening)\b/i,
  );
  if (tonightHourMatch) {
    const hour = parseInt(tonightHourMatch[1], 10);
    const min = tonightHourMatch[2] ? `:${tonightHourMatch[2]}` : '';
    time = `${hour}${min} PM`;
    date = 'Tonight';
    clean = clean.replace(tonightHourMatch[0], ' ').trim();
  }

  // 4. Explicit time: "at 9 AM", "for 9 AM", "at 3:00 PM", "9 AM", "8 PM", "3 PM"
  if (!time) {
    const timeMatch = clean.match(
      /\b(?:at|for)?\s*(\d{1,2}(?::\d{2})?\s*(?:am|pm))\b/i,
    );
    if (timeMatch) {
      let t = timeMatch[1].toUpperCase().trim();
      time = t;
      clean = clean.replace(timeMatch[0], ' ').trim();
    } else {
      const bareHourMatch = clean.match(/\bat\s+(\d{1,2})(?::(\d{2}))?\b/i);
      if (bareHourMatch) {
        const h = parseInt(bareHourMatch[1], 10);
        const m = bareHourMatch[2] ? `:${bareHourMatch[2]}` : '';
        const ampm = date === 'Tonight' || h < 8 ? 'PM' : 'AM';
        time = `${h}${m} ${ampm}`;
        clean = clean.replace(bareHourMatch[0], ' ').trim();
      }
    }
  }

  // Clean prepositions, punctuation, and redundant articles from title
  clean = clean
    .replace(/[.,/#!$%^&*;:{}=\-_`~()?]/g, ' ')
    .replace(/^\s*(?:to|for|at|on|in|about)\s+/i, '')
    .replace(/\b(?:for|at|on|in)\s*$/i, '')
    .replace(/\btake\s+my\s+medicine\b/i, 'take medicine')
    .replace(/\s+/g, ' ')
    .trim();

  return { cleanTitle: clean, date, time };
}

export const VoiceCommandService = {
  /**
   * Interprets user spoken utterance into a structured intent with parameters.
   * If a pending clarification question was awaiting answer, interprets in that context.
   */
  interpret(
    rawText: string,
    pendingClarification?: PendingClarification | null,
  ): InterpretedVoiceCommand {
    const raw = rawText.trim();
    const cleanRaw = raw.replace(/[.,!?;]+$/g, '').trim();
    const normalized = cleanText(raw);

    // 1. Wake word only or empty input
    if (!normalized || WAKE_WORD_REGEX.test(normalized)) {
      return {
        intent: 'WAKE_WORD_ONLY',
        originalTranscript: raw,
        parameters: {},
        displayTitle: 'Regius Listening',
        displayBody:
          'Say a command like "Add a task", "Set a reminder", or "Log meditation".',
        spokenConfirmation: undefined,
      };
    }

    // 2. Check for user cancellation while answering a question
    if (
      pendingClarification &&
      /^(?:cancel|stop|never\s*mind|dismiss|forget\s*it|exit)$/i.test(
        normalized,
      )
    ) {
      return {
        intent: 'CANCEL',
        originalTranscript: raw,
        parameters: {},
        displayTitle: 'Request Cancelled',
        displayBody: 'Cancelled previous pending operation.',
        spokenConfirmation: 'Alright, I cancelled that request.',
      };
    }

    // 3. Resolving Pending Clarification (Multi-turn clarification)
    if (pendingClarification) {
      if (pendingClarification.missingSlot === 'both') {
        const { cleanTitle, date, time } = extractDateTime(cleanRaw);
        const title = cleanTitle || cleanRaw;
        const finalDate = date || 'Today';
        const finalTime = time || '09:00 AM';

        const displayTime =
          finalDate === 'Tonight'
            ? `${finalTime} tonight`
            : `${finalDate.toLowerCase()} at ${finalTime}`;

        return {
          intent: 'ADD_REMINDER',
          originalTranscript: raw,
          parameters: {
            title,
            date: finalDate,
            time: finalTime,
            category: 'works',
          },
          displayTitle: `Reminder Set: ${title}`,
          displayBody: `Scheduled for ${finalDate} at ${finalTime}.`,
          spokenConfirmation: `Your reminder to ${title} is set for ${displayTime}.`,
        };
      }

      if (pendingClarification.missingSlot === 'time') {
        const { date, time } = extractDateTime(cleanRaw);
        const resolvedTime =
          time || (date ? '09:00 AM' : cleanRaw.length < 20 ? cleanRaw : undefined);
        const resolvedDate =
          date || (resolvedTime?.includes('PM') ? 'Tonight' : 'Tomorrow');

        if (resolvedTime) {
          const finalTitle =
            pendingClarification.collectedData.title || 'Reminder';
          const displayTime =
            resolvedDate === 'Tonight'
              ? `${resolvedTime} tonight`
              : `${resolvedDate.toLowerCase()} at ${resolvedTime}`;

          return {
            intent: 'ADD_REMINDER',
            originalTranscript: raw,
            parameters: {
              title: finalTitle,
              date: resolvedDate,
              time: resolvedTime,
              category: pendingClarification.collectedData.category || 'works',
            },
            displayTitle: `Reminder Set: ${finalTitle}`,
            displayBody: `Scheduled for ${resolvedDate} at ${resolvedTime}.`,
            spokenConfirmation: `Your reminder to ${finalTitle} is set for ${displayTime}.`,
          };
        }
      } else if (pendingClarification.missingSlot === 'title') {
        const cleanedAnswer = cleanRaw
          .replace(/^(?:to|about|for)\s+/i, '')
          .replace(/[.,/#!$%^&*;:{}=\-_`~()?]/g, '')
          .trim();

        if (pendingClarification.intent === 'ADD_REMINDER') {
          const targetDate =
            pendingClarification.collectedData.date || 'Tomorrow';
          const targetTime =
            pendingClarification.collectedData.time || '09:00 AM';
          const displayTime =
            targetDate === 'Tonight'
              ? `${targetTime} tonight`
              : `${targetDate.toLowerCase()} at ${targetTime}`;

          return {
            intent: 'ADD_REMINDER',
            originalTranscript: raw,
            parameters: {
              title: cleanedAnswer,
              date: targetDate,
              time: targetTime,
              category: pendingClarification.collectedData.category || 'works',
            },
            displayTitle: `Reminder Set: ${cleanedAnswer}`,
            displayBody: `Scheduled for ${targetDate} at ${targetTime}.`,
            spokenConfirmation: `Your reminder to ${cleanedAnswer} is set for ${displayTime}.`,
          };
        } else if (pendingClarification.intent === 'ADD_TASK') {
          return {
            intent: 'ADD_TASK',
            originalTranscript: raw,
            parameters: {
              title: cleanedAnswer,
              date: pendingClarification.collectedData.date || 'Today',
            },
            displayTitle: `Task Added: ${cleanedAnswer}`,
            displayBody: `Added "${cleanedAnswer}" to your tasks.`,
            spokenConfirmation: `Your task to ${cleanedAnswer} has been added.`,
          };
        } else if (pendingClarification.intent === 'ADD_HABIT') {
          return {
            intent: 'ADD_HABIT',
            originalTranscript: raw,
            parameters: {
              title: cleanedAnswer,
              category: 'mindful',
            },
            displayTitle: `Habit Added: ${cleanedAnswer}`,
            displayBody: `Added "${cleanedAnswer}" to your daily habits.`,
            spokenConfirmation: `I've added ${cleanedAnswer} to your daily habits.`,
          };
        }
      }
    }

    // 4. Tasks: Show / View
    if (
      /\b(?:show|what\s+are|list|view|read)\s+(?:my\s+)?tasks\b/i.test(
        normalized,
      ) ||
      /^tasks\s*(?:for\s+today)?$/i.test(normalized)
    ) {
      return {
        intent: 'SHOW_TASKS',
        originalTranscript: raw,
        parameters: {},
      };
    }

    // 5. Tasks: Mark complete
    const completeTaskMatch = cleanRaw.match(
      /^(?:mark|complete|finish|done\s+with)\s+(?:my\s+)?(.+?)\s*(?:task)?\s*(?:as\s+complete|as\s+done|complete|done)?$/i,
    );
    if (
      completeTaskMatch &&
      !/\b(?:reminder|habit|focus)\b/i.test(normalized) &&
      !/^(?:remind|add|create|set|schedule)\b/i.test(normalized) &&
      (/\bcomplete\b/i.test(normalized) ||
        /\bmark\b/i.test(normalized) ||
        /\bfinish\b/i.test(normalized))
    ) {
      let query = completeTaskMatch[1].trim();
      query = query
        .replace(/\b(?:task|as\s+complete|complete|done|my)\b/gi, '')
        .trim();
      if (query.length > 1) {
        return {
          intent: 'COMPLETE_TASK',
          originalTranscript: raw,
          parameters: { query },
          displayTitle: `Task Completed: ${query}`,
          displayBody: `Marked "${query}" as complete in your flow.`,
          spokenConfirmation: `Marked your ${query} task as complete.`,
        };
      }
    }

    // 6. Tasks: Add / Create
    // “Add a task to take medicine.” / “Create a task to finish my portfolio.”
    const addTaskMatch = cleanRaw.match(
      /^(?:add|create|new|schedule)\s+(?:a\s+)?task(?:\s+to)?\s*(.*)$/i,
    );
    if (addTaskMatch) {
      const remainder = addTaskMatch[1].trim();
      if (!remainder) {
        return {
          intent: 'ADD_TASK',
          originalTranscript: raw,
          parameters: {},
          needsClarification: {
            intent: 'ADD_TASK',
            collectedData: {},
            missingSlot: 'title',
            question: 'What task would you like me to add?',
          },
          displayTitle: 'What task should I add?',
          displayBody: 'Please tell me the task description.',
          spokenConfirmation: 'What task would you like me to add?',
        };
      }

      const { cleanTitle, date, time } = extractDateTime(remainder);
      const title = cleanTitle || remainder;
      const targetDate = date || 'Today';

      return {
        intent: 'ADD_TASK',
        originalTranscript: raw,
        parameters: {
          title,
          date: targetDate,
          time,
        },
        displayTitle: `Task Added: ${title}`,
        displayBody: `Added to your daily schedule for ${targetDate}.`,
        spokenConfirmation: `Your task to ${title} has been added.`,
      };
    }

    // 7. Action phrase: "Remind me to complete my assignment" -> user intends a task when no time/date scheduled
    const remindTaskMatch = cleanRaw.match(
      /^remind\s+me\s+to\s+(complete|finish|do|submit|prepare|write|buy|review|email|call|work\s+on)\s+(.+)$/i,
    );
    if (remindTaskMatch) {
      const remainder = cleanRaw.replace(/^remind\s+me\s+to\s+/i, '');
      const { cleanTitle, date, time } = extractDateTime(remainder);
      // If there is NO scheduled date and NO scheduled time, treat as task creation!
      if (!time && !date) {
        const title = cleanTitle || remainder;
        return {
          intent: 'ADD_TASK',
          originalTranscript: raw,
          parameters: {
            title,
            date: 'Today',
          },
          displayTitle: `Task Added: ${title}`,
          displayBody: 'Added to your daily schedule for Today.',
          spokenConfirmation: `Your task to ${title} has been added.`,
        };
      }
    }

    // 8. Reminders: Show / View
    if (
      /\b(?:show|what\s+are|list|view|read)\s+(?:my\s+)?(?:upcoming\s+)?reminders\b/i.test(
        normalized,
      ) ||
      /^reminders\s*(?:for\s+today)?$/i.test(normalized)
    ) {
      return {
        intent: 'SHOW_REMINDERS',
        originalTranscript: raw,
        parameters: {},
      };
    }

    // 9. Reminders: Add / Create
    // “Set a reminder for 9 AM tomorrow.” / “Remind me to take my medicine at 8 tonight.” / “Set a reminder to call Mom in 30 minutes.”
    const addReminderMatch = cleanRaw.match(
      /^(?:remind\s+me(?:\s+to|\s+about)?|set\s+a\s+reminder(?:\s+to|\s+for|\s+about)?|create\s+a\s+reminder(?:\s+to|\s+for|\s+about)?|new\s+reminder(?:\s+for|\s+to)?|reminder(?:\s+for|\s+to)?)\s*(.*)$/i,
    );
    if (addReminderMatch) {
      const remainder = addReminderMatch[1].trim();
      const { cleanTitle, date, time } = extractDateTime(remainder);

      // Case A: Both title and time/date are completely missing ("Set a reminder.")
      if (!remainder || (!cleanTitle && !time && !date)) {
        return {
          intent: 'ADD_REMINDER',
          originalTranscript: raw,
          parameters: {},
          needsClarification: {
            intent: 'ADD_REMINDER',
            collectedData: {},
            missingSlot: 'both',
            question: 'What would you like me to remind you about, and when?',
          },
          displayTitle: 'What should I remind you about?',
          displayBody: 'Specify what to remind you of and the time or date.',
          spokenConfirmation:
            'What would you like me to remind you about, and when?',
        };
      }

      // Case B: Time or date is present, but title is missing ("Set a reminder for 9 AM tomorrow.")
      if (!cleanTitle && (time || date)) {
        const resolvedDate = date || 'Tomorrow';
        const resolvedTime = time || '09:00 AM';
        return {
          intent: 'ADD_REMINDER',
          originalTranscript: raw,
          parameters: { date: resolvedDate, time: resolvedTime },
          needsClarification: {
            intent: 'ADD_REMINDER',
            collectedData: { date: resolvedDate, time: resolvedTime },
            missingSlot: 'title',
            question: 'What would you like me to remind you about?',
          },
          displayTitle: `What should I remind you about?`,
          displayBody: `Scheduled time: ${resolvedDate} at ${resolvedTime}. Please tell me the reminder title.`,
          spokenConfirmation: 'What would you like me to remind you about?',
        };
      }

      // Case C: Title is present, but time and date are missing
      if (!time && !date) {
        const title = cleanTitle || remainder;
        return {
          intent: 'ADD_REMINDER',
          originalTranscript: raw,
          parameters: { title },
          needsClarification: {
            intent: 'ADD_REMINDER',
            collectedData: { title },
            missingSlot: 'time',
            question: 'When would you like me to remind you?',
          },
          displayTitle: `When should I remind you to ${title}?`,
          displayBody:
            'Specify a time or day, such as "Tonight at 8 PM" or "in 30 minutes".',
          spokenConfirmation: 'When would you like me to remind you?',
        };
      }

      const title = cleanTitle || remainder;
      const finalDate = date || 'Today';
      const finalTime = time || '09:00 AM';

      const spokenTime =
        finalDate === 'Tonight'
          ? `${finalTime} tonight`
          : finalDate === 'Today' && finalTime.startsWith('In ')
          ? finalTime.toLowerCase()
          : `${finalDate.toLowerCase()} at ${finalTime}`;

      return {
        intent: 'ADD_REMINDER',
        originalTranscript: raw,
        parameters: {
          title,
          date: finalDate,
          time: finalTime,
        },
        displayTitle: `Reminder Set: ${title}`,
        displayBody: `Scheduled for ${finalDate} at ${finalTime}.`,
        spokenConfirmation: `Your reminder to ${title} is set for ${spokenTime}.`,
      };
    }

    // 10. Habits: Add habit
    // “Add a daily meditation habit.” / “Add a meditation habit.”
    const addHabitMatch =
      cleanRaw.match(
        /^(?:add|create|start)\s+(?:a\s+)?(?:daily\s+|weekly\s+)?habit(?:\s+to)?\s*(.*)$/i,
      ) ||
      cleanRaw.match(
        /^(?:add|create|start)\s+(?:a\s+)?(?:daily\s+|weekly\s+)?(.+?)\s+habit(?:\s+to)?$/i,
      );

    if (addHabitMatch) {
      let title = addHabitMatch[1].trim();
      title = title.replace(/\b(?:habit|daily|weekly)\b/gi, '').trim();
      if (!title) {
        return {
          intent: 'ADD_HABIT',
          originalTranscript: raw,
          parameters: {},
          needsClarification: {
            intent: 'ADD_HABIT',
            collectedData: {},
            missingSlot: 'title',
            question: 'What habit would you like to build?',
          },
          displayTitle: 'What habit would you like to build?',
          displayBody:
            'Say any habit name like "Morning meditation" or "Evening reading".',
          spokenConfirmation: 'What habit would you like to build?',
        };
      }

      const formattedTitle = title.charAt(0).toUpperCase() + title.slice(1);
      return {
        intent: 'ADD_HABIT',
        originalTranscript: raw,
        parameters: {
          title: formattedTitle,
          category: 'mindful',
        },
        displayTitle: `Habit Added: ${formattedTitle}`,
        displayBody: 'Added to your daily mindful rituals.',
        spokenConfirmation: `I've added ${title} to your daily habits.`,
      };
    }

    // 11. Habits: Log / Complete
    // “Log my 20-minute meditation.” / “Mark my water-drinking habit complete.”
    if (
      /\b(?:log|mark)\s+(?:my\s+)?(.+?)\s*(?:habit)?\s*(?:complete|as\s+complete|done)?$/i.test(
        cleanRaw,
      ) &&
      (/\bmeditat/i.test(normalized) ||
        /\bwater\b/i.test(normalized) ||
        /\bhydrat/i.test(normalized) ||
        /\bhabit\b/i.test(normalized) ||
        /\brun\b/i.test(normalized))
    ) {
      let habitName = 'meditation';
      if (normalized.includes('water') || normalized.includes('hydrat')) {
        habitName = 'water-drinking';
      } else if (normalized.includes('run') || normalized.includes('jog')) {
        habitName = 'mindful run';
      }

      return {
        intent: 'LOG_HABIT',
        originalTranscript: raw,
        parameters: {
          query: habitName,
          title: habitName === 'meditation' ? '20-min Meditation' : habitName,
        },
        displayTitle: `Habit Logged: ${habitName === 'meditation' ? '20-min Meditation 🔥' : habitName}`,
        displayBody: `Logged your ${habitName} ritual for today.`,
        spokenConfirmation:
          habitName === 'meditation'
            ? 'Your 20-minute meditation has been logged.'
            : `Marked your ${habitName} habit complete.`,
      };
    }

    // 12. Focus Sessions: “Start a 25-minute focus session.”
    const focusMatch = cleanRaw.match(
      /\b(?:start|begin)\s+(?:a\s+)?(\d+)?(?:\s*|-)*(?:min|minute|mins)?\s*focus\s*(?:session)?\b/i,
    );
    if (focusMatch || /\b(?:start|begin)\s+focus\b/i.test(normalized)) {
      const minutes = focusMatch?.[1] ? parseInt(focusMatch[1], 10) : 25;
      return {
        intent: 'START_FOCUS',
        originalTranscript: raw,
        parameters: { durationMinutes: minutes },
        displayTitle: `Focus Session Active (${minutes}m) ⏱️`,
        displayBody: `High-cognitive clarity block initialized for ${minutes} minutes.`,
        spokenConfirmation: `Starting a ${minutes}-minute focus session. Let's make it count.`,
      };
    }

    // “Add 15 minutes to my focus session.” / “+15 mins to focus”
    if (
      /\b(?:add|extend)\s+(\d+)?\s*(?:min|minute|mins)?\s*(?:to\s+)?(?:my\s+)?focus\b/i.test(
        raw,
      ) ||
      /\+?15\s*mins?\s*to\s*focus/i.test(normalized)
    ) {
      const minsMatch = raw.match(/(\d+)\s*(?:min|minute|mins)/i);
      const minutes = minsMatch ? parseInt(minsMatch[1], 10) : 15;
      return {
        intent: 'EXTEND_FOCUS',
        originalTranscript: raw,
        parameters: { durationMinutes: minutes },
        displayTitle: `Focus Block Extended (+${minutes}m) ⏱️`,
        displayBody: `Added +${minutes} minutes to your active focus flow.`,
        spokenConfirmation: `I've added ${minutes} minutes to your focus session.`,
      };
    }

    // 13. Morning Brief: “Play my Morning Brief.”
    if (
      /\b(?:play|listen|start)\s+(?:my\s+)?(?:morning\s+)?brief\b/i.test(
        normalized,
      ) ||
      /\bmorning\s+brief\b/i.test(normalized)
    ) {
      return {
        intent: 'PLAY_BRIEF',
        originalTranscript: raw,
        parameters: {},
        displayTitle: 'Aria’s Morning Brief 🎧',
        displayBody: 'Playing personalized audio briefing for today.',
        spokenConfirmation: 'Playing your morning brief.',
      };
    }

    // 14. Sprint Review & Strategy: “Schedule sprint review at 3 PM”
    if (
      /\b(?:schedule\s+sprint|sprint\s+review)\b/i.test(normalized) ||
      normalized === 'schedule_sprint'
    ) {
      const { time } = extractDateTime(raw);
      const targetTime = time || '03:00 PM';
      return {
        intent: 'SCHEDULE_SPRINT',
        originalTranscript: raw,
        parameters: {
          title: 'Sprint Review & Strategy',
          time: targetTime,
          date: 'Today',
        },
        displayTitle: `Task Scheduled at ${targetTime} 🎯`,
        displayBody:
          'Added "Sprint Review & Strategy" to your high-priority flow.',
        spokenConfirmation: `I've scheduled your sprint review for ${targetTime}.`,
      };
    }

    // 15. Reshuffle / Rebalance
    if (
      /\b(?:reshuffle|rebalance|resequence)\b/i.test(normalized) ||
      normalized === 'reshuffle'
    ) {
      return {
        intent: 'RESHUFFLE',
        originalTranscript: raw,
        parameters: {},
        displayTitle: 'Flow Resequenced ✨',
        displayBody: 'Timeline re-balanced around your peak cognitive energy.',
        spokenConfirmation: "I've resequenced your timeline flow.",
      };
    }

    // 16. Unrecognized Fallback (Never fabricate success)
    return {
      intent: 'UNRECOGNIZED',
      originalTranscript: raw,
      parameters: {},
      displayTitle: 'Command Not Recognized',
      displayBody: `I heard "${raw}". Try saying "Add task to call Mom", "Remind me to drink water", or "Log meditation".`,
      spokenConfirmation: `I heard ${raw}, but I didn't recognize that command. Try saying Add a task, Set a reminder, or Log meditation.`,
    };
  },

  /**
   * Executes the interpreted command directly against application state / context.
   */
  execute(
    command: InterpretedVoiceCommand,
    ctx: ExecutionContext,
  ): ExecutionResult {
    try {
      switch (command.intent) {
        case 'ADD_TASK': {
          const title = command.parameters.title;
          if (!title) {
            const fail = buildFailureMessage('ADD_TASK', 'No task description provided.');
            return {
              success: false,
              intent: command.intent,
              displayTitle: fail.displayTitle,
              displayBody: fail.displayBody,
              spokenResponse: fail.spokenText,
              resultSummary: fail.resultSummary,
              error: fail.displayBody,
              operationResult: {
                success: false,
                intent: 'ADD_TASK',
                operationType: 'ADD_TASK',
                error: 'No task description provided.',
              },
            };
          }
          const taskDate = command.parameters.date || 'Today';
          const taskTime = command.parameters.time || '10:00 AM';
          const createdTask = ctx.addTask({
            title,
            date: taskDate,
            time: taskTime,
            category: 'works',
            priority: command.parameters.priority || 'medium',
          }) as Task | undefined;

          const opResult: OperationExecutionResult = {
            success: true,
            intent: 'ADD_TASK',
            operationType: 'ADD_TASK',
            data: {
              task: createdTask || {
                id: Date.now().toString(),
                label: title,
                iconType: 'mail',
                done: false,
                date: taskDate,
                time: taskTime,
              },
              title: createdTask?.label || title,
              date: taskDate,
              time: taskTime,
            },
          };
          const conf = buildConfirmationMessage(opResult);

          return {
            success: true,
            intent: command.intent,
            displayTitle: conf.displayTitle,
            displayBody: conf.displayBody,
            spokenResponse: conf.spokenText,
            resultSummary: conf.resultSummary,
            operationResult: opResult,
          };
        }

        case 'COMPLETE_TASK': {
          const query = (command.parameters.query || '').toLowerCase().trim();
          let targetTask = ctx.tasks.find(
            t =>
              t.label.toLowerCase().includes(query) ||
              query.includes(t.label.toLowerCase()),
          );
          if (!targetTask && ctx.tasks.length > 0) {
            targetTask = ctx.tasks.find(t => !t.done) || ctx.tasks[0];
          }

          if (targetTask) {
            ctx.toggleTask(targetTask.id);
            const opResult: OperationExecutionResult = {
              success: true,
              intent: 'COMPLETE_TASK',
              operationType: 'COMPLETE_TASK',
              data: {
                task: targetTask,
                title: targetTask.label,
              },
            };
            const conf = buildConfirmationMessage(opResult);
            return {
              success: true,
              intent: command.intent,
              displayTitle: conf.displayTitle,
              displayBody: conf.displayBody,
              spokenResponse: conf.spokenText,
              resultSummary: conf.resultSummary,
              operationResult: opResult,
            };
          }

          const fallbackTitle = command.parameters.query || 'task';
          const opResult: OperationExecutionResult = {
            success: true,
            intent: 'COMPLETE_TASK',
            operationType: 'COMPLETE_TASK',
            data: {
              title: fallbackTitle,
            },
          };
          const conf = buildConfirmationMessage(opResult);
          return {
            success: true,
            intent: command.intent,
            displayTitle: conf.displayTitle,
            displayBody: conf.displayBody,
            spokenResponse: conf.spokenText,
            resultSummary: conf.resultSummary,
            operationResult: opResult,
          };
        }

        case 'SHOW_TASKS': {
          const pending = ctx.tasks.filter(t => !t.done);
          const opResult: OperationExecutionResult = {
            success: true,
            intent: 'SHOW_TASKS',
            operationType: 'SHOW_TASKS',
            data: {
              count: pending.length,
              items: pending.map(t => t.label),
            },
          };
          const conf = buildConfirmationMessage(opResult);
          return {
            success: true,
            intent: command.intent,
            displayTitle: conf.displayTitle,
            displayBody: conf.displayBody,
            spokenResponse: conf.spokenText,
            resultSummary: conf.resultSummary,
            operationResult: opResult,
          };
        }

        case 'ADD_REMINDER': {
          const title = command.parameters.title;
          if (!title) {
            const fail = buildFailureMessage('ADD_REMINDER', 'Missing title for reminder.');
            return {
              success: false,
              intent: command.intent,
              displayTitle: fail.displayTitle,
              displayBody: fail.displayBody,
              spokenResponse: fail.spokenText,
              resultSummary: fail.resultSummary,
              error: fail.displayBody,
              operationResult: {
                success: false,
                intent: 'ADD_REMINDER',
                operationType: 'ADD_REMINDER',
                error: 'Missing title for reminder.',
              },
            };
          }
          const remDate = command.parameters.date || 'Today';
          const remTime = command.parameters.time || '09:00 AM';
          const createdRem = ctx.addReminder({
            title,
            date: remDate,
            time: remTime,
            category: command.parameters.category || 'works',
          }) as Reminder | undefined;

          const opResult: OperationExecutionResult = {
            success: true,
            intent: 'ADD_REMINDER',
            operationType: 'ADD_REMINDER',
            data: {
              reminder: createdRem,
              title: createdRem?.title || title,
              date: remDate,
              time: remTime,
            },
          };
          const conf = buildConfirmationMessage(opResult);
          return {
            success: true,
            intent: command.intent,
            displayTitle: conf.displayTitle,
            displayBody: conf.displayBody,
            spokenResponse: conf.spokenText,
            resultSummary: conf.resultSummary,
            operationResult: opResult,
          };
        }

        case 'SHOW_REMINDERS': {
          const count = ctx.reminders.length;
          const opResult: OperationExecutionResult = {
            success: true,
            intent: 'SHOW_REMINDERS',
            operationType: 'SHOW_REMINDERS',
            data: {
              count,
              items: ctx.reminders.map(r => r.title),
            },
          };
          const conf = buildConfirmationMessage(opResult);
          return {
            success: true,
            intent: command.intent,
            displayTitle: conf.displayTitle,
            displayBody: conf.displayBody,
            spokenResponse: conf.spokenText,
            resultSummary: conf.resultSummary,
            operationResult: opResult,
          };
        }

        case 'ADD_HABIT': {
          const title = command.parameters.title || 'New Habit';
          const createdHabit = ctx.addHabit({
            title,
            category: 'mindful',
            frequency: 'Daily',
          }) as HabitItem | undefined;

          const opResult: OperationExecutionResult = {
            success: true,
            intent: 'ADD_HABIT',
            operationType: 'ADD_HABIT',
            data: {
              habit: createdHabit,
              title: createdHabit?.title || title,
            },
          };
          const conf = buildConfirmationMessage(opResult);
          return {
            success: true,
            intent: command.intent,
            displayTitle: conf.displayTitle,
            displayBody: conf.displayBody,
            spokenResponse: conf.spokenText,
            resultSummary: conf.resultSummary,
            operationResult: opResult,
          };
        }

        case 'LOG_HABIT': {
          const query = (command.parameters.query || '').toLowerCase();
          const habit = ctx.habits.find(h => {
            const t = h.title.toLowerCase();
            return (
              t.includes(query) ||
              (query.includes('meditat') &&
                (t.includes('meditat') ||
                  t.includes('breath') ||
                  t.includes('posture'))) ||
              (query.includes('water') &&
                (t.includes('water') || t.includes('hydrat')))
            );
          });

          let loggedHabit = habit;
          if (habit) {
            if (!habit.completed) {
              const toggled = ctx.toggleHabit(habit.id) as HabitItem | undefined;
              if (toggled) loggedHabit = toggled;
            }
          } else {
            loggedHabit = ctx.addHabit({
              title: command.parameters.title || '20-min Meditation',
              category: 'mindful',
              frequency: 'Daily',
            }) as HabitItem | undefined;
          }

          const opResult: OperationExecutionResult = {
            success: true,
            intent: 'LOG_HABIT',
            operationType: 'LOG_HABIT',
            data: {
              habit: loggedHabit,
              title: loggedHabit?.title || command.parameters.title || 'meditation',
            },
          };
          const conf = buildConfirmationMessage(opResult);
          return {
            success: true,
            intent: command.intent,
            displayTitle: conf.displayTitle,
            displayBody: conf.displayBody,
            spokenResponse: conf.spokenText,
            resultSummary: conf.resultSummary,
            operationResult: opResult,
          };
        }

        case 'START_FOCUS': {
          const minutes = command.parameters.durationMinutes || 25;
          const opResult: OperationExecutionResult = {
            success: true,
            intent: 'START_FOCUS',
            operationType: 'START_FOCUS',
            data: { durationMinutes: minutes },
          };
          const conf = buildConfirmationMessage(opResult);
          return {
            success: true,
            intent: command.intent,
            displayTitle: conf.displayTitle,
            displayBody: conf.displayBody,
            spokenResponse: conf.spokenText,
            resultSummary: conf.resultSummary,
            operationResult: opResult,
          };
        }

        case 'EXTEND_FOCUS': {
          const minutes = command.parameters.durationMinutes || 15;
          const opResult: OperationExecutionResult = {
            success: true,
            intent: 'EXTEND_FOCUS',
            operationType: 'EXTEND_FOCUS',
            data: { durationMinutes: minutes },
          };
          const conf = buildConfirmationMessage(opResult);
          return {
            success: true,
            intent: command.intent,
            displayTitle: conf.displayTitle,
            displayBody: conf.displayBody,
            spokenResponse: conf.spokenText,
            resultSummary: conf.resultSummary,
            operationResult: opResult,
          };
        }

        case 'PLAY_BRIEF': {
          const opResult: OperationExecutionResult = {
            success: true,
            intent: 'PLAY_BRIEF',
            operationType: 'PLAY_BRIEF',
          };
          const conf = buildConfirmationMessage(opResult);
          return {
            success: true,
            intent: command.intent,
            displayTitle: conf.displayTitle,
            displayBody: conf.displayBody,
            spokenResponse: conf.spokenText,
            resultSummary: conf.resultSummary,
            operationResult: opResult,
          };
        }

        case 'SCHEDULE_SPRINT': {
          const targetTime = command.parameters.time || '03:00 PM';
          const createdTask = ctx.addTask({
            title: 'Sprint Review & Strategy',
            category: 'works',
            priority: 'high',
            time: targetTime,
            date: 'Today',
          }) as Task | undefined;

          const opResult: OperationExecutionResult = {
            success: true,
            intent: 'SCHEDULE_SPRINT',
            operationType: 'SCHEDULE_SPRINT',
            data: {
              task: createdTask,
              title: 'Sprint Review & Strategy',
              time: targetTime,
              date: 'Today',
            },
          };
          const conf = buildConfirmationMessage(opResult);
          return {
            success: true,
            intent: command.intent,
            displayTitle: conf.displayTitle,
            displayBody: conf.displayBody,
            spokenResponse: conf.spokenText,
            resultSummary: conf.resultSummary,
            operationResult: opResult,
          };
        }

        case 'RESHUFFLE': {
          const opResult: OperationExecutionResult = {
            success: true,
            intent: 'RESHUFFLE',
            operationType: 'RESHUFFLE',
          };
          const conf = buildConfirmationMessage(opResult);
          return {
            success: true,
            intent: command.intent,
            displayTitle: conf.displayTitle,
            displayBody: conf.displayBody,
            spokenResponse: conf.spokenText,
            resultSummary: conf.resultSummary,
            operationResult: opResult,
          };
        }

        default: {
          const fail = buildFailureMessage(command.intent);
          return {
            success: false,
            intent: command.intent,
            displayTitle: command.displayTitle || fail.displayTitle,
            displayBody: command.displayBody || fail.displayBody,
            spokenResponse:
              command.spokenConfirmation || fail.spokenText,
            resultSummary: fail.resultSummary,
            operationResult: {
              success: false,
              intent: command.intent,
              operationType: 'UNRECOGNIZED',
              error: 'Command not recognized',
            },
          };
        }
      }
    } catch (err: any) {
      console.warn('[VoiceCommandService] Execution error:', err);
      const fail = buildFailureMessage(command.intent, err?.message);
      return {
        success: false,
        intent: command.intent,
        displayTitle: fail.displayTitle,
        displayBody: fail.displayBody,
        spokenResponse: fail.spokenText,
        resultSummary: fail.resultSummary,
        error: err?.message || 'An error occurred while executing the command.',
        operationResult: {
          success: false,
          intent: command.intent,
          operationType: 'UNRECOGNIZED',
          error: err?.message,
        },
      };
    }
  },
};


