import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Navbar, Footer } from './'; 
import { useNavigationState } from '@react-navigation/native';

export default function MainLayout({ children }) {
  const currentRoute = useNavigationState(state => state?.routes[state.index]?.name);
  const hideLayout = ['Welcome', 'SignIn', 'Register'].includes(currentRoute);

  return (
    <View style={styles.container}>
      {!hideLayout && <Navbar />}
      <View style={styles.content}>{children}</View>
      {!hideLayout && <Footer />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingTop: 60,
    paddingBottom: 50,
    flex: 1, 
  },
});
