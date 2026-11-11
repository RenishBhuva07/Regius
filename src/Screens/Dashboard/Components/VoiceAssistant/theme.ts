import { Colors } from '../../../../Assets/StyleUtilities/Colors';
import { VoiceAssistantTheme } from './types';

export function getAssistantTheme(isDarkMode: boolean): VoiceAssistantTheme {
  return {
    isDarkMode,
    background: isDarkMode ? Colors.VoiceSheetDarkBg : Colors.CreamSurfaceAlt,
    cardBg: isDarkMode ? Colors.VoiceCardDarkBg : Colors.PureWhite,
    cardBorder: isDarkMode ? Colors.DarkSegmentedBorder : Colors.RingBorder,
    textPrimary: isDarkMode ? Colors.PureWhite : Colors.VoiceInkText,
    textSecondary: isDarkMode
      ? Colors.VoiceTextSecondaryDark
      : Colors.VoiceTextSecondaryLight,
    textMuted: isDarkMode
      ? Colors.VoiceTextMutedDark
      : Colors.VoiceTextMutedLight,
    accent: isDarkMode ? Colors.SiaOrbViolet : Colors.LavenderPurple,
    success: isDarkMode
      ? Colors.ToastSuccessCardBevelLight
      : Colors.ToastSuccessAccent,
    warning: isDarkMode ? Colors.Amber400 : Colors.AccentYellow,
    error: isDarkMode
      ? Colors.ToastErrorCardBevelLight
      : Colors.CategoryRedCheck,
  };
}
