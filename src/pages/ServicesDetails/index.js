import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, Pressable } from 'react-native';
import * as Animatable from 'react-native-animatable';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Footer from '../../components/Footer';
import axios from 'axios';
import API_BASE_URL from '../../config';
import Icon from 'react-native-vector-icons/Ionicons';

export default function ServicesDetails({ route }) {
  const [token, setToken] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { service } = route.params;

  // Buscando token ao iniciar a tela
  useEffect(() => {
    (async () => {
      const storedToken = await AsyncStorage.getItem('token');
      if (storedToken) setToken(storedToken);
    })();
  }, []);

  return (
    <View style={styles.container}>
        {/* Loading */}
        {isLoading && (<View style={styles.loadingOverlay}><ActivityIndicator size="large" color="#FFF"/></View> )}
      
        {/* Titulo */}
        <Animatable.View animation="fadeInLeft" delay={500} style={styles.containerHeader}>
            <Text style={styles.message}>Edite seu Serviço!</Text>
        </Animatable.View>
      
        <Animatable.View animation="fadeInUp" style={styles.cardContainer}>
            <Text style={styles.text}>{service.title}</Text>
            <Text style={styles.text}>{service.pay}</Text>
            <Text style={styles.text}>{service.status}</Text>
        </Animatable.View>
        {/* Footer */}
        <Footer setSelected={1}/>
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
    flex: 1,
    backgroundColor: '#38a69d',
  },
  containerHeader: {
    marginTop: '14%',
    marginBottom: '8%',
    paddingStart: '5%',
  },
  message: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFF',
  },  
  text: {
    fontSize: 18,
    color: '#555',
    fontWeight: 'bold',
  },  
  cardContainer: {
    flex: 1,
    backgroundColor: '#ebffdb',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 15,
    marginTop: 10,
  },
});
