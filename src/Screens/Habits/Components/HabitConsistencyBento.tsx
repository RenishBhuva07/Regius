import React, { useMemo, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  Animated,
  Easing,
} from 'react-native';
import { Flame, Trophy, Check } from 'lucide-react-native';
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
import { Colors } from '../../../Assets/StyleUtilities/Colors';
import { Badge } from '../../../Common/Badge';
import { HabitItem } from '../../../Context/TaskReminderContext';

interface HabitConsistencyBentoProps {
  habits: HabitItem[];
}

const WEEKDAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

/**
 * Ambient luxury dark background matching DailyBriefingCard:
 * - Radial fiery amber & lavender auras
 * - Deep dark slate-black canvas
 */
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
        <LinearGradient id="bentoBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor="#252733" stopOpacity={0.7} />
          <Stop offset="50%" stopColor="#1C1E26" stopOpacity={0.3} />
          <Stop offset="100%" stopColor="#141519" stopOpacity={0.8} />
        </LinearGradient>

        {/* Fiery Amber Glow (Bottom-Left behind fire icon) */}
        <RadialGradient id="flameGlow" cx="20%" cy="45%" rx="55%" ry="55%">
          <Stop offset="0%" stopColor="#FF9800" stopOpacity={0.28} />
          <Stop offset="40%" stopColor="#E65100" stopOpacity={0.12} />
          <Stop offset="100%" stopColor="#141519" stopOpacity={0} />
        </RadialGradient>

        {/* Top-Right Lavender / Purple Aura */}
        <RadialGradient id="lavenderAura" cx="85%" cy="15%" rx="65%" ry="65%">
          <Stop offset="0%" stopColor="#9C9CE3" stopOpacity={0.35} />
          <Stop offset="45%" stopColor="#8383D6" stopOpacity={0.15} />
          <Stop offset="100%" stopColor="#141519" stopOpacity={0} />
        </RadialGradient>

        {/* Mint Glow on bottom right */}
        <RadialGradient id="mintGlow" cx="75%" cy="85%" rx="45%" ry="45%">
          <Stop offset="0%" stopColor="#52D22E" stopOpacity={0.14} />
          <Stop offset="60%" stopColor="#1B9A72" stopOpacity={0.03} />
          <Stop offset="100%" stopColor="#141519" stopOpacity={0} />
        </RadialGradient>
      </Defs>

      <Rect width="100%" height="100%" fill="url(#bentoBg)" />
      <Rect width="100%" height="100%" fill="url(#flameGlow)" />
      <Rect width="100%" height="100%" fill="url(#lavenderAura)" />
      <Rect width="100%" height="100%" fill="url(#mintGlow)" />

      {/* Top-right subtle ambient ring */}
      <Circle
        cx={310}
        cy={30}
        r={40}
        stroke="rgba(216, 219, 255, 0.14)"
        strokeWidth={1}
        fill="none"
      />
      <Circle
        cx={310}
        cy={30}
        r={70}
        stroke="rgba(216, 219, 255, 0.06)"
        strokeWidth={1}
        strokeDasharray="4 6"
        fill="none"
      />
    </Svg>
  </View>
));

