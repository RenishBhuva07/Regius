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
6. **Fluid Tactile Motion**: Spring animations, rotating floating plus button (`0°` to `135°`), scale bounces on tab select, and organic holographic breathing.

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

### 2.2 Dark Mode Surface Adaptations

| Token Name           | Hex Value             | Semantic Role & Usage                              |
| :------------------- | :-------------------- | :------------------------------------------------- |
| `DarkBackground`     | `#121417`             | Deep midnight canvas for dark theme.               |
| `DarkCardBackground` | `#1E2228`             | Elevated card surface in dark theme.               |
| `DarkSecondaryText`  | `#A3A8B1`             | Subdued secondary copy and captions in dark theme. |
| `DarkBorder`         | `#2C3035` / `#3A3F46` | Subtle hairline borders in dark mode.              |

### 2.3 Category Trios & Semantic Accents

Every major category or card type pairs 4 harmonized color values, structured according to the **Universal Product Navigation & Metric Sequence Standard**:

> **Universal Product Hierarchy**: **1. Tasks** (Works / Gold-Yellow) → **2. Reminders** (Alerts & Nudges / Mint-Green) → **3. Habits** (Mindful Routines / Lavender-Purple).  
> This order is enforced across all surfaces: Bottom Tab Bar (`Dashboard` → `Tasks` → `[+]` → `Reminders` → `Habits`), Daily Balance Grid (`Tasks` → `Reminders` → `Habits`), Flow Filters (`All Flow` → `Tasks` → `Reminders` → `Habits`), and Dynamic Assistant Spoken Briefings.

| Sequence & Category      | Bg Tint (`bgColor`) | Border Tint (`borderColor`) | Vibrant Accent / Icon             | Drop Shadow Glow (`shadowColor`) |
| :----------------------- | :------------------ | :-------------------------- | :-------------------------------- | :------------------------------- |
| **1. Works / Tasks**     | `#FFFCEB`           | `#FFF5B8`                   | `#F5C518` / `#FFE600` / `#B48216` | `#F5C518` (Gold Glow)            |
| **2. Sport / Reminders** | `#EDFDF5`           | `#C6FFDD`                   | `#1B9A72` / `#52D22E`             | `#52D22E` (Fresh Green Glow)     |
| **3. Habits / Brand**    | `#EFF2FE`           | `#D8DBFF`                   | `#8383D6` (Lavender Purple)       | `#8383D6` (Lavender Glow)        |
| **4. Events / Alerts**   | `#FFF3E0`           | `#FFE0B2`                   | `#FF9800` (Amber)                 | `#FF9800` (Amber Glow)           |
| **5. Danger / Delete**   | `#FEEFEF`           | `#FED6D6`                   | `#FF3B30` / `#D92A0F`             | `#FF3B30` (Crimson Glow)         |

### 2.4 Typography Foregrounds

| Token Name                        | Hex Value             | Purpose & Visual Weight                                       |
| :-------------------------------- | :-------------------- | :------------------------------------------------------------ |
| `MidnightInkText` / `TrueBlack`   | `#000000`             | Hero screen headers, brand display, high-emphasis titles.     |
| `SlateGraphiteText`               | `#1F2228` / `#3F454D` | Body copy, section headers, prominent input text.             |
| `SubtitleGray` / `MutedSteelText` | `#666665` / `#7E838F` | Secondary descriptions, task counts, metadata stamps.         |
| `PureWhiteText`                   | `#FFFFFF`             | Text on dark buttons, active tab indicators, floating badges. |

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
- **Bottom Accent Pill**: Centered accent indicator bar (`height: 3.5-4`, `width: 36-48`, `borderTopLeftRadius: 3`, `borderTopRightRadius: 3`, `backgroundColor: cat.accentColor`).

---

### 4.4 Clean Elevated Task & Curated Flow Cards

Used for list items in `HomeScreen`, `TasksScreen`, `RemindersScreen`, and `DashboardScreen` (`TimelineItemCard.tsx`):

- **Signature Inverted Scooped Corner Cutout (`TimelineItemCard.tsx`)**:
  - **Inverted Top-Right Scoop**: Rather than a standard rounded corner, the top-right corner features an organic concave scoop / cutout (`CW: 44, CH: 44`) with smooth quadratic bezier fillets (`R_outer: 12, R_inner: 14`), rendered dynamically via SVG.
  - **Base Border Radius**: `18px` on top-left, bottom-left, and bottom-right corners.
  - **Leading Accent Sliver**: `width: 3.5`, `borderRadius: 2`, matching category accent tint.
- **Surface & Category Color Harmony**:
  - **Tasks**: `#FFFCEB` tinted surface with `#FFF5B8` border (`borderWidth: 1.5`), `#F5C518` gold accent bar and drop shadow glow, yellow 3D `<Badge />`, and `#FFF9D2` time pill (`#B48216` text). Matches Daily Balance Tasks Card.
  - **Reminders**: `#EDFDF5` tinted surface with `#C6FFDD` border (`borderWidth: 1.5`), `#52D22E` green accent bar and drop shadow glow, green 3D `<Badge />`, and `#E8FDF0` time pill (`#1B9A72` text).
  - **Habits**: `#EFF2FE` tinted surface with `#D8DBFF` border (`borderWidth: 1.5`), `#8383D6` lavender accent bar and drop shadow glow, purple 3D `<Badge />`, and `#EDEAFB` time pill (`#7059C8` text).
