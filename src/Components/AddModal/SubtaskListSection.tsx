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
            <Plus size={14} color={Colors.PureWhite} strokeWidth={2.4} />
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
                  hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                  accessibilityLabel={`Remove subtask ${item.text}`}
                >
                  <X
                    size={13}
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
    color: Colors.DarkBackground,
    letterSpacing: -0.2,
  },
  sectionSubtext: {
    fontFamily: Fonts.poppins.regular,
    fontSize: 11.5,
    color: Colors.Grey,
  },
  subtaskInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  subtaskTextInput: {
    flex: 1,
    height: 44,
    backgroundColor: Colors.PureWhite,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: Colors.RingBorder,
    paddingHorizontal: 14,
    fontFamily: Fonts.poppins.medium,
    fontSize: 13,
    color: Colors.DarkBackground,
  },
  addSubtaskBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.DarkElevatedNero,
    height: 44,
    paddingHorizontal: 14,
    borderRadius: 14,
    gap: 4,
  },
  addSubtaskBtnText: {
    fontFamily: Fonts.poppins.bold,
    fontSize: 12.5,
    color: Colors.PureWhite,
  },
  subtasksList: {
    marginTop: 10,
    gap: 6,
  },
  subtaskItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.PureWhite,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.RingBorder,
    gap: 10,
  },
  subtaskStepIndicator: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: Colors.CreamSurfaceAlt,
    borderWidth: 1,
    borderColor: Colors.RingBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subtaskStepNumber: {
    fontFamily: Fonts.poppins.bold,
    fontSize: 10,
    color: Colors.Grey,
  },
  subtaskItemText: {
    flex: 1,
    fontFamily: Fonts.poppins.medium,
    fontSize: 12.5,
    color: Colors.DarkBackground,
  },
  removeSubtaskBtn: {
    padding: 2,
  },
});

export default SubtaskListSection;
