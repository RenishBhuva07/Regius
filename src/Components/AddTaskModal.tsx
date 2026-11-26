import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Platform,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Animated,
  Switch,
  Keyboard,
  Pressable,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FileText, Volume2, Sparkles, Trash2 } from 'lucide-react-native';
import Toast from 'react-native-toast-message';
import { Task, useTaskReminder } from '../Context/TaskReminderContext';
import {
  TaskRecurrence,
  toLocalISODate,
  parseLocalISODate,
  formatDisplayDate,
  normalizeTaskDateInput,
  parseTimeStringToDate,
  formatTimeFromDate,
  addDaysToISO,
} from '../Utils/taskDateUtils';

import { Fonts } from '../Theme/fonts';
import { Colors, withAlpha } from '../Assets/StyleUtilities/Colors';
import { useAppTheme } from '../Theme/useAppTheme';
import { Badge } from '../Common/Badge';
import ResponsivePixels from '../Assets/StyleUtilities/ResponsivePixels';
import { useOptionalVoiceWakeWord } from '../Context/VoiceWakeWordContext';
import FlowBadgePatternSvg from '../Screens/Dashboard/Components/FlowBadgePatternSvg';
import TaskCardAestheticBg from './TaskCardAestheticBg';
import {
  OfficeBagIcon,
  HeartEmblemIcon,
  PictureEmblemIcon,
} from '../Common/EmblemIcons';
import { UnifiedSchedulePickerModal } from '../Common/UnifiedSchedulePickerModal';
import {
  CustomCategoryModal,
  CustomCategoryCreated,
} from '../Common/CustomCategoryModal';
import {
  CategoryChipSelector,
  CategoryItem,
  ScheduleTriggerRow,
  QuickDateType,
  PrioritySelector,
  RecurrenceSelector,
  SubtaskListSection,
  SubtaskItem,
  ModalBottomBar,
} from './AddModal';

const DEFAULT_CATEGORY_ITEMS: CategoryItem[] = [
  {
    id: 'works',
    label: 'Works',
    bgColor: Colors.WorkLightBg,
    borderColor: Colors.WorkLightBorder,
    shadowColor: Colors.PureBlack,
    accentColor: Colors.TaskGoldVivid,
    checkColor: Colors.HabitBurnishedAmber,
    badgeVariant: 'yellow',
    Icon: OfficeBagIcon,
  },
  {
    id: 'sport',
    label: 'Sport',
    bgColor: Colors.WellnessLightBg,
    borderColor: Colors.WellnessLightBorder,
    shadowColor: Colors.PureBlack,
    accentColor: Colors.AccentGreen,
    checkColor: Colors.GreenGracious,
    badgeVariant: 'green',
    Icon: HeartEmblemIcon,
  },
  {
    id: 'habits',
    label: 'Habits',
    bgColor: Colors.MindfulLightBg,
    borderColor: Colors.MindfulLightBorder,
    shadowColor: Colors.PureBlack,
    accentColor: Colors.LavenderPurple,
    checkColor: Colors.MindfulTextAccent,
    badgeVariant: 'purple',
    Icon: PictureEmblemIcon,
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
    dueDate?: string | null;
    time?: string;
    dueTime?: string | null;
    recurrence?: TaskRecurrence;
    subtasks?: { id: string; text: string; done: boolean }[];
    voiceNudge?: boolean;
  }) => void;
  onUpdateTask?: (
    id: string,
    data: {
      title: string;
      note?: string;
      category: string;
      iconType: 'mail' | 'users';
      priority: 'low' | 'medium' | 'high';
      date: string;
      dueDate?: string | null;
      time?: string;
      dueTime?: string | null;
      recurrence?: TaskRecurrence;
      subtasks?: { id: string; text: string; done: boolean }[];
      voiceNudge?: boolean;
    },
  ) => void;
  onDeleteTask?: (id: string) => void;
  taskToEdit?: Task | null;
  prefillDate?: string | null;
  prefillCategory?: string;
}

