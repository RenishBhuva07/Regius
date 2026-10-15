import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  FlatList,
  StatusBar,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Bell,
  Clock,
  Filter,
  Check,
  Plus,
  CalendarCheck,
  Volume2,
  VolumeX,
} from 'lucide-react-native';
import Svg, { Path } from 'react-native-svg';
import { Typography } from '../../Theme/Typographys';
import { Fonts } from '../../Theme/fonts';
import { Colors } from '../../Assets/StyleUtilities/Colors';
import { SVGS } from '../../Assets/Images';
import ResponsivePixels from '../../Assets/StyleUtilities/ResponsivePixels';
import { useTaskReminder } from '../../Context/TaskReminderContext';
import { KokoroTTSService } from '../../Services/Kokoro/KokoroTTSService';

// ─── Inline SVG for Office Bag ────────────────────────────────────────────────
const OfficeBagIcon: React.FC<{ width?: number; height?: number }> = ({
  width = 24,
  height = 24,
}) => (
  <Svg width={width} height={height} viewBox="23 19 24 24" fill="none">
    <Path
      opacity={0.4}
      d="M25.0002 30.0785C25.0502 32.4165 25.1902 36.4155 25.2102 36.8565C25.2812 37.7995 25.6422 38.7525 26.2042 39.4245C26.9862 40.3675 27.9492 40.7885 29.2922 40.7885C31.1482 40.7985 33.1942 40.7985 35.1812 40.7985C37.1762 40.7985 39.1122 40.7985 40.7472 40.7885C42.0712 40.7885 43.0642 40.3565 43.8362 39.4245C44.3982 38.7525 44.7592 37.7895 44.8102 36.8565C44.8302 36.4855 44.9302 32.1445 44.9902 30.0785H25.0002Z"
      fill="#8383D6"
    />
    <Path
      d="M34.2454 34.3842V35.6782C34.2454 36.0922 34.5814 36.4282 34.9954 36.4282C35.4094 36.4282 35.7454 36.0922 35.7454 35.6782V34.3842C35.7454 33.9702 35.4094 33.6342 34.9954 33.6342C35.4094 33.6342 34.2454 33.9702 34.2454 34.3842Z"
      fill="#8383D6"
    />
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M33.2113 33.5564C33.1113 33.9194 32.7623 34.1514 32.3843 34.1014C29.8333 33.7454 27.3953 32.8404 25.3373 31.4814C25.1263 31.3434 25.0003 31.1074 25.0003 30.8554V27.3894C25.0003 25.2894 26.7123 23.5814 28.8173 23.5814H30.7843C30.9723 22.1294 32.2023 21.0004 33.7043 21.0004H36.2863C37.7873 21.0004 39.0183 22.1294 39.2063 23.5814H41.1833C43.2823 23.5814 44.9903 25.2894 44.9903 27.3894V30.8554C44.9903 31.1074 44.8633 31.3424 44.6543 31.4814C42.5923 32.8464 40.1443 33.7554 37.5763 34.1104C37.5413 34.1154 37.5073 34.1174 37.4733 34.1174C37.1343 34.1174 36.8313 33.8884 36.7463 33.5524C36.5443 32.7564 35.8213 32.1994 34.9903 32.1994C34.1483 32.1994 33.4333 32.7444 33.2113 33.5564ZM36.2863 22.5004H33.7043C33.0313 22.5004 32.4693 22.9604 32.3013 23.5814H37.6883C37.5203 22.9604 36.9583 22.5004 36.2863 22.5004Z"
      fill="#8383D6"
    />
  </Svg>
);

// ─── Types ───────────────────────────────────────────────────────────────────

type TabKey = 'upcoming' | 'completed';

interface Category {
  id: string;
  label: string;
  count: number;
  bgColor: string;
  borderColor: string;
  shadowColor: string;
  Icon: React.ComponentType<any>;
  accentColor: string;
}

// ─── Initial Data ────────────────────────────────────────────────────────────

