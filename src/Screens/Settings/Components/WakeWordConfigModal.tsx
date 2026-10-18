import React, { useState, useMemo, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Platform,
} from 'react-native';
import {
  X,
  Mic,
  Check,
  AlertTriangle,
  Info,
  Sparkles,
  Zap,
  Play,
  RotateCcw,
  Sliders,
  ShieldCheck,
} from 'lucide-react-native';
import Toast from 'react-native-toast-message';
import { Typography } from '../../../Theme/Typographys';
import { Colors as StaticColors } from '../../../Assets/StyleUtilities/Colors';
import ResponsivePixels from '../../../Assets/StyleUtilities/ResponsivePixels';
import { useSettingsTheme } from './types';
import {
  WakeWordPreset,
  WakeWordValidationResult,
  WakeWordTestResult,
  SUPPORTED_WAKE_WORD_PRESETS,
  DEFAULT_WAKE_WORD_PRESET,
  validateWakePhrase,
  testWakeWordRecognition,
  ENGINE_LIMITATIONS,
  formatWakePhrase,
} from '../../../Services/WakeWord/WakeWordService';

interface WakeWordConfigModalProps {
  visible: boolean;
  onClose: () => void;
  currentPhrase: string;
  onSaveWakeWord: (phrase: string) => Promise<boolean>;
}

