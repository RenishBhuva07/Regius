/**
 * Typed configuration for predefined replies to "Hey Regius".
 * Predefined items are dynamic text strings that Kokoro synthesizes at runtime
 * using the user's selected voice.
 */

export interface WakeWordReplyConfig {
  id: string;
  triggerPhrase: string;
  reply: string;
}

export type ReplySelectionPolicy = 'rotation' | 'random';

export const DEFAULT_PREDEFINED_REPLIES: WakeWordReplyConfig[] = [
  {
    id: 'reply_1',
    triggerPhrase: 'Hey Regius',
    reply: "Hey there! I'm listening. What can I help you with?",
  },
  {
    id: 'reply_2',
    triggerPhrase: 'Hey Regius',
    reply: "I'm here. What would you like me to do?",
  },
  {
    id: 'reply_3',
    triggerPhrase: 'Hey Regius',
    reply: 'Hey! Ready when you are.',
  },
  {
    id: 'reply_4',
    triggerPhrase: 'Hey Regius',
    reply: "Yes, I'm listening. Tell me what's on your mind.",
  },
  {
    id: 'reply_5',
    triggerPhrase: 'Hey Regius',
    reply: "Uh-huh? I'm listening.",
  },
  {
    id: 'reply_6',
    triggerPhrase: 'Hey Regius',
    reply: 'Regius here, ready when you are.',
  },
  {
    id: 'reply_7',
    triggerPhrase: 'Hey Regius',
    reply: 'Yes, how can I assist you?',
  },
];

let currentIndex = 0;

export const WakeWordRepliesService = {
  replies: [...DEFAULT_PREDEFINED_REPLIES],

  /**
   * Retrieves a reply according to the configured selection policy.
   */
  getNextReply(policy: ReplySelectionPolicy = 'random'): string {
    if (this.replies.length === 0) {
      return "I'm listening. How can I help you?";
    }

    if (policy === 'rotation') {
      const selected = this.replies[currentIndex % this.replies.length];
      currentIndex = (currentIndex + 1) % this.replies.length;
      return selected.reply;
    }

    // Default: random selection
    const index = Math.floor(Math.random() * this.replies.length);
    return this.replies[index].reply;
  },

  getAllReplies(): WakeWordReplyConfig[] {
    return [...this.replies];
  },

  addReply(replyText: string, triggerPhrase: string = 'Hey Regius'): WakeWordReplyConfig {
    const newReply: WakeWordReplyConfig = {
      id: `reply_${Date.now()}`,
      triggerPhrase,
      reply: replyText.trim(),
    };
    this.replies.push(newReply);
    return newReply;
  },
};
