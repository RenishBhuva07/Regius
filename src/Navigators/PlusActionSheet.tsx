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
import { Colors } from '../Assets/StyleUtilities/Colors';
import { Fonts } from '../Theme/fonts';
import { Badge } from '../Common/Badge';

const { width: SW } = Dimensions.get('window');
const SHEET_W = Math.min(SW - 20, 362);

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
              <Stop offset="0%" stopColor="#FFFFFF" stopOpacity={1} />
              <Stop offset="50%" stopColor="#FFFDF9" stopOpacity={0.99} />
              <Stop offset="100%" stopColor="#FAF7EF" stopOpacity={1} />
            </LinearGradient>
            <LinearGradient
              id="champagneGold"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <Stop offset="0%" stopColor="#FFF8E7" stopOpacity={1} />
              <Stop offset="100%" stopColor="#C5A059" stopOpacity={0.85} />
            </LinearGradient>
          </Defs>
          <Rect width="100%" height="100%" fill="url(#sheetBgGrad)" />
          <Rect
            x={6}
            y={6}
            width={width - 12}
            height={214}
            rx={22}
            stroke="rgba(232, 226, 213, 0.45)"
            strokeWidth={0.8}
            fill="none"
          />
          <Circle
            cx={cx}
            cy={-14}
            r={58}
            stroke="rgba(197, 160, 89, 0.16)"
            strokeWidth={0.8}
            fill="none"
          />
          <Circle
            cx={cx}
            cy={-14}
            r={88}
            stroke="rgba(197, 160, 89, 0.12)"
            strokeWidth={0.75}
            strokeDasharray="3 4"
            fill="none"
          />
          <Circle
            cx={cx}
            cy={-14}
            r={120}
            stroke="rgba(197, 160, 89, 0.08)"
            strokeWidth={0.7}
            fill="none"
          />
          <Path d={starPath(width - 24, 18, 4.5)} fill="url(#champagneGold)" />
          <Circle
            cx={width - 38}
            cy={22}
            r={1.2}
            fill="#C5A059"
            opacity={0.4}
          />
          <Path
            d={starPath(22, 22, 3.5)}
            fill="url(#champagneGold)"
            opacity={0.7}
          />
          <Circle cx={34} cy={16} r={1} fill="#C5A059" opacity={0.35} />
          <Circle cx={cx} cy={218} r={1.5} fill="#D5CEBE" opacity={0.6} />
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
    outputRange: [28, 0],
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
        <View style={styles.pointerNotch} />

        {/* 2-layer wrapper: Outer shadow wrapper + inner clipped card */}
        <View style={styles.cardShadowWrapper}>
          <View style={styles.card}>
            {/* Pristine luxury background with guilloché arcs & champagne micro-sparkles */}
            <SheetBackgroundAestheticSvg width={SHEET_W} />

            {/* Header row with 3D Badge + clean right tag */}
            <View style={styles.header}>
              <Badge
                label="QUICK CREATE"
                variant="purple"
                size="md"
                icon={
                  <Sparkles
                    size={11}
                    color={Colors.LavenderPurple}
                    strokeWidth={2.4}
                  />
                }
              />

              <View style={styles.headerRight}>
                <Sparkles size={11} color="#C5A059" strokeWidth={2.2} />
                <Text style={styles.headerRightLabel}>INSTANT</Text>
              </View>
            </View>

            {/* Action Cards Container - Responsive Row with Compact Height */}
            <View style={styles.optionsRow}>
              {/* ── Option 1: Add New Task ── */}
              <TouchableOpacity
                activeOpacity={0.82}
                style={[styles.actionCard, styles.taskCard]}
                onPress={onPressNewTask}
              >
                {/* Top Row: Icon Bubble */}
                <View style={styles.cardTopRow}>
                  <View style={[styles.iconWrap, styles.taskIconWrap]}>
                    <CheckSquare
                      size={18}
                      color={Colors.LavenderPurple}
                      strokeWidth={2.4}
                    />
                  </View>
                </View>

                {/* Title & Subtitle - Snug Spacing, Zero Truncation */}
                <View style={styles.cardContent}>
                  <Text style={styles.optionTitle}>Add Task</Text>
                  <Text style={styles.optionSubtitle} numberOfLines={2}>
                    To-dos, priorities & deadlines
                  </Text>
                </View>

                {/* Action Footer: Badge + Chevron Button */}
                <View style={styles.cardFooter}>
                  <Badge label="TO-DO" variant="purple" size="sm" />
                  <View style={[styles.arrowCircle, styles.taskArrowCircle]}>
                    <ChevronRight
                      size={12}
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

              {/* ── Option 2: Add New Reminder ── */}
              <TouchableOpacity
                activeOpacity={0.82}
                style={[styles.actionCard, styles.reminderCard]}
                onPress={onPressNewReminder}
              >
                {/* Top Row: Icon Bubble */}
                <View style={styles.cardTopRow}>
                  <View style={[styles.iconWrap, styles.reminderIconWrap]}>
                    <Bell size={18} color="#D97706" strokeWidth={2.4} />
                  </View>
                </View>

                {/* Title & Subtitle - Snug Spacing, Zero Truncation */}
                <View style={styles.cardContent}>
                  <Text style={styles.optionTitle}>Reminder</Text>
                  <Text style={styles.optionSubtitle} numberOfLines={2}>
                    Alerts, times & schedules
                  </Text>
                </View>

                {/* Action Footer: Badge + Chevron Button */}
                <View style={styles.cardFooter}>
                  <Badge label="ALERT" variant="yellow" size="sm" />
                  <View
                    style={[styles.arrowCircle, styles.reminderArrowCircle]}
                  >
                    <ChevronRight size={12} color="#D97706" strokeWidth={2.4} />
                  </View>
                </View>

                {/* Signature category bottom accent bar */}
                <View style={styles.cardAccentWrap}>
                  <View
                    style={[styles.cardAccent, { backgroundColor: '#FDD835' }]}
                  />
                </View>
              </TouchableOpacity>

              {/* ── Option 3: Add New Habit ── */}
              <TouchableOpacity
                activeOpacity={0.82}
                style={[styles.actionCard, styles.habitCard]}
                onPress={onPressNewHabit}
              >
                {/* Top Row: Icon Bubble */}
                <View style={styles.cardTopRow}>
                  <View style={[styles.iconWrap, styles.habitIconWrap]}>
                    <Flame size={18} color="#2E7D32" strokeWidth={2.4} />
                  </View>
                </View>

                {/* Title & Subtitle - Snug Spacing, Zero Truncation */}
                <View style={styles.cardContent}>
                  <Text style={styles.optionTitle}>Habit</Text>
                  <Text style={styles.optionSubtitle} numberOfLines={2}>
                    Rituals, streaks & momentum
                  </Text>
                </View>

                {/* Action Footer: Badge + Chevron Button */}
                <View style={styles.cardFooter}>
                  <Badge label="RITUAL" variant="green" size="sm" />
                  <View style={[styles.arrowCircle, styles.habitArrowCircle]}>
                    <ChevronRight size={12} color="#2E7D32" strokeWidth={2.4} />
                  </View>
                </View>

                {/* Signature category bottom accent bar */}
                <View style={styles.cardAccentWrap}>
                  <View
                    style={[styles.cardAccent, { backgroundColor: '#2E7D32' }]}
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
    backgroundColor: 'rgba(18, 20, 23, 0.42)',
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
    bottom: -6.5,
    alignSelf: 'center',
    width: 14,
    height: 14,
    backgroundColor: '#FAF7EF',
    transform: [{ rotate: '45deg' }],
    borderBottomRightRadius: 3,
    borderRightWidth: 1.5,
    borderBottomWidth: 1.5,
    borderColor: '#E8E2D5',
    zIndex: 1,
  },
  cardShadowWrapper: {
    borderRadius: 26,
    backgroundColor: 'transparent',
    ...Platform.select({
      ios: {
        shadowColor: '#121417',
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
    backgroundColor: '#FFFDF9',
    borderRadius: 26,
    overflow: 'hidden',
    paddingHorizontal: 12,
    paddingTop: 11,
    paddingBottom: 13,
    borderWidth: 1.5,
    borderColor: '#E8E2D5',
    borderTopWidth: 2,
    borderTopColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 9,
    paddingHorizontal: 4,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderWidth: 1,
    borderColor: '#EAE5D9',
  },
  headerRightLabel: {
    fontFamily: Fonts.poppins.bold,
    fontSize: 8.5,
    color: '#8A7B5F',
    letterSpacing: 0.7,
  },
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 7.5,
  },
  actionCard: {
    flex: 1,
    minWidth: 96,
    // height: 158,
    borderRadius: 20,
    borderTopRightRadius: 42,
    borderWidth: 1.8,
    paddingHorizontal: 8,
    paddingTop: 9.5,
    paddingBottom: 10,
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
    backgroundColor: '#EFF2FE',
    borderColor: '#D8DBFF',
    ...Platform.select({
      ios: {
        shadowColor: Colors.LavenderPurple,
      },
    }),
  },
  reminderCard: {
    backgroundColor: '#FFFCEB',
    borderColor: '#FFF5B8',
    ...Platform.select({
      ios: {
        shadowColor: Colors.AccentYellow,
      },
    }),
  },
  habitCard: {
    backgroundColor: '#EDFDF5',
    borderColor: '#C6FFDD',
    ...Platform.select({
      ios: {
        shadowColor: '#2E7D32',
      },
    }),
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  iconWrap: {
    width: 35,
    height: 35,
    borderRadius: 12,
    backgroundColor: Colors.DefaultWhite,
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
    borderColor: '#D8DBFF',
    ...Platform.select({
      ios: {
        shadowColor: Colors.LavenderPurple,
      },
    }),
  },
  reminderIconWrap: {
    borderColor: '#FFF5B8',
    ...Platform.select({
      ios: {
        shadowColor: Colors.AccentYellow,
      },
    }),
  },
  habitIconWrap: {
    borderColor: '#C6FFDD',
    ...Platform.select({
      ios: {
        shadowColor: '#2E7D32',
      },
    }),
  },
  cardContent: {
    marginBottom: 6,
  },
  optionTitle: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: 13,
    color: Colors.MidnightCharcoal,
    lineHeight: 17,
    letterSpacing: -0.2,
  },
  optionSubtitle: {
    fontFamily: Fonts.poppins.regular,
    fontSize: 9.3,
    color: Colors.MutedSteelText,
    lineHeight: 13,
    marginTop: 1.5,
    minHeight: 26,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 'auto',
    paddingBottom: 2,
  },
  arrowCircle: {
    width: 21,
    height: 21,
    borderRadius: 10.5,
    backgroundColor: Colors.DefaultWhite,
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
    borderColor: '#D8DBFF',
    ...Platform.select({
      ios: {
        shadowColor: Colors.LavenderPurple,
      },
    }),
  },
  reminderArrowCircle: {
    borderColor: '#FFF5B8',
    ...Platform.select({
      ios: {
        shadowColor: '#D97706',
      },
    }),
  },
  habitArrowCircle: {
    borderColor: '#C6FFDD',
    ...Platform.select({
      ios: {
        shadowColor: '#2E7D32',
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
    height: 3.5,
    width: 40,
    borderTopLeftRadius: 2.5,
    borderTopRightRadius: 2.5,
  },
});

export default PlusActionSheet;
