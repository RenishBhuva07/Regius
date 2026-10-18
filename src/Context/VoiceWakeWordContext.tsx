import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from 'react';
import {
  AppState,
  AppStateStatus,
  Vibration,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import Toast from 'react-native-toast-message';
import Voice, {
  SpeechResultsEvent,
  SpeechErrorEvent,
  SpeechRecognizedEvent,
} from '@react-native-voice/voice';
import { VoiceSettingsService } from '../Services/VoiceSettingsService';
import { RegiusSpeechService } from '../Services/RegiusSpeechService';
import { AudioPlayerService } from '../Services/AudioPlayerService';
import VoiceAssistantSheet, {
  VoiceAssistantState,
} from '../Screens/Dashboard/Components/VoiceAssistantSheet';
import { useTaskReminder } from './TaskReminderContext';
import { AuthContext } from './AuthContext';
import { VoiceStateMachine } from '../Services/Voice/VoiceStateMachine';
import {
  VoiceCommandService,
  PendingClarification,
  ExecutionResult,
} from '../Services/Voice/VoiceCommandService';
import { VoiceSessionConfig } from '../Services/Voice/VoiceSessionConfig';
import {
  WakeWordPreset,
  WakeWordValidationResult,
  WakeWordTestResult,
  SUPPORTED_WAKE_WORD_PRESETS,
  DEFAULT_WAKE_WORD_PRESET,
  WakeWordService,
  detectWakeWordInTranscript,
  isWakeWordOnly,
  validateWakePhrase,
  testWakeWordRecognition,
} from '../Services/WakeWord/WakeWordService';
import {
  setActiveWakePhrase,
  extractNameFromPhrase,
} from '../Services/WakeWord/WakeWordDetectionEngine';

export interface VoiceWakeWordContextType {
  isWakeWordEnabled: boolean;
  setWakeWordEnabled: (enabled: boolean) => Promise<void>;
  wakeWordPhrase: string;
  setWakeWordPhrase: (phrase: string) => Promise<boolean>;
  supportedWakeWords: WakeWordPreset[];
  validateWakeWord: (phrase: string) => WakeWordValidationResult;
  testWakeWordRecognition: (
    transcript: string,
    phrase?: string,
  ) => WakeWordTestResult;
  isListening: boolean;
  isAssistantOpen: boolean;
  assistantState: VoiceAssistantState;
  greetingText: string | null;
  activeVoiceName: string | null;
  lastSpokenCommand: string | null;
  liveTranscript: string | null;
  confirmedActionTitle: string | null;
  confirmedActionBody: string | null;
  resultSummary: string | null;
  spokenResponseText: string | null;
  errorMessage: string | null;
  speechFailed: boolean;
  openAssistant: (initialCommand?: string) => void;
  closeAssistant: () => void;
  triggerWakeWord: () => void;
  retryConfirmationSpeech: () => Promise<void>;
  resetToDefaults: () => Promise<void>;
  startWakeWordListening: () => Promise<void>;
}

const VoiceWakeWordContext = createContext<
  VoiceWakeWordContextType | undefined
>(undefined);

export const VoiceWakeWordProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // Underlying State Machine instance
  const stateMachineRef = useRef(new VoiceStateMachine('idle'));
  const [assistantState, setAssistantState] =
    useState<VoiceAssistantState>('idle');

  const [isWakeWordEnabled, setIsWakeWordEnabledState] = useState(true);
  const [wakeWordPhrase, setWakeWordPhraseState] = useState<string>(
    DEFAULT_WAKE_WORD_PRESET.phrase,
  );
  const [isListening, setIsListening] = useState(false);

  const [lastSpokenCommand, setLastSpokenCommand] = useState<string | null>(
    null,
  );
  const [liveTranscript, setLiveTranscript] = useState<string | null>(null);
  const [confirmedActionTitle, setConfirmedActionTitle] = useState<
    string | null
  >(null);
  const [confirmedActionBody, setConfirmedActionBody] = useState<string | null>(
    null,
  );
  const [resultSummary, setResultSummary] = useState<string | null>(null);
  const [spokenResponseText, setSpokenResponseText] = useState<string | null>(
    null,
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [speechFailed, setSpeechFailed] = useState<boolean>(false);
  const [currentGreeting, setCurrentGreeting] = useState<string | null>(null);
  const [activeVoiceName, setActiveVoiceName] = useState<string | null>(null);

  const pendingClarificationRef = useRef<PendingClarification | null>(null);
  const lastExecutedResultRef = useRef<ExecutionResult | null>(null);

  const appState = useRef(AppState.currentState);
  const isListeningRef = useRef(false);
  const assistantStateRef = useRef<VoiceAssistantState>('idle');
  assistantStateRef.current = assistantState;

  const currentInteractionIdRef = useRef<string>('');
  const isCommandProcessingLatch = useRef(false);

  const isWakeWordEnabledRef = useRef(isWakeWordEnabled);
  isWakeWordEnabledRef.current = isWakeWordEnabled;

  const wakeWordPhraseRef = useRef(wakeWordPhrase);
  wakeWordPhraseRef.current = wakeWordPhrase;

  const isStartingRef = useRef(false);
  const restartTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const silenceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const loopTransitionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const maxUtteranceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const inactivityPromptTimerRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const inactivityCloseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const hasPromptedInactivityRef = useRef<boolean>(false);
  const closeAssistantRef = useRef<() => void>(() => {});
  const hasLoggedWakeWordListeningRef = useRef<boolean>(false);

  // Full Utterance Capture & Session Accumulator
  const accumulatedTranscriptRef = useRef<string>('');
  const isFinalizingRef = useRef<boolean>(false);
  const finalizeUtteranceRef = useRef<(forcedText?: string) => Promise<void>>(
    () => Promise.resolve(),
  );

  const liveTranscriptRef = useRef<string | null>(null);
  liveTranscriptRef.current = liveTranscript;

  const startWakeWordEngineRef = useRef<
    (forceRestart?: boolean) => Promise<void>
  >(() => Promise.resolve());
  const startCommandListeningSessionRef = useRef<() => Promise<void>>(() =>
    Promise.resolve(),
  );
  const triggerWakeWordRef = useRef<() => Promise<void>>(() =>
    Promise.resolve(),
  );
  const processAndExecuteCommandRef = useRef<
    (cmd: string, expectedSessionId?: string) => Promise<void>
  >(() => Promise.resolve());
  const scheduleWakeWordRestartRef = useRef<(delay?: number) => void>(() => {});
  const stopVoiceEngineRef = useRef<() => Promise<void>>(() =>
    Promise.resolve(),
  );

  const taskReminderContext = useTaskReminder();
  const { isAuthenticated } = useContext(AuthContext);

  // Keep state machine synced with React state
  useEffect(() => {
    const unsubscribe = stateMachineRef.current.subscribe(nextState => {
      setAssistantState(nextState);
      assistantStateRef.current = nextState;
      if (nextState !== 'idle') {
        hasLoggedWakeWordListeningRef.current = false;
      }
    });
    return unsubscribe;
  }, []);

  const transitionState = useCallback(
    (nextState: VoiceAssistantState, sessionId?: string): boolean => {
      return stateMachineRef.current.transitionTo(nextState, sessionId);
    },
    [],
  );

  // Request Android runtime microphone permission if needed
  const requestMicPermission = useCallback(async (): Promise<boolean> => {
    if (Platform.OS !== 'android') return true;
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        {
          title: 'Microphone Permission',
          message: `Regius needs microphone access for hands-free "${wakeWordPhraseRef.current}" wake word detection and conversational commands.`,
          buttonPositive: 'Allow',
          buttonNegative: 'Deny',
        },
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn('[VoiceWakeWord] Error requesting mic permission:', err);
      return false;
    }
  }, []);

  const clearInactivityTimers = useCallback(() => {
    if (inactivityPromptTimerRef.current) {
      clearTimeout(inactivityPromptTimerRef.current);
      inactivityPromptTimerRef.current = null;
    }
    if (inactivityCloseTimerRef.current) {
      clearTimeout(inactivityCloseTimerRef.current);
      inactivityCloseTimerRef.current = null;
    }
  }, []);

  const stopVoiceEngine = useCallback(async () => {
    clearInactivityTimers();
    if (restartTimerRef.current) {
      clearTimeout(restartTimerRef.current);
      restartTimerRef.current = null;
    }
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
    if (maxUtteranceTimerRef.current) {
      clearTimeout(maxUtteranceTimerRef.current);
      maxUtteranceTimerRef.current = null;
    }
    isListeningRef.current = false;
    setIsListening(false);
    try {
      await Voice.stop();
    } catch {
      // Ignored if already stopped
    }
  }, [clearInactivityTimers]);
  stopVoiceEngineRef.current = stopVoiceEngine;

  const armInactivityTimer = useCallback(
    (sessionId: string) => {
      // If a prompt or close timer is already running for this active session, preserve countdown
      if (inactivityPromptTimerRef.current || inactivityCloseTimerRef.current) {
        return;
      }
      if (!sessionId || assistantStateRef.current !== 'listening') {
        return;
      }

      const config = VoiceSessionConfig.getConfig();
      hasPromptedInactivityRef.current = false;

      inactivityPromptTimerRef.current = setTimeout(async () => {
        inactivityPromptTimerRef.current = null;
        if (
          assistantStateRef.current !== 'listening' ||
          currentInteractionIdRef.current !== sessionId
        ) {
          return;
        }

        console.log(
          '[VoiceWakeWord] ⏳ 10s of listening silence. Prompting: "Are you still there?"',
        );
        hasPromptedInactivityRef.current = true;

        await stopVoiceEngine();

        const promptText =
          config.inactivityPromptText || 'Are you still there?';
        setSpokenResponseText(promptText);
        transitionState('speaking', sessionId);

        await RegiusSpeechService.speakResponse(promptText, {
          onStart: () => {
            if (currentInteractionIdRef.current === sessionId) {
              transitionState('speaking', sessionId);
            }
          },
          onEnded: () => {
            if (currentInteractionIdRef.current === sessionId) {
              startCommandListeningSessionRef.current();

              // Start 7-second grace closure timer
              inactivityCloseTimerRef.current = setTimeout(() => {
                inactivityCloseTimerRef.current = null;
                if (
                  assistantStateRef.current === 'listening' &&
                  currentInteractionIdRef.current === sessionId
                ) {
                  console.log(
                    '[VoiceWakeWord] ⏳ Grace period silence reached with no user input. Closing session gracefully.',
                  );
                  closeAssistantRef.current();
                }
              }, config.inactivityGracePeriodMs);
            }
          },
          onError: () => {
            if (currentInteractionIdRef.current === sessionId) {
              startCommandListeningSessionRef.current();
              inactivityCloseTimerRef.current = setTimeout(() => {
                inactivityCloseTimerRef.current = null;
                if (
                  assistantStateRef.current === 'listening' &&
                  currentInteractionIdRef.current === sessionId
                ) {
                  closeAssistantRef.current();
                }
              }, config.inactivityGracePeriodMs);
            }
          },
        });
      }, config.inactivityPromptDelayMs);
    },
    [stopVoiceEngine, transitionState],
  );

  const scheduleWakeWordRestart = useCallback((delayMs: number = 400) => {
    if (restartTimerRef.current) {
      clearTimeout(restartTimerRef.current);
    }
    if (
      !isWakeWordEnabledRef.current ||
      appState.current !== 'active' ||
      assistantStateRef.current !== 'idle'
    ) {
      return;
    }
    restartTimerRef.current = setTimeout(() => {
      startWakeWordEngineRef.current();
    }, delayMs);
  }, []);
  scheduleWakeWordRestartRef.current = scheduleWakeWordRestart;

  // Starts Voice engine in wake-word detection mode (idle state)
  const startWakeWordEngine = useCallback(
    async (forceRestart: boolean = false) => {
      if (restartTimerRef.current) {
        clearTimeout(restartTimerRef.current);
        restartTimerRef.current = null;
      }

      if (!forceRestart && isStartingRef.current) {
        return;
      }

      if (
        !isWakeWordEnabledRef.current ||
        appState.current !== 'active' ||
        assistantStateRef.current !== 'idle'
      ) {
        return;
      }

      isStartingRef.current = true;
      try {
        const hasPermission = await requestMicPermission();
        if (!hasPermission) {
          isStartingRef.current = false;
          return;
        }

        try {
          await Voice.stop();
        } catch {}

        // Short delay for native audio session to yield cleanly
        await new Promise<void>(resolve => setTimeout(() => resolve(), 150));

        await Voice.start('en-US');
        isListeningRef.current = true;
        setIsListening(true);
        if (!hasLoggedWakeWordListeningRef.current || forceRestart) {
          console.log(
            `[VoiceWakeWord] 🎙️ Listening for "${wakeWordPhraseRef.current}"...`,
          );
          hasLoggedWakeWordListeningRef.current = true;
        }
      } catch (err) {
        console.warn(
          '[VoiceWakeWord] Error starting Wake Word Voice engine:',
          err,
        );
        isListeningRef.current = false;
        setIsListening(false);
        scheduleWakeWordRestartRef.current(1000);
      } finally {
        isStartingRef.current = false;
      }
    },
    [requestMicPermission],
  );
  startWakeWordEngineRef.current = startWakeWordEngine;

  // Utterance Finalizer: executes only when user finished speaking
  const finalizeUtterance = useCallback(
    async (forcedText?: string) => {
      if (isFinalizingRef.current) return;
      if (assistantStateRef.current !== 'listening') return;

      const candidate = (
        forcedText ||
        accumulatedTranscriptRef.current ||
        liveTranscriptRef.current ||
        ''
      ).trim();

      if (!candidate || isWakeWordOnly(candidate, wakeWordPhraseRef.current)) {
        return;
      }

      isFinalizingRef.current = true;
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
        silenceTimerRef.current = null;
      }
      if (maxUtteranceTimerRef.current) {
        clearTimeout(maxUtteranceTimerRef.current);
        maxUtteranceTimerRef.current = null;
      }

      console.log(
        '[VoiceWakeWord] 🎯 Finalizing complete utterance:',
        candidate,
      );
      await stopVoiceEngine();

      await processAndExecuteCommandRef.current(
        candidate,
        currentInteractionIdRef.current,
      );
    },
    [stopVoiceEngine],
  );
  finalizeUtteranceRef.current = finalizeUtterance;

  // Starts Voice engine in active command listening mode (inside conversation loop)
  const startCommandListeningSession = useCallback(async () => {
    if (restartTimerRef.current) {
      clearTimeout(restartTimerRef.current);
      restartTimerRef.current = null;
    }
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
    if (maxUtteranceTimerRef.current) {
      clearTimeout(maxUtteranceTimerRef.current);
      maxUtteranceTimerRef.current = null;
    }

    accumulatedTranscriptRef.current = '';
    isFinalizingRef.current = false;
    setLiveTranscript(null);

    try {
      await Voice.stop();
    } catch {}

    // Yield for audio playback hardware to switch cleanly to recording
    await new Promise<void>(resolve => setTimeout(resolve, 160));

    try {
      await Voice.start('en-US');
      isListeningRef.current = true;
      setIsListening(true);
      transitionState('listening', currentInteractionIdRef.current);
      console.log(
        '[VoiceWakeWord] 🎙️ Microphone active: Listening for command...',
      );

      // Arm the Siri-like inactivity timer (10s prompt + 7s closure)
      armInactivityTimer(currentInteractionIdRef.current);

      // Max utterance timeout: guard against continuous background noise (20s)
      maxUtteranceTimerRef.current = setTimeout(() => {
        if (
          assistantStateRef.current === 'listening' &&
          accumulatedTranscriptRef.current &&
          !isWakeWordOnly(
            accumulatedTranscriptRef.current,
            wakeWordPhraseRef.current,
          )
        ) {
          console.log(
            '[VoiceWakeWord] Max utterance duration reached, finalizing...',
          );
          finalizeUtteranceRef.current();
        }
      }, 20000);
    } catch (err) {
      console.warn(
        '[VoiceWakeWord] Error starting command listening session:',
        err,
      );
      isListeningRef.current = false;
      setIsListening(false);
      transitionState('error', currentInteractionIdRef.current);
      setErrorMessage('Microphone failed to activate. Tap mic to retry.');
    }
  }, [transitionState, armInactivityTimer]);
  startCommandListeningSessionRef.current = startCommandListeningSession;

  // Process & execute spoken command cleanly through state machine
  const processAndExecuteCommand = useCallback(
    async (commandText: string, expectedSessionId?: string) => {
      const clean = commandText.trim();
      if (!clean) return;

      const sessionId = currentInteractionIdRef.current;
      if (expectedSessionId && expectedSessionId !== sessionId) {
        console.log('[VoiceWakeWord] Stale command session ignored');
        return;
      }

      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
        silenceTimerRef.current = null;
      }
      if (maxUtteranceTimerRef.current) {
        clearTimeout(maxUtteranceTimerRef.current);
        maxUtteranceTimerRef.current = null;
      }

      // Step 1: Immediately pause microphone capture so Regius does not hear itself
      await stopVoiceEngine();

      // Step 2: Transition to processing state
      transitionState('processing', sessionId);
      setLastSpokenCommand(clean);
      setLiveTranscript(null);
      setErrorMessage(null);
      setSpokenResponseText(null);

      // Step 3: Interpret intent using VoiceCommandService
      const interpreted = VoiceCommandService.interpret(
        clean,
        pendingClarificationRef.current,
      );

      // A: Wake word only / repeated echo
      if (interpreted.intent === 'WAKE_WORD_ONLY') {
        if (sessionId !== currentInteractionIdRef.current) return;
        startCommandListeningSessionRef.current();
        return;
      }

      // B: Cancel pending clarification
      if (interpreted.intent === 'CANCEL') {
        pendingClarificationRef.current = null;
        setConfirmedActionTitle(
          interpreted.displayTitle || 'Request Cancelled',
        );
        setConfirmedActionBody(
          interpreted.displayBody || 'Previous request cancelled.',
        );
        const reply = interpreted.spokenConfirmation || 'Alright, cancelled.';

        transitionState('generatingResponse', sessionId);
        await RegiusSpeechService.speakResponse(reply, {
          onStart: () => {
            if (sessionId === currentInteractionIdRef.current) {
              transitionState('speaking', sessionId);
              setSpokenResponseText(reply);
            }
          },
          onEnded: () => {
            if (sessionId === currentInteractionIdRef.current) {
              startCommandListeningSessionRef.current();
            }
          },
          onError: () => {
            if (sessionId === currentInteractionIdRef.current) {
              startCommandListeningSessionRef.current();
            }
          },
        });
        return;
      }

      // C: Command needs follow-up question / clarification (Section 8)
      if (interpreted.needsClarification) {
        pendingClarificationRef.current = interpreted.needsClarification;
        setConfirmedActionTitle(
          interpreted.displayTitle || 'Information Needed',
        );
        setConfirmedActionBody(
          interpreted.displayBody || 'Please provide details.',
        );

        const question =
          interpreted.spokenConfirmation ||
          interpreted.needsClarification.question;

        const active = await RegiusSpeechService.getActiveVoice();
        setActiveVoiceName(active.voice.name);

        transitionState('generatingResponse', sessionId);

        try {
          await RegiusSpeechService.speakResponse(question, {
            onStart: () => {
              if (sessionId === currentInteractionIdRef.current) {
                transitionState('speaking', sessionId);
                setSpokenResponseText(question);
              }
            },
            onEnded: () => {
              if (sessionId === currentInteractionIdRef.current) {
                // Return to listening for the user's answer!
                startCommandListeningSessionRef.current();
              }
            },
            onError: () => {
              if (sessionId === currentInteractionIdRef.current) {
                startCommandListeningSessionRef.current();
              }
            },
          });
        } catch {
          if (sessionId === currentInteractionIdRef.current) {
            startCommandListeningSessionRef.current();
          }
        }
        return;
      }

      // D: Unrecognized Command (Section 8)
      if (interpreted.intent === 'UNRECOGNIZED') {
        pendingClarificationRef.current = null;
        setConfirmedActionTitle(
          interpreted.displayTitle || 'Command Not Recognized',
        );
        setConfirmedActionBody(
          interpreted.displayBody ||
            'Try saying "Schedule sprint review", "Log meditation", or "Add task..."',
        );

        const clarification =
          interpreted.spokenConfirmation ||
          `I heard ${clean}, but I didn't recognize that command. Try saying Add a task, Set a reminder, or Log meditation.`;

        const active = await RegiusSpeechService.getActiveVoice();
        setActiveVoiceName(active.voice.name);

        if (active.autoSpeak) {
          transitionState('generatingResponse', sessionId);

          try {
            await RegiusSpeechService.speakResponse(clarification, {
              onStart: () => {
                if (sessionId === currentInteractionIdRef.current) {
                  transitionState('speaking', sessionId);
                  setSpokenResponseText(clarification);
                }
              },
              onEnded: () => {
                if (sessionId === currentInteractionIdRef.current) {
                  transitionState('unrecognized', sessionId);
                  // Automatic conversation loop: return to listening after 1.4s
                  if (loopTransitionTimerRef.current) {
                    clearTimeout(loopTransitionTimerRef.current);
                  }
                  loopTransitionTimerRef.current = setTimeout(() => {
                    if (
                      sessionId === currentInteractionIdRef.current &&
                      assistantStateRef.current === 'unrecognized'
                    ) {
                      startCommandListeningSessionRef.current();
                    }
                  }, 1400);
                }
              },
              onError: () => {
                if (sessionId === currentInteractionIdRef.current) {
                  transitionState('unrecognized', sessionId);
                  startCommandListeningSessionRef.current();
                }
              },
            });
          } catch {
            if (sessionId === currentInteractionIdRef.current) {
              transitionState('unrecognized', sessionId);
              startCommandListeningSessionRef.current();
            }
          }
        } else {
          transitionState('unrecognized', sessionId);
        }
        return;
      }

      // D1: Explicit Goodbye / Session Dismissal (Section 7 & 10)
      if (interpreted.intent === 'GOODBYE' || interpreted.shouldEndSession) {
        pendingClarificationRef.current = null;
        setConfirmedActionTitle(interpreted.displayTitle || 'Session Ended');
        setConfirmedActionBody(
          interpreted.displayBody || 'Say "Hey Regius" whenever you need me.',
        );
        const farewell =
          interpreted.spokenConfirmation || 'Goodbye! Have a great day.';

        const active = await RegiusSpeechService.getActiveVoice();
        setActiveVoiceName(active.voice.name);

        transitionState('generatingResponse', sessionId);
        await RegiusSpeechService.speakResponse(farewell, {
          onStart: () => {
            if (sessionId === currentInteractionIdRef.current) {
              transitionState('speaking', sessionId);
              setSpokenResponseText(farewell);
            }
          },
          onEnded: () => {
            if (sessionId === currentInteractionIdRef.current) {
              closeAssistantRef.current();
            }
          },
          onError: () => {
            if (sessionId === currentInteractionIdRef.current) {
              closeAssistantRef.current();
            }
          },
        });
        return;
      }

      // D2: Courtesy / Thanks (Section 7)
      if (interpreted.intent === 'THANKS') {
        pendingClarificationRef.current = null;
        setConfirmedActionTitle(
          interpreted.displayTitle || 'You’re Welcome ✨',
        );
        setConfirmedActionBody(
          interpreted.displayBody ||
            'Glad I could help. What’s next on your schedule?',
        );
        const reply =
          interpreted.spokenConfirmation ||
          "You're welcome! Anything else I can help with?";

        const active = await RegiusSpeechService.getActiveVoice();
        setActiveVoiceName(active.voice.name);

        transitionState('generatingResponse', sessionId);
        await RegiusSpeechService.speakResponse(reply, {
          onStart: () => {
            if (sessionId === currentInteractionIdRef.current) {
              transitionState('speaking', sessionId);
              setSpokenResponseText(reply);
            }
          },
          onEnded: () => {
            if (sessionId === currentInteractionIdRef.current) {
              startCommandListeningSessionRef.current();
            }
          },
          onError: () => {
            if (sessionId === currentInteractionIdRef.current) {
              startCommandListeningSessionRef.current();
            }
          },
        });
        return;
      }

      // E: Valid Command: Execute Operation (Section 6)
      pendingClarificationRef.current = null;
      setSpeechFailed(false);
      setConfirmedActionTitle(
        interpreted.displayTitle || 'Working on your request...',
      );
      transitionState('executing', sessionId);

      // Brief yield so the UI renders the executing animation
      await new Promise<void>(resolve => setTimeout(resolve, 120));
      if (sessionId !== currentInteractionIdRef.current) return;

      const result = VoiceCommandService.execute(interpreted, {
        tasks: taskReminderContext.tasks,
        addTask: taskReminderContext.addTask,
        toggleTask: taskReminderContext.toggleTask,
        reminders: taskReminderContext.reminders,
        addReminder: taskReminderContext.addReminder,
        toggleReminder: taskReminderContext.toggleReminder,
        habits: taskReminderContext.habits,
        addHabit: taskReminderContext.addHabit,
        toggleHabit: taskReminderContext.toggleHabit,
      });

      lastExecutedResultRef.current = result;

      if (!result.success) {
        if (sessionId !== currentInteractionIdRef.current) return;
        transitionState('error', sessionId);
        setConfirmedActionTitle(result.displayTitle || 'Command Failed');
        setConfirmedActionBody(
          result.displayBody || 'Could not complete operation.',
        );
        setResultSummary(result.resultSummary || result.displayTitle);
        setErrorMessage(result.error || result.displayBody);
        return;
      }

      // Step 4: Spoken Confirmation and Continuous Conversation Loop (Section 5 & 7)
      setConfirmedActionTitle(result.displayTitle);
      setConfirmedActionBody(result.displayBody);
      setResultSummary(result.resultSummary || result.displayTitle);
      setSpeechFailed(false);

      const responseToSpeak = result.spokenResponse;
      const active = await RegiusSpeechService.getActiveVoice();
      setActiveVoiceName(active.voice.name);

      if (active.autoSpeak) {
        transitionState('generatingResponse', sessionId);

        try {
          await RegiusSpeechService.speakResponse(responseToSpeak, {
            onStart: () => {
              if (sessionId === currentInteractionIdRef.current) {
                transitionState('speaking', sessionId);
                setSpokenResponseText(responseToSpeak);
              }
            },
            onEnded: () => {
              if (sessionId === currentInteractionIdRef.current) {
                // Genuine playback finished -> Transition to success
                transitionState('success', sessionId);
                setSpeechFailed(false);
                if (Platform.OS === 'ios') {
                  Vibration.vibrate(40);
                } else {
                  Vibration.vibrate([0, 40, 30, 50]);
                }

                if (result.shouldEndSession) {
                  closeAssistantRef.current();
                  return;
                }

                // Core Continuous Conversation Loop:
                // Keep success state visible for 2500ms so user can comfortably read result,
                // then automatically return to listening!
                if (loopTransitionTimerRef.current) {
                  clearTimeout(loopTransitionTimerRef.current);
                }
                loopTransitionTimerRef.current = setTimeout(() => {
                  if (
                    sessionId === currentInteractionIdRef.current &&
                    assistantStateRef.current === 'success'
                  ) {
                    setLastSpokenCommand(null);
                    setLiveTranscript(null);
                    startCommandListeningSessionRef.current();
                  }
                }, 2500);
              }
            },
            onError: err => {
              if (sessionId === currentInteractionIdRef.current) {
                console.warn('[VoiceWakeWord] Confirmation speech error:', err);
                // Operation succeeded, but voice confirmation failed -> show truthful result
                transitionState('success', sessionId);
                setSpeechFailed(true);
                setErrorMessage(
                  'Operation completed, but voice confirmation failed.',
                );
              }
            },
          });
        } catch (err) {
          if (sessionId === currentInteractionIdRef.current) {
            console.warn('[VoiceWakeWord] Speech synthesis exception:', err);
            transitionState('success', sessionId);
            setSpeechFailed(true);
            setErrorMessage(
              'Operation completed, but voice confirmation failed.',
            );
          }
        }
      } else {
        // If autoSpeak is disabled, show success and loop to listening
        transitionState('success', sessionId);
        if (result.shouldEndSession) {
          closeAssistantRef.current();
          return;
        }
        if (loopTransitionTimerRef.current) {
          clearTimeout(loopTransitionTimerRef.current);
        }
        loopTransitionTimerRef.current = setTimeout(() => {
          if (
            sessionId === currentInteractionIdRef.current &&
            assistantStateRef.current === 'success'
          ) {
            startCommandListeningSessionRef.current();
          }
        }, 2500);
      }
    },
    [stopVoiceEngine, transitionState, taskReminderContext],
  );

  // Triggered when "Hey Regius" is detected (Section 4)
  const lastTriggerTimeRef = useRef(0);
  const triggerWakeWord = useCallback(async () => {
    const now = Date.now();
    if (!isWakeWordEnabledRef.current) return;
    if (now - lastTriggerTimeRef.current < 2500) return; // 2.5s cooldown guard
    lastTriggerTimeRef.current = now;

    // Reset and start new session in State Machine
    const sessionId = stateMachineRef.current.startNewSession();
    currentInteractionIdRef.current = sessionId;
    pendingClarificationRef.current = null;

    try {
      // 1. Dual Haptic Burst
      if (Platform.OS === 'ios') {
        Vibration.vibrate(50);
      } else {
        Vibration.vibrate([0, 50, 40, 70]);
      }

      // 2. Transition to wakeWordDetected & stop background recognition
      transitionState('wakeWordDetected', sessionId);
      await stopVoiceEngine();

      // 3. Transition to greeting
      transitionState('greeting', sessionId);
      const assistantName = extractNameFromPhrase(wakeWordPhraseRef.current);
      const greeting = await RegiusSpeechService.getFastWakeGreeting(
        assistantName,
      );
      setCurrentGreeting(greeting);
      setSpokenResponseText(greeting);

      const active = await RegiusSpeechService.getActiveVoice();
      setActiveVoiceName(active.voice.name);

      setLastSpokenCommand(null);
      setLiveTranscript(null);
      setConfirmedActionTitle(null);
      setConfirmedActionBody(null);
      setErrorMessage(null);

      // 4. Speak greeting with real lifecycle callbacks (Section 4, Critical)
      await RegiusSpeechService.speakGreeting(greeting, {
        onStart: () => {
          if (sessionId === currentInteractionIdRef.current) {
            transitionState('speaking', sessionId);
          }
        },
        onEnded: () => {
          if (sessionId === currentInteractionIdRef.current) {
            console.log(
              '[VoiceWakeWord] Greeting playback completed. Starting listening...',
            );
            // Step 9 & 10 from prompt: Stop playback & automatically start listening
            AudioPlayerService.stop().catch(() => {});
            startCommandListeningSessionRef.current();
          }
        },
        onError: () => {
          if (sessionId === currentInteractionIdRef.current) {
            AudioPlayerService.stop().catch(() => {});
            startCommandListeningSessionRef.current();
          }
        },
      });
    } catch (err) {
      console.warn(
        '[VoiceWakeWord] Error during wake word greeting flow:',
        err,
      );
      if (sessionId === currentInteractionIdRef.current) {
        startCommandListeningSessionRef.current();
      }
    }
  }, [stopVoiceEngine, transitionState]);

  triggerWakeWordRef.current = triggerWakeWord;
  processAndExecuteCommandRef.current = processAndExecuteCommand;

  // Single centralized Voice event listeners for the entire application session
  useEffect(() => {
    Voice.onSpeechStart = () => {
      clearInactivityTimers();
      isListeningRef.current = true;
      setIsListening(true);
      if (
        assistantStateRef.current !== 'idle' &&
        assistantStateRef.current !== 'speaking' &&
        assistantStateRef.current !== 'generatingResponse' &&
        assistantStateRef.current !== 'executing' &&
        assistantStateRef.current !== 'processing'
      ) {
        console.log('[VoiceWakeWord] 🎤 Mic active: listening for command...');
        transitionState('listening', currentInteractionIdRef.current);
      }
    };

    Voice.onSpeechPartialResults = (e: SpeechResultsEvent) => {
      // While Regius is actively speaking, executing, processing or generating, strictly ignore microphone input!
      if (
        assistantStateRef.current === 'speaking' ||
        assistantStateRef.current === 'executing' ||
        assistantStateRef.current === 'generatingResponse' ||
        assistantStateRef.current === 'processing' ||
        assistantStateRef.current === 'greeting'
      ) {
        return;
      }

      const candidates = e.value || [];
      if (candidates.length === 0) return;

      // When Assistant is in listening mode: stream live transcript and handle silence debounce
      if (assistantStateRef.current === 'listening') {
        clearInactivityTimers();
        if (isFinalizingRef.current) return;
        const spokenSoFar = (candidates[0] || '').trim();
        if (!spokenSoFar) return;

        accumulatedTranscriptRef.current = spokenSoFar;
        setLiveTranscript(spokenSoFar);

        // Reset silence timeout: 1400ms after user stops speaking, finalize command
        if (silenceTimerRef.current) {
          clearTimeout(silenceTimerRef.current);
        }
        silenceTimerRef.current = setTimeout(() => {
          if (
            assistantStateRef.current === 'listening' &&
            accumulatedTranscriptRef.current &&
            !isWakeWordOnly(
              accumulatedTranscriptRef.current,
              wakeWordPhraseRef.current,
            )
          ) {
            finalizeUtteranceRef.current();
          }
        }, 1400);
        return;
      }

      // When Assistant is idle: check for wake word
      if (assistantStateRef.current === 'idle') {
        const rawHypothesis = (candidates[0] || '').trim();
        if (rawHypothesis) {
          console.log(
            `[VoiceWakeWord] 👂 Heard: "${rawHypothesis}" (Target: "${wakeWordPhraseRef.current}")`,
          );
        }

        for (const text of candidates) {
          const result = detectWakeWordInTranscript(
            text,
            wakeWordPhraseRef.current,
          );
          if (result.detected) {
            console.log(
              `[VoiceWakeWord] 🎯 "${wakeWordPhraseRef.current}" matched in partials:`,
              result.matchedPhrase,
            );
            triggerWakeWordRef.current();
            break;
          }
        }
      }
    };

    Voice.onSpeechResults = (e: SpeechResultsEvent) => {
      if (
        assistantStateRef.current === 'speaking' ||
        assistantStateRef.current === 'executing' ||
        assistantStateRef.current === 'generatingResponse' ||
        assistantStateRef.current === 'processing' ||
        assistantStateRef.current === 'greeting'
      ) {
        return;
      }

      const candidates = e.value || [];
      if (candidates.length === 0) return;

      if (assistantStateRef.current === 'listening') {
        if (isFinalizingRef.current) return;
        const candidate = (candidates[0] || '').trim();
        if (!candidate) return;

        accumulatedTranscriptRef.current = candidate;
        setLiveTranscript(candidate);

        // On Android, onSpeechResults fires only at the end of recognition
        if (Platform.OS === 'android') {
          finalizeUtteranceRef.current(candidate);
          return;
        }

        // On iOS, onSpeechResults fires on every intermediate hypothesis.
        // Update accumulated text and reset silence debounce timer (1400ms).
        if (silenceTimerRef.current) {
          clearTimeout(silenceTimerRef.current);
        }
        silenceTimerRef.current = setTimeout(() => {
          if (
            assistantStateRef.current === 'listening' &&
            accumulatedTranscriptRef.current &&
            !isWakeWordOnly(
              accumulatedTranscriptRef.current,
              wakeWordPhraseRef.current,
            )
          ) {
            finalizeUtteranceRef.current();
          }
        }, 1400);
        return;
      }

      if (assistantStateRef.current === 'idle') {
        const rawHypothesis = (candidates[0] || '').trim();
        if (rawHypothesis) {
          console.log(
            `[VoiceWakeWord] 🗣️ Final hypothesis: "${rawHypothesis}"`,
          );
        }

        for (const text of candidates) {
          const result = detectWakeWordInTranscript(
            text,
            wakeWordPhraseRef.current,
          );
          if (result.detected) {
            console.log(
              `[VoiceWakeWord] 🎯 "${wakeWordPhraseRef.current}" matched in results:`,
              result.matchedPhrase,
            );
            triggerWakeWordRef.current();
            break;
          }
        }
      }
    };

    Voice.onSpeechRecognized = (e: SpeechRecognizedEvent) => {
      if (
        assistantStateRef.current === 'speaking' ||
        assistantStateRef.current === 'executing' ||
        assistantStateRef.current === 'generatingResponse' ||
        assistantStateRef.current === 'processing' ||
        assistantStateRef.current === 'greeting'
      ) {
        return;
      }

      if (assistantStateRef.current === 'listening') {
        if (e.isFinal && !isFinalizingRef.current) {
          console.log(
            '[VoiceWakeWord] 🏁 SFSpeechRecognizer reported isFinal: true',
          );
          finalizeUtteranceRef.current();
        }
      }
    };

    Voice.onSpeechEnd = () => {
      if (assistantStateRef.current !== 'idle') {
        console.log(
          '[VoiceWakeWord] 🔇 Speech stream ended, refreshing listener cycle...',
        );
      }
      isListeningRef.current = false;
      setIsListening(false);

      if (
        assistantStateRef.current === 'speaking' ||
        assistantStateRef.current === 'executing' ||
        assistantStateRef.current === 'generatingResponse' ||
        assistantStateRef.current === 'processing' ||
        assistantStateRef.current === 'greeting'
      ) {
        return;
      }

      if (assistantStateRef.current === 'listening') {
        const text = (
          accumulatedTranscriptRef.current ||
          liveTranscriptRef.current ||
          ''
        ).trim();
        if (text && !isWakeWordOnly(text, wakeWordPhraseRef.current)) {
          finalizeUtteranceRef.current(text);
        } else {
          // If speech ended with no words, keep microphone warm in continuous loop
          setTimeout(() => {
            if (assistantStateRef.current === 'listening') {
              startCommandListeningSessionRef.current();
            }
          }, 300);
        }
      } else if (assistantStateRef.current === 'idle') {
        scheduleWakeWordRestartRef.current(350);
      }
    };

    Voice.onSpeechError = (e: SpeechErrorEvent) => {
      isListeningRef.current = false;
      setIsListening(false);

      if (
        assistantStateRef.current === 'speaking' ||
        assistantStateRef.current === 'executing' ||
        assistantStateRef.current === 'generatingResponse' ||
        assistantStateRef.current === 'processing' ||
        assistantStateRef.current === 'greeting'
      ) {
        return;
      }

      const code = String(e.error?.code || '');
      const message = String(e.error?.message || '');
      const lowerMsg = message.toLowerCase();
      const lowerCode = code.toLowerCase();

      // Normal silence / timeout codes:
      // iOS: 1110 (kAFAssistantErrorDomain error 1110: "No speech detected" / "recognition_fail: 1110/No speech detected")
      // iOS: 203 (kLSRErrorDomain: "Retry: Spoken request was not understood or no speech")
      // iOS: 209 (kLSRErrorDomain: "Recognition request was canceled")
      // iOS: 1101, 1107
      // Android: 7 (ERROR_NO_MATCH), 6 (ERROR_SPEECH_TIMEOUT)
      const isSilenceTimeout =
        code === '7' ||
        code === '6' ||
        code === '203' ||
        code === '209' ||
        code === '1110' ||
        code === '1101' ||
        code === '1107' ||
        lowerCode.includes('1110') ||
        lowerCode.includes('cancel') ||
        lowerMsg.includes('no speech') ||
        lowerMsg.includes('no match') ||
        lowerMsg.includes('silence') ||
        lowerMsg.includes('1110') ||
        lowerMsg.includes('203') ||
        lowerMsg.includes('209') ||
        lowerMsg.includes('canceled') ||
        lowerMsg.includes('cancelled') ||
        (lowerCode === 'recognition_fail' &&
          (lowerMsg.includes('no speech') ||
            lowerMsg.includes('1110') ||
            lowerMsg.includes('cancel') ||
            lowerMsg.includes('silence')));

      if (!isSilenceTimeout) {
        console.warn(
          `[VoiceWakeWord] ⚠️ Voice recognition event (${code}): ${
            message || 'Unknown'
          }`,
        );
      }

      if (assistantStateRef.current === 'listening') {
        const text = (
          accumulatedTranscriptRef.current ||
          liveTranscriptRef.current ||
          ''
        ).trim();
        if (text && !isWakeWordOnly(text, wakeWordPhraseRef.current)) {
          finalizeUtteranceRef.current(text);
        } else {
          // In listening mode, silence timeout is expected between commands -> keep listening!
          setTimeout(() => {
            if (assistantStateRef.current === 'listening') {
              startCommandListeningSessionRef.current();
            }
          }, 300);
        }
      } else if (assistantStateRef.current === 'idle') {
        scheduleWakeWordRestartRef.current(isSilenceTimeout ? 300 : 1200);
      }
    };

    return () => {
      try {
        Voice.destroy().then(Voice.removeAllListeners);
      } catch {
        // Ignored
      }
    };
  }, [transitionState]);

  // Load saved preference from VoiceSettingsService ONCE on mount
  useEffect(() => {
    let mounted = true;
    VoiceSettingsService.getSettings().then(settings => {
      if (mounted) {
        const enabled = settings.wakeWordEnabled ?? true;
        const phrase =
          settings.wakeWordPhrase || DEFAULT_WAKE_WORD_PRESET.phrase;
        setIsWakeWordEnabledState(enabled);
        isWakeWordEnabledRef.current = enabled;
        setWakeWordPhraseState(phrase);
        wakeWordPhraseRef.current = phrase;
        WakeWordService.setWakePhrase(phrase);
        setActiveWakePhrase(phrase);
        RegiusSpeechService.warmupVoice(settings.selectedVoiceId).catch(
          () => {},
        );
        if (enabled && assistantStateRef.current === 'idle') {
          startWakeWordEngineRef.current();
        }
      }
    });

    return () => {
      mounted = false;
      stopVoiceEngineRef.current();
    };
  }, []);

  // Monitor AppState (foreground vs background)
  useEffect(() => {
    const subscription = AppState.addEventListener(
      'change',
      (nextAppState: AppStateStatus) => {
        if (
          appState.current?.match(/inactive|background/) &&
          nextAppState === 'active'
        ) {
          if (
            isWakeWordEnabledRef.current &&
            assistantStateRef.current === 'idle'
          ) {
            startWakeWordEngineRef.current();
          }
        } else if (nextAppState.match(/inactive|background/)) {
          stopVoiceEngineRef.current();
          RegiusSpeechService.stop();
        }
        appState.current = nextAppState;
      },
    );

    return () => {
      subscription.remove();
    };
  }, []);

  const setWakeWordPhrase = useCallback(
    async (phrase: string): Promise<boolean> => {
      const validation = validateWakePhrase(phrase);
      if (!validation.isValid) {
        Toast.show({
          type: 'error',
          text1: 'Invalid Wake Word',
          text2:
            validation.error || 'Phrase not supported by detection engine.',
        });
        return false;
      }

      const formatted = validation.phrase;
      setWakeWordPhraseState(formatted);
      wakeWordPhraseRef.current = formatted;
      WakeWordService.setWakePhrase(formatted);
      setActiveWakePhrase(formatted);
      await VoiceSettingsService.saveSettings({ wakeWordPhrase: formatted });

      Toast.show({
        type: 'success',
        text1: 'Wake Word Updated',
        text2: `Listening for "${formatted}"`,
      });
      return true;
    },
    [],
  );

  const setWakeWordEnabled = useCallback(async (enabled: boolean) => {
    setIsWakeWordEnabledState(enabled);
    isWakeWordEnabledRef.current = enabled;
    await VoiceSettingsService.saveSettings({ wakeWordEnabled: enabled });
    if (enabled) {
      if (assistantStateRef.current === 'idle') {
        startWakeWordEngineRef.current();
      }
      Toast.show({
        type: 'success',
        text1: 'Wake Word Enabled',
        text2: `Say "${wakeWordPhraseRef.current}" at any time while the app is open.`,
      });
    } else {
      stopVoiceEngineRef.current();
      Toast.show({
        type: 'info',
        text1: 'Wake Word Disabled',
        text2: `Hands-free "${wakeWordPhraseRef.current}" listening is turned off.`,
      });
    }
  }, []);

  const resetToDefaults = useCallback(async () => {
    const defaults = await VoiceSettingsService.clearSettings();
    const defaultPhrase = DEFAULT_WAKE_WORD_PRESET.phrase;
    const enabled = defaults.wakeWordEnabled ?? true;

    setIsWakeWordEnabledState(enabled);
    isWakeWordEnabledRef.current = enabled;
    setWakeWordPhraseState(defaultPhrase);
    wakeWordPhraseRef.current = defaultPhrase;
    WakeWordService.setWakePhrase(defaultPhrase);
    setActiveWakePhrase(defaultPhrase);

    await RegiusSpeechService.warmupVoice(defaults.selectedVoiceId).catch(
      () => {},
    );

    if (enabled && assistantStateRef.current === 'idle') {
      startWakeWordEngineRef.current();
    }

    Toast.show({
      type: 'success',
      text1: 'Voice Settings Reset',
      text2: `Cleared storage. Active wake word: "${defaultPhrase}"`,
    });
  }, []);

  const startWakeWordListening = useCallback(async () => {
    hasLoggedWakeWordListeningRef.current = false;
    isStartingRef.current = false;
    if (restartTimerRef.current) {
      clearTimeout(restartTimerRef.current);
      restartTimerRef.current = null;
    }
    await startWakeWordEngineRef.current(true);
  }, []);

  // When user becomes authenticated (login / signup), automatically start wake word listening
  useEffect(() => {
    if (isAuthenticated) {
      startWakeWordListening();
    }
  }, [isAuthenticated, startWakeWordListening]);

  // Retry voice confirmation without re-executing original operation
  const retryConfirmationSpeech = useCallback(async () => {
    if (!lastExecutedResultRef.current?.spokenResponse) return;
    const textToSpeak = lastExecutedResultRef.current.spokenResponse;
    const sessionId = currentInteractionIdRef.current;
    setSpeechFailed(false);
    setErrorMessage(null);

    transitionState('generatingResponse', sessionId);
    try {
      await RegiusSpeechService.speakResponse(textToSpeak, {
        onStart: () => {
          if (sessionId === currentInteractionIdRef.current) {
            transitionState('speaking', sessionId);
            setSpokenResponseText(textToSpeak);
          }
        },
        onEnded: () => {
          if (sessionId === currentInteractionIdRef.current) {
            transitionState('success', sessionId);
            setSpeechFailed(false);
            if (Platform.OS === 'ios') {
              Vibration.vibrate(40);
            } else {
              Vibration.vibrate([0, 40, 30, 50]);
            }
          }
        },
        onError: () => {
          if (sessionId === currentInteractionIdRef.current) {
            transitionState('success', sessionId);
            setSpeechFailed(true);
            setErrorMessage('Voice confirmation retry failed.');
          }
        },
      });
    } catch {
      if (sessionId === currentInteractionIdRef.current) {
        transitionState('success', sessionId);
        setSpeechFailed(true);
        setErrorMessage('Voice confirmation retry failed.');
      }
    }
  }, [transitionState]);

  const openAssistant = useCallback((initialCommand?: string) => {
    RegiusSpeechService.stop();
    stopVoiceEngineRef.current();

    const sessionId = stateMachineRef.current.startNewSession();
    currentInteractionIdRef.current = sessionId;
    pendingClarificationRef.current = null;
    lastExecutedResultRef.current = null;
    accumulatedTranscriptRef.current = '';
    isFinalizingRef.current = false;

    setLiveTranscript(null);
    setLastSpokenCommand(null);
    setConfirmedActionTitle(null);
    setConfirmedActionBody(null);
    setResultSummary(null);
    setSpeechFailed(false);
    setSpokenResponseText(null);
    setErrorMessage(null);

    if (initialCommand) {
      processAndExecuteCommandRef.current(initialCommand, sessionId);
    } else {
      // Open into listening state directly and activate microphone
      startCommandListeningSessionRef.current();
    }
  }, []);

  const closeAssistant = useCallback(() => {
    clearInactivityTimers();
    if (loopTransitionTimerRef.current) {
      clearTimeout(loopTransitionTimerRef.current);
      loopTransitionTimerRef.current = null;
    }
    if (maxUtteranceTimerRef.current) {
      clearTimeout(maxUtteranceTimerRef.current);
      maxUtteranceTimerRef.current = null;
    }
    stateMachineRef.current.reset();
    currentInteractionIdRef.current = '';
    pendingClarificationRef.current = null;
    lastExecutedResultRef.current = null;
    accumulatedTranscriptRef.current = '';
    isFinalizingRef.current = false;

    RegiusSpeechService.stop();
    stopVoiceEngineRef.current();

    setCurrentGreeting(null);
    setLastSpokenCommand(null);
    setLiveTranscript(null);
    setConfirmedActionTitle(null);
    setConfirmedActionBody(null);
    setResultSummary(null);
    setSpeechFailed(false);
    setSpokenResponseText(null);
    setErrorMessage(null);

    if (isWakeWordEnabledRef.current && appState.current === 'active') {
      setTimeout(() => {
        startWakeWordEngineRef.current();
      }, 500);
    }
  }, [clearInactivityTimers]);
  closeAssistantRef.current = closeAssistant;

  const toggleMicInSheet = useCallback(() => {
    if (loopTransitionTimerRef.current) {
      clearTimeout(loopTransitionTimerRef.current);
      loopTransitionTimerRef.current = null;
    }

    if (assistantStateRef.current === 'speaking') {
      RegiusSpeechService.stop();
      startCommandListeningSessionRef.current();
      return;
    }

    if (assistantStateRef.current === 'listening') {
      const current = (
        accumulatedTranscriptRef.current ||
        liveTranscriptRef.current ||
        ''
      ).trim();
      if (current && !isWakeWordOnly(current)) {
        finalizeUtteranceRef.current(current);
      } else {
        stopVoiceEngineRef.current();
      }
    } else {
      // From success, unrecognized, error, or idle -> restart listening for another command
      setLastSpokenCommand(null);
      setLiveTranscript(null);
      setConfirmedActionTitle(null);
      setConfirmedActionBody(null);
      setResultSummary(null);
      setSpeechFailed(false);
      setSpokenResponseText(null);
      setErrorMessage(null);
      startCommandListeningSessionRef.current();
    }
  }, []);

  return (
    <VoiceWakeWordContext.Provider
      value={{
        isWakeWordEnabled,
        setWakeWordEnabled,
        wakeWordPhrase,
        setWakeWordPhrase,
        supportedWakeWords: SUPPORTED_WAKE_WORD_PRESETS,
        validateWakeWord: validateWakePhrase,
        testWakeWordRecognition: (transcript: string, phrase?: string) =>
          testWakeWordRecognition(
            transcript,
            phrase || wakeWordPhraseRef.current,
          ),
        isListening,
        isAssistantOpen: assistantState !== 'idle',
        assistantState,
        greetingText: currentGreeting,
        activeVoiceName,
        lastSpokenCommand,
        liveTranscript,
        confirmedActionTitle,
        confirmedActionBody,
        resultSummary,
        spokenResponseText,
        errorMessage,
        speechFailed,
        openAssistant,
        closeAssistant,
        triggerWakeWord,
        retryConfirmationSpeech,
        resetToDefaults,
        startWakeWordListening,
      }}
    >
      {children}

      {/* Global Voice Assistant Sheet Accessible Everywhere */}
      <VoiceAssistantSheet
        visible={assistantState !== 'idle'}
        onClose={closeAssistant}
        wakeWordPhrase={wakeWordPhrase}
        onActionSelected={actionType => {
          let commandText = actionType;
          if (actionType === 'log_meditation') {
            commandText = 'Log 20-min meditation';
          } else if (actionType === 'schedule_sprint') {
            commandText = 'Schedule sprint review at 3 PM';
          } else if (actionType === 'play_brief') {
            commandText = 'Play my Morning Brief';
          } else if (actionType === 'extend_time') {
            commandText = 'Add 15 minutes to my focus session';
          }
          processAndExecuteCommand(commandText);
        }}
        assistantState={assistantState}
        greetingText={currentGreeting}
        activeVoiceName={activeVoiceName}
        lastSpokenCommand={lastSpokenCommand}
        liveTranscript={liveTranscript}
        confirmedActionTitle={confirmedActionTitle}
        confirmedActionBody={confirmedActionBody}
        resultSummary={resultSummary}
        spokenResponseText={spokenResponseText}
        errorMessage={errorMessage}
        speechFailed={speechFailed}
        onMicPress={toggleMicInSheet}
        onRetrySpeech={retryConfirmationSpeech}
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
