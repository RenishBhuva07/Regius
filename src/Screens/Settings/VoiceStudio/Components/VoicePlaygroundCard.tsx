import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { Sparkles, StopCircle, Volume2 } from 'lucide-react-native';
import { Fonts } from '../../../../Theme/fonts';
import { Colors } from '../../../../Assets/StyleUtilities/Colors';
import ResponsivePixels from '../../../../Assets/StyleUtilities/ResponsivePixels';

export const DEFAULT_PRESET_SENTENCES = [
  'Hey Regius, ready when you are.',
  'Meeting with the team at 3:00 PM today.',
  'Great job! You maintained your daily focus streak.',
  'Your mind is clear, focused, and prepared for excellence.',
];

export interface VoicePlaygroundCardProps {
  testText: string;
  onChangeTestText: (text: string) => void;
  onSelectPreset: (text: string) => void;
  presetSentences?: string[];
  synthesisState: 'idle' | 'synthesizing' | 'speaking' | 'error';
  statusMessage: string | null;
  onSynthesize: () => void;
  onStop: () => void;
  cardBg?: string;
  borderLight?: string;
  surfaceAlt?: string;
  textPrimary?: string;
  textSecondary?: string;
  themeAccent?: string;
  buttonBg?: string;
  buttonTextColor?: string;
}

