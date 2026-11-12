import React, { useRef, useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
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
  Sparkles,
  Zap,
  CheckSquare,
  Bell,
  Activity,
} from 'lucide-react-native';
import Toast from 'react-native-toast-message';

import { Fonts } from '../../Theme/fonts';
import { Colors, withAlpha } from '../../Assets/StyleUtilities/Colors';
import ResponsivePixels from '../../Assets/StyleUtilities/ResponsivePixels';
import { Badge } from '../../Common/Badge';
import { ProBadge } from '../../Common/ProBadge';
import { useTheme } from '../../Theme/ThemeContext';
import { useMilestones } from '../../Context/MilestoneContext';
import { HeaderPatternSvg } from '../Dashboard/Components/HeaderPatternSvg';
import {
  MILESTONE_TIERS,
  XP_RULES,
  MilestoneTier,
} from '../../Services/Milestone/MilestoneService';
import { useDailyQuote } from '../../Services/DailyQuotes';
import {
  ZigzagGameRoad,
  MilestoneLevelDetailModal,
  MilestoneWatermarkDoodleSvg,
} from './Components';

const { width: screenWidth } = Dimensions.get('window');
const HEADER_HEIGHT = ResponsivePixels.size52;

export const MilestoneFullScreenSheet: React.FC = () => {
  const insets = useSafeAreaInsets();
  const { isDarkMode, activeThemeId, setActiveThemeId, Colors: themeColors } =
    useTheme();
  const dailyQuote = useDailyQuote('milestones');

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

  const [selectedTierForDetail, setSelectedTierForDetail] =
    useState<MilestoneTier | null>(null);

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

  const scrolledBg =
    themeColors.AccentDeep ||
    (isDarkMode ? Colors.MidnightIndigo : Colors.LavenderPurple);

  const headerBgColor = scrollY.interpolate({
    inputRange: [0, 30],
    outputRange: [
      isDarkMode
        ? withAlpha(Colors.DarkBackground, 0)
        : withAlpha(Colors.CreamBackground, 0),
      scrolledBg,
    ],
    extrapolate: 'clamp',
  });

  const headerRadius = scrollY.interpolate({
    inputRange: [0, 30],
    outputRange: [0, ResponsivePixels.size24],
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
    outputRange: [0, ResponsivePixels.size8],
    extrapolate: 'clamp',
  });

  const headerPatternOpacity = scrollY.interpolate({
    inputRange: [0, 25],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  // Dynamic theme tokens
  const sheetBg =
    themeColors.Background ||
    (isDarkMode ? Colors.DarkBackground : Colors.CreamBackground);
  const cardBg =
    themeColors.CardBackground ||
    (isDarkMode ? Colors.DarkCardBackground : Colors.PureWhite);
  const cardBorder =
    themeColors.BorderLight ||
    (isDarkMode ? withAlpha(Colors.PureWhite, 0.12) : Colors.RingBorder);
  const textPrimary =
    themeColors.PrimaryText ||
    (isDarkMode ? Colors.PureWhite : Colors.DarkBackground);
  const textSecondary =
    themeColors.SecondaryText ||
    (isDarkMode ? Colors.MilestoneSlate : Colors.Gray500);

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
                  ? scrolledBg
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
                  isScrolled && {
                    backgroundColor: withAlpha(Colors.PureWhite, 0.2),
                  },
                ]}
              >
                <Crown
                  size={ResponsivePixels.size18}
                  color={
                    isScrolled ? Colors.AccentYellow : Colors.HabitBurnishedAmber
                  }
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
                        ? withAlpha(Colors.PureWhite, 0.12)
                        : Colors.PureWhite,
                      borderBottomColor: isDarkMode
                        ? Colors.DarkCanvasRich
                        : Colors.WarmBtnBottomBevel,
                      shadowColor: isDarkMode
                        ? Colors.PureBlack
                        : withAlpha(Colors.PureBlack, 0.08),
                    },
              ]}
              onPress={closeMilestoneModal}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityLabel="Close milestones sheet"
            >
              <X
                size={ResponsivePixels.size18}
                color={isScrolled ? Colors.PureWhite : textPrimary}
                strokeWidth={2.4}
              />
            </TouchableOpacity>
          </View>
        </Animated.View>

        <Animated.ScrollView
          style={styles.scrollArea}
          contentContainerStyle={[
            styles.scrollContent,
            {
              paddingBottom:
                Math.max(insets.bottom, ResponsivePixels.size24) +
                ResponsivePixels.size16,
            },
          ]}
          showsVerticalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
        >
          {/* Rank status card */}
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
                                currentTier.accentColor || Colors.AccentYellow,
                            },
                          ]}
                        />
                      </View>
                    </View>
                  ) : (
                    <View style={styles.maxTierSection}>
                      <Sparkles
                        size={ResponsivePixels.size16}
                        color={Colors.AccentYellow}
                        strokeWidth={2}
                      />
                      <Text style={styles.maxTierText}>
                        Supreme Sovereign Rank Achieved
                      </Text>
                    </View>
                  )}

                  {/* Productivity Accomplishments Grid */}
                  <View style={styles.statsSummaryGrid}>
                    <View style={styles.statSummaryItem}>
                      <CheckSquare
                        size={ResponsivePixels.size16}
                        color={Colors.AccentYellow}
                        strokeWidth={2.4}
                      />
                      <Text style={styles.statSummaryVal}>
                        {completedTasksCount}
                      </Text>
                      <Text style={styles.statSummaryLbl}>Tasks Done</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statSummaryItem}>
                      <Bell
                        size={ResponsivePixels.size16}
                        color={Colors.AccentGreen}
                        strokeWidth={2.4}
                      />
                      <Text style={styles.statSummaryVal}>
                        {completedRemindersCount}
                      </Text>
                      <Text style={styles.statSummaryLbl}>Reminders</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statSummaryItem}>
                      <Activity
                        size={ResponsivePixels.size16}
                        color={Colors.LavenderPurple}
                        strokeWidth={2.4}
                      />
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
                borderBottomColor: isDarkMode
                  ? Colors.DarkSurfaceDeep
                  : Colors.WarmStoneBorder,
                shadowColor: isDarkMode
                  ? Colors.PureBlack
                  : withAlpha(Colors.LavenderPurple, 0.1),
              },
            ]}
          >
            <View style={styles.xpGuideHeader}>
              <Zap
                size={ResponsivePixels.size15}
                color={Colors.HabitBurnishedAmber}
                strokeWidth={2.4}
              />
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

          {/* Prestige roadmap */}
          <View style={styles.roadmapHeaderRow}>
            <View>
              <Text style={[styles.roadmapHeading, { color: textSecondary }]}>
                PRESTIGE TIER ROADMAP
              </Text>
              <Text
                style={[styles.roadmapSubheading, { color: textSecondary }]}
              >
                Real game levels • Tap any checkpoint to inspect
              </Text>
            </View>
            <View
              style={[
                styles.totalXpPill,
                {
                  backgroundColor: isDarkMode
                    ? Colors.MilestoneXpPillDarkBg
                    : Colors.MilestoneXpPillLightBg,
                  borderColor: isDarkMode
                    ? Colors.MilestoneXpPillDarkBorder
                    : Colors.MilestoneXpPillLightBorder,
                },
              ]}
            >
              <Zap size={ResponsivePixels.size11} color={Colors.AccentYellow} strokeWidth={2.6} />
              <Text style={[styles.totalXpPillText, { color: textPrimary }]}>
                {totalXp} XP
              </Text>
            </View>
          </View>

          {/* Full-Screen Center Zigzag Game Road */}
          <ZigzagGameRoad
            tiers={MILESTONE_TIERS}
            currentTier={currentTier}
            nextTier={nextTier}
            totalXp={totalXp}
            onSelectTier={tier => setSelectedTierForDetail(tier)}
            isDarkMode={isDarkMode}
          />

          {/* Footer brand watermark */}
          <View style={styles.footerWatermarkWrapper} pointerEvents="none">
            <View style={styles.footerWatermarkRow}>
              {/* Left Column: Bold Typography & Sign-off */}
              <View style={styles.footerTextBlock}>
                <Text
                  style={[
                    styles.footerWatermarkText,
                    {
                      color: isDarkMode
                        ? Colors.DarkWatermarkSlate
                        : Colors.MilestoneSlate,
                    },
                  ]}
                >
                  {dailyQuote}
                </Text>
                <View style={styles.craftedWithRow}>
                  <Text
                    style={[
                      styles.craftedWithText,
                      {
                        color: isDarkMode
                          ? Colors.DarkSubtextCoolGray
                          : Colors.MilestoneSlate,
                      },
                    ]}
                  >
                    Crafted with{' '}
                  </Text>
                  <Text style={styles.craftedWithHeart}>❤️</Text>
                  <Text
                    style={[
                      styles.craftedWithText,
                      {
                        color: isDarkMode
                          ? Colors.DarkSubtextCoolGray
                          : Colors.MilestoneSlate,
                      },
                    ]}
                  >
                    {' '}
                    in Ahmedabad, India
                  </Text>
                </View>
              </View>

              {/* Trophy doodle */}
              <View style={styles.footerDoodleWrapper}>
                <MilestoneWatermarkDoodleSvg isDarkMode={isDarkMode} />
              </View>
            </View>
          </View>
        </Animated.ScrollView>

        {/* Level details modal */}
        <MilestoneLevelDetailModal
          tier={selectedTierForDetail}
          visible={!!selectedTierForDetail}
          onClose={() => setSelectedTierForDetail(null)}
          totalXp={totalXp}
          currentTierLevel={currentTier.level}
          nextTier={nextTier}
          tierProgress={tierProgress}
          currentInTier={currentInTier}
          requiredForTier={requiredForTier}
          activeThemeId={activeThemeId}
          onApplyTheme={handleApplyTheme}
          isDarkMode={isDarkMode}
        />
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
    gap: ResponsivePixels.size12,
    flex: 1,
  },
  headerTextCol: {
    flex: 1,
  },
  headerIconBadge: {
    width: ResponsivePixels.size36,
    height: ResponsivePixels.size36,
    borderRadius: ResponsivePixels.size18,
    backgroundColor: Colors.ToastWarningBadgeBgLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ResponsivePixels.size6,
  },
  headerTitle: {
    fontFamily: Fonts.ranade.bold,
    fontSize: ResponsivePixels.size16,
  },
  headerTitleScrolled: {
    color: Colors.PureWhite,
  },
  headerSubtitle: {
    fontFamily: Fonts.poppins.regular,
    fontSize: ResponsivePixels.size11,
    marginTop: ResponsivePixels.size1,
  },
  headerSubtitleScrolled: {
    color: withAlpha(Colors.PureWhite, 0.85),
  },
  closeBtn: {
    width: ResponsivePixels.size38,
    height: ResponsivePixels.size38,
    borderRadius: ResponsivePixels.size19,
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
    backgroundColor: withAlpha(Colors.PureWhite, 0.2),
    borderColor: withAlpha(Colors.PureWhite, 0.4),
    borderBottomColor: withAlpha(Colors.PureWhite, 0.3),
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: ResponsivePixels.size16,
    paddingBottom: ResponsivePixels.size60,
  },
  heroOuterWrapper: {
    paddingHorizontal: ResponsivePixels.size10,
    marginBottom: ResponsivePixels.size20,
  },
  cardShadowWrapper: {
    backgroundColor: Colors.NeroBlack,
    borderRadius: ResponsivePixels.size24,
    shadowColor: Colors.PureBlack,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.28,
    shadowRadius: 18,
    elevation: 8,
  },
  card: {
    backgroundColor: Colors.NeroBlack,
    borderRadius: ResponsivePixels.size24,
    borderWidth: 4,
    borderColor: withAlpha(Colors.PureWhite, 0.9),
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
    paddingRight: ResponsivePixels.size12,
  },
  tierBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ResponsivePixels.size8,
    marginBottom: ResponsivePixels.size4,
  },
  heroTierTitle: {
    fontFamily: Fonts.ranade.bold,
    fontSize: ResponsivePixels.size20,
    color: Colors.CreamBackground,
  },
  heroSubtitle: {
    fontFamily: Fonts.poppins.regular,
    fontSize: ResponsivePixels.size12,
    color: withAlpha(Colors.PureWhite, 0.7),
    lineHeight: ResponsivePixels.size16,
  },
  xpCircleBadge: {
    width: ResponsivePixels.size68,
    height: ResponsivePixels.size68,
    borderRadius: ResponsivePixels.size34,
    backgroundColor: withAlpha(Colors.AccentYellow, 0.15),
    borderWidth: 2,
    borderColor: Colors.AccentYellow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  xpAmountText: {
    fontFamily: Fonts.ranade.bold,
    fontSize: ResponsivePixels.size18,
    color: Colors.AccentYellow,
  },
  xpUnitText: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: ResponsivePixels.size10,
    color: withAlpha(Colors.PureWhite, 0.7),
  },
  progressSection: {
    marginBottom: ResponsivePixels.size16,
  },
  progressLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: ResponsivePixels.size6,
  },
  progressLabelLeft: {
    fontFamily: Fonts.poppins.medium,
    fontSize: ResponsivePixels.size11,
    color: withAlpha(Colors.PureWhite, 0.75),
  },
  progressLabelRight: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: ResponsivePixels.size11,
    color: Colors.AccentYellow,
  },
  progressBarTrack: {
    height: ResponsivePixels.size6,
    borderRadius: ResponsivePixels.size3,
    backgroundColor: withAlpha(Colors.PureWhite, 0.15),
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: ResponsivePixels.size3,
  },
  maxTierSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ResponsivePixels.size6,
    marginBottom: ResponsivePixels.size16,
  },
  maxTierText: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: ResponsivePixels.size12,
    color: Colors.AccentYellow,
  },
  statsSummaryGrid: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: ResponsivePixels.size14,
    borderTopWidth: 1,
    borderTopColor: withAlpha(Colors.PureWhite, 0.12),
  },
  statSummaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  statSummaryVal: {
    fontFamily: Fonts.ranade.bold,
    fontSize: ResponsivePixels.size16,
    color: Colors.PureWhite,
    marginTop: ResponsivePixels.size4,
    marginBottom: ResponsivePixels.size1,
  },
  statSummaryLbl: {
    fontFamily: Fonts.poppins.regular,
    fontSize: ResponsivePixels.size10,
    color: withAlpha(Colors.PureWhite, 0.65),
  },
  statDivider: {
    width: 1,
    height: ResponsivePixels.size24,
    backgroundColor: withAlpha(Colors.PureWhite, 0.15),
  },
  xpGuideBox: {
    marginHorizontal: ResponsivePixels.size16,
    borderRadius: ResponsivePixels.size20,
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
    gap: ResponsivePixels.size8,
    marginBottom: ResponsivePixels.size8,
  },
  xpGuideTitle: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: ResponsivePixels.size13,
  },
  xpGuideRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: ResponsivePixels.size4,
  },
  xpGuideItem: {
    fontFamily: Fonts.poppins.regular,
    fontSize: ResponsivePixels.size11,
  },
  xpHighlight: {
    fontFamily: Fonts.poppins.semiBold,
  },
  roadmapHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: ResponsivePixels.size16,
    marginBottom: ResponsivePixels.size12,
  },
  roadmapHeading: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: ResponsivePixels.size11,
    letterSpacing: 1.1,
  },
  roadmapSubheading: {
    fontFamily: Fonts.poppins.regular,
    fontSize: ResponsivePixels.size10,
    marginTop: ResponsivePixels.size1,
  },
  totalXpPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ResponsivePixels.size4,
    paddingHorizontal: ResponsivePixels.size8,
    paddingVertical: ResponsivePixels.size3,
    borderRadius: ResponsivePixels.size12,
    borderWidth: 1,
  },
  totalXpPillText: {
    fontFamily: Fonts.poppins.bold,
    fontSize: ResponsivePixels.size10_5,
  },

  // Footer watermark styles
  footerWatermarkWrapper: {
    paddingLeft: ResponsivePixels.size16,
    paddingRight: ResponsivePixels.size16,
    marginTop: ResponsivePixels.size28,
    marginBottom: ResponsivePixels.size24,
  },
  footerWatermarkRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  footerTextBlock: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  footerWatermarkText: {
    fontFamily: Fonts.poppins.bold,
    fontSize: ResponsivePixels.size34,
    lineHeight: ResponsivePixels.size42,
    letterSpacing: -1.2,
  },
  craftedWithRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: ResponsivePixels.size18,
  },
  craftedWithText: {
    fontFamily: Fonts.poppins.medium,
    fontSize: ResponsivePixels.size14,
  },
  craftedWithHeart: {
    fontSize: ResponsivePixels.size13_5,
  },
  footerDoodleWrapper: {
    marginLeft: ResponsivePixels.size8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: ResponsivePixels.size6,
  },
});
