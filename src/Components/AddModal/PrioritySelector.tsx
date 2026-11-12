import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { Fonts } from '../../Theme/fonts';
import { Colors } from '../../Assets/StyleUtilities/Colors';
import { useAppTheme } from '../../Theme/useAppTheme';
import ResponsivePixels from '../../Assets/StyleUtilities/ResponsivePixels';

export type PriorityLevel = 'low' | 'medium' | 'high';

export interface PrioritySelectorProps {
  selectedPriority: PriorityLevel;
  onSelectPriority: (priority: PriorityLevel) => void;
  heading?: string;
  subheading?: string;
}

const PRIORITY_OPTIONS: Array<{
  key: PriorityLevel;
  label: string;
  dotColor: string;
}> = [
  { key: 'low', label: 'Low', dotColor: Colors.ToastSuccessAccent },
  { key: 'medium', label: 'Medium', dotColor: Colors.VoiceMichaelAccent },
  { key: 'high', label: 'High', dotColor: Colors.CategoryRedAccent },
];

export const PrioritySelector: React.FC<PrioritySelectorProps> = React.memo(
  ({
    selectedPriority,
    onSelectPriority,
    heading = 'Priority Weight',
    subheading = 'Balance energy load',
  }) => {
    const { isDarkMode, textPrimary, textSecondary } = useAppTheme();

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
          {subheading && (
            <Text
              style={[
                styles.sectionSubtext,
                isDarkMode && { color: textSecondary },
              ]}
            >
              {subheading}
            </Text>
          )}
        </View>

        <View
          style={[
            styles.priorityBarContainer,
            isDarkMode && {
              backgroundColor: Colors.DarkCardBackground,
              borderColor: Colors.CarbonSlate,
            },
          ]}
        >
          {PRIORITY_OPTIONS.map(item => {
            const isActive = selectedPriority === item.key;
            return (
              <TouchableOpacity
                key={item.key}
                activeOpacity={0.85}
                onPress={() => onSelectPriority(item.key)}
                style={[
                  styles.priorityTab,
                  isActive && [
                    styles.priorityTabActive,
                    isDarkMode && { backgroundColor: Colors.CarbonSlate },
                  ],
                ]}
                accessibilityRole="radio"
                accessibilityState={{ selected: isActive }}
                accessibilityLabel={`Priority ${item.label}`}
              >
                <View
                  style={[
                    styles.priorityDot,
                    { backgroundColor: item.dotColor },
                  ]}
                />
                <Text
                  style={[
                    styles.priorityTabText,
                    isActive
                      ? styles.priorityTabTextActive
                      : [
                          styles.priorityTabTextInactive,
                          isDarkMode && { color: Colors.SteelMist },
                        ],
                  ]}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          })}
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: ResponsivePixels.size10,
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
  priorityBarContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.PureWhite,
    borderRadius: ResponsivePixels.size20,
    padding: ResponsivePixels.size4,
    borderWidth: 1.5,
    borderColor: Colors.RingBorder,
  },
  priorityTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: ResponsivePixels.size8,
    borderRadius: ResponsivePixels.size16,
    gap: ResponsivePixels.size6,
  },
  priorityTabActive: {
    backgroundColor: Colors.DarkElevatedNero,
    ...Platform.select({
      ios: {
        shadowColor: Colors.PureBlack,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 3,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  priorityDot: {
    width: ResponsivePixels.size6,
    height: ResponsivePixels.size6,
    borderRadius: ResponsivePixels.size3,
  },
  priorityTabText: {
    fontFamily: Fonts.poppins.medium,
    fontSize: ResponsivePixels.size12,
  },
  priorityTabTextActive: {
    fontFamily: Fonts.poppins.bold,
    color: Colors.PureWhite,
  },
  priorityTabTextInactive: {
    color: Colors.Grey,
  },
});

export default PrioritySelector;
