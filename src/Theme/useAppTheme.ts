import { useMemo } from 'react';
import { useTheme, ThemePresetId, ThemeOption } from './ThemeContext';
import { Colors as StaticColors } from '../Assets/StyleUtilities/Colors';

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
    (isDarkMode ? '#121417' : StaticColors.CreamBackground);
  const cardBg = Colors.CardBackground || (isDarkMode ? '#1E2228' : '#FFFFFF');
  const surfaceAlt = Colors.SurfaceAlt || (isDarkMode ? '#181B20' : '#FAF8F5');
  const inputBg = isDarkMode ? Colors.SurfaceAlt || '#171A1F' : '#FFFFFF';
  const textPrimary =
    Colors.PrimaryText || (isDarkMode ? '#FFFFFF' : '#111111');
  const textSecondary =
    Colors.SecondaryText || (isDarkMode ? '#A3A8B1' : '#666665');
  const canvasTextPrimary =
    Colors.CanvasTextPrimary || (isDarkMode ? '#FFFFFF' : '#111111');
  const canvasTextSecondary =
    Colors.CanvasTextSecondary || (isDarkMode ? '#A3A8B1' : '#666665');
  const borderLight =
    Colors.BorderLight || (isDarkMode ? '#2C3035' : '#EAE5D9');
  const borderSubtle = isDarkMode ? '#22252B' : '#F0ECE1';

  const accent = Colors.Accent || (isDarkMode ? '#F5C518' : '#8383D6');
  const accentDeep =
    Colors.AccentDeep || (isDarkMode ? '#282048' : StaticColors.LavenderPurple);
  const accentLight = Colors.AccentLight || (isDarkMode ? '#F5C518' : '#9494EC');
  const accentDark = Colors.AccentDark || (isDarkMode ? '#14151C' : '#6C6CC4');
  const accentAura =
    Colors.AccentAura ||
    (isDarkMode ? 'rgba(245, 197, 24, 0.2)' : 'rgba(131, 131, 214, 0.25)');

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
          bg: isDarkMode ? '#162820' : '#EDFDF5',
          border: isDarkMode ? '#1B9A72' : '#C6FFDD',
          accent: '#52D22E',
          text: isDarkMode ? '#FFFFFF' : '#1B9A72',
          shadow: isDarkMode ? '#000000' : '#52D22E',
          aura: '#52D22E',
          iconBg: isDarkMode ? '#1F382D' : '#EDFDF5',
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
          bg: isDarkMode ? '#202336' : '#EFF2FE',
          border: isDarkMode ? '#8383D6' : '#D8DBFF',
          accent: '#8383D6',
          text: isDarkMode ? '#FFFFFF' : '#7059C8',
          shadow: isDarkMode ? '#000000' : '#8383D6',
          aura: '#8383D6',
          iconBg: isDarkMode ? '#2C304A' : '#EFF2FE',
        };
      }

      // 3. Events / Amber
      if (cat === 'events' || cat === 'event' || cat === 'alert') {
        return {
          bg: isDarkMode ? '#331F18' : '#FFF0DE',
          border: isDarkMode ? '#FF9800' : '#FFE0B2',
          accent: '#FF9800',
          text: isDarkMode ? '#FFFFFF' : '#E65100',
          shadow: isDarkMode ? '#000000' : '#FF9800',
          aura: '#FF9800',
          iconBg: isDarkMode ? '#442A20' : '#FFF0DE',
        };
      }

      // 4. Default: Works / Tasks (Imperial Gold)
      return {
        bg: isDarkMode ? '#2A2416' : '#FFFCEB',
        border: isDarkMode ? '#DEAA14' : '#FFF5B8',
        accent: '#F5C518',
        text: isDarkMode ? '#FFFFFF' : '#B48216',
        shadow: isDarkMode ? '#000000' : '#F5C518',
        aura: '#F5C518',
        iconBg: isDarkMode ? '#38301D' : '#FFFCEB',
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
