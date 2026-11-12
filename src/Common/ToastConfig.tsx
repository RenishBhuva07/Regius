import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { ToastConfigParams } from 'react-native-toast-message';
import Toast from 'react-native-toast-message';
import {
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Info,
  X,
} from 'lucide-react-native';
import { Fonts } from '../Theme/fonts';
import { Colors, withAlpha } from '../Assets/StyleUtilities/Colors';
import { useTheme } from '../Theme/ThemeContext';
import {
  ToastAestheticPatternSvg,
  ToastAestheticVariant,
} from './ToastAestheticPatternSvg';
import ResponsivePixels from '../Assets/StyleUtilities/ResponsivePixels';

export type ToastVariant = ToastAestheticVariant;

interface VariantConfig {
  Icon: React.ComponentType<{
    size: number;
    color: string;
    strokeWidth: number;
  }>;
  iconColor: string;
  badgeBgLight: string;
  badgeBgDark: string;
  badgeBorderLight: string;
  badgeBorderDark: string;
  badgeBottomBorderLight: string;
  badgeBottomBorderDark: string;
  cardBorderLight: string;
  cardBottomBorderLight: string;
  cardBorderDark: string;
  cardBottomBorderDark: string;
  glowColor: string;
  defaultTitle: string;
}

const VARIANT_CONFIGS: Record<ToastVariant, VariantConfig> = {
  success: {
    Icon: CheckCircle2,
    iconColor: Colors.ToastSuccessIcon,
    badgeBgLight: Colors.ToastSuccessBadgeBgLight,
    badgeBgDark: Colors.ToastSuccessBadgeBgDark,
    badgeBorderLight: Colors.PureWhite,
    badgeBorderDark: Colors.ToastSuccessAccent,
    badgeBottomBorderLight: Colors.ToastSuccessBadgeBevelLight,
    badgeBottomBorderDark: Colors.ToastSuccessBadgeBevelDark,
    cardBorderLight: Colors.ToastSuccessCardBorderLight,
    cardBottomBorderLight: Colors.ToastSuccessCardBevelLight,
    cardBorderDark: Colors.ToastSuccessCardBorderDark,
    cardBottomBorderDark: Colors.ToastSuccessCardBevelDark,
    glowColor: Colors.ToastSuccessAccent,
    defaultTitle: 'Success',
  },
  warning: {
    Icon: AlertTriangle,
    iconColor: Colors.BadgeYellowText,
    badgeBgLight: Colors.ToastWarningBadgeBgLight,
    badgeBgDark: Colors.ToastWarningBadgeBgDark,
    badgeBorderLight: Colors.PureWhite,
    badgeBorderDark: Colors.AccentYellow,
    badgeBottomBorderLight: Colors.ToastWarningBadgeBevelLight,
    badgeBottomBorderDark: Colors.ToastWarningBadgeBevelDark,
    cardBorderLight: Colors.ToastWarningCardBorderLight,
    cardBottomBorderLight: Colors.WorkDarkBorder,
    cardBorderDark: Colors.ToastWarningCardBorderDark,
    cardBottomBorderDark: Colors.ToastWarningCardBevelDark,
    glowColor: Colors.AccentYellow,
    defaultTitle: 'Warning',
  },
  error: {
    Icon: AlertCircle,
    iconColor: Colors.CategoryRedCheck,
    badgeBgLight: Colors.CategoryRedBorder,
    badgeBgDark: Colors.ToastErrorBadgeBgDark,
    badgeBorderLight: Colors.PureWhite,
    badgeBorderDark: Colors.CrimsonPulse,
    badgeBottomBorderLight: Colors.ToastErrorBadgeBevelLight,
    badgeBottomBorderDark: Colors.ToastErrorBadgeBevelDark,
    cardBorderLight: Colors.ToastErrorCardBorderLight,
    cardBottomBorderLight: Colors.ToastErrorCardBevelLight,
    cardBorderDark: Colors.ToastErrorCardBorderDark,
    cardBottomBorderDark: Colors.ToastErrorCardBevelDark,
    glowColor: Colors.CrimsonPulse,
    defaultTitle: 'Notice',
  },
  info: {
    Icon: Info,
    iconColor: Colors.ToastInfoIcon,
    badgeBgLight: Colors.ToastInfoBadgeBgLight,
    badgeBgDark: Colors.ToastInfoBadgeBgDark,
    badgeBorderLight: Colors.PureWhite,
    badgeBorderDark: Colors.LavenderPurple,
    badgeBottomBorderLight: Colors.ToastInfoBadgeBevelLight,
    badgeBottomBorderDark: Colors.ToastInfoBadgeBevelDark,
    cardBorderLight: Colors.ToastInfoCardBorderLight,
    cardBottomBorderLight: Colors.LavenderPurple,
    cardBorderDark: Colors.ToastInfoCardBorderDark,
    cardBottomBorderDark: Colors.ToastInfoCardBevelDark,
    glowColor: Colors.LavenderPurple,
    defaultTitle: 'Notice',
  },
};

