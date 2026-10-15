import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  Platform,
} from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import { Plus, House, CheckSquare, Bell, Flame } from 'lucide-react-native';

import { DashboardScreen } from '../Screens/Dashboard';
import TasksScreen from '../Screens/Tasks/TasksScreen';
import RemindersScreen from '../Screens/Reminders/RemindersScreen';
import { HabitsScreen } from '../Screens/Habits';
import { Colors } from '../Assets/StyleUtilities/Colors';
import { Typography } from '../Theme/Typographys';
import { Fonts } from '../Theme/fonts';
import PlusActionSheet from './PlusActionSheet';
import { useTaskReminder } from '../Context/TaskReminderContext';
import { useVoiceWakeWord } from '../Context/VoiceWakeWordContext';
import AddTaskModal from '../Components/AddTaskModal';
import AddReminderModal from '../Components/AddReminderModal';

// ─── Dimensions ───────────────────────────────────────────────────────────────

const { width: SW } = Dimensions.get('window');

const H_MARGIN = 20; // left/right float gap
const BAR_W = SW - H_MARGIN * 2;
const BAR_H = 64;
const CORNER_R = 34;

const NOTCH_W = 40; // half-width of notch opening
const NOTCH_DEEP = 24; // depth of curve
const CP = 18; // bezier control-point spread

const BTN_SIZE = 54;
const BTN_RING = 8; // cream ring around button
const BTN_FLOAT = 22; // how far center of button floats above bar top

const SIDE_PADDING = 14; // breathing room from rounded pill caps
const TAB_SLOT_W = (BAR_W - SIDE_PADDING * 2) / 5; // equal width for all 5 slots

// ─── SVG curved card (rounded corners + center notch) ────────────────────────

const BAR_BORDER_W = 4; // cream border matching plus button halo

const CurvedBar: React.FC = () => {
  const W = BAR_W;
  const H = BAR_H;
  const cx = W / 2;
  const R = CORNER_R;

  const d = [
    `M ${R} 0`,
    `L ${cx - NOTCH_W} 0`,
    // curve down into notch
    `C ${cx - NOTCH_W + CP} 0, ${
      cx - NOTCH_W * 0.55
    } ${NOTCH_DEEP}, ${cx} ${NOTCH_DEEP}`,
    // curve back up out of notch
    `C ${cx + NOTCH_W * 0.55} ${NOTCH_DEEP}, ${cx + NOTCH_W - CP} 0, ${
      cx + NOTCH_W
    } 0`,
    `L ${W - R} 0`,
    `Q ${W} 0, ${W} ${R}`,
    `L ${W} ${H - R}`,
    `Q ${W} ${H}, ${W - R} ${H}`,
    `L ${R} ${H}`,
    `Q 0 ${H}, 0 ${H - R}`,
    `L 0 ${R}`,
    `Q 0 0, ${R} 0 Z`,
  ].join(' ');

  const pad = BAR_BORDER_W;

  return (
    <Svg
      width={BAR_W + pad * 2}
      height={BAR_H + pad * 2}
      viewBox={`${-pad} ${-pad} ${BAR_W + pad * 2} ${BAR_H + pad * 2}`}
      style={{
        position: 'absolute',
        top: -pad,
        left: -pad,
      }}
    >
      <Path
        d={d}
        fill={Colors.LavenderPurple}
        stroke={Colors.CreamBackground}
        strokeWidth={BAR_BORDER_W}
        strokeLinejoin="round"
      />
    </Svg>
  );
};

// ─── Tab definitions ──────────────────────────────────────────────────────────

const LEFT_TABS = [
  { name: 'Dashboard', label: 'Dashboard', Icon: House },
  { name: 'Tasks', label: 'Tasks', Icon: CheckSquare },
];
const RIGHT_TABS = [
  { name: 'Reminders', label: 'Reminders', Icon: Bell },
  { name: 'Habits', label: 'Habits', Icon: Flame },
];
const ALL_TABS = [...LEFT_TABS, ...RIGHT_TABS];

// ─── Custom tab bar ───────────────────────────────────────────────────────────

