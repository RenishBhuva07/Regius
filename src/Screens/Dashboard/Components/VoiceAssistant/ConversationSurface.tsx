import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Fonts } from '../../../../Theme/fonts';
import { VoiceAssistantTheme } from './types';
import { VoiceAssistantState } from '../../../../Services/Voice/VoiceStateMachine';
import { PendingClarification } from '../../../../Services/Voice/VoiceTypes';
import { ClarificationPrompt } from './ClarificationPrompt';
import { Badge, BadgeVariant } from '../../../../Common/Badge';
import { VoiceWaveVisualizer } from './VoiceWaveVisualizer';
import { Check } from 'lucide-react-native';

export interface ConversationSurfaceProps {
  state: VoiceAssistantState;
  assistantName: string;
  liveTranscript?: string | null;
  lastSpokenCommand?: string | null;
  confirmedActionTitle?: string | null;
  confirmedActionBody?: string | null;
  resultSummary?: string | null;
  spokenResponseText?: string | null;
  greetingText?: string | null;
  activeVoiceName?: string | null;
  pendingClarification?: PendingClarification | null;
  errorMessage?: string | null;
  theme: VoiceAssistantTheme;
  showSuggestions?: boolean;
  onSelectSuggestion?: (command: string) => void;
}

interface SuggestionItem {
  label: string;
  category: 'task' | 'reminder' | 'habit' | 'focus';
  symbol: string;
}

const QUICK_SUGGESTIONS: SuggestionItem[] = [
  { label: 'Play badminton today at 5 PM', category: 'task', symbol: '⚡' },
  { label: 'Remind me to call Mom', category: 'reminder', symbol: '⏰' },
  { label: 'Log 20-min meditation', category: 'habit', symbol: '💜' },
  { label: 'Add 15 min focus time', category: 'focus', symbol: '🎯' },
];

function getConfirmationBadgeText(title?: string | null): string {
  if (!title) return 'Action Completed';
  const lower = title.toLowerCase();
  if (lower.includes('reminder')) return 'Reminder Scheduled';
  if (lower.includes('habit')) return 'Habit Logged';
  if (lower.includes('task')) return 'Task Added';
  if (lower.includes('event') || lower.includes('schedule'))
    return 'Event Scheduled';
  if (lower.includes('focus')) return 'Focus Block Updated';
  return 'Confirmed';
}

function getStatusBadgeConfig(
  state: VoiceAssistantState,
  hasLiveTranscript: boolean,
): { label: string; variant: BadgeVariant } {
  switch (state) {
    case 'listening':
      return {
        label: hasLiveTranscript
          ? 'TRANSCRIPTION LIVE'
          : 'LISTENING • SPEAK NOW',
        variant: 'purple',
      };
    case 'processing':
    case 'processingTranscript':
    case 'understanding':
    case 'generatingResponse':
      return {
        label: 'SIA IS THINKING',
        variant: 'yellow',
      };
    case 'executing':
    case 'executingAction':
      return {
        label: 'APPLYING ACTION',
        variant: 'yellow',
      };
    case 'speaking':
    case 'responding':
      return {
        label: 'SIA IS SPEAKING',
        variant: 'purple',
      };
    case 'greeting':
    case 'wakeWordDetected':
      return {
        label: 'SIA NEURAL READY',
        variant: 'purple',
      };
    case 'success':
    case 'completed':
      return {
        label: 'ACTION CONFIRMED',
        variant: 'green',
      };
    case 'unrecognized':
      return {
        label: 'TRY AGAIN',
        variant: 'orange',
      };
    case 'error':
      return {
        label: 'NEEDS ATTENTION',
        variant: 'red',
      };
    default:
      return {
        label: 'SIA ASSISTANT',
        variant: 'neutral',
      };
  }
}

