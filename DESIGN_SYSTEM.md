# 🎨 Regius — UI/UX Design System Specification

> **Document Status**: Active / Single Source of Truth for Visual Design & UI Engineering  
> **Source Files**: [Colors.tsx](file:///Users/renishbhuva/Documents/Development/React_Native/Regius/src/Assets/StyleUtilities/Colors.tsx) | [ThemeContext.tsx](file:///Users/renishbhuva/Documents/Development/React_Native/Regius/src/Theme/ThemeContext.tsx) | [Typographys.ts](file:///Users/renishbhuva/Documents/Development/React_Native/Regius/src/Theme/Typographys.ts) | [Badge.tsx](file:///Users/renishbhuva/Documents/Development/React_Native/Regius/src/Common/Badge.tsx) | [CustomButton.tsx](file:///Users/renishbhuva/Documents/Development/React_Native/Regius/src/Common/CustomButton.tsx) | [VoiceAssistantSheet.tsx](file:///Users/renishbhuva/Documents/Development/React_Native/Regius/src/Screens/Dashboard/Components/VoiceAssistantSheet.tsx)  
> **Related Documents**: [PRD.md](PRD.md) | [ARCHITECTURE.md](ARCHITECTURE.md) | [FEATURES.md](FEATURES.md) | [AGENTS.md](AGENTS.md)

---

## 1. Brand Identity & Design Principles

Regius embraces **Modern Warm Luxury & Mindful Productivity** (_"Plan Your Day In Details"_). Unlike cold, sterile enterprise project tools or harsh cyberpunk interfaces, Regius is designed to feel like an artisanal physical stationery notebook fused with a high-grade neural assistant.

### Core Visual Tenets

1. **Warmth Over Cold**: Soft, sunlit cream backgrounds (`#FFFCE3` / `#FAF8F5`) instead of clinical `#FFFFFF` or sterile monochrome grey.
2. **Organic Asymmetric Geometry**: High-emphasis hero cards employ exaggerated signature asymmetric rounded corners (`borderRadius: 23`, `borderTopRightRadius: 63`).
3. **Harmonic Category Ecosystems**: Every functional category pairs 4 coordinated facets:
   `Soft Tinted Background` + `Matching Pastel Border` + `Vibrant Accent Icon` + `Colored Drop Shadow Glow`.
4. **Pill Architecture**: Controls, toggles, badges, and primary action buttons favor full-pill geometry (`borderRadius: 50` or `borderRadius: 28`).
5. **Upper Layer 3D Badges**: Badges represent the highest physical elevation layer and are **always rendered with 3D specular rims and extruded depth bevels**. Never render flat or borderless tags.
6. **Fluid Tactile Motion**: Spring animations, rotating floating plus button (`0°` to `135°`), live sliding active tab indicator pill, and organic holographic breathing.

---

## 2. Complete Color Architecture & Design Tokens

### 2.1 Canvas & Surface Tokens

| Token Name         | Hex Value | Semantic Role & Usage                                                               |
| :----------------- | :-------- | :---------------------------------------------------------------------------------- |
| `CreamBackground`  | `#FFFCE3` | **Signature Brand Canvas**. Used across Splash, Intro, Dashboard, Tasks, Reminders. |
| `SheetSurface`     | `#FAF8F5` | Background for modal dialogs, bottom sheets, and form surfaces.                     |
| `TaskSectionBg`    | `#FAFAFA` | Home / Tasks inner list rounded container sheet.                                    |
| `DefaultWhite`     | `#FFFFFF` | Elevated cards, inner circular icon backdrops, active pill backgrounds.             |
| `MidnightCharcoal` | `#1F2228` | Primary dark surface, pill toggles, high-emphasis text, dark CTA buttons.           |
| `ButtonDark`       | `#242424` | Primary button background in light mode.                                            |
| `RingBorder`       | `#E8E2D5` | Subtle divider border for avatar rings, input cards, and hairline borders.          |
| `HomeIndicator`    | `#D5D0C5` | Bottom iOS gesture bar indicator color.                                             |

### 2.2 Dark Mode Surface Adaptations & Obsidian Palette Standard

Regius features an app-wide Obsidian Dark Theme that maintains artisanal luxury warmth while preventing eye strain. Clinical pure `#000000` pitch black and generic flat greys are strictly avoided in favor of rich midnight tones and deep category jewel tints.

| Token Name           | Hex Value             | Semantic Role & Usage                                                        |
| :------------------- | :-------------------- | :--------------------------------------------------------------------------- |
| `DarkBackground`     | `#121417`             | Deep midnight canvas for all screens (`Dashboard`, `Tasks`, `Reminders`, `Habits`). |
| `DarkCardBackground` | `#1E2228`             | Elevated modal cards, quick action cards, and bento cards in dark theme.     |
| `DarkSectionSurface` | `#181B20`             | Flow section rounded sheet containers and canopy docks.                      |
| `DarkInputBg`        | `#171A1F`             | Deep input fields, search bars, and subtask text inputs.                     |
| `DarkCardFill`       | `#171A20`             | Asymmetric cutout SVG card fill color in dark mode.                          |
| `DarkCardStroke`     | `#2C3035`             | Asymmetric cutout SVG card hairline perimeter border.                        |
| `DarkCheckboxUnchecked`| `#252932`           | Floating checkbox button surface when unchecked.                             |
| `DarkCheckboxChecked`| `#13281E`             | Floating checkbox button surface when checked (border: `#52D22E`).           |
| `DarkSecondaryText`  | `#A3A8B1`             | Subdued secondary copy, metadata stamps, and unselected filter chips.        |
| `DarkBorder`         | `#2C3035` / `#363944` | Subtle hairline borders, divider lines, and card bevels.                     |
| `PureWhiteText`      | `#FFFFFF`             | High-contrast titles, headers, active tab icons, and primary inputs.         |

### 2.3 Category Trios & Semantic Accents (Dual Light & Dark Harmonized System)

Every major category or card type pairs 4 harmonized color values, structured according to the **Universal Product Navigation & Metric Sequence Standard**:

> **Universal Product Hierarchy**: **1. Tasks** (Works / Gold-Yellow) → **2. Reminders** (Alerts & Nudges / Mint-Green) → **3. Habits** (Mindful Routines / Lavender-Purple).  
> This order is enforced across all surfaces: Bottom Tab Bar (`Dashboard` → `Tasks` → `[+]` → `Reminders` → `Habits`), Daily Balance Grid (`Tasks` → `Reminders` → `Habits`), Flow Filters (`All Flow` → `Tasks` → `Reminders` → `Habits`), and Dynamic Assistant Spoken Briefings.

#### Light Mode Category Palettes (`isDarkMode: false`)

| Sequence & Category      | Bg Tint (`bgColor`) | Border Tint (`borderColor`) | Vibrant Accent / Icon             | Drop Shadow Glow (`shadowColor`) |
| :----------------------- | :------------------ | :-------------------------- | :-------------------------------- | :------------------------------- |
| **1. Works / Tasks**     | `#FFFCEB`           | `#FFF5B8`                   | `#F5C518` / `#FFE600` / `#B48216` | `#F5C518` (Gold Glow)            |
| **2. Sport / Reminders** | `#EDFDF5`           | `#C6FFDD`                   | `#1B9A72` / `#52D22E`             | `#52D22E` (Fresh Green Glow)     |
| **3. Habits / Brand**    | `#EFF2FE`           | `#D8DBFF`                   | `#8383D6` (Lavender Purple)       | `#8383D6` (Lavender Glow)        |
| **4. Events / Alerts**   | `#FFF3E0`           | `#FFE0B2`                   | `#FF9800` (Amber)                 | `#FF9800` (Amber Glow)           |
| **5. Danger / Delete**   | `#FEEFEF`           | `#FED6D6`                   | `#FF3B30` / `#D92A0F`             | `#FF3B30` (Crimson Glow)         |

#### Dark Mode Deep Jewel Category Palettes (`isDarkMode: true`)

In dark mode, category surfaces gracefully switch from pale pastels to rich, deep jewel tints with glowing luminous borders and radiant accents:

| Sequence & Category      | Dark Bg Tint (`bgColor`) | Glowing Border (`borderColor`) | Vibrant Accent / Icon | Dark Glow Shadow (`shadowColor`) |
| :----------------------- | :----------------------- | :----------------------------- | :-------------------- | :------------------------------- |
| **1. Works / Tasks**     | `#2A2416`                | `#DEAA14`                      | `#F5C518`             | `#F5C518` (Gold Glow)            |
| **2. Sport / Reminders** | `#162820`                | `#1B9A72`                      | `#52D22E`             | `#52D22E` (Mint Glow)            |
| **3. Habits / Mindful**  | `#202336`                | `#8383D6`                      | `#8383D6`             | `#8383D6` (Lavender Glow)        |
| **4. Events / Alerts**   | `#331F18`                | `#FF9800`                      | `#FF9800`             | `#FF9800` (Amber Glow)           |
| **5. Danger / Delete**   | `#381A1A`                | `#EF4444`                      | `#FF453A`             | `#FF3B30` (Crimson Glow)         |

### 2.3.1 Universal Theme Hook: `useAppTheme` (`src/Theme/useAppTheme.ts`)

Components throughout Regius consume dynamic design tokens using the centralized `useAppTheme()` hook:

```tsx
import { useAppTheme } from '../../Theme';

const {
  isDarkMode,       // boolean: true when dark mode is active
  activeThemeId,    // string: 'obsidian' | 'cream' | etc.
  Colors,           // base color tokens
  bgMain,           // '#121417' (dark) | '#FFFCE3' (light)
  cardBg,           // '#1E2228' (dark) | '#FFFFFF' (light)
  surfaceAlt,       // '#181B20' (dark) | '#FAF8F5' (light)
  inputBg,          // '#171A1F' (dark) | '#FFFFFF' (light)
  textPrimary,      // '#FFFFFF' (dark) | '#1F2228' (light)
  textSecondary,    // '#A3A8B1' (dark) | '#666665' (light)
  borderLight,      // '#2C3035' (dark) | '#E8E2D5' (light)
  borderSubtle,     // '#363944' (dark) | '#F0EDE6' (light)
  getCategoryTheme, // (categoryKey) => { bg, border, accent, shadow }
} = useAppTheme();
```

### 2.4 Typography Foregrounds

| Token Name                        | Hex Value             | Purpose & Visual Weight                                       |
| :-------------------------------- | :-------------------- | :------------------------------------------------------------ |
| `MidnightInkText` / `TrueBlack`   | `#000000`             | Hero screen headers, brand display, high-emphasis titles.     |
| `SlateGraphiteText`               | `#1F2228` / `#3F454D` | Body copy, section headers, prominent input text.             |
| `SubtitleGray` / `MutedSteelText` | `#666665` / `#7E838F` | Secondary descriptions, task counts, metadata stamps.         |
| `PureWhiteText`                   | `#FFFFFF`             | Text on dark buttons, active tab indicators, floating badges. |

### 2.5 Prestige Theme Palettes (Dual Light & Dark Harmonic Systems)

Every theme preset in Regius is constructed with dedicated, bespoke **Light Mode** and **Dark Mode** 4-color palettes. In `ThemeScreen.tsx`, swatches and previews dynamically adapt based on `isDarkMode`:

#### Light Mode Palettes (`isDarkMode: false`)

| Theme Preset & Tier Level       | 1. Canvas (`Background`) | 2. Surface / Card | 3. Brand Accent | 4. Foreground / Text |
| :------------------------------ | :----------------------- | :---------------- | :-------------- | :------------------- |
| **Warm Cream** (Tier 1)         | `#FFFCE3`                | `#FFFFFF`         | `#8383D6`       | `#121417`            |
| **Obsidian Night** (Tier 1)     | `#FFFCE3`                | `#FFFFFF`         | `#8383D6`       | `#121417`            |
| **Champagne Gold** (Tier 2)     | `#FAF6EE`                | `#FFFFFF`         | `#C5A059`       | `#241E15`            |
| **Emerald Velvet** (Tier 3)     | `#F0F7F4`                | `#FFFFFF`         | `#1B9A72`       | `#0E231B`            |
| **Celestial Azure** (Tier 4)    | `#F0F4FC`                | `#FFFFFF`         | `#3B82F6`       | `#0E1A33`            |
| **Obsidian Sovereign** (Tier 5) | `#F7F7F8`                | `#FFFFFF`         | `#D4AF37`       | `#111113`            |

#### Dark Mode Palettes (`isDarkMode: true`)

| Theme Preset & Tier Level       | 1. Canvas (`Background`) | 2. Surface / Card | 3. Brand Accent | 4. Foreground / Text |
| :------------------------------ | :----------------------- | :---------------- | :-------------- | :------------------- |
| **Obsidian Night** (Tier 1)     | `#121417`                | `#1E2228`         | `#F5C518`       | `#FFFFFF`            |
| **Warm Cream** (Tier 1)         | `#121417`                | `#1E2228`         | `#F5C518`       | `#FFFFFF`            |
| **Champagne Gold** (Tier 2)     | `#161410`                | `#221F18`         | `#D4AF37`       | `#F7E7CE`            |
| **Emerald Velvet** (Tier 3)     | `#0F1A15`                | `#162720`         | `#2ECC71`       | `#E3F7EE`            |
| **Celestial Azure** (Tier 4)    | `#0D1424`                | `#141D34`         | `#60A5FA`       | `#E6EEFA`            |
| **Obsidian Sovereign** (Tier 5) | `#08080A`                | `#121217`         | `#FFD700`       | `#FFFDF0`            |

- **Circular Swatch Geometry**: `width: 38`, `height: 38`, `borderRadius: 19`, `borderWidth: 1.5`, elevation shadow.
- **Dynamic Perceived Luminance (`isLightColor`)**: Guarantees high-contrast borders and text across all light canvas and card combinations.
- **Single-Line Layout**: All 4 swatches rendered in one row with uppercase hex labels and role subtitles.

---

## 3. Typography Scale & Font Hierarchy

Regius pairs two typeface families imported in `src/Theme/fonts.ts`:

1. **Ranade** (`Ranade-Bold`, `Ranade-SemiBold`, `Ranade-Medium`, `Ranade-Regular`):
   - Editorial, elegant, regal. Used for **Display Brand Names**, **Screen Headings (H1)**, and **Modal Titles**.
2. **Poppins** (`Poppins-Bold`, `Poppins-SemiBold`, `Poppins-Medium`, `Poppins-Regular`):
   - Modern, friendly geometric sans-serif. Used for **Section Headers (H5/H6)**, **Card Labels**, **Body Copy**, **Pills**, **Badges**, and **Input Fields**.

### Typographic Tokens Table (`src/Theme/Typographys.ts`)

| Token                                          | Font Family      | Size    | Line Height | Usage                                     |
| :--------------------------------------------- | :--------------- | :------ | :---------- | :---------------------------------------- |
| `Typography.displayLargeRanadeBold`            | Ranade Bold      | `36px`  | `44px`      | Brand / Splash Display                    |
| `Typography.h1RanadeBold`                      | Ranade Bold      | `26px`  | `28px`      | Screen H1 Titles                          |
| `Typography.displayRanadeBold`                 | Ranade Bold      | `20px`  | `25px`      | Card Highlight Headers                    |
| `Typography.h5SemiBold`                        | Poppins SemiBold | `20px`  | `25px`      | Modal Sub-headings                        |
| `Typography.h6Bold`                            | Poppins Bold     | `18px`  | `23px`      | Section Headers                           |
| `Typography.bodyLargePoppinsSemiBold`          | Poppins SemiBold | `16px`  | `24px`      | Primary CTA Button Labels                 |
| `Typography.bodyLargePoppinsRegular`           | Poppins Regular  | `16px`  | `24px`      | Long-form descriptions                    |
| `Typography.bodyMediumPoppinsSemiBold`         | Poppins SemiBold | `14px`  | `20px`      | Card Titles & Primary List Items          |
| `Typography.bodyMediumPoppinsRegular`          | Poppins Regular  | `14px`  | `20px`      | Standard Body Copy & Inputs               |
| `Typography.bodySmallPoppinsRegular`           | Poppins Regular  | `12px`  | `18px`      | Subtitles, Time Stamps, Metadata          |
| `Typography.bodySuperSmallPoppinsRegularLoose` | Poppins Regular  | `11px`  | `16.5px`    | Tab Bar Labels, Metric Tags               |
| `Badge Text (sm)`                              | Poppins Bold     | `8.5px` | `12px`      | Small 3D Badges (Letter-spacing `0.5px`)  |
| `Badge Text (md)`                              | Poppins Bold     | `9.5px` | `13px`      | Medium 3D Badges (Letter-spacing `0.8px`) |
| `Badge Text (lg)`                              | Poppins Bold     | `11px`  | `15px`      | Large 3D Badges (Letter-spacing `0.9px`)  |

---

## 4. Reusable Component Patterns

### 4.1 Signature 3D Tactile Badges (`src/Common/Badge.tsx`)

**The Upper Layer Principle**: In Regius, a badge represents the highest z-elevation layer on any surface. Badges behave as elevated physical chips/stickers floating above cards with tactile depth, ambient light bounce, and tangible weight. **Never render flat, borderless tags.**

```tsx
import { Badge } from '../Common/Badge';

<Badge label="IN PROGRESS" variant="yellow" size="sm" />
<Badge label="COMPLETED" variant="green" size="md" />
<Badge label="HIGH FOCUS" variant="purple" size="lg" />
```

#### 4.1.1 Universal 3D Pro Badge (`src/Common/ProBadge.tsx`)

The singular, unified Pro user indicator across the entire Regius application:

- **Geometry**: Tactile 3D full pill (`borderRadius: 14` for `sm`, `16` for `md`, `20` for `lg`).
- **Icon**: Crown icon from `lucide-react-native` (`<Crown color="#B47804" fill="#F5C518" strokeWidth={2.4} />`).
- **Surface**: Warm imperial gold tint (`#FFF8D0`) with specular light rim (`borderWidth: 1`, `borderColor: '#FFFFFF'`) and extruded 3D bottom bevel (`borderBottomWidth: 2.2`, `borderBottomColor: '#DEAA14'`).
- **Drop Shadow**: Gold ambient glow (`shadowColor: '#D97706'`, `shadowOffset: { width: 0, height: 2 }`, `shadowOpacity: 0.25`, `shadowRadius: 3.5`, `elevation: 3`).
- **Typography**: Poppins Bold uppercase `'PRO'` (`#B47804`, letter-spacing `0.8px`).

```tsx
import { ProBadge } from '../Common/ProBadge';

<ProBadge size="sm" />;
```

#### 4.1.2 Universal 3D Streak Badge (`src/Common/StreakBadge.tsx`)

The singular, unified streak indicator across all cards in the Regius application (e.g., `HabitItemCard`, `TimelineItemCard`, etc.):

- **Geometry**: Tactile 3D full pill (`borderRadius: 20` for `sm`/`md`, `24` for `lg`).
- **Icon**: Flame icon from `lucide-react-native` (`<Flame size={10.5} color={isActive ? '#E65100' : '#8E8E93'} strokeWidth={2.4} />`).
- **Surface**: Warm peach/amber fire tint (`#FFF0DE`) with specular light rim (`borderWidth: 1`, `borderColor: '#FFFFFF'`) and extruded 3D bottom bevel (`borderBottomWidth: 2`, `borderBottomColor: '#FFB86B'`). When streak is 0 and inactive, cleanly falls back to neutral surface (`#FFFFFF`) with silver-sand bevel (`#D5D0C5`) and muted text/flame (`#8E8E93`).
- **Drop Shadow**: Warm fire ambient glow (`shadowColor: '#FF9800'`, `shadowOffset: { width: 0, height: 2 }`, `shadowOpacity: 0.22`, `shadowRadius: 3`, `elevation: 2.5`).
- **Typography**: Poppins Bold uppercase typographic stamping (e.g., `'18D STREAK'`) at `8.5px` (`sm`), `9.5px` (`md`), `11px` (`lg`) with `letterSpacing: 0.5px`.

```tsx
import { StreakBadge } from '../Common/StreakBadge';

<StreakBadge
  streak={habit.streak}
  active={habit.completed || habit.streak > 0}
  size="sm"
/>;
```

### 4.2 Reusable Regius Brand Wordmark (`src/Common/RegiusLogo.tsx`)

A distinctive, polished typographic wordmark preserving the artisanal luxury identity:

- **Font**: `Transcity` (`Transcity Demo.otf` / `Fonts.transcity`) luxury display serif with precision optical letter spacing.
- **Sizes**: `'sm'` (17px), `'md'` (22px, default for headers), `'lg'` (28px), `'xl'` (36px, splash display).
- **Variants**: `'default'` (`#1B1C19`), `'dark'` (`Colors.MidnightCharcoal`), `'light'` (`#FFFFFF`), `'gold'` (`#B38F48`), `'muted'` (`Colors.SlateGraphiteText`).

```tsx
import { RegiusLogo } from '../Common/RegiusLogo';

<RegiusLogo size="md" variant="default" />;
```

#### Anatomy of a 3D Badge:

1. **Full Pill Geometry**: `borderRadius: 20` (`sm`/`md`) or `24` (`lg`).
2. **Top Specular Light Rim**: `borderWidth: 1`, `borderColor: '#FFFFFF'` simulating top-down ambient light bounce.
3. **Extruded 3D Bottom Bevel**: `borderBottomWidth: 2` to `2.8` with a deeper, saturated bottom border tone representing physical extrusion.
4. **Dynamic Ambient Elevation**: Colored drop shadow matching the category tint (`shadowOffset: { width: 0, height: 2 - 3 }`, `shadowOpacity: 0.22`, `shadowRadius: 3 - 4.5`, `elevation: 2.5 - 4`).
5. **Bold Typographic Stamping**: `Fonts.poppins.bold`, letter-spaced (`0.5` - `0.9px`), uppercase by default.

#### 3D Badge Color Tokens:

| Variant              | Bg Tint   | Specular Rim | 3D Bottom Bevel | Text Color | Glow Shadow |
| :------------------- | :-------- | :----------- | :-------------- | :--------- | :---------- |
| `purple` / `primary` | `#EEF0FD` | `#FFFFFF`    | `#B6BEF5`       | `#8383D6`  | `#8383D6`   |
| `yellow` / `alert`   | `#FFF8D0` | `#FFFFFF`    | `#DEAA14`       | `#B47804`  | `#D97706`   |
| `green` / `success`  | `#E8FDF0` | `#FFFFFF`    | `#82E8A6`       | `#1B9A72`  | `#52D22E`   |
| `orange` / `events`  | `#FFF0DE` | `#FFFFFF`    | `#FFB86B`       | `#E65100`  | `#FF9800`   |
| `red` / `danger`     | `#FEEFEF` | `#FFFFFF`    | `#FFA8A8`       | `#D92A0F`  | `#FF3B30`   |
| `neutral`            | `#FFFFFF` | `#FFFFFF`    | `#D5D0C5`       | `#1F2228`  | `#1F2228`   |

---

### 4.2 Buttons (`src/Common/CustomButton.tsx`)

Primary buttons follow full-pill geometry (`borderRadius: 28`) and tactile debounce.

- **Primary / Dark Button**:
  - `backgroundColor: Colors.ButtonDark` (`#242424`)
  - `paddingHorizontal: 24`, `paddingVertical: 16`
  - Text: `PureWhiteText` (`#FFFFFF`), `Fonts.poppins.semiBold`, `fontSize: 16`
  - Optional left icon slot (e.g. ShoppingCart, Sparkles, Plus).
- **Outlined Button**:
  - `backgroundColor: 'transparent'`, `borderWidth: 1.5`, `borderColor: '#242424'`
  - Text: `MidnightInkText` (`#000000`).
- **Social Buttons**:
  - `google`: `backgroundColor: '#EEEEED'`, text `#000000` with official multi-color SVG Google logo.
  - `apple`: `backgroundColor: '#000000'`, text `#FFFFFF` with official Apple logo.
- **Sticky Bottom Action Dock Buttons (`src/Common/StickyBottomButton.tsx`)**:
  - Unified component implemented in `src/Common/StickyBottomButton.tsx` and used universally across `ProfileScreen`, `HabitDetailsScreen`, `SubscriptionScreen`, and `LanguageScreen`.
  - Dock: `paddingHorizontal: 20`, `paddingTop: 12`, `paddingBottom: Math.max(insets.bottom, 16)`, `borderTopWidth: 1`, `shadowOffset: { width: 0, height: -4 }`, `shadowRadius: 10`, `elevation: 10`, `zIndex: 20`.
  - Button: full-pill geometry (`borderRadius: 28`), standardized vertical padding rule (`paddingVertical: 15` without fixed height), `alignItems: 'center'`, `justifyContent: 'center'`, `shadowOffset: { width: 0, height: 4 }`, `shadowOpacity: 0.35`, `shadowRadius: 8`, `elevation: 4`.
  - Content: Row with `gap: 8`, icon `size={18}` / `strokeWidth={2.4}`, `fontFamily: Fonts.poppins.bold`, `fontSize: 15`, `letterSpacing: 0.2`, and centered `ActivityIndicator` on loading.

#### 4.2.1 Card-Outline Destructive Button (Detail Screens Standard)

The universal destructive action button standard across `TaskDetailsScreen`, `ReminderDetailsScreen`, and `HabitDetailsScreen`:

- **Surface**: Light mode `#FFFFFF` (elevated clean card); dark mode `#1E2228` (Nero slate dark).
- **Border**: `borderWidth: 1.5`, light `#FECDD3`, dark `#5C2227`.
- **Geometry**: `borderRadius: 18`, `paddingVertical: 13`.
- **Icon & Text**: Lucide `Trash2` `size: 16, strokeWidth: 2.2`, `fontFamily: Fonts.poppins.semiBold`, `fontSize: 13`, `#EF4444`.
- **Drop Shadow**: iOS `shadowColor: '#EF4444'`, `shadowOffset: { width: 0, height: 2 }`, `shadowOpacity: 0.08`, `shadowRadius: 6`, Android `elevation: 2`.
- **Wrapper**: `<View style={styles.deleteSection}>` with `marginTop: 4, marginBottom: 16`.
- **Touch Feedback**: `activeOpacity: 0.85`.

#### 4.2.2 Section Header Action & Navigation Buttons (`src/Common/HeaderActionButton.tsx`)

Used across screens wherever a section header places its title on the left and a CTA or navigation action button on the right (e.g. `Add Category` in `AddTaskModal` / `AddReminderModal`, `Voice Studio` and `Configure` in `SettingsScreen`):

- **Core Anatomy & Design Tokens**:
  - **Outer Pill**: `backgroundColor: '#1E2028'` (dark luxury Nero charcoal), `borderColor: '#363944'`, `borderWidth: 1`, `borderRadius: 20`, `paddingHorizontal: 10`, `paddingVertical: 4.5`, `gap: 6`.
  - **Circular Icon Wrap Disc**: `width: 14, height: 14, borderRadius: 7`, `backgroundColor: 'rgba(245, 197, 24, 0.15)'` (or accent-derived 15% tint aura), `alignItems: 'center'`, `justifyContent: 'center'`.
  - **Centered Icon**: `size: 11, strokeWidth: 3`, matching accent color (`#F5C518` by default).
  - **Typography**: `fontFamily: Fonts.poppins.semiBold`, `fontSize: 10.5`, `color: '#F5C518'`, `letterSpacing: 0.2`.
  - **Directional Icon Flow**:
    - `iconPosition: 'left'` (default) for creation/action triggers (e.g. `+ Add Category`, `🎚️ Configure`).
    - `iconPosition: 'right'` for forward drill-down sub-screen navigations (e.g. `Voice Studio >`).

#### 4.2.2 3D Tactile Swipe Action Duo (`HabitItemCard.tsx`)

Used for revealed swipe-behind actions (Details and Edit) in habit cards:

- **Surface & Geometry**: `backgroundColor: Colors.NeroBlack` (`#1C1D22`), squircle `borderRadius: 18`, twin dimensions `width: 60`, `height: 56`.
- **Specular Top Light Rim**: `borderTopWidth: 1.8`, `borderTopColor: 'rgba(255, 255, 255, 0.45)'` for ambient top light bounce.
- **Lateral Rims & 3D Extruded Bevel**: `borderLeftColor: 'rgba(255, 255, 255, 0.14)'`, `borderRightColor: 'rgba(255, 255, 255, 0.14)'`, `borderBottomWidth: 3.5`, `borderBottomColor: '#0A0B0E'`.
- **Colored Ambient Glow Shadows**:
  - `Details`: Warm amber fire glow (`shadowColor: '#FF9800'`, `shadowOffset: { width: 0, height: 4 }`, `shadowOpacity: 0.38`, `shadowRadius: 7`, `elevation: 6`).
  - `Edit`: Radiant imperial gold glow (`shadowColor: '#F5C518'`, `shadowOffset: { width: 0, height: 4 }`, `shadowOpacity: 0.38`, `shadowRadius: 7`, `elevation: 6`).
- **Luminous Jewel Icon Auras**: `width: 28, height: 28, borderRadius: 14`, `borderWidth: 1.2`, multi-tint backdrop (`0.22` opacity) and glowing border (`0.48` opacity) housing icons with `strokeWidth: 2.6`.
- **Typographic Stamping**: `fontFamily: Fonts.poppins.bold`, `fontSize: 9.5`, warm ivory `#FFFBF0`, uppercase `'DETAILS'` & `'EDIT'` with letter spacing `0.75px`.
- **Micro-Spring Tactile Response**: Spring scale compression to `0.92` on press in, rebounding to `1.0` with `tension: 250, friction: 8`.

---

### 4.3 Signature Asymmetric Category & Bento Cards

Used for Category Carousels in `HomeScreen`, `TasksScreen`, `RemindersScreen`, `PlusActionSheet`, and Bento Metric Cards in `DashboardScreen` (`DailyBalanceGrid.tsx`):

```tsx
// Category Carousel Card (HomeScreen / TasksScreen)
categoryCard: {
  width: 124,
  borderRadius: 23,
  borderTopRightRadius: 63, // Signature exaggerated curve
  padding: 16,
  borderWidth: 2,
  borderColor: 'transparent',
  backgroundColor: cat.bgColor, // e.g. #FFFCEB, #EDFDF5, #EFF2FE
  position: 'relative',
}

// Daily Balance Bento Metric Card (DashboardScreen / DailyBalanceGrid.tsx)
metricCard: {
  flex: 1,
  minWidth: 0,
  borderRadius: 20,
  borderTopRightRadius: 38, // Scaled asymmetric curve
  padding: 13,
  paddingBottom: 15,
  borderWidth: 1.5,
  justifyContent: 'space-between',
  minHeight: 110,
  position: 'relative',
  overflow: 'hidden',
}
```

- **4-Facet Coordinated Ecosystem**:
  1. Soft Pastel Background (`#FFFCEB` Tasks, `#EFF2FE` Habits, `#EDFDF5` Sport/Wellness/Reminders)
  2. Matching Pastel Border (`#FFF5B8`, `#D8DBFF`, `#C6FFDD`)
  3. Elevated Circular White Icon Wrap (`32x32` or `46x46`, `backgroundColor: '#FFFFFF'`, with border & shadow matching category)
  4. Matching Colored Glow Shadow (`shadowColor: #F5C518`, `#8383D6`, `#52D22E`, `elevation: 3`)
- **Circular Progress Percentage Graph**: SVG circular progress ring (`size: 34`, `strokeWidth: 2.8`) with category track background and dynamic arc stroke indicating completion percentage with centered bold percentage text.
- **Bottom Accent Pill**: Centered accent indicator bar (`height: 3.5-4`, `width: 36-48`, `borderTopLeftRadius: 3`, `borderTopRightRadius: 3`, `backgroundColor: cat.accentColor`).

---

### 4.3.1 Signature Luxury Dark Hero Bento Cards (`DailyBriefingCard`, `TaskProductivityBento`, `HabitConsistencyBento`, `ReminderScheduleBento`)

The flagship focal point of each primary screen (`DashboardScreen`, `TasksScreen`, `HabitsScreen`, `RemindersScreen`) is the **Signature Luxury Dark Hero Bento Card**. Every agent modifying or creating a hero card MUST implement this exact 2-layer pattern:

```tsx
// 1. Two-Layer Shadow Wrapper Architecture (Prevents iOS Shadow Clipping with overflow: 'hidden')
<View style={styles.cardShadowWrapper}>
  <View style={styles.card}>
    <CardBackgroundSvg />
    <View style={styles.content}>{/* Hero content */}</View>
  </View>
</View>;

const styles = StyleSheet.create({
  cardShadowWrapper: {
    borderRadius: 24,
    backgroundColor: Colors.NeroBlack,
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.28,
        shadowRadius: 18,
      },
      android: {
        elevation: 8, // or 10
      },
    }),
  },
  card: {
    backgroundColor: Colors.NeroBlack, // #1C1D22
    borderRadius: 24,
    borderWidth: 4, // Mandatory bold luxury specular border
    borderColor: 'rgba(255, 255, 255, 0.9)', // 90% white crisp ceramic rim
    overflow: 'hidden',
    position: 'relative',
  },
});
```

#### Mandatory Hero Card Rules:

1. **Bold 4px Ceramic White Border**: `borderWidth: 4`, `borderColor: 'rgba(255, 255, 255, 0.9)'`. **Never use thin 1px or 1.5px borders on hero cards.**
2. **Deep Volumetric Elevation Shadow**: `shadowOffset: { width: 0, height: 10 }`, `shadowOpacity: 0.28`, `shadowRadius: 18`, `elevation: 8–10`. Never use flat subtle elevation.
3. **Obsidian Surface**: `backgroundColor: Colors.NeroBlack` (`#1C1D22`).
4. **Unified Outer Screen Gutter**: Positioned with `paddingHorizontal: 10` on parent wrapper (`bentoCardWrapper` or `topSectionWrapper`) for symmetrical 10px screen edge spacing across all tabs.
5. **Two-Layer Architecture**: The outer `cardShadowWrapper` handles shadow and elevation (without `overflow: 'hidden'`); the inner `card` handles `overflow: 'hidden'`, background SVGs, and the `4px` border.
6. **Unique Bordered Percentage Badge & Frosted Glass Pills**: Progress is cleanly tracked via the center linear bar indicator, while the percentage metric is housed in a unique squircle frame with dual-layer specular gold borders (`TaskPercentBadge`), paired with frosted glass stat capsules (`glassStatPill` with glowing dots and high-contrast typography).
7. **Weekly Momentum Illuminated Streak Flow (`HabitConsistencyBento.tsx`)**: Replaces generic circular checklist checkmarks with a continuous 7-day streak pipeline:
   - **Filled Days**: Fiery amber/orange gradient flame (`#FFA726` / `#FF9800`) inside a glowing amber-bordered disc (`rgba(255, 152, 0, 0.14)` fill, `#FF9800` shadow).
   - **Unfilled Days**: Clean outline flame (`rgba(255, 255, 255, 0.28)`) inside a deep slate translucent disc.
   - **Today's Focus Node**: Active amber specular border (`#FFA726`, `borderWidth: 1.6`) with elevated glow shadow; automatically illuminates to filled state upon checking in today's rituals.
   - **Illuminated Flow Pipeline Rail**: Continuous horizontal connector rail (`height: ResponsivePixels.size2`) bridging the 7 days; segments between consecutive completed days ignite in radiant `#FF9800` amber gold, visualizing unbroken streak flow.

---

### 4.3.2 Minimal & Unique Segmented Tabs (`TasksScreen.tsx`)

Replacing brutalist black toggles with an artisanal, warm luxury minimal segmented control:

- **Base Track**: Soft ivory/stone pill (`backgroundColor: '#F3EFE6'`, `borderColor: '#E8E2D5'`, `borderWidth: 1`, `borderRadius: 50`).
- **Active Floating Tab**: Pure white card pill (`backgroundColor: '#FFFFFF'`, `shadowColor: '#000000'`, `shadowOffset: { width: 0, height: 2 }`, `shadowOpacity: 0.08`, `shadowRadius: 5`).
- **Tactile Icons**: Left icon (`CheckSquare` for active tasks, `CheckCircle2` for completed).
- **Semantic Micro-Counter Badges**:
  - Active Tasks: Solar gold badge (`backgroundColor: '#FFF4C4'`, `borderColor: '#F5C518'`, text `#B48216`).
  - Active Completed: Fresh mint badge (`backgroundColor: '#E8FDF0'`, `borderColor: '#52D22E'`, text `#1B9A72`).
  - Inactive: Muted stone whisper badge (`rgba(0,0,0,0.05)`).

---

### 4.4 Unified Luxury Item Cards & Curated Flow Architecture

Used for list item cards across `TasksScreen` (`TaskCardItem.tsx`), `RemindersScreen` (`ReminderCardItem.tsx`), `HabitsScreen` (`HabitItemCard.tsx`), and `DashboardScreen` (`TimelineItemCard.tsx`):

- **Signature Inverted Scooped Corner Cutout with Radial Gradient Aura & Starlight Nodes**:
  - **Inverted Top-Right Scoop**: Rather than a standard rounded corner, the top-right corner features an organic concave scoop / cutout (`CW: 44, CH: 44`) with smooth quadratic bezier fillets (`R_outer: 12, R_inner: 14`), rendered dynamically via SVG path (`getCutoutCardPath`).
  - **Radiant Radial Gradient Aura**: Centered under the top-right cutout (`cx={width - 55}, cy=25, r=110`), casting a soft 16% to 0% opacity glow matching the card's theme color.
  - **Celestial Starlight Nodes**: Two micro-sparkle SVG circles (`r=1.6` at `cx={width - 66}, cy=16`, `r=1.3` at `cx={width - 80}, cy=30`) adding subtle luxury craftsmanship.
  - **Base Border Radius**: `18px` on top-left, bottom-left, and bottom-right corners.
- **Harmonized Universal Theme Palettes**:
  - **Tasks (Warm Gold / Yellow)**: Surface `#FFFDF7` / `#FFFCEB` with `#FFF5B8` border (`borderWidth: 1.5`), `#F5C518` gold aura, starlight nodes, and drop shadow glow, yellow 3D `<Badge />`, and `#FFF9D2` time pill (`#B48216` text). Left icon: 36×36 circular container (`#FFFCEB`, border `#FFF5B8`).
  - **Reminders (Fresh Mint / Green)**: Surface `#F5FDF9` / `#EDFDF5` with `#C6FFDD` border (`borderWidth: 1.5`), `#52D22E` green aura, starlight nodes, and drop shadow glow, green 3D `<Badge />`, and `#EDFDF5` time pill (`#1B9A72` text). Left icon: 36×36 circular container (`#EDFDF5`, border `#C6FFDD`). Includes Kokoro TTS speaker button nestled cleanly beside cutout.
  - **Habits (Celestial Lavender / Purple)**: Surface `#F7F8FE` / `#EFF2FE` with `#D8DBFF` border (`borderWidth: 1.5`), `#8383D6` purple aura, starlight nodes, and drop shadow glow, purple 3D `<Badge />`, and `#EFF2FE` time pill (`#7059C8` text). Left icon: 36×36 circular container (`#EFF2FE`, border `#D8DBFF`).
- **Completed State**: Subdued `#FAFAF8` background with `#ECEAE4` hairline border and muted text (`#7E838F`), retaining full typography clarity.
- **Floating Round Checkbox (Top-Right Cutout)**:
  - **Position**: Floats completely in the top-right scooped negative space (`position: 'absolute'`, `top: 9`, `right: 9`, `zIndex: 10`).
  - **Shape & Dimensions**: Pure round circular vessel (`width: 26`, `height: 26`, `borderRadius: 13`).
  - **Tactile Elevation**: Soft floating drop shadow (`shadowColor: '#000000'`, `shadowOffset: { width: 0, height: 2 }`, `shadowOpacity: 0.12`, `shadowRadius: 3`, `elevation: 3`).
  - **Title Padding**: Title container reserves `paddingRight: 40–48` ensuring text never encroaches into the scooped cutout.
  - **Unchecked state**: `backgroundColor: '#FFFFFF'`, `borderWidth: 1.5`, theme-tinted border (`borderColor: theme.border`).
  - **Checked state**: `backgroundColor: '#E8FDF0'`, `borderWidth: 1.5`, `borderColor: '#52D22E'` with `#1B9A72` Check icon (`size: 14, strokeWidth: 3`).
- **Tactile 3D Badges**: Integrated `<Badge />` chips for category stamps, streaks, and voice check-in indicators floating above the card surface.
- **Dark Mode Cutout Card Adaptations**:
  - **SVG Path Surface Fill**: Dynamic fill switches from light category tint to Obsidian card fill `#171A20` with `#2C3035` perimeter hairline stroke.
  - **Floating Checkbox (Top-Right Scoop)**:
    - *Unchecked*: Deep slate surface (`backgroundColor: '#252932'`), border `#3A3F46`.
    - *Checked*: Deep emerald jewel surface (`backgroundColor: '#13281E'`), border `#52D22E` with `#52D22E` Check icon.
  - **Category Indicators**: Top-row 3D badges, icon containers, and radial glowing auras maintain their vibrant category accents (`#F5C518` Works, `#52D22E` Sport/Reminders, `#8383D6` Habits/Mindful, `#FF9800` Events).
  - **Completed Cards**: Fill `#171A20`, stroke `#2C3035`, titles `#8E939E` without strikethrough decoration.
  - **Metadata & Subtask Pills**: Deep slate tags (`backgroundColor: '#252932'`, border `#363944`, text `#A3A8B1`).

#### 4.4.1 Habits Section Sheet & Habit Item Card Architecture (`HabitsScreen.tsx`, `HabitItemCard.tsx`)

- **Habits Section Sheet Surface**:
  - `backgroundColor: SheetSurface` (`#FAF8F5`) with `borderTopLeftRadius: 32, borderTopRightRadius: 32`.
  - Top hairline border (`borderTopWidth: 1.5, borderTopColor: '#ECE7DC'`) and soft upward drop shadow (`shadowOffset: { width: 0, height: -3 }, shadowOpacity: 0.04, shadowRadius: 10, elevation: 2`).
  - Seamless bottom tab dock clearance (`paddingBottom: insets.bottom + 120` inside the sheet wrapper) preventing item clipping under floating tab bars.
  - Section header row with status capsule (`completedDot` + completion count) and full-pill CTA button (`Plus` icon + "New Habit", `backgroundColor: #1F2228`).
- **Habit Item Card Colors & Active vs Completed States**:
  - **Theme**: Unified royal Lavender-Purple (`#F7F8FE` bg, `#D8DBFF` border, `#8383D6` glow shadow, `#8383D6` radial aura, starlight nodes). Consistently preserved across both active and completed states to maintain the Lavender-Purple Habits theme rule.
  - **Category Trios**:
    - **Morning**: Golden Sunrise 3D Badge (`variant: 'yellow'`), `#FFF8D0` time pill (`#B47804`), `Sun` icon (`#B47804` on `#FFF8D0` circular container).
    - **Mindful**: Purple 3D Badge (`variant: 'purple'`), `#EFF2FE` time pill (`#7059C8`), `Sparkles` icon (`#7059C8` on `#EFF2FE` circular container).
    - **Evening**: Orange 3D Badge (`variant: 'orange'`), `#FFF2E6` time pill (`#D95D0F`), `Moon` icon (`#D95D0F` on `#FFF2E6` circular container).
  - **No Strikethrough Typography**: Titles remain 100% visible, bold, and readable without line-through decoration when marked complete (`color: '#7E838F'`).
  - **Floating Circular Checkbox**: Positioned in the top-right cutout notch (26×26, r=13), with `StreakBadge` nestled cleanly beside cutout in `topRowRightWithCutout`.
  - **7-Day Consistency Streak Flow**: Replaces legacy circular dots with a 7-day streak pipeline of tactile Lucide `<Flame />` icons; completed streak days illuminate in Universal Fiery Amber (`#FF9800` fill, `#FFA726`/`#E65100` rim) with spring bounce micro-animation, today's pending state shows an active amber focus outline (`#FF9800`), and incomplete/missed days display a subtle muted outline (`#C8C4B7`).
  - **Horizontal Card Swipe Interaction (Habits Flow)**:
    - Native `PanResponder` driven by `useNativeDriver: true` spring physics (`translateX` translation down to `-138px`).
    - Drag threshold logic (`Math.abs(dx) > 10 && Math.abs(dx) > Math.abs(dy) * 1.5`) preserves buttery vertical scrolling without gesture collision.
    - **Cutout-Safe Vertical Anchor (`top: 58, bottom: 6, maxHeight: 56`)**: Action buttons are anchored strictly below the top-right cutout notch (`CH: 44, R_outer: 12`), ensuring background buttons never peek through or disrupt the signature scooped corner and floating circular checkbox.
    - **Dynamic Reveal Opacity**: `actionsOpacity` interpolates smoothly from `0` to `1` as `translateX` moves from `0` to `-25px`, keeping buttons completely invisible at rest.
    - Reveals right-side action tray with two tactile 3D buttons:
      - **Details Button**: NeroBlack pill (`width: 60`, `borderTopColor: '#4A4E5C'`, `borderBottomWidth: 3`), warm amber circular icon aura with fiery streak flame (`#FF9800` `Flame` icon), and Poppins SemiBold text. Tapping opens `HabitDetailsScreen`.
      - **Edit Button**: NeroBlack pill (`width: 60`), gold circular icon aura (`#F5C518` Pencil icon), and Poppins SemiBold text. Tapping opens `AddHabitModal`.
    - Tap-to-close protection: Tapping an open card snaps it closed back to `0px` without accidentally triggering habit check-in.
  - **Habit Details Screen Architecture (`HabitDetailsScreen.tsx`)**:
    - **Header**: Unified `SubScreenHeader` with back navigation, scroll-reactive elevation, right-side 3D category `<Badge />`, and `<HeaderActionButton label="Edit" />`.
    - **Hero Bento Card**: 2-layer structure conforming to § 4.3 (outer shadow wrapper, inner `NeroBlack` card with 3.5px specular white border, category aura, Ranade editorial title, streamlined fiery amber streak counter, minimized and focused layout without redundant inline buttons).
    - **7-Day Consistency Matrix (Tactile Desk Cupboard Architecture)**: 2-layer luxury Nero Black aesthetic casing (`cupboardShadowWrapper` + `cupboardCard` with 3.5px ceramic specular rim and `CupboardAestheticBg` ambient SVG gradients, amber/category auras, and orbit lines) housing 4 distinct, high-depth beveled porcelain window compartments: top showcase window (`streakWindowBox`) with micro-header and open airy day columns featuring creative day name chips (active 3D Focus Day Chip for today with amber halo, and zero dividing line), and 3 lower cubby boxes (`statCubbyBox`) featuring 3D specular badge discs, Ranade Bold typography with units, miniature progress meters, and official 3D `<Badge />` capsules with Lucide vector icons (`Flame` ACTIVE, `Zap` OPTIMAL, `Repeat` 7/7 DAYS).
    - **Circadian Protocol**: Preferred schedule with category badge, recurrence cadence pill, and ritual domain.
    - **Sia Neural Motivation**: Assistant vocal guidance preview card with interactive Kokoro-82M TTS audio playback, waveform indicator, and haptic feedback.
    - **Mindful Intention**: Editorial philosophy quote card with dual light/dark mode adaptation.
    - **Sticky Action Dock**: Bottom dock with full-width primary tactile check-in button calibrated to standard 44-48pt luxury button height with Poppins SemiBold typography.
    - **Design System Tokens & Geometry**: Strictly scaled using calibrated `ResponsivePixels` tokens across all dimensions, margins, paddings, and border radiuses.

---

### 4.5 Dynamic Scroll-Reactive Layer Header (`src/Common/ScreenHeader.tsx`, `src/Common/SubScreenHeader.tsx`, `src/Common/useScrollReactiveHeader.ts`)

Regius employs a signature dual-tier luxury header architecture where scrolling elevates the header from a seamless canvas into a distinct floating brand layer:

1. **Primary Screen Header (`ScreenHeader.tsx`)**:

   - Used across main bottom-tab screens (`DashboardScreen`, `TasksScreen`, `HabitsScreen`, `RemindersScreen`).
   - Left: High-emphasis Ranade H1 screen title (`Typography.h1RanadeBold`, 24px) + Poppins subtitle.
   - Right: Voice Holograph Orb assistant button + User Avatar Ring (`SVGS.RegiusAvatar`).

2. **Sub-Screen Header (`SubScreenHeader.tsx`)**:
   - Used across secondary & settings detail screens (`VoiceStudioScreen`, `WakeWordStudioScreen`, `PrivacySecurityScreen`, `LanguageScreen`, `HelpFaqScreen`, `ProfileScreen`, `SubscriptionScreen`, `ThemeScreen`).
   - Driven by `useScrollReactiveHeader()` hook for threshold scroll offsets.
   - Left: Tactile `<BackButton />` in pill geometry (`44x44`, `borderRadius: 22`).
   - Center: Ranade Bold (18px) title with Poppins Regular (11px) subtitle or bespoke status pill.
   - Right: Contextual 3D semantic `<Badge />`, `<ProBadge />`, or functional action button.
   - Supports both `isAbsolute: true` (transparent under-scroll canvas bleed) and `isAbsolute: false` (in-flow relative positioning).

- **Unscrolled Initial State (`scrollY <= 15px`)**:

  - **Surface Canvas**: Merges seamlessly with the soft cream background (`#FBF9F3` / `CreamBackground`).
  - **Corner Geometry**: Flush square corners (`borderBottomLeftRadius: 0`, `borderBottomRightRadius: 0`).
  - **Elevation / Shadow**: Completely flat (`shadowOpacity: 0`, `elevation: 0`).
  - **Status Bar**: `dark-content` for optimal legibility against the cream canvas.
  - **Brand Wordmark**: Dark `#1B1C19` via `<RegiusLogo size="md" variant="default" />`.
  - **Action Controls**: Voice button with ambient purple tint (`rgba(131, 131, 214, 0.12)`); Settings gear in white circular card (`#FFFFFF`) with hairline border (`#ECE8DF`); User avatar with signature `Colors.RingBorder` (`#E8E2D5`).

- **Scrolled Floating Layer State (`scrollY > 15px`)**:
  - **Layer Surface**: Theme primary brand color `LavenderPurple` (`#8383D6`), smoothly animated via `Animated.event` (0 to 30px interpolation).
  - **Dynamic Bottom Padding Cushion**: Smoothly interpolates `paddingBottom` from `0` to `8px` (`headerPaddingBottom`), keeping a snug, balanced vertical cushion between the controls and the rounded bottom lip so the elements feel compact and refined.
  - **3D Layer Shadow**: Rich midnight-violet 3D bottom drop shadow (`shadowColor: '#201646'`, `shadowOffset: { width: 0, height: 6 }`, `shadowRadius: 7`, `shadowOpacity: 0.32`, `elevation: 8`) casting downward depth to give the header a tactile 3D floating layer feel as items scroll underneath.
  - **Status Bar**: Smoothly toggles to `light-content` to preserve crisp white status indicators (time, battery, signal) over the purple header.
  - **Unique Logotype Architecture (`RegiusLogo.tsx`)**:
    - **Architectural Crown Crest**: Bespoke 3-pillar royal crown vector icon featuring faceted angular wings, an inner negative-space diamond core, a solid foundation base bar, and a radiant star jewel tip (`#F5C518` gold / `#8383D6` purple / `#FFFFFF` white).
    - **Stylized Wordmark**: `Transcity` luxury display serif (`Fonts.transcity`) with precision letter-spacing (`0.6` to `0.8`).
    - **Radiant Star Sparkle**: A 4-point geometric diamond sparkle (`✦`) accent positioned at the upper-right of the wordmark.
    - **Adaptive Color Switching**: Seamlessly transitions from Obsidian Black (`#1B1C19`) to Pure White (`#FFFFFF`) on scroll.
  - **Adaptive Contrast & Color Preservation**:
    - **Voice Button**: Elevated crisp white circular surface (`#FFFFFF`) preserving its signature `#7059C8` mic icon and soft lavender glow.
    - **Settings Button**: Elevated crisp white circular surface (`#FFFFFF`) maintaining its dark `#1B1C19` gear icon.
    - **Avatar Ring**: Adapts to a crisp white outline (`#FFFFFF`, `borderWidth: 2`) framing the avatar illustration against the purple background.
  - **Z-Index Layer Hierarchy**: Rendered as a fixed absolute layer (`position: 'absolute', top: 0, left: 0, right: 0, zIndex: 100`) with safe-area top inset padding, allowing list items to glide beneath the rounded bottom lip.

---

### 4.6 Floating Curved Tab Bar & Action Dock (`src/Navigators/BottomTabNavigator.tsx`, `BottomTabPatternSvg.tsx`)

- **Visual Shape**: Custom SVG bezier curve path with an inverted center notch (`CORNER_R: 34`, `NOTCH_W: 40`, `NOTCH_DEEP: 24`).
- **Bar Surface & Aesthetic Background (`BottomTabPatternSvg.tsx`)**:
  - Masked precisely to the curved notch path via `<ClipPath id="curvedBarClip">`.
  - Base Rich Velvet Lavender Gradient (`#9494EC` → `#8383D6` → `#6C6CC4`).
  - Radiant Center Dawn Halo under floating FAB notch (`#FFFCE3` / `#F5C518` ambient illumination).
  - Left celestial violet aura (`#B2B2FF`) & right warm gold dawn aura (`#F5C518`).
  - Left & right concentric acoustic orbital rings (`r=16`, dashed `r=28`, `r=44`).
  - Notch acoustic echo arcs propagating downward beneath the floating action button.
  - Curated flowing harmonic waves stretching across the dock width.
  - Top polished chamfer light rim lines following the upper edge.
  - Golden 4-point diamond sparkle stars and celestial starlight micro-dots.
  - Crisp `4px` `CreamBackground` (`#FFFCE3`) outer border outline on top layer.
- **Tab Items & Labels**:
  - Sliding Indicator: A single animated black pill (`Colors.DefaultBlack`, `width: 66`, `height: 50`, `borderRadius: 16`) with `FocusedTabPatternSvg` rendered behind the tab items that smoothly glides along the bar (`translateX`) to the newly selected tab.
  - Focused State: Enclosed over the sliding black container pill with `PureWhiteText` (`#FFFFFF`) icon (strokeWidth `2.4`) and centered bold label.
  - Inactive State: Transparent background with translucent white icon (`rgba(255, 255, 255, 0.65)`, strokeWidth `1.7`) and medium label (`rgba(255, 255, 255, 0.7)`).
- **Center Floating FAB Button (`PlusButtonPatternSvg.tsx`)**:
  - Size: `54x54` circle with multi-tone royal lavender gradient (`#A2A2F8` → `#8A8AE6` → `#7171CE` → `#5656B2`).
  - Luminous golden dawn core glow (`#FFFCE3` / `#F5C518`), domed sapphire lens gloss highlight, concentric acoustic precision orbital tracks, cardinal ticks, and 4 Regius signature diagonal diamond stars (`PlusButtonPatternSvg.tsx`).
  - Outer Halo: `62x62` circle in `CreamBackground` (`#FFFCE3`) with beveled 1.5px border (`borderTopColor: #FFFFFF`, `borderBottomColor: #D8D1C0`).
  - Shadow: Deep purple drop shadow (`shadowColor: #8383D6`, opacity `0.45`, radius `12`, elevation `16`).
  - Animated Rotation: Springs from `0°` (plus icon) to `135°` (cross icon) when `PlusActionSheet` opens, rotating the inner starbursts and micro-tracks smoothly.
  - Interaction: Tap opens `PlusActionSheet`; **Long press (320ms) triggers Voice Assistant immediately**.

---

### 4.7 Quick Action Sheet (`src/Navigators/PlusActionSheet.tsx`)

- **Placement & Motion**: Floats right above the center dock with a subtle pointer notch pointing down toward the plus/cross button, backed by a soft dim backdrop (`rgba(18, 20, 23, 0.42)`). Features a silky-smooth entrance spring animation (`tension: 85, friction: 9`).
- **Signature 2-Layer Shadow Wrapper**: Outer wrapper provides volumetric luxury drop shadow (`shadowColor: '#121417', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.18, shadowRadius: 20, elevation: 16`) encasing an inner clipped card (`borderRadius: 26, borderWidth: 1.5, borderColor: '#E8E2D5'`).
- **Pristine Luxury Background (`SheetBackgroundAestheticSvg`)**: Clean warm ivory canvas with delicate concentric champagne celestial guilloché arcs, perimeter registration frame, and micro-sparkles.
- **Header with Right Tag**: Left-aligned 3D `QUICK CREATE` badge paired with an elegant right-aligned `INSTANT` tag with gold sparkle.
- **3 Responsive Action Cards (158px Compact Height)**:
  1. **Add Task**: `#EFF2FE`, border `#D8DBFF`, lavender accent `#8383D6`, `TO-DO` 3D badge.
  2. **Reminder**: `#FFFCEB`, border `#FFF5B8`, amber accent `#D97706`, `ALERT` 3D badge.
  3. **Habit**: `#EDFDF5`, border `#C6FFDD`, emerald accent `#2E7D32`, `RITUAL` 3D badge.
  - Formatted at compact `height: 158` with snug vertical spacing, zero awkward dead voids, and complete copy readability.

---

### 4.8 Curated Flow Section Background (`FlowSectionBackgroundSvg.tsx`)

Dynamic container background for the timeline list in `DashboardScreen.tsx`:

- **Dynamic Layout & 1:1 Pixel Coordinate Space**: Automatically measures its container bounds via `onLayout` (`handleLayout`), rendering `<Svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} fill="none">`. This eliminates vertical stretching and ensures all circles, starbursts, and acoustic arcs remain 100% distortion-free at any height (from 250px up to 1500px+).
- **Surface & Base Sheen**: Multi-layer warm cream gradient (`#FFFDF7` → `#FAF6ED` → `#F5EFE3` → `#EDE5D6`) matching the light canvas.
- **Circular Ambient Auras (`userSpaceOnUse`)**:
  - Top-center circular golden dawn halo (`cx=W/2, cy=0, r=160`) focused beneath the floating obsidian crest badge.
  - Top-right velvet lavender aura (`cx=W-10, cy=40, r=130`).
  - Top-left golden accent aura (`cx=10, cy=40, r=110`).
  - Bottom-left emerald/mint productivity aura (`cx=20, cy=H-40, r=120`).
  - Bottom-right sunset peach aura (`cx=W-20, cy=H-40, r=120`).
- **Acoustic Ripples & Line Art (Fixed Pixel Radii)**:
  - 4 concentric true circular ripples radiating beneath the crest badge (`r=46`, dashed `r=78`, `r=116`, dashed `r=160`).
  - Top and bottom flank wave ribbons and vertical dashed timeline micro-guides adapting to container height.
  - Symmetrical 4-point diamond starbursts (`star(x, y, s)`) and stardust points framing the timeline without clipping or distortion.
  - Adaptive inner beveled highlight rim (`width=W-2, height=H-2, rx=23`).

---

### 4.9 Tactile Floating Toast & System Notifications (`src/Common/ToastConfig.tsx`, `ToastAestheticPatternSvg.tsx`)

Regius notifications operate as high-contrast floating 3D cards engineered to maintain maximum legibility against any background, including colored scroller headers (e.g. `Colors.LavenderPurple` `#8383D6` or `#282048`):

- **Category-Harmonized Gradient Surfaces**:
  - **`success`**: Soft emerald-mint gradient (`#F0FDF5` → `#E6FAF0` → `#DCFCE7`), border `#A7F3D0` with 3D bottom bevel `#34D399` (`#0F241A` → `#142E22` in dark mode).
  - **`warning`**: Solar honey-gold gradient (`#FFFDF2` → `#FFF8D0` → `#FEF08A`), border `#FDE047` with 3D bottom bevel `#DEAA14` (`#2A1F08` → `#33270B` in dark mode).
  - **`error`**: Delicate rose-coral gradient (`#FFF1F2` → `#FEEFEF` → `#FECDD3`), border `#FECACA` with 3D bottom bevel `#F87171` (`#2D1013` → `#3A1519` in dark mode).
  - **`info`**: Royal lavender-periwinkle gradient (`#F4F5FE` → `#EEF0FD` → `#E2E5FC`), border `#C7D2FE` with 3D bottom bevel `#8383D6` (`#18162E` → `#201D3D` in dark mode).
- **Aesthetic SVG Watermark Pattern (`ToastAestheticPatternSvg.tsx`)**:
  - **Concentric Acoustic Orbital Rings**: Radiating soundwave ripples behind the icon seal (`r=18`, dashed `r=32`, `r=48`).
  - **Harmonic Flow Waves**: Smooth bezier acoustic sound ribbons traversing across the card.
  - **Regius Signature 4-Pointed Gold Diamond Starbursts (`✦`)**: Imperial gold starbursts (`M 0 -4.5 Q 0 0 4.5 0 Q 0 0 0 4.5 Q 0 0 -4.5 0 Q 0 0 0 -4.5 Z`) with central stardust core points in the corners.
  - **Top Specular Light Rim**: Subtle light chamfer along the upper edge.
- **3D Tactile Icon Seal**: Circular `38x38` extruded badge with specular border (`borderWidth: 1.2`, `borderBottomWidth: 2.4`) and saturated category bevel.
- **Dynamic Safe Area Offset**: `topOffset` dynamically computed via `useSafeAreaInsets()` (`Math.max(insets.top + 8, 54)` on iOS) to float cleanly beneath the Dynamic Island and camera notch.
- **Adaptive Typography & Frosted Dismiss Capsule**:
  - Deep high-contrast title (`Fonts.poppins.bold`, 13.5px) and secondary copy (`Fonts.poppins.medium`, 12px) with auto-centering for single-string toasts.
  - Frosted circular dismiss capsule (`26x26`, `rgba(0, 0, 0, 0.05)` light / `rgba(255, 255, 255, 0.12)` dark) with `X` icon.

---

### 4.10 Mindful Luxury Authentication Architecture (`src/Screens/Login/LoginScreen.tsx`, `LoginAestheticBackgroundSvg.tsx`)

The authentication screen provides an artisanal, warm luxury gateway to Regius:

1. **Atmospheric Canvas & Aesthetic Background (`LoginAestheticBackgroundSvg.tsx`)**:
   - Full-bleed responsive background combining organic header waves with a central radiant golden dawn crest halo (`#FFFCE3` / `#F5C518`), concentric acoustic resonance ripples, and flanking glowing auras (`#8383D6` lavender and `#52D22E` mint).
   - Precision 4-point gold and lavender celestial diamond stars (`✦`) and micro-starlight points framing the screen.
2. **3D Volumetric Drop Shadows & Tactile Extrusions**:
   - **Regius Crown Crest**: Elevated with a floating drop shadow wrapper (`shadowColor: '#8383D6'`, `shadowOffset: { width: 0, height: 8 }`, `shadowOpacity: 0.28`, `shadowRadius: 16`, `elevation: 8`).
   - **Two-Layer Form Card Architecture**: Outer `formCardShadowWrapper` (`shadowColor: '#121417'`, `shadowOffset: { width: 0, height: 14 }`, `shadowOpacity: 0.1`, `shadowRadius: 24`, `elevation: 8`) enclosing the inner card with specular top rim (`borderTopWidth: 1.5`, `borderTopColor: '#FFFFFF'`) and extruded 3D bottom bevel (`borderBottomWidth: 4`, `borderBottomColor: '#E2DCD0'` light / `#16191F` dark).
   - **Segmented Mode Switcher Pill**: Outer track with inset bottom depth (`borderBottomWidth: 3`, `borderBottomColor: '#DFD9CB'`) and 3D floating active white pill with specular rim and bottom bevel.
   - **Recessed Input Fields**: Inset 3D depth (`borderBottomWidth: 2.2`) with dynamic ambient lavender glow shadow on focus.
   - **Primary CTA Button**: 3D extruded pill with specular top rim (`borderTopWidth: 1.2`), extruded bottom bevel (`borderBottomWidth: 4`), and volumetric drop shadow (`shadowOffset: { width: 0, height: 6 }`, `shadowOpacity: 0.35`, `shadowRadius: 14`, `elevation: 7`).
   - **Social Logins**: 3D tactile buttons with specular top edge, extruded 3D bottom bevel (`borderBottomWidth: 2.8`), and tactile drop shadow.

---

### 4.11 Splash Screen 3D Touch & Artisanal Vector Canvas (`src/Screens/Splash/Splash.tsx`, `SplashAestheticBackgroundSvg.tsx`)

1. **Artisanal Vector Background (`SplashAestheticBackgroundSvg.tsx`)**:
   - Concentric acoustic resonance orbital rings (`r=98`, dashed `r=138`, `r=185`, dashed `r=235`) centered precisely behind the avatar vessel.
   - Radiant golden dawn core halo (`#FFFCE3` / `#F5C518`), diagonal velvet lavender aura (`#8383D6`), and fresh mint aura (`#52D22E`).
   - Flowing harmonic wave ribbons and signature Regius 4-point celestial diamond stars (`✦`) with micro-starlight points.
2. **Two-Layer Avatar Vessel & 3D Tactile Badges**:
   - Outer `avatarShadowWrapper` providing volumetric 3D drop shadow (`shadowOffset: { width: 0, height: 16 }`, `shadowOpacity: 0.18`, `shadowRadius: 26`, `elevation: 14`).
   - Inner vessel with specular highlight rim (`borderWidth: 3.5`, `borderColor: '#FFFFFF'`) and extruded 3D bottom bevel (`borderBottomWidth: 5`, `borderBottomColor: '#DED6C7'`).
   - Floating Heart and Picture badges upgraded into signature 3D tactile badges with category specular rims, extruded 3D bottom bevels (`borderBottomWidth: 3`), and saturated drop shadow glows (`#52D22E` and `#8383D6`).
   - Tagline enclosed in an elegant 3D frosted micro-capsule with specular border and ambient elevation.

---

### 4.12 Intro Screen Artisanal Canvas & 3D Interactive Controls (`src/Screens/Intro/Intro.tsx`, `IntroAestheticBackgroundSvg.tsx`)

1. **Dynamic Atmospheric Background (`IntroAestheticBackgroundSvg.tsx`)**:
   - Background adapts dynamically to the active step's accent color (`#F5C518` Tasks, `#52D22E` Reminders, `#8383D6` Habits).
   - Radiates concentric acoustic resonance rings behind the lower dock and guilloché wave ribbons across the card area.
   - Regius signature 4-point diamond celestial stars and micro-sparkles.
2. **3D Touch & Volumetric Controls**:
   - **Content Pedestal**: Slide content grounded in an elevated translucent bento card with volumetric drop shadow, specular top edge, and category-accented bottom bevel.
   - **Tactile 3D Step Indicators**: Active indicator pill with category glow shadow (`shadowOffset: { width: 0, height: 2 }`, `shadowOpacity: 0.45`, `shadowRadius: 5`, `elevation: 4`) and specular top reflection.
   - **"Get Started" Button**: Volumetric 3D drop shadow (`shadowOffset: { width: 0, height: 10 }`, `shadowOpacity: 0.38`, `shadowRadius: 18`, `elevation: 10`), specular top rim (`borderTopWidth: 1.5`), and extruded 3D bottom bevel (`borderBottomWidth: 4`, `borderBottomColor: '#0E1013'`).
   - **Skip Button**: Upgraded to a 3D tactile micro-pill with beveled bottom border and subtle floating shadow.

---

## 5. Voice Assistant UI Specification (`VoiceAssistantSheet.tsx`)

The voice assistant presents as an immersive bottom-anchored modal sheet with rich visual and motion feedback:

```text
┌──────────────────────────────────────────────────┐
│  [Close ✕]          Sia           [Voice Studio] │
│                                                  │
│             ╭──────────────────────╮             │
│             │   Holographic Orb    │             │
│             │  (Lottie Animation)  │             │
│             ╰──────────────────────╯             │
│                                                  │
│       "Hey there! What can I help you with?"     │
│                                                  │
│     ┌──────────────────────────────────────┐     │
│     │  Live Transcript / Spoken Feedback   │     │
│     │  "Schedule sprint review at 3 PM..." │     │
│     └──────────────────────────────────────┘     │
│                                                  │
│  [Context Suggestions: "Add Task", "Habits"]     │
│                                                  │
│  [Interrupt]         [ 🎙️ ]           [Close]    │
└──────────────────────────────────────────────────┘
```

### 5.1 Central Holographic Orb (`SiaHolographicOrb.tsx`)

- **Asset**: Lottie JSON vector animation (`src/Assets/JsonAnimations/Holograph.json`).
- **Sizing**: Default size `min(screenWidth * 1.2, screenHeight * 0.5, 480px)` for high visual impact.
- **State-Synchronized Lottie Speed**:
  - `listening`: `1.35x`
  - `processing` / `generatingResponse`: `1.55x`
  - `speaking`: `1.25x`
  - `success`: `0.9x`
  - `error`: `0.6x`
- **Atmospheric Aura**: Luminous breathing pulse animation (`scale: 1.0` to `1.04`, `glow: 0.4` to `0.55`, duration `1200ms`) with reduced-motion fallback.

### 5.2 Assistant Surface States

1. **Wake Word Detected / Greeting**: Orb breathes rapidly, greeting text displayed (`Typography.h1RanadeBold`), Kokoro speech plays.
2. **Listening**: Pulsing microphone ring, live streaming STT transcript chip (`LiveTranscript.tsx`).
3. **Processing**: Orb accelerates, live transcript converted to thinking indicator.
4. **Action Confirmation**: Card displays confirmed title and body with tactile category badge (`ActionConfirmation.tsx`).
5. **Awaiting Clarification**: Highlighted follow-up question badge with contextual quick-reply suggestion chips.
6. **Error / Recovery**: Friendly error message with retry and microphone reactivation buttons (`ErrorRecovery.tsx`).

### 5.3 Celestial Acoustic Doodles & Neural Atmosphere (`VoiceAcousticDoodleSvg.tsx`)

- **Artisanal Neural Layer**: Full-fidelity vector doodle backdrop encircling the orb.
- **Components**:
  - Cosmic dashed acoustic resonance orbits (`strokeDasharray="4 6"`).
  - Sonic reverberation wave ripples (`)))` and `(((`) radiating outward.
  - Regius signature 4-point diamond celestial stars in 24K Gold (`#F5C518`), Lavender (`#8383D6`), Mint (`#10B981`), and Coral (`#FF8772`).
  - Hand-drawn acoustic music note chime doodle (`♫`).
  - Imperial Regius micro-crown doodle of luxury and triumph.
  - Electric ambition lightning bolt and playful flourish loop-de-loop.
  - Warm luminous radial aura background glow adapting to Light/Dark modes.

### 5.4 Dynamic Acoustic Waveform Bar Visualizer (`VoiceWaveVisualizer.tsx`)

- **Interactive Vitality**: 5 vertical pill bars dynamically bouncing with staggered sin-wave animations during `listening` and `speaking` states.
- **Harmonized Color Spectrum**: Staggered with Regius category brand palette (`#8383D6` Lavender, `#F5C518` Gold, `#FF8772` Coral, `#10B981` Mint).

### 5.5 Luxury Tactile Bento Capsule Card (`ConversationSurface.tsx`)

- **Card Architecture**: Frosted elevated surface with `borderRadius: 22`, warm perimeter border, and volumetric drop shadow.
- **Fixed Viewport Architecture**: Zero scroll requirement; holograph orb and conversation capsule are rendered in a fixed non-scrolling body with reduced vertical margin (`marginBottom: -40px` on orb container), ensuring all speech content and instructions fit cleanly on screen without clipping above the dock.
- **Signature 3D Tactile State Badge**: Elevated floating chip from `<Badge />` indicating live assistant state (`LISTENING • SPEAK NOW`, `SIA IS THINKING`, `SIA IS SPEAKING`, `ACTION CONFIRMED`).
- **Category-Themed Suggestion Chips**: 3D tactile pills categorized by Works/Yellow, Reminders/Mint, Habits/Lavender, and Focus/Orange with micro-icons and extruded bevels.

### 5.6 Dual-Shockwave Pulsing Microphone Dock (`VoiceInputControls.tsx`)

- **Double Concentric Rings**: Outer and inner pulsing shockwave auras with staggered phase delays.
- **3D Tactile Geometry**: Specular highlight top rim, extruded 4px bottom bevel, and rich colored ambient drop shadow.

---

## 6. Spacing Scale, Safe Areas & Elevation

### 6.1 Spacing Scale

- `xs`: `4px`
- `sm`: `8px`
- `md`: `16px`
- `lg`: `24px`
- `xl`: `32px`
- `xxl`: `48px`

### 6.2 Screen Margins & Safe Areas

- **Horizontal Screen Padding**: `20px` (or `ResponsivePixels.size20`).
- **Safe Area Insets**: All top-level screens wrap in `SafeAreaView` (`edges={['top']}`) or consume `useSafeAreaInsets()`.
- **Bottom Tab Floating Offset**: Navigators reserve `totalH = BAR_H (64px) + BTN_FLOAT (22px) + safeInsets.bottom + 4px` to ensure screen content is never clipped behind the floating tab bar.

### 6.3 Border Radius Tokens

- `Small`: `6px` (Custom checkboxes)
- `Medium`: `14px` - `18px` (Task and reminder cards)
- `Large`: `23px` (Asymmetric card base)
- `Exaggerated Curve`: `63px` (Asymmetric card top-right corner)
- `Full Pill`: `28px` - `50px` (Buttons, badges, dock caps)

---

## 7. Motion & Animation Standards

1. **Spring Configurations**:
   - Tab Indicator Glide: `friction: 14`, `tension: 140`
   - Tab Tap Feedback: `friction: 6`, `tension: 260`
   - Plus Button Scale: `friction: 4`, `tension: 250`
   - Plus Button Rotation: `friction: 6`, `tension: 180` (`0°` to `135°`)
   - Modal Sheet Slide: `friction: 9`, `tension: 65`
2. **Native Driver Enforcement**: All transform and opacity animations **must** specify `useNativeDriver: true`.
3. **Reduced Motion Compliance**: Whenever `AccessibilityInfo.isReduceMotionEnabled()` returns `true`, disable looping pulses and reduce transition durations to 0ms.

---

## 8. Screen Construction Guidelines for Engineers & Agents

When creating a new screen in Regius:

1. **Background**: Always default to `Colors.CreamBackground` (`#FFFCE3`) in light mode and `Colors.DarkBackground` (`#121417`) in dark mode. Never use `#FFFFFF`.
2. **Typography**: Use `Fonts.ranade.bold` for screen titles (`h1RanadeBold`); use `Fonts.poppins` for all subtitles, labels, and body text.
3. **Badges**: Import and use `<Badge />` from `src/Common/Badge.tsx`. Do not write custom inline tag views.
4. **Buttons**: Use `<CustomButton />` from `src/Common/CustomButton.tsx` or apply full-pill geometry (`borderRadius: 28+`).
5. **Cards**: Adhere to either the Signature Asymmetric Card specification or the Clean Elevated Card specification.

---

## 9. Subscription & Royal Paywall Architecture (`src/Screens/Subscription`)

The Regius Royal subscription flow embodies mindful luxury:

1. **Brand Identity**:
   - Title: `Regius Royal`
   - Badge: `<ProBadge size="sm" />` paired with 24K Gold Crown icon (`#F5C518`).
2. **Hero Showcase Bento**:
   - Signature 2-layer wrapper (`cardShadowWrapper` with volumetric shadow + inner ceramic rim `card`).
   - Radial golden light orb, editorial Ranade title, and 3 high-contrast micro-pills for core perks.
3. **Value Proposition Grid**:
   - 6 category-themed benefit cards featuring Lavender Purple (Unlimited TTS), 24K Gold (8 Artisan Themes), Tangerine Amber (Custom Wake Words), Indigo Violet (2x XP Boost), Emerald Mint (Encrypted Cloud Backup), and Coral Rose (Executive Daily Briefing).
4. **Interactive Plan Selector**:
   - High-contrast tactile plan cards: Annual (Best Value / Save 50%), Monthly (Flexible), and Monarch Lifetime (One-time).
   - Dynamic selection ring and haptic vibration feedback (`Vibration.vibrate(20)`).
5. **Sticky Action Dock**:
   - Full-pill golden CTA button with dual-state messaging: "Start 14-Day Free Trial" or "Royal Access Active".
   - Compliant microcopy for App Store and Google Play subscription transparency.

---

## 10. Reusable Global Primitives & Component Inventory (`src/Common/`)

To prevent divergence and maintain strict aesthetic consistency across features, engineers and AI agents must consume the centralized primitives in `src/Common/`:

### 10.1 `UnifiedSchedulePickerModal.tsx`

- **Purpose**: Consolidated date & time schedule picker modal replacing disjointed platform picker sheets.
- **Visuals**: Displays an interactive solar calendar grid with month navigation, day cells, lunar chrono time spinner, quick selection chips ('Today', 'Tomorrow', 'Next Week'), and a full-pill tactile confirmation CTA.
- **Props**: `visible: boolean`, `initialDate?: Date`, `mode?: 'date' | 'time' | 'datetime'`, `onConfirm: (date: Date) => void`, `onCancel: () => void`.

### 10.2 `TactileSegmentedTabs.tsx`

- **Purpose**: Tactile sliding pill segmented control with haptic feedback and fluid indicator animation.
- **Visuals**: High-contrast pill geometry, active indicator pill with subtle volumetric drop shadow, and crisp typography (`Fonts.poppins.semiBold`).
- **Props**: `tabs: { key: string; label: string; count?: number }[]`, `activeTab: string`, `onTabChange: (key: string) => void`.

### 10.3 `StickyActionDock.tsx`

- **Purpose**: Universal bottom-anchored action dock for primary submit/confirm actions.
- **Visuals**: Gradient dawn fade-up backdrop, dynamic safe area padding (`useSafeAreaInsets().bottom`), and full-bleed action buttons.

### 10.4 `FlowSectionSheet.tsx`

- **Purpose**: Standardized bottom sheet wrapper with rounded canopy geometry and integrated crest badge.
- **Visuals**: Centered black crest badge (`flowHeaderBadge`) straddling top border (`top: -ResponsivePixels.size24`), optional top-right floating plus action button (`floatingAddBtn`) straddling the top-right border edge in vertical symmetry with the header crest (`top: -ResponsivePixels.size21`, `right: ResponsivePixels.size18`, `width: ResponsivePixels.size42, height: ResponsivePixels.size42, borderRadius: ResponsivePixels.size21`, `backgroundColor: Colors.NeroBlack`, 3D beveled borders: `borderTopColor: '#4A4E5C', borderLeftColor: '#363944', borderRightColor: '#363944', borderBottomWidth: 3.5, borderBottomColor: '#090A0D'`, volumetric shadow: `shadowColor: '#0B0D11'`, `zIndex: 20`), smooth background SVG filigree support, and dynamic bottom padding. All geometry and offsets must use `ResponsivePixels`.

### 10.5 `SearchInputBar.tsx`

- **Purpose**: Luxury search input field with instant clear button and search emblem.
- **Visuals**: Rounded pill container (`borderRadius: 16`), high-contrast placeholder, and focus glow rim.

### 10.6 `EmptyStateView.tsx`

- **Purpose**: Engaging empty state display for lists, search results, and filters.
- **Visuals**: Centered emblem illustration, Ranade bold title, Poppins regular description, and optional full-pill CTA button.

### 10.7 `EmblemIcons.tsx` & `CutoutCardSvg.tsx`

- **Purpose**: Signature category emblems (`WorksVectorEmblem`, `SportVectorEmblem`, `HabitsVectorEmblem`) and asymmetric cutout card geometry (`CutoutCardSvg`, `borderRadius: 23, borderTopRightRadius: 63`).

### 10.8 `HeaderActionButton.tsx`

- **Purpose**: Unified luxury section header action and navigation pill button with circular icon disc.
- **Visuals**: Full pill (`borderRadius: 20`), Nero background (`#1E2028`), border (`#363944`), 14x14 icon disc with translucent aura, Poppins SemiBold 10.5 text (`#F5C518`), and configurable `iconPosition` (`'left' | 'right'`).

### 10.9 `ModalBottomBar.tsx` & `ModalBottomPatternSvg.tsx`

- **Purpose**: Consolidated bottom sticky action dock for creation and edition modals (`AddTaskModal`, `AddReminderModal`, `AddHabitModal`).
- **Visuals**: Replaces transparent backgrounds with a theme-adaptive backdrop matching the top header (`Colors.LavenderPurple` in Classic Light, `#282048` in Classic Dark, or active theme preset color), `borderTopLeftRadius: 24`, `borderTopRightRadius: 24`, deep volumetric upward shadow (`shadowRadius: 14, elevation: 10`), delicate top rim highlight border, and custom `ModalBottomPatternSvg` aesthetic background with concentric orbit rings, starlight diamonds, and Regius crown emblem. Hosts the circular tactile dismiss button on the left (`ArrowDown`) and the animated hero submit pill button on the right (`ArrowRight`).

### 10.10 Modal Dialogs & Pickers Dark Mode Standards

All creation modals (`AddTaskModal`, `AddReminderModal`, `AddHabitModal`), dialogs (`CustomCategoryModal`), and chrono pickers (`UnifiedSchedulePickerModal`) dynamically adapt to dark mode:

- **Backdrop Scrim**: `rgba(0, 0, 0, 0.72)` deep dimming overlay preserving focus.
- **Root Canvas & Modal Card Surfaces**:
  - Full-screen creation modals (`AddTaskModal`, `AddReminderModal`, `AddHabitModal`): Canvas root `#121417`, primary input card `#1E2228`, border `#2C3035`.
  - Floating dialog modals (`CustomCategoryModal`, `UnifiedSchedulePickerModal`): Card surface `#1E2228`, border `#2C3035`, shadow `#000000`.
- **Inputs & Fields**: Input container background `#171A1F`, border `#2C3035`, placeholder text `#666665`, typed text `#FFFFFF`.
- **Section Headings & Labels**: Poppins SemiBold `#FFFFFF` for primary titles, `#A3A8B1` for secondary context.
- **Category Chips & Selectors**: Deep jewel backgrounds (`#2A2416` Works, `#162820` Sport, `#202336` Mindful, `#331F18` Events) with high-contrast active borders and glowing accents.
- **Platform Pickers**: Native iOS `DateTimePicker` sets `textColor="#FFFFFF"` and `themeVariant="dark"` when `isDarkMode` is true.
- **Destructive & Cancel Controls**: Outlined slate buttons (`#252932` fill, `#363944` border) for cancel actions; high-contrast crimson `#EF4444` for delete actions.
