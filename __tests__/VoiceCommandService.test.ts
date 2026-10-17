import { VoiceCommandService, ExecutionContext } from '../src/Services/Voice/VoiceCommandService';

describe('VoiceCommandService Natural Language Interpretation', () => {
  describe('1. Task creation commands', () => {
    it('interprets "Add a task to take medicine."', () => {
      const res = VoiceCommandService.interpret('Add a task to take medicine.');
      expect(res.intent).toBe('ADD_TASK');
      expect(res.parameters.title).toBe('take medicine');
      expect(res.spokenConfirmation).toContain('task to take medicine has been added');
    });

    it('interprets "Create a task to finish my portfolio."', () => {
      const res = VoiceCommandService.interpret('Create a task to finish my portfolio.');
      expect(res.intent).toBe('ADD_TASK');
      expect(res.parameters.title).toBe('finish my portfolio');
      expect(res.spokenConfirmation).toContain('task to finish my portfolio has been added');
    });

    it('interprets "Remind me to complete my assignment" as a task when no time is scheduled', () => {
      const res = VoiceCommandService.interpret('Remind me to complete my assignment');
      expect(res.intent).toBe('ADD_TASK');
      expect(res.parameters.title).toBe('complete my assignment');
      expect(res.spokenConfirmation).toContain('task to complete my assignment has been added');
    });
  });

  describe('2. Reminder creation commands', () => {
    it('interprets "Remind me to take my medicine at 8 tonight."', () => {
      const res = VoiceCommandService.interpret('Remind me to take my medicine at 8 tonight.');
      expect(res.intent).toBe('ADD_REMINDER');
      expect(res.parameters.title).toBe('take medicine');
      expect(res.parameters.date).toBe('Tonight');
      expect(res.parameters.time).toBe('8 PM');
      expect(res.spokenConfirmation).toBe('Your reminder to take medicine is set for 8 PM tonight.');
    });

    it('interprets "Set a reminder to call Mom in 30 minutes."', () => {
      const res = VoiceCommandService.interpret('Set a reminder to call Mom in 30 minutes.');
      expect(res.intent).toBe('ADD_REMINDER');
      expect(res.parameters.title).toBe('call Mom');
      expect(res.parameters.time).toBe('In 30 minutes');
      expect(res.spokenConfirmation).toContain('call Mom');
    });

    it('requests clarification when title is missing in "Set a reminder for 9 AM tomorrow."', () => {
      const res = VoiceCommandService.interpret('Set a reminder for 9 AM tomorrow.');
      expect(res.intent).toBe('ADD_REMINDER');
      expect(res.needsClarification).toBeDefined();
      expect(res.needsClarification?.missingSlot).toBe('title');
      expect(res.needsClarification?.collectedData.date).toBe('Tomorrow');
      expect(res.spokenConfirmation).toBe('What would you like me to remind you about?');
    });

    it('resolves clarification when user provides reminder title', () => {
      const clarification = {
        intent: 'ADD_REMINDER' as const,
        collectedData: { date: 'Tomorrow', time: '9 AM' },
        missingSlot: 'title' as const,
        question: 'What would you like me to remind you about?',
      };
      const res = VoiceCommandService.interpret('Take my medicine', clarification);
      expect(res.intent).toBe('ADD_REMINDER');
      expect(res.parameters.title).toBe('Take my medicine');
      expect(res.parameters.date).toBe('Tomorrow');
      expect(res.parameters.time).toBe('9 AM');
      expect(res.spokenConfirmation).toContain('reminder to Take my medicine is set for tomorrow at 9 AM');
    });

    it('requests clarification when both title and time are missing in "Set a reminder."', () => {
      const res = VoiceCommandService.interpret('Set a reminder.');
      expect(res.intent).toBe('ADD_REMINDER');
      expect(res.needsClarification?.missingSlot).toBe('both');
      expect(res.spokenConfirmation).toBe('What would you like me to remind you about, and when?');
    });
  });

  describe('3. Habit management commands', () => {
    it('interprets "Add a daily meditation habit."', () => {
      const res = VoiceCommandService.interpret('Add a daily meditation habit.');
      expect(res.intent).toBe('ADD_HABIT');
      expect(res.parameters.title).toBe('Meditation');
      expect(res.spokenConfirmation).toBe("I've added meditation to your daily habits.");
    });

    it('interprets "Log my 20-minute meditation."', () => {
      const res = VoiceCommandService.interpret('Log my 20-minute meditation.');
      expect(res.intent).toBe('LOG_HABIT');
      expect(res.parameters.query).toBe('meditation');
      expect(res.spokenConfirmation).toBe('Your 20-minute meditation has been logged.');
    });

    it('interprets "Mark my water-drinking habit complete."', () => {
      const res = VoiceCommandService.interpret('Mark my water-drinking habit complete.');
      expect(res.intent).toBe('LOG_HABIT');
      expect(res.parameters.query).toBe('water-drinking');
      expect(res.spokenConfirmation).toBe('Marked your water-drinking habit complete.');
    });
  });

  describe('4. Other commands', () => {
    it('interprets "Show my tasks for today."', () => {
      const res = VoiceCommandService.interpret('Show my tasks for today.');
      expect(res.intent).toBe('SHOW_TASKS');
    });

    it('interprets "Start a 25-minute focus session."', () => {
      const res = VoiceCommandService.interpret('Start a 25-minute focus session.');
      expect(res.intent).toBe('START_FOCUS');
      expect(res.parameters.durationMinutes).toBe(25);
      expect(res.spokenConfirmation).toContain('Starting a 25-minute focus session');
    });

    it('interprets "Play my Morning Brief."', () => {
      const res = VoiceCommandService.interpret('Play my Morning Brief.');
      expect(res.intent).toBe('PLAY_BRIEF');
      expect(res.spokenConfirmation).toBe('Playing your morning brief.');
    });
  });

  describe('5. Real Execution against ExecutionContext', () => {
    let mockContext: ExecutionContext;
    let addedTasks: any[] = [];
    let addedReminders: any[] = [];
    let addedHabits: any[] = [];
    let toggledHabitIds: string[] = [];

    beforeEach(() => {
      addedTasks = [];
      addedReminders = [];
      addedHabits = [];
      toggledHabitIds = [];

      mockContext = {
        tasks: [
          { id: '1', label: 'Email Check', iconType: 'mail', done: false },
        ],
        addTask: jest.fn(data => addedTasks.push(data)),
        toggleTask: jest.fn(),
        reminders: [
          { id: '1', title: 'Hydration', time: '02:00 PM', date: 'Today', category: 'daily', repeat: 'Daily', done: false },
        ],
        addReminder: jest.fn(data => addedReminders.push(data)),
        toggleReminder: jest.fn(),
        habits: [
          { id: 'h-1', title: 'Morning Sunlight & 500ml Water', category: 'morning', streak: 18, frequency: 'Daily', completed: false, timeOfDay: '07:30 AM', accentColor: '#4A7C59' },
          { id: 'h-2', title: '20-min Posture & Breath Reset', category: 'mindful', streak: 9, frequency: 'Daily', completed: false, timeOfDay: '01:15 PM', accentColor: '#7C68EE' },
        ],
        addHabit: jest.fn(data => addedHabits.push(data)),
        toggleHabit: jest.fn(id => toggledHabitIds.push(id)),
      };
    });

    it('executes ADD_TASK and calls addTask on context', () => {
      const cmd = VoiceCommandService.interpret('Add a task to take medicine.');
      const result = VoiceCommandService.execute(cmd, mockContext);
      expect(result.success).toBe(true);
      expect(mockContext.addTask).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'take medicine',
          date: 'Today',
        }),
      );
      expect(addedTasks.length).toBe(1);
    });

    it('executes ADD_REMINDER and calls addReminder on context', () => {
      const cmd = VoiceCommandService.interpret('Remind me to take my medicine at 8 tonight.');
      const result = VoiceCommandService.execute(cmd, mockContext);
      expect(result.success).toBe(true);
      expect(mockContext.addReminder).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'take medicine',
          date: 'Tonight',
          time: '8 PM',
        }),
      );
      expect(addedReminders.length).toBe(1);
    });

    it('executes ADD_HABIT and calls addHabit on context', () => {
      const cmd = VoiceCommandService.interpret('Add a daily meditation habit.');
      const result = VoiceCommandService.execute(cmd, mockContext);
      expect(result.success).toBe(true);
      expect(mockContext.addHabit).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Meditation',
          category: 'mindful',
        }),
      );
      expect(addedHabits.length).toBe(1);
    });

    it('executes LOG_HABIT for water and toggles existing habit', () => {
      const cmd = VoiceCommandService.interpret('Mark my water-drinking habit complete.');
      const result = VoiceCommandService.execute(cmd, mockContext);
      expect(result.success).toBe(true);
      expect(mockContext.toggleHabit).toHaveBeenCalledWith('h-1');
      expect(toggledHabitIds).toContain('h-1');
    });

    it('executes LOG_HABIT for 20-minute meditation and toggles mindful habit', () => {
      const cmd = VoiceCommandService.interpret('Log my 20-minute meditation.');
      const result = VoiceCommandService.execute(cmd, mockContext);
      expect(result.success).toBe(true);
      expect(mockContext.toggleHabit).toHaveBeenCalledWith('h-2');
      expect(toggledHabitIds).toContain('h-2');
    });
  });
});
