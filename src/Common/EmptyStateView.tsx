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
    paddingVertical: 36,
    paddingHorizontal: 24,
  },
  illustrationWrapper: {
    marginBottom: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    fontFamily: Fonts.ranade.bold,
    fontSize: 18,
    textAlign: 'center',
    letterSpacing: -0.2,
    marginBottom: 6,
  },
  emptySubtitle: {
    fontFamily: Fonts.poppins.regular,
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 19,
    maxWidth: 280,
  },
  actionBtn: {
    marginTop: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.MidnightCharcoal,
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: Colors.DarkButtonBorder,
    borderBottomWidth: 2.5,
    borderBottomColor: Colors.DarkButtonBottom,
    gap: 6,
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
    marginRight: 2,
  },
  actionBtnText: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: 13,
    color: Colors.PureWhite,
    letterSpacing: 0.1,
  },
});

export default EmptyStateView;
