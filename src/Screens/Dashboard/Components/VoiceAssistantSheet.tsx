import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
} from 'react';
import {
  View,
  StyleSheet,
  Modal,
  Animated,
  Dimensions,
  Pressable,
  AccessibilityInfo,
  Easing,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../../Theme/ThemeContext';
import { VoiceAssistantState } from '../../../Services/Voice/VoiceStateMachine';
import {
  DEFAULT_WAKE_WORD_PHRASE,
  DEFAULT_WAKE_WORD_PRESET,
} from '../../../Services/WakeWord/WakeWordPresets';
import { extractNameFromPhrase } from '../../../Services/WakeWord/WakeWordDetectionEngine';

import {
  AssistantHeader,
  AssistantOrb,
  ConversationSurface,
  VoiceInputControls,
  VoiceAcousticDoodleSvg,
  getAssistantTheme,
  normalizeAssistantState,
  AssistantVisualState,
  VoiceAssistantSheetProps,
} from './VoiceAssistant';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export type {
  VoiceAssistantState,
  AssistantVisualState,
  VoiceAssistantSheetProps,
};
export { normalizeAssistantState };

export const VoiceAssistantSheet: React.FC<VoiceAssistantSheetProps> = ({
  visible,
  onClose,
  onActionSelected,
  assistantState = 'listening',
  assistantName: propAssistantName,
  wakeWordPhrase = DEFAULT_WAKE_WORD_PHRASE,
  greetingText,
  activeVoiceName,
  liveTranscript,
  lastSpokenCommand,
  confirmedActionTitle,
  confirmedActionBody,
  resultSummary,
  spokenResponseText,
  pendingClarification,
  errorMessage,
  speechFailed: _speechFailed,
  onMicPress,
  onRetrySpeech: _onRetrySpeech,
  onInterruptSpeech,
}) => {
  const insets = useSafeAreaInsets();
  const { isDarkMode } = useTheme();
  const theme = useMemo(() => getAssistantTheme(isDarkMode), [isDarkMode]);
  const currentState = normalizeAssistantState(assistantState);

  // Dynamic assistant identity resolution
  const resolvedAssistantName = useMemo(() => {
    if (propAssistantName) return propAssistantName;
    if (wakeWordPhrase) {
      const extracted = extractNameFromPhrase(wakeWordPhrase);
      if (extracted) return extracted;
    }
    return DEFAULT_WAKE_WORD_PRESET?.name || 'Regius';
  }, [propAssistantName, wakeWordPhrase]);

  // Suggestions toggle state
  const [suggestionsVisible, setSuggestionsVisible] = useState(false);

  // Presentation Animations
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const backdropAnim = useRef(new Animated.Value(0)).current;
  const [_reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled?.()
      .then(enabled => setReduceMotion(Boolean(enabled)))
      .catch(() => {});
  }, []);

  // Slide-up animation on appearance
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
      setSuggestionsVisible(false);
    }
  }, [visible, slideAnim, backdropAnim]);

  // Smooth dismiss animation
  const handleClose = useCallback(() => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: SCREEN_HEIGHT,
        duration: 220,
        easing: Easing.in(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(backdropAnim, {
        toValue: 0,
        duration: 180,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onClose();
    });
  }, [onClose, slideAnim, backdropAnim]);

  const toggleSuggestions = useCallback(() => {
    setSuggestionsVisible(prev => !prev);
  }, []);

  if (!visible && currentState === 'idle') {
    return null;
  }

  const isSpeaking =
    currentState === 'speaking' ||
    currentState === 'responding' ||
    currentState === 'greeting';
  const isIdle = currentState === 'idle';
  const isUnrecognized = currentState === 'unrecognized';

  const shouldShowSuggestions =
    suggestionsVisible || ((isIdle || isUnrecognized) && !isSpeaking);

  const handleMicAction = () => {
    if (isSpeaking && onInterruptSpeech) {
      onInterruptSpeech();
    } else if (onMicPress) {
      onMicPress();
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={handleClose}
      statusBarTranslucent
    >
      <View style={styles.modalRoot}>
        {/* Dimming Backdrop */}
        <Animated.View
          style={[
            styles.backdrop,
            {
              opacity: backdropAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 0.7],
              }),
            },
          ]}
        >
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={handleClose}
            accessibilityRole="button"
            accessibilityLabel="Dismiss voice assistant"
          />
        </Animated.View>

        {/* Full-Screen Immersive Voice Assistant Surface */}
        <Animated.View
          style={[
            styles.sheetContainer,
            {
              backgroundColor: theme.background,
              paddingTop: Math.max(insets.top + 6, 20),
              paddingBottom: Math.max(insets.bottom + 8, 20),
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          {/* Extraordinary Celestial Acoustic Doodles & Ambient Neural Atmosphere */}
          <VoiceAcousticDoodleSvg
            isDarkMode={theme.isDarkMode}
            state={currentState}
          />

          {/* Header */}
          <AssistantHeader
            assistantName={resolvedAssistantName}
            state={currentState}
            theme={theme}
            onClose={handleClose}
            onToggleSuggestions={toggleSuggestions}
          />

          {/* Fixed Content Layout (Non-scrolling, tightly tuned spacing) */}
          <View style={styles.contentBody}>
            <View style={styles.orbWrapper}>
              <AssistantOrb
                state={currentState}
                onPress={handleMicAction}
                theme={theme}
              />
            </View>

            <View style={styles.conversationWrapper}>
              <ConversationSurface
                state={currentState}
                assistantName={resolvedAssistantName}
                liveTranscript={liveTranscript}
                lastSpokenCommand={lastSpokenCommand}
                confirmedActionTitle={confirmedActionTitle}
                confirmedActionBody={confirmedActionBody}
                resultSummary={resultSummary}
                spokenResponseText={spokenResponseText}
                greetingText={greetingText}
                activeVoiceName={activeVoiceName}
                pendingClarification={pendingClarification}
                errorMessage={errorMessage}
                theme={theme}
                showSuggestions={shouldShowSuggestions}
                onSelectSuggestion={onActionSelected}
              />
            </View>
          </View>

          {/* Controls */}
          <View style={styles.dockContainer}>
            <VoiceInputControls
              state={currentState}
              onMicPress={handleMicAction}
              onClose={handleClose}
              onToggleSuggestions={toggleSuggestions}
              theme={theme}
            />
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
  sheetContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'space-between',
  },
  contentBody: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  orbWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: -40,
  },
  conversationWrapper: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 5,
  },
  dockContainer: {
    width: '100%',
    paddingHorizontal: 16,
    paddingBottom: 6,
  },
});

export default VoiceAssistantSheet;
