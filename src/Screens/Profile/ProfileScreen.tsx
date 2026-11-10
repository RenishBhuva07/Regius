import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Animated,
  Dimensions,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Check } from 'lucide-react-native';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Colors } from '../../Assets/StyleUtilities/Colors';
import ResponsivePixels from '../../Assets/StyleUtilities/ResponsivePixels';
import { SubScreenHeader } from '../../Common/SubScreenHeader';
import { useScrollReactiveHeader } from '../../Common/useScrollReactiveHeader';
import { ProBadge } from '../../Common/ProBadge';
import { StickyActionDock } from '../../Common/StickyActionDock';
import { StickyBottomButton } from '../../Common/StickyBottomButton';
import { useTheme } from '../../Theme/ThemeContext';
import { useTaskReminder } from '../../Context/TaskReminderContext';
import { SettingsBackgroundSvg } from '../Settings/Components/SettingsBackgroundSvg';
import {
  ProfileAvatarHero,
  ProfileStatsMatrix,
  ProfileCredentialsForm,
} from './Components';

const { width: screenWidth } = Dimensions.get('window');
const PROFILE_STORAGE_KEY = '@regius_profile_data';

export const ProfileScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const { isDarkMode, Colors: themeColors } = useTheme();
  const { tasks, habits } = useTaskReminder();

  const [name, setName] = useState('Alex Mercer');
  const [email, setEmail] = useState('alex.mercer@regius.ai');
  const [bio, setBio] = useState('Architect & Product Designer');
  const [role, setRole] = useState('Regius Pro Member');
  const [isSaving, setIsSaving] = useState(false);

  const { scrollY, isScrolled, handleScroll } = useScrollReactiveHeader();

  const completedTasksCount = tasks.filter(t => t.done).length;
  const activeHabitsStreak = habits.reduce(
    (acc, h) => Math.max(acc, h.streak || 0),
    14,
  );

  useEffect(() => {
    AsyncStorage.getItem(PROFILE_STORAGE_KEY)
      .then(stored => {
        if (stored) {
          try {
            const data = JSON.parse(stored);
            if (data.name) setName(data.name);
            if (data.email) setEmail(data.email);
            if (data.bio) setBio(data.bio);
            if (data.role) setRole(data.role);
          } catch {
            // keep defaults
          }
        }
      })
      .catch(() => {});
  }, []);

  const handleSave = async () => {
    if (!name.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Required Field',
        text2: 'Please provide your name',
      });
      return;
    }

    setIsSaving(true);
    const profilePayload = {
      name: name.trim(),
      email: email.trim(),
      bio: bio.trim(),
      role: role.trim(),
    };

    try {
      await AsyncStorage.setItem(
        PROFILE_STORAGE_KEY,
        JSON.stringify(profilePayload),
      );
      Toast.show({
        type: 'success',
        text1: 'Profile Updated',
        text2: 'Your luxury profile changes have been saved.',
      });
      setTimeout(() => {
        navigation.goBack();
      }, 500);
    } catch {
      Toast.show({
        type: 'error',
        text1: 'Save Error',
        text2: 'Failed to update profile.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCameraPress = () => {
    Toast.show({
      type: 'info',
      text1: 'Avatar Photo',
      text2: 'Photo upload available in upcoming cloud release.',
    });
  };

  const bgMain =
    themeColors.Background || (isDarkMode ? '#121417' : Colors.CreamBackground);

  return (
    <View style={[styles.container, { backgroundColor: bgMain }]}>
      <SettingsBackgroundSvg />

      {/* Scroll-Reactive Header */}
      <SubScreenHeader
        title="Profile & Account"
        subtitle="Identity & Persona"
        scrollY={scrollY}
        isScrolled={isScrolled}
        isAbsolute={false}
        rightAction={<ProBadge size="sm" />}
        backAccessibilityLabel="Back to Settings"
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}
      >
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
          {/* Avatar Hero Bento */}
          <ProfileAvatarHero
            name={name}
            email={email}
            onPressCamera={handleCameraPress}
            screenWidth={screenWidth}
            insetsTop={insets.top}
          />

          {/* Activity & Discipline Matrix Bento */}
          <ProfileStatsMatrix
            completedTasksCount={completedTasksCount}
            activeHabitsStreak={activeHabitsStreak}
            isDarkMode={isDarkMode}
          />

          {/* Form Fields Section */}
          <ProfileCredentialsForm
            name={name}
            email={email}
            bio={bio}
            role={role}
            onChangeName={setName}
            onChangeEmail={setEmail}
            onChangeBio={setBio}
            onChangeRole={setRole}
            isDarkMode={isDarkMode}
          />
        </Animated.ScrollView>
      </KeyboardAvoidingView>

      {/* Floating Action Dock */}
      <StickyActionDock>
        <StickyBottomButton
          title="Save Profile Changes"
          onPress={handleSave}
          loading={isSaving}
          accessibilityLabel="Save Profile Changes"
          icon={
            <Check
              size={18}
              color={isDarkMode ? '#121417' : Colors.PureWhiteText}
              strokeWidth={2.4}
            />
          }
        />
      </StickyActionDock>
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: ResponsivePixels.size16,
  },
});
