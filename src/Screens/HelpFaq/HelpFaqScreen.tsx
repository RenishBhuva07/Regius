import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Linking,
  Platform,
  Vibration,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ChevronDown,
  ChevronUp,
  Mail,
  MessageSquare,
  Shield,
  Mic,
  CheckSquare,
  Flame,
  Sparkles,
} from 'lucide-react-native';
import Toast from 'react-native-toast-message';

import { Fonts } from '../../Theme/fonts';
import { Colors, withAlpha } from '../../Assets/StyleUtilities/Colors';
import { Badge } from '../../Common/Badge';
import { ProBadge } from '../../Common/ProBadge';
import CustomButton from '../../Common/CustomButton';
import {
  SubScreenHeader,
  SUB_SCREEN_HEADER_HEIGHT,
} from '../../Common/SubScreenHeader';
import { useScrollReactiveHeader } from '../../Common/useScrollReactiveHeader';
import { SearchInputBar } from '../../Common/SearchInputBar';
import { useTheme } from '../../Theme/ThemeContext';
import { SettingsBackgroundSvg } from '../Settings/Components/SettingsBackgroundSvg';
import ResponsivePixels from '../../Assets/StyleUtilities/ResponsivePixels';

const HEADER_HEIGHT = SUB_SCREEN_HEADER_HEIGHT;

interface FaqItem {
  id: string;
  category: 'Voice' | 'Tasks' | 'Gestures' | 'Privacy';
  question: string;
  answer: string;
  tip?: string;
}

const FAQS: FaqItem[] = [
  {
    id: '1',
    category: 'Voice',
    question: 'How do I activate the hands-free voice assistant?',
    answer:
      "Simply speak your configured wake phrase (default: 'Hey Regius') at any time while the app is active. The holographic ambient orb will illuminate and begin listening for your commands.",
    tip: 'You can customize your wake phrase in Wake Word Studio.',
  },
  {
    id: '2',
    category: 'Voice',
    question: 'Can I add tasks and reminders purely using voice?',
    answer:
      "Yes! Say 'Hey Regius, add a task to prepare the executive slide deck by 3 PM' or 'Remind me to hydrate in 45 minutes'. Regius intelligently parses natural language dates, priorities, and categories.",
    tip: 'Voice commands automatically sync with your Daily Balance score.',
  },
  {
    id: '3',
    category: 'Voice',
    question: 'What is Kokoro-82M neural TTS?',
    answer:
      'Regius features Kokoro-82M, a state-of-the-art neural speech model with 82 million parameters that generates warm, human-like cadence, natural intonation, and luxury acoustics.',
    tip: 'Audition different accents and speeds in Voice Studio.',
  },
  {
    id: '4',
    category: 'Tasks',
    question: 'How does the Task & Habit productivity score work?',
    answer:
      'Your Daily Balance Grid aggregates completed works, mindful habit streaks, and active alerts into a unified productivity metric designed to encourage sustained focus without burnout.',
    tip: 'Complete morning rituals early to boost your daily momentum score.',
  },
  {
    id: '5',
    category: 'Gestures',
    question: 'What gestures are supported across screens?',
    answer:
      'You can swipe cards horizontally to toggle completion or delete, pull down to refresh the AI daily briefing, and tap the floating glowing plus button from any screen to quick-add items.',
    tip: 'Long-press the glowing center (+) button for 320ms to activate Voice instantly.',
  },
  {
    id: '6',
    category: 'Privacy',
    question: 'Are my voice audio clips stored or sold to third parties?',
    answer:
      'Never. Regius enforces a strict zero data selling architecture. Speech recognition is evaluated locally on device, and cloud sync operates with end-to-end 256-bit AES encryption.',
    tip: 'Inspect your full privacy audit in Privacy & Security settings.',
  },
];

type CategoryFilter = 'All' | 'Voice' | 'Tasks' | 'Gestures' | 'Privacy';

