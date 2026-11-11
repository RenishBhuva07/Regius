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
import { Task } from '../Context/TaskReminderContext';

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
  PrioritySelector,
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
    shadowColor: Colors.AccentYellow,
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
    shadowColor: Colors.AccentGreen,
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
    shadowColor: Colors.LavenderPurple,
    accentColor: Colors.LavenderPurple,
    checkColor: Colors.MindfulTextAccent,
    badgeVariant: 'purple',
    Icon: PictureEmblemIcon,
  },
];

const MONTH_SHORT = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

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
  onUpdateTask?: (
    id: string,
    data: {
      title: string;
      note?: string;
      category: string;
      iconType: 'mail' | 'users';
      priority: 'low' | 'medium' | 'high';
      date: string;
      time?: string;
      subtasks?: { id: string; text: string; done: boolean }[];
      voiceNudge?: boolean;
    },
  ) => void;
  onDeleteTask?: (id: string) => void;
  taskToEdit?: Task | null;
}

export const AddTaskModal: React.FC<AddTaskModalProps> = ({
  visible,
  onClose,
  onCreateTask,
  onUpdateTask,
  onDeleteTask,
  taskToEdit,
}) => {
  const insets = useSafeAreaInsets();
  const { isDarkMode, bgMain, cardBg } = useAppTheme();
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
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const today = new Date();
    return `Today, ${MONTH_SHORT[today.getMonth()]} ${today.getDate()}`;
  });
  const [selectedTime, setSelectedTime] = useState<string>('10:00 AM');
  const [voiceNudgeEnabled, setVoiceNudgeEnabled] = useState<boolean>(true);
  const [titleInputHeight, setTitleInputHeight] = useState<number>(48);

  // Subtasks State
  const [subtasks, setSubtasks] = useState<SubtaskItem[]>([]);
  const [newSubtaskInput, setNewSubtaskInput] = useState<string>('');

  // Native Date & Time Picker State
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [showTimePicker, setShowTimePicker] = useState<boolean>(false);
  const [dateValue, setDateValue] = useState<Date>(new Date());
  const [timeValue, setTimeValue] = useState<Date>(new Date());

  // Dynamic Category State
  const [categoryList, setCategoryList] = useState<CategoryItem[]>(
    DEFAULT_CATEGORY_ITEMS,
  );
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
    const formattedDefaultDate = `Today, ${
      MONTH_SHORT[today.getMonth()]
    } ${today.getDate()}`;
    setTaskTitle('');
    setTaskNote('');
    setSelectedCategory('works');
    setSelectedPriority('high');
    setSelectedDate(formattedDefaultDate);
    setSelectedTime('10:00 AM');
    setDateValue(today);
    setTimeValue(today);
    setVoiceNudgeEnabled(true);
    setSubtasks([]);
    setNewSubtaskInput('');
    setTitleInputHeight(48);
    scrollY.setValue(0);
    setIsScrolled(false);
  }, [scrollY]);

  const handleTitleContentSizeChange = (e: {
    nativeEvent: { contentSize: { height: number; width: number } };
  }) => {
    const nextHeight = Math.ceil(e.nativeEvent.contentSize.height);
    if (nextHeight > 0 && Math.abs(nextHeight - titleInputHeight) >= 2) {
      setTitleInputHeight(nextHeight);
    }
  };

  const handleSelectQuickDate = (type: 'today' | 'tomorrow' | 'weekend') => {
    const today = new Date();
    let target = new Date();

    if (type === 'today') {
      target = today;
      setSelectedDate(
        `Today, ${MONTH_SHORT[today.getMonth()]} ${today.getDate()}`,
      );
    } else if (type === 'tomorrow') {
      target.setDate(today.getDate() + 1);
      setSelectedDate(
        `Tomorrow, ${MONTH_SHORT[target.getMonth()]} ${target.getDate()}`,
      );
    } else if (type === 'weekend') {
      const dayOfWeek = today.getDay();
      const daysUntilSaturday = dayOfWeek === 6 ? 7 : 6 - dayOfWeek;
      target.setDate(today.getDate() + daysUntilSaturday);
      setSelectedDate(
        `Sat, ${MONTH_SHORT[target.getMonth()]} ${target.getDate()}`,
      );
    }
    setDateValue(target);
  };

  useEffect(() => {
    if (visible) {
      if (taskToEdit) {
        setTaskTitle(taskToEdit.label);
        setTaskNote(taskToEdit.note || '');
        setSelectedCategory(taskToEdit.category || 'works');
        setSelectedPriority(taskToEdit.priority || 'medium');
        setSelectedDate(
          taskToEdit.date ||
            `Today, ${
              MONTH_SHORT[new Date().getMonth()]
            } ${new Date().getDate()}`,
        );
        setSelectedTime(taskToEdit.time || '10:00 AM');
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
      setDateValue(selected);
      const today = new Date();
      const isToday =
        today.getFullYear() === selected.getFullYear() &&
        today.getMonth() === selected.getMonth() &&
        today.getDate() === selected.getDate();

      const tomorrow = new Date();
      tomorrow.setDate(today.getDate() + 1);
      const isTomorrow =
        tomorrow.getFullYear() === selected.getFullYear() &&
        tomorrow.getMonth() === selected.getMonth() &&
        tomorrow.getDate() === selected.getDate();

      const monthShort = MONTH_SHORT[selected.getMonth()];
      const dayNum = selected.getDate();
      const dayOfWeek = DAY_NAMES[selected.getDay()];

      if (isToday) {
        setSelectedDate(`Today, ${monthShort} ${dayNum}`);
      } else if (isTomorrow) {
        setSelectedDate(`Tomorrow, ${monthShort} ${dayNum}`);
      } else {
        setSelectedDate(`${dayOfWeek}, ${monthShort} ${dayNum}`);
      }
    }
  };

  // Time Picker Handler
  const onTimeChange = (_event: any, selected?: Date) => {
    if (Platform.OS === 'android') {
      setShowTimePicker(false);
    }
    if (selected) {
      setTimeValue(selected);
      let hours = selected.getHours();
      const minutes = selected.getMinutes();
      const meridiem = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12 || 12;
      const hourStr = hours.toString().padStart(2, '0');
      const minStr = minutes.toString().padStart(2, '0');
      setSelectedTime(`${hourStr}:${minStr} ${meridiem}`);
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
      time: selectedTime,
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
    setCategoryList(prev => [...prev, newCat]);
    setSelectedCategory(newCat.id);
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
                paddingTop: insets.top + 10,
                paddingBottom: Math.max(insets.bottom, 24) + 96,
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
                    titleInputHeight > 48 ? { height: titleInputHeight } : null,
                  ]}
                  placeholder="e.g., Weekly Team Sync & Catchup..."
                  placeholderTextColor={Colors.SteelMist}
                  value={taskTitle}
                  onChangeText={setTaskTitle}
                  onContentSizeChange={handleTitleContentSizeChange}
                  multiline={true}
                  scrollEnabled={true}
                  rejectResponderTermination={true}
                  autoFocus={true}
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
                      size={16}
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
              onSelectQuickDate={handleSelectQuickDate}
              onPressDate={() => setShowDatePicker(true)}
              onPressTime={() => setShowTimePicker(true)}
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
                    size={20}
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
                      icon={<Sparkles size={9} color={Colors.MindfulTextAccent} />}
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
                    size={16}
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
          onChange={onDateChange}
          onClose={() => setShowDatePicker(false)}
        />

        {/* Unified Time Picker Modal */}
        <UnifiedSchedulePickerModal
          visible={showTimePicker}
          mode="time"
          value={timeValue}
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
    paddingHorizontal: 22,
    paddingVertical: 7,
    borderRadius: 22,
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
    fontSize: 10.5,
    color: Colors.CoolSilverSubtitle,
    marginTop: 1,
    letterSpacing: 0.2,
    textAlign: 'center',
  },
  primaryTaskCardWrapper: {
    borderRadius: 22,
    backgroundColor: Colors.PureWhite,
    marginTop: 26,
    marginBottom: 22,
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
    borderRadius: 22,
    borderWidth: 1.5,
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingTop: 36,
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
    fontSize: 10.5,
    letterSpacing: 0.8,
    color: Colors.MutedSlateSubtext,
  },
  titleInput: {
    fontFamily: Fonts.poppins.bold,
    fontSize: 18,
    lineHeight: 26,
    color: Colors.MidnightCharcoal,
    paddingTop: Platform.OS === 'ios' ? 8 : 4,
    paddingBottom: Platform.OS === 'ios' ? 8 : 4,
    paddingHorizontal: 0,
    minHeight: 48,
    textAlignVertical: 'top',
    includeFontPadding: false,
  },
  contextRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 10,
    height: 48,
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
    fontSize: 13.5,
    color: Colors.SlateGraphiteText,
    paddingVertical: 0,
    paddingHorizontal: 0,
    margin: 0,
    textAlignVertical: 'center',
    includeFontPadding: false,
  },
  voiceNudgeCard: {
    backgroundColor: Colors.PureWhite,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: Colors.RingBorder,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
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
    gap: 12,
    marginRight: 14,
  },
  voiceIconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: Colors.WellnessLightBg,
    borderWidth: 1.5,
    borderColor: Colors.WellnessLightBorder,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: Colors.AccentGreen,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
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
    color: Colors.MutedSlateSubtext,
    marginTop: 2,
  },
  deleteSection: {
    marginTop: 18,
    marginBottom: 10,
  },
  deleteCardBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.PureWhite,
    borderWidth: 1.5,
    borderColor: Colors.CategoryRoseBorder,
    paddingVertical: 13,
    borderRadius: 18,
    ...Platform.select({
      ios: {
        shadowColor: Colors.CategoryRedAccent,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 6,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  deleteCardBtnText: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: 13,
    color: Colors.CategoryRedAccent,
  },
});

export default AddTaskModal;
