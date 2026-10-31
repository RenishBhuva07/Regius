import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

import { Fonts } from '../../../Theme/fonts';
import { Colors } from '../../../Assets/StyleUtilities/Colors';
import ResponsivePixels from '../../../Assets/StyleUtilities/ResponsivePixels';

export type ThemeFilterTab = 'all' | 'unlocked' | 'locked';

export interface ThemeFilterTabsProps {
  activeTab: ThemeFilterTab;
  onSelectTab: (tab: ThemeFilterTab) => void;
  totalThemes: number;
  unlockedCount: number;
  isDarkMode: boolean;
}

export const ThemeFilterTabs: React.FC<ThemeFilterTabsProps> = React.memo(
  ({ activeTab, onSelectTab, totalThemes, unlockedCount, isDarkMode }) => {
    const cardBg = isDarkMode ? '#1E2228' : Colors.DefaultWhite;
    const borderLight = isDarkMode ? '#2C3035' : '#E8E2D5';
    const textSecondary = isDarkMode ? '#A3A8B1' : Colors.SubtitleGray;

    return (
      <View style={styles.filterTabsContainer}>
        {(['all', 'unlocked', 'locked'] as ThemeFilterTab[]).map(tab => {
          const isActive = activeTab === tab;
          const label =
            tab === 'all'
              ? `All (${totalThemes})`
              : tab === 'unlocked'
              ? `Unlocked (${unlockedCount})`
              : `Rewards (${totalThemes - unlockedCount})`;

          return (
            <TouchableOpacity
              key={tab}
              activeOpacity={0.8}
              onPress={() => onSelectTab(tab)}
              style={[
                styles.filterTabPill,
                isActive && styles.filterTabPillActive,
                {
                  backgroundColor: isActive
                    ? isDarkMode
                      ? '#FFFFFF'
                      : Colors.MidnightCharcoal
                    : cardBg,
                  borderColor: isActive ? 'transparent' : borderLight,
                },
              ]}
              accessibilityRole="button"
              accessibilityLabel={`Filter ${label}`}
            >
              <Text
                style={[
                  styles.filterTabText,
                  {
                    color: isActive
                      ? isDarkMode
                        ? '#000000'
                        : Colors.PureWhiteText
                      : textSecondary,
                    fontFamily: isActive
                      ? Fonts.poppins.bold
                      : Fonts.poppins.medium,
                  },
                ]}
              >
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  },
);

const styles = StyleSheet.create({
  filterTabsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    marginBottom: ResponsivePixels.size20,
  },
  filterTabPill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  filterTabPillActive: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 2,
  },
  filterTabText: {
    fontSize: 12,
  },
});

export default ThemeFilterTabs;
