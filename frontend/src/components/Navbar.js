import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../context/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

export default function Navbar({ title }) {
  const { theme, isDarkTheme, toggleTheme } = useTheme();
  const [userName, setUserName] = useState('Usuário');
  const [menuVisible, setMenuVisible] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    async function fetchUserName() {
      const token = await AsyncStorage.getItem('token');
      setUserName('Usuário');

      // if (token) {
      //   try {
      //     // Substitua a URL com a API de informações do usuário, se houver
      //     const response = await axios.get('http://85.31.63.241:3001/me', {
      //       headers: { Authorization: `Bearer ${token}` },
      //     });
      //     setUserName(response.data.name || 'Usuário');
      //   } catch {
      //     console.error('Erro ao buscar dados do usuário.');
      //   }
      // }
    }
    fetchUserName();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.removeItem('token');
    Alert.alert('Logout', 'Você foi desconectado.');
    navigation.navigate('Welcome');
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.primary }]}>
      <Text style={[styles.title, { color: theme.text }]}>{title}</Text>
      <View style={styles.rightActions}>
        <TouchableOpacity onPress={toggleTheme} style={styles.themeToggle}>
          <Icon
            name={isDarkTheme ? 'sunny' : 'moon'}
            size={24}
            color={theme.text}
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setMenuVisible(!menuVisible)}
          style={styles.userIcon}
        >
          <Icon name="person-circle" size={30} color={theme.text} />
        </TouchableOpacity>
      </View>

      {menuVisible && (
        <View style={styles.menu}>
          <Text style={styles.menuUserName}>{userName}</Text>
          <TouchableOpacity style={styles.menuButton} onPress={() => {}}>
            <Text style={styles.menuButtonText}>Editar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuButtonLogout} onPress={handleLogout}>
            <Text style={styles.menuButtonLogoutText}>Sair</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    zIndex: 1000,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    flexShrink: 1,
    paddingHorizontal: 20,
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  themeToggle: {
    marginRight: 10,
    padding: 5,
  },
  userIcon: {
    padding: 5,
  },
  menu: {
    position: 'absolute',
    right: 10,
    top: 60,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  menuUserName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  menuButton: {
    paddingVertical: 8,
  },
  menuButtonText: {
    fontSize: 14,
    color: '#007bff',
  },
  menuButtonLogout: {
    paddingVertical: 8,
    marginTop: 10,
    backgroundColor: '#ff4d4d',
    borderRadius: 4,
    alignItems: 'center',
  },
  menuButtonLogoutText: {
    color: '#fff',
    fontSize: 14,
  },
});
