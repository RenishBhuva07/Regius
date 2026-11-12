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
  'Hey Regius, ready when you are.',
  'Meeting with the team at 3:00 PM today.',
  'Great job! You completed your daily meditation habit.',
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

  const selectedVoice = voices.find(v => v.id === selectedVoiceId) || voices[0];

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
          {
            backgroundColor: isDarkMode
              ? StaticColors.DarkBackground
              : StaticColors.PureWhite,
          },
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
            <X size={ResponsivePixels.size20} color={textPrimary} strokeWidth={2.4} />
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
                <Sparkles size={ResponsivePixels.size18} color={selectedVoice.accentColor} />
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
                  {selectedVoice.name}
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
                  <Volume2 size={ResponsivePixels.size16} color={selectedVoice.accentColor} />
                )}
                <Text
                  style={[
                    styles.statusText,
                    {
                      color:
                        synthesisState === 'error'
                          ? StaticColors.CategoryRedAccent
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
                  <ActivityIndicator
                    size="small"
                    color={StaticColors.PureWhite}
                  />
                ) : (
                  <Play
                    size={ResponsivePixels.size14}
                    color={StaticColors.PureWhite}
                    fill={StaticColors.PureWhite}
                  />
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
                  <StopCircle size={ResponsivePixels.size15} color={StaticColors.PureWhite} />
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
                        size={ResponsivePixels.size20}
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
                            {voice.accent} • {voice.gender}
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
                          ? StaticColors.MidnightCharcoal
                          : voice.accentColor,
                      },
                    ]}
                    onPress={e => {
                      e.stopPropagation();
                      onTogglePreview(voice.id);
                    }}
                  >
                    {isPlaying ? (
                      <Square
                        size={ResponsivePixels.size13}
                        color={StaticColors.PureWhite}
                        fill={StaticColors.PureWhite}
                      />
                    ) : (
                      <Play
                        size={ResponsivePixels.size13}
                        color={StaticColors.PureWhite}
                        fill={StaticColors.PureWhite}
                      />
                    )}
                  </TouchableOpacity>
                </View>

                <View
                  style={[
                    styles.sampleQuoteBox,
                    {
                      backgroundColor: isSelected
                        ? StaticColors.PureWhite
                        : surfaceAlt,
                    },
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
                        size={ResponsivePixels.size16}
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
    fontSize: ResponsivePixels.size18,
  },
  modalSubtitle: {
    ...Typography.bodySmallPoppinsRegular,
    fontSize: ResponsivePixels.size12,
    marginTop: ResponsivePixels.size2,
  },
  modalCloseBtn: {
    width: ResponsivePixels.size36,
    height: ResponsivePixels.size36,
    borderRadius: ResponsivePixels.size18,
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
    gap: ResponsivePixels.size14,
  },
  playgroundCard: {
    borderWidth: 1.5,
    borderRadius: ResponsivePixels.size18,
    padding: ResponsivePixels.size16,
    marginBottom: ResponsivePixels.size4,
  },
  playgroundHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: ResponsivePixels.size12,
  },
  playgroundTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ResponsivePixels.size8,
  },
  playgroundTitle: {
    ...Typography.bodyLargePoppinsSemiBold,
    fontSize: ResponsivePixels.size15,
  },
  activeVoiceTag: {
    paddingHorizontal: ResponsivePixels.size8,
    paddingVertical: ResponsivePixels.size3,
    borderRadius: ResponsivePixels.size8,
  },
  activeVoiceTagText: {
    ...Typography.bodySmallPoppinsSemiBold,
    fontSize: ResponsivePixels.size11,
  },
  playgroundInput: {
    borderWidth: 1,
    borderRadius: ResponsivePixels.size12,
    padding: ResponsivePixels.size12,
    fontSize: ResponsivePixels.size13,
    textAlignVertical: 'top',
    minHeight: ResponsivePixels.size70,
    fontFamily: Typography.bodySmallPoppinsRegular.fontFamily,
  },
  presetsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: ResponsivePixels.size6,
    marginTop: ResponsivePixels.size10,
  },
  presetChip: {
    paddingHorizontal: ResponsivePixels.size10,
    paddingVertical: ResponsivePixels.size5,
    borderRadius: ResponsivePixels.size8,
    maxWidth: '100%',
  },
  presetChipText: {
    fontSize: ResponsivePixels.size11,
    fontFamily: Typography.bodySmallPoppinsRegular.fontFamily,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ResponsivePixels.size8,
    marginTop: ResponsivePixels.size10,
  },
  statusText: {
    ...Typography.bodySmallPoppinsSemiBold,
    fontSize: ResponsivePixels.size12,
  },
  playgroundActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ResponsivePixels.size10,
    marginTop: ResponsivePixels.size12,
  },
  generateBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: ResponsivePixels.size8,
    paddingVertical: ResponsivePixels.size12,
    borderRadius: ResponsivePixels.size12,
  },
  generateBtnText: {
    ...Typography.bodySmallPoppinsSemiBold,
    color: StaticColors.PureWhite,
    fontSize: ResponsivePixels.size13,
  },
  stopBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: ResponsivePixels.size6,
    backgroundColor: StaticColors.CategoryRedAccent,
    paddingVertical: ResponsivePixels.size12,
    paddingHorizontal: ResponsivePixels.size16,
    borderRadius: ResponsivePixels.size12,
  },
  stopBtnText: {
    ...Typography.bodySmallPoppinsSemiBold,
    color: StaticColors.PureWhite,
    fontSize: ResponsivePixels.size13,
  },
  voiceListHeaderTitle: {
    ...Typography.bodySmallPoppinsSemiBold,
    fontSize: ResponsivePixels.size12,
    letterSpacing: 0.8,
    marginTop: ResponsivePixels.size6,
  },
  voiceCardDetailed: {
    borderWidth: 1.5,
    borderRadius: ResponsivePixels.size18,
    padding: ResponsivePixels.size16,
  },
  voiceDetailedTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  voiceDetailedLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ResponsivePixels.size12,
    flex: 1,
  },
  voiceDetailedIcon: {
    width: ResponsivePixels.size44,
    height: ResponsivePixels.size44,
    borderRadius: ResponsivePixels.size14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  voiceNameRowDetailed: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ResponsivePixels.size8,
  },
  voiceDetailedName: {
    ...Typography.bodyLargePoppinsSemiBold,
    fontSize: ResponsivePixels.size16,
  },
  kokoroIdBadge: {
    paddingHorizontal: ResponsivePixels.size6,
    paddingVertical: ResponsivePixels.size2,
    borderRadius: ResponsivePixels.size6,
    borderWidth: 1,
  },
  kokoroIdBadgeText: {
    fontSize: ResponsivePixels.size10,
    fontWeight: '700',
    fontFamily: Typography.bodySmallRanadeBold.fontFamily,
  },
  activeBadgePill: {
    paddingHorizontal: ResponsivePixels.size6,
    paddingVertical: ResponsivePixels.size2,
    borderRadius: ResponsivePixels.size6,
  },
  activeBadgePillText: {
    fontFamily: Typography.bodySmallRanadeBold.fontFamily,
    fontSize: ResponsivePixels.size9,
    color: StaticColors.PureWhite,
    fontWeight: '700',
  },
  voiceDetailedMeta: {
    ...Typography.bodySmallPoppinsRegular,
    fontSize: ResponsivePixels.size11,
    marginTop: ResponsivePixels.size2,
  },
  voicePreviewCircleBtn: {
    width: ResponsivePixels.size38,
    height: ResponsivePixels.size38,
    borderRadius: ResponsivePixels.size19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sampleQuoteBox: {
    padding: ResponsivePixels.size10,
    borderRadius: ResponsivePixels.size12,
    marginTop: ResponsivePixels.size12,
  },
  sampleQuoteText: {
    ...Typography.bodySmallPoppinsRegular,
    fontSize: ResponsivePixels.size12,
    fontStyle: 'italic',
  },
  voiceActionFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: ResponsivePixels.size10,
  },
  voiceTagSmall: {
    borderRadius: ResponsivePixels.size6,
  },
  voiceTagSmallText: {
    ...Typography.bodySmallPoppinsSemiBold,
    fontSize: ResponsivePixels.size11,
  },
  selectedConfirmRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ResponsivePixels.size4,
  },
  selectedConfirmText: {
    ...Typography.bodySmallPoppinsSemiBold,
    fontSize: ResponsivePixels.size12,
  },
  selectPromptText: {
    ...Typography.bodySmallPoppinsRegular,
    fontSize: ResponsivePixels.size11,
  },
  modalFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ResponsivePixels.size12,
    paddingHorizontal: ResponsivePixels.size20,
    paddingVertical: ResponsivePixels.size16,
    borderTopWidth: 1,
  },
  modalDoneBtn: {
    flex: 1,
    paddingVertical: ResponsivePixels.size14,
    borderRadius: ResponsivePixels.size16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalDoneBtnText: {
    ...Typography.bodyLargePoppinsSemiBold,
    color: StaticColors.PureWhite,
    fontSize: ResponsivePixels.size15,
  },
});

export default VoiceStudioModal;
