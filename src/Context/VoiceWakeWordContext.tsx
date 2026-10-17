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
import { VoiceStateMachine } from '../Services/Voice/VoiceStateMachine';
import {
  VoiceCommandService,
  PendingClarification,
  ExecutionResult,
} from '../Services/Voice/VoiceCommandService';

export interface VoiceWakeWordContextType {
  isWakeWordEnabled: boolean;
  setWakeWordEnabled: (enabled: boolean) => Promise<void>;
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
}

const VoiceWakeWordContext = createContext<
  VoiceWakeWordContextType | undefined
>(undefined);

// RegEx patterns for native STT misrecognitions of "Hey Regius" / "Regius"
const WAKE_WORD_PATTERNS = [
  /\b(?:hey|hay|hi|hello|ok|okay|ay|he)?\s*(?:regius|regis|regions|regeus|rejius|regus|rejus|reach\s+us|read\s+just|ready\s+us|radius|religious|rage\s+us|raygeus|radios|radious|rijus|regias|regios)\b/i,
];

function cleanPunctuation(text: string): string {
  return text
    .toLowerCase()
    .replace(/[.,/#!$%^&*;:{}=\-_`~()?]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function levenshtein(a: string, b: string): number {
  const an = a ? a.length : 0;
  const bn = b ? b.length : 0;
  if (an === 0) return bn;
  if (bn === 0) return an;
  const matrix: number[][] = Array.from({ length: bn + 1 }, (_, i) => [i]);
  for (let j = 0; j <= an; j++) matrix[0][j] = j;

  for (let i = 1; i <= bn; i++) {
    for (let j = 1; j <= an; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1,
        );
      }
    }
  }
  return matrix[bn][an];
}

interface WakeWordDetectionResult {
  detected: boolean;
  matchedPhrase?: string;
  command?: string;
}

function detectWakeWord(transcript: string): WakeWordDetectionResult {
  const normalized = cleanPunctuation(transcript);

  // 1. Direct regex match
  for (const pattern of WAKE_WORD_PATTERNS) {
    const match = normalized.match(pattern);
    if (match) {
      const command = normalized.replace(pattern, '').trim();
      return { detected: true, matchedPhrase: match[0], command };
    }
  }

  // 2. Token-level fuzzy phonetic match
  const tokens = normalized.split(/\s+/);
  for (let i = 0; i < tokens.length; i++) {
    const word = tokens[i];
    if (levenshtein(word, 'regius') <= 2 || levenshtein(word, 'regis') <= 1) {
      const prevWord = i > 0 ? tokens[i - 1] : '';
      const isGreeting = [
        'hey',
        'hay',
        'hi',
        'hello',
        'ok',
        'okay',
        'ay',
        'he',
      ].includes(prevWord);
      const commandTokens = [...tokens];
      if (isGreeting) {
        commandTokens.splice(i - 1, 2);
      } else {
        commandTokens.splice(i, 1);
      }
      return {
        detected: true,
        matchedPhrase: isGreeting ? `${prevWord} ${word}` : word,
        command: commandTokens.join(' ').trim(),
      };
    }
  }

  return { detected: false };
}

function isWakeWordOnly(text: string): boolean {
  const norm = cleanPunctuation(text);
  if (!norm) return true;
  for (const pattern of WAKE_WORD_PATTERNS) {
    if (norm.replace(pattern, '').trim().length === 0) {
      return true;
    }
  }
  const tokens = norm.split(/\s+/);
  if (
    tokens.length <= 2 &&
    (tokens.includes('regius') ||
      tokens.includes('regis') ||
      tokens.includes('religious') ||
      tokens.includes('regions') ||
      tokens.includes('reach') ||
      tokens.includes('radius'))
  ) {
    return true;
  }
  return false;
}

