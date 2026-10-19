# 👑 Regius Design System & Theme Context

This document captures the design identity, color architecture, typography system, card patterns, and philosophical mindset of the **Regius** mobile application. Always reference and adhere to these guidelines when designing or implementing features.

---

## 🌟 1. Design Mindset & Emotional Feeling

- **Concept**: _Modern Warm Luxury & Mindful Productivity_ ("Plan Your Day In Details").
- **Feeling**: Calm, cheerful, tactile, and premium. Unlike sterile enterprise tools or harsh dark cyberpunk interfaces, Regius feels like an artisanal, high-grade physical stationery journal fused with a modern AI assistant.
- **Visual Tenets**:
  - **Warmth Over Cold**: Soft, sunlit cream backgrounds (`#FFFCE3` / `#FAF8F5`) instead of clinical `#FFFFFF` or stark `#000000`.
  - **Organic Geometry**: Asymmetric cards with exaggerated curved corners (`borderRadius: 23`, `borderTopRightRadius: 63`).
  - **Tinted Pastels & Colored Shadows**: Each card category lives in its own harmonic ecosystem (soft tinted background + matching pastel border + vibrant accent icon + colored glow drop shadow).
  - **Pill Architecture**: Controls, toggles, badges, and primary action buttons favor full-pill geometry (`borderRadius: 50`).
  - **Fluid Tactile Motion**: Spring animations, rotating floating plus button (`0°` to `135°`), scale bounces on tab select, and floating badge physics.

---

## 🎨 2. Theme Colors & Tokens

### Core Canvas & Surfaces

| Token / Name       | Hex Code  | Purpose & Application                                                              |
| ------------------ | --------- | ---------------------------------------------------------------------------------- |
| `CreamBackground`  | `#FFFCE3` | **Signature Brand Canvas**. Used across Splash, Intro, Home, Reminders background. |
| `SheetSurface`     | `#FAF8F5` | Background for modals, bottom sheets, and form surfaces.                           |
| `TaskSectionBg`    | `#FAFAFA` | Home task list rounded sheet container.                                            |
| `DefaultWhite`     | `#FFFFFF` | Elevated cards, inner icon circles, buttons, active pill backgrounds.              |
| `MidnightCharcoal` | `#1F2228` | Primary dark surface, pill toggles, dark CTA buttons, header text.                 |
| `ButtonDark`       | `#242424` | Primary button background in light mode.                                           |
| `RingBorder`       | `#E8E2D5` | Subtle border for avatar rings, input cards, and dividers.                         |
| `HomeIndicator`    | `#D5D0C5` | Bottom gesture pill indicator color.                                               |

### Dark Mode Adaptations

| Token                | Hex Code              | Purpose                              |
| -------------------- | --------------------- | ------------------------------------ |
| `DarkBackground`     | `#121417`             | Deep midnight canvas for dark theme. |
| `DarkCardBackground` | `#1E2228`             | Elevated card surface in dark theme. |
| `DarkSecondaryText`  | `#A3A8B1`             | Subdued secondary copy.              |
| `DarkBorder`         | `#2C3035` / `#3A3F46` | Subtle surface borders in dark mode. |

---

### Category Trios & Semantic Accents

Every major functional category or card type pairs 4 harmonized color values:

| Category                   | Bg Tint (`bgColor`) | Border Tint (`borderColor`) | Vibrant Accent / Icon             | Drop Shadow Glow (`shadowColor`) |
| -------------------------- | ------------------- | --------------------------- | --------------------------------- | -------------------------------- |
| **Works / Tasks**          | `#FFFCEB`           | `#FFF5B8`                   | `#F5C518` / `#FFE600` / `#FDD835` | `#F5C518` (Gold Glow)            |
| **Sport / Health**         | `#EDFDF5`           | `#C6FFDD`                   | `#52D22E` / `#21AF85`             | `#52D22E` (Fresh Green Glow)     |
| **Habits / Regius Purple** | `#EFF2FE`           | `#D8DBFF`                   | `#8383D6` (Lavender Purple)       | `#8383D6` (Lavender Glow)        |
| **Events / Alerts**        | `#FFF3E0`           | `#FFE0B2`                   | `#FF9800`                         | `#FF9800` (Amber Glow)           |
| **Danger / Delete**        | `#FEEFEF`           | `#FED6D6`                   | `#FF3B30` / `#D92A0F`             | `#FF3B30`                        |

