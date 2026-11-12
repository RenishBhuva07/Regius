import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Fonts } from '../../../../Theme/fonts';
import { Colors, withAlpha } from '../../../../Assets/StyleUtilities/Colors';
import { Typography } from '../../../../Theme/Typographys';
import ResponsivePixels from '../../../../Assets/StyleUtilities/ResponsivePixels';
import { Badge } from '../../../../Common/Badge';
import { WakeWordPreset } from '../../../../Services/WakeWord/WakeWordService';

export interface WakeWordPresetCardProps {
  preset: WakeWordPreset;
  isSelected: boolean;
  onSelect: () => void;
  cardBg?: string;
  isDarkMode?: boolean;
  textPrimary?: string;
  textSecondary?: string;
  borderLight?: string;
  surfaceAlt?: string;
}

export const WakeWordPresetCard: React.FC<WakeWordPresetCardProps> = React.memo(
  ({
    preset,
    isSelected,
    onSelect,
    cardBg = Colors.PureWhite,
    isDarkMode = false,
    textPrimary = Colors.PureBlack,
    textSecondary = Colors.SubtitleGray,
    borderLight = Colors.RingBorder,
    surfaceAlt = Colors.CreamSurfaceAlt,
  }) => {
    return (
      <TouchableOpacity
        activeOpacity={0.85}
        style={[
          styles.presetCard,
          {
            backgroundColor: cardBg,
            borderColor: isSelected
              ? Colors.LavenderPurple
              : isDarkMode
              ? withAlpha(Colors.PureWhite, 0.08)
              : Colors.PureWhite,
            borderBottomColor: isSelected
              ? Colors.LavenderDeepFallback
              : isDarkMode
              ? Colors.DarkSurfaceDeep
              : Colors.WarmStoneBorder,
            shadowColor: isSelected
              ? Colors.LavenderPurple
              : isDarkMode
              ? Colors.PureBlack
              : withAlpha(Colors.LavenderPurple, 0.1),
          },
        ]}
        onPress={onSelect}
      >
        <View style={styles.presetTopRow}>
          <View style={styles.presetNameCol}>
            <View style={styles.presetTitleWithBadge}>
              <Text style={[styles.presetPhraseText, { color: textPrimary }]}>
                "{preset.phrase}"
              </Text>
              {preset.id === 'hey_regius' && (
                <Badge label="SIGNATURE" variant="yellow" size="sm" />
              )}
            </View>
            <Text style={[styles.presetNameText, { color: textSecondary }]}>
              {preset.name} • {preset.category.toUpperCase()}
            </Text>
          </View>

          <View
            style={[
              styles.radioCircle,
              isSelected && styles.radioCircleActive,
              {
                borderColor: isSelected ? Colors.LavenderPurple : borderLight,
              },
            ]}
          >
            {isSelected && (
              <View
                style={[
                  styles.radioInner,
                  { backgroundColor: Colors.LavenderPurple },
                ]}
              />
            )}
          </View>
        </View>

        <Text style={[styles.presetTipsText, { color: textSecondary }]}>
          {preset.description}
        </Text>

        {/* Aliases Preview Chips */}
        {preset.aliases && preset.aliases.length > 0 && (
          <View style={styles.aliasesWrap}>
            <Text style={[styles.aliasesLabel, { color: textSecondary }]}>
              Recognized Variations:
            </Text>
            <View style={styles.aliasesChipsRow}>
              {preset.aliases.slice(0, 4).map(alias => (
                <View
                  key={alias}
                  style={[
                    styles.aliasChip,
                    {
                      backgroundColor: surfaceAlt,
                      borderColor: borderLight,
                    },
                  ]}
                >
                  <Text
                    style={[styles.aliasChipText, { color: textSecondary }]}
                  >
                    {alias}
                  </Text>
                </View>
              ))}
              {preset.aliases.length > 4 && (
                <Text style={[styles.aliasMoreText, { color: textSecondary }]}>
                  +{preset.aliases.length - 4} more
                </Text>
              )}
            </View>
          </View>
        )}

        <View style={styles.presetMetaPills}>
          <Badge label="STT OPTIMIZED" variant="green" size="sm" />
          <View style={styles.badgeGap} />
          <Badge label="< 50ms DETECT" variant="neutral" size="sm" />
        </View>
      </TouchableOpacity>
    );
  },
);

const styles = StyleSheet.create({
  presetCard: {
    borderRadius: ResponsivePixels.size20,
    borderWidth: 1.5,
    borderBottomWidth: 3.5,
    padding: ResponsivePixels.size16,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 2,
  },
  presetTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: ResponsivePixels.size6,
  },
  presetNameCol: {
    flex: 1,
  },
  presetTitleWithBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ResponsivePixels.size8,
  },
  presetPhraseText: {
    fontFamily: Fonts.ranade.bold,
    fontSize: ResponsivePixels.size18,
    marginBottom: ResponsivePixels.size2,
  },
  presetNameText: {
    fontFamily: Fonts.poppins.regular,
    fontSize: ResponsivePixels.size11,
  },
  radioCircle: {
    width: ResponsivePixels.size22,
    height: ResponsivePixels.size22,
    borderRadius: ResponsivePixels.size11,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioCircleActive: {
    borderColor: Colors.LavenderPurple,
  },
  radioInner: {
    width: ResponsivePixels.size12,
    height: ResponsivePixels.size12,
    borderRadius: ResponsivePixels.size6,
  },
  presetTipsText: {
    ...Typography.bodySmallPoppinsRegular,
    fontSize: ResponsivePixels.size12,
    marginBottom: ResponsivePixels.size10,
  },
  aliasesWrap: {
    marginBottom: ResponsivePixels.size10,
  },
  aliasesLabel: {
    fontFamily: Fonts.poppins.regular,
    fontSize: ResponsivePixels.size10,
    marginBottom: ResponsivePixels.size4,
  },
  aliasesChipsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: ResponsivePixels.size6,
  },
  aliasChip: {
    paddingHorizontal: ResponsivePixels.size8,
    paddingVertical: ResponsivePixels.size3,
    borderRadius: ResponsivePixels.size8,
    borderWidth: 1,
  },
  aliasChipText: {
    fontFamily: Fonts.poppins.medium,
    fontSize: ResponsivePixels.size10,
  },
  aliasMoreText: {
    fontFamily: Fonts.poppins.regular,
    fontSize: ResponsivePixels.size10,
    marginLeft: ResponsivePixels.size2,
  },
  presetMetaPills: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badgeGap: {
    width: ResponsivePixels.size8,
  },
});

export default WakeWordPresetCard;
