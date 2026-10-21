import React from 'react';
import { View, StyleSheet } from 'react-native';
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

export interface HabitNotesDoodleSvgProps {
  width?: number;
  height?: number;
}

/**
 * Extraordinary Habit Notes Doodle Illustration:
 * - 3D tilted luxury obsidian journal with gold corner brackets & wire-O rings
 * - Silky emerald ribbon bookmark draped down parchment pages
 * - Active habit checklist with completed emerald checkmark & radiant streak flame
 * - Golden fountain pen actively writing calligraphic cursive notes
 * - Day 21 streak seal badge with outer orbital rings
 * - Celestial time orbits, 4-point diamond starbursts & celebratory doodle arcs
 * - Custom crafted to accompany: "Your future self is taking notes!"
 */
export const HabitNotesDoodleSvg: React.FC<HabitNotesDoodleSvgProps> = ({
  width = 142,
  height = 150,
}) => {
  return (
    <View style={[styles.container, { width, height }]} pointerEvents="none">
      <Svg width={width} height={height} viewBox="0 0 142 150" fill="none">
        <Defs>
          {/* Midnight Obsidian Leather Journal Gradient */}
          <LinearGradient id="hbLeather" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#2D3342" />
            <Stop offset="55%" stopColor="#1B1E28" />
            <Stop offset="100%" stopColor="#10121A" />
          </LinearGradient>

          {/* Warm Luxury Parchment Paper Sheen */}
          <LinearGradient id="hbPaper" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor="#FFFFFF" stopOpacity={0.98} />
            <Stop offset="100%" stopColor="#FAF6ED" stopOpacity={0.94} />
          </LinearGradient>

          {/* Radiant Celebration Gold */}
          <LinearGradient id="hbGold" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#FFFCE3" />
            <Stop offset="40%" stopColor="#F5C518" />
            <Stop offset="100%" stopColor="#D99B0F" />
          </LinearGradient>

          {/* Deep Metallic Gold for Pen Accents */}
          <LinearGradient id="hbPenMetal" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#FFFCE3" />
            <Stop offset="45%" stopColor="#EAB308" />
            <Stop offset="100%" stopColor="#A16207" />
          </LinearGradient>

          {/* Polished Obsidian Pen Barrel */}
          <LinearGradient id="hbPenBody" x1="0%" y1="0%" x2="100%" y2="0%">
            <Stop offset="0%" stopColor="#1A1D27" />
            <Stop offset="45%" stopColor="#2E364A" />
            <Stop offset="100%" stopColor="#141722" />
          </LinearGradient>

          {/* Emerald Vitality Ribbon & Check */}
          <LinearGradient id="hbEmerald" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#86EFAC" />
            <Stop offset="50%" stopColor="#10B981" />
            <Stop offset="100%" stopColor="#047857" />
          </LinearGradient>

          {/* Streak Flame Gradient */}
          <LinearGradient id="hbFlame" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#FDE047" />
            <Stop offset="45%" stopColor="#F97316" />
            <Stop offset="100%" stopColor="#EA580C" />
          </LinearGradient>

          {/* Ambient Future Celestial Glow */}
          <RadialGradient id="hbCelestialGlow" cx="50%" cy="50%" r="50%">
            <Stop offset="0%" stopColor="#F5C518" stopOpacity={0.25} />
            <Stop offset="60%" stopColor="#10B981" stopOpacity={0.08} />
            <Stop offset="100%" stopColor="#FAF7EF" stopOpacity={0} />
          </RadialGradient>
        </Defs>

        {/* 1. Ambient Celestial Glow Aura */}
        <Circle cx={70} cy={75} r={65} fill="url(#hbCelestialGlow)" />

        {/* 2. Future Celestial Motion Orbitals */}
        <Path
          d="M 12 118 C -4 68, 38 22, 90 14"
          stroke="#D4CCA8"
          strokeWidth={1.2}
          strokeDasharray="3 4"
          opacity={0.65}
          strokeLinecap="round"
        />
        <Path
          d="M 82 14 C 114 8, 138 28, 132 64"
          stroke="#F5C518"
          strokeWidth={1.2}
          strokeDasharray="2 3"
          opacity={0.7}
          strokeLinecap="round"
        />

        {/* 3. 4-Point Starlight Sparkles (Celestial Diamond Stars) */}
        {/* Top-Left Gold Sparkle */}
        <G transform="translate(14, 14)" opacity={0.88}>
          <Path
            d="M 7 0 Q 7 7, 14 7 Q 7 7, 7 14 Q 7 7, 0 7 Q 7 7, 7 0 Z"
            fill="url(#hbGold)"
          />
        </G>
        {/* Top-Right Emerald Sparkle */}
        <G transform="translate(122, 18)" opacity={0.8}>
          <Path
            d="M 6 0 Q 6 6, 12 6 Q 6 6, 6 12 Q 6 6, 0 6 Q 6 6, 6 0 Z"
            fill="url(#hbEmerald)"
          />
        </G>
        {/* Bottom-Left Lavender Diamond */}
        <G transform="translate(10, 124)" opacity={0.65}>
          <Path
            d="M 5 0 Q 5 5, 10 5 Q 5 5, 5 10 Q 5 5, 0 5 Q 5 5, 5 0 Z"
            fill="#8383D6"
          />
        </G>
        {/* Mid-Left Gold Micro Spark */}
        <G transform="translate(26, 4)" opacity={0.7}>
          <Path
            d="M 3.5 0 Q 3.5 3.5, 7 3.5 Q 3.5 3.5, 3.5 7 Q 3.5 3.5, 0 3.5 Q 3.5 3.5, 3.5 0 Z"
            fill="url(#hbGold)"
          />
        </G>

        {/* 4. The 3D Tilted "Taking Notes" Journal / Notebook */}
        <G transform="translate(18, 18) rotate(7, 44, 58)">
          {/* Soft Ground Shadow */}
          <Rect
            x={4}
            y={6}
            width={76}
            height={96}
            rx={12}
            fill="#000000"
            opacity={0.09}
          />

          {/* Midnight Obsidian Hardcover Base */}
          <Rect
            x={0}
            y={0}
            width={76}
            height={96}
            rx={12}
            fill="url(#hbLeather)"
            stroke="#3E4456"
            strokeWidth={1.4}
          />

          {/* Gold Filigree Corner Brackets */}
          <Path
            d="M 0 14 L 0 0 L 14 0"
            stroke="url(#hbGold)"
            strokeWidth={2.4}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Path
            d="M 0 82 L 0 96 L 14 96"
            stroke="url(#hbGold)"
            strokeWidth={2.4}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Path
            d="M 62 96 L 76 96 L 76 82"
            stroke="url(#hbGold)"
            strokeWidth={2.4}
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Sub-page Thickness Edge (Isometric Layer) */}
          <Rect
            x={5}
            y={3}
            width={69}
            height={90}
            rx={9}
            fill="#F3EBE0"
            stroke="#D8CFBE"
            strokeWidth={1}
          />

          {/* Primary Parchment Note Page */}
          <Rect
            x={3}
            y={2}
            width={69}
            height={90}
            rx={9}
            fill="url(#hbPaper)"
            stroke="#DFD7C7"
            strokeWidth={1.2}
          />

          {/* Wire-O Spiral Binder Rings (Gold Wire punching through paper) */}
          {[16, 29, 42, 55].map(x => (
            <G key={`spiral-${x}`}>
              {/* Binder punch hole */}
              <Circle cx={x} cy={5} r={2} fill="#1E222E" />
              {/* Golden Wire Ring Loop */}
              <Path
                d={`M ${x - 2} 5 C ${x - 2} -4, ${x + 2} -4, ${x + 2} 5`}
                stroke="url(#hbGold)"
                strokeWidth={1.4}
                strokeLinecap="round"
                fill="none"
              />
            </G>
          ))}

          {/* Silky Emerald Ribbon Bookmark draping across the notebook */}
          <Path
            d="M 44 -2 L 44 94 L 48.5 90 L 53 94 L 53 -2 Z"
            fill="url(#hbEmerald)"
            opacity={0.9}
          />
          {/* Ribbon inner highlight */}
          <Line
            x1={48.5}
            y1={-2}
            x2={48.5}
            y2={90}
            stroke="#A7F3D0"
            strokeWidth={0.8}
            opacity={0.6}
          />

          {/* Page Header: Mini Daily Rituals Title Bar */}
          <G transform="translate(10, 12)">
            <Path
              d="M 2 4 C 1 2, 2 0, 4 0 C 6 2, 5 3, 7 4 C 8 5, 8 7, 6 8 C 4 8, 4 8, 2 7 Z"
              fill="url(#hbGold)"
            />
            <Line
              x1={10}
              y1={4}
              x2={32}
              y2={4}
              stroke="#D4CCA8"
              strokeWidth={1.2}
              strokeLinecap="round"
            />
          </G>

          {/* Row 1: Habit 1 (Completed with Emerald Checkmark) */}
          <G transform="translate(10, 24)">
            {/* Checked Box */}
            <Rect
              x={0}
              y={0}
              width={13}
              height={13}
              rx={3.5}
              fill="#ECFDF5"
              stroke="#86EFAC"
              strokeWidth={1.2}
            />
            {/* Checkmark */}
            <Path
              d="M 3 6.5 L 5.5 9 L 10 3.5"
              stroke="#10B981"
              strokeWidth={1.8}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Habit Title Line */}
            <Line
              x1={17}
              y1={6.5}
              x2={56}
              y2={6.5}
              stroke="#9CA3AF"
              strokeWidth={1.5}
              strokeLinecap="round"
            />
          </G>

          {/* Row 2: Habit 2 (Completed with Radiant Streak Flame) */}
          <G transform="translate(10, 43)">
            {/* Checked Box */}
            <Rect
              x={0}
              y={0}
              width={13}
              height={13}
              rx={3.5}
              fill="#FFFBEB"
              stroke="#FDE047"
              strokeWidth={1.2}
            />
            {/* Mini Streak Flame Icon */}
            <Path
              d="M 6.5 1.5 C 5 3.5 4 4.5 5 6 C 5.5 5.5 6 5.5 6.5 6 C 6.5 4.5 7.5 3.5 8.5 2 C 8.5 4 9.5 5 9.5 7 C 9.5 9 8 11 6.5 11 C 4.5 11 3.5 9.5 3.5 7.5 C 3.5 5.5 5 3.5 6.5 1.5 Z"
              fill="url(#hbFlame)"
            />
            {/* Habit Title Line */}
            <Line
              x1={17}
              y1={6.5}
              x2={50}
              y2={6.5}
              stroke="#9CA3AF"
              strokeWidth={1.5}
              strokeLinecap="round"
            />
          </G>

          {/* Row 3: Habit 3 (Active Note Taking with Gold Highlight & Cursive Scribble) */}
          <G transform="translate(10, 62)">
            {/* Active Task Box */}
            <Rect
              x={0}
              y={0}
              width={13}
              height={13}
              rx={3.5}
              fill="#FEF9C3"
              stroke="#FDE047"
              strokeWidth={1.2}
            />
            {/* Active Gold Indicator Dot */}
            <Circle cx={6.5} cy={6.5} r={2.2} fill="#CA8A04" />

            {/* Handwritten cursive note taking scribble */}
            <Path
              d="M 17 6 Q 21 3 25 6 T 33 6 T 41 6 T 49 5 T 57 6"
              stroke="#CA8A04"
              strokeWidth={1.6}
              strokeLinecap="round"
              fill="none"
            />
          </G>

          {/* Row 4: Future Notes Dashed Preview Line */}
          <G transform="translate(10, 80)">
            <Line
              x1={0}
              y1={3}
              x2={40}
              y2={3}
              stroke="#D5CEBC"
              strokeWidth={1.2}
              strokeDasharray="3 3"
              strokeLinecap="round"
            />
          </G>
        </G>

        {/* 5. The Floating Golden Fountain Pen / Magic Stylus (Actively Writing) */}
        <G transform="translate(86, 92) rotate(-38)">
          {/* Shadow under pen */}
          <Path
            d="M 2 12 L 2 52"
            stroke="#000000"
            strokeWidth={4}
            strokeLinecap="round"
            opacity={0.12}
          />

          {/* Golden Fountain Pen Nib */}
          <Path
            d="M 0 0 L -4.5 11 L 4.5 11 Z"
            fill="url(#hbPenMetal)"
            stroke="#854D0E"
            strokeWidth={0.6}
          />
          {/* Nib Ink Slit & Breather Hole */}
          <Line
            x1={0}
            y1={0}
            x2={0}
            y2={7}
            stroke="#1E2330"
            strokeWidth={0.8}
            strokeLinecap="round"
          />
          <Circle cx={0} cy={7} r={1} fill="#1E2330" />

          {/* Polished Gold Nib Collar */}
          <Rect
            x={-5}
            y={11}
            width={10}
            height={3.5}
            rx={1}
            fill="url(#hbGold)"
            stroke="#B48216"
            strokeWidth={0.5}
          />

          {/* Obsidian Metallic Barrel Body */}
          <Path
            d="M -5 14.5 L -6 45 L 6 45 L 5 14.5 Z"
            fill="url(#hbPenBody)"
            stroke="#3C4459"
            strokeWidth={0.8}
          />

          {/* Pen Center Gold Accent Ring */}
          <Rect
            x={-6}
            y={28}
            width={12}
            height={3.5}
            rx={1}
            fill="url(#hbGold)"
          />

          {/* Pen Cap Finial Dome */}
          <Path
            d="M -5 45 Q 0 50 5 45 Z"
            fill="url(#hbPenMetal)"
            stroke="#B48216"
            strokeWidth={0.5}
          />

          {/* Polished Gold Pocket Clip */}
          <Path
            d="M 5.5 30 L 7.5 30 L 7.5 44 L 5.5 44"
            stroke="url(#hbGold)"
            strokeWidth={1.3}
            strokeLinecap="round"
            fill="none"
          />

          {/* Active Ink Flow Spark at Nib Tip */}
          <Circle cx={0} cy={-1} r={2.2} fill="#F5C518" opacity={0.9} />
          <Circle cx={0} cy={-1} r={1.2} fill="#FFFFFF" />
        </G>

        {/* 6. Dynamic Day 21 Streak Seal Badge (Bottom-Right Overlap) */}
        <G transform="translate(80, 88)">
          {/* Outer Dashed Orbit */}
          <Circle
            cx={22}
            cy={22}
            r={23}
            stroke="#EAB308"
            strokeWidth={1.1}
            strokeDasharray="2.5 3.5"
            opacity={0.75}
          />

          {/* Dark Luxury Seal Body */}
          <Circle
            cx={22}
            cy={22}
            r={19}
            fill="#181B24"
            stroke="url(#hbGold)"
            strokeWidth={1.8}
          />

          {/* Bold Streak Flame inside seal */}
          <Path
            d="M 22 10 C 18 15 15 18 17 22 C 18 21 19 21 20 22 C 20 19 22 17 24 14 C 25 17 27 19 27 23 C 27 27 24 30 22 30 C 18.5 30 16.5 27.5 16.5 24 C 16.5 20.5 19 16.5 22 10 Z"
            fill="url(#hbFlame)"
          />

          {/* Seal Spark Crown */}
          <Circle cx={33} cy={13} r={1.6} fill="#F5C518" />
        </G>

        {/* 7. Celebration Confetti Dots & Energy Radiance */}
        <Circle cx={106} cy={12} r={2.2} fill="#10B981" opacity={0.75} />
        <Circle cx={134} cy={56} r={2.4} fill="#F5C518" opacity={0.7} />
        <Circle cx={124} cy={126} r={1.8} fill="#8383D6" opacity={0.6} />
        <Circle cx={24} cy={8} r={1.8} fill="#F97316" opacity={0.65} />
        <Circle cx={8} cy={66} r={1.6} fill="#34D399" opacity={0.5} />

        {/* 8. Hand-Drawn Doodle Energy Arcs (Speed & Focus Arcs) */}
        <Path
          d="M 118 72 Q 126 78 124 88"
          stroke="#C8BE9E"
          strokeWidth={1.4}
          strokeLinecap="round"
          opacity={0.6}
        />
        <Path
          d="M 126 68 Q 135 76 132 89"
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

export default HabitNotesDoodleSvg;
