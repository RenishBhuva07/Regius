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
} from 'react-native-svg';
import {
  Bell,
  Clock,
  Calendar,
  RotateCw,
  Check,
  Volume2,
  VolumeX,
  Heart,
  Briefcase,
  CalendarCheck,
  Pencil,
  Flame,
  Trash2,
  AlertTriangle,
} from 'lucide-react-native';
import { Fonts } from '../../../Theme/fonts';
import { Typography } from '../../../Theme/Typographys';
import { Colors, withAlpha } from '../../../Assets/StyleUtilities/Colors';
import { useAppTheme } from '../../../Theme/useAppTheme';
import { Badge } from '../../../Common/Badge';
import { getCutoutCardPath } from '../../../Common/CutoutCardSvg';
import { Reminder } from '../../../Context/ReminderContext';
import {
  format24hTo12h,
  formatTimeUntil,
  getReminderScheduledDateTime,
  isReminderOverdue,
} from '../../../Utils/reminderDateUtils';
import { formatDisplayDate } from '../../../Utils/taskDateUtils';
import ResponsivePixels from '../../../Assets/StyleUtilities/ResponsivePixels';

interface ReminderCardItemProps {
  reminder: Reminder;
  isChecked: boolean;
  onToggle: (id: string) => void;
  isSpeaking: boolean;
  onSpeak: (reminder: Reminder, e: any) => void;
  onEdit?: (reminder: Reminder) => void;
  onDetails?: (reminder: Reminder) => void;
  onDelete?: (reminder: Reminder) => void;
  onLongPress?: (reminder: Reminder) => void;
}

