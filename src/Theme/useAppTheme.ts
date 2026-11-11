import { useMemo } from 'react';
import { useTheme, ThemePresetId, ThemeOption } from './ThemeContext';
import {
  Colors as StaticColors,
  withAlpha,
} from '../Assets/StyleUtilities/Colors';

export interface CategoryThemeTokens {
  bg: string;
  border: string;
  accent: string;
  text: string;
  shadow: string;
  aura: string;
  iconBg: string;
}

export interface AppThemeTokens {
  isDarkMode: boolean;
  activeThemeId: ThemePresetId;
  Colors: ReturnType<typeof useTheme>['Colors'];
  toggleTheme: () => void;
  setDarkMode: (enabled: boolean) => void;
  themePresets: ThemeOption[];
  bgMain: string;
  cardBg: string;
  surfaceAlt: string;
  inputBg: string;
  textPrimary: string;
  textSecondary: string;
  canvasTextPrimary: string;
  canvasTextSecondary: string;
  borderLight: string;
  borderSubtle: string;
  accent: string;
  accentDeep: string;
  accentLight: string;
  accentDark: string;
  accentAura: string;
  getCategoryTheme: (category?: string) => CategoryThemeTokens;
}

export const useAppTheme = (): AppThemeTokens => {
  const themeContext = useTheme();
  const {
    isDarkMode,
    activeThemeId,
    Colors,
    toggleTheme,
    setDarkMode,
    themePresets,
  } = themeContext;

  const bgMain =
    Colors.Background ||
    (isDarkMode ? StaticColors.DarkBackground : StaticColors.CreamBackground);
  const cardBg =
    Colors.CardBackground ||
    (isDarkMode ? StaticColors.DarkCardBackground : StaticColors.PureWhite);
  const surfaceAlt =
    Colors.SurfaceAlt ||
    (isDarkMode ? StaticColors.DarkSurfacePressed : StaticColors.CreamSurfaceAlt);
  const inputBg = isDarkMode
    ? Colors.SurfaceAlt || StaticColors.DarkSurfaceAlt
    : StaticColors.PureWhite;
  const textPrimary =
    Colors.PrimaryText ||
    (isDarkMode ? StaticColors.PureWhite : StaticColors.NoirBlack);
  const textSecondary =
    Colors.SecondaryText ||
    (isDarkMode ? StaticColors.SteelMist : StaticColors.SubtitleGray);
  const canvasTextPrimary =
    Colors.CanvasTextPrimary ||
    (isDarkMode ? StaticColors.PureWhite : StaticColors.NoirBlack);
  const canvasTextSecondary =
    Colors.CanvasTextSecondary ||
    (isDarkMode ? StaticColors.SteelMist : StaticColors.SubtitleGray);
  const borderLight =
    Colors.BorderLight ||
    (isDarkMode ? StaticColors.CarbonSlate : StaticColors.WarmParchmentBorder);
  const borderSubtle = isDarkMode
    ? StaticColors.DarkBorderSubtle
    : StaticColors.CreamBorderSubtle;

  const accent =
    Colors.Accent ||
    (isDarkMode ? StaticColors.AccentYellow : StaticColors.LavenderPurple);
  const accentDeep =
    Colors.AccentDeep ||
    (isDarkMode ? StaticColors.MidnightIndigo : StaticColors.LavenderPurple);
  const accentLight =
    Colors.AccentLight ||
    (isDarkMode ? StaticColors.AccentYellow : StaticColors.LavenderSoftHighlight);
  const accentDark =
    Colors.AccentDark ||
    (isDarkMode ? StaticColors.ObsidianNight : StaticColors.LavenderDeep);
  const accentAura =
    Colors.AccentAura ||
    (isDarkMode
      ? withAlpha(StaticColors.AccentYellow, 0.2)
      : withAlpha(StaticColors.LavenderPurple, 0.25));

  const getCategoryTheme = useMemo(() => {
    return (category?: string): CategoryThemeTokens => {
      const cat = (category || '').toLowerCase();

      // 1. Reminders / Sport / Wellness / Health
      if (
        cat === 'sport' ||
        cat === 'reminders' ||
        cat === 'reminder' ||
        cat === 'health' ||
        cat === 'daily'
      ) {
        return {
          bg: isDarkMode
            ? StaticColors.WellnessDarkBg
            : StaticColors.WellnessLightBg,
          border: isDarkMode
            ? StaticColors.GreenGracious
            : StaticColors.WellnessLightBorder,
          accent: StaticColors.AccentGreen,
          text: isDarkMode ? StaticColors.PureWhite : StaticColors.GreenGracious,
          shadow: isDarkMode
            ? StaticColors.PureBlack
            : StaticColors.AccentGreen,
          aura: StaticColors.AccentGreen,
          iconBg: isDarkMode
            ? StaticColors.WellnessDarkIconBg
            : StaticColors.WellnessLightBg,
        };
      }

      // 2. Habits / Mindful / Evening
      if (
        cat === 'habits' ||
        cat === 'habit' ||
        cat === 'mindful' ||
        cat === 'evening'
      ) {
        return {
          bg: isDarkMode
            ? StaticColors.MindfulDarkBg
            : StaticColors.MindfulLightBg,
          border: isDarkMode
            ? StaticColors.LavenderPurple
            : StaticColors.MindfulLightBorder,
          accent: StaticColors.LavenderPurple,
          text: isDarkMode
            ? StaticColors.PureWhite
            : StaticColors.MindfulTextAccent,
          shadow: isDarkMode
            ? StaticColors.PureBlack
            : StaticColors.LavenderPurple,
          aura: StaticColors.LavenderPurple,
          iconBg: isDarkMode
            ? StaticColors.MindfulDarkIconBg
            : StaticColors.MindfulLightBg,
        };
      }

      // 3. Events / Amber
      if (cat === 'events' || cat === 'event' || cat === 'alert') {
        return {
          bg: isDarkMode ? StaticColors.EventDarkBg : StaticColors.EventLightBg,
          border: isDarkMode
            ? StaticColors.AccentAmber
            : StaticColors.EventLightBorder,
          accent: StaticColors.AccentAmber,
          text: isDarkMode
            ? StaticColors.PureWhite
            : StaticColors.EventTextAccent,
          shadow: isDarkMode
            ? StaticColors.PureBlack
            : StaticColors.AccentAmber,
          aura: StaticColors.AccentAmber,
          iconBg: isDarkMode
            ? StaticColors.EventDarkIconBg
            : StaticColors.EventLightBg,
        };
      }

      // 4. Default: Works / Tasks (Imperial Gold)
      return {
        bg: isDarkMode ? StaticColors.WorkDarkBg : StaticColors.WorkLightBg,
        border: isDarkMode
          ? StaticColors.WorkDarkBorder
          : StaticColors.WorkLightBorder,
        accent: StaticColors.AccentYellow,
        text: isDarkMode ? StaticColors.PureWhite : StaticColors.WorkTextAccent,
        shadow: isDarkMode
          ? StaticColors.PureBlack
          : StaticColors.AccentYellow,
        aura: StaticColors.AccentYellow,
        iconBg: isDarkMode
          ? StaticColors.WorkDarkIconBg
          : StaticColors.WorkLightBg,
      };
    };
  }, [isDarkMode]);

  return {
    isDarkMode,
    activeThemeId,
    Colors,
    toggleTheme,
    setDarkMode,
    themePresets,
    bgMain,
    cardBg,
    surfaceAlt,
    inputBg,
    textPrimary,
    textSecondary,
    canvasTextPrimary,
    canvasTextSecondary,
    borderLight,
    borderSubtle,
    accent,
    accentDeep,
    accentLight,
    accentDark,
    accentAura,
    getCategoryTheme,
  };
};

export default useAppTheme;
