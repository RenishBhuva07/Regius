# Regius — AI Agent Operating Manual

**Applies to:** Antigravity, Claude, Cursor, Copilot and other autonomous coding agents  
**Repository:** Regius — React Native 0.87.1, React 19.2.3, TypeScript 6.0.3  
**Authoritative docs:** `PRD.md` (product/behavior), `DESIGN_SYSTEM.md` (visual tokens/components), `ARCHITECTURE.md` (state machine/audio/lifecycle), `FEATURES.md` (feature ownership/active file map).

## 1. Mission and non-negotiable directives

Maintain Regius's stability, aesthetic quality and architectural integrity. This is a production-grade app with finely tuned native audio, background speech recognition, neural TTS and gesture-driven navigation. Casual changes, careless refactors or generic templates can break native audio and the luxury brand experience.

1. **Inspect first:** Read each target file's active implementation and understand its callers/consumers before editing.
2. **Find root causes:** Diagnose the underlying cause before fixing a bug; do not mask symptoms.
3. **Minimize changes:** Make the smallest reliable, targeted diff; avoid wholesale rewrites when surgical edits suffice.
4. **Preserve behavior:** Do not remove working features, dynamic behavior, user preferences or fallbacks (including bundled audio and phonetic regexes) without explicit authorization.
5. **Keep tests real:** Never replace application logic or native service bridges with mocks merely to make tests pass.
6. **Do not invent:** Verify API contracts, credentials, environment variables and backend capabilities in the codebase; never hallucinate them.
7. **Follow the design system:** All UI changes must comply with `DESIGN_SYSTEM.md`. Never introduce generic blue/grey colors, flat borderless tags or clinical `#FFFFFF` canvases.
8. **Scale UI correctly:** Use `ResponsivePixels` from `src/Assets/StyleUtilities/ResponsivePixels.tsx` for UI dimensions/geometry wherever scaling is appropriate; do not use arbitrary hardcoded pixel values when a corresponding token exists.
9. **Verify changes:** Run `npx tsc --noEmit` after changes. Do NOT run `npm test` for small tasks (to conserve tokens); only run `npm test` for big integrations or major architectural changes. Report actual compiler output and test results when tests are run.
10. **Keep docs synchronized:** When requirements, architecture/data flow, design tokens or feature status change, update the applicable `PRD.md`, `DESIGN_SYSTEM.md`, `ARCHITECTURE.md` and/or `FEATURES.md`.
11. **Surface conflicts:** Explain conflicts between instructions/specifications and code reality; do not silently discard existing behavior.
12. **Write human comments:** Use brief comments only for non-obvious logic. No multi-paragraph block comments, redundant JSDoc, decorative emoji comments or dead commented-out code.

## 2. Required workflow

For every task, follow this order:

1. **Consult docs:** Read the relevant source docs: `PRD.md` for product behavior; `DESIGN_SYSTEM.md` for colors/fonts/badges/spacing; `ARCHITECTURE.md` for state machine/audio session/lifecycle; `FEATURES.md` for feature ownership and active file mappings.
2. **Inspect code:** Locate active files (using `FEATURES.md`); read relevant source with `view_file`/`grep_search`; trace exports, callers and consumers; inspect related contexts, audio/state-machine dependencies and tests in `__tests__/`.
3. **Plan:** Identify dependencies and risks; choose the smallest reliable diff.
4. **Implement:** Use targeted `replace_file_content`/`multi_replace_file_content` edits. Preserve existing comments, styling and platform-specific guards.
5. **Verify:** Run `npx tsc --noEmit`. Do NOT run `npm test` for small tasks (to avoid unnecessary token consumption); only run `npm test` for big integrations. For native-layer changes, also inspect iOS `Info.plist` and Android `AndroidManifest.xml`.
6. **Update docs:** Register added features in `FEATURES.md`; update `ARCHITECTURE.md` for architecture/data-flow changes; update `DESIGN_SYSTEM.md` for design-token changes; update `PRD.md` when product requirements/behavior change. Keep all applicable core docs synchronized.
7. **Report:** Use the completion format in §7.

## 3. Stack and repository map

### Stack (verify against project files before changing versions/dependencies)

