import React, { createContext, useContext, useState } from 'react';
import { useColorScheme } from 'react-native';
import { Colors } from '../Assets/StyleUtilities/Colors';

export const lightColors = {
  ...Colors,
  Background: Colors.CreamBackground,
  CardBackground: Colors.DefaultWhite,
  PrimaryText: Colors.MidnightInkText,
  SecondaryText: Colors.SubtitleGray,
  ButtonBackground: Colors.ButtonDark,
  ButtonText: Colors.PureWhiteText,
};

export const darkColors = {
  ...lightColors,
  Background: '#121417',
  CardBackground: '#1E2228',
  PrimaryText: Colors.PureWhiteText,
  SecondaryText: '#A3A8B1',
  ButtonBackground: '#FFFFFF',
  ButtonText: '#000000',
  IvoryMist: Colors.SlateGraphiteText,
  SilverDust: '#444A52',
  SoftLinen: '#3A3F46',
  FogGrey: '#4A5058',
};

interface ThemeContextType {
  isDarkMode: boolean;
  Colors: typeof lightColors;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  isDarkMode: false,
  Colors: lightColors,
  toggleTheme: () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemTheme = useColorScheme();
  const [isDarkMode, setIsDarkMode] = useState(systemTheme === 'dark');

  const toggleTheme = () => setIsDarkMode(prev => !prev);
  const activeColors = isDarkMode ? darkColors : lightColors;

  return (
    <ThemeContext.Provider value={{ isDarkMode, Colors: activeColors, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
