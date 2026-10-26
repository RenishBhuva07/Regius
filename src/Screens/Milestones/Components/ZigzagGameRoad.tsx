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

import { Fonts } from '../../../Theme/fonts';
import { MilestoneTier } from '../../../Services/Milestone/MilestoneService';
import { ThreeDStatusBadge } from './ThreeDStatusBadge';

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
  totalXp,
  onSelectTier,
  isDarkMode,
}) => {
  // Road track geometry: 10px margin on each side, snug 780px height to eliminate dead bottom space
  const trackWidth = screenWidth - 20;
  const trackHeight = 780;

  // Node center coordinates: original 10:47 zigzag S-curve pattern
  const nodeCoords = [
    { x: trackWidth * 0.28, y: 70 }, // Level 1 (Left)
    { x: trackWidth * 0.72, y: 215 }, // Level 2 (Right)
    { x: trackWidth * 0.28, y: 360 }, // Level 3 (Left)
    { x: trackWidth * 0.72, y: 505 }, // Level 4 (Right)
    { x: trackWidth * 0.5, y: 660 }, // Level 5 (Center Summit)
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
  const curbColor = isDarkMode ? 'rgba(255, 255, 255, 0.22)' : '#DDD6C6';
  const asphaltColor = isDarkMode ? '#1E232B' : '#2A303C';
  const textPrimary = isDarkMode ? '#FFFFFF' : '#121417';
  const textSecondary = isDarkMode ? '#8E95A5' : '#6B7280';

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
            <Stop offset="0%" stopColor="#F5C518" />
            <Stop offset="100%" stopColor="#D97706" />
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
                strokeWidth={48}
                strokeLinecap="round"
                fill="none"
              />

              {/* Road Asphalt Bed */}
              <Path
                d={pathD}
                stroke={asphaltColor}
                strokeWidth={40}
                strokeLinecap="round"
                fill="none"
              />

              {/* Painted Center Highway Dashes */}
              <Path
                d={pathD}
                stroke={
                  segmentUnlocked ? '#F5C518' : 'rgba(255, 255, 255, 0.24)'
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
          r={44}
          stroke="rgba(245, 197, 24, 0.35)"
          strokeWidth={3}
          strokeDasharray="4 4"
          fill="none"
        />
      </Svg>

      {/* ── CLEAN GATEWAY MILESTONE BANNERS (NO OVERLAPS ON NODES) ── */}
      <View
        style={[styles.startGateBanner, { top: 16, left: trackWidth * 0.08 }]}
      >
        <Compass size={11} color="#D97706" strokeWidth={2.4} />
        <Text style={[styles.gateBannerText, { color: textSecondary }]}>
          START · NOVICE GATE
        </Text>
      </View>

      <View
        style={[styles.summitGateBanner, { top: 595, alignSelf: 'center' }]}
      >
        <Flag size={12} color="#F5C518" strokeWidth={2.5} />
        <Text style={[styles.gateBannerText, { color: '#F5C518' }]}>
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
          ? '#F59E0B'
          : isUnlocked
          ? tier.accentColor || '#10B981'
          : isDarkMode
          ? '#282E39'
          : '#3B4454';

        const discBorderBottom = isCurrent
          ? '#B45309'
          : isUnlocked
          ? '#047857'
          : isDarkMode
          ? '#151921'
          : '#20252F';

        const discShadowColor = isCurrent
          ? '#F59E0B'
          : isUnlocked
          ? tier.accentColor || '#10B981'
          : '#000000';

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
                left: coord.x - 29, // 58px / 2
                top: coord.y - 29,
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
                    <Crown size={20} color="#FFFFFF" strokeWidth={2.4} />
                    <Text style={styles.discCurrentLevelText}>
                      LVL {tier.level}
                    </Text>
                  </View>
                ) : isUnlocked ? (
                  <View style={styles.discCenterCol}>
                    <Text style={styles.discLevelNumber}>{tier.level}</Text>
                    {/* Floating 3D Checkmark Seal */}
                    <View style={styles.floatingRightSignSeal}>
                      <Check size={9} color="#FFFFFF" strokeWidth={3.5} />
                    </View>
                  </View>
                ) : (
                  <View style={styles.discCenterCol}>
                    <Lock size={17} color="#94A3B8" strokeWidth={2.4} />
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
                  backgroundColor: isDarkMode ? '#1E232B' : '#FFFFFF',
                  borderColor: isCurrent
                    ? '#F5C518'
                    : isDarkMode
                    ? 'rgba(255, 255, 255, 0.14)'
                    : '#E6E0D2',
                  borderBottomColor: isCurrent
                    ? '#D97706'
                    : isDarkMode
                    ? '#14181F'
                    : '#D5CDBE',
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
    marginVertical: 10,
  },
  startGateBanner: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    zIndex: 1,
  },
  summitGateBanner: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(245, 197, 24, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 3.5,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(245, 197, 24, 0.4)',
    zIndex: 1,
  },
  gateBannerText: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: 9.5,
    letterSpacing: 0.6,
  },
  nodeWrapper: {
    position: 'absolute',
    width: 58,
    height: 58,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 3,
  },
  discShadowWrap: {
    width: 58,
    height: 58,
    borderRadius: 29,
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
    top: -7,
    left: -7,
    right: -7,
    bottom: -7,
    borderRadius: 36,
    borderWidth: 2.5,
    borderColor: 'rgba(245, 158, 11, 0.85)',
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
  },
  discBody: {
    width: 58,
    height: 58,
    borderRadius: 29,
    borderWidth: 2,
    borderTopColor: 'rgba(255, 255, 255, 0.85)',
    borderLeftColor: 'rgba(255, 255, 255, 0.45)',
    borderRightColor: 'rgba(255, 255, 255, 0.25)',
    borderBottomWidth: 5.5,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  discGlossHighlight: {
    position: 'absolute',
    top: 0,
    left: 6,
    right: 6,
    height: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.38)',
  },
  discCenterCol: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  discLevelNumber: {
    fontFamily: Fonts.ranade.bold,
    fontSize: 22,
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.35)',
    textShadowOffset: { width: 0, height: 1.5 },
    textShadowRadius: 2,
  },
  floatingRightSignSeal: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#047857',
    borderWidth: 1.2,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  discCurrentLevelText: {
    fontFamily: Fonts.poppins.bold,
    fontSize: 8.5,
    color: '#FFFFFF',
    marginTop: 1,
    letterSpacing: 0.5,
  },
  discLockedText: {
    fontFamily: Fonts.poppins.bold,
    fontSize: 9,
    color: '#94A3B8',
    marginTop: 1,
  },

  // Floating Stage Label Pill: Generous width to prevent any name truncation
  stageLabelCard: {
    position: 'absolute',
    borderRadius: 14,
    borderWidth: 1.2,
    borderBottomWidth: 2.8,
    paddingHorizontal: 10,
    paddingVertical: 5.5,
    minWidth: 136,
    maxWidth: 168,
    alignItems: 'center',
    zIndex: 4,
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
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
    left: 66,
    top: 4,
  },
  labelLeftPos: {
    right: 66,
    top: 4,
  },
  labelCenterPos: {
    top: 68,
    left: -46,
    width: 150,
  },
  stageLabelTitle: {
    fontFamily: Fonts.ranade.bold,
    fontSize: 12,
    marginBottom: 3,
    textAlign: 'center',
  },
  stageLabelBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  xpSubtext: {
    fontFamily: Fonts.poppins.regular,
    fontSize: 8.5,
    textAlign: 'center',
  },
});
