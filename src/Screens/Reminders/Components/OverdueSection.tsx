import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { AlertTriangle, ChevronDown, ChevronUp, CalendarClock } from 'lucide-react-native';
import { Fonts } from '../../../Theme/fonts';
import { Colors, withAlpha } from '../../../Assets/StyleUtilities/Colors';
import { useAppTheme } from '../../../Theme/useAppTheme';
import { Badge } from '../../../Common/Badge';
import { HeaderActionButton } from '../../../Common/HeaderActionButton';
import ResponsivePixels from '../../../Assets/StyleUtilities/ResponsivePixels';
import { Reminder } from '../../../Services/Reminders/types';

interface OverdueSectionProps {
  overdueReminders: Reminder[];
  onRescheduleAll: () => void;
  renderCard: (reminder: Reminder) => React.ReactNode;
}

export const OverdueSection: React.FC<OverdueSectionProps> = ({
  overdueReminders,
  onRescheduleAll,
  renderCard,
}) => {
  const { isDarkMode, textPrimary } = useAppTheme();
  const [isExpanded, setIsExpanded] = useState(true);

  if (overdueReminders.length === 0) return null;

  return (
    <View
      style={[
        styles.container,
        isDarkMode && {
          backgroundColor: withAlpha(Colors.AccentAmber, 0.08),
          borderColor: withAlpha(Colors.AccentAmber, 0.35),
        },
      ]}
    >
      <View style={styles.headerRow}>
        <TouchableOpacity
          activeOpacity={0.75}
          onPress={() => setIsExpanded(prev => !prev)}
          style={styles.headerLeft}
          accessibilityRole="button"
          accessibilityLabel={`Overdue reminders, ${overdueReminders.length} items`}
        >
          <View style={styles.iconBadge}>
            <AlertTriangle
              size={ResponsivePixels.size14}
              color={Colors.AccentAmber}
              strokeWidth={2.5}
            />
          </View>
          <Text style={[styles.title, isDarkMode && { color: textPrimary }]}>
            Overdue
          </Text>
          <Badge
            label={String(overdueReminders.length)}
            variant="orange"
            size="sm"
          />
          {isExpanded ? (
            <ChevronUp
              size={ResponsivePixels.size16}
              color={Colors.MutedSlateSubtext}
            />
          ) : (
            <ChevronDown
              size={ResponsivePixels.size16}
              color={Colors.MutedSlateSubtext}
            />
          )}
        </TouchableOpacity>

        <HeaderActionButton
          label="Reschedule All"
          icon={CalendarClock}
          iconPosition="left"
          onPress={onRescheduleAll}
          accessibilityLabel="Reschedule all overdue reminders to today"
        />
      </View>

      {isExpanded && (
        <View style={styles.list}>
          {overdueReminders.map(rem => (
            <React.Fragment key={rem.id}>{renderCard(rem)}</React.Fragment>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.CategoryOrangeSoftBg,
    borderRadius: ResponsivePixels.size20,
    borderWidth: 1.5,
    borderColor: Colors.EventLightBorder,
    padding: ResponsivePixels.size12,
    marginBottom: ResponsivePixels.size16,
    ...Platform.select({
      ios: {
        shadowColor: Colors.AccentAmber,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: ResponsivePixels.size8,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ResponsivePixels.size7,
    flex: 1,
  },
  iconBadge: {
    width: ResponsivePixels.size26,
    height: ResponsivePixels.size26,
    borderRadius: ResponsivePixels.size13,
    backgroundColor: withAlpha(Colors.AccentAmber, 0.16),
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontFamily: Fonts.poppins.bold,
    fontSize: ResponsivePixels.size14,
    color: Colors.RegiusInk,
  },
  list: {
    marginTop: ResponsivePixels.size12,
    gap: ResponsivePixels.size10,
  },
});

export default OverdueSection;
