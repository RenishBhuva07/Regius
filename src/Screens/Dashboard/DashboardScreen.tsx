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
  ScrollView,
  FlatList,
  StatusBar,
  Platform,
  Animated,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Sun, Calendar } from 'lucide-react-native';
import {
  useNavigation,
  useFocusEffect,
  useRoute,
} from '@react-navigation/native';
import Toast from 'react-native-toast-message';

import { Fonts } from '../../Theme/fonts';
import { Colors, withAlpha } from '../../Assets/StyleUtilities/Colors';
import { useTaskReminder } from '../../Context/TaskReminderContext';
import { useVoiceWakeWord } from '../../Context/VoiceWakeWordContext';
import DailyBriefingCard from './Components/DailyBriefingCard';
import DailyBalanceGrid from './Components/DailyBalanceGrid';
import TimelineItemCard, { TimelineItem } from './Components/TimelineItemCard';
import { FlowSectionSheet } from '../../Common/FlowSectionSheet';
import FlowSectionBackgroundSvg from './Components/FlowSectionBackgroundSvg';
import LegendaryDoodleSvg from './Components/LegendaryDoodleSvg';
import ResponsivePixels from '../../Assets/StyleUtilities/ResponsivePixels';
import { useDailyQuote } from '../../Services/DailyQuotes';
import { useAppTheme } from '../../Theme/useAppTheme';
import DashboardHeader, { HEADER_HEIGHT } from './Components/DashboardHeader';
import FlowFilterTabs, { FlowFilter } from './Components/FlowFilterTabs';

// Parse 12h/24h time string into minutes since midnight
function parseTimeToMinutes(timeStr?: string): number {
  if (!timeStr) return 9999;
  const clean = timeStr.trim().toUpperCase();
  const match = clean.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/);
  if (!match) return 9999;

  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const modifier = match[3];

  if (modifier === 'PM' && hours < 12) hours += 12;
  if (modifier === 'AM' && hours === 12) hours = 0;

  return hours * 60 + minutes;
}

