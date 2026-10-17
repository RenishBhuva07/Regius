import React, { useState, useEffect, useRef, useContext } from 'react';
import {
  StyleSheet,
  ScrollView,
  Animated,
  Platform,
  StatusBar,
  Easing,
} from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import ResponsivePixels from '../../Assets/StyleUtilities/ResponsivePixels';
import { AuthContext } from '../../Context/AuthContext';
import { resetNavigation } from '../../Navigators/Navigator';
import { VoiceSettingsService } from '../../Services/VoiceSettingsService';
import { AudioPlayerService } from '../../Services/AudioPlayerService';
import { RegiusSpeechService } from '../../Services/RegiusSpeechService';
import type { VoiceOption } from './Components';
import {
  VOICES,
  useSettingsTheme,
  SettingsHeader,
  ProfileCard,
  DefaultVoiceSection,
  AppearanceSection,
  AiWorkflowSection,
  StorageSection,
  AccountSupportSection,
  SettingsFooter,
  VoiceStudioModal,
  EditProfileModal,
  ClearCacheModal,
  LogoutConfirmModal,
} from './Components';

export type { VoiceOption };
export { VOICES };

const SettingsScreen: React.FC = () => {
  const { bgMain, isDarkMode } = useSettingsTheme();
  const { logout } = useContext(AuthContext);
  const insets = useSafeAreaInsets();

  const [profileName, setProfileName] = useState('Alex Mercer');
  const [profileEmail, setProfileEmail] = useState('alex.mercer@regius.ai');
  const [profileBio, setProfileBio] = useState('Architect & Product Designer');
  const [profileRole, setProfileRole] = useState('Regius Pro Member');

  const [selectedVoiceId, setSelectedVoiceId] = useState('af_bella');
  const [speechSpeed, setSpeechSpeed] = useState<number>(1.0);
  const [autoSpeakReplies, setAutoSpeakReplies] = useState(true);
  const [wakeWordEnabled, setWakeWordEnabled] = useState(true);

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [hapticFeedback, setHapticFeedback] = useState(true);
  const [smartCategorization, setSmartCategorization] = useState(true);
  const [morningBriefing, setMorningBriefing] = useState(true);
  const [cloudSync, setCloudSync] = useState(true);
  const [cacheSize, setCacheSize] = useState('14.8 MB');

  const [voiceModalVisible, setVoiceModalVisible] = useState(false);
  const [profileModalVisible, setProfileModalVisible] = useState(false);
  const [cacheConfirmVisible, setCacheConfirmVisible] = useState(false);
  const [logoutConfirmVisible, setLogoutConfirmVisible] = useState(false);

  const [isPlayingPreview, setIsPlayingPreview] = useState(false);
  const [playingVoiceId, setPlayingVoiceId] = useState<string | null>(null);

  const waveAnim1 = useRef(new Animated.Value(0.3)).current;
  const waveAnim2 = useRef(new Animated.Value(0.7)).current;
  const waveAnim3 = useRef(new Animated.Value(0.4)).current;
  const waveAnim4 = useRef(new Animated.Value(0.9)).current;
  const waveAnim5 = useRef(new Animated.Value(0.5)).current;

  // Load saved voice settings from AsyncStorage
  useEffect(() => {
    VoiceSettingsService.getSettings().then(saved => {
      if (saved.selectedVoiceId) setSelectedVoiceId(saved.selectedVoiceId);
      if (saved.speechSpeed) setSpeechSpeed(saved.speechSpeed);
      if (saved.autoSpeakReplies !== undefined)
        setAutoSpeakReplies(saved.autoSpeakReplies);
      if (saved.wakeWordEnabled !== undefined)
        setWakeWordEnabled(saved.wakeWordEnabled);
    });

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
        artist: `Kokoro Neural Voice (${targetVoice.kokoroVoiceId})`,
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
    VoiceSettingsService.saveSettings({ wakeWordEnabled: enabled });
  };

  const handleSaveProfile = (data: {
    name: string;
    email: string;
    bio: string;
    role: string;
  }) => {
    setProfileName(data.name);
    setProfileEmail(data.email);
    setProfileBio(data.bio);
    setProfileRole(data.role);
    setProfileModalVisible(false);
    Toast.show({
      type: 'success',
      text2: 'Profile updated successfully!',
    });
  };

  const handleClearCache = () => {
    setCacheSize('0.0 KB');
    setCacheConfirmVisible(false);
    Toast.show({
      type: 'success',
      text2: 'Cache and temporary files cleared',
    });
  };

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: bgMain }]}
      edges={['top']}
    >
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        {...(Platform.OS === 'android'
          ? { backgroundColor: bgMain, translucent: true }
          : {})}
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: 120 + insets.bottom },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <SettingsHeader />

        <ProfileCard
          name={profileName}
          email={profileEmail}
          bio={profileBio}
          role={profileRole}
          selectedVoiceName={selectedVoice.name}
          onEditPress={() => setProfileModalVisible(true)}
        />

        <DefaultVoiceSection
          selectedVoice={selectedVoice}
          voices={VOICES}
          onSelectVoice={handleSelectVoice}
          onOpenVoiceStudio={() => setVoiceModalVisible(true)}
          isPlayingPreview={isPlayingPreview}
          playingVoiceId={playingVoiceId}
          onTogglePreview={handleTogglePreview}
          waveAnims={[waveAnim1, waveAnim2, waveAnim3, waveAnim4, waveAnim5]}
          speechSpeed={speechSpeed}
          onChangeSpeechSpeed={handleChangeSpeechSpeed}
          autoSpeakReplies={autoSpeakReplies}
          onToggleAutoSpeakReplies={handleToggleAutoSpeakReplies}
          wakeWordEnabled={wakeWordEnabled}
          onToggleWakeWord={handleToggleWakeWord}
        />

        <AppearanceSection
          hapticFeedback={hapticFeedback}
          onToggleHapticFeedback={setHapticFeedback}
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
        />

        <SettingsFooter />
      </ScrollView>

      <VoiceStudioModal
        visible={voiceModalVisible}
        onClose={() => setVoiceModalVisible(false)}
        voices={VOICES}
        selectedVoiceId={selectedVoiceId}
        onSelectVoice={handleSelectVoice}
        isPlayingPreview={isPlayingPreview}
        playingVoiceId={playingVoiceId}
        onTogglePreview={handleTogglePreview}
      />

      <EditProfileModal
        visible={profileModalVisible}
        onClose={() => setProfileModalVisible(false)}
        initialName={profileName}
        initialEmail={profileEmail}
        initialBio={profileBio}
        initialRole={profileRole}
        onSave={handleSaveProfile}
      />

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
    </SafeAreaView>
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
    paddingHorizontal: ResponsivePixels.size20,
    paddingTop: ResponsivePixels.size12,
  },
});

export default SettingsScreen;
