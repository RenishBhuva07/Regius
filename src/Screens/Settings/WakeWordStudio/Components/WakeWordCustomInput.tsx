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
import { Colors, withAlpha } from '../../../../Assets/StyleUtilities/Colors';
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
      cardBg = Colors.PureWhite,
      isDarkMode = false,
      textPrimary = Colors.PureBlack,
      textSecondary = Colors.SubtitleGray,
      borderLight = Colors.RingBorder,
      surfaceAlt = Colors.CreamSurfaceAlt,
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
                ? withAlpha(Colors.PureWhite, 0.08)
                : Colors.PureWhite,
              borderBottomColor: isCustomMode
                ? Colors.LavenderDeepFallback
                : isDarkMode
                ? Colors.DarkSurfaceDeep
                : Colors.WarmStoneBorder,
              shadowColor: isDarkMode
                ? Colors.PureBlack
                : withAlpha(Colors.LavenderPurple, 0.1),
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
                  size={ResponsivePixels.size16}
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
                    <ShieldCheck
                      size={ResponsivePixels.size16}
                      color={Colors.LuminousGreen}
                      strokeWidth={2.4}
                    />
                    <Text style={styles.validText}>
                      Acoustic criteria met (Syllables & length optimal)
                    </Text>
                  </View>
                ) : (
                  <View style={styles.invalidStatus}>
                    <AlertTriangle
                      size={ResponsivePixels.size16}
                      color={Colors.CrimsonPulse}
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
    borderRadius: ResponsivePixels.size20,
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
    paddingRight: ResponsivePixels.size10,
  },
  customTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ResponsivePixels.size6,
    marginBottom: ResponsivePixels.size2,
  },
  customTitle: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: ResponsivePixels.size14,
  },
  customSubtitle: {
    fontFamily: Fonts.poppins.regular,
    fontSize: ResponsivePixels.size11,
    marginTop: ResponsivePixels.size2,
  },
  radioCircle: {
    width: ResponsivePixels.size22,
    height: ResponsivePixels.size22,
    borderRadius: ResponsivePixels.size11,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioCircleActive: {
    borderColor: Colors.LavenderPurple,
  },
  radioInner: {
    width: ResponsivePixels.size12,
    height: ResponsivePixels.size12,
    borderRadius: ResponsivePixels.size6,
  },
  customInputArea: {
    marginTop: ResponsivePixels.size14,
    paddingTop: ResponsivePixels.size12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.RingBorder,
  },
  customInputWrap: {
    borderRadius: ResponsivePixels.size14,
    borderWidth: 1.5,
    paddingHorizontal: ResponsivePixels.size14,
    height: ResponsivePixels.size48,
    justifyContent: 'center',
    marginBottom: ResponsivePixels.size10,
  },
  customInputField: {
    fontFamily: Fonts.poppins.medium,
    fontSize: ResponsivePixels.size14,
    padding: 0,
  },
  validationRow: {
    marginTop: ResponsivePixels.size2,
  },
  validStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ResponsivePixels.size6,
  },
  validText: {
    fontFamily: Fonts.poppins.regular,
    fontSize: ResponsivePixels.size11,
    color: Colors.LuminousGreen,
  },
  invalidStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ResponsivePixels.size6,
  },
  invalidText: {
    fontFamily: Fonts.poppins.regular,
    fontSize: ResponsivePixels.size11,
    color: Colors.CrimsonPulse,
  },
});

export default WakeWordCustomInput;