export const VoiceWakeWordProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // Underlying State Machine instance
  const stateMachineRef = useRef(new VoiceStateMachine('idle'));
  const [assistantState, setAssistantState] = useState<VoiceAssistantState>('idle');

  const [isWakeWordEnabled, setIsWakeWordEnabledState] = useState(true);
  const [isListening, setIsListening] = useState(false);

  const [lastSpokenCommand, setLastSpokenCommand] = useState<string | null>(null);
  const [liveTranscript, setLiveTranscript] = useState<string | null>(null);
  const [confirmedActionTitle, setConfirmedActionTitle] = useState<string | null>(null);
  const [confirmedActionBody, setConfirmedActionBody] = useState<string | null>(null);
  const [resultSummary, setResultSummary] = useState<string | null>(null);
  const [spokenResponseText, setSpokenResponseText] = useState<string | null>(null);
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

  const isStartingRef = useRef(false);
  const restartTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const silenceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const loopTransitionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const maxUtteranceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Full Utterance Capture & Session Accumulator
  const accumulatedTranscriptRef = useRef<string>('');
  const isFinalizingRef = useRef<boolean>(false);
  const finalizeUtteranceRef = useRef<(forcedText?: string) => Promise<void>>(
    () => Promise.resolve(),
  );

  const liveTranscriptRef = useRef<string | null>(null);
  liveTranscriptRef.current = liveTranscript;

  const startWakeWordEngineRef = useRef<() => Promise<void>>(() =>
    Promise.resolve(),
  );
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

  // Keep state machine synced with React state
  useEffect(() => {
    const unsubscribe = stateMachineRef.current.subscribe(nextState => {
      setAssistantState(nextState);
      assistantStateRef.current = nextState;
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
          message:
            'Regius needs microphone access for hands-free "Hey Regius" wake word detection and conversational commands.',
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

  const stopVoiceEngine = useCallback(async () => {
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
  }, []);
  stopVoiceEngineRef.current = stopVoiceEngine;

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
  const startWakeWordEngine = useCallback(async () => {
    if (restartTimerRef.current) {
      clearTimeout(restartTimerRef.current);
      restartTimerRef.current = null;
    }

    if (
      isStartingRef.current ||
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
      await new Promise<void>(resolve => setTimeout(() => resolve(), 120));

      await Voice.start('en-US');
      isListeningRef.current = true;
      setIsListening(true);
      console.log('[VoiceWakeWord] 🎙️ Listening for "Hey Regius"...');
    } catch (err) {
      console.warn('[VoiceWakeWord] Error starting Wake Word Voice engine:', err);
      isListeningRef.current = false;
      setIsListening(false);
      scheduleWakeWordRestartRef.current(1000);
    } finally {
      isStartingRef.current = false;
    }
  }, [requestMicPermission]);
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

      if (!candidate || isWakeWordOnly(candidate)) {
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

      console.log('[VoiceWakeWord] 🎯 Finalizing complete utterance:', candidate);
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
      console.log('[VoiceWakeWord] 🎙️ Microphone active: Listening for command...');

      // Max utterance timeout: guard against continuous background noise (20s)
      maxUtteranceTimerRef.current = setTimeout(() => {
        if (
          assistantStateRef.current === 'listening' &&
          accumulatedTranscriptRef.current &&
          !isWakeWordOnly(accumulatedTranscriptRef.current)
        ) {
          console.log('[VoiceWakeWord] Max utterance duration reached, finalizing...');
          finalizeUtteranceRef.current();
        }
      }, 20000);
    } catch (err) {
      console.warn('[VoiceWakeWord] Error starting command listening session:', err);
      isListeningRef.current = false;
      setIsListening(false);
      transitionState('error', currentInteractionIdRef.current);
      setErrorMessage('Microphone failed to activate. Tap mic to retry.');
    }
  }, [transitionState]);
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
        setConfirmedActionTitle(interpreted.displayTitle || 'Request Cancelled');
        setConfirmedActionBody(interpreted.displayBody || 'Previous request cancelled.');
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
        setConfirmedActionTitle(interpreted.displayTitle || 'Information Needed');
        setConfirmedActionBody(interpreted.displayBody || 'Please provide details.');

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
        setConfirmedActionTitle(interpreted.displayTitle || 'Command Not Recognized');
        setConfirmedActionBody(interpreted.displayBody || 'Try saying "Schedule sprint review", "Log meditation", or "Add task..."');

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

      // E: Valid Command: Execute Operation (Section 6)
      pendingClarificationRef.current = null;
      setSpeechFailed(false);
      setConfirmedActionTitle(interpreted.displayTitle || 'Working on your request...');
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
        setConfirmedActionBody(result.displayBody || 'Could not complete operation.');
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
                setErrorMessage('Task added, but voice confirmation failed.');
              }
            },
          });
        } catch (err) {
          if (sessionId === currentInteractionIdRef.current) {
            console.warn('[VoiceWakeWord] Speech synthesis exception:', err);
            transitionState('success', sessionId);
            setSpeechFailed(true);
            setErrorMessage('Task added, but voice confirmation failed.');
          }
        }
      } else {
        // If autoSpeak is disabled, show success and loop to listening
        transitionState('success', sessionId);
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
      const greeting = await RegiusSpeechService.getFastWakeGreeting();
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
            console.log('[VoiceWakeWord] Greeting playback completed. Starting listening...');
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
      console.warn('[VoiceWakeWord] Error during wake word greeting flow:', err);
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
      isListeningRef.current = true;
      setIsListening(true);
      if (
        assistantStateRef.current !== 'idle' &&
        assistantStateRef.current !== 'speaking' &&
        assistantStateRef.current !== 'generatingResponse' &&
        assistantStateRef.current !== 'executing' &&
        assistantStateRef.current !== 'processing'
      ) {
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
            !isWakeWordOnly(accumulatedTranscriptRef.current)
          ) {
            finalizeUtteranceRef.current();
          }
        }, 1400);
        return;
      }

      // When Assistant is idle: check for wake word
      if (assistantStateRef.current === 'idle') {
        for (const text of candidates) {
          const result = detectWakeWord(text);
          if (result.detected) {
            console.log(
              '[VoiceWakeWord] 🎯 "Hey Regius" matched in partials:',
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
            !isWakeWordOnly(accumulatedTranscriptRef.current)
          ) {
            finalizeUtteranceRef.current();
          }
        }, 1400);
        return;
      }

      if (assistantStateRef.current === 'idle') {
        for (const text of candidates) {
          const result = detectWakeWord(text);
          if (result.detected) {
            console.log(
              '[VoiceWakeWord] 🎯 "Hey Regius" matched in results:',
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
          console.log('[VoiceWakeWord] 🏁 SFSpeechRecognizer reported isFinal: true');
          finalizeUtteranceRef.current();
        }
      }
    };

    Voice.onSpeechEnd = () => {
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
        if (text && !isWakeWordOnly(text)) {
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

      const code = e.error?.code;
      const message = e.error?.message;
      const isSilenceTimeout =
        code === '7' ||
        code === '6' ||
        code === '203' ||
        code === '209' ||
        message?.toLowerCase().includes('no match') ||
        message?.toLowerCase().includes('silence');

      if (assistantStateRef.current === 'listening') {
        const text = (
          accumulatedTranscriptRef.current ||
          liveTranscriptRef.current ||
          ''
        ).trim();
        if (text && !isWakeWordOnly(text)) {
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
        setIsWakeWordEnabledState(enabled);
        isWakeWordEnabledRef.current = enabled;
        RegiusSpeechService.warmupVoice(settings.selectedVoiceId).catch(() => {});
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

  const setWakeWordEnabled = useCallback(
    async (enabled: boolean) => {
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
          text2: 'Say "Hey Regius" at any time while the app is open.',
        });
      } else {
        stopVoiceEngineRef.current();
        Toast.show({
          type: 'info',
          text1: 'Wake Word Disabled',
          text2: 'Hands-free "Hey Regius" listening is turned off.',
        });
      }
    },
    [],
  );

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

  const openAssistant = useCallback(
    (initialCommand?: string) => {
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
    },
    [],
  );

  const closeAssistant = useCallback(() => {
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
  }, []);

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
      }}
    >
      {children}

      {/* Global Voice Assistant Sheet Accessible Everywhere */}
      <VoiceAssistantSheet
        visible={assistantState !== 'idle'}
        onClose={closeAssistant}
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
