import React, { useRef } from 'react';
import {
  TouchableOpacity,
  Text,
  ViewStyle,
  TextStyle,
  View,
  StyleSheet,
} from 'react-native';
import { Colors } from '../Assets/StyleUtilities/Colors';
import ResponsivePixels from '../Assets/StyleUtilities/ResponsivePixels';
import * as LucideIcons from 'lucide-react-native';
import Svg, { Path } from 'react-native-svg';
import { Fonts } from '../Theme/fonts';

type ButtonVariant = 'primary' | 'outlined' | 'dark' | 'google' | 'facebook' | 'apple';

type CustomButtonProps = {
  title: string;
  onPress: () => void;
  bordered?: boolean;
  variant?: ButtonVariant;
  disabled?: boolean;
  style?: ViewStyle;
  buttonTextStyle?: TextStyle;
  disableAllCaps?: boolean;
  debouncePress?: boolean;
  icon?: string;
};

const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  onPress,
  bordered = false,
  variant,
  disabled = false,
  style,
  buttonTextStyle,
  disableAllCaps = false,
  debouncePress = true,
  icon,
}) => {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleDebouncedPress = () => {
    if (timeoutRef.current) return;

    onPress();
    timeoutRef.current = setTimeout(() => {
      timeoutRef.current = null;
    }, 1500);
  };

  const handlePress = debouncePress ? handleDebouncedPress : onPress;

  const resolvedVariant: ButtonVariant = variant ?? (bordered ? 'outlined' : 'dark');
  const variantStyles = getVariantStyles(resolvedVariant);
  const hasIconSlot =
    resolvedVariant === 'google' ||
    resolvedVariant === 'facebook' ||
    resolvedVariant === 'apple' ||
    Boolean(icon);

  const iconName = icon === 'Cart' ? 'ShoppingCart' : icon;
  const IconComponent = iconName
    ? (LucideIcons[iconName as keyof typeof LucideIcons] as React.ElementType)
    : null;
  const iconColor = variantStyles.iconColor;
  const brandIcon = getBrandIcon(resolvedVariant);

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={disabled ? undefined : handlePress}
      style={[
        styles.containerBase,
        variantStyles.container,
        disabled && styles.disabled,
        style,
      ]}
      disabled={disabled}
    >
      {hasIconSlot && (
        <View style={styles.iconWrapper}>
          {IconComponent ? (
            <IconComponent
              color={iconColor}
              size={ResponsivePixels.size20}
              strokeWidth={2.5}
            />
          ) : brandIcon ? (
            brandIcon
          ) : null}
        </View>
      )}
      <Text
        style={[
          styles.textBase,
          variantStyles.text,
          disableAllCaps && styles.noTransform,
          buttonTextStyle,
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const GoogleLogo = ({ size = 20 }) => (
  <Svg width={size} height={size} viewBox="0 0 48 48">
    <Path
      fill="#EA4335"
      d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.7 17.74 9.5 24 9.5z"
    />
    <Path
      fill="#4285F4"
      d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
    />
    <Path
      fill="#FBBC05"
      d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
    />
    <Path
      fill="#34A853"
      d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
    />
  </Svg>
);

const FacebookLogo = ({ size = 20, color = '#fff' }) => (
  <Svg width={size} height={size} viewBox="0 0 320 512">
    <Path
      fill={color}
      d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z"
    />
  </Svg>
);

const AppleLogo = ({ size = 20, color = '#fff' }) => (
  <Svg width={size} height={size} viewBox="0 0 384 512">
    <Path
      fill={color}
      d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"
    />
  </Svg>
);

const getBrandIcon = (variant: ButtonVariant) => {
  if (variant === 'google') {
    return <GoogleLogo size={ResponsivePixels.size24} />;
  }
  if (variant === 'facebook') {
    return <FacebookLogo color={Colors.DefaultWhite} size={ResponsivePixels.size24} />;
  }
  if (variant === 'apple') {
    return <AppleLogo color={Colors.DefaultWhite} size={ResponsivePixels.size24} />;
  }
  return null;
};

const getVariantStyles = (
  variant: ButtonVariant
): {
  container: ViewStyle;
  text: TextStyle;
  iconColor: string;
  textTransform: TextStyle['textTransform'];
} => {
  switch (variant) {
    case 'outlined':
      return {
        container: styles.outlinedContainer,
        text: styles.outlinedText,
        iconColor: Colors.MidnightInkText,
        textTransform: 'none',
      };
    case 'dark':
      return {
        container: styles.darkContainer,
        text: styles.darkText,
        iconColor: Colors.PureWhiteText,
        textTransform: 'none',
      };
    case 'google':
      return {
        container: styles.googleContainer,
        text: styles.googleText,
        iconColor: Colors.MidnightInkText,
        textTransform: 'none',
      };
    case 'facebook':
      return {
        container: styles.facebookContainer,
        text: styles.socialLightText,
        iconColor: Colors.DefaultWhite,
        textTransform: 'none',
      };
    case 'apple':
      return {
        container: styles.appleContainer,
        text: styles.socialLightText,
        iconColor: Colors.DefaultWhite,
        textTransform: 'none',
      };
    case 'primary':
    default:
      return {
        container: styles.primaryContainer,
        text: styles.primaryText,
        iconColor: Colors.PureWhiteText,
        textTransform: 'none',
      };
  }
};

const styles = StyleSheet.create({
  containerBase: {
    borderRadius: ResponsivePixels.size28,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    paddingHorizontal: ResponsivePixels.size24,
    paddingVertical: ResponsivePixels.size16,
  },
  primaryContainer: {
    backgroundColor: Colors.ButtonDark,
    borderWidth: 0,
  },
  darkContainer: {
    backgroundColor: Colors.ButtonDark,
    borderWidth: 0,
  },
  outlinedContainer: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: Colors.ButtonDark,
  },
  googleContainer: {
    backgroundColor: Colors.IvoryMist,
  },
  facebookContainer: {
    backgroundColor: '#2374E1',
  },
  appleContainer: {
    backgroundColor: Colors.TrueBlackText,
  },
  disabled: {
    opacity: 0.45,
  },
  textBase: {
    fontFamily: Fonts.poppins.semiBold || 'System',
    fontSize: ResponsivePixels.size16,
    textAlign: 'center',
  },
  primaryText: {
    color: Colors.PureWhiteText,
  },
  darkText: {
    color: Colors.PureWhiteText,
  },
  outlinedText: {
    color: Colors.MidnightInkText,
  },
  googleText: {
    color: Colors.MidnightInkText,
  },
  socialLightText: {
    color: Colors.PureWhiteText,
  },
  iconWrapper: {
    marginRight: ResponsivePixels.size8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noTransform: {
    textTransform: 'none',
  },
});

export default CustomButton;
