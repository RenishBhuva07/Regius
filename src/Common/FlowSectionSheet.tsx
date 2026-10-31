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
import FlowBadgePatternSvg from '../Screens/Dashboard/Components/FlowBadgePatternSvg';

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
    return (
      <View
        style={[
          styles.sectionContainer,
          { paddingBottom: bottomPadding },
          containerStyle,
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

        {/* Optional floating '+' action button at top-right corner */}
        {onPressAdd && (
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={onPressAdd}
            style={styles.floatingAddBtn}
            accessibilityRole="button"
            accessibilityLabel={addAccessibilityLabel}
          >
            <Plus size={18} color="#FFFFFF" strokeWidth={2.6} />
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
    backgroundColor: '#FAF8F5',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingTop: 36,
    paddingHorizontal: 0,
    position: 'relative',
    marginTop: 24,
    borderWidth: 1.5,
    borderTopColor: '#FFFFFF',
    borderLeftColor: '#F0ECE1',
    borderRightColor: '#F0ECE1',
    borderBottomWidth: 0,
    ...Platform.select({
      ios: {
        shadowColor: '#121417',
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
    top: -24,
    alignSelf: 'center',
    backgroundColor: Colors.NeroBlack,
    paddingHorizontal: 22,
    paddingVertical: 7,
    borderRadius: 22,
    borderWidth: 1.5,
    borderTopColor: '#4A4E5C',
    borderLeftColor: '#363944',
    borderRightColor: '#363944',
    borderBottomWidth: 4,
    borderBottomColor: '#090A0D',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0B0D11',
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
    color: Colors.DefaultWhite,
    letterSpacing: -0.1,
    textAlign: 'center',
  },
  flowSubtitle: {
    fontFamily: Fonts.poppins.medium,
    fontSize: 10.5,
    color: '#B6B9C3',
    marginTop: 1,
    textAlign: 'center',
  },
  floatingAddBtn: {
    position: 'absolute',
    top: 18,
    right: 18,
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#1E2028',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.2,
    borderColor: '#4A4E5C',
    borderBottomWidth: 3,
    borderBottomColor: '#0E1015',
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.28,
        shadowRadius: 5,
      },
      android: {
        elevation: 5,
      },
    }),
    zIndex: 10,
  },
});

export default FlowSectionSheet;
