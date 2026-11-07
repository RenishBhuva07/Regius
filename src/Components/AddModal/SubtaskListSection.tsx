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
                backgroundColor: '#171A1F',
                borderColor: '#2C3035',
                color: '#FFFFFF',
              },
            ]}
            placeholder={placeholder}
            placeholderTextColor="#A3A8B1"
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
            <Plus size={14} color="#FFFFFF" strokeWidth={2.4} />
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
                    backgroundColor: '#1E2228',
                    borderColor: '#2C3035',
                  },
                ]}
              >
                <View
                  style={[
                    styles.subtaskStepIndicator,
                    isDarkMode && {
                      backgroundColor: '#2A2D35',
                      borderColor: '#363944',
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.subtaskStepNumber,
                      isDarkMode && { color: '#A3A8B1' },
                    ]}
                  >
                    {index + 1}
                  </Text>
                </View>

                <Text
                  style={[
                    styles.subtaskItemText,
                    isDarkMode && { color: '#FFFFFF' },
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
                    color={isDarkMode ? '#A3A8B1' : '#7E838F'}
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
    color: '#121417',
    letterSpacing: -0.2,
  },
  sectionSubtext: {
    fontFamily: Fonts.poppins.regular,
    fontSize: 11.5,
    color: '#77767B',
  },
  subtaskInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  subtaskTextInput: {
    flex: 1,
    height: 44,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#E8E2D5',
    paddingHorizontal: 14,
    fontFamily: Fonts.poppins.medium,
    fontSize: 13,
    color: '#121417',
  },
  addSubtaskBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1E2028',
    height: 44,
    paddingHorizontal: 14,
    borderRadius: 14,
    gap: 4,
  },
  addSubtaskBtnText: {
    fontFamily: Fonts.poppins.bold,
    fontSize: 12.5,
    color: '#FFFFFF',
  },
  subtasksList: {
    marginTop: 10,
    gap: 6,
  },
  subtaskItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E8E2D5',
    gap: 10,
  },
  subtaskStepIndicator: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#FAF8F5',
    borderWidth: 1,
    borderColor: '#E8E2D5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  subtaskStepNumber: {
    fontFamily: Fonts.poppins.bold,
    fontSize: 10,
    color: '#77767B',
  },
  subtaskItemText: {
    flex: 1,
    fontFamily: Fonts.poppins.medium,
    fontSize: 12.5,
    color: '#121417',
  },
  removeSubtaskBtn: {
    padding: 2,
  },
});

export default SubtaskListSection;
