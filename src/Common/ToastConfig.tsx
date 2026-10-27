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
import { useTheme } from '../Theme/ThemeContext';
import {
  ToastAestheticPatternSvg,
  ToastAestheticVariant,
} from './ToastAestheticPatternSvg';

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
    iconColor: '#059669',
    badgeBgLight: '#D1FAE5',
    badgeBgDark: '#0D3320',
    badgeBorderLight: '#FFFFFF',
    badgeBorderDark: '#10B981',
    badgeBottomBorderLight: '#6EE7B7',
    badgeBottomBorderDark: '#05472A',
    cardBorderLight: '#A7F3D0',
    cardBottomBorderLight: '#34D399',
    cardBorderDark: '#1B4D36',
    cardBottomBorderDark: '#092116',
    glowColor: '#10B981',
    defaultTitle: 'Success',
  },
  warning: {
    Icon: AlertTriangle,
    iconColor: '#B47804',
    badgeBgLight: '#FEF3C7',
    badgeBgDark: '#3A2B07',
    badgeBorderLight: '#FFFFFF',
    badgeBorderDark: '#F5C518',
    badgeBottomBorderLight: '#FCD34D',
    badgeBottomBorderDark: '#5B4109',
    cardBorderLight: '#FDE047',
    cardBottomBorderLight: '#DEAA14',
    cardBorderDark: '#4A370A',
    cardBottomBorderDark: '#1C1502',
    glowColor: '#F5C518',
    defaultTitle: 'Warning',
  },
  error: {
    Icon: AlertCircle,
    iconColor: '#DC2626',
    badgeBgLight: '#FEE2E2',
    badgeBgDark: '#3E1317',
    badgeBorderLight: '#FFFFFF',
    badgeBorderDark: '#FF3B30',
    badgeBottomBorderLight: '#FCA5A5',
    badgeBottomBorderDark: '#5E1B21',
    cardBorderLight: '#FECACA',
    cardBottomBorderLight: '#F87171',
    cardBorderDark: '#501C22',
    cardBottomBorderDark: '#20080B',
    glowColor: '#FF3B30',
    defaultTitle: 'Notice',
  },
  info: {
    Icon: Info,
    iconColor: '#5551B5',
    badgeBgLight: '#E0E7FF',
    badgeBgDark: '#1F1B45',
    badgeBorderLight: '#FFFFFF',
    badgeBorderDark: '#8383D6',
    badgeBottomBorderLight: '#A5B4FC',
    badgeBottomBorderDark: '#352E75',
    cardBorderLight: '#C7D2FE',
    cardBottomBorderLight: '#8383D6',
    cardBorderDark: '#2F2B61',
    cardBottomBorderDark: '#110F24',
    glowColor: '#8383D6',
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
  const { isDarkMode } = useTheme();
  const config = VARIANT_CONFIGS[variant] || VARIANT_CONFIGS.info;
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
      <ToastAestheticPatternSvg variant={variant} isDarkMode={isDarkMode} />

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
        <Icon size={19} color={config.iconColor} strokeWidth={2.4} />
      </View>

      {/* Text content */}
      <View style={styles.textContainer}>
        {singleText ? (
          <Text
            numberOfLines={2}
            style={[
              styles.singleText,
              { color: isDarkMode ? '#FFFFFF' : '#0F172A' },
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
                  { color: isDarkMode ? '#FFFFFF' : '#0F172A' },
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
                  { color: isDarkMode ? '#D1D5DB' : '#334155' },
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
        hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        style={[
          styles.dismissButton,
          {
            backgroundColor: isDarkMode
              ? 'rgba(255, 255, 255, 0.12)'
              : 'rgba(0, 0, 0, 0.05)',
          },
        ]}
        accessibilityRole="button"
        accessibilityLabel="Dismiss notification"
      >
        <X
          size={14}
          color={isDarkMode ? 'rgba(255, 255, 255, 0.7)' : '#64748B'}
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
    maxWidth: 420,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 22,
    borderWidth: 1.2,
    borderBottomWidth: 2.8,
    overflow: 'hidden',
  },
  iconBadge: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.2,
    borderBottomWidth: 2.4,
    zIndex: 2,
  },
  textContainer: {
    flex: 1,
    marginHorizontal: 12,
    justifyContent: 'center',
    zIndex: 2,
  },
  singleText: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: 13,
    lineHeight: 18,
    letterSpacing: -0.1,
  },
  titleText: {
    fontFamily: Fonts.poppins.bold,
    fontSize: 13.5,
    lineHeight: 18,
    letterSpacing: -0.1,
  },
  descText: {
    fontFamily: Fonts.poppins.medium,
    fontSize: 12,
    lineHeight: 16,
    marginTop: 2,
  },
  dismissButton: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
});
