import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
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
import { Reminder } from '../../../Context/TaskReminderContext';
import ResponsivePixels from '../../../Assets/StyleUtilities/ResponsivePixels';

interface ReminderScheduleBentoProps {
  reminders: Reminder[];
  onAddReminder?: () => void;
}

// FocusBarBackgroundSvg for Reminders: calm, grounded acoustic surface.
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
        <LinearGradient id="remFocusBarBg" x1="0%" y1="0%" x2="0%" y2="100%">
          <Stop offset="0%" stopColor="#22252C" stopOpacity={0.9} />
          <Stop offset="50%" stopColor="#1C1D22" stopOpacity={0.95} />
          <Stop offset="100%" stopColor="#141519" stopOpacity={1} />
        </LinearGradient>
      </Defs>

      <Rect width="100%" height="100%" fill="url(#remFocusBarBg)" />

      {/* Ambient right accent ring */}
      <Circle
        cx={330}
        cy={20}
        r={32}
        stroke={withAlpha(Colors.PureWhite, 0.05)}
        strokeWidth={1}
        fill="none"
      />
    </Svg>
  </View>
));

const ReminderPercentBadge: React.FC<{ percent: number }> = React.memo(
  ({ percent }) => (
    <View style={styles.percentBadgeContainer}>
      <Svg
        width={ResponsivePixels.size56}
        height={ResponsivePixels.size56}
        viewBox="0 0 56 56"
        fill="none"
      >
        {/* Outer Rounded Rect Frame with Subtle Lavender Border */}
        <Rect
          x={1.5}
          y={1.5}
          width={53}
          height={53}
          rx={16}
          stroke={withAlpha(Colors.LavenderPurple, 0.45)}
          strokeWidth={1.2}
          fill={withAlpha(Colors.LavenderPurple, 0.06)}
        />

        {/* Inner Subtle Hairline Accent */}
        <Rect
          x={4.5}
          y={4.5}
          width={47}
          height={47}
          rx={13}
          stroke={withAlpha(Colors.PureWhite, 0.08)}
          strokeWidth={1}
          fill={withAlpha(Colors.PureBlack, 0.25)}
        />
      </Svg>

      {/* Centered Typography in Lavender Palette */}
      <View style={styles.graphTextOverlay} pointerEvents="none">
        <Text style={styles.percentageText}>{percent}%</Text>
        <Text style={styles.percentageLabel}>Done</Text>
      </View>
    </View>
  ),
);

export const ReminderScheduleBento: React.FC<ReminderScheduleBentoProps> = ({
  reminders,
}) => {
  const { isDarkMode } = useAppTheme();
  const completedCount = useMemo(
    () => reminders.filter(r => r.done).length,
    [reminders],
  );
  const totalCount = reminders.length;
  const pendingCount = totalCount - completedCount;

  const progressPercent =
    totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Find next pending reminder
  const nextAlert = useMemo(() => {
    const pendingList = reminders.filter(r => !r.done);
    if (pendingList.length === 0) return null;
    return pendingList[0];
  }, [reminders]);

  const motivationStatus = useMemo(() => {
    if (totalCount === 0) return 'Set your first reminder alert';
    if (progressPercent === 100) return 'All reminder alerts acknowledged';
    if (nextAlert?.time)
      return `Next chime: ${nextAlert.time} (${nextAlert.title})`;
    return `${pendingCount} of ${totalCount} alerts pending`;
  }, [totalCount, pendingCount, progressPercent, nextAlert]);

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
          <ReminderPercentBadge percent={progressPercent} />

          {/* Center: Title + Progress Bar + Status */}
          <View style={styles.centerBlock}>
            <View style={styles.titleRow}>
              <Badge label="Reminders" variant="purple" size="sm" />
              <View style={styles.liveIndicator}>
                <View style={styles.liveDot} />
                <Text style={styles.liveText}>Scheduled</Text>
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
                style={[styles.statDot, { backgroundColor: Colors.LavenderPurple }]}
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
    color: Colors.MindfulLightBorder,
    lineHeight: ResponsivePixels.size18,
    fontVariant: ['tabular-nums'],
  },
  percentageLabel: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: ResponsivePixels.size7_5,
    color: Colors.PeriwinkleSoft,
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
    backgroundColor: Colors.LavenderPurple,
  },
  liveText: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: ResponsivePixels.size8_5,
    color: Colors.MindfulLightBorder,
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
    backgroundColor: Colors.LavenderPurple,
    borderRadius: ResponsivePixels.size2_5,
  },
  statusText: {
    fontFamily: Fonts.poppins.regular,
    fontSize: ResponsivePixels.size10_5,
    color: Colors.BentoSubtitlePeriwinkle,
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
    fontVariant: ['tabular-nums'],
  },
  statCaption: {
    fontFamily: Fonts.poppins.medium,
    fontSize: ResponsivePixels.size10,
    color: Colors.BentoLightSilver,
    letterSpacing: 0.2,
  },
});

export default ReminderScheduleBento;
