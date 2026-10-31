import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { Crown, Sparkles, Palette, Zap } from 'lucide-react-native';

import { Fonts } from '../../../Theme/fonts';
import { Colors } from '../../../Assets/StyleUtilities/Colors';
import { Badge } from '../../../Common/Badge';

export interface RoyalHeroCardProps {
  isPremium: boolean;
  currentPlan: string | null;
}

export const RoyalHeroCard: React.FC<RoyalHeroCardProps> = React.memo(
  ({ isPremium, currentPlan }) => {
    return (
      <View style={styles.heroOuterWrapper}>
        <View style={styles.cardShadowWrapper}>
          <View style={styles.card}>
            <View style={styles.heroGlowCircle} />

            <View style={styles.heroCardContent}>
              {/* Top Badge & Crown Row */}
              <View style={styles.heroTopRow}>
                <View style={styles.crownIconBox}>
                  <Crown
                    size={24}
                    color="#F5C518"
                    fill="#F5C518"
                    strokeWidth={2.2}
                  />
                </View>
                <View style={styles.heroBadgeGroup}>
                  <Badge
                    label={isPremium ? 'ROYAL MONARCH' : 'ELITE PASS'}
                    variant="yellow"
                    size="sm"
                  />
                </View>
              </View>

              {/* Hero Title */}
              <Text style={styles.heroTitle}>
                {isPremium
                  ? 'Regius Royal Active'
                  : 'Elevate Your Mindful Productivity'}
              </Text>

              {/* Hero Description */}
              <Text style={styles.heroDesc}>
                {isPremium
                  ? `You are enjoying full unlimited access with the ${
                      currentPlan === 'lifetime'
                        ? 'Monarch Lifetime License'
                        : currentPlan === 'monthly'
                        ? 'Royal Monthly Membership'
                        : 'Royal Annual Pass'
                    }.`
                  : 'Experience Regius without boundaries. Unleash unlimited AI voice synthesis, custom neural wake phrases, and all artisanal theme palettes.'}
              </Text>

              {/* Hero Feature Pills */}
              <View style={styles.heroPillsRow}>
                <View style={styles.heroPill}>
                  <Sparkles size={12} color="#F5C518" strokeWidth={2.4} />
                  <Text style={styles.heroPillText}>Unlimited AI Voice</Text>
                </View>
                <View style={styles.heroPill}>
                  <Palette size={12} color="#F5C518" strokeWidth={2.4} />
                  <Text style={styles.heroPillText}>8 Luxury Themes</Text>
                </View>
                <View style={styles.heroPill}>
                  <Zap size={12} color="#F5C518" strokeWidth={2.4} />
                  <Text style={styles.heroPillText}>2x XP Boost</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  },
);

const styles = StyleSheet.create({
  heroOuterWrapper: {
    marginBottom: 24,
  },
  cardShadowWrapper: {
    borderRadius: 24,
    backgroundColor: Colors.NeroBlack,
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.32,
        shadowRadius: 20,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  card: {
    backgroundColor: Colors.NeroBlack,
    borderRadius: 24,
    borderWidth: 4,
    borderColor: 'rgba(255, 255, 255, 0.9)',
    overflow: 'hidden',
    position: 'relative',
    padding: 20,
  },
  heroGlowCircle: {
    position: 'absolute',
    top: -50,
    right: -50,
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(245, 197, 24, 0.15)',
  },
  heroCardContent: {
    position: 'relative',
    zIndex: 1,
  },
  heroTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  crownIconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(245, 197, 24, 0.18)',
    borderWidth: 1.5,
    borderColor: 'rgba(245, 197, 24, 0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroBadgeGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  heroTitle: {
    fontFamily: Fonts.ranade.bold,
    fontSize: 22,
    color: '#FFFFFF',
    letterSpacing: -0.5,
    lineHeight: 28,
    marginBottom: 8,
  },
  heroDesc: {
    fontFamily: Fonts.poppins.regular,
    fontSize: 12.5,
    color: '#D1D5DB',
    lineHeight: 18,
    marginBottom: 18,
  },
  heroPillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  heroPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  heroPillText: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: 11,
    color: '#FFFFFF',
  },
});

export default RoyalHeroCard;
