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

const { width: SW } = Dimensions.get('window');
const SHEET_W = Math.min(SW - 40, 332);

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
          onDismissed?.();
        }
      });
    }
  }, [visible]);

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
            <View style={styles.badge}>
              <Sparkles size={11} color={Colors.LavenderPurple} />
              <Text style={styles.badgeText}>QUICK CREATE</Text>
            </View>
          </View>

          {/* Option 1: Add New Task */}
          <TouchableOpacity
            activeOpacity={0.72}
            style={styles.optionRow}
            onPress={onPressNewTask}
          >
            <View
              style={[
                styles.iconWrap,
                { backgroundColor: 'rgba(131, 131, 214, 0.14)' },
              ]}
            >
              <CheckSquare
                size={22}
                color={Colors.LavenderPurple}
                strokeWidth={2.4}
              />
            </View>
            <View style={styles.textWrap}>
              <Text style={styles.optionTitle}>Add New Task</Text>
              <Text style={styles.optionSubtitle}>
                Organize to-dos, priorities & deadlines
              </Text>
            </View>
            <View style={styles.chevronWrap}>
              <ChevronRight
                size={17}
                color={Colors.SteelMist}
                strokeWidth={2.4}
              />
            </View>
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.divider} />

          {/* Option 2: Add New Reminder */}
          <TouchableOpacity
            activeOpacity={0.72}
            style={styles.optionRow}
            onPress={onPressNewReminder}
          >
            <View
              style={[
                styles.iconWrap,
                { backgroundColor: 'rgba(130, 110, 234, 0.14)' },
              ]}
            >
              <Bell
                size={22}
                color={Colors.SecondaryPurple}
                strokeWidth={2.4}
              />
            </View>
            <View style={styles.textWrap}>
              <Text style={styles.optionTitle}>Add New Reminder</Text>
              <Text style={styles.optionSubtitle}>
                Set timely alerts so you never forget
              </Text>
            </View>
            <View style={styles.chevronWrap}>
              <ChevronRight
                size={17}
                color={Colors.SteelMist}
                strokeWidth={2.4}
              />
            </View>
          </TouchableOpacity>
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
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 14,
    borderWidth: 1.5,
    borderColor: '#E8E2D5',
    ...Platform.select({
      ios: {
        shadowColor: '#1F2228',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.18,
        shadowRadius: 22,
      },
      android: {
        elevation: 20,
      },
    }),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 2,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(131, 131, 214, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  badgeText: {
    fontFamily: Fonts.poppins.bold,
    fontSize: 9.5,
    letterSpacing: 0.7,
    color: Colors.LavenderPurple,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 4,
    borderRadius: 14,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textWrap: {
    flex: 1,
    marginLeft: 12,
  },
  optionTitle: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: 14.5,
    color: Colors.MidnightCharcoal,
    lineHeight: 20,
  },
  optionSubtitle: {
    fontFamily: Fonts.poppins.regular,
    fontSize: 11,
    color: Colors.MutedSteelText,
    lineHeight: 15,
    marginTop: 1,
  },
  chevronWrap: {
    paddingLeft: 6,
  },
  divider: {
    height: 1,
    backgroundColor: '#F2EFE9',
    marginVertical: 6,
    marginHorizontal: 4,
  },
});

export default PlusActionSheet;
