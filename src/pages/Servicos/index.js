import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Animatable from 'react-native-animatable';
import axios from 'axios';
import API_BASE_URL from '../../config';

export default function Servicos() {
  const navigation = useNavigation();

  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [pay, setPay] = useState('');
  const [status, setStatus] = useState('open');
  const [dateInitial, setDateInitial] = useState('');
  const [dateFinal, setDateFinal] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [editable, setEditable] = useState(false);

  const formatDate = (text, setDate) => {
    const cleaned = text.replace(/\D/g, '');
    
    let formatted = '';
    if (cleaned.length <= 4) {
      formatted = cleaned;
    } else if (cleaned.length <= 6) {
      formatted = `${cleaned.slice(0, 4)}-${cleaned.slice(4)}`;
    } else {
      formatted = `${cleaned.slice(0, 4)}-${cleaned.slice(4, 6)}-${cleaned.slice(6, 8)}`;
    }
    
    setDate(formatted);
  };

  const handleRegister = async () => {
    setIsLoading(true);
    setErrorMessage('');

    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        setErrorMessage('Usuário não autenticado.');
        setIsLoading(false);
        return;
      }

      const response = await axios.post(
        `${API_BASE_URL}/registerService`,
        { title, description, location, date_initial: dateInitial, date_final: dateFinal, pay, status },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 201) {
        navigation.navigate('Home');
      }
    } catch (error) {
      console.error("Erro ao registrar serviço:", error);
      setErrorMessage(
        error.response?.data?.message || 'Erro ao tentar registrar. Tente novamente.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const isButtonDisabled = !title.trim() || !description.trim() || !location.trim() || !dateInitial.trim() || !dateFinal.trim() || !pay.trim();

  return (
    <ScrollView style={styles.container}>
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#FFF" />
        </View>
      )}
      
      <Animatable.View animation="fadeInLeft" delay={500} style={styles.containerHeader}>
        <Text style={styles.message}>Publique seu Serviço</Text>
      </Animatable.View>

      <Animatable.View animation="fadeInUp" style={styles.containerForm}>
        <Text style={styles.title}>Título do Serviço</Text>
        <TextInput
          value={title}
          onChangeText={setTitle}
          placeholder="Digite seu título"
          style={styles.input}
        />
        
        <Text style={styles.title}>Descreva o Serviço</Text>
        <TextInput
          value={description}
          onChangeText={setDescription}
          placeholder="Digite sua descrição"
          style={[styles.input, { height: 120, textAlignVertical: 'top' }]}
          multiline={true}
          numberOfLines={4}  
        />

        <Text style={styles.title}>Local do Serviço</Text>
        <TextInput
          value={location}
          onChangeText={setLocation}
          placeholder="Digite a localização"
          style={styles.input}
        />
        
        <Text style={styles.title}>Data Inicial</Text>
        <TextInput
          style={styles.dateInput}
          keyboardType="numeric"
          maxLength={10}
          value={dateInitial}
          onChangeText={(text) => formatDate(text, setDateInitial)}
          placeholder="YYYY-MM-DD"
        />
        
        <Text style={styles.title}>Data Final</Text>
        <TextInput
          style={styles.dateInput}
          keyboardType="numeric"
          maxLength={10}
          value={dateFinal}
          onChangeText={(text) => formatDate(text, setDateFinal)}
          placeholder="YYYY-MM-DD"
        />
        
        <Text style={styles.title}>Pagamento</Text>
        <TextInput
          value={pay}
          onChangeText={setPay}
          placeholder="R$ 0,00"
          style={styles.input}
          keyboardType="numeric"
        />

        <Text style={styles.title}>Status</Text>
        <TextInput
          editable={false}
          value={status}
          onChangeText={setStatus}
          placeholder="Selecione o status"
          style={[styles.input, !editable && { backgroundColor: '#a1a1a1', color: 'white' }]}
        />
        
        {errorMessage !== '' && <Text style={styles.errorText}>{errorMessage}</Text>}
        
        <TouchableOpacity
          style={[styles.button, isButtonDisabled && styles.buttonDisabled]}
          onPress={handleRegister}
          disabled={isButtonDisabled}
        >
          <Text style={styles.buttonText}>Criar Serviço</Text>
        </TouchableOpacity>
      </Animatable.View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  dateInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
  },
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
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#38a69d',
    width: '100%',
    borderRadius: 4,
    paddingVertical: 8,
    marginTop: 14,
    marginBottom: 100,
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
});
