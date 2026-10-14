import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  StatusBar,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Colors } from '../../Assets/StyleUtilities/Colors';
import ResponsivePixels from '../../Assets/StyleUtilities/ResponsivePixels';
import { Typography } from '../../Theme/Typographys';
import { SVGS } from '../../Assets/Images';

const { width } = Dimensions.get('window');

const Intro: React.FC = () => {
  const navigation = useNavigation<any>();

  const handleNextPress = () => {
    navigation.replace('MainTabs');
  };

  // Scale based on Figma artboard width (375px)
  const scale = width / 375;
  const illustrationWidth = 331 * scale;
  const illustrationHeight = 673 * scale;

  const titleTop = 465 * scale;
  const buttonCenterY = 642 * scale;
  const buttonSize = ResponsivePixels.size84;

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        {...(Platform.OS === 'android'
          ? { backgroundColor: 'transparent', translucent: true }
          : {})}
      />

      <View
        style={[
          styles.illustrationWrapper,
          {
            top: 0,
            left: 0,
            width: illustrationWidth,
            height: illustrationHeight,
          },
        ]}
        pointerEvents="none"
      >
        <SVGS.IntroHeroIllustration
          width={illustrationWidth}
          height={illustrationHeight}
        />
      </View>

      <View
        style={[
          styles.textContainer,
          {
            top: titleTop,
          },
        ]}
      >
        <Text style={styles.title}>Plan Your Day In Details</Text>

        <Text style={styles.subtitle}>
          There Are Many Variations Of{'\n'}PassagesThere Are Many Variations.
        </Text>
      </View>

      <View
        style={[
          styles.buttonWrapper,
          {
            top: buttonCenterY - buttonSize / 2,
          },
        ]}
      >
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handleNextPress}
          style={styles.actionButtonTouch}
        >
          <SVGS.Btn width={buttonSize} height={buttonSize} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.CreamBackground,
    position: 'relative',
  },
  illustrationWrapper: {
    position: 'absolute',
    zIndex: 1,
  },
  textContainer: {
    position: 'absolute',
    paddingTop: ResponsivePixels.size30,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 2,
  },
  title: {
    ...Typography.h1RanadeBold,
    color: Colors.MidnightInkText,
    textAlign: 'center',
    letterSpacing: -0.2,
    fontWeight: '700',
  },
  subtitle: {
    ...Typography.bodyLargePoppinsRegularCompact,
    color: Colors.SubtitleGray,
    textAlign: 'center',
    letterSpacing: 0.4,
    marginTop: ResponsivePixels.size16,
  },
  buttonWrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
    paddingTop: ResponsivePixels.size24,
  },
  actionButtonTouch: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Intro;
