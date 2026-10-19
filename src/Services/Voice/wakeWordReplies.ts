// Predefined wake reply templates

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
  {
    id: 'reply_8',
    triggerPhrase: 'Hey Regius',
    reply: 'Hey! How can I help you?',
  },
  {
    id: 'reply_9',
    triggerPhrase: 'Hey Regius',
    reply: "I'm listening, what can I do for you?",
  },
  {
    id: 'reply_10',
    triggerPhrase: 'Hey Regius',
    reply: 'At your service, what do you need?',
  },
];

let currentIndex = 0;

export const WakeWordRepliesService = {
  replies: [...DEFAULT_PREDEFINED_REPLIES],

  // Pick next wake reply by policy (random or rotation)
  getNextReply(
    policy: ReplySelectionPolicy = 'random',
    assistantName?: string,
  ): string {
    if (this.replies.length === 0) {
      return "I'm listening. How can I help you?";
    }

    let selectedText = '';
    if (policy === 'rotation') {
      const selected = this.replies[currentIndex % this.replies.length];
      currentIndex = (currentIndex + 1) % this.replies.length;
      selectedText = selected.reply;
    } else {
      // Default: random selection
      const index = Math.floor(Math.random() * this.replies.length);
      selectedText = this.replies[index].reply;
    }

    if (assistantName && assistantName.toLowerCase() !== 'regius') {
      return selectedText.replace(/\bRegius\b/gi, assistantName);
    }
    return selectedText;
  },

  getAllReplies(): WakeWordReplyConfig[] {
    return [...this.replies];
  },

  addReply(
    replyText: string,
    triggerPhrase: string = 'Hey Regius',
  ): WakeWordReplyConfig {
    const newReply: WakeWordReplyConfig = {
      id: `reply_${Date.now()}`,
      triggerPhrase,
      reply: replyText.trim(),
    };
    this.replies.push(newReply);
    return newReply;
  },
};
