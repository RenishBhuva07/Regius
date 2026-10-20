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
import { Play, Pause, AudioWaveform, Sparkles } from 'lucide-react-native';
import TrackPlayer from 'react-native-track-player';
import Toast from 'react-native-toast-message';

import { Fonts } from '../../../Theme/fonts';
import { Badge } from '../../../Common/Badge';
import { AudioPlayerService } from '../../../Services/AudioPlayerService';
import { KokoroTTSService } from '../../../Services/Kokoro/KokoroTTSService';
import { VoiceSettingsService } from '../../../Services/VoiceSettingsService';
import { VOICES } from '../../Settings/Components/types';
import Colors from '../../../Assets/StyleUtilities/Colors';

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
  }, [isPlaying, hasStarted, isLoading, briefText]);

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
        {/* Ambient background decoration positioned safely behind header */}
        <View style={styles.ambientGlow} />

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
                <AudioWaveform size={18} color={Colors.LavenderPurple} />
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
              accessibilityRole="button"
              accessibilityLabel={`${assistantName} is ready, tap to talk`}
            >
              <Badge
                label={`${assistantName} is ready`}
                variant="green"
                size="sm"
                icon={<Sparkles size={11} color={Colors.GreenGracious} />}
              />
            </TouchableOpacity>
          </View>

          {/* Audio Player Controls */}
          <View style={styles.playerRow}>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={handleTogglePlayback}
              disabled={isLoading}
              style={[styles.playBtn, isPlaying && styles.playBtnActive]}
              accessibilityRole="button"
              accessibilityLabel={
                isPlaying ? 'Pause Morning Brief' : 'Play Morning Brief'
              }
            >
              {isLoading ? (
                <ActivityIndicator size="small" color={Colors.DefaultBlack} />
              ) : isPlaying ? (
                <Pause
                  size={18}
                  color={Colors.DefaultBlack}
                  strokeWidth={2.5}
                  fill={Colors.DefaultBlack}
                />
              ) : (
                <Play
                  size={18}
                  color={Colors.DefaultBlack}
                  fill={Colors.DefaultBlack}
                  style={{ marginLeft: 2 }}
                />
              )}
            </TouchableOpacity>

            {/* Dynamic Waveform Visualizer */}
            <View style={styles.waveformContainer}>
              {barHeights.map((barAnim, idx) => {
                const isMint = idx % 2 === 0 || idx === 3 || idx === 9;
                return (
                  <Animated.View
                    key={idx}
                    style={[
                      styles.waveformBar,
                      {
                        height: barAnim,
                        backgroundColor: isMint
                          ? '#CCE6D0'
                          : 'rgba(255, 255, 255, 0.35)',
                      },
                    ]}
                  />
                );
              })}
            </View>

            <Text style={styles.timerText}>{displayTime}</Text>
          </View>

          {/* Dynamic Contextual Quote Synchronized with Real Counts */}
          <Text style={styles.quoteText}>
            “You have {taskCount} tasks, {habitCount} habits, and{' '}
            {reminderCount} scheduled voice check-ins today. Focus block opens
            at 11:30 AM.”
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardShadowWrapper: {
    marginBottom: 24,
    borderRadius: 24,
    backgroundColor: '#1C1D22',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.28,
    shadowRadius: 18,
    elevation: 10,
  },
  card: {
    backgroundColor: '#1C1D22',
    borderRadius: 24,
    padding: 20,
    position: 'relative',
    overflow: 'hidden',
    borderWidth: 4,
    borderColor: 'rgba(255, 255, 255, 0.9)',
  },
  ambientGlow: {
    position: 'absolute',
    top: -30,
    right: -30,
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: Colors.LightLavenderPurple,
    zIndex: 0,
  },
  content: {
    position: 'relative',
    zIndex: 1,
    gap: 14,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
    marginRight: 4,
  },
  titleContainer: {
    flexShrink: 1,
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: 14,
    color: '#E4E2E4',
    letterSpacing: -0.2,
  },
  subtitle: {
    fontFamily: Fonts.poppins.regular,
    fontSize: 12,
    color: '#A19FA3',
    marginTop: 1,
  },
  playerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#272932',
    borderRadius: 30,
    paddingHorizontal: 8,
    paddingVertical: 6,
    gap: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
    zIndex: 2,
  },
  playBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
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
    height: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 7,
  },
  waveformBar: {
    width: 3,
    borderRadius: 2,
  },
  timerText: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: 12,
    color: '#D4D2D6',
    paddingRight: 6,
  },
  quoteText: {
    fontFamily: Fonts.poppins.regular,
    fontSize: 13,
    lineHeight: 19,
    color: 'rgba(245, 243, 238, 0.88)',
  },
});

export default DailyBriefingCard;
