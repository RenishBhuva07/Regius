import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  StatusBar,
  Platform,
  FlatList,
  Animated,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowRight } from 'lucide-react-native';
import { Colors } from '../../Assets/StyleUtilities/Colors';
import ResponsivePixels from '../../Assets/StyleUtilities/ResponsivePixels';
import { Typography } from '../../Theme/Typographys';
import { useTheme } from '../../Theme/ThemeContext';
import { SVGS } from '../../Assets/Images';
import { Badge, BadgeVariant } from '../../Common/Badge';
import { IntroAestheticBackgroundSvg } from './Components/IntroAestheticBackgroundSvg';

const { width, height } = Dimensions.get('window');

interface IntroStep {
  id: string;
  badgeLabel: string;
  badgeVariant: BadgeVariant;
  title: string;
  subtitle: string;
  accentColor: string;
}

const INTRO_STEPS: IntroStep[] = [
  {
    id: 'tasks',
    badgeLabel: '1. TASKS & FOCUS',
    badgeVariant: 'yellow',
    title: 'Plan Your Day In Details',
    subtitle:
      'Organize daily tasks with effortless clarity, set smart priorities, and track progress with intelligent flow.',
    accentColor: Colors.AccentYellow,
  },
  {
    id: 'reminders',
    badgeLabel: '2. SMART REMINDERS',
    badgeVariant: 'green',
    title: 'Never Miss What Matters',
    subtitle:
      'Sensory alerts, gentle voice nudges, and intelligent reminders keep you calm and ahead of every deadline.',
    accentColor: Colors.GreenGracious,
  },
  {
    id: 'habits',
    badgeLabel: '3. MINDFUL HABITS',
    badgeVariant: 'purple',
    title: 'Build Lasting Daily Rituals',
    subtitle:
      'Cultivate daily momentum, celebrate your streaks, and master mindful consistency effortlessly.',
    accentColor: Colors.LavenderPurple,
  },
];

