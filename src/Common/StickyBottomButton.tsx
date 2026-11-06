import React from 'react';
import {
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
  ActivityIndicator,
  StyleProp,
  ViewStyle,
  TextStyle,
  Vibration,
} from 'react-native';
import { Fonts } from '../Theme/fonts';
import { Colors } from '../Assets/StyleUtilities/Colors';
import ResponsivePixels from '../Assets/StyleUtilities/ResponsivePixels';
import { useTheme } from '../Theme/ThemeContext';

export interface StickyBottomButtonProps {
  title: string;
  onPress: () => void;
  icon?: React.ReactNode;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'dark' | 'purple' | 'gold' | 'danger' | 'custom';
  backgroundColor?: string;
  textColor?: string;
  shadowColor?: string;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  haptic?: boolean;
}

/**
 * Standardized Sticky Bottom Action Dock Button conforming to DESIGN_SYSTEM.md §4.2.
 * Mirrors the luxury tactile geometry and state adaptation established in ProfileScreen.
 */
export const StickyBottomButton: React.FC<StickyBottomButtonProps> = React.memo(
  ({
    title,
    onPress,
    icon,
    loading = false,
    disabled = false,
    variant = 'primary',
    backgroundColor,
    textColor,
    shadowColor,
    accessibilityLabel,
    style,
    textStyle,
    haptic = true,
  }) => {
    const { isDarkMode } = useTheme();

    const isInteractive = !loading && !disabled;

    const handlePress = () => {
      if (!isInteractive) return;
      if (haptic) {
        Vibration.vibrate(20);
      }
      onPress();
    };

    // Color resolution per DESIGN_SYSTEM.md §4.2 & ProfileScreen standard
    let resolvedBg = isDarkMode
      ? Colors.LavenderPurple
      : Colors.MidnightCharcoal;
    let resolvedText = isDarkMode ? '#121417' : Colors.PureWhiteText;
    let resolvedShadow = isDarkMode ? Colors.LavenderPurple : '#000000';

    if (variant === 'dark') {
      resolvedBg = Colors.MidnightCharcoal;
      resolvedText = Colors.PureWhiteText;
      resolvedShadow = '#000000';
    } else if (variant === 'purple') {
      resolvedBg = Colors.LavenderPurple;
      resolvedText = '#121417';
      resolvedShadow = Colors.LavenderPurple;
    } else if (variant === 'gold') {
      resolvedBg = '#F5C518';
      resolvedText = '#1F2228';
      resolvedShadow = '#F5C518';
    } else if (variant === 'danger') {
      resolvedBg = '#D92A0F';
      resolvedText = '#FFFFFF';
      resolvedShadow = '#FF3B30';
    }

    if (backgroundColor) resolvedBg = backgroundColor;
    if (textColor) resolvedText = textColor;
    if (shadowColor) resolvedShadow = shadowColor;

    return (
      <TouchableOpacity
        activeOpacity={0.88}
        style={[
          styles.saveButton,
          {
            backgroundColor: resolvedBg,
            shadowColor: resolvedShadow,
          },
          (disabled || loading) && styles.disabledState,
          style,
        ]}
        onPress={handlePress}
        disabled={!isInteractive}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel || title}
      >
        {loading ? (
          <ActivityIndicator size="small" color={resolvedText} />
        ) : (
          <View style={styles.buttonContentRow}>
            {icon}
            <Text
              style={[
                styles.saveButtonText,
                { color: resolvedText },
                textStyle,
              ]}
            >
              {title}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    );
  },
);

const styles = StyleSheet.create({
  saveButton: {
    width: '100%',
    borderRadius: ResponsivePixels.size28,
    paddingVertical: ResponsivePixels.size15,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonContentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: ResponsivePixels.size8,
  },
  saveButtonText: {
    fontFamily: Fonts.poppins.bold,
    fontSize: ResponsivePixels.size15,
    letterSpacing: 0.2,
  },
  disabledState: {
    opacity: 0.75,
  },
});

export default StickyBottomButton;
