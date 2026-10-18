import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AlertCircle, HelpCircle } from 'lucide-react-native';
import { Fonts } from '../../../../Theme/fonts';
import { VoiceAssistantTheme } from './types';

export interface ErrorRecoveryProps {
  isUnrecognized?: boolean;
  errorMessage?: string | null;
  heardTranscript?: string | null;
  theme: VoiceAssistantTheme;
}

export const ErrorRecovery: React.FC<ErrorRecoveryProps> = ({
  isUnrecognized = false,
  errorMessage,
  heardTranscript,
  theme,
}) => {
  const iconColor = isUnrecognized ? theme.warning : theme.error;
  const message = isUnrecognized
    ? "I didn't quite catch that. Could you say it another way?"
    : errorMessage || 'An unexpected issue occurred. Please try again.';

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.iconBadge,
          {
            backgroundColor: theme.isDarkMode ? '#272018' : '#FEF3C7',
          },
        ]}
      >
        {isUnrecognized ? (
          <HelpCircle size={20} color={iconColor} strokeWidth={2.4} />
        ) : (
          <AlertCircle size={20} color={iconColor} strokeWidth={2.4} />
        )}
      </View>

      <Text
        style={[styles.messageText, { color: theme.textPrimary }]}
        accessibilityRole="alert"
      >
        {message}
      </Text>

      {heardTranscript ? (
        <View
          style={[
            styles.heardBubble,
            {
              backgroundColor: theme.isDarkMode ? '#22262E' : '#F3F1EC',
            },
          ]}
        >
          <Text style={[styles.heardLabel, { color: theme.textMuted }]}>
            Heard:
          </Text>
          <Text
            style={[styles.heardText, { color: theme.textSecondary }]}
            numberOfLines={2}
          >
            &ldquo;{heardTranscript}&rdquo;
          </Text>
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    width: '100%',
  },
  iconBadge: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  messageText: {
    fontFamily: Fonts.ranade.medium,
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
    maxWidth: 290,
  },
  heardBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    marginTop: 12,
  },
  heardLabel: {
    fontFamily: Fonts.poppins.medium,
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  heardText: {
    fontFamily: Fonts.poppins.regular,
    fontSize: 12,
    maxWidth: 220,
  },
});
