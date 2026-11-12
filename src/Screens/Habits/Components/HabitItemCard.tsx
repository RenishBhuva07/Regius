import React, { useRef, useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Platform,
  Dimensions,
  LayoutChangeEvent,
  PanResponder,
} from 'react-native';
import Svg, {
  Path,
  Defs,
  RadialGradient,
  Stop,
  Circle,
} from 'react-native-svg';
import {
  Check,
  Clock,
  Repeat,
  Sun,
  Sparkles,
  Moon,
  Pencil,
  Flame,
} from 'lucide-react-native';
import { Fonts } from '../../../Theme/fonts';
import { Colors, withAlpha } from '../../../Assets/StyleUtilities/Colors';
import { useAppTheme } from '../../../Theme/useAppTheme';
import ResponsivePixels from '../../../Assets/StyleUtilities/ResponsivePixels';
import { Badge, BadgeVariant } from '../../../Common/Badge';
import { StreakBadge } from '../../../Common/StreakBadge';
import { getCutoutCardPath } from '../../../Common/CutoutCardSvg';
import { HabitItem } from '../../../Context/TaskReminderContext';

interface HabitItemCardProps {
  habit: HabitItem;
  onToggle: (id: string) => void;
  onEdit?: (habit: HabitItem) => void;
  onDetails?: (habit: HabitItem) => void;
}

