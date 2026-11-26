import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from 'react';
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
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import {
  Plus,
  CheckSquare,
  CheckCircle2,
  CalendarDays,
  Sparkles,
  CalendarClock,
  ArrowUpDown,
} from 'lucide-react-native';
import Toast from 'react-native-toast-message';

import { Fonts } from '../../Theme/fonts';
import { Typography } from '../../Theme/Typographys';
import { Colors, withAlpha } from '../../Assets/StyleUtilities/Colors';
import ResponsivePixels from '../../Assets/StyleUtilities/ResponsivePixels';
import { useTaskReminder, Task } from '../../Context/TaskReminderContext';
import { ScreenHeader, SCREEN_HEADER_HEIGHT } from '../../Common/ScreenHeader';
import {
  TactileSegmentedTabs,
  FlowSectionSheet,
  DailyQuoteFooter,
  SearchInputBar,
  HeaderActionButton,
  Badge,
  UnifiedSchedulePickerModal,
} from '../../Common';

import TaskSectionBackgroundSvg from './Components/TaskSectionBackgroundSvg';
import TaskProductivityBento from './Components/TaskProductivityBento';
import TaskCategoryCarousel from './Components/TaskCategoryCarousel';
import TaskCardItem from './Components/TaskCardItem';
import TaskCompleteDoodleSvg from './Components/TaskCompleteDoodleSvg';
import UpcomingAgendaStrip from './Components/UpcomingAgendaStrip';
import AddTaskModal from '../../Components/AddTaskModal';
import { useAppTheme } from '../../Theme/useAppTheme';
import {
  toLocalISODate,
  addDaysToISO,
  parseLocalISODate,
  resolveTaskDueDate,
  classifyTaskHorizon,
  isTaskRelevantToday,
  formatDisplayDate,
  formatShortDateBadge,
  parseTimeToMinutes,
} from '../../Utils/taskDateUtils';

type HorizonKey = 'today' | 'upcoming' | 'anytime' | 'completed';
type PriorityFilter = 'all' | 'high' | 'medium' | 'low';
type SortMode = 'smart' | 'time' | 'priority';

const PRIORITY_WEIGHT: Record<'high' | 'medium' | 'low', number> = {
  high: 0,
  medium: 1,
  low: 2,
};

const TaskListSeparator = () => <View style={styles.listSeparator} />;

