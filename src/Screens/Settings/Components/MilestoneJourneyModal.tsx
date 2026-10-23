import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import {
  X,
  Crown,
  CheckCircle2,
  Lock,
  Sparkles,
  Zap,
  CheckSquare,
  Bell,
  Activity,
  Palette,
} from 'lucide-react-native';
import { Typography } from '../../../Theme/Typographys';
import { Fonts } from '../../../Theme/fonts';
import Colors, {
  Colors as StaticColors,
} from '../../../Assets/StyleUtilities/Colors';
import ResponsivePixels from '../../../Assets/StyleUtilities/ResponsivePixels';
import { Badge } from '../../../Common/Badge';
import { useTheme } from '../../../Theme/ThemeContext';
import {
  MILESTONE_TIERS,
  MilestoneTier,
  XP_RULES,
} from '../../../Services/Milestone/MilestoneService';

interface MilestoneJourneyModalProps {
  visible: boolean;
  onClose: () => void;
  currentTier: MilestoneTier;
  nextTier: MilestoneTier | null;
  totalXp: number;
  tierProgress: number;
  currentInTier: number;
  requiredForTier: number;
  completedTasksCount: number;
  completedRemindersCount: number;
  habitsFollowedCount: number;
  onSelectTheme?: (themeId: string) => void;
}

