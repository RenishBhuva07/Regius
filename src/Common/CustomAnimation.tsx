import React, { forwardRef } from 'react';
import { StyleSheet, StyleProp, ViewStyle } from 'react-native';
import LottieView, { LottieViewProps } from 'lottie-react-native';
import ResponsivePixels from '../Assets/StyleUtilities/ResponsivePixels';

export interface CustomAnimationProps {
  animationFile: any;
  animationStyle?: StyleProp<ViewStyle>;
  autoPlay?: boolean;
  loop?: boolean;
  speed?: number;
  resizeMode?: 'cover' | 'contain' | 'center';
  colorFilters?: LottieViewProps['colorFilters'];
  onAnimationFinish?: (isCancelled: boolean) => void;
  testID?: string;
}

export const CustomAnimation = forwardRef<LottieView, CustomAnimationProps>(
  (
    {
      animationFile,
      animationStyle,
      autoPlay = true,
      loop = true,
      speed = 1,
      resizeMode = 'contain',
      colorFilters,
      onAnimationFinish,
      testID,
    },
    ref,
  ) => {
    return (
      <LottieView
        ref={ref}
        style={animationStyle ? animationStyle : styles.animationView}
        source={animationFile}
        autoPlay={autoPlay}
        loop={loop}
        speed={speed}
        resizeMode={resizeMode}
        colorFilters={colorFilters}
        onAnimationFinish={onAnimationFinish}
        testID={testID}
      />
    );
  },
);

CustomAnimation.displayName = 'CustomAnimation';

const styles = StyleSheet.create({
  animationView: {
    height: ResponsivePixels.size100,
    width: ResponsivePixels.size100,
  },
});

export default CustomAnimation;
