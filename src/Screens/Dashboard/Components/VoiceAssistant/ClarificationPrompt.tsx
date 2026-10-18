import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { HelpCircle } from 'lucide-react-native';
import { Fonts } from '../../../../Theme/fonts';
import { VoiceAssistantTheme } from './types';
import { PendingClarification } from '../../../../Services/Voice/VoiceTypes';

export interface ClarificationPromptProps {
  clarification?: PendingClarification | null;
  lastSpokenCommand?: string | null;
  questionText?: string | null;
  theme: VoiceAssistantTheme;
}

export const ClarificationPrompt: React.FC<ClarificationPromptProps> = ({
  clarification,
  lastSpokenCommand,
  questionText,
  theme,
}) => {
  const displayQuestion =
    questionText ||
    clarification?.question ||
    'Could you clarify the timing or details for this request?';

  const userIntent =
    lastSpokenCommand ||
    clarification?.collectedData?.title ||
    'Your request';

  return (
    <View style={styles.container}>
      {/* Context: User's original intent */}
      {userIntent ? (
        <View
          style={[
            styles.contextTag,
            {
              backgroundColor: theme.isDarkMode ? '#242832' : '#F1EFEA',
            },
          ]}
        >
          <Text style={[styles.contextLabel, { color: theme.textMuted }]}>
            Intent:
          </Text>
          <Text
            style={[styles.contextText, { color: theme.textSecondary }]}
            numberOfLines={1}
          >
            &ldquo;{userIntent}&rdquo;
          </Text>
        </View>
      ) : null}

      {/* Assistant Question Bubble */}
      <View style={styles.questionContainer}>
        <View
          style={[
            styles.iconBubble,
            { backgroundColor: theme.accent },
          ]}
        >
          <HelpCircle size={15} color="#FFFFFF" strokeWidth={2.4} />
        </View>
        <Text
          style={[styles.questionText, { color: theme.textPrimary }]}
          accessibilityRole="text"
        >
          {displayQuestion}
        </Text>
      </View>

      <Text style={[styles.instructionHint, { color: theme.textMuted }]}>
        Speak naturally to answer.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    paddingHorizontal: 8,
    width: '100%',
    alignItems: 'center',
  },
  contextTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 14,
    marginBottom: 12,
  },
  contextLabel: {
    fontFamily: Fonts.poppins.medium,
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  contextText: {
    fontFamily: Fonts.poppins.regular,
    fontSize: 12,
    maxWidth: 240,
  },
  questionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginVertical: 4,
    paddingHorizontal: 12,
  },
  iconBubble: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  questionText: {
    fontFamily: Fonts.ranade.medium,
    fontSize: 16,
    lineHeight: 22,
    flexShrink: 1,
  },
  instructionHint: {
    fontFamily: Fonts.poppins.regular,
    fontSize: 12,
    marginTop: 10,
  },
});
