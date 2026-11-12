import React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StyleSheet,
  Platform,
} from 'react-native';
import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import { Calendar, Clock } from 'lucide-react-native';
import { Fonts } from '../Theme/fonts';
import { Colors, withAlpha } from '../Assets/StyleUtilities/Colors';
import { useAppTheme } from '../Theme/useAppTheme';
import PickerAestheticBg from '../Components/PickerAestheticBg';
import ResponsivePixels from '../Assets/StyleUtilities/ResponsivePixels';

export interface UnifiedSchedulePickerModalProps {
  visible: boolean;
  mode: 'date' | 'time';
  value: Date;
  onChange: (event: DateTimePickerEvent, date?: Date) => void;
  onClose: () => void;
  title?: string;
  badgeText?: string;
}

export const UnifiedSchedulePickerModal: React.FC<UnifiedSchedulePickerModalProps> =
  React.memo(
    ({ visible, mode, value, onChange, onClose, title, badgeText }) => {
      const { isDarkMode } = useAppTheme();
      const isDate = mode === 'date';
      const defaultTitle = isDate ? 'Schedule Date' : 'Due Time';
      const defaultBadge = isDate ? 'SOLAR CALENDAR' : 'LUNAR CHRONO';

      if (Platform.OS === 'android') {
        if (!visible) return null;
        return (
          <DateTimePicker
            value={value}
            mode={mode}
            display="default"
            onChange={onChange}
          />
        );
      }

      // iOS Spinner Modal Sheet
      return (
        <Modal
          visible={visible}
          transparent
          animationType="slide"
          onRequestClose={onClose}
        >
          <TouchableWithoutFeedback onPress={onClose}>
            <View style={styles.pickerModalOverlay}>
              <TouchableWithoutFeedback>
                <View
                  style={[
                    styles.pickerModalCard,
                    isDarkMode && {
                      backgroundColor: Colors.DarkCardBackground,
                      borderTopColor: Colors.CarbonSlate,
                      borderLeftColor: Colors.CarbonSlate,
                      borderRightColor: Colors.CarbonSlate,
                    },
                  ]}
                >
                  <View
                    style={[
                      styles.pickerDragHandle,
                      isDarkMode && { backgroundColor: Colors.DarkBorder },
                    ]}
                  />
                  <PickerAestheticBg type={mode} />

                  <View style={styles.pickerModalHeader}>
                    <View style={styles.pickerHeaderTitleWrap}>
                      <View
                        style={[
                          styles.pickerHeaderBadge,
                          isDate
                            ? styles.pickerHeaderBadgeDate
                            : styles.pickerHeaderBadgeTime,
                        ]}
                      >
                        {isDate ? (
                          <Calendar
                            size={ResponsivePixels.size12}
                            color={Colors.WorkTextAccent}
                            strokeWidth={2.5}
                          />
                        ) : (
                          <Clock
                            size={ResponsivePixels.size12}
                            color={Colors.MindfulTextAccent}
                            strokeWidth={2.5}
                          />
                        )}
                        <Text
                          style={
                            isDate
                              ? styles.pickerHeaderBadgeTextDate
                              : styles.pickerHeaderBadgeTextTime
                          }
                        >
                          {badgeText || defaultBadge}
                        </Text>
                      </View>
                      <Text
                        style={[
                          styles.pickerModalTitle,
                          isDarkMode && { color: Colors.PureWhite },
                        ]}
                      >
                        {title || defaultTitle}
                      </Text>
                    </View>

                    <TouchableOpacity
                      activeOpacity={0.82}
                      onPress={onClose}
                      style={styles.pickerDoneBtn}
                      accessibilityRole="button"
                      accessibilityLabel="Confirm selection"
                    >
                      <Text style={styles.pickerDoneBtnText}>Done</Text>
                    </TouchableOpacity>
                  </View>

                  <View style={styles.pickerWheelContainer}>
                    <DateTimePicker
                      value={value}
                      mode={mode}
                      display="spinner"
                      onChange={onChange}
                      textColor={
                        isDarkMode ? Colors.PureWhite : Colors.MidnightCharcoal
                      }
                      themeVariant={isDarkMode ? 'dark' : 'light'}
                    />
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      );
    },
  );

