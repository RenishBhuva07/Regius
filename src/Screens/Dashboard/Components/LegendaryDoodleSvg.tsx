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
  Polygon,
} from 'react-native-svg';

export interface LegendaryDoodleSvgProps {
  width?: number;
  height?: number;
}

/**
 * Extraordinary Legendary Crown & Triumph Doodle Illustration:
 * - 3D tilted Imperial Regius Crown of Triumph with velvet violet cushion dome
 * - Embedded royal jewels: Emerald diamond, amethyst gems, ruby tear sparks
 * - Golden filigree crown arches, pearl finials & radiant starlight apex
 * - Classical Victory Laurel Wreath flourish curving gracefully at base
 * - Floating 3D faceted diamond gemstone with crystalline refraction
 * - Hand-drawn doodle lightning bolt of electric ambition & energy arcs
 * - Celebratory celestial starbursts, orbital dash rings, and stardust
 * - Custom crafted to accompany: "Make today a little legendary!"
 */
export const LegendaryDoodleSvg: React.FC<LegendaryDoodleSvgProps> = ({
  width = 144,
  height = 152,
}) => {
  return (
    <View style={[styles.container, { width, height }]} pointerEvents="none">
      <Svg width={width} height={height} viewBox="0 0 144 152" fill="none">
        <Defs>
          {/* Ambient Royal Triumph Glow Aura */}
          <RadialGradient id="lgAura" cx="50%" cy="50%" r="50%">
            <Stop offset="0%" stopColor="#F5C518" stopOpacity={0.28} />
            <Stop offset="45%" stopColor="#8383D6" stopOpacity={0.12} />
            <Stop offset="100%" stopColor="#FAF7EF" stopOpacity={0} />
          </RadialGradient>

          {/* Radiant Imperial 24K Gold Gradient */}
          <LinearGradient id="lgGold" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#FFFCE3" />
            <Stop offset="35%" stopColor="#F5C518" />
            <Stop offset="75%" stopColor="#D97706" />
            <Stop offset="100%" stopColor="#92400E" />
          </LinearGradient>

          {/* Beveled Deep Gold for 3D Crown Inner Edges */}
          <LinearGradient id="lgGoldDark" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor="#FBBF24" />
            <Stop offset="50%" stopColor="#D97706" />
            <Stop offset="100%" stopColor="#78350F" />
          </LinearGradient>

          {/* Royal Regius Velvet Cushion Dome */}
          <LinearGradient id="lgVelvet" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor="#4C1D95" />
            <Stop offset="50%" stopColor="#311068" />
            <Stop offset="100%" stopColor="#1E0A40" />
          </LinearGradient>

          {/* Velvet Soft Radial Luster */}
          <RadialGradient id="lgVelvetSheen" cx="50%" cy="30%" r="60%">
            <Stop offset="0%" stopColor="#A78BFA" stopOpacity={0.7} />
            <Stop offset="60%" stopColor="#5B21B6" stopOpacity={0.2} />
            <Stop offset="100%" stopColor="#1E0A40" stopOpacity={0} />
          </RadialGradient>

          {/* Faceted Emerald Gemstone Gradient */}
          <LinearGradient id="lgEmerald" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#A7F3D0" />
            <Stop offset="40%" stopColor="#10B981" />
            <Stop offset="100%" stopColor="#064E3B" />
          </LinearGradient>

          {/* Royal Amethyst Violet Gemstone Gradient */}
          <LinearGradient id="lgAmethyst" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#E9D5FF" />
            <Stop offset="45%" stopColor="#9333EA" />
            <Stop offset="100%" stopColor="#581C87" />
          </LinearGradient>

          {/* Ruby Teardrop Accent */}
          <LinearGradient id="lgRuby" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#FECDD3" />
            <Stop offset="45%" stopColor="#E11D48" />
            <Stop offset="100%" stopColor="#881337" />
          </LinearGradient>

          {/* Crystalline 3D Diamond Gemstone Gradient */}
          <LinearGradient id="lgDiamond" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#FFFFFF" />
            <Stop offset="35%" stopColor="#E0F2FE" />
            <Stop offset="70%" stopColor="#7DD3FC" />
            <Stop offset="100%" stopColor="#0284C7" />
          </LinearGradient>

          {/* Victory Laurel Leaves Sheen */}
          <LinearGradient id="lgLaurel" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#FEF08A" />
            <Stop offset="45%" stopColor="#EAB308" />
            <Stop offset="100%" stopColor="#A16207" />
          </LinearGradient>

          {/* Electric Ambition Lightning Bolt */}
          <LinearGradient id="lgBolt" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#FFFCE3" />
            <Stop offset="50%" stopColor="#FACC15" />
            <Stop offset="100%" stopColor="#EA580C" />
          </LinearGradient>
        </Defs>

        {/* 1. Ambient Royal Aura Glow */}
        <Circle cx={72} cy={76} r={68} fill="url(#lgAura)" />

        {/* 2. Hand-Drawn Cosmic Speed Orbitals */}
        {/* Main curved orbital sweep from bottom-left to upper-right */}
        <Path
          d="M 12 118 C -2 64, 44 18, 98 12"
          stroke="#D4CCA8"
          strokeWidth={1.2}
          strokeDasharray="3 4"
          opacity={0.65}
          strokeLinecap="round"
        />
        {/* Counter orbital arc encircling upper-right quadrant */}
        <Path
          d="M 88 12 C 124 10, 142 36, 134 78"
          stroke="#F5C518"
          strokeWidth={1.2}
          strokeDasharray="2 3"
          opacity={0.75}
          strokeLinecap="round"
        />

        {/* 3. Celestial 4-Point Starbursts (Regius Signature Diamonds) */}
        {/* Top-Left Grand Gold Starburst */}
        <G transform="translate(14, 16)" opacity={0.9}>
          <Path
            d="M 8 0 Q 8 8, 16 8 Q 8 8, 8 16 Q 8 8, 0 8 Q 8 8, 8 0 Z"
            fill="url(#lgGold)"
          />
        </G>
        {/* Upper-Center Mini Diamond Star */}
        <G transform="translate(76, 6)" opacity={0.82}>
          <Path
            d="M 5 0 Q 5 5, 10 5 Q 5 5, 5 10 Q 5 5, 0 5 Q 5 5, 5 0 Z"
            fill="url(#lgGold)"
          />
        </G>
        {/* Bottom-Left Lavender Diamond Star */}
        <G transform="translate(10, 126)" opacity={0.7}>
          <Path
            d="M 5 0 Q 5 5, 10 5 Q 5 5, 5 10 Q 5 5, 0 5 Q 5 5, 5 0 Z"
            fill="#8383D6"
          />
        </G>
        {/* Bottom-Right Emerald Diamond Star */}
        <G transform="translate(126, 124)" opacity={0.75}>
          <Path
            d="M 4.5 0 Q 4.5 4.5, 9 4.5 Q 4.5 4.5, 4.5 9 Q 4.5 4.5, 0 4.5 Q 4.5 4.5, 4.5 0 Z"
            fill="url(#lgEmerald)"
          />
        </G>

        {/* 4. Top-Left Hand-Drawn Doodle Energy Radiance Bursts */}
        <G opacity={0.75}>
          <Line
            x1={10}
            y1={38}
            x2={3}
            y2={34}
            stroke="#D4CCA8"
            strokeWidth={1.5}
            strokeLinecap="round"
          />
          <Line
            x1={14}
            y1={46}
            x2={6}
            y2={48}
            stroke="#F5C518"
            strokeWidth={1.5}
            strokeLinecap="round"
          />
          <Line
            x1={16}
            y1={55}
            x2={10}
            y2={60}
            stroke="#D4CCA8"
            strokeWidth={1.5}
            strokeLinecap="round"
          />
        </G>

        {/* 5. Electric Ambition Lightning Bolt Doodle (Top-Right) */}
        <G transform="translate(116, 32) rotate(14)" opacity={0.95}>
          {/* Subtle drop shadow */}
          <Polygon
            points="7,0 0,9 5,9 1,18 10,8 5,8"
            fill="#000000"
            opacity={0.12}
            transform="translate(1.5, 1.5)"
          />
          {/* Main lightning bolt */}
          <Polygon
            points="7,0 0,9 5,9 1,18 10,8 5,8"
            fill="url(#lgBolt)"
            stroke="#D97706"
            strokeWidth={0.8}
            strokeLinejoin="round"
          />
        </G>

        {/* 6. Floating 3D Faceted Diamond Gemstone (Upper-Right Accent) */}
        <G transform="translate(100, 24) rotate(-12)">
          {/* Diamond Drop Shadow */}
          <Polygon
            points="10,0 20,7 15,20 5,20 0,7"
            fill="#000000"
            opacity={0.1}
            transform="translate(2, 3)"
          />
          {/* Diamond Upper Table / Crown Facets */}
          <Polygon
            points="5,4 15,4 20,9 10,9"
            fill="#E0F2FE"
            stroke="#93C5FD"
            strokeWidth={0.6}
          />
          <Polygon
            points="0,9 5,4 10,9"
            fill="#BAE6FD"
            stroke="#93C5FD"
            strokeWidth={0.6}
          />
          <Polygon
            points="10,9 15,4 20,9"
            fill="#FFFFFF"
            stroke="#93C5FD"
            strokeWidth={0.6}
          />
          {/* Diamond Pavilion Lower Facets */}
          <Polygon
            points="0,9 10,9 10,21"
            fill="#38BDF8"
            stroke="#0284C7"
            strokeWidth={0.6}
          />
          <Polygon
            points="10,9 20,9 10,21"
            fill="#0284C7"
            stroke="#0369A1"
            strokeWidth={0.6}
          />
          <Polygon
            points="5,9 10,9 10,21"
            fill="#7DD3FC"
            stroke="#0284C7"
            strokeWidth={0.5}
          />
          {/* Crystalline Starlight Gleam on Diamond Apex */}
          <Circle cx={10} cy={9} r={1.6} fill="#FFFFFF" />
          <Line
            x1={8}
            y1={9}
            x2={12}
            y2={9}
            stroke="#FFFFFF"
            strokeWidth={1.2}
            strokeLinecap="round"
          />
          <Line
            x1={10}
            y1={7}
            x2={10}
            y2={11}
            stroke="#FFFFFF"
            strokeWidth={1.2}
            strokeLinecap="round"
          />
        </G>

        {/* 7. Golden Victory Laurel Wreath Flourish at Base */}
        <G transform="translate(18, 102)" opacity={0.92}>
          {/* Left Laurel Branch Stem */}
          <Path
            d="M 12 18 C 22 26, 42 28, 54 28"
            stroke="url(#lgGoldDark)"
            strokeWidth={1.4}
            strokeLinecap="round"
            fill="none"
          />
          {/* Right Laurel Branch Stem */}
          <Path
            d="M 54 28 C 66 28, 86 26, 96 18"
            stroke="url(#lgGoldDark)"
            strokeWidth={1.4}
            strokeLinecap="round"
            fill="none"
          />
          {/* Left Leaves */}
          <Path
            d="M 16 18 C 12 12, 18 8, 22 14 C 20 18, 18 19, 16 18 Z"
            fill="url(#lgLaurel)"
            stroke="#B45309"
            strokeWidth={0.6}
          />
          <Path
            d="M 28 22 C 26 14, 34 11, 37 18 C 34 22, 31 23, 28 22 Z"
            fill="url(#lgLaurel)"
            stroke="#B45309"
            strokeWidth={0.6}
          />
          <Path
            d="M 42 25 C 41 18, 48 16, 51 22 C 48 26, 45 26, 42 25 Z"
            fill="url(#lgLaurel)"
            stroke="#B45309"
            strokeWidth={0.6}
          />
          {/* Right Leaves */}
          <Path
            d="M 92 18 C 96 12, 90 8, 86 14 C 88 18, 90 19, 92 18 Z"
            fill="url(#lgLaurel)"
            stroke="#B45309"
            strokeWidth={0.6}
          />
          <Path
            d="M 80 22 C 82 14, 74 11, 71 18 C 74 22, 77 23, 80 22 Z"
            fill="url(#lgLaurel)"
            stroke="#B45309"
            strokeWidth={0.6}
          />
          <Path
            d="M 66 25 C 67 18, 60 16, 57 22 C 60 26, 63 26, 66 25 Z"
            fill="url(#lgLaurel)"
            stroke="#B45309"
            strokeWidth={0.6}
          />
          {/* Center Laurel Tie Bow / Knot */}
          <Circle cx={54} cy={28} r={2.8} fill="url(#lgGold)" />
          <Circle cx={54} cy={28} r={1.2} fill="#FFFCE3" />
        </G>

        {/* 8. The 3D Tilted Imperial Regius Crown of Triumph */}
        <G transform="translate(24, 30) rotate(5, 48, 50)">
          {/* Soft Ground Shadow underneath the crown */}
          <Path
            d="M 6 82 C 22 92, 74 92, 90 82 C 74 76, 22 76, 6 82 Z"
            fill="#000000"
            opacity={0.12}
          />

          {/* Royal Purple Velvet Cushion Dome (Inside Crown) */}
          <Path
            d="M 18 64 C 16 38, 30 22, 48 20 C 66 22, 80 38, 78 64 Z"
            fill="url(#lgVelvet)"
            stroke="#1E0A40"
            strokeWidth={1}
          />
          {/* Velvet Cushion Radial Sheen */}
          <Path
            d="M 22 62 C 20 40, 32 24, 48 22 C 64 24, 76 40, 74 62 Z"
            fill="url(#lgVelvetSheen)"
          />
          {/* Velvet Cushion Quilted Stitch Lines */}
          <Path
            d="M 32 64 C 34 44, 40 32, 48 21"
            stroke="#A78BFA"
            strokeWidth={0.7}
            strokeDasharray="2 3"
            opacity={0.5}
            fill="none"
          />
          <Path
            d="M 64 64 C 62 44, 56 32, 48 21"
            stroke="#A78BFA"
            strokeWidth={0.7}
            strokeDasharray="2 3"
            opacity={0.5}
            fill="none"
          />

          {/* Back Arches of the Imperial Crown */}
          <Path
            d="M 22 56 C 24 32, 40 24, 48 23 C 56 24, 72 32, 74 56"
            stroke="url(#lgGoldDark)"
            strokeWidth={3}
            strokeLinecap="round"
            fill="none"
          />

          {/* Center Finial Monogram Orb & Star Cross on Top Peak */}
          <Circle cx={48} cy={16} r={4.5} fill="url(#lgGold)" />
          <Circle cx={48} cy={16} r={2.2} fill="#FFFCE3" />
          {/* 4-Point Starlight Apex on Crown Peak */}
          <Path
            d="M 48 7 Q 48 11, 52 11 Q 48 11, 48 15 Q 48 11, 44 11 Q 48 11, 48 7 Z"
            fill="#FFFCE3"
          />
          <Circle cx={48} cy={11} r={1.2} fill="#F5C518" />

          {/* Crown Filigree Body (Main Front Gold Arches & Peaks) */}
          {/* Left Wing Flared Horn Peak */}
          <Path
            d="M 10 64 L 14 36 L 24 50 L 32 32 L 40 48 L 48 24 L 56 48 L 64 32 L 72 50 L 82 36 L 86 64 Z"
            fill="url(#lgGold)"
            stroke="#78350F"
            strokeWidth={1.2}
            strokeLinejoin="round"
          />

          {/* Inner Highlight Filigree Curves */}
          <Path
            d="M 16 42 L 24 52 L 32 38 L 40 50 L 48 29 L 56 50 L 64 38 L 72 52 L 80 42"
            stroke="#FFFCE3"
            strokeWidth={1}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            opacity={0.8}
          />

          {/* Pearl Finials on Peak Tips */}
          {/* Peak 1 (Leftmost) */}
          <Circle cx={14} cy={36} r={2.4} fill="#FFFCE3" />
          <Circle cx={14} cy={36} r={1.2} fill="#F5C518" />
          {/* Peak 2 */}
          <Circle cx={32} cy={32} r={2.8} fill="#FFFCE3" />
          <Circle cx={32} cy={32} r={1.4} fill="#F5C518" />
          {/* Peak 4 */}
          <Circle cx={64} cy={32} r={2.8} fill="#FFFCE3" />
          <Circle cx={64} cy={32} r={1.4} fill="#F5C518" />
          {/* Peak 5 (Rightmost) */}
          <Circle cx={82} cy={36} r={2.4} fill="#FFFCE3" />
          <Circle cx={82} cy={36} r={1.2} fill="#F5C518" />

          {/* Lower Crown Circlet Headband (Rich Embossed Gold Band) */}
          <Path
            d="M 8 62 C 26 72, 70 72, 88 62 L 88 74 C 70 84, 26 84, 8 74 Z"
            fill="url(#lgGold)"
            stroke="#78350F"
            strokeWidth={1.2}
          />

          {/* Band Upper & Lower Trim Bevels */}
          <Path
            d="M 8 62 C 26 72, 70 72, 88 62"
            stroke="#FFFCE3"
            strokeWidth={1.2}
            fill="none"
          />
          <Path
            d="M 8 74 C 26 84, 70 84, 88 74"
            stroke="#78350F"
            strokeWidth={1.2}
            fill="none"
          />

          {/* Royal Jewels Embedded in the Crown Headband */}
          {/* Center Crown Jewel: Faceted Imperial Emerald Diamond */}
          <G transform="translate(48, 71)">
            {/* Setting bezel */}
            <Polygon
              points="0,-5 5,0 0,5 -5,0"
              fill="#78350F"
              stroke="#FFFCE3"
              strokeWidth={0.6}
            />
            {/* Gem facet */}
            <Polygon
              points="0,-4.2 4.2,0 0,4.2 -4.2,0"
              fill="url(#lgEmerald)"
            />
            {/* Center sparkle */}
            <Circle cx={0} cy={0} r={1.2} fill="#A7F3D0" />
          </G>

          {/* Left Jewel 1: Amethyst Cabochon */}
          <G transform="translate(32, 69)">
            <Circle
              cx={0}
              cy={0}
              r={3.6}
              fill="#581C87"
              stroke="#FFFCE3"
              strokeWidth={0.6}
            />
            <Circle cx={0} cy={0} r={2.8} fill="url(#lgAmethyst)" />
            <Circle cx={-0.8} cy={-0.8} r={1} fill="#E9D5FF" />
          </G>

          {/* Right Jewel 1: Amethyst Cabochon */}
          <G transform="translate(64, 69)">
            <Circle
              cx={0}
              cy={0}
              r={3.6}
              fill="#581C87"
              stroke="#FFFCE3"
              strokeWidth={0.6}
            />
            <Circle cx={0} cy={0} r={2.8} fill="url(#lgAmethyst)" />
            <Circle cx={-0.8} cy={-0.8} r={1} fill="#E9D5FF" />
          </G>

          {/* Left Jewel 2: Ruby Teardrop Spark */}
          <G transform="translate(18, 66)">
            <Circle
              cx={0}
              cy={0}
              r={2.6}
              fill="url(#lgRuby)"
              stroke="#881337"
              strokeWidth={0.5}
            />
            <Circle cx={-0.6} cy={-0.6} r={0.8} fill="#FECDD3" />
          </G>

          {/* Right Jewel 2: Ruby Teardrop Spark */}
          <G transform="translate(78, 66)">
            <Circle
              cx={0}
              cy={0}
              r={2.6}
              fill="url(#lgRuby)"
              stroke="#881337"
              strokeWidth={0.5}
            />
            <Circle cx={-0.6} cy={-0.6} r={0.8} fill="#FECDD3" />
          </G>

          {/* Ermine/Pearl Dots along Lower Band Rim */}
          {[16, 26, 38, 58, 70, 80].map((x, idx) => (
            <Circle
              key={`pearl-${idx}`}
              cx={x}
              cy={idx < 3 ? 72 + idx * 0.8 : 74 - (idx - 3) * 0.8}
              r={1.2}
              fill="#FFFCE3"
              stroke="#D97706"
              strokeWidth={0.4}
            />
          ))}
        </G>

        {/* 9. Hand-Drawn Doodle Celebration Energy Arcs & Spirals */}
        {/* Playful flourish loop-de-loop at bottom-center */}
        <Path
          d="M 28 138 C 42 144, 48 132, 40 128 C 32 124, 28 136, 46 140 C 60 144, 76 138, 88 142"
          stroke="#D4CCA8"
          strokeWidth={1.3}
          strokeLinecap="round"
          fill="none"
          opacity={0.7}
        />

        {/* Speed / Energy Arcs around Crown Apex */}
        <Path
          d="M 52 18 C 58 14, 68 14, 74 18"
          stroke="#F5C518"
          strokeWidth={1.4}
          strokeLinecap="round"
          fill="none"
          opacity={0.8}
        />
        <Path
          d="M 56 12 C 60 8, 66 8, 70 12"
          stroke="#F5C518"
          strokeWidth={1.2}
          strokeLinecap="round"
          fill="none"
          opacity={0.65}
        />

        {/* 10. Ambient Stardust Micro-Dots */}
        <Circle cx={22} cy={78} r={1.2} fill="#F5C518" opacity={0.6} />
        <Circle cx={26} cy={92} r={1} fill="#8383D6" opacity={0.7} />
        <Circle cx={122} cy={96} r={1.2} fill="#F5C518" opacity={0.6} />
        <Circle cx={128} cy={108} r={1} fill="#10B981" opacity={0.7} />
        <Circle cx={136} cy={66} r={1.4} fill="#F5C518" opacity={0.7} />
        <Circle cx={36} cy={12} r={1.1} fill="#F5C518" opacity={0.5} />
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

export default LegendaryDoodleSvg;
