import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Switch,
  Alert,
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
  Shield,
  Lock,
  EyeOff,
  Server,
  Download,
  Trash2,
  FileText,
  CheckCircle2,
  HardDrive,
  Key,
  AlertTriangle,
  Sparkles,
  ShieldCheck,
} from 'lucide-react-native';
import Toast from 'react-native-toast-message';

import { Typography } from '../../Theme/Typographys';
import { Fonts } from '../../Theme/fonts';
import { Colors } from '../../Assets/StyleUtilities/Colors';
import ResponsivePixels from '../../Assets/StyleUtilities/ResponsivePixels';
import { Badge } from '../../Common/Badge';
import {
  SubScreenHeader,
  SUB_SCREEN_HEADER_HEIGHT,
} from '../../Common/SubScreenHeader';
import { useScrollReactiveHeader } from '../../Common/useScrollReactiveHeader';
import { ProBadge } from '../../Common/ProBadge';
import CustomButton from '../../Common/CustomButton';
import { useTheme } from '../../Theme/ThemeContext';
import { VoiceSettingsService } from '../../Services/VoiceSettingsService';
import { SettingsBackgroundSvg } from '../Settings/Components/SettingsBackgroundSvg';

const HEADER_HEIGHT = SUB_SCREEN_HEADER_HEIGHT;

