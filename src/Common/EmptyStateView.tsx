import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StyleProp,
  ViewStyle,
  Platform,
} from 'react-native';
import { Fonts } from '../Theme/fonts';
import { Colors } from '../Assets/StyleUtilities/Colors';
import { useTheme } from '../Theme/ThemeContext';
import ResponsivePixels from '../Assets/StyleUtilities/ResponsivePixels';

export interface EmptyStateAction {
  label: string;
  onPress: () => void;
  icon?: React.ReactNode;
}

export interface EmptyStateViewProps {
  illustration?: React.ReactNode;
  title: string;
  subtitle?: string;
  action?: EmptyStateAction;
  containerStyle?: StyleProp<ViewStyle>;
}

export const EmptyStateView: React.FC<EmptyStateViewProps> = React.memo(
  ({ illustration, title, subtitle, action, containerStyle }) => {
    const { isDarkMode } = useTheme();

    const titleColor = isDarkMode ? Colors.PureWhite : Colors.PureBlack;
    const subtitleColor = isDarkMode ? Colors.SteelMist : Colors.SubtitleGray;

    return (
      <View style={[styles.emptyContainer, containerStyle]}>
        {illustration && (
          <View style={styles.illustrationWrapper}>{illustration}</View>
        )}

        <Text style={[styles.emptyTitle, { color: titleColor }]}>{title}</Text>

        {subtitle && (
          <Text style={[styles.emptySubtitle, { color: subtitleColor }]}>
            {subtitle}
          </Text>
        )}

        {action && (
          <TouchableOpacity
            activeOpacity={0.85}
            style={styles.actionBtn}
            onPress={action.onPress}
            accessibilityRole="button"
            accessibilityLabel={action.label}
          >
            {action.icon && (
              <View style={styles.actionBtnIcon}>{action.icon}</View>
            )}
            <Text style={styles.actionBtnText}>{action.label}</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  },
);

const styles = StyleSheet.create({
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: ResponsivePixels.size36,
    paddingHorizontal: ResponsivePixels.size24,
  },
  illustrationWrapper: {
    marginBottom: ResponsivePixels.size14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    fontFamily: Fonts.ranade.bold,
    fontSize: ResponsivePixels.size18,
    textAlign: 'center',
    letterSpacing: -0.2,
    marginBottom: ResponsivePixels.size6,
  },
  emptySubtitle: {
    fontFamily: Fonts.poppins.regular,
    fontSize: ResponsivePixels.size13,
    textAlign: 'center',
    lineHeight: ResponsivePixels.size19,
    maxWidth: ResponsivePixels.size280,
  },
  actionBtn: {
    marginTop: ResponsivePixels.size18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.MidnightCharcoal,
    paddingHorizontal: ResponsivePixels.size18,
    paddingVertical: ResponsivePixels.size9,
    borderRadius: ResponsivePixels.size24,
    borderWidth: 1,
    borderColor: Colors.DarkButtonBorder,
    borderBottomWidth: 2.5,
    borderBottomColor: Colors.DarkButtonBottom,
    gap: ResponsivePixels.size6,
    ...Platform.select({
      ios: {
        shadowColor: Colors.PureBlack,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.18,
        shadowRadius: 5,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  actionBtnIcon: {
    marginRight: ResponsivePixels.size2,
  },
  actionBtnText: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: ResponsivePixels.size13,
    color: Colors.PureWhite,
    letterSpacing: 0.1,
  },
});

export default EmptyStateView;
