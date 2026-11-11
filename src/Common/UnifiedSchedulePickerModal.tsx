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
                            size={12}
                            color={Colors.WorkTextAccent}
                            strokeWidth={2.5}
                          />
                        ) : (
                          <Clock
                            size={12}
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
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingTop: 12,
    paddingBottom: 28,
    paddingHorizontal: 20,
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
    width: 38,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.WarmDragHandle,
    alignSelf: 'center',
    marginBottom: 12,
  },
  pickerModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
    zIndex: 2,
  },
  pickerHeaderTitleWrap: {
    gap: 2,
  },
  pickerHeaderBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    alignSelf: 'flex-start',
    paddingHorizontal: 7.5,
    paddingVertical: 2.5,
    borderRadius: 20,
    borderWidth: 1,
    borderBottomWidth: 2,
    marginBottom: 2,
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
    fontSize: 8.5,
    color: Colors.WorkTextAccent,
    letterSpacing: 0.6,
  },
  pickerHeaderBadgeTextTime: {
    fontFamily: Fonts.poppins.bold,
    fontSize: 8.5,
    color: Colors.MindfulTextAccent,
    letterSpacing: 0.6,
  },
  pickerModalTitle: {
    fontFamily: Fonts.ranade.bold,
    fontSize: 18,
    color: Colors.DarkBackground,
  },
  pickerDoneBtn: {
    backgroundColor: Colors.DarkElevatedNero,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.DarkBevelTop,
    borderBottomWidth: 2.5,
    borderBottomColor: Colors.DarkModalBtnBottom,
  },
  pickerDoneBtnText: {
    fontFamily: Fonts.poppins.bold,
    fontSize: 12.5,
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
