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
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Check,
  X,
  Calendar,
  Clock,
  Sparkles,
  Plus,
  FileText,
  Volume2,
  ArrowRight,
  ArrowDown,
  Bell,
  RotateCw,
  Play,
  AlertTriangle,
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
import { useOptionalVoiceWakeWord } from '../Context/VoiceWakeWordContext';
import FlowBadgePatternSvg from '../Screens/Dashboard/Components/FlowBadgePatternSvg';
import TaskCardAestheticBg from './TaskCardAestheticBg';
import PickerAestheticBg from './PickerAestheticBg';

// Inline 2-Tone Filled Emblem SVGs

const PictureEmblemIcon: React.FC<SvgProps & { size?: number }> = ({
  width,
  height,
  size = 18,
  color,
  ...rest
}) => {
  const w = width ?? size;
  const h = height ?? size;
  const c = color || '#6270F0';
  return (
    <Svg width={w} height={h} viewBox="0 0 14 14" fill="none" {...rest}>
      <Path
        opacity={0.4}
        d="M9.52747 12.8333H4.47193C2.49485 12.8333 1.16666 11.4467 1.16666 9.3825V4.61809C1.16666 2.5539 2.49485 1.16667 4.47193 1.16667H9.52805C11.5051 1.16667 12.8333 2.5539 12.8333 4.61809V9.3825C12.8333 11.4467 11.5051 12.8333 9.52747 12.8333Z"
        fill={c}
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6.55956 5.06043C6.55956 5.85959 5.90914 6.51001 5.10997 6.51001C4.31022 6.51001 3.66039 5.85959 3.66039 5.06043C3.66039 4.26126 4.31022 3.61026 5.10997 3.61026C5.90914 3.61026 6.55956 4.26126 6.55956 5.06043ZM11.3169 8.21778C11.4528 8.34961 11.5502 8.50011 11.6144 8.66053C11.8086 9.14586 11.7077 9.72919 11.5 10.2099C11.2539 10.7821 10.7825 11.2144 10.1887 11.4034C9.92504 11.4879 9.64854 11.5241 9.37263 11.5241H4.48371C3.99721 11.5241 3.56671 11.4109 3.21379 11.1986C2.99271 11.0656 2.95362 10.7594 3.11754 10.5599C3.39171 10.2274 3.66237 9.89369 3.93537 9.55711C4.45571 8.91311 4.80629 8.72644 5.19596 8.89036C5.35404 8.95803 5.51271 9.06011 5.67604 9.16744C6.11121 9.45561 6.71613 9.85111 7.51296 9.42178C8.05763 9.12395 8.3738 8.61431 8.64899 8.17072L8.65454 8.16178C8.67306 8.13209 8.69142 8.10242 8.70973 8.07283C8.80331 7.92163 8.89547 7.7727 8.99988 7.63561C9.12938 7.46586 9.61004 6.93503 10.2313 7.31303C10.6274 7.55103 10.9605 7.87303 11.3169 8.21778Z"
        fill={c}
      />
    </Svg>
  );
};

const OfficeBagIcon: React.FC<SvgProps & { size?: number }> = ({
  width,
  height,
  size = 18,
  color,
  ...rest
}) => {
  const w = width ?? size;
  const h = height ?? size;
  const c = color || '#8383D6';
  return (
    <Svg width={w} height={h} viewBox="23 19 24 24" fill="none" {...rest}>
      <Path
        opacity={0.4}
        d="M25.0002 30.0785C25.0502 32.4165 25.1902 36.4155 25.2102 36.8565C25.2812 37.7995 25.6422 38.7525 26.2042 39.4245C26.9862 40.3675 27.9492 40.7885 29.2922 40.7885C31.1482 40.7985 33.1942 40.7985 35.1812 40.7985C37.1762 40.7985 39.1122 40.7985 40.7472 40.7885C42.0712 40.7885 43.0642 40.3565 43.8362 39.4245C44.3982 38.7525 44.7592 37.7895 44.8102 36.8565C44.8302 36.4855 44.9302 32.1445 44.9902 30.0785H25.0002Z"
        fill={c}
      />
      <Path
        d="M34.2454 34.3842V35.6782C34.2454 36.0922 34.5814 36.4282 34.9954 36.4282C35.4094 36.4282 35.7454 36.0922 35.7454 35.6782V34.3842C35.7454 33.9702 35.4094 33.6342 34.9954 33.6342C35.4094 33.6342 34.2454 33.9702 34.2454 34.3842Z"
        fill={c}
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M33.2113 33.5564C33.1113 33.9194 32.7623 34.1514 32.3843 34.1014C29.8333 33.7454 27.3953 32.8404 25.3373 31.4814C25.1263 31.3434 25.0003 31.1074 25.0003 30.8554V27.3894C25.0003 25.2894 26.7123 23.5814 28.8173 23.5814H30.7843C30.9723 22.1294 32.2023 21.0004 33.7043 21.0004H36.2863C37.7873 21.0004 39.0183 22.1294 39.2063 23.5814H41.1833C43.2823 23.5814 44.9903 25.2894 44.9903 27.3894V30.8554C44.9903 31.1074 44.8633 31.3424 44.6543 31.4814C42.5923 32.8464 40.1443 33.7554 37.5763 34.1104C37.5413 34.1154 37.5073 34.1174 37.4733 34.1174C37.1343 34.1174 36.8313 33.8884 36.7463 33.5524C36.5443 32.7564 35.8213 32.1994 34.9903 32.1994C34.1483 32.1994 33.4333 32.7444 33.2113 33.5564ZM36.2863 22.5004H33.7043C33.0313 22.5004 32.4693 22.9604 32.3013 23.5814H37.6883C37.5203 22.9604 36.9583 22.5004 36.2863 22.5004Z"
        fill={c}
      />
    </Svg>
  );
};

