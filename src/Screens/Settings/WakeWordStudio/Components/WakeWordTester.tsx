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
    cardBg = '#FFFFFF',
    isDarkMode = false,
    textPrimary = '#1B1C19',
    textSecondary = '#77767B',
    borderLight = '#E8E2D5',
    surfaceAlt = '#FAF8F5',
  }) => {
    return (
      <View
        style={[
          styles.simulatorCard,
          {
            backgroundColor: cardBg,
            borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.08)' : '#FFFFFF',
            borderBottomColor: isDarkMode ? '#171A20' : '#E2DCD0',
            shadowColor: isDarkMode ? '#000000' : 'rgba(131, 131, 214, 0.1)',
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
                        ? '#2C3038'
                        : '#EEE7D9'
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
                  ? 'rgba(33, 175, 133, 0.15)'
                  : '#EDFDF5'
                : isDarkMode
                ? 'rgba(255, 59, 48, 0.12)'
                : '#FFF0F0',
              borderColor: testResult.detected
                ? 'rgba(33, 175, 133, 0.4)'
                : 'rgba(255, 59, 48, 0.3)',
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
                { color: testResult.detected ? '#21AF85' : '#FF3B30' },
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
                    ? '#A7F3D0'
                    : '#1B9A72'
                  : isDarkMode
                  ? '#FCA5A5'
                  : '#D92A0F',
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
