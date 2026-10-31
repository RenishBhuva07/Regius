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
import { Colors } from '../Assets/StyleUtilities/Colors';
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
                <View style={styles.pickerModalCard}>
                  <View style={styles.pickerDragHandle} />
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
                            color="#B48216"
                            strokeWidth={2.5}
                          />
                        ) : (
                          <Clock size={12} color="#7059C8" strokeWidth={2.5} />
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
                      <Text style={styles.pickerModalTitle}>
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
                      textColor={Colors.MidnightCharcoal}
                      themeVariant="light"
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
    backgroundColor: 'rgba(18, 20, 23, 0.45)',
    justifyContent: 'flex-end',
  },
  pickerModalCard: {
    backgroundColor: '#FAF8F5',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingTop: 12,
    paddingBottom: 28,
    paddingHorizontal: 20,
    borderWidth: 1.5,
    borderTopColor: '#FFFFFF',
    borderLeftColor: '#F0ECE1',
    borderRightColor: '#F0ECE1',
    borderBottomWidth: 0,
    ...Platform.select({
      ios: {
        shadowColor: '#121417',
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
    backgroundColor: '#DCD6C8',
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
    backgroundColor: '#FFF8D0',
    borderColor: '#FFFFFF',
    borderBottomColor: '#DEAA14',
  },
  pickerHeaderBadgeTime: {
    backgroundColor: '#EEF0FD',
    borderColor: '#FFFFFF',
    borderBottomColor: '#B6BEF5',
  },
  pickerHeaderBadgeTextDate: {
    fontFamily: Fonts.poppins.bold,
    fontSize: 8.5,
    color: '#B48216',
    letterSpacing: 0.6,
  },
  pickerHeaderBadgeTextTime: {
    fontFamily: Fonts.poppins.bold,
    fontSize: 8.5,
    color: '#7059C8',
    letterSpacing: 0.6,
  },
  pickerModalTitle: {
    fontFamily: Fonts.ranade.bold,
    fontSize: 18,
    color: '#121417',
  },
  pickerDoneBtn: {
    backgroundColor: '#1E2028',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#4A4E5C',
    borderBottomWidth: 2.5,
    borderBottomColor: '#0E1015',
  },
  pickerDoneBtnText: {
    fontFamily: Fonts.poppins.bold,
    fontSize: 12.5,
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
  pickerWheelContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
});

export default UnifiedSchedulePickerModal;