const HeartEmblemIcon: React.FC<SvgProps & { size?: number }> = ({
  width,
  height,
  size = 18,
  color,
  ...rest
}) => {
  const w = width ?? size;
  const h = height ?? size;
  const c = color || '#F5C518';
  return (
    <Svg width={w} height={h} viewBox="0 0 14 14" fill="none" {...rest}>
      <Path
        opacity={0.4}
        d="M6.86933 12.7385C5.53756 11.9159 4.29955 10.946 3.17795 9.84643C2.38615 9.06136 1.78144 8.10277 1.41003 7.0439C0.746413 4.97888 1.51891 2.61886 3.67567 1.91823C4.81405 1.56073 6.05213 1.78019 7.00413 2.50824C7.95648 1.781 9.19416 1.56161 10.3326 1.91823C12.4894 2.61886 13.267 4.97888 12.6034 7.0439C12.235 8.10177 11.6339 9.06028 10.8459 9.84643C9.72324 10.9448 8.48537 11.9146 7.15448 12.7385L7.00932 12.8333L6.86933 12.7385Z"
        fill={c}
      />
      <Path
        d="M7.00637 12.8333L6.86933 12.7385C5.53591 11.916 4.29618 10.9461 3.17277 9.84643C2.37721 9.06245 1.7689 8.10377 1.39447 7.0439C0.73604 4.97888 1.50853 2.61886 3.6653 1.91823C4.80368 1.56072 6.05809 1.78036 7.00637 2.5145V12.8333Z"
        fill={c}
      />
      <Path
        d="M10.6344 5.83288C10.5173 5.82534 10.4081 5.76677 10.3326 5.67091C10.2571 5.57505 10.2219 5.45032 10.2351 5.32593C10.2478 4.91622 10.0147 4.54329 9.65518 4.3982C9.42722 4.33597 9.28917 4.08909 9.3462 3.84562C9.40031 3.60606 9.62463 3.45711 9.85008 3.51103C9.87855 3.51575 9.90595 3.52606 9.93089 3.54144C10.6517 3.81884 11.1184 4.5654 11.0813 5.38169C11.0801 5.50541 11.0319 5.62332 10.9476 5.70839C10.8634 5.79346 10.7503 5.83839 10.6344 5.83288Z"
        fill={c}
      />
    </Svg>
  );
};

const SparkleEmblemIcon: React.FC<SvgProps & { size?: number }> = ({
  width,
  height,
  size = 18,
  color,
  ...rest
}) => {
  const w = width ?? size;
  const h = height ?? size;
  const c = color || '#FB923C';
  return (
    <Svg width={w} height={h} viewBox="0 0 24 24" fill="none" {...rest}>
      <Path
        opacity={0.4}
        d="M12 2C12 7.5 7.5 12 2 12C7.5 12 12 16.5 12 22C12 16.5 16.5 12 22 12C16.5 12 12 7.5 12 2Z"
        fill={c}
      />
      <Path
        d="M12 5.5C12 9.1 9.1 12 5.5 12C9.1 12 12 14.9 12 18.5C12 14.9 14.9 12 18.5 12C14.9 12 12 9.1 12 5.5Z"
        fill={c}
      />
    </Svg>
  );
};

const FlameEmblemIcon: React.FC<SvgProps & { size?: number }> = ({
  width,
  height,
  size = 18,
  color,
  ...rest
}) => {
  const w = width ?? size;
  const h = height ?? size;
  const c = color || '#EF4444';
  return (
    <Svg width={w} height={h} viewBox="0 0 24 24" fill="none" {...rest}>
      <Path
        opacity={0.4}
        d="M12 2C10.5 4.5 9 7.2 9 9.8C9 10.7 9.3 11.5 9.7 12.2C8.7 12.2 7.7 12.8 7.2 13.7C6.5 15 6.7 16.6 7.6 17.8C8.7 19.3 10.3 20 12 20C15.9 20 19 16.9 19 13C19 8.2 14.8 4.2 12 2Z"
        fill={c}
      />
      <Path
        d="M12 11C11.2 12.2 10.5 13.6 10.5 14.8C10.5 16.3 11.7 17.5 13.2 17.5C14.7 17.5 15.8 16.3 15.8 14.8C15.8 13.2 13.8 11.8 12 11Z"
        fill={c}
      />
    </Svg>
  );
};

// Schedule button background

const ScheduleButtonBackgroundSvg: React.FC<{
  type: 'date' | 'time';
}> = React.memo(({ type }) => {
  const isDate = type === 'date';
  const auraColor = isDate ? '#F5C518' : '#9C9CE3';
  const auraOpacity = isDate ? 0.22 : 0.26;

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
            id={`bgGrad-reminder-${type}`}
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
            id={`aura-reminder-${type}`}
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

        <Rect
          width="100%"
          height="100%"
          fill={`url(#bgGrad-reminder-${type})`}
        />
        <Rect width="100%" height="100%" fill={`url(#aura-reminder-${type})`} />

        <Circle
          cx={145}
          cy={18}
          r={28}
          stroke={
            isDate ? 'rgba(245, 197, 24, 0.16)' : 'rgba(156, 156, 227, 0.18)'
          }
          strokeWidth={1}
          fill="none"
        />
        <Circle
          cx={145}
          cy={18}
          r={42}
          stroke={
            isDate ? 'rgba(245, 197, 24, 0.08)' : 'rgba(156, 156, 227, 0.1)'
          }
          strokeWidth={0.8}
          strokeDasharray="3 4"
          fill="none"
        />

        <Circle
          cx={130}
          cy={10}
          r={1.2}
          fill={isDate ? '#FFFCE3' : '#E0E0FF'}
          opacity={0.7}
        />
        <Circle
          cx={155}
          cy={32}
          r={1}
          fill={isDate ? '#F5C518' : '#9C9CE3'}
          opacity={0.55}
        />
      </Svg>
    </View>
  );
});

