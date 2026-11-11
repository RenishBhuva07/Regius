import React, {
  useState,
  useMemo,
  useCallback,
  useRef,
  useEffect,
} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  Animated,
  Alert,
  Vibration,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import {
  Flame,
  Clock,
  Repeat,
  Sun,
  Moon,
  Sparkles,
  Pencil,
  Volume2,
  Trash2,
  Calendar,
  Quote,
  Zap,
  RotateCw,
} from 'lucide-react-native';
import Svg, {
  Rect,
  Circle,
  Path,
  Defs,
  LinearGradient,
  RadialGradient,
  Stop,
} from 'react-native-svg';
import Toast from 'react-native-toast-message';

import { Fonts } from '../../Theme/fonts';
import { Colors, withAlpha } from '../../Assets/StyleUtilities/Colors';
import ResponsivePixels from '../../Assets/StyleUtilities/ResponsivePixels';
import { useTheme } from '../../Theme/ThemeContext';
import { useTaskReminder } from '../../Context/TaskReminderContext';
import {
  SubScreenHeader,
  SUB_SCREEN_HEADER_HEIGHT,
} from '../../Common/SubScreenHeader';
import { useScrollReactiveHeader } from '../../Common/useScrollReactiveHeader';
import { Badge, BadgeVariant } from '../../Common/Badge';
import { HeaderActionButton } from '../../Common/HeaderActionButton';
import { StickyActionDock } from '../../Common/StickyActionDock';
import { StickyBottomButton } from '../../Common/StickyBottomButton';
import AddHabitModal from '../../Components/AddHabitModal';
import { KokoroTTSService } from '../../Services/Kokoro/KokoroTTSService';
import { AudioPlayerService } from '../../Services/AudioPlayerService';
import { HabitDetailsBackgroundSvg } from './Components/HabitDetailsBackgroundSvg';
import { HabitVocalMotivationCard } from './Components/HabitVocalMotivationCard';
import { HabitPhilosophyKeepsakeCard } from './Components/HabitPhilosophyKeepsakeCard';

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export interface HabitDetailsScreenRouteParams {
  habitId: string;
}

/**
 * Luxury ambient background for Habit Details Hero Bento Card
 */
const BentoHeroBg: React.FC<{ accentColor: string }> = React.memo(
  ({ accentColor }) => (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <Svg
        width="100%"
        height="100%"
        viewBox="0 0 360 180"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
      >
        <Defs>
          <LinearGradient id="heroBentoBg" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor={Colors.BentoStopSlate} stopOpacity={0.8} />
            <Stop offset="50%" stopColor={Colors.DetailStopMid} stopOpacity={0.4} />
            <Stop offset="100%" stopColor={Colors.BentoStopDeep} stopOpacity={0.9} />
          </LinearGradient>

          {/* Fiery Flame Aura */}
          <RadialGradient
            id="flameHeroGlow"
            cx="25%"
            cy="40%"
            rx="60%"
            ry="60%"
          >
            <Stop offset="0%" stopColor={Colors.AccentAmber} stopOpacity={0.32} />
            <Stop offset="45%" stopColor={Colors.EventTextAccent} stopOpacity={0.14} />
            <Stop offset="100%" stopColor={Colors.BentoStopDeep} stopOpacity={0} />
          </RadialGradient>

          {/* Dynamic Category Accent Aura */}
          <RadialGradient
            id="accentHeroGlow"
            cx="80%"
            cy="20%"
            rx="65%"
            ry="65%"
          >
            <Stop offset="0%" stopColor={accentColor} stopOpacity={0.35} />
            <Stop offset="50%" stopColor={accentColor} stopOpacity={0.12} />
            <Stop offset="100%" stopColor={Colors.BentoStopDeep} stopOpacity={0} />
          </RadialGradient>
        </Defs>

        <Rect width="100%" height="100%" fill="url(#heroBentoBg)" />
        <Rect width="100%" height="100%" fill="url(#flameHeroGlow)" />
        <Rect width="100%" height="100%" fill="url(#accentHeroGlow)" />

        <Circle
          cx={300}
          cy={40}
          r={50}
          stroke={withAlpha(Colors.PureWhite, 0.12)}
          strokeWidth={1}
          fill="none"
        />
        <Circle
          cx={300}
          cy={40}
          r={85}
          stroke={withAlpha(Colors.PureWhite, 0.05)}
          strokeWidth={1}
          strokeDasharray="4 6"
          fill="none"
        />
      </Svg>
    </View>
  ),
);

/**
 * Luxury ambient background for Habit Consistency Matrix Showcase Card
 * Provides dark Nero canvas with amber & category auras, orbit lines, and starlight
 */
const CupboardAestheticBg: React.FC<{ accentColor: string }> = React.memo(
  ({ accentColor }) => (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <Svg
        width="100%"
        height="100%"
        viewBox="0 0 360 220"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
      >
        <Defs>
          <LinearGradient
            id="cupboardDarkBg"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <Stop offset="0%" stopColor={Colors.BentoStopSlate} stopOpacity={0.92} />
            <Stop offset="50%" stopColor={Colors.DetailStopMid} stopOpacity={0.65} />
            <Stop offset="100%" stopColor={Colors.BentoStopDeep} stopOpacity={0.96} />
          </LinearGradient>

          {/* Fiery Amber Glow behind Streak Showcase */}
          <RadialGradient
            id="cupboardAmberGlow"
            cx="30%"
            cy="25%"
            rx="60%"
            ry="55%"
          >
            <Stop offset="0%" stopColor={Colors.AccentAmber} stopOpacity={0.25} />
            <Stop offset="55%" stopColor={Colors.EventTextAccent} stopOpacity={0.08} />
            <Stop offset="100%" stopColor={Colors.BentoStopDeep} stopOpacity={0} />
          </RadialGradient>

          {/* Dynamic Category Accent Aura */}
          <RadialGradient
            id="cupboardAccentGlow"
            cx="85%"
            cy="80%"
            rx="60%"
            ry="55%"
          >
            <Stop offset="0%" stopColor={accentColor} stopOpacity={0.28} />
            <Stop offset="50%" stopColor={accentColor} stopOpacity={0.08} />
            <Stop offset="100%" stopColor={Colors.BentoStopDeep} stopOpacity={0} />
          </RadialGradient>
        </Defs>

        <Rect width="100%" height="100%" fill="url(#cupboardDarkBg)" />
        <Rect width="100%" height="100%" fill="url(#cupboardAmberGlow)" />
        <Rect width="100%" height="100%" fill="url(#cupboardAccentGlow)" />

        {/* Orbit Rings & Starlight Sparkles */}
        <Circle
          cx={310}
          cy={35}
          r={55}
          stroke={withAlpha(Colors.PureWhite, 0.12)}
          strokeWidth={1}
          fill="none"
        />
        <Circle
          cx={310}
          cy={35}
          r={90}
          stroke={withAlpha(Colors.PureWhite, 0.05)}
          strokeWidth={1}
          strokeDasharray="4 6"
          fill="none"
        />
        <Circle cx={285} cy={18} r={1.6} fill={Colors.PureWhite} opacity={0.65} />
        <Circle cx={35} cy={165} r={1.4} fill={Colors.AccentYellow} opacity={0.5} />
      </Svg>
    </View>
  ),
);

