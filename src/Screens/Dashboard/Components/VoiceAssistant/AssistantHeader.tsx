import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Settings, Sparkles } from 'lucide-react-native';
import { Fonts } from '../../../../Theme/fonts';
import { VoiceAssistantTheme } from './types';
import { VoiceAssistantState } from '../../../../Services/Voice/VoiceStateMachine';

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

  const buttonBg = theme.isDarkMode ? 'rgba(255, 255, 255, 0.08)' : '#FFFFFF';
  const buttonBorder = theme.isDarkMode
    ? 'rgba(255, 255, 255, 0.16)'
    : '#FFFFFF';
  const buttonBottomBorder = theme.isDarkMode
    ? 'rgba(0, 0, 0, 0.5)'
    : '#D5D0C5';

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
            shadowColor: theme.isDarkMode ? '#000000' : '#8383D6',
          },
        ]}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        accessibilityRole="button"
        accessibilityLabel="Open settings"
      >
        <Settings size={18} color={theme.textPrimary} strokeWidth={2.2} />
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
            shadowColor: theme.isDarkMode ? '#000000' : '#8383D6',
          },
        ]}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        accessibilityRole="button"
        accessibilityLabel="Toggle suggestions"
      >
        <Sparkles size={18} color={theme.accent} strokeWidth={2.2} />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 22,
    paddingVertical: 10,
    width: '100%',
    zIndex: 10,
  },
  circleBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
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
    fontSize: 16,
    letterSpacing: 2.2,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4.5,
    marginTop: 2,
  },
  statusDot: {
    width: 5.5,
    height: 5.5,
    borderRadius: 3,
    backgroundColor: '#10B981',
  },
  statusText: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: 9,
    letterSpacing: 0.8,
  },
});

export default AssistantHeader;