### Typography & Foregrounds

| Token                             | Hex Code              | Purpose                                                       |
| --------------------------------- | --------------------- | ------------------------------------------------------------- |
| `MidnightInkText` / `TrueBlack`   | `#000000`             | Hero screen headers, high-emphasis text.                      |
| `SlateGraphiteText`               | `#1F2228` / `#3F454D` | Body text, section headers, prominent labels.                 |
| `SubtitleGray` / `MutedSteelText` | `#666665` / `#7E838F` | Secondary descriptions, task counts, metadata.                |
| `PureWhiteText`                   | `#FFFFFF`             | Text on dark buttons, active tab indicators, floating badges. |

---

## 🔤 3. Typography Hierarchy

The app uses two dedicated typefaces imported into `src/Theme/fonts.ts`:

1. **Ranade** (`Ranade-Bold`, `Ranade-Medium`, `Ranade-Regular`):
   - Editorial, elegant, and regal.
   - Used for **Display Brand Names**, **Screen Headings (H1)**, and **Modal Titles**.
2. **Poppins** (`Poppins-Bold`, `Poppins-SemiBold`, `Poppins-Medium`, `Poppins-Regular`):
   - Modern, friendly geometric sans-serif.
   - Used for **Section Headers (H6)**, **Card Labels**, **Body Copy**, **Pills**, **Badges**, and **Input Fields**.

### Standard Typographic Tokens

- **Brand / Splash Display**: `Typography.displayLargeRanadeBold` — `36px` / Line Height `44px`
- **Screen H1 Title**: `Typography.h1RanadeBold` — `26px` / Line Height `28px`
- **Section Headers**: `Typography.h6Bold` — `18px` / Line Height `23px`
- **Card Primary Text**: `Typography.bodyMediumPoppinsSemiBold` — `14px` / `15px`
- **Secondary / Subtitle Text**: `Typography.bodySmallPoppinsRegular` — `12px` / `13px`
- **Badges & Tab Labels**: `Typography.bodySuperSmallPoppinsRegularLoose` — `9.5px` - `11px`

---

## 🃏 4. Card Designs & Architectural Patterns

### 1. The Signature "Regius Asymmetric" Card

Used for Category Cards (`HomeScreen`, `TasksScreen`, `RemindersScreen`), Quick Action Cards (`PlusActionSheet`), and Bento Metric Cards on `DashboardScreen` (`DailyBalanceGrid.tsx`):

```tsx
// Category Carousel Card (HomeScreen)
categoryCard: {
  width: 124, // or 132 for action sheets
  borderRadius: 23,
  borderTopRightRadius: 63, // Signature exaggerated curve
  padding: 16,
  borderWidth: 2,
  borderColor: 'transparent',
  backgroundColor: cat.bgColor, // e.g. #FFFCEB, #EDFDF5, #EFF2FE
  position: 'relative',
}

// Daily Balance Bento Card (DashboardScreen)
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

- **4-Facet Harmonic Ecosystem**:
  1. Soft Pastel Background (`#FFFCEB` Tasks, `#EFF2FE` Habits, `#EDFDF5` Sport/Wellness/Reminders)
  2. Matching Pastel Border (`#FFF5B8`, `#D8DBFF`, `#C6FFDD`)
  3. Elevated Circular White Icon Wrap (`32x32` or `46x46`, `backgroundColor: '#FFFFFF'`) with tinted border & matching category shadow
  4. Matching Colored Glow Shadow (`shadowColor: #F5C518`, `#8383D6`, `#52D22E`, `elevation: 3`)
- **Bottom Accent Pill**: A subtle colored accent bar centered at the bottom edge:
  ```tsx
  categoryAccent: {
    height: 3.5, // or 4 for larger cards
    width: 36,   // or 48 for larger cards
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
    backgroundColor: cat.accentColor,
  }
  ```

### 2. Clean Elevated Task & Timeline Flow Cards

