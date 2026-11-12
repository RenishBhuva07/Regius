import React from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ChevronLeft } from 'lucide-react-native';
import { Colors, withAlpha } from '../Assets/StyleUtilities/Colors';
import { useTheme } from '../Theme/ThemeContext';
import ResponsivePixels from '../Assets/StyleUtilities/ResponsivePixels';

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
  const { isDarkMode, activeThemeId, Colors: themeColors } = useTheme();
  const isCyprusSand = activeThemeId === 'cyprus_sand';

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      navigation.goBack();
    }
  };

  const cardBg = isCyprusSand
    ? Colors.CyprusTealDark
    : themeColors.CardBackground ||
      (isDarkMode ? Colors.DarkCardBackground : Colors.PureWhite);
  const textPrimary =
    themeColors.PrimaryText ||
    (isDarkMode ? Colors.PureWhite : Colors.PureBlack);
  const chevronColor = isScrolled
    ? Colors.PureWhite
    : themeColors.CanvasTextPrimary ||
      (isDarkMode ? Colors.PureWhite : textPrimary);

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
              borderColor: isCyprusSand
                ? Colors.CyprusTealLight
                : isDarkMode
                ? withAlpha(Colors.PureWhite, 0.12)
                : Colors.PureWhite,
              borderBottomColor: isCyprusSand
                ? Colors.CyprusTealAbyss
                : isDarkMode
                ? Colors.DarkCanvasRich
                : Colors.WarmBtnBottomBevel,
              shadowColor: isDarkMode
                ? Colors.PureBlack
                : withAlpha(Colors.PureBlack, 0.08),
            },
        style,
      ]}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
    >
      <ChevronLeft
        size={ResponsivePixels.size20}
        color={chevronColor}
        strokeWidth={2.4}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  backButton: {
    width: ResponsivePixels.size40,
    height: ResponsivePixels.size40,
    borderRadius: ResponsivePixels.size20,
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
    backgroundColor: withAlpha(Colors.PureWhite, 0.2),
    borderColor: withAlpha(Colors.PureWhite, 0.4),
    borderBottomColor: withAlpha(Colors.PureWhite, 0.3),
  },
});

export default BackButton;