export const VoicePlaygroundCard: React.FC<VoicePlaygroundCardProps> =
  React.memo(
    ({
      testText,
      onChangeTestText,
      onSelectPreset,
      presetSentences = DEFAULT_PRESET_SENTENCES,
      synthesisState,
      statusMessage,
      onSynthesize,
      onStop,
      cardBg = Colors.PureWhite,
      borderLight = Colors.RingBorder,
      surfaceAlt = Colors.CreamSurfaceAlt,
      textPrimary = Colors.PureBlack,
      textSecondary = Colors.SubtitleGray,
      themeAccent = Colors.LavenderPurple,
      buttonBg,
      buttonTextColor,
    }) => {
      return (
        <View
          style={[
            styles.playgroundCard,
            {
              backgroundColor: cardBg,
              borderColor: borderLight,
            },
          ]}
        >
          <View style={styles.playgroundHeader}>
            <Sparkles
              size={ResponsivePixels.size16}
              color={themeAccent}
              strokeWidth={2.4}
            />
            <Text
              style={[styles.playgroundHeaderTitle, { color: textPrimary }]}
            >
              Real-Time Kokoro-82M Sandbox
            </Text>
          </View>

          <View
            style={[
              styles.textInputBox,
              { backgroundColor: surfaceAlt, borderColor: borderLight },
            ]}
          >
            <TextInput
              style={[styles.textInputField, { color: textPrimary }]}
              value={testText}
              onChangeText={onChangeTestText}
              placeholder="Enter text to synthesize with Kokoro..."
              placeholderTextColor={textSecondary}
              multiline
              numberOfLines={3}
            />
          </View>

          <Text style={[styles.presetChipsLabel, { color: textSecondary }]}>
            Quick Preset Prompts:
          </Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.presetChipsScroll}
          >
            {presetSentences.map((preset, idx) => (
              <TouchableOpacity
                key={idx}
                activeOpacity={0.7}
                style={[
                  styles.presetChip,
                  { backgroundColor: surfaceAlt, borderColor: borderLight },
                ]}
                onPress={() => onSelectPreset(preset)}
              >
                <Text
                  style={[styles.presetChipText, { color: textPrimary }]}
                  numberOfLines={1}
                >
                  {preset}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {statusMessage && (
            <View style={styles.statusBanner}>
              {synthesisState === 'synthesizing' && (
                <ActivityIndicator
                  size="small"
                  color={themeAccent}
                  style={styles.statusSpinner}
                />
              )}
              <Text
                style={[
                  styles.statusText,
                  {
                    color:
                      synthesisState === 'error'
                        ? Colors.CrimsonPulse
                        : themeAccent,
                  },
                ]}
              >
                {statusMessage}
              </Text>
            </View>
          )}

          <View style={styles.playgroundActionsRow}>
            {synthesisState === 'speaking' ? (
              <TouchableOpacity
                activeOpacity={0.8}
                style={[styles.actionBtn, styles.stopBtn]}
                onPress={onStop}
              >
                <StopCircle
                  size={ResponsivePixels.size16}
                  color={Colors.PureWhite}
                  strokeWidth={2.2}
                />
                <Text style={styles.actionBtnText}>Stop Speech</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                activeOpacity={0.8}
                style={[
                  styles.actionBtn,
                  {
                    backgroundColor:
                      buttonBg || Colors.MidnightCharcoal,
                  },
                  synthesisState === 'synthesizing' && styles.disabledBtn,
                ]}
                onPress={onSynthesize}
                disabled={synthesisState === 'synthesizing'}
              >
                <Volume2
                  size={ResponsivePixels.size16}
                  color={buttonTextColor || Colors.PureWhite}
                  strokeWidth={2.2}
                />
                <Text
                  style={[
                    styles.actionBtnText,
                    buttonTextColor ? { color: buttonTextColor } : null,
                  ]}
                >
                  {synthesisState === 'synthesizing'
                    ? 'Synthesizing...'
                    : 'Synthesize & Speak with Kokoro ✦'}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      );
    },
  );

const styles = StyleSheet.create({
  playgroundCard: {
    borderRadius: ResponsivePixels.size20,
    borderWidth: 1.5,
    padding: ResponsivePixels.size16,
    marginBottom: ResponsivePixels.size26,
    shadowColor: Colors.PureBlack,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  playgroundHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ResponsivePixels.size8,
    marginBottom: ResponsivePixels.size12,
  },
  playgroundHeaderTitle: {
    fontFamily: Fonts.poppins.bold,
    fontSize: ResponsivePixels.size14,
    letterSpacing: -0.2,
  },
  textInputBox: {
    borderRadius: ResponsivePixels.size14,
    borderWidth: 1,
    paddingHorizontal: ResponsivePixels.size12,
    paddingVertical: ResponsivePixels.size10,
    marginBottom: ResponsivePixels.size12,
  },
  textInputField: {
    fontFamily: Fonts.poppins.regular,
    fontSize: ResponsivePixels.size13,
    minHeight: ResponsivePixels.size58,
    textAlignVertical: 'top',
  },
  presetChipsLabel: {
    fontFamily: Fonts.poppins.medium,
    fontSize: ResponsivePixels.size11,
    marginBottom: ResponsivePixels.size8,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  presetChipsScroll: {
    gap: ResponsivePixels.size8,
    paddingBottom: ResponsivePixels.size12,
  },
  presetChip: {
    borderRadius: ResponsivePixels.size14,
    borderWidth: 1,
    paddingHorizontal: ResponsivePixels.size12,
    paddingVertical: ResponsivePixels.size6,
    maxWidth: ResponsivePixels.size220,
  },
  presetChipText: {
    fontFamily: Fonts.poppins.medium,
    fontSize: ResponsivePixels.size11,
  },
  statusBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ResponsivePixels.size8,
    marginBottom: ResponsivePixels.size12,
  },
  statusSpinner: {
    marginRight: ResponsivePixels.size4,
  },
  statusText: {
    fontFamily: Fonts.poppins.medium,
    fontSize: ResponsivePixels.size11_5,
  },
  playgroundActionsRow: {
    marginTop: ResponsivePixels.size2,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: ResponsivePixels.size8,
    borderRadius: ResponsivePixels.size24,
    paddingVertical: ResponsivePixels.size13,
  },
  stopBtn: {
    backgroundColor: Colors.CrimsonPulse,
  },
  disabledBtn: {
    opacity: 0.6,
  },
  actionBtnText: {
    fontFamily: Fonts.poppins.bold,
    fontSize: ResponsivePixels.size13_5,
    color: Colors.PureWhite,
  },
});

export default VoicePlaygroundCard;
