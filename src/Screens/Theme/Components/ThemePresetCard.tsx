import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { CheckCircle2, Lock, Check } from 'lucide-react-native';

import { Fonts } from '../../../Theme/fonts';
import { Typography } from '../../../Theme/Typographys';
import { Colors } from '../../../Assets/StyleUtilities/Colors';
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
    const cardBg = isDarkMode ? '#1E2228' : Colors.DefaultWhite;
    const textPrimary = isDarkMode
      ? Colors.PureWhiteText
      : Colors.MidnightInkText;
    const textSecondary = isDarkMode ? '#A3A8B1' : Colors.SubtitleGray;
    const borderLight = isDarkMode ? '#2C3035' : '#E8E2D5';
    const surfaceAlt = isDarkMode ? '#171A1F' : '#FAF8F5';

    return (
      <View
        style={[
          styles.themeCard,
          {
            backgroundColor: cardBg,
            borderColor: isSelected
              ? theme.accent
              : isDarkMode
              ? 'rgba(255, 255, 255, 0.12)'
              : '#FFFFFF',
            borderBottomColor: isSelected
              ? theme.accent
              : isDarkMode
              ? '#171A20'
              : '#E2DCD0',
            shadowColor: isSelected
              ? theme.accent
              : isDarkMode
              ? '#000000'
              : 'rgba(131, 131, 214, 0.14)',
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
                      ? 'rgba(0, 0, 0, 0.18)'
                      : 'rgba(255, 255, 255, 0.25)',
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
                  ? 'rgba(131, 131, 214, 0.12)'
                  : '#F2F0FF',
                borderColor: isDarkMode
                  ? 'rgba(131, 131, 214, 0.28)'
                  : '#D7D4F5',
              },
            ]}
            onPress={() => onPressLocked(theme)}
          >
            <Lock size={13} color="#8383D6" strokeWidth={2.4} />
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
              <CheckCircle2 size={16} color="#21AF85" strokeWidth={2.4} />
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
                    ? '#FFFFFF'
                    : Colors.MidnightCharcoal,
                },
              ]}
              onPress={() => onApplyTheme(theme)}
              accessibilityRole="button"
              accessibilityLabel={`Apply ${theme.name} Theme`}
            >
              <Check
                size={14}
                color={isDarkMode ? '#000000' : Colors.PureWhiteText}
                strokeWidth={2.4}
              />
              <Text
                style={[
                  styles.applyButtonText,
                  {
                    color: isDarkMode ? '#000000' : Colors.PureWhiteText,
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
                  backgroundColor: isDarkMode ? '#2A263D' : '#F5F3FF',
                  borderColor: '#8383D6',
                },
              ]}
              onPress={() => onPressLocked(theme)}
              accessibilityRole="button"
              accessibilityLabel={`View unlock requirements for ${theme.name}`}
            >
              <Lock size={13} color="#8383D6" strokeWidth={2.4} />
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
    borderRadius: 22,
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
    marginBottom: 12,
  },
  themeTitleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
    paddingRight: 8,
  },
  themeDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
  },
  themeNameText: {
    fontFamily: Fonts.ranade.bold,
    fontSize: 17,
    letterSpacing: 0.2,
  },
  themeTaglineText: {
    ...Typography.bodySmallPoppinsRegular,
    fontSize: 11,
    marginTop: 1,
  },
  statusBadgeWrap: {
    alignItems: 'flex-end',
  },
  colorsRowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 10,
    marginBottom: 12,
  },
  colorSwatchItem: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  colorCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1.5,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 3,
    elevation: 2,
  },
  colorCodeText: {
    fontFamily: Fonts.poppins.bold,
    fontSize: 10.5,
    letterSpacing: 0.4,
    marginTop: 2,
  },
  colorRoleLabel: {
    fontFamily: Fonts.poppins.regular,
    fontSize: 9.5,
  },
  lockedInfoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
  },
  lockedInfoText: {
    fontFamily: Fonts.poppins.medium,
    fontSize: 11,
    color: '#8383D6',
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
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: 'rgba(33, 175, 133, 0.12)',
  },
  activeAppliedText: {
    fontFamily: Fonts.poppins.bold,
    fontSize: 12,
    color: '#21AF85',
  },
  applyButtonPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  applyButtonText: {
    fontFamily: Fonts.poppins.bold,
    fontSize: 12,
  },
  unlockButtonPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
  },
  unlockButtonText: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: 11.5,
    color: '#8383D6',
  },
});

export default ThemePresetCard;
