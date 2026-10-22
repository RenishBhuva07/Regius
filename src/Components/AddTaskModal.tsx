import React, { useState, useEffect, useRef } from 'react';
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
  Animated,
  Switch,
  TouchableWithoutFeedback,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  Check,
  X,
  Calendar,
  Clock,
  Sparkles,
  SlidersHorizontal,
  Plus,
  FileText,
  Volume2,
  ArrowRight,
  User,
} from 'lucide-react-native';
import Svg, { Path } from 'react-native-svg';
import { Fonts } from '../Theme/fonts';
import { Colors } from '../Assets/StyleUtilities/Colors';
import { SVGS } from '../Assets/Images';
import { Badge } from '../Common/Badge';
import ResponsivePixels from '../Assets/StyleUtilities/ResponsivePixels';
import { useOptionalVoiceWakeWord } from '../Context/VoiceWakeWordContext';

// ─── Inline Office Bag SVG ────────────────────────────────────────────────────

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

// ─── Categories Setup ─────────────────────────────────────────────────────────

interface CategoryItem {
  id: string;
  label: string;
  taskCount: string;
  bgColor: string;
  borderColor: string;
  accentColor: string;
  shadowColor: string;
  Icon: React.ComponentType<any>;
}

const CATEGORIES: CategoryItem[] = [
  {
    id: 'works',
    label: 'Works',
    taskCount: '+03 task',
    bgColor: '#FFFCEB',
    borderColor: '#FFF5B8',
    accentColor: '#F5C518',
    shadowColor: '#F5C518',
    Icon: OfficeBagIcon,
  },
  {
    id: 'sport',
    label: 'Sport',
    taskCount: '+10 task',
    bgColor: '#EDFDF5',
    borderColor: '#C6FFDD',
    accentColor: '#52D22E',
    shadowColor: '#52D22E',
    Icon: SVGS.FloatHeart,
  },
  {
    id: 'habits',
    label: 'Habits',
    taskCount: '+04 task',
    bgColor: '#EFF2FE',
    borderColor: '#D8DBFF',
    accentColor: '#8383D6',
    shadowColor: '#8383D6',
    Icon: SVGS.FloatPicture,
  },
];

// ─── Subtask Item Type ────────────────────────────────────────────────────────

interface SubtaskItem {
  id: string;
  text: string;
  done: boolean;
}

const INITIAL_SUBTASKS: SubtaskItem[] = [
  {
    id: '1',
    text: 'Draft initial presentation outline',
    done: false,
  },
  {
    id: '2',
    text: 'Gather analytics data from Q2',
    done: false,
  },
];

const DATE_OPTIONS = [
  'Today, Oct 15',
  'Tomorrow, Oct 16',
  'This Weekend',
  'Next Monday',
];

const TIME_OPTIONS = [
  '09:00 AM',
  '10:00 AM',
  '02:00 PM',
  '04:30 PM',
  '06:00 PM',
  '08:00 PM',
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
    time?: string;
    subtasks?: { id: string; text: string; done: boolean }[];
    voiceNudge?: boolean;
  }) => void;
}

