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
import { Colors } from '../../../Assets/StyleUtilities/Colors';
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

interface CategoryConfig {
  label: string;
  badgeVariant: BadgeVariant;
  accentColor: string;
  activeBorder: string;
  checkboxBorder: string;
  timePillBg: string;
  timePillText: string;
  completedBg: string;
  completedBorder: string;
  icon: React.ComponentType<any>;
}

export const HabitItemCard: React.FC<HabitItemCardProps> = ({
  habit,
  onToggle,
  onEdit,
  onDetails,
}) => {
  const { isDarkMode, textPrimary, textSecondary } = useAppTheme();
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

  const ACTIONS_WIDTH = 138;

  const initialW = Dimensions.get('window').width - 16;
  const [cardSize, setCardSize] = useState({
    width: Math.max(initialW, 200),
    height: 120,
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
      bg: isDarkMode ? '#202336' : '#F7F8FE',
      border: isDarkMode ? '#8383D6' : '#D8DBFF',
      accent: Colors.LavenderPurple,
      shadow: Colors.LavenderPurple,
      iconBg: isDarkMode ? '#2C304A' : '#EFF2FE',
      iconColor: isDarkMode ? '#8383D6' : '#7059C8',
      auraColor: Colors.LavenderPurple,
    };

    if (habit.category === 'morning') {
      return {
        ...baseTheme,
        bg: isDarkMode ? '#2A2416' : '#F7F8FE',
        border: isDarkMode ? '#DEAA14' : '#D8DBFF',
        shadow: isDarkMode ? '#F5C518' : Colors.LavenderPurple,
        label: 'MORNING',
        badgeVariant: 'yellow' as BadgeVariant,
        timePillBg: isDarkMode ? '#3D3420' : '#FFF8D0',
        timePillText: isDarkMode ? '#FFE600' : '#B47804',
        icon: Sun,
        iconBg: isDarkMode ? '#38301D' : '#FFF8D0',
        iconColor: isDarkMode ? '#F5C518' : '#B47804',
      };
    }
    if (habit.category === 'evening') {
      return {
        ...baseTheme,
        bg: isDarkMode ? '#331F18' : '#F7F8FE',
        border: isDarkMode ? '#FF9800' : '#D8DBFF',
        shadow: isDarkMode ? '#FF9800' : Colors.LavenderPurple,
        label: 'EVENING',
        badgeVariant: 'orange' as BadgeVariant,
        timePillBg: isDarkMode ? '#4A2B1E' : '#FFF2E6',
        timePillText: isDarkMode ? '#FFB74D' : '#D95D0F',
        icon: Moon,
        iconBg: isDarkMode ? '#452A20' : '#FFF2E6',
        iconColor: isDarkMode ? '#FF9800' : '#D95D0F',
      };
    }
    return {
      ...baseTheme,
      label: 'MINDFUL',
      badgeVariant: 'purple' as BadgeVariant,
      timePillBg: isDarkMode ? '#2D3250' : '#EFF2FE',
      timePillText: isDarkMode ? '#C2C2FF' : '#7059C8',
      icon: Sparkles,
      iconBg: isDarkMode ? '#2C304A' : '#EFF2FE',
      iconColor: isDarkMode ? '#8383D6' : '#7059C8',
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
                <Flame size={14} color="#FF9800" strokeWidth={2.6} />
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
                <Pencil size={13.5} color="#F5C518" strokeWidth={2.6} />
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
                  ? '#000000'
                  : '#D1D5DB'
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
                cx={cardSize.width - 55}
                cy={25}
                r={110}
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
                    ? '#171A20'
                    : '#FAFAF8'
                  : theme.bg
              }
              stroke={
                habit.completed
                  ? isDarkMode
                    ? '#2C3035'
                    : '#ECEAE4'
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
              cx={cardSize.width - 66}
              cy={16}
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
              cx={cardSize.width - 80}
              cy={30}
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
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
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
                      backgroundColor: '#13281E',
                      borderColor: '#52D22E',
                    },
                  ]
                : [
                    styles.floatingCheckboxUnchecked,
                    {
                      backgroundColor: isDarkMode ? '#252932' : '#FFFFFF',
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
                size={14}
                color={isDarkMode ? '#52D22E' : '#1B9A72'}
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
                  <Clock size={11} color={theme.timePillText} />
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
                  size={18}
                  color={theme.iconColor}
                  strokeWidth={2.2}
                />
              </View>

              <View style={styles.titleWrap}>
                <Text
                  style={[
                    styles.title,
                    { color: isDarkMode ? textPrimary : '#1B1C19' },
                    habit.completed && (isDarkMode ? { color: '#5C6270' } : styles.titleCompleted),
                  ]}
                  numberOfLines={2}
                >
                  {habit.title}
                </Text>

                <View style={styles.frequencyRow}>
                  <Repeat
                    size={11}
                    color={isDarkMode ? '#A3A8B1' : '#8E8E93'}
                  />
                  <Text
                    style={[
                      styles.frequencyText,
                      isDarkMode && { color: '#A3A8B1' },
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
                  isDarkMode && { color: '#A3A8B1' },
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
                            ? '#E65100'
                            : isToday
                            ? '#FF9800'
                            : isDarkMode
                            ? '#3A3F4D'
                            : '#C8C4B7'
                        }
                        fill={isFilled ? '#FF9800' : 'none'}
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
    top: 58,
    bottom: 6,
    width: 138,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 8,
    paddingRight: 2,
    zIndex: 1,
  },
  actionBtnAnimWrap: {
    width: 60,
    height: 56,
  },
  actionBtnDetails: {
    width: 60,
    height: 56,
    backgroundColor: Colors.NeroBlack,
    borderRadius: 18,
    borderWidth: 1.2,
    borderTopWidth: 1.8,
    borderTopColor: 'rgba(255, 255, 255, 0.45)',
    borderLeftColor: 'rgba(255, 255, 255, 0.14)',
    borderRightColor: 'rgba(255, 255, 255, 0.14)',
    borderBottomWidth: 3.5,
    borderBottomColor: '#0A0B0E',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    ...Platform.select({
      ios: {
        shadowColor: '#FF9800',
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
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 152, 0, 0.22)',
    borderWidth: 1.2,
    borderColor: 'rgba(255, 152, 0, 0.48)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 3,
  },
  actionBtnEdit: {
    width: 60,
    height: 56,
    backgroundColor: Colors.NeroBlack,
    borderRadius: 18,
    borderWidth: 1.2,
    borderTopWidth: 1.8,
    borderTopColor: 'rgba(255, 255, 255, 0.45)',
    borderLeftColor: 'rgba(255, 255, 255, 0.14)',
    borderRightColor: 'rgba(255, 255, 255, 0.14)',
    borderBottomWidth: 3.5,
    borderBottomColor: '#0A0B0E',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    ...Platform.select({
      ios: {
        shadowColor: '#F5C518',
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
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(245, 197, 24, 0.22)',
    borderWidth: 1.2,
    borderColor: 'rgba(245, 197, 24, 0.48)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 3,
  },
  actionBtnText: {
    fontFamily: Fonts.poppins.bold,
    fontSize: 9.5,
    color: '#FFFBF0',
    letterSpacing: 0.75,
  },
  frontCardContainer: {
    width: '100%',
    zIndex: 2,
  },
  card: {
    position: 'relative',
    backgroundColor: 'transparent',
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
    top: 9,
    right: 9,
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
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
    backgroundColor: '#E8FDF0',
    borderColor: '#52D22E',
  },
  floatingCheckboxUnchecked: {
    backgroundColor: '#FFFFFF',
    borderColor: '#ECE8DF',
  },
  cardContent: {
    padding: 16,
    gap: 12,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  topRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  timePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3.5,
    borderRadius: 10,
  },
  timeText: {
    fontFamily: Fonts.poppins.medium,
    fontSize: 11,
  },
  topRowRightWithCutout: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginRight: 36, // Clears the floating checkbox in the top-right cutout
  },
  mainRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainerCompleted: {
    backgroundColor: '#E8FDF0',
    borderColor: '#C6FFDD',
    borderWidth: 1,
  },
  titleWrap: {
    flex: 1,
    gap: 2,
    paddingRight: 10,
  },
  title: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: 14.5,
    color: '#1B1C19',
    lineHeight: 20,
  },
  titleCompleted: {
    color: '#7E838F',
  },
  frequencyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  frequencyText: {
    fontFamily: Fonts.poppins.regular,
    fontSize: 11,
    color: '#8E8E93',
  },
  consistencyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: ResponsivePixels.size7,
    borderTopWidth: 1,
    borderTopColor: '#ECE8FB',
  },
  consistencyLabel: {
    fontFamily: Fonts.poppins.medium,
    fontSize: ResponsivePixels.size10,
    color: '#A8A49C',
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
