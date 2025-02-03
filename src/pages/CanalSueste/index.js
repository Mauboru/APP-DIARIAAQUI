import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';

export default function CanalSueste() {
  const [Booking, setBooking] = useState('');
  const [Armador, setArmador] = useState('');
  const [responseData, setResponseData] = useState('');

  const handleSubmit = async () => {
    if (!Booking || !Armador) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }

    const requestData = {
      Booking,
      Armador,
    };

    try {
      const response = await fetch('http://85.31.63.241:3002/obter_dados_booking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      const data = await response.json();
      setResponseData(JSON.stringify(data, null, 2));
    } catch (error) {
      setResponseData(JSON.stringify(error, null, 2));
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Booking:</Text>
      <TextInput
        style={styles.input}
        value={Booking}
        onChangeText={setBooking}
        placeholder="Digite o Booking"
      />
      
      <Text style={styles.label}>Armador:</Text>
      <TextInput
        style={styles.input}
        value={Armador}
        onChangeText={setArmador}
        placeholder="Digite o Armador"
      />

      <Button title="Enviar" onPress={handleSubmit} />

      {responseData ? (
        <View style={styles.responseContainer}>
          <Text style={styles.label}>Resposta da API:</Text>
          <Text style={styles.responseText}>{responseData}</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  responseContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
  responseText: {
    fontSize: 14,
    color: '#333',
  },
});