import React, { useState, useEffect, useRef } from 'react';
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
  Animated,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
  ActivityIndicator,
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
  Calendar,
  Flame,
  CheckSquare,
  Sparkles,
  Check,
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
import { useTheme } from '../../Theme/ThemeContext';
import { useTaskReminder } from '../../Context/TaskReminderContext';
import { SettingsBackgroundSvg } from '../Settings/Components/SettingsBackgroundSvg';
import { HeaderPatternSvg } from '../Dashboard/Components/HeaderPatternSvg';

const { width: screenWidth } = Dimensions.get('window');
const HEADER_HEIGHT = 52;
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

  const [focusedInput, setFocusedInput] = useState<string | null>(null);
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
              Profile & Account
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
              Identity & Persona
            </Text>
          </View>

          <ProBadge size="sm" />
        </View>
      </Animated.View>

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
          {/* Avatar Hero Bento (Signature 2-Layer Obsidian Bento with 4px Ceramic Rim) */}
          <View style={styles.heroOuterWrapper}>
            <View style={styles.cardShadowWrapper}>
              <View style={styles.card}>
                <HeaderPatternSvg width={screenWidth} insetsTop={insets.top} />

                <View style={styles.heroContent}>
                  {/* Aura Status Pill */}
                  <View style={styles.heroStatusRow}>
                    <View style={styles.heroStatusLeft}>
                      <Sparkles size={14} color="#F5C518" strokeWidth={2.4} />
                      <Text style={styles.heroStatusLabel}>
                        SOVEREIGN IDENTITY
                      </Text>
                    </View>
                    <Badge label="TIER 5 VERIFIED" variant="yellow" size="sm" />
                  </View>

                  {/* Avatar Centerpiece with Solar Halo */}
                  <View style={styles.avatarWrapper}>
                    <View style={styles.avatarGlowHalo}>
                      <View style={styles.avatarRing}>
                        <SVGS.RegiusAvatar
                          width={ResponsivePixels.size80}
                          height={ResponsivePixels.size80}
                        />
                      </View>
                    </View>
                    <TouchableOpacity
                      activeOpacity={0.8}
                      style={styles.cameraBadge}
                      onPress={() => {
                        Toast.show({
                          type: 'info',
                          text1: 'Avatar Photo',
                          text2:
                            'Photo upload available in upcoming cloud release.',
                        });
                      }}
                      accessibilityRole="button"
                      accessibilityLabel="Change avatar image"
                    >
                      <Camera size={14} color="#FFFFFF" strokeWidth={2.4} />
                    </TouchableOpacity>
                  </View>

                  {/* Identity Readout */}
                  <Text style={styles.heroName}>{name || 'Alex Mercer'}</Text>
                  <Text style={styles.heroEmail}>
                    {email || 'alex.mercer@regius.ai'}
                  </Text>

                  {/* Role Badges */}
                  <View style={styles.roleBadgeRow}>
                    <Badge label="VERIFIED PRO" variant="purple" size="sm" />
                    <View style={styles.badgeGap} />
                    <Badge label="CONCIERGE TIER" variant="yellow" size="sm" />
                  </View>
                </View>
              </View>
            </View>
          </View>

          {/* Activity & Discipline Matrix Bento */}
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
        </Animated.ScrollView>
      </KeyboardAvoidingView>

      {/* Floating Action Dock */}
      <View
        style={[
          styles.floatingActionDock,
          {
            paddingBottom: Math.max(insets.bottom, 16),
            backgroundColor: isDarkMode
              ? 'rgba(18, 20, 23, 0.94)'
              : 'rgba(255, 252, 227, 0.95)',
            borderTopColor: borderLight,
          },
        ]}
      >
        <TouchableOpacity
          activeOpacity={0.88}
          style={[
            styles.saveButton,
            {
              backgroundColor: isDarkMode
                ? Colors.LavenderPurple
                : Colors.MidnightCharcoal,
              shadowColor: isDarkMode ? Colors.LavenderPurple : '#000000',
            },
            isSaving && { opacity: 0.8 },
          ]}
          onPress={handleSave}
          disabled={isSaving}
          accessibilityRole="button"
          accessibilityLabel="Save Profile Changes"
        >
          {isSaving ? (
            <ActivityIndicator
              size="small"
              color={isDarkMode ? '#121417' : Colors.PureWhiteText}
            />
          ) : (
            <View style={styles.buttonContentRow}>
              <Check
                size={18}
                color={isDarkMode ? '#121417' : Colors.PureWhiteText}
                strokeWidth={2.4}
              />
              <Text
                style={[
                  styles.saveButtonText,
                  { color: isDarkMode ? '#121417' : Colors.PureWhiteText },
                ]}
              >
                Save Profile Changes
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ProfileScreen;

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
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: ResponsivePixels.size16,
  },
  heroOuterWrapper: {
    paddingHorizontal: 10,
    marginBottom: ResponsivePixels.size20,
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
    marginBottom: ResponsivePixels.size14,
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
  avatarWrapper: {
    position: 'relative',
    marginBottom: ResponsivePixels.size12,
  },
  avatarGlowHalo: {
    padding: 3,
    borderRadius: 50,
    backgroundColor: 'rgba(245, 197, 24, 0.25)',
  },
  avatarRing: {
    width: ResponsivePixels.size90,
    height: ResponsivePixels.size90,
    borderRadius: ResponsivePixels.size45,
    borderWidth: 3,
    borderColor: '#F5C518',
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
    elevation: 4,
  },
  heroName: {
    fontFamily: Fonts.ranade.bold,
    fontSize: 22,
    color: '#FFFCE3',
    marginBottom: 4,
  },
  heroEmail: {
    ...Typography.bodySmallPoppinsRegular,
    color: 'rgba(255, 255, 255, 0.7)',
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
    marginHorizontal: ResponsivePixels.size16,
    borderRadius: 20,
    borderWidth: 1.5,
    borderBottomWidth: 3.5,
    paddingVertical: ResponsivePixels.size16,
    paddingHorizontal: ResponsivePixels.size12,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 2,
    marginBottom: ResponsivePixels.size24,
  },
  statCol: {
    flex: 1,
    alignItems: 'center',
  },
  statIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  statValue: {
    fontFamily: Fonts.ranade.bold,
    fontSize: 18,
    marginBottom: 2,
  },
  statLabel: {
    ...Typography.bodySuperSmallPoppinsRegularLoose,
    fontSize: 11,
  },
  statDivider: {
    width: 1,
    height: '75%',
    alignSelf: 'center',
  },
  sectionHeading: {
    ...Typography.bodySuperSmallPoppinsRegularLoose,
    fontFamily: Fonts.poppins.semiBold,
    fontSize: 11,
    letterSpacing: 1.1,
    marginHorizontal: ResponsivePixels.size16,
    marginBottom: ResponsivePixels.size8,
  },
  formCard: {
    marginHorizontal: ResponsivePixels.size16,
    borderRadius: 22,
    borderWidth: 1.5,
    borderBottomWidth: 3.5,
    padding: ResponsivePixels.size16,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 3,
    marginBottom: ResponsivePixels.size24,
  },
  inputGroup: {
    marginVertical: 4,
  },
  inputLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  inputLabel: {
    fontFamily: Fonts.poppins.medium,
    fontSize: 13,
  },
  inputWrap: {
    borderRadius: 14,
    borderWidth: 1.5,
    paddingHorizontal: 14,
    height: 48,
    justifyContent: 'center',
  },
  textAreaWrap: {
    height: 80,
    paddingVertical: 10,
  },
  input: {
    fontFamily: Fonts.poppins.regular,
    fontSize: 14,
    padding: 0,
  },
  textArea: {
    height: 60,
    textAlignVertical: 'top',
  },
  fieldDivider: {
    height: StyleSheet.hairlineWidth,
    marginVertical: 12,
  },
  floatingActionDock: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 1,
    paddingTop: 12,
    paddingHorizontal: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 10,
    zIndex: 20,
  },
  saveButton: {
    borderRadius: 28,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonContentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  saveButtonText: {
    fontFamily: Fonts.poppins.bold,
    fontSize: 15,
    letterSpacing: 0.2,
  },
});
