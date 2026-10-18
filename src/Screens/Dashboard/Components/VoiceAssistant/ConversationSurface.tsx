import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Fonts } from '../../../../Theme/fonts';
import { VoiceAssistantTheme } from './types';
import { VoiceAssistantState } from '../../../../Services/Voice/VoiceStateMachine';
import { PendingClarification } from '../../../../Services/Voice/VoiceTypes';
import { ClarificationPrompt } from './ClarificationPrompt';
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

const QUICK_SUGGESTIONS = [
  'Play badminton today at 5 PM',
  'Remind me to call Mom',
  'Log 20-min meditation',
  'Add 15 min focus time',
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

  // 1. Resolve Primary Conversational Headline
  let headlineText = "Hey, I'm ready.";
  let supportingText: string | null = 'What would you like to get done?';

  if (isGreeting) {
    headlineText = greetingText || `Hey, I'm ${assistantName}.`;
    supportingText = activeVoiceName
      ? `Voice: ${activeVoiceName}`
      : 'Ready when you are.';
  } else if (isListening) {
    if (liveTranscript && liveTranscript.trim().length > 0) {
      headlineText = `“${liveTranscript.trim()}”`;
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
        /* Unified Conversational Text Block */
        <View style={styles.textBlock}>
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
                    ? 'rgba(52, 211, 153, 0.12)'
                    : 'rgba(5, 150, 105, 0.08)',
                  borderColor: theme.isDarkMode
                    ? 'rgba(52, 211, 153, 0.28)'
                    : 'rgba(5, 150, 105, 0.2)',
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
                {QUICK_SUGGESTIONS.map((item, idx) => (
                  <Pressable
                    key={idx}
                    onPress={() => onSelectSuggestion(item)}
                    style={({ pressed }) => [
                      styles.suggestionPill,
                      {
                        backgroundColor: theme.isDarkMode
                          ? 'rgba(255, 255, 255, 0.07)'
                          : 'rgba(0, 0, 0, 0.04)',
                        borderColor: theme.cardBorder,
                        opacity: pressed ? 0.7 : 1,
                      },
                    ]}
                    accessibilityRole="button"
                    accessibilityLabel={`Suggestion: ${item}`}
                  >
                    <Text
                      style={[
                        styles.suggestionText,
                        { color: theme.textSecondary },
                      ]}
                      numberOfLines={1}
                    >
                      {item}
                    </Text>
                  </Pressable>
                ))}
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
    paddingHorizontal: 20,
    paddingTop: 4,
    paddingBottom: 8,
  },
  textBlock: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headline: {
    fontFamily: Fonts.bold,
    fontSize: 21,
    lineHeight: 27,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: -0.3,
    paddingHorizontal: 8,
  },
  supportingText: {
    fontFamily: Fonts.medium,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 6,
    maxWidth: '92%',
    paddingHorizontal: 8,
  },
  confirmationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    marginTop: 10,
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
    fontFamily: Fonts.bold,
    fontSize: 13,
    fontWeight: '600',
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
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 16,
    borderWidth: 1,
  },
  suggestionText: {
    fontFamily: Fonts.medium,
    fontSize: 12,
  },
});

export default ConversationSurface;
