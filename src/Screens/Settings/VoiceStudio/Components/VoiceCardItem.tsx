import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Mic, Play, Square, Check } from 'lucide-react-native';
import { Fonts } from '../../../../Theme/fonts';
import { Colors, withAlpha } from '../../../../Assets/StyleUtilities/Colors';
import { Badge } from '../../../../Common/Badge';
import { VoiceOption } from '../../Components/types';
import { isLightColor } from '../../../../Theme/ThemeContext';

export interface VoiceCardItemProps {
  voice: VoiceOption;
  isSelected: boolean;
  isPreviewing: boolean;
  onSelectVoice: (voice: VoiceOption) => void;
  onTogglePreview: (voiceId: string) => void;
  isDarkMode?: boolean;
  textPrimary?: string;
  textSecondary?: string;
  borderLight?: string;
  surfaceAlt?: string;
  themeAccent?: string;
  cardBg?: string;
}

export const VoiceCardItem: React.FC<VoiceCardItemProps> = React.memo(
  ({
    voice,
    isSelected,
    isPreviewing,
    onSelectVoice,
    onTogglePreview,
    isDarkMode = false,
    textPrimary = Colors.PureBlack,
    textSecondary = Colors.SubtitleGray,
    borderLight = Colors.RingBorder,
    surfaceAlt = Colors.CreamSurfaceAlt,
    themeAccent = Colors.LavenderPurple,
    cardBg,
  }) => {
    const isCardLight = cardBg ? isLightColor(cardBg) : !isDarkMode;

    return (
      <View
        style={[
          styles.voiceItemRow,
          isSelected && {
            backgroundColor: isCardLight
              ? withAlpha(Colors.CyprusTeal, 0.08)
              : Colors.VoiceCardDarkSelectedBg,
          },
        ]}
      >
        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.voiceInfoClickable}
          onPress={() => onSelectVoice(voice)}
        >
          <View
            style={[
              styles.voiceAvatar,
              {
                backgroundColor: isSelected
                  ? themeAccent
                  : surfaceAlt,
                borderColor: isSelected ? Colors.PureWhite : borderLight,
              },
            ]}
          >
            <Mic
              size={16}
              color={
                isSelected
                  ? isLightColor(themeAccent)
                    ? Colors.PureBlack
                    : Colors.PureWhite
                  : textSecondary
              }
              strokeWidth={2.2}
            />
          </View>

          <View style={styles.voiceMeta}>
            <View style={styles.voiceNameRow}>
              <Text
                style={[
                  styles.voiceName,
                  { color: textPrimary },
                  isSelected && styles.voiceNameSelected,
                ]}
              >
                {voice.name}
              </Text>
              <Badge
                label={voice.tag}
                variant={isSelected ? 'purple' : 'neutral'}
                size="sm"
              />
            </View>
            <Text style={[styles.voiceItemDesc, { color: textSecondary }]}>
              {voice.personality} • {voice.accent}
            </Text>
          </View>
        </TouchableOpacity>

        <View style={styles.voiceItemActions}>
          <TouchableOpacity
            activeOpacity={0.7}
            style={[
              styles.itemPlayBtn,
              {
                backgroundColor: surfaceAlt,
                borderColor: borderLight,
              },
            ]}
            onPress={() => onTogglePreview(voice.id)}
            accessibilityRole="button"
            accessibilityLabel={`Preview ${voice.name}`}
          >
            {isPreviewing ? (
              <Square
                size={14}
                color={Colors.LavenderPurple}
                fill={Colors.LavenderPurple}
              />
            ) : (
              <Play
                size={14}
                color={Colors.LavenderPurple}
                fill={Colors.LavenderPurple}
              />
            )}
          </TouchableOpacity>

          {isSelected && (
            <View style={styles.activeCheckBadge}>
              <Check size={14} color={Colors.PureWhite} strokeWidth={3} />
            </View>
          )}
        </View>
      </View>
    );
  },
);

const styles = StyleSheet.create({
  voiceItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  voiceInfoClickable: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  voiceAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  voiceMeta: {
    flex: 1,
  },
  voiceNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 2,
  },
  voiceName: {
    fontFamily: Fonts.poppins.medium,
    fontSize: 14.5,
  },
  voiceNameSelected: {
    fontFamily: Fonts.poppins.bold,
  },
  voiceItemDesc: {
    fontFamily: Fonts.poppins.regular,
    fontSize: 11,
  },
  voiceItemActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  itemPlayBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeCheckBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: Colors.LavenderPurple,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default VoiceCardItem;
