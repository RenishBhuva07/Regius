import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import {
  Mic,
  Play,
  Square,
  Check,
  X,
  Sparkles,
  StopCircle,
  Volume2,
} from 'lucide-react-native';
import { Typography } from '../../../Theme/Typographys';
import { Colors as StaticColors } from '../../../Assets/StyleUtilities/Colors';
import ResponsivePixels from '../../../Assets/StyleUtilities/ResponsivePixels';
import { VoiceOption, useSettingsTheme } from './types';
import { KokoroTTSService } from '../../../Services/Kokoro/KokoroTTSService';

interface VoiceStudioModalProps {
  visible: boolean;
  onClose: () => void;
  voices: VoiceOption[];
  selectedVoiceId: string;
  onSelectVoice: (voice: VoiceOption) => void;
  isPlayingPreview: boolean;
  playingVoiceId: string | null;
  onTogglePreview: (voiceId: string) => void;
}

const PRESET_SENTENCES = [
  "Hey Regius, ready when you are.",
  "Meeting with the team at 3:00 PM today.",
  "Great job! You completed your daily meditation habit.",
];

export const VoiceStudioModal: React.FC<VoiceStudioModalProps> = ({
  visible,
  onClose,
  voices,
  selectedVoiceId,
  onSelectVoice,
  isPlayingPreview,
  playingVoiceId,
  onTogglePreview,
}) => {
  const {
    isDarkMode,
    cardBg,
    textPrimary,
    textSecondary,
    borderLight,
    surfaceAlt,
  } = useSettingsTheme();

  const [testText, setTestText] = useState(
    'Hello! This is Kokoro text to speech speaking in real time.',
  );
  const [synthesisState, setSynthesisState] = useState<
    'idle' | 'synthesizing' | 'speaking' | 'error'
  >('idle');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const selectedVoice =
    voices.find(v => v.id === selectedVoiceId) || voices[0];

  const handleGenerateAndSpeak = async () => {
    if (!testText.trim()) return;

    try {
      setSynthesisState('synthesizing');
      setStatusMessage('Synthesizing speech with Kokoro...');

      const audioUri = await KokoroTTSService.synthesize(
        testText,
        selectedVoice.kokoroVoiceId,
      );

      if (!audioUri) {
        setSynthesisState('error');
        setStatusMessage('Synthesis error. Please try again.');
        setTimeout(() => {
          setSynthesisState('idle');
          setStatusMessage(null);
        }, 3000);
        return;
      }

      setSynthesisState('speaking');
      setStatusMessage(`Speaking with Kokoro ${selectedVoice.name}...`);

      await KokoroTTSService.speakAndWait(testText, {
        voiceId: selectedVoice.kokoroVoiceId,
      });

      setSynthesisState('idle');
      setStatusMessage(null);
    } catch {
      setSynthesisState('error');
      setStatusMessage('Failed to generate speech');
      setTimeout(() => {
        setSynthesisState('idle');
        setStatusMessage(null);
      }, 3000);
    }
  };

  const handleStopSpeech = async () => {
    await KokoroTTSService.stop();
    setSynthesisState('idle');
    setStatusMessage(null);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View
        style={[
          styles.modalContainer,
          { backgroundColor: isDarkMode ? '#121417' : '#FFFFFF' },
        ]}
      >
        <View style={[styles.modalHeader, { borderBottomColor: borderLight }]}>
          <View>
            <Text style={[styles.modalTitle, { color: textPrimary }]}>
              Voice Studio & Synthesizer
            </Text>
            <Text style={[styles.modalSubtitle, { color: textSecondary }]}>
              Kokoro-82M Neural Voices • Test Any Sentence
            </Text>
          </View>
          <TouchableOpacity
            activeOpacity={0.7}
            style={[styles.modalCloseBtn, { backgroundColor: surfaceAlt }]}
            onPress={onClose}
          >
            <X size={20} color={textPrimary} strokeWidth={2.4} />
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.modalScroll}
          contentContainerStyle={styles.modalScrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Kokoro Dynamic TTS Tester Playground */}
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
              <View style={styles.playgroundTitleRow}>
                <Sparkles size={18} color={selectedVoice.accentColor} />
                <Text style={[styles.playgroundTitle, { color: textPrimary }]}>
                  Kokoro Speech Synthesizer
                </Text>
              </View>
              <View
                style={[
                  styles.activeVoiceTag,
                  { backgroundColor: selectedVoice.bgColor },
                ]}
              >
                <Text
                  style={[
                    styles.activeVoiceTagText,
                    { color: selectedVoice.accentColor },
                  ]}
                >
                  {selectedVoice.name} ({selectedVoice.kokoroVoiceId})
                </Text>
              </View>
            </View>

            <TextInput
              style={[
                styles.playgroundInput,
                {
                  color: textPrimary,
                  backgroundColor: surfaceAlt,
                  borderColor: borderLight,
                },
              ]}
              value={testText}
              onChangeText={setTestText}
              placeholder="Type any arbitrary sentence or paragraph here..."
              placeholderTextColor={textSecondary}
              multiline
              numberOfLines={3}
            />

            {/* Quick Preset Sentence Chips */}
            <View style={styles.presetsRow}>
              {PRESET_SENTENCES.map((preset, idx) => (
                <TouchableOpacity
                  key={idx}
                  activeOpacity={0.7}
                  style={[styles.presetChip, { backgroundColor: surfaceAlt }]}
                  onPress={() => setTestText(preset)}
                >
                  <Text
                    numberOfLines={1}
                    style={[styles.presetChipText, { color: textSecondary }]}
                  >
                    &ldquo;{preset}&rdquo;
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Status Message */}
            {statusMessage && (
              <View style={styles.statusRow}>
                {synthesisState === 'synthesizing' && (
                  <ActivityIndicator
                    size="small"
                    color={selectedVoice.accentColor}
                  />
                )}
                {synthesisState === 'speaking' && (
                  <Volume2 size={16} color={selectedVoice.accentColor} />
                )}
                <Text
                  style={[
                    styles.statusText,
                    {
                      color:
                        synthesisState === 'error'
                          ? '#EF4444'
                          : selectedVoice.accentColor,
                    },
                  ]}
                >
                  {statusMessage}
                </Text>
              </View>
            )}

            {/* Action Buttons */}
            <View style={styles.playgroundActions}>
              <TouchableOpacity
                activeOpacity={0.8}
                disabled={synthesisState === 'synthesizing'}
                style={[
                  styles.generateBtn,
                  { backgroundColor: selectedVoice.accentColor },
                ]}
                onPress={handleGenerateAndSpeak}
              >
                {synthesisState === 'synthesizing' ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Play size={14} color="#FFFFFF" fill="#FFFFFF" />
                )}
                <Text style={styles.generateBtnText}>
                  {synthesisState === 'synthesizing'
                    ? 'Synthesizing...'
                    : 'Generate & Speak'}
                </Text>
              </TouchableOpacity>

              {(synthesisState === 'speaking' ||
                synthesisState === 'synthesizing') && (
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={styles.stopBtn}
                  onPress={handleStopSpeech}
                >
                  <StopCircle size={15} color="#FFFFFF" />
                  <Text style={styles.stopBtnText}>Stop</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          <Text style={[styles.voiceListHeaderTitle, { color: textSecondary }]}>
            SELECT KOKORO NEURAL VOICE:
          </Text>

          {voices.map(voice => {
            const isSelected = voice.id === selectedVoiceId;
            const isPlaying = isPlayingPreview && playingVoiceId === voice.id;

            return (
              <TouchableOpacity
                key={voice.id}
                activeOpacity={0.88}
                style={[
                  styles.voiceCardDetailed,
                  {
                    backgroundColor: isSelected ? voice.bgColor : cardBg,
                    borderColor: isSelected ? voice.borderColor : borderLight,
                  },
                ]}
                onPress={() => onSelectVoice(voice)}
              >
                <View style={styles.voiceDetailedTop}>
                  <View style={styles.voiceDetailedLeft}>
                    <View
                      style={[
                        styles.voiceDetailedIcon,
                        {
                          backgroundColor: voice.bgColor,
                          borderColor: voice.borderColor,
                        },
                      ]}
                    >
                      <Mic
                        size={20}
                        color={voice.accentColor}
                        strokeWidth={2.2}
                      />
                    </View>
                    <View>
                      <View style={styles.voiceNameRowDetailed}>
                        <Text
                          style={[
                            styles.voiceDetailedName,
                            { color: textPrimary },
                          ]}
                        >
                          {voice.name}
                        </Text>
                        <View
                          style={[
                            styles.kokoroIdBadge,
                            {
                              backgroundColor: surfaceAlt,
                              borderColor: borderLight,
                            },
                          ]}
                        >
                          <Text
                            style={[
                              styles.kokoroIdBadgeText,
                              { color: voice.accentColor },
                            ]}
                          >
                            {voice.kokoroVoiceId}
                          </Text>
                        </View>
                        {isSelected && (
                          <View
                            style={[
                              styles.activeBadgePill,
                              { backgroundColor: voice.accentColor },
                            ]}
                          >
                            <Text style={styles.activeBadgePillText}>
                              ACTIVE
                            </Text>
                          </View>
                        )}
                      </View>
                      <Text
                        style={[
                          styles.voiceDetailedMeta,
                          { color: textSecondary },
                        ]}
                      >
                        {voice.gender} • {voice.accent} • {voice.personality}
                      </Text>
                    </View>
                  </View>

                  <TouchableOpacity
                    activeOpacity={0.8}
                    style={[
                      styles.voicePreviewCircleBtn,
                      {
                        backgroundColor: isPlaying
                          ? '#1F2228'
                          : voice.accentColor,
                      },
                    ]}
                    onPress={e => {
                      e.stopPropagation();
                      onTogglePreview(voice.id);
                    }}
                  >
                    {isPlaying ? (
                      <Square size={13} color="#FFFFFF" fill="#FFFFFF" />
                    ) : (
                      <Play size={13} color="#FFFFFF" fill="#FFFFFF" />
                    )}
                  </TouchableOpacity>
                </View>

                <View
                  style={[
                    styles.sampleQuoteBox,
                    { backgroundColor: isSelected ? '#FFFFFF' : surfaceAlt },
                  ]}
                >
                  <Text
                    style={[styles.sampleQuoteText, { color: textSecondary }]}
                  >
                    &ldquo;{voice.sampleText}&rdquo;
                  </Text>
                </View>

                <View style={styles.voiceActionFooter}>
                  <View style={styles.voiceTagSmall}>
                    <Text
                      style={[
                        styles.voiceTagSmallText,
                        { color: voice.accentColor },
                      ]}
                    >
                      {voice.tag}
                    </Text>
                  </View>
                  {isSelected ? (
                    <View style={styles.selectedConfirmRow}>
                      <Check
                        size={16}
                        color={voice.accentColor}
                        strokeWidth={2.6}
                      />
                      <Text
                        style={[
                          styles.selectedConfirmText,
                          { color: voice.accentColor },
                        ]}
                      >
                        Active Default Voice
                      </Text>
                    </View>
                  ) : (
                    <Text
                      style={[
                        styles.selectPromptText,
                        { color: textSecondary },
                      ]}
                    >
                      Tap to select as default
                    </Text>
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <View
          style={[
            styles.modalFooter,
            { borderTopColor: borderLight, backgroundColor: cardBg },
          ]}
        >
          <TouchableOpacity
            activeOpacity={0.85}
            style={[
              styles.modalDoneBtn,
              { backgroundColor: StaticColors.ButtonDark },
            ]}
            onPress={onClose}
          >
            <Text style={styles.modalDoneBtnText}>Done</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: ResponsivePixels.size20,
    paddingVertical: ResponsivePixels.size16,
    borderBottomWidth: 1,
  },
  modalTitle: {
    ...Typography.h6Bold,
    fontSize: 18,
  },
  modalSubtitle: {
    ...Typography.bodySmallPoppinsRegular,
    fontSize: 12,
    marginTop: 2,
  },
  modalCloseBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalScroll: {
    flex: 1,
  },
  modalScrollContent: {
    paddingHorizontal: ResponsivePixels.size20,
    paddingTop: ResponsivePixels.size16,
    paddingBottom: ResponsivePixels.size32,
    gap: 14,
  },
  playgroundCard: {
    borderWidth: 1.5,
    borderRadius: 18,
    padding: 16,
    marginBottom: 4,
  },
  playgroundHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  playgroundTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  playgroundTitle: {
    ...Typography.bodyLargePoppinsSemiBold,
    fontSize: 15,
  },
  activeVoiceTag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  activeVoiceTagText: {
    ...Typography.bodySmallPoppinsSemiBold,
    fontSize: 11,
  },
  playgroundInput: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    fontSize: 13,
    textAlignVertical: 'top',
    minHeight: 70,
    fontFamily: Typography.bodySmallPoppinsRegular.fontFamily,
  },
  presetsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 10,
  },
  presetChip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    maxWidth: '100%',
  },
  presetChipText: {
    fontSize: 11,
    fontFamily: Typography.bodySmallPoppinsRegular.fontFamily,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 10,
  },
  statusText: {
    ...Typography.bodySmallPoppinsSemiBold,
    fontSize: 12,
  },
  playgroundActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 12,
  },
  generateBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 12,
  },
  generateBtnText: {
    ...Typography.bodySmallPoppinsSemiBold,
    color: '#FFFFFF',
    fontSize: 13,
  },
  stopBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#EF4444',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  stopBtnText: {
    ...Typography.bodySmallPoppinsSemiBold,
    color: '#FFFFFF',
    fontSize: 13,
  },
  voiceListHeaderTitle: {
    ...Typography.bodySmallPoppinsSemiBold,
    fontSize: 12,
    letterSpacing: 0.8,
    marginTop: 6,
  },
  voiceCardDetailed: {
    borderWidth: 1.5,
    borderRadius: 18,
    padding: 16,
  },
  voiceDetailedTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  voiceDetailedLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  voiceDetailedIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  voiceNameRowDetailed: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  voiceDetailedName: {
    ...Typography.bodyLargePoppinsSemiBold,
    fontSize: 16,
  },
  kokoroIdBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
  },
  kokoroIdBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    fontFamily: Typography.bodySmallRanadeBold.fontFamily,
  },
  activeBadgePill: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  activeBadgePillText: {
    fontFamily: Typography.bodySmallRanadeBold.fontFamily,
    fontSize: 9,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  voiceDetailedMeta: {
    ...Typography.bodySmallPoppinsRegular,
    fontSize: 11,
    marginTop: 2,
  },
  voicePreviewCircleBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sampleQuoteBox: {
    padding: 10,
    borderRadius: 12,
    marginTop: 12,
  },
  sampleQuoteText: {
    ...Typography.bodySmallPoppinsRegular,
    fontSize: 12,
    fontStyle: 'italic',
  },
  voiceActionFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  voiceTagSmall: {
    borderRadius: 6,
  },
  voiceTagSmallText: {
    ...Typography.bodySmallPoppinsSemiBold,
    fontSize: 11,
  },
  selectedConfirmRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  selectedConfirmText: {
    ...Typography.bodySmallPoppinsSemiBold,
    fontSize: 12,
  },
  selectPromptText: {
    ...Typography.bodySmallPoppinsRegular,
    fontSize: 11,
  },
  modalFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: ResponsivePixels.size20,
    paddingVertical: ResponsivePixels.size16,
    borderTopWidth: 1,
  },
  modalDoneBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalDoneBtnText: {
    ...Typography.bodyLargePoppinsSemiBold,
    color: '#FFFFFF',
    fontSize: 15,
  },
});

export default VoiceStudioModal;
