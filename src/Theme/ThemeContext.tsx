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
import { Colors } from '../Assets/StyleUtilities/Colors';

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
  CardBackground: Colors.DefaultWhite,
  PrimaryText: Colors.MidnightInkText,
  SecondaryText: Colors.SubtitleGray,
  ButtonBackground: Colors.ButtonDark,
  ButtonText: Colors.PureWhiteText,
  Accent: '#8383D6',
  SurfaceAlt: '#FAF8F5',
  BorderLight: '#E8E2D5',
};

// Prestige light themes
export const cyprusSandLightColors = {
  ...lightColors,
  Background: '#F0EDE5',
  CardBackground: '#FFFFFF',
  PrimaryText: '#002B28',
  SecondaryText: '#566B67',
  ButtonBackground: '#004643',
  ButtonText: '#F0EDE5',
  Accent: '#004643',
  SurfaceAlt: '#E6E2D8',
  BorderLight: '#D8D2C5',
};

export const emeraldVelvetLightColors = {
  ...lightColors,
  Background: '#F0F7F4',
  CardBackground: '#FFFFFF',
  PrimaryText: '#0E231B',
  SecondaryText: '#5A756C',
  ButtonBackground: '#1B9A72',
  ButtonText: '#FFFFFF',
  Accent: '#1B9A72',
  SurfaceAlt: '#E5F2EC',
  BorderLight: '#D2E8DE',
};

export const celestialAzureLightColors = {
  ...lightColors,
  Background: '#F0F4FC',
  CardBackground: '#FFFFFF',
  PrimaryText: '#0E1A33',
  SecondaryText: '#5C6E91',
  ButtonBackground: '#3B82F6',
  ButtonText: '#FFFFFF',
  Accent: '#3B82F6',
  SurfaceAlt: '#E5EDFA',
  BorderLight: '#D1E1F7',
};

export const obsidianGoldLightColors = {
  ...lightColors,
  Background: '#F7F7F8',
  CardBackground: '#FFFFFF',
  PrimaryText: '#111113',
  SecondaryText: '#6C6C75',
  ButtonBackground: '#1C1D22',
  ButtonText: '#FFD700',
  Accent: '#D4AF37',
  SurfaceAlt: '#EFEFF2',
  BorderLight: '#DDDDE2',
};

// Base dark palette
export const darkColors = {
  ...lightColors,
  Background: '#121417',
  CardBackground: '#1E2228',
  PrimaryText: Colors.PureWhiteText,
  SecondaryText: '#A3A8B1',
  ButtonBackground: '#FFFFFF',
  ButtonText: '#000000',
  Accent: '#F5C518',
  SurfaceAlt: '#171A1F',
  BorderLight: '#2C3035',
  IvoryMist: Colors.SlateGraphiteText,
  SilverDust: '#444A52',
  SoftLinen: '#3A3F46',
  FogGrey: '#4A5058',
};

// Prestige dark themes
export const cyprusSandDarkColors = {
  ...darkColors,
  Background: '#004643',
  CardBackground: '#075955',
  PrimaryText: '#F0EDE5',
  SecondaryText: '#A1BDBA',
  ButtonBackground: '#F0EDE5',
  ButtonText: '#004643',
  Accent: '#F0EDE5',
  SurfaceAlt: '#003835',
  BorderLight: '#0E6B66',
};

export const emeraldVelvetDarkColors = {
  ...darkColors,
  Background: '#0F1A15',
  CardBackground: '#162720',
  PrimaryText: '#E3F7EE',
  SecondaryText: '#8EAEA0',
  ButtonBackground: '#2ECC71',
  ButtonText: '#0B1711',
  Accent: '#2ECC71',
  SurfaceAlt: '#13211B',
  BorderLight: '#22382E',
};

export const celestialAzureDarkColors = {
  ...darkColors,
  Background: '#0D1424',
  CardBackground: '#141D34',
  PrimaryText: '#E6EEFA',
  SecondaryText: '#8DA0C7',
  ButtonBackground: '#60A5FA',
  ButtonText: '#090F1C',
  Accent: '#60A5FA',
  SurfaceAlt: '#11192C',
  BorderLight: '#1F2C4C',
};

export const obsidianGoldDarkColors = {
  ...darkColors,
  Background: '#08080A',
  CardBackground: '#121217',
  PrimaryText: '#FFFDF0',
  SecondaryText: '#B8AFA0',
  ButtonBackground: '#FFD700',
  ButtonText: '#000000',
  Accent: '#FFD700',
  SurfaceAlt: '#0E0E12',
  BorderLight: '#22222A',
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
    SecondaryText: isDark ? '#A3A8B1' : '#666665',
    ButtonBackground: isDark ? accent : '#242424',
    ButtonText: isDark
      ? isLightColor(accent)
        ? '#000000'
        : '#FFFFFF'
      : '#FFFFFF',
    SurfaceAlt: isDark ? '#171A1F' : '#FAF8F5',
    BorderLight: isDark ? '#2C3035' : '#E8E2D5',
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
  const surface = isDark ? '#1E2228' : '#FFFFFF';
  const foreground = isDark ? '#FFFFFF' : '#000000';
  return createThemePalette(canvas, surface, accent, foreground, overrides);
};

