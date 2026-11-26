import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StyleSheet,
  Platform,
  ScrollView,
} from 'react-native';
import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Sparkles,
  Sun,
  Moon,
  Clock,
} from 'lucide-react-native';
import { Fonts } from '../Theme/fonts';
import { Colors, withAlpha } from '../Assets/StyleUtilities/Colors';
import { useAppTheme } from '../Theme/useAppTheme';
import PickerAestheticBg from '../Components/PickerAestheticBg';
import ResponsivePixels from '../Assets/StyleUtilities/ResponsivePixels';
import {
  toLocalISODate,
  addDaysToISO,
  parseLocalISODate,
  formatTimeFromDate,
} from '../Utils/taskDateUtils';

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const MONTH_SHORT = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

const WEEKDAY_HEADERS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const QUICK_TIME_SLOTS = [
  { label: '9:00 AM', hour: 9, minute: 0 },
  { label: '12:00 PM', hour: 12, minute: 0 },
  { label: '2:00 PM', hour: 14, minute: 0 },
  { label: '6:00 PM', hour: 18, minute: 0 },
  { label: '9:00 PM', hour: 21, minute: 0 },
];

export interface UnifiedSchedulePickerModalProps {
  visible: boolean;
  mode: 'date' | 'time';
  value: Date;
  onChange: (event: DateTimePickerEvent, date?: Date) => void;
  onClose: () => void;
  title?: string;
  badgeText?: string;
  minimumDate?: Date;
  allowAnytime?: boolean;
  isAnytime?: boolean;
  onSelectAnytime?: () => void;
}

function createSetEvent(date: Date): DateTimePickerEvent {
  return {
    type: 'set',
    nativeEvent: {
      timestamp: date.getTime(),
      utcOffset: -date.getTimezoneOffset(),
    },
  };
}

