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

  const iconSize = isSm ? 10.5 : isLg ? 14 : 12;

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
    paddingHorizontal: 7.5,
    paddingVertical: 2.5,
    borderRadius: 14,
    gap: 3.5,
  },
  badgeMd: {
    paddingHorizontal: 9.5,
    paddingVertical: 3.5,
    borderRadius: 16,
    gap: 4.5,
  },
  badgeLg: {
    paddingHorizontal: 12,
    paddingVertical: 4.5,
    borderRadius: 20,
    gap: 5.5,
  },
  label: {
    fontFamily: Fonts.poppins.bold,
    color: Colors.BadgeYellowText,
    includeFontPadding: false,
    textTransform: 'uppercase',
  },
  labelSm: {
    fontSize: 9.5,
    lineHeight: 12,
    letterSpacing: 0.8,
  },
  labelMd: {
    fontSize: 10.5,
    lineHeight: 13,
    letterSpacing: 0.9,
  },
  labelLg: {
    fontSize: 12,
    lineHeight: 15,
    letterSpacing: 1,
  },
});

export default ProBadge;
