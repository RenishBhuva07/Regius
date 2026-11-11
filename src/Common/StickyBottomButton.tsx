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
import { useTheme, isLightColor } from '../Theme/ThemeContext';

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
    const { isDarkMode, Colors: themeColors } = useTheme();

    const isInteractive = !loading && !disabled;

    const handlePress = () => {
      if (!isInteractive) return;
      if (haptic) {
        Vibration.vibrate(20);
      }
      onPress();
    };

    const themeAccent = themeColors.Accent || Colors.LavenderPurple;
    const themeBg = themeColors.Background || Colors.DarkBackground;
    const themeShadow = themeColors.AccentDark || Colors.PureBlack;

    // Color resolution per DESIGN_SYSTEM.md §4.2 & theme token architecture
    let resolvedBg =
      themeColors.ButtonBackground ||
      (isDarkMode ? themeAccent : Colors.MidnightCharcoal);
    let resolvedText =
      themeColors.ButtonText ||
      (isDarkMode
        ? isLightColor(resolvedBg)
          ? Colors.PureBlack
          : Colors.PureWhite
        : Colors.PureWhite);
    let resolvedShadow = isDarkMode ? themeShadow : Colors.PureBlack;

    if (variant === 'dark') {
      resolvedBg = Colors.MidnightCharcoal;
      resolvedText = Colors.PureWhite;
      resolvedShadow = Colors.PureBlack;
    } else if (variant === 'purple') {
      resolvedBg = themeAccent;
      resolvedText = isLightColor(themeAccent) ? Colors.PureBlack : Colors.PureWhite;
      resolvedShadow = themeShadow;
    } else if (variant === 'gold') {
      resolvedBg = Colors.AccentYellow;
      resolvedText = Colors.MidnightCharcoal;
      resolvedShadow = Colors.AccentYellow;
    } else if (variant === 'danger') {
      resolvedBg = Colors.MoltenRust;
      resolvedText = Colors.PureWhite;
      resolvedShadow = Colors.CrimsonPulse;
    }

    if (backgroundColor) resolvedBg = backgroundColor;
    if (textColor) resolvedText = textColor;
    if (shadowColor) resolvedShadow = shadowColor;

    // Safety guard: text must never match or blend into button background
    if (resolvedBg.toLowerCase() === resolvedText.toLowerCase()) {
      resolvedText = isLightColor(resolvedBg) ? Colors.PureBlack : Colors.PureWhite;
    }

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
