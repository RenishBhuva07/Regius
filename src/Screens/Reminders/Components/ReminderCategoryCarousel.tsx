import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Platform,
} from 'react-native';
import { Filter, CalendarCheck } from 'lucide-react-native';
import { Typography } from '../../../Theme/Typographys';
import { Fonts } from '../../../Theme/fonts';
import { SVGS } from '../../../Assets/Images';
import ResponsivePixels from '../../../Assets/StyleUtilities/ResponsivePixels';
import { Reminder } from '../../../Context/TaskReminderContext';
import { CircularProgress } from '../../../Common/CircularProgress';
import { OfficeBagIcon } from '../../../Common/EmblemIcons';
import { Colors, withAlpha } from '../../../Assets/StyleUtilities/Colors';
import { useAppTheme } from '../../../Theme/useAppTheme';

export interface ReminderCategoryItem {
  id: string;
  label: string;
  bgColor: string;
  borderColor: string;
  shadowColor: string;
  Icon: React.ComponentType<any>;
  accentColor: string;
  trackColor: string;
  progressColor: string;
  textColor: string;
}

const CATEGORY_ITEMS: ReminderCategoryItem[] = [
  {
    id: 'daily',
    label: 'Daily',
    bgColor: Colors.WorkLightBg,
    borderColor: Colors.WorkLightBorder,
    shadowColor: Colors.AccentYellow,
    Icon: SVGS.FloatHeart,
    accentColor: Colors.TaskGoldVivid,
    trackColor: Colors.WorkLightBorder,
    progressColor: Colors.WorkTextAccent,
    textColor: Colors.WorkTextAccent,
  },
  {
    id: 'work',
    label: 'Work',
    bgColor: Colors.MindfulLightBg,
    borderColor: Colors.MindfulLightBorder,
    shadowColor: Colors.LavenderPurple,
    Icon: OfficeBagIcon,
    accentColor: Colors.LavenderPurple,
    trackColor: Colors.MindfulLightBorder,
    progressColor: Colors.MindfulTextAccent,
    textColor: Colors.MindfulTextAccent,
  },
  {
    id: 'health',
    label: 'Health',
    bgColor: Colors.WellnessLightBg,
    borderColor: Colors.WellnessLightBorder,
    shadowColor: Colors.AccentGreen,
    Icon: SVGS.FloatPicture,
    accentColor: Colors.AccentGreen,
    trackColor: Colors.WellnessLightBorder,
    progressColor: Colors.GreenGracious,
    textColor: Colors.GreenGracious,
  },
  {
    id: 'events',
    label: 'Events',
    bgColor: Colors.EventIconBgLight,
    borderColor: Colors.EventLightBorder,
    shadowColor: Colors.AccentAmber,
    Icon: CalendarCheck,
    accentColor: Colors.AccentAmber,
    trackColor: Colors.EventLightBorder,
    progressColor: Colors.EventTextAccent,
    textColor: Colors.EventTextAccent,
  },
];

interface ReminderCategoryCarouselProps {
  reminders: Reminder[];
  selectedCategory: string | null;
  onSelectCategory: (id: string | null) => void;
  onAddPress: () => void;
}

export const ReminderCategoryCarousel: React.FC<
  ReminderCategoryCarouselProps
