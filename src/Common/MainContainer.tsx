import React from 'react';
import {
  ColorValue,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  StatusBarStyle,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../Theme/ThemeContext';

interface IMainContainerProps {
  children: any;
  statusBarStyle?: StatusBarStyle;
  statusBarBackgroundColor?: ColorValue;
  statusBarHidden?: boolean;
  keyboardVerticalOffset?: number;
  containerBackgroundColor?: string;
  translucent?: boolean;
  showHeader?: boolean;
}

const MainContainer = (props: IMainContainerProps) => {
  const { Colors } = useTheme();

  const {
    children,
    statusBarStyle = 'dark-content',
    statusBarBackgroundColor = 'transparent',
    statusBarHidden = false,
    keyboardVerticalOffset = 0,
    containerBackgroundColor = Colors.CreamBackground,
    translucent = true,
  } = props;

  return (
    <TouchableWithoutFeedback onPress={Keyboard?.dismiss} accessible={false}>
      <View style={[styles.root, { backgroundColor: containerBackgroundColor }]}>
        <StatusBar
          barStyle={statusBarStyle}
          hidden={statusBarHidden}
          {...(Platform.OS === 'android' ? { backgroundColor: statusBarBackgroundColor, translucent } : {})}
        />

        <KeyboardAvoidingView
          style={styles.keyboardAvoid}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={keyboardVerticalOffset}
        >
          <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right', 'bottom']}>
            <View style={[styles.innerContent, { backgroundColor: containerBackgroundColor }]}>
              {children}
            </View>
          </SafeAreaView>
        </KeyboardAvoidingView>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  keyboardAvoid: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  innerContent: {
    flex: 1,
  },
});

export default MainContainer;
