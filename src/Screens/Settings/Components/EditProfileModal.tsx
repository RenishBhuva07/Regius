import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  TextInput,
} from 'react-native';
import { X } from 'lucide-react-native';
import Toast from 'react-native-toast-message';
import { Typography } from '../../../Theme/Typographys';
import { SVGS } from '../../../Assets/Images';
import { Colors as StaticColors } from '../../../Assets/StyleUtilities/Colors';
import ResponsivePixels from '../../../Assets/StyleUtilities/ResponsivePixels';
import { useSettingsTheme } from './types';

interface EditProfileModalProps {
  visible: boolean;
  onClose: () => void;
  initialName: string;
  initialEmail: string;
  initialBio: string;
  initialRole: string;
  onSave: (data: {
    name: string;
    email: string;
    bio: string;
    role: string;
  }) => void;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  visible,
  onClose,
  initialName,
  initialEmail,
  initialBio,
  initialRole,
  onSave,
}) => {
  const {
    isDarkMode,
    cardBg,
    textPrimary,
    textSecondary,
    borderLight,
    surfaceAlt,
  } = useSettingsTheme();

  const [editName, setEditName] = useState(initialName);
  const [editEmail, setEditEmail] = useState(initialEmail);
  const [editBio, setEditBio] = useState(initialBio);
  const [editRole, setEditRole] = useState(initialRole);

  useEffect(() => {
    if (visible) {
      setEditName(initialName);
      setEditEmail(initialEmail);
      setEditBio(initialBio);
      setEditRole(initialRole);
    }
  }, [visible, initialName, initialEmail, initialBio, initialRole]);

  const handleSave = () => {
    if (!editName.trim()) {
      Toast.show({
        type: 'error',
        text2: 'Name cannot be empty',
      });
      return;
    }
    onSave({
      name: editName.trim(),
      email: editEmail.trim(),
      bio: editBio.trim(),
      role: editRole.trim(),
    });
  };

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
              Edit Profile
            </Text>
            <Text style={[styles.modalSubtitle, { color: textSecondary }]}>
              Update your account details and persona
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
          <View style={styles.modalAvatarSection}>
            <View style={[styles.modalAvatarRing, { borderColor: '#F5C518' }]}>
              <SVGS.RegiusAvatar width={64} height={64} />
            </View>
            <Text style={[styles.modalAvatarHelp, { color: textSecondary }]}>
              Regius Crown Member Avatar
            </Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: textPrimary }]}>
              Full Name
            </Text>
            <TextInput
              style={[
                styles.textInput,
                {
                  backgroundColor: surfaceAlt,
                  color: textPrimary,
                  borderColor: borderLight,
                },
              ]}
              value={editName}
              onChangeText={setEditName}
              placeholder="Your full name"
              placeholderTextColor="#999999"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: textPrimary }]}>
              Email Address
            </Text>
            <TextInput
              style={[
                styles.textInput,
                {
                  backgroundColor: surfaceAlt,
                  color: textPrimary,
                  borderColor: borderLight,
                },
              ]}
              value={editEmail}
              onChangeText={setEditEmail}
              placeholder="name@example.com"
              placeholderTextColor="#999999"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: textPrimary }]}>
              Title / Plan
            </Text>
            <TextInput
              style={[
                styles.textInput,
                {
                  backgroundColor: surfaceAlt,
                  color: textPrimary,
                  borderColor: borderLight,
                },
              ]}
              value={editRole}
              onChangeText={setEditRole}
              placeholder="e.g. Regius Pro Member"
              placeholderTextColor="#999999"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: textPrimary }]}>
              Bio & Daily Focus
            </Text>
            <TextInput
              style={[
                styles.textInputMulti,
                {
                  backgroundColor: surfaceAlt,
                  color: textPrimary,
                  borderColor: borderLight,
                },
              ]}
              value={editBio}
              onChangeText={setEditBio}
              placeholder="What are your main goals this month?"
              placeholderTextColor="#999999"
              multiline
              numberOfLines={3}
            />
          </View>
        </ScrollView>

        <View
          style={[
            styles.modalFooter,
            { borderTopColor: borderLight, backgroundColor: cardBg },
          ]}
        >
          <TouchableOpacity
            activeOpacity={0.8}
            style={[styles.modalCancelBtn, { borderColor: borderLight }]}
            onPress={onClose}
          >
            <Text style={[styles.modalCancelBtnText, { color: textSecondary }]}>
              Cancel
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.85}
            style={[
              styles.modalSaveBtn,
              { backgroundColor: StaticColors.ButtonDark },
            ]}
            onPress={handleSave}
          >
            <Text style={styles.modalSaveBtnText}>Save Changes</Text>
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
  modalAvatarSection: {
    alignItems: 'center',
    marginBottom: ResponsivePixels.size20,
    marginTop: ResponsivePixels.size8,
  },
  modalAvatarRing: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2.5,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    backgroundColor: '#FFFCEB',
  },
  modalAvatarHelp: {
    ...Typography.bodySmallPoppinsRegular,
    fontSize: 12,
    marginTop: 8,
  },
  inputGroup: {
    marginBottom: ResponsivePixels.size16,
  },
  inputLabel: {
    ...Typography.bodyMediumPoppinsSemiBold,
    fontSize: 13,
    marginBottom: 6,
  },
  textInput: {
    borderRadius: 14,
    borderWidth: 1.5,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    fontFamily: Typography.bodyMediumPoppinsMedium.fontFamily,
  },
  textInputMulti: {
    borderRadius: 14,
    borderWidth: 1.5,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    fontFamily: Typography.bodyMediumPoppinsMedium.fontFamily,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  modalFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: ResponsivePixels.size20,
    paddingVertical: ResponsivePixels.size16,
    borderTopWidth: 1,
  },
  modalCancelBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCancelBtnText: {
    ...Typography.bodyMediumPoppinsSemiBold,
    fontSize: 14,
  },
  modalSaveBtn: {
    flex: 1.5,
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalSaveBtnText: {
    ...Typography.bodyMediumPoppinsSemiBold,
    fontSize: 14,
    color: '#FFFFFF',
  },
});

export default EditProfileModal;