> = ({ reminders, selectedCategory, onSelectCategory, onAddPress }) => {
  const { isDarkMode, textPrimary } = useAppTheme();

  const getCategoryMetrics = (catId: string) => {
    const catReminders = reminders.filter(r => r.category === catId);
    const total = catReminders.length;
    const completed = catReminders.filter(r => r.done).length;
    const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { total, completed, percent };
  };

  return (
    <View style={styles.container}>
      {/* Section Header */}
      <View style={styles.sectionHeader}>
        <View style={styles.titleRow}>
          <Text style={[styles.sectionTitle, { color: textPrimary }]}>
            Categories
          </Text>
          {selectedCategory && (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => onSelectCategory(null)}
              style={[
                styles.clearFilterChip,
                isDarkMode && { backgroundColor: Colors.DarkCardBackground },
              ]}
            >
              <Text
                style={[
                  styles.clearFilterText,
                  isDarkMode && { color: Colors.SteelMist },
                ]}
              >
                Show All
              </Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.sectionActions}>
          <TouchableOpacity
            activeOpacity={0.7}
            style={[
              styles.filterBtn,
              isDarkMode && { backgroundColor: Colors.DarkCardBackground },
              selectedCategory !== null && styles.filterBtnActive,
            ]}
            onPress={() => onSelectCategory(selectedCategory ? null : 'daily')}
          >
            <Filter
              size={ResponsivePixels.size15}
              color={
                selectedCategory !== null
                  ? Colors.PureWhite
                  : isDarkMode
                  ? Colors.PureWhite
                  : Colors.MidnightCharcoal
              }
              strokeWidth={2.2}
            />
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.85}
            style={styles.addBtn}
            onPress={onAddPress}
            accessibilityRole="button"
            accessibilityLabel="Add Reminder"
          >
            <Text style={styles.addBtnText}>Add</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Horizontal Carousel */}
      <FlatList
        horizontal
        data={CATEGORY_ITEMS}
        keyExtractor={item => item.id}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesRow}
        style={styles.categoriesScroll}
        renderItem={({ item: cat }) => {
          const isSelected = selectedCategory === cat.id;
          const metrics = getCategoryMetrics(cat.id);

          const cardBgColor = isDarkMode
            ? cat.id === 'daily'
              ? Colors.WorkDarkBg
              : cat.id === 'health'
              ? Colors.WellnessDarkBg
              : cat.id === 'work'
              ? Colors.MindfulDarkBg
              : Colors.EventDarkBg
            : cat.bgColor;
          const cardBorderColor = isDarkMode
            ? cat.id === 'daily'
              ? Colors.WorkDarkBorder
              : cat.id === 'health'
              ? Colors.GreenGracious
              : cat.id === 'work'
              ? Colors.LavenderPurple
              : Colors.AccentAmber
            : cat.borderColor;
          const circularTrack = isDarkMode
            ? withAlpha(Colors.PureWhite, 0.12)
            : cat.trackColor;
          const circularProgress = isDarkMode
            ? cat.accentColor
            : cat.progressColor;
          const circularText = isDarkMode ? Colors.PureWhite : cat.textColor;

          return (
            <TouchableOpacity
              key={cat.id}
              activeOpacity={0.85}
              onPress={() => {
                if (selectedCategory === cat.id) {
                  onSelectCategory(null);
                } else {
                  onSelectCategory(cat.id);
                }
              }}
              style={[
                styles.categoryCard,
                {
                  backgroundColor: cardBgColor,
                  borderColor: isSelected
                    ? cardBorderColor
                    : isDarkMode
                    ? withAlpha(Colors.PureWhite, 0.1)
                    : Colors.Transparent,
                },
                isSelected && [
                  styles.categoryCardSelected,
                  { shadowColor: cat.shadowColor },
                ],
              ]}
              accessibilityRole="button"
              accessibilityState={{ selected: isSelected }}
              accessibilityLabel={`${cat.label} category, ${metrics.total} reminders`}
            >
              {/* Card Top: Icon Wrap + Circular Progress */}
              <View style={styles.cardTop}>
                <View
                  style={[
                    styles.categoryIconWrap,
                    isDarkMode && {
                      backgroundColor: Colors.DarkCardElevated,
                      borderColor: cardBorderColor,
                    },
                    {
                      borderColor: isDarkMode
                        ? cardBorderColor
                        : cat.borderColor,
                      shadowColor: cat.shadowColor,
                    },
                  ]}
                >
                  <cat.Icon
                    width={ResponsivePixels.size16}
                    height={ResponsivePixels.size16}
                  />
                </View>

                <CircularProgress
                  percent={metrics.percent}
                  trackColor={circularTrack}
                  progressColor={circularProgress}
                  textColor={circularText}
                  shadowColor={cat.shadowColor}
                />
              </View>

              {/* Card Bottom: Completed/Total Ratio & Category Label */}
              <View style={styles.cardBottom}>
                <Text style={[styles.countText, { color: textPrimary }]}>
                  {metrics.completed}
                  <Text style={styles.countTotalText}>/{metrics.total}</Text>
                </Text>
                <Text
                  style={[styles.categoryLabel, { color: textPrimary }]}
                  numberOfLines={1}
                >
                  {cat.label}
                </Text>
              </View>

              {/* Selected indicator bottom accent */}
              {isSelected && cat.accentColor ? (
                <View style={styles.categoryAccentWrap}>
                  <View
                    style={[
                      styles.categoryAccent,
                      { backgroundColor: cat.accentColor },
                    ]}
                  />
                </View>
              ) : null}
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: ResponsivePixels.size20,
    marginTop: ResponsivePixels.size10,
    marginBottom: ResponsivePixels.size10,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ResponsivePixels.size8,
  },
  sectionTitle: {
    ...Typography.h6Bold,
    color: Colors.PureBlack,
    fontSize: ResponsivePixels.size17,
  },
  clearFilterChip: {
    backgroundColor: Colors.GrayPillSurface,
    paddingHorizontal: ResponsivePixels.size8,
    paddingVertical: ResponsivePixels.size3,
    borderRadius: ResponsivePixels.size12,
  },
  clearFilterText: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: ResponsivePixels.size10_5,
    color: Colors.DarkIconSlate,
  },
  sectionActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ResponsivePixels.size10,
  },
  filterBtn: {
    width: ResponsivePixels.size32,
    height: ResponsivePixels.size32,
    borderRadius: ResponsivePixels.size16,
    backgroundColor: Colors.CoolNeutralSurface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterBtnActive: {
    backgroundColor: Colors.MidnightCharcoal,
  },
  addBtn: {
    backgroundColor: Colors.MidnightCharcoal,
    paddingHorizontal: ResponsivePixels.size14,
    paddingVertical: ResponsivePixels.size6,
    borderRadius: ResponsivePixels.size50,
  },
  addBtnText: {
    ...Typography.bodySmallPoppinsSemiBold,
    color: Colors.PureWhite,
    fontSize: ResponsivePixels.size11_5,
  },
  categoriesScroll: {
    overflow: 'visible',
    marginBottom: ResponsivePixels.size2,
  },
  categoriesRow: {
    paddingHorizontal: ResponsivePixels.size20,
    paddingBottom: ResponsivePixels.size8,
    gap: ResponsivePixels.size10,
  },
  categoryCard: {
    width: ResponsivePixels.size108,
    borderRadius: ResponsivePixels.size18,
    borderTopRightRadius: ResponsivePixels.size44,
    paddingTop: ResponsivePixels.size12,
    paddingBottom: ResponsivePixels.size12,
    paddingHorizontal: ResponsivePixels.size11,
    position: 'relative',
    borderWidth: 1.5,
    borderColor: withAlpha(Colors.PureWhite, 0.4),
    justifyContent: 'space-between',
  },
  categoryCardSelected: {
    borderColor: Colors.PureWhite,
    ...Platform.select({
      ios: {
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.32,
        shadowRadius: 10,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: ResponsivePixels.size8,
  },
  categoryIconWrap: {
    width: ResponsivePixels.size30,
    height: ResponsivePixels.size30,
    borderRadius: ResponsivePixels.size15,
    backgroundColor: Colors.PureWhite,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 3,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  cardBottom: {},
  countText: {
    fontFamily: Fonts.poppins.bold,
    fontSize: ResponsivePixels.size18,
    color: Colors.RegiusInk,
    letterSpacing: -0.4,
    lineHeight: ResponsivePixels.size22,
  },
  countTotalText: {
    fontFamily: Fonts.poppins.medium,
    fontSize: ResponsivePixels.size12,
    color: Colors.TimelineMutedGray,
  },
  categoryLabel: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: ResponsivePixels.size12_5,
    color: Colors.RegiusInk,
    letterSpacing: -0.1,
    lineHeight: ResponsivePixels.size16,
  },
  categoryAccentWrap: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  categoryAccent: {
    height: ResponsivePixels.size3,
    width: ResponsivePixels.size32,
    borderTopLeftRadius: ResponsivePixels.size2_5,
    borderTopRightRadius: ResponsivePixels.size2_5,
  },
  progressContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    backgroundColor: Colors.PureWhite,
    ...Platform.select({
      ios: {
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 3,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  svgRotator: {
    transform: [{ rotate: '-90deg' }],
  },
  percentTextContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  percentIndicatorText: {
    fontFamily: Fonts.poppins.bold,
    textAlign: 'center',
    includeFontPadding: false,
  },
});

export default ReminderCategoryCarousel;
