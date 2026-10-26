import React, { useEffect } from 'react';
import { LogBox, StatusBar, Platform } from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import AppNavigator from './src/Navigators/AppNavigator';
import { ThemeProvider } from './src/Theme/ThemeContext';
import { PremiumProvider } from './src/Context/PremiumContext';
import { AuthProvider } from './src/Context/AuthContext';
import { TaskReminderProvider } from './src/Context/TaskReminderContext';
import { MilestoneProvider } from './src/Context/MilestoneContext';
import { MilestoneFullScreenSheet } from './src/Screens/Milestones';
import Toast from 'react-native-toast-message';
import { toastConfig } from './src/Common/ToastConfig';

const ThemedToast: React.FC = () => {
  const insets = useSafeAreaInsets();
  const topOffset =
    Platform.OS === 'ios'
      ? Math.max(insets.top + 8, 54)
      : Math.max(insets.top + 8, 28);

  return <Toast config={toastConfig} topOffset={topOffset} />;
};

function App() {
  useEffect(() => {
    LogBox.ignoreAllLogs(true);
  }, []);

  return (
    <ThemeProvider>
      <PremiumProvider>
        <AuthProvider>
          <TaskReminderProvider>
            <MilestoneProvider>
              <SafeAreaProvider>
                <StatusBar barStyle="dark-content" />
                <AppNavigator />
                <MilestoneFullScreenSheet />
                <ThemedToast />
              </SafeAreaProvider>
            </MilestoneProvider>
          </TaskReminderProvider>
        </AuthProvider>
      </PremiumProvider>
    </ThemeProvider>
  );
}

export default App;
