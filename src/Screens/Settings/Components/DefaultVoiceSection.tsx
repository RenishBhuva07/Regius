import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
  Animated,
} from 'react-native';
import {
  Mic,
  Play,
  Square,
  Check,
  Headphones,
  ChevronRight,
  SlidersHorizontal,
} from 'lucide-react-native';
import Toast from 'react-native-toast-message';
import { Typography } from '../../../Theme/Typographys';
import { Colors as StaticColors } from '../../../Assets/StyleUtilities/Colors';
import ResponsivePixels from '../../../Assets/StyleUtilities/ResponsivePixels';
import { VoiceOption, useSettingsTheme } from './types';

interface DefaultVoiceSectionProps {
  selectedVoice: VoiceOption;
  voices: VoiceOption[];
  onSelectVoice: (voice: VoiceOption) => void;
  onOpenVoiceStudio: () => void;
  isPlayingPreview: boolean;
  playingVoiceId: string | null;
  onTogglePreview: (voiceId: string) => void;
  waveAnims: Animated.Value[];
  speechSpeed: number;
  onChangeSpeechSpeed: (speed: number) => void;
  autoSpeakReplies: boolean;
  onToggleAutoSpeakReplies: (val: boolean) => void;
  wakeWordEnabled: boolean;
  onToggleWakeWord: (val: boolean) => void;
}