- React Native `0.87.1`, New Architecture enabled (`RCTNewArchEnabled=true`); React `19.2.3`; TypeScript `6.0.3`, strict mode.
- Speech-to-text: `@react-native-voice/voice` `3.2.4`.
- Playback: `react-native-track-player` `4.1.2`.
- Neural TTS: Kokoro-82M via Gradio SSE client, with local bundled fallback.
- On-device ML: `onnxruntime-react-native` `1.24.3`, including custom JSI patch.
- Navigation: React Navigation v7 (`native-stack`, `bottom-tabs`).
- Storage: `@react-native-async-storage/async-storage` `3.1.1`.
- Animation: `lottie-react-native` `7.5.0` and React Native Animated.
- Graphics/icons: `react-native-svg` `15.15.5`, `lucide-react-native` `1.56.0`.

### Directory ownership

```text
Regius/
├── App.tsx                 # Root provider wrapper
├── index.js                # TrackPlayer and AppRegistry entry point
├── src/
│   ├── Assets/
│   │   ├── Audio/          # Bundled fallback WAVs
│   │   ├── Fonts/          # Ranade and Poppins TTFs
│   │   ├── Images/         # SVGs and vector image components
│   │   ├── JsonAnimations/ # Holograph.json (Lottie orb)
│   │   └── StyleUtilities/ # Colors.tsx, ResponsivePixels.tsx
│   ├── Common/             # Shared UI primitives (Badge, CustomButton)
│   ├── Components/         # Modal dialogs (AddTaskModal, AddReminderModal, etc.)
│   ├── Context/            # TaskReminder, VoiceWakeWord, Auth, Premium
│   ├── Navigators/         # AppNavigator, BottomTabNavigator, PlusActionSheet
│   ├── Screens/             # Dashboard, Tasks, Reminders, Habits, Settings
│   ├── Services/            # Voice, Kokoro, WakeWord, AudioPlayerService
│   └── Theme/               # ThemeContext, fonts, Typographys
└── __tests__/               # Voice, Wake Word and State Machine Jest suites
```

## 4. Coding and runtime safety

### TypeScript and React Native

- Use strict typing; avoid `any` except for an untyped third-party event payload, and immediately cast/narrow it.
- Declare explicit return types on all exported functions, hooks and services.
- Co-locate interfaces in the feature's `types.ts` or at the top of its service file.
- Use functional components (`React.FC<Props>` or named functions with typed props).
- Use `useCallback` for expensive/heavy callbacks and `useMemo` for computed data where beneficial.
- Handle safe areas/notches and floating bottom navigation with `useSafeAreaInsets()`.
- Include `accessibilityRole` and `accessibilityLabel`; respect `AccessibilityInfo.isReduceMotionEnabled`.

### Voice/audio pipeline — critical native constraints

The voice pipeline controls sensitive native audio hardware. Preserve its sequencing and race protections:

1. **Half-duplex:** Await `stopVoiceEngine()` before starting speech playback via `RegiusSpeechService` or `AudioPlayerService`; never record while the app is speaking.
2. **Audio-session handoff:** After stopping recording and before TrackPlayer playback, wait `160–300ms` for `AVAudioSession`/`AudioRecord` to transition.
3. **Reject stale callbacks:** Every state-machine transition from asynchronous callbacks (audio completion, network arrival, etc.) must verify `sessionId === currentInteractionIdRef.current`.
4. **Keep TTS fallback:** If remote Kokoro synthesis times out, immediately use bundled `voice.previewUrl`. Existing timeout races: `1800ms` for greetings; `20s` for general speech.

### Comments

Use concise, human-written, purpose-driven comments only for tricky logic, regexes or hardware edge cases. Do not add multi-paragraph comments, repetitive JSDoc, architectural essays, decorative emoji headers or comments that merely restate names. Remove dead commented-out JSX/legacy code.

## 5. UI and design-system rules

Consult `DESIGN_SYSTEM.md` for the complete design language. Apply these project-specific constraints to every relevant UI change:

### Global styling and shared components

