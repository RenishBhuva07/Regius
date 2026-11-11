import React from 'react';
import {
  FlatList,
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
} from 'react-native';
import { Compass, Sun, Sparkles, Moon } from 'lucide-react-native';
import { Fonts } from '../../../Theme/fonts';
import { Colors } from '../../../Assets/StyleUtilities/Colors';
import { useAppTheme } from '../../../Theme/useAppTheme';
import { HabitItem } from '../../../Context/TaskReminderContext';

export type HabitFilterKey = 'all' | 'morning' | 'mindful' | 'evening';

interface HabitCategoryFiltersProps {
  activeFilter: HabitFilterKey;
  onSelectFilter: (filter: HabitFilterKey) => void;
  habits: HabitItem[];
}

interface FilterTabConfig {
  key: HabitFilterKey;
  label: string;
  icon: React.ComponentType<any>;
}

const FILTER_CONFIGS: FilterTabConfig[] = [
  { key: 'all', label: 'All Habits', icon: Compass },
  { key: 'morning', label: 'Morning Rituals', icon: Sun },
  { key: 'mindful', label: 'Mindful Breaks', icon: Sparkles },
  { key: 'evening', label: 'Evening Recovery', icon: Moon },
];

export const HabitCategoryFilters: React.FC<HabitCategoryFiltersProps> = ({
  activeFilter,
  onSelectFilter,
  habits,
}) => {
  const { isDarkMode } = useAppTheme();

  const getCategoryCount = (key: HabitFilterKey) => {
    if (key === 'all') return habits.length;
    return habits.filter(h => h.category === key).length;
  };

  return (
    <FlatList
      horizontal
      showsHorizontalScrollIndicator={false}
      data={FILTER_CONFIGS}
      keyExtractor={item => item.key}
      style={styles.scroll}
      contentContainerStyle={styles.container}
      renderItem={({ item }) => {
        const isActive = activeFilter === item.key;
        const IconComponent = item.icon;
        const count = getCategoryCount(item.key);

        return (
          <TouchableOpacity
            key={item.key}
            activeOpacity={0.8}
            onPress={() => onSelectFilter(item.key)}
            style={[
              styles.filterPill,
              isDarkMode && !isActive && {
                backgroundColor: Colors.DarkCardBackground,
                borderColor: Colors.DarkBorderSubtle,
                borderBottomColor: Colors.DarkSurfaceAlt,
              },
              isActive && styles.filterPillActive,
            ]}
          >
            <IconComponent
              size={14}
              color={
                isActive
                  ? Colors.PureWhite
                  : isDarkMode
                  ? Colors.SteelMist
                  : Colors.CharcoalStoneText
              }
              strokeWidth={2.2}
            />
            <Text
              style={[
                styles.filterPillText,
                isDarkMode && !isActive && { color: Colors.SteelMist },
                isActive && styles.filterPillTextActive,
              ]}
            >
              {item.label}
            </Text>
            <View
              style={[
                styles.countBadge,
                isDarkMode && !isActive && { backgroundColor: Colors.DarkCardElevated },
                isActive && styles.countBadgeActive,
              ]}
            >
              <Text
                style={[styles.countText, isActive && styles.countTextActive]}
              >
                {count}
              </Text>
            </View>
          </TouchableOpacity>
        );
      }}
    />
  );
};

const styles = StyleSheet.create({
  scroll: {},
  container: {
    gap: 8,
    paddingVertical: 16,
    paddingHorizontal: 10,
  },
  filterPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 22,
    backgroundColor: Colors.PureWhite,
    borderWidth: 1.5,
    borderColor: Colors.WarmChipBorder,
    borderBottomWidth: 3.5,
    borderBottomColor: Colors.WarmHaloBottomBevel,
    shadowColor: Colors.WarmUmberShadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 3,
  },
  filterPillActive: {
    backgroundColor: Colors.NeroBlack,
    borderWidth: 1.5,
    borderTopColor: Colors.DarkChipBevelTop,
    borderLeftColor: Colors.DarkChipBorder,
    borderRightColor: Colors.DarkChipBorder,
    borderBottomWidth: 3.5,
    borderBottomColor: Colors.DarkChipBevelAbyss,
    shadowColor: Colors.PureBlack,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.28,
    shadowRadius: 5,
    elevation: 5,
  },
  filterPillText: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: 12,
    color: Colors.CharcoalStoneText,
    letterSpacing: -0.1,
  },
  filterPillTextActive: {
    color: Colors.PureWhite,
    fontFamily: Fonts.poppins.bold,
  },
  countBadge: {
    backgroundColor: Colors.PureBlack,
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 1,
    minWidth: 18,
    alignItems: 'center',
  },
  countBadgeActive: {
    backgroundColor: Colors.LavenderPurple,
  },
  countText: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: 10,
    color: Colors.PureWhite,
  },
  countTextActive: {
    color: Colors.PureWhite,
  },
});

export default HabitCategoryFilters;
