import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
} from 'react-native';
import { ShieldCheck, X, FileText, Lock } from 'lucide-react-native';
import { Typography } from '../../../Theme/Typographys';
import { Colors } from '../../../Assets/StyleUtilities/Colors';
import ResponsivePixels from '../../../Assets/StyleUtilities/ResponsivePixels';
import { Fonts } from '../../../Theme/fonts';
import { Badge } from '../../../Common/Badge';

interface TermsPrivacyModalProps {
  visible: boolean;
  initialTab?: 'terms' | 'privacy';
  onClose: () => void;
  isDarkMode?: boolean;
}

export const TermsPrivacyModal: React.FC<TermsPrivacyModalProps> = ({
  visible,
  initialTab = 'terms',
  onClose,
  isDarkMode = false,
}) => {
  const [activeTab, setActiveTab] = useState<'terms' | 'privacy'>(initialTab);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab, visible]);

  const cardBg = isDarkMode ? '#1E2228' : Colors.DefaultWhite;
  const textPrimary = isDarkMode
    ? Colors.PureWhiteText
    : Colors.MidnightInkText;
  const textSecondary = isDarkMode ? '#A3A8B1' : Colors.SubtitleGray;
  const borderLight = isDarkMode ? '#2C3035' : Colors.RingBorder;
  const tabTrackBg = isDarkMode ? '#171A1F' : '#FAF5E4';
  const sectionCardBg = isDarkMode ? '#171A1F' : '#FAF8F5';

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <View
          style={[
            styles.card,
            { backgroundColor: cardBg, borderColor: borderLight },
          ]}
        >
          {/* Header Row */}
          <View style={styles.headerRow}>
            <View style={styles.badgeWrap}>
              <Badge variant="purple" label="MINDFUL COVENANT" size="sm" />
            </View>
            <TouchableOpacity
              activeOpacity={0.7}
              style={[
                styles.closeBtn,
                { backgroundColor: isDarkMode ? '#2C3035' : '#F2EFEB' },
              ]}
              onPress={onClose}
            >
              <X size={18} color={textSecondary} strokeWidth={2.4} />
            </TouchableOpacity>
          </View>

          <Text style={[styles.title, { color: textPrimary }]}>
            {activeTab === 'terms' ? 'Terms of Service' : 'Privacy Covenant'}
          </Text>

          {/* Segmented Switcher Pill */}
          <View
            style={[
              styles.switchContainer,
              { backgroundColor: tabTrackBg, borderColor: borderLight },
            ]}
          >
            <TouchableOpacity
              activeOpacity={0.8}
              style={[
                styles.switchTab,
                activeTab === 'terms' && [
                  styles.switchTabActive,
                  { backgroundColor: cardBg },
                ],
              ]}
              onPress={() => setActiveTab('terms')}
            >
              <FileText
                size={14}
                color={
                  activeTab === 'terms' ? Colors.LavenderPurple : textSecondary
                }
                style={{ marginRight: 6 }}
              />
              <Text
                style={[
                  styles.switchTabText,
                  {
                    color: activeTab === 'terms' ? textPrimary : textSecondary,
                    fontFamily:
                      activeTab === 'terms'
                        ? Fonts.poppins.semiBold
                        : Fonts.poppins.medium,
                  },
                ]}
              >
                Terms
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              style={[
                styles.switchTab,
                activeTab === 'privacy' && [
                  styles.switchTabActive,
                  { backgroundColor: cardBg },
                ],
              ]}
              onPress={() => setActiveTab('privacy')}
            >
              <Lock
                size={14}
                color={
                  activeTab === 'privacy'
                    ? Colors.LavenderPurple
                    : textSecondary
                }
                style={{ marginRight: 6 }}
              />
              <Text
                style={[
                  styles.switchTabText,
                  {
                    color:
                      activeTab === 'privacy' ? textPrimary : textSecondary,
                    fontFamily:
                      activeTab === 'privacy'
                        ? Fonts.poppins.semiBold
                        : Fonts.poppins.medium,
                  },
                ]}
              >
                Privacy
              </Text>
            </TouchableOpacity>
          </View>

          {/* Scrollable Content */}
          <ScrollView
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
          >
            {activeTab === 'terms' ? (
              <View style={styles.contentWrap}>
                <View
                  style={[
                    styles.pillarCard,
                    {
                      backgroundColor: sectionCardBg,
                      borderColor: borderLight,
                    },
                  ]}
                >
                  <Text style={[styles.pillarTitle, { color: textPrimary }]}>
                    1. Mindful Luxury Standard
                  </Text>
                  <Text style={[styles.pillarBody, { color: textSecondary }]}>
                    Regius provides artisanal productivity software designed to
                    honor your calm, focus, and intentional schedule. We reserve
                    all rights to the unique brand identity and design system.
                  </Text>
                </View>

                <View
                  style={[
                    styles.pillarCard,
                    {
                      backgroundColor: sectionCardBg,
                      borderColor: borderLight,
                    },
                  ]}
                >
                  <Text style={[styles.pillarTitle, { color: textPrimary }]}>
                    2. Fair Personal Usage
                  </Text>
                  <Text style={[styles.pillarBody, { color: textSecondary }]}>
                    Your Regius account is personal. Speech models, task
                    management, and reminder engines are licensed for
                    single-user daily organization and mindful execution.
                  </Text>
                </View>

                <View
                  style={[
                    styles.pillarCard,
                    {
                      backgroundColor: sectionCardBg,
                      borderColor: borderLight,
                    },
                  ]}
                >
                  <Text style={[styles.pillarTitle, { color: textPrimary }]}>
                    3. Continuous Evolution
                  </Text>
                  <Text style={[styles.pillarBody, { color: textSecondary }]}>
                    We regularly refine neural voice models, tactile haptics,
                    and intelligent schedules to elevate your executive flow.
                  </Text>
                </View>
              </View>
            ) : (
              <View style={styles.contentWrap}>
                <View
                  style={[
                    styles.pillarCard,
                    {
                      backgroundColor: sectionCardBg,
                      borderColor: borderLight,
                    },
                  ]}
                >
                  <View style={styles.pillarHeaderRow}>
                    <ShieldCheck
                      size={18}
                      color={Colors.AccentGreen}
                      style={{ marginRight: 6 }}
                    />
                    <Text style={[styles.pillarTitle, { color: textPrimary }]}>
                      Zero Data Selling
                    </Text>
                  </View>
                  <Text style={[styles.pillarBody, { color: textSecondary }]}>
                    Your tasks, habits, voice notes, and schedules are strictly
                    yours. Regius will never sell, monetize, or broker personal
                    workflow information to third-party ad networks.
                  </Text>
                </View>

                <View
                  style={[
                    styles.pillarCard,
                    {
                      backgroundColor: sectionCardBg,
                      borderColor: borderLight,
                    },
                  ]}
                >
                  <Text style={[styles.pillarTitle, { color: textPrimary }]}>
                    Local Storage Encryption
                  </Text>
                  <Text style={[styles.pillarBody, { color: textSecondary }]}>
                    All tasks, habit streaks, and reminders are stored with
                    secure on-device storage. Offline operation is fully
                    supported for total uninterrupted privacy.
                  </Text>
                </View>

                <View
                  style={[
                    styles.pillarCard,
                    {
                      backgroundColor: sectionCardBg,
                      borderColor: borderLight,
                    },
                  ]}
                >
                  <Text style={[styles.pillarTitle, { color: textPrimary }]}>
                    Voice Audio Hygiene
                  </Text>
                  <Text style={[styles.pillarBody, { color: textSecondary }]}>
                    Microphone capture operates strictly in session-isolated
                    states and halts immediately upon speech completion. Raw
                    audio is never persisted without user consent.
                  </Text>
                </View>
              </View>
            )}
          </ScrollView>

          {/* Dismiss CTA */}
          <TouchableOpacity
            activeOpacity={0.85}
            style={[
              styles.primaryBtn,
              {
                backgroundColor: isDarkMode
                  ? Colors.PureWhiteText
                  : Colors.MidnightCharcoal,
              },
            ]}
            onPress={onClose}
          >
            <Text
              style={[
                styles.primaryBtnText,
                {
                  color: isDarkMode
                    ? Colors.MidnightInkText
                    : Colors.PureWhiteText,
                },
              ]}
            >
              I Understand
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: ResponsivePixels.size24,
  },
  card: {
    width: '100%',
    maxHeight: '82%',
    borderRadius: ResponsivePixels.size28,
    borderWidth: 1.5,
    padding: ResponsivePixels.size24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.18,
    shadowRadius: 20,
    elevation: 8,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: ResponsivePixels.size12,
  },
  badgeWrap: {
    alignSelf: 'flex-start',
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    ...Typography.h6Bold,
    fontSize: 22,
    marginBottom: ResponsivePixels.size14,
  },
  switchContainer: {
    flexDirection: 'row',
    width: '100%',
    height: 42,
    borderRadius: ResponsivePixels.size22,
    borderWidth: 1.2,
    padding: 3,
    marginBottom: ResponsivePixels.size16,
  },
  switchTab: {
    flex: 1,
    flexDirection: 'row',
    borderRadius: ResponsivePixels.size18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  switchTabActive: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 5,
    elevation: 2,
  },
  switchTabText: {
    fontSize: 12.5,
  },
  scrollView: {
    marginBottom: ResponsivePixels.size18,
  },
  contentWrap: {
    gap: ResponsivePixels.size12,
  },
  pillarCard: {
    borderRadius: ResponsivePixels.size16,
    borderWidth: 1.2,
    padding: ResponsivePixels.size14,
  },
  pillarHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: ResponsivePixels.size4,
  },
  pillarTitle: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: 13.5,
    marginBottom: ResponsivePixels.size4,
  },
  pillarBody: {
    fontFamily: Fonts.poppins.regular,
    fontSize: 12,
    lineHeight: 18,
  },
  primaryBtn: {
    width: '100%',
    height: 48,
    borderRadius: ResponsivePixels.size24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryBtnText: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: 14.5,
  },
});

export default TermsPrivacyModal;