export const HabitConsistencyBento: React.FC<HabitConsistencyBentoProps> = ({
  habits,
}) => {
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

  const flameScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(flameScale, {
          toValue: 1.15,
          duration: 900,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(flameScale, {
          toValue: 1,
          duration: 900,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );
    pulse.start();
    return () => pulse.stop();
  }, [flameScale]);

  return (
    <View style={styles.cardShadowWrapper}>
      <View style={styles.card}>
        {/* Luxury Dark Ambient Background matching DailyBriefingCard */}
        <BentoBackgroundSvg />

        <View style={styles.content}>
          {/* Top Badge Row */}
          <View style={styles.topRow}>
            <Badge
              label="ACTIVE STREAK"
              variant="yellow"
              size="sm"
              icon={<Flame size={13} color="#E65100" />}
            />
            <Badge
              label="TOP 5% CONSISTENCY"
              variant="purple"
              size="sm"
              icon={<Trophy size={12} color={Colors.LavenderPurple} />}
            />
          </View>

          {/* Hero Metric Row: Big Fire Icon + 20 Days Streak + Percent */}
          <View style={styles.metricRow}>
            <View style={styles.heroStreakLeft}>
              <Animated.View
                style={[
                  styles.flameWrap,
                  { transform: [{ scale: flameScale }] },
                ]}
              >
                <Flame
                  size={60}
                  color="#FF9800"
                  strokeWidth={2.2}
                  fill="#FF9800"
                />
              </Animated.View>

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

          {/* 7-Day Consistency Week Strip */}
          <View style={styles.weekStrip}>
            <Text style={styles.weekStripLabel}>WEEKLY MOMENTUM</Text>
            <View style={styles.weekDaysRow}>
              {WEEKDAYS.map((dayLabel, index) => {
                const isToday = index === currentDayIndex;
                const isPast = index < currentDayIndex;
                const isCompletedToday = isToday && progressPercent >= 50;
                const isFilled = isPast || isCompletedToday;

                return (
                  <View key={`day-${index}`} style={styles.dayCol}>
                    <View
                      style={[
                        styles.dayBubble,
                        isToday && styles.dayBubbleToday,
                        isFilled && styles.dayBubbleFilled,
                      ]}
                    >
                      {isFilled ? (
                        <Check
                          size={12}
                          color={isToday ? '#FFFFFF' : '#52D22E'}
                          strokeWidth={3}
                        />
                      ) : (
                        <View
                          style={[
                            styles.emptyDot,
                            isToday && styles.emptyDotToday,
                          ]}
                        />
                      )}
                    </View>
                    <Text
                      style={[styles.dayText, isToday && styles.dayTextToday]}
                    >
                      {dayLabel}
                    </Text>
                  </View>
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
    borderRadius: 24,
    backgroundColor: Colors.NeroBlack,
    ...Platform.select({
      ios: {
        shadowColor: Colors.DefaultBlack,
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
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 4,
    borderColor: 'rgba(255, 255, 255, 0.9)',
    position: 'relative',
    backgroundColor: Colors.NeroBlack,
  },
  content: {
    padding: 20,
    gap: 8,
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
    gap: 14,
    flex: 1,
  },
  flameWrap: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  streakTextWrap: {
    flex: 1,
    justifyContent: 'center',
  },
  metricBig: {
    ...Typography.h1RanadeBold,
    fontSize: 32,
    lineHeight: 40,
    paddingTop: 4,
    color: Colors.DefaultWhite,
    letterSpacing: -0.5,
    includeFontPadding: false,
  },
  metricLabel: {
    fontFamily: Fonts.poppins.regular,
    fontSize: 12,
    color: '#A3A8B1',
    marginTop: 1,
  },
  metricRight: {
    alignItems: 'flex-end',
    gap: 4,
  },
  percentBadge: {
    backgroundColor: 'rgba(82, 210, 46, 0.18)',
    borderWidth: 1,
    borderColor: 'rgba(82, 210, 46, 0.45)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 14,
  },
  percentText: {
    fontFamily: Fonts.poppins.bold,
    fontSize: 18,
    color: '#52D22E',
  },
  progressSubtext: {
    fontFamily: Fonts.poppins.medium,
    fontSize: 11,
    color: '#A3A8B1',
  },
  progressBarTrack: {
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
    backgroundColor: '#52D22E',
  },
  weekStrip: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
    paddingTop: 12,
    gap: 10,
  },
  weekStripLabel: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: 10,
    color: '#8A8E99',
    letterSpacing: 0.8,
  },
  weekDaysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dayCol: {
    alignItems: 'center',
    gap: 6,
  },
  dayBubble: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  dayBubbleToday: {
    borderColor: Colors.LavenderPurple,
    backgroundColor: 'rgba(131, 131, 214, 0.28)',
  },
  dayBubbleFilled: {
    backgroundColor: 'rgba(82, 210, 46, 0.16)',
    borderColor: 'rgba(82, 210, 46, 0.4)',
  },
  emptyDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  emptyDotToday: {
    backgroundColor: Colors.LavenderPurple,
  },
  dayText: {
    fontFamily: Fonts.poppins.medium,
    fontSize: 11,
    color: '#8A8E99',
  },
  dayTextToday: {
    fontFamily: Fonts.poppins.bold,
    color: Colors.DefaultWhite,
  },
});

export default HabitConsistencyBento;
