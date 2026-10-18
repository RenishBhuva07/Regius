import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Animated,
  Dimensions,
  Pressable,
  AccessibilityInfo,
  Easing,
  ScrollView,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Mic,
  X,
  Sparkles,
  Volume2,
  RotateCcw,
  Clock,
  Check,
  HelpCircle,
  AlertTriangle,
} from 'lucide-react-native';
import { Fonts } from '../../../Theme/fonts';
import { Colors } from '../../../Assets/StyleUtilities/Colors';
import { useTheme } from '../../../Theme/ThemeContext';
import { DEFAULT_WAKE_WORD_PHRASE } from '../../../Services/WakeWord/WakeWordPresets';
import { SiaHolographicOrb } from './SiaHolographicOrb';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export type VoiceAssistantState =
  | 'idle'
  | 'wakeWordDetected'
  | 'greeting'
  | 'speaking'
  | 'listening'
  | 'processing'
  | 'executing'
  | 'generatingResponse'
  | 'success'
  | 'unrecognized'
  | 'error';

export type AssistantVisualState =
  | VoiceAssistantState
  | 'IDLE'
  | 'SPEAKING'
  | 'LISTENING'
  | 'PROCESSING'
  | 'CONFIRMED';

export function normalizeAssistantState(
  state?: AssistantVisualState,
): VoiceAssistantState {
  if (!state) return 'listening';
  switch (state) {
    case 'IDLE':
      return 'idle';
    case 'LISTENING':
      return 'listening';
    case 'PROCESSING':
      return 'processing';
    case 'SPEAKING':
      return 'speaking';
    case 'CONFIRMED':
      return 'success';
    default:
      return state;
  }
}

export interface VoiceAssistantSheetProps {
  visible: boolean;
  onClose: () => void;
  onActionSelected?: (actionType: string) => void;
  assistantState?: AssistantVisualState;
  greetingText?: string | null;
  activeVoiceName?: string | null;
  liveTranscript?: string | null;
  lastSpokenCommand?: string | null;
  confirmedActionTitle?: string | null;
  confirmedActionBody?: string | null;
  resultSummary?: string | null;
  spokenResponseText?: string | null;
  errorMessage?: string | null;
  speechFailed?: boolean;
  onMicPress?: () => void;
  onRetrySpeech?: () => void;
  wakeWordPhrase?: string;
  // Backward compatibility
  assistantReply?: string | null;
  isSpeaking?: boolean;
  isListening?: boolean;
}

