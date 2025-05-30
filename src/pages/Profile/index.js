import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, Alert, Text, TouchableOpacity, Modal, ScrollView, Image, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Icon from 'react-native-vector-icons/Ionicons';
import API_BASE_URL from '../../config';
import * as Animatable from 'react-native-animatable';
import { useNavigation } from '@react-navigation/native';
import Footer from '../../components/Footer';

// isso deve virar um validator
const formatPhoneNumber = (value) => {
  value = value.replace(/\D/g, '');
  if (value.length === 0) {
    return '';
  } else if (value.length <= 2) {
    return `(${value}`;
  } else if (value.length <= 7) {
    return `(${value.substring(0, 2)}) ${value.substring(2)}`;
  } else {
    return `(${value.substring(0, 2)}) ${value.substring(2, 3)} ${value.substring(3, 7)}-${value.substring(7, 11)}`;
  }
};

const cleanPhoneNumber = (value) => {
  const cleanedValue = value.replace(/\D/g, '');
  return `+55${cleanedValue}`;
};

export default function Profile() {
  const [isLoading, setIsLoading] = useState(false); 
  const [reloadData, setReloadData] = useState(false);
  const [userData, setUserData] = useState({ name: '', email: '', phone_number: '', cpforCnpj: '' });
  const [updatedFields, setUpdatedFields] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [passwords, setPasswords] = useState({ oldPassword: '', newPassword: '' });
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState('');
  const [passwordColor, setPasswordColor] = useState('red');
  const [profileImage, setProfileImage] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const navigation = useNavigation();
  const [errorMessage, setErrorMessage] = useState('');
  const [phoneMessage, setPhoneMessage] = useState(null);

  useEffect(() => {
    async function loadUserData() {
      const token = await AsyncStorage.getItem('token');
      try {
        const response = await axios.get(`${API_BASE_URL}/users/getAllUser`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data) {
          setUserData(response.data);
          const profileNumber = response.data.profile_image;
          setProfileImage(profileNumber);
          setIsPhoneVerified(response.data.verified_phone);
        }
      } catch (error) {
        Alert.alert('Erro', 'Não foi possível carregar os dados do perfil.');
      }
    }
    loadUserData();
  }, [reloadData]);

  const handleEditSave = async () => {
    if (isEditing) {  
      const token = await AsyncStorage.getItem('token');
      if (!token) return Alert.alert('Erro', 'Usuário não autenticado.');
  
      try {
        setIsLoading(true);
        const cleanedPhoneNumber = cleanPhoneNumber(userData.phone_number);

        const dataToUpdate = {
          ...updatedFields,
          phone_number: cleanedPhoneNumber, 
        };

        await axios.put(`${API_BASE_URL}/users/update`, dataToUpdate, {
          headers: { Authorization: `Bearer ${token}` },
        });
  
        Alert.alert('Sucesso!', 'Dados atualizados com sucesso!');
        setErrorMessage('');
        setIsEditing(false);
        setUpdatedFields({});
        setReloadData((prevState) => !prevState);
      } catch (error) {
        setErrorMessage(error.response.data.message);
      } finally {
        setIsLoading(false);
      }
    } else {
      setIsEditing(true);
    }
    useEffect();
  };

  const handleChangePassword = async () => {
    const token = await AsyncStorage.getItem('token');
    if (!token) return Alert.alert('Erro', 'Usuário não autenticado.');

    if (!passwords.oldPassword || !passwords.newPassword) {
      return Alert.alert('Erro', 'Por favor, preencha ambas as senhas.');
    }

    try {
      const response = await axios.put(
        `${API_BASE_URL}/users/updatePassword`,
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

  const handleLogout = async () => {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('userId');
    navigation.reset({
      index: 0,
      routes: [{ name: 'Welcome' }],
    });
  };

  const handleDeactivate = async () => {
    const token = await AsyncStorage.getItem('token');
    if (!token) return Alert.alert('Erro', 'Usuário não autenticado.');

    const userId = userData.id;

    try {
      await axios.patch(
        `${API_BASE_URL}/users/deactivate/${userId}`,
        {}, 
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      handleLogout();
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Erro desconhecido');
    }
    
  };

  const profileImages = {
    1: require('../../assets/profiles/image1.png'),
    2: require('../../assets/profiles/image2.png'),
    3: require('../../assets/profiles/image3.png'),
    4: require('../../assets/profiles/image4.png'),
    5: require('../../assets/profiles/image5.png'),
    6: require('../../assets/profiles/image6.png'),
    7: require('../../assets/profiles/image7.png'),
    8: require('../../assets/profiles/image8.png'),
    9: require('../../assets/profiles/image9.png'),
    10: require('../../assets/profiles/image10.png'),
  };

  const getProfileImageUrl = (profileNumber) => {
    return profileImages[profileNumber];
  };

  return (
    <View style={{ flex: 1 }}>
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#FFF" />
        </View>
      )}
      
      <ScrollView contentContainerStyle={[styles.container, { flexGrow: 1 }]}>
        <Animatable.View animation="fadeInDown" style={styles.profileContainer}>
          <Image source={getProfileImageUrl(userData.profile_image)} style={styles.profileImage} />
          <Text style={styles.username}>{userData.name || 'Usuário'}</Text>
        </Animatable.View>

        <Animatable.View animation="fadeInUp" style={styles.content}>
          {['name', 'email', 'phone_number', 'cpf_or_cnpj'].map((field) => (
            <View key={field} style={styles.inputContainer}>
              <TextInput
                style={!isEditing? styles.inputDisabled : styles.inputEnabled}
                value={field === 'phone_number' ? formatPhoneNumber(userData[field]) : userData[field]}
                editable={isEditing}
                placeholder={field.replace('_', ' ')}
                onChangeText={(text) => {
                  const formattedText = field === 'cpforCnpj' ? text.replace(/\D/g, '') : text;
                  setUserData((prev) => ({ ...prev, [field]: formattedText }));
                  setUpdatedFields((prev) => ({ ...prev, [field]: formattedText }));
                }}
              />

              {field === 'phone_number' && phoneMessage && (
                <View style={styles.phoneMessage}>
                  <Text style={styles.phoneMessageText}>{phoneMessage}</Text>
                </View>
              )}
              {/* Ícone ao lado do campo de telefone */}
              {field === 'phone_number' && (
                <Icon 
                  name={isPhoneVerified ? 'checkmark-circle' : 'alert-circle'} 
                  size={24} 
                  color={isPhoneVerified ? 'green' : 'red'} 
                  style={styles.icon} 
                  onPress={() => {
                    if (isPhoneVerified) {
                      setPhoneMessage('Número verificado ✔');
                      setTimeout(() => setPhoneMessage(null), 3000);
                    } else {
                      navigation.navigate('PhoneVerification');
                    }
                  }} 
                />
              )}
            </View>
          ))}

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={[styles.button, styles.logoutButton]} onPress={handleLogout}>
              <Text style={styles.buttonText}>Logout</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => setModalVisible(true)}>
              <Text style={styles.buttonText}>Mudar Senha</Text>
            </TouchableOpacity>
            <View style={{ backgroundColor: 'green', borderRadius: 8 }}>
              <TouchableOpacity onPress={handleEditSave} style={{ padding: 10 }}>
                <Icon name={isEditing ? 'save' : 'pencil'} size={24} color="white" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.separator} />

          {errorMessage !== '' && <Text style={styles.errorText}>{errorMessage}</Text>}
        
          <TouchableOpacity
            onPress={() =>
              Alert.alert(
                'Confirmar Desativação',
                'Tem certeza de que deseja desativar sua conta?',
                [
                  {
                    text: 'Cancelar',
                    style: 'cancel',
                  },
                  {
                    text: 'Desativar',
                    style: 'destructive', 
                    onPress: handleDeactivate,
                  },
                ],
                { cancelable: false }
              )
            }
            style={styles.deactivateButton}
          >
            <Text style={styles.buttonText}>Desativar Conta</Text>
          </TouchableOpacity>
        </Animatable.View>

        {/* Modal para mudar senha */}
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
                  <Icon name={isPasswordVisible ? 'eye-off' : 'eye'} size={24} color="#a1a1a1" />
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
      <Footer setSelected={2}/>
    </View>
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
    backgroundColor: '#2a7d76',
    alignItems: 'center',
  },
  separator: {
    width: '100%',
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 40,
  },
  deactivateButton: {
    backgroundColor: 'red',
    padding: 15,
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
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
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
    backgroundColor: 'green',
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
  },
  profileContainer: {
    alignItems: 'center',
    marginTop: 150,
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#ddd',
  },
  username: {
    marginTop: 10,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  content: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 12,
  },
  inputEnabled: {
    color: 'black',
    flex: 1,
    height: 45,
    fontSize: 16,
  },
  inputDisabled: {
    color: 'grey',
    flex: 1,
    height: 45,
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
  },
  button: {
    flex: 1,
    backgroundColor: '#007BFF',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  logoutButton: {
    backgroundColor: 'red',
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginBottom: 30,
    alignSelf: 'center',
  }, 
  phoneMessage: {
    position: 'absolute',
    top: -30, 
    backgroundColor: 'black',
    padding: 5,
    borderRadius: 5,
    zIndex: 10,
    elevation: 5,
  },
  phoneMessageText: {
    color: 'white',
    fontSize: 12,
  },  
});