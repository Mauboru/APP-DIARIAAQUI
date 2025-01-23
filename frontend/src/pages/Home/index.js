import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Navbar from '../../components/Navbar';

export default function Home({ navigation }) {
  return (
    <View style={styles.container}>
      <Navbar
        title="Home"
        onBack={() => navigation.goBack()} // Função para voltar uma tela
        showBackButton={false} // Ocultar o botão de "voltar" nesta tela
      />
      <View style={styles.content}>
        <Text>Bem Vindo a Tela Inicial!</Text>
      </View>
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
