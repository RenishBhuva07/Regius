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
import Svg, { Path, Circle } from 'react-native-svg';
import { Typography } from '../../../Theme/Typographys';
import { Fonts } from '../../../Theme/fonts';
import { SVGS } from '../../../Assets/Images';
import ResponsivePixels from '../../../Assets/StyleUtilities/ResponsivePixels';
import { Reminder } from '../../../Context/TaskReminderContext';
import { CircularProgress } from '../../../Common/CircularProgress';
import { OfficeBagIcon } from '../../../Common/EmblemIcons';

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
    bgColor: '#FFFCEB',
    borderColor: '#FFF5B8',
    shadowColor: '#F5C518',
    Icon: SVGS.FloatHeart,
    accentColor: '#FDD835',
    trackColor: '#FFF5B8',
    progressColor: '#B48216',
    textColor: '#B48216',
  },
  {
    id: 'work',
    label: 'Work',
    bgColor: '#EFF2FE',
    borderColor: '#D8DBFF',
    shadowColor: '#8383D6',
    Icon: OfficeBagIcon,
    accentColor: '#8383D6',
    trackColor: '#D8DBFF',
    progressColor: '#7059C8',
    textColor: '#7059C8',
  },
  {
    id: 'health',
    label: 'Health',
    bgColor: '#EDFDF5',
    borderColor: '#C6FFDD',
    shadowColor: '#52D22E',
    Icon: SVGS.FloatPicture,
    accentColor: '#52D22E',
    trackColor: '#C6FFDD',
    progressColor: '#1B9A72',
    textColor: '#1B9A72',
  },
  {
    id: 'events',
    label: 'Events',
    bgColor: '#FFF3E0',
    borderColor: '#FFE0B2',
    shadowColor: '#FF9800',
    Icon: CalendarCheck,
    accentColor: '#FF9800',
    trackColor: '#FFE0B2',
    progressColor: '#E65100',
    textColor: '#E65100',
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
          <Text style={styles.sectionTitle}>Categories</Text>
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
              selectedCategory !== null && styles.filterBtnActive,
            ]}
            onPress={() => onSelectCategory(selectedCategory ? null : 'daily')}
          >
            <Filter
              size={15}
              color={selectedCategory !== null ? '#FFFFFF' : '#1F2228'}
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
                { backgroundColor: cat.bgColor },
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
                    {
                      borderColor: cat.borderColor,
                      shadowColor: cat.shadowColor,
                    },
                  ]}
                >
                  <cat.Icon width={16} height={16} />
                </View>

                <CircularProgress
                  percent={metrics.percent}
                  trackColor={cat.trackColor}
                  progressColor={cat.progressColor}
                  textColor={cat.textColor}
                  shadowColor={cat.shadowColor}
                />
              </View>

              {/* Card Bottom: Completed/Total Ratio & Category Label */}
              <View style={styles.cardBottom}>
                <Text style={styles.countText}>
                  {metrics.completed}
                  <Text style={styles.countTotalText}>/{metrics.total}</Text>
                </Text>
                <Text style={styles.categoryLabel} numberOfLines={1}>
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
    gap: 8,
  },
  sectionTitle: {
    ...Typography.h6Bold,
    color: '#000000',
    fontSize: 17,
  },
  clearFilterChip: {
    backgroundColor: '#EFF1F4',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  clearFilterText: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: 10.5,
    color: '#454A53',
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
    backgroundColor: '#F5F6F8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterBtnActive: {
    backgroundColor: '#1F2228',
  },
  addBtn: {
    backgroundColor: '#1F2228',
    paddingHorizontal: ResponsivePixels.size14,
    paddingVertical: ResponsivePixels.size6,
    borderRadius: 50,
  },
  addBtnText: {
    ...Typography.bodySmallPoppinsSemiBold,
    color: '#FFFFFF',
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
    borderColor: 'rgba(255, 255, 255, 0.4)',
    justifyContent: 'space-between',
  },
  categoryCardSelected: {
    borderColor: '#FFFFFF',
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
    backgroundColor: '#FFFFFF',
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
    fontSize: 18,
    color: '#1B1C19',
    letterSpacing: -0.4,
    lineHeight: 22,
  },
  countTotalText: {
    fontFamily: Fonts.poppins.medium,
    fontSize: 12,
    color: '#8E8D92',
  },
  categoryLabel: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: 12.5,
    color: '#1B1C19',
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
  progressContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    backgroundColor: '#FFFFFF',
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