const Intro: React.FC = () => {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const { isDarkMode, Colors: themeColors } = useTheme();

  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList<IntroStep>>(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  // Scale based on Figma artboard width (375px)
  const scale = width / 375;
  const illustrationWidth = 331 * scale;
  const illustrationHeight = 673 * scale;
  const buttonSize = ResponsivePixels.size84;

  const handleNextPress = () => {
    if (activeIndex < INTRO_STEPS.length - 1) {
      const nextIndex = activeIndex + 1;
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
      setActiveIndex(nextIndex);
    } else {
      navigation.replace('Login');
    }
  };

  const handleSkipPress = () => {
    navigation.replace('Login');
  };

  const onMomentumScrollEnd = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const contentOffsetX = e.nativeEvent.contentOffset.x;
      const index = Math.round(contentOffsetX / width);
      if (index >= 0 && index < INTRO_STEPS.length) {
        setActiveIndex(index);
      }
    },
    [],
  );

  const backgroundColor =
    themeColors.Background ||
    (isDarkMode ? Colors.NeroBlack : Colors.CreamBackground);
  const textColor =
    themeColors.PrimaryText ||
    (isDarkMode ? Colors.PureWhiteText : Colors.MidnightInkText);
  const subtitleColor =
    themeColors.SecondaryText ||
    (isDarkMode ? Colors.SteelMist : Colors.SubtitleGray);

  const isLastStep = activeIndex === INTRO_STEPS.length - 1;
  const currentStep = INTRO_STEPS[activeIndex];

  const renderStepItem = ({ item }: { item: IntroStep }) => {
    return (
      <View style={[styles.textSlide, { width }]}>
        <View
          style={[
            styles.textCard,
            {
              backgroundColor: isDarkMode
                ? 'rgba(30, 34, 40, 0.65)'
                : 'rgba(255, 255, 255, 0.58)',
              borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.08)' : '#FFFFFF',
              borderBottomColor: item.accentColor,
            },
          ]}
        >
          <View style={styles.badgeWrapper}>
            <Badge
              variant={item.badgeVariant}
              label={item.badgeLabel}
              size="md"
            />
          </View>

          <Text
            style={[
              styles.title,
              {
                color: textColor,
              },
            ]}
          >
            {item.title}
          </Text>

          <Text
            style={[
              styles.subtitle,
              {
                color: subtitleColor,
              },
            ]}
          >
            {item.subtitle}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        {...(Platform.OS === 'android'
          ? { backgroundColor: 'transparent', translucent: true }
          : {})}
      />

      {/* ── Signature Artisanal Dynamic Background Canvas ── */}
      <View style={styles.backgroundSvgWrapper} pointerEvents="none">
        <IntroAestheticBackgroundSvg
          isDark={isDarkMode}
          accentColor={currentStep.accentColor}
        />
      </View>

      {/* ── Signature Big Hero Illustration from Top Edge ── */}
      <View
        style={[
          styles.illustrationWrapper,
          {
            top: 0,
            left: 0,
            width: illustrationWidth,
            height: illustrationHeight,
          },
        ]}
        pointerEvents="none"
      >
        <SVGS.IntroHeroIllustration
          width={illustrationWidth}
          height={illustrationHeight}
        />
      </View>

      {/* ── Top Skip Action (Tactile 3D Micro-Pill) ── */}
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={handleSkipPress}
        style={[
          styles.skipButton,
          {
            top: Math.max(insets.top, ResponsivePixels.size16),
            backgroundColor: isDarkMode
              ? 'rgba(255, 255, 255, 0.08)'
              : 'rgba(255, 255, 255, 0.75)',
            borderColor: isDarkMode ? '#2C3035' : '#EAE4D6',
            borderBottomColor: isDarkMode ? '#1E2228' : '#DED6C7',
          },
        ]}
        accessibilityRole="button"
        accessibilityLabel="Skip intro"
      >
        <Text
          style={[
            styles.skipText,
            {
              color: isDarkMode ? Colors.SteelMist : Colors.SubtitleGray,
            },
          ]}
        >
          Skip
        </Text>
      </TouchableOpacity>

      {/* ── Interactive Content Area ── */}
      <View
        style={[
          styles.contentContainer,
          {
            paddingBottom: Math.max(insets.bottom, ResponsivePixels.size20),
          },
        ]}
      >
        {/* ── Three-Step Carousel Text Slider ── */}
        <View style={styles.carouselContainer}>
          <FlatList
            ref={flatListRef}
            data={INTRO_STEPS}
            keyExtractor={item => item.id}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            getItemLayout={(_, index) => ({
              length: width,
              offset: width * index,
              index,
            })}
            onScrollToIndexFailed={info => {
              flatListRef.current?.scrollToOffset({
                offset: info.index * width,
                animated: true,
              });
            }}
            onMomentumScrollEnd={onMomentumScrollEnd}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { x: scrollX } } }],
              { useNativeDriver: false },
            )}
            scrollEventThrottle={16}
            renderItem={renderStepItem}
          />
        </View>

        {/* ── Tactile 3D Step Indicator Pills ── */}
        <View style={styles.indicatorContainer}>
          {INTRO_STEPS.map((step, idx) => {
            const isActive = activeIndex === idx;
            return (
              <View
                key={step.id}
                style={[
                  styles.indicatorDot,
                  isActive
                    ? [
                        styles.indicatorActive,
                        {
                          backgroundColor: step.accentColor,
                          shadowColor: step.accentColor,
                        },
                      ]
                    : {
                        backgroundColor: isDarkMode
                          ? Colors.CarbonSlate
                          : '#DDD6C6',
                      },
                ]}
              />
            );
          })}
        </View>

        {/* ── Primary Action Controls ── */}
        <View style={styles.buttonWrapper}>
          {isLastStep ? (
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={handleNextPress}
              style={[
                styles.getStartedButton,
                {
                  backgroundColor: Colors.MidnightCharcoal,
                  shadowColor: currentStep.accentColor,
                },
              ]}
              accessibilityRole="button"
              accessibilityLabel="Get Started"
            >
              <Text style={styles.getStartedText}>Get Started</Text>
              <View
                style={[
                  styles.arrowCircle,
                  { backgroundColor: currentStep.accentColor },
                ]}
              >
                <ArrowRight size={18} color="#FFFFFF" />
              </View>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={handleNextPress}
              style={[
                styles.actionButtonTouch,
                { shadowColor: currentStep.accentColor },
              ]}
              accessibilityRole="button"
              accessibilityLabel="Next step"
            >
              <SVGS.Btn width={buttonSize} height={buttonSize} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  illustrationWrapper: {
    position: 'absolute',
    zIndex: 1,
  },
  skipButton: {
    position: 'absolute',
    right: ResponsivePixels.size20,
    paddingVertical: ResponsivePixels.size6,
    paddingHorizontal: ResponsivePixels.size14,
    borderRadius: ResponsivePixels.size16,
    borderWidth: 1,
    borderBottomWidth: 2.2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
    zIndex: 10,
  },
  skipText: {
    ...Typography.bodyMediumPoppinsSemiBold,
    fontSize: 13,
    letterSpacing: 0.4,
  },
  contentContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'flex-end',
    zIndex: 2,
  },
  carouselContainer: {
    width: '100%',
    minHeight: ResponsivePixels.size150,
    justifyContent: 'center',
  },
  textSlide: {
    alignItems: 'center',
    paddingHorizontal: ResponsivePixels.size20,
  },
  textCard: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: ResponsivePixels.size18,
    paddingVertical: ResponsivePixels.size14,
    borderRadius: ResponsivePixels.size24,
    borderWidth: 1.2,
    borderTopColor: '#FFFFFF',
    borderBottomWidth: 2.8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 14,
    elevation: 3,
  },
  badgeWrapper: {
    marginBottom: ResponsivePixels.size8,
  },
  title: {
    ...Typography.h1RanadeBold,
    fontSize: 27,
    lineHeight: 33,
    textAlign: 'center',
    letterSpacing: -0.3,
  },
  subtitle: {
    ...Typography.bodyMediumPoppinsRegular,
    textAlign: 'center',
    letterSpacing: 0.3,
    lineHeight: 22,
    marginTop: ResponsivePixels.size8,
    paddingHorizontal: ResponsivePixels.size8,
  },
  indicatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: ResponsivePixels.size16,
    marginBottom: ResponsivePixels.size18,
    gap: ResponsivePixels.size8,
  },
  indicatorDot: {
    width: ResponsivePixels.size8,
    height: ResponsivePixels.size8,
    borderRadius: ResponsivePixels.size4,
  },
  indicatorActive: {
    width: ResponsivePixels.size28,
    borderRadius: ResponsivePixels.size4,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.45,
    shadowRadius: 5,
    elevation: 4,
    borderTopWidth: 0.8,
    borderTopColor: 'rgba(255, 255, 255, 0.6)',
  },
  buttonWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: ResponsivePixels.size84,
  },
  actionButtonTouch: {
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.32,
    shadowRadius: 14,
    elevation: 8,
  },
  getStartedButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: ResponsivePixels.size58,
    paddingLeft: ResponsivePixels.size28,
    paddingRight: ResponsivePixels.size12,
    borderRadius: ResponsivePixels.size29,
    borderWidth: 1,
    borderTopWidth: 1.5,
    borderTopColor: 'rgba(255, 255, 255, 0.45)',
    borderColor: 'rgba(255, 255, 255, 0.15)',
    borderBottomWidth: 4,
    borderBottomColor: '#0E1013',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.38,
    shadowRadius: 18,
    elevation: 10,
  },
  getStartedText: {
    ...Typography.bodyLargePoppinsSemiBold,
    color: Colors.PureWhiteText,
    letterSpacing: 0.5,
    marginRight: ResponsivePixels.size14,
  },
  arrowCircle: {
    width: ResponsivePixels.size38,
    height: ResponsivePixels.size38,
    borderRadius: ResponsivePixels.size19,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.5)',
    borderColor: 'transparent',
    borderBottomWidth: 2,
    borderBottomColor: 'rgba(0, 0, 0, 0.2)',
  },
});

export default Intro;
