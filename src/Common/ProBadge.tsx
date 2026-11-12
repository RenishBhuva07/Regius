import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StyleProp,
  ViewStyle,
  TextStyle,
  Platform,
} from 'react-native';
import { Crown } from 'lucide-react-native';
import { Fonts } from '../Theme/fonts';
import { Colors } from '../Assets/StyleUtilities/Colors';
import ResponsivePixels from '../Assets/StyleUtilities/ResponsivePixels';

export interface ProBadgeProps {
  size?: 'sm' | 'md' | 'lg';
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  activeOpacity?: number;
}

export const ProBadge: React.FC<ProBadgeProps> = ({
  size = 'sm',
  onPress,
  style,
  textStyle,
  activeOpacity = 0.8,
}) => {
  const isSm = size === 'sm';
  const isLg = size === 'lg';

  const iconSize = isSm
    ? ResponsivePixels.size10_5
    : isLg
    ? ResponsivePixels.size14
    : ResponsivePixels.size12;

  const content = (
    <View
      style={[
        styles.badge,
        isSm ? styles.badgeSm : isLg ? styles.badgeLg : styles.badgeMd,
        style,
      ]}
    >
      <Crown size={iconSize} color={Colors.BadgeYellowText} fill={Colors.AccentYellow} strokeWidth={2.4} />
      <Text
        style={[
          styles.label,
          isSm ? styles.labelSm : isLg ? styles.labelLg : styles.labelMd,
          textStyle,
        ]}
      >
        PRO
      </Text>
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity
        activeOpacity={activeOpacity}
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel="Regius Pro Member"
      >
        {content}
      </TouchableOpacity>
    );
  }

  return content;
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.BadgeYellowBg,
    borderColor: Colors.PureWhite,
    borderWidth: 1,
    borderBottomWidth: 2.2,
    borderBottomColor: Colors.WorkDarkBorder,
    ...Platform.select({
      ios: {
        shadowColor: Colors.HabitBurnishedAmber,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.5,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  badgeSm: {
    paddingHorizontal: ResponsivePixels.size7_5,
    paddingVertical: ResponsivePixels.size2_5,
    borderRadius: ResponsivePixels.size14,
    gap: ResponsivePixels.size3_5,
  },
  badgeMd: {
    paddingHorizontal: ResponsivePixels.size9_5,
    paddingVertical: ResponsivePixels.size3_5,
    borderRadius: ResponsivePixels.size16,
    gap: ResponsivePixels.size4_5,
  },
  badgeLg: {
    paddingHorizontal: ResponsivePixels.size12,
    paddingVertical: ResponsivePixels.size4_5,
    borderRadius: ResponsivePixels.size20,
    gap: ResponsivePixels.size5_5,
  },
  label: {
    fontFamily: Fonts.poppins.bold,
    color: Colors.BadgeYellowText,
    includeFontPadding: false,
    textTransform: 'uppercase',
  },
  labelSm: {
    fontSize: ResponsivePixels.size9_5,
    lineHeight: ResponsivePixels.size12,
    letterSpacing: 0.8,
  },
  labelMd: {
    fontSize: ResponsivePixels.size10_5,
    lineHeight: ResponsivePixels.size13,
    letterSpacing: 0.9,
  },
  labelLg: {
    fontSize: ResponsivePixels.size12,
    lineHeight: ResponsivePixels.size15,
    letterSpacing: 1,
  },
});

export default ProBadge;