- **Completed State**: Subdued `#FAFAF8` background with `#ECEAE4` hairline border and muted text (`#8E8D92`), retaining full typography clarity.
- **Floating Round Checkbox Outside the Card (Top-Right Cutout)**:
  - **Position**: Floats completely **outside the card's filled surface** in the top-right scooped negative space (`position: 'absolute'`, `top: 9`, `right: 9`, `zIndex: 10`). The screen background (`#FBF9F3`) shines through the cutout, perfectly cradling the circular element as in signature luxury cutout card patterns.
  - **Shape & Dimensions**: Pure round circular vessel (`width: 26`, `height: 26`, `borderRadius: 13`).
  - **Tactile Elevation**: Soft floating drop shadow (`shadowColor: '#000000'`, `shadowOffset: { width: 0, height: 2 }`, `shadowOpacity: 0.12`, `shadowRadius: 3`, `elevation: 3`).
  - **Title Padding**: Title container reserves `paddingRight: 48` ensuring text never encroaches into the scooped cutout.
  - **Unchecked state**: `backgroundColor: '#FFFFFF'`, `borderWidth: 1.5`, category-tinted border (`borderColor: catStyle.borderTint`).
  - **Checked state**: `backgroundColor: '#E8FDF0'`, `borderWidth: 1.5`, `borderColor: '#52D22E'` with `#1B9A72` Check icon (`size: 14, strokeWidth: 3`).
- **Left Timeline Node Icon**:
  - **Always displays the persistent category icon** (`CheckCircle2` for Tasks, `Bell` for Reminders, `Flame` for Habits, `Mic` for Voice Nudges).
  - **Never replaced by a checkmark or checkbox when completed** (completion is indicated strictly by the outside floating checkbox, muted card copy, and subdued node border).
- **Tactile 3D Badges**: Integrated `<Badge />` chips for category stamps, streaks, and voice check-in indicators floating above the card surface.

---

### 4.5 Dynamic Scroll-Reactive Layer Header (`src/Screens/Dashboard/DashboardScreen.tsx`)

A signature luxury header architecture where scrolling elevates the header from a seamless canvas into a distinct floating brand layer:

- **Unscrolled Initial State (`scrollY <= 15px`)**:

  - **Surface Canvas**: Merges seamlessly with the soft cream background (`#FBF9F3` / `CreamBackground`).
  - **Corner Geometry**: Flush square corners (`borderBottomLeftRadius: 0`, `borderBottomRightRadius: 0`).
  - **Elevation / Shadow**: Completely flat (`shadowOpacity: 0`, `elevation: 0`).
  - **Status Bar**: `dark-content` for optimal legibility against the cream canvas.
  - **Brand Wordmark**: Dark `#1B1C19` via `<RegiusLogo size="md" variant="default" />`.
  - **Action Controls**: Voice button with ambient purple tint (`rgba(131, 131, 214, 0.12)`); Settings gear in white circular card (`#FFFFFF`) with hairline border (`#ECE8DF`); User avatar with signature `Colors.RingBorder` (`#E8E2D5`).

- **Scrolled Floating Layer State (`scrollY > 15px`)**:
  - **Layer Surface**: Theme primary brand color `LavenderPurple` (`#8383D6`), smoothly animated via `Animated.event` (0 to 30px interpolation).
  - **Dynamic Bottom Padding Cushion**: Smoothly interpolates `paddingBottom` from `0` to `14px` (`headerPaddingBottom`), creating generous vertical breathing space between the controls and the rounded bottom lip so the buttons and logo are never clipped.
  - **Layer Geometry**: Rounded bottom corners (`borderBottomLeftRadius: 24`, `borderBottomRightRadius: 24`) appearing as an elevated floating card overlaying the scroll stream.
  - **Ambient Layer Shadow**: Deep purple luxury drop shadow (`shadowColor: '#4A3E8A'`, `shadowOffset: { width: 0, height: 4 }`, `shadowRadius: 10`, `shadowOpacity: 0.22`, `elevation: 6`).
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

### 4.6 Floating Curved Tab Bar & Action Dock (`src/Navigators/BottomTabNavigator.tsx`)

- **Visual Shape**: Custom SVG bezier curve path with an inverted center notch (`CORNER_R: 34`, `NOTCH_W: 40`, `NOTCH_DEEP: 24`).
- **Bar Surface**: `LavenderPurple` (`#8383D6`) with a `4px` `CreamBackground` (`#FFFCE3`) outer border outline.
- **Center Floating FAB Button**:
  - Size: `54x54` circle in `LavenderPurple` (`#8383D6`).
  - Outer Halo: `62x62` circle in `CreamBackground` (`#FFFCE3`).
  - Shadow: Deep purple drop shadow (`shadowColor: #8383D6`, opacity `0.45`, radius `12`, elevation `16`).
  - Animated Rotation: Springs from `0°` (plus icon) to `135°` (cross icon) when `PlusActionSheet` opens.
  - Interaction: Tap opens `PlusActionSheet`; **Long press (320ms) triggers Voice Assistant immediately**.

---

### 4.7 Quick Action Sheet (`src/Navigators/PlusActionSheet.tsx`)

- Sits above the floating dock with a dim backdrop (`rgba(0, 0, 0, 0.35)`).
- Renders 3 horizontal quick action asymmetric cards:
  1. **New Task** (`#FFFCEB`, gold accent `#F5C518`)
  2. **New Reminder** (`#FFF3E0`, amber accent `#FF9800`)
  3. **New Habit** (`#EDFDF5`, green accent `#52D22E`)

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
   - Tab Selection Bounce: `friction: 5`, `tension: 300`
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
