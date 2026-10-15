import React, { useState, useRef } from 'react';
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
  Calendar,
  Clock,
  Bell,
  RotateCw,
  Volume2,
  Play,
  AlertTriangle,
  User,
  ArrowRight,
  ChevronDown,
  PlusCircle,
  Activity,
  PenLine,
} from 'lucide-react-native';
import Svg, { Path } from 'react-native-svg';
import { Fonts } from '../../Theme/fonts';
import { Colors } from '../../Assets/StyleUtilities/Colors';
import { SVGS } from '../../Assets/Images';
import { Badge } from '../../Common/Badge';
import ResponsivePixels from '../../Assets/StyleUtilities/ResponsivePixels';
import { useTaskReminder } from '../../Context/TaskReminderContext';

// ─── Inline Office Bag SVG ────────────────────────────────────────────────────

const OfficeBagIcon: React.FC<{ width?: number; height?: number }> = ({
  width = 22,
  height = 22,
}) => (
  <Svg width={width} height={height} viewBox="23 19 24 24" fill="none">
    <Path
      opacity={0.4}
      d="M25.0002 30.0785C25.0502 32.4165 25.1902 36.4155 25.2102 36.8565C25.2812 37.7995 25.6422 38.7525 26.2042 39.4245C26.9862 40.3675 27.9492 40.7885 29.2922 40.7885C31.1482 40.7985 33.1942 40.7985 35.1812 40.7985C37.1762 40.7985 39.1122 40.7985 40.7472 40.7885C42.0712 40.7885 43.0642 40.3565 43.8362 39.4245C44.3982 38.7525 44.7592 37.7895 44.8102 36.8565C44.8302 36.4855 44.9302 32.1445 44.9902 30.0785H25.0002Z"
      fill="#F5C518"
    />
    <Path
      d="M34.2454 34.3842V35.6782C34.2454 36.0922 34.5814 36.4282 34.9954 36.4282C35.4094 36.4282 35.7454 36.0922 35.7454 35.6782V34.3842C35.7454 33.9702 35.4094 33.6342 34.9954 33.6342C35.4094 33.6342 34.2454 33.9702 34.2454 34.3842Z"
      fill="#F5C518"
    />
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M33.2113 33.5564C33.1113 33.9194 32.7623 34.1514 32.3843 34.1014C29.8333 33.7454 27.3953 32.8404 25.3373 31.4814C25.1263 31.3434 25.0003 31.1074 25.0003 30.8554V27.3894C25.0003 25.2894 26.7123 23.5814 28.8173 23.5814H30.7843C30.9723 22.1294 32.2023 21.0004 33.7043 21.0004H36.2863C37.7873 21.0004 39.0183 22.1294 39.2063 23.5814H41.1833C43.2823 23.5814 44.9903 25.2894 44.9903 27.3894V30.8554C44.9903 31.1074 44.8633 31.3424 44.6543 31.4814C42.5923 32.8464 40.1443 33.7554 37.5763 34.1104C37.5413 34.1154 37.5073 34.1174 37.4733 34.1174C37.1343 34.1174 36.8313 33.8884 36.7463 33.5524C36.5443 32.7564 35.8213 32.1994 34.9903 32.1994C34.1483 32.1994 33.4333 32.7444 33.2113 33.5564ZM36.2863 22.5004H33.7043C33.0313 22.5004 32.4693 22.9604 32.3013 23.5814H37.6883C37.5203 22.9604 36.9583 22.5004 36.2863 22.5004Z"
      fill="#F5C518"
    />
  </Svg>
);

// ─── Categories Setup ─────────────────────────────────────────────────────────

interface CategoryItem {
  id: string;
  label: string;
  status: string;
  bgColor: string;
  borderColor: string;
  accentColor: string;
  Icon: React.ComponentType<any>;
}

