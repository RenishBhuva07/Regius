import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  Vibration,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Mic, Play, Square, RadioTower } from 'lucide-react-native';
import Toast from 'react-native-toast-message';

import { Fonts } from '../../Theme/fonts';
import { Colors } from '../../Assets/StyleUtilities/Colors';
import { Badge } from '../../Common/Badge';
import {
  SubScreenHeader,
  SUB_SCREEN_HEADER_HEIGHT,
} from '../../Common/SubScreenHeader';
import { useScrollReactiveHeader } from '../../Common/useScrollReactiveHeader';
import { useTheme } from '../../Theme/ThemeContext';
import { VOICES, VoiceOption } from './Components/types';
import { VoiceSettingsService } from '../../Services/VoiceSettingsService';
import { AudioPlayerService } from '../../Services/AudioPlayerService';
import { RegiusSpeechService } from '../../Services/RegiusSpeechService';
import { KokoroTTSService } from '../../Services/Kokoro/KokoroTTSService';
import { SettingsBackgroundSvg } from './Components/SettingsBackgroundSvg';
import {
  VoiceWaveVisualizer,
  VoiceSpeedSelector,
  VoiceAutoSpeakCard,
  VoicePlaygroundCard,
  VoiceCardItem,
} from './VoiceStudio/Components';

const HEADER_HEIGHT = SUB_SCREEN_HEADER_HEIGHT;

export const VoiceStudioScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
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

  // Scroll tracking for reactive header layer
  const { scrollY, isScrolled, handleScroll } = useScrollReactiveHeader();

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
      {/* Luxury Background Artwork */}
      <SettingsBackgroundSvg />

      {/* Scroll-Reactive Header */}
      <SubScreenHeader
        title="Voice Studio"
        subtitle="Neural TTS & Kokoro Engine"
        scrollY={scrollY}
        isScrolled={isScrolled}
        badge={{ label: 'KOKORO 82M', variant: 'purple' }}
        backAccessibilityLabel="Back to Settings"
      />

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
            <VoiceWaveVisualizer
              isActive={isPlayingPreview || synthesisState === 'speaking'}
            />

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
          <VoiceSpeedSelector
            speechSpeed={speechSpeed}
            onChangeSpeed={handleChangeSpeed}
            borderLight={borderLight}
            surfaceAlt={surfaceAlt}
            textPrimary={textPrimary}
          />

          <View
            style={[styles.innerDivider, { backgroundColor: borderLight }]}
          />

          <VoiceAutoSpeakCard
            autoSpeakReplies={autoSpeakReplies}
            onToggleAutoSpeak={handleToggleAutoSpeak}
            isDarkMode={isDarkMode}
            textPrimary={textPrimary}
            textSecondary={textSecondary}
          />
        </View>

        {/* Neural Speech Playground */}
        <Text style={[styles.sectionHeading, { color: textSecondary }]}>
          NEURAL SPEECH PLAYGROUND
        </Text>

        <VoicePlaygroundCard
          testText={testText}
          onChangeTestText={setTestText}
          onSelectPreset={preset => {
            Vibration.vibrate(15);
            setTestText(preset);
          }}
          synthesisState={synthesisState}
          statusMessage={statusMessage}
          onSynthesize={handleGenerateAndSpeak}
          onStop={handleStopSpeech}
          cardBg={cardBg}
          borderLight={borderLight}
          surfaceAlt={surfaceAlt}
          textPrimary={textPrimary}
          textSecondary={textSecondary}
        />

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
            const isPreviewing =
              isPlayingPreview && playingVoiceId === voice.id;

            return (
              <React.Fragment key={voice.id}>
                <VoiceCardItem
                  voice={voice}
                  isSelected={isSelected}
                  isPreviewing={isPreviewing}
                  onSelectVoice={handleSelectVoice}
                  onTogglePreview={handleTogglePreview}
                  isDarkMode={isDarkMode}
                  textPrimary={textPrimary}
                  textSecondary={textSecondary}
                  borderLight={borderLight}
                  surfaceAlt={surfaceAlt}
                />
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
  },
  heroCardShadowWrapper: {
    borderRadius: 24,
    backgroundColor: '#000000',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.28,
    shadowRadius: 18,
    elevation: 8,
    marginBottom: 26,
  },
  heroCard: {
    borderRadius: 24,
    borderWidth: 4,
    borderColor: 'rgba(255, 255, 255, 0.9)',
    backgroundColor: Colors.NeroBlack,
    padding: 20,
    overflow: 'hidden',
  },
  heroHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  heroTagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  heroTagText: {
    fontFamily: Fonts.poppins.bold,
    fontSize: 10.5,
    letterSpacing: 0.8,
    color: '#8383D6',
  },
  heroTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },
  personaAvatarBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(131, 131, 214, 0.15)',
    borderWidth: 1.5,
    borderColor: 'rgba(131, 131, 214, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  heroVoiceInfo: {
    flex: 1,
  },
  heroVoiceName: {
    fontFamily: Fonts.poppins.bold,
    fontSize: 20,
    color: '#FFFFFF',
    letterSpacing: -0.4,
  },
  heroVoiceDescription: {
    fontFamily: Fonts.poppins.regular,
    fontSize: 12,
    color: '#A3A8B1',
    marginTop: 2,
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
  heroTagsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionHeading: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: 11,
    letterSpacing: 1.2,
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  settingsBentoCard: {
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
  innerDivider: {
    height: 1,
    marginVertical: 16,
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
  itemDivider: {
    height: 1,
  },
});

export default VoiceStudioScreen;
