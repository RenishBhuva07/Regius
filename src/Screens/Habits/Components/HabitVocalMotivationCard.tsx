import React, { useEffect, useRef, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Easing,
  Platform,
} from 'react-native';
import { Volume2, VolumeX, Sparkles, Activity } from 'lucide-react-native';
import Svg, {
  Defs,
  LinearGradient,
  RadialGradient,
  Stop,
  Rect,
  Circle,
} from 'react-native-svg';

import { Fonts } from '../../../Theme/fonts';
import { Colors, withAlpha } from '../../../Assets/StyleUtilities/Colors';
import ResponsivePixels from '../../../Assets/StyleUtilities/ResponsivePixels';
import { Badge } from '../../../Common/Badge';
import { useTheme } from '../../../Theme/ThemeContext';

export interface HabitVocalMotivationCardProps {
  habitTitle: string;
  timeOfDay: string;
  category: 'morning' | 'evening' | 'mindful' | string;
  accentColor: string;
  isPlaying: boolean;
  onTogglePlay: () => void;
}

/**
 * Animated 7-Bar Holographic Acoustic Equalizer
 */
const MiniAcousticBars: React.FC<{
  isPlaying: boolean;
  accentColor: string;
}> = React.memo(({ isPlaying, accentColor }) => {
  const bar1 = useRef(new Animated.Value(0.35)).current;
  const bar2 = useRef(new Animated.Value(0.65)).current;
  const bar3 = useRef(new Animated.Value(0.45)).current;
  const bar4 = useRef(new Animated.Value(0.85)).current;
  const bar5 = useRef(new Animated.Value(0.55)).current;
  const bar6 = useRef(new Animated.Value(0.75)).current;
  const bar7 = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    let animLoop: Animated.CompositeAnimation | null = null;
    if (isPlaying) {
      animLoop = Animated.loop(
        Animated.parallel([
          Animated.sequence([
            Animated.timing(bar1, {
              toValue: 1,
              duration: 320,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: true,
            }),
            Animated.timing(bar1, {
              toValue: 0.25,
              duration: 320,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: true,
            }),
          ]),
          Animated.sequence([
            Animated.timing(bar2, {
              toValue: 0.2,
              duration: 260,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: true,
            }),
            Animated.timing(bar2, {
              toValue: 0.95,
              duration: 260,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: true,
            }),
          ]),
          Animated.sequence([
            Animated.timing(bar3, {
              toValue: 1,
              duration: 380,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: true,
            }),
            Animated.timing(bar3, {
              toValue: 0.3,
              duration: 380,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: true,
            }),
          ]),
          Animated.sequence([
            Animated.timing(bar4, {
              toValue: 0.3,
              duration: 290,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: true,
            }),
            Animated.timing(bar4, {
              toValue: 1,
              duration: 290,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: true,
            }),
          ]),
          Animated.sequence([
            Animated.timing(bar5, {
              toValue: 0.9,
              duration: 340,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: true,
            }),
            Animated.timing(bar5, {
              toValue: 0.25,
              duration: 340,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: true,
            }),
          ]),
          Animated.sequence([
            Animated.timing(bar6, {
              toValue: 0.25,
              duration: 270,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: true,
            }),
            Animated.timing(bar6, {
              toValue: 0.85,
              duration: 270,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: true,
            }),
          ]),
          Animated.sequence([
            Animated.timing(bar7, {
              toValue: 0.8,
              duration: 350,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: true,
            }),
            Animated.timing(bar7, {
              toValue: 0.3,
              duration: 350,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: true,
            }),
          ]),
        ]),
      );
      animLoop.start();
    } else {
      Animated.parallel([
        Animated.timing(bar1, {
          toValue: 0.35,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(bar2, {
          toValue: 0.6,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(bar3, {
          toValue: 0.45,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(bar4, {
          toValue: 0.75,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(bar5, {
          toValue: 0.5,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(bar6, {
          toValue: 0.65,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(bar7, {
          toValue: 0.35,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    }

    return () => {
      if (animLoop) animLoop.stop();
    };
  }, [isPlaying, bar1, bar2, bar3, bar4, bar5, bar6, bar7]);

  const bars = [
    { anim: bar1, color: Colors.LavenderPurple },
    { anim: bar2, color: accentColor },
    { anim: bar3, color: Colors.AccentAmber },
    { anim: bar4, color: Colors.AccentGreen },
    { anim: bar5, color: Colors.LavenderPurple },
    { anim: bar6, color: accentColor },
    { anim: bar7, color: Colors.AccentAmber },
  ];

  return (
    <View style={styles.equalizerRow}>
      {bars.map((item, index) => (
        <Animated.View
          key={`eq-bar-${index}`}
          style={[
            styles.equalizerBar,
            {
              backgroundColor: isPlaying
                ? item.color
                : withAlpha(Colors.PureWhite, 0.25),
              transform: [{ scaleY: item.anim }],
            },
          ]}
        />
      ))}
    </View>
  );
});

/**
 * Extraordinary Regius Neural Vocal Motivation Surface
 */
export const HabitVocalMotivationCard: React.FC<HabitVocalMotivationCardProps> =
  React.memo(
    ({
      habitTitle,
      timeOfDay,
      category,
      accentColor,
      isPlaying,
      onTogglePlay,
    }) => {
      const { isDarkMode } = useTheme();

      // Dynamic circadian spoken motivation
      const spokenScript = useMemo(() => {
        const cat = (category || '').toLowerCase();
        if (cat === 'morning') {
          return `“Dawn activation secured. Sia will chime at ${timeOfDay} to ignite your ${habitTitle.toLowerCase()} ritual, anchoring dopamine focus for peak daily execution.”`;
        }
        if (cat === 'evening') {
          return `“Twilight reflection active. Sia will nudge your ${habitTitle.toLowerCase()} ritual at ${timeOfDay}, clearing cognitive clutter to pre-align tomorrow’s victories.”`;
        }
        return `“Mindful stoic alignment. Sia channels undivided presence at ${timeOfDay} for your ${habitTitle.toLowerCase()} routine, safeguarding mental equilibrium.”`;
      }, [category, habitTitle, timeOfDay]);

      const pulseAnim = useRef(new Animated.Value(1)).current;

      useEffect(() => {
        let pulseLoop: Animated.CompositeAnimation | null = null;
        if (isPlaying) {
          pulseLoop = Animated.loop(
            Animated.sequence([
              Animated.timing(pulseAnim, {
                toValue: 1.08,
                duration: 700,
                easing: Easing.inOut(Easing.ease),
                useNativeDriver: true,
              }),
              Animated.timing(pulseAnim, {
                toValue: 1,
                duration: 700,
                easing: Easing.inOut(Easing.ease),
                useNativeDriver: true,
              }),
            ]),
          );
          pulseLoop.start();
        } else {
          pulseAnim.setValue(1);
        }
        return () => {
          if (pulseLoop) pulseLoop.stop();
        };
      }, [isPlaying, pulseAnim]);

      return (
        <View style={styles.outerShadowWrapper}>
          <View
            style={[styles.cardSurface, isDarkMode && styles.cardSurfaceDark]}
          >
            {/* Ambient Audio Svg Glow */}
            <View style={StyleSheet.absoluteFill} pointerEvents="none">
              <Svg width="100%" height="100%" preserveAspectRatio="none">
                <Defs>
                  <LinearGradient
                    id="vocalBgGrad"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <Stop offset="0%" stopColor={Colors.VocalCardGradientTop} stopOpacity={0.95} />
                    <Stop offset="50%" stopColor={Colors.VocalCardGradientMid} stopOpacity={0.92} />
                    <Stop
                      offset="100%"
                      stopColor={Colors.VocalCardGradientBottom}
                      stopOpacity={0.98}
                    />
                  </LinearGradient>
                  <RadialGradient
                    id="vocalAcousticGlow"
                    cx="85%"
                    cy="25%"
                    rx="65%"
                    ry="65%"
                  >
                    <Stop
                      offset="0%"
                      stopColor={accentColor}
                      stopOpacity={0.3}
                    />
                    <Stop offset="60%" stopColor={Colors.LavenderPurple} stopOpacity={0.1} />
                    <Stop offset="100%" stopColor={Colors.PureBlack} stopOpacity={0} />
                  </RadialGradient>
                </Defs>
                <Rect width="100%" height="100%" fill="url(#vocalBgGrad)" />
                <Rect
                  width="100%"
                  height="100%"
                  fill="url(#vocalAcousticGlow)"
                />
                <Circle
                  cx={290}
                  cy={35}
                  r={48}
                  stroke={withAlpha(Colors.PureWhite, 0.08)}
                  strokeWidth={1}
                  strokeDasharray="3 4"
                  fill="none"
                />
              </Svg>
            </View>

            {/* Header Meta Row */}
            <View style={styles.cardHeaderRow}>
              <View style={styles.headerBadgeGroup}>
                <View style={styles.neuralDisc}>
                  <Sparkles
                    size={ResponsivePixels.size12}
                    color={Colors.AccentYellow}
                    strokeWidth={2.4}
                  />
                </View>
                <View>
                  <Text style={styles.neuralLabel}>SIA NEURAL COACH</Text>
                  <Text style={styles.neuralSub}>Kokoro 24kHz Synthesis</Text>
                </View>
              </View>

              {/* Status Indicator */}
              <Badge
                label={isPlaying ? 'SPEAKING' : 'READY'}
                variant={isPlaying ? 'yellow' : 'purple'}
                size="sm"
                icon={
                  <Activity
                    size={ResponsivePixels.size10}
                    color={isPlaying ? Colors.BadgeYellowText : Colors.LavenderPurple}
                    strokeWidth={2.4}
                  />
                }
              />
            </View>

            {/* Spoken Guidance Text with Subtle Inset Glass Backing */}
            <View style={styles.quoteParchmentBox}>
              <Text style={styles.guidanceQuoteText}>{spokenScript}</Text>
            </View>

            {/* Bottom Interactive Audio Deck */}
            <View style={styles.audioDeckRow}>
              {/* Dynamic Equalizer Visualizer */}
              <View style={styles.visualizerSlot}>
                <MiniAcousticBars
                  isPlaying={isPlaying}
                  accentColor={accentColor}
                />
                <Text style={styles.fidelityLabel}>
                  {isPlaying
                    ? 'AUDIO TRANSMISSION ACTIVE'
                    : 'AWAITING PLAYBACK'}
                </Text>
              </View>

              {/* Glowing Play/Stop Tactile Pill */}
              <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
                <TouchableOpacity
                  activeOpacity={0.82}
                  onPress={onTogglePlay}
                  style={[
                    styles.playButton,
                    isPlaying && styles.playButtonActive,
                    {
                      borderColor: isPlaying ? Colors.CrimsonPulse : accentColor,
                      shadowColor: isPlaying ? Colors.CrimsonPulse : accentColor,
                    },
                  ]}
                  accessibilityRole="button"
                  accessibilityLabel={
                    isPlaying
                      ? 'Stop vocal guidance'
                      : 'Listen to vocal guidance'
                  }
                >
                  {isPlaying ? (
                    <>
                      <VolumeX
                        size={ResponsivePixels.size14}
                        color={Colors.PureWhite}
                        strokeWidth={2.4}
                      />
                      <Text style={styles.playButtonTextActive}>STOP</Text>
                    </>
                  ) : (
                    <>
                      <Volume2
                        size={ResponsivePixels.size14}
                        color={Colors.PureWhite}
                        strokeWidth={2.4}
                      />
                      <Text style={styles.playButtonText}>LISTEN</Text>
                    </>
                  )}
                </TouchableOpacity>
              </Animated.View>
            </View>
          </View>
        </View>
      );
    },
  );

const styles = StyleSheet.create({
  outerShadowWrapper: {
    width: '100%',
    ...Platform.select({
      ios: {
        shadowColor: Colors.PureBlack,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.22,
        shadowRadius: 12,
      },
      android: {
        elevation: 6,
      },
    }),
    marginBottom: ResponsivePixels.size4,
  },
  cardSurface: {
    position: 'relative',
    backgroundColor: Colors.VocalPlayPillDarkBg,
    borderRadius: ResponsivePixels.size20,
    borderWidth: 2,
    borderTopWidth: 2,
    borderTopColor: withAlpha(Colors.PureWhite, 0.2),
    borderBottomWidth: 3.5,
    borderBottomColor: Colors.VocalPillBottomBevel,
    borderColor: withAlpha(Colors.PureWhite, 0.1),
    padding: ResponsivePixels.size14,
    overflow: 'hidden',
    gap: ResponsivePixels.size12,
  },
  cardSurfaceDark: {
    backgroundColor: Colors.VocalTrackDarkBg,
    borderTopColor: withAlpha(Colors.PureWhite, 0.15),
    borderBottomColor: Colors.VocalTrackBottomAbyss,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerBadgeGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ResponsivePixels.size8,
  },
  neuralDisc: {
    width: ResponsivePixels.size28,
    height: ResponsivePixels.size28,
    borderRadius: ResponsivePixels.size14,
    backgroundColor: withAlpha(Colors.AccentYellow, 0.18),
    borderWidth: 1,
    borderColor: withAlpha(Colors.AccentYellow, 0.35),
    alignItems: 'center',
    justifyContent: 'center',
  },
  neuralLabel: {
    fontFamily: Fonts.poppins.bold,
    fontSize: ResponsivePixels.size10,
    color: Colors.PureWhite,
    letterSpacing: 0.6,
  },
  neuralSub: {
    fontFamily: Fonts.poppins.regular,
    fontSize: ResponsivePixels.size8,
    color: Colors.MilestoneSlate,
    letterSpacing: 0.3,
  },
  quoteParchmentBox: {
    backgroundColor: withAlpha(Colors.PureWhite, 0.05),
    borderRadius: ResponsivePixels.size14,
    borderWidth: 1,
    borderColor: withAlpha(Colors.PureWhite, 0.08),
    paddingHorizontal: ResponsivePixels.size12,
    paddingVertical: ResponsivePixels.size10,
  },
  guidanceQuoteText: {
    fontFamily: Fonts.poppins.medium,
    fontSize: ResponsivePixels.size11,
    lineHeight: ResponsivePixels.size17,
    color: Colors.VocalQuoteTextDark,
    fontStyle: 'italic',
  },
  audioDeckRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: ResponsivePixels.size2,
  },
  visualizerSlot: {
    flex: 1,
    gap: ResponsivePixels.size4,
  },
  equalizerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ResponsivePixels.size4,
    height: ResponsivePixels.size16,
  },
  equalizerBar: {
    width: ResponsivePixels.size3,
    height: ResponsivePixels.size14,
    borderRadius: ResponsivePixels.size2,
  },
  fidelityLabel: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: ResponsivePixels.size8,
    color: Colors.VocalDurationMuted,
    letterSpacing: 0.5,
  },
  playButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ResponsivePixels.size5,
    backgroundColor: Colors.VocalCardGradientTop,
    paddingHorizontal: ResponsivePixels.size12,
    paddingVertical: ResponsivePixels.size7,
    borderRadius: ResponsivePixels.size16,
    borderWidth: 1.5,
    ...Platform.select({
      ios: {
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  playButtonActive: {
    backgroundColor: Colors.MoltenRust,
    borderColor: Colors.CrimsonPulse,
  },
  playButtonText: {
    fontFamily: Fonts.poppins.bold,
    fontSize: ResponsivePixels.size10,
    color: Colors.PureWhite,
    letterSpacing: 0.6,
  },
  playButtonTextActive: {
    fontFamily: Fonts.poppins.bold,
    fontSize: ResponsivePixels.size10,
    color: Colors.PureWhite,
    letterSpacing: 0.6,
  },
});

export default HabitVocalMotivationCard;
