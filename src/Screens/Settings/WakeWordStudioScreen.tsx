import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  Animated,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Sparkles, Zap, Activity, ShieldCheck } from 'lucide-react-native';
import Toast from 'react-native-toast-message';

import { Fonts } from '../../Theme/fonts';
import { Colors, withAlpha } from '../../Assets/StyleUtilities/Colors';
import ResponsivePixels from '../../Assets/StyleUtilities/ResponsivePixels';
import { Badge } from '../../Common/Badge';
import CustomButton from '../../Common/CustomButton';
import { SubScreenHeader } from '../../Common/SubScreenHeader';
import { useScrollReactiveHeader } from '../../Common/useScrollReactiveHeader';
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
import {
  WakeWordRadarPulse,
  WakeWordPresetCard,
  WakeWordCustomInput,
  WakeWordTester,
} from './WakeWordStudio/Components';

const { width: screenWidth } = Dimensions.get('window');

export const WakeWordStudioScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const { isDarkMode, Colors: themeColors } = useTheme();

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

  const { scrollY, isScrolled, handleScroll } = useScrollReactiveHeader();

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

  const bgMain =
    themeColors.Background ||
    (isDarkMode ? Colors.DarkBackground : Colors.CreamBackground);
  const cardBg =
    themeColors.CardBackground ||
    (isDarkMode ? Colors.DarkCardBackground : Colors.PureWhite);
  const textPrimary =
    themeColors.PrimaryText ||
    (isDarkMode ? Colors.PureWhite : Colors.PureBlack);
  const textSecondary =
    themeColors.SecondaryText ||
    (isDarkMode ? Colors.SteelMist : Colors.SubtitleGray);
  const borderLight =
    themeColors.BorderLight ||
    (isDarkMode ? Colors.CarbonSlate : Colors.RingBorder);
  const surfaceAlt =
    themeColors.SurfaceAlt ||
    (isDarkMode ? Colors.DarkSurfaceAlt : Colors.CreamSurfaceAlt);

  const renderRightAction = useCallback(
    (scrolled: boolean) => (
      <Badge
        label="NEURAL V3"
        variant={scrolled ? 'yellow' : 'purple'}
        size="sm"
      />
    ),
    [],
  );

  return (
    <View style={[styles.container, { backgroundColor: bgMain }]}>
      <SettingsBackgroundSvg />

      {/* Scroll-Reactive Header */}
      <SubScreenHeader
        title="Wake Word Studio"
        subtitle="Acoustic Radar & Detection"
        scrollY={scrollY}
        isScrolled={isScrolled}
        isAbsolute={false}
        rightAction={renderRightAction}
        backAccessibilityLabel="Back to Settings"
      />

      <Animated.ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + ResponsivePixels.size100 },
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
                    <Sparkles
                      size={ResponsivePixels.size14}
                      color={Colors.AccentYellow}
                      strokeWidth={2.4}
                    />
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
                <WakeWordRadarPulse isWakeWordEnabled={isWakeWordEnabled} />

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
                    <Activity
                      size={ResponsivePixels.size13}
                      color={Colors.AccentYellow}
                      strokeWidth={2.2}
                    />
                    <Text style={styles.metricText}>On-Device ML</Text>
                  </View>
                  <View style={styles.metricDivider} />
                  <View style={styles.metricCell}>
                    <ShieldCheck
                      size={ResponsivePixels.size13}
                      color={Colors.LuminousGreen}
                      strokeWidth={2.2}
                    />
                    <Text style={styles.metricText}>Zero Cloud Audio</Text>
                  </View>
                  <View style={styles.metricDivider} />
                  <View style={styles.metricCell}>
                    <Zap
                      size={ResponsivePixels.size13}
                      color={Colors.Violet400}
                      strokeWidth={2.2}
                    />
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
                    trackColor={{
                      false: Colors.DarkSwitchTrackOff,
                      true: Colors.LuminousGreen,
                    }}
                    thumbColor={Colors.PureWhite}
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
              <WakeWordPresetCard
                key={preset.id}
                preset={preset}
                isSelected={isSelected}
                onSelect={() => handleSelectPreset(preset)}
                cardBg={cardBg}
                isDarkMode={isDarkMode}
                textPrimary={textPrimary}
                textSecondary={textSecondary}
                borderLight={borderLight}
                surfaceAlt={surfaceAlt}
              />
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

        <WakeWordCustomInput
          isCustomMode={isCustomMode}
          onEnableCustomMode={handleEnableCustomMode}
          customInput={customInput}
          onChangeCustomInput={setCustomInput}
          validation={validation}
          cardBg={cardBg}
          isDarkMode={isDarkMode}
          textPrimary={textPrimary}
          textSecondary={textSecondary}
          borderLight={borderLight}
          surfaceAlt={surfaceAlt}
        />

        {/* Section 3: Real-time Recognition Simulator */}
        <View style={styles.sectionHeaderRow}>
          <Text style={[styles.sectionHeading, { color: textSecondary }]}>
            ACOUSTIC SIMULATOR
          </Text>
          <Badge label="OFFLINE TEST" variant="neutral" size="sm" />
        </View>

        <WakeWordTester
          testTranscript={testTranscript}
          onChangeTestTranscript={setTestTranscript}
          targetPhrase={candidatePhrase}
          testResult={testResult}
          cardBg={cardBg}
          isDarkMode={isDarkMode}
          textPrimary={textPrimary}
          textSecondary={textSecondary}
          borderLight={borderLight}
          surfaceAlt={surfaceAlt}
        />
      </Animated.ScrollView>

      {/* Floating Action Dock */}
      <View
        style={[
          styles.floatingActionDock,
          {
            backgroundColor: isDarkMode
              ? Colors.DarkCardBackground
              : Colors.PureWhite,
            borderTopColor: borderLight,
            paddingBottom: insets.bottom + ResponsivePixels.size12,
          },
        ]}
      >
        <CustomButton
          title={isSaving ? 'Updating Radar...' : 'Confirm Wake Word'}
          onPress={handleSave}
          disabled={!validation.isValid || isSaving}
          variant="primary"
          style={styles.saveBtn}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: ResponsivePixels.size16,
  },
  heroOuterWrapper: {
    paddingHorizontal: ResponsivePixels.size10,
    marginBottom: ResponsivePixels.size24,
  },
  cardShadowWrapper: {
    borderRadius: ResponsivePixels.size24,
    backgroundColor: Colors.PureBlack,
    shadowColor: Colors.PureBlack,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.28,
    shadowRadius: 18,
    elevation: 8,
  },
  card: {
    borderRadius: ResponsivePixels.size24,
    borderWidth: 4,
    borderColor: withAlpha(Colors.PureWhite, 0.9),
    backgroundColor: Colors.NeroBlack,
    padding: ResponsivePixels.size20,
    overflow: 'hidden',
    position: 'relative',
  },
  heroContent: {
    position: 'relative',
    zIndex: 2,
  },
  heroStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: ResponsivePixels.size4,
  },
  heroStatusLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ResponsivePixels.size6,
  },
  heroStatusLabel: {
    fontFamily: Fonts.poppins.bold,
    fontSize: ResponsivePixels.size10_5,
    letterSpacing: 0.8,
    color: Colors.AccentYellow,
  },
  phraseReadoutWrap: {
    alignItems: 'center',
    marginBottom: ResponsivePixels.size16,
  },
  phraseLabel: {
    fontFamily: Fonts.poppins.medium,
    fontSize: ResponsivePixels.size10,
    letterSpacing: 1.2,
    color: withAlpha(Colors.PureWhite, 0.45),
    marginBottom: ResponsivePixels.size4,
  },
  phraseDisplay: {
    fontFamily: Fonts.ranade.bold,
    fontSize: ResponsivePixels.size22,
    color: Colors.PureWhite,
    letterSpacing: -0.3,
  },
  radarMetricsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: withAlpha(Colors.PureWhite, 0.06),
    borderRadius: ResponsivePixels.size14,
    paddingVertical: ResponsivePixels.size8,
    paddingHorizontal: ResponsivePixels.size12,
    marginBottom: ResponsivePixels.size16,
    borderWidth: 1,
    borderColor: withAlpha(Colors.PureWhite, 0.08),
  },
  metricCell: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ResponsivePixels.size5,
  },
  metricText: {
    fontFamily: Fonts.poppins.medium,
    fontSize: ResponsivePixels.size10_5,
    color: withAlpha(Colors.PureWhite, 0.8),
  },
  metricDivider: {
    width: 1,
    height: ResponsivePixels.size12,
    backgroundColor: withAlpha(Colors.PureWhite, 0.15),
    marginHorizontal: ResponsivePixels.size10,
  },
  heroMasterSwitch: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: withAlpha(Colors.PureWhite, 0.05),
    borderRadius: ResponsivePixels.size16,
    paddingHorizontal: ResponsivePixels.size14,
    paddingVertical: ResponsivePixels.size12,
    borderWidth: 1,
    borderColor: withAlpha(Colors.PureWhite, 0.08),
  },
  heroMasterSwitchMeta: {
    flex: 1,
    marginRight: ResponsivePixels.size10,
  },
  heroMasterSwitchTitle: {
    fontFamily: Fonts.poppins.bold,
    fontSize: ResponsivePixels.size14,
    color: Colors.PureWhite,
  },
  heroMasterSwitchDesc: {
    fontFamily: Fonts.poppins.regular,
    fontSize: ResponsivePixels.size11,
    color: withAlpha(Colors.PureWhite, 0.55),
    marginTop: ResponsivePixels.size1,
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
    fontSize: ResponsivePixels.size11,
    letterSpacing: 1.1,
  },
  presetsGrid: {
    paddingHorizontal: ResponsivePixels.size16,
    gap: ResponsivePixels.size12,
    marginBottom: ResponsivePixels.size24,
  },
  floatingActionDock: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: ResponsivePixels.size16,
    paddingTop: ResponsivePixels.size12,
    borderTopWidth: StyleSheet.hairlineWidth,
    shadowColor: Colors.PureBlack,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 10,
  },
  saveBtn: {
    width: '100%',
  },
});

export default WakeWordStudioScreen;
