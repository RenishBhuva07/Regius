import React from 'react';
import { View, Text, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { Fonts } from '../Theme/fonts';
import { useAppTheme } from '../Theme/useAppTheme';
import ResponsivePixels from '../Assets/StyleUtilities/ResponsivePixels';
import { ScreenQuoteKey, useDailyQuote } from '../Services/DailyQuotes';

export type DailyQuoteSurface = 'sheet' | 'canvas';

export interface DailyQuoteFooterProps {
  screen: ScreenQuoteKey;
  doodle: React.ReactNode;
  surface?: DailyQuoteSurface;
  attribution?: React.ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
}

const DEFAULT_ATTRIBUTION =
  'Crafted for mindful productivity • Ahmedabad, India';

// Shared bottom daily quote watermark footer with theme-aware surface contrast.
export const DailyQuoteFooter: React.FC<DailyQuoteFooterProps> = React.memo(
  ({
    screen,
    doodle,
    surface = 'sheet',
    attribution = DEFAULT_ATTRIBUTION,
    containerStyle,
  }) => {
    const dailyQuote = useDailyQuote(screen);
    const {
      sheetWatermarkText,
      sheetWatermarkSubtext,
      canvasWatermarkText,
      canvasWatermarkSubtext,
    } = useAppTheme();

    const quoteColor =
      surface === 'canvas' ? canvasWatermarkText : sheetWatermarkText;
    const subtextColor =
      surface === 'canvas' ? canvasWatermarkSubtext : sheetWatermarkSubtext;

    return (
      <View
        style={[styles.footerWatermarkWrapper, containerStyle]}
        pointerEvents="none"
      >
        <View style={styles.footerWatermarkRow}>
          <View style={styles.footerTextBlock}>
            <Text style={[styles.footerWatermarkText, { color: quoteColor }]}>
              {dailyQuote}
            </Text>
            <View style={styles.craftedWithRow}>
              {typeof attribution === 'string' ? (
                <Text style={[styles.craftedWithText, { color: subtextColor }]}>
                  {attribution}
                </Text>
              ) : (
                attribution
              )}
            </View>
          </View>

          <View style={styles.footerDoodleWrapper}>{doodle}</View>
        </View>
      </View>
    );
  },
);

const styles = StyleSheet.create({
  footerWatermarkWrapper: {
    paddingLeft: ResponsivePixels.size10,
    paddingRight: ResponsivePixels.size16,
    marginTop: ResponsivePixels.size20,
    marginBottom: ResponsivePixels.size20,
  },
  footerWatermarkRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  footerTextBlock: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  footerWatermarkText: {
    fontFamily: Fonts.poppins.bold,
    fontSize: ResponsivePixels.size34,
    lineHeight: ResponsivePixels.size42,
    letterSpacing: -1.2,
  },
  craftedWithRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: ResponsivePixels.size18,
  },
  craftedWithText: {
    fontFamily: Fonts.poppins.medium,
    fontSize: ResponsivePixels.size14,
  },
  footerDoodleWrapper: {
    marginLeft: ResponsivePixels.size8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: ResponsivePixels.size6,
  },
});

export default DailyQuoteFooter;
