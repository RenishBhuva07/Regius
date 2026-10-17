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
    tag: 'af_bella • Gentle & Clear',
    gender: 'Female',
    accent: 'American',
    sampleText: DEFAULT_VOICE_SAMPLE_LINE,
    accentColor: '#FF5B65',
    bgColor: '#FFF0F0',
    borderColor: '#FFD6D6',
    personality: 'Supportive & Friendly',
    previewUrl: VOICE_AUDIO_ASSETS.af_bella,
  },
  {
    id: 'af_nicole',
    kokoroVoiceId: 'af_nicole',
    name: 'Nicole',
    tag: 'af_nicole • Crisp & Natural',
    gender: 'Female',
    accent: 'American',
    sampleText: DEFAULT_VOICE_SAMPLE_LINE,
    accentColor: '#A855F7',
    bgColor: '#FAF5FF',
    borderColor: '#E9D5FF',
    personality: 'Smart & Expressive',
    previewUrl: VOICE_AUDIO_ASSETS.af_nicole,
  },
  {
    id: 'am_adam',
    kokoroVoiceId: 'am_adam',
    name: 'Adam',
    tag: 'am_adam • Deep & Authoritative',
    gender: 'Male',
    accent: 'American',
    sampleText: DEFAULT_VOICE_SAMPLE_LINE,
    accentColor: '#1F2228',
    bgColor: '#FFFCEB',
    borderColor: '#FFF5B8',
    personality: 'Focused & Decisive',
    previewUrl: VOICE_AUDIO_ASSETS.am_adam,
  },
  {
    id: 'am_michael',
    kokoroVoiceId: 'am_michael',
    name: 'Michael',
    tag: 'am_michael • Confident & Smooth',
    gender: 'Male',
    accent: 'American',
    sampleText: DEFAULT_VOICE_SAMPLE_LINE,
    accentColor: '#F59E0B',
    bgColor: '#FFFBEB',
    borderColor: '#FDE68A',
    personality: 'Analytical & Swift',
    previewUrl: VOICE_AUDIO_ASSETS.am_michael,
  },
  {
    id: 'bf_emma',
    kokoroVoiceId: 'bf_emma',
    name: 'Emma',
    tag: 'bf_emma • Serene & Articulate',
    gender: 'Female',
    accent: 'British',
    sampleText: DEFAULT_VOICE_SAMPLE_LINE,
    accentColor: '#21AF85',
    bgColor: '#EDFDF5',
    borderColor: '#C6FFDD',
    personality: 'Calm & Grounded',
    previewUrl: VOICE_AUDIO_ASSETS.bf_emma,
  },
  {
    id: 'bm_george',
    kokoroVoiceId: 'bm_george',
    name: 'George',
    tag: 'bm_george • Classic & Distinguished',
    gender: 'Male',
    accent: 'British',
    sampleText: DEFAULT_VOICE_SAMPLE_LINE,
    accentColor: '#165DFF',
    bgColor: '#EFF4FE',
    borderColor: '#CFDEFE',
    personality: 'Refined & Sharp',
    previewUrl: VOICE_AUDIO_ASSETS.bm_george,
  },
  {
    id: 'af_heart',
    kokoroVoiceId: 'af_heart',
    name: 'Heart (Base)',
    tag: 'af • Warm & Energetic',
    gender: 'Female',
    accent: 'American',
    sampleText: DEFAULT_VOICE_SAMPLE_LINE,
    accentColor: '#8383D6',
    bgColor: '#EFF2FE',
    borderColor: '#D8DBFF',
    personality: 'Inspiring & Vibrant',
    previewUrl: VOICE_AUDIO_ASSETS.af_heart,
  },
];

export const useSettingsTheme = () => {
  const { Colors, isDarkMode, toggleTheme } = useTheme();

  const bgMain = isDarkMode ? '#121417' : StaticColors.CreamBackground;
  const cardBg = isDarkMode ? '#1E2228' : '#FFFFFF';
  const textPrimary = isDarkMode ? '#FFFFFF' : '#111111';
  const textSecondary = isDarkMode ? '#A3A8B1' : '#666665';
  const borderLight = isDarkMode ? '#2C3035' : '#EAE5D9';
  const surfaceAlt = isDarkMode ? '#181B20' : '#F7F5EC';

  return {
    Colors,
    isDarkMode,
    toggleTheme,
    bgMain,
    cardBg,
    textPrimary,
    textSecondary,
    borderLight,
    surfaceAlt,
  };
};
