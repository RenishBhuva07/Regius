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
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Plus, CheckSquare, CheckCircle2 } from 'lucide-react-native';
import Toast from 'react-native-toast-message';

import { Fonts } from '../../Theme/fonts';
import { Typography } from '../../Theme/Typographys';
import { Colors } from '../../Assets/StyleUtilities/Colors';
import ResponsivePixels from '../../Assets/StyleUtilities/ResponsivePixels';
import { useTaskReminder } from '../../Context/TaskReminderContext';
import { ScreenHeader, SCREEN_HEADER_HEIGHT } from '../../Common/ScreenHeader';
import FlowBadgePatternSvg from '../Dashboard/Components/FlowBadgePatternSvg';

import TaskSectionBackgroundSvg from './Components/TaskSectionBackgroundSvg';
import TaskProductivityBento from './Components/TaskProductivityBento';
import TaskCategoryCarousel from './Components/TaskCategoryCarousel';
import TaskCardItem from './Components/TaskCardItem';
import TaskCompleteDoodleSvg from './Components/TaskCompleteDoodleSvg';
import { useDailyQuote } from '../../Services/DailyQuotes';

type TabKey = 'taskList' | 'completed';

export const TasksScreen: React.FC<any> = ({ route }) => {
  const insets = useSafeAreaInsets();
  const dailyQuote = useDailyQuote('tasks');
  const [activeTab, setActiveTab] = useState<TabKey>('taskList');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    'works',
  );

  const { tasks, toggleTask, selectedTasks, selectAllTasks, openTaskModal } =
    useTaskReminder();

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

  // Trigger from navigation params (e.g. from PlusActionSheet or other routes)
  useEffect(() => {
    if (route?.params?.openAddModal) {
      openTaskModal();
    }
  }, [route?.params, openTaskModal]);

  // Compute live task counts
  const completedTasksCount = useMemo(
    () => tasks.filter(t => t.done).length,
    [tasks],
  );
  const pendingTasksCount = useMemo(
    () => tasks.filter(t => !t.done).length,
    [tasks],
  );

  // Filter tasks based on activeTab ('taskList' vs 'completed') and selectedCategory
  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      // 1. Tab filtering
      if (activeTab === 'taskList' && task.done) return false;
      if (activeTab === 'completed' && !task.done) return false;

      // 2. Category filtering
      if (selectedCategory) {
        if (selectedCategory === 'works') {
          return task.category === 'works' || !task.category;
        }
        return task.category === selectedCategory;
      }

      return true;
    });
  }, [tasks, activeTab, selectedCategory]);

  const handleToggleTask = useCallback(
    (id: string) => {
      const updated = toggleTask(id);
      if (updated) {
        Toast.show({
          type: 'success',
          text1: updated.done ? 'Task Completed! 🎯' : 'Task Active',
          text2: updated.done
            ? 'Great momentum on your daily flow!'
            : 'Returned to your active task list.',
        });
      }
    },
    [toggleTask],
  );

  // Section title matching HabitsScreen Today's Rituals style
  const sectionTitle = useMemo(() => {
    if (activeTab === 'completed') {
      return 'Completed Tasks';
    }
    if (selectedCategory === 'works') {
      return 'Today’s Works';
    }
    if (selectedCategory) {
      return `Today’s ${
        selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)
      }`;
    }
    return 'Today’s Tasks';
  }, [activeTab, selectedCategory]);

  // Section subtitle matching HabitsScreen: "X of Y completed"
  const sectionSubtitle = useMemo(() => {
    const total = filteredTasks.length;
    const completed = filteredTasks.filter(t => t.done).length;
    if (activeTab === 'completed') {
      return `${completedTasksCount} finished items`;
    }
    return `${completed} of ${total} completed`;
  }, [filteredTasks, activeTab, completedTasksCount]);

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

      {/* Reusable reactive Screen Header with voice orb and avatar */}
      <ScreenHeader
        title="Tasks"
        subtitle="Daily Objectives & Focus"
        scrollY={scrollY}
        isScrolled={isScrolled}
      />

      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: insets.top + SCREEN_HEADER_HEIGHT + 6,
            paddingBottom: 0,
          },
        ]}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {/* Compact Focus Bar matching DailyBriefingCard */}
        <View style={styles.bentoCardWrapper}>
          <TaskProductivityBento tasks={tasks} onAddTask={openTaskModal} />
        </View>

        {/* Signature Regius Tactile Segmented Tabs */}
        <View style={styles.toggleContainer}>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => setActiveTab('taskList')}
            style={[
              styles.toggleTab,
              activeTab === 'taskList' && styles.toggleTabActive,
            ]}
            accessibilityRole="tab"
            accessibilityState={{ selected: activeTab === 'taskList' }}
          >
            <CheckSquare
              size={14}
              color={activeTab === 'taskList' ? '#D97706' : '#9EA3B0'}
              strokeWidth={activeTab === 'taskList' ? 2.4 : 2}
            />
            <Text
              style={[
                styles.toggleText,
                activeTab === 'taskList'
                  ? styles.toggleTextActive
                  : styles.toggleTextInactive,
              ]}
            >
              Task List
            </Text>
            <View
              style={[
                styles.tabCountPill,
                activeTab === 'taskList'
                  ? styles.tabCountPillActiveTasks
                  : styles.tabCountPillInactive,
              ]}
            >
              <Text
                style={[
                  styles.tabCountText,
                  activeTab === 'taskList'
                    ? styles.tabCountTextActiveTasks
                    : styles.tabCountTextInactive,
                ]}
              >
                {pendingTasksCount}
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => setActiveTab('completed')}
            style={[
              styles.toggleTab,
              activeTab === 'completed' && styles.toggleTabActive,
            ]}
            accessibilityRole="tab"
            accessibilityState={{ selected: activeTab === 'completed' }}
          >
            <CheckCircle2
              size={14}
              color={activeTab === 'completed' ? '#10B981' : '#9EA3B0'}
              strokeWidth={activeTab === 'completed' ? 2.4 : 2}
            />
            <Text
              style={[
                styles.toggleText,
                activeTab === 'completed'
                  ? styles.toggleTextActive
                  : styles.toggleTextInactive,
              ]}
            >
              Completed
            </Text>
            <View
              style={[
                styles.tabCountPill,
                activeTab === 'completed'
                  ? styles.tabCountPillActiveCompleted
                  : styles.tabCountPillInactive,
              ]}
            >
              <Text
                style={[
                  styles.tabCountText,
                  activeTab === 'completed'
                    ? styles.tabCountTextActiveCompleted
                    : styles.tabCountTextInactive,
                ]}
              >
                {completedTasksCount}
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Categories Carousel */}
        <TaskCategoryCarousel
          tasks={tasks}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          onAddPress={openTaskModal}
        />

        {/* Tasks section */}
        <View
          style={[styles.taskSection, { paddingBottom: insets.bottom + 130 }]}
        >
          <View style={styles.taskSectionBgWrapper} pointerEvents="none">
            <TaskSectionBackgroundSvg />
          </View>

          {/* Section header crest badge */}
          <View style={styles.flowHeaderBadge}>
            <FlowBadgePatternSvg />
            <Text style={styles.flowTitle}>{sectionTitle}</Text>
            <Text style={styles.flowSubtitle}>{sectionSubtitle}</Text>
          </View>

          {/* Floating add button */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={openTaskModal}
            style={styles.addTaskFloatingBtn}
            accessibilityRole="button"
            accessibilityLabel="Add new task"
          >
            <Plus size={18} color="#FFFFFF" strokeWidth={2.6} />
          </TouchableOpacity>

          {/* Tasks List */}
          <FlatList
            data={filteredTasks}
            keyExtractor={item => item.id}
            scrollEnabled={false}
            style={styles.taskList}
            contentContainerStyle={styles.taskListContainer}
            renderItem={({ item }) => {
              return (
                <TaskCardItem
                  task={item}
                  isChecked={item.done}
                  onToggle={handleToggleTask}
                />
              );
            }}
            ItemSeparatorComponent={() => <View style={styles.listSeparator} />}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                {activeTab === 'completed' ? (
                  <CheckCircle2 size={38} color="#10B981" strokeWidth={1.6} />
                ) : (
                  <CheckSquare size={38} color="#D1D5DB" strokeWidth={1.5} />
                )}
                <Text style={styles.emptyTitle}>
                  {activeTab === 'completed'
                    ? 'No Completed Tasks Yet'
                    : 'No Tasks in This Category'}
                </Text>
                <Text style={styles.emptySubtitle}>
                  {activeTab === 'completed'
                    ? 'Completed tasks will appear here as you conquer your daily focus.'
                    : 'Tap below to add your next objective.'}
                </Text>
                {activeTab === 'taskList' && (
                  <TouchableOpacity
                    activeOpacity={0.85}
                    style={styles.addEmptyBtn}
                    onPress={openTaskModal}
                  >
                    <Plus size={14} color="#FFFFFF" strokeWidth={2.4} />
                    <Text style={styles.addEmptyBtnText}>Add Task</Text>
                  </TouchableOpacity>
                )}
              </View>
            }
          />

          {/* Complete / Restore All Task Button */}
          {filteredTasks.length > 0 && (
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => {
                const markDone = activeTab === 'taskList';
                const ids = filteredTasks.map(t => t.id);
                selectAllTasks(markDone, ids);
                Toast.show({
                  type: 'success',
                  text1: markDone
                    ? 'All Tasks Completed! 🎯'
                    : 'Tasks Restored to Active List',
                  text2: markDone
                    ? 'Great momentum on conquering your focus items!'
                    : 'Items are now back in your active task list.',
                });
              }}
              style={styles.selectAllBtn}
            >
              <Text style={styles.selectAllText}>
                {activeTab === 'taskList'
                  ? selectedCategory
                    ? `Complete All ${
                        selectedCategory.charAt(0).toUpperCase() +
                        selectedCategory.slice(1)
                      }`
                    : 'Complete All Tasks'
                  : 'Restore All to Active'}
              </Text>
            </TouchableOpacity>
          )}

          {/* Footer brand watermark */}
          <View style={styles.footerWatermarkWrapper} pointerEvents="none">
            <View style={styles.footerWatermarkRow}>
              {/* Left Column: Bold "Live it up!" Typography & Sign-off */}
              <View style={styles.liveItUpBlock}>
                <Text style={styles.liveItUpText}>{dailyQuote}</Text>
                <View style={styles.craftedWithRow}>
                  <Text style={styles.craftedWithText}>Crafted with </Text>
                  <Text style={styles.craftedWithHeart}>❤️</Text>
                  <Text style={styles.craftedWithText}>
                    {' '}
                    in Ahmedabad, India
                  </Text>
                </View>
              </View>

              {/* Right Column: Task Complete Doodle Illustration */}
              <View style={styles.footerDoodleWrapper}>
                <TaskCompleteDoodleSvg />
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
  scroll: {
    flex: 1,
  },
  scrollContent: {
    // padding applied dynamically with safe insets
  },
  bentoCardWrapper: {
    paddingTop: 5,
    paddingHorizontal: 10,
    marginBottom: 4,
  },

  // Signature Regius Tactile Segmented Tabs
  toggleContainer: {
    flexDirection: 'row',
    marginHorizontal: 10,
    marginTop: 10,
    marginBottom: 6,
    backgroundColor: '#181A20',
    borderRadius: 50,
    padding: 4.5,
    borderWidth: 1.5,
    borderTopColor: '#363A48',
    borderLeftColor: '#282B35',
    borderRightColor: '#282B35',
    borderBottomWidth: 3,
    borderBottomColor: '#0E1015',
    ...Platform.select({
      ios: {
        shadowColor: '#0B0D11',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.25,
        shadowRadius: 10,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  toggleTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    borderRadius: 50,
    gap: 7,
  },
  toggleTabActive: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.95)',
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.22,
        shadowRadius: 6,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  toggleText: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: 13,
    letterSpacing: -0.2,
  },
  toggleTextActive: {
    fontFamily: Fonts.poppins.bold,
    color: '#121417',
  },
  toggleTextInactive: {
    fontFamily: Fonts.poppins.semiBold,
    color: '#E5E7EB',
  },
  tabCountPill: {
    paddingHorizontal: 8,
    paddingVertical: 1.5,
    borderRadius: 12,
    minWidth: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabCountPillActiveTasks: {
    backgroundColor: '#FFF8D0',
    borderWidth: 1,
    borderColor: '#FFFFFF',
    borderBottomWidth: 2,
    borderBottomColor: '#DEAA14',
    ...Platform.select({
      ios: {
        shadowColor: '#D97706',
        shadowOffset: { width: 0, height: 1.5 },
        shadowOpacity: 0.25,
        shadowRadius: 2.5,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  tabCountPillActiveCompleted: {
    backgroundColor: '#E8FDF0',
    borderWidth: 1,
    borderColor: '#FFFFFF',
    borderBottomWidth: 2,
    borderBottomColor: '#82E8A6',
    ...Platform.select({
      ios: {
        shadowColor: '#52D22E',
        shadowOffset: { width: 0, height: 1.5 },
        shadowOpacity: 0.25,
        shadowRadius: 2.5,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  tabCountPillInactive: {
    backgroundColor: 'rgba(255, 255, 255, 0.14)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  tabCountText: {
    fontFamily: Fonts.poppins.bold,
    fontSize: 10.5,
  },
  tabCountTextActiveTasks: {
    color: '#B47804',
  },
  tabCountTextActiveCompleted: {
    color: '#1B9A72',
  },
  tabCountTextInactive: {
    color: '#FFFFFF',
  },

  // Tasks Section Container matching HabitsScreen
  taskSection: {
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
  taskSectionBgWrapper: {
    ...StyleSheet.absoluteFill,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    overflow: 'hidden',
  },

  // Section header crest badge
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

  // New Task floating button at right corner matching HabitsScreen addHabitFloatingBtn
  addTaskFloatingBtn: {
    position: 'absolute',
    top: -21,
    right: 18,
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: Colors.NeroBlack,
    borderWidth: 1.5,
    borderTopColor: '#4A4E5C',
    borderLeftColor: '#363944',
    borderRightColor: '#363944',
    borderBottomWidth: 3.5,
    borderBottomColor: '#090A0D',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0B0D11',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.32,
    shadowRadius: 6,
    elevation: 6,
    zIndex: 20,
  },

  // Task List
  taskList: {
    overflow: 'visible',
  },
  taskListContainer: {
    paddingHorizontal: 0,
    paddingTop: 10,
    paddingBottom: 20,
    overflow: 'visible',
  },
  listSeparator: {
    height: 12,
  },

  // Select All Tasks Button
  selectAllBtn: {
    backgroundColor: '#1F2228',
    borderRadius: 50,
    paddingVertical: ResponsivePixels.size14,
    paddingHorizontal: ResponsivePixels.size36,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: ResponsivePixels.size8,
    marginBottom: ResponsivePixels.size24,
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
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
    color: '#FFFFFF',
    fontSize: 13.5,
  },

  // Footer watermark styles
  footerWatermarkWrapper: {
    paddingLeft: ResponsivePixels.size10,
    paddingRight: ResponsivePixels.size16,
    marginTop: ResponsivePixels.size16,
    marginBottom: ResponsivePixels.size20,
  },
  footerWatermarkRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  liveItUpBlock: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  liveItUpText: {
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
    // flexWrap: 'wrap',
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

  // Empty State
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
    gap: 8,
  },
  emptyTitle: {
    ...Typography.bodyMediumPoppinsSemiBold,
    color: '#374151',
    fontSize: 15,
    marginTop: 6,
  },
  emptySubtitle: {
    ...Typography.bodySmallPoppinsRegular,
    color: '#9CA3AF',
    textAlign: 'center',
    paddingHorizontal: 20,
    lineHeight: 18,
  },
  addEmptyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#1F2228',
    paddingHorizontal: ResponsivePixels.size20,
    paddingVertical: ResponsivePixels.size10,
    borderRadius: 50,
    marginTop: 12,
  },
  addEmptyBtnText: {
    ...Typography.bodySmallPoppinsSemiBold,
    color: '#FFFFFF',
    fontSize: 12.5,
  },
});

export default TasksScreen;
