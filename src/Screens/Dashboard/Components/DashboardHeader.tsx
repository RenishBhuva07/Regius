import React from 'react';
import { View, StyleSheet, TouchableOpacity, Animated } from 'react-native';

import { Colors } from '../../../Assets/StyleUtilities/Colors';
import { SVGS } from '../../../Assets/Images';
import { RegiusLogo } from '../../../Common/RegiusLogo';
import { CustomAnimation } from '../../../Common/CustomAnimation';
import HolographAnimation from '../../../Assets/JsonAnimations/Holograph.json';
import { SettingsButton } from '../../../Common/SettingsButton';
import HeaderPatternSvg from './HeaderPatternSvg';

export const HEADER_HEIGHT = 54;

export interface DashboardHeaderProps {
  isScrolled: boolean;
  insetsTop: number;
  screenWidth: number;
  assistantName: string;
  headerBgColor: Animated.AnimatedInterpolation<string>;
  headerRadius: Animated.AnimatedInterpolation<number>;
  headerShadowOpacity: Animated.AnimatedInterpolation<number>;
  headerElevation: Animated.AnimatedInterpolation<number>;
  headerPaddingBottom: Animated.AnimatedInterpolation<number>;
  headerPatternOpacity: Animated.AnimatedInterpolation<number>;
  onOpenVoiceAssistant: () => void;
  onPressSettings: () => void;
  onPressProfile?: () => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = React.memo(
  ({
    isScrolled,
    insetsTop,
    screenWidth,
    assistantName,
    headerBgColor,
    headerRadius,
    headerShadowOpacity,
    headerElevation,
    headerPaddingBottom,
    headerPatternOpacity,
    onOpenVoiceAssistant,
    onPressSettings,
    onPressProfile,
  }) => {
    return (
      <Animated.View
        style={[
          styles.headerContainer,
          {
            paddingTop: insetsTop,
            paddingBottom: headerPaddingBottom,
            backgroundColor: headerBgColor,
            borderBottomLeftRadius: headerRadius,
            borderBottomRightRadius: headerRadius,
            shadowOpacity: headerShadowOpacity,
            elevation: headerElevation,
          },
        ]}
      >
        {/* Background Theme SVG Designs for Scrolled State */}
        <Animated.View
          pointerEvents="none"
          style={[
            StyleSheet.absoluteFill,
            {
              opacity: headerPatternOpacity,
              borderBottomLeftRadius: headerRadius,
              borderBottomRightRadius: headerRadius,
              overflow: 'hidden',
            },
          ]}
        >
          <HeaderPatternSvg width={screenWidth} insetsTop={insetsTop} />
        </Animated.View>

        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <RegiusLogo size="xl" variant={isScrolled ? 'light' : 'default'} />
          </View>

          <View style={styles.headerRight}>
            <TouchableOpacity
              activeOpacity={0.75}
              onPress={onOpenVoiceAssistant}
              style={styles.voiceHeaderBtn}
              accessibilityRole="button"
              accessibilityLabel={`Open ${assistantName} Voice Assistant`}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <View pointerEvents="none">
                <CustomAnimation
                  animationFile={HolographAnimation}
                  size={56}
                  animationStyle={styles.voiceHeaderAnimation}
                  autoPlay
                  loop
                  resizeMode="contain"
                  pointerEvents="none"
                />
              </View>
            </TouchableOpacity>

            <SettingsButton isScrolled={isScrolled} onPress={onPressSettings} />

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={onPressProfile ?? onPressSettings}
              style={[
                styles.avatarRing,
                isScrolled && styles.avatarRingScrolled,
              ]}
              accessibilityRole="button"
              accessibilityLabel="User Profile"
            >
              <SVGS.RegiusAvatar width={36} height={36} style={styles.avatar} />
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    );
  },
);

const styles = StyleSheet.create({
  headerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    shadowColor: '#201646',
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 7,
  },
  header: {
    height: HEADER_HEIGHT,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  voiceHeaderBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  voiceHeaderAnimation: {
    width: 56,
    height: 56,
  },
  avatarRing: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: Colors.RingBorder,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    backgroundColor: Colors.DefaultWhite,
  },
  avatarRingScrolled: {
    borderColor: Colors.RingBorder,
    borderWidth: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 3,
    backgroundColor: Colors.DefaultWhite,
  },
  avatar: {
    position: 'absolute',
    bottom: 0,
  },
});

export default DashboardHeader;
