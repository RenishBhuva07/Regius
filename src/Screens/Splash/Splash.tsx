import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MainContainer from '../../Common/MainContainer';
import { Colors } from '../../Assets/StyleUtilities/Colors';
import ResponsivePixels from '../../Assets/StyleUtilities/ResponsivePixels';
import { Typography } from '../../Theme/Typographys';
import { useTheme } from '../../Theme/ThemeContext';
import { SVGS } from '../../Assets/Images';
import { RegiusLogo } from '../../Common/RegiusLogo';
import { SplashAestheticBackgroundSvg } from './Components/SplashAestheticBackgroundSvg';

const { width } = Dimensions.get('window');

const SplashScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const { isDarkMode, Colors: themeColors } = useTheme();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.92)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;
  const taglineFadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 6,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.timing(taglineFadeAnim, {
        toValue: 1,
        duration: 1000,
        delay: 350,
        useNativeDriver: true,
      }),
    ]).start();

    // Gentle avatar breathing animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.04,
          duration: 1600,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1600,
          useNativeDriver: true,
        }),
      ]),
    ).start();

    // Subtle floating bob for auxiliary badges
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -4,
          duration: 1400,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 4,
          duration: 1400,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, [fadeAnim, scaleAnim, pulseAnim, floatAnim, taglineFadeAnim]);

  const backgroundColor =
    themeColors.Background ||
    (isDarkMode ? Colors.NeroBlack : Colors.CreamBackground);
  const cardBg =
    themeColors.CardBackground ||
    (isDarkMode ? Colors.MidnightCharcoal : Colors.DefaultWhite);

  return (
    <MainContainer
      statusBarStyle={isDarkMode ? 'light-content' : 'dark-content'}
      statusBarBackgroundColor={backgroundColor}
      containerBackgroundColor={backgroundColor}
      showHeader={false}
    >
      <View
        style={[
          styles.container,
          { backgroundColor, paddingBottom: insets.bottom },
        ]}
      >
        {/* Signature Artisanal Aesthetic Background */}
        <View style={styles.backgroundSvgWrapper} pointerEvents="none">
          <SplashAestheticBackgroundSvg isDark={isDarkMode} />
        </View>

        <Animated.View
          style={[
            styles.contentWrapper,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          {/* 3D Volumetric Avatar Shadow Wrapper */}
          <Animated.View
            style={[
              styles.avatarShadowWrapper,
              {
                shadowColor: isDarkMode ? '#000000' : '#2A1A4E',
                transform: [{ scale: pulseAnim }],
              },
            ]}
          >
            <View
              style={[
                styles.avatarContainer,
                {
                  backgroundColor: cardBg,
                  borderColor: isDarkMode ? '#2C3038' : '#FFFFFF',
                  borderBottomColor: isDarkMode ? '#171A21' : '#DED6C7',
                },
              ]}
            >
              <View style={[styles.avatarInner, { backgroundColor: cardBg }]}>
                <SVGS.RegiusAvatar
                  width={ResponsivePixels.size140}
                  height={ResponsivePixels.size140 * (414 / 331)}
                />
              </View>

              {/* 3D Floating Heart Badge with counter-float */}
              <Animated.View
                style={[
                  styles.badgeHeartShadow,
                  {
                    transform: [{ translateY: floatAnim }],
                  },
                ]}
              >
                <View
                  style={[
                    styles.badgeHeart,
                    {
                      backgroundColor: cardBg,
                      borderBottomColor: isDarkMode ? '#1B9A72' : '#82E8A6',
                    },
                  ]}
                >
                  <SVGS.FloatHeart
                    width={ResponsivePixels.size20}
                    height={ResponsivePixels.size20}
                  />
                </View>
              </Animated.View>

              {/* 3D Floating Picture Badge with inverted float */}
              <Animated.View
                style={[
                  styles.badgePictureShadow,
                  {
                    transform: [
                      {
                        translateY: floatAnim.interpolate({
                          inputRange: [-4, 4],
                          outputRange: [4, -4],
                        }),
                      },
                    ],
                  },
                ]}
              >
                <View
                  style={[
                    styles.badgePicture,
                    {
                      backgroundColor: cardBg,
                      borderBottomColor: isDarkMode ? '#8383D6' : '#B6BEF5',
                    },
                  ]}
                >
                  <SVGS.FloatPicture
                    width={ResponsivePixels.size20}
                    height={ResponsivePixels.size20}
                  />
                </View>
              </Animated.View>
            </View>
          </Animated.View>

          {/* Luxury Typographic Wordmark & Crest */}
          <View style={styles.textContainer}>
            <RegiusLogo
              size="xl"
              variant={isDarkMode ? 'light' : 'default'}
              showEmblem={true}
              showSparkle={true}
            />

            {/* Tactile 3D Tagline Capsule */}
            <Animated.View
              style={[
                styles.taglineCapsule,
                {
                  opacity: taglineFadeAnim,
                  backgroundColor: isDarkMode
                    ? 'rgba(255, 255, 255, 0.05)'
                    : 'rgba(255, 255, 255, 0.7)',
                  borderColor: isDarkMode
                    ? 'rgba(255, 255, 255, 0.08)'
                    : '#EFE9DC',
                  borderBottomColor: isDarkMode ? '#1E2228' : '#DED7C8',
                },
              ]}
            >
              <Text
                style={[
                  styles.tagline,
                  {
                    color:
                      themeColors.SecondaryText ||
                      (isDarkMode ? Colors.SteelMist : Colors.SubtitleGray),
                  },
                ]}
              >
                Mindful Productivity & Flow
              </Text>
            </Animated.View>
          </View>
        </Animated.View>
      </View>
    </MainContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  backgroundSvgWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
  },
  contentWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  avatarShadowWrapper: {
    width: ResponsivePixels.size160,
    height: ResponsivePixels.size160,
    borderRadius: ResponsivePixels.size80,
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.18,
    shadowRadius: 26,
    elevation: 14,
    marginBottom: ResponsivePixels.size28,
  },
  avatarContainer: {
    width: ResponsivePixels.size160,
    height: ResponsivePixels.size160,
    borderRadius: ResponsivePixels.size80,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3.5,
    borderBottomWidth: 5,
    position: 'relative',
  },
  avatarInner: {
    width: ResponsivePixels.size140,
    height: ResponsivePixels.size140,
    borderRadius: ResponsivePixels.size70,
    overflow: 'hidden',
  },
  badgeHeartShadow: {
    position: 'absolute',
    top: -ResponsivePixels.size8,
    left: -ResponsivePixels.size8,
    shadowColor: Colors.AccentGreen,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
  },
  badgeHeart: {
    width: ResponsivePixels.size42,
    height: ResponsivePixels.size42,
    borderRadius: ResponsivePixels.size21,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderTopColor: '#FFFFFF',
    borderLeftColor: '#E6F4EA',
    borderRightColor: '#E6F4EA',
    borderBottomWidth: 3,
  },
  badgePictureShadow: {
    position: 'absolute',
    bottom: -ResponsivePixels.size6,
    right: -ResponsivePixels.size6,
    shadowColor: Colors.LavenderPurple,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  badgePicture: {
    width: ResponsivePixels.size40,
    height: ResponsivePixels.size40,
    borderRadius: ResponsivePixels.size20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderTopColor: '#FFFFFF',
    borderLeftColor: '#ECEBF8',
    borderRightColor: '#ECEBF8',
    borderBottomWidth: 3,
  },
  textContainer: {
    alignItems: 'center',
    marginTop: ResponsivePixels.size8,
  },
  taglineCapsule: {
    marginTop: ResponsivePixels.size14,
    paddingHorizontal: ResponsivePixels.size16,
    paddingVertical: ResponsivePixels.size6,
    borderRadius: ResponsivePixels.size20,
    borderWidth: 1,
    borderBottomWidth: 2.2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  tagline: {
    ...Typography.bodyMediumPoppinsMedium,
    letterSpacing: 0.6,
  },
});

export default SplashScreen;
