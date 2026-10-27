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
  const ringColor =
    themeColors.BorderLight ||
    (isDarkMode ? Colors.CarbonSlate : Colors.RingBorder);
  const blobColor = isDarkMode
    ? 'rgba(255, 255, 255, 0.04)'
    : 'rgba(255, 255, 255, 0.85)';

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
        <View style={[styles.backgroundBlob, { backgroundColor: blobColor }]} />

        <Animated.View
          style={[
            styles.contentWrapper,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <Animated.View
            style={[
              styles.avatarContainer,
              {
                backgroundColor: cardBg,
                borderColor: ringColor,
                transform: [{ scale: pulseAnim }],
              },
            ]}
          >
            <View style={[styles.avatarInner, { backgroundColor: cardBg }]}>
              <SVGS.RegiusAvatar
                width={ResponsivePixels.size140}
                height={ResponsivePixels.size140 * (414 / 331)}
              />
            </View>

            {/* Floating Heart Badge with counter-float */}
            <Animated.View
              style={[
                styles.badgeHeart,
                {
                  backgroundColor: cardBg,
                  transform: [{ translateY: floatAnim }],
                },
              ]}
            >
              <SVGS.FloatHeart
                width={ResponsivePixels.size20}
                height={ResponsivePixels.size20}
              />
            </Animated.View>

            {/* Floating Picture Badge with inverted float */}
            <Animated.View
              style={[
                styles.badgePicture,
                {
                  backgroundColor: cardBg,
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
              <SVGS.FloatPicture
                width={ResponsivePixels.size20}
                height={ResponsivePixels.size20}
              />
            </Animated.View>
          </Animated.View>

          {/* Luxury Typographic Wordmark & Crest */}
          <View style={styles.textContainer}>
            <RegiusLogo
              size="xl"
              variant={isDarkMode ? 'light' : 'default'}
              showEmblem={true}
              showSparkle={true}
            />

            <Animated.Text
              style={[
                styles.tagline,
                {
                  opacity: taglineFadeAnim,
                  color:
                    themeColors.SecondaryText ||
                    (isDarkMode ? Colors.SteelMist : Colors.SubtitleGray),
                },
              ]}
            >
              Mindful Productivity & Flow
            </Animated.Text>
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
  backgroundBlob: {
    position: 'absolute',
    width: width * 0.9,
    height: width * 0.9,
    borderRadius: (width * 0.9) / 2,
    opacity: 0.9,
  },
  contentWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarContainer: {
    width: ResponsivePixels.size160,
    height: ResponsivePixels.size160,
    borderRadius: ResponsivePixels.size80,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.DefaultBlack,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 18,
    elevation: 8,
    borderWidth: 3,
    position: 'relative',
    marginBottom: ResponsivePixels.size28,
  },
  avatarInner: {
    width: ResponsivePixels.size140,
    height: ResponsivePixels.size140,
    borderRadius: ResponsivePixels.size70,
    overflow: 'hidden',
  },
  badgeHeart: {
    position: 'absolute',
    top: -ResponsivePixels.size8,
    left: -ResponsivePixels.size8,
    width: ResponsivePixels.size40,
    height: ResponsivePixels.size40,
    borderRadius: ResponsivePixels.size20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.AccentGreen,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#E6F4EA',
  },
  badgePicture: {
    position: 'absolute',
    bottom: -ResponsivePixels.size6,
    right: -ResponsivePixels.size6,
    width: ResponsivePixels.size38,
    height: ResponsivePixels.size38,
    borderRadius: ResponsivePixels.size19,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.LavenderPurple,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#ECEBF8',
  },
  textContainer: {
    alignItems: 'center',
    marginTop: ResponsivePixels.size8,
  },
  tagline: {
    ...Typography.bodyMediumPoppinsMedium,
    marginTop: ResponsivePixels.size10,
    letterSpacing: 0.6,
  },
});

export default SplashScreen;
