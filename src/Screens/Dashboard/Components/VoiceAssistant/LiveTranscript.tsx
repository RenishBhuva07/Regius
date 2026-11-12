import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Fonts } from '../../../../Theme/fonts';
import { VoiceAssistantTheme } from './types';
import ResponsivePixels from '../../../../Assets/StyleUtilities/ResponsivePixels';

export interface LiveTranscriptProps {
  transcript: string;
  theme: VoiceAssistantTheme;
}

export const LiveTranscript: React.FC<LiveTranscriptProps> = ({
  transcript,
  theme,
}) => {
  return (
    <View style={styles.container}>
      <Text
        style={[styles.transcriptText, { color: theme.textPrimary }]}
        accessibilityLiveRegion="polite"
      >
        &ldquo;{transcript}&hellip;&rdquo;
      </Text>
      <Text style={[styles.hintText, { color: theme.textMuted }]}>
        Listening in real time&hellip;
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: ResponsivePixels.size12,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  transcriptText: {
    fontFamily: Fonts.poppins.medium,
    fontSize: ResponsivePixels.size17,
    lineHeight: ResponsivePixels.size25,
    textAlign: 'center',
    letterSpacing: -0.2,
  },
  hintText: {
    fontFamily: Fonts.poppins.regular,
    fontSize: ResponsivePixels.size12,
    marginTop: ResponsivePixels.size8,
    textAlign: 'center',
  },
});
