import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import Svg, { Line } from 'react-native-svg';
import { Crown, Lock, Check } from 'lucide-react-native';
import { Colors, withAlpha } from '../../../Assets/StyleUtilities/Colors';
import { Fonts } from '../../../Theme/fonts';
import { MilestoneTier } from '../../../Services/Milestone/MilestoneService';
import ResponsivePixels from '../../../Assets/StyleUtilities/ResponsivePixels';

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
  const roadBg = isDarkMode
    ? Colors.RoadAsphaltDarkBg
    : Colors.RoadAsphaltAltLight;
  const curbBorder = isDarkMode
    ? withAlpha(Colors.PureWhite, 0.15)
    : Colors.RoadCurbLightBorder;
  const curbEdge = isDarkMode
    ? Colors.RoadCurbEdgeDark
    : Colors.DarkInputBevelCharcoal;
  const dashColor = isUnlocked
    ? Colors.AccentYellow
    : withAlpha(Colors.PureWhite, 0.2);

  // Disc colors
  const discBg = isCurrent
    ? Colors.VoiceMichaelAccent
    : isUnlocked
    ? tier.accentColor || Colors.ToastSuccessAccent
    : isDarkMode
    ? Colors.RoadNodeLockedDarkBg
    : Colors.RoadNodeLockedLightBg;

  const discBorderBottom = isCurrent
    ? Colors.Amber700
    : isUnlocked
    ? Colors.Emerald800
    : isDarkMode
    ? Colors.RoadDiscLockedDarkBevel
    : Colors.RoadDiscLockedLightBevel;

  const shadowColor = isCurrent
    ? Colors.VoiceMichaelAccent
    : isUnlocked
    ? tier.accentColor || Colors.ToastSuccessAccent
    : Colors.PureBlack;

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
                  <Check size={ResponsivePixels.size9} color={Colors.PureWhite} strokeWidth={3.2} />
                </View>
              </View>
            ) : isCurrent ? (
              <View style={styles.currentCenter}>
                <Crown size={ResponsivePixels.size18} color={Colors.PureWhite} strokeWidth={2.4} />
                <Text style={styles.currentLevelSubText}>LVL {tier.level}</Text>
              </View>
            ) : (
              <View style={styles.lockedCenter}>
                <Lock size={ResponsivePixels.size15} color={Colors.Slate400} strokeWidth={2.4} />
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
                stroke={
                  isUnlocked
                    ? Colors.AccentYellow
                    : withAlpha(Colors.PureWhite, 0.2)
                }
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
    width: ResponsivePixels.size56,
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
    width: ResponsivePixels.size22,
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
    marginTop: ResponsivePixels.size20,
    marginBottom: ResponsivePixels.size20,
  },
  connectorRamp: {
    position: 'absolute',
    left: ResponsivePixels.size26,
    width: ResponsivePixels.size32,
    height: ResponsivePixels.size12,
    borderTopWidth: 1.5,
    borderBottomWidth: 1.5,
    justifyContent: 'center',
    zIndex: 1,
  },
  connectorRampCenterDash: {
    height: ResponsivePixels.size2,
    width: '100%',
    opacity: 0.8,
  },
  discShadowWrap: {
    borderRadius: ResponsivePixels.size26,
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
    top: -ResponsivePixels.size6,
    left: -ResponsivePixels.size6,
    right: -ResponsivePixels.size6,
    bottom: -ResponsivePixels.size6,
    borderRadius: ResponsivePixels.size32,
    borderWidth: 2,
    borderColor: withAlpha(Colors.VoiceMichaelAccent, 0.65),
    backgroundColor: withAlpha(Colors.VoiceMichaelAccent, 0.12),
  },
  discBody: {
    width: ResponsivePixels.size48,
    height: ResponsivePixels.size48,
    borderRadius: ResponsivePixels.size24,
    borderWidth: 2,
    borderTopColor: withAlpha(Colors.PureWhite, 0.8),
    borderLeftColor: withAlpha(Colors.PureWhite, 0.4),
    borderRightColor: withAlpha(Colors.PureWhite, 0.2),
    borderBottomWidth: 5,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  discGlossHighlight: {
    position: 'absolute',
    top: 0,
    left: ResponsivePixels.size4,
    right: ResponsivePixels.size4,
    height: ResponsivePixels.size10,
    borderRadius: ResponsivePixels.size10,
    backgroundColor: withAlpha(Colors.PureWhite, 0.35),
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
    fontSize: ResponsivePixels.size18,
    color: Colors.PureWhite,
    textShadowColor: withAlpha(Colors.PureBlack, 0.4),
    textShadowOffset: { width: 0, height: ResponsivePixels.size1_5 },
    textShadowRadius: 2,
  },
  miniRightSignSeal: {
    position: 'absolute',
    bottom: ResponsivePixels.size2,
    right: ResponsivePixels.size2,
    width: ResponsivePixels.size14,
    height: ResponsivePixels.size14,
    borderRadius: ResponsivePixels.size7,
    backgroundColor: Colors.Emerald700,
    borderWidth: 1,
    borderColor: Colors.PureWhite,
    alignItems: 'center',
    justifyContent: 'center',
  },
  currentCenter: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  currentLevelSubText: {
    fontFamily: Fonts.poppins.bold,
    fontSize: ResponsivePixels.size8,
    color: Colors.PureWhite,
    marginTop: ResponsivePixels.size1,
    letterSpacing: 0.5,
  },
  lockedCenter: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  lockedLevelText: {
    fontFamily: Fonts.poppins.bold,
    fontSize: ResponsivePixels.size9,
    color: Colors.Slate400,
    marginTop: ResponsivePixels.size1,
  },
});