// Categories Setup & Presets

export interface ReminderCategoryItem {
  id: string;
  label: string;
  bgColor: string;
  borderColor: string;
  shadowColor: string;
  accentColor: string;
  checkColor: string;
  badgeVariant: 'yellow' | 'green' | 'purple' | 'orange' | 'neutral';
  Icon: React.ComponentType<any>;
}

export interface CategoryPreset {
  name: string;
  bgColor: string;
  borderColor: string;
  shadowColor: string;
  accentColor: string;
  checkColor: string;
  badgeVariant: 'yellow' | 'green' | 'purple' | 'orange';
}

export const CATEGORY_PRESETS: CategoryPreset[] = [
  {
    name: 'Gold',
    bgColor: '#FFFCEB',
    borderColor: '#FFF5B8',
    shadowColor: '#F5C518',
    accentColor: '#FDD835',
    checkColor: '#D97706',
    badgeVariant: 'yellow',
  },
  {
    name: 'Mint',
    bgColor: '#EDFDF5',
    borderColor: '#C6FFDD',
    shadowColor: '#52D22E',
    accentColor: '#52D22E',
    checkColor: '#1B9A72',
    badgeVariant: 'green',
  },
  {
    name: 'Lavender',
    bgColor: '#EFF2FE',
    borderColor: '#D8DBFF',
    shadowColor: '#8383D6',
    accentColor: '#8383D6',
    checkColor: '#7059C8',
    badgeVariant: 'purple',
  },
  {
    name: 'Sunset',
    bgColor: '#FFF5F0',
    borderColor: '#FFE0D3',
    shadowColor: '#FB923C',
    accentColor: '#FB923C',
    checkColor: '#EA580C',
    badgeVariant: 'orange',
  },
  {
    name: 'Sky',
    bgColor: '#F0F9FF',
    borderColor: '#BAE6FD',
    shadowColor: '#38BDF8',
    accentColor: '#38BDF8',
    checkColor: '#0284C7',
    badgeVariant: 'purple',
  },
  {
    name: 'Rose',
    bgColor: '#FFF1F2',
    borderColor: '#FECDD3',
    shadowColor: '#FB7185',
    accentColor: '#FB7185',
    checkColor: '#E11D48',
    badgeVariant: 'purple',
  },
];

export const CATEGORY_ICON_CHOICES = [
  {
    id: 'heart',
    label: 'Daily',
    Icon: HeartEmblemIcon,
    defaultColor: '#F5C518',
  },
  { id: 'bag', label: 'Work', Icon: OfficeBagIcon, defaultColor: '#8383D6' },
  {
    id: 'picture',
    label: 'Health',
    Icon: PictureEmblemIcon,
    defaultColor: '#52D22E',
  },
  {
    id: 'sparkles',
    label: 'Events',
    Icon: SparkleEmblemIcon,
    defaultColor: '#FB923C',
  },
  {
    id: 'flame',
    label: 'Habit',
    Icon: FlameEmblemIcon,
    defaultColor: '#EF4444',
  },
];

