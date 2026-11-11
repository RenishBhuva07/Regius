/* eslint-disable no-bitwise */
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors, withAlpha } from '../Assets/StyleUtilities/Colors';

const THEME_STORAGE_KEY = '@regius_active_theme_id';
const DARK_MODE_STORAGE_KEY = '@regius_is_dark_mode';

export const isLightColor = (hex: string): boolean => {
  if (!hex || typeof hex !== 'string' || !hex.startsWith('#')) return false;
  const clean = hex.replace('#', '');
  const full =
    clean.length === 3
      ? clean
          .split('')
          .map(c => c + c)
          .join('')
      : clean;
  const num = parseInt(full, 16);
  if (isNaN(num)) return false;
  const r = (num >> 16) & 0xff;
  const g = (num >> 8) & 0xff;
  const b = (num >> 0) & 0xff;
  const luma = 0.299 * r + 0.587 * g + 0.114 * b;
  return luma > 165;
};

// Base light palette
export const lightColors = {
  ...Colors,
  Background: Colors.CreamBackground,
  CardBackground: Colors.PureWhite,
  PrimaryText: Colors.PureBlack,
  SecondaryText: Colors.SubtitleGray,
  CanvasTextPrimary: Colors.PureBlack,
  CanvasTextSecondary: Colors.SubtitleGray,
  ButtonBackground: Colors.ButtonDark,
  ButtonText: Colors.PureWhite,
  Accent: Colors.LavenderPurple,
  AccentDeep: Colors.LavenderPurple,
  AccentLight: Colors.LavenderPurple,
  AccentDark: Colors.LavenderDeep,
  AccentAura: withAlpha(Colors.LavenderPurple, 0.25),
  SurfaceAlt: Colors.CreamSurfaceAlt,
  BorderLight: Colors.RingBorder,
};

// Prestige light themes
export const cyprusSandLightColors = {
  ...lightColors,
  Background: Colors.CyprusSandPaper,
  CardBackground: Colors.PureWhite,
  PrimaryText: Colors.CyprusInkDark,
  SecondaryText: Colors.CyprusTextMuted,
  CanvasTextPrimary: Colors.CyprusInkDark,
  CanvasTextSecondary: Colors.CyprusTextMuted,
  ButtonBackground: Colors.CyprusTeal,
  ButtonText: Colors.CyprusSandPaper,
  Accent: Colors.CyprusTeal,
  AccentDeep: Colors.CyprusTealDeep,
  AccentLight: Colors.CyprusTealLight,
  AccentDark: Colors.CyprusTealAbyss,
  AccentAura: withAlpha(Colors.CyprusTeal, 0.22),
  SurfaceAlt: Colors.CyprusSandAlt,
  BorderLight: Colors.CyprusBorderLight,
};

export const emeraldVelvetLightColors = {
  ...lightColors,
  Background: Colors.EmeraldMistCanvas,
  CardBackground: Colors.PureWhite,
  PrimaryText: Colors.EmeraldInkDark,
  SecondaryText: Colors.EmeraldTextMuted,
  ButtonBackground: Colors.GreenGracious,
  ButtonText: Colors.PureWhite,
  Accent: Colors.GreenGracious,
  SurfaceAlt: Colors.EmeraldMistAlt,
  BorderLight: Colors.EmeraldBorderLight,
};

export const celestialAzureLightColors = {
  ...lightColors,
  Background: Colors.AzureMistCanvas,
  CardBackground: Colors.PureWhite,
  PrimaryText: Colors.AzureInkDark,
  SecondaryText: Colors.AzureTextMuted,
  ButtonBackground: Colors.AzureRoyal,
  ButtonText: Colors.PureWhite,
  Accent: Colors.AzureRoyal,
  SurfaceAlt: Colors.AzureMistAlt,
  BorderLight: Colors.AzureBorderLight,
};

export const obsidianGoldLightColors = {
  ...lightColors,
  Background: Colors.ObsidianLightCanvas,
  CardBackground: Colors.PureWhite,
  PrimaryText: Colors.ObsidianInkDark,
  SecondaryText: Colors.ObsidianTextMuted,
  ButtonBackground: Colors.NeroBlack,
  ButtonText: Colors.ObsidianGold,
  Accent: Colors.ObsidianGoldAntique,
  SurfaceAlt: Colors.ObsidianLightAlt,
  BorderLight: Colors.ObsidianBorderLight,
};

