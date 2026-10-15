import { useTheme } from '../../../Theme/ThemeContext';
import { Colors as StaticColors } from '../../../Assets/StyleUtilities/Colors';

export interface VoiceOption {
  id: string;
  name: string;
  tag: string;
  gender: 'Female' | 'Male' | 'Neutral';
  accent: string;
  sampleText: string;
  accentColor: string;
  bgColor: string;
  borderColor: string;
  personality: string;
}

export const VOICES: VoiceOption[] = [
  {
    id: 'nova',
    name: 'Nova',
    tag: 'Warm & Energetic',
    gender: 'Female',
    accent: 'American',
    sampleText:
      'Good morning! I have prepared your schedule and reminders for today.',
    accentColor: '#8383D6',
    bgColor: '#EFF2FE',
    borderColor: '#D8DBFF',
    personality: 'Inspiring & Vibrant',
  },
  {
    id: 'atlas',
    name: 'Atlas',
    tag: 'Deep & Authoritative',
    gender: 'Male',
    accent: 'American',
    sampleText:
      'All systems organized. You have 3 pending tasks due this afternoon.',
    accentColor: '#1F2228',
    bgColor: '#FFFCEB',
    borderColor: '#FFF5B8',
    personality: 'Focused & Decisive',
  },
  {
    id: 'aura',
    name: 'Aura',
    tag: 'Serene & Mindful',
    gender: 'Neutral',
    accent: 'British',
    sampleText:
      'Take a deep breath. Let us review your daily habits one step at a time.',
    accentColor: '#21AF85',
    bgColor: '#EDFDF5',
    borderColor: '#C6FFDD',
    personality: 'Calm & Grounded',
  },
  {
    id: 'orion',
    name: 'Orion',
    tag: 'Articulate & Classic',
    gender: 'Male',
    accent: 'British',
    sampleText:
      'Greetings. Your quarterly review call is scheduled promptly for 11:00 AM.',
    accentColor: '#165DFF',
    bgColor: '#EFF4FE',
    borderColor: '#CFDEFE',
    personality: 'Refined & Sharp',
  },
  {
    id: 'celeste',
    name: 'Celeste',
    tag: 'Gentle & Empathetic',
    gender: 'Female',
    accent: 'Australian',
    sampleText:
      'Great progress on your workout today! Remember to drink plenty of water.',
    accentColor: '#FF5B65',
    bgColor: '#FFF0F0',
    borderColor: '#FFD6D6',
    personality: 'Supportive & Friendly',
  },
  {
    id: 'echo',
    name: 'Echo',
    tag: 'Futuristic & Crisp',
    gender: 'Neutral',
    accent: 'Synthetic Global',
    sampleText:
      'Regius neural core synced. All task priority rankings updated.',
    accentColor: '#F5C518',
    bgColor: '#FFFCEB',
    borderColor: '#FFF5B8',
    personality: 'Analytical & Swift',
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
