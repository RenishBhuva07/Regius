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
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import {
  Mail,
  Users,
  Check,
  Clock,
  Heart,
  Sparkles,
  Briefcase,
} from 'lucide-react-native';
import { Fonts } from '../../../Theme/fonts';
import { Typography } from '../../../Theme/Typographys';
import { Badge } from '../../../Common/Badge';
import { Task } from '../../../Context/TaskReminderContext';
import { getCutoutCardPath } from '../../Dashboard/Components/TimelineItemCard';

interface TaskCardItemProps {
  task: Task;
  isChecked: boolean;
  onToggle: (id: string) => void;
}

export const TaskCardItem: React.FC<TaskCardItemProps> = ({
  task,
  isChecked,
  onToggle,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
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

  const renderIcon = () => {
    if (task.category === 'sport') {
      return (
        <Heart
          size={18}
          color={localChecked ? '#1B9A72' : '#52D22E'}
          strokeWidth={2.2}
        />
      );
    }
    if (task.category === 'habits') {
      return (
        <Sparkles
          size={18}
          color={localChecked ? '#1B9A72' : '#8383D6'}
          strokeWidth={2.2}
        />
      );
    }
    if (task.iconType === 'mail') {
      return (
        <Mail
          size={18}
          color={localChecked ? '#1B9A72' : '#454A53'}
          strokeWidth={2.2}
        />
      );
    }
    if (task.iconType === 'users') {
      return (
        <Users
          size={18}
          color={localChecked ? '#1B9A72' : '#454A53'}
          strokeWidth={2.2}
        />
      );
    }
    return (
      <Briefcase
        size={18}
        color={localChecked ? '#1B9A72' : '#B48216'}
        strokeWidth={2.2}
      />
    );
  };

  const getCategoryShadowColor = () => {
    if (task.category === 'sport') return '#52D22E';
    if (task.category === 'habits') return '#8383D6';
    if (task.priority === 'high') return '#FF3B30';
    return '#F5C518';
  };

  const hasSubtasks = !!(task.subtasks && task.subtasks.length > 0);
  const hasFooter = !!(
    task.time ||
    task.priority ||
    task.voiceNudge ||
    hasSubtasks
  );

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        activeOpacity={0.88}
        onLayout={handleCardLayout}
        style={[styles.card, { shadowColor: getCategoryShadowColor() }]}
        onPress={handlePress}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: localChecked }}
        accessibilityLabel={task.label}
      >
        {/* Dynamic Cutout Notch Background SVG matching Dashboard TimelineItemCard */}
        <Svg
          width={cardSize.width}
          height={cardSize.height}
          style={styles.cardSvgBackground}
          pointerEvents="none"
        >
          <Path
            d={getCutoutCardPath(cardSize.width, cardSize.height)}
            fill={localChecked ? '#FBFDFB' : '#FFFFFF'}
            stroke={localChecked ? '#E2F4E9' : '#F0ECE4'}
            strokeWidth={1.5}
            strokeLinejoin="round"
          />
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
              ? styles.floatingCheckboxChecked
              : styles.floatingCheckboxUnchecked,
          ]}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: localChecked }}
          accessibilityLabel={`Mark ${task.label} as ${
            localChecked ? 'incomplete' : 'complete'
          }`}
        >
          {localChecked && <Check size={14} color="#1B9A72" strokeWidth={3} />}
        </TouchableOpacity>

        <View style={styles.cardHeaderRow}>
          <View style={styles.leftInfo}>
            <View
              style={[
                styles.iconContainer,
                localChecked && styles.iconContainerChecked,
              ]}
            >
              {renderIcon()}
            </View>

            <View style={styles.textBlock}>
              <Text
                style={[styles.title, localChecked && styles.titleCompleted]}
                numberOfLines={2}
              >
                {task.label}
              </Text>

              {task.note ? (
                <Text
                  style={[styles.note, localChecked && styles.noteCompleted]}
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
          <View style={styles.cardFooter}>
            <View style={styles.footerLeft}>
              {task.time ? (
                <View style={styles.timeTag}>
                  <Clock size={12} color="#7E838F" strokeWidth={2} />
                  <Text style={styles.timeText}>{task.time}</Text>
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
  );
};

const styles = StyleSheet.create({
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
    paddingRight: 40,
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
