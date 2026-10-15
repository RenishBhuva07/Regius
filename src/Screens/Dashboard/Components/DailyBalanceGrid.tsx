import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { CheckCircle2, Flame, Mic } from 'lucide-react-native';
import { Fonts } from '../../../Theme/fonts';

interface DailyBalanceGridProps {
  tasksCompleted: number;
  tasksTotal: number;
  habitsCompleted: number;
  habitsTotal: number;
  nudgesCount: number;
  onPressTasks?: () => void;
  onPressHabits?: () => void;
  onPressNudges?: () => void;
}

export const DailyBalanceGrid: React.FC<DailyBalanceGridProps> = ({
  tasksCompleted = 1,
  tasksTotal = 4,
  habitsCompleted = 2,
  habitsTotal = 4,
  nudgesCount = 2,
  onPressTasks,
  onPressHabits,
  onPressNudges,
}) => {
  const taskPercent =
    tasksTotal > 0 ? Math.round((tasksCompleted / tasksTotal) * 100) : 0;
  const habitPercent =
    habitsTotal > 0 ? Math.round((habitsCompleted / habitsTotal) * 100) : 0;

  return (
    <View style={styles.container}>
      {/* Section Header */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Daily Balance</Text>
        <Text style={styles.sectionPace}>Optimal Pace</Text>
      </View>

      {/* Bento 3-Column Grid */}
      <View style={styles.gridRow}>
        {/* Tasks Metric Card */}
        <TouchableOpacity
          activeOpacity={0.88}
          onPress={onPressTasks}
          style={styles.metricCard}
        >
          <View style={styles.cardTop}>
            <View style={[styles.iconCircle, { backgroundColor: '#CCE6D0' }]}>
              <CheckCircle2 size={16} color="#354C3B" strokeWidth={2.4} />
            </View>
            <Text style={[styles.percentBadge, { color: '#354C3B' }]}>
              {taskPercent}%
            </Text>
          </View>
          <View style={styles.cardBottom}>
            <Text style={styles.countText}>
              {tasksCompleted}
              <Text style={styles.countTotalText}>/{tasksTotal}</Text>
            </Text>
            <Text style={styles.label}>Tasks</Text>
          </View>
        </TouchableOpacity>

        {/* Habits Metric Card */}
        <TouchableOpacity
          activeOpacity={0.88}
          onPress={onPressHabits}
          style={styles.metricCard}
        >
          <View style={styles.cardTop}>
            <View style={[styles.iconCircle, { backgroundColor: '#EDE3B8' }]}>
              <Flame size={16} color="#665F3D" strokeWidth={2.4} />
            </View>
            <Text style={[styles.percentBadge, { color: '#665F3D' }]}>
              {habitPercent}%
            </Text>
          </View>
          <View style={styles.cardBottom}>
            <Text style={styles.countText}>
              {habitsCompleted}
              <Text style={styles.countTotalText}>/{habitsTotal}</Text>
            </Text>
            <Text style={styles.label}>Habits</Text>
          </View>
        </TouchableOpacity>

        {/* Voice Nudges Metric Card */}
        <TouchableOpacity
          activeOpacity={0.88}
          onPress={onPressNudges}
          style={styles.metricCard}
        >
          <View style={styles.cardTop}>
            <View style={[styles.iconCircle, { backgroundColor: '#F0EEE8' }]}>
              <Mic size={16} color="#1B1C19" strokeWidth={2.4} />
            </View>
            <Text style={[styles.percentBadge, { color: '#77767B' }]}>
              Active
            </Text>
          </View>
          <View style={styles.cardBottom}>
            <Text style={styles.countText}>{nudgesCount}</Text>
            <Text style={styles.label}>Nudges</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitle: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: 18,
    color: '#1B1C19',
    letterSpacing: -0.2,
  },
  sectionPace: {
    fontFamily: Fonts.poppins.medium,
    fontSize: 12,
    color: '#77767B',
  },
  gridRow: {
    flexDirection: 'row',
    gap: 10,
  },
  metricCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 14,
    minHeight: 102,
    justifyContent: 'space-between',
    shadowColor: '#1C1C1E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 16,
    elevation: 3,
    borderWidth: 1,
    borderColor: 'rgba(234, 232, 226, 0.6)',
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  percentBadge: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: 11,
  },
  cardBottom: {
    marginTop: 8,
  },
  countText: {
    fontFamily: Fonts.poppins.bold,
    fontSize: 18,
    color: '#1B1C19',
    lineHeight: 22,
  },
  countTotalText: {
    fontFamily: Fonts.poppins.regular,
    fontSize: 12,
    color: '#77767B',
  },
  label: {
    fontFamily: Fonts.poppins.medium,
    fontSize: 11.5,
    color: '#77767B',
    marginTop: 2,
  },
});

export default DailyBalanceGrid;
