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

  // Double concentric pulsing animated rings for active recording
  const pulseAnim1 = useRef(new Animated.Value(1)).current;
  const pulseOpacity1 = useRef(new Animated.Value(0.45)).current;
  const pulseAnim2 = useRef(new Animated.Value(1)).current;
  const pulseOpacity2 = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    if (isListening) {
      const ring1 = Animated.loop(
        Animated.parallel([
          Animated.sequence([
            Animated.timing(pulseAnim1, {
              toValue: 1.35,
              duration: 950,
              easing: Easing.out(Easing.ease),
              useNativeDriver: true,
            }),
            Animated.timing(pulseAnim1, {
              toValue: 1,
              duration: 250,
              easing: Easing.in(Easing.ease),
              useNativeDriver: true,
            }),
          ]),
          Animated.sequence([
            Animated.timing(pulseOpacity1, {
              toValue: 0,
              duration: 950,
              easing: Easing.out(Easing.ease),
              useNativeDriver: true,
            }),
            Animated.timing(pulseOpacity1, {
              toValue: 0.5,
              duration: 250,
              useNativeDriver: true,
            }),
          ]),
        ]),
      );

      const ring2 = Animated.loop(
        Animated.sequence([
          Animated.delay(200),
          Animated.parallel([
            Animated.sequence([
              Animated.timing(pulseAnim2, {
                toValue: 1.6,
                duration: 1100,
                easing: Easing.out(Easing.ease),
                useNativeDriver: true,
              }),
              Animated.timing(pulseAnim2, {
                toValue: 1,
                duration: 200,
                easing: Easing.in(Easing.ease),
                useNativeDriver: true,
              }),
            ]),
            Animated.sequence([
              Animated.timing(pulseOpacity2, {
                toValue: 0,
                duration: 1100,
                easing: Easing.out(Easing.ease),
                useNativeDriver: true,
              }),
              Animated.timing(pulseOpacity2, {
                toValue: 0.35,
                duration: 200,
                useNativeDriver: true,
              }),
            ]),
          ]),
        ]),
      );

      ring1.start();
      ring2.start();
      return () => {
        ring1.stop();
        ring2.stop();
        pulseAnim1.setValue(1);
        pulseOpacity1.setValue(0.45);
        pulseAnim2.setValue(1);
        pulseOpacity2.setValue(0.3);
      };
    } else {
      pulseAnim1.setValue(1);
      pulseOpacity1.setValue(0.45);
      pulseAnim2.setValue(1);
      pulseOpacity2.setValue(0.3);
    }
  }, [isListening, pulseAnim1, pulseOpacity1, pulseAnim2, pulseOpacity2]);

  const secondaryBtnBg = theme.isDarkMode ? '#1E2228' : '#FFFFFF';
  const secondaryBorder = theme.isDarkMode
    ? 'rgba(255, 255, 255, 0.16)'
    : '#FFFFFF';
  const secondaryBottomBorder = theme.isDarkMode
    ? 'rgba(0, 0, 0, 0.5)'
    : '#D5D0C5';

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
      {/* 1. Left Secondary Action: 3D Tactile Suggestions Button */}
      <Pressable
        onPress={onToggleSuggestions}
        style={({ pressed }) => [
          styles.secondaryBtn,
          {
            backgroundColor: secondaryBtnBg,
            borderColor: secondaryBorder,
            borderBottomColor: secondaryBottomBorder,
            opacity: pressed ? 0.75 : 1,
            shadowColor: theme.isDarkMode ? '#000000' : '#8383D6',
          },
        ]}
        hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        accessibilityRole="button"
        accessibilityLabel="Suggestions and conversations"
      >
        <MessageSquare size={21} color={theme.textPrimary} strokeWidth={2.2} />
      </Pressable>

      {/* 2. Center Primary Action: Futuristic 3D Microphone Button */}
      <View style={styles.micWrapper}>
        {/* Double Active Recording Pulsing Rings */}
        {isListening ? (
          <>
            <Animated.View
              pointerEvents="none"
              style={[
                styles.pulseRingOuter,
                {
                  backgroundColor: theme.accent,
                  opacity: pulseOpacity2,
                  transform: [{ scale: pulseAnim2 }],
                },
              ]}
            />
            <Animated.View
              pointerEvents="none"
              style={[
                styles.pulseRingInner,
                {
                  backgroundColor: theme.accent,
                  opacity: pulseOpacity1,
                  transform: [{ scale: pulseAnim1 }],
                },
              ]}
            />
          </>
        ) : null}

        <Pressable
          onPress={isThinking ? undefined : onMicPress}
          disabled={isThinking}
          style={({ pressed }) => [
            styles.micBtn,
            {
              backgroundColor: micBg,
              shadowColor: micBg,
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

      {/* 3. Right Secondary Action: 3D Tactile Close Assistant */}
      <Pressable
        onPress={onClose}
        style={({ pressed }) => [
          styles.secondaryBtn,
          {
            backgroundColor: secondaryBtnBg,
            borderColor: secondaryBorder,
            borderBottomColor: secondaryBottomBorder,
            opacity: pressed ? 0.75 : 1,
            shadowColor: theme.isDarkMode ? '#000000' : '#8383D6',
          },
        ]}
        hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        accessibilityRole="button"
        accessibilityLabel="Dismiss voice assistant"
      >
        <X size={21} color={theme.textPrimary} strokeWidth={2.4} />
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
    borderWidth: 1.2,
    borderBottomWidth: 2.6,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 2.5 },
    shadowOpacity: 0.14,
    shadowRadius: 5,
    elevation: 3.5,
  },
  micWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 88,
    height: 88,
  },
  pulseRingOuter: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  pulseRingInner: {
    position: 'absolute',
    width: 72,
    height: 72,
    borderRadius: 36,
  },
  micBtn: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.45)',
    borderBottomWidth: 4,
    borderBottomColor: 'rgba(0, 0, 0, 0.28)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.38,
    shadowRadius: 14,
    elevation: 8,
  },
});

export default VoiceInputControls;
