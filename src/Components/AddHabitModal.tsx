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
  Dimensions,
  Keyboard,
  FlatList,
  Pressable,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Check,
  Clock,
  Sparkles,
  FileText,
  Volume2,
  Flame,
  Sun,
  Moon,
  Trash2,
  RotateCw,
} from 'lucide-react-native';
import {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import Toast from 'react-native-toast-message';

import { Fonts } from '../Theme/fonts';
import { Colors, withAlpha } from '../Assets/StyleUtilities/Colors';
import { useAppTheme } from '../Theme/useAppTheme';
import { Badge } from '../Common/Badge';
import ResponsivePixels from '../Assets/StyleUtilities/ResponsivePixels';
import { HabitItem } from '../Context/TaskReminderContext';
import { useOptionalVoiceWakeWord } from '../Context/VoiceWakeWordContext';
import FlowBadgePatternSvg from '../Screens/Dashboard/Components/FlowBadgePatternSvg';
import TaskCardAestheticBg from './TaskCardAestheticBg';
import { ScheduleButtonBackgroundSvg } from '../Common/ScheduleButtonBackgroundSvg';
import { UnifiedSchedulePickerModal } from '../Common/UnifiedSchedulePickerModal';
import { ModalBottomBar } from './AddModal';

// Habit Categories Setup

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
    bgColor: Colors.WorkLightBg,
    borderColor: Colors.WorkLightBorder,
    shadowColor: Colors.HabitBurnishedAmber,
    accentColor: Colors.BadgeYellowText,
    checkColor: Colors.BadgeYellowText,
    Icon: Sun,
  },
  {
    id: 'mindful',
    label: 'Mindful',
    sublabel: 'Midday Focus',
    bgColor: Colors.MindfulLightBg,
    borderColor: Colors.MindfulLightBorder,
    shadowColor: Colors.LavenderPurple,
    accentColor: Colors.LavenderPurple,
    checkColor: Colors.MindfulTextAccent,
    Icon: Sparkles,
  },
  {
    id: 'evening',
    label: 'Evening',
    sublabel: 'Night Routine',
    bgColor: Colors.CategoryPeachBg,
    borderColor: Colors.CategoryPeachBorder,
    shadowColor: Colors.CategoryOrangeAccent,
    accentColor: Colors.HabitRoyalIndigo,
    checkColor: Colors.CategoryOrangeCheck,
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
  const { isDarkMode, bgMain, cardBg, textPrimary, textSecondary } =
    useAppTheme();
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

  const resetForm = useCallback(() => {
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
  }, [habitToEdit, scrollY]);

  useEffect(() => {
    if (visible) {
      resetForm();
    }
  }, [visible, resetForm]);

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
            {/* Unified Primary Habit Card with 2-Layer Card */}
            <View
              style={[
                styles.primaryCardWrapper,
                isDarkMode && { backgroundColor: cardBg },
                { shadowColor: activeCategory.shadowColor },
              ]}
            >
              {/* Crest badge */}
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
                  isDarkMode && { backgroundColor: cardBg },
                  {
                    borderColor: activeCategory.borderColor,
                  },
                ]}
              >
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
                      icon={<Flame size={10} color={Colors.MindfulTextAccent} />}
                    />
                  )}
                </View>
                <TextInput
                  style={[
                    styles.titleInput,
                    isDarkMode && { color: Colors.PureWhite },
                    titleInputHeight > 48 ? { height: titleInputHeight } : null,
                  ]}
                  placeholder="e.g., Morning Sunlight & 500ml Water..."
                  placeholderTextColor={Colors.SteelMist}
                  value={title}
                  onChangeText={setTitle}
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

                {/* Intention input */}
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
                    placeholder="Add routine intention or milestone cue..."
                    placeholderTextColor={Colors.SteelMist}
                    value={intentionNote}
                    onChangeText={setIntentionNote}
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
              </View>
            </View>

            {/* Category Flow Selector (Morning, Mindful, Evening) */}
            <View style={styles.sectionBlock}>
              <View style={styles.sectionHeaderRow}>
                <Text
                  style={[
                    styles.sectionHeading,
                    isDarkMode && { color: textPrimary },
                  ]}
                >
                  Category & Ritual Flow
                </Text>
                <Text
                  style={[
                    styles.sectionSubtext,
                    isDarkMode && { color: textSecondary },
                  ]}
                >
                  Time anchor
                </Text>
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

                  const cardBg = isDarkMode
                    ? cat.id === 'morning'
                      ? Colors.WorkDarkBg
                      : cat.id === 'mindful'
                      ? Colors.MindfulDarkBg
                      : Colors.EventDarkBg
                    : cat.bgColor;
                  const cardBorder = isDarkMode
                    ? cat.id === 'morning'
                      ? Colors.WorkDarkBorder
                      : cat.id === 'mindful'
                      ? Colors.LavenderPurple
                      : Colors.AccentAmber
                    : cat.borderColor;
                  const iconWrapBg = isDarkMode
                    ? cat.id === 'morning'
                      ? Colors.WorkDarkIconBg
                      : cat.id === 'mindful'
                      ? Colors.MindfulDarkIconBg
                      : Colors.EventDarkIconBgDeep
                    : Colors.PureWhite;

                  return (
                    <TouchableOpacity
                      key={cat.id}
                      activeOpacity={0.85}
                      onPress={() => setCategory(cat.id)}
                      style={[
                        styles.categoryCardExact,
                        {
                          backgroundColor: cardBg,
                          width: categoryCardWidth,
                          shadowColor: cat.shadowColor,
                        },
                        isSelected && [
                          styles.categoryCardExactSelected,
                          {
                            borderColor: cardBorder,
                          },
                        ],
                      ]}
                    >
                      <View style={styles.categoryCardTop}>
                        <View
                          style={[
                            styles.categoryIconWrap,
                            {
                              backgroundColor: iconWrapBg,
                              borderColor: cardBorder,
                              shadowColor: cat.shadowColor,
                            },
                          ]}
                        >
                          <CatIcon
                            size={16}
                            color={
                              isDarkMode
                                ? cat.id === 'morning'
                                  ? Colors.AccentYellow
                                  : cat.id === 'mindful'
                                  ? Colors.LavenderPurple
                                  : Colors.AccentAmber
                                : cat.checkColor
                            }
                            strokeWidth={2.4}
                          />
                        </View>
                        {isSelected ? (
                          <View
                            style={[
                              styles.categoryFloatingCheckbox,
                              styles.categoryFloatingCheckboxChecked,
                              {
                                borderColor: cat.accentColor,
                                backgroundColor: cardBg,
                                shadowColor: cat.shadowColor,
                              },
                            ]}
                          >
                            <Check
                              size={12}
                              color={
                                isDarkMode
                                  ? Colors.AccentGreen
                                  : cat.checkColor
                              }
                              strokeWidth={3}
                            />
                          </View>
                        ) : (
                          <View
                            style={[
                              styles.categoryFloatingCheckbox,
                              styles.categoryFloatingCheckboxUnchecked,
                              {
                                borderColor: cardBorder,
                                backgroundColor: isDarkMode
                                  ? Colors.DarkCheckboxUnchecked
                                  : withAlpha(Colors.PureWhite, 0.4),
                              },
                            ]}
                          />
                        )}
                      </View>

                      <View style={styles.categoryCardBottom}>
                        <Text
                          style={[
                            styles.categoryCardLabel,
                            isDarkMode && { color: Colors.PureWhite },
                          ]}
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

            {/* Frequency & Cadence Selector */}
            <View style={styles.sectionBlock}>
              <View style={styles.sectionHeaderRow}>
                <Text
                  style={[
                    styles.sectionHeading,
                    isDarkMode && { color: textPrimary },
                  ]}
                >
                  Ritual Frequency
                </Text>
                <Badge
                  variant="green"
                  size="sm"
                  label="Streak Cadence"
                  icon={<RotateCw size={11} color={Colors.GreenGracious} />}
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
                        isDarkMode &&
                          !isSelected && {
                            backgroundColor: Colors.DarkCardBackground,
                            borderColor: Colors.CarbonSlate,
                          },
                        isSelected && styles.frequencyChipSelected,
                      ]}
                    >
                      <Text
                        style={[
                          styles.frequencyChipText,
                          isDarkMode && !isSelected && { color: Colors.SteelMist },
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

            {/* Ideal Time of Day */}
            <View style={styles.sectionBlock}>
              <View style={styles.sectionHeaderRow}>
                <Text
                  style={[
                    styles.sectionHeading,
                    isDarkMode && { color: textPrimary },
                  ]}
                >
                  Ideal Time of Day
                </Text>
                <Text
                  style={[
                    styles.sectionSubtext,
                    isDarkMode && { color: textSecondary },
                  ]}
                >
                  Trigger cue
                </Text>
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
                        isDarkMode &&
                          !isPresetSelected && {
                            backgroundColor: Colors.DarkCardBackground,
                            borderColor: Colors.CarbonSlate,
                          },
                        isPresetSelected && styles.quickTimeChipSelected,
                      ]}
                    >
                      <Text
                        style={[
                          styles.quickTimeChipText,
                          isDarkMode &&
                            !isPresetSelected && { color: Colors.SteelMist },
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
                      <Clock
                        size={16}
                        color={Colors.PeriwinkleSoft}
                        strokeWidth={2.4}
                      />
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

            {/* Spoken Voice Nudge (Voice nudge) */}
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
                    Audio chime when ritual time arrives
                  </Text>
                </View>
              </View>

              <Switch
                value={voiceNudgeEnabled}
                onValueChange={setVoiceNudgeEnabled}
                trackColor={{
                  false: isDarkMode ? Colors.CarbonSlate : Colors.WarmSwitchTrackOff,
                  true: isDarkMode ? Colors.LavenderPurple : Colors.MidnightCharcoal,
                }}
                thumbColor={Colors.PureWhite}
                ios_backgroundColor={
                  isDarkMode ? Colors.CarbonSlate : Colors.WarmSwitchTrackOff
                }
              />
            </View>

            {/* Delete Habit Action (Only when editing) */}
            {isEditing && onDeleteHabit && (
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
                  accessibilityLabel="Delete Habit"
                >
                  <Trash2
                    size={16}
                    color={Colors.CategoryRedAccent}
                    strokeWidth={2.2}
                  />
                  <Text style={styles.deleteCardBtnText}>
                    Delete Daily Ritual
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </Animated.ScrollView>

          {/* Common theme-styled bottom dock */}
          <ModalBottomBar
            onClose={onClose}
            onSubmit={handleSave}
            submitText={isEditing ? 'Save Changes' : 'Create Habit Flow'}
            createAnim={createAnim}
          />
        </KeyboardAvoidingView>

        {/* Time picker modal */}
        <UnifiedSchedulePickerModal
          visible={showTimePicker}
          mode="time"
          value={timeValue}
          onChange={onTimeChange}
          onClose={() => setShowTimePicker(false)}
          title="Target Time"
        />
      </View>
    </Modal>
  );
};

// Styles

const styles = StyleSheet.create({
  canvasContainer: {
    flex: 1,
    backgroundColor: Colors.CreamSurfaceAlt,
  },

  // Header Crest Badge (Centered on Top Border)
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

  // Scroll Area
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: ResponsivePixels.size20,
  },

  // Primary Card (2-Layer Card Wrapper Pattern)
  primaryCardWrapper: {
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
  primaryCard: {
    backgroundColor: Colors.PureWhite,
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

  // General Section Block
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
    color: Colors.MutedSlateSubtext,
  },

  // Category Cards (Category cards)
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
    borderColor: withAlpha(Colors.PureWhite, 0.4),
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
    borderColor: Colors.PureWhite,
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
    backgroundColor: Colors.PureWhite,
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
    color: Colors.RegiusInk,
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
    backgroundColor: Colors.PureWhite,
  },
  categoryFloatingCheckboxUnchecked: {
    backgroundColor: Colors.PureWhite,
    borderColor: Colors.WarmCheckboxBorder,
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

  // Frequency Chips
  frequencyRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  frequencyChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 22,
    backgroundColor: Colors.PureWhite,
    borderWidth: 1.5,
    borderColor: Colors.WarmChipBorder,
    borderBottomWidth: 3.5,
    borderBottomColor: Colors.WarmHaloBottomBevel,
    ...Platform.select({
      ios: {
        shadowColor: Colors.WarmUmberShadow,
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
    borderTopColor: Colors.DarkChipBevelTop,
    borderLeftColor: Colors.DarkChipBorder,
    borderRightColor: Colors.DarkChipBorder,
    borderBottomWidth: 3.5,
    borderBottomColor: Colors.DarkChipBevelAbyss,
    ...Platform.select({
      ios: {
        shadowColor: Colors.PureBlack,
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
    color: Colors.CharcoalStoneText,
    letterSpacing: -0.1,
  },
  frequencyChipTextSelected: {
    color: Colors.PureWhite,
    fontFamily: Fonts.poppins.bold,
  },

  // Quick Time Presets
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
    backgroundColor: Colors.PureWhite,
    borderWidth: 1.2,
    borderColor: Colors.WarmChipBorder,
    borderBottomWidth: 2.5,
    borderBottomColor: Colors.WarmHaloBottomBevel,
  },
  quickTimeChipSelected: {
    backgroundColor: Colors.NeroBlack,
    borderColor: Colors.DarkChipBorder,
    borderBottomColor: Colors.DarkChipBevelAbyss,
  },
  quickTimeChipText: {
    fontFamily: Fonts.poppins.medium,
    fontSize: 11.5,
    color: Colors.SlateAshText,
  },
  quickTimeChipTextSelected: {
    color: Colors.PureWhite,
    fontFamily: Fonts.poppins.bold,
  },

  // Schedule pickers
  scheduleContainerCard: {
    backgroundColor: Colors.PureWhite,
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: Colors.RingBorder,
    padding: 8,
    ...Platform.select({
      ios: {
        shadowColor: Colors.PureBlack,
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
        shadowColor: Colors.PureBlack,
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
    borderColor: Colors.DarkSegmentedShellBorder,
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
    backgroundColor: withAlpha(Colors.PeriwinkleSoft, 0.12),
    borderColor: withAlpha(Colors.PeriwinkleSoft, 0.25),
  },
  magicScheduleTextGroup: {
    flex: 1,
  },
  magicScheduleSmallLabel: {
    fontFamily: Fonts.poppins.bold,
    fontSize: 9.5,
    color: Colors.TabInactiveSilver,
    letterSpacing: 0.6,
  },
  magicScheduleValue: {
    fontFamily: Fonts.poppins.bold,
    fontSize: 14,
    color: Colors.PureWhite,
    marginTop: 1,
  },

  // Voice Nudge Card
  voiceNudgeCard: {
    backgroundColor: Colors.PureWhite,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: Colors.RingBorder,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
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

  // Delete Button Section
  deleteSection: {
    marginBottom: 24,
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
    fontFamily: Fonts.poppins.bold,
    fontSize: 13.5,
    color: Colors.CategoryRedAccent,
  },
});

export default AddHabitModal;
