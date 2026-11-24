import React, { useMemo, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  Animated,
  Easing,
} from 'react-native';
import { Flame, Trophy } from 'lucide-react-native';
import Svg, {
  Rect,
  Circle,
  Defs,
  LinearGradient,
  RadialGradient,
  Stop,
} from 'react-native-svg';
import { Fonts } from '../../../Theme/fonts';
import { Typography } from '../../../Theme/Typographys';
import { Colors, withAlpha } from '../../../Assets/StyleUtilities/Colors';
import { useAppTheme } from '../../../Theme/useAppTheme';
import { Badge } from '../../../Common/Badge';
import { HabitItem } from '../../../Context/TaskReminderContext';
import ResponsivePixels from '../../../Assets/StyleUtilities/ResponsivePixels';

interface HabitConsistencyBentoProps {
  habits: HabitItem[];
}

const WEEKDAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

// Ambient tactile dark background for Habit Consistency: calm, grounded surface.
const BentoBackgroundSvg: React.FC = React.memo(() => (
  <View style={StyleSheet.absoluteFill} pointerEvents="none">
    <Svg
      width="100%"
      height="100%"
      viewBox="0 0 360 220"
      preserveAspectRatio="xMidYMid slice"
      fill="none"
    >
      <Defs>
        <LinearGradient id="bentoBg" x1="0%" y1="0%" x2="0%" y2="100%">
          <Stop offset="0%" stopColor="#22252C" stopOpacity={0.9} />
          <Stop offset="50%" stopColor="#1C1D22" stopOpacity={0.95} />
          <Stop offset="100%" stopColor="#141519" stopOpacity={1} />
        </LinearGradient>
      </Defs>

      <Rect width="100%" height="100%" fill="url(#bentoBg)" />

      {/* Top-right subtle ambient ring */}
      <Circle
        cx={310}
        cy={30}
        r={40}
        stroke={withAlpha(Colors.PureWhite, 0.05)}
        strokeWidth={1}
        fill="none"
      />
    </Svg>
  </View>
));

