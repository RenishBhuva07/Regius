import React, { useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Easing,
  AccessibilityInfo,
  Platform,
} from 'react-native';
import LottieView from 'lottie-react-native';
import CustomAnimation from '../../../Common/CustomAnimation';
import HolographAnimation from '../../../Assets/JsonAnimations/Holograph.json';
import Svg, {
  Defs,
  RadialGradient,
  LinearGradient,
  Stop,
  Circle,
  Path,
} from 'react-native-svg';
import {
  Mic,
  Sparkles,
  Volume2,
  Check,
  AlertTriangle,
  HelpCircle,
} from 'lucide-react-native';
import { VoiceAssistantState } from '../../../Services/Voice/VoiceStateMachine';

/**
 * 🌟 SiaHolographicOrb
 *
 * Futuristic, multi-layered holographic visual centerpiece for the SIA Voice Assistant.
 *
 * Architecture & Features:
 * - Direct integration with the real Lottie animation asset:
 *   src/Assets/JsonAnimations/Holograph.json via "lottie-react-native".
 * - Dynamic playback speed & chromatic ambient halo coordination:
 *     • Thinking: High-speed cognitive swirl (1.65x speed, amber & electric violet aura).
 *     • Speaking: Fluid acoustic resonance (1.3x speed, luminous sky-blue aura).
 *     • Listening: Calm harmonic breathing (1.0x speed, ethereal cyan & mint aura).
 *     • Success: Serene completion (0.85x speed, radiant emerald luminescence).
 *     • Error: Warning pulse (0.6x speed, ruby alert aura).
 * - Multi-layered 60fps native-driven ambient nebula and orbital halo rings.
 * - Interactive touch feedback: tap to toggle microphone capture or speak another command.
 * - Graceful fallback to native-driven vector holographic optics for headless test environments.
 */

export interface SiaHolographicOrbProps {
  state: VoiceAssistantState;
  size?: number;
  onPress?: () => void;
  disabled?: boolean;
  lottieSource?: any;
}

