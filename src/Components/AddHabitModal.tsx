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
  Dimensions,
  Keyboard,
  FlatList,
  Pressable,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Check,
  X,
  Clock,
  Sparkles,
  Plus,
  FileText,
  Volume2,
  ArrowRight,
  ArrowDown,
  Flame,
  Sun,
  Moon,
  Trash2,
  RotateCw,
} from 'lucide-react-native';
import Svg, {
  Path,
  Defs,
  LinearGradient,
  RadialGradient,
  Stop,
  Rect,
  Circle,
  SvgProps,
} from 'react-native-svg';
import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import Toast from 'react-native-toast-message';

import { Fonts } from '../Theme/fonts';
import { Colors } from '../Assets/StyleUtilities/Colors';
import { Badge } from '../Common/Badge';
import ResponsivePixels from '../Assets/StyleUtilities/ResponsivePixels';
import { HabitItem } from '../Context/TaskReminderContext';
import { useOptionalVoiceWakeWord } from '../Context/VoiceWakeWordContext';
import FlowBadgePatternSvg from '../Screens/Dashboard/Components/FlowBadgePatternSvg';
import TaskCardAestheticBg from './TaskCardAestheticBg';
import PickerAestheticBg from './PickerAestheticBg';

// ─── Magic Black Schedule Button Aesthetic Background SVG ──────────────────────

const ScheduleButtonBackgroundSvg: React.FC<{
  type: 'date' | 'time';
}> = React.memo(({ type }) => {
  const auraColor = type === 'date' ? '#F5C518' : '#9C9CE3';
  const auraOpacity = type === 'date' ? 0.22 : 0.26;

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <Svg
        width="100%"
        height="100%"
        viewBox="0 0 170 64"
        preserveAspectRatio="none"
        fill="none"
      >
        <Defs>
          <LinearGradient
            id={`bgGrad-habit-${type}`}
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <Stop offset="0%" stopColor="#252733" stopOpacity={0.96} />
            <Stop offset="50%" stopColor="#1B1D26" stopOpacity={0.92} />
            <Stop offset="100%" stopColor="#131419" stopOpacity={0.98} />
          </LinearGradient>

          <RadialGradient
            id={`aura-habit-${type}`}
            cx="85%"
            cy="25%"
            rx="55%"
            ry="75%"
          >
            <Stop offset="0%" stopColor={auraColor} stopOpacity={auraOpacity} />
            <Stop offset="50%" stopColor={auraColor} stopOpacity={0.06} />
            <Stop offset="100%" stopColor="#131419" stopOpacity={0} />
          </RadialGradient>
        </Defs>

        <Rect width="100%" height="100%" fill={`url(#bgGrad-habit-${type})`} />
        <Rect width="100%" height="100%" fill={`url(#aura-habit-${type})`} />

        <Circle
          cx={145}
          cy={18}
          r={28}
          stroke="rgba(156, 156, 227, 0.18)"
          strokeWidth={1}
          fill="none"
        />
        <Circle
          cx={145}
          cy={18}
          r={42}
          stroke="rgba(156, 156, 227, 0.1)"
          strokeWidth={0.8}
          strokeDasharray="3 4"
          fill="none"
        />

        <Circle cx={130} cy={10} r={1.2} fill="#E0E0FF" opacity={0.7} />
        <Circle cx={155} cy={32} r={1} fill="#9C9CE3" opacity={0.55} />
      </Svg>
    </View>
  );
});

// ─── Habit Categories Setup ───────────────────────────────────────────────────

export interface HabitCategoryDefinition {
  id: 'morning' | 'mindful' | 'evening';
  label: string;
  sublabel: string;
  bgColor: string;
  borderColor: string;
  shadowColor: string;
  accentColor: string;
  checkColor: string;
  Icon: React.ComponentType<any>;
}