export interface RegiusToastProps extends Partial<ToastConfigParams<any>> {
  variant: ToastVariant;
}

export const RegiusToast: React.FC<RegiusToastProps> = ({
  variant,
  text1,
  text2,
  onPress,
  hide,
}) => {
  const { isDarkMode, activeThemeId } = useTheme();
  const baseConfig = VARIANT_CONFIGS[variant] || VARIANT_CONFIGS.info;
  const config =
    activeThemeId === 'cyprus_sand' && variant === 'info'
      ? {
          ...baseConfig,
          iconColor: isDarkMode ? Colors.CyprusSandPaper : Colors.CyprusTeal,
          badgeBgDark: Colors.CyprusTealDark,
          badgeBorderDark: Colors.CyprusTealLight,
          badgeBottomBorderDark: Colors.CyprusTealAbyss,
          badgeBgLight: Colors.CyprusSandAlt,
          badgeBorderLight: Colors.PureWhite,
          badgeBottomBorderLight: Colors.CyprusBorderDarkCard,
          cardBorderDark: Colors.CyprusTealLight,
          cardBottomBorderDark: Colors.CyprusTealAbyss,
          cardBorderLight: Colors.CyprusBorderDarkCard,
          cardBottomBorderLight: Colors.SandstoneBorder,
          glowColor: Colors.CyprusTealLight,
        }
      : baseConfig;
  const { Icon } = config;

  const hasTitle = Boolean(text1 && text1.trim().length > 0);
  const hasDesc = Boolean(text2 && text2.trim().length > 0);

  const title = hasTitle ? text1 : hasDesc ? null : config.defaultTitle;
  const description = hasTitle ? text2 : null;
  const singleText = !hasTitle && hasDesc ? text2 : null;

  const handleDismiss = () => {
    if (hide) {
      hide();
    } else {
      Toast.hide();
    }
  };

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      handleDismiss();
    }
  };

  const cardBorder = isDarkMode
    ? config.cardBorderDark
    : config.cardBorderLight;
  const cardBottomBorder = isDarkMode
    ? config.cardBottomBorderDark
    : config.cardBottomBorderLight;

  const badgeBg = isDarkMode ? config.badgeBgDark : config.badgeBgLight;
  const badgeBorder = isDarkMode
    ? config.badgeBorderDark
    : config.badgeBorderLight;
  const badgeBottomBorder = isDarkMode
    ? config.badgeBottomBorderDark
    : config.badgeBottomBorderLight;

  return (
    <TouchableOpacity
      activeOpacity={0.92}
      onPress={handlePress}
      testID="regius-toast-card"
      accessibilityRole="alert"
      style={[
        styles.cardContainer,
        {
          borderColor: cardBorder,
          borderBottomColor: cardBottomBorder,
          ...Platform.select({
            ios: {
              shadowColor: config.glowColor,
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: isDarkMode ? 0.38 : 0.26,
              shadowRadius: 16,
            },
            android: {
              elevation: 9,
            },
          }),
        },
      ]}
    >
      {/* Toast background */}
      <ToastAestheticPatternSvg
        variant={variant}
        isDarkMode={isDarkMode}
        activeThemeId={activeThemeId}
      />

      {/* Icon badge */}
      <View
        style={[
          styles.iconBadge,
          {
            backgroundColor: badgeBg,
            borderColor: badgeBorder,
            borderBottomColor: badgeBottomBorder,
          },
        ]}
      >
        <Icon size={ResponsivePixels.size19} color={config.iconColor} strokeWidth={2.4} />
      </View>

      {/* Text content */}
      <View style={styles.textContainer}>
        {singleText ? (
          <Text
            numberOfLines={2}
            style={[
              styles.singleText,
              { color: isDarkMode ? Colors.PureWhite : Colors.Slate900 },
            ]}
          >
            {singleText}
          </Text>
        ) : (
          <>
            {title ? (
              <Text
                numberOfLines={1}
                style={[
                  styles.titleText,
                  { color: isDarkMode ? Colors.PureWhite : Colors.Slate900 },
                ]}
              >
                {title}
              </Text>
            ) : null}
            {description ? (
              <Text
                numberOfLines={2}
                style={[
                  styles.descText,
                  { color: isDarkMode ? Colors.Gray300 : Colors.Slate700 },
                ]}
              >
                {description}
              </Text>
            ) : null}
          </>
        )}
      </View>

      {/* ── Frosted Dismiss Capsule ── */}
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={handleDismiss}
        hitSlop={{ top: ResponsivePixels.size12, bottom: ResponsivePixels.size12, left: ResponsivePixels.size12, right: ResponsivePixels.size12 }}
        style={[
          styles.dismissButton,
          {
            backgroundColor: isDarkMode
              ? withAlpha(Colors.PureWhite, 0.12)
              : withAlpha(Colors.PureBlack, 0.05),
          },
        ]}
        accessibilityRole="button"
        accessibilityLabel="Dismiss notification"
      >
        <X
          size={ResponsivePixels.size14}
          color={isDarkMode ? withAlpha(Colors.PureWhite, 0.7) : Colors.Slate500}
          strokeWidth={2.4}
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

export const toastConfig = {
  success: (props: ToastConfigParams<any>) => (
    <RegiusToast {...props} variant="success" />
  ),
  error: (props: ToastConfigParams<any>) => (
    <RegiusToast {...props} variant="error" />
  ),
  info: (props: ToastConfigParams<any>) => (
    <RegiusToast {...props} variant="info" />
  ),
  warning: (props: ToastConfigParams<any>) => (
    <RegiusToast {...props} variant="warning" />
  ),
};

const styles = StyleSheet.create({
  cardContainer: {
    width: '92%',
    maxWidth: ResponsivePixels.size420,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: ResponsivePixels.size12,
    paddingHorizontal: ResponsivePixels.size14,
    borderRadius: ResponsivePixels.size22,
    borderWidth: 1.2,
    borderBottomWidth: 2.8,
    overflow: 'hidden',
  },
  iconBadge: {
    width: ResponsivePixels.size38,
    height: ResponsivePixels.size38,
    borderRadius: ResponsivePixels.size19,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.2,
    borderBottomWidth: 2.4,
    zIndex: 2,
  },
  textContainer: {
    flex: 1,
    marginHorizontal: ResponsivePixels.size12,
    justifyContent: 'center',
    zIndex: 2,
  },
  singleText: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: ResponsivePixels.size13,
    lineHeight: ResponsivePixels.size18,
    letterSpacing: -0.1,
  },
  titleText: {
    fontFamily: Fonts.poppins.bold,
    fontSize: ResponsivePixels.size13_5,
    lineHeight: ResponsivePixels.size18,
    letterSpacing: -0.1,
  },
  descText: {
    fontFamily: Fonts.poppins.medium,
    fontSize: ResponsivePixels.size12,
    lineHeight: ResponsivePixels.size16,
    marginTop: ResponsivePixels.size2,
  },
  dismissButton: {
    width: ResponsivePixels.size26,
    height: ResponsivePixels.size26,
    borderRadius: ResponsivePixels.size13,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
});
