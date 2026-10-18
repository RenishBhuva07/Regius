import React from 'react';
import { View, StyleSheet } from 'react-native';
import {
  SiaHolographicOrb,
  DEFAULT_HOLOGRAPHIC_ORB_SIZE,
} from '../SiaHolographicOrb';
import { VoiceAssistantState } from '../../../../Services/Voice/VoiceStateMachine';
import { VoiceAssistantTheme } from './types';

export interface AssistantOrbProps {
  state: VoiceAssistantState;
  size?: number;
  onPress?: () => void;
  disabled?: boolean;
  theme?: VoiceAssistantTheme;
}

export const AssistantOrb: React.FC<AssistantOrbProps> = ({
  state,
  size = DEFAULT_HOLOGRAPHIC_ORB_SIZE,
  onPress,
  disabled = false,
  theme,
}) => {
  return (
    <View style={styles.container}>
      <SiaHolographicOrb
        state={state}
        size={size}
        onPress={onPress}
        disabled={disabled}
        accentColor={theme?.accent}
        isDarkMode={theme?.isDarkMode}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 4,
  },
});

export default AssistantOrb;
