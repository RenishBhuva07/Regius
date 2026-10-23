import React, { useState } from 'react';
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
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import {
  ChevronLeft,
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
} from 'lucide-react-native';
import Toast from 'react-native-toast-message';

import { Typography } from '../../Theme/Typographys';
import { Fonts } from '../../Theme/fonts';
import { Colors } from '../../Assets/StyleUtilities/Colors';
import ResponsivePixels from '../../Assets/StyleUtilities/ResponsivePixels';
import { Badge } from '../../Common/Badge';
import { ProBadge } from '../../Common/ProBadge';
import { useTheme } from '../../Theme/ThemeContext';

interface FaqItem {
  id: string;
  category: 'Voice' | 'Tasks' | 'Gestures' | 'Privacy';
  question: string;
  answer: string;
}

const FAQS: FaqItem[] = [
  {
    id: '1',
    category: 'Voice',
    question: 'How do I activate the hands-free voice assistant?',
    answer:
      "Simply speak your configured wake phrase (default: 'Hey Regius') at any time while the app is active. The holographic ambient orb will illuminate and begin listening for your commands.",
  },
  {
    id: '2',
    category: 'Voice',
    question: 'Can I add tasks and reminders purely using voice?',
    answer:
      "Yes! Say 'Hey Regius, add a task to prepare the executive slide deck by 3 PM' or 'Remind me to hydrate in 45 minutes'. Regius intelligently parses natural language dates, priority, and categories.",
  },
  {
    id: '3',
    category: 'Voice',
    question: 'What is Kokoro-82M neural TTS?',
    answer:
      'Regius features Kokoro-82M, a state-of-the-art neural speech model with 82 million parameters that generates warm, human-like cadence, natural intonation, and luxury acoustics.',
  },
  {
    id: '4',
    category: 'Tasks',
    question: 'How does the Task & Habit productivity score work?',
    answer:
      'Your Daily Balance Grid aggregates completed works, mindful habit streaks, and active alerts into a unified productivity metric designed to encourage sustained focus without burnout.',
  },
  {
    id: '5',
    category: 'Gestures',
    question: 'What gestures are supported across screens?',
    answer:
      'You can swipe cards horizontally to toggle completion or delete, pull down to refresh the AI daily briefing, and tap the floating glowing plus button from any screen to quick-add items.',
  },
  {
    id: '6',
    category: 'Privacy',
    question: 'Are my voice audio clips stored or sold to third parties?',
    answer:
      'Never. Regius enforces a strict zero data selling architecture. Speech recognition is evaluated locally on device, and cloud sync operates with end-to-end 256-bit AES encryption.',
  },
];

type CategoryFilter = 'All' | 'Voice' | 'Tasks' | 'Gestures' | 'Privacy';

