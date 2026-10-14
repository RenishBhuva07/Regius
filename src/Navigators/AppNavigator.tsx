import React, { useContext } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { navigationRef } from './Navigator';
import Splash from '../Screens/Splash/Splash';
import Intro from '../Screens/Intro/Intro';
import { LoginScreen } from '../Screens/Login';
import BottomTabNavigator from './BottomTabNavigator';
import { AuthContext } from '../Context/AuthContext';

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
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator
        screenOptions={{ headerShown: false, animation: 'fade' }}
      >
        <Stack.Screen name="Intro" component={Intro} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="MainTabs" component={BottomTabNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
