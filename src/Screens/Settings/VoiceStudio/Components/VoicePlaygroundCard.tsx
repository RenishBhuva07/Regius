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
      cardBg = Colors.DefaultWhite,
      borderLight = '#E8E2D5',
      surfaceAlt = '#FAF8F5',
      textPrimary = Colors.MidnightInkText,
      textSecondary = Colors.SubtitleGray,
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
              size={16}
              color={Colors.LavenderPurple}
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
                  color={Colors.LavenderPurple}
                  style={styles.statusSpinner}
                />
              )}
              <Text
                style={[
                  styles.statusText,
                  {
                    color:
                      synthesisState === 'error'
                        ? '#FF3B30'
                        : Colors.LavenderPurple,
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
                <StopCircle size={16} color="#FFFFFF" strokeWidth={2.2} />
                <Text style={styles.actionBtnText}>Stop Speech</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                activeOpacity={0.8}
                style={[
                  styles.actionBtn,
                  { backgroundColor: Colors.MidnightCharcoal },
                  synthesisState === 'synthesizing' && styles.disabledBtn,
                ]}
                onPress={onSynthesize}
                disabled={synthesisState === 'synthesizing'}
              >
                <Volume2 size={16} color="#FFFFFF" strokeWidth={2.2} />
                <Text style={styles.actionBtnText}>
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
    borderRadius: 20,
    borderWidth: 1.5,
    padding: 16,
    marginBottom: 26,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  playgroundHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  playgroundHeaderTitle: {
    fontFamily: Fonts.poppins.bold,
    fontSize: 14,
    letterSpacing: -0.2,
  },
  textInputBox: {
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
  },
  textInputField: {
    fontFamily: Fonts.poppins.regular,
    fontSize: 13,
    minHeight: 58,
    textAlignVertical: 'top',
  },
  presetChipsLabel: {
    fontFamily: Fonts.poppins.medium,
    fontSize: 11,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  presetChipsScroll: {
    gap: 8,
    paddingBottom: 12,
  },
  presetChip: {
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 6,
    maxWidth: 220,
  },
  presetChipText: {
    fontFamily: Fonts.poppins.medium,
    fontSize: 11,
  },
  statusBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  statusSpinner: {
    marginRight: 4,
  },
  statusText: {
    fontFamily: Fonts.poppins.medium,
    fontSize: 11.5,
  },
  playgroundActionsRow: {
    marginTop: 2,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 24,
    paddingVertical: 13,
  },
  stopBtn: {
    backgroundColor: '#FF3B30',
  },
  disabledBtn: {
    opacity: 0.6,
  },
  actionBtnText: {
    fontFamily: Fonts.poppins.bold,
    fontSize: 13.5,
    color: '#FFFFFF',
  },
});

export default VoicePlaygroundCard;
