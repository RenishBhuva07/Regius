import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { Crown, Sparkles, Palette, Zap } from 'lucide-react-native';

import { Fonts } from '../../../Theme/fonts';
import { Colors, withAlpha } from '../../../Assets/StyleUtilities/Colors';
import { Badge } from '../../../Common/Badge';
import ResponsivePixels from '../../../Assets/StyleUtilities/ResponsivePixels';

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
            <View style={styles.heroCardContent}>
              {/* Top Badge & Crown Row */}
              <View style={styles.heroTopRow}>
                <View style={styles.crownIconBox}>
                  <Crown
                    size={ResponsivePixels.size24}
                    color={Colors.AccentYellow}
                    fill={Colors.AccentYellow}
                    strokeWidth={2.2}
                  />
                </View>
                <View style={styles.heroBadgeGroup}>
                  <Badge
                    label={isPremium ? 'Royal Member' : 'Full Access'}
                    variant="yellow"
                    size="sm"
                  />
                </View>
              </View>

              {/* Hero Title */}
              <Text style={styles.heroTitle}>
                {isPremium
                  ? 'Regius Royal Active'
                  : 'Clarity Through Voice & Journaling'}
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
                  : 'Full access to on-device neural voice synthesis, bespoke acoustic profiles, and tactile journal themes.'}
              </Text>

              {/* Hero Feature Pills */}
              <View style={styles.heroPillsRow}>
                <View style={styles.heroPill}>
                  <Sparkles
                    size={ResponsivePixels.size12}
                    color={Colors.AccentYellow}
                    strokeWidth={2.4}
                  />
                  <Text style={styles.heroPillText}>Neural Voice Synthesis</Text>
                </View>
                <View style={styles.heroPill}>
                  <Palette
                    size={ResponsivePixels.size12}
                    color={Colors.AccentYellow}
                    strokeWidth={2.4}
                  />
                  <Text style={styles.heroPillText}>8 Artisanal Themes</Text>
                </View>
                <View style={styles.heroPill}>
                  <Zap
                    size={ResponsivePixels.size12}
                    color={Colors.AccentYellow}
                    strokeWidth={2.4}
                  />
                  <Text style={styles.heroPillText}>Acoustic Morning Briefing</Text>
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
    marginBottom: ResponsivePixels.size24,
  },
  cardShadowWrapper: {
    borderRadius: ResponsivePixels.size24,
    backgroundColor: Colors.NeroBlack,
    ...Platform.select({
      ios: {
        shadowColor: Colors.PureBlack,
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
    borderRadius: ResponsivePixels.size24,
    borderWidth: 4,
    borderColor: withAlpha(Colors.PureWhite, 0.9),
    overflow: 'hidden',
    position: 'relative',
    padding: ResponsivePixels.size20,
  },
  heroCardContent: {
    position: 'relative',
    zIndex: 1,
  },
  heroTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: ResponsivePixels.size16,
  },
  crownIconBox: {
    width: ResponsivePixels.size44,
    height: ResponsivePixels.size44,
    borderRadius: ResponsivePixels.size22,
    backgroundColor: withAlpha(Colors.AccentYellow, 0.18),
    borderWidth: 1.5,
    borderColor: withAlpha(Colors.AccentYellow, 0.45),
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroBadgeGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  heroTitle: {
    fontFamily: Fonts.ranade.bold,
    fontSize: ResponsivePixels.size22,
    color: Colors.PureWhite,
    letterSpacing: -0.5,
    lineHeight: ResponsivePixels.size28,
    marginBottom: ResponsivePixels.size8,
  },
  heroDesc: {
    fontFamily: Fonts.poppins.regular,
    fontSize: ResponsivePixels.size12_5,
    color: Colors.Gray300,
    lineHeight: ResponsivePixels.size18,
    marginBottom: ResponsivePixels.size18,
  },
  heroPillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: ResponsivePixels.size8,
  },
  heroPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ResponsivePixels.size6,
    backgroundColor: withAlpha(Colors.PureWhite, 0.1),
    borderRadius: ResponsivePixels.size20,
    paddingHorizontal: ResponsivePixels.size12,
    paddingVertical: ResponsivePixels.size6,
    borderWidth: 1,
    borderColor: withAlpha(Colors.PureWhite, 0.2),
  },
  heroPillText: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: ResponsivePixels.size11,
    color: Colors.PureWhite,
  },
});

export default RoyalHeroCard;
