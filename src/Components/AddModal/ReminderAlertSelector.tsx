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
import { Colors } from '../../Assets/StyleUtilities/Colors';
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
  return (
    <View style={styles.container}>
      {/* Repeat Cycle */}
      <View style={styles.sectionBlock}>
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionHeading}>Repeat Cycle</Text>
          <Text style={styles.sectionSubtext}>Routine cadence</Text>
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
          <Text style={styles.sectionHeading}>Remind Me Before</Text>
          <Badge
            variant="yellow"
            size="sm"
            label="Prior Alert"
            icon={<Bell size={11} color="#B48216" />}
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
        <View style={styles.soundCard}>
          <View style={styles.soundLeftGroup}>
            <View style={styles.soundIconTile}>
              <Volume2 size={20} color="#1B9A72" strokeWidth={2.4} />
            </View>

            <View style={styles.soundTextGroup}>
              <Text style={styles.soundTitle}>{soundTitle}</Text>
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
            <Play size={13} color="#1B9A72" strokeWidth={2.6} />
            <Text style={styles.previewSoundText}>
              {isPlayingPreview ? 'Playing...' : 'Preview'}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Spoken Voice Nudge */}
      <View style={styles.voiceNudgeCard}>
        <View style={styles.voiceNudgeLeft}>
          <View style={styles.voiceIconBox}>
            <Volume2 size={20} color="#1B9A72" strokeWidth={2.4} />
          </View>

          <View style={styles.voiceTextGroup}>
            <View style={styles.voiceTitleRow}>
              <Text style={styles.voiceTitle} numberOfLines={1}>
                Voice Nudge
              </Text>
              <Badge
                variant="purple"
                size="sm"
                label={`${assistantName.toUpperCase()} AI`}
                icon={<Sparkles size={9} color="#7059C8" />}
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
            false: '#E4E2DD',
            true: Colors.MidnightCharcoal,
          }}
          thumbColor="#FFFFFF"
          ios_backgroundColor="#E4E2DD"
        />
      </View>

      {/* Urgent Alarm */}
      <View style={styles.urgentAlarmCard}>
        <View style={styles.urgentAlarmLeft}>
          <View style={styles.urgentIconTile}>
            <AlertTriangle size={20} color="#EF4444" strokeWidth={2.4} />
          </View>

          <View style={styles.urgentTextGroup}>
            <View style={styles.urgentTitleRow}>
              <Text style={styles.urgentTitle} numberOfLines={1}>
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
            false: '#E4E2DD',
            true: '#EF4444',
          }}
          thumbColor="#FFFFFF"
          ios_backgroundColor="#E4E2DD"
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
    color: '#8C929D',
  },
  segmentedContainer: {
    flexDirection: 'row',
    backgroundColor: '#181A20',
    borderRadius: 50,
    padding: 4.5,
    borderWidth: 1.2,
    borderColor: '#2E323D',
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
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
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.95)',
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
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
    color: '#E5E7EB',
  },
  segmentedTabTextActive: {
    fontFamily: Fonts.poppins.bold,
    color: '#121417',
  },
  segmentedTabTextInactive: {
    fontFamily: Fonts.poppins.semiBold,
    color: '#E5E7EB',
  },
  remindBeforeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  remindBeforeCard: {
    width: '48.5%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#E8E2D5',
    borderBottomWidth: 3,
    borderBottomColor: '#D8D1C0',
    paddingVertical: 12,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
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
    borderColor: '#3D414D',
    borderBottomWidth: 3,
    borderBottomColor: '#0C0D10',
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
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
    backgroundColor: '#B4B0A5',
  },
  remindDotSelected: {
    backgroundColor: '#F5C518',
  },
  remindBeforeCardText: {
    fontFamily: Fonts.poppins.medium,
    fontSize: 12,
    color: Colors.MidnightCharcoal,
    flex: 1,
  },
  remindBeforeCardTextSelected: {
    fontFamily: Fonts.poppins.bold,
    color: Colors.DefaultWhite,
  },
  soundCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#E8E2D5',
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
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
    backgroundColor: '#EDFDF5',
    borderWidth: 1.5,
    borderColor: '#C6FFDD',
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
    color: '#7E838F',
    marginTop: 1,
  },
  previewSoundBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#EDFDF5',
    borderWidth: 1.2,
    borderColor: '#A7F3D0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  previewSoundBtnPlaying: {
    backgroundColor: '#D1FAE5',
    borderColor: '#6EE7B7',
  },
  previewSoundText: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: 12,
    color: '#1B9A72',
  },
  voiceNudgeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#E8E2D5',
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
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
    backgroundColor: '#EDFDF5',
    borderWidth: 1.5,
    borderColor: '#C6FFDD',
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#52D22E',
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
    color: '#7E838F',
    marginTop: 2,
  },
  urgentAlarmCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#FEE2E2',
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
    ...Platform.select({
      ios: {
        shadowColor: '#EF4444',
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
    backgroundColor: '#FEF2F2',
    borderWidth: 1.5,
    borderColor: '#FECACA',
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
    color: '#7E838F',
    marginTop: 2,
  },
});
