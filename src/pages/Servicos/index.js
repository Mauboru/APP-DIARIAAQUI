import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Servicos() {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text>Bem Vindo a tela de Serviços!</Text>
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
