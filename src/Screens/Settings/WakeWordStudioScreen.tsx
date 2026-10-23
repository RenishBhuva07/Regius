import React, { useState, useMemo, useEffect, useRef } from 'react';
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
  Animated,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import {
  ChevronLeft,
  Mic,
  MicOff,
  Check,
  AlertTriangle,
  Sparkles,
  Zap,
  Activity,
  ShieldCheck,
  Radio,
  Sliders,
  Volume2,
  Cpu,
} from 'lucide-react-native';
import Toast from 'react-native-toast-message';

import { Typography } from '../../Theme/Typographys';
import { Fonts } from '../../Theme/fonts';
import { Colors } from '../../Assets/StyleUtilities/Colors';
import ResponsivePixels from '../../Assets/StyleUtilities/ResponsivePixels';
import { Badge } from '../../Common/Badge';
import CustomButton from '../../Common/CustomButton';
import { useTheme } from '../../Theme/ThemeContext';
import { useVoiceWakeWord } from '../../Context/VoiceWakeWordContext';
import { SettingsBackgroundSvg } from './Components/SettingsBackgroundSvg';
import { HeaderPatternSvg } from '../Dashboard/Components/HeaderPatternSvg';
import {
  SUPPORTED_WAKE_WORD_PRESETS,
  validateWakePhrase,
  testWakeWordRecognition,
  WakeWordPreset,
  WakeWordValidationResult,
  WakeWordTestResult,
} from '../../Services/WakeWord/WakeWordService';

const { width: screenWidth } = Dimensions.get('window');
const HEADER_HEIGHT = 52;