- Backgrounds: light `Colors.CreamBackground` (`#FFFCE3`); dark `Colors.DarkBackground` (`#121417`).
- Typography: H1/brand moments use `Typography.h1RanadeBold` or `Typography.displayLargeRanadeBold`; cards/body/section headers/inputs use `Typography.bodyMediumPoppinsSemiBold` or `Fonts.poppins`.
- Badges: never use flat, borderless text badges. Use `Badge` from `src/Common/Badge.tsx` with semantic variant `purple`, `yellow`, `green`, `orange`, `red` or `neutral`.
- Buttons: use `CustomButton` from `src/Common/CustomButton.tsx`; full-pill geometry, `borderRadius: 28–50`.
- Category cards: define all four facets: `bgColor`, `borderColor`, `accentColor`, `shadowColor` (see `DESIGN_SYSTEM.md` §2.3, Category Trios & Semantic Accents).
- **Responsive geometry:** For every UI addition/change, import `ResponsivePixels` from `src/Assets/StyleUtilities/ResponsivePixels.tsx` for sizing, padding, margins, icon dimensions, coordinate offsets (`top`/`bottom`/`left`/`right`) and component geometry where a scaling token is appropriate. Never use arbitrary raw numbers in place of an applicable token.

### Hero Bento Cards

Applies to `DailyBriefingCard`, `TaskProductivityBento` and `HabitConsistencyBento`:

- Never use thin `1px` borders or subtle/flat elevation.
- Use a two-layer structure: outer `cardShadowWrapper` without `overflow: 'hidden'`; inner `card` with `overflow: 'hidden'`.
- Inner card: `borderWidth: 4`; `borderColor: 'rgba(255, 255, 255, 0.9)'`; `borderRadius: 24`; `backgroundColor: Colors.NeroBlack`.
- Outer shadow: `shadowColor: '#000000'`; `shadowOffset: { width: 0, height: 10 }`; `shadowOpacity: 0.28`; `shadowRadius: 18`; `elevation: 8–10`.
- Parent wrapper: `paddingHorizontal: 10` for consistent screen margins across tabs.

### Section-header actions — `HeaderActionButton`

When a section has a left title and right-side CTA/navigation action (e.g. Add Category, Voice Studio, Configure), always use `HeaderActionButton` from `src/Common/HeaderActionButton.tsx`. Never use plain text, flat clickable labels or unbordered header actions.

- Styling: full pill (`borderRadius: 20`); Nero fill `#1E2028`; slate border `#363944`, width `1`.
- Icon aura: circular `14×14`, radius `7`, background `rgba(245, 197, 24, 0.15)`; icon `11px`, `strokeWidth: 3`.
- Text: Poppins SemiBold `10.5`, `letterSpacing: 0.2`, color `#F5C518`.
- `iconPosition: 'left'` for action verbs (Add Category, Configure); `'right'` for drill-down navigation (Voice Studio).

## 6. Verification and failure handling

Before completing development work, verify TypeScript compilation:

```bash
npx tsc --noEmit
```

> [!IMPORTANT] > **Token Preservation Rule:** Do NOT run `npm test` for small or incremental tasks—it consumes excessive tokens. Run `npm test` **only for big integrations**, cross-module architectural changes, or when explicitly requested.

When tests are executed for big integrations:

```bash
npm test
```

For failed tests: read the output; determine whether it exposes an application regression or an outdated assertion; fix the application root cause. Never change assertions merely to hide broken features or replace real logic/bridges with mocks. Report actual exit codes, compiler output/error count, Jest suites and test counts (or note if tests were skipped for small tasks). For native changes, inspect `Info.plist` and `AndroidManifest.xml`.

## 7. Required completion report

```markdown
### Summary of Changes

- **Files Modified / Created:** `relative/path/to/file.tsx` (include absolute file link when available)
- **Key Enhancements:** Architectural and behavioral changes.

### Verification Results

- **TypeScript:** `npx tsc --noEmit` — exit code and error count/output.
- **Jest:** `npm test` — suites passed and total tests passed (or noted as skipped for small task to save tokens).

### Documentation Synchronized

- List applicable docs updated: `PRD.md`, `DESIGN_SYSTEM.md`, `ARCHITECTURE.md`, `FEATURES.md`.

### Known Limitations & Open Questions

- Missing backend APIs, unverified platform behavior and follow-up items.
```
