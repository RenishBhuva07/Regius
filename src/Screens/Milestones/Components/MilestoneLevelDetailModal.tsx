import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  Dimensions,
  Vibration,
} from 'react-native';
import {
  X,
  Lock,
  Sparkles,
  Palette,
  CheckCircle2,
  Crown,
  ChevronRight,
} from 'lucide-react-native';
import Toast from 'react-native-toast-message';

import { Fonts } from '../../../Theme/fonts';
import { Colors as StaticColors } from '../../../Assets/StyleUtilities/Colors';
import ResponsivePixels from '../../../Assets/StyleUtilities/ResponsivePixels';
import { Badge } from '../../../Common/Badge';
import { MilestoneTier } from '../../../Services/Milestone/MilestoneService';
import { ThreeDStatusBadge } from './ThreeDStatusBadge';

const { width: screenWidth } = Dimensions.get('window');

interface MilestoneLevelDetailModalProps {
  tier: MilestoneTier | null;
  visible: boolean;
  onClose: () => void;
  totalXp: number;
  currentTierLevel: number;
  nextTier: MilestoneTier | null;
  tierProgress: number;
  currentInTier: number;
  requiredForTier: number;
  activeThemeId: string;
  onApplyTheme: (themeId: string, themeName: string) => void;
  isDarkMode: boolean;
}

export const MilestoneLevelDetailModal: React.FC<
  MilestoneLevelDetailModalProps
