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
import { Colors } from '../../../Assets/StyleUtilities/Colors';
import { Badge } from '../../../Common/Badge';
import { Reminder } from '../../../Context/TaskReminderContext';

interface ReminderScheduleBentoProps {
  reminders: Reminder[];
  onAddReminder?: () => void;
}

/**
 * FocusBarBackgroundSvg for Reminders:
 * - Slim 88px profile identical in design to TaskProductivityBento
 * - Lavender acoustic focus auras on obsidian canvas
 */
const FocusBarBackgroundSvg: React.FC = React.memo(() => (
  <View style={StyleSheet.absoluteFill} pointerEvents="none">
    <Svg
      width="100%"
      height="100%"
      viewBox="0 0 360 88"
      preserveAspectRatio="none"
      fill="none"
    >
      <Defs>
        <LinearGradient id="remFocusBarBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor="#252733" stopOpacity={0.8} />
          <Stop offset="50%" stopColor="#1C1E26" stopOpacity={0.5} />
          <Stop offset="100%" stopColor="#141519" stopOpacity={0.9} />
        </LinearGradient>

        <RadialGradient
          id="remFocusLavenderAura"
          cx="12%"
          cy="50%"
          rx="50%"
          ry="90%"
        >
          <Stop offset="0%" stopColor="#9C9CE3" stopOpacity={0.32} />
          <Stop offset="55%" stopColor="#8383D6" stopOpacity={0.08} />
          <Stop offset="100%" stopColor="#141519" stopOpacity={0} />
        </RadialGradient>

        <RadialGradient
          id="remFocusGoldGlow"
          cx="88%"
          cy="30%"
          rx="45%"
          ry="80%"
        >
          <Stop offset="0%" stopColor="#F5C518" stopOpacity={0.16} />
          <Stop offset="60%" stopColor="#DEAA14" stopOpacity={0.03} />
          <Stop offset="100%" stopColor="#141519" stopOpacity={0} />
        </RadialGradient>
      </Defs>

      <Rect width="100%" height="100%" fill="url(#remFocusBarBg)" />
      <Rect width="100%" height="100%" fill="url(#remFocusLavenderAura)" />
      <Rect width="100%" height="100%" fill="url(#remFocusGoldGlow)" />

      {/* Ambient right accent ring */}
      <Circle
        cx={330}
        cy={20}
        r={32}
        stroke="rgba(216, 219, 255, 0.15)"
        strokeWidth={1}
        fill="none"
      />
    </Svg>
  </View>
));

const ReminderPercentBadge: React.FC<{ percent: number }> = React.memo(
  ({ percent }) => (
    <View style={styles.percentBadgeContainer}>
      <Svg width={56} height={56} viewBox="0 0 56 56" fill="none">
        <Defs>
          <LinearGradient
            id="remUniqueBorderGrad"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <Stop offset="0%" stopColor="#D8DBFF" stopOpacity={0.95} />
            <Stop offset="50%" stopColor="#8383D6" stopOpacity={0.75} />
            <Stop offset="100%" stopColor="#5E5EB2" stopOpacity={0.9} />
          </LinearGradient>
        </Defs>

        {/* Outer Unique Rounded Rect Frame with Specular Lavender Gradient Border */}
        <Rect
          x={1.5}
          y={1.5}
          width={53}
          height={53}
          rx={18}
          stroke="url(#remUniqueBorderGrad)"
          strokeWidth={1.8}
          fill="rgba(131, 131, 214, 0.1)"
        />

        {/* Inner Subtle Hairline Accent */}
        <Rect
          x={4.5}
          y={4.5}
          width={47}
          height={47}
          rx={14}
          stroke="rgba(255, 255, 255, 0.12)"
          strokeWidth={1}
          fill="rgba(0, 0, 0, 0.28)"
        />
      </Svg>

      {/* Centered Typography in Lavender Palette */}
      <View style={styles.graphTextOverlay} pointerEvents="none">
        <Text style={styles.percentageText}>{percent}%</Text>
        <Text style={styles.percentageLabel}>DONE</Text>
      </View>
    </View>
  ),
);

