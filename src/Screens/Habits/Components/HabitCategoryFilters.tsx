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
            style={[styles.filterPill, isActive && styles.filterPillActive]}
          >
            <IconComponent
              size={14}
              color={isActive ? Colors.DefaultWhite : '#555450'}
              strokeWidth={2.2}
            />
            <Text
              style={[
                styles.filterPillText,
                isActive && styles.filterPillTextActive,
              ]}
            >
              {item.label}
            </Text>
            <View
              style={[styles.countBadge, isActive && styles.countBadgeActive]}
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
    backgroundColor: Colors.DefaultWhite,
    borderWidth: 1.5,
    borderColor: '#ECE7DB',
    borderBottomWidth: 3.5,
    borderBottomColor: '#D8D1C0',
    shadowColor: '#5C5441',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 3,
  },
  filterPillActive: {
    backgroundColor: Colors.NeroBlack,
    borderWidth: 1.5,
    borderTopColor: '#454955',
    borderLeftColor: '#333640',
    borderRightColor: '#333640',
    borderBottomWidth: 3.5,
    borderBottomColor: '#0A0B0E',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.28,
    shadowRadius: 5,
    elevation: 5,
  },
  filterPillText: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: 12,
    color: '#555450',
    letterSpacing: -0.1,
  },
  filterPillTextActive: {
    color: Colors.DefaultWhite,
    fontFamily: Fonts.poppins.bold,
  },
  countBadge: {
    backgroundColor: Colors.DefaultBlack,
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
    color: Colors.DefaultWhite,
  },
  countTextActive: {
    color: Colors.DefaultWhite,
  },
});

export default HabitCategoryFilters;
