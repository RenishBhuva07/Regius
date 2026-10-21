# 🌿 Habits Flow Complete UI & Flow Refactoring Plan

> **Design Alignment**: Modeled directly after [DashboardScreen.tsx](file:///Users/renishbhuva/Documents/Development/React_Native/Regius/src/Screens/Dashboard/DashboardScreen.tsx) and the core specifications in [PRD.md](file:///Users/renishbhuva/Documents/Development/React_Native/Regius/PRD.md), [DESIGN_SYSTEM.md](file:///Users/renishbhuva/Documents/Development/React_Native/Regius/DESIGN_SYSTEM.md), [THEME.md](file:///Users/renishbhuva/Documents/Development/React_Native/Regius/THEME.md), [ARCHITECTURE.md](file:///Users/renishbhuva/Documents/Development/React_Native/Regius/ARCHITECTURE.md), and [AGENTS.md](file:///Users/renishbhuva/Documents/Development/React_Native/Regius/AGENTS.md).

---

## 1. Executive Summary & Root Deficiencies

The current Habits screen presents noticeable aesthetic and usability regressions when compared with the flagship **Dashboard** and **Design System**:

1. **Static, Non-Conforming Header**:
   - Currently uses a rudimentary text header with a static avatar.
   - _Target_: Elevate to the **reactive scroll-interpolated luxury header** pioneered in `DashboardScreen.tsx` — complete with `RegiusLogo`, `HeaderPatternSvg`, animated Sia voice assistant orb button, settings trigger, and user profile avatar.
2. **Generic Streak Card**:
   - Currently displays hardcoded "18 Days" with basic styling and basic progress text.
   - _Target_: Transform into the **Habit Consistency Bento Card** with dual 3D `<Badge />` indicators (`ACTIVE STREAK` in amber/yellow and `TOP 5% CONSISTENCY` in lavender/purple), dynamically calculated maximum streak, percentage progress pill, gradient progress bar, and an interactive 7-Day Consistency Momentum Strip (Mon–Sun).
3. **Pill Filter Alignment**:
   - Currently basic flat chips that cut off labels ("Mindful B...").
   - _Target_: Rebuild into Regius category filter pills with counts (e.g. `All (5)`, `Morning (2)`, `Mindful (2)`, `Evening (1)`), `Colors.MidnightCharcoal` / `Colors.LavenderPurple` active states, and Lucide icons.
4. **Under-Styled Habit Cards**:
   - Currently plain white cards with generic gray circular checkboxes and text cut-offs.
   - _Target_: Re-architect as luxury asymmetric/rounded cards with category accent borders (`#D8DBFF` / `#8383D6` for habits), category semantic badges (`<Badge variant="purple" />`, `<Badge variant="green" />`), tactile animated checkboxes, time-of-day chips, flame streak indicators, 7-day mini consistency dots, and edit/delete capability.
5. **Bottom Floating Tab Bar Clearance**:
   - In current screenshots, the bottom-most habit item is cut off and obscured beneath the floating bottom navigation bar.
   - _Target_: Apply dynamic safe-area bottom offset (`insets.bottom + 110`) to the scroll container to ensure frictionless scrolling and accessibility for all cards.
6. **Modal & Flow Expansion**:
   - Enhance `AddHabitModal.tsx` to support both **Creation** and **Editing** flows, including time-of-day presets, category cards with semantic tints, frequency chips, and delete confirmation.
   - Update `TaskReminderContext` with `updateHabit(id, updates)`.

---

## 2. Structural Architecture & Components

```
src/Screens/Habits/
├── HabitsScreen.tsx               # Main container with reactive header & scroll
└── Components/
    ├── HabitConsistencyBento.tsx  # Dynamic streak, completion ring & 7-day week dots
    ├── HabitItemCard.tsx          # Luxury habit card with tactile check, badge & dots
    └── HabitCategoryFilters.tsx   # Filter pills with category counts
src/Components/
└── AddHabitModal.tsx              # Create & Edit habit bottom sheet modal
src/Context/
└── TaskReminderContext.tsx        # Add updateHabit handler
```

---

## 3. Step-by-Step Implementation Roadmap

### Step 1: Context Capability Extension

- Add `updateHabit(id: string, updates: Partial<Omit<HabitItem, 'id'>>)` to `TaskReminderContext.tsx`.
- Expose `updateHabit` in context hook.

### Step 2: Modular Habits Components

1. **`HabitConsistencyBento.tsx`**:
   - Dynamic longest streak calculation from `habits` data (`Math.max(...habits.map(h => h.streak), 0)`).
   - Dynamic completion rate calculation (`completedCount / totalHabits * 100`).
   - Two top badges using `<Badge />` (`ACTIVE STREAK`, `TOP 5% CONSISTENCY`).
   - 7-day weekly tracker (Monday through Sunday) showing daily ritual completion dots.
   - Progress bar with smooth fill animation.
2. **`HabitItemCard.tsx`**:
   - Category-accented left border / pastel surface matching the habit's category.
   - Category badge (`MORNING`, `MINDFUL`, `EVENING`) via `<Badge />`.
   - Tactile custom checkmark button with scale animation and haptic vibration.
   - 7-day micro-dot habit history strip.
   - Flame streak pill (`Flame` icon + `${streak}d`).
   - Options trigger / long-press for editing and deleting.

### Step 3: HabitsScreen Overhaul

- Implement the exact reactive scroll animated header from `DashboardScreen.tsx`:
  - `HeaderPatternSvg` background.
  - `RegiusLogo` (variants `default` and `light`).
  - Holographic Sia Voice Assistant button (`HolographAnimation` Lottie orb).
  - Settings button and Avatar ring.
- Filter pill scroll row with dynamic counts.
- "Today's Rituals" section with quick "+ New Habit" pill button.
- Empty state with luxury iconography and CTA when a filter returns 0 habits.
- Proper bottom padding (`insets.bottom + 115`) ensuring clean clearance above the floating bottom tab bar.

### Step 4: Add / Edit Habit Modal Upgrade

- Enhance `AddHabitModal.tsx` to accept an optional `initialHabit?: HabitItem | null` and `onUpdateHabit`.
- Category cards (Morning, Mindful, Evening) with category colors.
- Frequency options (Daily, Mon/Wed/Fri, Weekdays, Weekends).
- Time presets (7:00 AM, 8:00 AM, 1:00 PM, 6:00 PM, 8:30 PM) + manual input.
- Delete habit button when in edit mode.
- Luxury CTA button `<CustomButton />` or rounded pill button.

### Step 5: Verification & Quality Assurance

- Run `npx tsc --noEmit` to ensure strict typing across all files.
- Run `npm test` to verify full test suite passes.
- Create unit / snapshot tests for HabitsScreen refactor in `__tests__/HabitsRedesign.test.tsx`.
- Update documentation: [FEATURES.md](file:///Users/renishbhuva/Documents/Development/React_Native/Regius/FEATURES.md), [DESIGN_SYSTEM.md](file:///Users/renishbhuva/Documents/Development/React_Native/Regius/DESIGN_SYSTEM.md), and [ARCHITECTURE.md](file:///Users/renishbhuva/Documents/Development/React_Native/Regius/ARCHITECTURE.md).
