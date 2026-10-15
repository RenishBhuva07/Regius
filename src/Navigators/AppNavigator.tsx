import React, { useContext } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { navigationRef } from './Navigator';
import Splash from '../Screens/Splash/Splash';
import Intro from '../Screens/Intro/Intro';
import { LoginScreen } from '../Screens/Login';
import BottomTabNavigator from './BottomTabNavigator';
import { AddTaskScreen } from '../Screens/Tasks';
import { AddReminderScreen } from '../Screens/Reminders';
import { DashboardScreen } from '../Screens/Dashboard';
import SettingsScreen from '../Screens/Settings/SettingsScreen';
import { AuthContext } from '../Context/AuthContext';
import { VoiceWakeWordProvider } from '../Context/VoiceWakeWordContext';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const { isLoading } = useContext(AuthContext);
  const [minTimePassed, setMinTimePassed] = React.useState(false);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setMinTimePassed(true);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading || !minTimePassed) {
    return (
      <NavigationContainer ref={navigationRef}>
        <Stack.Navigator
          screenOptions={{ headerShown: false, animation: 'fade' }}
        >
          <Stack.Screen name="Splash" component={Splash} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }

  return (
    <VoiceWakeWordProvider>
      <NavigationContainer ref={navigationRef}>
        <Stack.Navigator
          screenOptions={{ headerShown: false, animation: 'fade' }}
        >
          <Stack.Screen name="Intro" component={Intro} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="MainTabs" component={BottomTabNavigator} />
          <Stack.Screen
            name="Settings"
            component={SettingsScreen}
            options={{ animation: 'slide_from_right' }}
          />
          <Stack.Screen
            name="AddTaskScreen"
            component={AddTaskScreen}
            options={{ animation: 'slide_from_bottom' }}
          />
          <Stack.Screen
            name="AddReminderScreen"
            component={AddReminderScreen}
            options={{ animation: 'slide_from_bottom' }}
          />
          <Stack.Screen name="Dashboard" component={DashboardScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </VoiceWakeWordProvider>
  );
}
