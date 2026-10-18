import { Colors } from '../../../../Assets/StyleUtilities/Colors';
import { VoiceAssistantTheme } from './types';

export function getAssistantTheme(isDarkMode: boolean): VoiceAssistantTheme {
  return {
    isDarkMode,
    background: isDarkMode ? '#111317' : '#FAF8F5',
    cardBg: isDarkMode ? '#1B1E24' : '#FFFFFF',
    cardBorder: isDarkMode ? '#282C34' : '#E8E2D5',
    textPrimary: isDarkMode ? Colors.PureWhiteText : '#181A1F',
    textSecondary: isDarkMode ? '#A5ABB5' : '#5E6470',
    textMuted: isDarkMode ? '#6C727F' : '#8A919E',
    accent: isDarkMode ? '#9D9BF0' : '#5B58E6',
    success: isDarkMode ? '#34D399' : '#059669',
    warning: isDarkMode ? '#FBBF24' : '#D97706',
    error: isDarkMode ? '#F87171' : '#DC2626',
  };
}
