import React, { useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  Pressable,
  Animated,
  Easing,
  ActivityIndicator,
} from 'react-native';
import { Mic, X, MessageSquare, Square, RotateCcw } from 'lucide-react-native';
import { VoiceAssistantTheme } from './types';
import { VoiceAssistantState } from '../../../../Services/Voice/VoiceStateMachine';

export interface VoiceInputControlsProps {
  state: VoiceAssistantState;
  onMicPress?: () => void;
  onClose?: () => void;
  onToggleSuggestions?: () => void;
  theme: VoiceAssistantTheme;
}

export const VoiceInputControls: React.FC<VoiceInputControlsProps> = ({
  state,
  onMicPress,
  onClose,
  onToggleSuggestions,
  theme,
}) => {
  const isListening = state === 'listening';
  const isThinking =
    state === 'processing' ||
    state === 'processingTranscript' ||
    state === 'understanding' ||
    state === 'executing' ||
    state === 'executingAction' ||
    state === 'generatingResponse';
  const isSpeaking =
    state === 'speaking' || state === 'responding' || state === 'greeting';
  const isCompleted = state === 'completed' || state === 'success';
  const isErrorOrUnrecognized = state === 'unrecognized' || state === 'error';

  // Pulsing animated ring for active recording
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const pulseOpacity = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    if (isListening) {
      const pulse = Animated.loop(
        Animated.parallel([
          Animated.sequence([
            Animated.timing(pulseAnim, {
              toValue: 1.3,
              duration: 1000,
              easing: Easing.out(Easing.ease),
              useNativeDriver: true,
            }),
            Animated.timing(pulseAnim, {
              toValue: 1,
              duration: 300,
              easing: Easing.in(Easing.ease),
              useNativeDriver: true,
            }),
          ]),
          Animated.sequence([
            Animated.timing(pulseOpacity, {
              toValue: 0,
              duration: 1000,
              easing: Easing.out(Easing.ease),
              useNativeDriver: true,
            }),
            Animated.timing(pulseOpacity, {
              toValue: 0.45,
              duration: 300,
              useNativeDriver: true,
            }),
          ]),
        ]),
      );
      pulse.start();
      return () => {
        pulse.stop();
        pulseAnim.setValue(1);
        pulseOpacity.setValue(0.4);
      };
    } else {
      pulseAnim.setValue(1);
      pulseOpacity.setValue(0.4);
    }
  }, [isListening, pulseAnim, pulseOpacity]);

  const secondaryBtnBg = theme.isDarkMode
    ? 'rgba(255, 255, 255, 0.08)'
    : 'rgba(0, 0, 0, 0.05)';
  const secondaryBorder = theme.isDarkMode
    ? 'rgba(255, 255, 255, 0.12)'
    : 'rgba(0, 0, 0, 0.08)';

  // Center Mic button background & icon
  let micBg = theme.accent;
  let micIcon = <Mic size={28} color="#FFFFFF" strokeWidth={2.4} />;
  let micLabel = 'Start speaking';

  if (isListening) {
    micBg = theme.accent;
    micIcon = <Mic size={28} color="#FFFFFF" strokeWidth={2.4} />;
    micLabel = 'Recording active. Tap to finish';
  } else if (isThinking) {
    micBg = theme.isDarkMode ? '#282C35' : '#E8E5DF';
    micIcon = <ActivityIndicator size="small" color={theme.accent} />;
    micLabel = 'Processing request';
  } else if (isSpeaking) {
    micBg = theme.isDarkMode ? '#3A2E4C' : '#EDE8F5';
    micIcon = <Square size={20} color={theme.accent} fill={theme.accent} />;
    micLabel = 'Interrupt speech';
  } else if (isErrorOrUnrecognized) {
    micBg = theme.accent;
    micIcon = <RotateCcw size={24} color="#FFFFFF" strokeWidth={2.4} />;
    micLabel = 'Retry speaking';
  } else if (isCompleted) {
    micBg = theme.accent;
    micIcon = <Mic size={26} color="#FFFFFF" strokeWidth={2.4} />;
    micLabel = 'Speak another command';
  }

  return (
    <View style={styles.dockContainer}>
      {/* 1. Left Secondary Action: Suggestions / Conversation */}
      <Pressable
        onPress={onToggleSuggestions}
        style={({ pressed }) => [
          styles.secondaryBtn,
          {
            backgroundColor: secondaryBtnBg,
            borderColor: secondaryBorder,
            opacity: pressed ? 0.75 : 1,
          },
        ]}
        hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        accessibilityRole="button"
        accessibilityLabel="Suggestions and conversations"
      >
        <MessageSquare size={22} color={theme.textPrimary} strokeWidth={2.2} />
      </Pressable>

      {/* 2. Center Primary Action: Futuristic Microphone Button */}
      <View style={styles.micWrapper}>
        {/* Active Recording Pulsing Ring */}
        {isListening ? (
          <Animated.View
            pointerEvents="none"
            style={[
              styles.pulseRing,
              {
                backgroundColor: theme.accent,
                opacity: pulseOpacity,
                transform: [{ scale: pulseAnim }],
              },
            ]}
          />
        ) : null}

        <Pressable
          onPress={isThinking ? undefined : onMicPress}
          disabled={isThinking}
          style={({ pressed }) => [
            styles.micBtn,
            {
              backgroundColor: micBg,
              opacity: pressed ? 0.85 : 1,
            },
          ]}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          accessibilityRole="button"
          accessibilityLabel={micLabel}
        >
          {micIcon}
        </Pressable>
      </View>

      {/* 3. Right Secondary Action: Close Assistant */}
      <Pressable
        onPress={onClose}
        style={({ pressed }) => [
          styles.secondaryBtn,
          {
            backgroundColor: secondaryBtnBg,
            borderColor: secondaryBorder,
            opacity: pressed ? 0.75 : 1,
          },
        ]}
        hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        accessibilityRole="button"
        accessibilityLabel="Dismiss voice assistant"
      >
        <X size={22} color={theme.textPrimary} strokeWidth={2.4} />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  dockContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    width: '100%',
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  secondaryBtn: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  micWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 84,
    height: 84,
  },
  pulseRing: {
    position: 'absolute',
    width: 72,
    height: 72,
    borderRadius: 36,
  },
  micBtn: {
    width: 70,
    height: 70,
    borderRadius: 35,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
});

export default VoiceInputControls;
