import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Platform,
} from 'react-native';
import { Filter } from 'lucide-react-native';
import { Typography } from '../../../Theme/Typographys';
import { Fonts } from '../../../Theme/fonts';
import { Colors, withAlpha } from '../../../Assets/StyleUtilities/Colors';
import { SVGS } from '../../../Assets/Images';
import ResponsivePixels from '../../../Assets/StyleUtilities/ResponsivePixels';
import { Task } from '../../../Context/TaskReminderContext';
import { CircularProgress } from '../../../Common/CircularProgress';
import { OfficeBagIcon } from '../../../Common/EmblemIcons';
import { useAppTheme } from '../../../Theme/useAppTheme';

export interface CategoryItem {
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

const CATEGORY_ITEMS: CategoryItem[] = [
  {
    id: 'works',
    label: 'Works',
    bgColor: Colors.WorkLightBg,
    borderColor: Colors.WorkLightBorder,
    shadowColor: Colors.AccentYellow,
    Icon: OfficeBagIcon,
    accentColor: Colors.TaskGoldVivid,
    trackColor: Colors.WorkLightBorder,
    progressColor: Colors.WorkTextAccent,
    textColor: Colors.WorkTextAccent,
  },
  {
    id: 'sport',
    label: 'Sport',
    bgColor: Colors.WellnessLightBg,
    borderColor: Colors.WellnessLightBorder,
    shadowColor: Colors.AccentGreen,
    Icon: SVGS.FloatHeart,
    accentColor: Colors.AccentGreen,
    trackColor: Colors.WellnessLightBorder,
    progressColor: Colors.GreenGracious,
    textColor: Colors.GreenGracious,
  },
  {
    id: 'habits',
    label: 'Habits',
    bgColor: Colors.MindfulLightBg,
    borderColor: Colors.MindfulLightBorder,
    shadowColor: Colors.LavenderPurple,
    Icon: SVGS.FloatPicture,
    accentColor: Colors.LavenderPurple,
    trackColor: Colors.MindfulLightBorder,
    progressColor: Colors.MindfulTextAccent,
    textColor: Colors.MindfulTextAccent,
  },
];

interface TaskCategoryCarouselProps {
  tasks: Task[];
  selectedCategory: string | null;
  onSelectCategory: (id: string | null) => void;
  onAddPress: () => void;
}

export const TaskCategoryCarousel: React.FC<TaskCategoryCarouselProps> = ({
  tasks,
  selectedCategory,
  onSelectCategory,
  onAddPress,
}) => {
  const { isDarkMode, textPrimary, borderLight, cardBg } =
    useAppTheme();

  const getCategoryMetrics = (catId: string) => {
    const catTasks = tasks.filter(t => {
      if (catId === 'works') return t.category === 'works' || !t.category;
      return t.category === catId;
    });
    const total = catTasks.length;
    const completed = catTasks.filter(t => t.done).length;
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
              style={styles.clearFilterChip}
            >
              <Text style={styles.clearFilterText}>Show All</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.sectionActions}>
          <TouchableOpacity
            activeOpacity={0.7}
            style={[
              styles.filterBtn,
              isDarkMode && {
                backgroundColor: cardBg,
                borderColor: borderLight,
              },
              selectedCategory !== null && styles.filterBtnActive,
            ]}
            onPress={() => onSelectCategory(selectedCategory ? null : 'works')}
          >
            <Filter
              size={15}
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
            accessibilityLabel="Add Task"
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
            ? cat.id === 'works'
              ? Colors.WorkDarkBg
              : cat.id === 'sport'
              ? Colors.WellnessDarkBg
              : Colors.MindfulDarkBg
            : cat.bgColor;
          const cardBorderColor = isDarkMode
            ? cat.id === 'works'
              ? Colors.WorkDarkBorder
              : cat.id === 'sport'
              ? Colors.GreenGracious
              : Colors.LavenderPurple
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
            >
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
                  <cat.Icon width={16} height={16} />
                </View>
                <CircularProgress
                  percent={metrics.percent}
                  trackColor={circularTrack}
                  progressColor={circularProgress}
                  textColor={circularText}
                  shadowColor={cat.shadowColor}
                />
              </View>

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
    gap: 8,
  },
  sectionTitle: {
    ...Typography.h6Bold,
    color: Colors.PureBlack,
    fontSize: 17,
  },
  clearFilterChip: {
    backgroundColor: Colors.GrayPillSurface,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  clearFilterText: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: 10.5,
    color: Colors.DarkIconSlate,
  },
  sectionActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ResponsivePixels.size10,
  },
  filterBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
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
    borderRadius: 50,
  },
  addBtnText: {
    ...Typography.bodySmallPoppinsSemiBold,
    color: Colors.PureWhite,
    fontSize: 11.5,
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
    width: 108,
    borderRadius: 18,
    borderTopRightRadius: 44,
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
    width: 30,
    height: 30,
    borderRadius: 15,
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
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  percentIndicatorText: {
    fontFamily: Fonts.poppins.bold,
    letterSpacing: -0.3,
  },
  cardBottom: {
    gap: 1,
  },
  countText: {
    fontFamily: Fonts.poppins.bold,
    fontSize: 18,
    color: Colors.RegiusInk,
    letterSpacing: -0.4,
    lineHeight: 22,
  },
  countTotalText: {
    fontFamily: Fonts.poppins.medium,
    fontSize: 12,
    color: Colors.TimelineMutedGray,
  },
  categoryLabel: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: 12.5,
    color: Colors.RegiusInk,
    letterSpacing: -0.1,
    lineHeight: 16,
  },
  categoryAccentWrap: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  categoryAccent: {
    height: 3,
    width: 32,
    borderTopLeftRadius: 2.5,
    borderTopRightRadius: 2.5,
  },
});

export default TaskCategoryCarousel;
