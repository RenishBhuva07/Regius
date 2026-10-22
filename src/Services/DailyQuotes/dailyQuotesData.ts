export type ScreenQuoteKey = 'dashboard' | 'tasks' | 'reminders' | 'habits';

export const DAILY_QUOTES: Record<ScreenQuoteKey, readonly string[]> = {
  dashboard: [
    'Make today a little legendary!',
    'Small steps. Extraordinary days!',
    'A clearer mind. A brighter day!',
    'Give your day a little direction!',
    'Today has potential. So do you!',
    'A fresh start looks good on you!',
    'Even ordinary days hold a little magic!',
  ],
  tasks: [
    'Dreams move when you do!',
    'Progress looks good on you!',
    'One step closer to your bigger picture!',
    'Think less, do more!',
    'Done feels better than perfect.!',
    'Turn your plans into proof!',
    "Let's make that to-do list a ta-da list!",
    'Tiny victories make legendary stories!',
  ],
  reminders: [
    "Because your best ideas shouldn't slip away!",
    'Important things deserve a little nudge!',
    'Remember less. Live more.',
    'Leave the remembering to us!',
    'Consider this a letter from your past self!',
    'Gentle nudge for your non-negotiables!',
    'Life moves fast. Hold on to what matters!',
    'The keeper of your priorities!',
  ],
  habits: [
    'Your future self is taking notes!',
    'Become who you promised yourself!',
    'Little rituals. Lasting change!',
    'Consistency is your quiet superpower!',
    'Show up today. Thank yourself tomorrow.',
    'One good habit at a time.',
    "You're building a version of you that lasts!",
  ],
} as const;