Used for task and timeline items in `HomeScreen`, `TasksScreen`, `RemindersScreen`, and `DashboardScreen` (`TimelineItemCard.tsx`):

- **Signature Inverted Scooped Corner Cutout (`TimelineItemCard.tsx`)**:
  - Inverted top-right corner notch (`44×44`) with smooth quadratic fillets (`R_outer: 12`, `R_inner: 14`), rendered dynamically via SVG.
  - Base corner radius: `18px` on remaining corners.
  - Leading vertical accent bar: `width: 3.5`, `borderRadius: 2`.
- **Category Palette & Surface Harmony**:
  - **Tasks**: `#FFFCEB` tinted surface, `#FFF5B8` border, `#F5C518` gold accent bar and drop shadow, yellow 3D `<Badge />`, and `#FFF9D2` time pill (`#B48216`). Follows Daily Balance Tasks Card.
  - **Reminders**: `#EDFDF5` tinted surface, `#C6FFDD` border, `#52D22E` green accent bar and drop shadow, green 3D `<Badge />`, and `#E8FDF0` time pill (`#1B9A72`).
  - **Habits**: `#EFF2FE` tinted surface, `#D8DBFF` border, `#8383D6` lavender accent bar and drop shadow, purple 3D `<Badge />`, and `#EDEAFB` time pill (`#7059C8`).
- **Completed State**: Subdued `#FAFAF8` background with `#ECEAE4` border and clear `#8E8D92` muted typography.
- **Floating Round Checkbox Outside the Card (Curated Flow Cards)**:
  - Position: **Floating outside the card's filled boundary** in the scooped top-right cutout (`position: 'absolute'`, `top: 9`, `right: 9`, `zIndex: 10`). The linen background canvas (`#FBF9F3`) sits directly behind it.
  - Shape & Size: Circular vessel (`26×26`, `borderRadius: 13`).
  - Tactile micro-shadow: `elevation: 3`, `shadowOpacity: 0.12`, `shadowRadius: 3`.
  - Title right spacing: `paddingRight: 48` ensuring title never intrudes into the scooped cutout.
  - Unchecked state: `backgroundColor: '#FFFFFF'`, `borderWidth: 1.5`, category-tinted border (`catStyle.borderTint`).
  - Checked state: `backgroundColor: '#E8FDF0'`, `borderWidth: 1.5`, `borderColor: '#52D22E'` with `#1B9A72` Check icon (`strokeWidth: 3`).
- **Left Timeline Node Icon**:
  - **Always displays the persistent category icon** (`CheckCircle2` for Tasks, `Bell` for Reminders, `Flame` for Habits, `Mic` for Voice Nudges).
  - **Never replaced by a checkmark or checkbox when completed**.
- **Tactile 3D Badges**: Integrated `<Badge />` upper layer chips for status, streak, and voice check-ins.

### 3. Settings & Profile Container Cards

Used across `SettingsScreen` and profile sections:

- **Background**: `Colors.CardBackground` (Adaptive light/dark)
- **Border Radius**: `24px`
- **Border Width**: `1.5px` (`borderColor: borderLight` / `#E8E2D5`)
- **Metric Row**: Divided with hairline dividers (`height: 28, width: 1, backgroundColor: borderLight`).

### 4. Floating Curved Tab Bar & Action Dock

- **Shape**: SVG-based organic curved floating bar with an inverted center bezier notch (`CORNER_R: 34`, `NOTCH_W: 44`, `NOTCH_DEEP: 24`).
- **Bar Color**: `Colors.LavenderPurple` (`#8383D6`) with a `4px` `Colors.CreamBackground` outer outline.
- **Center Floating FAB**:
  - Size: 54×54 circle in `LavenderPurple` (`#8383D6`).
  - Outer Halo: 62×62 circle in `CreamBackground` (`#FFFCE3`).
  - Shadow: Deep purple drop shadow (`shadowColor: Colors.LavenderPurple`, opacity `0.45`, radius `12`).
  - Interaction: Rotates `0°` → `135°` on open into a close icon.

### 5. Signature 3D Tactile Badges ("Upper Layer" Architecture)

