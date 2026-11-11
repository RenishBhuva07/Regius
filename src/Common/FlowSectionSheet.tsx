import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StyleProp,
  ViewStyle,
  Platform,
} from 'react-native';
import { Plus } from 'lucide-react-native';
import { Fonts } from '../Theme/fonts';
import { Colors } from '../Assets/StyleUtilities/Colors';
import ResponsivePixels from '../Assets/StyleUtilities/ResponsivePixels';
import FlowBadgePatternSvg from '../Screens/Dashboard/Components/FlowBadgePatternSvg';
import { useAppTheme } from '../Theme/useAppTheme';

export interface FlowSectionSheetProps {
  title: string | React.ReactNode;
  subtitle?: string | React.ReactNode;
  backgroundSvg?: React.ReactNode;
  onPressAdd?: () => void;
  addAccessibilityLabel?: string;
  children: React.ReactNode;
  bottomPadding?: number;
  containerStyle?: StyleProp<ViewStyle>;
}

export const FlowSectionSheet: React.FC<FlowSectionSheetProps> = React.memo(
  ({
    title,
    subtitle,
    backgroundSvg,
    onPressAdd,
    addAccessibilityLabel = 'Add item',
    children,
    bottomPadding = 130,
    containerStyle,
  }) => {
    const { isDarkMode, activeThemeId, surfaceAlt, borderLight } = useAppTheme();
    const isSandSheet = activeThemeId === 'cyprus_sand';

    return (
      <View
        style={[
          styles.sectionContainer,
          containerStyle,
          isDarkMode &&
            !isSandSheet && {
              backgroundColor: surfaceAlt,
              borderTopColor: borderLight,
              borderLeftColor: borderLight,
              borderRightColor: borderLight,
            },
          isSandSheet && {
            backgroundColor: Colors.CyprusSandPaper,
            borderTopColor: Colors.PureWhite,
            borderLeftColor: Colors.CyprusSandAlt,
            borderRightColor: Colors.CyprusSandAlt,
          },
          { paddingBottom: bottomPadding },
        ]}
      >
        {/* Background decorative SVG filigree */}
        {backgroundSvg && (
          <View style={styles.backgroundSvgWrapper} pointerEvents="none">
            {backgroundSvg}
          </View>
        )}

        {/* Section Header Crest Badge centered on top edge */}
        <View style={styles.flowHeaderBadge}>
          <FlowBadgePatternSvg />
          {typeof title === 'string' ? (
            <Text style={styles.flowTitle} numberOfLines={1}>
              {title}
            </Text>
          ) : (
            title
          )}
          {subtitle &&
            (typeof subtitle === 'string' ? (
              <Text style={styles.flowSubtitle} numberOfLines={1}>
                {subtitle}
              </Text>
            ) : (
              subtitle
            ))}
        </View>

        {/* Floating '+' action button straddling top-right edge in symmetry with header crest */}
        {onPressAdd && (
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={onPressAdd}
            style={styles.floatingAddBtn}
            accessibilityRole="button"
            accessibilityLabel={addAccessibilityLabel}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Plus
              size={ResponsivePixels.size18}
              color={Colors.PureWhite}
              strokeWidth={2.6}
            />
          </TouchableOpacity>
        )}

        {/* Inner Content */}
        {children}
      </View>
    );
  },
);

const styles = StyleSheet.create({
  sectionContainer: {
    backgroundColor: Colors.CreamSurfaceAlt,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingTop: 36,
    paddingHorizontal: 0,
    position: 'relative',
    marginTop: 24,
    borderWidth: 1.5,
    borderTopColor: Colors.PureWhite,
    borderLeftColor: Colors.CreamBorderSubtle,
    borderRightColor: Colors.CreamBorderSubtle,
    borderBottomWidth: 0,
    ...Platform.select({
      ios: {
        shadowColor: Colors.DarkBackground,
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  backgroundSvgWrapper: {
    ...StyleSheet.absoluteFill,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    overflow: 'hidden',
  },
  flowHeaderBadge: {
    position: 'absolute',
    top: -ResponsivePixels.size24,
    alignSelf: 'center',
    backgroundColor: Colors.NeroBlack,
    paddingHorizontal: ResponsivePixels.size22,
    paddingVertical: ResponsivePixels.size7,
    borderRadius: ResponsivePixels.size22,
    borderWidth: 1.5,
    borderTopColor: Colors.DarkBevelTop,
    borderLeftColor: Colors.DarkBorder,
    borderRightColor: Colors.DarkBorder,
    borderBottomWidth: 4,
    borderBottomColor: Colors.DarkBevelAbyss,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.DarkShadowAnchor,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.32,
    shadowRadius: 8,
    elevation: 6,
    zIndex: 20,
    overflow: 'hidden',
  },
  flowTitle: {
    fontFamily: Fonts.poppins.bold,
    fontSize: 14.5,
    color: Colors.PureWhite,
    letterSpacing: -0.1,
    textAlign: 'center',
  },
  flowSubtitle: {
    fontFamily: Fonts.poppins.medium,
    fontSize: 10.5,
    color: Colors.CoolSilverSubtitle,
    marginTop: 1,
    textAlign: 'center',
  },
  floatingAddBtn: {
    position: 'absolute',
    top: -ResponsivePixels.size21,
    right: ResponsivePixels.size18,
    width: ResponsivePixels.size42,
    height: ResponsivePixels.size42,
    borderRadius: ResponsivePixels.size21,
    backgroundColor: Colors.NeroBlack,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderTopColor: Colors.DarkBevelTop,
    borderLeftColor: Colors.DarkBorder,
    borderRightColor: Colors.DarkBorder,
    borderBottomWidth: 3.5,
    borderBottomColor: Colors.DarkBevelAbyss,
    ...Platform.select({
      ios: {
        shadowColor: Colors.DarkShadowAnchor,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.32,
        shadowRadius: 6,
      },
      android: {
        elevation: 6,
      },
    }),
    zIndex: 20,
  },
});

export default FlowSectionSheet;
