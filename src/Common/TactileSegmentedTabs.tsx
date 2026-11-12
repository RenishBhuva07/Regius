import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  StyleProp,
  ViewStyle,
  Animated,
} from 'react-native';
import { Fonts } from '../Theme/fonts';
import { Colors, withAlpha } from '../Assets/StyleUtilities/Colors';
import ResponsivePixels from '../Assets/StyleUtilities/ResponsivePixels';
import { useTheme } from '../Theme/ThemeContext';

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
  activeColor = Colors.HabitBurnishedAmber,
  inactiveColor = Colors.TabInactiveSilver,
}: TactileSegmentedTabsProps<T>): React.ReactElement => {
  const { isDarkMode } = useTheme();
  const [containerWidth, setContainerWidth] = useState(0);

  const activeIndex = Math.max(
    0,
    tabs.findIndex(t => t.key === activeTab),
  );
  const slideAnim = useRef(new Animated.Value(activeIndex)).current;

  useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: activeIndex,
      tension: 65,
      friction: 8,
      useNativeDriver: true,
    }).start();
  }, [activeIndex, slideAnim]);

  // Color tokens aligned with 3D tactile pill standard
  const trackBg = isDarkMode ? Colors.DarkCanvasDeep : Colors.WarmSandTrack;
  const trackBorder = isDarkMode ? Colors.DarkSegmentedBorder : Colors.RingBorder;
  const trackBottomBorder = isDarkMode
    ? Colors.DarkSegmentedBottom
    : Colors.WarmBevelLight;

  const indicatorBg = Colors.PureWhite;
  const indicatorBorder = isDarkMode
    ? withAlpha(Colors.PureWhite, 0.95)
    : Colors.RingBorder;
  const indicatorTopBorder = Colors.PureWhite;
  const indicatorBottomBorder = Colors.WarmBevelLight;

  const tabActiveTextColor = Colors.DarkBackground;
  const tabInactiveTextColor = isDarkMode
    ? Colors.DarkMutedCool
    : Colors.MutedCoolText;
  const iconInactiveColor = isDarkMode ? Colors.DarkMutedCool : inactiveColor;

  // Account for 4px padding on left and right = 8px total
  const numTabs = tabs.length;
  const tabWidth =
    containerWidth > 8 && numTabs > 0 ? (containerWidth - 8) / numTabs : 0;

  const inputRange = numTabs >= 2 ? tabs.map((_, i) => i) : [0, 1];
  const outputRange =
    numTabs >= 2 ? tabs.map((_, i) => i * tabWidth) : [0, tabWidth];
  const indicatorTranslateX = slideAnim.interpolate({
    inputRange,
    outputRange,
  });

  return (
    <View
      style={[
        styles.toggleContainer,
        {
          backgroundColor: trackBg,
          borderColor: trackBorder,
          borderBottomColor: trackBottomBorder,
        },
        containerStyle,
      ]}
      onLayout={e => setContainerWidth(e.nativeEvent.layout.width)}
    >
      {/* 3D Volumetric Sliding Indicator Pill */}
      {tabWidth > 0 && (
        <Animated.View
          pointerEvents="none"
          style={[
            styles.slidingIndicator,
            {
              width: tabWidth,
              transform: [{ translateX: indicatorTranslateX }],
              backgroundColor: indicatorBg,
              borderColor: indicatorBorder,
              borderTopColor: indicatorTopBorder,
              borderBottomColor: indicatorBottomBorder,
              shadowOpacity: isDarkMode ? 0.3 : 0.14,
            },
          ]}
        />
      )}

      {tabs.map(tab => {
        const isActive = activeTab === tab.key;
        const IconComponent = tab.icon;

        return (
          <TouchableOpacity
            key={tab.key}
            activeOpacity={0.85}
            onPress={() => onChangeTab(tab.key)}
            style={styles.toggleTab}
            accessibilityRole="tab"
            accessibilityState={{ selected: isActive }}
            accessibilityLabel={`${tab.label}${
              tab.count !== undefined ? `, ${tab.count} items` : ''
            }`}
          >
            {IconComponent && (
              <IconComponent
                size={ResponsivePixels.size14}
                color={isActive ? activeColor : iconInactiveColor}
                strokeWidth={isActive ? 2.4 : 2}
              />
            )}
            <Text
              style={[
                styles.toggleText,
                {
                  color: isActive ? tabActiveTextColor : tabInactiveTextColor,
                  fontFamily: isActive
                    ? Fonts.poppins.bold
                    : Fonts.poppins.semiBold,
                },
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
                    : [
                        styles.tabCountPillInactive,
                        {
                          backgroundColor: isDarkMode
                            ? withAlpha(Colors.PureWhite, 0.1)
                            : withAlpha(Colors.PureBlack, 0.06),
                        },
                      ],
                ]}
              >
                <Text
                  style={[
                    styles.tabCountText,
                    isActive
                      ? getCountTextActiveStyle(tab.countVariant || 'yellow')
                      : [
                          styles.tabCountTextInactive,
                          {
                            color: isDarkMode
                              ? Colors.DarkMutedCool
                              : Colors.MutedCoolText,
                          },
                        ],
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
    position: 'relative',
    flexDirection: 'row',
    marginHorizontal: ResponsivePixels.size10,
    marginTop: ResponsivePixels.size10,
    marginBottom: ResponsivePixels.size6,
    height: ResponsivePixels.size46,
    borderRadius: ResponsivePixels.size50,
    padding: ResponsivePixels.size4,
    borderWidth: 1.5,
    borderBottomWidth: 3,
    ...Platform.select({
      ios: {
        shadowColor: Colors.DarkShadowAnchor,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  slidingIndicator: {
    position: 'absolute',
    top: ResponsivePixels.size4,
    left: ResponsivePixels.size4,
    bottom: ResponsivePixels.size4,
    borderRadius: ResponsivePixels.size50,
    borderWidth: 1,
    borderTopWidth: 1.2,
    borderBottomWidth: 2.5,
    ...Platform.select({
      ios: {
        shadowColor: Colors.PureBlack,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 5,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  toggleTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: ResponsivePixels.size5,
    paddingHorizontal: ResponsivePixels.size8,
    borderRadius: ResponsivePixels.size50,
    gap: ResponsivePixels.size7,
    zIndex: 2,
  },
  toggleText: {
    fontSize: ResponsivePixels.size13,
    letterSpacing: -0.2,
  },
  tabCountPill: {
    paddingHorizontal: ResponsivePixels.size7_5,
    paddingVertical: ResponsivePixels.size1_5,
    borderRadius: ResponsivePixels.size12,
    minWidth: ResponsivePixels.size20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabCountPillInactive: {},
  tabCountText: {
    fontFamily: Fonts.poppins.bold,
    fontSize: ResponsivePixels.size10,
    letterSpacing: 0.2,
  },
  tabCountTextInactive: {},
  countPillActiveYellow: {
    backgroundColor: Colors.BadgeYellowBg,
    borderWidth: 1,
    borderColor: Colors.PureWhite,
    borderBottomWidth: 2,
    borderBottomColor: Colors.WorkDarkBorder,
    ...Platform.select({
      ios: {
        shadowColor: Colors.HabitBurnishedAmber,
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
    color: Colors.BadgeYellowText,
  },
  countPillActiveGreen: {
    backgroundColor: Colors.BadgeGreenBg,
    borderWidth: 1,
    borderColor: Colors.PureWhite,
    borderBottomWidth: 2,
    borderBottomColor: Colors.BadgeGreenBevel,
    ...Platform.select({
      ios: {
        shadowColor: Colors.AccentGreen,
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
    color: Colors.GreenGracious,
  },
  countPillActivePurple: {
    backgroundColor: Colors.BadgePurpleBg,
    borderWidth: 1,
    borderColor: Colors.PureWhite,
    borderBottomWidth: 2,
    borderBottomColor: Colors.BadgePurpleBevel,
    ...Platform.select({
      ios: {
        shadowColor: Colors.LavenderPurple,
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
    color: Colors.MindfulTextAccent,
  },
  countPillActiveNeutral: {
    backgroundColor: Colors.Gray100,
    borderWidth: 1,
    borderColor: Colors.PureWhite,
    borderBottomWidth: 2,
    borderBottomColor: Colors.Gray300,
  },
  countTextActiveNeutral: {
    color: Colors.Gray800,
  },
});

export default TactileSegmentedTabs;
