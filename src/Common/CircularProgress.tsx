import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { Fonts } from '../Theme/fonts';

export interface CircularProgressProps {
  percent: number;
  size?: number;
  strokeWidth?: number;
  trackColor: string;
  progressColor: string;
  textColor: string;
  shadowColor?: string;
}

// Circular progress indicator showing percentage as an elevated round graph line
export const CircularProgress: React.FC<CircularProgressProps> = React.memo(
  ({
    percent,
    size = 34,
    strokeWidth = 2.8,
    trackColor,
    progressColor,
    textColor,
    shadowColor,
  }) => {
    const clampedPercent = Math.min(100, Math.max(0, Math.round(percent)));
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset =
      circumference - (circumference * clampedPercent) / 100;
    const center = size / 2;

    return (
      <View
        style={[
          styles.progressContainer,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            shadowColor: shadowColor || 'rgba(0, 0, 0, 0.1)',
          },
        ]}
        accessibilityRole="image"
        accessibilityLabel={`${clampedPercent}% completed`}
      >
        <View style={styles.svgRotator}>
          <Svg width={size} height={size}>
            {/* Background track circle */}
            <Circle
              cx={center}
              cy={center}
              r={radius}
              stroke={trackColor}
              strokeWidth={strokeWidth}
              fill="#FFFFFF"
            />
            {/* Foreground progress arc indicating percentage */}
            {clampedPercent > 0 && (
              <Circle
                cx={center}
                cy={center}
                r={radius}
                stroke={progressColor}
                strokeWidth={strokeWidth}
                strokeDasharray={`${circumference} ${circumference}`}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
              />
            )}
          </Svg>
        </View>
        <View style={styles.percentTextContainer} pointerEvents="none">
          <Text
            style={[
              styles.percentIndicatorText,
              {
                color: textColor,
                fontSize: clampedPercent >= 100 ? size * 0.25 : size * 0.29,
              },
            ]}
            numberOfLines={1}
          >
            {clampedPercent}%
          </Text>
        </View>
      </View>
    );
  },
);

const styles = StyleSheet.create({
  progressContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    backgroundColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 2,
  },
  svgRotator: {
    transform: [{ rotate: '-90deg' }],
  },
  percentTextContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  percentIndicatorText: {
    fontFamily: Fonts.poppins.bold,
    letterSpacing: -0.3,
  },
});

export default CircularProgress;
