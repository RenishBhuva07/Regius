import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Platform,
} from 'react-native';
import { Calendar } from 'lucide-react-native';
import { Fonts } from '../../../Theme/fonts';
import { Colors, withAlpha } from '../../../Assets/StyleUtilities/Colors';
import { useAppTheme } from '../../../Theme/useAppTheme';
import ResponsivePixels from '../../../Assets/StyleUtilities/ResponsivePixels';
import { HeaderActionButton } from '../../../Common/HeaderActionButton';
import { UnifiedSchedulePickerModal } from '../../../Common/UnifiedSchedulePickerModal';
import { Task } from '../../../Context/TaskReminderContext';
import {
  toLocalISODate,
  addDaysToISO,
  parseLocalISODate,
  resolveTaskDueDate,
  formatShortDateBadge,
} from '../../../Utils/taskDateUtils';

const DAY_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export interface UpcomingAgendaStripProps {
  tasks: Task[];
  selectedDateISO: string | null;
  onSelectDateISO: (iso: string | null) => void;
}

export const UpcomingAgendaStrip: React.FC<UpcomingAgendaStripProps> =
  React.memo(({ tasks, selectedDateISO, onSelectDateISO }) => {
    const { isDarkMode, textPrimary, textSecondary } = useAppTheme();
    const [showJumpPicker, setShowJumpPicker] = useState(false);

    const todayISO = toLocalISODate();
    const tomorrowISO = addDaysToISO(todayISO, 1);

    const taskCountByDate = useMemo(() => {
      const map: Record<string, number> = {};
      tasks.forEach(t => {
        if (t.done) return;
        const due = resolveTaskDueDate(t, todayISO);
        if (due && due > todayISO) {
          map[due] = (map[due] || 0) + 1;
        }
      });
      return map;
    }, [tasks, todayISO]);

    const totalUpcomingCount = useMemo(
      () => Object.values(taskCountByDate).reduce((acc, n) => acc + n, 0),
      [taskCountByDate],
    );

    const upcomingDays = useMemo(() => {
      const list: Array<{
        iso: string;
        dayName: string;
        dayNum: number;
        count: number;
        isCustomJump?: boolean;
      }> = [];

      for (let i = 1; i <= 14; i++) {
        const iso = addDaysToISO(todayISO, i);
        const dateObj = parseLocalISODate(iso) || new Date();
        list.push({
          iso,
          dayName: i === 1 ? 'Tmrw' : DAY_SHORT[dateObj.getDay()],
          dayNum: dateObj.getDate(),
          count: taskCountByDate[iso] || 0,
        });
      }

      if (
        selectedDateISO &&
        selectedDateISO > todayISO &&
        !list.some(d => d.iso === selectedDateISO)
      ) {
        const dateObj = parseLocalISODate(selectedDateISO) || new Date();
        list.push({
          iso: selectedDateISO,
          dayName: DAY_SHORT[dateObj.getDay()],
          dayNum: dateObj.getDate(),
          count: taskCountByDate[selectedDateISO] || 0,
          isCustomJump: true,
        });
      }

      return list;
    }, [todayISO, taskCountByDate, selectedDateISO]);

    const jumpPickerValue = useMemo(() => {
      if (selectedDateISO) {
        const parsed = parseLocalISODate(selectedDateISO);
        if (parsed) return parsed;
      }
      return parseLocalISODate(tomorrowISO) || new Date();
    }, [selectedDateISO, tomorrowISO]);

    const minFutureDate = useMemo(
      () => parseLocalISODate(tomorrowISO) || new Date(),
      [tomorrowISO],
    );

    return (
      <View style={styles.container}>
        <View style={styles.headerRow}>
          <View>
            <Text style={[styles.heading, { color: textPrimary }]}>
              Future Horizon
            </Text>
            <Text style={[styles.subheading, { color: textSecondary }]}>
              {selectedDateISO
                ? `Filtered: ${formatShortDateBadge(selectedDateISO, todayISO)}`
                : `${totalUpcomingCount} upcoming objective${
                    totalUpcomingCount === 1 ? '' : 's'
                  }`}
            </Text>
          </View>

          <HeaderActionButton
            label="Pick Date"
            icon={Calendar}
            onPress={() => setShowJumpPicker(true)}
            accessibilityLabel="Jump to any future date"
          />
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.stripContent}
        >
          {/* All Upcoming Chip */}
          <TouchableOpacity
            activeOpacity={0.82}
            onPress={() => onSelectDateISO(null)}
            style={[
              styles.allPill,
              isDarkMode && {
                backgroundColor: Colors.DarkCardBackground,
                borderColor: Colors.CarbonSlate,
              },
              selectedDateISO === null && styles.dayCardSelected,
            ]}
            accessibilityRole="button"
            accessibilityLabel="Show all upcoming dates"
          >
            <Text
              style={[
                styles.allLabel,
                isDarkMode && { color: Colors.SteelMist },
                selectedDateISO === null && styles.dayTextSelected,
              ]}
            >
              All
            </Text>
            <Text
              style={[
                styles.allCount,
                isDarkMode && { color: Colors.PureWhite },
                selectedDateISO === null && styles.dayNumSelected,
              ]}
            >
              {totalUpcomingCount}
            </Text>
          </TouchableOpacity>

          {/* Day Cards */}
          {upcomingDays.map(day => {
            const isSelected = selectedDateISO === day.iso;
            return (
              <TouchableOpacity
                key={day.iso}
                activeOpacity={0.82}
                onPress={() => onSelectDateISO(isSelected ? null : day.iso)}
                style={[
                  styles.dayCard,
                  isDarkMode && {
                    backgroundColor: Colors.DarkCardBackground,
                    borderColor: Colors.CarbonSlate,
                  },
                  isSelected && styles.dayCardSelected,
                ]}
                accessibilityRole="button"
                accessibilityState={{ selected: isSelected }}
                accessibilityLabel={`Filter by ${day.iso}`}
              >
                <Text
                  style={[
                    styles.dayName,
                    isDarkMode && { color: Colors.SteelMist },
                    isSelected && styles.dayTextSelected,
                  ]}
                  numberOfLines={1}
                >
                  {day.dayName}
                </Text>
                <Text
                  style={[
                    styles.dayNum,
                    isDarkMode && { color: Colors.PureWhite },
                    isSelected && styles.dayNumSelected,
                  ]}
                >
                  {day.dayNum}
                </Text>
                <View style={styles.dotSlot}>
                  {day.count > 0 && (
                    <View
                      style={[
                        styles.activityDot,
                        {
                          backgroundColor: isSelected
                            ? Colors.AccentYellow
                            : Colors.LavenderPurple,
                        },
                      ]}
                    />
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <UnifiedSchedulePickerModal
          visible={showJumpPicker}
          mode="date"
          value={jumpPickerValue}
          minimumDate={minFutureDate}
          title="Jump to Future Date"
          badgeText="HORIZON CALENDAR"
          onChange={(_e, date) => {
            if (date) {
              onSelectDateISO(toLocalISODate(date));
            }
          }}
          onClose={() => setShowJumpPicker(false)}
        />
      </View>
    );
  });

const styles = StyleSheet.create({
  container: {
    marginBottom: ResponsivePixels.size12,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: ResponsivePixels.size12,
    marginBottom: ResponsivePixels.size10,
  },
  heading: {
    fontFamily: Fonts.poppins.bold,
    fontSize: ResponsivePixels.size14,
  },
  subheading: {
    fontFamily: Fonts.poppins.regular,
    fontSize: ResponsivePixels.size11,
  },
  stripContent: {
    paddingHorizontal: ResponsivePixels.size12,
    gap: ResponsivePixels.size8,
    paddingVertical: ResponsivePixels.size2,
  },
  allPill: {
    width: ResponsivePixels.size52,
    height: ResponsivePixels.size66,
    borderRadius: ResponsivePixels.size18,
    backgroundColor: Colors.PureWhite,
    borderWidth: 1.5,
    borderColor: Colors.RingBorder,
    alignItems: 'center',
    justifyContent: 'center',
    gap: ResponsivePixels.size2,
  },
  dayCard: {
    width: ResponsivePixels.size50,
    height: ResponsivePixels.size66,
    borderRadius: ResponsivePixels.size18,
    backgroundColor: Colors.PureWhite,
    borderWidth: 1.5,
    borderColor: Colors.RingBorder,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: ResponsivePixels.size6,
  },
  dayCardSelected: {
    backgroundColor: Colors.DarkElevatedNero,
    borderColor: Colors.DarkBorder,
    ...Platform.select({
      ios: {
        shadowColor: Colors.PureBlack,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  allLabel: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: ResponsivePixels.size10_5,
    color: Colors.MutedSlateSubtext,
  },
  allCount: {
    fontFamily: Fonts.poppins.bold,
    fontSize: ResponsivePixels.size15,
    color: Colors.RegiusInk,
    fontVariant: ['tabular-nums'],
  },
  dayName: {
    fontFamily: Fonts.poppins.medium,
    fontSize: ResponsivePixels.size10,
    color: Colors.MutedSlateSubtext,
  },
  dayNum: {
    fontFamily: Fonts.poppins.bold,
    fontSize: ResponsivePixels.size15,
    color: Colors.RegiusInk,
    fontVariant: ['tabular-nums'],
    marginTop: ResponsivePixels.size1,
  },
  dayTextSelected: {
    color: withAlpha(Colors.PureWhite, 0.78),
  },
  dayNumSelected: {
    color: Colors.PureWhite,
  },
  dotSlot: {
    height: ResponsivePixels.size6,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: ResponsivePixels.size2,
  },
  activityDot: {
    width: ResponsivePixels.size5,
    height: ResponsivePixels.size5,
    borderRadius: ResponsivePixels.size2_5,
  },
});

export default UpcomingAgendaStrip;
