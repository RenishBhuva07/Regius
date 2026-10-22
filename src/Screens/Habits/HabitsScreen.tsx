import React, { useState, useMemo, useCallback, useRef } from 'react';
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
import { Plus, Flame } from 'lucide-react-native';
import Toast from 'react-native-toast-message';

import { Fonts } from '../../Theme/fonts';
import { Typography } from '../../Theme/Typographys';
import { Colors } from '../../Assets/StyleUtilities/Colors';
import { useTaskReminder, HabitItem } from '../../Context/TaskReminderContext';
import HabitConsistencyBento from './Components/HabitConsistencyBento';
import HabitCategoryFilters, {
  HabitFilterKey,
} from './Components/HabitCategoryFilters';
import HabitItemCard from './Components/HabitItemCard';
import HabitSectionBackgroundSvg from './Components/HabitSectionBackgroundSvg';
import FlowBadgePatternSvg from '../Dashboard/Components/FlowBadgePatternSvg';
import AddHabitModal from '../../Components/AddHabitModal';
import { ScreenHeader, SCREEN_HEADER_HEIGHT } from '../../Common/ScreenHeader';
import HabitNotesDoodleSvg from './Components/HabitNotesDoodleSvg';
import ResponsivePixels from '../../Assets/StyleUtilities/ResponsivePixels';
import { useDailyQuote } from '../../Services/DailyQuotes';

