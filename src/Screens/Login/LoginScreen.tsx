import React, { useState, useRef, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Animated,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Colors } from '../../Assets/StyleUtilities/Colors';
import ResponsivePixels from '../../Assets/StyleUtilities/ResponsivePixels';
import { Typography } from '../../Theme/Typographys';
import { Fonts } from '../../Theme/fonts';
import { useTheme } from '../../Theme/ThemeContext';
import { AuthContext } from '../../Context/AuthContext';
import { Badge } from '../../Common/Badge';
import { ToastHelper } from '../../Common/ToastHelper';
import {
  RegiusCrownCrestSvg,
  MailFieldSvg,
  LockFieldSvg,
  UserFieldSvg,
  EyeOpenSvg,
  EyeClosedSvg,
  TactileCheckmarkSvg,
  GoogleLogoSvg,
  AppleLogoSvg,
  SparkleSvg,
} from './Components/LoginSvgs';
import { LoginAestheticBackgroundSvg } from './Components/LoginAestheticBackgroundSvg';
import { ForgotPasswordModal } from './Components/ForgotPasswordModal';
import { TermsPrivacyModal } from './Components/TermsPrivacyModal';

type AuthMode = 'signin' | 'signup';

export const LoginScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { isDarkMode } = useTheme();
  const { setAuthState } = useContext(AuthContext);

  // Form State
  const [authMode, setAuthMode] = useState<AuthMode>('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Modals
  const [forgotModalVisible, setForgotModalVisible] = useState(false);
  const [termsModalVisible, setTermsModalVisible] = useState(false);
  const [termsModalTab, setTermsModalTab] = useState<'terms' | 'privacy'>(
    'terms',
  );

  // Field Focus States
  const [focusedField, setFocusedField] = useState<string | null>(null);

  // Segmented Switcher Dimensions & Animation
  const [switcherWidth, setSwitcherWidth] = useState(0);
  const modeSwitchAnim = useRef(new Animated.Value(0)).current; // 0: signin, 1: signup

  const switchMode = (mode: AuthMode) => {
    setAuthMode(mode);
    Animated.spring(modeSwitchAnim, {
      toValue: mode === 'signin' ? 0 : 1,
      tension: 65,
      friction: 8,
      useNativeDriver: true,
    }).start();
  };

  // Open Terms / Privacy Modal
  const handleOpenTerms = (tab: 'terms' | 'privacy') => {
    setTermsModalTab(tab);
    setTermsModalVisible(true);
  };

  // Color Tokens based on Theme
  const bgCanvas = isDarkMode ? '#121417' : Colors.CreamBackground;
  const surfaceCardBg = isDarkMode ? '#1E2228' : Colors.DefaultWhite;
  const textPrimary = isDarkMode
    ? Colors.PureWhiteText
    : Colors.MidnightInkText;
  const textSecondary = isDarkMode ? '#A3A8B1' : Colors.SubtitleGray;
  const borderLight = isDarkMode ? '#2C3035' : Colors.RingBorder;
  const inputBg = isDarkMode ? '#171A1F' : '#FAF8F5';
  const ctaBg = isDarkMode ? Colors.PureWhiteText : Colors.MidnightCharcoal;
  const ctaTextColor = isDarkMode
    ? Colors.MidnightInkText
    : Colors.PureWhiteText;

  // Tab indicator slide calculation
  const tabWidth = switcherWidth > 0 ? (switcherWidth - 8) / 2 : 0;
  const indicatorTranslateX = modeSwitchAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, tabWidth],
  });

  // Validation & Submit
  const handleAuthSubmit = () => {
    const trimmedEmail = email.trim();
    const trimmedPass = password.trim();

    if (trimmedEmail) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(trimmedEmail)) {
        ToastHelper.error(
          'Please enter a valid email address',
          'Invalid Email',
        );
        return;
      }
    }

    if (authMode === 'signup' && agreeTerms === false && name.trim()) {
      ToastHelper.info(
        'Please agree to the Terms & Privacy Policy to continue',
        'Terms Required',
      );
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      const fallbackName = authMode === 'signup' ? 'Alex Mercer' : 'Member';
      const userName =
        authMode === 'signup'
          ? name.trim() || fallbackName
          : trimmedEmail
          ? trimmedEmail.split('@')[0]
          : fallbackName;

      setAuthState(
        {
          id: `usr_${Date.now()}`,
          email: trimmedEmail || 'member@regius.ai',
          name: userName,
          avatarUrl: null,
          emailVerified: true,
          profileCompleted: true,
        },
        false,
      );

      ToastHelper.success(
        authMode === 'signin'
          ? `Welcome back, ${userName}!`
          : `Account created! Welcome, ${userName}!`,
        'Access Granted',
      );

      navigation.replace('MainTabs', {
        screen: 'Dashboard',
        params: { justLoggedIn: true },
      });
    }, 950);
  };

  const handleSocialAuth = (provider: 'Google' | 'Apple') => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setAuthState(
        {
          id: `usr_${provider.toLowerCase()}_${Date.now()}`,
          email: `member@${provider.toLowerCase()}.com`,
          name: `${provider} User`,
          avatarUrl: null,
          emailVerified: true,
          profileCompleted: true,
        },
        false,
      );
      ToastHelper.success(`Signed in with ${provider}`, 'Welcome to Regius');
      navigation.replace('MainTabs', {
        screen: 'Dashboard',
        params: { justLoggedIn: true },
      });
    }, 850);
  };

  const handleGuestAccess = () => {
    ToastHelper.info('Continuing as guest with local storage', 'Guest Access');
    navigation.replace('MainTabs', {
      screen: 'Dashboard',
      params: { justLoggedIn: true },
    });
  };

  return (
    <View style={[styles.root, { backgroundColor: bgCanvas }]}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        {...(Platform.OS === 'android'
          ? { backgroundColor: 'transparent', translucent: true }
          : {})}
      />

      {/* Signature Artisanal Aesthetic Background Canvas */}
      <View style={styles.backgroundSvgWrapper} pointerEvents="none">
        <LoginAestheticBackgroundSvg isDark={isDarkMode} />
      </View>

      <KeyboardAvoidingView
        style={styles.keyboardAvoid}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header & Crest Section */}
          <View style={styles.headerSection}>
            <View style={styles.crestShadowWrapper}>
              <View style={styles.crestWrapper}>
                <RegiusCrownCrestSvg />
                <View style={styles.crestSparkle}>
                  <SparkleSvg size={16} color={Colors.AccentYellow} />
                </View>
              </View>
            </View>

            <View style={styles.badgeWrapper}>
              <Badge
                variant={authMode === 'signin' ? 'purple' : 'yellow'}
                label={
                  authMode === 'signin' ? 'WELCOME BACK' : 'JOIN THE REALM'
                }
                size="sm"
              />
            </View>

            <Text style={[styles.brandTitle, { color: textPrimary }]}>
              {authMode === 'signin'
                ? 'Sign In to Regius'
                : 'Create an Account'}
            </Text>
            <Text style={[styles.brandSubtitle, { color: textSecondary }]}>
              {authMode === 'signin'
                ? 'Plan your day in details with mindful luxury'
                : 'Experience artisanal productivity and smart workflows'}
            </Text>
          </View>

          {/* Minimalist Tactile Segmented Switcher Pill */}
          <View
            style={[
              styles.switchContainer,
              {
                backgroundColor: isDarkMode ? '#1E2228' : '#FAF5E4',
                borderColor: borderLight,
                borderBottomColor: isDarkMode ? '#15181C' : '#DFD9CB',
              },
            ]}
            onLayout={e => setSwitcherWidth(e.nativeEvent.layout.width)}
          >
            {/* Sliding Indicator Pill */}
            {tabWidth > 0 && (
              <Animated.View
                style={[
                  styles.switchIndicator,
                  {
                    width: tabWidth,
                    transform: [{ translateX: indicatorTranslateX }],
                    backgroundColor: surfaceCardBg,
                    borderTopColor: isDarkMode
                      ? 'rgba(255,255,255,0.1)'
                      : '#FFFFFF',
                    borderBottomColor: isDarkMode ? '#171A1F' : '#E8E2D5',
                  },
                ]}
              />
            )}

            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.switchTab}
              onPress={() => switchMode('signin')}
            >
              <Text
                style={[
                  styles.switchTabText,
                  {
                    color: authMode === 'signin' ? textPrimary : textSecondary,
                    fontFamily:
                      authMode === 'signin'
                        ? Fonts.poppins.semiBold
                        : Fonts.poppins.medium,
                  },
                ]}
              >
                Sign In
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.switchTab}
              onPress={() => switchMode('signup')}
            >
              <Text
                style={[
                  styles.switchTabText,
                  {
                    color: authMode === 'signup' ? textPrimary : textSecondary,
                    fontFamily:
                      authMode === 'signup'
                        ? Fonts.poppins.semiBold
                        : Fonts.poppins.medium,
                  },
                ]}
              >
                Create Account
              </Text>
            </TouchableOpacity>
          </View>

          {/* 3D Volumetric Form Card Shadow Wrapper */}
          <View style={styles.formCardShadowWrapper}>
            <View
              style={[
                styles.formCard,
                {
                  backgroundColor: surfaceCardBg,
                  borderColor: borderLight,
                  borderTopColor: isDarkMode
                    ? 'rgba(255, 255, 255, 0.12)'
                    : '#FFFFFF',
                  borderBottomColor: isDarkMode ? '#16191F' : '#E2DCD0',
                },
              ]}
            >
              {/* Full Name Field (Sign Up Only) */}
              {authMode === 'signup' && (
                <View style={styles.fieldGroup}>
                  <Text style={[styles.fieldLabel, { color: textPrimary }]}>
                    Full Name
                  </Text>
                  <View
                    style={[
                      styles.inputWrapper,
                      {
                        backgroundColor: inputBg,
                        borderColor:
                          focusedField === 'name'
                            ? Colors.LavenderPurple
                            : borderLight,
                        borderWidth: focusedField === 'name' ? 1.8 : 1.2,
                        borderBottomColor:
                          focusedField === 'name'
                            ? Colors.LavenderPurple
                            : isDarkMode
                            ? '#20242B'
                            : '#EAE4D7',
                      },
                      focusedField === 'name' && styles.inputWrapperFocused,
                    ]}
                  >
                    <View style={styles.fieldIcon}>
                      <UserFieldSvg
                        color={
                          focusedField === 'name'
                            ? Colors.LavenderPurple
                            : textSecondary
                        }
                      />
                    </View>
                    <TextInput
                      style={[styles.input, { color: textPrimary }]}
                      placeholder="Alex Mercer"
                      placeholderTextColor={textSecondary}
                      value={name}
                      onChangeText={setName}
                      onFocus={() => setFocusedField('name')}
                      onBlur={() => setFocusedField(null)}
                      autoCapitalize="words"
                      autoCorrect={false}
                    />
                  </View>
                </View>
              )}

              {/* Email Field */}
              <View style={styles.fieldGroup}>
                <Text style={[styles.fieldLabel, { color: textPrimary }]}>
                  Email Address
                </Text>
                <View
                  style={[
                    styles.inputWrapper,
                    {
                      backgroundColor: inputBg,
                      borderColor:
                        focusedField === 'email'
                          ? Colors.LavenderPurple
                          : borderLight,
                      borderWidth: focusedField === 'email' ? 1.8 : 1.2,
                      borderBottomColor:
                        focusedField === 'email'
                          ? Colors.LavenderPurple
                          : isDarkMode
                          ? '#20242B'
                          : '#EAE4D7',
                    },
                    focusedField === 'email' && styles.inputWrapperFocused,
                  ]}
                >
                  <View style={styles.fieldIcon}>
                    <MailFieldSvg
                      color={
                        focusedField === 'email'
                          ? Colors.LavenderPurple
                          : textSecondary
                      }
                    />
                  </View>
                  <TextInput
                    style={[styles.input, { color: textPrimary }]}
                    placeholder="name@regius.ai"
                    placeholderTextColor={textSecondary}
                    value={email}
                    onChangeText={setEmail}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>
              </View>

              {/* Password Field */}
              <View style={styles.fieldGroup}>
                <View style={styles.passwordLabelRow}>
                  <Text style={[styles.fieldLabel, { color: textPrimary }]}>
                    Password
                  </Text>
                  {authMode === 'signin' && (
                    <TouchableOpacity
                      activeOpacity={0.7}
                      onPress={() => setForgotModalVisible(true)}
                    >
                      <Text style={styles.forgotPasswordText}>Forgot?</Text>
                    </TouchableOpacity>
                  )}
                </View>

                <View
                  style={[
                    styles.inputWrapper,
                    {
                      backgroundColor: inputBg,
                      borderColor:
                        focusedField === 'password'
                          ? Colors.LavenderPurple
                          : borderLight,
                      borderWidth: focusedField === 'password' ? 1.8 : 1.2,
                      borderBottomColor:
                        focusedField === 'password'
                          ? Colors.LavenderPurple
                          : isDarkMode
                          ? '#20242B'
                          : '#EAE4D7',
                    },
                    focusedField === 'password' && styles.inputWrapperFocused,
                  ]}
                >
                  <View style={styles.fieldIcon}>
                    <LockFieldSvg
                      color={
                        focusedField === 'password'
                          ? Colors.LavenderPurple
                          : textSecondary
                      }
                    />
                  </View>
                  <TextInput
                    style={[styles.input, { color: textPrimary }]}
                    placeholder="••••••••"
                    placeholderTextColor={textSecondary}
                    value={password}
                    onChangeText={setPassword}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField(null)}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                  />
                  <TouchableOpacity
                    activeOpacity={0.7}
                    style={styles.eyeBtn}
                    onPress={() => setShowPassword(prev => !prev)}
                  >
                    {showPassword ? (
                      <EyeOpenSvg color={textSecondary} />
                    ) : (
                      <EyeClosedSvg color={textSecondary} />
                    )}
                  </TouchableOpacity>
                </View>
              </View>

              {/* Signature Tactile Checkbox Row */}
              {authMode === 'signin' ? (
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={styles.checkboxRow}
                  onPress={() => setRememberMe(prev => !prev)}
                >
                  <View
                    style={[
                      styles.tactileCheckbox,
                      rememberMe
                        ? styles.checkboxChecked
                        : [
                            styles.checkboxUnchecked,
                            { borderColor: borderLight },
                          ],
                    ]}
                  >
                    {rememberMe && (
                      <TactileCheckmarkSvg color={Colors.AccentGreen} />
                    )}
                  </View>
                  <Text
                    style={[styles.checkboxLabel, { color: textSecondary }]}
                  >
                    Remember this device for 30 days
                  </Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={styles.checkboxRow}
                  onPress={() => setAgreeTerms(prev => !prev)}
                >
                  <View
                    style={[
                      styles.tactileCheckbox,
                      agreeTerms
                        ? styles.checkboxChecked
                        : [
                            styles.checkboxUnchecked,
                            { borderColor: borderLight },
                          ],
                    ]}
                  >
                    {agreeTerms && (
                      <TactileCheckmarkSvg color={Colors.AccentGreen} />
                    )}
                  </View>
                  <Text
                    style={[styles.checkboxLabel, { color: textSecondary }]}
                  >
                    I agree to the{' '}
                    <Text
                      style={styles.linkText}
                      onPress={() => handleOpenTerms('terms')}
                    >
                      Terms
                    </Text>{' '}
                    &{' '}
                    <Text
                      style={styles.linkText}
                      onPress={() => handleOpenTerms('privacy')}
                    >
                      Privacy Policy
                    </Text>
                  </Text>
                </TouchableOpacity>
              )}

              {/* Primary Action Button (3D Extruded Pill Architecture) */}
              <TouchableOpacity
                activeOpacity={0.85}
                style={[styles.primaryCta, { backgroundColor: ctaBg }]}
                onPress={handleAuthSubmit}
                disabled={isLoading}
                accessibilityRole="button"
                accessibilityLabel="Primary auth submit"
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color={ctaTextColor} />
                ) : (
                  <View style={styles.ctaContent}>
                    <Text
                      style={[styles.primaryCtaText, { color: ctaTextColor }]}
                    >
                      {authMode === 'signin' ? 'Sign In' : 'Create Account'}
                    </Text>
                    <View style={styles.ctaSparkle}>
                      <SparkleSvg
                        size={15}
                        color={
                          isDarkMode
                            ? Colors.MidnightCharcoal
                            : Colors.AccentYellow
                        }
                      />
                    </View>
                  </View>
                )}
              </TouchableOpacity>

              {/* Divider */}
              <View style={styles.dividerRow}>
                <View
                  style={[styles.dividerLine, { backgroundColor: borderLight }]}
                />
                <Text style={[styles.dividerText, { color: textSecondary }]}>
                  OR CONTINUE WITH
                </Text>
                <View
                  style={[styles.dividerLine, { backgroundColor: borderLight }]}
                />
              </View>

              {/* Social Logins */}
              <View style={styles.socialRow}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={[
                    styles.socialBtn,
                    {
                      backgroundColor: isDarkMode ? '#242830' : '#FAF8F5',
                      borderColor: borderLight,
                    },
                  ]}
                  onPress={() => handleSocialAuth('Google')}
                >
                  <GoogleLogoSvg size={20} />
                  <Text style={[styles.socialBtnText, { color: textPrimary }]}>
                    Google
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.8}
                  style={[
                    styles.socialBtn,
                    {
                      backgroundColor: isDarkMode ? '#242830' : '#1F2228',
                      borderColor: isDarkMode ? borderLight : '#1F2228',
                    },
                  ]}
                  onPress={() => handleSocialAuth('Apple')}
                >
                  <AppleLogoSvg size={20} color={Colors.PureWhiteText} />
                  <Text
                    style={[
                      styles.socialBtnText,
                      { color: Colors.PureWhiteText },
                    ]}
                  >
                    Apple
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Guest Access Link */}
          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.guestLinkTouch}
            onPress={handleGuestAccess}
          >
            <Text style={[styles.guestLinkText, { color: textSecondary }]}>
              Continue as Guest{' '}
              <Text style={{ color: Colors.LavenderPurple }}>→</Text>
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Forgot Password Modal */}
      <ForgotPasswordModal
        visible={forgotModalVisible}
        onClose={() => setForgotModalVisible(false)}
        isDarkMode={isDarkMode}
      />

      {/* Terms & Privacy Covenant Modal */}
      <TermsPrivacyModal
        visible={termsModalVisible}
        initialTab={termsModalTab}
        onClose={() => setTermsModalVisible(false)}
        isDarkMode={isDarkMode}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    position: 'relative',
  },
  backgroundSvgWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
  keyboardAvoid: {
    flex: 1,
    zIndex: 2,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: ResponsivePixels.size24,
    paddingTop:
      Platform.OS === 'ios' ? ResponsivePixels.size50 : ResponsivePixels.size40,
    paddingBottom: ResponsivePixels.size40,
    alignItems: 'center',
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: ResponsivePixels.size20,
  },
  crestShadowWrapper: {
    shadowColor: Colors.LavenderPurple,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.28,
    shadowRadius: 16,
    elevation: 8,
  },
  crestWrapper: {
    position: 'relative',
    marginBottom: ResponsivePixels.size12,
  },
  crestSparkle: {
    position: 'absolute',
    top: -2,
    right: -2,
  },
  badgeWrapper: {
    marginBottom: ResponsivePixels.size12,
  },
  brandTitle: {
    ...Typography.h1RanadeBold,
    fontSize: 26,
    lineHeight: 32,
    textAlign: 'center',
    letterSpacing: -0.3,
    marginBottom: ResponsivePixels.size6,
  },
  brandSubtitle: {
    ...Typography.bodySmallPoppinsRegular,
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
    maxWidth: 290,
  },
  switchContainer: {
    flexDirection: 'row',
    position: 'relative',
    width: '100%',
    height: 50,
    borderRadius: ResponsivePixels.size26,
    borderWidth: 1.5,
    borderBottomWidth: 3,
    padding: 4,
    marginBottom: ResponsivePixels.size18,
  },
  switchIndicator: {
    position: 'absolute',
    top: 4,
    left: 4,
    bottom: 4,
    borderRadius: ResponsivePixels.size22,
    borderTopWidth: 1,
    borderBottomWidth: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
  },
  switchTab: {
    flex: 1,
    borderRadius: ResponsivePixels.size22,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  switchTabText: {
    fontSize: 13,
    letterSpacing: 0.2,
  },
  formCardShadowWrapper: {
    width: '100%',
    borderRadius: ResponsivePixels.size28,
    shadowColor: '#121417',
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.1,
    shadowRadius: 24,
    elevation: 8,
  },
  formCard: {
    width: '100%',
    borderRadius: ResponsivePixels.size28,
    borderWidth: 1.5,
    borderTopWidth: 1.5,
    borderBottomWidth: 4,
    paddingHorizontal: ResponsivePixels.size20,
    paddingVertical: ResponsivePixels.size24,
  },
  fieldGroup: {
    marginBottom: ResponsivePixels.size16,
  },
  fieldLabel: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: 13,
    marginBottom: ResponsivePixels.size6,
    letterSpacing: 0.1,
  },
  passwordLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  forgotPasswordText: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: 12.5,
    color: Colors.LavenderPurple,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 52,
    borderRadius: ResponsivePixels.size18,
    paddingHorizontal: ResponsivePixels.size14,
    borderBottomWidth: 2.2,
  },
  inputWrapperFocused: {
    shadowColor: Colors.LavenderPurple,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.22,
    shadowRadius: 8,
    elevation: 3,
  },
  fieldIcon: {
    marginRight: ResponsivePixels.size10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    flex: 1,
    fontFamily: Fonts.poppins.medium,
    fontSize: 14,
    paddingVertical: 0,
  },
  eyeBtn: {
    padding: 6,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: ResponsivePixels.size22,
    marginTop: ResponsivePixels.size4,
  },
  tactileCheckbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: ResponsivePixels.size10,
    borderWidth: 1.5,
  },
  checkboxUnchecked: {
    backgroundColor: '#EFF1F4',
  },
  checkboxChecked: {
    backgroundColor: '#E8FDF0',
    borderColor: '#C6FFDD',
    borderBottomColor: '#82E8A6',
    borderBottomWidth: 2.2,
    shadowColor: Colors.AccentGreen,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 5,
    elevation: 3,
  },
  checkboxLabel: {
    fontFamily: Fonts.poppins.regular,
    fontSize: 12.5,
    flex: 1,
  },
  linkText: {
    fontFamily: Fonts.poppins.semiBold,
    color: Colors.LavenderPurple,
  },
  primaryCta: {
    width: '100%',
    height: 52,
    borderRadius: ResponsivePixels.size26,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopWidth: 1.2,
    borderTopColor: 'rgba(255, 255, 255, 0.3)',
    borderBottomWidth: 4,
    borderBottomColor: '#0E1013',
    shadowColor: Colors.MidnightCharcoal,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 14,
    elevation: 7,
    marginBottom: ResponsivePixels.size20,
  },
  ctaContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  primaryCtaText: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: 15.5,
    letterSpacing: 0.4,
  },
  ctaSparkle: {
    marginLeft: ResponsivePixels.size8,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: ResponsivePixels.size18,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    fontFamily: Fonts.poppins.medium,
    fontSize: 11,
    letterSpacing: 0.8,
    paddingHorizontal: ResponsivePixels.size12,
  },
  socialRow: {
    flexDirection: 'row',
    gap: ResponsivePixels.size12,
  },
  socialBtn: {
    flex: 1,
    height: 48,
    borderRadius: ResponsivePixels.size24,
    borderWidth: 1.5,
    borderTopWidth: 1,
    borderBottomWidth: 2.8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: ResponsivePixels.size8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 5,
    elevation: 2.5,
  },
  socialBtnText: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: 13.5,
  },
  guestLinkTouch: {
    marginTop: ResponsivePixels.size20,
    paddingVertical: ResponsivePixels.size8,
    paddingHorizontal: ResponsivePixels.size16,
    borderRadius: ResponsivePixels.size18,
  },
  guestLinkText: {
    fontFamily: Fonts.poppins.medium,
    fontSize: 13,
    letterSpacing: 0.2,
  },
});

export default LoginScreen;
