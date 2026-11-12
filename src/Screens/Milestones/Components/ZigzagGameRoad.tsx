import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Platform,
  Vibration,
} from 'react-native';
import Svg, {
  Path,
  Circle,
  Defs,
  LinearGradient,
  Stop,
} from 'react-native-svg';
import { Crown, Lock, Check, Flag, Compass } from 'lucide-react-native';

import { Colors, withAlpha } from '../../../Assets/StyleUtilities/Colors';
import { Fonts } from '../../../Theme/fonts';
import { MilestoneTier } from '../../../Services/Milestone/MilestoneService';
import { ThreeDStatusBadge } from './ThreeDStatusBadge';
import ResponsivePixels from '../../../Assets/StyleUtilities/ResponsivePixels';

const { width: screenWidth } = Dimensions.get('window');

interface ZigzagGameRoadProps {
  tiers: MilestoneTier[];
  currentTier: MilestoneTier;
  nextTier: MilestoneTier | null;
  totalXp: number;
  onSelectTier: (tier: MilestoneTier) => void;
  isDarkMode: boolean;
}

export const ZigzagGameRoad: React.FC<ZigzagGameRoadProps> = ({
  tiers,
  currentTier,
  nextTier,
  totalXp: _totalXp,
  onSelectTier,
  isDarkMode,
}) => {
  // Road track geometry: 10px margin on each side, snug 780px height to eliminate dead bottom space
  const trackWidth = screenWidth - ResponsivePixels.size20;
  const trackHeight = ResponsivePixels.scale(780);

  // Node center coordinates: original 10:47 zigzag S-curve pattern
  const nodeCoords = [
    { x: trackWidth * 0.28, y: ResponsivePixels.size70 }, // Level 1 (Left)
    { x: trackWidth * 0.72, y: ResponsivePixels.scale(215) }, // Level 2 (Right)
    { x: trackWidth * 0.28, y: ResponsivePixels.scale(360) }, // Level 3 (Left)
    { x: trackWidth * 0.72, y: ResponsivePixels.scale(505) }, // Level 4 (Right)
    { x: trackWidth * 0.5, y: ResponsivePixels.scale(660) }, // Level 5 (Center Summit)
  ];

  // Original 10:47 smooth cubic Bezier S-curve connecting node coordinates
  const buildSegmentPath = (i: number) => {
    const p1 = nodeCoords[i];
    const p2 = nodeCoords[i + 1];
    const dy = p2.y - p1.y;
    return `M ${p1.x} ${p1.y} C ${p1.x} ${p1.y + dy * 0.55}, ${p2.x} ${
      p2.y - dy * 0.55
    }, ${p2.x} ${p2.y}`;
  };

  // Road styling colors
  const curbColor = isDarkMode
    ? withAlpha(Colors.PureWhite, 0.22)
    : Colors.WarmHeaderBottomBevel;
  const asphaltColor = isDarkMode
    ? Colors.RoadLabelDarkBg
    : Colors.RoadAsphaltLight;
  const textPrimary = isDarkMode ? Colors.PureWhite : Colors.DarkBackground;
  const textSecondary = isDarkMode ? Colors.MilestoneSlate : Colors.Gray500;

  return (
    <View
      style={[styles.container, { width: trackWidth, height: trackHeight }]}
    >
      {/* ── SVG SERPENTINE ROAD ── */}
      <Svg
        width={trackWidth}
        height={trackHeight}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      >
        <Defs>
          <LinearGradient id="goldHighway" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor={Colors.AccentYellow} />
            <Stop offset="100%" stopColor={Colors.HabitBurnishedAmber} />
          </LinearGradient>
        </Defs>

        {/* Draw each road segment with outer curb and asphalt */}
        {[0, 1, 2, 3].map(i => {
          const pathD = buildSegmentPath(i);
          const segmentUnlocked = currentTier.level > i + 1;

          return (
            <React.Fragment key={`seg-${i}`}>
              {/* Outer curb line */}
              <Path
                d={pathD}
                stroke={curbColor}
                strokeWidth={ResponsivePixels.size48}
                strokeLinecap="round"
                fill="none"
              />

              {/* Road Asphalt Bed */}
              <Path
                d={pathD}
                stroke={asphaltColor}
                strokeWidth={ResponsivePixels.size40}
                strokeLinecap="round"
                fill="none"
              />

              {/* Painted Center Highway Dashes */}
              <Path
                d={pathD}
                stroke={
                  segmentUnlocked
                    ? Colors.AccentYellow
                    : withAlpha(Colors.PureWhite, 0.24)
                }
                strokeWidth={segmentUnlocked ? 3.2 : 2.5}
                strokeDasharray="8 6"
                strokeLinecap="round"
                fill="none"
              />
            </React.Fragment>
          );
        })}

        {/* Summit Halo Ring at Level 5 */}
        <Circle
          cx={nodeCoords[4].x}
          cy={nodeCoords[4].y}
          r={ResponsivePixels.size44}
          stroke={withAlpha(Colors.AccentYellow, 0.35)}
          strokeWidth={3}
          strokeDasharray="4 4"
          fill="none"
        />
      </Svg>

      {/* ── CLEAN GATEWAY MILESTONE BANNERS (NO OVERLAPS ON NODES) ── */}
      <View
        style={[styles.startGateBanner, { top: ResponsivePixels.size16, left: trackWidth * 0.08 }]}
      >
        <Compass
          size={ResponsivePixels.size11}
          color={Colors.HabitBurnishedAmber}
          strokeWidth={2.4}
        />
        <Text style={[styles.gateBannerText, { color: textSecondary }]}>
          START · NOVICE GATE
        </Text>
      </View>

      <View
        style={[styles.summitGateBanner, { top: ResponsivePixels.size595, alignSelf: 'center' }]}
      >
        <Flag size={ResponsivePixels.size12} color={Colors.AccentYellow} strokeWidth={2.5} />
        <Text style={[styles.gateBannerText, { color: Colors.AccentYellow }]}>
          ROYAL SUMMIT · 1000 XP
        </Text>
      </View>

      {/* ── 3D GAME LEVEL NODES & ALTERNATING LABELS ── */}
      {tiers.map((tier, index) => {
        const isCurrent = tier.level === currentTier.level;
        const isUnlocked = currentTier.level >= tier.level;
        const isNext = nextTier?.level === tier.level;
        const coord = nodeCoords[index];

        const badgeState = isUnlocked
          ? 'unlocked'
          : isCurrent
          ? 'current'
          : isNext
          ? 'next_goal'
          : 'locked';

        const discBg = isCurrent
          ? Colors.VoiceMichaelAccent
          : isUnlocked
          ? tier.accentColor || Colors.ToastSuccessAccent
          : isDarkMode
          ? Colors.RoadNodeLockedZigzagDarkBg
          : Colors.RoadNodeLockedZigzagLightBg;

        const discBorderBottom = isCurrent
          ? Colors.Amber700
          : isUnlocked
          ? Colors.Emerald700
          : isDarkMode
          ? Colors.RoadDiscLockedZigzagDarkBevel
          : Colors.RoadDiscLockedZigzagLightBevel;

        const discShadowColor = isCurrent
          ? Colors.VoiceMichaelAccent
          : isUnlocked
          ? tier.accentColor || Colors.ToastSuccessAccent
          : Colors.PureBlack;

        // Placement of title pill (alternating left or right matching 10:47 pattern)
        const isLeftAligned = coord.x < trackWidth * 0.45;
        const isCenterAligned =
          coord.x > trackWidth * 0.4 && coord.x < trackWidth * 0.6;

        return (
          <View
            key={tier.level}
            style={[
              styles.nodeWrapper,
              {
                left: coord.x - ResponsivePixels.size29, // 58px / 2
                top: coord.y - ResponsivePixels.size29,
              },
            ]}
          >
            {/* 3D Cylindrical Level Button */}
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => {
                Vibration.vibrate(25);
                onSelectTier(tier);
              }}
              style={[
                styles.discShadowWrap,
                {
                  shadowColor: discShadowColor,
                  shadowOpacity: isCurrent ? 0.48 : isUnlocked ? 0.35 : 0.2,
                },
              ]}
              accessibilityRole="button"
              accessibilityLabel={`Level ${tier.level} ${tier.title}, tap to view details`}
            >
              {/* Pulsing Aura for Current Active Node */}
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
                {/* Specular Gloss Top Bar */}
                <View style={styles.discGlossHighlight} />

                {isCurrent ? (
                  <View style={styles.discCenterCol}>
                    <Crown
                      size={ResponsivePixels.size20}
                      color={Colors.PureWhite}
                      strokeWidth={2.4}
                    />
                    <Text style={styles.discCurrentLevelText}>
                      LVL {tier.level}
                    </Text>
                  </View>
                ) : isUnlocked ? (
                  <View style={styles.discCenterCol}>
                    <Text style={styles.discLevelNumber}>{tier.level}</Text>
                    {/* Floating 3D Checkmark Seal */}
                    <View style={styles.floatingRightSignSeal}>
                      <Check
                        size={ResponsivePixels.size9}
                        color={Colors.PureWhite}
                        strokeWidth={3.5}
                      />
                    </View>
                  </View>
                ) : (
                  <View style={styles.discCenterCol}>
                    <Lock size={ResponsivePixels.size17} color={Colors.Slate400} strokeWidth={2.4} />
                    <Text style={styles.discLockedText}>LVL {tier.level}</Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>

            {/* 3D Floating Stage Label Pill (Alternating, No Truncation, No Overlap) */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                Vibration.vibrate(20);
                onSelectTier(tier);
              }}
              style={[
                styles.stageLabelCard,
                {
                  backgroundColor: isDarkMode
                    ? Colors.RoadLabelDarkBg
                    : Colors.PureWhite,
                  borderColor: isCurrent
                    ? Colors.AccentYellow
                    : isDarkMode
                    ? withAlpha(Colors.PureWhite, 0.14)
                    : Colors.RoadLabelLightBorder,
                  borderBottomColor: isCurrent
                    ? Colors.HabitBurnishedAmber
                    : isDarkMode
                    ? Colors.RoadLabelDarkBevel
                    : Colors.RoadLabelLightBevel,
                },
                isCenterAligned
                  ? styles.labelCenterPos
                  : isLeftAligned
                  ? styles.labelRightPos
                  : styles.labelLeftPos,
              ]}
            >
              <Text
                style={[styles.stageLabelTitle, { color: textPrimary }]}
                numberOfLines={1}
                adjustsFontSizeToFit
                minimumFontScale={0.85}
              >
                {tier.title}
              </Text>

              <View style={styles.stageLabelBottomRow}>
                <ThreeDStatusBadge state={badgeState} requiredXp={tier.minXp} />
              </View>

              <Text style={[styles.xpSubtext, { color: textSecondary }]}>
                {tier.minXp === 0
                  ? 'Starter Rank'
                  : `${tier.minXp} XP to unlock`}
              </Text>
            </TouchableOpacity>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    position: 'relative',
    marginVertical: ResponsivePixels.size10,
  },
  startGateBanner: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    gap: ResponsivePixels.size4,
    backgroundColor: withAlpha(Colors.PureBlack, 0.05),
    paddingHorizontal: ResponsivePixels.size8,
    paddingVertical: ResponsivePixels.size3,
    borderRadius: ResponsivePixels.size10,
    zIndex: 1,
  },
  summitGateBanner: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    gap: ResponsivePixels.size5,
    backgroundColor: withAlpha(Colors.AccentYellow, 0.15),
    paddingHorizontal: ResponsivePixels.size10,
    paddingVertical: ResponsivePixels.size3_5,
    borderRadius: ResponsivePixels.size12,
    borderWidth: 1,
    borderColor: withAlpha(Colors.AccentYellow, 0.4),
    zIndex: 1,
  },
  gateBannerText: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: ResponsivePixels.size9_5,
    letterSpacing: 0.6,
  },
  nodeWrapper: {
    position: 'absolute',
    width: ResponsivePixels.size58,
    height: ResponsivePixels.size58,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 3,
  },
  discShadowWrap: {
    width: ResponsivePixels.size58,
    height: ResponsivePixels.size58,
    borderRadius: ResponsivePixels.size29,
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
    top: -ResponsivePixels.size7,
    left: -ResponsivePixels.size7,
    right: -ResponsivePixels.size7,
    bottom: -ResponsivePixels.size7,
    borderRadius: ResponsivePixels.size36,
    borderWidth: 2.5,
    borderColor: withAlpha(Colors.VoiceMichaelAccent, 0.85),
    backgroundColor: withAlpha(Colors.VoiceMichaelAccent, 0.15),
  },
  discBody: {
    width: ResponsivePixels.size58,
    height: ResponsivePixels.size58,
    borderRadius: ResponsivePixels.size29,
    borderWidth: 2,
    borderTopColor: withAlpha(Colors.PureWhite, 0.85),
    borderLeftColor: withAlpha(Colors.PureWhite, 0.45),
    borderRightColor: withAlpha(Colors.PureWhite, 0.25),
    borderBottomWidth: 5.5,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  discGlossHighlight: {
    position: 'absolute',
    top: 0,
    left: ResponsivePixels.size6,
    right: ResponsivePixels.size6,
    height: ResponsivePixels.size12,
    borderRadius: ResponsivePixels.size12,
    backgroundColor: withAlpha(Colors.PureWhite, 0.38),
  },
  discCenterCol: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  discLevelNumber: {
    fontFamily: Fonts.ranade.bold,
    fontSize: ResponsivePixels.size22,
    color: Colors.PureWhite,
    textShadowColor: withAlpha(Colors.PureBlack, 0.35),
    textShadowOffset: { width: 0, height: ResponsivePixels.size1_5 },
    textShadowRadius: 2,
  },
  floatingRightSignSeal: {
    position: 'absolute',
    bottom: ResponsivePixels.size4,
    right: ResponsivePixels.size4,
    width: ResponsivePixels.size16,
    height: ResponsivePixels.size16,
    borderRadius: ResponsivePixels.size8,
    backgroundColor: Colors.Emerald700,
    borderWidth: 1.2,
    borderColor: Colors.PureWhite,
    alignItems: 'center',
    justifyContent: 'center',
  },
  discCurrentLevelText: {
    fontFamily: Fonts.poppins.bold,
    fontSize: ResponsivePixels.size8_5,
    color: Colors.PureWhite,
    marginTop: ResponsivePixels.size1,
    letterSpacing: 0.5,
  },
  discLockedText: {
    fontFamily: Fonts.poppins.bold,
    fontSize: ResponsivePixels.size9,
    color: Colors.Slate400,
    marginTop: ResponsivePixels.size1,
  },

  // Floating Stage Label Pill: Generous width to prevent any name truncation
  stageLabelCard: {
    position: 'absolute',
    borderRadius: ResponsivePixels.size14,
    borderWidth: 1.2,
    borderBottomWidth: 2.8,
    paddingHorizontal: ResponsivePixels.size10,
    paddingVertical: ResponsivePixels.size5_5,
    minWidth: ResponsivePixels.size136,
    maxWidth: ResponsivePixels.size168,
    alignItems: 'center',
    zIndex: 4,
    ...Platform.select({
      ios: {
        shadowColor: Colors.PureBlack,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.14,
        shadowRadius: 6,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  labelRightPos: {
    left: ResponsivePixels.size66,
    top: ResponsivePixels.size4,
  },
  labelLeftPos: {
    right: ResponsivePixels.size66,
    top: ResponsivePixels.size4,
  },
  labelCenterPos: {
    top: ResponsivePixels.size68,
    left: -ResponsivePixels.size46,
    width: ResponsivePixels.size150,
  },
  stageLabelTitle: {
    fontFamily: Fonts.ranade.bold,
    fontSize: ResponsivePixels.size12,
    marginBottom: ResponsivePixels.size3,
    textAlign: 'center',
  },
  stageLabelBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: ResponsivePixels.size2,
  },
  xpSubtext: {
    fontFamily: Fonts.poppins.regular,
    fontSize: ResponsivePixels.size8_5,
    textAlign: 'center',
  },
});
