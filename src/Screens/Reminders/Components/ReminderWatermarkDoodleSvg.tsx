import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, {
  Path,
  Circle,
  Rect,
  G,
  Defs,
  LinearGradient,
  Stop,
  Line,
} from 'react-native-svg';

export interface ReminderWatermarkDoodleSvgProps {
  width?: number;
  height?: number;
}

/**
 * Reminder Watermark Doodle Illustration:
 * - Playful hand-drawn tilted classic twin-bell alarm clock ringing vibrantly
 * - Acoustic chime resonance arcs, starburst sparkles, and time motion loops
 * - Harmonizes seamlessly alongside "Time moves when you do!" / "Never miss a golden beat!"
 */
export const ReminderWatermarkDoodleSvg: React.FC<
  ReminderWatermarkDoodleSvgProps
> = ({ width = 135, height = 145 }) => {
  return (
    <View style={[styles.container, { width, height }]} pointerEvents="none">
      <Svg width={width} height={height} viewBox="0 0 135 145" fill="none">
        <Defs>
          {/* Gold celebration gradient */}
          <LinearGradient
            id="remDoodleGold"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <Stop offset="0%" stopColor="#FFFCE3" />
            <Stop offset="40%" stopColor="#F5C518" />
            <Stop offset="100%" stopColor="#D99B0F" />
          </LinearGradient>

          {/* Lavender acoustic gradient */}
          <LinearGradient
            id="remDoodleLavender"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <Stop offset="0%" stopColor="#D8DBFF" />
            <Stop offset="50%" stopColor="#8383D6" />
            <Stop offset="100%" stopColor="#5E5EB2" />
          </LinearGradient>

          {/* Mint check gradient */}
          <LinearGradient
            id="remDoodleMint"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <Stop offset="0%" stopColor="#86EFAC" />
            <Stop offset="50%" stopColor="#22C55E" />
            <Stop offset="100%" stopColor="#15803D" />
          </LinearGradient>

          {/* Clock dial face glow */}
          <LinearGradient id="remDialGlow" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor="#FFFFFF" stopOpacity={0.95} />
            <Stop offset="100%" stopColor="#F8F6EF" stopOpacity={0.9} />
          </LinearGradient>
        </Defs>

        {/* 1. Motion Dash Loop in Background */}
        <Path
          d="M 14 115 C 2 75, 30 30, 78 18"
          stroke="#D4CCA8"
          strokeWidth={1.2}
          strokeDasharray="3 4"
          opacity={0.6}
          strokeLinecap="round"
        />

        {/* 2. Sparkle Star (Top Left) */}
        <G transform="translate(16, 18)" opacity={0.85}>
          <Path
            d="M 8 0 Q 8 8, 16 8 Q 8 8, 8 16 Q 8 8, 0 8 Q 8 8, 8 0 Z"
            fill="url(#remDoodleGold)"
          />
        </G>

        {/* 3. Sparkle Star (Top Right) */}
        <G transform="translate(114, 26)" opacity={0.75}>
          <Path
            d="M 6 0 Q 6 6, 12 6 Q 6 6, 6 12 Q 6 6, 0 6 Q 6 6, 6 0 Z"
            fill="url(#remDoodleGold)"
          />
        </G>

        {/* 4. Mini Diamond Spark (Bottom Left) */}
        <G transform="translate(12, 122)" opacity={0.65}>
          <Path
            d="M 4 0 Q 4 4, 8 4 Q 4 4, 4 8 Q 4 4, 0 4 Q 4 4, 4 0 Z"
            fill="#8383D6"
          />
        </G>

        {/* 5. Tilted Classic Twin-Bell Alarm Clock (rotated ~8 deg) */}
        <G transform="translate(24, 26) rotate(8, 42, 50)">
          {/* Top Handle Arc */}
          <Path
            d="M 28 6 C 28 -2, 56 -2, 56 6"
            stroke="#2A2E39"
            strokeWidth={3}
            strokeLinecap="round"
            fill="none"
          />

          {/* Left Bell */}
          <G transform="translate(10, 4) rotate(-35, 12, 8)">
            <Rect
              x={0}
              y={0}
              width={24}
              height={14}
              rx={7}
              fill="url(#remDoodleGold)"
              stroke="#D99B0F"
              strokeWidth={1.2}
            />
          </G>

          {/* Right Bell */}
          <G transform="translate(50, -10) rotate(35, 12, 8)">
            <Rect
              x={0}
              y={0}
              width={24}
              height={14}
              rx={7}
              fill="url(#remDoodleGold)"
              stroke="#D99B0F"
              strokeWidth={1.2}
            />
          </G>

          {/* Center Hammer */}
          <Circle cx={42} cy={8} r={3} fill="#2A2E39" />

          {/* Left Foot */}
          <Line
            x1={20}
            y1={76}
            x2={14}
            y2={86}
            stroke="#2A2E39"
            strokeWidth={3}
            strokeLinecap="round"
          />

          {/* Right Foot */}
          <Line
            x1={64}
            y1={76}
            x2={70}
            y2={86}
            stroke="#2A2E39"
            strokeWidth={3}
            strokeLinecap="round"
          />

          {/* Clock Outer Rim */}
          <Circle
            cx={42}
            cy={46}
            r={36}
            fill="#2A2E39"
            stroke="#4A4E5C"
            strokeWidth={1.8}
          />

          {/* Clock Inner Gold Ring */}
          <Circle
            cx={42}
            cy={46}
            r={32}
            fill="url(#remDialGlow)"
            stroke="url(#remDoodleGold)"
            strokeWidth={1.6}
          />

          {/* Hour Markers (12, 3, 6, 9) */}
          <Circle cx={42} cy={19} r={1.6} fill="#2A2E39" />
          <Circle cx={69} cy={46} r={1.6} fill="#2A2E39" />
          <Circle cx={42} cy={73} r={1.6} fill="#2A2E39" />
          <Circle cx={15} cy={46} r={1.6} fill="#2A2E39" />

          {/* Hour & Minute Hands (Showing ~10:10 optimal smile pose) */}
          <Line
            x1={42}
            y1={46}
            x2={26}
            y2={32}
            stroke="#2A2E39"
            strokeWidth={2.4}
            strokeLinecap="round"
          />
          <Line
            x1={42}
            y1={46}
            x2={58}
            y2={30}
            stroke="#8383D6"
            strokeWidth={2}
            strokeLinecap="round"
          />
          {/* Second Hand Accent */}
          <Line
            x1={42}
            y1={46}
            x2={42}
            y2={62}
            stroke="#F5C518"
            strokeWidth={1.2}
            strokeLinecap="round"
          />
          {/* Center Pin */}
          <Circle cx={42} cy={46} r={3} fill="#F5C518" />
        </G>

        {/* 6. Acoustic Sound Wave Arcs (Ringing Motion) */}
        <G opacity={0.8}>
          <Path
            d="M 16 38 C 10 46, 10 60, 16 68"
            stroke="url(#remDoodleLavender)"
            strokeWidth={2.2}
            strokeLinecap="round"
            fill="none"
          />
          <Path
            d="M 8 32 C 0 44, 0 66, 8 78"
            stroke="url(#remDoodleLavender)"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeDasharray="3 3"
            fill="none"
          />
          <Path
            d="M 116 42 C 122 50, 122 64, 116 72"
            stroke="url(#remDoodleLavender)"
            strokeWidth={2.2}
            strokeLinecap="round"
            fill="none"
          />
          <Path
            d="M 124 36 C 132 48, 132 70, 124 82"
            stroke="url(#remDoodleLavender)"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeDasharray="3 3"
            fill="none"
          />
        </G>

        {/* 7. Celebratory "ON TIME" Mini Seal */}
        <G transform="translate(86, 92) rotate(-8, 18, 18)">
          <Circle
            cx={18}
            cy={18}
            r={18}
            fill="#FFFFFF"
            stroke="#86EFAC"
            strokeWidth={1.5}
          />
          <Circle
            cx={18}
            cy={18}
            r={15}
            fill="#ECFDF5"
            stroke="#22C55E"
            strokeWidth={1}
            strokeDasharray="2 2"
          />
          <Path
            d="M 11 18 L 16 23 L 26 12"
            stroke="#16A34A"
            strokeWidth={2.4}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </G>
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ReminderWatermarkDoodleSvg;
