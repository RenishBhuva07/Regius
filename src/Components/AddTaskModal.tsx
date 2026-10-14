import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Platform,
  Modal,
  TextInput,
  KeyboardAvoidingView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Mail, Users, Check, X, Calendar } from 'lucide-react-native';
import Svg, { Path } from 'react-native-svg';
import { Fonts } from '../Theme/fonts';
import { Colors } from '../Assets/StyleUtilities/Colors';
import { SVGS } from '../Assets/Images';
import ResponsivePixels from '../Assets/StyleUtilities/ResponsivePixels';

// ─── Inline SVGs ─────────────────────────────────────────────────────────────

const OfficeBagIcon: React.FC<{ width?: number; height?: number }> = ({
  width = 24,
  height = 24,
}) => (
  <Svg width={width} height={height} viewBox="23 19 24 24" fill="none">
    <Path
      opacity={0.4}
      d="M25.0002 30.0785C25.0502 32.4165 25.1902 36.4155 25.2102 36.8565C25.2812 37.7995 25.6422 38.7525 26.2042 39.4245C26.9862 40.3675 27.9492 40.7885 29.2922 40.7885C31.1482 40.7985 33.1942 40.7985 35.1812 40.7985C37.1762 40.7985 39.1122 40.7985 40.7472 40.7885C42.0712 40.7885 43.0642 40.3565 43.8362 39.4245C44.3982 38.7525 44.7592 37.7895 44.8102 36.8565C44.8302 36.4855 44.9302 32.1445 44.9902 30.0785H25.0002Z"
      fill="#FFE600"
    />
    <Path
      d="M34.2454 34.3842V35.6782C34.2454 36.0922 34.5814 36.4282 34.9954 36.4282C35.4094 36.4282 35.7454 36.0922 35.7454 35.6782V34.3842C35.7454 33.9702 35.4094 33.6342 34.9954 33.6342C35.4094 33.6342 34.2454 33.9702 34.2454 34.3842Z"
      fill="#FFE600"
    />
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M33.2113 33.5564C33.1113 33.9194 32.7623 34.1514 32.3843 34.1014C29.8333 33.7454 27.3953 32.8404 25.3373 31.4814C25.1263 31.3434 25.0003 31.1074 25.0003 30.8554V27.3894C25.0003 25.2894 26.7123 23.5814 28.8173 23.5814H30.7843C30.9723 22.1294 32.2023 21.0004 33.7043 21.0004H36.2863C37.7873 21.0004 39.0183 22.1294 39.2063 23.5814H41.1833C43.2823 23.5814 44.9903 25.2894 44.9903 27.3894V30.8554C44.9903 31.1074 44.8633 31.3424 44.6543 31.4814C42.5923 32.8464 40.1443 33.7554 37.5763 34.1104C37.5413 34.1154 37.5073 34.1174 37.4733 34.1174C37.1343 34.1174 36.8313 33.8884 36.7463 33.5524C36.5443 32.7564 35.8213 32.1994 34.9903 32.1994C34.1483 32.1994 33.4333 32.7444 33.2113 33.5564ZM36.2863 22.5004H33.7043C33.0313 22.5004 32.4693 22.9604 32.3013 23.5814H37.6883C37.5203 22.9604 36.9583 22.5004 36.2863 22.5004Z"
      fill="#FFE600"
    />
  </Svg>
);

const CATEGORIES = [
  {
    id: 'works',
    label: 'Works',
    bgColor: '#FFFCEB',
    borderColor: '#FFF5B8',
    Icon: OfficeBagIcon,
    accentColor: '#FDD835',
  },
  {
    id: 'sport',
    label: 'Sport',
    bgColor: '#EDFDF5',
    borderColor: '#C6FFDD',
    Icon: SVGS.FloatHeart,
    accentColor: '#52D22E',
  },
  {
    id: 'habits',
    label: 'Habits',
    bgColor: '#EFF2FE',
    borderColor: '#D8DBFF',
    Icon: SVGS.FloatPicture,
    accentColor: '#8383D6',
  },
];

