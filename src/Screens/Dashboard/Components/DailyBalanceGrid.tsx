import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { CheckCircle2, Flame, Bell } from 'lucide-react-native';
import Svg, { Circle } from 'react-native-svg';
import { Fonts } from '../../../Theme/fonts';

export interface DailyBalanceGridProps {
  tasksCompleted: number;
  tasksTotal: number;
  remindersCompleted?: number;
  remindersTotal?: number;
  habitsCompleted: number;
  habitsTotal: number;
  nudgesCount?: number;
  onPressTasks?: () => void;
  onPressReminders?: () => void;
  onPressHabits?: () => void;
  onPressNudges?: () => void;
}

import {
  CircularProgress,
  CircularProgressProps,
} from '../../../Common/CircularProgress';

export { CircularProgress };
export type { CircularProgressProps };

export const DailyBalanceGrid: React.FC<DailyBalanceGridProps> = ({
  tasksCompleted = 0,
  tasksTotal = 0,
  remindersCompleted,
  remindersTotal,
  habitsCompleted = 0,
  habitsTotal = 0,
  nudgesCount = 0,
  onPressTasks,
  onPressReminders,
  onPressHabits,
  onPressNudges,
}) => {
  // Safe percentage calculations handling zero totals
  const taskPercent =
    tasksTotal > 0 ? Math.round((tasksCompleted / tasksTotal) * 100) : 0;
  const habitPercent =
    habitsTotal > 0 ? Math.round((habitsCompleted / habitsTotal) * 100) : 0;

  // Reminders metrics
  const remDone = remindersCompleted !== undefined ? remindersCompleted : 0;
  const remTotal = remindersTotal !== undefined ? remindersTotal : nudgesCount;
  const reminderPercent =
    remTotal > 0 ? Math.round((remDone / remTotal) * 100) : 0;

  const handlePressReminders = onPressReminders || onPressNudges;

  return (
    <View style={styles.container}>
      {/* Section Header */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Daily Balance</Text>
      </View>

      {/* Bento 3-Column Grid: Standard Sequence (Tasks, Reminders, Habits) */}
      <View style={styles.gridRow}>
        {/* 1. Tasks Metric Card */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={onPressTasks}
          style={[styles.metricCard, styles.tasksCard]}
          accessibilityRole="button"
          accessibilityLabel={`Tasks: ${tasksCompleted} of ${tasksTotal} completed, ${taskPercent} percent`}
        >
          <View style={styles.cardTop}>
            <View style={[styles.iconCircle, styles.tasksIconCircle]}>
              <CheckCircle2 size={16} color="#B48216" strokeWidth={2.4} />
            </View>
            <CircularProgress
              percent={taskPercent}
              trackColor="#FFF5B8"
              progressColor="#B48216"
              textColor="#B48216"
              shadowColor="#F5C518"
            />
          </View>
          <View style={styles.cardBottom}>
            <Text style={styles.countText}>
              {tasksCompleted}
              <Text style={styles.countTotalText}>/{tasksTotal}</Text>
            </Text>
            <Text style={styles.label} numberOfLines={1}>
              Tasks
            </Text>
          </View>
          {/* Bottom Accent Pill */}
          <View style={[styles.accentPill, { backgroundColor: '#FDD835' }]} />
        </TouchableOpacity>

        {/* 2. Reminders Metric Card */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={handlePressReminders}
          style={[styles.metricCard, styles.remindersCard]}
          accessibilityRole="button"
          accessibilityLabel={`Reminders: ${remDone} of ${remTotal} completed, ${reminderPercent} percent`}
        >
          <View style={styles.cardTop}>
            <View style={[styles.iconCircle, styles.remindersIconCircle]}>
              <Bell size={16} color="#1B9A72" strokeWidth={2.4} />
            </View>
            <CircularProgress
              percent={reminderPercent}
              trackColor="#C6FFDD"
              progressColor="#1B9A72"
              textColor="#1B9A72"
              shadowColor="#52D22E"
            />
          </View>
          <View style={styles.cardBottom}>
            <Text style={styles.countText}>
              {remDone}
              <Text style={styles.countTotalText}>/{remTotal}</Text>
            </Text>
            <Text style={styles.label} numberOfLines={1}>
              Reminders
            </Text>
          </View>
          {/* Bottom Accent Pill */}
          <View style={[styles.accentPill, { backgroundColor: '#52D22E' }]} />
        </TouchableOpacity>

        {/* 3. Habits Metric Card */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={onPressHabits}
          style={[styles.metricCard, styles.habitsCard]}
          accessibilityRole="button"
          accessibilityLabel={`Habits: ${habitsCompleted} of ${habitsTotal} completed, ${habitPercent} percent`}
        >
          <View style={styles.cardTop}>
            <View style={[styles.iconCircle, styles.habitsIconCircle]}>
              <Flame size={16} color="#7059C8" strokeWidth={2.4} />
            </View>
            <CircularProgress
              percent={habitPercent}
              trackColor="#D8DBFF"
              progressColor="#7059C8"
              textColor="#7059C8"
              shadowColor="#8383D6"
            />
          </View>
          <View style={styles.cardBottom}>
            <Text style={styles.countText}>
              {habitsCompleted}
              <Text style={styles.countTotalText}>/{habitsTotal}</Text>
            </Text>
            <Text style={styles.label} numberOfLines={1}>
              Habits
            </Text>
          </View>
          {/* Bottom Accent Pill */}
          <View style={[styles.accentPill, { backgroundColor: '#8383D6' }]} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 18,
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
  // Base asymmetric card matching HomeScreen signature geometry
  metricCard: {
    flex: 1,
    minWidth: 0,
    borderRadius: 20,
    borderTopRightRadius: 38, // Signature asymmetric curve
    padding: 13,
    paddingBottom: 15,
    borderWidth: 1.5,
    justifyContent: 'space-between',
    minHeight: 110,
    position: 'relative',
    overflow: 'hidden',
  },
  // Tasks palette (Works/Yellow)
  tasksCard: {
    backgroundColor: '#FFFCEB',
    borderColor: '#FFF5B8',
    shadowColor: '#F5C518',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.22,
    shadowRadius: 8,
    elevation: 3,
  },
  // Habits palette (Regius Purple)
  habitsCard: {
    backgroundColor: '#EFF2FE',
    borderColor: '#D8DBFF',
    shadowColor: '#8383D6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.22,
    shadowRadius: 8,
    elevation: 3,
  },
  // Reminders palette (Sport/Wellness/Reminders Green)
  remindersCard: {
    backgroundColor: '#EDFDF5',
    borderColor: '#C6FFDD',
    shadowColor: '#52D22E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.22,
    shadowRadius: 8,
    elevation: 3,
  },
  nudgesCard: {
    backgroundColor: '#EDFDF5',
    borderColor: '#C6FFDD',
    shadowColor: '#52D22E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.22,
    shadowRadius: 8,
    elevation: 3,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  // Elevated circular white icon container matching HomeScreen
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  tasksIconCircle: {
    borderColor: '#FFF5B8',
    shadowColor: '#F5C518',
  },
  habitsIconCircle: {
    borderColor: '#D8DBFF',
    shadowColor: '#8383D6',
  },
  remindersIconCircle: {
    borderColor: '#C6FFDD',
    shadowColor: '#52D22E',
  },
  nudgesIconCircle: {
    borderColor: '#C6FFDD',
    shadowColor: '#52D22E',
  },
  progressContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    backgroundColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 2,
  },
  svgRotator: {
    transform: [{ rotate: '-90deg' }],
  },
  percentTextContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  percentIndicator: {
    minWidth: 32,
    height: 32,
    borderRadius: 16,
    paddingHorizontal: 4,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 2,
  },
  tasksPercentIndicator: {
    borderColor: '#FFF5B8',
    shadowColor: '#F5C518',
  },
  remindersPercentIndicator: {
    borderColor: '#C6FFDD',
    shadowColor: '#52D22E',
  },
  habitsPercentIndicator: {
    borderColor: '#D8DBFF',
    shadowColor: '#8383D6',
  },
  percentIndicatorText: {
    fontFamily: Fonts.poppins.bold,
    fontSize: 10.5,
    letterSpacing: -0.3,
  },
  cardBottom: {
    gap: 1,
  },
  countText: {
    fontFamily: Fonts.poppins.bold,
    fontSize: 21,
    color: '#1B1C19',
    letterSpacing: -0.4,
  },
  countTotalText: {
    fontFamily: Fonts.poppins.medium,
    fontSize: 13,
    color: '#8E8D92',
  },
  label: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: 13,
    color: '#1B1C19',
    letterSpacing: -0.1,
    marginTop: 2,
  },
  // Bottom accent pill matching HomeScreen category card indicator
  accentPill: {
    position: 'absolute',
    bottom: 0,
    alignSelf: 'center',
    height: 3.5,
    width: 36,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },
});

export default DailyBalanceGrid;
