import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Camera, Sparkles } from 'lucide-react-native';

import { Fonts } from '../../../Theme/fonts';
import { Colors } from '../../../Assets/StyleUtilities/Colors';
import { Typography } from '../../../Theme/Typographys';
import ResponsivePixels from '../../../Assets/StyleUtilities/ResponsivePixels';
import { SVGS } from '../../../Assets/Images';
import { Badge } from '../../../Common/Badge';
import { HeaderPatternSvg } from '../../Dashboard/Components/HeaderPatternSvg';

export interface ProfileAvatarHeroProps {
  name: string;
  email: string;
  onPressCamera: () => void;
  screenWidth: number;
  insetsTop: number;
}

export const ProfileAvatarHero: React.FC<ProfileAvatarHeroProps> = React.memo(
  ({ name, email, onPressCamera, screenWidth, insetsTop }) => {
    return (
      <View style={styles.heroOuterWrapper}>
        <View style={styles.cardShadowWrapper}>
          <View style={styles.card}>
            <HeaderPatternSvg width={screenWidth} insetsTop={insetsTop} />

            <View style={styles.heroContent}>
              {/* Aura Status Pill */}
              <View style={styles.heroStatusRow}>
                <View style={styles.heroStatusLeft}>
                  <Sparkles size={14} color="#F5C518" strokeWidth={2.4} />
                  <Text style={styles.heroStatusLabel}>SOVEREIGN IDENTITY</Text>
                </View>
                <Badge label="TIER 5 VERIFIED" variant="yellow" size="sm" />
              </View>

              {/* Avatar Centerpiece with Solar Halo */}
              <View style={styles.avatarWrapper}>
                <View style={styles.avatarGlowHalo}>
                  <View style={styles.avatarRing}>
                    <SVGS.RegiusAvatar
                      width={ResponsivePixels.size80}
                      height={ResponsivePixels.size80}
                    />
                  </View>
                </View>
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={styles.cameraBadge}
                  onPress={onPressCamera}
                  accessibilityRole="button"
                  accessibilityLabel="Change avatar image"
                >
                  <Camera size={14} color="#FFFFFF" strokeWidth={2.4} />
                </TouchableOpacity>
              </View>

              {/* Identity Readout */}
              <Text style={styles.heroName}>{name || 'Alex Mercer'}</Text>
              <Text style={styles.heroEmail}>
                {email || 'alex.mercer@regius.ai'}
              </Text>

              {/* Role Badges */}
              <View style={styles.roleBadgeRow}>
                <Badge label="VERIFIED PRO" variant="purple" size="sm" />
                <View style={styles.badgeGap} />
                <Badge label="CONCIERGE TIER" variant="yellow" size="sm" />
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
    paddingHorizontal: 10,
    marginBottom: ResponsivePixels.size20,
  },
  cardShadowWrapper: {
    backgroundColor: Colors.NeroBlack,
    borderRadius: 24,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.28,
    shadowRadius: 18,
    elevation: 8,
  },
  card: {
    backgroundColor: Colors.NeroBlack,
    borderRadius: 24,
    borderWidth: 4,
    borderColor: 'rgba(255, 255, 255, 0.9)',
    overflow: 'hidden',
    position: 'relative',
  },
  heroContent: {
    padding: ResponsivePixels.size20,
    alignItems: 'center',
  },
  heroStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: ResponsivePixels.size14,
  },
  heroStatusLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  heroStatusLabel: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: 11,
    color: '#F5C518',
    letterSpacing: 1.2,
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: ResponsivePixels.size12,
  },
  avatarGlowHalo: {
    padding: 3,
    borderRadius: 50,
    backgroundColor: 'rgba(245, 197, 24, 0.25)',
  },
  avatarRing: {
    width: ResponsivePixels.size90,
    height: ResponsivePixels.size90,
    borderRadius: ResponsivePixels.size45,
    borderWidth: 3,
    borderColor: '#F5C518',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FAF8F5',
  },
  cameraBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: Colors.LavenderPurple,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    elevation: 4,
  },
  heroName: {
    fontFamily: Fonts.ranade.bold,
    fontSize: 22,
    color: '#FFFCE3',
    marginBottom: 4,
  },
  heroEmail: {
    ...Typography.bodySmallPoppinsRegular,
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 13,
    marginBottom: ResponsivePixels.size12,
  },
  roleBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badgeGap: {
    width: 8,
  },
});

export default ProfileAvatarHero;
