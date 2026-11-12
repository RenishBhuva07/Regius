import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { Mic, MicOff } from 'lucide-react-native';
import Colors, { withAlpha } from '../../../../Assets/StyleUtilities/Colors';
import ResponsivePixels from '../../../../Assets/StyleUtilities/ResponsivePixels';

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
              backgroundColor: isWakeWordEnabled
                ? Colors.LuminousGreen
                : Colors.CarbonSlate,
              borderColor: isWakeWordEnabled
                ? withAlpha(Colors.LuminousGreen, 0.4)
                : withAlpha(Colors.PureWhite, 0.1),
            },
          ]}
        >
          {isWakeWordEnabled ? (
            <Mic size={ResponsivePixels.size28} color={Colors.PureWhite} strokeWidth={2.4} />
          ) : (
            <MicOff size={ResponsivePixels.size28} color={Colors.SteelMist} strokeWidth={2.4} />
          )}
        </View>
      </View>
    );
  },
);

const styles = StyleSheet.create({
  radarVisualizerContainer: {
    height: ResponsivePixels.size120,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: ResponsivePixels.size14,
    position: 'relative',
  },
  radarRingOuter: {
    position: 'absolute',
    width: ResponsivePixels.size114,
    height: ResponsivePixels.size114,
    borderRadius: ResponsivePixels.size57,
    borderWidth: 2,
    borderColor: Colors.LuminousGreen,
  },
  radarRingMiddle: {
    position: 'absolute',
    width: ResponsivePixels.size90,
    height: ResponsivePixels.size90,
    borderRadius: ResponsivePixels.size45,
    borderWidth: 1,
    borderColor: withAlpha(Colors.LuminousGreen, 0.3),
  },
  micCoreOrb: {
    width: ResponsivePixels.size66,
    height: ResponsivePixels.size66,
    borderRadius: ResponsivePixels.size33,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.LuminousGreen,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },
});

export default WakeWordRadarPulse;
