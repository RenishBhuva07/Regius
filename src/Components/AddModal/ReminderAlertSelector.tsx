import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Platform,
} from 'react-native';
import {
  Bell,
  Volume2,
  Play,
  Sparkles,
  AlertTriangle,
} from 'lucide-react-native';

import { Fonts } from '../../Theme/fonts';
import { Colors, withAlpha } from '../../Assets/StyleUtilities/Colors';
import { useAppTheme } from '../../Theme/useAppTheme';
import { Badge } from '../../Common/Badge';

export const REMIND_BEFORE_OPTIONS = [
  'At time of event',
  '5 mins before',
  '15 mins before',
  '1 hour before',
];

export const REPEAT_OPTIONS = ['Never', 'Daily', 'Weekdays', 'Weekly'];

export interface ReminderAlertSelectorProps {
  repeatCycle: string;
  onSelectRepeatCycle: (cycle: string) => void;
  remindBefore: string;
  onSelectRemindBefore: (option: string) => void;
  soundTitle?: string;
  soundSubtitle?: string;
  isPlayingPreview?: boolean;
  onPreviewSound?: () => void;
  voiceNudgeEnabled: boolean;
  onToggleVoiceNudge: (val: boolean) => void;
  urgentAlarm: boolean;
  onToggleUrgentAlarm: (val: boolean) => void;
  assistantName?: string;
}

