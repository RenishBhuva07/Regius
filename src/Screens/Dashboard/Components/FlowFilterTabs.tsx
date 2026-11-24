import React from 'react';
import { FlatList, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Fonts } from '../../../Theme/fonts';
import { Colors, withAlpha } from '../../../Assets/StyleUtilities/Colors';
import { useAppTheme } from '../../../Theme/useAppTheme';
import ResponsivePixels from '../../../Assets/StyleUtilities/ResponsivePixels';

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
    const { isDarkMode, activeThemeId, cardBg, borderLight, textSecondary } = useAppTheme();

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
              style={[
                styles.filterPill,
                isDarkMode && {
                  backgroundColor: cardBg,
                  borderColor: borderLight,
                },
                isActive && styles.filterPillActive,
                isActive &&
                  isDarkMode && {
                    backgroundColor: Colors.NeroBlack,
                    borderColor: Colors.WorkDarkBorder,
                  },
              ]}
              accessibilityRole="tab"
              accessibilityState={{ selected: isActive }}
              accessibilityLabel={`Filter by ${f.label}`}
            >
              <Text
                style={[
                  styles.filterPillText,
                  isDarkMode && { color: textSecondary },
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
    marginHorizontal: -ResponsivePixels.size8,
    marginBottom: ResponsivePixels.size8,
  },
  filterRow: {
    flexDirection: 'row',
    gap: ResponsivePixels.size8,
    paddingHorizontal: ResponsivePixels.size12,
    paddingTop: ResponsivePixels.size4,
    paddingBottom: ResponsivePixels.size12,
  },
  filterPill: {
    paddingHorizontal: ResponsivePixels.size16,
    paddingVertical: ResponsivePixels.size8,
    borderRadius: ResponsivePixels.size20,
    backgroundColor: Colors.PureWhite,
    borderWidth: 1,
    borderColor: withAlpha(Colors.CharcoalStoneText, 0.14),
    shadowColor: Colors.PureBlack,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  filterPillActive: {
    backgroundColor: Colors.NeroBlack,
    borderWidth: 1,
    borderColor: withAlpha(Colors.PureWhite, 0.2),
    borderTopColor: withAlpha(Colors.PureWhite, 0.35),
    shadowColor: Colors.PureBlack,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.16,
    shadowRadius: 4,
    elevation: 3,
  },
  filterPillText: {
    fontFamily: Fonts.poppins.medium,
    fontSize: ResponsivePixels.size12,
    color: Colors.CharcoalStoneText,
    letterSpacing: -0.1,
  },
  filterPillTextActive: {
    color: Colors.PureWhite,
    fontFamily: Fonts.poppins.semiBold,
  },
});

export default FlowFilterTabs;
