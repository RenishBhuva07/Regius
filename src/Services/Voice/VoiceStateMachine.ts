/**
 * Strongly-typed Centralized State Machine for Regius Voice Assistant.
 * Coordinates all conversational phases: wake word detection, greeting,
 * speech recognition, parsing, command execution, and Kokoro speech playback.
 */

export type VoiceAssistantState =
  | 'idle'
  | 'wakeWordDetected'
  | 'greeting'
  | 'speaking'
  | 'listening'
  | 'processing'
  | 'executing'
  | 'generatingResponse'
  | 'success'
  | 'unrecognized'
  | 'error';

export const VALID_ASSISTANT_TRANSITIONS: Record<
  VoiceAssistantState,
  VoiceAssistantState[]
> = {
  idle: ['wakeWordDetected', 'greeting', 'listening', 'processing'],
  wakeWordDetected: ['greeting', 'speaking', 'idle', 'error'],
  greeting: ['speaking', 'listening', 'idle', 'error'],
  speaking: ['listening', 'success', 'unrecognized', 'idle', 'error'],
  listening: ['processing', 'idle', 'error'],
  processing: [
    'executing',
    'generatingResponse',
    'unrecognized',
    'listening',
    'idle',
    'error',
  ],
  executing: ['generatingResponse', 'speaking', 'success', 'idle', 'error'],
  generatingResponse: [
    'speaking',
    'listening',
    'success',
    'unrecognized',
    'idle',
    'error',
  ],
  success: ['listening', 'idle', 'generatingResponse', 'speaking'],
  unrecognized: ['listening', 'idle'],
  error: ['listening', 'idle', 'generatingResponse', 'speaking'],
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
    this.currentSessionId = `vas_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
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
      `[VoiceStateMachine] Transitioned: ${prevState} -> ${nextState} (Session: ${this.currentSessionId || 'none'})`,
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
