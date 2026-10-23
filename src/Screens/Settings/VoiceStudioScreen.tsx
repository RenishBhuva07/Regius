import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  StatusBar,
  ActivityIndicator,
  Animated,
  Easing,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import {
  ChevronLeft,
  Mic,
  Play,
  Square,
  Sparkles,
  Volume2,
  StopCircle,
  Sliders,
  Check,
} from 'lucide-react-native';
import Toast from 'react-native-toast-message';

import { Typography } from '../../Theme/Typographys';
import { Fonts } from '../../Theme/fonts';
import { Colors } from '../../Assets/StyleUtilities/Colors';
import ResponsivePixels from '../../Assets/StyleUtilities/ResponsivePixels';
import { Badge } from '../../Common/Badge';
import { ProBadge } from '../../Common/ProBadge';
import { useTheme } from '../../Theme/ThemeContext';
import { VOICES, VoiceOption } from './Components/types';
import { VoiceSettingsService } from '../../Services/VoiceSettingsService';
import { AudioPlayerService } from '../../Services/AudioPlayerService';
import { RegiusSpeechService } from '../../Services/RegiusSpeechService';
import { KokoroTTSService } from '../../Services/Kokoro/KokoroTTSService';

const PRESET_SENTENCES = [
  'Hey Regius, ready when you are.',
  'Meeting with the team at 3:00 PM today.',
  'Great job! You maintained your daily focus streak.',
  'Your mind is clear, focused, and prepared for excellence.',
];

