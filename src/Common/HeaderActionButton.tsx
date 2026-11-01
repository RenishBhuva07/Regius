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

const hexToRgba = (hex: string, alpha: number): string => {
  const cleanHex = hex.replace('#', '');
  if (cleanHex.length === 6) {
    const r = parseInt(cleanHex.substring(0, 2), 16);
    const g = parseInt(cleanHex.substring(2, 4), 16);
    const b = parseInt(cleanHex.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
  return `rgba(245, 197, 24, ${alpha})`;
};

export const HeaderActionButton: React.FC<HeaderActionButtonProps> = ({
  label,
  icon,
  iconPosition = 'left',
  onPress,
  accentColor = '#F5C518',
  iconBgColor,
  backgroundColor = '#1E2028',
  borderColor = '#363944',
  activeOpacity = 0.8,
  accessibilityLabel,
  accessibilityRole = 'button',
  style,
  textStyle,
  disabled = false,
}) => {
  const resolvedIconBg =
    iconBgColor ||
    (accentColor === '#F5C518'
      ? 'rgba(245, 197, 24, 0.15)'
      : hexToRgba(accentColor, 0.15));

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
      return <IconComp size={11} color={accentColor} strokeWidth={3} />;
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
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 4.5,
    borderRadius: 20,
    backgroundColor: '#1E2028',
    borderWidth: 1,
    borderColor: '#363944',
  },
  iconWrap: {
    width: 14,
    height: 14,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  labelText: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: 10.5,
    letterSpacing: 0.2,
  },
});

export default HeaderActionButton;
