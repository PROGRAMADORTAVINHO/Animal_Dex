import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Modal, TextInput, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const getTituloNivel = (nivel) => {
  if (nivel >= 20) return "Pesquisador";
  if (nivel > 10) return "Colecionador";
  if (nivel > 5) return "Aventureiro";
  return "Iniciante";
};

export default function HomeUser() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [busca, setBusca] = useState('');
  const [ultimasCapturas, setUltimasCapturas] = useState([]);

  useEffect(() => {
    const fetchUser = async () => {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        router.replace('/Login');
        return;
      }
      try {
        const response = await axios.get('http://192.168.0.106:8000/api/perfil/', {
          headers: { Authorization: `Token ${token}` },
        });
        setUser(response.data);
        setError(''); // Limpa o erro ao carregar com sucesso
      } catch (err) {
        setError('Erro ao carregar perfil');
        setUser(null);
      }
    };

    const fetchCapturas = async () => {
      const token = await AsyncStorage.getItem('token');
      if (!token) return;
      try {
        const response = await axios.get('http://192.168.0.106:8000/api/perfil/identificacoes/?page_size=3', {
          headers: { Authorization: `Token ${token}` },
        });
        // Ordena por data mais recente
        const capturasOrdenadas = (response.data.results || response.data)
          .sort((a, b) => new Date(b.data_identificacao) - new Date(a.data_identificacao));
        setUltimasCapturas(capturasOrdenadas.slice(0, 3));
      } catch (err) {
        setUltimasCapturas([]);
      }
    };

    fetchUser();
    fetchCapturas();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Modal Explorar */}
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

      {/* Bem-vindo e status */}
      <Text style={styles.welcome}>
        {user?.username
          ? `Bem-vindo de volta, ${user.username}!`
          : 'Carregando...'}
      </Text>
      <Text style={styles.subtitle}>Continue sua jornada de descobertas no mundo animal.</Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}

      {/* Minha Coleção */}
      <TouchableOpacity
        style={styles.collectionBox}
        onPress={() => router.push('/AnimalDex')}
      >
        <Text style={styles.collectionIcon}>📚</Text>
        <View>
          <Text style={styles.collectionTitle}>Minha Coleção</Text>
          <Text style={styles.collectionText}>Veja todos os animais que você já identificou!</Text>
        </View>
      </TouchableOpacity>

      {/* Status do usuário */}
      <View style={styles.statusContainer}>
        <View style={styles.statusBox}>
          <Text style={styles.statusIcon}>🌟</Text>
          <Text style={styles.statusNumber}>
            {user?.animais_descobertos !== undefined ? user.animais_descobertos : 0}
          </Text>
          <Text style={styles.statusLabel}>Animais Descobertos</Text>
        </View>
        <View style={styles.statusBox}>
          <Text style={styles.statusIcon}>🏆</Text>
          <Text style={styles.statusNumber}>
            {user?.nivel || user?.nivel_atual || 0}
          </Text>
          <Text style={styles.statusLabel}>{getTituloNivel(Number(user?.nivel || user?.nivel_atual || 0))}</Text>
        </View>
      </View>

      {/* Barra de XP */}
      <View style={styles.xpBarContainer}>
        <View
          style={[
            styles.xpBar,
            {
              width:
                user && user.xp !== undefined && user.xp_para_proximo_nivel
                  ? `${Math.max(8, Math.min(100, Math.round((user.xp / user.xp_para_proximo_nivel) * 100)))}%`
                  : '8%',
            },
          ]}
        />
        <Text style={styles.xpBarText}>
          XP: {user?.xp || 0}
          {user?.xp_para_proximo_nivel ? ` / ${user.xp_para_proximo_nivel}` : ''}
        </Text>
      </View>

      {/* Explorar/Capturar */}
      <View style={styles.actionsRow}>
        <TouchableOpacity style={styles.actionBox} onPress={() => router.push('/Explorar')}>
          <Text style={styles.actionTitle}>Explorar Animal</Text>
          <Text style={styles.actionText}>Descubra novos animais e aprenda mais sobre eles</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBox} onPress={() => router.push('/Identificar')}>
          <Text style={styles.actionTitle}>Capturar Animal</Text>
          <Text style={styles.actionText}>Encontre e capture novos animais para sua coleção</Text>
        </TouchableOpacity>
      </View>

      {/* Espécies em risco */}
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

      {/* Evento da Natureza */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Evento da Natureza</Text>
        <Text>🐋 Migração das baleias jubarte – Junho a Novembro</Text>
        <Text>🐢 Desovas das tartarugas – Setembro a Março</Text>
        <Text>🦩 Reprodução dos flamingos – Agosto a Outubro</Text>
      </View>

      {/* Habitat da Semana */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Habitat da Semana</Text>
        <Image source={require('../assets/images/pantanal.jpg')} style={styles.image} />
        <Text>Pantanal — Maior planície alagada do mundo</Text>
        <Text>Espécies típicas: Onça-pintada, Arara-azul, Jacaré</Text>
      </View>

      {/* Curiosidade do Dia */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Curiosidade do Dia</Text>
        <Image source={require('../assets/images/tiger.jpg')} style={styles.image} />
        <Text style={{ marginTop: 8 }}>
          🐅 Tigre Nadador: Sabia que os tigres são excelentes nadadores e adoram água? Eles podem nadar por até 6km!
        </Text>
      </View>

      {/* Últimos Animais Identificados */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Últimos Animais Identificados</Text>
        {ultimasCapturas.length === 0 ? (
          <Text style={styles.sectionText}>Você ainda não identificou nenhum animal.</Text>
        ) : (
          ultimasCapturas.map((captura, idx) => {
            // Corrige datas para formatos ISO e exibe corretamente
            let dataFormatada = '';
            if (captura.data_identificacao) {
              let dataStr = captura.data_identificacao;
              // Tenta corrigir para formato ISO
              if (!dataStr.includes('T')) {
                dataStr = dataStr.replace(' ', 'T');
              }
              // Garante que termina com 'Z' para UTC se não tiver fuso
              if (!dataStr.endsWith('Z') && !/[+-]\d{2}:?\d{2}$/.test(dataStr)) {
                dataStr += 'Z';
              }
              const dataObj = new Date(dataStr);
              dataFormatada = isNaN(dataObj.getTime())
                ? captura.data_identificacao
                : dataObj.toLocaleString('pt-BR');
            }
            return (
              <View key={idx} style={styles.speciesCard}>
                <Image
                  source={
                    captura.imagem
                      ? { uri: captura.imagem.startsWith('http') ? captura.imagem : `http://192.168.0.106:8000${captura.imagem}` }
                      : { uri: 'https://via.placeholder.com/100x100?text=Animal' }
                  }
                  style={styles.avatar}
                />
                <View>
                  <Text style={styles.speciesName}>{captura.animal?.nome_comum}</Text>
                  <Text>{captura.animal?.nome_cientifico}</Text>
                  <Text style={styles.speciesCount}>
                    {dataFormatada}
                  </Text>
                </View>
              </View>
            );
          })
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#fff' },
  welcome: { fontSize: 22, fontWeight: 'bold', marginBottom: 5 },
  subtitle: { fontSize: 14, color: '#666', marginBottom: 10 },
  error: { color: 'red' },
  collectionBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 18,
    padding: 18,
    marginBottom: 18,
    elevation: 2
  },
  collectionIcon: { fontSize: 22, marginRight: 14 },
  collectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#007bff' },
  collectionText: { color: '#333', fontSize: 14 },
  statusContainer: { flexDirection: 'row', justifyContent: 'space-around', marginVertical: 20 },
  statusBox: { alignItems: 'center' },
  statusIcon: { fontSize: 30 },
  statusNumber: { fontSize: 20, fontWeight: 'bold' },
  statusLabel: { fontSize: 12, color: '#555' },
  xpBarContainer: {
    width: '90%',
    height: 14,
    backgroundColor: '#e0e0e0',
    borderRadius: 7,
    marginVertical: 12,
    alignSelf: 'center',
    overflow: 'hidden',
    position: 'relative'
  },
  xpBar: {
    height: 14,
    backgroundColor: '#3B82F6',
    borderRadius: 7,
    position: 'absolute',
    left: 0,
    top: 0
  },
  xpBarText: {
    position: 'absolute',
    width: '100%',
    textAlign: 'center',
    color: '#222',
    fontWeight: 'bold',
    fontSize: 11,
    zIndex: 2
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
    gap: 10
  },
  actionBox: {
    backgroundColor: '#E0F7FA',
    padding: 15,
    borderRadius: 10,
    flex: 1,
    marginHorizontal: 2
  },
  actionTitle: { fontSize: 16, fontWeight: 'bold' },
  actionText: { fontSize: 13, color: '#333' },
  section: { marginTop: 25 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  sectionText: { fontSize: 14, color: '#888', marginBottom: 10 },
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