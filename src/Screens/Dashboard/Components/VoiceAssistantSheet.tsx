import React, { useEffect, useRef, useState } from 'react';
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
  StyleProp,
  ViewStyle,
} from 'react-native';
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
}) => {
  const currentState = normalizeAssistantState(assistantState);

  const pulseAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const [reduceMotion, setReduceMotion] = useState(false);

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

  const isFinalState = isSuccess || isUnrecognized || isError;

  // Check reduced motion accessibility
  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled?.()
      .then(enabled => setReduceMotion(Boolean(enabled)))
      .catch(() => {});
  }, []);

  // Slide-in modal animation & pulse loop
  useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, {
        toValue: 0,
        friction: 8,
        tension: 65,
        useNativeDriver: true,
      }).start();

      if (!reduceMotion && !isFinalState) {
        const pulseLoop = Animated.loop(
          Animated.sequence([
            Animated.timing(pulseAnim, {
              toValue: isProcessing || isExecuting ? 1.18 : 1.25,
              duration: isProcessing || isExecuting ? 500 : 850,
              useNativeDriver: true,
            }),
            Animated.timing(pulseAnim, {
              toValue: 1,
              duration: isProcessing || isExecuting ? 500 : 850,
              useNativeDriver: true,
            }),
          ]),
        );
        pulseLoop.start();
        return () => {
          pulseLoop.stop();
        };
      }
    } else {
      slideAnim.setValue(SCREEN_HEIGHT);
    }
  }, [visible, slideAnim, pulseAnim, isProcessing, isExecuting, isFinalState, reduceMotion]);

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

  if (!visible || isIdle) return null;

  // Determine dynamic badge & text
  let badgeText = 'Aria Flow Assistant';
  let badgeBg = '#CCE6D0';
  let badgeTextColor = '#354C3B';
  let BadgeIcon = Sparkles;

  if (isSuccess) {
    badgeText = 'Command Completed ✨';
    badgeBg = '#D1FAE5';
    badgeTextColor = '#065F46';
    BadgeIcon = Sparkles;
  } else if (isUnrecognized) {
    badgeText = 'Command Not Recognized';
    badgeBg = '#FEF3C7';
    badgeTextColor = '#92400E';
    BadgeIcon = HelpCircle;
  } else if (isError) {
    badgeText = 'Command Failed';
    badgeBg = '#FEE2E2';
    badgeTextColor = '#991B1B';
    BadgeIcon = AlertTriangle;
  } else if (isExecuting) {
    badgeText = 'Working on Request... ⚙️';
    badgeBg = '#E0E7FF';
    badgeTextColor = '#3730A3';
    BadgeIcon = Sparkles;
  } else if (isGeneratingResponse) {
    badgeText = 'Preparing Response... 🪄';
    badgeBg = '#F3E8FF';
    badgeTextColor = '#6B21A8';
    BadgeIcon = Sparkles;
  } else if (isGreeting) {
    badgeText = 'Preparing Greeting... 🪄';
    badgeBg = '#F3E8FF';
    badgeTextColor = '#6B21A8';
    BadgeIcon = Sparkles;
  } else if (isWakeWordDetected) {
    badgeText = 'Hey Regius Detected ✨';
    badgeBg = '#CCE6D0';
    badgeTextColor = '#2E7D32';
    BadgeIcon = Sparkles;
  } else if (isProcessing) {
    badgeText = 'Understanding Request... ⚡';
    badgeBg = '#FEF3C7';
    badgeTextColor = '#92400E';
    BadgeIcon = Sparkles;
  } else if (isSpeaking) {
    badgeText = activeVoiceName
      ? `Regius Speaking • ${activeVoiceName} 🔊`
      : 'Regius Speaking 🔊';
    badgeBg = '#E0F2FE';
    badgeTextColor = '#0369A1';
    BadgeIcon = Volume2;
  } else if (isListening) {
    badgeText = liveTranscript ? 'Listening Live 🎙️' : 'Listening... 🎙️';
    badgeBg = '#CCE6D0';
    badgeTextColor = '#2E7D32';
    BadgeIcon = Mic;
  }

  // Determine Orb colors and icon
  let micCircleStyle: StyleProp<ViewStyle> = styles.micCircle;
  let pulseRingStyle: StyleProp<ViewStyle> = styles.pulseRing;

  if (isSuccess) {
    micCircleStyle = [styles.micCircle, styles.micCircleSuccess];
  } else if (isUnrecognized) {
    micCircleStyle = [styles.micCircle, styles.micCircleUnrecognized];
  } else if (isError) {
    micCircleStyle = [styles.micCircle, styles.micCircleError];
  } else if (isSpeaking) {
    micCircleStyle = [styles.micCircle, styles.micCircleSpeaking];
    pulseRingStyle = [styles.pulseRing, styles.pulseRingSpeaking];
  } else if (isGeneratingResponse || isGreeting) {
    micCircleStyle = [styles.micCircle, styles.micCircleGenerating];
    pulseRingStyle = [styles.pulseRing, styles.pulseRingGenerating];
  } else if (isWakeWordDetected) {
    micCircleStyle = styles.micCircle;
    pulseRingStyle = styles.pulseRing;
  } else if (isExecuting) {
    micCircleStyle = [styles.micCircle, styles.micCircleExecuting];
    pulseRingStyle = [styles.pulseRing, styles.pulseRingExecuting];
  } else if (isProcessing) {
    micCircleStyle = [styles.micCircle, styles.micCircleProcessing];
    pulseRingStyle = [styles.pulseRing, styles.pulseRingProcessing];
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <Pressable style={styles.dismissArea} onPress={onClose} />

        <Animated.View
          style={[
            styles.sheetContainer,
            { transform: [{ translateY: slideAnim }] },
          ]}
        >
          {/* Top Grab Handle */}
          <View style={styles.handle} />

          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerTitleRow}>
              <View
                style={[styles.assistantBadge, { backgroundColor: badgeBg }]}
              >
                <BadgeIcon size={14} color={badgeTextColor} />
                <Text
                  style={[styles.assistantBadgeText, { color: badgeTextColor }]}
                >
                  {badgeText}
                </Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={onClose}
              style={styles.closeBtn}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            >
              <X size={18} color="#1B1C19" />
            </TouchableOpacity>
          </View>

          {/* Animated Glowing Voice Orb */}
          <View style={styles.orbWrapper}>
            {!isFinalState && (
              <Animated.View
                style={[
                  pulseRingStyle,
                  { transform: [{ scale: pulseAnim }] },
                ]}
              />
            )}
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={onMicPress}
              style={micCircleStyle}
            >
              {isSuccess ? (
                <Check size={28} color="#FFFFFF" strokeWidth={2.6} />
              ) : isUnrecognized ? (
                <HelpCircle size={28} color="#FFFFFF" strokeWidth={2.4} />
              ) : isError ? (
                <AlertTriangle size={28} color="#FFFFFF" strokeWidth={2.4} />
              ) : isSpeaking ? (
                <Volume2 size={26} color="#FFFFFF" strokeWidth={2.4} />
              ) : isGeneratingResponse || isExecuting || isProcessing ? (
                <Sparkles size={24} color="#FFFFFF" />
              ) : (
                <Mic size={28} color="#FFFFFF" strokeWidth={2.4} />
              )}
            </TouchableOpacity>
          </View>

          {/* Dialogue Box */}
          <View style={styles.dialogueBox}>
            {isSuccess ? (
              <>
                <Text style={styles.greetingTitleConfirmed}>
                  {confirmedActionTitle || 'Command Completed!'}
                </Text>
                <Text style={styles.dialogueBodyConfirmed}>
                  {confirmedActionBody ||
                    'Updated your productivity flow schedule.'}
                </Text>

                {resultSummary ? (
                  <View style={styles.resultSummaryContainer}>
                    <Check size={14} color="#065F46" strokeWidth={2.5} />
                    <Text style={styles.resultSummaryText}>{resultSummary}</Text>
                  </View>
                ) : null}

                {speechFailed ? (
                  <View style={styles.speechFailedNotice}>
                    <AlertTriangle size={14} color="#D97706" />
                    <Text style={styles.speechFailedNoticeText}>
                      {errorMessage || 'Voice confirmation failed to play.'}
                    </Text>
                  </View>
                ) : null}

                {lastSpokenCommand ? (
                  <View style={styles.spokenCommandTag}>
                    <Text style={styles.spokenCommandTagText}>
                      Spoken: &ldquo;{lastSpokenCommand}&rdquo;
                    </Text>
                  </View>
                ) : null}
              </>
            ) : isUnrecognized ? (
              <>
                <Text style={styles.greetingTitleUnrecognized}>
                  {confirmedActionTitle || 'Command Not Recognized'}
                </Text>
                <Text style={styles.dialogueBodyUnrecognized}>
                  {confirmedActionBody ||
                    `I heard "${lastSpokenCommand || 'that'}". Try saying "Schedule sprint review", "Log meditation", or "Add task..."`}
                </Text>
                {lastSpokenCommand ? (
                  <View style={styles.spokenCommandTag}>
                    <Text style={styles.spokenCommandTagText}>
                      Spoken: &ldquo;{lastSpokenCommand}&rdquo;
                    </Text>
                  </View>
                ) : null}
              </>
            ) : isError ? (
              <>
                <Text style={styles.greetingTitleError}>
                  {confirmedActionTitle || 'Unable to Complete Request'}
                </Text>
                <Text style={styles.dialogueBodyError}>
                  {errorMessage ||
                    confirmedActionBody ||
                    'An unexpected error occurred. Please try again.'}
                </Text>
                {lastSpokenCommand ? (
                  <View style={styles.spokenCommandTag}>
                    <Text style={styles.spokenCommandTagText}>
                      Spoken: &ldquo;{lastSpokenCommand}&rdquo;
                    </Text>
                  </View>
                ) : null}
              </>
            ) : isSpeaking ? (
              <>
                <Text style={styles.greetingTitle}>
                  &ldquo;{spokenResponseText || greetingText || 'Yes, this is Regius.'}&rdquo;
                </Text>
                <View style={styles.speakingWaveformRow}>
                  <Text style={styles.dialogueBodySpeaking}>
                    Playing voice confirmation...
                  </Text>
                  {/* Dynamic Equalizer Visualizer */}
                  <View style={styles.speakingWaveformContainer}>
                    {waveBars.map((barAnim, idx) => (
                      <Animated.View
                        key={idx}
                        style={[
                          styles.speakingWaveBar,
                          {
                            transform: [{ scaleY: barAnim }],
                          },
                        ]}
                      />
                    ))}
                  </View>
                </View>
              </>
            ) : isWakeWordDetected ? (
              <>
                <Text style={styles.greetingTitle}>“Hey Regius”</Text>
                <Text style={styles.dialogueBodyActive}>
                  Wake word detected. Initializing assistant...
                </Text>
              </>
            ) : isGreeting ? (
              <>
                <Text style={styles.greetingTitle}>“Connecting...”</Text>
                <Text style={styles.dialogueBodyActive}>
                  Preparing neural voice greeting...
                </Text>
              </>
            ) : isGeneratingResponse ? (
              <>
                <Text style={styles.greetingTitle}>
                  {confirmedActionTitle ? `“${confirmedActionTitle}”` : '“Preparing response...”'}
                </Text>
                <Text style={styles.dialogueBodyActive}>
                  {activeVoiceName
                    ? `Preparing voice confirmation with ${activeVoiceName}...`
                    : 'Synthesizing voice confirmation...'}
                </Text>
              </>
            ) : isExecuting ? (
              <>
                <Text style={styles.greetingTitle}>
                  {confirmedActionTitle ? `“${confirmedActionTitle}”` : '“Working on your request...”'}
                </Text>
                <Text style={styles.dialogueBodyActive}>
                  {lastSpokenCommand
                    ? `“${lastSpokenCommand}”`
                    : 'Executing command in your productivity flow...'}
                </Text>
              </>
            ) : isProcessing ? (
              <>
                <Text style={styles.greetingTitle}>“Understanding request...”</Text>
                <Text style={styles.dialogueBodyActive}>
                  {lastSpokenCommand || liveTranscript
                    ? `“${lastSpokenCommand || liveTranscript}”`
                    : 'Interpreting voice input in your timeline...'}
                </Text>
              </>
            ) : liveTranscript ? (
              <>
                <Text style={styles.greetingTitle}>“{liveTranscript}...”</Text>
                <Text style={styles.dialogueBodyActive}>
                  Listening in real-time. Pause when you are done speaking.
                </Text>
              </>
            ) : (
              <>
                <Text style={styles.greetingTitle}>
                  {greetingText ? `“${greetingText}”` : "“I'm listening...”"}
                </Text>
                <Text style={styles.dialogueBody}>
                  Say any command: log meditation, schedule sprint review, or
                  add a task to your flow.
                </Text>
              </>
            )}
          </View>

          {/* Bottom Actions or Quick Suggestions */}
          {isFinalState ? (
            <View style={styles.finalActionsContainer}>
              {/* For unrecognized commands, also show helpful command examples to tap */}
              {isUnrecognized && (
                <View style={styles.unrecognizedSuggestions}>
                  <Text style={styles.actionsHeader}>Try One of These</Text>
                  <View style={styles.chipsContainer}>
                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={() => onActionSelected?.('schedule_sprint')}
                      style={styles.actionChip}
                    >
                      <Clock size={13} color="#D97706" />
                      <Text style={styles.actionChipText}>
                        “Schedule sprint review”
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={() => onActionSelected?.('log_meditation')}
                      style={styles.actionChip}
                    >
                      <Sparkles size={13} color="#2E7D32" />
                      <Text style={styles.actionChipText}>
                        “Log 20-min meditation”
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}

              <View style={styles.confirmedRow}>
                {speechFailed ? (
                  <TouchableOpacity
                    activeOpacity={0.85}
                    onPress={onRetrySpeech || onMicPress}
                    style={styles.retrySpeechBtn}
                  >
                    <Volume2 size={16} color="#0284C7" />
                    <Text style={styles.retrySpeechBtnText}>Retry Voice</Text>
                  </TouchableOpacity>
                ) : null}
                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={onClose}
                  style={styles.doneBtn}
                >
                  <Text style={styles.doneBtnText}>Done</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={onMicPress}
                  style={styles.speakAgainBtn}
                >
                  <Mic size={16} color="#1B1C19" />
                  <Text style={styles.speakAgainBtnText}>
                    {isError ? 'Retry' : 'Speak Another'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <>
              <Text style={styles.actionsHeader}>Quick Spoken Commands</Text>
              <View style={styles.chipsContainer}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => onActionSelected?.('log_meditation')}
                  style={styles.actionChip}
                >
                  <Sparkles size={14} color="#2E7D32" />
                  <Text style={styles.actionChipText}>
                    “Log 20-min meditation”
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => onActionSelected?.('schedule_sprint')}
                  style={styles.actionChip}
                >
                  <Clock size={14} color="#D97706" />
                  <Text style={styles.actionChipText}>
                    “Schedule sprint review at 3 PM”
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => onActionSelected?.('play_brief')}
                  style={styles.actionChip}
                >
                  <Volume2 size={14} color="#1B1C19" />
                  <Text style={styles.actionChipText}>Play Morning Brief</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => onActionSelected?.('extend_time')}
                  style={styles.actionChip}
                >
                  <RotateCcw size={14} color="#1B1C19" />
                  <Text style={styles.actionChipText}>+15 mins to Focus</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(27, 28, 25, 0.45)',
    justifyContent: 'flex-end',
  },
  dismissArea: {
    flex: 1,
  },
  sheetContainer: {
    backgroundColor: '#FBF9F3',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 22,
    paddingTop: 12,
    paddingBottom: 40,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.12,
    shadowRadius: 18,
    elevation: 16,
  },
  handle: {
    width: 44,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#C7C6CA',
    marginBottom: 16,
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  assistantBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#CCE6D0',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 16,
  },
  assistantBadgeText: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: 12,
    color: '#354C3B',
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F0EEE8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  orbWrapper: {
    width: 100,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 12,
  },
  pulseRing: {
    position: 'absolute',
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(204, 230, 208, 0.65)',
  },
  pulseRingProcessing: {
    backgroundColor: 'rgba(254, 243, 199, 0.85)',
  },
  pulseRingExecuting: {
    backgroundColor: 'rgba(224, 231, 255, 0.85)',
  },
  pulseRingGenerating: {
    backgroundColor: 'rgba(243, 232, 255, 0.85)',
  },
  pulseRingSpeaking: {
    backgroundColor: 'rgba(224, 242, 254, 0.85)',
  },
  micCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#010102',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  micCircleProcessing: {
    backgroundColor: '#D97706',
  },
  micCircleExecuting: {
    backgroundColor: '#4F46E5',
  },
  micCircleGenerating: {
    backgroundColor: '#7C3AED',
  },
  micCircleSpeaking: {
    backgroundColor: '#0284C7',
  },
  micCircleSuccess: {
    backgroundColor: '#2E7D32',
  },
  micCircleUnrecognized: {
    backgroundColor: '#D97706',
  },
  micCircleError: {
    backgroundColor: '#DC2626',
  },
  dialogueBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    width: '100%',
    borderWidth: 1,
    borderColor: '#EAE8E2',
    marginVertical: 14,
  },
  greetingTitle: {
    fontFamily: Fonts.poppins.bold,
    fontSize: 16,
    color: '#1B1C19',
    marginBottom: 6,
  },
  greetingTitleConfirmed: {
    fontFamily: Fonts.poppins.bold,
    fontSize: 16,
    color: '#1B1C19',
    marginBottom: 4,
  },
  greetingTitleUnrecognized: {
    fontFamily: Fonts.poppins.bold,
    fontSize: 16,
    color: '#92400E',
    marginBottom: 4,
  },
  greetingTitleError: {
    fontFamily: Fonts.poppins.bold,
    fontSize: 16,
    color: '#991B1B',
    marginBottom: 4,
  },
  dialogueBody: {
    fontFamily: Fonts.poppins.regular,
    fontSize: 13.5,
    lineHeight: 20,
    color: '#46464A',
  },
  dialogueBodyConfirmed: {
    fontFamily: Fonts.poppins.regular,
    fontSize: 13.5,
    lineHeight: 20,
    color: '#2E7D32',
  },
  dialogueBodyUnrecognized: {
    fontFamily: Fonts.poppins.regular,
    fontSize: 13.5,
    lineHeight: 20,
    color: '#92400E',
  },
  dialogueBodyError: {
    fontFamily: Fonts.poppins.regular,
    fontSize: 13.5,
    lineHeight: 20,
    color: '#B91C1C',
  },
  dialogueBodyActive: {
    fontFamily: Fonts.poppins.medium,
    fontSize: 13,
    color: '#059669',
  },
  dialogueBodySpeaking: {
    fontFamily: Fonts.poppins.medium,
    fontSize: 13,
    color: '#0284C7',
  },
  speakingWaveformRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  speakingWaveformContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    height: 24,
    paddingHorizontal: 8,
  },
  speakingWaveBar: {
    width: 3.5,
    height: 20,
    borderRadius: 2,
    backgroundColor: '#0284C7',
  },
  spokenCommandTag: {
    backgroundColor: '#F7F5EE',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    alignSelf: 'flex-start',
    marginTop: 10,
  },
  spokenCommandTagText: {
    fontFamily: Fonts.poppins.medium,
    fontSize: 11.5,
    color: '#6B7280',
  },
  resultSummaryContainer: {
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
    marginTop: 8,
  },
  resultSummaryText: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: 12.5,
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
  retrySpeechBtn: {
    height: 48,
    paddingHorizontal: 16,
    borderRadius: 24,
    backgroundColor: '#E0F2FE',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  retrySpeechBtnText: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: 13,
    color: '#0284C7',
  },
  finalActionsContainer: {
    width: '100%',
  },
  unrecognizedSuggestions: {
    width: '100%',
    marginBottom: 12,
  },
  confirmedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    width: '100%',
    marginTop: 6,
  },
  doneBtn: {
    flex: 1,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#010102',
    alignItems: 'center',
    justifyContent: 'center',
  },
  doneBtnText: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: 14,
    color: '#FFFFFF',
  },
  speakAgainBtn: {
    height: 48,
    paddingHorizontal: 18,
    borderRadius: 24,
    backgroundColor: '#F0EEE8',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  speakAgainBtnText: {
    fontFamily: Fonts.poppins.medium,
    fontSize: 13,
    color: '#1B1C19',
  },
  actionsHeader: {
    alignSelf: 'flex-start',
    fontFamily: Fonts.poppins.semiBold,
    fontSize: 12.5,
    color: '#77767B',
    marginBottom: 8,
    marginTop: 4,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    width: '100%',
  },
  actionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F0EEE8',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 22,
  },
  actionChipText: {
    fontFamily: Fonts.poppins.medium,
    fontSize: 12,
    color: '#1B1C19',
  },
});

export default VoiceAssistantSheet;
