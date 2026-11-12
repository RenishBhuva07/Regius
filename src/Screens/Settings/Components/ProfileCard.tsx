import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Edit3, Award, ChevronRight } from 'lucide-react-native';
import { Fonts } from '../../../Theme/fonts';
import Colors, {
  Colors as StaticColors,
  withAlpha,
} from '../../../Assets/StyleUtilities/Colors';
import { SVGS } from '../../../Assets/Images';
import { Badge } from '../../../Common/Badge';
import { ProBadge } from '../../../Common/ProBadge';
import ResponsivePixels from '../../../Assets/StyleUtilities/ResponsivePixels';
import ProfileCardBackgroundSvg from './ProfileCardBackgroundSvg';
import { MilestoneTier } from '../../../Services/Milestone/MilestoneService';
import { useSettingsTheme } from './types';

interface ProfileCardProps {
  name: string;
  email: string;
  bio: string;
  role: string;
  selectedVoiceName: string;
  onEditPress: () => void;
  milestoneTier?: MilestoneTier;
  milestoneXp?: number;
  milestoneProgress?: number;
  tasksDoneCount?: number;
  habitsFollowedCount?: number;
  onMilestonePress?: () => void;
  isPremium?: boolean;
  onProPress?: () => void;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({
  name,
  email,
  bio,
  role: _role,
  selectedVoiceName,
  onEditPress,
  milestoneTier,
  milestoneXp = 0,
  milestoneProgress = 0,
  tasksDoneCount = 142,
  habitsFollowedCount: _habitsFollowedCount = 8,
  onMilestonePress,
  isPremium: _isPremium = false,
  onProPress,
}) => {
  const { accent } = useSettingsTheme();
  const themeAccent = accent || StaticColors.LavenderPurple;

  return (
    <View style={styles.cardShadowWrapper}>
      <View style={styles.card}>
        {/* Background pattern */}
        <ProfileCardBackgroundSvg />

        <View style={styles.cardContent}>
          {/* Profile info */}
          <View style={styles.profileCardTop}>
            <View style={styles.avatarWrapper}>
              <View style={styles.avatarRing}>
                <SVGS.RegiusAvatar
                  width={ResponsivePixels.size52}
                  height={ResponsivePixels.size52}
                />
              </View>
            </View>

            <View style={styles.profileDetails}>
              <View style={styles.nameRow}>
                <Text style={styles.profileName} numberOfLines={1}>
                  {name}
                </Text>
                <ProBadge size="sm" onPress={onProPress} />
              </View>
              <Text style={styles.profileEmail} numberOfLines={1}>
                {email}
              </Text>
              <View style={styles.roleBadgeWrapper}>
                {milestoneTier && (
                  <Badge
                    label={`Tier ${milestoneTier.level} ${milestoneTier.title}`}
                    variant={milestoneTier.badgeVariant}
                    size="sm"
                  />
                )}
              </View>
            </View>

            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.editProfileBtn}
              onPress={onEditPress}
              accessibilityRole="button"
              accessibilityLabel="Edit Profile"
            >
              <Edit3 size={ResponsivePixels.size14} color={Colors.PureWhite} strokeWidth={2.2} />
              <Text style={styles.editProfileBtnText}>Edit</Text>
            </TouchableOpacity>
          </View>

          {/* Role snippet */}
          {bio ? (
            <View style={styles.bioSnippet}>
              <Text style={styles.bioSnippetText} numberOfLines={2}>
                {bio}
              </Text>
            </View>
          ) : null}

          {/* Milestone progress */}
          {milestoneTier && (
            <TouchableOpacity
              activeOpacity={0.85}
              style={styles.milestoneBanner}
              onPress={onMilestonePress}
              accessibilityRole="button"
              accessibilityLabel={`Milestone tier ${milestoneTier.level}, ${milestoneTier.title}, ${milestoneXp} XP. Tap to view rewards.`}
            >
              <View style={styles.milestoneTopRow}>
                <View style={styles.milestoneLeftInfo}>
                  <Award
                    size={ResponsivePixels.size15}
                    color={milestoneTier.accentColor || Colors.AccentYellow}
                    strokeWidth={2.4}
                  />
                  <Text style={styles.milestoneLevelText}>
                    Milestone Level: Tier {milestoneTier.level} •{' '}
                    {milestoneTier.title}
                  </Text>
                </View>
                <View style={styles.milestoneXpWrapper}>
                  <Text style={styles.milestoneXpText}>{milestoneXp} XP</Text>
                  <ChevronRight
                    size={ResponsivePixels.size13}
                    color={Colors.BriefingSilverText}
                    strokeWidth={2}
                  />
                </View>
              </View>

              {/* Progress bar */}
              <View style={styles.milestoneBarTrack}>
                <View
                  style={[
                    styles.milestoneBarFill,
                    {
                      width: `${Math.max(
                        6,
                        Math.min(100, Math.round(milestoneProgress * 100)),
                      )}%`,
                      backgroundColor:
                        milestoneTier.accentColor || Colors.AccentYellow,
                    },
                  ]}
                />
              </View>
            </TouchableOpacity>
          )}

          {/* Metrics row */}
          <View style={styles.profileMetricsRow}>
            <View style={styles.metricItem}>
              <Text style={styles.metricValue}>{tasksDoneCount}</Text>
              <Text style={styles.metricLabel}>Tasks Done</Text>
            </View>
            <View style={styles.metricDivider} />
            <View style={styles.metricItem}>
              <Text
                style={[
                  styles.metricValue,
                  milestoneTier && { color: milestoneTier.accentColor },
                ]}
              >
                {milestoneTier ? `Tier ${milestoneTier.level}` : 'Tier 1'}
              </Text>
              <Text style={styles.metricLabel}>Milestone Rank</Text>
            </View>
            <View style={styles.metricDivider} />
            <View style={styles.metricItem}>
              <Text
                style={[
                  styles.metricValue,
                  { color: themeAccent },
                ]}
              >
                {selectedVoiceName}
              </Text>
              <Text style={styles.metricLabel}>AI Voice</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardShadowWrapper: {
    shadowColor: Colors.PureBlack,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.28,
    shadowRadius: 18,
    elevation: 8,
    marginBottom: ResponsivePixels.size24,
  },
  card: {
    backgroundColor: Colors.NeroBlack,
    borderRadius: ResponsivePixels.size24,
    padding: ResponsivePixels.size14,
    position: 'relative',
    overflow: 'hidden',
    borderWidth: 4,
    borderColor: withAlpha(Colors.PureWhite, 0.9),
  },
  cardContent: {
    position: 'relative',
    zIndex: 1,
  },
  profileCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarWrapper: {
    position: 'relative',
    marginRight: ResponsivePixels.size12,
  },
  avatarRing: {
    width: ResponsivePixels.size56,
    height: ResponsivePixels.size56,
    borderRadius: ResponsivePixels.size28,
    borderWidth: 2.5,
    borderColor: Colors.AccentYellow,
    backgroundColor: Colors.DarkProfileCardBg,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  profileDetails: {
    flex: 1,
    marginRight: ResponsivePixels.size8,
    justifyContent: 'center',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ResponsivePixels.size7,
  },
  profileName: {
    fontFamily: Fonts.ranade.bold,
    fontSize: ResponsivePixels.size17,
    lineHeight: ResponsivePixels.size22,
    color: Colors.PureWhite,
  },
  profileEmail: {
    fontFamily: Fonts.poppins.regular,
    fontSize: ResponsivePixels.size12,
    color: Colors.BriefingMutedSilver,
    marginTop: ResponsivePixels.size1,
  },
  roleBadgeWrapper: {
    marginTop: ResponsivePixels.size4,
    alignSelf: 'flex-start',
  },
  editProfileBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ResponsivePixels.size6,
    paddingHorizontal: ResponsivePixels.size14,
    paddingVertical: ResponsivePixels.size7,
    borderRadius: ResponsivePixels.size20,
    backgroundColor: withAlpha(Colors.PureWhite, 0.12),
    borderWidth: 1,
    borderColor: withAlpha(Colors.PureWhite, 0.22),
    alignSelf: 'center',
  },
  editProfileBtnText: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: ResponsivePixels.size12_5,
    color: Colors.PureWhite,
  },
  bioSnippet: {
    marginTop: ResponsivePixels.size12,
    paddingHorizontal: ResponsivePixels.size14,
    paddingVertical: ResponsivePixels.size9,
    borderRadius: ResponsivePixels.size14,
    backgroundColor: withAlpha(Colors.PureWhite, 0.07),
    borderWidth: 1,
    borderColor: withAlpha(Colors.PureWhite, 0.08),
  },
  bioSnippetText: {
    fontFamily: Fonts.poppins.medium,
    fontSize: ResponsivePixels.size12,
    lineHeight: ResponsivePixels.size17,
    color: Colors.BriefingSilverText,
  },
  milestoneBanner: {
    marginTop: ResponsivePixels.size12,
    paddingHorizontal: ResponsivePixels.size12,
    paddingVertical: ResponsivePixels.size10,
    borderRadius: ResponsivePixels.size14,
    backgroundColor: withAlpha(Colors.PureWhite, 0.06),
    borderWidth: 1,
    borderColor: withAlpha(Colors.PureWhite, 0.1),
  },
  milestoneTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: ResponsivePixels.size6,
  },
  milestoneLeftInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ResponsivePixels.size6,
    flex: 1,
  },
  milestoneLevelText: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: ResponsivePixels.size11_5,
    color: Colors.PureWhite,
  },
  milestoneXpWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ResponsivePixels.size4,
  },
  milestoneXpText: {
    fontFamily: Fonts.poppins.bold,
    fontSize: ResponsivePixels.size11_5,
    color: Colors.AccentYellow,
  },
  milestoneBarTrack: {
    height: ResponsivePixels.size5,
    borderRadius: ResponsivePixels.size2_5,
    backgroundColor: withAlpha(Colors.PureWhite, 0.12),
    overflow: 'hidden',
  },
  milestoneBarFill: {
    height: '100%',
    borderRadius: ResponsivePixels.size2_5,
  },
  profileMetricsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginTop: ResponsivePixels.size14,
    paddingTop: ResponsivePixels.size12,
    borderTopWidth: 1,
    borderTopColor: withAlpha(Colors.PureWhite, 0.12),
  },
  metricItem: {
    alignItems: 'center',
    flex: 1,
  },
  metricValue: {
    fontFamily: Fonts.poppins.bold,
    fontSize: ResponsivePixels.size16,
    color: Colors.PureWhite,
  },
  metricLabel: {
    fontFamily: Fonts.poppins.medium,
    fontSize: ResponsivePixels.size11,
    color: Colors.MilestoneSlate,
    marginTop: ResponsivePixels.size2,
  },
  metricDivider: {
    width: 1,
    height: ResponsivePixels.size24,
    backgroundColor: withAlpha(Colors.PureWhite, 0.12),
  },
});

export default ProfileCard;
