import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import { User, Mail, FileText, ShieldCheck } from 'lucide-react-native';

import { Fonts } from '../../../Theme/fonts';
import { Colors } from '../../../Assets/StyleUtilities/Colors';
import { Typography } from '../../../Theme/Typographys';
import ResponsivePixels from '../../../Assets/StyleUtilities/ResponsivePixels';

export interface ProfileCredentialsFormProps {
  name: string;
  email: string;
  bio: string;
  role: string;
  onChangeName: (val: string) => void;
  onChangeEmail: (val: string) => void;
  onChangeBio: (val: string) => void;
  onChangeRole: (val: string) => void;
  isDarkMode: boolean;
}

export const ProfileCredentialsForm: React.FC<ProfileCredentialsFormProps> =
  React.memo(
    ({
      name,
      email,
      bio,
      role,
      onChangeName,
      onChangeEmail,
      onChangeBio,
      onChangeRole,
      isDarkMode,
    }) => {
      const [focusedInput, setFocusedInput] = useState<string | null>(null);

      const cardBg = isDarkMode ? '#1E2228' : Colors.DefaultWhite;
      const textPrimary = isDarkMode
        ? Colors.PureWhiteText
        : Colors.MidnightInkText;
      const textSecondary = isDarkMode ? '#A3A8B1' : Colors.SubtitleGray;
      const borderLight = isDarkMode ? '#2C3035' : '#E8E2D5';
      const inputBg = isDarkMode ? '#171A1F' : '#FAF8F5';

      return (
        <View style={styles.container}>
          <Text style={[styles.sectionHeading, { color: textSecondary }]}>
            PERSONAL CREDENTIALS
          </Text>

          <View
            style={[
              styles.formCard,
              {
                backgroundColor: cardBg,
                borderColor: isDarkMode
                  ? 'rgba(255, 255, 255, 0.12)'
                  : '#FFFFFF',
                borderBottomColor: isDarkMode ? '#171A20' : '#E2DCD0',
                shadowColor: isDarkMode
                  ? '#000000'
                  : 'rgba(131, 131, 214, 0.14)',
              },
            ]}
          >
            {/* Full Name Field */}
            <View style={styles.inputGroup}>
              <View style={styles.inputLabelRow}>
                <User
                  size={15}
                  color={Colors.LavenderPurple}
                  strokeWidth={2.2}
                />
                <Text style={[styles.inputLabel, { color: textPrimary }]}>
                  Full Name
                </Text>
              </View>
              <View
                style={[
                  styles.inputWrap,
                  {
                    backgroundColor: inputBg,
                    borderColor:
                      focusedInput === 'name'
                        ? Colors.LavenderPurple
                        : borderLight,
                  },
                ]}
              >
                <TextInput
                  style={[styles.input, { color: textPrimary }]}
                  value={name}
                  onChangeText={onChangeName}
                  placeholder="Your full name"
                  placeholderTextColor={textSecondary}
                  onFocus={() => setFocusedInput('name')}
                  onBlur={() => setFocusedInput(null)}
                />
              </View>
            </View>

            <View
              style={[styles.fieldDivider, { backgroundColor: borderLight }]}
            />

            {/* Email Address Field */}
            <View style={styles.inputGroup}>
              <View style={styles.inputLabelRow}>
                <Mail
                  size={15}
                  color={Colors.LavenderPurple}
                  strokeWidth={2.2}
                />
                <Text style={[styles.inputLabel, { color: textPrimary }]}>
                  Email Address
                </Text>
              </View>
              <View
                style={[
                  styles.inputWrap,
                  {
                    backgroundColor: inputBg,
                    borderColor:
                      focusedInput === 'email'
                        ? Colors.LavenderPurple
                        : borderLight,
                  },
                ]}
              >
                <TextInput
                  style={[styles.input, { color: textPrimary }]}
                  value={email}
                  onChangeText={onChangeEmail}
                  placeholder="alex@domain.com"
                  placeholderTextColor={textSecondary}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  onFocus={() => setFocusedInput('email')}
                  onBlur={() => setFocusedInput(null)}
                />
              </View>
            </View>

            <View
              style={[styles.fieldDivider, { backgroundColor: borderLight }]}
            />

            {/* Bio Field */}
            <View style={styles.inputGroup}>
              <View style={styles.inputLabelRow}>
                <FileText
                  size={15}
                  color={Colors.LavenderPurple}
                  strokeWidth={2.2}
                />
                <Text style={[styles.inputLabel, { color: textPrimary }]}>
                  Professional Bio
                </Text>
              </View>
              <View
                style={[
                  styles.inputWrap,
                  styles.textAreaWrap,
                  {
                    backgroundColor: inputBg,
                    borderColor:
                      focusedInput === 'bio'
                        ? Colors.LavenderPurple
                        : borderLight,
                  },
                ]}
              >
                <TextInput
                  style={[
                    styles.input,
                    styles.textArea,
                    { color: textPrimary },
                  ]}
                  value={bio}
                  onChangeText={onChangeBio}
                  placeholder="Architect & Product Designer"
                  placeholderTextColor={textSecondary}
                  multiline
                  numberOfLines={3}
                  onFocus={() => setFocusedInput('bio')}
                  onBlur={() => setFocusedInput(null)}
                />
              </View>
            </View>

            <View
              style={[styles.fieldDivider, { backgroundColor: borderLight }]}
            />

            {/* Role Title */}
            <View style={styles.inputGroup}>
              <View style={styles.inputLabelRow}>
                <ShieldCheck
                  size={15}
                  color={Colors.LavenderPurple}
                  strokeWidth={2.2}
                />
                <Text style={[styles.inputLabel, { color: textPrimary }]}>
                  Membership Designation
                </Text>
              </View>
              <View
                style={[
                  styles.inputWrap,
                  {
                    backgroundColor: inputBg,
                    borderColor:
                      focusedInput === 'role'
                        ? Colors.LavenderPurple
                        : borderLight,
                  },
                ]}
              >
                <TextInput
                  style={[styles.input, { color: textPrimary }]}
                  value={role}
                  onChangeText={onChangeRole}
                  placeholder="Regius Pro Member"
                  placeholderTextColor={textSecondary}
                  onFocus={() => setFocusedInput('role')}
                  onBlur={() => setFocusedInput(null)}
                />
              </View>
            </View>
          </View>
        </View>
      );
    },
  );