export const DefaultVoiceSection: React.FC<DefaultVoiceSectionProps> = ({
  selectedVoice,
  voices,
  onSelectVoice,
  onOpenVoiceStudio,
  isPlayingPreview,
  playingVoiceId,
  onTogglePreview,
  waveAnims,
  speechSpeed,
  onChangeSpeechSpeed,
  autoSpeakReplies,
  onToggleAutoSpeakReplies,
  wakeWordEnabled,
  onToggleWakeWord,
}) => {
  const {
    isDarkMode,
    cardBg,
    textPrimary,
    textSecondary,
    borderLight,
    surfaceAlt,
  } = useSettingsTheme();

  const isCurrentVoicePlaying =
    isPlayingPreview && playingVoiceId === selectedVoice.id;

  return (
    <>
      <View style={styles.sectionHeaderRow}>
        <View style={styles.sectionTitleWithIcon}>
          <Headphones
            size={18}
            color={StaticColors.LavenderPurple}
            strokeWidth={2.4}
          />
          <Text style={[styles.sectionTitle, { color: textPrimary }]}>
            Default Voice & Speech
          </Text>
        </View>
        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.sectionHeaderAction}
          onPress={onOpenVoiceStudio}
        >
          <Text style={styles.sectionHeaderActionText}>Voice Studio</Text>
          <ChevronRight
            size={14}
            color={StaticColors.LavenderPurple}
            strokeWidth={2.4}
          />
        </TouchableOpacity>
      </View>

      <View
        style={[
          styles.activeVoiceCard,
          {
            backgroundColor: cardBg,
            borderColor: selectedVoice.borderColor,
            shadowColor: isDarkMode ? '#000000' : 'rgba(131, 131, 214, 0.12)',
          },
        ]}
      >
        <View style={styles.voiceTopRow}>
          <View
            style={[
              styles.voiceIconSquare,
              {
                backgroundColor: selectedVoice.bgColor,
                borderColor: selectedVoice.borderColor,
              },
            ]}
          >
            <Mic
              size={22}
              color={selectedVoice.accentColor}
              strokeWidth={2.2}
            />
          </View>
          <View style={styles.voiceMeta}>
            <View style={styles.voiceNameLine}>
              <Text style={[styles.voiceNameText, { color: textPrimary }]}>
                {selectedVoice.name}
              </Text>
              <View
                style={[
                  styles.voiceTagBadge,
                  { backgroundColor: selectedVoice.bgColor },
                ]}
              >
                <Text
                  style={[
                    styles.voiceTagText,
                    { color: selectedVoice.accentColor },
                  ]}
                >
                  {selectedVoice.tag}
                </Text>
              </View>
            </View>
            <Text style={[styles.voiceSubtitle, { color: textSecondary }]}>
              {selectedVoice.gender} • {selectedVoice.accent} •{' '}
              {selectedVoice.personality}
            </Text>
          </View>

          <TouchableOpacity
            activeOpacity={0.8}
            style={[
              styles.playPreviewBtn,
              {
                backgroundColor: isCurrentVoicePlaying
                  ? '#1F2228'
                  : selectedVoice.accentColor,
              },
            ]}
            onPress={() => onTogglePreview(selectedVoice.id)}
          >
            {isCurrentVoicePlaying ? (
              <Square size={13} color="#FFFFFF" fill="#FFFFFF" />
            ) : (
              <Play size={13} color="#FFFFFF" fill="#FFFFFF" />
            )}
            <Text style={styles.playPreviewBtnText}>
              {isCurrentVoicePlaying ? 'Stop' : 'Listen'}
            </Text>
          </TouchableOpacity>
        </View>

        <View
          style={[styles.waveformContainer, { backgroundColor: surfaceAlt }]}
        >
          <View style={styles.waveformBars}>
            {waveAnims.map((anim, index) => (
              <Animated.View
                key={index}
                style={[
                  styles.waveBar,
                  {
                    backgroundColor: selectedVoice.accentColor,
                    transform: [{ scaleY: anim }],
                  },
                ]}
              />
            ))}
          </View>
          <Text
            style={[styles.waveformSampleText, { color: textSecondary }]}
            numberOfLines={2}
          >
            &ldquo;{selectedVoice.sampleText}&rdquo;
          </Text>
        </View>

        <View style={styles.speedControlRow}>
          <View style={styles.speedControlLabel}>
            <SlidersHorizontal
              size={14}
              color={textSecondary}
              strokeWidth={2}
            />
            <Text style={[styles.speedLabelText, { color: textSecondary }]}>
              Speech Speed:
            </Text>
          </View>
          <View style={styles.speedPillsWrap}>
            {[0.75, 1.0, 1.25, 1.5].map(speed => {
              const isActive = speechSpeed === speed;
              return (
                <TouchableOpacity
                  key={speed}
                  activeOpacity={0.8}
                  style={[
                    styles.speedPill,
                    isActive && styles.speedPillActive,
                    {
                      backgroundColor: isActive
                        ? isDarkMode
                          ? '#FFFFFF'
                          : '#1F2228'
                        : surfaceAlt,
                    },
                  ]}
                  onPress={() => {
                    onChangeSpeechSpeed(speed);
                    Toast.show({
                      type: 'info',
                      text2: `Speech speed set to ${speed}x`,
                    });
                  }}
                >
                  <Text
                    style={[
                      styles.speedPillText,
                      {
                        color: isActive
                          ? isDarkMode
                            ? '#000000'
                            : '#FFFFFF'
                          : textSecondary,
                        fontFamily: isActive
                          ? Typography.bodyMediumPoppinsSemiBold.fontFamily
                          : Typography.bodySmallPoppinsRegular.fontFamily,
                      },
                    ]}
                  >
                    {speed}x
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={styles.voiceSelectorHeader}>
          <Text style={[styles.voiceSelectorTitle, { color: textSecondary }]}>
            Switch Voice Preset:
          </Text>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.voicePillsScroll}
        >
          {voices.map(voice => {
            const isSelected = voice.id === selectedVoice.id;
            return (
              <TouchableOpacity
                key={voice.id}
                activeOpacity={0.85}
                style={[
                  styles.voiceQuickCard,
                  {
                    backgroundColor: isSelected ? voice.bgColor : surfaceAlt,
                    borderColor: isSelected ? voice.borderColor : borderLight,
                  },
                ]}
                onPress={() => onSelectVoice(voice)}
              >
                <View style={styles.voiceQuickHeader}>
                  <Text
                    style={[
                      styles.voiceQuickName,
                      {
                        color: isSelected ? voice.accentColor : textPrimary,
                      },
                    ]}
                  >
                    {voice.name}
                  </Text>
                  {isSelected && (
                    <View
                      style={[
                        styles.voiceCheckDot,
                        { backgroundColor: voice.accentColor },
                      ]}
                    >
                      <Check size={9} color="#FFFFFF" strokeWidth={3} />
                    </View>
                  )}
                </View>
                <Text style={[styles.voiceQuickDesc, { color: textSecondary }]}>
                  {voice.kokoroVoiceId}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <View
          style={[styles.voiceTogglesBlock, { borderTopColor: borderLight }]}
        >
          <View style={styles.toggleRow}>
            <View style={styles.toggleMeta}>
              <Text style={[styles.toggleTitle, { color: textPrimary }]}>
                Auto-Read Responses
              </Text>
              <Text style={[styles.toggleDesc, { color: textSecondary }]}>
                Regius automatically reads back assistant reminders & tasks
              </Text>
            </View>
            <Switch
              value={autoSpeakReplies}
              onValueChange={onToggleAutoSpeakReplies}
              trackColor={{
                false: '#D9D9D9',
                true: StaticColors.LavenderPurple,
              }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View style={styles.toggleRow}>
            <View style={styles.toggleMeta}>
              <Text style={[styles.toggleTitle, { color: textPrimary }]}>
                Wake Word &ldquo;Hey Regius&rdquo;
              </Text>
              <Text style={[styles.toggleDesc, { color: textSecondary }]}>
                Listen for voice trigger when app is open
              </Text>
            </View>
            <Switch
              value={wakeWordEnabled}
              onValueChange={onToggleWakeWord}
              trackColor={{
                false: '#D9D9D9',
                true: StaticColors.LavenderPurple,
              }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: ResponsivePixels.size12,
    marginTop: ResponsivePixels.size4,
  },
  sectionTitleWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: {
    ...Typography.h6Bold,
    fontSize: 16,
  },
  sectionHeaderAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  sectionHeaderActionText: {
    ...Typography.bodySmallPoppinsSemiBold,
    fontSize: 12,
    color: StaticColors.LavenderPurple,
  },
  activeVoiceCard: {
    borderRadius: 24,
    borderWidth: 1.5,
    padding: ResponsivePixels.size16,
    marginBottom: ResponsivePixels.size24,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 3,
  },
  voiceTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  voiceIconSquare: {
    width: 46,
    height: 46,
    borderRadius: 14,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  voiceMeta: {
    flex: 1,
  },
  voiceNameLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  voiceNameText: {
    ...Typography.bodyLargePoppinsSemiBold,
    fontSize: 17,
  },
  voiceTagBadge: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 8,
  },
  voiceTagText: {
    ...Typography.bodySmallPoppinsSemiBold,
    fontSize: 10,
  },
  voiceSubtitle: {
    ...Typography.bodySmallPoppinsRegular,
    fontSize: 12,
    marginTop: 2,
  },
  playPreviewBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 18,
  },
  playPreviewBtnText: {
    ...Typography.bodySmallPoppinsSemiBold,
    fontSize: 12,
    color: '#FFFFFF',
  },
  waveformContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: ResponsivePixels.size14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 14,
  },
  waveformBars: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3.5,
    height: 22,
  },
  waveBar: {
    width: 3.5,
    height: 20,
    borderRadius: 2,
  },
  waveformSampleText: {
    flex: 1,
    ...Typography.bodySmallPoppinsRegular,
    fontSize: 12,
    fontStyle: 'italic',
  },
  speedControlRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: ResponsivePixels.size14,
    paddingTop: ResponsivePixels.size10,
  },
  speedControlLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  speedLabelText: {
    ...Typography.bodySmallPoppinsMedium,
    fontSize: 12,
  },
  speedPillsWrap: {
    flexDirection: 'row',
    gap: 6,
  },
  speedPill: {
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 12,
  },
  speedPillActive: {},
  speedPillText: {
    fontSize: 12,
  },
  voiceSelectorHeader: {
    marginTop: ResponsivePixels.size14,
    marginBottom: 8,
  },
  voiceSelectorTitle: {
    ...Typography.bodySmallPoppinsMedium,
    fontSize: 12,
  },
  voicePillsScroll: {
    marginHorizontal: -4,
  },
  voiceQuickCard: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 16,
    borderWidth: 1.5,
    marginRight: 10,
    minWidth: 115,
  },
  voiceQuickHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  voiceQuickName: {
    ...Typography.bodyMediumPoppinsSemiBold,
    fontSize: 14,
  },
  voiceCheckDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  voiceQuickDesc: {
    ...Typography.bodySmallPoppinsRegular,
    fontSize: 11,
    marginTop: 2,
  },
  voiceTogglesBlock: {
    borderTopWidth: 1,
    marginTop: ResponsivePixels.size16,
    paddingTop: ResponsivePixels.size8,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: ResponsivePixels.size10,
  },
  toggleMeta: {
    flex: 1,
    paddingRight: 12,
  },
  toggleTitle: {
    ...Typography.bodyMediumPoppinsSemiBold,
    fontSize: 14,
  },
  toggleDesc: {
    ...Typography.bodySmallPoppinsRegular,
    fontSize: 11,
    marginTop: 1,
  },
});

export default DefaultVoiceSection;
