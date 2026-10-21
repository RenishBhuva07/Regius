import React, { useMemo, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  Animated,
  Easing,
} from 'react-native';
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
import { Badge } from '../../../Common/Badge';
import { Task } from '../../../Context/TaskReminderContext';

interface TaskProductivityBentoProps {
  tasks: Task[];
  onAddTask?: () => void;
}

/**
 * Compact luxury focus bar matching Regius design language:
 * - Slim ~74px profile leaving ample vertical room for categories and tasks
 * - Solar gold focus auras and specular dark obsidian canvas
 */
const FocusBarBackgroundSvg: React.FC = React.memo(() => (
  <View style={StyleSheet.absoluteFill} pointerEvents="none">
    <Svg
      width="100%"
      height="100%"
      viewBox="0 0 360 84"
      preserveAspectRatio="none"
      fill="none"
    >
      <Defs>
        <LinearGradient id="focusBarBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor="#252733" stopOpacity={0.8} />
          <Stop offset="50%" stopColor="#1C1E26" stopOpacity={0.5} />
          <Stop offset="100%" stopColor="#141519" stopOpacity={0.9} />
        </LinearGradient>

        <RadialGradient id="focusGoldAura" cx="12%" cy="50%" rx="50%" ry="90%">
          <Stop offset="0%" stopColor="#F5C518" stopOpacity={0.28} />
          <Stop offset="55%" stopColor="#DEAA14" stopOpacity={0.06} />
          <Stop offset="100%" stopColor="#141519" stopOpacity={0} />
        </RadialGradient>

        <RadialGradient
          id="focusLavenderGlow"
          cx="88%"
          cy="30%"
          rx="45%"
          ry="80%"
        >
          <Stop offset="0%" stopColor="#9C9CE3" stopOpacity={0.2} />
          <Stop offset="60%" stopColor="#8383D6" stopOpacity={0.04} />
          <Stop offset="100%" stopColor="#141519" stopOpacity={0} />
        </RadialGradient>
      </Defs>

      <Rect width="100%" height="100%" fill="url(#focusBarBg)" />
      <Rect width="100%" height="100%" fill="url(#focusGoldAura)" />
      <Rect width="100%" height="100%" fill="url(#focusLavenderGlow)" />

      {/* Ambient right accent ring */}
      <Circle
        cx={330}
        cy={20}
        r={32}
        stroke="rgba(255, 245, 184, 0.12)"
        strokeWidth={1}
        fill="none"
      />
    </Svg>
  </View>
));

export const TaskProductivityBento: React.FC<TaskProductivityBentoProps> = ({
  tasks,
}) => {
  const completedCount = useMemo(
    () => tasks.filter(t => t.done).length,
    [tasks],
  );
  const totalCount = tasks.length;
  const pendingCount = totalCount - completedCount;

  const progressPercent =
    totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const pulseScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseScale, {
          toValue: 1.15,
          duration: 900,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseScale, {
          toValue: 1,
          duration: 900,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );
    pulse.start();
    return () => pulse.stop();
  }, [pulseScale]);

  const motivationStatus = useMemo(() => {
    if (totalCount === 0) return 'Add your first task to start';
    if (progressPercent === 100) return 'All daily tasks conquered! 🎯';
    return `${pendingCount} of ${totalCount} remaining today`;
  }, [totalCount, pendingCount, progressPercent]);

  return (
    <View style={styles.cardShadowWrapper}>
      <View style={styles.card}>
        <FocusBarBackgroundSvg />

        <View style={styles.content}>
          {/* Left: Percentage Circle */}
          <View style={styles.percentageCircle}>
            <Text style={styles.percentageText}>{progressPercent}%</Text>
            <Text style={styles.percentageLabel}>DONE</Text>
          </View>

          {/* Center: Title + Progress Bar + Status */}
          <View style={styles.centerBlock}>
            <View style={styles.titleRow}>
              <Badge label="DAILY FOCUS" variant="yellow" size="sm" />
              <View style={styles.liveIndicator}>
                <Animated.View
                  style={[
                    styles.liveDot,
                    { transform: [{ scale: pulseScale }] },
                  ]}
                />
                <Text style={styles.liveText}>ACTIVE</Text>
              </View>
            </View>

            <View style={styles.progressBarBg}>
              <View
                style={[
                  styles.progressBarFill,
                  { width: `${Math.max(progressPercent, 5)}%` },
                ]}
              />
            </View>

            <Text style={styles.statusText} numberOfLines={1}>
              {motivationStatus}
            </Text>
          </View>

          {/* Right: Quick Stats */}
          <View style={styles.rightStats}>
            <View style={styles.miniStatPill}>
              <View style={[styles.statDot, { backgroundColor: '#F5C518' }]} />
              <Text style={styles.statNumber}>{pendingCount}</Text>
              <Text style={styles.statCaption}>left</Text>
            </View>

            <View style={styles.miniStatPill}>
              <View style={[styles.statDot, { backgroundColor: '#52D22E' }]} />
              <Text style={styles.statNumber}>{completedCount}</Text>
              <Text style={styles.statCaption}>done</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardShadowWrapper: {
    marginHorizontal: 16,
    marginTop: 6,
    marginBottom: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#141519',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 10,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  card: {
    backgroundColor: '#1C1E26',
    borderRadius: 20,
    borderWidth: 1.2,
    borderColor: '#2F3342',
    overflow: 'hidden',
    position: 'relative',
    height: 84,
    justifyContent: 'center',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    gap: 12,
  },
  percentageCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(245, 197, 24, 0.12)',
    borderWidth: 1.5,
    borderColor: 'rgba(245, 197, 24, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  percentageText: {
    fontFamily: Fonts.ranade.bold,
    fontSize: 17,
    color: '#FFE600',
    lineHeight: 20,
  },
  percentageLabel: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: 8,
    color: '#E8E2D5',
    letterSpacing: 0.6,
  },
  centerBlock: {
    flex: 1,
    gap: 5,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
  liveDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#52D22E',
  },
  liveText: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: 8.5,
    color: '#A3E4BF',
    letterSpacing: 0.4,
  },
  progressBarBg: {
    height: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: 2.5,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#F5C518',
    borderRadius: 2.5,
  },
  statusText: {
    fontFamily: Fonts.poppins.regular,
    fontSize: 10.5,
    color: '#D4CCA8',
  },
  rightStats: {
    gap: 5,
  },
  miniStatPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    borderWidth: 0.8,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  statDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
  },
  statNumber: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: 11,
    color: '#FFFFFF',
  },
  statCaption: {
    fontFamily: Fonts.poppins.regular,
    fontSize: 9.5,
    color: '#A3A8B1',
  },
});

export default TaskProductivityBento;
