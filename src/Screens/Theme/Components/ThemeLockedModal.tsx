import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Platform,
} from 'react-native';
import { Trophy, X, Crown } from 'lucide-react-native';

import { Fonts } from '../../../Theme/fonts';
import { Typography } from '../../../Theme/Typographys';
import { Colors } from '../../../Assets/StyleUtilities/Colors';
import ResponsivePixels from '../../../Assets/StyleUtilities/ResponsivePixels';
import { Badge } from '../../../Common/Badge';
import CustomButton from '../../../Common/CustomButton';
import { ThemeOption, isLightColor } from '../../../Theme/ThemeContext';
import { MilestoneTier } from '../../../Context/MilestoneContext';

export interface ThemeLockedModalProps {
  visible: boolean;
  theme: ThemeOption | null;
  allTiers: MilestoneTier[];
  totalXp: number;
  isDarkMode: boolean;
  onClose: () => void;
  onUpgradeRoyal: () => void;
  onOpenMilestones: () => void;
}

export const ThemeLockedModal: React.FC<ThemeLockedModalProps> = React.memo(
  ({
    visible,
    theme,
    allTiers,
    totalXp,
    isDarkMode,
    onClose,
    onUpgradeRoyal,
    onOpenMilestones,
  }) => {
    if (!theme) return null;

    const cardBg = isDarkMode ? '#1E2228' : Colors.DefaultWhite;
    const textPrimary = isDarkMode
      ? Colors.PureWhiteText
      : Colors.MidnightInkText;
    const textSecondary = isDarkMode ? '#A3A8B1' : Colors.SubtitleGray;
    const borderLight = isDarkMode ? '#2C3035' : '#E8E2D5';
    const surfaceAlt = isDarkMode ? '#171A1F' : '#FAF8F5';

    const reqTier = allTiers.find(t => t.level === theme.requiredTierLevel);
    const minXp = reqTier?.minXp || 1;
    const progressPercent = Math.min(100, Math.round((totalXp / minXp) * 100));

    return (
      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={onClose}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalCard,
              {
                backgroundColor: cardBg,
                borderColor: isDarkMode
                  ? 'rgba(255, 255, 255, 0.15)'
                  : '#FFFFFF',
              },
            ]}
          >
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <View style={styles.modalIconWrap}>
                <Trophy size={20} color="#F5C518" strokeWidth={2.2} />
              </View>
              <TouchableOpacity
                activeOpacity={0.7}
                style={styles.modalCloseBtn}
                onPress={onClose}
                accessibilityRole="button"
                accessibilityLabel="Close theme requirements modal"
              >
                <X size={18} color={textSecondary} strokeWidth={2.2} />
              </TouchableOpacity>
            </View>

            <Text style={[styles.modalTitle, { color: textPrimary }]}>
              {theme.name}
            </Text>
            <Text style={[styles.modalDesc, { color: textSecondary }]}>
              {theme.tagline}
            </Text>

            {/* 4 Color Swatches in Modal */}
            <View
              style={[
                styles.modalColorsRow,
                {
                  backgroundColor: surfaceAlt,
                  borderColor: borderLight,
                },
              ]}
            >
              {theme.palette.map((col, idx) => (
                <View key={idx} style={styles.modalColorCol}>
                  <View
                    style={[
                      styles.modalColorCircle,
                      {
                        backgroundColor: col.hex,
                        borderColor: isLightColor(col.hex)
                          ? 'rgba(0, 0, 0, 0.18)'
                          : 'rgba(255, 255, 255, 0.3)',
                      },
                    ]}
                  />
                  <Text style={[styles.modalColorCode, { color: textPrimary }]}>
                    {col.hex}
                  </Text>
                  <Text
                    style={[styles.modalColorLabel, { color: textSecondary }]}
                  >
                    {col.label}
                  </Text>
                </View>
              ))}
            </View>

            {/* Milestone Progress Info Box */}
            <View
              style={[
                styles.modalProgressBox,
                {
                  backgroundColor: surfaceAlt,
                  borderColor: borderLight,
                },
              ]}
            >
              <View style={styles.modalReqRow}>
                <Badge
                  label={`TIER ${theme.requiredTierLevel}`}
                  variant="yellow"
                  size="sm"
                />
                <Text style={[styles.modalReqTitle, { color: textPrimary }]}>
                  {reqTier?.title || 'Advanced Tier'}
                </Text>
              </View>

              <View style={styles.modalXpProgressRow}>
                <Text style={[styles.modalXpLabel, { color: textSecondary }]}>
                  Total XP: {totalXp} XP
                </Text>
                <Text style={[styles.modalXpLabel, { color: textSecondary }]}>
                  Req: {minXp} XP
                </Text>
              </View>

              <View style={styles.modalProgressBarBg}>
                <View
                  style={[
                    styles.modalProgressBarFill,
                    { width: `${progressPercent}%` },
                  ]}
                />
              </View>

              <Text style={[styles.modalHintText, { color: textSecondary }]}>
                Earn XP by completing tasks (+15 XP), reminders (+10 XP), and
                keeping habit streaks!
              </Text>
            </View>

            {/* Modal CTA Buttons */}
            <View style={styles.modalActions}>
              <TouchableOpacity
                activeOpacity={0.88}
                style={styles.royalUpgradeBtn}
                onPress={onUpgradeRoyal}
                accessibilityRole="button"
                accessibilityLabel="Unlock with Regius Royal"
              >
                <Crown
                  size={18}
                  color="#1F2228"
                  fill="#F5C518"
                  strokeWidth={2.4}
                />
                <Text style={styles.royalUpgradeBtnText}>
                  Unlock Instantly with Royal 👑
                </Text>
              </TouchableOpacity>

              <View style={{ height: 10 }} />

              <CustomButton
                title="View Milestone Journey"
                onPress={onOpenMilestones}
                variant="outlined"
              />
            </View>
          </View>
        </View>
      </Modal>
    );
  },
);

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    width: '100%',
    maxWidth: 380,
    borderRadius: 24,
    borderWidth: 1.5,
    padding: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.35,
    shadowRadius: 18,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  modalIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(245, 197, 24, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCloseBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalTitle: {
    fontFamily: Fonts.ranade.bold,
    fontSize: 20,
    marginBottom: 4,
  },
  modalDesc: {
    ...Typography.bodySmallPoppinsRegular,
    fontSize: 12,
    marginBottom: 14,
  },
  modalColorsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 14,
  },
  modalColorCol: {
    alignItems: 'center',
    flex: 1,
    gap: 3,
  },
  modalColorCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  modalColorCode: {
    fontFamily: Fonts.poppins.bold,
    fontSize: 9.5,
  },
  modalColorLabel: {
    fontFamily: Fonts.poppins.regular,
    fontSize: 8.5,
  },
  modalProgressBox: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 12,
    marginBottom: 16,
  },
  modalReqRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  modalReqTitle: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: 13,
  },
  modalXpProgressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  modalXpLabel: {
    fontFamily: Fonts.poppins.medium,
    fontSize: 11,
  },
  modalProgressBarBg: {
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
    overflow: 'hidden',
    marginBottom: 8,
  },
  modalProgressBarFill: {
    height: '100%',
    borderRadius: 3,
    backgroundColor: '#F5C518',
  },
  modalHintText: {
    fontFamily: Fonts.poppins.regular,
    fontSize: 10.5,
    lineHeight: 14,
  },
  modalActions: {
    marginTop: 4,
  },
  royalUpgradeBtn: {
    backgroundColor: '#F5C518',
    borderRadius: 28,
    paddingVertical: ResponsivePixels.size14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderBottomWidth: 3,
    borderBottomColor: '#D97706',
    ...Platform.select({
      ios: {
        shadowColor: '#F5C518',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.35,
        shadowRadius: 6,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  royalUpgradeBtnText: {
    fontFamily: Fonts.poppins.bold,
    fontSize: 14,
    color: '#1F2228',
  },
});

export default ThemeLockedModal;
