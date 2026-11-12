import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { Fonts } from '../../../../Theme/fonts';
import { Colors, withAlpha } from '../../../../Assets/StyleUtilities/Colors';
import ResponsivePixels from '../../../../Assets/StyleUtilities/ResponsivePixels';

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
      { anim: waveAnim1, color: Colors.LavenderPurple },
      { anim: waveAnim2, color: Colors.AccentYellow },
      { anim: waveAnim3, color: Colors.CoralWarmth },
      { anim: waveAnim4, color: Colors.ToastSuccessAccent },
      { anim: waveAnim5, color: Colors.LavenderPurple },
      { anim: waveAnim6, color: Colors.AccentYellow },
      { anim: waveAnim7, color: Colors.CoralWarmth },
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
    }, [
      isActive,
      waveAnim1,
      waveAnim2,
      waveAnim3,
      waveAnim4,
      waveAnim5,
      waveAnim6,
      waveAnim7,
    ]);

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
    borderRadius: ResponsivePixels.size16,
    backgroundColor: Colors.VoiceWaveDarkBg,
    borderWidth: 1,
    borderColor: withAlpha(Colors.PureWhite, 0.12),
    paddingVertical: ResponsivePixels.size14,
    paddingHorizontal: ResponsivePixels.size16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: ResponsivePixels.size14,
  },
  waveBarsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: ResponsivePixels.size34,
    gap: ResponsivePixels.size6,
    marginBottom: ResponsivePixels.size6,
  },
  waveBar: {
    width: ResponsivePixels.size5,
    height: ResponsivePixels.size30,
    borderRadius: ResponsivePixels.size3,
  },
  waveStatusLabel: {
    fontFamily: Fonts.poppins.medium,
    fontSize: ResponsivePixels.size11,
    color: Colors.SteelMist,
  },
});

export default VoiceWaveVisualizer;
