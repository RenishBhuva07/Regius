import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Animated,
  Vibration,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  X,
  Flame,
  Sun,
  Moon,
  Sparkles,
  Compass,
  Clock,
  Repeat,
  Check,
} from 'lucide-react-native';
import { Fonts } from '../Theme/fonts';
import { Typography } from '../Theme/Typographys';
import { Colors } from '../Assets/StyleUtilities/Colors';
import Toast from 'react-native-toast-message';

interface AddHabitModalProps {
  visible: boolean;
  onClose: () => void;
  onCreateHabit: (habitData: {
    title: string;
    category: 'morning' | 'mindful' | 'evening';
    frequency: string;
    timeOfDay: string;
    accentColor: string;
  }) => void;
}

export const AddHabitModal: React.FC<AddHabitModalProps> = ({
  visible,
  onClose,
  onCreateHabit,
}) => {
  const insets = useSafeAreaInsets();
  const slideAnim = useRef(new Animated.Value(600)).current;

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'morning' | 'mindful' | 'evening'>(
    'morning',
  );
  const [frequency, setFrequency] = useState('Daily');
  const [timeOfDay, setTimeOfDay] = useState('07:30 AM');

  useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, {
        toValue: 0,
        friction: 8,
        tension: 65,
        useNativeDriver: true,
      }).start();
    } else {
      slideAnim.setValue(600);
      setTitle('');
    }
  }, [visible, slideAnim]);

  const handleSave = () => {
    if (!title.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Habit Title Required',
        text2: 'Please name your daily ritual to begin tracking.',
      });
      return;
    }

    if (Platform.OS === 'ios') {
      Vibration.vibrate(40);
    }

    const accentColor =
      category === 'morning'
        ? '#4A7C59'
        : category === 'mindful'
        ? '#7C68EE'
        : '#4F46E5';

    onCreateHabit({
      title: title.trim(),
      category,
      frequency,
      timeOfDay,
      accentColor,
    });

    Toast.show({
      type: 'success',
      text1: 'Habit Created! 🔥',
      text2: `"${title.trim()}" added to your daily consistency flow.`,
    });

    onClose();
  };

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={styles.backdrop}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <TouchableOpacity
          style={styles.dismissArea}
          activeOpacity={1}
          onPress={onClose}
        />

        <Animated.View
          style={[
            styles.container,
            {
              paddingBottom: Math.max(insets.bottom, 20),
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={styles.handle} />

          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerTitleWrap}>
              <View style={styles.flameBadge}>
                <Flame size={15} color="#E65100" />
                <Text style={styles.flameBadgeText}>New Daily Habit</Text>
              </View>
              <Text style={styles.headerTitle}>Build Ritual</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X size={18} color="#1B1C19" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Title Input */}
            <View style={styles.fieldSection}>
              <Text style={styles.fieldLabel}>Habit Name</Text>
              <TextInput
                value={title}
                onChangeText={setTitle}
                placeholder="e.g. Morning Sunlight & 500ml Water"
                placeholderTextColor="#A0A09B"
                style={styles.input}
              />
            </View>

            {/* Category Selector */}
            <View style={styles.fieldSection}>
              <Text style={styles.fieldLabel}>Category & Ritual Flow</Text>
              <View style={styles.categoryRow}>
                {[
                  { id: 'morning', label: 'Morning', icon: Sun, color: '#4A7C59' },
                  {
                    id: 'mindful',
                    label: 'Mindful',
                    icon: Sparkles,
                    color: '#7C68EE',
                  },
                  { id: 'evening', label: 'Evening', icon: Moon, color: '#4F46E5' },
                ].map(c => {
                  const isSelected = category === c.id;
                  const Icon = c.icon;
                  return (
                    <TouchableOpacity
                      key={c.id}
                      activeOpacity={0.8}
                      onPress={() => setCategory(c.id as any)}
                      style={[
                        styles.categoryCard,
                        isSelected && {
                          borderColor: c.color,
                          backgroundColor: `${c.color}14`,
                        },
                      ]}
                    >
                      <Icon
                        size={18}
                        color={isSelected ? c.color : '#767772'}
                      />
                      <Text
                        style={[
                          styles.categoryText,
                          isSelected && { color: c.color, fontFamily: Fonts.poppins.bold },
                        ]}
                      >
                        {c.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Frequency Selector */}
            <View style={styles.fieldSection}>
              <Text style={styles.fieldLabel}>Frequency</Text>
              <View style={styles.chipsRow}>
                {['Daily', 'Mon, Wed, Fri', 'Weekdays', 'Weekends'].map(f => {
                  const isSelected = frequency === f;
                  return (
                    <TouchableOpacity
                      key={f}
                      activeOpacity={0.8}
                      onPress={() => setFrequency(f)}
                      style={[
                        styles.chip,
                        isSelected && styles.chipActive,
                      ]}
                    >
                      <Text
                        style={[
                          styles.chipText,
                          isSelected && styles.chipTextActive,
                        ]}
                      >
                        {f}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Time of Day */}
            <View style={styles.fieldSection}>
              <Text style={styles.fieldLabel}>Ideal Time of Day</Text>
              <View style={styles.timeInputWrap}>
                <Clock size={16} color="#767772" />
                <TextInput
                  value={timeOfDay}
                  onChangeText={setTimeOfDay}
                  placeholder="08:00 AM"
                  placeholderTextColor="#A0A09B"
                  style={styles.timeInput}
                />
              </View>
            </View>

            {/* Save Button */}
            <TouchableOpacity
              activeOpacity={0.88}
              onPress={handleSave}
              style={styles.saveBtn}
            >
              <Check size={18} color="#FFFFFF" strokeWidth={2.4} />
              <Text style={styles.saveBtnText}>Save Habit Flow</Text>
            </TouchableOpacity>
          </ScrollView>
        </Animated.View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(27, 28, 25, 0.45)',
    justifyContent: 'flex-end',
  },
  dismissArea: {
    flex: 1,
  },
  container: {
    backgroundColor: '#FBF9F3',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 22,
    paddingTop: 12,
    maxHeight: '85%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.12,
    shadowRadius: 18,
    elevation: 16,
  },
  handle: {
    width: 44,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#C7C6CA',
    alignSelf: 'center',
    marginBottom: 14,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  headerTitleWrap: {
    gap: 3,
  },
  flameBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#FFF3E0',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  flameBadgeText: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: 11,
    color: '#E65100',
  },
  headerTitle: {
    ...Typography.h1RanadeBold,
    fontSize: 24,
    color: '#1B1C19',
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F0EEE8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fieldSection: {
    marginBottom: 18,
    gap: 8,
  },
  fieldLabel: {
    fontFamily: Fonts.poppins.medium,
    fontSize: 13,
    color: '#49454F',
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.2,
    borderColor: '#E8E2D5',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontFamily: Fonts.poppins.medium,
    fontSize: 14,
    color: '#1B1C19',
  },
  categoryRow: {
    flexDirection: 'row',
    gap: 10,
  },
  categoryCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E8E2D5',
    borderRadius: 16,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  categoryText: {
    fontFamily: Fonts.poppins.medium,
    fontSize: 12,
    color: '#49454F',
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.2,
    borderColor: '#E8E2D5',
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  chipActive: {
    backgroundColor: Colors.LavenderPurple,
    borderColor: Colors.LavenderPurple,
  },
  chipText: {
    fontFamily: Fonts.poppins.medium,
    fontSize: 12,
    color: '#49454F',
  },
  chipTextActive: {
    color: '#FFFFFF',
    fontFamily: Fonts.poppins.bold,
  },
  timeInputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.2,
    borderColor: '#E8E2D5',
    borderRadius: 16,
    paddingHorizontal: 14,
    gap: 8,
  },
  timeInput: {
    flex: 1,
    paddingVertical: 12,
    fontFamily: Fonts.poppins.medium,
    fontSize: 14,
    color: '#1B1C19',
  },
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#2D5A37',
    paddingVertical: 15,
    borderRadius: 20,
    marginTop: 8,
    marginBottom: 16,
    shadowColor: '#2D5A37',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
  },
  saveBtnText: {
    fontFamily: Fonts.poppins.bold,
    fontSize: 15,
    color: '#FFFFFF',
  },
});

export default AddHabitModal;
