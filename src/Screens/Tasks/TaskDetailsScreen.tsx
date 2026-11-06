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
  TextInput,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import {
  Check,
  Clock,
  Calendar,
  Sparkles,
  Pencil,
  Volume2,
  VolumeX,
  Trash2,
  Briefcase,
  Heart,
  Users,
  Target,
  Plus,
  Flame,
  FileText,
  RotateCw,
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
import { useTaskReminder, Task } from '../../Context/TaskReminderContext';
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
import AddTaskModal from '../../Components/AddTaskModal';
import { KokoroTTSService } from '../../Services/Kokoro/KokoroTTSService';
import { AudioPlayerService } from '../../Services/AudioPlayerService';
import { TaskDetailsBackgroundSvg } from './Components/TaskDetailsBackgroundSvg';

export interface TaskDetailsScreenRouteParams {
  taskId: string;
}

/**
 * Ambient background for Task Details Hero Bento Card
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
            id="taskHeroBentoBg"
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
            id="taskDetailsAccentGlow"
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

        <Rect width="100%" height="100%" fill="url(#taskHeroBentoBg)" />
        <Rect width="100%" height="100%" fill="url(#taskDetailsAccentGlow)" />

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

export const TaskDetailsScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const route =
    useRoute<RouteProp<{ params: TaskDetailsScreenRouteParams }, 'params'>>();
  const { isDarkMode } = useTheme();

  const taskId = route.params?.taskId;
  const { tasks, toggleTask, updateTask, deleteTask } = useTaskReminder();

  const task = useMemo(() => tasks.find(t => t.id === taskId), [tasks, taskId]);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPlayingBriefing, setIsPlayingBriefing] = useState(false);
  const [newSubtaskText, setNewSubtaskText] = useState('');

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
    if (task?.category === 'sport') {
      return {
        label: 'HEALTH & SPORT',
        badgeVariant: 'green' as BadgeVariant,
        accent: '#52D22E',
        bgTint: '#F5FDF9',
        borderColor: '#C6FFDD',
        icon: Heart,
        iconColor: '#1B9A72',
      };
    }
    if (task?.category === 'habits') {
      return {
        label: 'MINDFUL HABITS',
        badgeVariant: 'purple' as BadgeVariant,
        accent: '#8383D6',
        bgTint: '#F7F8FE',
        borderColor: '#D8DBFF',
        icon: Sparkles,
        iconColor: '#7059C8',
      };
    }
    if (task?.category === 'works' || !task?.category) {
      return {
        label: 'WORKS & EXECUTION',
        badgeVariant: 'yellow' as BadgeVariant,
        accent: '#F5C518',
        bgTint: '#FFFCEB',
        borderColor: '#FFF5B8',
        icon: Briefcase,
        iconColor: '#B47804',
      };
    }
    return {
      label: (task.category || 'COLLABORATION').toUpperCase(),
      badgeVariant: 'neutral' as BadgeVariant,
      accent: '#8E8E93',
      bgTint: '#F5F6F8',
      borderColor: '#E5E5EA',
      icon: Users,
      iconColor: '#454A53',
    };
  }, [task?.category]);

  const IconComponent = categoryTheme.icon;

  const handleToggle = useCallback(() => {
    if (!task) return;

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

    const updated = toggleTask(task.id);
    if (updated) {
      Toast.show({
        type: 'success',
        text1: updated.done ? 'Task Completed! 🎯' : 'Task Restored',
        text2: updated.done
          ? 'Great momentum on your focus items!'
          : 'Task returned to active status.',
      });
    }
  }, [task, toggleTask, scaleAnim]);

  const handleToggleVocalBriefing = useCallback(async () => {
    if (!task) return;
    Vibration.vibrate(25);

    sessionIdRef.current += 1;
    const currentSession = sessionIdRef.current;

    if (playbackUnsubRef.current) {
      playbackUnsubRef.current();
      playbackUnsubRef.current = null;
    }

    if (isPlayingBriefing) {
      await KokoroTTSService.stop();
      await AudioPlayerService.stop();
      setIsPlayingBriefing(false);
      return;
    }

    setIsPlayingBriefing(true);
    const priorityText = task.priority
      ? `${task.priority} priority`
      : 'regular priority';
    const scheduleText = task.time
      ? `scheduled for ${task.time}`
      : 'due today without a fixed time';
    const spokenText = `Task briefing: ${task.label}. Category: ${categoryTheme.label}. Marked as ${priorityText}, ${scheduleText}.`;

    const unsub = AudioPlayerService.onPlaybackFinished(() => {
      if (sessionIdRef.current === currentSession) {
        setIsPlayingBriefing(false);
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
        setIsPlayingBriefing(false);
      }
    }
  }, [task, isPlayingBriefing, categoryTheme.label]);

  const handleToggleSubtask = useCallback(
    (subtaskId: string) => {
      if (!task || !task.subtasks) return;
      Vibration.vibrate(15);
      const updatedSubtasks = task.subtasks.map(s =>
        s.id === subtaskId ? { ...s, done: !s.done } : s,
      );
      updateTask(task.id, { subtasks: updatedSubtasks });
    },
    [task, updateTask],
  );

  const handleDeleteSubtask = useCallback(
    (subtaskId: string) => {
      if (!task || !task.subtasks) return;
      Vibration.vibrate(20);
      const updatedSubtasks = task.subtasks.filter(s => s.id !== subtaskId);
      updateTask(task.id, { subtasks: updatedSubtasks });
    },
    [task, updateTask],
  );

  const handleAddSubtask = useCallback(() => {
    if (!task || !newSubtaskText.trim()) return;
    const newItem = {
      id: Date.now().toString(),
      text: newSubtaskText.trim(),
      done: false,
    };
    const updatedSubtasks = [...(task.subtasks || []), newItem];
    updateTask(task.id, { subtasks: updatedSubtasks });
    setNewSubtaskText('');
  }, [task, newSubtaskText, updateTask]);

  const handleDelete = useCallback(() => {
    if (!task) return;
    Vibration.vibrate(30);

    Alert.alert(
      'Delete Task',
      `Are you sure you want to delete "${task.label}"? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteTask(task.id);
            Toast.show({
              type: 'info',
              text1: 'Task Removed',
              text2: 'The objective has been removed from your list.',
            });
            navigation.goBack();
          },
        },
      ],
    );
  }, [task, deleteTask, navigation]);

  if (!task) {
    return (
      <View style={[styles.container, isDarkMode && styles.containerDark]}>
        <SubScreenHeader
          title="Task Details"
          scrollY={scrollY}
          isScrolled={isScrolled}
          onPressBack={() => navigation.goBack()}
        />
        <View style={styles.notFoundCenter}>
          <Text
            style={[styles.notFoundText, isDarkMode && styles.notFoundTextDark]}
          >
            Task objective not found.
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

  const subtasksList = task.subtasks || [];
  const completedSubtasks = subtasksList.filter(s => s.done).length;
  const subtasksProgress =
    subtasksList.length > 0
      ? Math.round((completedSubtasks / subtasksList.length) * 100)
      : 0;

  return (
    <View style={[styles.container, isDarkMode && styles.containerDark]}>
      {/* Luxury Ambient Canvas Background Svg */}
      <TaskDetailsBackgroundSvg accentColor={categoryTheme.accent} />

      {/* Scroll-Reactive Luxury SubScreenHeader */}
      <SubScreenHeader
        title="Task Details"
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
              accessibilityLabel={`Edit ${task.label}`}
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
                  label={task.done ? 'COMPLETED' : 'IN PROGRESS'}
                  variant={task.done ? 'green' : 'yellow'}
                  size="sm"
                />
              </View>

              <Text style={styles.bentoTitle} numberOfLines={3}>
                {task.label}
              </Text>

              <View style={styles.bentoMetaRow}>
                {task.priority && (
                  <View style={styles.metaChip}>
                    <Flame
                      size={ResponsivePixels.size12}
                      color="#FF9800"
                      strokeWidth={2.2}
                    />
                    <Text style={styles.metaChipText}>
                      {task.priority.toUpperCase()} PRIORITY
                    </Text>
                  </View>
                )}

                <View style={styles.metaChip}>
                  <Clock
                    size={ResponsivePixels.size12}
                    color="#8E8E93"
                    strokeWidth={2.2}
                  />
                  <Text style={styles.metaChipText}>
                    {task.time || 'Flexible Time'}
                  </Text>
                </View>

                {subtasksList.length > 0 && (
                  <View style={styles.metaChip}>
                    <Target
                      size={ResponsivePixels.size12}
                      color="#52D22E"
                      strokeWidth={2.2}
                    />
                    <Text style={styles.metaChipText}>
                      {completedSubtasks}/{subtasksList.length} SUBTASKS
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </View>
        </View>

        {/* Vocal Guidance & Briefing Card with Acoustic Equalizer */}
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
                color={isDarkMode ? '#A592F2' : '#7059C8'}
                strokeWidth={2.4}
              />
            </View>
            <View style={styles.vocalTextWrap}>
              <View style={styles.vocalTitleRow}>
                <Text
                  style={[styles.vocalTitle, isDarkMode && styles.textWhite]}
                >
                  Sia AI Vocal Briefing
                </Text>
                {isPlayingBriefing && (
                  <MiniAcousticBars
                    isPlaying={isPlayingBriefing}
                    accentColor={isDarkMode ? '#A592F2' : '#7059C8'}
                  />
                )}
              </View>
              <Text
                style={[styles.vocalSubtitle, isDarkMode && styles.textMuted]}
              >
                Neural audio breakdown of parameters
              </Text>
            </View>
          </View>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleToggleVocalBriefing}
            style={[
              styles.vocalPlayBtn,
              isDarkMode && styles.vocalPlayBtnDark,
              isPlayingBriefing && styles.vocalPlayBtnActive,
            ]}
            accessibilityRole="button"
            accessibilityLabel={
              isPlayingBriefing ? 'Stop voice briefing' : 'Play voice briefing'
            }
          >
            {isPlayingBriefing ? (
              <VolumeX
                size={ResponsivePixels.size15}
                color="#FFFFFF"
                strokeWidth={2.4}
              />
            ) : (
              <Volume2
                size={ResponsivePixels.size15}
                color={isDarkMode ? '#A592F2' : '#7059C8'}
                strokeWidth={2.4}
              />
            )}
          </TouchableOpacity>
        </View>

        {/* Context Note Keepsake Card (if present) */}
        {task.note ? (
          <View
            style={[
              styles.noteKeepsakeCard,
              isDarkMode && styles.noteKeepsakeCardDark,
            ]}
          >
            <View style={styles.noteHeaderRow}>
              <FileText
                size={ResponsivePixels.size15}
                color={isDarkMode ? '#F5C518' : '#B48216'}
                strokeWidth={2.2}
              />
              <Text
                style={[
                  styles.noteCardTitle,
                  isDarkMode && styles.noteCardTitleDark,
                ]}
              >
                OBJECTIVE CONTEXT & MEMO
              </Text>
            </View>
            <Text
              style={[styles.noteContent, isDarkMode && styles.noteContentDark]}
            >
              {task.note}
            </Text>
          </View>
        ) : null}

        {/* Interactive Subtasks Checklist Module */}
        <View
          style={[styles.subtasksCard, isDarkMode && styles.subtasksCardDark]}
        >
          <View style={styles.subtasksHeaderRow}>
            <View style={styles.subtasksHeaderTitles}>
              <Text
                style={[styles.subtasksTitle, isDarkMode && styles.textWhite]}
              >
                Subtasks Checklist
              </Text>
              <Text
                style={[
                  styles.subtasksSubtitle,
                  isDarkMode && styles.textMuted,
                ]}
              >
                {subtasksList.length > 0
                  ? `${completedSubtasks} of ${subtasksList.length} completed (${subtasksProgress}%)`
                  : 'Add smaller milestones to break down this endeavor'}
              </Text>
            </View>
            {subtasksList.length > 0 && (
              <Badge
                label={`${subtasksProgress}% DONE`}
                variant={subtasksProgress === 100 ? 'green' : 'purple'}
                size="sm"
              />
            )}
          </View>

          {/* Progress track */}
          {subtasksList.length > 0 && (
            <View
              style={[
                styles.progressTrack,
                isDarkMode && styles.progressTrackDark,
              ]}
            >
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${subtasksProgress}%`,
                    backgroundColor:
                      subtasksProgress === 100
                        ? '#1B9A72'
                        : categoryTheme.accent,
                  },
                ]}
              />
            </View>
          )}

          {/* Subtask items */}
          <View style={styles.subtasksListWrap}>
            {subtasksList.map(subtask => (
              <View
                key={subtask.id}
                style={[
                  styles.subtaskRow,
                  isDarkMode && styles.subtaskRowDark,
                  subtask.done &&
                    (isDarkMode
                      ? styles.subtaskRowDoneDark
                      : styles.subtaskRowDone),
                ]}
              >
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => handleToggleSubtask(subtask.id)}
                  style={styles.subtaskInteractiveArea}
                >
                  <View
                    style={[
                      styles.subtaskCheckbox,
                      isDarkMode && styles.subtaskCheckboxDark,
                      subtask.done && styles.subtaskCheckboxDone,
                    ]}
                  >
                    {subtask.done && (
                      <Check
                        size={ResponsivePixels.size12}
                        color="#FFFFFF"
                        strokeWidth={3}
                      />
                    )}
                  </View>
                  <Text
                    style={[
                      styles.subtaskText,
                      isDarkMode && styles.textWhite,
                      subtask.done && styles.subtaskTextDone,
                    ]}
                    numberOfLines={2}
                  >
                    {subtask.text}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => handleDeleteSubtask(subtask.id)}
                  style={styles.subtaskDeleteBtn}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  accessibilityLabel="Delete subtask"
                >
                  <Trash2
                    size={ResponsivePixels.size13}
                    color="#EF4444"
                    strokeWidth={2}
                  />
                </TouchableOpacity>
              </View>
            ))}
          </View>

          {/* Quick add subtask input */}
          <View style={styles.addSubtaskRow}>
            <TextInput
              style={[
                styles.addSubtaskInput,
                isDarkMode && styles.addSubtaskInputDark,
              ]}
              placeholder="Add step or milestone..."
              placeholderTextColor={isDarkMode ? '#6B7280' : '#A3A8B1'}
              value={newSubtaskText}
              onChangeText={setNewSubtaskText}
              onSubmitEditing={handleAddSubtask}
              returnKeyType="done"
            />
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleAddSubtask}
              style={styles.addSubtaskBtn}
              accessibilityRole="button"
              accessibilityLabel="Add subtask"
            >
              <Plus
                size={ResponsivePixels.size16}
                color="#FFFFFF"
                strokeWidth={2.4}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Schedule & Parameters Grid */}
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
            SCHEDULE & PARAMETERS
          </Text>
          <View style={styles.parametersGrid}>
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
                  Due Date
                </Text>
                <Text
                  style={[
                    styles.parameterValue,
                    isDarkMode && styles.textWhite,
                  ]}
                >
                  {task.date || 'Today'}
                </Text>
              </View>
            </View>

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
                  Target Time
                </Text>
                <Text
                  style={[
                    styles.parameterValue,
                    isDarkMode && styles.textWhite,
                  ]}
                >
                  {task.time || 'Flexible'}
                </Text>
              </View>
            </View>

            <View style={styles.parameterItem}>
              <Sparkles
                size={ResponsivePixels.size14}
                color={isDarkMode ? '#A592F2' : '#7059C8'}
                strokeWidth={2.2}
              />
              <View>
                <Text
                  style={[
                    styles.parameterLabel,
                    isDarkMode && styles.textMuted,
                  ]}
                >
                  Voice Nudge
                </Text>
                <Text
                  style={[
                    styles.parameterValue,
                    isDarkMode && styles.textWhite,
                  ]}
                >
                  {task.voiceNudge ? 'Enabled' : 'Disabled'}
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
            accessibilityLabel={`Delete ${task.label}`}
          >
            <Trash2
              size={ResponsivePixels.size16}
              color="#EF4444"
              strokeWidth={2.2}
            />
            <Text style={styles.deleteBtnText}>Delete Task Objective</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Sticky Bottom Action Dock */}
      <StickyActionDock>
        <StickyBottomButton
          title={task.done ? 'Restore to Active List' : 'Mark Task Complete'}
          onPress={handleToggle}
          variant={task.done ? 'dark' : 'primary'}
          icon={
            task.done ? (
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
            task.done
              ? 'Restore task to active list'
              : 'Mark task objective as complete'
          }
        />
      </StickyActionDock>

      {/* Edit Task Modal */}
      <AddTaskModal
        visible={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        taskToEdit={task}
        onCreateTask={() => {}}
        onUpdateTask={(id, taskData) => {
          updateTask(id, {
            ...taskData,
            label: taskData.title,
          });
          setIsEditModalOpen(false);
          Toast.show({
            type: 'success',
            text1: 'Task Updated',
            text2: 'Objective parameters successfully saved.',
          });
        }}
        onDeleteTask={id => {
          deleteTask(id);
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
  vocalCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    padding: ResponsivePixels.size14,
    borderRadius: ResponsivePixels.size20,
    borderWidth: 1.5,
    borderColor: '#ECE8FB',
    ...Platform.select({
      ios: {
        shadowColor: '#7059C8',
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
    backgroundColor: '#EFF2FE',
    borderWidth: 1,
    borderColor: '#D8DBFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  vocalIconAuraDark: {
    backgroundColor: 'rgba(131, 131, 214, 0.16)',
    borderColor: 'rgba(131, 131, 214, 0.32)',
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
    backgroundColor: '#EFF2FE',
    borderWidth: 1,
    borderColor: '#D8DBFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  vocalPlayBtnDark: {
    backgroundColor: 'rgba(131, 131, 214, 0.16)',
    borderColor: 'rgba(131, 131, 214, 0.32)',
  },
  vocalPlayBtnActive: {
    backgroundColor: '#7059C8',
    borderColor: '#7059C8',
  },
  noteKeepsakeCard: {
    backgroundColor: '#FFFDF7',
    padding: ResponsivePixels.size16,
    borderRadius: ResponsivePixels.size20,
    borderWidth: 1.5,
    borderColor: '#FFF5B8',
    gap: ResponsivePixels.size8,
  },
  noteKeepsakeCardDark: {
    backgroundColor: '#1E2228',
    borderColor: '#3D3418',
  },
  noteHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ResponsivePixels.size6,
  },
  noteCardTitle: {
    fontFamily: Fonts.poppins.bold,
    fontSize: ResponsivePixels.size11,
    color: '#B48216',
    letterSpacing: 0.6,
  },
  noteCardTitleDark: {
    color: '#F5C518',
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
  subtasksCard: {
    backgroundColor: '#FFFFFF',
    padding: ResponsivePixels.size16,
    borderRadius: ResponsivePixels.size20,
    borderWidth: 1.5,
    borderColor: '#EAE6DD',
    gap: ResponsivePixels.size12,
  },
  subtasksCardDark: {
    backgroundColor: '#1E2228',
    borderColor: '#2C3035',
  },
  subtasksHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  subtasksHeaderTitles: {
    flex: 1,
    paddingRight: ResponsivePixels.size8,
  },
  subtasksTitle: {
    fontFamily: Fonts.poppins.bold,
    fontSize: ResponsivePixels.size15,
    color: '#1B1C19',
  },
  subtasksSubtitle: {
    fontFamily: Fonts.poppins.regular,
    fontSize: ResponsivePixels.size12,
    color: '#7E838F',
    marginTop: 1,
  },
  progressTrack: {
    height: ResponsivePixels.size6,
    backgroundColor: '#F0ECE1',
    borderRadius: ResponsivePixels.size3,
    overflow: 'hidden',
  },
  progressTrackDark: {
    backgroundColor: '#2C3035',
  },
  progressFill: {
    height: '100%',
    borderRadius: ResponsivePixels.size3,
  },
  subtasksListWrap: {
    gap: ResponsivePixels.size8,
  },
  subtaskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FAF8F5',
    paddingVertical: ResponsivePixels.size10,
    paddingHorizontal: ResponsivePixels.size12,
    borderRadius: ResponsivePixels.size14,
    borderWidth: 1,
    borderColor: '#EDE9E0',
  },
  subtaskRowDark: {
    backgroundColor: '#252932',
    borderColor: '#333742',
  },
  subtaskRowDone: {
    backgroundColor: '#F5FDF9',
    borderColor: '#D8F7E7',
  },
  subtaskRowDoneDark: {
    backgroundColor: 'rgba(27, 154, 114, 0.12)',
    borderColor: 'rgba(27, 154, 114, 0.28)',
  },
  subtaskInteractiveArea: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ResponsivePixels.size10,
    flex: 1,
  },
  subtaskCheckbox: {
    width: ResponsivePixels.size20,
    height: ResponsivePixels.size20,
    borderRadius: ResponsivePixels.size6,
    borderWidth: 1.5,
    borderColor: '#B0ACA2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  subtaskCheckboxDark: {
    borderColor: '#555A67',
  },
  subtaskCheckboxDone: {
    backgroundColor: '#1B9A72',
    borderColor: '#1B9A72',
  },
  subtaskText: {
    fontFamily: Fonts.poppins.medium,
    fontSize: ResponsivePixels.size13,
    color: '#1B1C19',
    flex: 1,
  },
  subtaskTextDone: {
    color: '#8E8E93',
    textDecorationLine: 'line-through',
  },
  subtaskDeleteBtn: {
    padding: ResponsivePixels.size4,
    opacity: 0.8,
  },
  addSubtaskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ResponsivePixels.size8,
    marginTop: ResponsivePixels.size4,
  },
  addSubtaskInput: {
    flex: 1,
    fontFamily: Fonts.poppins.regular,
    fontSize: ResponsivePixels.size13,
    color: '#1B1C19',
    backgroundColor: '#FAF8F5',
    borderWidth: 1,
    borderColor: '#EDE9E0',
    paddingHorizontal: ResponsivePixels.size12,
    paddingVertical: ResponsivePixels.size8,
    borderRadius: ResponsivePixels.size12,
  },
  addSubtaskInputDark: {
    backgroundColor: '#252932',
    borderColor: '#333742',
    color: '#FFFFFF',
  },
  addSubtaskBtn: {
    width: ResponsivePixels.size36,
    height: ResponsivePixels.size36,
    borderRadius: ResponsivePixels.size12,
    backgroundColor: Colors.NeroBlack,
    alignItems: 'center',
    justifyContent: 'center',
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
  textLight: {
    color: '#D1D5DB',
  },
  textMuted: {
    color: '#8E8E93',
  },
});

export default TaskDetailsScreen;
