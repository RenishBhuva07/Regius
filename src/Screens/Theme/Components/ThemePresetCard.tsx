import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { CheckCircle2, Lock, Check } from 'lucide-react-native';

import { Fonts } from '../../../Theme/fonts';
import { Typography } from '../../../Theme/Typographys';
import { Colors, withAlpha } from '../../../Assets/StyleUtilities/Colors';
import ResponsivePixels from '../../../Assets/StyleUtilities/ResponsivePixels';
import { Badge } from '../../../Common/Badge';
import { ThemeOption, isLightColor } from '../../../Theme/ThemeContext';

export interface ThemePresetCardProps {
  theme: ThemeOption;
  isSelected: boolean;
  isUnlocked: boolean;
  reqTierTitle?: string;
  isDarkMode: boolean;
  onApplyTheme: (theme: ThemeOption) => void;
  onPressLocked: (theme: ThemeOption) => void;
  onPressSwatch: (themeName: string, label: string, hex: string) => void;
}

export const ThemePresetCard: React.FC<ThemePresetCardProps> = React.memo(
  ({
    theme,
    isSelected,
    isUnlocked,
    reqTierTitle,
    isDarkMode,
    onApplyTheme,
    onPressLocked,
    onPressSwatch,
  }) => {
    const cardBg = isDarkMode ? Colors.DarkCardBackground : Colors.PureWhite;
    const textPrimary = isDarkMode ? Colors.PureWhite : Colors.PureBlack;
    const textSecondary = isDarkMode ? Colors.SteelMist : Colors.SubtitleGray;
    const borderLight = isDarkMode ? Colors.CarbonSlate : Colors.RingBorder;
    const surfaceAlt = isDarkMode
      ? Colors.DarkSurfaceAlt
      : Colors.CreamSurfaceAlt;

    return (
      <View
        style={[
          styles.themeCard,
          {
            backgroundColor: cardBg,
            borderColor: isSelected
              ? theme.accent
              : isDarkMode
              ? withAlpha(Colors.PureWhite, 0.12)
              : Colors.PureWhite,
            borderBottomColor: isSelected
              ? theme.accent
              : isDarkMode
              ? Colors.DarkSurfaceDeep
              : Colors.WarmStoneBorder,
            shadowColor: isSelected
              ? theme.accent
              : isDarkMode
              ? Colors.PureBlack
              : withAlpha(Colors.LavenderPurple, 0.14),
          },
        ]}
      >
        {/* Theme Header Row */}
        <View style={styles.themeCardHeader}>
          <View style={styles.themeTitleLeft}>
            <View
              style={[styles.themeDot, { backgroundColor: theme.accent }]}
            />
            <View>
              <Text style={[styles.themeNameText, { color: textPrimary }]}>
                {theme.name}
              </Text>
              <Text
                style={[styles.themeTaglineText, { color: textSecondary }]}
                numberOfLines={1}
              >
                {theme.tagline}
              </Text>
            </View>
          </View>

          {/* Status Indicator Badges */}
          <View style={styles.statusBadgeWrap}>
            {isSelected ? (
              <Badge label="CURRENT THEME" variant="green" size="sm" />
            ) : isUnlocked ? (
              <Badge label="UNLOCKED" variant="neutral" size="sm" />
            ) : (
              <Badge
                label={`TIER ${theme.requiredTierLevel} REQUIRED`}
                variant="purple"
                size="sm"
              />
            )}
          </View>
        </View>

        {/* 4 Colors in Round Shape in One Line */}
        <View
          style={[
            styles.colorsRowContainer,
            {
              backgroundColor: surfaceAlt,
              borderColor: borderLight,
            },
          ]}
        >
          {theme.palette.map((color, cIdx) => (
            <TouchableOpacity
              key={cIdx}
              activeOpacity={0.7}
              style={styles.colorSwatchItem}
              onPress={() => onPressSwatch(theme.name, color.label, color.hex)}
              accessibilityRole="button"
              accessibilityLabel={`${color.label} color ${color.hex}`}
            >
              {/* Round Shape Swatch */}
              <View
                style={[
                  styles.colorCircle,
                  {
                    backgroundColor: color.hex,
                    borderColor: isLightColor(color.hex)
                      ? withAlpha(Colors.PureBlack, 0.18)
                      : withAlpha(Colors.PureWhite, 0.25),
                  },
                ]}
              />
              {/* Hex Code */}
              <Text style={[styles.colorCodeText, { color: textPrimary }]}>
                {color.hex.toUpperCase()}
              </Text>
              {/* Role Label */}
              <Text style={[styles.colorRoleLabel, { color: textSecondary }]}>
                {color.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Locked Tier Information Banner */}
        {!isUnlocked && (
          <TouchableOpacity
            activeOpacity={0.8}
            style={[
              styles.lockedInfoBanner,
              {
                backgroundColor: isDarkMode
                  ? withAlpha(Colors.LavenderPurple, 0.12)
                  : Colors.ThemeLockBannerLightBg,
                borderColor: isDarkMode
                  ? withAlpha(Colors.LavenderPurple, 0.28)
                  : Colors.ThemeLockBannerLightBorder,
              },
            ]}
            onPress={() => onPressLocked(theme)}
          >
            <Lock size={ResponsivePixels.size13} color={Colors.LavenderPurple} strokeWidth={2.4} />
            <Text style={styles.lockedInfoText}>
              Unlocks at Tier {theme.requiredTierLevel} (
              {reqTierTitle || 'Milestone'}) • Tap for details
            </Text>
          </TouchableOpacity>
        )}

        {/* Card Action Row */}
        <View style={styles.cardActionRow}>
          {isSelected ? (
            <View style={styles.activeAppliedRow}>
              <CheckCircle2
                size={ResponsivePixels.size16}
                color={Colors.LuminousGreen}
                strokeWidth={2.4}
              />
              <Text style={styles.activeAppliedText}>
                Active Palette Applied
              </Text>
            </View>
          ) : isUnlocked ? (
            <TouchableOpacity
              activeOpacity={0.85}
              style={[
                styles.applyButtonPill,
                {
                  backgroundColor: isDarkMode
                    ? Colors.PureWhite
                    : Colors.MidnightCharcoal,
                },
              ]}
              onPress={() => onApplyTheme(theme)}
              accessibilityRole="button"
              accessibilityLabel={`Apply ${theme.name} Theme`}
            >
              <Check
                size={ResponsivePixels.size14}
                color={isDarkMode ? Colors.PureBlack : Colors.PureWhite}
                strokeWidth={2.4}
              />
              <Text
                style={[
                  styles.applyButtonText,
                  {
                    color: isDarkMode ? Colors.PureBlack : Colors.PureWhite,
                  },
                ]}
              >
                Apply Theme
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              activeOpacity={0.85}
              style={[
                styles.unlockButtonPill,
                {
                  backgroundColor: isDarkMode
                    ? Colors.ThemeUnlockPillDarkBg
                    : Colors.RadarPurpleLightBg,
                  borderColor: Colors.LavenderPurple,
                },
              ]}
              onPress={() => onPressLocked(theme)}
              accessibilityRole="button"
              accessibilityLabel={`View unlock requirements for ${theme.name}`}
            >
              <Lock size={ResponsivePixels.size13} color={Colors.LavenderPurple} strokeWidth={2.4} />
              <Text style={styles.unlockButtonText}>Unlock Requirements</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  },
);

const styles = StyleSheet.create({
  themeCard: {
    borderRadius: ResponsivePixels.size22,
    borderWidth: 1.5,
    borderBottomWidth: 3.5,
    padding: ResponsivePixels.size16,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 4,
  },
  themeCardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: ResponsivePixels.size12,
  },
  themeTitleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ResponsivePixels.size10,
    flex: 1,
    paddingRight: ResponsivePixels.size8,
  },
  themeDot: {
    width: ResponsivePixels.size14,
    height: ResponsivePixels.size14,
    borderRadius: ResponsivePixels.size7,
  },
  themeNameText: {
    fontFamily: Fonts.ranade.bold,
    fontSize: ResponsivePixels.size17,
    letterSpacing: 0.2,
  },
  themeTaglineText: {
    ...Typography.bodySmallPoppinsRegular,
    fontSize: ResponsivePixels.size11,
    marginTop: ResponsivePixels.size1,
  },
  statusBadgeWrap: {
    alignItems: 'flex-end',
  },
  colorsRowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: ResponsivePixels.size16,
    borderWidth: 1,
    paddingVertical: ResponsivePixels.size12,
    paddingHorizontal: ResponsivePixels.size10,
    marginBottom: ResponsivePixels.size12,
  },
  colorSwatchItem: {
    flex: 1,
    alignItems: 'center',
    gap: ResponsivePixels.size4,
  },
  colorCircle: {
    width: ResponsivePixels.size38,
    height: ResponsivePixels.size38,
    borderRadius: ResponsivePixels.size19,
    borderWidth: 1.5,
    shadowColor: Colors.PureBlack,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 3,
    elevation: 2,
  },
  colorCodeText: {
    fontFamily: Fonts.poppins.bold,
    fontSize: ResponsivePixels.size10_5,
    letterSpacing: 0.4,
    marginTop: ResponsivePixels.size2,
  },
  colorRoleLabel: {
    fontFamily: Fonts.poppins.regular,
    fontSize: ResponsivePixels.size9_5,
  },
  lockedInfoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ResponsivePixels.size8,
    paddingVertical: ResponsivePixels.size8,
    paddingHorizontal: ResponsivePixels.size12,
    borderRadius: ResponsivePixels.size12,
    borderWidth: 1,
    marginBottom: ResponsivePixels.size12,
  },
  lockedInfoText: {
    fontFamily: Fonts.poppins.medium,
    fontSize: ResponsivePixels.size11,
    color: Colors.LavenderPurple,
    flex: 1,
  },
  cardActionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  activeAppliedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ResponsivePixels.size6,
    paddingVertical: ResponsivePixels.size6,
    paddingHorizontal: ResponsivePixels.size12,
    borderRadius: ResponsivePixels.size20,
    backgroundColor: withAlpha(Colors.LuminousGreen, 0.12),
  },
  activeAppliedText: {
    fontFamily: Fonts.poppins.bold,
    fontSize: ResponsivePixels.size12,
    color: Colors.LuminousGreen,
  },
  applyButtonPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ResponsivePixels.size6,
    paddingVertical: ResponsivePixels.size8,
    paddingHorizontal: ResponsivePixels.size16,
    borderRadius: ResponsivePixels.size20,
    shadowColor: Colors.PureBlack,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  applyButtonText: {
    fontFamily: Fonts.poppins.bold,
    fontSize: ResponsivePixels.size12,
  },
  unlockButtonPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ResponsivePixels.size6,
    paddingVertical: ResponsivePixels.size8,
    paddingHorizontal: ResponsivePixels.size14,
    borderRadius: ResponsivePixels.size20,
    borderWidth: 1,
  },
  unlockButtonText: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: ResponsivePixels.size11_5,
    color: Colors.LavenderPurple,
  },
});

export default ThemePresetCard;
