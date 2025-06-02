import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, ScrollView } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const getDescricaoExtincao = (nivel) => {
  switch (Number(nivel)) {
    case 1: return "Pouco ameaçado";
    case 2: return "Quase ameaçado";
    case 3: return "Vulnerável";
    case 4: return "Em perigo";
    case 5: return "Criticamente em perigo";
    default: return "Nível desconhecido";
  }
};

export default function Leadboard() {
  const [jogadores, setJogadores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeadboard = async () => {
      setLoading(true);
      const token = await AsyncStorage.getItem('token');
      try {
        // Supondo que exista um endpoint para leaderboard, senão adapte para buscar todos os perfis
        const response = await axios.get('http://192.168.0.106:8000/api/leadboard/', {
          headers: { Authorization: `Token ${token}` }
        });
        setJogadores(response.data.results || response.data);
      } catch {
        setJogadores([]);
      } finally {
        setLoading(false);
      }
    };
    fetchLeadboard();
  }, []);

  // Se não houver endpoint pronto, pode-se simular ou adaptar para buscar todos os perfis e suas capturas

  const renderItem = ({ item, index }) => (
    <View style={styles.card}>
      <View style={styles.row}>
        <Text style={styles.rank}>{index + 1}º</Text>
        <View style={{ flex: 1 }}>
          <Text style={styles.username}>{item.username}</Text>
          <Text style={styles.level}>Nível: <Text style={styles.bold}>{item.nivel}</Text></Text>
          <Text style={styles.capturas}>Animais capturados: <Text style={styles.bold}>{item.animais_descobertos}</Text></Text>
          <Text style={styles.rare}>
            Mais raro: <Text style={styles.bold}>{item.animal_mais_raro?.nome_comum || '-'}</Text>
            {item.animal_mais_raro?.nivel_extincao && (
              <Text style={styles.rarityTag}> ({getDescricaoExtincao(item.animal_mais_raro.nivel_extincao)})</Text>
            )}
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ranking dos Jogadores</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#20B2AA" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={jogadores}
          keyExtractor={(item, idx) => String(idx)}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#e8f6ef', paddingTop: 10 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#14532d', textAlign: 'center', marginBottom: 16 },
  list: { paddingBottom: 40, paddingHorizontal: 10 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#b6e388'
  },
  row: { flexDirection: 'row', alignItems: 'center' },
  rank: { fontSize: 22, fontWeight: 'bold', color: '#3B82F6', width: 40, textAlign: 'center' },
  username: { fontSize: 18, fontWeight: 'bold', color: '#14532d' },
  level: { fontSize: 15, color: '#333', marginTop: 2 },
  capturas: { fontSize: 15, color: '#333', marginTop: 2 },
  rare: { fontSize: 15, color: '#333', marginTop: 2 },
  rarityTag: { color: '#a3e635', fontWeight: 'bold' },
  bold: { fontWeight: 'bold', color: '#14532d' }
});