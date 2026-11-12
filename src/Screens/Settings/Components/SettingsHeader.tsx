import React, { useRef, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaInsetsContext } from 'react-native-safe-area-context';
import { Fonts } from '../../../Theme/fonts';
import { Typography } from '../../../Theme/Typographys';
import { ProBadge } from '../../../Common/ProBadge';
import { BackButton } from '../../../Common/BackButton';
import { Colors, withAlpha } from '../../../Assets/StyleUtilities/Colors';
import HeaderPatternSvg from '../../Dashboard/Components/HeaderPatternSvg';
import { useSettingsTheme } from './types';
import ResponsivePixels from '../../../Assets/StyleUtilities/ResponsivePixels';

export const SETTINGS_HEADER_HEIGHT = ResponsivePixels.size54;

export interface SettingsHeaderProps {
  scrollY?: Animated.Value;
  isScrolled?: boolean;
}

export const SettingsHeader: React.FC<SettingsHeaderProps> = ({
  scrollY,
  isScrolled = false,
}) => {
  const {
    isDarkMode,
    textPrimary,
    textSecondary,
    canvasTextPrimary,
    canvasTextSecondary,
    accentDeep,
  } = useSettingsTheme();
  const navigation = useNavigation<any>();
  const insetsContext = useContext(SafeAreaInsetsContext);
  const insets = insetsContext ?? { top: 0, bottom: 0, left: 0, right: 0 };
  const { width: screenWidth } = Dimensions.get('window');

  const defaultScrollY = useRef(new Animated.Value(0)).current;
  const activeScrollY = scrollY || defaultScrollY;

  // Interpolate header visual styles based on scroll position (0 to 30px)
  const headerBgColor = activeScrollY.interpolate({
    inputRange: [0, 30],
    outputRange: [
      withAlpha(Colors.PureBlack, 0),
      accentDeep,
    ],
    extrapolate: 'clamp',
  });

  const headerRadius = activeScrollY.interpolate({
    inputRange: [0, 30],
    outputRange: [0, ResponsivePixels.size24],
    extrapolate: 'clamp',
  });

  const headerShadowOpacity = activeScrollY.interpolate({
    inputRange: [0, 30],
    outputRange: [0, 0.32],
    extrapolate: 'clamp',
  });

  const headerElevation = activeScrollY.interpolate({
    inputRange: [0, 30],
    outputRange: [0, 8],
    extrapolate: 'clamp',
  });

  const headerPaddingBottom = activeScrollY.interpolate({
    inputRange: [0, 30],
    outputRange: [0, ResponsivePixels.size8],
    extrapolate: 'clamp',
  });

  const headerPatternOpacity = activeScrollY.interpolate({
    inputRange: [0, 25],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  return (
    <Animated.View
      style={[
        styles.headerContainer,
        {
          paddingTop: insets.top,
          paddingBottom: headerPaddingBottom,
          backgroundColor: headerBgColor,
          borderBottomLeftRadius: headerRadius,
          borderBottomRightRadius: headerRadius,
          shadowOpacity: headerShadowOpacity,
          elevation: headerElevation,
        },
      ]}
    >
      {/* Background Theme SVG Designs for Scrolled State */}
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

      <View style={[styles.header, { height: SETTINGS_HEADER_HEIGHT }]}>
        <View style={styles.leftContainer}>
          {navigation.canGoBack() && (
            <BackButton isScrolled={isScrolled} />
          )}
          <View style={styles.titleWrapper}>
            <Text
              style={[
                styles.headerTitle,
                isScrolled
                  ? styles.headerTitleScrolled
                  : { color: canvasTextPrimary },
              ]}
              numberOfLines={1}
            >
              Settings
            </Text>
            <Text
              style={[
                styles.headerSubtitle,
                isScrolled
                  ? styles.headerSubtitleScrolled
                  : { color: canvasTextSecondary },
              ]}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              Preferences & AI Assistant Configuration
            </Text>
          </View>
        </View>

        <View style={styles.badgeWrapper}>
          <ProBadge size="sm" />
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    shadowColor: Colors.DeepVioletShadow,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 7,
  },
  header: {
    paddingHorizontal: ResponsivePixels.size20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: ResponsivePixels.size12,
    marginRight: ResponsivePixels.size8,
  },
  titleWrapper: {
    flex: 1,
    justifyContent: 'center',
    gap: ResponsivePixels.size1,
  },
  headerTitle: {
    ...Typography.h1RanadeBold,
    fontSize: ResponsivePixels.size24,
    lineHeight: ResponsivePixels.size28,
    letterSpacing: -0.5,
    includeFontPadding: false,
  },
  headerTitleScrolled: {
    color: Colors.PureWhite,
  },
  headerSubtitle: {
    fontFamily: Fonts.poppins.regular,
    fontSize: ResponsivePixels.size11_5,
    includeFontPadding: false,
    lineHeight: ResponsivePixels.size15,
  },
  headerSubtitleScrolled: {
    color: withAlpha(Colors.PureWhite, 0.82),
  },
  badgeWrapper: {
    flexShrink: 0,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
});

export default SettingsHeader;
