import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Sparkles, Sun, Settings, Mic, Calendar } from 'lucide-react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Toast from 'react-native-toast-message';

import { Fonts } from '../../Theme/fonts';
import { Colors } from '../../Assets/StyleUtilities/Colors';
import { SVGS } from '../../Assets/Images';
import { RegiusLogo } from '../../Common/RegiusLogo';
import { Badge } from '../../Common/Badge';
import { useTaskReminder } from '../../Context/TaskReminderContext';
import { useVoiceWakeWord } from '../../Context/VoiceWakeWordContext';
import DailyBriefingCard from './Components/DailyBriefingCard';
import DailyBalanceGrid from './Components/DailyBalanceGrid';
import TimelineItemCard, { TimelineItem } from './Components/TimelineItemCard';

type FlowFilter = 'all' | 'tasks' | 'habits' | 'reminders' | 'voice';

/**
 * Robustly parses a 12-hour or 24-hour time string into total minutes since midnight.
 * e.g., "07:30 AM" -> 450, "01:15 PM" -> 795, undefined -> 9999.
 */
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
  const navigation = useNavigation<any>();
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
          <RegiusLogo size="md" variant="default" />
        </View>

        <View style={styles.headerRight}>
          {/* Small Holographic Voice Button */}
          <TouchableOpacity
            activeOpacity={0.75}
            onPress={() => triggerWakeWord()}
            style={styles.voiceHeaderBtn}
            accessibilityRole="button"
            accessibilityLabel="Hey Regius Voice Assistant"
            hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
          >
            <View style={styles.voiceHeaderGlow} />
            <Mic size={16} color="#7059C8" strokeWidth={2.4} />
          </TouchableOpacity>

          {/* Proper Settings Gear Button */}
          <TouchableOpacity
            activeOpacity={0.75}
            onPress={() => navigation.navigate('Settings')}
            style={styles.settingsBtn}
            accessibilityRole="button"
            accessibilityLabel="Open Settings"
            hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
          >
            <Settings size={18} color="#1B1C19" strokeWidth={2} />
          </TouchableOpacity>

          {/* Profile Avatar with signature RingBorder (exact match to HomeScreen) */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.navigate('Settings')}
            style={styles.avatarRing}
            accessibilityRole="button"
            accessibilityLabel="User Profile"
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
        {/* ── Greeting & Ambient Assistant State ── */}
        <View style={styles.greetingSection}>
          <View style={styles.stateRow}>
            <Badge
              label={`${assistantName} Flow Active`}
              variant="green"
              size="md"
              icon={<Sparkles size={12} color="#1B9A72" />}
            />

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

        {/* ── Dynamic Voice Briefing Banner (Playable Audio) ── */}
        <DailyBriefingCard
          taskCount={tasks.length}
          reminderCount={reminders.length}
          habitCount={habits.length}
          assistantName={assistantName}
          onOpenVoiceAssistant={() => openAssistant()}
        />

        {/* ── Daily Balance & Energy Gauge (Bento Grid) ── */}
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

        {/* ── Today's Curated Flow Timeline ── */}
        <View style={styles.flowSection}>
          <View style={styles.flowHeader}>
            <View>
              <Text style={styles.flowTitle}>Today’s Curated Flow</Text>
              <Text style={styles.flowSubtitle}>
                Sequenced around your peak clarity
              </Text>
            </View>
          </View>

          {/* Filter Pills in Standard Sequence: All, Tasks, Reminders, Habits */}
          <View style={styles.filterRow}>
            {(
              [
                { key: 'all', label: 'All Flow' },
                { key: 'tasks', label: 'Tasks' },
                { key: 'reminders', label: 'Reminders' },
                { key: 'habits', label: 'Habits' },
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
            })}
          </View>

          {/* Chronological Timeline Nodes List */}
          <View style={styles.timelineList}>
            {scheduledItems.map((item, idx) => (
              <TimelineItemCard
                key={item.id}
                item={item}
                isFirst={idx === 0}
                isLast={
                  idx === scheduledItems.length - 1 &&
                  unscheduledItems.length === 0
                }
                onToggleComplete={handleToggleComplete}
                onPressCard={handlePressCard}
              />
            ))}

            {/* Unscheduled / Any time section if applicable */}
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
                {unscheduledItems.map((item, idx) => (
                  <TimelineItemCard
                    key={item.id}
                    item={item}
                    isFirst={scheduledItems.length === 0 && idx === 0}
                    isLast={idx === unscheduledItems.length - 1}
                    onToggleComplete={handleToggleComplete}
                    onPressCard={handlePressCard}
                  />
                ))}
              </View>
            )}
          </View>
        </View>

        {/* Clean bottom padding to ensure final item scrolls comfortably above bottom tabs */}
        <View style={{ height: 100 }} />
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
    height: 52,
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
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  voiceHeaderBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(131, 131, 214, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(131, 131, 214, 0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    shadowColor: '#8383D6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.22,
    shadowRadius: 5,
    elevation: 3,
  },
  voiceHeaderGlow: {
    position: 'absolute',
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(131, 131, 214, 0.08)',
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
  avatarRing: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: Colors.RingBorder,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
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
    marginBottom: 10,
  },
  ariaActiveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#CCE6D0',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    gap: 5,
  },
  ariaActiveText: {
    fontFamily: Fonts.poppins.medium,
    fontSize: 11.5,
    color: '#2D5A37',
  },
  ambientStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  ambientStatusText: {
    fontFamily: Fonts.poppins.medium,
    fontSize: 12,
    color: '#665F3D',
  },
  dateText: {
    fontFamily: Fonts.poppins.medium,
    fontSize: 12,
    color: '#77767B',
    letterSpacing: 0.8,
    marginBottom: 2,
  },
  greetingText: {
    fontFamily: Fonts.poppins.bold,
    fontSize: 27,
    color: '#1B1C19',
    letterSpacing: -0.5,
  },
  flowSection: {
    marginBottom: 16,
  },
  flowHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  flowTitle: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: 18,
    color: '#1B1C19',
    letterSpacing: -0.2,
  },
  flowSubtitle: {
    fontFamily: Fonts.poppins.regular,
    fontSize: 12,
    color: '#77767B',
    marginTop: 1,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 18,
  },
  filterPill: {
    paddingHorizontal: 13,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#ECE8DF',
  },
  filterPillActive: {
    backgroundColor: '#1B1C19',
    borderColor: '#1B1C19',
  },
  filterPillText: {
    fontFamily: Fonts.poppins.medium,
    fontSize: 12,
    color: '#666665',
  },
  filterPillTextActive: {
    color: '#FFFFFF',
  },
  timelineList: {
    position: 'relative',
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
});

export default DashboardScreen;
