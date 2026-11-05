import React, { useState, useMemo, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Platform,
  Animated,
  Dimensions,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import {
  Flame,
  Check,
  Clock,
  Repeat,
  Sun,
  Moon,
  Sparkles,
  Pencil,
  Volume2,
  Trash2,
  Trophy,
  Calendar,
  ShieldCheck,
  Quote,
  CheckCircle2,
} from 'lucide-react-native';
import Svg, {
  Rect,
  Circle,
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
import { StreakBadge } from '../../Common/StreakBadge';
import { HeaderActionButton } from '../../Common/HeaderActionButton';
import { StickyActionDock } from '../../Common/StickyActionDock';
import CustomButton from '../../Common/CustomButton';
import AddHabitModal from '../../Components/AddHabitModal';

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
        viewBox="0 0 360 260"
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
          <RadialGradient id="flameHeroGlow" cx="25%" cy="40%" rx="60%" ry="60%">
            <Stop offset="0%" stopColor="#FF9800" stopOpacity={0.32} />
            <Stop offset="45%" stopColor="#E65100" stopOpacity={0.14} />
            <Stop offset="100%" stopColor="#121318" stopOpacity={0} />
          </RadialGradient>

          {/* Dynamic Category Accent Aura */}
          <RadialGradient id="accentHeroGlow" cx="80%" cy="20%" rx="65%" ry="65%">
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

export const HabitDetailsScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const route = useRoute<RouteProp<{ params: HabitDetailsScreenRouteParams }, 'params'>>();
  const { isDarkMode } = useTheme();

  const habitId = route.params?.habitId;
  const { habits, toggleHabit, updateHabit, deleteHabit } = useTaskReminder();

  const habit = useMemo(
    () => habits.find(h => h.id === habitId),
    [habits, habitId],
  );

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Scroll tracking with reactive header
  const { scrollY, isScrolled, handleScroll } = useScrollReactiveHeader({
    threshold: 15,
  });
  const scaleAnim = useRef(new Animated.Value(1)).current;

  // Resolve Category Styles & Metadata
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
        accent: '#D97706',
        bgTint: '#FFFCEB',
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
        bgTint: '#FFF5F0',
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

  const handleDelete = useCallback(() => {
    if (!habit) return;
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
          <Text style={styles.notFoundText}>Habit ritual not found.</Text>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backBtnFallback}
          >
            <Text style={styles.backBtnFallbackText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // 7-day completion simulated status (current day is index 6)
  const isCompleted = habit.completed;
  const currentStreak = habit.streak;

  return (
    <View style={[styles.container, isDarkMode && styles.containerDark]}>
      <StatusBar
        barStyle={isDarkMode || isScrolled ? 'light-content' : 'dark-content'}
        {...(Platform.OS === 'android'
          ? {
              backgroundColor: 'transparent',
              translucent: true,
            }
          : {})}
      />

      {/* Screen Header */}
      <SubScreenHeader
        title={categoryTheme.label}
        subtitle="Habit Deep Details"
        scrollY={scrollY}
        isScrolled={isScrolled}
        onPressBack={() => navigation.goBack()}
        badge={{
          label: categoryTheme.label,
          variant: categoryTheme.badgeVariant,
          size: 'sm',
        }}
        rightAction={
          <HeaderActionButton
            label="Edit"
            icon={Pencil}
            onPress={() => setIsEditModalOpen(true)}
            accessibilityLabel={`Edit ${habit.title}`}
          />
        }
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: insets.top + SUB_SCREEN_HEADER_HEIGHT + 14,
            paddingBottom: insets.bottom + 120,
          },
        ]}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {/* Hero Bento Card (Habit Momentum & Identity) */}
        <View style={styles.cardShadowWrapper}>
          <View style={styles.card}>
            <BentoHeroBg accentColor={categoryTheme.accent} />

            <View style={styles.bentoContent}>
              {/* Top Meta Row */}
              <View style={styles.bentoTopRow}>
                <View style={styles.bentoCategoryBadge}>
                  <IconComponent
                    size={14}
                    color="#F5C518"
                    strokeWidth={2.4}
                  />
                  <Text style={styles.bentoCategoryText}>
                    {categoryTheme.sublabel}
                  </Text>
                </View>

                <Badge
                  label={isCompleted ? 'COMPLETED TODAY' : 'PENDING CHECK-IN'}
                  variant={isCompleted ? 'green' : 'orange'}
                  size="sm"
                />
              </View>

              {/* Habit Title */}
              <Text style={styles.bentoTitle} numberOfLines={3}>
                {habit.title}
              </Text>

              {/* Fiery Streak Showcase */}
              <View style={styles.streakShowcaseRow}>
                <View style={styles.flameAuraContainer}>
                  <Flame size={32} color="#F5C518" strokeWidth={2.4} />
                </View>
                <View style={styles.streakTextWrap}>
                  <View style={styles.streakValueRow}>
                    <Text style={styles.streakNumber}>{currentStreak}</Text>
                    <Text style={styles.streakUnit}>DAYS</Text>
                  </View>
                  <Text style={styles.streakSublabel}>
                    {isCompleted
                      ? 'Streak actively secured for today!'
                      : 'Complete today to extend your streak.'}
                  </Text>
                </View>
              </View>

              {/* Bento Quick Toggle Button */}
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={handleToggle}
                style={[
                  styles.bentoActionBtn,
                  isCompleted
                    ? styles.bentoActionBtnDone
                    : styles.bentoActionBtnPending,
                ]}
                accessibilityRole="button"
                accessibilityLabel={
                  isCompleted
                    ? 'Mark habit as incomplete'
                    : 'Check in for today'
                }
              >
                {isCompleted ? (
                  <>
                    <CheckCircle2 size={18} color="#1B9A72" strokeWidth={2.6} />
                    <Text style={styles.bentoActionBtnTextDone}>
                      Completed Today 🔥
                    </Text>
                  </>
                ) : (
                  <>
                    <Flame size={18} color="#1B1C19" strokeWidth={2.6} />
                    <Text style={styles.bentoActionBtnTextPending}>
                      Check In For Today
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* 7-Day Consistency & Progress Matrix */}
        <View style={styles.sectionWrapper}>
          <View style={styles.sectionHeaderRow}>
            <Calendar size={16} color="#7A766E" strokeWidth={2.2} />
            <Text style={styles.sectionHeaderTitle}>Consistency Matrix</Text>
            <View style={styles.spacer} />
            <Text style={styles.sectionHeaderMeta}>Last 7 Days</Text>
          </View>

          <View style={styles.tactileCard}>
            <View style={styles.weekdaysRow}>
              {WEEKDAYS.map((day, idx) => {
                const isToday = idx === 6;
                const isDayFilled =
                  isCompleted || (currentStreak > 0 && idx < 6);

                return (
                  <View key={`day-${day}-${idx}`} style={styles.dayCol}>
                    <Text style={[styles.dayName, isToday && styles.dayNameToday]}>
                      {day}
                    </Text>
                    <View
                      style={[
                        styles.dayCircle,
                        isDayFilled && {
                          backgroundColor: categoryTheme.accent,
                          borderColor: categoryTheme.accent,
                        },
                        isToday &&
                          !isCompleted && {
                            borderColor: categoryTheme.accent,
                            borderWidth: 2,
                            backgroundColor: 'transparent',
                          },
                      ]}
                    >
                      {isDayFilled ? (
                        <Check size={12} color="#FFFFFF" strokeWidth={3} />
                      ) : (
                        <View style={styles.dayCircleEmptyDot} />
                      )}
                    </View>
                    <Text style={styles.dayStatusText}>
                      {isToday ? (isCompleted ? 'Done' : 'Today') : isDayFilled ? '✓' : '—'}
                    </Text>
                  </View>
                );
              })}
            </View>

            {/* Matrix Stats Footprint */}
            <View style={styles.matrixDivider} />
            <View style={styles.statsSummaryGrid}>
              <View style={styles.statBox}>
                <Text style={styles.statBoxVal}>{currentStreak}</Text>
                <Text style={styles.statBoxLabel}>Current Streak</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statBox}>
                <Text style={styles.statBoxVal}>
                  {Math.min(100, Math.round(((currentStreak + (isCompleted ? 1 : 0)) / (currentStreak + 1 || 1)) * 100))}%
                </Text>
                <Text style={styles.statBoxLabel}>Consistency</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statBox}>
                <Text style={styles.statBoxVal}>{habit.frequency}</Text>
                <Text style={styles.statBoxLabel}>Cadence</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Ritual Schedule & Protocol */}
        <View style={styles.sectionWrapper}>
          <View style={styles.sectionHeaderRow}>
            <Clock size={16} color="#7A766E" strokeWidth={2.2} />
            <Text style={styles.sectionHeaderTitle}>Ritual Protocol</Text>
          </View>

          <View style={styles.tactileCard}>
            {/* Preferred Circadian Window */}
            <View style={styles.protocolRow}>
              <View style={[styles.protocolIconAura, { backgroundColor: categoryTheme.bgTint }]}>
                <Clock size={18} color={categoryTheme.accent} strokeWidth={2.2} />
              </View>
              <View style={styles.protocolInfo}>
                <Text style={styles.protocolLabel}>Preferred Schedule</Text>
                <Text style={styles.protocolValue}>{habit.timeOfDay}</Text>
              </View>
              <Badge label="WINDOW" variant="neutral" size="sm" />
            </View>

            <View style={styles.cardDivider} />

            {/* Recurrence Cadence */}
            <View style={styles.protocolRow}>
              <View style={[styles.protocolIconAura, { backgroundColor: '#F0F9FF' }]}>
                <Repeat size={18} color="#0284C7" strokeWidth={2.2} />
              </View>
              <View style={styles.protocolInfo}>
                <Text style={styles.protocolLabel}>Frequency</Text>
                <Text style={styles.protocolValue}>{habit.frequency}</Text>
              </View>
              <Badge label="ACTIVE" variant="purple" size="sm" />
            </View>

            <View style={styles.cardDivider} />

            {/* Category Focus Domain */}
            <View style={styles.protocolRow}>
              <View style={[styles.protocolIconAura, { backgroundColor: categoryTheme.bgTint }]}>
                <IconComponent size={18} color={categoryTheme.iconColor} strokeWidth={2.2} />
              </View>
              <View style={styles.protocolInfo}>
                <Text style={styles.protocolLabel}>Ritual Domain</Text>
                <Text style={styles.protocolValue}>
                  {categoryTheme.label.charAt(0) +
                    categoryTheme.label.slice(1).toLowerCase()}{' '}
                  Rituals
                </Text>
              </View>
              <Badge
                label={categoryTheme.label}
                variant={categoryTheme.badgeVariant}
                size="sm"
              />
            </View>
          </View>
        </View>

        {/* Neural Voice Assistant Guidance */}
        <View style={styles.sectionWrapper}>
          <View style={styles.sectionHeaderRow}>
            <Volume2 size={16} color="#7A766E" strokeWidth={2.2} />
            <Text style={styles.sectionHeaderTitle}>Regius Vocal Motivation</Text>
          </View>

          <View style={styles.voiceNudgeCard}>
            <View style={styles.voiceHeaderRow}>
              <View style={styles.voicePillTag}>
                <Volume2 size={12} color="#7059C8" strokeWidth={2.4} />
                <Text style={styles.voicePillText}>Sia Neural Nudge</Text>
              </View>
              <Badge label="ENABLED" variant="green" size="sm" />
            </View>
            <Text style={styles.voiceQuoteText}>
              “Regius will chime at {habit.timeOfDay} to ignite your{' '}
              {habit.title.toLowerCase()} ritual.”
            </Text>
          </View>
        </View>

        {/* Philosophy & Intention Quote */}
        <View style={styles.sectionWrapper}>
          <View style={styles.philosophyCard}>
            <Quote size={20} color="#D8D4CA" strokeWidth={2} style={styles.quoteIcon} />
            <Text style={styles.philosophyQuote}>{categoryTheme.quote}</Text>
            <Text style={styles.philosophySignoff}>
              Mindful Ritual Architecture · Regius Habit Flow
            </Text>
          </View>
        </View>

        {/* Destructive Delete Action */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={handleDelete}
          style={styles.deleteActionBtn}
          accessibilityRole="button"
          accessibilityLabel="Delete habit ritual"
        >
          <Trash2 size={15} color="#D92A0F" strokeWidth={2.2} />
          <Text style={styles.deleteActionText}>Delete Habit Ritual</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Sticky Action Dock */}
      <StickyActionDock>
        <View style={styles.dockRow}>
          <CustomButton
            title={isCompleted ? 'Completed Today ✓' : 'Check In For Today 🔥'}
            onPress={handleToggle}
            variant={isCompleted ? 'primary' : 'dark'}
            style={
              isCompleted
                ? styles.dockPrimaryBtnCompleted
                : styles.dockPrimaryBtnPending
            }
          />
        </View>
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
    paddingHorizontal: 10,
  },
  spacer: {
    flex: 1,
  },
  notFoundCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    gap: 16,
  },
  notFoundText: {
    fontFamily: Fonts.poppins.medium,
    fontSize: 16,
    color: '#7A766E',
  },
  backBtnFallback: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: Colors.MidnightCharcoal,
    borderRadius: 20,
  },
  backBtnFallbackText: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: 14,
    color: '#FFFFFF',
  },

  // 2-Layer Hero Bento Card
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
    marginBottom: 20,
  },
  card: {
    position: 'relative',
    backgroundColor: Colors.NeroBlack,
    borderRadius: 24,
    borderWidth: 4,
    borderColor: 'rgba(255, 255, 255, 0.9)',
    overflow: 'hidden',
  },
  bentoContent: {
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 20,
    gap: 14,
  },
  bentoTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bentoCategoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.18)',
  },
  bentoCategoryText: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: 11,
    color: '#F5C518',
    letterSpacing: 0.3,
  },
  bentoTitle: {
    fontFamily: Fonts.poppins.bold,
    fontSize: 22,
    lineHeight: 28,
    color: Colors.DefaultWhite,
    letterSpacing: -0.3,
    marginTop: 2,
  },
  streakShowcaseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.07)',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 12,
  },
  flameAuraContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(245, 197, 24, 0.18)',
    borderWidth: 1.5,
    borderColor: 'rgba(245, 197, 24, 0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  streakTextWrap: {
    flex: 1,
  },
  streakValueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
  },
  streakNumber: {
    fontFamily: Fonts.poppins.bold,
    fontSize: 28,
    lineHeight: 32,
    color: '#F5C518',
    letterSpacing: -0.5,
  },
  streakUnit: {
    fontFamily: Fonts.poppins.bold,
    fontSize: 13,
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  streakSublabel: {
    fontFamily: Fonts.poppins.regular,
    fontSize: 11.5,
    color: '#B6B9C3',
    marginTop: 2,
  },
  bentoActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 18,
    borderWidth: 1.5,
    marginTop: 4,
  },
  bentoActionBtnPending: {
    backgroundColor: '#F5C518',
    borderColor: '#FFE066',
  },
  bentoActionBtnDone: {
    backgroundColor: '#E8FDF0',
    borderColor: '#52D22E',
  },
  bentoActionBtnTextPending: {
    fontFamily: Fonts.poppins.bold,
    fontSize: 13.5,
    color: '#1B1C19',
    letterSpacing: 0.2,
  },
  bentoActionBtnTextDone: {
    fontFamily: Fonts.poppins.bold,
    fontSize: 13.5,
    color: '#1B9A72',
    letterSpacing: 0.2,
  },

  // Sections
  sectionWrapper: {
    marginBottom: 20,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    paddingHorizontal: 4,
    marginBottom: 10,
  },
  sectionHeaderTitle: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: 13.5,
    color: '#1B1C19',
    letterSpacing: 0.1,
  },
  sectionHeaderMeta: {
    fontFamily: Fonts.poppins.medium,
    fontSize: 11.5,
    color: '#8E95A5',
  },
  tactileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: '#ECE7DC',
    padding: 16,
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

  // Consistency Matrix
  weekdaysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dayCol: {
    alignItems: 'center',
    gap: 6,
  },
  dayName: {
    fontFamily: Fonts.poppins.medium,
    fontSize: 11,
    color: '#8E95A5',
  },
  dayNameToday: {
    fontFamily: Fonts.poppins.bold,
    color: '#1B1C19',
  },
  dayCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#F5F3ED',
    borderWidth: 1.5,
    borderColor: '#E6E1D5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayCircleEmptyDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#D8D4CA',
  },
  dayStatusText: {
    fontFamily: Fonts.poppins.regular,
    fontSize: 10,
    color: '#8E95A5',
  },
  matrixDivider: {
    height: 1,
    backgroundColor: '#F0ECE1',
    marginVertical: 14,
  },
  statsSummaryGrid: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  statBox: {
    alignItems: 'center',
    flex: 1,
  },
  statBoxVal: {
    fontFamily: Fonts.poppins.bold,
    fontSize: 16,
    color: '#1B1C19',
  },
  statBoxLabel: {
    fontFamily: Fonts.poppins.regular,
    fontSize: 10.5,
    color: '#8E95A5',
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#EAE5D9',
  },

  // Protocol Rows
  protocolRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    gap: 12,
  },
  protocolIconAura: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  protocolInfo: {
    flex: 1,
  },
  protocolLabel: {
    fontFamily: Fonts.poppins.regular,
    fontSize: 11,
    color: '#8E95A5',
  },
  protocolValue: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: 13.5,
    color: '#1B1C19',
    marginTop: 1,
  },
  cardDivider: {
    height: 1,
    backgroundColor: '#F3EFE6',
    marginVertical: 10,
  },

  // Neural Voice Card
  voiceNudgeCard: {
    backgroundColor: '#F8F7FF',
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#E0DEFA',
    padding: 16,
    gap: 10,
  },
  voiceHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  voicePillTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#EFF2FE',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 12,
  },
  voicePillText: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: 11,
    color: '#7059C8',
  },
  voiceQuoteText: {
    fontFamily: Fonts.poppins.medium,
    fontSize: 12.5,
    lineHeight: 18,
    color: '#3F454D',
    fontStyle: 'italic',
  },

  // Philosophy Card
  philosophyCard: {
    backgroundColor: '#FAF8F3',
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#ECE7DC',
    padding: 18,
    alignItems: 'center',
    gap: 8,
  },
  quoteIcon: {
    marginBottom: 2,
  },
  philosophyQuote: {
    fontFamily: Fonts.poppins.medium,
    fontSize: 13,
    lineHeight: 20,
    color: '#55544E',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  philosophySignoff: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: 10.5,
    color: '#8E95A5',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
    marginTop: 4,
  },

  // Destructive Delete Button
  deleteActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    backgroundColor: '#FEEFEF',
    borderRadius: 16,
    borderWidth: 1.2,
    borderColor: '#FED6D6',
    marginTop: 4,
    marginBottom: 10,
  },
  deleteActionText: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: 12.5,
    color: '#D92A0F',
  },

  // Sticky Action Dock
  dockRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  dockPrimaryBtnContainer: {
    flex: 1,
  },
  dockPrimaryBtnPending: {
    backgroundColor: Colors.MidnightCharcoal,
    borderRadius: 28,
  },
  dockPrimaryBtnCompleted: {
    backgroundColor: '#1B9A72',
    borderRadius: 28,
  },
});

export default HabitDetailsScreen;
