import React from 'react';
import { View, StyleSheet, Platform, StyleProp, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../Theme/ThemeContext';
import { Colors } from '../Assets/StyleUtilities/Colors';

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
      ? 'rgba(18, 20, 23, 0.95)'
      : 'rgba(255, 252, 227, 0.96)';
    const defaultBorder = isDarkMode ? '#2C3035' : '#EAE5D9';

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
    paddingHorizontal: 20,
    paddingTop: 12,
    borderTopWidth: 1,
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
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
