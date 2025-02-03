import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { Welcome, SignIn, Home, Profile, Register, QrCode, Servicos, CanalSueste } from '../pages';
import PrivateRoute from './PrivateRoute';

const Stack = createNativeStackNavigator();

export default function Routes() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Welcome" component={Welcome} />
      <Stack.Screen name="SignIn" component={SignIn} />
      <Stack.Screen name="Register" component={Register} />
      <Stack.Screen name="CanalSueste" component={CanalSueste} />
      
      <Stack.Screen name="Home" component={(props) => (
        <PrivateRoute navigation={props.navigation}>
          <Home {...props} />
        </PrivateRoute>
      )}/>
      <Stack.Screen name="Profile" component={(props) => (
        <PrivateRoute navigation={props.navigation}>
          <Profile {...props} />
        </PrivateRoute>
      )}/>
      <Stack.Screen name="QrCode" component={(props) => (
        <PrivateRoute navigation={props.navigation}>
          <QrCode {...props} />
        </PrivateRoute>
      )}/>
      <Stack.Screen name="Servicos" component={(props) => (
        <PrivateRoute navigation={props.navigation}>
          <Servicos {...props} />
        </PrivateRoute>
      )}/>
    </Stack.Navigator>
  );
}
