import React, { useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  Easing,
  AccessibilityInfo,
  Dimensions,
} from 'react-native';
import LottieView from 'lottie-react-native';
import CustomAnimation from '../../../Common/CustomAnimation';
import HolographAnimation from '../../../Assets/JsonAnimations/Holograph.json';
import { VoiceAssistantState } from '../../../Services/Voice/VoiceStateMachine';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
export const DEFAULT_HOLOGRAPHIC_ORB_SIZE = Math.min(
  Math.round(SCREEN_WIDTH * 1.2),
  Math.round(SCREEN_HEIGHT * 0.5),
  480,
);
// Holographic orb animation for the voice assistant
export interface SiaHolographicOrbProps {
  state: VoiceAssistantState;
  size?: number;
  onPress?: () => void;
  disabled?: boolean;
  lottieSource?: any;
  accentColor?: string;
  isDarkMode?: boolean;
}

export const SiaHolographicOrb: React.FC<SiaHolographicOrbProps> = ({
  state,
  size = DEFAULT_HOLOGRAPHIC_ORB_SIZE,
  onPress,
  disabled = false,
  lottieSource,
  accentColor = '#9D9BF0',
  isDarkMode = true,
}) => {
  const [reduceMotion, setReduceMotion] = React.useState(false);
  const lottieRef = useRef<LottieView>(null);

  // Organic breathing scale animation
  const breathAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0.4)).current;

  // Reduced motion check
  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled?.()
      .then(enabled => setReduceMotion(Boolean(enabled)))
      .catch(() => {});
  }, []);

  const isThinking =
    state === 'processing' ||
    state === 'processingTranscript' ||
    state === 'understanding' ||
    state === 'generatingResponse';
  const isExecuting = state === 'executing' || state === 'executingAction';
  const isListening = state === 'listening';
  const isSpeaking = state === 'speaking' || state === 'responding';
  const isSuccess = state === 'success' || state === 'completed';
  const isError = state === 'error';
  const isGreeting = state === 'greeting' || state === 'wakeWordDetected';

  // Coordinate Lottie playback speed with assistant state
  const lottieSpeed =
    isThinking || isExecuting
      ? 1.55
      : isListening
      ? 1.35
      : isSpeaking
      ? 1.25
      : isSuccess
      ? 0.9
      : isError
      ? 0.6
      : 1.0;

  // Play animation on mount and state change
  useEffect(() => {
    if (lottieRef.current) {
      lottieRef.current.play();
    }
  }, [state]);

  // Organic luminous breathing and atmospheric aura
  useEffect(() => {
    if (reduceMotion) return;

    let targetScale = 1.04;
    let targetGlow = 0.55;
    let duration = 1200;

    if (isThinking || isExecuting) {
      targetScale = 1.07;
      targetGlow = 0.8;
      duration = 650;
    } else if (isListening) {
      targetScale = 1.06;
      targetGlow = 0.9;
      duration = 850;
    } else if (isSpeaking) {
      targetScale = 1.05;
      targetGlow = 0.75;
      duration = 750;
    } else if (isGreeting) {
      targetScale = 1.04;
      targetGlow = 0.65;
      duration = 900;
    } else if (isSuccess) {
      targetScale = 1.02;
      targetGlow = 0.45;
      duration = 1400;
    }

    const pulseLoop = Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(breathAnim, {
            toValue: targetScale,
            duration,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(breathAnim, {
            toValue: 1,
            duration,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(glowAnim, {
            toValue: targetGlow,
            duration,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(glowAnim, {
            toValue: 0.35,
            duration,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
      ]),
    );
    pulseLoop.start();

    return () => {
      pulseLoop.stop();
      breathAnim.setValue(1);
      glowAnim.setValue(0.4);
    };
  }, [
    isThinking,
    isListening,
    isSpeaking,
    isGreeting,
    isSuccess,
    isExecuting,
    reduceMotion,
    breathAnim,
    glowAnim,
  ]);

  const glowSize = size * 1.12;

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <CustomAnimation
        ref={lottieRef}
        animationFile={lottieSource || HolographAnimation}
        autoPlay
        loop
        speed={lottieSpeed}
        animationStyle={{ width: size, height: size }}
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    alignSelf: 'center',
  },
  ambientGlow: {
    position: 'absolute',
    alignSelf: 'center',
  },
  animationWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  touchable: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default SiaHolographicOrb;
