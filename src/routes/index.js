import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { Welcome, SignIn, ServicesList, Profile, Register, ServicesRegister, PhoneVerification, ServicesDetails } from '../pages';
import PrivateRoute from './PrivateRoute';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Stack = createNativeStackNavigator();

export default function Routes() {
  const [initialRoute, setInitialRoute] = useState('Welcome');

  useEffect(() => {
    const checkUserAuth = async () => {
      const token = await AsyncStorage.getItem('token');
      setInitialRoute(token ? 'ServicesList' : 'Welcome');
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

      <Stack.Screen name="ServicesList">
        {(props) => (
          <PrivateRoute navigation={props.navigation}>
            <ServicesList  {...props} />
          </PrivateRoute>
        )}
      </Stack.Screen>
      <Stack.Screen name="ServicesRegister">
        {(props) => (
          <PrivateRoute navigation={props.navigation}>
            <ServicesRegister {...props} />
          </PrivateRoute>
        )}
      </Stack.Screen>
      <Stack.Screen name="ServicesDetails">
        {(props) => (
          <PrivateRoute navigation={props.navigation}>
            <ServicesDetails {...props} />
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
    </Stack.Navigator>
  );
}
