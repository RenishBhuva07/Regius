import { useTheme } from '../../../Theme/ThemeContext';
import { Colors as StaticColors } from '../../../Assets/StyleUtilities/Colors';
import { VOICE_AUDIO_ASSETS } from '../../../Assets/Audio';

export interface VoiceOption {
  id: string;
  kokoroVoiceId: string;
  name: string;
  tag: string;
  gender: 'Female' | 'Male' | 'Neutral';
  accent: string;
  sampleText: string;
  accentColor: string;
  bgColor: string;
  borderColor: string;
  personality: string;
  previewUrl: any;
}

export const DEFAULT_VOICE_SAMPLE_LINE =
  "It's a brand-new day, your favourite drink is waiting, and your plans are ready whenever you are.";

export const VOICES: VoiceOption[] = [
  {
    id: 'af_bella',
    kokoroVoiceId: 'af_bella',
    name: 'Bella',
    tag: 'Gentle & Clear',
    gender: 'Female',
    accent: 'American',
    sampleText: DEFAULT_VOICE_SAMPLE_LINE,
    accentColor: StaticColors.SunburstFlame,
    bgColor: StaticColors.VoiceBellaBg,
    borderColor: StaticColors.VoiceBellaBorder,
    personality: 'Supportive & Friendly',
    previewUrl: VOICE_AUDIO_ASSETS.af_bella,
  },
  {
    id: 'af_nicole',
    kokoroVoiceId: 'af_nicole',
    name: 'Nicole',
    tag: 'Crisp & Natural',
    gender: 'Female',
    accent: 'American',
    sampleText: DEFAULT_VOICE_SAMPLE_LINE,
    accentColor: StaticColors.VoiceNicoleAccent,
    bgColor: StaticColors.VoiceNicoleBg,
    borderColor: StaticColors.VoiceNicoleBorder,
    personality: 'Smart & Expressive',
    previewUrl: VOICE_AUDIO_ASSETS.af_nicole,
  },
  {
    id: 'am_adam',
    kokoroVoiceId: 'am_adam',
    name: 'Adam',
    tag: 'Deep & Authoritative',
    gender: 'Male',
    accent: 'American',
    sampleText: DEFAULT_VOICE_SAMPLE_LINE,
    accentColor: StaticColors.MidnightCharcoal,
    bgColor: StaticColors.WorkLightBg,
    borderColor: StaticColors.WorkLightBorder,
    personality: 'Focused & Decisive',
    previewUrl: VOICE_AUDIO_ASSETS.am_adam,
  },
  {
    id: 'am_michael',
    kokoroVoiceId: 'am_michael',
    name: 'Michael',
    tag: 'Confident & Smooth',
    gender: 'Male',
    accent: 'American',
    sampleText: DEFAULT_VOICE_SAMPLE_LINE,
    accentColor: StaticColors.VoiceMichaelAccent,
    bgColor: StaticColors.VoiceMichaelBg,
    borderColor: StaticColors.VoiceMichaelBorder,
    personality: 'Analytical & Swift',
    previewUrl: VOICE_AUDIO_ASSETS.am_michael,
  },
  {
    id: 'bf_emma',
    kokoroVoiceId: 'bf_emma',
    name: 'Emma',
    tag: 'Serene & Articulate',
    gender: 'Female',
    accent: 'British',
    sampleText: DEFAULT_VOICE_SAMPLE_LINE,
    accentColor: StaticColors.LuminousGreen,
    bgColor: StaticColors.WellnessLightBg,
    borderColor: StaticColors.WellnessLightBorder,
    personality: 'Calm & Grounded',
    previewUrl: VOICE_AUDIO_ASSETS.bf_emma,
  },
  {
    id: 'bm_george',
    kokoroVoiceId: 'bm_george',
    name: 'George',
    tag: 'Classic & Distinguished',
    gender: 'Male',
    accent: 'British',
    sampleText: DEFAULT_VOICE_SAMPLE_LINE,
    accentColor: StaticColors.PrimaryBlue,
    bgColor: StaticColors.VoiceGeorgeBg,
    borderColor: StaticColors.VoiceGeorgeBorder,
    personality: 'Refined & Sharp',
    previewUrl: VOICE_AUDIO_ASSETS.bm_george,
  },
  {
    id: 'af_heart',
    kokoroVoiceId: 'af_heart',
    name: 'Heart',
    tag: 'Warm & Energetic',
    gender: 'Female',
    accent: 'American',
    sampleText: DEFAULT_VOICE_SAMPLE_LINE,
    accentColor: StaticColors.LavenderPurple,
    bgColor: StaticColors.MindfulLightBg,
    borderColor: StaticColors.MindfulLightBorder,
    personality: 'Inspiring & Vibrant',
    previewUrl: VOICE_AUDIO_ASSETS.af_heart,
  },
];

export const useSettingsTheme = () => {
  const { Colors, isDarkMode, activeThemeId, toggleTheme } = useTheme();

  const bgMain =
    Colors.Background ||
    (isDarkMode ? StaticColors.DarkBackground : StaticColors.CreamBackground);
  const cardBg =
    Colors.CardBackground ||
    (isDarkMode ? StaticColors.DarkCardBackground : StaticColors.PureWhite);
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
  const surfaceAlt =
    Colors.SurfaceAlt ||
    (isDarkMode
      ? StaticColors.DarkSurfacePressed
      : StaticColors.CreamSurfaceMuted);
  const accent =
    Colors.Accent ||
    (isDarkMode ? StaticColors.AccentYellow : StaticColors.LavenderPurple);
  const accentDeep =
    Colors.AccentDeep ||
    (isDarkMode ? StaticColors.MidnightIndigo : StaticColors.LavenderPurple);

  return {
    Colors,
    isDarkMode,
    activeThemeId,
    toggleTheme,
    bgMain,
    cardBg,
    textPrimary,
    textSecondary,
    canvasTextPrimary,
    canvasTextSecondary,
    borderLight,
    surfaceAlt,
    accent,
    accentDeep,
  };
};
