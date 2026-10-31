import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CheckSquare, Flame, Calendar } from 'lucide-react-native';

import { Fonts } from '../../../Theme/fonts';
import { Colors } from '../../../Assets/StyleUtilities/Colors';
import { Typography } from '../../../Theme/Typographys';
import ResponsivePixels from '../../../Assets/StyleUtilities/ResponsivePixels';

export interface ProfileStatsMatrixProps {
  completedTasksCount: number;
  activeHabitsStreak: number;
  memberSince?: string;
  isDarkMode: boolean;
}

export const ProfileStatsMatrix: React.FC<ProfileStatsMatrixProps> = React.memo(
  ({
    completedTasksCount,
    activeHabitsStreak,
    memberSince = '2026',
    isDarkMode,
  }) => {
    const cardBg = isDarkMode ? '#1E2228' : Colors.DefaultWhite;
    const textPrimary = isDarkMode
      ? Colors.PureWhiteText
      : Colors.MidnightInkText;
    const textSecondary = isDarkMode ? '#A3A8B1' : Colors.SubtitleGray;
    const borderLight = isDarkMode ? '#2C3035' : '#E8E2D5';

    return (
      <View
        style={[
          styles.statsGridCard,
          {
            backgroundColor: cardBg,
            borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.12)' : '#FFFFFF',
            borderBottomColor: isDarkMode ? '#171A20' : '#E2DCD0',
            shadowColor: isDarkMode ? '#000000' : 'rgba(131, 131, 214, 0.14)',
          },
        ]}
      >
        <View style={styles.statCol}>
          <View
            style={[
              styles.statIconWrap,
              { backgroundColor: isDarkMode ? '#2A2416' : '#FFFCEB' },
            ]}
          >
            <CheckSquare size={16} color="#B48216" strokeWidth={2.4} />
          </View>
          <Text style={[styles.statValue, { color: textPrimary }]}>
            {completedTasksCount}
          </Text>
          <Text style={[styles.statLabel, { color: textSecondary }]}>
            Completed Tasks
          </Text>
        </View>

        <View style={[styles.statDivider, { backgroundColor: borderLight }]} />

        <View style={styles.statCol}>
          <View
            style={[
              styles.statIconWrap,
              { backgroundColor: isDarkMode ? '#202336' : '#EFF2FE' },
            ]}
          >
            <Flame size={16} color={Colors.LavenderPurple} strokeWidth={2.4} />
          </View>
          <Text style={[styles.statValue, { color: textPrimary }]}>
            {activeHabitsStreak}d
          </Text>
          <Text style={[styles.statLabel, { color: textSecondary }]}>
            Focus Streak
          </Text>
        </View>

        <View style={[styles.statDivider, { backgroundColor: borderLight }]} />

        <View style={styles.statCol}>
          <View
            style={[
              styles.statIconWrap,
              { backgroundColor: isDarkMode ? '#162820' : '#EDFDF5' },
            ]}
          >
            <Calendar size={16} color="#1B9A72" strokeWidth={2.4} />
          </View>
          <Text style={[styles.statValue, { color: textPrimary }]}>
            {memberSince}
          </Text>
          <Text style={[styles.statLabel, { color: textSecondary }]}>
            Member Since
          </Text>
        </View>
      </View>
    );
  },
);

const styles = StyleSheet.create({
  statsGridCard: {
    flexDirection: 'row',
    marginHorizontal: ResponsivePixels.size16,
    borderRadius: 20,
    borderWidth: 1.5,
    borderBottomWidth: 3.5,
    paddingVertical: ResponsivePixels.size16,
    paddingHorizontal: ResponsivePixels.size12,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 2,
    marginBottom: ResponsivePixels.size24,
  },
  statCol: {
    flex: 1,
    alignItems: 'center',
  },
  statIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  statValue: {
    fontFamily: Fonts.ranade.bold,
    fontSize: 18,
    marginBottom: 2,
  },
  statLabel: {
    ...Typography.bodySuperSmallPoppinsRegularLoose,
    fontSize: 11,
  },
  statDivider: {
    width: 1,
    height: '75%',
    alignSelf: 'center',
  },
});

export default ProfileStatsMatrix;
