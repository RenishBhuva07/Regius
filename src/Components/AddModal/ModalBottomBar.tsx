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
import { Colors } from '../../Assets/StyleUtilities/Colors';
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

const getBottomBarBgColor = (themeId: string, isDark: boolean): string => {
  if (isDark) {
    switch (themeId) {
      case 'champagne_gold':
        return '#2A2318';
      case 'emerald_velvet':
        return '#12261E';
      case 'celestial_azure':
        return '#141E36';
      case 'obsidian_gold':
        return '#1A1810';
      case 'classic_light':
      case 'classic_dark':
      default:
        return '#282048';
    }
  } else {
    switch (themeId) {
      case 'champagne_gold':
        return '#C5A059';
      case 'emerald_velvet':
        return '#1B9A72';
      case 'celestial_azure':
        return '#3B82F6';
      case 'obsidian_gold':
        return '#D4AF37';
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
  const { isDarkMode, activeThemeId } = useTheme();
  const { width: screenWidth } = Dimensions.get('window');

  const fallbackAnim = useRef(new Animated.Value(1)).current;
  const activeAnim = createAnim ?? fallbackAnim;

  const barBgColor = getBottomBarBgColor(activeThemeId, isDarkMode);
  const bottomPadding = Math.max(insets.bottom, 16) + 6;
  const totalBarHeight = 74 + bottomPadding;

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
            ? 'rgba(255, 255, 255, 0.16)'
            : 'rgba(255, 255, 255, 0.45)',
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
          <ArrowDown size={20} color="#FFFFFF" strokeWidth={2.4} />
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
            style={[styles.heroSubmitBtn, disabled && styles.heroSubmitBtnDisabled]}
            accessibilityRole="button"
            accessibilityLabel={submitAccessibilityLabel ?? submitText}
          >
            <Text style={styles.heroSubmitBtnText}>{submitText}</Text>

            <View style={styles.heroSubmitCircle}>
              <ArrowRight size={18} color="#FFFFFF" strokeWidth={2.6} />
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
    paddingTop: 12,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderTopWidth: 1.5,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
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
    gap: 12,
  },
  backBtn: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: Colors.MidnightCharcoal,
    borderWidth: 1.2,
    borderColor: '#3A3F48',
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
    borderRadius: 50,
    height: 54,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    borderWidth: 1.2,
    borderColor: '#3A3F48',
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
    fontSize: 16,
    color: '#FFFFFF',
    letterSpacing: -0.2,
  },
  heroSubmitCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ModalBottomBar;

