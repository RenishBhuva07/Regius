import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Fonts } from '../../../Theme/fonts';
import Colors from '../../../Assets/StyleUtilities/Colors';
import ResponsivePixels from '../../../Assets/StyleUtilities/ResponsivePixels';
import { useSettingsTheme } from './types';
import SettingsWatermarkDoodleSvg from './SettingsWatermarkDoodleSvg';

export const SettingsFooter: React.FC = () => {
  const { isDarkMode } = useSettingsTheme();

  const watermarkColor = isDarkMode
    ? Colors.DarkWatermarkSlate
    : Colors.MilestoneSlate;
  const subtextColor = isDarkMode
    ? Colors.DarkSubtextCoolGray
    : Colors.LightSubtextSlateGray;
  const regiusHighlightColor = isDarkMode
    ? Colors.PeriwinkleSoft
    : Colors.LavenderPurple;

  return (
    <View style={styles.footerWatermarkWrapper} pointerEvents="none">
      <View style={styles.watermarkContainer}>
        {/* Doodle illustration */}
        <View style={styles.footerDoodleWrapper}>
          <SettingsWatermarkDoodleSvg
            width={ResponsivePixels.size130}
            height={ResponsivePixels.size130}
          />
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
    minHeight: ResponsivePixels.size140,
  },
  footerDoodleWrapper: {
    position: 'absolute',
    top: -ResponsivePixels.size42,
    right: 0,
    zIndex: 1,
  },
  footerTextBlock: {
    width: '100%',
  },
  footerWatermarkText: {
    fontFamily: Fonts.poppins.bold,
    fontSize: ResponsivePixels.size34,
    lineHeight: ResponsivePixels.size42,
    letterSpacing: -1.2,
  },
  regiusHighlight: {
    fontFamily: Fonts.poppins.bold,
    fontSize: ResponsivePixels.size44,
    lineHeight: ResponsivePixels.size50,
  },
  craftedWithRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: ResponsivePixels.size22,
  },
  craftedWithText: {
    fontFamily: Fonts.poppins.medium,
    fontSize: ResponsivePixels.size14,
  },
  craftedWithHeart: {
    fontSize: ResponsivePixels.size13_5,
  },
  versionText: {
    fontFamily: Fonts.poppins.regular,
    fontSize: ResponsivePixels.size11,
    opacity: 0.75,
    marginTop: ResponsivePixels.size6,
    textAlign: 'center',
    alignSelf: 'center',
  },
});

export default SettingsFooter;
