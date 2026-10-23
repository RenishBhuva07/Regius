import React, { useState, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  StatusBar,
  Platform,
  Switch,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import {
  ChevronLeft,
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
  Radio,
} from 'lucide-react-native';
import Toast from 'react-native-toast-message';

import { Typography } from '../../Theme/Typographys';
import { Fonts } from '../../Theme/fonts';
import { Colors } from '../../Assets/StyleUtilities/Colors';
import ResponsivePixels from '../../Assets/StyleUtilities/ResponsivePixels';
import { Badge } from '../../Common/Badge';
import { ProBadge } from '../../Common/ProBadge';
import CustomButton from '../../Common/CustomButton';
import { useTheme } from '../../Theme/ThemeContext';
import { useVoiceWakeWord } from '../../Context/VoiceWakeWordContext';
import {
  SUPPORTED_WAKE_WORD_PRESETS,
  DEFAULT_WAKE_WORD_PRESET,
  validateWakePhrase,
  testWakeWordRecognition,
  WakeWordPreset,
  WakeWordValidationResult,
  WakeWordTestResult,
} from '../../Services/WakeWord/WakeWordService';

export const WakeWordStudioScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const { isDarkMode } = useTheme();

  const {
    wakeWordPhrase,
    setWakeWordPhrase,
    isWakeWordEnabled,
    setWakeWordEnabled,
  } = useVoiceWakeWord();

  const [selectedPhrase, setSelectedPhrase] = useState(wakeWordPhrase);
  const [customInput, setCustomInput] = useState('');
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [testTranscript, setTestTranscript] = useState('Hey Regius add a task');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setSelectedPhrase(wakeWordPhrase);
    const isPreset = SUPPORTED_WAKE_WORD_PRESETS.some(
      p => p.phrase.toLowerCase() === wakeWordPhrase.toLowerCase(),
    );
    if (!isPreset) {
      setCustomInput(wakeWordPhrase);
      setIsCustomMode(true);
    } else {
      setIsCustomMode(false);
    }
  }, [wakeWordPhrase]);

  const candidatePhrase = isCustomMode ? customInput : selectedPhrase;
  const validation: WakeWordValidationResult = useMemo(
    () => validateWakePhrase(candidatePhrase),
    [candidatePhrase],
  );

  const testResult: WakeWordTestResult = useMemo(() => {
    if (!testTranscript.trim() || !candidatePhrase.trim()) {
      return {
        inputTranscript: testTranscript,
        targetPhrase: candidatePhrase,
        detected: false,
        analysis: 'Enter sample speech to test wake detection.',
      };
    }
    return testWakeWordRecognition(testTranscript, candidatePhrase);
  }, [testTranscript, candidatePhrase]);

  const handleSelectPreset = (preset: WakeWordPreset) => {
    setIsCustomMode(false);
    setSelectedPhrase(preset.phrase);
  };

  const handleEnableCustomMode = () => {
    setIsCustomMode(true);
    if (!customInput) {
      setCustomInput(selectedPhrase);
    }
  };

  const handleSave = async () => {
    if (!candidatePhrase.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Invalid Wake Word',
        text2: 'Phrase cannot be empty.',
      });
      return;
    }

    if (!validation.isValid) {
      Toast.show({
        type: 'error',
        text1: 'Validation Error',
        text2: validation.error || 'Please fix validation issues.',
      });
      return;
    }

    setIsSaving(true);
    try {
      const success = await setWakeWordPhrase(candidatePhrase.trim());
      if (success) {
        Toast.show({
          type: 'success',
          text1: 'Wake Word Updated',
          text2: `Listening for "${candidatePhrase.trim()}"`,
        });
        setTimeout(() => {
          navigation.goBack();
        }, 500);
      }
    } catch {
      Toast.show({
        type: 'error',
        text1: 'Save Failed',
        text2: 'Could not update wake word phrase.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const bgMain = isDarkMode ? '#121417' : Colors.CreamBackground;
  const cardBg = isDarkMode ? '#1E2228' : Colors.DefaultWhite;
  const textPrimary = isDarkMode
    ? Colors.PureWhiteText
    : Colors.MidnightInkText;
  const textSecondary = isDarkMode ? '#A3A8B1' : Colors.SubtitleGray;
  const borderLight = isDarkMode ? '#2C3035' : '#E8E2D5';
  const surfaceAlt = isDarkMode ? '#171A1F' : '#FAF8F5';

  return (
    <View style={[styles.container, { backgroundColor: bgMain }]}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        {...(Platform.OS === 'android' ? { backgroundColor: bgMain } : {})}
      />

      {/* Screen Header */}
      <View
        style={[
          styles.headerRow,
          {
            paddingTop: insets.top + 8,
            borderBottomColor: borderLight,
          },
        ]}
      >
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => navigation.goBack()}
          style={[
            styles.backButton,
            {
              backgroundColor: cardBg,
              borderColor: borderLight,
            },
          ]}
          accessibilityRole="button"
          accessibilityLabel="Back to Settings"
        >
          <ChevronLeft size={20} color={textPrimary} strokeWidth={2.4} />
        </TouchableOpacity>

        <View style={styles.headerTitleWrap}>
          <Text style={[styles.headerTitle, { color: textPrimary }]}>
            Wake Word Studio
          </Text>
          <Text style={[styles.headerSubtitle, { color: textSecondary }]}>
            Voice Engine & Detection
          </Text>
        </View>

        <Badge label="ALWAYS ON" variant="yellow" size="sm" />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 40 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Master Hands-Free Switch Card */}
        <View
          style={[
            styles.masterSwitchCard,
            {
              backgroundColor: cardBg,
              borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.12)' : '#FFFFFF',
              borderBottomColor: isDarkMode ? '#171A20' : '#E2DCD0',
              shadowColor: isDarkMode ? '#000000' : 'rgba(131, 131, 214, 0.14)',
            },
          ]}
        >
          <View style={styles.masterSwitchLeft}>
            <View
              style={[
                styles.iconSquare,
                {
                  backgroundColor: isWakeWordEnabled ? '#FFFCEB' : surfaceAlt,
                },
              ]}
            >
              <Mic
                size={20}
                color={isWakeWordEnabled ? '#F5C518' : textSecondary}
                strokeWidth={2.4}
              />
            </View>
            <View style={styles.masterSwitchMeta}>
              <View style={styles.masterTitleRow}>
                <Text
                  style={[styles.masterSwitchTitle, { color: textPrimary }]}
                >
                  Hands-Free Listening
                </Text>
                <Badge
                  label={isWakeWordEnabled ? 'ACTIVE' : 'MUTED'}
                  variant={isWakeWordEnabled ? 'green' : 'neutral'}
                  size="sm"
                />
              </View>
              <Text style={[styles.masterSwitchDesc, { color: textSecondary }]}>
                {isWakeWordEnabled
                  ? `Say "${wakeWordPhrase}" anywhere in app to trigger AI`
                  : 'Microphone wake listening is currently paused'}
              </Text>
            </View>
          </View>

          <Switch
            value={isWakeWordEnabled}
            onValueChange={setWakeWordEnabled}
            trackColor={{
              false: '#D9D9D9',
              true: '#F5C518',
            }}
            thumbColor="#FFFFFF"
          />
        </View>

        {/* Supported Presets Section */}
        <Text style={[styles.sectionHeading, { color: textSecondary }]}>
          CURATED WAKE PHRASES
        </Text>

        <View style={styles.presetsGrid}>
          {SUPPORTED_WAKE_WORD_PRESETS.map(preset => {
            const isSelected =
              !isCustomMode &&
              selectedPhrase.toLowerCase() === preset.phrase.toLowerCase();

            return (
              <TouchableOpacity
                key={preset.id}
                activeOpacity={0.8}
                style={[
                  styles.presetCard,
                  {
                    backgroundColor: cardBg,
                    borderColor: isSelected
                      ? Colors.LavenderPurple
                      : isDarkMode
                      ? 'rgba(255, 255, 255, 0.1)'
                      : '#FFFFFF',
                    borderBottomColor: isSelected
                      ? '#4D4DB8'
                      : isDarkMode
                      ? '#171A20'
                      : '#E2DCD0',
                    shadowColor: isSelected
                      ? Colors.LavenderPurple
                      : isDarkMode
                      ? '#000000'
                      : 'rgba(131, 131, 214, 0.1)',
                  },
                ]}
                onPress={() => handleSelectPreset(preset)}
              >
                <View style={styles.presetTopRow}>
                  <View style={styles.presetNameCol}>
                    <Text
                      style={[styles.presetPhraseText, { color: textPrimary }]}
                    >
                      "{preset.phrase}"
                    </Text>
                    <Text
                      style={[styles.presetNameText, { color: textSecondary }]}
                    >
                      {preset.name}
                    </Text>
                  </View>

                  <View
                    style={[
                      styles.radioCircle,
                      isSelected && styles.radioCircleActive,
                      {
                        borderColor: isSelected
                          ? Colors.LavenderPurple
                          : borderLight,
                      },
                    ]}
                  >
                    {isSelected && (
                      <View
                        style={[
                          styles.radioInner,
                          { backgroundColor: Colors.LavenderPurple },
                        ]}
                      />
                    )}
                  </View>
                </View>

                <Text style={[styles.presetTipsText, { color: textSecondary }]}>
                  {preset.description}
                </Text>

                <View style={styles.presetMetaPills}>
                  <Badge
                    label={preset.category.toUpperCase()}
                    variant="purple"
                    size="sm"
                  />
                  <View style={styles.badgeGap} />
                  <Badge label="OPTIMAL MATCH" variant="green" size="sm" />
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Custom Wake Word Section */}
        <Text style={[styles.sectionHeading, { color: textSecondary }]}>
          CUSTOM WAKE PHRASE
        </Text>

        <View
          style={[
            styles.customPhraseCard,
            {
              backgroundColor: cardBg,
              borderColor: isCustomMode
                ? Colors.LavenderPurple
                : isDarkMode
                ? 'rgba(255, 255, 255, 0.12)'
                : '#FFFFFF',
              borderBottomColor: isCustomMode
                ? '#4D4DB8'
                : isDarkMode
                ? '#171A20'
                : '#E2DCD0',
              shadowColor: isDarkMode ? '#000000' : 'rgba(131, 131, 214, 0.14)',
            },
          ]}
        >
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.customToggleRow}
            onPress={handleEnableCustomMode}
          >
            <View style={styles.customToggleMeta}>
              <Text style={[styles.customTitle, { color: textPrimary }]}>
                Design Your Own Wake Phrase
              </Text>
              <Text style={[styles.customSubtitle, { color: textSecondary }]}>
                Minimum 2 words and 3+ phonetic syllables recommended
              </Text>
            </View>

            <View
              style={[
                styles.radioCircle,
                isCustomMode && styles.radioCircleActive,
                {
                  borderColor: isCustomMode
                    ? Colors.LavenderPurple
                    : borderLight,
                },
              ]}
            >
              {isCustomMode && (
                <View
                  style={[
                    styles.radioInner,
                    { backgroundColor: Colors.LavenderPurple },
                  ]}
                />
              )}
            </View>
          </TouchableOpacity>

          {isCustomMode && (
            <View style={styles.customInputArea}>
              <View
                style={[
                  styles.customInputWrap,
                  { backgroundColor: surfaceAlt, borderColor: borderLight },
                ]}
              >
                <TextInput
                  style={[styles.customInputField, { color: textPrimary }]}
                  value={customInput}
                  onChangeText={setCustomInput}
                  placeholder="e.g. Hey Assistant, Listen Regius"
                  placeholderTextColor={textSecondary}
                  autoCapitalize="words"
                />
              </View>

              {/* Validation Status Banner */}
              <View style={styles.validationRow}>
                {validation.isValid ? (
                  <View style={styles.validStatus}>
                    <ShieldCheck size={16} color="#21AF85" strokeWidth={2.4} />
                    <Text style={styles.validText}>
                      Phrase meets acoustic & syllable standards
                    </Text>
                  </View>
                ) : (
                  <View style={styles.invalidStatus}>
                    <AlertTriangle
                      size={16}
                      color="#FF3B30"
                      strokeWidth={2.4}
                    />
                    <Text style={styles.invalidText}>
                      {validation.error || 'Invalid candidate phrase'}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          )}
        </View>

        {/* Real-time Recognition Simulator */}
        <Text style={[styles.sectionHeading, { color: textSecondary }]}>
          RECOGNITION TEST SIMULATOR
        </Text>

        <View
          style={[
            styles.simulatorCard,
            {
              backgroundColor: cardBg,
              borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.12)' : '#FFFFFF',
              borderBottomColor: isDarkMode ? '#171A20' : '#E2DCD0',
              shadowColor: isDarkMode ? '#000000' : 'rgba(131, 131, 214, 0.14)',
            },
          ]}
        >
          <Text style={[styles.simulatorLabel, { color: textSecondary }]}>
            Enter sample spoken transcript:
          </Text>

          <View
            style={[
              styles.simulatorInputWrap,
              { backgroundColor: surfaceAlt, borderColor: borderLight },
            ]}
          >
            <TextInput
              style={[styles.simulatorInput, { color: textPrimary }]}
              value={testTranscript}
              onChangeText={setTestTranscript}
              placeholder="e.g. Hey Regius schedule meeting"
              placeholderTextColor={textSecondary}
            />
          </View>

          <View
            style={[
              styles.testResultBox,
              {
                backgroundColor: testResult.detected ? '#EDFDF5' : '#FFF0F0',
                borderColor: testResult.detected ? '#C6FFDD' : '#FED6D6',
              },
            ]}
          >
            <View style={styles.resultHeader}>
              <Badge
                label={testResult.detected ? 'DETECTED' : 'NOT DETECTED'}
                variant={testResult.detected ? 'green' : 'red'}
                size="sm"
              />
              <Text
                style={[
                  styles.confidenceScore,
                  { color: testResult.detected ? '#1B9A72' : '#D92A0F' },
                ]}
              >
                Target: "{candidatePhrase}"
              </Text>
            </View>
            <Text
              style={[
                styles.analysisText,
                { color: testResult.detected ? '#1B9A72' : '#D92A0F' },
              ]}
            >
              {testResult.analysis}
            </Text>
          </View>
        </View>

        {/* Save Button */}
        <View style={styles.actionContainer}>
          <CustomButton
            title={isSaving ? 'Activating Wake Word...' : 'Save Wake Phrase'}
            onPress={handleSave}
            disabled={isSaving || !validation.isValid}
            variant="dark"
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default WakeWordStudioScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: ResponsivePixels.size16,
    paddingBottom: ResponsivePixels.size12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitleWrap: {
    alignItems: 'center',
  },
  headerTitle: {
    ...Typography.h5SemiBold,
    fontFamily: Fonts.ranade.bold,
    fontSize: 18,
  },
  headerSubtitle: {
    ...Typography.bodySuperSmallPoppinsRegularLoose,
    fontSize: 11,
    marginTop: 2,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: ResponsivePixels.size16,
    paddingTop: ResponsivePixels.size16,
  },
  masterSwitchCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 20,
    borderWidth: 1,
    borderBottomWidth: 3,
    padding: ResponsivePixels.size16,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
    marginBottom: ResponsivePixels.size20,
  },
  masterSwitchLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingRight: 12,
  },
  iconSquare: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  masterSwitchMeta: {
    flex: 1,
  },
  masterTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  masterSwitchTitle: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: 15,
  },
  masterSwitchDesc: {
    ...Typography.bodySuperSmallPoppinsRegularLoose,
    fontSize: 11,
  },
  sectionHeading: {
    ...Typography.bodySuperSmallPoppinsRegularLoose,
    fontFamily: Fonts.poppins.semiBold,
    fontSize: 11,
    letterSpacing: 1,
    marginBottom: ResponsivePixels.size8,
    marginLeft: 4,
  },
  presetsGrid: {
    gap: 12,
    marginBottom: ResponsivePixels.size20,
  },
  presetCard: {
    borderRadius: 18,
    borderWidth: 1.5,
    borderBottomWidth: 3.5,
    padding: ResponsivePixels.size16,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 2,
  },
  presetTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  presetNameCol: {
    flex: 1,
  },
  presetPhraseText: {
    fontFamily: Fonts.ranade.bold,
    fontSize: 18,
    marginBottom: 2,
  },
  presetNameText: {
    fontFamily: Fonts.poppins.regular,
    fontSize: 12,
  },
  radioCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioCircleActive: {
    borderColor: Colors.LavenderPurple,
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  presetTipsText: {
    ...Typography.bodySmallPoppinsRegular,
    fontSize: 12,
    marginBottom: 10,
  },
  presetMetaPills: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badgeGap: {
    width: 8,
  },
  customPhraseCard: {
    borderRadius: 20,
    borderWidth: 1.5,
    borderBottomWidth: 3.5,
    padding: ResponsivePixels.size16,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
    marginBottom: ResponsivePixels.size20,
  },
  customToggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  customToggleMeta: {
    flex: 1,
    paddingRight: 10,
  },
  customTitle: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: 15,
    marginBottom: 2,
  },
  customSubtitle: {
    ...Typography.bodySuperSmallPoppinsRegularLoose,
    fontSize: 11,
  },
  customInputArea: {
    marginTop: ResponsivePixels.size14,
    paddingTop: ResponsivePixels.size12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E8E2D5',
  },
  customInputWrap: {
    borderRadius: 12,
    borderWidth: 1.5,
    paddingHorizontal: 12,
    height: 46,
    justifyContent: 'center',
    marginBottom: 10,
  },
  customInputField: {
    fontFamily: Fonts.poppins.medium,
    fontSize: 14,
    padding: 0,
  },
  validationRow: {
    marginTop: 4,
  },
  validStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  validText: {
    fontFamily: Fonts.poppins.regular,
    fontSize: 11,
    color: '#21AF85',
  },
  invalidStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  invalidText: {
    fontFamily: Fonts.poppins.regular,
    fontSize: 11,
    color: '#FF3B30',
  },
  simulatorCard: {
    borderRadius: 20,
    borderWidth: 1,
    borderBottomWidth: 3,
    padding: ResponsivePixels.size16,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
    marginBottom: ResponsivePixels.size20,
  },
  simulatorLabel: {
    ...Typography.bodySuperSmallPoppinsRegularLoose,
    fontSize: 11,
    marginBottom: 8,
  },
  simulatorInputWrap: {
    borderRadius: 12,
    borderWidth: 1.5,
    paddingHorizontal: 12,
    height: 44,
    justifyContent: 'center',
    marginBottom: 12,
  },
  simulatorInput: {
    fontFamily: Fonts.poppins.regular,
    fontSize: 13,
    padding: 0,
  },
  testResultBox: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  confidenceScore: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: 12,
  },
  analysisText: {
    fontFamily: Fonts.poppins.regular,
    fontSize: 11,
  },
  actionContainer: {
    marginTop: 4,
  },
});
