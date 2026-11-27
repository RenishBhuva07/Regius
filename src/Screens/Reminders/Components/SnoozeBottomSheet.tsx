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
import { Clock, Sunrise, X } from 'lucide-react-native';
import { Fonts } from '../../../Theme/fonts';
import { Colors, withAlpha } from '../../../Assets/StyleUtilities/Colors';
import { useAppTheme } from '../../../Theme/useAppTheme';
import ResponsivePixels from '../../../Assets/StyleUtilities/ResponsivePixels';
import { Reminder } from '../../../Services/Reminders/types';

interface SnoozeBottomSheetProps {
  visible: boolean;
  reminder: Reminder | null;
  onClose: () => void;
  onSelectSnooze: (reminderId: string, offsetMinutes: number) => void;
}

function getMinutesUntilTomorrow9AM(): number {
  const now = new Date();
  const tomorrow = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + 1,
    9,
    0,
    0,
    0,
  );
  return Math.max(60, Math.round((tomorrow.getTime() - now.getTime()) / 60000));
}

export const SnoozeBottomSheet: React.FC<SnoozeBottomSheetProps> = ({
  visible,
  reminder,
  onClose,
  onSelectSnooze,
}) => {
  const insets = useSafeAreaInsets();
  const { isDarkMode, cardBg, textPrimary, textSecondary, borderLight } =
    useAppTheme();

  if (!reminder) return null;

  const options = [
    { label: '10 minutes', sub: 'Quick breather', minutes: 10, icon: Clock },
    { label: '30 minutes', sub: 'Short focus block', minutes: 30, icon: Clock },
    { label: '1 hour', sub: 'Later today', minutes: 60, icon: Clock },
    {
      label: 'Tomorrow morning',
      sub: '09:00 AM',
      minutes: getMinutesUntilTomorrow9AM(),
      icon: Sunrise,
    },
  ];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable
          style={[
            styles.sheet,
            {
              backgroundColor: isDarkMode ? cardBg : Colors.CreamSurfaceAlt,
              borderColor: isDarkMode ? borderLight : Colors.RingBorder,
              paddingBottom: Math.max(insets.bottom, ResponsivePixels.size20),
            },
          ]}
          onPress={e => e.stopPropagation()}
        >
          <View style={styles.header}>
            <View style={styles.headerTextWrap}>
              <Text style={[styles.title, { color: textPrimary }]}>
                Snooze Reminder
              </Text>
              <Text
                style={[styles.subtitle, { color: textSecondary }]}
                numberOfLines={1}
              >
                {reminder.title}
              </Text>
            </View>
            <TouchableOpacity
              onPress={onClose}
              style={[
                styles.closeBtn,
                isDarkMode && { backgroundColor: Colors.DarkSurfaceAlt },
              ]}
              accessibilityRole="button"
              accessibilityLabel="Close snooze options"
            >
              <X size={ResponsivePixels.size16} color={textSecondary} />
            </TouchableOpacity>
          </View>

          <View style={styles.optionsGrid}>
            {options.map(opt => {
              const Icon = opt.icon;
              return (
                <TouchableOpacity
                  key={opt.label}
                  activeOpacity={0.82}
                  onPress={() => {
                    onSelectSnooze(reminder.id, opt.minutes);
                    onClose();
                  }}
                  style={[
                    styles.optionCard,
                    isDarkMode && {
                      backgroundColor: Colors.DarkSurfaceAlt,
                      borderColor: Colors.CarbonSlate,
                    },
                  ]}
                  accessibilityRole="button"
                  accessibilityLabel={`Snooze for ${opt.label}`}
                >
                  <View
                    style={[
                      styles.iconWrap,
                      isDarkMode && {
                        backgroundColor: Colors.MindfulDarkIconBg,
                        borderColor: Colors.LavenderPurple,
                      },
                    ]}
                  >
                    <Icon
                      size={ResponsivePixels.size16}
                      color={Colors.LavenderPurple}
                      strokeWidth={2.3}
                    />
                  </View>
                  <View style={styles.optionTextWrap}>
                    <Text style={[styles.optionLabel, { color: textPrimary }]}>
                      {opt.label}
                    </Text>
                    <Text style={[styles.optionSub, { color: textSecondary }]}>
                      {opt.sub}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: withAlpha(Colors.PureBlack, 0.55),
    justifyContent: 'flex-end',
  },
  sheet: {
    borderTopLeftRadius: ResponsivePixels.size28,
    borderTopRightRadius: ResponsivePixels.size28,
    borderWidth: 1.5,
    borderBottomWidth: 0,
    paddingHorizontal: ResponsivePixels.size20,
    paddingTop: ResponsivePixels.size20,
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: ResponsivePixels.size16,
  },
  headerTextWrap: {
    flex: 1,
    paddingRight: ResponsivePixels.size12,
  },
  title: {
    fontFamily: Fonts.poppins.bold,
    fontSize: ResponsivePixels.size17,
  },
  subtitle: {
    fontFamily: Fonts.poppins.regular,
    fontSize: ResponsivePixels.size12_5,
    marginTop: ResponsivePixels.size2,
  },
  closeBtn: {
    width: ResponsivePixels.size32,
    height: ResponsivePixels.size32,
    borderRadius: ResponsivePixels.size16,
    backgroundColor: Colors.GrayPillSurface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionsGrid: {
    gap: ResponsivePixels.size10,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ResponsivePixels.size12,
    backgroundColor: Colors.PureWhite,
    borderRadius: ResponsivePixels.size18,
    borderWidth: 1.5,
    borderColor: Colors.RingBorder,
    paddingHorizontal: ResponsivePixels.size14,
    paddingVertical: ResponsivePixels.size12,
  },
  iconWrap: {
    width: ResponsivePixels.size36,
    height: ResponsivePixels.size36,
    borderRadius: ResponsivePixels.size12,
    backgroundColor: Colors.MindfulLightBg,
    borderWidth: 1,
    borderColor: Colors.MindfulLightBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionTextWrap: {
    flex: 1,
  },
  optionLabel: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: ResponsivePixels.size14,
  },
  optionSub: {
    fontFamily: Fonts.poppins.regular,
    fontSize: ResponsivePixels.size11_5,
  },
});

export default SnoozeBottomSheet;
