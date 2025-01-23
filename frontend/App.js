import React from 'react';
import { StatusBar } from 'react-native';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';

import { NavigationContainer } from '@react-navigation/native';
import Routes from './src/routes';

function AppContent() {
  const { theme } = useTheme();

  return (
    <>
      <StatusBar
        backgroundColor={theme.background}
        barStyle={theme.text === '#FFFFFF' ? 'light-content' : 'dark-content'}
      />
      <NavigationContainer>
        <Routes />
      </NavigationContainer>
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