export const AddTaskModal: React.FC<AddTaskModalProps> = ({
  visible,
  onClose,
  onCreateTask,
  onUpdateTask,
  onDeleteTask,
  taskToEdit,
  prefillDate,
  prefillCategory,
}) => {
  const insets = useSafeAreaInsets();
  const { isDarkMode, bgMain, cardBg } = useAppTheme();
  const { taskCategories, addTaskCategory } = useTaskReminder();
  const voiceContext = useOptionalVoiceWakeWord();
  const assistantName = voiceContext?.assistantName || 'Regius';
  const isEditing = !!taskToEdit;

  // Form State
  const [taskTitle, setTaskTitle] = useState('');
  const [taskNote, setTaskNote] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('works');
  const [selectedPriority, setSelectedPriority] = useState<
    'low' | 'medium' | 'high'
  >('high');
  const [selectedDueDate, setSelectedDueDate] = useState<string | null>(() =>
    toLocalISODate(),
  );
  const [selectedDate, setSelectedDate] = useState<string>(() =>
    formatDisplayDate(toLocalISODate()),
  );
  const [selectedTime, setSelectedTime] = useState<string>('10:00 AM');
  const [isTimeAnytime, setIsTimeAnytime] = useState<boolean>(false);
  const [selectedRecurrence, setSelectedRecurrence] =
    useState<TaskRecurrence>('none');
  const [voiceNudgeEnabled, setVoiceNudgeEnabled] = useState<boolean>(true);
  const [titleInputHeight, setTitleInputHeight] = useState<number>(48);

  // Subtasks State
  const [subtasks, setSubtasks] = useState<SubtaskItem[]>([]);
  const [newSubtaskInput, setNewSubtaskInput] = useState<string>('');

  // Native Date & Time Picker State
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [showTimePicker, setShowTimePicker] = useState<boolean>(false);
  const [dateValue, setDateValue] = useState<Date>(new Date());
  const [timeValue, setTimeValue] = useState<Date>(() =>
    parseTimeStringToDate('10:00 AM'),
  );

  // Dynamic Category State (backed by TaskReminderContext)
  const categoryList: CategoryItem[] =
    taskCategories.length > 0 ? taskCategories : DEFAULT_CATEGORY_ITEMS;
  const [showAddCategoryModal, setShowAddCategoryModal] =
    useState<boolean>(false);

  // Scroll Reactive Header State
  const scrollY = useRef(new Animated.Value(0)).current;
  const [isScrolled, setIsScrolled] = useState<boolean>(false);

  // Animations
  const createAnim = useRef(new Animated.Value(1)).current;
  const noteInputRef = useRef<React.ComponentRef<typeof TextInput>>(null);

  const resetForm = useCallback(() => {
    const today = new Date();
    const initialISO =
      prefillDate !== undefined ? prefillDate : toLocalISODate(today);
    const initialDateObj =
      (initialISO ? parseLocalISODate(initialISO) : null) || today;
    const formattedDefaultDate = initialISO
      ? formatDisplayDate(initialISO)
      : 'Anytime';

    setTaskTitle('');
    setTaskNote('');
    setSelectedCategory(prefillCategory || 'works');
    setSelectedPriority('high');
    setSelectedDueDate(initialISO);
    setSelectedDate(formattedDefaultDate);
    setSelectedTime('10:00 AM');
    setIsTimeAnytime(initialISO === null);
    setSelectedRecurrence('none');
    setDateValue(initialDateObj);
    setTimeValue(parseTimeStringToDate('10:00 AM', initialDateObj));
    setVoiceNudgeEnabled(true);
    setSubtasks([]);
    setNewSubtaskInput('');
    setTitleInputHeight(48);
    scrollY.setValue(0);
    setIsScrolled(false);
  }, [scrollY, prefillDate, prefillCategory]);

  const handleTitleContentSizeChange = (e: {
    nativeEvent: { contentSize: { height: number; width: number } };
  }) => {
    const nextHeight = Math.ceil(e.nativeEvent.contentSize.height);
    if (nextHeight > 0 && Math.abs(nextHeight - titleInputHeight) >= 2) {
      setTitleInputHeight(nextHeight);
    }
  };

  const handleSelectQuickDate = (type: QuickDateType) => {
    if (type === 'anytime') {
      setSelectedDueDate(null);
      setSelectedDate('Anytime');
      return;
    }

    const today = new Date();
    const todayISO = toLocalISODate(today);
    let targetISO = todayISO;

    if (type === 'tomorrow') {
      targetISO = addDaysToISO(todayISO, 1);
    } else if (type === 'weekend') {
      const dayOfWeek = today.getDay();
      const daysUntilSaturday = dayOfWeek === 6 ? 7 : 6 - dayOfWeek;
      targetISO = addDaysToISO(todayISO, daysUntilSaturday);
    } else if (type === 'next_week') {
      const dayOfWeek = today.getDay();
      const daysUntilMonday = dayOfWeek === 0 ? 1 : 8 - dayOfWeek;
      targetISO = addDaysToISO(todayISO, daysUntilMonday);
    }

    const targetDateObj = parseLocalISODate(targetISO) || today;
    setSelectedDueDate(targetISO);
    setSelectedDate(formatDisplayDate(targetISO, todayISO));
    setDateValue(targetDateObj);
  };

  useEffect(() => {
    if (visible) {
      if (taskToEdit) {
        const today = new Date();
        const resolved =
          taskToEdit.dueDate !== undefined
            ? {
                dueDate: taskToEdit.dueDate,
                displayDate: taskToEdit.dueDate
                  ? formatDisplayDate(taskToEdit.dueDate)
                  : 'Anytime',
              }
            : normalizeTaskDateInput(taskToEdit.date, today);
        const hydratedDateObj =
          (resolved.dueDate ? parseLocalISODate(resolved.dueDate) : null) ||
          today;
        const hasSpecificTime = Boolean(
          taskToEdit.dueTime !== undefined
            ? taskToEdit.dueTime
            : taskToEdit.time &&
              taskToEdit.time.toLowerCase() !== 'anytime',
        );
        const editTime = hasSpecificTime
          ? taskToEdit.dueTime ?? taskToEdit.time ?? '10:00 AM'
          : '10:00 AM';

        setTaskTitle(taskToEdit.label);
        setTaskNote(taskToEdit.note || '');
        setSelectedCategory(taskToEdit.category || 'works');
        setSelectedPriority(taskToEdit.priority || 'medium');
        setSelectedDueDate(resolved.dueDate);
        setSelectedDate(resolved.displayDate);
        setSelectedTime(editTime);
        setIsTimeAnytime(!hasSpecificTime);
        setSelectedRecurrence(taskToEdit.recurrence || 'none');
        setDateValue(hydratedDateObj);
        setTimeValue(parseTimeStringToDate(editTime, hydratedDateObj));
        setVoiceNudgeEnabled(taskToEdit.voiceNudge ?? true);
        setSubtasks(
          taskToEdit.subtasks ? taskToEdit.subtasks.map(s => ({ ...s })) : [],
        );
        setNewSubtaskInput('');
        scrollY.setValue(0);
        setIsScrolled(false);
      } else {
        resetForm();
      }
    }
  }, [visible, taskToEdit, resetForm, scrollY]);

  // Subtask Handlers
  const handleRemoveSubtask = (id: string) => {
    setSubtasks(prev => prev.filter(item => item.id !== id));
  };

  const handleAddSubtask = () => {
    const trimmed = newSubtaskInput.trim();
    if (!trimmed) {
      Toast.show({
        type: 'error',
        text1: 'Subtask Required',
        text2: 'Please enter a subtask before adding.',
      });
      return;
    }
    const newItem: SubtaskItem = {
      id: Date.now().toString(),
      text: trimmed,
      done: false,
    };
    setSubtasks(prev => [...prev, newItem]);
    setNewSubtaskInput('');
  };

  // Date Picker Handler
  const onDateChange = (_event: any, selected?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    if (selected) {
      const iso = toLocalISODate(selected);
      setDateValue(selected);
      setSelectedDueDate(iso);
      setSelectedDate(formatDisplayDate(iso));
    }
  };

  // Time Picker Handler
  const onTimeChange = (_event: any, selected?: Date) => {
    if (Platform.OS === 'android') {
      setShowTimePicker(false);
    }
    if (selected) {
      setTimeValue(selected);
      setSelectedTime(formatTimeFromDate(selected));
      setIsTimeAnytime(false);
    }
  };

  const handleSave = () => {
    if (!taskTitle.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Task Title Required',
        text2: 'Please enter a title for your task before saving.',
      });
      return;
    }

    Animated.sequence([
      Animated.timing(createAnim, {
        toValue: 0.94,
        duration: 90,
        useNativeDriver: true,
      }),
      Animated.spring(createAnim, {
        toValue: 1,
        friction: 4,
        tension: 180,
        useNativeDriver: true,
      }),
    ]).start();

    const taskPayload = {
      title: taskTitle.replace(/[\r\n]+/g, ' ').trim(),
      note: taskNote.trim() || undefined,
      category: selectedCategory,
      iconType: (selectedCategory === 'works' ? 'mail' : 'users') as
        | 'mail'
        | 'users',
      priority: selectedPriority,
      date: selectedDate,
      dueDate: selectedDueDate,
      time: isTimeAnytime ? undefined : selectedTime,
      dueTime: isTimeAnytime ? null : selectedTime,
      recurrence: selectedRecurrence,
      subtasks:
        subtasks.length > 0
          ? subtasks.map(s => ({ id: s.id, text: s.text, done: !!s.done }))
          : undefined,
      voiceNudge: voiceNudgeEnabled,
    };

    if (isEditing && onUpdateTask && taskToEdit) {
      onUpdateTask(taskToEdit.id, taskPayload);
      onClose();
    } else {
      onCreateTask(taskPayload);
    }
  };

  const handleDelete = () => {
    if (!taskToEdit || !onDeleteTask) return;

    Alert.alert(
      'Delete Task',
      `Are you sure you want to delete "${taskToEdit.label}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            onDeleteTask(taskToEdit.id);
            Toast.show({
              type: 'info',
              text1: 'Task Deleted',
              text2: 'Task removed from your objectives.',
            });
            onClose();
          },
        },
      ],
    );
  };

  const handleCreateCategory = (newCat: CustomCategoryCreated) => {
    const saved = addTaskCategory(newCat);
    setSelectedCategory(saved.id);
  };

  const activeCategory =
    categoryList.find(c => c.id === selectedCategory) || categoryList[0];

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={onClose}
    >
      <View
        style={[
          styles.canvasContainer,
          isDarkMode && { backgroundColor: bgMain },
        ]}
      >
        <StatusBar
          barStyle={isDarkMode ? 'light-content' : 'dark-content'}
          {...(Platform.OS === 'android'
            ? {
                backgroundColor: isDarkMode ? bgMain : Colors.CreamSurfaceAlt,
                translucent: true,
              }
            : {})}
        />

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.keyboardWrap}
        >
          <Animated.ScrollView
            style={styles.scrollArea}
            contentContainerStyle={[
              styles.scrollContent,
              {
                paddingTop: insets.top + ResponsivePixels.size10,
                paddingBottom:
                  Math.max(insets.bottom, ResponsivePixels.size24) +
                  ResponsivePixels.size96,
              },
            ]}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
            nestedScrollEnabled
            onScrollBeginDrag={Keyboard.dismiss}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { y: scrollY } } }],
              {
                useNativeDriver: false,
                listener: (e: any) => {
                  const offsetY = e.nativeEvent.contentOffset.y;
                  if (offsetY > 15 && !isScrolled) {
                    setIsScrolled(true);
                  } else if (offsetY <= 15 && isScrolled) {
                    setIsScrolled(false);
                  }
                },
              },
            )}
            scrollEventThrottle={16}
          >
            {/* Primary Task Flow Card with 2-Layer Wrapper Pattern */}
            <View
              style={[
                styles.primaryTaskCardWrapper,
                isDarkMode && { backgroundColor: cardBg },
                { shadowColor: activeCategory.shadowColor },
              ]}
            >
              {/* Crest badge */}
              <View style={styles.flowHeaderBadge}>
                <FlowBadgePatternSvg />
                <Text style={styles.flowTitle}>
                  {isEditing ? 'Edit Your Task' : 'Craft Your Task'}
                </Text>
                <Text style={styles.flowSubtitle}>
                  {isEditing
                    ? 'Refine Objectives & Parameters'
                    : 'Daily Objectives & Focus'}
                </Text>
              </View>

              <View
                style={[
                  styles.primaryTaskCard,
                  isDarkMode && { backgroundColor: cardBg },
                  {
                    borderColor: activeCategory.borderColor,
                  },
                ]}
              >
                <TaskCardAestheticBg category={selectedCategory} />

                <View style={styles.primaryTaskCardHeader}>
                  <Text style={styles.cardSectionLabel}>
                    TITLE OF YOUR ENDEAVOR
                  </Text>
                </View>
                <TextInput
                  style={[
                    styles.titleInput,
                    isDarkMode && { color: Colors.PureWhite },
                    titleInputHeight > ResponsivePixels.size48
                      ? { height: titleInputHeight }
                      : null,
                  ]}
                  placeholder="e.g., Weekly Team Sync & Catchup..."
                  placeholderTextColor={Colors.SteelMist}
                  value={taskTitle}
                  onChangeText={setTaskTitle}
                  onContentSizeChange={handleTitleContentSizeChange}
                  multiline={true}
                  scrollEnabled={true}
                  rejectResponderTermination={true}
                  autoFocus={!isEditing}
                  cursorColor={
                    isDarkMode ? Colors.PureWhite : Colors.MidnightCharcoal
                  }
                  selectionColor={
                    isDarkMode
                      ? withAlpha(Colors.PureWhite, 0.25)
                      : withAlpha(Colors.MidnightCharcoal, 0.25)
                  }
                />

                {/* Memo input */}
                <Pressable
                  style={[
                    styles.contextRow,
                    isDarkMode && { borderColor: Colors.CarbonSlate },
                  ]}
                  onPress={() => noteInputRef.current?.focus()}
                  accessible={false}
                >
                  <View style={styles.contextIconWrap}>
                    <FileText
                      size={ResponsivePixels.size16}
                      color={
                        isDarkMode ? Colors.SteelMist : Colors.MutedSlateSubtext
                      }
                      strokeWidth={2}
                    />
                  </View>
                  <TextInput
                    ref={noteInputRef}
                    style={[
                      styles.contextInput,
                      isDarkMode && { color: Colors.PureWhite },
                    ]}
                    placeholder="Add gentle context or personal memo..."
                    placeholderTextColor={Colors.SteelMist}
                    value={taskNote}
                    onChangeText={setTaskNote}
                    returnKeyType="done"
                    blurOnSubmit={true}
                    cursorColor={
                      isDarkMode ? Colors.PureWhite : Colors.MidnightCharcoal
                    }
                    selectionColor={
                      isDarkMode
                        ? withAlpha(Colors.PureWhite, 0.25)
                        : withAlpha(Colors.MidnightCharcoal, 0.25)
                    }
                  />
                </Pressable>

                {/* Integrated Subtasks Section */}
                <SubtaskListSection
                  subtasks={subtasks}
                  input={newSubtaskInput}
                  onChangeInput={setNewSubtaskInput}
                  onAdd={handleAddSubtask}
                  onRemove={handleRemoveSubtask}
                  heading="Subtasks"
                  subheading=""
                />
              </View>
            </View>

            {/* Category Selector */}
            <CategoryChipSelector
              categories={categoryList}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              onPressAddCategory={() => setShowAddCategoryModal(true)}
            />

            {/* Schedule Section */}
            <ScheduleTriggerRow
              selectedDate={selectedDate}
              selectedTime={selectedTime}
              selectedDueDate={selectedDueDate}
              isTimeAnytime={isTimeAnytime}
              showExtendedPresets={true}
              onSelectQuickDate={handleSelectQuickDate}
              onPressDate={() => setShowDatePicker(true)}
              onPressTime={() => setShowTimePicker(true)}
              onClearTime={() => setIsTimeAnytime(true)}
            />

            {/* Repeat Cadence */}
            <RecurrenceSelector
              selectedRecurrence={selectedRecurrence}
              onSelectRecurrence={setSelectedRecurrence}
            />

            {/* Priority Weight */}
            <PrioritySelector
              selectedPriority={selectedPriority}
              onSelectPriority={setSelectedPriority}
            />

            {/* Spoken Voice Nudge */}
            <View
              style={[
                styles.voiceNudgeCard,
                isDarkMode && {
                  backgroundColor: Colors.DarkCardBackground,
                  borderColor: Colors.CarbonSlate,
                },
              ]}
            >
              <View style={styles.voiceNudgeLeft}>
                <View
                  style={[
                    styles.voiceIconBox,
                    isDarkMode && {
                      backgroundColor: Colors.WellnessDarkIconBg,
                      borderColor: Colors.GreenGracious,
                    },
                  ]}
                >
                  <Volume2
                    size={ResponsivePixels.size20}
                    color={Colors.GreenGracious}
                    strokeWidth={2.4}
                  />
                </View>

                <View style={styles.voiceTextGroup}>
                  <View style={styles.voiceTitleRow}>
                    <Text
                      style={[
                        styles.voiceTitle,
                        isDarkMode && { color: Colors.PureWhite },
                      ]}
                      numberOfLines={1}
                    >
                      Voice Nudge
                    </Text>
                    <Badge
                      variant="purple"
                      size="sm"
                      label={`${assistantName.toUpperCase()} AI`}
                      icon={<Sparkles size={ResponsivePixels.size9} color={Colors.MindfulTextAccent} />}
                    />
                  </View>
                  <Text style={styles.voiceSubtitle} numberOfLines={1}>
                    Audio cue when deadline approaches
                  </Text>
                </View>
              </View>

              <Switch
                value={voiceNudgeEnabled}
                onValueChange={setVoiceNudgeEnabled}
                trackColor={{
                  false: isDarkMode ? Colors.CarbonSlate : Colors.WarmSwitchTrackOff,
                  true: isDarkMode ? Colors.AccentYellow : Colors.MidnightCharcoal,
                }}
                thumbColor={Colors.PureWhite}
                ios_backgroundColor={
                  isDarkMode ? Colors.CarbonSlate : Colors.WarmSwitchTrackOff
                }
              />
            </View>

            {/* Delete Task Action (Only when editing) */}
            {isEditing && onDeleteTask && (
              <View style={styles.deleteSection}>
                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={handleDelete}
                  style={[
                    styles.deleteCardBtn,
                    isDarkMode && {
                      backgroundColor: Colors.DarkCardBackground,
                      borderColor: Colors.UrgentDarkBorder,
                    },
                  ]}
                  accessibilityRole="button"
                  accessibilityLabel="Delete Task"
                >
                  <Trash2
                    size={ResponsivePixels.size16}
                    color={Colors.CategoryRedAccent}
                    strokeWidth={2.2}
                  />
                  <Text style={styles.deleteCardBtnText}>Delete Task</Text>
                </TouchableOpacity>
              </View>
            )}
          </Animated.ScrollView>

          {/* Common theme-styled bottom dock */}
          <ModalBottomBar
            onClose={onClose}
            onSubmit={handleSave}
            submitText={isEditing ? 'Save Changes' : 'Create Task'}
            createAnim={createAnim}
          />
        </KeyboardAvoidingView>

        {/* Unified Date Picker Modal */}
        <UnifiedSchedulePickerModal
          visible={showDatePicker}
          mode="date"
          value={dateValue}
          minimumDate={isEditing ? undefined : new Date()}
          allowAnytime={true}
          isAnytime={selectedDueDate === null}
          onSelectAnytime={() => handleSelectQuickDate('anytime')}
          onChange={onDateChange}
          onClose={() => setShowDatePicker(false)}
        />

        {/* Unified Time Picker Modal */}
        <UnifiedSchedulePickerModal
          visible={showTimePicker}
          mode="time"
          value={timeValue}
          allowAnytime={true}
          isAnytime={isTimeAnytime}
          onSelectAnytime={() => setIsTimeAnytime(true)}
          onChange={onTimeChange}
          onClose={() => setShowTimePicker(false)}
        />

        {/* Custom Category Creation Modal */}
        <CustomCategoryModal
          visible={showAddCategoryModal}
          onClose={() => setShowAddCategoryModal(false)}
          onCreateCategory={handleCreateCategory}
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  canvasContainer: {
    flex: 1,
    backgroundColor: Colors.CreamSurfaceAlt,
  },
  keyboardWrap: {
    flex: 1,
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: ResponsivePixels.size20,
  },
  flowHeaderBadge: {
    position: 'absolute',
    top: -ResponsivePixels.size24,
    alignSelf: 'center',
    backgroundColor: Colors.NeroBlack,
    paddingHorizontal: ResponsivePixels.size22,
    paddingVertical: ResponsivePixels.size7,
    borderRadius: ResponsivePixels.size22,
    borderWidth: 1.5,
    borderTopColor: Colors.DarkBevelTop,
    borderLeftColor: Colors.DarkBorder,
    borderRightColor: Colors.DarkBorder,
    borderBottomWidth: 4,
    borderBottomColor: Colors.DarkBevelAbyss,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.DarkShadowAnchor,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.32,
    shadowRadius: 8,
    elevation: 6,
    zIndex: 30,
    overflow: 'hidden',
  },
  flowTitle: {
    fontFamily: Fonts.poppins.bold,
    fontSize: ResponsivePixels.size18,
    color: Colors.PureWhite,
    letterSpacing: -0.1,
    textAlign: 'center',
  },
  flowSubtitle: {
    fontFamily: Fonts.poppins.medium,
    fontSize: ResponsivePixels.size10_5,
    color: Colors.CoolSilverSubtitle,
    marginTop: ResponsivePixels.size1,
    letterSpacing: 0.2,
    textAlign: 'center',
  },
  primaryTaskCardWrapper: {
    borderRadius: ResponsivePixels.size22,
    backgroundColor: Colors.PureWhite,
    marginTop: ResponsivePixels.size26,
    marginBottom: ResponsivePixels.size22,
    position: 'relative',
    zIndex: 10,
    ...Platform.select({
      ios: {
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.22,
        shadowRadius: 16,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  primaryTaskCard: {
    backgroundColor: Colors.PureWhite,
    borderRadius: ResponsivePixels.size22,
    borderWidth: 1.5,
    paddingHorizontal: ResponsivePixels.size16,
    paddingBottom: ResponsivePixels.size16,
    paddingTop: ResponsivePixels.size36,
    position: 'relative',
    overflow: 'hidden',
  },
  primaryTaskCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: ResponsivePixels.size10,
    marginBottom: ResponsivePixels.size6,
  },
  cardSectionLabel: {
    fontFamily: Fonts.poppins.bold,
    fontSize: ResponsivePixels.size10_5,
    letterSpacing: 0.8,
    color: Colors.MutedSlateSubtext,
  },
  titleInput: {
    fontFamily: Fonts.poppins.bold,
    fontSize: ResponsivePixels.size18,
    lineHeight: ResponsivePixels.size26,
    color: Colors.MidnightCharcoal,
    paddingTop:
      Platform.OS === 'ios' ? ResponsivePixels.size8 : ResponsivePixels.size4,
    paddingBottom:
      Platform.OS === 'ios' ? ResponsivePixels.size8 : ResponsivePixels.size4,
    paddingHorizontal: 0,
    minHeight: ResponsivePixels.size48,
    textAlignVertical: 'top',
    includeFontPadding: false,
  },
  contextRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ResponsivePixels.size10,
    marginTop: ResponsivePixels.size10,
    height: ResponsivePixels.size48,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: withAlpha(Colors.PureBlack, 0.06),
    paddingHorizontal: 0,
  },
  contextIconWrap: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  contextInput: {
    flex: 1,
    fontFamily: Fonts.poppins.regular,
    fontSize: ResponsivePixels.size13_5,
    color: Colors.SlateGraphiteText,
    paddingVertical: 0,
    paddingHorizontal: 0,
    margin: 0,
    textAlignVertical: 'center',
    includeFontPadding: false,
  },
  voiceNudgeCard: {
    backgroundColor: Colors.PureWhite,
    borderRadius: ResponsivePixels.size20,
    borderWidth: 1.5,
    borderColor: Colors.RingBorder,
    padding: ResponsivePixels.size14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: ResponsivePixels.size24,
    ...Platform.select({
      ios: {
        shadowColor: Colors.PureBlack,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 10,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  voiceNudgeLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: ResponsivePixels.size12,
    marginRight: ResponsivePixels.size14,
  },
  voiceIconBox: {
    width: ResponsivePixels.size44,
    height: ResponsivePixels.size44,
    borderRadius: ResponsivePixels.size14,
    backgroundColor: Colors.WellnessLightBg,
    borderWidth: 1.5,
    borderColor: Colors.WellnessLightBorder,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: Colors.PureBlack,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  voiceTextGroup: {
    flex: 1,
  },
  voiceTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ResponsivePixels.size8,
  },
  voiceTitle: {
    fontFamily: Fonts.poppins.bold,
    fontSize: ResponsivePixels.size14,
    color: Colors.MidnightCharcoal,
  },
  voiceSubtitle: {
    fontFamily: Fonts.poppins.regular,
    fontSize: ResponsivePixels.size11_5,
    color: Colors.MutedSlateSubtext,
    marginTop: ResponsivePixels.size2,
  },
  deleteSection: {
    marginTop: ResponsivePixels.size18,
    marginBottom: ResponsivePixels.size10,
  },
  deleteCardBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: ResponsivePixels.size8,
    backgroundColor: Colors.PureWhite,
    borderWidth: 1.5,
    borderColor: Colors.CategoryRoseBorder,
    paddingVertical: ResponsivePixels.size13,
    borderRadius: ResponsivePixels.size18,
    ...Platform.select({
      ios: {
        shadowColor: Colors.PureBlack,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 6,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  deleteCardBtnText: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: ResponsivePixels.size13,
    color: Colors.CategoryRedAccent,
  },
});

export default AddTaskModal;
