import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Easing,
  ActivityIndicator,
} from 'react-native';
import { Play, Pause, AudioWaveform } from 'lucide-react-native';
import TrackPlayer from 'react-native-track-player';
import Toast from 'react-native-toast-message';

import { Fonts } from '../../../Theme/fonts';
import { Badge } from '../../../Common/Badge';
import { AudioPlayerService } from '../../../Services/AudioPlayerService';
import { KokoroTTSService } from '../../../Services/Kokoro/KokoroTTSService';
import { VoiceSettingsService } from '../../../Services/VoiceSettingsService';
import { VOICES } from '../../Settings/Components/types';
import { Colors, withAlpha } from '../../../Assets/StyleUtilities/Colors';
import { useTheme, isLightColor } from '../../../Theme/ThemeContext';
import Svg, {
  Path,
  Circle,
  Rect,
  G,
  Defs,
  LinearGradient,
  RadialGradient,
  Stop,
} from 'react-native-svg';
import ResponsivePixels from '../../../Assets/StyleUtilities/ResponsivePixels';

// Background vector pattern for DailyBriefingCard: calm, tactile acoustic instrument surface.
const DailyBriefingBackgroundSvg: React.FC = React.memo(() => {
  const { activeThemeId, Colors: themeColors } = useTheme();
  const brassAccent =
    activeThemeId === 'cyprus_sand'
      ? Colors.CyprusSandPaper
      : activeThemeId === 'emerald_velvet'
      ? Colors.EmeraldVibrant
      : activeThemeId === 'celestial_azure'
      ? Colors.AzureSkyAccent
      : Colors.AccentYellow;

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <Svg
        width="100%"
        height="100%"
        viewBox="0 0 360 210"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
      >
        <Defs>
          <LinearGradient id="cardBgSheen" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor="#22252C" stopOpacity={0.9} />
            <Stop offset="50%" stopColor="#1C1D22" stopOpacity={0.95} />
            <Stop offset="100%" stopColor="#141519" stopOpacity={1} />
          </LinearGradient>
          <LinearGradient id="brassAcousticRule" x1="0%" y1="0%" x2="100%" y2="0%">
            <Stop offset="0%" stopColor={brassAccent} stopOpacity={0.04} />
            <Stop offset="40%" stopColor={brassAccent} stopOpacity={0.22} />
            <Stop offset="80%" stopColor={brassAccent} stopOpacity={0.06} />
            <Stop offset="100%" stopColor={brassAccent} stopOpacity={0} />
          </LinearGradient>
        </Defs>

        {/* Clean surface base */}
        <Rect width="100%" height="100%" fill="url(#cardBgSheen)" />

        {/* Subtle acoustic hairline rule - signature instrument detail */}
        <Path
          d="M 16 68 C 90 48, 180 84, 270 56 S 330 64, 344 60"
          stroke="url(#brassAcousticRule)"
          strokeWidth={1.2}
          strokeLinecap="round"
          fill="none"
        />

        {/* Quiet concentric tuning circle in top right */}
        <Circle
          cx={316}
          cy={28}
          r={42}
          stroke={withAlpha(Colors.PureWhite, 0.05)}
          strokeWidth={1}
          fill="none"
        />
        <Circle
          cx={316}
          cy={28}
          r={78}
          stroke={withAlpha(brassAccent, 0.04)}
          strokeWidth={1}
          strokeDasharray="4 6"
          fill="none"
        />
      </Svg>
    </View>
  );
});

interface DailyBriefingCardProps {
  taskCount?: number;
  reminderCount?: number;
  habitCount?: number;
  assistantName?: string;
  onOpenVoiceAssistant?: () => void;
  onTriggerWakeWord?: () => void;
}