export const HABIT_CATEGORIES: HabitCategoryDefinition[] = [
  {
    id: 'morning',
    label: 'Morning',
    sublabel: 'Dawn Rituals',
    bgColor: '#EDFDF5',
    borderColor: '#C6FFDD',
    shadowColor: '#52D22E',
    accentColor: '#4A7C59',
    checkColor: '#1B9A72',
    Icon: Sun,
  },
  {
    id: 'mindful',
    label: 'Mindful',
    sublabel: 'Midday Focus',
    bgColor: '#EFF2FE',
    borderColor: '#D8DBFF',
    shadowColor: '#8383D6',
    accentColor: Colors.LavenderPurple,
    checkColor: '#7059C8',
    Icon: Sparkles,
  },
  {
    id: 'evening',
    label: 'Evening',
    sublabel: 'Night Routine',
    bgColor: '#FFF5F0',
    borderColor: '#FFE0D3',
    shadowColor: '#FB923C',
    accentColor: '#4F46E5',
    checkColor: '#EA580C',
    Icon: Moon,
  },
];

const FREQUENCY_OPTIONS = ['Daily', 'Weekdays', 'Weekends', 'Mon, Wed, Fri'];

const TIME_PRESETS = [
  '07:00 AM',
  '08:00 AM',
  '01:00 PM',
  '06:00 PM',
  '08:30 PM',
];

export interface AddHabitModalProps {
  visible: boolean;
  onClose: () => void;
  onCreateHabit: (habitData: {
    title: string;
    category: 'morning' | 'mindful' | 'evening';
    frequency: string;
    timeOfDay: string;
    accentColor: string;
  }) => void;
  onUpdateHabit?: (
    id: string,
    habitData: {
      title: string;
      category: 'morning' | 'mindful' | 'evening';
      frequency: string;
      timeOfDay: string;
      accentColor: string;
    },
  ) => void;
  onDeleteHabit?: (id: string) => void;
  habitToEdit?: HabitItem | null;
}

