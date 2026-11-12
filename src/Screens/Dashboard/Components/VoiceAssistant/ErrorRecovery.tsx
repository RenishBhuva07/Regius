import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AlertCircle, HelpCircle } from 'lucide-react-native';
import { Fonts } from '../../../../Theme/fonts';
import { Colors } from '../../../../Assets/StyleUtilities/Colors';
import { VoiceAssistantTheme } from './types';
import ResponsivePixels from '../../../../Assets/StyleUtilities/ResponsivePixels';

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
            backgroundColor: theme.isDarkMode
              ? Colors.VoiceWarningDarkBg
              : Colors.ToastWarningBadgeBgLight,
          },
        ]}
      >
        {isUnrecognized ? (
          <HelpCircle size={ResponsivePixels.size20} color={iconColor} strokeWidth={2.4} />
        ) : (
          <AlertCircle size={ResponsivePixels.size20} color={iconColor} strokeWidth={2.4} />
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
              backgroundColor: theme.isDarkMode
                ? Colors.VoiceControlDarkBg
                : Colors.VoiceSurfaceMuted,
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
    paddingVertical: ResponsivePixels.size14,
    paddingHorizontal: ResponsivePixels.size16,
    width: '100%',
  },
  iconBadge: {
    width: ResponsivePixels.size38,
    height: ResponsivePixels.size38,
    borderRadius: ResponsivePixels.size19,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: ResponsivePixels.size10,
  },
  messageText: {
    fontFamily: Fonts.ranade.medium,
    fontSize: ResponsivePixels.size15,
    lineHeight: ResponsivePixels.size22,
    textAlign: 'center',
    maxWidth: ResponsivePixels.size290,
  },
  heardBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ResponsivePixels.size6,
    paddingHorizontal: ResponsivePixels.size12,
    paddingVertical: ResponsivePixels.size6,
    borderRadius: ResponsivePixels.size14,
    marginTop: ResponsivePixels.size12,
  },
  heardLabel: {
    fontFamily: Fonts.poppins.medium,
    fontSize: ResponsivePixels.size11,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  heardText: {
    fontFamily: Fonts.poppins.regular,
    fontSize: ResponsivePixels.size12,
    maxWidth: ResponsivePixels.size220,
  },
});
