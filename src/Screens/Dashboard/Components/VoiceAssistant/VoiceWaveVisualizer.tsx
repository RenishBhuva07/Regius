import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';

export interface VoiceWaveVisualizerProps {
  isActive?: boolean;
  barCount?: number;
  isDarkMode?: boolean;
}

const BAR_PALETTE = [
  '#8383D6', // Lavender Purple (Habits/Mindful)
  '#F5C518', // Imperial Gold (Works/Tasks)
  '#FF8772', // Coral Warmth (Energy/Events)
  '#10B981', // Fresh Mint (Sport/Reminders)
  '#8383D6', // Lavender Purple
];

/**
 * Animated dynamic acoustic waveform visualizer:
 * - 5 vertical pill bars with staggered organic height animations
 * - Harmonized with Regius category brand colors
 * - Activated dynamically during 'listening' and 'speaking' states
 */
export const VoiceWaveVisualizer: React.FC<VoiceWaveVisualizerProps> = ({
  isActive = false,
  barCount = 5,
  isDarkMode = false,
}) => {
  // Staggered animated values for each bar
  const barAnims = useRef(
    Array.from({ length: barCount }, () => new Animated.Value(6)),
  ).current;

  useEffect(() => {
    if (!isActive) {
      // Graceful return to resting height
      Animated.parallel(
        barAnims.map(anim =>
          Animated.timing(anim, {
            toValue: 5,
            duration: 250,
            useNativeDriver: false,
          }),
        ),
      ).start();
      return;
    }

    // Configured height ranges and durations per bar for organic fluid motion
    const animations = barAnims.map((anim, idx) => {
      const minH = 6;
      const maxH = [22, 28, 20, 26, 18][idx % 5];
      const duration = [420, 600, 480, 560, 500][idx % 5];

      return Animated.loop(
        Animated.sequence([
          Animated.timing(anim, {
            toValue: maxH,
            duration,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: false,
          }),
          Animated.timing(anim, {
            toValue: minH,
            duration: duration * 0.9,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: false,
          }),
        ]),
      );
    });

    animations.forEach(loop => loop.start());

    return () => {
      animations.forEach(loop => loop.stop());
    };
  }, [isActive, barAnims]);

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: isDarkMode
            ? 'rgba(255, 255, 255, 0.06)'
            : 'rgba(131, 131, 214, 0.08)',
          borderColor: isDarkMode
            ? 'rgba(255, 255, 255, 0.1)'
            : 'rgba(131, 131, 214, 0.16)',
        },
      ]}
      accessibilityRole="image"
      accessibilityLabel={
        isActive ? 'Voice soundwave active' : 'Voice soundwave resting'
      }
    >
      {barAnims.map((anim, index) => {
        const color = BAR_PALETTE[index % BAR_PALETTE.length];
        return (
          <Animated.View
            key={`bar-${index}`}
            style={[
              styles.bar,
              {
                height: anim,
                backgroundColor: color,
              },
            ]}
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 16,
    borderWidth: 1,
    gap: 3.5,
    height: 25,
    alignSelf: 'center',
    marginVertical: 4,
  },
  bar: {
    width: 3.5,
    borderRadius: 2,
    minHeight: 4,
  },
});

export default VoiceWaveVisualizer;
