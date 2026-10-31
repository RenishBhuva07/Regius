import React, { useState, useRef, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  StatusBar,
  Linking,
  Platform,
  Animated,
  Vibration,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import {
  ChevronDown,
  ChevronUp,
  Search,
  HelpCircle,
  Mail,
  MessageSquare,
  Sparkles,
  ExternalLink,
  Shield,
  Mic,
  CheckSquare,
  Flame,
  X,
  Compass,
} from 'lucide-react-native';
import Toast from 'react-native-toast-message';

import { Typography } from '../../Theme/Typographys';
import { Fonts } from '../../Theme/fonts';
import { Colors } from '../../Assets/StyleUtilities/Colors';
import ResponsivePixels from '../../Assets/StyleUtilities/ResponsivePixels';
import { Badge } from '../../Common/Badge';
import {
  SubScreenHeader,
  SUB_SCREEN_HEADER_HEIGHT,
} from '../../Common/SubScreenHeader';
import { useScrollReactiveHeader } from '../../Common/useScrollReactiveHeader';
import { ProBadge } from '../../Common/ProBadge';
import CustomButton from '../../Common/CustomButton';
import { useTheme } from '../../Theme/ThemeContext';
import { SettingsBackgroundSvg } from '../Settings/Components/SettingsBackgroundSvg';

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
  const navigation = useNavigation<any>();
  const { isDarkMode } = useTheme();
  const { width: screenWidth } = Dimensions.get('window');

  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('All');
  const [expandedId, setExpandedId] = useState<string | null>('1');

  // Scroll tracking for reactive header layer
  const { scrollY, isScrolled, handleScroll } = useScrollReactiveHeader();

  const categories: CategoryFilter[] = [
    'All',
    'Voice',
    'Tasks',
    'Gestures',
    'Privacy',
  ];

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

  const bgMain = isDarkMode ? '#121417' : Colors.CreamBackground;
  const cardBg = isDarkMode ? '#1E2228' : Colors.DefaultWhite;
  const textPrimary = isDarkMode
    ? Colors.PureWhiteText
    : Colors.MidnightInkText;
  const textSecondary = isDarkMode ? '#A3A8B1' : Colors.SubtitleGray;
  const borderLight = isDarkMode ? '#2C3035' : '#E8E2D5';

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
            paddingTop: insets.top + HEADER_HEIGHT + 14,
            paddingBottom: insets.bottom + 48,
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
                <Sparkles size={13} color="#F5C518" strokeWidth={2.4} />
                <Text style={styles.heroTagText}>VIP CONCIERGE & DIAGNOSTICS</Text>
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
                <Mic size={15} color="#8383D6" strokeWidth={2.4} />
                <Text style={styles.heroVoiceBtnText}>Ask Sia</Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={handleContactConcierge}
                style={styles.heroEmailBtn}
                accessibilityRole="button"
                accessibilityLabel="Contact Concierge Desk"
              >
                <Mail size={15} color="#F5C518" strokeWidth={2.4} />
                <Text style={styles.heroEmailBtnText}>Email Concierge</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Search Input Bar */}
        <View
          style={[
            styles.searchWrap,
            {
              backgroundColor: cardBg,
              borderColor: isDarkMode ? '#2C3035' : borderLight,
            },
          ]}
        >
          <Search size={18} color={textSecondary} strokeWidth={2.2} />
          <TextInput
            style={[styles.searchInput, { color: textPrimary }]}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search guides, gestures, commands..."
            placeholderTextColor={textSecondary}
            autoCorrect={false}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setSearchQuery('')}
              style={styles.searchClearBtn}
            >
              <X size={15} color={textSecondary} strokeWidth={2.4} />
            </TouchableOpacity>
          )}
        </View>

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
                accent: '#8383D6',
                bg: isDarkMode ? '#23273A' : '#EFF2FE',
                border: isDarkMode ? '#484E70' : '#D8DBFF',
              },
              {
                id: 'Tasks' as const,
                label: 'Works & Tasks',
                count: '2 Guides',
                icon: CheckSquare,
                accent: '#D97706',
                bg: isDarkMode ? '#332918' : '#FFFCEB',
                border: isDarkMode ? '#665126' : '#FFF5B8',
              },
              {
                id: 'Gestures' as const,
                label: 'Ritual Gestures',
                count: '2 Guides',
                icon: Flame,
                accent: '#1B9A72',
                bg: isDarkMode ? '#172B22' : '#EDFDF5',
                border: isDarkMode ? '#2E5B47' : '#C6FFDD',
              },
              {
                id: 'Privacy' as const,
                label: 'Vault & Privacy',
                count: '1 Guide',
                icon: Shield,
                accent: '#E65100',
                bg: isDarkMode ? '#331F18' : '#FFF0DE',
                border: isDarkMode ? '#663B26' : '#FFB86B',
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
                      borderColor: isSelected
                        ? domain.accent
                        : domain.border,
                      borderWidth: isSelected ? 2 : 1.5,
                      shadowColor: domain.accent,
                    },
                  ]}
                >
                  <View
                    style={[
                      styles.domainIconCircle,
                      {
                        backgroundColor: '#FFFFFF',
                        borderColor: domain.border,
                      },
                    ]}
                  >
                    <IconComp size={16} color={domain.accent} strokeWidth={2.4} />
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
                  ? '#8383D6'
                  : item.category === 'Tasks'
                  ? '#F5C518'
                  : item.category === 'Gestures'
                  ? '#1B9A72'
                  : '#FF9800';

              return (
                <View
                  key={item.id}
                  style={[
                    styles.faqCard,
                    {
                      backgroundColor: cardBg,
                      borderColor: isExpanded
                        ? accentColor
                        : borderLight,
                      shadowColor: isExpanded ? accentColor : '#000000',
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
                        style={[
                          styles.faqQuestionText,
                          { color: textPrimary },
                        ]}
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
                              ? '#272935'
                              : '#EFF2FE'
                            : isDarkMode
                            ? '#242830'
                            : '#F5EFE0',
                          borderColor: borderLight,
                        },
                      ]}
                    >
                      {isExpanded ? (
                        <ChevronUp
                          size={15}
                          color={accentColor}
                          strokeWidth={2.4}
                        />
                      ) : (
                        <ChevronDown
                          size={15}
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
                        style={[
                          styles.faqAnswerText,
                          { color: textSecondary },
                        ]}
                      >
                        {item.answer}
                      </Text>

                      {item.tip && (
                        <View
                          style={[
                            styles.tipCard,
                            {
                              backgroundColor: isDarkMode
                                ? '#22283A'
                                : '#FAF8F5',
                              borderColor: isDarkMode
                                ? '#394060'
                                : '#ECE8DF',
                            },
                          ]}
                        >
                          <Sparkles
                            size={14}
                            color="#8383D6"
                            strokeWidth={2.4}
                          />
                          <Text
                            style={[
                              styles.tipText,
                              { color: textPrimary },
                            ]}
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
                { backgroundColor: isDarkMode ? '#2C3035' : '#EFF2FE' },
              ]}
            >
              <MessageSquare
                size={22}
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
    paddingHorizontal: 16,
  },
  /* 2-Layer Hero Bento */
  heroCardShadowWrapper: {
    borderRadius: 24,
    backgroundColor: Colors.NeroBlack,
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
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
    borderRadius: 24,
    borderWidth: 4,
    borderColor: 'rgba(255, 255, 255, 0.9)',
    overflow: 'hidden',
    padding: 18,
  },
  heroHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  heroTagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  heroTagText: {
    fontFamily: Fonts.poppins.bold,
    fontSize: 10,
    color: '#F5C518',
    letterSpacing: 1,
  },
  heroTitle: {
    fontFamily: Fonts.ranade.bold,
    fontSize: 21,
    color: '#FFFFFF',
    letterSpacing: -0.4,
    lineHeight: 26,
    marginBottom: 6,
  },
  heroSubtitle: {
    fontFamily: Fonts.poppins.regular,
    fontSize: 12,
    color: '#A3A8B1',
    lineHeight: 18,
    marginBottom: 16,
  },
  heroActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  heroVoiceBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#272935',
    borderWidth: 1,
    borderColor: 'rgba(131, 131, 214, 0.35)',
    borderRadius: 20,
    paddingVertical: 10,
  },
  heroVoiceBtnText: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: 12.5,
    color: '#FFFFFF',
  },
  heroEmailBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#272935',
    borderWidth: 1,
    borderColor: 'rgba(245, 197, 24, 0.35)',
    borderRadius: 20,
    paddingVertical: 10,
  },
  heroEmailBtnText: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: 12.5,
    color: '#FFFFFF',
  },
  /* Search input */
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1.5,
    paddingHorizontal: 14,
    height: 48,
    gap: 10,
    marginBottom: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 5,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    fontFamily: Fonts.poppins.regular,
    fontSize: 13,
    padding: 0,
  },
  searchClearBtn: {
    padding: 4,
  },
  /* Knowledge domains 4-facet grid */
  domainsSection: {
    marginBottom: 20,
  },
  sectionHeading: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: 11,
    letterSpacing: 0.8,
    marginBottom: 10,
    marginLeft: 2,
  },
  domainsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  domainCard: {
    width: '48.5%',
    borderRadius: 18,
    padding: 12,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 5,
    elevation: 2,
  },
  domainIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  domainLabel: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: 12.5,
    marginBottom: 2,
  },
  domainCount: {
    fontFamily: Fonts.poppins.medium,
    fontSize: 11,
  },
  /* FAQ list */
  faqSection: {
    marginBottom: 20,
  },
  faqHeaderBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    paddingHorizontal: 2,
  },
  clearFilterText: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: 11.5,
    color: Colors.LavenderPurple,
  },
  faqList: {
    gap: 10,
  },
  faqCard: {
    borderRadius: 18,
    borderWidth: 1.5,
    paddingVertical: 14,
    paddingHorizontal: 16,
    paddingLeft: 20,
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
    width: 4,
    borderTopLeftRadius: 18,
    borderBottomLeftRadius: 18,
  },
  faqHeaderBtn: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 10,
  },
  faqHeaderLeft: {
    flex: 1,
    gap: 6,
  },
  faqQuestionText: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: 14,
    lineHeight: 20,
  },
  chevronWrap: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  faqAnswerWrap: {
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    gap: 10,
  },
  faqAnswerText: {
    fontFamily: Fonts.poppins.regular,
    fontSize: 12.5,
    lineHeight: 19,
  },
  tipCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    borderRadius: 12,
    borderWidth: 1,
    padding: 10,
  },
  tipText: {
    flex: 1,
    fontFamily: Fonts.poppins.regular,
    fontSize: 11.5,
    lineHeight: 16,
  },
  tipBold: {
    fontFamily: Fonts.poppins.bold,
  },
  /* Bottom concierge desk */
  conciergeDeskCard: {
    borderRadius: 20,
    borderWidth: 1.5,
    padding: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  deskTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 14,
  },
  deskIconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deskMeta: {
    flex: 1,
  },
  deskTitle: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: 14.5,
    marginBottom: 2,
  },
  deskDesc: {
    fontFamily: Fonts.poppins.regular,
    fontSize: 11.5,
    lineHeight: 16,
  },
  deskButton: {
    width: '100%',
  },
});
