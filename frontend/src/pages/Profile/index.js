import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Navbar, Footer } from '../../components';

export default function Profile({ navigation }) {
  return (
    <View style={styles.container}>
      <Navbar
        title="Tela de Perfil"
        onBack={() => navigation.goBack()} 
        showBackButton={false}
      />
      <View style={styles.content}>
        <Text>Bem Vindo a Tela de Perfil!</Text>
      </View>

      <Footer setSelected="3"/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
