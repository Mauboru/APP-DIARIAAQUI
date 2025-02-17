import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView, ActivityIndicator, TextInput } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import axios from 'axios';
import API_BASE_URL from '../../config';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function PhoneVerification() {
  const navigation = useNavigation();
  const [code, setCode] = useState(['', '', '', '']);
  const [phone_number, setPhone_number] = useState('');
  const [isLoading, setIsLoading] = useState(false); 
  const [errorMessage, setErrorMessage] = useState('');

  const handleRegister = async () => {
    const storedPhoneNumber = await AsyncStorage.getItem('phoneNumber');
    const codeString = code.join('');

    if (codeString.length !== 4) {
      setErrorMessage('Por favor, insira todos os 4 dígitos do código.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/verificationUserPhoneCode`, {
        code: codeString,
        phone_number: storedPhoneNumber,
      });

      if (response.status === 201) {
        Alert.alert('Sucesso', response.data.message);
        navigation.navigate('SignIn'); 
      }
    } catch (error) {
      console.error(error);
      if (error.response && error.response.status === 400) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage('Erro ao tentar enviar. Tente novamente.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const isButtonDisabled = code.some(digit => digit.trim() === '');

  return (
    <ScrollView style={styles.container}>
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#FFF" />
        </View>
      )}

      <Animatable.View animation="fadeInLeft" delay={500} style={styles.containerHeader}>
        <Text style={styles.message}>Confirme o código enviado!</Text>
      </Animatable.View>

      <Animatable.View animation="fadeInUp" style={styles.containerForm}>
        <View style={styles.codeInputContainer}>
          {code.map((digit, index) => (
            <TextInput
              key={index}
              style={styles.codeInput}
              maxLength={1}
              keyboardType="numeric"
              value={digit}
              onChangeText={(text) => {
                const newCode = [...code];
                newCode[index] = text;
                setCode(newCode);
              }}
              autoFocus={index === 0}
            />
          ))}
        </View>

        <TouchableOpacity
          style={[styles.button, isButtonDisabled && styles.buttonDisabled]}
          onPress={handleRegister}
          disabled={isButtonDisabled}
        >
          <Text style={styles.buttonText}>Confirmar</Text>
        </TouchableOpacity>

        {/* Chamar função de enviar codigo novamente e estabelecer um contador */}
        <TouchableOpacity style={styles.buttonLogin} onPress={() => navigation.navigate('SignIn')}>
          <Text style={styles.loginText}>Perdeu o código? Peça de novo!</Text>
        </TouchableOpacity>

        {errorMessage !== '' && <Text style={styles.errorText}>{errorMessage}</Text>}
      </Animatable.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#38a69d',
  },
  containerHeader: {
    marginTop: '14%',
    marginBottom: '8%',
    paddingStart: '5%',
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginTop: 10,
    alignSelf: 'center',
  },
  message: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFF',
  },
  containerForm: {
    backgroundColor: '#FFF',
    flex: 1,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingStart: '5%',
    paddingEnd: '5%',
  },
  codeInputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  codeInput: {
    width: 50,
    height: 50,
    borderWidth: 1,
    borderColor: '#38a69d',
    borderRadius: 8,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#38a69d',
    width: '100%',
    borderRadius: 4,
    paddingVertical: 8,
    marginTop: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#a1a1a1',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonLogin: {
    marginTop: 14,
    alignSelf: 'center',
  },
  loginText: {
    color: '#a1a1a1',
    padding: 20,
  },
});
