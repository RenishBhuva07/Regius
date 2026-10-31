import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Calendar, Clock } from 'lucide-react-native';
import { Fonts } from '../../Theme/fonts';
import { ScheduleButtonBackgroundSvg } from '../../Common/ScheduleButtonBackgroundSvg';

export type QuickDateType = 'today' | 'tomorrow' | 'weekend';

export interface ScheduleTriggerRowProps {
  selectedDate: string;
  selectedTime: string;
  onPressDate: () => void;
  onPressTime: () => void;
  onSelectQuickDate?: (type: QuickDateType) => void;
  heading?: string;
  dateLabel?: string;
  timeLabel?: string;
}

export const ScheduleTriggerRow: React.FC<ScheduleTriggerRowProps> = React.memo(
  ({
    selectedDate,
    selectedTime,
    onPressDate,
    onPressTime,
    onSelectQuickDate,
    heading = 'When to do it',
    dateLabel = 'SCHEDULE DATE',
    timeLabel = 'TIME',
  }) => {
    return (
      <View style={styles.sectionBlock}>
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionHeading}>{heading}</Text>
        </View>

        {/* Quick Date Chips */}
        {onSelectQuickDate && (
          <View style={styles.quickDateRow}>
            {(['today', 'tomorrow', 'weekend'] as const).map(type => {
              const isSelected =
                (type === 'today' && selectedDate.startsWith('Today')) ||
                (type === 'tomorrow' && selectedDate.startsWith('Tomorrow')) ||
                (type === 'weekend' && selectedDate.startsWith('Sat'));

              const label =
                type === 'today'
                  ? 'Today'
                  : type === 'tomorrow'
                  ? 'Tomorrow'
                  : 'This Weekend';

              return (
                <TouchableOpacity
                  key={type}
                  activeOpacity={0.75}
                  onPress={() => onSelectQuickDate(type)}
                  style={[
                    styles.quickDateChip,
                    isSelected && styles.quickDateChipSelected,
                  ]}
                  accessibilityRole="button"
                  accessibilityLabel={`Select ${label}`}
                >
                  <Text
                    style={[
                      styles.quickDateChipText,
                      isSelected && styles.quickDateChipTextSelected,
                    ]}
                  >
                    {label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {/* Dual Card Trigger */}
        <View style={styles.scheduleContainerCard}>
          {/* Date Trigger */}
          <View style={styles.magicScheduleBtnWrapper}>
            <TouchableOpacity
              activeOpacity={0.82}
              onPress={onPressDate}
              style={styles.magicScheduleBtn}
              accessibilityRole="button"
              accessibilityLabel={`Schedule date: ${selectedDate}`}
            >
              <ScheduleButtonBackgroundSvg type="date" />

              <View style={[styles.magicIconWrap, styles.magicIconWrapDate]}>
                <Calendar size={16} color="#F5C518" strokeWidth={2.4} />
              </View>

              <View style={styles.magicScheduleTextGroup}>
                <Text style={styles.magicScheduleSmallLabel}>{dateLabel}</Text>
                <Text style={styles.magicScheduleValue} numberOfLines={1}>
                  {selectedDate}
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Time Trigger */}
          <View style={styles.magicScheduleBtnWrapper}>
            <TouchableOpacity
              activeOpacity={0.82}
              onPress={onPressTime}
              style={styles.magicScheduleBtn}
              accessibilityRole="button"
              accessibilityLabel={`Due time: ${selectedTime}`}
            >
              <ScheduleButtonBackgroundSvg type="time" />

              <View style={[styles.magicIconWrap, styles.magicIconWrapTime]}>
                <Clock size={16} color="#9C9CE3" strokeWidth={2.4} />
              </View>

              <View style={styles.magicScheduleTextGroup}>
                <Text style={styles.magicScheduleSmallLabel}>{timeLabel}</Text>
                <Text style={styles.magicScheduleValue} numberOfLines={1}>
                  {selectedTime}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  },
);

const styles = StyleSheet.create({
  sectionBlock: {
    marginBottom: 20,
  },
  sectionHeaderRow: {
    marginBottom: 10,
  },
  sectionHeading: {
    fontFamily: Fonts.poppins.bold,
    fontSize: 13.5,
    color: '#121417',
    letterSpacing: -0.2,
  },
  quickDateRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10,
  },
  quickDateChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8E2D5',
  },
  quickDateChipSelected: {
    backgroundColor: '#1E2028',
    borderColor: '#363944',
  },
  quickDateChipText: {
    fontFamily: Fonts.poppins.medium,
    fontSize: 11.5,
    color: '#77767B',
  },
  quickDateChipTextSelected: {
    fontFamily: Fonts.poppins.bold,
    color: '#FFFFFF',
  },
  scheduleContainerCard: {
    flexDirection: 'row',
    gap: 10,
  },
  magicScheduleBtnWrapper: {
    flex: 1,
  },
  magicScheduleBtn: {
    height: 64,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    gap: 10,
    borderWidth: 1.2,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    overflow: 'hidden',
    position: 'relative',
  },
  magicIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  magicIconWrapDate: {
    borderColor: 'rgba(245, 197, 24, 0.3)',
    borderWidth: 1,
  },
  magicIconWrapTime: {
    borderColor: 'rgba(156, 156, 227, 0.3)',
    borderWidth: 1,
  },
  magicScheduleTextGroup: {
    flex: 1,
    gap: 1,
  },
  magicScheduleSmallLabel: {
    fontFamily: Fonts.poppins.bold,
    fontSize: 8.5,
    color: '#B6B9C3',
    letterSpacing: 0.6,
  },
  magicScheduleValue: {
    fontFamily: Fonts.poppins.bold,
    fontSize: 12.5,
    color: '#FFFFFF',
  },
});

export default ScheduleTriggerRow;
