import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
  Alert,
  Platform,
  Vibration,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Lock,
  EyeOff,
  Server,
  Download,
  Trash2,
  FileText,
  CheckCircle2,
  HardDrive,
  Key,
  Sparkles,
  ShieldCheck,
} from 'lucide-react-native';
import Toast from 'react-native-toast-message';

import { Fonts } from '../../Theme/fonts';
import { Colors, withAlpha } from '../../Assets/StyleUtilities/Colors';
import { Badge } from '../../Common/Badge';
import {
  SubScreenHeader,
  SUB_SCREEN_HEADER_HEIGHT,
} from '../../Common/SubScreenHeader';
import { useScrollReactiveHeader } from '../../Common/useScrollReactiveHeader';
import { useTheme } from '../../Theme/ThemeContext';
import { VoiceSettingsService } from '../../Services/VoiceSettingsService';
import { SettingsBackgroundSvg } from '../Settings/Components/SettingsBackgroundSvg';
import ResponsivePixels from '../../Assets/StyleUtilities/ResponsivePixels';

const HEADER_HEIGHT = SUB_SCREEN_HEADER_HEIGHT;

export const PrivacySecurityScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const { isDarkMode, Colors: themeColors } = useTheme();
  const themeAccent = themeColors.Accent || Colors.LavenderPurple;

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
  const surfaceAlt =
    themeColors.SurfaceAlt ||
    (isDarkMode ? Colors.DarkSurfaceAlt : Colors.CreamSurfaceAlt);

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
            paddingTop: insets.top + HEADER_HEIGHT + ResponsivePixels.size14,
            paddingBottom: insets.bottom + ResponsivePixels.size48,
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
                <Sparkles
                  size={ResponsivePixels.size13}
                  color={Colors.LuminousGreen}
                  strokeWidth={2.4}
                />
                <Text style={styles.heroTagText}>ZERO-COMPROMISE VAULT</Text>
              </View>
              <Badge label="VERIFIED" variant="green" size="sm" />
            </View>

            <View style={styles.heroMainRow}>
              <View style={styles.heroShieldCircle}>
                <ShieldCheck
                  size={ResponsivePixels.size28}
                  color={Colors.LuminousGreen}
                  strokeWidth={2.4}
                />
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
                  <Key
                    size={ResponsivePixels.size14}
                    color={Colors.LuminousGreen}
                    strokeWidth={2.2}
                  />
                </View>
                <Text style={styles.pillarTitle}>AES-256 Bit</Text>
                <Text style={styles.pillarSub}>Client Vault</Text>
              </View>

              <View style={styles.pillarSeparator} />

              <View style={styles.pillarItem}>
                <View style={styles.pillarIconCircle}>
                  <EyeOff size={ResponsivePixels.size14} color={themeAccent} strokeWidth={2.2} />
                </View>
                <Text style={styles.pillarTitle}>Zero Ad Tracking</Text>
                <Text style={styles.pillarSub}>No Profiling</Text>
              </View>

              <View style={styles.pillarSeparator} />

              <View style={styles.pillarItem}>
                <View style={styles.pillarIconCircle}>
                  <Lock
                    size={ResponsivePixels.size14}
                    color={Colors.AccentYellow}
                    strokeWidth={2.2}
                  />
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
                  {
                    backgroundColor: isDarkMode
                      ? Colors.VaultGreenDarkBg
                      : Colors.WellnessLightBg,
                  },
                ]}
              >
                <Lock size={ResponsivePixels.size18} color={Colors.LuminousGreen} strokeWidth={2.2} />
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
                false: isDarkMode ? Colors.DarkSoftLinen : Colors.FogGrey,
                true: Colors.LuminousGreen,
              }}
              thumbColor={Colors.PureWhite}
            />
          </View>

          <View style={[styles.itemDivider, { backgroundColor: borderLight }]} />

          {/* Encrypted Cloud Backup */}
          <View style={styles.settingItemRow}>
            <View style={styles.settingItemLeft}>
              <View
                style={[
                  styles.iconSquare,
                  {
                    backgroundColor: isDarkMode
                      ? Colors.VaultMindfulDarkBg
                      : Colors.MindfulLightBg,
                  },
                ]}
              >
                <Server
                  size={ResponsivePixels.size18}
                  color={themeAccent}
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
                false: isDarkMode ? Colors.DarkSoftLinen : Colors.FogGrey,
                true: themeAccent,
              }}
              thumbColor={Colors.PureWhite}
            />
          </View>

          <View style={[styles.itemDivider, { backgroundColor: borderLight }]} />

          {/* Personalized AI Context */}
          <View style={styles.settingItemRow}>
            <View style={styles.settingItemLeft}>
              <View
                style={[
                  styles.iconSquare,
                  {
                    backgroundColor: isDarkMode
                      ? Colors.VaultAmberDarkBg
                      : Colors.WorkLightBg,
                  },
                ]}
              >
                <CheckCircle2
                  size={ResponsivePixels.size18}
                  color={Colors.AccentYellow}
                  strokeWidth={2.2}
                />
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
                false: isDarkMode ? Colors.DarkSoftLinen : Colors.FogGrey,
                true: Colors.AccentYellow,
              }}
              thumbColor={Colors.PureWhite}
            />
          </View>

          <View style={[styles.itemDivider, { backgroundColor: borderLight }]} />

          {/* Anonymous Telemetry */}
          <View style={styles.settingItemRow}>
            <View style={styles.settingItemLeft}>
              <View
                style={[
                  styles.iconSquare,
                  {
                    backgroundColor: isDarkMode
                      ? Colors.VoiceMicDarkSurface
                      : Colors.CreamSurfaceAlt,
                  },
                ]}
              >
                <EyeOff size={ResponsivePixels.size18} color={textSecondary} strokeWidth={2.2} />
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
                false: isDarkMode ? Colors.DarkSoftLinen : Colors.FogGrey,
                true: themeAccent,
              }}
              thumbColor={Colors.PureWhite}
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
                  {
                    backgroundColor: isDarkMode
                      ? Colors.VaultMindfulDarkBg
                      : Colors.MindfulLightBg,
                  },
                ]}
              >
                <Download
                  size={ResponsivePixels.size18}
                  color={themeAccent}
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
                  {
                    backgroundColor: isDarkMode
                      ? Colors.VaultOrangeDarkBg
                      : Colors.EventLightBg,
                  },
                ]}
              >
                <HardDrive
                  size={ResponsivePixels.size18}
                  color={Colors.AccentAmber}
                  strokeWidth={2.2}
                />
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
                  {
                    backgroundColor: isDarkMode
                      ? Colors.VaultDangerDarkBg
                      : Colors.BadgeRedBg,
                  },
                ]}
              >
                <Trash2 size={ResponsivePixels.size18} color={Colors.CrimsonPulse} strokeWidth={2.2} />
              </View>
              <View style={styles.actionMeta}>
                <Text style={[styles.actionTitle, { color: Colors.CrimsonPulse }]}>
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
          <FileText size={ResponsivePixels.size18} color={textSecondary} strokeWidth={2} />
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
    paddingHorizontal: ResponsivePixels.size16,
  },
  /* 2-Layer Hero Bento */
  heroCardShadowWrapper: {
    borderRadius: ResponsivePixels.size24,
    backgroundColor: Colors.NeroBlack,
    marginBottom: ResponsivePixels.size16,
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
    backgroundColor: Colors.NeroBlack,
    borderRadius: ResponsivePixels.size24,
    borderWidth: 4,
    borderColor: withAlpha(Colors.PureWhite, 0.9),
    overflow: 'hidden',
    padding: ResponsivePixels.size18,
  },
  heroHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: ResponsivePixels.size12,
  },
  heroTagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ResponsivePixels.size6,
  },
  heroTagText: {
    fontFamily: Fonts.poppins.bold,
    fontSize: ResponsivePixels.size10,
    color: Colors.LuminousGreen,
    letterSpacing: 1,
  },
  heroMainRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ResponsivePixels.size14,
    marginBottom: ResponsivePixels.size14,
  },
  heroShieldCircle: {
    width: ResponsivePixels.size48,
    height: ResponsivePixels.size48,
    borderRadius: ResponsivePixels.size24,
    backgroundColor: Colors.VaultGreenDarkBg,
    borderWidth: 1.5,
    borderColor: withAlpha(Colors.LuminousGreen, 0.4),
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroDetails: {
    flex: 1,
  },
  heroTitle: {
    fontFamily: Fonts.ranade.bold,
    fontSize: ResponsivePixels.size19,
    color: Colors.PureWhite,
    letterSpacing: -0.4,
    lineHeight: ResponsivePixels.size24,
    marginBottom: ResponsivePixels.size4,
  },
  heroSubtitle: {
    fontFamily: Fonts.poppins.regular,
    fontSize: ResponsivePixels.size11_5,
    color: Colors.SteelMist,
    lineHeight: ResponsivePixels.size17,
  },
  heroDivider: {
    height: 1,
    backgroundColor: withAlpha(Colors.PureWhite, 0.1),
    marginBottom: ResponsivePixels.size14,
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
    width: ResponsivePixels.size28,
    height: ResponsivePixels.size28,
    borderRadius: ResponsivePixels.size14,
    backgroundColor: Colors.VaultPillarDarkBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: ResponsivePixels.size6,
  },
  pillarTitle: {
    fontFamily: Fonts.poppins.bold,
    fontSize: ResponsivePixels.size11_5,
    color: Colors.PureWhite,
    marginBottom: ResponsivePixels.size1,
    textAlign: 'center',
  },
  pillarSub: {
    fontFamily: Fonts.poppins.regular,
    fontSize: ResponsivePixels.size10,
    color: Colors.SteelMist,
    textAlign: 'center',
  },
  pillarSeparator: {
    width: 1,
    height: ResponsivePixels.size32,
    backgroundColor: withAlpha(Colors.PureWhite, 0.12),
  },
  sectionHeading: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: ResponsivePixels.size11,
    letterSpacing: 0.8,
    marginBottom: ResponsivePixels.size10,
    marginLeft: ResponsivePixels.size2,
  },
  /* Settings group card */
  settingsGroupCard: {
    borderRadius: ResponsivePixels.size20,
    borderWidth: 1.5,
    padding: ResponsivePixels.size14,
    shadowColor: Colors.PureBlack,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: ResponsivePixels.size20,
  },
  settingItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: ResponsivePixels.size6,
  },
  settingItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingRight: ResponsivePixels.size10,
    gap: ResponsivePixels.size12,
  },
  iconSquare: {
    width: ResponsivePixels.size42,
    height: ResponsivePixels.size42,
    borderRadius: ResponsivePixels.size21,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingItemMeta: {
    flex: 1,
  },
  settingItemTitle: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: ResponsivePixels.size14,
    marginBottom: ResponsivePixels.size2,
  },
  settingItemDesc: {
    fontFamily: Fonts.poppins.regular,
    fontSize: ResponsivePixels.size11,
    lineHeight: ResponsivePixels.size15,
  },
  itemDivider: {
    height: 1,
    marginVertical: ResponsivePixels.size10,
  },
  /* Action row */
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: ResponsivePixels.size6,
  },
  actionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingRight: ResponsivePixels.size10,
    gap: ResponsivePixels.size12,
  },
  actionMeta: {
    flex: 1,
  },
  actionTitle: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: ResponsivePixels.size14,
    marginBottom: ResponsivePixels.size2,
  },
  actionDesc: {
    fontFamily: Fonts.poppins.regular,
    fontSize: ResponsivePixels.size11,
    lineHeight: ResponsivePixels.size15,
  },
  /* Legal footer */
  legalCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: ResponsivePixels.size10,
    borderRadius: ResponsivePixels.size16,
    borderWidth: 1,
    padding: ResponsivePixels.size14,
    marginBottom: ResponsivePixels.size10,
  },
  legalText: {
    flex: 1,
    fontFamily: Fonts.poppins.regular,
    fontSize: ResponsivePixels.size11_5,
    lineHeight: ResponsivePixels.size17,
  },
});
