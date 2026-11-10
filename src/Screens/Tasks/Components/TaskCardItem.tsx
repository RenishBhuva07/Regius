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
import { Colors } from '../../../Assets/StyleUtilities/Colors';
import { useAppTheme } from '../../../Theme/useAppTheme';
import { Badge } from '../../../Common/Badge';
import { getCutoutCardPath } from '../../../Common/CutoutCardSvg';
import { Task } from '../../../Context/TaskReminderContext';

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
          size={18}
          color={localChecked ? (isDarkMode ? '#52D22E' : '#1B9A72') : '#52D22E'}
          strokeWidth={2.2}
        />
      );
    }
    if (task.category === 'habits') {
      return (
        <Sparkles
          size={18}
          color={localChecked ? (isDarkMode ? '#52D22E' : '#1B9A72') : '#8383D6'}
          strokeWidth={2.2}
        />
      );
    }
    if (task.iconType === 'mail') {
      return (
        <Mail
          size={18}
          color={localChecked ? (isDarkMode ? '#52D22E' : '#1B9A72') : (isDarkMode ? '#A3A8B1' : '#454A53')}
          strokeWidth={2.2}
        />
      );
    }
    if (task.iconType === 'users') {
      return (
        <Users
          size={18}
          color={localChecked ? (isDarkMode ? '#52D22E' : '#1B9A72') : (isDarkMode ? '#A3A8B1' : '#454A53')}
          strokeWidth={2.2}
        />
      );
    }
    return (
      <Briefcase
        size={18}
        color={localChecked ? (isDarkMode ? '#52D22E' : '#1B9A72') : (isDarkMode ? '#F5C518' : '#B48216')}
        strokeWidth={2.2}
      />
    );
  };

  const getCategoryStyles = () => {
    if (task.category === 'sport') {
      return {
        bg: isDarkMode ? '#162820' : '#F5FDF9',
        border: isDarkMode ? '#1B9A72' : '#C6FFDD',
        accent: '#52D22E',
        shadow: isDarkMode ? '#000000' : '#52D22E',
        iconBg: isDarkMode ? '#1F382D' : '#EDFDF5',
        auraColor: '#52D22E',
      };
    }
    if (task.category === 'habits') {
      return {
        bg: isDarkMode ? '#202336' : '#F7F8FE',
        border: isDarkMode ? '#8383D6' : '#D8DBFF',
        accent: '#8383D6',
        shadow: isDarkMode ? '#000000' : '#8383D6',
        iconBg: isDarkMode ? '#2C304A' : '#EFF2FE',
        auraColor: '#8383D6',
      };
    }
    return {
      bg: isDarkMode ? '#2A2416' : '#FFFDF7',
      border: isDarkMode ? '#DEAA14' : '#FFF5B8',
      accent: '#F5C518',
      shadow: isDarkMode
        ? '#000000'
        : task.priority === 'high'
        ? '#FF3B30'
        : '#F5C518',
      iconBg: isDarkMode ? '#38301D' : '#FFFCEB',
      auraColor: '#F5C518',
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
              accessibilityLabel={`Edit ${task.label}`}
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
          style={[
            styles.card,
            {
              shadowColor: localChecked
                ? (isDarkMode ? '#000000' : '#D1D5DB')
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
                  cx={cardSize.width - 55}
                  cy={25}
                  r={110}
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
              fill={localChecked ? (isDarkMode ? '#171A20' : '#FAFAF8') : catStyle.bg}
              stroke={localChecked ? (isDarkMode ? '#2C3035' : '#ECEAE4') : catStyle.border}
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
                  cx={cardSize.width - 66}
                  cy={16}
                  r={1.6}
                  fill={catStyle.accent}
                  opacity={isDarkMode ? 0.6 : 0.4}
                />
                <Circle
                  cx={cardSize.width - 80}
                  cy={30}
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
                    isDarkMode && { backgroundColor: '#13281E', borderColor: '#52D22E' },
                  ]
                : [
                    styles.floatingCheckboxUnchecked,
                    {
                      backgroundColor: isDarkMode ? '#252932' : '#FFFFFF',
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
                size={14}
                color={isDarkMode ? '#52D22E' : '#1B9A72'}
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
                        isDarkMode && { backgroundColor: '#13281E' },
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
                    { color: isDarkMode ? textPrimary : '#1B1C19' },
                    localChecked && (isDarkMode ? { color: '#5C6270' } : styles.titleCompleted),
                  ]}
                  numberOfLines={2}
                >
                  {task.label}
                </Text>

                {task.note ? (
                  <Text
                    style={[
                      styles.note,
                      { color: isDarkMode ? textSecondary : '#7E838F' },
                      localChecked && (isDarkMode ? { color: '#4A505C' } : styles.noteCompleted),
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
                isDarkMode && { borderTopColor: '#2C3035' },
              ]}
            >
              <View style={styles.footerLeft}>
                {task.time ? (
                  <View
                    style={[
                      styles.timeTag,
                      isDarkMode && { backgroundColor: '#252932' },
                    ]}
                  >
                    <Clock
                      size={12}
                      color={isDarkMode ? '#A3A8B1' : '#7E838F'}
                      strokeWidth={2}
                    />
                    <Text
                      style={[
                        styles.timeText,
                        isDarkMode && { color: '#A3A8B1' },
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
    backgroundColor: 'transparent',
    padding: 16,
    gap: 10,
    position: 'relative',
    ...Platform.select({
      ios: {
        shadowColor: '#F5C518',
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
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingRight: 38,
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
    backgroundColor: '#F5F6F8',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  iconContainerChecked: {
    backgroundColor: '#E8FDF0',
  },
  textBlock: {
    flex: 1,
    gap: 3,
  },
  title: {
    ...Typography.bodyMediumPoppinsSemiBold,
    color: '#1B1C19',
    fontSize: 15,
    lineHeight: 21,
  },
  titleCompleted: {
    color: '#7E838F',
  },
  note: {
    ...Typography.bodySmallPoppinsRegular,
    color: '#7E838F',
    fontSize: 12,
    lineHeight: 17,
  },
  noteCompleted: {
    color: '#AAB0B9',
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F5F2EB',
  },
  footerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  timeTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F5F6F8',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  timeText: {
    fontFamily: Fonts.poppins.medium,
    fontSize: 11,
    color: '#7E838F',
  },
});

export default TaskCardItem;
