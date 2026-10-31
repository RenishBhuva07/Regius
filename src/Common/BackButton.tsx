import React from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ChevronLeft } from 'lucide-react-native';
import { Colors } from '../Assets/StyleUtilities/Colors';
import { useTheme } from '../Theme/ThemeContext';

export interface BackButtonProps {
  onPress?: () => void;
  isScrolled?: boolean;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
}

export const BackButton: React.FC<BackButtonProps> = ({
  onPress,
  isScrolled = false,
  accessibilityLabel = 'Go back',
  style,
}) => {
  const navigation = useNavigation<any>();
  const { isDarkMode } = useTheme();

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      navigation.goBack();
    }
  };

  const cardBg = isDarkMode ? '#1E2228' : Colors.DefaultWhite;
  const textPrimary = isDarkMode
    ? Colors.PureWhiteText
    : Colors.MidnightInkText;

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={handlePress}
      style={[
        styles.backButton,
        isScrolled
          ? styles.backButtonScrolled
          : {
              backgroundColor: cardBg,
              borderColor: isDarkMode
                ? 'rgba(255, 255, 255, 0.12)'
                : '#FFFFFF',
              borderBottomColor: isDarkMode ? '#14161A' : '#DCD6CA',
              shadowColor: isDarkMode ? '#000000' : 'rgba(0, 0, 0, 0.08)',
            },
        style,
      ]}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
    >
      <ChevronLeft
        size={20}
        color={isScrolled ? Colors.DefaultWhite : textPrimary}
        strokeWidth={2.4}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1.5,
    borderBottomWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  backButtonScrolled: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderColor: 'rgba(255, 255, 255, 0.4)',
    borderBottomColor: 'rgba(255, 255, 255, 0.3)',
  },
});

export default BackButton;

