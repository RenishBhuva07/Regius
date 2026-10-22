import React, { useState, useMemo, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
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
import { Sun, Settings, Calendar } from 'lucide-react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Toast from 'react-native-toast-message';

import { Fonts } from '../../Theme/fonts';
import { Colors } from '../../Assets/StyleUtilities/Colors';
import { SVGS } from '../../Assets/Images';
import { RegiusLogo } from '../../Common/RegiusLogo';
import { CustomAnimation } from '../../Common/CustomAnimation';
import HolographAnimation from '../../Assets/JsonAnimations/Holograph.json';
import { useTaskReminder } from '../../Context/TaskReminderContext';
import { useVoiceWakeWord } from '../../Context/VoiceWakeWordContext';
import DailyBriefingCard from './Components/DailyBriefingCard';
import DailyBalanceGrid from './Components/DailyBalanceGrid';
import TimelineItemCard, { TimelineItem } from './Components/TimelineItemCard';
import HeaderPatternSvg from './Components/HeaderPatternSvg';
import FlowBadgePatternSvg from './Components/FlowBadgePatternSvg';
import FlowSectionBackgroundSvg from './Components/FlowSectionBackgroundSvg';
import LegendaryDoodleSvg from './Components/LegendaryDoodleSvg';
import ResponsivePixels from '../../Assets/StyleUtilities/ResponsivePixels';
import { useDailyQuote } from '../../Services/DailyQuotes';

type FlowFilter = 'all' | 'tasks' | 'habits' | 'reminders' | 'voice';

const FILTER_TABS = [
  { key: 'all' as FlowFilter, label: 'All Flow' },
  { key: 'tasks' as FlowFilter, label: 'Tasks' },
  { key: 'reminders' as FlowFilter, label: 'Reminders' },
  { key: 'habits' as FlowFilter, label: 'Habits' },
] as const;

const HEADER_HEIGHT = 52;

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
  const dailyQuote = useDailyQuote('dashboard');
  const { tasks, toggleTask, reminders, toggleReminder, habits, toggleHabit } =
    useTaskReminder();

  const {
    assistantName,
    openAssistant,
    triggerWakeWord,
    startWakeWordListening,
  } = useVoiceWakeWord();

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
    outputRange: [Colors.DefaultWhite, Colors.LavenderPurple],
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
        accentColor: '#F5C518',
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
        accentColor: '#1B9A72',
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
        accentColor: '#8383D6',
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
    <View style={styles.safeArea}>
      <StatusBar
        barStyle={isScrolled ? 'light-content' : 'dark-content'}
        {...(Platform.OS === 'android'
          ? {
              backgroundColor: isScrolled ? Colors.LavenderPurple : '#FBF9F3',
              translucent: true,
            }
          : {})}
      />

      {/* Header */}
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
        {/* Background Theme SVG Designs for Scrolled State */}
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

        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <RegiusLogo size="xl" variant={isScrolled ? 'light' : 'default'} />
          </View>

          <View style={styles.headerRight}>
            <TouchableOpacity
              activeOpacity={0.75}
              onPress={() => openAssistant()}
              style={styles.voiceHeaderBtn}
              accessibilityRole="button"
              accessibilityLabel={`Open ${assistantName} Voice Assistant`}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <View pointerEvents="none">
                <CustomAnimation
                  animationFile={HolographAnimation}
                  size={56}
                  animationStyle={styles.voiceHeaderAnimation}
                  autoPlay
                  loop
                  resizeMode="contain"
                  pointerEvents="none"
                />
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.75}
              onPress={() => navigation.navigate('Settings')}
              style={[
                styles.settingsBtn,
                isScrolled && styles.settingsBtnScrolled,
              ]}
              accessibilityRole="button"
              accessibilityLabel="Open Settings"
              hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
            >
              <Settings
                size={24}
                color={isScrolled ? Colors.MidnightCharcoal : '#1B1C19'}
                strokeWidth={2}
              />
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => navigation.navigate('Settings')}
              style={[
                styles.avatarRing,
                isScrolled && styles.avatarRingScrolled,
              ]}
              accessibilityRole="button"
              accessibilityLabel="User Profile"
            >
              <SVGS.RegiusAvatar width={36} height={36} style={styles.avatar} />
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: insets.top + HEADER_HEIGHT + 10,
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
              <Text style={styles.dateText}>{formattedDate}</Text>
              <View style={styles.ambientStatus}>
                <Sun size={14} color="#77767B" strokeWidth={2.2} />
                <Text style={styles.ambientStatusText}>
                  Calm & Focused • 68°F
                </Text>
              </View>
            </View>

            <Text style={styles.greetingText}>{greeting}</Text>
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
        <View
          style={[styles.flowSection, { paddingBottom: insets.bottom + 130 }]}
        >
          {/* Aesthetic luxury background */}
          <View style={styles.flowSectionBgWrapper} pointerEvents="none">
            <FlowSectionBackgroundSvg />
          </View>

          {/* Header crest badge centered on top border */}
          <View style={styles.flowHeaderBadge}>
            <FlowBadgePatternSvg />
            <Text style={styles.flowTitle}>Today’s Flow</Text>
            <Text style={styles.flowSubtitle}>Your day at a glance</Text>
          </View>

          {/* Filter pills */}
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={FILTER_TABS}
            keyExtractor={item => item.key}
            contentContainerStyle={styles.filterRow}
            style={styles.filterScroll}
            renderItem={({ item: f }) => {
              const isActive = activeFilter === f.key;
              return (
                <TouchableOpacity
                  key={f.key}
                  activeOpacity={0.8}
                  onPress={() => setActiveFilter(f.key)}
                  style={[
                    styles.filterPill,
                    isActive && styles.filterPillActive,
                  ]}
                  accessibilityRole="tab"
                  accessibilityState={{ selected: isActive }}
                  accessibilityLabel={`Filter by ${f.label}`}
                >
                  <Text
                    style={[
                      styles.filterPillText,
                      isActive && styles.filterPillTextActive,
                    ]}
                  >
                    {f.label}
                  </Text>
                </TouchableOpacity>
              );
            }}
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
                    size={14}
                    color="#77767B"
                    style={{ marginRight: 6 }}
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

          {/* Swiggy-Inspired Brand Watermark Footer: "Make today a little legendary!" + "Crafted with ❤️ in Ahmedabad, India" + Legendary Crown & Triumph Doodles */}
          <View style={styles.footerWatermarkWrapper} pointerEvents="none">
            <View style={styles.footerWatermarkRow}>
              {/* Left Column: Bold Typography & Sign-off */}
              <View style={styles.footerTextBlock}>
                <Text style={styles.footerWatermarkText}>{dailyQuote}</Text>
                <View style={styles.craftedWithRow}>
                  <Text style={styles.craftedWithText}>Crafted with </Text>
                  <Text style={styles.craftedWithHeart}>❤️</Text>
                  <Text style={styles.craftedWithText}>
                    {' '}
                    in Ahmedabad, India
                  </Text>
                </View>
              </View>

              {/* Right Column: Extraordinary Legendary Crown & Triumph Doodle Illustration */}
              <View style={styles.footerDoodleWrapper}>
                <LegendaryDoodleSvg />
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.DefaultWhite,
  },
  headerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    shadowColor: '#201646',
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 7,
  },
  header: {
    height: HEADER_HEIGHT,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  voiceHeaderBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  voiceHeaderAnimation: {
    width: 56,
    height: 56,
  },
  settingsBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#ECE8DF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  settingsBtnScrolled: {
    backgroundColor: '#FFFFFF',
    borderColor: 'rgba(255, 255, 255, 0.85)',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 3,
  },
  avatarRing: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: Colors.RingBorder,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    backgroundColor: Colors.DefaultWhite,
  },
  avatarRingScrolled: {
    borderColor: Colors.RingBorder,
    borderWidth: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 3,
    backgroundColor: Colors.DefaultWhite,
  },
  avatar: {
    position: 'absolute',
    bottom: 0,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 0,
  },
  topSectionWrapper: {
    paddingHorizontal: 10,
  },
  greetingSection: {
    marginBottom: 10,
  },
  dateWeatherRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  ambientStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  ambientStatusText: {
    fontFamily: Fonts.poppins.medium,
    fontSize: 11.5,
    color: '#77767B',
  },
  dateText: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: 11.5,
    color: '#77767B',
    letterSpacing: 0.8,
  },
  greetingText: {
    fontFamily: Fonts.poppins.bold,
    fontSize: 27,
    color: '#1B1C19',
    letterSpacing: -0.5,
  },
  flowSection: {
    backgroundColor: Colors.SoftCream,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    borderWidth: 1.5,
    borderTopColor: '#FAF6EE',
    borderLeftColor: '#EFE9DE',
    borderRightColor: '#EFE9DE',
    borderBottomWidth: 0,
    paddingHorizontal: 8,
    paddingTop: 40,
    marginTop: 26,
    flex: 1,
    position: 'relative',
    ...Platform.select({
      ios: {
        shadowColor: '#1B1C19',
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
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    overflow: 'hidden',
  },
  flowHeaderBadge: {
    position: 'absolute',
    top: -24,
    alignSelf: 'center',
    backgroundColor: Colors.NeroBlack,
    paddingHorizontal: 22,
    paddingVertical: 7,
    borderRadius: 22,
    borderWidth: 1.5,
    borderTopColor: '#4A4E5C',
    borderLeftColor: '#363944',
    borderRightColor: '#363944',
    borderBottomWidth: 4,
    borderBottomColor: '#090A0D',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0B0D11',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.32,
    shadowRadius: 8,
    elevation: 6,
    zIndex: 20,
    overflow: 'hidden',
  },
  flowTitle: {
    fontFamily: Fonts.poppins.bold,
    fontSize: 14.5,
    color: Colors.DefaultWhite,
    letterSpacing: -0.1,
    textAlign: 'center',
  },
  flowSubtitle: {
    fontFamily: Fonts.poppins.medium,
    fontSize: 10.5,
    color: '#B6B9C3',
    marginTop: 1,
    textAlign: 'center',
  },
  filterScroll: {
    marginHorizontal: -8,
    marginBottom: 6,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 12,
    paddingTop: 6,
    paddingBottom: 16,
  },
  filterPill: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#ECE7DB',
    borderBottomWidth: 3.5,
    borderBottomColor: '#D8D1C0',
    shadowColor: '#5C5441',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 3,
  },
  filterPillActive: {
    backgroundColor: Colors.NeroBlack,
    borderWidth: 1.5,
    borderTopColor: '#454955',
    borderLeftColor: '#333640',
    borderRightColor: '#333640',
    borderBottomWidth: 3.5,
    borderBottomColor: '#0A0B0E',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.28,
    shadowRadius: 5,
    elevation: 5,
  },
  filterPillText: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: 12,
    color: '#555450',
    letterSpacing: -0.1,
  },
  filterPillTextActive: {
    color: Colors.DefaultWhite,
    fontFamily: Fonts.poppins.bold,
  },
  timelineList: {
    position: 'relative',
    overflow: 'visible',
  },
  timelineFlatList: {
    overflow: 'visible',
  },
  timelineListContent: {
    paddingBottom: 16,
    overflow: 'visible',
  },
  unscheduledSection: {
    marginTop: 12,
  },
  unscheduledHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingLeft: 4,
    marginBottom: 4,
  },
  unscheduledHeaderText: {
    fontFamily: Fonts.poppins.medium,
    fontSize: 12,
    color: '#77767B',
  },
  emptyFlowState: {
    paddingVertical: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyFlowText: {
    fontFamily: Fonts.poppins.medium,
    fontSize: 13,
    color: '#8E8D92',
  },

  // Swiggy-Inspired Watermark Footer
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
    fontSize: 34,
    lineHeight: 42,
    color: '#8E95A5',
    letterSpacing: -1.2,
  },
  craftedWithRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 18,
  },
  craftedWithText: {
    fontFamily: Fonts.poppins.medium,
    fontSize: 14,
    color: '#8E95A5',
  },
  craftedWithHeart: {
    fontSize: 13.5,
  },
  footerDoodleWrapper: {
    marginLeft: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
  },
});

export default DashboardScreen;
