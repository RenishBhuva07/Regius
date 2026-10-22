import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  FlatList,
  StatusBar,
  Platform,
  Animated,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Plus, Bell, CheckCircle2 } from 'lucide-react-native';
import Toast from 'react-native-toast-message';

import { Fonts } from '../../Theme/fonts';
import { Typography } from '../../Theme/Typographys';
import { Colors } from '../../Assets/StyleUtilities/Colors';
import ResponsivePixels from '../../Assets/StyleUtilities/ResponsivePixels';
import { useTaskReminder, Reminder } from '../../Context/TaskReminderContext';
import { ScreenHeader, SCREEN_HEADER_HEIGHT } from '../../Common/ScreenHeader';
import { KokoroTTSService } from '../../Services/Kokoro/KokoroTTSService';
import { AudioPlayerService } from '../../Services/AudioPlayerService';
import FlowBadgePatternSvg from '../Dashboard/Components/FlowBadgePatternSvg';

import ReminderScheduleBento from './Components/ReminderScheduleBento';
import ReminderCategoryCarousel from './Components/ReminderCategoryCarousel';
import ReminderCardItem from './Components/ReminderCardItem';
import ReminderSectionBackgroundSvg from './Components/ReminderSectionBackgroundSvg';
import ReminderEmptyDoodleSvg from './Components/ReminderEmptyDoodleSvg';
import ReminderWatermarkDoodleSvg from './Components/ReminderWatermarkDoodleSvg';
import { useDailyQuote } from '../../Services/DailyQuotes';

type TabKey = 'upcoming' | 'completed';