export const ReminderAlertSelector: React.FC<ReminderAlertSelectorProps> = ({
  repeatCycle,
  onSelectRepeatCycle,
  remindBefore,
  onSelectRemindBefore,
  soundTitle = 'Gentle Bell',
  soundSubtitle = 'Soft Harmonic Chime',
  isPlayingPreview = false,
  onPreviewSound,
  voiceNudgeEnabled,
  onToggleVoiceNudge,
  urgentAlarm,
  onToggleUrgentAlarm,
  assistantName = 'Regius',
}) => {
  const { isDarkMode, textPrimary, textSecondary } = useAppTheme();

  return (
    <View style={styles.container}>
      {/* Repeat Cycle */}
      <View style={styles.sectionBlock}>
        <View style={styles.sectionHeaderRow}>
          <Text
            style={[
              styles.sectionHeading,
              isDarkMode && { color: textPrimary },
            ]}
          >
            Repeat Cycle
          </Text>
          <Text
            style={[
              styles.sectionSubtext,
              isDarkMode && { color: textSecondary },
            ]}
          >
            Routine cadence
          </Text>
        </View>

        <View style={styles.segmentedContainer}>
          {REPEAT_OPTIONS.map(rep => {
            const isActive = repeatCycle === rep;
            return (
              <TouchableOpacity
                key={rep}
                activeOpacity={0.85}
                onPress={() => onSelectRepeatCycle(rep)}
                style={[
                  styles.segmentedTab,
                  isActive && styles.segmentedTabActive,
                ]}
              >
                <Text
                  style={[
                    styles.segmentedTabText,
                    isActive
                      ? styles.segmentedTabTextActive
                      : styles.segmentedTabTextInactive,
                  ]}
                >
                  {rep}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Remind Me Before (2x2 Tactile Capsule Grid) */}
      <View style={styles.sectionBlock}>
        <View style={styles.sectionHeaderRow}>
          <Text
            style={[
              styles.sectionHeading,
              isDarkMode && { color: textPrimary },
            ]}
          >
            Remind Me Before
          </Text>
          <Badge
            variant="yellow"
            size="sm"
            label="Prior Alert"
            icon={<Bell size={11} color={Colors.WorkTextAccent} />}
          />
        </View>

        <View style={styles.remindBeforeGrid}>
          {REMIND_BEFORE_OPTIONS.map(opt => {
            const isSelected = remindBefore === opt;
            return (
              <TouchableOpacity
                key={opt}
                activeOpacity={0.8}
                onPress={() => onSelectRemindBefore(opt)}
                style={[
                  styles.remindBeforeCard,
                  isDarkMode &&
                    !isSelected && {
                      backgroundColor: Colors.DarkCardBackground,
                      borderColor: Colors.CarbonSlate,
                      borderBottomColor: Colors.DarkSurfaceAlt,
                    },
                  isSelected && styles.remindBeforeCardSelected,
                ]}
              >
                <View
                  style={[
                    styles.remindDot,
                    isSelected && styles.remindDotSelected,
                  ]}
                />
                <Text
                  style={[
                    styles.remindBeforeCardText,
                    isDarkMode && !isSelected && { color: Colors.PureWhite },
                    isSelected && styles.remindBeforeCardTextSelected,
                  ]}
                >
                  {opt}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Sound & Haptics Preview Card */}
      {onPreviewSound && (
        <View
          style={[
            styles.soundCard,
            isDarkMode && {
              backgroundColor: Colors.DarkCardBackground,
              borderColor: Colors.CarbonSlate,
            },
          ]}
        >
          <View style={styles.soundLeftGroup}>
            <View
              style={[
                styles.soundIconTile,
                isDarkMode && {
                  backgroundColor: Colors.WellnessDarkIconBg,
                  borderColor: Colors.GreenGracious,
                },
              ]}
            >
              <Volume2
                size={20}
                color={Colors.GreenGracious}
                strokeWidth={2.4}
              />
            </View>

            <View style={styles.soundTextGroup}>
              <Text
                style={[
                  styles.soundTitle,
                  isDarkMode && { color: Colors.PureWhite },
                ]}
              >
                {soundTitle}
              </Text>
              <Text style={styles.soundSubtitle}>{soundSubtitle}</Text>
            </View>
          </View>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={onPreviewSound}
            style={[
              styles.previewSoundBtn,
              isPlayingPreview && styles.previewSoundBtnPlaying,
            ]}
          >
            <Play size={13} color={Colors.GreenGracious} strokeWidth={2.6} />
            <Text style={styles.previewSoundText}>
              {isPlayingPreview ? 'Playing...' : 'Preview'}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Spoken Voice Nudge */}
      <View
        style={[
          styles.voiceNudgeCard,
          isDarkMode && {
            backgroundColor: Colors.DarkCardBackground,
            borderColor: Colors.CarbonSlate,
          },
        ]}
      >
        <View style={styles.voiceNudgeLeft}>
          <View
            style={[
              styles.voiceIconBox,
              isDarkMode && {
                backgroundColor: Colors.WellnessDarkIconBg,
                borderColor: Colors.GreenGracious,
              },
            ]}
          >
            <Volume2 size={20} color={Colors.GreenGracious} strokeWidth={2.4} />
          </View>

          <View style={styles.voiceTextGroup}>
            <View style={styles.voiceTitleRow}>
              <Text
                style={[
                  styles.voiceTitle,
                  isDarkMode && { color: Colors.PureWhite },
                ]}
                numberOfLines={1}
              >
                Voice Nudge
              </Text>
              <Badge
                variant="purple"
                size="sm"
                label={`${assistantName.toUpperCase()} AI`}
                icon={<Sparkles size={9} color={Colors.MindfulTextAccent} />}
              />
            </View>
            <Text style={styles.voiceSubtitle} numberOfLines={1}>
              Audio chime when reminder arrives
            </Text>
          </View>
        </View>

        <Switch
          value={voiceNudgeEnabled}
          onValueChange={onToggleVoiceNudge}
          trackColor={{
            false: isDarkMode ? Colors.CarbonSlate : Colors.WarmSwitchTrackOff,
            true: isDarkMode ? Colors.LavenderPurple : Colors.MidnightCharcoal,
          }}
          thumbColor={Colors.PureWhite}
          ios_backgroundColor={
            isDarkMode ? Colors.CarbonSlate : Colors.WarmSwitchTrackOff
          }
        />
      </View>

      {/* Urgent Alarm */}
      <View
        style={[
          styles.urgentAlarmCard,
          isDarkMode && {
            backgroundColor: Colors.DarkCardBackground,
            borderColor: Colors.UrgentDarkBorder,
          },
        ]}
      >
        <View style={styles.urgentAlarmLeft}>
          <View
            style={[
              styles.urgentIconTile,
              isDarkMode && {
                backgroundColor: Colors.UrgentDarkIconBg,
                borderColor: Colors.UrgentDarkBorder,
              },
            ]}
          >
            <AlertTriangle
              size={20}
              color={Colors.CategoryRedAccent}
              strokeWidth={2.4}
            />
          </View>

          <View style={styles.urgentTextGroup}>
            <View style={styles.urgentTitleRow}>
              <Text
                style={[
                  styles.urgentTitle,
                  isDarkMode && { color: Colors.PureWhite },
                ]}
                numberOfLines={1}
              >
                Urgent Alarm
              </Text>
              <Badge variant="red" size="sm" label="CRITICAL" />
            </View>
            <Text style={styles.urgentSubtitle} numberOfLines={1}>
              Override Silent Mode & Ring aloud
            </Text>
          </View>
        </View>

        <Switch
          value={urgentAlarm}
          onValueChange={onToggleUrgentAlarm}
          trackColor={{
            false: isDarkMode ? Colors.CarbonSlate : Colors.WarmSwitchTrackOff,
            true: Colors.CategoryRedAccent,
          }}
          thumbColor={Colors.PureWhite}
          ios_backgroundColor={
            isDarkMode ? Colors.CarbonSlate : Colors.WarmSwitchTrackOff
          }
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  sectionBlock: {
    marginBottom: 20,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  sectionHeading: {
    fontFamily: Fonts.poppins.bold,
    fontSize: 14,
    color: Colors.MidnightCharcoal,
    letterSpacing: -0.2,
  },
  sectionSubtext: {
    fontFamily: Fonts.poppins.medium,
    fontSize: 12,
    color: Colors.CoolGraphiteMuted,
  },
  segmentedContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.DarkSegmentedShell,
    borderRadius: 50,
    padding: 4.5,
    borderWidth: 1.2,
    borderColor: Colors.DarkSegmentedShellBorder,
    ...Platform.select({
      ios: {
        shadowColor: Colors.PureBlack,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.22,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  segmentedTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    borderRadius: 50,
  },
  segmentedTabActive: {
    backgroundColor: Colors.PureWhite,
    borderWidth: 1,
    borderColor: withAlpha(Colors.PureWhite, 0.95),
    ...Platform.select({
      ios: {
        shadowColor: Colors.PureBlack,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  segmentedTabText: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: 12.5,
    letterSpacing: -0.2,
    color: Colors.Gray200,
  },
  segmentedTabTextActive: {
    fontFamily: Fonts.poppins.bold,
    color: Colors.DarkBackground,
  },
  segmentedTabTextInactive: {
    fontFamily: Fonts.poppins.semiBold,
    color: Colors.Gray200,
  },
  remindBeforeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  remindBeforeCard: {
    width: '48.5%',
    backgroundColor: Colors.PureWhite,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: Colors.RingBorder,
    borderBottomWidth: 3,
    borderBottomColor: Colors.WarmHaloBottomBevel,
    paddingVertical: 12,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    ...Platform.select({
      ios: {
        shadowColor: Colors.PureBlack,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  remindBeforeCardSelected: {
    backgroundColor: Colors.NeroBlack,
    borderColor: Colors.DarkCardBorderElevated,
    borderBottomWidth: 3,
    borderBottomColor: Colors.DarkCardBottomBevel,
    ...Platform.select({
      ios: {
        shadowColor: Colors.PureBlack,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 6,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  remindDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: Colors.WarmStoneDot,
  },
  remindDotSelected: {
    backgroundColor: Colors.AccentYellow,
  },
  remindBeforeCardText: {
    fontFamily: Fonts.poppins.medium,
    fontSize: 12,
    color: Colors.MidnightCharcoal,
    flex: 1,
  },
  remindBeforeCardTextSelected: {
    fontFamily: Fonts.poppins.bold,
    color: Colors.PureWhite,
  },
  soundCard: {
    backgroundColor: Colors.PureWhite,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: Colors.RingBorder,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
    ...Platform.select({
      ios: {
        shadowColor: Colors.PureBlack,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
      },
      android: {
        elevation: 2.5,
      },
    }),
  },
  soundLeftGroup: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  soundIconTile: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: Colors.WellnessLightBg,
    borderWidth: 1.5,
    borderColor: Colors.WellnessLightBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  soundTextGroup: {
    flex: 1,
  },
  soundTitle: {
    fontFamily: Fonts.poppins.bold,
    fontSize: 14,
    color: Colors.MidnightCharcoal,
  },
  soundSubtitle: {
    fontFamily: Fonts.poppins.regular,
    fontSize: 11.5,
    color: Colors.MutedSlateSubtext,
    marginTop: 1,
  },
  previewSoundBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.WellnessLightBg,
    borderWidth: 1.2,
    borderColor: Colors.ToastSuccessCardBorderLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  previewSoundBtnPlaying: {
    backgroundColor: Colors.ToastSuccessBadgeBgLight,
    borderColor: Colors.ToastSuccessBadgeBevelLight,
  },
  previewSoundText: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: 12,
    color: Colors.GreenGracious,
  },
  voiceNudgeCard: {
    backgroundColor: Colors.PureWhite,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: Colors.RingBorder,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
    ...Platform.select({
      ios: {
        shadowColor: Colors.PureBlack,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 10,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  voiceNudgeLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginRight: 14,
  },
  voiceIconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: Colors.WellnessLightBg,
    borderWidth: 1.5,
    borderColor: Colors.WellnessLightBorder,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: Colors.AccentGreen,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  voiceTextGroup: {
    flex: 1,
  },
  voiceTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  voiceTitle: {
    fontFamily: Fonts.poppins.bold,
    fontSize: 14,
    color: Colors.MidnightCharcoal,
  },
  voiceSubtitle: {
    fontFamily: Fonts.poppins.regular,
    fontSize: 11.5,
    color: Colors.MutedSlateSubtext,
    marginTop: 2,
  },
  urgentAlarmCard: {
    backgroundColor: Colors.PureWhite,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: Colors.CategoryRedBorder,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
    ...Platform.select({
      ios: {
        shadowColor: Colors.CategoryRedAccent,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  urgentAlarmLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginRight: 14,
  },
  urgentIconTile: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: Colors.CategoryRedBg,
    borderWidth: 1.5,
    borderColor: Colors.ToastErrorCardBorderLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  urgentTextGroup: {
    flex: 1,
  },
  urgentTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  urgentTitle: {
    fontFamily: Fonts.poppins.bold,
    fontSize: 14,
    color: Colors.MidnightCharcoal,
  },
  urgentSubtitle: {
    fontFamily: Fonts.poppins.regular,
    fontSize: 11.5,
    color: Colors.MutedSlateSubtext,
    marginTop: 2,
  },
});