const styles = StyleSheet.create({
  container: {
    marginBottom: ResponsivePixels.size24,
  },
  sectionHeading: {
    ...Typography.bodySuperSmallPoppinsRegularLoose,
    fontFamily: Fonts.poppins.semiBold,
    fontSize: 11,
    letterSpacing: 1.1,
    marginHorizontal: ResponsivePixels.size16,
    marginBottom: ResponsivePixels.size8,
  },
  formCard: {
    marginHorizontal: ResponsivePixels.size16,
    borderRadius: 22,
    borderWidth: 1.5,
    borderBottomWidth: 3.5,
    padding: ResponsivePixels.size16,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 3,
  },
  inputGroup: {
    marginVertical: 4,
  },
  inputLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  inputLabel: {
    fontFamily: Fonts.poppins.medium,
    fontSize: 13,
  },
  inputWrap: {
    borderRadius: 14,
    borderWidth: 1.5,
    paddingHorizontal: 14,
    height: 48,
    justifyContent: 'center',
  },
  textAreaWrap: {
    height: 80,
    paddingVertical: 10,
  },
  input: {
    fontFamily: Fonts.poppins.regular,
    fontSize: 14,
    padding: 0,
  },
  textArea: {
    height: 60,
    textAlignVertical: 'top',
  },
  fieldDivider: {
    height: StyleSheet.hairlineWidth,
    marginVertical: 12,
  },
});

export default ProfileCredentialsForm;
