import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, Button, Alert } from 'react-native';
import { Footer, Navbar } from '../../components';

export default function ApiTest({ navigation }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [editing, setEditing] = useState(null);
  const [apiResponse, setApiResponse] = useState('');

  useEffect(() => {
    fetch('http://85.31.63.241:3001/clients')
      .then(response => response.json())
      .then(json => {
        setData(json);
        setApiResponse(JSON.stringify(json, null, 2)); 
        setLoading(false);
      })
      .catch(error => {
        console.error(error);
        setApiResponse(`Erro ao carregar: ${error.message}`);
        setLoading(false);
      });
  }, []);

  const handleAddClient = () => {
    const newClient = { name, email, phone };
    fetch('http://85.31.63.241:3001/clients', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newClient),
    })
      .then(response => response.json())
      .then(client => {
        setData(prevData => [...prevData, client]);
        setApiResponse(JSON.stringify(client, null, 2)); 
        setName('');
        setEmail('');
        setPhone('');
      })
      .catch(error => {
        console.error('Erro ao adicionar cliente:', error);
        setApiResponse(`Erro ao adicionar: ${error.message}`);
      });
  };

  const handleEditClient = () => {
    const updatedClient = { name, email, phone };
    fetch(`http://85.31.63.241:3001/clients/${editing}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedClient),
    })
      .then(response => response.json())
      .then(client => {
        setData(prevData =>
          prevData.map(item => (item.id === editing ? client : item))
        );
        setApiResponse(JSON.stringify(client, null, 2));
        setEditing(null);
        setName('');
        setEmail('');
        setPhone('');
      })
      .catch(error => {
        console.error('Erro ao editar cliente:', error);
        setApiResponse(`Erro ao editar: ${error.message}`);
      });
  };

  const handleDeleteClient = (id) => {
    fetch(`http://85.31.63.241:3001/clients/${id}`, {
      method: 'DELETE',
    })
      .then(() => {
        setData(prevData => prevData.filter(item => item.id !== id));
        setApiResponse(`Cliente ${id} deletado com sucesso`);
      })
      .catch(error => {
        console.error('Erro ao deletar cliente:', error);
        setApiResponse(`Erro ao deletar: ${error.message}`);
      });
  };

  return (
    <View style={styles.container}>
      <Navbar
          title="Tela API TESTE"
          onBack={() => navigation.goBack()} 
          showBackButton={false} 
        />
      <View style={{ paddingTop: 10, paddingBottom: 10, paddingLeft: 20, paddingRight: 20 }}>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Nome"
        />
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="E-mail"
        />
        <TextInput
          style={styles.input}
          value={phone}
          onChangeText={setPhone}
          placeholder="Telefone"
        />
      </View>
      <View style={{ paddingTop: 10, paddingBottom: 10, paddingLeft: 20, paddingRight: 20 }}>
        <Button
          title={editing ? 'Editar Cliente' : 'Adicionar Cliente'}
          onPress={editing ? handleEditClient : handleAddClient}
        />
      </View>

      {loading ? (
        <Text style={styles.loading}>Carregando...</Text>
      ) : (
        <FlatList
          style={styles.flatList}
          data={data}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <Text style={styles.title}>{item.name}</Text>
              <Text>{item.email}</Text>
              <Text>{item.phone}</Text>
              <View style={styles.buttonContainer}>
                <Button
                  title="Editar"
                  onPress={() => {
                    setEditing(item.id);
                    setName(item.name);
                    setEmail(item.email);
                    setPhone(item.phone);
                  }}
                />
                <Button
                  title="Deletar"
                  color="red"
                  onPress={() => {
                    Alert.alert(
                      'Confirmar Exclusão',
                      'Tem certeza que deseja excluir este cliente?',
                      [
                        { text: 'Cancelar' },
                        { text: 'Deletar', onPress: () => handleDeleteClient(item.id) },
                      ]
                    );
                  }}
                />
              </View>
            </View>
          )}
        />
      )}
      <Footer setSelected="1"/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    paddingTop: 60,
    paddingBottom: 75,
  },
  flatList: {
    paddingTop: 10,
    padding: 20
  },
  loading: {
    fontSize: 18,
    color: '#fff',
    padding: 20
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  item: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  responseContainer: {
    marginTop: 20,
    backgroundColor: '#f9f9f9',
    padding: 10,
    borderRadius: 8,
    maxHeight: 200,
  },
  responseHeader: {
    fontWeight: 'bold',
    marginBottom: 5,
    fontSize: 16,
  },
  responseText: {
    fontSize: 14,
    color: '#333',
  },
});