// Base dark palette
export const darkColors = {
  ...lightColors,
  Background: Colors.DarkBackground,
  CardBackground: Colors.DarkCardBackground,
  PrimaryText: Colors.PureWhite,
  SecondaryText: Colors.SteelMist,
  CanvasTextPrimary: Colors.PureWhite,
  CanvasTextSecondary: Colors.SteelMist,
  ButtonBackground: Colors.PureWhite,
  ButtonText: Colors.PureBlack,
  Accent: Colors.AccentYellow,
  AccentDeep: Colors.MidnightIndigo,
  AccentLight: Colors.AccentYellow,
  AccentDark: Colors.ObsidianNight,
  AccentAura: withAlpha(Colors.AccentYellow, 0.2),
  SurfaceAlt: Colors.DarkSurfaceAlt,
  BorderLight: Colors.CarbonSlate,
  IvoryMist: Colors.SlateGraphiteText,
  SilverDust: Colors.DarkSilverDust,
  SoftLinen: Colors.DarkSoftLinen,
  FogGrey: Colors.DarkFogGrey,
};

// Prestige dark themes
export const cyprusSandDarkColors = {
  ...darkColors,
  Background: Colors.CyprusTeal,
  CardBackground: Colors.CyprusSandPaper,
  PrimaryText: Colors.CyprusInkDark,
  SecondaryText: Colors.CyprusTextMuted,
  CanvasTextPrimary: Colors.CyprusSandPaper,
  CanvasTextSecondary: Colors.CyprusSeafoamMuted,
  ButtonBackground: Colors.CyprusSandPaper,
  ButtonText: Colors.CyprusTeal,
  Accent: Colors.CyprusTeal,
  AccentDeep: Colors.CyprusTealDeep,
  AccentLight: Colors.CyprusTealLight,
  AccentDark: Colors.CyprusTealAbyss,
  AccentAura: withAlpha(Colors.CyprusTeal, 0.28),
  SurfaceAlt: Colors.CyprusSandAlt,
  BorderLight: Colors.CyprusBorderDarkCard,
};

export const emeraldVelvetDarkColors = {
  ...darkColors,
  Background: Colors.EmeraldDarkCanvas,
  CardBackground: Colors.EmeraldDarkCard,
  PrimaryText: Colors.EmeraldTextLight,
  SecondaryText: Colors.EmeraldSageMuted,
  ButtonBackground: Colors.EmeraldVibrant,
  ButtonText: Colors.EmeraldButtonTextDark,
  Accent: Colors.EmeraldVibrant,
  SurfaceAlt: Colors.EmeraldDarkSurfaceAlt,
  BorderLight: Colors.EmeraldBorderDark,
};

export const celestialAzureDarkColors = {
  ...darkColors,
  Background: Colors.AzureDarkCanvas,
  CardBackground: Colors.AzureDarkCard,
  PrimaryText: Colors.AzureTextLight,
  SecondaryText: Colors.AzureSlateMuted,
  ButtonBackground: Colors.AzureSkyAccent,
  ButtonText: Colors.AzureButtonTextDark,
  Accent: Colors.AzureSkyAccent,
  SurfaceAlt: Colors.AzureDarkSurfaceAlt,
  BorderLight: Colors.AzureBorderDark,
};

export const obsidianGoldDarkColors = {
  ...darkColors,
  Background: Colors.ObsidianDarkCanvas,
  CardBackground: Colors.ObsidianDarkCard,
  PrimaryText: Colors.ObsidianTextLight,
  SecondaryText: Colors.ObsidianSandMuted,
  ButtonBackground: Colors.ObsidianGold,
  ButtonText: Colors.PureBlack,
  Accent: Colors.ObsidianGold,
  SurfaceAlt: Colors.ObsidianDarkSurfaceAlt,
  BorderLight: Colors.ObsidianBorderDark,
};

export type ThemePresetId =
  | 'classic_light'
  | 'classic_dark'
  | 'cyprus_sand'
  | 'emerald_velvet'
  | 'celestial_azure'
  | 'obsidian_gold';

export interface ThemeColorItem {
  label: string;
  hex: string;
}

