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
  Dimensions,
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
  VolumeX,
  Trash2,
  Calendar,
  Quote,
  Zap,
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
import { Typography } from '../../Theme/Typographys';
import { Colors } from '../../Assets/StyleUtilities/Colors';
import ResponsivePixels from '../../Assets/StyleUtilities/ResponsivePixels';
import { useTheme } from '../../Theme/ThemeContext';
import { useTaskReminder, HabitItem } from '../../Context/TaskReminderContext';
import {
  SubScreenHeader,
  SUB_SCREEN_HEADER_HEIGHT,
} from '../../Common/SubScreenHeader';
import { useScrollReactiveHeader } from '../../Common/useScrollReactiveHeader';
import { Badge, BadgeVariant } from '../../Common/Badge';
import { HeaderActionButton } from '../../Common/HeaderActionButton';
import { StickyActionDock } from '../../Common/StickyActionDock';
import CustomButton from '../../Common/CustomButton';
import AddHabitModal from '../../Components/AddHabitModal';
import { KokoroTTSService } from '../../Services/Kokoro/KokoroTTSService';
import { AudioPlayerService } from '../../Services/AudioPlayerService';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
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
            <Stop offset="0%" stopColor="#252733" stopOpacity={0.8} />
            <Stop offset="50%" stopColor="#1B1D25" stopOpacity={0.4} />
            <Stop offset="100%" stopColor="#121318" stopOpacity={0.9} />
          </LinearGradient>

          {/* Fiery Flame Aura */}
          <RadialGradient
            id="flameHeroGlow"
            cx="25%"
            cy="40%"
            rx="60%"
            ry="60%"
          >
            <Stop offset="0%" stopColor="#FF9800" stopOpacity={0.32} />
            <Stop offset="45%" stopColor="#E65100" stopOpacity={0.14} />
            <Stop offset="100%" stopColor="#121318" stopOpacity={0} />
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
            <Stop offset="100%" stopColor="#121318" stopOpacity={0} />
          </RadialGradient>
        </Defs>

        <Rect width="100%" height="100%" fill="url(#heroBentoBg)" />
        <Rect width="100%" height="100%" fill="url(#flameHeroGlow)" />
        <Rect width="100%" height="100%" fill="url(#accentHeroGlow)" />

        <Circle
          cx={300}
          cy={40}
          r={50}
          stroke="rgba(255, 255, 255, 0.12)"
          strokeWidth={1}
          fill="none"
        />
        <Circle
          cx={300}
          cy={40}
          r={85}
          stroke="rgba(255, 255, 255, 0.05)"
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
            <Stop offset="0%" stopColor="#252733" stopOpacity={0.92} />
            <Stop offset="50%" stopColor="#1B1D25" stopOpacity={0.65} />
            <Stop offset="100%" stopColor="#121318" stopOpacity={0.96} />
          </LinearGradient>

          {/* Fiery Amber Glow behind Streak Showcase */}
          <RadialGradient
            id="cupboardAmberGlow"
            cx="30%"
            cy="25%"
            rx="60%"
            ry="55%"
          >
            <Stop offset="0%" stopColor="#FF9800" stopOpacity={0.25} />
            <Stop offset="55%" stopColor="#E65100" stopOpacity={0.08} />
            <Stop offset="100%" stopColor="#121318" stopOpacity={0} />
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
            <Stop offset="100%" stopColor="#121318" stopOpacity={0} />
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
          stroke="rgba(255, 255, 255, 0.12)"
          strokeWidth={1}
          fill="none"
        />
        <Circle
          cx={310}
          cy={35}
          r={90}
          stroke="rgba(255, 255, 255, 0.05)"
          strokeWidth={1}
          strokeDasharray="4 6"
          fill="none"
        />
        <Circle cx={285} cy={18} r={1.6} fill="#FFFFFF" opacity={0.65} />
        <Circle cx={35} cy={165} r={1.4} fill="#F5C518" opacity={0.5} />
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
            <Stop offset="0%" stopColor="#FFA726" />
            <Stop offset="100%" stopColor="#FF9800" />
          </LinearGradient>
        </Defs>
        <Path
          d={flamePath}
          fill="url(#streakFlameFilledGrad)"
          stroke="#E65100"
          strokeWidth={1}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    );
  }

  // Pending / Incomplete day: ONLY bordered streak flame icon
  const pendingStroke = isToday
    ? '#FF9800'
    : isDarkMode
    ? '#4A4E5C'
    : '#C8C4B7';

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

  // Cleanup audio playback on screen unmount
  useEffect(() => {
    return () => {
      KokoroTTSService.stop().catch(() => {});
      AudioPlayerService.stop().catch(() => {});
    };
  }, []);

  // Category trios & harmonic tokens conforming to DESIGN_SYSTEM.md §2.3
  const categoryTheme = useMemo(() => {
    const baseTheme = {
      label: 'MINDFUL',
      badgeVariant: 'purple' as BadgeVariant,
      accent: Colors.LavenderPurple,
      bgTint: '#EFF2FE',
      borderColor: '#D8DBFF',
      icon: Sparkles,
      iconColor: '#7059C8',
      quote:
        '“We are what we repeatedly do. Excellence, then, is not an act, but a daily habit.”',
      sublabel: 'Midday Mindful Routine',
    };

    if (habit?.category === 'morning') {
      return {
        label: 'MORNING',
        badgeVariant: 'yellow' as BadgeVariant,
        accent: '#F5C518',
        bgTint: '#FFF8D0',
        borderColor: '#FFF5B8',
        icon: Sun,
        iconColor: '#B47804',
        quote:
          '“The secret of your future is hidden in your daily routine. Own the morning.”',
        sublabel: 'Dawn Circadian Ritual',
      };
    }
    if (habit?.category === 'evening') {
      return {
        label: 'EVENING',
        badgeVariant: 'orange' as BadgeVariant,
        accent: '#EA580C',
        bgTint: '#FFF2E6',
        borderColor: '#FFE0D3',
        icon: Moon,
        iconColor: '#D95D0F',
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
        text1: updated.completed ? 'Ritual Checked In! 🔥' : 'Habit Reset',
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

    if (isPlayingMotivation) {
      await KokoroTTSService.stop();
      await AudioPlayerService.stop();
      setIsPlayingMotivation(false);
    } else {
      setIsPlayingMotivation(true);
      const spokenText = `Regius will chime at ${habit.timeOfDay} to ignite your ${habit.title} ritual.`;
      const unsub = AudioPlayerService.onPlaybackFinished(() => {
        setIsPlayingMotivation(false);
        unsub();
      });

      try {
        await KokoroTTSService.speak(spokenText);
      } catch {
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
      {/* Scroll-Reactive Luxury SubScreenHeader */}
      <SubScreenHeader
        title="Habit Details"
        subtitle={categoryTheme.sublabel}
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
            paddingBottom: insets.bottom + ResponsivePixels.size75,
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
              <Text style={styles.bentoTitle} numberOfLines={2}>
                {habit.title}
              </Text>

              {/* Fiery Streak Showcase */}
              <View style={styles.streakShowcaseRow}>
                <View style={styles.flameAuraContainer}>
                  <Flame
                    size={ResponsivePixels.size18}
                    color="#FF9800"
                    fill="#FF9800"
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
                color={isDarkMode ? '#A3A8B1' : '#7A766E'}
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
                      color="#FF9800"
                      fill="#FF9800"
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
                      color="#E65100"
                      fill="#FF9800"
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
                          color="#E65100"
                          fill="#FF9800"
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
                      color="#1B9A72"
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
                          color="#1B9A72"
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

        {/* Ritual Schedule & Protocol */}
        <View style={styles.sectionWrapper}>
          <View style={styles.sectionHeaderRow}>
            <View style={styles.sectionHeaderLeft}>
              <Clock
                size={ResponsivePixels.size16}
                color={isDarkMode ? '#A3A8B1' : '#7A766E'}
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
          </View>

          <View
            style={[styles.tactileCard, isDarkMode && styles.tactileCardDark]}
          >
            {/* Preferred Circadian Window */}
            <View style={styles.protocolRow}>
              <View
                style={[
                  styles.protocolIconAura,
                  { backgroundColor: categoryTheme.bgTint },
                  isDarkMode && styles.protocolIconAuraDark,
                ]}
              >
                <Clock
                  size={ResponsivePixels.size18}
                  color={categoryTheme.iconColor}
                  strokeWidth={2.2}
                />
              </View>
              <View style={styles.protocolInfo}>
                <Text style={styles.protocolLabel}>Preferred Schedule</Text>
                <Text
                  style={[styles.protocolValue, isDarkMode && styles.textWhite]}
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

            <View
              style={[
                styles.cardDivider,
                isDarkMode && styles.matrixDividerDark,
              ]}
            />

            {/* Recurrence Cadence */}
            <View style={styles.protocolRow}>
              <View
                style={[
                  styles.protocolIconAura,
                  { backgroundColor: '#EFF2FE' },
                  isDarkMode && styles.protocolIconAuraDark,
                ]}
              >
                <Repeat
                  size={ResponsivePixels.size18}
                  color={Colors.LavenderPurple}
                  strokeWidth={2.2}
                />
              </View>
              <View style={styles.protocolInfo}>
                <Text style={styles.protocolLabel}>Frequency</Text>
                <Text
                  style={[styles.protocolValue, isDarkMode && styles.textWhite]}
                >
                  {habit.frequency}
                </Text>
              </View>
              <Badge label="RECURRING" variant="purple" size="sm" />
            </View>

            <View
              style={[
                styles.cardDivider,
                isDarkMode && styles.matrixDividerDark,
              ]}
            />

            {/* Category Focus Domain */}
            <View style={styles.protocolRow}>
              <View
                style={[
                  styles.protocolIconAura,
                  { backgroundColor: categoryTheme.bgTint },
                  isDarkMode && styles.protocolIconAuraDark,
                ]}
              >
                <IconComponent
                  size={ResponsivePixels.size18}
                  color={categoryTheme.iconColor}
                  strokeWidth={2.2}
                />
              </View>
              <View style={styles.protocolInfo}>
                <Text style={styles.protocolLabel}>Ritual Domain</Text>
                <Text
                  style={[styles.protocolValue, isDarkMode && styles.textWhite]}
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

        {/* Neural Voice Assistant Guidance */}
        <View style={styles.sectionWrapper}>
          <View style={styles.sectionHeaderRow}>
            <View style={styles.sectionHeaderLeft}>
              <Volume2
                size={ResponsivePixels.size16}
                color={isDarkMode ? '#A3A8B1' : '#7A766E'}
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
          </View>

          <View
            style={[
              styles.voiceNudgeCard,
              isDarkMode && styles.voiceNudgeCardDark,
            ]}
          >
            <View style={styles.voiceHeaderRow}>
              <View
                style={[
                  styles.voicePillTag,
                  isDarkMode && styles.voicePillTagDark,
                ]}
              >
                <Volume2
                  size={ResponsivePixels.size12}
                  color={Colors.LavenderPurple}
                  strokeWidth={2.4}
                />
                <Text style={styles.voicePillText}>Sia Neural Nudge</Text>
              </View>

              <TouchableOpacity
                activeOpacity={0.75}
                onPress={handleToggleVocalMotivation}
                style={[
                  styles.voiceAudioBtn,
                  isPlayingMotivation && styles.voiceAudioBtnPlaying,
                ]}
                accessibilityRole="button"
                accessibilityLabel="Preview Sia vocal motivation"
              >
                {isPlayingMotivation ? (
                  <>
                    <VolumeX
                      size={ResponsivePixels.size12}
                      color="#FFFFFF"
                      strokeWidth={2.4}
                    />
                    <Text style={styles.voiceAudioBtnTextActive}>STOP</Text>
                  </>
                ) : (
                  <>
                    <Volume2
                      size={ResponsivePixels.size12}
                      color={Colors.LavenderPurple}
                      strokeWidth={2.4}
                    />
                    <Text style={styles.voiceAudioBtnText}>LISTEN</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>

            <Text
              style={[
                styles.voiceQuoteText,
                isDarkMode && styles.voiceQuoteTextDark,
              ]}
            >
              “Regius will chime at {habit.timeOfDay} to ignite your{' '}
              {habit.title.toLowerCase()} ritual.”
            </Text>
          </View>
        </View>

        {/* Philosophy & Intention Quote */}
        <View style={styles.sectionWrapper}>
          <View
            style={[
              styles.philosophyCard,
              isDarkMode && styles.philosophyCardDark,
            ]}
          >
            <Quote
              size={ResponsivePixels.size20}
              color={categoryTheme.accent}
              strokeWidth={2}
              style={styles.quoteIcon}
            />
            <Text
              style={[
                styles.philosophyQuote,
                isDarkMode && styles.philosophyQuoteDark,
              ]}
            >
              {categoryTheme.quote}
            </Text>
            <Text style={styles.philosophySignoff}>
              Mindful Ritual Architecture · Regius Habit Flow
            </Text>
          </View>
        </View>

        {/* Destructive Delete Action: Conforming to Danger Tokens */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={handleDelete}
          style={[
            styles.deleteActionBtn,
            isDarkMode && styles.deleteActionBtnDark,
          ]}
          accessibilityRole="button"
          accessibilityLabel="Delete habit ritual"
        >
          <Trash2
            size={ResponsivePixels.size15}
            color="#D92A0F"
            strokeWidth={2.2}
          />
          <Text style={styles.deleteActionText}>Delete Habit Ritual</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Sticky Action Dock with Primary Luxury Button */}
      <StickyActionDock>
        <Animated.View
          style={[styles.dockRow, { transform: [{ scale: scaleAnim }] }]}
        >
          <CustomButton
            title={isCompleted ? 'Completed Today ✓' : 'Check In For Today 🔥'}
            onPress={handleToggle}
            variant="dark"
            style={
              isCompleted
                ? styles.dockPrimaryBtnCompleted
                : styles.dockPrimaryBtnPending
            }
            buttonTextStyle={styles.dockButtonText}
            disableAllCaps
          />
        </Animated.View>
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
    backgroundColor: '#121417',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: ResponsivePixels.size10,
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
    padding: ResponsivePixels.size20,
    gap: ResponsivePixels.size16,
  },
  notFoundText: {
    fontFamily: Fonts.poppins.medium,
    fontSize: ResponsivePixels.size16,
    color: '#7A766E',
  },
  notFoundTextDark: {
    color: '#A3A8B1',
  },
  backBtnFallback: {
    paddingHorizontal: ResponsivePixels.size20,
    paddingVertical: ResponsivePixels.size10,
    backgroundColor: Colors.MidnightCharcoal,
    borderRadius: ResponsivePixels.size20,
  },
  backBtnFallbackText: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: ResponsivePixels.size14,
    color: '#FFFFFF',
  },

  // 2-Layer Hero Bento Card Architecture (DESIGN_SYSTEM.md § 4.3.1)
  cardShadowWrapper: {
    width: '100%',
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.28,
        shadowRadius: 18,
      },
      android: {
        elevation: 8,
      },
    }),
    marginBottom: ResponsivePixels.size14,
  },
  card: {
    position: 'relative',
    backgroundColor: Colors.NeroBlack,
    borderRadius: ResponsivePixels.size20,
    borderWidth: 3.5,
    borderColor: 'rgba(255, 255, 255, 0.9)',
    overflow: 'hidden',
  },
  bentoContent: {
    paddingHorizontal: ResponsivePixels.size14,
    paddingTop: ResponsivePixels.size14,
    paddingBottom: ResponsivePixels.size14,
    gap: ResponsivePixels.size10,
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
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    paddingHorizontal: ResponsivePixels.size8,
    paddingVertical: ResponsivePixels.size4,
    borderRadius: ResponsivePixels.size12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.18)',
  },
  frostedDomainText: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: ResponsivePixels.size10,
    letterSpacing: 0.3,
  },
  bentoTitle: {
    fontFamily: Fonts.ranade.bold,
    fontSize: ResponsivePixels.size17,
    lineHeight: ResponsivePixels.size22,
    color: Colors.DefaultWhite,
    letterSpacing: -0.3,
    marginTop: ResponsivePixels.size2,
  },
  streakShowcaseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.07)',
    borderRadius: ResponsivePixels.size14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    paddingHorizontal: ResponsivePixels.size12,
    paddingVertical: ResponsivePixels.size8,
    gap: ResponsivePixels.size10,
  },
  flameAuraContainer: {
    width: ResponsivePixels.size34,
    height: ResponsivePixels.size34,
    borderRadius: ResponsivePixels.size17,
    backgroundColor: 'rgba(255, 152, 0, 0.18)',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 152, 0, 0.35)',
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
    color: '#F5C518',
    letterSpacing: -0.4,
  },
  streakUnit: {
    fontFamily: Fonts.poppins.bold,
    fontSize: ResponsivePixels.size10,
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  streakSublabel: {
    fontFamily: Fonts.poppins.regular,
    fontSize: ResponsivePixels.size10,
    color: '#B6B9C3',
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
    color: '#1B1C19',
    letterSpacing: 0.1,
  },
  sectionHeaderCapsule: {
    backgroundColor: 'rgba(131, 131, 214, 0.12)',
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
  tactileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: ResponsivePixels.size18,
    borderWidth: 1.5,
    borderColor: '#ECE7DC',
    padding: ResponsivePixels.size14,
    ...Platform.select({
      ios: {
        shadowColor: '#1B1C19',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  tactileCardDark: {
    backgroundColor: '#1E2228',
    borderColor: '#2C3035',
  },

  // Consistency Matrix - Cupboard Architecture
  cupboardShadowWrapper: {
    width: '100%',
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
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
    borderColor: 'rgba(255, 255, 255, 0.88)',
    overflow: 'hidden',
    padding: ResponsivePixels.size12,
    gap: ResponsivePixels.size10,
  },
  streakWindowBox: {
    backgroundColor: '#FAF9F6',
    borderRadius: ResponsivePixels.size16,
    borderTopWidth: 1.5,
    borderTopColor: '#FFFFFF',
    borderBottomWidth: 3,
    borderBottomColor: '#D8D1C2',
    borderLeftWidth: 1.2,
    borderRightWidth: 1.2,
    borderLeftColor: '#E8E2D4',
    borderRightColor: '#E8E2D4',
    paddingTop: ResponsivePixels.size10,
    paddingBottom: ResponsivePixels.size8,
    paddingHorizontal: ResponsivePixels.size8,
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
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
    backgroundColor: '#161821',
    borderTopColor: '#363C4E',
    borderBottomColor: '#101116',
    borderLeftColor: '#282C38',
    borderRightColor: '#282C38',
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
    color: '#1B1C19',
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
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
  },
  dayCapsulePending: {
    backgroundColor: 'transparent',
  },
  dayCapsuleToday: {
    backgroundColor: '#FFF0DE',
    borderWidth: 1,
    borderColor: '#FFA726',
    borderBottomWidth: 2,
    borderBottomColor: '#E65100',
    ...Platform.select({
      ios: {
        shadowColor: '#FF9800',
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
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
  },
  dayCapsuleTodayDark: {
    backgroundColor: 'rgba(255, 152, 0, 0.2)',
    borderColor: '#FFA726',
    borderBottomColor: '#E65100',
  },
  dayName: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: ResponsivePixels.size9,
    color: '#7A808C',
    letterSpacing: 0.2,
  },
  dayNameDark: {
    color: '#A3A8B1',
  },
  dayNameToday: {
    fontFamily: Fonts.poppins.bold,
    fontSize: ResponsivePixels.size9,
    color: '#B47804',
    letterSpacing: 0.3,
  },
  dayNameTodayDark: {
    color: '#FFA726',
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
    backgroundColor: '#FAF9F6',
    borderRadius: ResponsivePixels.size16,
    borderTopWidth: 1.5,
    borderTopColor: '#FFFFFF',
    borderBottomWidth: 3,
    borderBottomColor: '#D8D1C2',
    borderLeftWidth: 1.2,
    borderRightWidth: 1.2,
    borderLeftColor: '#E8E2D4',
    borderRightColor: '#E8E2D4',
    paddingTop: ResponsivePixels.size12,
    paddingBottom: ResponsivePixels.size12,
    paddingHorizontal: ResponsivePixels.size6,
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: ResponsivePixels.size122,
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
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
    borderColor: '#FFFFFF',
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
    backgroundColor: '#FFF0DE',
    borderBottomColor: '#FFB86B',
    shadowColor: '#FF9800',
  },
  consistencyDisc: {
    backgroundColor: '#EEF0FD',
    borderBottomColor: '#B6BEF5',
    shadowColor: Colors.LavenderPurple,
  },
  cadenceDisc: {
    backgroundColor: '#E8FDF0',
    borderBottomColor: '#82E8A6',
    shadowColor: '#1B9A72',
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
    color: '#1B1C19',
    letterSpacing: -0.3,
    textAlign: 'center',
  },
  cubbyCadenceText: {
    fontFamily: Fonts.ranade.bold,
    fontSize: ResponsivePixels.size16,
    lineHeight: ResponsivePixels.size23,
    color: '#1B1C19',
    textAlign: 'center',
  },
  cubbyLabel: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: ResponsivePixels.size8,
    color: '#8E95A5',
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
    backgroundColor: '#FFE9D4',
  },
  miniMeterTrackPurple: {
    backgroundColor: '#EAE8FA',
  },
  miniMeterTrackGreen: {
    backgroundColor: '#DCF7E7',
  },
  miniMeterFill: {
    height: '100%',
    borderRadius: ResponsivePixels.size2,
  },
  miniMeterFillAmber: {
    backgroundColor: '#FF9800',
  },
  miniMeterFillPurple: {
    backgroundColor: Colors.LavenderPurple,
  },
  miniMeterFillGreen: {
    backgroundColor: '#1B9A72',
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
    backgroundColor: '#F0ECE1',
    marginVertical: ResponsivePixels.size10,
  },
  matrixDividerDark: {
    backgroundColor: '#2C3035',
  },

  // Protocol Rows
  protocolRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: ResponsivePixels.size3,
    gap: ResponsivePixels.size10,
  },
  protocolIconAura: {
    width: ResponsivePixels.size32,
    height: ResponsivePixels.size32,
    borderRadius: ResponsivePixels.size16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  protocolIconAuraDark: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  protocolInfo: {
    flex: 1,
  },
  protocolLabel: {
    fontFamily: Fonts.poppins.regular,
    fontSize: ResponsivePixels.size10,
    color: '#8E95A5',
  },
  protocolValue: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: ResponsivePixels.size12,
    color: '#1B1C19',
    marginTop: ResponsivePixels.size1,
  },
  cardDivider: {
    height: 1,
    backgroundColor: '#F3EFE6',
    marginVertical: ResponsivePixels.size8,
  },

  // Neural Voice Card
  voiceNudgeCard: {
    backgroundColor: '#F8F7FF',
    borderRadius: ResponsivePixels.size16,
    borderWidth: 1.5,
    borderColor: '#E0DEFA',
    padding: ResponsivePixels.size12,
    gap: ResponsivePixels.size8,
  },
  voiceNudgeCardDark: {
    backgroundColor: '#1B1D28',
    borderColor: '#2D3048',
  },
  voiceHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  voicePillTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ResponsivePixels.size5,
    backgroundColor: '#EFF2FE',
    paddingHorizontal: ResponsivePixels.size8,
    paddingVertical: ResponsivePixels.size3,
    borderRadius: ResponsivePixels.size10,
  },
  voicePillTagDark: {
    backgroundColor: 'rgba(131, 131, 214, 0.16)',
  },
  voicePillText: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: ResponsivePixels.size10,
    color: Colors.LavenderPurple,
  },
  voiceAudioBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ResponsivePixels.size4,
    backgroundColor: '#EFF2FE',
    paddingHorizontal: ResponsivePixels.size8,
    paddingVertical: ResponsivePixels.size4,
    borderRadius: ResponsivePixels.size12,
    borderWidth: 1,
    borderColor: '#D8DBFF',
  },
  voiceAudioBtnPlaying: {
    backgroundColor: '#FF3B30',
    borderColor: '#FF3B30',
  },
  voiceAudioBtnText: {
    fontFamily: Fonts.poppins.bold,
    fontSize: ResponsivePixels.size9,
    color: Colors.LavenderPurple,
    letterSpacing: 0.5,
  },
  voiceAudioBtnTextActive: {
    fontFamily: Fonts.poppins.bold,
    fontSize: ResponsivePixels.size9,
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  voiceQuoteText: {
    fontFamily: Fonts.poppins.medium,
    fontSize: ResponsivePixels.size11,
    lineHeight: ResponsivePixels.size16,
    color: '#3F454D',
    fontStyle: 'italic',
  },
  voiceQuoteTextDark: {
    color: '#A3A8B1',
  },

  // Philosophy Card
  philosophyCard: {
    backgroundColor: '#FAF8F3',
    borderRadius: ResponsivePixels.size16,
    borderWidth: 1.5,
    borderColor: '#ECE7DC',
    padding: ResponsivePixels.size14,
    alignItems: 'center',
    gap: ResponsivePixels.size6,
  },
  philosophyCardDark: {
    backgroundColor: '#181B21',
    borderColor: '#2C3035',
  },
  quoteIcon: {
    marginBottom: ResponsivePixels.size2,
  },
  philosophyQuote: {
    fontFamily: Fonts.poppins.medium,
    fontSize: ResponsivePixels.size12,
    lineHeight: ResponsivePixels.size18,
    color: '#55544E',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  philosophyQuoteDark: {
    color: '#A3A8B1',
  },
  philosophySignoff: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: ResponsivePixels.size9,
    color: '#8E95A5',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
    marginTop: ResponsivePixels.size3,
  },

  // Destructive Delete Button conforming to Danger Tokens
  deleteActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: ResponsivePixels.size5,
    paddingVertical: ResponsivePixels.size11,
    backgroundColor: '#FEEFEF',
    borderRadius: ResponsivePixels.size24,
    borderWidth: 1.2,
    borderColor: '#FED6D6',
    marginTop: ResponsivePixels.size2,
    marginBottom: ResponsivePixels.size8,
  },
  deleteActionBtnDark: {
    backgroundColor: '#2A1616',
    borderColor: '#4A2020',
  },
  deleteActionText: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: ResponsivePixels.size12,
    color: '#D92A0F',
  },

  // Sticky Action Dock
  dockRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  dockPrimaryBtnPending: {
    flex: 1,
    backgroundColor: Colors.MidnightCharcoal,
    borderRadius: ResponsivePixels.size24,
    paddingVertical: ResponsivePixels.size11,
    minHeight: ResponsivePixels.size44,
  },
  dockPrimaryBtnCompleted: {
    flex: 1,
    backgroundColor: Colors.MidnightCharcoal,
    borderRadius: ResponsivePixels.size24,
    borderWidth: 1.5,
    borderColor: Colors.LavenderPurple,
    paddingVertical: ResponsivePixels.size11,
    minHeight: ResponsivePixels.size44,
  },
  dockButtonText: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: ResponsivePixels.size13,
  },

  // Helper Utility
  textWhite: {
    color: Colors.PureWhiteText,
  },
});

export default HabitDetailsScreen;
