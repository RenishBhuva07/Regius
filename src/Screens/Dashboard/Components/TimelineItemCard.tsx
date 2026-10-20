import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Dimensions,
  LayoutChangeEvent,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import {
  Check,
  CheckCircle2,
  Flame,
  Bell,
  Mic,
  Clock,
  Sparkles,
} from 'lucide-react-native';
import { Fonts } from '../../../Theme/fonts';
import { Badge } from '../../../Common/Badge';
import Colors from '../../../Assets/StyleUtilities/Colors';

export type TimelineCategoryType = 'task' | 'habit' | 'reminder';

export interface TimelineItem {
  id: string;
  type: TimelineCategoryType;
  time: string; // e.g. "08:30 AM"
  timeMinutes: number;
  title: string;
  subtitle?: string;
  timeRange?: string;
  category: string;
  accentColor: string;
  completed: boolean;
  isVoiceNudge?: boolean;
  streak?: number;
  badgeText?: string;
  originalId: string;
}
// Rounded card SVG path with top-right cutout for the floating checkbox
export const getCutoutCardPath = (W: number, H: number): string => {
  if (W <= 60 || H <= 60) return '';
  const sw = 1.5;
  const half = sw / 2;
  const x0 = half;
  const y0 = half;
  const x1 = W - half;
  const y1 = H - half;

  const CW = 44; // Cutout notch width
  const CH = 44; // Cutout notch height
  const R_tl = 18; // Top-left corner radius
  const R_bl = 18; // Bottom-left corner radius
  const R_br = 18; // Bottom-right corner radius
  const R_outer = 12; // Fillet entering and exiting the notch
  const R_inner = 14; // Fillet at inner scooped corner

  return [
    `M ${x0} ${y0 + R_tl}`,
    `Q ${x0} ${y0}, ${x0 + R_tl} ${y0}`,
    `L ${x1 - CW - R_outer} ${y0}`,
    `Q ${x1 - CW} ${y0}, ${x1 - CW} ${y0 + R_outer}`,
    `L ${x1 - CW} ${y0 + CH - R_inner}`,
    `Q ${x1 - CW} ${y0 + CH}, ${x1 - CW + R_inner} ${y0 + CH}`,
    `L ${x1 - R_outer} ${y0 + CH}`,
    `Q ${x1} ${y0 + CH}, ${x1} ${y0 + CH + R_outer}`,
    `L ${x1} ${y1 - R_br}`,
    `Q ${x1} ${y1}, ${x1 - R_br} ${y1}`,
    `L ${x0 + R_bl} ${y1}`,
    `Q ${x0} ${y1}, ${x0} ${y1 - R_bl}`,
    `L ${x0} ${y0 + R_tl}`,
    'Z',
  ].join(' ');
};

interface TimelineItemCardProps {
  item: TimelineItem;
  isFirst?: boolean;
  isLast?: boolean;
  onToggleComplete?: (item: TimelineItem) => void;
  onPressCard?: (item: TimelineItem) => void;
  onExtendMinutes?: (item: TimelineItem) => void;
}