- **Philosophy**: _A badge is always 3D because it is an upper layer everywhere._ Badges must never appear as flat, static text boxes. They behave as elevated physical chips/stickers floating above cards and canvas surfaces with tactile depth, ambient light reflection, and tangible weight.
- **Reusable Component**: [Badge.tsx](file:///Users/renishbhuva/Documents/Development/React_Native/Regius/src/Common/Badge.tsx) (`import { Badge } from '../Common/Badge'`).
- **Anatomy of the 3D Badge**:
  1. **Full Pill Geometry**: `borderRadius: 20` (`sm`/`md`) or `24` (`lg`).
  2. **Top Specular Light Rim**: `borderWidth: 1`, `borderColor: '#FFFFFF'` to simulate top-down ambient light bounce.
  3. **Extruded 3D Bottom Bevel**: `borderBottomWidth: 2` to `2.8` with a deeper, saturated bottom border tone representing physical depth and material extrusion.
  4. **Dynamic Ambient Elevation**: Platform-tuned colored drop shadow matching the category tint (`shadowOffset: { width: 0, height: 2 - 3 }`, `shadowOpacity: 0.22`, `shadowRadius: 3 - 4.5`, `elevation: 2.5 - 4`).
  5. **Bold Typographic Stamping**: `Fonts.poppins.bold`, letter-spaced (`0.5` - `0.9px`), uppercase by default.

#### 3D Badge Variant Palette

| Variant              | Semantic / Category           | Bg Tint   | Specular Border | 3D Bottom Bevel | Text Color | Glow Shadow |
| :------------------- | :---------------------------- | :-------- | :-------------- | :-------------- | :--------- | :---------- |
| `purple` / `primary` | Habits / Brand Lavender       | `#EEF0FD` | `#FFFFFF`       | `#B6BEF5`       | `#8383D6`  | `#8383D6`   |
| `yellow` / `alert`   | Tasks / Reminders / Alerts    | `#FFF8D0` | `#FFFFFF`       | `#DEAA14`       | `#B47804`  | `#D97706`   |
| `green` / `success`  | Health / Sport / Complete     | `#E8FDF0` | `#FFFFFF`       | `#82E8A6`       | `#1B9A72`  | `#52D22E`   |
| `orange` / `events`  | Events / Priority             | `#FFF0DE` | `#FFFFFF`       | `#FFB86B`       | `#E65100`  | `#FF9800`   |
| `red` / `danger`     | High Alert / Overdue / Delete | `#FEEFEF` | `#FFFFFF`       | `#FFA8A8`       | `#D92A0F`  | `#FF3B30`   |
| `neutral` / `white`  | Universal White Chip          | `#FFFFFF` | `#FFFFFF`       | `#D5D0C5`       | `#1F2228`  | `#1F2228`   |

---

## 📐 5. Rules for Future Development

1. **Never use generic blue/grey defaults**:
   - Always choose from the curated brand palette (`CreamBackground`, `MidnightCharcoal`, `LavenderPurple`, and the Pastel Category Trios).
2. **Preserve Font Semantics**:
   - Headers, screen titles, and brand moments: Use `Fonts.ranade.bold`.
   - Cards, labels, numbers, and inputs: Use `Fonts.poppins` weights.
3. **Always use Full-Pills for Primary CTA Buttons**:
   - `borderRadius: 50`, `backgroundColor: '#1F2228'` (Midnight Charcoal), padding horizontal 36+, text `PureWhiteText`.
4. **Maintain Category Cohesion**:
   - When introducing a new category, define all 4 facets: `bgColor` (soft pastel), `borderColor` (subtle tint), `accentColor` (vibrant icon color), and `shadowColor` (matching glow).
5. **Honor the Asymmetric Corner Style**:
   - In category carousels or featured hero cards, employ the `borderRadius: 23` + `borderTopRightRadius: 63` signature geometry.
6. **Badges Are ALWAYS 3D ("Upper Layer" Principle)**:
   - Badges in Regius represent the highest z-elevation layer on any surface. Never render flat transparent tags or borderless labels.
   - Always use the `<Badge />` component from `src/Common/Badge.tsx` or apply the 3D physical spec: specular top rim (`#FFFFFF`), extruded 3D bottom border, and harmonic colored drop shadow.
