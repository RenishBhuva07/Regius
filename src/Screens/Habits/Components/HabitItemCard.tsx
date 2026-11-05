import React, { useRef, useState, useCallback } from 'react';
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
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const currentX = useRef(0);
  const isOpenRef = useRef(false);

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

  const handleEditPress = (e: any) => {
    e?.stopPropagation?.();
    closeSwipe();
    onEdit?.(habit);
  };

  const actionsOpacity = translateX.interpolate({
    inputRange: [-ACTIONS_WIDTH, -25, 0],
    outputRange: [1, 0.5, 0],
    extrapolate: 'clamp',
  });

  const getHabitStyles = () => {
    const baseTheme = {
      bg: '#F7F8FE',
      border: '#D8DBFF',
      accent: Colors.LavenderPurple,
      shadow: Colors.LavenderPurple,
      iconBg: '#EFF2FE',
      iconColor: '#7059C8',
      auraColor: Colors.LavenderPurple,
    };

    if (habit.category === 'morning') {
      return {
        ...baseTheme,
        label: 'MORNING',
        badgeVariant: 'yellow' as BadgeVariant,
        timePillBg: '#FFF8D0',
        timePillText: '#B47804',
        icon: Sun,
        iconBg: '#FFF8D0',
        iconColor: '#B47804',
      };
    }
    if (habit.category === 'evening') {
      return {
        ...baseTheme,
        label: 'EVENING',
        badgeVariant: 'orange' as BadgeVariant,
        timePillBg: '#FFF2E6',
        timePillText: '#D95D0F',
        icon: Moon,
        iconBg: '#FFF2E6',
        iconColor: '#D95D0F',
      };
    }
    return {
      ...baseTheme,
      label: 'MINDFUL',
      badgeVariant: 'purple' as BadgeVariant,
      timePillBg: '#EFF2FE',
      timePillText: '#7059C8',
      icon: Sparkles,
      iconBg: '#EFF2FE',
      iconColor: '#7059C8',
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
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleDetailsPress}
            style={styles.actionBtnDetails}
            accessibilityRole="button"
            accessibilityLabel={`View details for ${habit.title}`}
          >
            <View style={styles.actionIconAuraDetails}>
              <Flame size={14} color="#FF9800" strokeWidth={2.4} />
            </View>
            <Text style={styles.actionBtnText}>Details</Text>
          </TouchableOpacity>
        )}

        {onEdit && (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleEditPress}
            style={styles.actionBtnEdit}
            accessibilityRole="button"
            accessibilityLabel={`Edit ${habit.title}`}
          >
            <View style={styles.actionIconAuraEdit}>
              <Pencil size={13.5} color="#F5C518" strokeWidth={2.4} />
            </View>
            <Text style={styles.actionBtnText}>Edit</Text>
          </TouchableOpacity>
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
              shadowColor: theme.shadow,
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
                  stopOpacity={habit.completed ? 0.08 : 0.16}
                />
                <Stop
                  offset="65%"
                  stopColor={theme.auraColor}
                  stopOpacity={habit.completed ? 0.015 : 0.03}
                />
                <Stop offset="100%" stopColor={theme.bg} stopOpacity={0} />
              </RadialGradient>
            </Defs>
            <Path
              d={getCutoutCardPath(cardSize.width, cardSize.height)}
              fill={theme.bg}
              stroke={theme.border}
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
              opacity={habit.completed ? 0.25 : 0.4}
            />
            <Circle
              cx={cardSize.width - 80}
              cy={30}
              r={1.3}
              fill={theme.accent}
              opacity={habit.completed ? 0.18 : 0.3}
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
                ? styles.floatingCheckboxChecked
                : [
                    styles.floatingCheckboxUnchecked,
                    { borderColor: theme.border },
                  ],
            ]}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: habit.completed }}
            accessibilityLabel={`Mark ${habit.title} as ${
              habit.completed ? 'incomplete' : 'complete'
            }`}
          >
            {habit.completed && (
              <Check size={14} color="#1B9A72" strokeWidth={3} />
            )}
          </TouchableOpacity>

          <View style={styles.cardContent}>
            {/* Top Row: Category Badge + Time + Streak Pill + Edit Button */}
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

                {onEdit && (
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={e => {
                      e.stopPropagation();
                      if (isOpenRef.current) {
                        closeSwipe();
                      }
                      onEdit(habit);
                    }}
                    style={[styles.editBtn, { borderColor: theme.border }]}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    accessibilityRole="button"
                    accessibilityLabel={`Edit ${habit.title}`}
                  >
                    <Pencil size={11.5} color="#7A766E" strokeWidth={2.2} />
                  </TouchableOpacity>
                )}
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
                    habit.completed && styles.titleCompleted,
                  ]}
                  numberOfLines={2}
                >
                  {habit.title}
                </Text>

                <View style={styles.frequencyRow}>
                  <Repeat size={11} color="#8E8E93" />
                  <Text style={styles.frequencyText}>{habit.frequency}</Text>
                </View>
              </View>
            </View>

            {/* 7-Day Mini Consistency Dots */}
            <View style={styles.consistencyRow}>
              <Text style={styles.consistencyLabel}>Consistency</Text>
              <View style={styles.dotsWrap}>
                {[1, 2, 3, 4, 5, 6, 7].map((dot, idx) => {
                  const isCurrent = idx === 6;
                  const isDotFilled =
                    habit.completed || (habit.streak > 0 && idx < 6);

                  return (
                    <View
                      key={`dot-${habit.id}-${idx}`}
                      style={[
                        styles.miniDot,
                        isDotFilled && {
                          backgroundColor: theme.accent,
                          opacity: isCurrent && !habit.completed ? 0.4 : 0.85,
                        },
                        isCurrent && [
                          styles.miniDotCurrent,
                          !habit.completed && {
                            borderColor: theme.accent,
                            borderWidth: 1.5,
                            backgroundColor: 'transparent',
                          },
                        ],
                      ]}
                    />
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
  actionBtnDetails: {
    width: 60,
    height: '100%',
    maxHeight: 56,
    backgroundColor: Colors.NeroBlack,
    borderRadius: 16,
    borderWidth: 1.5,
    borderTopColor: '#4A4E5C',
    borderLeftColor: '#363944',
    borderRightColor: '#363944',
    borderBottomWidth: 3,
    borderBottomColor: '#090A0D',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.28,
        shadowRadius: 5,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  actionIconAuraDetails: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: 'rgba(255, 152, 0, 0.16)',
    borderWidth: 1,
    borderColor: 'rgba(255, 152, 0, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 3,
  },
  actionBtnEdit: {
    width: 60,
    height: '100%',
    maxHeight: 56,
    backgroundColor: Colors.NeroBlack,
    borderRadius: 16,
    borderWidth: 1.5,
    borderTopColor: '#4A4E5C',
    borderLeftColor: '#363944',
    borderRightColor: '#363944',
    borderBottomWidth: 3,
    borderBottomColor: '#090A0D',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.28,
        shadowRadius: 5,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  actionIconAuraEdit: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: 'rgba(245, 197, 24, 0.16)',
    borderWidth: 1,
    borderColor: 'rgba(245, 197, 24, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 3,
  },
  actionBtnText: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: 9.5,
    color: '#FFFFFF',
    letterSpacing: 0.2,
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
  editBtn: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
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
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#ECE8FB',
  },
  consistencyLabel: {
    fontFamily: Fonts.poppins.medium,
    fontSize: 10,
    color: '#A8A49C',
    letterSpacing: 0.5,
  },
  dotsWrap: {
    flexDirection: 'row',
    gap: 6,
  },
  miniDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#E5E2D9',
  },
  miniDotCurrent: {
    transform: [{ scale: 1.25 }],
  },
});

export default HabitItemCard;
