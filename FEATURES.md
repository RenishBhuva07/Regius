# 📋 Regius — Feature & Integration Registry

> **Document Status**: Active / Single Source of Truth for Feature Implementation  
> **Target Audience**: AI Agents (Antigravity), Engineers, Product Managers  
> **Source Documents**: [PRD.md](PRD.md) | [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md) | [ARCHITECTURE.md](ARCHITECTURE.md) | [AGENTS.md](AGENTS.md)

---

## 1. Quick Feature-to-File Navigation Matrix

Use this lookup table to identify exactly which files, components, hooks, and services to inspect before modifying any feature.

| Feature Area                  | Status        | Primary Component / Screen                          | Service / Context / Engine                              | Key Source Files                                                                                                                                                                                                                                                                                             |
| :---------------------------- | :------------ | :-------------------------------------------------- | :------------------------------------------------------ | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Wake-Word Activation**      | `Implemented` | `BottomTabNavigator.tsx`, `DashboardScreen.tsx`     | `VoiceWakeWordContext.tsx`, `WakeWordService.ts`        | [VoiceWakeWordContext.tsx](file:///Users/renishbhuva/Documents/Development/React_Native/Regius/src/Context/VoiceWakeWordContext.tsx), [WakeWordPresets.ts](file:///Users/renishbhuva/Documents/Development/React_Native/Regius/src/Services/WakeWord/WakeWordPresets.ts)                                     |
| **Holographic Assistant UI**  | `Implemented` | `VoiceAssistantSheet.tsx`, `SiaHolographicOrb.tsx`  | `VoiceStateMachine.ts`, `Holograph.json`                | [VoiceAssistantSheet.tsx](file:///Users/renishbhuva/Documents/Development/React_Native/Regius/src/Screens/Dashboard/Components/VoiceAssistantSheet.tsx), [SiaHolographicOrb.tsx](file:///Users/renishbhuva/Documents/Development/React_Native/Regius/src/Screens/Dashboard/Components/SiaHolographicOrb.tsx) |
| **Dynamic Greetings & TTS**   | `Implemented` | `VoiceAssistantSheet.tsx`                           | `RegiusSpeechService.ts`, `KokoroTTSService.ts`         | [RegiusSpeechService.ts](file:///Users/renishbhuva/Documents/Development/React_Native/Regius/src/Services/RegiusSpeechService.ts), [KokoroTTSService.ts](file:///Users/renishbhuva/Documents/Development/React_Native/Regius/src/Services/Kokoro/KokoroTTSService.ts)                                        |
| **Command Interpretation**    | `Implemented` | `LiveTranscript.tsx`, `AssistantStatus.tsx`         | `IntentRecognitionService.ts`, `VoiceCommandService.ts` | [IntentRecognitionService.ts](file:///Users/renishbhuva/Documents/Development/React_Native/Regius/src/Services/Voice/IntentRecognitionService.ts), [VoiceCommandService.ts](file:///Users/renishbhuva/Documents/Development/React_Native/Regius/src/Services/Voice/VoiceCommandService.ts)                   |
| **Slot Clarification Loop**   | `Implemented` | `ClarificationPrompt.tsx`, `ActionConfirmation.tsx` | `VoiceCommandService.ts`, `VoiceConfirmationBuilder.ts` | [VoiceConfirmationBuilder.ts](file:///Users/renishbhuva/Documents/Development/React_Native/Regius/src/Services/Voice/VoiceConfirmationBuilder.ts)                                                                                                                                                            |
| **Voice Studio & Profiles**   | `Implemented` | `VoiceStudioModal.tsx`, `DefaultVoiceSection.tsx`   | `VoiceSettingsService.ts`, `VOICES` registry            | [SettingsScreen.tsx](file:///Users/renishbhuva/Documents/Development/React_Native/Regius/src/Screens/Settings/SettingsScreen.tsx), [VoiceSettingsService.ts](file:///Users/renishbhuva/Documents/Development/React_Native/Regius/src/Services/VoiceSettingsService.ts)                                       |
| **Task Management**           | `Implemented` | `TasksScreen.tsx`, `AddTaskModal.tsx`               | `TaskReminderContext.tsx`                               | [TasksScreen.tsx](file:///Users/renishbhuva/Documents/Development/React_Native/Regius/src/Screens/Tasks/TasksScreen.tsx), [TaskReminderContext.tsx](file:///Users/renishbhuva/Documents/Development/React_Native/Regius/src/Context/TaskReminderContext.tsx)                                                 |
| **Reminder Management**       | `Implemented` | `RemindersScreen.tsx`, `AddReminderModal.tsx`       | `TaskReminderContext.tsx`                               | [RemindersScreen.tsx](file:///Users/renishbhuva/Documents/Development/React_Native/Regius/src/Screens/Reminders/RemindersScreen.tsx)                                                                                                                                                                         |
| **Habit Streak Tracking**     | `Implemented` | `HabitsScreen.tsx`, `AddHabitModal.tsx`             | `TaskReminderContext.tsx`                               | [HabitsScreen.tsx](file:///Users/renishbhuva/Documents/Development/React_Native/Regius/src/Screens/Habits/HabitsScreen.tsx)                                                                                                                                                                                  |
| **Curved Floating Dock**      | `Implemented` | `BottomTabNavigator.tsx`, `PlusActionSheet.tsx`     | Custom SVG Path, React Native Animated                  | [BottomTabNavigator.tsx](file:///Users/renishbhuva/Documents/Development/React_Native/Regius/src/Navigators/BottomTabNavigator.tsx)                                                                                                                                                                          |
| **3D Upper-Layer Badges**     | `Implemented` | `Badge.tsx`                                         | `Platform.select`, `VARIANT_CONFIGS`                    | [Badge.tsx](file:///Users/renishbhuva/Documents/Development/React_Native/Regius/src/Common/Badge.tsx)                                                                                                                                                                                                        |
| **Onboarding & Splash**       | `Implemented` | `Splash.tsx`, `Intro.tsx`                           | `AppNavigator.tsx`, Animated timer gate                 | [Splash.tsx](file:///Users/renishbhuva/Documents/Development/React_Native/Regius/src/Screens/Splash/Splash.tsx), [Intro.tsx](file:///Users/renishbhuva/Documents/Development/React_Native/Regius/src/Screens/Intro/Intro.tsx)                                                                                |
| **Local Settings Storage**    | `Implemented` | `SettingsScreen.tsx`                                | `@react-native-async-storage/async-storage`             | [VoiceSettingsService.ts](file:///Users/renishbhuva/Documents/Development/React_Native/Regius/src/Services/VoiceSettingsService.ts)                                                                                                                                                                          |
| **Task/Habit Storage**        | `Partial`     | In-memory `TaskReminderContext`                     | Local React State (not persisted to disk)               | [TaskReminderContext.tsx](file:///Users/renishbhuva/Documents/Development/React_Native/Regius/src/Context/TaskReminderContext.tsx)                                                                                                                                                                           |
| **OS Reminder Notifications** | `Planned`     | In-memory `time` & `date` strings                   | Needs `@notifee/react-native` or native alarms          | [RemindersScreen.tsx](file:///Users/renishbhuva/Documents/Development/React_Native/Regius/src/Screens/Reminders/RemindersScreen.tsx)                                                                                                                                                                         |
| **On-Device ONNX TTS**        | `Partial`     | `KokoroTTSService.ts`                               | `onnxruntime-react-native` (patched, model pending)     | [KokoroTTSService.ts](file:///Users/renishbhuva/Documents/Development/React_Native/Regius/src/Services/Kokoro/KokoroTTSService.ts)                                                                                                                                                                           |
| **Cloud Backend Sync**        | `Planned`     | `src/api/` folders (controllers/helpers)            | Remote REST / GraphQL sync (empty scaffolding)          | [src/api/](file:///Users/renishbhuva/Documents/Development/React_Native/Regius/src/api)                                                                                                                                                                                                                      |
| **Subscription Payments**     | `Partial`     | `PremiumContext.tsx`                                | In-memory mock boolean (`isPremium`)                    | [PremiumContext.tsx](file:///Users/renishbhuva/Documents/Development/React_Native/Regius/src/Context/PremiumContext.tsx)                                                                                                                                                                                     |

---

## 2. Detailed Feature Registry

### 2.1 Voice Assistant & Wake-Word Activation

- **Purpose**: Hands-free acoustic detection of the configured wake phrase to summon the assistant.
- **Status**: `Implemented`
- **Source Files**:
  - `src/Context/VoiceWakeWordContext.tsx`
  - `src/Services/WakeWord/WakeWordService.ts`
  - `src/Services/WakeWord/WakeWordDetectionEngine.ts`
  - `src/Services/WakeWord/WakeWordPresets.ts`
- **Native Modules & Providers**: `@react-native-voice/voice` (Continuous speech recognition loop), `Vibration` (Dual haptics).
- **User-Facing Workflow**:
  1. User speaks _"Hey Sia"_ (or configured preset: Regius, Aria, Nova, Jarvis, Echo).
  2. Background recognition catches acoustic match using phonetic tuning regexes.
  3. Device vibrates with dual haptic feedback.
  4. Audio engine yields 160ms, transitions state to `greeting`, and opens `VoiceAssistantSheet`.
- **Permissions Required**: iOS: `NSMicrophoneUsageDescription`, `NSSpeechRecognitionUsageDescription`; Android: `RECORD_AUDIO`.
- **Fallback Behavior**: Long-press on the center floating plus button (320ms) activates assistant manually if microphone is muted or in noisy environments.
- **Test Coverage**: Tested in `__tests__/WakeWordDetection.test.ts` (12 tests) and `__tests__/VoiceAssistantConversationFlow.test.ts`.

---

### 2.2 Dynamic Greetings & Neural TTS Playback

- **Purpose**: Generate and speak natural, warm vocal greetings and responses in the user's selected neural voice.
- **Status**: `Implemented`
- **Source Files**:
  - `src/Services/RegiusSpeechService.ts`
  - `src/Services/Kokoro/KokoroTTSService.ts`
  - `src/Services/Voice/wakeWordReplies.ts`
  - `src/Services/AudioPlayerService.ts`
  - `src/Assets/Audio/index.ts`
- **Native Modules & Providers**: `react-native-track-player`, HuggingFace Gradio SSE queue endpoint (`https://hexgrad-kokoro-tts.hf.space/`).
- **User-Facing Workflow**:
  1. Assistant selects greeting variation (e.g. _"Hey there! Sia here, ready when you are"_).
  2. Checks local persistent cache for 0ms instant playback.
  3. If uncached, races remote neural inference (1800ms threshold for greetings).
  4. Plays high-quality audio through TrackPlayer; updates Holographic Orb to breathing speaking state.
- **Fallback Behavior**: If network is slow or offline, immediately falls back to bundled voice audio (`src/Assets/Audio/af_bella.wav`, etc.).
- **Test Coverage**: Tested in `__tests__/VoiceAssistantGreetingPlayback.test.ts` (16 tests).

---

### 2.2.1 Deep Dive: End-to-End Voice & Neural TTS System Integration ("Hey Sia" to Spoken Confirmation)

This section provides an exact, step-by-step technical breakdown of how the voice pipeline is wired across native modules, background services, state machine transitions, neural TTS synthesis, and command execution.

#### 1. End-to-End Sequence Diagram

```mermaid
sequenceDiagram
    autonumber
    actor User as User
    participant Mic as Native Mic (@react-native-voice/voice)
    participant Engine as WakeWordDetectionEngine
    participant Context as VoiceWakeWordContext
    participant VSM as VoiceStateMachine
    participant Speech as RegiusSpeechService
    participant Kokoro as KokoroTTSService
    participant Player as AudioPlayerService (TrackPlayer)
    participant NLU as IntentRecognitionService
    participant TaskCtx as TaskReminderContext

    User->>Mic: "Hey Sia" (or "Hey Regius")
    Mic->>Engine: Stream transcript: "hey sia", "see ya", etc.
    Engine->>Context: Match detected (phonetic regex)
    Note over Context: Dual Haptic Burst (50ms iOS / patterned Android)
    Context->>Mic: Await stopVoiceEngine() (Pause recording)
    Note over Context: Yield AudioSession (160ms pause)
    Context->>VSM: transitionTo('greeting', sessionId)
    Context->>Speech: getFastWakeGreeting('Sia')
    Speech->>Kokoro: Check Persistent Cache (@regius_kokoro_audio_cache_v2)
    alt Cache Hit (0ms)
        Kokoro-->>Speech: Return cached WAV URL
    else Cache Miss
        Kokoro->>Kokoro: Race Gradio SSE queue (1800ms limit)
        alt Remote Gradio Completes in Time
            Kokoro-->>Speech: Return remote 24kHz WAV URL
        else Remote Timeout or Offline
            Kokoro-->>Speech: Fallback to bundled asset (voice.previewUrl e.g. af_bella.wav)
        end
    end
    Speech->>Player: playWithCallbacks(targetUrl, { onStart, onEnded })
    Player-->>VSM: onStart() -> transitionTo('speaking', sessionId)
    Player->>User: Audio plays through speaker / headphones
    Player-->>Context: onEnded() callback fires
    Context->>Player: AudioPlayerService.stop()
    Note over Context: 300ms audio transition gap
    Context->>VSM: transitionTo('listening', sessionId)
    Context->>Mic: Voice.start('en-US') (Microphone opens)
    User->>Mic: "Schedule sprint review at 3 PM today"
    Mic->>Context: onSpeechPartialResults / onSpeechResults
    Note over Context: 1500ms Silence Debounce Triggered
    Context->>Mic: finalizeUtterance() -> stopVoiceEngine()
    Context->>VSM: transitionTo('processing', sessionId)
    Context->>NLU: VoiceCommandService.interpret(candidate)
    NLU->>Context: Intent: 'ADD_TASK' | 'SCHEDULE_SPRINT'
    Context->>TaskCtx: addTask({ title, date, time })
    TaskCtx-->>Context: Task created successfully
    Context->>VSM: transitionTo('generatingResponse', sessionId)
    Context->>Speech: speakResponse("Added sprint review for 3 PM.")
    Speech->>Kokoro: Synthesize confirmation response
    Speech->>Player: playWithCallbacks(responseWav, { onStart, onEnded })
    Player->>User: Spoken confirmation played
    Player-->>Context: onEnded() -> re-arm listening loop after 2.5s
```

#### 2. Ten-Step End-to-End Implementation Workflow

##### Step 1: Bootstrapping & Audio Engine Registration

- In `index.js`, `TrackPlayer.registerPlaybackService(() => playbackService)` registers headless audio events before root components mount.
- On mount, `AudioPlayerService.setup()` initializes TrackPlayer with `Capability.Play`, `Capability.Pause`, `Capability.Stop`, and `autoHandleInterruptions: true`.
- In `App.tsx`, `AppNavigator` initializes `VoiceWakeWordProvider` after the 2500ms splash display gate, loading user preferences (active voice, speech speed, wake phrase) from `VoiceSettingsService`.

##### Step 2: Background Voice Warmup

- Immediately upon resolving the active voice in `RegiusSpeechService.warmupVoice()`, the app calls `KokoroTTSService.prewarm()`.
- Predefined wake replies (`wakeWordReplies.ts`) are pre-synthesized in the background and stored in `AsyncStorage` (`@regius_kokoro_audio_cache_v2`). When the user later says "Hey Sia", the greeting audio is already cached, resolving in **0ms**.

##### Step 3: Passive Background Wake Word Listening

- In `VoiceWakeWordContext.tsx`, `startWakeWordEngine()` activates `@react-native-voice/voice` in `en-US` continuous listening mode.
- Incoming partial and final transcripts are evaluated in `WakeWordDetectionEngine.ts` against compiled regex patterns.
- **Phonetic STT Tuning**: Because acoustic recognition varies by accent and background noise, the pattern for `Hey Sia` contains extensive phonetic aliases:
  ```typescript
  /\b(?:hey|hay|hi|hello|ok|okay|ay|he)?\s*(?:sia|siya|siri|sierra|see\s+ya|seeya|ceea|ceeya|cia|shia|cyan|syra|cera|seri|seera|saya|shya|cira|sera)\b/i;
  ```
- A **2500ms cooldown timestamp guard** (`lastTriggerTimeRef`) prevents duplicate triggers from multiple partial results.

##### Step 4: Haptic Feedback & Audio Session Muting

- Upon wake detection, the app triggers a dual haptic burst:
  - iOS: `Vibration.vibrate(50)`
  - Android: `Vibration.vibrate([0, 50, 40, 70])`
- `stateMachineRef.current.startNewSession()` generates a unique `sessionId` (e.g., `vas_179234...`).
- The microphone is **immediately paused** via `await stopVoiceEngine()`.
- An explicit **160ms yield pause** (`setTimeout`) allows the native `AVAudioSession` / `AudioRecord` hardware to release recording mode before TrackPlayer initiates playback.

##### Step 5: Dynamic Greeting Resolution & Kokoro TTS Synthesis

- `RegiusSpeechService.getFastWakeGreeting('Sia')` picks a pre-warmed greeting from `wakeWordReplies.ts` (e.g., _"Hey there! Sia here, ready when you are"_).
- `KokoroTTSService.speakGreetingAndWait()` evaluates audio availability:
  1. **Cache Hit**: Plays cached WAV immediately (0ms latency).
  2. **Cache Miss**: Joins the HuggingFace Gradio queue (`https://hexgrad-kokoro-tts.hf.space/gradio_api/queue/join`) and consumes the SSE data stream (`streamGradioQueue()`) with an 1800ms race timeout.
  3. **Guaranteed Local Fallback**: If the network is unreachable or remote synthesis exceeds 1800ms, it falls back instantly to the bundled local audio asset (`src/Assets/Audio/af_bella.wav`).

##### Step 6: Native Audio Playback via TrackPlayer

- `AudioPlayerService.playWithCallbacks()` resets TrackPlayer, adds the playable WAV URL/asset, and starts playback.
- State machine transitions cleanly: `greeting` → `speaking`.
- The central `SiaHolographicOrb` synchronizes its Lottie animation speed to `1.25x` during speech.
- `onEnded()` fires natively when the audio buffer completes. TrackPlayer is explicitly stopped, and a 300ms transition pause is applied.

##### Step 7: Command Listening Session & Utterance Accumulation

- Microphone capture restarts for command capture (`Voice.start('en-US')`).
- State machine transitions to `listening`. `SiaHolographicOrb` adjusts playback speed to `1.35x`.
- In `Voice.onSpeechPartialResults`, candidate transcripts stream in real-time to `liveTranscript` in the UI.
- **Utterance Debounce Timer**: Every speech event resets a 1500ms silence timer (`silenceTimerRef`). Once the user stops speaking for 1.5 seconds, `finalizeUtterance()` triggers.
- **Max Utterance Safety Guard**: A 20-second timeout ensures continuous background noise does not hang the listening state indefinitely.

##### Step 8: Siri-Like Inactivity Lifecycle

- While in `listening` mode, an inactivity timer is armed:
  - **10 Seconds of Silence**: Assistant prompts verbally: _"Are you still there?"_ via Kokoro TTS.
  - **7 Seconds of Grace**: If the user remains silent for 7 additional seconds, the assistant sheet gracefully dismisses and the background wake-word engine re-engages.

##### Step 9: Intent Recognition & Conversational Slot Clarification

- When speech finishes, `stopVoiceEngine()` is awaited, and `VoiceCommandService.interpret()` evaluates the transcript in `IntentRecognitionService.ts`.
- **Parameter Extraction**: Parses titles, dates (`Today`, `Tomorrow`), times (`3:00 PM`), frequencies, and categories.
- **Interactive Clarification**: If a required slot is missing (e.g., user says _"Add a task"_ with no title, or _"Set a reminder"_ with no time):
  1. A `PendingClarification` object is constructed.
  2. State machine transitions: `processing` → `awaitingClarification`.
  3. Kokoro TTS speaks the follow-up question: _"What is the title of the task?"_
  4. Microphone immediately opens to capture the user's answer and complete the command.

##### Step 10: State Execution & Spoken Confirmation Loop

- Allowlisted operations execute synchronously against `TaskReminderContext` (`addTask`, `addReminder`, `toggleHabit`).
- `VoiceConfirmationBuilder.buildConfirmationMessage()` generates natural spoken text (e.g., _"Added sprint review to your tasks for 3:00 PM today."_).
- Kokoro synthesizes and speaks the confirmation via `RegiusSpeechService.speakResponse()`.
- **Multi-Turn Re-arming**: Once confirmation playback completes, a 2.5-second loop timer re-arms `startCommandListeningSession()` so the user can issue follow-up commands without saying "Hey Sia" again.

#### 3. Native Audio Hardware & Thread Safety Guardrails

1. **Half-Duplex Hardware Isolation**:
   - The microphone is **always** stopped before calling `TrackPlayer.play()`.
   - The audio playback engine is **always** stopped before calling `Voice.start()`.
   - This eliminates acoustic feedback loops where the assistant transcribes its own voice output.
2. **Session ID Race Isolation**:
   - Asynchronous callbacks (SSE network arrival, TrackPlayer audio completion, timer expirations) verify `sessionId === currentInteractionIdRef.current`. Stale callbacks from previous sessions are discarded safely.
3. **Persistent Two-Tier TTS Cache**:
   - Audio is cached in-memory (`Map<string, string>`) and mirrored to `AsyncStorage` under `@regius_kokoro_audio_cache_v2`.
   - On load, legacy `data:` or `blob:` URIs are filtered out to prevent iOS AVPlayer buffer errors.
4. **Guaranteed Zero-Silence Fallback**:
   - Every TTS request has a guaranteed local audio path: if remote inference fails or times out, the app immediately plays the corresponding voice preset's local WAV asset (`af_bella`, `af_nicole`, `am_adam`, `am_michael`, `bf_emma`, `bm_george`, `af_heart`).

---

### 2.3 Conversational Command Interpretation & Slot Clarification

- **Purpose**: Parse natural speech into structured productivity commands with parameter extraction and interactive clarification questions.
- **Status**: `Implemented`
- **Source Files**:
  - `src/Services/Voice/IntentRecognitionService.ts`
  - `src/Services/Voice/VoiceCommandService.ts`
  - `src/Services/Voice/VoiceConfirmationBuilder.ts`
  - `src/Services/Voice/VoiceTypes.ts`
  - `src/Screens/Dashboard/Components/VoiceAssistant/ClarificationPrompt.tsx`
- **Supported Intents**:
  - `ADD_TASK`, `COMPLETE_TASK`, `SHOW_TASKS`
  - `ADD_REMINDER`, `SHOW_REMINDERS`
  - `ADD_HABIT`, `LOG_HABIT`, `SHOW_HABITS`
  - `START_FOCUS`, `EXTEND_FOCUS`, `PLAY_BRIEF`, `SCHEDULE_SPRINT`, `RESHUFFLE`
  - `CANCEL`, `GOODBYE`, `WAKE_WORD_ONLY`, `UNRECOGNIZED`
- **User-Facing Workflow**:
  - User says _"Add a task to email the design team"_: Task is created immediately with default date/time.
  - User says _"Add a task"_: Assistant asks _"What is the title of the task?"_, keeps microphone open, captures the user's reply, and finishes creation.
- **Test Coverage**: Tested in `__tests__/VoiceCommandService.test.ts` and `__tests__/VoiceConfirmationBuilder.test.ts`.

---

### 2.4 Voice Profiles & Settings Persistence

- **Purpose**: Customize assistant voice identity, speech speed, wake phrase, and audio feedback.
- **Status**: `Implemented`
- **Source Files**:
  - `src/Services/VoiceSettingsService.ts`
  - `src/Screens/Settings/SettingsScreen.tsx`
  - `src/Screens/Settings/Components/VoiceStudioModal.tsx`
  - `src/Screens/Settings/Components/WakeWordConfigModal.tsx`
  - `src/Screens/Settings/Components/types.ts`
- **Persisted Attributes**:
  - `selectedVoiceId`: (Default: `af_bella` • Bella)
  - `speechSpeed`: `0.75x` to `1.5x` (Default: `1.0`)
  - `autoSpeakReplies`: Boolean (Default: `true`)
  - `wakeWordEnabled`: Boolean (Default: `true`)
  - `wakeWordPhrase`: (Default: `Hey Sia`)
- **Storage Backend**: `@react-native-async-storage/async-storage` under key `@regius_voice_settings`.
- **Test Coverage**: Verified in `VoiceAssistantRefactorSuite.test.tsx`.

---

### 2.5 Task & Productivity Management

- **Purpose**: Full task lifecycle organization by category, priority, and completion status.
- **Status**: `Implemented` (In-memory Context)
- **Source Files**:
  - `src/Screens/Tasks/TasksScreen.tsx`
  - `src/Screens/Tasks/AddTaskScreen.tsx`
  - `src/Components/AddTaskModal.tsx`
  - `src/Context/TaskReminderContext.tsx`
- **Categories**: Works (`#FFFCEB`), Sport (`#EDFDF5`), Habits (`#EFF2FE`), Events (`#FFF3E0`).
- **User-Facing Workflow**:
  - Tap checkbox to toggle done state with green check bounce.
  - Filter tasks by category pills.
  - Add task via modal or full-screen route with subtasks and priority tags.
- **Known Limitation**: Data resets on full app reload because persistence to `AsyncStorage` is **Partial** (see Section 3).

---

### 2.6 Reminders & Scheduling

- **Purpose**: View upcoming and completed time-anchored reminders.
- **Status**: `Implemented` (UI & Context) / `Planned` (Native Alarms)
- **Source Files**:
  - `src/Screens/Reminders/RemindersScreen.tsx`
  - `src/Screens/Reminders/AddReminderScreen.tsx`
  - `src/Components/AddReminderModal.tsx`
  - `src/Context/TaskReminderContext.tsx`
- **User-Facing Workflow**:
  - Switch between Upcoming and Completed tabs.
  - Spoken audio preview via Kokoro TTS speaker button.
  - Add reminder with time, date, recurrence (`Daily`, `Once`), and sound preferences.
- **Known Limitation**: Reminders are stored in React state. Native push/local notifications require a native notification library (see Section 3).

---

### 2.7 Habit Streak Tracking

- **Purpose**: Build recurring daily routines across Morning, Mindful, and Evening buckets.
- **Status**: `Implemented`
- **Source Files**:
  - `src/Screens/Habits/HabitsScreen.tsx`
  - `src/Components/AddHabitModal.tsx`
  - `src/Context/TaskReminderContext.tsx`
- **User-Facing Workflow**:
  - Checking habit increments streak count (`streak + 1`) and shows celebratory toast.
  - Unchecking decrements streak count safely (`Math.max(streak - 1, 0)`).
  - Progress bar shows percentage of habits completed today.

---

### 2.8 Navigation & Floating Curved Dock

- **Purpose**: Gesture-friendly mobile navigation with an organic curved floating tab bar and quick action drawer.
- **Status**: `Implemented`
- **Source Files**:
  - `src/Navigators/BottomTabNavigator.tsx`
  - `src/Navigators/AppNavigator.tsx`
  - `src/Navigators/PlusActionSheet.tsx`
- **User-Facing Workflow**:
  - 4 primary tabs: Dashboard, Tasks, Reminders, Habits.
  - Center floating plus button with cream halo and deep purple drop shadow.
  - Tap plus button: rotates `135°` and opens `PlusActionSheet` with spring animation.
  - Long press plus button: triggers voice assistant.

---

### 2.9 UI Aesthetics, 3D Badges & Lottie Orb

- **Purpose**: Visual presentation conforming to Modern Warm Luxury standards.
- **Status**: `Implemented`
- **Source Files**:
  - `src/Common/Badge.tsx`
  - `src/Common/CustomButton.tsx`
  - `src/Screens/Dashboard/Components/SiaHolographicOrb.tsx`
  - `src/Assets/JsonAnimations/Holograph.json`
- **Technical Implementation**:
  - Badges rendered with specular top rims, extruded bottom borders, and colored drop shadows.
  - Holographic orb speed synchronizes with assistant state machine (`1.35x` listening, `1.55x` processing, `1.25x` speaking).

---

## 3. Partially Implemented & Planned Features Registry

| Feature Name                    | Status    | Current Reality                                                                         | Required Next Steps                                                               |
| :------------------------------ | :-------- | :-------------------------------------------------------------------------------------- | :-------------------------------------------------------------------------------- |
| **Task / Reminder Persistence** | `Partial` | In-memory `useState` in `TaskReminderContext.tsx`.                                      | Add `useEffect` to hydrate from and save to `AsyncStorage`.                       |
| **OS-Level Reminder Alarms**    | `Planned` | In-memory time strings (`"04:30 PM"`).                                                  | Install and configure `@notifee/react-native` for native scheduling.              |
| **On-Device Kokoro Inference**  | `Partial` | `onnxruntime-react-native` installed and JSI patched; remote Gradio client active.      | Bundle `kokoro-v0_19.onnx` model weights and wire on-device inference session.    |
| **Remote Backend Sync**         | `Planned` | `src/api/controllers` and `src/api/helpers` exist as empty folders.                     | Implement REST/GraphQL client with JWT authentication.                            |
| **Authentication Flow**         | `Partial` | `LoginScreen.tsx` has complete UI; `AuthContext.tsx` uses mock state.                   | Wire authentication endpoints and secure token storage (`react-native-keychain`). |
| **In-App Subscription**         | `Partial` | `PremiumContext.tsx` has mock state (`isPremium: false`).                               | Integrate `react-native-purchases` (RevenueCat) or StoreKit/Google Play Billing.  |
| **Sub-screen Routes**           | `Planned` | `src/Screens/Language`, `Premium`, `PrivacySecurity`, `Profile`, `VerifyOTP` are empty. | Implement dedicated screen components when user requirements are finalized.       |
