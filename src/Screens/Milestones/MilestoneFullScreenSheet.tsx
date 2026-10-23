import React, { useRef, useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Vibration,
  Dimensions,
  Animated,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
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
import Toast from 'react-native-toast-message';

import { Typography } from '../../Theme/Typographys';
import { Fonts } from '../../Theme/fonts';
import {
  Colors as StaticColors,
  Colors,
} from '../../Assets/StyleUtilities/Colors';
import ResponsivePixels from '../../Assets/StyleUtilities/ResponsivePixels';
import { Badge } from '../../Common/Badge';
import { ProBadge } from '../../Common/ProBadge';
import { useTheme } from '../../Theme/ThemeContext';
import { useMilestones } from '../../Context/MilestoneContext';
import { HeaderPatternSvg } from '../Dashboard/Components/HeaderPatternSvg';
import {
  MILESTONE_TIERS,
  XP_RULES,
} from '../../Services/Milestone/MilestoneService';

const { width: screenWidth } = Dimensions.get('window');
const HEADER_HEIGHT = 52;

export const MilestoneFullScreenSheet: React.FC = () => {
  const insets = useSafeAreaInsets();
  const { isDarkMode, activeThemeId, setActiveThemeId } = useTheme();

  const {
    isMilestoneModalVisible,
    closeMilestoneModal,
    totalXp,
    currentTier,
    nextTier,
    tierProgress,
    currentInTier,
    requiredForTier,
    completedTasksCount,
    completedRemindersCount,
    habitsFollowedCount,
  } = useMilestones();

  const scrollY = useRef(new Animated.Value(0)).current;
  const isScrolledRef = useRef(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    {
      useNativeDriver: false,
      listener: (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const offsetY = event?.nativeEvent?.contentOffset?.y ?? 0;
        if (offsetY > 15 && !isScrolledRef.current) {
          isScrolledRef.current = true;
          setIsScrolled(true);
        } else if (offsetY <= 15 && isScrolledRef.current) {
          isScrolledRef.current = false;
          setIsScrolled(false);
        }
      },
    },
  );

  const headerBgColor = scrollY.interpolate({
    inputRange: [0, 30],
    outputRange: [
      isDarkMode ? 'rgba(18, 20, 23, 0)' : 'rgba(255, 252, 227, 0)',
      isDarkMode ? '#282048' : Colors.LavenderPurple,
    ],
    extrapolate: 'clamp',
  });

  const headerRadius = scrollY.interpolate({
    inputRange: [0, 30],
    outputRange: [0, 24],
    extrapolate: 'clamp',
  });

  const headerShadowOpacity = scrollY.interpolate({
    inputRange: [0, 30],
    outputRange: [0, 0.32],
    extrapolate: 'clamp',
  });

  const headerElevation = scrollY.interpolate({
    inputRange: [0, 30],
    outputRange: [0, 8],
    extrapolate: 'clamp',
  });

  const headerPaddingBottom = scrollY.interpolate({
    inputRange: [0, 30],
    outputRange: [0, 8],
    extrapolate: 'clamp',
  });

  const headerPatternOpacity = scrollY.interpolate({
    inputRange: [0, 25],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  // Dynamic light/dark theme tokens
  const sheetBg = isDarkMode ? '#121417' : StaticColors.CreamBackground;
  const cardBg = isDarkMode ? '#1E2228' : '#FFFFFF';
  const cardBorder = isDarkMode ? 'rgba(255, 255, 255, 0.12)' : '#E8E2D5';
  const textPrimary = isDarkMode ? '#FFFFFF' : '#121417';
  const textSecondary = isDarkMode ? '#8E95A5' : '#6B7280';
  const dividerColor = isDarkMode ? 'rgba(255, 255, 255, 0.08)' : '#ECE6DA';

  const handleApplyTheme = (themeId: string, themeName: string) => {
    Vibration.vibrate(25);
    setActiveThemeId(themeId as any);
    Toast.show({
      type: 'success',
      text1: 'Theme Applied',
      text2: `Switched to ${themeName} palette.`,
    });
  };

  return (
    <Modal
      visible={isMilestoneModalVisible}
      animationType="slide"
      onRequestClose={closeMilestoneModal}
      statusBarTranslucent
    >
      <View
        style={[
          styles.fullScreenContainer,
          {
            backgroundColor: sheetBg,
            paddingBottom: Math.max(insets.bottom, 16),
          },
        ]}
      >
        <StatusBar
          barStyle={
            isScrolled
              ? 'light-content'
              : isDarkMode
              ? 'light-content'
              : 'dark-content'
          }
          {...(Platform.OS === 'android'
            ? {
                backgroundColor: isScrolled
                  ? isDarkMode
                    ? '#282048'
                    : Colors.LavenderPurple
                  : sheetBg,
                translucent: true,
              }
            : {})}
        />

        {/* Scroll-Reactive Sheet Header */}
        <Animated.View
          style={[
            styles.headerContainer,
            {
              paddingTop: insets.top,
              paddingBottom: headerPaddingBottom,
              backgroundColor: headerBgColor,
              borderBottomLeftRadius: headerRadius,
              borderBottomRightRadius: headerRadius,
              shadowOpacity: headerShadowOpacity,
              elevation: headerElevation,
            },
          ]}
        >
          <Animated.View
            pointerEvents="none"
            style={[
              StyleSheet.absoluteFill,
              {
                opacity: headerPatternOpacity,
                borderBottomLeftRadius: headerRadius,
                borderBottomRightRadius: headerRadius,
                overflow: 'hidden',
              },
            ]}
          >
            <HeaderPatternSvg width={screenWidth} insetsTop={insets.top} />
          </Animated.View>

          <View style={[styles.headerRow, { height: HEADER_HEIGHT }]}>
            <View style={styles.headerTitleWrap}>
              <View
                style={[
                  styles.headerIconBadge,
                  isScrolled && { backgroundColor: 'rgba(255, 255, 255, 0.2)' },
                ]}
              >
                <Crown
                  size={18}
                  color={isScrolled ? '#F5C518' : '#D97706'}
                  strokeWidth={2.4}
                />
              </View>
              <View style={styles.headerTextCol}>
                <View style={styles.titleRow}>
                  <Text
                    style={[
                      styles.headerTitle,
                      isScrolled
                        ? styles.headerTitleScrolled
                        : { color: textPrimary },
                    ]}
                    numberOfLines={1}
                  >
                    Milestones & Pro Unlocks
                  </Text>
                  <ProBadge size="sm" />
                </View>
                <Text
                  style={[
                    styles.headerSubtitle,
                    isScrolled
                      ? styles.headerSubtitleScrolled
                      : { color: textSecondary },
                  ]}
                  numberOfLines={1}
                >
                  Earn bespoke themes & privileges via discipline
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={[
                styles.closeBtn,
                isScrolled
                  ? styles.closeBtnScrolled
                  : {
                      backgroundColor: cardBg,
                      borderColor: isDarkMode
                        ? 'rgba(255, 255, 255, 0.12)'
                        : '#FFFFFF',
                      borderBottomColor: isDarkMode ? '#14161A' : '#DCD6CA',
                      shadowColor: isDarkMode
                        ? '#000000'
                        : 'rgba(0, 0, 0, 0.08)',
                    },
              ]}
              onPress={closeMilestoneModal}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityLabel="Close milestones sheet"
            >
              <X
                size={18}
                color={isScrolled ? Colors.DefaultWhite : textPrimary}
                strokeWidth={2.4}
              />
            </TouchableOpacity>
          </View>
        </Animated.View>

        <Animated.ScrollView
          style={styles.scrollArea}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
        >
          {/* Hero Prestige Rank Status Card (2-Layer Obsidian Bento) */}
          <View style={styles.heroOuterWrapper}>
            <View style={styles.cardShadowWrapper}>
              <View style={styles.card}>
                <HeaderPatternSvg width={screenWidth} insetsTop={insets.top} />

                <View style={styles.heroContent}>
                  <View style={styles.heroTopRow}>
                    <View style={styles.heroLeft}>
                      <View style={styles.tierBadgeRow}>
                        <Badge
                          label={`Tier ${currentTier.level}`}
                          variant={currentTier.badgeVariant}
                          size="sm"
                        />
                        <Text style={styles.heroTierTitle}>
                          {currentTier.title}
                        </Text>
                      </View>
                      <Text style={styles.heroSubtitle}>
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
                        <Text style={styles.progressLabelLeft}>
                          Next Rank: {nextTier.title} (Tier {nextTier.level})
                        </Text>
                        <Text style={styles.progressLabelRight}>
                          {currentInTier} / {requiredForTier} XP
                        </Text>
                      </View>
                      <View style={styles.progressBarTrack}>
                        <View
                          style={[
                            styles.progressBarFill,
                            {
                              width: `${Math.round(tierProgress * 100)}%`,
                              backgroundColor:
                                currentTier.accentColor || '#F5C518',
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

                  {/* Productivity Accomplishments Grid */}
                  <View style={styles.statsSummaryGrid}>
                    <View style={styles.statSummaryItem}>
                      <CheckSquare
                        size={16}
                        color="#F5C518"
                        strokeWidth={2.4}
                      />
                      <Text style={styles.statSummaryVal}>
                        {completedTasksCount}
                      </Text>
                      <Text style={styles.statSummaryLbl}>Tasks Done</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statSummaryItem}>
                      <Bell size={16} color="#52D22E" strokeWidth={2.4} />
                      <Text style={styles.statSummaryVal}>
                        {completedRemindersCount}
                      </Text>
                      <Text style={styles.statSummaryLbl}>Reminders</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statSummaryItem}>
                      <Activity size={16} color="#8383D6" strokeWidth={2.4} />
                      <Text style={styles.statSummaryVal}>
                        {habitsFollowedCount}
                      </Text>
                      <Text style={styles.statSummaryLbl}>Habits Kept</Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </View>

          {/* How to Earn XP Info Box */}
          <View
            style={[
              styles.xpGuideBox,
              {
                backgroundColor: cardBg,
                borderColor: cardBorder,
                borderBottomColor: isDarkMode ? '#171A20' : '#E2DCD0',
                shadowColor: isDarkMode
                  ? '#000000'
                  : 'rgba(131, 131, 214, 0.1)',
              },
            ]}
          >
            <View style={styles.xpGuideHeader}>
              <Zap size={15} color="#D97706" strokeWidth={2.4} />
              <Text style={[styles.xpGuideTitle, { color: textPrimary }]}>
                How to Earn Discipline XP
              </Text>
            </View>
            <View style={styles.xpGuideRow}>
              <Text style={[styles.xpGuideItem, { color: textSecondary }]}>
                • Task Completed:{' '}
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

          {/* 5-Tier Prestige Roadmap */}
          <Text style={[styles.roadmapHeading, { color: textSecondary }]}>
            PRESTIGE TIER ROADMAP
          </Text>

          <View style={styles.tiersContainer}>
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
                      borderBottomColor: isCurrent
                        ? currentTier.accentColor
                        : isDarkMode
                        ? '#171A20'
                        : '#E2DCD0',
                      shadowColor: isCurrent
                        ? currentTier.accentColor
                        : isDarkMode
                        ? '#000000'
                        : 'rgba(131, 131, 214, 0.08)',
                    },
                    isCurrent && {
                      borderWidth: 2,
                      borderBottomWidth: 4,
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
                              onPress={() => handleApplyTheme(t.id, t.name)}
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
          </View>
        </Animated.ScrollView>
      </View>
    </Modal>
  );
};

export default MilestoneFullScreenSheet;

const styles = StyleSheet.create({
  fullScreenContainer: {
    flex: 1,
  },
  headerContainer: {
    shadowColor: Colors.LavenderPurple,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 12,
    zIndex: 10,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: ResponsivePixels.size16,
  },
  headerTitleWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  headerTextCol: {
    flex: 1,
  },
  headerIconBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  headerTitle: {
    fontFamily: Fonts.ranade.bold,
    fontSize: 16,
  },
  headerTitleScrolled: {
    color: Colors.DefaultWhite,
  },
  headerSubtitle: {
    fontFamily: Fonts.poppins.regular,
    fontSize: 11,
    marginTop: 1,
  },
  headerSubtitleScrolled: {
    color: 'rgba(255, 255, 255, 0.85)',
  },
  closeBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1.5,
    borderBottomWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  closeBtnScrolled: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderColor: 'rgba(255, 255, 255, 0.4)',
    borderBottomColor: 'rgba(255, 255, 255, 0.3)',
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: ResponsivePixels.size16,
    paddingBottom: ResponsivePixels.size24,
  },
  heroOuterWrapper: {
    paddingHorizontal: 10,
    marginBottom: ResponsivePixels.size20,
  },
  cardShadowWrapper: {
    backgroundColor: StaticColors.NeroBlack,
    borderRadius: 24,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.28,
    shadowRadius: 18,
    elevation: 8,
  },
  card: {
    backgroundColor: StaticColors.NeroBlack,
    borderRadius: 24,
    borderWidth: 4,
    borderColor: 'rgba(255, 255, 255, 0.9)',
    overflow: 'hidden',
    position: 'relative',
  },
  heroContent: {
    padding: ResponsivePixels.size20,
  },
  heroTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: ResponsivePixels.size16,
  },
  heroLeft: {
    flex: 1,
    paddingRight: 12,
  },
  tierBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  heroTierTitle: {
    fontFamily: Fonts.ranade.bold,
    fontSize: 20,
    color: '#FFFCE3',
  },
  heroSubtitle: {
    fontFamily: Fonts.poppins.regular,
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    lineHeight: 16,
  },
  xpCircleBadge: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: 'rgba(245, 197, 24, 0.15)',
    borderWidth: 2,
    borderColor: '#F5C518',
    alignItems: 'center',
    justifyContent: 'center',
  },
  xpAmountText: {
    fontFamily: Fonts.ranade.bold,
    fontSize: 18,
    color: '#F5C518',
  },
  xpUnitText: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  progressSection: {
    marginBottom: ResponsivePixels.size16,
  },
  progressLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  progressLabelLeft: {
    fontFamily: Fonts.poppins.medium,
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.75)',
  },
  progressLabelRight: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: 11,
    color: '#F5C518',
  },
  progressBarTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  maxTierSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: ResponsivePixels.size16,
  },
  maxTierText: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: 12,
    color: '#F5C518',
  },
  statsSummaryGrid: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: ResponsivePixels.size14,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.12)',
  },
  statSummaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  statSummaryVal: {
    fontFamily: Fonts.ranade.bold,
    fontSize: 16,
    color: '#FFFFFF',
    marginTop: 4,
    marginBottom: 1,
  },
  statSummaryLbl: {
    fontFamily: Fonts.poppins.regular,
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.65)',
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  xpGuideBox: {
    marginHorizontal: ResponsivePixels.size16,
    borderRadius: 20,
    borderWidth: 1.5,
    borderBottomWidth: 3.5,
    padding: ResponsivePixels.size16,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 2,
    marginBottom: ResponsivePixels.size24,
  },
  xpGuideHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  xpGuideTitle: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: 13,
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
    fontFamily: Fonts.poppins.semiBold,
  },
  roadmapHeading: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: 11,
    letterSpacing: 1.1,
    marginHorizontal: ResponsivePixels.size16,
    marginBottom: ResponsivePixels.size10,
  },
  tiersContainer: {
    paddingHorizontal: ResponsivePixels.size16,
    gap: 14,
  },
  tierCard: {
    borderRadius: 20,
    borderWidth: 1.5,
    borderBottomWidth: 3.5,
    padding: ResponsivePixels.size16,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 2,
  },
  tierCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  tierCardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  tierLevelBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tierLevelBadgeText: {
    fontFamily: Fonts.ranade.bold,
    fontSize: 14,
  },
  tierTitleInline: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  tierTitleText: {
    fontFamily: Fonts.ranade.bold,
    fontSize: 15,
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
  },
  statusUnlockedText: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: 11,
    color: '#52D22E',
  },
  statusLocked: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  statusLockedText: {
    fontFamily: Fonts.poppins.regular,
    fontSize: 11,
  },
  rewardsSection: {
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  rewardsSubheading: {
    fontFamily: Fonts.poppins.medium,
    fontSize: 11,
    marginBottom: 8,
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
    borderRadius: 12,
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
    fontFamily: Fonts.poppins.regular,
    fontSize: 11,
  },
  applyHintText: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: 10,
  },
  featureItemRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 6,
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
    fontSize: 12,
  },
  featureDesc: {
    fontFamily: Fonts.poppins.regular,
    fontSize: 10.5,
    lineHeight: 14,
  },
});
