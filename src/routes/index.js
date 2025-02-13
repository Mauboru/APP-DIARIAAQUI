import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { Welcome, SignIn, Home, Profile, Register, QrCode, Servicos } from '../pages';
import PrivateRoute from './PrivateRoute';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator, View } from 'react-native';

const Stack = createNativeStackNavigator();

export default function Routes() {
  const [isLoading, setIsLoading] = useState(true);
  const [initialRoute, setInitialRoute] = useState('Welcome');

  useEffect(() => {
    const checkUserAuth = async () => {
      const token = await AsyncStorage.getItem('token');
      setInitialRoute(token ? 'Home' : 'Welcome');
      setIsLoading(false);
    };
    checkUserAuth();
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#38a69d" />
      </View>
    );
  }

  return (
    <Stack.Navigator initialRouteName={initialRoute} screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Welcome" component={Welcome} />
      <Stack.Screen name="SignIn" component={SignIn} />
      <Stack.Screen name="Register" component={Register} />
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