const DEFAULT_REMINDER_CATEGORIES: ReminderCategoryItem[] = [
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

const REMIND_BEFORE_OPTIONS = [
  'At time of event',
  '5 mins before',
  '15 mins before',
  '1 hour before',
];

const REPEAT_OPTIONS = ['Never', 'Daily', 'Weekdays', 'Weekly'];

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
  const { width: screenWidth } = Dimensions.get('window');

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

  // Dynamic Category State & Add New Category Flow
  const [categoryList, setCategoryList] = useState<ReminderCategoryItem[]>(
    DEFAULT_REMINDER_CATEGORIES,
  );
  const [showAddCategoryModal, setShowAddCategoryModal] =
    useState<boolean>(false);
  const [newCatName, setNewCatName] = useState<string>('');
  const [newCatPresetIndex, setNewCatPresetIndex] = useState<number>(0);
  const [selectedIconIndex, setSelectedIconIndex] = useState<number>(0);

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
  const onDateChange = (event: DateTimePickerEvent, selected?: Date) => {
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

  const handleCreateCategory = () => {
    const trimmed = newCatName.trim();
    if (!trimmed) {
      Toast.show({
        type: 'error',
        text1: 'Category Name Required',
        text2: 'Please enter a title for your new category.',
      });
      return;
    }

    const preset = CATEGORY_PRESETS[newCatPresetIndex] || CATEGORY_PRESETS[0];
    const newId = trimmed.toLowerCase().replace(/\s+/g, '-');
    const chosenIcon = CATEGORY_ICON_CHOICES[selectedIconIndex].Icon;

    const newCategory: ReminderCategoryItem = {
      id: newId,
      label: trimmed,
      bgColor: preset.bgColor,
      borderColor: preset.borderColor,
      shadowColor: preset.shadowColor,
      accentColor: preset.accentColor,
      checkColor: preset.checkColor,
      badgeVariant: preset.badgeVariant,
      Icon: chosenIcon,
    };

    setCategoryList(prev => [...prev, newCategory]);
    setSelectedCategory(newId);
    setNewCatName('');
    setNewCatPresetIndex(0);
    setSelectedIconIndex(0);
    setShowAddCategoryModal(false);

    Toast.show({
      type: 'success',
      text1: 'Category Created 🎯',
      text2: `"${trimmed}" is now active and selected.`,
    });
  };

  const activeCategory =
    categoryList.find(c => c.id === selectedCategory) || categoryList[0];

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
            {/* Unified Primary Reminder Card with 2-Layer Task Card */}
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

            {/* Category Selector (Category selection) */}
            <View style={styles.sectionBlock}>
              <View style={styles.sectionHeaderRow}>
                <Text style={styles.sectionHeading}>Category Focus</Text>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => setShowAddCategoryModal(true)}
                  style={styles.addCategoryHeaderBtn}
                  accessibilityRole="button"
                  accessibilityLabel="Add new category"
                >
                  <View style={styles.addCategoryIconWrap}>
                    <Plus size={11} color="#F5C518" strokeWidth={3} />
                  </View>
                  <Text style={styles.addCategoryHeaderBtnText}>
                    Add Category
                  </Text>
                </TouchableOpacity>
              </View>

              <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                data={categoryList}
                keyExtractor={item => item.id}
                style={styles.categoryFlatList}
                contentContainerStyle={styles.categoryScrollContainer}
                keyboardShouldPersistTaps="handled"
                nestedScrollEnabled
                renderItem={({ item: cat }) => {
                  const isSelected = selectedCategory === cat.id;
                  const CatIcon = cat.Icon;

                  return (
                    <TouchableOpacity
                      key={cat.id}
                      activeOpacity={0.85}
                      onPress={() => setSelectedCategory(cat.id)}
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
                          <CatIcon width={16} height={16} />
                        </View>
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
                              color={cat.checkColor || cat.accentColor}
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

            {/* Schedule */}
            <View style={styles.sectionBlock}>
              <View style={styles.sectionHeaderRow}>
                <Text style={styles.sectionHeading}>When to Remind</Text>
                <Badge
                  variant="green"
                  size="sm"
                  label="Local GMT"
                  icon={<Clock size={11} color="#1B9A72" />}
                />
              </View>

              {/* Quick Date Chips */}
              <View style={styles.quickDateRow}>
                {(['today', 'tomorrow', 'weekend'] as const).map(type => {
                  const isSelected =
                    (type === 'today' && selectedDate.startsWith('Today')) ||
                    (type === 'tomorrow' &&
                      selectedDate.startsWith('Tomorrow')) ||
                    (type === 'weekend' && selectedDate.startsWith('Sat'));

                  const label =
                    type === 'today'
                      ? 'Today'
                      : type === 'tomorrow'
                      ? 'Tomorrow'
                      : 'This Weekend';

                  return (
                    <TouchableOpacity
                      key={type}
                      activeOpacity={0.75}
                      onPress={() => handleSelectQuickDate(type)}
                      style={[
                        styles.quickDateChip,
                        isSelected && styles.quickDateChipSelected,
                      ]}
                    >
                      <Text
                        style={[
                          styles.quickDateChipText,
                          isSelected && styles.quickDateChipTextSelected,
                        ]}
                      >
                        {label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
              <View style={styles.scheduleContainerCard}>
                {/* Date Trigger */}
                <View style={styles.magicScheduleBtnWrapper}>
                  <TouchableOpacity
                    activeOpacity={0.82}
                    onPress={() => setShowDatePicker(true)}
                    style={styles.magicScheduleBtn}
                    accessibilityRole="button"
                    accessibilityLabel={`Schedule date: ${selectedDate}`}
                  >
                    <ScheduleButtonBackgroundSvg type="date" />

                    <View
                      style={[styles.magicIconWrap, styles.magicIconWrapDate]}
                    >
                      <Calendar size={16} color="#F5C518" strokeWidth={2.4} />
                    </View>

                    <View style={styles.magicScheduleTextGroup}>
                      <Text style={styles.magicScheduleSmallLabel}>
                        SCHEDULE DATE
                      </Text>
                      <Text style={styles.magicScheduleValue} numberOfLines={1}>
                        {selectedDate}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>

                {/* Time Trigger */}
                <View style={styles.magicScheduleBtnWrapper}>
                  <TouchableOpacity
                    activeOpacity={0.82}
                    onPress={() => setShowTimePicker(true)}
                    style={styles.magicScheduleBtn}
                    accessibilityRole="button"
                    accessibilityLabel={`Due time: ${selectedTime}`}
                  >
                    <ScheduleButtonBackgroundSvg type="time" />

                    <View
                      style={[styles.magicIconWrap, styles.magicIconWrapTime]}
                    >
                      <Clock size={16} color="#9C9CE3" strokeWidth={2.4} />
                    </View>

                    <View style={styles.magicScheduleTextGroup}>
                      <Text style={styles.magicScheduleSmallLabel}>TIME</Text>
                      <Text style={styles.magicScheduleValue} numberOfLines={1}>
                        {selectedTime}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* ─── Repeat Cycle () ── */}
            <View style={styles.sectionBlock}>
              <View style={styles.sectionHeaderRow}>
                <Text style={styles.sectionHeading}>Repeat Cycle</Text>
                <Text style={styles.sectionSubtext}>Routine cadence</Text>
              </View>

              <View style={styles.segmentedContainer}>
                {REPEAT_OPTIONS.map(rep => {
                  const isActive = repeatCycle === rep;
                  return (
                    <TouchableOpacity
                      key={rep}
                      activeOpacity={0.85}
                      onPress={() => setRepeatCycle(rep)}
                      style={[
                        styles.segmentedTab,
                        isActive && styles.segmentedTabActive,
                      ]}
                      accessibilityRole="tab"
                      accessibilityState={{ selected: isActive }}
                    >
                      <Text
                        style={[
                          styles.segmentedTabText,
                          isActive
                            ? styles.segmentedTabTextActive
                            : styles.segmentedTabTextInactive,
                        ]}
                      >
                        {rep}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Remind Me Before (2x2 Tactile Capsule Grid) */}
            <View style={styles.sectionBlock}>
              <View style={styles.sectionHeaderRow}>
                <Text style={styles.sectionHeading}>Remind Me Before</Text>
                <Badge
                  variant="yellow"
                  size="sm"
                  label="Prior Alert"
                  icon={<Bell size={11} color="#B48216" />}
                />
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
                        styles.remindBeforeCard,
                        isSelected && styles.remindBeforeCardSelected,
                      ]}
                    >
                      <View
                        style={[
                          styles.remindDot,
                          isSelected && styles.remindDotSelected,
                        ]}
                      />
                      <Text
                        style={[
                          styles.remindBeforeCardText,
                          isSelected && styles.remindBeforeCardTextSelected,
                        ]}
                      >
                        {opt}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Sound & Haptics Preview Card */}
            <View style={styles.soundCard}>
              <View style={styles.soundLeftGroup}>
                <View style={styles.soundIconTile}>
                  <Volume2 size={20} color="#1B9A72" strokeWidth={2.4} />
                </View>

                <View style={styles.soundTextGroup}>
                  <Text style={styles.soundTitle}>Gentle Bell</Text>
                  <Text style={styles.soundSubtitle}>Soft Harmonic Chime</Text>
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
                <Play size={13} color="#1B9A72" strokeWidth={2.6} />
                <Text style={styles.previewSoundText}>
                  {isPlayingPreview ? 'Playing...' : 'Preview'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Spoken Voice Nudge (Voice nudge) */}
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
                    Audio chime when reminder arrives
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

            {/* Urgent Alarm (Critical Override) */}
            <View style={styles.urgentAlarmCard}>
              <View style={styles.urgentAlarmLeft}>
                <View style={styles.urgentIconTile}>
                  <AlertTriangle size={20} color="#EF4444" strokeWidth={2.4} />
                </View>

                <View style={styles.urgentTextGroup}>
                  <View style={styles.urgentTitleRow}>
                    <Text style={styles.urgentTitle} numberOfLines={1}>
                      Urgent Alarm
                    </Text>
                    <Badge variant="red" size="sm" label="CRITICAL" />
                  </View>
                  <Text style={styles.urgentSubtitle} numberOfLines={1}>
                    Override Silent Mode & Ring aloud
                  </Text>
                </View>
              </View>

              <Switch
                value={urgentAlarm}
                onValueChange={setUrgentAlarm}
                trackColor={{
                  false: '#E4E2DD',
                  true: '#EF4444',
                }}
                thumbColor="#FFFFFF"
                ios_backgroundColor="#E4E2DD"
              />
            </View>
          </Animated.ScrollView>

          {/* Bottom actions */}
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
                style={[{ flex: 1 }, { transform: [{ scale: createAnim }] }]}
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

        {/* Date picker modal */}
        {Platform.OS === 'ios' ? (
          <Modal
            visible={showDatePicker}
            transparent
            animationType="slide"
            onRequestClose={() => setShowDatePicker(false)}
          >
            <TouchableWithoutFeedback onPress={() => setShowDatePicker(false)}>
              <View style={styles.pickerModalOverlay}>
                <TouchableWithoutFeedback>
                  <View style={styles.pickerModalCard}>
                    <View style={styles.pickerDragHandle} />

                    <PickerAestheticBg type="date" />

                    <View style={styles.pickerModalHeader}>
                      <View style={styles.pickerHeaderTitleWrap}>
                        <View
                          style={[
                            styles.pickerHeaderBadge,
                            styles.pickerHeaderBadgeDate,
                          ]}
                        >
                          <Calendar
                            size={12}
                            color="#B48216"
                            strokeWidth={2.5}
                          />
                          <Text style={styles.pickerHeaderBadgeTextDate}>
                            SOLAR CALENDAR
                          </Text>
                        </View>
                        <Text style={styles.pickerModalTitle}>
                          Schedule Date
                        </Text>
                      </View>

                      <TouchableOpacity
                        activeOpacity={0.82}
                        onPress={() => setShowDatePicker(false)}
                        style={styles.pickerDoneBtn}
                        accessibilityRole="button"
                        accessibilityLabel="Confirm date selection"
                      >
                        <Text style={styles.pickerDoneBtnText}>Done</Text>
                      </TouchableOpacity>
                    </View>

                    <View style={styles.pickerWheelContainer}>
                      <DateTimePicker
                        value={dateValue}
                        mode="date"
                        display="spinner"
                        onChange={onDateChange}
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
          showDatePicker && (
            <DateTimePicker
              value={dateValue}
              mode="date"
              display="default"
              onChange={onDateChange}
            />
          )
        )}

        {/* Time picker modal */}
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
                        <Text style={styles.pickerModalTitle}>Due Time</Text>
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

        {/* Add category modal */}
        <Modal
          visible={showAddCategoryModal}
          transparent
          animationType="slide"
          onRequestClose={() => setShowAddCategoryModal(false)}
        >
          <TouchableWithoutFeedback
            onPress={() => setShowAddCategoryModal(false)}
          >
            <View style={styles.modalOverlay}>
              <TouchableWithoutFeedback>
                <View style={styles.modalCard}>
                  <View style={styles.modalDragHandle} />

                  <View style={styles.modalHeaderRow}>
                    <View style={styles.modalHeaderLeft}>
                      <View style={styles.modalHeaderBadge}>
                        <Sparkles size={11} color="#B48216" strokeWidth={2.5} />
                        <Text style={styles.modalHeaderBadgeText}>
                          NEW CATEGORY
                        </Text>
                      </View>
                      <Text style={styles.modalTitle}>Category Design</Text>
                    </View>
                    <TouchableOpacity
                      activeOpacity={0.7}
                      onPress={() => setShowAddCategoryModal(false)}
                      style={styles.modalCloseBtn}
                      accessibilityLabel="Close category creator"
                    >
                      <X size={16} color="#7E838F" strokeWidth={2.4} />
                    </TouchableOpacity>
                  </View>

                  {/* Category Live Preview Card */}
                  <View style={styles.showcaseOuterWrap}>
                    <View
                      style={[
                        styles.categoryCardExact,
                        styles.categoryCardExactSelected,
                        {
                          backgroundColor:
                            CATEGORY_PRESETS[newCatPresetIndex].bgColor,
                          borderColor:
                            CATEGORY_PRESETS[newCatPresetIndex].borderColor,
                          width: categoryCardWidth,
                          shadowColor:
                            CATEGORY_PRESETS[newCatPresetIndex].shadowColor,
                        },
                      ]}
                    >
                      <View style={styles.categoryCardTop}>
                        <View
                          style={[
                            styles.categoryIconWrap,
                            {
                              borderColor:
                                CATEGORY_PRESETS[newCatPresetIndex].borderColor,
                              shadowColor:
                                CATEGORY_PRESETS[newCatPresetIndex].shadowColor,
                            },
                          ]}
                        >
                          {React.createElement(
                            CATEGORY_ICON_CHOICES[selectedIconIndex]
                              .Icon as any,
                            {
                              width: 16,
                              height: 16,
                              size: 16,
                              color:
                                CATEGORY_PRESETS[newCatPresetIndex].checkColor,
                            },
                          )}
                        </View>

                        <View
                          style={[
                            styles.categoryFloatingCheckbox,
                            styles.categoryFloatingCheckboxChecked,
                            {
                              borderColor:
                                CATEGORY_PRESETS[newCatPresetIndex].accentColor,
                              backgroundColor:
                                CATEGORY_PRESETS[newCatPresetIndex].bgColor,
                              shadowColor:
                                CATEGORY_PRESETS[newCatPresetIndex].shadowColor,
                            },
                          ]}
                        >
                          <Check
                            size={12}
                            color={
                              CATEGORY_PRESETS[newCatPresetIndex].checkColor
                            }
                            strokeWidth={3}
                          />
                        </View>
                      </View>

                      <View style={styles.categoryCardBottom}>
                        <Text
                          style={styles.categoryCardLabel}
                          numberOfLines={1}
                        >
                          {newCatName.trim() || 'Category'}
                        </Text>
                      </View>
                      <View style={styles.categoryAccentWrap}>
                        <View
                          style={[
                            styles.categoryAccent,
                            {
                              backgroundColor:
                                CATEGORY_PRESETS[newCatPresetIndex].accentColor,
                            },
                          ]}
                        />
                      </View>
                    </View>
                  </View>

                  {/* Category Title Input */}
                  <View style={styles.newCatInputWrapper}>
                    <View style={styles.newCatFieldHeader}>
                      <Text style={styles.newCatFieldLabel}>
                        CATEGORY TITLE
                      </Text>
                      <Text style={styles.newCatCharCount}>
                        {newCatName.length}/20
                      </Text>
                    </View>
                    <TextInput
                      style={styles.newCatInput}
                      placeholder="e.g. Finances, Family, Wellness..."
                      placeholderTextColor="#A3A8B1"
                      value={newCatName}
                      onChangeText={setNewCatName}
                      maxLength={20}
                      returnKeyType="done"
                      cursorColor={Colors.MidnightCharcoal}
                      selectionColor="rgba(31, 34, 40, 0.25)"
                    />
                  </View>

                  {/* Curated Icon Selector */}
                  <View style={styles.iconSelectSection}>
                    <Text style={styles.newCatFieldLabel}>CHOOSE EMBLEM</Text>
                    <View style={styles.iconSelectRow}>
                      {CATEGORY_ICON_CHOICES.map((choice, idx) => {
                        const isSelected = selectedIconIndex === idx;
                        const IconComp = choice.Icon;
                        return (
                          <TouchableOpacity
                            key={choice.id}
                            activeOpacity={0.8}
                            onPress={() => setSelectedIconIndex(idx)}
                            style={[
                              styles.iconChoiceBtn,
                              isSelected && styles.iconChoiceBtnSelected,
                            ]}
                            accessibilityRole="button"
                            accessibilityLabel={`Select emblem ${choice.label}`}
                          >
                            <IconComp
                              width={18}
                              height={18}
                              size={18}
                              color={choice.defaultColor}
                            />
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  </View>

                  {/* Color Presets */}
                  <View style={styles.paletteSection}>
                    <Text style={styles.newCatFieldLabel}>COLOR PALETTE</Text>
                    <View style={styles.paletteRow}>
                      {CATEGORY_PRESETS.map((p, idx) => {
                        const isSelected = newCatPresetIndex === idx;
                        return (
                          <TouchableOpacity
                            key={p.name}
                            activeOpacity={0.8}
                            onPress={() => setNewCatPresetIndex(idx)}
                            style={[
                              styles.paletteSwatch,
                              {
                                backgroundColor: p.bgColor,
                                borderColor: isSelected
                                  ? p.accentColor
                                  : p.borderColor,
                              },
                              isSelected && styles.paletteSwatchSelected,
                            ]}
                            accessibilityLabel={`Select palette ${p.name}`}
                          >
                            <View
                              style={[
                                styles.paletteDot,
                                { backgroundColor: p.checkColor },
                              ]}
                            />
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  </View>

                  {/* Bottom Action CTA Row */}
                  <View style={styles.createCatCtaRow}>
                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={() => setShowAddCategoryModal(false)}
                      style={styles.createCatBackBtn}
                      accessibilityRole="button"
                      accessibilityLabel="Go back"
                    >
                      <ArrowDown size={20} color="#FFFFFF" strokeWidth={2.4} />
                    </TouchableOpacity>

                    <TouchableOpacity
                      activeOpacity={0.9}
                      onPress={handleCreateCategory}
                      style={styles.createCatHeroBtn}
                      accessibilityRole="button"
                      accessibilityLabel="Add Category"
                    >
                      <Text style={styles.createCatHeroBtnText}>
                        Add Category
                      </Text>
                      <View style={styles.createCatHeroCircle}>
                        <ArrowRight
                          size={18}
                          color="#FFFFFF"
                          strokeWidth={2.6}
                        />
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </View>
    </Modal>
  );
};

// Styles

const styles = StyleSheet.create({
  canvasContainer: {
    flex: 1,
    backgroundColor: '#FAF8F5',
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
    color: '#7E838F',
  },
  addCategoryHeaderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.NeroBlack,
    borderWidth: 1.2,
    borderTopColor: '#3F424E',
    borderLeftColor: '#30333D',
    borderRightColor: '#30333D',
    borderBottomWidth: 2.5,
    borderBottomColor: '#0E0F13',
    paddingLeft: 7,
    paddingRight: 13,
    paddingVertical: 5.5,
    borderRadius: 24,
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.22,
        shadowRadius: 5,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  addCategoryIconWrap: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(245, 197, 24, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(245, 197, 24, 0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addCategoryHeaderBtnText: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: 12,
    color: '#FFFFFF',
    letterSpacing: 0.1,
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

  // Quick Date Chips (Date chips)
  quickDateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 14,
    paddingTop: 4,
    paddingBottom: 8,
    overflow: 'visible',
  },
  quickDateChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
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
  quickDateChipSelected: {
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
  quickDateChipText: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: 12,
    color: '#555450',
    letterSpacing: -0.1,
  },
  quickDateChipTextSelected: {
    color: Colors.DefaultWhite,
    fontFamily: Fonts.poppins.bold,
  },

  // Schedule pickers
  scheduleContainerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: '#E8E2D5',
    padding: 8,
    flexDirection: 'row',
    gap: 10,
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
    flex: 1,
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
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  magicIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  magicIconWrapDate: {
    backgroundColor: 'rgba(245, 197, 24, 0.12)',
    borderColor: 'rgba(245, 197, 24, 0.25)',
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
    fontSize: 13,
    color: '#FFFFFF',
    marginTop: 1,
  },

  // Segmented Cadence (Repeat Options)
  segmentedContainer: {
    flexDirection: 'row',
    backgroundColor: '#181A20',
    borderRadius: 50,
    padding: 4.5,
    borderWidth: 1.2,
    borderColor: '#2E323D',
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.22,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  segmentedTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    borderRadius: 50,
  },
  segmentedTabActive: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.95)',
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  segmentedTabText: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: 12.5,
    letterSpacing: -0.2,
    color: '#E5E7EB',
  },
  segmentedTabTextActive: {
    fontFamily: Fonts.poppins.bold,
    color: '#121417',
  },
  segmentedTabTextInactive: {
    fontFamily: Fonts.poppins.semiBold,
    color: '#E5E7EB',
  },

  // Remind Me Before 2x2 Grid
  remindBeforeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  remindBeforeCard: {
    width: '48.5%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#E8E2D5',
    borderBottomWidth: 3,
    borderBottomColor: '#D8D1C0',
    paddingVertical: 12,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  remindBeforeCardSelected: {
    backgroundColor: Colors.NeroBlack,
    borderColor: '#3D414D',
    borderBottomWidth: 3,
    borderBottomColor: '#0C0D10',
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 6,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  remindDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#B4B0A5',
  },
  remindDotSelected: {
    backgroundColor: '#F5C518',
  },
  remindBeforeCardText: {
    fontFamily: Fonts.poppins.medium,
    fontSize: 12,
    color: Colors.MidnightCharcoal,
    flex: 1,
  },
  remindBeforeCardTextSelected: {
    fontFamily: Fonts.poppins.bold,
    color: Colors.DefaultWhite,
  },

  // Sound Preview Card
  soundCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#E8E2D5',
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
      },
      android: {
        elevation: 2.5,
      },
    }),
  },
  soundLeftGroup: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  soundIconTile: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#EDFDF5',
    borderWidth: 1.5,
    borderColor: '#C6FFDD',
    alignItems: 'center',
    justifyContent: 'center',
  },
  soundTextGroup: {
    flex: 1,
  },
  soundTitle: {
    fontFamily: Fonts.poppins.bold,
    fontSize: 14,
    color: Colors.MidnightCharcoal,
  },
  soundSubtitle: {
    fontFamily: Fonts.poppins.regular,
    fontSize: 11.5,
    color: '#7E838F',
    marginTop: 1,
  },
  previewSoundBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#EDFDF5',
    borderWidth: 1.2,
    borderColor: '#A7F3D0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  previewSoundBtnPlaying: {
    backgroundColor: '#D1FAE5',
    borderColor: '#6EE7B7',
  },
  previewSoundText: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: 12,
    color: '#1B9A72',
  },

  // Voice Nudge Card
  voiceNudgeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#E8E2D5',
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
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

  // Urgent Alarm Card
  urgentAlarmCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#FEE2E2',
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
    ...Platform.select({
      ios: {
        shadowColor: '#EF4444',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  urgentAlarmLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginRight: 14,
  },
  urgentIconTile: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#FEF2F2',
    borderWidth: 1.5,
    borderColor: '#FECACA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  urgentTextGroup: {
    flex: 1,
  },
  urgentTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  urgentTitle: {
    fontFamily: Fonts.poppins.bold,
    fontSize: 14,
    color: Colors.MidnightCharcoal,
  },
  urgentSubtitle: {
    fontFamily: Fonts.poppins.regular,
    fontSize: 11.5,
    color: '#7E838F',
    marginTop: 2,
  },

  // Bottom Floating Hero CTA (Transparent Background)
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

  // Native Picker Bottom Sheet (iOS)
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
  pickerHeaderBadgeDate: {
    backgroundColor: '#FDF7E7',
    borderColor: '#F3E5BE',
  },
  pickerHeaderBadgeTime: {
    backgroundColor: '#F3F2FD',
    borderColor: '#E0DEFA',
  },
  pickerHeaderBadgeTextDate: {
    fontFamily: Fonts.poppins.bold,
    fontSize: 9.5,
    letterSpacing: 0.8,
    color: '#B48216',
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

  // Add Category Bottom Sheet Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(14, 16, 21, 0.65)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: '#FAF8F5',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 36 : 24,
    borderTopWidth: 2,
    borderColor: '#E8E2D5',
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: -6 },
        shadowOpacity: 0.15,
        shadowRadius: 16,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  modalDragHandle: {
    width: 36,
    height: 4.5,
    borderRadius: 2.5,
    backgroundColor: '#D5D0C5',
    alignSelf: 'center',
    marginBottom: 14,
  },
  modalHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  modalHeaderLeft: {
    gap: 4,
  },
  modalHeaderBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#FDF7E7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F3E5BE',
    alignSelf: 'flex-start',
  },
  modalHeaderBadgeText: {
    fontFamily: Fonts.poppins.bold,
    fontSize: 9.5,
    letterSpacing: 0.8,
    color: '#B48216',
  },
  modalTitle: {
    fontFamily: Fonts.ranade.bold,
    fontSize: 22,
    color: Colors.MidnightCharcoal,
    letterSpacing: -0.4,
  },
  modalCloseBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.2,
    borderColor: '#E8E2D5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  showcaseOuterWrap: {
    alignItems: 'center',
    marginVertical: 14,
  },
  newCatInputWrapper: {
    marginBottom: 16,
  },
  newCatFieldHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  newCatFieldLabel: {
    fontFamily: Fonts.poppins.bold,
    fontSize: 10.5,
    letterSpacing: 0.8,
    color: '#7E838F',
  },
  newCatCharCount: {
    fontFamily: Fonts.poppins.medium,
    fontSize: 11,
    color: '#A3A8B1',
  },
  newCatInput: {
    height: 48,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1.2,
    borderColor: '#E8E2D5',
    paddingHorizontal: 14,
    fontFamily: Fonts.poppins.semiBold,
    fontSize: 14,
    color: Colors.MidnightCharcoal,
  },
  iconSelectSection: {
    marginBottom: 16,
  },
  iconSelectRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 8,
  },
  iconChoiceBtn: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.2,
    borderColor: '#E8E2D5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconChoiceBtnSelected: {
    borderColor: Colors.MidnightCharcoal,
    backgroundColor: '#F5F3ED',
    borderWidth: 2,
  },
  paletteSection: {
    marginBottom: 20,
  },
  paletteRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  paletteSwatch: {
    flex: 1,
    height: 36,
    borderRadius: 10,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  paletteSwatchSelected: {
    borderWidth: 2.2,
  },
  paletteDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  createCatCtaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 4,
  },
  createCatBackBtn: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: Colors.MidnightCharcoal,
    borderWidth: 1.2,
    borderColor: '#3A3F48',
    alignItems: 'center',
    justifyContent: 'center',
  },
  createCatHeroBtn: {
    flex: 1,
    height: 52,
    backgroundColor: Colors.MidnightCharcoal,
    borderRadius: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    borderWidth: 1.2,
    borderColor: '#3A3F48',
  },
  createCatHeroBtnText: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: 15.5,
    color: '#FFFFFF',
    letterSpacing: -0.2,
  },
  createCatHeroCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default AddReminderModal;
