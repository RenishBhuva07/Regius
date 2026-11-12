import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TextStyle,
  AccessibilityRole,
} from 'react-native';
import { Fonts } from '../Theme/fonts';
import { Colors, withAlpha } from '../Assets/StyleUtilities/Colors';
import ResponsivePixels from '../Assets/StyleUtilities/ResponsivePixels';

export interface HeaderActionButtonProps {
  label: string;
  icon?:
    | React.ComponentType<{
        size?: number;
        color?: string;
        strokeWidth?: number;
      }>
    | React.ReactNode;
  iconPosition?: 'left' | 'right';
  onPress: () => void;
  accentColor?: string;
  iconBgColor?: string;
  backgroundColor?: string;
  borderColor?: string;
  activeOpacity?: number;
  accessibilityLabel?: string;
  accessibilityRole?: AccessibilityRole;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  disabled?: boolean;
}

export const HeaderActionButton: React.FC<HeaderActionButtonProps> = ({
  label,
  icon,
  iconPosition = 'left',
  onPress,
  accentColor = Colors.AccentYellow,
  iconBgColor,
  backgroundColor = Colors.DarkElevatedNero,
  borderColor = Colors.DarkBorder,
  activeOpacity = 0.8,
  accessibilityLabel,
  accessibilityRole = 'button',
  style,
  textStyle,
  disabled = false,
}) => {
  const resolvedIconBg =
    iconBgColor ||
    (accentColor === Colors.AccentYellow
      ? withAlpha(Colors.AccentYellow, 0.15)
      : withAlpha(accentColor, 0.15));

  const renderIcon = () => {
    if (!icon) return null;
    if (React.isValidElement(icon)) {
      return icon;
    }
    if (typeof icon === 'function' || typeof icon === 'object') {
      const IconComp = icon as React.ComponentType<{
        size?: number;
        color?: string;
        strokeWidth?: number;
      }>;
      return (
        <IconComp
          size={ResponsivePixels.size11}
          color={accentColor}
          strokeWidth={3}
        />
      );
    }
    return null;
  };

  const iconNode = icon ? (
    <View style={[styles.iconWrap, { backgroundColor: resolvedIconBg }]}>
      {renderIcon()}
    </View>
  ) : null;

  return (
    <TouchableOpacity
      activeOpacity={activeOpacity}
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.container,
        {
          backgroundColor,
          borderColor,
          opacity: disabled ? 0.6 : 1,
        },
        style,
      ]}
      accessibilityRole={accessibilityRole}
      accessibilityLabel={accessibilityLabel || label}
    >
      {iconPosition === 'left' && iconNode}
      <Text
        style={[styles.labelText, { color: accentColor }, textStyle]}
        numberOfLines={1}
      >
        {label}
      </Text>
      {iconPosition === 'right' && iconNode}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ResponsivePixels.size6,
    paddingHorizontal: ResponsivePixels.size10,
    paddingVertical: ResponsivePixels.size4_5,
    borderRadius: ResponsivePixels.size20,
    backgroundColor: Colors.DarkElevatedNero,
    borderWidth: 1,
    borderColor: Colors.DarkBorder,
  },
  iconWrap: {
    width: ResponsivePixels.size14,
    height: ResponsivePixels.size14,
    borderRadius: ResponsivePixels.size7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  labelText: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: ResponsivePixels.size10_5,
    letterSpacing: 0.2,
  },
});

export default HeaderActionButton;
