import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Fonts } from '../../../../Theme/fonts';
import ResponsivePixels from '../../../../Assets/StyleUtilities/ResponsivePixels';
import Colors, { withAlpha } from '../../../../Assets/StyleUtilities/Colors';
import { Badge } from '../../../../Common/Badge';
import { WakeWordTestResult } from '../../../../Services/WakeWord/WakeWordService';

export const DEFAULT_SAMPLE_TEST_CHIPS = [
  'Hey Regius add a task',
  'Hey Regius morning brief',
  'Sia what is on my calendar',
  'Regius start focus session',
];

export interface WakeWordTesterProps {
  testTranscript: string;
  onChangeTestTranscript: (text: string) => void;
  targetPhrase: string;
  testResult: WakeWordTestResult;
  sampleChips?: string[];
  cardBg?: string;
  isDarkMode?: boolean;
  textPrimary?: string;
  textSecondary?: string;
  borderLight?: string;
  surfaceAlt?: string;
}

export const WakeWordTester: React.FC<WakeWordTesterProps> = React.memo(
  ({
    testTranscript,
    onChangeTestTranscript,
    targetPhrase,
    testResult,
    sampleChips = DEFAULT_SAMPLE_TEST_CHIPS,
    cardBg = Colors.PureWhite,
    isDarkMode = false,
    textPrimary = Colors.RegiusInk,
    textSecondary = Colors.Grey,
    borderLight = Colors.RingBorder,
    surfaceAlt = Colors.CreamSurfaceAlt,
  }) => {
    return (
      <View
        style={[
          styles.simulatorCard,
          {
            backgroundColor: cardBg,
            borderColor: isDarkMode
              ? withAlpha(Colors.PureWhite, 0.08)
              : Colors.PureWhite,
            borderBottomColor: isDarkMode
              ? Colors.DarkSurfaceDeep
              : Colors.WarmStoneBorder,
            shadowColor: isDarkMode
              ? Colors.PureBlack
              : withAlpha(Colors.LavenderPurple, 0.1),
          },
        ]}
      >
        <Text style={[styles.simulatorLabel, { color: textSecondary }]}>
          Test spoken input transcript:
        </Text>

        <View
          style={[
            styles.simulatorInputWrap,
            { backgroundColor: surfaceAlt, borderColor: borderLight },
          ]}
        >
          <TextInput
            style={[styles.simulatorInput, { color: textPrimary }]}
            value={testTranscript}
            onChangeText={onChangeTestTranscript}
            placeholder="e.g. Hey Regius add a task"
            placeholderTextColor={textSecondary}
          />
        </View>

        {/* Quick Sample Chips */}
        <View style={styles.sampleChipsContainer}>
          {sampleChips.map(chip => (
            <TouchableOpacity
              key={chip}
              activeOpacity={0.7}
              style={[
                styles.sampleChip,
                {
                  backgroundColor:
                    testTranscript === chip
                      ? isDarkMode
                        ? Colors.DarkSteelBorder
                        : Colors.TesterCreamBorder
                      : surfaceAlt,
                  borderColor: borderLight,
                },
              ]}
              onPress={() => onChangeTestTranscript(chip)}
            >
              <Text style={[styles.sampleChipText, { color: textPrimary }]}>
                "{chip}"
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Test Match Result Box */}
        <View
          style={[
            styles.testResultBox,
            {
              backgroundColor: testResult.detected
                ? isDarkMode
                  ? withAlpha(Colors.LuminousGreen, 0.15)
                  : Colors.WellnessLightBg
                : isDarkMode
                ? withAlpha(Colors.CrimsonPulse, 0.12)
                : Colors.VoiceBellaBg,
              borderColor: testResult.detected
                ? withAlpha(Colors.LuminousGreen, 0.4)
                : withAlpha(Colors.CrimsonPulse, 0.3),
            },
          ]}
        >
          <View style={styles.resultHeader}>
            <Badge
              label={testResult.detected ? 'PHRASE DETECTED' : 'NOT DETECTED'}
              variant={testResult.detected ? 'green' : 'red'}
              size="sm"
            />
            <Text
              style={[
                styles.confidenceScore,
                {
                  color: testResult.detected
                    ? Colors.LuminousGreen
                    : Colors.CrimsonPulse,
                },
              ]}
            >
              Target: "{targetPhrase}"
            </Text>
          </View>
          <Text
            style={[
              styles.analysisText,
              {
                color: testResult.detected
                  ? isDarkMode
                    ? Colors.ToastSuccessCardBorderLight
                    : Colors.GreenGracious
                  : isDarkMode
                  ? Colors.ToastErrorBadgeBevelLight
                  : Colors.MoltenRust,
              },
            ]}
          >
            {testResult.analysis}
          </Text>
        </View>
      </View>
    );
  },
);

const styles = StyleSheet.create({
  simulatorCard: {
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
  simulatorLabel: {
    fontFamily: Fonts.poppins.regular,
    fontSize: 11,
    marginBottom: 8,
  },
  simulatorInputWrap: {
    borderRadius: 14,
    borderWidth: 1.5,
    paddingHorizontal: 14,
    height: 46,
    justifyContent: 'center',
    marginBottom: 10,
  },
  simulatorInput: {
    fontFamily: Fonts.poppins.regular,
    fontSize: 13,
    padding: 0,
  },
  sampleChipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 12,
  },
  sampleChip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    borderWidth: 1,
  },
  sampleChipText: {
    fontFamily: Fonts.poppins.regular,
    fontSize: 11,
  },
  testResultBox: {
    borderRadius: 14,
    borderWidth: 1.5,
    padding: 12,
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  confidenceScore: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: 12,
  },
  analysisText: {
    fontFamily: Fonts.poppins.regular,
    fontSize: 11,
  },
});

export default WakeWordTester;
