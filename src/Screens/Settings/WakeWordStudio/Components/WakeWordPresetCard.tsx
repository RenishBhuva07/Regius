import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Fonts } from '../../../../Theme/fonts';
import { Colors } from '../../../../Assets/StyleUtilities/Colors';
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
    cardBg = Colors.DefaultWhite,
    isDarkMode = false,
    textPrimary = Colors.MidnightInkText,
    textSecondary = Colors.SubtitleGray,
    borderLight = '#E8E2D5',
    surfaceAlt = '#FAF8F5',
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
              ? 'rgba(255, 255, 255, 0.08)'
              : '#FFFFFF',
            borderBottomColor: isSelected
              ? '#4D4DB8'
              : isDarkMode
              ? '#171A20'
              : '#E2DCD0',
            shadowColor: isSelected
              ? Colors.LavenderPurple
              : isDarkMode
              ? '#000000'
              : 'rgba(131, 131, 214, 0.1)',
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
    borderRadius: 20,
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
    marginBottom: 6,
  },
  presetNameCol: {
    flex: 1,
  },
  presetTitleWithBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  presetPhraseText: {
    fontFamily: Fonts.ranade.bold,
    fontSize: 18,
    marginBottom: 2,
  },
  presetNameText: {
    fontFamily: Fonts.poppins.regular,
    fontSize: 11,
  },
  radioCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioCircleActive: {
    borderColor: Colors.LavenderPurple,
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  presetTipsText: {
    ...Typography.bodySmallPoppinsRegular,
    fontSize: 12,
    marginBottom: 10,
  },
  aliasesWrap: {
    marginBottom: 10,
  },
  aliasesLabel: {
    fontFamily: Fonts.poppins.regular,
    fontSize: 10,
    marginBottom: 4,
  },
  aliasesChipsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
  },
  aliasChip: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
  },
  aliasChipText: {
    fontFamily: Fonts.poppins.medium,
    fontSize: 10,
  },
  aliasMoreText: {
    fontFamily: Fonts.poppins.regular,
    fontSize: 10,
    marginLeft: 2,
  },
  presetMetaPills: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badgeGap: {
    width: 8,
  },
});

export default WakeWordPresetCard;
