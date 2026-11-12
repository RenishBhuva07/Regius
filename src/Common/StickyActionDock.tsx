import React from 'react';
import { View, StyleSheet, Platform, StyleProp, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, withAlpha } from '../Assets/StyleUtilities/Colors';
import { useTheme } from '../Theme/ThemeContext';
import ResponsivePixels from '../Assets/StyleUtilities/ResponsivePixels';

export interface StickyActionDockProps {
  children: React.ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
  minBottomInset?: number;
  backgroundColor?: string;
  borderColor?: string;
}

export const StickyActionDock: React.FC<StickyActionDockProps> = React.memo(
  ({
    children,
    containerStyle,
    minBottomInset = 16,
    backgroundColor,
    borderColor,
  }) => {
    const insets = useSafeAreaInsets();
    const { isDarkMode } = useTheme();

    const defaultBg = isDarkMode
      ? withAlpha(Colors.DarkBackground, 0.95)
      : withAlpha(Colors.CreamBackground, 0.96);
    const defaultBorder = isDarkMode
      ? Colors.CarbonSlate
      : Colors.WarmParchmentBorder;

    return (
      <View
        style={[
          styles.dockContainer,
          {
            paddingBottom: Math.max(insets.bottom, minBottomInset),
            backgroundColor: backgroundColor || defaultBg,
            borderTopColor: borderColor || defaultBorder,
          },
          containerStyle,
        ]}
      >
        {children}
      </View>
    );
  },
);

const styles = StyleSheet.create({
  dockContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: ResponsivePixels.size20,
    paddingTop: ResponsivePixels.size12,
    borderTopWidth: 1,
    ...Platform.select({
      ios: {
        shadowColor: Colors.PureBlack,
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.12,
        shadowRadius: 10,
      },
      android: {
        elevation: 10,
      },
    }),
    zIndex: 20,
  },
});

export default StickyActionDock;
