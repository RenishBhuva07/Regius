import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Camera, Sparkles } from 'lucide-react-native';

import { Fonts } from '../../../Theme/fonts';
import { Colors, withAlpha } from '../../../Assets/StyleUtilities/Colors';
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
                  <Sparkles
                    size={ResponsivePixels.size14}
                    color={Colors.AccentYellow}
                    strokeWidth={2.4}
                  />
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
                  <Camera
                    size={ResponsivePixels.size14}
                    color={Colors.PureWhite}
                    strokeWidth={2.4}
                  />
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
    paddingHorizontal: ResponsivePixels.size10,
    marginBottom: ResponsivePixels.size20,
  },
  cardShadowWrapper: {
    backgroundColor: Colors.NeroBlack,
    borderRadius: ResponsivePixels.size24,
    shadowColor: Colors.PureBlack,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.28,
    shadowRadius: 18,
    elevation: 8,
  },
  card: {
    backgroundColor: Colors.NeroBlack,
    borderRadius: ResponsivePixels.size24,
    borderWidth: 4,
    borderColor: withAlpha(Colors.PureWhite, 0.9),
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
    gap: ResponsivePixels.size6,
  },
  heroStatusLabel: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: ResponsivePixels.size11,
    color: Colors.AccentYellow,
    letterSpacing: 1.2,
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: ResponsivePixels.size12,
  },
  avatarGlowHalo: {
    padding: ResponsivePixels.size3,
    borderRadius: ResponsivePixels.size50,
    backgroundColor: withAlpha(Colors.AccentYellow, 0.25),
  },
  avatarRing: {
    width: ResponsivePixels.size90,
    height: ResponsivePixels.size90,
    borderRadius: ResponsivePixels.size45,
    borderWidth: 3,
    borderColor: Colors.AccentYellow,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.CreamSurfaceAlt,
  },
  cameraBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: Colors.LavenderPurple,
    width: ResponsivePixels.size28,
    height: ResponsivePixels.size28,
    borderRadius: ResponsivePixels.size14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.PureWhite,
    elevation: 4,
  },
  heroName: {
    fontFamily: Fonts.ranade.bold,
    fontSize: ResponsivePixels.size22,
    color: Colors.CreamBackground,
    marginBottom: ResponsivePixels.size4,
  },
  heroEmail: {
    ...Typography.bodySmallPoppinsRegular,
    color: withAlpha(Colors.PureWhite, 0.7),
    fontSize: ResponsivePixels.size13,
    marginBottom: ResponsivePixels.size12,
  },
  roleBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badgeGap: {
    width: ResponsivePixels.size8,
  },
});

export default ProfileAvatarHero;
