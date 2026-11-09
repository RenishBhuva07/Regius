import React, { useState, useMemo, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Platform,
  Vibration,
} from 'react-native';
import { Crown, Sparkles } from 'lucide-react-native';
import Svg, {
  Defs,
  LinearGradient,
  RadialGradient,
  Stop,
  Rect,
} from 'react-native-svg';

import { Fonts } from '../../../Theme/fonts';
import ResponsivePixels from '../../../Assets/StyleUtilities/ResponsivePixels';
import { useTheme } from '../../../Theme/ThemeContext';

export interface HabitPhilosophyKeepsakeCardProps {
  category: 'morning' | 'evening' | 'mindful' | string;
  accentColor: string;
}

interface QuoteItem {
  quote: string;
  author: string;
  era: string;
}

const QUOTE_LIBRARY: Record<string, QuoteItem[]> = {
  morning: [
    {
      quote:
        'When you arise in the morning think of what a privilege it is to be alive, to breathe, to enjoy, to love.',
      author: 'Marcus Aurelius',
      era: 'Meditations · Roman Stoic',
    },
    {
      quote:
        'The secret of your future is hidden in your daily routine. Own the dawn, conquer the horizon.',
      author: 'Aristotle',
      era: 'Nicomachean Ethics',
    },
    {
      quote:
        'Light tomorrow with today. The first hour of the morning is the rudder of the day.',
      author: 'Henry Ward Beecher',
      era: 'Dawn Circadian Philosophy',
    },
  ],
  evening: [
    {
      quote:
        'When the light has been removed, I examine my entire day and go back over what I have done and said.',
      author: 'Seneca',
      era: 'Moral Letters to Lucilius',
    },
    {
      quote:
        'Consistent evening reflection restores clarity and pre-aligns tomorrow’s victories before sleep.',
      author: 'Regius Codex',
      era: 'Mindful Evening Architecture',
    },
    {
      quote:
        'Silence is safer than speech. Settle your mind before dusk and let the subconscious build.',
      author: 'Epictetus',
      era: 'Discourses & Enchiridion',
    },
  ],
  mindful: [
    {
      quote:
        'We are what we repeatedly do. Excellence, then, is not an act, but a sacred daily habit.',
      author: 'Aristotle',
      era: 'Classical Stoic Principles',
    },
    {
      quote:
        'You do not rise to the level of your goals. You fall to the level of your systems.',
      author: 'James Clear',
      era: 'Atomic Habit Discipline',
    },
    {
      quote:
        'Mastering others is strength. Mastering yourself is true power. One breath, one ritual.',
      author: 'Lao Tzu',
      era: 'Tao Te Ching',
    },
  ],
};

/**
 * Artisanal Keepsake Manuscript Background Svg
 */
const ManuscriptBackgroundSvg: React.FC<{
  accentColor: string;
  isDark: boolean;
}> = React.memo(({ accentColor, isDark }) => (
  <View style={StyleSheet.absoluteFill} pointerEvents="none">
    <Svg width="100%" height="100%" preserveAspectRatio="none">
      <Defs>
        <LinearGradient id="keepsakeBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop
            offset="0%"
            stopColor={isDark ? '#1B1E28' : '#FFFDF5'}
            stopOpacity={isDark ? 0.98 : 0.99}
          />
          <Stop
            offset="50%"
            stopColor={isDark ? '#141720' : '#FAF5E8'}
            stopOpacity={isDark ? 0.95 : 0.97}
          />
          <Stop
            offset="100%"
            stopColor={isDark ? '#0F1017' : '#F5ECE0'}
            stopOpacity={isDark ? 0.99 : 0.99}
          />
        </LinearGradient>

        <RadialGradient id="parchmentAura" cx="50%" cy="40%" rx="70%" ry="60%">
          <Stop
            offset="0%"
            stopColor={accentColor}
            stopOpacity={isDark ? 0.15 : 0.08}
          />
          <Stop offset="65%" stopColor={accentColor} stopOpacity={0.02} />
          <Stop offset="100%" stopColor="#000000" stopOpacity={0} />
        </RadialGradient>
      </Defs>

      <Rect
        width="100%"
        height="100%"
        rx={ResponsivePixels.size22}
        ry={ResponsivePixels.size22}
        fill="url(#keepsakeBg)"
      />
      <Rect
        width="100%"
        height="100%"
        rx={ResponsivePixels.size22}
        ry={ResponsivePixels.size22}
        fill="url(#parchmentAura)"
      />
    </Svg>
  </View>
));