export const HelpFaqScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const { isDarkMode, Colors: themeColors } = useTheme();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('All');
  const [expandedId, setExpandedId] = useState<string | null>('1');

  // Scroll tracking for reactive header layer
  const { scrollY, isScrolled, handleScroll } = useScrollReactiveHeader();

  const filteredFaqs = useMemo(() => {
    return FAQS.filter(item => {
      const matchesCategory =
        activeCategory === 'All' || item.category === activeCategory;
      const matchesQuery =
        !searchQuery.trim() ||
        item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.answer.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesQuery;
    });
  }, [activeCategory, searchQuery]);

  const toggleExpand = (id: string) => {
    Vibration.vibrate(15);
    setExpandedId(prev => (prev === id ? null : id));
  };

  const handleContactConcierge = () => {
    Vibration.vibrate(25);
    Linking.openURL(
      'mailto:concierge@regius.ai?subject=Regius%20Executive%20Concierge%20Inquiry',
    ).catch(() => {
      Toast.show({
        type: 'info',
        text1: 'Concierge Desk',
        text2: 'Reach our team directly at concierge@regius.ai',
      });
    });
  };

  const handleOpenVoiceHelp = () => {
    Vibration.vibrate(25);
    Toast.show({
      type: 'info',
      text1: 'Voice Assistant Active 🎙️',
      text2: 'Say "Hey Regius" at any time or hold the center plus button.',
    });
  };

  const bgMain =
    themeColors.Background ||
    (isDarkMode ? Colors.DarkBackground : Colors.CreamBackground);
  const cardBg =
    themeColors.CardBackground ||
    (isDarkMode ? Colors.DarkCardBackground : Colors.PureWhite);
  const textPrimary =
    themeColors.PrimaryText ||
    (isDarkMode ? Colors.PureWhite : Colors.PureBlack);
  const textSecondary =
    themeColors.SecondaryText ||
    (isDarkMode ? Colors.SteelMist : Colors.SubtitleGray);
  const borderLight =
    themeColors.BorderLight ||
    (isDarkMode ? Colors.CarbonSlate : Colors.RingBorder);

  return (
    <View style={[styles.container, { backgroundColor: bgMain }]}>
      {/* Luxury Background Artwork */}
      <SettingsBackgroundSvg />

      {/* Scroll-Reactive Header */}
      <SubScreenHeader
        title="Help & FAQs"
        subtitle="Guides & Dedicated Desk"
        scrollY={scrollY}
        isScrolled={isScrolled}
        badge={{ label: 'SUPPORT', variant: 'green' }}
        backAccessibilityLabel="Back to Settings"
      />

      {/* Scrollable Body Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: insets.top + HEADER_HEIGHT + ResponsivePixels.size14,
            paddingBottom: insets.bottom + ResponsivePixels.size48,
          },
        ]}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {/* VIP Concierge */}
        <View style={styles.heroCardShadowWrapper}>
          <View style={styles.heroCard}>
            <View style={styles.heroHeaderRow}>
              <View style={styles.heroTagRow}>
                <Sparkles
                  size={ResponsivePixels.size13}
                  color={Colors.AccentYellow}
                  strokeWidth={2.4}
                />
                <Text style={styles.heroTagText}>
                  VIP CONCIERGE & DIAGNOSTICS
                </Text>
              </View>
              <ProBadge size="sm" />
            </View>

            <Text style={styles.heroTitle}>Direct Executive Support</Text>
            <Text style={styles.heroSubtitle}>
              Direct priority access to our senior engineering and product team.
              Average response time under 2 hours.
            </Text>

            {/* Instant Action Button Row */}
            <View style={styles.heroActionsRow}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={handleOpenVoiceHelp}
                style={styles.heroVoiceBtn}
                accessibilityRole="button"
                accessibilityLabel="Ask Voice Assistant"
              >
                <Mic
                  size={ResponsivePixels.size15}
                  color={Colors.LavenderPurple}
                  strokeWidth={2.4}
                />
                <Text style={styles.heroVoiceBtnText}>Ask Sia</Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={handleContactConcierge}
                style={styles.heroEmailBtn}
                accessibilityRole="button"
                accessibilityLabel="Contact Concierge Desk"
              >
                <Mail
                  size={ResponsivePixels.size15}
                  color={Colors.AccentYellow}
                  strokeWidth={2.4}
                />
                <Text style={styles.heroEmailBtnText}>Email Concierge</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Search Input Bar */}
        <SearchInputBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search guides, gestures, commands..."
          containerStyle={{ marginBottom: ResponsivePixels.size16 }}
        />

        {/* 4-Facet Knowledge Domains */}
        <View style={styles.domainsSection}>
          <Text style={[styles.sectionHeading, { color: textSecondary }]}>
            KNOWLEDGE DOMAINS
          </Text>

          <View style={styles.domainsGrid}>
            {[
              {
                id: 'Voice' as const,
                label: 'Voice Assistant',
                count: '3 Guides',
                icon: Mic,
                accent: Colors.LavenderPurple,
                bg: isDarkMode
                  ? Colors.VaultMindfulDarkBg
                  : Colors.MindfulLightBg,
                border: isDarkMode
                  ? Colors.PerkLavenderDarkBorder
                  : Colors.MindfulLightBorder,
              },
              {
                id: 'Tasks' as const,
                label: 'Works & Tasks',
                count: '2 Guides',
                icon: CheckSquare,
                accent: Colors.HabitBurnishedAmber,
                bg: isDarkMode ? Colors.VaultAmberDarkBg : Colors.WorkLightBg,
                border: isDarkMode
                  ? Colors.PerkAmberDarkBorder
                  : Colors.WorkLightBorder,
              },
              {
                id: 'Gestures' as const,
                label: 'Ritual Gestures',
                count: '2 Guides',
                icon: Flame,
                accent: Colors.GreenGracious,
                bg: isDarkMode ? Colors.PerkGreenDarkBg : Colors.WellnessLightBg,
                border: isDarkMode
                  ? Colors.PerkGreenDarkBorder
                  : Colors.WellnessLightBorder,
              },
              {
                id: 'Privacy' as const,
                label: 'Vault & Privacy',
                count: '1 Guide',
                icon: Shield,
                accent: Colors.EventTextAccent,
                bg: isDarkMode ? Colors.EventDarkBg : Colors.EventLightBg,
                border: isDarkMode
                  ? Colors.PerkOrangeDarkBorder
                  : Colors.BadgeOrangeBevel,
              },
            ].map(domain => {
              const isSelected = activeCategory === domain.id;
              const IconComp = domain.icon;

              return (
                <TouchableOpacity
                  key={domain.id}
                  activeOpacity={0.8}
                  onPress={() => {
                    Vibration.vibrate(15);
                    setActiveCategory(prev =>
                      prev === domain.id ? 'All' : domain.id,
                    );
                  }}
                  style={[
                    styles.domainCard,
                    {
                      backgroundColor: domain.bg,
                      borderColor: isSelected ? domain.accent : domain.border,
                      borderWidth: isSelected ? 2 : 1.5,
                      shadowColor: domain.accent,
                    },
                  ]}
                >
                  <View
                    style={[
                      styles.domainIconCircle,
                      {
                        backgroundColor: Colors.PureWhite,
                        borderColor: domain.border,
                      },
                    ]}
                  >
                    <IconComp
                      size={ResponsivePixels.size16}
                      color={domain.accent}
                      strokeWidth={2.4}
                    />
                  </View>

                  <Text style={[styles.domainLabel, { color: textPrimary }]}>
                    {domain.label}
                  </Text>
                  <Text style={[styles.domainCount, { color: domain.accent }]}>
                    {domain.count}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Frequently Asked Questions Accordion */}
        <View style={styles.faqSection}>
          <View style={styles.faqHeaderBar}>
            <Text style={[styles.sectionHeading, { color: textSecondary }]}>
              FREQUENTLY ASKED QUESTIONS ({filteredFaqs.length})
            </Text>
            {activeCategory !== 'All' && (
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setActiveCategory('All')}
              >
                <Text style={styles.clearFilterText}>Show All</Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.faqList}>
            {filteredFaqs.map(item => {
              const isExpanded = expandedId === item.id;
              const accentColor =
                item.category === 'Voice'
                  ? Colors.LavenderPurple
                  : item.category === 'Tasks'
                  ? Colors.AccentYellow
                  : item.category === 'Gestures'
                  ? Colors.GreenGracious
                  : Colors.AccentAmber;

              return (
                <View
                  key={item.id}
                  style={[
                    styles.faqCard,
                    {
                      backgroundColor: cardBg,
                      borderColor: isExpanded ? accentColor : borderLight,
                      shadowColor: isExpanded ? accentColor : Colors.PureBlack,
                    },
                  ]}
                >
                  {/* Leading category accent strip */}
                  <View
                    style={[
                      styles.faqLeadingSliver,
                      { backgroundColor: accentColor },
                    ]}
                  />

                  <TouchableOpacity
                    activeOpacity={0.8}
                    style={styles.faqHeaderBtn}
                    onPress={() => toggleExpand(item.id)}
                  >
                    <View style={styles.faqHeaderLeft}>
                      <Badge
                        label={item.category.toUpperCase()}
                        variant={
                          item.category === 'Voice'
                            ? 'purple'
                            : item.category === 'Tasks'
                            ? 'yellow'
                            : item.category === 'Gestures'
                            ? 'green'
                            : 'orange'
                        }
                        size="sm"
                      />

                      <Text
                        style={[styles.faqQuestionText, { color: textPrimary }]}
                      >
                        {item.question}
                      </Text>
                    </View>

                    <View
                      style={[
                        styles.chevronWrap,
                        {
                          backgroundColor: isExpanded
                            ? isDarkMode
                              ? Colors.LanguageAuditionDarkBg
                              : Colors.MindfulLightBg
                            : isDarkMode
                            ? Colors.DarkSocialButtonBg
                            : Colors.FaqChevronIdleLightBg,
                          borderColor: borderLight,
                        },
                      ]}
                    >
                      {isExpanded ? (
                        <ChevronUp
                          size={ResponsivePixels.size15}
                          color={accentColor}
                          strokeWidth={2.4}
                        />
                      ) : (
                        <ChevronDown
                          size={ResponsivePixels.size15}
                          color={textSecondary}
                          strokeWidth={2.4}
                        />
                      )}
                    </View>
                  </TouchableOpacity>

                  {isExpanded && (
                    <View
                      style={[
                        styles.faqAnswerWrap,
                        { borderTopColor: borderLight },
                      ]}
                    >
                      <Text
                        style={[styles.faqAnswerText, { color: textSecondary }]}
                      >
                        {item.answer}
                      </Text>

                      {item.tip && (
                        <View
                          style={[
                            styles.tipCard,
                            {
                              backgroundColor: isDarkMode
                                ? Colors.VoiceCardDarkSelectedBg
                                : Colors.CreamSurfaceAlt,
                              borderColor: isDarkMode
                                ? Colors.FaqTipDarkBorder
                                : Colors.WarmCheckboxBorder,
                            },
                          ]}
                        >
                          <Sparkles
                            size={ResponsivePixels.size14}
                            color={Colors.LavenderPurple}
                            strokeWidth={2.4}
                          />
                          <Text
                            style={[styles.tipText, { color: textPrimary }]}
                          >
                            <Text style={styles.tipBold}>Regius Tip: </Text>
                            {item.tip}
                          </Text>
                        </View>
                      )}
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        </View>

        {/* Bottom Concierge Direct Contact Desk */}
        <View
          style={[
            styles.conciergeDeskCard,
            {
              backgroundColor: cardBg,
              borderColor: borderLight,
            },
          ]}
        >
          <View style={styles.deskTopRow}>
            <View
              style={[
                styles.deskIconCircle,
                {
                  backgroundColor: isDarkMode
                    ? Colors.CarbonSlate
                    : Colors.MindfulLightBg,
                },
              ]}
            >
              <MessageSquare
                size={ResponsivePixels.size22}
                color={Colors.LavenderPurple}
                strokeWidth={2.2}
              />
            </View>
            <View style={styles.deskMeta}>
              <Text style={[styles.deskTitle, { color: textPrimary }]}>
                Regius Concierge Support
              </Text>
              <Text style={[styles.deskDesc, { color: textSecondary }]}>
                Our concierge service is dedicated to crafting your flawless
                executive flow. Reach us directly anytime.
              </Text>
            </View>
          </View>

          <CustomButton
            title="Contact Concierge Desk"
            onPress={handleContactConcierge}
            variant="dark"
            style={styles.deskButton}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default HelpFaqScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: ResponsivePixels.size16,
  },
  /* 2-Layer Hero Bento */
  heroCardShadowWrapper: {
    borderRadius: ResponsivePixels.size24,
    backgroundColor: Colors.NeroBlack,
    marginBottom: ResponsivePixels.size16,
    ...Platform.select({
      ios: {
        shadowColor: Colors.PureBlack,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.28,
        shadowRadius: 18,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  heroCard: {
    backgroundColor: Colors.NeroBlack,
    borderRadius: ResponsivePixels.size24,
    borderWidth: 4,
    borderColor: withAlpha(Colors.PureWhite, 0.9),
    overflow: 'hidden',
    padding: ResponsivePixels.size18,
  },
  heroHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: ResponsivePixels.size10,
  },
  heroTagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ResponsivePixels.size6,
  },
  heroTagText: {
    fontFamily: Fonts.poppins.bold,
    fontSize: ResponsivePixels.size10,
    color: Colors.AccentYellow,
    letterSpacing: 1,
  },
  heroTitle: {
    fontFamily: Fonts.ranade.bold,
    fontSize: ResponsivePixels.size21,
    color: Colors.PureWhite,
    letterSpacing: -0.4,
    lineHeight: ResponsivePixels.size26,
    marginBottom: ResponsivePixels.size6,
  },
  heroSubtitle: {
    fontFamily: Fonts.poppins.regular,
    fontSize: ResponsivePixels.size12,
    color: Colors.SteelMist,
    lineHeight: ResponsivePixels.size18,
    marginBottom: ResponsivePixels.size16,
  },
  heroActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ResponsivePixels.size10,
  },
  heroVoiceBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: ResponsivePixels.size8,
    backgroundColor: Colors.LanguageAuditionDarkBg,
    borderWidth: 1,
    borderColor: withAlpha(Colors.LavenderPurple, 0.35),
    borderRadius: ResponsivePixels.size20,
    paddingVertical: ResponsivePixels.size10,
  },
  heroVoiceBtnText: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: ResponsivePixels.size12_5,
    color: Colors.PureWhite,
  },
  heroEmailBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: ResponsivePixels.size8,
    backgroundColor: Colors.LanguageAuditionDarkBg,
    borderWidth: 1,
    borderColor: withAlpha(Colors.AccentYellow, 0.35),
    borderRadius: ResponsivePixels.size20,
    paddingVertical: ResponsivePixels.size10,
  },
  heroEmailBtnText: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: ResponsivePixels.size12_5,
    color: Colors.PureWhite,
  },
  /* Search input */
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: ResponsivePixels.size16,
    borderWidth: 1.5,
    paddingHorizontal: ResponsivePixels.size14,
    height: ResponsivePixels.size48,
    gap: ResponsivePixels.size10,
    marginBottom: ResponsivePixels.size16,
    shadowColor: Colors.PureBlack,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 5,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    fontFamily: Fonts.poppins.regular,
    fontSize: ResponsivePixels.size13,
    padding: 0,
  },
  searchClearBtn: {
    padding: ResponsivePixels.size4,
  },
  /* Knowledge domains 4-facet grid */
  domainsSection: {
    marginBottom: ResponsivePixels.size20,
  },
  sectionHeading: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: ResponsivePixels.size11,
    letterSpacing: 0.8,
    marginBottom: ResponsivePixels.size10,
    marginLeft: ResponsivePixels.size2,
  },
  domainsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: ResponsivePixels.size10,
  },
  domainCard: {
    width: '48.5%',
    borderRadius: ResponsivePixels.size18,
    padding: ResponsivePixels.size12,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 5,
    elevation: 2,
  },
  domainIconCircle: {
    width: ResponsivePixels.size32,
    height: ResponsivePixels.size32,
    borderRadius: ResponsivePixels.size16,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: ResponsivePixels.size8,
  },
  domainLabel: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: ResponsivePixels.size12_5,
    marginBottom: ResponsivePixels.size2,
  },
  domainCount: {
    fontFamily: Fonts.poppins.medium,
    fontSize: ResponsivePixels.size11,
  },
  /* FAQ list */
  faqSection: {
    marginBottom: ResponsivePixels.size20,
  },
  faqHeaderBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: ResponsivePixels.size10,
    paddingHorizontal: ResponsivePixels.size2,
  },
  clearFilterText: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: ResponsivePixels.size11_5,
    color: Colors.LavenderPurple,
  },
  faqList: {
    gap: ResponsivePixels.size10,
  },
  faqCard: {
    borderRadius: ResponsivePixels.size18,
    borderWidth: 1.5,
    paddingVertical: ResponsivePixels.size14,
    paddingHorizontal: ResponsivePixels.size16,
    paddingLeft: ResponsivePixels.size20,
    position: 'relative',
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  faqLeadingSliver: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    width: ResponsivePixels.size4,
    borderTopLeftRadius: ResponsivePixels.size18,
    borderBottomLeftRadius: ResponsivePixels.size18,
  },
  faqHeaderBtn: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: ResponsivePixels.size10,
  },
  faqHeaderLeft: {
    flex: 1,
    gap: ResponsivePixels.size6,
  },
  faqQuestionText: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: ResponsivePixels.size14,
    lineHeight: ResponsivePixels.size20,
  },
  chevronWrap: {
    width: ResponsivePixels.size30,
    height: ResponsivePixels.size30,
    borderRadius: ResponsivePixels.size15,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: ResponsivePixels.size2,
  },
  faqAnswerWrap: {
    marginTop: ResponsivePixels.size12,
    paddingTop: ResponsivePixels.size10,
    borderTopWidth: StyleSheet.hairlineWidth,
    gap: ResponsivePixels.size10,
  },
  faqAnswerText: {
    fontFamily: Fonts.poppins.regular,
    fontSize: ResponsivePixels.size12_5,
    lineHeight: ResponsivePixels.size19,
  },
  tipCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: ResponsivePixels.size8,
    borderRadius: ResponsivePixels.size12,
    borderWidth: 1,
    padding: ResponsivePixels.size10,
  },
  tipText: {
    flex: 1,
    fontFamily: Fonts.poppins.regular,
    fontSize: ResponsivePixels.size11_5,
    lineHeight: ResponsivePixels.size16,
  },
  tipBold: {
    fontFamily: Fonts.poppins.bold,
  },
  /* Bottom concierge desk */
  conciergeDeskCard: {
    borderRadius: ResponsivePixels.size20,
    borderWidth: 1.5,
    padding: ResponsivePixels.size16,
    shadowColor: Colors.PureBlack,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  deskTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: ResponsivePixels.size12,
    marginBottom: ResponsivePixels.size14,
  },
  deskIconCircle: {
    width: ResponsivePixels.size42,
    height: ResponsivePixels.size42,
    borderRadius: ResponsivePixels.size21,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deskMeta: {
    flex: 1,
  },
  deskTitle: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: ResponsivePixels.size14_5,
    marginBottom: ResponsivePixels.size2,
  },
  deskDesc: {
    fontFamily: Fonts.poppins.regular,
    fontSize: ResponsivePixels.size11_5,
    lineHeight: ResponsivePixels.size16,
  },
  deskButton: {
    width: '100%',
  },
});
