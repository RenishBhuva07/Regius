import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { Lock, Crown, Sparkles } from 'lucide-react-native';
import { Fonts } from '../../../Theme/fonts';

export type MilestoneBadgeState = 'unlocked' | 'current' | 'next_goal' | 'locked';

interface ThreeDStatusBadgeProps {
  state: MilestoneBadgeState;
  requiredXp?: number;
}

/**
 * 3D Embossed Checkmark ("Right Sign") SVG with dual-tone extrusion and bevel highlight
 */
const ThreeDRightSignSvg: React.FC<{ size?: number }> = ({ size = 16 }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* 3D Depth Shadow under checkmark */}
      <Path
        d="M20 7.5L9.5 18L4 12.5"
        stroke="#064E3B"
        strokeWidth="3.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Mid extruded bevel */}
      <Path
        d="M20 6.8L9.5 17.3L4 11.8"
        stroke="#059669"
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Top Gloss Highlight */}
      <Path
        d="M20 6L9.5 16.5L4 11"
        stroke="#FFFFFF"
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
              <Crown size={13} color="#FFFFFF" strokeWidth={2.6} />
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
            <Sparkles size={12} color="#D97706" strokeWidth={2.4} />
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
          <Lock size={12} color="#94A3B8" strokeWidth={2.4} />
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
        shadowColor: '#059669',
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
    backgroundColor: '#10B981',
    borderRadius: 14,
    borderWidth: 1.5,
    borderTopColor: 'rgba(255, 255, 255, 0.75)',
    borderLeftColor: 'rgba(255, 255, 255, 0.4)',
    borderRightColor: 'rgba(255, 255, 255, 0.25)',
    borderBottomWidth: 3.5,
    borderBottomColor: '#047857',
    paddingHorizontal: 9,
    paddingVertical: 4,
    position: 'relative',
    overflow: 'hidden',
  },
  unlockedText: {
    fontFamily: Fonts.poppins.bold,
    fontSize: 10,
    letterSpacing: 0.8,
    color: '#FFFFFF',
    textShadowColor: 'rgba(4, 120, 87, 0.75)',
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
        shadowColor: '#D97706',
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
    backgroundColor: '#F59E0B',
    borderRadius: 14,
    borderWidth: 1.5,
    borderTopColor: 'rgba(255, 255, 255, 0.8)',
    borderLeftColor: 'rgba(255, 255, 255, 0.4)',
    borderRightColor: 'rgba(255, 255, 255, 0.25)',
    borderBottomWidth: 3.5,
    borderBottomColor: '#B45309',
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
    color: '#FFFFFF',
    textShadowColor: 'rgba(180, 83, 9, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },

  // --- 3D NEXT GOAL BADGE ---
  nextGoalShadowWrap: {
    borderRadius: 14,
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
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
    backgroundColor: '#FEF3C7',
    borderRadius: 12,
    borderWidth: 1.2,
    borderTopColor: '#FFFFFF',
    borderLeftColor: '#FDE68A',
    borderRightColor: '#FDE68A',
    borderBottomWidth: 2.8,
    borderBottomColor: '#D97706',
    paddingHorizontal: 8,
    paddingVertical: 3,
    position: 'relative',
    overflow: 'hidden',
  },
  nextGoalText: {
    fontFamily: Fonts.poppins.bold,
    fontSize: 9.5,
    letterSpacing: 0.7,
    color: '#92400E',
  },

  // --- 3D LOCKED BADGE ---
  lockedShadowWrap: {
    borderRadius: 14,
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
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
    backgroundColor: '#334155',
    borderRadius: 12,
    borderWidth: 1.2,
    borderTopColor: 'rgba(255, 255, 255, 0.25)',
    borderLeftColor: 'rgba(255, 255, 255, 0.1)',
    borderRightColor: 'rgba(255, 255, 255, 0.08)',
    borderBottomWidth: 2.8,
    borderBottomColor: '#1E293B',
    paddingHorizontal: 8,
    paddingVertical: 3,
    position: 'relative',
    overflow: 'hidden',
  },
  lockedText: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: 9.5,
    letterSpacing: 0.7,
    color: '#CBD5E1',
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
    backgroundColor: 'rgba(255, 255, 255, 0.35)',
  },
  glossHighlightDim: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  glossHighlightDark: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
  },
});
