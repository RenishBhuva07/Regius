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
import { useNavigation } from '@react-navigation/native';
import { Plus, Bell, CheckCircle2 } from 'lucide-react-native';
import Toast from 'react-native-toast-message';

import { Fonts } from '../../Theme/fonts';
import { Typography } from '../../Theme/Typographys';
import { Colors } from '../../Assets/StyleUtilities/Colors';
import { useAppTheme } from '../../Theme/useAppTheme';
import ResponsivePixels from '../../Assets/StyleUtilities/ResponsivePixels';
import { useTaskReminder, Reminder } from '../../Context/TaskReminderContext';
import { ScreenHeader, SCREEN_HEADER_HEIGHT } from '../../Common/ScreenHeader';
import { KokoroTTSService } from '../../Services/Kokoro/KokoroTTSService';
import { AudioPlayerService } from '../../Services/AudioPlayerService';
import { TactileSegmentedTabs, FlowSectionSheet } from '../../Common';

import ReminderScheduleBento from './Components/ReminderScheduleBento';
import ReminderCategoryCarousel from './Components/ReminderCategoryCarousel';
import ReminderCardItem from './Components/ReminderCardItem';
import ReminderSectionBackgroundSvg from './Components/ReminderSectionBackgroundSvg';
import ReminderEmptyDoodleSvg from './Components/ReminderEmptyDoodleSvg';
import ReminderWatermarkDoodleSvg from './Components/ReminderWatermarkDoodleSvg';
import AddReminderModal from '../../Components/AddReminderModal';
import { useDailyQuote } from '../../Services/DailyQuotes';

type TabKey = 'upcoming' | 'completed';

