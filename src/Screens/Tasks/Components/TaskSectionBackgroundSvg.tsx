import React, { useState, useCallback } from 'react';
import { StyleSheet, View, Dimensions, LayoutChangeEvent } from 'react-native';
import Svg, {
  Path,
  Circle,
  Rect,
  G,
  Defs,
  LinearGradient,
  RadialGradient,
  Stop,
  Line,
} from 'react-native-svg';
import { Fonts } from '../../../Theme/fonts';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export interface TaskSectionBackgroundSvgProps {
  width?: number;
  height?: number;
}

/**
 * Dynamic luxury aesthetic background for Tasks Section:
 * - Ambient gold/amber focus chronometer radiating from top crest badge
 * - Geometric focus lattice and delicate diamond starlight nodes
 * - Left flank task progression ribbon with milestone nodes
 * - Paper plane glider & checklist doodles
 * - Bottom-right focus target & checkmark watermark doodle
 * - Dynamically adapts to any container dimensions via layout measurement
 */
export const TaskSectionBackgroundSvg: React.FC<TaskSectionBackgroundSvgProps> =
  React.memo(({ width: propWidth, height: propHeight }) => {
    const [dimensions, setDimensions] = useState<{
      width: number;
      height: number;
    }>({
      width: propWidth || SCREEN_WIDTH - 20,
      height: propHeight || 700,
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

    const taskDiamond = (cx: number, cy: number, s: number) =>
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
            {/* Base warm luxury parchment sheen */}
            <LinearGradient
              id="taskBgSheen"
              x1="0"
              y1="0"
              x2="0"
              y2={H}
              gradientUnits="userSpaceOnUse"
            >
              <Stop offset="0%" stopColor="#FFFDF7" stopOpacity={0.98} />
              <Stop offset="22%" stopColor="#FAF7EF" stopOpacity={0.97} />
              <Stop offset="68%" stopColor="#F5EFE3" stopOpacity={0.96} />
              <Stop offset="100%" stopColor="#ECE4D4" stopOpacity={0.98} />
            </LinearGradient>

            {/* Gold Focus Dawn Aura under center crest badge */}
            <RadialGradient
              id="taskCrestAura"
              cx={centerX}
              cy={0}
              r={175}
              gradientUnits="userSpaceOnUse"
            >
              <Stop offset="0%" stopColor="#F5C518" stopOpacity={0.24} />
              <Stop offset="45%" stopColor="#DEAA14" stopOpacity={0.08} />
              <Stop offset="100%" stopColor="#FAF7EF" stopOpacity={0} />
            </RadialGradient>

            {/* Golden radiance under top-right floating plus button */}
            <RadialGradient
              id="taskPlusAura"
              cx={W - 37}
              cy={0}
              r={115}
              gradientUnits="userSpaceOnUse"
            >
              <Stop offset="0%" stopColor="#F5C518" stopOpacity={0.25} />
              <Stop offset="50%" stopColor="#D99B0F" stopOpacity={0.07} />
              <Stop offset="100%" stopColor="#FAF7EF" stopOpacity={0} />
            </RadialGradient>

            {/* Lavender focus aura on upper-left */}
            <RadialGradient
              id="taskLavenderAura"
              cx={24}
              cy={70}
              r={160}
              gradientUnits="userSpaceOnUse"
            >
              <Stop offset="0%" stopColor="#8383D6" stopOpacity={0.14} />
              <Stop offset="50%" stopColor="#9C9CE3" stopOpacity={0.04} />
              <Stop offset="100%" stopColor="#FAF7EF" stopOpacity={0} />
            </RadialGradient>

            {/* Fresh mint vitality aura on center-right */}
            <RadialGradient
              id="taskMintAura"
              cx={W - 15}
              cy={Math.min(H * 0.45, 340)}
              r={160}
              gradientUnits="userSpaceOnUse"
            >
              <Stop offset="0%" stopColor="#52D22E" stopOpacity={0.12} />
              <Stop offset="55%" stopColor="#1B9A72" stopOpacity={0.03} />
              <Stop offset="100%" stopColor="#F5EFE3" stopOpacity={0} />
            </RadialGradient>

            {/* Bottom footer radiance aura behind "Live it up!" and task complete doodles */}
            <RadialGradient
              id="taskFooterAura"
              cx={centerX}
              cy={H - 110}
              r={210}
              gradientUnits="userSpaceOnUse"
            >
              <Stop offset="0%" stopColor="#F5C518" stopOpacity={0.18} />
              <Stop offset="48%" stopColor="#E2A612" stopOpacity={0.05} />
              <Stop offset="100%" stopColor="#ECE4D4" stopOpacity={0} />
            </RadialGradient>

            {/* Bottom-right warm amber target aura */}
            <RadialGradient
              id="taskTargetAura"
              cx={W - 40}
              cy={H - 80}
              r={160}
              gradientUnits="userSpaceOnUse"
            >
              <Stop offset="0%" stopColor="#F5C518" stopOpacity={0.18} />
              <Stop offset="50%" stopColor="#DEAA14" stopOpacity={0.05} />
              <Stop offset="100%" stopColor="#ECE4D4" stopOpacity={0} />
            </RadialGradient>

            {/* Gold node gradient */}
            <LinearGradient
              id="taskGoldNode"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <Stop offset="0%" stopColor="#FFFCE3" stopOpacity={0.95} />
              <Stop offset="50%" stopColor="#F5C518" stopOpacity={0.85} />
              <Stop offset="100%" stopColor="#B48216" stopOpacity={0.65} />
            </LinearGradient>

            {/* Delicate top specular light rim */}
            <LinearGradient
              id="taskRimLight"
              x1="0"
              y1="0"
              x2="0"
              y2={H}
              gradientUnits="userSpaceOnUse"
            >
              <Stop offset="0%" stopColor="#FFFFFF" stopOpacity={0.95} />
              <Stop offset="15%" stopColor="#FFFFFF" stopOpacity={0.3} />
              <Stop offset="100%" stopColor="#DACFBE" stopOpacity={0.4} />
            </LinearGradient>
          </Defs>

          {/* 1. Base Gradient Canvas */}
          <Rect x={0} y={0} width={W} height={H} fill="url(#taskBgSheen)" />

          {/* 2. Ambient Color Auras */}
          <Rect x={0} y={0} width={W} height={H} fill="url(#taskCrestAura)" />
          <Rect x={0} y={0} width={W} height={H} fill="url(#taskPlusAura)" />
          <Rect
            x={0}
            y={0}
            width={W}
            height={H}
            fill="url(#taskLavenderAura)"
          />
          <Rect x={0} y={0} width={W} height={H} fill="url(#taskMintAura)" />
          <Rect x={0} y={0} width={W} height={H} fill="url(#taskFooterAura)" />
          <Rect x={0} y={0} width={W} height={H} fill="url(#taskTargetAura)" />

          {/* 3. Concentric Focus Chronometer Rings radiating from center crest badge */}
          <G opacity={0.65}>
            <Circle
              cx={centerX}
              cy={0}
              r={60}
              stroke="#D4CCA8"
              strokeWidth={1}
              strokeDasharray="4 6"
              fill="none"
              opacity={0.4}
            />
            <Circle
              cx={centerX}
              cy={0}
              r={95}
              stroke="#F5C518"
              strokeWidth={1.2}
              fill="none"
              opacity={0.35}
            />
            <Circle
              cx={centerX}
              cy={0}
              r={140}
              stroke="#8383D6"
              strokeWidth={1}
              strokeDasharray="8 8"
              fill="none"
              opacity={0.24}
            />
            <Circle
              cx={centerX}
              cy={0}
              r={190}
              stroke="#D8D0BA"
              strokeWidth={1}
              fill="none"
              opacity={0.22}
            />
            <Circle
              cx={centerX}
              cy={0}
              r={240}
              stroke="#D0C8B0"
              strokeWidth={0.9}
              strokeDasharray="3 7"
              fill="none"
              opacity={0.18}
            />

            {/* Radial Focus Hour Ticks radiating from crest */}
            {[-60, -45, -30, -15, 0, 15, 30, 45, 60].map((deg, i) => {
              const rad = (deg * Math.PI) / 180;
              const r1 = 80;
              const r2 = i % 2 === 0 ? 112 : 100;
              const x1 = centerX + Math.sin(rad) * r1;
              const y1 = Math.cos(rad) * r1;
              const x2 = centerX + Math.sin(rad) * r2;
              const y2 = Math.cos(rad) * r2;
              return (
                <Line
                  key={`task-radial-${deg}`}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke={i % 2 === 0 ? '#F5C518' : '#8383D6'}
                  strokeWidth={1.2}
                  opacity={0.3}
                  strokeLinecap="round"
                />
              );
            })}
          </G>

          {/* 4. Subtle Diamond Focus Grid */}
          <G opacity={0.32}>
            <Line
              x1={0}
              y1={130}
              x2={Math.min(W, 360)}
              y2={Math.min(H, 490)}
              stroke="#DFD7C2"
              strokeWidth={0.9}
              strokeDasharray="3 5"
            />
            <Line
              x1={0}
              y1={250}
              x2={Math.min(W, 360)}
              y2={Math.min(H, 610)}
              stroke="#DFD7C2"
              strokeWidth={0.9}
              strokeDasharray="3 5"
            />
            <Line
              x1={W}
              y1={130}
              x2={Math.max(0, W - 360)}
              y2={Math.min(H, 490)}
              stroke="#DFD7C2"
              strokeWidth={0.9}
              strokeDasharray="3 5"
            />
            <Line
              x1={W}
              y1={250}
              x2={Math.max(0, W - 360)}
              y2={Math.min(H, 610)}
              stroke="#DFD7C2"
              strokeWidth={0.9}
              strokeDasharray="3 5"
            />
          </G>

          {/* 5. Botanical Task Progression Ribbon on Left Flank */}
          <Path
            d={`M 0 160 Q 28 230 16 320 T 30 460 T 14 600 T 26 ${H - 35}`}
            stroke="#F5C518"
            strokeWidth={1.2}
            strokeDasharray="5 7"
            fill="none"
            opacity={0.22}
          />
          <Circle
            cx={20}
            cy={225}
            r={2.6}
            fill="url(#taskGoldNode)"
            opacity={0.5}
          />
          <Circle
            cx={18}
            cy={318}
            r={3}
            fill="url(#taskGoldNode)"
            opacity={0.55}
          />
          <Circle
            cx={29}
            cy={458}
            r={2.8}
            fill="url(#taskGoldNode)"
            opacity={0.5}
          />
          <Circle
            cx={15}
            cy={598}
            r={2.6}
            fill="url(#taskGoldNode)"
            opacity={0.45}
          />
          <Circle
            cx={25}
            cy={H - 38}
            r={3.2}
            fill="url(#taskGoldNode)"
            opacity={0.6}
          />

          {/* 6. Paper Plane / Inbox Zero Glider Doodle (Middle-Right) */}
          <G transform={`translate(${W - 68}, 235)`} opacity={0.22}>
            {/* Dashed flight trail */}
            <Path
              d="M -30 35 Q -10 32 0 16"
              stroke="#F5C518"
              strokeWidth={1}
              strokeDasharray="2 3"
              fill="none"
            />
            {/* Origami Paper Plane Body */}
            <Path
              d="M 24 0 L 2 14 L 11 16 L 24 0 Z"
              stroke="#F5C518"
              strokeWidth={1.2}
              fill="none"
              strokeLinejoin="round"
            />
            <Path
              d="M 24 0 L 14 26 L 11 16 L 24 0 Z"
              stroke="#DEAA14"
              strokeWidth={1.2}
              fill="none"
              strokeLinejoin="round"
            />
            <Path
              d="M 11 16 L 8 22 L 14 26"
              stroke="#B48216"
              strokeWidth={1}
              fill="none"
            />
          </G>

          {/* 7. Parchment Task Checklist Doodle (Mid-Left) */}
          <G
            transform={`translate(28, ${Math.min(390, H * 0.48)})`}
            opacity={0.18}
          >
            {/* Mini notepad outline */}
            <Rect
              x={0}
              y={0}
              width={34}
              height={42}
              rx={6}
              stroke="#D4CCA8"
              strokeWidth={1}
              fill="none"
            />
            {/* Top binder clip / tab */}
            <Rect
              x={9}
              y={-3}
              width={16}
              height={4}
              rx={2}
              stroke="#F5C518"
              strokeWidth={1}
              fill="none"
            />
            {/* Checklist row 1 */}
            <Rect
              x={5}
              y={8}
              width={6}
              height={6}
              rx={1.5}
              stroke="#52D22E"
              strokeWidth={0.9}
              fill="none"
            />
            <Line
              x1={15}
              y1={11}
              x2={28}
              y2={11}
              stroke="#C4BCA8"
              strokeWidth={1}
              strokeLinecap="round"
            />
            {/* Checklist row 2 */}
            <Rect
              x={5}
              y={19}
              width={6}
              height={6}
              rx={1.5}
              stroke="#F5C518"
              strokeWidth={0.9}
              fill="none"
            />
            <Line
              x1={15}
              y1={22}
              x2={27}
              y2={22}
              stroke="#C4BCA8"
              strokeWidth={1}
              strokeLinecap="round"
            />
            {/* Checklist row 3 */}
            <Rect
              x={5}
              y={30}
              width={6}
              height={6}
              rx={1.5}
              stroke="#8383D6"
              strokeWidth={0.9}
              fill="none"
            />
            <Line
              x1={15}
              y1={33}
              x2={25}
              y2={33}
              stroke="#C4BCA8"
              strokeWidth={1}
              strokeLinecap="round"
            />
          </G>

          {/* 8. Calligraphic Fountain Pen Flourish Checkmark Doodle (Positioned gracefully above footer) */}
          <G transform={`translate(22, ${H - 225})`} opacity={0.2}>
            {/* Continuous flourish check stroke */}
            <Path
              d="M 6 34 Q 16 48 24 54 Q 38 30 56 8"
              stroke="#F5C518"
              strokeWidth={2.4}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            {/* Ink flourish drop */}
            <Circle cx={58} cy={7} r={2.2} fill="#F5C518" />
            {/* Subtle start taper loop */}
            <Circle cx={6} cy={34} r={1.6} fill="#F5C518" />
          </G>

          {/* 9. Sacred Focus Compass & Celebratory Checkmark Watermark Doodle on Bottom-Right */}
          <G transform={`translate(${W - 88}, ${H - 140})`} opacity={0.24}>
            {/* Outer focus orbital ring */}
            <Circle
              cx={40}
              cy={40}
              r={36}
              stroke="#F5C518"
              strokeWidth={1.3}
              fill="none"
            />
            {/* Inner dashed calibration ring */}
            <Circle
              cx={40}
              cy={40}
              r={24}
              stroke="#DEAA14"
              strokeWidth={1}
              strokeDasharray="4 5"
              fill="none"
              opacity={0.8}
            />
            {/* Compass axis ticks */}
            <Line
              x1={40}
              y1={2}
              x2={40}
              y2={10}
              stroke="#F5C518"
              strokeWidth={1.4}
              strokeLinecap="round"
            />
            <Line
              x1={40}
              y1={70}
              x2={40}
              y2={78}
              stroke="#F5C518"
              strokeWidth={1.4}
              strokeLinecap="round"
            />
            <Line
              x1={2}
              y1={40}
              x2={10}
              y2={40}
              stroke="#F5C518"
              strokeWidth={1.4}
              strokeLinecap="round"
            />
            <Line
              x1={70}
              y1={40}
              x2={78}
              y2={40}
              stroke="#F5C518"
              strokeWidth={1.4}
              strokeLinecap="round"
            />

            {/* Continuous-line dynamic checkmark doodle inside focus ring */}
            <Path
              d="M 24 38 L 35 49 L 58 24"
              stroke="#F5C518"
              strokeWidth={2.4}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />

            {/* Radiant core spark */}
            <Circle cx={40} cy={40} r={2.5} fill="#F5C518" opacity={0.9} />
          </G>

          {/* 10. Golden Diamond Stars & Constellation Nodes */}
          <Path
            d={taskDiamond(40, 115, 6)}
            fill="url(#taskGoldNode)"
            opacity={0.55}
          />
          <Path
            d={taskDiamond(W - 46, 122, 5.5)}
            fill="url(#taskGoldNode)"
            opacity={0.55}
          />
          <Path
            d={taskDiamond(W - 28, 245, 5)}
            fill="url(#taskGoldNode)"
            opacity={0.45}
          />
          <Path
            d={taskDiamond(42, 385, 5)}
            fill="url(#taskGoldNode)"
            opacity={0.4}
          />
          <Path
            d={taskDiamond(W - 40, 470, 6)}
            fill="url(#taskGoldNode)"
            opacity={0.45}
          />

          {/* Bottom constellation milestone points */}
          <Path
            d={taskDiamond(W - 45, H - 75, 6)}
            fill="url(#taskGoldNode)"
            opacity={0.55}
          />
          <Path
            d={taskDiamond(48, H - 90, 5)}
            fill="url(#taskGoldNode)"
            opacity={0.45}
          />
          <Path
            d={taskDiamond(W * 0.52, H - 120, 4.5)}
            fill="url(#taskGoldNode)"
            opacity={0.4}
          />

          {/* Starlight micro nodes */}
          <Circle cx={W * 0.22} cy={88} r={1.6} fill="#F5C518" opacity={0.45} />
          <Circle cx={W * 0.78} cy={92} r={1.6} fill="#F5C518" opacity={0.45} />
          <Circle cx={W * 0.15} cy={270} r={1.8} fill="#8383D6" opacity={0.4} />
          <Circle cx={W * 0.86} cy={340} r={1.8} fill="#52D22E" opacity={0.4} />
          <Circle
            cx={W * 0.45}
            cy={H - 50}
            r={2}
            fill="#F5C518"
            opacity={0.4}
          />
          <Circle
            cx={W * 0.72}
            cy={H - 100}
            r={2.2}
            fill="#F5C518"
            opacity={0.45}
          />

          {/* 12. Top Specular Bevel Rim (1.5px) */}
          <Path
            d={`M 1.5 ${H - 1.5} L 1.5 32 Q 1.5 1.5 32 1.5 L ${W - 32} 1.5 Q ${
              W - 1.5
            } 1.5 ${W - 1.5} 32 L ${W - 1.5} ${H - 1.5}`}
            stroke="url(#taskRimLight)"
            strokeWidth={1.5}
            fill="none"
          />
        </Svg>
      </View>
    );
  });

export default TaskSectionBackgroundSvg;
