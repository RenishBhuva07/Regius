import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  FlatList,
  StatusBar,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Mail, Users, Filter, Check } from 'lucide-react-native';
import Svg, { Path } from 'react-native-svg';
import { Typography } from '../../Theme/Typographys';
import { Colors } from '../../Assets/StyleUtilities/Colors';
import { SVGS } from '../../Assets/Images';
import ResponsivePixels from '../../Assets/StyleUtilities/ResponsivePixels';
import { useTaskReminder } from '../../Context/TaskReminderContext';

// Inline SVGs

const OfficeBagIcon: React.FC<{ width?: number; height?: number }> = ({
  width = 24,
  height = 24,
}) => (
  <Svg width={width} height={height} viewBox="23 19 24 24" fill="none">
    <Path
      opacity={0.4}
      d="M25.0002 30.0785C25.0502 32.4165 25.1902 36.4155 25.2102 36.8565C25.2812 37.7995 25.6422 38.7525 26.2042 39.4245C26.9862 40.3675 27.9492 40.7885 29.2922 40.7885C31.1482 40.7985 33.1942 40.7985 35.1812 40.7985C37.1762 40.7985 39.1122 40.7985 40.7472 40.7885C42.0712 40.7885 43.0642 40.3565 43.8362 39.4245C44.3982 38.7525 44.7592 37.7895 44.8102 36.8565C44.8302 36.4855 44.9302 32.1445 44.9902 30.0785H25.0002Z"
      fill="#FFE600"
    />
    <Path
      d="M34.2454 34.3842V35.6782C34.2454 36.0922 34.5814 36.4282 34.9954 36.4282C35.4094 36.4282 35.7454 36.0922 35.7454 35.6782V34.3842C35.7454 33.9702 35.4094 33.6342 34.9954 33.6342C35.4094 33.6342 34.2454 33.9702 34.2454 34.3842Z"
      fill="#FFE600"
    />
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M33.2113 33.5564C33.1113 33.9194 32.7623 34.1514 32.3843 34.1014C29.8333 33.7454 27.3953 32.8404 25.3373 31.4814C25.1263 31.3434 25.0003 31.1074 25.0003 30.8554V27.3894C25.0003 25.2894 26.7123 23.5814 28.8173 23.5814H30.7843C30.9723 22.1294 32.2023 21.0004 33.7043 21.0004H36.2863C37.7873 21.0004 39.0183 22.1294 39.2063 23.5814H41.1833C43.2823 23.5814 44.9903 25.2894 44.9903 27.3894V30.8554C44.9903 31.1074 44.8633 31.3424 44.6543 31.4814C42.5923 32.8464 40.1443 33.7554 37.5763 34.1104C37.5413 34.1154 37.5073 34.1174 37.4733 34.1174C37.1343 34.1174 36.8313 33.8884 36.7463 33.5524C36.5443 32.7564 35.8213 32.1994 34.9903 32.1994C34.1483 32.1994 33.4333 32.7444 33.2113 33.5564ZM36.2863 22.5004H33.7043C33.0313 22.5004 32.4693 22.9604 32.3013 23.5814H37.6883C37.5203 22.9604 36.9583 22.5004 36.2863 22.5004Z"
      fill="#FFE600"
    />
  </Svg>
);

// Types

type TabKey = 'taskList' | 'completed';

interface Category {
  id: string;
  label: string;
  taskCount: string;
  bgColor: string;
  borderColor: string;
  shadowColor: string;
  Icon: React.ComponentType<any>;
  accentColor?: string;
}

// Data

const CATEGORIES: Category[] = [
  {
    id: 'works',
    label: 'Works',
    taskCount: '+03 task',
    bgColor: '#FFFCEB',
    borderColor: '#FFF5B8',
    shadowColor: '#F5C518',
    Icon: OfficeBagIcon,
    accentColor: '#FDD835',
  },
  {
    id: 'sport',
    label: 'Sport',
    taskCount: '+10 task',
    bgColor: '#EDFDF5',
    borderColor: '#C6FFDD',
    shadowColor: '#52D22E',
    Icon: SVGS.FloatHeart,
    accentColor: '#52D22E',
  },
  {
    id: 'habits',
    label: 'Habits',
    taskCount: '+4 task',
    bgColor: '#EFF2FE',
    borderColor: '#D8DBFF',
    shadowColor: '#8383D6',
    Icon: SVGS.FloatPicture,
    accentColor: '#8383D6',
  },
];

// Component

const HomeScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabKey>('taskList');
  const [selectedCategory, setSelectedCategory] = useState<string>('works');
  const { tasks, toggleTask, selectedTasks, selectAllTasks, openTaskModal } =
    useTaskReminder();

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar
        barStyle="dark-content"
        {...(Platform.OS === 'android'
          ? { backgroundColor: '#FFFFFF', translucent: true }
          : {})}
      />

      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ── Header ── */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <TouchableOpacity activeOpacity={0.7} style={styles.menuIcon}>
              <View style={styles.menuLine} />
              <View style={styles.menuLine} />
              <View style={styles.menuLine} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Home</Text>
          </View>
          <View style={styles.avatarRing}>
            <SVGS.RegiusAvatar width={36} height={36} />
          </View>
        </View>

        {/* ── Toggle Tabs ── */}
        <View style={styles.toggleContainer}>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => setActiveTab('taskList')}
            style={[
              styles.toggleTab,
              activeTab === 'taskList' && styles.toggleTabActive,
            ]}
          >
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
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => setActiveTab('completed')}
            style={[
              styles.toggleTab,
              activeTab === 'completed' && styles.toggleTabActive,
            ]}
          >
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
          </TouchableOpacity>
        </View>

        {/* ── Categories ── */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <View style={styles.sectionActions}>
            <TouchableOpacity activeOpacity={0.7} style={styles.filterBtn}>
              <Filter size={16} color="#1F2228" strokeWidth={2.2} />
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.85} style={styles.addBtn}>
              <Text style={styles.addBtnText}>Add</Text>
            </TouchableOpacity>
          </View>
        </View>

        <FlatList
          horizontal
          data={CATEGORIES}
          keyExtractor={item => item.id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesRow}
          style={styles.categoriesScroll}
          renderItem={({ item: cat }) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <TouchableOpacity
                key={cat.id}
                activeOpacity={0.85}
                onPress={() => setSelectedCategory(cat.id)}
                style={[
                  styles.categoryCard,
                  { backgroundColor: cat.bgColor },
                  isSelected && [
                    styles.categoryCardSelected,
                    { shadowColor: cat.shadowColor },
                  ],
                ]}
              >
                <View
                  style={[
                    styles.categoryIconWrap,
                    {
                      borderColor: cat.borderColor,
                      shadowColor: cat.shadowColor,
                    },
                  ]}
                >
                  <cat.Icon width={24} height={24} />
                </View>
                <Text style={styles.categoryLabel}>{cat.label}</Text>
                <Text style={styles.categoryCount}>{cat.taskCount}</Text>
                {isSelected && cat.accentColor ? (
                  <View style={styles.categoryAccentWrap}>
                    <View
                      style={[
                        styles.categoryAccent,
                        { backgroundColor: cat.accentColor },
                      ]}
                    />
                  </View>
                ) : null}
              </TouchableOpacity>
            );
          }}
        />

        {/* ── Task List (same as Figma with #FAFAFA background) ── */}
        <View style={styles.taskSection}>
          <View style={styles.taskSectionHeader}>
            <Text style={styles.taskSectionTitle}>Task List</Text>
            <TouchableOpacity
              activeOpacity={0.85}
              style={styles.addTaskBtn}
              onPress={openTaskModal}
            >
              <Text style={styles.addTaskBtnText}>Add Task</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.taskListCards}>
            {tasks.map(task => {
              const isChecked = task.done;
              return (
                <TouchableOpacity
                  key={task.id}
                  activeOpacity={0.85}
                  style={styles.taskCard}
                  onPress={() => toggleTask(task.id)}
                >
                  <View style={styles.taskCardLeft}>
                    <View style={styles.taskIconContainer}>
                      {task.iconType === 'mail' ? (
                        <Mail size={19} color="#454A53" strokeWidth={2.2} />
                      ) : (
                        <Users size={19} color="#454A53" strokeWidth={2.2} />
                      )}
                    </View>
                    <Text style={styles.taskLabel}>{task.label}</Text>
                  </View>

                  <View
                    style={[
                      styles.taskCheckbox,
                      isChecked
                        ? styles.taskCheckboxChecked
                        : styles.taskCheckboxUnchecked,
                    ]}
                  >
                    {isChecked ? (
                      <Check size={14} color="#52D22E" strokeWidth={3} />
                    ) : null}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* ── Select All Task ── */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => selectAllTasks()}
            style={styles.selectAllBtn}
          >
            <Text style={styles.selectAllText}>Select All Task</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// Styles

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 120,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: ResponsivePixels.size20,
    paddingTop: ResponsivePixels.size16,
    paddingBottom: ResponsivePixels.size8,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ResponsivePixels.size14,
  },
  menuIcon: {
    gap: 4.5,
    justifyContent: 'center',
    paddingVertical: 4,
  },
  menuLine: {
    width: 18,
    height: 2.2,
    backgroundColor: '#1F2228',
    borderRadius: 2,
  },
  headerTitle: {
    ...Typography.h1RanadeBold,
    color: '#000000',
    fontSize: 26,
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

  // Toggle
  toggleContainer: {
    flexDirection: 'row',
    marginHorizontal: ResponsivePixels.size20,
    marginTop: ResponsivePixels.size16,
    backgroundColor: '#1F2228',
    borderRadius: 50,
    padding: 4,
  },
  toggleTab: {
    flex: 1,
    paddingVertical: ResponsivePixels.size10,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleTabActive: {
    backgroundColor: '#FFFFFF',
  },
  toggleText: {
    ...Typography.bodyMediumPoppinsSemiBold,
    fontSize: 14,
  },
  toggleTextActive: {
    color: '#1F2228',
  },
  toggleTextInactive: {
    color: '#FFFFFF',
  },

  // Section Header
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: ResponsivePixels.size20,
    marginTop: ResponsivePixels.size24,
    marginBottom: ResponsivePixels.size14,
  },
  sectionTitle: {
    ...Typography.h6Bold,
    color: '#000000',
    fontSize: 18,
  },
  sectionActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ResponsivePixels.size10,
  },
  filterBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#F5F6F8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBtn: {
    backgroundColor: '#1F2228',
    paddingHorizontal: ResponsivePixels.size16,
    paddingVertical: ResponsivePixels.size8,
    borderRadius: 50,
  },
  addBtnText: {
    ...Typography.bodySmallPoppinsSemiBold,
    color: '#FFFFFF',
    fontSize: 12,
  },

  // Categories
  categoriesScroll: {
    overflow: 'visible',
    marginBottom: ResponsivePixels.size4,
  },
  categoriesRow: {
    paddingHorizontal: ResponsivePixels.size20,
    paddingTop: ResponsivePixels.size10,
    paddingBottom: ResponsivePixels.size30,
    gap: ResponsivePixels.size14,
  },
  categoryCard: {
    width: 124,
    borderRadius: 23,
    borderTopRightRadius: 63,
    padding: ResponsivePixels.size16,
    paddingBottom: ResponsivePixels.size18,
    gap: ResponsivePixels.size6,
    position: 'relative',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  categoryCardSelected: {
    borderColor: '#FFFFFF',
    ...Platform.select({
      ios: {
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.38,
        shadowRadius: 14,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  categoryIconWrap: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: ResponsivePixels.size8,
    ...Platform.select({
      ios: {
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.22,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  categoryLabel: {
    ...Typography.bodyMediumPoppinsSemiBold,
    color: '#000000',
    fontSize: 15,
  },
  categoryCount: {
    ...Typography.bodySmallPoppinsRegular,
    color: Colors.SubtitleGray,
    fontSize: 12,
  },
  categoryAccentWrap: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  categoryAccent: {
    height: 4,
    width: 48,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },

  // Task Section (#FAFAFA background)
  taskSection: {
    backgroundColor: '#FAFAFA',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: ResponsivePixels.size20,
    paddingTop: ResponsivePixels.size24,
    paddingBottom: ResponsivePixels.size32,
    flex: 1,
  },
  taskSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: ResponsivePixels.size18,
  },
  taskSectionTitle: {
    ...Typography.h6Bold,
    color: '#000000',
    fontSize: 18,
  },
  addTaskBtn: {
    backgroundColor: '#1F2228',
    paddingHorizontal: ResponsivePixels.size16,
    paddingVertical: ResponsivePixels.size8,
    borderRadius: 50,
  },
  addTaskBtnText: {
    ...Typography.bodySmallPoppinsSemiBold,
    color: '#FFFFFF',
    fontSize: 12,
  },

  // Task Cards
  taskListCards: {
    gap: ResponsivePixels.size12,
  },
  taskCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingHorizontal: ResponsivePixels.size16,
    paddingVertical: ResponsivePixels.size16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 8,
      },
      android: {
        elevation: 1.5,
      },
    }),
  },
  taskCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ResponsivePixels.size14,
    flex: 1,
  },
  taskIconContainer: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  taskLabel: {
    ...Typography.bodyMediumPoppinsMedium,
    color: '#000000',
    fontSize: 15,
  },

  // Checkboxes
  taskCheckbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  taskCheckboxChecked: {
    backgroundColor: '#E8FDF0',
  },
  taskCheckboxUnchecked: {
    backgroundColor: '#EFF1F4',
  },

  // Select All Task
  selectAllBtn: {
    backgroundColor: '#1F2228',
    borderRadius: 50,
    paddingVertical: ResponsivePixels.size14,
    paddingHorizontal: ResponsivePixels.size36,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: ResponsivePixels.size24,
  },
  selectAllText: {
    ...Typography.bodyMediumPoppinsSemiBold,
    color: '#FFFFFF',
    fontSize: 14,
  },
});

export default HomeScreen;
