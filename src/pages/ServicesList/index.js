import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, Pressable } from 'react-native';
import * as Animatable from 'react-native-animatable';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import API_BASE_URL from '../../config';
import Footer from '../../components/Footer';
import { useNavigation } from '@react-navigation/native';

export default function ServicesList() {
  const [token, setToken] = useState('');
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState('all');
  const navigation = useNavigation();

  // Buscando token ao iniciar a tela
  useEffect(() => {
    (async () => {
      const storedToken = await AsyncStorage.getItem('token');
      if (storedToken) setToken(storedToken);
    })();
  }, []);

  // Buscando servicos ao atualizar a tela
  useEffect(() => {
    getServices();
  }, [filter]);

  const getServices = async () => {
    setIsLoading(true);
    setServices([]);
    try {
      let url;

      if (filter === 'subscriptions') {
        url = `${API_BASE_URL}/services/getSubscribedService`;
      } else if (filter === 'myServices') {
        url = `${API_BASE_URL}/services/getMyServices`;
      } else {
        url = `${API_BASE_URL}/services/getUnsubscribedService`;
      }
      
      const response = await axios.get(url, { headers: { Authorization: `Bearer ${token}` } });
      const servicesData = response.data.services;

      if (servicesData === 0) setServices([]);
      else setServices(servicesData);
    } catch (error) {
      setServices([])
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const subscribeService = async (service_id) => {
    setIsLoading(true);
    try {
      await axios.post(`${API_BASE_URL}/services/subscribe`, { service_id, message: 'standard' }, { headers: { Authorization: `Bearer ${token}` } });
      getServices();
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const unsubscribeService = async (service_id) => {
    setIsLoading(true);
    try {
      await axios.delete(`${API_BASE_URL}/services/unsubscribe/${service_id}`, { headers: { Authorization: `Bearer ${token}` } });
      getServices();
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Loading */}
      {isLoading && (<View style={styles.loadingOverlay}><ActivityIndicator size="large" color="#FFF"/></View> )}
      
      {/* Titulo */}
      <Animatable.View animation="fadeInLeft" delay={500} style={styles.containerHeader}>
        <Text style={styles.message}>Se Inscreva em um!</Text>
      </Animatable.View>

      {/* Filtros */}
      <View style={styles.filterContainer}>
        <TouchableOpacity style={[styles.filterButton, filter === 'all' && styles.activeButton]} onPress={() => setFilter('all')}>
          <Text style={styles.filterText}>Novos</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.filterButton, filter === 'subscriptions' && styles.activeButton]} onPress={() => setFilter('subscriptions')}>
          <Text style={styles.filterText}>Inscrições</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.filterButton, filter === 'myServices' && styles.activeButton]} onPress={() => setFilter('myServices')}>
          <Text style={styles.filterText}>Meus</Text>
        </TouchableOpacity>
      </View>

      {/* Cards */}
      <Animatable.View animation="fadeInUp" style={styles.cardContainer}>
        {services.length === 0 ? (
          <View style={styles.noRecordsContainer}>
            <Text style={styles.noRecordsText}>{"Nenhum serviço disponível."}</Text>
          </View>
        ) : (
          <FlatList
            data={services}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <Pressable
                onPress={() => navigation.navigate('ServicesDetails', { service: item })}
                android_ripple={{ color: '#ccc' }}
                style={({ pressed }) => [
                  { opacity: pressed ? 0.8 : 1 },
                ]}
              >
                <Animatable.View animation="fadeInUp" style={styles.card}>
                  <Text style={styles.title}>{item.title}</Text>
            
                  {filter === 'myServices' ? (
                    <>
                      <Text
                        style={[
                          styles.status,
                          item.status === 'Aberto' && { backgroundColor: 'green', color: 'white' },
                          item.status === 'Andamento' && { backgroundColor: 'orange', color: 'white' },
                          item.status === 'Concluido' && { backgroundColor: 'blue', color: 'white' },
                        ]}
                      >
                        Status: {item.status}
                      </Text>
                      <Text style={styles.pay}>Pagamento: {item.pay}</Text>
                      <Text>Você tem {item.qtdWorkers} inscritos!</Text>
                    </>
                  ) : (
                    <>
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
            
                      {filter === 'subscriptions' ? (
                        <TouchableOpacity
                          style={styles.unsubscribeButton}
                          onPress={() => unsubscribeService(item.applications?.[0]?.id)}
                        >
                          <Text style={styles.subscribeButtonText}>Desinscrever-se</Text>
                        </TouchableOpacity>
                      ) : (
                        <TouchableOpacity
                          style={styles.subscribeButton}
                          onPress={() => subscribeService(item.id)}
                        >
                          <Text style={styles.subscribeButtonText}>Inscrever-se</Text>
                        </TouchableOpacity>
                      )}
                    </>
                  )}
                </Animatable.View>
              </Pressable>
            )}
          />
        )}
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
