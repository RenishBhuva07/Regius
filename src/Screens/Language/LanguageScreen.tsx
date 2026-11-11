import React, {
  useState,
  useEffect,
  useMemo,
} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
  Platform,
  Vibration,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import {
  Globe,
  Sparkles,
  Volume2,
} from 'lucide-react-native';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Fonts } from '../../Theme/fonts';
import { Colors, withAlpha } from '../../Assets/StyleUtilities/Colors';
import { Badge } from '../../Common/Badge';
import {
  SubScreenHeader,
  SUB_SCREEN_HEADER_HEIGHT,
} from '../../Common/SubScreenHeader';
import { useScrollReactiveHeader } from '../../Common/useScrollReactiveHeader';
import { SearchInputBar } from '../../Common/SearchInputBar';
import { StickyActionDock } from '../../Common/StickyActionDock';
import { StickyBottomButton } from '../../Common/StickyBottomButton';
import { useTheme } from '../../Theme/ThemeContext';
import { SettingsBackgroundSvg } from '../Settings/Components/SettingsBackgroundSvg';

const APP_LANGUAGE_KEY = '@regius_app_language';
const HEADER_HEIGHT = SUB_SCREEN_HEADER_HEIGHT;

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
  const { isDarkMode, Colors: themeColors } = useTheme();

  const [selectedLanguageCode, setSelectedLanguageCode] = useState('en-US');
  const [autoDetect, setAutoDetect] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<RegionFilter>('all');
  const [isSaving, setIsSaving] = useState(false);
  const [isAuditioning, setIsAuditioning] = useState(false);

  // Scroll tracking for reactive header layer
  const { scrollY, isScrolled, handleScroll } = useScrollReactiveHeader();

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
      const {
        RegiusSpeechService,
      } = require('../../Services/RegiusSpeechService');
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
        text2: `App interface language set to ${
          chosen?.nativeName || 'English'
        }`,
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

  const bgMain =
    themeColors.Background ||
    (isDarkMode ? Colors.DarkBackground : Colors.CreamBackground);
  const cardBg =
    themeColors.CardBackground ||
    (isDarkMode ? Colors.DarkCardBackground : Colors.PureWhite);
  const textPrimary =
    themeColors.PrimaryText ||
    (isDarkMode ? Colors.PureWhite : Colors.PureBlack);
  const textSecondary =
    themeColors.SecondaryText ||
    (isDarkMode ? Colors.SteelMist : Colors.SubtitleGray);
  const borderLight =
    themeColors.BorderLight ||
    (isDarkMode ? Colors.CarbonSlate : Colors.RingBorder);

  return (
    <View style={[styles.container, { backgroundColor: bgMain }]}>
      {/* Luxury Background Artwork */}
      <SettingsBackgroundSvg />

      {/* Scroll-Reactive Header */}
      <SubScreenHeader
        title="App Language"
        subtitle="Locale & Regionalization"
        scrollY={scrollY}
        isScrolled={isScrolled}
        badge={{ label: 'GLOBAL', variant: 'purple' }}
        backAccessibilityLabel="Back to Settings"
      />

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
        {/* Active Locale */}
        <View style={styles.heroCardShadowWrapper}>
          <View style={styles.heroCard}>
            {/* Header info row */}
            <View style={styles.heroHeaderRow}>
              <View style={styles.heroTagRow}>
                <Sparkles
                  size={13}
                  color={Colors.AccentYellow}
                  strokeWidth={2.4}
                />
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
              <Volume2
                size={16}
                color={Colors.LavenderPurple}
                strokeWidth={2.4}
              />
              <Text style={styles.auditionPillText}>
                {isAuditioning
                  ? 'Auditioning Speech...'
                  : 'Audition Dialect Cadence'}
              </Text>
            </TouchableOpacity>

            {/* System OS Match Switch Row */}
            <View style={styles.heroDivider} />
            <View style={styles.autoDetectRow}>
              <View style={styles.autoDetectLeft}>
                <View style={styles.globeWrap}>
                  <Globe
                    size={18}
                    color={Colors.LavenderPurple}
                    strokeWidth={2.2}
                  />
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
                  false: isDarkMode ? Colors.DarkSoftLinen : Colors.FogGrey,
                  true: Colors.LavenderPurple,
                }}
                thumbColor={Colors.PureWhite}
              />
            </View>
          </View>
        </View>

        {/* Search Input Bar */}
        <SearchInputBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search language, country, or code..."
          containerStyle={{ marginBottom: 16 }}
        />

        {/* Region Filter Chips */}
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
                label: `Neural Voice (${
                  LANGUAGES.filter(l => l.hasNeuralVoice).length
                })`,
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

        {/* Languages Section */}
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
                        ? Colors.VoiceCardDarkSelectedBg
                        : Colors.MindfulLightBg
                      : cardBg,
                    borderColor: isSelected
                      ? isDarkMode
                        ? Colors.LanguageSelectedDarkBorder
                        : Colors.MindfulLightBorder
                      : borderLight,
                    shadowColor: isSelected
                      ? Colors.LavenderPurple
                      : isDarkMode
                      ? Colors.PureBlack
                      : Colors.HomeIndicator,
                  },
                ]}
              >
                <View style={styles.langLeftCol}>
                  <View
                    style={[
                      styles.langFlagPill,
                      {
                        backgroundColor: isDarkMode
                          ? Colors.LanguageFlagDarkBg
                          : Colors.PureWhite,
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
                        <Badge label="VOICE READY" variant="green" size="sm" />
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

      {/* Sticky Frosted Bottom Action Dock */}
      <StickyActionDock>
        <StickyBottomButton
          title={
            isSaving
              ? 'Applying Regional Locale...'
              : `Set ${currentLang.nativeName} as Default`
          }
          onPress={handleSave}
          loading={isSaving}
          disabled={isSaving}
          accessibilityLabel={`Set ${currentLang.nativeName} as Default`}
        />
      </StickyActionDock>
    </View>
  );
};

export default LanguageScreen;

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
  /* 2-Layer Hero Bento Card */
  heroCardShadowWrapper: {
    borderRadius: 24,
    backgroundColor: Colors.NeroBlack,
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: Colors.PureBlack,
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
    borderColor: withAlpha(Colors.PureWhite, 0.9), // Ceramic white rim
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
    color: Colors.AccentYellow,
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
    backgroundColor: Colors.PureWhite,
    borderWidth: 1.5,
    borderColor: withAlpha(Colors.PureWhite, 0.9),
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.PureBlack,
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
    color: Colors.PureWhite,
    letterSpacing: -0.4,
    lineHeight: 24,
    marginBottom: 2,
  },
  heroEnglishSub: {
    fontFamily: Fonts.poppins.regular,
    fontSize: 12,
    color: Colors.SteelMist,
  },
  auditionPillBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.LanguageAuditionDarkBg,
    borderWidth: 1,
    borderColor: withAlpha(Colors.LavenderPurple, 0.35),
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginBottom: 14,
  },
  auditionPillText: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: 12,
    color: Colors.PureWhite,
  },
  heroDivider: {
    height: 1,
    backgroundColor: withAlpha(Colors.PureWhite, 0.1),
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
    backgroundColor: Colors.LanguageGlobeDarkBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  autoDetectMeta: {
    flex: 1,
  },
  autoDetectTitle: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: 12.5,
    color: Colors.PureWhite,
  },
  autoDetectDesc: {
    fontFamily: Fonts.poppins.regular,
    fontSize: 10.5,
    color: Colors.SteelMist,
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
    shadowColor: Colors.PureBlack,
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
    color: Colors.PureWhite,
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
    backgroundColor: Colors.Transparent,
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
    shadowColor: Colors.PureBlack,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 10,
  },
  dockButton: {
    width: '100%',
  },
});
