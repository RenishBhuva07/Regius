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
    const cardBg = isDarkMode ? Colors.DarkCardBackground : Colors.PureWhite;
    const borderLight = isDarkMode ? Colors.CarbonSlate : Colors.RingBorder;
    const textSecondary = isDarkMode ? Colors.SteelMist : Colors.SubtitleGray;

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
                      ? Colors.PureWhite
                      : Colors.MidnightCharcoal
                    : cardBg,
                  borderColor: isActive ? Colors.Transparent : borderLight,
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
                        ? Colors.PureBlack
                        : Colors.PureWhite
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
    gap: ResponsivePixels.size8,
    paddingHorizontal: ResponsivePixels.size16,
    marginBottom: ResponsivePixels.size20,
  },
  filterTabPill: {
    paddingHorizontal: ResponsivePixels.size14,
    paddingVertical: ResponsivePixels.size8,
    borderRadius: ResponsivePixels.size20,
    borderWidth: 1,
  },
  filterTabPillActive: {
    shadowColor: Colors.PureBlack,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 2,
  },
  filterTabText: {
    fontSize: ResponsivePixels.size12,
  },
});

export default ThemeFilterTabs;