const SAMPLE_TEST_CHIPS = [
  'Hey Regius add a task',
  'Hey Regius morning brief',
  'Sia what is on my calendar',
  'Regius start focus session',
];

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

  // Radar Pulse Animation
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const pulseOpacity = useRef(new Animated.Value(0.6)).current;
  const scrollY = useRef(new Animated.Value(0)).current;
  const isScrolledRef = useRef(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    {
      useNativeDriver: false,
      listener: (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const offsetY = event?.nativeEvent?.contentOffset?.y ?? 0;
        if (offsetY > 15 && !isScrolledRef.current) {
          isScrolledRef.current = true;
          setIsScrolled(true);
        } else if (offsetY <= 15 && isScrolledRef.current) {
          isScrolledRef.current = false;
          setIsScrolled(false);
        }
      },
    },
  );

  const headerBgColor = scrollY.interpolate({
    inputRange: [0, 30],
    outputRange: [
      isDarkMode ? 'rgba(18, 20, 23, 0)' : 'rgba(255, 252, 227, 0)',
      isDarkMode ? '#282048' : Colors.LavenderPurple,
    ],
    extrapolate: 'clamp',
  });

  const headerRadius = scrollY.interpolate({
    inputRange: [0, 30],
    outputRange: [0, 24],
    extrapolate: 'clamp',
  });

  const headerShadowOpacity = scrollY.interpolate({
    inputRange: [0, 30],
    outputRange: [0, 0.32],
    extrapolate: 'clamp',
  });

  const headerElevation = scrollY.interpolate({
    inputRange: [0, 30],
    outputRange: [0, 8],
    extrapolate: 'clamp',
  });

  const headerPaddingBottom = scrollY.interpolate({
    inputRange: [0, 30],
    outputRange: [0, 8],
    extrapolate: 'clamp',
  });

  const headerPatternOpacity = scrollY.interpolate({
    inputRange: [0, 25],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.35,
            duration: 1800,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1800,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(pulseOpacity, {
            toValue: 0.15,
            duration: 1800,
            useNativeDriver: true,
          }),
          Animated.timing(pulseOpacity, {
            toValue: 0.6,
            duration: 1800,
            useNativeDriver: true,
          }),
        ]),
      ]),
    );

    if (isWakeWordEnabled) {
      pulse.start();
    } else {
      pulseAnim.setValue(1);
      pulseOpacity.setValue(0.2);
    }

    return () => pulse.stop();
  }, [isWakeWordEnabled, pulseAnim, pulseOpacity]);

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
        barStyle={
          isScrolled
            ? 'light-content'
            : isDarkMode
            ? 'light-content'
            : 'dark-content'
        }
        {...(Platform.OS === 'android'
          ? {
              backgroundColor: isScrolled
                ? isDarkMode
                  ? '#282048'
                  : Colors.LavenderPurple
                : bgMain,
              translucent: true,
            }
          : {})}
      />

      <SettingsBackgroundSvg />

      {/* Scroll-Reactive Header */}
      <Animated.View
        style={[
          styles.headerContainer,
          {
            paddingTop: insets.top,
            paddingBottom: headerPaddingBottom,
            backgroundColor: headerBgColor,
            borderBottomLeftRadius: headerRadius,
            borderBottomRightRadius: headerRadius,
            shadowOpacity: headerShadowOpacity,
            elevation: headerElevation,
          },
        ]}
      >
        <Animated.View
          pointerEvents="none"
          style={[
            StyleSheet.absoluteFill,
            {
              opacity: headerPatternOpacity,
              borderBottomLeftRadius: headerRadius,
              borderBottomRightRadius: headerRadius,
              overflow: 'hidden',
            },
          ]}
        >
          <HeaderPatternSvg width={screenWidth} insetsTop={insets.top} />
        </Animated.View>

        <View style={[styles.headerRow, { height: HEADER_HEIGHT }]}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => navigation.goBack()}
            style={[
              styles.backButton,
              isScrolled
                ? styles.backButtonScrolled
                : {
                    backgroundColor: cardBg,
                    borderColor: isDarkMode
                      ? 'rgba(255, 255, 255, 0.12)'
                      : '#FFFFFF',
                    borderBottomColor: isDarkMode ? '#14161A' : '#DCD6CA',
                    shadowColor: isDarkMode ? '#000000' : 'rgba(0, 0, 0, 0.08)',
                  },
            ]}
            accessibilityRole="button"
            accessibilityLabel="Back to Settings"
          >
            <ChevronLeft
              size={20}
              color={isScrolled ? Colors.DefaultWhite : textPrimary}
              strokeWidth={2.4}
            />
          </TouchableOpacity>

          <View style={styles.headerTitleWrap}>
            <Text
              style={[
                styles.headerTitle,
                isScrolled
                  ? styles.headerTitleScrolled
                  : { color: textPrimary },
              ]}
              numberOfLines={1}
            >
              Wake Word Studio
            </Text>
            <Text
              style={[
                styles.headerSubtitle,
                isScrolled
                  ? styles.headerSubtitleScrolled
                  : { color: textSecondary },
              ]}
              numberOfLines={1}
            >
              Acoustic Radar & Detection
            </Text>
          </View>

          <Badge
            label="NEURAL V3"
            variant={isScrolled ? 'yellow' : 'purple'}
            size="sm"
          />
        </View>
      </Animated.View>

      <Animated.ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 100 },
        ]}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {/* Hero Bento: Acoustic Radar & Detection Console */}
        <View style={styles.heroOuterWrapper}>
          <View style={styles.cardShadowWrapper}>
            <View style={styles.card}>
              <HeaderPatternSvg width={screenWidth} insetsTop={insets.top} />

              <View style={styles.heroContent}>
                {/* Aura Status Pill */}
                <View style={styles.heroStatusRow}>
                  <View style={styles.heroStatusLeft}>
                    <Sparkles size={14} color="#F5C518" strokeWidth={2.4} />
                    <Text style={styles.heroStatusLabel}>ACOUSTIC RADAR</Text>
                  </View>
                  <Badge
                    label={
                      isWakeWordEnabled ? 'ACTIVE LISTENING' : 'RADAR PAUSED'
                    }
                    variant={isWakeWordEnabled ? 'green' : 'neutral'}
                    size="sm"
                  />
                </View>

                {/* Concentric Radar Centerpiece */}
                <View style={styles.radarVisualizerContainer}>
                  {isWakeWordEnabled && (
                    <>
                      <Animated.View
                        style={[
                          styles.radarRingOuter,
                          {
                            transform: [{ scale: pulseAnim }],
                            opacity: pulseOpacity,
                          },
                        ]}
                      />
                      <View style={styles.radarRingMiddle} />
                    </>
                  )}

                  <View
                    style={[
                      styles.micCoreOrb,
                      {
                        backgroundColor: isWakeWordEnabled
                          ? '#21AF85'
                          : '#2C3035',
                        borderColor: isWakeWordEnabled
                          ? 'rgba(33, 175, 133, 0.4)'
                          : 'rgba(255, 255, 255, 0.1)',
                      },
                    ]}
                  >
                    {isWakeWordEnabled ? (
                      <Mic size={28} color="#FFFFFF" strokeWidth={2.4} />
                    ) : (
                      <MicOff size={28} color="#A3A8B1" strokeWidth={2.4} />
                    )}
                  </View>
                </View>

                {/* Wake Word Phrase Display */}
                <View style={styles.phraseReadoutWrap}>
                  <Text style={styles.phraseLabel}>
                    LISTENING TRIGGER PHRASE
                  </Text>
                  <Text style={styles.phraseDisplay}>"{candidatePhrase}"</Text>
                </View>

                {/* Acoustic Radar Metrics Pill */}
                <View style={styles.radarMetricsRow}>
                  <View style={styles.metricCell}>
                    <Activity size={13} color="#F5C518" strokeWidth={2.2} />
                    <Text style={styles.metricText}>On-Device ML</Text>
                  </View>
                  <View style={styles.metricDivider} />
                  <View style={styles.metricCell}>
                    <ShieldCheck size={13} color="#21AF85" strokeWidth={2.2} />
                    <Text style={styles.metricText}>Zero Cloud Audio</Text>
                  </View>
                  <View style={styles.metricDivider} />
                  <View style={styles.metricCell}>
                    <Zap size={13} color="#A78BFA" strokeWidth={2.2} />
                    <Text style={styles.metricText}>&lt; 40ms Match</Text>
                  </View>
                </View>

                {/* Quick Master Switch Toggle */}
                <View style={styles.heroMasterSwitch}>
                  <View style={styles.heroMasterSwitchMeta}>
                    <Text style={styles.heroMasterSwitchTitle}>
                      Hands-Free Wake
                    </Text>
                    <Text style={styles.heroMasterSwitchDesc}>
                      {isWakeWordEnabled
                        ? 'Microphone continuously scans local audio buffers'
                        : 'Wake listening paused to save battery'}
                    </Text>
                  </View>
                  <Switch
                    value={isWakeWordEnabled}
                    onValueChange={setWakeWordEnabled}
                    trackColor={{ false: '#3A3F47', true: '#21AF85' }}
                    thumbColor="#FFFFFF"
                  />
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Section 1: Curated Wake Phrases */}
        <View style={styles.sectionHeaderRow}>
          <Text style={[styles.sectionHeading, { color: textSecondary }]}>
            CURATED ROYAL PRESETS
          </Text>
          <Badge label="TUNED" variant="purple" size="sm" />
        </View>

        <View style={styles.presetsGrid}>
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
                    backgroundColor: cardBg,
                    borderColor: isSelected
                      ? Colors.LavenderPurple
                      : isDarkMode
                      ? 'rgba(255, 255, 255, 0.08)'
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
                    <View style={styles.presetTitleWithBadge}>
                      <Text
                        style={[
                          styles.presetPhraseText,
                          { color: textPrimary },
                        ]}
                      >
                        "{preset.phrase}"
                      </Text>
                      {preset.id === 'hey_regius' && (
                        <Badge label="SIGNATURE" variant="yellow" size="sm" />
                      )}
                    </View>
                    <Text
                      style={[styles.presetNameText, { color: textSecondary }]}
                    >
                      {preset.name} • {preset.category.toUpperCase()}
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

                {/* Aliases Preview Chips */}
                {preset.aliases && preset.aliases.length > 0 && (
                  <View style={styles.aliasesWrap}>
                    <Text
                      style={[styles.aliasesLabel, { color: textSecondary }]}
                    >
                      Recognized Variations:
                    </Text>
                    <View style={styles.aliasesChipsRow}>
                      {preset.aliases.slice(0, 4).map(alias => (
                        <View
                          key={alias}
                          style={[
                            styles.aliasChip,
                            {
                              backgroundColor: surfaceAlt,
                              borderColor: borderLight,
                            },
                          ]}
                        >
                          <Text
                            style={[
                              styles.aliasChipText,
                              { color: textSecondary },
                            ]}
                          >
                            {alias}
                          </Text>
                        </View>
                      ))}
                      {preset.aliases.length > 4 && (
                        <Text
                          style={[
                            styles.aliasMoreText,
                            { color: textSecondary },
                          ]}
                        >
                          +{preset.aliases.length - 4} more
                        </Text>
                      )}
                    </View>
                  </View>
                )}

                <View style={styles.presetMetaPills}>
                  <Badge label="STT OPTIMIZED" variant="green" size="sm" />
                  <View style={styles.badgeGap} />
                  <Badge label="&lt; 50ms DETECT" variant="neutral" size="sm" />
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Section 2: Custom Wake Word Architect */}
        <View style={styles.sectionHeaderRow}>
          <Text style={[styles.sectionHeading, { color: textSecondary }]}>
            CUSTOM WAKE ARCHITECT
          </Text>
          <Badge label="ADVANCED" variant="orange" size="sm" />
        </View>

        <View
          style={[
            styles.customPhraseCard,
            {
              backgroundColor: cardBg,
              borderColor: isCustomMode
                ? Colors.LavenderPurple
                : isDarkMode
                ? 'rgba(255, 255, 255, 0.08)'
                : '#FFFFFF',
              borderBottomColor: isCustomMode
                ? '#4D4DB8'
                : isDarkMode
                ? '#171A20'
                : '#E2DCD0',
              shadowColor: isDarkMode ? '#000000' : 'rgba(131, 131, 214, 0.1)',
            },
          ]}
        >
          <TouchableOpacity
            activeOpacity={0.85}
            style={styles.customToggleRow}
            onPress={handleEnableCustomMode}
          >
            <View style={styles.customToggleMeta}>
              <View style={styles.customTitleRow}>
                <Sliders
                  size={16}
                  color={Colors.LavenderPurple}
                  strokeWidth={2.2}
                />
                <Text style={[styles.customTitle, { color: textPrimary }]}>
                  Design Bespoke Trigger Phrase
                </Text>
              </View>
              <Text style={[styles.customSubtitle, { color: textSecondary }]}>
                Acoustic rule: 2+ words, 3+ phonetic syllables for minimal false
                positives
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

              {/* Acoustic Validation Feedback Banner */}
              <View style={styles.validationRow}>
                {validation.isValid ? (
                  <View style={styles.validStatus}>
                    <ShieldCheck size={16} color="#21AF85" strokeWidth={2.4} />
                    <Text style={styles.validText}>
                      Acoustic criteria met (Syllables &amp; length optimal)
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

        {/* Section 3: Real-time Recognition Simulator */}
        <View style={styles.sectionHeaderRow}>
          <Text style={[styles.sectionHeading, { color: textSecondary }]}>
            ACOUSTIC SIMULATOR
          </Text>
          <Badge label="OFFLINE TEST" variant="neutral" size="sm" />
        </View>

        <View
          style={[
            styles.simulatorCard,
            {
              backgroundColor: cardBg,
              borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.08)' : '#FFFFFF',
              borderBottomColor: isDarkMode ? '#171A20' : '#E2DCD0',
              shadowColor: isDarkMode ? '#000000' : 'rgba(131, 131, 214, 0.1)',
            },
          ]}
        >
          <Text style={[styles.simulatorLabel, { color: textSecondary }]}>
            Test spoken input transcript:
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
              placeholder="e.g. Hey Regius add a task"
              placeholderTextColor={textSecondary}
            />
          </View>

          {/* Quick Sample Chips */}
          <View style={styles.sampleChipsContainer}>
            {SAMPLE_TEST_CHIPS.map(chip => (
              <TouchableOpacity
                key={chip}
                activeOpacity={0.7}
                style={[
                  styles.sampleChip,
                  {
                    backgroundColor:
                      testTranscript === chip
                        ? isDarkMode
                          ? '#2C3038'
                          : '#EEE7D9'
                        : surfaceAlt,
                    borderColor: borderLight,
                  },
                ]}
                onPress={() => setTestTranscript(chip)}
              >
                <Text style={[styles.sampleChipText, { color: textPrimary }]}>
                  "{chip}"
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Test Match Result Box */}
          <View
            style={[
              styles.testResultBox,
              {
                backgroundColor: testResult.detected
                  ? isDarkMode
                    ? 'rgba(33, 175, 133, 0.15)'
                    : '#EDFDF5'
                  : isDarkMode
                  ? 'rgba(255, 59, 48, 0.12)'
                  : '#FFF0F0',
                borderColor: testResult.detected
                  ? 'rgba(33, 175, 133, 0.4)'
                  : 'rgba(255, 59, 48, 0.3)',
              },
            ]}
          >
            <View style={styles.resultHeader}>
              <Badge
                label={testResult.detected ? 'PHRASE DETECTED' : 'NOT DETECTED'}
                variant={testResult.detected ? 'green' : 'red'}
                size="sm"
              />
              <Text
                style={[
                  styles.confidenceScore,
                  { color: testResult.detected ? '#21AF85' : '#FF3B30' },
                ]}
              >
                Target: "{candidatePhrase}"
              </Text>
            </View>
            <Text
              style={[
                styles.analysisText,
                {
                  color: testResult.detected
                    ? isDarkMode
                      ? '#A7F3D0'
                      : '#1B9A72'
                    : isDarkMode
                    ? '#FCA5A5'
                    : '#D92A0F',
                },
              ]}
            >
              {testResult.analysis}
            </Text>
          </View>
        </View>
      </Animated.ScrollView>

      {/* Floating Action Dock */}
      <View
        style={[
          styles.floatingActionDock,
          {
            paddingBottom: Math.max(insets.bottom, 16),
            backgroundColor: isDarkMode
              ? 'rgba(18, 20, 23, 0.92)'
              : 'rgba(255, 252, 227, 0.94)',
            borderTopColor: borderLight,
          },
        ]}
      >
        <CustomButton
          title={isSaving ? 'Activating Acoustic Radar...' : 'Save Wake Phrase'}
          onPress={handleSave}
          disabled={isSaving || !validation.isValid}
          variant="dark"
        />
      </View>
    </View>
  );
};

export default WakeWordStudioScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    shadowColor: Colors.LavenderPurple,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 12,
    zIndex: 10,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: ResponsivePixels.size16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1.5,
    borderBottomWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  backButtonScrolled: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderColor: 'rgba(255, 255, 255, 0.4)',
    borderBottomColor: 'rgba(255, 255, 255, 0.3)',
  },
  headerTitleWrap: {
    alignItems: 'center',
  },
  headerTitle: {
    ...Typography.h5SemiBold,
    fontFamily: Fonts.ranade.bold,
    fontSize: 18,
  },
  headerTitleScrolled: {
    color: Colors.DefaultWhite,
  },
  headerSubtitle: {
    ...Typography.bodySuperSmallPoppinsRegularLoose,
    fontSize: 11,
    marginTop: 2,
  },
  headerSubtitleScrolled: {
    color: 'rgba(255, 255, 255, 0.85)',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: ResponsivePixels.size16,
  },
  heroOuterWrapper: {
    paddingHorizontal: 10,
    marginBottom: ResponsivePixels.size24,
  },
  cardShadowWrapper: {
    backgroundColor: Colors.NeroBlack,
    borderRadius: 24,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.28,
    shadowRadius: 18,
    elevation: 8,
  },
  card: {
    backgroundColor: Colors.NeroBlack,
    borderRadius: 24,
    borderWidth: 4,
    borderColor: 'rgba(255, 255, 255, 0.9)',
    overflow: 'hidden',
    position: 'relative',
  },
  heroContent: {
    padding: ResponsivePixels.size20,
    alignItems: 'center',
  },
  heroStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: ResponsivePixels.size16,
  },
  heroStatusLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  heroStatusLabel: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: 11,
    color: '#F5C518',
    letterSpacing: 1.2,
  },
  radarVisualizerContainer: {
    width: 140,
    height: 140,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginVertical: 6,
  },
  radarRingOuter: {
    position: 'absolute',
    width: 130,
    height: 130,
    borderRadius: 65,
    borderWidth: 1.5,
    borderColor: '#21AF85',
  },
  radarRingMiddle: {
    position: 'absolute',
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 1,
    borderColor: 'rgba(33, 175, 133, 0.3)',
  },
  micCoreOrb: {
    width: 68,
    height: 68,
    borderRadius: 34,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    shadowColor: '#21AF85',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  },
  phraseReadoutWrap: {
    alignItems: 'center',
    marginTop: ResponsivePixels.size14,
    marginBottom: ResponsivePixels.size14,
  },
  phraseLabel: {
    fontFamily: Fonts.poppins.regular,
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.5)',
    letterSpacing: 1.2,
    marginBottom: 4,
  },
  phraseDisplay: {
    fontFamily: Fonts.ranade.bold,
    fontSize: 22,
    color: '#FFFCE3',
    textAlign: 'center',
  },
  radarMetricsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 14,
    paddingVertical: 8,
    paddingHorizontal: 12,
    width: '100%',
    marginBottom: ResponsivePixels.size16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  metricCell: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  metricText: {
    fontFamily: Fonts.poppins.medium,
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.85)',
  },
  metricDivider: {
    width: 1,
    height: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  heroMasterSwitch: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 14,
    width: '100%',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  heroMasterSwitchMeta: {
    flex: 1,
    paddingRight: 10,
  },
  heroMasterSwitchTitle: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: 13,
    color: '#FFFFFF',
  },
  heroMasterSwitchDesc: {
    fontFamily: Fonts.poppins.regular,
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.55)',
    marginTop: 1,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: ResponsivePixels.size16,
    marginBottom: ResponsivePixels.size10,
  },
  sectionHeading: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: 11,
    letterSpacing: 1.1,
  },
  presetsGrid: {
    paddingHorizontal: ResponsivePixels.size16,
    gap: 12,
    marginBottom: ResponsivePixels.size24,
  },
  presetCard: {
    borderRadius: 20,
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
  presetTitleWithBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  presetPhraseText: {
    fontFamily: Fonts.ranade.bold,
    fontSize: 18,
    marginBottom: 2,
  },
  presetNameText: {
    fontFamily: Fonts.poppins.regular,
    fontSize: 11,
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
  aliasesWrap: {
    marginBottom: 10,
  },
  aliasesLabel: {
    fontFamily: Fonts.poppins.regular,
    fontSize: 10,
    marginBottom: 4,
  },
  aliasesChipsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
  },
  aliasChip: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
  },
  aliasChipText: {
    fontFamily: Fonts.poppins.medium,
    fontSize: 10,
  },
  aliasMoreText: {
    fontFamily: Fonts.poppins.regular,
    fontSize: 10,
    marginLeft: 2,
  },
  presetMetaPills: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badgeGap: {
    width: 8,
  },
  customPhraseCard: {
    marginHorizontal: ResponsivePixels.size16,
    borderRadius: 20,
    borderWidth: 1.5,
    borderBottomWidth: 3.5,
    padding: ResponsivePixels.size16,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
    marginBottom: ResponsivePixels.size24,
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
  customTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  customTitle: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: 14,
  },
  customSubtitle: {
    fontFamily: Fonts.poppins.regular,
    fontSize: 11,
    marginTop: 2,
  },
  customInputArea: {
    marginTop: ResponsivePixels.size14,
    paddingTop: ResponsivePixels.size12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E8E2D5',
  },
  customInputWrap: {
    borderRadius: 14,
    borderWidth: 1.5,
    paddingHorizontal: 14,
    height: 48,
    justifyContent: 'center',
    marginBottom: 10,
  },
  customInputField: {
    fontFamily: Fonts.poppins.medium,
    fontSize: 14,
    padding: 0,
  },
  validationRow: {
    marginTop: 2,
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
    marginHorizontal: ResponsivePixels.size16,
    borderRadius: 20,
    borderWidth: 1.5,
    borderBottomWidth: 3.5,
    padding: ResponsivePixels.size16,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
    marginBottom: ResponsivePixels.size24,
  },
  simulatorLabel: {
    fontFamily: Fonts.poppins.regular,
    fontSize: 11,
    marginBottom: 8,
  },
  simulatorInputWrap: {
    borderRadius: 14,
    borderWidth: 1.5,
    paddingHorizontal: 14,
    height: 46,
    justifyContent: 'center',
    marginBottom: 10,
  },
  simulatorInput: {
    fontFamily: Fonts.poppins.regular,
    fontSize: 13,
    padding: 0,
  },
  sampleChipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 12,
  },
  sampleChip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    borderWidth: 1,
  },
  sampleChipText: {
    fontFamily: Fonts.poppins.regular,
    fontSize: 11,
  },
  testResultBox: {
    borderRadius: 14,
    borderWidth: 1.5,
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
  floatingActionDock: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: ResponsivePixels.size16,
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 10,
  },
});
