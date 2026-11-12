import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { LogOut } from 'lucide-react-native';
import { Typography } from '../../../Theme/Typographys';
import ResponsivePixels from '../../../Assets/StyleUtilities/ResponsivePixels';
import Colors, { withAlpha } from '../../../Assets/StyleUtilities/Colors';
import { useSettingsTheme } from './types';

interface LogoutConfirmModalProps {
  visible: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export const LogoutConfirmModal: React.FC<LogoutConfirmModalProps> = ({
  visible,
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
            style={[
              styles.dialogIconWrap,
              { backgroundColor: Colors.VoiceBellaBg },
            ]}
          >
            <LogOut size={ResponsivePixels.size24} color={Colors.CrimsonPulse} strokeWidth={2.2} />
          </View>
          <Text style={[styles.dialogTitle, { color: textPrimary }]}>
            Sign Out?
          </Text>
          <Text style={[styles.dialogDesc, { color: textSecondary }]}>
            Are you sure you want to sign out of Regius? Your local offline
            sync will pause until you log back in.
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
              style={[
                styles.dialogBtnDanger,
                { backgroundColor: Colors.CrimsonPulse },
              ]}
              onPress={onConfirm}
            >
              <Text style={styles.dialogBtnDangerText}>Sign Out</Text>
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
    backgroundColor: withAlpha(Colors.PureBlack, 0.5),
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: ResponsivePixels.size24,
  },
  dialogCard: {
    width: '100%',
    borderRadius: ResponsivePixels.size24,
    borderWidth: 1.5,
    padding: ResponsivePixels.size20,
    alignItems: 'center',
  },
  dialogIconWrap: {
    width: ResponsivePixels.size52,
    height: ResponsivePixels.size52,
    borderRadius: ResponsivePixels.size26,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: ResponsivePixels.size14,
  },
  dialogTitle: {
    ...Typography.h6Bold,
    fontSize: ResponsivePixels.size18,
    marginBottom: ResponsivePixels.size8,
  },
  dialogDesc: {
    ...Typography.bodySmallPoppinsRegular,
    fontSize: ResponsivePixels.size13,
    textAlign: 'center',
    lineHeight: ResponsivePixels.size18,
    marginBottom: ResponsivePixels.size20,
  },
  dialogActions: {
    flexDirection: 'row',
    gap: ResponsivePixels.size12,
    width: '100%',
  },
  dialogBtnSecondary: {
    flex: 1,
    paddingVertical: ResponsivePixels.size12,
    borderRadius: ResponsivePixels.size14,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dialogBtnSecondaryText: {
    ...Typography.bodyMediumPoppinsSemiBold,
    fontSize: ResponsivePixels.size13,
  },
  dialogBtnDanger: {
    flex: 1,
    paddingVertical: ResponsivePixels.size12,
    borderRadius: ResponsivePixels.size14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dialogBtnDangerText: {
    ...Typography.bodyMediumPoppinsSemiBold,
    fontSize: ResponsivePixels.size13,
    color: Colors.PureWhite,
  },
});

export default LogoutConfirmModal;