export const VoiceAssistantSheet: React.FC<VoiceAssistantSheetProps> = ({
  visible,
  onClose,
  onActionSelected,
  assistantState = 'listening',
  greetingText,
  activeVoiceName,
  liveTranscript,
  lastSpokenCommand,
  confirmedActionTitle,
  confirmedActionBody,
  resultSummary,
  spokenResponseText,
  errorMessage,
  speechFailed,
  onMicPress,
  onRetrySpeech,
  wakeWordPhrase = DEFAULT_WAKE_WORD_PHRASE,
}) => {
  const insets = useSafeAreaInsets();
  const { isDarkMode } = useTheme();
  const currentState = normalizeAssistantState(assistantState);

  // Animation Refs
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const backdropAnim = useRef(new Animated.Value(0)).current;
  const [reduceMotion, setReduceMotion] = useState(false);

  // Animated Ellipsis for "SIA is Thinking…" state
  const [dotCount, setDotCount] = useState(1);

  // Equalizer wave bars for speaking animation
  const wave0 = useRef(new Animated.Value(0.25)).current;
  const wave1 = useRef(new Animated.Value(0.5)).current;
  const wave2 = useRef(new Animated.Value(0.35)).current;
  const wave3 = useRef(new Animated.Value(0.75)).current;
  const wave4 = useRef(new Animated.Value(0.4)).current;
  const waveBars = [wave0, wave1, wave2, wave3, wave4];

  const isIdle = currentState === 'idle';
  const isWakeWordDetected = currentState === 'wakeWordDetected';
  const isGreeting = currentState === 'greeting';
  const isListening = currentState === 'listening';
  const isProcessing = currentState === 'processing';
  const isExecuting = currentState === 'executing';
  const isGeneratingResponse = currentState === 'generatingResponse';
  const isSpeaking = currentState === 'speaking';
  const isSuccess = currentState === 'success';
  const isUnrecognized = currentState === 'unrecognized';
  const isError = currentState === 'error';

  // Genuine background thinking / AI processing state
  const isThinking = isProcessing || isGeneratingResponse;
  const isFinalState = isSuccess || isUnrecognized || isError;

  // Accessibility reduced motion check
  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled?.()
      .then(enabled => setReduceMotion(Boolean(enabled)))
      .catch(() => {});
  }, []);

  // Animated dots for thinking
  useEffect(() => {
    if (isThinking || isExecuting) {
      const interval = setInterval(() => {
        setDotCount(prev => (prev % 3) + 1);
      }, 420);
      return () => clearInterval(interval);
    } else {
      setDotCount(1);
    }
  }, [isThinking, isExecuting]);

  // Smooth slide-up full-screen sheet presentation
  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          friction: 9,
          tension: 65,
          useNativeDriver: true,
        }),
        Animated.timing(backdropAnim, {
          toValue: 1,
          duration: 260,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      slideAnim.setValue(SCREEN_HEIGHT);
      backdropAnim.setValue(0);
    }
  }, [visible, slideAnim, backdropAnim]);

  // Handle smooth closing animation
  const handleClose = useCallback(() => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: SCREEN_HEIGHT,
        duration: 240,
        easing: Easing.in(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(backdropAnim, {
        toValue: 0,
        duration: 200,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onClose();
    });
  }, [onClose, slideAnim, backdropAnim]);

  // Speaking animation loop (runs strictly while isSpeaking is active)
  useEffect(() => {
    if (isSpeaking && !reduceMotion) {
      const createBarAnim = (
        val: Animated.Value,
        min: number,
        max: number,
        upDuration: number,
        downDuration: number,
      ) => {
        return Animated.loop(
          Animated.sequence([
            Animated.timing(val, {
              toValue: max,
              duration: upDuration,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: true,
            }),
            Animated.timing(val, {
              toValue: min,
              duration: downDuration,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: true,
            }),
          ]),
        );
      };

      const anims = [
        createBarAnim(wave0, 0.2, 1.0, 240, 260),
        createBarAnim(wave1, 0.3, 0.9, 180, 220),
        createBarAnim(wave2, 0.15, 1.0, 310, 290),
        createBarAnim(wave3, 0.25, 0.85, 200, 230),
        createBarAnim(wave4, 0.2, 0.95, 270, 250),
      ];

      anims.forEach(a => a.start());

      return () => {
        anims.forEach(a => a.stop());
        wave0.setValue(0.25);
        wave1.setValue(0.5);
        wave2.setValue(0.35);
        wave3.setValue(0.75);
        wave4.setValue(0.4);
      };
    } else {
      wave0.setValue(0.25);
      wave1.setValue(0.5);
      wave2.setValue(0.35);
      wave3.setValue(0.75);
      wave4.setValue(0.4);
    }
  }, [isSpeaking, reduceMotion, wave0, wave1, wave2, wave3, wave4]);

  if (!visible && isIdle) return null;

  // ─── Status Headlines & Subtitles (Synchronized to SIA state) ───────────────
  let statusHeadline = 'SIA is Ready';
  let statusSubtitle =
    'Say any command to plan tasks, set reminders, or log habits.';
  let badgeLabel = 'SIA AI • Ready';
  let badgeVariant = 'purple';
  let badgeColor = '#8383D6';
  let badgeBg = '#EEF0FD';
  let badgeBorder = '#B6BEF5';

  if (isThinking) {
    statusHeadline = `SIA is Thinking${'.'.repeat(dotCount)}`;
    statusSubtitle = 'Interpreting your voice request...';
    badgeLabel = 'SIA AI • Thinking ⚡';
    badgeVariant = 'yellow';
    badgeColor = '#B47804';
    badgeBg = '#FFF8D0';
    badgeBorder = '#DEAA14';
  } else if (isExecuting) {
    statusHeadline = 'Taking care of it…';
    statusSubtitle = confirmedActionTitle || 'Updating your flow schedule...';
    badgeLabel = 'SIA AI • Taking Care of It ⚙️';
    badgeVariant = 'purple';
    badgeColor = '#4338CA';
    badgeBg = '#E0E7FF';
    badgeBorder = '#A5B4FC';
  } else if (isSpeaking) {
    statusHeadline = 'SIA is Speaking';
    statusSubtitle = 'Playing voice confirmation...';
    badgeLabel = activeVoiceName
      ? `SIA AI • ${activeVoiceName} 🔊`
      : 'SIA AI • Speaking 🔊';
    badgeVariant = 'purple';
    badgeColor = '#0369A1';
    badgeBg = '#E0F2FE';
    badgeBorder = '#7DD3FC';
  } else if (isListening) {
    statusHeadline = 'Listening…';
    statusSubtitle = liveTranscript
      ? 'Hearing you clearly. Pause when you are done.'
      : 'Speak now — SIA is listening.';
    badgeLabel = liveTranscript ? 'SIA AI • Live 🎙️' : 'SIA AI • Listening 🎙️';
    badgeVariant = 'green';
    badgeColor = '#1B9A72';
    badgeBg = '#E8FDF0';
    badgeBorder = '#82E8A6';
  } else if (isSuccess) {
    statusHeadline = confirmedActionTitle || 'Task Added';
    statusSubtitle =
      confirmedActionBody || 'Updated your productivity flow schedule.';
    badgeLabel = 'SIA AI • Completed ✨';
    badgeVariant = 'green';
    badgeColor = '#065F46';
    badgeBg = '#D1FAE5';
    badgeBorder = '#6EE7B7';
  } else if (isUnrecognized) {
    statusHeadline = 'Command Not Recognized';
    statusSubtitle =
      'I heard you, but was unable to match a command. Try one below.';
    badgeLabel = 'SIA AI • Not Recognized';
    badgeVariant = 'yellow';
    badgeColor = '#92400E';
    badgeBg = '#FEF3C7';
    badgeBorder = '#FCD34D';
  } else if (isError) {
    statusHeadline = confirmedActionTitle || 'Unable to Complete';
    statusSubtitle =
      errorMessage ||
      confirmedActionBody ||
      'An unexpected error occurred. Please try again.';
    badgeLabel = 'SIA AI • Error';
    badgeVariant = 'red';
    badgeColor = '#991B1B';
    badgeBg = '#FEE2E2';
    badgeBorder = '#FCA5A5';
  } else if (isWakeWordDetected) {
    statusHeadline = `“${wakeWordPhrase}”`;
    statusSubtitle = 'Wake phrase detected. Preparing assistant...';
    badgeLabel = 'SIA AI • Initialized';
    badgeVariant = 'purple';
    badgeColor = '#8383D6';
    badgeBg = '#EEF0FD';
    badgeBorder = '#B6BEF5';
  } else if (isGreeting) {
    statusHeadline = 'Connecting…';
    statusSubtitle = 'Preparing neural voice greeting...';
    badgeLabel = 'SIA AI • Greeting';
    badgeVariant = 'purple';
    badgeColor = '#8383D6';
    badgeBg = '#EEF0FD';
    badgeBorder = '#B6BEF5';
  }

  // Theme-aware palette
  const backgroundColor = isDarkMode ? '#121417' : '#FAF8F5';
  const cardBg = isDarkMode ? '#1E2228' : '#FFFFFF';
  const cardBorder = isDarkMode ? '#2C3035' : '#E8E2D5';
  const headlineColor = isDarkMode ? Colors.PureWhiteText : '#1F2228';
  const subtitleColor = isDarkMode ? '#A3A8B1' : '#666665';
  const closeBtnBg = isDarkMode ? '#2C3035' : '#EFECE6';
  const closeIconColor = isDarkMode ? '#FFFFFF' : '#1F2228';

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={handleClose}
      statusBarTranslucent
    >
      <View style={styles.modalRoot}>
        {/* Animated Dimming Backdrop */}
        <Animated.View
          style={[
            styles.backdrop,
            {
              opacity: backdropAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 0.65],
              }),
            },
          ]}
        >
          <Pressable style={StyleSheet.absoluteFill} onPress={handleClose} />
        </Animated.View>

        {/* Full-Screen SIA Sheet (Edge-to-Edge) */}
        <Animated.View
          style={[
            styles.fullScreenSheet,
            {
              backgroundColor,
              paddingTop: Math.max(insets.top, 16),
              paddingBottom: Math.max(insets.bottom, 16),
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          {/* Top Decorative Grab Handle */}
          <View style={styles.grabHandleBar} />

          {/* Header Navigation Bar */}
          <View style={styles.header}>
            {/* Regius 3D Tactile Status Badge */}
            <View
              style={[
                styles.badge3DContainer,
                {
                  backgroundColor: badgeBg,
                  borderBottomColor: badgeBorder,
                },
              ]}
            >
              <Sparkles size={13} color={badgeColor} />
              <Text style={[styles.badge3DText, { color: badgeColor }]}>
                {badgeLabel}
              </Text>
            </View>

            {/* Tactile Close Button */}
            <TouchableOpacity
              onPress={handleClose}
              style={[styles.closeButton, { backgroundColor: closeBtnBg }]}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              accessibilityRole="button"
              accessibilityLabel="Close SIA Voice Assistant"
            >
              <X size={18} color={closeIconColor} strokeWidth={2.4} />
            </TouchableOpacity>
          </View>

          {/* Scrollable Immersive Body */}
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            bounces={false}
          >
            {/* Status Headline & Subtitle */}
            <View style={styles.headlineContainer}>
              <Text
                style={[styles.statusHeadline, { color: headlineColor }]}
                numberOfLines={2}
              >
                {statusHeadline}
              </Text>
              <Text
                style={[styles.statusSubtitle, { color: subtitleColor }]}
                numberOfLines={2}
              >
                {statusSubtitle}
              </Text>
            </View>

            {/* Futuristic Holographic Orb Centerpiece */}
            <View style={styles.orbStage}>
              <SiaHolographicOrb
                state={currentState}
                size={144}
                onPress={onMicPress}
              />
            </View>

            {/* Interactive Transcription / Response Card */}
            <View
              style={[
                styles.dialogueCard,
                {
                  backgroundColor: cardBg,
                  borderColor: cardBorder,
                },
              ]}
            >
              {isSuccess ? (
                <>
                  <View style={styles.cardHeaderRow}>
                    <View style={styles.successCheckCircle}>
                      <Check size={16} color="#FFFFFF" strokeWidth={3} />
                    </View>
                    <Text
                      style={[
                        styles.cardHeadlineConfirmed,
                        { color: isDarkMode ? '#A7F3D0' : '#065F46' },
                      ]}
                    >
                      {confirmedActionTitle || 'Command Executed'}
                    </Text>
                  </View>

                  <Text
                    style={[
                      styles.cardBodyConfirmed,
                      { color: isDarkMode ? '#D1D5DB' : '#374151' },
                    ]}
                  >
                    {confirmedActionBody ||
                      'Updated your productivity flow schedule.'}
                  </Text>

                  {resultSummary ? (
                    <View style={styles.resultSummaryChip}>
                      <Check size={13} color="#065F46" strokeWidth={2.6} />
                      <Text style={styles.resultSummaryChipText}>
                        {resultSummary}
                      </Text>
                    </View>
                  ) : null}

                  {speechFailed ? (
                    <View style={styles.speechFailedNotice}>
                      <AlertTriangle size={13} color="#D97706" />
                      <Text style={styles.speechFailedNoticeText}>
                        {errorMessage || 'Voice confirmation failed to play.'}
                      </Text>
                    </View>
                  ) : null}

                  {lastSpokenCommand ? (
                    <View style={styles.spokenQuoteTag}>
                      <Text style={styles.spokenQuoteLabel}>Spoken:</Text>
                      <Text style={styles.spokenQuoteContent} numberOfLines={2}>
                        &ldquo;{lastSpokenCommand}&rdquo;
                      </Text>
                    </View>
                  ) : null}
                </>
              ) : isUnrecognized ? (
                <>
                  <View style={styles.cardHeaderRow}>
                    <View style={styles.unrecAlertCircle}>
                      <HelpCircle size={16} color="#FFFFFF" strokeWidth={2.6} />
                    </View>
                    <Text style={styles.cardHeadlineUnrec}>
                      {confirmedActionTitle || 'Not Recognized'}
                    </Text>
                  </View>

                  <Text style={styles.cardBodyUnrec}>
                    {confirmedActionBody ||
                      `I heard "${
                        lastSpokenCommand || 'that'
                      }". Try saying "Schedule sprint review at 3 PM" or "Log 20-min meditation".`}
                  </Text>

                  {lastSpokenCommand ? (
                    <View style={styles.spokenQuoteTag}>
                      <Text style={styles.spokenQuoteLabel}>Heard:</Text>
                      <Text style={styles.spokenQuoteContent} numberOfLines={2}>
                        &ldquo;{lastSpokenCommand}&rdquo;
                      </Text>
                    </View>
                  ) : null}
                </>
              ) : isError ? (
                <>
                  <View style={styles.cardHeaderRow}>
                    <View style={styles.errorAlertCircle}>
                      <AlertTriangle
                        size={16}
                        color="#FFFFFF"
                        strokeWidth={2.6}
                      />
                    </View>
                    <Text style={styles.cardHeadlineError}>
                      {confirmedActionTitle || 'Request Incomplete'}
                    </Text>
                  </View>

                  <Text style={styles.cardBodyError}>
                    {errorMessage ||
                      confirmedActionBody ||
                      'An unexpected error occurred while executing the command.'}
                  </Text>

                  {lastSpokenCommand ? (
                    <View style={styles.spokenQuoteTag}>
                      <Text style={styles.spokenQuoteLabel}>Command:</Text>
                      <Text style={styles.spokenQuoteContent} numberOfLines={2}>
                        &ldquo;{lastSpokenCommand}&rdquo;
                      </Text>
                    </View>
                  ) : null}
                </>
              ) : isSpeaking ? (
                <>
                  <Text
                    style={[
                      styles.speakingResponseQuote,
                      { color: isDarkMode ? '#FFFFFF' : '#1F2228' },
                    ]}
                  >
                    &ldquo;
                    {spokenResponseText ||
                      greetingText ||
                      'Yes, this is SIA. How can I assist you?'}
                    &rdquo;
                  </Text>

                  <View style={styles.speakingWaveformRow}>
                    <Text style={styles.speakingWaveformLabel}>
                      {activeVoiceName
                        ? `Synthesized with ${activeVoiceName}`
                        : 'Playing audio confirmation'}
                    </Text>
                    {/* Dynamic Equalizer Visualizer */}
                    <View style={styles.equalizerContainer}>
                      {waveBars.map((barAnim, idx) => (
                        <Animated.View
                          key={idx}
                          style={[
                            styles.equalizerBar,
                            {
                              transform: [{ scaleY: barAnim }],
                            },
                          ]}
                        />
                      ))}
                    </View>
                  </View>
                </>
              ) : isThinking ? (
                <>
                  {lastSpokenCommand ? (
                    <View style={styles.thinkingQuoteRow}>
                      <Text
                        style={[
                          styles.spokenQuoteContent,
                          styles.thinkingQuoteText,
                          { color: isDarkMode ? '#F3F4F6' : '#1F2228' },
                        ]}
                      >
                        &ldquo;{lastSpokenCommand}&rdquo;
                      </Text>
                    </View>
                  ) : null}

                  <View style={styles.thinkingStatusRow}>
                    <Sparkles size={16} color="#D97706" />
                    <Text style={styles.thinkingStatusLabel}>
                      SIA is analyzing your request and preparing actions…
                    </Text>
                  </View>
                </>
              ) : isExecuting ? (
                <>
                  <Text
                    style={[
                      styles.cardHeadline,
                      { color: isDarkMode ? '#FFFFFF' : '#1F2228' },
                    ]}
                  >
                    {confirmedActionTitle || 'Taking care of it…'}
                  </Text>
                  <Text
                    style={[
                      styles.cardBody,
                      { color: isDarkMode ? '#9CA3AF' : '#46464A' },
                    ]}
                  >
                    {lastSpokenCommand
                      ? `“${lastSpokenCommand}”`
                      : 'Scheduling task in your flow timeline...'}
                  </Text>
                </>
              ) : liveTranscript ? (
                <>
                  <Text
                    style={[
                      styles.liveTranscriptQuote,
                      { color: isDarkMode ? '#FFFFFF' : '#1F2228' },
                    ]}
                  >
                    &ldquo;{liveTranscript}…&rdquo;
                  </Text>
                  <Text style={styles.liveTranscriptHint}>
                    Listening in real-time. Pause when you are finished
                    speaking.
                  </Text>
                </>
              ) : (
                <>
                  <Text
                    style={[
                      styles.cardHeadline,
                      { color: isDarkMode ? '#FFFFFF' : '#1F2228' },
                    ]}
                  >
                    {greetingText ? `“${greetingText}”` : '“I’m listening…”'}
                  </Text>
                  <Text
                    style={[
                      styles.cardBody,
                      { color: isDarkMode ? '#9CA3AF' : '#46464A' },
                    ]}
                  >
                    Speak naturally. Try logging a meditation, scheduling a
                    review, or creating a new task.
                  </Text>
                </>
              )}
            </View>

            {/* Quick Contextual Commands (when ready, listening, or unrecognized) */}
            {(!isFinalState || isUnrecognized) && (
              <View style={styles.quickCommandsSection}>
                <Text
                  style={[
                    styles.quickCommandsTitle,
                    { color: isDarkMode ? '#9CA3AF' : '#77767B' },
                  ]}
                >
                  {isUnrecognized
                    ? 'TRY ONE OF THESE'
                    : 'QUICK SPOKEN COMMANDS'}
                </Text>

                <View style={styles.chipsWrap}>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => onActionSelected?.('schedule_sprint')}
                    style={[
                      styles.commandChip,
                      {
                        backgroundColor: isDarkMode ? '#272A30' : '#FFFCEB',
                        borderColor: isDarkMode ? '#3A3F46' : '#FFF5B8',
                      },
                    ]}
                  >
                    <Clock size={14} color="#D97706" />
                    <Text
                      style={[
                        styles.commandChipText,
                        { color: isDarkMode ? '#F3F4F6' : '#1F2228' },
                      ]}
                    >
                      “Schedule sprint review at 3 PM”
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => onActionSelected?.('log_meditation')}
                    style={[
                      styles.commandChip,
                      {
                        backgroundColor: isDarkMode ? '#1E2D26' : '#EDFDF5',
                        borderColor: isDarkMode ? '#2A4638' : '#C6FFDD',
                      },
                    ]}
                  >
                    <Sparkles size={14} color="#2E7D32" />
                    <Text
                      style={[
                        styles.commandChipText,
                        { color: isDarkMode ? '#F3F4F6' : '#1F2228' },
                      ]}
                    >
                      “Log 20-min meditation”
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => onActionSelected?.('play_brief')}
                    style={[
                      styles.commandChip,
                      {
                        backgroundColor: isDarkMode ? '#252538' : '#EFF2FE',
                        borderColor: isDarkMode ? '#373756' : '#D8DBFF',
                      },
                    ]}
                  >
                    <Volume2 size={14} color="#8383D6" />
                    <Text
                      style={[
                        styles.commandChipText,
                        { color: isDarkMode ? '#F3F4F6' : '#1F2228' },
                      ]}
                    >
                      “Play Morning Brief”
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => onActionSelected?.('extend_time')}
                    style={[
                      styles.commandChip,
                      {
                        backgroundColor: isDarkMode ? '#2B2822' : '#FFF3E0',
                        borderColor: isDarkMode ? '#453E32' : '#FFE0B2',
                      },
                    ]}
                  >
                    <RotateCcw size={14} color="#EA580C" />
                    <Text
                      style={[
                        styles.commandChipText,
                        { color: isDarkMode ? '#F3F4F6' : '#1F2228' },
                      ]}
                    >
                      “+15 mins to Focus”
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </ScrollView>

          {/* Bottom Dock / Action Controls */}
          <View style={styles.bottomDockContainer}>
            {isFinalState ? (
              <View style={styles.finalActionsRow}>
                {speechFailed ? (
                  <TouchableOpacity
                    activeOpacity={0.85}
                    onPress={onRetrySpeech || onMicPress}
                    style={styles.retryVoiceBtn}
                  >
                    <Volume2 size={16} color="#0284C7" />
                    <Text style={styles.retryVoiceBtnText}>Retry Voice</Text>
                  </TouchableOpacity>
                ) : null}

                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={onMicPress}
                  style={[
                    styles.secondaryActionBtn,
                    {
                      backgroundColor: isDarkMode ? '#2C3035' : '#EFECE6',
                    },
                  ]}
                >
                  <Mic size={16} color={isDarkMode ? '#FFFFFF' : '#1F2228'} />
                  <Text
                    style={[
                      styles.secondaryActionBtnText,
                      { color: isDarkMode ? '#FFFFFF' : '#1F2228' },
                    ]}
                  >
                    {isError ? 'Retry' : 'Speak Another'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.88}
                  onPress={handleClose}
                  style={styles.primaryDoneBtn}
                >
                  <Text style={styles.primaryDoneBtnText}>Done</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.activeDockRow}>
                <TouchableOpacity
                  activeOpacity={0.88}
                  onPress={onMicPress}
                  style={[
                    styles.micPillBtn,
                    isListening && styles.micPillBtnListening,
                    isThinking && styles.micPillBtnThinking,
                  ]}
                  accessibilityRole="button"
                  accessibilityLabel={
                    isListening
                      ? 'Stop microphone'
                      : isThinking
                      ? 'SIA is thinking'
                      : isSpeaking
                      ? 'Interrupt SIA'
                      : 'Start speaking'
                  }
                >
                  <Mic size={20} color="#FFFFFF" strokeWidth={2.4} />
                  <Text style={styles.micPillBtnText}>
                    {isListening
                      ? 'Listening… (Tap to finish)'
                      : isThinking
                      ? 'SIA is Thinking…'
                      : isSpeaking
                      ? 'Tap mic to interrupt'
                      : 'Tap to Speak'}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalRoot: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: '#000000',
  },
  fullScreenSheet: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: '#FAF8F5',
  },
  grabHandleBar: {
    width: 44,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#D5D0C5',
    alignSelf: 'center',
    marginBottom: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 22,
    paddingBottom: 6,
  },
  badge3DContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#FFFFFF',
    borderBottomWidth: 2.2,
    ...Platform.select({
      ios: {
        shadowColor: '#8383D6',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.22,
        shadowRadius: 3.5,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  badge3DText: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: 12,
    letterSpacing: 0.3,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 22,
    paddingTop: 10,
    paddingBottom: 24,
    alignItems: 'center',
  },
  headlineContainer: {
    alignItems: 'center',
    marginVertical: 10,
    paddingHorizontal: 16,
  },
  statusHeadline: {
    fontFamily: Fonts.ranade.bold,
    fontSize: 25,
    lineHeight: 31,
    textAlign: 'center',
    letterSpacing: -0.3,
    marginBottom: 6,
  },
  statusSubtitle: {
    fontFamily: Fonts.poppins.regular,
    fontSize: 13.5,
    lineHeight: 20,
    textAlign: 'center',
  },
  orbStage: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 14,
  },
  dialogueCard: {
    width: '100%',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1.5,
    marginVertical: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.06,
        shadowRadius: 12,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  successCheckCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#059669',
    alignItems: 'center',
    justifyContent: 'center',
  },
  unrecAlertCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#D97706',
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorAlertCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#DC2626',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardHeadlineConfirmed: {
    fontFamily: Fonts.poppins.bold,
    fontSize: 16,
  },
  cardBodyConfirmed: {
    fontFamily: Fonts.poppins.regular,
    fontSize: 13.5,
    lineHeight: 21,
  },
  cardHeadlineUnrec: {
    fontFamily: Fonts.poppins.bold,
    fontSize: 16,
    color: '#92400E',
  },
  cardBodyUnrec: {
    fontFamily: Fonts.poppins.regular,
    fontSize: 13.5,
    lineHeight: 21,
    color: '#92400E',
  },
  cardHeadlineError: {
    fontFamily: Fonts.poppins.bold,
    fontSize: 16,
    color: '#991B1B',
  },
  cardBodyError: {
    fontFamily: Fonts.poppins.regular,
    fontSize: 13.5,
    lineHeight: 21,
    color: '#B91C1C',
  },
  cardHeadline: {
    fontFamily: Fonts.poppins.bold,
    fontSize: 16,
    marginBottom: 6,
  },
  cardBody: {
    fontFamily: Fonts.poppins.regular,
    fontSize: 13.5,
    lineHeight: 21,
  },
  speakingResponseQuote: {
    fontFamily: Fonts.ranade.medium,
    fontSize: 17,
    lineHeight: 25,
    marginBottom: 10,
  },
  speakingWaveformRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: '#EFECE6',
  },
  speakingWaveformLabel: {
    fontFamily: Fonts.poppins.medium,
    fontSize: 12,
    color: '#0284C7',
  },
  equalizerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    height: 24,
    paddingHorizontal: 4,
  },
  equalizerBar: {
    width: 3.5,
    height: 20,
    borderRadius: 2,
    backgroundColor: '#0284C7',
  },
  thinkingQuoteRow: {
    marginBottom: 10,
  },
  thinkingQuoteText: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: 15,
    lineHeight: 22,
  },
  thinkingStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  thinkingStatusLabel: {
    flex: 1,
    fontFamily: Fonts.poppins.medium,
    fontSize: 12.5,
    color: '#D97706',
  },
  liveTranscriptQuote: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 6,
  },
  liveTranscriptHint: {
    fontFamily: Fonts.poppins.regular,
    fontSize: 12.5,
    color: '#059669',
  },
  spokenQuoteTag: {
    backgroundColor: '#F5F3ED',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    maxWidth: '100%',
  },
  spokenQuoteLabel: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: 11.5,
    color: '#78716C',
  },
  spokenQuoteContent: {
    fontFamily: Fonts.poppins.medium,
    fontSize: 12,
    color: '#292524',
    flexShrink: 1,
  },
  resultSummaryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#E6F4EA',
    borderWidth: 1,
    borderColor: '#CCE6D0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginTop: 10,
  },
  resultSummaryChipText: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: 12,
    color: '#065F46',
  },
  speechFailedNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  speechFailedNoticeText: {
    fontFamily: Fonts.poppins.medium,
    fontSize: 11.5,
    color: '#92400E',
  },
  quickCommandsSection: {
    width: '100%',
    marginTop: 6,
  },
  quickCommandsTitle: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: 12,
    letterSpacing: 0.6,
    marginBottom: 10,
    paddingHorizontal: 2,
  },
  chipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  commandChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 22,
    borderWidth: 1,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.04,
        shadowRadius: 3,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  commandChipText: {
    fontFamily: Fonts.poppins.medium,
    fontSize: 12,
  },
  bottomDockContainer: {
    width: '100%',
    paddingHorizontal: 22,
    paddingTop: 12,
  },
  activeDockRow: {
    width: '100%',
    alignItems: 'center',
  },
  micPillBtn: {
    width: '100%',
    height: 54,
    borderRadius: 50,
    backgroundColor: '#1F2228',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 10,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  micPillBtnListening: {
    backgroundColor: '#059669',
  },
  micPillBtnThinking: {
    backgroundColor: '#D97706',
  },
  micPillBtnText: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: 15,
    color: '#FFFFFF',
  },
  finalActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    width: '100%',
  },
  primaryDoneBtn: {
    flex: 1,
    height: 52,
    borderRadius: 50,
    backgroundColor: '#1F2228',
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  primaryDoneBtnText: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: 15,
    color: '#FFFFFF',
  },
  secondaryActionBtn: {
    height: 52,
    paddingHorizontal: 20,
    borderRadius: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  secondaryActionBtnText: {
    fontFamily: Fonts.poppins.medium,
    fontSize: 14,
  },
  retryVoiceBtn: {
    height: 52,
    paddingHorizontal: 16,
    borderRadius: 50,
    backgroundColor: '#E0F2FE',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  retryVoiceBtnText: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: 13,
    color: '#0284C7',
  },
});

export default VoiceAssistantSheet;