const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'daily',
    label: 'Daily',
    count: 3,
    bgColor: '#FFFCEB',
    borderColor: '#FFF5B8',
    shadowColor: '#F5C518',
    Icon: SVGS.FloatHeart,
    accentColor: '#FDD835',
  },
  {
    id: 'work',
    label: 'Work',
    count: 2,
    bgColor: '#EFF2FE',
    borderColor: '#D8DBFF',
    shadowColor: '#8383D6',
    Icon: OfficeBagIcon,
    accentColor: '#8383D6',
  },
  {
    id: 'health',
    label: 'Health',
    count: 4,
    bgColor: '#EDFDF5',
    borderColor: '#C6FFDD',
    shadowColor: '#52D22E',
    Icon: SVGS.FloatPicture,
    accentColor: '#52D22E',
  },
  {
    id: 'events',
    label: 'Events',
    count: 1,
    bgColor: '#FFF3E0',
    borderColor: '#FFE0B2',
    shadowColor: '#FF9800',
    Icon: CalendarCheck,
    accentColor: '#FF9800',
  },
];

// ─── Component ───────────────────────────────────────────────────────────────

const RemindersScreen: React.FC<any> = ({ route }) => {
  const [activeTab, setActiveTab] = useState<TabKey>('upcoming');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const {
    reminders,
    toggleReminder,
    selectedReminders,
    setSelectedReminders,
    openReminderModal,
  } = useTaskReminder();

  const [speakingReminderId, setSpeakingReminderId] = useState<string | null>(null);

  const handleSpeakReminder = async (rem: any, e: any) => {
    e.stopPropagation?.();
    if (speakingReminderId === rem.id) {
      await KokoroTTSService.stop();
      setSpeakingReminderId(null);
    } else {
      setSpeakingReminderId(rem.id);
      const textToSpeak = `Reminder: ${rem.title}. Scheduled for ${rem.time}.`;
      await KokoroTTSService.speak(textToSpeak);
      setTimeout(() => {
        setSpeakingReminderId(prev => (prev === rem.id ? null : prev));
      }, 5000);
    }
  };

  // Trigger from navigation params (e.g. from PlusActionSheet or other routes)
  useEffect(() => {
    if (route?.params?.openAddModal) {
      openReminderModal();
    }
  }, [route?.params, openReminderModal]);

  const selectAll = () => {
    const currentList = displayedReminders;
    const allSelected = currentList.every(r => selectedReminders.has(r.id));
    if (allSelected) {
      setSelectedReminders(prev => {
        const next = new Set(prev);
        currentList.forEach(r => next.delete(r.id));
        return next;
      });
    } else {
      setSelectedReminders(prev => {
        const next = new Set(prev);
        currentList.forEach(r => next.add(r.id));
        return next;
      });
    }
  };

  // Filter reminders based on active tab and category
  const displayedReminders = reminders.filter(r => {
    const isCompleted = r.done || selectedReminders.has(r.id);
    const matchesTab = activeTab === 'completed' ? isCompleted : !isCompleted;
    const matchesCat =
      selectedCategory === 'all' || r.category === selectedCategory;
    return matchesTab && matchesCat;
  });

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar
        barStyle="dark-content"
        {...(Platform.OS === 'android'
          ? { backgroundColor: '#FFFFFF', translucent: true }
          : {})}
      />

      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ── Toggle Tabs (Upcoming / Completed) ── */}
        <View style={styles.toggleContainer}>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => setActiveTab('upcoming')}
            style={[
              styles.toggleTab,
              activeTab === 'upcoming' && styles.toggleTabActive,
            ]}
          >
            <Text
              style={[
                styles.toggleText,
                activeTab === 'upcoming'
                  ? styles.toggleTextActive
                  : styles.toggleTextInactive,
              ]}
            >
              Upcoming
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => setActiveTab('completed')}
            style={[
              styles.toggleTab,
              activeTab === 'completed' && styles.toggleTabActive,
            ]}
          >
            <Text
              style={[
                styles.toggleText,
                activeTab === 'completed'
                  ? styles.toggleTextActive
                  : styles.toggleTextInactive,
              ]}
            >
              Completed
            </Text>
          </TouchableOpacity>
        </View>

        {/* ── Categories Section ── */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <View style={styles.sectionActions}>
            <TouchableOpacity
              activeOpacity={0.7}
              style={[
                styles.filterBtn,
                selectedCategory !== 'all' && styles.filterBtnActive,
              ]}
              onPress={() => setSelectedCategory('all')}
            >
              <Filter size={16} color="#1F2228" strokeWidth={2.2} />
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.85}
              style={styles.addBtn}
              onPress={openReminderModal}
            >
              <Text style={styles.addBtnText}>Add</Text>
            </TouchableOpacity>
          </View>
        </View>

        <FlatList
          horizontal
          data={INITIAL_CATEGORIES}
          keyExtractor={item => item.id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesRow}
          style={styles.categoriesScroll}
          renderItem={({ item: cat }) => {
            const isSelected = selectedCategory === cat.id;
            const count = reminders.filter(r => r.category === cat.id).length;
            return (
              <TouchableOpacity
                key={cat.id}
                activeOpacity={0.85}
                onPress={() =>
                  setSelectedCategory(prev =>
                    prev === cat.id ? 'all' : cat.id,
                  )
                }
                style={[
                  styles.categoryCard,
                  { backgroundColor: cat.bgColor },
                  isSelected && [
                    styles.categoryCardSelected,
                    { shadowColor: cat.shadowColor },
                  ],
                ]}
              >
                <View
                  style={[
                    styles.categoryIconWrap,
                    {
                      borderColor: cat.borderColor,
                      shadowColor: cat.shadowColor,
                    },
                  ]}
                >
                  <cat.Icon width={24} height={24} color={cat.accentColor} />
                </View>
                <Text style={styles.categoryLabel}>{cat.label}</Text>
                <Text style={styles.categoryCount}>
                  +{count < 10 ? `0${count}` : count} alerts
                </Text>
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

        {/* ── Reminders List Section (#FAFAFA background) ── */}
        <View style={styles.reminderSection}>
          <View style={styles.reminderSectionHeader}>
            <View>
              <Text style={styles.reminderSectionTitle}>
                {activeTab === 'upcoming' ? 'Upcoming Alerts' : 'Done History'}
              </Text>
              <Text style={styles.reminderSectionSubtitle}>
                {displayedReminders.length} reminder
                {displayedReminders.length === 1 ? '' : 's'} scheduled
              </Text>
            </View>
            <TouchableOpacity
              activeOpacity={0.85}
              style={styles.addReminderBtn}
              onPress={openReminderModal}
            >
              <Plus size={14} color="#FFFFFF" strokeWidth={2.5} />
              <Text style={styles.addReminderBtnText}>Add Reminder</Text>
            </TouchableOpacity>
          </View>

          {displayedReminders.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Bell size={40} color="#D1D5DB" strokeWidth={1.5} />
              <Text style={styles.emptyTitle}>No reminders here</Text>
              <Text style={styles.emptySubtitle}>
                Tap &ldquo;Add Reminder&rdquo; to set a timely alert for your
                routines.
              </Text>
              <TouchableOpacity
                activeOpacity={0.85}
                style={styles.addEmptyBtn}
                onPress={openReminderModal}
              >
                <Plus size={15} color="#FFFFFF" strokeWidth={2.5} />
                <Text style={styles.addEmptyBtnText}>Add Reminder</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.reminderListCards}>
              {displayedReminders.map(rem => {
                const isChecked = rem.done || selectedReminders.has(rem.id);
                const catObj = INITIAL_CATEGORIES.find(
                  c => c.id === rem.category,
                );
                return (
                  <TouchableOpacity
                    key={rem.id}
                    activeOpacity={0.85}
                    style={styles.reminderCard}
                    onPress={() => toggleReminder(rem.id)}
                  >
                    <View style={styles.reminderCardLeft}>
                      <View
                        style={[
                          styles.reminderIconWrap,
                          {
                            backgroundColor: catObj?.bgColor || '#F3F4F6',
                          },
                        ]}
                      >
                        <Bell
                          size={18}
                          color={catObj?.accentColor || '#1F2228'}
                          strokeWidth={2.2}
                        />
                      </View>
                      <View style={styles.reminderTextWrap}>
                        <Text
                          style={[
                            styles.reminderTitle,
                            isChecked && styles.reminderTitleDone,
                          ]}
                          numberOfLines={1}
                        >
                          {rem.title}
                        </Text>
                        <View style={styles.metaRow}>
                          <Clock size={12} color="#8A9099" strokeWidth={2} />
                          <Text style={styles.reminderTime}>{rem.time}</Text>
                          <Text style={styles.metaDot}>•</Text>
                          <Text style={styles.reminderDate}>{rem.date}</Text>
                          {rem.repeat ? (
                            <>
                              <Text style={styles.metaDot}>•</Text>
                              <Text style={styles.reminderRepeat}>
                                {rem.repeat}
                              </Text>
                            </>
                          ) : null}
                        </View>
                      </View>
                    </View>

                    <View style={styles.cardRightActions}>
                      <TouchableOpacity
                        activeOpacity={0.7}
                        style={[
                          styles.speakBtn,
                          speakingReminderId === rem.id && styles.speakBtnActive,
                        ]}
                        onPress={e => handleSpeakReminder(rem, e)}
                        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                      >
                        {speakingReminderId === rem.id ? (
                          <VolumeX size={16} color="#8383D6" />
                        ) : (
                          <Volume2 size={16} color="#8A9099" />
                        )}
                      </TouchableOpacity>

                      <View
                        style={[
                          styles.reminderCheckbox,
                          isChecked
                            ? styles.reminderCheckboxChecked
                            : styles.reminderCheckboxUnchecked,
                        ]}
                      >
                        {isChecked ? (
                          <Check size={14} color="#52D22E" strokeWidth={3} />
                        ) : null}
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}

          {/* ── Select All / Mark Action ── */}
          {displayedReminders.length > 0 && (
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={selectAll}
              style={styles.selectAllBtn}
            >
              <Text style={styles.selectAllText}>
                {displayedReminders.every(r => selectedReminders.has(r.id))
                  ? 'Deselect All'
                  : 'Select All Reminders'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 120,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: ResponsivePixels.size20,
    paddingTop: ResponsivePixels.size16,
    paddingBottom: ResponsivePixels.size8,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ResponsivePixels.size14,
  },
  menuIcon: {
    gap: 4.5,
    justifyContent: 'center',
    paddingVertical: 4,
  },
  menuLine: {
    width: 18,
    height: 2.2,
    backgroundColor: '#1F2228',
    borderRadius: 2,
  },
  headerTitle: {
    ...Typography.h1RanadeBold,
    color: '#000000',
    fontSize: 26,
  },
  avatarRing: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: Colors.RingBorder,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },

  // Toggle
  toggleContainer: {
    flexDirection: 'row',
    marginHorizontal: ResponsivePixels.size20,
    marginTop: ResponsivePixels.size16,
    backgroundColor: '#1F2228',
    borderRadius: 50,
    padding: 4,
  },
  toggleTab: {
    flex: 1,
    paddingVertical: ResponsivePixels.size10,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleTabActive: {
    backgroundColor: '#FFFFFF',
  },
  toggleText: {
    ...Typography.bodyMediumPoppinsSemiBold,
    fontSize: 14,
  },
  toggleTextActive: {
    color: '#1F2228',
  },
  toggleTextInactive: {
    color: '#FFFFFF',
  },

  // Section Header
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: ResponsivePixels.size20,
    marginTop: ResponsivePixels.size24,
    marginBottom: ResponsivePixels.size14,
  },
  sectionTitle: {
    ...Typography.h6Bold,
    color: '#000000',
    fontSize: 18,
  },
  sectionActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ResponsivePixels.size10,
  },
  filterBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#F5F6F8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterBtnActive: {
    backgroundColor: '#E5E7EB',
  },
  addBtn: {
    backgroundColor: '#1F2228',
    paddingHorizontal: ResponsivePixels.size16,
    paddingVertical: ResponsivePixels.size8,
    borderRadius: 50,
  },
  addBtnText: {
    ...Typography.bodySmallPoppinsSemiBold,
    color: '#FFFFFF',
    fontSize: 12,
  },

  // Categories
  categoriesScroll: {
    overflow: 'visible',
    marginBottom: ResponsivePixels.size4,
  },
  categoriesRow: {
    paddingHorizontal: ResponsivePixels.size20,
    paddingTop: ResponsivePixels.size10,
    paddingBottom: ResponsivePixels.size30,
    gap: ResponsivePixels.size14,
  },
  categoryCard: {
    width: 124,
    borderRadius: 23,
    borderTopRightRadius: 63,
    padding: ResponsivePixels.size16,
    paddingBottom: ResponsivePixels.size18,
    gap: ResponsivePixels.size6,
    position: 'relative',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  categoryCardSelected: {
    borderColor: '#FFFFFF',
    ...Platform.select({
      ios: {
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.38,
        shadowRadius: 14,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  categoryIconWrap: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: ResponsivePixels.size8,
    ...Platform.select({
      ios: {
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.22,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  categoryLabel: {
    ...Typography.bodyMediumPoppinsSemiBold,
    color: '#000000',
    fontSize: 15,
  },
  categoryCount: {
    ...Typography.bodySmallPoppinsRegular,
    color: Colors.SubtitleGray,
    fontSize: 12,
  },
  categoryAccentWrap: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  categoryAccent: {
    height: 4,
    width: 48,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },

  // Reminder Section (#FAFAFA background matching design)
  reminderSection: {
    backgroundColor: '#FAFAFA',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: ResponsivePixels.size20,
    paddingTop: ResponsivePixels.size24,
    paddingBottom: ResponsivePixels.size32,
    flex: 1,
  },
  reminderSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: ResponsivePixels.size18,
  },
  reminderSectionTitle: {
    ...Typography.h6Bold,
    color: '#000000',
    fontSize: 18,
  },
  reminderSectionSubtitle: {
    ...Typography.bodySmallPoppinsRegular,
    color: '#8A9099',
    fontSize: 12,
    marginTop: 2,
  },
  addReminderBtn: {
    backgroundColor: '#1F2228',
    paddingHorizontal: ResponsivePixels.size14,
    paddingVertical: ResponsivePixels.size8,
    borderRadius: 50,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  addReminderBtnText: {
    ...Typography.bodySmallPoppinsSemiBold,
    color: '#FFFFFF',
    fontSize: 12,
  },

  // Reminder Cards
  reminderListCards: {
    gap: ResponsivePixels.size12,
  },
  reminderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingHorizontal: ResponsivePixels.size16,
    paddingVertical: ResponsivePixels.size16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 8,
      },
      android: {
        elevation: 1.5,
      },
    }),
  },
  reminderCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ResponsivePixels.size14,
    flex: 1,
    paddingRight: 10,
  },
  reminderIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reminderTextWrap: {
    flex: 1,
  },
  reminderTitle: {
    ...Typography.bodyMediumPoppinsMedium,
    color: '#000000',
    fontSize: 15,
  },
  reminderTitleDone: {
    textDecorationLine: 'line-through',
    color: '#9CA3AF',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 4,
  },
  reminderTime: {
    ...Typography.bodySmallPoppinsMedium,
    fontSize: 12,
    color: '#555A63',
  },
  metaDot: {
    fontSize: 11,
    color: '#B0B5BD',
  },
  reminderDate: {
    ...Typography.bodySmallPoppinsRegular,
    fontSize: 12,
    color: '#8A9099',
  },
  reminderRepeat: {
    ...Typography.bodySmallPoppinsRegular,
    fontSize: 11,
    color: '#8383D6',
  },

  // Card Right Actions & Speaker Button
  cardRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ResponsivePixels.size8,
  },
  speakBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  speakBtnActive: {
    backgroundColor: '#EFF2FE',
  },

  // Checkbox
  reminderCheckbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reminderCheckboxChecked: {
    backgroundColor: '#E8FDF0',
  },
  reminderCheckboxUnchecked: {
    backgroundColor: '#EFF1F4',
  },

  // Select All
  selectAllBtn: {
    backgroundColor: '#1F2228',
    borderRadius: 50,
    paddingVertical: ResponsivePixels.size14,
    paddingHorizontal: ResponsivePixels.size36,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: ResponsivePixels.size24,
  },
  selectAllText: {
    ...Typography.bodyMediumPoppinsSemiBold,
    color: '#FFFFFF',
    fontSize: 14,
  },

  // Empty State
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    gap: 8,
  },
  emptyTitle: {
    ...Typography.bodyMediumPoppinsSemiBold,
    color: '#374151',
    fontSize: 16,
    marginTop: 6,
  },
  emptySubtitle: {
    ...Typography.bodySmallPoppinsRegular,
    color: '#9CA3AF',
    textAlign: 'center',
    paddingHorizontal: 30,
    lineHeight: 18,
  },
  addEmptyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#1F2228',
    paddingHorizontal: ResponsivePixels.size20,
    paddingVertical: ResponsivePixels.size10,
    borderRadius: 50,
    marginTop: 10,
  },
  addEmptyBtnText: {
    ...Typography.bodySmallPoppinsSemiBold,
    color: '#FFFFFF',
    fontSize: 13,
  },

  // Full-screen Sheet Styles
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
  categoryCardGrid: {
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

export default RemindersScreen;