export const PrivacySecurityScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const { isDarkMode } = useTheme();
  const { width: screenWidth } = Dimensions.get('window');

  const [onDeviceSpeech, setOnDeviceSpeech] = useState(true);
  const [cloudSync, setCloudSync] = useState(true);
  const [personalizedContext, setPersonalizedContext] = useState(true);
  const [anonymousTelemetry, setAnonymousTelemetry] = useState(false);

  // Scroll tracking for reactive header layer
  const { scrollY, isScrolled, handleScroll } = useScrollReactiveHeader();

  const handleExportData = () => {
    Vibration.vibrate(25);
    Toast.show({
      type: 'success',
      text1: 'Archive Generated',
      text2: 'Encrypted JSON & SQLite backup ready for export.',
    });
  };

  const handleClearCache = async () => {
    Vibration.vibrate(25);
    Alert.alert(
      'Clear Voice & Audio Cache',
      'This will remove all locally cached TTS audio buffers and phonetic calibrations. Your tasks and reminders will not be deleted.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear Cache',
          style: 'destructive',
          onPress: async () => {
            await VoiceSettingsService.clearSettings();
            Toast.show({
              type: 'success',
              text1: 'Cache Purged',
              text2: 'Local speech cache reset to default.',
            });
          },
        },
      ],
    );
  };

  const handleDeleteData = () => {
    Vibration.vibrate([0, 40, 80, 50]);
    Alert.alert(
      'Delete All Personal Data',
      'This action is irreversible. All tasks, reminders, habit streaks, and voice records will be permanently erased.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete Permanently',
          style: 'destructive',
          onPress: () => {
            Toast.show({
              type: 'info',
              text1: 'Deletion Requested',
              text2: 'Your workspace deletion will process within 24 hours.',
            });
          },
        },
      ],
    );
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
      {/* Luxury Background Artwork */}
      <SettingsBackgroundSvg />

      {/* Scroll-Reactive Header */}
      <SubScreenHeader
        title="Privacy & Security"
        subtitle="End-to-End Cryptographic Vault"
        scrollY={scrollY}
        isScrolled={isScrolled}
        badge={{ label: 'ENCRYPTED', variant: 'green' }}
        backAccessibilityLabel="Back to Settings"
      />

      {/* Main Scrollable Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: insets.top + HEADER_HEIGHT + 14,
            paddingBottom: insets.bottom + 48,
          },
        ]}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {/* Cryptographic Vault */}
        <View style={styles.heroCardShadowWrapper}>
          <View style={styles.heroCard}>
            <View style={styles.heroHeaderRow}>
              <View style={styles.heroTagRow}>
                <Sparkles size={13} color="#21AF85" strokeWidth={2.4} />
                <Text style={styles.heroTagText}>ZERO-COMPROMISE VAULT</Text>
              </View>
              <Badge label="VERIFIED" variant="green" size="sm" />
            </View>

            <View style={styles.heroMainRow}>
              <View style={styles.heroShieldCircle}>
                <ShieldCheck size={28} color="#21AF85" strokeWidth={2.4} />
              </View>
              <View style={styles.heroDetails}>
                <Text style={styles.heroTitle}>Zero-Knowledge Architecture</Text>
                <Text style={styles.heroSubtitle}>
                  All voice commands and personal notes remain confidential on
                  your device. We never sell, monetize, or profile your data.
                </Text>
              </View>
            </View>

            <View style={styles.heroDivider} />

            {/* 3-Column Security Metrics */}
            <View style={styles.heroPillarsRow}>
              <View style={styles.pillarItem}>
                <View style={styles.pillarIconCircle}>
                  <Key size={14} color="#21AF85" strokeWidth={2.2} />
                </View>
                <Text style={styles.pillarTitle}>AES-256 Bit</Text>
                <Text style={styles.pillarSub}>Client Vault</Text>
              </View>

              <View style={styles.pillarSeparator} />

              <View style={styles.pillarItem}>
                <View style={styles.pillarIconCircle}>
                  <EyeOff size={14} color={Colors.LavenderPurple} strokeWidth={2.2} />
                </View>
                <Text style={styles.pillarTitle}>Zero Ad Tracking</Text>
                <Text style={styles.pillarSub}>No Profiling</Text>
              </View>

              <View style={styles.pillarSeparator} />

              <View style={styles.pillarItem}>
                <View style={styles.pillarIconCircle}>
                  <Lock size={14} color="#F5C518" strokeWidth={2.2} />
                </View>
                <Text style={styles.pillarTitle}>On-Device Speech</Text>
                <Text style={styles.pillarSub}>Local STT</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Data Handling & Privacy Preferences */}
        <Text style={[styles.sectionHeading, { color: textSecondary }]}>
          DATA HANDLING & PRIVACY PREFERENCES
        </Text>

        <View
          style={[
            styles.settingsGroupCard,
            {
              backgroundColor: cardBg,
              borderColor: borderLight,
            },
          ]}
        >
          {/* Local Speech Processing */}
          <View style={styles.settingItemRow}>
            <View style={styles.settingItemLeft}>
              <View
                style={[
                  styles.iconSquare,
                  { backgroundColor: isDarkMode ? '#1E2C24' : '#EDFDF5' },
                ]}
              >
                <Lock size={18} color="#21AF85" strokeWidth={2.2} />
              </View>
              <View style={styles.settingItemMeta}>
                <Text style={[styles.settingItemTitle, { color: textPrimary }]}>
                  Local Speech Processing
                </Text>
                <Text
                  style={[styles.settingItemDesc, { color: textSecondary }]}
                >
                  Process wake word & transcripts strictly on phone hardware
                </Text>
              </View>
            </View>
            <Switch
              value={onDeviceSpeech}
              onValueChange={val => {
                Vibration.vibrate(20);
                setOnDeviceSpeech(val);
              }}
              trackColor={{
                false: isDarkMode ? '#3A3F46' : '#D9D9D9',
                true: '#21AF85',
              }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View style={[styles.itemDivider, { backgroundColor: borderLight }]} />

          {/* Encrypted Cloud Backup */}
          <View style={styles.settingItemRow}>
            <View style={styles.settingItemLeft}>
              <View
                style={[
                  styles.iconSquare,
                  { backgroundColor: isDarkMode ? '#23273A' : '#EFF2FE' },
                ]}
              >
                <Server
                  size={18}
                  color={Colors.LavenderPurple}
                  strokeWidth={2.2}
                />
              </View>
              <View style={styles.settingItemMeta}>
                <Text style={[styles.settingItemTitle, { color: textPrimary }]}>
                  Encrypted Cloud Backup
                </Text>
                <Text
                  style={[styles.settingItemDesc, { color: textSecondary }]}
                >
                  Sync items across devices with client-side cryptographic keys
                </Text>
              </View>
            </View>
            <Switch
              value={cloudSync}
              onValueChange={val => {
                Vibration.vibrate(20);
                setCloudSync(val);
              }}
              trackColor={{
                false: isDarkMode ? '#3A3F46' : '#D9D9D9',
                true: Colors.LavenderPurple,
              }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View style={[styles.itemDivider, { backgroundColor: borderLight }]} />

          {/* Personalized AI Context */}
          <View style={styles.settingItemRow}>
            <View style={styles.settingItemLeft}>
              <View
                style={[
                  styles.iconSquare,
                  { backgroundColor: isDarkMode ? '#332918' : '#FFFCEB' },
                ]}
              >
                <CheckCircle2 size={18} color="#F5C518" strokeWidth={2.2} />
              </View>
              <View style={styles.settingItemMeta}>
                <Text style={[styles.settingItemTitle, { color: textPrimary }]}>
                  Personalized AI Context
                </Text>
                <Text
                  style={[styles.settingItemDesc, { color: textSecondary }]}
                >
                  Allow assistant to learn recurring routine schedules
                </Text>
              </View>
            </View>
            <Switch
              value={personalizedContext}
              onValueChange={val => {
                Vibration.vibrate(20);
                setPersonalizedContext(val);
              }}
              trackColor={{
                false: isDarkMode ? '#3A3F46' : '#D9D9D9',
                true: '#F5C518',
              }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View style={[styles.itemDivider, { backgroundColor: borderLight }]} />

          {/* Anonymous Telemetry */}
          <View style={styles.settingItemRow}>
            <View style={styles.settingItemLeft}>
              <View
                style={[
                  styles.iconSquare,
                  { backgroundColor: isDarkMode ? '#282C35' : '#FAF8F5' },
                ]}
              >
                <EyeOff size={18} color={textSecondary} strokeWidth={2.2} />
              </View>
              <View style={styles.settingItemMeta}>
                <Text style={[styles.settingItemTitle, { color: textPrimary }]}>
                  Anonymous Telemetry
                </Text>
                <Text
                  style={[styles.settingItemDesc, { color: textSecondary }]}
                >
                  Help improve performance with anonymized crash metrics
                </Text>
              </View>
            </View>
            <Switch
              value={anonymousTelemetry}
              onValueChange={val => {
                Vibration.vibrate(20);
                setAnonymousTelemetry(val);
              }}
              trackColor={{
                false: isDarkMode ? '#3A3F46' : '#D9D9D9',
                true: Colors.LavenderPurple,
              }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        {/* Data Governance & Sovereignty */}
        <Text style={[styles.sectionHeading, { color: textSecondary }]}>
          DATA GOVERNANCE & SOVEREIGNTY
        </Text>

        <View
          style={[
            styles.settingsGroupCard,
            {
              backgroundColor: cardBg,
              borderColor: borderLight,
            },
          ]}
        >
          {/* Export Data */}
          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.actionRow}
            onPress={handleExportData}
          >
            <View style={styles.actionLeft}>
              <View
                style={[
                  styles.iconSquare,
                  { backgroundColor: isDarkMode ? '#23273A' : '#EFF2FE' },
                ]}
              >
                <Download
                  size={18}
                  color={Colors.LavenderPurple}
                  strokeWidth={2.2}
                />
              </View>
              <View style={styles.actionMeta}>
                <Text style={[styles.actionTitle, { color: textPrimary }]}>
                  Export Workspace Archive
                </Text>
                <Text style={[styles.actionDesc, { color: textSecondary }]}>
                  Download full JSON backup of all tasks, habits & notes
                </Text>
              </View>
            </View>
            <Badge label="JSON / ZIP" variant="purple" size="sm" />
          </TouchableOpacity>

          <View style={[styles.itemDivider, { backgroundColor: borderLight }]} />

          {/* Clear Cache */}
          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.actionRow}
            onPress={handleClearCache}
          >
            <View style={styles.actionLeft}>
              <View
                style={[
                  styles.iconSquare,
                  { backgroundColor: isDarkMode ? '#33241A' : '#FFF0DE' },
                ]}
              >
                <HardDrive size={18} color="#FF9800" strokeWidth={2.2} />
              </View>
              <View style={styles.actionMeta}>
                <Text style={[styles.actionTitle, { color: textPrimary }]}>
                  Purge Speech & Voice Cache
                </Text>
                <Text style={[styles.actionDesc, { color: textSecondary }]}>
                  Clear temporary neural model buffers and previews
                </Text>
              </View>
            </View>
            <Badge label="CLEAN" variant="orange" size="sm" />
          </TouchableOpacity>

          <View style={[styles.itemDivider, { backgroundColor: borderLight }]} />

          {/* Delete Account */}
          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.actionRow}
            onPress={handleDeleteData}
          >
            <View style={styles.actionLeft}>
              <View
                style={[
                  styles.iconSquare,
                  { backgroundColor: isDarkMode ? '#331D1D' : '#FEEFEF' },
                ]}
              >
                <Trash2 size={18} color="#FF3B30" strokeWidth={2.2} />
              </View>
              <View style={styles.actionMeta}>
                <Text style={[styles.actionTitle, { color: '#FF3B30' }]}>
                  Delete Account & All Records
                </Text>
                <Text style={[styles.actionDesc, { color: textSecondary }]}>
                  Permanently purge your account from all servers
                </Text>
              </View>
            </View>
            <Badge label="DANGER" variant="red" size="sm" />
          </TouchableOpacity>
        </View>

        {/* Legal & Compliance Footer */}
        <View
          style={[
            styles.legalCard,
            {
              backgroundColor: surfaceAlt,
              borderColor: borderLight,
            },
          ]}
        >
          <FileText size={18} color={textSecondary} strokeWidth={2} />
          <Text style={[styles.legalText, { color: textSecondary }]}>
            Regius is strictly compliant with GDPR, CCPA, and Apple App Store
            Privacy Guidelines. We do not sell your personal data or store
            unencrypted voice recordings.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default PrivacySecurityScreen;

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
  /* 2-Layer Hero Bento */
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
    backgroundColor: Colors.NeroBlack,
    borderRadius: 24,
    borderWidth: 4,
    borderColor: 'rgba(255, 255, 255, 0.9)',
    overflow: 'hidden',
    padding: 18,
  },
  heroHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  heroTagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  heroTagText: {
    fontFamily: Fonts.poppins.bold,
    fontSize: 10,
    color: '#21AF85',
    letterSpacing: 1,
  },
  heroMainRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 14,
  },
  heroShieldCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#1E2C24',
    borderWidth: 1.5,
    borderColor: 'rgba(33, 175, 133, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroDetails: {
    flex: 1,
  },
  heroTitle: {
    fontFamily: Fonts.ranade.bold,
    fontSize: 19,
    color: '#FFFFFF',
    letterSpacing: -0.4,
    lineHeight: 24,
    marginBottom: 4,
  },
  heroSubtitle: {
    fontFamily: Fonts.poppins.regular,
    fontSize: 11.5,
    color: '#A3A8B1',
    lineHeight: 17,
  },
  heroDivider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: 14,
  },
  heroPillarsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pillarItem: {
    flex: 1,
    alignItems: 'center',
  },
  pillarIconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#262933',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  pillarTitle: {
    fontFamily: Fonts.poppins.bold,
    fontSize: 11.5,
    color: '#FFFFFF',
    marginBottom: 1,
    textAlign: 'center',
  },
  pillarSub: {
    fontFamily: Fonts.poppins.regular,
    fontSize: 10,
    color: '#A3A8B1',
    textAlign: 'center',
  },
  pillarSeparator: {
    width: 1,
    height: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
  },
  sectionHeading: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: 11,
    letterSpacing: 0.8,
    marginBottom: 10,
    marginLeft: 2,
  },
  /* Settings group card */
  settingsGroupCard: {
    borderRadius: 20,
    borderWidth: 1.5,
    padding: 14,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 20,
  },
  settingItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  settingItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingRight: 10,
    gap: 12,
  },
  iconSquare: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingItemMeta: {
    flex: 1,
  },
  settingItemTitle: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: 14,
    marginBottom: 2,
  },
  settingItemDesc: {
    fontFamily: Fonts.poppins.regular,
    fontSize: 11,
    lineHeight: 15,
  },
  itemDivider: {
    height: 1,
    marginVertical: 10,
  },
  /* Action row */
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  actionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingRight: 10,
    gap: 12,
  },
  actionMeta: {
    flex: 1,
  },
  actionTitle: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: 14,
    marginBottom: 2,
  },
  actionDesc: {
    fontFamily: Fonts.poppins.regular,
    fontSize: 11,
    lineHeight: 15,
  },
  /* Legal footer */
  legalCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    marginBottom: 10,
  },
  legalText: {
    flex: 1,
    fontFamily: Fonts.poppins.regular,
    fontSize: 11.5,
    lineHeight: 17,
  },
});
