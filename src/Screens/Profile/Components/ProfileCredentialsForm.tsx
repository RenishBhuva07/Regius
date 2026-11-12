import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import { User, Mail, FileText, ShieldCheck } from 'lucide-react-native';

import { Fonts } from '../../../Theme/fonts';
import { Colors, withAlpha } from '../../../Assets/StyleUtilities/Colors';
import { Typography } from '../../../Theme/Typographys';
import ResponsivePixels from '../../../Assets/StyleUtilities/ResponsivePixels';
import { useTheme } from '../../../Theme/ThemeContext';

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
      const { isDarkMode: themeIsDark, Colors: themeColors } = useTheme();

      const cardBg =
        themeColors.CardBackground ||
        (isDarkMode ? Colors.DarkCardBackground : Colors.PureWhite);
      const textPrimary =
        themeColors.PrimaryText ||
        (isDarkMode ? Colors.PureWhite : Colors.PureBlack);
      const textSecondary =
        themeColors.SecondaryText ||
        (isDarkMode ? Colors.SteelMist : Colors.SubtitleGray);
      const canvasTextSecondary =
        themeColors.CanvasTextSecondary ||
        (isDarkMode ? Colors.SteelMist : Colors.SubtitleGray);
      const borderLight =
        themeColors.BorderLight ||
        (isDarkMode ? Colors.CarbonSlate : Colors.RingBorder);
      const inputBg =
        themeColors.SurfaceAlt ||
        (isDarkMode ? Colors.DarkSurfaceAlt : Colors.CreamSurfaceAlt);
      const themeAccent =
        themeColors.AccentLight ||
        themeColors.Accent ||
        Colors.LavenderPurple;

      return (
        <View style={styles.container}>
          <Text style={[styles.sectionHeading, { color: canvasTextSecondary }]}>
            PERSONAL CREDENTIALS
          </Text>

          <View
            style={[
              styles.formCard,
              {
                backgroundColor: cardBg,
                borderColor: isDarkMode
                  ? withAlpha(Colors.PureWhite, 0.12)
                  : Colors.PureWhite,
                borderBottomColor: isDarkMode
                  ? Colors.DarkSurfaceDeep
                  : Colors.WarmStoneBorder,
                shadowColor: isDarkMode
                  ? Colors.PureBlack
                  : withAlpha(Colors.LavenderPurple, 0.14),
              },
            ]}
          >
            {/* Full Name Field */}
            <View style={styles.inputGroup}>
              <View style={styles.inputLabelRow}>
                <User
                  size={ResponsivePixels.size15}
                  color={themeAccent}
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
                        ? themeAccent
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
                  size={ResponsivePixels.size15}
                  color={themeAccent}
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
                        ? themeAccent
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
                  size={ResponsivePixels.size15}
                  color={themeAccent}
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
                        ? themeAccent
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
                  size={ResponsivePixels.size15}
                  color={themeAccent}
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
                        ? themeAccent
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
    fontSize: ResponsivePixels.size11,
    letterSpacing: 1.1,
    marginHorizontal: ResponsivePixels.size16,
    marginBottom: ResponsivePixels.size8,
  },
  formCard: {
    marginHorizontal: ResponsivePixels.size16,
    borderRadius: ResponsivePixels.size22,
    borderWidth: 1.5,
    borderBottomWidth: 3.5,
    padding: ResponsivePixels.size16,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 3,
  },
  inputGroup: {
    marginVertical: ResponsivePixels.size4,
  },
  inputLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ResponsivePixels.size8,
    marginBottom: ResponsivePixels.size8,
  },
  inputLabel: {
    fontFamily: Fonts.poppins.medium,
    fontSize: ResponsivePixels.size13,
  },
  inputWrap: {
    borderRadius: ResponsivePixels.size14,
    borderWidth: 1.5,
    paddingHorizontal: ResponsivePixels.size14,
    height: ResponsivePixels.size48,
    justifyContent: 'center',
  },
  textAreaWrap: {
    height: ResponsivePixels.size80,
    paddingVertical: ResponsivePixels.size10,
  },
  input: {
    fontFamily: Fonts.poppins.regular,
    fontSize: ResponsivePixels.size14,
    padding: 0,
  },
  textArea: {
    height: ResponsivePixels.size60,
    textAlignVertical: 'top',
  },
  fieldDivider: {
    height: StyleSheet.hairlineWidth,
    marginVertical: ResponsivePixels.size12,
  },
});

export default ProfileCredentialsForm;
