import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import Routes from './src/routes';
import MainLayout from './src/components/MainLayout';

export default function App() {
  return (
    <>
      <NavigationContainer>
        <MainLayout>
          <Routes />
        </MainLayout>
      </NavigationContainer>
    </>
  );
}
