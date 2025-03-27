import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

export default function Footer({ setSelected }) {
  const navigation = useNavigation();
  const selected = parseInt(setSelected, 10); 

  return (
    <View style={[styles.container, { backgroundColor: '#38a69d' }]}>
      {/* ServicesRegister */}
      <TouchableOpacity 
        style={[styles.button, { opacity: selected === 0 ? 1 : 0.5 }]} 
        onPress={() => navigation.navigate('ServicesRegister')}
      >
        <Icon name={selected === 0 ? 'rocket' : 'rocket-outline'} size={24} color={'#212121'} />
        <Text style={[styles.label, {  color: '#212121' }]}>Serviços</Text>
      </TouchableOpacity>

      {/* ServicesList */}
      <TouchableOpacity 
        style={[styles.button, { opacity: selected === 1 ? 1 : 0.5 }]} 
        onPress={() => navigation.navigate('ServicesList')}
      >
        <Icon name={selected === 1 ? 'home' : 'home-outline'} size={24} color={'#212121'} />
        <Text style={[styles.label, { color: '#212121' }]}>Início</Text>
      </TouchableOpacity>

      {/* Profile */}
      <TouchableOpacity 
        style={[styles.button, { opacity: selected === 2 ? 1 : 0.5 }]} 
        onPress={() => navigation.navigate('Profile')}
      >
        <Icon name={selected === 2 ? 'person' : 'person-outline'} size={24} color={'#212121'} />
        <Text style={[styles.label, { color: '#212121' }]}>Perfil</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,              
    left: 0,
    right: 0,
    height: 70,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 15,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
    zIndex: 1000, 
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
