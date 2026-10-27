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

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export interface ReminderSectionBackgroundSvgProps {
  width?: number;
  height?: number;
}

// Background pattern for the Reminders section.
export const ReminderSectionBackgroundSvg: React.FC<ReminderSectionBackgroundSvgProps> =
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

    const remDiamond = (cx: number, cy: number, s: number) =>
      `M ${cx} ${cy - s} Q ${cx} ${cy}, ${cx + s} ${cy} Q ${cx} ${cy}, ${cx} ${
        cy + s
      } Q ${cx} ${cy}, ${cx - s} ${cy} Q ${cx} ${cy}, ${cx} ${cy - s} Z`;

    return (
      <View
        style={styles.container}
        onLayout={handleLayout}
        pointerEvents="none"
      >
        <Svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} fill="none">
          <Defs>
            <LinearGradient
              id="remBgSheen"
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
            <RadialGradient
              id="remCrestAura"
              cx={centerX}
              cy={0}
              r={175}
              gradientUnits="userSpaceOnUse"
            >
              <Stop offset="0%" stopColor="#F5C518" stopOpacity={0.24} />
              <Stop offset="45%" stopColor="#DEAA14" stopOpacity={0.08} />
              <Stop offset="100%" stopColor="#FAF7EF" stopOpacity={0} />
            </RadialGradient>
            <RadialGradient
              id="remPlusAura"
              cx={W - 37}
              cy={0}
              r={115}
              gradientUnits="userSpaceOnUse"
            >
              <Stop offset="0%" stopColor="#F5C518" stopOpacity={0.25} />
              <Stop offset="50%" stopColor="#D99B0F" stopOpacity={0.07} />
              <Stop offset="100%" stopColor="#FAF7EF" stopOpacity={0} />
            </RadialGradient>
            <RadialGradient
              id="remLavenderAura"
              cx={24}
              cy={70}
              r={160}
              gradientUnits="userSpaceOnUse"
            >
              <Stop offset="0%" stopColor="#8383D6" stopOpacity={0.16} />
              <Stop offset="50%" stopColor="#9C9CE3" stopOpacity={0.05} />
              <Stop offset="100%" stopColor="#FAF7EF" stopOpacity={0} />
            </RadialGradient>
            <RadialGradient
              id="remMintAura"
              cx={W - 15}
              cy={Math.min(H * 0.45, 340)}
              r={160}
              gradientUnits="userSpaceOnUse"
            >
              <Stop offset="0%" stopColor="#52D22E" stopOpacity={0.12} />
              <Stop offset="55%" stopColor="#1B9A72" stopOpacity={0.03} />
              <Stop offset="100%" stopColor="#F5EFE3" stopOpacity={0} />
            </RadialGradient>
            <RadialGradient
              id="remFooterAura"
              cx={centerX}
              cy={H - 110}
              r={210}
              gradientUnits="userSpaceOnUse"
            >
              <Stop offset="0%" stopColor="#F5C518" stopOpacity={0.18} />
              <Stop offset="48%" stopColor="#E2A612" stopOpacity={0.05} />
              <Stop offset="100%" stopColor="#ECE4D4" stopOpacity={0} />
            </RadialGradient>
            <RadialGradient
              id="remTargetAura"
              cx={W - 40}
              cy={H - 80}
              r={160}
              gradientUnits="userSpaceOnUse"
            >
              <Stop offset="0%" stopColor="#F5C518" stopOpacity={0.18} />
              <Stop offset="50%" stopColor="#DEAA14" stopOpacity={0.05} />
              <Stop offset="100%" stopColor="#ECE4D4" stopOpacity={0} />
            </RadialGradient>
            <LinearGradient
              id="remGoldNode"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <Stop offset="0%" stopColor="#FFFCE3" stopOpacity={0.95} />
              <Stop offset="50%" stopColor="#F5C518" stopOpacity={0.85} />
              <Stop offset="100%" stopColor="#B48216" stopOpacity={0.65} />
            </LinearGradient>
          </Defs>
          <Rect x={0} y={0} width={W} height={H} fill="url(#remBgSheen)" />
          <Rect x={0} y={0} width={W} height={H} fill="url(#remCrestAura)" />
          <Rect x={0} y={0} width={W} height={H} fill="url(#remPlusAura)" />
          <Rect x={0} y={0} width={W} height={H} fill="url(#remLavenderAura)" />
          <Rect x={0} y={0} width={W} height={H} fill="url(#remMintAura)" />
          <Rect x={0} y={0} width={W} height={H} fill="url(#remFooterAura)" />
          <Rect x={0} y={0} width={W} height={H} fill="url(#remTargetAura)" />
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
                  key={`rem-radial-${deg}`}
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
            fill="url(#remGoldNode)"
            opacity={0.5}
          />
          <Circle
            cx={18}
            cy={318}
            r={3}
            fill="url(#remGoldNode)"
            opacity={0.55}
          />
          <Circle
            cx={29}
            cy={458}
            r={2.8}
            fill="url(#remGoldNode)"
            opacity={0.5}
          />
          <Circle
            cx={15}
            cy={598}
            r={2.6}
            fill="url(#remGoldNode)"
            opacity={0.45}
          />
          <Circle
            cx={25}
            cy={H - 38}
            r={3.2}
            fill="url(#remGoldNode)"
            opacity={0.6}
          />
          <G transform={`translate(${W - 68}, 235)`} opacity={0.22}>
            <Path
              d="M 12 0 C 6 0, 3 8, 2 16 L 22 16 C 21 8, 18 0, 12 0 Z"
              stroke="#F5C518"
              strokeWidth={1.2}
              fill="none"
            />
            <Circle cx={12} cy={18} r={2} fill="#8383D6" />
            <Path
              d="M -4 10 C -8 14, -8 20, -4 24"
              stroke="#8383D6"
              strokeWidth={1}
              fill="none"
            />
            <Path
              d="M 28 10 C 32 14, 32 20, 28 24"
              stroke="#8383D6"
              strokeWidth={1}
              fill="none"
            />
          </G>
          <G
            transform={`translate(28, ${Math.min(390, H * 0.48)})`}
            opacity={0.18}
          >
            <Path
              d="M 4 2 L 24 2 L 14 16 L 24 30 L 4 30 L 14 16 Z"
              stroke="#D4CCA8"
              strokeWidth={1.2}
              fill="none"
            />
            <Circle cx={14} cy={16} r={1.5} fill="#F5C518" />
            <Line
              x1={2}
              y1={2}
              x2={26}
              y2={2}
              stroke="#F5C518"
              strokeWidth={1.2}
            />
            <Line
              x1={2}
              y1={30}
              x2={26}
              y2={30}
              stroke="#F5C518"
              strokeWidth={1.2}
            />
          </G>
          <Path d={remDiamond(48, 100, 3.5)} fill="#F5C518" opacity={0.35} />
          <Path d={remDiamond(W - 42, 120, 4)} fill="#8383D6" opacity={0.32} />
          <Path d={remDiamond(W - 84, 180, 3)} fill="#52D22E" opacity={0.3} />
          <Path d={remDiamond(52, 280, 3.2)} fill="#F5C518" opacity={0.28} />
          <Path
            d={remDiamond(W - 36, 360, 4.2)}
            fill="#F5C518"
            opacity={0.34}
          />
          <Path d={remDiamond(40, 520, 3.5)} fill="#8383D6" opacity={0.28} />
          <Path
            d={remDiamond(W - 55, H - 150, 4.5)}
            fill="#F5C518"
            opacity={0.36}
          />
        </Svg>
      </View>
    );
  });

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFill,
  },
});

export default ReminderSectionBackgroundSvg;