/**
 * Tactile streak indicator for 7-day consistency matrix:
 * - Completed: Filled flame
 * - Pending / Incomplete: Bordered outline flame
 */
const StreakDayIcon: React.FC<{
  completed: boolean;
  isToday?: boolean;
  isDarkMode?: boolean;
}> = React.memo(({ completed, isToday, isDarkMode }) => {
  const iconSize = ResponsivePixels.size30;
  const flamePath =
    'M12 3q1 4 4 6.5t3 5.5a1 1 0 0 1-14 0 5 5 0 0 1 1-3 1 1 0 0 0 5 0c0-2-1.5-3-1.5-5q0-2 2.5-4';

  if (completed) {
    return (
      <Svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none">
        <Defs>
          <LinearGradient
            id="streakFlameFilledGrad"
            x1="0%"
            y1="0%"
            x2="0%"
            y2="100%"
          >
            <Stop offset="0%" stopColor={Colors.StreakFlameOrangeTop} />
            <Stop offset="100%" stopColor={Colors.AccentAmber} />
          </LinearGradient>
        </Defs>
        <Path
          d={flamePath}
          fill="url(#streakFlameFilledGrad)"
          stroke={Colors.EventTextAccent}
          strokeWidth={1}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    );
  }

  // Pending / Incomplete day: ONLY bordered streak flame icon
  const pendingStroke = isToday
    ? Colors.AccentAmber
    : isDarkMode
    ? Colors.DarkBevelTop
    : Colors.DetailWarmBorderMuted;

  return (
    <Svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none">
      <Path
        d={flamePath}
        fill="none"
        stroke={pendingStroke}
        strokeWidth={isToday ? 2 : 1.7}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={isToday ? '3 2' : undefined}
      />
    </Svg>
  );
});

