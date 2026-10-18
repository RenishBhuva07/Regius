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

  const buttonBg = theme.isDarkMode
    ? 'rgba(255, 255, 255, 0.08)'
    : 'rgba(0, 0, 0, 0.05)';
  const buttonBorder = theme.isDarkMode
    ? 'rgba(255, 255, 255, 0.12)'
    : 'rgba(0, 0, 0, 0.08)';

  return (
    <View style={styles.header}>
      {/* 1. Left: Settings Navigation Action */}
      <Pressable
        onPress={handleOpenSettings}
        style={({ pressed }) => [
          styles.circleBtn,
          {
            backgroundColor: buttonBg,
            borderColor: buttonBorder,
            opacity: pressed ? 0.75 : 1,
          },
        ]}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        accessibilityRole="button"
        accessibilityLabel="Open settings"
      >
        <Settings size={19} color={theme.textPrimary} strokeWidth={2.2} />
      </Pressable>

      {/* 2. Center: Application Identity */}
      <View style={styles.centerIdentity}>
        <Text style={[styles.identityTitle, { color: theme.textPrimary }]}>
          {assistantName.toUpperCase()}
        </Text>
      </View>

      {/* 3. Right: Quick Suggestions / Conversation Action */}
      <Pressable
        onPress={onToggleSuggestions}
        style={({ pressed }) => [
          styles.circleBtn,
          {
            backgroundColor: buttonBg,
            borderColor: buttonBorder,
            opacity: pressed ? 0.75 : 1,
          },
        ]}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        accessibilityRole="button"
        accessibilityLabel="Toggle suggestions"
      >
        <Sparkles size={19} color={theme.accent} strokeWidth={2.2} />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    width: '100%',
  },
  circleBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerIdentity: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  identityTitle: {
    fontFamily: Fonts.bold,
    fontSize: 15,
    letterSpacing: 1.4,
    fontWeight: '700',
  },
});

export default AssistantHeader;
