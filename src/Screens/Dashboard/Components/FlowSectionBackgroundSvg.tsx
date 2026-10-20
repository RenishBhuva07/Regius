import React, { useState, useCallback } from 'react';
import { StyleSheet, View, LayoutChangeEvent, Dimensions } from 'react-native';
import Svg, {
  Path,
  Circle,
  Rect,
  Line,
  G,
  Defs,
  LinearGradient,
  RadialGradient,
  Stop,
} from 'react-native-svg';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export interface FlowSectionBackgroundSvgProps {
  width?: number;
  height?: number;
}

/**
 * Dynamic aesthetic luxury background for Today's Flow section:
 * - Adapts dynamically to any container height without stretching or distorting circles/stars
 * - Measured via layout events in 1:1 pixel coordinate space
 * - Pearlescent warm cream gradient base
 * - Circular acoustic ripples under the Today's Flow crest badge
 * - Fixed-geometry Regius signature 4-pointed diamond starbursts & stardust
 * - Subtle harmonic wave ribbons along the flanks
 * - Beveled inner rim highlight adapting to container bounds
 */
export const FlowSectionBackgroundSvg: React.FC<FlowSectionBackgroundSvgProps> =
  React.memo(({ width: propWidth, height: propHeight }) => {
    const [dimensions, setDimensions] = useState<{
      width: number;
      height: number;
    }>({
      width: propWidth || SCREEN_WIDTH - 32,
      height: propHeight || 600,
    });

    const handleLayout = useCallback((e: LayoutChangeEvent) => {
      const { width, height } = e.nativeEvent.layout;
      if (width > 0 && height > 0) {
        setDimensions(prev => {
          if (
            Math.abs(prev.width - width) < 1 &&
            Math.abs(prev.height - height) < 1
          ) {
            return prev;
          }
          return { width, height };
        });
      }
    }, []);

    const W = Math.round(propWidth || dimensions.width);
    const H = Math.round(propHeight || dimensions.height);
    const centerX = W / 2;

    // Symmetrical 4-point diamond star generator (fixed pixel geometry)
    const star = (cx: number, cy: number, s: number) =>
      `M ${cx} ${cy - s} Q ${cx} ${cy}, ${cx + s} ${cy} Q ${cx} ${cy}, ${cx} ${
        cy + s
      } Q ${cx} ${cy}, ${cx - s} ${cy} Q ${cx} ${cy}, ${cx} ${cy - s} Z`;

    return (
      <View
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
        onLayout={handleLayout}
      >
        <Svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} fill="none">
          <Defs>
            {/* Base warm cream gradation matching screen surface */}
            <LinearGradient
              id="flowBgSheen"
              x1="0"
              y1="0"
              x2="0"
              y2={H}
              gradientUnits="userSpaceOnUse"
            >
              <Stop offset="0%" stopColor="#FFFDF7" stopOpacity={0.98} />
              <Stop offset="25%" stopColor="#FAF6ED" stopOpacity={0.96} />
              <Stop offset="75%" stopColor="#F5EFE3" stopOpacity={0.96} />
              <Stop offset="100%" stopColor="#EDE5D6" stopOpacity={0.98} />
            </LinearGradient>

            {/* Circular golden dawn halo under crest badge (non-stretched) */}
            <RadialGradient
              id="crestDawnAura"
              cx={centerX}
              cy={0}
              r={160}
              gradientUnits="userSpaceOnUse"
            >
              <Stop offset="0%" stopColor="#F5C518" stopOpacity={0.18} />
              <Stop offset="45%" stopColor="#E2A612" stopOpacity={0.06} />
              <Stop offset="100%" stopColor="#FAF6ED" stopOpacity={0} />
            </RadialGradient>

            {/* Top-right velvet lavender aura (non-stretched circular radius) */}
            <RadialGradient
              id="flowLavenderAura"
              cx={W - 10}
              cy={40}
              r={130}
              gradientUnits="userSpaceOnUse"
            >
              <Stop offset="0%" stopColor="#9C9CE3" stopOpacity={0.18} />
              <Stop offset="55%" stopColor="#8383D6" stopOpacity={0.06} />
              <Stop offset="100%" stopColor="#FAF6ED" stopOpacity={0} />
            </RadialGradient>

            {/* Top-left golden accent aura */}
            <RadialGradient
              id="flowAmberTopAura"
              cx={10}
              cy={40}
              r={110}
              gradientUnits="userSpaceOnUse"
            >
              <Stop offset="0%" stopColor="#F5C518" stopOpacity={0.12} />
              <Stop offset="50%" stopColor="#E2A612" stopOpacity={0.04} />
              <Stop offset="100%" stopColor="#FAF6ED" stopOpacity={0} />
            </RadialGradient>

            {/* Bottom-left mint clarity aura */}
            <RadialGradient
              id="flowMintAura"
              cx={20}
              cy={H - 40}
              r={120}
              gradientUnits="userSpaceOnUse"
            >
              <Stop offset="0%" stopColor="#52D22E" stopOpacity={0.08} />
              <Stop offset="50%" stopColor="#1B9A72" stopOpacity={0.03} />
              <Stop offset="100%" stopColor="#EDE5D6" stopOpacity={0} />
            </RadialGradient>

            {/* Bottom-right peach aura */}
            <RadialGradient
              id="flowPeachAura"
              cx={W - 20}
              cy={H - 40}
              r={120}
              gradientUnits="userSpaceOnUse"
            >
              <Stop offset="0%" stopColor="#E87A5D" stopOpacity={0.07} />
              <Stop offset="55%" stopColor="#D96E52" stopOpacity={0.02} />
              <Stop offset="100%" stopColor="#EDE5D6" stopOpacity={0} />
            </RadialGradient>

            {/* Gold shine for micro diamond starbursts */}
            <LinearGradient
              id="flowGoldStar"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <Stop offset="0%" stopColor="#FFFCE3" stopOpacity={0.98} />
              <Stop offset="50%" stopColor="#F5C518" stopOpacity={0.88} />
              <Stop offset="100%" stopColor="#B48216" stopOpacity={0.7} />
            </LinearGradient>

            {/* Delicate border highlight rim */}
            <LinearGradient
              id="flowRimHighlight"
              x1="0"
              y1="0"
              x2="0"
              y2={H}
              gradientUnits="userSpaceOnUse"
            >
              <Stop offset="0%" stopColor="#FFFFFF" stopOpacity={0.9} />
              <Stop offset="30%" stopColor="#FFFFFF" stopOpacity={0.25} />
              <Stop offset="100%" stopColor="#DDD4C4" stopOpacity={0.4} />
            </LinearGradient>
          </Defs>

          {/* ── Base Ambient Glow Volumes ── */}
          <Rect width={W} height={H} fill="url(#flowBgSheen)" />
          <Rect width={W} height={H} fill="url(#crestDawnAura)" />
          <Rect width={W} height={H} fill="url(#flowLavenderAura)" />
          <Rect width={W} height={H} fill="url(#flowAmberTopAura)" />
          <Rect width={W} height={H} fill="url(#flowMintAura)" />
          <Rect width={W} height={H} fill="url(#flowPeachAura)" />

          {/* ── Acoustic Concentric Ripples under Crest (100% True Circles) ── */}
          <Circle
            cx={centerX}
            cy={0}
            r={46}
            stroke="rgba(180, 130, 22, 0.12)"
            strokeWidth={1}
            fill="none"
          />
          <Circle
            cx={centerX}
            cy={0}
            r={78}
            stroke="rgba(180, 130, 22, 0.08)"
            strokeWidth={1}
            strokeDasharray="4 5"
            fill="none"
          />
          <Circle
            cx={centerX}
            cy={0}
            r={116}
            stroke="rgba(131, 131, 214, 0.07)"
            strokeWidth={1.1}
            fill="none"
          />
          <Circle
            cx={centerX}
            cy={0}
            r={160}
            stroke="rgba(131, 131, 214, 0.05)"
            strokeWidth={1}
            strokeDasharray="5 6"
            fill="none"
          />

          {/* ── Top-Left & Top-Right Orbital Arcs ── */}
          <Circle
            cx={W - 24}
            cy={32}
            r={24}
            stroke="rgba(131, 131, 214, 0.12)"
            strokeWidth={1}
            fill="none"
          />
          <Circle
            cx={W - 24}
            cy={32}
            r={40}
            stroke="rgba(131, 131, 214, 0.06)"
            strokeWidth={1}
            strokeDasharray="3 4"
            fill="none"
          />
          <Circle
            cx={24}
            cy={32}
            r={24}
            stroke="rgba(180, 130, 22, 0.1)"
            strokeWidth={1}
            fill="none"
          />
          <Circle
            cx={24}
            cy={32}
            r={40}
            stroke="rgba(180, 130, 22, 0.05)"
            strokeWidth={1}
            strokeDasharray="3 4"
            fill="none"
          />

          {/* ── Bottom Micro-Orbitals ── */}
          {H > 200 && (
            <>
              <Circle
                cx={28}
                cy={H - 32}
                r={26}
                stroke="rgba(27, 154, 114, 0.08)"
                strokeWidth={1}
                strokeDasharray="3 4"
                fill="none"
              />
              <Circle
                cx={W - 28}
                cy={H - 32}
                r={26}
                stroke="rgba(232, 122, 93, 0.08)"
                strokeWidth={1}
                strokeDasharray="3 4"
                fill="none"
              />
            </>
          )}

          {/* ── Flank Wave Ribbons & Vertical Micro-Guides ── */}
          {/* Top flank waves */}
          <Path
            d="M -4 70 Q 22 130, 6 200 T 12 280"
            stroke="rgba(131, 131, 214, 0.07)"
            strokeWidth={1.2}
            strokeLinecap="round"
            fill="none"
          />
          <Path
            d={`M ${W + 4} 70 Q ${W - 22} 130, ${W - 6} 200 T ${W - 12} 280`}
            stroke="rgba(131, 131, 214, 0.08)"
            strokeWidth={1.2}
            strokeLinecap="round"
            fill="none"
          />

          {/* Bottom flank waves */}
          {H > 400 && (
            <>
              <Path
                d={`M 12 ${H - 260} Q 6 ${H - 180}, 20 ${H - 100} T -4 ${
                  H - 40
                }`}
                stroke="rgba(180, 130, 22, 0.06)"
                strokeWidth={1.1}
                strokeLinecap="round"
                fill="none"
              />
              <Path
                d={`M ${W - 12} ${H - 260} Q ${W - 6} ${H - 180}, ${W - 20} ${
                  H - 100
                } T ${W + 4} ${H - 40}`}
                stroke="rgba(131, 131, 214, 0.06)"
                strokeWidth={1.1}
                strokeLinecap="round"
                fill="none"
              />
            </>
          )}

          {/* Vertical dashed timeline guide tracks along borders */}
          {H > 240 && (
            <>
              <Line
                x1={12}
                y1={90}
                x2={12}
                y2={H - 90}
                stroke="rgba(180, 130, 22, 0.04)"
                strokeWidth={0.8}
                strokeDasharray="3 6"
              />
              <Line
                x1={W - 12}
                y1={90}
                x2={W - 12}
                y2={H - 90}
                stroke="rgba(131, 131, 214, 0.04)"
                strokeWidth={0.8}
                strokeDasharray="3 6"
              />
            </>
          )}

          {/* ── Regius Signature Diamond Starbursts (Symmetrical 4-point diamonds) ── */}
          {/* Top stars */}
          <Path d={star(32, 42, 3.8)} fill="url(#flowGoldStar)" />
          <Path d={star(W - 32, 42, 3.8)} fill="url(#flowGoldStar)" />
          {/* Crest flanking micro-stars */}
          <Path d={star(centerX - 108, 14, 2.6)} fill="url(#flowGoldStar)" />
          <Path d={star(centerX + 108, 14, 2.6)} fill="url(#flowGoldStar)" />

          {/* Mid-flank stars */}
          {H > 350 && (
            <>
              <Path
                d={star(16, Math.min(320, H * 0.4), 2.8)}
                fill="url(#flowGoldStar)"
              />
              <Path
                d={star(W - 16, Math.min(480, H * 0.62), 2.8)}
                fill="url(#flowGoldStar)"
              />
            </>
          )}

          {/* Bottom stars */}
          {H > 220 && (
            <>
              <Path d={star(34, H - 36, 3.6)} fill="url(#flowGoldStar)" />
              <Path d={star(W - 34, H - 36, 3.6)} fill="url(#flowGoldStar)" />
            </>
          )}

          {/* ── Stardust micro-dots ── */}
          <Circle cx={44} cy={30} r={1.2} fill="rgba(180, 130, 22, 0.28)" />
          <Circle cx={22} cy={68} r={1} fill="rgba(180, 130, 22, 0.2)" />
          <Circle cx={W - 44} cy={30} r={1.2} fill="rgba(131, 131, 214, 0.3)" />
          <Circle cx={W - 22} cy={68} r={1} fill="rgba(131, 131, 214, 0.2)" />
          {H > 300 && (
            <>
              <Circle
                cx={12}
                cy={Math.min(340, H * 0.4) + 18}
                r={1}
                fill="rgba(180, 130, 22, 0.2)"
              />
              <Circle
                cx={W - 12}
                cy={Math.min(480, H * 0.62) + 18}
                r={1}
                fill="rgba(131, 131, 214, 0.2)"
              />
            </>
          )}
          {H > 200 && (
            <>
              <Circle
                cx={24}
                cy={H - 52}
                r={1.2}
                fill="rgba(27, 154, 114, 0.25)"
              />
              <Circle
                cx={W - 24}
                cy={H - 52}
                r={1.2}
                fill="rgba(232, 122, 93, 0.25)"
              />
            </>
          )}

          {/* ── Inner Beveled Highlight Rim ── */}
          <Rect
            x={1}
            y={1}
            width={W - 2}
            height={H - 2}
            rx={23}
            stroke="url(#flowRimHighlight)"
            strokeWidth={1}
            fill="none"
          />
        </Svg>
      </View>
    );
  });

export default FlowSectionBackgroundSvg;
