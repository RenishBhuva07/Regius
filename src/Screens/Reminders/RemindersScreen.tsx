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
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Plus, Bell, CheckCircle2, BellOff } from 'lucide-react-native';
import Toast from 'react-native-toast-message';

import { Fonts } from '../../Theme/fonts';
import { Typography } from '../../Theme/Typographys';
import { Colors, withAlpha } from '../../Assets/StyleUtilities/Colors';
import { useAppTheme } from '../../Theme/useAppTheme';
import ResponsivePixels from '../../Assets/StyleUtilities/ResponsivePixels';
import { useReminders, Reminder } from '../../Context/ReminderContext';
import { sortRemindersBySchedule } from '../../Services/Reminders/ReminderService';
import { isReminderOverdue } from '../../Utils/reminderDateUtils';
import { ScreenHeader, SCREEN_HEADER_HEIGHT } from '../../Common/ScreenHeader';
import { KokoroTTSService } from '../../Services/Kokoro/KokoroTTSService';
import { AudioPlayerService } from '../../Services/AudioPlayerService';
import {
  TactileSegmentedTabs,
  FlowSectionSheet,
  DailyQuoteFooter,
} from '../../Common';

import ReminderScheduleBento from './Components/ReminderScheduleBento';
import ReminderCategoryCarousel from './Components/ReminderCategoryCarousel';
import ReminderCardItem from './Components/ReminderCardItem';
import OverdueSection from './Components/OverdueSection';
import SnoozeBottomSheet from './Components/SnoozeBottomSheet';
import NotificationPermissionSheet from './Components/NotificationPermissionSheet';
import ReminderSectionBackgroundSvg from './Components/ReminderSectionBackgroundSvg';
import ReminderEmptyDoodleSvg from './Components/ReminderEmptyDoodleSvg';
import ReminderWatermarkDoodleSvg from './Components/ReminderWatermarkDoodleSvg';
import AddReminderModal from '../../Components/AddReminderModal';

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
  const [activeTab, setActiveTab] = useState<TabKey>('upcoming');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [editingReminder, setEditingReminder] = useState<Reminder | null>(null);
  const [snoozingReminder, setSnoozingReminder] = useState<Reminder | null>(
    null,
  );

  const {
    reminders,
    hasNotificationPermission,
    isPermissionSheetVisible,
    toggleReminder,
    updateReminder,
    deleteReminder,
    snoozeReminder,
    rescheduleOverdueToToday,
    completeAllReminders,
    restoreAllReminders,
    requestNotificationPermission,
    dismissPermissionSheet,
    openPermissionSheet,
    openReminderModal,
  } = useReminders();

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

  // Filter & chronologically sort reminders
  const filteredReminders = useMemo(() => {
    const base = reminders.filter(reminder => {
      if (activeTab === 'upcoming' && reminder.done) return false;
      if (activeTab === 'completed' && !reminder.done) return false;
      if (selectedCategory && selectedCategory !== 'all') {
        return reminder.category === selectedCategory;
      }
      return true;
    });
    return sortRemindersBySchedule(base);
  }, [reminders, activeTab, selectedCategory]);

  const overdueReminders = useMemo(
    () =>
      activeTab === 'upcoming'
        ? filteredReminders.filter(r => isReminderOverdue(r))
        : [],
    [filteredReminders, activeTab],
  );

  const upcomingReminders = useMemo(
    () =>
      activeTab === 'upcoming'
        ? filteredReminders.filter(r => !isReminderOverdue(r))
        : filteredReminders,
    [filteredReminders, activeTab],
  );

  const handleToggleReminder = useCallback(
    (id: string) => {
      const updated = toggleReminder(id);
      if (updated) {
        Toast.show({
          type: 'success',
          text1: updated.done ? 'Reminder acknowledged' : 'Reminder restored',
          text2: updated.done
            ? 'Marked as completed.'
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

  const handleDeleteReminder = useCallback(
    (rem: Reminder) => {
      Alert.alert(
        'Delete Reminder',
        `Are you sure you want to delete "${rem.title}"?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: () => {
              deleteReminder(rem.id);
              Toast.show({
                type: 'info',
                text1: 'Reminder Deleted',
                text2: 'Alert removed from your schedule.',
              });
            },
          },
        ],
      );
    },
    [deleteReminder],
  );

  const handleLongPressReminder = useCallback(
    (rem: Reminder) => {
      Alert.alert(rem.title, 'Choose an action', [
        ...(!rem.done
          ? [
              {
                text: 'Snooze',
                onPress: () => setSnoozingReminder(rem),
              },
            ]
          : []),
        {
          text: 'Edit',
          onPress: () => setEditingReminder(rem),
        },
        {
          text: 'View Details',
          onPress: () => handleViewDetails(rem),
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => handleDeleteReminder(rem),
        },
        { text: 'Cancel', style: 'cancel' },
      ]);
    },
    [handleViewDetails, handleDeleteReminder],
  );

  const handleRescheduleAllOverdue = useCallback(() => {
    const count = rescheduleOverdueToToday(overdueReminders.map(r => r.id));
    if (count > 0) {
      Toast.show({
        type: 'success',
        text1: 'Overdue Alerts Rescheduled',
        text2: `Moved ${count} reminder${count > 1 ? 's' : ''} to today.`,
      });
    }
  }, [rescheduleOverdueToToday, overdueReminders]);

  const handleBulkToggle = useCallback(() => {
    const ids = filteredReminders.map(r => r.id);
    if (activeTab === 'upcoming') {
      const count = completeAllReminders(ids);
      if (count > 0) {
        Toast.show({
          type: 'success',
          text1: 'All reminders acknowledged',
          text2: `Completed ${count} reminder${count > 1 ? 's' : ''}.`,
        });
      }
    } else {
      const count = restoreAllReminders(ids);
      if (count > 0) {
        Toast.show({
          type: 'success',
          text1: 'Reminders restored to active list',
          text2: `${count} reminder${count > 1 ? 's' : ''} returned to upcoming.`,
        });
      }
    }
  }, [filteredReminders, activeTab, completeAllReminders, restoreAllReminders]);

  // Section title matching TasksScreen & HabitsScreen header badges
  const sectionTitle = useMemo(() => {
    if (activeTab === 'completed') {
      return 'Completed Alerts';
    }
    if (selectedCategory && selectedCategory !== 'all') {
      return `${
        selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)
      } Alerts`;
    }
    return 'Scheduled Alerts';
  }, [activeTab, selectedCategory]);

  // Section subtitle: pending / overdue summary
  const sectionSubtitle = useMemo(() => {
    if (activeTab === 'completed') {
      return `${filteredReminders.length} finished alerts`;
    }
    if (overdueReminders.length > 0) {
      return `${overdueReminders.length} overdue · ${upcomingReminders.length} upcoming`;
    }
    return `${filteredReminders.length} upcoming alerts`;
  }, [
    filteredReminders.length,
    activeTab,
    overdueReminders.length,
    upcomingReminders.length,
  ]);

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
              backgroundColor: isScrolled ? accentDeep : bgMain,
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
            paddingTop:
              insets.top + SCREEN_HEADER_HEIGHT + ResponsivePixels.size10,
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
          {/* Snooze Bottom Sheet */}
      <SnoozeBottomSheet
        visible={snoozingReminder !== null}
        reminder={snoozingReminder}
        onClose={() => setSnoozingReminder(null)}
        onSelectSnooze={async (id, minutes) => {
          await snoozeReminder(id, minutes);
          Toast.show({
            type: 'info',
            text1: 'Reminder Snoozed',
            text2: `Alert rescheduled in ${minutes} minutes.`,
          });
        }}
      />

      {/* Notification Permission Onboarding Sheet */}
      <NotificationPermissionSheet
        visible={isPermissionSheetVisible}
        onAllow={requestNotificationPermission}
        onDismiss={dismissPermissionSheet}
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
          bottomPadding={insets.bottom + ResponsivePixels.size130}
          containerStyle={styles.reminderSection}
        >
          {/* Notification Permission Banner */}
          {!hasNotificationPermission && pendingRemindersCount > 0 && (
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={openPermissionSheet}
              style={[
                styles.permissionBanner,
                isDarkMode && {
                  backgroundColor: withAlpha(Colors.AccentAmber, 0.12),
                  borderColor: withAlpha(Colors.AccentAmber, 0.35),
                },
              ]}
              accessibilityRole="button"
              accessibilityLabel="Enable reminder notifications"
            >
              <BellOff
                size={ResponsivePixels.size15}
                color={Colors.AccentAmber}
                strokeWidth={2.3}
              />
              <Text
                style={[styles.permissionBannerText, { color: textPrimary }]}
                numberOfLines={2}
              >
                Notifications are off — tap to enable alert delivery.
              </Text>
            </TouchableOpacity>
          )}

          {/* Reminders List or Empty State */}
          {filteredReminders.length === 0 ? (
            <View style={styles.emptyContainer}>
              <ReminderEmptyDoodleSvg />
              <Text style={[styles.emptyTitle, { color: textPrimary }]}>
                {activeTab === 'completed'
                  ? 'Nothing completed yet'
                  : 'Your schedule is clear'}
              </Text>
              <Text style={[styles.emptySubtitle, { color: textSecondary }]}>
                {activeTab === 'completed'
                  ? 'Completed alerts will appear here.'
                  : 'Tap “+” or the button below to schedule an alert.'}
              </Text>
              <TouchableOpacity
                activeOpacity={0.85}
                style={styles.addEmptyBtn}
                onPress={() =>
                  activeTab === 'completed'
                    ? setActiveTab('upcoming')
                    : openReminderModal()
                }
              >
                {activeTab !== 'completed' && (
                  <Plus
                    size={ResponsivePixels.size15}
                    color={Colors.PureWhite}
                    strokeWidth={2.5}
                  />
                )}
                <Text style={styles.addEmptyBtnText}>
                  {activeTab === 'completed' ? 'View Upcoming' : 'Add Reminder'}
                </Text>
              </TouchableOpacity>
              {/* Snooze Bottom Sheet */}
      <SnoozeBottomSheet
        visible={snoozingReminder !== null}
        reminder={snoozingReminder}
        onClose={() => setSnoozingReminder(null)}
        onSelectSnooze={async (id, minutes) => {
          await snoozeReminder(id, minutes);
          Toast.show({
            type: 'info',
            text1: 'Reminder Snoozed',
            text2: `Alert rescheduled in ${minutes} minutes.`,
          });
        }}
      />

      {/* Notification Permission Onboarding Sheet */}
      <NotificationPermissionSheet
        visible={isPermissionSheetVisible}
        onAllow={requestNotificationPermission}
        onDismiss={dismissPermissionSheet}
      />
    </View>
          ) : (
            <View style={styles.reminderListWrapper}>
              {activeTab === 'upcoming' && overdueReminders.length > 0 && (
                <OverdueSection
                  overdueReminders={overdueReminders}
                  onRescheduleAll={handleRescheduleAllOverdue}
                  renderCard={rem => (
                    <ReminderCardItem
                      reminder={rem}
                      isChecked={rem.done}
                      onToggle={handleToggleReminder}
                      isSpeaking={speakingReminderId === rem.id}
                      onSpeak={handleSpeakReminder}
                      onEdit={setEditingReminder}
                      onDetails={handleViewDetails}
                      onDelete={handleDeleteReminder}
                      onLongPress={handleLongPressReminder}
                    />
                  )}
                />
              )}

              <FlatList
                data={upcomingReminders}
                keyExtractor={item => item.id}
                scrollEnabled={false}
                renderItem={({ item: rem }) => (
                  <ReminderCardItem
                    reminder={rem}
                    isChecked={rem.done}
                    onToggle={handleToggleReminder}
                    isSpeaking={speakingReminderId === rem.id}
                    onSpeak={handleSpeakReminder}
                    onEdit={setEditingReminder}
                    onDetails={handleViewDetails}
                    onDelete={handleDeleteReminder}
                    onLongPress={handleLongPressReminder}
                  />
                )}
                style={styles.reminderList}
                contentContainerStyle={styles.listContent}
              />

              {/* Complete / Restore All Reminder Button */}
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={handleBulkToggle}
                style={styles.selectAllBtn}
              >
                <Text style={styles.selectAllText}>
                  {activeTab === 'upcoming'
                    ? selectedCategory && selectedCategory !== 'all'
                      ? `Complete All ${
                          selectedCategory.charAt(0).toUpperCase() +
                          selectedCategory.slice(1)
                        }`
                      : 'Complete All Reminders'
                    : 'Restore All to Active'}
                </Text>
              </TouchableOpacity>
              {/* Snooze Bottom Sheet */}
      <SnoozeBottomSheet
        visible={snoozingReminder !== null}
        reminder={snoozingReminder}
        onClose={() => setSnoozingReminder(null)}
        onSelectSnooze={async (id, minutes) => {
          await snoozeReminder(id, minutes);
          Toast.show({
            type: 'info',
            text1: 'Reminder Snoozed',
            text2: `Alert rescheduled in ${minutes} minutes.`,
          });
        }}
      />

      {/* Notification Permission Onboarding Sheet */}
      <NotificationPermissionSheet
        visible={isPermissionSheetVisible}
        onAllow={requestNotificationPermission}
        onDismiss={dismissPermissionSheet}
      />
    </View>
          )}

          {/* Footer brand watermark */}
          <DailyQuoteFooter
            screen="reminders"
            doodle={<ReminderWatermarkDoodleSvg />}
          />
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
      {/* Snooze Bottom Sheet */}
      <SnoozeBottomSheet
        visible={snoozingReminder !== null}
        reminder={snoozingReminder}
        onClose={() => setSnoozingReminder(null)}
        onSelectSnooze={async (id, minutes) => {
          await snoozeReminder(id, minutes);
          Toast.show({
            type: 'info',
            text1: 'Reminder Snoozed',
            text2: `Alert rescheduled in ${minutes} minutes.`,
          });
        }}
      />

      {/* Notification Permission Onboarding Sheet */}
      <NotificationPermissionSheet
        visible={isPermissionSheetVisible}
        onAllow={requestNotificationPermission}
        onDismiss={dismissPermissionSheet}
      />
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
    paddingTop: ResponsivePixels.size5,
    paddingHorizontal: ResponsivePixels.size10,
    marginBottom: ResponsivePixels.size4,
  },

  // Reminders Section Container matching TasksScreen & HabitsScreen
  reminderSection: {
    backgroundColor: Colors.SoftCream,
    borderTopLeftRadius: ResponsivePixels.size32,
    borderTopRightRadius: ResponsivePixels.size32,
    borderWidth: 1.5,
    borderTopColor: Colors.WarmNavBevelTop,
    borderLeftColor: Colors.WarmNavBevelSide,
    borderRightColor: Colors.WarmNavBevelSide,
    borderBottomWidth: 0,
    paddingHorizontal: ResponsivePixels.size8,
    paddingTop: ResponsivePixels.size40,
    marginTop: ResponsivePixels.size26,
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
    borderTopLeftRadius: ResponsivePixels.size32,
    borderTopRightRadius: ResponsivePixels.size32,
    overflow: 'hidden',
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
    zIndex: 20,
    overflow: 'hidden',
  },
  flowTitle: {
    fontFamily: Fonts.poppins.bold,
    fontSize: ResponsivePixels.size14_5,
    color: Colors.PureWhite,
    letterSpacing: -0.1,
    textAlign: 'center',
  },
  flowSubtitle: {
    fontFamily: Fonts.poppins.medium,
    fontSize: ResponsivePixels.size10_5,
    color: Colors.CoolSilverSubtitle,
    marginTop: ResponsivePixels.size1,
    textAlign: 'center',
  },
  addReminderFloatingBtn: {
    position: 'absolute',
    top: -ResponsivePixels.size21,
    right: ResponsivePixels.size18,
    width: ResponsivePixels.size42,
    height: ResponsivePixels.size42,
    borderRadius: ResponsivePixels.size21,
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
    gap: ResponsivePixels.size12,
    paddingTop: ResponsivePixels.size10,
    paddingHorizontal: 0,
    paddingBottom: ResponsivePixels.size20,
    overflow: 'visible',
  },
  selectAllBtn: {
    backgroundColor: Colors.MidnightCharcoal,
    borderRadius: ResponsivePixels.size50,
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
    fontSize: ResponsivePixels.size13_5,
  },

  // Empty State
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: ResponsivePixels.size40,
    paddingHorizontal: ResponsivePixels.size20,
    gap: ResponsivePixels.size8,
  },
  emptyTitle: {
    ...Typography.bodyMediumPoppinsSemiBold,
    color: Colors.Gray700,
    fontSize: ResponsivePixels.size15,
    marginTop: ResponsivePixels.size6,
  },
  emptySubtitle: {
    ...Typography.bodySmallPoppinsRegular,
    color: Colors.Gray400,
    textAlign: 'center',
    paddingHorizontal: ResponsivePixels.size20,
    lineHeight: ResponsivePixels.size18,
  },
  addEmptyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ResponsivePixels.size6,
    backgroundColor: Colors.MidnightCharcoal,
    paddingHorizontal: ResponsivePixels.size20,
    paddingVertical: ResponsivePixels.size10,
    borderRadius: ResponsivePixels.size50,
    marginTop: ResponsivePixels.size12,
  },
  addEmptyBtnText: {
    ...Typography.bodySmallPoppinsSemiBold,
    color: Colors.PureWhite,
    fontSize: ResponsivePixels.size12_5,
  },
  permissionBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ResponsivePixels.size10,
    backgroundColor: Colors.CategoryOrangeSoftBg,
    borderRadius: ResponsivePixels.size14,
    borderWidth: 1,
    borderColor: Colors.EventLightBorder,
    paddingHorizontal: ResponsivePixels.size12,
    paddingVertical: ResponsivePixels.size10,
    marginBottom: ResponsivePixels.size12,
  },
  permissionBannerText: {
    flex: 1,
    fontFamily: Fonts.poppins.medium,
    fontSize: ResponsivePixels.size12,
  },
});

export default RemindersScreen;
