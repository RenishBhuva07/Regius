import React, {
  useState,
  useMemo,
  useCallback,
  useRef,
  useEffect,
} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  Animated,
  Alert,
  Vibration,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import {
  Bell,
  Clock,
  Calendar,
  RotateCw,
  Check,
  Pencil,
  Volume2,
  VolumeX,
  Trash2,
  Briefcase,
  Heart,
  CalendarCheck,
  AlertTriangle,
  FileText,
  Music,
} from 'lucide-react-native';
import Svg, {
  Rect,
  Circle,
  Defs,
  LinearGradient,
  RadialGradient,
  Stop,
} from 'react-native-svg';
import Toast from 'react-native-toast-message';

import { Fonts } from '../../Theme/fonts';
import { Typography } from '../../Theme/Typographys';
import { Colors } from '../../Assets/StyleUtilities/Colors';
import ResponsivePixels from '../../Assets/StyleUtilities/ResponsivePixels';
import { useTheme } from '../../Theme/ThemeContext';
import { useTaskReminder, Reminder } from '../../Context/TaskReminderContext';
import {
  SubScreenHeader,
  SUB_SCREEN_HEADER_HEIGHT,
} from '../../Common/SubScreenHeader';
import { useScrollReactiveHeader } from '../../Common/useScrollReactiveHeader';
import { Badge, BadgeVariant } from '../../Common/Badge';
import { HeaderActionButton } from '../../Common/HeaderActionButton';
import { StickyActionDock } from '../../Common/StickyActionDock';
import { StickyBottomButton } from '../../Common/StickyBottomButton';
import { MiniAcousticBars } from '../../Common/MiniAcousticBars';
import AddReminderModal from '../../Components/AddReminderModal';
import { KokoroTTSService } from '../../Services/Kokoro/KokoroTTSService';
import { AudioPlayerService } from '../../Services/AudioPlayerService';
import { ReminderDetailsBackgroundSvg } from './Components/ReminderDetailsBackgroundSvg';

export interface ReminderDetailsScreenRouteParams {
  reminderId: string;
}

/**
 * Ambient background for Reminder Details Hero Bento Card
 */
const BentoHeroBg: React.FC<{ accentColor: string }> = React.memo(
  ({ accentColor }) => (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <Svg
        width="100%"
        height="100%"
        viewBox="0 0 360 180"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
      >
        <Defs>
          <LinearGradient
            id="remHeroBentoBg"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <Stop offset="0%" stopColor="#252733" stopOpacity={0.85} />
            <Stop offset="50%" stopColor="#1B1D25" stopOpacity={0.5} />
            <Stop offset="100%" stopColor="#121318" stopOpacity={0.92} />
          </LinearGradient>

          <RadialGradient
            id="reminderDetailsAccentGlow"
            cx="80%"
            cy="20%"
            rx="65%"
            ry="65%"
          >
            <Stop offset="0%" stopColor={accentColor} stopOpacity={0.35} />
            <Stop offset="50%" stopColor={accentColor} stopOpacity={0.12} />
            <Stop offset="100%" stopColor="#121318" stopOpacity={0} />
          </RadialGradient>
        </Defs>

        <Rect width="100%" height="100%" fill="url(#remHeroBentoBg)" />
        <Rect
          width="100%"
          height="100%"
          fill="url(#reminderDetailsAccentGlow)"
        />

        <Circle
          cx={300}
          cy={40}
          r={50}
          stroke="rgba(255, 255, 255, 0.12)"
          strokeWidth={1}
          fill="none"
        />
        <Circle
          cx={300}
          cy={40}
          r={85}
          stroke="rgba(255, 255, 255, 0.05)"
          strokeWidth={1}
          strokeDasharray="4 6"
          fill="none"
        />
        <Circle cx={285} cy={18} r={1.6} fill="#FFFFFF" opacity={0.65} />
        <Circle cx={35} cy={165} r={1.4} fill={accentColor} opacity={0.5} />
      </Svg>
    </View>
  ),
);