export interface ThemeOption {
  id: ThemePresetId;
  name: string;
  tagline: string;
  accent: string;
  previewBg: string;
  requiredTierLevel: number;
  palette: [ThemeColorItem, ThemeColorItem, ThemeColorItem, ThemeColorItem];
  lightPalette: [
    ThemeColorItem,
    ThemeColorItem,
    ThemeColorItem,
    ThemeColorItem,
  ];
  darkPalette: [ThemeColorItem, ThemeColorItem, ThemeColorItem, ThemeColorItem];
}

export interface ThemePresetData {
  id: ThemePresetId;
  name: string;
  tagline: string;
  accent: string;
  requiredTierLevel: number;
  palette: [ThemeColorItem, ThemeColorItem, ThemeColorItem, ThemeColorItem];
  lightPalette: [
    ThemeColorItem,
    ThemeColorItem,
    ThemeColorItem,
    ThemeColorItem,
  ];
  darkPalette: [ThemeColorItem, ThemeColorItem, ThemeColorItem, ThemeColorItem];
}

/**
 * Helper to generate a full theme color dictionary from 4 primary colors.
 * Used for easily adding new custom themes in the future.
 */
export const createThemePalette = (
  canvas: string,
  surface: string,
  accent: string,
  foreground: string,
  overrides?: Partial<typeof lightColors>,
): typeof lightColors => {
  const isDark = !isLightColor(canvas);
  const base = isDark ? darkColors : lightColors;
  return {
    ...base,
    Background: canvas,
    CardBackground: surface,
    Accent: accent,
    PrimaryText: foreground,
    SecondaryText: isDark ? Colors.SteelMist : Colors.SubtitleGray,
    ButtonBackground: isDark ? accent : Colors.ButtonDark,
    ButtonText: isDark
      ? isLightColor(accent)
        ? Colors.PureBlack
        : Colors.PureWhite
      : Colors.PureWhite,
    SurfaceAlt: isDark ? Colors.DarkSurfaceAlt : Colors.CreamSurfaceAlt,
    BorderLight: isDark ? Colors.CarbonSlate : Colors.RingBorder,
    ...overrides,
  };
};

/**
 * Helper to generate a full theme color dictionary from ONLY TWO colors:
 * Canvas (Background) and Accent (Brand Highlight), benchmarked against Warm Cream.
 */
export const createThemePaletteFromTwoColors = (
  canvas: string,
  accent: string,
  overrides?: Partial<typeof lightColors>,
): typeof lightColors => {
  const isDark = !isLightColor(canvas);
  const surface = isDark ? Colors.DarkCardBackground : Colors.PureWhite;
  const foreground = isDark ? Colors.PureWhite : Colors.PureBlack;
  return createThemePalette(canvas, surface, accent, foreground, overrides);
};

