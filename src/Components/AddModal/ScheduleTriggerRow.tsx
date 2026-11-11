import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Calendar, Clock } from 'lucide-react-native';
import { Fonts } from '../../Theme/fonts';
import { Colors, withAlpha } from '../../Assets/StyleUtilities/Colors';
import { useAppTheme } from '../../Theme/useAppTheme';
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
    const { isDarkMode, textPrimary } = useAppTheme();

    return (
      <View style={styles.sectionBlock}>
        <View style={styles.sectionHeaderRow}>
          <Text
            style={[
              styles.sectionHeading,
              isDarkMode && { color: textPrimary },
            ]}
          >
            {heading}
          </Text>
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
                    isDarkMode &&
                      !isSelected && {
                        backgroundColor: Colors.DarkCardBackground,
                        borderColor: Colors.CarbonSlate,
                      },
                    isSelected && styles.quickDateChipSelected,
                  ]}
                  accessibilityRole="button"
                  accessibilityLabel={`Select ${label}`}
                >
                  <Text
                    style={[
                      styles.quickDateChipText,
                      isDarkMode && !isSelected && { color: Colors.SteelMist },
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
                <Calendar
                  size={16}
                  color={Colors.AccentYellow}
                  strokeWidth={2.4}
                />
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
                <Clock
                  size={16}
                  color={Colors.PeriwinkleSoft}
                  strokeWidth={2.4}
                />
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
    color: Colors.DarkBackground,
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
    backgroundColor: Colors.PureWhite,
    borderWidth: 1,
    borderColor: Colors.RingBorder,
  },
  quickDateChipSelected: {
    backgroundColor: Colors.DarkElevatedNero,
    borderColor: Colors.DarkBorder,
  },
  quickDateChipText: {
    fontFamily: Fonts.poppins.medium,
    fontSize: 11.5,
    color: Colors.Grey,
  },
  quickDateChipTextSelected: {
    fontFamily: Fonts.poppins.bold,
    color: Colors.PureWhite,
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
    borderColor: withAlpha(Colors.PureWhite, 0.1),
    overflow: 'hidden',
    position: 'relative',
  },
  magicIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: withAlpha(Colors.PureWhite, 0.08),
    alignItems: 'center',
    justifyContent: 'center',
  },
  magicIconWrapDate: {
    borderColor: withAlpha(Colors.AccentYellow, 0.3),
    borderWidth: 1,
  },
  magicIconWrapTime: {
    borderColor: withAlpha(Colors.PeriwinkleSoft, 0.3),
    borderWidth: 1,
  },
  magicScheduleTextGroup: {
    flex: 1,
    gap: 1,
  },
  magicScheduleSmallLabel: {
    fontFamily: Fonts.poppins.bold,
    fontSize: 8.5,
    color: Colors.CoolSilverSubtitle,
    letterSpacing: 0.6,
  },
  magicScheduleValue: {
    fontFamily: Fonts.poppins.bold,
    fontSize: 12.5,
    color: Colors.PureWhite,
  },
});

export default ScheduleTriggerRow;
