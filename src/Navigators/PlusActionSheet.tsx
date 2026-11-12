import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StyleSheet,
  Animated,
  Dimensions,
  Platform,
  Easing,
} from 'react-native';
import Svg, {
  Defs,
  LinearGradient,
  Stop,
  Rect,
  Path,
  Circle,
} from 'react-native-svg';
import {
  CheckSquare,
  Bell,
  ChevronRight,
  Sparkles,
  Flame,
} from 'lucide-react-native';
import { Colors, withAlpha } from '../Assets/StyleUtilities/Colors';
import { Fonts } from '../Theme/fonts';
import { Badge } from '../Common/Badge';
import { useTheme } from '../Theme/ThemeContext';
import ResponsivePixels from '../Assets/StyleUtilities/ResponsivePixels';

const { width: SW } = Dimensions.get('window');
const SHEET_W = Math.min(SW - ResponsivePixels.size20, ResponsivePixels.size362);

export interface PlusActionSheetProps {
  visible: boolean;
  onClose: () => void;
  onPressNewTask: () => void;
  onPressNewReminder: () => void;
  onPressNewHabit?: () => void;
  bottomOffset: number;
  onDismissed?: () => void;
}

interface SheetBackgroundAestheticSvgProps {
  width: number;
}

// Vector background pattern for PlusActionSheet.
const SheetBackgroundAestheticSvg: React.FC<SheetBackgroundAestheticSvgProps> =
  React.memo(({ width }) => {
    const { isDarkMode } = useTheme();
    const starPath = (cx: number, cy: number, r: number) =>
      `M ${cx} ${cy - r} Q ${cx} ${cy} ${cx + r} ${cy} Q ${cx} ${cy} ${cx} ${
        cy + r
      } Q ${cx} ${cy} ${cx - r} ${cy} Q ${cx} ${cy} ${cx} ${cy - r} Z`;

    const cx = width / 2;

    return (
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <Svg
          width="100%"
          height="100%"
          viewBox={`0 0 ${width} 226`}
          preserveAspectRatio="none"
          fill="none"
        >
          <Defs>
            <LinearGradient id="sheetBgGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop
                offset="0%"
                stopColor={
                  isDarkMode ? Colors.DarkCardBackground : Colors.PureWhite
                }
                stopOpacity={1}
              />
              <Stop
                offset="50%"
                stopColor={
                  isDarkMode
                    ? Colors.DarkSurfacePressed
                    : Colors.WarmCreamHighlight
                }
                stopOpacity={0.99}
              />
              <Stop
                offset="100%"
                stopColor={
                  isDarkMode ? Colors.DarkCanvasRich : Colors.WarmParchment
                }
                stopOpacity={1}
              />
            </LinearGradient>
            <LinearGradient
              id="goldSparkle"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <Stop
                offset="0%"
                stopColor={Colors.GoldSparkleTint}
                stopOpacity={1}
              />
              <Stop
                offset="100%"
                stopColor={Colors.SovereignCrestGold}
                stopOpacity={0.85}
              />
            </LinearGradient>
          </Defs>
          <Rect width="100%" height="100%" fill="url(#sheetBgGrad)" />
          <Rect
            x={6}
            y={6}
            width={width - 12}
            height={214}
            rx={22}
            stroke={
              isDarkMode
                ? withAlpha(Colors.PureWhite, 0.12)
                : withAlpha(Colors.RingBorder, 0.45)
            }
            strokeWidth={0.8}
            fill="none"
          />
          <Circle
            cx={cx}
            cy={-14}
            r={58}
            stroke={withAlpha(Colors.SovereignCrestGold, 0.16)}
            strokeWidth={0.8}
            fill="none"
          />
          <Circle
            cx={cx}
            cy={-14}
            r={88}
            stroke={withAlpha(Colors.SovereignCrestGold, 0.12)}
            strokeWidth={0.75}
            strokeDasharray="3 4"
            fill="none"
          />
          <Circle
            cx={cx}
            cy={-14}
            r={120}
            stroke={withAlpha(Colors.SovereignCrestGold, 0.08)}
            strokeWidth={0.7}
            fill="none"
          />
          <Path d={starPath(width - 24, 18, 4.5)} fill="url(#goldSparkle)" />
          <Circle
            cx={width - 38}
            cy={22}
            r={1.2}
            fill={Colors.SovereignCrestGold}
            opacity={0.4}
          />
          <Path
            d={starPath(22, 22, 3.5)}
            fill="url(#goldSparkle)"
            opacity={0.7}
          />
          <Circle
            cx={34}
            cy={16}
            r={1}
            fill={Colors.SovereignCrestGold}
            opacity={0.35}
          />
          <Circle
            cx={cx}
            cy={218}
            r={1.5}
            fill={Colors.ChampagneDust}
            opacity={0.6}
          />
        </Svg>
      </View>
    );
  });

