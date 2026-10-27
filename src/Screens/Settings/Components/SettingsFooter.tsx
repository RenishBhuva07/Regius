import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Fonts } from '../../../Theme/fonts';
import Colors from '../../../Assets/StyleUtilities/Colors';
import ResponsivePixels from '../../../Assets/StyleUtilities/ResponsivePixels';
import { useSettingsTheme } from './types';
import SettingsWatermarkDoodleSvg from './SettingsWatermarkDoodleSvg';

export const SettingsFooter: React.FC = () => {
  const { isDarkMode } = useSettingsTheme();

  const watermarkColor = isDarkMode ? '#5E6472' : '#8E95A5';
  const subtextColor = isDarkMode ? '#828896' : '#717885';
  const regiusHighlightColor = isDarkMode ? '#9C9CE3' : Colors.LavenderPurple;

  return (
    <View style={styles.footerWatermarkWrapper} pointerEvents="none">
      <View style={styles.watermarkContainer}>
        {/* Doodle illustration */}
        <View style={styles.footerDoodleWrapper}>
          <SettingsWatermarkDoodleSvg width={130} height={130} />
        </View>

        {/* Watermark text */}
        <View style={styles.footerTextBlock}>
          <Text style={[styles.footerWatermarkText, { color: watermarkColor }]}>
            <Text
              style={[styles.regiusHighlight, { color: regiusHighlightColor }]}
            >
              Regius
            </Text>
            {' •\nCrafted\nwith AI & Precision'}
          </Text>
        </View>
      </View>

      {/* Attribution */}
      <View style={styles.craftedWithRow}>
        <Text style={[styles.craftedWithText, { color: subtextColor }]}>
          Crafted with{' '}
        </Text>
        <Text style={styles.craftedWithHeart}>❤️</Text>
        <Text style={[styles.craftedWithText, { color: subtextColor }]}>
          {' '}
          in Ahmedabad, India
        </Text>
      </View>

      {/* Version info */}
      <Text
        style={[styles.versionText, { color: subtextColor }]}
        numberOfLines={1}
      >
        Version 2.4.0 (Build 2408) • Production
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  footerWatermarkWrapper: {
    paddingHorizontal: ResponsivePixels.size16,
    marginTop: ResponsivePixels.size52,
    marginBottom: ResponsivePixels.size24,
  },
  watermarkContainer: {
    position: 'relative',
    minHeight: 140,
  },
  footerDoodleWrapper: {
    position: 'absolute',
    top: -42,
    right: 0,
    zIndex: 1,
  },
  footerTextBlock: {
    width: '100%',
  },
  footerWatermarkText: {
    fontFamily: Fonts.poppins.bold,
    fontSize: 34,
    lineHeight: 42,
    letterSpacing: -1.2,
  },
  regiusHighlight: {
    fontFamily: Fonts.poppins.bold,
    fontSize: 44,
    lineHeight: 50,
  },
  craftedWithRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: 22,
  },
  craftedWithText: {
    fontFamily: Fonts.poppins.medium,
    fontSize: 14,
  },
  craftedWithHeart: {
    fontSize: 13.5,
  },
  versionText: {
    fontFamily: Fonts.poppins.regular,
    fontSize: 11,
    opacity: 0.75,
    marginTop: 6,
    textAlign: 'center',
    alignSelf: 'center',
  },
});

export default SettingsFooter;
