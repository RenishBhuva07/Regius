import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Plus, X } from 'lucide-react-native';
import { Fonts } from '../../Theme/fonts';
import { Colors } from '../../Assets/StyleUtilities/Colors';
import { useAppTheme } from '../../Theme/useAppTheme';
import ResponsivePixels from '../../Assets/StyleUtilities/ResponsivePixels';

export interface SubtaskItem {
  id: string;
  text: string;
  done?: boolean;
}

export interface SubtaskListSectionProps {
  subtasks: SubtaskItem[];
  input: string;
  onChangeInput: (text: string) => void;
  onAdd: () => void;
  onRemove: (id: string) => void;
  heading?: string;
  subheading?: string;
  placeholder?: string;
}

export const SubtaskListSection: React.FC<SubtaskListSectionProps> = React.memo(
  ({
    subtasks,
    input,
    onChangeInput,
    onAdd,
    onRemove,
    heading = 'Subtasks & Milestones',
    subheading = 'Break into actionable steps',
    placeholder = 'e.g. Draft structure, Review feedback',
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

        <View style={styles.subtaskInputRow}>
          <TextInput
            style={[
              styles.subtaskTextInput,
              isDarkMode && {
                backgroundColor: Colors.DarkSurfaceAlt,
                borderColor: Colors.CarbonSlate,
                color: Colors.PureWhite,
              },
            ]}
            placeholder={placeholder}
            placeholderTextColor={Colors.SteelMist}
            value={input}
            onChangeText={onChangeInput}
            onSubmitEditing={onAdd}
            returnKeyType="done"
          />
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={onAdd}
            style={styles.addSubtaskBtn}
            accessibilityRole="button"
            accessibilityLabel="Add subtask"
          >
            <Plus size={ResponsivePixels.size14} color={Colors.PureWhite} strokeWidth={2.4} />
            <Text style={styles.addSubtaskBtnText}>Add</Text>
          </TouchableOpacity>
        </View>

        {subtasks.length > 0 && (
          <View style={styles.subtasksList}>
            {subtasks.map((item, index) => (
              <View
                key={item.id}
                style={[
                  styles.subtaskItemRow,
                  isDarkMode && {
                    backgroundColor: Colors.DarkCardBackground,
                    borderColor: Colors.CarbonSlate,
                  },
                ]}
              >
                <View
                  style={[
                    styles.subtaskStepIndicator,
                    isDarkMode && {
                      backgroundColor: Colors.DarkCardElevated,
                      borderColor: Colors.DarkBorder,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.subtaskStepNumber,
                      isDarkMode && { color: Colors.SteelMist },
                    ]}
                  >
                    {index + 1}
                  </Text>
                </View>

                <Text
                  style={[
                    styles.subtaskItemText,
                    isDarkMode && { color: Colors.PureWhite },
                  ]}
                  numberOfLines={2}
                >
                  {item.text}
                </Text>

                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => onRemove(item.id)}
                  style={styles.removeSubtaskBtn}
                  hitSlop={{ top: ResponsivePixels.size6, bottom: ResponsivePixels.size6, left: ResponsivePixels.size6, right: ResponsivePixels.size6 }}
                  accessibilityLabel={`Remove subtask ${item.text}`}
                >
                  <X
                    size={ResponsivePixels.size13}
                    color={
                      isDarkMode ? Colors.SteelMist : Colors.MutedSlateSubtext
                    }
                    strokeWidth={2.2}
                  />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
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
  subtaskInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ResponsivePixels.size8,
  },
  subtaskTextInput: {
    flex: 1,
    height: ResponsivePixels.size44,
    backgroundColor: Colors.PureWhite,
    borderRadius: ResponsivePixels.size14,
    borderWidth: 1.5,
    borderColor: Colors.RingBorder,
    paddingHorizontal: ResponsivePixels.size14,
    fontFamily: Fonts.poppins.medium,
    fontSize: ResponsivePixels.size13,
    color: Colors.DarkBackground,
  },
  addSubtaskBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.DarkElevatedNero,
    height: ResponsivePixels.size44,
    paddingHorizontal: ResponsivePixels.size14,
    borderRadius: ResponsivePixels.size14,
    gap: ResponsivePixels.size4,
  },
  addSubtaskBtnText: {
    fontFamily: Fonts.poppins.bold,
    fontSize: ResponsivePixels.size12_5,
    color: Colors.PureWhite,
  },
  subtasksList: {
    marginTop: ResponsivePixels.size10,
    gap: ResponsivePixels.size6,
  },
  subtaskItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.PureWhite,
    paddingVertical: ResponsivePixels.size8,
    paddingHorizontal: ResponsivePixels.size12,
    borderRadius: ResponsivePixels.size12,
    borderWidth: 1,
    borderColor: Colors.RingBorder,
    gap: ResponsivePixels.size10,
  },
  subtaskStepIndicator: {
    width: ResponsivePixels.size22,
    height: ResponsivePixels.size22,
    borderRadius: ResponsivePixels.size11,
    backgroundColor: Colors.CreamSurfaceAlt,
    borderWidth: 1,
    borderColor: Colors.RingBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subtaskStepNumber: {
    fontFamily: Fonts.poppins.bold,
    fontSize: ResponsivePixels.size10,
    color: Colors.Grey,
  },
  subtaskItemText: {
    flex: 1,
    fontFamily: Fonts.poppins.medium,
    fontSize: ResponsivePixels.size12_5,
    color: Colors.DarkBackground,
  },
  removeSubtaskBtn: {
    padding: ResponsivePixels.size2,
  },
});

export default SubtaskListSection;
