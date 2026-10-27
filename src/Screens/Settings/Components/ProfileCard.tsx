import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Edit3, Award, ChevronRight } from 'lucide-react-native';
import { Typography } from '../../../Theme/Typographys';
import { Fonts } from '../../../Theme/fonts';
import Colors, {
  Colors as StaticColors,
} from '../../../Assets/StyleUtilities/Colors';
import { SVGS } from '../../../Assets/Images';
import { Badge } from '../../../Common/Badge';
import { ProBadge } from '../../../Common/ProBadge';
import ResponsivePixels from '../../../Assets/StyleUtilities/ResponsivePixels';
import ProfileCardBackgroundSvg from './ProfileCardBackgroundSvg';
import { MilestoneTier } from '../../../Services/Milestone/MilestoneService';

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
  role,
  selectedVoiceName,
  onEditPress,
  milestoneTier,
  milestoneXp = 0,
  milestoneProgress = 0,
  tasksDoneCount = 142,
  habitsFollowedCount = 8,
  onMilestonePress,
  isPremium = false,
  onProPress,
}) => {
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
                <SVGS.RegiusAvatar width={52} height={52} />
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
              <Edit3 size={14} color="#FFFFFF" strokeWidth={2.2} />
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
                    size={15}
                    color={milestoneTier.accentColor || '#F5C518'}
                    strokeWidth={2.4}
                  />
                  <Text style={styles.milestoneLevelText}>
                    Milestone Level: Tier {milestoneTier.level} •{' '}
                    {milestoneTier.title}
                  </Text>
                </View>
                <View style={styles.milestoneXpWrapper}>
                  <Text style={styles.milestoneXpText}>{milestoneXp} XP</Text>
                  <ChevronRight size={13} color="#D4D2D6" strokeWidth={2} />
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
                      backgroundColor: milestoneTier.accentColor || '#F5C518',
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
                  { color: StaticColors.LavenderPurple },
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
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.28,
    shadowRadius: 18,
    elevation: 8,
    marginBottom: ResponsivePixels.size24,
  },
  card: {
    backgroundColor: Colors.NeroBlack,
    borderRadius: 24,
    padding: ResponsivePixels.size14,
    position: 'relative',
    overflow: 'hidden',
    borderWidth: 4,
    borderColor: 'rgba(255, 255, 255, 0.9)',
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
    marginRight: 12,
  },
  avatarRing: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2.5,
    borderColor: '#F5C518',
    backgroundColor: '#1E2128',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  profileDetails: {
    flex: 1,
    marginRight: 8,
    justifyContent: 'center',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  profileName: {
    fontFamily: Fonts.ranade.bold,
    fontSize: 17,
    lineHeight: 22,
    color: Colors.DefaultWhite,
  },
  profileEmail: {
    fontFamily: Fonts.poppins.regular,
    fontSize: 12,
    color: '#A19FA3',
    marginTop: 1,
  },
  roleBadgeWrapper: {
    marginTop: 4,
    alignSelf: 'flex-start',
  },
  editProfileBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.22)',
    alignSelf: 'center',
  },
  editProfileBtnText: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: 12.5,
    color: Colors.DefaultWhite,
  },
  bioSnippet: {
    marginTop: 12,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.07)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  bioSnippetText: {
    fontFamily: Fonts.poppins.medium,
    fontSize: 12,
    lineHeight: 17,
    color: '#D4D2D6',
  },
  milestoneBanner: {
    marginTop: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  milestoneTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  milestoneLeftInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  milestoneLevelText: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: 11.5,
    color: Colors.DefaultWhite,
  },
  milestoneXpWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  milestoneXpText: {
    fontFamily: Fonts.poppins.bold,
    fontSize: 11.5,
    color: '#F5C518',
  },
  milestoneBarTrack: {
    height: 5,
    borderRadius: 2.5,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    overflow: 'hidden',
  },
  milestoneBarFill: {
    height: '100%',
    borderRadius: 2.5,
  },
  profileMetricsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginTop: ResponsivePixels.size14,
    paddingTop: ResponsivePixels.size12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.12)',
  },
  metricItem: {
    alignItems: 'center',
    flex: 1,
  },
  metricValue: {
    fontFamily: Fonts.poppins.bold,
    fontSize: 16,
    color: Colors.DefaultWhite,
  },
  metricLabel: {
    fontFamily: Fonts.poppins.medium,
    fontSize: 11,
    color: '#8E95A5',
    marginTop: 2,
  },
  metricDivider: {
    width: 1,
    height: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
  },
});

export default ProfileCard;
