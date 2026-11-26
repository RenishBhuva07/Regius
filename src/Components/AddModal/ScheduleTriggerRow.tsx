import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
} from 'react-native';
import { Calendar, Clock, X } from 'lucide-react-native';
import { Fonts } from '../../Theme/fonts';
import { Colors, withAlpha } from '../../Assets/StyleUtilities/Colors';
import { useAppTheme } from '../../Theme/useAppTheme';
import { ScheduleButtonBackgroundSvg } from '../../Common/ScheduleButtonBackgroundSvg';
import ResponsivePixels from '../../Assets/StyleUtilities/ResponsivePixels';
import { toLocalISODate, addDaysToISO } from '../../Utils/taskDateUtils';

export type QuickDateType =
  | 'today'
  | 'tomorrow'
  | 'weekend'
  | 'next_week'
  | 'anytime';

export interface ScheduleTriggerRowProps {
  selectedDate: string;
  selectedTime: string;
  selectedDueDate?: string | null;
  isTimeAnytime?: boolean;
  onPressDate: () => void;
  onPressTime: () => void;
  onClearTime?: () => void;
  onSelectQuickDate?: (type: QuickDateType) => void;
  showExtendedPresets?: boolean;
  heading?: string;
  dateLabel?: string;
  timeLabel?: string;
}

