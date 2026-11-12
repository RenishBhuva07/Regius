import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import {
  Award,
  ChevronRight,
  Sparkles,
} from 'lucide-react-native';
import { Fonts } from '../../../Theme/fonts';
import ResponsivePixels from '../../../Assets/StyleUtilities/ResponsivePixels';
import Colors, { withAlpha } from '../../../Assets/StyleUtilities/Colors';
import { Badge } from '../../../Common/Badge';
import { MilestoneTier } from '../../../Services/Milestone/MilestoneService';
import { useSettingsTheme } from './types';

interface MilestoneSectionProps {
  currentTier: MilestoneTier;
  nextTier: MilestoneTier | null;
  totalXp: number;
  tierProgress: number;
  currentInTier: number;
  requiredForTier: number;
  onOpenMilestoneJourney: () => void;
}

export const MilestoneSection: React.FC<MilestoneSectionProps> = ({
  currentTier,
  nextTier,
  totalXp,
  tierProgress,
  currentInTier,
  requiredForTier,
  onOpenMilestoneJourney,
}) => {
  const {
    isDarkMode,
    activeThemeId,
    cardBg,
    textPrimary,
    textSecondary,
    canvasTextPrimary,
    borderLight,
    surfaceAlt,
  } = useSettingsTheme();

  return (
    <View style={styles.container}>
      <View style={styles.sectionHeaderRow}>
        <View style={styles.sectionTitleWithIcon}>
          <Award size={ResponsivePixels.size18} color={Colors.AccentYellow} strokeWidth={2.4} />
          <Text style={[styles.sectionTitle, { color: canvasTextPrimary }]}>
            Milestones & Pro Unlocks
          </Text>
        </View>
        <Badge
          label={`Tier ${currentTier.level}`}
          variant={currentTier.badgeVariant}
          size="sm"
        />
      </View>

      {/* 3D Tactile Settings Bento Card */}
      <View
        style={[
          styles.settingsGroupCard,
          {
            backgroundColor: cardBg,
            borderColor:
              activeThemeId === 'cyprus_sand'
                ? Colors.CyprusBorderDarkCard
                : isDarkMode
                ? withAlpha(Colors.PureWhite, 0.12)
                : Colors.PureWhite,
            borderBottomColor:
              activeThemeId === 'cyprus_sand'
                ? Colors.SandstoneBorder
                : isDarkMode
                ? Colors.DarkSurfaceDeep
                : Colors.WarmStoneBorder,
            shadowColor:
              activeThemeId === 'cyprus_sand'
                ? withAlpha(Colors.CyprusTeal, 0.16)
                : isDarkMode
                ? Colors.PureBlack
                : withAlpha(Colors.LavenderPurple, 0.12),
          },
        ]}
      >
        {/* Tier Status Row */}
        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.tierStatusRow}
          onPress={onOpenMilestoneJourney}
          accessibilityRole="button"
          accessibilityLabel="Open milestone journey and rewards"
        >
          <View style={styles.tierIconBadgeWrapper}>
            <View
              style={[
                styles.tierIconBadge,
                {
                  backgroundColor:
                    activeThemeId === 'cyprus_sand'
                      ? Colors.MilestoneCreamBg
                      : isDarkMode
                      ? Colors.DarkCardBevelSurface
                      : Colors.WorkSoftHighlight,
                  borderColor: currentTier.accentColor,
                },
              ]}
            >
              <Award
                size={ResponsivePixels.size20}
                color={currentTier.accentColor}
                strokeWidth={2.3}
              />
            </View>
          </View>

          <View style={styles.tierInfoMeta}>
            <View style={styles.tierNameRow}>
              <Text style={[styles.tierTitle, { color: textPrimary }]}>
                {currentTier.title}
              </Text>
              <Text
                style={[styles.tierXpPill, { color: currentTier.accentColor }]}
              >
                {`${totalXp} XP`}
              </Text>
            </View>
            <Text style={[styles.tierSubtitle, { color: textSecondary }]}>
              {currentTier.subtitle}
            </Text>
          </View>

          <ChevronRight size={ResponsivePixels.size18} color={textSecondary} strokeWidth={2} />
        </TouchableOpacity>

        {/* Progress Bar Container */}
        <View
          style={[
            styles.progressContainer,
            { backgroundColor: surfaceAlt, borderColor: borderLight },
          ]}
        >
          <View style={styles.progressHeaderRow}>
            <Text style={[styles.progressLeftText, { color: textSecondary }]}>
              {nextTier ? `Progress to ${nextTier.title}` : 'Supreme Sovereign'}
            </Text>
            <Text style={[styles.progressRightText, { color: textPrimary }]}>
              {nextTier
                ? `${currentInTier} / ${requiredForTier} XP`
                : 'Max Rank'}
            </Text>
          </View>

          <View style={styles.progressBarTrack}>
            <View
              style={[
                styles.progressBarFill,
                {
                  width: `${Math.round(tierProgress * 100)}%`,
                  backgroundColor: currentTier.accentColor,
                },
              ]}
            />
          </View>
        </View>

        <View style={[styles.itemDivider, { backgroundColor: borderLight }]} />

        {/* Roadmap Action Button */}
        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.exploreRewardsBtn}
          onPress={onOpenMilestoneJourney}
          accessibilityRole="button"
          accessibilityLabel="Explore milestone rewards and unlocked themes"
        >
          <View style={styles.exploreLeft}>
            <Sparkles size={ResponsivePixels.size16} color={Colors.AccentYellow} strokeWidth={2.2} />
            <Text style={[styles.exploreText, { color: textPrimary }]}>
              View Pro Rewards & Tier Roadmap
            </Text>
          </View>
          <View style={styles.exploreRightBadge}>
            <Text style={styles.exploreBadgeText}>5 Tiers</Text>
            <ChevronRight
              size={ResponsivePixels.size15}
              color={Colors.MilestoneSlate}
              strokeWidth={2}
            />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: ResponsivePixels.size24,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: ResponsivePixels.size12,
    paddingHorizontal: ResponsivePixels.size2,
  },
  sectionTitleWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ResponsivePixels.size8,
  },
  sectionTitle: {
    fontFamily: Fonts.ranade.bold,
    fontSize: ResponsivePixels.size16,
    letterSpacing: -0.2,
  },
  settingsGroupCard: {
    borderRadius: ResponsivePixels.size20,
    borderWidth: 1,
    borderBottomWidth: 3,
    padding: ResponsivePixels.size16,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 3,
  },
  tierStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tierIconBadgeWrapper: {
    marginRight: ResponsivePixels.size12,
  },
  tierIconBadge: {
    width: ResponsivePixels.size44,
    height: ResponsivePixels.size44,
    borderRadius: ResponsivePixels.size22,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tierInfoMeta: {
    flex: 1,
    marginRight: ResponsivePixels.size8,
  },
  tierNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ResponsivePixels.size8,
  },
  tierTitle: {
    fontFamily: Fonts.ranade.bold,
    fontSize: ResponsivePixels.size15,
  },
  tierXpPill: {
    fontFamily: Fonts.poppins.bold,
    fontSize: ResponsivePixels.size12,
  },
  tierSubtitle: {
    fontFamily: Fonts.poppins.regular,
    fontSize: ResponsivePixels.size11_5,
    marginTop: ResponsivePixels.size2,
  },
  progressContainer: {
    marginTop: ResponsivePixels.size14,
    padding: ResponsivePixels.size12,
    borderRadius: ResponsivePixels.size14,
    borderWidth: 1,
  },
  progressHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: ResponsivePixels.size6,
  },
  progressLeftText: {
    fontFamily: Fonts.poppins.medium,
    fontSize: ResponsivePixels.size11,
  },
  progressRightText: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: ResponsivePixels.size11,
  },
  progressBarTrack: {
    height: ResponsivePixels.size6,
    borderRadius: ResponsivePixels.size3,
    backgroundColor: withAlpha(Colors.NeutralGray500, 0.18),
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: ResponsivePixels.size3,
  },
  itemDivider: {
    height: 1,
    marginVertical: ResponsivePixels.size12,
  },
  exploreRewardsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: ResponsivePixels.size4,
  },
  exploreLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ResponsivePixels.size8,
  },
  exploreText: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: ResponsivePixels.size12_5,
  },
  exploreRightBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ResponsivePixels.size4,
  },
  exploreBadgeText: {
    fontFamily: Fonts.poppins.medium,
    fontSize: ResponsivePixels.size11,
    color: Colors.MilestoneSlate,
  },
});

export default MilestoneSection;
