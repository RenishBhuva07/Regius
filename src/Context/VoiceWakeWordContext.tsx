import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from 'react';
import { AppState, AppStateStatus, Vibration, Platform } from 'react-native';
import Toast from 'react-native-toast-message';
import { VoiceSettingsService } from '../Services/VoiceSettingsService';
import VoiceAssistantSheet from '../Screens/Dashboard/Components/VoiceAssistantSheet';
import { useTaskReminder } from './TaskReminderContext';

export interface VoiceWakeWordContextType {
  isWakeWordEnabled: boolean;
  setWakeWordEnabled: (enabled: boolean) => Promise<void>;
  isListening: boolean;
  isAssistantOpen: boolean;
  lastSpokenCommand: string | null;
  openAssistant: (initialCommand?: string) => void;
  closeAssistant: () => void;
  triggerWakeWord: (command?: string) => void;
}

const VoiceWakeWordContext = createContext<
  VoiceWakeWordContextType | undefined
>(undefined);

export const VoiceWakeWordProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isWakeWordEnabled, setIsWakeWordEnabledState] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [lastSpokenCommand, setLastSpokenCommand] = useState<string | null>(
    null,
  );

  const appState = useRef(AppState.currentState);
  const { addTask, addReminder } = useTaskReminder();

  // Load saved preference from VoiceSettingsService
  useEffect(() => {
    let mounted = true;
    VoiceSettingsService.getSettings().then(settings => {
      if (mounted) {
        setIsWakeWordEnabledState(settings.wakeWordEnabled ?? true);
        if (settings.wakeWordEnabled) {
          startListeningEngine();
        }
      }
    });

    return () => {
      mounted = false;
      stopListeningEngine();
    };
  }, []);

  // Monitor AppState (foreground vs background) for battery & privacy
  useEffect(() => {
    const subscription = AppState.addEventListener(
      'change',
      (nextAppState: AppStateStatus) => {
        if (
          appState.current?.match(/inactive|background/) &&
          nextAppState === 'active'
        ) {
          // App entered foreground: resume listening if enabled
          if (isWakeWordEnabled) {
            startListeningEngine();
          }
        } else if (nextAppState.match(/inactive|background/)) {
          // App entered background: pause listening immediately
          stopListeningEngine();
        }
        appState.current = nextAppState;
      },
    );

    return () => {
      subscription.remove();
    };
  }, [isWakeWordEnabled]);

  const startListeningEngine = useCallback(() => {
    setIsListening(true);
  }, []);

  const stopListeningEngine = useCallback(() => {
    setIsListening(false);
  }, []);

  const setWakeWordEnabled = useCallback(
    async (enabled: boolean) => {
      setIsWakeWordEnabledState(enabled);
      await VoiceSettingsService.saveSettings({ wakeWordEnabled: enabled });
      if (enabled) {
        startListeningEngine();
        Toast.show({
          type: 'success',
          text1: 'Wake Word Enabled',
          text2: 'Say "Hey Regius" at any time while the app is open.',
        });
      } else {
        stopListeningEngine();
        Toast.show({
          type: 'info',
          text1: 'Wake Word Disabled',
          text2: 'Hands-free "Hey Regius" listening is turned off.',
        });
      }
    },
    [startListeningEngine, stopListeningEngine],
  );

  // Triggered when "Hey Regius" hotword is detected locally
  const triggerWakeWord = useCallback(
    (command?: string) => {
      if (!isWakeWordEnabled) return;

      // 1. Dual Haptic Burst (Siri-like tactile confirmation)
      if (Platform.OS === 'ios') {
        Vibration.vibrate(50);
      } else {
        Vibration.vibrate([0, 50, 40, 70]);
      }

      // 2. Set command context if detected alongside wake word
      if (command) {
        setLastSpokenCommand(command);
      } else {
        setLastSpokenCommand(null);
      }

      // 3. Open Assistant Modal with Wake Word state
      setIsAssistantOpen(true);

      Toast.show({
        type: 'info',
        text1: '🎙️ "Hey Regius" Detected',
        text2: command
          ? `Processing: "${command}"`
          : 'Listening for your command...',
      });
    },
    [isWakeWordEnabled],
  );

  const openAssistant = useCallback((initialCommand?: string) => {
    if (initialCommand) setLastSpokenCommand(initialCommand);
    setIsAssistantOpen(true);
  }, []);

  const closeAssistant = useCallback(() => {
    setIsAssistantOpen(false);
    setLastSpokenCommand(null);
  }, []);

  // Handle voice actions dispatched from the assistant
  const handleAssistantAction = useCallback(
    (actionType: string) => {
      switch (actionType) {
        case 'log_meditation':
          if (Platform.OS === 'ios') {
            Vibration.vibrate(40);
          }
          Toast.show({
            type: 'success',
            text1: 'Habit Logged: Meditation 🔥',
            text2: 'Logged 20-minute mindfulness & breathwork for today.',
          });
          break;
        case 'schedule_sprint':
          if (Platform.OS === 'ios') {
            Vibration.vibrate(40);
          }
          addTask({
            title: 'Sprint Review & Strategy',
            category: 'works',
            priority: 'high',
            date: new Date().toISOString(),
          });
          Toast.show({
            type: 'success',
            text1: 'Task Scheduled at 3:00 PM',
            text2:
              'Added "Sprint Review & Strategy" to your high-priority flow.',
          });
          break;
        case 'play_brief':
          Toast.show({
            type: 'success',
            text1: 'Playing Daily Briefing',
            text2:
              'Aria is summarizing your top focus blocks and scheduled rituals.',
          });
          break;
        case 'extend_time':
          Toast.show({
            type: 'info',
            text1: 'Focus Block Extended',
            text2: '+15 minutes added to your active flow.',
          });
          break;
        case 'reshuffle':
          Toast.show({
            type: 'success',
            text1: 'Flow Resequenced',
            text2: 'Timeline re-balanced around your cognitive energy.',
          });
          break;
        default:
          break;
      }
    },
    [addTask],
  );

  return (
    <VoiceWakeWordContext.Provider
      value={{
        isWakeWordEnabled,
        setWakeWordEnabled,
        isListening,
        isAssistantOpen,
        lastSpokenCommand,
        openAssistant,
        closeAssistant,
        triggerWakeWord,
      }}
    >
      {children}

      {/* Global Voice Assistant Sheet Accessible Everywhere */}
      <VoiceAssistantSheet
        visible={isAssistantOpen}
        onClose={closeAssistant}
        onActionSelected={handleAssistantAction}
      />
    </VoiceWakeWordContext.Provider>
  );
};

export const useVoiceWakeWord = (): VoiceWakeWordContextType => {
  const context = useContext(VoiceWakeWordContext);
  if (!context) {
    throw new Error(
      'useVoiceWakeWord must be used within a VoiceWakeWordProvider',
    );
  }
  return context;
};

export default VoiceWakeWordContext;
