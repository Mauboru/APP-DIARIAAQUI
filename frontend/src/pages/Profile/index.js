import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, Alert, Text, TouchableOpacity } from 'react-native';
import { Navbar, Footer } from '../../components';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { MaterialIcons } from '@expo/vector-icons';
import API_BASE_URL from '../../config';

const formatPhoneNumber = (value) => {
  value = value.replace(/\D/g, '');
  if (value.length == 0) {
    value = '';
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

export default function Profile({ navigation }) {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    profileImage: '',
    phone_number: '',
    cpforCnpj: ''
  });
  const [editableFields, setEditableFields] = useState({});
  const [updatedFields, setUpdatedFields] = useState({});

  useEffect(() => {
    async function loadUserData() {
      const token = await AsyncStorage.getItem('token');
      try {
        const response = await axios.get(`${API_BASE_URL}/users`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data) {
          setUserData(response.data);
        }
      } catch (error) {
        console.error('Erro ao carregar dados do usuário:', error);
        Alert.alert('Erro', 'Não foi possível carregar os dados do perfil.');
      }
    }
    loadUserData();
  }, []);

  const handleEdit = (field) => {
    setEditableFields({ ...editableFields, [field]: !editableFields[field] });
  };

  const handleChange = (field, value) => {
    setUserData({ ...userData, [field]: value });
    setUpdatedFields({ ...updatedFields, [field]: value });
  };

  const handleSave = async (field) => {
    if (!updatedFields[field]) {
      setEditableFields({ ...editableFields, [field]: false });
      return;
    }

    const token = await AsyncStorage.getItem('token');
    if (!token) {
      Alert.alert('Erro', 'Usuário não autenticado.');
      return;
    }

    try {
      let data = { [field]: updatedFields[field] };

      // Limpar o número de telefone antes de enviar para o servidor
      if (field === 'phone_number') {
        data = { phone_number: cleanPhoneNumber(updatedFields[field]) };
      }

      const response = await axios.put(
        `${API_BASE_URL}/updateUser`,
        data,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        Alert.alert('Sucesso!', 'Dados do perfil atualizados com sucesso!');
        setEditableFields({ ...editableFields, [field]: false });
        setUpdatedFields({ ...updatedFields, [field]: undefined });
      }
    } catch (error) {
      console.error('Erro ao salvar os dados:', error);
      Alert.alert('Erro', 'Não foi possível salvar as alterações.');
    }
  };

  return (
    <View style={styles.container}>
      <Navbar title="Perfil de Usuário" onBack={() => navigation.goBack()} showBackButton={true} />
      <View style={styles.content}>
        {['name', 'email', 'phone_number', 'cpforCnpj'].map((field) => (
          <View key={field} style={styles.inputContainer}>
            <TextInput
              style={[styles.input, !editableFields[field] && styles.inputDisabled]}
              value={field === 'phone_number' ? formatPhoneNumber(userData[field]) : userData[field]}
              onChangeText={(text) => handleChange(field, text)}
              editable={editableFields[field] || false}
              placeholder={field.replace('_', ' ')}
            />
            <TouchableOpacity onPress={() => editableFields[field] ? handleSave(field) : handleEdit(field)}>
              <MaterialIcons
                name={editableFields[field] ? 'check' : 'edit'}
                size={24}
                color={editableFields[field] ? 'green' : 'black'}
              />
            </TouchableOpacity>
          </View>
        ))}
      </View>
      <Footer />
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
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '80%',
    marginBottom: 8,
  },
  input: {
    height: 45,
    borderColor: '#ccc',
    borderWidth: 1,
    marginTop: 10,
    marginBottom: 5,
    paddingHorizontal: 10,
    width: '100%',
    borderRadius: 8,
    fontSize: 16,
  },
  inputDisabled: {
    backgroundColor: '#f0f0f0', 
    color: '#888',
  },
});
