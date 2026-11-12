import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CheckSquare, Flame, Calendar } from 'lucide-react-native';

import { Fonts } from '../../../Theme/fonts';
import { Colors, withAlpha } from '../../../Assets/StyleUtilities/Colors';
import { Typography } from '../../../Theme/Typographys';
import ResponsivePixels from '../../../Assets/StyleUtilities/ResponsivePixels';
import { useTheme } from '../../../Theme/ThemeContext';

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
    const { Colors: themeColors } = useTheme();
    const cardBg =
      themeColors.CardBackground ||
      (isDarkMode ? Colors.DarkCardBackground : Colors.PureWhite);
    const textPrimary =
      themeColors.PrimaryText ||
      (isDarkMode ? Colors.PureWhite : Colors.PureBlack);
    const textSecondary =
      themeColors.SecondaryText ||
      (isDarkMode ? Colors.SteelMist : Colors.SubtitleGray);
    const borderLight =
      themeColors.BorderLight ||
      (isDarkMode ? Colors.CarbonSlate : Colors.RingBorder);

    return (
      <View
        style={[
          styles.statsGridCard,
          {
            backgroundColor: cardBg,
            borderColor: isDarkMode
              ? withAlpha(Colors.PureWhite, 0.12)
              : Colors.PureWhite,
            borderBottomColor: isDarkMode
              ? Colors.DarkSurfaceDeep
              : Colors.WarmStoneBorder,
            shadowColor: isDarkMode
              ? Colors.PureBlack
              : withAlpha(Colors.LavenderPurple, 0.14),
          },
        ]}
      >
        <View style={styles.statCol}>
          <View
            style={[
              styles.statIconWrap,
              {
                backgroundColor: isDarkMode
                  ? Colors.WorkDarkBg
                  : Colors.WorkLightBg,
              },
            ]}
          >
            <CheckSquare
              size={ResponsivePixels.size16}
              color={Colors.WorkTextAccent}
              strokeWidth={2.4}
            />
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
              {
                backgroundColor: isDarkMode
                  ? Colors.MindfulDarkBg
                  : Colors.MindfulLightBg,
              },
            ]}
          >
            <Flame size={ResponsivePixels.size16} color={Colors.LavenderPurple} strokeWidth={2.4} />
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
              {
                backgroundColor: isDarkMode
                  ? Colors.WellnessDarkBg
                  : Colors.WellnessLightBg,
              },
            ]}
          >
            <Calendar
              size={ResponsivePixels.size16}
              color={Colors.GreenGracious}
              strokeWidth={2.4}
            />
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
    borderRadius: ResponsivePixels.size20,
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
    width: ResponsivePixels.size34,
    height: ResponsivePixels.size34,
    borderRadius: ResponsivePixels.size17,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: ResponsivePixels.size6,
  },
  statValue: {
    fontFamily: Fonts.ranade.bold,
    fontSize: ResponsivePixels.size18,
    marginBottom: ResponsivePixels.size2,
  },
  statLabel: {
    ...Typography.bodySuperSmallPoppinsRegularLoose,
    fontSize: ResponsivePixels.size11,
  },
  statDivider: {
    width: 1,
    height: '75%',
    alignSelf: 'center',
  },
});

export default ProfileStatsMatrix;
