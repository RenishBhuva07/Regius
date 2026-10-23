import React, { useState, useEffect } from 'react';
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

const APP_LANGUAGE_KEY = '@regius_app_language';

interface LanguageOption {
  code: string;
  nativeName: string;
  englishName: string;
  flag: string;
  hasNeuralVoice: boolean;
}

const LANGUAGES: LanguageOption[] = [
  {
    code: 'en-US',
    nativeName: 'English (US)',
    englishName: 'English (United States)',
    flag: '🇺🇸',
    hasNeuralVoice: true,
  },
  {
    code: 'en-GB',
    nativeName: 'English (UK)',
    englishName: 'English (United Kingdom)',
    flag: '🇬🇧',
    hasNeuralVoice: true,
  },
  {
    code: 'es-ES',
    nativeName: 'Español',
    englishName: 'Spanish (Spain)',
    flag: '🇪🇸',
    hasNeuralVoice: true,
  },
  {
    code: 'fr-FR',
    nativeName: 'Français',
    englishName: 'French',
    flag: '🇫🇷',
    hasNeuralVoice: true,
  },
  {
    code: 'de-DE',
    nativeName: 'Deutsch',
    englishName: 'German',
    flag: '🇩🇪',
    hasNeuralVoice: false,
  },
  {
    code: 'ja-JP',
    nativeName: '日本語',
    englishName: 'Japanese',
    flag: '🇯🇵',
    hasNeuralVoice: true,
  },
  {
    code: 'it-IT',
    nativeName: 'Italiano',
    englishName: 'Italian',
    flag: '🇮🇹',
    hasNeuralVoice: false,
  },
  {
    code: 'pt-BR',
    nativeName: 'Português',
    englishName: 'Portuguese (Brazil)',
    flag: '🇧🇷',
    hasNeuralVoice: false,
  },
  {
    code: 'hi-IN',
    nativeName: 'हिन्दी',
    englishName: 'Hindi',
    flag: '🇮🇳',
    hasNeuralVoice: true,
  },
];