export const ConversationSurface: React.FC<ConversationSurfaceProps> = ({
  state,
  assistantName = 'Regius',
  liveTranscript,
  lastSpokenCommand,
  confirmedActionTitle,
  confirmedActionBody,
  resultSummary,
  spokenResponseText,
  greetingText,
  activeVoiceName,
  pendingClarification,
  errorMessage,
  theme,
  showSuggestions = false,
  onSelectSuggestion,
}) => {
  const isCompleted = state === 'completed' || state === 'success';
  const isUnrecognized = state === 'unrecognized';
  const isError = state === 'error';
  const isClarification = state === 'awaitingClarification';
  const isSpeaking = state === 'speaking' || state === 'responding';
  const isGreeting = state === 'greeting' || state === 'wakeWordDetected';
  const isListening = state === 'listening';
  const isThinking =
    state === 'processing' ||
    state === 'processingTranscript' ||
    state === 'understanding' ||
    state === 'executing' ||
    state === 'executingAction' ||
    state === 'generatingResponse';

  const hasLiveTranscript = Boolean(
    liveTranscript && liveTranscript.trim().length > 0,
  );
  const statusBadge = getStatusBadgeConfig(state, hasLiveTranscript);

  // 1. Resolve Primary Conversational Headline
  let headlineText = "Hey, I'm ready.";
  let supportingText: string | null = 'What would you like to get done?';

  if (isGreeting) {
    headlineText = greetingText || `Hey, I'm ${assistantName}.`;
    supportingText = activeVoiceName
      ? `Voice: ${activeVoiceName}`
      : 'Ready when you are.';
  } else if (isListening) {
    if (hasLiveTranscript) {
      headlineText = `“${liveTranscript!.trim()}”`;
      supportingText = 'Listening… pause when done.';
    } else {
      headlineText = "I'm listening.";
      supportingText = 'Speak naturally, then pause when you’re done.';
    }
  } else if (isThinking) {
    headlineText = 'Working on that…';
    supportingText = lastSpokenCommand
      ? `“${lastSpokenCommand}”`
      : 'Processing your request…';
  } else if (isSpeaking) {
    headlineText = spokenResponseText || greetingText || 'I am listening…';
    supportingText = activeVoiceName ? `Voice: ${activeVoiceName}` : null;
  } else if (isCompleted) {
    headlineText = confirmedActionTitle || 'Done!';
    supportingText = confirmedActionBody || resultSummary || null;
  } else if (isUnrecognized) {
    headlineText = "I didn't quite catch that.";
    supportingText = lastSpokenCommand
      ? `Heard: “${lastSpokenCommand}”`
      : 'Could you try again? Tap the mic to speak.';
  } else if (isError) {
    headlineText = 'Something went wrong.';
    supportingText = errorMessage || 'Tap the mic to try speaking again.';
  }

  return (
    <View style={styles.container}>
      {/* Interactive Clarification State */}
      {isClarification ? (
        <ClarificationPrompt
          clarification={pendingClarification}
          lastSpokenCommand={lastSpokenCommand}
          questionText={spokenResponseText}
          theme={theme}
        />
      ) : (
        /* Luxury Tactile Bento Capsule Card */
        <View
          style={[
            styles.capsuleCard,
            {
              backgroundColor: theme.isDarkMode
                ? 'rgba(27, 30, 36, 0.82)'
                : 'rgba(255, 255, 255, 0.88)',
              borderColor: theme.isDarkMode
                ? 'rgba(255, 255, 255, 0.12)'
                : 'rgba(131, 131, 214, 0.16)',
              shadowColor: theme.isDarkMode ? '#000000' : '#8383D6',
            },
          ]}
        >
          {/* Top Status 3D Tactile Badge */}
          <View style={styles.badgeRow}>
            <Badge
              label={statusBadge.label}
              variant={statusBadge.variant}
              size="md"
            />
          </View>

          {/* Dynamic Soundwave Equalizer (when listening or speaking) */}
          {isListening || isSpeaking ? (
            <VoiceWaveVisualizer
              isActive={true}
              isDarkMode={theme.isDarkMode}
            />
          ) : null}

          {/* Main Headline */}
          <Text
            style={[styles.headline, { color: theme.textPrimary }]}
            accessibilityRole="header"
          >
            {headlineText}
          </Text>

          {/* Supporting Instruction / Status */}
          {supportingText ? (
            <Text
              style={[styles.supportingText, { color: theme.textSecondary }]}
            >
              {supportingText}
            </Text>
          ) : null}

          {/* Action Confirmation Badge */}
          {isCompleted && (confirmedActionTitle || confirmedActionBody) ? (
            <View
              style={[
                styles.confirmationBadge,
                {
                  backgroundColor: theme.isDarkMode
                    ? 'rgba(52, 211, 153, 0.14)'
                    : 'rgba(5, 150, 105, 0.08)',
                  borderColor: theme.isDarkMode
                    ? 'rgba(52, 211, 153, 0.35)'
                    : 'rgba(5, 150, 105, 0.22)',
                },
              ]}
            >
              <View
                style={[styles.checkCircle, { backgroundColor: theme.success }]}
              >
                <Check size={12} color="#FFFFFF" strokeWidth={3} />
              </View>
              <Text
                style={[
                  styles.confirmationText,
                  { color: theme.isDarkMode ? '#34D399' : '#059669' },
                ]}
              >
                {getConfirmationBadgeText(confirmedActionTitle)}
              </Text>
            </View>
          ) : null}

          {/* Contextual Suggestions Chips */}
          {showSuggestions && onSelectSuggestion ? (
            <View style={styles.suggestionsContainer}>
              <View style={styles.suggestionsRow}>
                {QUICK_SUGGESTIONS.map((item, idx) => {
                  let pillBg = theme.isDarkMode
                    ? 'rgba(255, 255, 255, 0.07)'
                    : 'rgba(0, 0, 0, 0.04)';
                  let pillBorder = theme.cardBorder;
                  let pillText = theme.textSecondary;

                  if (item.category === 'task') {
                    pillBg = theme.isDarkMode
                      ? 'rgba(245, 197, 24, 0.12)'
                      : '#FFF8D0';
                    pillBorder = theme.isDarkMode
                      ? 'rgba(245, 197, 24, 0.3)'
                      : '#DEAA14';
                    pillText = theme.isDarkMode ? '#FBBF24' : '#B47804';
                  } else if (item.category === 'reminder') {
                    pillBg = theme.isDarkMode
                      ? 'rgba(16, 185, 129, 0.12)'
                      : '#E8FDF0';
                    pillBorder = theme.isDarkMode
                      ? 'rgba(16, 185, 129, 0.3)'
                      : '#82E8A6';
                    pillText = theme.isDarkMode ? '#34D399' : '#1B9A72';
                  } else if (item.category === 'habit') {
                    pillBg = theme.isDarkMode
                      ? 'rgba(131, 131, 214, 0.12)'
                      : '#EEF0FD';
                    pillBorder = theme.isDarkMode
                      ? 'rgba(131, 131, 214, 0.3)'
                      : '#B6BEF5';
                    pillText = theme.isDarkMode ? '#A78BFA' : '#8383D6';
                  } else if (item.category === 'focus') {
                    pillBg = theme.isDarkMode
                      ? 'rgba(255, 135, 114, 0.12)'
                      : '#FFF0DE';
                    pillBorder = theme.isDarkMode
                      ? 'rgba(255, 135, 114, 0.3)'
                      : '#FFB86B';
                    pillText = theme.isDarkMode ? '#FB7185' : '#E65100';
                  }

                  return (
                    <Pressable
                      key={idx}
                      onPress={() => onSelectSuggestion(item.label)}
                      style={({ pressed }) => [
                        styles.suggestionPill,
                        {
                          backgroundColor: pillBg,
                          borderColor: pillBorder,
                          opacity: pressed ? 0.72 : 1,
                        },
                      ]}
                      accessibilityRole="button"
                      accessibilityLabel={`Suggestion: ${item.label}`}
                    >
                      <Text style={styles.suggestionSymbol}>{item.symbol}</Text>
                      <Text
                        style={[styles.suggestionText, { color: pillText }]}
                        numberOfLines={1}
                      >
                        {item.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          ) : null}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingTop: 0,
    paddingBottom: 4,
  },
  capsuleCard: {
    width: '100%',
    maxWidth: 380,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 22,
    borderWidth: 1.4,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 3.5,
  },
  badgeRow: {
    marginBottom: 4,
    alignItems: 'center',
  },
  headline: {
    fontFamily: Fonts.ranade.bold,
    fontSize: 21,
    lineHeight: 26,
    textAlign: 'center',
    letterSpacing: -0.3,
    paddingHorizontal: 6,
    marginTop: 2,
  },
  supportingText: {
    fontFamily: Fonts.poppins.regular,
    fontSize: 13,
    lineHeight: 18,
    textAlign: 'center',
    marginTop: 4,
    maxWidth: '92%',
    paddingHorizontal: 6,
  },
  confirmationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1.2,
    marginTop: 12,
    gap: 8,
    maxWidth: '92%',
  },
  checkCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmationText: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: 13,
    flexShrink: 1,
  },
  suggestionsContainer: {
    width: '100%',
    marginTop: 16,
  },
  suggestionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
  },
  suggestionPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 18,
    borderWidth: 1,
    borderBottomWidth: 2,
    gap: 5,
  },
  suggestionSymbol: {
    fontSize: 12,
  },
  suggestionText: {
    fontFamily: Fonts.poppins.medium,
    fontSize: 12,
  },
});

export default ConversationSurface;
