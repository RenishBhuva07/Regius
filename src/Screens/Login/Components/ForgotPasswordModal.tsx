import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { KeyRound, X } from 'lucide-react-native';
import { Typography } from '../../../Theme/Typographys';
import { Colors } from '../../../Assets/StyleUtilities/Colors';
import ResponsivePixels from '../../../Assets/StyleUtilities/ResponsivePixels';
import { Fonts } from '../../../Theme/fonts';
import { ToastHelper } from '../../../Common/ToastHelper';
import { MailFieldSvg } from './LoginSvgs';

interface ForgotPasswordModalProps {
  visible: boolean;
  onClose: () => void;
  isDarkMode?: boolean;
}

export const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({
  visible,
  onClose,
  isDarkMode = false,
}) => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const cardBg = isDarkMode ? '#1E2228' : Colors.DefaultWhite;
  const textPrimary = isDarkMode
    ? Colors.PureWhiteText
    : Colors.MidnightInkText;
  const textSecondary = isDarkMode ? '#A3A8B1' : Colors.SubtitleGray;
  const borderLight = isDarkMode ? '#2C3035' : Colors.RingBorder;
  const inputBg = isDarkMode ? '#121417' : '#FAF8F5';

  const handleSendResetLink = () => {
    if (!email.trim()) {
      ToastHelper.error('Please enter your email address', 'Missing Email');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      ToastHelper.error('Please enter a valid email address', 'Invalid Email');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      ToastHelper.success(
        `Reset link sent to ${email.trim()}`,
        'Instructions Sent',
      );
      setEmail('');
      onClose();
    }, 1200);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={styles.backdrop}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View
          style={[
            styles.card,
            { backgroundColor: cardBg, borderColor: borderLight },
          ]}
        >
          {/* Close Button */}
          <TouchableOpacity
            activeOpacity={0.7}
            style={[
              styles.closeBtn,
              { backgroundColor: isDarkMode ? '#2C3035' : '#F2EFEB' },
            ]}
            onPress={onClose}
          >
            <X size={18} color={textSecondary} strokeWidth={2.4} />
          </TouchableOpacity>

          {/* Key Icon Badge */}
          <View style={styles.iconCircle}>
            <KeyRound
              size={26}
              color={Colors.LavenderPurple}
              strokeWidth={2.2}
            />
          </View>

          <Text style={[styles.title, { color: textPrimary }]}>
            Reset Password
          </Text>
          <Text style={[styles.description, { color: textSecondary }]}>
            Enter the email associated with your Regius account and we'll send a
            link to recover your access.
          </Text>

          {/* Input Box */}
          <View
            style={[
              styles.inputContainer,
              { backgroundColor: inputBg, borderColor: borderLight },
            ]}
          >
            <View style={styles.inputIcon}>
              <MailFieldSvg color={Colors.LavenderPurple} />
            </View>
            <TextInput
              style={[styles.input, { color: textPrimary }]}
              placeholder="name@example.com"
              placeholderTextColor={textSecondary}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          {/* Actions */}
          <TouchableOpacity
            activeOpacity={0.85}
            style={[
              styles.primaryBtn,
              {
                backgroundColor: isDarkMode
                  ? Colors.PureWhiteText
                  : Colors.MidnightCharcoal,
              },
            ]}
            onPress={handleSendResetLink}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator
                size="small"
                color={
                  isDarkMode ? Colors.MidnightInkText : Colors.PureWhiteText
                }
              />
            ) : (
              <Text
                style={[
                  styles.primaryBtnText,
                  {
                    color: isDarkMode
                      ? Colors.MidnightInkText
                      : Colors.PureWhiteText,
                  },
                ]}
              >
                Send Reset Link
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={onClose}
            style={styles.cancelTouch}
          >
            <Text style={[styles.cancelText, { color: textSecondary }]}>
              Back to Sign In
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: ResponsivePixels.size24,
  },
  card: {
    width: '100%',
    borderRadius: ResponsivePixels.size28,
    borderWidth: 1.5,
    padding: ResponsivePixels.size24,
    alignItems: 'center',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
  },
  closeBtn: {
    position: 'absolute',
    top: ResponsivePixels.size16,
    right: ResponsivePixels.size16,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#EFF2FE',
    borderWidth: 1.5,
    borderColor: '#D8DBFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: ResponsivePixels.size16,
    shadowColor: Colors.LavenderPurple,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  title: {
    ...Typography.h6Bold,
    fontSize: 20,
    marginBottom: ResponsivePixels.size8,
  },
  description: {
    ...Typography.bodySmallPoppinsRegular,
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 19,
    marginBottom: ResponsivePixels.size20,
    paddingHorizontal: ResponsivePixels.size8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: 52,
    borderRadius: ResponsivePixels.size16,
    borderWidth: 1.5,
    paddingHorizontal: ResponsivePixels.size14,
    marginBottom: ResponsivePixels.size20,
  },
  inputIcon: {
    marginRight: ResponsivePixels.size10,
  },
  input: {
    flex: 1,
    fontFamily: Fonts.poppins.medium,
    fontSize: 14,
  },
  primaryBtn: {
    width: '100%',
    height: 50,
    borderRadius: ResponsivePixels.size26,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryBtnText: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: 15,
  },
  cancelTouch: {
    marginTop: ResponsivePixels.size14,
    paddingVertical: 6,
  },
  cancelText: {
    fontFamily: Fonts.poppins.medium,
    fontSize: 13,
  },
});

export default ForgotPasswordModal;
