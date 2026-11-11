import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { Colors } from '../Assets/StyleUtilities/Colors';
import { Fonts } from '../Theme/fonts';

export type BadgeVariant =
  | 'purple'
  | 'yellow'
  | 'green'
  | 'orange'
  | 'red'
  | 'neutral'
  | 'primary'
  | 'alert'
  | 'warning'
  | 'success'
  | 'danger';

export type BadgeSize = 'sm' | 'md' | 'lg';

export interface BadgeProps {
  label?: string;
  children?: React.ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  uppercase?: boolean;
  activeOpacity?: number;
}

interface VariantColorConfig {
  bg: string;
  borderColor: string;
  bottomBorderColor: string;
  text: string;
  shadowColor: string;
}

const VARIANT_CONFIGS: Record<string, VariantColorConfig> = {
  purple: {
    bg: Colors.BadgePurpleBg,
    borderColor: Colors.PureWhite,
    bottomBorderColor: Colors.BadgePurpleBevel,
    text: Colors.LavenderPurple,
    shadowColor: Colors.LavenderPurple,
  },
  primary: {
    bg: Colors.BadgePurpleBg,
    borderColor: Colors.PureWhite,
    bottomBorderColor: Colors.BadgePurpleBevel,
    text: Colors.LavenderPurple,
    shadowColor: Colors.LavenderPurple,
  },
  yellow: {
    bg: Colors.BadgeYellowBg,
    borderColor: Colors.PureWhite,
    bottomBorderColor: Colors.WorkDarkBorder,
    text: Colors.BadgeYellowText,
    shadowColor: Colors.HabitBurnishedAmber,
  },
  alert: {
    bg: Colors.BadgeYellowBg,
    borderColor: Colors.PureWhite,
    bottomBorderColor: Colors.WorkDarkBorder,
    text: Colors.BadgeYellowText,
    shadowColor: Colors.HabitBurnishedAmber,
  },
  warning: {
    bg: Colors.BadgeYellowBg,
    borderColor: Colors.PureWhite,
    bottomBorderColor: Colors.WorkDarkBorder,
    text: Colors.BadgeYellowText,
    shadowColor: Colors.HabitBurnishedAmber,
  },
  green: {
    bg: Colors.BadgeGreenBg,
    borderColor: Colors.PureWhite,
    bottomBorderColor: Colors.BadgeGreenBevel,
    text: Colors.GreenGracious,
    shadowColor: Colors.AccentGreen,
  },
  success: {
    bg: Colors.BadgeGreenBg,
    borderColor: Colors.PureWhite,
    bottomBorderColor: Colors.BadgeGreenBevel,
    text: Colors.GreenGracious,
    shadowColor: Colors.AccentGreen,
  },
  orange: {
    bg: Colors.EventLightBg,
    borderColor: Colors.PureWhite,
    bottomBorderColor: Colors.BadgeOrangeBevel,
    text: Colors.EventTextAccent,
    shadowColor: Colors.AccentAmber,
  },
  red: {
    bg: Colors.BadgeRedBg,
    borderColor: Colors.PureWhite,
    bottomBorderColor: Colors.BadgeRedBevel,
    text: Colors.MoltenRust,
    shadowColor: Colors.CrimsonPulse,
  },
  danger: {
    bg: Colors.BadgeRedBg,
    borderColor: Colors.PureWhite,
    bottomBorderColor: Colors.BadgeRedBevel,
    text: Colors.MoltenRust,
    shadowColor: Colors.CrimsonPulse,
  },
  neutral: {
    bg: Colors.PureWhite,
    borderColor: Colors.PureWhite,
    bottomBorderColor: Colors.HomeIndicator,
    text: Colors.MidnightCharcoal,
    shadowColor: Colors.MidnightCharcoal,
  },
};

export const Badge: React.FC<BadgeProps> = ({
  label,
  children,
  variant = 'purple',
  size = 'sm',
  icon,
  iconPosition = 'left',
  onPress,
  style,
  textStyle,
  uppercase = true,
  activeOpacity = 0.75,
}) => {
  const config = VARIANT_CONFIGS[variant] || VARIANT_CONFIGS.purple;

  const sizeStyle = SIZE_STYLES[size];
  const sizeTextStyle = SIZE_TEXT_STYLES[size];

  const content = (
    <>
      {icon && iconPosition === 'left' ? (
        <View style={styles.iconSlot}>{icon}</View>
      ) : null}

      {label ? (
        <Text
          style={[
            styles.baseText,
            sizeTextStyle,
            { color: config.text },
            textStyle,
          ]}
        >
          {uppercase ? label.toUpperCase() : label}
        </Text>
      ) : null}

      {children}

      {icon && iconPosition === 'right' ? (
        <View style={styles.iconSlot}>{icon}</View>
      ) : null}
    </>
  );

  const containerStyle = [
    styles.baseBadge,
    sizeStyle,
    {
      backgroundColor: config.bg,
      borderColor: config.borderColor,
      borderBottomColor: config.bottomBorderColor,
      ...Platform.select({
        ios: {
          shadowColor: config.shadowColor,
          shadowOffset: sizeStyle.shadowOffset,
          shadowOpacity: 0.22,
          shadowRadius: sizeStyle.shadowRadius,
        },
        android: {
          elevation: sizeStyle.elevation,
        },
      }),
    },
    style,
  ];

  if (onPress) {
    return (
      <TouchableOpacity
        activeOpacity={activeOpacity}
        onPress={onPress}
        style={containerStyle}
      >
        {content}
      </TouchableOpacity>
    );
  }

  return <View style={containerStyle}>{content}</View>;
};

const SIZE_STYLES = StyleSheet.create({
  sm: {
    paddingHorizontal: 7.5,
    paddingVertical: 2.5,
    borderRadius: 20,
    borderWidth: 1,
    borderBottomWidth: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    elevation: 2.5,
  },
  md: {
    paddingHorizontal: 10,
    paddingVertical: 3.5,
    borderRadius: 20,
    borderWidth: 1,
    borderBottomWidth: 2.2,
    shadowOffset: { width: 0, height: 2.5 },
    shadowRadius: 3.5,
    elevation: 3.5,
  },
  lg: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 24,
    borderWidth: 1.2,
    borderBottomWidth: 2.8,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 4.5,
    elevation: 4,
  },
});

const SIZE_TEXT_STYLES = StyleSheet.create({
  sm: {
    fontSize: 8.5,
    letterSpacing: 0.5,
  },
  md: {
    fontSize: 9.5,
    letterSpacing: 0.8,
  },
  lg: {
    fontSize: 11,
    letterSpacing: 0.9,
  },
});

const styles = StyleSheet.create({
  baseBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4.5,
    alignSelf: 'flex-start',
  },
  iconSlot: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  baseText: {
    fontFamily: Fonts.poppins.bold,
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
});

export default Badge;
