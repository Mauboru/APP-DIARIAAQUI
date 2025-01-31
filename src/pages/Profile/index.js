import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, Alert, Text, TouchableOpacity, Modal, ScrollView  } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
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

export default function Profile() {
  const [userData, setUserData] = useState({ name: '', email: '', phone_number: '', cpforCnpj: '' });
  const [editableFields, setEditableFields] = useState({});
  const [updatedFields, setUpdatedFields] = useState({});
  const [errorMessage, setErrorMessage] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [passwords, setPasswords] = useState({ oldPassword: '', newPassword: '' });
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState('');
  const [passwordColor, setPasswordColor] = useState('red');

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

    if (!passwords.oldPassword || !passwords.newPassword) {
      return Alert.alert('Erro', 'Por favor, preencha ambas as senhas.');
    }

    try {
      const response = await axios.put(
        `${API_BASE_URL}/updatePassword`,
        {
          old_password: passwords.oldPassword,
          new_password: passwords.newPassword,
        },
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

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
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

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
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
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.deactivateButton} onPress={() => Alert.alert('Conta desativada!')}>
            <Text style={styles.buttonText}>Desativar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.changePasswordButton} onPress={() => setModalVisible(true)}>
            <Text style={styles.buttonText}>Mudar Senha</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.titlePassword}>Alterar Senha</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                value={passwords.oldPassword}
                onChangeText={(text) => setPasswords({ ...passwords, oldPassword: text })}
                secureTextEntry={!isPasswordVisible}
                placeholder="Sua senha antiga"
                style={styles.passwordInput} 
              />
              <TouchableOpacity onPress={togglePasswordVisibility} style={styles.iconContainer}>
                <Ionicons
                  name={isPasswordVisible ? 'eye-off' : 'eye'} 
                  size={24}
                  color="#a1a1a1"
                />
              </TouchableOpacity>
            </View>
            <View style={styles.passwordContainer}>
              <TextInput
                value={passwords.newPassword}
                onChangeText={(text) => {
                  setPasswords({ ...passwords, newPassword: text });
                  validatePassword(text);
                }}
                secureTextEntry={!isPasswordVisible}
                placeholder="Sua senha nova"
                style={styles.passwordInput} 
              />
            </View>
            <Text style={{ color: passwordColor, fontSize: 12, marginTop: 4 }}>{passwordMessage}</Text>
            <TouchableOpacity onPress={() => Alert.alert("Atenção", "Funcionalidade em desenvolvimento!")}>
              <Text>Esqueceu a senha?</Text>
            </TouchableOpacity>
            <View style={styles.modalButtonsContainer}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={handleChangePassword}>
                <Text style={styles.buttonText}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 30,
    backgroundColor: '#fff'
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
    width: '100%',
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
    marginTop: 20,
    width: '80%'
  },
  deactivateButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 8,
  },
  changePasswordButton: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '80%',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    width: '100%',
  },
  cancelButton: {
    backgroundColor: 'grey',
    padding: 10,
    borderRadius: 8,
    width: '45%',
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 8,
    width: '45%',
    alignItems: 'center',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1, 
    marginBottom: 12,
  },
  passwordInput: {
    flex: 1, 
    height: 40,
    fontSize: 16,
    padding: 0,
  },
  titlePassword: {
    color: 'black',
    fontSize: 18,
    marginTop: 10,
    marginBottom: 10,
    alignSelf: 'center',
  }
});
