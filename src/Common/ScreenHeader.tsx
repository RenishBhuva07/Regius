import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

import { Fonts } from '../Theme/fonts';
import { Typography } from '../Theme/Typographys';
import { Colors } from '../Assets/StyleUtilities/Colors';
import { SVGS } from '../Assets/Images';
import { CustomAnimation } from './CustomAnimation';
import HolographAnimation from '../Assets/JsonAnimations/Holograph.json';
import { useVoiceWakeWord } from '../Context/VoiceWakeWordContext';
import HeaderPatternSvg from '../Screens/Dashboard/Components/HeaderPatternSvg';

export const SCREEN_HEADER_HEIGHT = 54;

export interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  scrollY: Animated.Value;
  isScrolled: boolean;
  showVoiceOrb?: boolean;
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
  showProfile = true,
  onPressProfile,
  rightAction,
  headerHeight = SCREEN_HEADER_HEIGHT,
}) => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const { assistantName, openAssistant } = useVoiceWakeWord();
  const { width: screenWidth } = Dimensions.get('window');

  // Interpolate header visual styles based on scroll position (0 to 30px)
  const headerBgColor = scrollY.interpolate({
    inputRange: [0, 30],
    outputRange: [Colors.DefaultWhite, Colors.LavenderPurple],
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

  const handleProfilePress = () => {
    if (onPressProfile) {
      onPressProfile();
    } else {
      navigation.navigate('Settings');
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
              isScrolled && styles.screenTitleScrolled,
            ]}
            numberOfLines={1}
          >
            {title}
          </Text>
          {subtitle ? (
            <Text
              style={[
                styles.screenSubtitle,
                isScrolled && styles.screenSubtitleScrolled,
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
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <View pointerEvents="none">
                <CustomAnimation
                  animationFile={HolographAnimation}
                  size={56}
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
              <SVGS.RegiusAvatar width={36} height={36} style={styles.avatar} />
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
    shadowColor: '#201646',
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 7,
  },
  header: {
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flexDirection: 'column',
    justifyContent: 'center',
    flex: 1,
    gap: 1,
  },
  screenTitle: {
    ...Typography.h1RanadeBold,
    fontSize: 24,
    color: '#1B1C19',
    letterSpacing: -0.5,
    includeFontPadding: false,
    lineHeight: 28,
  },
  screenTitleScrolled: {
    color: Colors.DefaultWhite,
  },
  screenSubtitle: {
    fontFamily: Fonts.poppins.regular,
    fontSize: 11.5,
    color: '#767772',
    includeFontPadding: false,
    lineHeight: 15,
  },
  screenSubtitleScrolled: {
    color: 'rgba(255, 255, 255, 0.82)',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  voiceHeaderBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  voiceHeaderAnimation: {
    width: 56,
    height: 56,
  },
  avatarRing: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: Colors.RingBorder,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    backgroundColor: Colors.DefaultWhite,
  },
  avatarRingScrolled: {
    borderColor: Colors.RingBorder,
    borderWidth: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 3,
    backgroundColor: Colors.DefaultWhite,
  },
  avatar: {
    position: 'absolute',
    bottom: 0,
  },
});

export default ScreenHeader;