export const ScheduleTriggerRow: React.FC<ScheduleTriggerRowProps> = React.memo(
  ({
    selectedDate,
    selectedTime,
    selectedDueDate,
    isTimeAnytime = false,
    onPressDate,
    onPressTime,
    onClearTime,
    onSelectQuickDate,
    showExtendedPresets = false,
    heading = 'When to do it',
    dateLabel = 'SCHEDULE DATE',
    timeLabel = 'TIME',
  }) => {
    const { isDarkMode, textPrimary } = useAppTheme();

    const today = new Date();
    const todayISO = toLocalISODate(today);
    const tomorrowISO = addDaysToISO(todayISO, 1);
    const dayOfWeek = today.getDay();
    const daysUntilSaturday = dayOfWeek === 6 ? 7 : 6 - dayOfWeek;
    const weekendISO = addDaysToISO(todayISO, daysUntilSaturday);
    const daysUntilMonday = dayOfWeek === 0 ? 1 : 8 - dayOfWeek;
    const nextWeekISO = addDaysToISO(todayISO, daysUntilMonday);

    const presetOptions: QuickDateType[] = showExtendedPresets
      ? ['today', 'tomorrow', 'weekend', 'next_week', 'anytime']
      : ['today', 'tomorrow', 'weekend'];

    const isPresetSelected = (type: QuickDateType): boolean => {
      if (selectedDueDate !== undefined) {
        if (type === 'today') return selectedDueDate === todayISO;
        if (type === 'tomorrow') return selectedDueDate === tomorrowISO;
        if (type === 'weekend') return selectedDueDate === weekendISO;
        if (type === 'next_week') return selectedDueDate === nextWeekISO;
        if (type === 'anytime') return selectedDueDate === null;
        return false;
      }

      if (type === 'today') return selectedDate.startsWith('Today');
      if (type === 'tomorrow') return selectedDate.startsWith('Tomorrow');
      if (type === 'weekend') return selectedDate.startsWith('Sat');
      if (type === 'anytime') return selectedDate === 'Anytime';
      return false;
    };

    const getPresetLabel = (type: QuickDateType): string => {
      switch (type) {
        case 'today':
          return 'Today';
        case 'tomorrow':
          return 'Tomorrow';
        case 'weekend':
          return 'This Weekend';
        case 'next_week':
          return 'Next Week';
        case 'anytime':
          return 'Anytime';
      }
    };

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

        {/* Quick Date Chips (Edge-to-Edge Horizontal Scroll) */}
        {onSelectQuickDate && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.quickDateScroll}
            contentContainerStyle={styles.quickDateRow}
          >
            {presetOptions.map(type => {
              const isSelected = isPresetSelected(type);
              const label = getPresetLabel(type);

              return (
                <TouchableOpacity
                  key={type}
                  activeOpacity={0.8}
                  onPress={() => onSelectQuickDate(type)}
                  style={[
                    styles.quickDateChip,
                    isDarkMode &&
                      !isSelected && {
                        backgroundColor: Colors.DarkCardBackground,
                        borderColor: Colors.DarkBorderSubtle,
                        borderBottomColor: Colors.DarkSurfaceAlt,
                      },
                    isSelected && styles.quickDateChipSelected,
                    isSelected &&
                      isDarkMode && {
                        backgroundColor: Colors.AccentYellow,
                        borderColor: Colors.WorkDarkBorder,
                        borderTopColor: Colors.WorkLightBorder,
                        borderBottomColor: Colors.HabitBurnishedAmber,
                      },
                  ]}
                  accessibilityRole="button"
                  accessibilityLabel={`Select ${label}`}
                >
                  <Text
                    style={[
                      styles.quickDateChipText,
                      isDarkMode && !isSelected && { color: Colors.SteelMist },
                      isSelected && styles.quickDateChipTextSelected,
                      isSelected &&
                        isDarkMode && { color: Colors.RegiusInk },
                    ]}
                  >
                    {label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
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
                  size={ResponsivePixels.size16}
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
              accessibilityLabel={`Due time: ${
                isTimeAnytime ? 'Anytime' : selectedTime
              }`}
            >
              <ScheduleButtonBackgroundSvg type="time" />

              <View style={[styles.magicIconWrap, styles.magicIconWrapTime]}>
                <Clock
                  size={ResponsivePixels.size16}
                  color={Colors.PeriwinkleSoft}
                  strokeWidth={2.4}
                />
              </View>

              <View style={styles.magicScheduleTextGroup}>
                <Text style={styles.magicScheduleSmallLabel}>{timeLabel}</Text>
                <Text
                  style={[
                    styles.magicScheduleValue,
                    isTimeAnytime && styles.magicScheduleAnytimeText,
                  ]}
                  numberOfLines={1}
                >
                  {isTimeAnytime ? 'Anytime' : selectedTime}
                </Text>
              </View>

              {onClearTime && !isTimeAnytime && (
                <TouchableOpacity
                  activeOpacity={0.75}
                  onPress={e => {
                    e.stopPropagation();
                    onClearTime();
                  }}
                  hitSlop={{
                    top: ResponsivePixels.size8,
                    bottom: ResponsivePixels.size8,
                    left: ResponsivePixels.size8,
                    right: ResponsivePixels.size8,
                  }}
                  style={styles.clearTimeBtn}
                  accessibilityRole="button"
                  accessibilityLabel="Set time to anytime"
                >
                  <X
                    size={ResponsivePixels.size11}
                    color={Colors.CoolSilverSubtitle}
                    strokeWidth={2.6}
                  />
                </TouchableOpacity>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  },
);

const styles = StyleSheet.create({
  sectionBlock: {
    marginBottom: ResponsivePixels.size20,
  },
  sectionHeaderRow: {
    marginBottom: ResponsivePixels.size10,
  },
  sectionHeading: {
    fontFamily: Fonts.poppins.bold,
    fontSize: ResponsivePixels.size13_5,
    color: Colors.DarkBackground,
    letterSpacing: -0.2,
  },
  quickDateScroll: {
    marginHorizontal: -ResponsivePixels.size20,
    marginBottom: ResponsivePixels.size8,
  },
  quickDateRow: {
    flexDirection: 'row',
    gap: ResponsivePixels.size8,
    paddingHorizontal: ResponsivePixels.size20,
    paddingVertical: ResponsivePixels.size4,
  },
  quickDateChip: {
    paddingHorizontal: ResponsivePixels.size15,
    paddingVertical: ResponsivePixels.size7,
    borderRadius: ResponsivePixels.size50,
    backgroundColor: Colors.PureWhite,
    borderWidth: 1.5,
    borderColor: Colors.WarmChipBorder,
    borderBottomWidth: 3,
    borderBottomColor: Colors.WarmHaloBottomBevel,
    ...Platform.select({
      ios: {
        shadowColor: Colors.WarmUmberShadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  quickDateChipSelected: {
    backgroundColor: Colors.NeroBlack,
    borderWidth: 1.5,
    borderTopColor: Colors.DarkChipBevelTop,
    borderLeftColor: Colors.DarkChipBorder,
    borderRightColor: Colors.DarkChipBorder,
    borderBottomWidth: 3.5,
    borderBottomColor: Colors.DarkChipBevelAbyss,
    ...Platform.select({
      ios: {
        shadowColor: Colors.PureBlack,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.24,
        shadowRadius: 5,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  quickDateChipText: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: ResponsivePixels.size11_5,
    color: Colors.CharcoalStoneText,
  },
  quickDateChipTextSelected: {
    fontFamily: Fonts.poppins.bold,
    color: Colors.PureWhite,
  },
  scheduleContainerCard: {
    flexDirection: 'row',
    gap: ResponsivePixels.size10,
  },
  magicScheduleBtnWrapper: {
    flex: 1,
    borderRadius: ResponsivePixels.size20,
    backgroundColor: Colors.NeroBlack,
    ...Platform.select({
      ios: {
        shadowColor: Colors.PureBlack,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  magicScheduleBtn: {
    height: ResponsivePixels.size64,
    borderRadius: ResponsivePixels.size20,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: ResponsivePixels.size10,
    gap: ResponsivePixels.size8,
    backgroundColor: Colors.NeroBlack,
    borderWidth: 1.5,
    borderTopColor: Colors.DarkChipBevelTop,
    borderLeftColor: Colors.DarkBorder,
    borderRightColor: Colors.DarkBorder,
    borderBottomWidth: 3,
    borderBottomColor: Colors.DarkChipBevelAbyss,
    overflow: 'hidden',
    position: 'relative',
  },
  magicIconWrap: {
    width: ResponsivePixels.size32,
    height: ResponsivePixels.size32,
    borderRadius: ResponsivePixels.size16,
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
    gap: ResponsivePixels.size1,
  },
  magicScheduleSmallLabel: {
    fontFamily: Fonts.poppins.bold,
    fontSize: ResponsivePixels.size8_5,
    color: Colors.CoolSilverSubtitle,
    letterSpacing: 0.6,
  },
  magicScheduleValue: {
    fontFamily: Fonts.poppins.bold,
    fontSize: ResponsivePixels.size12_5,
    color: Colors.PureWhite,
  },
  magicScheduleAnytimeText: {
    color: Colors.PeriwinkleSoft,
  },
  clearTimeBtn: {
    width: ResponsivePixels.size20,
    height: ResponsivePixels.size20,
    borderRadius: ResponsivePixels.size10,
    backgroundColor: withAlpha(Colors.PureWhite, 0.12),
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ScheduleTriggerRow;