export const THEME_PRESETS_DATA: ThemePresetData[] = [
  {
    id: 'classic_light',
    name: 'Warm Cream',
    tagline: 'Timeless luxury cream canvas with deep midnight ink',
    accent: Colors.LavenderPurple,
    requiredTierLevel: 1,
    palette: [
      { label: 'Canvas', hex: Colors.CreamBackground },
      { label: 'Surface', hex: Colors.PureWhite },
      { label: 'Accent', hex: Colors.LavenderPurple },
      { label: 'Foreground', hex: Colors.PureBlack },
    ],
    lightPalette: [
      { label: 'Canvas', hex: Colors.CreamBackground },
      { label: 'Surface', hex: Colors.PureWhite },
      { label: 'Accent', hex: Colors.LavenderPurple },
      { label: 'Foreground', hex: Colors.PureBlack },
    ],
    darkPalette: [
      { label: 'Canvas', hex: Colors.CreamBackground },
      { label: 'Surface', hex: Colors.PureWhite },
      { label: 'Accent', hex: Colors.LavenderPurple },
      { label: 'Foreground', hex: Colors.PureBlack },
    ],
  },
  {
    id: 'classic_dark',
    name: 'Obsidian Night',
    tagline: 'Signature obsidian noir with imperial gold accents',
    accent: Colors.AccentYellow,
    requiredTierLevel: 1,
    palette: [
      { label: 'Canvas', hex: Colors.DarkBackground },
      { label: 'Surface', hex: Colors.DarkCardBackground },
      { label: 'Accent', hex: Colors.AccentYellow },
      { label: 'Foreground', hex: Colors.PureWhite },
    ],
    lightPalette: [
      { label: 'Canvas', hex: Colors.DarkBackground },
      { label: 'Surface', hex: Colors.DarkCardBackground },
      { label: 'Accent', hex: Colors.AccentYellow },
      { label: 'Foreground', hex: Colors.PureWhite },
    ],
    darkPalette: [
      { label: 'Canvas', hex: Colors.DarkBackground },
      { label: 'Surface', hex: Colors.DarkCardBackground },
      { label: 'Accent', hex: Colors.AccentYellow },
      { label: 'Foreground', hex: Colors.PureWhite },
    ],
  },
  {
    id: 'cyprus_sand',
    name: 'Cyprus Sand',
    tagline: 'Deep architectural cyprus teal with sun-bleached coastal sand',
    accent: Colors.CyprusTeal,
    requiredTierLevel: 2,
    palette: [
      { label: 'Canvas', hex: Colors.CyprusTeal },
      { label: 'Surface', hex: Colors.CyprusSandPaper },
      { label: 'Accent', hex: Colors.CyprusTeal },
      { label: 'Foreground', hex: Colors.CyprusInkDark },
    ],
    lightPalette: [
      { label: 'Canvas', hex: Colors.CyprusSandPaper },
      { label: 'Surface', hex: Colors.PureWhite },
      { label: 'Accent', hex: Colors.CyprusTeal },
      { label: 'Foreground', hex: Colors.CyprusInkDark },
    ],
    darkPalette: [
      { label: 'Canvas', hex: Colors.CyprusTeal },
      { label: 'Surface', hex: Colors.CyprusSandPaper },
      { label: 'Accent', hex: Colors.CyprusTeal },
      { label: 'Foreground', hex: Colors.CyprusInkDark },
    ],
  },
  {
    id: 'emerald_velvet',
    name: 'Emerald Velvet',
    tagline: 'Imperial deep emerald with radiant mint luster',
    accent: Colors.EmeraldVibrant,
    requiredTierLevel: 3,
    palette: [
      { label: 'Canvas', hex: Colors.EmeraldDarkCanvas },
      { label: 'Surface', hex: Colors.EmeraldDarkCard },
      { label: 'Accent', hex: Colors.EmeraldVibrant },
      { label: 'Foreground', hex: Colors.EmeraldTextLight },
    ],
    lightPalette: [
      { label: 'Canvas', hex: Colors.EmeraldDarkCanvas },
      { label: 'Surface', hex: Colors.EmeraldDarkCard },
      { label: 'Accent', hex: Colors.EmeraldVibrant },
      { label: 'Foreground', hex: Colors.EmeraldTextLight },
    ],
    darkPalette: [
      { label: 'Canvas', hex: Colors.EmeraldDarkCanvas },
      { label: 'Surface', hex: Colors.EmeraldDarkCard },
      { label: 'Accent', hex: Colors.EmeraldVibrant },
      { label: 'Foreground', hex: Colors.EmeraldTextLight },
    ],
  },
  {
    id: 'celestial_azure',
    name: 'Celestial Azure',
    tagline: 'Deep cosmic sapphire with electric celestial blue',
    accent: Colors.AzureSkyAccent,
    requiredTierLevel: 4,
    palette: [
      { label: 'Canvas', hex: Colors.AzureDarkCanvas },
      { label: 'Surface', hex: Colors.AzureDarkCard },
      { label: 'Accent', hex: Colors.AzureSkyAccent },
      { label: 'Foreground', hex: Colors.AzureTextLight },
    ],
    lightPalette: [
      { label: 'Canvas', hex: Colors.AzureDarkCanvas },
      { label: 'Surface', hex: Colors.AzureDarkCard },
      { label: 'Accent', hex: Colors.AzureSkyAccent },
      { label: 'Foreground', hex: Colors.AzureTextLight },
    ],
    darkPalette: [
      { label: 'Canvas', hex: Colors.AzureDarkCanvas },
      { label: 'Surface', hex: Colors.AzureDarkCard },
      { label: 'Accent', hex: Colors.AzureSkyAccent },
      { label: 'Foreground', hex: Colors.AzureTextLight },
    ],
  },
  {
    id: 'obsidian_gold',
    name: 'Obsidian Sovereign',
    tagline: 'Supreme jet black with pure 24K sovereign gold luster',
    accent: Colors.ObsidianGold,
    requiredTierLevel: 5,
    palette: [
      { label: 'Canvas', hex: Colors.ObsidianDarkCanvas },
      { label: 'Surface', hex: Colors.ObsidianDarkCard },
      { label: 'Accent', hex: Colors.ObsidianGold },
      { label: 'Foreground', hex: Colors.ObsidianTextLight },
    ],
    lightPalette: [
      { label: 'Canvas', hex: Colors.ObsidianDarkCanvas },
      { label: 'Surface', hex: Colors.ObsidianDarkCard },
      { label: 'Accent', hex: Colors.ObsidianGold },
      { label: 'Foreground', hex: Colors.ObsidianTextLight },
    ],
    darkPalette: [
      { label: 'Canvas', hex: Colors.ObsidianDarkCanvas },
      { label: 'Surface', hex: Colors.ObsidianDarkCard },
      { label: 'Accent', hex: Colors.ObsidianGold },
      { label: 'Foreground', hex: Colors.ObsidianTextLight },
    ],
  },
];

