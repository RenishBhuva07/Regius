import React, { useState, useMemo, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Platform,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Sparkles,
  Sun,
  SlidersHorizontal,
  RotateCcw,
  Plus,
  Mic,
} from 'lucide-react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Toast from 'react-native-toast-message';

import { Fonts } from '../../Theme/fonts';
import { SVGS } from '../../Assets/Images';
import { useTaskReminder } from '../../Context/TaskReminderContext';
import { useVoiceWakeWord } from '../../Context/VoiceWakeWordContext';
import DailyBriefingCard from './Components/DailyBriefingCard';
import DailyBalanceGrid from './Components/DailyBalanceGrid';
import TimelineItemCard, { TimelineItem } from './Components/TimelineItemCard';
import VoiceAssistantSheet from './Components/VoiceAssistantSheet';

type FlowFilter = 'all' | 'tasks' | 'habits' | 'voice';

const CURATED_DEFAULT_FLOW: TimelineItem[] = [
  {
    id: 'flow-1',
    time: '07:30 AM',
    category: 'Habit Completed',
    title: 'Morning Sunlight & 500ml Water',
    description: 'Natural cortisol reset completed on porch',
    status: 'completed',
    badgeType: 'mint',
    badgeText: 'Hydrated',
  },
  {
    id: 'flow-2',
    time: '09:00 AM',
    category: 'In Progress',
    title: 'Email & Inbox Zero Flow',
    description: 'Processed 14 critical communications. Focus block active.',
    status: 'in_progress',
    badgeType: 'work',
  },
  {
    id: 'flow-3',
    time: '11:30 AM',
    category: 'Strategy',
    title: 'Weekly Team Strategy & Review',
    description: 'Aria will chime 5 minutes prior with talking points.',
    status: 'upcoming',
    badgeType: 'voice_prep',
  },
  {
    id: 'flow-4',
    time: '01:15 PM',
    category: 'Mindful Habit',
    title: '20-min Posture & Breath Reset',
    description: 'Gentle audio chime and guided diaphragmatic breathing.',
    status: 'upcoming',
    iconType: 'bell',
  },
  {
    id: 'flow-5',
    time: '03:00 PM',
    category: 'Spoken Check-in',
    title: 'Hydration & Energy Alignment',
    description:
      'Aria prompts via earbuds: status on water goal & mental clarity.',
    status: 'spoken_checkin',
    badgeText: 'Scheduled',
  },
  {
    id: 'flow-6',
    time: '06:00 PM',
    category: 'Fitness',
    title: 'Evening 5km Mindful Pace Run',
    description: 'Lakeside route • Music & breathing focus.',
    status: 'upcoming',
    iconType: 'fitness',
  },
  {
    id: 'flow-7',
    time: '08:30 PM',
    category: 'Wind Down',
    title: 'Read 15 Pages of Philosophy',
    description: 'Soft lighting, screen-free wind down.',
    status: 'upcoming',
    iconType: 'book',
  },
];