export const THEME_PRESETS_DATA: ThemePresetData[] = [
  {
    id: 'classic_light',
    name: 'Warm Cream',
    tagline: 'Timeless luxury cream canvas with deep midnight ink',
    accent: '#8383D6',
    requiredTierLevel: 1,
    palette: [
      { label: 'Canvas', hex: '#FFFCE3' },
      { label: 'Surface', hex: '#FFFFFF' },
      { label: 'Accent', hex: '#8383D6' },
      { label: 'Foreground', hex: '#000000' },
    ],
    lightPalette: [
      { label: 'Canvas', hex: '#FFFCE3' },
      { label: 'Surface', hex: '#FFFFFF' },
      { label: 'Accent', hex: '#8383D6' },
      { label: 'Foreground', hex: '#000000' },
    ],
    darkPalette: [
      { label: 'Canvas', hex: '#FFFCE3' },
      { label: 'Surface', hex: '#FFFFFF' },
      { label: 'Accent', hex: '#8383D6' },
      { label: 'Foreground', hex: '#000000' },
    ],
  },
  {
    id: 'classic_dark',
    name: 'Obsidian Night',
    tagline: 'Signature obsidian noir with imperial gold accents',
    accent: '#F5C518',
    requiredTierLevel: 1,
    palette: [
      { label: 'Canvas', hex: '#121417' },
      { label: 'Surface', hex: '#1E2228' },
      { label: 'Accent', hex: '#F5C518' },
      { label: 'Foreground', hex: '#FFFFFF' },
    ],
    lightPalette: [
      { label: 'Canvas', hex: '#121417' },
      { label: 'Surface', hex: '#1E2228' },
      { label: 'Accent', hex: '#F5C518' },
      { label: 'Foreground', hex: '#FFFFFF' },
    ],
    darkPalette: [
      { label: 'Canvas', hex: '#121417' },
      { label: 'Surface', hex: '#1E2228' },
      { label: 'Accent', hex: '#F5C518' },
      { label: 'Foreground', hex: '#FFFFFF' },
    ],
  },
  {
    id: 'cyprus_sand',
    name: 'Cyprus Sand',
    tagline: 'Deep architectural cyprus teal with sun-bleached coastal sand',
    accent: '#004643',
    requiredTierLevel: 2,
    palette: [
      { label: 'Canvas', hex: '#004643' },
      { label: 'Surface', hex: '#075955' },
      { label: 'Accent', hex: '#F0EDE5' },
      { label: 'Foreground', hex: '#F0EDE5' },
    ],
    lightPalette: [
      { label: 'Canvas', hex: '#F0EDE5' },
      { label: 'Surface', hex: '#FFFFFF' },
      { label: 'Accent', hex: '#004643' },
      { label: 'Foreground', hex: '#002B28' },
    ],
    darkPalette: [
      { label: 'Canvas', hex: '#004643' },
      { label: 'Surface', hex: '#075955' },
      { label: 'Accent', hex: '#F0EDE5' },
      { label: 'Foreground', hex: '#F0EDE5' },
    ],
  },
  {
    id: 'emerald_velvet',
    name: 'Emerald Velvet',
    tagline: 'Imperial deep emerald with radiant mint luster',
    accent: '#2ECC71',
    requiredTierLevel: 3,
    palette: [
      { label: 'Canvas', hex: '#0F1A15' },
      { label: 'Surface', hex: '#162720' },
      { label: 'Accent', hex: '#2ECC71' },
      { label: 'Foreground', hex: '#E3F7EE' },
    ],
    lightPalette: [
      { label: 'Canvas', hex: '#0F1A15' },
      { label: 'Surface', hex: '#162720' },
      { label: 'Accent', hex: '#2ECC71' },
      { label: 'Foreground', hex: '#E3F7EE' },
    ],
    darkPalette: [
      { label: 'Canvas', hex: '#0F1A15' },
      { label: 'Surface', hex: '#162720' },
      { label: 'Accent', hex: '#2ECC71' },
      { label: 'Foreground', hex: '#E3F7EE' },
    ],
  },
  {
    id: 'celestial_azure',
    name: 'Celestial Azure',
    tagline: 'Deep cosmic sapphire with electric celestial blue',
    accent: '#60A5FA',
    requiredTierLevel: 4,
    palette: [
      { label: 'Canvas', hex: '#0D1424' },
      { label: 'Surface', hex: '#141D34' },
      { label: 'Accent', hex: '#60A5FA' },
      { label: 'Foreground', hex: '#E6EEFA' },
    ],
    lightPalette: [
      { label: 'Canvas', hex: '#0D1424' },
      { label: 'Surface', hex: '#141D34' },
      { label: 'Accent', hex: '#60A5FA' },
      { label: 'Foreground', hex: '#E6EEFA' },
    ],
    darkPalette: [
      { label: 'Canvas', hex: '#0D1424' },
      { label: 'Surface', hex: '#141D34' },
      { label: 'Accent', hex: '#60A5FA' },
      { label: 'Foreground', hex: '#E6EEFA' },
    ],
  },
  {
    id: 'obsidian_gold',
    name: 'Obsidian Sovereign',
    tagline: 'Supreme jet black with pure 24K sovereign gold luster',
    accent: '#FFD700',
    requiredTierLevel: 5,
    palette: [
      { label: 'Canvas', hex: '#08080A' },
      { label: 'Surface', hex: '#121217' },
      { label: 'Accent', hex: '#FFD700' },
      { label: 'Foreground', hex: '#FFFDF0' },
    ],
    lightPalette: [
      { label: 'Canvas', hex: '#08080A' },
      { label: 'Surface', hex: '#121217' },
      { label: 'Accent', hex: '#FFD700' },
      { label: 'Foreground', hex: '#FFFDF0' },
    ],
    darkPalette: [
      { label: 'Canvas', hex: '#08080A' },
      { label: 'Surface', hex: '#121217' },
      { label: 'Accent', hex: '#FFD700' },
      { label: 'Foreground', hex: '#FFFDF0' },
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
