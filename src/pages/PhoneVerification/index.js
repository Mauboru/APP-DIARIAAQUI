import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView, ActivityIndicator, TextInput } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { useNavigation } from '@react-navigation/native';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import API_BASE_URL from '../../config';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function PhoneVerification() {
  const navigation = useNavigation();
  const [code, setCode] = useState(['', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [timer, setTimer] = useState(30);
  const inputs = useRef([]);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

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

  const handleCodeChange = (text, index) => {
    if (/[^0-9]/.test(text)) return; 

    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);

    if (text && index < 3) {
      inputs.current[index + 1]?.focus();
    }
  };

  const resendCode = () => {
    setTimer(1);
    setErrorMessage('');
    resendCodeApi();
  };

  const resendCodeApi = async () => {
    setIsLoading(true);
    try {
      const storedPhoneNumber = await AsyncStorage.getItem('phoneNumber');

      const response = await axios.post(`${API_BASE_URL}/sendVerificationCodeAPI`, {
        phone_number: storedPhoneNumber
      });

      if (response.status === 201) {
        Alert.alert('Sucesso', response.data.message);
        navigation.navigate('PhoneVerification'); 
      }
    } catch (error) {
      console.error(error);
      if (error.response && error.response.status === 400) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage('Erro ao tentar registrar. Tente novamente.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
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
              ref={(el) => (inputs.current[index] = el)}
              style={styles.codeInput}
              maxLength={1}
              keyboardType="numeric"
              value={digit}
              onChangeText={(text) => handleCodeChange(text, index)}
              autoFocus={index === 0}
            />
          ))}
        </View>

        <Text style={styles.timerText}>Reenviar código em {timer}s</Text>

        <TouchableOpacity
          style={[styles.button, code.includes('') && styles.buttonDisabled]}
          onPress={handleRegister}
          disabled={code.includes('')}
        >
          <Text style={styles.buttonText}>Confirmar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.buttonLogin, timer > 0 && styles.buttonDisabled]}
          onPress={resendCode}
          disabled={timer > 0}
        >
          <Text style={[styles.anchorText, timer > 0 && styles.anchorTextDisabled]}>Perdeu o código? Peça de novo!</Text>
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
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#38a69d',
    padding: 20,
  },
  containerHeader: {
    marginBottom: '8%',
    alignItems: 'center',
  },
  message: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFF',
  },
  containerForm: {
    backgroundColor: '#FFF',
    width: '100%',
    borderRadius: 25,
    padding: 20,
    alignItems: 'center',
  },
  codeInputContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
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
    marginHorizontal: 5,
  },
  timerText: {
    marginBottom: 10,
    color: '#a1a1a1',
  },
  button: {
    backgroundColor: '#38a69d',
    width: '80%',
    borderRadius: 4,
    paddingVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonLogin: {
    marginTop: 14,
  },
  anchorText: {
    color: '#38a69d',
  },
  anchorTextDisabled: {
    opacity: 0.5,
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginTop: 10,
  },
});