const styles = StyleSheet.create({
  pickerModalOverlay: {
    flex: 1,
    backgroundColor: withAlpha(Colors.DarkBackground, 0.45),
    justifyContent: 'flex-end',
  },
  pickerModalCard: {
    backgroundColor: Colors.CreamSurfaceAlt,
    borderTopLeftRadius: ResponsivePixels.size32,
    borderTopRightRadius: ResponsivePixels.size32,
    paddingTop: ResponsivePixels.size12,
    paddingBottom: ResponsivePixels.size28,
    paddingHorizontal: ResponsivePixels.size20,
    borderWidth: 1.5,
    borderTopColor: Colors.PureWhite,
    borderLeftColor: Colors.CreamBorderSubtle,
    borderRightColor: Colors.CreamBorderSubtle,
    borderBottomWidth: 0,
    ...Platform.select({
      ios: {
        shadowColor: Colors.DarkBackground,
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.16,
        shadowRadius: 16,
      },
      android: {
        elevation: 8,
      },
    }),
    overflow: 'hidden',
    position: 'relative',
  },
  pickerDragHandle: {
    width: ResponsivePixels.size38,
    height: ResponsivePixels.size4,
    borderRadius: ResponsivePixels.size2,
    backgroundColor: Colors.WarmDragHandle,
    alignSelf: 'center',
    marginBottom: ResponsivePixels.size12,
  },
  pickerModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: ResponsivePixels.size8,
    zIndex: 2,
  },
  pickerHeaderTitleWrap: {
    gap: ResponsivePixels.size2,
  },
  pickerHeaderBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ResponsivePixels.size5,
    alignSelf: 'flex-start',
    paddingHorizontal: ResponsivePixels.size7_5,
    paddingVertical: ResponsivePixels.size2_5,
    borderRadius: ResponsivePixels.size20,
    borderWidth: 1,
    borderBottomWidth: 2,
    marginBottom: ResponsivePixels.size2,
  },
  pickerHeaderBadgeDate: {
    backgroundColor: Colors.BadgeYellowBg,
    borderColor: Colors.PureWhite,
    borderBottomColor: Colors.WorkDarkBorder,
  },
  pickerHeaderBadgeTime: {
    backgroundColor: Colors.BadgePurpleBg,
    borderColor: Colors.PureWhite,
    borderBottomColor: Colors.BadgePurpleBevel,
  },
  pickerHeaderBadgeTextDate: {
    fontFamily: Fonts.poppins.bold,
    fontSize: ResponsivePixels.size8_5,
    color: Colors.WorkTextAccent,
    letterSpacing: 0.6,
  },
  pickerHeaderBadgeTextTime: {
    fontFamily: Fonts.poppins.bold,
    fontSize: ResponsivePixels.size8_5,
    color: Colors.MindfulTextAccent,
    letterSpacing: 0.6,
  },
  pickerModalTitle: {
    fontFamily: Fonts.ranade.bold,
    fontSize: ResponsivePixels.size18,
    color: Colors.DarkBackground,
  },
  pickerDoneBtn: {
    backgroundColor: Colors.DarkElevatedNero,
    paddingHorizontal: ResponsivePixels.size16,
    paddingVertical: ResponsivePixels.size8,
    borderRadius: ResponsivePixels.size20,
    borderWidth: 1,
    borderColor: Colors.DarkBevelTop,
    borderBottomWidth: 2.5,
    borderBottomColor: Colors.DarkModalBtnBottom,
  },
  pickerDoneBtnText: {
    fontFamily: Fonts.poppins.bold,
    fontSize: ResponsivePixels.size12_5,
    color: Colors.PureWhite,
    letterSpacing: 0.2,
  },
  pickerWheelContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
});

export default UnifiedSchedulePickerModal;
