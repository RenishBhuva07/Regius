import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, Animated } from 'react-native';
import MainContainer from '../../Common/MainContainer';
import { Colors } from '../../Assets/StyleUtilities/Colors';
import ResponsivePixels from '../../Assets/StyleUtilities/ResponsivePixels';
import { Typography } from '../../Theme/Typographys';
import { SVGS } from '../../Assets/Images';

const { width } = Dimensions.get('window');

const SplashScreen: React.FC = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.92)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

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
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, [fadeAnim, scaleAnim, pulseAnim]);

  return (
    <MainContainer
      statusBarStyle="dark-content"
      statusBarBackgroundColor={Colors.CreamBackground}
      containerBackgroundColor={Colors.CreamBackground}
      showHeader={false}
    >
      <View style={styles.container}>
        <View style={styles.backgroundBlob} />

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
              { transform: [{ scale: pulseAnim }] },
            ]}
          >
            <View style={styles.avatarInner}>
              <SVGS.RegiusAvatar
                width={ResponsivePixels.size140}
                height={ResponsivePixels.size140 * (414 / 331)}
              />
            </View>

            <View style={styles.badgeHeart}>
              <SVGS.FloatHeart
                width={ResponsivePixels.size20}
                height={ResponsivePixels.size20}
              />
            </View>
            <View style={styles.badgePicture}>
              <SVGS.FloatPicture
                width={ResponsivePixels.size20}
                height={ResponsivePixels.size20}
              />
            </View>
          </Animated.View>

          <View style={styles.textContainer}>
            <Text style={styles.appName}>Regius</Text>
          </View>
        </Animated.View>

        <View style={styles.bottomBarWrapper}>
          <View style={styles.homeIndicator} />
        </View>
      </View>
    </MainContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.CreamBackground,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  backgroundBlob: {
    position: 'absolute',
    width: width * 0.9,
    height: width * 0.9,
    borderRadius: (width * 0.9) / 2,
    backgroundColor: Colors.DefaultWhite,
    opacity: 0.8,
  },
  contentWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarContainer: {
    width: ResponsivePixels.size160,
    height: ResponsivePixels.size160,
    borderRadius: ResponsivePixels.size80,
    backgroundColor: Colors.DefaultWhite,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.DefaultBlack,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 6,
    borderWidth: 3,
    borderColor: Colors.RingBorder,
    position: 'relative',
    marginBottom: ResponsivePixels.size28,
  },
  avatarInner: {
    width: ResponsivePixels.size140,
    height: ResponsivePixels.size140,
    borderRadius: ResponsivePixels.size70,
    overflow: 'hidden',
    backgroundColor: Colors.DefaultWhite,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  badgeHeart: {
    position: 'absolute',
    top: -ResponsivePixels.size8,
    left: -ResponsivePixels.size8,
    width: ResponsivePixels.size40,
    height: ResponsivePixels.size40,
    borderRadius: ResponsivePixels.size20,
    backgroundColor: Colors.DefaultWhite,
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
    backgroundColor: Colors.DefaultWhite,
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
  badgeIcon: {
    width: ResponsivePixels.size20,
    height: ResponsivePixels.size20,
  },
  textContainer: {
    alignItems: 'center',
  },
  appName: {
    ...Typography.displayLargeRanadeBold,
    color: Colors.MidnightInkText,
    letterSpacing: 1.5,
    fontWeight: '800',
  },
  taglineUnderline: {
    width: ResponsivePixels.size36,
    height: ResponsivePixels.size3,
    backgroundColor: Colors.MidnightCharcoal,
    borderRadius: ResponsivePixels.size2,
    marginVertical: ResponsivePixels.size8,
  },
  tagline: {
    ...Typography.bodyMediumPoppinsMedium,
    color: Colors.SubtitleGray,
    letterSpacing: 0.3,
  },
  bottomBarWrapper: {
    position: 'absolute',
    bottom: ResponsivePixels.size16,
    width: '100%',
    alignItems: 'center',
  },
  homeIndicator: {
    width: ResponsivePixels.size134,
    height: ResponsivePixels.size5,
    backgroundColor: Colors.HomeIndicator,
    borderRadius: ResponsivePixels.size3,
  },
});

export default SplashScreen;