export const TimelineItemCard: React.FC<TimelineItemCardProps> = ({
  item,
  isFirst = false,
  isLast = false,
  onToggleComplete,
  onPressCard,
  onExtendMinutes,
}) => {
  const isCompleted = item.completed;

  // Responsive card size state for exact SVG path rendering
  const initialW = Dimensions.get('window').width - 118;
  const [cardSize, setCardSize] = React.useState({
    width: Math.max(initialW, 200),
    height: 92,
  });

  const handleCardLayout = React.useCallback((e: LayoutChangeEvent) => {
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

  // Split time into hours:minutes and AM/PM
  const timeParts = item.time.trim().split(/\s+/);
  const timeNumber = timeParts[0] || '08:00';
  const timePeriod = timeParts[1] || 'AM';

  // Category styling facets matching Daily Balance and Design System
  const getCategoryStyles = () => {
    switch (item.type) {
      case 'task':
        return {
          accent: '#F5C518',
          bgTint: '#FFFCEB',
          borderTint: '#FFF5B8',
          shadowColor: '#F5C518',
          pillBg: '#FFF9D2',
          pillText: '#B48216',
          iconBg: '#FFFCEB',
          iconColor: '#B48216',
          badgeVariant: 'yellow' as const,
        };
      case 'reminder':
        return {
          accent: '#1B9A72',
          bgTint: '#EDFDF5',
          borderTint: '#C6FFDD',
          shadowColor: '#52D22E',
          pillBg: '#E8FDF0',
          pillText: '#1B9A72',
          iconBg: '#EDFDF5',
          iconColor: '#1B9A72',
          badgeVariant: 'green' as const,
        };
      case 'habit':
      default:
        return {
          accent: '#8383D6',
          bgTint: '#EFF2FE',
          borderTint: '#D8DBFF',
          shadowColor: '#8383D6',
          pillBg: '#EDEAFB',
          pillText: '#7059C8',
          iconBg: '#EFF2FE',
          iconColor: '#7059C8',
          badgeVariant: 'purple' as const,
        };
    }
  };

  const catStyle = getCategoryStyles();

  // Category-specific icon below time (always shows category icon, never replaced with a checkbox)
  const renderCategoryIcon = () => {
    const iconColor = isCompleted ? '#8E8D92' : catStyle.iconColor;
    if (item.type === 'task') {
      return <CheckCircle2 size={12} color={iconColor} strokeWidth={2.4} />;
    }
    if (item.type === 'reminder') {
      return <Bell size={12} color={iconColor} strokeWidth={2.2} />;
    }
    if (item.type === 'habit') {
      return <Flame size={12} color={iconColor} strokeWidth={2.2} />;
    }
    if (item.isVoiceNudge) {
      return <Mic size={12} color={iconColor} strokeWidth={2.4} />;
    }
    return <CheckCircle2 size={12} color={iconColor} strokeWidth={2.4} />;
  };

  return (
    <View style={[styles.container, isLast && styles.containerLast]}>
      {/* Time column */}
      <View style={styles.timeColumn}>
        <View
          style={[
            styles.timelineLine,
            isFirst && styles.timelineLineFirst,
            isLast && styles.timelineLineLast,
          ]}
        />

        <View style={styles.timeTextContainer}>
          <Text
            style={[styles.timeNumber, isCompleted && styles.timeCompletedText]}
          >
            {timeNumber}
          </Text>
          <Text
            style={[styles.timePeriod, isCompleted && styles.timeCompletedText]}
          >
            {timePeriod}
          </Text>
        </View>

        <View
          style={[
            styles.nodeCircle,
            {
              backgroundColor: isCompleted ? '#F7F6F2' : catStyle.iconBg,
              borderColor: isCompleted ? '#E8E5DE' : catStyle.borderTint,
            },
          ]}
        >
          {renderCategoryIcon()}
        </View>
      </View>

      {/* Content card */}
      <TouchableOpacity
        activeOpacity={0.88}
        onLayout={handleCardLayout}
        onPress={() =>
          onPressCard ? onPressCard(item) : onToggleComplete?.(item)
        }
        style={styles.card}
        accessibilityRole="button"
        accessibilityLabel={`${item.title}, ${item.category}, scheduled for ${
          item.time
        }, ${isCompleted ? 'completed' : 'not completed'}`}
      >
        <Svg
          width={cardSize.width}
          height={cardSize.height}
          style={styles.cardSvgBackground}
          pointerEvents="none"
        >
          <Path
            d={getCutoutCardPath(cardSize.width, cardSize.height)}
            fill={isCompleted ? '#FAFAF8' : catStyle.bgTint}
            stroke={isCompleted ? '#ECEAE4' : catStyle.borderTint}
            strokeWidth={1.5}
            strokeLinejoin="round"
          />
        </Svg>

        <View
          style={[
            styles.accentBar,
            { backgroundColor: isCompleted ? '#A0A4A8' : catStyle.accent },
          ]}
        />

        {/* Floating Checkbox */}
        <TouchableOpacity
          activeOpacity={0.75}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          onPress={() => onToggleComplete?.(item)}
          style={[
            styles.floatingCheckbox,
            isCompleted
              ? styles.floatingCheckboxChecked
              : [
                  styles.floatingCheckboxUnchecked,
                  { borderColor: catStyle.borderTint },
                ],
          ]}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: isCompleted }}
          accessibilityLabel={`Mark ${item.title} as ${
            isCompleted ? 'incomplete' : 'complete'
          }`}
        >
          {isCompleted ? (
            <Check size={14} color="#1B9A72" strokeWidth={3} />
          ) : null}
        </TouchableOpacity>

        <View style={styles.cardContent}>
          <View style={styles.cardTopRow}>
            <Text
              style={[styles.title, isCompleted && styles.titleCompleted]}
              numberOfLines={2}
            >
              {item.title}
            </Text>
          </View>

          {item.subtitle ? (
            <Text
              style={[styles.subtitle, isCompleted && styles.subtitleCompleted]}
              numberOfLines={2}
            >
              {item.subtitle}
            </Text>
          ) : null}

          {/* Meta & Badges */}
          <View style={styles.metaRow}>
            <View
              style={[
                styles.timePill,
                { backgroundColor: isCompleted ? '#EEEEEE' : catStyle.pillBg },
              ]}
            >
              <Clock
                size={11}
                color={isCompleted ? '#77767B' : catStyle.pillText}
                style={{ marginRight: 4 }}
              />
              <Text
                style={[
                  styles.timePillText,
                  { color: isCompleted ? '#77767B' : catStyle.pillText },
                ]}
              >
                {item.timeRange || item.time}
              </Text>
            </View>

            {/* Category or Streak 3D tactile badge matching design system */}
            {item.streak ? (
              <Badge
                label={`${item.streak}d streak`}
                variant="yellow"
                size="sm"
                icon={<Flame size={10} color="#B47804" />}
              />
            ) : item.type === 'reminder' ? (
              <Badge
                label={item.category || 'Reminder'}
                variant={item.category === 'Alert' ? 'red' : 'green'}
                size="sm"
                icon={
                  <Bell
                    size={10}
                    color={item.category === 'Alert' ? '#D92A0F' : '#1B9A72'}
                  />
                }
              />
            ) : item.isVoiceNudge ? (
              <Badge
                label="Voice Nudge"
                variant="purple"
                size="sm"
                icon={<Sparkles size={10} color="#8383D6" />}
              />
            ) : (
              <Badge
                label={item.category}
                variant={catStyle.badgeVariant}
                size="sm"
              />
            )}
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'stretch',
    marginBottom: 12,
  },
  containerLast: {
    marginBottom: 0,
  },
  timeColumn: {
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  timeTextContainer: {
    position: 'absolute',
    bottom: '50%',
    marginBottom: 15,
    alignItems: 'center',
    backgroundColor: 'transparent',
    paddingHorizontal: 2,
    borderRadius: 3,
    zIndex: 0,
  },
  timeNumber: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: 11.5,
    color: '#1B1C19',
    letterSpacing: -0.2,
    lineHeight: 15,
  },
  timePeriod: {
    fontFamily: Fonts.poppins.medium,
    fontSize: 9,
    color: '#8E8D92',
    lineHeight: 12,
  },
  timeCompletedText: {
    color: '#A8A6A4',
  },
  timelineLine: {
    position: 'absolute',
    top: 0,
    bottom: -16,
    width: 1.5,
    backgroundColor: '#E6E3DC',
  },
  timelineLineFirst: {
    top: '50%',
  },
  timelineLineLast: {
    bottom: '50%',
  },
  nodeCircle: {
    position: 'absolute',
    top: '50%',
    marginTop: -11,
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  card: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    minHeight: 88,
    backgroundColor: 'transparent',
    ...Platform.select({
      ios: {
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.12,
        shadowRadius: 6,
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
  cardCompleted: {
    backgroundColor: 'transparent',
  },
  floatingCheckbox: {
    position: 'absolute',
    top: 9,
    right: 9,
    width: 26,
    height: 26,
    borderRadius: 13, // Perfectly round circular checkbox outside the card
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
  // Retained alias for backwards compatibility
  taskCheckbox: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  taskCheckboxChecked: {
    backgroundColor: '#E8FDF0',
    borderColor: '#C6FFDD',
  },
  taskCheckboxUnchecked: {
    backgroundColor: '#FFFFFF',
    borderColor: '#ECE8DF',
  },
  accentBar: {
    width: 3.5,
    height: 36,
    borderTopRightRadius: 3,
    borderBottomRightRadius: 3,
    alignSelf: 'center',
    zIndex: 2,
  },
  cardContent: {
    flex: 1,
    paddingVertical: 13,
    paddingLeft: 12,
    paddingRight: 14,
    justifyContent: 'space-between',
    gap: 6,
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingRight: 48, // Guarantees title stays completely clear of the floating checkbox cutout
  },
  title: {
    flex: 1,
    fontFamily: Fonts.poppins.semiBold,
    fontSize: 14,
    color: '#1B1C19',
    lineHeight: 19,
    letterSpacing: -0.2,
  },
  titleCompleted: {
    color: '#8E8D92',
  },
  subtitle: {
    fontFamily: Fonts.poppins.regular,
    fontSize: 12,
    color: '#666665',
    lineHeight: 16,
    paddingRight: 36, // Clears the floating checkbox and scooped cutout notch
  },
  subtitleCompleted: {
    color: '#A09F9E',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 2,
  },
  timePill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3.5,
    borderRadius: 10,
  },
  timePillText: {
    fontFamily: Fonts.poppins.medium,
    fontSize: 11,
    letterSpacing: -0.1,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF7E8',
    paddingHorizontal: 7,
    paddingVertical: 3.5,
    borderRadius: 10,
  },
  streakBadgeText: {
    fontFamily: Fonts.poppins.medium,
    fontSize: 10.5,
    color: '#9C6E10',
  },
  voicePrepBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1EFFF',
    paddingHorizontal: 7,
    paddingVertical: 3.5,
    borderRadius: 10,
  },
  voicePrepBadgeText: {
    fontFamily: Fonts.poppins.medium,
    fontSize: 10.5,
    color: '#6351B5',
  },
  categoryBadge: {
    backgroundColor: '#F4F2EC',
    paddingHorizontal: 7,
    paddingVertical: 3.5,
    borderRadius: 10,
  },
  categoryBadgeText: {
    fontFamily: Fonts.poppins.medium,
    fontSize: 10.5,
    color: '#6E6B65',
  },
});

export default TimelineItemCard;
