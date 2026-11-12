import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Settings, Sparkles } from 'lucide-react-native';
import { Fonts } from '../../../../Theme/fonts';
import { Colors, withAlpha } from '../../../../Assets/StyleUtilities/Colors';
import { VoiceAssistantTheme } from './types';
import { VoiceAssistantState } from '../../../../Services/Voice/VoiceStateMachine';
import ResponsivePixels from '../../../../Assets/StyleUtilities/ResponsivePixels';

export interface AssistantHeaderProps {
  assistantName: string;
  state: VoiceAssistantState;
  theme: VoiceAssistantTheme;
  onClose: () => void;
  onOpenSettings?: () => void;
  onToggleSuggestions?: () => void;
}

export const AssistantHeader: React.FC<AssistantHeaderProps> = ({
  assistantName = 'Regius',
  state: _state,
  theme,
  onClose,
  onOpenSettings,
  onToggleSuggestions,
}) => {
  const handleOpenSettings = () => {
    if (onOpenSettings) {
      onOpenSettings();
    } else {
      try {
        const { navigate } = require('../../../../Navigators/Navigator');
        navigate('Settings');
      } catch {}
      onClose();
    }
  };

  const buttonBg = theme.isDarkMode
    ? withAlpha(Colors.PureWhite, 0.08)
    : Colors.PureWhite;
  const buttonBorder = theme.isDarkMode
    ? withAlpha(Colors.PureWhite, 0.16)
    : Colors.PureWhite;
  const buttonBottomBorder = theme.isDarkMode
    ? withAlpha(Colors.PureBlack, 0.5)
    : Colors.HomeIndicator;

  return (
    <View style={styles.header}>
      {/* 1. Left: Settings Navigation Action (3D Tactile Button) */}
      <Pressable
        onPress={handleOpenSettings}
        style={({ pressed }) => [
          styles.circleBtn,
          {
            backgroundColor: buttonBg,
            borderColor: buttonBorder,
            borderBottomColor: buttonBottomBorder,
            opacity: pressed ? 0.75 : 1,
            shadowColor: theme.isDarkMode
              ? Colors.PureBlack
              : Colors.LavenderPurple,
          },
        ]}
        hitSlop={{ top: ResponsivePixels.size10, bottom: ResponsivePixels.size10, left: ResponsivePixels.size10, right: ResponsivePixels.size10 }}
        accessibilityRole="button"
        accessibilityLabel="Open settings"
      >
        <Settings size={ResponsivePixels.size18} color={theme.textPrimary} strokeWidth={2.2} />
      </Pressable>

      {/* 2. Center: Luxury Brand Identity & Status Dot */}
      <View style={styles.centerIdentity}>
        <Text style={[styles.identityTitle, { color: theme.textPrimary }]}>
          {assistantName.toUpperCase()}
        </Text>
        <View style={styles.statusPill}>
          <View style={styles.statusDot} />
          <Text style={[styles.statusText, { color: theme.textSecondary }]}>
            NEURAL ASSISTANT
          </Text>
        </View>
      </View>

      {/* 3. Right: Quick Suggestions / Conversation Action (3D Tactile Button) */}
      <Pressable
        onPress={onToggleSuggestions}
        style={({ pressed }) => [
          styles.circleBtn,
          {
            backgroundColor: buttonBg,
            borderColor: buttonBorder,
            borderBottomColor: buttonBottomBorder,
            opacity: pressed ? 0.75 : 1,
            shadowColor: theme.isDarkMode
              ? Colors.PureBlack
              : Colors.LavenderPurple,
          },
        ]}
        hitSlop={{ top: ResponsivePixels.size10, bottom: ResponsivePixels.size10, left: ResponsivePixels.size10, right: ResponsivePixels.size10 }}
        accessibilityRole="button"
        accessibilityLabel="Toggle suggestions"
      >
        <Sparkles size={ResponsivePixels.size18} color={theme.accent} strokeWidth={2.2} />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: ResponsivePixels.size22,
    paddingVertical: ResponsivePixels.size10,
    width: '100%',
    zIndex: 10,
  },
  circleBtn: {
    width: ResponsivePixels.size44,
    height: ResponsivePixels.size44,
    borderRadius: ResponsivePixels.size22,
    borderWidth: 1.2,
    borderBottomWidth: 2.2,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 3,
  },
  centerIdentity: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  identityTitle: {
    fontFamily: Fonts.ranade.bold,
    fontSize: ResponsivePixels.size16,
    letterSpacing: 2.2,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ResponsivePixels.size4_5,
    marginTop: ResponsivePixels.size2,
  },
  statusDot: {
    width: ResponsivePixels.size5_5,
    height: ResponsivePixels.size5_5,
    borderRadius: ResponsivePixels.size3,
    backgroundColor: Colors.ToastSuccessAccent,
  },
  statusText: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: ResponsivePixels.size9,
    letterSpacing: 0.8,
  },
});

export default AssistantHeader;
