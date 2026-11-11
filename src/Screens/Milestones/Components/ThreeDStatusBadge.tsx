import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { Lock, Crown, Sparkles } from 'lucide-react-native';
import { Colors, withAlpha } from '../../../Assets/StyleUtilities/Colors';
import { Fonts } from '../../../Theme/fonts';

export type MilestoneBadgeState = 'unlocked' | 'current' | 'next_goal' | 'locked';

interface ThreeDStatusBadgeProps {
  state: MilestoneBadgeState;
  requiredXp?: number;
}

// Embossed checkmark icon for completed status.
const ThreeDRightSignSvg: React.FC<{ size?: number }> = ({ size = 16 }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M20 7.5L9.5 18L4 12.5"
        stroke={Colors.Emerald900}
        strokeWidth="3.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M20 6.8L9.5 17.3L4 11.8"
        stroke={Colors.ToastSuccessIcon}
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M20 6L9.5 16.5L4 11"
        stroke={Colors.PureWhite}
        strokeWidth="2.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export const ThreeDStatusBadge: React.FC<ThreeDStatusBadgeProps> = ({
  state,
  requiredXp,
}) => {
  if (state === 'unlocked') {
    return (
      <View style={styles.unlockedShadowWrap}>
        <View style={styles.unlockedBadge}>
          {/* Top gloss specular highlight bar */}
          <View style={styles.glossHighlight} />
          <View style={styles.contentRow}>
            <View style={styles.icon3dWrap}>
              <ThreeDRightSignSvg size={15} />
            </View>
            <Text style={styles.unlockedText}>UNLOCKED</Text>
          </View>
        </View>
      </View>
    );
  }

  if (state === 'current') {
    return (
      <View style={styles.currentShadowWrap}>
        <View style={styles.currentBadge}>
          <View style={styles.glossHighlight} />
          <View style={styles.contentRow}>
            <View style={styles.currentIconWrap}>
              <Crown size={13} color={Colors.PureWhite} strokeWidth={2.6} />
            </View>
            <Text style={styles.currentText}>CURRENT</Text>
          </View>
        </View>
      </View>
    );
  }

  if (state === 'next_goal') {
    return (
      <View style={styles.nextGoalShadowWrap}>
        <View style={styles.nextGoalBadge}>
          <View style={styles.glossHighlightDim} />
          <View style={styles.contentRow}>
            <Sparkles
              size={12}
              color={Colors.HabitBurnishedAmber}
              strokeWidth={2.4}
            />
            <Text style={styles.nextGoalText}>NEXT GOAL</Text>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.lockedShadowWrap}>
      <View style={styles.lockedBadge}>
        <View style={styles.glossHighlightDark} />
        <View style={styles.contentRow}>
          <Lock size={12} color={Colors.Slate400} strokeWidth={2.4} />
          <Text style={styles.lockedText}>
            {requiredXp ? `LOCKED` : 'LOCKED'}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  // --- 3D UNLOCKED RIGHT SIGN BADGE ---
  unlockedShadowWrap: {
    borderRadius: 16,
    ...Platform.select({
      ios: {
        shadowColor: Colors.ToastSuccessIcon,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.38,
        shadowRadius: 6,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  unlockedBadge: {
    backgroundColor: Colors.ToastSuccessAccent,
    borderRadius: 14,
    borderWidth: 1.5,
    borderTopColor: withAlpha(Colors.PureWhite, 0.75),
    borderLeftColor: withAlpha(Colors.PureWhite, 0.4),
    borderRightColor: withAlpha(Colors.PureWhite, 0.25),
    borderBottomWidth: 3.5,
    borderBottomColor: Colors.Emerald700,
    paddingHorizontal: 9,
    paddingVertical: 4,
    position: 'relative',
    overflow: 'hidden',
  },
  unlockedText: {
    fontFamily: Fonts.poppins.bold,
    fontSize: 10,
    letterSpacing: 0.8,
    color: Colors.PureWhite,
    textShadowColor: withAlpha(Colors.Emerald700, 0.75),
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  icon3dWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 1,
  },

  // --- 3D CURRENT LEVEL BADGE ---
  currentShadowWrap: {
    borderRadius: 16,
    ...Platform.select({
      ios: {
        shadowColor: Colors.HabitBurnishedAmber,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.35,
        shadowRadius: 6,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  currentBadge: {
    backgroundColor: Colors.VoiceMichaelAccent,
    borderRadius: 14,
    borderWidth: 1.5,
    borderTopColor: withAlpha(Colors.PureWhite, 0.8),
    borderLeftColor: withAlpha(Colors.PureWhite, 0.4),
    borderRightColor: withAlpha(Colors.PureWhite, 0.25),
    borderBottomWidth: 3.5,
    borderBottomColor: Colors.Amber700,
    paddingHorizontal: 9,
    paddingVertical: 4,
    position: 'relative',
    overflow: 'hidden',
  },
  currentIconWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  currentText: {
    fontFamily: Fonts.poppins.bold,
    fontSize: 10,
    letterSpacing: 0.8,
    color: Colors.PureWhite,
    textShadowColor: withAlpha(Colors.Amber700, 0.75),
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },

  // --- 3D NEXT GOAL BADGE ---
  nextGoalShadowWrap: {
    borderRadius: 14,
    ...Platform.select({
      ios: {
        shadowColor: Colors.PureBlack,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  nextGoalBadge: {
    backgroundColor: Colors.ToastWarningBadgeBgLight,
    borderRadius: 12,
    borderWidth: 1.2,
    borderTopColor: Colors.PureWhite,
    borderLeftColor: Colors.VoiceMichaelBorder,
    borderRightColor: Colors.VoiceMichaelBorder,
    borderBottomWidth: 2.8,
    borderBottomColor: Colors.HabitBurnishedAmber,
    paddingHorizontal: 8,
    paddingVertical: 3,
    position: 'relative',
    overflow: 'hidden',
  },
  nextGoalText: {
    fontFamily: Fonts.poppins.bold,
    fontSize: 9.5,
    letterSpacing: 0.7,
    color: Colors.Amber800,
  },

  // --- 3D LOCKED BADGE ---
  lockedShadowWrap: {
    borderRadius: 14,
    ...Platform.select({
      ios: {
        shadowColor: Colors.PureBlack,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.12,
        shadowRadius: 3,
      },
      android: {
        elevation: 1.5,
      },
    }),
  },
  lockedBadge: {
    backgroundColor: Colors.Slate700,
    borderRadius: 12,
    borderWidth: 1.2,
    borderTopColor: withAlpha(Colors.PureWhite, 0.25),
    borderLeftColor: withAlpha(Colors.PureWhite, 0.1),
    borderRightColor: withAlpha(Colors.PureWhite, 0.08),
    borderBottomWidth: 2.8,
    borderBottomColor: Colors.Slate800,
    paddingHorizontal: 8,
    paddingVertical: 3,
    position: 'relative',
    overflow: 'hidden',
  },
  lockedText: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: 9.5,
    letterSpacing: 0.7,
    color: Colors.Slate300,
  },

  // Common inner layout
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4.5,
  },
  glossHighlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: withAlpha(Colors.PureWhite, 0.35),
  },
  glossHighlightDim: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: withAlpha(Colors.PureWhite, 0.5),
  },
  glossHighlightDark: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: withAlpha(Colors.PureWhite, 0.12),
  },
});
