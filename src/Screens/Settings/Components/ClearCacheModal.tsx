import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { Trash2 } from 'lucide-react-native';
import { Typography } from '../../../Theme/Typographys';
import ResponsivePixels from '../../../Assets/StyleUtilities/ResponsivePixels';
import { useSettingsTheme } from './types';

interface ClearCacheModalProps {
  visible: boolean;
  cacheSize: string;
  onCancel: () => void;
  onConfirm: () => void;
}

export const ClearCacheModal: React.FC<ClearCacheModalProps> = ({
  visible,
  cacheSize,
  onCancel,
  onConfirm,
}) => {
  const { cardBg, textPrimary, textSecondary, borderLight } =
    useSettingsTheme();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.dialogBackdrop}>
        <View
          style={[
            styles.dialogCard,
            { backgroundColor: cardBg, borderColor: borderLight },
          ]}
        >
          <View
            style={[styles.dialogIconWrap, { backgroundColor: '#FFF0F0' }]}
          >
            <Trash2 size={24} color="#FF3B30" strokeWidth={2.2} />
          </View>
          <Text style={[styles.dialogTitle, { color: textPrimary }]}>
            Clear Cache?
          </Text>
          <Text style={[styles.dialogDesc, { color: textSecondary }]}>
            This will remove {cacheSize} of temporary audio samples, waveforms,
            and image caches. Your tasks and reminders will stay safe.
          </Text>
          <View style={styles.dialogActions}>
            <TouchableOpacity
              activeOpacity={0.8}
              style={[
                styles.dialogBtnSecondary,
                { borderColor: borderLight },
              ]}
              onPress={onCancel}
            >
              <Text
                style={[
                  styles.dialogBtnSecondaryText,
                  { color: textSecondary },
                ]}
              >
                Cancel
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.85}
              style={[styles.dialogBtnDanger, { backgroundColor: '#FF3B30' }]}
              onPress={onConfirm}
            >
              <Text style={styles.dialogBtnDangerText}>Clear Now</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  dialogBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: ResponsivePixels.size24,
  },
  dialogCard: {
    width: '100%',
    borderRadius: 24,
    borderWidth: 1.5,
    padding: ResponsivePixels.size20,
    alignItems: 'center',
  },
  dialogIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  dialogTitle: {
    ...Typography.h6Bold,
    fontSize: 18,
    marginBottom: 8,
  },
  dialogDesc: {
    ...Typography.bodySmallPoppinsRegular,
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 20,
  },
  dialogActions: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  dialogBtnSecondary: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dialogBtnSecondaryText: {
    ...Typography.bodyMediumPoppinsSemiBold,
    fontSize: 13,
  },
  dialogBtnDanger: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dialogBtnDangerText: {
    ...Typography.bodyMediumPoppinsSemiBold,
    fontSize: 13,
    color: '#FFFFFF',
  },
});

export default ClearCacheModal;
