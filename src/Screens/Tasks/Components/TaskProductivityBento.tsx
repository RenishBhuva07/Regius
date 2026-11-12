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
import { Colors, withAlpha } from '../../../Assets/StyleUtilities/Colors';
import { useAppTheme } from '../../../Theme/useAppTheme';
import { Badge } from '../../../Common/Badge';
import { Task } from '../../../Context/TaskReminderContext';
import ResponsivePixels from '../../../Assets/StyleUtilities/ResponsivePixels';

interface TaskProductivityBentoProps {
  tasks: Task[];
  onAddTask?: () => void;
}

// Background vector pattern for the task focus bar.
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
        <LinearGradient id="focusBarBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor={Colors.BentoStopSlate} stopOpacity={0.8} />
          <Stop offset="50%" stopColor={Colors.BentoStopMid} stopOpacity={0.5} />
          <Stop offset="100%" stopColor={Colors.BentoStopAbyss} stopOpacity={0.9} />
        </LinearGradient>

        <RadialGradient id="focusGoldAura" cx="12%" cy="50%" rx="50%" ry="90%">
          <Stop offset="0%" stopColor={Colors.AccentYellow} stopOpacity={0.28} />
          <Stop offset="55%" stopColor={Colors.WorkDarkBorder} stopOpacity={0.06} />
          <Stop offset="100%" stopColor={Colors.BentoStopAbyss} stopOpacity={0} />
        </RadialGradient>

        <RadialGradient
          id="focusLavenderGlow"
          cx="88%"
          cy="30%"
          rx="45%"
          ry="80%"
        >
          <Stop offset="0%" stopColor={Colors.PeriwinkleSoft} stopOpacity={0.2} />
          <Stop offset="60%" stopColor={Colors.LavenderPurple} stopOpacity={0.04} />
          <Stop offset="100%" stopColor={Colors.BentoStopAbyss} stopOpacity={0} />
        </RadialGradient>
      </Defs>

      <Rect width="100%" height="100%" fill="url(#focusBarBg)" />
      <Rect width="100%" height="100%" fill="url(#focusGoldAura)" />
      <Rect width="100%" height="100%" fill="url(#focusLavenderGlow)" />
      <Circle
        cx={330}
        cy={20}
        r={32}
        stroke={withAlpha(Colors.WorkLightBorder, 0.12)}
        strokeWidth={1}
        fill="none"
      />
    </Svg>
  </View>
));

const TaskPercentBadge: React.FC<{ percent: number }> = React.memo(
  ({ percent }) => (
    <View style={styles.percentBadgeContainer}>
      <Svg
        width={ResponsivePixels.size56}
        height={ResponsivePixels.size56}
        viewBox="0 0 56 56"
        fill="none"
      >
        <Defs>
          <LinearGradient
            id="uniqueBorderGrad"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <Stop offset="0%" stopColor={Colors.HeroSunGlowYellow} stopOpacity={0.9} />
            <Stop offset="50%" stopColor={Colors.AccentYellow} stopOpacity={0.65} />
            <Stop offset="100%" stopColor={Colors.WorkDarkBorder} stopOpacity={0.85} />
          </LinearGradient>
        </Defs>

        {/* Outer Unique Rounded Rect Frame with Specular Gold Gradient Border */}
        <Rect
          x={1.5}
          y={1.5}
          width={53}
          height={53}
          rx={18}
          stroke="url(#uniqueBorderGrad)"
          strokeWidth={1.8}
          fill={withAlpha(Colors.AccentYellow, 0.08)}
        />

        {/* Inner Subtle Hairline Accent */}
        <Rect
          x={4.5}
          y={4.5}
          width={47}
          height={47}
          rx={14}
          stroke={withAlpha(Colors.PureWhite, 0.12)}
          strokeWidth={1}
          fill={withAlpha(Colors.PureBlack, 0.28)}
        />
      </Svg>

      {/* Centered Typography */}
      <View style={styles.graphTextOverlay} pointerEvents="none">
        <Text style={styles.percentageText}>{percent}%</Text>
        <Text style={styles.percentageLabel}>DONE</Text>
      </View>
    </View>
  ),
);

