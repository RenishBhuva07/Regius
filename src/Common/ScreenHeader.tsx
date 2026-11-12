import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

import { Fonts } from '../Theme/fonts';
import { Typography } from '../Theme/Typographys';
import { Colors, withAlpha } from '../Assets/StyleUtilities/Colors';
import { useTheme } from '../Theme/ThemeContext';
import { SVGS } from '../Assets/Images';
import { CustomAnimation } from './CustomAnimation';
import HolographAnimation from '../Assets/JsonAnimations/Holograph.json';
import { useVoiceWakeWord } from '../Context/VoiceWakeWordContext';
import HeaderPatternSvg from '../Screens/Dashboard/Components/HeaderPatternSvg';
import { SettingsButton } from './SettingsButton';
import ResponsivePixels from '../Assets/StyleUtilities/ResponsivePixels';

export const SCREEN_HEADER_HEIGHT = ResponsivePixels.size54;

export interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  scrollY: Animated.Value;
  isScrolled: boolean;
  showVoiceOrb?: boolean;
  showSettings?: boolean;
  onPressSettings?: () => void;
  showProfile?: boolean;
  onPressProfile?: () => void;
  rightAction?: React.ReactNode;
  headerHeight?: number;
}

export const ScreenHeader: React.FC<ScreenHeaderProps> = ({
  title,
  subtitle,
  scrollY,
  isScrolled,
  showVoiceOrb = true,
  showSettings = true,
  onPressSettings,
  showProfile = true,
  onPressProfile,
  rightAction,
  headerHeight = SCREEN_HEADER_HEIGHT,
}) => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const { assistantName, openAssistant } = useVoiceWakeWord();
  const { isDarkMode, Colors: themeColors } = useTheme();
  const { width: screenWidth } = Dimensions.get('window');

  const scrolledBg =
    themeColors.AccentDeep ||
    (isDarkMode ? Colors.MidnightIndigo : Colors.LavenderPurple);

  // Interpolate header visual styles based on scroll position (0 to 30px)
  const headerBgColor = scrollY.interpolate({
    inputRange: [0, 30],
    outputRange: [
      isDarkMode
        ? withAlpha(Colors.DarkBackground, 0)
        : withAlpha(Colors.PureWhite, 0),
      scrolledBg,
    ],
    extrapolate: 'clamp',
  });

  const headerRadius = scrollY.interpolate({
    inputRange: [0, 30],
    outputRange: [0, ResponsivePixels.size24],
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
    outputRange: [0, ResponsivePixels.size8],
    extrapolate: 'clamp',
  });

  const headerPatternOpacity = scrollY.interpolate({
    inputRange: [0, 25],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const handleProfilePress = () => {
    if (onPressProfile) {
      onPressProfile();
    } else {
      navigation.navigate('ProfileScreen');
    }
  };

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

      <View style={[styles.header, { height: headerHeight }]}>
        <View style={styles.headerLeft}>
          <Text
            style={[
              styles.screenTitle,
              isScrolled
                ? styles.screenTitleScrolled
                : { color: isDarkMode ? Colors.PureWhite : Colors.RegiusInk },
            ]}
            numberOfLines={1}
          >
            {title}
          </Text>
          {subtitle ? (
            <Text
              style={[
                styles.screenSubtitle,
                isScrolled
                  ? styles.screenSubtitleScrolled
                  : {
                      color: isDarkMode
                        ? Colors.SteelMist
                        : Colors.HeaderSubtitleOlive,
                    },
              ]}
              numberOfLines={1}
            >
              {subtitle}
            </Text>
          ) : null}
        </View>

        <View style={styles.headerRight}>
          {showVoiceOrb && (
            <TouchableOpacity
              activeOpacity={0.75}
              onPress={() => openAssistant()}
              style={styles.voiceHeaderBtn}
              accessibilityRole="button"
              accessibilityLabel={`Open ${assistantName} Voice Assistant`}
              hitSlop={{ top: ResponsivePixels.size10, bottom: ResponsivePixels.size10, left: ResponsivePixels.size10, right: ResponsivePixels.size10 }}
            >
              <View pointerEvents="none">
                <CustomAnimation
                  animationFile={HolographAnimation}
                  size={ResponsivePixels.size56}
                  animationStyle={styles.voiceHeaderAnimation}
                  autoPlay
                  loop
                  resizeMode="contain"
                  pointerEvents="none"
                />
              </View>
            </TouchableOpacity>
          )}

          {rightAction}

          {showSettings && (
            <SettingsButton isScrolled={isScrolled} onPress={onPressSettings} />
          )}

          {showProfile && (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleProfilePress}
              style={[
                styles.avatarRing,
                isScrolled && styles.avatarRingScrolled,
              ]}
              accessibilityRole="button"
              accessibilityLabel="User Profile"
            >
              <SVGS.RegiusAvatar width={ResponsivePixels.size36} height={ResponsivePixels.size36} style={styles.avatar} />
            </TouchableOpacity>
          )}
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
  headerLeft: {
    flexDirection: 'column',
    justifyContent: 'center',
    flex: 1,
    gap: ResponsivePixels.size1,
  },
  screenTitle: {
    ...Typography.h1RanadeBold,
    fontSize: ResponsivePixels.size24,
    color: Colors.RegiusInk,
    letterSpacing: -0.5,
    includeFontPadding: false,
    lineHeight: ResponsivePixels.size28,
  },
  screenTitleScrolled: {
    color: Colors.PureWhite,
  },
  screenSubtitle: {
    fontFamily: Fonts.poppins.regular,
    fontSize: ResponsivePixels.size11_5,
    color: Colors.HeaderSubtitleOlive,
    includeFontPadding: false,
    lineHeight: ResponsivePixels.size15,
  },
  screenSubtitleScrolled: {
    color: withAlpha(Colors.PureWhite, 0.82),
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ResponsivePixels.size10,
  },
  voiceHeaderBtn: {
    width: ResponsivePixels.size36,
    height: ResponsivePixels.size36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  voiceHeaderAnimation: {
    width: ResponsivePixels.size56,
    height: ResponsivePixels.size56,
  },
  avatarRing: {
    width: ResponsivePixels.size44,
    height: ResponsivePixels.size44,
    borderRadius: ResponsivePixels.size22,
    borderWidth: 2,
    borderColor: Colors.RingBorder,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    backgroundColor: Colors.PureWhite,
  },
  avatarRingScrolled: {
    borderColor: Colors.RingBorder,
    borderWidth: 2,
    shadowColor: Colors.PureBlack,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 3,
    backgroundColor: Colors.PureWhite,
  },
  avatar: {
    position: 'absolute',
    bottom: 0,
  },
});

export default ScreenHeader;
