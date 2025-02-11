import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import API_BASE_URL from '../../config';
import Icon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';

export default function Home() {
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(false); 

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

    fetchServices();
  }, []);

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
    <>
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#FFF" />
        </View>
      )}
      
      <FlatList
        data={services}
        renderItem={renderCard}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.container} 
      />
    </>
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
    paddingHorizontal: 15,
    paddingBottom: 70,
    paddingTop: 80,
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