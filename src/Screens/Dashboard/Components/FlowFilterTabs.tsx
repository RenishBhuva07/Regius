import React from 'react';
import { FlatList, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Fonts } from '../../../Theme/fonts';
import { Colors } from '../../../Assets/StyleUtilities/Colors';

export type FlowFilter = 'all' | 'tasks' | 'habits' | 'reminders' | 'voice';

export interface FilterTabOption {
  key: FlowFilter;
  label: string;
}

export const DEFAULT_FILTER_TABS: readonly FilterTabOption[] = [
  { key: 'all', label: 'All Flow' },
  { key: 'tasks', label: 'Tasks' },
  { key: 'reminders', label: 'Reminders' },
  { key: 'habits', label: 'Habits' },
] as const;

export interface FlowFilterTabsProps {
  activeFilter: FlowFilter;
  onSelectFilter: (filter: FlowFilter) => void;
  tabs?: readonly FilterTabOption[];
}

export const FlowFilterTabs: React.FC<FlowFilterTabsProps> = React.memo(
  ({ activeFilter, onSelectFilter, tabs = DEFAULT_FILTER_TABS }) => {
    return (
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={tabs as FilterTabOption[]}
        keyExtractor={item => item.key}
        contentContainerStyle={styles.filterRow}
        style={styles.filterScroll}
        renderItem={({ item: f }) => {
          const isActive = activeFilter === f.key;
          return (
            <TouchableOpacity
              key={f.key}
              activeOpacity={0.8}
              onPress={() => onSelectFilter(f.key)}
              style={[styles.filterPill, isActive && styles.filterPillActive]}
              accessibilityRole="tab"
              accessibilityState={{ selected: isActive }}
              accessibilityLabel={`Filter by ${f.label}`}
            >
              <Text
                style={[
                  styles.filterPillText,
                  isActive && styles.filterPillTextActive,
                ]}
              >
                {f.label}
              </Text>
            </TouchableOpacity>
          );
        }}
      />
    );
  },
);

const styles = StyleSheet.create({
  filterScroll: {
    marginHorizontal: -8,
    marginBottom: 6,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 12,
    paddingTop: 6,
    paddingBottom: 16,
  },
  filterPill: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
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
});

export default FlowFilterTabs;
