import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Sliders, ShieldCheck, AlertTriangle } from 'lucide-react-native';
import { Fonts } from '../../../../Theme/fonts';
import { Colors } from '../../../../Assets/StyleUtilities/Colors';
import ResponsivePixels from '../../../../Assets/StyleUtilities/ResponsivePixels';
import { WakeWordValidationResult } from '../../../../Services/WakeWord/WakeWordService';

export interface WakeWordCustomInputProps {
  isCustomMode: boolean;
  onEnableCustomMode: () => void;
  customInput: string;
  onChangeCustomInput: (text: string) => void;
  validation: WakeWordValidationResult;
  cardBg?: string;
  isDarkMode?: boolean;
  textPrimary?: string;
  textSecondary?: string;
  borderLight?: string;
  surfaceAlt?: string;
}

export const WakeWordCustomInput: React.FC<WakeWordCustomInputProps> =
  React.memo(
    ({
      isCustomMode,
      onEnableCustomMode,
      customInput,
      onChangeCustomInput,
      validation,
      cardBg = Colors.DefaultWhite,
      isDarkMode = false,
      textPrimary = Colors.MidnightInkText,
      textSecondary = Colors.SubtitleGray,
      borderLight = '#E8E2D5',
      surfaceAlt = '#FAF8F5',
    }) => {
      return (
        <View
          style={[
            styles.customPhraseCard,
            {
              backgroundColor: cardBg,
              borderColor: isCustomMode
                ? Colors.LavenderPurple
                : isDarkMode
                ? 'rgba(255, 255, 255, 0.08)'
                : '#FFFFFF',
              borderBottomColor: isCustomMode
                ? '#4D4DB8'
                : isDarkMode
                ? '#171A20'
                : '#E2DCD0',
              shadowColor: isDarkMode ? '#000000' : 'rgba(131, 131, 214, 0.1)',
            },
          ]}
        >
          <TouchableOpacity
            activeOpacity={0.85}
            style={styles.customToggleRow}
            onPress={onEnableCustomMode}
          >
            <View style={styles.customToggleMeta}>
              <View style={styles.customTitleRow}>
                <Sliders
                  size={16}
                  color={Colors.LavenderPurple}
                  strokeWidth={2.2}
                />
                <Text style={[styles.customTitle, { color: textPrimary }]}>
                  Design Bespoke Trigger Phrase
                </Text>
              </View>
              <Text style={[styles.customSubtitle, { color: textSecondary }]}>
                Acoustic rule: 2+ words, 3+ phonetic syllables for minimal false
                positives
              </Text>
            </View>

            <View
              style={[
                styles.radioCircle,
                isCustomMode && styles.radioCircleActive,
                {
                  borderColor: isCustomMode
                    ? Colors.LavenderPurple
                    : borderLight,
                },
              ]}
            >
              {isCustomMode && (
                <View
                  style={[
                    styles.radioInner,
                    { backgroundColor: Colors.LavenderPurple },
                  ]}
                />
              )}
            </View>
          </TouchableOpacity>

          {isCustomMode && (
            <View style={styles.customInputArea}>
              <View
                style={[
                  styles.customInputWrap,
                  { backgroundColor: surfaceAlt, borderColor: borderLight },
                ]}
              >
                <TextInput
                  style={[styles.customInputField, { color: textPrimary }]}
                  value={customInput}
                  onChangeText={onChangeCustomInput}
                  placeholder="e.g. Hey Assistant, Listen Regius"
                  placeholderTextColor={textSecondary}
                  autoCapitalize="words"
                />
              </View>

              {/* Acoustic Validation Feedback Banner */}
              <View style={styles.validationRow}>
                {validation.isValid ? (
                  <View style={styles.validStatus}>
                    <ShieldCheck size={16} color="#21AF85" strokeWidth={2.4} />
                    <Text style={styles.validText}>
                      Acoustic criteria met (Syllables & length optimal)
                    </Text>
                  </View>
                ) : (
                  <View style={styles.invalidStatus}>
                    <AlertTriangle
                      size={16}
                      color="#FF3B30"
                      strokeWidth={2.4}
                    />
                    <Text style={styles.invalidText}>
                      {validation.error || 'Invalid candidate phrase'}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          )}
        </View>
      );
    },
  );

const styles = StyleSheet.create({
  customPhraseCard: {
    marginHorizontal: ResponsivePixels.size16,
    borderRadius: 20,
    borderWidth: 1.5,
    borderBottomWidth: 3.5,
    padding: ResponsivePixels.size16,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
    marginBottom: ResponsivePixels.size24,
  },
  customToggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  customToggleMeta: {
    flex: 1,
    paddingRight: 10,
  },
  customTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  customTitle: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: 14,
  },
  customSubtitle: {
    fontFamily: Fonts.poppins.regular,
    fontSize: 11,
    marginTop: 2,
  },
  radioCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioCircleActive: {
    borderColor: Colors.LavenderPurple,
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  customInputArea: {
    marginTop: ResponsivePixels.size14,
    paddingTop: ResponsivePixels.size12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E8E2D5',
  },
  customInputWrap: {
    borderRadius: 14,
    borderWidth: 1.5,
    paddingHorizontal: 14,
    height: 48,
    justifyContent: 'center',
    marginBottom: 10,
  },
  customInputField: {
    fontFamily: Fonts.poppins.medium,
    fontSize: 14,
    padding: 0,
  },
  validationRow: {
    marginTop: 2,
  },
  validStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  validText: {
    fontFamily: Fonts.poppins.regular,
    fontSize: 11,
    color: '#21AF85',
  },
  invalidStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  invalidText: {
    fontFamily: Fonts.poppins.regular,
    fontSize: 11,
    color: '#FF3B30',
  },
});

export default WakeWordCustomInput;
