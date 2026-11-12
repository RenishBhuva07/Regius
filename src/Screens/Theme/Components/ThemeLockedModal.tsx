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
import { Colors, withAlpha } from '../../../Assets/StyleUtilities/Colors';
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

    const cardBg = isDarkMode ? Colors.DarkCardBackground : Colors.PureWhite;
    const textPrimary = isDarkMode ? Colors.PureWhite : Colors.PureBlack;
    const textSecondary = isDarkMode ? Colors.SteelMist : Colors.SubtitleGray;
    const borderLight = isDarkMode ? Colors.CarbonSlate : Colors.RingBorder;
    const surfaceAlt = isDarkMode
      ? Colors.DarkSurfaceAlt
      : Colors.CreamSurfaceAlt;

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
                  ? withAlpha(Colors.PureWhite, 0.15)
                  : Colors.PureWhite,
              },
            ]}
          >
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <View style={styles.modalIconWrap}>
                <Trophy
                  size={ResponsivePixels.size20}
                  color={Colors.AccentYellow}
                  strokeWidth={2.2}
                />
              </View>
              <TouchableOpacity
                activeOpacity={0.7}
                style={styles.modalCloseBtn}
                onPress={onClose}
                accessibilityRole="button"
                accessibilityLabel="Close theme requirements modal"
              >
                <X size={ResponsivePixels.size18} color={textSecondary} strokeWidth={2.2} />
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
                          ? withAlpha(Colors.PureBlack, 0.18)
                          : withAlpha(Colors.PureWhite, 0.3),
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
                  size={ResponsivePixels.size18}
                  color={Colors.MidnightCharcoal}
                  fill={Colors.AccentYellow}
                  strokeWidth={2.4}
                />
                <Text style={styles.royalUpgradeBtnText}>
                  Unlock Instantly with Royal 👑
                </Text>
              </TouchableOpacity>

              <View style={{ height: ResponsivePixels.size10 }} />

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
    backgroundColor: withAlpha(Colors.PureBlack, 0.65),
    justifyContent: 'center',
    alignItems: 'center',
    padding: ResponsivePixels.size20,
  },
  modalCard: {
    width: '100%',
    maxWidth: ResponsivePixels.size380,
    borderRadius: ResponsivePixels.size24,
    borderWidth: 1.5,
    padding: ResponsivePixels.size20,
    shadowColor: Colors.PureBlack,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.35,
    shadowRadius: 18,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: ResponsivePixels.size12,
  },
  modalIconWrap: {
    width: ResponsivePixels.size40,
    height: ResponsivePixels.size40,
    borderRadius: ResponsivePixels.size20,
    backgroundColor: withAlpha(Colors.AccentYellow, 0.15),
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCloseBtn: {
    width: ResponsivePixels.size32,
    height: ResponsivePixels.size32,
    borderRadius: ResponsivePixels.size16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalTitle: {
    fontFamily: Fonts.ranade.bold,
    fontSize: ResponsivePixels.size20,
    marginBottom: ResponsivePixels.size4,
  },
  modalDesc: {
    ...Typography.bodySmallPoppinsRegular,
    fontSize: ResponsivePixels.size12,
    marginBottom: ResponsivePixels.size14,
  },
  modalColorsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: ResponsivePixels.size10,
    borderRadius: ResponsivePixels.size14,
    borderWidth: 1,
    marginBottom: ResponsivePixels.size14,
  },
  modalColorCol: {
    alignItems: 'center',
    flex: 1,
    gap: ResponsivePixels.size3,
  },
  modalColorCircle: {
    width: ResponsivePixels.size28,
    height: ResponsivePixels.size28,
    borderRadius: ResponsivePixels.size14,
    borderWidth: 1,
    borderColor: withAlpha(Colors.PureWhite, 0.3),
  },
  modalColorCode: {
    fontFamily: Fonts.poppins.bold,
    fontSize: ResponsivePixels.size9_5,
  },
  modalColorLabel: {
    fontFamily: Fonts.poppins.regular,
    fontSize: ResponsivePixels.size8_5,
  },
  modalProgressBox: {
    borderRadius: ResponsivePixels.size14,
    borderWidth: 1,
    padding: ResponsivePixels.size12,
    marginBottom: ResponsivePixels.size16,
  },
  modalReqRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ResponsivePixels.size8,
    marginBottom: ResponsivePixels.size8,
  },
  modalReqTitle: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: ResponsivePixels.size13,
  },
  modalXpProgressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: ResponsivePixels.size6,
  },
  modalXpLabel: {
    fontFamily: Fonts.poppins.medium,
    fontSize: ResponsivePixels.size11,
  },
  modalProgressBarBg: {
    height: ResponsivePixels.size6,
    borderRadius: ResponsivePixels.size3,
    backgroundColor: withAlpha(Colors.PureBlack, 0.15),
    overflow: 'hidden',
    marginBottom: ResponsivePixels.size8,
  },
  modalProgressBarFill: {
    height: '100%',
    borderRadius: ResponsivePixels.size3,
    backgroundColor: Colors.AccentYellow,
  },
  modalHintText: {
    fontFamily: Fonts.poppins.regular,
    fontSize: ResponsivePixels.size10_5,
    lineHeight: ResponsivePixels.size14,
  },
  modalActions: {
    marginTop: ResponsivePixels.size4,
  },
  royalUpgradeBtn: {
    backgroundColor: Colors.AccentYellow,
    borderRadius: ResponsivePixels.size28,
    paddingVertical: ResponsivePixels.size14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: ResponsivePixels.size8,
    borderBottomWidth: 3,
    borderBottomColor: Colors.HabitBurnishedAmber,
    ...Platform.select({
      ios: {
        shadowColor: Colors.AccentYellow,
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
    fontSize: ResponsivePixels.size14,
    color: Colors.MidnightCharcoal,
  },
});

export default ThemeLockedModal;
