import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../context/ThemeContext';
import { useNavigation } from '@react-navigation/native';

export default function Footer({ setSelected }) {
  const { theme } = useTheme();
  const navigation = useNavigation();

  const selected = parseInt(setSelected, 10); 

  return (
    <View style={[styles.container, { backgroundColor: theme.primary }]}>
      <TouchableOpacity 
        style={[styles.button, { opacity: selected === 0 ? 1 : 0.5 }]} 
        onPress={() => navigation.navigate('Home')}
      >
        <Icon name={selected === 0 ? 'home' : 'home-outline'} size={24} color={theme.text} />
        <Text style={[styles.label, { color: theme.text }]}>Início</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.button, { opacity: selected === 1 ? 1 : 0.5 }]} 
        onPress={() => navigation.navigate('ApiTest')}
      >
        <Icon name={selected === 1 ? 'search' : 'search-outline'} size={24} color={theme.text} />
        <Text style={[styles.label, { color: theme.text }]}>Buscar</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.button, { opacity: selected === 2 ? 1 : 0.5 }]} 
        onPress={() => navigation.navigate('Profile')}
      >
        <Icon name={selected === 2 ? 'person' : 'person-outline'} size={24} color={theme.text} />
        <Text style={[styles.label, { color: theme.text }]}>Perfil</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 70,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 15,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    marginTop: 3,
    fontSize: 12,
  },
});
