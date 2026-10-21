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
import Svg, { Path } from 'react-native-svg';
import { Typography } from '../../../Theme/Typographys';
import { Fonts } from '../../../Theme/fonts';
import { Colors } from '../../../Assets/StyleUtilities/Colors';
import { SVGS } from '../../../Assets/Images';
import ResponsivePixels from '../../../Assets/StyleUtilities/ResponsivePixels';
import { Task } from '../../../Context/TaskReminderContext';

const OfficeBagIcon: React.FC<{ width?: number; height?: number }> = ({
  width = 24,
  height = 24,
}) => (
  <Svg width={width} height={height} viewBox="23 19 24 24" fill="none">
    <Path
      opacity={0.4}
      d="M25.0002 30.0785C25.0502 32.4165 25.1902 36.4155 25.2102 36.8565C25.2812 37.7995 25.6422 38.7525 26.2042 39.4245C26.9862 40.3675 27.9492 40.7885 29.2922 40.7885C31.1482 40.7985 33.1942 40.7985 35.1812 40.7985C37.1762 40.7985 39.1122 40.7985 40.7472 40.7885C42.0712 40.7885 43.0642 40.3565 43.8362 39.4245C44.3982 38.7525 44.7592 37.7895 44.8102 36.8565C44.8302 36.4855 44.9302 32.1445 44.9902 30.0785H25.0002Z"
      fill="#FFE600"
    />
    <Path
      d="M34.2454 34.3842V35.6782C34.2454 36.0922 34.5814 36.4282 34.9954 36.4282C35.4094 36.4282 35.7454 36.0922 35.7454 35.6782V34.3842C35.7454 33.9702 35.4094 33.6342 34.9954 33.6342C35.4094 33.6342 34.2454 33.9702 34.2454 34.3842Z"
      fill="#FFE600"
    />
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M33.2113 33.5564C33.1113 33.9194 32.7623 34.1514 32.3843 34.1014C29.8333 33.7454 27.3953 32.8404 25.3373 31.4814C25.1263 31.3434 25.0003 31.1074 25.0003 30.8554V27.3894C25.0003 25.2894 26.7123 23.5814 28.8173 23.5814H30.7843C30.9723 22.1294 32.2023 21.0004 33.7043 21.0004H36.2863C37.7873 21.0004 39.0183 22.1294 39.2063 23.5814H41.1833C43.2823 23.5814 44.9903 25.2894 44.9903 27.3894V30.8554C44.9903 31.1074 44.8633 31.3424 44.6543 31.4814C42.5923 32.8464 40.1443 33.7554 37.5763 34.1104C37.5413 34.1154 37.5073 34.1174 37.4733 34.1174C37.1343 34.1174 36.8313 33.8884 36.7463 33.5524C36.5443 32.7564 35.8213 32.1994 34.9903 32.1994C34.1483 32.1994 33.4333 32.7444 33.2113 33.5564ZM36.2863 22.5004H33.7043C33.0313 22.5004 32.4693 22.9604 32.3013 23.5814H37.6883C37.5203 22.9604 36.9583 22.5004 36.2863 22.5004Z"
      fill="#FFE600"
    />
  </Svg>
);

export interface CategoryItem {
  id: string;
  label: string;
  bgColor: string;
  borderColor: string;
  shadowColor: string;
  Icon: React.ComponentType<any>;
  accentColor: string;
}

const CATEGORY_ITEMS: CategoryItem[] = [
  {
    id: 'works',
    label: 'Works',
    bgColor: '#FFFCEB',
    borderColor: '#FFF5B8',
    shadowColor: '#F5C518',
    Icon: OfficeBagIcon,
    accentColor: '#FDD835',
  },
  {
    id: 'sport',
    label: 'Sport',
    bgColor: '#EDFDF5',
    borderColor: '#C6FFDD',
    shadowColor: '#52D22E',
    Icon: SVGS.FloatHeart,
    accentColor: '#52D22E',
  },
  {
    id: 'habits',
    label: 'Habits',
    bgColor: '#EFF2FE',
    borderColor: '#D8DBFF',
    shadowColor: '#8383D6',
    Icon: SVGS.FloatPicture,
    accentColor: '#8383D6',
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
  const getCategoryCount = (catId: string): string => {
    const count = tasks.filter(t => {
      if (catId === 'works') return t.category === 'works' || !t.category;
      return t.category === catId;
    }).length;
    return `+${count.toString().padStart(2, '0')} task`;
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
            onPress={() => onSelectCategory(selectedCategory ? null : 'works')}
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
          const countLabel = getCategoryCount(cat.id);

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
            >
              <View
                style={[
                  styles.categoryIconWrap,
                  {
                    borderColor: cat.borderColor,
                    shadowColor: cat.shadowColor,
                  },
                ]}
              >
                <cat.Icon width={24} height={24} />
              </View>
              <Text style={styles.categoryLabel}>{cat.label}</Text>
              <Text style={styles.categoryCount}>{countLabel}</Text>
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
  container: {
    marginVertical: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: ResponsivePixels.size20,
    marginTop: ResponsivePixels.size14,
    marginBottom: ResponsivePixels.size12,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: {
    ...Typography.h6Bold,
    color: '#000000',
    fontSize: 18,
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
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#F5F6F8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterBtnActive: {
    backgroundColor: '#1F2228',
  },
  addBtn: {
    backgroundColor: '#1F2228',
    paddingHorizontal: ResponsivePixels.size16,
    paddingVertical: ResponsivePixels.size8,
    borderRadius: 50,
  },
  addBtnText: {
    ...Typography.bodySmallPoppinsSemiBold,
    color: '#FFFFFF',
    fontSize: 12,
  },
  categoriesScroll: {
    overflow: 'visible',
    marginBottom: ResponsivePixels.size4,
  },
  categoriesRow: {
    paddingHorizontal: ResponsivePixels.size20,
    paddingTop: ResponsivePixels.size6,
    paddingBottom: ResponsivePixels.size20,
    gap: ResponsivePixels.size14,
  },
  categoryCard: {
    width: 124,
    borderRadius: 23,
    borderTopRightRadius: 63,
    padding: ResponsivePixels.size16,
    paddingBottom: ResponsivePixels.size18,
    gap: ResponsivePixels.size6,
    position: 'relative',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  categoryCardSelected: {
    borderColor: '#FFFFFF',
    ...Platform.select({
      ios: {
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.38,
        shadowRadius: 14,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  categoryIconWrap: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: ResponsivePixels.size8,
    ...Platform.select({
      ios: {
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.22,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  categoryLabel: {
    ...Typography.bodyMediumPoppinsSemiBold,
    color: '#000000',
    fontSize: 15,
  },
  categoryCount: {
    ...Typography.bodySmallPoppinsRegular,
    color: Colors.SubtitleGray,
    fontSize: 12,
  },
  categoryAccentWrap: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  categoryAccent: {
    height: 4,
    width: 48,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },
});

export default TaskCategoryCarousel;
