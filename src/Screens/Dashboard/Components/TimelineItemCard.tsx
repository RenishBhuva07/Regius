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
import Svg, {
  Path,
  Defs,
  RadialGradient,
  Stop,
  Circle,
} from 'react-native-svg';
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
import { Colors } from '../../../Assets/StyleUtilities/Colors';
import { Badge } from '../../../Common/Badge';
import { StreakBadge } from '../../../Common/StreakBadge';
import { useAppTheme } from '../../../Theme/useAppTheme';

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
import { getCutoutCardPath } from '../../../Common/CutoutCardSvg';
import ResponsivePixels from '../../../Assets/StyleUtilities/ResponsivePixels';

export { getCutoutCardPath };

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
  onExtendMinutes: _onExtendMinutes,
}) => {
  const isCompleted = item.completed;
  const { isDarkMode, textPrimary, textSecondary } = useAppTheme();

  // Responsive card size state for exact SVG path rendering
  const initialW = Dimensions.get('window').width - ResponsivePixels.size118;
  const [cardSize, setCardSize] = React.useState({
    width: Math.max(initialW, ResponsivePixels.size200),
    height: ResponsivePixels.size92,
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
          accent: Colors.AccentYellow,
          bgTint: isDarkMode ? Colors.WorkDarkBg : Colors.WorkTintCream,
          borderTint: isDarkMode
            ? Colors.WorkDarkBorder
            : Colors.WorkLightBorder,
          shadowColor: isDarkMode ? Colors.PureBlack : Colors.AccentYellow,
          auraColor: Colors.AccentYellow,
          pillBg: isDarkMode ? Colors.WorkDarkIconBg : Colors.WorkPillLight,
          pillText: isDarkMode ? Colors.AccentYellow : Colors.WorkTextAccent,
          iconBg: isDarkMode ? Colors.WorkDarkIconBg : Colors.WorkLightBg,
          iconColor: isDarkMode ? Colors.AccentYellow : Colors.WorkTextAccent,
          badgeVariant: 'yellow' as const,
        };
      case 'reminder':
        return {
          accent: Colors.GreenGracious,
          bgTint: isDarkMode
            ? Colors.WellnessDarkBg
            : Colors.WellnessTintLight,
          borderTint: isDarkMode
            ? Colors.GreenGracious
            : Colors.WellnessLightBorder,
          shadowColor: isDarkMode ? Colors.PureBlack : Colors.AccentGreen,
          auraColor: Colors.AccentGreen,
          pillBg: isDarkMode ? Colors.WellnessDarkIconBg : Colors.BadgeGreenBg,
          pillText: isDarkMode ? Colors.AccentGreen : Colors.GreenGracious,
          iconBg: isDarkMode ? Colors.WellnessDarkIconBg : Colors.WellnessLightBg,
          iconColor: isDarkMode ? Colors.AccentGreen : Colors.GreenGracious,
          badgeVariant: 'green' as const,
        };
      case 'habit':
      default:
        return {
          accent: Colors.LavenderPurple,
          bgTint: isDarkMode ? Colors.MindfulDarkBg : Colors.MindfulTintLight,
          borderTint: isDarkMode
            ? Colors.LavenderPurple
            : Colors.MindfulLightBorder,
          shadowColor: isDarkMode ? Colors.PureBlack : Colors.LavenderPurple,
          auraColor: Colors.LavenderPurple,
          pillBg: isDarkMode ? Colors.MindfulDarkIconBg : Colors.MindfulPillLight,
          pillText: isDarkMode
            ? Colors.LavenderPurple
            : Colors.MindfulTextAccent,
          iconBg: isDarkMode ? Colors.MindfulDarkIconBg : Colors.MindfulLightBg,
          iconColor: isDarkMode
            ? Colors.LavenderPurple
            : Colors.MindfulTextAccent,
          badgeVariant: 'purple' as const,
        };
    }
  };

  const catStyle = getCategoryStyles();

  // Category-specific icon below time (always shows category icon, never replaced with a checkbox)
  const renderCategoryIcon = () => {
    const iconColor = isCompleted
      ? Colors.TimelineMutedGray
      : catStyle.iconColor;
    if (item.type === 'task') {
      return <CheckCircle2 size={ResponsivePixels.size12} color={iconColor} strokeWidth={2.4} />;
    }
    if (item.type === 'reminder') {
      return <Bell size={ResponsivePixels.size12} color={iconColor} strokeWidth={2.2} />;
    }
    if (item.type === 'habit') {
      return <Flame size={ResponsivePixels.size12} color={iconColor} strokeWidth={2.2} />;
    }
    if (item.isVoiceNudge) {
      return <Mic size={ResponsivePixels.size12} color={iconColor} strokeWidth={2.4} />;
    }
    return <CheckCircle2 size={ResponsivePixels.size12} color={iconColor} strokeWidth={2.4} />;
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
            isDarkMode && { backgroundColor: Colors.CarbonSlate },
          ]}
        />

        <View style={styles.timeTextContainer}>
          <Text
            style={[
              styles.timeNumber,
              isCompleted && styles.timeCompletedText,
              {
                color: isCompleted
                  ? isDarkMode
                    ? Colors.Gray500
                    : Colors.WarmStoneMuted
                  : textPrimary,
              },
            ]}
          >
            {timeNumber}
          </Text>
          <Text
            style={[
              styles.timePeriod,
              isCompleted && styles.timeCompletedText,
              { color: textSecondary },
            ]}
          >
            {timePeriod}
          </Text>
        </View>

        <View
          style={[
            styles.nodeCircle,
            isDarkMode && { borderColor: Colors.DarkCardBackground },
            {
              backgroundColor: isCompleted
                ? isDarkMode
                  ? Colors.DarkCheckboxUnchecked
                  : Colors.TimelineMutedSurface
                : catStyle.iconBg,
              borderColor: isCompleted
                ? isDarkMode
                  ? Colors.CarbonSlate
                  : Colors.TimelineSubtleDivider
                : catStyle.borderTint,
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
        style={[
          styles.card,
          {
            shadowColor: isCompleted
              ? isDarkMode
                ? Colors.PureBlack
                : Colors.Gray300
              : catStyle.shadowColor,
          },
        ]}
        accessibilityRole="button"
        accessibilityLabel={`${item.title}, ${item.category}, scheduled for ${
          item.time
        }, ${isCompleted ? 'completed' : 'not completed'}`}
      >
        {/* Dynamic Cutout Notch Background SVG with Radiant Aura & Starlight Nodes */}
        <Svg
          width={cardSize.width}
          height={cardSize.height}
          style={styles.cardSvgBackground}
          pointerEvents="none"
        >
          <Defs>
            {!isCompleted && (
              <RadialGradient
                id={`timelineItemAura-${item.id}`}
                cx={cardSize.width - ResponsivePixels.size55}
                cy={ResponsivePixels.size25}
                r={ResponsivePixels.size110}
                gradientUnits="userSpaceOnUse"
              >
                <Stop
                  offset="0%"
                  stopColor={catStyle.auraColor}
                  stopOpacity={0.16}
                />
                <Stop
                  offset="65%"
                  stopColor={catStyle.auraColor}
                  stopOpacity={0.03}
                />
                <Stop
                  offset="100%"
                  stopColor={catStyle.bgTint}
                  stopOpacity={0}
                />
              </RadialGradient>
            )}
          </Defs>
          <Path
            d={getCutoutCardPath(cardSize.width, cardSize.height)}
            fill={
              isCompleted
                ? isDarkMode
                  ? Colors.DarkSurfaceDeep
                  : Colors.CompletedCardCream
                : catStyle.bgTint
            }
            stroke={
              isCompleted
                ? isDarkMode
                  ? Colors.CarbonSlate
                  : Colors.TimelineBorderWarm
                : catStyle.borderTint
            }
            strokeWidth={1.5}
            strokeLinejoin="round"
          />
          {!isCompleted && (
            <>
              {/* Soft ambient radiance under top-right cutout */}
              <Path
                d={getCutoutCardPath(cardSize.width, cardSize.height)}
                fill={`url(#timelineItemAura-${item.id})`}
              />
              {/* Delicate starlight nodes */}
              <Circle
                cx={cardSize.width - ResponsivePixels.size66}
                cy={ResponsivePixels.size16}
                r={1.6}
                fill={catStyle.accent}
                opacity={0.4}
              />
              <Circle
                cx={cardSize.width - ResponsivePixels.size80}
                cy={ResponsivePixels.size30}
                r={1.3}
                fill={catStyle.accent}
                opacity={0.3}
              />
            </>
          )}
        </Svg>

        <View
          style={[
            styles.accentBar,
            {
              backgroundColor: isCompleted
                ? Colors.CompletedBarGray
                : catStyle.accent,
            },
          ]}
        />

        {/* Floating Checkbox */}
        <TouchableOpacity
          activeOpacity={0.75}
          hitSlop={{ top: ResponsivePixels.size8, bottom: ResponsivePixels.size8, left: ResponsivePixels.size8, right: ResponsivePixels.size8 }}
          onPress={() => onToggleComplete?.(item)}
          style={[
            styles.floatingCheckbox,
            isCompleted
              ? styles.floatingCheckboxChecked
              : [
                  styles.floatingCheckboxUnchecked,
                  { borderColor: catStyle.borderTint },
                  isDarkMode && { backgroundColor: Colors.DarkCheckboxUnchecked },
                ],
          ]}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: isCompleted }}
          accessibilityLabel={`Mark ${item.title} as ${
            isCompleted ? 'incomplete' : 'complete'
          }`}
        >
          {isCompleted ? (
            <Check size={ResponsivePixels.size14} color={Colors.GreenGracious} strokeWidth={3} />
          ) : null}
        </TouchableOpacity>

        <View style={styles.cardContent}>
          <View style={styles.cardTopRow}>
            <Text
              style={[
                styles.title,
                isCompleted
                  ? styles.titleCompleted
                  : { color: textPrimary },
              ]}
              numberOfLines={2}
            >
              {item.title}
            </Text>
          </View>

          {item.subtitle ? (
            <Text
              style={[
                styles.subtitle,
                isCompleted
                  ? styles.subtitleCompleted
                  : { color: textSecondary },
              ]}
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
                {
                  backgroundColor: isCompleted
                    ? Colors.CompletedPillNeutral
                    : catStyle.pillBg,
                },
              ]}
            >
              <Clock
                size={ResponsivePixels.size11}
                color={isCompleted ? Colors.Grey : catStyle.pillText}
                style={{ marginRight: ResponsivePixels.size4 }}
              />
              <Text
                style={[
                  styles.timePillText,
                  { color: isCompleted ? Colors.Grey : catStyle.pillText },
                ]}
              >
                {item.timeRange || item.time}
              </Text>
            </View>

            {/* Category or Streak 3D tactile badge matching design system */}
            {typeof item.streak === 'number' &&
            (item.streak > 0 || item.type === 'habit') ? (
              <StreakBadge
                streak={item.streak}
                active={isCompleted || item.streak > 0}
                size="sm"
              />
            ) : item.type === 'reminder' ? (
              <Badge
                label={item.category || 'Reminder'}
                variant={item.category === 'Alert' ? 'red' : 'green'}
                size="sm"
                icon={
                  <Bell
                    size={ResponsivePixels.size10}
                    color={
                      item.category === 'Alert'
                        ? Colors.MoltenRust
                        : Colors.GreenGracious
                    }
                  />
                }
              />
            ) : item.isVoiceNudge ? (
              <Badge
                label="Voice Nudge"
                variant="purple"
                size="sm"
                icon={<Sparkles size={ResponsivePixels.size10} color={Colors.LavenderPurple} />}
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
    marginBottom: ResponsivePixels.size12,
  },
  containerLast: {
    marginBottom: ResponsivePixels.size4,
  },
  timeColumn: {
    width: ResponsivePixels.size40,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  timeTextContainer: {
    position: 'absolute',
    bottom: '50%',
    marginBottom: ResponsivePixels.size15,
    alignItems: 'center',
    backgroundColor: Colors.Transparent,
    paddingHorizontal: ResponsivePixels.size2,
    borderRadius: ResponsivePixels.size3,
    zIndex: 0,
  },
  timeNumber: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: ResponsivePixels.size11_5,
    color: Colors.RegiusInk,
    letterSpacing: -0.2,
    lineHeight: ResponsivePixels.size15,
  },
  timePeriod: {
    fontFamily: Fonts.poppins.medium,
    fontSize: ResponsivePixels.size9,
    color: Colors.TimelineMutedGray,
    lineHeight: ResponsivePixels.size12,
  },
  timeCompletedText: {
    color: Colors.WarmStoneMuted,
  },
  timelineLine: {
    position: 'absolute',
    top: 0,
    bottom: -ResponsivePixels.size16,
    width: ResponsivePixels.size1_5,
    backgroundColor: Colors.TimelineMutedIconBg,
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
    marginTop: -ResponsivePixels.size11,
    width: ResponsivePixels.size22,
    height: ResponsivePixels.size22,
    borderRadius: ResponsivePixels.size11,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
    borderWidth: 1.5,
    borderColor: Colors.PureWhite,
    shadowColor: Colors.PureBlack,
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
    minHeight: ResponsivePixels.size88,
    backgroundColor: Colors.Transparent,
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
  cardCompleted: {
    backgroundColor: Colors.Transparent,
  },
  floatingCheckbox: {
    position: 'absolute',
    top: ResponsivePixels.size9,
    right: ResponsivePixels.size9,
    width: ResponsivePixels.size26,
    height: ResponsivePixels.size26,
    borderRadius: ResponsivePixels.size13, // Perfectly round circular checkbox outside the card
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
  // Retained alias for backwards compatibility
  taskCheckbox: {
    width: ResponsivePixels.size26,
    height: ResponsivePixels.size26,
    borderRadius: ResponsivePixels.size13,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  taskCheckboxChecked: {
    backgroundColor: Colors.BadgeGreenBg,
    borderColor: Colors.WellnessLightBorder,
  },
  taskCheckboxUnchecked: {
    backgroundColor: Colors.PureWhite,
    borderColor: Colors.WarmCheckboxBorder,
  },
  accentBar: {
    width: ResponsivePixels.size3_5,
    height: ResponsivePixels.size36,
    borderTopRightRadius: ResponsivePixels.size3,
    borderBottomRightRadius: ResponsivePixels.size3,
    alignSelf: 'center',
    zIndex: 2,
  },
  cardContent: {
    flex: 1,
    paddingVertical: ResponsivePixels.size13,
    paddingLeft: ResponsivePixels.size12,
    paddingRight: ResponsivePixels.size14,
    justifyContent: 'space-between',
    gap: ResponsivePixels.size6,
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingRight: ResponsivePixels.size48, // Guarantees title stays completely clear of the floating checkbox cutout
  },
  title: {
    flex: 1,
    fontFamily: Fonts.poppins.semiBold,
    fontSize: ResponsivePixels.size14,
    color: Colors.RegiusInk,
    lineHeight: ResponsivePixels.size19,
    letterSpacing: -0.2,
  },
  titleCompleted: {
    color: Colors.TimelineMutedGray,
  },
  subtitle: {
    fontFamily: Fonts.poppins.regular,
    fontSize: ResponsivePixels.size12,
    color: Colors.SubtitleGray,
    lineHeight: ResponsivePixels.size16,
    paddingRight: ResponsivePixels.size36, // Clears the floating checkbox and scooped cutout notch
  },
  subtitleCompleted: {
    color: Colors.WarmSilverMuted,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: ResponsivePixels.size8,
    marginTop: ResponsivePixels.size2,
  },
  timePill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: ResponsivePixels.size8,
    paddingVertical: ResponsivePixels.size3_5,
    borderRadius: ResponsivePixels.size10,
  },
  timePillText: {
    fontFamily: Fonts.poppins.medium,
    fontSize: ResponsivePixels.size11,
    letterSpacing: -0.1,
  },
  voicePrepBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.MindfulSoftPillLight,
    paddingHorizontal: ResponsivePixels.size7,
    paddingVertical: ResponsivePixels.size3_5,
    borderRadius: ResponsivePixels.size10,
  },
  voicePrepBadgeText: {
    fontFamily: Fonts.poppins.medium,
    fontSize: ResponsivePixels.size10_5,
    color: Colors.VioletDeepAccent,
  },
  categoryBadge: {
    backgroundColor: Colors.TimelineEventSoftCream,
    paddingHorizontal: ResponsivePixels.size7,
    paddingVertical: ResponsivePixels.size3_5,
    borderRadius: ResponsivePixels.size10,
  },
  categoryBadgeText: {
    fontFamily: Fonts.poppins.medium,
    fontSize: ResponsivePixels.size10_5,
    color: Colors.WarmCharcoalMuted,
  },
});

export default TimelineItemCard;
