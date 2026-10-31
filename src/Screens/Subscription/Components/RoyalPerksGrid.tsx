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

import { Fonts } from '../../../Theme/fonts';
import { Colors } from '../../../Assets/StyleUtilities/Colors';

export interface RoyalPerksGridProps {
  isDarkMode: boolean;
}

const PERKS = [
  {
    icon: Volume2,
    title: 'Unlimited Neural TTS Voice',
    desc: 'Kokoro-82M cloud synthesis with zero rate limits, studio-grade clarity, and all 7 voice personas.',
    accent: '#8383D6',
    bgLight: '#EFF2FE',
    bgDark: '#23273A',
    borderLight: '#D8DBFF',
    borderDark: '#484E70',
  },
  {
    icon: Palette,
    title: 'All 8 Luxury Artisan Themes',
    desc: 'Instantly unlock Imperial Obsidian, Midnight Velvet, Tuscan Amber, and all high-tier palettes.',
    accent: '#F5C518',
    bgLight: '#FFFCEB',
    bgDark: '#332918',
    borderLight: '#FFF5B8',
    borderDark: '#665126',
  },
  {
    icon: Mic,
    title: 'Custom Wake Word Studio',
    desc: 'Create and train custom wake-word phrases with real-time on-device acoustic sensitivity.',
    accent: '#FF9800',
    bgLight: '#FFF0DE',
    bgDark: '#331F18',
    borderLight: '#FFB86B',
    borderDark: '#663B26',
  },
  {
    icon: Zap,
    title: '2x Milestone XP Multiplier',
    desc: 'Earn double XP for every completed task, reminder, and habit to reach Tier 5 Grand Monarch faster.',
    accent: '#6366F1',
    bgLight: '#EEF2FF',
    bgDark: '#242540',
    borderLight: '#D5DAFD',
    borderDark: '#424578',
  },
  {
    icon: ShieldCheck,
    title: 'Encrypted Cloud Sync & Backup',
    desc: 'Continuous zero-knowledge cloud backup across all your devices with instant recovery.',
    accent: '#21AF85',
    bgLight: '#EDFDF5',
    bgDark: '#172B22',
    borderLight: '#C6FFDD',
    borderDark: '#2E5B47',
  },
  {
    icon: Sparkles,
    title: 'Executive Spoken Briefing',
    desc: 'Start each morning with an artisanal neural audio digest of your day’s schedule and focus rituals.',
    accent: '#FF8772',
    bgLight: '#FFF2F0',
    bgDark: '#362220',
    borderLight: '#FFD9D4',
    borderDark: '#6B3E3A',
  },
];

export const RoyalPerksGrid: React.FC<RoyalPerksGridProps> = React.memo(
  ({ isDarkMode }) => {
    const cardBg = isDarkMode ? '#1E2228' : '#FFFFFF';
    const textPrimary = isDarkMode ? '#FFFFFF' : '#111111';
    const textSecondary = isDarkMode ? '#A3A8B1' : '#666665';
    const borderLight = isDarkMode ? '#2C3035' : '#EAE5D9';

    return (
      <View style={styles.container}>
        <View style={styles.sectionHeaderRow}>
          <Crown size={18} color="#F5C518" strokeWidth={2.4} />
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
    shadowColor: '#000000',
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
