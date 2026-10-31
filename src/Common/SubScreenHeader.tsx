import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  Platform,
  StatusBar,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Fonts } from '../Theme/fonts';
import { useTheme } from '../Theme/ThemeContext';
import { Colors } from '../Assets/StyleUtilities/Colors';
import HeaderPatternSvg from '../Screens/Dashboard/Components/HeaderPatternSvg';
import { BackButton } from './BackButton';
import { Badge, BadgeVariant } from './Badge';

export const SUB_SCREEN_HEADER_HEIGHT = 54;

export interface SubScreenHeaderProps {
  title: string | React.ReactNode;
  subtitle?: string | React.ReactNode;
  scrollY: Animated.Value;
  isScrolled: boolean;
  rightAction?: React.ReactNode | ((isScrolled: boolean) => React.ReactNode);
  badge?: {
    label: string;
    variant?: BadgeVariant;
    size?: 'sm' | 'md' | 'lg';
  };
  onPressBack?: () => void;
  backAccessibilityLabel?: string;
  showBackButton?: boolean;
  headerHeight?: number;
  isAbsolute?: boolean;
  includeStatusBar?: boolean;
  statusBgMain?: string;
  containerStyle?: StyleProp<ViewStyle>;
}

export const SubScreenHeader: React.FC<SubScreenHeaderProps> = ({
  title,
  subtitle,
  scrollY,
  isScrolled,
  rightAction,
  badge,
  onPressBack,
  backAccessibilityLabel = 'Go back',
  showBackButton = true,
  headerHeight = SUB_SCREEN_HEADER_HEIGHT,
  isAbsolute = true,
  includeStatusBar = true,
  statusBgMain,
  containerStyle,
}) => {
  const insets = useSafeAreaInsets();
  const { isDarkMode } = useTheme();
  const { width: screenWidth } = Dimensions.get('window');

  const bgMain = isDarkMode ? '#121417' : Colors.CreamBackground;
  const textPrimary = isDarkMode
    ? Colors.PureWhiteText
    : Colors.MidnightInkText;
  const textSecondary = isDarkMode ? '#A3A8B1' : Colors.SubtitleGray;

  // Interpolate header visual styles based on scroll position (0 to 30px)
  const headerBgColor = scrollY.interpolate({
    inputRange: [0, 30],
    outputRange: [
      isDarkMode ? 'rgba(18, 20, 23, 0)' : 'rgba(255, 252, 227, 0)',
      isDarkMode ? '#282048' : Colors.LavenderPurple,
    ],
    extrapolate: 'clamp',
  });

  const headerRadius = scrollY.interpolate({
    inputRange: [0, 30],
    outputRange: [0, 24],
    extrapolate: 'clamp',
  });

  const headerShadowOpacity = scrollY.interpolate({
    inputRange: [0, 30],
    outputRange: [0, 0.32],
    extrapolate: 'clamp',
  });

  const headerElevation = scrollY.interpolate({
    inputRange: [0, 30],
    outputRange: [0, 8],
    extrapolate: 'clamp',
  });

  const headerPaddingBottom = scrollY.interpolate({
    inputRange: [0, 30],
    outputRange: [0, 8],
    extrapolate: 'clamp',
  });

  const headerPatternOpacity = scrollY.interpolate({
    inputRange: [0, 25],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const renderRight = () => {
    if (rightAction) {
      return typeof rightAction === 'function'
        ? rightAction(isScrolled)
        : rightAction;
    }
    if (badge) {
      return (
        <Badge
          label={badge.label}
          variant={badge.variant ?? 'purple'}
          size={badge.size ?? 'sm'}
        />
      );
    }
    return <View style={styles.dummySpacer} />;
  };

  return (
    <>
      {includeStatusBar && (
        <StatusBar
          barStyle={
            isScrolled
              ? 'light-content'
              : isDarkMode
              ? 'light-content'
              : 'dark-content'
          }
          {...(Platform.OS === 'android'
            ? {
                backgroundColor: isScrolled
                  ? isDarkMode
                    ? '#282048'
                    : Colors.LavenderPurple
                  : statusBgMain ?? bgMain,
                translucent: true,
              }
            : {})}
        />
      )}

      <Animated.View
        style={[
          styles.headerContainer,
          isAbsolute ? styles.headerAbsolute : styles.headerRelative,
          {
            paddingTop: insets.top,
            paddingBottom: headerPaddingBottom,
            backgroundColor: headerBgColor,
            borderBottomLeftRadius: headerRadius,
            borderBottomRightRadius: headerRadius,
            shadowOpacity: headerShadowOpacity,
            elevation: headerElevation,
          },
          containerStyle,
        ]}
      >
        <Animated.View
          pointerEvents="none"
          style={[
            StyleSheet.absoluteFill,
            {
              opacity: headerPatternOpacity,
              borderBottomLeftRadius: headerRadius,
              borderBottomRightRadius: headerRadius,
              overflow: 'hidden',
            },
          ]}
        >
          <HeaderPatternSvg width={screenWidth} insetsTop={insets.top} />
        </Animated.View>

        <View style={[styles.headerRow, { height: headerHeight }]}>
          {showBackButton ? (
            <BackButton
              isScrolled={isScrolled}
              onPress={onPressBack}
              accessibilityLabel={backAccessibilityLabel}
            />
          ) : (
            <View style={styles.dummySpacer} />
          )}

          <View style={styles.headerTitleWrap}>
            {typeof title === 'string' ? (
              <Text
                style={[
                  styles.headerTitle,
                  isScrolled
                    ? styles.headerTitleScrolled
                    : { color: textPrimary },
                ]}
                numberOfLines={1}
              >
                {title}
              </Text>
            ) : (
              title
            )}

            {subtitle != null &&
              (typeof subtitle === 'string' ? (
                <Text
                  style={[
                    styles.headerSubtitle,
                    isScrolled
                      ? styles.headerSubtitleScrolled
                      : { color: textSecondary },
                  ]}
                  numberOfLines={1}
                >
                  {subtitle}
                </Text>
              ) : (
                subtitle
              ))}
          </View>

          {renderRight()}
        </View>
      </Animated.View>
    </>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    shadowColor: '#201646',
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 7,
  },
  headerAbsolute: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
  },
  headerRelative: {
    zIndex: 10,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  dummySpacer: {
    width: 44,
  },
  headerTitleWrap: {
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 10,
  },
  headerTitle: {
    fontFamily: Fonts.ranade.bold,
    fontSize: 18,
    letterSpacing: -0.3,
    lineHeight: 22,
  },
  headerTitleScrolled: {
    color: Colors.DefaultWhite,
  },
  headerSubtitle: {
    fontFamily: Fonts.poppins.regular,
    fontSize: 11,
    marginTop: 1,
  },
  headerSubtitleScrolled: {
    color: 'rgba(255, 255, 255, 0.82)',
  },
});

export default SubScreenHeader;

