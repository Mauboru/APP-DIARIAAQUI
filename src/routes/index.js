import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { Welcome, SignIn, Home, Profile, Register, QrCode, Servicos, PhoneVerification } from '../pages';
import PrivateRoute from './PrivateRoute';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Stack = createNativeStackNavigator();

export default function Routes() {
  const [initialRoute, setInitialRoute] = useState('Welcome');

  useEffect(() => {
    const checkUserAuth = async () => {
      const token = await AsyncStorage.getItem('token');
      setInitialRoute(token ? 'Home' : 'Welcome');
      setIsLoading(false);
    };
    checkUserAuth();
  }, []);

  return (
    <Stack.Navigator initialRouteName={initialRoute} screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Welcome" component={Welcome} />
      <Stack.Screen name="SignIn" component={SignIn} />
      <Stack.Screen name="Register" component={Register} />
      <Stack.Screen name="PhoneVerification" component={PhoneVerification} />

      <Stack.Screen name="Home">
        {(props) => (
          <PrivateRoute navigation={props.navigation}>
            <Home {...props} />
          </PrivateRoute>
        )}
      </Stack.Screen>
      <Stack.Screen name="Profile">
        {(props) => (
          <PrivateRoute navigation={props.navigation}>
            <Profile {...props} />
          </PrivateRoute>
        )}
      </Stack.Screen>
      <Stack.Screen name="QrCode">
        {(props) => (
          <PrivateRoute navigation={props.navigation}>
            <QrCode {...props} />
          </PrivateRoute>
        )}
      </Stack.Screen>
      <Stack.Screen name="Servicos">
        {(props) => (
          <PrivateRoute navigation={props.navigation}>
            <Servicos {...props} />
          </PrivateRoute>
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
}