export const DashboardScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const dailyQuote = useDailyQuote('dashboard');
  const {
    isDarkMode,
    bgMain,
    textPrimary,
    textSecondary,
    canvasTextPrimary,
    canvasTextSecondary,
    accentDeep,
  } = useAppTheme();
  const { tasks, toggleTask, reminders, toggleReminder, habits, toggleHabit } =
    useTaskReminder();

  const {
    assistantName,
    openAssistant,
    triggerWakeWord,
    startWakeWordListening,
    isWakeWordEnabled,
    wakeWordPhrase,
  } = useVoiceWakeWord();

  const hasShownLoginWakeWordRef = useRef(false);

  useEffect(() => {
    if (route.params?.justLoggedIn && !hasShownLoginWakeWordRef.current) {
      hasShownLoginWakeWordRef.current = true;
      if (isWakeWordEnabled) {
        const timer = setTimeout(() => {
          Toast.show({
            type: 'success',
            text1: 'Wake Word Enabled',
            text2: `Say "${wakeWordPhrase}" at any time while the app is open.`,
          });
        }, 1200);
        return () => clearTimeout(timer);
      }
    }
  }, [route.params?.justLoggedIn, isWakeWordEnabled, wakeWordPhrase]);

  useFocusEffect(
    useCallback(() => {
      startWakeWordListening();
    }, [startWakeWordListening]),
  );

  const [activeFilter, setActiveFilter] = useState<FlowFilter>('all');

  // Scroll tracking for reactive header layer
  const scrollY = useRef(new Animated.Value(0)).current;
  const isScrolledRef = useRef(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Interpolate header visual styles based on scroll position (0 to 30px)
  const headerBgColor = scrollY.interpolate({
    inputRange: [0, 30],
    outputRange: [
      isDarkMode
        ? withAlpha(Colors.DarkBackground, 0)
        : withAlpha(Colors.PureWhite, 0),
      accentDeep,
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

  const { width: screenWidth } = Dimensions.get('window');

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

  // Format dynamic greeting based on time of day
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning, Alex';
    if (hour < 17) return 'Good afternoon, Alex';
    return 'Good evening, Alex';
  }, []);

  // Format today's date
  const formattedDate = useMemo(() => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
    };
    return new Date().toLocaleDateString('en-US', options).toUpperCase();
  }, []);

  // Compute real metrics from context data in standard sequence: Tasks, Reminders, Habits
  const completedTasksCount = useMemo(
    () => tasks.filter(t => t.done).length,
    [tasks],
  );
  const completedRemindersCount = useMemo(
    () => reminders.filter(r => r.done).length,
    [reminders],
  );
  const completedHabitsCount = useMemo(
    () => habits.filter(h => h.completed).length,
    [habits],
  );

  // Combine tasks, reminders, and habits into a single unified chronological timeline
  const unifiedTimeline = useMemo<TimelineItem[]>(() => {
    const items: TimelineItem[] = [];

    // 1. Tasks (Gold/Yellow theme matching Daily Balance)
    tasks.forEach(t => {
      items.push({
        id: `task-${t.id}`,
        originalId: t.id,
        type: 'task',
        time: t.time || '',
        timeMinutes: parseTimeToMinutes(t.time),
        title: t.label,
        subtitle: t.note,
        category: 'Task',
        accentColor: Colors.AccentYellow,
        completed: t.done,
        isVoiceNudge: !!t.voiceNudge,
      });
    });

    // 2. Reminders (Green theme matching Daily Balance)
    reminders.forEach(r => {
      items.push({
        id: `reminder-${r.id}`,
        originalId: r.id,
        type: 'reminder',
        time: r.time || '12:00 PM',
        timeMinutes: parseTimeToMinutes(r.time || '12:00 PM'),
        title: r.title,
        subtitle: r.notes,
        category: r.category
          ? r.category.charAt(0).toUpperCase() + r.category.slice(1)
          : r.urgentAlarm
          ? 'Alert'
          : 'Reminder',
        accentColor: Colors.GreenGracious,
        completed: r.done,
        isVoiceNudge: false,
      });
    });

    // 3. Habits (Lavender Purple theme matching Daily Balance)
    habits.forEach(h => {
      items.push({
        id: `habit-${h.id}`,
        originalId: h.id,
        type: 'habit',
        time: h.timeOfDay || '08:00 AM',
        timeMinutes: parseTimeToMinutes(h.timeOfDay || '08:00 AM'),
        title: h.title,
        subtitle: `${h.frequency} • ${h.streak}d streak`,
        category: 'Habit',
        accentColor: Colors.LavenderPurple,
        completed: h.completed,
        streak: h.streak,
      });
    });

    // Stable chronological sort: scheduled items first by time, then alphabetical by title
    return items.sort((a, b) => {
      if (a.timeMinutes !== b.timeMinutes) {
        return a.timeMinutes - b.timeMinutes;
      }
      return a.title.localeCompare(b.title);
    });
  }, [tasks, reminders, habits]);

  // Filter without modifying order
  const filteredTimeline = useMemo(() => {
    return unifiedTimeline.filter(item => {
      if (activeFilter === 'tasks') return item.type === 'task';
      if (activeFilter === 'habits') return item.type === 'habit';
      if (activeFilter === 'reminders' || (activeFilter as string) === 'voice')
        return item.type === 'reminder';
      return true;
    });
  }, [unifiedTimeline, activeFilter]);

  // Scheduled vs Unscheduled partition
  const scheduledItems = useMemo(
    () => filteredTimeline.filter(i => i.timeMinutes < 9999),
    [filteredTimeline],
  );

  const unscheduledItems = useMemo(
    () => filteredTimeline.filter(i => i.timeMinutes >= 9999),
    [filteredTimeline],
  );

  // Handle Mark Complete toggle across data models
  const handleToggleComplete = useCallback(
    (item: TimelineItem) => {
      if (item.type === 'task') {
        toggleTask(item.originalId);
      } else if (item.type === 'habit') {
        toggleHabit(item.originalId);
      } else if (item.type === 'reminder') {
        toggleReminder(item.originalId);
      }

      Toast.show({
        type: 'success',
        text1: `${item.category} Updated`,
        text2: item.completed
          ? 'Marked as incomplete'
          : 'Great job maintaining your daily focus streak!',
      });
    },
    [toggleTask, toggleHabit, toggleReminder],
  );

  // Handle Card Tap
  const handlePressCard = useCallback(
    (item: TimelineItem) => {
      if (item.isVoiceNudge) {
        openAssistant();
      } else {
        handleToggleComplete(item);
      }
    },
    [openAssistant, handleToggleComplete],
  );

  return (
    <View style={[styles.safeArea, { backgroundColor: bgMain }]}>
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
                ? accentDeep
                : bgMain,
              translucent: true,
            }
          : {})}
      />

      {/* Header */}
      <DashboardHeader
        isScrolled={isScrolled}
        insetsTop={insets.top}
        screenWidth={screenWidth}
        assistantName={assistantName}
        headerBgColor={headerBgColor}
        headerRadius={headerRadius}
        headerShadowOpacity={headerShadowOpacity}
        headerElevation={headerElevation}
        headerPaddingBottom={headerPaddingBottom}
        headerPatternOpacity={headerPatternOpacity}
        onOpenVoiceAssistant={openAssistant}
        onPressSettings={() => navigation.navigate('Settings')}
        onPressProfile={() => navigation.navigate('ProfileScreen')}
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: insets.top + HEADER_HEIGHT + ResponsivePixels.size10,
            paddingBottom: 0,
          },
        ]}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {/* Top sections with horizontal padding */}
        <View style={styles.topSectionWrapper}>
          {/* Greeting */}
          <View style={styles.greetingSection}>
            <View style={styles.dateWeatherRow}>
              <Text style={[styles.dateText, { color: canvasTextSecondary }]}>
                {formattedDate}
              </Text>
              <View style={styles.ambientStatus}>
                <Sun
                  size={ResponsivePixels.size14}
                  color={isDarkMode ? Colors.AccentYellow : Colors.Grey}
                  strokeWidth={2.2}
                />
                <Text
                  style={[styles.ambientStatusText, { color: canvasTextSecondary }]}
                >
                  Calm & Focused • 68°F
                </Text>
              </View>
            </View>

            <Text style={[styles.greetingText, { color: canvasTextPrimary }]}>
              {greeting}
            </Text>
          </View>

          {/* Voice briefing card */}
          <DailyBriefingCard
            taskCount={tasks.length}
            reminderCount={reminders.length}
            habitCount={habits.length}
            assistantName={assistantName}
            onOpenVoiceAssistant={() => openAssistant()}
            onTriggerWakeWord={() => triggerWakeWord()}
          />

          {/* Daily balance grid */}
          <DailyBalanceGrid
            tasksCompleted={completedTasksCount}
            tasksTotal={tasks.length}
            remindersCompleted={completedRemindersCount}
            remindersTotal={reminders.length}
            habitsCompleted={completedHabitsCount}
            habitsTotal={habits.length}
            onPressTasks={() => navigation.navigate('Tasks')}
            onPressReminders={() => navigation.navigate('Reminders')}
            onPressHabits={() => navigation.navigate('Habits')}
          />
        </View>

        {/* Curated flow timeline - Full width and till bottom edge */}
        <FlowSectionSheet
          title="Today’s Flow"
          subtitle="Your day at a glance"
          backgroundSvg={<FlowSectionBackgroundSvg />}
          bottomPadding={insets.bottom + ResponsivePixels.size130}
          containerStyle={styles.flowSection}
        >
          {/* Filter pills */}
          <FlowFilterTabs
            activeFilter={activeFilter}
            onSelectFilter={setActiveFilter}
          />

          {/* Timeline list */}
          <View style={styles.timelineList}>
            <FlatList
              data={scheduledItems}
              keyExtractor={item => item.id}
              scrollEnabled={false}
              style={styles.timelineFlatList}
              contentContainerStyle={styles.timelineListContent}
              renderItem={({ item, index }) => (
                <TimelineItemCard
                  item={item}
                  isFirst={index === 0}
                  isLast={
                    index === scheduledItems.length - 1 &&
                    unscheduledItems.length === 0
                  }
                  onToggleComplete={handleToggleComplete}
                  onPressCard={handlePressCard}
                />
              )}
            />

            {/* Unscheduled items */}
            {unscheduledItems.length > 0 && (
              <View style={styles.unscheduledSection}>
                <View style={styles.unscheduledHeaderRow}>
                  <Calendar
                    size={ResponsivePixels.size14}
                    color={Colors.Grey}
                    style={{ marginRight: ResponsivePixels.size6 }}
                  />
                  <Text style={styles.unscheduledHeaderText}>
                    Unscheduled / Any Time
                  </Text>
                </View>
                <FlatList
                  data={unscheduledItems}
                  keyExtractor={item => item.id}
                  scrollEnabled={false}
                  style={styles.timelineFlatList}
                  contentContainerStyle={styles.timelineListContent}
                  renderItem={({ item, index }) => (
                    <TimelineItemCard
                      item={item}
                      isFirst={scheduledItems.length === 0 && index === 0}
                      isLast={index === unscheduledItems.length - 1}
                      onToggleComplete={handleToggleComplete}
                      onPressCard={handlePressCard}
                    />
                  )}
                />
              </View>
            )}

            {scheduledItems.length === 0 && unscheduledItems.length === 0 && (
              <View style={styles.emptyFlowState}>
                <Text style={styles.emptyFlowText}>
                  No {activeFilter === 'all' ? 'items' : activeFilter} for today
                </Text>
              </View>
            )}
          </View>

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
                        ? Colors.DarkEmptyCountMuted
                        : Colors.MilestoneSlate,
                    },
                  ]}
                >
                  {dailyQuote}
                </Text>
                <View style={styles.craftedWithRow}>
                  <Text
                    style={[styles.craftedWithText, { color: textSecondary }]}
                  >
                    Crafted with{' '}
                  </Text>
                  <Text style={styles.craftedWithHeart}>❤️</Text>
                  <Text
                    style={[styles.craftedWithText, { color: textSecondary }]}
                  >
                    {' '}
                    in Ahmedabad, India
                  </Text>
                </View>
              </View>

              {/* Footer doodle */}
              <View style={styles.footerDoodleWrapper}>
                <LegendaryDoodleSvg />
              </View>
            </View>
          </View>
        </FlowSectionSheet>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.PureWhite,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 0,
  },
  topSectionWrapper: {
    paddingHorizontal: ResponsivePixels.size10,
  },
  greetingSection: {
    marginBottom: ResponsivePixels.size10,
  },
  dateWeatherRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: ResponsivePixels.size4,
  },
  ambientStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ResponsivePixels.size5,
  },
  ambientStatusText: {
    fontFamily: Fonts.poppins.medium,
    fontSize: ResponsivePixels.size11_5,
    color: Colors.Grey,
  },
  dateText: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: ResponsivePixels.size11_5,
    color: Colors.Grey,
    letterSpacing: 0.8,
  },
  greetingText: {
    fontFamily: Fonts.poppins.bold,
    fontSize: ResponsivePixels.size27,
    color: Colors.RegiusInk,
    letterSpacing: -0.5,
  },
  flowSection: {
    backgroundColor: Colors.SoftCream,
    borderTopLeftRadius: ResponsivePixels.size32,
    borderTopRightRadius: ResponsivePixels.size32,
    borderWidth: 1.5,
    borderTopColor: Colors.WarmNavBevelTop,
    borderLeftColor: Colors.WarmNavBevelSide,
    borderRightColor: Colors.WarmNavBevelSide,
    borderBottomWidth: 0,
    paddingHorizontal: ResponsivePixels.size8,
    paddingTop: ResponsivePixels.size40,
    marginTop: ResponsivePixels.size26,
    flex: 1,
    position: 'relative',
    ...Platform.select({
      ios: {
        shadowColor: Colors.RegiusInk,
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.12,
        shadowRadius: 12,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  flowSectionBgWrapper: {
    ...StyleSheet.absoluteFill,
    borderTopLeftRadius: ResponsivePixels.size32,
    borderTopRightRadius: ResponsivePixels.size32,
    overflow: 'hidden',
  },
  flowHeaderBadge: {
    position: 'absolute',
    top: -ResponsivePixels.size24,
    alignSelf: 'center',
    backgroundColor: Colors.NeroBlack,
    paddingHorizontal: ResponsivePixels.size22,
    paddingVertical: ResponsivePixels.size7,
    borderRadius: ResponsivePixels.size22,
    borderWidth: 1.5,
    borderTopColor: Colors.DarkBevelTop,
    borderLeftColor: Colors.DarkBorder,
    borderRightColor: Colors.DarkBorder,
    borderBottomWidth: 4,
    borderBottomColor: Colors.DarkBevelAbyss,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.DarkShadowAnchor,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.32,
    shadowRadius: 8,
    elevation: 6,
    zIndex: 20,
    overflow: 'hidden',
  },
  flowTitle: {
    fontFamily: Fonts.poppins.bold,
    fontSize: ResponsivePixels.size14_5,
    color: Colors.PureWhite,
    letterSpacing: -0.1,
    textAlign: 'center',
  },
  flowSubtitle: {
    fontFamily: Fonts.poppins.medium,
    fontSize: ResponsivePixels.size10_5,
    color: Colors.CoolSilverSubtitle,
    marginTop: ResponsivePixels.size1,
    textAlign: 'center',
  },
  timelineList: {
    position: 'relative',
    overflow: 'visible',
  },
  timelineFlatList: {
    overflow: 'visible',
  },
  timelineListContent: {
    paddingBottom: ResponsivePixels.size16,
    overflow: 'visible',
  },
  unscheduledSection: {
    marginTop: ResponsivePixels.size12,
  },
  unscheduledHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: ResponsivePixels.size8,
    paddingLeft: ResponsivePixels.size4,
    marginBottom: ResponsivePixels.size4,
  },
  unscheduledHeaderText: {
    fontFamily: Fonts.poppins.medium,
    fontSize: ResponsivePixels.size12,
    color: Colors.Grey,
  },
  emptyFlowState: {
    paddingVertical: ResponsivePixels.size24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyFlowText: {
    fontFamily: Fonts.poppins.medium,
    fontSize: ResponsivePixels.size13,
    color: Colors.TimelineMutedGray,
  },

  // Footer watermark styles
  footerWatermarkWrapper: {
    paddingLeft: ResponsivePixels.size10,
    paddingRight: ResponsivePixels.size16,
    marginTop: ResponsivePixels.size36,
    marginBottom: ResponsivePixels.size20,
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
    color: Colors.MilestoneSlate,
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
    color: Colors.MilestoneSlate,
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

export default DashboardScreen;
