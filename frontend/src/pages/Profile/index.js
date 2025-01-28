import React, { useState, useEffect } from 'react';
import { View, Image, TextInput, StyleSheet, Button, Alert, Text, TouchableOpacity } from 'react-native';
import { Navbar, Footer } from '../../components';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export default function Profile({ navigation }) {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    profileImage: '', 
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    async function loadUserData() {
      const token = await AsyncStorage.getItem('token');

      try {
        const response = await axios.get('http://85.31.63.241:3001/users', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data) {
          const data = response.data;
          setUserData({
            name: data.name,
            email: data.email,
            profileImage: data.imagem || '',
            phone_number: data.phone_number,
            cpforCnpj: data.cpforCnpj
          });
        }
      } catch (error) {
        console.error('Erro ao carregar dados do usuário:', error);
        Alert.alert('Erro', 'Não foi possível carregar os dados do perfil.');
      }
    }

    loadUserData();
  }, []); 

  const handleEdit = () => {
    setIsEditing(!isEditing); 
  };

  const handleSave = async () => {
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      Alert.alert('Erro', 'Usuário não autenticado.');
      return;
    }

    try {
      const response = await axios.put(
        'http://85.31.63.241:3001/updateUser',
        {
          name: userData.name,
          email: userData.email,
          phone_number: userData.phone_number,
          cpforCnpj: userData.cpforCnpj
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      
      if (response.status === 200) {
        Alert.alert('Sucesso!', 'Dados do perfil atualizados com sucesso!');
        setIsEditing(false);
      } else {
        throw new Error('Não foi possível salvar');
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
        <View style={styles.imageContainer}>
          <Image 
            source={{ uri: userData.profileImage }} 
            style={styles.profileImage} 
          />
        </View>

        <TextInput
          style={styles.input}
          value={userData.name}
          onChangeText={(text) => setUserData({ ...userData, name: text })}
          editable={isEditing}
          placeholder="Nome"
        />
        <TextInput
          style={styles.input}
          value={userData.email}
          onChangeText={(text) => setUserData({ ...userData, email: text })}
          editable={isEditing}
          placeholder="E-mail"
        />

        <TextInput
          style={styles.input}
          value={userData.phone_number}
          onChangeText={(text) => setUserData({ ...userData, phone_number: text })}
          editable={isEditing}
          placeholder="Telefone"
        />

        <TextInput
          style={styles.input}
          value={userData.cpforCnpj}
          onChangeText={(text) => setUserData({ ...userData, cpforCnpj: text })}
          editable={isEditing}
          placeholder="Cpf/Cnpj"
        />

        <TouchableOpacity style={styles.forgotPassword} onPress={() => Alert.alert("Atenção", "Funcionalidade em desenvolvimento!")}>
          <Text style={styles.forgotPasswordText}>Esqueceu a senha?</Text>
        </TouchableOpacity>

        {isEditing ? (
          <Button title="Salvar" onPress={handleSave} />
        ) : (
          <Button title="Editar" onPress={handleEdit} />
        )}
      </View>

      <Footer/>
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
  },
  input: {
    height: 45,
    borderColor: '#ccc',
    borderWidth: 1,
    marginTop: 15,
    paddingLeft: 10,
    width: '100%',
    borderRadius: 8,
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImage: {
    width: 100,
    height: 100,
    backgroundColor: '#ccc',
    borderRadius: 50,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 40,
    color: '#fff',
    fontWeight: 'bold',
  },
});
