import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Sparkles } from 'lucide-react-native';

import { Fonts } from '../../../Theme/fonts';
import { Colors } from '../../../Assets/StyleUtilities/Colors';
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
                  ? '#E8E2D5'
                  : 'rgba(255, 255, 255, 0.9)',
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
                    { color: isHeroLight ? '#121417' : '#FFFFFF' },
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
                  size={16}
                  color={
                    isLightColor(activeTheme.accent) ? '#121417' : '#FFFFFF'
                  }
                  strokeWidth={2.4}
                />
              </View>
            </View>

            <Text
              style={[
                styles.heroTagline,
                {
                  color: isHeroLight ? '#444A52' : 'rgba(255, 255, 255, 0.8)',
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
                  backgroundColor: 'rgba(0, 0, 0, 0.05)',
                  borderColor: 'rgba(0, 0, 0, 0.08)',
                },
              ]}
            >
              <View style={styles.mockupHeader}>
                <View style={styles.mockupDotsRow}>
                  <View
                    style={[styles.mockupDot, { backgroundColor: '#FF5F56' }]}
                  />
                  <View
                    style={[styles.mockupDot, { backgroundColor: '#FFBD2E' }]}
                  />
                  <View
                    style={[styles.mockupDot, { backgroundColor: '#27C93F' }]}
                  />
                </View>
                <Text
                  style={[
                    styles.mockupHeaderText,
                    isHeroLight && { color: '#666665' },
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
                    borderColor: 'rgba(0, 0, 0, 0.08)',
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
                            ? '#121417'
                            : '#FFFFFF',
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
                isHeroLight && { borderTopColor: 'rgba(0, 0, 0, 0.08)' },
              ]}
            >
              <View style={styles.heroStatItem}>
                <Text
                  style={[
                    styles.heroStatLabel,
                    isHeroLight && { color: '#77767B' },
                  ]}
                >
                  PROGRESS
                </Text>
                <Text
                  style={[
                    styles.heroStatValue,
                    isHeroLight && { color: '#121417' },
                  ]}
                >
                  {unlockedCount} of {totalThemes} Unlocked
                </Text>
              </View>
              <View
                style={[
                  styles.heroDivider,
                  isHeroLight && { backgroundColor: 'rgba(0, 0, 0, 0.12)' },
                ]}
              />
              <View style={styles.heroStatItem}>
                <Text
                  style={[
                    styles.heroStatLabel,
                    isHeroLight && { color: '#77767B' },
                  ]}
                >
                  CURRENT TIER
                </Text>
                <Text
                  style={[
                    styles.heroStatValue,
                    isHeroLight && { color: '#121417' },
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
  heroCardInner: {
    borderRadius: 24,
    borderWidth: 4,
    borderColor: 'rgba(255, 255, 255, 0.9)',
    padding: ResponsivePixels.size16,
    overflow: 'hidden',
    position: 'relative',
  },
  heroTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  heroTitleGroup: {
    gap: 6,
  },
  heroThemeName: {
    ...Typography.h1RanadeBold,
    color: '#FFFFFF',
    fontSize: 22,
  },
  heroAccentOrb: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  heroTagline: {
    ...Typography.bodySmallPoppinsRegular,
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
    marginBottom: 14,
  },
  heroMockupContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    padding: 12,
    marginBottom: 14,
  },
  mockupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  mockupDotsRow: {
    flexDirection: 'row',
    gap: 5,
  },
  mockupDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
  mockupHeaderText: {
    fontFamily: Fonts.poppins.medium,
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.65)',
    letterSpacing: 0.5,
  },
  mockupSurface: {
    borderRadius: 12,
    padding: 12,
  },
  mockupCardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  mockupChip: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  mockupChipText: {
    fontFamily: Fonts.poppins.bold,
    fontSize: 8.5,
    color: '#000000',
  },
  mockupCardTitle: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: 12,
  },
  mockupProgressTrack: {
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
    overflow: 'hidden',
  },
  mockupProgressBar: {
    height: '100%',
    borderRadius: 2,
  },
  heroFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.15)',
  },
  heroStatItem: {
    flex: 1,
  },
  heroStatLabel: {
    fontFamily: Fonts.poppins.bold,
    fontSize: 9,
    color: 'rgba(255, 255, 255, 0.6)',
    letterSpacing: 0.8,
  },
  heroStatValue: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: 12,
    color: '#FFFFFF',
    marginTop: 2,
  },
  heroDivider: {
    width: 1,
    height: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginHorizontal: 10,
  },
});

export default ThemeHeroCard;
