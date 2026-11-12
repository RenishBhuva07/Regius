import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { CheckCircle2, Flame, Bell } from 'lucide-react-native';
import { Fonts } from '../../../Theme/fonts';
import { Colors, withAlpha } from '../../../Assets/StyleUtilities/Colors';
import { useAppTheme } from '../../../Theme/useAppTheme';

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
import ResponsivePixels from '../../../Assets/StyleUtilities/ResponsivePixels';

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
  const { isDarkMode, textPrimary, canvasTextPrimary } = useAppTheme();
  const cardTextColor = isDarkMode ? Colors.PureWhite : textPrimary;

  return (
    <View style={styles.container}>
      {/* Section Header */}
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: canvasTextPrimary }]}>
          Daily Balance
        </Text>
      </View>

      {/* Bento 3-Column Grid: Standard Sequence (Tasks, Reminders, Habits) */}
      <View style={styles.gridRow}>
        {/* 1. Tasks Metric Card */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={onPressTasks}
          style={[
            styles.metricCard,
            styles.tasksCard,
            isDarkMode && {
              backgroundColor: Colors.WorkDarkBg,
              borderColor: Colors.WorkDarkBorder,
            },
          ]}
          accessibilityRole="button"
          accessibilityLabel={`Tasks: ${tasksCompleted} of ${tasksTotal} completed, ${taskPercent} percent`}
        >
          <View style={styles.cardTop}>
            <View
              style={[
                styles.iconCircle,
                styles.tasksIconCircle,
                isDarkMode && {
                  backgroundColor: Colors.WorkDarkIconBg,
                  borderColor: Colors.WorkDarkBorder,
                },
              ]}
            >
              <CheckCircle2
                size={ResponsivePixels.size16}
                color={isDarkMode ? Colors.AccentYellow : Colors.WorkTextAccent}
                strokeWidth={2.4}
              />
            </View>
            <CircularProgress
              percent={taskPercent}
              trackColor={
                isDarkMode
                  ? withAlpha(Colors.AccentYellow, 0.2)
                  : Colors.WorkLightBorder
              }
              progressColor={
                isDarkMode ? Colors.AccentYellow : Colors.WorkTextAccent
              }
              textColor={
                isDarkMode ? Colors.AccentYellow : Colors.WorkTextAccent
              }
              shadowColor={Colors.AccentYellow}
            />
          </View>
          <View style={styles.cardBottom}>
            <Text style={[styles.countText, { color: cardTextColor }]}>
              {tasksCompleted}
              <Text style={styles.countTotalText}>/{tasksTotal}</Text>
            </Text>
            <Text
              style={[styles.label, { color: cardTextColor }]}
              numberOfLines={1}
            >
              Tasks
            </Text>
          </View>
          {/* Bottom Accent Pill */}
          <View
            style={[
              styles.accentPill,
              { backgroundColor: Colors.TaskGoldVivid },
            ]}
          />
        </TouchableOpacity>

        {/* 2. Reminders Metric Card */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={handlePressReminders}
          style={[
            styles.metricCard,
            styles.remindersCard,
            isDarkMode && {
              backgroundColor: Colors.WellnessDarkBg,
              borderColor: Colors.GreenGracious,
            },
          ]}
          accessibilityRole="button"
          accessibilityLabel={`Reminders: ${remDone} of ${remTotal} completed, ${reminderPercent} percent`}
        >
          <View style={styles.cardTop}>
            <View
              style={[
                styles.iconCircle,
                styles.remindersIconCircle,
                isDarkMode && {
                  backgroundColor: Colors.WellnessDarkIconBg,
                  borderColor: Colors.GreenGracious,
                },
              ]}
            >
              <Bell
                size={ResponsivePixels.size16}
                color={isDarkMode ? Colors.AccentGreen : Colors.GreenGracious}
                strokeWidth={2.4}
              />
            </View>
            <CircularProgress
              percent={reminderPercent}
              trackColor={
                isDarkMode
                  ? withAlpha(Colors.AccentGreen, 0.2)
                  : Colors.WellnessLightBorder
              }
              progressColor={
                isDarkMode ? Colors.AccentGreen : Colors.GreenGracious
              }
              textColor={isDarkMode ? Colors.AccentGreen : Colors.GreenGracious}
              shadowColor={Colors.AccentGreen}
            />
          </View>
          <View style={styles.cardBottom}>
            <Text style={[styles.countText, { color: cardTextColor }]}>
              {remDone}
              <Text style={styles.countTotalText}>/{remTotal}</Text>
            </Text>
            <Text
              style={[styles.label, { color: cardTextColor }]}
              numberOfLines={1}
            >
              Reminders
            </Text>
          </View>
          {/* Bottom Accent Pill */}
          <View
            style={[
              styles.accentPill,
              { backgroundColor: Colors.AccentGreen },
            ]}
          />
        </TouchableOpacity>

        {/* 3. Habits Metric Card */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={onPressHabits}
          style={[
            styles.metricCard,
            styles.habitsCard,
            isDarkMode && {
              backgroundColor: Colors.MindfulDarkBg,
              borderColor: Colors.LavenderPurple,
            },
          ]}
          accessibilityRole="button"
          accessibilityLabel={`Habits: ${habitsCompleted} of ${habitsTotal} completed, ${habitPercent} percent`}
        >
          <View style={styles.cardTop}>
            <View
              style={[
                styles.iconCircle,
                styles.habitsIconCircle,
                isDarkMode && {
                  backgroundColor: Colors.MindfulDarkIconBg,
                  borderColor: Colors.LavenderPurple,
                },
              ]}
            >
              <Flame
                size={ResponsivePixels.size16}
                color={
                  isDarkMode ? Colors.LavenderPurple : Colors.MindfulTextAccent
                }
                strokeWidth={2.4}
              />
            </View>
            <CircularProgress
              percent={habitPercent}
              trackColor={
                isDarkMode
                  ? withAlpha(Colors.LavenderPurple, 0.2)
                  : Colors.MindfulLightBorder
              }
              progressColor={
                isDarkMode ? Colors.LavenderPurple : Colors.MindfulTextAccent
              }
              textColor={
                isDarkMode ? Colors.LavenderPurple : Colors.MindfulTextAccent
              }
              shadowColor={Colors.LavenderPurple}
            />
          </View>
          <View style={styles.cardBottom}>
            <Text style={[styles.countText, { color: cardTextColor }]}>
              {habitsCompleted}
              <Text style={styles.countTotalText}>/{habitsTotal}</Text>
            </Text>
            <Text
              style={[styles.label, { color: cardTextColor }]}
              numberOfLines={1}
            >
              Habits
            </Text>
          </View>
          {/* Bottom Accent Pill */}
          <View
            style={[
              styles.accentPill,
              { backgroundColor: Colors.LavenderPurple },
            ]}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: ResponsivePixels.size18,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: ResponsivePixels.size12,
  },
  sectionTitle: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: ResponsivePixels.size18,
    color: Colors.RegiusInk,
    letterSpacing: -0.2,
  },
  sectionPace: {
    fontFamily: Fonts.poppins.medium,
    fontSize: ResponsivePixels.size12,
    color: Colors.Grey,
  },
  gridRow: {
    flexDirection: 'row',
    gap: ResponsivePixels.size10,
  },
  // Base asymmetric card matching HomeScreen signature geometry
  metricCard: {
    flex: 1,
    minWidth: 0,
    borderRadius: ResponsivePixels.size20,
    borderTopRightRadius: ResponsivePixels.size38, // Signature asymmetric curve
    padding: ResponsivePixels.size13,
    paddingBottom: ResponsivePixels.size15,
    borderWidth: 1.5,
    justifyContent: 'space-between',
    minHeight: ResponsivePixels.size110,
    position: 'relative',
    overflow: 'hidden',
  },
  // Tasks palette (Works/Yellow)
  tasksCard: {
    backgroundColor: Colors.WorkLightBg,
    borderColor: Colors.WorkLightBorder,
    shadowColor: Colors.AccentYellow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.22,
    shadowRadius: 8,
    elevation: 3,
  },
  // Habits palette (Regius Purple)
  habitsCard: {
    backgroundColor: Colors.MindfulLightBg,
    borderColor: Colors.MindfulLightBorder,
    shadowColor: Colors.LavenderPurple,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.22,
    shadowRadius: 8,
    elevation: 3,
  },
  // Reminders palette (Sport/Wellness/Reminders Green)
  remindersCard: {
    backgroundColor: Colors.WellnessLightBg,
    borderColor: Colors.WellnessLightBorder,
    shadowColor: Colors.AccentGreen,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.22,
    shadowRadius: 8,
    elevation: 3,
  },
  nudgesCard: {
    backgroundColor: Colors.WellnessLightBg,
    borderColor: Colors.WellnessLightBorder,
    shadowColor: Colors.AccentGreen,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.22,
    shadowRadius: 8,
    elevation: 3,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: ResponsivePixels.size10,
  },
  // Elevated circular white icon container matching HomeScreen
  iconCircle: {
    width: ResponsivePixels.size32,
    height: ResponsivePixels.size32,
    borderRadius: ResponsivePixels.size16,
    backgroundColor: Colors.PureWhite,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  tasksIconCircle: {
    borderColor: Colors.WorkLightBorder,
    shadowColor: Colors.AccentYellow,
  },
  habitsIconCircle: {
    borderColor: Colors.MindfulLightBorder,
    shadowColor: Colors.LavenderPurple,
  },
  remindersIconCircle: {
    borderColor: Colors.WellnessLightBorder,
    shadowColor: Colors.AccentGreen,
  },
  nudgesIconCircle: {
    borderColor: Colors.WellnessLightBorder,
    shadowColor: Colors.AccentGreen,
  },
  progressContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    backgroundColor: Colors.PureWhite,
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
    minWidth: ResponsivePixels.size32,
    height: ResponsivePixels.size32,
    borderRadius: ResponsivePixels.size16,
    paddingHorizontal: ResponsivePixels.size4,
    backgroundColor: Colors.PureWhite,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 2,
  },
  tasksPercentIndicator: {
    borderColor: Colors.WorkLightBorder,
    shadowColor: Colors.AccentYellow,
  },
  remindersPercentIndicator: {
    borderColor: Colors.WellnessLightBorder,
    shadowColor: Colors.AccentGreen,
  },
  habitsPercentIndicator: {
    borderColor: Colors.MindfulLightBorder,
    shadowColor: Colors.LavenderPurple,
  },
  percentIndicatorText: {
    fontFamily: Fonts.poppins.bold,
    fontSize: ResponsivePixels.size10_5,
    letterSpacing: -0.3,
  },
  cardBottom: {
    gap: ResponsivePixels.size1,
  },
  countText: {
    fontFamily: Fonts.poppins.bold,
    fontSize: ResponsivePixels.size21,
    color: Colors.RegiusInk,
    letterSpacing: -0.4,
  },
  countTotalText: {
    fontFamily: Fonts.poppins.medium,
    fontSize: ResponsivePixels.size13,
    color: Colors.TimelineMutedGray,
  },
  label: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: ResponsivePixels.size13,
    color: Colors.RegiusInk,
    letterSpacing: -0.1,
    marginTop: ResponsivePixels.size2,
  },
  // Bottom accent pill matching HomeScreen category card indicator
  accentPill: {
    position: 'absolute',
    bottom: 0,
    alignSelf: 'center',
    height: ResponsivePixels.size3_5,
    width: ResponsivePixels.size36,
    borderTopLeftRadius: ResponsivePixels.size3,
    borderTopRightRadius: ResponsivePixels.size3,
  },
});

export default DailyBalanceGrid;
