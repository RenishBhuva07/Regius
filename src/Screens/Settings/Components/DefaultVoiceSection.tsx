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
  Pause,
  Check,
  Headphones,
  ChevronRight,
  RotateCcw,
} from 'lucide-react-native';
import { Typography } from '../../../Theme/Typographys';
import { Fonts } from '../../../Theme/fonts';
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
  speechSpeed?: number;
  onChangeSpeechSpeed?: (speed: number) => void;
  autoSpeakReplies: boolean;
  onToggleAutoSpeakReplies: (val: boolean) => void;
  onResetDefaults?: () => void;
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
  autoSpeakReplies,
  onToggleAutoSpeakReplies,
  onResetDefaults,
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
    <View style={styles.container}>
      {/* Section Header: Title + Voice Studio CTA */}
      <View style={styles.sectionHeaderRow}>
        <View style={styles.sectionTitleWithIcon}>
          <Headphones
            size={18}
            color={StaticColors.LavenderPurple}
            strokeWidth={2.4}
          />
          <Text
            style={[styles.sectionTitle, { color: textPrimary }]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            Default Voice & Speech
          </Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.7}
          style={[
            styles.sectionHeaderAction,
            { backgroundColor: surfaceAlt, borderColor: borderLight },
          ]}
          onPress={onOpenVoiceStudio}
          accessibilityRole="button"
          accessibilityLabel="Open Voice Studio"
        >
          <Text style={styles.sectionHeaderActionText}>Voice Studio</Text>
          <ChevronRight
            size={13}
            color={StaticColors.LavenderPurple}
            strokeWidth={2.4}
          />
        </TouchableOpacity>
      </View>

      {/* 3D Tactile Active Voice Bento Card */}
      <View
        style={[
          styles.activeVoiceCard,
          {
            backgroundColor: cardBg,
            borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.12)' : '#FFFFFF',
            borderBottomColor: isDarkMode ? '#171A20' : '#E2DCD0',
            shadowColor: isDarkMode ? '#000000' : 'rgba(131, 131, 214, 0.16)',
          },
        ]}
      >
        {/* Selected Voice Info Row with Play/Pause Icon Button */}
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
                  {
                    backgroundColor: selectedVoice.bgColor,
                    borderColor: selectedVoice.borderColor,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.voiceTagText,
                    { color: selectedVoice.accentColor },
                  ]}
                  numberOfLines={1}
                >
                  {selectedVoice.tag}
                </Text>
              </View>
            </View>
            <Text
              style={[styles.voiceSubtitle, { color: textSecondary }]}
              numberOfLines={1}
            >
              {selectedVoice.gender} • {selectedVoice.accent} •{' '}
              {selectedVoice.personality}
            </Text>
          </View>

          {/* Compact Play/Pause Icon Button */}
          <TouchableOpacity
            activeOpacity={0.8}
            style={[
              styles.playPauseCircleBtn,
              {
                backgroundColor: isCurrentVoicePlaying
                  ? '#1F2228'
                  : selectedVoice.accentColor,
              },
            ]}
            onPress={() => onTogglePreview(selectedVoice.id)}
            accessibilityRole="button"
            accessibilityLabel={
              isCurrentVoicePlaying
                ? 'Pause Voice Preview'
                : 'Play Voice Preview'
            }
          >
            {isCurrentVoicePlaying ? (
              <Pause size={14} color="#FFFFFF" fill="#FFFFFF" />
            ) : (
              <Play
                size={14}
                color="#FFFFFF"
                fill="#FFFFFF"
                style={styles.playIconOffset}
              />
            )}
          </TouchableOpacity>
        </View>

        {/* Dynamic Waveform & Sample Preview */}
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

        {/* Voice Presets Inside Box (Matching Haptic Intensity design) */}
        <View
          style={[
            styles.presetsInsideBox,
            { backgroundColor: surfaceAlt, borderColor: borderLight },
          ]}
        >
          <View style={styles.presetsInsideHeader}>
            <Headphones
              size={13}
              color={StaticColors.LavenderPurple}
              strokeWidth={2.2}
            />
            <Text style={[styles.presetsInsideTitle, { color: textSecondary }]}>
              Voice Presets:
            </Text>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.voicePillsScroll}
            contentContainerStyle={styles.voicePillsScrollContent}
          >
            {voices.map(voice => {
              const isSelected = voice.id === selectedVoice.id;
              return (
                <TouchableOpacity
                  key={voice.id}
                  activeOpacity={0.85}
                  style={styles.roundVoiceItem}
                  onPress={() => onSelectVoice(voice)}
                  accessibilityRole="button"
                  accessibilityLabel={`Select voice ${voice.name}`}
                >
                  <View
                    style={[
                      styles.roundAvatarCircle,
                      {
                        backgroundColor: voice.bgColor,
                        borderColor: isSelected
                          ? voice.accentColor
                          : isDarkMode
                          ? '#2C3038'
                          : '#E8E2D5',
                        borderWidth: isSelected ? 2.5 : 1.5,
                        shadowColor: isSelected ? voice.accentColor : '#000000',
                        shadowOpacity: isSelected ? 0.3 : 0.06,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.roundAvatarInitial,
                        { color: voice.accentColor },
                      ]}
                    >
                      {voice.name.charAt(0)}
                    </Text>

                    {isSelected && (
                      <View
                        style={[
                          styles.roundCheckBadge,
                          { backgroundColor: voice.accentColor },
                        ]}
                      >
                        <Check size={8} color="#FFFFFF" strokeWidth={3} />
                      </View>
                    )}
                  </View>

                  <Text
                    style={[
                      styles.roundVoiceName,
                      {
                        color: isSelected ? voice.accentColor : textPrimary,
                        fontFamily: isSelected
                          ? Fonts.poppins.semiBold
                          : Fonts.poppins.medium,
                      },
                    ]}
                    numberOfLines={1}
                  >
                    {voice.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Auto-Read Responses Toggle */}
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
        </View>

        {/* Reset Action Placed Inside the Section Itself */}
        {onResetDefaults && (
          <TouchableOpacity
            activeOpacity={0.7}
            style={[styles.insideResetRow, { borderTopColor: borderLight }]}
            onPress={onResetDefaults}
            accessibilityRole="button"
            accessibilityLabel="Reset voice defaults"
          >
            <RotateCcw
              size={12}
              color={StaticColors.LavenderPurple}
              strokeWidth={2.2}
            />
            <Text style={styles.insideResetText}>Reset Voice Defaults</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: ResponsivePixels.size24,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: ResponsivePixels.size12,
  },
  sectionTitleWithIcon: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginRight: 8,
  },
  sectionTitle: {
    fontFamily: Fonts.ranade.bold,
    fontSize: 17,
    flexShrink: 1,
  },
  sectionHeaderAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 11,
    paddingVertical: 5.5,
    borderRadius: 14,
    borderWidth: 1,
    flexShrink: 0,
  },
  sectionHeaderActionText: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: 11,
    color: StaticColors.LavenderPurple,
  },
  activeVoiceCard: {
    borderRadius: 22,
    borderWidth: 1.5,
    borderBottomWidth: 3.5,
    padding: ResponsivePixels.size16,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 14,
    elevation: 4,
  },
  voiceTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  voiceIconSquare: {
    width: 44,
    height: 44,
    borderRadius: 14,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    flexShrink: 0,
  },
  voiceMeta: {
    flex: 1,
    marginRight: 8,
    justifyContent: 'center',
  },
  voiceNameLine: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
  },
  voiceNameText: {
    fontFamily: Fonts.ranade.bold,
    fontSize: 17,
  },
  voiceTagBadge: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 8,
    borderWidth: 1,
    maxWidth: 150,
  },
  voiceTagText: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: 10,
  },
  voiceSubtitle: {
    ...Typography.bodySmallPoppinsRegular,
    fontSize: 11.5,
    marginTop: 2,
  },
  playPauseCircleBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 4,
    elevation: 3,
  },
  playIconOffset: {
    marginLeft: 2,
  },
  waveformContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 12,
    marginTop: 12,
  },
  waveformBars: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    height: 20,
    width: 24,
    justifyContent: 'center',
  },
  waveBar: {
    width: 2.5,
    height: 18,
    borderRadius: 2,
  },
  waveformSampleText: {
    ...Typography.bodySmallPoppinsRegular,
    fontSize: 11,
    lineHeight: 15,
    flex: 1,
    fontStyle: 'italic',
  },
  presetsInsideBox: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 10,
    marginTop: 14,
    overflow: 'hidden',
  },
  presetsInsideHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  presetsInsideTitle: {
    fontFamily: Fonts.poppins.medium,
    fontSize: 11.5,
  },
  voicePillsScroll: {
    marginHorizontal: -10,
  },
  voicePillsScrollContent: {
    paddingHorizontal: 10,
    gap: 12,
  },
  roundVoiceItem: {
    alignItems: 'center',
    width: 56,
  },
  roundAvatarCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  roundAvatarInitial: {
    fontFamily: Fonts.ranade.bold,
    fontSize: 19,
  },
  roundCheckBadge: {
    position: 'absolute',
    bottom: -1,
    right: -1,
    width: 15,
    height: 15,
    borderRadius: 7.5,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  roundVoiceName: {
    fontSize: 11,
    marginTop: 5,
    textAlign: 'center',
  },
  voiceTogglesBlock: {
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  toggleMeta: {
    flex: 1,
    paddingRight: 12,
  },
  toggleTitle: {
    ...Typography.bodyMediumPoppinsSemiBold,
    fontSize: 14,
    marginBottom: 2,
  },
  toggleDesc: {
    ...Typography.bodySmallPoppinsRegular,
    fontSize: 11.5,
    lineHeight: 16,
  },
  insideResetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
  },
  insideResetText: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: 11.5,
    color: StaticColors.LavenderPurple,
  },
});

export default DefaultVoiceSection;
