import React, { useState, useEffect, useRef } from 'react';
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
  Keyboard,
  Pressable,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FileText, ArrowRight, ArrowDown } from 'lucide-react-native';
import Toast from 'react-native-toast-message';

import { Fonts } from '../Theme/fonts';
import { Colors } from '../Assets/StyleUtilities/Colors';
import ResponsivePixels from '../Assets/StyleUtilities/ResponsivePixels';
import { useOptionalVoiceWakeWord } from '../Context/VoiceWakeWordContext';
import FlowBadgePatternSvg from '../Screens/Dashboard/Components/FlowBadgePatternSvg';
import TaskCardAestheticBg from './TaskCardAestheticBg';
import {
  HeartEmblemIcon,
  OfficeBagIcon,
  PictureEmblemIcon,
  SparkleEmblemIcon,
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
  ReminderAlertSelector,
} from './AddModal';

const DEFAULT_REMINDER_CATEGORIES: CategoryItem[] = [
  {
    id: 'daily',
    label: 'Daily',
    bgColor: '#FFFCEB',
    borderColor: '#FFF5B8',
    shadowColor: '#F5C518',
    accentColor: '#FDD835',
    checkColor: '#D97706',
    badgeVariant: 'yellow',
    Icon: HeartEmblemIcon,
  },
  {
    id: 'work',
    label: 'Work',
    bgColor: '#EFF2FE',
    borderColor: '#D8DBFF',
    shadowColor: '#8383D6',
    accentColor: '#8383D6',
    checkColor: '#7059C8',
    badgeVariant: 'purple',
    Icon: OfficeBagIcon,
  },
  {
    id: 'health',
    label: 'Health',
    bgColor: '#EDFDF5',
    borderColor: '#C6FFDD',
    shadowColor: '#52D22E',
    accentColor: '#52D22E',
    checkColor: '#1B9A72',
    badgeVariant: 'green',
    Icon: PictureEmblemIcon,
  },
  {
    id: 'events',
    label: 'Events',
    bgColor: '#FFF5F0',
    borderColor: '#FFE0D3',
    shadowColor: '#FB923C',
    accentColor: '#FB923C',
    checkColor: '#EA580C',
    badgeVariant: 'orange',
    Icon: SparkleEmblemIcon,
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

export interface AddReminderModalProps {
  visible: boolean;
  onClose: () => void;
  onCreateReminder: (data: {
    title: string;
    notes?: string;
    category: string;
    time: string;
    date: string;
    repeat: string;
    remindBefore?: string;
    sound?: string;
    urgentAlarm?: boolean;
  }) => void;
}

export const AddReminderModal: React.FC<AddReminderModalProps> = ({
  visible,
  onClose,
  onCreateReminder,
}) => {
  const insets = useSafeAreaInsets();
  const voiceContext = useOptionalVoiceWakeWord();
  const assistantName = voiceContext?.assistantName || 'Regius';

  // Form State
  const [reminderTitle, setReminderTitle] = useState('');
  const [reminderNotes, setReminderNotes] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('daily');
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const today = new Date();
    return `Today, ${MONTH_SHORT[today.getMonth()]} ${today.getDate()}`;
  });
  const [selectedTime, setSelectedTime] = useState<string>('04:30 PM');
  const [remindBefore, setRemindBefore] = useState<string>('5 mins before');
  const [repeatCycle, setRepeatCycle] = useState<string>('Daily');
  const [voiceNudgeEnabled, setVoiceNudgeEnabled] = useState<boolean>(true);
  const [urgentAlarm, setUrgentAlarm] = useState<boolean>(false);
  const [isPlayingPreview, setIsPlayingPreview] = useState<boolean>(false);
  const [titleInputHeight, setTitleInputHeight] = useState<number>(48);

  // Native Date & Time Picker State
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [showTimePicker, setShowTimePicker] = useState<boolean>(false);
  const [dateValue, setDateValue] = useState<Date>(new Date());
  const [timeValue, setTimeValue] = useState<Date>(() => {
    const d = new Date();
    d.setHours(16, 30, 0, 0);
    return d;
  });

  // Dynamic Category State
  const [categoryList, setCategoryList] = useState<CategoryItem[]>(
    DEFAULT_REMINDER_CATEGORIES,
  );
  const [showAddCategoryModal, setShowAddCategoryModal] =
    useState<boolean>(false);

  // Scroll Reactive Header State
  const scrollY = useRef(new Animated.Value(0)).current;
  const [isScrolled, setIsScrolled] = useState<boolean>(false);

  // Animations
  const createAnim = useRef(new Animated.Value(1)).current;
  const noteInputRef = useRef<React.ComponentRef<typeof TextInput>>(null);

  const resetForm = () => {
    const today = new Date();
    const formattedDefaultDate = `Today, ${
      MONTH_SHORT[today.getMonth()]
    } ${today.getDate()}`;
    setReminderTitle('');
    setReminderNotes('');
    setSelectedCategory('daily');
    setSelectedDate(formattedDefaultDate);
    setSelectedTime('04:30 PM');
    setDateValue(today);
    const defaultTime = new Date();
    defaultTime.setHours(16, 30, 0, 0);
    setTimeValue(defaultTime);
    setRemindBefore('5 mins before');
    setRepeatCycle('Daily');
    setVoiceNudgeEnabled(true);
    setUrgentAlarm(false);
    setIsPlayingPreview(false);
    setTitleInputHeight(48);
    scrollY.setValue(0);
    setIsScrolled(false);
  };

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
      resetForm();
    }
  }, [visible]);

  // DateTimePicker Handlers
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

  const handlePreviewSound = () => {
    setIsPlayingPreview(true);
    setTimeout(() => {
      setIsPlayingPreview(false);
    }, 1500);
  };

  const handleSave = () => {
    if (!reminderTitle.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Reminder Title Required',
        text2: 'Please enter a title for your reminder before saving.',
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
        useNativeDriver: true,
      }),
    ]).start();

    onCreateReminder({
      title: reminderTitle.replace(/[\r\n]+/g, ' ').trim(),
      notes: reminderNotes.trim() || undefined,
      category: selectedCategory,
      time: selectedTime,
      date: selectedDate,
      repeat: repeatCycle,
      remindBefore,
      sound: 'Gentle Bell',
      urgentAlarm,
    });
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
      <View style={styles.canvasContainer}>
        <StatusBar
          barStyle="dark-content"
          {...(Platform.OS === 'android'
            ? {
                backgroundColor: '#FAF8F5',
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
            {/* Primary Reminder Card with 2-Layer Wrapper Pattern */}
            <View
              style={[
                styles.primaryCardWrapper,
                { shadowColor: activeCategory.shadowColor },
              ]}
            >
              {/* Crest badge */}
              <View style={styles.flowHeaderBadge}>
                <FlowBadgePatternSvg />
                <Text style={styles.flowTitle}>Craft Your Reminder</Text>
                <Text style={styles.flowSubtitle}>
                  Timely Alerts & Punctuality
                </Text>
              </View>

              <View
                style={[
                  styles.primaryCard,
                  {
                    borderColor: activeCategory.borderColor,
                  },
                ]}
              >
                <TaskCardAestheticBg category={selectedCategory} />

                <View style={styles.primaryCardHeader}>
                  <Text style={styles.cardSectionLabel}>
                    WHAT WOULD YOU LIKE TO BE REMINDED OF?
                  </Text>
                </View>
                <TextInput
                  style={[
                    styles.titleInput,
                    titleInputHeight > 48 ? { height: titleInputHeight } : null,
                  ]}
                  placeholder="e.g., Client Follow-up Call..."
                  placeholderTextColor="#A3A8B1"
                  value={reminderTitle}
                  onChangeText={setReminderTitle}
                  onContentSizeChange={handleTitleContentSizeChange}
                  multiline={true}
                  scrollEnabled={true}
                  rejectResponderTermination={true}
                  autoFocus={true}
                  cursorColor={Colors.MidnightCharcoal}
                  selectionColor="rgba(31, 34, 40, 0.25)"
                />

                {/* Memo input */}
                <Pressable
                  style={styles.contextRow}
                  onPress={() => noteInputRef.current?.focus()}
                  accessible={false}
                >
                  <View style={styles.contextIconWrap}>
                    <FileText size={16} color="#7E838F" strokeWidth={2} />
                  </View>
                  <TextInput
                    ref={noteInputRef}
                    style={styles.contextInput}
                    placeholder="Add gentle context or personal memo..."
                    placeholderTextColor="#A3A8B1"
                    value={reminderNotes}
                    onChangeText={setReminderNotes}
                    returnKeyType="done"
                    blurOnSubmit={true}
                    cursorColor={Colors.MidnightCharcoal}
                    selectionColor="rgba(31, 34, 40, 0.25)"
                  />
                </Pressable>
              </View>
            </View>

            {/* Category Selector */}
            <CategoryChipSelector
              categories={categoryList}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              onPressAddCategory={() => setShowAddCategoryModal(true)}
              heading="Category Focus"
            />

            {/* Schedule Section */}
            <ScheduleTriggerRow
              selectedDate={selectedDate}
              selectedTime={selectedTime}
              onSelectQuickDate={handleSelectQuickDate}
              onPressDate={() => setShowDatePicker(true)}
              onPressTime={() => setShowTimePicker(true)}
            />

            {/* Reminder Alert & Repeat Options */}
            <ReminderAlertSelector
              repeatCycle={repeatCycle}
              onSelectRepeatCycle={setRepeatCycle}
              remindBefore={remindBefore}
              onSelectRemindBefore={setRemindBefore}
              soundTitle="Gentle Bell"
              soundSubtitle="Soft Harmonic Chime"
              isPlayingPreview={isPlayingPreview}
              onPreviewSound={handlePreviewSound}
              voiceNudgeEnabled={voiceNudgeEnabled}
              onToggleVoiceNudge={setVoiceNudgeEnabled}
              urgentAlarm={urgentAlarm}
              onToggleUrgentAlarm={setUrgentAlarm}
              assistantName={assistantName}
            />
          </Animated.ScrollView>

          {/* Bottom actions dock */}
          <View
            pointerEvents="box-none"
            style={[
              styles.bottomStickyCta,
              { paddingBottom: Math.max(insets.bottom, 16) + 6 },
            ]}
          >
            <View style={styles.bottomCtaRow}>
              {/* Back Button on Left */}
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={onClose}
                style={styles.bottomBackBtn}
                accessibilityRole="button"
                accessibilityLabel="Go back"
              >
                <ArrowDown size={20} color="#FFFFFF" strokeWidth={2.4} />
              </TouchableOpacity>

              {/* Create Reminder Button on Right */}
              <Animated.View
                style={[
                  styles.createBtnAnimWrap,
                  { transform: [{ scale: createAnim }] },
                ]}
              >
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={handleSave}
                  style={styles.createReminderHeroBtn}
                >
                  <Text style={styles.createReminderHeroBtnText}>
                    Create Reminder
                  </Text>

                  <View style={styles.createReminderHeroCircle}>
                    <ArrowRight size={18} color="#FFFFFF" strokeWidth={2.6} />
                  </View>
                </TouchableOpacity>
              </Animated.View>
            </View>
          </View>
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
    backgroundColor: '#FAF8F5',
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
    borderTopColor: '#4A4E5C',
    borderLeftColor: '#363944',
    borderRightColor: '#363944',
    borderBottomWidth: 4,
    borderBottomColor: '#090A0D',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0B0D11',
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
    color: Colors.DefaultWhite,
    letterSpacing: -0.1,
    textAlign: 'center',
  },
  flowSubtitle: {
    fontFamily: Fonts.poppins.medium,
    fontSize: 10.5,
    color: '#B6B9C3',
    marginTop: 1,
    letterSpacing: 0.2,
    textAlign: 'center',
  },
  primaryCardWrapper: {
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
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
  primaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    borderWidth: 1.5,
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingTop: 36,
    position: 'relative',
    overflow: 'hidden',
  },
  primaryCardHeader: {
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
    color: '#7E838F',
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
    borderColor: 'rgba(0, 0, 0, 0.06)',
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
    color: '#3F454D',
    paddingVertical: 0,
    paddingHorizontal: 0,
    margin: 0,
    textAlignVertical: 'center',
    includeFontPadding: false,
  },
  bottomStickyCta: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
    paddingHorizontal: ResponsivePixels.size20,
    paddingTop: 10,
  },
  bottomCtaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  bottomBackBtn: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: Colors.MidnightCharcoal,
    borderWidth: 1.2,
    borderColor: '#3A3F48',
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: Colors.MidnightCharcoal,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.35,
        shadowRadius: 14,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  createBtnAnimWrap: {
    flex: 1,
  },
  createReminderHeroBtn: {
    backgroundColor: Colors.MidnightCharcoal,
    borderRadius: 50,
    height: 54,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    borderWidth: 1.2,
    borderColor: '#3A3F48',
    ...Platform.select({
      ios: {
        shadowColor: Colors.MidnightCharcoal,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.35,
        shadowRadius: 14,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  createReminderHeroBtnText: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: 16,
    color: '#FFFFFF',
    letterSpacing: -0.2,
  },
  createReminderHeroCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default AddReminderModal;
