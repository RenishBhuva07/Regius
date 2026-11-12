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
import {
  Colors as StaticColors,
  withAlpha,
} from '../../../Assets/StyleUtilities/Colors';
import ResponsivePixels from '../../../Assets/StyleUtilities/ResponsivePixels';
import { HeaderActionButton } from '../../../Common/HeaderActionButton';
import { useTheme } from '../../../Theme/ThemeContext';
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
    canvasTextPrimary,
    borderLight,
    surfaceAlt,
    accent,
  } = useSettingsTheme();
  const { activeThemeId } = useTheme();

  const themeAccent =
    activeThemeId === 'cyprus_sand'
      ? isDarkMode
        ? StaticColors.CyprusTealLight
        : StaticColors.CyprusTeal
      : accent;

  const isCurrentVoicePlaying =
    isPlayingPreview && playingVoiceId === selectedVoice.id;

  return (
    <View style={styles.container}>
      {/* Section Header: Title + Voice Studio CTA */}
      <View style={styles.sectionHeaderRow}>
        <View style={styles.sectionTitleWithIcon}>
          <Headphones
            size={ResponsivePixels.size18}
            color={themeAccent}
            strokeWidth={2.4}
          />
          <Text
            style={[styles.sectionTitle, { color: canvasTextPrimary }]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            Default Voice & Speech
          </Text>
        </View>

        <HeaderActionButton
          label="Voice Studio"
          icon={ChevronRight}
          iconPosition="right"
          onPress={onOpenVoiceStudio}
          accessibilityLabel="Open Voice Studio"
        />
      </View>

      {/* 3D Tactile Active Voice Bento Card */}
      <View
        style={[
          styles.activeVoiceCard,
          {
            backgroundColor: cardBg,
            borderColor:
              activeThemeId === 'cyprus_sand'
                ? StaticColors.CyprusBorderDarkCard
                : isDarkMode
                ? withAlpha(StaticColors.PureWhite, 0.12)
                : StaticColors.PureWhite,
            borderBottomColor:
              activeThemeId === 'cyprus_sand'
                ? StaticColors.SandstoneBorder
                : isDarkMode
                ? StaticColors.DarkSurfaceDeep
                : StaticColors.WarmStoneBorder,
            shadowColor:
              activeThemeId === 'cyprus_sand'
                ? withAlpha(StaticColors.CyprusTeal, 0.16)
                : isDarkMode
                ? StaticColors.PureBlack
                : withAlpha(StaticColors.LavenderPurple, 0.16),
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
              size={ResponsivePixels.size22}
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
                  ? StaticColors.MidnightCharcoal
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
              <Pause
                size={ResponsivePixels.size14}
                color={StaticColors.PureWhite}
                fill={StaticColors.PureWhite}
              />
            ) : (
              <Play
                size={ResponsivePixels.size14}
                color={StaticColors.PureWhite}
                fill={StaticColors.PureWhite}
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
              size={ResponsivePixels.size13}
              color={themeAccent}
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
                          ? StaticColors.DarkSteelBorder
                          : StaticColors.RingBorder,
                        borderWidth: isSelected ? 2.5 : 1.5,
                        shadowColor: isSelected
                          ? voice.accentColor
                          : StaticColors.PureBlack,
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
                        <Check
                          size={ResponsivePixels.size8}
                          color={StaticColors.PureWhite}
                          strokeWidth={3}
                        />
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
                false: StaticColors.FogGrey,
                true: themeAccent,
              }}
              thumbColor={StaticColors.PureWhite}
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
              size={ResponsivePixels.size12}
              color={themeAccent}
              strokeWidth={2.2}
            />
            <Text style={[styles.insideResetText, { color: themeAccent }]}>Reset Voice Defaults</Text>
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
    gap: ResponsivePixels.size8,
    marginRight: ResponsivePixels.size8,
  },
  sectionTitle: {
    fontFamily: Fonts.ranade.bold,
    fontSize: ResponsivePixels.size17,
    flexShrink: 1,
  },
  activeVoiceCard: {
    borderRadius: ResponsivePixels.size22,
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
    width: ResponsivePixels.size44,
    height: ResponsivePixels.size44,
    borderRadius: ResponsivePixels.size14,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: ResponsivePixels.size10,
    flexShrink: 0,
  },
  voiceMeta: {
    flex: 1,
    marginRight: ResponsivePixels.size8,
    justifyContent: 'center',
  },
  voiceNameLine: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: ResponsivePixels.size6,
  },
  voiceNameText: {
    fontFamily: Fonts.ranade.bold,
    fontSize: ResponsivePixels.size17,
  },
  voiceTagBadge: {
    paddingHorizontal: ResponsivePixels.size7,
    paddingVertical: ResponsivePixels.size2,
    borderRadius: ResponsivePixels.size8,
    borderWidth: 1,
    maxWidth: ResponsivePixels.size150,
  },
  voiceTagText: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: ResponsivePixels.size10,
  },
  voiceSubtitle: {
    ...Typography.bodySmallPoppinsRegular,
    fontSize: ResponsivePixels.size11_5,
    marginTop: ResponsivePixels.size2,
  },
  playPauseCircleBtn: {
    width: ResponsivePixels.size36,
    height: ResponsivePixels.size36,
    borderRadius: ResponsivePixels.size18,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    shadowColor: StaticColors.PureBlack,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 4,
    elevation: 3,
  },
  playIconOffset: {
    marginLeft: ResponsivePixels.size2,
  },
  waveformContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ResponsivePixels.size12,
    paddingHorizontal: ResponsivePixels.size12,
    paddingVertical: ResponsivePixels.size9,
    borderRadius: ResponsivePixels.size12,
    marginTop: ResponsivePixels.size12,
  },
  waveformBars: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ResponsivePixels.size3,
    height: ResponsivePixels.size20,
    width: ResponsivePixels.size24,
    justifyContent: 'center',
  },
  waveBar: {
    width: ResponsivePixels.size2_5,
    height: ResponsivePixels.size18,
    borderRadius: ResponsivePixels.size2,
  },
  waveformSampleText: {
    ...Typography.bodySmallPoppinsRegular,
    fontSize: ResponsivePixels.size11,
    lineHeight: ResponsivePixels.size15,
    flex: 1,
    fontStyle: 'italic',
  },
  presetsInsideBox: {
    borderRadius: ResponsivePixels.size14,
    borderWidth: 1,
    padding: ResponsivePixels.size10,
    marginTop: ResponsivePixels.size14,
    overflow: 'hidden',
  },
  presetsInsideHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ResponsivePixels.size6,
    marginBottom: ResponsivePixels.size8,
  },
  presetsInsideTitle: {
    fontFamily: Fonts.poppins.medium,
    fontSize: ResponsivePixels.size11_5,
  },
  voicePillsScroll: {
    marginHorizontal: -ResponsivePixels.size10,
  },
  voicePillsScrollContent: {
    paddingHorizontal: ResponsivePixels.size10,
    gap: ResponsivePixels.size12,
  },
  roundVoiceItem: {
    alignItems: 'center',
    width: ResponsivePixels.size56,
  },
  roundAvatarCircle: {
    width: ResponsivePixels.size50,
    height: ResponsivePixels.size50,
    borderRadius: ResponsivePixels.size25,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  roundAvatarInitial: {
    fontFamily: Fonts.ranade.bold,
    fontSize: ResponsivePixels.size19,
  },
  roundCheckBadge: {
    position: 'absolute',
    bottom: -ResponsivePixels.size1,
    right: -ResponsivePixels.size1,
    width: ResponsivePixels.size15,
    height: ResponsivePixels.size15,
    borderRadius: ResponsivePixels.size7_5,
    borderWidth: 1.5,
    borderColor: StaticColors.PureWhite,
    alignItems: 'center',
    justifyContent: 'center',
  },
  roundVoiceName: {
    fontSize: ResponsivePixels.size11,
    marginTop: ResponsivePixels.size5,
    textAlign: 'center',
  },
  voiceTogglesBlock: {
    marginTop: ResponsivePixels.size14,
    paddingTop: ResponsivePixels.size12,
    borderTopWidth: 1,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  toggleMeta: {
    flex: 1,
    paddingRight: ResponsivePixels.size12,
  },
  toggleTitle: {
    ...Typography.bodyMediumPoppinsSemiBold,
    fontSize: ResponsivePixels.size14,
    marginBottom: ResponsivePixels.size2,
  },
  toggleDesc: {
    ...Typography.bodySmallPoppinsRegular,
    fontSize: ResponsivePixels.size11_5,
    lineHeight: ResponsivePixels.size16,
  },
  insideResetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: ResponsivePixels.size6,
    marginTop: ResponsivePixels.size12,
    paddingTop: ResponsivePixels.size10,
    borderTopWidth: 1,
  },
  insideResetText: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: ResponsivePixels.size11_5,
    color: StaticColors.LavenderPurple,
  },
});

export default DefaultVoiceSection;
