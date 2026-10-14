import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BaseToastProps } from 'react-native-toast-message';
import Svg, { Circle } from 'react-native-svg';
import { Colors } from '../Assets/StyleUtilities/Colors';
import ResponsivePixels from '../Assets/StyleUtilities/ResponsivePixels';
import { Typography, ShadowStyles } from '../Theme/Typographys';

const BlobRight = () => (
  <Svg
    width={60}
    height={60}
    viewBox="0 0 60 60"
    fill="none"
    style={styles.blobRight}
  >
    <Circle cx={50} cy={10} r={28} fill={Colors.AccentGreen} opacity={0.35} />
    <Circle cx={55} cy={50} r={18} fill={Colors.AccentYellow} opacity={0.25} />
  </Svg>
);

const BlobLeft = () => (
  <Svg
    width={60}
    height={60}
    viewBox="0 0 60 60"
    fill="none"
    style={styles.blobLeft}
  >
    <Circle cx={10} cy={10} r={28} fill={Colors.AccentGreen} opacity={0.35} />
    <Circle cx={5} cy={50} r={18} fill={Colors.AccentYellow} opacity={0.25} />
  </Svg>
);

const BaseToast = ({ text2, bgColor }: { text2?: string; bgColor: string }) => (
  <View
    style={[
      styles.container,
      { backgroundColor: bgColor },
      ShadowStyles.shadow,
    ]}
  >
    <BlobLeft />
    <BlobRight />
    <Text style={styles.message}>{text2}</Text>
  </View>
);

export const toastConfig = {
  success: (props: BaseToastProps) => (
    <BaseToast {...props} bgColor={Colors.LavenderPurple} />
  ),
  error: (props: BaseToastProps) => (
    <BaseToast {...props} bgColor={Colors.LavenderPurple} />
  ),
  info: (props: BaseToastProps) => (
    <BaseToast {...props} bgColor={Colors.LavenderPurple} />
  ),
  warning: (props: BaseToastProps) => (
    <BaseToast {...props} bgColor={Colors.LavenderPurple} />
  ),
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '90%',
    borderRadius: ResponsivePixels.size16,
    paddingVertical: ResponsivePixels.size14,
    paddingHorizontal: ResponsivePixels.size16,
    marginTop: ResponsivePixels.size10,
    overflow: 'hidden',
  },
  blobRight: {
    position: 'absolute',
    right: 0,
    top: 0,
  },
  blobLeft: {
    position: 'absolute',
    left: 0,
    top: 0,
  },
  message: {
    ...Typography.bodyMediumPoppinsRegular,
    color: Colors.PureWhiteText,
    flex: 1,
    textAlign: 'center',
  },
});
