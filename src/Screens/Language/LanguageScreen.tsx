import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  StatusBar,
  Switch,
  Platform,
  Animated,
  Vibration,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import {
  ChevronLeft,
  Globe,
  Search,
  Check,
  Sparkles,
  Volume2,
  X,
  Radio,
  SlidersHorizontal,
} from 'lucide-react-native';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Typography } from '../../Theme/Typographys';
import { Fonts } from '../../Theme/fonts';
import { Colors } from '../../Assets/StyleUtilities/Colors';
import ResponsivePixels from '../../Assets/StyleUtilities/ResponsivePixels';
import { Badge } from '../../Common/Badge';
import { ProBadge } from '../../Common/ProBadge';
import CustomButton from '../../Common/CustomButton';
import { useTheme } from '../../Theme/ThemeContext';
import HeaderPatternSvg from '../Dashboard/Components/HeaderPatternSvg';
import { SettingsBackgroundSvg } from '../Settings/Components/SettingsBackgroundSvg';

const APP_LANGUAGE_KEY = '@regius_app_language';
const HEADER_HEIGHT = 54;

interface LanguageOption {
  code: string;
  nativeName: string;
  englishName: string;
  flag: string;
  region: 'Americas' | 'Europe' | 'Asia';
  hasNeuralVoice: boolean;
  sampleGreeting: string;
}

const LANGUAGES: LanguageOption[] = [
  {
    code: 'en-US',
    nativeName: 'English (US)',
    englishName: 'English (United States)',
    flag: '🇺🇸',
    region: 'Americas',
    hasNeuralVoice: true,
    sampleGreeting: 'Welcome to Regius. Plan your day in details.',
  },
  {
    code: 'en-GB',
    nativeName: 'English (UK)',
    englishName: 'English (United Kingdom)',
    flag: '🇬🇧',
    region: 'Europe',
    hasNeuralVoice: true,
    sampleGreeting: 'Good day. Ready for your mindful schedule.',
  },
  {
    code: 'es-ES',
    nativeName: 'Español',
    englishName: 'Spanish (Spain)',
    flag: '🇪🇸',
    region: 'Europe',
    hasNeuralVoice: true,
    sampleGreeting: 'Bienvenido a Regius. Organiza tu día con calma.',
  },
  {
    code: 'fr-FR',
    nativeName: 'Français',
    englishName: 'French',
    flag: '🇫🇷',
    region: 'Europe',
    hasNeuralVoice: true,
    sampleGreeting: 'Bienvenue sur Regius. Planifiez votre journée.',
  },
  {
    code: 'de-DE',
    nativeName: 'Deutsch',
    englishName: 'German',
    flag: '🇩🇪',
    region: 'Europe',
    hasNeuralVoice: false,
    sampleGreeting: 'Willkommen bei Regius. Gestalten Sie Ihren Tag.',
  },
  {
    code: 'ja-JP',
    nativeName: '日本語',
    englishName: 'Japanese',
    flag: '🇯🇵',
    region: 'Asia',
    hasNeuralVoice: true,
    sampleGreeting: 'Regiusへようこそ。充実した一日を。',
  },
  {
    code: 'it-IT',
    nativeName: 'Italiano',
    englishName: 'Italian',
    flag: '🇮🇹',
    region: 'Europe',
    hasNeuralVoice: false,
    sampleGreeting: 'Benvenuto in Regius. Pianifica la tua giornata.',
  },
  {
    code: 'pt-BR',
    nativeName: 'Português',
    englishName: 'Portuguese (Brazil)',
    flag: '🇧🇷',
    region: 'Americas',
    hasNeuralVoice: false,
    sampleGreeting: 'Bem-vindo ao Regius. Organize o seu dia.',
  },
  {
    code: 'hi-IN',
    nativeName: 'हिन्दी',
    englishName: 'Hindi',
    flag: '🇮🇳',
    region: 'Asia',
    hasNeuralVoice: true,
    sampleGreeting: 'रेगियस में आपका स्वागत है। अपनी दिनचर्या बनाएं।',
  },
];

