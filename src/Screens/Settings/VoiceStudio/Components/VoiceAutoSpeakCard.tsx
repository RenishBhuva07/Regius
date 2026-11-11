import React from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';
import { Fonts } from '../../../../Theme/fonts';
import { Colors } from '../../../../Assets/StyleUtilities/Colors';
import { useTheme } from '../../../../Theme/ThemeContext';

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
    textPrimary = Colors.PureBlack,
    textSecondary = Colors.SubtitleGray,
  }) => {
    const { Colors: themeColors } = useTheme();
    const themeAccent = themeColors.Accent || Colors.LavenderPurple;

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
            false: isDarkMode ? Colors.DarkSoftLinen : Colors.FogGrey,
            true: themeAccent,
          }}
          thumbColor={Colors.PureWhite}
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
