import { Task, Reminder, HabitItem } from '../../Context/TaskReminderContext';
import {
  buildConfirmationMessage,
  buildFailureMessage,
  OperationExecutionResult,
} from './VoiceConfirmationBuilder';
import {
  VoiceCommandIntent,
  PendingClarification,
  InterpretedVoiceCommand,
  ExecutionContext,
  ExecutionResult,
  ExtractedSlots,
} from './VoiceTypes';
import { IntentRecognitionService } from './IntentRecognitionService';

import { VoiceAssistantState } from './VoiceStateMachine';

// Re-export types for backward compatibility across the project
export type {
  VoiceCommandIntent,
  PendingClarification,
  InterpretedVoiceCommand,
  ExecutionContext,
  ExecutionResult,
  ExtractedSlots,
};

export const VoiceCommandService = {
  // Interprets utterance into intent and parameters
  interpret(
    rawText: string,
    pendingClarification?: PendingClarification | null,
    conversationState?: VoiceAssistantState,
  ): InterpretedVoiceCommand {
    return IntentRecognitionService.interpret(
      rawText,
      pendingClarification,
      conversationState,
    );
  },

  // Executes validated voice command against context state
  execute(
    command: InterpretedVoiceCommand,
    ctx: ExecutionContext,
  ): ExecutionResult {
    try {
      switch (command.intent) {
        // ─── 1. TASKS ──────────────────────────────────────────────
        case 'ADD_TASK': {
          const title = command.parameters.title?.trim();
          if (!title) {
            const fail = buildFailureMessage(
              'ADD_TASK',
              'No task description provided.',
            );
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
            category: command.parameters.category || 'works',
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
              hasExplicitTime: Boolean(command.parameters.time),
              hasExplicitDate: Boolean(command.parameters.date),
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

        // ─── 2. REMINDERS ──────────────────────────────────────────
        case 'ADD_REMINDER': {
          const title = command.parameters.title?.trim();
          if (!title) {
            const fail = buildFailureMessage(
              'ADD_REMINDER',
              'Missing description for reminder.',
            );
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
                error: 'Missing description for reminder.',
              },
            };
          }

          const remDate = command.parameters.date || 'Today';
          const remTime = command.parameters.time || '08:00 PM';
          const remRepeat = command.parameters.repeat || 'Once';

          const createdRem = ctx.addReminder({
            title,
            date: remDate,
            time: remTime,
            repeat: remRepeat,
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
              repeat: remRepeat,
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

        // ─── 3. HABITS ─────────────────────────────────────────────
        case 'ADD_HABIT': {
          const title = command.parameters.title?.trim() || 'New Habit';
          const frequency = command.parameters.frequency || 'Daily';
          const createdHabit = ctx.addHabit({
            title,
            category: 'mindful',
            frequency,
          }) as HabitItem | undefined;

          const opResult: OperationExecutionResult = {
            success: true,
            intent: 'ADD_HABIT',
            operationType: 'ADD_HABIT',
            data: {
              habit: createdHabit,
              title: createdHabit?.title || title,
              frequency,
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
          const query = (command.parameters.query || '').toLowerCase().trim();
          const matchingHabits = ctx.habits.filter(h => {
            const t = h.title.toLowerCase();
            return (
              t.includes(query) ||
              (query.includes('meditat') &&
                (t.includes('meditat') ||
                  t.includes('breath') ||
                  t.includes('posture'))) ||
              ((query.includes('water') || query.includes('hydrat')) &&
                (t.includes('water') || t.includes('hydrat'))) ||
              ((query.includes('workout') || query.includes('run')) &&
                (t.includes('run') ||
                  t.includes('workout') ||
                  t.includes('pace')))
            );
          });

          let loggedHabit: HabitItem | undefined;

          if (matchingHabits.length > 0) {
            const habitToToggle =
              matchingHabits.find(h => !h.completed) || matchingHabits[0];
            if (!habitToToggle.completed) {
              const toggled = ctx.toggleHabit(habitToToggle.id) as
                | HabitItem
                | undefined;
              loggedHabit = toggled || habitToToggle;
            } else {
              loggedHabit = habitToToggle;
            }
          } else {
            // No matching habit found in active list -> create habit with actual frequency
            loggedHabit = ctx.addHabit({
              title: command.parameters.title || 'Meditation',
              category: 'mindful',
              frequency: 'Daily',
            }) as HabitItem | undefined;
            if (loggedHabit) {
              ctx.toggleHabit(loggedHabit.id);
            }
          }

          const habitTitle =
            loggedHabit?.title || command.parameters.title || 'Habit';
          const opResult: OperationExecutionResult = {
            success: true,
            intent: 'LOG_HABIT',
            operationType: 'LOG_HABIT',
            data: {
              habit: loggedHabit,
              title: habitTitle,
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

        case 'SHOW_HABITS': {
          const count = ctx.habits.length;
          const opResult: OperationExecutionResult = {
            success: true,
            intent: 'SHOW_HABITS',
            operationType: 'SHOW_HABITS',
            data: {
              count,
              items: ctx.habits.map(h => h.title),
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

        // ─── 4. FOCUS SESSIONS ─────────────────────────────────────
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

        // ─── 5. AUDIO BRIEF & REVIEW ───────────────────────────────
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

        // ─── 6. COURTESY, CANCELLATION, GOODBYE ────────────────────
        case 'THANKS': {
          const conf = buildConfirmationMessage({
            success: true,
            intent: 'THANKS',
            operationType: 'THANKS',
          });
          return {
            success: true,
            intent: command.intent,
            displayTitle: conf.displayTitle,
            displayBody: conf.displayBody,
            spokenResponse: command.spokenConfirmation || conf.spokenText,
            resultSummary: conf.resultSummary,
          };
        }

        case 'CANCEL': {
          const conf = buildConfirmationMessage({
            success: true,
            intent: 'CANCEL',
            operationType: 'CANCEL',
          });
          return {
            success: true,
            intent: command.intent,
            displayTitle: conf.displayTitle,
            displayBody: conf.displayBody,
            spokenResponse: command.spokenConfirmation || conf.spokenText,
            resultSummary: conf.resultSummary,
          };
        }

        case 'GOODBYE': {
          const conf = buildConfirmationMessage({
            success: true,
            intent: 'GOODBYE',
            operationType: 'GOODBYE',
          });
          return {
            success: true,
            intent: command.intent,
            displayTitle: conf.displayTitle,
            displayBody: conf.displayBody,
            spokenResponse: command.spokenConfirmation || conf.spokenText,
            resultSummary: conf.resultSummary,
            shouldEndSession: true,
          };
        }

        case 'DECLINE_FOLLOW_UP': {
          return {
            success: true,
            intent: 'DECLINE_FOLLOW_UP',
            displayTitle: command.displayTitle || 'Session Completed',
            displayBody:
              command.displayBody ||
              'Alright! Take care. I’m here whenever you need me.',
            spokenResponse:
              command.spokenConfirmation ||
              'Alright! Take care. I’m here whenever you need me.',
            resultSummary: 'Session Completed',
            shouldEndSession: true,
          };
        }

        // ─── 7. UNRECOGNIZED / FALLBACK ────────────────────────────
        default: {
          const fail = buildFailureMessage(command.intent);
          return {
            success: false,
            intent: command.intent,
            displayTitle: command.displayTitle || fail.displayTitle,
            displayBody: command.displayBody || fail.displayBody,
            spokenResponse: command.spokenConfirmation || fail.spokenText,
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
