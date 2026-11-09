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
import { Colors } from '../Assets/StyleUtilities/Colors';
import { useTheme } from '../Theme/ThemeContext';

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
  size = 36,
}) => {
  const navigation = useNavigation<any>();
  const { isDarkMode } = useTheme();
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

  const cardBg = isDarkMode ? '#1E2228' : Colors.DefaultWhite;
  const iconColor = isScrolled
    ? Colors.DefaultWhite
    : isDarkMode
    ? Colors.PureWhiteText
    : '#1E2028';

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
                  ? 'rgba(255, 255, 255, 0.12)'
                  : '#FFFFFF',
                borderBottomColor: isDarkMode ? '#14161A' : '#D0CAD6',
                shadowColor: isDarkMode ? '#000000' : '#201646',
              },
          style,
        ]}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
      >
        <Settings size={20} color={iconColor} strokeWidth={2.2} />
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
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    borderColor: 'rgba(255, 255, 255, 0.45)',
    borderBottomColor: 'rgba(255, 255, 255, 0.28)',
    borderWidth: 1,
    borderBottomWidth: 2,
    shadowColor: '#201646',
    shadowOffset: { width: 0, height: 1.5 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 2,
  },
});

export default SettingsButton;