export const HelpFaqScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const { isDarkMode } = useTheme();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('All');
  const [expandedId, setExpandedId] = useState<string | null>('1');

  const categories: CategoryFilter[] = [
    'All',
    'Voice',
    'Tasks',
    'Gestures',
    'Privacy',
  ];

  const filteredFaqs = FAQS.filter(item => {
    const matchesCategory =
      activeCategory === 'All' || item.category === activeCategory;
    const matchesQuery =
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  const toggleExpand = (id: string) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  const handleContactConcierge = () => {
    Linking.openURL(
      'mailto:concierge@regius.ai?subject=Regius%20Inquiry',
    ).catch(() => {
      Toast.show({
        type: 'info',
        text1: 'Concierge Email',
        text2: 'Reach our team directly at concierge@regius.ai',
      });
    });
  };

  const bgMain = isDarkMode ? '#121417' : Colors.CreamBackground;
  const cardBg = isDarkMode ? '#1E2228' : Colors.DefaultWhite;
  const textPrimary = isDarkMode
    ? Colors.PureWhiteText
    : Colors.MidnightInkText;
  const textSecondary = isDarkMode ? '#A3A8B1' : Colors.SubtitleGray;
  const borderLight = isDarkMode ? '#2C3035' : '#E8E2D5';
  const surfaceAlt = isDarkMode ? '#171A1F' : '#FAF8F5';

  return (
    <View style={[styles.container, { backgroundColor: bgMain }]}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        {...(Platform.OS === 'android' ? { backgroundColor: bgMain } : {})}
      />

      {/* Screen Header */}
      <View
        style={[
          styles.headerRow,
          {
            paddingTop: insets.top + 8,
            borderBottomColor: borderLight,
          },
        ]}
      >
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => navigation.goBack()}
          style={[
            styles.backButton,
            {
              backgroundColor: cardBg,
              borderColor: borderLight,
            },
          ]}
          accessibilityRole="button"
          accessibilityLabel="Back to Settings"
        >
          <ChevronLeft size={20} color={textPrimary} strokeWidth={2.4} />
        </TouchableOpacity>

        <View style={styles.headerTitleWrap}>
          <Text style={[styles.headerTitle, { color: textPrimary }]}>
            Help & FAQs
          </Text>
          <Text style={[styles.headerSubtitle, { color: textSecondary }]}>
            Guides & Concierge Support
          </Text>
        </View>

        <Badge label="SUPPORT" variant="green" size="sm" />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 40 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Search Bar */}
        <View
          style={[
            styles.searchWrap,
            { backgroundColor: surfaceAlt, borderColor: borderLight },
          ]}
        >
          <Search size={18} color={textSecondary} strokeWidth={2.2} />
          <TextInput
            style={[styles.searchInput, { color: textPrimary }]}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search guides, gestures, commands..."
            placeholderTextColor={textSecondary}
          />
        </View>

        {/* Category Pills */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryPillsRow}
        >
          {categories.map(cat => {
            const isActive = activeCategory === cat;
            return (
              <TouchableOpacity
                key={cat}
                activeOpacity={0.8}
                style={[
                  styles.categoryPill,
                  {
                    backgroundColor: isActive ? Colors.LavenderPurple : cardBg,
                    borderColor: isActive ? '#FFFFFF' : borderLight,
                  },
                ]}
                onPress={() => setActiveCategory(cat)}
              >
                <Text
                  style={[
                    styles.categoryPillText,
                    { color: isActive ? '#FFFFFF' : textPrimary },
                  ]}
                >
                  {cat}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* FAQ Accordion Section */}
        <Text style={[styles.sectionHeading, { color: textSecondary }]}>
          FREQUENTLY ASKED QUESTIONS ({filteredFaqs.length})
        </Text>

        <View style={styles.faqList}>
          {filteredFaqs.map(item => {
            const isExpanded = expandedId === item.id;

            return (
              <View
                key={item.id}
                style={[
                  styles.faqCard,
                  {
                    backgroundColor: cardBg,
                    borderColor: isExpanded
                      ? Colors.LavenderPurple
                      : isDarkMode
                      ? 'rgba(255, 255, 255, 0.12)'
                      : '#FFFFFF',
                    borderBottomColor: isExpanded
                      ? '#4D4DB8'
                      : isDarkMode
                      ? '#171A20'
                      : '#E2DCD0',
                    shadowColor: isExpanded
                      ? Colors.LavenderPurple
                      : isDarkMode
                      ? '#000000'
                      : 'rgba(131, 131, 214, 0.12)',
                  },
                ]}
              >
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
                      { backgroundColor: surfaceAlt, borderColor: borderLight },
                    ]}
                  >
                    {isExpanded ? (
                      <ChevronUp
                        size={16}
                        color={Colors.LavenderPurple}
                        strokeWidth={2.4}
                      />
                    ) : (
                      <ChevronDown
                        size={16}
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
                  </View>
                )}
              </View>
            );
          })}
        </View>

        {/* Concierge Support Bento */}
        <View
          style={[
            styles.conciergeCard,
            {
              backgroundColor: cardBg,
              borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.12)' : '#FFFFFF',
              borderBottomColor: isDarkMode ? '#171A20' : '#E2DCD0',
              shadowColor: isDarkMode ? '#000000' : 'rgba(131, 131, 214, 0.14)',
            },
          ]}
        >
          <View style={styles.conciergeTopRow}>
            <View
              style={[
                styles.conciergeIconWrap,
                { backgroundColor: isDarkMode ? '#2C3035' : '#EFF2FE' },
              ]}
            >
              <MessageSquare
                size={22}
                color={Colors.LavenderPurple}
                strokeWidth={2.2}
              />
            </View>
            <View style={styles.conciergeMeta}>
              <View style={styles.conciergeTitleRow}>
                <Text style={[styles.conciergeTitle, { color: textPrimary }]}>
                  Regius Concierge Support
                </Text>
                <ProBadge size="sm" />
              </View>
              <Text style={[styles.conciergeDesc, { color: textSecondary }]}>
                Direct access to our senior engineering & product team. Average
                response time under 2 hours.
              </Text>
            </View>
          </View>

          <TouchableOpacity
            activeOpacity={0.8}
            style={[
              styles.contactBtn,
              { backgroundColor: Colors.MidnightCharcoal },
            ]}
            onPress={handleContactConcierge}
          >
            <Mail size={16} color="#FFFFFF" strokeWidth={2.2} />
            <Text style={styles.contactBtnText}>Contact Concierge Desk</Text>
          </TouchableOpacity>
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
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: ResponsivePixels.size16,
    paddingBottom: ResponsivePixels.size12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitleWrap: {
    alignItems: 'center',
  },
  headerTitle: {
    ...Typography.h5SemiBold,
    fontFamily: Fonts.ranade.bold,
    fontSize: 18,
  },
  headerSubtitle: {
    ...Typography.bodySuperSmallPoppinsRegularLoose,
    fontSize: 11,
    marginTop: 2,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: ResponsivePixels.size16,
    paddingTop: ResponsivePixels.size16,
  },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1.5,
    paddingHorizontal: 12,
    height: 46,
    gap: 8,
    marginBottom: ResponsivePixels.size14,
  },
  searchInput: {
    flex: 1,
    fontFamily: Fonts.poppins.regular,
    fontSize: 13,
    padding: 0,
  },
  categoryPillsRow: {
    gap: 8,
    paddingBottom: ResponsivePixels.size16,
  },
  categoryPill: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 18,
    borderWidth: 1,
  },
  categoryPillText: {
    fontFamily: Fonts.poppins.medium,
    fontSize: 12,
  },
  sectionHeading: {
    ...Typography.bodySuperSmallPoppinsRegularLoose,
    fontFamily: Fonts.poppins.semiBold,
    fontSize: 11,
    letterSpacing: 1,
    marginBottom: ResponsivePixels.size10,
    marginLeft: 4,
  },
  faqList: {
    gap: 12,
    marginBottom: ResponsivePixels.size24,
  },
  faqCard: {
    borderRadius: 18,
    borderWidth: 1.5,
    borderBottomWidth: 3.5,
    padding: ResponsivePixels.size14,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  faqHeaderBtn: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
  },
  faqHeaderLeft: {
    flex: 1,
  },
  faqQuestionText: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: 14,
    lineHeight: 20,
    marginTop: 6,
  },
  chevronWrap: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  faqAnswerWrap: {
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  faqAnswerText: {
    ...Typography.bodySmallPoppinsRegular,
    fontSize: 13,
    lineHeight: 20,
  },
  conciergeCard: {
    borderRadius: 20,
    borderWidth: 1,
    borderBottomWidth: 3,
    padding: ResponsivePixels.size16,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
    marginBottom: ResponsivePixels.size24,
  },
  conciergeTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: ResponsivePixels.size16,
  },
  conciergeIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  conciergeMeta: {
    flex: 1,
  },
  conciergeTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  conciergeTitle: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: 15,
  },
  conciergeDesc: {
    ...Typography.bodySuperSmallPoppinsRegularLoose,
    fontSize: 11,
    lineHeight: 16,
  },
  contactBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 44,
    borderRadius: 22,
    gap: 8,
  },
  contactBtnText: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: 13,
    color: '#FFFFFF',
  },
});
