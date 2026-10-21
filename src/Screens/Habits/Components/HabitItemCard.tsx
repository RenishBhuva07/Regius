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
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import {
  Flame,
  Check,
  Clock,
  Repeat,
  Sun,
  Sparkles,
  Moon,
  Pencil,
} from 'lucide-react-native';
import { Fonts } from '../../../Theme/fonts';
import { Colors } from '../../../Assets/StyleUtilities/Colors';
import { Badge, BadgeVariant } from '../../../Common/Badge';
import { HabitItem } from '../../../Context/TaskReminderContext';
import { getCutoutCardPath } from '../../Dashboard/Components/TimelineItemCard';

interface HabitItemCardProps {
  habit: HabitItem;
  onToggle: (id: string) => void;
  onEdit?: (habit: HabitItem) => void;
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

const CATEGORY_MAP: Record<string, CategoryConfig> = {
  morning: {
    label: 'MORNING',
    badgeVariant: 'green',
    accentColor: '#1B9A72',
    activeBorder: '#D8F3E5',
    checkboxBorder: '#A3E4BF',
    timePillBg: '#EDFDF5',
    timePillText: '#1B9A72',
    completedBg: '#F0FAF4',
    completedBorder: '#BBE8CE',
    icon: Sun,
  },
  mindful: {
    label: 'MINDFUL',
    badgeVariant: 'purple',
    accentColor: Colors.LavenderPurple,
    activeBorder: '#E3E5FD',
    checkboxBorder: '#C4C9FA',
    timePillBg: '#EFF2FE',
    timePillText: '#7059C8',
    completedBg: '#F5F6FE',
    completedBorder: '#D2D6FB',
    icon: Sparkles,
  },
  evening: {
    label: 'EVENING',
    badgeVariant: 'orange',
    accentColor: '#E65100',
    activeBorder: '#FFE8D6',
    checkboxBorder: '#FFCCA4',
    timePillBg: '#FFF2E6',
    timePillText: '#D95D0F',
    completedBg: '#FFF8F2',
    completedBorder: '#FFDAC0',
    icon: Moon,
  },
};

const DEFAULT_CONFIG: CategoryConfig = CATEGORY_MAP.morning;

export const HabitItemCard: React.FC<HabitItemCardProps> = ({
  habit,
  onToggle,
  onEdit,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const config = CATEGORY_MAP[habit.category] || DEFAULT_CONFIG;

  const initialW = Dimensions.get('window').width - 32;
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

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        activeOpacity={0.88}
        onLayout={handleCardLayout}
        onPress={handleToggle}
        style={[
          styles.card,
          {
            shadowColor: config.accentColor,
          },
        ]}
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
            fill={habit.completed ? config.completedBg : '#FFFFFF'}
            stroke={
              habit.completed ? config.completedBorder : config.activeBorder
            }
            strokeWidth={1.5}
            strokeLinejoin="round"
          />
        </Svg>

        {/* Floating Edit Button inside cutout notch */}
        {onEdit && (
          <TouchableOpacity
            activeOpacity={0.75}
            onPress={e => {
              e.stopPropagation();
              onEdit(habit);
            }}
            style={[
              styles.floatingEditBtn,
              {
                borderColor: habit.completed
                  ? config.completedBorder
                  : config.checkboxBorder,
              },
            ]}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            accessibilityRole="button"
            accessibilityLabel={`Edit ${habit.title}`}
          >
            <Pencil size={12} color="#7A766E" strokeWidth={2.2} />
          </TouchableOpacity>
        )}

        <View style={styles.cardContent}>
          {/* Top Row: Category Badge + Time + Streak Pill */}
          <View style={styles.topRow}>
            <View style={styles.topRowLeft}>
              <Badge
                label={config.label}
                variant={config.badgeVariant}
                size="sm"
              />
              <View
                style={[
                  styles.timePill,
                  { backgroundColor: config.timePillBg },
                ]}
              >
                <Clock size={11} color={config.timePillText} />
                <Text style={[styles.timeText, { color: config.timePillText }]}>
                  {habit.timeOfDay}
                </Text>
              </View>
            </View>

            <View
              style={[
                styles.topRowRight,
                onEdit ? styles.topRowRightWithEdit : null,
              ]}
            >
              <View
                style={[
                  styles.streakBadge,
                  habit.completed && styles.streakBadgeActive,
                ]}
              >
                <Flame
                  size={12}
                  color={
                    habit.completed
                      ? '#E65100'
                      : habit.streak > 0
                      ? '#E65100'
                      : '#8E8E93'
                  }
                />
                <Text
                  style={[
                    styles.streakText,
                    habit.completed && styles.streakTextActive,
                  ]}
                >
                  {habit.streak}d streak
                </Text>
              </View>
            </View>
          </View>

          {/* Main Content Row: Checkbox + Title + Frequency */}
          <View style={styles.mainRow}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleToggle}
              style={[
                styles.checkbox,
                habit.completed
                  ? {
                      backgroundColor: config.accentColor,
                      borderColor: config.accentColor,
                    }
                  : {
                      backgroundColor: '#FFFFFF',
                      borderColor: config.checkboxBorder,
                    },
              ]}
            >
              {habit.completed ? (
                <Check size={14} color="#FFFFFF" strokeWidth={3} />
              ) : null}
            </TouchableOpacity>

            <View style={styles.titleWrap}>
              <Text
                style={[styles.title, habit.completed && styles.titleCompleted]}
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
                        backgroundColor: config.accentColor,
                        opacity: isCurrent && !habit.completed ? 0.4 : 0.85,
                      },
                      isCurrent && [
                        styles.miniDotCurrent,
                        !habit.completed && {
                          borderColor: config.accentColor,
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
  );
};

const styles = StyleSheet.create({
  card: {
    position: 'relative',
    backgroundColor: 'transparent',
    ...Platform.select({
      ios: {
        shadowColor: Colors.DefaultBlack,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
    marginHorizontal: 16,
  },
  cardSvgBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
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
  topRowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  topRowRightWithEdit: {
    marginRight: 34,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F8F7F2',
    borderWidth: 1,
    borderColor: '#ECE7DC',
    paddingHorizontal: 8,
    paddingVertical: 3.5,
    borderRadius: 10,
  },
  streakBadgeActive: {
    backgroundColor: '#FFF3E0',
    borderColor: '#FFE0B2',
  },
  streakText: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: 11,
    color: '#8E8E93',
  },
  streakTextActive: {
    color: '#E65100',
  },
  floatingEditBtn: {
    position: 'absolute',
    top: 9,
    right: 9,
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 1.5,
    backgroundColor: '#FFFFFF',
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
  mainRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  checkbox: {
    width: 26,
    height: 26,
    borderRadius: 8,
    borderWidth: 1.8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleWrap: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: 14.5,
    color: '#1B1C19',
    lineHeight: 20,
  },
  titleCompleted: {
    color: '#1B1C19',
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
    borderTopColor: 'rgba(0, 0, 0, 0.04)',
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
