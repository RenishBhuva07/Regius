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
import { Colors } from '../../../../Assets/StyleUtilities/Colors';
import { VoiceAssistantTheme } from './types';
import ResponsivePixels from '../../../../Assets/StyleUtilities/ResponsivePixels';

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
          <Square size={ResponsivePixels.size13} color={theme.background} fill={theme.background} />
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
              backgroundColor: theme.isDarkMode
                ? Colors.VoiceControlDarkBg
                : Colors.VoiceControlCream,
              opacity: pressed ? 0.75 : 1,
            },
          ]}
          accessibilityRole="button"
          accessibilityLabel="Replay response"
        >
          <RotateCcw size={ResponsivePixels.size16} color={theme.textPrimary} />
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
    gap: ResponsivePixels.size12,
    width: '100%',
    paddingVertical: ResponsivePixels.size8,
  },
  interruptBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ResponsivePixels.size8,
    paddingHorizontal: ResponsivePixels.size20,
    paddingVertical: ResponsivePixels.size12,
    borderRadius: ResponsivePixels.size24,
    ...Platform.select({
      ios: {
        shadowColor: Colors.PureBlack,
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
    fontSize: ResponsivePixels.size13,
    letterSpacing: 0.2,
  },
  replayBtn: {
    width: ResponsivePixels.size42,
    height: ResponsivePixels.size42,
    borderRadius: ResponsivePixels.size21,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