export const THEME_PRESETS: ThemeOption[] = THEME_PRESETS_DATA.map(item => ({
  ...item,
  previewBg: item.palette[0].hex,
}));

export const getThemePresetsForMode = (_isDark?: boolean): ThemeOption[] => {
  return THEME_PRESETS;
};

interface ThemeContextType {
  isDarkMode: boolean;
  Colors: typeof lightColors;
  toggleTheme: () => void;
  setDarkMode: (enabled: boolean) => void;
  activeThemeId: ThemePresetId;
  setActiveThemeId: (id: ThemePresetId) => void;
  themePresets: ThemeOption[];
}

export const ThemeContext = createContext<ThemeContextType>({
  isDarkMode: false,
  Colors: lightColors,
  toggleTheme: () => {},
  setDarkMode: () => {},
  activeThemeId: 'classic_light',
  setActiveThemeId: () => {},
  themePresets: THEME_PRESETS,
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const systemTheme = useColorScheme();
  const [activeThemeId, setActiveThemeIdState] = useState<ThemePresetId>(
    systemTheme === 'dark' ? 'classic_dark' : 'classic_light',
  );

  useEffect(() => {
    AsyncStorage.getItem(THEME_STORAGE_KEY)
      .then(saved => {
        if (saved && THEME_PRESETS_DATA.some(p => p.id === saved)) {
          setActiveThemeIdState(saved as ThemePresetId);
        }
      })
      .catch(() => {});
  }, []);

  const setActiveThemeId = useCallback((id: ThemePresetId) => {
    setActiveThemeIdState(id);
    AsyncStorage.setItem(THEME_STORAGE_KEY, id).catch(() => {});
  }, []);

  const toggleTheme = useCallback(() => {
    setActiveThemeIdState(currTheme => {
      const nextTheme =
        currTheme === 'classic_light' ? 'classic_dark' : 'classic_light';
      AsyncStorage.setItem(THEME_STORAGE_KEY, nextTheme).catch(() => {});
      return nextTheme;
    });
  }, []);

  const setDarkMode = useCallback((enabled: boolean) => {
    const nextTheme = enabled ? 'classic_dark' : 'classic_light';
    setActiveThemeIdState(nextTheme);
    AsyncStorage.setItem(THEME_STORAGE_KEY, nextTheme).catch(() => {});
  }, []);

  const activeColors = useMemo(() => {
    switch (activeThemeId) {
      case 'cyprus_sand':
        return cyprusSandDarkColors;
      case 'emerald_velvet':
        return emeraldVelvetDarkColors;
      case 'celestial_azure':
        return celestialAzureDarkColors;
      case 'obsidian_gold':
        return obsidianGoldDarkColors;
      case 'classic_dark':
        return darkColors;
      case 'classic_light':
      default:
        return lightColors;
    }
  }, [activeThemeId]);

  // isDarkMode is now dynamically computed from the active theme's Background canvas
  const isDarkMode = useMemo(() => {
    return !isLightColor(activeColors.Background);
  }, [activeColors.Background]);

  return (
    <ThemeContext.Provider
      value={{
        isDarkMode,
        Colors: activeColors,
        toggleTheme,
        setDarkMode,
        activeThemeId,
        setActiveThemeId,
        themePresets: THEME_PRESETS,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
