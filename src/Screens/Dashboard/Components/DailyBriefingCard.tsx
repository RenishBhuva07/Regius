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

/**
 * Aesthetic luxury background for DailyBriefingCard featuring:
 * - Ambient radial glowing auras (Lavender, Golden dawn, Mint acoustic)
 * - Concentric acoustic orbital rings
 * - Flowing harmonic resonance sound ribbons
 * - Subtle studio equalizer watermark bars
 * - Regius signature 4-pointed luxury starbursts and stardust constellations
 */
const DailyBriefingBackgroundSvg: React.FC = React.memo(() => (
  <View style={StyleSheet.absoluteFill} pointerEvents="none">
    <Svg
      width="100%"
      height="100%"
      viewBox="0 0 360 210"
      preserveAspectRatio="xMidYMid slice"
      fill="none"
    >
      <Defs>
        {/* Soft Multi-Layer Background Gradients */}
        <LinearGradient id="cardBgSheen" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor="#252733" stopOpacity={0.65} />
          <Stop offset="50%" stopColor={Colors.NeroBlack} stopOpacity={0.15} />
          <Stop offset="100%" stopColor="#15161A" stopOpacity={0.7} />
        </LinearGradient>

        {/* Top-Right Lavender / Purple Aura */}
        <RadialGradient id="lavenderAura" cx="86%" cy="14%" rx="68%" ry="68%">
          <Stop offset="0%" stopColor="#9C9CE3" stopOpacity={0.42} />
          <Stop offset="35%" stopColor="#8383D6" stopOpacity={0.22} />
          <Stop offset="70%" stopColor="#554E9B" stopOpacity={0.06} />
          <Stop offset="100%" stopColor={Colors.NeroBlack} stopOpacity={0} />
        </RadialGradient>

        {/* Bottom-Left Golden Dawn Aura (Morning Brief Theme) */}
        <RadialGradient id="goldDawnGlow" cx="12%" cy="88%" rx="52%" ry="52%">
          <Stop offset="0%" stopColor="#F5C518" stopOpacity={0.16} />
          <Stop offset="45%" stopColor="#B48216" stopOpacity={0.06} />
          <Stop offset="100%" stopColor={Colors.NeroBlack} stopOpacity={0} />
        </RadialGradient>

        {/* Mid-Right Mint Acoustic Glow */}
        <RadialGradient id="mintGlow" cx="62%" cy="68%" rx="40%" ry="40%">
          <Stop offset="0%" stopColor="#52D22E" stopOpacity={0.09} />
          <Stop offset="60%" stopColor="#1B9A72" stopOpacity={0.02} />
          <Stop offset="100%" stopColor={Colors.NeroBlack} stopOpacity={0} />
        </RadialGradient>

        {/* Gold Shine for Stars */}
        <LinearGradient id="goldStar" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor="#FFFCE3" stopOpacity={0.95} />
          <Stop offset="100%" stopColor="#F5C518" stopOpacity={0.8} />
        </LinearGradient>
      </Defs>

      {/* ── Base Ambient Glow Volumes ── */}
      <Rect width="100%" height="100%" fill="url(#cardBgSheen)" />
      <Rect width="100%" height="100%" fill="url(#lavenderAura)" />
      <Rect width="100%" height="100%" fill="url(#goldDawnGlow)" />
      <Rect width="100%" height="100%" fill="url(#mintGlow)" />

      {/* ── Top-Right Acoustic Orbital Rings (Behind Ready Badge) ── */}
      <Circle
        cx={305}
        cy={24}
        r={38}
        stroke="rgba(216, 219, 255, 0.18)"
        strokeWidth={1}
        fill="none"
      />
      <Circle
        cx={305}
        cy={24}
        r={64}
        stroke="rgba(182, 190, 245, 0.12)"
        strokeWidth={1.2}
        strokeDasharray="4 5"
        fill="none"
      />
      <Circle
        cx={305}
        cy={24}
        r={98}
        stroke="rgba(255, 255, 255, 0.06)"
        strokeWidth={1}
        fill="none"
      />
      <Circle
        cx={305}
        cy={24}
        r={140}
        stroke="rgba(216, 219, 255, 0.035)"
        strokeWidth={1}
        strokeDasharray="5 7"
        fill="none"
      />

      {/* ── Top-Left Micro Orbit (Behind Audio Waveform Icon) ── */}
      <Circle
        cx={42}
        cy={38}
        r={30}
        stroke="rgba(255, 255, 255, 0.05)"
        strokeWidth={1}
        fill="none"
      />
      <Circle
        cx={42}
        cy={38}
        r={48}
        stroke="rgba(131, 131, 214, 0.07)"
        strokeWidth={1}
        strokeDasharray="3 4"
        fill="none"
      />

      {/* ── Flowing Acoustic Wave Ribbons (Harmonic Resonance) ── */}
      {/* Wave 1: Lavender Flow */}
      <Path
        d="M -20 62 C 75 22, 155 92, 255 46 S 355 82, 420 52"
        stroke="rgba(156, 156, 227, 0.22)"
        strokeWidth={1.4}
        strokeLinecap="round"
        fill="none"
      />
      {/* Wave 2: Rhythmic Dashed Mint Flow */}
      <Path
        d="M -20 88 C 68 124, 148 44, 248 104 S 348 44, 420 84"
        stroke="rgba(204, 230, 208, 0.14)"
        strokeWidth={1.2}
        strokeDasharray="4 5"
        strokeLinecap="round"
        fill="none"
      />
      {/* Wave 3: Subtle Gold Dawn Ripple */}
      <Path
        d="M -10 148 C 88 108, 178 168, 288 128 S 378 158, 420 138"
        stroke="rgba(245, 197, 24, 0.11)"
        strokeWidth={1}
        strokeLinecap="round"
        fill="none"
      />

      {/* ── Subtle Audio Equalizer Watermark Bars (Bottom Right) ── */}
      <G opacity={0.06}>
        <Rect x={278} y={150} width={2.5} height={24} rx={1.2} fill="#FFFFFF" />
        <Rect x={286} y={142} width={2.5} height={32} rx={1.2} fill="#CCE6D0" />
        <Rect x={294} y={135} width={2.5} height={39} rx={1.2} fill="#8383D6" />
        <Rect x={302} y={146} width={2.5} height={28} rx={1.2} fill="#FFFFFF" />
        <Rect x={310} y={138} width={2.5} height={36} rx={1.2} fill="#CCE6D0" />
        <Rect x={318} y={148} width={2.5} height={26} rx={1.2} fill="#FFFFFF" />
        <Rect x={326} y={140} width={2.5} height={34} rx={1.2} fill="#8383D6" />
        <Rect x={334} y={152} width={2.5} height={22} rx={1.2} fill="#FFFFFF" />
      </G>

      {/* ── Regius Luxury 4-Pointed Starbursts ── */}
      {/* Starburst 1: Primary Gold Accent near top orbit */}
      <G transform="translate(245, 18) scale(0.85)">
        <Path
          d="M6 0L7.5 4.5L12 6L7.5 7.5L6 12L4.5 7.5L0 6L4.5 4.5Z"
          fill="url(#goldStar)"
        />
      </G>

      {/* Starburst 2: Soft Cream Star near quote opening */}
      <G transform="translate(32, 142) scale(0.65)" opacity={0.6}>
        <Path
          d="M6 0L7.5 4.5L12 6L7.5 7.5L6 12L4.5 7.5L0 6L4.5 4.5Z"
          fill="#FFFCE3"
        />
      </G>

      {/* Starburst 3: Lavender Star near mid right */}
      <G transform="translate(326, 86) scale(0.55)" opacity={0.5}>
        <Path
          d="M6 0L7.5 4.5L12 6L7.5 7.5L6 12L4.5 7.5L0 6L4.5 4.5Z"
          fill="#D8DBFF"
        />
      </G>

      {/* Starburst 4: Micro Dawn Sparkle */}
      <G transform="translate(142, 28) scale(0.48)" opacity={0.45}>
        <Path
          d="M6 0L7.5 4.5L12 6L7.5 7.5L6 12L4.5 7.5L0 6L4.5 4.5Z"
          fill="#F5C518"
        />
      </G>

      {/* ── Constellation Stardust Micro-Dots ── */}
      <Circle cx={118} cy={34} r={1.3} fill="#FFFCE3" opacity={0.5} />
      <Circle cx={192} cy={22} r={1.1} fill="#F5C518" opacity={0.55} />
      <Circle cx={272} cy={52} r={1.4} fill="#FFFCE3" opacity={0.45} />
      <Circle cx={338} cy={44} r={1.2} fill="#D8DBFF" opacity={0.5} />
      <Circle cx={28} cy={102} r={1.2} fill="#FFFCE3" opacity={0.35} />
      <Circle cx={94} cy={168} r={1.3} fill="#F5C518" opacity={0.4} />
      <Circle cx={214} cy={182} r={1.1} fill="#FFFCE3" opacity={0.3} />
      <Circle cx={344} cy={176} r={1.3} fill="#CCE6D0" opacity={0.45} />
    </Svg>
  </View>
));

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
        {/* Aesthetic luxury ambient background with harmonic soundwaves & celestial orbits */}
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
              style={styles.badgeWrapper}
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
    marginBottom: 18,
    borderRadius: 24,
    backgroundColor: Colors.NeroBlack,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.28,
    shadowRadius: 18,
    elevation: 10,
  },
  card: {
    backgroundColor: Colors.NeroBlack,
    borderRadius: 24,
    padding: 20,
    position: 'relative',
    overflow: 'hidden',
    borderWidth: 4,
    borderColor: 'rgba(255, 255, 255, 0.9)',
  },
  content: {
    position: 'relative',
    zIndex: 1,
    gap: 14,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 8,
  },
  badgeWrapper: {
    alignSelf: 'flex-start',
    marginTop: 2,
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
