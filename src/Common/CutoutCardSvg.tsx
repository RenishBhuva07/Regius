import React from 'react';
import { StyleProp, ViewStyle, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';

export interface CutoutCardSvgProps {
  width: number;
  height: number;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
}

// Rounded card SVG path with top-right cutout for the floating checkbox
export const getCutoutCardPath = (W: number, H: number): string => {
  if (W <= 60 || H <= 60) return '';
  const sw = 1.5;
  const half = sw / 2;
  const x0 = half;
  const y0 = half;
  const x1 = W - half;
  const y1 = H - half;

  const CW = 44; // Cutout notch width
  const CH = 44; // Cutout notch height
  const R_tl = 18; // Top-left corner radius
  const R_bl = 18; // Bottom-left corner radius
  const R_br = 18; // Bottom-right corner radius
  const R_outer = 12; // Fillet entering and exiting the notch
  const R_inner = 14; // Fillet at inner scooped corner

  return [
    `M ${x0} ${y0 + R_tl}`,
    `Q ${x0} ${y0}, ${x0 + R_tl} ${y0}`,
    `L ${x1 - CW - R_outer} ${y0}`,
    `Q ${x1 - CW} ${y0}, ${x1 - CW} ${y0 + R_outer}`,
    `L ${x1 - CW} ${y0 + CH - R_inner}`,
    `Q ${x1 - CW} ${y0 + CH}, ${x1 - CW + R_inner} ${y0 + CH}`,
    `L ${x1 - R_outer} ${y0 + CH}`,
    `Q ${x1} ${y0 + CH}, ${x1} ${y0 + CH + R_outer}`,
    `L ${x1} ${y1 - R_br}`,
    `Q ${x1} ${y1}, ${x1 - R_br} ${y1}`,
    `L ${x0 + R_bl} ${y1}`,
    `Q ${x0} ${y1}, ${x0} ${y1 - R_bl}`,
    `L ${x0} ${y0 + R_tl}`,
    'Z',
  ].join(' ');
};

export const CutoutCardSvg: React.FC<CutoutCardSvgProps> = React.memo(
  ({
    width,
    height,
    fill = '#FFFFFF',
    stroke = 'transparent',
    strokeWidth = 1.5,
    style,
    children,
  }) => {
    const pathD = getCutoutCardPath(width, height);
    if (!pathD) return null;

    return (
      <Svg
        width={width}
        height={height}
        style={[styles.absoluteSvg, style]}
        pointerEvents="none"
      >
        {children}
        <Path
          d={pathD}
          fill={fill}
          stroke={stroke}
          strokeWidth={strokeWidth}
          strokeLinejoin="round"
        />
      </Svg>
    );
  },
);

const styles = StyleSheet.create({
  absoluteSvg: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});

export default CutoutCardSvg;

