import React, { useRef } from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  StyleProp,
  ViewStyle,
  Animated,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Settings } from 'lucide-react-native';
import { Colors, withAlpha } from '../Assets/StyleUtilities/Colors';
import { useTheme } from '../Theme/ThemeContext';
import ResponsivePixels from '../Assets/StyleUtilities/ResponsivePixels';

export interface SettingsButtonProps {
  onPress?: () => void;
  isScrolled?: boolean;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
  size?: number;
}

export const SettingsButton: React.FC<SettingsButtonProps> = ({
  onPress,
  isScrolled = false,
  accessibilityLabel = 'Open Settings',
  style,
  size = ResponsivePixels.size36,
}) => {
  const navigation = useNavigation<any>();
  const { isDarkMode, activeThemeId, Colors: themeColors } = useTheme();
  const isCyprusSand = activeThemeId === 'cyprus_sand';
  const pressAnim = useRef(new Animated.Value(0)).current;

  const handlePressIn = () => {
    Animated.spring(pressAnim, {
      toValue: 1,
      useNativeDriver: true,
      friction: 8,
      tension: 140,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(pressAnim, {
      toValue: 0,
      useNativeDriver: true,
      friction: 8,
      tension: 140,
    }).start();
  };

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      navigation.navigate('Settings');
    }
  };

  const cardBg = isCyprusSand
    ? Colors.CyprusTealDark
    : themeColors.CardBackground ||
      (isDarkMode ? Colors.DarkCardBackground : Colors.PureWhite);
  const iconColor = isScrolled
    ? Colors.PureWhite
    : isCyprusSand
    ? Colors.CyprusSandPaper
    : isDarkMode
    ? Colors.PureWhite
    : Colors.DarkElevatedNero;

  const dynamicSize = {
    width: size,
    height: size,
    borderRadius: size / 2,
  };

  return (
    <Animated.View
      style={{
        transform: [
          {
            translateY: pressAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 1.4],
            }),
          },
          {
            scale: pressAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [1, 0.95],
            }),
          },
        ],
      }}
    >
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[
          styles.button,
          dynamicSize,
          isScrolled
            ? styles.buttonScrolled
            : {
                backgroundColor: cardBg,
                borderColor: isDarkMode
                  ? withAlpha(Colors.PureWhite, 0.12)
                  : Colors.PureWhite,
                borderBottomColor: isDarkMode
                  ? Colors.DarkCanvasRich
                  : Colors.CoolLavenderBevel,
                shadowColor: isDarkMode
                  ? Colors.PureBlack
                  : Colors.DeepVioletShadow,
              },
          style,
        ]}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        hitSlop={{ top: ResponsivePixels.size6, bottom: ResponsivePixels.size6, left: ResponsivePixels.size6, right: ResponsivePixels.size6 }}
      >
        <Settings size={ResponsivePixels.size20} color={iconColor} strokeWidth={2.2} />
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  button: {
    borderWidth: 1,
    borderBottomWidth: 2.2,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 1.5 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  buttonScrolled: {
    backgroundColor: withAlpha(Colors.PureWhite, 0.22),
    borderColor: withAlpha(Colors.PureWhite, 0.45),
    borderBottomColor: withAlpha(Colors.PureWhite, 0.28),
    borderWidth: 1,
    borderBottomWidth: 2,
    shadowColor: Colors.DeepVioletShadow,
    shadowOffset: { width: 0, height: 1.5 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 2,
  },
});

export default SettingsButton;