export const UnifiedSchedulePickerModal: React.FC<UnifiedSchedulePickerModalProps> =
  React.memo(
    ({
      visible,
      mode,
      value,
      onChange,
      onClose,
      title,
      minimumDate,
      allowAnytime = false,
      isAnytime = false,
      onSelectAnytime,
    }) => {
      const { isDarkMode } = useAppTheme();
      const isDate = mode === 'date';
      const defaultTitle = isDate ? 'Schedule Date' : 'Due Time';

      const [draftDate, setDraftDate] = useState<Date>(() => new Date(value));
      const [displayYear, setDisplayYear] = useState<number>(() =>
        value.getFullYear(),
      );
      const [displayMonth, setDisplayMonth] = useState<number>(() =>
        value.getMonth(),
      );
      const [showMonthYearJump, setShowMonthYearJump] = useState(false);
      const [showAndroidClock, setShowAndroidClock] = useState(false);

      useEffect(() => {
        if (visible) {
          const safe = Number.isNaN(value.getTime())
            ? new Date()
            : new Date(value);
          setDraftDate(safe);
          setDisplayYear(safe.getFullYear());
          setDisplayMonth(safe.getMonth());
          setShowMonthYearJump(false);
          setShowAndroidClock(false);
        }
      }, [visible, value]);

      const isNightTime = !isDate && draftDate.getHours() >= 12;
      const isDarkSurface = isNightTime || isDarkMode;
      const timePeriod: 'day' | 'night' = isNightTime ? 'night' : 'day';

      const todayISO = toLocalISODate();
      const minISO = useMemo(
        () => (minimumDate ? toLocalISODate(minimumDate) : null),
        [minimumDate],
      );
      const selectedISO = toLocalISODate(draftDate);

      const canGoPrevMonth = useMemo(() => {
        if (!minISO) return true;
        const minDateObj = parseLocalISODate(minISO);
        if (!minDateObj) return true;
        return (
          displayYear > minDateObj.getFullYear() ||
          (displayYear === minDateObj.getFullYear() &&
            displayMonth > minDateObj.getMonth())
        );
      }, [minISO, displayYear, displayMonth]);

      const calendarCells = useMemo(() => {
        const firstDayOfMonth = new Date(displayYear, displayMonth, 1);
        const startWeekday = firstDayOfMonth.getDay();
        const daysInMonth = new Date(displayYear, displayMonth + 1, 0).getDate();

        const cells: Array<{
          key: string;
          day: number | null;
          iso: string | null;
          disabled: boolean;
        }> = [];

        for (let i = 0; i < startWeekday; i++) {
          cells.push({
            key: `empty-start-${i}`,
            day: null,
            iso: null,
            disabled: true,
          });
        }

        for (let d = 1; d <= daysInMonth; d++) {
          const cellDate = new Date(displayYear, displayMonth, d);
          const iso = toLocalISODate(cellDate);
          const disabled = Boolean(minISO && iso < minISO);
          cells.push({
            key: iso,
            day: d,
            iso,
            disabled,
          });
        }

        while (cells.length % 7 !== 0) {
          cells.push({
            key: `empty-end-${cells.length}`,
            day: null,
            iso: null,
            disabled: true,
          });
        }

        return cells;
      }, [displayYear, displayMonth, minISO]);

      const yearOptions = useMemo(() => {
        const baseYear = new Date().getFullYear();
        return [baseYear, baseYear + 1, baseYear + 2, baseYear + 3, baseYear + 4];
      }, []);

      const applyISOToDraft = (iso: string) => {
        const parsed = parseLocalISODate(iso);
        if (!parsed) return;
        const next = new Date(
          parsed.getFullYear(),
          parsed.getMonth(),
          parsed.getDate(),
          draftDate.getHours(),
          draftDate.getMinutes(),
          0,
          0,
        );
        setDraftDate(next);
        setDisplayYear(next.getFullYear());
        setDisplayMonth(next.getMonth());
      };

      const handleConfirm = () => {
        onChange(createSetEvent(draftDate), draftDate);
        onClose();
      };

      const handleQuickDatePreset = (
        preset: 'today' | 'tomorrow' | 'next_week' | 'next_month',
      ) => {
        let targetISO = todayISO;
        if (preset === 'tomorrow') {
          targetISO = addDaysToISO(todayISO, 1);
        } else if (preset === 'next_week') {
          const today = new Date();
          const day = today.getDay();
          const daysUntilMon = day === 0 ? 1 : 8 - day;
          targetISO = addDaysToISO(todayISO, daysUntilMon);
        } else if (preset === 'next_month') {
          const today = new Date();
          const nextM = new Date(today.getFullYear(), today.getMonth() + 1, 1);
          const maxDays = new Date(
            nextM.getFullYear(),
            nextM.getMonth() + 1,
            0,
          ).getDate();
          const target = new Date(
            nextM.getFullYear(),
            nextM.getMonth(),
            Math.min(today.getDate(), maxDays),
          );
          targetISO = toLocalISODate(target);
        }
        applyISOToDraft(targetISO);
        setShowMonthYearJump(false);
      };

      const handlePrevMonth = () => {
        if (!canGoPrevMonth) return;
        if (displayMonth === 0) {
          setDisplayMonth(11);
          setDisplayYear(y => y - 1);
        } else {
          setDisplayMonth(m => m - 1);
        }
      };

      const handleNextMonth = () => {
        if (displayMonth === 11) {
          setDisplayMonth(0);
          setDisplayYear(y => y + 1);
        } else {
          setDisplayMonth(m => m + 1);
        }
      };

      const handleQuickTimeSlot = (hour: number, minute: number) => {
        const next = new Date(draftDate);
        next.setHours(hour, minute, 0, 0);
        setDraftDate(next);
        onChange(createSetEvent(next), next);
        if (Platform.OS !== 'ios') {
          onClose();
        }
      };

      const handleAnytimePress = () => {
        onSelectAnytime?.();
        onClose();
      };

      if (Platform.OS === 'android' && !isDate && showAndroidClock) {
        return (
          <DateTimePicker
            value={draftDate}
            mode="time"
            display="default"
            onChange={(event, selected) => {
              setShowAndroidClock(false);
              if (event.type === 'set' && selected) {
                onChange(event, selected);
                onClose();
              }
            }}
          />
        );
      }

      const capsuleUnselectedDarkStyle = isNightTime
        ? styles.capsuleUnselectedNight
        : styles.capsuleUnselectedDark;

      const capsuleActiveStyle = isDarkSurface
        ? isNightTime
          ? styles.capsuleSelectedNight
          : styles.capsuleSelectedDarkGold
        : styles.capsuleSelectedLight;

      const capsuleActiveTextColor = isDarkSurface
        ? isNightTime
          ? Colors.PureWhite
          : Colors.RegiusInk
        : Colors.PureWhite;

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
                    isDarkMode &&
                      !isNightTime && {
                        backgroundColor: Colors.DarkCardBackground,
                        borderTopColor: Colors.CarbonSlate,
                        borderLeftColor: Colors.CarbonSlate,
                        borderRightColor: Colors.CarbonSlate,
                      },
                    isNightTime && {
                      backgroundColor: Colors.ToastInfoCardDarkMid,
                      borderTopColor: Colors.PerkLavenderDarkBorder,
                      borderLeftColor: Colors.FaqTipDarkBorder,
                      borderRightColor: Colors.FaqTipDarkBorder,
                    },
                  ]}
                >
                  <View
                    style={[
                      styles.pickerDragHandle,
                      isDarkSurface && {
                        backgroundColor: isNightTime
                          ? Colors.PerkLavenderDarkBorder
                          : Colors.DarkBorder,
                      },
                    ]}
                  />
                  <PickerAestheticBg
                    type={mode}
                    isDarkMode={isDarkMode}
                    timePeriod={timePeriod}
                  />

                  {/* Clean Header */}
                  <View style={styles.pickerModalHeader}>
                    <View style={styles.pickerHeaderTitleRow}>
                      {!isDate && (
                        <View
                          style={[
                            styles.periodIconDisc,
                            isNightTime
                              ? styles.periodIconDiscNight
                              : isDarkMode
                              ? styles.periodIconDiscDayDark
                              : styles.periodIconDiscDayLight,
                          ]}
                        >
                          {isNightTime ? (
                            <Moon
                              size={ResponsivePixels.size15}
                              color={Colors.PeriwinkleSoft}
                              strokeWidth={2.4}
                            />
                          ) : (
                            <Sun
                              size={ResponsivePixels.size15}
                              color={
                                isDarkMode
                                  ? Colors.AccentYellow
                                  : Colors.WorkTextAccent
                              }
                              strokeWidth={2.4}
                            />
                          )}
                        </View>
                      )}
                      <Text
                        style={[
                          styles.pickerModalTitle,
                          isDarkSurface && { color: Colors.PureWhite },
                        ]}
                      >
                        {title || defaultTitle}
                      </Text>
                    </View>

                    <TouchableOpacity
                      activeOpacity={0.85}
                      onPress={handleConfirm}
                      style={[
                        styles.pickerDoneBtn,
                        isDarkSurface &&
                          (isNightTime
                            ? styles.pickerDoneBtnNight
                            : styles.pickerDoneBtnDarkGold),
                      ]}
                      accessibilityRole="button"
                      accessibilityLabel="Confirm selection"
                    >
                      <Text
                        style={[
                          styles.pickerDoneBtnText,
                          isDarkSurface &&
                            !isNightTime && { color: Colors.RegiusInk },
                        ]}
                      >
                        Done
                      </Text>
                    </TouchableOpacity>
                  </View>

                  {/* DATE MODE: Artisanal Future Calendar Grid */}
                  {isDate ? (
                    <View style={styles.calendarContent}>
                      {/* Quick Future Presets (Edge-to-Edge Scroll) */}
                      <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        style={styles.edgeScroll}
                        contentContainerStyle={styles.quickPresetRow}
                      >
                        {(
                          [
                            { key: 'today', label: 'Today', iso: todayISO },
                            {
                              key: 'tomorrow',
                              label: 'Tomorrow',
                              iso: addDaysToISO(todayISO, 1),
                            },
                            { key: 'next_week', label: 'Next Mon', iso: null },
                            { key: 'next_month', label: '+1 Month', iso: null },
                          ] as const
                        ).map(item => {
                          const isPresetActive =
                            !isAnytime &&
                            item.iso !== null &&
                            selectedISO === item.iso;
                          return (
                            <TouchableOpacity
                              key={item.key}
                              activeOpacity={0.8}
                              onPress={() => handleQuickDatePreset(item.key)}
                              style={[
                                styles.presetChip,
                                isDarkMode &&
                                  !isPresetActive &&
                                  capsuleUnselectedDarkStyle,
                                isPresetActive && capsuleActiveStyle,
                              ]}
                            >
                              <Text
                                style={[
                                  styles.presetChipText,
                                  isDarkMode &&
                                    !isPresetActive &&
                                    styles.presetChipTextDark,
                                  isPresetActive && {
                                    color: capsuleActiveTextColor,
                                    fontFamily: Fonts.poppins.bold,
                                  },
                                ]}
                              >
                                {item.label}
                              </Text>
                            </TouchableOpacity>
                          );
                        })}
                        {allowAnytime && onSelectAnytime && (
                          <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={handleAnytimePress}
                            style={[
                              styles.presetChip,
                              isDarkMode &&
                                !isAnytime &&
                                capsuleUnselectedDarkStyle,
                              isAnytime && capsuleActiveStyle,
                            ]}
                          >
                            <Sparkles
                              size={ResponsivePixels.size11}
                              color={
                                isAnytime
                                  ? capsuleActiveTextColor
                                  : isDarkMode
                                  ? Colors.AccentYellow
                                  : Colors.MindfulTextAccent
                              }
                              strokeWidth={2.4}
                            />
                            <Text
                              style={[
                                styles.presetChipText,
                                isDarkMode &&
                                  !isAnytime &&
                                  styles.presetChipTextDark,
                                isAnytime && {
                                  color: capsuleActiveTextColor,
                                  fontFamily: Fonts.poppins.bold,
                                },
                              ]}
                            >
                              Anytime
                            </Text>
                          </TouchableOpacity>
                        )}
                      </ScrollView>

                      {/* Month / Year Bar */}
                      <View style={styles.monthNavRow}>
                        <TouchableOpacity
                          activeOpacity={0.78}
                          onPress={handlePrevMonth}
                          disabled={!canGoPrevMonth}
                          style={[
                            styles.monthNavBtn,
                            isDarkMode && styles.monthNavBtnDark,
                            !canGoPrevMonth && styles.monthNavBtnDisabled,
                          ]}
                          accessibilityRole="button"
                          accessibilityLabel="Previous month"
                        >
                          <ChevronLeft
                            size={ResponsivePixels.size18}
                            color={
                              isDarkMode
                                ? Colors.PureWhite
                                : Colors.MidnightCharcoal
                            }
                            strokeWidth={2.4}
                          />
                        </TouchableOpacity>

                        <TouchableOpacity
                          activeOpacity={0.8}
                          onPress={() => setShowMonthYearJump(v => !v)}
                          style={[
                            styles.monthYearTrigger,
                            isDarkMode && styles.monthYearTriggerDark,
                          ]}
                          accessibilityRole="button"
                          accessibilityLabel="Jump to month or year"
                        >
                          <Text
                            style={[
                              styles.monthYearText,
                              isDarkMode && { color: Colors.PureWhite },
                            ]}
                          >
                            {MONTH_NAMES[displayMonth]} {displayYear}
                          </Text>
                          <ChevronDown
                            size={ResponsivePixels.size15}
                            color={
                              isDarkMode ? Colors.AccentYellow : Colors.Grey
                            }
                            strokeWidth={2.4}
                          />
                        </TouchableOpacity>

                        <TouchableOpacity
                          activeOpacity={0.78}
                          onPress={handleNextMonth}
                          style={[
                            styles.monthNavBtn,
                            isDarkMode && styles.monthNavBtnDark,
                          ]}
                          accessibilityRole="button"
                          accessibilityLabel="Next month"
                        >
                          <ChevronRight
                            size={ResponsivePixels.size18}
                            color={
                              isDarkMode
                                ? Colors.PureWhite
                                : Colors.MidnightCharcoal
                            }
                            strokeWidth={2.4}
                          />
                        </TouchableOpacity>
                      </View>

                      {/* Optional Year + Month Jump Panel */}
                      {showMonthYearJump ? (
                        <View style={styles.jumpPanel}>
                          <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            style={styles.edgeScroll}
                            contentContainerStyle={styles.yearChipsRow}
                          >
                            {yearOptions.map(yr => {
                              const active = yr === displayYear;
                              return (
                                <TouchableOpacity
                                  key={yr}
                                  activeOpacity={0.8}
                                  onPress={() => setDisplayYear(yr)}
                                  style={[
                                    styles.yearChip,
                                    isDarkMode &&
                                      !active &&
                                      capsuleUnselectedDarkStyle,
                                    active && capsuleActiveStyle,
                                  ]}
                                >
                                  <Text
                                    style={[
                                      styles.yearChipText,
                                      isDarkMode &&
                                        !active && { color: Colors.SteelMist },
                                      active && {
                                        color: capsuleActiveTextColor,
                                        fontFamily: Fonts.poppins.bold,
                                      },
                                    ]}
                                  >
                                    {yr}
                                  </Text>
                                </TouchableOpacity>
                              );
                            })}
                          </ScrollView>

                          <View style={styles.monthJumpGrid}>
                            {MONTH_SHORT.map((mLabel, mIdx) => {
                              const active = mIdx === displayMonth;
                              return (
                                <TouchableOpacity
                                  key={mLabel}
                                  activeOpacity={0.8}
                                  onPress={() => {
                                    setDisplayMonth(mIdx);
                                    setShowMonthYearJump(false);
                                  }}
                                  style={[
                                    styles.monthJumpCell,
                                    isDarkMode &&
                                      !active &&
                                      capsuleUnselectedDarkStyle,
                                    active && capsuleActiveStyle,
                                  ]}
                                >
                                  <Text
                                    style={[
                                      styles.monthJumpText,
                                      isDarkMode &&
                                        !active && { color: Colors.SteelMist },
                                      active && {
                                        color: capsuleActiveTextColor,
                                        fontFamily: Fonts.poppins.bold,
                                      },
                                    ]}
                                  >
                                    {mLabel}
                                  </Text>
                                </TouchableOpacity>
                              );
                            })}
                          </View>
                        </View>
                      ) : (
                        <>
                          {/* Weekday Header */}
                          <View style={styles.weekdayRow}>
                            {WEEKDAY_HEADERS.map(dayName => (
                              <View key={dayName} style={styles.weekdayCell}>
                                <Text
                                  style={[
                                    styles.weekdayText,
                                    isDarkMode && { color: Colors.SteelMist },
                                  ]}
                                >
                                  {dayName}
                                </Text>
                              </View>
                            ))}
                          </View>

                          {/* Calendar Days Grid */}
                          <View style={styles.daysGrid}>
                            {calendarCells.map(cell => {
                              if (!cell.day || !cell.iso) {
                                return (
                                  <View
                                    key={cell.key}
                                    style={styles.dayCellWrap}
                                  />
                                );
                              }

                              const isSelected =
                                !isAnytime && cell.iso === selectedISO;
                              const isToday = cell.iso === todayISO;

                              return (
                                <View key={cell.key} style={styles.dayCellWrap}>
                                  <TouchableOpacity
                                    activeOpacity={0.78}
                                    disabled={cell.disabled}
                                    onPress={() => applyISOToDraft(cell.iso!)}
                                    style={[
                                      styles.dayCell,
                                      isToday &&
                                        !isSelected && [
                                          styles.dayCellToday,
                                          isDarkMode && styles.dayCellTodayDark,
                                        ],
                                      isSelected &&
                                        (isDarkMode
                                          ? styles.dayCellSelectedDark
                                          : styles.dayCellSelected),
                                      cell.disabled && styles.dayCellDisabled,
                                    ]}
                                    accessibilityRole="button"
                                    accessibilityState={{
                                      selected: isSelected,
                                      disabled: cell.disabled,
                                    }}
                                    accessibilityLabel={`Select ${cell.iso}`}
                                  >
                                    <Text
                                      style={[
                                        styles.dayText,
                                        isDarkMode && {
                                          color: Colors.PureWhite,
                                        },
                                        isToday &&
                                          !isSelected && {
                                            color: isDarkMode
                                              ? Colors.AccentYellow
                                              : Colors.WorkTextAccent,
                                            fontFamily: Fonts.poppins.bold,
                                          },
                                        isSelected &&
                                          (isDarkMode
                                            ? styles.dayTextSelectedDark
                                            : styles.dayTextSelected),
                                        cell.disabled && styles.dayTextDisabled,
                                      ]}
                                    >
                                      {cell.day}
                                    </Text>
                                  </TouchableOpacity>
                                </View>
                              );
                            })}
                          </View>
                        </>
                      )}
                    </View>
                  ) : (
                    /* TIME MODE: Edge-to-Edge Quick Slots + Day/Night Adaptive Wheel */
                    <View style={styles.timeContent}>
                      <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        style={styles.edgeScroll}
                        contentContainerStyle={styles.quickPresetRow}
                      >
                        {QUICK_TIME_SLOTS.map(slot => {
                          const slotActive =
                            !isAnytime &&
                            draftDate.getHours() === slot.hour &&
                            draftDate.getMinutes() === slot.minute;
                          return (
                            <TouchableOpacity
                              key={slot.label}
                              activeOpacity={0.8}
                              onPress={() =>
                                handleQuickTimeSlot(slot.hour, slot.minute)
                              }
                              style={[
                                styles.presetChip,
                                isDarkSurface &&
                                  !slotActive &&
                                  capsuleUnselectedDarkStyle,
                                slotActive && capsuleActiveStyle,
                              ]}
                            >
                              <Text
                                style={[
                                  styles.presetChipText,
                                  isDarkSurface &&
                                    !slotActive &&
                                    styles.presetChipTextDark,
                                  slotActive && {
                                    color: capsuleActiveTextColor,
                                    fontFamily: Fonts.poppins.bold,
                                  },
                                ]}
                              >
                                {slot.label}
                              </Text>
                            </TouchableOpacity>
                          );
                        })}
                        {allowAnytime && onSelectAnytime && (
                          <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={handleAnytimePress}
                            style={[
                              styles.presetChip,
                              isDarkSurface &&
                                !isAnytime &&
                                capsuleUnselectedDarkStyle,
                              isAnytime && capsuleActiveStyle,
                            ]}
                          >
                            <Text
                              style={[
                                styles.presetChipText,
                                isDarkSurface &&
                                  !isAnytime &&
                                  styles.presetChipTextDark,
                                isAnytime && {
                                  color: capsuleActiveTextColor,
                                  fontFamily: Fonts.poppins.bold,
                                },
                              ]}
                            >
                              Anytime
                            </Text>
                          </TouchableOpacity>
                        )}
                      </ScrollView>

                      {Platform.OS === 'ios' ? (
                        <View style={styles.pickerWheelContainer}>
                          <DateTimePicker
                            value={draftDate}
                            mode="time"
                            display="spinner"
                            onChange={(event, selected) => {
                              if (selected) {
                                setDraftDate(selected);
                                onChange(event, selected);
                              }
                            }}
                            textColor={
                              isDarkSurface
                                ? Colors.PureWhite
                                : Colors.MidnightCharcoal
                            }
                            themeVariant={isDarkSurface ? 'dark' : 'light'}
                          />
                        </View>
                      ) : (
                        <View
                          style={[
                            styles.androidClockCard,
                            isDarkSurface && {
                              backgroundColor: isNightTime
                                ? withAlpha(Colors.DarkCardBackground, 0.85)
                                : Colors.DarkSurfaceAlt,
                              borderColor: isNightTime
                                ? Colors.FaqTipDarkBorder
                                : Colors.CarbonSlate,
                            },
                          ]}
                        >
                          <Text
                            style={[
                              styles.androidSelectedTimeText,
                              isDarkSurface && { color: Colors.PureWhite },
                            ]}
                          >
                            {isAnytime
                              ? 'Anytime'
                              : formatTimeFromDate(draftDate)}
                          </Text>
                          <TouchableOpacity
                            activeOpacity={0.82}
                            onPress={() => setShowAndroidClock(true)}
                            style={[
                              styles.androidClockTriggerBtn,
                              isNightTime && styles.pickerDoneBtnNight,
                            ]}
                          >
                            <Clock
                              size={ResponsivePixels.size15}
                              color={Colors.PureWhite}
                              strokeWidth={2.2}
                            />
                            <Text style={styles.androidClockTriggerText}>
                              Pick Exact Time
                            </Text>
                          </TouchableOpacity>
                        </View>
                      )}
                    </View>
                  )}
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
    backgroundColor: withAlpha(Colors.DarkBackground, 0.48),
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
    marginBottom: ResponsivePixels.size12,
    zIndex: 2,
  },
  pickerHeaderTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ResponsivePixels.size10,
  },
  periodIconDisc: {
    width: ResponsivePixels.size32,
    height: ResponsivePixels.size32,
    borderRadius: ResponsivePixels.size16,
    borderWidth: 1.2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  periodIconDiscDayLight: {
    backgroundColor: Colors.WorkLightBg,
    borderColor: Colors.WorkLightBorder,
  },
  periodIconDiscDayDark: {
    backgroundColor: Colors.WorkDarkIconBg,
    borderColor: Colors.WorkDarkBorder,
  },
  periodIconDiscNight: {
    backgroundColor: Colors.MindfulTimePillDarkBg,
    borderColor: Colors.MindfulTimePillDarkBorder,
  },
  pickerModalTitle: {
    fontFamily: Fonts.ranade.bold,
    fontSize: ResponsivePixels.size20,
    color: Colors.DarkBackground,
  },
  pickerDoneBtn: {
    backgroundColor: Colors.NeroBlack,
    paddingHorizontal: ResponsivePixels.size18,
    paddingVertical: ResponsivePixels.size8,
    borderRadius: ResponsivePixels.size50,
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
  pickerDoneBtnDarkGold: {
    backgroundColor: Colors.AccentYellow,
    borderTopColor: Colors.WorkLightBorder,
    borderLeftColor: Colors.WorkDarkBorder,
    borderRightColor: Colors.WorkDarkBorder,
    borderBottomColor: Colors.HabitBurnishedAmber,
  },
  pickerDoneBtnNight: {
    backgroundColor: Colors.LavenderPurple,
    borderTopColor: Colors.PeriwinkleSoft,
    borderLeftColor: Colors.MindfulTextAccent,
    borderRightColor: Colors.MindfulTextAccent,
    borderBottomColor: Colors.SvgOrbIndigoDeep,
  },
  pickerDoneBtnText: {
    fontFamily: Fonts.poppins.bold,
    fontSize: ResponsivePixels.size12_5,
    color: Colors.PureWhite,
    letterSpacing: 0.2,
  },
  calendarContent: {
    zIndex: 2,
    gap: ResponsivePixels.size10,
  },
  timeContent: {
    zIndex: 2,
    gap: ResponsivePixels.size10,
  },
  edgeScroll: {
    marginHorizontal: -ResponsivePixels.size20,
  },
  quickPresetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ResponsivePixels.size8,
    paddingHorizontal: ResponsivePixels.size20,
    paddingVertical: ResponsivePixels.size4,
  },
  presetChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ResponsivePixels.size4,
    paddingHorizontal: ResponsivePixels.size14,
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
  capsuleUnselectedDark: {
    backgroundColor: Colors.DarkCardBackground,
    borderColor: Colors.DarkBorderSubtle,
    borderBottomColor: Colors.DarkSurfaceAlt,
  },
  capsuleUnselectedNight: {
    backgroundColor: Colors.VaultMindfulDarkBg,
    borderColor: Colors.PerkLavenderDarkBorder,
    borderBottomColor: Colors.SvgSectionVoid,
  },
  capsuleSelectedLight: {
    backgroundColor: Colors.NeroBlack,
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
  capsuleSelectedDarkGold: {
    backgroundColor: Colors.AccentYellow,
    borderTopColor: Colors.WorkLightBorder,
    borderLeftColor: Colors.WorkDarkBorder,
    borderRightColor: Colors.WorkDarkBorder,
    borderBottomWidth: 3.5,
    borderBottomColor: Colors.HabitBurnishedAmber,
  },
  capsuleSelectedNight: {
    backgroundColor: Colors.LavenderPurple,
    borderTopColor: Colors.PeriwinkleSoft,
    borderLeftColor: Colors.MindfulTextAccent,
    borderRightColor: Colors.MindfulTextAccent,
    borderBottomWidth: 3.5,
    borderBottomColor: Colors.SvgOrbIndigoDeep,
  },
  presetChipText: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: ResponsivePixels.size11_5,
    color: Colors.CharcoalStoneText,
  },
  presetChipTextDark: {
    color: Colors.SteelMist,
  },
  monthNavRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: ResponsivePixels.size2,
  },
  monthNavBtn: {
    width: ResponsivePixels.size38,
    height: ResponsivePixels.size38,
    borderRadius: ResponsivePixels.size19,
    backgroundColor: Colors.PureWhite,
    borderWidth: 1.5,
    borderColor: Colors.WarmChipBorder,
    borderBottomWidth: 3,
    borderBottomColor: Colors.WarmHaloBottomBevel,
    alignItems: 'center',
    justifyContent: 'center',
  },
  monthNavBtnDark: {
    backgroundColor: Colors.DarkSurfaceAlt,
    borderColor: Colors.CarbonSlate,
    borderBottomColor: Colors.DarkBevelAbyss,
  },
  monthNavBtnDisabled: {
    opacity: 0.35,
  },
  monthYearTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ResponsivePixels.size6,
    paddingHorizontal: ResponsivePixels.size16,
    paddingVertical: ResponsivePixels.size7,
    borderRadius: ResponsivePixels.size50,
    backgroundColor: Colors.PureWhite,
    borderWidth: 1.5,
    borderColor: Colors.WarmChipBorder,
    borderBottomWidth: 3,
    borderBottomColor: Colors.WarmHaloBottomBevel,
  },
  monthYearTriggerDark: {
    backgroundColor: Colors.DarkSurfaceAlt,
    borderColor: Colors.CarbonSlate,
    borderBottomColor: Colors.DarkBevelAbyss,
  },
  monthYearText: {
    fontFamily: Fonts.poppins.bold,
    fontSize: ResponsivePixels.size14,
    color: Colors.MidnightCharcoal,
  },
  jumpPanel: {
    gap: ResponsivePixels.size12,
    paddingVertical: ResponsivePixels.size6,
  },
  yearChipsRow: {
    gap: ResponsivePixels.size8,
    paddingHorizontal: ResponsivePixels.size20,
    paddingVertical: ResponsivePixels.size4,
  },
  yearChip: {
    paddingHorizontal: ResponsivePixels.size16,
    paddingVertical: ResponsivePixels.size7,
    borderRadius: ResponsivePixels.size50,
    backgroundColor: Colors.PureWhite,
    borderWidth: 1.5,
    borderColor: Colors.WarmChipBorder,
    borderBottomWidth: 3,
    borderBottomColor: Colors.WarmHaloBottomBevel,
  },
  yearChipText: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: ResponsivePixels.size12_5,
    color: Colors.MidnightCharcoal,
  },
  monthJumpGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: ResponsivePixels.size8,
  },
  monthJumpCell: {
    width: '22.5%',
    paddingVertical: ResponsivePixels.size10,
    borderRadius: ResponsivePixels.size50,
    backgroundColor: Colors.PureWhite,
    borderWidth: 1.5,
    borderColor: Colors.WarmChipBorder,
    borderBottomWidth: 3,
    borderBottomColor: Colors.WarmHaloBottomBevel,
    alignItems: 'center',
    justifyContent: 'center',
  },
  monthJumpText: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: ResponsivePixels.size12_5,
    color: Colors.MidnightCharcoal,
  },
  weekdayRow: {
    flexDirection: 'row',
    marginTop: ResponsivePixels.size2,
  },
  weekdayCell: {
    width: '14.2857%',
    alignItems: 'center',
    paddingVertical: ResponsivePixels.size4,
  },
  weekdayText: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: ResponsivePixels.size11,
    color: Colors.MutedSlateSubtext,
    letterSpacing: 0.3,
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCellWrap: {
    width: '14.2857%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: ResponsivePixels.size3,
  },
  dayCell: {
    width: ResponsivePixels.size38,
    height: ResponsivePixels.size38,
    borderRadius: ResponsivePixels.size19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayCellToday: {
    borderWidth: 1.5,
    borderColor: Colors.WorkDarkBorder,
    backgroundColor: Colors.WorkLightBg,
  },
  dayCellTodayDark: {
    borderColor: Colors.AccentYellow,
    backgroundColor: Colors.WorkDarkBg,
  },
  dayCellSelected: {
    backgroundColor: Colors.NeroBlack,
    borderWidth: 1.2,
    borderTopColor: Colors.DarkChipBevelTop,
    borderBottomWidth: 2.5,
    borderBottomColor: Colors.DarkChipBevelAbyss,
    ...Platform.select({
      ios: {
        shadowColor: Colors.PureBlack,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.22,
        shadowRadius: 5,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  dayCellSelectedDark: {
    backgroundColor: Colors.AccentYellow,
    borderWidth: 1.2,
    borderBottomWidth: 2.5,
    borderBottomColor: Colors.HabitBurnishedAmber,
  },
  dayCellDisabled: {
    opacity: 0.44,
  },
  dayText: {
    fontFamily: Fonts.poppins.medium,
    fontSize: ResponsivePixels.size13,
    color: Colors.MidnightCharcoal,
    fontVariant: ['tabular-nums'],
  },
  dayTextSelected: {
    fontFamily: Fonts.poppins.bold,
    color: Colors.PureWhite,
  },
  dayTextSelectedDark: {
    fontFamily: Fonts.poppins.bold,
    color: Colors.RegiusInk,
  },
  dayTextDisabled: {
    color: Colors.MutedSlateSubtext,
  },
  pickerWheelContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  androidClockCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: ResponsivePixels.size14,
    paddingHorizontal: ResponsivePixels.size16,
    borderRadius: ResponsivePixels.size20,
    backgroundColor: withAlpha(Colors.PureWhite, 0.8),
    borderWidth: 1.5,
    borderColor: Colors.WarmChipBorder,
  },
  androidSelectedTimeText: {
    fontFamily: Fonts.poppins.bold,
    fontSize: ResponsivePixels.size18,
    color: Colors.MidnightCharcoal,
    fontVariant: ['tabular-nums'],
  },
  androidClockTriggerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ResponsivePixels.size6,
    backgroundColor: Colors.NeroBlack,
    paddingHorizontal: ResponsivePixels.size16,
    paddingVertical: ResponsivePixels.size9,
    borderRadius: ResponsivePixels.size50,
    borderWidth: 1.5,
    borderTopColor: Colors.DarkChipBevelTop,
    borderBottomWidth: 3,
    borderBottomColor: Colors.DarkChipBevelAbyss,
  },
  androidClockTriggerText: {
    fontFamily: Fonts.poppins.bold,
    fontSize: ResponsivePixels.size12,
    color: Colors.PureWhite,
  },
});

export default UnifiedSchedulePickerModal;
