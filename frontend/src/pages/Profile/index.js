import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, Alert, Text, TouchableOpacity, Modal, ScrollView  } from 'react-native';
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
  const [errorMessage, setErrorMessage] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [passwords, setPasswords] = useState({ oldPassword: '', newPassword: '' });

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
    if (!token) return Alert.alert('Erro', 'Usuário não autenticado.');

    try {
      const response = await axios.put(
        `${API_BASE_URL}/updateUser`,
        { [field]: updatedFields[field] },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        Alert.alert('Sucesso!', 'Dados atualizados com sucesso!');
        setEditableFields({ ...editableFields, [field]: false });
        setUpdatedFields({ ...updatedFields, [field]: undefined });
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Erro ao atualizar.');
    }
  };

  const handleChangePassword = async () => {
    const token = await AsyncStorage.getItem('token');
    if (!token) return Alert.alert('Erro', 'Usuário não autenticado.');

    try {
      const response = await axios.put(
        `${API_BASE_URL}/updatePassword`,
        passwords,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        Alert.alert('Sucesso!', 'Senha alterada com sucesso!');
        setModalVisible(false);
        setPasswords({ oldPassword: '', newPassword: '' });
      }
    } catch (error) {
      Alert.alert('Erro', error.response?.data?.message || 'Falha ao mudar senha.');
    }
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View style={{ flex: 1, justifyContent: 'space-between' }}>
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
          {errorMessage !== '' && <Text style={styles.errorText}>{errorMessage}</Text>}
        </View>
  
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.deactivateButton} onPress={() => Alert.alert('Conta desativada!')}>
            <Text style={styles.buttonText}>Desativar Conta</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.changePasswordButton} onPress={() => setModalVisible(true)}>
            <Text style={styles.buttonText}>Mudar Senha</Text>
          </TouchableOpacity>
        </View>
  
        <Modal visible={modalVisible} transparent animationType="slide">
          <View style={styles.modalContainer}>
            <TextInput style={styles.input} placeholder="Senha Atual" secureTextEntry onChangeText={(text) => setPasswords({ ...passwords, oldPassword: text })} />
            <TextInput style={styles.input} placeholder="Nova Senha" secureTextEntry onChangeText={(text) => setPasswords({ ...passwords, newPassword: text })} />
            <TouchableOpacity style={styles.changePasswordButton} onPress={handleChangePassword}>
              <Text style={styles.buttonText}>Confirmar</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </View>
    </ScrollView>
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
  errorText: {
    color: 'red',
    fontSize: 14,
    marginTop: 10,
    alignSelf: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '80%',
    marginBottom: 8,
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    marginTop: 10,
    paddingHorizontal: 10,
    width: '100%',
    borderRadius: 8,
    fontSize: 16,
  },
  inputDisabled: {
    backgroundColor: '#f0f0f0', 
    color: '#888',
  },
  buttonContainer: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    width: '80%', 
    marginBottom: 20, 
  },  
  deactivateButton: { 
    backgroundColor: 'red', 
    padding: 10, 
    borderRadius: 8 
  },
  changePasswordButton: { 
    backgroundColor: 'blue', 
    padding: 10, 
    borderRadius: 8 
  },
  buttonText: { 
    color: 'white', 
    fontWeight: 'bold' 
  },
  modalContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: 'rgba(0,0,0,0.5)' 
  }
});
