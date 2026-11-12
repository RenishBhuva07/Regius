import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { HelpCircle } from 'lucide-react-native';
import { Fonts } from '../../../../Theme/fonts';
import { Colors } from '../../../../Assets/StyleUtilities/Colors';
import { VoiceAssistantTheme } from './types';
import { PendingClarification } from '../../../../Services/Voice/VoiceTypes';
import ResponsivePixels from '../../../../Assets/StyleUtilities/ResponsivePixels';

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
              backgroundColor: theme.isDarkMode
                ? Colors.VoicePromptDarkBg
                : Colors.VoicePromptSurface,
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
          <HelpCircle size={ResponsivePixels.size15} color={Colors.PureWhite} strokeWidth={2.4} />
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
    paddingVertical: ResponsivePixels.size10,
    paddingHorizontal: ResponsivePixels.size8,
    width: '100%',
    alignItems: 'center',
  },
  contextTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ResponsivePixels.size6,
    paddingHorizontal: ResponsivePixels.size12,
    paddingVertical: ResponsivePixels.size5,
    borderRadius: ResponsivePixels.size14,
    marginBottom: ResponsivePixels.size12,
  },
  contextLabel: {
    fontFamily: Fonts.poppins.medium,
    fontSize: ResponsivePixels.size11,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  contextText: {
    fontFamily: Fonts.poppins.regular,
    fontSize: ResponsivePixels.size12,
    maxWidth: ResponsivePixels.size240,
  },
  questionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ResponsivePixels.size10,
    marginVertical: ResponsivePixels.size4,
    paddingHorizontal: ResponsivePixels.size12,
  },
  iconBubble: {
    width: ResponsivePixels.size28,
    height: ResponsivePixels.size28,
    borderRadius: ResponsivePixels.size14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  questionText: {
    fontFamily: Fonts.ranade.medium,
    fontSize: ResponsivePixels.size16,
    lineHeight: ResponsivePixels.size22,
    flexShrink: 1,
  },
  instructionHint: {
    fontFamily: Fonts.poppins.regular,
    fontSize: ResponsivePixels.size12,
    marginTop: ResponsivePixels.size10,
  },
});
