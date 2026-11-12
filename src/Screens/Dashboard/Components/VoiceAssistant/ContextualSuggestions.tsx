import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Fonts } from '../../../../Theme/fonts';
import { Colors } from '../../../../Assets/StyleUtilities/Colors';
import { VoiceAssistantTheme } from './types';
import ResponsivePixels from '../../../../Assets/StyleUtilities/ResponsivePixels';

export interface ContextualSuggestionsProps {
  onSelectSuggestion: (command: string) => void;
  theme: VoiceAssistantTheme;
}

const DEFAULT_SUGGESTIONS = [
  'Add a task to play badminton',
  'Remind me to call Mom this evening',
  'Log a 20-minute meditation',
];

export const ContextualSuggestions: React.FC<ContextualSuggestionsProps> = ({
  onSelectSuggestion,
  theme,
}) => {
  return (
    <View style={styles.container}>
      <Text style={[styles.heading, { color: theme.textMuted }]}>
        SUGGESTIONS
      </Text>
      <View style={styles.suggestionsList}>
        {DEFAULT_SUGGESTIONS.map((item, index) => (
          <Pressable
            key={index}
            onPress={() => onSelectSuggestion(item)}
            style={({ pressed }) => [
              styles.pill,
              {
                backgroundColor: theme.isDarkMode
                  ? Colors.VoiceControlDarkBg
                  : Colors.VoicePromptSurface,
                borderColor: theme.cardBorder,
                opacity: pressed ? 0.75 : 1,
              },
            ]}
            accessibilityRole="button"
            accessibilityLabel={`Suggested command: ${item}`}
          >
            <Text
              style={[styles.pillText, { color: theme.textSecondary }]}
              numberOfLines={1}
            >
              &ldquo;{item}&rdquo;
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: ResponsivePixels.size20,
    marginTop: ResponsivePixels.size14,
    marginBottom: ResponsivePixels.size6,
    alignItems: 'center',
  },
  heading: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: ResponsivePixels.size11,
    letterSpacing: 0.8,
    marginBottom: ResponsivePixels.size8,
  },
  suggestionsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: ResponsivePixels.size8,
    justifyContent: 'center',
  },
  pill: {
    paddingHorizontal: ResponsivePixels.size14,
    paddingVertical: ResponsivePixels.size7,
    borderRadius: ResponsivePixels.size16,
    borderWidth: 1,
  },
  pillText: {
    fontFamily: Fonts.poppins.regular,
    fontSize: ResponsivePixels.size12,
  },
});