export const VoiceStudioScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const { isDarkMode } = useTheme();

  const [selectedVoiceId, setSelectedVoiceId] = useState('af_bella');
  const [speechSpeed, setSpeechSpeed] = useState<number>(1.0);
  const [autoSpeakReplies, setAutoSpeakReplies] = useState(true);

  // Audio preview state
  const [isPlayingPreview, setIsPlayingPreview] = useState(false);
  const [playingVoiceId, setPlayingVoiceId] = useState<string | null>(null);

  // Kokoro real-time synthesis playground
  const [testText, setTestText] = useState(
    'Hello! This is Kokoro text to speech speaking in real time.',
  );
  const [synthesisState, setSynthesisState] = useState<
    'idle' | 'synthesizing' | 'speaking' | 'error'
  >('idle');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Animated wave visualizers
  const waveAnim1 = useRef(new Animated.Value(0.3)).current;
  const waveAnim2 = useRef(new Animated.Value(0.7)).current;
  const waveAnim3 = useRef(new Animated.Value(0.4)).current;
  const waveAnim4 = useRef(new Animated.Value(0.9)).current;
  const waveAnim5 = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    VoiceSettingsService.getSettings().then(saved => {
      if (saved.selectedVoiceId) setSelectedVoiceId(saved.selectedVoiceId);
      if (saved.speechSpeed) setSpeechSpeed(saved.speechSpeed);
      if (saved.autoSpeakReplies !== undefined)
        setAutoSpeakReplies(saved.autoSpeakReplies);
    });

    const unsub = AudioPlayerService.onPlaybackFinished(() => {
      setIsPlayingPreview(false);
      setPlayingVoiceId(null);
    });

    return () => {
      unsub();
      AudioPlayerService.stop();
      KokoroTTSService.stop();
    };
  }, []);

  useEffect(() => {
    let animLoop: Animated.CompositeAnimation | null = null;
    if (isPlayingPreview || synthesisState === 'speaking') {
      animLoop = Animated.loop(
        Animated.parallel([
          Animated.sequence([
            Animated.timing(waveAnim1, {
              toValue: 1,
              duration: 350,
              easing: Easing.ease,
              useNativeDriver: true,
            }),
            Animated.timing(waveAnim1, {
              toValue: 0.2,
              duration: 350,
              easing: Easing.ease,
              useNativeDriver: true,
            }),
          ]),
          Animated.sequence([
            Animated.timing(waveAnim2, {
              toValue: 0.2,
              duration: 280,
              easing: Easing.ease,
              useNativeDriver: true,
            }),
            Animated.timing(waveAnim2, {
              toValue: 1,
              duration: 280,
              easing: Easing.ease,
              useNativeDriver: true,
            }),
          ]),
          Animated.sequence([
            Animated.timing(waveAnim3, {
              toValue: 1,
              duration: 400,
              easing: Easing.ease,
              useNativeDriver: true,
            }),
            Animated.timing(waveAnim3, {
              toValue: 0.3,
              duration: 400,
              easing: Easing.ease,
              useNativeDriver: true,
            }),
          ]),
          Animated.sequence([
            Animated.timing(waveAnim4, {
              toValue: 0.3,
              duration: 300,
              easing: Easing.ease,
              useNativeDriver: true,
            }),
            Animated.timing(waveAnim4, {
              toValue: 1,
              duration: 300,
              easing: Easing.ease,
              useNativeDriver: true,
            }),
          ]),
          Animated.sequence([
            Animated.timing(waveAnim5, {
              toValue: 1,
              duration: 320,
              easing: Easing.ease,
              useNativeDriver: true,
            }),
            Animated.timing(waveAnim5, {
              toValue: 0.25,
              duration: 320,
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
    }

    return () => {
      animLoop?.stop();
    };
  }, [isPlayingPreview, synthesisState]);

  const selectedVoice = VOICES.find(v => v.id === selectedVoiceId) || VOICES[0];

  const handleSelectVoice = (voice: VoiceOption) => {
    setSelectedVoiceId(voice.id);
    VoiceSettingsService.setSelectedVoice(voice.id);
    RegiusSpeechService.warmupVoice(voice.id).catch(() => {});
    Toast.show({
      type: 'success',
      text1: 'Default Voice Set',
      text2: `${voice.name} (${voice.tag}) is now active.`,
    });
  };

  const handleTogglePreview = async (voiceId: string) => {
    if (isPlayingPreview && playingVoiceId === voiceId) {
      await AudioPlayerService.stop();
      setIsPlayingPreview(false);
      setPlayingVoiceId(null);
      return;
    }

    const voice = VOICES.find(v => v.id === voiceId);
    if (!voice) return;

    try {
      setIsPlayingPreview(true);
      setPlayingVoiceId(voiceId);
      await AudioPlayerService.play({
        id: voice.id,
        url: voice.previewUrl,
        title: voice.name,
        artist: 'Kokoro Neural Voice',
      });
    } catch {
      setIsPlayingPreview(false);
      setPlayingVoiceId(null);
      Toast.show({
        type: 'error',
        text1: 'Playback Error',
        text2: 'Could not play voice preview audio.',
      });
    }
  };

  const handleGenerateAndSpeak = async () => {
    if (!testText.trim()) return;

    try {
      setSynthesisState('synthesizing');
      setStatusMessage('Synthesizing neural speech with Kokoro-82M...');

      const audioUri = await KokoroTTSService.synthesize(
        testText,
        selectedVoice.kokoroVoiceId,
      );

      if (!audioUri) {
        setSynthesisState('error');
        setStatusMessage('Synthesis error. Falling back to local preview.');
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
      setStatusMessage('Failed to generate neural speech.');
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

  const handleChangeSpeed = (speed: number) => {
    setSpeechSpeed(speed);
    VoiceSettingsService.setSpeechSpeed(speed);
    Toast.show({
      type: 'info',
      text1: 'Speed Updated',
      text2: `Speech playback rate set to ${speed}x`,
    });
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
            Voice Studio
          </Text>
          <Text style={[styles.headerSubtitle, { color: textSecondary }]}>
            Neural TTS & Kokoro Engine
          </Text>
        </View>

        <Badge label="KOKORO 82M" variant="purple" size="sm" />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 40 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Active Voice Showcase Bento */}
        <View
          style={[
            styles.heroVoiceCard,
            {
              backgroundColor: cardBg,
              borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.12)' : '#FFFFFF',
              borderBottomColor: isDarkMode ? '#171A20' : '#E2DCD0',
              shadowColor: isDarkMode ? '#000000' : 'rgba(131, 131, 214, 0.16)',
            },
          ]}
        >
          <View style={styles.heroVoiceTopRow}>
            <View style={styles.heroVoiceInfo}>
              <Text style={[styles.heroVoiceName, { color: textPrimary }]}>
                {selectedVoice.name}
              </Text>
              <Text
                style={[styles.heroVoiceDescription, { color: textSecondary }]}
              >
                {selectedVoice.personality} • {selectedVoice.accent}
              </Text>
            </View>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => handleTogglePreview(selectedVoice.id)}
              style={[
                styles.heroPreviewPlayBtn,
                { backgroundColor: Colors.LavenderPurple },
              ]}
              accessibilityRole="button"
              accessibilityLabel={`Play preview for ${selectedVoice.name}`}
            >
              {isPlayingPreview && playingVoiceId === selectedVoice.id ? (
                <Square size={16} color="#FFFFFF" fill="#FFFFFF" />
              ) : (
                <Play size={16} color="#FFFFFF" fill="#FFFFFF" />
              )}
            </TouchableOpacity>
          </View>

          {/* Sound Wave Animation Visualizer */}
          <View
            style={[
              styles.waveVisualizerContainer,
              { backgroundColor: surfaceAlt, borderColor: borderLight },
            ]}
          >
            <View style={styles.waveBarsRow}>
              {[waveAnim1, waveAnim2, waveAnim3, waveAnim4, waveAnim5].map(
                (anim, idx) => (
                  <Animated.View
                    key={idx}
                    style={[
                      styles.waveBar,
                      {
                        backgroundColor: Colors.LavenderPurple,
                        transform: [{ scaleY: anim }],
                      },
                    ]}
                  />
                ),
              )}
            </View>
            <Text style={[styles.waveStatusLabel, { color: textSecondary }]}>
              {isPlayingPreview || synthesisState === 'speaking'
                ? 'Streaming Neural Audio'
                : 'Kokoro Real-Time Audio Buffer Ready'}
            </Text>
          </View>

          <View style={styles.heroTagsRow}>
            <Badge label={selectedVoice.tag} variant="purple" size="sm" />
            <View style={styles.badgeGap} />
            <Badge
              label={selectedVoice.gender.toUpperCase()}
              variant="neutral"
              size="sm"
            />
            <View style={styles.badgeGap} />
            <Badge label="82M PARAMS" variant="yellow" size="sm" />
          </View>
        </View>

        {/* Kokoro Interactive Speech Playground */}
        <Text style={[styles.sectionHeading, { color: textSecondary }]}>
          NEURAL SPEECH PLAYGROUND
        </Text>

        <View
          style={[
            styles.playgroundCard,
            {
              backgroundColor: cardBg,
              borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.12)' : '#FFFFFF',
              borderBottomColor: isDarkMode ? '#171A20' : '#E2DCD0',
              shadowColor: isDarkMode ? '#000000' : 'rgba(131, 131, 214, 0.14)',
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
              Test Kokoro-82M Synthesis
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
              onChangeText={setTestText}
              placeholder="Enter text to synthesize with Kokoro..."
              placeholderTextColor={textSecondary}
              multiline
              numberOfLines={3}
            />
          </View>

          {/* Quick preset sentence chips */}
          <Text style={[styles.presetChipsLabel, { color: textSecondary }]}>
            Quick Presets:
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.presetChipsScroll}
          >
            {PRESET_SENTENCES.map((preset, idx) => (
              <TouchableOpacity
                key={idx}
                activeOpacity={0.7}
                style={[
                  styles.presetChip,
                  { backgroundColor: surfaceAlt, borderColor: borderLight },
                ]}
                onPress={() => setTestText(preset)}
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
                onPress={handleStopSpeech}
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
                onPress={handleGenerateAndSpeak}
                disabled={synthesisState === 'synthesizing'}
              >
                <Volume2 size={16} color="#FFFFFF" strokeWidth={2.2} />
                <Text style={styles.actionBtnText}>
                  {synthesisState === 'synthesizing'
                    ? 'Synthesizing...'
                    : 'Synthesize & Speak'}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Speed & Audio Tuning Bento */}
        <Text style={[styles.sectionHeading, { color: textSecondary }]}>
          SPEECH CONTROLS & PACING
        </Text>

        <View
          style={[
            styles.settingsBentoCard,
            {
              backgroundColor: cardBg,
              borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.12)' : '#FFFFFF',
              borderBottomColor: isDarkMode ? '#171A20' : '#E2DCD0',
              shadowColor: isDarkMode ? '#000000' : 'rgba(131, 131, 214, 0.14)',
            },
          ]}
        >
          <View style={styles.controlHeaderRow}>
            <Sliders
              size={16}
              color={Colors.LavenderPurple}
              strokeWidth={2.2}
            />
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
                        ? Colors.LavenderPurple
                        : surfaceAlt,
                      borderColor: isActive ? '#FFFFFF' : borderLight,
                    },
                  ]}
                  onPress={() => handleChangeSpeed(speed)}
                >
                  <Text
                    style={[
                      styles.speedPillText,
                      { color: isActive ? '#FFFFFF' : textPrimary },
                    ]}
                  >
                    {speed}x
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Kokoro Voice Library Selection */}
        <Text style={[styles.sectionHeading, { color: textSecondary }]}>
          KOKORO VOICE CATALOG
        </Text>

        <View
          style={[
            styles.voiceListCard,
            {
              backgroundColor: cardBg,
              borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.12)' : '#FFFFFF',
              borderBottomColor: isDarkMode ? '#171A20' : '#E2DCD0',
              shadowColor: isDarkMode ? '#000000' : 'rgba(131, 131, 214, 0.14)',
            },
          ]}
        >
          {VOICES.map((voice, idx) => {
            const isSelected = selectedVoiceId === voice.id;
            const isPreviewing =
              isPlayingPreview && playingVoiceId === voice.id;

            return (
              <React.Fragment key={voice.id}>
                <View style={styles.voiceItemRow}>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    style={styles.voiceInfoClickable}
                    onPress={() => handleSelectVoice(voice)}
                  >
                    <View
                      style={[
                        styles.voiceAvatar,
                        {
                          backgroundColor: isSelected
                            ? Colors.LavenderPurple
                            : surfaceAlt,
                          borderColor: isSelected ? '#FFFFFF' : borderLight,
                        },
                      ]}
                    >
                      <Mic
                        size={16}
                        color={isSelected ? '#FFFFFF' : textSecondary}
                        strokeWidth={2.2}
                      />
                    </View>

                    <View style={styles.voiceMeta}>
                      <View style={styles.voiceNameRow}>
                        <Text
                          style={[
                            styles.voiceName,
                            { color: textPrimary },
                            isSelected && styles.voiceNameSelected,
                          ]}
                        >
                          {voice.name}
                        </Text>
                        <Badge
                          label={voice.tag}
                          variant={isSelected ? 'purple' : 'neutral'}
                          size="sm"
                        />
                      </View>
                      <Text
                        style={[styles.voiceItemDesc, { color: textSecondary }]}
                      >
                        {voice.personality} • {voice.accent}
                      </Text>
                    </View>
                  </TouchableOpacity>

                  <View style={styles.voiceItemActions}>
                    <TouchableOpacity
                      activeOpacity={0.7}
                      style={[
                        styles.itemPlayBtn,
                        {
                          backgroundColor: surfaceAlt,
                          borderColor: borderLight,
                        },
                      ]}
                      onPress={() => handleTogglePreview(voice.id)}
                      accessibilityRole="button"
                      accessibilityLabel={`Preview ${voice.name}`}
                    >
                      {isPreviewing ? (
                        <Square
                          size={14}
                          color={Colors.LavenderPurple}
                          fill={Colors.LavenderPurple}
                        />
                      ) : (
                        <Play
                          size={14}
                          color={Colors.LavenderPurple}
                          fill={Colors.LavenderPurple}
                        />
                      )}
                    </TouchableOpacity>

                    {isSelected && (
                      <View style={styles.activeCheckBadge}>
                        <Check size={14} color="#FFFFFF" strokeWidth={3} />
                      </View>
                    )}
                  </View>
                </View>

                {idx < VOICES.length - 1 && (
                  <View
                    style={[
                      styles.itemDivider,
                      { backgroundColor: borderLight },
                    ]}
                  />
                )}
              </React.Fragment>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
};

export default VoiceStudioScreen;

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
  heroVoiceCard: {
    borderRadius: 20,
    borderWidth: 1,
    borderBottomWidth: 3,
    padding: ResponsivePixels.size16,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 3,
    marginBottom: ResponsivePixels.size20,
  },
  heroVoiceTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: ResponsivePixels.size12,
  },
  heroVoiceInfo: {
    flex: 1,
    paddingRight: 12,
  },
  heroVoiceName: {
    fontFamily: Fonts.ranade.bold,
    fontSize: 22,
    marginBottom: 4,
  },
  heroVoiceDescription: {
    ...Typography.bodySmallPoppinsRegular,
    fontSize: 13,
  },
  heroPreviewPlayBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.LavenderPurple,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 4,
  },
  waveVisualizerContainer: {
    borderRadius: 12,
    borderWidth: 1,
    paddingVertical: ResponsivePixels.size12,
    paddingHorizontal: ResponsivePixels.size16,
    alignItems: 'center',
    marginBottom: ResponsivePixels.size12,
  },
  waveBarsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 28,
    gap: 8,
    marginBottom: 6,
  },
  waveBar: {
    width: 5,
    height: 24,
    borderRadius: 2.5,
  },
  waveStatusLabel: {
    ...Typography.bodySuperSmallPoppinsRegularLoose,
    fontSize: 11,
    fontFamily: Fonts.poppins.medium,
  },
  heroTagsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badgeGap: {
    width: 8,
  },
  sectionHeading: {
    ...Typography.bodySuperSmallPoppinsRegularLoose,
    fontFamily: Fonts.poppins.semiBold,
    fontSize: 11,
    letterSpacing: 1,
    marginBottom: ResponsivePixels.size8,
    marginLeft: 4,
  },
  playgroundCard: {
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
  playgroundHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: ResponsivePixels.size12,
  },
  playgroundHeaderTitle: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: 14,
  },
  textInputBox: {
    borderRadius: 14,
    borderWidth: 1.5,
    padding: ResponsivePixels.size12,
    minHeight: 76,
    marginBottom: ResponsivePixels.size12,
  },
  textInputField: {
    fontFamily: Fonts.poppins.regular,
    fontSize: 13,
    textAlignVertical: 'top',
    padding: 0,
  },
  presetChipsLabel: {
    ...Typography.bodySuperSmallPoppinsRegularLoose,
    fontSize: 11,
    marginBottom: 6,
  },
  presetChipsScroll: {
    gap: 8,
    paddingBottom: 6,
  },
  presetChip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 14,
    borderWidth: 1,
    maxWidth: 220,
  },
  presetChipText: {
    fontFamily: Fonts.poppins.regular,
    fontSize: 12,
  },
  statusBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
    gap: 8,
  },
  statusSpinner: {
    marginRight: 4,
  },
  statusText: {
    ...Typography.bodySmallPoppinsRegular,
    fontSize: 12,
    fontFamily: Fonts.poppins.medium,
  },
  playgroundActionsRow: {
    marginTop: ResponsivePixels.size10,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 46,
    borderRadius: 23,
    gap: 8,
  },
  stopBtn: {
    backgroundColor: '#FF3B30',
  },
  disabledBtn: {
    opacity: 0.6,
  },
  actionBtnText: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: 14,
    color: '#FFFFFF',
  },
  settingsBentoCard: {
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
  controlHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: ResponsivePixels.size12,
  },
  controlHeaderTitle: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: 14,
  },
  speedPillsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  speedPill: {
    flex: 1,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  speedPillText: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: 13,
  },
  voiceListCard: {
    borderRadius: 20,
    borderWidth: 1,
    borderBottomWidth: 3,
    padding: ResponsivePixels.size12,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
    marginBottom: ResponsivePixels.size24,
  },
  voiceItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: ResponsivePixels.size10,
    paddingHorizontal: ResponsivePixels.size4,
  },
  voiceInfoClickable: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  voiceAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  voiceMeta: {
    flex: 1,
  },
  voiceNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 2,
  },
  voiceName: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: 14,
  },
  voiceNameSelected: {
    fontFamily: Fonts.poppins.bold,
  },
  voiceItemDesc: {
    ...Typography.bodySuperSmallPoppinsRegularLoose,
    fontSize: 11,
  },
  voiceItemActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  itemPlayBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeCheckBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.LavenderPurple,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemDivider: {
    height: 1,
    marginVertical: 4,
  },
});
