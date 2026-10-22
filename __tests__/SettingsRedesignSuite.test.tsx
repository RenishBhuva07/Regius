import React from 'react';
import ReactTestRenderer, { act } from 'react-test-renderer';
import { Vibration } from 'react-native';

jest.mock('../src/Assets/Images', () => ({
  SVGS: {
    RegiusAvatar: () => null,
  },
}));

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    canGoBack: () => true,
    goBack: jest.fn(),
  }),
}));

jest.mock('react-native-toast-message', () => ({
  show: jest.fn(),
}));

import { ProBadge } from '../src/Common/ProBadge';
import { SettingsHeader } from '../src/Screens/Settings/Components/SettingsHeader';
import { ProfileCard } from '../src/Screens/Settings/Components/ProfileCard';
import { StorageSection } from '../src/Screens/Settings/Components/StorageSection';
import { AppearanceSection } from '../src/Screens/Settings/Components/AppearanceSection';
import { DefaultVoiceSection } from '../src/Screens/Settings/Components/DefaultVoiceSection';
import WakeWordSection from '../src/Screens/Settings/Components/WakeWordSection';
import { SettingsFooter } from '../src/Screens/Settings/Components/SettingsFooter';
import { VOICES } from '../src/Screens/Settings/Components/types';

describe('Settings Redesign & Fixes Suite', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(Vibration, 'vibrate').mockImplementation(jest.fn());
  });

  describe('Universal ProBadge', () => {
    it('renders PRO label cleanly', () => {
      let tree: any;
      act(() => {
        tree = ReactTestRenderer.create(<ProBadge size="sm" />);
      });
      const str = JSON.stringify(tree.toJSON());
      expect(str).toContain('PRO');
    });

    it('handles onPress when supplied', () => {
      const onPressMock = jest.fn();
      let tree: any;
      act(() => {
        tree = ReactTestRenderer.create(<ProBadge onPress={onPressMock} />);
      });
      const touchable = tree.root.findByProps({ accessibilityRole: 'button' });
      act(() => {
        touchable.props.onPress();
      });
      expect(onPressMock).toHaveBeenCalledTimes(1);
    });
  });

  describe('SettingsHeader', () => {
    it('renders Settings and PRO badge without v2.4 Pro', () => {
      let tree: any;
      act(() => {
        tree = ReactTestRenderer.create(<SettingsHeader />);
      });
      const str = JSON.stringify(tree.toJSON());
      expect(str).toContain('Settings');
      expect(str).toContain('PRO');
      expect(str).not.toContain('v2.4 Pro');
    });
  });

  describe('ProfileCard', () => {
    it('renders ProBadge and designation without quotes', () => {
      let tree: any;
      act(() => {
        tree = ReactTestRenderer.create(
          <ProfileCard
            name="Alex Mercer"
            email="alex@regius.ai"
            bio="Lead Architect & Designer"
            role="Regius Pro Member"
            selectedVoiceName="Bella"
            onEditPress={jest.fn()}
          />,
        );
      });
      const str = JSON.stringify(tree.toJSON());
      expect(str).toContain('Alex Mercer');
      expect(str).toContain('PRO');
      expect(str).toContain('Lead Architect & Designer');
      expect(str).not.toContain('&ldquo;');
      expect(str).not.toContain('&rdquo;');
    });
  });

  describe('StorageSection', () => {
    it('renders live last synced pill and interactive sync now button', async () => {
      const onSyncNowMock = jest.fn().mockResolvedValue(undefined);
      let tree: any;
      await act(async () => {
        tree = ReactTestRenderer.create(
          <StorageSection
            cloudSync={true}
            onToggleCloudSync={jest.fn()}
            cacheSize="14.8 MB"
            onClearCachePress={jest.fn()}
            onSyncNow={onSyncNowMock}
          />,
        );
      });

      const strInitial = JSON.stringify(tree.toJSON());
      expect(strInitial).toContain('Last synced');
      expect(strInitial).toContain('2m ago');
      expect(strInitial).toContain('Sync Now');

      const syncBtn = tree.root.findByProps({
        accessibilityLabel: 'Sync Now with Cloud',
      });
      await act(async () => {
        await syncBtn.props.onPress();
      });

      expect(onSyncNowMock).toHaveBeenCalledTimes(1);
      expect(Vibration.vibrate).toHaveBeenCalled();

      const strUpdated = JSON.stringify(tree.toJSON());
      expect(strUpdated).toContain('Last synced');
      expect(strUpdated).toContain('just now');
    });
  });

  describe('AppearanceSection', () => {
    it('renders Subtle, Medium, and Crisp pills and triggers vibration feedback', () => {
      const onChangeIntensityMock = jest.fn();
      let tree: any;
      act(() => {
        tree = ReactTestRenderer.create(
          <AppearanceSection
            hapticFeedback={true}
            onToggleHapticFeedback={jest.fn()}
            hapticIntensity="medium"
            onChangeHapticIntensity={onChangeIntensityMock}
          />,
        );
      });

      const str = JSON.stringify(tree.toJSON());
      expect(str).toContain('Subtle');
      expect(str).toContain('Medium');
      expect(str).toContain('Crisp');

      const subtlePill = tree.root.findByProps({
        accessibilityLabel: 'Set haptic intensity to Subtle',
      });
      act(() => {
        subtlePill.props.onPress();
      });

      expect(onChangeIntensityMock).toHaveBeenCalledWith('subtle');
      expect(Vibration.vibrate).toHaveBeenCalledWith(15);
    });
  });

  describe('DefaultVoiceSection', () => {
    it('renders round voice presets by name and never includes raw IDs', () => {
      let tree: any;
      act(() => {
        tree = ReactTestRenderer.create(
          <DefaultVoiceSection
            selectedVoice={VOICES[0]}
            voices={VOICES}
            onSelectVoice={jest.fn()}
            onOpenVoiceStudio={jest.fn()}
            isPlayingPreview={false}
            playingVoiceId={null}
            onTogglePreview={jest.fn()}
            waveAnims={[]}
            speechSpeed={1.0}
            onChangeSpeechSpeed={jest.fn()}
            autoSpeakReplies={true}
            onToggleAutoSpeakReplies={jest.fn()}
          />,
        );
      });

      const str = JSON.stringify(tree.toJSON());
      expect(str).toContain('Bella');
      expect(str).toContain('Nicole');
      expect(str).toContain('Adam');

      // Absolutely no raw IDs
      expect(str).not.toContain('af_bella');
      expect(str).not.toContain('am_adam');
      expect(str).not.toContain('af_nicole');

      // Speech speed removed
      expect(str).not.toContain('Speech Speed:');

      // Inside box header
      expect(str).toContain('Voice Presets:');
      expect(str).not.toContain('Switch Voice Preset:');

      // Play/Pause button
      const playBtn = tree.root.findByProps({
        accessibilityLabel: 'Play Voice Preview',
      });
      expect(playBtn).toBeTruthy();
    });

    it('triggers inside Reset Voice Defaults button when pressed', () => {
      const onResetMock = jest.fn();
      let tree: any;
      act(() => {
        tree = ReactTestRenderer.create(
          <DefaultVoiceSection
            selectedVoice={VOICES[0]}
            voices={VOICES}
            onSelectVoice={jest.fn()}
            onOpenVoiceStudio={jest.fn()}
            isPlayingPreview={false}
            playingVoiceId={null}
            onTogglePreview={jest.fn()}
            waveAnims={[]}
            autoSpeakReplies={true}
            onToggleAutoSpeakReplies={jest.fn()}
            onResetDefaults={onResetMock}
          />,
        );
      });

      const resetBtn = tree.root.findByProps({
        accessibilityLabel: 'Reset voice defaults',
      });
      act(() => {
        resetBtn.props.onPress();
      });
      expect(onResetMock).toHaveBeenCalledTimes(1);
    });
  });

  describe('WakeWordSection', () => {
    it('renders contained microphone threshold callout and triggers reset defaults', () => {
      const onConfigureMock = jest.fn();
      const onResetMock = jest.fn();
      let tree: any;
      act(() => {
        tree = ReactTestRenderer.create(
          <WakeWordSection
            wakeWordEnabled={false}
            onToggleWakeWord={jest.fn()}
            wakeWordPhrase="Hey Sia"
            onConfigureWakeWord={onConfigureMock}
            onResetDefaults={onResetMock}
          />,
        );
      });

      const str = JSON.stringify(tree.toJSON());
      expect(str).toContain(
        'Tap to test acoustic microphone threshold & sensitivity',
      );
      expect(str).toContain('Reset Wake Word Defaults');

      const configBtn = tree.root.findByProps({
        accessibilityLabel:
          'Test acoustic microphone threshold and sensitivity',
      });
      act(() => {
        configBtn.props.onPress();
      });
      expect(onConfigureMock).toHaveBeenCalledTimes(1);

      const resetBtn = tree.root.findByProps({
        accessibilityLabel: 'Reset wake word defaults',
      });
      act(() => {
        resetBtn.props.onPress();
      });
      expect(onResetMock).toHaveBeenCalledTimes(1);
    });
  });

  describe('SettingsFooter', () => {
    it('renders prominent Regius brand title and signoff matching other screen typography', () => {
      let tree: any;
      act(() => {
        tree = ReactTestRenderer.create(<SettingsFooter />);
      });
      const str = JSON.stringify(tree.toJSON());
      expect(str).toContain('Regius');
      expect(str).toContain('Crafted');
      expect(str).toContain('with AI & Precision');
      expect(str).toContain('Ahmedabad, India');
      expect(str).toContain('Version 2.4.0 (Build 2408) • Production');
    });
  });
});