const CATEGORIES: CategoryItem[] = [
  {
    id: 'works',
    label: 'Works',
    status: 'Active',
    bgColor: '#FFFCEB',
    borderColor: '#FFF5B8',
    accentColor: '#F5C518',
    Icon: OfficeBagIcon,
  },
  {
    id: 'sport',
    label: 'Sport',
    status: 'Daily',
    bgColor: '#EDFDF5',
    borderColor: '#C6FFDD',
    accentColor: '#52D22E',
    Icon: SVGS.FloatHeart,
  },
  {
    id: 'habits',
    label: 'Habits',
    status: 'Routine',
    bgColor: '#EFF2FE',
    borderColor: '#D8DBFF',
    accentColor: '#8383D6',
    Icon: SVGS.FloatPicture,
  },
];

const REMIND_BEFORE_OPTIONS = [
  'At time of event',
  '5 mins before',
  '15 mins before',
  '1 hour before',
];

const REPEAT_OPTIONS = ['Never', 'Daily', 'Weekdays', 'Weekly'];

const DATE_OPTIONS = [
  { label: 'Today, Oct 14', subtext: 'Occurs on Monday' },
  { label: 'Tomorrow, Oct 15', subtext: 'Occurs on Tuesday' },
  { label: 'This Weekend', subtext: 'Occurs on Saturday' },
  { label: 'Next Monday, Oct 21', subtext: 'Occurs next week' },
];

export interface AddReminderScreenProps {
  onClose?: () => void;
  navigation?: any;
}

