import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, {
  Defs,
  LinearGradient,
  RadialGradient,
  Stop,
  Rect,
  Circle,
} from 'react-native-svg';

export interface ScheduleButtonBackgroundSvgProps {
  type: 'date' | 'time';
  idPrefix?: string;
}

export const ScheduleButtonBackgroundSvg: React.FC<ScheduleButtonBackgroundSvgProps> =
  React.memo(({ type, idPrefix = 'sched' }) => {
    const isDate = type === 'date';
    const auraColor = isDate ? '#F5C518' : '#9C9CE3';
    const auraOpacity = isDate ? 0.22 : 0.26;
    const bgGradId = `${idPrefix}-bgGrad-${type}`;
    const auraId = `${idPrefix}-aura-${type}`;

    return (
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <Svg
          width="100%"
          height="100%"
          viewBox="0 0 170 64"
          preserveAspectRatio="none"
          fill="none"
        >
          <Defs>
            <LinearGradient id={bgGradId} x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor="#252733" stopOpacity={0.96} />
              <Stop offset="50%" stopColor="#1B1D26" stopOpacity={0.92} />
              <Stop offset="100%" stopColor="#131419" stopOpacity={0.98} />
            </LinearGradient>

            <RadialGradient id={auraId} cx="85%" cy="25%" rx="55%" ry="75%">
              <Stop
                offset="0%"
                stopColor={auraColor}
                stopOpacity={auraOpacity}
              />
              <Stop offset="50%" stopColor={auraColor} stopOpacity={0.06} />
              <Stop offset="100%" stopColor="#131419" stopOpacity={0} />
            </RadialGradient>
          </Defs>

          <Rect width="100%" height="100%" fill={`url(#${bgGradId})`} />
          <Rect width="100%" height="100%" fill={`url(#${auraId})`} />

          <Circle
            cx={145}
            cy={18}
            r={28}
            stroke={
              isDate ? 'rgba(245, 197, 24, 0.16)' : 'rgba(156, 156, 227, 0.18)'
            }
            strokeWidth={1}
            fill="none"
          />
          <Circle
            cx={145}
            cy={18}
            r={42}
            stroke={
              isDate ? 'rgba(245, 197, 24, 0.08)' : 'rgba(156, 156, 227, 0.1)'
            }
            strokeWidth={0.8}
            strokeDasharray="3 4"
            fill="none"
          />

          <Circle
            cx={130}
            cy={10}
            r={1.2}
            fill={isDate ? '#FFF8D0' : '#E0E0FF'}
            opacity={0.7}
          />
          <Circle
            cx={155}
            cy={32}
            r={1}
            fill={isDate ? '#F5C518' : '#9C9CE3'}
            opacity={0.55}
          />
        </Svg>
      </View>
    );
  });

export default ScheduleButtonBackgroundSvg;