export const TaskProductivityBento: React.FC<TaskProductivityBentoProps> = ({
  tasks,
}) => {
  const { isDarkMode } = useAppTheme();
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
      <View
        style={[
          styles.card,
          isDarkMode && { borderColor: withAlpha(Colors.PureWhite, 0.22) },
        ]}
      >
        <FocusBarBackgroundSvg />

        <View style={styles.content}>
          {/* Left: Unique Bordered Percentage Badge */}
          <TaskPercentBadge percent={progressPercent} />

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

          {/* Right: Quick Stats with Glassy Tactile Badges */}
          <View style={styles.rightStats}>
            <View style={styles.glassStatPill}>
              <View
                style={[styles.statDot, { backgroundColor: Colors.AccentYellow }]}
              />
              <Text style={styles.statNumber}>{pendingCount}</Text>
              <Text style={styles.statCaption}>left</Text>
            </View>

            <View style={styles.glassStatPill}>
              <View
                style={[styles.statDot, { backgroundColor: Colors.AccentGreen }]}
              />
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
    backgroundColor: Colors.NeroBlack,
    borderRadius: ResponsivePixels.size24,
    borderWidth: 4,
    borderColor: withAlpha(Colors.PureWhite, 0.9),
    overflow: 'hidden',
    position: 'relative',
    height: ResponsivePixels.size88,
    justifyContent: 'center',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: ResponsivePixels.size14,
    gap: ResponsivePixels.size12,
  },
  percentBadgeContainer: {
    width: ResponsivePixels.size56,
    height: ResponsivePixels.size56,
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
    fontSize: ResponsivePixels.size15,
    color: Colors.WorkDarkLabelGold,
    lineHeight: ResponsivePixels.size18,
  },
  percentageLabel: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: ResponsivePixels.size7_5,
    color: Colors.RingBorder,
    letterSpacing: 0.6,
  },
  centerBlock: {
    flex: 1,
    gap: ResponsivePixels.size5,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ResponsivePixels.size6,
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ResponsivePixels.size4,
    backgroundColor: withAlpha(Colors.PureWhite, 0.08),
    paddingHorizontal: ResponsivePixels.size6,
    paddingVertical: ResponsivePixels.size2,
    borderRadius: ResponsivePixels.size10,
  },
  liveDot: {
    width: ResponsivePixels.size5,
    height: ResponsivePixels.size5,
    borderRadius: ResponsivePixels.size2_5,
    backgroundColor: Colors.AccentGreen,
  },
  liveText: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: ResponsivePixels.size8_5,
    color: Colors.BentoMintGreen,
    letterSpacing: 0.4,
  },
  progressBarBg: {
    height: ResponsivePixels.size5,
    backgroundColor: withAlpha(Colors.PureWhite, 0.12),
    borderRadius: ResponsivePixels.size2_5,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: Colors.AccentYellow,
    borderRadius: ResponsivePixels.size2_5,
  },
  statusText: {
    fontFamily: Fonts.poppins.regular,
    fontSize: ResponsivePixels.size10_5,
    color: Colors.BentoWarmGoldMuted,
  },
  rightStats: {
    gap: ResponsivePixels.size6,
  },
  glassStatPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ResponsivePixels.size6,
    backgroundColor: withAlpha(Colors.PureWhite, 0.12),
    paddingHorizontal: ResponsivePixels.size9,
    paddingVertical: ResponsivePixels.size4_5,
    borderRadius: ResponsivePixels.size12,
    borderWidth: 1,
    borderColor: withAlpha(Colors.PureWhite, 0.22),
    ...Platform.select({
      ios: {
        shadowColor: Colors.PureBlack,
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
    width: ResponsivePixels.size6_5,
    height: ResponsivePixels.size6_5,
    borderRadius: ResponsivePixels.size3_5,
  },
  statNumber: {
    fontFamily: Fonts.poppins.bold,
    fontSize: ResponsivePixels.size12,
    color: Colors.PureWhite,
    letterSpacing: -0.2,
  },
  statCaption: {
    fontFamily: Fonts.poppins.medium,
    fontSize: ResponsivePixels.size10,
    color: Colors.BentoLightSilver,
    letterSpacing: 0.2,
  },
});

export default TaskProductivityBento;
