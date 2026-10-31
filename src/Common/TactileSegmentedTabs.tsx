import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { Fonts } from '../Theme/fonts';
import { Colors } from '../Assets/StyleUtilities/Colors';

export type CountPillVariant = 'yellow' | 'green' | 'purple' | 'neutral';

export interface TabItem<T extends string = string> {
  key: T;
  label: string;
  icon?: React.ComponentType<{
    size?: number;
    color?: string;
    strokeWidth?: number;
  }>;
  count?: number;
  countVariant?: CountPillVariant;
}

export interface TactileSegmentedTabsProps<T extends string = string> {
  tabs: TabItem<T>[];
  activeTab: T;
  onChangeTab: (key: T) => void;
  containerStyle?: StyleProp<ViewStyle>;
  activeColor?: string;
  inactiveColor?: string;
}

export const TactileSegmentedTabs = <T extends string = string>({
  tabs,
  activeTab,
  onChangeTab,
  containerStyle,
  activeColor = '#D97706',
  inactiveColor = '#9EA3B0',
}: TactileSegmentedTabsProps<T>): React.ReactElement => {
  return (
    <View style={[styles.toggleContainer, containerStyle]}>
      {tabs.map(tab => {
        const isActive = activeTab === tab.key;
        const IconComponent = tab.icon;

        return (
          <TouchableOpacity
            key={tab.key}
            activeOpacity={0.85}
            onPress={() => onChangeTab(tab.key)}
            style={[styles.toggleTab, isActive && styles.toggleTabActive]}
            accessibilityRole="tab"
            accessibilityState={{ selected: isActive }}
            accessibilityLabel={`${tab.label}${
              tab.count !== undefined ? `, ${tab.count} items` : ''
            }`}
          >
            {IconComponent && (
              <IconComponent
                size={14}
                color={isActive ? activeColor : inactiveColor}
                strokeWidth={isActive ? 2.4 : 2}
              />
            )}
            <Text
              style={[
                styles.toggleText,
                isActive ? styles.toggleTextActive : styles.toggleTextInactive,
              ]}
              numberOfLines={1}
            >
              {tab.label}
            </Text>
            {tab.count !== undefined && (
              <View
                style={[
                  styles.tabCountPill,
                  isActive
                    ? getCountPillActiveStyle(tab.countVariant || 'yellow')
                    : styles.tabCountPillInactive,
                ]}
              >
                <Text
                  style={[
                    styles.tabCountText,
                    isActive
                      ? getCountTextActiveStyle(tab.countVariant || 'yellow')
                      : styles.tabCountTextInactive,
                  ]}
                >
                  {tab.count}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const getCountPillActiveStyle = (variant: CountPillVariant) => {
  switch (variant) {
    case 'green':
      return styles.countPillActiveGreen;
    case 'purple':
      return styles.countPillActivePurple;
    case 'neutral':
      return styles.countPillActiveNeutral;
    case 'yellow':
    default:
      return styles.countPillActiveYellow;
  }
};

const getCountTextActiveStyle = (variant: CountPillVariant) => {
  switch (variant) {
    case 'green':
      return styles.countTextActiveGreen;
    case 'purple':
      return styles.countTextActivePurple;
    case 'neutral':
      return styles.countTextActiveNeutral;
    case 'yellow':
    default:
      return styles.countTextActiveYellow;
  }
};

const styles = StyleSheet.create({
  toggleContainer: {
    flexDirection: 'row',
    marginHorizontal: 10,
    marginTop: 10,
    marginBottom: 6,
    backgroundColor: '#181A20',
    borderRadius: 50,
    padding: 4.5,
    borderWidth: 1.5,
    borderTopColor: '#363A48',
    borderLeftColor: '#282B35',
    borderRightColor: '#282B35',
    borderBottomWidth: 3,
    borderBottomColor: '#0E1015',
    ...Platform.select({
      ios: {
        shadowColor: '#0B0D11',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.25,
        shadowRadius: 10,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  toggleTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderRadius: 50,
    gap: 7,
  },
  toggleTabActive: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.95)',
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.22,
        shadowRadius: 6,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  toggleText: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: 13,
    letterSpacing: -0.2,
  },
  toggleTextActive: {
    fontFamily: Fonts.poppins.bold,
    color: '#121417',
  },
  toggleTextInactive: {
    fontFamily: Fonts.poppins.semiBold,
    color: '#E5E7EB',
  },
  tabCountPill: {
    paddingHorizontal: 7.5,
    paddingVertical: 1.5,
    borderRadius: 12,
    minWidth: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabCountPillInactive: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  tabCountText: {
    fontFamily: Fonts.poppins.bold,
    fontSize: 10,
    letterSpacing: 0.2,
  },
  tabCountTextInactive: {
    color: '#9EA3B0',
  },
  countPillActiveYellow: {
    backgroundColor: '#FFF8D0',
    borderWidth: 1,
    borderColor: '#FFFFFF',
    borderBottomWidth: 2,
    borderBottomColor: '#DEAA14',
    ...Platform.select({
      ios: {
        shadowColor: '#D97706',
        shadowOffset: { width: 0, height: 1.5 },
        shadowOpacity: 0.25,
        shadowRadius: 2.5,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  countTextActiveYellow: {
    color: '#B47804',
  },
  countPillActiveGreen: {
    backgroundColor: '#E8FDF0',
    borderWidth: 1,
    borderColor: '#FFFFFF',
    borderBottomWidth: 2,
    borderBottomColor: '#82E8A6',
    ...Platform.select({
      ios: {
        shadowColor: '#52D22E',
        shadowOffset: { width: 0, height: 1.5 },
        shadowOpacity: 0.22,
        shadowRadius: 2.5,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  countTextActiveGreen: {
    color: '#1B9A72',
  },
  countPillActivePurple: {
    backgroundColor: '#EEF0FD',
    borderWidth: 1,
    borderColor: '#FFFFFF',
    borderBottomWidth: 2,
    borderBottomColor: '#B6BEF5',
    ...Platform.select({
      ios: {
        shadowColor: '#8383D6',
        shadowOffset: { width: 0, height: 1.5 },
        shadowOpacity: 0.22,
        shadowRadius: 2.5,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  countTextActivePurple: {
    color: '#7059C8',
  },
  countPillActiveNeutral: {
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#FFFFFF',
    borderBottomWidth: 2,
    borderBottomColor: '#D1D5DB',
  },
  countTextActiveNeutral: {
    color: '#1F2937',
  },
});

export default TactileSegmentedTabs;
