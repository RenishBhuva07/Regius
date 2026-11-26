import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  ScrollView,
} from 'react-native';
import { Repeat } from 'lucide-react-native';
import { Fonts } from '../../Theme/fonts';
import { Colors } from '../../Assets/StyleUtilities/Colors';
import { useAppTheme } from '../../Theme/useAppTheme';
import ResponsivePixels from '../../Assets/StyleUtilities/ResponsivePixels';
import { TaskRecurrence } from '../../Utils/taskDateUtils';

export interface RecurrenceSelectorProps {
  selectedRecurrence: TaskRecurrence;
  onSelectRecurrence: (recurrence: TaskRecurrence) => void;
  heading?: string;
  subheading?: string;
}

const RECURRENCE_OPTIONS: Array<{
  key: TaskRecurrence;
  label: string;
}> = [
  { key: 'none', label: 'Once' },
  { key: 'daily', label: 'Daily' },
  { key: 'weekdays', label: 'Weekdays' },
  { key: 'weekly', label: 'Weekly' },
  { key: 'monthly', label: 'Monthly' },
];

export const RecurrenceSelector: React.FC<RecurrenceSelectorProps> = React.memo(
  ({
    selectedRecurrence,
    onSelectRecurrence,
    heading = 'Repeat Cadence',
    subheading = 'Auto-schedule next',
  }) => {
    const { isDarkMode, textPrimary, textSecondary } = useAppTheme();

    return (
      <View style={styles.sectionBlock}>
        <View style={styles.sectionHeaderRow}>
          <View style={styles.headingWrap}>
            <Repeat
              size={ResponsivePixels.size13}
              color={isDarkMode ? Colors.AccentYellow : Colors.MindfulTextAccent}
              strokeWidth={2.4}
            />
            <Text
              style={[
                styles.sectionHeading,
                isDarkMode && { color: textPrimary },
              ]}
            >
              {heading}
            </Text>
          </View>
          {subheading ? (
            <Text
              style={[
                styles.sectionSubtext,
                isDarkMode && { color: textSecondary },
              ]}
            >
              {subheading}
            </Text>
          ) : null}
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.chipsScroll}
          contentContainerStyle={styles.chipsRow}
        >
          {RECURRENCE_OPTIONS.map(item => {
            const isActive = selectedRecurrence === item.key;
            return (
              <TouchableOpacity
                key={item.key}
                activeOpacity={0.8}
                onPress={() => onSelectRecurrence(item.key)}
                style={[
                  styles.chip,
                  isDarkMode &&
                    !isActive && {
                      backgroundColor: Colors.DarkCardBackground,
                      borderColor: Colors.DarkBorderSubtle,
                      borderBottomColor: Colors.DarkSurfaceAlt,
                    },
                  isActive && styles.chipActive,
                  isActive &&
                    isDarkMode && {
                      backgroundColor: Colors.AccentYellow,
                      borderColor: Colors.WorkDarkBorder,
                      borderTopColor: Colors.WorkLightBorder,
                      borderBottomColor: Colors.HabitBurnishedAmber,
                    },
                ]}
                accessibilityRole="radio"
                accessibilityState={{ selected: isActive }}
                accessibilityLabel={`Repeat ${item.label}`}
              >
                <Text
                  style={[
                    styles.chipText,
                    isDarkMode && !isActive && { color: Colors.SteelMist },
                    isActive &&
                      (isDarkMode
                        ? styles.chipTextActiveDark
                        : styles.chipTextActive),
                  ]}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    );
  },
);

const styles = StyleSheet.create({
  sectionBlock: {
    marginBottom: ResponsivePixels.size20,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: ResponsivePixels.size10,
  },
  headingWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ResponsivePixels.size6,
  },
  sectionHeading: {
    fontFamily: Fonts.poppins.bold,
    fontSize: ResponsivePixels.size13_5,
    color: Colors.DarkBackground,
    letterSpacing: -0.2,
  },
  sectionSubtext: {
    fontFamily: Fonts.poppins.regular,
    fontSize: ResponsivePixels.size11_5,
    color: Colors.Grey,
  },
  chipsScroll: {
    marginHorizontal: -ResponsivePixels.size20,
  },
  chipsRow: {
    flexDirection: 'row',
    gap: ResponsivePixels.size8,
    paddingHorizontal: ResponsivePixels.size20,
    paddingVertical: ResponsivePixels.size4,
  },
  chip: {
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
  chipActive: {
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
  chipText: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: ResponsivePixels.size11_5,
    color: Colors.CharcoalStoneText,
  },
  chipTextActive: {
    fontFamily: Fonts.poppins.bold,
    color: Colors.PureWhite,
  },
  chipTextActiveDark: {
    fontFamily: Fonts.poppins.bold,
    color: Colors.RegiusInk,
  },
});

export default RecurrenceSelector;
