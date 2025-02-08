import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ScrollView, ActivityIndicator  } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import axios from 'axios';
import API_BASE_URL from '../../config';

export default function SignUp() {
  const navigation = useNavigation();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [cpforCnpj, setCpfOrCnpj] = useState('');
  const [isLoading, setIsLoading] = useState(false); 
  const [errorMessage, setErrorMessage] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');
  const [passwordColor, setPasswordColor] = useState('red');

  const formatPhoneNumber = (value) => {
    value = value.replace(/\D/g, '');
    if (value.length == 0){
      value = ``;
    } else if (value.length <= 2) {
      value = `(${value}`;
    } else if (value.length <= 7) {
      value = `(${value.substring(0, 2)}) ${value.substring(2)}`;
    } else {
      value = `(${value.substring(0, 2)}) ${value.substring(2, 3)} ${value.substring(3, 7)}-${value.substring(7, 11)}`;
    }
    return value;
  };

  const cleanPhoneNumber = (value) => {
    return value.replace(/\D/g, '');
  };

  const validatePassword = (input) => {
    const passwordPattern = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,20}$/;
    if (!input) {
      setPasswordMessage('');
      setPasswordColor('red');
      return;
    }

    if (passwordPattern.test(input)) {
      setPasswordMessage('Senha válida.');
      setPasswordColor('green');
    } else {
      setPasswordMessage('A senha deve ter entre 8 e 20 caracteres, ao menos uma letra maiúscula, uma minúscula, um número e um caractere especial.');
      setPasswordColor('red');
    }
  };

  const handleRegister = async () => {
    setIsLoading(true);
    try {
      const cleanedPhoneNumber = cleanPhoneNumber(phoneNumber);

      const response = await axios.post(`${API_BASE_URL}/register`, {
        cpforCnpj,
        name,
        email,
        password,
        phone_number: cleanedPhoneNumber,
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
        setErrorMessage('Erro ao tentar registrar. Tente novamente.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const isButtonDisabled = !name.trim() || !email.trim() || !phoneNumber.trim() || !cpforCnpj.trim() || !password.trim() ;

  return (
    <ScrollView  ew style={styles.container}>
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#FFF" />
        </View>
      )}

      <Animatable.View animation="fadeInLeft" delay={500} style={styles.containerHeader}>
        <Text style={styles.message}>Crie sua conta</Text>
      </Animatable.View>

      <Animatable.View animation="fadeInUp" style={styles.containerForm}>
        <Text style={styles.title}>CPF / CNPJ</Text>
        <TextInput
          value={cpforCnpj}
          onChangeText={setCpfOrCnpj}
          placeholder="Digite seu cpf/cnpj"
          style={styles.input}
        />
          
        <Text style={styles.title}>Nome completo / Razão Social</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Digite seu nome..."
          style={styles.input}
        />

        <Text style={styles.title}>Email</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="Digite seu email..."
          style={styles.input}
        />

        <Text style={styles.title}>Senha</Text>
        <TextInput
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            validatePassword(text);
          }}
          secureTextEntry
          placeholder="Digite sua senha"
          style={styles.input}
        />
        <Text style={{ color: passwordColor, fontSize: 12, marginTop: 4 }}>{passwordMessage}</Text>

        <Text style={styles.title}>Telefone</Text>
        <TextInput
          value={formatPhoneNumber(phoneNumber)}
          onChangeText={(text) => setPhoneNumber(formatPhoneNumber(text))}
          placeholder="Digite seu telefone"
          keyboardType="numeric"
          maxLength={16} 
          style={styles.input}
        />

        <TouchableOpacity style={[styles.button, isButtonDisabled && styles.buttonDisabled]} onPress={handleRegister} disabled={isButtonDisabled} >
          <Text style={styles.buttonText}>Criar Conta</Text>
        </TouchableOpacity>

        {errorMessage !== '' && <Text style={styles.errorText}>{errorMessage}</Text>}

        <TouchableOpacity style={styles.buttonLogin} onPress={() => navigation.navigate('SignIn')}>
          <Text style={styles.loginText}>Já tem uma conta? Faça login</Text>
        </TouchableOpacity>
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
  title: {
    fontSize: 20,
    marginTop: 28,
  },
  input: {
    borderBottomWidth: 1,
    height: 40,
    marginBottom: 12,
    fontSize: 16,
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
    padding: 20
  },
});
