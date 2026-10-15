import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Easing,
} from 'react-native';
import { Play, Pause, AudioWaveform } from 'lucide-react-native';
import { Fonts } from '../../../Theme/fonts';
import Toast from 'react-native-toast-message';

interface DailyBriefingCardProps {
  taskCount?: number;
  habitCount?: number;
  reminderCount?: number;
  onOpenVoiceAssistant?: () => void;
}

export const DailyBriefingCard: React.FC<DailyBriefingCardProps> = ({
  taskCount = 4,
  habitCount = 3,
  reminderCount = 2,
  onOpenVoiceAssistant,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(80); // 1m 20s

  // Equalizer bar animations
  const barHeights = useRef(
    Array.from(
      { length: 14 },
      () => new Animated.Value(6 + Math.random() * 12),
    ),
  ).current;

  useEffect(() => {
    let animLoop: Animated.CompositeAnimation | null = null;
    let timer: ReturnType<typeof setInterval> | null = null;

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

      timer = setInterval(() => {
        setSecondsRemaining(prev => {
          if (prev <= 1) {
            setIsPlaying(false);
            return 80;
          }
          return prev - 1;
        });
      }, 1000);
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
      if (timer) clearInterval(timer);
    };
  }, [isPlaying, barHeights]);

  const togglePlayback = () => {
    const nextState = !isPlaying;
    setIsPlaying(nextState);
    if (nextState) {
      Toast.show({
        type: 'info',
        text1: 'Aria Daily Briefing',
        text2: 'Playing personalized audio briefing for today...',
      });
    }
  };

  const formatTimer = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <View style={styles.card}>
      {/* Ambient background decoration */}
      <View style={styles.ambientGlow} />

      <View style={styles.content}>
        {/* Header row */}
        <View style={styles.headerRow}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={onOpenVoiceAssistant}
            style={styles.headerLeft}
          >
            <View style={styles.iconCircle}>
              <AudioWaveform size={18} color="#CCE6D0" />
            </View>
            <View>
              <Text style={styles.title}>Aria’s Morning Brief</Text>
              <Text style={styles.subtitle}>1 min 20s audio overview</Text>
            </View>
          </TouchableOpacity>

          <View style={styles.todayBadge}>
            <Text style={styles.todayBadgeText}>Today</Text>
          </View>
        </View>

        {/* Audio Player Controls */}
        <View style={styles.playerRow}>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={togglePlayback}
            style={[styles.playBtn, isPlaying && styles.playBtnActive]}
          >
            {isPlaying ? (
              <Pause size={18} color="#010102" strokeWidth={2.5} />
            ) : (
              <Play
                size={18}
                color="#010102"
                fill="#010102"
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
                        : 'rgba(255, 255, 255, 0.28)',
                    },
                  ]}
                />
              );
            })}
          </View>

          <Text style={styles.timerText}>{formatTimer(secondsRemaining)}</Text>
        </View>

        {/* Dynamic Contextual Quote */}
        <Text style={styles.quoteText}>
          “You have {taskCount} tasks, {habitCount} habits, and {reminderCount}{' '}
          scheduled voice check-ins today. Focus block opens at 11:30 AM.”
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1C1C1E',
    borderRadius: 24,
    padding: 20,
    position: 'relative',
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.16,
    shadowRadius: 20,
    elevation: 8,
    marginBottom: 24,
  },
  ambientGlow: {
    position: 'absolute',
    top: -30,
    right: -30,
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(95, 94, 96, 0.22)',
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
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
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
  todayBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
  },
  todayBadgeText: {
    fontFamily: Fonts.poppins.medium,
    fontSize: 11,
    color: '#FBF9F3',
  },
  playerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 30,
    paddingHorizontal: 8,
    paddingVertical: 6,
    gap: 10,
  },
  playBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FBF9F3',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  playBtnActive: {
    backgroundColor: '#CCE6D0',
  },
  waveformContainer: {
    flex: 1,
    height: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  waveformBar: {
    width: 3,
    borderRadius: 2,
  },
  timerText: {
    fontFamily: Fonts.poppins.medium,
    fontSize: 11.5,
    color: '#C8C6C8',
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