export const ReminderScheduleBento: React.FC<ReminderScheduleBentoProps> = ({
  reminders,
}) => {
  const completedCount = useMemo(
    () => reminders.filter(r => r.done).length,
    [reminders],
  );
  const totalCount = reminders.length;
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

  // Find next pending reminder
  const nextAlert = useMemo(() => {
    const pendingList = reminders.filter(r => !r.done);
    if (pendingList.length === 0) return null;
    return pendingList[0];
  }, [reminders]);

  const motivationStatus = useMemo(() => {
    if (totalCount === 0) return 'Set your first reminder alert';
    if (progressPercent === 100) return 'All reminder alerts acknowledged! 🔔';
    if (nextAlert?.time)
      return `Next chime: ${nextAlert.time} (${nextAlert.title})`;
    return `${pendingCount} of ${totalCount} alerts pending`;
  }, [totalCount, pendingCount, progressPercent, nextAlert]);

  return (
    <View style={styles.cardShadowWrapper}>
      <View style={styles.card}>
        <FocusBarBackgroundSvg />

        <View style={styles.content}>
          {/* Left: Unique Bordered Percentage Badge */}
          <ReminderPercentBadge percent={progressPercent} />

          {/* Center: Title + Progress Bar + Status */}
          <View style={styles.centerBlock}>
            <View style={styles.titleRow}>
              <Badge label="ALERT HORIZON" variant="purple" size="sm" />
              <View style={styles.liveIndicator}>
                <Animated.View
                  style={[
                    styles.liveDot,
                    { transform: [{ scale: pulseScale }] },
                  ]}
                />
                <Text style={styles.liveText}>TIMED</Text>
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

          {/* Right: Quick Stats with Glassy Tactile Badges */}
          <View style={styles.rightStats}>
            <View style={styles.glassStatPill}>
              <View style={[styles.statDot, { backgroundColor: '#8383D6' }]} />
              <Text style={styles.statNumber}>{pendingCount}</Text>
              <Text style={styles.statCaption}>left</Text>
            </View>

            <View style={styles.glassStatPill}>
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
    backgroundColor: Colors.NeroBlack,
    borderRadius: 24,
    borderWidth: 4,
    borderColor: 'rgba(255, 255, 255, 0.9)',
    overflow: 'hidden',
    position: 'relative',
    height: 88,
    justifyContent: 'center',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    gap: 12,
  },
  percentBadgeContainer: {
    width: 56,
    height: 56,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  graphTextOverlay: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  percentageText: {
    fontFamily: Fonts.ranade.bold,
    fontSize: 15,
    color: '#D8DBFF',
    lineHeight: 18,
  },
  percentageLabel: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: 7.5,
    color: '#9C9CE3',
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
    backgroundColor: '#8383D6',
  },
  liveText: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: 8.5,
    color: '#D8DBFF',
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
    backgroundColor: '#8383D6',
    borderRadius: 2.5,
  },
  statusText: {
    fontFamily: Fonts.poppins.regular,
    fontSize: 10.5,
    color: '#C8CBE0',
  },
  rightStats: {
    gap: 6,
  },
  glassStatPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    paddingHorizontal: 9,
    paddingVertical: 4.5,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.22)',
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.18,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  statDot: {
    width: 6.5,
    height: 6.5,
    borderRadius: 3.5,
  },
  statNumber: {
    fontFamily: Fonts.poppins.bold,
    fontSize: 12,
    color: '#FFFFFF',
    letterSpacing: -0.2,
  },
  statCaption: {
    fontFamily: Fonts.poppins.medium,
    fontSize: 10,
    color: '#E0DFE3',
    letterSpacing: 0.2,
  },
});

export default ReminderScheduleBento;
