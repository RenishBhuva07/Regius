import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Sliders } from 'lucide-react-native';
import { Fonts } from '../../../../Theme/fonts';
import { Colors } from '../../../../Assets/StyleUtilities/Colors';
import { isLightColor } from '../../../../Theme/ThemeContext';

export interface VoiceSpeedSelectorProps {
  speechSpeed: number;
  onChangeSpeed: (speed: number) => void;
  cardBg?: string;
  borderLight?: string;
  surfaceAlt?: string;
  textPrimary?: string;
  themeAccent?: string;
}

export const VoiceSpeedSelector: React.FC<VoiceSpeedSelectorProps> = React.memo(
  ({
    speechSpeed,
    onChangeSpeed,
    borderLight = Colors.RingBorder,
    surfaceAlt = Colors.CreamSurfaceAlt,
    textPrimary = Colors.PureBlack,
    themeAccent = Colors.LavenderPurple,
  }) => {
    return (
      <View style={styles.container}>
        <View style={styles.controlHeaderRow}>
          <Sliders size={16} color={themeAccent} strokeWidth={2.2} />
          <Text style={[styles.controlHeaderTitle, { color: textPrimary }]}>
            Playback Speed ({speechSpeed}x)
          </Text>
        </View>

        <View style={styles.speedPillsRow}>
          {[0.75, 1.0, 1.25, 1.5].map(speed => {
            const isActive = speechSpeed === speed;
            return (
              <TouchableOpacity
                key={speed}
                activeOpacity={0.8}
                style={[
                  styles.speedPill,
                  {
                    backgroundColor: isActive
                      ? themeAccent
                      : surfaceAlt,
                    borderColor: isActive ? Colors.PureWhite : borderLight,
                  },
                ]}
                onPress={() => onChangeSpeed(speed)}
              >
                <Text
                  style={[
                    styles.speedPillText,
                    {
                      color: isActive
                        ? isLightColor(themeAccent)
                          ? Colors.PureBlack
                          : Colors.PureWhite
                        : textPrimary,
                    },
                  ]}
                >
                  {speed}x
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  controlHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  controlHeaderTitle: {
    fontFamily: Fonts.poppins.bold,
    fontSize: 14,
    letterSpacing: -0.2,
  },
  speedPillsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  speedPill: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  speedPillText: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: 12.5,
  },
});

export default VoiceSpeedSelector;
