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
} from 'lucide-react-native';
import { Fonts } from '../../../Theme/fonts';
import { Typography } from '../../../Theme/Typographys';
import { Colors, withAlpha } from '../../../Assets/StyleUtilities/Colors';
import { useAppTheme } from '../../../Theme/useAppTheme';
import { Badge } from '../../../Common/Badge';
import { getCutoutCardPath } from '../../../Common/CutoutCardSvg';
import { Reminder } from '../../../Context/TaskReminderContext';

interface ReminderCardItemProps {
  reminder: Reminder;
  isChecked: boolean;
  onToggle: (id: string) => void;
  isSpeaking: boolean;
  onSpeak: (reminder: Reminder, e: any) => void;
  onEdit?: (reminder: Reminder) => void;
  onDetails?: (reminder: Reminder) => void;
}

export const ReminderCardItem: React.FC<ReminderCardItemProps> = ({
  reminder,
  isChecked,
  onToggle,
  isSpeaking,
  onSpeak,
  onEdit,
  onDetails,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const detailsScaleAnim = useRef(new Animated.Value(1)).current;
  const editScaleAnim = useRef(new Animated.Value(1)).current;
  const currentX = useRef(0);
  const isOpenRef = useRef(false);

  const ACTIONS_WIDTH = 138;
  const { isDarkMode, textPrimary, textSecondary } = useAppTheme();
  const [localChecked, setLocalChecked] = useState(isChecked);

  const initialW = Dimensions.get('window').width - 16;
  const [cardSize, setCardSize] = useState({
    width: Math.max(initialW, 200),
    height: 96,
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
          shadow: isDarkMode ? Colors.PureBlack : Colors.LavenderPurple,
          iconBg: isDarkMode ? Colors.MindfulDarkIconBg : Colors.MindfulLightBg,
          auraColor: Colors.LavenderPurple,
          Icon: Briefcase,
        };
      case 'events':
        return {
          bg: isDarkMode ? Colors.EventDarkBg : Colors.CategoryOrangeSoftBg,
          border: isDarkMode ? Colors.AccentAmber : Colors.EventLightBorder,
          accent: Colors.AccentAmber,
          shadow: isDarkMode ? Colors.PureBlack : Colors.AccentAmber,
          iconBg: isDarkMode ? Colors.EventDarkIconBgDeep : Colors.EventIconBgLight,
          auraColor: Colors.AccentAmber,
          Icon: CalendarCheck,
        };
      case 'health':
        return {
          bg: isDarkMode ? Colors.WellnessDarkBg : Colors.WellnessTintLight,
          border: isDarkMode ? Colors.GreenGracious : Colors.WellnessLightBorder,
          accent: Colors.GreenGracious,
          shadow: isDarkMode ? Colors.PureBlack : Colors.AccentGreen,
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
          shadow: isDarkMode ? Colors.PureBlack : Colors.AccentGreen,
          iconBg: isDarkMode ? Colors.WorkDarkIconBg : Colors.WellnessLightBg,
          auraColor: isDarkMode ? Colors.AccentYellow : Colors.AccentGreen,
          Icon: Bell,
        };
    }
  };

  const theme = getCategoryStyles();
  const IconComponent = theme.Icon;
  const hasFooter = !!(
    reminder.time ||
    reminder.date ||
    reminder.repeat ||
    reminder.urgentAlarm
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
              accessibilityLabel={`View details for ${reminder.title}`}
            >
              <View style={styles.actionIconAuraDetails}>
                <Flame size={14} color={Colors.AccentAmber} strokeWidth={2.6} />
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
              accessibilityLabel={`Edit ${reminder.title}`}
            >
              <View style={styles.actionIconAuraEdit}>
                <Pencil size={13.5} color={Colors.AccentYellow} strokeWidth={2.6} />
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
                : theme.shadow,
            },
          ]}
          onPress={handleCardPress}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: localChecked }}
          accessibilityLabel={reminder.title}
        >
          {/* Dynamic Cutout Notch Background SVG with Radiant Emerald Aura & Starlight Nodes */}
          <Svg
            width={cardSize.width}
            height={cardSize.height}
            style={styles.cardSvgBackground}
            pointerEvents="none"
          >
            <Defs>
              {!localChecked && (
                <RadialGradient
                  id={`reminderCardAura-${reminder.id}`}
                  cx={cardSize.width - 55}
                  cy={25}
                  r={110}
                  gradientUnits="userSpaceOnUse"
                >
                  <Stop
                    offset="0%"
                    stopColor={theme.auraColor}
                    stopOpacity={isDarkMode ? 0.28 : 0.16}
                  />
                  <Stop
                    offset="65%"
                    stopColor={theme.auraColor}
                    stopOpacity={isDarkMode ? 0.08 : 0.03}
                  />
                  <Stop offset="100%" stopColor={theme.bg} stopOpacity={0} />
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
                  : theme.bg
              }
              stroke={
                localChecked
                  ? isDarkMode
                    ? Colors.DarkBorderSubtle
                    : Colors.TimelineBorderWarm
                  : theme.border
              }
              strokeWidth={1.5}
              strokeLinejoin="round"
            />
            {!localChecked && (
              <>
                {/* Soft ambient radiance under top-right cutout */}
                <Path
                  d={getCutoutCardPath(cardSize.width, cardSize.height)}
                  fill={`url(#reminderCardAura-${reminder.id})`}
                />
                {/* Delicate starlight nodes */}
                <Circle
                  cx={cardSize.width - 66}
                  cy={16}
                  r={1.6}
                  fill={theme.accent}
                  opacity={isDarkMode ? 0.6 : 0.4}
                />
                <Circle
                  cx={cardSize.width - 80}
                  cy={30}
                  r={1.3}
                  fill={theme.accent}
                  opacity={isDarkMode ? 0.5 : 0.3}
                />
              </>
            )}
          </Svg>

          {/* Floating Checkbox in Top-Right Cutout */}
          <TouchableOpacity
            activeOpacity={0.75}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
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
                size={14}
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
                  size={18}
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
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                accessibilityRole="button"
                accessibilityLabel={
                  isSpeaking
                    ? 'Stop vocalizing reminder'
                    : 'Speak reminder aloud'
                }
              >
                {isSpeaking ? (
                  <VolumeX
                    size={15}
                    color={isDarkMode ? Colors.AccentGreen : Colors.GreenGracious}
                    strokeWidth={2.4}
                  />
                ) : (
                  <Volume2
                    size={15}
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
                {reminder.time ? (
                  <View
                    style={[
                      styles.metaTag,
                      isDarkMode && { backgroundColor: Colors.DarkCheckboxUnchecked },
                    ]}
                  >
                    <Clock
                      size={11.5}
                      color={isDarkMode ? Colors.SteelMist : Colors.MutedSlateSubtext}
                      strokeWidth={2}
                    />
                    <Text
                      style={[
                        styles.metaText,
                        isDarkMode && { color: Colors.SteelMist },
                      ]}
                    >
                      {reminder.time}
                    </Text>
                  </View>
                ) : null}

                {reminder.date ? (
                  <View
                    style={[
                      styles.metaTag,
                      isDarkMode && { backgroundColor: Colors.DarkCheckboxUnchecked },
                    ]}
                  >
                    <Calendar
                      size={11.5}
                      color={isDarkMode ? Colors.SteelMist : Colors.MutedSlateSubtext}
                      strokeWidth={2}
                    />
                    <Text
                      style={[
                        styles.metaText,
                        isDarkMode && { color: Colors.SteelMist },
                      ]}
                    >
                      {reminder.date}
                    </Text>
                  </View>
                ) : null}

                {reminder.repeat ? (
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
                      size={11}
                      color={Colors.LavenderPurple}
                      strokeWidth={2.2}
                    />
                    <Text style={styles.repeatText}>{reminder.repeat}</Text>
                  </View>
                ) : null}
              </View>

              {reminder.urgentAlarm && (
                <Badge label="URGENT" variant="red" size="sm" />
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
    borderTopColor: withAlpha(Colors.PureWhite, 0.45),
    borderLeftColor: withAlpha(Colors.PureWhite, 0.14),
    borderRightColor: withAlpha(Colors.PureWhite, 0.14),
    borderBottomWidth: 3.5,
    borderBottomColor: Colors.DarkChipBevelAbyss,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
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
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: withAlpha(Colors.AccentAmber, 0.22),
    borderWidth: 1.2,
    borderColor: withAlpha(Colors.AccentAmber, 0.48),
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
    borderTopColor: withAlpha(Colors.PureWhite, 0.45),
    borderLeftColor: withAlpha(Colors.PureWhite, 0.14),
    borderRightColor: withAlpha(Colors.PureWhite, 0.14),
    borderBottomWidth: 3.5,
    borderBottomColor: Colors.DarkChipBevelAbyss,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
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
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: withAlpha(Colors.AccentYellow, 0.22),
    borderWidth: 1.2,
    borderColor: withAlpha(Colors.AccentYellow, 0.48),
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 3,
  },
  actionBtnText: {
    fontFamily: Fonts.poppins.bold,
    fontSize: 9.5,
    color: Colors.WarmActionTextCream,
    letterSpacing: 0.75,
  },
  frontCardContainer: {
    width: '100%',
    zIndex: 2,
  },
  card: {
    backgroundColor: Colors.Transparent,
    padding: 16,
    gap: 10,
    position: 'relative',
    ...Platform.select({
      ios: {
        shadowColor: Colors.AccentGreen,
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
    gap: 12,
  },
  leftInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    flex: 1,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  iconContainerChecked: {
    backgroundColor: Colors.BadgeGreenBg,
  },
  textBlock: {
    flex: 1,
    gap: 3,
  },
  title: {
    ...Typography.bodyMediumPoppinsSemiBold,
    color: Colors.RegiusInk,
    fontSize: 15,
    lineHeight: 21,
  },
  titleCompleted: {
    color: Colors.MutedSlateSubtext,
  },
  notes: {
    ...Typography.bodySmallPoppinsRegular,
    color: Colors.MutedSlateSubtext,
    fontSize: 12,
    lineHeight: 17,
  },
  notesCompleted: {
    color: Colors.CoolMistText,
  },
  rightControls: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 34,
    marginTop: 2,
  },
  speakBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
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
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.WellnessCardTopBorder,
  },
  footerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  metaTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.CoolNeutralSurface,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  metaText: {
    fontFamily: Fonts.poppins.medium,
    fontSize: 11,
    color: Colors.MutedSlateSubtext,
  },
  repeatTag: {
    backgroundColor: Colors.MindfulLightBg,
  },
  repeatText: {
    fontFamily: Fonts.poppins.medium,
    fontSize: 11,
    color: Colors.LavenderPurple,
  },
});

export default ReminderCardItem;
