import { VoiceAssistantState } from '../../../../Services/Voice/VoiceStateMachine';
import { PendingClarification } from '../../../../Services/Voice/VoiceTypes';

export type AssistantVisualState =
  | VoiceAssistantState
  | 'IDLE'
  | 'SPEAKING'
  | 'LISTENING'
  | 'PROCESSING'
  | 'CONFIRMED';

export function normalizeAssistantState(
  state?: AssistantVisualState,
): VoiceAssistantState {
  if (!state) return 'listening';
  switch (state) {
    case 'IDLE':
      return 'idle';
    case 'LISTENING':
      return 'listening';
    case 'PROCESSING':
      return 'processing';
    case 'SPEAKING':
      return 'speaking';
    case 'CONFIRMED':
      return 'success';
    default:
      return state;
  }
}

export interface VoiceAssistantTheme {
  isDarkMode: boolean;
  background: string;
  cardBg: string;
  cardBorder: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  accent: string;
  success: string;
  warning: string;
  error: string;
}

export interface VoiceAssistantSheetProps {
  visible: boolean;
  onClose: () => void;
  onActionSelected?: (actionType: string) => void;
  assistantState?: AssistantVisualState;
  assistantName?: string;
  wakeWordPhrase?: string;
  greetingText?: string | null;
  activeVoiceName?: string | null;
  liveTranscript?: string | null;
  lastSpokenCommand?: string | null;
  confirmedActionTitle?: string | null;
  confirmedActionBody?: string | null;
  resultSummary?: string | null;
  spokenResponseText?: string | null;
  pendingClarification?: PendingClarification | null;
  errorMessage?: string | null;
  speechFailed?: boolean;
  audioLevel?: number;
  onMicPress?: () => void;
  onRetrySpeech?: () => void;
  onInterruptSpeech?: () => void;
  // Backward compatibility props
  assistantReply?: string | null;
  isSpeaking?: boolean;
  isListening?: boolean;
}
