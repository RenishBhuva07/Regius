import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Fonts } from '../../../../Theme/fonts';
import { VoiceAssistantTheme } from './types';
import { VoiceAssistantState } from '../../../../Services/Voice/VoiceStateMachine';

export interface AssistantStatusProps {
  state: VoiceAssistantState;
  assistantName: string;
  confirmedActionTitle?: string | null;
  errorMessage?: string | null;
  theme: VoiceAssistantTheme;
}

export const AssistantStatus: React.FC<AssistantStatusProps> = ({
  state,
  assistantName,
  confirmedActionTitle,
  errorMessage,
  theme,
}) => {
  let headline = 'What would you like to get done?';
  let subtitle = 'Speak naturally or tap the microphone to start.';

  switch (state) {
    case 'idle':
      headline = 'What would you like to get done?';
      subtitle = 'Speak naturally or tap the microphone to start.';
      break;

    case 'requestingPermission':
      headline = 'Microphone Access Required';
      subtitle = 'Please grant permission to use voice commands.';
      break;

    case 'wakeWordDetected':
      headline = `${assistantName} is ready`;
      subtitle = 'Listening for your command...';
      break;

    case 'greeting':
      headline = 'Connecting…';
      subtitle = 'Preparing voice assistant...';
      break;

    case 'listening':
      headline = "I'm listening";
      subtitle = 'Speak your command, then pause when finished.';
      break;

    case 'processing':
    case 'processingTranscript':
    case 'understanding':
      headline = 'Working on that…';
      subtitle = 'Understanding your request...';
      break;

    case 'executing':
    case 'executingAction':
      headline = 'Taking care of it…';
      subtitle = confirmedActionTitle || 'Applying updates...';
      break;

    case 'speaking':
    case 'responding':
      headline = `${assistantName} is speaking`;
      subtitle = 'Tap interrupt to speak again.';
      break;

    case 'awaitingClarification':
      headline = 'Just a quick question';
      subtitle = 'Please clarify the missing detail.';
      break;

    case 'awaiting_follow_up':
      headline = 'Anything else?';
      subtitle = "Say 'No' or 'That's all' if you are finished.";
      break;

    case 'awaiting_confirmation':
      headline = 'Please confirm';
      subtitle = 'Say Yes to proceed or No to cancel.';
      break;

    case 'success':
    case 'completed':
      headline = confirmedActionTitle || 'Task completed';
      subtitle = 'All changes have been saved to your schedule.';
      break;

    case 'unrecognized':
      headline = "I didn't quite catch that";
      subtitle = 'Could you please say it another way?';
      break;

    case 'error':
      headline = confirmedActionTitle || 'Unable to complete';
      subtitle = errorMessage || 'Something went wrong. Please try again.';
      break;

    case 'closing':
      headline = 'Goodbye';
      subtitle = "I'm here whenever you need me.";
      break;
  }

  return (
    <View style={styles.container}>
      <Text
        style={[styles.headline, { color: theme.textPrimary }]}
        numberOfLines={2}
        accessibilityRole="header"
      >
        {headline}
      </Text>
      <Text
        style={[styles.subtitle, { color: theme.textSecondary }]}
        numberOfLines={2}
      >
        {subtitle}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingHorizontal: 24,
    marginVertical: 12,
  },
  headline: {
    fontFamily: Fonts.ranade.bold,
    fontSize: 22,
    lineHeight: 28,
    textAlign: 'center',
    letterSpacing: -0.3,
    marginBottom: 6,
  },
  subtitle: {
    fontFamily: Fonts.poppins.regular,
    fontSize: 13,
    lineHeight: 19,
    textAlign: 'center',
  },
});
