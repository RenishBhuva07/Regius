import React, { forwardRef } from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import LottieView, { LottieViewProps } from 'lottie-react-native';
import ResponsivePixels from '../Assets/StyleUtilities/ResponsivePixels';

export interface CustomAnimationProps {
  animationFile: any;
  animationStyle?: StyleProp<ViewStyle>;
  size?: number;
  autoPlay?: boolean;
  loop?: boolean;
  speed?: number;
  resizeMode?: 'cover' | 'contain' | 'center';
  colorFilters?: LottieViewProps['colorFilters'];
  onAnimationFinish?: (isCancelled: boolean) => void;
  testID?: string;
  pointerEvents?: 'box-none' | 'none' | 'box-only' | 'auto';
}

export const CustomAnimation = forwardRef<LottieView, CustomAnimationProps>(
  (
    {
      animationFile,
      animationStyle,
      size,
      autoPlay = true,
      loop = true,
      speed = 1,
      resizeMode = 'contain',
      colorFilters,
      onAnimationFinish,
      testID,
      pointerEvents,
    },
    ref,
  ) => {
    const lottieNode = (
      <LottieView
        ref={ref}
        style={[
          size !== undefined
            ? { width: size, height: size }
            : !animationStyle && styles.animationView,
          animationStyle,
        ]}
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

    if (pointerEvents) {
      return <View pointerEvents={pointerEvents}>{lottieNode}</View>;
    }

    return lottieNode;
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