export const RemindersScreen: React.FC<any> = ({ route }) => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const {
    isDarkMode,
    bgMain,
    textPrimary,
    textSecondary,
    accentDeep,
    surfaceAlt,
    borderLight,
  } = useAppTheme();
  const dailyQuote = useDailyQuote('reminders');
  const [activeTab, setActiveTab] = useState<TabKey>('upcoming');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    'daily',
  );
  const [editingReminder, setEditingReminder] = useState<Reminder | null>(null);

  const {
    reminders,
    toggleReminder,
    updateReminder,
    deleteReminder,
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

  const handleViewDetails = useCallback(
    (reminder: Reminder) => {
      navigation.navigate('ReminderDetailsScreen', {
        reminderId: reminder.id,
      });
    },
    [navigation],
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

  // Tabs configuration for TactileSegmentedTabs
  const reminderTabs = useMemo(
    () => [
      {
        key: 'upcoming' as TabKey,
        label: 'Upcoming',
        icon: Bell,
        count: pendingRemindersCount,
        countVariant: 'yellow' as const,
      },
      {
        key: 'completed' as TabKey,
        label: 'Completed',
        icon: CheckCircle2,
        count: completedRemindersCount,
        countVariant: 'green' as const,
      },
    ],
    [pendingRemindersCount, completedRemindersCount],
  );

  return (
    <View style={[styles.safeArea, { backgroundColor: bgMain }]}>
      <StatusBar
        barStyle={
          isScrolled
            ? 'light-content'
            : isDarkMode
            ? 'light-content'
            : 'dark-content'
        }
        {...(Platform.OS === 'android'
          ? {
              backgroundColor: isScrolled
                ? accentDeep
                : bgMain,
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
        onPressSettings={() => navigation.navigate('Settings')}
        onPressProfile={() => navigation.navigate('ProfileScreen')}
      />

      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: insets.top + SCREEN_HEADER_HEIGHT + 10,
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
        <TactileSegmentedTabs
          tabs={reminderTabs}
          activeTab={activeTab}
          onChangeTab={setActiveTab}
        />

        {/* Categories Carousel */}
        <ReminderCategoryCarousel
          reminders={reminders}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          onAddPress={openReminderModal}
        />

        {/* Reminders section */}
        <FlowSectionSheet
          title={sectionTitle}
          subtitle={sectionSubtitle}
          backgroundSvg={<ReminderSectionBackgroundSvg />}
          onPressAdd={openReminderModal}
          addAccessibilityLabel="Add Reminder"
          bottomPadding={insets.bottom + 130}
          containerStyle={styles.reminderSection}
        >
          {/* Reminders List or Empty State */}
          {filteredReminders.length === 0 ? (
            <View style={styles.emptyContainer}>
              <ReminderEmptyDoodleSvg />
              <Text style={[styles.emptyTitle, { color: textPrimary }]}>
                No reminders here
              </Text>
              <Text style={[styles.emptySubtitle, { color: textSecondary }]}>
                {activeTab === 'completed'
                  ? 'No completed alerts in this category yet.'
                  : 'Tap “+” or the button below to schedule an alert.'}
              </Text>
              <TouchableOpacity
                activeOpacity={0.85}
                style={styles.addEmptyBtn}
                onPress={openReminderModal}
              >
                <Plus size={15} color={Colors.PureWhite} strokeWidth={2.5} />
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
                      onEdit={setEditingReminder}
                      onDetails={handleViewDetails}
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

          {/* Footer brand watermark */}
          <View style={styles.footerWatermarkWrapper} pointerEvents="none">
            <View style={styles.footerWatermarkRow}>
              {/* Left Column: Bold Typography & Sign-off */}
              <View style={styles.liveItUpBlock}>
                <Text
                  style={[
                    styles.liveItUpText,
                    isDarkMode && { color: Colors.DarkTitleCompleted },
                  ]}
                >
                  {dailyQuote}
                </Text>
                <View style={styles.craftedWithRow}>
                  <Text
                    style={[
                      styles.craftedWithText,
                      isDarkMode && { color: Colors.DarkTitleCompleted },
                    ]}
                  >
                    Crafted with{' '}
                  </Text>
                  <Text style={styles.craftedWithHeart}>❤️</Text>
                  <Text
                    style={[
                      styles.craftedWithText,
                      isDarkMode && { color: Colors.DarkTitleCompleted },
                    ]}
                  >
                    {' '}
                    in Ahmedabad, India
                  </Text>
                </View>
              </View>

              {/* Footer doodle */}
              <View style={styles.footerDoodleWrapper}>
                <ReminderWatermarkDoodleSvg />
              </View>
            </View>
          </View>
        </FlowSectionSheet>
      </ScrollView>

      {/* Edit Reminder Modal */}
      {editingReminder && (
        <AddReminderModal
          visible={editingReminder !== null}
          onClose={() => setEditingReminder(null)}
          reminderToEdit={editingReminder}
          onCreateReminder={() => {}}
          onUpdateReminder={(id, remData) => {
            updateReminder(id, remData);
            setEditingReminder(null);
            Toast.show({
              type: 'success',
              text1: 'Reminder Updated',
              text2: 'Alert parameters successfully saved.',
            });
          }}
          onDeleteReminder={id => {
            deleteReminder(id);
            setEditingReminder(null);
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.PureWhite,
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

  // Reminders Section Container matching TasksScreen & HabitsScreen
  reminderSection: {
    backgroundColor: Colors.SoftCream,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    borderWidth: 1.5,
    borderTopColor: Colors.WarmNavBevelTop,
    borderLeftColor: Colors.WarmNavBevelSide,
    borderRightColor: Colors.WarmNavBevelSide,
    borderBottomWidth: 0,
    paddingHorizontal: 8,
    paddingTop: 40,
    marginTop: 26,
    flex: 1,
    position: 'relative',
    ...Platform.select({
      ios: {
        shadowColor: Colors.RegiusInk,
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
    zIndex: 20,
    overflow: 'hidden',
  },
  flowTitle: {
    fontFamily: Fonts.poppins.bold,
    fontSize: 14.5,
    color: Colors.PureWhite,
    letterSpacing: -0.1,
    textAlign: 'center',
  },
  flowSubtitle: {
    fontFamily: Fonts.poppins.medium,
    fontSize: 10.5,
    color: Colors.CoolSilverSubtitle,
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
    borderTopColor: Colors.DarkBevelTop,
    borderLeftColor: Colors.DarkBorder,
    borderRightColor: Colors.DarkBorder,
    borderBottomWidth: 3.5,
    borderBottomColor: Colors.DarkBevelAbyss,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.DarkShadowAnchor,
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
    backgroundColor: Colors.MidnightCharcoal,
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
        shadowColor: Colors.PureBlack,
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
    color: Colors.PureWhite,
    fontSize: 13.5,
  },

  // Footer watermark styles
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
    color: Colors.MilestoneSlate,
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
    color: Colors.MilestoneSlate,
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
    color: Colors.Gray700,
    fontSize: 15,
    marginTop: 6,
  },
  emptySubtitle: {
    ...Typography.bodySmallPoppinsRegular,
    color: Colors.Gray400,
    textAlign: 'center',
    paddingHorizontal: 20,
    lineHeight: 18,
  },
  addEmptyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.MidnightCharcoal,
    paddingHorizontal: ResponsivePixels.size20,
    paddingVertical: ResponsivePixels.size10,
    borderRadius: 50,
    marginTop: 12,
  },
  addEmptyBtnText: {
    ...Typography.bodySmallPoppinsSemiBold,
    color: Colors.PureWhite,
    fontSize: 12.5,
  },
});

export default RemindersScreen;
