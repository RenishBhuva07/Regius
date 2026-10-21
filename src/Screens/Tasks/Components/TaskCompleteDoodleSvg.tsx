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

export interface TaskCompleteDoodleSvgProps {
  width?: number;
  height?: number;
}

/**
 * Task Complete Doodle Illustration:
 * - Playful hand-drawn tilted checklist clipboard with completed green/gold checks
 * - Celebratory starbursts, sparkle diamonds, and celebratory motion arcs
 * - 100% DONE orbital checkmark seal
 * - Harmonizes seamlessly alongside "Live it up!"
 */
export const TaskCompleteDoodleSvg: React.FC<TaskCompleteDoodleSvgProps> = ({
  width = 135,
  height = 145,
}) => {
  return (
    <View style={[styles.container, { width, height }]} pointerEvents="none">
      <Svg width={width} height={height} viewBox="0 0 135 145" fill="none">
        <Defs>
          {/* Gold celebration gradient */}
          <LinearGradient id="doodleGold" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#FFFCE3" />
            <Stop offset="40%" stopColor="#F5C518" />
            <Stop offset="100%" stopColor="#D99B0F" />
          </LinearGradient>

          {/* Mint vitality checkmark gradient */}
          <LinearGradient id="doodleMint" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#86EFAC" />
            <Stop offset="50%" stopColor="#22C55E" />
            <Stop offset="100%" stopColor="#15803D" />
          </LinearGradient>

          {/* Subtle paper shadow */}
          <LinearGradient id="paperGlow" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor="#FFFFFF" stopOpacity={0.9} />
            <Stop offset="100%" stopColor="#F9F6EE" stopOpacity={0.8} />
          </LinearGradient>
        </Defs>

        {/* 1. Motion Dash Loop in Background */}
        <Path
          d="M 12 110 C 2 70, 35 30, 80 18"
          stroke="#D4CCA8"
          strokeWidth={1.2}
          strokeDasharray="3 4"
          opacity={0.6}
          strokeLinecap="round"
        />

        {/* 2. Sparkle Star (Top Left) */}
        <G transform="translate(18, 16)" opacity={0.85}>
          <Path
            d="M 8 0 Q 8 8, 16 8 Q 8 8, 8 16 Q 8 8, 0 8 Q 8 8, 8 0 Z"
            fill="url(#doodleGold)"
          />
        </G>

        {/* 3. Sparkle Star (Top Right) */}
        <G transform="translate(112, 28)" opacity={0.75}>
          <Path
            d="M 6 0 Q 6 6, 12 6 Q 6 6, 6 12 Q 6 6, 0 6 Q 6 6, 6 0 Z"
            fill="url(#doodleGold)"
          />
        </G>

        {/* 4. Mini Diamond Spark (Bottom Left) */}
        <G transform="translate(14, 122)" opacity={0.65}>
          <Path
            d="M 4 0 Q 4 4, 8 4 Q 4 4, 4 8 Q 4 4, 0 4 Q 4 4, 4 0 Z"
            fill="#8383D6"
          />
        </G>

        {/* 5. Tilted Completed Checklist Clipboard */}
        <G transform="translate(24, 22) rotate(6, 42, 52)">
          {/* Paper Body */}
          <Rect
            x={0}
            y={0}
            width={74}
            height={94}
            rx={10}
            fill="url(#paperGlow)"
            stroke="#CFC6B2"
            strokeWidth={1.5}
          />

          {/* Top Clip Tab */}
          <Rect
            x={22}
            y={-6}
            width={30}
            height={9}
            rx={3}
            fill="#2A2E39"
            stroke="#4A4E5C"
            strokeWidth={1}
          />
          <Circle cx={37} cy={-1.5} r={1.8} fill="#F5C518" />

          {/* Task 1 Row (Completed with green checkmark) */}
          <G transform="translate(10, 18)">
            {/* Checked Box */}
            <Rect
              x={0}
              y={0}
              width={14}
              height={14}
              rx={4}
              fill="#ECFDF5"
              stroke="#86EFAC"
              strokeWidth={1.2}
            />
            {/* Checkmark */}
            <Path
              d="M 3.5 7 L 6 9.5 L 10.5 4"
              stroke="#16A34A"
              strokeWidth={1.8}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Strikethrough Task Line */}
            <Line
              x1={19}
              y1={7}
              x2={48}
              y2={7}
              stroke="#A8A29E"
              strokeWidth={1.5}
              strokeLinecap="round"
            />
          </G>

          {/* Task 2 Row (Completed with green checkmark) */}
          <G transform="translate(10, 40)">
            <Rect
              x={0}
              y={0}
              width={14}
              height={14}
              rx={4}
              fill="#ECFDF5"
              stroke="#86EFAC"
              strokeWidth={1.2}
            />
            <Path
              d="M 3.5 7 L 6 9.5 L 10.5 4"
              stroke="#16A34A"
              strokeWidth={1.8}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <Line
              x1={19}
              y1={7}
              x2={44}
              y2={7}
              stroke="#A8A29E"
              strokeWidth={1.5}
              strokeLinecap="round"
            />
          </G>

          {/* Task 3 Row (Completed with celebratory gold checkmark) */}
          <G transform="translate(10, 62)">
            <Rect
              x={0}
              y={0}
              width={14}
              height={14}
              rx={4}
              fill="#FEF9C3"
              stroke="#FDE047"
              strokeWidth={1.2}
            />
            <Path
              d="M 3.5 7 L 6 9.5 L 10.5 4"
              stroke="#CA8A04"
              strokeWidth={1.8}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <Line
              x1={19}
              y1={7}
              x2={50}
              y2={7}
              stroke="#A8A29E"
              strokeWidth={1.5}
              strokeLinecap="round"
            />
          </G>
        </G>

        {/* 6. Triumphant Golden Checkmark Flourish overlapping corner */}
        <G transform="translate(72, 82)">
          {/* Golden Seal Circle */}
          <Circle
            cx={22}
            cy={22}
            r={19}
            fill="#1E232E"
            stroke="#F5C518"
            strokeWidth={1.8}
          />
          {/* Dashed outer orbit */}
          <Circle
            cx={22}
            cy={22}
            r={23}
            stroke="#EAB308"
            strokeWidth={1}
            strokeDasharray="2 3"
            opacity={0.7}
          />
          {/* Bold Centered Checkmark */}
          <Path
            d="M 13 22 L 19 28 L 31 15"
            stroke="#22C55E"
            strokeWidth={2.8}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Tiny spark dot */}
          <Circle cx={33} cy={13} r={1.5} fill="#F5C518" />
        </G>

        {/* 7. Celebration Confetti Dots & Arc */}
        <Circle cx={100} cy={14} r={2} fill="#52D22E" opacity={0.7} />
        <Circle cx={124} cy={64} r={2.2} fill="#F5C518" opacity={0.65} />
        <Circle cx={118} cy={124} r={1.8} fill="#8383D6" opacity={0.5} />
        <Circle cx={28} cy={6} r={1.6} fill="#F5C518" opacity={0.55} />

        {/* 8. Hand-drawn Doodle Energy Arcs */}
        <Path
          d="M 112 78 Q 118 84 116 92"
          stroke="#C8BE9E"
          strokeWidth={1.4}
          strokeLinecap="round"
          opacity={0.6}
        />
        <Path
          d="M 120 75 Q 128 82 125 93"
          stroke="#C8BE9E"
          strokeWidth={1.4}
          strokeLinecap="round"
          opacity={0.4}
        />
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

export default TaskCompleteDoodleSvg;
