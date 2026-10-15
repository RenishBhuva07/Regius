import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Animated,
  Dimensions,
  Pressable,
} from 'react-native';
import {
  Mic,
  X,
  Sparkles,
  Volume2,
  RotateCcw,
  Clock,
} from 'lucide-react-native';
import { Fonts } from '../../../Theme/fonts';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface VoiceAssistantSheetProps {
  visible: boolean;
  onClose: () => void;
  onActionSelected?: (actionType: string) => void;
}

export const VoiceAssistantSheet: React.FC<VoiceAssistantSheetProps> = ({
  visible,
  onClose,
  onActionSelected,
}) => {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;

  useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, {
        toValue: 0,
        friction: 8,
        tension: 65,
        useNativeDriver: true,
      }).start();

      const pulseLoop = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.18,
            duration: 900,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 900,
            useNativeDriver: true,
          }),
        ]),
      );
      pulseLoop.start();

      return () => {
        pulseLoop.stop();
      };
    } else {
      slideAnim.setValue(SCREEN_HEIGHT);
    }
  }, [visible, slideAnim, pulseAnim]);

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <Pressable style={styles.dismissArea} onPress={onClose} />

        <Animated.View
          style={[
            styles.sheetContainer,
            { transform: [{ translateY: slideAnim }] },
          ]}
        >
          {/* Top Grab Handle */}
          <View style={styles.handle} />

          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerTitleRow}>
              <View style={styles.assistantBadge}>
                <Sparkles size={14} color="#354C3B" />
                <Text style={styles.assistantBadgeText}>
                  Aria Flow Assistant
                </Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={onClose}
              style={styles.closeBtn}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            >
              <X size={18} color="#1B1C19" />
            </TouchableOpacity>
          </View>

          {/* Animated Glowing Voice Orb */}
          <View style={styles.orbWrapper}>
            <Animated.View
              style={[styles.pulseRing, { transform: [{ scale: pulseAnim }] }]}
            />
            <View style={styles.micCircle}>
              <Mic size={28} color="#FFFFFF" strokeWidth={2.4} />
            </View>
          </View>

          {/* Dialogue Box */}
          <View style={styles.dialogueBox}>
            <Text style={styles.greetingTitle}>“Listening for Regius...”</Text>
            <Text style={styles.dialogueBody}>
              Say any command naturally: log a habit, schedule focus blocks, or
              ask for your daily briefing.
            </Text>
          </View>

          {/* Spoken Action Quick Chips */}
          <Text style={styles.actionsHeader}>Quick Spoken Commands</Text>
          <View style={styles.chipsContainer}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => onActionSelected?.('log_meditation')}
              style={styles.actionChip}
            >
              <Sparkles size={14} color="#2E7D32" />
              <Text style={styles.actionChipText}>“Log 20-min meditation”</Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => onActionSelected?.('schedule_sprint')}
              style={styles.actionChip}
            >
              <Clock size={14} color="#D97706" />
              <Text style={styles.actionChipText}>
                “Schedule sprint review at 3 PM”
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => onActionSelected?.('play_brief')}
              style={styles.actionChip}
            >
              <Volume2 size={14} color="#1B1C19" />
              <Text style={styles.actionChipText}>Play Morning Brief</Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => onActionSelected?.('extend_time')}
              style={styles.actionChip}
            >
              <RotateCcw size={14} color="#1B1C19" />
              <Text style={styles.actionChipText}>+15 mins to Focus</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(27, 28, 25, 0.45)',
    justifyContent: 'flex-end',
  },
  dismissArea: {
    flex: 1,
  },
  sheetContainer: {
    backgroundColor: '#FBF9F3',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 22,
    paddingTop: 12,
    paddingBottom: 40,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.12,
    shadowRadius: 18,
    elevation: 16,
  },
  handle: {
    width: 44,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#C7C6CA',
    marginBottom: 16,
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  assistantBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#CCE6D0',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  assistantBadgeText: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: 12,
    color: '#354C3B',
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F0EEE8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  orbWrapper: {
    width: 100,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 12,
  },
  pulseRing: {
    position: 'absolute',
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(204, 230, 208, 0.45)',
  },
  micCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#010102',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  dialogueBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    width: '100%',
    borderWidth: 1,
    borderColor: '#EAE8E2',
    marginVertical: 14,
  },
  greetingTitle: {
    fontFamily: Fonts.poppins.bold,
    fontSize: 16,
    color: '#1B1C19',
    marginBottom: 6,
  },
  dialogueBody: {
    fontFamily: Fonts.poppins.regular,
    fontSize: 13.5,
    lineHeight: 20,
    color: '#46464A',
  },
  actionsHeader: {
    alignSelf: 'flex-start',
    fontFamily: Fonts.poppins.semiBold,
    fontSize: 12.5,
    color: '#77767B',
    marginBottom: 10,
    marginTop: 4,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    width: '100%',
  },
  actionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F0EEE8',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 22,
  },
  actionChipText: {
    fontFamily: Fonts.poppins.medium,
    fontSize: 12,
    color: '#1B1C19',
  },
});

export default VoiceAssistantSheet;
