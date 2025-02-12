import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import API_BASE_URL from '../../config';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import * as Animatable from 'react-native-animatable';

export default function Home() {
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(false); 
  const [filter, setFilter] = useState('all');
  const [userId, setUserId] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    setIsLoading(true);
    const fetchServices = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/getService`);

        if (response.data && response.data.services && Array.isArray(response.data.services)) {
          setServices(response.data.services); 
        } else {
          console.error('Dados de serviços inválidos.');
        }
      } catch (error) {
        console.error('Erro ao buscar os serviços:', error);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchUserId = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem('userId');
        if (storedUserId !== null) {
          setUserId(parseInt(storedUserId, 10));
        }
      } catch (error) {
        console.error('Erro ao recuperar userId:', error);
      }
    };
    

    fetchUserId();
    fetchServices();
  }, []);

  const filteredServices = filter === 'mine' ? services.filter(service => service.employer.id === userId) : services;

  const renderCard = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.contractor}>Contratante: {item.employer.name}</Text>
      <Text style={styles.description}>{item.description}</Text>
      <View style={styles.locationContainer}>
        <Icon name="location" size={20} color="red" /> 
        <Text>{item.location}</Text>
      </View>
      <Text>{item.date_initial} - {item.date_final}</Text>
      <Text style={styles.pay}>
        Pagamento: <Text style={{ color: '#27ae60' }}>R${item.pay}</Text>
      </Text>
      <Text style={styles.status}>
        Status: <Text style={{ color: item.status === 'open' ? '#27ae60' : '#e74c3c' }}>{item.status}</Text>
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#FFF" />
        </View>
      )}
  
      <Animatable.View animation="fadeInLeft" delay={500} style={styles.containerHeader}>
        <Text style={styles.message}>Se Inscreva em um!</Text>
      </Animatable.View>
  
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'all' && styles.activeButton]}
          onPress={() => setFilter('all')}
        >
          <Text style={styles.filterText}>Todos</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'mine' && styles.activeButton]}
          onPress={() => setFilter('mine')}
        >
          <Text style={styles.filterText}>Meus</Text>
        </TouchableOpacity>
      </View>
  
      <Animatable.View animation="fadeInUp" style={styles.cardContainer}>
        {filter === 'mine' && filteredServices.length === 0 ? (
          <View style={styles.messageContainer}>
            <Text style={styles.messageText}>Você não possui serviços cadastrados.</Text>
            <TouchableOpacity style={styles.registerButton} onPress={() => navigation.navigate('Servicos')}>
              <Text style={styles.registerButtonText}>Publicar Serviço</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={filteredServices}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.contractor}>Contratante: {item.employer.name}</Text>
                <Text style={styles.description}>{item.description}</Text>
                <View style={styles.locationContainer}>
                  <Icon name="location" size={20} color="red" />
                  <Text>{item.location}</Text>
                </View>
                <Text>{item.date_initial} - {item.date_final}</Text>
                <Text style={styles.pay}>
                  Pagamento: <Text style={{ color: '#27ae60' }}>R${item.pay}</Text>
                </Text>
                <Text style={styles.status}>
                  Status: <Text style={{ color: item.status === 'open' ? '#27ae60' : '#e74c3c' }}>{item.status}</Text>
                </Text>
              </View>
            )}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        )}
      </Animatable.View>
    </View>
  );  
}

const styles = StyleSheet.create({
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
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 15,
    backgroundColor: 'transparent',
  },
  filterButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: '#ddd',
  },
  activeButton: {
    backgroundColor: '#27ae60',
  },
  filterText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  cardContainer: {
    flex: 1,
    backgroundColor: '#ebffdb',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 15,
    marginTop: 10,
  },
  card: {
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  contractor: {
    fontSize: 14,
    color: '#555',
    marginVertical: 5,
  },
  description: {
    fontSize: 16,
    color: '#666',
    marginVertical: 5,
  },
  pay: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
});
