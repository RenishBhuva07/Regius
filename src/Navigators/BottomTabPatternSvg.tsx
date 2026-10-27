import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, {
  Path,
  Circle,
  Rect,
  G,
  Defs,
  ClipPath,
  LinearGradient,
  RadialGradient,
  Stop,
} from 'react-native-svg';
import { Colors } from '../Assets/StyleUtilities/Colors';

interface BottomTabPatternSvgProps {
  width: number;
  height: number;
  cornerR?: number;
  notchW?: number;
  notchDeep?: number;
  cp?: number;
  borderW?: number;
}

export const BottomTabPatternSvg: React.FC<BottomTabPatternSvgProps> =
  React.memo(
    ({
      width: W,
      height: H,
      cornerR: R = 34,
      notchW: NOTCH_W = 40,
      notchDeep: NOTCH_DEEP = 24,
      cp: CP = 18,
      borderW: BAR_BORDER_W = 4,
    }) => {
      const cx = W / 2;

      const d = [
        `M ${R} 0`,
        `L ${cx - NOTCH_W} 0`,
        // curve down into notch
        `C ${cx - NOTCH_W + CP} 0, ${
          cx - NOTCH_W * 0.55
        } ${NOTCH_DEEP}, ${cx} ${NOTCH_DEEP}`,
        // curve back up out of notch
        `C ${cx + NOTCH_W * 0.55} ${NOTCH_DEEP}, ${cx + NOTCH_W - CP} 0, ${
          cx + NOTCH_W
        } 0`,
        `L ${W - R} 0`,
        `Q ${W} 0, ${W} ${R}`,
        `L ${W} ${H - R}`,
        `Q ${W} ${H}, ${W - R} ${H}`,
        `L ${R} ${H}`,
        `Q 0 ${H}, 0 ${H - R}`,
        `L 0 ${R}`,
        `Q 0 0, ${R} 0 Z`,
      ].join(' ');

      const pad = BAR_BORDER_W;

      // Helper to generate a 4-point diamond star path
      const starPath = (x: number, y: number, s: number): string =>
        `M ${x} ${y - s} Q ${x} ${y}, ${x + s} ${y} Q ${x} ${y}, ${x} ${
          y + s
        } Q ${x} ${y}, ${x - s} ${y} Q ${x} ${y}, ${x} ${y - s} Z`;

      return (
        <View
          style={[
            StyleSheet.absoluteFill,
            {
              top: -pad,
              left: -pad,
              width: W + pad * 2,
              height: H + pad * 2,
            },
          ]}
          pointerEvents="none"
        >
          <Svg
            width={W + pad * 2}
            height={H + pad * 2}
            viewBox={`${-pad} ${-pad} ${W + pad * 2} ${H + pad * 2}`}
            fill="none"
          >
            <Defs>
              <ClipPath id="curvedBarClip">
                <Path d={d} />
              </ClipPath>
              <LinearGradient
                id="barBgGradient"
                x1="0%"
                y1="0%"
                x2="0%"
                y2="100%"
              >
                <Stop offset="0%" stopColor="#9494EC" stopOpacity={1} />
                <Stop offset="35%" stopColor="#8383D6" stopOpacity={1} />
                <Stop offset="100%" stopColor="#6C6CC4" stopOpacity={1} />
              </LinearGradient>
              <RadialGradient
                id="barNotchHalo"
                cx="50%"
                cy="0%"
                rx="38%"
                ry="80%"
              >
                <Stop offset="0%" stopColor="#FFFCE3" stopOpacity={0.32} />
                <Stop offset="45%" stopColor="#F5C518" stopOpacity={0.12} />
                <Stop offset="100%" stopColor="#8383D6" stopOpacity={0} />
              </RadialGradient>
              <RadialGradient
                id="barLeftAura"
                cx="18%"
                cy="50%"
                rx="35%"
                ry="70%"
              >
                <Stop offset="0%" stopColor="#B2B2FF" stopOpacity={0.25} />
                <Stop offset="100%" stopColor="#8383D6" stopOpacity={0} />
              </RadialGradient>
              <RadialGradient
                id="barRightAura"
                cx="82%"
                cy="50%"
                rx="35%"
                ry="70%"
              >
                <Stop offset="0%" stopColor="#F5C518" stopOpacity={0.16} />
                <Stop offset="100%" stopColor="#8383D6" stopOpacity={0} />
              </RadialGradient>
              <LinearGradient id="barTopRim" x1="0%" y1="0%" x2="100%" y2="0%">
                <Stop offset="0%" stopColor="#FFFFFF" stopOpacity={0.06} />
                <Stop offset="50%" stopColor="#FFFFFF" stopOpacity={0.42} />
                <Stop offset="100%" stopColor="#FFFFFF" stopOpacity={0.06} />
              </LinearGradient>
              <LinearGradient
                id="barGoldStar"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <Stop offset="0%" stopColor="#FFFCE3" stopOpacity={0.95} />
                <Stop offset="100%" stopColor="#F5C518" stopOpacity={0.8} />
              </LinearGradient>
            </Defs>
            <G clipPath="url(#curvedBarClip)">
              <Rect
                x={0}
                y={0}
                width={W}
                height={H}
                fill="url(#barBgGradient)"
              />
              <Rect
                x={0}
                y={0}
                width={W}
                height={H}
                fill="url(#barNotchHalo)"
              />
              <Rect x={0} y={0} width={W} height={H} fill="url(#barLeftAura)" />
              <Rect
                x={0}
                y={0}
                width={W}
                height={H}
                fill="url(#barRightAura)"
              />
              <Circle
                cx={32}
                cy={H * 0.52}
                r={16}
                stroke="rgba(255, 255, 255, 0.14)"
                strokeWidth={1}
                fill="none"
              />
              <Circle
                cx={32}
                cy={H * 0.52}
                r={28}
                stroke="rgba(255, 255, 255, 0.08)"
                strokeWidth={1}
                strokeDasharray="3 4"
                fill="none"
              />
              <Circle
                cx={32}
                cy={H * 0.52}
                r={44}
                stroke="rgba(255, 255, 255, 0.04)"
                strokeWidth={1}
                fill="none"
              />
              <Circle
                cx={W - 32}
                cy={H * 0.52}
                r={16}
                stroke="rgba(255, 255, 255, 0.14)"
                strokeWidth={1}
                fill="none"
              />
              <Circle
                cx={W - 32}
                cy={H * 0.52}
                r={28}
                stroke="rgba(255, 255, 255, 0.08)"
                strokeWidth={1}
                strokeDasharray="3 4"
                fill="none"
              />
              <Circle
                cx={W - 32}
                cy={H * 0.52}
                r={44}
                stroke="rgba(255, 255, 255, 0.04)"
                strokeWidth={1}
                fill="none"
              />
              <Path
                d={`M ${cx - 26} ${NOTCH_DEEP + 6} Q ${cx} ${
                  NOTCH_DEEP + 16
                }, ${cx + 26} ${NOTCH_DEEP + 6}`}
                stroke="rgba(255, 252, 227, 0.22)"
                strokeWidth={1.2}
                strokeDasharray="3 3"
                fill="none"
              />
              <Path
                d={`M ${cx - 40} ${NOTCH_DEEP + 14} Q ${cx} ${
                  NOTCH_DEEP + 27
                }, ${cx + 40} ${NOTCH_DEEP + 14}`}
                stroke="rgba(255, 252, 227, 0.12)"
                strokeWidth={1}
                fill="none"
              />
              <Path
                d={`M -15 ${H * 0.44} Q ${W * 0.22} ${H * 0.2}, ${
                  cx - NOTCH_W - 6
                } ${H * 0.5} T ${cx + NOTCH_W + 6} ${H * 0.5} Q ${W * 0.78} ${
                  H * 0.2
                }, ${W + 15} ${H * 0.44}`}
                stroke="rgba(255, 255, 255, 0.15)"
                strokeWidth={1.2}
                strokeLinecap="round"
                fill="none"
              />
              <Path
                d={`M -10 ${H * 0.64} Q ${W * 0.26} ${H * 0.8}, ${cx} ${
                  H * 0.58
                } Q ${W * 0.74} ${H * 0.8}, ${W + 10} ${H * 0.64}`}
                stroke="rgba(255, 255, 255, 0.08)"
                strokeWidth={1}
                strokeDasharray="4 5"
                fill="none"
              />
              <Path
                d={`M ${R} 2 L ${cx - NOTCH_W} 2`}
                stroke="url(#barTopRim)"
                strokeWidth={1.2}
                strokeLinecap="round"
              />
              <Path
                d={`M ${cx + NOTCH_W} 2 L ${W - R} 2`}
                stroke="url(#barTopRim)"
                strokeWidth={1.2}
                strokeLinecap="round"
              />
              <Path
                d={starPath(W * 0.16, H * 0.3, 4.2)}
                fill="url(#barGoldStar)"
              />
              <Path
                d={starPath(W * 0.35, H * 0.72, 3.2)}
                fill="url(#barGoldStar)"
              />
              <Path
                d={starPath(W * 0.65, H * 0.72, 3.2)}
                fill="url(#barGoldStar)"
              />
              <Path
                d={starPath(W * 0.84, H * 0.3, 4.2)}
                fill="url(#barGoldStar)"
              />
              <Circle
                cx={W * 0.08}
                cy={H * 0.34}
                r={1.2}
                fill="#FFFCE3"
                opacity={0.65}
              />
              <Circle
                cx={W * 0.23}
                cy={H * 0.68}
                r={1.0}
                fill="#FFFCE3"
                opacity={0.5}
              />
              <Circle
                cx={W * 0.41}
                cy={H * 0.24}
                r={1.1}
                fill="#FFFCE3"
                opacity={0.6}
              />
              <Circle
                cx={W * 0.59}
                cy={H * 0.24}
                r={1.1}
                fill="#FFFCE3"
                opacity={0.6}
              />
              <Circle
                cx={W * 0.77}
                cy={H * 0.68}
                r={1.0}
                fill="#FFFCE3"
                opacity={0.5}
              />
              <Circle
                cx={W * 0.92}
                cy={H * 0.34}
                r={1.2}
                fill="#FFFCE3"
                opacity={0.65}
              />
            </G>
            <Path
              d={d}
              fill="none"
              stroke={Colors.CreamBackground}
              strokeWidth={BAR_BORDER_W}
              strokeLinejoin="round"
            />
          </Svg>
        </View>
      );
    },
  );

export default BottomTabPatternSvg;
