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

// --- BASE LIGHT COLORS ---
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

// --- PRESTIGE LIGHT THEMES ---
export const champagneGoldLightColors = {
  ...lightColors,
  Background: '#FAF6EE',
  CardBackground: '#FFFFFF',
  PrimaryText: '#241E15',
  SecondaryText: '#7A6E5D',
  ButtonBackground: '#C5A059',
  ButtonText: '#FFFFFF',
  Accent: '#C5A059',
  SurfaceAlt: '#F5EFE4',
  BorderLight: '#EBE2D3',
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

// --- BASE DARK COLORS ---
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

// --- PRESTIGE DARK THEMES ---
export const champagneGoldDarkColors = {
  ...darkColors,
  Background: '#161410',
  CardBackground: '#221F18',
  PrimaryText: '#F7E7CE',
  SecondaryText: '#C4B59D',
  ButtonBackground: '#D4AF37',
  ButtonText: '#12100B',
  Accent: '#D4AF37',
  SurfaceAlt: '#1D1A14',
  BorderLight: '#332E24',
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
  | 'champagne_gold'
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
  lightPalette: [
    ThemeColorItem,
    ThemeColorItem,
    ThemeColorItem,
    ThemeColorItem,
  ];
  darkPalette: [ThemeColorItem, ThemeColorItem, ThemeColorItem, ThemeColorItem];
}

export const THEME_PRESETS_DATA: ThemePresetData[] = [
  {
    id: 'classic_dark',
    name: 'Obsidian Night',
    tagline: 'Signature obsidian noir with imperial gold accents',
    accent: '#F5C518',
    requiredTierLevel: 1,
    lightPalette: [
      { label: 'Canvas', hex: '#FFFCE3' },
      { label: 'Surface', hex: '#FFFFFF' },
      { label: 'Accent', hex: '#8383D6' },
      { label: 'Foreground', hex: '#121417' },
    ],
    darkPalette: [
      { label: 'Canvas', hex: '#121417' },
      { label: 'Surface', hex: '#1E2228' },
      { label: 'Accent', hex: '#F5C518' },
      { label: 'Foreground', hex: '#FFFFFF' },
    ],
  },
  {
    id: 'classic_light',
    name: 'Warm Cream',
    tagline: 'Timeless luxury cream canvas with deep midnight ink',
    accent: '#8383D6',
    requiredTierLevel: 1,
    lightPalette: [
      { label: 'Canvas', hex: '#FFFCE3' },
      { label: 'Surface', hex: '#FFFFFF' },
      { label: 'Accent', hex: '#8383D6' },
      { label: 'Foreground', hex: '#121417' },
    ],
    darkPalette: [
      { label: 'Canvas', hex: '#121417' },
      { label: 'Surface', hex: '#1E2228' },
      { label: 'Accent', hex: '#F5C518' },
      { label: 'Foreground', hex: '#FFFFFF' },
    ],
  },
  {
    id: 'champagne_gold',
    name: 'Champagne Gold',
    tagline: 'Warm bronze and glowing champagne luminescence',
    accent: '#D4AF37',
    requiredTierLevel: 2,
    lightPalette: [
      { label: 'Canvas', hex: '#FAF6EE' },
      { label: 'Surface', hex: '#FFFFFF' },
      { label: 'Accent', hex: '#C5A059' },
      { label: 'Foreground', hex: '#241E15' },
    ],
    darkPalette: [
      { label: 'Canvas', hex: '#161410' },
      { label: 'Surface', hex: '#221F18' },
      { label: 'Accent', hex: '#D4AF37' },
      { label: 'Foreground', hex: '#F7E7CE' },
    ],
  },
  {
    id: 'emerald_velvet',
    name: 'Emerald Velvet',
    tagline: 'Imperial deep emerald with radiant mint luster',
    accent: '#2ECC71',
    requiredTierLevel: 3,
    lightPalette: [
      { label: 'Canvas', hex: '#F0F7F4' },
      { label: 'Surface', hex: '#FFFFFF' },
      { label: 'Accent', hex: '#1B9A72' },
      { label: 'Foreground', hex: '#0E231B' },
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
    lightPalette: [
      { label: 'Canvas', hex: '#F0F4FC' },
      { label: 'Surface', hex: '#FFFFFF' },
      { label: 'Accent', hex: '#3B82F6' },
      { label: 'Foreground', hex: '#0E1A33' },
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
    lightPalette: [
      { label: 'Canvas', hex: '#F7F7F8' },
      { label: 'Surface', hex: '#FFFFFF' },
      { label: 'Accent', hex: '#D4AF37' },
      { label: 'Foreground', hex: '#111113' },
    ],
    darkPalette: [
      { label: 'Canvas', hex: '#08080A' },
      { label: 'Surface', hex: '#121217' },
      { label: 'Accent', hex: '#FFD700' },
      { label: 'Foreground', hex: '#FFFDF0' },
    ],
  },
];

export const getThemePresetsForMode = (isDark: boolean): ThemeOption[] => {
  return THEME_PRESETS_DATA.map(item => {
    // For classic_light vs classic_dark, keep their primary brand previewBg
    const previewBg =
      item.id === 'classic_light'
        ? item.lightPalette[0].hex
        : item.id === 'classic_dark'
        ? item.darkPalette[0].hex
        : isDark
        ? item.darkPalette[0].hex
        : item.lightPalette[0].hex;

    const palette = isDark ? item.darkPalette : item.lightPalette;

    return {
      ...item,
      previewBg,
      palette,
    };
  });
};

export const THEME_PRESETS: ThemeOption[] = getThemePresetsForMode(false);

interface ThemeContextType {
  isDarkMode: boolean;
  Colors: typeof lightColors;
  toggleTheme: () => void;
  setDarkMode: (enabled: boolean) => void;
  activeThemeId: ThemePresetId;
  setActiveThemeId: (id: ThemePresetId) => void;
  themePresets: ThemeOption[];
}

const ThemeContext = createContext<ThemeContextType>({
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
  const [isDarkMode, setIsDarkMode] = useState<boolean>(systemTheme === 'dark');

  useEffect(() => {
    AsyncStorage.getItem(THEME_STORAGE_KEY)
      .then(saved => {
        if (saved && THEME_PRESETS_DATA.some(p => p.id === saved)) {
          setActiveThemeIdState(saved as ThemePresetId);
        }
      })
      .catch(() => {});

    AsyncStorage.getItem(DARK_MODE_STORAGE_KEY)
      .then(saved => {
        if (saved !== null) {
          setIsDarkMode(saved === 'true');
        }
      })
      .catch(() => {});
  }, []);

  const setActiveThemeId = useCallback((id: ThemePresetId) => {
    setActiveThemeIdState(id);
    AsyncStorage.setItem(THEME_STORAGE_KEY, id).catch(() => {});

    // Automatically align dark mode when user explicitly selects classic_light or classic_dark
    if (id === 'classic_light') {
      setIsDarkMode(false);
      AsyncStorage.setItem(DARK_MODE_STORAGE_KEY, 'false').catch(() => {});
    } else if (id === 'classic_dark') {
      setIsDarkMode(true);
      AsyncStorage.setItem(DARK_MODE_STORAGE_KEY, 'true').catch(() => {});
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setIsDarkMode(prev => {
      const next = !prev;
      AsyncStorage.setItem(DARK_MODE_STORAGE_KEY, String(next)).catch(() => {});

      // If on classic themes, seamlessly align activeThemeId
      setActiveThemeIdState(currTheme => {
        if (currTheme === 'classic_light' && next) {
          AsyncStorage.setItem(THEME_STORAGE_KEY, 'classic_dark').catch(
            () => {},
          );
          return 'classic_dark';
        }
        if (currTheme === 'classic_dark' && !next) {
          AsyncStorage.setItem(THEME_STORAGE_KEY, 'classic_light').catch(
            () => {},
          );
          return 'classic_light';
        }
        return currTheme;
      });

      return next;
    });
  }, []);

  const setDarkMode = useCallback((enabled: boolean) => {
    setIsDarkMode(enabled);
    AsyncStorage.setItem(DARK_MODE_STORAGE_KEY, String(enabled)).catch(
      () => {},
    );
  }, []);

  const activeColors = useMemo(() => {
    if (isDarkMode) {
      switch (activeThemeId) {
        case 'champagne_gold':
          return champagneGoldDarkColors;
        case 'emerald_velvet':
          return emeraldVelvetDarkColors;
        case 'celestial_azure':
          return celestialAzureDarkColors;
        case 'obsidian_gold':
          return obsidianGoldDarkColors;
        case 'classic_light':
        case 'classic_dark':
        default:
          return darkColors;
      }
    } else {
      switch (activeThemeId) {
        case 'champagne_gold':
          return champagneGoldLightColors;
        case 'emerald_velvet':
          return emeraldVelvetLightColors;
        case 'celestial_azure':
          return celestialAzureLightColors;
        case 'obsidian_gold':
          return obsidianGoldLightColors;
        case 'classic_dark':
        case 'classic_light':
        default:
          return lightColors;
      }
    }
  }, [activeThemeId, isDarkMode]);

  const currentThemePresets = useMemo(() => {
    return getThemePresetsForMode(isDarkMode);
  }, [isDarkMode]);

  return (
    <ThemeContext.Provider
      value={{
        isDarkMode,
        Colors: activeColors,
        toggleTheme,
        setDarkMode,
        activeThemeId,
        setActiveThemeId,
        themePresets: currentThemePresets,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
