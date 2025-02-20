import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useNavigationState } from '@react-navigation/native';
import Footer from './Footer';

export default function MainLayout({ children }) {
  const currentRoute = useNavigationState(state => state?.routes[state.index]?.name);
  const hideLayout = ['Welcome', 'SignIn', 'Register', 'PhoneVerification'].includes(currentRoute);

  return (
    <View style={styles.container}>
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
    flex: 1, 
  },
});
