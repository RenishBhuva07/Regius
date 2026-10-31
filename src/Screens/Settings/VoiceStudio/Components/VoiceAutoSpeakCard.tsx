import React from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';
import { Fonts } from '../../../../Theme/fonts';
import { Colors } from '../../../../Assets/StyleUtilities/Colors';

export interface VoiceAutoSpeakCardProps {
  autoSpeakReplies: boolean;
  onToggleAutoSpeak: (enabled: boolean) => void;
  isDarkMode?: boolean;
  textPrimary?: string;
  textSecondary?: string;
}

export const VoiceAutoSpeakCard: React.FC<VoiceAutoSpeakCardProps> = React.memo(
  ({
    autoSpeakReplies,
    onToggleAutoSpeak,
    isDarkMode = false,
    textPrimary = Colors.MidnightInkText,
    textSecondary = Colors.SubtitleGray,
  }) => {
    return (
      <View style={styles.toggleRow}>
        <View style={styles.toggleMeta}>
          <Text style={[styles.toggleTitle, { color: textPrimary }]}>
            Auto-Speak Assistant Replies
          </Text>
          <Text style={[styles.toggleSub, { color: textSecondary }]}>
            Spoken audio playback during conversational workflows
          </Text>
        </View>

        <Switch
          value={autoSpeakReplies}
          onValueChange={onToggleAutoSpeak}
          trackColor={{
            false: isDarkMode ? '#3A3F46' : '#D9D9D9',
            true: Colors.LavenderPurple,
          }}
          thumbColor="#FFFFFF"
        />
      </View>
    );
  },
);

const styles = StyleSheet.create({
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  toggleMeta: {
    flex: 1,
  },
  toggleTitle: {
    fontFamily: Fonts.poppins.bold,
    fontSize: 14,
    letterSpacing: -0.2,
  },
  toggleSub: {
    fontFamily: Fonts.poppins.regular,
    fontSize: 12,
    marginTop: 2,
    lineHeight: 16,
  },
});

export default VoiceAutoSpeakCard;
