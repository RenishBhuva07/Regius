import { VoiceCommandService, ExecutionContext } from '../src/Services/Voice/VoiceCommandService';
import { VoiceSessionConfig } from '../src/Services/Voice/VoiceSessionConfig';

describe('Conversational Voice Assistant & Dynamic Intent Recognition', () => {
  describe('Natural language Task Phrasings', () => {
    it('understands "Add task: call Mom."', () => {
      const res = VoiceCommandService.interpret('Add task: call Mom.');
      expect(res.intent).toBe('ADD_TASK');
      expect(res.parameters.title).toBe('call Mom');
    });

    it('understands "Can you add one task for finishing my portfolio?"', () => {
      const res = VoiceCommandService.interpret('Can you add one task for finishing my portfolio?');
      expect(res.intent).toBe('ADD_TASK');
      expect(res.parameters.title).toContain('finishing my portfolio');
    });

    it('understands "I need to remember to submit my assignment."', () => {
      const res = VoiceCommandService.interpret('I need to remember to submit my assignment.');
      expect(res.intent).toBe('ADD_TASK');
      expect(res.parameters.title).toContain('submit my assignment');
    });

    it('understands "Put calling Dad on my to-do list."', () => {
      const res = VoiceCommandService.interpret('Put calling Dad on my to-do list.');
      expect(res.intent).toBe('ADD_TASK');
      expect(res.parameters.title).toBe('calling Dad');
    });

    it('understands "I have something important to do tomorrow: pay the bill."', () => {
      const res = VoiceCommandService.interpret('I have something important to do tomorrow: pay the bill.');
      expect(res.intent).toBe('ADD_TASK');
      expect(res.parameters.title).toBe('pay the bill');
      expect(res.parameters.date).toBe('Tomorrow');
    });
  });

  describe('Natural language Reminder Phrasings and Slot Clarifications', () => {
    it('understands "Set a reminder to take medicine." and requests timing', () => {
      const res = VoiceCommandService.interpret('Set a reminder to take medicine.');
      expect(res.intent).toBe('ADD_REMINDER');
      expect(res.parameters.title).toBe('take medicine');
      expect(res.needsClarification?.missingSlot).toBe('time');
      expect(res.spokenConfirmation).toBe('When would you like me to remind you?');
    });

    it('understands "I don\'t want to forget my doctor\'s appointment." and requests timing', () => {
      const res = VoiceCommandService.interpret("I don't want to forget my doctor's appointment.");
      expect(res.intent).toBe('ADD_REMINDER');
      expect(res.parameters.title).toContain("doctor's appointment");
      expect(res.needsClarification?.missingSlot).toBe('time');
    });

    it('understands "Remind me about my meeting tomorrow." and extracts date', () => {
      const res = VoiceCommandService.interpret('Remind me about my meeting tomorrow.');
      expect(res.intent).toBe('ADD_REMINDER');
      expect(res.parameters.title).toContain('meeting');
      expect(res.parameters.date).toBe('Tomorrow');
    });

    it('understands "I need an alert every morning to drink water."', () => {
      const res = VoiceCommandService.interpret('I need an alert every morning to drink water.');
      expect(res.intent).toBe('ADD_REMINDER');
      expect(res.parameters.title).toContain('drink water');
      expect(res.parameters.repeat).toBe('Daily');
    });

    it('understands "Remind me to take medicine every day at 8 PM."', () => {
      const res = VoiceCommandService.interpret('Remind me to take medicine every day at 8 PM.');
      expect(res.intent).toBe('ADD_REMINDER');
      expect(res.parameters.title).toBe('take medicine');
      expect(res.parameters.time).toBe('8 PM');
      expect(res.parameters.repeat).toBe('Daily');
      expect(res.needsClarification).toBeUndefined();
    });
  });

  describe('Multi-turn Reminder Flow', () => {
    it('completes reminder across multiple utterances: Set a reminder -> Take my medicine -> At 8 PM -> Every day', () => {
      // Turn 1: "Set a reminder."
      const turn1 = VoiceCommandService.interpret('Set a reminder.');
      expect(turn1.needsClarification).toBeDefined();
      expect(turn1.needsClarification?.missingSlot).toBe('both');

      // Turn 2: User answers "Take my medicine."
      const turn2 = VoiceCommandService.interpret('Take my medicine.', turn1.needsClarification);
      expect(turn2.needsClarification?.missingSlot).toBe('time');
      expect(turn2.parameters.title?.toLowerCase()).toBe('take medicine');

      // Turn 3: User answers "At 8 PM."
      const turn3 = VoiceCommandService.interpret('At 8 PM.', turn2.needsClarification);
      expect(turn3.needsClarification?.missingSlot).toBe('recurrence');
      expect(turn3.parameters.time).toBe('8 PM');

      // Turn 4: User answers "Every day."
      const turn4 = VoiceCommandService.interpret('Every day.', turn3.needsClarification);
      expect(turn4.needsClarification).toBeUndefined();
      expect(turn4.parameters.title?.toLowerCase()).toBe('take medicine');
      expect(turn4.parameters.time).toBe('8 PM');
      expect(turn4.parameters.repeat).toBe('Daily');
      expect(turn4.spokenConfirmation?.toLowerCase()).toContain('take medicine');
      expect(turn4.spokenConfirmation).toContain('every day at 8 PM');
    });
  });

  describe('Habit Creation and Logging', () => {
    it('understands "I want to build a meditation habit." and clarifies frequency', () => {
      const res = VoiceCommandService.interpret('I want to build a meditation habit.');
      expect(res.intent).toBe('ADD_HABIT');
      expect(res.parameters.title).toBe('Meditation');
      expect(res.needsClarification?.missingSlot).toBe('frequency');
      expect(res.spokenConfirmation).toBe('How often would you like to meditate?');
    });

    it('completes habit creation when user answers frequency "Every day"', () => {
      const turn1 = VoiceCommandService.interpret('I want to build a meditation habit.');
      const turn2 = VoiceCommandService.interpret('Every day', turn1.needsClarification);
      expect(turn2.intent).toBe('ADD_HABIT');
      expect(turn2.parameters.title).toBe('Meditation');
      expect(turn2.parameters.frequency).toBe('Daily');
      expect(turn2.spokenConfirmation).toBe("I've added meditation to your daily habits.");
    });

    it('understands "Add daily exercise to my habits."', () => {
      const res = VoiceCommandService.interpret('Add daily exercise to my habits.');
      expect(res.intent).toBe('ADD_HABIT');
      expect(res.parameters.title).toBe('Exercise');
      expect(res.parameters.frequency).toBe('Daily');
    });

    it('understands "I want to start drinking more water every day."', () => {
      const res = VoiceCommandService.interpret('I want to start drinking more water every day.');
      expect(res.intent).toBe('ADD_HABIT');
      expect(res.parameters.frequency).toBe('Daily');
    });

    it('understands "I completed my workout."', () => {
      const res = VoiceCommandService.interpret('I completed my workout.');
      expect(res.intent).toBe('LOG_HABIT');
      expect(res.parameters.query).toBe('mindful run');
    });
  });

  describe('Conversational Courtesy, Cancellation, and Goodbye', () => {
    it('handles thanks: "Thanks" and "Thank you so much"', () => {
      const res1 = VoiceCommandService.interpret('Thanks');
      expect(res1.intent).toBe('THANKS');
      expect(res1.spokenConfirmation).toContain('welcome');

      const res2 = VoiceCommandService.interpret('Thank you so much');
      expect(res2.intent).toBe('THANKS');
      expect(res2.spokenConfirmation).toContain('welcome');
    });

    it('handles cancellation: "Never mind" and "Cancel that"', () => {
      const res1 = VoiceCommandService.interpret('Never mind');
      expect(res1.intent).toBe('CANCEL');
      expect(res1.spokenConfirmation?.toLowerCase()).toContain('cancel');

      const res2 = VoiceCommandService.interpret('Cancel that');
      expect(res2.intent).toBe('CANCEL');
      expect(res2.spokenConfirmation?.toLowerCase()).toContain('cancel');
    });

    it('handles goodbye: "That\'s all" and "Goodbye"', () => {
      const res1 = VoiceCommandService.interpret("That's all");
      expect(res1.intent).toBe('GOODBYE');
      expect(res1.spokenConfirmation).toContain('Have a great day');

      const res2 = VoiceCommandService.interpret('Goodbye');
      expect(res2.intent).toBe('GOODBYE');
    });

    it('handles unrecognized or empty speech gracefully', () => {
      const res = VoiceCommandService.interpret('xyz random blabla');
      expect(res.intent).toBe('UNRECOGNIZED');
      expect(res.needsClarification).toBeUndefined();
      expect(res.spokenConfirmation).toContain('command');
    });
  });

  describe('Session Configuration Defaults', () => {
    it('has Siri-like silence and session timeouts configured', () => {
      expect(VoiceSessionConfig.silencePromptDelayMs).toBe(10000); // 10s
      expect(VoiceSessionConfig.silenceGracePeriodMs).toBe(7000);  // 7s
      expect(VoiceSessionConfig.stillTherePrompt).toBe('Are you still there?');
      expect(VoiceSessionConfig.idleClosingFarewell).toBe('Closing for now. Say "Hey Regius" when you need me.');
    });
  });
});