export const WakeWordConfigModal: React.FC<WakeWordConfigModalProps> = ({
  visible,
  onClose,
  currentPhrase,
  onSaveWakeWord,
}) => {
  const {
    isDarkMode,
    cardBg,
    textPrimary,
    textSecondary,
    borderLight,
    surfaceAlt,
    bgMain,
  } = useSettingsTheme();

  const [selectedPhrase, setSelectedPhrase] = useState(currentPhrase);
  const [customInput, setCustomInput] = useState('');
  const [testTranscript, setTestTranscript] = useState('Hey Regius add a task');
  const [isCustomMode, setIsCustomMode] = useState(false);

  useEffect(() => {
    setSelectedPhrase(currentPhrase);
    const isPreset = SUPPORTED_WAKE_WORD_PRESETS.some(
      p => p.phrase.toLowerCase() === currentPhrase.toLowerCase(),
    );
    if (!isPreset) {
      setCustomInput(currentPhrase);
      setIsCustomMode(true);
    } else {
      setIsCustomMode(false);
    }
  }, [currentPhrase, visible]);

  // Active validation of current candidate
  const candidatePhrase = isCustomMode ? customInput : selectedPhrase;
  const validation: WakeWordValidationResult = useMemo(
    () => validateWakePhrase(candidatePhrase),
    [candidatePhrase],
  );

  // Live test result of developer test transcript against current candidate
  const testResult: WakeWordTestResult = useMemo(() => {
    if (!testTranscript.trim() || !candidatePhrase.trim()) {
      return {
        inputTranscript: testTranscript,
        targetPhrase: candidatePhrase,
        detected: false,
        analysis: 'Enter a sample transcript to test recognition.',
      };
    }
    return testWakeWordRecognition(testTranscript, candidatePhrase);
  }, [testTranscript, candidatePhrase]);

  const handleSelectPreset = (preset: WakeWordPreset) => {
    setIsCustomMode(false);
    setSelectedPhrase(preset.phrase);
    setTestTranscript(`${preset.phrase} remind me to stretch`);
  };

  const handleCustomInputChange = (text: string) => {
    setIsCustomMode(true);
    setCustomInput(text);
  };

  const handleApply = async () => {
    if (!validation.isValid) {
      Toast.show({
        type: 'error',
        text1: 'Invalid Wake Phrase',
        text2: validation.error || 'Please choose a valid wake phrase.',
      });
      return;
    }

    const success = await onSaveWakeWord(validation.phrase);
    if (success) {
      onClose();
    }
  };

  const handleResetDefault = async () => {
    setIsCustomMode(false);
    setSelectedPhrase(DEFAULT_WAKE_WORD_PRESET.phrase);
    setCustomInput('');
    await onSaveWakeWord(DEFAULT_WAKE_WORD_PRESET.phrase);
    onClose();
  };

  const SAMPLE_TRANSCRIPTS = [
    { label: 'Exact Trigger', text: `${candidatePhrase} what is my next task` },
    { label: 'Phonetic STT Noise', text: 'regions set a reminder for 5 PM' },
    {
      label: 'Embedded Sentence',
      text: `I think ${candidatePhrase} add grocery item`,
    },
    { label: 'Wake-Word Only', text: candidatePhrase },
  ];

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View
          style={[
            styles.modalContainer,
            { backgroundColor: cardBg, borderColor: borderLight },
          ]}
        >
          {/* Header */}
          <View
            style={[styles.modalHeader, { borderBottomColor: borderLight }]}
          >
            <View style={styles.headerTitleRow}>
              <View style={styles.headerIconBadge}>
                <Sliders size={20} color={StaticColors.LavenderPurple} />
              </View>
              <View>
                <Text style={[styles.modalTitle, { color: textPrimary }]}>
                  Wake Word Studio
                </Text>
                <Text style={[styles.modalSubtitle, { color: textSecondary }]}>
                  Configure & test hands-free trigger phrases
                </Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={onClose}
              style={[styles.closeButton, { backgroundColor: surfaceAlt }]}
              activeOpacity={0.7}
            >
              <X size={18} color={textPrimary} />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.modalBody}
            contentContainerStyle={styles.modalBodyContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Active Configuration Summary Badge */}
            <View
              style={[
                styles.activeConfigCard,
                {
                  backgroundColor: isDarkMode ? '#1A2332' : '#F0F7FF',
                  borderColor: isDarkMode ? '#2B4365' : '#BAE6FD',
                },
              ]}
            >
              <View style={styles.activeConfigTop}>
                <View style={styles.activeConfigLabelRow}>
                  <Sparkles size={14} color="#0284C7" />
                  <Text style={styles.activeConfigLabel}>ACTIVE WAKE WORD</Text>
                </View>
                <View style={styles.activePulseBadge}>
                  <View style={styles.pulseDot} />
                  <Text style={styles.pulseText}>Listening Enabled</Text>
                </View>
              </View>
              <Text style={[styles.activePhraseText, { color: textPrimary }]}>
                “{currentPhrase}”
              </Text>
              <Text style={[styles.activeDescText, { color: textSecondary }]}>
                Regius wakes immediately upon detecting this phrase and prompts
                with neural voice greeting.
              </Text>
            </View>

            {/* Presets Section */}
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionHeading, { color: textPrimary }]}>
                Supported Presets (Optimized)
              </Text>
              <Text
                style={[styles.sectionSubheading, { color: textSecondary }]}
              >
                Includes pre-tuned phonetic and acoustic STT misrecognition maps
              </Text>
            </View>

            <View style={styles.presetList}>
              {SUPPORTED_WAKE_WORD_PRESETS.map(preset => {
                const isSelected =
                  !isCustomMode &&
                  selectedPhrase.toLowerCase() === preset.phrase.toLowerCase();
                return (
                  <TouchableOpacity
                    key={preset.id}
                    activeOpacity={0.85}
                    style={[
                      styles.presetCard,
                      {
                        backgroundColor: isSelected
                          ? isDarkMode
                            ? '#241D3B'
                            : '#F5F3FF'
                          : surfaceAlt,
                        borderColor: isSelected
                          ? StaticColors.LavenderPurple
                          : borderLight,
                      },
                    ]}
                    onPress={() => handleSelectPreset(preset)}
                  >
                    <View style={styles.presetCardHeader}>
                      <View style={styles.presetTitleWithBadge}>
                        <Text
                          style={[
                            styles.presetPhraseText,
                            {
                              color: isSelected
                                ? StaticColors.LavenderPurple
                                : textPrimary,
                            },
                          ]}
                        >
                          “{preset.phrase}”
                        </Text>
                        <View style={styles.officialBadge}>
                          <ShieldCheck size={11} color="#059669" />
                          <Text style={styles.officialBadgeText}>
                            Tuned STT
                          </Text>
                        </View>
                      </View>
                      <View
                        style={[
                          styles.radioDot,
                          {
                            borderColor: isSelected
                              ? StaticColors.LavenderPurple
                              : borderLight,
                            backgroundColor: isSelected
                              ? StaticColors.LavenderPurple
                              : 'transparent',
                          },
                        ]}
                      >
                        {isSelected && (
                          <Check size={11} color="#FFFFFF" strokeWidth={3} />
                        )}
                      </View>
                    </View>

                    <Text style={[styles.presetDesc, { color: textSecondary }]}>
                      {preset.description}
                    </Text>

                    <View style={styles.aliasesContainer}>
                      <Text
                        style={[styles.aliasesLabel, { color: textSecondary }]}
                      >
                        STT Variants:
                      </Text>
                      <Text
                        style={[styles.aliasesText, { color: textSecondary }]}
                      >
                        {preset.aliases.slice(0, 5).join(', ')}
                        {preset.aliases.length > 5
                          ? ` +${preset.aliases.length - 5} more`
                          : ''}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Custom Wake Phrase Input */}
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionHeading, { color: textPrimary }]}>
                Custom Wake Phrase (Experimental)
              </Text>
              <Text
                style={[styles.sectionSubheading, { color: textSecondary }]}
              >
                Configure any custom assistant name or attention phrase
              </Text>
            </View>

            <View
              style={[
                styles.customInputCard,
                {
                  backgroundColor: surfaceAlt,
                  borderColor: isCustomMode
                    ? validation.isValid
                      ? StaticColors.LavenderPurple
                      : '#EF4444'
                    : borderLight,
                },
              ]}
            >
              <View style={styles.inputRow}>
                <Mic size={18} color={StaticColors.LavenderPurple} />
                <TextInput
                  style={[styles.textInput, { color: textPrimary }]}
                  placeholder="e.g. Hey Aria, Hello Jarvis, Hey Luna"
                  placeholderTextColor={textSecondary}
                  value={customInput}
                  onChangeText={handleCustomInputChange}
                  autoCapitalize="words"
                />
                {customInput.length > 0 && (
                  <TouchableOpacity
                    onPress={() => setCustomInput('')}
                    style={styles.inputClearButton}
                  >
                    <X size={14} color={textSecondary} />
                  </TouchableOpacity>
                )}
              </View>

              {/* Validation Status Box */}
              {isCustomMode && (
                <View
                  style={[
                    styles.validationBox,
                    {
                      backgroundColor: validation.isValid
                        ? validation.warning
                          ? isDarkMode
                            ? '#332308'
                            : '#FFFBEB'
                          : isDarkMode
                          ? '#0D2E1C'
                          : '#ECFDF5'
                        : isDarkMode
                        ? '#351212'
                        : '#FEF2F2',
                      borderColor: validation.isValid
                        ? validation.warning
                          ? '#F59E0B'
                          : '#10B981'
                        : '#EF4444',
                    },
                  ]}
                >
                  <View style={styles.validationRow}>
                    {validation.isValid ? (
                      validation.warning ? (
                        <AlertTriangle size={15} color="#D97706" />
                      ) : (
                        <Check size={15} color="#059669" strokeWidth={2.5} />
                      )
                    ) : (
                      <X size={15} color="#DC2626" />
                    )}
                    <Text
                      style={[
                        styles.validationText,
                        {
                          color: validation.isValid
                            ? validation.warning
                              ? '#B45309'
                              : '#047857'
                            : '#B91C1C',
                        },
                      ]}
                    >
                      {validation.error ||
                        validation.warning ||
                        `Valid: Assistant recognized as “${validation.name}”`}
                    </Text>
                  </View>
                </View>
              )}
            </View>

            {/* Engine Architecture & Limitations Info */}
            <View
              style={[
                styles.engineInfoCard,
                {
                  backgroundColor: isDarkMode ? '#1E252F' : '#F8FAFC',
                  borderColor: isDarkMode ? '#334155' : '#E2E8F0',
                },
              ]}
            >
              <View style={styles.engineInfoHeader}>
                <Info size={16} color="#3B82F6" />
                <Text style={styles.engineInfoTitle}>
                  Detection Engine Architecture & Limitations
                </Text>
              </View>
              <Text style={[styles.engineInfoBody, { color: textSecondary }]}>
                • <Text style={styles.boldText}>Engine Type:</Text> Regius uses
                mobile OS Speech-to-Text continuous keyword matching (
                <Text style={styles.codeText}>@react-native-voice/voice</Text>
                ).
              </Text>
              <Text style={[styles.engineInfoBody, { color: textSecondary }]}>
                •{' '}
                <Text style={styles.boldText}>Not Acoustic DSP Hardware:</Text>{' '}
                Unlike Porcupine or Snowboy, this engine works on live STT text
                transcriptions rather than raw audio MFCC frames.
              </Text>
              <Text style={[styles.engineInfoBody, { color: textSecondary }]}>
                • <Text style={styles.boldText}>Why Presets Excel:</Text>{' '}
                Official presets include extensive phonetic misrecognition
                patterns to compensate for native speech engine quirks. Custom
                phrases work via fuzzy distance and token parsing.
              </Text>
            </View>

            {/* Developer Recognition Playground */}
            <View style={styles.sectionHeader}>
              <View style={styles.devBadgeRow}>
                <Zap size={15} color="#F59E0B" />
                <Text style={[styles.sectionHeading, { color: textPrimary }]}>
                  Developer Recognition Tester
                </Text>
              </View>
              <Text
                style={[styles.sectionSubheading, { color: textSecondary }]}
              >
                Validate live trigger matching against candidate: “
                {validation.isValid ? validation.phrase : candidatePhrase}”
              </Text>
            </View>

            <View
              style={[
                styles.testPlaygroundCard,
                { backgroundColor: surfaceAlt, borderColor: borderLight },
              ]}
            >
              <Text style={[styles.playgroundLabel, { color: textSecondary }]}>
                Input Simulated Transcript:
              </Text>
              <TextInput
                style={[
                  styles.testTranscriptInput,
                  {
                    color: textPrimary,
                    backgroundColor: cardBg,
                    borderColor: borderLight,
                  },
                ]}
                value={testTranscript}
                onChangeText={setTestTranscript}
                placeholder="Type sample spoken transcript here..."
                placeholderTextColor={textSecondary}
              />

              {/* Sample Chips */}
              <View style={styles.chipRow}>
                {SAMPLE_TRANSCRIPTS.map((chip, idx) => (
                  <TouchableOpacity
                    key={idx}
                    activeOpacity={0.7}
                    style={[
                      styles.sampleChip,
                      {
                        backgroundColor: cardBg,
                        borderColor: borderLight,
                      },
                    ]}
                    onPress={() => setTestTranscript(chip.text)}
                  >
                    <Text
                      style={[styles.sampleChipText, { color: textSecondary }]}
                    >
                      {chip.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Recognition Result Dashboard */}
              <View
                style={[
                  styles.resultDashboard,
                  {
                    backgroundColor: testResult.detected
                      ? isDarkMode
                        ? '#0E3A20'
                        : '#EDFDF5'
                      : isDarkMode
                      ? '#2A2A30'
                      : '#F3F4F6',
                    borderColor: testResult.detected ? '#10B981' : borderLight,
                  },
                ]}
              >
                <View style={styles.resultHeader}>
                  <Text style={styles.resultLabel}>DETECTION RESULT</Text>
                  <View
                    style={[
                      styles.statusPill,
                      {
                        backgroundColor: testResult.detected
                          ? '#10B981'
                          : '#6B7280',
                      },
                    ]}
                  >
                    <Text style={styles.statusPillText}>
                      {testResult.detected
                        ? 'TRIGGER MATCHED ✓'
                        : 'NO TRIGGER MATCH'}
                    </Text>
                  </View>
                </View>

                {testResult.detected && (
                  <View style={styles.matchDetails}>
                    <View style={styles.detailRow}>
                      <Text
                        style={[styles.detailKey, { color: textSecondary }]}
                      >
                        Matched Word:
                      </Text>
                      <Text
                        style={[styles.detailValue, { color: textPrimary }]}
                      >
                        “{testResult.matchedPhrase}”
                      </Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text
                        style={[styles.detailKey, { color: textSecondary }]}
                      >
                        Match Method:
                      </Text>
                      <Text
                        style={[styles.detailValue, { color: textPrimary }]}
                      >
                        {testResult.matchType === 'exact_phrase'
                          ? 'Direct Regex'
                          : testResult.matchType === 'phonetic_alias'
                          ? 'STT Phonetic Alias'
                          : 'Fuzzy Levenshtein'}
                      </Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text
                        style={[styles.detailKey, { color: textSecondary }]}
                      >
                        Extracted Command:
                      </Text>
                      <Text
                        style={[
                          styles.detailValue,
                          {
                            color: testResult.remainingCommand
                              ? StaticColors.LavenderPurple
                              : textSecondary,
                            fontStyle: testResult.remainingCommand
                              ? 'normal'
                              : 'italic',
                          },
                        ]}
                      >
                        {testResult.remainingCommand
                          ? `“${testResult.remainingCommand}”`
                          : '(Wake word only - ready for command)'}
                      </Text>
                    </View>
                  </View>
                )}

                <Text style={[styles.analysisText, { color: textSecondary }]}>
                  {testResult.analysis}
                </Text>
              </View>
            </View>
          </ScrollView>

          {/* Modal Footer */}
          <View style={[styles.modalFooter, { borderTopColor: borderLight }]}>
            <TouchableOpacity
              activeOpacity={0.7}
              style={[styles.resetButton, { borderColor: borderLight }]}
              onPress={handleResetDefault}
            >
              <RotateCcw size={15} color={textSecondary} />
              <Text style={[styles.resetButtonText, { color: textSecondary }]}>
                Default
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.85}
              style={[
                styles.applyButton,
                {
                  backgroundColor: validation.isValid
                    ? StaticColors.LavenderPurple
                    : '#9CA3AF',
                },
              ]}
              disabled={!validation.isValid}
              onPress={handleApply}
            >
              <Check size={16} color="#FFFFFF" strokeWidth={2.5} />
              <Text style={styles.applyButtonText}>
                Apply “{validation.isValid ? validation.phrase : 'Wake Word'}”
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderWidth: 1,
    maxHeight: '90%',
    paddingBottom: Platform.OS === 'ios' ? 24 : 16,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: ResponsivePixels.size20,
    paddingVertical: ResponsivePixels.size16,
    borderBottomWidth: 1,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerIconBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(131, 131, 214, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalTitle: {
    ...Typography.h6Bold,
    fontSize: 17,
  },
  modalSubtitle: {
    ...Typography.bodySmallPoppinsRegular,
    fontSize: 12,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBody: {
    flexGrow: 0,
  },
  modalBodyContent: {
    paddingHorizontal: ResponsivePixels.size20,
    paddingTop: ResponsivePixels.size16,
    paddingBottom: ResponsivePixels.size24,
  },
  activeConfigCard: {
    borderRadius: 18,
    borderWidth: 1.5,
    padding: ResponsivePixels.size16,
    marginBottom: ResponsivePixels.size20,
  },
  activeConfigTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  activeConfigLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  activeConfigLabel: {
    ...Typography.bodySuperSmallPoppinsSemiBoldLoose,
    fontSize: 11,
    color: '#0284C7',
    letterSpacing: 0.8,
  },
  activePulseBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
  },
  pulseText: {
    ...Typography.bodySuperSmallPoppinsRegularLoose,
    fontSize: 11,
    color: '#059669',
    fontWeight: '600',
  },
  activePhraseText: {
    ...Typography.h5SemiBold,
    fontSize: 20,
    marginBottom: 4,
  },
  activeDescText: {
    ...Typography.bodySmallPoppinsRegular,
    fontSize: 12,
    lineHeight: 18,
  },
  sectionHeader: {
    marginBottom: 10,
    marginTop: 8,
  },
  sectionHeading: {
    ...Typography.bodyMediumPoppinsSemiBold,
    fontSize: 14,
  },
  sectionSubheading: {
    ...Typography.bodySmallPoppinsRegular,
    fontSize: 12,
  },
  presetList: {
    gap: 10,
    marginBottom: ResponsivePixels.size20,
  },
  presetCard: {
    borderRadius: 16,
    borderWidth: 1.5,
    padding: ResponsivePixels.size14,
  },
  presetCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  presetTitleWithBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  presetPhraseText: {
    ...Typography.bodyMediumPoppinsSemiBold,
    fontSize: 15,
  },
  officialBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#EDFDF5',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  officialBadgeText: {
    ...Typography.bodySuperSmallPoppinsRegularLoose,
    fontSize: 10,
    color: '#059669',
    fontWeight: '600',
  },
  radioDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  presetDesc: {
    ...Typography.bodySmallPoppinsRegular,
    fontSize: 12,
    marginBottom: 6,
  },
  aliasesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 4,
  },
  aliasesLabel: {
    ...Typography.bodySuperSmallPoppinsSemiBoldLoose,
    fontSize: 11,
  },
  aliasesText: {
    ...Typography.bodySuperSmallPoppinsRegularLoose,
    fontSize: 11,
  },
  customInputCard: {
    borderRadius: 16,
    borderWidth: 1.5,
    padding: ResponsivePixels.size14,
    marginBottom: ResponsivePixels.size20,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  textInput: {
    flex: 1,
    ...Typography.bodyMediumPoppinsSemiBold,
    fontSize: 14,
    paddingVertical: 6,
  },
  inputClearButton: {
    padding: 6,
  },
  validationBox: {
    marginTop: 10,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
  },
  validationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  validationText: {
    flex: 1,
    ...Typography.bodySmallPoppinsRegular,
    fontSize: 12,
    lineHeight: 16,
  },
  engineInfoCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: ResponsivePixels.size14,
    marginBottom: ResponsivePixels.size20,
  },
  engineInfoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  engineInfoTitle: {
    ...Typography.bodySmallPoppinsSemiBold,
    fontSize: 13,
    color: '#2563EB',
  },
  engineInfoBody: {
    ...Typography.bodySmallPoppinsRegular,
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 6,
  },
  boldText: {
    fontWeight: '700',
  },
  codeText: {
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontSize: 11,
  },
  devBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  testPlaygroundCard: {
    borderRadius: 16,
    borderWidth: 1.5,
    padding: ResponsivePixels.size14,
  },
  playgroundLabel: {
    ...Typography.bodySuperSmallPoppinsSemiBoldLoose,
    fontSize: 11,
    marginBottom: 6,
  },
  testTranscriptInput: {
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
    ...Typography.bodySmallPoppinsRegular,
    fontSize: 13,
    marginBottom: 10,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 12,
  },
  sampleChip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
  },
  sampleChipText: {
    ...Typography.bodySuperSmallPoppinsRegularLoose,
    fontSize: 11,
  },
  resultDashboard: {
    borderRadius: 12,
    borderWidth: 1.5,
    padding: 12,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  resultLabel: {
    ...Typography.bodySuperSmallPoppinsSemiBoldLoose,
    fontSize: 10,
    color: '#6B7280',
    letterSpacing: 0.8,
  },
  statusPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusPillText: {
    ...Typography.bodySuperSmallPoppinsSemiBoldLoose,
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  matchDetails: {
    gap: 4,
    marginBottom: 8,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.06)',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailKey: {
    ...Typography.bodySuperSmallPoppinsRegularLoose,
    fontSize: 11,
  },
  detailValue: {
    ...Typography.bodySuperSmallPoppinsSemiBoldLoose,
    fontSize: 12,
  },
  analysisText: {
    ...Typography.bodySuperSmallPoppinsRegularLoose,
    fontSize: 11,
    lineHeight: 15,
  },
  modalFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: ResponsivePixels.size20,
    paddingTop: ResponsivePixels.size14,
    borderTopWidth: 1,
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1,
  },
  resetButtonText: {
    ...Typography.bodySmallPoppinsSemiBold,
    fontSize: 13,
  },
  applyButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 14,
  },
  applyButtonText: {
    ...Typography.bodyMediumPoppinsSemiBold,
    fontSize: 14,
    color: '#FFFFFF',
  },
});

export default WakeWordConfigModal;
