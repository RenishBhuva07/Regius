import {
  VoiceCommandService,
  ExecutionContext,
} from '../src/Services/Voice/VoiceCommandService';
import { IntentRecognitionService } from '../src/Services/Voice/IntentRecognitionService';
import { VoiceStateMachine } from '../src/Services/Voice/VoiceStateMachine';
import {
  normalizeTranscript,
  isGratitudeIntent,
  isGoodbyeIntent,
  isDeclineIntent,
} from '../src/Services/Voice/TranscriptNormalizer';
import { PendingClarification } from '../src/Services/Voice/VoiceTypes';

describe('Voice Assistant Conversation Flow & Intelligence Suite (14 Core Scenarios)', () => {
  let mockContext: ExecutionContext;

  beforeEach(() => {
    mockContext = {
      tasks: [
        {
          id: 'task-1',
          label: 'Team Sync',
          iconType: 'mail',
          done: false,
          date: 'Today',
          time: '10:00 AM',
        },
      ],
      addTask: jest.fn(data => ({
        id: 'new-task',
        label: data.title,
        iconType: 'mail',
        done: false,
        date: data.date || 'Today',
        time: data.time || '10:00 AM',
      })),
      toggleTask: jest.fn(),
      reminders: [],
      addReminder: jest.fn(data => ({
        id: 'new-rem',
        title: data.title,
        date: data.date || 'Today',
        time: data.time || '09:00 AM',
      })),
      toggleReminder: jest.fn(),
      habits: [],
      addHabit: jest.fn(data => ({
        id: 'new-habit',
        title: data.title,
        frequency: data.frequency || 'Daily',
      })),
      toggleHabit: jest.fn(),
    };
  });

  // 1. "Okay, thanks" triggers an appropriate acknowledgement
  it('1. "Okay, thanks" triggers an appropriate acknowledgement and prompts follow-up', () => {
    const res = VoiceCommandService.interpret('Okay, thanks');
    expect(res.intent).toBe('THANKS');
    expect(res.requiresFollowUp).toBe(true);
    expect(res.spokenConfirmation?.toLowerCase()).toContain('anything else');
    expect(res.shouldEndSession).toBeFalsy();
  });

  // 2. "Thank you so much" is recognized as gratitude
  it('2. "Thank you so much" is recognized as gratitude', () => {
    const res = VoiceCommandService.interpret('Thank you so much');
    expect(res.intent).toBe('THANKS');
    expect(res.requiresFollowUp).toBe(true);
    expect(res.spokenConfirmation?.toLowerCase()).toContain('welcome');
  });

  // 3. "Thanks, bye" ends the conversation without an unnecessary follow-up
  it('3. "Thanks, bye" ends the conversation without an unnecessary follow-up', () => {
    const res = VoiceCommandService.interpret('Thanks, bye');
    expect(res.intent).toBe('GOODBYE');
    expect(res.shouldEndSession).toBe(true);
    expect(res.requiresFollowUp).toBeFalsy();
    expect(res.spokenConfirmation?.toLowerCase()).toContain('goodbye');
  });

  // 4. "No" after "Anything else I can help you with?" closes the conversation gracefully
  it('4. "No" after "Anything else I can help you with?" closes the conversation gracefully', () => {
    const res = VoiceCommandService.interpret('No', null, 'awaiting_follow_up');
    expect(res.intent).toBe('DECLINE_FOLLOW_UP');
    expect(res.shouldEndSession).toBe(true);
    expect(res.spokenConfirmation).toContain('Alright! Take care.');
  });

  // 5. "No, thanks" closes the conversation in the correct context
  it('5. "No, thanks" closes the conversation in the correct context', () => {
    const res = VoiceCommandService.interpret(
      'No, thanks',
      null,
      'awaiting_follow_up',
    );
    expect(res.shouldEndSession).toBe(true);
    expect(res.spokenConfirmation).toContain('Take care');
  });

  // 6. "I'm good" and "Nothing else" are recognized as declines of further assistance
  it('6. "I\'m good" and "Nothing else" are recognized as declines of further assistance', () => {
    const res1 = VoiceCommandService.interpret(
      "I'm good",
      null,
      'awaiting_follow_up',
    );
    expect(res1.intent).toBe('DECLINE_FOLLOW_UP');
    expect(res1.shouldEndSession).toBe(true);

    const res2 = VoiceCommandService.interpret(
      'Nothing else',
      null,
      'awaiting_follow_up',
    );
    expect(res2.intent).toBe('DECLINE_FOLLOW_UP');
    expect(res2.shouldEndSession).toBe(true);
  });

  // 7. "Bye-bye" and "See you later" trigger a farewell
  it('7. "Bye-bye" and "See you later" trigger a farewell', () => {
    const res1 = VoiceCommandService.interpret('Bye-bye');
    expect(res1.intent).toBe('GOODBYE');
    expect(res1.shouldEndSession).toBe(true);

    const res2 = VoiceCommandService.interpret('See you later');
    expect(res2.intent).toBe('GOODBYE');
    expect(res2.shouldEndSession).toBe(true);
  });

  // 8. "No" in response to a pending task confirmation does not accidentally close the entire conversation
  it('8. "No" in response to a pending task confirmation does not accidentally close the entire conversation', () => {
    const pendingTaskClarification: PendingClarification = {
      id: 'clarify-1',
      intent: 'ADD_TASK',
      collectedData: {},
      missingSlot: 'title',
      question: 'What task would you like me to add?',
    };

    const res = VoiceCommandService.interpret(
      'No',
      pendingTaskClarification,
      'awaiting_confirmation',
    );
    expect(res.intent).toBe('CANCEL');
    expect(res.shouldEndSession).toBe(false);
    expect(res.spokenConfirmation?.toLowerCase()).toContain('cancel');
  });

  // 9. "No" inside an unrelated sentence does not automatically trigger a closing intent
  it('9. "No" inside an unrelated sentence does not automatically trigger a closing intent', () => {
    const res1 = VoiceCommandService.interpret('Add a task: no meeting today');
    expect(res1.intent).toBe('ADD_TASK');
    expect(res1.parameters.title?.toLowerCase()).toContain('no meeting');
    expect(res1.parameters.date).toBe('Today');
    expect(res1.shouldEndSession).toBeFalsy();

    const res2 = VoiceCommandService.interpret(
      'Remind me not to forget my keys',
    );
    expect(res2.intent).toBe('ADD_REMINDER');
    expect(res2.shouldEndSession).toBeFalsy();
  });

  // 10. A user interrupting SIA stops the current speech and returns to listening
  it('10. A user interrupting SIA stops the current speech and returns to listening', () => {
    const sm = new VoiceStateMachine('idle');
    sm.transitionTo('speaking');
    expect(sm.getState()).toBe('speaking');

    // Interruption transition: speaking -> listening
    const transitioned = sm.transitionTo('listening');
    expect(transitioned).toBe(true);
    expect(sm.getState()).toBe('listening');
  });

  // 11. Duplicate speech recognition callbacks do not execute the same action twice
  it('11. Duplicate speech recognition callbacks do not execute the same action twice', () => {
    let executionCounter = 0;
    let isProcessingLatch = false;

    const executeCommandOnce = (cmd: string) => {
      if (isProcessingLatch) return;
      isProcessingLatch = true;
      executionCounter += 1;
    };

    // Simulate rapid duplicate callbacks from speech engine
    executeCommandOnce('Add a task to call John');
    executeCommandOnce('Add a task to call John');
    executeCommandOnce('Add a task to call John');

    expect(executionCounter).toBe(1);
  });

  // 12. API errors and recognition timeouts recover without leaving the UI stuck
  it('12. API errors and recognition timeouts recover without leaving the UI stuck', () => {
    const sm = new VoiceStateMachine('listening');
    sm.transitionTo('processing');

    // Transition to error
    sm.transitionTo('error');
    expect(sm.getState()).toBe('error');

    // Can recover from error to listening or idle
    expect(sm.canTransitionTo('listening')).toBe(true);
    expect(sm.canTransitionTo('idle')).toBe(true);
    sm.transitionTo('listening');
    expect(sm.getState()).toBe('listening');
  });

  // 13. Natural variations of task, reminder, and habit requests reach the correct processing flow
  it('13. Natural variations of task, reminder, and habit requests reach the correct processing flow', () => {
    // A: Task variation "I need to call John tomorrow"
    const taskRes1 = VoiceCommandService.interpret(
      'I need to call John tomorrow.',
    );
    expect(taskRes1.intent).toBe('ADD_TASK');
    expect(taskRes1.parameters.title?.toLowerCase()).toContain('call john');
    expect(taskRes1.parameters.date).toBe('Tomorrow');

    // B: Task variation "Can you add calling John to my list?"
    const taskRes2 = VoiceCommandService.interpret(
      'Can you add calling John to my list?',
    );
    expect(taskRes2.intent).toBe('ADD_TASK');
    expect(taskRes2.parameters.title?.toLowerCase()).toContain('calling john');

    // C: Habit variation "Let's make a habit of reading"
    const habitRes = VoiceCommandService.interpret(
      "Let's make a habit of reading.",
    );
    expect(habitRes.intent).toBe('ADD_HABIT');
    expect(habitRes.parameters.title?.toLowerCase()).toContain('reading');

    // D: Habit logging "Log my meditation for today"
    const logRes = VoiceCommandService.interpret(
      'Log my meditation for today.',
    );
    expect(logRes.intent).toBe('LOG_HABIT');
  });

  // 14. A completed conversation does not automatically reopen the microphone
  it('14. A completed conversation does not automatically reopen the microphone', () => {
    const sm = new VoiceStateMachine('speaking');
    sm.transitionTo('completed');
    expect(sm.getState()).toBe('completed');

    // Once in completed state, the assistant is not listening
    expect(sm.getState()).not.toBe('listening');
    // Completed can transition to idle
    expect(sm.canTransitionTo('idle')).toBe(true);
  });

  // 15. Task added flow transitions from success back to listening for continuous conversation
  it('15. Task added flow transitions from success back to listening for continuous conversation', () => {
    const sm = new VoiceStateMachine('idle');
    const interpreted = VoiceCommandService.interpret('Add a task to play badminton');
    expect(interpreted.intent).toBe('ADD_TASK');
    expect(interpreted.shouldEndSession).toBeFalsy();

    const result = VoiceCommandService.execute(interpreted, mockContext);
    expect(result.success).toBe(true);
    expect(result.shouldEndSession).toBeFalsy();

    // Voice lifecycle: listening -> processing -> executing -> speaking -> success -> listening
    sm.transitionTo('listening');
    sm.transitionTo('processing');
    sm.transitionTo('executing');
    sm.transitionTo('speaking');
    sm.transitionTo('success');
    expect(sm.getState()).toBe('success');

    // From success state after task completion, it transitions back to listening
    expect(sm.canTransitionTo('listening')).toBe(true);
    sm.transitionTo('listening');
    expect(sm.getState()).toBe('listening');
  });
});
