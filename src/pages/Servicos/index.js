import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, ActivityIndicator, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Animatable from 'react-native-animatable';
import axios from 'axios';
import API_BASE_URL from '../../config';
import DatePicker from 'react-native-modern-datepicker';

export default function Servicos() {
  const navigation = useNavigation();

  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [pay, setPay] = useState('');
  const [status, setStatus] = useState('open');
  const [dateInitial, setDateInitial] = useState('');
  const [dateFinal, setDateFinal] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [editable, setEditable] = useState(false);
  const [showPickerInitial, setShowPickerInitial] = useState(false);
  const [showPickerFinal, setShowPickerFinal] = useState(false);
  const [date, setDate] = useState(false);

  const [cep, setCep] = useState('');
   const [rua, setRua] = useState('');
   const [bairro, setBairro] = useState('');
   const [cidade, setCidade] = useState('');
   const [estado, setEstado] = useState('');
   const [numero, setNumero] = useState('');
   const [complemento, setComplemento] = useState('');
 
   const fetchCepData = async (cep) => {
     if (cep.length === 8) {
       try {
         const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
         if (response.data.erro) {
           setErrorMessage('CEP não encontrado.');
         } else {
           setRua(response.data.logradouro);
           setBairro(response.data.bairro);
           setCidade(response.data.localidade);
           setEstado(response.data.uf);
         }
       } catch (error) {
         setErrorMessage('Erro ao buscar dados do CEP.');
       }
     }
   };
 
   const handleCepChange = (value) => {
     setCep(value);
     if (value.length === 8) {
       fetchCepData(value);
     }
   };

  function handleOpenInitialPicker() {
    setShowPickerInitial(true);
  }
  
  function handleOpenFinalPicker() {
    setShowPickerFinal(true);
  }
  
  function handleClosePickers() {
    setShowPickerInitial(false);
    setShowPickerFinal(false);
  }
  
  function handleChangeDate(propDate, isInitial = true) {
    const [year, month, day] = propDate.split('/');
    const formattedDate = `${day}/${month}/${year}`;
    setDate(propDate);
    if (isInitial) {
      setDateInitial(formattedDate);
    } else {
      setDateFinal(formattedDate);
    }
  }

  const handleRegister = async () => {
    setIsLoading(true);
    setErrorMessage('');

    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        setErrorMessage('Usuário não autenticado.');
        setIsLoading(false);
        return;
      }
      const locationString = `${cep}, ${rua}, ${bairro}, ${cidade}, ${estado}, ${numero}, ${complemento}`;

      const response = await axios.post(
        `${API_BASE_URL}/services/register`,
        { title, description, location: locationString, date_initial: dateInitial, date_final: dateFinal, pay, status },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 201) {
        navigation.navigate('Home');
      }
    } catch (error) {
      console.error("Erro ao registrar serviço:", error);
      setErrorMessage(
        error.response?.data?.message || 'Erro ao tentar registrar. Tente novamente.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const isButtonDisabled = !title.trim() || !description.trim() || !cep.trim() || !dateInitial.trim() || !dateFinal.trim() || !pay.trim();

  return (
    <ScrollView style={styles.container}>
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#FFF" />
        </View>
      )}
      
      <Animatable.View animation="fadeInLeft" delay={500} style={styles.containerHeader}>
        <Text style={styles.message}>Publique seu Serviço</Text>
      </Animatable.View>

      <Animatable.View animation="fadeInUp" style={styles.containerForm}>
        <Text style={styles.title}>Título do Serviço</Text>
        <TextInput
          value={title}
          onChangeText={setTitle}
          placeholder="Digite seu título"
          style={styles.input}
        />
        
        <Text style={styles.title}>Descreva o Serviço</Text>
        <TextInput
          value={description}
          onChangeText={setDescription}
          placeholder="Digite sua descrição"
          style={[styles.input, { height: 120, textAlignVertical: 'top' }]}
          multiline={true}
          numberOfLines={4}  
        />

        <Text style={styles.title}>CEP</Text>
         <TextInput
           value={cep}
           onChangeText={handleCepChange}
           placeholder="Digite o CEP"
           style={styles.input}
           keyboardType="numeric"
         />
 
         <Text style={styles.title}>Rua</Text>
         <TextInput
           value={rua}
           onChangeText={setRua}
           placeholder="Rua"
           style={styles.input}
         />
 
         <Text style={styles.title}>Bairro</Text>
         <TextInput
           value={bairro}
           onChangeText={setBairro}
           placeholder="Bairro"
           style={styles.input}
         />
 
         <Text style={styles.title}>Cidade</Text>
         <TextInput
           value={cidade}
           onChangeText={setCidade}
           placeholder="Cidade"
           style={styles.input}
         />
 
         <Text style={styles.title}>Estado</Text>
         <TextInput
           value={estado}
           onChangeText={setEstado}
           placeholder="Estado"
           style={styles.input}
         />
 
         <Text style={styles.title}>Número</Text>
         <TextInput
           value={numero}
           onChangeText={setNumero}
           placeholder="Número"
           style={styles.input}
           keyboardType="numeric"
         />
 
         <Text style={styles.title}>Complemento</Text>
         <TextInput
           value={complemento}
           onChangeText={setComplemento}
           placeholder="Complemento"
           style={styles.input}
         />
        
        <Text style={styles.title}>Data Inicial</Text>
        <TouchableOpacity onPress={handleOpenInitialPicker} style={styles.input}>
           <Text>{dateInitial || "Selecione uma data"}</Text>
         </TouchableOpacity>
 
         <Modal animationType="slide" transparent={true} visible={showPickerInitial}>
           <View style={styles.conteredView}>
             <View style={styles.modalView}>
               <DatePicker
                 mode="calendar"
                 selected={date}
                 onDateChange={(date) => handleChangeDate(date, true)}
               />
               <TouchableOpacity onPress={handleClosePickers}>
                 <Text>Fechar</Text>
               </TouchableOpacity>
             </View>
           </View>
         </Modal>
        
        <Text style={styles.title}>Data Final</Text>
        <TouchableOpacity onPress={handleOpenFinalPicker} style={styles.input}>
           <Text>{dateFinal || "Selecione uma data"}</Text>
         </TouchableOpacity>
 
         <Modal animationType="slide" transparent={true} visible={showPickerFinal}>
           <View style={styles.conteredView}>
             <View style={styles.modalView}>
               <DatePicker
                 mode="calendar"
                 selected={date}
                 onDateChange={(date) => handleChangeDate(date, false)}
               />
               <TouchableOpacity onPress={handleClosePickers}>
                 <Text>Fechar</Text>
               </TouchableOpacity>
             </View>
           </View>
         </Modal>
        
        <Text style={styles.title}>Pagamento</Text>
        <TextInput
          value={pay}
          onChangeText={setPay}
          placeholder="R$ 0,00"
          style={styles.input}
          keyboardType="numeric"
        />

        <Text style={styles.title}>Status</Text>
        <TextInput
          editable={false}
          value={status}
          onChangeText={setStatus}
          placeholder="Selecione o status"
          style={[styles.input, !editable && { backgroundColor: '#a1a1a1', color: 'white' }]}
        />
        
        {errorMessage !== '' && <Text style={styles.errorText}>{errorMessage}</Text>}
        
        <TouchableOpacity
          style={[styles.button, isButtonDisabled && styles.buttonDisabled]}
          onPress={handleRegister}
          disabled={isButtonDisabled}
        >
          <Text style={styles.buttonText}>Criar Serviço</Text>
        </TouchableOpacity>
      </Animatable.View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  conteredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    width: '90%',
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: .25,
    shadowRadius: 4,
    elevation: 5
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  dateInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
  },
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
  errorText: {
    color: 'red',
    fontSize: 14,
    marginTop: 10,
    alignSelf: 'center',
  },  
  message: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFF',
  },
  containerForm: {
    backgroundColor: '#FFF',
    flex: 1,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingStart: '5%',
    paddingEnd: '5%',
  },
  title: {
    fontSize: 20,
    marginTop: 28,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#38a69d',
    width: '100%',
    borderRadius: 4,
    paddingVertical: 8,
    marginTop: 14,
    marginBottom: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#a1a1a1', 
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
