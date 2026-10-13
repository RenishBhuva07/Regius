import React, { useEffect } from 'react';
import { LogBox, StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/Navigators/AppNavigator';
import { ThemeProvider } from './src/Theme/ThemeContext';
import { PremiumProvider } from './src/Context/PremiumContext';
import { AuthProvider } from './src/Context/AuthContext';
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
          <SafeAreaProvider>
            <StatusBar barStyle="dark-content" />
            <AppNavigator />
            <Toast config={toastConfig} />
          </SafeAreaProvider>
        </AuthProvider>
      </PremiumProvider>
    </ThemeProvider>
  );
}

export default App;