export const ReminderCardItem: React.FC<ReminderCardItemProps> = ({
  reminder,
  isChecked,
  onToggle,
  isSpeaking,
  onSpeak,
  onEdit,
  onDetails,
  onDelete,
  onLongPress,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const detailsScaleAnim = useRef(new Animated.Value(1)).current;
  const editScaleAnim = useRef(new Animated.Value(1)).current;
  const deleteScaleAnim = useRef(new Animated.Value(1)).current;
  const currentX = useRef(0);
  const isOpenRef = useRef(false);

  const ACTIONS_WIDTH = onDelete
    ? ResponsivePixels.size200
    : ResponsivePixels.size138;
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

    setTimeout(() => {
      onToggle(reminder.id);
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
    onDetails?.(reminder);
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
    onEdit?.(reminder);
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

  const handleDeletePress = (e: any) => {
    e?.stopPropagation?.();
    closeSwipe();
    onDelete?.(reminder);
  };

  const handlePressInDelete = useCallback(() => {
    Animated.spring(deleteScaleAnim, {
      toValue: 0.92,
      tension: 250,
      friction: 8,
      useNativeDriver: true,
    }).start();
  }, [deleteScaleAnim]);

  const handlePressOutDelete = useCallback(() => {
    Animated.spring(deleteScaleAnim, {
      toValue: 1,
      tension: 250,
      friction: 8,
      useNativeDriver: true,
    }).start();
  }, [deleteScaleAnim]);

  const actionsOpacity = translateX.interpolate({
    inputRange: [-ACTIONS_WIDTH, -25, 0],
    outputRange: [1, 0.5, 0],
    extrapolate: 'clamp',
  });

  const getCategoryStyles = () => {
    switch (reminder.category) {
      case 'work':
        return {
          bg: isDarkMode ? Colors.MindfulDarkBg : Colors.MindfulTintLight,
          border: isDarkMode ? Colors.LavenderPurple : Colors.MindfulLightBorder,
          accent: Colors.LavenderPurple,
          shadow: Colors.PureBlack,
          iconBg: isDarkMode ? Colors.MindfulDarkIconBg : Colors.MindfulLightBg,
          auraColor: Colors.LavenderPurple,
          Icon: Briefcase,
        };
      case 'events':
        return {
          bg: isDarkMode ? Colors.EventDarkBg : Colors.CategoryOrangeSoftBg,
          border: isDarkMode ? Colors.AccentAmber : Colors.EventLightBorder,
          accent: Colors.AccentAmber,
          shadow: Colors.PureBlack,
          iconBg: isDarkMode ? Colors.EventDarkIconBgDeep : Colors.EventIconBgLight,
          auraColor: Colors.AccentAmber,
          Icon: CalendarCheck,
        };
      case 'health':
        return {
          bg: isDarkMode ? Colors.WellnessDarkBg : Colors.WellnessTintLight,
          border: isDarkMode ? Colors.GreenGracious : Colors.WellnessLightBorder,
          accent: Colors.GreenGracious,
          shadow: Colors.PureBlack,
          iconBg: isDarkMode ? Colors.WellnessDarkIconBg : Colors.WellnessLightBg,
          auraColor: Colors.AccentGreen,
          Icon: Heart,
        };
      case 'daily':
      default:
        return {
          bg: isDarkMode ? Colors.WorkDarkBg : Colors.WellnessTintLight,
          border: isDarkMode ? Colors.WorkDarkBorder : Colors.WellnessLightBorder,
          accent: isDarkMode ? Colors.AccentYellow : Colors.GreenGracious,
          shadow: Colors.PureBlack,
          iconBg: isDarkMode ? Colors.WorkDarkIconBg : Colors.WellnessLightBg,
          auraColor: isDarkMode ? Colors.AccentYellow : Colors.AccentGreen,
          Icon: Bell,
        };
    }
  };

  const theme = getCategoryStyles();
  const IconComponent = theme.Icon;
  const overdue = !localChecked && isReminderOverdue(reminder);
  const isSnoozed = !localChecked && !!reminder.snoozedUntil;
  const displayTime = reminder.scheduledTime
    ? format24hTo12h(reminder.scheduledTime)
    : reminder.time;
  const displayDate = reminder.scheduledDate
    ? formatDisplayDate(reminder.scheduledDate)
    : reminder.date;
  const scheduledDt = getReminderScheduledDateTime(reminder);
  const snoozeText =
    isSnoozed && scheduledDt ? `Snoozed (${formatTimeUntil(scheduledDt)})` : null;
  const hasFooter = !!(
    displayTime ||
    displayDate ||
    reminder.repeat ||
    reminder.urgentAlarm ||
    overdue ||
    isSnoozed
  );

  return (
    <View style={styles.swipeContainer}>
      {/* Revealed Right Action Buttons */}
      <Animated.View
        style={[
          styles.actionsTray,
          { width: ACTIONS_WIDTH },
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
              accessibilityLabel={`View details for ${reminder.title}`}
            >
              <View style={styles.actionIconAuraDetails}>
                <Flame size={ResponsivePixels.size14} color={Colors.AccentAmber} strokeWidth={2.6} />
              </View>
              <Text style={styles.actionBtnText}>Details</Text>
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
              accessibilityLabel={`Edit ${reminder.title}`}
            >
              <View style={styles.actionIconAuraEdit}>
                <Pencil size={ResponsivePixels.size13_5} color={Colors.AccentYellow} strokeWidth={2.6} />
              </View>
              <Text style={styles.actionBtnText}>Edit</Text>
            </TouchableOpacity>
          </Animated.View>
        )}

        {onDelete && (
          <Animated.View
            style={[
              styles.actionBtnAnimWrap,
              {
                transform: [{ scale: deleteScaleAnim }],
              },
            ]}
          >
            <TouchableOpacity
              activeOpacity={0.85}
              onPressIn={handlePressInDelete}
              onPressOut={handlePressOutDelete}
              onPress={handleDeletePress}
              style={styles.actionBtnDelete}
              accessibilityRole="button"
              accessibilityLabel={`Delete ${reminder.title}`}
            >
              <View style={styles.actionIconAuraDelete}>
                <Trash2 size={ResponsivePixels.size13_5} color={Colors.CategoryRedAccent} strokeWidth={2.6} />
              </View>
              <Text style={styles.actionBtnText}>Delete</Text>
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
                : theme.shadow,
            },
          ]}
          onPress={handleCardPress}
          onLongPress={() => onLongPress?.(reminder)}
          delayLongPress={350}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: localChecked }}
          accessibilityLabel={reminder.title}
        >
          {/* Dynamic Cutout Notch Background SVG */}
          <Svg
            width={cardSize.width}
            height={cardSize.height}
            style={styles.cardSvgBackground}
            pointerEvents="none"
          >
            <Path
              d={getCutoutCardPath(cardSize.width, cardSize.height)}
              fill={
                localChecked
                  ? isDarkMode
                    ? Colors.DarkSurfaceDeep
                    : Colors.CompletedCardCream
                  : overdue
                  ? isDarkMode
                    ? Colors.EventDarkBg
                    : Colors.CategoryOrangeSoftBg
                  : isSnoozed
                  ? isDarkMode
                    ? Colors.MindfulDarkBg
                    : Colors.MindfulTintLight
                  : theme.bg
              }
              stroke={
                localChecked
                  ? isDarkMode
                    ? Colors.DarkBorderSubtle
                    : Colors.TimelineBorderWarm
                  : overdue
                  ? Colors.AccentAmber
                  : isSnoozed
                  ? Colors.LavenderPurple
                  : theme.border
              }
              strokeWidth={1.5}
              strokeLinejoin="round"
            />
          </Svg>

          {overdue && <View style={styles.overdueStripe} />}

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
                      borderColor: theme.border,
                    },
                  ],
            ]}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: localChecked }}
            accessibilityLabel={`Mark ${reminder.title} as ${
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
                        isDarkMode && { backgroundColor: Colors.TaskCompletedDarkBg },
                      ]
                    : {
                        backgroundColor: theme.iconBg,
                        borderColor: theme.border,
                        borderWidth: 1,
                      },
                ]}
              >
                <IconComponent
                  size={ResponsivePixels.size18}
                  color={
                    localChecked
                      ? isDarkMode
                        ? Colors.AccentGreen
                        : Colors.GreenGracious
                      : theme.accent
                  }
                  strokeWidth={2.2}
                />
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
                  {reminder.title}
                </Text>

                {reminder.notes ? (
                  <Text
                    style={[
                      styles.notes,
                      { color: isDarkMode ? textSecondary : Colors.MutedSlateSubtext },
                      localChecked &&
                        (isDarkMode
                          ? { color: Colors.DarkNoteCompleted }
                          : styles.notesCompleted),
                    ]}
                    numberOfLines={2}
                  >
                    {reminder.notes}
                  </Text>
                ) : null}
              </View>
            </View>

            {/* Right Header Controls: Kokoro TTS Audio */}
            <View style={styles.rightControls}>
              <TouchableOpacity
                activeOpacity={0.7}
                style={[
                  styles.speakBtn,
                  { borderColor: theme.border },
                  isDarkMode && { backgroundColor: Colors.DarkCardBackground },
                  isSpeaking && styles.speakBtnActive,
                ]}
                onPress={e => onSpeak(reminder, e)}
                hitSlop={{ top: ResponsivePixels.size8, bottom: ResponsivePixels.size8, left: ResponsivePixels.size8, right: ResponsivePixels.size8 }}
                accessibilityRole="button"
                accessibilityLabel={
                  isSpeaking
                    ? 'Stop vocalizing reminder'
                    : 'Speak reminder aloud'
                }
              >
                {isSpeaking ? (
                  <VolumeX
                    size={ResponsivePixels.size15}
                    color={isDarkMode ? Colors.AccentGreen : Colors.GreenGracious}
                    strokeWidth={2.4}
                  />
                ) : (
                  <Volume2
                    size={ResponsivePixels.size15}
                    color={isDarkMode ? Colors.SteelMist : Colors.MutedSlateSubtext}
                    strokeWidth={2.2}
                  />
                )}
              </TouchableOpacity>
            </View>
          </View>

          {/* Footer Badges & Metadata (time, date, repeat, urgent) */}
          {hasFooter && (
            <View
              style={[
                styles.cardFooter,
                isDarkMode && { borderTopColor: Colors.DarkBorderSubtle },
              ]}
            >
              <View style={styles.footerLeft}>
                {displayTime ? (
                  <View
                    style={[
                      styles.metaTag,
                      isDarkMode && { backgroundColor: Colors.DarkCheckboxUnchecked },
                      overdue && styles.overdueTag,
                    ]}
                  >
                    {overdue ? (
                      <AlertTriangle
                        size={ResponsivePixels.size11_5}
                        color={Colors.AccentAmber}
                        strokeWidth={2.2}
                      />
                    ) : (
                      <Clock
                        size={ResponsivePixels.size11_5}
                        color={isDarkMode ? Colors.SteelMist : Colors.MutedSlateSubtext}
                        strokeWidth={2}
                      />
                    )}
                    <Text
                      style={[
                        styles.metaText,
                        isDarkMode && { color: Colors.SteelMist },
                        overdue && { color: Colors.AccentAmber },
                      ]}
                    >
                      {displayTime}
                    </Text>
                  </View>
                ) : null}

                {displayDate ? (
                  <View
                    style={[
                      styles.metaTag,
                      isDarkMode && { backgroundColor: Colors.DarkCheckboxUnchecked },
                    ]}
                  >
                    <Calendar
                      size={ResponsivePixels.size11_5}
                      color={isDarkMode ? Colors.SteelMist : Colors.MutedSlateSubtext}
                      strokeWidth={2}
                    />
                    <Text
                      style={[
                        styles.metaText,
                        isDarkMode && { color: Colors.SteelMist },
                      ]}
                    >
                      {displayDate}
                    </Text>
                  </View>
                ) : null}

                {snoozeText ? (
                  <Badge label={snoozeText} variant="purple" size="sm" />
                ) : null}

                {reminder.repeat && reminder.repeat !== 'Once' ? (
                  <View
                    style={[
                      styles.metaTag,
                      styles.repeatTag,
                      isDarkMode && {
                        backgroundColor: Colors.MindfulTimePillDarkBg,
                        borderColor: Colors.MindfulTimePillDarkBorder,
                      },
                    ]}
                  >
                    <RotateCw
                      size={ResponsivePixels.size11}
                      color={Colors.LavenderPurple}
                      strokeWidth={2.2}
                    />
                    <Text style={styles.repeatText}>{reminder.repeat}</Text>
                  </View>
                ) : null}
              </View>

              {reminder.urgentAlarm ? (
                <Badge label="URGENT" variant="red" size="sm" />
              ) : overdue ? (
                <Badge label="OVERDUE" variant="orange" size="sm" />
              ) : null}
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
  actionBtnDelete: {
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
        shadowColor: Colors.CategoryRedAccent,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.38,
        shadowRadius: 7,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  actionIconAuraDelete: {
    width: ResponsivePixels.size28,
    height: ResponsivePixels.size28,
    borderRadius: ResponsivePixels.size14,
    backgroundColor: withAlpha(Colors.CategoryRedAccent, 0.22),
    borderWidth: 1.2,
    borderColor: withAlpha(Colors.CategoryRedAccent, 0.48),
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: ResponsivePixels.size3,
  },
  overdueStripe: {
    position: 'absolute',
    left: 0,
    top: ResponsivePixels.size14,
    bottom: ResponsivePixels.size14,
    width: ResponsivePixels.size3,
    borderRadius: ResponsivePixels.size2,
    backgroundColor: Colors.AccentAmber,
  },
  overdueTag: {
    backgroundColor: withAlpha(Colors.AccentAmber, 0.14),
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
        shadowColor: Colors.PureBlack,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
      },
      android: {
        elevation: 2,
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
    justifyContent: 'space-between',
    gap: ResponsivePixels.size12,
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
  notes: {
    ...Typography.bodySmallPoppinsRegular,
    color: Colors.MutedSlateSubtext,
    fontSize: ResponsivePixels.size12,
    lineHeight: ResponsivePixels.size17,
  },
  notesCompleted: {
    color: Colors.CoolMistText,
  },
  rightControls: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: ResponsivePixels.size34,
    marginTop: ResponsivePixels.size2,
  },
  speakBtn: {
    width: ResponsivePixels.size28,
    height: ResponsivePixels.size28,
    borderRadius: ResponsivePixels.size14,
    backgroundColor: Colors.WellnessLightBg,
    borderWidth: 1,
    borderColor: Colors.WellnessLightBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  speakBtnActive: {
    backgroundColor: Colors.WellnessLightBorder,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: ResponsivePixels.size8,
    borderTopWidth: 1,
    borderTopColor: Colors.WellnessCardTopBorder,
  },
  footerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ResponsivePixels.size8,
    flexWrap: 'wrap',
  },
  metaTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ResponsivePixels.size4,
    backgroundColor: Colors.CoolNeutralSurface,
    paddingHorizontal: ResponsivePixels.size8,
    paddingVertical: ResponsivePixels.size3,
    borderRadius: ResponsivePixels.size10,
  },
  metaText: {
    fontFamily: Fonts.poppins.medium,
    fontSize: ResponsivePixels.size11,
    color: Colors.MutedSlateSubtext,
    fontVariant: ['tabular-nums'],
  },
  repeatTag: {
    backgroundColor: Colors.MindfulLightBg,
  },
  repeatText: {
    fontFamily: Fonts.poppins.medium,
    fontSize: ResponsivePixels.size11,
    color: Colors.LavenderPurple,
  },
});

export default ReminderCardItem;