export const RemindersScreen: React.FC<any> = ({ route }) => {
  const insets = useSafeAreaInsets();
  const dailyQuote = useDailyQuote('reminders');
  const [activeTab, setActiveTab] = useState<TabKey>('upcoming');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    'daily',
  );

  const {
    reminders,
    toggleReminder,
    selectedReminders,
    setSelectedReminders,
    openReminderModal,
  } = useTaskReminder();

  const [speakingReminderId, setSpeakingReminderId] = useState<string | null>(
    null,
  );

  // Scroll tracking matching DashboardScreen and TasksScreen reactive headers
  const scrollY = useRef(new Animated.Value(0)).current;
  const isScrolledRef = useRef(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    {
      useNativeDriver: false,
      listener: (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const offsetY = event?.nativeEvent?.contentOffset?.y ?? 0;
        if (offsetY > 15 && !isScrolledRef.current) {
          isScrolledRef.current = true;
          setIsScrolled(true);
        } else if (offsetY <= 15 && isScrolledRef.current) {
          isScrolledRef.current = false;
          setIsScrolled(false);
        }
      },
    },
  );

  // Trigger from navigation params (e.g. from PlusActionSheet or other routes)
  useEffect(() => {
    if (route?.params?.openAddModal) {
      openReminderModal();
    }
  }, [route?.params, openReminderModal]);

  // Compute live reminder counts
  const completedRemindersCount = useMemo(
    () => reminders.filter(r => r.done).length,
    [reminders],
  );
  const pendingRemindersCount = useMemo(
    () => reminders.filter(r => !r.done).length,
    [reminders],
  );

  // Filter reminders based on activeTab ('upcoming' vs 'completed') and selectedCategory
  const filteredReminders = useMemo(() => {
    return reminders.filter(reminder => {
      // 1. Tab filtering
      if (activeTab === 'upcoming' && reminder.done) return false;
      if (activeTab === 'completed' && !reminder.done) return false;

      // 2. Category filtering
      if (selectedCategory) {
        return reminder.category === selectedCategory;
      }

      return true;
    });
  }, [reminders, activeTab, selectedCategory]);

  const handleToggleReminder = useCallback(
    (id: string) => {
      const updated = toggleReminder(id);
      if (updated) {
        Toast.show({
          type: 'success',
          text1: updated.done
            ? 'Reminder Acknowledged! 🔔'
            : 'Reminder Restored',
          text2: updated.done
            ? 'Marked as completed for today.'
            : 'Returned to upcoming alerts queue.',
        });
      }
    },
    [toggleReminder],
  );

  const handleSpeakReminder = useCallback(
    async (rem: Reminder, e: any) => {
      e?.stopPropagation?.();
      if (speakingReminderId === rem.id) {
        await KokoroTTSService.stop();
        setSpeakingReminderId(null);
      } else {
        setSpeakingReminderId(rem.id);
        const textToSpeak = `Reminder: ${rem.title}. Scheduled for ${rem.time}.`;
        await KokoroTTSService.speak(textToSpeak);
        const unsub = AudioPlayerService.onPlaybackFinished(() => {
          setSpeakingReminderId(null);
          unsub();
        });
      }
    },
    [speakingReminderId],
  );

  const selectAll = () => {
    const currentList = filteredReminders;
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

  // Section title matching TasksScreen & HabitsScreen header badges
  const sectionTitle = useMemo(() => {
    if (activeTab === 'completed') {
      return 'Completed Alerts';
    }
    if (selectedCategory === 'daily') {
      return 'Today’s Daily Alerts';
    }
    if (selectedCategory) {
      return `Today’s ${
        selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)
      }`;
    }
    return 'Today’s Alerts';
  }, [activeTab, selectedCategory]);

  // Section subtitle: "X of Y completed"
  const sectionSubtitle = useMemo(() => {
    const total = filteredReminders.length;
    const completed = filteredReminders.filter(r => r.done).length;
    if (activeTab === 'completed') {
      return `${completedRemindersCount} finished alerts`;
    }
    return `${completed} of ${total} completed`;
  }, [filteredReminders, activeTab, completedRemindersCount]);

  return (
    <View style={styles.safeArea}>
      <StatusBar
        barStyle={isScrolled ? 'light-content' : 'dark-content'}
        {...(Platform.OS === 'android'
          ? {
              backgroundColor: isScrolled ? Colors.LavenderPurple : '#FBF9F3',
              translucent: true,
            }
          : {})}
      />

      {/* Reusable reactive Screen Header with voice orb and avatar */}
      <ScreenHeader
        title="Reminders"
        subtitle="Scheduled Alerts & Horizons"
        scrollY={scrollY}
        isScrolled={isScrolled}
      />

      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: insets.top + SCREEN_HEADER_HEIGHT + 6,
            paddingBottom: 0,
          },
        ]}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {/* Compact Schedule Bar matching DailyBriefingCard & TaskProductivityBento */}
        <View style={styles.bentoCardWrapper}>
          <ReminderScheduleBento
            reminders={reminders}
            onAddReminder={openReminderModal}
          />
        </View>

        {/* Signature Regius Tactile Segmented Tabs */}
        <View style={styles.toggleContainer}>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => setActiveTab('upcoming')}
            style={[
              styles.toggleTab,
              activeTab === 'upcoming' && styles.toggleTabActive,
            ]}
            accessibilityRole="tab"
            accessibilityState={{ selected: activeTab === 'upcoming' }}
          >
            <Bell
              size={14}
              color={activeTab === 'upcoming' ? '#D97706' : '#9EA3B0'}
              strokeWidth={activeTab === 'upcoming' ? 2.4 : 2}
            />
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
            <View
              style={[
                styles.tabCountPill,
                activeTab === 'upcoming'
                  ? styles.tabCountPillActiveUpcoming
                  : styles.tabCountPillInactive,
              ]}
            >
              <Text
                style={[
                  styles.tabCountText,
                  activeTab === 'upcoming'
                    ? styles.tabCountTextActiveUpcoming
                    : styles.tabCountTextInactive,
                ]}
              >
                {pendingRemindersCount}
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => setActiveTab('completed')}
            style={[
              styles.toggleTab,
              activeTab === 'completed' && styles.toggleTabActive,
            ]}
            accessibilityRole="tab"
            accessibilityState={{ selected: activeTab === 'completed' }}
          >
            <CheckCircle2
              size={14}
              color={activeTab === 'completed' ? '#10B981' : '#9EA3B0'}
              strokeWidth={activeTab === 'completed' ? 2.4 : 2}
            />
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
            <View
              style={[
                styles.tabCountPill,
                activeTab === 'completed'
                  ? styles.tabCountPillActiveCompleted
                  : styles.tabCountPillInactive,
              ]}
            >
              <Text
                style={[
                  styles.tabCountText,
                  activeTab === 'completed'
                    ? styles.tabCountTextActiveCompleted
                    : styles.tabCountTextInactive,
                ]}
              >
                {completedRemindersCount}
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Categories Carousel */}
        <ReminderCategoryCarousel
          reminders={reminders}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          onAddPress={openReminderModal}
        />

        {/* Reminders Main Section with centered crest badge & floating plus button */}
        <View
          style={[
            styles.reminderSection,
            { paddingBottom: insets.bottom + 130 },
          ]}
        >
          <View style={styles.reminderSectionBgWrapper} pointerEvents="none">
            <ReminderSectionBackgroundSvg />
          </View>

          {/* Header crest badge centered on top border - half outside, half inside */}
          <View style={styles.flowHeaderBadge}>
            <FlowBadgePatternSvg />
            <Text style={styles.flowTitle}>{sectionTitle}</Text>
            <Text style={styles.flowSubtitle}>{sectionSubtitle}</Text>
          </View>

          {/* Floating plus button at top-right corner matching TasksScreen */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={openReminderModal}
            style={styles.addReminderFloatingBtn}
            accessibilityRole="button"
            accessibilityLabel="Add Reminder"
          >
            <Plus size={18} color="#FFFFFF" strokeWidth={2.6} />
          </TouchableOpacity>

          {/* Reminders List or Empty State */}
          {filteredReminders.length === 0 ? (
            <View style={styles.emptyContainer}>
              <ReminderEmptyDoodleSvg />
              <Text style={styles.emptyTitle}>No reminders here</Text>
              <Text style={styles.emptySubtitle}>
                {activeTab === 'completed'
                  ? 'No completed alerts in this category yet.'
                  : 'Tap “+” or the button below to schedule an alert.'}
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
            <View style={styles.reminderListWrapper}>
              <FlatList
                data={filteredReminders}
                keyExtractor={item => item.id}
                scrollEnabled={false}
                renderItem={({ item: rem }) => {
                  const isChecked = rem.done || selectedReminders.has(rem.id);
                  return (
                    <ReminderCardItem
                      reminder={rem}
                      isChecked={isChecked}
                      onToggle={handleToggleReminder}
                      isSpeaking={speakingReminderId === rem.id}
                      onSpeak={handleSpeakReminder}
                    />
                  );
                }}
                style={styles.reminderList}
                contentContainerStyle={styles.listContent}
              />

              {/* Complete / Restore All Reminder Button */}
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => {
                  const markDone = activeTab === 'upcoming';
                  selectAll();
                  Toast.show({
                    type: 'success',
                    text1: markDone
                      ? 'All Reminders Acknowledged! 🔔'
                      : 'Reminders Restored to Active List',
                    text2: markDone
                      ? 'Great momentum on conquering your daily schedule!'
                      : 'Items are now back in your upcoming alerts queue.',
                  });
                }}
                style={styles.selectAllBtn}
              >
                <Text style={styles.selectAllText}>
                  {activeTab === 'upcoming'
                    ? selectedCategory
                      ? `Complete All ${
                          selectedCategory.charAt(0).toUpperCase() +
                          selectedCategory.slice(1)
                        }`
                      : 'Complete All Reminders'
                    : 'Restore All to Active'}
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Swiggy-Inspired Brand Watermark Footer */}
          <View style={styles.footerWatermarkWrapper} pointerEvents="none">
            <View style={styles.footerWatermarkRow}>
              {/* Left Column: Bold Typography & Sign-off */}
              <View style={styles.liveItUpBlock}>
                <Text style={styles.liveItUpText}>{dailyQuote}</Text>
                <View style={styles.craftedWithRow}>
                  <Text style={styles.craftedWithText}>Crafted with </Text>
                  <Text style={styles.craftedWithHeart}>❤️</Text>
                  <Text style={styles.craftedWithText}>
                    {' '}
                    in Ahmedabad, India
                  </Text>
                </View>
              </View>

              {/* Right Column: Extraordinary Reminder Doodle Illustration */}
              <View style={styles.footerDoodleWrapper}>
                <ReminderWatermarkDoodleSvg />
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.DefaultWhite,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    // padding applied dynamically with safe insets
  },
  bentoCardWrapper: {
    paddingTop: 5,
    paddingHorizontal: 10,
    marginBottom: 4,
  },

  // Signature Regius Tactile Segmented Tabs matching TasksScreen
  toggleContainer: {
    flexDirection: 'row',
    marginHorizontal: 10,
    marginTop: 10,
    marginBottom: 6,
    backgroundColor: '#181A20',
    borderRadius: 50,
    padding: 4.5,
    borderWidth: 1.5,
    borderTopColor: '#363A48',
    borderLeftColor: '#282B35',
    borderRightColor: '#282B35',
    borderBottomWidth: 3,
    borderBottomColor: '#0E1015',
    ...Platform.select({
      ios: {
        shadowColor: '#0B0D11',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.25,
        shadowRadius: 10,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  toggleTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    borderRadius: 50,
    gap: 7,
  },
  toggleTabActive: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.95)',
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.22,
        shadowRadius: 6,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  toggleText: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: 13,
    letterSpacing: -0.2,
  },
  toggleTextActive: {
    fontFamily: Fonts.poppins.bold,
    color: '#121417',
  },
  toggleTextInactive: {
    fontFamily: Fonts.poppins.semiBold,
    color: '#E5E7EB',
  },
  tabCountPill: {
    paddingHorizontal: 8,
    paddingVertical: 1.5,
    borderRadius: 12,
    minWidth: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabCountPillActiveUpcoming: {
    backgroundColor: '#FFF8D0',
    borderWidth: 1,
    borderColor: '#FFFFFF',
    borderBottomWidth: 2,
    borderBottomColor: '#DEAA14',
    ...Platform.select({
      ios: {
        shadowColor: '#D97706',
        shadowOffset: { width: 0, height: 1.5 },
        shadowOpacity: 0.25,
        shadowRadius: 2.5,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  tabCountPillActiveCompleted: {
    backgroundColor: '#E8FDF0',
    borderWidth: 1,
    borderColor: '#FFFFFF',
    borderBottomWidth: 2,
    borderBottomColor: '#82E8A6',
    ...Platform.select({
      ios: {
        shadowColor: '#52D22E',
        shadowOffset: { width: 0, height: 1.5 },
        shadowOpacity: 0.25,
        shadowRadius: 2.5,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  tabCountPillInactive: {
    backgroundColor: 'rgba(255, 255, 255, 0.14)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  tabCountText: {
    fontFamily: Fonts.poppins.bold,
    fontSize: 10.5,
  },
  tabCountTextActiveUpcoming: {
    color: '#B47804',
  },
  tabCountTextActiveCompleted: {
    color: '#1B9A72',
  },
  tabCountTextInactive: {
    color: '#FFFFFF',
  },

  // Reminders Section Container matching TasksScreen & HabitsScreen
  reminderSection: {
    backgroundColor: Colors.SoftCream,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    borderWidth: 1.5,
    borderTopColor: '#FAF6EE',
    borderLeftColor: '#EFE9DE',
    borderRightColor: '#EFE9DE',
    borderBottomWidth: 0,
    paddingHorizontal: 8,
    paddingTop: 40,
    marginTop: 26,
    flex: 1,
    position: 'relative',
    ...Platform.select({
      ios: {
        shadowColor: '#1B1C19',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.12,
        shadowRadius: 12,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  reminderSectionBgWrapper: {
    ...StyleSheet.absoluteFill,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    overflow: 'hidden',
  },
  flowHeaderBadge: {
    position: 'absolute',
    top: -24,
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
    zIndex: 20,
    overflow: 'hidden',
  },
  flowTitle: {
    fontFamily: Fonts.poppins.bold,
    fontSize: 14.5,
    color: Colors.DefaultWhite,
    letterSpacing: -0.1,
    textAlign: 'center',
  },
  flowSubtitle: {
    fontFamily: Fonts.poppins.medium,
    fontSize: 10.5,
    color: '#B6B9C3',
    marginTop: 1,
    textAlign: 'center',
  },
  addReminderFloatingBtn: {
    position: 'absolute',
    top: -21,
    right: 18,
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: Colors.NeroBlack,
    borderWidth: 1.5,
    borderTopColor: '#4A4E5C',
    borderLeftColor: '#363944',
    borderRightColor: '#363944',
    borderBottomWidth: 3.5,
    borderBottomColor: '#090A0D',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0B0D11',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.32,
    shadowRadius: 6,
    elevation: 6,
    zIndex: 20,
  },

  // List & Cards
  reminderListWrapper: {
    flex: 1,
  },
  reminderList: {
    overflow: 'visible',
  },
  listContent: {
    gap: 12,
    paddingTop: 10,
    paddingHorizontal: 0,
    paddingBottom: 20,
    overflow: 'visible',
  },
  selectAllBtn: {
    backgroundColor: '#1F2228',
    borderRadius: 50,
    paddingVertical: ResponsivePixels.size14,
    paddingHorizontal: ResponsivePixels.size36,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: ResponsivePixels.size8,
    marginBottom: ResponsivePixels.size24,
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  selectAllText: {
    ...Typography.bodyMediumPoppinsSemiBold,
    color: '#FFFFFF',
    fontSize: 13.5,
  },

  // Swiggy-Inspired Brand Watermark Footer
  footerWatermarkWrapper: {
    paddingLeft: ResponsivePixels.size10,
    paddingRight: ResponsivePixels.size16,
    marginTop: ResponsivePixels.size16,
    marginBottom: ResponsivePixels.size20,
  },
  footerWatermarkRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  liveItUpBlock: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  liveItUpText: {
    fontFamily: Fonts.poppins.bold,
    fontSize: 34,
    lineHeight: 42,
    color: '#8E95A5',
    letterSpacing: -1.2,
  },
  craftedWithRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 18,
  },
  craftedWithText: {
    fontFamily: Fonts.poppins.medium,
    fontSize: 14,
    color: '#8E95A5',
  },
  craftedWithHeart: {
    fontSize: 13.5,
  },
  footerDoodleWrapper: {
    marginLeft: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
  },

  // Empty State
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
    gap: 8,
  },
  emptyTitle: {
    ...Typography.bodyMediumPoppinsSemiBold,
    color: '#374151',
    fontSize: 15,
    marginTop: 6,
  },
  emptySubtitle: {
    ...Typography.bodySmallPoppinsRegular,
    color: '#9CA3AF',
    textAlign: 'center',
    paddingHorizontal: 20,
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
    marginTop: 12,
  },
  addEmptyBtnText: {
    ...Typography.bodySmallPoppinsSemiBold,
    color: '#FFFFFF',
    fontSize: 12.5,
  },
});

export default RemindersScreen;
