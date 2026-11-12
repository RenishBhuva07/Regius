import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowDown, ArrowRight } from 'lucide-react-native';

import { Fonts } from '../../Theme/fonts';
import { Colors, withAlpha } from '../../Assets/StyleUtilities/Colors';
import { useTheme } from '../../Theme/ThemeContext';
import ResponsivePixels from '../../Assets/StyleUtilities/ResponsivePixels';
import ModalBottomPatternSvg from './ModalBottomPatternSvg';

export interface ModalBottomBarProps {
  onClose: () => void;
  onSubmit: () => void;
  submitText: string;
  createAnim?: Animated.Value;
  dismissAccessibilityLabel?: string;
  submitAccessibilityLabel?: string;
  disabled?: boolean;
}

const getBottomBarBgColor = (
  themeId: string,
  isDark: boolean,
  accentDeep?: string,
): string => {
  if (accentDeep) return accentDeep;
  if (isDark) {
    switch (themeId) {
      case 'cyprus_sand':
        return Colors.CyprusTealDark;
      case 'emerald_velvet':
        return Colors.EmeraldDarkBar;
      case 'celestial_azure':
        return Colors.AzureDarkBar;
      case 'obsidian_gold':
        return Colors.ObsidianDarkBar;
      case 'classic_light':
      case 'classic_dark':
      default:
        return Colors.MidnightIndigo;
    }
  } else {
    switch (themeId) {
      case 'cyprus_sand':
        return Colors.CyprusTeal;
      case 'emerald_velvet':
        return Colors.GreenGracious;
      case 'celestial_azure':
        return Colors.AzureRoyal;
      case 'obsidian_gold':
        return Colors.ObsidianGoldAntique;
      case 'classic_dark':
      case 'classic_light':
      default:
        return Colors.LavenderPurple;
    }
  }
};

export const ModalBottomBar: React.FC<ModalBottomBarProps> = ({
  onClose,
  onSubmit,
  submitText,
  createAnim,
  dismissAccessibilityLabel = 'Go back',
  submitAccessibilityLabel,
  disabled = false,
}) => {
  const insets = useSafeAreaInsets();
  const { isDarkMode, activeThemeId, Colors: themeColors } = useTheme();
  const { width: screenWidth } = Dimensions.get('window');

  const fallbackAnim = useRef(new Animated.Value(1)).current;
  const activeAnim = createAnim ?? fallbackAnim;

  const barBgColor = getBottomBarBgColor(
    activeThemeId,
    isDarkMode,
    themeColors.AccentDeep,
  );
  const bottomPadding =
    Math.max(insets.bottom, ResponsivePixels.size16) + ResponsivePixels.size6;
  const totalBarHeight = ResponsivePixels.size74 + bottomPadding;

  const handlePressSubmit = () => {
    if (disabled) return;

    if (!createAnim) {
      Animated.sequence([
        Animated.timing(fallbackAnim, {
          toValue: 0.94,
          duration: 90,
          useNativeDriver: true,
        }),
        Animated.spring(fallbackAnim, {
          toValue: 1,
          friction: 4,
          useNativeDriver: true,
        }),
      ]).start();
    }

    onSubmit();
  };

  return (
    <View
      style={[
        styles.barContainer,
        {
          paddingBottom: bottomPadding,
          backgroundColor: barBgColor,
          borderColor: isDarkMode
            ? withAlpha(Colors.PureWhite, 0.16)
            : withAlpha(Colors.PureWhite, 0.45),
        },
      ]}
    >
      {/* Aesthetic SVG Pattern for Bottom Bar */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <ModalBottomPatternSvg width={screenWidth} height={totalBarHeight} />
      </View>

      <View style={styles.buttonRow}>
        {/* Back / Dismiss Button on Left */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={onClose}
          style={styles.backBtn}
          accessibilityRole="button"
          accessibilityLabel={dismissAccessibilityLabel}
        >
          <ArrowDown size={ResponsivePixels.size20} color={Colors.PureWhite} strokeWidth={2.4} />
        </TouchableOpacity>

        {/* Primary Action Button on Right */}
        <Animated.View
          style={[
            styles.submitAnimWrap,
            { transform: [{ scale: activeAnim }] },
          ]}
        >
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={handlePressSubmit}
            disabled={disabled}
            style={[
              styles.heroSubmitBtn,
              disabled && styles.heroSubmitBtnDisabled,
            ]}
            accessibilityRole="button"
            accessibilityLabel={submitAccessibilityLabel ?? submitText}
          >
            <Text style={styles.heroSubmitBtnText}>{submitText}</Text>

            <View style={styles.heroSubmitCircle}>
              <ArrowRight size={ResponsivePixels.size18} color={Colors.PureWhite} strokeWidth={2.6} />
            </View>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  barContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: ResponsivePixels.size20,
    paddingTop: ResponsivePixels.size12,
    borderTopLeftRadius: ResponsivePixels.size24,
    borderTopRightRadius: ResponsivePixels.size24,
    borderTopWidth: 1.5,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: Colors.PureBlack,
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.28,
        shadowRadius: 14,
      },
      android: {
        elevation: 10,
      },
    }),
    zIndex: 40,
  },
  buttonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ResponsivePixels.size12,
  },
  backBtn: {
    width: ResponsivePixels.size54,
    height: ResponsivePixels.size54,
    borderRadius: ResponsivePixels.size27,
    backgroundColor: Colors.MidnightCharcoal,
    borderWidth: 1.2,
    borderColor: Colors.DarkModalBarBorder,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: Colors.MidnightCharcoal,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.35,
        shadowRadius: 14,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  submitAnimWrap: {
    flex: 1,
  },
  heroSubmitBtn: {
    backgroundColor: Colors.MidnightCharcoal,
    borderRadius: ResponsivePixels.size50,
    height: ResponsivePixels.size54,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: ResponsivePixels.size10,
    borderWidth: 1.2,
    borderColor: Colors.DarkModalBarBorder,
    ...Platform.select({
      ios: {
        shadowColor: Colors.MidnightCharcoal,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.35,
        shadowRadius: 14,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  heroSubmitBtnDisabled: {
    opacity: 0.5,
  },
  heroSubmitBtnText: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: ResponsivePixels.size16,
    color: Colors.PureWhite,
    letterSpacing: -0.2,
  },
  heroSubmitCircle: {
    width: ResponsivePixels.size32,
    height: ResponsivePixels.size32,
    borderRadius: ResponsivePixels.size16,
    backgroundColor: withAlpha(Colors.PureWhite, 0.18),
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ModalBottomBar;
