import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
} from 'react-native';
import { Mic, Play, Square, Check, X } from 'lucide-react-native';
import { Typography } from '../../../Theme/Typographys';
import { Colors as StaticColors } from '../../../Assets/StyleUtilities/Colors';
import ResponsivePixels from '../../../Assets/StyleUtilities/ResponsivePixels';
import { VoiceOption, useSettingsTheme } from './types';

interface VoiceStudioModalProps {
  visible: boolean;
  onClose: () => void;
  voices: VoiceOption[];
  selectedVoiceId: string;
  onSelectVoice: (voice: VoiceOption) => void;
  isPlayingPreview: boolean;
  playingVoiceId: string | null;
  onTogglePreview: (voiceId: string) => void;
}

export const VoiceStudioModal: React.FC<VoiceStudioModalProps> = ({
  visible,
  onClose,
  voices,
  selectedVoiceId,
  onSelectVoice,
  isPlayingPreview,
  playingVoiceId,
  onTogglePreview,
}) => {
  const {
    isDarkMode,
    cardBg,
    textPrimary,
    textSecondary,
    borderLight,
    surfaceAlt,
  } = useSettingsTheme();

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View
        style={[
          styles.modalContainer,
          { backgroundColor: isDarkMode ? '#121417' : '#FFFFFF' },
        ]}
      >
        <View style={[styles.modalHeader, { borderBottomColor: borderLight }]}>
          <View>
            <Text style={[styles.modalTitle, { color: textPrimary }]}>
              Voice Studio
            </Text>
            <Text style={[styles.modalSubtitle, { color: textSecondary }]}>
              Choose your default AI Assistant Voice
            </Text>
          </View>
          <TouchableOpacity
            activeOpacity={0.7}
            style={[styles.modalCloseBtn, { backgroundColor: surfaceAlt }]}
            onPress={onClose}
          >
            <X size={20} color={textPrimary} strokeWidth={2.4} />
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.modalScroll}
          contentContainerStyle={styles.modalScrollContent}
          showsVerticalScrollIndicator={false}
        >
          {voices.map(voice => {
            const isSelected = voice.id === selectedVoiceId;
            const isPlaying = isPlayingPreview && playingVoiceId === voice.id;

            return (
              <TouchableOpacity
                key={voice.id}
                activeOpacity={0.88}
                style={[
                  styles.voiceCardDetailed,
                  {
                    backgroundColor: isSelected ? voice.bgColor : cardBg,
                    borderColor: isSelected ? voice.borderColor : borderLight,
                  },
                ]}
                onPress={() => onSelectVoice(voice)}
              >
                <View style={styles.voiceDetailedTop}>
                  <View style={styles.voiceDetailedLeft}>
                    <View
                      style={[
                        styles.voiceDetailedIcon,
                        {
                          backgroundColor: voice.bgColor,
                          borderColor: voice.borderColor,
                        },
                      ]}
                    >
                      <Mic
                        size={20}
                        color={voice.accentColor}
                        strokeWidth={2.2}
                      />
                    </View>
                    <View>
                      <View style={styles.voiceNameRowDetailed}>
                        <Text
                          style={[
                            styles.voiceDetailedName,
                            { color: textPrimary },
                          ]}
                        >
                          {voice.name}
                        </Text>
                        {isSelected && (
                          <View
                            style={[
                              styles.activeBadgePill,
                              { backgroundColor: voice.accentColor },
                            ]}
                          >
                            <Text style={styles.activeBadgePillText}>
                              DEFAULT
                            </Text>
                          </View>
                        )}
                      </View>
                      <Text
                        style={[
                          styles.voiceDetailedMeta,
                          { color: textSecondary },
                        ]}
                      >
                        {voice.gender} • {voice.accent} • {voice.personality}
                      </Text>
                    </View>
                  </View>

                  <TouchableOpacity
                    activeOpacity={0.8}
                    style={[
                      styles.voicePreviewCircleBtn,
                      {
                        backgroundColor: isPlaying
                          ? '#1F2228'
                          : voice.accentColor,
                      },
                    ]}
                    onPress={e => {
                      e.stopPropagation();
                      onTogglePreview(voice.id);
                    }}
                  >
                    {isPlaying ? (
                      <Square size={13} color="#FFFFFF" fill="#FFFFFF" />
                    ) : (
                      <Play size={13} color="#FFFFFF" fill="#FFFFFF" />
                    )}
                  </TouchableOpacity>
                </View>

                <View
                  style={[
                    styles.sampleQuoteBox,
                    { backgroundColor: isSelected ? '#FFFFFF' : surfaceAlt },
                  ]}
                >
                  <Text
                    style={[styles.sampleQuoteText, { color: textSecondary }]}
                  >
                    &ldquo;{voice.sampleText}&rdquo;
                  </Text>
                </View>

                <View style={styles.voiceActionFooter}>
                  <View style={styles.voiceTagSmall}>
                    <Text
                      style={[
                        styles.voiceTagSmallText,
                        { color: voice.accentColor },
                      ]}
                    >
                      {voice.tag}
                    </Text>
                  </View>
                  {isSelected ? (
                    <View style={styles.selectedConfirmRow}>
                      <Check
                        size={16}
                        color={voice.accentColor}
                        strokeWidth={2.6}
                      />
                      <Text
                        style={[
                          styles.selectedConfirmText,
                          { color: voice.accentColor },
                        ]}
                      >
                        Active Default Voice
                      </Text>
                    </View>
                  ) : (
                    <Text
                      style={[
                        styles.selectPromptText,
                        { color: textSecondary },
                      ]}
                    >
                      Tap to select as default
                    </Text>
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <View
          style={[
            styles.modalFooter,
            { borderTopColor: borderLight, backgroundColor: cardBg },
          ]}
        >
          <TouchableOpacity
            activeOpacity={0.85}
            style={[
              styles.modalDoneBtn,
              { backgroundColor: StaticColors.ButtonDark },
            ]}
            onPress={onClose}
          >
            <Text style={styles.modalDoneBtnText}>Done</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: ResponsivePixels.size20,
    paddingTop: ResponsivePixels.size20,
    paddingBottom: ResponsivePixels.size16,
    borderBottomWidth: 1,
  },
  modalTitle: {
    ...Typography.h6Bold,
    fontSize: 20,
  },
  modalSubtitle: {
    ...Typography.bodySmallPoppinsRegular,
    fontSize: 12,
    marginTop: 2,
  },
  modalCloseBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalScroll: {
    flex: 1,
  },
  modalScrollContent: {
    paddingHorizontal: ResponsivePixels.size20,
    paddingVertical: ResponsivePixels.size16,
    paddingBottom: 40,
  },
  voiceCardDetailed: {
    borderRadius: 20,
    borderWidth: 1.5,
    padding: ResponsivePixels.size16,
    marginBottom: ResponsivePixels.size14,
  },
  voiceDetailedTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  voiceDetailedLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  voiceDetailedIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  voiceNameRowDetailed: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  voiceDetailedName: {
    ...Typography.bodyLargePoppinsSemiBold,
    fontSize: 16,
  },
  activeBadgePill: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  activeBadgePillText: {
    fontFamily: Typography.bodySmallRanadeBold.fontFamily,
    fontSize: 9,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  voiceDetailedMeta: {
    ...Typography.bodySmallPoppinsRegular,
    fontSize: 11,
    marginTop: 2,
  },
  voicePreviewCircleBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sampleQuoteBox: {
    padding: 10,
    borderRadius: 12,
    marginTop: 12,
  },
  sampleQuoteText: {
    ...Typography.bodySmallPoppinsRegular,
    fontSize: 12,
    fontStyle: 'italic',
  },
  voiceActionFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  voiceTagSmall: {
    borderRadius: 6,
  },
  voiceTagSmallText: {
    ...Typography.bodySmallPoppinsSemiBold,
    fontSize: 11,
  },
  selectedConfirmRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  selectedConfirmText: {
    ...Typography.bodySmallPoppinsSemiBold,
    fontSize: 12,
  },
  selectPromptText: {
    ...Typography.bodySmallPoppinsRegular,
    fontSize: 11,
  },
  modalFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: ResponsivePixels.size20,
    paddingVertical: ResponsivePixels.size16,
    borderTopWidth: 1,
  },
  modalDoneBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalDoneBtnText: {
    ...Typography.bodyLargePoppinsSemiBold,
    color: '#FFFFFF',
    fontSize: 15,
  },
});

export default VoiceStudioModal;
