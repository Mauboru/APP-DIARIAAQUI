import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../context/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import API_BASE_URL from '../config';

export default function Navbar({ title }) {
  const { theme, isDarkTheme, toggleTheme } = useTheme();
  const [userName, setUserName] = useState('Usuário');
  const [profileImage, setProfileImage] = useState(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    async function fetchUserName() {
      const token = await AsyncStorage.getItem('token');
      
      if (token) {
        try {
          const response = await axios.get(`${API_BASE_URL}/users`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          if (response.data.name) {
            setUserName(response.data.name); 
          } else {
            console.error('Erro ao buscar nome do usuário');
            setUserName('Usuário');
          }
          const profileNumber = response.data.profileImage;
          setProfileImage(profileNumber);
        } catch (error) {
          console.error('Erro ao buscar dados do usuário:', error); 
        }
      }
    }
    fetchUserName();
  }, []); 

  const handleLogout = async () => {
    await AsyncStorage.removeItem('token');
    navigation.navigate('Welcome');
  };

  const profileImages = {
    1: require('../assets/profiles/image1.png'),
    2: require('../assets/profiles/image2.png'),
    3: require('../assets/profiles/image3.png'),
    4: require('../assets/profiles/image4.png'),
    5: require('../assets/profiles/image5.png'),
    6: require('../assets/profiles/image6.png'),
    7: require('../assets/profiles/image7.png'),
    8: require('../assets/profiles/image8.png'),
    9: require('../assets/profiles/image9.png'),
    10: require('../assets/profiles/image10.png'),
  };  

  const getProfileImageUrl = (profileNumber) => {
    return profileImages[profileNumber];
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.primary }]}>
      <Text style={[styles.title, { color: theme.text }]}>{title}</Text>
      <View style={styles.rightActions}>
        <TouchableOpacity
          onPress={() => setMenuVisible(!menuVisible)}
          style={styles.userIcon}
        >
          {profileImage ? (
            <Image
              source={getProfileImageUrl(profileImage)}
              style={styles.profileImage}
            />
          ) : (
            <Icon name="person-circle" size={30} color={theme.text} />
          )}
        </TouchableOpacity>
      </View>

      {menuVisible && (
        <View style={styles.menu}>
          <Text style={styles.menuUserName}>{userName}</Text>
          <TouchableOpacity style={styles.menuButton} onPress={() => navigation.navigate('Profile')}>
            <Text style={styles.menuButtonText}>Editar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuButton} onPress={() => navigation.navigate('CanalSueste')}>
            <Text style={styles.menuButtonText}>CanalSueste</Text>
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
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 50,
  }
});