export const DashboardScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { tasks, toggleTask, reminders, openTaskModal } = useTaskReminder();
  const { openAssistant, triggerWakeWord, startWakeWordListening } =
    useVoiceWakeWord();

  useFocusEffect(
    useCallback(() => {
      startWakeWordListening();
    }, [startWakeWordListening]),
  );

  const [activeFilter, setActiveFilter] = useState<FlowFilter>('all');
  const [timelineItems, setTimelineItems] =
    useState<TimelineItem[]>(CURATED_DEFAULT_FLOW);

  // Reshuffle rotation animation
  const rotateAnim = useRef(new Animated.Value(0)).current;

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

  // Computed metrics
  const completedTasksCount = useMemo(
    () => tasks.filter(t => t.done).length,
    [tasks],
  );
  const completedHabitsCount = useMemo(
    () => timelineItems.filter(i => i.status === 'completed').length,
    [timelineItems],
  );

  // Merged and filtered flow
  const filteredTimeline = useMemo(() => {
    return timelineItems.filter(item => {
      if (activeFilter === 'tasks') {
        return (
          item.category.toLowerCase().includes('in progress') ||
          item.badgeType === 'work'
        );
      }
      if (activeFilter === 'habits') {
        return (
          item.category.toLowerCase().includes('habit') ||
          item.category.toLowerCase().includes('fitness') ||
          item.category.toLowerCase().includes('wind down')
        );
      }
      if (activeFilter === 'voice') {
        return (
          item.status === 'spoken_checkin' ||
          item.badgeType === 'voice_prep' ||
          item.category.toLowerCase().includes('strategy')
        );
      }
      return true;
    });
  }, [timelineItems, activeFilter]);

  // Handle Mark Complete toggle
  const handleToggleComplete = (id: string) => {
    setTimelineItems(prev =>
      prev.map(item => {
        if (item.id === id) {
          const nextStatus =
            item.status === 'completed' ? 'in_progress' : 'completed';
          return {
            ...item,
            status: nextStatus,
            category: nextStatus === 'completed' ? 'Completed' : 'In Progress',
          };
        }
        return item;
      }),
    );
    Toast.show({
      type: 'success',
      text1: 'Task Updated',
      text2: 'Great job maintaining your daily focus streak!',
    });
  };

  // Handle +15 mins extension
  const handleExtendMinutes = (id: string) => {
    Toast.show({
      type: 'info',
      text1: 'Focus Extended',
      text2: 'Added +15 minutes to your current flow session.',
    });
  };

  // Handle Reshuffle / Optimization
  const handleReshuffle = () => {
    Animated.timing(rotateAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start(() => {
      rotateAnim.setValue(0);
    });

    // Reorder flow intelligently
    setTimelineItems(prev => {
      const items = [...prev];
      const inProg = items.filter(i => i.status === 'in_progress');
      const upcoming = items.filter(i => i.status === 'upcoming');
      const spoken = items.filter(i => i.status === 'spoken_checkin');
      const completed = items.filter(i => i.status === 'completed');
      return [...completed, ...inProg, ...spoken, ...upcoming];
    });

    Toast.show({
      type: 'success',
      text1: 'Aria Curated Flow',
      text2: 'Timeline re-sequenced around your peak cognitive energy.',
    });
  };

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar
        barStyle="dark-content"
        {...(Platform.OS === 'android'
          ? { backgroundColor: '#FBF9F3', translucent: true }
          : {})}
      />

      {/* ── Fixed Header ── */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.brandTitle}>Regius</Text>
        </View>

        <View style={styles.headerRight}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => triggerWakeWord()}
            style={styles.voiceHeaderBtn}
            accessibilityLabel="Hey Regius Voice Assistant"
          >
            <Mic size={18} color="#2D5A37" />
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => navigation.navigate('Settings')}
            style={styles.tuneButton}
            accessibilityLabel="Filter or customize flow"
          >
            <SlidersHorizontal size={18} color="#1B1C19" />
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.navigate('Settings')}
            style={styles.avatarButton}
          >
            <SVGS.RegiusAvatar width={36} height={36} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Greeting & Assistant State ── */}
        <View style={styles.greetingSection}>
          <View style={styles.stateRow}>
            <View style={styles.ariaActiveBadge}>
              <Sparkles size={13} color="#2D5A37" />
              <Text style={styles.ariaActiveText}>Aria Flow Active</Text>
            </View>

            <View style={styles.ambientStatus}>
              <Sun size={15} color="#665F3D" />
              <Text style={styles.ambientStatusText}>
                Calm & Focused • 68°F
              </Text>
            </View>
          </View>

          <Text style={styles.dateText}>{formattedDate}</Text>
          <Text style={styles.greetingText}>{greeting}</Text>
        </View>

        {/* ── Aria Voice Briefing Banner ── */}
        <DailyBriefingCard
          taskCount={tasks.length}
          habitCount={timelineItems.length}
          reminderCount={reminders.length}
          onOpenVoiceAssistant={() => openAssistant()}
        />

        {/* ── Daily Balance & Energy Gauge (Bento Grid) ── */}
        <DailyBalanceGrid
          tasksCompleted={completedTasksCount}
          tasksTotal={tasks.length > 0 ? tasks.length : 4}
          habitsCompleted={completedHabitsCount}
          habitsTotal={timelineItems.length}
          nudgesCount={reminders.length > 0 ? reminders.length : 2}
          onPressTasks={() => navigation.navigate('Tasks')}
          onPressHabits={() => setActiveFilter('habits')}
          onPressNudges={() => openAssistant()}
        />

        {/* ── Today's Curated Flow Timeline ── */}
        <View style={styles.flowSection}>
          <View style={styles.flowHeader}>
            <View>
              <Text style={styles.flowTitle}>Today's Curated Flow</Text>
              <Text style={styles.flowSubtitle}>
                Sequenced around your peak clarity
              </Text>
            </View>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleReshuffle}
              style={styles.reshuffleBtn}
            >
              <Animated.View style={{ transform: [{ rotate: spin }] }}>
                <RotateCcw size={14} color="#1B1C19" />
              </Animated.View>
              <Text style={styles.reshuffleText}>Reshuffle</Text>
            </TouchableOpacity>
          </View>

          {/* Filter Pills */}
          <View style={styles.filterRow}>
            {(
              [
                { key: 'all', label: 'All Flow' },
                { key: 'tasks', label: 'Tasks' },
                { key: 'habits', label: 'Habits' },
                { key: 'voice', label: 'Voice Nudges' },
              ] as const
            ).map(f => {
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
            })}
          </View>

          {/* Timeline Nodes List */}
          <View style={styles.timelineList}>
            {filteredTimeline.map((item, idx) => (
              <TimelineItemCard
                key={item.id}
                item={item}
                isFirst={idx === 0}
                isLast={idx === filteredTimeline.length - 1}
                onToggleComplete={handleToggleComplete}
                onExtendMinutes={handleExtendMinutes}
                onPressCard={selected => {
                  if (selected.status === 'spoken_checkin') {
                    openAssistant();
                  } else {
                    handleToggleComplete(selected.id);
                  }
                }}
              />
            ))}
          </View>
        </View>

        {/* ── Bottom Quick Action Trigger Bar ── */}
        <View style={styles.actionTriggersRow}>
          <TouchableOpacity
            activeOpacity={0.88}
            onPress={openTaskModal}
            style={styles.addFlowBtn}
          >
            <Plus size={18} color="#FFFFFF" strokeWidth={2.4} />
            <Text style={styles.addFlowBtnText}>Add to Today’s Flow</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.88}
            onPress={() => openAssistant()}
            style={styles.voiceAssistantBtn}
            accessibilityLabel="Ask Aria Voice Assistant"
          >
            <Mic size={20} color="#665F3D" strokeWidth={2.2} />
          </TouchableOpacity>
        </View>

        {/* Extra bottom padding to avoid overlapping floating tab bar */}
        <View style={{ height: 96 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FBF9F3',
  },
  header: {
    height: 54,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FBF9F3',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  brandTitle: {
    fontFamily: Fonts.ranade.bold,
    fontSize: 26,
    color: '#1B1C19',
    letterSpacing: -0.4,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  voiceHeaderBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#CCE6D0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tuneButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F0EEE8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#010102',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  greetingSection: {
    marginBottom: 20,
  },
  stateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  ariaActiveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#CCE6D0',
    paddingHorizontal: 10,
    paddingVertical: 3.5,
    borderRadius: 14,
  },
  ariaActiveText: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: 11,
    color: '#2D5A37',
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
    fontSize: 12,
    color: '#77767B',
    letterSpacing: 0.8,
    marginTop: 4,
  },
  greetingText: {
    fontFamily: Fonts.poppins.bold,
    fontSize: 26,
    color: '#1B1C19',
    letterSpacing: -0.5,
    marginTop: 2,
  },
  flowSection: {
    marginBottom: 24,
  },
  flowHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  flowTitle: {
    fontFamily: Fonts.poppins.bold,
    fontSize: 18,
    color: '#1B1C19',
    letterSpacing: -0.2,
  },
  flowSubtitle: {
    fontFamily: Fonts.poppins.regular,
    fontSize: 12,
    color: '#77767B',
    marginTop: 2,
  },
  reshuffleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F0EEE8',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  reshuffleText: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: 11.5,
    color: '#1B1C19',
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  filterPill: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 14,
    backgroundColor: '#F0EEE8',
  },
  filterPillActive: {
    backgroundColor: '#1C1C1E',
  },
  filterPillText: {
    fontFamily: Fonts.poppins.medium,
    fontSize: 11.5,
    color: '#77767B',
  },
  filterPillTextActive: {
    color: '#FFFFFF',
    fontFamily: Fonts.poppins.semiBold,
  },
  timelineList: {
    marginTop: 4,
  },
  actionTriggersRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 8,
  },
  addFlowBtn: {
    flex: 1,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#010102',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.16,
    shadowRadius: 12,
    elevation: 6,
  },
  addFlowBtnText: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: 14,
    color: '#FFFFFF',
  },
  voiceAssistantBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#EAE8E2',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
});

export default DashboardScreen;
