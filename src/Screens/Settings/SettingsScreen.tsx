import React, {
  useState,
  useEffect,
  useRef,
  useContext,
  useCallback,
} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Animated,
  Platform,
  StatusBar,
  Easing,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '../../Assets/StyleUtilities/Colors';
import ResponsivePixels from '../../Assets/StyleUtilities/ResponsivePixels';
import { AuthContext } from '../../Context/AuthContext';
import { resetNavigation } from '../../Navigators/Navigator';
import {
  VoiceSettingsService,
  DEFAULT_VOICE_SETTINGS,
} from '../../Services/VoiceSettingsService';
import { AudioPlayerService } from '../../Services/AudioPlayerService';
import { RegiusSpeechService } from '../../Services/RegiusSpeechService';
import type { VoiceOption } from './Components';
import { useVoiceWakeWord } from '../../Context/VoiceWakeWordContext';
import { useMilestones } from '../../Context/MilestoneContext';
import { usePremium } from '../../Context/PremiumContext';
import { useTheme } from '../../Theme/ThemeContext';
import {
  VOICES,
  useSettingsTheme,
  SettingsHeader,
  SETTINGS_HEADER_HEIGHT,
  ProfileCard,
  DefaultVoiceSection,
  AppearanceSection,
  AiWorkflowSection,
  StorageSection,
  AccountSupportSection,
  SettingsFooter,
  SettingsBackgroundSvg,
  ClearCacheModal,
  LogoutConfirmModal,
  WakeWordSection,
  MilestoneSection,
  SubscriptionSection,
} from './Components';

export type { VoiceOption };
export { VOICES };

const PROFILE_STORAGE_KEY = '@regius_profile_data';

