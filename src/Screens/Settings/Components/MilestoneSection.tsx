import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import {
  Award,
  ChevronRight,
  Sparkles,
  Zap,
  CheckCircle2,
  Lock,
} from 'lucide-react-native';
import { Typography } from '../../../Theme/Typographys';
import { Fonts } from '../../../Theme/fonts';
import Colors, {
  Colors as StaticColors,
} from '../../../Assets/StyleUtilities/Colors';
import ResponsivePixels from '../../../Assets/StyleUtilities/ResponsivePixels';
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
    cardBg,
    textPrimary,
    textSecondary,
    borderLight,
    surfaceAlt,
  } = useSettingsTheme();

  return (
    <View style={styles.container}>
      <View style={styles.sectionHeaderRow}>
        <View style={styles.sectionTitleWithIcon}>
          <Award size={18} color="#F5C518" strokeWidth={2.4} />
          <Text style={[styles.sectionTitle, { color: textPrimary }]}>
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
            borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.12)' : '#FFFFFF',
            borderBottomColor: isDarkMode ? '#171A20' : '#E2DCD0',
            shadowColor: isDarkMode ? '#000000' : 'rgba(131, 131, 214, 0.12)',
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
                  backgroundColor: isDarkMode ? '#272B33' : '#FFF9E0',
                  borderColor: currentTier.accentColor,
                },
              ]}
            >
              <Award
                size={20}
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

          <ChevronRight size={18} color={textSecondary} strokeWidth={2} />
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
            <Sparkles size={16} color="#F5C518" strokeWidth={2.2} />
            <Text style={[styles.exploreText, { color: textPrimary }]}>
              View Pro Rewards & Tier Roadmap
            </Text>
          </View>
          <View style={styles.exploreRightBadge}>
            <Text style={styles.exploreBadgeText}>5 Tiers</Text>
            <ChevronRight size={15} color="#8E95A5" strokeWidth={2} />
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
    paddingHorizontal: 2,
  },
  sectionTitleWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: {
    fontFamily: Fonts.ranade.bold,
    fontSize: 16,
    letterSpacing: -0.2,
  },
  settingsGroupCard: {
    borderRadius: 20,
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
    marginRight: 12,
  },
  tierIconBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tierInfoMeta: {
    flex: 1,
    marginRight: 8,
  },
  tierNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  tierTitle: {
    fontFamily: Fonts.ranade.bold,
    fontSize: 15,
  },
  tierXpPill: {
    fontFamily: Fonts.poppins.bold,
    fontSize: 12,
  },
  tierSubtitle: {
    fontFamily: Fonts.poppins.regular,
    fontSize: 11.5,
    marginTop: 2,
  },
  progressContainer: {
    marginTop: 14,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
  },
  progressHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  progressLeftText: {
    fontFamily: Fonts.poppins.medium,
    fontSize: 11,
  },
  progressRightText: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: 11,
  },
  progressBarTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(128, 128, 128, 0.18)',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  itemDivider: {
    height: 1,
    marginVertical: ResponsivePixels.size12,
  },
  exploreRewardsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  exploreLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  exploreText: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: 12.5,
  },
  exploreRightBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  exploreBadgeText: {
    fontFamily: Fonts.poppins.medium,
    fontSize: 11,
    color: '#8E95A5',
  },
});

export default MilestoneSection;