export const HabitDetailsScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const route =
    useRoute<RouteProp<{ params: HabitDetailsScreenRouteParams }, 'params'>>();
  const { isDarkMode } = useTheme();

  const habitId = route.params?.habitId;
  const { habits, toggleHabit, updateHabit, deleteHabit } = useTaskReminder();

  const habit = useMemo(
    () => habits.find(h => h.id === habitId),
    [habits, habitId],
  );

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPlayingMotivation, setIsPlayingMotivation] = useState(false);

  // Scroll tracking with reactive header
  const { scrollY, isScrolled, handleScroll } = useScrollReactiveHeader({
    threshold: 15,
  });
  const scaleAnim = useRef(new Animated.Value(1)).current;

  // Audio session race condition and cleanup guards
  const sessionIdRef = useRef<number>(0);
  const playbackUnsubRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    return () => {
      sessionIdRef.current += 1;
      if (playbackUnsubRef.current) {
        playbackUnsubRef.current();
        playbackUnsubRef.current = null;
      }
      KokoroTTSService.stop().catch(() => {});
      AudioPlayerService.stop().catch(() => {});
    };
  }, []);

  // Category trios & harmonic tokens conforming to DESIGN_SYSTEM.md §2.3
  const categoryTheme = useMemo(() => {
    const baseTheme = {
      label: 'MINDFUL HABITS',
      badgeVariant: 'purple' as BadgeVariant,
      accent: Colors.LavenderPurple,
      bgTint: Colors.MindfulLightBg,
      borderColor: Colors.MindfulLightBorder,
      icon: Sparkles,
      iconColor: Colors.MindfulTextAccent,
      quote:
        '“We are what we repeatedly do. Excellence, then, is not an act, but a daily habit.”',
      sublabel: 'Midday Mindful Routine',
    };

    if (habit?.category === 'morning') {
      return {
        label: 'MORNING RITUAL',
        badgeVariant: 'yellow' as BadgeVariant,
        accent: Colors.AccentYellow,
        bgTint: Colors.BadgeYellowBg,
        borderColor: Colors.WorkLightBorder,
        icon: Sun,
        iconColor: Colors.BadgeYellowText,
        quote:
          '“The secret of your future is hidden in your daily routine. Own the morning.”',
        sublabel: 'Dawn Circadian Ritual',
      };
    }
    if (habit?.category === 'evening') {
      return {
        label: 'EVENING RITUAL',
        badgeVariant: 'orange' as BadgeVariant,
        accent: Colors.CategoryOrangeCheck,
        bgTint: Colors.EventTintSoftLight,
        borderColor: Colors.CategoryPeachBorder,
        icon: Moon,
        iconColor: Colors.EventDeepOrangeIcon,
        quote:
          '“Consistent evening reflection restores clarity and pre-aligns tomorrow’s victories.”',
        sublabel: 'Evening Wind-down Flow',
      };
    }
    return baseTheme;
  }, [habit?.category]);

  const IconComponent = categoryTheme.icon;

  const handleToggle = useCallback(() => {
    if (!habit) return;
    Vibration.vibrate(20);

    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 75,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        tension: 180,
        useNativeDriver: true,
      }),
    ]).start();

    const updated = toggleHabit(habit.id);
    if (updated) {
      Toast.show({
        type: 'success',
        text1: updated.completed ? 'Ritual Checked In!' : 'Habit Reset',
        text2: updated.completed
          ? `Momentum active! Current streak: ${updated.streak} days`
          : 'Status marked incomplete for today.',
      });
    }
  }, [habit, toggleHabit, scaleAnim]);

  // Handle Sia Neural Vocal Guidance playback
  const handleToggleVocalMotivation = useCallback(async () => {
    if (!habit) return;
    Vibration.vibrate(25);

    sessionIdRef.current += 1;
    const currentSession = sessionIdRef.current;

    if (playbackUnsubRef.current) {
      playbackUnsubRef.current();
      playbackUnsubRef.current = null;
    }

    if (isPlayingMotivation) {
      await KokoroTTSService.stop();
      await AudioPlayerService.stop();
      setIsPlayingMotivation(false);
      return;
    }

    setIsPlayingMotivation(true);
    const cat = (habit.category || '').toLowerCase();
    let spokenText = `Regius will chime at ${habit.timeOfDay} to ignite your ${habit.title} ritual.`;
    if (cat === 'morning') {
      spokenText = `Dawn activation secured. Sia will chime at ${habit.timeOfDay} to ignite your ${habit.title} ritual, anchoring dopamine focus for peak daily execution.`;
    } else if (cat === 'evening') {
      spokenText = `Twilight reflection active. Sia will nudge your ${habit.title} ritual at ${habit.timeOfDay}, clearing cognitive clutter to pre-align tomorrow’s victories.`;
    } else {
      spokenText = `Mindful stoic alignment. Sia channels undivided presence at ${habit.timeOfDay} for your ${habit.title} routine, safeguarding mental equilibrium.`;
    }

    const unsub = AudioPlayerService.onPlaybackFinished(() => {
      if (sessionIdRef.current === currentSession) {
        setIsPlayingMotivation(false);
      }
      if (playbackUnsubRef.current) {
        playbackUnsubRef.current();
        playbackUnsubRef.current = null;
      }
    });
    playbackUnsubRef.current = unsub;

    try {
      await KokoroTTSService.speak(spokenText);
    } catch {
      if (sessionIdRef.current === currentSession) {
        setIsPlayingMotivation(false);
      }
    }
  }, [habit, isPlayingMotivation]);

  const handleDelete = useCallback(() => {
    if (!habit) return;
    Vibration.vibrate(30);

    Alert.alert(
      'Delete Ritual',
      `Are you sure you want to delete "${habit.title}"? Your streak count of ${habit.streak} days will be permanently reset.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteHabit(habit.id);
            Toast.show({
              type: 'info',
              text1: 'Habit Removed',
              text2: 'The ritual has been removed from your flow.',
            });
            navigation.goBack();
          },
        },
      ],
    );
  }, [habit, deleteHabit, navigation]);

  if (!habit) {
    return (
      <View style={[styles.container, isDarkMode && styles.containerDark]}>
        <SubScreenHeader
          title="Habit Details"
          scrollY={scrollY}
          isScrolled={isScrolled}
          onPressBack={() => navigation.goBack()}
        />
        <View style={styles.notFoundCenter}>
          <Text
            style={[styles.notFoundText, isDarkMode && styles.notFoundTextDark]}
          >
            Habit ritual not found.
          </Text>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backBtnFallback}
            activeOpacity={0.8}
            accessibilityRole="button"
          >
            <Text style={styles.backBtnFallbackText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const isCompleted = habit.completed;
  const currentStreak = habit.streak;

  // Calculate filled days accurately across the 7-day window (Index 6 = Today)
  const windowDaysCompleted = Math.min(
    7,
    currentStreak + (isCompleted && currentStreak === 0 ? 1 : 0),
  );
  const consistencyRate = Math.min(
    100,
    Math.round(
      ((currentStreak + (isCompleted ? 1 : 0)) / (currentStreak + 1 || 1)) *
        100,
    ),
  );

  return (
    <View style={[styles.container, isDarkMode && styles.containerDark]}>
      {/* Luxury Ambient Background Svg Canvas */}
      <HabitDetailsBackgroundSvg accentColor={categoryTheme.accent} />

      {/* Scroll-Reactive Luxury SubScreenHeader */}
      <SubScreenHeader
        title="Habit Details"
        subtitle={categoryTheme.label}
        scrollY={scrollY}
        isScrolled={isScrolled}
        onPressBack={() => navigation.goBack()}
        rightAction={
          <View style={styles.headerRightGroup}>
            <Badge
              label={categoryTheme.label}
              variant={categoryTheme.badgeVariant}
              size="sm"
            />
            <HeaderActionButton
              label="Edit"
              icon={Pencil}
              onPress={() => setIsEditModalOpen(true)}
              accessibilityLabel={`Edit ${habit.title}`}
            />
          </View>
        }
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop:
              insets.top + SUB_SCREEN_HEADER_HEIGHT + ResponsivePixels.size12,
            paddingBottom: insets.bottom + ResponsivePixels.size85,
          },
        ]}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {/* Flagship Hero Bento Card: Minimized, 2-Layer Structure conforming to DESIGN_SYSTEM.md § 4.3.1 */}
        <View style={styles.cardShadowWrapper}>
          <View style={styles.card}>
            <BentoHeroBg accentColor={categoryTheme.accent} />

            <View style={styles.bentoContent}>
              {/* Top Meta Row */}
              <View style={styles.bentoTopRow}>
                <View style={styles.frostedDomainPill}>
                  <IconComponent
                    size={ResponsivePixels.size12}
                    color={categoryTheme.iconColor}
                    strokeWidth={2.4}
                  />
                  <Text
                    style={[
                      styles.frostedDomainText,
                      { color: categoryTheme.iconColor },
                    ]}
                  >
                    {categoryTheme.sublabel}
                  </Text>
                </View>

                <Badge
                  label={isCompleted ? 'COMPLETED TODAY' : 'PENDING CHECK-IN'}
                  variant={isCompleted ? 'green' : 'orange'}
                  size="sm"
                />
              </View>

              {/* Habit Editorial Title */}
              <Text style={styles.bentoTitle} numberOfLines={3}>
                {habit.title}
              </Text>

              {/* Fiery Streak Showcase */}
              <View style={styles.streakShowcaseRow}>
                <View style={styles.flameAuraContainer}>
                  <Flame
                    size={ResponsivePixels.size18}
                    color={Colors.AccentAmber}
                    fill={Colors.AccentAmber}
                    strokeWidth={2.2}
                  />
                </View>
                <View style={styles.streakTextWrap}>
                  <View style={styles.streakValueRow}>
                    <Text style={styles.streakNumber}>{currentStreak}</Text>
                    <Text style={styles.streakUnit}>DAYS</Text>
                  </View>
                  <Text style={styles.streakSublabel}>
                    {isCompleted
                      ? 'Streak actively secured for today!'
                      : 'Complete today to extend your momentum.'}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* 7-Day Consistency & Progress Matrix */}
        <View style={styles.sectionWrapper}>
          <View style={styles.sectionHeaderRow}>
            <View style={styles.sectionHeaderLeft}>
              <Calendar
                size={ResponsivePixels.size15}
                color={
                  isDarkMode ? Colors.SteelMist : Colors.WarmMutedTextLight
                }
                strokeWidth={2.2}
              />
              <Text
                style={[
                  styles.sectionHeaderTitle,
                  isDarkMode && styles.textWhite,
                ]}
              >
                Consistency Matrix
              </Text>
            </View>
            <View style={styles.sectionHeaderCapsule}>
              <Text style={styles.sectionHeaderCapsuleText}>LAST 7 DAYS</Text>
            </View>
          </View>

          {/* 2-Layer Cupboard Cabinet Outer Architecture */}
          <View style={styles.cupboardShadowWrapper}>
            <View style={styles.cupboardCard}>
              {/* Luxury Ambient Black Aesthetic Background with Gradients, Auras & Orbits */}
              <CupboardAestheticBg accentColor={categoryTheme.accent} />

              {/* Box 1: 7-Day Streak Days Showcase Window with Inset Depth */}
              <View
                style={[
                  styles.streakWindowBox,
                  isDarkMode && styles.cupboardWindowDark,
                ]}
              >
                {/* Micro-Header inside Top Window */}
                <View style={styles.streakWindowHeader}>
                  <View style={styles.streakWindowHeaderLeft}>
                    <Flame
                      size={ResponsivePixels.size12}
                      color={Colors.AccentAmber}
                      fill={Colors.AccentAmber}
                      strokeWidth={2}
                    />
                    <Text
                      style={[
                        styles.streakWindowHeaderTitle,
                        isDarkMode && styles.textWhite,
                      ]}
                    >
                      7-DAY MOMENTUM
                    </Text>
                  </View>
                  <Badge
                    label={`${windowDaysCompleted}/7 SECURED`}
                    variant="orange"
                    size="sm"
                  />
                </View>

                {/* 7 Weekday Columns - Open & Airy with Creative Day Chips */}
                <View style={styles.weekdaysRow}>
                  {WEEKDAYS.map((day, idx) => {
                    const isToday = idx === 6;
                    const isDayFilled =
                      idx >= 7 - windowDaysCompleted &&
                      (idx < 6 ? true : isCompleted);

                    return (
                      <View key={`day-${day}-${idx}`} style={styles.dayCol}>
                        {/* Creative Day Name Chip */}
                        <View
                          style={[
                            styles.dayCapsule,
                            isToday
                              ? styles.dayCapsuleToday
                              : isDayFilled
                              ? styles.dayCapsuleCompleted
                              : styles.dayCapsulePending,
                            isDarkMode && styles.dayCapsuleDark,
                            isToday && isDarkMode && styles.dayCapsuleTodayDark,
                          ]}
                        >
                          <Text
                            style={[
                              styles.dayName,
                              isToday && styles.dayNameToday,
                              isToday && isDarkMode && styles.dayNameTodayDark,
                              !isToday && isDarkMode && styles.dayNameDark,
                            ]}
                          >
                            {day}
                          </Text>
                        </View>

                        {/* Flame Icon with Breathing Room */}
                        <View style={styles.dayIconWrap}>
                          <StreakDayIcon
                            completed={isDayFilled}
                            isToday={isToday}
                            isDarkMode={isDarkMode}
                          />
                        </View>
                      </View>
                    );
                  })}
                </View>
              </View>

              {/* Boxes 2, 3, 4: Three Separate Inset Cubby Windows with Beveled Depth */}
              <View style={styles.cubbiesRow}>
                {/* Box 2: Current Streak Cubby */}
                <View
                  style={[
                    styles.statCubbyBox,
                    isDarkMode && styles.cupboardWindowDark,
                  ]}
                >
                  <View style={[styles.cubby3DDisc, styles.streakDisc]}>
                    <Flame
                      size={ResponsivePixels.size13}
                      color={Colors.EventTextAccent}
                      fill={Colors.AccentAmber}
                      strokeWidth={2.2}
                    />
                  </View>

                  <View style={styles.cubbyMetricCluster}>
                    <View style={styles.cubbyValueRow}>
                      <Text
                        style={[
                          styles.cubbyValueBig,
                          isDarkMode && styles.textWhite,
                        ]}
                      >
                        {currentStreak}
                      </Text>
                    </View>

                    <Text
                      style={styles.cubbyLabel}
                      numberOfLines={1}
                      adjustsFontSizeToFit
                    >
                      CURRENT STREAK
                    </Text>

                    {/* Micro Visual Progress Meter */}
                    <View
                      style={[
                        styles.miniMeterTrack,
                        styles.miniMeterTrackAmber,
                      ]}
                    >
                      <View
                        style={[
                          styles.miniMeterFill,
                          styles.miniMeterFillAmber,
                          {
                            width: `${Math.min(
                              100,
                              Math.max(12, (currentStreak / 30) * 100),
                            )}%`,
                          },
                        ]}
                      />
                    </View>
                  </View>

                  <View style={styles.cubbyBadgeWrap}>
                    <Badge
                      label={currentStreak > 0 ? 'ACTIVE' : 'BUILDING'}
                      variant="orange"
                      size="sm"
                      style={styles.cubbyBadge}
                      icon={
                        <Flame
                          size={ResponsivePixels.size10}
                          color={Colors.EventTextAccent}
                          fill={Colors.AccentAmber}
                          strokeWidth={2}
                        />
                      }
                    />
                  </View>
                </View>

                {/* Box 3: Consistency Rate Cubby */}
                <View
                  style={[
                    styles.statCubbyBox,
                    isDarkMode && styles.cupboardWindowDark,
                  ]}
                >
                  <View style={[styles.cubby3DDisc, styles.consistencyDisc]}>
                    <Sparkles
                      size={ResponsivePixels.size13}
                      color={Colors.LavenderPurple}
                      strokeWidth={2.4}
                    />
                  </View>

                  <View style={styles.cubbyMetricCluster}>
                    <View style={styles.cubbyValueRow}>
                      <Text
                        style={[
                          styles.cubbyValueBig,
                          isDarkMode && styles.textWhite,
                        ]}
                      >
                        {consistencyRate}%
                      </Text>
                    </View>

                    <Text
                      style={styles.cubbyLabel}
                      numberOfLines={1}
                      adjustsFontSizeToFit
                    >
                      CONSISTENCY
                    </Text>

                    {/* Micro Visual Progress Meter */}
                    <View
                      style={[
                        styles.miniMeterTrack,
                        styles.miniMeterTrackPurple,
                      ]}
                    >
                      <View
                        style={[
                          styles.miniMeterFill,
                          styles.miniMeterFillPurple,
                          { width: `${Math.max(consistencyRate, 12)}%` },
                        ]}
                      />
                    </View>
                  </View>

                  <View style={styles.cubbyBadgeWrap}>
                    <Badge
                      label={
                        consistencyRate >= 90
                          ? 'OPTIMAL'
                          : consistencyRate >= 50
                          ? 'STEADY'
                          : 'BUILDING'
                      }
                      variant="purple"
                      size="sm"
                      style={styles.cubbyBadge}
                      icon={
                        <Zap
                          size={ResponsivePixels.size10}
                          color={Colors.LavenderPurple}
                          fill={Colors.LavenderPurple}
                          strokeWidth={2}
                        />
                      }
                    />
                  </View>
                </View>

                {/* Box 4: Cadence Cubby */}
                <View
                  style={[
                    styles.statCubbyBox,
                    isDarkMode && styles.cupboardWindowDark,
                  ]}
                >
                  <View style={[styles.cubby3DDisc, styles.cadenceDisc]}>
                    <Repeat
                      size={ResponsivePixels.size13}
                      color={Colors.GreenGracious}
                      strokeWidth={2.4}
                    />
                  </View>

                  <View style={styles.cubbyMetricCluster}>
                    <View style={styles.cubbyValueRow}>
                      <Text
                        style={[
                          styles.cubbyCadenceText,
                          isDarkMode && styles.textWhite,
                        ]}
                        numberOfLines={1}
                        adjustsFontSizeToFit
                      >
                        {habit.frequency}
                      </Text>
                    </View>

                    <Text
                      style={styles.cubbyLabel}
                      numberOfLines={1}
                      adjustsFontSizeToFit
                    >
                      CADENCE
                    </Text>

                    {/* Micro Visual Progress Meter */}
                    <View
                      style={[
                        styles.miniMeterTrack,
                        styles.miniMeterTrackGreen,
                      ]}
                    >
                      <View
                        style={[
                          styles.miniMeterFill,
                          styles.miniMeterFillGreen,
                          { width: '100%' },
                        ]}
                      />
                    </View>
                  </View>

                  <View style={styles.cubbyBadgeWrap}>
                    <Badge
                      label={
                        habit.frequency.toLowerCase().includes('daily')
                          ? '7/7 DAYS'
                          : 'ROUTINE'
                      }
                      variant="green"
                      size="sm"
                      style={styles.cubbyBadge}
                      icon={
                        <Repeat
                          size={ResponsivePixels.size10}
                          color={Colors.GreenGracious}
                          strokeWidth={2.4}
                        />
                      }
                    />
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Ritual Schedule & Protocol with Depth Inside Box Flow */}
        <View style={styles.sectionWrapper}>
          <View style={styles.sectionHeaderRow}>
            <View style={styles.sectionHeaderLeft}>
              <Clock
                size={ResponsivePixels.size15}
                color={
                  isDarkMode ? Colors.SteelMist : Colors.WarmMutedTextLight
                }
                strokeWidth={2.2}
              />
              <Text
                style={[
                  styles.sectionHeaderTitle,
                  isDarkMode && styles.textWhite,
                ]}
              >
                Ritual Protocol
              </Text>
            </View>
            <View style={styles.sectionHeaderCapsule}>
              <Text style={styles.sectionHeaderCapsuleText}>
                CIRCADIAN CADENCE
              </Text>
            </View>
          </View>

          {/* 3 Independent Inset Depth Boxes following "Depth Inside Box Flow" */}
          <View style={styles.protocolDepthContainer}>
            {/* Box 1: Preferred Schedule */}
            <View
              style={[
                styles.protocolDepthBox,
                isDarkMode && styles.protocolDepthBoxDark,
              ]}
            >
              <View
                style={[
                  styles.protocolIconAura3D,
                  {
                    backgroundColor: categoryTheme.bgTint,
                    borderColor: categoryTheme.borderColor,
                  },
                  isDarkMode && styles.protocolIconAura3DDark,
                ]}
              >
                <Clock
                  size={ResponsivePixels.size18}
                  color={categoryTheme.iconColor}
                  strokeWidth={2.4}
                />
              </View>
              <View style={styles.protocolDepthInfo}>
                <Text style={styles.protocolMicroLabel}>
                  PREFERRED TIME WINDOW
                </Text>
                <Text
                  style={[
                    styles.protocolBoldValue,
                    isDarkMode && styles.textWhite,
                  ]}
                >
                  {habit.timeOfDay}
                </Text>
              </View>
              <Badge
                label={categoryTheme.label}
                variant={categoryTheme.badgeVariant}
                size="sm"
              />
            </View>

            {/* Box 2: Frequency & Recurrence Cadence */}
            <View
              style={[
                styles.protocolDepthBox,
                isDarkMode && styles.protocolDepthBoxDark,
              ]}
            >
              <View
                style={[
                  styles.protocolIconAura3D,
                  {
                    backgroundColor: Colors.MindfulLightBg,
                    borderColor: Colors.MindfulLightBorder,
                  },
                  isDarkMode && styles.protocolIconAura3DDark,
                ]}
              >
                <Repeat
                  size={ResponsivePixels.size18}
                  color={Colors.LavenderPurple}
                  strokeWidth={2.4}
                />
              </View>
              <View style={styles.protocolDepthInfo}>
                <Text style={styles.protocolMicroLabel}>
                  CADENCE & RECURRENCE
                </Text>
                <Text
                  style={[
                    styles.protocolBoldValue,
                    isDarkMode && styles.textWhite,
                  ]}
                >
                  {habit.frequency}
                </Text>
              </View>
              <Badge label="RECURRING" variant="purple" size="sm" />
            </View>

            {/* Box 3: Ritual Focus Domain */}
            <View
              style={[
                styles.protocolDepthBox,
                isDarkMode && styles.protocolDepthBoxDark,
              ]}
            >
              <View
                style={[
                  styles.protocolIconAura3D,
                  {
                    backgroundColor: categoryTheme.bgTint,
                    borderColor: categoryTheme.borderColor,
                  },
                  isDarkMode && styles.protocolIconAura3DDark,
                ]}
              >
                <IconComponent
                  size={ResponsivePixels.size18}
                  color={categoryTheme.iconColor}
                  strokeWidth={2.4}
                />
              </View>
              <View style={styles.protocolDepthInfo}>
                <Text style={styles.protocolMicroLabel}>
                  RITUAL FOCUS DOMAIN
                </Text>
                <Text
                  style={[
                    styles.protocolBoldValue,
                    isDarkMode && styles.textWhite,
                  ]}
                >
                  {categoryTheme.label.charAt(0) +
                    categoryTheme.label.slice(1).toLowerCase()}{' '}
                  Rituals
                </Text>
              </View>
              <Badge label="ACTIVE" variant="neutral" size="sm" />
            </View>
          </View>
        </View>

        {/* Extraordinary Regius Vocal Motivation Surface */}
        <View style={styles.sectionWrapper}>
          <View style={styles.sectionHeaderRow}>
            <View style={styles.sectionHeaderLeft}>
              <Volume2
                size={ResponsivePixels.size15}
                color={
                  isDarkMode ? Colors.SteelMist : Colors.WarmMutedTextLight
                }
                strokeWidth={2.2}
              />
              <Text
                style={[
                  styles.sectionHeaderTitle,
                  isDarkMode && styles.textWhite,
                ]}
              >
                Regius Vocal Motivation
              </Text>
            </View>
            <View style={styles.sectionHeaderCapsule}>
              <Text style={styles.sectionHeaderCapsuleText}>
                SIA NEURAL AUDIO
              </Text>
            </View>
          </View>

          <HabitVocalMotivationCard
            habitTitle={habit.title}
            timeOfDay={habit.timeOfDay}
            category={habit.category}
            accentColor={categoryTheme.accent}
            isPlaying={isPlayingMotivation}
            onTogglePlay={handleToggleVocalMotivation}
          />
        </View>

        {/* Mindful Philosophy Keepsake Card */}
        <View style={styles.sectionWrapper}>
          <View style={styles.sectionHeaderRow}>
            <View style={styles.sectionHeaderLeft}>
              <Quote
                size={ResponsivePixels.size15}
                color={
                  isDarkMode ? Colors.SteelMist : Colors.WarmMutedTextLight
                }
                strokeWidth={2.2}
              />
              <Text
                style={[
                  styles.sectionHeaderTitle,
                  isDarkMode && styles.textWhite,
                ]}
              >
                Philosophy & Intention
              </Text>
            </View>
            <View style={styles.sectionHeaderCapsule}>
              <Text style={styles.sectionHeaderCapsuleText}>DAILY CODEX</Text>
            </View>
          </View>

          <HabitPhilosophyKeepsakeCard
            category={habit.category}
            accentColor={categoryTheme.accent}
          />
        </View>

        {/* Destructive Delete Button */}
        <View style={styles.deleteSection}>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleDelete}
            style={[styles.deleteBtn, isDarkMode && styles.deleteBtnDark]}
            accessibilityRole="button"
            accessibilityLabel={`Delete ${habit.title}`}
          >
            <Trash2
              size={ResponsivePixels.size16}
              color={Colors.CategoryRedAccent}
              strokeWidth={2.2}
            />
            <Text style={styles.deleteBtnText}>Delete Habit Ritual</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Sticky Bottom Action Dock with Standardized StickyBottomButton */}
      <StickyActionDock>
        <StickyBottomButton
          title={isCompleted ? 'Ritual Checked In' : 'Check In For Today'}
          onPress={handleToggle}
          variant={isCompleted ? 'dark' : 'primary'}
          icon={
            isCompleted ? (
              <RotateCw
                size={ResponsivePixels.size18}
                color={Colors.PureWhite}
                strokeWidth={2.4}
              />
            ) : (
              <Flame
                size={ResponsivePixels.size18}
                color={Colors.PureWhite}
                strokeWidth={2.4}
              />
            )
          }
          accessibilityLabel={
            isCompleted
              ? 'Reset habit ritual status'
              : 'Check in habit ritual for today'
          }
        />
      </StickyActionDock>

      {/* Edit Habit Modal */}
      <AddHabitModal
        visible={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        habitToEdit={habit}
        onCreateHabit={() => {}}
        onUpdateHabit={(id, habitData) => {
          updateHabit(id, habitData);
          setIsEditModalOpen(false);
          Toast.show({
            type: 'success',
            text1: 'Habit Updated',
            text2: 'Ritual parameters successfully updated.',
          });
        }}
        onDeleteHabit={id => {
          deleteHabit(id);
          setIsEditModalOpen(false);
          navigation.goBack();
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.CreamBackground,
  },
  containerDark: {
    backgroundColor: Colors.DarkBackground,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: ResponsivePixels.size16,
    gap: ResponsivePixels.size16,
  },
  headerRightGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ResponsivePixels.size8,
  },
  notFoundCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: ResponsivePixels.size12,
  },
  notFoundText: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: ResponsivePixels.size15,
    color: Colors.DarkBorder,
  },
  notFoundTextDark: {
    color: Colors.Gray300,
  },
  backBtnFallback: {
    paddingHorizontal: ResponsivePixels.size16,
    paddingVertical: ResponsivePixels.size8,
    backgroundColor: Colors.NeroBlack,
    borderRadius: ResponsivePixels.size14,
  },
  backBtnFallbackText: {
    fontFamily: Fonts.poppins.medium,
    fontSize: ResponsivePixels.size13,
    color: Colors.PureWhite,
  },

  // 2-Layer Hero Bento Card Architecture (DESIGN_SYSTEM.md § 4.3.1)
  cardShadowWrapper: {
    width: '100%',
    borderRadius: ResponsivePixels.size24,
    backgroundColor: Colors.NeroBlack,
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
  card: {
    position: 'relative',
    backgroundColor: Colors.NeroBlack,
    borderRadius: ResponsivePixels.size24,
    borderWidth: 4,
    borderColor: withAlpha(Colors.PureWhite, 0.9),
    overflow: 'hidden',
  },
  bentoContent: {
    padding: ResponsivePixels.size20,
    gap: ResponsivePixels.size12,
  },
  bentoTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  frostedDomainPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ResponsivePixels.size5,
    backgroundColor: withAlpha(Colors.PureWhite, 0.12),
    paddingHorizontal: ResponsivePixels.size8,
    paddingVertical: ResponsivePixels.size4,
    borderRadius: ResponsivePixels.size12,
    borderWidth: 1,
    borderColor: withAlpha(Colors.PureWhite, 0.18),
  },
  frostedDomainText: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: ResponsivePixels.size10,
    letterSpacing: 0.3,
  },
  bentoTitle: {
    fontFamily: Fonts.poppins.bold,
    fontSize: ResponsivePixels.size22,
    color: Colors.PureWhite,
    lineHeight: ResponsivePixels.size28,
  },
  streakShowcaseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: withAlpha(Colors.PureWhite, 0.07),
    borderRadius: ResponsivePixels.size14,
    borderWidth: 1,
    borderColor: withAlpha(Colors.PureWhite, 0.12),
    paddingHorizontal: ResponsivePixels.size12,
    paddingVertical: ResponsivePixels.size8,
    gap: ResponsivePixels.size10,
  },
  flameAuraContainer: {
    width: ResponsivePixels.size34,
    height: ResponsivePixels.size34,
    borderRadius: ResponsivePixels.size17,
    backgroundColor: withAlpha(Colors.AccentAmber, 0.18),
    borderWidth: 1.5,
    borderColor: withAlpha(Colors.AccentAmber, 0.35),
    alignItems: 'center',
    justifyContent: 'center',
  },
  streakTextWrap: {
    flex: 1,
  },
  streakValueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: ResponsivePixels.size5,
  },
  streakNumber: {
    fontFamily: Fonts.ranade.bold,
    fontSize: ResponsivePixels.size22,
    lineHeight: ResponsivePixels.size25,
    color: Colors.AccentYellow,
    letterSpacing: -0.4,
  },
  streakUnit: {
    fontFamily: Fonts.poppins.bold,
    fontSize: ResponsivePixels.size10,
    color: Colors.PureWhite,
    letterSpacing: 0.5,
  },
  streakSublabel: {
    fontFamily: Fonts.poppins.regular,
    fontSize: ResponsivePixels.size10,
    color: Colors.CoolSilverSubtitle,
    marginTop: ResponsivePixels.size1,
  },

  // Sections
  sectionWrapper: {
    marginBottom: ResponsivePixels.size16,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: ResponsivePixels.size4,
    marginBottom: ResponsivePixels.size8,
  },
  sectionHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ResponsivePixels.size6,
  },
  sectionHeaderTitle: {
    fontFamily: Fonts.poppins.bold,
    fontSize: ResponsivePixels.size14,
    color: Colors.RegiusInk,
    letterSpacing: 0.1,
  },
  sectionHeaderCapsule: {
    backgroundColor: withAlpha(Colors.LavenderPurple, 0.12),
    paddingHorizontal: ResponsivePixels.size8,
    paddingVertical: ResponsivePixels.size3,
    borderRadius: ResponsivePixels.size10,
  },
  sectionHeaderCapsuleText: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: ResponsivePixels.size9,
    color: Colors.LavenderPurple,
    letterSpacing: 0.5,
  },

  // Consistency Matrix - Cupboard Architecture
  cupboardShadowWrapper: {
    width: '100%',
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
    marginBottom: ResponsivePixels.size4,
  },
  cupboardCard: {
    position: 'relative',
    backgroundColor: Colors.NeroBlack,
    borderRadius: ResponsivePixels.size24,
    borderWidth: 3.5,
    borderColor: withAlpha(Colors.PureWhite, 0.88),
    overflow: 'hidden',
    padding: ResponsivePixels.size12,
    gap: ResponsivePixels.size10,
  },
  streakWindowBox: {
    backgroundColor: Colors.DetailLightSurface,
    borderRadius: ResponsivePixels.size16,
    borderTopWidth: 1.5,
    borderTopColor: Colors.PureWhite,
    borderBottomWidth: 3,
    borderBottomColor: Colors.DetailWarmBevelBottom,
    borderLeftWidth: 1.2,
    borderRightWidth: 1.2,
    borderLeftColor: Colors.DetailWarmBevelSide,
    borderRightColor: Colors.DetailWarmBevelSide,
    paddingTop: ResponsivePixels.size10,
    paddingBottom: ResponsivePixels.size8,
    paddingHorizontal: ResponsivePixels.size8,
    ...Platform.select({
      ios: {
        shadowColor: Colors.PureBlack,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.18,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  cupboardWindowDark: {
    backgroundColor: Colors.DetailDarkSectionBg,
    borderTopColor: Colors.DetailDarkTopBevel,
    borderBottomColor: Colors.DetailDarkBevelBottom,
    borderLeftColor: Colors.DetailDarkSideBevel,
    borderRightColor: Colors.DetailDarkSideBevel,
  },
  streakWindowHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: ResponsivePixels.size8,
    paddingHorizontal: ResponsivePixels.size2,
  },
  streakWindowHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ResponsivePixels.size5,
  },
  streakWindowHeaderTitle: {
    fontFamily: Fonts.poppins.bold,
    fontSize: ResponsivePixels.size9,
    color: Colors.RegiusInk,
    letterSpacing: 0.6,
  },
  weekdaysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: ResponsivePixels.size2,
  },
  dayCol: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: ResponsivePixels.size8,
    paddingVertical: ResponsivePixels.size4,
  },
  dayCapsule: {
    paddingHorizontal: ResponsivePixels.size6,
    paddingVertical: ResponsivePixels.size2,
    borderRadius: ResponsivePixels.size8,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  dayCapsuleCompleted: {
    backgroundColor: withAlpha(Colors.PureBlack, 0.04),
  },
  dayCapsulePending: {
    backgroundColor: Colors.Transparent,
  },
  dayCapsuleToday: {
    backgroundColor: Colors.EventLightBg,
    borderWidth: 1,
    borderColor: Colors.StreakFlameOrangeTop,
    borderBottomWidth: 2,
    borderBottomColor: Colors.EventTextAccent,
    ...Platform.select({
      ios: {
        shadowColor: Colors.AccentAmber,
        shadowOffset: { width: 0, height: 1.5 },
        shadowOpacity: 0.22,
        shadowRadius: 2.5,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  dayCapsuleDark: {
    backgroundColor: withAlpha(Colors.PureWhite, 0.06),
  },
  dayCapsuleTodayDark: {
    backgroundColor: withAlpha(Colors.AccentAmber, 0.2),
    borderColor: Colors.StreakFlameOrangeTop,
    borderBottomColor: Colors.EventTextAccent,
  },
  dayName: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: ResponsivePixels.size9,
    color: Colors.DetailMutedSlate,
    letterSpacing: 0.2,
  },
  dayNameDark: {
    color: Colors.SteelMist,
  },
  dayNameToday: {
    fontFamily: Fonts.poppins.bold,
    fontSize: ResponsivePixels.size9,
    color: Colors.BadgeYellowText,
    letterSpacing: 0.3,
  },
  dayNameTodayDark: {
    color: Colors.StreakFlameOrangeTop,
  },
  dayIconWrap: {
    width: ResponsivePixels.size30,
    height: ResponsivePixels.size30,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  cubbiesRow: {
    flexDirection: 'row',
    gap: ResponsivePixels.size8,
  },
  statCubbyBox: {
    flex: 1,
    backgroundColor: Colors.DetailLightSurface,
    borderRadius: ResponsivePixels.size16,
    borderTopWidth: 1.5,
    borderTopColor: Colors.PureWhite,
    borderBottomWidth: 3,
    borderBottomColor: Colors.DetailWarmBevelBottom,
    borderLeftWidth: 1.2,
    borderRightWidth: 1.2,
    borderLeftColor: Colors.DetailWarmBevelSide,
    borderRightColor: Colors.DetailWarmBevelSide,
    paddingTop: ResponsivePixels.size12,
    paddingBottom: ResponsivePixels.size12,
    paddingHorizontal: ResponsivePixels.size6,
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: ResponsivePixels.size122,
    ...Platform.select({
      ios: {
        shadowColor: Colors.PureBlack,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.18,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  cubby3DDisc: {
    width: ResponsivePixels.size26,
    height: ResponsivePixels.size26,
    borderRadius: ResponsivePixels.size13,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: Colors.PureWhite,
    borderBottomWidth: 2,
    ...Platform.select({
      ios: {
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.22,
        shadowRadius: 3,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  streakDisc: {
    backgroundColor: Colors.EventLightBg,
    borderBottomColor: Colors.BadgeOrangeBevel,
    shadowColor: Colors.AccentAmber,
  },
  consistencyDisc: {
    backgroundColor: Colors.BadgePurpleBg,
    borderBottomColor: Colors.BadgePurpleBevel,
    shadowColor: Colors.LavenderPurple,
  },
  cadenceDisc: {
    backgroundColor: Colors.BadgeGreenBg,
    borderBottomColor: Colors.BadgeGreenBevel,
    shadowColor: Colors.GreenGracious,
  },
  cubbyMetricCluster: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    gap: ResponsivePixels.size3,
  },
  cubbyValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  cubbyValueBig: {
    fontFamily: Fonts.ranade.bold,
    fontSize: ResponsivePixels.size20,
    lineHeight: ResponsivePixels.size23,
    color: Colors.RegiusInk,
    letterSpacing: -0.3,
    textAlign: 'center',
  },
  cubbyCadenceText: {
    fontFamily: Fonts.ranade.bold,
    fontSize: ResponsivePixels.size16,
    lineHeight: ResponsivePixels.size23,
    color: Colors.RegiusInk,
    textAlign: 'center',
  },
  cubbyLabel: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: ResponsivePixels.size8,
    color: Colors.MilestoneSlate,
    letterSpacing: 0.3,
    textAlign: 'center',
    alignSelf: 'center',
    width: '100%',
  },
  miniMeterTrack: {
    width: '76%',
    alignSelf: 'center',
    height: ResponsivePixels.size3,
    borderRadius: ResponsivePixels.size2,
    overflow: 'hidden',
    marginTop: ResponsivePixels.size2,
  },
  miniMeterTrackAmber: {
    backgroundColor: Colors.EventPillSoftLight,
  },
  miniMeterTrackPurple: {
    backgroundColor: Colors.MindfulPillTintLight,
  },
  miniMeterTrackGreen: {
    backgroundColor: Colors.WellnessPillLightBg,
  },
  miniMeterFill: {
    height: '100%',
    borderRadius: ResponsivePixels.size2,
  },
  miniMeterFillAmber: {
    backgroundColor: Colors.AccentAmber,
  },
  miniMeterFillPurple: {
    backgroundColor: Colors.LavenderPurple,
  },
  miniMeterFillGreen: {
    backgroundColor: Colors.GreenGracious,
  },
  cubbyBadgeWrap: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cubbyBadge: {
    alignSelf: 'center',
  },
  matrixDivider: {
    height: 1,
    backgroundColor: Colors.CreamBorderSubtle,
    marginVertical: ResponsivePixels.size10,
  },
  matrixDividerDark: {
    backgroundColor: Colors.CarbonSlate,
  },

  // Protocol Depth Architecture - Inset Box Flow
  protocolDepthContainer: {
    gap: ResponsivePixels.size10,
  },
  protocolDepthBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.DetailLightSurface,
    borderRadius: ResponsivePixels.size18,
    borderWidth: 1.2,
    borderTopWidth: 1.5,
    borderTopColor: Colors.PureWhite,
    borderBottomWidth: 3.5,
    borderBottomColor: Colors.DetailWarmBevelBottom,
    borderColor: Colors.DetailWarmBorder,
    paddingVertical: ResponsivePixels.size12,
    paddingHorizontal: ResponsivePixels.size14,
    gap: ResponsivePixels.size12,
    ...Platform.select({
      ios: {
        shadowColor: Colors.RegiusInk,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  protocolDepthBoxDark: {
    backgroundColor: Colors.DetailDarkElevatedCard,
    borderTopColor: withAlpha(Colors.PureWhite, 0.12),
    borderBottomColor: Colors.DetailCardBottomBevel,
    borderColor: Colors.DetailDarkBorder,
  },
  protocolIconAura3D: {
    width: ResponsivePixels.size38,
    height: ResponsivePixels.size38,
    borderRadius: ResponsivePixels.size19,
    borderWidth: 1.2,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: Colors.PureBlack,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 3,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  protocolIconAura3DDark: {
    backgroundColor: withAlpha(Colors.PureWhite, 0.08),
    borderColor: withAlpha(Colors.PureWhite, 0.15),
  },
  protocolDepthInfo: {
    flex: 1,
    gap: ResponsivePixels.size2,
  },
  protocolMicroLabel: {
    fontFamily: Fonts.poppins.bold,
    fontSize: ResponsivePixels.size9,
    color: Colors.MilestoneSlate,
    letterSpacing: 0.6,
  },
  protocolBoldValue: {
    fontFamily: Fonts.ranade.bold,
    fontSize: ResponsivePixels.size15,
    color: Colors.RegiusInk,
    letterSpacing: -0.2,
  },

  // Destructive Delete Button conforming to Danger Tokens
  deleteSection: {
    marginTop: ResponsivePixels.size4,
    marginBottom: ResponsivePixels.size16,
  },
  deleteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: ResponsivePixels.size8,
    backgroundColor: Colors.PureWhite,
    borderWidth: 1.5,
    borderColor: Colors.CategoryRoseBorder,
    paddingVertical: ResponsivePixels.size13,
    borderRadius: ResponsivePixels.size18,
    ...Platform.select({
      ios: {
        shadowColor: Colors.CategoryRedAccent,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 6,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  deleteBtnDark: {
    backgroundColor: Colors.DarkCardBackground,
    borderColor: Colors.TaskDangerDarkBorder,
  },
  deleteBtnText: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: ResponsivePixels.size13,
    color: Colors.CategoryRedAccent,
  },

  // Helper Utility
  textWhite: {
    color: Colors.PureWhite,
  },
});

export default HabitDetailsScreen;
