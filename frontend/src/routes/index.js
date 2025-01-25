import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Welcome, SignIn, ApiTest, Home, Profile, Pokemon, Register, QrCode } from '../pages';

const Stack = createNativeStackNavigator();

export default function Routes() {
  const checkAuth = async (navigation, screen) => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      navigation.navigate(screen);
    } else {
      navigation.navigate('SignIn');
    }
  };

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'none',
      }}
    >
      <Stack.Screen name="Welcome" component={Welcome} />
      <Stack.Screen name="SignIn" component={SignIn} />
      <Stack.Screen
        name="Home"
        component={(props) => {
          useEffect(() => {
            checkAuth(props.navigation, 'Home');
          }, []);
          return <Home {...props} />;
        }}
      />
      <Stack.Screen 
        name="Profile"
        component={(props) => {
            useEffect(() => {
            checkAuth(props.navigation, 'Profile');
            }, []);
        return <Profile {...props} />;
        }}
      />
      <Stack.Screen 
        name="Pokemon"
        component={(props) => {
            useEffect(() => {
            checkAuth(props.navigation, 'Pokemon');
            }, []);
        return <Pokemon {...props} />;
        }}
       />
      <Stack.Screen 
        name="Register"
        component={(props) => {
            useEffect(() => {
            checkAuth(props.navigation, 'Register');
            }, []);
        return <Register {...props} />;
        }}
      />
      <Stack.Screen 
        name="QrCode"
        component={(props) => {
            useEffect(() => {
            checkAuth(props.navigation, 'QrCode');
            }, []);
        return <QrCode {...props} />;
        }}
      />
      <Stack.Screen 
        name="ApiTest"
        component={(props) => {
            useEffect(() => {
            checkAuth(props.navigation, 'ApiTest');
            }, []);
        return <ApiTest {...props} />;
        }}
      />
    </Stack.Navigator>
  );
}
