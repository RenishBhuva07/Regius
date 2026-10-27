import React, { useState, useEffect, useRef, useMemo } from 'react';
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
  Vibration,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Switch,
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
  Radio,
  RadioTower,
  MessageSquare,
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
import HeaderPatternSvg from '../Dashboard/Components/HeaderPatternSvg';
import { SettingsBackgroundSvg } from './Components/SettingsBackgroundSvg';

const HEADER_HEIGHT = 54;

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
  const { width: screenWidth } = Dimensions.get('window');

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

  // Scroll tracking for reactive header layer
  const scrollY = useRef(new Animated.Value(0)).current;
  const isScrolledRef = useRef(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // 7-Band Animated Wave Visualizers
  const waveAnim1 = useRef(new Animated.Value(0.3)).current;
  const waveAnim2 = useRef(new Animated.Value(0.7)).current;
  const waveAnim3 = useRef(new Animated.Value(0.4)).current;
  const waveAnim4 = useRef(new Animated.Value(0.9)).current;
  const waveAnim5 = useRef(new Animated.Value(0.5)).current;
  const waveAnim6 = useRef(new Animated.Value(0.8)).current;
  const waveAnim7 = useRef(new Animated.Value(0.35)).current;

  const waveAnims = [
    { anim: waveAnim1, color: '#8383D6' },
    { anim: waveAnim2, color: '#F5C518' },
    { anim: waveAnim3, color: '#FF8772' },
    { anim: waveAnim4, color: '#10B981' },
    { anim: waveAnim5, color: '#8383D6' },
    { anim: waveAnim6, color: '#F5C518' },
    { anim: waveAnim7, color: '#FF8772' },
  ];

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

  // Interpolate header visual styles based on scroll position (0 to 30px)
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
    let animLoop: Animated.CompositeAnimation | null = null;
    if (isPlayingPreview || synthesisState === 'speaking') {
      animLoop = Animated.loop(
        Animated.parallel([
          Animated.sequence([
            Animated.timing(waveAnim1, {
              toValue: 1,
              duration: 320,
              easing: Easing.ease,
              useNativeDriver: true,
            }),
            Animated.timing(waveAnim1, {
              toValue: 0.2,
              duration: 320,
              easing: Easing.ease,
              useNativeDriver: true,
            }),
          ]),
          Animated.sequence([
            Animated.timing(waveAnim2, {
              toValue: 0.2,
              duration: 260,
              easing: Easing.ease,
              useNativeDriver: true,
            }),
            Animated.timing(waveAnim2, {
              toValue: 1,
              duration: 260,
              easing: Easing.ease,
              useNativeDriver: true,
            }),
          ]),
          Animated.sequence([
            Animated.timing(waveAnim3, {
              toValue: 1,
              duration: 380,
              easing: Easing.ease,
              useNativeDriver: true,
            }),
            Animated.timing(waveAnim3, {
              toValue: 0.3,
              duration: 380,
              easing: Easing.ease,
              useNativeDriver: true,
            }),
          ]),
          Animated.sequence([
            Animated.timing(waveAnim4, {
              toValue: 0.25,
              duration: 280,
              easing: Easing.ease,
              useNativeDriver: true,
            }),
            Animated.timing(waveAnim4, {
              toValue: 1,
              duration: 280,
              easing: Easing.ease,
              useNativeDriver: true,
            }),
          ]),
          Animated.sequence([
            Animated.timing(waveAnim5, {
              toValue: 1,
              duration: 300,
              easing: Easing.ease,
              useNativeDriver: true,
            }),
            Animated.timing(waveAnim5, {
              toValue: 0.2,
              duration: 300,
              easing: Easing.ease,
              useNativeDriver: true,
            }),
          ]),
          Animated.sequence([
            Animated.timing(waveAnim6, {
              toValue: 0.3,
              duration: 340,
              easing: Easing.ease,
              useNativeDriver: true,
            }),
            Animated.timing(waveAnim6, {
              toValue: 0.95,
              duration: 340,
              easing: Easing.ease,
              useNativeDriver: true,
            }),
          ]),
          Animated.sequence([
            Animated.timing(waveAnim7, {
              toValue: 0.9,
              duration: 290,
              easing: Easing.ease,
              useNativeDriver: true,
            }),
            Animated.timing(waveAnim7, {
              toValue: 0.2,
              duration: 290,
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
      waveAnim6.setValue(0.75);
      waveAnim7.setValue(0.35);
    }

    return () => {
      animLoop?.stop();
    };
  }, [isPlayingPreview, synthesisState]);

  const selectedVoice = VOICES.find(v => v.id === selectedVoiceId) || VOICES[0];

  const handleSelectVoice = (voice: VoiceOption) => {
    Vibration.vibrate(20);
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
    Vibration.vibrate(20);
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
    Vibration.vibrate(30);

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
    Vibration.vibrate(20);
    await KokoroTTSService.stop();
    setSynthesisState('idle');
    setStatusMessage(null);
  };

  const handleChangeSpeed = (speed: number) => {
    Vibration.vibrate(20);
    setSpeechSpeed(speed);
    VoiceSettingsService.setSpeechSpeed(speed);
    Toast.show({
      type: 'info',
      text1: 'Speed Updated',
      text2: `Speech playback rate set to ${speed}x`,
    });
  };

  const handleToggleAutoSpeak = (enabled: boolean) => {
    Vibration.vibrate(20);
    setAutoSpeakReplies(enabled);
    VoiceSettingsService.setAutoSpeakReplies(enabled);
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
        barStyle={isScrolled ? 'light-content' : isDarkMode ? 'light-content' : 'dark-content'}
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

      {/* Luxury Background Artwork */}
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
                    borderColor: borderLight,
                  },
            ]}
            accessibilityRole="button"
            accessibilityLabel="Back to Settings"
          >
            <ChevronLeft
              size={22}
              color={isScrolled ? Colors.DefaultWhite : textPrimary}
              strokeWidth={2.4}
            />
          </TouchableOpacity>

          <View style={styles.headerTitleWrap}>
            <Text
              style={[
                styles.headerTitle,
                isScrolled ? styles.headerTitleScrolled : { color: textPrimary },
              ]}
              numberOfLines={1}
            >
              Voice Studio
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
              Neural TTS & Kokoro Engine
            </Text>
          </View>

          <Badge label="KOKORO 82M" variant="purple" size="sm" />
        </View>
      </Animated.View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: insets.top + HEADER_HEIGHT + 14,
            paddingBottom: insets.bottom + 48,
          },
        ]}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {/* Acoustic Master Console */}
        <View style={styles.heroCardShadowWrapper}>
          <View style={styles.heroCard}>
            <View style={styles.heroHeaderRow}>
              <View style={styles.heroTagRow}>
                <RadioTower size={13} color="#8383D6" strokeWidth={2.4} />
                <Text style={styles.heroTagText}>ACOUSTIC MASTER CONSOLE</Text>
              </View>
              <Badge label="ACTIVE PERSONA" variant="green" size="sm" />
            </View>

            <View style={styles.heroTopRow}>
              <View style={styles.personaAvatarBox}>
                <Mic size={22} color="#8383D6" strokeWidth={2.4} />
              </View>

              <View style={styles.heroVoiceInfo}>
                <Text style={styles.heroVoiceName}>{selectedVoice.name}</Text>
                <Text style={styles.heroVoiceDescription}>
                  {selectedVoice.personality} • {selectedVoice.accent}
                </Text>
              </View>

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => handleTogglePreview(selectedVoice.id)}
                style={styles.heroPreviewPlayBtn}
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

            {/* 7-Band Dynamic Spectrum Visualizer */}
            <View style={styles.waveVisualizerContainer}>
              <View style={styles.waveBarsRow}>
                {waveAnims.map((item, idx) => (
                  <Animated.View
                    key={idx}
                    style={[
                      styles.waveBar,
                      {
                        backgroundColor: item.color,
                        transform: [{ scaleY: item.anim }],
                      },
                    ]}
                  />
                ))}
              </View>
              <Text style={styles.waveStatusLabel}>
                {isPlayingPreview || synthesisState === 'speaking'
                  ? 'Streaming Kokoro-82M Neural Audio'
                  : 'Kokoro Acoustic Buffer Primed & Ready'}
              </Text>
            </View>

            {/* Persona Metas */}
            <View style={styles.heroTagsRow}>
              <Badge label={selectedVoice.tag} variant="purple" size="sm" />
              <Badge
                label={selectedVoice.gender.toUpperCase()}
                variant="neutral"
                size="sm"
              />
              <Badge label="82M PARAMS" variant="yellow" size="sm" />
            </View>
          </View>
        </View>

        {/* Speech Controls & Pacing Bento */}
        <Text style={[styles.sectionHeading, { color: textSecondary }]}>
          SPEECH CONTROLS & PACING
        </Text>

        <View
          style={[
            styles.settingsBentoCard,
            {
              backgroundColor: cardBg,
              borderColor: borderLight,
            },
          ]}
        >
          <View style={styles.controlHeaderRow}>
            <Sliders size={16} color={Colors.LavenderPurple} strokeWidth={2.2} />
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

          <View style={[styles.innerDivider, { backgroundColor: borderLight }]} />

          {/* Conversational Auto-Speak */}
          <View style={styles.toggleRow}>
            <View style={styles.toggleMeta}>
              <Text style={[styles.toggleTitle, { color: textPrimary }]}>
                Auto-Speak Assistant Replies
              </Text>
              <Text style={[styles.toggleSub, { color: textSecondary }]}>
                Spoken audio playback during conversational workflows
              </Text>
            </View>

            <Switch
              value={autoSpeakReplies}
              onValueChange={handleToggleAutoSpeak}
              trackColor={{
                false: isDarkMode ? '#3A3F46' : '#D9D9D9',
                true: Colors.LavenderPurple,
              }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        {/* Neural Speech Playground */}
        <Text style={[styles.sectionHeading, { color: textSecondary }]}>
          NEURAL SPEECH PLAYGROUND
        </Text>

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
            <Sparkles size={16} color={Colors.LavenderPurple} strokeWidth={2.4} />
            <Text style={[styles.playgroundHeaderTitle, { color: textPrimary }]}>
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
              onChangeText={setTestText}
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
            {PRESET_SENTENCES.map((preset, idx) => (
              <TouchableOpacity
                key={idx}
                activeOpacity={0.7}
                style={[
                  styles.presetChip,
                  { backgroundColor: surfaceAlt, borderColor: borderLight },
                ]}
                onPress={() => {
                  Vibration.vibrate(15);
                  setTestText(preset);
                }}
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
                    : 'Synthesize & Speak with Kokoro ✦'}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Kokoro Voice Catalog */}
        <Text style={[styles.sectionHeading, { color: textSecondary }]}>
          KOKORO VOICE CATALOG ({VOICES.length})
        </Text>

        <View
          style={[
            styles.voiceListCard,
            {
              backgroundColor: cardBg,
              borderColor: borderLight,
            },
          ]}
        >
          {VOICES.map((voice, idx) => {
            const isSelected = selectedVoiceId === voice.id;
            const isPreviewing = isPlayingPreview && playingVoiceId === voice.id;

            return (
              <React.Fragment key={voice.id}>
                <View
                  style={[
                    styles.voiceItemRow,
                    isSelected && {
                      backgroundColor: isDarkMode ? '#22283A' : '#EFF2FE',
                    },
                  ]}
                >
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
                    style={[styles.itemDivider, { backgroundColor: borderLight }]}
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
  headerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    shadowColor: '#201646',
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 7,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  backButtonScrolled: {
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    borderColor: 'rgba(255, 255, 255, 0.45)',
  },
  headerTitleWrap: {
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 10,
  },
  headerTitle: {
    fontFamily: Fonts.ranade.bold,
    fontSize: 18,
    letterSpacing: -0.3,
    lineHeight: 22,
  },
  headerTitleScrolled: {
    color: Colors.DefaultWhite,
  },
  headerSubtitle: {
    fontFamily: Fonts.poppins.regular,
    fontSize: 11,
    marginTop: 1,
  },
  headerSubtitleScrolled: {
    color: 'rgba(255, 255, 255, 0.82)',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
  },
  /* 2-Layer Hero Bento */
  heroCardShadowWrapper: {
    borderRadius: 24,
    backgroundColor: Colors.NeroBlack,
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.28,
        shadowRadius: 18,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  heroCard: {
    backgroundColor: Colors.NeroBlack,
    borderRadius: 24,
    borderWidth: 4,
    borderColor: 'rgba(255, 255, 255, 0.9)',
    overflow: 'hidden',
    padding: 18,
  },
  heroHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  heroTagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  heroTagText: {
    fontFamily: Fonts.poppins.bold,
    fontSize: 10,
    color: '#8383D6',
    letterSpacing: 1,
  },
  heroTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
    gap: 12,
  },
  personaAvatarBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#272935',
    borderWidth: 1.5,
    borderColor: 'rgba(131, 131, 214, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroVoiceInfo: {
    flex: 1,
  },
  heroVoiceName: {
    fontFamily: Fonts.ranade.bold,
    fontSize: 20,
    color: '#FFFFFF',
    letterSpacing: -0.4,
    lineHeight: 24,
    marginBottom: 2,
  },
  heroVoiceDescription: {
    fontFamily: Fonts.poppins.regular,
    fontSize: 12,
    color: '#A3A8B1',
  },
  heroPreviewPlayBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.LavenderPurple,
    shadowColor: Colors.LavenderPurple,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 4,
  },
  waveVisualizerContainer: {
    borderRadius: 16,
    backgroundColor: '#16171E',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  waveBarsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 34,
    gap: 6,
    marginBottom: 6,
  },
  waveBar: {
    width: 5,
    height: 30,
    borderRadius: 3,
  },
  waveStatusLabel: {
    fontFamily: Fonts.poppins.medium,
    fontSize: 11,
    color: '#A3A8B1',
  },
  heroTagsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionHeading: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: 11,
    letterSpacing: 0.8,
    marginBottom: 10,
    marginLeft: 2,
  },
  settingsBentoCard: {
    borderRadius: 20,
    borderWidth: 1.5,
    padding: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 20,
  },
  controlHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  controlHeaderTitle: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: 14,
  },
  speedPillsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  speedPill: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  speedPillText: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: 12.5,
  },
  innerDivider: {
    height: 1,
    marginVertical: 14,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  toggleMeta: {
    flex: 1,
    paddingRight: 10,
  },
  toggleTitle: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: 13.5,
    marginBottom: 2,
  },
  toggleSub: {
    fontFamily: Fonts.poppins.regular,
    fontSize: 11,
  },
  playgroundCard: {
    borderRadius: 20,
    borderWidth: 1.5,
    padding: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 20,
  },
  playgroundHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  playgroundHeaderTitle: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: 14,
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
    minHeight: 60,
    textAlignVertical: 'top',
    padding: 0,
  },
  presetChipsLabel: {
    fontFamily: Fonts.poppins.medium,
    fontSize: 11,
    marginBottom: 8,
  },
  presetChipsScroll: {
    gap: 8,
    paddingBottom: 14,
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
  voiceListCard: {
    borderRadius: 20,
    borderWidth: 1.5,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    overflow: 'hidden',
    marginBottom: 20,
  },
  voiceItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 14,
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
    fontFamily: Fonts.poppins.medium,
    fontSize: 14.5,
  },
  voiceNameSelected: {
    fontFamily: Fonts.poppins.bold,
  },
  voiceItemDesc: {
    fontFamily: Fonts.poppins.regular,
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
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: Colors.LavenderPurple,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemDivider: {
    height: 1,
  },
});
