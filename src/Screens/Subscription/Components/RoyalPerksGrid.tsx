import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {
  Crown,
  Sparkles,
  Palette,
  Mic,
  Zap,
  ShieldCheck,
  Volume2,
} from 'lucide-react-native';

import { Colors } from '../../../Assets/StyleUtilities/Colors';
import { Fonts } from '../../../Theme/fonts';
import { useTheme } from '../../../Theme/ThemeContext';

export interface RoyalPerksGridProps {
  isDarkMode: boolean;
}

const PERKS = [
  {
    icon: Volume2,
    title: 'Unlimited Neural TTS Voice',
    desc: 'Kokoro-82M cloud synthesis with zero rate limits, studio-grade clarity, and all 7 voice personas.',
    accent: Colors.LavenderPurple,
    bgLight: Colors.MindfulLightBg,
    bgDark: Colors.VaultMindfulDarkBg,
    borderLight: Colors.MindfulLightBorder,
    borderDark: Colors.PerkLavenderDarkBorder,
  },
  {
    icon: Palette,
    title: 'All 8 Luxury Artisan Themes',
    desc: 'Instantly unlock Imperial Obsidian, Midnight Velvet, Tuscan Amber, and all high-tier palettes.',
    accent: Colors.AccentYellow,
    bgLight: Colors.WorkLightBg,
    bgDark: Colors.VaultAmberDarkBg,
    borderLight: Colors.WorkLightBorder,
    borderDark: Colors.PerkAmberDarkBorder,
  },
  {
    icon: Mic,
    title: 'Custom Wake Word Studio',
    desc: 'Create and train custom wake-word phrases with real-time on-device acoustic sensitivity.',
    accent: Colors.AccentAmber,
    bgLight: Colors.EventLightBg,
    bgDark: Colors.EventDarkBg,
    borderLight: Colors.BadgeOrangeBevel,
    borderDark: Colors.PerkOrangeDarkBorder,
  },
  {
    icon: Zap,
    title: '2x Milestone XP Multiplier',
    desc: 'Earn double XP for every completed task, reminder, and habit to reach Tier 5 Grand Monarch faster.',
    accent: Colors.IndigoAccent,
    bgLight: Colors.PerkIndigoLightBg,
    bgDark: Colors.PerkIndigoDarkBg,
    borderLight: Colors.PerkIndigoLightBorder,
    borderDark: Colors.PerkIndigoDarkBorder,
  },
  {
    icon: ShieldCheck,
    title: 'Encrypted Cloud Sync & Backup',
    desc: 'Continuous zero-knowledge cloud backup across all your devices with instant recovery.',
    accent: Colors.LuminousGreen,
    bgLight: Colors.WellnessLightBg,
    bgDark: Colors.PerkGreenDarkBg,
    borderLight: Colors.WellnessLightBorder,
    borderDark: Colors.PerkGreenDarkBorder,
  },
  {
    icon: Sparkles,
    title: 'Executive Spoken Briefing',
    desc: 'Start each morning with an artisanal neural audio digest of your day’s schedule and focus rituals.',
    accent: Colors.CoralWarmth,
    bgLight: Colors.PerkCoralLightBg,
    bgDark: Colors.PerkCoralDarkBg,
    borderLight: Colors.PerkCoralLightBorder,
    borderDark: Colors.PerkCoralDarkBorder,
  },
];

export const RoyalPerksGrid: React.FC<RoyalPerksGridProps> = React.memo(
  ({ isDarkMode }) => {
    const { Colors: themeColors } = useTheme();
    const cardBg =
      themeColors.CardBackground ||
      (isDarkMode ? Colors.DarkCardBackground : Colors.PureWhite);
    const textPrimary =
      themeColors.PrimaryText ||
      (isDarkMode ? Colors.PureWhite : Colors.NoirBlack);
    const textSecondary =
      themeColors.SecondaryText ||
      (isDarkMode ? Colors.SteelMist : Colors.SubtitleGray);
    const borderLight =
      themeColors.BorderLight ||
      (isDarkMode ? Colors.CarbonSlate : Colors.WarmParchmentBorder);

    return (
      <View style={styles.container}>
        <View style={styles.sectionHeaderRow}>
          <Crown size={18} color={Colors.AccentYellow} strokeWidth={2.4} />
          <Text style={[styles.sectionTitle, { color: textPrimary }]}>
            Everything Included in Royal
          </Text>
        </View>

        <View style={styles.perksContainer}>
          {PERKS.map((perk, idx) => {
            const IconComp = perk.icon;
            const bg = isDarkMode ? perk.bgDark : perk.bgLight;
            const border = isDarkMode ? perk.borderDark : perk.borderLight;

            return (
              <View
                key={idx}
                style={[
                  styles.perkCard,
                  {
                    backgroundColor: cardBg,
                    borderColor: borderLight,
                  },
                ]}
              >
                <View
                  style={[
                    styles.perkIconBox,
                    {
                      backgroundColor: bg,
                      borderColor: border,
                    },
                  ]}
                >
                  <IconComp size={20} color={perk.accent} strokeWidth={2.4} />
                </View>
                <View style={styles.perkInfo}>
                  <Text style={[styles.perkTitle, { color: textPrimary }]}>
                    {perk.title}
                  </Text>
                  <Text style={[styles.perkDesc, { color: textSecondary }]}>
                    {perk.desc}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>
      </View>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
    marginLeft: 2,
  },
  sectionTitle: {
    fontFamily: Fonts.ranade.bold,
    fontSize: 18,
    letterSpacing: -0.3,
  },
  perksContainer: {
    gap: 10,
  },
  perkCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderRadius: 18,
    borderWidth: 1.5,
    padding: 14,
    gap: 12,
    shadowColor: Colors.PureBlack,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 5,
    elevation: 2,
  },
  perkIconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  perkInfo: {
    flex: 1,
  },
  perkTitle: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: 14,
    marginBottom: 3,
  },
  perkDesc: {
    fontFamily: Fonts.poppins.regular,
    fontSize: 11.5,
    lineHeight: 16,
  },
});

export default RoyalPerksGrid;