type RegionFilter = 'all' | 'neural' | 'Americas' | 'Europe' | 'Asia';

export const LanguageScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const { isDarkMode } = useTheme();
  const { width: screenWidth } = Dimensions.get('window');

  const [selectedLanguageCode, setSelectedLanguageCode] = useState('en-US');
  const [autoDetect, setAutoDetect] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<RegionFilter>('all');
  const [isSaving, setIsSaving] = useState(false);
  const [isAuditioning, setIsAuditioning] = useState(false);

  // Scroll tracking for reactive header layer
  const scrollY = useRef(new Animated.Value(0)).current;
  const isScrolledRef = useRef(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(APP_LANGUAGE_KEY)
      .then(saved => {
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            if (parsed.code) setSelectedLanguageCode(parsed.code);
            if (parsed.autoDetect !== undefined) {
              setAutoDetect(parsed.autoDetect);
            }
          } catch {
            setSelectedLanguageCode(saved);
          }
        }
      })
      .catch(() => {});
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

  // Current active language object
  const currentLang = useMemo(
    () => LANGUAGES.find(l => l.code === selectedLanguageCode) || LANGUAGES[0],
    [selectedLanguageCode],
  );

  // Filtered languages based on search query and category pill
  const filteredLanguages = useMemo(() => {
    return LANGUAGES.filter(lang => {
      // Search query check
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !query ||
        lang.nativeName.toLowerCase().includes(query) ||
        lang.englishName.toLowerCase().includes(query) ||
        lang.code.toLowerCase().includes(query);

      if (!matchesSearch) return false;

      // Filter category check
      if (activeFilter === 'neural') return lang.hasNeuralVoice;
      if (activeFilter === 'Americas') return lang.region === 'Americas';
      if (activeFilter === 'Europe') return lang.region === 'Europe';
      if (activeFilter === 'Asia') return lang.region === 'Asia';
      return true;
    });
  }, [searchQuery, activeFilter]);

  const handleSelectLanguage = (code: string) => {
    Vibration.vibrate(20);
    setSelectedLanguageCode(code);
  };

  const handleAuditionGreeting = async () => {
    if (isAuditioning) return;
    Vibration.vibrate(25);
    setIsAuditioning(true);
    try {
      const { RegiusSpeechService } = require('../../Services/RegiusSpeechService');
      await RegiusSpeechService.speakResponse(currentLang.sampleGreeting);
    } catch {
      Toast.show({
        type: 'info',
        text1: `${currentLang.nativeName} Cadence`,
        text2: `"${currentLang.sampleGreeting}"`,
      });
    } finally {
      setIsAuditioning(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    Vibration.vibrate(35);
    const chosen = LANGUAGES.find(l => l.code === selectedLanguageCode);

    try {
      await AsyncStorage.setItem(
        APP_LANGUAGE_KEY,
        JSON.stringify({ code: selectedLanguageCode, autoDetect }),
      );
      Toast.show({
        type: 'success',
        text1: 'Language Updated',
        text2: `App interface language set to ${chosen?.nativeName || 'English'}`,
      });
      setTimeout(() => {
        navigation.goBack();
      }, 400);
    } catch {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Could not save language selection.',
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
              App Language
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
              Locale & Regionalization
            </Text>
          </View>

          <Badge label="GLOBAL" variant="purple" size="sm" />
        </View>
      </Animated.View>

      {/* Main Scrollable Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: insets.top + HEADER_HEIGHT + 14,
            paddingBottom: insets.bottom + 104,
          },
        ]}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {/* ─── Flagship 2-Layer Hero Bento Card: Active Locale ─── */}
        <View style={styles.heroCardShadowWrapper}>
          <View style={styles.heroCard}>
            {/* Header info row */}
            <View style={styles.heroHeaderRow}>
              <View style={styles.heroTagRow}>
                <Sparkles size={13} color="#F5C518" strokeWidth={2.4} />
                <Text style={styles.heroTagText}>ACTIVE REGIONAL LOCALE</Text>
              </View>
              <Badge
                label={
                  currentLang.hasNeuralVoice
                    ? 'NEURAL KOKORO'
                    : 'STANDARD SPEECH'
                }
                variant={currentLang.hasNeuralVoice ? 'green' : 'neutral'}
                size="sm"
              />
            </View>

            {/* Main locale display */}
            <View style={styles.heroBodyRow}>
              <View style={styles.heroFlagCircle}>
                <Text style={styles.heroFlagEmoji}>{currentLang.flag}</Text>
              </View>

              <View style={styles.heroDetails}>
                <Text style={styles.heroNativeTitle} numberOfLines={1}>
                  {currentLang.nativeName}
                </Text>
                <Text style={styles.heroEnglishSub} numberOfLines={1}>
                  {currentLang.englishName} • {currentLang.code}
                </Text>
              </View>
            </View>

            {/* Quick Audition Action Button */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleAuditionGreeting}
              disabled={isAuditioning}
              style={styles.auditionPillBtn}
              accessibilityRole="button"
              accessibilityLabel="Audition spoken greeting"
            >
              <Volume2 size={16} color="#8383D6" strokeWidth={2.4} />
              <Text style={styles.auditionPillText}>
                {isAuditioning ? 'Auditioning Speech...' : 'Audition Dialect Cadence'}
              </Text>
            </TouchableOpacity>

            {/* System OS Match Switch Row */}
            <View style={styles.heroDivider} />
            <View style={styles.autoDetectRow}>
              <View style={styles.autoDetectLeft}>
                <View style={styles.globeWrap}>
                  <Globe size={18} color="#8383D6" strokeWidth={2.2} />
                </View>
                <View style={styles.autoDetectMeta}>
                  <Text style={styles.autoDetectTitle}>
                    Match Operating System Locale
                  </Text>
                  <Text style={styles.autoDetectDesc}>
                    Sync automatically with your device settings
                  </Text>
                </View>
              </View>

              <Switch
                value={autoDetect}
                onValueChange={val => {
                  Vibration.vibrate(20);
                  setAutoDetect(val);
                }}
                trackColor={{
                  false: isDarkMode ? '#3A3F46' : '#D9D9D9',
                  true: Colors.LavenderPurple,
                }}
                thumbColor="#FFFFFF"
              />
            </View>
          </View>
        </View>

        {/* ─── Search Input Bar ─── */}
        <View
          style={[
            styles.searchWrap,
            {
              backgroundColor: cardBg,
              borderColor: isDarkMode ? '#2C3035' : borderLight,
            },
          ]}
        >
          <Search size={18} color={textSecondary} strokeWidth={2.2} />
          <TextInput
            style={[styles.searchInput, { color: textPrimary }]}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search language, country, or code..."
            placeholderTextColor={textSecondary}
            autoCorrect={false}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setSearchQuery('')}
              style={styles.searchClearBtn}
              accessibilityLabel="Clear search"
            >
              <X size={15} color={textSecondary} strokeWidth={2.4} />
            </TouchableOpacity>
          )}
        </View>

        {/* ─── Region Filter Chips ─── */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScroll}
        >
          {(
            [
              { key: 'all', label: `All (${LANGUAGES.length})` },
              {
                key: 'neural',
                label: `Neural Voice (${LANGUAGES.filter(l => l.hasNeuralVoice).length})`,
              },
              { key: 'Americas', label: 'Americas' },
              { key: 'Europe', label: 'Europe' },
              { key: 'Asia', label: 'Asia' },
            ] as const
          ).map(tab => {
            const isTabActive = activeFilter === tab.key;
            return (
              <TouchableOpacity
                key={tab.key}
                activeOpacity={0.75}
                onPress={() => {
                  Vibration.vibrate(15);
                  setActiveFilter(tab.key);
                }}
                style={[
                  styles.filterChip,
                  isTabActive
                    ? styles.filterChipActive
                    : {
                        backgroundColor: cardBg,
                        borderColor: borderLight,
                      },
                ]}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    isTabActive
                      ? styles.filterChipTextActive
                      : { color: textSecondary },
                  ]}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* ─── Languages Section ─── */}
        <View style={styles.sectionHeaderRow}>
          <Text style={[styles.sectionHeading, { color: textSecondary }]}>
            AVAILABLE REGIONAL DIALECTS ({filteredLanguages.length})
          </Text>
        </View>

        <View style={styles.languagesContainer}>
          {filteredLanguages.map(lang => {
            const isSelected = selectedLanguageCode === lang.code;

            return (
              <TouchableOpacity
                key={lang.code}
                activeOpacity={0.75}
                onPress={() => handleSelectLanguage(lang.code)}
                style={[
                  styles.languageCard,
                  {
                    backgroundColor: isSelected
                      ? isDarkMode
                        ? '#22283A'
                        : '#EFF2FE'
                      : cardBg,
                    borderColor: isSelected
                      ? isDarkMode
                        ? '#4E5785'
                        : '#D8DBFF'
                      : borderLight,
                    shadowColor: isSelected
                      ? Colors.LavenderPurple
                      : isDarkMode
                      ? '#000000'
                      : '#D5D0C5',
                  },
                ]}
              >
                <View style={styles.langLeftCol}>
                  <View
                    style={[
                      styles.langFlagPill,
                      {
                        backgroundColor: isDarkMode ? '#2A2E36' : '#FFFFFF',
                        borderColor: borderLight,
                      },
                    ]}
                  >
                    <Text style={styles.langFlagChar}>{lang.flag}</Text>
                  </View>

                  <View style={styles.langMeta}>
                    <View style={styles.langTitleRow}>
                      <Text
                        style={[
                          styles.langNativeName,
                          { color: textPrimary },
                          isSelected && styles.langNativeNameSelected,
                        ]}
                      >
                        {lang.nativeName}
                      </Text>
                      {lang.hasNeuralVoice && (
                        <Badge
                          label="VOICE READY"
                          variant="green"
                          size="sm"
                        />
                      )}
                    </View>
                    <Text
                      style={[styles.langEnglishName, { color: textSecondary }]}
                    >
                      {lang.englishName} • {lang.code}
                    </Text>
                  </View>
                </View>

                {/* 3D Tactile Radio Selector */}
                <View
                  style={[
                    styles.radioVessel,
                    isSelected && styles.radioVesselActive,
                    {
                      borderColor: isSelected
                        ? Colors.LavenderPurple
                        : borderLight,
                    },
                  ]}
                >
                  {isSelected && (
                    <View
                      style={[
                        styles.radioDot,
                        { backgroundColor: Colors.LavenderPurple },
                      ]}
                    />
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* ─── Sticky Frosted Bottom Action Dock ─── */}
      <View
        style={[
          styles.actionDock,
          {
            paddingBottom: Math.max(insets.bottom, 16),
            backgroundColor: isDarkMode
              ? 'rgba(18, 20, 23, 0.94)'
              : 'rgba(255, 252, 227, 0.95)',
            borderTopColor: borderLight,
          },
        ]}
      >
        <CustomButton
          title={
            isSaving
              ? 'Applying Regional Locale...'
              : `Set ${currentLang.nativeName} as Default`
          }
          onPress={handleSave}
          disabled={isSaving}
          variant="dark"
          style={styles.dockButton}
        />
      </View>
    </View>
  );
};

export default LanguageScreen;

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
  /* 2-Layer Hero Bento Card */
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
    backgroundColor: Colors.NeroBlack, // #1C1D22
    borderRadius: 24,
    borderWidth: 4, // Bold luxury specular border
    borderColor: 'rgba(255, 255, 255, 0.9)', // Ceramic white rim
    overflow: 'hidden',
    padding: 18,
  },
  heroHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  heroTagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  heroTagText: {
    fontFamily: Fonts.poppins.bold,
    fontSize: 10,
    color: '#F5C518',
    letterSpacing: 1,
  },
  heroBodyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 14,
  },
  heroFlagCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  heroFlagEmoji: {
    fontSize: 28,
  },
  heroDetails: {
    flex: 1,
  },
  heroNativeTitle: {
    fontFamily: Fonts.ranade.bold,
    fontSize: 20,
    color: '#FFFFFF',
    letterSpacing: -0.4,
    lineHeight: 24,
    marginBottom: 2,
  },
  heroEnglishSub: {
    fontFamily: Fonts.poppins.regular,
    fontSize: 12,
    color: '#A3A8B1',
  },
  auditionPillBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#272935',
    borderWidth: 1,
    borderColor: 'rgba(131, 131, 214, 0.35)',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginBottom: 14,
  },
  auditionPillText: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: 12,
    color: '#FFFFFF',
  },
  heroDivider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: 14,
  },
  autoDetectRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  autoDetectLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingRight: 10,
    gap: 10,
  },
  globeWrap: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#292B38',
    alignItems: 'center',
    justifyContent: 'center',
  },
  autoDetectMeta: {
    flex: 1,
  },
  autoDetectTitle: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: 12.5,
    color: '#FFFFFF',
  },
  autoDetectDesc: {
    fontFamily: Fonts.poppins.regular,
    fontSize: 10.5,
    color: '#A3A8B1',
    marginTop: 1,
  },
  /* Search input */
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1.5,
    paddingHorizontal: 14,
    height: 48,
    gap: 10,
    marginBottom: 12,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 5,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    fontFamily: Fonts.poppins.regular,
    fontSize: 13,
    padding: 0,
  },
  searchClearBtn: {
    padding: 4,
  },
  /* Filter horizontal scroll */
  filterScroll: {
    gap: 8,
    paddingBottom: 16,
  },
  filterChip: {
    borderRadius: 20,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  filterChipActive: {
    backgroundColor: Colors.MidnightCharcoal,
    borderColor: Colors.MidnightCharcoal,
  },
  filterChipText: {
    fontFamily: Fonts.poppins.medium,
    fontSize: 11.5,
  },
  filterChipTextActive: {
    color: Colors.DefaultWhite,
    fontFamily: Fonts.poppins.bold,
  },
  sectionHeaderRow: {
    marginBottom: 10,
    marginLeft: 2,
  },
  sectionHeading: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: 11,
    letterSpacing: 0.8,
  },
  /* Languages list cards */
  languagesContainer: {
    gap: 10,
  },
  languageCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 18,
    borderWidth: 1.5,
    paddingVertical: 12,
    paddingHorizontal: 14,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  langLeftCol: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  langFlagPill: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  langFlagChar: {
    fontSize: 22,
  },
  langMeta: {
    flex: 1,
  },
  langTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 2,
  },
  langNativeName: {
    fontFamily: Fonts.poppins.medium,
    fontSize: 14.5,
  },
  langNativeNameSelected: {
    fontFamily: Fonts.poppins.bold,
  },
  langEnglishName: {
    fontFamily: Fonts.poppins.regular,
    fontSize: 11.5,
  },
  /* 3D Radio Vessel */
  radioVessel: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  radioVesselActive: {
    borderColor: Colors.LavenderPurple,
  },
  radioDot: {
    width: 11,
    height: 11,
    borderRadius: 5.5,
  },
  /* Sticky Frosted Action Dock */
  actionDock: {
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
  },
  dockButton: {
    width: '100%',
  },
});
