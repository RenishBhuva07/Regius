import React, { useEffect } from 'react';
import { LogBox, StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/Navigators/AppNavigator';
import { ThemeProvider } from './src/Theme/ThemeContext';
import { PremiumProvider } from './src/Context/PremiumContext';
import { AuthProvider } from './src/Context/AuthContext';
import { TaskReminderProvider } from './src/Context/TaskReminderContext';
import { MilestoneProvider } from './src/Context/MilestoneContext';
import { MilestoneFullScreenSheet } from './src/Screens/Milestones';
import Toast from 'react-native-toast-message';
import { toastConfig } from './src/Common/ToastConfig';

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
                <Toast config={toastConfig} />
              </SafeAreaProvider>
            </MilestoneProvider>
          </TaskReminderProvider>
        </AuthProvider>
      </PremiumProvider>
    </ThemeProvider>
  );
}

export default App;