export const HabitPhilosophyKeepsakeCard: React.FC<HabitPhilosophyKeepsakeCardProps> =
  React.memo(({ category, accentColor }) => {
    const { isDarkMode } = useTheme();

    const quotes = useMemo(() => {
      const cat = (category || 'mindful').toLowerCase();
      return QUOTE_LIBRARY[cat] || QUOTE_LIBRARY.mindful;
    }, [category]);

    const [currentIndex, setCurrentIndex] = useState(0);
    const fadeAnim = useRef(new Animated.Value(1)).current;
    const rotateAnim = useRef(new Animated.Value(0)).current;

    const currentQuote = quotes[currentIndex % quotes.length];

    const handleShuffle = useCallback(() => {
      Vibration.vibrate(20);

      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 350,
        useNativeDriver: true,
      }).start(() => {
        rotateAnim.setValue(0);
      });

      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 140,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 220,
          useNativeDriver: true,
        }),
      ]).start();

      setCurrentIndex(prev => (prev + 1) % quotes.length);
    }, [fadeAnim, rotateAnim, quotes.length]);

    const spin = rotateAnim.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '180deg'],
    });

    return (
      <View style={styles.shadowOuter}>
        <View
          style={[
            styles.keepsakeCard,
            isDarkMode && styles.keepsakeCardDark,
            { borderColor: isDarkMode ? '#2B2F3D' : '#E8DFCE' },
          ]}
        >
          <ManuscriptBackgroundSvg
            accentColor={accentColor}
            isDark={isDarkMode}
          />

          {/* Regal Wax Seal Floating Crest Disc */}
          <View style={styles.waxSealDisc}>
            <Crown
              size={ResponsivePixels.size13}
              color="#B47804"
              strokeWidth={2.4}
            />
          </View>

          {/* Large Translucent Watermark Quotation Mark */}
          <Text
            style={[
              styles.watermarkQuoteMark,
              {
                color: isDarkMode
                  ? 'rgba(255,255,255,0.04)'
                  : 'rgba(180, 120, 4, 0.08)',
              },
            ]}
          >
            “
          </Text>

          {/* Animated Quote Content */}
          <Animated.View style={[styles.quoteBodyWrap, { opacity: fadeAnim }]}>
            <Text
              style={[
                styles.editorialQuoteText,
                isDarkMode && styles.editorialQuoteTextDark,
              ]}
            >
              “{currentQuote.quote}”
            </Text>

            <View style={styles.attributionRow}>
              <View style={styles.authorBadgeWrap}>
                <Text
                  style={[
                    styles.authorName,
                    isDarkMode && styles.authorNameDark,
                  ]}
                  numberOfLines={1}
                >
                  {currentQuote.author}
                </Text>
                <Text
                  style={styles.authorEra}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {currentQuote.era}
                </Text>
              </View>

              {/* Interactive Shuffle Pill Button */}
              <TouchableOpacity
                activeOpacity={0.75}
                onPress={handleShuffle}
                style={[
                  styles.shuffleButton,
                  isDarkMode && styles.shuffleButtonDark,
                ]}
                accessibilityRole="button"
                accessibilityLabel="Shuffle philosophy wisdom quote"
              >
                <Animated.View style={{ transform: [{ rotate: spin }] }}>
                  <Sparkles
                    size={ResponsivePixels.size11}
                    color={isDarkMode ? '#F5C518' : '#B47804'}
                    strokeWidth={2.4}
                  />
                </Animated.View>
                <Text
                  style={[
                    styles.shuffleText,
                    isDarkMode && styles.shuffleTextDark,
                  ]}
                >
                  Inspire
                </Text>
              </TouchableOpacity>
            </View>
          </Animated.View>

          {/* Bottom Codex Stamping */}
          <View style={styles.codexStampRow}>
            <View
              style={[
                styles.stampDivider,
                isDarkMode && styles.stampDividerDark,
              ]}
            />
            <Text style={styles.codexStampText}>
              MINDFUL RITUAL ARCHITECTURE · REGIUS CODEX
            </Text>
            <View
              style={[
                styles.stampDivider,
                isDarkMode && styles.stampDividerDark,
              ]}
            />
          </View>
        </View>
      </View>
    );
  });