export const ReminderDetailsScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const route =
    useRoute<
      RouteProp<{ params: ReminderDetailsScreenRouteParams }, 'params'>
    >();
  const { isDarkMode } = useTheme();

  const reminderId = route.params?.reminderId;
  const { reminders, toggleReminder, updateReminder, deleteReminder } =
    useTaskReminder();

  const reminder = useMemo(
    () => reminders.find(r => r.id === reminderId),
    [reminders, reminderId],
  );

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPlayingAlert, setIsPlayingAlert] = useState(false);

  const { scrollY, isScrolled, handleScroll } = useScrollReactiveHeader({
    threshold: 15,
  });
  const scaleAnim = useRef(new Animated.Value(1)).current;

  // Audio session race condition and cleanup guards
  const sessionIdRef = useRef<number>(0);
  const playbackUnsubRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    return () => {
      sessionIdRef.current += 1;
      if (playbackUnsubRef.current) {
        playbackUnsubRef.current();
        playbackUnsubRef.current = null;
      }
      KokoroTTSService.stop().catch(() => {});
      AudioPlayerService.stop().catch(() => {});
    };
  }, []);

  const categoryTheme = useMemo(() => {
    switch (reminder?.category) {
      case 'work':
        return {
          label: 'WORK & PROJECTS',
          badgeVariant: 'purple' as BadgeVariant,
          accent: '#8383D6',
          bgTint: '#F7F8FE',
          borderColor: '#D8DBFF',
          icon: Briefcase,
          iconColor: '#7059C8',
        };
      case 'events':
        return {
          label: 'EVENTS & SCHEDULE',
          badgeVariant: 'orange' as BadgeVariant,
          accent: '#FF9800',
          bgTint: '#FFF9F0',
          borderColor: '#FFE0B2',
          icon: CalendarCheck,
          iconColor: '#D97706',
        };
      case 'health':
        return {
          label: 'HEALTH & VITALITY',
          badgeVariant: 'green' as BadgeVariant,
          accent: '#1B9A72',
          bgTint: '#F5FDF9',
          borderColor: '#C6FFDD',
          icon: Heart,
          iconColor: '#1B9A72',
        };
      case 'daily':
      default:
        return {
          label: 'DAILY ROUTINE',
          badgeVariant: 'yellow' as BadgeVariant,
          accent: '#F5C518',
          bgTint: '#FFFCEB',
          borderColor: '#FFF5B8',
          icon: Bell,
          iconColor: '#B47804',
        };
    }
  }, [reminder?.category]);

  const IconComponent = categoryTheme.icon;

  const handleToggle = useCallback(() => {
    if (!reminder) return;

    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 75,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        tension: 180,
        useNativeDriver: true,
      }),
    ]).start();

    const updated = toggleReminder(reminder.id);
    if (updated) {
      Toast.show({
        type: 'success',
        text1: updated.done ? 'Reminder Acknowledged! 🔔' : 'Reminder Restored',
        text2: updated.done
          ? 'Alert marked as completed.'
          : 'Alert returned to upcoming queue.',
      });
    }
  }, [reminder, toggleReminder, scaleAnim]);

  const handleToggleVocalAlert = useCallback(async () => {
    if (!reminder) return;
    Vibration.vibrate(25);

    sessionIdRef.current += 1;
    const currentSession = sessionIdRef.current;

    if (playbackUnsubRef.current) {
      playbackUnsubRef.current();
      playbackUnsubRef.current = null;
    }

    if (isPlayingAlert) {
      await KokoroTTSService.stop();
      await AudioPlayerService.stop();
      setIsPlayingAlert(false);
      return;
    }

    setIsPlayingAlert(true);
    const repeatText = reminder.repeat
      ? `Repeats ${reminder.repeat}`
      : 'One-time alert';
    const dateText = reminder.date ? `, on ${reminder.date}` : '';
    const timeText = reminder.time
      ? `Scheduled for ${reminder.time}`
      : 'Scheduled alert';
    const spokenText = `Reminder alert: ${reminder.title}. ${timeText}${dateText}. ${repeatText}.`;

    const unsub = AudioPlayerService.onPlaybackFinished(() => {
      if (sessionIdRef.current === currentSession) {
        setIsPlayingAlert(false);
      }
      if (playbackUnsubRef.current) {
        playbackUnsubRef.current();
        playbackUnsubRef.current = null;
      }
    });
    playbackUnsubRef.current = unsub;

    try {
      await KokoroTTSService.speak(spokenText);
    } catch {
      if (sessionIdRef.current === currentSession) {
        setIsPlayingAlert(false);
      }
    }
  }, [reminder, isPlayingAlert]);

  const handleDelete = useCallback(() => {
    if (!reminder) return;
    Vibration.vibrate(30);

    Alert.alert(
      'Delete Reminder',
      `Are you sure you want to delete "${reminder.title}"? This alert will be removed permanently.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteReminder(reminder.id);
            Toast.show({
              type: 'info',
              text1: 'Reminder Removed',
              text2: 'The alert has been removed from your schedule.',
            });
            navigation.goBack();
          },
        },
      ],
    );
  }, [reminder, deleteReminder, navigation]);

  if (!reminder) {
    return (
      <View style={[styles.container, isDarkMode && styles.containerDark]}>
        <SubScreenHeader
          title="Reminder Details"
          scrollY={scrollY}
          isScrolled={isScrolled}
          onPressBack={() => navigation.goBack()}
        />
        <View style={styles.notFoundCenter}>
          <Text
            style={[styles.notFoundText, isDarkMode && styles.notFoundTextDark]}
          >
            Reminder alert not found.
          </Text>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backBtnFallback}
            activeOpacity={0.8}
            accessibilityRole="button"
          >
            <Text style={styles.backBtnFallbackText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, isDarkMode && styles.containerDark]}>
      {/* Luxury Ambient Canvas Background Svg */}
      <ReminderDetailsBackgroundSvg accentColor={categoryTheme.accent} />

      {/* Scroll-Reactive Luxury SubScreenHeader */}
      <SubScreenHeader
        title="Reminder Details"
        subtitle={categoryTheme.label}
        scrollY={scrollY}
        isScrolled={isScrolled}
        onPressBack={() => navigation.goBack()}
        rightAction={
          <View style={styles.headerRightGroup}>
            <Badge
              label={categoryTheme.label}
              variant={categoryTheme.badgeVariant}
              size="sm"
            />
            <HeaderActionButton
              label="Edit"
              icon={Pencil}
              onPress={() => setIsEditModalOpen(true)}
              accessibilityLabel={`Edit ${reminder.title}`}
            />
          </View>
        }
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop:
              insets.top + SUB_SCREEN_HEADER_HEIGHT + ResponsivePixels.size12,
            paddingBottom: insets.bottom + ResponsivePixels.size85,
          },
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {/* Flagship Hero Bento Card */}
        <View style={styles.cardShadowWrapper}>
          <View style={styles.card}>
            <BentoHeroBg accentColor={categoryTheme.accent} />

            <View style={styles.bentoContent}>
              <View style={styles.bentoTopRow}>
                <View style={styles.frostedDomainPill}>
                  <IconComponent
                    size={ResponsivePixels.size12}
                    color={categoryTheme.iconColor}
                    strokeWidth={2.4}
                  />
                  <Text
                    style={[
                      styles.frostedDomainText,
                      { color: categoryTheme.iconColor },
                    ]}
                  >
                    {categoryTheme.label}
                  </Text>
                </View>

                <Badge
                  label={reminder.done ? 'ACKNOWLEDGED' : 'UPCOMING'}
                  variant={reminder.done ? 'green' : 'yellow'}
                  size="sm"
                />
              </View>

              <Text style={styles.bentoTitle} numberOfLines={3}>
                {reminder.title}
              </Text>

              <View style={styles.bentoMetaRow}>
                <View style={styles.metaChip}>
                  <Clock
                    size={ResponsivePixels.size12}
                    color="#F5C518"
                    strokeWidth={2.2}
                  />
                  <Text style={styles.metaChipText}>{reminder.time}</Text>
                </View>

                <View style={styles.metaChip}>
                  <Calendar
                    size={ResponsivePixels.size12}
                    color="#D1D5DB"
                    strokeWidth={2.2}
                  />
                  <Text style={styles.metaChipText}>{reminder.date}</Text>
                </View>

                {reminder.repeat && (
                  <View style={styles.metaChip}>
                    <RotateCw
                      size={ResponsivePixels.size12}
                      color="#8383D6"
                      strokeWidth={2.2}
                    />
                    <Text style={styles.metaChipText}>{reminder.repeat}</Text>
                  </View>
                )}

                {reminder.urgentAlarm && (
                  <View style={[styles.metaChip, styles.urgentChip]}>
                    <AlertTriangle
                      size={ResponsivePixels.size12}
                      color="#EF4444"
                      strokeWidth={2.2}
                    />
                    <Text style={styles.urgentChipText}>URGENT ALARM</Text>
                  </View>
                )}
              </View>
            </View>
          </View>
        </View>

        {/* Vocal Guidance & Audio Briefing Card with Acoustic Equalizer */}
        <View style={[styles.vocalCard, isDarkMode && styles.vocalCardDark]}>
          <View style={styles.vocalLeft}>
            <View
              style={[
                styles.vocalIconAura,
                isDarkMode && styles.vocalIconAuraDark,
              ]}
            >
              <Volume2
                size={ResponsivePixels.size18}
                color={isDarkMode ? '#34D399' : '#1B9A72'}
                strokeWidth={2.4}
              />
            </View>
            <View style={styles.vocalTextWrap}>
              <View style={styles.vocalTitleRow}>
                <Text
                  style={[styles.vocalTitle, isDarkMode && styles.textWhite]}
                >
                  Neural Audio Cue
                </Text>
                {isPlayingAlert && (
                  <MiniAcousticBars
                    isPlaying={isPlayingAlert}
                    accentColor={isDarkMode ? '#34D399' : '#1B9A72'}
                  />
                )}
              </View>
              <Text
                style={[styles.vocalSubtitle, isDarkMode && styles.textMuted]}
              >
                Listen to voice alert preview by Sia
              </Text>
            </View>
          </View>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleToggleVocalAlert}
            style={[
              styles.vocalPlayBtn,
              isDarkMode && styles.vocalPlayBtnDark,
              isPlayingAlert && styles.vocalPlayBtnActive,
            ]}
            accessibilityRole="button"
            accessibilityLabel={
              isPlayingAlert ? 'Stop voice alert' : 'Play voice alert preview'
            }
          >
            {isPlayingAlert ? (
              <VolumeX
                size={ResponsivePixels.size15}
                color="#FFFFFF"
                strokeWidth={2.4}
              />
            ) : (
              <Volume2
                size={ResponsivePixels.size15}
                color={isDarkMode ? '#34D399' : '#1B9A72'}
                strokeWidth={2.4}
              />
            )}
          </TouchableOpacity>
        </View>

        {/* Context Notes Card (if present) */}
        {reminder.notes ? (
          <View
            style={[
              styles.noteKeepsakeCard,
              isDarkMode && styles.noteKeepsakeCardDark,
            ]}
          >
            <View style={styles.noteHeaderRow}>
              <FileText
                size={ResponsivePixels.size15}
                color={isDarkMode ? '#34D399' : '#1B9A72'}
                strokeWidth={2.2}
              />
              <Text
                style={[
                  styles.noteCardTitle,
                  isDarkMode && styles.noteCardTitleDark,
                ]}
              >
                ALERT MEMO & DETAILS
              </Text>
            </View>
            <Text
              style={[styles.noteContent, isDarkMode && styles.noteContentDark]}
            >
              {reminder.notes}
            </Text>
          </View>
        ) : null}

        {/* Alert Schedule & Horizon Parameters */}
        <View
          style={[
            styles.parametersCard,
            isDarkMode && styles.parametersCardDark,
          ]}
        >
          <Text
            style={[
              styles.parametersTitle,
              isDarkMode && styles.parametersTitleDark,
            ]}
          >
            ALERT HORIZON & SOUND PROFILE
          </Text>
          <View style={styles.parametersGrid}>
            <View style={styles.parameterItem}>
              <Clock
                size={ResponsivePixels.size14}
                color="#8E8E93"
                strokeWidth={2.2}
              />
              <View>
                <Text
                  style={[
                    styles.parameterLabel,
                    isDarkMode && styles.textMuted,
                  ]}
                >
                  Alert Time
                </Text>
                <Text
                  style={[
                    styles.parameterValue,
                    isDarkMode && styles.textWhite,
                  ]}
                >
                  {reminder.time}
                </Text>
              </View>
            </View>

            <View style={styles.parameterItem}>
              <Calendar
                size={ResponsivePixels.size14}
                color="#8E8E93"
                strokeWidth={2.2}
              />
              <View>
                <Text
                  style={[
                    styles.parameterLabel,
                    isDarkMode && styles.textMuted,
                  ]}
                >
                  Schedule Date
                </Text>
                <Text
                  style={[
                    styles.parameterValue,
                    isDarkMode && styles.textWhite,
                  ]}
                >
                  {reminder.date}
                </Text>
              </View>
            </View>

            <View style={styles.parameterItem}>
              <RotateCw
                size={ResponsivePixels.size14}
                color="#8383D6"
                strokeWidth={2.2}
              />
              <View>
                <Text
                  style={[
                    styles.parameterLabel,
                    isDarkMode && styles.textMuted,
                  ]}
                >
                  Repeat Frequency
                </Text>
                <Text
                  style={[
                    styles.parameterValue,
                    isDarkMode && styles.textWhite,
                  ]}
                >
                  {reminder.repeat || 'Once'}
                </Text>
              </View>
            </View>

            <View style={styles.parameterItem}>
              <Bell
                size={ResponsivePixels.size14}
                color="#FF9800"
                strokeWidth={2.2}
              />
              <View>
                <Text
                  style={[
                    styles.parameterLabel,
                    isDarkMode && styles.textMuted,
                  ]}
                >
                  Early Nudge
                </Text>
                <Text
                  style={[
                    styles.parameterValue,
                    isDarkMode && styles.textWhite,
                  ]}
                >
                  {reminder.remindBefore || 'At time of event'}
                </Text>
              </View>
            </View>

            <View style={styles.parameterItem}>
              <Music
                size={ResponsivePixels.size14}
                color="#7059C8"
                strokeWidth={2.2}
              />
              <View>
                <Text
                  style={[
                    styles.parameterLabel,
                    isDarkMode && styles.textMuted,
                  ]}
                >
                  Chime Sound
                </Text>
                <Text
                  style={[
                    styles.parameterValue,
                    isDarkMode && styles.textWhite,
                  ]}
                >
                  {reminder.sound || 'Gentle Bell'}
                </Text>
              </View>
            </View>

            <View style={styles.parameterItem}>
              <AlertTriangle
                size={ResponsivePixels.size14}
                color={reminder.urgentAlarm ? '#EF4444' : '#8E8E93'}
                strokeWidth={2.2}
              />
              <View>
                <Text
                  style={[
                    styles.parameterLabel,
                    isDarkMode && styles.textMuted,
                  ]}
                >
                  Urgency
                </Text>
                <Text
                  style={[
                    styles.parameterValue,
                    reminder.urgentAlarm && { color: '#EF4444' },
                    !reminder.urgentAlarm && isDarkMode && styles.textWhite,
                  ]}
                >
                  {reminder.urgentAlarm ? 'Urgent Loud Alarm' : 'Gentle Chime'}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Destructive Delete Button */}
        <View style={styles.deleteSection}>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleDelete}
            style={[styles.deleteBtn, isDarkMode && styles.deleteBtnDark]}
            accessibilityRole="button"
            accessibilityLabel={`Delete ${reminder.title}`}
          >
            <Trash2
              size={ResponsivePixels.size16}
              color="#EF4444"
              strokeWidth={2.2}
            />
            <Text style={styles.deleteBtnText}>Delete Scheduled Alert</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Sticky Bottom Action Dock */}
      <StickyActionDock>
        <StickyBottomButton
          title={
            reminder.done ? 'Restore to Upcoming Alerts' : 'Acknowledge Alert'
          }
          onPress={handleToggle}
          variant={reminder.done ? 'dark' : 'primary'}
          icon={
            reminder.done ? (
              <RotateCw
                size={ResponsivePixels.size18}
                color="#FFFFFF"
                strokeWidth={2.4}
              />
            ) : (
              <Check
                size={ResponsivePixels.size18}
                color="#FFFFFF"
                strokeWidth={2.4}
              />
            )
          }
          accessibilityLabel={
            reminder.done
              ? 'Restore reminder to active queue'
              : 'Acknowledge and mark reminder complete'
          }
        />
      </StickyActionDock>

      {/* Edit Reminder Modal */}
      <AddReminderModal
        visible={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        reminderToEdit={reminder}
        onCreateReminder={() => {}}
        onUpdateReminder={(id, remData) => {
          updateReminder(id, remData);
          setIsEditModalOpen(false);
          Toast.show({
            type: 'success',
            text1: 'Reminder Updated',
            text2: 'Alert parameters successfully saved.',
          });
        }}
        onDeleteReminder={id => {
          deleteReminder(id);
          setIsEditModalOpen(false);
          navigation.goBack();
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.CreamBackground,
  },
  containerDark: {
    backgroundColor: '#121417',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: ResponsivePixels.size16,
    gap: ResponsivePixels.size16,
  },
  headerRightGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ResponsivePixels.size8,
  },
  notFoundCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: ResponsivePixels.size12,
  },
  notFoundText: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: ResponsivePixels.size15,
    color: '#363944',
  },
  notFoundTextDark: {
    color: '#D1D5DB',
  },
  backBtnFallback: {
    paddingHorizontal: ResponsivePixels.size16,
    paddingVertical: ResponsivePixels.size8,
    backgroundColor: Colors.NeroBlack,
    borderRadius: ResponsivePixels.size14,
  },
  backBtnFallbackText: {
    fontFamily: Fonts.poppins.medium,
    fontSize: ResponsivePixels.size13,
    color: '#FFFFFF',
  },
  cardShadowWrapper: {
    width: '100%',
    borderRadius: ResponsivePixels.size24,
    backgroundColor: Colors.NeroBlack,
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.28,
        shadowRadius: 18,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  card: {
    position: 'relative',
    backgroundColor: Colors.NeroBlack,
    borderRadius: ResponsivePixels.size24,
    borderWidth: 4,
    borderColor: 'rgba(255, 255, 255, 0.9)',
    overflow: 'hidden',
  },
  bentoContent: {
    padding: ResponsivePixels.size20,
    gap: ResponsivePixels.size12,
  },
  bentoTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  frostedDomainPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ResponsivePixels.size6,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    paddingHorizontal: ResponsivePixels.size10,
    paddingVertical: ResponsivePixels.size4,
    borderRadius: ResponsivePixels.size12,
  },
  frostedDomainText: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: ResponsivePixels.size11,
    letterSpacing: 0.5,
  },
  bentoTitle: {
    fontFamily: Fonts.poppins.bold,
    fontSize: ResponsivePixels.size22,
    color: '#FFFFFF',
    lineHeight: ResponsivePixels.size28,
  },
  bentoMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ResponsivePixels.size8,
    flexWrap: 'wrap',
    marginTop: ResponsivePixels.size4,
  },
  metaChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ResponsivePixels.size5,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    paddingHorizontal: ResponsivePixels.size8,
    paddingVertical: ResponsivePixels.size4,
    borderRadius: ResponsivePixels.size8,
  },
  metaChipText: {
    fontFamily: Fonts.poppins.medium,
    fontSize: ResponsivePixels.size11,
    color: '#D1D5DB',
    letterSpacing: 0.3,
  },
  urgentChip: {
    backgroundColor: 'rgba(239, 68, 68, 0.18)',
  },
  urgentChipText: {
    fontFamily: Fonts.poppins.bold,
    fontSize: ResponsivePixels.size10,
    color: '#EF4444',
    letterSpacing: 0.4,
  },
  vocalCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    padding: ResponsivePixels.size14,
    borderRadius: ResponsivePixels.size20,
    borderWidth: 1.5,
    borderColor: '#D8F7E7',
    ...Platform.select({
      ios: {
        shadowColor: '#1B9A72',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.08,
        shadowRadius: 6,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  vocalCardDark: {
    backgroundColor: '#1E2228',
    borderColor: '#2C3035',
  },
  vocalLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ResponsivePixels.size12,
    flex: 1,
  },
  vocalIconAura: {
    width: ResponsivePixels.size38,
    height: ResponsivePixels.size38,
    borderRadius: ResponsivePixels.size19,
    backgroundColor: '#EDFDF5',
    borderWidth: 1,
    borderColor: '#C6FFDD',
    alignItems: 'center',
    justifyContent: 'center',
  },
  vocalIconAuraDark: {
    backgroundColor: 'rgba(27, 154, 114, 0.16)',
    borderColor: 'rgba(27, 154, 114, 0.32)',
  },
  vocalTextWrap: {
    flex: 1,
  },
  vocalTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ResponsivePixels.size8,
  },
  vocalTitle: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: ResponsivePixels.size14,
    color: '#1B1C19',
  },
  vocalSubtitle: {
    fontFamily: Fonts.poppins.regular,
    fontSize: ResponsivePixels.size11,
    color: '#8E8E93',
  },
  vocalPlayBtn: {
    width: ResponsivePixels.size36,
    height: ResponsivePixels.size36,
    borderRadius: ResponsivePixels.size18,
    backgroundColor: '#EDFDF5',
    borderWidth: 1,
    borderColor: '#C6FFDD',
    alignItems: 'center',
    justifyContent: 'center',
  },
  vocalPlayBtnDark: {
    backgroundColor: 'rgba(27, 154, 114, 0.16)',
    borderColor: 'rgba(27, 154, 114, 0.32)',
  },
  vocalPlayBtnActive: {
    backgroundColor: '#1B9A72',
    borderColor: '#1B9A72',
  },
  noteKeepsakeCard: {
    backgroundColor: '#F5FDF9',
    padding: ResponsivePixels.size16,
    borderRadius: ResponsivePixels.size20,
    borderWidth: 1.5,
    borderColor: '#C6FFDD',
    gap: ResponsivePixels.size8,
  },
  noteKeepsakeCardDark: {
    backgroundColor: '#1E2228',
    borderColor: '#1D3B2D',
  },
  noteHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ResponsivePixels.size6,
  },
  noteCardTitle: {
    fontFamily: Fonts.poppins.bold,
    fontSize: ResponsivePixels.size11,
    color: '#1B9A72',
    letterSpacing: 0.6,
  },
  noteCardTitleDark: {
    color: '#34D399',
  },
  noteContent: {
    fontFamily: Fonts.poppins.regular,
    fontSize: ResponsivePixels.size14,
    lineHeight: ResponsivePixels.size20,
    color: '#363944',
  },
  noteContentDark: {
    color: '#E5E7EB',
  },
  parametersCard: {
    backgroundColor: '#FFFFFF',
    padding: ResponsivePixels.size16,
    borderRadius: ResponsivePixels.size20,
    borderWidth: 1.5,
    borderColor: '#EAE6DD',
    gap: ResponsivePixels.size12,
  },
  parametersCardDark: {
    backgroundColor: '#1E2228',
    borderColor: '#2C3035',
  },
  parametersTitle: {
    fontFamily: Fonts.poppins.bold,
    fontSize: ResponsivePixels.size11,
    color: '#7E838F',
    letterSpacing: 0.6,
  },
  parametersTitleDark: {
    color: '#A3A8B1',
  },
  parametersGrid: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: ResponsivePixels.size12,
  },
  parameterItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ResponsivePixels.size8,
    minWidth: '45%',
  },
  parameterLabel: {
    fontFamily: Fonts.poppins.regular,
    fontSize: ResponsivePixels.size11,
    color: '#8E8E93',
  },
  parameterValue: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: ResponsivePixels.size13,
    color: '#1B1C19',
  },
  deleteSection: {
    marginTop: ResponsivePixels.size4,
    marginBottom: ResponsivePixels.size16,
  },
  deleteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: ResponsivePixels.size8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#FECDD3',
    paddingVertical: ResponsivePixels.size13,
    borderRadius: ResponsivePixels.size18,
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
  deleteBtnDark: {
    backgroundColor: '#1E2228',
    borderColor: '#5C2227',
  },
  deleteBtnText: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: ResponsivePixels.size13,
    color: '#EF4444',
  },
  textWhite: {
    color: '#FFFFFF',
  },
  textMuted: {
    color: '#8E8E93',
  },
});

export default ReminderDetailsScreen;
