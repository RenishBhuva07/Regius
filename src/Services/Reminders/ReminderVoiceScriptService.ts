import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  REMINDER_VOICE_TEMPLATES,
  FALLBACK_VOICE_TEMPLATES,
  URGENT_VOICE_TEMPLATES,
  ReminderVoiceTemplate,
  TimeOfDaySlot,
} from './reminderVoiceTemplates';
import { Reminder } from './types';
import { KokoroTTSService } from '../Kokoro/KokoroTTSService';
import { VoiceSettingsService } from '../VoiceSettingsService';

const PROFILE_STORAGE_KEY = '@regius_profile_data';

// Default user & assistant names
const DEFAULT_USER_NAME = 'Renish';
const DEFAULT_ASSISTANT_NAME = 'Sia';

// In-memory caches — invalidated when profile or voice settings are updated
let cachedFirstName: string = DEFAULT_USER_NAME;
let cachedAssistantName: string = DEFAULT_ASSISTANT_NAME;

// Per-bucket rotation index to avoid back-to-back repeats
const bucketIndex: Record<string, number> = {};

export const ReminderVoiceScriptService = {

  // ── Preferences resolution ─────────────────────────────────────────────────

  /** Must be called on app mount / screen focus to sync user & assistant names. */
  async resolveAndCachePreferences(): Promise<void> {
    try {
      const [rawProfile, assistant] = await Promise.all([
        AsyncStorage.getItem(PROFILE_STORAGE_KEY),
        VoiceSettingsService.getAssistantName(),
      ]);

      if (rawProfile) {
        const data = JSON.parse(rawProfile);
        if (data?.name && typeof data.name === 'string') {
          const firstName = data.name.trim().split(' ')[0];
          if (firstName) {
            cachedFirstName = firstName;
          }
        }
      }

      if (assistant) {
        cachedAssistantName = assistant;
      }
    } catch {
      // Retain clean defaults ('Renish' and 'Sia')
    }
  },

  /** Backwards compatibility alias for resolveAndCachePreferences */
  async resolveAndCacheFirstName(): Promise<void> {
    return this.resolveAndCachePreferences();
  },

  /** Call when the user updates profile name or voice settings. */
  invalidateCache(): void {
    cachedFirstName = DEFAULT_USER_NAME;
    cachedAssistantName = DEFAULT_ASSISTANT_NAME;
    this.resolveAndCachePreferences().catch(() => {});
  },

  /** Backwards compatibility alias for invalidateCache */
  invalidateNameCache(): void {
    this.invalidateCache();
  },

  /** Synchronously returns the user's first name, defaults to 'Renish'. */
  getFirstName(): string {
    return cachedFirstName || DEFAULT_USER_NAME;
  },

  /** Synchronously returns the dynamic assistant name (e.g. 'Sia' or 'Regius'). */
  getAssistantName(): string {
    return cachedAssistantName || DEFAULT_ASSISTANT_NAME;
  },

  // ── Time-of-day ────────────────────────────────────────────────────────────

  getTimeOfDaySlot(date: Date = new Date()): TimeOfDaySlot {
    const hour = date.getHours();
    if (hour >= 5 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 18) return 'afternoon';
    if (hour >= 18 && hour < 22) return 'evening';
    return 'night';
  },

  // ── Template selection ─────────────────────────────────────────────────────

  pickTemplate(
    category: string,
    timeSlot: TimeOfDaySlot,
    isUrgent: boolean,
  ): ReminderVoiceTemplate {
    if (isUrgent) {
      const idx = (bucketIndex['urgent'] ?? 0) % URGENT_VOICE_TEMPLATES.length;
      bucketIndex['urgent'] = idx + 1;
      return URGENT_VOICE_TEMPLATES[idx];
    }

    // Normalize category: trim, lowercase, strip spaces
    const cat = category?.trim().toLowerCase().replace(/\s+/g, '_') || '';
    const key = `${cat}_${timeSlot}`;
    const pool = REMINDER_VOICE_TEMPLATES[key] ?? FALLBACK_VOICE_TEMPLATES;
    const idx = (bucketIndex[key] ?? Math.floor(Math.random() * pool.length)) % pool.length;
    bucketIndex[key] = idx + 1;
    return pool[idx];
  },

  // ── Interpolation ──────────────────────────────────────────────────────────

  interpolate(
    template: ReminderVoiceTemplate,
    name: string,
    title: string,
    assistantName: string,
  ): string {
    const resolve = (s: string) =>
      s
        .replace(/\{name\}/g, name)
        .replace(/\{title\}/g, title)
        .replace(/\{assistant\}/g, assistantName)
        .replace(/\bRegius\b/g, assistantName);

    const resolvedOpener = resolve(template.opener).trim();
    const resolvedBody = resolve(template.body).trim();
    const resolvedClose = resolve(template.close).trim();

    // Format punctuation cleanly so {name} is never duplicated
    let prefix = resolvedOpener;
    let separator = '. ';

    if (/[,]$/.test(prefix)) {
      separator = ' ';
    } else if (prefix.toLowerCase() === name.toLowerCase()) {
      prefix = `${prefix},`;
      separator = ' ';
    } else if (!/[.!?]$/.test(prefix)) {
      separator = '. ';
    } else {
      separator = ' ';
    }

    // Capitalize first letter of body if preceded by a period
    const formattedBody =
      separator.includes('.') && resolvedBody.length > 0
        ? resolvedBody.charAt(0).toUpperCase() + resolvedBody.slice(1)
        : resolvedBody;

    // Ensure body ends with punctuation before close
    const bodyPunctuation = /[.!?]$/.test(formattedBody) ? ' ' : '. ';

    return `${prefix}${separator}${formattedBody}${bodyPunctuation}${resolvedClose}`;
  },

  // ── Public generation ──────────────────────────────────────────────────────

  /**
   * Generates the full spoken script for foreground TTS delivery.
   * Uses current time for time-of-day slot unless overridden.
   */
  generateScript(
    reminder: Reminder,
    timeOverride?: TimeOfDaySlot,
  ): string {
    const name = this.getFirstName();
    const assistant = this.getAssistantName();
    const slot = timeOverride ?? this.getTimeOfDaySlot(new Date());
    const template = this.pickTemplate(reminder.category, slot, reminder.urgentAlarm);
    return this.interpolate(template, name, reminder.title, assistant);
  },

  /**
   * Generates a warm notification body for background/killed-state delivery.
   * Synchronous — uses cached user name and dynamic assistant name.
   * Uses the reminder's scheduled time to determine the appropriate time-of-day tone.
   */
  generateNotificationBody(reminder: Reminder): string {
    const name = this.getFirstName();
    const assistant = this.getAssistantName();
    // Derive slot from the reminder's scheduled time (not current time)
    const [hours] = reminder.scheduledTime.split(':').map(Number);
    let slot: TimeOfDaySlot = 'morning';
    if (hours >= 12 && hours < 18) slot = 'afternoon';
    else if (hours >= 18 && hours < 22) slot = 'evening';
    else if (hours >= 22 || hours < 5) slot = 'night';

    const template = this.pickTemplate(reminder.category, slot, reminder.urgentAlarm);
    return this.interpolate(template, name, reminder.title, assistant);
  },

  // ── TTS pre-warming ────────────────────────────────────────────────────────

  /**
   * Pre-synthesizes all 4 time-slot variants of a reminder's voice script
   * into KokoroTTSService's persistent cache. Fire-and-forget — no await needed.
   */
  async prewarmScript(reminder: Reminder): Promise<void> {
    if (!reminder.voiceNudge) return;
    try {
      const { selectedVoiceId: voiceId, speechSpeed: speed } =
        await VoiceSettingsService.getSettings();
      const slots: TimeOfDaySlot[] = ['morning', 'afternoon', 'evening', 'night'];
      const scripts = slots.map(slot => this.generateScript(reminder, slot));
      // Prewarm deduplicates internally — safe to call with overlapping texts
      KokoroTTSService.prewarm(scripts, voiceId, speed).catch(() => {});
    } catch {
      // Non-fatal — cache miss means synthesis happens at delivery time
    }
  },

  /**
   * Prewarms scripts for the N soonest pending voiceNudge reminders.
   * Called from RegiusSpeechService.warmupVoice() on app launch.
   */
  async prewarmTopReminders(reminders: Reminder[], limit: number = 5): Promise<void> {
    const upcoming = reminders
      .filter(r => r.voiceNudge && !r.done && r.status !== 'dismissed')
      .slice(0, limit);
    for (const r of upcoming) {
      await this.prewarmScript(r).catch(() => {});
    }
  },
};
