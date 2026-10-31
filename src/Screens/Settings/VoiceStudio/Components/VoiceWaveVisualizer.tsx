import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { Fonts } from '../../../../Theme/fonts';

export interface VoiceWaveVisualizerProps {
  isActive: boolean;
  statusText?: string;
}

export const VoiceWaveVisualizer: React.FC<VoiceWaveVisualizerProps> =
  React.memo(({ isActive, statusText }) => {
    const waveAnim1 = useRef(new Animated.Value(0.3)).current;
    const waveAnim2 = useRef(new Animated.Value(0.7)).current;
    const waveAnim3 = useRef(new Animated.Value(0.4)).current;
    const waveAnim4 = useRef(new Animated.Value(0.9)).current;
    const waveAnim5 = useRef(new Animated.Value(0.5)).current;
    const waveAnim6 = useRef(new Animated.Value(0.8)).current;
    const waveAnim7 = useRef(new Animated.Value(0.35)).current;

    const waveAnims = [
      { anim: waveAnim1, color: '#8383D6' },
      { anim: waveAnim2, color: '#F5C518' },
      { anim: waveAnim3, color: '#FF8772' },
      { anim: waveAnim4, color: '#10B981' },
      { anim: waveAnim5, color: '#8383D6' },
      { anim: waveAnim6, color: '#F5C518' },
      { anim: waveAnim7, color: '#FF8772' },
    ];

    useEffect(() => {
      let animLoop: Animated.CompositeAnimation | null = null;
      if (isActive) {
        animLoop = Animated.loop(
          Animated.parallel([
            Animated.sequence([
              Animated.timing(waveAnim1, {
                toValue: 1,
                duration: 320,
                easing: Easing.ease,
                useNativeDriver: true,
              }),
              Animated.timing(waveAnim1, {
                toValue: 0.2,
                duration: 320,
                easing: Easing.ease,
                useNativeDriver: true,
              }),
            ]),
            Animated.sequence([
              Animated.timing(waveAnim2, {
                toValue: 0.2,
                duration: 260,
                easing: Easing.ease,
                useNativeDriver: true,
              }),
              Animated.timing(waveAnim2, {
                toValue: 1,
                duration: 260,
                easing: Easing.ease,
                useNativeDriver: true,
              }),
            ]),
            Animated.sequence([
              Animated.timing(waveAnim3, {
                toValue: 1,
                duration: 380,
                easing: Easing.ease,
                useNativeDriver: true,
              }),
              Animated.timing(waveAnim3, {
                toValue: 0.3,
                duration: 380,
                easing: Easing.ease,
                useNativeDriver: true,
              }),
            ]),
            Animated.sequence([
              Animated.timing(waveAnim4, {
                toValue: 0.25,
                duration: 280,
                easing: Easing.ease,
                useNativeDriver: true,
              }),
              Animated.timing(waveAnim4, {
                toValue: 1,
                duration: 280,
                easing: Easing.ease,
                useNativeDriver: true,
              }),
            ]),
            Animated.sequence([
              Animated.timing(waveAnim5, {
                toValue: 1,
                duration: 300,
                easing: Easing.ease,
                useNativeDriver: true,
              }),
              Animated.timing(waveAnim5, {
                toValue: 0.2,
                duration: 300,
                easing: Easing.ease,
                useNativeDriver: true,
              }),
            ]),
            Animated.sequence([
              Animated.timing(waveAnim6, {
                toValue: 0.3,
                duration: 340,
                easing: Easing.ease,
                useNativeDriver: true,
              }),
              Animated.timing(waveAnim6, {
                toValue: 0.95,
                duration: 340,
                easing: Easing.ease,
                useNativeDriver: true,
              }),
            ]),
            Animated.sequence([
              Animated.timing(waveAnim7, {
                toValue: 0.9,
                duration: 290,
                easing: Easing.ease,
                useNativeDriver: true,
              }),
              Animated.timing(waveAnim7, {
                toValue: 0.2,
                duration: 290,
                easing: Easing.ease,
                useNativeDriver: true,
              }),
            ]),
          ]),
        );
        animLoop.start();
      } else {
        waveAnim1.setValue(0.3);
        waveAnim2.setValue(0.7);
        waveAnim3.setValue(0.4);
        waveAnim4.setValue(0.9);
        waveAnim5.setValue(0.5);
        waveAnim6.setValue(0.75);
        waveAnim7.setValue(0.35);
      }

      return () => {
        animLoop?.stop();
      };
    }, [isActive]);

    const label =
      statusText ||
      (isActive
        ? 'Streaming Kokoro-82M Neural Audio'
        : 'Kokoro Acoustic Buffer Primed & Ready');

    return (
      <View style={styles.waveVisualizerContainer}>
        <View style={styles.waveBarsRow}>
          {waveAnims.map((item, idx) => (
            <Animated.View
              key={idx}
              style={[
                styles.waveBar,
                {
                  backgroundColor: item.color,
                  transform: [{ scaleY: item.anim }],
                },
              ]}
            />
          ))}
        </View>
        <Text style={styles.waveStatusLabel}>{label}</Text>
      </View>
    );
  });

const styles = StyleSheet.create({
  waveVisualizerContainer: {
    borderRadius: 16,
    backgroundColor: '#16171E',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  waveBarsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 34,
    gap: 6,
    marginBottom: 6,
  },
  waveBar: {
    width: 5,
    height: 30,
    borderRadius: 3,
  },
  waveStatusLabel: {
    fontFamily: Fonts.poppins.medium,
    fontSize: 11,
    color: '#A3A8B1',
  },
});

export default VoiceWaveVisualizer;
