import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import Svg, { Line, Path, Rect } from 'react-native-svg';
import { Crown, Lock, Check } from 'lucide-react-native';
import { Fonts } from '../../../Theme/fonts';
import { MilestoneTier } from '../../../Services/Milestone/MilestoneService';

interface GameRoadCheckpointProps {
  tier: MilestoneTier;
  isUnlocked: boolean;
  isCurrent: boolean;
  isNext: boolean;
  isFirst: boolean;
  isLast: boolean;
  isDarkMode: boolean;
}

export const GameRoadCheckpoint: React.FC<GameRoadCheckpointProps> = ({
  tier,
  isUnlocked,
  isCurrent,
  isFirst,
  isLast,
  isDarkMode,
}) => {
  // Road colors
  const roadBg = isDarkMode ? '#1A1E24' : '#2C323D';
  const curbBorder = isDarkMode ? 'rgba(255, 255, 255, 0.15)' : '#D0C9BA';
  const curbEdge = isDarkMode ? '#101216' : '#20242B';
  const dashColor = isUnlocked ? '#F5C518' : 'rgba(255, 255, 255, 0.2)';

  // Disc colors
  const discBg = isCurrent
    ? '#F59E0B'
    : isUnlocked
    ? tier.accentColor || '#10B981'
    : isDarkMode
    ? '#242933'
    : '#3A4250';

  const discBorderBottom = isCurrent
    ? '#B45309'
    : isUnlocked
    ? '#065F46'
    : isDarkMode
    ? '#14171D'
    : '#20252E';

  const shadowColor = isCurrent
    ? '#F59E0B'
    : isUnlocked
    ? tier.accentColor || '#10B981'
    : '#000000';

  return (
    <View style={styles.container}>
      {/* ── TOP ROAD CONNECTOR TRACK ── */}
      {!isFirst && (
        <View style={styles.topTrackWrap}>
          {/* Asphalt Road Bed */}
          <View
            style={[
              styles.roadTrack,
              {
                backgroundColor: roadBg,
                borderColor: curbBorder,
                borderLeftColor: curbEdge,
                borderRightColor: curbEdge,
              },
            ]}
          >
            {/* Painted Center Dashes */}
            <Svg height="100%" width="6" style={styles.roadCenterLine}>
              <Line
                x1="3"
                y1="0"
                x2="3"
                y2="100%"
                stroke={dashColor}
                strokeWidth="2.5"
                strokeDasharray="6 5"
              />
            </Svg>
          </View>
        </View>
      )}

      {/* ── 3D GAME LEVEL DISC / CHECKPOINT TOKEN ── */}
      <View style={styles.nodeWrapper}>
        {/* Road Ramp extending towards card on the right */}
        <View
          style={[
            styles.connectorRamp,
            {
              backgroundColor: roadBg,
              borderColor: curbBorder,
            },
          ]}
        >
          <View
            style={[
              styles.connectorRampCenterDash,
              { backgroundColor: dashColor },
            ]}
          />
        </View>

        {/* 3D Cylindrical Level Disc */}
        <View
          style={[
            styles.discShadowWrap,
            {
              shadowColor: shadowColor,
              shadowOpacity: isCurrent ? 0.45 : isUnlocked ? 0.3 : 0.2,
            },
          ]}
        >
          {/* Current Glowing Aura Ring */}
          {isCurrent && <View style={styles.currentAuraRing} />}

          <View
            style={[
              styles.discBody,
              {
                backgroundColor: discBg,
                borderBottomColor: discBorderBottom,
              },
            ]}
          >
            {/* Specular Inner Gloss Highlight */}
            <View style={styles.discGlossHighlight} />

            {/* Token Content */}
            {isUnlocked ? (
              <View style={styles.unlockedCenter}>
                <Text style={styles.discLevelText}>{tier.level}</Text>
                {/* 3D Mini Right Sign Seal at bottom-right */}
                <View style={styles.miniRightSignSeal}>
                  <Check size={9} color="#FFFFFF" strokeWidth={3.2} />
                </View>
              </View>
            ) : isCurrent ? (
              <View style={styles.currentCenter}>
                <Crown size={18} color="#FFFFFF" strokeWidth={2.4} />
                <Text style={styles.currentLevelSubText}>LVL {tier.level}</Text>
              </View>
            ) : (
              <View style={styles.lockedCenter}>
                <Lock size={15} color="#94A3B8" strokeWidth={2.4} />
                <Text style={styles.lockedLevelText}>{tier.level}</Text>
              </View>
            )}
          </View>
        </View>
      </View>

      {/* ── BOTTOM ROAD CONNECTOR TRACK ── */}
      {!isLast && (
        <View style={styles.bottomTrackWrap}>
          <View
            style={[
              styles.roadTrack,
              {
                backgroundColor: roadBg,
                borderColor: curbBorder,
                borderLeftColor: curbEdge,
                borderRightColor: curbEdge,
              },
            ]}
          >
            <Svg height="100%" width="6" style={styles.roadCenterLine}>
              <Line
                x1="3"
                y1="0"
                x2="3"
                y2="100%"
                stroke={isUnlocked ? '#F5C518' : 'rgba(255, 255, 255, 0.2)'}
                strokeWidth="2.5"
                strokeDasharray="6 5"
              />
            </Svg>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 56,
    alignItems: 'center',
    position: 'relative',
    alignSelf: 'stretch',
  },
  topTrackWrap: {
    position: 'absolute',
    top: 0,
    bottom: '50%',
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 1,
  },
  bottomTrackWrap: {
    position: 'absolute',
    top: '50%',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 1,
  },
  roadTrack: {
    width: 22,
    height: '100%',
    borderLeftWidth: 2,
    borderRightWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  roadCenterLine: {
    position: 'absolute',
  },
  nodeWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    zIndex: 3,
    marginTop: 20,
    marginBottom: 20,
  },
  connectorRamp: {
    position: 'absolute',
    left: 26,
    width: 32,
    height: 12,
    borderTopWidth: 1.5,
    borderBottomWidth: 1.5,
    justifyContent: 'center',
    zIndex: 1,
  },
  connectorRampCenterDash: {
    height: 2,
    width: '100%',
    opacity: 0.8,
  },
  discShadowWrap: {
    borderRadius: 26,
    ...Platform.select({
      ios: {
        shadowOffset: { width: 0, height: 6 },
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  currentAuraRing: {
    position: 'absolute',
    top: -6,
    left: -6,
    right: -6,
    bottom: -6,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: 'rgba(245, 158, 11, 0.65)',
    backgroundColor: 'rgba(245, 158, 11, 0.12)',
  },
  discBody: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderTopColor: 'rgba(255, 255, 255, 0.8)',
    borderLeftColor: 'rgba(255, 255, 255, 0.4)',
    borderRightColor: 'rgba(255, 255, 255, 0.2)',
    borderBottomWidth: 5,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  discGlossHighlight: {
    position: 'absolute',
    top: 0,
    left: 4,
    right: 4,
    height: 10,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.35)',
  },
  unlockedCenter: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    width: '100%',
    height: '100%',
  },
  discLevelText: {
    fontFamily: Fonts.ranade.bold,
    fontSize: 18,
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 0, height: 1.5 },
    textShadowRadius: 2,
  },
  miniRightSignSeal: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#047857',
    borderWidth: 1,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  currentCenter: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  currentLevelSubText: {
    fontFamily: Fonts.poppins.bold,
    fontSize: 8,
    color: '#FFFFFF',
    marginTop: 1,
    letterSpacing: 0.5,
  },
  lockedCenter: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  lockedLevelText: {
    fontFamily: Fonts.poppins.bold,
    fontSize: 9,
    color: '#94A3B8',
    marginTop: 1,
  },
});
