import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Navbar, Footer } from './'; 

export default function MainLayout({ children }) {
  return (
    <View style={styles.container}>
      <Navbar/>
      <View style={styles.content}>
        {children} 
      </View>
      <Footer />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1, 
    padding: 20,
  },
});
