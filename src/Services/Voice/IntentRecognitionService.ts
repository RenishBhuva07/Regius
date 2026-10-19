import { PendingClarification, InterpretedVoiceCommand } from './VoiceTypes';
import { VoiceAssistantState } from './VoiceStateMachine';
import {
  normalizeTranscript,
  isGratitudeIntent,
  isGoodbyeIntent,
  isDeclineIntent,
  isCancellationIntent,
  isSubstantiveSentenceWithNegative,
} from './TranscriptNormalizer';
import {
  isWakeWordOnly,
  getActiveWakePhrase,
  extractNameFromPhrase,
} from '../WakeWord/WakeWordDetectionEngine';

// Default wake-word regex patterns for fallback
const WAKE_WORD_REGEX =
  /^(?:hey|hay|hi|hello|ok|okay|ay|he)?\s*(?:regius|regis|regions|regeus|rejius|regus|rejus|reach\s+us|read\s+just|ready\s+us|radius|religious|rage\s+us|raygeus|radios|radious|rijus|regias|regios)[.!?\s]*$/i;

// Extracts recurrence and frequency from speech
export function extractRecurrence(text: string): {
  repeat?: string;
  frequency?: string;
  isRecurring?: boolean;
  cleanText: string;
} {
  let clean = text;
  let repeat: string | undefined;
  let frequency: string | undefined;
  let isRecurring: boolean | undefined;

  // 1. One-time
  const onceMatch = clean.match(
    /\b(?:once|one[\s-]time|just\s+once|only\s+once|single\s+time)\b/i,
  );
  if (onceMatch) {
    repeat = 'Once';
    isRecurring = false;
    clean = clean.replace(onceMatch[0], ' ').trim();
    return { repeat, isRecurring, cleanText: clean };
  }

  // 2. Daily / Every day / Every morning / Every evening / Every night
  const dailyMatch = clean.match(
    /\b(?:every\s+day|daily|each\s+day|every\s+(?:single\s+)?day|every\s+morning|every\s+night|every\s+evening)\b/i,
  );
  if (dailyMatch) {
    repeat = 'Daily';
    frequency = 'Daily';
    isRecurring = true;
    clean = clean.replace(dailyMatch[0], ' ').trim();
    return { repeat, frequency, isRecurring, cleanText: clean };
  }

  // 3. Weekday / Mon-Fri / Mon, Wed, Fri
  const mwfMatch = clean.match(
    /\b(?:mon(?:day)?\s*,\s*wed(?:nesday)?\s*(?:,\s*and|\s*and|\s*,)?\s*fri(?:day)?|weekdays?|every\s+weekday)\b/i,
  );
  if (mwfMatch) {
    repeat = 'Weekly';
    frequency = 'Mon, Wed, Fri';
    isRecurring = true;
    clean = clean.replace(mwfMatch[0], ' ').trim();
    return { repeat, frequency, isRecurring, cleanText: clean };
  }

  // 4. Specific day of week (Every Monday, Every Tuesday, etc.)
  const dayOfWeekMatch = clean.match(
    /\bevery\s+(monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/i,
  );
  if (dayOfWeekMatch) {
    const day =
      dayOfWeekMatch[1].charAt(0).toUpperCase() +
      dayOfWeekMatch[1].slice(1).toLowerCase();
    repeat = `Every ${day}`;
    frequency = `Weekly on ${day}`;
    isRecurring = true;
    clean = clean.replace(dayOfWeekMatch[0], ' ').trim();
    return { repeat, frequency, isRecurring, cleanText: clean };
  }

  // 5. Weekly / Every week
  const weeklyMatch = clean.match(/\b(?:weekly|every\s+week)\b/i);
  if (weeklyMatch) {
    repeat = 'Weekly';
    frequency = 'Weekly';
    isRecurring = true;
    clean = clean.replace(weeklyMatch[0], ' ').trim();
    return { repeat, frequency, isRecurring, cleanText: clean };
  }

  // 6. Monthly / First day of month / Every month
  const monthlyMatch = clean.match(
    /\b(?:monthly|every\s+month|on\s+the\s+first\s+day\s+of\s+every\s+month|first\s+of\s+every\s+month)\b/i,
  );
  if (monthlyMatch) {
    repeat = 'Monthly';
    frequency = 'Monthly';
    isRecurring = true;
    clean = clean.replace(monthlyMatch[0], ' ').trim();
    return { repeat, frequency, isRecurring, cleanText: clean };
  }

  // 7. Hourly / Every 2 hours
  const intervalHoursMatch = clean.match(
    /\bevery\s+(\d+)\s*(?:hours|hour|hrs|hr)\b/i,
  );
  if (intervalHoursMatch) {
    repeat = `Every ${intervalHoursMatch[1]} hrs`;
    isRecurring = true;
    clean = clean.replace(intervalHoursMatch[0], ' ').trim();
    return { repeat, isRecurring, cleanText: clean };
  }

  return { repeat, frequency, isRecurring, cleanText: clean };
}

// Extracts relative date and time from speech
export function extractDateTime(text: string): {
  cleanTitle: string;
  date?: string;
  time?: string;
  repeat?: string;
  frequency?: string;
  isRecurring?: boolean;
} {
  const recurrenceResult = extractRecurrence(text);
  let clean = recurrenceResult.cleanText
    .replace(
      /^[.,/#!$%^&*;:{}=\-_`~()?"'\s]+|[.,/#!$%^&*;:{}=\-_`~()?"'\s]+$/g,
      '',
    )
    .trim();

  let date: string | undefined;
  let time: string | undefined;

  if (/\bevery\s+morning\b/i.test(text)) {
    time = '08:00 AM';
    date = 'Today';
  } else if (/\bevery\s+night\b|\bevery\s+evening\b/i.test(text)) {
    time = '08:00 PM';
    date = 'Today';
  }

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
      time = `In ${amount} ${
        isHour ? 'hour' + (amount === '1' ? '' : 's') : 'minutes'
      }`;
      clean = clean.replace(durationMatch[0], ' ').trim();
    }
  }

  // 2. Relative dates
  if (/\btomorrow\s+morning\b/i.test(clean)) {
    date = 'Tomorrow';
    time = time || '09:00 AM';
    clean = clean.replace(/\btomorrow\s+morning\b/gi, ' ').trim();
  } else if (/\btomorrow\s+afternoon\b/i.test(clean)) {
    date = 'Tomorrow';
    time = time || '02:00 PM';
    clean = clean.replace(/\btomorrow\s+afternoon\b/gi, ' ').trim();
  } else if (/\btomorrow\s+night\b/i.test(clean)) {
    date = 'Tomorrow';
    time = time || '08:00 PM';
    clean = clean.replace(/\btomorrow\s+night\b/gi, ' ').trim();
  } else if (/\btomorrow\b/i.test(clean)) {
    date = 'Tomorrow';
    clean = clean.replace(/\btomorrow\b/gi, ' ').trim();
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
  } else if (/\b(?:tonight|this\s+evening)\b/i.test(clean)) {
    date = 'Tonight';
    time = time || '07:00 PM';
    clean = clean.replace(/\b(?:tonight|this\s+evening)\b/gi, ' ').trim();
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

  // Clean prepositions, punctuation, and redundant phrases from title
  clean = clean
    .replace(/[.,/#!$%^&*;:{}=\-_`~()?]/g, ' ')
    .replace(/^\s*(?:to|for|at|on|in|about)\s+/i, '')
    .replace(/\b(?:for|at|on|in)\s*$/i, '')
    .replace(/\btake\s+my\s+medicine\b/i, 'take medicine')
    .replace(/\s+/g, ' ')
    .trim();

  return {
    cleanTitle: clean,
    date,
    time,
    repeat: recurrenceResult.repeat,
    frequency: recurrenceResult.frequency,
    isRecurring: recurrenceResult.isRecurring,
  };
}

export const IntentRecognitionService = {
  // Interprets utterance into structured intent and parameters
  interpret(
    rawText: string,
    pendingClarification?: PendingClarification | null,
    conversationState?: VoiceAssistantState,
  ): InterpretedVoiceCommand {
    const raw = rawText.trim();
    const { cleanRaw, normalized } = normalizeTranscript(raw);
    const activePhrase = getActiveWakePhrase();
    const assistantName = extractNameFromPhrase(activePhrase) || 'Regius';

    // 1. Wake word only or empty input
    if (
      !normalized ||
      WAKE_WORD_REGEX.test(normalized) ||
      isWakeWordOnly(normalized, activePhrase)
    ) {
      return {
        intent: 'WAKE_WORD_ONLY',
        originalTranscript: raw,
        parameters: {},
        displayTitle: `${activePhrase} Listening`,
        displayBody:
          'Say a command like "Add a task to take medicine", "Set a reminder", or "Log meditation".',
        spokenConfirmation: undefined,
      };
    }

    // 2. Multi-turn Follow-up Context (Scenario B)
    // When SIA previously asked "Anything else I can help you with?"
    if (conversationState === 'awaiting_follow_up') {
      if (isDeclineIntent(normalized) || isGoodbyeIntent(normalized)) {
        return {
          intent: 'DECLINE_FOLLOW_UP',
          originalTranscript: raw,
          parameters: {},
          displayTitle: 'Session Completed',
          displayBody: 'Alright! Take care. I’m here whenever you need me.',
          spokenConfirmation:
            'Alright! Take care. I’m here whenever you need me.',
          shouldEndSession: true,
        };
      }
    }

    // 3. Multi-turn Pending Clarification / Confirmation Context (Scenario E)
    if (pendingClarification) {
      // If user says "no", "cancel", "never mind", etc. to a pending question:
      // It cancels the pending action without terminating the entire voice session.
      if (
        isCancellationIntent(normalized) ||
        /^no(?:\s+(?:do\s+not|cancel|never\s*mind))?$/i.test(normalized) ||
        normalized === 'no' ||
        normalized === 'nope' ||
        normalized === 'cancel'
      ) {
        return {
          intent: 'CANCEL',
          originalTranscript: raw,
          parameters: {},
          displayTitle: 'Request Cancelled',
          displayBody: 'Cancelled previous pending operation.',
          spokenConfirmation: 'Alright, I cancelled that request.',
          shouldEndSession: false,
        };
      }

      // If user switches topic directly
      if (
        focusSessionPattern(normalized) ||
        morningBriefPattern(normalized) ||
        sprintPattern(normalized) ||
        showTasksPattern(normalized) ||
        showRemindersPattern(normalized)
      ) {
        pendingClarification = null;
      } else {
        return this.resolveClarification(
          cleanRaw,
          normalized,
          pendingClarification,
        );
      }
    }

    // 4. Cancellation Intent (general)
    if (isCancellationIntent(normalized)) {
      return {
        intent: 'CANCEL',
        originalTranscript: raw,
        parameters: {},
        displayTitle: 'Request Cancelled',
        displayBody: 'Cancelled previous pending operation.',
        spokenConfirmation: 'Alright, I cancelled that request.',
      };
    }

    // 5. Guard against sentences containing "no" as part of a task or note
    // (e.g. "Add a task: no meeting today", "Remind me not to forget my keys")
    const isSubstantiveNegative = isSubstantiveSentenceWithNegative(raw);

    // Goodbye intent
    if (!isSubstantiveNegative && isGoodbyeIntent(normalized)) {
      return {
        intent: 'GOODBYE',
        originalTranscript: raw,
        parameters: {},
        displayTitle: 'Session Ended',
        displayBody: `Say "${getActiveWakePhrase()}" whenever you need me.`,
        spokenConfirmation: 'Goodbye! Have a great day.',
        shouldEndSession: true,
      };
    }

    // Gratitude intent
    if (!isSubstantiveNegative && isGratitudeIntent(normalized)) {
      let politeReply =
        "You're welcome! Is there anything else I can help you with?";
      if (
        normalized.includes('so much') ||
        normalized.includes('very much') ||
        normalized.includes('a lot')
      ) {
        politeReply =
          "You're very welcome! Let me know if you need anything else.";
      } else if (normalized.includes('helpful')) {
        politeReply = 'Glad I could help. Is there anything else you need?';
      }

      return {
        intent: 'THANKS',
        originalTranscript: raw,
        parameters: {},
        displayTitle: 'You’re Welcome ✨',
        displayBody: politeReply,
        spokenConfirmation: politeReply,
        requiresFollowUp: true,
      };
    }

    // ─── 7. Fresh Command Parsing ──────────────────────────────────────────

    // A: Reminders: Show
    if (showRemindersPattern(normalized)) {
      return {
        intent: 'SHOW_REMINDERS',
        originalTranscript: raw,
        parameters: {},
        displayTitle: 'Upcoming Reminders',
        displayBody: 'Fetching your scheduled reminders.',
      };
    }

    // B: Reminders: Add / Create
    const reminderResult = this.parseReminder(raw, cleanRaw, normalized);
    if (reminderResult) return reminderResult;

    // C: Habits: Add or Log
    const habitResult = this.parseHabit(raw, cleanRaw, normalized);
    if (habitResult) return habitResult;

    // D: Tasks: Show
    if (showTasksPattern(normalized)) {
      return {
        intent: 'SHOW_TASKS',
        originalTranscript: raw,
        parameters: {},
        displayTitle: 'Today’s Tasks',
        displayBody: 'Fetching your task schedule for today.',
      };
    }

    // E: Tasks: Complete
    const completeMatch = cleanRaw.match(
      /^(?:mark|complete|finish|done\s+with)\s+(?:my\s+)?(.+?)\s*(?:task)?\s*(?:as\s+complete|as\s+done|complete|done)?$/i,
    );
    if (
      completeMatch &&
      !/\b(?:reminder|habit|focus)\b/i.test(normalized) &&
      !/^(?:remind|add|create|set|schedule)\b/i.test(normalized)
    ) {
      let query = completeMatch[1].trim();
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

    // F: Tasks: Add / Create
    const taskResult = this.parseTask(raw, cleanRaw, normalized);
    if (taskResult) return taskResult;

    // G: Focus Sessions
    const focusResult = this.parseFocus(raw, cleanRaw, normalized);
    if (focusResult) return focusResult;

    // H: Morning Brief
    if (morningBriefPattern(normalized)) {
      return {
        intent: 'PLAY_BRIEF',
        originalTranscript: raw,
        parameters: {},
        displayTitle: `${assistantName}’s Morning Brief 🎧`,
        displayBody: 'Playing personalized audio briefing for today.',
        spokenConfirmation: 'Playing your morning brief.',
      };
    }

    // I: Sprint Review & Strategy
    if (sprintPattern(normalized)) {
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

    // J: Reshuffle
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

    // K: Fallback Unrecognized
    return {
      intent: 'UNRECOGNIZED',
      originalTranscript: raw,
      parameters: {},
      displayTitle: 'Command Not Recognized',
      displayBody: `I heard "${raw}". Try saying "Add a task to take medicine", "Set a reminder", or "Log meditation".`,
      spokenConfirmation: `I heard ${raw}, but I didn't recognize that command. Try saying Add a task, Set a reminder, or Log meditation.`,
    };
  },

  // Multi-turn slot filling for incomplete commands
  resolveClarification(
    cleanRaw: string,
    normalized: string,
    pending: PendingClarification,
  ): InterpretedVoiceCommand {
    const raw = cleanRaw;

    // ─── ADD_REMINDER Clarification ───
    if (pending.intent === 'ADD_REMINDER') {
      if (pending.missingSlot === 'both') {
        const { cleanTitle, date, time, repeat } = extractDateTime(cleanRaw);
        // Case 1: User answered with the title only (e.g. "Take my medicine.")
        if (cleanTitle && !date && !time) {
          return {
            intent: 'ADD_REMINDER',
            originalTranscript: raw,
            parameters: { title: cleanTitle },
            needsClarification: {
              id: `clarify_${Date.now()}`,
              intent: 'ADD_REMINDER',
              collectedData: { title: cleanTitle },
              missingSlot: 'time',
              question: 'When would you like the reminder?',
              createdAt: Date.now(),
            },
            displayTitle: `When should I remind you to ${cleanTitle}?`,
            displayBody:
              'Specify a time or day, such as "At 8 PM" or "Tomorrow at 9 AM".',
            spokenConfirmation: 'When would you like the reminder?',
          };
        }

        // Case 2: User answered with the time only
        if (!cleanTitle && (date || time)) {
          const resolvedDate = date || 'Tomorrow';
          const resolvedTime = time || '09:00 AM';
          return {
            intent: 'ADD_REMINDER',
            originalTranscript: raw,
            parameters: { date: resolvedDate, time: resolvedTime, repeat },
            needsClarification: {
              id: `clarify_${Date.now()}`,
              intent: 'ADD_REMINDER',
              collectedData: { date: resolvedDate, time: resolvedTime, repeat },
              missingSlot: 'title',
              question: 'What would you like me to remind you about?',
              createdAt: Date.now(),
            },
            displayTitle: 'What should I remind you about?',
            displayBody: `Scheduled time: ${resolvedDate} at ${resolvedTime}. Please tell me the reminder title.`,
            spokenConfirmation: 'What would you like me to remind you about?',
          };
        }

        // Case 3: Both title and timing provided
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
            repeat,
            category: 'works',
          },
          displayTitle: `Reminder Set: ${title}`,
          displayBody: `Scheduled for ${finalDate} at ${finalTime}.`,
          spokenConfirmation: `Your reminder to ${title} is set for ${displayTime}.`,
        };
      }

      if (pending.missingSlot === 'time') {
        const { date, time, repeat } = extractDateTime(cleanRaw);
        const resolvedTime =
          time ||
          (date ? '09:00 AM' : cleanRaw.length < 20 ? cleanRaw : undefined);
        const resolvedDate =
          date || (resolvedTime?.includes('PM') ? 'Tonight' : 'Tomorrow');

        if (resolvedTime) {
          const finalTitle = pending.collectedData.title || 'Reminder';

          // If recurrence was already provided or detected, finish now
          if (repeat || pending.collectedData.repeat) {
            const finalRepeat =
              repeat || pending.collectedData.repeat || 'Once';
            const scheduleDesc =
              finalRepeat === 'Daily'
                ? `every day at ${resolvedTime}`
                : `${resolvedDate.toLowerCase()} at ${resolvedTime}`;

            return {
              intent: 'ADD_REMINDER',
              originalTranscript: raw,
              parameters: {
                title: finalTitle,
                date: resolvedDate,
                time: resolvedTime,
                repeat: finalRepeat,
                category: pending.collectedData.category || 'works',
              },
              displayTitle: `Reminder Set: ${finalTitle}`,
              displayBody: `Scheduled for ${scheduleDesc} (${finalRepeat}).`,
              spokenConfirmation: `Done! I'll remind you to ${finalTitle} ${scheduleDesc}.`,
            };
          }

          // Otherwise ask for recurrence before finalizing
          return {
            intent: 'ADD_REMINDER',
            originalTranscript: raw,
            parameters: {
              title: finalTitle,
              date: resolvedDate,
              time: resolvedTime,
            },
            needsClarification: {
              id: `clarify_${Date.now()}`,
              intent: 'ADD_REMINDER',
              collectedData: {
                title: finalTitle,
                date: resolvedDate,
                time: resolvedTime,
              },
              missingSlot: 'recurrence',
              question:
                'Should that be a one-time reminder or repeat every day?',
              createdAt: Date.now(),
            },
            displayTitle: 'One-time or recurring?',
            displayBody:
              'Should this reminder repeat daily or be a one-time alert?',
            spokenConfirmation:
              'Should that be a one-time reminder or repeat every day?',
          };
        }
      } else if (pending.missingSlot === 'title') {
        const cleanedAnswer = cleanRaw
          .replace(/^(?:to|about|for)\s+/i, '')
          .replace(/[.,/#!$%^&*;:{}=\-_`~()?]/g, '')
          .trim();

        const targetDate = pending.collectedData.date || 'Tomorrow';
        const targetTime = pending.collectedData.time || '09:00 AM';
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
            repeat: pending.collectedData.repeat,
            category: pending.collectedData.category || 'works',
          },
          displayTitle: `Reminder Set: ${cleanedAnswer}`,
          displayBody: `Scheduled for ${targetDate} at ${targetTime}.`,
          spokenConfirmation: `Your reminder to ${cleanedAnswer} is set for ${displayTime}.`,
        };
      } else if (pending.missingSlot === 'recurrence') {
        const { repeat } = extractRecurrence(cleanRaw);
        const isEveryDay = /every|repeat|daily/i.test(normalized);
        const resolvedRepeat = repeat || (isEveryDay ? 'Daily' : 'Once');
        const finalTitle = pending.collectedData.title || 'Reminder';
        const finalDate = pending.collectedData.date || 'Today';
        const finalTime = pending.collectedData.time || '08:00 PM';

        const scheduleDesc =
          resolvedRepeat === 'Daily'
            ? `every day at ${finalTime}`
            : `${finalDate.toLowerCase()} at ${finalTime}`;

        return {
          intent: 'ADD_REMINDER',
          originalTranscript: raw,
          parameters: {
            title: finalTitle,
            date: finalDate,
            time: finalTime,
            repeat: resolvedRepeat,
            category: pending.collectedData.category || 'works',
          },
          displayTitle: `Reminder Set: ${finalTitle}`,
          displayBody: `Scheduled for ${scheduleDesc} (${resolvedRepeat}).`,
          spokenConfirmation: `Done! I'll remind you to ${finalTitle} ${scheduleDesc}.`,
        };
      }
    }

    // ─── ADD_TASK Clarification ───
    if (pending.intent === 'ADD_TASK') {
      const cleanedAnswer = cleanRaw
        .replace(/^(?:to|about|for)\s+/i, '')
        .replace(/[.,/#!$%^&*;:{}=\-_`~()?]/g, '')
        .trim();

      return {
        intent: 'ADD_TASK',
        originalTranscript: raw,
        parameters: {
          title: cleanedAnswer,
          date: pending.collectedData.date || 'Today',
        },
        displayTitle: `Task Added: ${cleanedAnswer}`,
        displayBody: `Added "${cleanedAnswer}" to your tasks.`,
        spokenConfirmation: `Your task to ${cleanedAnswer} has been added.`,
      };
    }

    // ─── ADD_HABIT Clarification ───
    if (pending.intent === 'ADD_HABIT') {
      const cleanedAnswer = cleanRaw
        .replace(/^(?:to|about|for)\s+/i, '')
        .replace(/[.,/#!$%^&*;:{}=\-_`~()?]/g, '')
        .trim();

      if (pending.missingSlot === 'frequency') {
        const { frequency } = extractRecurrence(cleanRaw);
        const freq = frequency || 'Daily';
        const title = pending.collectedData.title || 'Meditation';
        return {
          intent: 'ADD_HABIT',
          originalTranscript: raw,
          parameters: {
            title,
            frequency: freq,
            category: 'mindful',
          },
          displayTitle: `Habit Added: ${title}`,
          displayBody: `Added "${title}" to your habits (${freq}).`,
          spokenConfirmation: `I've added ${title.toLowerCase()} to your ${freq.toLowerCase()} habits.`,
        };
      }

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

    return {
      intent: pending.intent,
      originalTranscript: raw,
      parameters: pending.collectedData,
      needsClarification: pending,
      displayTitle: 'Please clarify',
      displayBody: pending.question,
      spokenConfirmation: pending.question,
    };
  },

  // Parses reminder commands
  parseReminder(
    raw: string,
    cleanRaw: string,
    _normalized: string,
  ): InterpretedVoiceCommand | null {
    const isReminderMatch = cleanRaw.match(
      /^(?:can\s+you\s+|could\s+you\s+|please\s+)?(?:remind\s+me(?:\s+to|\s+about)?|set\s+a\s+reminder(?:\s+to|\s+for|\s+about)?|create\s+a\s+reminder(?:\s+to|\s+for|\s+about)?|new\s+reminder(?:\s+for|\s+to)?|reminder(?:\s+for|\s+to)?|i\s+don['’]?t\s+want\s+to\s+forget|i\s+need\s+an\s+alert(?:\s+to)?)\s*(.*)$/i,
    );

    if (!isReminderMatch) return null;

    const remainder = isReminderMatch[1].trim();
    const { cleanTitle, date, time, repeat, frequency, isRecurring } =
      extractDateTime(remainder);

    // "Remind me to [verb]" without time/date is treated as an unscheduled task
    const remindTaskMatch = cleanRaw.match(
      /^remind\s+me\s+to\s+(complete|finish|do|submit|prepare|write|buy|review|email|call|work\s+on)\s+(.+)$/i,
    );
    if (remindTaskMatch && !time && !date) {
      return null;
    }

    // Case A: Both missing
    if (!remainder || (!cleanTitle && !time && !date)) {
      return {
        intent: 'ADD_REMINDER',
        originalTranscript: raw,
        parameters: {},
        needsClarification: {
          id: `clarify_${Date.now()}`,
          intent: 'ADD_REMINDER',
          collectedData: {},
          missingSlot: 'both',
          question: 'What would you like me to remind you about, and when?',
          createdAt: Date.now(),
        },
        displayTitle: 'What should I remind you about?',
        displayBody: 'Specify what to remind you of and the time or date.',
        spokenConfirmation:
          'What would you like me to remind you about, and when?',
      };
    }

    // Case B: Time or date present, title missing
    if (!cleanTitle && (time || date)) {
      const resolvedDate = date || 'Tomorrow';
      const resolvedTime = time || '09:00 AM';
      return {
        intent: 'ADD_REMINDER',
        originalTranscript: raw,
        parameters: { date: resolvedDate, time: resolvedTime },
        needsClarification: {
          id: `clarify_${Date.now()}`,
          intent: 'ADD_REMINDER',
          collectedData: { date: resolvedDate, time: resolvedTime },
          missingSlot: 'title',
          question: 'What would you like me to remind you about?',
          createdAt: Date.now(),
        },
        displayTitle: 'What should I remind you about?',
        displayBody: `Scheduled time: ${resolvedDate} at ${resolvedTime}. Please tell me the reminder title.`,
        spokenConfirmation: 'What would you like me to remind you about?',
      };
    }

    // Case C: Title present, time and date missing
    if (!time && !date) {
      const title = cleanTitle || remainder;
      return {
        intent: 'ADD_REMINDER',
        originalTranscript: raw,
        parameters: { title },
        needsClarification: {
          id: `clarify_${Date.now()}`,
          intent: 'ADD_REMINDER',
          collectedData: { title },
          missingSlot: 'time',
          question: 'When would you like me to remind you?',
          createdAt: Date.now(),
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
      repeat === 'Daily'
        ? `every day at ${finalTime}`
        : finalDate === 'Tonight'
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
        repeat:
          repeat ||
          (cleanRaw.match(/\bevery\s+morning\b/i) ? 'Daily' : undefined),
        frequency,
        isRecurring,
        category: 'works',
      },
      displayTitle: `Reminder Set: ${title}`,
      displayBody: `Scheduled for ${finalDate} at ${finalTime}.`,
      spokenConfirmation: `Your reminder to ${title} is set for ${spokenTime}.`,
    };
  },

  // Parses habit commands
  parseHabit(
    raw: string,
    cleanRaw: string,
    normalized: string,
  ): InterpretedVoiceCommand | null {
    // 1. Show habits
    if (showHabitsPattern(normalized)) {
      return {
        intent: 'SHOW_HABITS',
        originalTranscript: raw,
        parameters: {},
        displayTitle: 'Active Habits',
        displayBody: 'Fetching your active daily habits.',
        spokenConfirmation: 'Here are your active habits.',
      };
    }

    // 2. Add habit
    let habitTitleCandidate: string | null = null;
    let explicitFrequency: string | null = null;

    if (/\b(?:daily|every\s+day|everyday|every\s+morning)\b/i.test(cleanRaw)) {
      explicitFrequency = 'Daily';
    } else if (/\bweekly\b/i.test(cleanRaw)) {
      explicitFrequency = 'Weekly';
    }

    const addHabitMatch =
      cleanRaw.match(
        /^(?:add|create|start|build)\s+(?:a\s+)?(?:daily\s+|weekly\s+)?habit(?:\s+to)?\s*(.*)$/i,
      ) ||
      cleanRaw.match(
        /^(?:add|create|start|build)\s+(?:a\s+)?(?:daily\s+|weekly\s+)?(.+?)\s+habit(?:\s+to)?$/i,
      ) ||
      cleanRaw.match(
        /\b(?:i\s+want\s+to\s+)?(?:build|start|add|create)\s+(?:a\s+)?(?:daily\s+|weekly\s+)?(.+?)\s+habit\b/i,
      ) ||
      cleanRaw.match(
        /\badd\s+(?:a\s+)?(?:daily\s+|weekly\s+)?(.+?)\s+to\s+(?:my\s+)?habits\b/i,
      ) ||
      cleanRaw.match(
        /^(?:let['’]?s\s+|can\s+we\s+)?make\s+(?:a\s+)?habit\s+(?:of|out\s+of)\s*(.*)$/i,
      ) ||
      cleanRaw.match(
        /\b(?:i\s+want\s+to\s+)?start\s+(drinking\s+more\s+water|meditating|working\s+out|exercising|running|reading)\b/i,
      );

    if (addHabitMatch) {
      let rawTitle = (addHabitMatch[1] || '').trim();
      rawTitle = rawTitle
        .replace(/\b(?:habit|daily|weekly|a|my)\b/gi, '')
        .trim();
      if (rawTitle.toLowerCase() === 'meditating') rawTitle = 'Meditation';
      if (rawTitle.toLowerCase() === 'reading') rawTitle = 'Reading';
      if (
        rawTitle.toLowerCase() === 'exercising' ||
        rawTitle.toLowerCase() === 'working out'
      )
        rawTitle = 'Exercise';
      if (rawTitle.toLowerCase() === 'drinking more water')
        rawTitle = 'Drinking water';
      habitTitleCandidate = rawTitle;
    }

    if (addHabitMatch) {
      if (!habitTitleCandidate) {
        return {
          intent: 'ADD_HABIT',
          originalTranscript: raw,
          parameters: {},
          needsClarification: {
            id: `clarify_${Date.now()}`,
            intent: 'ADD_HABIT',
            collectedData: {},
            missingSlot: 'title',
            question: 'What habit would you like to build?',
            createdAt: Date.now(),
          },
          displayTitle: 'What habit would you like to build?',
          displayBody:
            'Say any habit name like "Morning meditation" or "Evening reading".',
          spokenConfirmation: 'What habit would you like to build?',
        };
      }

      const formattedTitle =
        habitTitleCandidate.charAt(0).toUpperCase() +
        habitTitleCandidate.slice(1);

      // If frequency is not yet specified, ask for frequency as required
      if (!explicitFrequency) {
        const questionText =
          formattedTitle.toLowerCase() === 'meditation'
            ? 'How often would you like to meditate?'
            : `How often would you like to do ${formattedTitle.toLowerCase()}?`;

        return {
          intent: 'ADD_HABIT',
          originalTranscript: raw,
          parameters: {
            title: formattedTitle,
            category: 'mindful',
          },
          needsClarification: {
            id: `clarify_${Date.now()}`,
            intent: 'ADD_HABIT',
            collectedData: {
              title: formattedTitle,
              category: 'mindful',
            },
            missingSlot: 'frequency',
            question: questionText,
            createdAt: Date.now(),
          },
          displayTitle: `Frequency for ${formattedTitle}`,
          displayBody: questionText,
          spokenConfirmation: questionText,
        };
      }

      return {
        intent: 'ADD_HABIT',
        originalTranscript: raw,
        parameters: {
          title: formattedTitle,
          category: 'mindful',
          frequency: explicitFrequency,
        },
        displayTitle: `Habit Added: ${formattedTitle}`,
        displayBody: `Added to your ${explicitFrequency.toLowerCase()} mindful rituals.`,
        spokenConfirmation: `I've added ${formattedTitle.toLowerCase()} to your ${explicitFrequency.toLowerCase()} habits.`,
      };
    }

    // 3. Log / Complete habit
    const logHabitMatch =
      cleanRaw.match(
        /\b(?:i\s+)?(?:completed|finished|logged|did)\s+(?:my\s+)?(.+?)(?:\s+for\s+today)?$/i,
      ) || cleanRaw.match(/\b(?:log|mark)\s+(?:my\s+)?(.*)$/i);

    if (
      logHabitMatch &&
      !/^(?:add|create|set|remind|schedule)\b/i.test(normalized) &&
      /(?:meditat|water|hydrat|workout|exercise|run|jog|habit)/i.test(
        normalized,
      )
    ) {
      let habitName = 'meditation';
      let spokenTitle = '20-minute meditation';
      if (/water|hydrat/i.test(normalized)) {
        habitName = 'water-drinking';
        spokenTitle = 'water-drinking habit';
      } else if (/workout|exercise|run|jog/i.test(normalized)) {
        habitName = 'mindful run';
        spokenTitle = 'workout';
      }

      return {
        intent: 'LOG_HABIT',
        originalTranscript: raw,
        parameters: {
          query: habitName,
          title: habitName === 'meditation' ? '20-min Meditation' : habitName,
        },
        displayTitle: `Habit Logged: ${
          habitName === 'meditation' ? '20-min Meditation 🔥' : habitName
        }`,
        displayBody: `Logged your ${spokenTitle} for today.`,
        spokenConfirmation:
          habitName === 'meditation'
            ? 'Your 20-minute meditation has been logged.'
            : `Marked your ${spokenTitle} complete.`,
      };
    }

    return null;
  },

  // Parses task commands
  parseTask(
    raw: string,
    cleanRaw: string,
    _normalized: string,
  ): InterpretedVoiceCommand | null {
    // 1. Add Task via standard prefix
    const addTaskMatch = cleanRaw.match(
      /^(?:can\s+you\s+)?(?:add|create|new|schedule)\s+(?:a\s+|one\s+)?task(?:\s+to|\s+for|:)?\s*(.*)$/i,
    );
    if (addTaskMatch) {
      const remainder = addTaskMatch[1].trim();
      if (!remainder) {
        return {
          intent: 'ADD_TASK',
          originalTranscript: raw,
          parameters: {},
          needsClarification: {
            id: `clarify_${Date.now()}`,
            intent: 'ADD_TASK',
            collectedData: {},
            missingSlot: 'title',
            question: 'What task would you like me to add?',
            createdAt: Date.now(),
          },
          displayTitle: 'What task should I add?',
          displayBody: 'Please tell me the task description.',
          spokenConfirmation: 'What task would you like me to add?',
        };
      }

      const { cleanTitle, date, time } = extractDateTime(remainder);
      const title = cleanTitle || remainder;

      return {
        intent: 'ADD_TASK',
        originalTranscript: raw,
        parameters: {
          title,
          date,
          time,
        },
        displayTitle: `Task Added: ${title}`,
        displayBody: date
          ? `Added to your daily schedule for ${date}.`
          : 'Added to your daily schedule.',
        spokenConfirmation: `Your task to ${title} has been added.`,
      };
    }

    // "Remind me to [action]" without time/date -> task
    const remindTaskMatch = cleanRaw.match(/^remind\s+me\s+to\s+(.+)$/i);
    if (remindTaskMatch) {
      const remainder = cleanRaw.replace(/^remind\s+me\s+to\s+/i, '');
      const { cleanTitle, date, time } = extractDateTime(remainder);
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

    // 2B. Natural phrasing: "I need to call John tomorrow" / "I have to finish the report"
    const needToMatch = cleanRaw.match(
      /^(?:i\s+need\s+to|i\s+have\s+to|i['’]?ve\s+got\s+to|i\s+must)\s+(.*)$/i,
    );
    if (
      needToMatch &&
      !/\b(?:remember\s+to|reminder|alert|habit|focus)\b/i.test(cleanRaw)
    ) {
      const remainder = needToMatch[1].trim();
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

    // 2C. "Can you add calling John to my list?" / "Add [X] to my tasks"
    const addToListMatch = cleanRaw.match(
      /^(?:can\s+you\s+)?add\s+(.+?)\s+to\s+(?:my\s+)?(?:list|to[\s-]do(?:\s+list)?|tasks?)\b/i,
    );
    if (addToListMatch && !/\b(?:habit|habits)\b/i.test(cleanRaw)) {
      const core = addToListMatch[1].trim();
      const { cleanTitle, date, time } = extractDateTime(core);
      const title = cleanTitle || core;
      return {
        intent: 'ADD_TASK',
        originalTranscript: raw,
        parameters: {
          title,
          date: date || 'Today',
          time,
        },
        displayTitle: `Task Added: ${title}`,
        displayBody: 'Added to your daily schedule for Today.',
        spokenConfirmation: `Your task to ${title} has been added.`,
      };
    }

    // 3. "I need to remember to submit my assignment" / "Remember to submit my assignment"
    const rememberMatch = cleanRaw.match(
      /^(?:i\s+need\s+to\s+remember\s+to|remember\s+to)\s+(.*)$/i,
    );
    if (rememberMatch) {
      const remainder = rememberMatch[1].trim();
      const { cleanTitle, date, time } = extractDateTime(remainder);
      const title = cleanTitle || remainder;
      return {
        intent: 'ADD_TASK',
        originalTranscript: raw,
        parameters: {
          title,
          date: date || 'Today',
          time,
        },
        displayTitle: `Task Added: ${title}`,
        displayBody: `Added to your daily schedule for ${date || 'Today'}.`,
        spokenConfirmation: `Your task to ${title} has been added.`,
      };
    }

    // 3. Put [X] on my to-do list / Put [X] on my list
    const putOnListMatch = cleanRaw.match(
      /\b(?:put|place)\s+(.+?)\s+on\s+(?:my\s+)?(?:to[\s-]do(?:\s+list)?|list|tasks?)\b/i,
    );
    if (putOnListMatch) {
      const core = putOnListMatch[1].trim();
      const { cleanTitle, date, time } = extractDateTime(core);
      const title = cleanTitle || core;
      return {
        intent: 'ADD_TASK',
        originalTranscript: raw,
        parameters: {
          title,
          date: date || 'Today',
          time,
        },
        displayTitle: `Task Added: ${title}`,
        displayBody: 'Added to your daily schedule for Today.',
        spokenConfirmation: `Your task to ${title} has been added.`,
      };
    }

    // 4. "I have something important to do tomorrow: pay the bill"
    const importantMatch = cleanRaw.match(
      /\bsomething\s+important\s+to\s+do(?:\s+tomorrow)?(?::|\s*-)?\s*(.+)$/i,
    );
    if (importantMatch) {
      const core = importantMatch[1].trim();
      const targetDate = /tomorrow/i.test(cleanRaw) ? 'Tomorrow' : 'Today';
      return {
        intent: 'ADD_TASK',
        originalTranscript: raw,
        parameters: {
          title: core,
          date: targetDate,
        },
        displayTitle: `Task Added: ${core}`,
        displayBody: `Added to your schedule for ${targetDate}.`,
        spokenConfirmation: `Your task to ${core} has been added.`,
      };
    }

    return null;
  },

  // Parses focus session commands
  parseFocus(
    raw: string,
    cleanRaw: string,
    normalized: string,
  ): InterpretedVoiceCommand | null {
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

    if (
      /\b(?:add|extend|move|push)\s+(?:my\s+)?(?:focus\s+(?:timer|session)\s+)?(?:forward\s+)?(?:by\s+)?(\d+)?\s*(?:min|minute|mins)?/i.test(
        raw,
      ) ||
      /\b(?:add|extend|move)\s+(\d+)?\s*(?:min|minute|mins)?\s*(?:to|forward)?\s*(?:my\s+)?focus/i.test(
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

    return null;
  },
};

// ─── Helper Pattern Matchers ─────────────────────────────────────────────

function focusSessionPattern(normalized: string): boolean {
  return /\b(?:focus\s+session|start\s+focus|extend\s+focus)\b/i.test(
    normalized,
  );
}

function morningBriefPattern(normalized: string): boolean {
  return (
    /\b(?:play|listen|start)\s+(?:my\s+)?(?:morning\s+)?brief(?:ing)?\b/i.test(
      normalized,
    ) || /\bmorning\s+brief(?:ing)?\b/i.test(normalized)
  );
}

function sprintPattern(normalized: string): boolean {
  return (
    /\b(?:schedule\s+sprint|sprint\s+review)\b/i.test(normalized) ||
    normalized === 'schedule_sprint'
  );
}

function showTasksPattern(normalized: string): boolean {
  return (
    /\b(?:show|what\s+are|list|view|read)\s+(?:my\s+)?tasks\b/i.test(
      normalized,
    ) ||
    /\bwhat['’]?s\s+on\s+my\s+(?:tasks?|to[\s-]do\s+list)\b/i.test(
      normalized,
    ) ||
    /^tasks\s*(?:for\s+today)?$/i.test(normalized)
  );
}

function showRemindersPattern(normalized: string): boolean {
  return (
    /\b(?:show|what\s+are|list|view|read)\s+(?:my\s+)?(?:upcoming\s+)?reminders\b/i.test(
      normalized,
    ) || /^reminders\s*(?:for\s+today)?$/i.test(normalized)
  );
}

function showHabitsPattern(normalized: string): boolean {
  return (
    /\b(?:show|what\s+are|list|view)\s+(?:my\s+)?habits\b/i.test(normalized) ||
    /^habits$/i.test(normalized)
  );
}
