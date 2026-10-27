import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, {
  Defs,
  LinearGradient,
  RadialGradient,
  Stop,
  Rect,
  Circle,
  Path,
  G,
  Line,
} from 'react-native-svg';

export interface PickerAestheticBgProps {
  type: 'date' | 'time';
  width?: number;
  height?: number;
}

export const PickerAestheticBg: React.FC<PickerAestheticBgProps> = React.memo(
  ({ type, width = 400, height = 340 }) => {
    const isDate = type === 'date';
    const W = Math.max(width, 100);
    const H = Math.max(height, 100);

    const diamondStar = (cx: number, cy: number, s: number) =>
      `M ${cx} ${cy - s} Q ${cx} ${cy}, ${cx + s} ${cy} Q ${cx} ${cy}, ${cx} ${
        cy + s
      } Q ${cx} ${cy}, ${cx - s} ${cy} Q ${cx} ${cy}, ${cx} ${cy - s} Z`;

    // 8 Solar Solstice & Equinox dial ticks for Date Picker
    const solarTicks = Array.from({ length: 8 }).map((_, i) => {
      const angle = ((i * 360) / 8) * (Math.PI / 180);
      return (
        <Line
          key={`solar-tick-${i}`}
          x1={340 + 72 * Math.cos(angle)}
          y1={60 + 72 * Math.sin(angle)}
          x2={340 + 84 * Math.cos(angle)}
          y2={60 + 84 * Math.sin(angle)}
          stroke="#D8A21A"
          strokeWidth={1.3}
          strokeLinecap="round"
        />
      );
    });

    // 12 Horological Hour ticks for Time Picker
    const clockHourTicks = Array.from({ length: 12 }).map((_, i) => {
      const angle = ((i * 360) / 12) * (Math.PI / 180);
      const isCardinal = i % 3 === 0;
      const rInner = isCardinal ? 60 : 64;
      const rOuter = 74;
      return (
        <Line
          key={`clock-hour-${i}`}
          x1={330 + rInner * Math.cos(angle)}
          y1={70 + rInner * Math.sin(angle)}
          x2={330 + rOuter * Math.cos(angle)}
          y2={70 + rOuter * Math.sin(angle)}
          stroke={isCardinal ? '#7059C8' : '#8383D6'}
          strokeWidth={isCardinal ? 1.6 : 1.1}
          strokeLinecap="round"
        />
      );
    });

    // 24 Horological Minute ticks for Time Picker
    const clockMinuteTicks = Array.from({ length: 24 }).map((_, i) => {
      const angle = ((i * 360) / 24) * (Math.PI / 180);
      return (
        <Line
          key={`clock-min-${i}`}
          x1={330 + 84 * Math.cos(angle)}
          y1={70 + 84 * Math.sin(angle)}
          x2={330 + 88 * Math.cos(angle)}
          y2={70 + 88 * Math.sin(angle)}
          stroke="#8383D6"
          strokeWidth={0.8}
          strokeOpacity={0.4}
        />
      );
    });

    // 16 Planetary Gear Teeth ticks for Time Picker
    const gearTicks = Array.from({ length: 16 }).map((_, i) => {
      const angle = ((i * 360) / 16) * (Math.PI / 180);
      return (
        <Line
          key={`gear-tick-${i}`}
          x1={50 + 35 * Math.cos(angle)}
          y1={270 + 35 * Math.sin(angle)}
          x2={50 + 43 * Math.cos(angle)}
          y2={270 + 43 * Math.sin(angle)}
          stroke="#7059C8"
          strokeWidth={1.2}
          strokeLinecap="round"
        />
      );
    });

    return (
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <Svg
          width="100%"
          height="100%"
          viewBox={`0 0 ${W} ${H}`}
          preserveAspectRatio="none"
        >
          <Defs>
            <LinearGradient
              id={`pickerSheenGrad-${type}`}
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <Stop offset="0%" stopColor="#FFFFFF" stopOpacity={0.99} />
              <Stop
                offset="55%"
                stopColor={isDate ? '#FCF9F2' : '#F9F8FD'}
                stopOpacity={0.96}
              />
              <Stop
                offset="100%"
                stopColor={isDate ? '#F7F1E4' : '#EFEBF8'}
                stopOpacity={0.98}
              />
            </LinearGradient>
            <RadialGradient
              id={`pickerTopAura-${type}`}
              cx={W - 40}
              cy={50}
              r={150}
              gradientUnits="userSpaceOnUse"
            >
              <Stop
                offset="0%"
                stopColor={isDate ? '#F5C518' : '#8383D6'}
                stopOpacity={isDate ? 0.24 : 0.25}
              />
              <Stop
                offset="50%"
                stopColor={isDate ? '#F5C518' : '#8383D6'}
                stopOpacity={isDate ? 0.06 : 0.07}
              />
              <Stop
                offset="100%"
                stopColor={isDate ? '#F5C518' : '#8383D6'}
                stopOpacity={0}
              />
            </RadialGradient>
            <RadialGradient
              id={`pickerBottomAura-${type}`}
              cx={30}
              cy={H - 40}
              r={130}
              gradientUnits="userSpaceOnUse"
            >
              <Stop
                offset="0%"
                stopColor={isDate ? '#E5A812' : '#7059C8'}
                stopOpacity={isDate ? 0.16 : 0.18}
              />
              <Stop
                offset="50%"
                stopColor={isDate ? '#E5A812' : '#7059C8'}
                stopOpacity={0.04}
              />
              <Stop
                offset="100%"
                stopColor={isDate ? '#E5A812' : '#7059C8'}
                stopOpacity={0}
              />
            </RadialGradient>
          </Defs>
          <Rect
            x="0"
            y="0"
            width={W}
            height={H}
            fill={`url(#pickerSheenGrad-${type})`}
          />
          <Rect
            x="0"
            y="0"
            width={W}
            height={H}
            fill={`url(#pickerTopAura-${type})`}
          />
          <Rect
            x="0"
            y="0"
            width={W}
            height={H}
            fill={`url(#pickerBottomAura-${type})`}
          />
          {isDate && (
            <>
              <G opacity={0.32}>
                <Circle
                  cx={340}
                  cy={60}
                  r={50}
                  stroke="#F5C518"
                  strokeWidth={1}
                  fill="none"
                />
                <Circle
                  cx={340}
                  cy={60}
                  r={72}
                  stroke="#D8A21A"
                  strokeWidth={1}
                  strokeDasharray="4 6"
                  fill="none"
                />
                <Circle
                  cx={340}
                  cy={60}
                  r={110}
                  stroke="#F5C518"
                  strokeWidth={0.8}
                  fill="none"
                />
                <Circle
                  cx={340}
                  cy={60}
                  r={145}
                  stroke="#D8A21A"
                  strokeWidth={0.6}
                  strokeDasharray="3 5"
                  fill="none"
                />
              </G>
              <G opacity={0.38}>{solarTicks}</G>
              <G opacity={0.3}>
                <Circle
                  cx={40}
                  cy={H - 50}
                  r={48}
                  stroke="#D8A21A"
                  strokeWidth={1}
                  strokeDasharray="3 4"
                  fill="none"
                />
                <Circle
                  cx={40}
                  cy={H - 50}
                  r={80}
                  stroke="#F5C518"
                  strokeWidth={0.8}
                  fill="none"
                />
                <Circle
                  cx={40}
                  cy={H - 50}
                  r={115}
                  stroke="#D8A21A"
                  strokeWidth={0.6}
                  strokeDasharray="4 7"
                  fill="none"
                />
              </G>
              <Path d={diamondStar(320, 45, 5)} fill="#E89A14" opacity={0.55} />
              <Path
                d={diamondStar(345, 135, 3.5)}
                fill="#D8A21A"
                opacity={0.45}
              />
              <Path
                d={diamondStar(70, H - 75, 4.5)}
                fill="#F5C518"
                opacity={0.5}
              />
              <Path
                d={diamondStar(120, H - 35, 3)}
                fill="#E89A14"
                opacity={0.4}
              />
              <Circle cx={285} cy={40} r={1.6} fill="#F5C518" opacity={0.6} />
              <Circle cx={365} cy={115} r={1.4} fill="#B48216" opacity={0.45} />
              <Circle
                cx={55}
                cy={H - 110}
                r={1.5}
                fill="#F5C518"
                opacity={0.5}
              />
              <Circle
                cx={145}
                cy={H - 55}
                r={1.3}
                fill="#B48216"
                opacity={0.4}
              />
              <G opacity={0.25}>
                <Line
                  x1={W - 48}
                  y1={16}
                  x2={W - 32}
                  y2={16}
                  stroke="#B48216"
                  strokeWidth={1.2}
                  strokeLinecap="round"
                />
                <Line
                  x1={W - 16}
                  y1={32}
                  x2={W - 16}
                  y2={48}
                  stroke="#B48216"
                  strokeWidth={1.2}
                  strokeLinecap="round"
                />
              </G>
            </>
          )}
          {!isDate && (
            <>
              <G opacity={0.34}>
                <Circle
                  cx={330}
                  cy={70}
                  r={48}
                  stroke="#7059C8"
                  strokeWidth={1}
                  fill="none"
                />
                <Circle
                  cx={330}
                  cy={70}
                  r={64}
                  stroke="#8383D6"
                  strokeWidth={0.8}
                  strokeDasharray="2 3"
                  fill="none"
                />
                <Circle
                  cx={330}
                  cy={70}
                  r={74}
                  stroke="#7059C8"
                  strokeWidth={1.2}
                  fill="none"
                />
                <Circle
                  cx={330}
                  cy={70}
                  r={88}
                  stroke="#8383D6"
                  strokeWidth={0.7}
                  fill="none"
                />
                <Circle
                  cx={330}
                  cy={70}
                  r={125}
                  stroke="#9C9CE3"
                  strokeWidth={0.6}
                  strokeDasharray="4 6"
                  fill="none"
                />
              </G>
              <G opacity={0.4}>{clockHourTicks}</G>
              <G opacity={0.35}>{clockMinuteTicks}</G>
              <Path
                d="M 330 35 A 25 25 0 0 0 355 60 A 30 30 0 0 1 330 35 Z"
                fill="#8383D6"
                opacity={0.35}
              />
              <G opacity={0.32}>
                <Circle
                  cx={50}
                  cy={270}
                  r={35}
                  stroke="#7059C8"
                  strokeWidth={1.2}
                  fill="none"
                />
                <Circle
                  cx={50}
                  cy={270}
                  r={65}
                  stroke="#8383D6"
                  strokeWidth={0.8}
                  strokeDasharray="3 4"
                  fill="none"
                />
                <Circle
                  cx={50}
                  cy={270}
                  r={98}
                  stroke="#9C9CE3"
                  strokeWidth={0.6}
                  fill="none"
                />
              </G>
              <G opacity={0.38}>{gearTicks}</G>
              <Path d={diamondStar(315, 50, 5)} fill="#7059C8" opacity={0.55} />
              <Path
                d={diamondStar(340, 150, 3.5)}
                fill="#9C9CE3"
                opacity={0.45}
              />
              <Path
                d={diamondStar(80, H - 75, 4.5)}
                fill="#8383D6"
                opacity={0.5}
              />
              <Path
                d={diamondStar(130, H - 35, 3)}
                fill="#7059C8"
                opacity={0.4}
              />
              <Circle cx={275} cy={45} r={1.6} fill="#8383D6" opacity={0.6} />
              <Circle cx={360} cy={125} r={1.4} fill="#7059C8" opacity={0.45} />
              <Circle
                cx={65}
                cy={H - 115}
                r={1.5}
                fill="#8383D6"
                opacity={0.5}
              />
              <Circle
                cx={155}
                cy={H - 55}
                r={1.3}
                fill="#7059C8"
                opacity={0.4}
              />
              <G opacity={0.25}>
                <Line
                  x1={W - 48}
                  y1={16}
                  x2={W - 32}
                  y2={16}
                  stroke="#7059C8"
                  strokeWidth={1.2}
                  strokeLinecap="round"
                />
                <Line
                  x1={W - 16}
                  y1={32}
                  x2={W - 16}
                  y2={48}
                  stroke="#7059C8"
                  strokeWidth={1.2}
                  strokeLinecap="round"
                />
              </G>
            </>
          )}
        </Svg>
      </View>
    );
  },
);

export default PickerAestheticBg;
