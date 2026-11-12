import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Sparkles } from 'lucide-react-native';

import { Fonts } from '../../../Theme/fonts';
import { Colors, withAlpha } from '../../../Assets/StyleUtilities/Colors';
import { Typography } from '../../../Theme/Typographys';
import ResponsivePixels from '../../../Assets/StyleUtilities/ResponsivePixels';
import { Badge } from '../../../Common/Badge';
import { ThemeOption, isLightColor } from '../../../Theme/ThemeContext';
import { HeaderPatternSvg } from '../../Dashboard/Components/HeaderPatternSvg';

export interface ThemeHeroCardProps {
  activeTheme: ThemeOption;
  isDarkMode: boolean;
  unlockedCount: number;
  totalThemes: number;
  currentTier: { level: number; title: string };
  screenWidth: number;
  insetsTop: number;
}

export const ThemeHeroCard: React.FC<ThemeHeroCardProps> = React.memo(
  ({
    activeTheme,
    isDarkMode,
    unlockedCount,
    totalThemes,
    currentTier,
    screenWidth,
    insetsTop,
  }) => {
    const isHeroLight = isLightColor(activeTheme.previewBg);

    return (
      <View style={styles.heroWrapper}>
        <View style={styles.cardShadowWrapper}>
          <View
            style={[
              styles.heroCardInner,
              {
                backgroundColor: activeTheme.previewBg,
                borderColor: isHeroLight
                  ? Colors.RingBorder
                  : withAlpha(Colors.PureWhite, 0.9),
              },
            ]}
          >
            <HeaderPatternSvg width={screenWidth} insetsTop={insetsTop} />

            <View style={styles.heroTopRow}>
              <View style={styles.heroTitleGroup}>
                <Badge label="CURRENTLY ACTIVE" variant="yellow" size="sm" />
                <Text
                  style={[
                    styles.heroThemeName,
                    { color: isHeroLight ? Colors.DarkBackground : Colors.PureWhite },
                  ]}
                  numberOfLines={1}
                >
                  {activeTheme.name}
                </Text>
              </View>
              <View
                style={[
                  styles.heroAccentOrb,
                  { backgroundColor: activeTheme.accent },
                ]}
              >
                <Sparkles
                  size={ResponsivePixels.size16}
                  color={
                    isLightColor(activeTheme.accent)
                      ? Colors.DarkBackground
                      : Colors.PureWhite
                  }
                  strokeWidth={2.4}
                />
              </View>
            </View>

            <Text
              style={[
                styles.heroTagline,
                {
                  color: isHeroLight
                    ? Colors.DarkSilverDust
                    : withAlpha(Colors.PureWhite, 0.8),
                },
              ]}
            >
              {activeTheme.tagline}
            </Text>

            {/* Live Interactive Mini UI Mockup */}
            <View
              style={[
                styles.heroMockupContainer,
                isHeroLight && {
                  backgroundColor: withAlpha(Colors.PureBlack, 0.05),
                  borderColor: withAlpha(Colors.PureBlack, 0.08),
                },
              ]}
            >
              <View style={styles.mockupHeader}>
                <View style={styles.mockupDotsRow}>
                  <View
                    style={[
                      styles.mockupDot,
                      { backgroundColor: Colors.MockupDotCloseRed },
                    ]}
                  />
                  <View
                    style={[
                      styles.mockupDot,
                      { backgroundColor: Colors.MockupDotMinYellow },
                    ]}
                  />
                  <View
                    style={[
                      styles.mockupDot,
                      { backgroundColor: Colors.MockupDotMaxGreen },
                    ]}
                  />
                </View>
                <Text
                  style={[
                    styles.mockupHeaderText,
                    isHeroLight && { color: Colors.SubtitleGray },
                  ]}
                >
                  Live Palette Preview ({isDarkMode ? 'Dark' : 'Light'})
                </Text>
              </View>

              <View
                style={[
                  styles.mockupSurface,
                  {
                    backgroundColor: activeTheme.palette[1].hex,
                    borderWidth: isLightColor(activeTheme.palette[1].hex)
                      ? 1
                      : 0,
                    borderColor: withAlpha(Colors.PureBlack, 0.08),
                  },
                ]}
              >
                <View style={styles.mockupCardRow}>
                  <View
                    style={[
                      styles.mockupChip,
                      { backgroundColor: activeTheme.accent },
                    ]}
                  >
                    <Text
                      style={[
                        styles.mockupChipText,
                        {
                          color: isLightColor(activeTheme.accent)
                            ? Colors.DarkBackground
                            : Colors.PureWhite,
                        },
                      ]}
                    >
                      FOCUS
                    </Text>
                  </View>
                  <Text
                    style={[
                      styles.mockupCardTitle,
                      { color: activeTheme.palette[3].hex },
                    ]}
                  >
                    Review Architecture Plan
                  </Text>
                </View>

                <View style={styles.mockupProgressTrack}>
                  <View
                    style={[
                      styles.mockupProgressBar,
                      { backgroundColor: activeTheme.accent, width: '74%' },
                    ]}
                  />
                </View>
              </View>
            </View>

            {/* Stats Footer */}
            <View
              style={[
                styles.heroFooter,
                isHeroLight && {
                  borderTopColor: withAlpha(Colors.PureBlack, 0.08),
                },
              ]}
            >
              <View style={styles.heroStatItem}>
                <Text
                  style={[
                    styles.heroStatLabel,
                    isHeroLight && { color: Colors.Grey },
                  ]}
                >
                  PROGRESS
                </Text>
                <Text
                  style={[
                    styles.heroStatValue,
                    isHeroLight && { color: Colors.DarkBackground },
                  ]}
                >
                  {unlockedCount} of {totalThemes} Unlocked
                </Text>
              </View>
              <View
                style={[
                  styles.heroDivider,
                  isHeroLight && {
                    backgroundColor: withAlpha(Colors.PureBlack, 0.12),
                  },
                ]}
              />
              <View style={styles.heroStatItem}>
                <Text
                  style={[
                    styles.heroStatLabel,
                    isHeroLight && { color: Colors.Grey },
                  ]}
                >
                  CURRENT TIER
                </Text>
                <Text
                  style={[
                    styles.heroStatValue,
                    isHeroLight && { color: Colors.DarkBackground },
                  ]}
                >
                  Tier {currentTier.level}: {currentTier.title}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  },
);

const styles = StyleSheet.create({
  heroWrapper: {
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
  heroCardInner: {
    borderRadius: ResponsivePixels.size24,
    borderWidth: 4,
    borderColor: withAlpha(Colors.PureWhite, 0.9),
    padding: ResponsivePixels.size16,
    overflow: 'hidden',
    position: 'relative',
  },
  heroTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: ResponsivePixels.size6,
  },
  heroTitleGroup: {
    gap: ResponsivePixels.size6,
  },
  heroThemeName: {
    ...Typography.h1RanadeBold,
    color: Colors.PureWhite,
    fontSize: ResponsivePixels.size22,
  },
  heroAccentOrb: {
    width: ResponsivePixels.size36,
    height: ResponsivePixels.size36,
    borderRadius: ResponsivePixels.size18,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.PureBlack,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  heroTagline: {
    ...Typography.bodySmallPoppinsRegular,
    color: withAlpha(Colors.PureWhite, 0.8),
    fontSize: ResponsivePixels.size12,
    marginBottom: ResponsivePixels.size14,
  },
  heroMockupContainer: {
    backgroundColor: withAlpha(Colors.PureBlack, 0.35),
    borderRadius: ResponsivePixels.size16,
    borderWidth: 1,
    borderColor: withAlpha(Colors.PureWhite, 0.12),
    padding: ResponsivePixels.size12,
    marginBottom: ResponsivePixels.size14,
  },
  mockupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: ResponsivePixels.size10,
  },
  mockupDotsRow: {
    flexDirection: 'row',
    gap: ResponsivePixels.size5,
  },
  mockupDot: {
    width: ResponsivePixels.size7,
    height: ResponsivePixels.size7,
    borderRadius: ResponsivePixels.size3_5,
  },
  mockupHeaderText: {
    fontFamily: Fonts.poppins.medium,
    fontSize: ResponsivePixels.size10,
    color: withAlpha(Colors.PureWhite, 0.65),
    letterSpacing: 0.5,
  },
  mockupSurface: {
    borderRadius: ResponsivePixels.size12,
    padding: ResponsivePixels.size12,
  },
  mockupCardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ResponsivePixels.size8,
    marginBottom: ResponsivePixels.size8,
  },
  mockupChip: {
    paddingHorizontal: ResponsivePixels.size6,
    paddingVertical: ResponsivePixels.size2,
    borderRadius: ResponsivePixels.size6,
  },
  mockupChipText: {
    fontFamily: Fonts.poppins.bold,
    fontSize: ResponsivePixels.size8_5,
    color: Colors.PureBlack,
  },
  mockupCardTitle: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: ResponsivePixels.size12,
  },
  mockupProgressTrack: {
    height: ResponsivePixels.size4,
    borderRadius: ResponsivePixels.size2,
    backgroundColor: withAlpha(Colors.PureBlack, 0.15),
    overflow: 'hidden',
  },
  mockupProgressBar: {
    height: '100%',
    borderRadius: ResponsivePixels.size2,
  },
  heroFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: ResponsivePixels.size10,
    borderTopWidth: 1,
    borderTopColor: withAlpha(Colors.PureWhite, 0.15),
  },
  heroStatItem: {
    flex: 1,
  },
  heroStatLabel: {
    fontFamily: Fonts.poppins.bold,
    fontSize: ResponsivePixels.size9,
    color: withAlpha(Colors.PureWhite, 0.6),
    letterSpacing: 0.8,
  },
  heroStatValue: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: ResponsivePixels.size12,
    color: Colors.PureWhite,
    marginTop: ResponsivePixels.size2,
  },
  heroDivider: {
    width: 1,
    height: ResponsivePixels.size24,
    backgroundColor: withAlpha(Colors.PureWhite, 0.2),
    marginHorizontal: ResponsivePixels.size10,
  },
});

export default ThemeHeroCard;
