import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Platform,
} from 'react-native';
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
  Activity,
  CalendarCheck,
} from 'lucide-react-native';
import { Fonts } from '../../../Theme/fonts';
import { Typography } from '../../../Theme/Typographys';
import { Badge } from '../../../Common/Badge';
import { Reminder } from '../../../Context/TaskReminderContext';

interface ReminderCardItemProps {
  reminder: Reminder;
  isChecked: boolean;
  onToggle: (id: string) => void;
  isSpeaking: boolean;
  onSpeak: (reminder: Reminder, e: any) => void;
}

export const ReminderCardItem: React.FC<ReminderCardItemProps> = ({
  reminder,
  isChecked,
  onToggle,
  isSpeaking,
  onSpeak,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const [localChecked, setLocalChecked] = useState(isChecked);

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

    setTimeout(() => {
      onToggle(reminder.id);
    }, 130);
  };

  const getCategoryTheme = () => {
    switch (reminder.category) {
      case 'work':
        return {
          bgColor: '#EFF2FE',
          accentColor: '#8383D6',
          Icon: Briefcase,
        };
      case 'health':
        return {
          bgColor: '#EDFDF5',
          accentColor: '#52D22E',
          Icon: Heart,
        };
      case 'events':
        return {
          bgColor: '#FFF3E0',
          accentColor: '#FF9800',
          Icon: CalendarCheck,
        };
      case 'daily':
      default:
        return {
          bgColor: '#FFFCEB',
          accentColor: '#F5C518',
          Icon: Bell,
        };
    }
  };

  const theme = getCategoryTheme();
  const IconComponent = theme.Icon;
  const hasFooter = !!(
    reminder.time ||
    reminder.date ||
    reminder.repeat ||
    reminder.urgentAlarm
  );

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        activeOpacity={0.88}
        style={[
          styles.card,
          localChecked && styles.cardCompleted,
          { shadowColor: theme.accentColor },
        ]}
        onPress={handlePress}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: localChecked }}
        accessibilityLabel={reminder.title}
      >
        <View style={styles.cardHeaderRow}>
          <View style={styles.leftInfo}>
            <View
              style={[
                styles.iconContainer,
                { backgroundColor: theme.bgColor },
                localChecked && styles.iconContainerChecked,
              ]}
            >
              <IconComponent
                size={18}
                color={localChecked ? '#1B9A72' : theme.accentColor}
                strokeWidth={2.2}
              />
            </View>

            <View style={styles.textBlock}>
              <Text
                style={[styles.title, localChecked && styles.titleCompleted]}
                numberOfLines={2}
              >
                {reminder.title}
              </Text>

              {reminder.notes ? (
                <Text
                  style={[styles.notes, localChecked && styles.notesCompleted]}
                  numberOfLines={2}
                >
                  {reminder.notes}
                </Text>
              ) : null}
            </View>
          </View>

          {/* Right Header Controls: Kokoro TTS Audio + Checkbox */}
          <View style={styles.rightControls}>
            <TouchableOpacity
              activeOpacity={0.7}
              style={[styles.speakBtn, isSpeaking && styles.speakBtnActive]}
              onPress={e => onSpeak(reminder, e)}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              accessibilityRole="button"
              accessibilityLabel={
                isSpeaking ? 'Stop vocalizing reminder' : 'Speak reminder aloud'
              }
            >
              {isSpeaking ? (
                <VolumeX size={15} color="#8383D6" strokeWidth={2.4} />
              ) : (
                <Volume2 size={15} color="#8A9099" strokeWidth={2.2} />
              )}
            </TouchableOpacity>

            <View
              style={[
                styles.checkbox,
                localChecked
                  ? styles.checkboxChecked
                  : styles.checkboxUnchecked,
              ]}
            >
              {localChecked && (
                <Check size={14} color="#52D22E" strokeWidth={3} />
              )}
            </View>
          </View>
        </View>

        {/* Footer Badges & Metadata (time, date, repeat, urgent) */}
        {hasFooter && (
          <View style={styles.cardFooter}>
            <View style={styles.footerLeft}>
              {reminder.time ? (
                <View style={styles.metaTag}>
                  <Clock size={11.5} color="#7E838F" strokeWidth={2} />
                  <Text style={styles.metaText}>{reminder.time}</Text>
                </View>
              ) : null}

              {reminder.date ? (
                <View style={styles.metaTag}>
                  <Calendar size={11.5} color="#7E838F" strokeWidth={2} />
                  <Text style={styles.metaText}>{reminder.date}</Text>
                </View>
              ) : null}

              {reminder.repeat ? (
                <View style={[styles.metaTag, styles.repeatTag]}>
                  <RotateCw size={11} color="#8383D6" strokeWidth={2.2} />
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
        shadowColor: '#52D22E',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
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
    textDecorationLine: 'line-through',
  },
  notes: {
    ...Typography.bodySmallPoppinsRegular,
    color: '#7E838F',
    fontSize: 12,
    lineHeight: 17,
  },
  notesCompleted: {
    color: '#AAB0B9',
  },
  rightControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  speakBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#F5F6F8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  speakBtnActive: {
    backgroundColor: '#EFF2FE',
  },
  checkbox: {
    width: 26,
    height: 26,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
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
  metaTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F5F6F8',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  metaText: {
    fontFamily: Fonts.poppins.medium,
    fontSize: 11,
    color: '#7E838F',
  },
  repeatTag: {
    backgroundColor: '#EFF2FE',
  },
  repeatText: {
    fontFamily: Fonts.poppins.medium,
    fontSize: 11,
    color: '#8383D6',
  },
});

export default ReminderCardItem;