export const MilestoneJourneyModal: React.FC<MilestoneJourneyModalProps> = ({
  visible,
  onClose,
  currentTier,
  nextTier,
  totalXp,
  tierProgress,
  currentInTier,
  requiredForTier,
  completedTasksCount,
  completedRemindersCount,
  habitsFollowedCount,
  onSelectTheme,
}) => {
  const { isDarkMode, activeThemeId } = useTheme();

  // Dynamic light/dark theme tokens
  const sheetBg = isDarkMode ? '#171A20' : StaticColors.CreamBackground;
  const cardBg = isDarkMode ? '#1E2228' : '#FFFFFF';
  const cardBorder = isDarkMode ? 'rgba(255, 255, 255, 0.12)' : '#E8E2D5';
  const textPrimary = isDarkMode ? '#FFFFFF' : '#121417';
  const textSecondary = isDarkMode ? '#8E95A5' : '#6B7280';
  const dividerColor = isDarkMode ? 'rgba(255, 255, 255, 0.08)' : '#ECE6DA';
  const handleColor = isDarkMode
    ? 'rgba(255, 255, 255, 0.25)'
    : 'rgba(0, 0, 0, 0.2)';

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <TouchableOpacity
          style={styles.backdropDismiss}
          activeOpacity={1}
          onPress={onClose}
        />

        {/* Bottom Sheet Container */}
        <View style={[styles.bottomSheet, { backgroundColor: sheetBg }]}>
          {/* Top Sheet Drag Notch */}
          <View style={[styles.dragHandle, { backgroundColor: handleColor }]} />

          {/* Sheet Header */}
          <View style={[styles.headerRow, { borderBottomColor: dividerColor }]}>
            <View style={styles.headerTitleWrap}>
              <View style={styles.headerIconBadge}>
                <Crown size={18} color="#D97706" strokeWidth={2.4} />
              </View>
              <View>
                <Text style={[styles.headerTitle, { color: textPrimary }]}>
                  Milestone Journey
                </Text>
                <Text style={[styles.headerSubtitle, { color: textSecondary }]}>
                  Earn Pro themes & features via discipline
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={[
                styles.closeBtn,
                {
                  backgroundColor: isDarkMode
                    ? 'rgba(255, 255, 255, 0.1)'
                    : '#EDE7DC',
                },
              ]}
              onPress={onClose}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityLabel="Close milestones modal"
            >
              <X size={18} color={textPrimary} strokeWidth={2.4} />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.scrollArea}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Current Status Hero Card */}
            <View
              style={[
                styles.heroCard,
                {
                  backgroundColor: cardBg,
                  borderColor: cardBorder,
                  borderBottomColor: isDarkMode ? '#15181C' : '#D8D1C4',
                  shadowColor: isDarkMode
                    ? '#000000'
                    : 'rgba(131, 131, 214, 0.1)',
                },
              ]}
            >
              <View style={styles.heroTopRow}>
                <View style={styles.heroLeft}>
                  <View style={styles.tierBadgeRow}>
                    <Badge
                      label={`Tier ${currentTier.level}`}
                      variant={currentTier.badgeVariant}
                      size="sm"
                    />
                    <Text
                      style={[styles.heroTierTitle, { color: textPrimary }]}
                    >
                      {currentTier.title}
                    </Text>
                  </View>
                  <Text style={[styles.heroSubtitle, { color: textSecondary }]}>
                    {currentTier.subtitle}
                  </Text>
                </View>

                <View style={styles.xpCircleBadge}>
                  <Text style={styles.xpAmountText}>{totalXp}</Text>
                  <Text style={styles.xpUnitText}>Total XP</Text>
                </View>
              </View>

              {/* Progress bar to next tier */}
              {nextTier ? (
                <View style={styles.progressSection}>
                  <View style={styles.progressLabelRow}>
                    <Text
                      style={[
                        styles.progressLabelLeft,
                        { color: textSecondary },
                      ]}
                    >
                      Next: {nextTier.title} (Tier {nextTier.level})
                    </Text>
                    <Text
                      style={[
                        styles.progressLabelRight,
                        { color: currentTier.accentColor },
                      ]}
                    >
                      {currentInTier} / {requiredForTier} XP
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.progressBarTrack,
                      {
                        backgroundColor: isDarkMode
                          ? 'rgba(255, 255, 255, 0.1)'
                          : '#E6E0D2',
                      },
                    ]}
                  >
                    <View
                      style={[
                        styles.progressBarFill,
                        {
                          width: `${Math.round(tierProgress * 100)}%`,
                          backgroundColor: currentTier.accentColor,
                        },
                      ]}
                    />
                  </View>
                </View>
              ) : (
                <View style={styles.maxTierSection}>
                  <Sparkles size={16} color="#F5C518" strokeWidth={2} />
                  <Text style={styles.maxTierText}>
                    Supreme Sovereign Rank Achieved
                  </Text>
                </View>
              )}

              {/* Stats Summary Pill Grid */}
              <View
                style={[
                  styles.statsSummaryGrid,
                  { borderTopColor: dividerColor },
                ]}
              >
                <View style={styles.statSummaryItem}>
                  <CheckSquare size={13} color="#F5C518" strokeWidth={2.2} />
                  <Text style={[styles.statSummaryVal, { color: textPrimary }]}>
                    {completedTasksCount}
                  </Text>
                  <Text
                    style={[styles.statSummaryLbl, { color: textSecondary }]}
                  >
                    Tasks Done
                  </Text>
                </View>
                <View
                  style={[
                    styles.statDivider,
                    { backgroundColor: dividerColor },
                  ]}
                />
                <View style={styles.statSummaryItem}>
                  <Bell size={13} color="#52D22E" strokeWidth={2.2} />
                  <Text style={[styles.statSummaryVal, { color: textPrimary }]}>
                    {completedRemindersCount}
                  </Text>
                  <Text
                    style={[styles.statSummaryLbl, { color: textSecondary }]}
                  >
                    Reminders
                  </Text>
                </View>
                <View
                  style={[
                    styles.statDivider,
                    { backgroundColor: dividerColor },
                  ]}
                />
                <View style={styles.statSummaryItem}>
                  <Activity size={13} color="#8383D6" strokeWidth={2.2} />
                  <Text style={[styles.statSummaryVal, { color: textPrimary }]}>
                    {habitsFollowedCount}
                  </Text>
                  <Text
                    style={[styles.statSummaryLbl, { color: textSecondary }]}
                  >
                    Habits Kept
                  </Text>
                </View>
              </View>
            </View>

            {/* How XP Works Breakdown Box */}
            <View
              style={[
                styles.xpGuideBox,
                {
                  backgroundColor: isDarkMode
                    ? 'rgba(245, 197, 24, 0.08)'
                    : '#FFFBEB',
                  borderColor: 'rgba(245, 197, 24, 0.3)',
                },
              ]}
            >
              <View style={styles.xpGuideHeader}>
                <Zap size={14} color="#D97706" strokeWidth={2.4} />
                <Text style={styles.xpGuideTitle}>How to Earn XP</Text>
              </View>
              <View style={styles.xpGuideRow}>
                <Text style={[styles.xpGuideItem, { color: textSecondary }]}>
                  • Task Done:{' '}
                  <Text style={[styles.xpHighlight, { color: textPrimary }]}>
                    +{XP_RULES.TASK_COMPLETION} XP
                  </Text>
                </Text>
                <Text style={[styles.xpGuideItem, { color: textSecondary }]}>
                  • Reminder Done:{' '}
                  <Text style={[styles.xpHighlight, { color: textPrimary }]}>
                    +{XP_RULES.REMINDER_COMPLETION} XP
                  </Text>
                </Text>
              </View>
              <View style={styles.xpGuideRow}>
                <Text style={[styles.xpGuideItem, { color: textSecondary }]}>
                  • Habit Kept:{' '}
                  <Text style={[styles.xpHighlight, { color: textPrimary }]}>
                    +{XP_RULES.HABIT_CHECKIN} XP
                  </Text>
                </Text>
                <Text style={[styles.xpGuideItem, { color: textSecondary }]}>
                  • Streak Bonus:{' '}
                  <Text style={[styles.xpHighlight, { color: textPrimary }]}>
                    +{XP_RULES.HABIT_STREAK_BONUS_PER_DAY} XP / Day
                  </Text>
                </Text>
              </View>
            </View>

            {/* 5-Tier Roadmap Section */}
            <Text style={[styles.roadmapHeading, { color: textPrimary }]}>
              Prestige Tier Roadmap
            </Text>

            {MILESTONE_TIERS.map(tier => {
              const isCurrent = tier.level === currentTier.level;
              const isUnlocked = currentTier.level >= tier.level;
              const isNext = nextTier?.level === tier.level;

              return (
                <View
                  key={tier.level}
                  style={[
                    styles.tierCard,
                    {
                      backgroundColor: cardBg,
                      borderColor: isCurrent
                        ? currentTier.accentColor
                        : cardBorder,
                      borderBottomColor: isDarkMode ? '#15181C' : '#D8D1C4',
                      shadowColor: isDarkMode
                        ? '#000000'
                        : 'rgba(131, 131, 214, 0.08)',
                    },
                    isCurrent && {
                      borderWidth: 1.8,
                      borderBottomWidth: 3.5,
                    },
                  ]}
                >
                  <View style={styles.tierCardHeader}>
                    <View style={styles.tierCardHeaderLeft}>
                      <View
                        style={[
                          styles.tierLevelBadge,
                          {
                            backgroundColor: isUnlocked
                              ? tier.accentColor
                              : isDarkMode
                              ? '#2C3038'
                              : '#E6E0D2',
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.tierLevelBadgeText,
                            {
                              color: isUnlocked
                                ? '#000000'
                                : isDarkMode
                                ? '#8E95A5'
                                : '#727782',
                            },
                          ]}
                        >
                          {tier.level}
                        </Text>
                      </View>
                      <View>
                        <View style={styles.tierTitleInline}>
                          <Text
                            style={[
                              styles.tierTitleText,
                              { color: textPrimary },
                            ]}
                          >
                            {tier.title}
                          </Text>
                          {isCurrent && (
                            <Badge
                              label="Current"
                              variant={tier.badgeVariant}
                              size="sm"
                            />
                          )}
                        </View>
                        <Text
                          style={[
                            styles.tierRequiredXp,
                            { color: textSecondary },
                          ]}
                        >
                          {tier.minXp === 0
                            ? 'Starter Rank (0 XP)'
                            : `${tier.minXp} XP required to unlock`}
                        </Text>
                      </View>
                    </View>

                    {isUnlocked ? (
                      <View style={styles.statusUnlocked}>
                        <CheckCircle2
                          size={15}
                          color="#52D22E"
                          strokeWidth={2.4}
                        />
                        <Text style={styles.statusUnlockedText}>Unlocked</Text>
                      </View>
                    ) : (
                      <View
                        style={[
                          styles.statusLocked,
                          {
                            backgroundColor: isDarkMode
                              ? 'rgba(255, 255, 255, 0.06)'
                              : '#EDE7DC',
                          },
                        ]}
                      >
                        <Lock
                          size={13}
                          color={textSecondary}
                          strokeWidth={2.2}
                        />
                        <Text
                          style={[
                            styles.statusLockedText,
                            { color: textSecondary },
                          ]}
                        >
                          {isNext ? 'Next Goal' : 'Locked'}
                        </Text>
                      </View>
                    )}
                  </View>

                  {/* Unlocked Themes in this Tier */}
                  {tier.unlockedThemes.length > 0 && (
                    <View
                      style={[
                        styles.rewardsSection,
                        { borderTopColor: dividerColor },
                      ]}
                    >
                      <Text
                        style={[
                          styles.rewardsSubheading,
                          { color: textSecondary },
                        ]}
                      >
                        <Palette size={12} color={textSecondary} /> Luxury
                        Bespoke Themes:
                      </Text>
                      <View style={styles.themeChipsRow}>
                        {tier.unlockedThemes.map(t => {
                          const isThemeActive = activeThemeId === t.id;
                          return (
                            <TouchableOpacity
                              key={t.id}
                              style={[
                                styles.themeChip,
                                {
                                  backgroundColor: isDarkMode
                                    ? 'rgba(255, 255, 255, 0.06)'
                                    : '#F7F4EC',
                                  borderColor: isThemeActive
                                    ? tier.accentColor
                                    : isUnlocked
                                    ? cardBorder
                                    : 'transparent',
                                },
                                isThemeActive && styles.themeChipActive,
                              ]}
                              disabled={!isUnlocked}
                              onPress={() => onSelectTheme?.(t.id)}
                              activeOpacity={0.7}
                            >
                              <View
                                style={[
                                  styles.themeColorDot,
                                  { backgroundColor: t.hex },
                                ]}
                              />
                              <Text
                                style={[
                                  styles.themeChipText,
                                  { color: textPrimary },
                                  isThemeActive && {
                                    fontFamily: Fonts.poppins.bold,
                                  },
                                ]}
                              >
                                {t.name}
                              </Text>
                              {isUnlocked ? (
                                isThemeActive ? (
                                  <CheckCircle2
                                    size={12}
                                    color={tier.accentColor}
                                    strokeWidth={2.5}
                                  />
                                ) : (
                                  <Text
                                    style={[
                                      styles.applyHintText,
                                      { color: tier.accentColor },
                                    ]}
                                  >
                                    Apply
                                  </Text>
                                )
                              ) : (
                                <Lock size={10} color={textSecondary} />
                              )}
                            </TouchableOpacity>
                          );
                        })}
                      </View>
                    </View>
                  )}

                  {/* Unlocked Pro Features in this Tier */}
                  {tier.unlockedFeatures.length > 0 && (
                    <View
                      style={[
                        styles.rewardsSection,
                        { borderTopColor: dividerColor },
                      ]}
                    >
                      <Text
                        style={[
                          styles.rewardsSubheading,
                          { color: textSecondary },
                        ]}
                      >
                        <Sparkles size={12} color={textSecondary} /> Pro
                        Privileges Unlocked:
                      </Text>
                      {tier.unlockedFeatures.map(f => (
                        <View key={f.id} style={styles.featureItemRow}>
                          <View
                            style={[
                              styles.featureBullet,
                              {
                                backgroundColor: isUnlocked
                                  ? tier.accentColor
                                  : textSecondary,
                              },
                            ]}
                          />
                          <View style={styles.featureInfo}>
                            <Text
                              style={[
                                styles.featureName,
                                { color: textPrimary },
                              ]}
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
                </View>
              );
            })}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'flex-end',
  },
  backdropDismiss: {
    flex: 1,
  },
  bottomSheet: {
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    maxHeight: '88%',
    paddingBottom: Platform.OS === 'ios' ? 24 : 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.35,
    shadowRadius: 18,
    elevation: 16,
  },
  dragHandle: {
    width: 44,
    height: 5,
    borderRadius: 2.5,
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 6,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: ResponsivePixels.size20,
    paddingTop: ResponsivePixels.size10,
    paddingBottom: ResponsivePixels.size14,
    borderBottomWidth: 1,
  },
  headerTitleWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerIconBadge: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(245, 197, 24, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(245, 197, 24, 0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontFamily: Fonts.ranade.bold,
    fontSize: 17,
  },
  headerSubtitle: {
    fontFamily: Fonts.poppins.regular,
    fontSize: 11.5,
    marginTop: 1,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollArea: {
    maxHeight: 560,
  },
  scrollContent: {
    padding: ResponsivePixels.size18,
    paddingBottom: ResponsivePixels.size28,
  },
  heroCard: {
    borderRadius: 20,
    padding: ResponsivePixels.size16,
    borderWidth: 1.5,
    borderBottomWidth: 3.5,
    marginBottom: ResponsivePixels.size16,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  heroTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  heroLeft: {
    flex: 1,
    marginRight: 12,
  },
  tierBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  heroTierTitle: {
    fontFamily: Fonts.ranade.bold,
    fontSize: 16,
  },
  heroSubtitle: {
    fontFamily: Fonts.poppins.regular,
    fontSize: 12,
    marginTop: 4,
  },
  xpCircleBadge: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: 'rgba(245, 197, 24, 0.15)',
    borderWidth: 2,
    borderColor: '#F5C518',
    alignItems: 'center',
    justifyContent: 'center',
  },
  xpAmountText: {
    fontFamily: Fonts.poppins.bold,
    fontSize: 15.5,
    color: '#D97706',
  },
  xpUnitText: {
    fontFamily: Fonts.poppins.medium,
    fontSize: 9.5,
    color: '#8E95A5',
  },
  progressSection: {
    marginTop: 14,
  },
  progressLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  progressLabelLeft: {
    fontFamily: Fonts.poppins.medium,
    fontSize: 11.5,
  },
  progressLabelRight: {
    fontFamily: Fonts.poppins.bold,
    fontSize: 11.5,
    color: '#D97706',
  },
  progressBarTrack: {
    height: 7,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  maxTierSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 12,
  },
  maxTierText: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: 12,
    color: '#F5C518',
  },
  statsSummaryGrid: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
  },
  statSummaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  statSummaryVal: {
    fontFamily: Fonts.poppins.bold,
    fontSize: 13,
  },
  statSummaryLbl: {
    fontFamily: Fonts.poppins.regular,
    fontSize: 11,
  },
  statDivider: {
    width: 1,
    height: 14,
  },
  xpGuideBox: {
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    marginBottom: ResponsivePixels.size20,
  },
  xpGuideHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  xpGuideTitle: {
    fontFamily: Fonts.poppins.bold,
    fontSize: 12.5,
    color: '#D97706',
  },
  xpGuideRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  xpGuideItem: {
    fontFamily: Fonts.poppins.regular,
    fontSize: 11,
  },
  xpHighlight: {
    fontFamily: Fonts.poppins.bold,
  },
  roadmapHeading: {
    fontFamily: Fonts.ranade.bold,
    fontSize: 15.5,
    marginBottom: 12,
  },
  tierCard: {
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderBottomWidth: 3,
    marginBottom: 12,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  tierCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  tierCardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  tierLevelBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tierLevelBadgeText: {
    fontFamily: Fonts.poppins.bold,
    fontSize: 13,
  },
  tierTitleInline: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  tierTitleText: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: 13.5,
  },
  tierRequiredXp: {
    fontFamily: Fonts.poppins.regular,
    fontSize: 11,
    marginTop: 1,
  },
  statusUnlocked: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(82, 210, 46, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusUnlockedText: {
    fontFamily: Fonts.poppins.medium,
    fontSize: 11,
    color: '#52D22E',
  },
  statusLocked: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusLockedText: {
    fontFamily: Fonts.poppins.medium,
    fontSize: 11,
  },
  rewardsSection: {
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
  },
  rewardsSubheading: {
    fontFamily: Fonts.poppins.medium,
    fontSize: 11,
    marginBottom: 6,
  },
  themeChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  themeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    borderWidth: 1,
  },
  themeChipActive: {
    borderWidth: 1.5,
  },
  themeColorDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  themeChipText: {
    fontFamily: Fonts.poppins.medium,
    fontSize: 11.5,
  },
  applyHintText: {
    fontFamily: Fonts.poppins.bold,
    fontSize: 10,
    marginLeft: 2,
  },
  featureItemRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginTop: 4,
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
    fontSize: 10.5,
  },
});

export default MilestoneJourneyModal;