const SettingsScreen: React.FC = () => {
  const { bgMain, isDarkMode } = useSettingsTheme();
  const { logout } = useContext(AuthContext);
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();

  const [profileName, setProfileName] = useState('Alex Mercer');
  const [profileEmail, setProfileEmail] = useState('alex.mercer@regius.ai');
  const [profileBio, setProfileBio] = useState('Architect & Product Designer');
  const [profileRole, setProfileRole] = useState('Regius Pro Member');

  const {
    totalXp,
    currentTier,
    nextTier,
    tierProgress,
    currentInTier,
    requiredForTier,
    completedTasksCount,
    completedRemindersCount,
    habitsFollowedCount,
    isMilestoneModalVisible,
    openMilestoneModal,
    closeMilestoneModal,
  } = useMilestones();
  const { setActiveThemeId } = useTheme();
  const { isPremium } = usePremium();

  const {
    wakeWordPhrase,
    setWakeWordPhrase,
    isWakeWordEnabled,
    setWakeWordEnabled,
    resetToDefaults,
  } = useVoiceWakeWord();

  const [selectedVoiceId, setSelectedVoiceId] = useState('af_bella');
  const [speechSpeed, setSpeechSpeed] = useState<number>(1.0);
  const [autoSpeakReplies, setAutoSpeakReplies] = useState(true);

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [hapticFeedback, setHapticFeedback] = useState(true);
  const [hapticIntensity, setHapticIntensity] = useState<
    'subtle' | 'medium' | 'crisp'
  >('medium');
  const [smartCategorization, setSmartCategorization] = useState(true);
  const [morningBriefing, setMorningBriefing] = useState(true);
  const [cloudSync, setCloudSync] = useState(true);
  const [cacheSize, setCacheSize] = useState('14.8 MB');

  const [cacheConfirmVisible, setCacheConfirmVisible] = useState(false);
  const [logoutConfirmVisible, setLogoutConfirmVisible] = useState(false);

  const [isPlayingPreview, setIsPlayingPreview] = useState(false);
  const [playingVoiceId, setPlayingVoiceId] = useState<string | null>(null);

  // Sync profile data and voice settings whenever screen regains focus
  useFocusEffect(
    useCallback(() => {
      AsyncStorage.getItem(PROFILE_STORAGE_KEY)
        .then(stored => {
          if (stored) {
            try {
              const data = JSON.parse(stored);
              if (data.name) setProfileName(data.name);
              if (data.email) setProfileEmail(data.email);
              if (data.bio) setProfileBio(data.bio);
              if (data.role) setProfileRole(data.role);
            } catch {
              // Ignore
            }
          }
        })
        .catch(() => {});

      VoiceSettingsService.getSettings().then(saved => {
        if (saved.selectedVoiceId) setSelectedVoiceId(saved.selectedVoiceId);
        if (saved.speechSpeed) setSpeechSpeed(saved.speechSpeed);
        if (saved.autoSpeakReplies !== undefined)
          setAutoSpeakReplies(saved.autoSpeakReplies);
      });
    }, []),
  );

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

  const waveAnim1 = useRef(new Animated.Value(0.3)).current;
  const waveAnim2 = useRef(new Animated.Value(0.7)).current;
  const waveAnim3 = useRef(new Animated.Value(0.4)).current;
  const waveAnim4 = useRef(new Animated.Value(0.9)).current;
  const waveAnim5 = useRef(new Animated.Value(0.5)).current;

  // Setup audio preview finished listener
  useEffect(() => {
    const unsubFinished = AudioPlayerService.onPlaybackFinished(() => {
      setIsPlayingPreview(false);
      setPlayingVoiceId(null);
    });

    return () => {
      unsubFinished();
      AudioPlayerService.stop();
    };
  }, []);

  useEffect(() => {
    let animLoop: Animated.CompositeAnimation | null = null;
    if (isPlayingPreview) {
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
              duration: 320,
              easing: Easing.ease,
              useNativeDriver: true,
            }),
          ]),
          Animated.sequence([
            Animated.timing(waveAnim3, {
              toValue: 0.9,
              duration: 400,
              easing: Easing.ease,
              useNativeDriver: true,
            }),
            Animated.timing(waveAnim3, {
              toValue: 0.3,
              duration: 300,
              easing: Easing.ease,
              useNativeDriver: true,
            }),
          ]),
          Animated.sequence([
            Animated.timing(waveAnim4, {
              toValue: 0.3,
              duration: 250,
              easing: Easing.ease,
              useNativeDriver: true,
            }),
            Animated.timing(waveAnim4, {
              toValue: 1,
              duration: 350,
              easing: Easing.ease,
              useNativeDriver: true,
            }),
          ]),
          Animated.sequence([
            Animated.timing(waveAnim5, {
              toValue: 0.8,
              duration: 380,
              easing: Easing.ease,
              useNativeDriver: true,
            }),
            Animated.timing(waveAnim5, {
              toValue: 0.25,
              duration: 280,
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
      if (animLoop) animLoop.stop();
    };
  }, [isPlayingPreview, waveAnim1, waveAnim2, waveAnim3, waveAnim4, waveAnim5]);

  const handleTogglePreview = async (voiceId: string) => {
    if (isPlayingPreview && playingVoiceId === voiceId) {
      await AudioPlayerService.stop();
      setIsPlayingPreview(false);
      setPlayingVoiceId(null);
    } else {
      const targetVoice = VOICES.find(v => v.id === voiceId) || VOICES[0];
      setPlayingVoiceId(voiceId);
      setIsPlayingPreview(true);
      await AudioPlayerService.play({
        id: targetVoice.id,
        url: targetVoice.previewUrl,
        title: targetVoice.name,
        artist: 'Kokoro Neural Voice',
      });
    }
  };

  const selectedVoice = VOICES.find(v => v.id === selectedVoiceId) || VOICES[0];

  const handleSelectVoice = (voice: VoiceOption) => {
    setSelectedVoiceId(voice.id);
    VoiceSettingsService.setSelectedVoice(voice.id);
    RegiusSpeechService.warmupVoice(voice.id).catch(() => {});
    Toast.show({
      type: 'success',
      text2: `Default voice set to ${voice.name} (${voice.tag})`,
    });
  };

  const handleChangeSpeechSpeed = (speed: number) => {
    setSpeechSpeed(speed);
    VoiceSettingsService.setSpeechSpeed(speed);
  };

  const handleToggleAutoSpeakReplies = (enabled: boolean) => {
    setAutoSpeakReplies(enabled);
    VoiceSettingsService.setAutoSpeakReplies(enabled);
  };

  const handleToggleWakeWord = (enabled: boolean) => {
    setWakeWordEnabled(enabled);
  };

  const handleSelectWakePreset = (phrase: string) => {
    setWakeWordPhrase(phrase);
  };

  const handleResetVoiceDefaults = async () => {
    await resetToDefaults();
    setSelectedVoiceId(DEFAULT_VOICE_SETTINGS.selectedVoiceId);
    setSpeechSpeed(DEFAULT_VOICE_SETTINGS.speechSpeed);
    setAutoSpeakReplies(DEFAULT_VOICE_SETTINGS.autoSpeakReplies);
  };

  const handleClearCache = async () => {
    await VoiceSettingsService.clearSettings();
    await resetToDefaults();
    setSelectedVoiceId(DEFAULT_VOICE_SETTINGS.selectedVoiceId);
    setSpeechSpeed(DEFAULT_VOICE_SETTINGS.speechSpeed);
    setAutoSpeakReplies(DEFAULT_VOICE_SETTINGS.autoSpeakReplies);
    setCacheSize('0.0 KB');
    setCacheConfirmVisible(false);
    Toast.show({
      type: 'success',
      text2: 'Cache and voice storage cleared to system defaults',
    });
  };

  return (
    <View style={[styles.safeArea, { backgroundColor: bgMain }]}>
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

      <SettingsHeader scrollY={scrollY} isScrolled={isScrolled} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: insets.top + SETTINGS_HEADER_HEIGHT + 10,
            paddingBottom: 120 + insets.bottom,
          },
        ]}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        <ProfileCard
          name={profileName}
          email={profileEmail}
          bio={profileBio}
          role={isPremium ? 'Regius Royal Member' : profileRole}
          selectedVoiceName={selectedVoice.name}
          onEditPress={() => navigation.navigate('ProfileScreen')}
          milestoneTier={currentTier}
          milestoneXp={totalXp}
          milestoneProgress={tierProgress}
          tasksDoneCount={completedTasksCount}
          habitsFollowedCount={habitsFollowedCount}
          onMilestonePress={openMilestoneModal}
          isPremium={isPremium}
          onProPress={() => navigation.navigate('SubscriptionScreen')}
        />

        <SubscriptionSection
          onUpgradePress={() => navigation.navigate('SubscriptionScreen')}
        />

        <MilestoneSection
          currentTier={currentTier}
          nextTier={nextTier}
          totalXp={totalXp}
          tierProgress={tierProgress}
          currentInTier={currentInTier}
          requiredForTier={requiredForTier}
          onOpenMilestoneJourney={openMilestoneModal}
        />

        <DefaultVoiceSection
          selectedVoice={selectedVoice}
          voices={VOICES}
          onSelectVoice={handleSelectVoice}
          onOpenVoiceStudio={() => navigation.navigate('VoiceStudioScreen')}
          isPlayingPreview={isPlayingPreview}
          playingVoiceId={playingVoiceId}
          onTogglePreview={handleTogglePreview}
          waveAnims={[waveAnim1, waveAnim2, waveAnim3, waveAnim4, waveAnim5]}
          speechSpeed={speechSpeed}
          onChangeSpeechSpeed={handleChangeSpeechSpeed}
          autoSpeakReplies={autoSpeakReplies}
          onToggleAutoSpeakReplies={handleToggleAutoSpeakReplies}
          onResetDefaults={handleResetVoiceDefaults}
        />

        <WakeWordSection
          wakeWordEnabled={isWakeWordEnabled}
          onToggleWakeWord={handleToggleWakeWord}
          wakeWordPhrase={wakeWordPhrase}
          onConfigureWakeWord={() =>
            navigation.navigate('WakeWordStudioScreen')
          }
          onSelectPresetPhrase={handleSelectWakePreset}
          onResetDefaults={handleResetVoiceDefaults}
        />

        <AppearanceSection
          hapticFeedback={hapticFeedback}
          onToggleHapticFeedback={setHapticFeedback}
          hapticIntensity={hapticIntensity}
          onChangeHapticIntensity={setHapticIntensity}
          onOpenLanguage={() => navigation.navigate('LanguageScreen')}
          onOpenMilestones={openMilestoneModal}
          onOpenTheme={() => navigation.navigate('ThemeScreen')}
        />

        <AiWorkflowSection
          smartCategorization={smartCategorization}
          onToggleSmartCategorization={setSmartCategorization}
          morningBriefing={morningBriefing}
          onToggleMorningBriefing={setMorningBriefing}
          notificationsEnabled={notificationsEnabled}
          onToggleNotifications={setNotificationsEnabled}
        />

        <StorageSection
          cloudSync={cloudSync}
          onToggleCloudSync={setCloudSync}
          cacheSize={cacheSize}
          onClearCachePress={() => setCacheConfirmVisible(true)}
        />

        <AccountSupportSection
          profileEmail={profileEmail}
          onSignOutPress={() => setLogoutConfirmVisible(true)}
          onHelpFaqPress={() => navigation.navigate('HelpFaqScreen')}
          onPrivacySecurityPress={() =>
            navigation.navigate('PrivacySecurityScreen')
          }
          onSubscriptionPress={() => navigation.navigate('SubscriptionScreen')}
        />

        <SettingsFooter />
      </ScrollView>

      <ClearCacheModal
        visible={cacheConfirmVisible}
        cacheSize={cacheSize}
        onCancel={() => setCacheConfirmVisible(false)}
        onConfirm={handleClearCache}
      />

      <LogoutConfirmModal
        visible={logoutConfirmVisible}
        onCancel={() => setLogoutConfirmVisible(false)}
        onConfirm={() => {
          setLogoutConfirmVisible(false);
          logout();
          Toast.show({
            type: 'info',
            text2: 'Signed out of Regius',
          });
          resetNavigation('Login');
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: ResponsivePixels.size16,
  },
});

export default SettingsScreen;