export const LanguageScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const { isDarkMode } = useTheme();

  const [selectedLanguageCode, setSelectedLanguageCode] = useState('en-US');
  const [autoDetect, setAutoDetect] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(APP_LANGUAGE_KEY)
      .then(saved => {
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            if (parsed.code) setSelectedLanguageCode(parsed.code);
            if (parsed.autoDetect !== undefined)
              setAutoDetect(parsed.autoDetect);
          } catch {
            setSelectedLanguageCode(saved);
          }
        }
      })
      .catch(() => {});
  }, []);

  const filteredLanguages = LANGUAGES.filter(
    lang =>
      lang.nativeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lang.englishName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lang.code.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleSelectLanguage = (code: string) => {
    setSelectedLanguageCode(code);
  };

  const handleSave = async () => {
    setIsSaving(true);
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
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        {...(Platform.OS === 'android' ? { backgroundColor: bgMain } : {})}
      />

      {/* Screen Header */}
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
            App Language
          </Text>
          <Text style={[styles.headerSubtitle, { color: textSecondary }]}>
            Locale & Voice Regionalization
          </Text>
        </View>

        <Badge label="GLOBAL" variant="purple" size="sm" />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 40 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* System Match Auto-Detect Bento */}
        <View
          style={[
            styles.autoCard,
            {
              backgroundColor: cardBg,
              borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.12)' : '#FFFFFF',
              borderBottomColor: isDarkMode ? '#171A20' : '#E2DCD0',
              shadowColor: isDarkMode ? '#000000' : 'rgba(131, 131, 214, 0.14)',
            },
          ]}
        >
          <View style={styles.autoLeft}>
            <View
              style={[
                styles.iconSquare,
                { backgroundColor: isDarkMode ? '#2C3035' : '#EFF2FE' },
              ]}
            >
              <Globe
                size={20}
                color={Colors.LavenderPurple}
                strokeWidth={2.2}
              />
            </View>
            <View style={styles.autoMeta}>
              <Text style={[styles.autoTitle, { color: textPrimary }]}>
                Match Device Language
              </Text>
              <Text style={[styles.autoDesc, { color: textSecondary }]}>
                Automatically adopt your operating system default locale
              </Text>
            </View>
          </View>

          <Switch
            value={autoDetect}
            onValueChange={setAutoDetect}
            trackColor={{ false: '#D9D9D9', true: Colors.LavenderPurple }}
            thumbColor="#FFFFFF"
          />
        </View>

        {/* Search Bar */}
        <View
          style={[
            styles.searchWrap,
            { backgroundColor: surfaceAlt, borderColor: borderLight },
          ]}
        >
          <Search size={18} color={textSecondary} strokeWidth={2.2} />
          <TextInput
            style={[styles.searchInput, { color: textPrimary }]}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search language or region..."
            placeholderTextColor={textSecondary}
          />
        </View>

        {/* Languages List */}
        <Text style={[styles.sectionHeading, { color: textSecondary }]}>
          AVAILABLE REGIONAL LANGUAGES
        </Text>

        <View
          style={[
            styles.langListCard,
            {
              backgroundColor: cardBg,
              borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.12)' : '#FFFFFF',
              borderBottomColor: isDarkMode ? '#171A20' : '#E2DCD0',
              shadowColor: isDarkMode ? '#000000' : 'rgba(131, 131, 214, 0.14)',
            },
          ]}
        >
          {filteredLanguages.map((lang, idx) => {
            const isSelected = selectedLanguageCode === lang.code;

            return (
              <React.Fragment key={lang.code}>
                <TouchableOpacity
                  activeOpacity={0.7}
                  style={styles.langRow}
                  onPress={() => handleSelectLanguage(lang.code)}
                >
                  <View style={styles.langLeft}>
                    <Text style={styles.flagEmoji}>{lang.flag}</Text>
                    <View style={styles.langMeta}>
                      <View style={styles.langTitleRow}>
                        <Text
                          style={[
                            styles.langNativeName,
                            { color: textPrimary },
                            isSelected && styles.langSelectedText,
                          ]}
                        >
                          {lang.nativeName}
                        </Text>
                        {lang.hasNeuralVoice && (
                          <Badge
                            label="VOICE SUPPORT"
                            variant="green"
                            size="sm"
                          />
                        )}
                      </View>
                      <Text
                        style={[
                          styles.langEnglishName,
                          { color: textSecondary },
                        ]}
                      >
                        {lang.englishName}
                      </Text>
                    </View>
                  </View>

                  <View
                    style={[
                      styles.radioCircle,
                      isSelected && styles.radioCircleActive,
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
                          styles.radioInner,
                          { backgroundColor: Colors.LavenderPurple },
                        ]}
                      />
                    )}
                  </View>
                </TouchableOpacity>

                {idx < filteredLanguages.length - 1 && (
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

        {/* Save Button */}
        <View style={styles.buttonContainer}>
          <CustomButton
            title={isSaving ? 'Applying Language...' : 'Apply Language'}
            onPress={handleSave}
            disabled={isSaving}
            variant="dark"
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default LanguageScreen;

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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: ResponsivePixels.size16,
    paddingTop: ResponsivePixels.size16,
  },
  autoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 20,
    borderWidth: 1,
    borderBottomWidth: 3,
    padding: ResponsivePixels.size16,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
    marginBottom: ResponsivePixels.size16,
  },
  autoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingRight: 12,
  },
  iconSquare: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  autoMeta: {
    flex: 1,
  },
  autoTitle: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: 14,
    marginBottom: 2,
  },
  autoDesc: {
    ...Typography.bodySuperSmallPoppinsRegularLoose,
    fontSize: 11,
  },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1.5,
    paddingHorizontal: 12,
    height: 46,
    gap: 8,
    marginBottom: ResponsivePixels.size16,
  },
  searchInput: {
    flex: 1,
    fontFamily: Fonts.poppins.regular,
    fontSize: 13,
    padding: 0,
  },
  sectionHeading: {
    ...Typography.bodySuperSmallPoppinsRegularLoose,
    fontFamily: Fonts.poppins.semiBold,
    fontSize: 11,
    letterSpacing: 1,
    marginBottom: ResponsivePixels.size8,
    marginLeft: 4,
  },
  langListCard: {
    borderRadius: 20,
    borderWidth: 1,
    borderBottomWidth: 3,
    padding: ResponsivePixels.size12,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
    marginBottom: ResponsivePixels.size24,
  },
  langRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: ResponsivePixels.size12,
    paddingHorizontal: ResponsivePixels.size4,
  },
  langLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  flagEmoji: {
    fontSize: 26,
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
    fontSize: 14,
  },
  langSelectedText: {
    fontFamily: Fonts.poppins.bold,
  },
  langEnglishName: {
    ...Typography.bodySuperSmallPoppinsRegularLoose,
    fontSize: 11,
  },
  radioCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioCircleActive: {
    borderColor: Colors.LavenderPurple,
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  itemDivider: {
    height: 1,
    marginVertical: 4,
  },
  buttonContainer: {
    marginTop: 4,
  },
});
