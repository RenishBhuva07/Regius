import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StyleSheet,
  Animated,
  Dimensions,
  Platform,
  Easing,
} from 'react-native';
import { CheckSquare, Bell, ChevronRight, Sparkles } from 'lucide-react-native';
import { Colors } from '../Assets/StyleUtilities/Colors';
import { Fonts } from '../Theme/fonts';
import { Badge } from '../Common/Badge';

const { width: SW } = Dimensions.get('window');
const SHEET_W = Math.min(SW - 32, 332);

export interface PlusActionSheetProps {
  visible: boolean;
  onClose: () => void;
  onPressNewTask: () => void;
  onPressNewReminder: () => void;
  bottomOffset: number;
  onDismissed?: () => void;
}

export const PlusActionSheet: React.FC<PlusActionSheetProps> = ({
  visible,
  onClose,
  onPressNewTask,
  onPressNewReminder,
  bottomOffset,
  onDismissed,
}) => {
  const [mounted, setMounted] = useState(visible);
  const anim = useRef(new Animated.Value(0)).current;
  const backdropAnim = useRef(new Animated.Value(0)).current;
  const onDismissedRef = useRef(onDismissed);
  onDismissedRef.current = onDismissed;

  useEffect(() => {
    if (visible) {
      setMounted(true);
      Animated.parallel([
        Animated.timing(backdropAnim, {
          toValue: 1,
          duration: 220,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.spring(anim, {
          toValue: 1,
          tension: 75,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();
    } else if (mounted) {
      Animated.parallel([
        Animated.timing(backdropAnim, {
          toValue: 0,
          duration: 180,
          easing: Easing.in(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(anim, {
          toValue: 0,
          duration: 180,
          easing: Easing.in(Easing.quad),
          useNativeDriver: true,
        }),
      ]).start(({ finished }) => {
        if (finished) {
          setMounted(false);
          onDismissedRef.current?.();
        }
      });
    }
  }, [visible, mounted, anim, backdropAnim]);

  if (!mounted && !visible) {
    return null;
  }

  const scale = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.4, 1],
  });

  const translateY = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [32, 0],
  });

  const opacity = anim.interpolate({
    inputRange: [0, 0.25, 1],
    outputRange: [0, 0.7, 1],
  });

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
      {/* ── Outside click backdrop overlay ── */}
      <Animated.View style={[styles.backdrop, { opacity: backdropAnim }]}>
        <TouchableWithoutFeedback onPress={onClose} accessible={false}>
          <View style={styles.backdropTouchArea} />
        </TouchableWithoutFeedback>
      </Animated.View>

      {/* ── Animated sheet card ── */}
      <Animated.View
        style={[
          styles.cardContainer,
          {
            bottom: bottomOffset,
            left: (SW - SHEET_W) / 2,
            width: SHEET_W,
            opacity,
            transform: [{ translateY }, { scale }],
          },
        ]}
      >
        {/* Subtle arrow notch pointing toward the center plus button */}
        <View style={styles.pointerNotch} />

        <View style={styles.card}>
          {/* Header row with badge */}
          <View style={styles.header}>
            <Badge
              label="QUICK CREATE"
              variant="purple"
              size="md"
              icon={
                <Sparkles
                  size={11}
                  color={Colors.LavenderPurple}
                  strokeWidth={2.4}
                />
              }
            />
          </View>

          {/* Action Cards Container - Horizontal Row */}
          <View style={styles.optionsRow}>
            {/* ── Option 1: Add New Task ── */}
            <TouchableOpacity
              activeOpacity={0.82}
              style={[styles.actionCard, styles.taskCard]}
              onPress={onPressNewTask}
            >
              {/* Top Row: Icon Bubble */}
              <View style={styles.cardTopRow}>
                <View style={[styles.iconWrap, styles.taskIconWrap]}>
                  <CheckSquare
                    size={19}
                    color={Colors.LavenderPurple}
                    strokeWidth={2.4}
                  />
                </View>
              </View>

              {/* Title & Subtitle */}
              <View style={styles.cardContent}>
                <Text style={styles.optionTitle}>Add Task</Text>
                <Text style={styles.optionSubtitle} numberOfLines={2}>
                  To-dos, priorities & deadlines
                </Text>
              </View>

              {/* Action Footer: Badge + Chevron Button */}
              <View style={styles.cardFooter}>
                <Badge label="TO-DO" variant="purple" size="sm" />
                <View style={[styles.arrowCircle, styles.taskArrowCircle]}>
                  <ChevronRight
                    size={13}
                    color={Colors.LavenderPurple}
                    strokeWidth={2.4}
                  />
                </View>
              </View>

              {/* Signature category bottom accent bar */}
              <View style={styles.cardAccentWrap}>
                <View
                  style={[
                    styles.cardAccent,
                    { backgroundColor: Colors.LavenderPurple },
                  ]}
                />
              </View>
            </TouchableOpacity>

            {/* ── Option 2: Add New Reminder ── */}
            <TouchableOpacity
              activeOpacity={0.82}
              style={[styles.actionCard, styles.reminderCard]}
              onPress={onPressNewReminder}
            >
              {/* Top Row: Icon Bubble */}
              <View style={styles.cardTopRow}>
                <View style={[styles.iconWrap, styles.reminderIconWrap]}>
                  <Bell size={19} color="#D97706" strokeWidth={2.4} />
                </View>
              </View>

              {/* Title & Subtitle */}
              <View style={styles.cardContent}>
                <Text style={styles.optionTitle}>Add Reminder</Text>
                <Text style={styles.optionSubtitle} numberOfLines={2}>
                  Timely alerts & schedules
                </Text>
              </View>

              {/* Action Footer: Badge + Chevron Button */}
              <View style={styles.cardFooter}>
                <Badge label="ALERT" variant="yellow" size="sm" />
                <View style={[styles.arrowCircle, styles.reminderArrowCircle]}>
                  <ChevronRight size={13} color="#D97706" strokeWidth={2.4} />
                </View>
              </View>

              {/* Signature category bottom accent bar */}
              <View style={styles.cardAccentWrap}>
                <View
                  style={[styles.cardAccent, { backgroundColor: '#FDD835' }]}
                />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(23, 25, 35, 0.45)',
    zIndex: 50,
  },
  backdropTouchArea: {
    ...StyleSheet.absoluteFill,
  },
  cardContainer: {
    position: 'absolute',
    zIndex: 60,
  },
  pointerNotch: {
    position: 'absolute',
    bottom: -6,
    alignSelf: 'center',
    width: 14,
    height: 14,
    backgroundColor: Colors.DefaultWhite,
    transform: [{ rotate: '45deg' }],
    borderBottomRightRadius: 3,
    borderRightWidth: 1.5,
    borderBottomWidth: 1.5,
    borderColor: '#E8E2D5',
    zIndex: 1,
  },
  card: {
    backgroundColor: Colors.DefaultWhite,
    borderRadius: 26,
    paddingHorizontal: 16,
    paddingTop: 13,
    paddingBottom: 16,
    borderWidth: 1.5,
    borderColor: '#E8E2D5',
    ...Platform.select({
      ios: {
        shadowColor: '#1F2228',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.16,
        shadowRadius: 20,
      },
      android: {
        elevation: 18,
      },
    }),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 4,
  },
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 4,
  },
  actionCard: {
    width: 132,
    height: 154,
    borderRadius: 23,
    borderTopRightRadius: 63,
    borderWidth: 1.8,
    paddingHorizontal: 11,
    paddingTop: 11,
    paddingBottom: 12,
    position: 'relative',
    justifyContent: 'space-between',
    ...Platform.select({
      ios: {
        shadowOffset: { width: 0, height: 7 },
        shadowOpacity: 0.32,
        shadowRadius: 11,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  taskCard: {
    backgroundColor: '#EFF2FE',
    borderColor: '#D8DBFF',
    ...Platform.select({
      ios: {
        shadowColor: Colors.LavenderPurple,
      },
    }),
  },
  reminderCard: {
    backgroundColor: '#FFFCEB',
    borderColor: '#FFF5B8',
    ...Platform.select({
      ios: {
        shadowColor: Colors.AccentYellow,
      },
    }),
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  iconWrap: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: Colors.DefaultWhite,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.16,
        shadowRadius: 5,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  taskIconWrap: {
    borderColor: '#D8DBFF',
    ...Platform.select({
      ios: {
        shadowColor: Colors.LavenderPurple,
      },
    }),
  },
  reminderIconWrap: {
    borderColor: '#FFF5B8',
    ...Platform.select({
      ios: {
        shadowColor: Colors.AccentYellow,
      },
    }),
  },
  cardContent: {
    marginBottom: 4,
  },
  optionTitle: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: 14,
    color: Colors.MidnightCharcoal,
    lineHeight: 18,
  },
  optionSubtitle: {
    fontFamily: Fonts.poppins.regular,
    fontSize: 10,
    color: Colors.MutedSteelText,
    lineHeight: 13.5,
    marginTop: 2,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 2,
  },
  arrowCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.DefaultWhite,
    borderWidth: 1.2,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowOffset: { width: 0, height: 1.5 },
        shadowOpacity: 0.1,
        shadowRadius: 2.5,
      },
      android: {
        elevation: 1.5,
      },
    }),
  },
  taskArrowCircle: {
    borderColor: '#D8DBFF',
    ...Platform.select({
      ios: {
        shadowColor: Colors.LavenderPurple,
      },
    }),
  },
  reminderArrowCircle: {
    borderColor: '#FFF5B8',
    ...Platform.select({
      ios: {
        shadowColor: '#D97706',
      },
    }),
  },
  cardAccentWrap: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  cardAccent: {
    height: 4,
    width: 48,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },
});

export default PlusActionSheet;
