import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Platform,
} from 'react-native';
import {
  Mail,
  Users,
  Check,
  Clock,
  Heart,
  Sparkles,
} from 'lucide-react-native';
import { Fonts } from '../../../Theme/fonts';
import { Typography } from '../../../Theme/Typographys';
import { Badge } from '../../../Common/Badge';
import { Task } from '../../../Context/TaskReminderContext';

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

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.96,
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

    onToggle(task.id);
  };

  const renderIcon = () => {
    if (task.category === 'sport') {
      return (
        <Heart
          size={18}
          color={isChecked ? '#1B9A72' : '#52D22E'}
          strokeWidth={2.2}
        />
      );
    }
    if (task.category === 'habits') {
      return (
        <Sparkles
          size={18}
          color={isChecked ? '#1B9A72' : '#8383D6'}
          strokeWidth={2.2}
        />
      );
    }
    if (task.iconType === 'mail') {
      return (
        <Mail
          size={18}
          color={isChecked ? '#1B9A72' : '#454A53'}
          strokeWidth={2.2}
        />
      );
    }
    return (
      <Users
        size={18}
        color={isChecked ? '#1B9A72' : '#454A53'}
        strokeWidth={2.2}
      />
    );
  };

  const hasFooter = !!(task.time || task.priority || task.voiceNudge);

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        activeOpacity={0.88}
        style={[styles.card, isChecked && styles.cardCompleted]}
        onPress={handlePress}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: isChecked }}
        accessibilityLabel={task.label}
      >
        <View style={styles.cardHeaderRow}>
          <View style={styles.leftInfo}>
            <View
              style={[
                styles.iconContainer,
                isChecked && styles.iconContainerChecked,
              ]}
            >
              {renderIcon()}
            </View>

            <View style={styles.textBlock}>
              <Text
                style={[styles.title, isChecked && styles.titleCompleted]}
                numberOfLines={2}
              >
                {task.label}
              </Text>

              {task.note ? (
                <Text
                  style={[styles.note, isChecked && styles.noteCompleted]}
                  numberOfLines={2}
                >
                  {task.note}
                </Text>
              ) : null}
            </View>
          </View>

          {/* Interactive Tactile Checkbox */}
          <View
            style={[
              styles.checkbox,
              isChecked ? styles.checkboxChecked : styles.checkboxUnchecked,
            ]}
          >
            {isChecked && <Check size={14} color="#52D22E" strokeWidth={3} />}
          </View>
        </View>

        {/* Footer Badges & Metadata (time, priority, voice nudge) */}
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
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    gap: 10,
    borderWidth: 1.5,
    borderColor: '#F0ECE4',
    ...Platform.select({
      ios: {
        shadowColor: '#1F2228',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  cardCompleted: {
    backgroundColor: '#FBFDFB',
    borderColor: '#E2F4E9',
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
    color: '#8A8F98',
    textDecorationLine: 'line-through',
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
  checkbox: {
    width: 26,
    height: 26,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  checkboxChecked: {
    backgroundColor: '#E8FDF0',
    borderWidth: 1.2,
    borderColor: '#A3E4BF',
  },
  checkboxUnchecked: {
    backgroundColor: '#EFF1F4',
    borderWidth: 1.2,
    borderColor: '#E0E3E8',
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