> = ({
  tier,
  visible,
  onClose,
  totalXp,
  currentTierLevel,
  nextTier,
  tierProgress,
  currentInTier,
  requiredForTier,
  activeThemeId,
  onApplyTheme,
  isDarkMode,
}) => {
  if (!tier) return null;

  const isCurrent = tier.level === currentTierLevel;
  const isUnlocked = currentTierLevel >= tier.level;
  const isNext = nextTier?.level === tier.level;

  const badgeState = isUnlocked
    ? 'unlocked'
    : isCurrent
    ? 'current'
    : isNext
    ? 'next_goal'
    : 'locked';

  const modalBg = isDarkMode ? '#1A1D24' : '#FFFFFF';
  const textPrimary = isDarkMode ? '#FFFFFF' : '#121417';
  const textSecondary = isDarkMode ? '#8E95A5' : '#6B7280';
  const cardBorder = isDarkMode ? 'rgba(255, 255, 255, 0.12)' : '#E8E2D5';
  const dividerColor = isDarkMode ? 'rgba(255, 255, 255, 0.08)' : '#ECE6DA';

  const xpRemaining = Math.max(0, tier.minXp - totalXp);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={styles.modalOverlay}>
        <TouchableOpacity
          style={StyleSheet.absoluteFill}
          activeOpacity={1}
          onPress={onClose}
        />

        <View style={styles.modalContentWrapper}>
          {/* 2-Layer Executive Bento Card Container */}
          <View style={styles.cardShadowWrapper}>
            <View
              style={[
                styles.modalCard,
                {
                  backgroundColor: modalBg,
                  borderColor: isCurrent
                    ? '#F5C518'
                    : isUnlocked
                    ? 'rgba(255, 255, 255, 0.9)'
                    : isDarkMode
                    ? 'rgba(255, 255, 255, 0.2)'
                    : '#E2DCD0',
                },
              ]}
            >
              {/* Top Accent Strip */}
              <View
                style={[
                  styles.topAccentStrip,
                  { backgroundColor: tier.accentColor || '#F5C518' },
                ]}
              />

              {/* Modal Header */}
              <View style={styles.headerRow}>
                <View style={styles.levelTokenRow}>
                  {/* 3D Cylindrical Level Disc */}
                  <View
                    style={[
                      styles.disc3D,
                      {
                        backgroundColor: isCurrent
                          ? '#F59E0B'
                          : isUnlocked
                          ? tier.accentColor || '#10B981'
                          : isDarkMode
                          ? '#2A303C'
                          : '#475569',
                        borderBottomColor: isCurrent
                          ? '#B45309'
                          : isUnlocked
                          ? '#065F46'
                          : '#1E293B',
                      },
                    ]}
                  >
                    <View style={styles.discGlossHighlight} />
                    {isCurrent ? (
                      <Crown size={20} color="#FFFFFF" strokeWidth={2.4} />
                    ) : isUnlocked ? (
                      <Text style={styles.discLevelText}>{tier.level}</Text>
                    ) : (
                      <Lock size={18} color="#CBD5E1" strokeWidth={2.4} />
                    )}
                  </View>

                  <View style={styles.titleColumn}>
                    <View style={styles.titleWithBadge}>
                      <Text style={[styles.tierTitle, { color: textPrimary }]}>
                        {tier.title}
                      </Text>
                      {isCurrent && (
                        <Badge label="Current" variant="yellow" size="sm" />
                      )}
                    </View>
                    <Text
                      style={[styles.tierSubtitle, { color: textSecondary }]}
                    >
                      {tier.subtitle}
                    </Text>
                  </View>
                </View>

                {/* Close Button */}
                <TouchableOpacity
                  style={[
                    styles.closeButton,
                    {
                      backgroundColor: isDarkMode ? '#242A35' : '#F1EFEA',
                      borderColor: cardBorder,
                    },
                  ]}
                  onPress={onClose}
                  activeOpacity={0.7}
                  accessibilityRole="button"
                  accessibilityLabel="Close level details"
                >
                  <X size={16} color={textPrimary} strokeWidth={2.4} />
                </TouchableOpacity>
              </View>

              {/* Status & XP Requirement Pill */}
              <View style={styles.statusSection}>
                <ThreeDStatusBadge state={badgeState} requiredXp={tier.minXp} />

                <View style={styles.xpPill}>
                  <Text style={[styles.xpPillText, { color: textSecondary }]}>
                    {tier.minXp === 0
                      ? 'Starter Rank (0 XP)'
                      : isUnlocked
                      ? `Unlocked at ${tier.minXp} XP`
                      : `Requires ${tier.minXp} XP (${xpRemaining} XP needed)`}
                  </Text>
                </View>
              </View>

              {/* XP Progress Bar for Current Tier */}
              {isCurrent && nextTier && (
                <View style={styles.progressBarSection}>
                  <View style={styles.progressLabelRow}>
                    <Text
                      style={[
                        styles.progressLabelLeft,
                        { color: textSecondary },
                      ]}
                    >
                      Progress to Tier {nextTier.level} ({nextTier.title})
                    </Text>
                    <Text
                      style={[
                        styles.progressLabelRight,
                        { color: tier.accentColor || '#F5C518' },
                      ]}
                    >
                      {currentInTier} / {requiredForTier} XP
                    </Text>
                  </View>
                  <View style={styles.progressBarTrack}>
                    <View
                      style={[
                        styles.progressBarFill,
                        {
                          width: `${Math.round(tierProgress * 100)}%`,
                          backgroundColor: tier.accentColor || '#F5C518',
                        },
                      ]}
                    />
                  </View>
                </View>
              )}

              <ScrollView
                style={styles.modalScroll}
                showsVerticalScrollIndicator={false}
              >
                {/* Luxury Bespoke Themes Section */}
                {tier.unlockedThemes.length > 0 && (
                  <View
                    style={[
                      styles.sectionBox,
                      {
                        backgroundColor: isDarkMode
                          ? 'rgba(255, 255, 255, 0.04)'
                          : '#FAF8F2',
                        borderColor: cardBorder,
                      },
                    ]}
                  >
                    <View style={styles.sectionHeader}>
                      <Palette
                        size={14}
                        color={tier.accentColor || '#F5C518'}
                      />
                      <Text
                        style={[styles.sectionHeading, { color: textPrimary }]}
                      >
                        Luxury Bespoke Themes
                      </Text>
                    </View>

                    <View style={styles.themeChipsContainer}>
                      {tier.unlockedThemes.map(t => {
                        const isThemeActive = activeThemeId === t.id;
                        return (
                          <TouchableOpacity
                            key={t.id}
                            style={[
                              styles.themeChip,
                              {
                                backgroundColor: isDarkMode
                                  ? 'rgba(255, 255, 255, 0.08)'
                                  : '#FFFFFF',
                                borderColor: isThemeActive
                                  ? tier.accentColor || '#F5C518'
                                  : cardBorder,
                              },
                              isThemeActive && styles.themeChipActive,
                            ]}
                            onPress={() => {
                              if (!isUnlocked) {
                                Vibration.vibrate(20);
                                Toast.show({
                                  type: 'info',
                                  text1: `${t.name} Theme Locked`,
                                  text2: `Earn ${xpRemaining} more XP to reach Tier ${tier.level} (${tier.title})`,
                                });
                                return;
                              }
                              onApplyTheme(t.id, t.name);
                            }}
                            activeOpacity={0.7}
                            accessibilityRole="button"
                            accessibilityLabel={`Apply ${t.name} theme`}
                          >
                            <View
                              style={[
                                styles.themeColorDot,
                                { backgroundColor: t.hex },
                              ]}
                            />
                            <View style={styles.themeNameCol}>
                              <Text
                                style={[
                                  styles.themeName,
                                  { color: textPrimary },
                                  isThemeActive && {
                                    fontFamily: Fonts.poppins.bold,
                                  },
                                ]}
                              >
                                {t.name}
                              </Text>
                              <Text
                                style={[
                                  styles.themeDesc,
                                  { color: textSecondary },
                                ]}
                                numberOfLines={1}
                              >
                                {t.desc}
                              </Text>
                            </View>

                            {isUnlocked ? (
                              isThemeActive ? (
                                <View style={styles.activePill}>
                                  <CheckCircle2
                                    size={13}
                                    color={tier.accentColor || '#F5C518'}
                                    strokeWidth={2.5}
                                  />
                                  <Text
                                    style={[
                                      styles.activePillText,
                                      { color: tier.accentColor || '#F5C518' },
                                    ]}
                                  >
                                    Active
                                  </Text>
                                </View>
                              ) : (
                                <View
                                  style={[
                                    styles.applyBtnPill,
                                    {
                                      backgroundColor: isDarkMode
                                        ? 'rgba(255, 255, 255, 0.1)'
                                        : '#F0ECE1',
                                    },
                                  ]}
                                >
                                  <Text
                                    style={[
                                      styles.applyBtnText,
                                      { color: tier.accentColor || '#B47804' },
                                    ]}
                                  >
                                    Apply
                                  </Text>
                                </View>
                              )
                            ) : (
                              <Lock size={13} color={textSecondary} />
                            )}
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  </View>
                )}

                {/* Pro Privileges Unlocked Section */}
                {tier.unlockedFeatures.length > 0 && (
                  <View
                    style={[
                      styles.sectionBox,
                      {
                        backgroundColor: isDarkMode
                          ? 'rgba(255, 255, 255, 0.04)'
                          : '#FAF8F2',
                        borderColor: cardBorder,
                        marginTop: 10,
                      },
                    ]}
                  >
                    <View style={styles.sectionHeader}>
                      <Sparkles
                        size={14}
                        color={tier.accentColor || '#F5C518'}
                      />
                      <Text
                        style={[styles.sectionHeading, { color: textPrimary }]}
                      >
                        Pro Privileges Unlocked
                      </Text>
                    </View>

                    {tier.unlockedFeatures.map(f => (
                      <View key={f.id} style={styles.featureItemRow}>
                        <View
                          style={[
                            styles.featureBullet,
                            {
                              backgroundColor: isUnlocked
                                ? tier.accentColor || '#10B981'
                                : textSecondary,
                            },
                          ]}
                        />
                        <View style={styles.featureInfo}>
                          <Text
                            style={[styles.featureName, { color: textPrimary }]}
                          >
                            {f.name}
                          </Text>
                          <Text
                            style={[
                              styles.featureDesc,
                              { color: textSecondary },
                            ]}
                          >
                            {f.desc}
                          </Text>
                        </View>
                      </View>
                    ))}
                  </View>
                )}
              </ScrollView>

              {/* Bottom Dismiss Button */}
              <TouchableOpacity
                style={[
                  styles.dismissButton,
                  {
                    backgroundColor: isUnlocked
                      ? '#10B981'
                      : isDarkMode
                      ? '#2A303C'
                      : '#374151',
                  },
                ]}
                onPress={onClose}
                activeOpacity={0.8}
              >
                <Text style={styles.dismissButtonText}>
                  {isUnlocked ? 'Done' : 'Back to Journey'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  modalContentWrapper: {
    width: '100%',
    maxWidth: 420,
  },
  cardShadowWrapper: {
    borderRadius: 24,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 10,
  },
  modalCard: {
    borderRadius: 24,
    borderWidth: 3.5,
    overflow: 'hidden',
    maxHeight: Dimensions.get('window').height * 0.82,
    position: 'relative',
    padding: 16,
  },
  topAccentStrip: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 5,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginTop: 6,
    marginBottom: 12,
  },
  levelTokenRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  disc3D: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderTopColor: 'rgba(255, 255, 255, 0.8)',
    borderLeftColor: 'rgba(255, 255, 255, 0.4)',
    borderRightColor: 'rgba(255, 255, 255, 0.2)',
    borderBottomWidth: 5,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  discGlossHighlight: {
    position: 'absolute',
    top: 0,
    left: 4,
    right: 4,
    height: 10,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.35)',
  },
  discLevelText: {
    fontFamily: Fonts.ranade.bold,
    fontSize: 20,
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.35)',
    textShadowOffset: { width: 0, height: 1.5 },
    textShadowRadius: 2,
  },
  titleColumn: {
    flex: 1,
  },
  titleWithBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  tierTitle: {
    fontFamily: Fonts.ranade.bold,
    fontSize: 17,
  },
  tierSubtitle: {
    fontFamily: Fonts.poppins.regular,
    fontSize: 11,
    marginTop: 1,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  statusSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(0, 0, 0, 0.08)',
    marginBottom: 10,
  },
  xpPill: {
    flex: 1,
    alignItems: 'flex-end',
    marginLeft: 8,
  },
  xpPillText: {
    fontFamily: Fonts.poppins.medium,
    fontSize: 11,
  },
  progressBarSection: {
    marginBottom: 10,
  },
  progressLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  progressLabelLeft: {
    fontFamily: Fonts.poppins.medium,
    fontSize: 10.5,
  },
  progressLabelRight: {
    fontFamily: Fonts.poppins.bold,
    fontSize: 10.5,
  },
  progressBarTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(0, 0, 0, 0.08)',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  modalScroll: {
    maxHeight: 280,
  },
  sectionBox: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
  },
  sectionHeading: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: 12,
  },
  themeChipsContainer: {
    gap: 8,
  },
  themeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 12,
    borderWidth: 1.2,
    borderBottomWidth: 2.2,
    gap: 8,
  },
  themeChipActive: {
    borderWidth: 1.8,
  },
  themeColorDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  themeNameCol: {
    flex: 1,
  },
  themeName: {
    fontFamily: Fonts.poppins.medium,
    fontSize: 12,
  },
  themeDesc: {
    fontFamily: Fonts.poppins.regular,
    fontSize: 10,
  },
  activePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  activePillText: {
    fontFamily: Fonts.poppins.bold,
    fontSize: 10,
  },
  applyBtnPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  applyBtnText: {
    fontFamily: Fonts.poppins.bold,
    fontSize: 10,
  },
  featureItemRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 7,
  },
  featureBullet: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    marginTop: 6,
  },
  featureInfo: {
    flex: 1,
  },
  featureName: {
    fontFamily: Fonts.poppins.medium,
    fontSize: 11.5,
  },
  featureDesc: {
    fontFamily: Fonts.poppins.regular,
    fontSize: 10,
    lineHeight: 14,
  },
  dismissButton: {
    marginTop: 12,
    paddingVertical: 12,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.3)',
    borderBottomWidth: 3,
    borderBottomColor: 'rgba(0, 0, 0, 0.25)',
  },
  dismissButtonText: {
    fontFamily: Fonts.poppins.bold,
    fontSize: 13,
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
});
