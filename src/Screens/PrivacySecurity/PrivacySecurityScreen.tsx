import React, { useState } from 'react';
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
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import {
  ChevronLeft,
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
} from 'lucide-react-native';
import Toast from 'react-native-toast-message';

import { Typography } from '../../Theme/Typographys';
import { Fonts } from '../../Theme/fonts';
import { Colors } from '../../Assets/StyleUtilities/Colors';
import ResponsivePixels from '../../Assets/StyleUtilities/ResponsivePixels';
import { Badge } from '../../Common/Badge';
import { ProBadge } from '../../Common/ProBadge';
import { useTheme } from '../../Theme/ThemeContext';
import { VoiceSettingsService } from '../../Services/VoiceSettingsService';

export const PrivacySecurityScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const { isDarkMode } = useTheme();

  const [onDeviceSpeech, setOnDeviceSpeech] = useState(true);
  const [cloudSync, setCloudSync] = useState(true);
  const [anonymousTelemetry, setAnonymousTelemetry] = useState(false);
  const [personalizedContext, setPersonalizedContext] = useState(true);

  const handleExportData = () => {
    Toast.show({
      type: 'success',
      text1: 'Archive Generated',
      text2: 'Encrypted backup ready for export.',
    });
  };

  const handleClearCache = async () => {
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
            Privacy & Security
          </Text>
          <Text style={[styles.headerSubtitle, { color: textSecondary }]}>
            End-to-End Encryption & Ethics
          </Text>
        </View>

        <Badge label="ENCRYPTED" variant="green" size="sm" />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 40 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Security Overview Bento */}
        <View
          style={[
            styles.heroSecurityCard,
            {
              backgroundColor: cardBg,
              borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.12)' : '#FFFFFF',
              borderBottomColor: isDarkMode ? '#171A20' : '#E2DCD0',
              shadowColor: isDarkMode ? '#000000' : 'rgba(131, 131, 214, 0.14)',
            },
          ]}
        >
          <View style={styles.heroTopRow}>
            <View
              style={[
                styles.heroShieldIcon,
                { backgroundColor: isDarkMode ? '#1A2922' : '#EDFDF5' },
              ]}
            >
              <Shield size={24} color="#21AF85" strokeWidth={2.4} />
            </View>
            <View style={styles.heroMeta}>
              <Text style={[styles.heroTitle, { color: textPrimary }]}>
                Regius Zero-Compromise Security
              </Text>
              <Text style={[styles.heroSubtitle, { color: textSecondary }]}>
                Your productivity data, voice commands, and personal notes are
                private by design.
              </Text>
            </View>
          </View>

          <View style={[styles.divider, { backgroundColor: borderLight }]} />

          <View style={styles.badgesTripleRow}>
            <View style={styles.badgeCol}>
              <Key size={14} color="#21AF85" strokeWidth={2.2} />
              <Text style={[styles.badgeColLabel, { color: textPrimary }]}>
                AES-256 Bit
              </Text>
            </View>
            <View
              style={[styles.vertDivider, { backgroundColor: borderLight }]}
            />
            <View style={styles.badgeCol}>
              <EyeOff
                size={14}
                color={Colors.LavenderPurple}
                strokeWidth={2.2}
              />
              <Text style={[styles.badgeColLabel, { color: textPrimary }]}>
                Zero Ad Tracking
              </Text>
            </View>
            <View
              style={[styles.vertDivider, { backgroundColor: borderLight }]}
            />
            <View style={styles.badgeCol}>
              <Lock size={14} color="#F5C518" strokeWidth={2.2} />
              <Text style={[styles.badgeColLabel, { color: textPrimary }]}>
                On-Device Speech
              </Text>
            </View>
          </View>
        </View>

        {/* Granular Privacy Toggles */}
        <Text style={[styles.sectionHeading, { color: textSecondary }]}>
          DATA HANDLING & PRIVACY PREFERENCES
        </Text>

        <View
          style={[
            styles.settingsGroupCard,
            {
              backgroundColor: cardBg,
              borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.12)' : '#FFFFFF',
              borderBottomColor: isDarkMode ? '#171A20' : '#E2DCD0',
              shadowColor: isDarkMode ? '#000000' : 'rgba(131, 131, 214, 0.14)',
            },
          ]}
        >
          {/* On-Device Speech */}
          <View style={styles.settingItemRow}>
            <View style={styles.settingItemLeft}>
              <View
                style={[
                  styles.iconSquare,
                  { backgroundColor: isDarkMode ? '#2C3035' : '#EDFDF5' },
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
                  Process wake word & transcripts on phone hardware
                </Text>
              </View>
            </View>
            <Switch
              value={onDeviceSpeech}
              onValueChange={setOnDeviceSpeech}
              trackColor={{ false: '#D9D9D9', true: '#21AF85' }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View
            style={[styles.itemDivider, { backgroundColor: borderLight }]}
          />

          {/* Cloud Sync */}
          <View style={styles.settingItemRow}>
            <View style={styles.settingItemLeft}>
              <View
                style={[
                  styles.iconSquare,
                  { backgroundColor: isDarkMode ? '#2C3035' : '#EFF2FE' },
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
                  Sync items across devices with client-side keys
                </Text>
              </View>
            </View>
            <Switch
              value={cloudSync}
              onValueChange={setCloudSync}
              trackColor={{
                false: '#D9D9D9',
                true: Colors.LavenderPurple,
              }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View
            style={[styles.itemDivider, { backgroundColor: borderLight }]}
          />

          {/* Personalized Learning */}
          <View style={styles.settingItemRow}>
            <View style={styles.settingItemLeft}>
              <View
                style={[
                  styles.iconSquare,
                  { backgroundColor: isDarkMode ? '#2C3035' : '#FFFCEB' },
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
              onValueChange={setPersonalizedContext}
              trackColor={{ false: '#D9D9D9', true: '#F5C518' }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View
            style={[styles.itemDivider, { backgroundColor: borderLight }]}
          />

          {/* Anonymous Telemetry */}
          <View style={styles.settingItemRow}>
            <View style={styles.settingItemLeft}>
              <View
                style={[
                  styles.iconSquare,
                  { backgroundColor: isDarkMode ? '#2C3035' : '#FAF8F5' },
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
              onValueChange={setAnonymousTelemetry}
              trackColor={{
                false: '#D9D9D9',
                true: Colors.LavenderPurple,
              }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        {/* Data Governance & Export */}
        <Text style={[styles.sectionHeading, { color: textSecondary }]}>
          DATA GOVERNANCE & SOVEREIGNTY
        </Text>

        <View
          style={[
            styles.settingsGroupCard,
            {
              backgroundColor: cardBg,
              borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.12)' : '#FFFFFF',
              borderBottomColor: isDarkMode ? '#171A20' : '#E2DCD0',
              shadowColor: isDarkMode ? '#000000' : 'rgba(131, 131, 214, 0.14)',
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
                  { backgroundColor: isDarkMode ? '#2C3035' : '#EFF2FE' },
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

          <View
            style={[styles.itemDivider, { backgroundColor: borderLight }]}
          />

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
                  { backgroundColor: isDarkMode ? '#2C3035' : '#FFF0F0' },
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

          <View
            style={[styles.itemDivider, { backgroundColor: borderLight }]}
          />

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
                  { backgroundColor: isDarkMode ? '#2C3035' : '#FFF0F0' },
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

        {/* Legal & Compliance Footer Card */}
        <View
          style={[
            styles.legalCard,
            {
              backgroundColor: surfaceAlt,
              borderColor: borderLight,
            },
          ]}
        >
          <FileText size={16} color={textSecondary} strokeWidth={2} />
          <Text style={[styles.legalText, { color: textSecondary }]}>
            Regius is compliant with GDPR, CCPA, and Apple App Store Privacy
            Guidelines. We do not sell your personal data or store unencrypted
            voice recordings.
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
  heroSecurityCard: {
    borderRadius: 20,
    borderWidth: 1,
    borderBottomWidth: 3,
    padding: ResponsivePixels.size16,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
    marginBottom: ResponsivePixels.size20,
  },
  heroTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  heroShieldIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroMeta: {
    flex: 1,
  },
  heroTitle: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: 15,
    marginBottom: 4,
  },
  heroSubtitle: {
    ...Typography.bodySuperSmallPoppinsRegularLoose,
    fontSize: 11,
    lineHeight: 16,
  },
  divider: {
    height: 1,
    marginVertical: ResponsivePixels.size14,
  },
  badgesTripleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  badgeCol: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  badgeColLabel: {
    fontFamily: Fonts.poppins.medium,
    fontSize: 11,
  },
  vertDivider: {
    width: 1,
    height: 18,
  },
  sectionHeading: {
    ...Typography.bodySuperSmallPoppinsRegularLoose,
    fontFamily: Fonts.poppins.semiBold,
    fontSize: 11,
    letterSpacing: 1,
    marginBottom: ResponsivePixels.size8,
    marginLeft: 4,
  },
  settingsGroupCard: {
    borderRadius: 20,
    borderWidth: 1,
    borderBottomWidth: 3,
    padding: ResponsivePixels.size14,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
    marginBottom: ResponsivePixels.size20,
  },
  settingItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: ResponsivePixels.size10,
  },
  settingItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingRight: 10,
    gap: 12,
  },
  iconSquare: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingItemMeta: {
    flex: 1,
  },
  settingItemTitle: {
    fontFamily: Fonts.poppins.medium,
    fontSize: 14,
    marginBottom: 2,
  },
  settingItemDesc: {
    ...Typography.bodySuperSmallPoppinsRegularLoose,
    fontSize: 11,
    lineHeight: 15,
  },
  itemDivider: {
    height: 1,
    marginVertical: 4,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: ResponsivePixels.size10,
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
    fontFamily: Fonts.poppins.medium,
    fontSize: 14,
    marginBottom: 2,
  },
  actionDesc: {
    ...Typography.bodySuperSmallPoppinsRegularLoose,
    fontSize: 11,
    lineHeight: 15,
  },
  legalCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    borderRadius: 14,
    borderWidth: 1,
    padding: ResponsivePixels.size14,
    marginBottom: ResponsivePixels.size24,
  },
  legalText: {
    ...Typography.bodySuperSmallPoppinsRegularLoose,
    fontSize: 11,
    lineHeight: 16,
    flex: 1,
  },
});
