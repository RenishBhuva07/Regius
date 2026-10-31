import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { Fonts } from '../../Theme/fonts';

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
  { key: 'low', label: 'Low', dotColor: '#10B981' },
  { key: 'medium', label: 'Medium', dotColor: '#F59E0B' },
  { key: 'high', label: 'High', dotColor: '#EF4444' },
];

export const PrioritySelector: React.FC<PrioritySelectorProps> = React.memo(
  ({
    selectedPriority,
    onSelectPriority,
    heading = 'Priority Weight',
    subheading = 'Balance energy load',
  }) => {
    return (
      <View style={styles.sectionBlock}>
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionHeading}>{heading}</Text>
          {subheading && (
            <Text style={styles.sectionSubtext}>{subheading}</Text>
          )}
        </View>

        <View style={styles.priorityBarContainer}>
          {PRIORITY_OPTIONS.map(item => {
            const isActive = selectedPriority === item.key;
            return (
              <TouchableOpacity
                key={item.key}
                activeOpacity={0.85}
                onPress={() => onSelectPriority(item.key)}
                style={[
                  styles.priorityTab,
                  isActive && styles.priorityTabActive,
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
                      : styles.priorityTabTextInactive,
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
    marginBottom: 20,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  sectionHeading: {
    fontFamily: Fonts.poppins.bold,
    fontSize: 13.5,
    color: '#121417',
    letterSpacing: -0.2,
  },
  sectionSubtext: {
    fontFamily: Fonts.poppins.regular,
    fontSize: 11.5,
    color: '#77767B',
  },
  priorityBarContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 4,
    borderWidth: 1.5,
    borderColor: '#E8E2D5',
  },
  priorityTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 16,
    gap: 6,
  },
  priorityTabActive: {
    backgroundColor: '#1E2028',
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
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
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  priorityTabText: {
    fontFamily: Fonts.poppins.medium,
    fontSize: 12,
  },
  priorityTabTextActive: {
    fontFamily: Fonts.poppins.bold,
    color: '#FFFFFF',
  },
  priorityTabTextInactive: {
    color: '#77767B',
  },
});

export default PrioritySelector;
