import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Platform,
} from 'react-native';
import { Square, RotateCcw } from 'lucide-react-native';
import { Fonts } from '../../../../Theme/fonts';
import { VoiceAssistantTheme } from './types';

export interface AudioPlaybackControlsProps {
  onInterrupt?: () => void;
  onReplay?: () => void;
  theme: VoiceAssistantTheme;
}

export const AudioPlaybackControls: React.FC<AudioPlaybackControlsProps> = ({
  onInterrupt,
  onReplay,
  theme,
}) => {
  return (
    <View style={styles.container}>
      {/* Primary Interrupt & Speak action */}
      {onInterrupt ? (
        <Pressable
          onPress={onInterrupt}
          style={({ pressed }) => [
            styles.interruptBtn,
            { backgroundColor: theme.textPrimary, opacity: pressed ? 0.85 : 1 },
          ]}
          accessibilityRole="button"
          accessibilityLabel="Interrupt speech and start speaking"
        >
          <Square size={13} color={theme.background} fill={theme.background} />
          <Text style={[styles.interruptText, { color: theme.background }]}>
            Interrupt &amp; Speak
          </Text>
        </Pressable>
      ) : null}

      {/* Subtle Replay Audio button */}
      {onReplay ? (
        <Pressable
          onPress={onReplay}
          style={({ pressed }) => [
            styles.replayBtn,
            {
              backgroundColor: theme.isDarkMode ? '#22262E' : '#EFECE6',
              opacity: pressed ? 0.75 : 1,
            },
          ]}
          accessibilityRole="button"
          accessibilityLabel="Replay response"
        >
          <RotateCcw size={16} color={theme.textPrimary} />
        </Pressable>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    width: '100%',
    paddingVertical: 8,
  },
  interruptBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.12,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  interruptText: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: 13,
    letterSpacing: 0.2,
  },
  replayBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