export const TasksScreen: React.FC<any> = ({ route }) => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const {
    isDarkMode,
    bgMain,
    cardBg,
    textPrimary,
    textSecondary,
    accentDeep,
    borderLight,
  } = useAppTheme();

  const [activeHorizon, setActiveHorizon] = useState<HorizonKey>('today');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedUpcomingDate, setSelectedUpcomingDate] = useState<
    string | null
  >(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>('all');
  const [sortMode, setSortMode] = useState<SortMode>('smart');
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [reschedulingTask, setReschedulingTask] = useState<Task | null>(null);

  const {
    tasks,
    taskCategories,
    toggleTask,
    updateTask,
    deleteTask,
    selectAllTasks,
    rescheduleTask,
    rescheduleOverdueToToday,
    openTaskModal,
  } = useTaskReminder();

  const todayISO = toLocalISODate();

  // Scroll tracking matching DashboardScreen and HabitsScreen reactive headers
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

  useEffect(() => {
    if (route?.params?.openAddModal) {
      openTaskModal();
    }
  }, [route?.params, openTaskModal]);

  const handleOpenAddForContext = useCallback(
    (overrideDueDate?: string | null) => {
      let targetDueDate: string | null = todayISO;
      if (overrideDueDate !== undefined) {
        targetDueDate = overrideDueDate;
      } else if (activeHorizon === 'upcoming') {
        targetDueDate = selectedUpcomingDate || addDaysToISO(todayISO, 1);
      } else if (activeHorizon === 'anytime') {
        targetDueDate = null;
      }
      openTaskModal({
        dueDate: targetDueDate,
        category: selectedCategory || undefined,
      });
    },
    [
      activeHorizon,
      selectedUpcomingDate,
      selectedCategory,
      todayISO,
      openTaskModal,
    ],
  );

  // Horizon buckets for segmented tab counts
  const horizonCounts = useMemo(() => {
    let today = 0;
    let upcoming = 0;
    let anytime = 0;
    let completed = 0;

    tasks.forEach(task => {
      if (task.done) {
        completed += 1;
        return;
      }
      const h = classifyTaskHorizon(task, todayISO);
      if (h === 'overdue' || h === 'today') {
        today += 1;
      } else if (h === 'upcoming') {
        upcoming += 1;
      } else {
        anytime += 1;
      }
    });

    return { today, upcoming, anytime, completed };
  }, [tasks, todayISO]);

  // Metrics for TaskCategoryCarousel scoped to active (non-completed) or completed horizon
  const categoryMetricTasks = useMemo(() => {
    if (activeHorizon === 'completed') {
      return tasks;
    }
    if (activeHorizon === 'today') {
      return tasks.filter(t => isTaskRelevantToday(t, todayISO));
    }
    if (activeHorizon === 'upcoming') {
      return tasks.filter(
        t => !t.done && classifyTaskHorizon(t, todayISO) === 'upcoming',
      );
    }
    return tasks.filter(
      t => !t.done && classifyTaskHorizon(t, todayISO) === 'anytime',
    );
  }, [tasks, activeHorizon, todayISO]);

  const sortTasks = useCallback(
    (list: Task[]) => {
      return [...list].sort((a, b) => {
        if (sortMode === 'priority') {
          const pA = PRIORITY_WEIGHT[a.priority || 'medium'];
          const pB = PRIORITY_WEIGHT[b.priority || 'medium'];
          if (pA !== pB) return pA - pB;
        }

        const dateA = resolveTaskDueDate(a, todayISO) || '9999-12-31';
        const dateB = resolveTaskDueDate(b, todayISO) || '9999-12-31';
        if (sortMode === 'smart' && dateA !== dateB) {
          return dateA.localeCompare(dateB);
        }

        const timeA = parseTimeToMinutes(a.dueTime ?? a.time);
        const timeB = parseTimeToMinutes(b.dueTime ?? b.time);
        if (timeA !== timeB) return timeA - timeB;

        if (sortMode === 'time' && dateA !== dateB) {
          return dateA.localeCompare(dateB);
        }

        return a.label.localeCompare(b.label);
      });
    },
    [sortMode, todayISO],
  );

  // Filtered tasks for active horizon + category + search + priority + upcoming date
  const filteredTasks = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    const matched = tasks.filter(task => {
      const horizon = classifyTaskHorizon(task, todayISO);

      if (activeHorizon === 'today') {
        if (task.done || (horizon !== 'today' && horizon !== 'overdue')) {
          return false;
        }
      } else if (activeHorizon === 'upcoming') {
        if (task.done || horizon !== 'upcoming') return false;
        if (selectedUpcomingDate) {
          const due = resolveTaskDueDate(task, todayISO);
          if (due !== selectedUpcomingDate) return false;
        }
      } else if (activeHorizon === 'anytime') {
        if (task.done || horizon !== 'anytime') return false;
      } else if (activeHorizon === 'completed') {
        if (!task.done) return false;
      }

      if (selectedCategory) {
        if (selectedCategory === 'works') {
          if (task.category && task.category !== 'works') return false;
        } else if (task.category !== selectedCategory) {
          return false;
        }
      }

      if (priorityFilter !== 'all') {
        if ((task.priority || 'medium') !== priorityFilter) return false;
      }

      if (query) {
        const hay = `${task.label} ${task.note || ''}`.toLowerCase();
        if (!hay.includes(query)) return false;
      }

      return true;
    });

    return sortTasks(matched);
  }, [
    tasks,
    todayISO,
    activeHorizon,
    selectedUpcomingDate,
    selectedCategory,
    priorityFilter,
    searchQuery,
    sortTasks,
  ]);

  const overdueTasks = useMemo(() => {
    if (activeHorizon !== 'today') return [];
    return filteredTasks.filter(
      t => !t.done && classifyTaskHorizon(t, todayISO) === 'overdue',
    );
  }, [activeHorizon, filteredTasks, todayISO]);

  // Group Upcoming tasks chronologically by date when viewing "All Upcoming"
  const groupedUpcomingSections = useMemo(() => {
    if (activeHorizon !== 'upcoming' || selectedUpcomingDate !== null) {
      return [];
    }
    const groups: Record<string, Task[]> = {};
    filteredTasks.forEach(t => {
      const key = resolveTaskDueDate(t, todayISO) || addDaysToISO(todayISO, 1);
      if (!groups[key]) groups[key] = [];
      groups[key].push(t);
    });
    return Object.keys(groups)
      .sort()
      .map(dateISO => ({
        dateISO,
        title: formatDisplayDate(dateISO, todayISO),
        data: groups[dateISO],
      }));
  }, [activeHorizon, selectedUpcomingDate, filteredTasks, todayISO]);

  const handleToggleTask = useCallback(
    (id: string) => {
      const updated = toggleTask(id);
      if (updated) {
        Toast.show({
          type: 'success',
          text1: updated.done ? 'Task completed' : 'Task active',
          text2: updated.done
            ? updated.recurrence && updated.recurrence !== 'none'
              ? 'Completed & next occurrence scheduled.'
              : 'Marked as completed.'
            : 'Returned to your active task list.',
        });
      }
    },
    [toggleTask],
  );

  const handleViewDetails = useCallback(
    (task: Task) => {
      navigation.navigate('TaskDetailsScreen', { taskId: task.id });
    },
    [navigation],
  );

  const handleMoveOverdueToToday = useCallback(() => {
    const ids = overdueTasks.map(t => t.id);
    const moved = rescheduleOverdueToToday(ids);
    if (moved > 0) {
      Toast.show({
        type: 'success',
        text1: 'Schedule Rebalanced',
        text2: `Moved ${moved} overdue task${moved === 1 ? '' : 's'} to Today.`,
      });
    }
  }, [overdueTasks, rescheduleOverdueToToday]);

  const handleCycleSort = useCallback(() => {
    setSortMode(prev =>
      prev === 'smart' ? 'time' : prev === 'time' ? 'priority' : 'smart',
    );
  }, []);

  const activeCategoryObj = useMemo(
    () => taskCategories.find(c => c.id === selectedCategory),
    [taskCategories, selectedCategory],
  );

  const sectionTitle = useMemo(() => {
    const catPrefix = activeCategoryObj ? `${activeCategoryObj.label} · ` : '';
    switch (activeHorizon) {
      case 'today':
        return `${catPrefix}Today’s Focus`;
      case 'upcoming':
        return selectedUpcomingDate
          ? `${catPrefix}${formatShortDateBadge(
              selectedUpcomingDate,
              todayISO,
            )}`
          : `${catPrefix}Upcoming Schedule`;
      case 'anytime':
        return `${catPrefix}Anytime Backlog`;
      case 'completed':
        return `${catPrefix}Completed Archive`;
    }
  }, [activeHorizon, activeCategoryObj, selectedUpcomingDate, todayISO]);

  const sectionSubtitle = useMemo(() => {
    const count = filteredTasks.length;
    if (activeHorizon === 'completed') {
      return `${count} finished objective${count === 1 ? '' : 's'}`;
    }
    if (activeHorizon === 'today') {
      const doneToday = tasks.filter(
        t => t.done && isTaskRelevantToday(t, todayISO),
      ).length;
      return `${count} active · ${doneToday} done today`;
    }
    if (activeHorizon === 'upcoming') {
      return selectedUpcomingDate
        ? `${count} scheduled for ${formatDisplayDate(
            selectedUpcomingDate,
            todayISO,
          )}`
        : `${count} future objective${count === 1 ? '' : 's'}`;
    }
    return `${count} flexible objective${count === 1 ? '' : 's'}`;
  }, [
    filteredTasks.length,
    activeHorizon,
    tasks,
    todayISO,
    selectedUpcomingDate,
  ]);

  const taskTabs = useMemo(
    () => [
      {
        key: 'today' as HorizonKey,
        label: 'Today',
        icon: CheckSquare,
        count: horizonCounts.today,
        countVariant: 'yellow' as const,
      },
      {
        key: 'upcoming' as HorizonKey,
        label: 'Upcoming',
        icon: CalendarDays,
        count: horizonCounts.upcoming,
        countVariant: 'purple' as const,
      },
      {
        key: 'anytime' as HorizonKey,
        label: 'Anytime',
        icon: Sparkles,
        count: horizonCounts.anytime,
        countVariant: 'neutral' as const,
      },
      {
        key: 'completed' as HorizonKey,
        label: 'Done',
        icon: CheckCircle2,
        count: horizonCounts.completed,
        countVariant: 'green' as const,
      },
    ],
    [horizonCounts],
  );

  const handleBulkAction = () => {
    const markDone = activeHorizon !== 'completed';
    const ids = filteredTasks.map(t => t.id);
    Alert.alert(
      markDone ? 'Complete Visible Tasks' : 'Restore Completed Tasks',
      markDone
        ? `Mark all ${ids.length} visible tasks as completed?`
        : `Return ${ids.length} completed tasks back to active lists?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: markDone ? 'Complete All' : 'Restore All',
          onPress: () => {
            selectAllTasks(markDone, ids);
            Toast.show({
              type: 'success',
              text1: markDone
                ? 'Tasks completed'
                : 'Tasks restored to active list',
              text2: markDone
                ? `${ids.length} items marked as completed.`
                : `${ids.length} items returned to your schedule.`,
            });
          },
        },
      ],
    );
  };

  const renderEmptyState = () => {
    let emptyTitle = 'No Tasks Yet';
    let emptySubtitle = 'Tap below to craft your next objective.';
    let ctaLabel = 'Add Task';

    if (searchQuery.trim() || priorityFilter !== 'all') {
      emptyTitle = 'No Matching Tasks';
      emptySubtitle = 'Try clearing your search or priority filter.';
    } else if (activeHorizon === 'completed') {
      emptyTitle = 'No Completed Tasks Yet';
      emptySubtitle =
        'Completed tasks will appear here as you conquer your daily focus.';
    } else if (activeHorizon === 'upcoming') {
      emptyTitle = selectedUpcomingDate
        ? `Nothing on ${formatShortDateBadge(selectedUpcomingDate, todayISO)}`
        : 'No Upcoming Tasks';
      emptySubtitle =
        'Plan ahead by scheduling an objective for any future date.';
      ctaLabel = selectedUpcomingDate
        ? `Add for ${formatShortDateBadge(selectedUpcomingDate, todayISO)}`
        : 'Schedule Future Task';
    } else if (activeHorizon === 'anytime') {
      emptyTitle = 'Anytime Backlog Clear';
      emptySubtitle =
        'Capture flexible tasks without a fixed due date for when inspiration strikes.';
      ctaLabel = 'Add Anytime Task';
    }

    return (
      <View style={styles.emptyContainer}>
        {activeHorizon === 'completed' ? (
          <CheckCircle2
            size={ResponsivePixels.size38}
            color={Colors.ToastSuccessAccent}
            strokeWidth={1.6}
          />
        ) : activeHorizon === 'upcoming' ? (
          <CalendarDays
            size={ResponsivePixels.size38}
            color={Colors.LavenderPurple}
            strokeWidth={1.5}
          />
        ) : (
          <CheckSquare
            size={ResponsivePixels.size38}
            color={Colors.Gray300}
            strokeWidth={1.5}
          />
        )}
        <Text style={[styles.emptyTitle, { color: textPrimary }]}>
          {emptyTitle}
        </Text>
        <Text style={[styles.emptySubtitle, { color: textSecondary }]}>
          {emptySubtitle}
        </Text>
        {activeHorizon !== 'completed' && (
          <TouchableOpacity
            activeOpacity={0.85}
            style={styles.addEmptyBtn}
            onPress={() => handleOpenAddForContext()}
          >
            <Plus
              size={ResponsivePixels.size14}
              color={Colors.PureWhite}
              strokeWidth={2.4}
            />
            <Text style={styles.addEmptyBtnText}>{ctaLabel}</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

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
              backgroundColor: isScrolled ? accentDeep : bgMain,
              translucent: true,
            }
          : {})}
      />

      {/* Reusable reactive Screen Header with voice orb and avatar */}
      <ScreenHeader
        title="Tasks"
        subtitle="Daily Objectives & Horizons"
        scrollY={scrollY}
        isScrolled={isScrolled}
        onPressSettings={() => navigation.navigate('Settings')}
        onPressProfile={() => navigation.navigate('ProfileScreen')}
      />

      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop:
              insets.top + SCREEN_HEADER_HEIGHT + ResponsivePixels.size10,
            paddingBottom: 0,
          },
        ]}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {/* Compact Focus Bar matching DailyBriefingCard */}
        <View style={styles.bentoCardWrapper}>
          <TaskProductivityBento
            tasks={tasks}
            onAddTask={() => handleOpenAddForContext()}
          />
        </View>

        {/* 4-Horizon Tactile Segmented Tabs */}
        <TactileSegmentedTabs
          tabs={taskTabs}
          activeTab={activeHorizon}
          onChangeTab={next => {
            setActiveHorizon(next);
            if (next !== 'upcoming') {
              setSelectedUpcomingDate(null);
            }
          }}
        />

        {/* Categories Carousel */}
        <TaskCategoryCarousel
          tasks={categoryMetricTasks}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          onAddPress={() => handleOpenAddForContext()}
          isSearchOpen={isSearchOpen}
          onToggleSearch={() => setIsSearchOpen(v => !v)}
        />

        {/* Tasks section */}
        <FlowSectionSheet
          title={sectionTitle}
          subtitle={sectionSubtitle}
          backgroundSvg={<TaskSectionBackgroundSvg />}
          onPressAdd={() => handleOpenAddForContext()}
          addAccessibilityLabel="Add new task"
          bottomPadding={insets.bottom + ResponsivePixels.size130}
          containerStyle={styles.taskSection}
        >
          {/* Collapsible Search + Priority/Sort Toolbar */}
          {isSearchOpen && (
            <View style={styles.searchToolbarWrap}>
              <SearchInputBar
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Search tasks or notes..."
                containerStyle={styles.searchInputBar}
              />

              <View style={styles.filterControlsRow}>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.priorityChipsRow}
                >
                  {(['all', 'high', 'medium', 'low'] as const).map(level => {
                    const active = priorityFilter === level;
                    const label =
                      level === 'all'
                        ? 'All Priority'
                        : level.charAt(0).toUpperCase() + level.slice(1);
                    return (
                      <TouchableOpacity
                        key={level}
                        activeOpacity={0.8}
                        onPress={() => setPriorityFilter(level)}
                        style={[
                          styles.toolbarChip,
                          isDarkMode && {
                            backgroundColor: cardBg,
                            borderColor: borderLight,
                          },
                          active && styles.toolbarChipActive,
                        ]}
                      >
                        <Text
                          style={[
                            styles.toolbarChipText,
                            isDarkMode && { color: textSecondary },
                            active && styles.toolbarChipTextActive,
                          ]}
                        >
                          {label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>

                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={handleCycleSort}
                  style={[
                    styles.sortChip,
                    isDarkMode && {
                      backgroundColor: cardBg,
                      borderColor: borderLight,
                    },
                  ]}
                  accessibilityRole="button"
                  accessibilityLabel={`Sort by ${sortMode}`}
                >
                  <ArrowUpDown
                    size={ResponsivePixels.size12}
                    color={
                      isDarkMode ? Colors.AccentYellow : Colors.MidnightCharcoal
                    }
                    strokeWidth={2.3}
                  />
                  <Text
                    style={[
                      styles.sortChipText,
                      isDarkMode && { color: textPrimary },
                    ]}
                  >
                    {sortMode === 'smart'
                      ? 'Smart'
                      : sortMode === 'time'
                      ? 'Time'
                      : 'Priority'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Upcoming Future Date Strip */}
          {activeHorizon === 'upcoming' && (
            <UpcomingAgendaStrip
              tasks={tasks}
              selectedDateISO={selectedUpcomingDate}
              onSelectDateISO={setSelectedUpcomingDate}
            />
          )}

          {/* Overdue Recovery Banner (in Today Horizon) */}
          {activeHorizon === 'today' && overdueTasks.length > 0 && (
            <View
              style={[
                styles.overdueBanner,
                isDarkMode && {
                  backgroundColor: Colors.UrgentDarkIconBg,
                  borderColor: Colors.UrgentDarkBorder,
                },
              ]}
            >
              <View style={styles.overdueLeft}>
                <Badge
                  label={`${overdueTasks.length} OVERDUE`}
                  variant="red"
                  size="sm"
                />
                <Text style={[styles.overdueCopy, { color: textSecondary }]}>
                  Carried over from earlier dates
                </Text>
              </View>

              <HeaderActionButton
                label="Move to Today"
                icon={CalendarClock}
                onPress={handleMoveOverdueToToday}
                accessibilityLabel="Move overdue tasks to today"
              />
            </View>
          )}

          {/* Chronological Day-Grouped List in "All Upcoming", or FlatList otherwise */}
          {activeHorizon === 'upcoming' &&
          selectedUpcomingDate === null &&
          groupedUpcomingSections.length > 0 ? (
            <View style={styles.groupedContainer}>
              {groupedUpcomingSections.map(group => (
                <View key={group.dateISO} style={styles.dayGroupBlock}>
                  <View style={styles.dayGroupHeader}>
                    <View style={styles.dayGroupTitleRow}>
                      <Text
                        style={[styles.dayGroupTitle, { color: textPrimary }]}
                      >
                        {group.title}
                      </Text>
                      <Badge
                        label={`${group.data.length}`}
                        variant="purple"
                        size="sm"
                      />
                    </View>
                    <HeaderActionButton
                      label="Add"
                      icon={Plus}
                      onPress={() => handleOpenAddForContext(group.dateISO)}
                      accessibilityLabel={`Add task for ${group.title}`}
                    />
                  </View>

                  <View style={styles.dayGroupList}>
                    {group.data.map(item => (
                      <TaskCardItem
                        key={item.id}
                        task={item}
                        isChecked={item.done}
                        onToggle={handleToggleTask}
                        onEdit={setEditingTask}
                        onDetails={handleViewDetails}
                        onReschedule={setReschedulingTask}
                      />
                    ))}
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <FlatList
              data={filteredTasks}
              keyExtractor={item => item.id}
              scrollEnabled={false}
              style={styles.taskList}
              contentContainerStyle={styles.taskListContainer}
              renderItem={({ item }) => (
                <TaskCardItem
                  task={item}
                  isChecked={item.done}
                  onToggle={handleToggleTask}
                  onEdit={setEditingTask}
                  onDetails={handleViewDetails}
                  onReschedule={setReschedulingTask}
                />
              )}
              ItemSeparatorComponent={TaskListSeparator}
              ListEmptyComponent={renderEmptyState}
            />
          )}

          {/* Contextual Bulk Action Button (Today & Completed only) */}
          {filteredTasks.length > 0 &&
            (activeHorizon === 'today' || activeHorizon === 'completed') && (
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={handleBulkAction}
                style={styles.selectAllBtn}
              >
                <Text style={styles.selectAllText}>
                  {activeHorizon === 'today'
                    ? 'Complete Today’s Tasks'
                    : 'Restore All to Active'}
                </Text>
              </TouchableOpacity>
            )}

          {/* Footer brand watermark */}
          <DailyQuoteFooter screen="tasks" doodle={<TaskCompleteDoodleSvg />} />
        </FlowSectionSheet>
      </ScrollView>

      {/* Edit Task Modal */}
      {editingTask && (
        <AddTaskModal
          visible={editingTask !== null}
          onClose={() => setEditingTask(null)}
          taskToEdit={editingTask}
          onCreateTask={() => {}}
          onUpdateTask={(id, taskData) => {
            updateTask(id, taskData);
            setEditingTask(null);
            Toast.show({
              type: 'success',
              text1: 'Task Updated',
              text2: 'Objective parameters successfully saved.',
            });
          }}
          onDeleteTask={id => {
            deleteTask(id);
            setEditingTask(null);
          }}
        />
      )}

      {/* Quick Reschedule Calendar Modal */}
      {reschedulingTask && (
        <UnifiedSchedulePickerModal
          visible={reschedulingTask !== null}
          mode="date"
          title="Reschedule Task"
          badgeText="RESCHEDULE HORIZON"
          value={
            parseLocalISODate(
              resolveTaskDueDate(reschedulingTask, todayISO) || todayISO,
            ) || new Date()
          }
          minimumDate={new Date()}
          allowAnytime={true}
          isAnytime={resolveTaskDueDate(reschedulingTask, todayISO) === null}
          onSelectAnytime={() => {
            rescheduleTask(reschedulingTask.id, null);
            Toast.show({
              type: 'success',
              text1: 'Moved to Anytime',
              text2: 'Task moved to your flexible backlog.',
            });
            setReschedulingTask(null);
          }}
          onChange={(_e, date) => {
            if (date) {
              const iso = toLocalISODate(date);
              rescheduleTask(reschedulingTask.id, iso);
              Toast.show({
                type: 'success',
                text1: 'Task Rescheduled',
                text2: `Scheduled for ${formatDisplayDate(iso, todayISO)}.`,
              });
              setReschedulingTask(null);
            }
          }}
          onClose={() => setReschedulingTask(null)}
        />
      )}
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
    // padding applied dynamically with safe insets
  },
  bentoCardWrapper: {
    paddingTop: ResponsivePixels.size5,
    paddingHorizontal: ResponsivePixels.size10,
    marginBottom: ResponsivePixels.size4,
  },
  taskSection: {
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
  searchToolbarWrap: {
    paddingHorizontal: ResponsivePixels.size8,
    marginBottom: ResponsivePixels.size14,
  },
  searchInputBar: {
    marginBottom: ResponsivePixels.size8,
  },
  filterControlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: ResponsivePixels.size8,
  },
  priorityChipsRow: {
    flexDirection: 'row',
    gap: ResponsivePixels.size6,
    alignItems: 'center',
  },
  toolbarChip: {
    paddingHorizontal: ResponsivePixels.size10,
    paddingVertical: ResponsivePixels.size5,
    borderRadius: ResponsivePixels.size14,
    backgroundColor: Colors.PureWhite,
    borderWidth: 1,
    borderColor: Colors.RingBorder,
  },
  toolbarChipActive: {
    backgroundColor: Colors.MidnightCharcoal,
    borderColor: Colors.MidnightCharcoal,
  },
  toolbarChipText: {
    fontFamily: Fonts.poppins.medium,
    fontSize: ResponsivePixels.size11,
    color: Colors.MutedSlateSubtext,
  },
  toolbarChipTextActive: {
    fontFamily: Fonts.poppins.bold,
    color: Colors.PureWhite,
  },
  sortChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ResponsivePixels.size5,
    paddingHorizontal: ResponsivePixels.size10,
    paddingVertical: ResponsivePixels.size5,
    borderRadius: ResponsivePixels.size14,
    backgroundColor: Colors.PureWhite,
    borderWidth: 1,
    borderColor: Colors.RingBorder,
  },
  sortChipText: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: ResponsivePixels.size11,
    color: Colors.MidnightCharcoal,
  },
  overdueBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: ResponsivePixels.size8,
    marginBottom: ResponsivePixels.size12,
    paddingHorizontal: ResponsivePixels.size12,
    paddingVertical: ResponsivePixels.size10,
    borderRadius: ResponsivePixels.size18,
    backgroundColor: Colors.CategoryRedBg,
    borderWidth: 1.2,
    borderColor: Colors.CategoryRedBorder,
    gap: ResponsivePixels.size8,
  },
  overdueLeft: {
    flex: 1,
    gap: ResponsivePixels.size4,
    alignItems: 'flex-start',
  },
  overdueCopy: {
    fontFamily: Fonts.poppins.medium,
    fontSize: ResponsivePixels.size11,
  },
  groupedContainer: {
    gap: ResponsivePixels.size18,
    paddingTop: ResponsivePixels.size4,
    paddingBottom: ResponsivePixels.size16,
  },
  dayGroupBlock: {
    gap: ResponsivePixels.size10,
  },
  dayGroupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: ResponsivePixels.size8,
  },
  dayGroupTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ResponsivePixels.size8,
  },
  dayGroupTitle: {
    fontFamily: Fonts.poppins.bold,
    fontSize: ResponsivePixels.size14_5,
  },
  dayGroupList: {
    gap: ResponsivePixels.size12,
  },
  taskList: {
    overflow: 'visible',
  },
  taskListContainer: {
    paddingHorizontal: 0,
    paddingTop: ResponsivePixels.size10,
    paddingBottom: ResponsivePixels.size20,
    overflow: 'visible',
  },
  listSeparator: {
    height: ResponsivePixels.size12,
  },
  selectAllBtn: {
    backgroundColor: Colors.MidnightCharcoal,
    borderRadius: ResponsivePixels.size50,
    paddingVertical: ResponsivePixels.size14,
    paddingHorizontal: ResponsivePixels.size36,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: ResponsivePixels.size8,
    marginBottom: ResponsivePixels.size24,
    ...Platform.select({
      ios: {
        shadowColor: Colors.PureBlack,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  selectAllText: {
    ...Typography.bodyMediumPoppinsSemiBold,
    color: Colors.PureWhite,
    fontSize: ResponsivePixels.size13_5,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: ResponsivePixels.size40,
    paddingHorizontal: ResponsivePixels.size20,
    gap: ResponsivePixels.size8,
  },
  emptyTitle: {
    ...Typography.bodyMediumPoppinsSemiBold,
    color: Colors.Gray700,
    fontSize: ResponsivePixels.size15,
    marginTop: ResponsivePixels.size6,
  },
  emptySubtitle: {
    ...Typography.bodySmallPoppinsRegular,
    color: Colors.Gray400,
    textAlign: 'center',
    paddingHorizontal: ResponsivePixels.size20,
    lineHeight: ResponsivePixels.size18,
  },
  addEmptyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ResponsivePixels.size6,
    backgroundColor: Colors.MidnightCharcoal,
    paddingHorizontal: ResponsivePixels.size20,
    paddingVertical: ResponsivePixels.size10,
    borderRadius: ResponsivePixels.size50,
    marginTop: ResponsivePixels.size12,
  },
  addEmptyBtnText: {
    ...Typography.bodySmallPoppinsSemiBold,
    color: Colors.PureWhite,
    fontSize: ResponsivePixels.size12_5,
  },
});

export default TasksScreen;
