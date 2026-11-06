import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';
import ResponsivePixels from '../Assets/StyleUtilities/ResponsivePixels';

export interface MiniAcousticBarsProps {
  isPlaying: boolean;
  accentColor: string;
}

/**
 * Animated 7-Bar Holographic Acoustic Equalizer
 * Conforms to DESIGN_SYSTEM.md visual language for neural audio playback feedback.
 */
export const MiniAcousticBars: React.FC<MiniAcousticBarsProps> = React.memo(
  ({ isPlaying, accentColor }) => {
    const bar1 = useRef(new Animated.Value(0.35)).current;
    const bar2 = useRef(new Animated.Value(0.65)).current;
    const bar3 = useRef(new Animated.Value(0.45)).current;
    const bar4 = useRef(new Animated.Value(0.85)).current;
    const bar5 = useRef(new Animated.Value(0.55)).current;
    const bar6 = useRef(new Animated.Value(0.75)).current;
    const bar7 = useRef(new Animated.Value(0.4)).current;

    useEffect(() => {
      let animLoop: Animated.CompositeAnimation | null = null;
      if (isPlaying) {
        animLoop = Animated.loop(
          Animated.parallel([
            Animated.sequence([
              Animated.timing(bar1, {
                toValue: 1,
                duration: 320,
                easing: Easing.inOut(Easing.ease),
                useNativeDriver: true,
              }),
              Animated.timing(bar1, {
                toValue: 0.25,
                duration: 320,
                easing: Easing.inOut(Easing.ease),
                useNativeDriver: true,
              }),
            ]),
            Animated.sequence([
              Animated.timing(bar2, {
                toValue: 0.2,
                duration: 260,
                easing: Easing.inOut(Easing.ease),
                useNativeDriver: true,
              }),
              Animated.timing(bar2, {
                toValue: 0.95,
                duration: 260,
                easing: Easing.inOut(Easing.ease),
                useNativeDriver: true,
              }),
            ]),
            Animated.sequence([
              Animated.timing(bar3, {
                toValue: 1,
                duration: 380,
                easing: Easing.inOut(Easing.ease),
                useNativeDriver: true,
              }),
              Animated.timing(bar3, {
                toValue: 0.3,
                duration: 380,
                easing: Easing.inOut(Easing.ease),
                useNativeDriver: true,
              }),
            ]),
            Animated.sequence([
              Animated.timing(bar4, {
                toValue: 0.3,
                duration: 290,
                easing: Easing.inOut(Easing.ease),
                useNativeDriver: true,
              }),
              Animated.timing(bar4, {
                toValue: 1,
                duration: 290,
                easing: Easing.inOut(Easing.ease),
                useNativeDriver: true,
              }),
            ]),
            Animated.sequence([
              Animated.timing(bar5, {
                toValue: 0.9,
                duration: 340,
                easing: Easing.inOut(Easing.ease),
                useNativeDriver: true,
              }),
              Animated.timing(bar5, {
                toValue: 0.25,
                duration: 340,
                easing: Easing.inOut(Easing.ease),
                useNativeDriver: true,
              }),
            ]),
            Animated.sequence([
              Animated.timing(bar6, {
                toValue: 0.25,
                duration: 270,
                easing: Easing.inOut(Easing.ease),
                useNativeDriver: true,
              }),
              Animated.timing(bar6, {
                toValue: 0.85,
                duration: 270,
                easing: Easing.inOut(Easing.ease),
                useNativeDriver: true,
              }),
            ]),
            Animated.sequence([
              Animated.timing(bar7, {
                toValue: 0.8,
                duration: 350,
                easing: Easing.inOut(Easing.ease),
                useNativeDriver: true,
              }),
              Animated.timing(bar7, {
                toValue: 0.3,
                duration: 350,
                easing: Easing.inOut(Easing.ease),
                useNativeDriver: true,
              }),
            ]),
          ]),
        );
        animLoop.start();
      } else {
        bar1.setValue(0.35);
        bar2.setValue(0.5);
        bar3.setValue(0.4);
        bar4.setValue(0.7);
        bar5.setValue(0.45);
        bar6.setValue(0.55);
        bar7.setValue(0.35);
      }

      return () => {
        if (animLoop) {
          animLoop.stop();
        }
      };
    }, [isPlaying, bar1, bar2, bar3, bar4, bar5, bar6, bar7]);

    const bars = [bar1, bar2, bar3, bar4, bar5, bar6, bar7];

    return (
      <View style={styles.equalizerContainer}>
        {bars.map((anim, idx) => (
          <View key={`eq-bar-${idx}`} style={styles.barTrack}>
            <Animated.View
              style={[
                styles.barFill,
                {
                  backgroundColor: accentColor,
                  transform: [{ scaleY: anim }],
                },
              ]}
            />
          </View>
        ))}
      </View>
    );
  },
);

const styles = StyleSheet.create({
  equalizerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ResponsivePixels.size3,
    height: ResponsivePixels.size18,
    paddingHorizontal: ResponsivePixels.size4,
  },
  barTrack: {
    width: ResponsivePixels.size3,
    height: ResponsivePixels.size16,
    borderRadius: ResponsivePixels.size2,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  barFill: {
    width: '100%',
    height: '100%',
    borderRadius: ResponsivePixels.size2,
  },
});

export default MiniAcousticBars;
