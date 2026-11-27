// Voice script templates for personalized reminder delivery.
// Format: {opener} + ", " + {name} + ". " + {body} + " " + {close}
// Placeholders: {name} = user's first name, {title} = reminder title.

export type TimeOfDaySlot = 'morning' | 'afternoon' | 'evening' | 'night';

export interface ReminderVoiceTemplate {
  opener: string;
  body: string;
  close: string;
}

// Key format: "{category}_{timeSlot}"
export const REMINDER_VOICE_TEMPLATES: Record<string, ReminderVoiceTemplate[]> = {

  // ─── HEALTH ────────────────────────────────────────────────────────────────

  health_morning: [
    { opener: 'Good morning, {name}', body: 'time for {title}', close: 'Start the day strong.' },
    { opener: 'Rise and shine, {name}', body: 'your {title} is up next', close: 'Your body will thank you.' },
    { opener: 'Morning, {name}', body: '{assistant} here — {title} is on the schedule', close: 'Let\'s make it happen.' },
    { opener: 'Hey {name}, good morning', body: 'your {title} reminder is here', close: 'Small steps, big results.' },
  ],

  health_afternoon: [
    { opener: 'Good afternoon, {name}', body: 'time for {title}', close: 'Keep that energy going.' },
    { opener: 'Hey {name}', body: 'your {title} is due', close: 'Take a moment for yourself — you\'ve earned it.' },
    { opener: '{name}', body: '{assistant} nudging you — {title} is on the list', close: 'Consistency is the secret.' },
    { opener: 'Afternoon, {name}', body: '{title} is waiting', close: 'Your future self will thank you.' },
  ],

  health_evening: [
    { opener: 'Good evening, {name}', body: 'it\'s time for {title}', close: 'You\'ll feel great after. Let\'s go.' },
    { opener: 'Hey {name}', body: 'your {title} is here — evening edition', close: 'Movement is momentum.' },
    { opener: 'Evening, {name}', body: '{title} is on the agenda', close: 'Finish the day strong.' },
    { opener: '{name}', body: '{assistant} here — time for {title}', close: 'You\'ve come this far. Don\'t stop now.' },
  ],

  health_night: [
    { opener: 'Hey {name}', body: 'a gentle reminder — {title}', close: 'Take it easy and take care of yourself.' },
    { opener: '{name}', body: 'one last nudge before you rest — {title}', close: 'Rest well after.' },
    { opener: 'Hey {name}', body: '{title} before you wind down', close: 'Your body deserves the best.' },
    { opener: '{name}', body: 'quick reminder — {title}', close: 'Then rest up. You\'ve done well today.' },
  ],

  // ─── WORK ──────────────────────────────────────────────────────────────────

  work_morning: [
    { opener: 'Good morning, {name}', body: '{title} is coming up', close: 'You\'ve prepared for this — go deliver.' },
    { opener: 'Morning, {name}', body: '{assistant} here — {title} is on the schedule', close: 'Make it count.' },
    { opener: 'Hey {name}, rise and grind', body: '{title} is up next', close: 'Stay sharp.' },
    { opener: 'Good morning, {name}', body: 'time to gear up for {title}', close: 'You\'ve got everything you need.' },
  ],

  work_afternoon: [
    { opener: 'Good afternoon, {name}', body: '{title} is coming up', close: 'Stay sharp, stay focused.' },
    { opener: 'Hey {name}', body: '{assistant} nudging you — {title}', close: 'Bring your best.' },
    { opener: '{name}', body: 'a quick heads-up — {title} is due', close: 'You\'re ready for this.' },
    { opener: 'Afternoon, {name}', body: 'time to get into {title}', close: 'Make it a great one.' },
  ],

  work_evening: [
    { opener: 'Good evening, {name}', body: '{title} is on the schedule', close: 'Wrap it up well.' },
    { opener: 'Hey {name}', body: 'one more for today — {title}', close: 'Finish strong.' },
    { opener: 'Evening, {name}', body: '{assistant} here — {title} still needs attention', close: 'Get it done and rest easy.' },
    { opener: '{name}', body: 'a reminder for {title} this evening', close: 'You\'re almost there.' },
  ],

  work_night: [
    { opener: 'Hey {name}', body: 'late-night nudge — {title}', close: 'Take care of it, then get some rest.' },
    { opener: '{name}', body: '{assistant} here — {title} is on your list', close: 'Handle it and power down.' },
    { opener: 'Hey {name}', body: 'a quick reminder — {title}', close: 'Then close the laptop and recharge.' },
    { opener: '{name}', body: 'one last thing for tonight — {title}', close: 'You\'ve had a productive day.' },
  ],

  // ─── DAILY ─────────────────────────────────────────────────────────────────

  daily_morning: [
    { opener: 'Good morning, {name}', body: '{title} is part of your morning', close: 'Consistency makes the difference.' },
    { opener: 'Morning, {name}', body: 'starting the day right with {title}', close: 'You\'re building something great.' },
    { opener: 'Hey {name}, good morning', body: 'your daily {title} is ready', close: 'One small act, big impact.' },
    { opener: 'Rise and shine, {name}', body: '{title} is waiting for you', close: 'Let\'s kick off the day.' },
  ],

  daily_afternoon: [
    { opener: 'Good afternoon, {name}', body: 'a gentle reminder — {title}', close: 'Keep the rhythm going.' },
    { opener: 'Hey {name}', body: 'midday check-in — {title}', close: 'You\'re doing great.' },
    { opener: '{name}', body: '{assistant} here — time for {title}', close: 'Take a moment, it\'s worth it.' },
    { opener: 'Afternoon, {name}', body: '{title} is on your daily list', close: 'Stay on track.' },
  ],

  daily_evening: [
    { opener: 'Good evening, {name}', body: 'winding down with {title}', close: 'Make it a habit, make it yours.' },
    { opener: 'Evening, {name}', body: 'daily reminder — {title}', close: 'You\'ve shown up again today.' },
    { opener: 'Hey {name}', body: '{title} before the day ends', close: 'Finishing strong.' },
    { opener: '{name}', body: '{assistant} nudging you — {title} this evening', close: 'Every day counts.' },
  ],

  daily_night: [
    { opener: 'Hey {name}', body: 'end-of-day reminder — {title}', close: 'Then rest and recharge.' },
    { opener: '{name}', body: 'one last daily nudge — {title}', close: 'You\'ve built another good day.' },
    { opener: 'Hey {name}', body: '{assistant} here — {title} to close the day', close: 'Sleep well after.' },
    { opener: '{name}', body: 'gentle night reminder — {title}', close: 'Take care of yourself.' },
  ],

  // ─── EVENTS ────────────────────────────────────────────────────────────────

  events_morning: [
    { opener: 'Good morning, {name}', body: 'exciting day ahead — {title} is coming up', close: 'Looking forward to it.' },
    { opener: 'Morning, {name}', body: 'heads up — {title} is on the calendar', close: 'Enjoy every moment.' },
    { opener: 'Hey {name}', body: 'don\'t forget — {title} today', close: 'You\'re going to have a great time.' },
    { opener: 'Rise and shine, {name}', body: '{title} is happening today', close: 'Make memories.' },
  ],

  events_afternoon: [
    { opener: 'Good afternoon, {name}', body: '{title} is coming up soon', close: 'You won\'t want to be late.' },
    { opener: 'Hey {name}', body: 'friendly heads-up — {title} is on tonight', close: 'Looking forward to it.' },
    { opener: '{name}', body: '{assistant} here — {title} is approaching', close: 'Get ready to enjoy yourself.' },
    { opener: 'Afternoon, {name}', body: 'reminder — {title} is around the corner', close: 'Make it special.' },
  ],

  events_evening: [
    { opener: 'Good evening, {name}', body: '{title} is happening tonight', close: 'Have a wonderful time.' },
    { opener: 'Hey {name}', body: 'tonight\'s the night — {title}', close: 'Enjoy every bit of it.' },
    { opener: 'Evening, {name}', body: '{title} is just ahead', close: 'You deserve this.' },
    { opener: '{name}', body: '{assistant} here — {title} tonight', close: 'Make it a night to remember.' },
  ],

  events_night: [
    { opener: 'Hey {name}', body: 'late reminder — {title}', close: 'Hope it\'s a great one.' },
    { opener: '{name}', body: '{assistant} nudging you — {title} is tonight', close: 'Enjoy.' },
    { opener: 'Hey {name}', body: '{title} coming up', close: 'Have fun out there.' },
    { opener: '{name}', body: 'one last heads-up — {title}', close: 'Make it count.' },
  ],

  // ─── PERSONAL ──────────────────────────────────────────────────────────────

  personal_morning: [
    { opener: 'Good morning, {name}', body: 'a moment for yourself — {title}', close: 'You come first.' },
    { opener: 'Morning, {name}', body: '{title} is on your personal list this morning', close: 'Take care of yourself first.' },
    { opener: 'Hey {name}', body: '{assistant} here — time for {title}', close: 'You deserve this time.' },
    { opener: 'Rise and shine, {name}', body: '{title} is waiting', close: 'Start with what matters most.' },
  ],

  personal_afternoon: [
    { opener: 'Good afternoon, {name}', body: 'a personal reminder — {title}', close: 'You matter. Take care of yourself.' },
    { opener: 'Hey {name}', body: '{assistant} nudging you — {title}', close: 'Make time for yourself.' },
    { opener: '{name}', body: '{title} is on your mind for a reason', close: 'Take that step.' },
    { opener: 'Afternoon, {name}', body: 'gentle reminder — {title}', close: 'You\'re worth the effort.' },
  ],

  personal_evening: [
    { opener: 'Good evening, {name}', body: 'a personal note — {title}', close: 'Take a quiet moment for it.' },
    { opener: 'Evening, {name}', body: '{title} is part of your evening', close: 'Peace comes from the small things.' },
    { opener: 'Hey {name}', body: '{assistant} here — {title} this evening', close: 'You\'ve earned this.' },
    { opener: '{name}', body: 'gentle nudge — {title}', close: 'Take care of yourself tonight.' },
  ],

  personal_night: [
    { opener: 'Hey {name}', body: 'a quiet reminder before sleep — {title}', close: 'Then rest peacefully.' },
    { opener: '{name}', body: '{assistant} here — {title} to end the day', close: 'You\'ve done enough. Rest well.' },
    { opener: 'Hey {name}', body: 'one gentle nudge — {title}', close: 'Then let the day go.' },
    { opener: '{name}', body: 'soft reminder — {title}', close: 'Take care, then sleep well.' },
  ],

  // ─── FINANCE ───────────────────────────────────────────────────────────────

  finance_morning: [
    { opener: 'Good morning, {name}', body: 'a financial reminder — {title}', close: 'Stay on top of it and you\'re golden.' },
    { opener: 'Morning, {name}', body: '{title} needs your attention today', close: 'Sorted early means stress-free later.' },
    { opener: 'Hey {name}', body: '{assistant} here — {title} is on the books', close: 'Take a few minutes now.' },
    { opener: 'Rise and shine, {name}', body: 'financial nudge — {title}', close: 'Get it out of the way first.' },
  ],

  finance_afternoon: [
    { opener: 'Good afternoon, {name}', body: 'a quick financial reminder — {title}', close: 'Stay ahead of it.' },
    { opener: 'Hey {name}', body: '{title} is on your list', close: 'A few minutes now saves a headache later.' },
    { opener: '{name}', body: '{assistant} nudging you — {title}', close: 'On top of your finances, as always.' },
    { opener: 'Afternoon, {name}', body: 'financial check-in — {title}', close: 'Keep everything in order.' },
  ],

  finance_evening: [
    { opener: 'Good evening, {name}', body: 'financial reminder — {title}', close: 'Handle it before you wind down.' },
    { opener: 'Evening, {name}', body: '{title} is still on the list', close: 'Take care of it and rest easy.' },
    { opener: 'Hey {name}', body: '{assistant} here — {title} this evening', close: 'Stay disciplined, stay ahead.' },
    { opener: '{name}', body: 'end-of-day finance nudge — {title}', close: 'You\'ve got this.' },
  ],

  finance_night: [
    { opener: 'Hey {name}', body: 'late financial reminder — {title}', close: 'Handle it and sleep easy.' },
    { opener: '{name}', body: '{title} needs attention before tomorrow', close: 'Get it done.' },
    { opener: 'Hey {name}', body: '{assistant} here — {title} still pending', close: 'Sort it out and rest well.' },
    { opener: '{name}', body: 'one last financial nudge — {title}', close: 'Stay on track.' },
  ],

  // ─── FAMILY ────────────────────────────────────────────────────────────────

  family_morning: [
    { opener: 'Good morning, {name}', body: 'a family reminder — {title}', close: 'Show up for the people who matter.' },
    { opener: 'Morning, {name}', body: '{title} with the family is today', close: 'Make it special.' },
    { opener: 'Hey {name}', body: '{assistant} here — {title}', close: 'Family first.' },
    { opener: 'Rise and shine, {name}', body: '{title} is on the calendar', close: 'They\'ll appreciate it.' },
  ],

  family_afternoon: [
    { opener: 'Good afternoon, {name}', body: 'family reminder — {title}', close: 'Be present, be there.' },
    { opener: 'Hey {name}', body: '{title} is coming up', close: 'Make the time count.' },
    { opener: '{name}', body: '{assistant} here — {title} with your loved ones', close: 'Nothing beats being there.' },
    { opener: 'Afternoon, {name}', body: 'gentle nudge — {title}', close: 'Your presence is the gift.' },
  ],

  family_evening: [
    { opener: 'Good evening, {name}', body: '{title} this evening', close: 'Cherish every moment.' },
    { opener: 'Evening, {name}', body: 'family time — {title}', close: 'Put the phone down. Be there.' },
    { opener: 'Hey {name}', body: '{assistant} here — {title} tonight', close: 'The best moments are the simple ones.' },
    { opener: '{name}', body: 'a warm reminder — {title}', close: 'Show up for them.' },
  ],

  family_night: [
    { opener: 'Hey {name}', body: 'late reminder — {title}', close: 'Even a quick message means the world.' },
    { opener: '{name}', body: '{assistant} here — {title} tonight', close: 'Family always comes through.' },
    { opener: 'Hey {name}', body: 'gentle nudge — {title}', close: 'Reach out before you sleep.' },
    { opener: '{name}', body: '{title} tonight', close: 'Love is in the small gestures.' },
  ],

  // ─── LEARNING ──────────────────────────────────────────────────────────────

  learning_morning: [
    { opener: 'Good morning, {name}', body: 'ready to grow? — {title}', close: 'Every lesson compounds.' },
    { opener: 'Morning, {name}', body: '{title} is on the learning agenda', close: 'Curious minds get ahead.' },
    { opener: 'Hey {name}', body: '{assistant} here — {title} session awaits', close: 'You invest in yourself every day.' },
    { opener: 'Rise and shine, {name}', body: 'time to level up — {title}', close: 'Knowledge is the edge.' },
  ],

  learning_afternoon: [
    { opener: 'Good afternoon, {name}', body: 'learning nudge — {title}', close: 'Stay curious.' },
    { opener: 'Hey {name}', body: '{title} session is on the list', close: 'Growth is a daily choice.' },
    { opener: '{name}', body: '{assistant} here — time to dive into {title}', close: 'You\'re becoming better every day.' },
    { opener: 'Afternoon, {name}', body: '{title} is waiting for you', close: 'Keep the momentum.' },
  ],

  learning_evening: [
    { opener: 'Good evening, {name}', body: 'evening study time — {title}', close: 'The mind works well in the quiet of evening.' },
    { opener: 'Evening, {name}', body: '{title} session tonight', close: 'Build the habit. Build the skill.' },
    { opener: 'Hey {name}', body: '{assistant} here — {title}', close: 'Even 20 minutes changes everything.' },
    { opener: '{name}', body: 'learning reminder — {title} this evening', close: 'Stay on the path.' },
  ],

  learning_night: [
    { opener: 'Hey {name}', body: 'one more for tonight — {title}', close: 'Then let your mind rest and absorb.' },
    { opener: '{name}', body: '{assistant} here — {title} before you sleep', close: 'Sleep consolidates learning.' },
    { opener: 'Hey {name}', body: 'late-night learning nudge — {title}', close: 'You\'re consistent. Keep going.' },
    { opener: '{name}', body: '{title} session tonight', close: 'Then rest — you\'ve done enough.' },
  ],
};

// Fallback templates used when category doesn't match any bucket
export const FALLBACK_VOICE_TEMPLATES: ReminderVoiceTemplate[] = [
  { opener: 'Hey {name}', body: 'a reminder from {assistant} — {title}', close: 'Take a moment to handle it.' },
  { opener: '{name}', body: '{assistant} here — {title} is on your list', close: 'You\'ve got this.' },
  { opener: 'Hey {name}', body: 'gentle nudge — {title}', close: 'Stay on track.' },
  { opener: '{name}', body: 'a quick reminder — {title}', close: 'Take care of yourself.' },
];

// Urgent overlay — overrides category/time matching when urgentAlarm is true
export const URGENT_VOICE_TEMPLATES: ReminderVoiceTemplate[] = [
  { opener: '{name}, heads up', body: 'this one is urgent — {title}', close: 'Please handle it right away.' },
  { opener: 'Hey {name}', body: '{title} needs your immediate attention', close: 'Don\'t let it slip.' },
  { opener: '{name}', body: '{assistant} here — urgent reminder — {title}', close: 'Take care of this now.' },
  { opener: 'Important, {name}', body: '{title} is time-sensitive', close: 'Act on it now.' },
];
