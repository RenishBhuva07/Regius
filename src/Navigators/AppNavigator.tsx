import React, { useContext, useMemo } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { Colors } from '../Assets/StyleUtilities/Colors';
import { useTheme } from '../Theme/ThemeContext';
import { navigationRef } from './Navigator';
import Splash from '../Screens/Splash/Splash';
import Intro from '../Screens/Intro/Intro';
import { LoginScreen } from '../Screens/Login';
import BottomTabNavigator from './BottomTabNavigator';
import { DashboardScreen } from '../Screens/Dashboard';
import SettingsScreen from '../Screens/Settings/SettingsScreen';
import { VoiceStudioScreen } from '../Screens/Settings/VoiceStudioScreen';
import { WakeWordStudioScreen } from '../Screens/Settings/WakeWordStudioScreen';
import { ProfileScreen } from '../Screens/Profile';
import { LanguageScreen } from '../Screens/Language';
import { HelpFaqScreen } from '../Screens/HelpFaq';
import { PrivacySecurityScreen } from '../Screens/PrivacySecurity';
import { ThemeScreen } from '../Screens/Theme';
import { SubscriptionScreen } from '../Screens/Subscription';
import { HabitDetailsScreen } from '../Screens/Habits';
import { TaskDetailsScreen } from '../Screens/Tasks';
import { ReminderDetailsScreen } from '../Screens/Reminders';
import { AuthContext } from '../Context/AuthContext';
import { VoiceWakeWordProvider } from '../Context/VoiceWakeWordContext';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const { isLoading } = useContext(AuthContext);
  const { isDarkMode, Colors: themeColors } = useTheme();
  const [minTimePassed, setMinTimePassed] = React.useState(false);

  const navigationTheme = useMemo(
    () => ({
      ...DefaultTheme,
      colors: {
        ...DefaultTheme.colors,
        background:
          themeColors.Background ||
          (isDarkMode ? '#121417' : Colors.CreamBackground),
      },
    }),
    [isDarkMode, themeColors],
  );

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setMinTimePassed(true);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading || !minTimePassed) {
    return (
      <NavigationContainer ref={navigationRef} theme={navigationTheme}>
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
      <NavigationContainer ref={navigationRef} theme={navigationTheme}>
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
            name="ProfileScreen"
            component={ProfileScreen}
            options={{ animation: 'slide_from_right' }}
          />
          <Stack.Screen
            name="VoiceStudioScreen"
            component={VoiceStudioScreen}
            options={{ animation: 'slide_from_right' }}
          />
          <Stack.Screen
            name="WakeWordStudioScreen"
            component={WakeWordStudioScreen}
            options={{ animation: 'slide_from_right' }}
          />
          <Stack.Screen
            name="LanguageScreen"
            component={LanguageScreen}
            options={{ animation: 'slide_from_right' }}
          />
          <Stack.Screen
            name="HelpFaqScreen"
            component={HelpFaqScreen}
            options={{ animation: 'slide_from_right' }}
          />
          <Stack.Screen
            name="PrivacySecurityScreen"
            component={PrivacySecurityScreen}
            options={{ animation: 'slide_from_right' }}
          />
          <Stack.Screen
            name="ThemeScreen"
            component={ThemeScreen}
            options={{ animation: 'slide_from_right' }}
          />
          <Stack.Screen
            name="SubscriptionScreen"
            component={SubscriptionScreen}
            options={{ animation: 'slide_from_bottom' }}
          />
          <Stack.Screen
            name="HabitDetailsScreen"
            component={HabitDetailsScreen}
            options={{ animation: 'slide_from_right' }}
          />
          <Stack.Screen
            name="TaskDetailsScreen"
            component={TaskDetailsScreen}
            options={{ animation: 'slide_from_right' }}
          />
          <Stack.Screen
            name="ReminderDetailsScreen"
            component={ReminderDetailsScreen}
            options={{ animation: 'slide_from_right' }}
          />
          <Stack.Screen name="Dashboard" component={DashboardScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </VoiceWakeWordProvider>
  );
}