export const AddHabitModal: React.FC<AddHabitModalProps> = ({
  visible,
  onClose,
  onCreateHabit,
  onUpdateHabit,
  onDeleteHabit,
  habitToEdit,
}) => {
  const insets = useSafeAreaInsets();
  const voiceContext = useOptionalVoiceWakeWord();
  const assistantName = voiceContext?.assistantName || 'Regius';
  const { width: screenWidth } = Dimensions.get('window');

  // Form State
  const [title, setTitle] = useState('');
  const [intentionNote, setIntentionNote] = useState('');
  const [category, setCategory] = useState<'morning' | 'mindful' | 'evening'>(
    'morning',
  );
  const [frequency, setFrequency] = useState('Daily');
  const [timeOfDay, setTimeOfDay] = useState('07:30 AM');
  const [voiceNudgeEnabled, setVoiceNudgeEnabled] = useState<boolean>(true);
  const [titleInputHeight, setTitleInputHeight] = useState<number>(48);

  // Native Time Picker State
  const [showTimePicker, setShowTimePicker] = useState<boolean>(false);
  const [timeValue, setTimeValue] = useState<Date>(() => {
    const d = new Date();
    d.setHours(7, 30, 0, 0);
    return d;
  });

  // Scroll Reactive Header State
  const scrollY = useRef(new Animated.Value(0)).current;
  const [isScrolled, setIsScrolled] = useState<boolean>(false);

  // Animations
  const createAnim = useRef(new Animated.Value(1)).current;
  const noteInputRef = useRef<React.ComponentRef<typeof TextInput>>(null);

  const isEditing = !!habitToEdit;

  const resetForm = () => {
    if (habitToEdit) {
      setTitle(habitToEdit.title);
      setCategory(habitToEdit.category);
      setFrequency(habitToEdit.frequency);
      setTimeOfDay(habitToEdit.timeOfDay);
    } else {
      setTitle('');
      setIntentionNote('');
      setCategory('morning');
      setFrequency('Daily');
      setTimeOfDay('07:30 AM');
      const d = new Date();
      d.setHours(7, 30, 0, 0);
      setTimeValue(d);
    }
    setVoiceNudgeEnabled(true);
    setTitleInputHeight(48);
    scrollY.setValue(0);
    setIsScrolled(false);
  };

  useEffect(() => {
    if (visible) {
      resetForm();
    }
  }, [visible, habitToEdit]);

  const handleTitleContentSizeChange = (e: {
    nativeEvent: { contentSize: { height: number; width: number } };
  }) => {
    const nextHeight = Math.ceil(e.nativeEvent.contentSize.height);
    if (nextHeight > 0 && Math.abs(nextHeight - titleInputHeight) >= 2) {
      setTitleInputHeight(nextHeight);
    }
  };

  const onTimeChange = (event: DateTimePickerEvent, selected?: Date) => {
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
      setTimeOfDay(`${hourStr}:${minStr} ${meridiem}`);
    }
  };

  const handleSave = () => {
    if (!title.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Habit Name Required',
        text2: 'Please name your daily ritual to begin tracking.',
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

    const currentCatDef =
      HABIT_CATEGORIES.find(c => c.id === category) || HABIT_CATEGORIES[0];
    const accentColor = currentCatDef.accentColor;

    if (isEditing && onUpdateHabit && habitToEdit) {
      onUpdateHabit(habitToEdit.id, {
        title: title.replace(/[\r\n]+/g, ' ').trim(),
        category,
        frequency,
        timeOfDay,
        accentColor,
      });
      Toast.show({
        type: 'success',
        text1: 'Habit Updated',
        text2: `"${title.trim()}" changes saved.`,
      });
    } else {
      onCreateHabit({
        title: title.replace(/[\r\n]+/g, ' ').trim(),
        category,
        frequency,
        timeOfDay,
        accentColor,
      });
      Toast.show({
        type: 'success',
        text1: 'Habit Created! 🔥',
        text2: `"${title.trim()}" added to your daily consistency flow.`,
      });
    }

    onClose();
  };

  const handleDelete = () => {
    if (!habitToEdit || !onDeleteHabit) return;

    Alert.alert(
      'Delete Habit',
      `Are you sure you want to delete "${habitToEdit.title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            onDeleteHabit(habitToEdit.id);
            Toast.show({
              type: 'info',
              text1: 'Habit Deleted',
              text2: 'Habit removed from your daily rituals.',
            });
            onClose();
          },
        },
      ],
    );
  };

  const activeCategory =
    HABIT_CATEGORIES.find(c => c.id === category) || HABIT_CATEGORIES[0];

  const categoryCardWidth = Math.max(
    102,
    Math.floor((screenWidth - ResponsivePixels.size20 * 2 - 20) / 3),
  );

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
          style={{ flex: 1 }}
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
            {/* ─── Unified Primary Habit Card with 2-Layer Volumetric Shadow ─── */}
            <View
              style={[
                styles.primaryCardWrapper,
                { shadowColor: activeCategory.shadowColor },
              ]}
            >
              {/* Header crest badge centered on top border */}
              <View style={styles.flowHeaderBadge}>
                <FlowBadgePatternSvg />
                <Text style={styles.flowTitle}>
                  {isEditing ? 'Customize Ritual' : 'Craft Your Habit'}
                </Text>
                <Text style={styles.flowSubtitle}>
                  Daily Consistency & Flow
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
                {/* Dynamic Category Theme & Starlight Lattice Background */}
                <TaskCardAestheticBg
                  category={
                    category === 'morning'
                      ? 'sport'
                      : category === 'mindful'
                      ? 'habits'
                      : 'works'
                  }
                />

                <View style={styles.primaryCardHeader}>
                  <Text style={styles.cardSectionLabel}>
                    NAME YOUR DAILY RITUAL
                  </Text>
                  {isEditing && (
                    <Badge
                      variant="purple"
                      size="sm"
                      label="EDITING"
                      icon={<Flame size={10} color="#7059C8" />}
                    />
                  )}
                </View>

                {/* Natural multiline auto-growing text input */}
                <TextInput
                  style={[
                    styles.titleInput,
                    titleInputHeight > 48 ? { height: titleInputHeight } : null,
                  ]}
                  placeholder="e.g., Morning Sunlight & 500ml Water..."
                  placeholderTextColor="#A3A8B1"
                  value={title}
                  onChangeText={setTitle}
                  onContentSizeChange={handleTitleContentSizeChange}
                  multiline={true}
                  scrollEnabled={true}
                  rejectResponderTermination={true}
                  autoFocus={!isEditing}
                  cursorColor={Colors.MidnightCharcoal}
                  selectionColor="rgba(31, 34, 40, 0.25)"
                />

                {/* Vertically Centered Intention / Context Row */}
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
                    placeholder="Add routine intention or milestone cue..."
                    placeholderTextColor="#A3A8B1"
                    value={intentionNote}
                    onChangeText={setIntentionNote}
                    returnKeyType="done"
                    blurOnSubmit={true}
                    cursorColor={Colors.MidnightCharcoal}
                    selectionColor="rgba(31, 34, 40, 0.25)"
                  />
                </Pressable>
              </View>
            </View>

            {/* ─── Category Flow Selector (Morning, Mindful, Evening) ─── */}
            <View style={styles.sectionBlock}>
              <View style={styles.sectionHeaderRow}>
                <Text style={styles.sectionHeading}>
                  Category & Ritual Flow
                </Text>
                <Text style={styles.sectionSubtext}>Time anchor</Text>
              </View>

              <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                data={HABIT_CATEGORIES}
                keyExtractor={item => item.id}
                style={styles.categoryFlatList}
                contentContainerStyle={styles.categoryScrollContainer}
                keyboardShouldPersistTaps="handled"
                nestedScrollEnabled
                renderItem={({ item: cat }) => {
                  const isSelected = category === cat.id;
                  const CatIcon = cat.Icon;

                  return (
                    <TouchableOpacity
                      key={cat.id}
                      activeOpacity={0.85}
                      onPress={() => setCategory(cat.id)}
                      style={[
                        styles.categoryCardExact,
                        {
                          backgroundColor: cat.bgColor,
                          width: categoryCardWidth,
                          shadowColor: cat.shadowColor,
                        },
                        isSelected && [
                          styles.categoryCardExactSelected,
                          {
                            borderColor: cat.borderColor,
                          },
                        ],
                      ]}
                    >
                      <View style={styles.categoryCardTop}>
                        <View
                          style={[
                            styles.categoryIconWrap,
                            {
                              borderColor: cat.borderColor,
                              shadowColor: cat.shadowColor,
                            },
                          ]}
                        >
                          <CatIcon
                            size={16}
                            color={cat.checkColor}
                            strokeWidth={2.4}
                          />
                        </View>

                        {/* Floating Checkbox with Card Accent Color */}
                        {isSelected ? (
                          <View
                            style={[
                              styles.categoryFloatingCheckbox,
                              styles.categoryFloatingCheckboxChecked,
                              {
                                borderColor: cat.accentColor,
                                backgroundColor: cat.bgColor,
                                shadowColor: cat.shadowColor,
                              },
                            ]}
                          >
                            <Check
                              size={12}
                              color={cat.checkColor}
                              strokeWidth={3}
                            />
                          </View>
                        ) : (
                          <View
                            style={[
                              styles.categoryFloatingCheckbox,
                              styles.categoryFloatingCheckboxUnchecked,
                              {
                                borderColor: cat.borderColor,
                              },
                            ]}
                          />
                        )}
                      </View>

                      <View style={styles.categoryCardBottom}>
                        <Text
                          style={styles.categoryCardLabel}
                          numberOfLines={1}
                        >
                          {cat.label}
                        </Text>
                      </View>

                      {isSelected && cat.accentColor ? (
                        <View style={styles.categoryAccentWrap}>
                          <View
                            style={[
                              styles.categoryAccent,
                              { backgroundColor: cat.accentColor },
                            ]}
                          />
                        </View>
                      ) : null}
                    </TouchableOpacity>
                  );
                }}
              />
            </View>

            {/* ─── Frequency & Cadence Selector ─── */}
            <View style={styles.sectionBlock}>
              <View style={styles.sectionHeaderRow}>
                <Text style={styles.sectionHeading}>Ritual Frequency</Text>
                <Badge
                  variant="green"
                  size="sm"
                  label="Streak Cadence"
                  icon={<RotateCw size={11} color="#1B9A72" />}
                />
              </View>

              <View style={styles.frequencyRow}>
                {FREQUENCY_OPTIONS.map(f => {
                  const isSelected = frequency === f;
                  return (
                    <TouchableOpacity
                      key={f}
                      activeOpacity={0.8}
                      onPress={() => setFrequency(f)}
                      style={[
                        styles.frequencyChip,
                        isSelected && styles.frequencyChipSelected,
                      ]}
                    >
                      <Text
                        style={[
                          styles.frequencyChipText,
                          isSelected && styles.frequencyChipTextSelected,
                        ]}
                      >
                        {f}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* ─── Ideal Time of Day ─── */}
            <View style={styles.sectionBlock}>
              <View style={styles.sectionHeaderRow}>
                <Text style={styles.sectionHeading}>Ideal Time of Day</Text>
                <Text style={styles.sectionSubtext}>Trigger cue</Text>
              </View>

              {/* Time Presets Quick Chips */}
              <View style={styles.quickTimeRow}>
                {TIME_PRESETS.map(preset => {
                  const isPresetSelected = timeOfDay === preset;
                  return (
                    <TouchableOpacity
                      key={preset}
                      activeOpacity={0.75}
                      onPress={() => setTimeOfDay(preset)}
                      style={[
                        styles.quickTimeChip,
                        isPresetSelected && styles.quickTimeChipSelected,
                      ]}
                    >
                      <Text
                        style={[
                          styles.quickTimeChipText,
                          isPresetSelected && styles.quickTimeChipTextSelected,
                        ]}
                      >
                        {preset}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Schedule Button Wrapped inside scheduleContainerCard */}
              <View style={styles.scheduleContainerCard}>
                <View style={styles.magicScheduleBtnWrapper}>
                  <TouchableOpacity
                    activeOpacity={0.82}
                    onPress={() => setShowTimePicker(true)}
                    style={styles.magicScheduleBtn}
                    accessibilityRole="button"
                    accessibilityLabel={`Scheduled habit time: ${timeOfDay}`}
                  >
                    <ScheduleButtonBackgroundSvg type="time" />

                    <View
                      style={[styles.magicIconWrap, styles.magicIconWrapTime]}
                    >
                      <Clock size={16} color="#9C9CE3" strokeWidth={2.4} />
                    </View>

                    <View style={styles.magicScheduleTextGroup}>
                      <Text style={styles.magicScheduleSmallLabel}>
                        TARGET TIME
                      </Text>
                      <Text style={styles.magicScheduleValue} numberOfLines={1}>
                        {timeOfDay}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* ─── Spoken Voice Nudge (Sleek 3D Card with Assistant Badge) ─── */}
            <View style={styles.voiceNudgeCard}>
              <View style={styles.voiceNudgeLeft}>
                <View style={styles.voiceIconBox}>
                  <Volume2 size={20} color="#1B9A72" strokeWidth={2.4} />
                </View>

                <View style={styles.voiceTextGroup}>
                  <View style={styles.voiceTitleRow}>
                    <Text style={styles.voiceTitle} numberOfLines={1}>
                      Voice Nudge
                    </Text>
                    <Badge
                      variant="purple"
                      size="sm"
                      label={`${assistantName.toUpperCase()} AI`}
                      icon={<Sparkles size={9} color="#7059C8" />}
                    />
                  </View>
                  <Text style={styles.voiceSubtitle} numberOfLines={1}>
                    Audio chime when ritual time arrives
                  </Text>
                </View>
              </View>

              <Switch
                value={voiceNudgeEnabled}
                onValueChange={setVoiceNudgeEnabled}
                trackColor={{
                  false: '#E4E2DD',
                  true: Colors.MidnightCharcoal,
                }}
                thumbColor="#FFFFFF"
                ios_backgroundColor="#E4E2DD"
              />
            </View>

            {/* ─── Delete Habit Action (Only when editing) ─── */}
            {isEditing && onDeleteHabit && (
              <View style={styles.deleteSection}>
                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={handleDelete}
                  style={styles.deleteCardBtn}
                  accessibilityRole="button"
                  accessibilityLabel="Delete Habit"
                >
                  <Trash2 size={16} color="#EF4444" strokeWidth={2.2} />
                  <Text style={styles.deleteCardBtnText}>
                    Delete Daily Ritual
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </Animated.ScrollView>

          {/* ─── Bottom Floating Hero CTA Row ────── */}
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

              {/* Save / Create Habit Button on Right */}
              <Animated.View
                style={[{ flex: 1 }, { transform: [{ scale: createAnim }] }]}
              >
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={handleSave}
                  style={styles.createHabitHeroBtn}
                >
                  <Text style={styles.createHabitHeroBtnText}>
                    {isEditing ? 'Save Changes' : 'Create Habit Flow'}
                  </Text>

                  <View style={styles.createHabitHeroCircle}>
                    <ArrowRight size={18} color="#FFFFFF" strokeWidth={2.6} />
                  </View>
                </TouchableOpacity>
              </Animated.View>
            </View>
          </View>
        </KeyboardAvoidingView>

        {/* ─── Standard Native TimePicker Modal (iOS Bottom Sheet) ─── */}
        {Platform.OS === 'ios' ? (
          <Modal
            visible={showTimePicker}
            transparent
            animationType="slide"
            onRequestClose={() => setShowTimePicker(false)}
          >
            <TouchableWithoutFeedback onPress={() => setShowTimePicker(false)}>
              <View style={styles.pickerModalOverlay}>
                <TouchableWithoutFeedback>
                  <View style={styles.pickerModalCard}>
                    <View style={styles.pickerDragHandle} />

                    <PickerAestheticBg type="time" />

                    <View style={styles.pickerModalHeader}>
                      <View style={styles.pickerHeaderTitleWrap}>
                        <View
                          style={[
                            styles.pickerHeaderBadge,
                            styles.pickerHeaderBadgeTime,
                          ]}
                        >
                          <Clock size={12} color="#7059C8" strokeWidth={2.5} />
                          <Text style={styles.pickerHeaderBadgeTextTime}>
                            LUNAR CHRONO
                          </Text>
                        </View>
                        <Text style={styles.pickerModalTitle}>Target Time</Text>
                      </View>

                      <TouchableOpacity
                        activeOpacity={0.82}
                        onPress={() => setShowTimePicker(false)}
                        style={styles.pickerDoneBtn}
                        accessibilityRole="button"
                        accessibilityLabel="Confirm time selection"
                      >
                        <Text style={styles.pickerDoneBtnText}>Done</Text>
                      </TouchableOpacity>
                    </View>

                    <View style={styles.pickerWheelContainer}>
                      <DateTimePicker
                        value={timeValue}
                        mode="time"
                        display="spinner"
                        onChange={onTimeChange}
                        textColor={Colors.MidnightCharcoal}
                        themeVariant="light"
                      />
                    </View>
                  </View>
                </TouchableWithoutFeedback>
              </View>
            </TouchableWithoutFeedback>
          </Modal>
        ) : (
          showTimePicker && (
            <DateTimePicker
              value={timeValue}
              mode="time"
              display="default"
              onChange={onTimeChange}
            />
          )
        )}
      </View>
    </Modal>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  canvasContainer: {
    flex: 1,
    backgroundColor: '#FAF8F5',
  },

  // ─── Header Crest Badge (Centered on Top Border) ───
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

  // ─── Scroll Area ───
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: ResponsivePixels.size20,
  },

  // ─── Primary Card (2-Layer Volumetric Shadow Wrapper Pattern) ───
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

  // ─── General Section Block ───
  sectionBlock: {
    marginBottom: 24,
    overflow: 'visible',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
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

  // ─── Category Cards (TasksScreen Asymmetric Top-Right Design) ───
  categoryFlatList: {
    overflow: 'visible',
  },
  categoryScrollContainer: {
    paddingVertical: 12,
    paddingHorizontal: 2,
    gap: 10,
  },
  categoryCardExact: {
    minHeight: 88,
    borderRadius: 18,
    borderTopRightRadius: 44,
    paddingTop: ResponsivePixels.size12,
    paddingBottom: ResponsivePixels.size12,
    paddingHorizontal: ResponsivePixels.size11,
    position: 'relative',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    justifyContent: 'space-between',
    ...Platform.select({
      ios: {
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.18,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  categoryCardExactSelected: {
    borderColor: '#FFFFFF',
    borderWidth: 2,
    ...Platform.select({
      ios: {
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.36,
        shadowRadius: 14,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  categoryCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: ResponsivePixels.size8,
  },
  categoryIconWrap: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 3,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  categoryCardBottom: {
    gap: 1,
  },
  categoryCardLabel: {
    fontFamily: Fonts.poppins.bold,
    fontSize: 13,
    color: '#1B1C19',
    letterSpacing: -0.1,
  },
  categoryFloatingCheckbox: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 3,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  categoryFloatingCheckboxChecked: {
    backgroundColor: '#FFFFFF',
  },
  categoryFloatingCheckboxUnchecked: {
    backgroundColor: '#FFFFFF',
    borderColor: '#ECE8DF',
  },
  categoryAccentWrap: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  categoryAccent: {
    height: 3,
    width: 32,
    borderTopLeftRadius: 2.5,
    borderTopRightRadius: 2.5,
  },

  // ─── Frequency Chips ───
  frequencyRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  frequencyChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#ECE7DB',
    borderBottomWidth: 3.5,
    borderBottomColor: '#D8D1C0',
    ...Platform.select({
      ios: {
        shadowColor: '#5C5441',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.12,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  frequencyChipSelected: {
    backgroundColor: Colors.NeroBlack,
    borderWidth: 1.5,
    borderTopColor: '#454955',
    borderLeftColor: '#333640',
    borderRightColor: '#333640',
    borderBottomWidth: 3.5,
    borderBottomColor: '#0A0B0E',
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.28,
        shadowRadius: 5,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  frequencyChipText: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: 12,
    color: '#555450',
    letterSpacing: -0.1,
  },
  frequencyChipTextSelected: {
    color: Colors.DefaultWhite,
    fontFamily: Fonts.poppins.bold,
  },

  // ─── Quick Time Presets ───
  quickTimeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  quickTimeChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.2,
    borderColor: '#ECE7DB',
    borderBottomWidth: 2.5,
    borderBottomColor: '#D8D1C0',
  },
  quickTimeChipSelected: {
    backgroundColor: Colors.NeroBlack,
    borderColor: '#333640',
    borderBottomColor: '#0A0B0E',
  },
  quickTimeChipText: {
    fontFamily: Fonts.poppins.medium,
    fontSize: 11.5,
    color: '#63625E',
  },
  quickTimeChipTextSelected: {
    color: '#FFFFFF',
    fontFamily: Fonts.poppins.bold,
  },

  // ─── Magic Black Schedule Pickers ───
  scheduleContainerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: '#E8E2D5',
    padding: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.06,
        shadowRadius: 10,
      },
      android: {
        elevation: 2.5,
      },
    }),
  },
  magicScheduleBtnWrapper: {
    borderRadius: 18,
    backgroundColor: Colors.NeroBlack,
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.28,
        shadowRadius: 10,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  magicScheduleBtn: {
    borderRadius: 18,
    borderWidth: 1.2,
    borderColor: '#2E323D',
    overflow: 'hidden',
    paddingVertical: 12,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  magicIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  magicIconWrapTime: {
    backgroundColor: 'rgba(156, 156, 227, 0.12)',
    borderColor: 'rgba(156, 156, 227, 0.25)',
  },
  magicScheduleTextGroup: {
    flex: 1,
  },
  magicScheduleSmallLabel: {
    fontFamily: Fonts.poppins.bold,
    fontSize: 9.5,
    color: '#9EA3B0',
    letterSpacing: 0.6,
  },
  magicScheduleValue: {
    fontFamily: Fonts.poppins.bold,
    fontSize: 14,
    color: '#FFFFFF',
    marginTop: 1,
  },

  // ─── Voice Nudge Card ───
  voiceNudgeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#E8E2D5',
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
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
    backgroundColor: '#EDFDF5',
    borderWidth: 1.5,
    borderColor: '#C6FFDD',
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#52D22E',
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
    color: '#7E838F',
    marginTop: 2,
  },

  // ─── Delete Button Section ───
  deleteSection: {
    marginBottom: 24,
  },
  deleteCardBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#FECDD3',
    paddingVertical: 13,
    borderRadius: 18,
    ...Platform.select({
      ios: {
        shadowColor: '#EF4444',
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
    fontFamily: Fonts.poppins.bold,
    fontSize: 13.5,
    color: '#EF4444',
  },

  // ─── Bottom Floating Hero CTA ───
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
  createHabitHeroBtn: {
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
  createHabitHeroBtnText: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: 16,
    color: '#FFFFFF',
    letterSpacing: -0.2,
  },
  createHabitHeroCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ─── Native Picker Bottom Sheet (iOS) ───
  pickerModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(14, 16, 21, 0.65)',
    justifyContent: 'flex-end',
  },
  pickerModalCard: {
    backgroundColor: '#FAF8F5',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 36 : 24,
    borderTopWidth: 2,
    borderColor: '#E8E2D5',
    position: 'relative',
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: -6 },
        shadowOpacity: 0.16,
        shadowRadius: 18,
      },
      android: {
        elevation: 12,
      },
    }),
  },
  pickerDragHandle: {
    width: 36,
    height: 4.5,
    borderRadius: 2.5,
    backgroundColor: '#D5D0C5',
    alignSelf: 'center',
    marginBottom: 12,
  },
  pickerModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.06)',
  },
  pickerHeaderTitleWrap: {
    gap: 4,
  },
  pickerHeaderBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  pickerHeaderBadgeTime: {
    backgroundColor: '#F3F2FD',
    borderColor: '#E0DEFA',
  },
  pickerHeaderBadgeTextTime: {
    fontFamily: Fonts.poppins.bold,
    fontSize: 9.5,
    letterSpacing: 0.8,
    color: '#7059C8',
  },
  pickerModalTitle: {
    fontFamily: Fonts.ranade.bold,
    fontSize: 20,
    color: Colors.MidnightCharcoal,
    letterSpacing: -0.3,
  },
  pickerDoneBtn: {
    backgroundColor: Colors.MidnightCharcoal,
    borderRadius: 50,
    paddingHorizontal: 18,
    paddingVertical: 7,
    borderWidth: 1.2,
    borderColor: '#3A3F48',
    ...Platform.select({
      ios: {
        shadowColor: Colors.MidnightCharcoal,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.25,
        shadowRadius: 6,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  pickerDoneBtnText: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: 13,
    color: '#FFFFFF',
  },
  pickerWheelContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 6,
  },
});

export default AddHabitModal;
