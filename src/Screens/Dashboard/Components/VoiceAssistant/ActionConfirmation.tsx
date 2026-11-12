import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Check } from 'lucide-react-native';
import { Fonts } from '../../../../Theme/fonts';
import { Colors } from '../../../../Assets/StyleUtilities/Colors';
import { VoiceAssistantTheme } from './types';
import ResponsivePixels from '../../../../Assets/StyleUtilities/ResponsivePixels';

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
        <Check size={ResponsivePixels.size18} color={Colors.PureWhite} strokeWidth={3} />
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
    paddingVertical: ResponsivePixels.size14,
    paddingHorizontal: ResponsivePixels.size16,
    width: '100%',
  },
  checkBadge: {
    width: ResponsivePixels.size36,
    height: ResponsivePixels.size36,
    borderRadius: ResponsivePixels.size18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: ResponsivePixels.size10,
  },
  title: {
    fontFamily: Fonts.ranade.bold,
    fontSize: ResponsivePixels.size18,
    lineHeight: ResponsivePixels.size24,
    textAlign: 'center',
    marginBottom: ResponsivePixels.size4,
  },
  detail: {
    fontFamily: Fonts.poppins.regular,
    fontSize: ResponsivePixels.size13,
    lineHeight: ResponsivePixels.size19,
    textAlign: 'center',
  },
});
