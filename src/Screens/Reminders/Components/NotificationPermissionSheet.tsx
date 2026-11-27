import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Pressable,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BellRing } from 'lucide-react-native';
import Toast from 'react-native-toast-message';
import { Fonts } from '../../../Theme/fonts';
import { Colors, withAlpha } from '../../../Assets/StyleUtilities/Colors';
import { useAppTheme } from '../../../Theme/useAppTheme';
import ResponsivePixels from '../../../Assets/StyleUtilities/ResponsivePixels';

interface NotificationPermissionSheetProps {
  visible: boolean;
  onAllow: () => Promise<boolean>;
  onDismiss: () => void;
}

export const NotificationPermissionSheet: React.FC<
  NotificationPermissionSheetProps
> = ({ visible, onAllow, onDismiss }) => {
  const insets = useSafeAreaInsets();
  const { isDarkMode, cardBg, textPrimary, textSecondary, borderLight } =
    useAppTheme();

  const handleAllow = async () => {
    const granted = await onAllow();
    if (!granted) {
      Toast.show({
        type: 'info',
        text1: 'Notifications Disabled',
        text2:
          'Your reminder is saved. Enable notifications in Settings to receive alerts.',
      });
    } else {
      Toast.show({
        type: 'success',
        text1: 'Notifications Enabled',
        text2: 'Regius will alert you right on time.',
      });
    }
  };

  const handleLater = () => {
    onDismiss();
    Toast.show({
      type: 'info',
      text1: 'Reminder Saved',
      text2: 'Enable notifications in Settings anytime to receive alerts.',
    });
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleLater}
    >
      <Pressable style={styles.backdrop} onPress={handleLater}>
        <Pressable
          style={[
            styles.sheet,
            {
              backgroundColor: isDarkMode ? cardBg : Colors.CreamSurfaceAlt,
              borderColor: isDarkMode ? borderLight : Colors.RingBorder,
              paddingBottom: Math.max(insets.bottom, ResponsivePixels.size24),
            },
          ]}
          onPress={e => e.stopPropagation()}
        >
          <View
            style={[
              styles.iconAura,
              isDarkMode && {
                backgroundColor: Colors.WellnessDarkIconBg,
                borderColor: Colors.AccentGreen,
              },
            ]}
          >
            <BellRing
              size={ResponsivePixels.size28}
              color={Colors.GreenGracious}
              strokeWidth={2.2}
            />
          </View>

          <Text style={[styles.title, { color: textPrimary }]}>
            Never Miss a Moment
          </Text>
          <Text style={[styles.body, { color: textSecondary }]}>
            To receive alerts at the right moment—even when Regius is closed—allow
            notification access.
          </Text>

          <TouchableOpacity
            activeOpacity={0.86}
            onPress={handleAllow}
            style={[
              styles.primaryBtn,
              isDarkMode && { backgroundColor: Colors.LavenderPurple },
            ]}
            accessibilityRole="button"
            accessibilityLabel="Allow Notifications"
          >
            <Text style={styles.primaryBtnText}>Allow Notifications</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.75}
            onPress={handleLater}
            style={styles.secondaryBtn}
            accessibilityRole="button"
            accessibilityLabel="Maybe Later"
          >
            <Text style={[styles.secondaryBtnText, { color: textSecondary }]}>
              Maybe Later
            </Text>
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: withAlpha(Colors.PureBlack, 0.58),
    justifyContent: 'flex-end',
  },
  sheet: {
    borderTopLeftRadius: ResponsivePixels.size30,
    borderTopRightRadius: ResponsivePixels.size30,
    borderWidth: 1.5,
    borderBottomWidth: 0,
    paddingHorizontal: ResponsivePixels.size24,
    paddingTop: ResponsivePixels.size28,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: Colors.PureBlack,
        shadowOffset: { width: 0, height: -6 },
        shadowOpacity: 0.25,
        shadowRadius: 16,
      },
      android: {
        elevation: 12,
      },
    }),
  },
  iconAura: {
    width: ResponsivePixels.size64,
    height: ResponsivePixels.size64,
    borderRadius: ResponsivePixels.size32,
    backgroundColor: Colors.WellnessLightBg,
    borderWidth: 1.5,
    borderColor: Colors.WellnessLightBorder,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: ResponsivePixels.size16,
  },
  title: {
    fontFamily: Fonts.poppins.bold,
    fontSize: ResponsivePixels.size19,
    textAlign: 'center',
    marginBottom: ResponsivePixels.size8,
  },
  body: {
    fontFamily: Fonts.poppins.regular,
    fontSize: ResponsivePixels.size13_5,
    lineHeight: ResponsivePixels.size20,
    textAlign: 'center',
    marginBottom: ResponsivePixels.size22,
  },
  primaryBtn: {
    width: '100%',
    backgroundColor: Colors.MidnightCharcoal,
    borderRadius: ResponsivePixels.size50,
    paddingVertical: ResponsivePixels.size15,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: ResponsivePixels.size10,
  },
  primaryBtnText: {
    fontFamily: Fonts.poppins.bold,
    fontSize: ResponsivePixels.size14_5,
    color: Colors.PureWhite,
  },
  secondaryBtn: {
    paddingVertical: ResponsivePixels.size10,
    paddingHorizontal: ResponsivePixels.size20,
  },
  secondaryBtnText: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: ResponsivePixels.size13_5,
  },
});

export default NotificationPermissionSheet;
