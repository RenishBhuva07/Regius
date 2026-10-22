import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Edit3 } from 'lucide-react-native';
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

interface ProfileCardProps {
  name: string;
  email: string;
  bio: string;
  role: string;
  selectedVoiceName: string;
  onEditPress: () => void;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({
  name,
  email,
  bio,
  role,
  selectedVoiceName,
  onEditPress,
}) => {
  return (
    <View style={styles.cardShadowWrapper}>
      <View style={styles.card}>
        {/* Specular dark luxury obsidian bento background */}
        <ProfileCardBackgroundSvg />

        <View style={styles.cardContent}>
          {/* Top Row: Avatar, Info (Name + Pro Badge), and Edit Button */}
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
                <ProBadge size="sm" />
              </View>
              <Text style={styles.profileEmail} numberOfLines={1}>
                {email}
              </Text>
              <View style={styles.roleBadgeWrapper}>
                <Badge label={role} variant="yellow" size="sm" />
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

          {/* User Designation Snippet (Clean without quotation marks) */}
          {bio ? (
            <View style={styles.bioSnippet}>
              <Text style={styles.bioSnippetText} numberOfLines={2}>
                {bio}
              </Text>
            </View>
          ) : null}

          {/* Metrics Row: Tasks Done, Active Alerts, AI Voice */}
          <View style={styles.profileMetricsRow}>
            <View style={styles.metricItem}>
              <Text style={styles.metricValue}>142</Text>
              <Text style={styles.metricLabel}>Tasks Done</Text>
            </View>
            <View style={styles.metricDivider} />
            <View style={styles.metricItem}>
              <Text style={styles.metricValue}>8</Text>
              <Text style={styles.metricLabel}>Active Alerts</Text>
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
    padding: ResponsivePixels.size18,
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
