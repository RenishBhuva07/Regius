import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Check } from 'lucide-react-native';
import { Fonts } from '../../../../Theme/fonts';
import { VoiceAssistantTheme } from './types';

export interface ActionConfirmationProps {
  title?: string | null;
  body?: string | null;
  resultSummary?: string | null;
  theme: VoiceAssistantTheme;
}

export const ActionConfirmation: React.FC<ActionConfirmationProps> = ({
  title,
  body,
  resultSummary,
  theme,
}) => {
  const displayTitle = title || 'Task Added';
  const displayDetail = body || resultSummary;

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.checkBadge,
          { backgroundColor: theme.success },
        ]}
      >
        <Check size={18} color="#FFFFFF" strokeWidth={3} />
      </View>

      <Text
        style={[styles.title, { color: theme.textPrimary }]}
        numberOfLines={2}
        accessibilityRole="header"
      >
        {displayTitle}
      </Text>

      {displayDetail ? (
        <Text
          style={[styles.detail, { color: theme.textSecondary }]}
          numberOfLines={2}
        >
          {displayDetail}
        </Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    width: '100%',
  },
  checkBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  title: {
    fontFamily: Fonts.ranade.bold,
    fontSize: 18,
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 4,
  },
  detail: {
    fontFamily: Fonts.poppins.regular,
    fontSize: 13,
    lineHeight: 19,
    textAlign: 'center',
  },
});
