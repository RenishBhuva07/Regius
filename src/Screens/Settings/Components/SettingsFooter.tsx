import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SVGS } from '../../../Assets/Images';
import { Typography } from '../../../Theme/Typographys';
import ResponsivePixels from '../../../Assets/StyleUtilities/ResponsivePixels';
import { useSettingsTheme } from './types';

export const SettingsFooter: React.FC = () => {
  const { textSecondary } = useSettingsTheme();

  return (
    <View style={styles.footerBranding}>
      <SVGS.RegiusAvatar width={28} height={28} />
      <Text style={[styles.footerText, { color: textSecondary }]}>
        Regius • Crafted with AI & Precision
      </Text>
      <Text style={[styles.footerSub, { color: textSecondary }]}>
        Version 2.4.0 (Build 2408)
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  footerBranding: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: ResponsivePixels.size10,
    marginBottom: ResponsivePixels.size24,
    gap: 6,
  },
  footerText: {
    ...Typography.bodySmallPoppinsMedium,
    fontSize: 12,
  },
  footerSub: {
    ...Typography.bodySmallPoppinsRegular,
    fontSize: 11,
    opacity: 0.7,
  },
});

export default SettingsFooter;
