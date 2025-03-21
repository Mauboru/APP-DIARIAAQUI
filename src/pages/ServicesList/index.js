import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import API_BASE_URL from '../../config';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import * as Animatable from 'react-native-animatable';

export default function ServicesList() {
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(false); 
  const [filter, setFilter] = useState('all');
  const [userId, setUserId] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    setIsLoading(true);
  
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
    fetchServicesUnsubscribed();
  }, []);

  const fetchServicesSubscribed = async () => {
    setIsLoading(true);
    try {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
            setErrorMessage('Usuário não autenticado.');
            setIsLoading(false);
            return;
        }

        const response = await axios.get(`${API_BASE_URL}/services/getSubscribedService`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        if (response.data && response.data.services && Array.isArray(response.data.services)) {
            setServices(response.data.services);
        } else {
            console.error('Dados de serviços inválidos.', response.data);
        }
    } catch (error) {
        console.error('Erro ao buscar os serviços:', error);
    } finally {
        setIsLoading(false);
    }
};

  const fetchServicesUnsubscribed = async () => {
    setIsLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        setErrorMessage('Usuário não autenticado.');
        setIsLoading(false);
        return;
      }
  
      const response = await axios.get(`${API_BASE_URL}/services/getUnsubscribedService`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (response.data && response.data.services && Array.isArray(response.data.services)) {
        setServices(response.data.services);
      } else {
        console.error('Dados de serviços inválidos.', response.data);
      }
    } catch (error) {
      console.error('Erro ao buscar os serviços:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const subscribeService = async (service_id) => {
    setIsLoading(true);

    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        setErrorMessage('Usuário não autenticado.');
        setIsLoading(false);
        return;
      }

      const response = await axios.post(
        `${API_BASE_URL}/services/subscribe`,
        { service_id, message: 'standard' },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 201) {
        await fetchServicesUnsubscribed();
        setErrorMessage('');
      }
    } catch (error) {
      console.error("Erro ao se inscrever no serviço:", error);
      setErrorMessage(
        error.response?.data?.message || 'Erro ao tentar se inscrever. Tente novamente.'
      );
    } finally {
      setIsLoading(false);
    }
  }

  const unsubscribeService = async (service_id) => {
    setIsLoading(true);

    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        setErrorMessage('Usuário não autenticado.');
        setIsLoading(false);
        return;
      }

      const response = await axios.post(
        `${API_BASE_URL}/services/unsubscribe/${service_id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 201) {
        await fetchServicesSubscribed();
        setErrorMessage('');
      }
    } catch (error) {
      console.error("Erro ao se desinscrever do serviço:", error);
      setErrorMessage(
        error.response?.data?.message || 'Erro ao tentar desinscrever. Tente novamente.'
      );
    } finally {
      setIsLoading(false);
    }
  }

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
        <Text style={styles.filterText}>Novos</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'subscriptions' && styles.activeButton]}
          onPress={() => setFilter('subscriptions')}
        >
        <Text style={styles.filterText}>Inscrições</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'mine' && styles.activeButton]}
          onPress={() => setFilter('mine')}
        >
        <Text style={styles.filterText}>Meus</Text>
        </TouchableOpacity>
      </View>

      {errorMessage !== '' && <Text style={styles.errorText}>{errorMessage}</Text>}

      <Animatable.View animation="fadeInUp" style={styles.cardContainer}>
        {filter === 'mine' && services.length === 0 ? (
          <View style={styles.messageContainer}>
            <Text style={styles.messageText}>Você não possui serviços cadastrados.</Text>
            <TouchableOpacity style={styles.registerButton} onPress={() => navigation.navigate('ServicesRegister')}>
              <Text style={styles.registerButtonText}>Publicar Serviço</Text>
            </TouchableOpacity>
          </View>
        ) : services.length === 0 ? (
          <View style={styles.noRecordsContainer}>
            <Text style={styles.noRecordsText}>Nenhum serviço disponível.</Text>
          </View>
        ) : (
          <FlatList
            data={services}
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

                {/* Botão de inscrição ou desinscrição */}
                {filter === 'subscriptions' ? (
                  <TouchableOpacity style={styles.unsubscribeButton} onPress={() => unsubscribeService(item.id)}>
                    <Text style={styles.subscribeButtonText}>Cancelar Inscrição</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity style={styles.subscribeButton} onPress={() => subscribeService(item.id)}>
                    <Text style={styles.subscribeButtonText}>Me Inscrever</Text>
                  </TouchableOpacity>
                )}
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
  subscribeButton: {
    marginTop: 10,
    backgroundColor: '#27ae60',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  unsubscribeButton: {
    marginTop: 10,
    backgroundColor: 'tomato',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  subscribeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginTop: 10,
    alignSelf: 'center',
  }, 
  noRecordsContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  noRecordsText: {
    fontSize: 18,
    color: '#555',
    fontWeight: 'bold',
  },
});