export const HabitConsistencyBento: React.FC<HabitConsistencyBentoProps> = ({
  habits,
}) => {
  const { isDarkMode } = useAppTheme();
  const completedCount = habits.filter(h => h.completed).length;
  const totalCount = habits.length;
  const progressPercent =
    totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const longestStreak = useMemo(() => {
    if (habits.length === 0) return 0;
    return Math.max(...habits.map(h => h.streak), 0);
  }, [habits]);

  const currentDayIndex = useMemo(() => {
    const day = new Date().getDay();
    return day === 0 ? 6 : day - 1;
  }, []);

  return (
    <View style={styles.cardShadowWrapper}>
      <View
        style={[
          styles.card,
          isDarkMode && { borderColor: withAlpha(Colors.PureWhite, 0.22) },
        ]}
      >
        {/* Calm tactile dark background */}
        <BentoBackgroundSvg />

        <View style={styles.content}>
          {/* Top Badge Row */}
          <View style={styles.topRow}>
            <Badge
              label="Active Streak"
              variant="orange"
              size="sm"
              icon={
                <Flame
                  size={ResponsivePixels.size12}
                  color={Colors.EventTextAccent}
                  strokeWidth={2.4}
                />
              }
            />
            <Badge
              label="Consistency"
              variant="purple"
              size="sm"
              icon={
                <Trophy
                  size={ResponsivePixels.size12}
                  color={Colors.LavenderPurple}
                />
              }
            />
          </View>

          {/* Hero Metric Row: Big Fire Icon + 20 Days Streak + Percent */}
          <View style={styles.metricRow}>
            <View style={styles.heroStreakLeft}>
              <View style={styles.flameWrap}>
                <Flame
                  size={ResponsivePixels.size60}
                  color={Colors.AccentAmber}
                  strokeWidth={2.2}
                  fill={Colors.AccentAmber}
                />
              </View>

              <View style={styles.streakTextWrap}>
                <Text style={styles.metricBig}>{longestStreak} Days</Text>
                <Text style={styles.metricLabel}>Longest Ritual Momentum</Text>
              </View>
            </View>

            <View style={styles.metricRight}>
              <View style={styles.percentBadge}>
                <Text style={styles.percentText}>{progressPercent}%</Text>
              </View>
              <Text style={styles.progressSubtext}>
                {completedCount}/{totalCount} Completed
              </Text>
            </View>
          </View>

          {/* Progress Bar Track on Dark Surface */}
          <View style={styles.progressBarTrack}>
            <View
              style={[
                styles.progressBarFill,
                { width: `${Math.max(progressPercent, 4)}%` },
              ]}
            />
          </View>

          {/* 7-Day Consistency Week Strip with Illuminated Streak Flow */}
          <View style={styles.weekStrip}>
            <View style={styles.weekStripHeader}>
              <Flame
                size={ResponsivePixels.size12}
                color={Colors.AccentAmber}
                fill={Colors.AccentAmber}
                strokeWidth={2}
              />
              <Text style={styles.weekStripLabel}>Weekly Momentum</Text>
            </View>

            <View style={styles.weekDaysRow}>
              {WEEKDAYS.map((dayLabel, index) => {
                const isToday = index === currentDayIndex;
                const isPast = index < currentDayIndex;
                const isCompletedToday = isToday && progressPercent >= 50;
                const isFilled = isPast || isCompletedToday;

                // Flow connector segment to next day
                const nextIsToday = index + 1 === currentDayIndex;
                const nextIsPast = index + 1 < currentDayIndex;
                const nextIsCompletedToday =
                  nextIsToday && progressPercent >= 50;
                const nextIsFilled = nextIsPast || nextIsCompletedToday;
                const isConnectorFilled = isFilled && nextIsFilled;

                return (
                  <React.Fragment key={`day-flow-${index}`}>
                    <View
                      style={styles.dayCol}
                      accessible
                      accessibilityLabel={`${dayLabel}, ${
                        isToday ? 'Today, ' : ''
                      }${isFilled ? 'completed' : 'pending'} streak day`}
                    >
                      <View
                        style={[
                          styles.dayBubble,
                          isFilled && styles.dayBubbleFilled,
                          isToday && styles.dayBubbleToday,
                        ]}
                      >
                        <Flame
                          size={ResponsivePixels.size15}
                          color={
                            isFilled
                              ? Colors.StreakFlameOrangeTop
                              : isToday
                              ? Colors.StreakFlameOrangeTop
                              : withAlpha(Colors.PureWhite, 0.28)
                          }
                          fill={isFilled ? Colors.AccentAmber : 'none'}
                          strokeWidth={isToday && !isFilled ? 2 : 1.7}
                        />
                      </View>
                      <Text
                        style={[
                          styles.dayText,
                          isFilled && styles.dayTextFilled,
                          isToday && styles.dayTextToday,
                        ]}
                      >
                        {dayLabel}
                      </Text>
                    </View>

                    {index < 6 && (
                      <View
                        style={[
                          styles.flowConnector,
                          isConnectorFilled && styles.flowConnectorFilled,
                        ]}
                      />
                    )}
                  </React.Fragment>
                );
              })}
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardShadowWrapper: {
    borderRadius: ResponsivePixels.size24,
    backgroundColor: Colors.NeroBlack,
    ...Platform.select({
      ios: {
        shadowColor: Colors.PureBlack,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.28,
        shadowRadius: 18,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  card: {
    borderRadius: ResponsivePixels.size24,
    overflow: 'hidden',
    borderWidth: 4,
    borderColor: withAlpha(Colors.PureWhite, 0.9),
    position: 'relative',
    backgroundColor: Colors.NeroBlack,
  },
  content: {
    padding: ResponsivePixels.size20,
    gap: ResponsivePixels.size8,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  heroStreakLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ResponsivePixels.size14,
    flex: 1,
  },
  flameWrap: {
    width: ResponsivePixels.size52,
    height: ResponsivePixels.size52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  streakTextWrap: {
    flex: 1,
    justifyContent: 'center',
  },
  metricBig: {
    ...Typography.h1RanadeBold,
    fontSize: ResponsivePixels.size38,
    lineHeight: ResponsivePixels.size47,
    paddingTop: ResponsivePixels.size4,
    color: Colors.PureWhite,
    letterSpacing: -0.5,
    includeFontPadding: false,
    fontVariant: ['tabular-nums'],
  },
  metricLabel: {
    fontFamily: Fonts.poppins.regular,
    fontSize: ResponsivePixels.size14,
    color: Colors.SteelMist,
    marginTop: ResponsivePixels.size1,
  },
  metricRight: {
    alignItems: 'flex-end',
    gap: ResponsivePixels.size4,
  },
  percentBadge: {
    backgroundColor: withAlpha(Colors.AccentGreen, 0.18),
    borderWidth: 1,
    borderColor: withAlpha(Colors.AccentGreen, 0.45),
    paddingHorizontal: ResponsivePixels.size12,
    paddingVertical: ResponsivePixels.size4,
    borderRadius: ResponsivePixels.size14,
  },
  percentText: {
    fontFamily: Fonts.poppins.bold,
    fontSize: ResponsivePixels.size21,
    color: Colors.AccentGreen,
    fontVariant: ['tabular-nums'],
  },
  progressSubtext: {
    fontFamily: Fonts.poppins.medium,
    fontSize: ResponsivePixels.size13,
    color: Colors.SteelMist,
    fontVariant: ['tabular-nums'],
  },
  progressBarTrack: {
    height: ResponsivePixels.size8,
    borderRadius: ResponsivePixels.size4,
    backgroundColor: withAlpha(Colors.PureWhite, 0.1),
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: ResponsivePixels.size4,
    backgroundColor: Colors.AccentGreen,
  },
  weekStrip: {
    borderTopWidth: 1,
    borderTopColor: withAlpha(Colors.PureWhite, 0.08),
    paddingTop: ResponsivePixels.size12,
    gap: ResponsivePixels.size10,
  },
  weekStripHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ResponsivePixels.size5,
  },
  weekStripLabel: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: ResponsivePixels.size12,
    color: Colors.ConsistencyLabelGray,
    letterSpacing: -0.1,
  },
  weekDaysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  dayCol: {
    alignItems: 'center',
    gap: ResponsivePixels.size6,
    zIndex: 2,
  },
  dayBubble: {
    width: ResponsivePixels.size34,
    height: ResponsivePixels.size34,
    borderRadius: ResponsivePixels.size17,
    backgroundColor: withAlpha(Colors.PureWhite, 0.04),
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: withAlpha(Colors.PureWhite, 0.09),
  },
  dayBubbleFilled: {
    backgroundColor: withAlpha(Colors.AccentAmber, 0.14),
    borderColor: withAlpha(Colors.AccentAmber, 0.45),
    ...Platform.select({
      ios: {
        shadowColor: Colors.AccentAmber,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.32,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  dayBubbleToday: {
    borderColor: Colors.StreakFlameOrangeTop,
    borderWidth: 1.6,
    backgroundColor: withAlpha(Colors.AccentAmber, 0.18),
    ...Platform.select({
      ios: {
        shadowColor: Colors.StreakFlameOrangeTop,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.4,
        shadowRadius: 5,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  flowConnector: {
    flex: 1,
    height: ResponsivePixels.size2,
    backgroundColor: withAlpha(Colors.PureWhite, 0.08),
    marginTop: ResponsivePixels.size14,
    borderRadius: ResponsivePixels.size1,
    zIndex: 1,
  },
  flowConnectorFilled: {
    backgroundColor: Colors.AccentAmber,
    height: ResponsivePixels.size2,
    ...Platform.select({
      ios: {
        shadowColor: Colors.AccentAmber,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.5,
        shadowRadius: 3,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  dayText: {
    fontFamily: Fonts.poppins.medium,
    fontSize: ResponsivePixels.size13,
    color: Colors.ConsistencyLabelGray,
  },
  dayTextFilled: {
    fontFamily: Fonts.poppins.semiBold,
    color: Colors.EventLightBorder,
  },
  dayTextToday: {
    fontFamily: Fonts.poppins.bold,
    color: Colors.PureWhite,
  },
});

export default HabitConsistencyBento;