export const AddReminderScreen: React.FC<AddReminderScreenProps> = ({
  onClose,
  navigation,
}) => {
  const insets = useSafeAreaInsets();
  const { addReminder } = useTaskReminder();

  // Form State
  const [reminderTitle, setReminderTitle] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('works');

  // Time & Drum State
  const [hour, setHour] = useState<number>(4);
  const [minute, setMinute] = useState<number>(30);
  const [meridiem, setMeridiem] = useState<'AM' | 'PM'>('PM');

  // Date State
  const [selectedDate, setSelectedDate] = useState<{
    label: string;
    subtext: string;
  }>(DATE_OPTIONS[0]);

  // Options State
  const [remindBefore, setRemindBefore] = useState<string>('5 mins before');
  const [repeatCycle, setRepeatCycle] = useState<string>('Daily');
  const [urgentAlarm, setUrgentAlarm] = useState<boolean>(false);
  const [isPlayingPreview, setIsPlayingPreview] = useState<boolean>(false);

  // Modals
  const [showDateModal, setShowDateModal] = useState<boolean>(false);
  const [showCustomCategoryModal, setShowCustomCategoryModal] =
    useState<boolean>(false);
  const [customCategoryText, setCustomCategoryText] = useState<string>('');

  // Button Animation
  const createAnim = useRef(new Animated.Value(1)).current;

  const handleBack = () => {
    if (onClose) {
      onClose();
    } else if (navigation?.canGoBack?.()) {
      navigation.goBack();
    }
  };

  const handleSaveReminder = () => {
    if (!reminderTitle.trim()) return;

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

    const formattedHour = hour.toString().padStart(2, '0');
    const formattedMinute = minute.toString().padStart(2, '0');
    const timeString = `${formattedHour}:${formattedMinute} ${meridiem}`;

    addReminder({
      title: reminderTitle.trim(),
      category: selectedCategory,
      time: timeString,
      date: selectedDate.label,
      repeat: repeatCycle,
      remindBefore,
      sound: 'Gentle Bell',
      urgentAlarm,
    });

    handleBack();
  };

  const handleCycleHour = () => {
    setHour(prev => (prev >= 12 ? 1 : prev + 1));
  };

  const handleCycleMinute = () => {
    setMinute(prev => (prev >= 55 ? 0 : prev + 5));
  };

  const handlePreviewSound = () => {
    setIsPlayingPreview(true);
    setTimeout(() => {
      setIsPlayingPreview(false);
    }, 1500);
  };

  return (
    <View style={styles.canvasContainer}>
      <StatusBar barStyle="dark-content" />

      {/* Top Safe Area Spacing */}
      <View
        style={{
          height: Math.max(
            insets.top,
            Platform.OS === 'ios' ? 48 : StatusBar.currentHeight || 12,
          ),
          backgroundColor: '#FAF8F5',
        }}
      />

      {/* ─── Top Header Bar ────────────────────────────────────────────── */}
      <View style={styles.topHeader}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={handleBack}
          style={styles.backBtn}
          accessibilityLabel="Go back"
        >
          <ArrowLeft
            size={20}
            color={Colors.MidnightCharcoal}
            strokeWidth={2.4}
          />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Task Creator</Text>

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
          {/* ─── Header Action Row (Cancel / New Reminder / Save) ──────── */}
          <View style={styles.actionRow}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={handleBack}
              style={styles.cancelActionBtn}
            >
              <Text style={styles.cancelActionText}>Cancel</Text>
            </TouchableOpacity>

            <View style={styles.actionCenterTitleRow}>
              <View style={styles.activePulseDot} />
              <Text style={styles.actionCenterTitle}>New Reminder</Text>
            </View>

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={handleSaveReminder}
              style={styles.saveActionPill}
            >
              <Text style={styles.saveActionText}>Save</Text>
            </TouchableOpacity>
          </View>

          {/* ─── Reminder Title Input Card ─────────────────────────────── */}
          <View style={styles.titleInputCard}>
            <Text style={styles.titleInputSubLabel}>
              WHAT DO YOU WANT TO BE REMINDED OF?
            </Text>

            <View style={styles.titleFieldRow}>
              <View style={styles.titleNoteIconWrap}>
                <PenLine size={20} color="#B47804" strokeWidth={2.2} />
              </View>

              <TextInput
                style={styles.titleTextInput}
                placeholder="e.g., Client Follow-up Call"
                placeholderTextColor="#A3A8B1"
                value={reminderTitle}
                onChangeText={setReminderTitle}
                autoFocus={false}
              />
            </View>
          </View>

          {/* ─── Category Focus Selector ───────────────────────────────── */}
          <View style={styles.sectionBlock}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionHeading}>Category Focus</Text>
              <Text style={styles.categoryCountLabel}>1 Selected</Text>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoryScrollTrack}
            >
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
                    <View style={styles.catIconCircle}>
                      <CatIcon width={18} height={18} />
                    </View>

                    <View style={styles.catTextGroup}>
                      <Text style={styles.catLabel}>{cat.label}</Text>
                      <Text style={styles.catStatus}>{cat.status}</Text>
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

              {/* + Custom Button */}
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setShowCustomCategoryModal(true)}
                style={styles.customCategoryCard}
              >
                <PlusCircle
                  size={18}
                  color={Colors.MidnightCharcoal}
                  strokeWidth={2}
                />
                <Text style={styles.customCategoryText}>Custom</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>

          {/* ─── Scheduled Timing Section (Digital Drum Selector) ──────── */}
          <View style={styles.scheduleCard}>
            <View style={styles.scheduleCardHeader}>
              <Text style={styles.sectionHeading}>Scheduled Timing</Text>
              <Badge
                variant="green"
                size="sm"
                label="Local GMT+1"
                icon={<Clock size={11} color="#1B9A72" />}
              />
            </View>

            {/* Digital Drum Selector */}
            <View style={styles.digitalDrumContainer}>
              <View style={styles.drumDisplayRow}>
                {/* Hour Box */}
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={handleCycleHour}
                  style={styles.drumBox}
                >
                  <Text style={styles.drumDigits}>
                    {hour.toString().padStart(2, '0')}
                  </Text>
                  <Text style={styles.drumBoxLabel}>HOUR</Text>
                </TouchableOpacity>

                <Text style={styles.drumColon}>:</Text>

                {/* Minute Box */}
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={handleCycleMinute}
                  style={styles.drumBox}
                >
                  <Text style={styles.drumDigits}>
                    {minute.toString().padStart(2, '0')}
                  </Text>
                  <Text style={styles.drumBoxLabel}>MIN</Text>
                </TouchableOpacity>
              </View>

              {/* AM / PM Segmented Toggle */}
              <View style={styles.meridiemContainer}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => setMeridiem('AM')}
                  style={[
                    styles.meridiemBtn,
                    meridiem === 'AM' && styles.meridiemBtnActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.meridiemText,
                      meridiem === 'AM' && styles.meridiemTextActive,
                    ]}
                  >
                    AM
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => setMeridiem('PM')}
                  style={[
                    styles.meridiemBtn,
                    meridiem === 'PM' && styles.meridiemBtnActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.meridiemText,
                      meridiem === 'PM' && styles.meridiemTextActive,
                    ]}
                  >
                    PM
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Date Row Inside Timing Card */}
            <View style={styles.dateRow}>
              <View style={styles.dateRowLeft}>
                <View style={styles.calendarIconTile}>
                  <Calendar size={20} color="#B47804" strokeWidth={2.2} />
                </View>

                <View style={styles.dateTextGroup}>
                  <Text style={styles.dateLabel}>{selectedDate.label}</Text>
                  <Text style={styles.dateSubtext}>{selectedDate.subtext}</Text>
                </View>
              </View>

              <TouchableOpacity
                activeOpacity={0.75}
                onPress={() => setShowDateModal(true)}
                style={styles.changeDateBtn}
              >
                <Text style={styles.changeDateBtnText}>Change</Text>
                <ChevronDown size={14} color="#1F2228" strokeWidth={2.2} />
              </TouchableOpacity>
            </View>
          </View>

          {/* ─── Notification & Alert Customization Card ───────────────── */}
          <View style={styles.alertCustomizationCard}>
            {/* Remind Me Before */}
            <View style={styles.alertSubSection}>
              <View style={styles.alertSectionHeader}>
                <Text style={styles.alertSectionTitle}>Remind Me Before</Text>
                <Bell size={18} color="#F5C518" strokeWidth={2.2} />
              </View>

              <View style={styles.remindBeforeGrid}>
                {REMIND_BEFORE_OPTIONS.map(opt => {
                  const isSelected = remindBefore === opt;
                  return (
                    <TouchableOpacity
                      key={opt}
                      activeOpacity={0.8}
                      onPress={() => setRemindBefore(opt)}
                      style={[
                        styles.remindOptionBtn,
                        isSelected && styles.remindOptionBtnActive,
                      ]}
                    >
                      <Text
                        style={[
                          styles.remindOptionText,
                          isSelected && styles.remindOptionTextActive,
                        ]}
                      >
                        {opt}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Repeat Cycle */}
            <View style={styles.alertSubSection}>
              <View style={styles.alertSectionHeader}>
                <Text style={styles.alertSectionTitle}>Repeat Cycle</Text>
                <RotateCw size={18} color="#52D22E" strokeWidth={2.2} />
              </View>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.repeatPillsRow}
              >
                {REPEAT_OPTIONS.map(rep => {
                  const isSelected = repeatCycle === rep;
                  return (
                    <TouchableOpacity
                      key={rep}
                      activeOpacity={0.8}
                      onPress={() => setRepeatCycle(rep)}
                      style={[
                        styles.repeatPill,
                        isSelected && styles.repeatPillActive,
                      ]}
                    >
                      <Text
                        style={[
                          styles.repeatPillText,
                          isSelected && styles.repeatPillTextActive,
                        ]}
                      >
                        {rep}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>

            {/* Sound & Haptics */}
            <View style={styles.soundRow}>
              <View style={styles.soundLeftGroup}>
                <View style={styles.soundIconTile}>
                  <Volume2
                    size={18}
                    color={Colors.MidnightCharcoal}
                    strokeWidth={2}
                  />
                </View>

                <View style={styles.soundTextGroup}>
                  <Text style={styles.soundTitle}>Gentle Bell</Text>
                  <Text style={styles.soundSubtitle}>Default Soft Chime</Text>
                </View>
              </View>

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={handlePreviewSound}
                style={[
                  styles.previewSoundBtn,
                  isPlayingPreview && styles.previewSoundBtnPlaying,
                ]}
              >
                <Play size={14} color="#1B9A72" strokeWidth={2.4} />
                <Text style={styles.previewSoundText}>
                  {isPlayingPreview ? 'Playing...' : 'Preview'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Urgent Alarm Toggle Row */}
            <View style={styles.urgentAlarmRow}>
              <View style={styles.urgentAlarmLeft}>
                <AlertTriangle size={20} color="#FF3B30" strokeWidth={2.2} />
                <View style={styles.urgentTextGroup}>
                  <Text style={styles.urgentTitle}>Urgent Alarm</Text>
                  <Text style={styles.urgentSubtitle}>
                    Override Silent Mode & Ring aloud
                  </Text>
                </View>
              </View>

              <Switch
                value={urgentAlarm}
                onValueChange={setUrgentAlarm}
                trackColor={{
                  false: '#E4E2DD',
                  true: Colors.MidnightCharcoal,
                }}
                thumbColor="#FFFFFF"
                ios_backgroundColor="#E4E2DD"
              />
            </View>
          </View>
        </ScrollView>

        {/* ─── Bottom Floating Hero Action CTA ───────────────────────── */}
        <View
          style={[
            styles.bottomStickyCta,
            { paddingBottom: Math.max(insets.bottom, 16) + 6 },
          ]}
        >
          <Animated.View style={{ transform: [{ scale: createAnim }] }}>
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={handleSaveReminder}
              style={[
                styles.createReminderHeroBtn,
                !reminderTitle.trim() && styles.createReminderHeroBtnDisabled,
              ]}
              disabled={!reminderTitle.trim()}
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
      </KeyboardAvoidingView>

      {/* ─── Quick Date Selection Modal ──────────────────────────────── */}
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
                <Text style={styles.modalHeading}>Select Reminder Date</Text>
                {DATE_OPTIONS.map(d => {
                  const isSelected = selectedDate.label === d.label;
                  return (
                    <TouchableOpacity
                      key={d.label}
                      activeOpacity={0.7}
                      onPress={() => {
                        setSelectedDate(d);
                        setShowDateModal(false);
                      }}
                      style={[
                        styles.modalOptionRow,
                        isSelected && styles.modalOptionRowActive,
                      ]}
                    >
                      <View>
                        <Text
                          style={[
                            styles.modalOptionText,
                            isSelected && styles.modalOptionTextActive,
                          ]}
                        >
                          {d.label}
                        </Text>
                        <Text style={styles.modalOptionSubtext}>
                          {d.subtext}
                        </Text>
                      </View>
                      {isSelected && (
                        <Check
                          size={18}
                          color={Colors.MidnightCharcoal}
                          strokeWidth={2.5}
                        />
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* ─── Custom Category Modal ───────────────────────────────────── */}
      <Modal
        visible={showCustomCategoryModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowCustomCategoryModal(false)}
      >
        <TouchableWithoutFeedback
          onPress={() => setShowCustomCategoryModal(false)}
        >
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalCard}>
                <Text style={styles.modalHeading}>Add Custom Category</Text>
                <TextInput
                  style={styles.modalCustomInput}
                  placeholder="e.g., Finance, Family, Studies"
                  placeholderTextColor="#A3A8B1"
                  value={customCategoryText}
                  onChangeText={setCustomCategoryText}
                  autoFocus
                />
                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={() => {
                    if (customCategoryText.trim()) {
                      setSelectedCategory(
                        customCategoryText.trim().toLowerCase(),
                      );
                    }
                    setShowCustomCategoryModal(false);
                  }}
                  style={styles.modalConfirmBtn}
                >
                  <Text style={styles.modalConfirmBtnText}>Apply</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
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

  // Action Row (Cancel / New Reminder / Save)
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingTop: 4,
  },
  cancelActionBtn: {
    paddingVertical: 6,
    paddingHorizontal: 4,
  },
  cancelActionText: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: 14,
    color: '#7E838F',
  },
  actionCenterTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  activePulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#52D22E',
  },
  actionCenterTitle: {
    fontFamily: Fonts.ranade.bold,
    fontSize: 19,
    color: Colors.MidnightCharcoal,
  },
  saveActionPill: {
    backgroundColor: Colors.MidnightCharcoal,
    borderRadius: 50,
    paddingHorizontal: 18,
    paddingVertical: 7.5,
    ...Platform.select({
      ios: {
        shadowColor: Colors.MidnightCharcoal,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.18,
        shadowRadius: 6,
      },
      android: {
        elevation: 2.5,
      },
    }),
  },
  saveActionText: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: 13,
    color: '#FFFFFF',
  },

  // Title Input Card
  titleInputCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: '#E8E2D5',
    padding: 16,
    marginBottom: 18,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.04,
        shadowRadius: 12,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  titleInputSubLabel: {
    fontFamily: Fonts.poppins.bold,
    fontSize: 10,
    letterSpacing: 0.8,
    color: '#7E838F',
    marginBottom: 8,
  },
  titleFieldRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  titleNoteIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#FFF8D0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleTextInput: {
    flex: 1,
    fontFamily: Fonts.ranade.bold,
    fontSize: 18,
    color: Colors.MidnightCharcoal,
    padding: 0,
  },

  // Section Block
  sectionBlock: {
    marginBottom: 18,
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
    fontSize: 15,
    color: Colors.MidnightCharcoal,
  },
  categoryCountLabel: {
    fontFamily: Fonts.poppins.bold,
    fontSize: 11,
    color: '#B47804',
  },

  // Category Focus Scroll Track
  categoryScrollTrack: {
    flexDirection: 'row',
    gap: 10,
    paddingBottom: 4,
  },
  categoryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderTopRightRadius: 36, // Signature Regius Asymmetric Corner
    borderWidth: 2,
    position: 'relative',
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 6,
      },
      android: {
        elevation: 1.5,
      },
    }),
  },
  categoryCardSelected: {
    borderWidth: 2,
    ...Platform.select({
      ios: {
        shadowColor: Colors.MidnightCharcoal,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.14,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  catIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
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
  catTextGroup: {
    justifyContent: 'center',
  },
  catLabel: {
    fontFamily: Fonts.poppins.bold,
    fontSize: 13.5,
    color: Colors.MidnightCharcoal,
  },
  catStatus: {
    fontFamily: Fonts.poppins.regular,
    fontSize: 11,
    color: '#7E838F',
  },
  catBottomAccentPill: {
    position: 'absolute',
    bottom: 0,
    left: 14,
    right: 14,
    height: 3,
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2,
  },
  customCategoryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: '#FAF8F5',
    borderWidth: 1.2,
    borderColor: '#E8E2D5',
  },
  customCategoryText: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: 13,
    color: '#7E838F',
  },

  // Scheduled Timing Section Card
  scheduleCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: '#E8E2D5',
    padding: 16,
    marginBottom: 18,
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
  scheduleCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  digitalDrumContainer: {
    backgroundColor: '#FAF8F5',
    borderRadius: 18,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 14,
  },
  drumDisplayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  drumBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingVertical: 8,
    paddingHorizontal: 12,
    minWidth: 62,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
      },
      android: {
        elevation: 1.5,
      },
    }),
  },
  drumDigits: {
    fontFamily: Fonts.ranade.bold,
    fontSize: 32,
    color: Colors.MidnightCharcoal,
    lineHeight: 38,
  },
  drumBoxLabel: {
    fontFamily: Fonts.poppins.bold,
    fontSize: 9.5,
    color: '#7E838F',
    letterSpacing: 0.8,
    marginTop: 2,
  },
  drumColon: {
    fontFamily: Fonts.ranade.bold,
    fontSize: 26,
    color: '#A3A8B1',
    lineHeight: 32,
  },
  meridiemContainer: {
    backgroundColor: '#EDE8DF',
    borderRadius: 10,
    padding: 3,
    gap: 3,
  },
  meridiemBtn: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  meridiemBtnActive: {
    backgroundColor: Colors.MidnightCharcoal,
  },
  meridiemText: {
    fontFamily: Fonts.poppins.bold,
    fontSize: 11,
    color: '#7E838F',
  },
  meridiemTextActive: {
    color: '#FFFFFF',
  },

  // Date Row Inside Schedule Card
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F3EFE6',
  },
  dateRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  calendarIconTile: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#FFF8D0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateTextGroup: {
    flex: 1,
  },
  dateLabel: {
    fontFamily: Fonts.poppins.bold,
    fontSize: 14,
    color: Colors.MidnightCharcoal,
  },
  dateSubtext: {
    fontFamily: Fonts.poppins.regular,
    fontSize: 11.5,
    color: '#7E838F',
  },
  changeDateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FAF8F5',
    borderWidth: 1,
    borderColor: '#E8E2D5',
    borderRadius: 50,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  changeDateBtnText: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: 12,
    color: Colors.MidnightCharcoal,
  },

  // Notification & Alert Customization Card
  alertCustomizationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: '#E8E2D5',
    padding: 16,
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
  alertSubSection: {
    marginBottom: 16,
  },
  alertSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  alertSectionTitle: {
    fontFamily: Fonts.poppins.bold,
    fontSize: 14,
    color: Colors.MidnightCharcoal,
  },
  remindBeforeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  remindOptionBtn: {
    width: '48.5%',
    backgroundColor: '#FAF8F5',
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  remindOptionBtnActive: {
    backgroundColor: Colors.MidnightCharcoal,
  },
  remindOptionText: {
    fontFamily: Fonts.poppins.medium,
    fontSize: 12,
    color: '#454A53',
    textAlign: 'center',
  },
  remindOptionTextActive: {
    fontFamily: Fonts.poppins.bold,
    color: '#FFFFFF',
  },
  repeatPillsRow: {
    flexDirection: 'row',
    gap: 8,
    paddingBottom: 2,
  },
  repeatPill: {
    backgroundColor: '#FAF8F5',
    borderRadius: 50,
    paddingVertical: 7,
    paddingHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  repeatPillActive: {
    backgroundColor: Colors.MidnightCharcoal,
  },
  repeatPillText: {
    fontFamily: Fonts.poppins.medium,
    fontSize: 12,
    color: '#454A53',
  },
  repeatPillTextActive: {
    fontFamily: Fonts.poppins.bold,
    color: '#FFFFFF',
  },
  soundRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3EFE6',
  },
  soundLeftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  soundIconTile: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#FAF8F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  soundTextGroup: {
    flex: 1,
  },
  soundTitle: {
    fontFamily: Fonts.poppins.bold,
    fontSize: 13.5,
    color: Colors.MidnightCharcoal,
  },
  soundSubtitle: {
    fontFamily: Fonts.poppins.regular,
    fontSize: 11,
    color: '#7E838F',
  },
  previewSoundBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#E8FDF0',
    borderWidth: 1,
    borderColor: '#82E8A6',
    borderRadius: 50,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  previewSoundBtnPlaying: {
    backgroundColor: '#C6FFDD',
  },
  previewSoundText: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: 12,
    color: '#1B9A72',
  },
  urgentAlarmRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FAF8F5',
    borderRadius: 14,
    padding: 12,
    marginTop: 4,
  },
  urgentAlarmLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  urgentTextGroup: {
    flex: 1,
  },
  urgentTitle: {
    fontFamily: Fonts.poppins.bold,
    fontSize: 13.5,
    color: Colors.MidnightCharcoal,
  },
  urgentSubtitle: {
    fontFamily: Fonts.poppins.regular,
    fontSize: 11,
    color: '#7E838F',
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
  createReminderHeroBtn: {
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
  createReminderHeroBtnDisabled: {
    backgroundColor: '#B5BAC2',
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
    paddingVertical: 12,
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
    color: Colors.MidnightCharcoal,
  },
  modalOptionTextActive: {
    fontFamily: Fonts.poppins.bold,
  },
  modalOptionSubtext: {
    fontFamily: Fonts.poppins.regular,
    fontSize: 11.5,
    color: '#7E838F',
    marginTop: 2,
  },
  modalCustomInput: {
    fontFamily: Fonts.poppins.medium,
    fontSize: 15,
    color: Colors.MidnightCharcoal,
    borderWidth: 1.5,
    borderColor: '#E8E2D5',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 16,
  },
  modalConfirmBtn: {
    backgroundColor: Colors.MidnightCharcoal,
    borderRadius: 50,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalConfirmBtnText: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: 14,
    color: '#FFFFFF',
  },
});

export default AddReminderScreen;
