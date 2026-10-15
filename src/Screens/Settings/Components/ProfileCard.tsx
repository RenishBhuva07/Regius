import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Edit3, Sparkles } from 'lucide-react-native';
import { Typography } from '../../../Theme/Typographys';
import { Colors as StaticColors } from '../../../Assets/StyleUtilities/Colors';
import { SVGS } from '../../../Assets/Images';
import ResponsivePixels from '../../../Assets/StyleUtilities/ResponsivePixels';
import { useSettingsTheme } from './types';

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
  const {
    isDarkMode,
    cardBg,
    textPrimary,
    textSecondary,
    borderLight,
    surfaceAlt,
  } = useSettingsTheme();

  return (
    <View
      style={[
        styles.profileCard,
        {
          backgroundColor: cardBg,
          borderColor: borderLight,
          shadowColor: isDarkMode ? '#000000' : 'rgba(0,0,0,0.06)',
        },
      ]}
    >
      <View style={styles.profileCardTop}>
        <View style={styles.avatarWrapper}>
          <View
            style={[
              styles.avatarRing,
              {
                borderColor: '#F5C518',
                backgroundColor: isDarkMode ? '#252932' : '#FFFCEB',
              },
            ]}
          >
            <SVGS.RegiusAvatar width={52} height={52} />
          </View>
          <View style={styles.proPillBadge}>
            <Sparkles size={10} color="#FFFFFF" strokeWidth={2.8} />
            <Text style={styles.proPillText}>PRO</Text>
          </View>
        </View>

        <View style={styles.profileDetails}>
          <View style={styles.profileNameRow}>
            <Text
              style={[styles.profileName, { color: textPrimary }]}
              numberOfLines={1}
            >
              {name}
            </Text>
          </View>
          <Text
            style={[styles.profileEmail, { color: textSecondary }]}
            numberOfLines={1}
          >
            {email}
          </Text>
          <View style={styles.profileRoleChip}>
            <Text style={styles.profileRoleText}>{role}</Text>
          </View>
        </View>

        <TouchableOpacity
          activeOpacity={0.8}
          style={[
            styles.editProfileBtn,
            {
              backgroundColor: isDarkMode ? '#2C3035' : '#1F2228',
            },
          ]}
          onPress={onEditPress}
        >
          <Edit3 size={15} color="#FFFFFF" strokeWidth={2.2} />
          <Text style={styles.editProfileBtnText}>Edit</Text>
        </TouchableOpacity>
      </View>

      {bio ? (
        <View style={[styles.bioSnippet, { backgroundColor: surfaceAlt }]}>
          <Text
            style={[styles.bioSnippetText, { color: textSecondary }]}
            numberOfLines={2}
          >
            &ldquo;{bio}&rdquo;
          </Text>
        </View>
      ) : null}

      <View style={[styles.profileMetricsRow, { borderTopColor: borderLight }]}>
        <View style={styles.metricItem}>
          <Text style={[styles.metricValue, { color: textPrimary }]}>142</Text>
          <Text style={[styles.metricLabel, { color: textSecondary }]}>
            Tasks Done
          </Text>
        </View>
        <View
          style={[styles.metricDivider, { backgroundColor: borderLight }]}
        />
        <View style={styles.metricItem}>
          <Text style={[styles.metricValue, { color: textPrimary }]}>8</Text>
          <Text style={[styles.metricLabel, { color: textSecondary }]}>
            Active Alerts
          </Text>
        </View>
        <View
          style={[styles.metricDivider, { backgroundColor: borderLight }]}
        />
        <View style={styles.metricItem}>
          <Text
            style={[styles.metricValue, { color: StaticColors.LavenderPurple }]}
          >
            {selectedVoiceName}
          </Text>
          <Text style={[styles.metricLabel, { color: textSecondary }]}>
            AI Voice
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  profileCard: {
    borderRadius: 24,
    borderWidth: 1.5,
    padding: ResponsivePixels.size18,
    marginBottom: ResponsivePixels.size24,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 14,
    elevation: 3,
  },
  profileCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarWrapper: {
    position: 'relative',
    marginRight: ResponsivePixels.size14,
  },
  avatarRing: {
    width: 62,
    height: 62,
    borderRadius: 31,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  proPillBadge: {
    position: 'absolute',
    bottom: -3,
    right: -3,
    backgroundColor: '#F5C518',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  proPillText: {
    fontFamily: Typography.bodySmallRanadeBold.fontFamily,
    fontSize: 9,
    color: '#000000',
    fontWeight: '700',
  },
  profileDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  profileNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  profileName: {
    ...Typography.h6Bold,
    fontSize: 18,
  },
  profileEmail: {
    ...Typography.bodySmallPoppinsRegular,
    fontSize: 12,
    marginTop: 1,
  },
  profileRoleChip: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFFCEB',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    marginTop: 4,
    borderWidth: 1,
    borderColor: '#FFF5B8',
  },
  profileRoleText: {
    ...Typography.bodySmallPoppinsSemiBold,
    fontSize: 10,
    color: '#8D7000',
  },
  editProfileBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
  },
  editProfileBtnText: {
    ...Typography.bodySmallPoppinsSemiBold,
    fontSize: 12,
    color: '#FFFFFF',
  },
  bioSnippet: {
    marginTop: ResponsivePixels.size12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  bioSnippetText: {
    ...Typography.bodySmallPoppinsRegular,
    fontSize: 12,
    fontStyle: 'italic',
  },
  profileMetricsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginTop: ResponsivePixels.size14,
    paddingTop: ResponsivePixels.size12,
    borderTopWidth: 1,
  },
  metricItem: {
    alignItems: 'center',
    flex: 1,
  },
  metricValue: {
    ...Typography.bodyMediumPoppinsSemiBold,
    fontSize: 15,
  },
  metricLabel: {
    ...Typography.bodySmallPoppinsRegular,
    fontSize: 11,
    marginTop: 1,
  },
  metricDivider: {
    width: 1,
    height: 24,
  },
});

export default ProfileCard;
