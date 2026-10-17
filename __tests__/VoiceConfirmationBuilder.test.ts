import {
  buildConfirmationMessage,
  buildFailureMessage,
  getContextualExecutingText,
  OperationExecutionResult,
} from '../src/Services/Voice/VoiceConfirmationBuilder';
import {
  VoiceCommandService,
  ExecutionContext,
} from '../src/Services/Voice/VoiceCommandService';

describe('VoiceConfirmationBuilder & Post-Command Execution', () => {
  describe('1. Contextual In-Progress Messages (Phase A)', () => {
    it('generates contextual executing text for ADD_TASK', () => {
      expect(getContextualExecutingText('ADD_TASK', 'take medicine')).toBe(
        'Adding "take medicine" to tasks...',
      );
    });

    it('generates contextual executing text for ADD_REMINDER', () => {
      expect(getContextualExecutingText('ADD_REMINDER', 'call Mom')).toBe(
        'Setting reminder for "call Mom"...',
      );
    });

    it('generates contextual executing text for LOG_HABIT', () => {
      expect(getContextualExecutingText('LOG_HABIT', 'meditation')).toBe(
        'Logging "meditation"...',
      );
    });

    it('generates contextual executing text for START_FOCUS', () => {
      expect(getContextualExecutingText('START_FOCUS')).toBe(
        'Starting your focus session...',
      );
    });
  });

  describe('2. Confirmation Messages From Actual Operation Results (Phase B/C/D)', () => {
    it('builds confirmation for task creation with title: "Your task to take medicine has been added."', () => {
      const opResult: OperationExecutionResult = {
        success: true,
        intent: 'ADD_TASK',
        operationType: 'ADD_TASK',
        data: {
          title: 'take medicine',
          date: 'Today',
        },
      };
      const conf = buildConfirmationMessage(opResult);
      expect(conf.spokenText).toBe('Your task to take medicine has been added.');
      expect(conf.resultSummary).toBe('Task added: take medicine');
      expect(conf.displayTitle).toBe('Task Added: take medicine');
    });

    it('builds confirmation for reminder creation: "Your reminder has been set successfully."', () => {
      const opResult: OperationExecutionResult = {
        success: true,
        intent: 'ADD_REMINDER',
        operationType: 'ADD_REMINDER',
        data: {
          title: 'take medicine',
        },
      };
      const conf = buildConfirmationMessage(opResult);
      expect(conf.spokenText).toBe('Your reminder has been set successfully.');
      expect(conf.resultSummary).toBe('Reminder set: take medicine');
    });

    it('builds confirmation for reminder with explicit time and tonight date', () => {
      const opResult: OperationExecutionResult = {
        success: true,
        intent: 'ADD_REMINDER',
        operationType: 'ADD_REMINDER',
        data: {
          title: 'take medicine',
          date: 'Tonight',
          time: '8 PM',
        },
      };
      const conf = buildConfirmationMessage(opResult);
      expect(conf.spokenText).toBe('Your reminder to take medicine is set for 8 PM tonight.');
      expect(conf.resultSummary).toBe('Reminder set: take medicine');
    });

    it('builds confirmation for habit creation: "I\'ve added that to your daily habits."', () => {
      const opResult: OperationExecutionResult = {
        success: true,
        intent: 'ADD_HABIT',
        operationType: 'ADD_HABIT',
        data: {
          title: 'Reading',
        },
      };
      const conf = buildConfirmationMessage(opResult);
      expect(conf.spokenText).toBe("I've added that to your daily habits.");
      expect(conf.resultSummary).toBe('Habit added: Reading');
    });

    it('builds confirmation for habit logged: "Your meditation has been logged successfully."', () => {
      const opResult: OperationExecutionResult = {
        success: true,
        intent: 'LOG_HABIT',
        operationType: 'LOG_HABIT',
        data: {
          title: '20-min Meditation',
        },
      };
      const conf = buildConfirmationMessage(opResult);
      expect(conf.spokenText).toBe('Your meditation has been logged successfully.');
      expect(conf.resultSummary).toBe('Habit logged: 20-min Meditation');
    });

    it('builds confirmation for task completion: "Your task to finish report has been marked as complete."', () => {
      const opResult: OperationExecutionResult = {
        success: true,
        intent: 'COMPLETE_TASK',
        operationType: 'COMPLETE_TASK',
        data: {
          title: 'finish report',
        },
      };
      const conf = buildConfirmationMessage(opResult);
      expect(conf.spokenText).toBe('Your task to finish report has been marked as complete.');
      expect(conf.resultSummary).toBe('Task completed: finish report');
    });

    it('builds confirmation for focus session: "Your focus session has started."', () => {
      const opResult: OperationExecutionResult = {
        success: true,
        intent: 'START_FOCUS',
        operationType: 'START_FOCUS',
        data: { durationMinutes: 25 },
      };
      const conf = buildConfirmationMessage(opResult);
      expect(conf.spokenText).toBe('Your focus session has started.');
      expect(conf.resultSummary).toBe('Focus started (25m)');
    });

    it('builds confirmation for Morning Brief: "Your Morning Brief is ready."', () => {
      const opResult: OperationExecutionResult = {
        success: true,
        intent: 'PLAY_BRIEF',
        operationType: 'PLAY_BRIEF',
      };
      const conf = buildConfirmationMessage(opResult);
      expect(conf.spokenText).toBe('Your Morning Brief is ready.');
      expect(conf.resultSummary).toBe('Morning Brief ready');
    });
  });

  describe('3. Operation Failures and Recovery', () => {
    it('builds truthful failure message when task creation fails', () => {
      const fail = buildFailureMessage('ADD_TASK', 'Network error');
      expect(fail.spokenText).toBe('I was unable to add that task.');
      expect(fail.displayTitle).toBe('Unable to Add Task');
      expect(fail.displayBody).toBe('Network error');
    });

    it('builds truthful failure message when reminder creation fails', () => {
      const fail = buildFailureMessage('ADD_REMINDER');
      expect(fail.spokenText).toBe('I was unable to set that reminder.');
      expect(fail.displayTitle).toBe('Unable to Set Reminder');
    });
  });

  describe('4. End-to-End Execution Flow with VoiceCommandService', () => {
    let mockContext: ExecutionContext;
    let addedTasks: any[] = [];

    beforeEach(() => {
      addedTasks = [];
      mockContext = {
        tasks: [],
        addTask: jest.fn(data => {
          const newTask = {
            id: 'task-123',
            label: data.title,
            done: false,
            date: data.date,
            time: data.time,
          };
          addedTasks.push(newTask);
          return newTask;
        }),
        toggleTask: jest.fn(),
        reminders: [],
        addReminder: jest.fn(),
        toggleReminder: jest.fn(),
        habits: [],
        addHabit: jest.fn(),
        toggleHabit: jest.fn(),
      };
    });

    it('executes "Add a task to take medicine." and returns verified result with confirmation', () => {
      const cmd = VoiceCommandService.interpret('Add a task to take medicine.');
      const result = VoiceCommandService.execute(cmd, mockContext);

      expect(result.success).toBe(true);
      expect(mockContext.addTask).toHaveBeenCalled();
      expect(addedTasks.length).toBe(1);
      expect(addedTasks[0].label).toBe('take medicine');

      // Verified operation outcome
      expect(result.operationResult?.operationType).toBe('ADD_TASK');
      expect(result.spokenResponse).toBe('Your task to take medicine has been added.');
      expect(result.resultSummary).toBe('Task added: take medicine');
      expect(result.displayTitle).toBe('Task Added: take medicine');
    });

    it('does not re-execute task creation when retrying confirmation speech', () => {
      const cmd = VoiceCommandService.interpret('Add a task to take medicine.');
      const result = VoiceCommandService.execute(cmd, mockContext);
      expect(mockContext.addTask).toHaveBeenCalledTimes(1);

      // Simulation of retry confirmation speech: uses result.spokenResponse directly
      const speechToRetry = result.spokenResponse;
      expect(speechToRetry).toBe('Your task to take medicine has been added.');
      // The task creation function was not called again!
      expect(mockContext.addTask).toHaveBeenCalledTimes(1);
    });
  });
});