const CustomTabBar: React.FC<BottomTabBarProps> = ({ state, navigation }) => {
  const insets = useSafeAreaInsets();
  const safeBot = Math.max(insets.bottom, 8);

  // Height the nav system reserves: bar + button float + safe area
  const totalH = BAR_H + BTN_FLOAT + (BTN_SIZE + BTN_RING) / 2 + safeBot + 4;

  const { openTaskModal, openReminderModal } = useTaskReminder();
  const { triggerWakeWord } = useVoiceWakeWord();

  const scaleAnims = React.useRef(
    ALL_TABS.map(() => new Animated.Value(1)),
  ).current;
  const [isSheetOpen, setIsSheetOpen] = React.useState(false);
  const [isWrapperExpanded, setIsWrapperExpanded] = React.useState(false);

  const plusScale = React.useRef(new Animated.Value(1)).current;
  const plusRotate = React.useRef(new Animated.Value(0)).current;

  const animateTab = (i: number) => {
    Animated.sequence([
      Animated.timing(scaleAnims[i], {
        toValue: 0.78,
        duration: 70,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnims[i], {
        toValue: 1,
        friction: 5,
        tension: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const openSheet = () => {
    setIsWrapperExpanded(true);
    setIsSheetOpen(true);
    Animated.parallel([
      Animated.sequence([
        Animated.timing(plusScale, {
          toValue: 0.84,
          duration: 70,
          useNativeDriver: true,
        }),
        Animated.spring(plusScale, {
          toValue: 1,
          friction: 4,
          tension: 250,
          useNativeDriver: true,
        }),
      ]),
      Animated.spring(plusRotate, {
        toValue: 1,
        friction: 6,
        tension: 180,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const closeSheet = () => {
    setIsSheetOpen(false);
    Animated.parallel([
      Animated.sequence([
        Animated.timing(plusScale, {
          toValue: 0.88,
          duration: 70,
          useNativeDriver: true,
        }),
        Animated.spring(plusScale, {
          toValue: 1,
          friction: 5,
          tension: 200,
          useNativeDriver: true,
        }),
      ]),
      Animated.spring(plusRotate, {
        toValue: 0,
        friction: 6,
        tension: 180,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const toggleSheet = () => {
    if (isSheetOpen) {
      closeSheet();
    } else {
      openSheet();
    }
  };

  const pressTab = (name: string, focused: boolean, tabIdx: number) => {
    if (isSheetOpen) {
      closeSheet();
    }
    animateTab(tabIdx);
    if (!focused) {
      const ri = state.routes.findIndex(r => r.name === name);
      const ev = navigation.emit({
        type: 'tabPress',
        target: state.routes[ri].key,
        canPreventDefault: true,
      });
      if (!ev.defaultPrevented) navigation.navigate(name);
    }
  };

  const rotateDeg = plusRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '135deg'],
  });

  const renderTab = (
    tab: { name: string; label: string; Icon: React.ComponentType<any> },
    tabIdx: number,
  ) => {
    const ri = state.routes.findIndex(r => r.name === tab.name);
    const focused = state.index === ri;

    return (
      <TouchableOpacity
        key={tab.name}
        activeOpacity={0.8}
        onPress={() => pressTab(tab.name, focused, tabIdx)}
        style={styles.tabItem}
      >
        <Animated.View
          style={[
            styles.tabInner,
            { transform: [{ scale: scaleAnims[tabIdx] }] },
          ]}
        >
          <tab.Icon
            size={22}
            color={focused ? Colors.PureWhiteText : 'rgba(255, 255, 255, 0.65)'}
            strokeWidth={focused ? 2.4 : 1.7}
          />
          <Text
            numberOfLines={1}
            style={[styles.label, focused && styles.labelActive]}
          >
            {tab.label}
          </Text>
        </Animated.View>
      </TouchableOpacity>
    );
  };

  // Bar card sits at the bottom of totalH wrapper; button floats above bar top
  const barBottom = safeBot;
  const btnCenterY = barBottom + BAR_H + BTN_FLOAT; // from bottom of wrapper
  const btnBottom = btnCenterY - (BTN_SIZE + BTN_RING) / 2;

  return (
    <View
      pointerEvents="box-none"
      style={[
        styles.floatWrapper,
        isWrapperExpanded
          ? StyleSheet.absoluteFill
          : { bottom: 0, left: 0, right: 0, height: totalH },
      ]}
    >
      {/* ── Background curved card (SVG shape + shadow) ── */}
      <View
        pointerEvents="none"
        style={[
          styles.card,
          styles.shadow,
          { bottom: barBottom, left: H_MARGIN, width: BAR_W, height: BAR_H },
        ]}
      >
        <CurvedBar />
      </View>

      {/* ── Tab buttons row (rendered over background) ── */}
      <View
        pointerEvents="box-none"
        style={[
          styles.card,
          { bottom: barBottom, left: H_MARGIN, width: BAR_W, height: BAR_H },
        ]}
      >
        <View style={styles.row}>
          {LEFT_TABS.map((t, i) => renderTab(t, i))}
          {/* Center spacer — sits under notch with equal slot width */}
          <View style={{ width: TAB_SLOT_W }} pointerEvents="none" />
          {RIGHT_TABS.map((t, i) => renderTab(t, i + 2))}
        </View>
      </View>

      {/* ── Animated Quick Action Sheet (dim backdrop + action card) ── */}
      <PlusActionSheet
        visible={isSheetOpen}
        onClose={closeSheet}
        onPressNewTask={() => {
          closeSheet();
          openTaskModal();
        }}
        onPressNewReminder={() => {
          closeSheet();
          openReminderModal();
        }}
        bottomOffset={btnBottom + BTN_SIZE + BTN_RING + 14}
        onDismissed={() => setIsWrapperExpanded(false)}
      />

      {/* ── Floating plus/cross button (outside card to avoid clipping) ── */}
      <View
        style={[
          styles.btnWrap,
          { bottom: btnBottom, left: SW / 2 - (BTN_SIZE + BTN_RING) / 2 },
        ]}
      >
        {/* Cream halo — visually separates button from bar */}
        <View style={[styles.btnHalo, styles.btnShadow]}>
          <Animated.View
            style={[
              styles.btnCircle,
              { transform: [{ scale: plusScale }, { rotate: rotateDeg }] },
            ]}
          >
            <TouchableOpacity
              activeOpacity={0.88}
              onPress={toggleSheet}
              onLongPress={() => triggerWakeWord()}
              delayLongPress={320}
              style={styles.btnTouch}
              accessibilityRole="button"
              accessibilityLabel={
                isSheetOpen
                  ? 'Close menu'
                  : 'Add new item (Long press for Voice)'
              }
            >
              <Plus size={26} color={Colors.PureWhiteText} strokeWidth={2.6} />
            </TouchableOpacity>
          </Animated.View>
        </View>
      </View>
    </View>
  );
};

// ─── Navigator ────────────────────────────────────────────────────────────────

const Tab = createBottomTabNavigator();

const renderTabBar = (props: BottomTabBarProps) => <CustomTabBar {...props} />;

export default function BottomTabNavigator() {
  const {
    isTaskModalOpen,
    closeTaskModal,
    addTask,
    isReminderModalOpen,
    closeReminderModal,
    addReminder,
  } = useTaskReminder();

  return (
    <>
      <Tab.Navigator
        tabBar={renderTabBar}
        screenOptions={{ headerShown: false }}
      >
        <Tab.Screen name="Dashboard" component={DashboardScreen} />
        <Tab.Screen name="Tasks" component={TasksScreen} />
        <Tab.Screen name="Reminders" component={RemindersScreen} />
        <Tab.Screen name="Habits" component={HabitsScreen} />
      </Tab.Navigator>

      <AddTaskModal
        visible={isTaskModalOpen}
        onClose={closeTaskModal}
        onCreateTask={taskData => {
          addTask(taskData);
          closeTaskModal();
        }}
      />

      <AddReminderModal
        visible={isReminderModalOpen}
        onClose={closeReminderModal}
        onCreateReminder={reminderData => {
          addReminder(reminderData);
          closeReminderModal();
        }}
      />
    </>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  // Absolute wrapper — floats over screen content
  floatWrapper: {
    position: 'absolute',
    zIndex: 100,
    backgroundColor: 'transparent',
  },

  // Floating white card
  // NOTE: no borderRadius here — SVG handles the visual shape.
  // Adding borderRadius with overflow:hidden on a 64px-tall card
  // where CORNER_R=34 would clip all children (radius > 50% height).
  card: {
    position: 'absolute',
  },
  shadow: {
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.09,
        shadowRadius: 20,
      },
      android: { elevation: 12 },
    }),
  },

  // Tab layout
  row: {
    flexDirection: 'row',
    height: BAR_H,
    alignItems: 'center',
    paddingHorizontal: SIDE_PADDING,
    paddingBottom: 2,
  },
  tabItem: {
    flex: 1,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabInner: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
    paddingHorizontal: 2,
    position: 'relative',
  },
  label: {
    ...Typography.bodySuperSmallPoppinsRegularLoose,
    fontFamily: Fonts.poppins.medium,
    fontSize: 9.5,
    lineHeight: 12,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  labelActive: {
    ...Typography.bodySuperSmallPoppinsSemiBoldLoose,
    fontFamily: Fonts.poppins.bold,
    fontSize: 9.5,
    lineHeight: 12,
    color: Colors.PureWhiteText,
  },

  // Plus button
  btnWrap: {
    position: 'absolute',
    zIndex: 110,
  },
  btnHalo: {
    width: BTN_SIZE + BTN_RING,
    height: BTN_SIZE + BTN_RING,
    borderRadius: (BTN_SIZE + BTN_RING) / 2,
    backgroundColor: Colors.CreamBackground,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnShadow: {
    ...Platform.select({
      ios: {
        shadowColor: Colors.LavenderPurple,
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.45,
        shadowRadius: 12,
      },
      android: { elevation: 16 },
    }),
  },
  btnCircle: {
    width: BTN_SIZE,
    height: BTN_SIZE,
    borderRadius: BTN_SIZE / 2,
    backgroundColor: Colors.LavenderPurple,
    overflow: 'hidden',
  },
  btnTouch: {
    width: BTN_SIZE,
    height: BTN_SIZE,
    borderRadius: BTN_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