export const DailyBriefingCard: React.FC<DailyBriefingCardProps> = ({
  taskCount = 3,
  reminderCount = 5,
  habitCount = 7,
  assistantName = 'Regius',
  onOpenVoiceAssistant,
  onTriggerWakeWord,
}) => {
  const { activeThemeId, isDarkMode } = useTheme();

  const playBtnBg =
    activeThemeId === 'cyprus_sand'
      ? isDarkMode
        ? Colors.CyprusSandPaper
        : Colors.CyprusTeal
      : activeThemeId === 'emerald_velvet'
      ? Colors.EmeraldVibrant
      : activeThemeId === 'celestial_azure'
      ? Colors.AzureSkyAccent
      : activeThemeId === 'classic_dark' || activeThemeId === 'obsidian_gold'
      ? Colors.AccentYellow
      : Colors.LavenderPurple;

  const playIconColor =
    activeThemeId === 'cyprus_sand'
      ? isDarkMode
        ? Colors.CyprusTeal
        : Colors.CyprusSandPaper
      : isLightColor(playBtnBg)
      ? Colors.PureBlack
      : Colors.PureWhite;

  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [positionSec, setPositionSec] = useState(0);
  const [durationSec, setDurationSec] = useState(80); // Default ~1m 20s

  const isBriefingActiveRef = useRef(false);

  // Equalizer bar animations
  const barHeights = useRef(
    Array.from(
      { length: 14 },
      () => new Animated.Value(6 + Math.random() * 12),
    ),
  ).current;

  // Generate dynamic briefing script following standard sequence: Tasks, Reminders, Habits
  const briefText = `Good morning Alex. You have ${taskCount} tasks, ${reminderCount} scheduled reminders, and ${habitCount} habits today. Focus block opens at 11:30 AM.`;

  // Waveform equalizer animation loop
  useEffect(() => {
    let animLoop: Animated.CompositeAnimation | null = null;

    if (isPlaying) {
      const createAnimations = () => {
        return barHeights.map(bar => {
          const toValue = 6 + Math.random() * 18;
          return Animated.sequence([
            Animated.timing(bar, {
              toValue,
              duration: 180 + Math.random() * 140,
              easing: Easing.linear,
              useNativeDriver: false,
            }),
            Animated.timing(bar, {
              toValue: 4 + Math.random() * 8,
              duration: 180 + Math.random() * 140,
              easing: Easing.linear,
              useNativeDriver: false,
            }),
          ]);
        });
      };

      const runLoop = () => {
        animLoop = Animated.parallel(createAnimations());
        animLoop.start(({ finished }) => {
          if (finished && isPlaying) {
            runLoop();
          }
        });
      };

      runLoop();
    } else {
      barHeights.forEach((bar, idx) => {
        const defaultH =
          [6, 14, 8, 18, 12, 10, 16, 8, 12, 20, 10, 6, 12, 4][idx] || 10;
        Animated.timing(bar, {
          toValue: defaultH,
          duration: 250,
          useNativeDriver: false,
        }).start();
      });
    }

    return () => {
      if (animLoop) animLoop.stop();
    };
  }, [isPlaying, barHeights]);

  // Track playback position & duration polling
  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | null = null;

    if (isPlaying) {
      timer = setInterval(async () => {
        try {
          const progress = await TrackPlayer.getProgress();
          if (progress && progress.duration > 0) {
            setDurationSec(progress.duration);
            setPositionSec(progress.position);
          }
        } catch {
          // TrackPlayer polling non-blocking
        }
      }, 500);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isPlaying]);

  // Clean up audio on unmount if this card triggered it
  useEffect(() => {
    return () => {
      if (isBriefingActiveRef.current) {
        AudioPlayerService.stop().catch(() => {});
      }
    };
  }, []);

  const handleTogglePlayback = useCallback(async () => {
    // If currently playing -> Pause
    if (isPlaying) {
      try {
        await AudioPlayerService.pause();
        setIsPlaying(false);
      } catch (err) {
        console.warn('[DailyBriefingCard] Pause error:', err);
      }
      return;
    }

    // If paused and has active session -> Resume
    if (hasStarted && !isPlaying && !isLoading) {
      try {
        await AudioPlayerService.resume();
        setIsPlaying(true);
      } catch (err) {
        console.warn('[DailyBriefingCard] Resume error:', err);
      }
      return;
    }

    // Fresh Playback: Start actual audio playback with Kokoro TTS or fallback
    setIsLoading(true);
    isBriefingActiveRef.current = true;

    try {
      await AudioPlayerService.setup();
      const settings = await VoiceSettingsService.getSettings();
      const voiceOption =
        VOICES.find(v => v.id === settings.selectedVoiceId) || VOICES[0];
      const speed = settings.speechSpeed || 1.0;

      // Check cache first or race synthesis with 2200ms timeout
      let audioUri: any = KokoroTTSService.getCachedUrl(
        briefText,
        voiceOption.kokoroVoiceId,
        speed,
      );

      if (!audioUri) {
        try {
          audioUri = await Promise.race([
            KokoroTTSService.synthesize(
              briefText,
              voiceOption.kokoroVoiceId,
              speed,
              false,
            ),
            new Promise<null>(resolve => setTimeout(() => resolve(null), 2500)),
          ]);
        } catch {
          audioUri = null;
        }
      }

      const playableUrl =
        audioUri &&
        (typeof audioUri !== 'string' ||
          audioUri.startsWith('http://') ||
          audioUri.startsWith('https://') ||
          audioUri.startsWith('file://'))
          ? audioUri
          : voiceOption.previewUrl || VOICES[0].previewUrl;

      Toast.show({
        type: 'info',
        text1: `${assistantName} Daily Briefing`,
        text2: 'Playing personalized audio briefing for today...',
      });

      await AudioPlayerService.playWithCallbacks(
        {
          id: `morning_brief_${Date.now()}`,
          url: playableUrl,
          title: `${assistantName}’s Morning Brief`,
          artist: `Regius (${voiceOption.name})`,
        },
        {
          onStart: () => {
            setIsLoading(false);
            setIsPlaying(true);
            setHasStarted(true);
          },
          onEnded: () => {
            setIsPlaying(false);
            setIsLoading(false);
            setHasStarted(false);
            setPositionSec(0);
            isBriefingActiveRef.current = false;
          },
          onError: err => {
            console.warn('[DailyBriefingCard] Audio playback error:', err);
            setIsPlaying(false);
            setIsLoading(false);
            setHasStarted(false);
            isBriefingActiveRef.current = false;
            Toast.show({
              type: 'error',
              text1: 'Audio Unavailable',
              text2: 'Unable to start briefing audio playback.',
            });
          },
        },
      );
    } catch (error) {
      console.warn('[DailyBriefingCard] Play error:', error);
      setIsLoading(false);
      setIsPlaying(false);
      setHasStarted(false);
      isBriefingActiveRef.current = false;
      Toast.show({
        type: 'error',
        text1: 'Playback Error',
        text2: 'Could not play Morning Brief at this moment.',
      });
    }
  }, [isPlaying, hasStarted, isLoading, briefText, assistantName]);

  const formatTimer = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = Math.floor(sec % 60);
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const displayTime = hasStarted
    ? formatTimer(Math.max(0, durationSec - positionSec))
    : '01:20';

  return (
    <View style={styles.cardShadowWrapper}>
      <View style={styles.card}>
        
        <DailyBriefingBackgroundSvg />

        <View style={styles.content}>
          {/* Header row */}
          <View style={styles.headerRow}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={onOpenVoiceAssistant}
              style={styles.headerLeft}
              accessibilityRole="button"
              accessibilityLabel={`Open ${assistantName} Voice Assistant`}
            >
              <View style={styles.iconCircle}>
                <AudioWaveform size={ResponsivePixels.size18} color={Colors.LavenderPurple} />
              </View>
              <View style={styles.titleContainer}>
                <Text style={styles.title} numberOfLines={1}>
                  {assistantName}’s Morning Brief
                </Text>
                <Text style={styles.subtitle}>1 min 20s audio overview</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={onTriggerWakeWord || onOpenVoiceAssistant}
              style={styles.badgeWrapper}
              accessibilityRole="button"
              accessibilityLabel={`${assistantName} is ready, tap to talk`}
            >
              <Badge
                label="Ready"
                variant="green"
                size="sm"
              />
            </TouchableOpacity>
          </View>

          {/* Audio Player Controls */}
          <View style={styles.playerRow}>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={handleTogglePlayback}
              disabled={isLoading}
              style={[
                styles.playBtn,
                {
                  backgroundColor: playBtnBg,
                  shadowColor: Colors.PureBlack,
                },
                isPlaying && styles.playBtnActive,
              ]}
              accessibilityRole="button"
              accessibilityLabel={
                isPlaying ? 'Pause Morning Brief' : 'Play Morning Brief'
              }
            >
              {isLoading ? (
                <ActivityIndicator size="small" color={playIconColor} />
              ) : isPlaying ? (
                <Pause
                  size={ResponsivePixels.size18}
                  color={playIconColor}
                  strokeWidth={2.5}
                  fill={playIconColor}
                />
              ) : (
                <Play
                  size={ResponsivePixels.size18}
                  color={playIconColor}
                  fill={playIconColor}
                  style={{ marginLeft: ResponsivePixels.size2 }}
                />
              )}
            </TouchableOpacity>

            {/* Dynamic Waveform Visualizer */}
            <View style={styles.waveformContainer}>
              {barHeights.map((barAnim, idx) => {
                const isAccent = idx % 3 === 0 || idx === 7;
                return (
                  <Animated.View
                    key={idx}
                    style={[
                      styles.waveformBar,
                      {
                        height: barAnim,
                        backgroundColor: isPlaying
                          ? isAccent
                            ? Colors.AccentYellow
                            : withAlpha(Colors.PureWhite, 0.7)
                          : withAlpha(Colors.PureWhite, 0.28),
                      },
                    ]}
                  />
                );
              })}
            </View>

            <Text style={styles.timerText}>{displayTime}</Text>
          </View>

          {/* Dynamic Contextual Briefing Summary */}
          <Text style={styles.quoteText}>
            {taskCount} tasks, {reminderCount} reminders, and {habitCount} habits scheduled for today. Focus block begins at 11:30 AM.
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardShadowWrapper: {
    marginBottom: ResponsivePixels.size18,
    borderRadius: ResponsivePixels.size24,
    backgroundColor: Colors.NeroBlack,
    shadowColor: Colors.PureBlack,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.28,
    shadowRadius: 18,
    elevation: 10,
  },
  card: {
    backgroundColor: Colors.NeroBlack,
    borderRadius: ResponsivePixels.size24,
    padding: ResponsivePixels.size20,
    position: 'relative',
    overflow: 'hidden',
    borderWidth: 4,
    borderColor: withAlpha(Colors.PureWhite, 0.9),
  },
  content: {
    position: 'relative',
    zIndex: 1,
    gap: ResponsivePixels.size14,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: ResponsivePixels.size8,
  },
  badgeWrapper: {
    alignSelf: 'flex-start',
    marginTop: ResponsivePixels.size2,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ResponsivePixels.size10,
    flex: 1,
    marginRight: ResponsivePixels.size4,
  },
  titleContainer: {
    flexShrink: 1,
  },
  iconCircle: {
    width: ResponsivePixels.size38,
    height: ResponsivePixels.size38,
    borderRadius: ResponsivePixels.size19,
    backgroundColor: withAlpha(Colors.PureWhite, 0.08),
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: ResponsivePixels.size14,
    color: Colors.BriefingPlatinumText,
    letterSpacing: -0.2,
  },
  subtitle: {
    fontFamily: Fonts.poppins.regular,
    fontSize: ResponsivePixels.size12,
    color: Colors.BriefingMutedSilver,
    marginTop: ResponsivePixels.size1,
  },
  playerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.BriefingControlDark,
    borderRadius: ResponsivePixels.size30,
    paddingHorizontal: ResponsivePixels.size8,
    paddingVertical: ResponsivePixels.size6,
    gap: ResponsivePixels.size10,
    borderWidth: 1,
    borderColor: withAlpha(Colors.PureWhite, 0.1),
    shadowColor: Colors.PureBlack,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
    zIndex: 2,
  },
  playBtn: {
    width: ResponsivePixels.size38,
    height: ResponsivePixels.size38,
    borderRadius: ResponsivePixels.size19,
    backgroundColor: Colors.LavenderPurple,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.LavenderPurple,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 5,
    elevation: 3,
  },
  playBtnActive: {
    backgroundColor: Colors.LavenderPurple,
  },
  waveformContainer: {
    flex: 1,
    height: ResponsivePixels.size24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: ResponsivePixels.size7,
  },
  waveformBar: {
    width: ResponsivePixels.size3,
    borderRadius: ResponsivePixels.size2,
  },
  timerText: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: ResponsivePixels.size12,
    color: Colors.BriefingSilverText,
    paddingRight: ResponsivePixels.size6,
    fontVariant: ['tabular-nums'],
  },
  quoteText: {
    fontFamily: Fonts.poppins.regular,
    fontSize: ResponsivePixels.size13,
    lineHeight: ResponsivePixels.size19,
    color: withAlpha(Colors.BriefingWarmOffWhite, 0.88),
  },
});

export default DailyBriefingCard;
