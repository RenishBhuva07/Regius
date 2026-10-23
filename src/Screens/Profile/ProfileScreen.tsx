import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  StatusBar,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import {
  ChevronLeft,
  Camera,
  User,
  Mail,
  FileText,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Flame,
  CheckSquare,
  Sparkles,
} from 'lucide-react-native';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Typography } from '../../Theme/Typographys';
import { Fonts } from '../../Theme/fonts';
import { Colors } from '../../Assets/StyleUtilities/Colors';
import ResponsivePixels from '../../Assets/StyleUtilities/ResponsivePixels';
import { SVGS } from '../../Assets/Images';
import { Badge } from '../../Common/Badge';
import { ProBadge } from '../../Common/ProBadge';
import CustomButton from '../../Common/CustomButton';
import { useTheme } from '../../Theme/ThemeContext';
import { useTaskReminder } from '../../Context/TaskReminderContext';

const PROFILE_STORAGE_KEY = '@regius_profile_data';

export const ProfileScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const { isDarkMode } = useTheme();
  const { tasks, habits } = useTaskReminder();

  const [name, setName] = useState('Alex Mercer');
  const [email, setEmail] = useState('alex.mercer@regius.ai');
  const [bio, setBio] = useState('Architect & Product Designer');
  const [role, setRole] = useState('Regius Pro Member');
  const [isSaving, setIsSaving] = useState(false);

  // Focus states for luxury input borders
  const [focusedInput, setFocusedInput] = useState<string | null>(null);

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

  const bgMain = isDarkMode ? '#121417' : Colors.CreamBackground;
  const cardBg = isDarkMode ? '#1E2228' : Colors.DefaultWhite;
  const textPrimary = isDarkMode
    ? Colors.PureWhiteText
    : Colors.MidnightInkText;
  const textSecondary = isDarkMode ? '#A3A8B1' : Colors.SubtitleGray;
  const borderLight = isDarkMode ? '#2C3035' : '#E8E2D5';
  const inputBg = isDarkMode ? '#171A1F' : '#FAF8F5';

  return (
    <View style={[styles.container, { backgroundColor: bgMain }]}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        {...(Platform.OS === 'android' ? { backgroundColor: bgMain } : {})}
      />

      {/* Header */}
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
            Profile & Account
          </Text>
          <Text style={[styles.headerSubtitle, { color: textSecondary }]}>
            Identity & Persona
          </Text>
        </View>

        <ProBadge size="sm" />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: insets.bottom + 40 },
          ]}
          showsVerticalScrollIndicator={false}
        >
          {/* Avatar Hero Bento */}
          <View
            style={[
              styles.avatarCard,
              {
                backgroundColor: cardBg,
                borderColor: isDarkMode
                  ? 'rgba(255, 255, 255, 0.12)'
                  : '#FFFFFF',
                borderBottomColor: isDarkMode ? '#171A20' : '#E2DCD0',
                shadowColor: isDarkMode
                  ? '#000000'
                  : 'rgba(131, 131, 214, 0.14)',
              },
            ]}
          >
            <View style={styles.avatarWrapper}>
              <View
                style={[
                  styles.avatarRing,
                  { borderColor: Colors.LavenderPurple },
                ]}
              >
                <SVGS.RegiusAvatar
                  width={ResponsivePixels.size80}
                  height={ResponsivePixels.size80}
                />
              </View>
              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.cameraBadge}
                onPress={() => {
                  Toast.show({
                    type: 'info',
                    text1: 'Avatar Photo',
                    text2: 'Photo upload available in upcoming cloud release.',
                  });
                }}
                accessibilityRole="button"
                accessibilityLabel="Change avatar image"
              >
                <Camera size={14} color="#FFFFFF" strokeWidth={2.4} />
              </TouchableOpacity>
            </View>

            <Text style={[styles.heroName, { color: textPrimary }]}>
              {name || 'Alex Mercer'}
            </Text>
            <Text style={[styles.heroEmail, { color: textSecondary }]}>
              {email || 'alex.mercer@regius.ai'}
            </Text>

            <View style={styles.roleBadgeRow}>
              <Badge label="VERIFIED PRO" variant="purple" size="sm" />
              <View style={styles.badgeGap} />
              <Badge label="CONCIERGE TIER" variant="yellow" size="sm" />
            </View>
          </View>

          {/* Activity & Stats Bento */}
          <View
            style={[
              styles.statsGridCard,
              {
                backgroundColor: cardBg,
                borderColor: isDarkMode
                  ? 'rgba(255, 255, 255, 0.12)'
                  : '#FFFFFF',
                borderBottomColor: isDarkMode ? '#171A20' : '#E2DCD0',
                shadowColor: isDarkMode
                  ? '#000000'
                  : 'rgba(131, 131, 214, 0.14)',
              },
            ]}
          >
            <View style={styles.statCol}>
              <View
                style={[
                  styles.statIconWrap,
                  { backgroundColor: isDarkMode ? '#2A2416' : '#FFFCEB' },
                ]}
              >
                <CheckSquare size={16} color="#B48216" strokeWidth={2.4} />
              </View>
              <Text style={[styles.statValue, { color: textPrimary }]}>
                {completedTasksCount}
              </Text>
              <Text style={[styles.statLabel, { color: textSecondary }]}>
                Completed Tasks
              </Text>
            </View>

            <View
              style={[styles.statDivider, { backgroundColor: borderLight }]}
            />

            <View style={styles.statCol}>
              <View
                style={[
                  styles.statIconWrap,
                  { backgroundColor: isDarkMode ? '#202336' : '#EFF2FE' },
                ]}
              >
                <Flame
                  size={16}
                  color={Colors.LavenderPurple}
                  strokeWidth={2.4}
                />
              </View>
              <Text style={[styles.statValue, { color: textPrimary }]}>
                {activeHabitsStreak}d
              </Text>
              <Text style={[styles.statLabel, { color: textSecondary }]}>
                Focus Streak
              </Text>
            </View>

            <View
              style={[styles.statDivider, { backgroundColor: borderLight }]}
            />

            <View style={styles.statCol}>
              <View
                style={[
                  styles.statIconWrap,
                  { backgroundColor: isDarkMode ? '#162820' : '#EDFDF5' },
                ]}
              >
                <Calendar size={16} color="#1B9A72" strokeWidth={2.4} />
              </View>
              <Text style={[styles.statValue, { color: textPrimary }]}>
                2026
              </Text>
              <Text style={[styles.statLabel, { color: textSecondary }]}>
                Member Since
              </Text>
            </View>
          </View>

          {/* Form Fields Section */}
          <Text style={[styles.sectionHeading, { color: textSecondary }]}>
            PERSONAL CREDENTIALS
          </Text>

          <View
            style={[
              styles.formCard,
              {
                backgroundColor: cardBg,
                borderColor: isDarkMode
                  ? 'rgba(255, 255, 255, 0.12)'
                  : '#FFFFFF',
                borderBottomColor: isDarkMode ? '#171A20' : '#E2DCD0',
                shadowColor: isDarkMode
                  ? '#000000'
                  : 'rgba(131, 131, 214, 0.14)',
              },
            ]}
          >
            {/* Full Name Field */}
            <View style={styles.inputGroup}>
              <View style={styles.inputLabelRow}>
                <User
                  size={15}
                  color={Colors.LavenderPurple}
                  strokeWidth={2.2}
                />
                <Text style={[styles.inputLabel, { color: textPrimary }]}>
                  Full Name
                </Text>
              </View>
              <View
                style={[
                  styles.inputWrap,
                  {
                    backgroundColor: inputBg,
                    borderColor:
                      focusedInput === 'name'
                        ? Colors.LavenderPurple
                        : borderLight,
                  },
                ]}
              >
                <TextInput
                  style={[styles.input, { color: textPrimary }]}
                  value={name}
                  onChangeText={setName}
                  placeholder="Your full name"
                  placeholderTextColor={textSecondary}
                  onFocus={() => setFocusedInput('name')}
                  onBlur={() => setFocusedInput(null)}
                />
              </View>
            </View>

            <View
              style={[styles.fieldDivider, { backgroundColor: borderLight }]}
            />

            {/* Email Address Field */}
            <View style={styles.inputGroup}>
              <View style={styles.inputLabelRow}>
                <Mail
                  size={15}
                  color={Colors.LavenderPurple}
                  strokeWidth={2.2}
                />
                <Text style={[styles.inputLabel, { color: textPrimary }]}>
                  Email Address
                </Text>
              </View>
              <View
                style={[
                  styles.inputWrap,
                  {
                    backgroundColor: inputBg,
                    borderColor:
                      focusedInput === 'email'
                        ? Colors.LavenderPurple
                        : borderLight,
                  },
                ]}
              >
                <TextInput
                  style={[styles.input, { color: textPrimary }]}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="alex@domain.com"
                  placeholderTextColor={textSecondary}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  onFocus={() => setFocusedInput('email')}
                  onBlur={() => setFocusedInput(null)}
                />
              </View>
            </View>

            <View
              style={[styles.fieldDivider, { backgroundColor: borderLight }]}
            />

            {/* Bio Field */}
            <View style={styles.inputGroup}>
              <View style={styles.inputLabelRow}>
                <FileText
                  size={15}
                  color={Colors.LavenderPurple}
                  strokeWidth={2.2}
                />
                <Text style={[styles.inputLabel, { color: textPrimary }]}>
                  Professional Bio
                </Text>
              </View>
              <View
                style={[
                  styles.inputWrap,
                  styles.textAreaWrap,
                  {
                    backgroundColor: inputBg,
                    borderColor:
                      focusedInput === 'bio'
                        ? Colors.LavenderPurple
                        : borderLight,
                  },
                ]}
              >
                <TextInput
                  style={[
                    styles.input,
                    styles.textArea,
                    { color: textPrimary },
                  ]}
                  value={bio}
                  onChangeText={setBio}
                  placeholder="Architect & Product Designer"
                  placeholderTextColor={textSecondary}
                  multiline
                  numberOfLines={3}
                  onFocus={() => setFocusedInput('bio')}
                  onBlur={() => setFocusedInput(null)}
                />
              </View>
            </View>

            <View
              style={[styles.fieldDivider, { backgroundColor: borderLight }]}
            />

            {/* Role Title */}
            <View style={styles.inputGroup}>
              <View style={styles.inputLabelRow}>
                <ShieldCheck
                  size={15}
                  color={Colors.LavenderPurple}
                  strokeWidth={2.2}
                />
                <Text style={[styles.inputLabel, { color: textPrimary }]}>
                  Membership Designation
                </Text>
              </View>
              <View
                style={[
                  styles.inputWrap,
                  {
                    backgroundColor: inputBg,
                    borderColor:
                      focusedInput === 'role'
                        ? Colors.LavenderPurple
                        : borderLight,
                  },
                ]}
              >
                <TextInput
                  style={[styles.input, { color: textPrimary }]}
                  value={role}
                  onChangeText={setRole}
                  placeholder="Regius Pro Member"
                  placeholderTextColor={textSecondary}
                  onFocus={() => setFocusedInput('role')}
                  onBlur={() => setFocusedInput(null)}
                />
              </View>
            </View>
          </View>

          {/* Action Button */}
          <View style={styles.buttonContainer}>
            <CustomButton
              title={isSaving ? 'Saving Changes...' : 'Save Profile Changes'}
              onPress={handleSave}
              disabled={isSaving}
              variant="dark"
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default ProfileScreen;

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
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: ResponsivePixels.size16,
    paddingTop: ResponsivePixels.size16,
  },
  avatarCard: {
    borderRadius: 20,
    borderWidth: 1,
    borderBottomWidth: 3,
    paddingVertical: ResponsivePixels.size24,
    paddingHorizontal: ResponsivePixels.size16,
    alignItems: 'center',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 3,
    marginBottom: ResponsivePixels.size16,
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: ResponsivePixels.size12,
  },
  avatarRing: {
    width: ResponsivePixels.size90,
    height: ResponsivePixels.size90,
    borderRadius: ResponsivePixels.size45,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FAF8F5',
  },
  cameraBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: Colors.LavenderPurple,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  heroName: {
    fontFamily: Fonts.ranade.bold,
    fontSize: 20,
    marginBottom: 4,
  },
  heroEmail: {
    ...Typography.bodySmallPoppinsRegular,
    fontSize: 13,
    marginBottom: ResponsivePixels.size12,
  },
  roleBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badgeGap: {
    width: 8,
  },
  statsGridCard: {
    flexDirection: 'row',
    borderRadius: 18,
    borderWidth: 1,
    borderBottomWidth: 3,
    paddingVertical: ResponsivePixels.size16,
    paddingHorizontal: ResponsivePixels.size12,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 2,
    marginBottom: ResponsivePixels.size20,
  },
  statCol: {
    flex: 1,
    alignItems: 'center',
  },
  statIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  statValue: {
    fontFamily: Fonts.poppins.bold,
    fontSize: 16,
    marginBottom: 2,
  },
  statLabel: {
    ...Typography.bodySuperSmallPoppinsRegularLoose,
    fontSize: 10,
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    height: '70%',
    alignSelf: 'center',
  },
  sectionHeading: {
    ...Typography.bodySuperSmallPoppinsRegularLoose,
    fontFamily: Fonts.poppins.semiBold,
    fontSize: 11,
    letterSpacing: 1,
    marginBottom: ResponsivePixels.size8,
    marginLeft: 4,
  },
  formCard: {
    borderRadius: 20,
    borderWidth: 1,
    borderBottomWidth: 3,
    padding: ResponsivePixels.size16,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 3,
    marginBottom: ResponsivePixels.size20,
  },
  inputGroup: {
    paddingVertical: ResponsivePixels.size6,
  },
  inputLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: ResponsivePixels.size6,
    gap: 6,
  },
  inputLabel: {
    fontFamily: Fonts.poppins.medium,
    fontSize: 13,
  },
  inputWrap: {
    borderRadius: 12,
    borderWidth: 1.5,
    paddingHorizontal: ResponsivePixels.size12,
    height: 46,
    justifyContent: 'center',
  },
  textAreaWrap: {
    height: 80,
    paddingTop: ResponsivePixels.size8,
  },
  input: {
    fontFamily: Fonts.poppins.regular,
    fontSize: 14,
    padding: 0,
  },
  textArea: {
    textAlignVertical: 'top',
    height: '100%',
  },
  fieldDivider: {
    height: 1,
    marginVertical: ResponsivePixels.size10,
  },
  buttonContainer: {
    marginTop: ResponsivePixels.size8,
  },
});
