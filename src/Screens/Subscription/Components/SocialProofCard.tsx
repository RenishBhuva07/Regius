import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ShieldCheck } from 'lucide-react-native';

import { Fonts } from '../../../Theme/fonts';
import { Colors } from '../../../Assets/StyleUtilities/Colors';
import { useTheme } from '../../../Theme/ThemeContext';
import ResponsivePixels from '../../../Assets/StyleUtilities/ResponsivePixels';

export interface SocialProofCardProps {
  isDarkMode: boolean;
}

export const SocialProofCard: React.FC<SocialProofCardProps> = React.memo(
  ({ isDarkMode }) => {
    const { Colors: themeColors } = useTheme();
    const cardBg =
      themeColors.CardBackground ||
      (isDarkMode ? Colors.DarkCardBackground : Colors.PureWhite);
    const textPrimary =
      themeColors.PrimaryText ||
      (isDarkMode ? Colors.PureWhite : Colors.NoirBlack);
    const textSecondary =
      themeColors.SecondaryText ||
      (isDarkMode ? Colors.SteelMist : Colors.SubtitleGray);
    const borderLight =
      themeColors.BorderLight ||
      (isDarkMode ? Colors.CarbonSlate : Colors.WarmParchmentBorder);

    return (
      <View
        style={[
          styles.trustCard,
          {
            backgroundColor: cardBg,
            borderColor: borderLight,
          },
        ]}
      >
        <View style={styles.headerRow}>
          <ShieldCheck
            size={ResponsivePixels.size16}
            color={isDarkMode ? Colors.AccentGreen : Colors.GreenGracious}
            strokeWidth={2.4}
          />
          <Text style={[styles.headingText, { color: textPrimary }]}>
            Local-First & Private
          </Text>
        </View>
        <Text style={[styles.architectureDesc, { color: textSecondary }]}>
          Your daily schedule, audio recordings, and personal journal stay
          strictly on your device. Voice recognition operates on local models
          with zero cloud telemetry.
        </Text>
        <Text style={[styles.privacyNote, { color: textSecondary }]}>
          Zero trackers • Zero third-party analytics
        </Text>
      </View>
    );
  },
);

const styles = StyleSheet.create({
  trustCard: {
    borderRadius: ResponsivePixels.size18,
    borderWidth: 1.5,
    padding: ResponsivePixels.size16,
    marginBottom: ResponsivePixels.size20,
    shadowColor: Colors.PureBlack,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 5,
    elevation: 2,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ResponsivePixels.size6,
    marginBottom: ResponsivePixels.size8,
  },
  headingText: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: ResponsivePixels.size12_5,
  },
  architectureDesc: {
    fontFamily: Fonts.poppins.regular,
    fontSize: ResponsivePixels.size11_5,
    lineHeight: ResponsivePixels.size17,
    marginBottom: ResponsivePixels.size8,
  },
  privacyNote: {
    fontFamily: Fonts.poppins.medium,
    fontSize: ResponsivePixels.size10_5,
    letterSpacing: 0.2,
  },
});

export default SocialProofCard;