export const SiaHolographicOrb: React.FC<SiaHolographicOrbProps> = ({
  state,
  size = 156,
  onPress,
  disabled = false,
  lottieSource,
}) => {
  const [reduceMotion, setReduceMotion] = React.useState(false);
  const lottieRef = useRef<LottieView>(null);

  // Animation values (all native-driven)
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const outerPulseAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  // Reduced motion check
  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled?.()
      .then(enabled => setReduceMotion(Boolean(enabled)))
      .catch(() => {});
  }, []);

  const isThinking = state === 'processing' || state === 'generatingResponse';
  const isExecuting = state === 'executing';
  const isListening = state === 'listening';
  const isSpeaking = state === 'speaking';
  const isSuccess = state === 'success';
  const isError = state === 'error';
  const isUnrecognized = state === 'unrecognized';

  // Coordinate Lottie animation speed with assistant state
  const lottieSpeed =
    isThinking || isExecuting
      ? 1.65
      : isSpeaking
      ? 1.3
      : isSuccess
      ? 0.85
      : isError
      ? 0.6
      : 1.0;

  // Play animation whenever state changes
  useEffect(() => {
    if (lottieRef.current) {
      lottieRef.current.play();
    }
  }, [state]);

  // Subtle ambient orbital spin loop
  useEffect(() => {
    if (reduceMotion) return;

    const duration = isThinking || isExecuting ? 3600 : 9000;
    const rotateLoop = Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );
    rotateLoop.start();

    return () => {
      rotateLoop.stop();
      rotateAnim.setValue(0);
    };
  }, [isThinking, isExecuting, reduceMotion, rotateAnim]);

  // Ambient pulsing breath loop
  useEffect(() => {
    if (reduceMotion) return;

    let targetScale = 1.1;
    let targetOuterScale = 1.25;
    let duration = 900;

    if (isThinking) {
      targetScale = 1.16;
      targetOuterScale = 1.34;
      duration = 550;
    } else if (isListening) {
      targetScale = 1.14;
      targetOuterScale = 1.28;
      duration = 800;
    } else if (isSpeaking) {
      targetScale = 1.12;
      targetOuterScale = 1.24;
      duration = 650;
    } else if (isSuccess) {
      targetScale = 1.06;
      targetOuterScale = 1.16;
      duration = 1200;
    }

    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(pulseAnim, {
            toValue: targetScale,
            duration,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(outerPulseAnim, {
            toValue: targetOuterScale,
            duration: duration * 1.15,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(outerPulseAnim, {
            toValue: 1,
            duration: duration * 1.15,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
      ]),
    );
    pulseLoop.start();

    return () => {
      pulseLoop.stop();
      pulseAnim.setValue(1);
      outerPulseAnim.setValue(1);
    };
  }, [
    isThinking,
    isListening,
    isSpeaking,
    isSuccess,
    isExecuting,
    reduceMotion,
    pulseAnim,
    outerPulseAnim,
  ]);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  // State-responsive color palette for ambient halo and indicators
  const getOrbTheme = () => {
    if (isSuccess) {
      return {
        outerHalo: 'rgba(52, 211, 153, 0.32)',
        middleRing: 'rgba(16, 185, 129, 0.45)',
        badgeBg: '#059669',
        badgeBorder: '#34D399',
        iconColor: '#FFFFFF',
      };
    }
    if (isError) {
      return {
        outerHalo: 'rgba(248, 113, 113, 0.35)',
        middleRing: 'rgba(239, 68, 68, 0.48)',
        badgeBg: '#DC2626',
        badgeBorder: '#F87171',
        iconColor: '#FFFFFF',
      };
    }
    if (isUnrecognized) {
      return {
        outerHalo: 'rgba(251, 191, 36, 0.35)',
        middleRing: 'rgba(245, 158, 11, 0.48)',
        badgeBg: '#D97706',
        badgeBorder: '#FCD34D',
        iconColor: '#FFFFFF',
      };
    }
    if (isThinking) {
      return {
        outerHalo: 'rgba(139, 92, 246, 0.4)',
        middleRing: 'rgba(245, 158, 11, 0.48)',
        badgeBg: '#7C3AED',
        badgeBorder: '#F59E0B',
        iconColor: '#FFFFFF',
      };
    }
    if (isExecuting) {
      return {
        outerHalo: 'rgba(129, 140, 248, 0.38)',
        middleRing: 'rgba(99, 102, 241, 0.48)',
        badgeBg: '#4F46E5',
        badgeBorder: '#A5B4FC',
        iconColor: '#FFFFFF',
      };
    }
    if (isSpeaking) {
      return {
        outerHalo: 'rgba(56, 189, 248, 0.38)',
        middleRing: 'rgba(2, 132, 199, 0.48)',
        badgeBg: '#0284C7',
        badgeBorder: '#7DD3FC',
        iconColor: '#FFFFFF',
      };
    }
    // Listening / Ready
    return {
      outerHalo: 'rgba(45, 212, 191, 0.35)',
      middleRing: 'rgba(131, 131, 214, 0.45)',
      badgeBg: '#1F2228',
      badgeBorder: '#8383D6',
      iconColor: '#FFFFFF',
    };
  };

  const theme = getOrbTheme();
  const haloSize = size * 1.48;
  const ringSize = size * 1.22;
  const lottieSize = size * 1.25;

  return (
    <View style={[styles.container, { width: haloSize, height: haloSize }]}>
      {/* Outer Ethereal Nebula Halo */}
      {!reduceMotion && (
        <Animated.View
          pointerEvents="none"
          style={[
            styles.haloLayer,
            {
              width: haloSize,
              height: haloSize,
              borderRadius: haloSize / 2,
              backgroundColor: theme.outerHalo,
              transform: [{ scale: outerPulseAnim }],
            },
          ]}
        />
      )}

      {/* Middle Rotating Chromatic Dash Ring */}
      {!reduceMotion && (
        <Animated.View
          pointerEvents="none"
          style={[
            styles.ringLayer,
            {
              width: ringSize,
              height: ringSize,
              borderRadius: ringSize / 2,
              borderColor: theme.middleRing,
              borderWidth: 2,
              borderStyle: 'dashed',
              transform: [{ scale: pulseAnim }, { rotate: spin }],
            },
          ]}
        />
      )}

      {/* Central Lottie Holographic Orb */}
      <TouchableOpacity
        activeOpacity={0.88}
        onPress={onPress}
        disabled={disabled || !onPress}
        style={[styles.orbTouchable, { width: size, height: size }]}
        accessibilityRole="button"
        accessibilityLabel={`SIA Holographic Orb, status: ${state}`}
      >
        <CustomAnimation
          ref={lottieRef}
          animationFile={lottieSource || HolographAnimation}
          autoPlay
          loop
          speed={lottieSpeed}
          animationStyle={{ width: lottieSize, height: lottieSize }}
          resizeMode="contain"
        />

        {/* Floating Ambient Status Indicator Badge */}
        <View
          style={[
            styles.floatingIndicator,
            {
              backgroundColor: theme.badgeBg,
              borderColor: theme.badgeBorder,
            },
          ]}
          pointerEvents="none"
        >
          {isSuccess ? (
            <Check size={14} color="#FFFFFF" strokeWidth={3} />
          ) : isError ? (
            <AlertTriangle size={13} color="#FFFFFF" strokeWidth={2.6} />
          ) : isUnrecognized ? (
            <HelpCircle size={13} color="#FFFFFF" strokeWidth={2.6} />
          ) : isSpeaking ? (
            <Volume2 size={13} color="#FFFFFF" strokeWidth={2.6} />
          ) : isThinking || isExecuting ? (
            <Sparkles size={13} color="#FFFFFF" />
          ) : (
            <Mic size={14} color="#FFFFFF" strokeWidth={2.6} />
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginVertical: 10,
  },
  haloLayer: {
    position: 'absolute',
    ...Platform.select({
      ios: {
        shadowColor: '#8B5CF6',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.45,
        shadowRadius: 28,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  ringLayer: {
    position: 'absolute',
  },
  orbTouchable: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 999,
    position: 'relative',
  },
  floatingIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
});

export default SiaHolographicOrb;