export interface AddTaskModalProps {
  visible: boolean;
  onClose: () => void;
  onCreateTask: (data: {
    title: string;
    note?: string;
    category: string;
    iconType: 'mail' | 'users';
    priority: 'low' | 'medium' | 'high';
    date: string;
  }) => void;
}

export const AddTaskModal: React.FC<AddTaskModalProps> = ({
  visible,
  onClose,
  onCreateTask,
}) => {
  const insets = useSafeAreaInsets();
  const topInset = Math.max(
    insets.top,
    Platform.OS === 'ios' ? 47 : StatusBar.currentHeight || 0,
  );
  const bottomInset = Math.max(insets.bottom, Platform.OS === 'ios' ? 24 : 16);

  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskNote, setNewTaskNote] = useState('');
  const [newTaskCategory, setNewTaskCategory] = useState('works');
  const [newTaskIcon, setNewTaskIcon] = useState<'mail' | 'users'>('mail');
  const [newTaskPriority, setNewTaskPriority] = useState<
    'low' | 'medium' | 'high'
  >('medium');
  const [newTaskDate, setNewTaskDate] = useState('Today');

  const resetForm = () => {
    setNewTaskTitle('');
    setNewTaskNote('');
    setNewTaskCategory('works');
    setNewTaskIcon('mail');
    setNewTaskPriority('medium');
    setNewTaskDate('Today');
  };

  useEffect(() => {
    if (visible) {
      resetForm();
    }
  }, [visible]);

  const handleCreate = () => {
    if (!newTaskTitle.trim()) return;
    onCreateTask({
      title: newTaskTitle.trim(),
      note: newTaskNote.trim() || undefined,
      category: newTaskCategory,
      iconType: newTaskIcon,
      priority: newTaskPriority,
      date: newTaskDate,
    });
    resetForm();
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={handleClose}
    >
      <StatusBar barStyle="dark-content" />
      <View style={styles.sheetContainer}>
        {/* Top Notch / Dynamic Island Spacer with clean white background */}
        <View style={{ height: topInset, backgroundColor: '#FFFFFF' }} />

        {/* Header */}
        <View style={styles.sheetHeader}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handleClose}
            style={styles.sheetCloseBtn}
            accessibilityRole="button"
            accessibilityLabel="Close"
          >
            <X size={20} color={Colors.MidnightCharcoal} strokeWidth={2.4} />
          </TouchableOpacity>

          <View style={styles.sheetHeaderCenter}>
            <Text style={styles.sheetTitle}>New Task</Text>
            <Text style={styles.sheetSubtitle}>Personalize your schedule</Text>
          </View>

          <View style={{ width: 40 }} />
        </View>

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.sheetKeyboardAvoid}
        >
          <ScrollView
            style={styles.sheetScroll}
            contentContainerStyle={styles.sheetScrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Task Title */}
            <View style={styles.sheetSection}>
              <Text style={styles.sheetLabel}>Task Title</Text>
              <View style={styles.inputCard}>
                <TextInput
                  style={styles.titleInput}
                  placeholder="e.g., Client meeting, Review project"
                  placeholderTextColor="#A3A8B1"
                  value={newTaskTitle}
                  onChangeText={setNewTaskTitle}
                  autoFocus
                />
                {newTaskTitle.length > 0 && (
                  <TouchableOpacity
                    onPress={() => setNewTaskTitle('')}
                    style={styles.clearBtn}
                  >
                    <X size={15} color="#9CA3AF" />
                  </TouchableOpacity>
                )}
              </View>
            </View>

            {/* Task Note / Description */}
            <View style={styles.sheetSection}>
              <Text style={styles.sheetLabel}>Notes & Details (Optional)</Text>
              <View style={[styles.inputCard, styles.noteInputCard]}>
                <TextInput
                  style={styles.noteInput}
                  placeholder="Add extra context, checklist, or description..."
                  placeholderTextColor="#A3A8B1"
                  value={newTaskNote}
                  onChangeText={setNewTaskNote}
                  multiline
                  textAlignVertical="top"
                />
              </View>
            </View>

            {/* Category Picker */}
            <View style={styles.sheetSection}>
              <Text style={styles.sheetLabel}>Category</Text>
              <View style={styles.categoryCardRow}>
                {CATEGORIES.map(cat => {
                  const isSelected = newTaskCategory === cat.id;
                  const CatIcon = cat.Icon;
                  return (
                    <TouchableOpacity
                      key={cat.id}
                      activeOpacity={0.8}
                      onPress={() => setNewTaskCategory(cat.id)}
                      style={[
                        styles.catSelectCard,
                        {
                          backgroundColor: cat.bgColor,
                          borderColor: isSelected
                            ? cat.accentColor || '#1F2228'
                            : cat.borderColor,
                        },
                        isSelected && styles.catSelectCardActive,
                      ]}
                    >
                      <View style={styles.catIconCircle}>
                        <CatIcon width={22} height={22} />
                      </View>
                      <Text style={styles.catSelectLabel}>{cat.label}</Text>
                      {isSelected && (
                        <View
                          style={[
                            styles.catSelectedBadge,
                            { backgroundColor: cat.accentColor || '#1F2228' },
                          ]}
                        >
                          <Check size={11} color="#FFFFFF" strokeWidth={3} />
                        </View>
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Icon Type Selection */}
            <View style={styles.sheetSection}>
              <Text style={styles.sheetLabel}>Icon Type</Text>
              <View style={styles.chipsRow}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => setNewTaskIcon('mail')}
                  style={[
                    styles.sheetPill,
                    newTaskIcon === 'mail' && styles.sheetPillActive,
                  ]}
                >
                  <Mail
                    size={16}
                    color={newTaskIcon === 'mail' ? '#FFFFFF' : '#454A53'}
                    strokeWidth={2.2}
                  />
                  <Text
                    style={[
                      styles.sheetPillText,
                      newTaskIcon === 'mail' && styles.sheetPillTextActive,
                    ]}
                  >
                    Email / Message
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => setNewTaskIcon('users')}
                  style={[
                    styles.sheetPill,
                    newTaskIcon === 'users' && styles.sheetPillActive,
                  ]}
                >
                  <Users
                    size={16}
                    color={newTaskIcon === 'users' ? '#FFFFFF' : '#454A53'}
                    strokeWidth={2.2}
                  />
                  <Text
                    style={[
                      styles.sheetPillText,
                      newTaskIcon === 'users' && styles.sheetPillTextActive,
                    ]}
                  >
                    Meeting / Team
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Priority */}
            <View style={styles.sheetSection}>
              <Text style={styles.sheetLabel}>Priority</Text>
              <View style={styles.chipsRow}>
                {[
                  { key: 'low', label: 'Low', color: '#52D22E' },
                  { key: 'medium', label: 'Medium', color: '#F5C518' },
                  { key: 'high', label: 'High', color: '#FF5B65' },
                ].map(p => {
                  const isSelected = newTaskPriority === p.key;
                  return (
                    <TouchableOpacity
                      key={p.key}
                      activeOpacity={0.8}
                      onPress={() => setNewTaskPriority(p.key as any)}
                      style={[
                        styles.sheetPill,
                        isSelected && styles.sheetPillActive,
                      ]}
                    >
                      <View
                        style={[
                          styles.priorityDot,
                          { backgroundColor: p.color },
                        ]}
                      />
                      <Text
                        style={[
                          styles.sheetPillText,
                          isSelected && styles.sheetPillTextActive,
                        ]}
                      >
                        {p.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Due Date */}
            <View style={styles.sheetSection}>
              <Text style={styles.sheetLabel}>Due Date</Text>
              <View style={styles.chipsRow}>
                {['Today', 'Tomorrow', 'This Weekend', 'Next Week'].map(d => {
                  const isSelected = newTaskDate === d;
                  return (
                    <TouchableOpacity
                      key={d}
                      activeOpacity={0.8}
                      onPress={() => setNewTaskDate(d)}
                      style={[
                        styles.sheetPill,
                        isSelected && styles.sheetPillActive,
                      ]}
                    >
                      <Calendar
                        size={14}
                        color={isSelected ? '#FFFFFF' : '#6B7280'}
                        strokeWidth={2}
                      />
                      <Text
                        style={[
                          styles.sheetPillText,
                          isSelected && styles.sheetPillTextActive,
                        ]}
                      >
                        {d}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </ScrollView>

          {/* Bottom Fixed Action CTA */}
          <View style={[styles.sheetFooter, { paddingBottom: bottomInset }]}>
            <TouchableOpacity
              activeOpacity={0.88}
              style={[
                styles.createModalBtn,
                !newTaskTitle.trim() && styles.createModalBtnDisabled,
              ]}
              onPress={handleCreate}
              disabled={!newTaskTitle.trim()}
            >
              <Text style={styles.createModalBtnText}>Create Task</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  sheetContainer: {
    flex: 1,
    backgroundColor: '#FAF8F5',
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: ResponsivePixels.size20,
    paddingTop: Platform.OS === 'ios' ? 8 : 14,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#EDE8DF',
    backgroundColor: '#FFFFFF',
  },
  sheetCloseBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F3F0EA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sheetHeaderCenter: {
    alignItems: 'center',
  },
  sheetTitle: {
    fontFamily: Fonts.ranade.bold,
    fontSize: 18,
    color: '#1F2228',
  },
  sheetSubtitle: {
    fontFamily: Fonts.poppins.regular,
    fontSize: 11.5,
    color: '#7E838F',
    marginTop: 2,
  },
  sheetKeyboardAvoid: {
    flex: 1,
  },
  sheetScroll: {
    flex: 1,
  },
  sheetScrollContent: {
    paddingHorizontal: ResponsivePixels.size20,
    paddingTop: 18,
    paddingBottom: 36,
  },
  sheetSection: {
    marginBottom: 20,
  },
  sheetLabel: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: 13,
    color: '#1F2228',
    marginBottom: 8,
    letterSpacing: 0.2,
  },
  inputCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#E8E2D5',
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === 'ios' ? 14 : 10,
  },
  titleInput: {
    flex: 1,
    fontSize: 15,
    fontFamily: Fonts.poppins.medium,
    color: '#1F2228',
    padding: 0,
  },
  clearBtn: {
    padding: 4,
    marginLeft: 6,
  },
  noteInputCard: {
    minHeight: 84,
    alignItems: 'flex-start',
    paddingVertical: 12,
  },
  noteInput: {
    flex: 1,
    fontSize: 14,
    fontFamily: Fonts.poppins.regular,
    color: '#1F2228',
    minHeight: 64,
    padding: 0,
  },
  categoryCardRow: {
    flexDirection: 'row',
    gap: 10,
  },
  catSelectCard: {
    flex: 1,
    minHeight: 90,
    borderRadius: 18,
    borderWidth: 1.5,
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  catSelectCardActive: {
    borderWidth: 2,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  catIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  catSelectLabel: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: 12,
    color: '#1F2228',
  },
  catSelectedBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  sheetPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.2,
    borderColor: '#E8E2D5',
  },
  sheetPillActive: {
    backgroundColor: '#1F2228',
    borderColor: '#1F2228',
  },
  sheetPillText: {
    fontFamily: Fonts.poppins.medium,
    fontSize: 13,
    color: '#454A53',
  },
  sheetPillTextActive: {
    color: '#FFFFFF',
    fontFamily: Fonts.poppins.semiBold,
  },
  priorityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  sheetFooter: {
    paddingHorizontal: ResponsivePixels.size20,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 18 : 20,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#EDE8DF',
  },
  createModalBtn: {
    backgroundColor: '#1F2228',
    borderRadius: 50,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  createModalBtnDisabled: {
    backgroundColor: '#B5BAC2',
  },
  createModalBtnText: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: 15,
    color: '#FFFFFF',
  },
});

export default AddTaskModal;
