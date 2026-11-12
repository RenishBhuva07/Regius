import React, { useRef, useState, useEffect, useCallback } from 'react';
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
  Mail,
  Users,
  Check,
  Clock,
  Heart,
  Sparkles,
  Briefcase,
  Pencil,
  Flame,
} from 'lucide-react-native';
import { Fonts } from '../../../Theme/fonts';
import { Typography } from '../../../Theme/Typographys';
import { Colors, withAlpha } from '../../../Assets/StyleUtilities/Colors';
import { useAppTheme } from '../../../Theme/useAppTheme';
import { Badge } from '../../../Common/Badge';
import { getCutoutCardPath } from '../../../Common/CutoutCardSvg';
import { Task } from '../../../Context/TaskReminderContext';
import ResponsivePixels from '../../../Assets/StyleUtilities/ResponsivePixels';

interface TaskCardItemProps {
  task: Task;
  isChecked: boolean;
  onToggle: (id: string) => void;
  onEdit?: (task: Task) => void;
  onDetails?: (task: Task) => void;
}

export const TaskCardItem: React.FC<TaskCardItemProps> = ({
  task,
  isChecked,
  onToggle,
  onEdit,
  onDetails,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const detailsScaleAnim = useRef(new Animated.Value(1)).current;
  const editScaleAnim = useRef(new Animated.Value(1)).current;
  const currentX = useRef(0);
  const isOpenRef = useRef(false);

  const ACTIONS_WIDTH = ResponsivePixels.size138;
  const { isDarkMode, textPrimary, textSecondary } = useAppTheme();
  const [localChecked, setLocalChecked] = useState(isChecked);

  const initialW = Dimensions.get('window').width - ResponsivePixels.size16;
  const [cardSize, setCardSize] = useState({
    width: Math.max(initialW, ResponsivePixels.size200),
    height: ResponsivePixels.size96,
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

  useEffect(() => {
    setLocalChecked(isChecked);
  }, [isChecked]);

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

  const handlePress = () => {
    const nextChecked = !localChecked;
    setLocalChecked(nextChecked);

    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 75,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        tension: 180,
        useNativeDriver: true,
      }),
    ]).start();

    // Smooth delay allows the tactile spring and checkmark to complete before tab list changes
    setTimeout(() => {
      onToggle(task.id);
    }, 130);
  };

  const handleCardPress = () => {
    if (isOpenRef.current) {
      closeSwipe();
      return;
    }
    handlePress();
  };

  const handleDetailsPress = (e: any) => {
    e?.stopPropagation?.();
    closeSwipe();
    onDetails?.(task);
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
    onEdit?.(task);
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

  const renderIcon = () => {
    if (task.category === 'sport') {
      return (
        <Heart
          size={ResponsivePixels.size18}
          color={
            localChecked
              ? isDarkMode
                ? Colors.AccentGreen
                : Colors.GreenGracious
              : Colors.AccentGreen
          }
          strokeWidth={2.2}
        />
      );
    }
    if (task.category === 'habits') {
      return (
        <Sparkles
          size={ResponsivePixels.size18}
          color={
            localChecked
              ? isDarkMode
                ? Colors.AccentGreen
                : Colors.GreenGracious
              : Colors.LavenderPurple
          }
          strokeWidth={2.2}
        />
      );
    }
    if (task.iconType === 'mail') {
      return (
        <Mail
          size={ResponsivePixels.size18}
          color={
            localChecked
              ? isDarkMode
                ? Colors.AccentGreen
                : Colors.GreenGracious
              : isDarkMode
              ? Colors.SteelMist
              : Colors.DarkIconSlate
          }
          strokeWidth={2.2}
        />
      );
    }
    if (task.iconType === 'users') {
      return (
        <Users
          size={ResponsivePixels.size18}
          color={
            localChecked
              ? isDarkMode
                ? Colors.AccentGreen
                : Colors.GreenGracious
              : isDarkMode
              ? Colors.SteelMist
              : Colors.DarkIconSlate
          }
          strokeWidth={2.2}
        />
      );
    }
    return (
      <Briefcase
        size={ResponsivePixels.size18}
        color={
          localChecked
            ? isDarkMode
              ? Colors.AccentGreen
              : Colors.GreenGracious
            : isDarkMode
            ? Colors.AccentYellow
            : Colors.WorkTextAccent
        }
        strokeWidth={2.2}
      />
    );
  };

  const getCategoryStyles = () => {
    if (task.category === 'sport') {
      return {
        bg: isDarkMode ? Colors.WellnessDarkBg : Colors.WellnessTintLight,
        border: isDarkMode ? Colors.GreenGracious : Colors.WellnessLightBorder,
        accent: Colors.AccentGreen,
        shadow: isDarkMode ? Colors.PureBlack : Colors.AccentGreen,
        iconBg: isDarkMode ? Colors.WellnessDarkIconBg : Colors.WellnessLightBg,
        auraColor: Colors.AccentGreen,
      };
    }
    if (task.category === 'habits') {
      return {
        bg: isDarkMode ? Colors.MindfulDarkBg : Colors.MindfulTintLight,
        border: isDarkMode ? Colors.LavenderPurple : Colors.MindfulLightBorder,
        accent: Colors.LavenderPurple,
        shadow: isDarkMode ? Colors.PureBlack : Colors.LavenderPurple,
        iconBg: isDarkMode ? Colors.MindfulDarkIconBg : Colors.MindfulLightBg,
        auraColor: Colors.LavenderPurple,
      };
    }
    return {
      bg: isDarkMode ? Colors.WorkDarkBg : Colors.WorkTintCream,
      border: isDarkMode ? Colors.WorkDarkBorder : Colors.WorkLightBorder,
      accent: Colors.AccentYellow,
      shadow: isDarkMode
        ? Colors.PureBlack
        : task.priority === 'high'
        ? Colors.CrimsonPulse
        : Colors.AccentYellow,
      iconBg: isDarkMode ? Colors.WorkDarkIconBg : Colors.WorkLightBg,
      auraColor: Colors.AccentYellow,
    };
  };

  const catStyle = getCategoryStyles();
  const hasSubtasks = !!(task.subtasks && task.subtasks.length > 0);
  const hasFooter = !!(
    task.time ||
    task.priority ||
    task.voiceNudge ||
    hasSubtasks
  );

  return (
    <View style={styles.swipeContainer}>
      {/* Revealed Right Action Buttons */}
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
              accessibilityLabel={`View details for ${task.label}`}
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
              accessibilityLabel={`Edit ${task.label}`}
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
            style={[
            styles.card,
            {
              shadowColor: localChecked
                ? isDarkMode
                  ? Colors.PureBlack
                  : Colors.Gray300
                : catStyle.shadow,
            },
          ]}
          onPress={handleCardPress}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: localChecked }}
          accessibilityLabel={task.label}
        >
          {/* Dynamic Cutout Notch Background SVG with Theme Colors & Aesthetic Radiance */}
          <Svg
            width={cardSize.width}
            height={cardSize.height}
            style={styles.cardSvgBackground}
            pointerEvents="none"
          >
            <Defs>
              {!localChecked && (
                <RadialGradient
                  id={`taskCardAura-${task.id}`}
                  cx={cardSize.width - ResponsivePixels.size55}
                  cy={ResponsivePixels.size25}
                  r={ResponsivePixels.size110}
                  gradientUnits="userSpaceOnUse"
                >
                  <Stop
                    offset="0%"
                    stopColor={catStyle.auraColor}
                    stopOpacity={isDarkMode ? 0.28 : 0.16}
                  />
                  <Stop
                    offset="65%"
                    stopColor={catStyle.auraColor}
                    stopOpacity={isDarkMode ? 0.08 : 0.03}
                  />
                  <Stop offset="100%" stopColor={catStyle.bg} stopOpacity={0} />
                </RadialGradient>
              )}
            </Defs>
            <Path
              d={getCutoutCardPath(cardSize.width, cardSize.height)}
              fill={
                localChecked
                  ? isDarkMode
                    ? Colors.DarkSurfaceDeep
                    : Colors.CompletedCardCream
                  : catStyle.bg
              }
              stroke={
                localChecked
                  ? isDarkMode
                    ? Colors.CarbonSlate
                    : Colors.TimelineBorderWarm
                  : catStyle.border
              }
              strokeWidth={1.5}
              strokeLinejoin="round"
            />
            {!localChecked && (
              <>
                {/* Soft ambient radiance under top-right cutout */}
                <Path
                  d={getCutoutCardPath(cardSize.width, cardSize.height)}
                  fill={`url(#taskCardAura-${task.id})`}
                />
                {/* Delicate starlight nodes */}
                <Circle
                  cx={cardSize.width - ResponsivePixels.size66}
                  cy={ResponsivePixels.size16}
                  r={1.6}
                  fill={catStyle.accent}
                  opacity={isDarkMode ? 0.6 : 0.4}
                />
                <Circle
                  cx={cardSize.width - ResponsivePixels.size80}
                  cy={ResponsivePixels.size30}
                  r={1.3}
                  fill={catStyle.accent}
                  opacity={isDarkMode ? 0.5 : 0.3}
                />
              </>
            )}
          </Svg>

          {/* Floating Checkbox in Top-Right Cutout */}
          <TouchableOpacity
            activeOpacity={0.75}
            hitSlop={{ top: ResponsivePixels.size8, bottom: ResponsivePixels.size8, left: ResponsivePixels.size8, right: ResponsivePixels.size8 }}
            onPress={e => {
              e.stopPropagation();
              handlePress();
            }}
            style={[
              styles.floatingCheckbox,
              localChecked
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
                      borderColor: catStyle.border,
                    },
                  ],
            ]}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: localChecked }}
            accessibilityLabel={`Mark ${task.label} as ${
              localChecked ? 'incomplete' : 'complete'
            }`}
          >
            {localChecked && (
              <Check
                size={ResponsivePixels.size14}
                color={isDarkMode ? Colors.AccentGreen : Colors.GreenGracious}
                strokeWidth={3}
              />
            )}
          </TouchableOpacity>

          <View style={styles.cardHeaderRow}>
            <View style={styles.leftInfo}>
              <View
                style={[
                  styles.iconContainer,
                  localChecked
                    ? [
                        styles.iconContainerChecked,
                        isDarkMode && {
                          backgroundColor: Colors.TaskCompletedDarkBg,
                        },
                      ]
                    : {
                        backgroundColor: catStyle.iconBg,
                        borderColor: catStyle.border,
                        borderWidth: 1,
                      },
                ]}
              >
                {renderIcon()}
              </View>

              <View style={styles.textBlock}>
                <Text
                  style={[
                    styles.title,
                    { color: isDarkMode ? textPrimary : Colors.RegiusInk },
                    localChecked &&
                      (isDarkMode
                        ? { color: Colors.DarkTitleCompleted }
                        : styles.titleCompleted),
                  ]}
                  numberOfLines={2}
                >
                  {task.label}
                </Text>

                {task.note ? (
                  <Text
                    style={[
                      styles.note,
                      {
                        color: isDarkMode
                          ? textSecondary
                          : Colors.MutedSlateSubtext,
                      },
                      localChecked &&
                        (isDarkMode
                          ? { color: Colors.DarkNoteCompleted }
                          : styles.noteCompleted),
                    ]}
                    numberOfLines={2}
                  >
                    {task.note}
                  </Text>
                ) : null}
              </View>
            </View>
          </View>

          {/* Footer Badges & Metadata (time, priority, subtasks, voice nudge) */}
          {hasFooter && (
            <View
              style={[
                styles.cardFooter,
                isDarkMode && { borderTopColor: Colors.CarbonSlate },
              ]}
            >
              <View style={styles.footerLeft}>
                {task.time ? (
                  <View
                    style={[
                      styles.timeTag,
                      isDarkMode && {
                        backgroundColor: Colors.DarkCheckboxUnchecked,
                      },
                    ]}
                  >
                    <Clock
                      size={ResponsivePixels.size12}
                      color={
                        isDarkMode ? Colors.SteelMist : Colors.MutedSlateSubtext
                      }
                      strokeWidth={2}
                    />
                    <Text
                      style={[
                        styles.timeText,
                        isDarkMode && { color: Colors.SteelMist },
                      ]}
                    >
                      {task.time}
                    </Text>
                  </View>
                ) : null}

                {task.priority === 'high' && (
                  <Badge label="HIGH PRIORITY" variant="red" size="sm" />
                )}
                {task.priority === 'medium' && (
                  <Badge label="MEDIUM" variant="yellow" size="sm" />
                )}
                {task.priority === 'low' && (
                  <Badge label="LOW" variant="neutral" size="sm" />
                )}

                {hasSubtasks && (
                  <Badge
                    label={`${task.subtasks!.filter(s => s.done).length}/${
                      task.subtasks!.length
                    } SUBTASKS`}
                    variant="neutral"
                    size="sm"
                  />
                )}
              </View>

              {task.voiceNudge && (
                <Badge label="VOICE NUDGE" variant="purple" size="sm" />
              )}
            </View>
          )}
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
    top: 0,
    bottom: 0,
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
    backgroundColor: Colors.Transparent,
    padding: ResponsivePixels.size16,
    gap: ResponsivePixels.size10,
    position: 'relative',
    ...Platform.select({
      ios: {
        shadowColor: Colors.AccentYellow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
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
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingRight: ResponsivePixels.size38,
  },
  leftInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: ResponsivePixels.size12,
    flex: 1,
  },
  iconContainer: {
    width: ResponsivePixels.size36,
    height: ResponsivePixels.size36,
    borderRadius: ResponsivePixels.size18,
    backgroundColor: Colors.CoolNeutralSurface,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: ResponsivePixels.size2,
  },
  iconContainerChecked: {
    backgroundColor: Colors.BadgeGreenBg,
  },
  textBlock: {
    flex: 1,
    gap: ResponsivePixels.size3,
  },
  title: {
    ...Typography.bodyMediumPoppinsSemiBold,
    color: Colors.RegiusInk,
    fontSize: ResponsivePixels.size15,
    lineHeight: ResponsivePixels.size21,
  },
  titleCompleted: {
    color: Colors.MutedSlateSubtext,
  },
  note: {
    ...Typography.bodySmallPoppinsRegular,
    color: Colors.MutedSlateSubtext,
    fontSize: ResponsivePixels.size12,
    lineHeight: ResponsivePixels.size17,
  },
  noteCompleted: {
    color: Colors.CoolMistText,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: ResponsivePixels.size8,
    borderTopWidth: 1,
    borderTopColor: Colors.TaskDividerCream,
  },
  footerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ResponsivePixels.size8,
    flexWrap: 'wrap',
  },
  timeTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ResponsivePixels.size4,
    backgroundColor: Colors.CoolNeutralSurface,
    paddingHorizontal: ResponsivePixels.size8,
    paddingVertical: ResponsivePixels.size3,
    borderRadius: ResponsivePixels.size10,
  },
  timeText: {
    fontFamily: Fonts.poppins.medium,
    fontSize: ResponsivePixels.size11,
    color: Colors.MutedSlateSubtext,
  },
});

export default TaskCardItem;