const styles = StyleSheet.create({
  shadowOuter: {
    width: '100%',
    borderRadius: ResponsivePixels.size22,
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.12,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
    marginBottom: ResponsivePixels.size8,
  },
  keepsakeCard: {
    position: 'relative',
    backgroundColor: '#FAF7EE',
    borderRadius: ResponsivePixels.size22,
    borderWidth: 1.5,
    paddingHorizontal: ResponsivePixels.size16,
    paddingTop: ResponsivePixels.size24,
    paddingBottom: ResponsivePixels.size14,
    overflow: 'hidden',
    alignItems: 'center',
    gap: ResponsivePixels.size12,
  },
  keepsakeCardDark: {
    backgroundColor: '#161922',
  },
  waxSealDisc: {
    position: 'absolute',
    top: -1,
    alignSelf: 'center',
    width: ResponsivePixels.size32,
    height: ResponsivePixels.size20,
    borderBottomLeftRadius: ResponsivePixels.size16,
    borderBottomRightRadius: ResponsivePixels.size16,
    backgroundColor: '#FFF8D0',
    borderWidth: 1,
    borderTopWidth: 0,
    borderColor: '#FFFFFF',
    borderBottomColor: '#DEAA14',
    borderBottomWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#D97706',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  watermarkQuoteMark: {
    position: 'absolute',
    top: ResponsivePixels.size6,
    left: ResponsivePixels.size16,
    fontFamily: Fonts.ranade.bold,
    fontSize: ResponsivePixels.size72,
    lineHeight: ResponsivePixels.size72,
    pointerEvents: 'none',
  },
  quoteBodyWrap: {
    width: '100%',
    alignItems: 'center',
    gap: ResponsivePixels.size12,
    zIndex: 2,
  },
  editorialQuoteText: {
    fontFamily: Fonts.ranade.medium,
    fontSize: ResponsivePixels.size13,
    lineHeight: ResponsivePixels.size20,
    color: '#34322C',
    textAlign: 'center',
    fontStyle: 'italic',
    paddingHorizontal: ResponsivePixels.size8,
  },
  editorialQuoteTextDark: {
    color: '#E0E3EC',
  },
  attributionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: ResponsivePixels.size4,
  },
  authorBadgeWrap: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: ResponsivePixels.size2,
    flex: 1,
    marginRight: ResponsivePixels.size10,
  },
  authorName: {
    fontFamily: Fonts.poppins.bold,
    fontSize: ResponsivePixels.size12,
    color: '#1B1C19',
    letterSpacing: 0.2,
  },
  authorNameDark: {
    color: '#FFFFFF',
  },
  authorEra: {
    fontFamily: Fonts.poppins.regular,
    fontSize: ResponsivePixels.size9,
    color: '#8E95A5',
  },
  shuffleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ResponsivePixels.size4,
    backgroundColor: '#FFF2D6',
    paddingHorizontal: ResponsivePixels.size10,
    paddingVertical: ResponsivePixels.size5,
    borderRadius: ResponsivePixels.size14,
    borderWidth: 1,
    borderColor: '#FFE099',
    flexShrink: 0,
  },
  shuffleButtonDark: {
    backgroundColor: 'rgba(245, 197, 24, 0.15)',
    borderColor: 'rgba(245, 197, 24, 0.3)',
  },
  shuffleText: {
    fontFamily: Fonts.poppins.bold,
    fontSize: ResponsivePixels.size9,
    color: '#B47804',
    letterSpacing: 0.4,
  },
  shuffleTextDark: {
    color: '#F5C518',
  },
  codexStampRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    gap: ResponsivePixels.size8,
    marginTop: ResponsivePixels.size2,
  },
  stampDivider: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.08)',
  },
  stampDividerDark: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  codexStampText: {
    fontFamily: Fonts.poppins.bold,
    fontSize: ResponsivePixels.size8,
    color: '#9E9A90',
    letterSpacing: 0.8,
  },
});

export default HabitPhilosophyKeepsakeCard;
