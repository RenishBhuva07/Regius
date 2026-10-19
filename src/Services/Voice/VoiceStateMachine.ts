// Voice assistant state machine and valid state transitions

export type VoiceAssistantState =
  | 'idle'
  | 'requestingPermission'
  | 'listening'
  | 'processingTranscript'
  | 'understanding'
  | 'awaitingClarification'
  | 'executingAction'
  | 'responding'
  | 'completed'
  | 'unrecognized'
  | 'error'
  // Backward-compatible & granular aliases
  | 'processing'
  | 'speaking'
  | 'awaiting_follow_up'
  | 'awaiting_confirmation'
  | 'closing'
  | 'wakeWordDetected'
  | 'greeting'
  | 'executing'
  | 'generatingResponse'
  | 'success';

export const VALID_ASSISTANT_TRANSITIONS: Record<
  VoiceAssistantState,
  VoiceAssistantState[]
> = {
  idle: [
    'requestingPermission',
    'listening',
    'wakeWordDetected',
    'greeting',
    'processing',
    'processingTranscript',
    'speaking',
    'responding',
  ],
  requestingPermission: ['listening', 'idle', 'error'],
  listening: [
    'processingTranscript',
    'understanding',
    'processing',
    'generatingResponse',
    'speaking',
    'responding',
    'closing',
    'completed',
    'idle',
    'error',
  ],
  processingTranscript: [
    'understanding',
    'processing',
    'executingAction',
    'executing',
    'awaitingClarification',
    'awaiting_confirmation',
    'awaiting_follow_up',
    'responding',
    'speaking',
    'unrecognized',
    'error',
    'idle',
  ],
  understanding: [
    'executingAction',
    'executing',
    'awaitingClarification',
    'awaiting_confirmation',
    'awaiting_follow_up',
    'responding',
    'speaking',
    'unrecognized',
    'error',
    'idle',
  ],
  processing: [
    'executing',
    'executingAction',
    'understanding',
    'generatingResponse',
    'speaking',
    'responding',
    'awaiting_follow_up',
    'awaiting_confirmation',
    'awaitingClarification',
    'unrecognized',
    'closing',
    'completed',
    'listening',
    'idle',
    'error',
  ],
  executingAction: [
    'responding',
    'speaking',
    'completed',
    'success',
    'idle',
    'error',
  ],
  executing: [
    'generatingResponse',
    'speaking',
    'responding',
    'success',
    'completed',
    'idle',
    'error',
  ],
  generatingResponse: [
    'speaking',
    'responding',
    'listening',
    'awaiting_follow_up',
    'awaiting_confirmation',
    'awaitingClarification',
    'closing',
    'completed',
    'success',
    'unrecognized',
    'idle',
    'error',
  ],
  awaitingClarification: [
    'listening',
    'processingTranscript',
    'processing',
    'speaking',
    'responding',
    'closing',
    'completed',
    'idle',
    'error',
  ],
  awaiting_follow_up: [
    'listening',
    'processingTranscript',
    'processing',
    'speaking',
    'responding',
    'closing',
    'completed',
    'idle',
    'error',
  ],
  awaiting_confirmation: [
    'listening',
    'processingTranscript',
    'processing',
    'speaking',
    'responding',
    'executing',
    'executingAction',
    'closing',
    'completed',
    'idle',
    'error',
  ],
  speaking: [
    'listening',
    'awaiting_follow_up',
    'awaiting_confirmation',
    'awaitingClarification',
    'closing',
    'completed',
    'success',
    'unrecognized',
    'idle',
    'error',
  ],
  responding: [
    'listening',
    'awaiting_follow_up',
    'awaiting_confirmation',
    'awaitingClarification',
    'closing',
    'completed',
    'success',
    'unrecognized',
    'idle',
    'error',
  ],
  closing: ['speaking', 'responding', 'completed', 'idle', 'error'],
  completed: ['listening', 'idle', 'speaking', 'responding'],
  success: [
    'listening',
    'awaiting_follow_up',
    'idle',
    'generatingResponse',
    'speaking',
    'responding',
    'completed',
  ],
  unrecognized: ['listening', 'idle', 'speaking', 'responding'],
  error: [
    'listening',
    'idle',
    'generatingResponse',
    'speaking',
    'responding',
    'completed',
  ],
  wakeWordDetected: [
    'greeting',
    'speaking',
    'responding',
    'listening',
    'idle',
    'error',
  ],
  greeting: ['speaking', 'responding', 'listening', 'idle', 'error'],
};

export type StateChangeListener = (
  nextState: VoiceAssistantState,
  prevState: VoiceAssistantState,
  sessionId: string,
) => void;

export class VoiceStateMachine {
  private currentState: VoiceAssistantState = 'idle';
  private currentSessionId: string = '';
  private listeners: Set<StateChangeListener> = new Set();

  constructor(initialState: VoiceAssistantState = 'idle') {
    this.currentState = initialState;
  }

  public getState(): VoiceAssistantState {
    return this.currentState;
  }

  public getSessionId(): string {
    return this.currentSessionId;
  }

  public startNewSession(): string {
    this.currentSessionId = `vas_${Date.now()}_${Math.random()
      .toString(36)
      .substring(2, 7)}`;
    return this.currentSessionId;
  }

  public clearSession(): void {
    this.currentSessionId = '';
  }

  public canTransitionTo(nextState: VoiceAssistantState): boolean {
    if (this.currentState === nextState) return true;
    if (nextState === 'idle') return true; // Emergency or user-initiated reset is always valid
    const allowed = VALID_ASSISTANT_TRANSITIONS[this.currentState] || [];
    return allowed.includes(nextState);
  }

  public transitionTo(
    nextState: VoiceAssistantState,
    expectedSessionId?: string,
  ): boolean {
    if (
      expectedSessionId &&
      this.currentSessionId &&
      expectedSessionId !== this.currentSessionId
    ) {
      console.warn(
        `[VoiceStateMachine] Ignored state change to "${nextState}" due to stale sessionId: expected ${expectedSessionId}, current is ${this.currentSessionId}`,
      );
      return false;
    }

    if (this.currentState === nextState) {
      return true;
    }

    if (!this.canTransitionTo(nextState)) {
      console.warn(
        `[VoiceStateMachine] Rejected invalid transition from "${this.currentState}" to "${nextState}"`,
      );
      return false;
    }

    const prevState = this.currentState;
    this.currentState = nextState;
    console.log(
      `[VoiceStateMachine] Transitioned: ${prevState} -> ${nextState} (Session: ${
        this.currentSessionId || 'none'
      })`,
    );

    this.listeners.forEach(listener => {
      try {
        listener(nextState, prevState, this.currentSessionId);
      } catch (err) {
        console.warn('[VoiceStateMachine] Error in state listener:', err);
      }
    });

    return true;
  }

  public subscribe(listener: StateChangeListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  public reset(): void {
    this.clearSession();
    this.transitionTo('idle');
  }
}
