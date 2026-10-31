import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { Mic, MicOff } from 'lucide-react-native';

export interface WakeWordRadarPulseProps {
  isWakeWordEnabled: boolean;
}

export const WakeWordRadarPulse: React.FC<WakeWordRadarPulseProps> = React.memo(
  ({ isWakeWordEnabled }) => {
    const pulseAnim = useRef(new Animated.Value(1)).current;
    const pulseOpacity = useRef(new Animated.Value(0.6)).current;

    useEffect(() => {
      const pulse = Animated.loop(
        Animated.parallel([
          Animated.sequence([
            Animated.timing(pulseAnim, {
              toValue: 1.35,
              duration: 1800,
              useNativeDriver: true,
            }),
            Animated.timing(pulseAnim, {
              toValue: 1,
              duration: 1800,
              useNativeDriver: true,
            }),
          ]),
          Animated.sequence([
            Animated.timing(pulseOpacity, {
              toValue: 0.15,
              duration: 1800,
              useNativeDriver: true,
            }),
            Animated.timing(pulseOpacity, {
              toValue: 0.6,
              duration: 1800,
              useNativeDriver: true,
            }),
          ]),
        ]),
      );

      if (isWakeWordEnabled) {
        pulse.start();
      } else {
        pulseAnim.setValue(1);
        pulseOpacity.setValue(0.2);
      }

      return () => pulse.stop();
    }, [isWakeWordEnabled, pulseAnim, pulseOpacity]);

    return (
      <View style={styles.radarVisualizerContainer}>
        {isWakeWordEnabled && (
          <>
            <Animated.View
              style={[
                styles.radarRingOuter,
                {
                  transform: [{ scale: pulseAnim }],
                  opacity: pulseOpacity,
                },
              ]}
            />
            <View style={styles.radarRingMiddle} />
          </>
        )}

        <View
          style={[
            styles.micCoreOrb,
            {
              backgroundColor: isWakeWordEnabled ? '#21AF85' : '#2C3035',
              borderColor: isWakeWordEnabled
                ? 'rgba(33, 175, 133, 0.4)'
                : 'rgba(255, 255, 255, 0.1)',
            },
          ]}
        >
          {isWakeWordEnabled ? (
            <Mic size={28} color="#FFFFFF" strokeWidth={2.4} />
          ) : (
            <MicOff size={28} color="#A3A8B1" strokeWidth={2.4} />
          )}
        </View>
      </View>
    );
  },
);

const styles = StyleSheet.create({
  radarVisualizerContainer: {
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 14,
    position: 'relative',
  },
  radarRingOuter: {
    position: 'absolute',
    width: 114,
    height: 114,
    borderRadius: 57,
    borderWidth: 2,
    borderColor: '#21AF85',
  },
  radarRingMiddle: {
    position: 'absolute',
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 1,
    borderColor: 'rgba(33, 175, 133, 0.3)',
  },
  micCoreOrb: {
    width: 66,
    height: 66,
    borderRadius: 33,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#21AF85',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },
});

export default WakeWordRadarPulse;