export const AddTaskModal: React.FC<AddTaskModalProps> = ({
  visible,
  onClose,
  onCreateTask,
}) => {
  const insets = useSafeAreaInsets();
  const voiceContext = useOptionalVoiceWakeWord();
  const assistantName = voiceContext?.assistantName || 'Regius';

  // Form State
  const [taskTitle, setTaskTitle] = useState('Prepare Q3 Product Presentation');
  const [taskNote, setTaskNote] = useState(
    'Focus on narrative pacing and delightful metrics',
  );
  const [selectedCategory, setSelectedCategory] = useState<string>('works');
  const [selectedPriority, setSelectedPriority] = useState<
    'low' | 'medium' | 'high'
  >('high');
  const [selectedDate, setSelectedDate] = useState<string>('Today, Oct 15');
  const [selectedTime, setSelectedTime] = useState<string>('10:00 AM');
  const [voiceNudgeEnabled, setVoiceNudgeEnabled] = useState<boolean>(true);

  // Subtasks State
  const [subtasks, setSubtasks] = useState<SubtaskItem[]>(INITIAL_SUBTASKS);
  const [newSubtaskInput, setNewSubtaskInput] = useState<string>('');

  // Modals for quick date / time / category customize
  const [showDateModal, setShowDateModal] = useState<boolean>(false);
  const [showTimeModal, setShowTimeModal] = useState<boolean>(false);
  const [showCustomizeModal, setShowCustomizeModal] = useState<boolean>(false);

  // Animations
  const saveAnim = useRef(new Animated.Value(1)).current;
  const createAnim = useRef(new Animated.Value(1)).current;

  const resetForm = () => {
    setTaskTitle('Prepare Q3 Product Presentation');
    setTaskNote('Focus on narrative pacing and delightful metrics');
    setSelectedCategory('works');
    setSelectedPriority('high');
    setSelectedDate('Today, Oct 15');
    setSelectedTime('10:00 AM');
    setVoiceNudgeEnabled(true);
    setSubtasks(INITIAL_SUBTASKS);
    setNewSubtaskInput('');
  };

  useEffect(() => {
    if (visible) {
      resetForm();
    }
  }, [visible]);

  const handleToggleSubtask = (id: string) => {
    setSubtasks(prev =>
      prev.map(item => (item.id === id ? { ...item, done: !item.done } : item)),
    );
  };

  const handleRemoveSubtask = (id: string) => {
    setSubtasks(prev => prev.filter(item => item.id !== id));
  };

  const handleAddSubtask = () => {
    const trimmed = newSubtaskInput.trim();
    if (!trimmed) return;
    const newItem: SubtaskItem = {
      id: Date.now().toString(),
      text: trimmed,
      done: false,
    };
    setSubtasks(prev => [...prev, newItem]);
    setNewSubtaskInput('');
  };

  const handleResetSubtasks = () => {
    setSubtasks([]);
  };

  const handleSave = () => {
    if (!taskTitle.trim()) return;

    Animated.sequence([
      Animated.timing(createAnim, {
        toValue: 0.94,
        duration: 90,
        useNativeDriver: true,
      }),
      Animated.spring(createAnim, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }),
    ]).start();

    onCreateTask({
      title: taskTitle.trim(),
      note: taskNote.trim() || undefined,
      category: selectedCategory,
      iconType: selectedCategory === 'works' ? 'mail' : 'users',
      priority: selectedPriority,
      date: selectedDate,
      time: selectedTime,
      subtasks: subtasks.length > 0 ? subtasks : undefined,
      voiceNudge: voiceNudgeEnabled,
    });
  };

  const completedSubtasksCount = subtasks.filter(s => s.done).length;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={onClose}
    >
      <View style={styles.canvasContainer}>
        <StatusBar barStyle="dark-content" />

        {/* Top Notch / Safe Area Spacer */}
        <View
          style={{
            height: Math.max(
              insets.top,
              Platform.OS === 'ios' ? 48 : StatusBar.currentHeight || 12,
            ),
            backgroundColor: '#FAF8F5',
          }}
        />

        {/* ─── Top Header Bar ────────────────────────────────────────── */}
        <View style={styles.topHeader}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={onClose}
            style={styles.backBtn}
            accessibilityLabel="Go back"
          >
            <ArrowLeft
              size={20}
              color={Colors.MidnightCharcoal}
              strokeWidth={2.4}
            />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>New Task</Text>

          <View style={styles.avatarCircle}>
            <User size={18} color="#FFFFFF" strokeWidth={2.2} />
          </View>
        </View>

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={{ flex: 1 }}
        >
          <ScrollView
            style={styles.scrollArea}
            contentContainerStyle={[
              styles.scrollContent,
              { paddingBottom: Math.max(insets.bottom, 24) + 80 },
            ]}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* ─── Action Banner: New Entry / Craft Your Task / Save ─── */}
            <View style={styles.actionBanner}>
              <View style={styles.actionBannerLeft}>
                <Text style={styles.newEntryTag}>NEW ENTRY</Text>
                <Text style={styles.craftTaskHeadline}>Craft Your Task</Text>
              </View>

              <Animated.View style={{ transform: [{ scale: saveAnim }] }}>
                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={handleSave}
                  style={styles.savePillBtn}
                >
                  <Text style={styles.savePillText}>Save</Text>
                  <Check size={16} color="#FFFFFF" strokeWidth={2.6} />
                </TouchableOpacity>
              </Animated.View>
            </View>

            {/* ─── Primary Task Name & Context Card ──────────────────── */}
            <View style={styles.primaryTaskCard}>
              <View style={styles.primaryTaskCardHeader}>
                <Text style={styles.cardSectionLabel}>
                  TITLE OF YOUR ENDEAVOR
                </Text>
                <Badge
                  variant="green"
                  size="sm"
                  label="Mindful Focus"
                  icon={<Sparkles size={11} color="#1B9A72" />}
                />
              </View>

              <TextInput
                style={styles.titleInput}
                placeholder="e.g., Weekly Team Sync & Catchup..."
                placeholderTextColor="#A3A8B1"
                value={taskTitle}
                onChangeText={setTaskTitle}
                multiline={false}
                returnKeyType="next"
              />

              <View style={styles.contextRow}>
                <FileText size={16} color="#7E838F" strokeWidth={2} />
                <TextInput
                  style={styles.contextInput}
                  placeholder="Add gentle context or personal memo..."
                  placeholderTextColor="#A3A8B1"
                  value={taskNote}
                  onChangeText={setTaskNote}
                />
              </View>
            </View>

            {/* ─── Category Selector (Regius Signature Asymmetric Shape) ─ */}
            <View style={styles.sectionBlock}>
              <View style={styles.sectionHeaderRow}>
                <Text style={styles.sectionHeading}>Category</Text>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => setShowCustomizeModal(true)}
                  style={styles.customizeBtn}
                >
                  <Text style={styles.customizeText}>Customize</Text>
                  <SlidersHorizontal
                    size={13}
                    color="#7E838F"
                    strokeWidth={2}
                  />
                </TouchableOpacity>
              </View>

              <View style={styles.categoryGrid}>
                {CATEGORIES.map(cat => {
                  const isSelected = selectedCategory === cat.id;
                  const CatIcon = cat.Icon;
                  return (
                    <TouchableOpacity
                      key={cat.id}
                      activeOpacity={0.85}
                      onPress={() => setSelectedCategory(cat.id)}
                      style={[
                        styles.categoryCard,
                        {
                          backgroundColor: cat.bgColor,
                          borderColor: isSelected
                            ? Colors.MidnightCharcoal
                            : cat.borderColor,
                        },
                        isSelected && styles.categoryCardSelected,
                      ]}
                    >
                      <View style={styles.catTopRow}>
                        <View style={styles.catIconCircle}>
                          <CatIcon width={22} height={22} />
                        </View>

                        {isSelected ? (
                          <View style={styles.catCheckBadge}>
                            <Check size={12} color="#FFFFFF" strokeWidth={3} />
                          </View>
                        ) : (
                          <View style={styles.catCheckPlaceholder} />
                        )}
                      </View>

                      <View style={styles.catBottomInfo}>
                        <Text style={styles.catLabel}>{cat.label}</Text>
                        <Text style={styles.catCount}>{cat.taskCount}</Text>
                      </View>

                      {isSelected && (
                        <View
                          style={[
                            styles.catBottomAccentPill,
                            { backgroundColor: cat.accentColor },
                          ]}
                        />
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* ─── When to do it (Schedule Block) ────────────────────── */}
            <View style={styles.sectionBlock}>
              <Text style={styles.sectionHeading}>When to do it</Text>

              <View style={styles.scheduleContainerCard}>
                {/* Date Trigger */}
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => setShowDateModal(true)}
                  style={styles.scheduleTile}
                >
                  <View style={styles.scheduleIconWrap}>
                    <Calendar
                      size={18}
                      color={Colors.MidnightCharcoal}
                      strokeWidth={2}
                    />
                  </View>
                  <View style={styles.scheduleTileTextGroup}>
                    <Text style={styles.scheduleTileSmallLabel}>
                      SCHEDULE DATE
                    </Text>
                    <Text style={styles.scheduleTileValue} numberOfLines={1}>
                      {selectedDate}
                    </Text>
                  </View>
                </TouchableOpacity>

                {/* Time Trigger */}
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => setShowTimeModal(true)}
                  style={styles.scheduleTile}
                >
                  <View style={styles.scheduleIconWrap}>
                    <Clock
                      size={18}
                      color={Colors.MidnightCharcoal}
                      strokeWidth={2}
                    />
                  </View>
                  <View style={styles.scheduleTileTextGroup}>
                    <Text style={styles.scheduleTileSmallLabel}>TIME</Text>
                    <Text style={styles.scheduleTileValue} numberOfLines={1}>
                      {selectedTime}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>

            {/* ─── Priority Weight Selector ─────────────────────────── */}
            <View style={styles.sectionBlock}>
              <View style={styles.sectionHeaderRow}>
                <Text style={styles.sectionHeading}>Priority Weight</Text>
                <Text style={styles.sectionSubtext}>Balance energy load</Text>
              </View>

              <View style={styles.priorityPillContainer}>
                {(
                  [
                    { key: 'low', label: 'Low', dotColor: '#52D22E' },
                    { key: 'medium', label: 'Medium', dotColor: '#F5C518' },
                    { key: 'high', label: 'High', dotColor: '#FF5B65' },
                  ] as const
                ).map(item => {
                  const isActive = selectedPriority === item.key;
                  return (
                    <TouchableOpacity
                      key={item.key}
                      activeOpacity={0.8}
                      onPress={() => setSelectedPriority(item.key)}
                      style={[
                        styles.prioritySegment,
                        isActive && styles.prioritySegmentActive,
                      ]}
                    >
                      <View
                        style={[
                          styles.priorityDot,
                          { backgroundColor: item.dotColor },
                        ]}
                      />
                      <Text
                        style={[
                          styles.prioritySegmentText,
                          isActive && styles.prioritySegmentTextActive,
                        ]}
                      >
                        {item.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* ─── Subtasks & Checklist Builder ─────────────────────── */}
            <View style={styles.sectionBlock}>
              <View style={styles.sectionHeaderRow}>
                <View style={styles.subtasksCountRow}>
                  <Text style={styles.sectionHeading}>Subtasks</Text>
                  <View style={styles.counterChip}>
                    <Text style={styles.counterChipText}>
                      {completedSubtasksCount} / {subtasks.length}
                    </Text>
                  </View>
                </View>

                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={handleResetSubtasks}
                >
                  <Text style={styles.resetBtnText}>Reset</Text>
                </TouchableOpacity>
              </View>

              {/* Quick Add Subtask Field */}
              <View style={styles.addSubtaskCard}>
                <View style={styles.addSubtaskIconCircle}>
                  <Plus
                    size={16}
                    color={Colors.MidnightCharcoal}
                    strokeWidth={2.5}
                  />
                </View>

                <TextInput
                  style={styles.addSubtaskInput}
                  placeholder="Add subtask item & hit enter..."
                  placeholderTextColor="#A3A8B1"
                  value={newSubtaskInput}
                  onChangeText={setNewSubtaskInput}
                  onSubmitEditing={handleAddSubtask}
                  returnKeyType="done"
                />

                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={handleAddSubtask}
                  style={styles.addSubtaskBtn}
                >
                  <Text style={styles.addSubtaskBtnText}>Add</Text>
                </TouchableOpacity>
              </View>

              {/* Subtasks Item List */}
              <View style={styles.subtasksList}>
                {subtasks.map(item => (
                  <View key={item.id} style={styles.subtaskItemRow}>
                    <TouchableOpacity
                      activeOpacity={0.7}
                      onPress={() => handleToggleSubtask(item.id)}
                      style={styles.subtaskCheckboxArea}
                    >
                      <View
                        style={[
                          styles.subtaskCheckbox,
                          item.done && styles.subtaskCheckboxDone,
                        ]}
                      >
                        {item.done && (
                          <Check size={14} color="#52D22E" strokeWidth={3} />
                        )}
                      </View>

                      <Text
                        style={[
                          styles.subtaskItemText,
                          item.done && styles.subtaskItemTextDone,
                        ]}
                        numberOfLines={2}
                      >
                        {item.text}
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      activeOpacity={0.7}
                      onPress={() => handleRemoveSubtask(item.id)}
                      style={styles.removeSubtaskBtn}
                    >
                      <X size={16} color="#A3A8B1" strokeWidth={2.2} />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </View>

            {/* ─── Spoken Voice Nudge (AI Feature) ───────────────────── */}
            <View style={styles.voiceNudgeCard}>
              <View style={styles.voiceNudgeLeft}>
                <View style={styles.voiceIconBox}>
                  <Volume2 size={22} color="#21AF85" strokeWidth={2.4} />
                </View>

                <View style={styles.voiceTextGroup}>
                  <View style={styles.voiceTitleRow}>
                    <Text style={styles.voiceTitle}>Spoken Voice Nudge</Text>
                    <Badge
                      variant="purple"
                      size="sm"
                      label={`${assistantName.toUpperCase()} AI`}
                    />
                  </View>
                  <Text style={styles.voiceSubtitle}>
                    Calm audio cue when deadline approaches
                  </Text>
                </View>
              </View>

              <Switch
                value={voiceNudgeEnabled}
                onValueChange={setVoiceNudgeEnabled}
                trackColor={{ false: '#E4E2DD', true: Colors.MidnightCharcoal }}
                thumbColor="#FFFFFF"
                ios_backgroundColor="#E4E2DD"
              />
            </View>
          </ScrollView>

          {/* ─── Bottom Floating Hero CTA ──────────────────────────── */}
          <View
            style={[
              styles.bottomStickyCta,
              { paddingBottom: Math.max(insets.bottom, 16) + 6 },
            ]}
          >
            <Animated.View style={{ transform: [{ scale: createAnim }] }}>
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={handleSave}
                style={[
                  styles.createTaskHeroBtn,
                  !taskTitle.trim() && styles.createTaskHeroBtnDisabled,
                ]}
                disabled={!taskTitle.trim()}
              >
                <Text style={styles.createTaskHeroBtnText}>Create Task</Text>

                <View style={styles.createTaskHeroCircle}>
                  <ArrowRight size={18} color="#FFFFFF" strokeWidth={2.6} />
                </View>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </KeyboardAvoidingView>

        {/* ─── Quick Schedule Date Modal ───────────────────────────── */}
        <Modal
          visible={showDateModal}
          transparent
          animationType="fade"
          onRequestClose={() => setShowDateModal(false)}
        >
          <TouchableWithoutFeedback onPress={() => setShowDateModal(false)}>
            <View style={styles.modalOverlay}>
              <TouchableWithoutFeedback>
                <View style={styles.modalCard}>
                  <Text style={styles.modalHeading}>Select Schedule Date</Text>
                  {DATE_OPTIONS.map(d => (
                    <TouchableOpacity
                      key={d}
                      activeOpacity={0.7}
                      onPress={() => {
                        setSelectedDate(d);
                        setShowDateModal(false);
                      }}
                      style={[
                        styles.modalOptionRow,
                        selectedDate === d && styles.modalOptionRowActive,
                      ]}
                    >
                      <Text
                        style={[
                          styles.modalOptionText,
                          selectedDate === d && styles.modalOptionTextActive,
                        ]}
                      >
                        {d}
                      </Text>
                      {selectedDate === d && (
                        <Check
                          size={18}
                          color={Colors.MidnightCharcoal}
                          strokeWidth={2.5}
                        />
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>

        {/* ─── Quick Schedule Time Modal ───────────────────────────── */}
        <Modal
          visible={showTimeModal}
          transparent
          animationType="fade"
          onRequestClose={() => setShowTimeModal(false)}
        >
          <TouchableWithoutFeedback onPress={() => setShowTimeModal(false)}>
            <View style={styles.modalOverlay}>
              <TouchableWithoutFeedback>
                <View style={styles.modalCard}>
                  <Text style={styles.modalHeading}>Select Due Time</Text>
                  {TIME_OPTIONS.map(t => (
                    <TouchableOpacity
                      key={t}
                      activeOpacity={0.7}
                      onPress={() => {
                        setSelectedTime(t);
                        setShowTimeModal(false);
                      }}
                      style={[
                        styles.modalOptionRow,
                        selectedTime === t && styles.modalOptionRowActive,
                      ]}
                    >
                      <Text
                        style={[
                          styles.modalOptionText,
                          selectedTime === t && styles.modalOptionTextActive,
                        ]}
                      >
                        {t}
                      </Text>
                      {selectedTime === t && (
                        <Check
                          size={18}
                          color={Colors.MidnightCharcoal}
                          strokeWidth={2.5}
                        />
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>

        {/* ─── Quick Customize Category Modal ──────────────────────── */}
        <Modal
          visible={showCustomizeModal}
          transparent
          animationType="fade"
          onRequestClose={() => setShowCustomizeModal(false)}
        >
          <TouchableWithoutFeedback
            onPress={() => setShowCustomizeModal(false)}
          >
            <View style={styles.modalOverlay}>
              <TouchableWithoutFeedback>
                <View style={styles.modalCard}>
                  <Text style={styles.modalHeading}>Choose Category</Text>
                  {CATEGORIES.map(cat => (
                    <TouchableOpacity
                      key={cat.id}
                      activeOpacity={0.7}
                      onPress={() => {
                        setSelectedCategory(cat.id);
                        setShowCustomizeModal(false);
                      }}
                      style={[
                        styles.modalOptionRow,
                        selectedCategory === cat.id &&
                          styles.modalOptionRowActive,
                      ]}
                    >
                      <View style={styles.modalCategoryRowLeft}>
                        <View
                          style={[
                            styles.modalCatDot,
                            { backgroundColor: cat.accentColor },
                          ]}
                        />
                        <Text
                          style={[
                            styles.modalOptionText,
                            selectedCategory === cat.id &&
                              styles.modalOptionTextActive,
                          ]}
                        >
                          {cat.label} ({cat.taskCount})
                        </Text>
                      </View>
                      {selectedCategory === cat.id && (
                        <Check
                          size={18}
                          color={Colors.MidnightCharcoal}
                          strokeWidth={2.5}
                        />
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </View>
    </Modal>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  canvasContainer: {
    flex: 1,
    backgroundColor: '#FAF8F5', // Regius Warm Paper Canvas
  },

  // Top Header Bar
  topHeader: {
    height: 56,
    paddingHorizontal: ResponsivePixels.size20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FAF8F5',
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.2,
    borderColor: '#E8E2D5',
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 4,
      },
      android: {
        elevation: 1.5,
      },
    }),
  },
  headerTitle: {
    fontFamily: Fonts.ranade.bold,
    fontSize: 18,
    color: Colors.MidnightCharcoal,
    letterSpacing: -0.2,
  },
  avatarCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Colors.MidnightCharcoal,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.12,
        shadowRadius: 6,
      },
      android: {
        elevation: 2,
      },
    }),
  },

  // Scroll Area
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: ResponsivePixels.size20,
    paddingTop: 8,
  },

  // Action Banner: New Entry / Craft Your Task / Save
  actionBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingTop: 4,
  },
  actionBannerLeft: {
    flex: 1,
    paddingRight: 12,
  },
  newEntryTag: {
    fontFamily: Fonts.poppins.bold,
    fontSize: 11,
    letterSpacing: 1.2,
    color: '#7E838F',
    textTransform: 'uppercase',
  },
  craftTaskHeadline: {
    fontFamily: Fonts.ranade.bold,
    fontSize: 26,
    color: Colors.MidnightCharcoal,
    lineHeight: 32,
    marginTop: 2,
    letterSpacing: -0.5,
  },
  savePillBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.MidnightCharcoal,
    borderRadius: 50,
    paddingHorizontal: 18,
    paddingVertical: 9.5,
    ...Platform.select({
      ios: {
        shadowColor: Colors.MidnightCharcoal,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.22,
        shadowRadius: 8,
      },
      android: {
        elevation: 3.5,
      },
    }),
  },
  savePillText: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: 13.5,
    color: '#FFFFFF',
  },

  // Primary Task Name Card
  primaryTaskCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: '#E8E2D5',
    padding: 16,
    marginBottom: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.05,
        shadowRadius: 16,
      },
      android: {
        elevation: 2.5,
      },
    }),
  },
  primaryTaskCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  cardSectionLabel: {
    fontFamily: Fonts.poppins.bold,
    fontSize: 10.5,
    letterSpacing: 0.8,
    color: '#7E838F',
  },
  titleInput: {
    fontFamily: Fonts.ranade.bold,
    fontSize: 20,
    color: Colors.MidnightCharcoal,
    paddingVertical: 4,
    lineHeight: 26,
  },
  contextRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F3EFE6',
  },
  contextInput: {
    flex: 1,
    fontFamily: Fonts.poppins.regular,
    fontSize: 13.5,
    color: '#3F454D',
    padding: 0,
  },

  // General Section Block
  sectionBlock: {
    marginBottom: 20,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    paddingHorizontal: 2,
  },
  sectionHeading: {
    fontFamily: Fonts.poppins.bold,
    fontSize: 15.5,
    color: Colors.MidnightCharcoal,
  },
  sectionSubtext: {
    fontFamily: Fonts.poppins.regular,
    fontSize: 12,
    color: '#7E838F',
  },
  customizeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  customizeText: {
    fontFamily: Fonts.poppins.medium,
    fontSize: 12.5,
    color: '#7E838F',
  },

  // Category Cards Grid (Regius Signature Asymmetric Shape)
  categoryGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  categoryCard: {
    flex: 1,
    height: 126,
    borderRadius: 22,
    borderTopRightRadius: 46, // Regius Signature Asymmetric Curve
    borderWidth: 2,
    padding: 12,
    justifyContent: 'space-between',
    position: 'relative',
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  categoryCardSelected: {
    borderWidth: 2,
    ...Platform.select({
      ios: {
        shadowColor: Colors.MidnightCharcoal,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.16,
        shadowRadius: 10,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  catTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  catIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
      },
      android: {
        elevation: 1.5,
      },
    }),
  },
  catCheckBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.MidnightCharcoal,
    alignItems: 'center',
    justifyContent: 'center',
  },
  catCheckPlaceholder: {
    width: 20,
    height: 20,
  },
  catBottomInfo: {
    marginTop: 'auto',
  },
  catLabel: {
    fontFamily: Fonts.poppins.bold,
    fontSize: 14.5,
    color: Colors.MidnightCharcoal,
    lineHeight: 18,
  },
  catCount: {
    fontFamily: Fonts.poppins.medium,
    fontSize: 11,
    color: '#7E838F',
    marginTop: 2,
  },
  catBottomAccentPill: {
    position: 'absolute',
    bottom: 0,
    left: 20,
    right: 20,
    height: 3.5,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },

  // Schedule Block (When to do it)
  scheduleContainerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: '#E8E2D5',
    padding: 10,
    flexDirection: 'row',
    gap: 10,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.04,
        shadowRadius: 10,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  scheduleTile: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#FAF8F5',
    borderRadius: 16,
    paddingVertical: 11,
    paddingHorizontal: 12,
  },
  scheduleIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 3,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  scheduleTileTextGroup: {
    flex: 1,
  },
  scheduleTileSmallLabel: {
    fontFamily: Fonts.poppins.bold,
    fontSize: 9.5,
    color: '#7E838F',
    letterSpacing: 0.6,
  },
  scheduleTileValue: {
    fontFamily: Fonts.poppins.bold,
    fontSize: 13.5,
    color: Colors.MidnightCharcoal,
    marginTop: 1,
  },

  // Priority Pill Selector
  priorityPillContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 50,
    borderWidth: 1.5,
    borderColor: '#E8E2D5',
    padding: 4,
    flexDirection: 'row',
    gap: 4,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.04,
        shadowRadius: 8,
      },
      android: {
        elevation: 1.5,
      },
    }),
  },
  prioritySegment: {
    flex: 1,
    height: 40,
    borderRadius: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
  },
  prioritySegmentActive: {
    backgroundColor: Colors.MidnightCharcoal,
    ...Platform.select({
      ios: {
        shadowColor: Colors.MidnightCharcoal,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  priorityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  prioritySegmentText: {
    fontFamily: Fonts.poppins.medium,
    fontSize: 13,
    color: '#454A53',
  },
  prioritySegmentTextActive: {
    fontFamily: Fonts.poppins.semiBold,
    color: '#FFFFFF',
  },

  // Subtasks Block
  subtasksCountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  counterChip: {
    backgroundColor: '#EDE8DF',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  counterChipText: {
    fontFamily: Fonts.poppins.bold,
    fontSize: 11,
    color: Colors.MidnightCharcoal,
  },
  resetBtnText: {
    fontFamily: Fonts.poppins.medium,
    fontSize: 12.5,
    color: '#7E838F',
  },
  addSubtaskCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: '#E8E2D5',
    paddingHorizontal: 10,
    paddingVertical: 7,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 6,
      },
      android: {
        elevation: 1.5,
      },
    }),
  },
  addSubtaskIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FAF8F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addSubtaskInput: {
    flex: 1,
    fontFamily: Fonts.poppins.regular,
    fontSize: 13,
    color: Colors.MidnightCharcoal,
    padding: 0,
  },
  addSubtaskBtn: {
    backgroundColor: '#FAF8F5',
    borderWidth: 1,
    borderColor: '#E8E2D5',
    borderRadius: 50,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  addSubtaskBtnText: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: 12,
    color: Colors.MidnightCharcoal,
  },
  subtasksList: {
    gap: 8,
  },
  subtaskItemRow: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E8E2D5',
    paddingHorizontal: 12,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.02,
        shadowRadius: 4,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  subtaskCheckboxArea: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingRight: 8,
  },
  subtaskCheckbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    backgroundColor: '#FAF8F5',
    borderWidth: 1.5,
    borderColor: '#E8E2D5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  subtaskCheckboxDone: {
    backgroundColor: '#E8FDF0',
    borderColor: '#82E8A6',
  },
  subtaskItemText: {
    fontFamily: Fonts.poppins.medium,
    fontSize: 13.5,
    color: Colors.MidnightCharcoal,
    flex: 1,
  },
  subtaskItemTextDone: {
    color: '#A3A8B1',
  },
  removeSubtaskBtn: {
    padding: 4,
  },

  // Voice Nudge Card
  voiceNudgeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: '#E8E2D5',
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.04,
        shadowRadius: 10,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  voiceNudgeLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingRight: 10,
  },
  voiceIconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#EDFDF5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  voiceTextGroup: {
    flex: 1,
  },
  voiceTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  voiceTitle: {
    fontFamily: Fonts.poppins.bold,
    fontSize: 14,
    color: Colors.MidnightCharcoal,
  },
  voiceSubtitle: {
    fontFamily: Fonts.poppins.regular,
    fontSize: 11.5,
    color: '#7E838F',
    marginTop: 2,
  },

  // Bottom Sticky CTA Hero Button
  bottomStickyCta: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FAF8F5',
    paddingHorizontal: ResponsivePixels.size20,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F3EFE6',
  },
  createTaskHeroBtn: {
    backgroundColor: Colors.MidnightCharcoal,
    borderRadius: 50,
    height: 54,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    ...Platform.select({
      ios: {
        shadowColor: Colors.MidnightCharcoal,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.28,
        shadowRadius: 14,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  createTaskHeroBtnDisabled: {
    backgroundColor: '#B5BAC2',
  },
  createTaskHeroBtnText: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: 16,
    color: '#FFFFFF',
    letterSpacing: -0.2,
  },
  createTaskHeroCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Modal Common Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 22,
    paddingBottom: 36,
  },
  modalHeading: {
    fontFamily: Fonts.ranade.bold,
    fontSize: 18,
    color: Colors.MidnightCharcoal,
    marginBottom: 16,
  },
  modalOptionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F3EFE6',
  },
  modalOptionRowActive: {
    backgroundColor: '#FAF8F5',
    marginHorizontal: -12,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  modalOptionText: {
    fontFamily: Fonts.poppins.medium,
    fontSize: 14,
    color: '#454A53',
  },
  modalOptionTextActive: {
    fontFamily: Fonts.poppins.semiBold,
    color: Colors.MidnightCharcoal,
  },
  modalCategoryRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  modalCatDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
});

export default AddTaskModal;
