import React, { useState } from 'react';
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
  Flame,
  Check,
  Plus,
  Sparkles,
  Sun,
  Moon,
  Compass,
  Trophy,
  SlidersHorizontal,
} from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';

import { Fonts } from '../../Theme/fonts';
import { Typography } from '../../Theme/Typographys';
import { Colors } from '../../Assets/StyleUtilities/Colors';
import { SVGS } from '../../Assets/Images';
import { useTaskReminder } from '../../Context/TaskReminderContext';

export const HabitsScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { habits, toggleHabit, openHabitModal } = useTaskReminder();
  const [filter, setFilter] = useState<
    'all' | 'morning' | 'mindful' | 'evening'
  >('all');

  const completedCount = habits.filter(h => h.completed).length;
  const progressPercent =
    habits.length > 0
      ? Math.round((completedCount / habits.length) * 100)
      : 0;

  const handleToggleHabit = (id: string) => {
    toggleHabit(id);
    const item = habits.find(h => h.id === id);
    if (item) {
      const nextState = !item.completed;
      Toast.show({
        type: 'success',
        text1: nextState ? 'Habit Checked In! 🔥' : 'Habit Reset',
        text2: nextState
          ? `Keep the momentum going! Streak: ${item.streak + 1} days`
          : 'Unchecked for today.',
      });
    }
  };

  const filteredHabits = habits.filter(h => {
    if (filter === 'all') return true;
    return h.category === filter;
  });

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar
        barStyle="dark-content"
        {...(Platform.OS === 'android'
          ? { backgroundColor: '#FBF9F3', translucent: true }
          : {})}
      />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.brandTitle}>Regius Habits</Text>
          <Text style={styles.brandSubtitle}>Daily Rituals & Consistency</Text>
        </View>

        <View style={styles.headerRight}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.navigate('Settings')}
            style={styles.avatarButton}
            accessibilityLabel="Open Settings"
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
        {/* Streak & Consistency Bento Card */}
        <View style={styles.streakCard}>
          <View style={styles.streakTopRow}>
            <View style={styles.streakBadge}>
              <Flame size={16} color="#E65100" />
              <Text style={styles.streakBadgeText}>Active Streak</Text>
            </View>
            <View style={styles.trophyPill}>
              <Trophy size={14} color="#B45309" />
              <Text style={styles.trophyPillText}>Top 5% Consistency</Text>
            </View>
          </View>

          <View style={styles.metricRow}>
            <View>
              <Text style={styles.metricBig}>18 Days</Text>
              <Text style={styles.metricLabel}>Longest Current Chain</Text>
            </View>
            <View style={styles.progressCircleWrap}>
              <Text style={styles.progressPercentText}>{progressPercent}%</Text>
              <Text style={styles.progressSubtext}>
                {completedCount}/{habits.length} Done
              </Text>
            </View>
          </View>

          {/* Progress Bar */}
          <View style={styles.progressBarTrack}>
            <View
              style={[styles.progressBarFill, { width: `${progressPercent}%` }]}
            />
          </View>
        </View>

        {/* Filter Pills */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersScroll}
        >
          {[
            { key: 'all', label: 'All Habits', icon: Compass },
            { key: 'morning', label: 'Morning Rituals', icon: Sun },
            { key: 'mindful', label: 'Mindful Breaks', icon: Sparkles },
            { key: 'evening', label: 'Evening Recovery', icon: Moon },
          ].map(f => {
            const isActive = filter === f.key;
            const IconComponent = f.icon;
            return (
              <TouchableOpacity
                key={f.key}
                activeOpacity={0.8}
                onPress={() => setFilter(f.key as any)}
                style={[styles.filterChip, isActive && styles.filterChipActive]}
              >
                <IconComponent
                  size={14}
                  color={isActive ? '#FFFFFF' : '#49454F'}
                />
                <Text
                  style={[
                    styles.filterChipText,
                    isActive && styles.filterChipTextActive,
                  ]}
                >
                  {f.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Habits List */}
        <View style={styles.habitsSection}>
          <View style={styles.sectionTitleRow}>
            <Text style={styles.sectionTitle}>Today's Rituals</Text>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={openHabitModal}
              style={styles.addHabitQuickBtn}
            >
              <Plus size={15} color="#4A7C59" />
              <Text style={styles.addHabitQuickText}>New Habit</Text>
            </TouchableOpacity>
          </View>

          {filteredHabits.map(habit => {
            return (
              <TouchableOpacity
                key={habit.id}
                activeOpacity={0.88}
                onPress={() => handleToggleHabit(habit.id)}
                style={[
                  styles.habitCard,
                  habit.completed && styles.habitCardCompleted,
                ]}
              >
                <View style={styles.habitMainRow}>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => handleToggleHabit(habit.id)}
                    style={[
                      styles.checkCircle,
                      habit.completed && styles.checkCircleActive,
                    ]}
                  >
                    {habit.completed && (
                      <Check size={16} color="#FFFFFF" strokeWidth={3} />
                    )}
                  </TouchableOpacity>

                  <View style={styles.habitContent}>
                    <Text
                      style={[
                        styles.habitTitle,
                        habit.completed && styles.habitTitleCompleted,
                      ]}
                      numberOfLines={1}
                    >
                      {habit.title}
                    </Text>
                    <View style={styles.habitMetaRow}>
                      <Text style={styles.habitTime}>{habit.timeOfDay}</Text>
                      <Text style={styles.metaDot}>•</Text>
                      <Text style={styles.habitFreq}>{habit.frequency}</Text>
                    </View>
                  </View>

                  <View style={styles.habitStreakBadge}>
                    <Flame
                      size={14}
                      color={habit.completed ? '#E65100' : '#8E8E93'}
                    />
                    <Text
                      style={[
                        styles.habitStreakText,
                        habit.completed && styles.habitStreakTextActive,
                      ]}
                    >
                      {habit.streak}d
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 22,
    paddingTop: 12,
    paddingBottom: 14,
  },
  headerLeft: {
    gap: 2,
  },
  brandTitle: {
    ...Typography.h1RanadeBold,
    fontSize: 26,
    color: '#1B1C19',
    letterSpacing: -0.5,
  },
  brandSubtitle: {
    ...Typography.bodySmallPoppinsRegular,
    fontSize: 12,
    color: '#767772',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarButton: {
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: '#E8E2D5',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 120,
    gap: 20,
  },
  streakCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1.5,
    borderColor: '#EBE5D8',
    ...Platform.select({
      ios: {
        shadowColor: '#1B1C19',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.06,
        shadowRadius: 14,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  streakTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFF3E0',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
  },
  streakBadgeText: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: 12,
    color: '#E65100',
  },
  trophyPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
  },
  trophyPillText: {
    fontFamily: Fonts.poppins.medium,
    fontSize: 11,
    color: '#92400E',
  },
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  metricBig: {
    ...Typography.h1RanadeBold,
    fontSize: 32,
    color: '#1B1C19',
  },
  metricLabel: {
    fontFamily: Fonts.poppins.regular,
    fontSize: 12,
    color: '#767772',
    marginTop: 2,
  },
  progressCircleWrap: {
    alignItems: 'flex-end',
  },
  progressPercentText: {
    fontFamily: Fonts.poppins.bold,
    fontSize: 24,
    color: '#2D5A37',
  },
  progressSubtext: {
    fontFamily: Fonts.poppins.medium,
    fontSize: 11,
    color: '#767772',
  },
  progressBarTrack: {
    height: 8,
    borderRadius: 4,
    backgroundColor: '#F0EFE9',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
    backgroundColor: '#2D5A37',
  },
  filtersScroll: {
    gap: 10,
    paddingVertical: 4,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.2,
    borderColor: '#E8E2D5',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  filterChipActive: {
    backgroundColor: Colors.LavenderPurple,
    borderColor: Colors.LavenderPurple,
  },
  filterChipText: {
    fontFamily: Fonts.poppins.medium,
    fontSize: 12,
    color: '#49454F',
  },
  filterChipTextActive: {
    color: '#FFFFFF',
  },
  habitsSection: {
    gap: 12,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
    marginBottom: 4,
  },
  sectionTitle: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: 17,
    color: '#1B1C19',
  },
  addHabitQuickBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 14,
  },
  addHabitQuickText: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: 11,
    color: '#2E7D32',
  },
  habitCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#EFEAE0',
    ...Platform.select({
      ios: {
        shadowColor: '#1B1C19',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.04,
        shadowRadius: 10,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  habitCardCompleted: {
    backgroundColor: '#FAF9F6',
    borderColor: '#E0E7DE',
    opacity: 0.88,
  },
  habitMainRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  checkCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#C7C6CA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkCircleActive: {
    backgroundColor: '#2D5A37',
    borderColor: '#2D5A37',
  },
  habitContent: {
    flex: 1,
    gap: 3,
  },
  habitTitle: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: 14,
    color: '#1B1C19',
    lineHeight: 19,
  },
  habitTitleCompleted: {
    textDecorationLine: 'line-through',
    color: '#767772',
  },
  habitMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  habitTime: {
    fontFamily: Fonts.poppins.regular,
    fontSize: 11,
    color: '#767772',
  },
  metaDot: {
    fontSize: 10,
    color: '#C7C6CA',
  },
  habitFreq: {
    fontFamily: Fonts.poppins.medium,
    fontSize: 11,
    color: '#4A7C59',
  },
  habitStreakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F7F6F1',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 12,
  },
  habitStreakText: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: 11,
    color: '#8E8E93',
  },
  habitStreakTextActive: {
    color: '#E65100',
  },
});

export default HabitsScreen;
