import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Modal, TextInput, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export default function HomeUser() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [busca, setBusca] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      const token = await AsyncStorage.getItem('token'); // Recupera o token do AsyncStorage
      if (!token) {
        router.replace('/Login'); // Redireciona para a página de login se o token não existir
        return;
      }

      try {
        const response = await axios.get('http://192.168.0.106:8000/api/Perfil/', {
          headers: { Authorization: `Token ${token}` }, // Envia o token no cabeçalho
        });
        setUser(response.data);
      } catch (err) {
        setError('Erro ao carregar perfil');
        setUser(null);
      }
    };

    fetchUser();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Explorar Animais</Text>
            <TextInput
              placeholder="Digite o nome do animal..."
              value={busca}
              onChangeText={setBusca}
              style={styles.modalInput}
            />
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => {
                setModalVisible(false);
                router.push('/Explorar');
              }}
            >
              <Text style={styles.modalButtonText}>Buscar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Text style={styles.welcome}>
        {user?.first_name ? `Bem-vindo de volta, ${user.first_name}!` : 'Carregando...'}
      </Text>
      <Text style={styles.subtitle}>Continue sua jornada de descobertas no mundo animal.</Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}

      <View style={styles.statusContainer}>
        <View style={styles.statusBox}>
          <Text style={styles.statusIcon}>🌟</Text>
          <Text style={styles.statusNumber}>0</Text>
          <Text style={styles.statusLabel}>Animais Descobertos</Text>
        </View>
        <View style={styles.statusBox}>
          <Text style={styles.statusIcon}>🏆</Text>
          <Text style={styles.statusNumber}>Iniciante</Text>
          <Text style={styles.statusLabel}>Seu nível</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.actionBox} onPress={() => setModalVisible(true)}>
        <Text style={styles.actionTitle}>Explorar Animal</Text>
        <Text style={styles.actionText}>Descubra novos animais e aprenda mais sobre eles</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.actionBox} onPress={() => router.push('/CadastroAnimais')}>
        <Text style={styles.actionTitle}>Capturar Animal</Text>
        <Text style={styles.actionText}>Encontre e capture novos animais para sua coleção</Text>
      </TouchableOpacity>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Espécies em Risco</Text>
        {[
          { emoji: '🐆', nome: 'Onça-pintada', status: 'Vulnerável', qtd: '173.000' },
          { emoji: '🦜', nome: 'Arara-azul', status: 'Em perigo', qtd: '6.500' },
          { emoji: '🐋', nome: 'Peixe-boi', status: 'Criticamente em perigo', qtd: '2.500' }
        ].map((item, idx) => (
          <View key={idx} style={styles.speciesCard}>
            <Text style={styles.speciesEmoji}>{item.emoji}</Text>
            <View>
              <Text style={styles.speciesName}>{item.nome}</Text>
              <Text>{item.status}</Text>
              <Text style={styles.speciesCount}>Restam apenas {item.qtd} na natureza</Text>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Evento da Natureza</Text>
        <Text>🐋 Migração das baleias jubarte – Junho a Novembro</Text>
        <Text>🐢 Desovas das tartarugas – Setembro a Março</Text>
        <Text>🦩 Reprodução dos flamingos – Agosto a Outubro</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Habitat da Semana</Text>
        <Image source={require('../assets/images/pantanal.jpg')} style={styles.image} />
        <Text>Pantanal — Maior planície alagada do mundo</Text>
        <Text>Espécies típicas: Onça-pintada, Arara-azul, Jacaré</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Curiosidade do Dia</Text>
        <Image source={require('../assets/images/tiger.jpg')} style={styles.image} />
        <Text style={{ marginTop: 8 }}>
          🐅 Tigre Nadador: Sabia que os tigres são excelentes nadadores e adoram água? Eles podem nadar por até 6km!
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Capturas Recentes</Text>
        <View style={styles.speciesCard}>
          <Image source={require('../assets/images/capivara.jpg')} style={styles.avatar} />
          <View>
            <Text>Capivara</Text>
            <Text>Hydrochoerus hydrochaeris</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#fff' },
  welcome: { fontSize: 22, fontWeight: 'bold', marginBottom: 5 },
  subtitle: { fontSize: 14, color: '#666', marginBottom: 10 },
  error: { color: 'red' },
  statusContainer: { flexDirection: 'row', justifyContent: 'space-around', marginVertical: 20 },
  statusBox: { alignItems: 'center' },
  statusIcon: { fontSize: 30 },
  statusNumber: { fontSize: 20, fontWeight: 'bold' },
  statusLabel: { fontSize: 12, color: '#555' },
  actionBox: {
    backgroundColor: '#E0F7FA',
    padding: 15,
    marginBottom: 15,
    borderRadius: 10
  },
  actionTitle: { fontSize: 18, fontWeight: 'bold' },
  actionText: { fontSize: 14, color: '#333' },
  section: { marginTop: 25 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  speciesCard: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  speciesEmoji: { fontSize: 30, marginRight: 10 },
  speciesName: { fontWeight: 'bold' },
  speciesCount: { fontSize: 12, color: '#888' },
  image: { width: '100%', height: 180, borderRadius: 8, marginVertical: 10 },
  avatar: { width: 60, height: 60, borderRadius: 30, marginRight: 10 },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    width: '80%',
    borderRadius: 10
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5
  },
  modalButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    alignItems: 'center',
    borderRadius: 5
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: 'bold'
  }
});