export const HabitsScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const dailyQuote = useDailyQuote('habits');

  const {
    habits,
    toggleHabit,
    addHabit,
    updateHabit,
    deleteHabit,
    isHabitModalOpen,
    openHabitModal,
    closeHabitModal,
  } = useTaskReminder();

  const [filter, setFilter] = useState<HabitFilterKey>('all');
  const [editingHabit, setEditingHabit] = useState<HabitItem | null>(null);

  // Scroll tracking matching DashboardScreen reactive header
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

  const handleToggleHabit = useCallback(
    (id: string) => {
      const updated = toggleHabit(id);
      if (updated) {
        Toast.show({
          type: 'success',
          text1: updated.completed ? 'Habit Checked In! 🔥' : 'Habit Reset',
          text2: updated.completed
            ? `Momentum active! Current streak: ${updated.streak} days`
            : 'Unchecked for today.',
        });
      }
    },
    [toggleHabit],
  );

  const filteredHabits = useMemo(() => {
    return habits.filter(h => {
      if (filter === 'all') return true;
      return h.category === filter;
    });
  }, [habits, filter]);

  const completedCount = useMemo(
    () => habits.filter(h => h.completed).length,
    [habits],
  );

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

      {/* Reusable Screen Header with title, subtitle, Holograph voice orb, and profile */}
      <ScreenHeader
        title="Habits"
        subtitle="Daily Rituals & Consistency"
        scrollY={scrollY}
        isScrolled={isScrolled}
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: insets.top + SCREEN_HEADER_HEIGHT + 10,
            paddingBottom: 0,
          },
        ]}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {/* Habit Streak & Consistency Bento Card matching DailyBriefingCard */}
        <View style={styles.bentoCardWrapper}>
          <HabitConsistencyBento habits={habits} />
        </View>

        {/* 3D Tactile Filter Capsules scrolling left to right edge */}
        <HabitCategoryFilters
          activeFilter={filter}
          onSelectFilter={setFilter}
          habits={habits}
        />

        {/* Habits Section with centered black crest badge & top-right floating plus button */}
        <View
          style={[styles.habitsSection, { paddingBottom: insets.bottom + 130 }]}
        >
          {/* Aesthetic luxury background */}
          <View style={styles.habitsSectionBgWrapper} pointerEvents="none">
            <HabitSectionBackgroundSvg />
          </View>

          {/* Header crest badge centered on top border - half outside, half inside */}
          <View style={styles.flowHeaderBadge}>
            <FlowBadgePatternSvg />
            <Text style={styles.flowTitle}>Today’s Rituals</Text>
            <Text style={styles.flowSubtitle}>
              {completedCount} of {filteredHabits.length} completed
            </Text>
          </View>

          {/* New Habit floating button at right corner - half outside, half inside */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={openHabitModal}
            style={styles.addHabitFloatingBtn}
            accessibilityRole="button"
            accessibilityLabel="Add new habit"
          >
            <Plus size={18} color="#FFFFFF" strokeWidth={2.6} />
          </TouchableOpacity>

          {/* All habits list using FlatList */}
          <FlatList
            data={filteredHabits}
            keyExtractor={item => item.id}
            scrollEnabled={false}
            contentContainerStyle={styles.habitListContainer}
            renderItem={({ item }) => (
              <HabitItemCard
                habit={item}
                onToggle={handleToggleHabit}
                onEdit={setEditingHabit}
              />
            )}
            ItemSeparatorComponent={() => <View style={styles.listSeparator} />}
            ListEmptyComponent={
              <View style={styles.emptyCard}>
                <Flame size={32} color="#D8D4CA" strokeWidth={1.5} />
                <Text style={styles.emptyTitle}>No Rituals In This Flow</Text>
                <Text style={styles.emptySubtitle}>
                  Tap below to establish your next healthy daily habit.
                </Text>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={openHabitModal}
                  style={styles.emptyCreateBtn}
                >
                  <Plus size={14} color="#FFFFFF" strokeWidth={2.4} />
                  <Text style={styles.emptyCreateText}>Add Habit</Text>
                </TouchableOpacity>
              </View>
            }
          />

          {/* Swiggy-Inspired Brand Watermark Footer: "Your future self is taking notes!" + "Crafted with ❤️ in Ahmedabad, India" + Habit Notes Doodles */}
          <View style={styles.footerWatermarkWrapper} pointerEvents="none">
            <View style={styles.footerWatermarkRow}>
              {/* Left Column: Bold Typography & Sign-off */}
              <View style={styles.footerTextBlock}>
                <Text style={styles.footerWatermarkText}>{dailyQuote}</Text>
                <View style={styles.craftedWithRow}>
                  <Text style={styles.craftedWithText}>Crafted with </Text>
                  <Text style={styles.craftedWithHeart}>❤️</Text>
                  <Text style={styles.craftedWithText}>
                    {' '}
                    in Ahmedabad, India
                  </Text>
                </View>
              </View>

              {/* Right Column: Extraordinary Habit Notes Doodle Illustration */}
              <View style={styles.footerDoodleWrapper}>
                <HabitNotesDoodleSvg />
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Add / Edit Habit Modal */}
      <AddHabitModal
        visible={isHabitModalOpen || editingHabit !== null}
        onClose={() => {
          closeHabitModal();
          setEditingHabit(null);
        }}
        habitToEdit={editingHabit}
        onCreateHabit={habitData => {
          addHabit(habitData);
          closeHabitModal();
        }}
        onUpdateHabit={(id, habitData) => {
          updateHabit(id, habitData);
          setEditingHabit(null);
        }}
        onDeleteHabit={id => {
          deleteHabit(id);
          setEditingHabit(null);
        }}
      />
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
    // gap: 16,
  },
  bentoCardWrapper: {
    paddingTop: 5,
    paddingHorizontal: 10,
  },
  habitsSection: {
    backgroundColor: Colors.SoftCream,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    borderWidth: 1.5,
    borderTopColor: '#FAF6EE',
    borderLeftColor: '#EFE9DE',
    borderRightColor: '#EFE9DE',
    borderBottomColor: '#DDD6C6',
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
  habitsSectionBgWrapper: {
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
  addHabitFloatingBtn: {
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
  habitListContainer: {
    paddingTop: 8,
    paddingBottom: 20,
  },
  listSeparator: {
    height: 12,
  },
  emptyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#ECE7DC',
    gap: 8,
    marginHorizontal: 0,
  },
  emptyTitle: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: 15,
    color: '#1B1C19',
    marginTop: 4,
  },
  emptySubtitle: {
    fontFamily: Fonts.poppins.regular,
    fontSize: 12,
    color: '#8E8E93',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  emptyCreateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.MidnightCharcoal,
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 18,
    marginTop: 8,
  },
  emptyCreateText: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: 12,
    color: '#FFFFFF',
  },

  // Swiggy-Inspired Watermark Footer
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
  footerTextBlock: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  footerWatermarkText: {
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
});

export default HabitsScreen;