export const PlusActionSheet: React.FC<PlusActionSheetProps> = ({
  visible,
  onClose,
  onPressNewTask,
  onPressNewReminder,
  onPressNewHabit,
  bottomOffset,
  onDismissed,
}) => {
  const { isDarkMode } = useTheme();
  const [mounted, setMounted] = useState(visible);
  const anim = useRef(new Animated.Value(0)).current;
  const backdropAnim = useRef(new Animated.Value(0)).current;
  const onDismissedRef = useRef(onDismissed);
  onDismissedRef.current = onDismissed;

  useEffect(() => {
    if (visible) {
      setMounted(true);
      Animated.parallel([
        Animated.timing(backdropAnim, {
          toValue: 1,
          duration: 200,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.spring(anim, {
          toValue: 1,
          tension: 85,
          friction: 9,
          useNativeDriver: true,
        }),
      ]).start();
    } else if (mounted) {
      Animated.parallel([
        Animated.timing(backdropAnim, {
          toValue: 0,
          duration: 160,
          easing: Easing.in(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(anim, {
          toValue: 0,
          duration: 160,
          easing: Easing.in(Easing.quad),
          useNativeDriver: true,
        }),
      ]).start(({ finished }) => {
        if (finished) {
          setMounted(false);
          onDismissedRef.current?.();
        }
      });
    }
  }, [visible, mounted, anim, backdropAnim]);

  if (!mounted && !visible) {
    return null;
  }

  const scale = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.45, 1],
  });

  const translateY = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [ResponsivePixels.size28, 0],
  });

  const opacity = anim.interpolate({
    inputRange: [0, 0.25, 1],
    outputRange: [0, 0.75, 1],
  });

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
      {/* ── Outside click backdrop overlay ── */}
      <Animated.View style={[styles.backdrop, { opacity: backdropAnim }]}>
        <TouchableWithoutFeedback onPress={onClose} accessible={false}>
          <View style={styles.backdropTouchArea} />
        </TouchableWithoutFeedback>
      </Animated.View>

      {/* ── Animated sheet card container with signature 2-layer shadow ── */}
      <Animated.View
        style={[
          styles.cardContainer,
          {
            bottom: bottomOffset,
            left: (SW - SHEET_W) / 2,
            width: SHEET_W,
            opacity,
            transform: [{ translateY }, { scale }],
          },
        ]}
      >
        {/* Subtle arrow notch pointing toward the center plus button */}
        <View
          style={[
            styles.pointerNotch,
            isDarkMode && {
              backgroundColor: Colors.DarkCanvasRich,
              borderColor: Colors.CarbonSlate,
            },
          ]}
        />

        {/* 2-layer wrapper: Outer shadow wrapper + inner clipped card */}
        <View style={styles.cardShadowWrapper}>
          <View
            style={[
              styles.card,
              isDarkMode && {
                backgroundColor: Colors.DarkCardBackground,
                borderColor: Colors.CarbonSlate,
                borderTopColor: Colors.DarkSoftLinen,
              },
            ]}
          >
            {/* Pristine luxury background with guilloché arcs & gold micro-sparkles */}
            <SheetBackgroundAestheticSvg width={SHEET_W} />

            {/* Header row with 3D Badge + clean right tag */}
            <View style={styles.header}>
              <Badge
                label="QUICK CREATE"
                variant="neutral"
                size="md"
                icon={
                  <Sparkles
                    size={ResponsivePixels.size11}
                    color={Colors.ObsidianGoldAntique}
                    strokeWidth={2.4}
                  />
                }
              />

              <View
                style={[
                  styles.headerRight,
                  isDarkMode && {
                    backgroundColor: Colors.DarkCardElevated,
                    borderColor: Colors.DarkBorder,
                  },
                ]}
              >
                <Sparkles
                  size={ResponsivePixels.size11}
                  color={Colors.SovereignCrestGold}
                  strokeWidth={2.2}
                />
                <Text
                  style={[
                    styles.headerRightLabel,
                    isDarkMode && { color: Colors.AccentYellow },
                  ]}
                >
                  INSTANT
                </Text>
              </View>
            </View>

            {/* Action Cards Container - Responsive Row with Compact Height */}
            <View style={styles.optionsRow}>
              {/* ── Option 1: Add New Task (Works / Gold) ── */}
              <TouchableOpacity
                activeOpacity={0.82}
                style={[
                  styles.actionCard,
                  styles.taskCard,
                  isDarkMode && {
                    backgroundColor: Colors.WorkDarkBg,
                    borderColor: Colors.WorkDarkBorder,
                  },
                ]}
                onPress={onPressNewTask}
              >
                {/* Top Row: Icon Bubble */}
                <View style={styles.cardTopRow}>
                  <View
                    style={[
                      styles.iconWrap,
                      styles.taskIconWrap,
                      isDarkMode && {
                        backgroundColor: Colors.DarkCardElevated,
                        borderColor: Colors.WorkDarkBorder,
                      },
                    ]}
                  >
                    <CheckSquare
                      size={ResponsivePixels.size18}
                      color={Colors.HabitBurnishedAmber}
                      strokeWidth={2.4}
                    />
                  </View>
                </View>

                {/* Title & Subtitle - Snug Spacing, Zero Truncation */}
                <View style={styles.cardContent}>
                  <Text
                    style={[
                      styles.optionTitle,
                      isDarkMode && { color: Colors.PureWhite },
                    ]}
                  >
                    Add Task
                  </Text>
                  <Text
                    style={[
                      styles.optionSubtitle,
                      isDarkMode && { color: Colors.SteelMist },
                    ]}
                    numberOfLines={2}
                  >
                    To-dos, priorities & deadlines
                  </Text>
                </View>

                {/* Action Footer: Badge + Chevron Button */}
                <View style={styles.cardFooter}>
                  <Badge label="TO-DO" variant="yellow" size="sm" />
                  <View
                    style={[
                      styles.arrowCircle,
                      styles.taskArrowCircle,
                      isDarkMode && { backgroundColor: Colors.DarkCardElevated },
                    ]}
                  >
                    <ChevronRight
                      size={ResponsivePixels.size12}
                      color={Colors.HabitBurnishedAmber}
                      strokeWidth={2.4}
                    />
                  </View>
                </View>

                {/* Signature category bottom accent bar */}
                <View style={styles.cardAccentWrap}>
                  <View
                    style={[
                      styles.cardAccent,
                      { backgroundColor: Colors.AccentYellow },
                    ]}
                  />
                </View>
              </TouchableOpacity>

              {/* ── Option 2: Add New Reminder (Reminders / Mint Green) ── */}
              <TouchableOpacity
                activeOpacity={0.82}
                style={[
                  styles.actionCard,
                  styles.reminderCard,
                  isDarkMode && {
                    backgroundColor: Colors.WellnessDarkBg,
                    borderColor: Colors.GreenGracious,
                  },
                ]}
                onPress={onPressNewReminder}
              >
                {/* Top Row: Icon Bubble */}
                <View style={styles.cardTopRow}>
                  <View
                    style={[
                      styles.iconWrap,
                      styles.reminderIconWrap,
                      isDarkMode && {
                        backgroundColor: Colors.DarkCardElevated,
                        borderColor: Colors.GreenGracious,
                      },
                    ]}
                  >
                    <Bell
                      size={ResponsivePixels.size18}
                      color={Colors.GreenGracious}
                      strokeWidth={2.4}
                    />
                  </View>
                </View>

                {/* Title & Subtitle - Snug Spacing, Zero Truncation */}
                <View style={styles.cardContent}>
                  <Text
                    style={[
                      styles.optionTitle,
                      isDarkMode && { color: Colors.PureWhite },
                    ]}
                  >
                    Reminder
                  </Text>
                  <Text
                    style={[
                      styles.optionSubtitle,
                      isDarkMode && { color: Colors.SteelMist },
                    ]}
                    numberOfLines={2}
                  >
                    Alerts, times & schedules
                  </Text>
                </View>

                {/* Action Footer: Badge + Chevron Button */}
                <View style={styles.cardFooter}>
                  <Badge label="ALERT" variant="green" size="sm" />
                  <View
                    style={[
                      styles.arrowCircle,
                      styles.reminderArrowCircle,
                      isDarkMode && { backgroundColor: Colors.DarkCardElevated },
                    ]}
                  >
                    <ChevronRight
                      size={ResponsivePixels.size12}
                      color={Colors.GreenGracious}
                      strokeWidth={2.4}
                    />
                  </View>
                </View>

                {/* Signature category bottom accent bar */}
                <View style={styles.cardAccentWrap}>
                  <View
                    style={[
                      styles.cardAccent,
                      { backgroundColor: Colors.AccentGreen },
                    ]}
                  />
                </View>
              </TouchableOpacity>

              {/* ── Option 3: Add New Habit (Habits / Lavender Purple) ── */}
              <TouchableOpacity
                activeOpacity={0.82}
                style={[
                  styles.actionCard,
                  styles.habitCard,
                  isDarkMode && {
                    backgroundColor: Colors.MindfulDarkBg,
                    borderColor: Colors.LavenderPurple,
                  },
                ]}
                onPress={onPressNewHabit}
              >
                {/* Top Row: Icon Bubble */}
                <View style={styles.cardTopRow}>
                  <View
                    style={[
                      styles.iconWrap,
                      styles.habitIconWrap,
                      isDarkMode && {
                        backgroundColor: Colors.DarkCardElevated,
                        borderColor: Colors.LavenderPurple,
                      },
                    ]}
                  >
                    <Flame
                      size={ResponsivePixels.size18}
                      color={Colors.LavenderPurple}
                      strokeWidth={2.4}
                    />
                  </View>
                </View>

                {/* Title & Subtitle - Snug Spacing, Zero Truncation */}
                <View style={styles.cardContent}>
                  <Text
                    style={[
                      styles.optionTitle,
                      isDarkMode && { color: Colors.PureWhite },
                    ]}
                  >
                    Habit
                  </Text>
                  <Text
                    style={[
                      styles.optionSubtitle,
                      isDarkMode && { color: Colors.SteelMist },
                    ]}
                    numberOfLines={2}
                  >
                    Rituals, streaks & momentum
                  </Text>
                </View>

                {/* Action Footer: Badge + Chevron Button */}
                <View style={styles.cardFooter}>
                  <Badge label="RITUAL" variant="purple" size="sm" />
                  <View
                    style={[
                      styles.arrowCircle,
                      styles.habitArrowCircle,
                      isDarkMode && { backgroundColor: Colors.DarkCardElevated },
                    ]}
                  >
                    <ChevronRight
                      size={ResponsivePixels.size12}
                      color={Colors.LavenderPurple}
                      strokeWidth={2.4}
                    />
                  </View>
                </View>

                {/* Signature category bottom accent bar */}
                <View style={styles.cardAccentWrap}>
                  <View
                    style={[
                      styles.cardAccent,
                      { backgroundColor: Colors.LavenderPurple },
                    ]}
                  />
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: withAlpha(Colors.DarkBackground, 0.42),
    zIndex: 50,
  },
  backdropTouchArea: {
    ...StyleSheet.absoluteFill,
  },
  cardContainer: {
    position: 'absolute',
    zIndex: 60,
  },
  pointerNotch: {
    position: 'absolute',
    bottom: -ResponsivePixels.size6_5,
    alignSelf: 'center',
    width: ResponsivePixels.size14,
    height: ResponsivePixels.size14,
    backgroundColor: Colors.WarmParchment,
    transform: [{ rotate: '45deg' }],
    borderBottomRightRadius: ResponsivePixels.size3,
    borderRightWidth: 1.5,
    borderBottomWidth: 1.5,
    borderColor: Colors.RingBorder,
    zIndex: 1,
  },
  cardShadowWrapper: {
    borderRadius: ResponsivePixels.size26,
    backgroundColor: Colors.Transparent,
    ...Platform.select({
      ios: {
        shadowColor: Colors.DarkBackground,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.18,
        shadowRadius: 20,
      },
      android: {
        elevation: 16,
      },
    }),
  },
  card: {
    backgroundColor: Colors.WarmCreamHighlight,
    borderRadius: ResponsivePixels.size26,
    overflow: 'hidden',
    paddingHorizontal: ResponsivePixels.size12,
    paddingTop: ResponsivePixels.size11,
    paddingBottom: ResponsivePixels.size13,
    borderWidth: 1.5,
    borderColor: Colors.RingBorder,
    borderTopWidth: 2,
    borderTopColor: Colors.PureWhite,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: ResponsivePixels.size9,
    paddingHorizontal: ResponsivePixels.size4,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ResponsivePixels.size4,
    paddingHorizontal: ResponsivePixels.size8,
    paddingVertical: ResponsivePixels.size3,
    borderRadius: ResponsivePixels.size10,
    backgroundColor: withAlpha(Colors.PureWhite, 0.85),
    borderWidth: 1,
    borderColor: Colors.WarmParchmentBorder,
  },
  headerRightLabel: {
    fontFamily: Fonts.poppins.bold,
    fontSize: ResponsivePixels.size8_5,
    color: Colors.WarmSepiaHint,
    letterSpacing: 0.7,
  },
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: ResponsivePixels.size7_5,
  },
  actionCard: {
    flex: 1,
    minWidth: ResponsivePixels.size96,
    // height: ResponsivePixels.size158,
    borderRadius: ResponsivePixels.size20,
    borderTopRightRadius: ResponsivePixels.size42,
    borderWidth: 1.8,
    paddingHorizontal: ResponsivePixels.size8,
    paddingTop: ResponsivePixels.size9_5,
    paddingBottom: ResponsivePixels.size10,
    position: 'relative',
    ...Platform.select({
      ios: {
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.24,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  taskCard: {
    backgroundColor: Colors.WorkLightBg,
    borderColor: Colors.WorkLightBorder,
    ...Platform.select({
      ios: {
        shadowColor: Colors.AccentYellow,
      },
    }),
  },
  reminderCard: {
    backgroundColor: Colors.WellnessLightBg,
    borderColor: Colors.WellnessLightBorder,
    ...Platform.select({
      ios: {
        shadowColor: Colors.LeafGreenShadow,
      },
    }),
  },
  habitCard: {
    backgroundColor: Colors.MindfulLightBg,
    borderColor: Colors.MindfulLightBorder,
    ...Platform.select({
      ios: {
        shadowColor: Colors.LavenderPurple,
      },
    }),
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: ResponsivePixels.size5,
  },
  iconWrap: {
    width: ResponsivePixels.size35,
    height: ResponsivePixels.size35,
    borderRadius: ResponsivePixels.size12,
    backgroundColor: Colors.PureWhite,
    borderWidth: 1.4,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.14,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  taskIconWrap: {
    borderColor: Colors.WorkLightBorder,
    ...Platform.select({
      ios: {
        shadowColor: Colors.AccentYellow,
      },
    }),
  },
  reminderIconWrap: {
    borderColor: Colors.WellnessLightBorder,
    ...Platform.select({
      ios: {
        shadowColor: Colors.LeafGreenShadow,
      },
    }),
  },
  habitIconWrap: {
    borderColor: Colors.MindfulLightBorder,
    ...Platform.select({
      ios: {
        shadowColor: Colors.LavenderPurple,
      },
    }),
  },
  cardContent: {
    marginBottom: ResponsivePixels.size6,
  },
  optionTitle: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: ResponsivePixels.size13,
    color: Colors.MidnightCharcoal,
    lineHeight: ResponsivePixels.size17,
    letterSpacing: -0.2,
  },
  optionSubtitle: {
    fontFamily: Fonts.poppins.regular,
    fontSize: ResponsivePixels.size9_3,
    color: Colors.SubtitleGray,
    lineHeight: ResponsivePixels.size13,
    marginTop: ResponsivePixels.size1_5,
    minHeight: ResponsivePixels.size26,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 'auto',
    paddingBottom: ResponsivePixels.size2,
  },
  arrowCircle: {
    width: ResponsivePixels.size21,
    height: ResponsivePixels.size21,
    borderRadius: ResponsivePixels.size10_5,
    backgroundColor: Colors.PureWhite,
    borderWidth: 1.1,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 2,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  taskArrowCircle: {
    borderColor: Colors.WorkLightBorder,
    ...Platform.select({
      ios: {
        shadowColor: Colors.HabitBurnishedAmber,
      },
    }),
  },
  reminderArrowCircle: {
    borderColor: Colors.WellnessLightBorder,
    ...Platform.select({
      ios: {
        shadowColor: Colors.LeafGreenShadow,
      },
    }),
  },
  habitArrowCircle: {
    borderColor: Colors.MindfulLightBorder,
    ...Platform.select({
      ios: {
        shadowColor: Colors.LavenderPurple,
      },
    }),
  },
  cardAccentWrap: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  cardAccent: {
    height: ResponsivePixels.size3_5,
    width: ResponsivePixels.size40,
    borderTopLeftRadius: ResponsivePixels.size2_5,
    borderTopRightRadius: ResponsivePixels.size2_5,
  },
});

export default PlusActionSheet;