export const HabitItemCard: React.FC<HabitItemCardProps> = ({
  habit,
  onToggle,
  onEdit,
  onDetails,
}) => {
  const { isDarkMode, textPrimary } = useAppTheme();
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const detailsScaleAnim = useRef(new Animated.Value(1)).current;
  const editScaleAnim = useRef(new Animated.Value(1)).current;
  const todayFlameScale = useRef(new Animated.Value(1)).current;
  const isFirstRender = useRef(true);
  const currentX = useRef(0);
  const isOpenRef = useRef(false);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (habit.completed) {
      todayFlameScale.setValue(0.45);
      Animated.spring(todayFlameScale, {
        toValue: 1,
        tension: 320,
        friction: 5,
        useNativeDriver: true,
      }).start();
    } else {
      todayFlameScale.setValue(0.75);
      Animated.spring(todayFlameScale, {
        toValue: 1,
        tension: 240,
        friction: 7,
        useNativeDriver: true,
      }).start();
    }
  }, [habit.completed, todayFlameScale]);

  const windowDaysCompleted = Math.min(
    7,
    habit.streak + (habit.completed && habit.streak === 0 ? 1 : 0),
  );

  const ACTIONS_WIDTH = ResponsivePixels.size138;

  const initialW = Dimensions.get('window').width - ResponsivePixels.size16;
  const [cardSize, setCardSize] = useState({
    width: Math.max(initialW, ResponsivePixels.size200),
    height: ResponsivePixels.size120,
  });

  const handleCardLayout = useCallback((e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    if (width > 0 && height > 0) {
      setCardSize(prev => {
        if (
          Math.abs(prev.width - width) < 1 &&
          Math.abs(prev.height - height) < 1
        ) {
          return prev;
        }
        return { width, height };
      });
    }
  }, []);

  const closeSwipe = useCallback(() => {
    Animated.spring(translateX, {
      toValue: 0,
      friction: 8,
      tension: 60,
      useNativeDriver: true,
    }).start(() => {
      currentX.current = 0;
      isOpenRef.current = false;
    });
  }, [translateX]);

  const openSwipe = useCallback(() => {
    Animated.spring(translateX, {
      toValue: -ACTIONS_WIDTH,
      friction: 8,
      tension: 60,
      useNativeDriver: true,
    }).start(() => {
      currentX.current = -ACTIONS_WIDTH;
      isOpenRef.current = true;
    });
  }, [translateX, ACTIONS_WIDTH]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return (
          Math.abs(gestureState.dx) > 10 &&
          Math.abs(gestureState.dx) > Math.abs(gestureState.dy) * 1.5
        );
      },
      onPanResponderGrant: () => {
        translateX.stopAnimation();
      },
      onPanResponderMove: (_, gestureState) => {
        const newX = currentX.current + gestureState.dx;
        if (newX > 0) {
          translateX.setValue(0);
        } else if (newX < -ACTIONS_WIDTH - 25) {
          translateX.setValue(-ACTIONS_WIDTH - 25);
        } else {
          translateX.setValue(newX);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        const draggedTotal = currentX.current + gestureState.dx;
        if (isOpenRef.current) {
          if (gestureState.dx > 25) {
            closeSwipe();
          } else {
            openSwipe();
          }
        } else {
          if (draggedTotal < -35 || gestureState.vx < -0.35) {
            openSwipe();
          } else {
            closeSwipe();
          }
        }
      },
      onPanResponderTerminate: () => {
        if (isOpenRef.current) {
          openSwipe();
        } else {
          closeSwipe();
        }
      },
    }),
  ).current;

  const handleToggle = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.94,
        duration: 80,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        tension: 180,
        useNativeDriver: true,
      }),
    ]).start();

    onToggle(habit.id);
  };

  const handleCardPress = () => {
    if (isOpenRef.current) {
      closeSwipe();
      return;
    }
    handleToggle();
  };

  const handleDetailsPress = (e: any) => {
    e?.stopPropagation?.();
    closeSwipe();
    onDetails?.(habit);
  };

  const handlePressInDetails = useCallback(() => {
    Animated.spring(detailsScaleAnim, {
      toValue: 0.92,
      tension: 250,
      friction: 8,
      useNativeDriver: true,
    }).start();
  }, [detailsScaleAnim]);

  const handlePressOutDetails = useCallback(() => {
    Animated.spring(detailsScaleAnim, {
      toValue: 1,
      tension: 250,
      friction: 8,
      useNativeDriver: true,
    }).start();
  }, [detailsScaleAnim]);

  const handleEditPress = (e: any) => {
    e?.stopPropagation?.();
    closeSwipe();
    onEdit?.(habit);
  };

  const handlePressInEdit = useCallback(() => {
    Animated.spring(editScaleAnim, {
      toValue: 0.92,
      tension: 250,
      friction: 8,
      useNativeDriver: true,
    }).start();
  }, [editScaleAnim]);

  const handlePressOutEdit = useCallback(() => {
    Animated.spring(editScaleAnim, {
      toValue: 1,
      tension: 250,
      friction: 8,
      useNativeDriver: true,
    }).start();
  }, [editScaleAnim]);

  const actionsOpacity = translateX.interpolate({
    inputRange: [-ACTIONS_WIDTH, -25, 0],
    outputRange: [1, 0.5, 0],
    extrapolate: 'clamp',
  });

  const getHabitStyles = () => {
    const baseTheme = {
      bg: isDarkMode ? Colors.MindfulDarkBg : Colors.MindfulTintLight,
      border: isDarkMode ? Colors.LavenderPurple : Colors.MindfulLightBorder,
      accent: Colors.LavenderPurple,
      shadow: isDarkMode ? Colors.PureBlack : Colors.LavenderPurple,
      iconBg: isDarkMode ? Colors.MindfulDarkIconBg : Colors.MindfulLightBg,
      iconColor: isDarkMode ? Colors.LavenderPurple : Colors.MindfulTextAccent,
      auraColor: Colors.LavenderPurple,
    };

    if (habit.category === 'morning') {
      return {
        ...baseTheme,
        bg: isDarkMode ? Colors.WorkDarkBg : Colors.MindfulTintLight,
        border: isDarkMode ? Colors.WorkDarkBorder : Colors.MindfulLightBorder,
        shadow: isDarkMode ? Colors.PureBlack : Colors.AccentYellow,
        label: 'MORNING',
        badgeVariant: 'yellow' as BadgeVariant,
        timePillBg: isDarkMode ? Colors.HabitWorkPillDarkBg : Colors.BadgeYellowBg,
        timePillText: isDarkMode ? Colors.WorkDarkLabelGold : Colors.BadgeYellowText,
        icon: Sun,
        iconBg: isDarkMode ? Colors.WorkDarkIconBg : Colors.BadgeYellowBg,
        iconColor: isDarkMode ? Colors.AccentYellow : Colors.BadgeYellowText,
      };
    }
    if (habit.category === 'evening') {
      return {
        ...baseTheme,
        bg: isDarkMode ? Colors.EventDarkBg : Colors.MindfulTintLight,
        border: isDarkMode ? Colors.AccentAmber : Colors.MindfulLightBorder,
        shadow: isDarkMode ? Colors.PureBlack : Colors.AccentAmber,
        label: 'EVENING',
        badgeVariant: 'orange' as BadgeVariant,
        timePillBg: isDarkMode ? Colors.HabitEventPillDarkBg : Colors.EventTintSoftLight,
        timePillText: isDarkMode ? Colors.EventDarkLabelAmber : Colors.EventDeepOrangeIcon,
        icon: Moon,
        iconBg: isDarkMode ? Colors.EventDarkIconBgDeep : Colors.EventTintSoftLight,
        iconColor: isDarkMode ? Colors.AccentAmber : Colors.EventDeepOrangeIcon,
      };
    }
    return {
      ...baseTheme,
      label: 'MINDFUL',
      badgeVariant: 'purple' as BadgeVariant,
      timePillBg: isDarkMode ? Colors.HabitMindfulPillDarkBg : Colors.MindfulLightBg,
      timePillText: isDarkMode ? Colors.MindfulDarkLabelPeriwinkle : Colors.MindfulTextAccent,
      icon: Sparkles,
      iconBg: isDarkMode ? Colors.MindfulDarkIconBg : Colors.MindfulLightBg,
      iconColor: isDarkMode ? Colors.LavenderPurple : Colors.MindfulTextAccent,
    };
  };

  const theme = getHabitStyles();
  const IconComponent = theme.icon;

  return (
    <View style={styles.swipeContainer}>
      {/* Revealed Right Action Buttons strictly below top-right cutout corner */}
      <Animated.View
        style={[
          styles.actionsTray,
          {
            opacity: actionsOpacity,
          },
        ]}
        pointerEvents="box-none"
      >
        {onDetails && (
          <Animated.View
            style={[
              styles.actionBtnAnimWrap,
              {
                transform: [{ scale: detailsScaleAnim }],
              },
            ]}
          >
            <TouchableOpacity
              activeOpacity={0.85}
              onPressIn={handlePressInDetails}
              onPressOut={handlePressOutDetails}
              onPress={handleDetailsPress}
              style={styles.actionBtnDetails}
              accessibilityRole="button"
              accessibilityLabel={`View details for ${habit.title}`}
            >
              <View style={styles.actionIconAuraDetails}>
                <Flame size={ResponsivePixels.size14} color={Colors.AccentAmber} strokeWidth={2.6} />
              </View>
              <Text style={styles.actionBtnText}>DETAILS</Text>
            </TouchableOpacity>
          </Animated.View>
        )}

        {onEdit && (
          <Animated.View
            style={[
              styles.actionBtnAnimWrap,
              {
                transform: [{ scale: editScaleAnim }],
              },
            ]}
          >
            <TouchableOpacity
              activeOpacity={0.85}
              onPressIn={handlePressInEdit}
              onPressOut={handlePressOutEdit}
              onPress={handleEditPress}
              style={styles.actionBtnEdit}
              accessibilityRole="button"
              accessibilityLabel={`Edit ${habit.title}`}
            >
              <View style={styles.actionIconAuraEdit}>
                <Pencil size={ResponsivePixels.size13_5} color={Colors.AccentYellow} strokeWidth={2.6} />
              </View>
              <Text style={styles.actionBtnText}>EDIT</Text>
            </TouchableOpacity>
          </Animated.View>
        )}
      </Animated.View>

      {/* Front Card Container with PanResponder */}
      <Animated.View
        style={[
          styles.frontCardContainer,
          {
            transform: [{ translateX }, { scale: scaleAnim }],
          },
        ]}
        {...panResponder.panHandlers}
      >
        <TouchableOpacity
          activeOpacity={0.88}
          onLayout={handleCardLayout}
          onPress={handleCardPress}
          style={[
            styles.card,
            {
              shadowColor: habit.completed
                ? isDarkMode
                  ? Colors.PureBlack
                  : Colors.Gray300
                : theme.shadow,
            },
          ]}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: habit.completed }}
          accessibilityLabel={habit.title}
        >
          {/* Dynamic Cutout Notch Background SVG with Radiant Lavender Aura & Starlight Nodes */}
          <Svg
            width={cardSize.width}
            height={cardSize.height}
            style={styles.cardSvgBackground}
            pointerEvents="none"
          >
            <Defs>
              <RadialGradient
                id={`habitCardAura-${habit.id}`}
                cx={cardSize.width - ResponsivePixels.size55}
                cy={ResponsivePixels.size25}
                r={ResponsivePixels.size110}
                gradientUnits="userSpaceOnUse"
              >
                <Stop
                  offset="0%"
                  stopColor={theme.auraColor}
                  stopOpacity={
                    habit.completed
                      ? isDarkMode
                        ? 0.12
                        : 0.08
                      : isDarkMode
                      ? 0.28
                      : 0.16
                  }
                />
                <Stop
                  offset="65%"
                  stopColor={theme.auraColor}
                  stopOpacity={
                    habit.completed
                      ? isDarkMode
                        ? 0.02
                        : 0.015
                      : isDarkMode
                      ? 0.08
                      : 0.03
                  }
                />
                <Stop offset="100%" stopColor={theme.bg} stopOpacity={0} />
              </RadialGradient>
            </Defs>
            <Path
              d={getCutoutCardPath(cardSize.width, cardSize.height)}
              fill={
                habit.completed
                  ? isDarkMode
                    ? Colors.DarkSurfaceDeep
                    : Colors.CompletedCardCream
                  : theme.bg
              }
              stroke={
                habit.completed
                  ? isDarkMode
                    ? Colors.DarkBorderSubtle
                    : Colors.TimelineBorderWarm
                  : theme.border
              }
              strokeWidth={1.5}
              strokeLinejoin="round"
            />
            {/* Soft ambient radiance under top-right cutout */}
            <Path
              d={getCutoutCardPath(cardSize.width, cardSize.height)}
              fill={`url(#habitCardAura-${habit.id})`}
            />
            {/* Delicate starlight nodes */}
            <Circle
              cx={cardSize.width - ResponsivePixels.size66}
              cy={ResponsivePixels.size16}
              r={1.6}
              fill={theme.accent}
              opacity={
                habit.completed
                  ? isDarkMode
                    ? 0.35
                    : 0.25
                  : isDarkMode
                  ? 0.6
                  : 0.4
              }
            />
            <Circle
              cx={cardSize.width - ResponsivePixels.size80}
              cy={ResponsivePixels.size30}
              r={1.3}
              fill={theme.accent}
              opacity={
                habit.completed
                  ? isDarkMode
                    ? 0.25
                    : 0.18
                  : isDarkMode
                  ? 0.5
                  : 0.3
              }
            />
          </Svg>

          {/* Floating Checkbox in Top-Right Cutout */}
          <TouchableOpacity
            activeOpacity={0.75}
            hitSlop={{ top: ResponsivePixels.size8, bottom: ResponsivePixels.size8, left: ResponsivePixels.size8, right: ResponsivePixels.size8 }}
            onPress={e => {
              e.stopPropagation();
              handleToggle();
            }}
            style={[
              styles.floatingCheckbox,
              habit.completed
                ? [
                    styles.floatingCheckboxChecked,
                    isDarkMode && {
                      backgroundColor: Colors.TaskCompletedDarkBg,
                      borderColor: Colors.AccentGreen,
                    },
                  ]
                : [
                    styles.floatingCheckboxUnchecked,
                    {
                      backgroundColor: isDarkMode
                        ? Colors.DarkCheckboxUnchecked
                        : Colors.PureWhite,
                      borderColor: theme.border,
                    },
                  ],
            ]}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: habit.completed }}
            accessibilityLabel={`Mark ${habit.title} as ${
              habit.completed ? 'incomplete' : 'complete'
            }`}
          >
            {habit.completed && (
              <Check
                size={ResponsivePixels.size14}
                color={isDarkMode ? Colors.AccentGreen : Colors.GreenGracious}
                strokeWidth={3}
              />
            )}
          </TouchableOpacity>

          <View style={styles.cardContent}>
            {/* Top Row: Category Badge + Time + Streak Pill */}
            <View style={styles.topRow}>
              <View style={styles.topRowLeft}>
                <Badge
                  label={theme.label}
                  variant={theme.badgeVariant}
                  size="sm"
                />
                <View
                  style={[
                    styles.timePill,
                    { backgroundColor: theme.timePillBg },
                  ]}
                >
                  <Clock size={ResponsivePixels.size11} color={theme.timePillText} />
                  <Text
                    style={[styles.timeText, { color: theme.timePillText }]}
                  >
                    {habit.timeOfDay}
                  </Text>
                </View>
              </View>

              <View style={styles.topRowRightWithCutout}>
                <StreakBadge
                  streak={habit.streak}
                  active={habit.completed || habit.streak > 0}
                  size="sm"
                />
              </View>
            </View>

            {/* Main Content Row: Left Theme Icon + Title + Frequency */}
            <View style={styles.mainRow}>
              <View
                style={[
                  styles.iconContainer,
                  {
                    backgroundColor: theme.iconBg,
                    borderColor: theme.border,
                    borderWidth: 1,
                    opacity: habit.completed ? 0.8 : 1,
                  },
                ]}
              >
                <IconComponent
                  size={ResponsivePixels.size18}
                  color={theme.iconColor}
                  strokeWidth={2.2}
                />
              </View>

              <View style={styles.titleWrap}>
                <Text
                  style={[
                    styles.title,
                    { color: isDarkMode ? textPrimary : Colors.RegiusInk },
                    habit.completed &&
                      (isDarkMode
                        ? { color: Colors.DarkTitleCompleted }
                        : styles.titleCompleted),
                  ]}
                  numberOfLines={2}
                >
                  {habit.title}
                </Text>

                <View style={styles.frequencyRow}>
                  <Repeat
                    size={ResponsivePixels.size11}
                    color={
                      isDarkMode ? Colors.SteelMist : Colors.DisabledGrayText
                    }
                  />
                  <Text
                    style={[
                      styles.frequencyText,
                      isDarkMode && { color: Colors.SteelMist },
                    ]}
                  >
                    {habit.frequency}
                  </Text>
                </View>
              </View>
            </View>

            {/* 7-Day Consistency Streak Flow with Dynamic Micro-Animation */}
            <View
              style={styles.consistencyRow}
              accessible
              accessibilityRole="text"
              accessibilityLabel={`Consistency: ${windowDaysCompleted} of 7 days completed`}
            >
              <Text
                style={[
                  styles.consistencyLabel,
                  isDarkMode && { color: Colors.SteelMist },
                ]}
              >
                Consistency
              </Text>
              <View style={styles.streakWrap}>
                {[0, 1, 2, 3, 4, 5, 6].map(idx => {
                  const isToday = idx === 6;
                  const isFilled =
                    idx >= 7 - windowDaysCompleted &&
                    (idx < 6 ? true : habit.completed);

                  return (
                    <Animated.View
                      key={`streak-flame-${habit.id}-${idx}`}
                      style={[
                        styles.flameIconWrap,
                        isToday && {
                          transform: [{ scale: todayFlameScale }],
                        },
                      ]}
                    >
                      <Flame
                        size={ResponsivePixels.size9}
                        color={
                          isFilled
                            ? Colors.EventTextAccent
                            : isToday
                            ? Colors.AccentAmber
                            : isDarkMode
                            ? Colors.HabitCardMutedBorderDark
                            : Colors.DetailWarmBorderMuted
                        }
                        fill={isFilled ? Colors.AccentAmber : 'none'}
                        strokeWidth={isToday && !isFilled ? 1.5 : 1.2}
                      />
                    </Animated.View>
                  );
                })}
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  swipeContainer: {
    position: 'relative',
    width: '100%',
  },
  actionsTray: {
    position: 'absolute',
    right: 0,
    top: ResponsivePixels.size58,
    bottom: ResponsivePixels.size6,
    width: ResponsivePixels.size138,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: ResponsivePixels.size8,
    paddingRight: ResponsivePixels.size2,
    zIndex: 1,
  },
  actionBtnAnimWrap: {
    width: ResponsivePixels.size60,
    height: ResponsivePixels.size56,
  },
  actionBtnDetails: {
    width: ResponsivePixels.size60,
    height: ResponsivePixels.size56,
    backgroundColor: Colors.NeroBlack,
    borderRadius: ResponsivePixels.size18,
    borderWidth: 1.2,
    borderTopWidth: 1.8,
    borderTopColor: withAlpha(Colors.PureWhite, 0.45),
    borderLeftColor: withAlpha(Colors.PureWhite, 0.14),
    borderRightColor: withAlpha(Colors.PureWhite, 0.14),
    borderBottomWidth: 3.5,
    borderBottomColor: Colors.DarkChipBevelAbyss,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: ResponsivePixels.size4,
    ...Platform.select({
      ios: {
        shadowColor: Colors.AccentAmber,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.38,
        shadowRadius: 7,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  actionIconAuraDetails: {
    width: ResponsivePixels.size28,
    height: ResponsivePixels.size28,
    borderRadius: ResponsivePixels.size14,
    backgroundColor: withAlpha(Colors.AccentAmber, 0.22),
    borderWidth: 1.2,
    borderColor: withAlpha(Colors.AccentAmber, 0.48),
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: ResponsivePixels.size3,
  },
  actionBtnEdit: {
    width: ResponsivePixels.size60,
    height: ResponsivePixels.size56,
    backgroundColor: Colors.NeroBlack,
    borderRadius: ResponsivePixels.size18,
    borderWidth: 1.2,
    borderTopWidth: 1.8,
    borderTopColor: withAlpha(Colors.PureWhite, 0.45),
    borderLeftColor: withAlpha(Colors.PureWhite, 0.14),
    borderRightColor: withAlpha(Colors.PureWhite, 0.14),
    borderBottomWidth: 3.5,
    borderBottomColor: Colors.DarkChipBevelAbyss,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: ResponsivePixels.size4,
    ...Platform.select({
      ios: {
        shadowColor: Colors.AccentYellow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.38,
        shadowRadius: 7,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  actionIconAuraEdit: {
    width: ResponsivePixels.size28,
    height: ResponsivePixels.size28,
    borderRadius: ResponsivePixels.size14,
    backgroundColor: withAlpha(Colors.AccentYellow, 0.22),
    borderWidth: 1.2,
    borderColor: withAlpha(Colors.AccentYellow, 0.48),
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: ResponsivePixels.size3,
  },
  actionBtnText: {
    fontFamily: Fonts.poppins.bold,
    fontSize: ResponsivePixels.size9_5,
    color: Colors.WarmActionTextCream,
    letterSpacing: 0.75,
  },
  frontCardContainer: {
    width: '100%',
    zIndex: 2,
  },
  card: {
    position: 'relative',
    backgroundColor: Colors.Transparent,
    ...Platform.select({
      ios: {
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
    marginHorizontal: 0,
  },
  cardSvgBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  floatingCheckbox: {
    position: 'absolute',
    top: ResponsivePixels.size9,
    right: ResponsivePixels.size9,
    width: ResponsivePixels.size26,
    height: ResponsivePixels.size26,
    borderRadius: ResponsivePixels.size13,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    ...Platform.select({
      ios: {
        shadowColor: Colors.PureBlack,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.12,
        shadowRadius: 3,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  floatingCheckboxChecked: {
    backgroundColor: Colors.BadgeGreenBg,
    borderColor: Colors.AccentGreen,
  },
  floatingCheckboxUnchecked: {
    backgroundColor: Colors.PureWhite,
    borderColor: Colors.WarmCheckboxBorder,
  },
  cardContent: {
    padding: ResponsivePixels.size16,
    gap: ResponsivePixels.size12,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  topRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ResponsivePixels.size8,
  },
  timePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ResponsivePixels.size4,
    paddingHorizontal: ResponsivePixels.size8,
    paddingVertical: ResponsivePixels.size3_5,
    borderRadius: ResponsivePixels.size10,
  },
  timeText: {
    fontFamily: Fonts.poppins.medium,
    fontSize: ResponsivePixels.size11,
  },
  topRowRightWithCutout: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ResponsivePixels.size6,
    marginRight: ResponsivePixels.size36, // Clears the floating checkbox in the top-right cutout
  },
  mainRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ResponsivePixels.size12,
  },
  iconContainer: {
    width: ResponsivePixels.size36,
    height: ResponsivePixels.size36,
    borderRadius: ResponsivePixels.size18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainerCompleted: {
    backgroundColor: Colors.BadgeGreenBg,
    borderColor: Colors.WellnessLightBorder,
    borderWidth: 1,
  },
  titleWrap: {
    flex: 1,
    gap: ResponsivePixels.size2,
    paddingRight: ResponsivePixels.size10,
  },
  title: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: ResponsivePixels.size14_5,
    color: Colors.RegiusInk,
    lineHeight: ResponsivePixels.size20,
  },
  titleCompleted: {
    color: Colors.MutedSlateSubtext,
  },
  frequencyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ResponsivePixels.size4,
  },
  frequencyText: {
    fontFamily: Fonts.poppins.regular,
    fontSize: ResponsivePixels.size11,
    color: Colors.DisabledGrayText,
  },
  consistencyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: ResponsivePixels.size7,
    borderTopWidth: 1,
    borderTopColor: Colors.MindfulDetailBorder,
  },
  consistencyLabel: {
    fontFamily: Fonts.poppins.medium,
    fontSize: ResponsivePixels.size10,
    color: Colors.WarmStoneLightText,
    letterSpacing: 0.5,
  },
  streakWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ResponsivePixels.size5,
  },
  flameIconWrap: {
    width: ResponsivePixels.size11,
    height: ResponsivePixels.size11,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default HabitItemCard;
