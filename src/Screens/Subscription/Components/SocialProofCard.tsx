import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Star } from 'lucide-react-native';

import { Fonts } from '../../../Theme/fonts';

export interface SocialProofCardProps {
  isDarkMode: boolean;
}

export const SocialProofCard: React.FC<SocialProofCardProps> = React.memo(
  ({ isDarkMode }) => {
    const cardBg = isDarkMode ? '#1E2228' : '#FFFFFF';
    const textPrimary = isDarkMode ? '#FFFFFF' : '#111111';
    const textSecondary = isDarkMode ? '#A3A8B1' : '#666665';
    const borderLight = isDarkMode ? '#2C3035' : '#EAE5D9';

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
        <View style={styles.starsRow}>
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={14}
              color="#F5C518"
              fill="#F5C518"
              strokeWidth={2}
            />
          ))}
          <Text style={[styles.ratingText, { color: textPrimary }]}>
            4.9/5 from 12,000+ members
          </Text>
        </View>
        <Text style={[styles.guaranteeDesc, { color: textSecondary }]}>
          “Regius transformed how I organize my days with voice and elegant
          tactile focus. Upgrading was the easiest decision of the year.”
        </Text>
        <Text style={[styles.guaranteeAuthor, { color: textPrimary }]}>
          — Marcus Vance, Design Principal
        </Text>
      </View>
    );
  },
);

const styles = StyleSheet.create({
  trustCard: {
    borderRadius: 18,
    borderWidth: 1.5,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 5,
    elevation: 2,
  },
  starsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 8,
  },
  ratingText: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: 12,
    marginLeft: 6,
  },
  guaranteeDesc: {
    fontFamily: Fonts.poppins.regular,
    fontSize: 12,
    lineHeight: 18,
    fontStyle: 'italic',
    marginBottom: 6,
  },
  guaranteeAuthor: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: 11.5,
  },
});

export default SocialProofCard;
