import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const getDescricaoPerigo = (nivel) => {
  switch (Number(nivel)) {
    case 1: return "Perigo mínimo";
    case 2: return "Pouco perigoso";
    case 3: return "Perigo moderado";
    case 4: return "Perigo alto";
    case 5: return "Perigo extremo";
    default: return "Nível desconhecido";
  }
};

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

export default function AnimalDex() {
  const router = useRouter();
  const [capturas, setCapturas] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCapturas = async () => {
      setLoading(true);
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        setError('Faça login para ver sua coleção.');
        setLoading(false);
        return;
      }
      try {
        const response = await axios.get('http://192.168.0.106:8000/api/perfil/identificacoes/', {
          headers: { Authorization: `Token ${token}` }
        });
        setCapturas(response.data.results || response.data);
      } catch {
        setError('Erro ao carregar sua coleção.');
      } finally {
        setLoading(false);
      }
    };
    fetchCapturas();
  }, []);

  // Filtra para mostrar apenas a captura mais recente de cada animal
  const capturasUnicas = Object.values(
    (capturas || []).reduce((acc, captura) => {
      const id = captura.animal?.id;
      if (!id) return acc;
      if (
        !acc[id] ||
        new Date(captura.data_identificacao.replace(' ', 'T')) > new Date(acc[id].data_identificacao.replace(' ', 'T'))
      ) {
        acc[id] = captura;
      }
      return acc;
    }, {})
  ).sort((a, b) =>
    new Date(b.data_identificacao.replace(' ', 'T')) - new Date(a.data_identificacao.replace(' ', 'T'))
  );

  return (
    <View style={styles.container}>
      {/* Conteúdo */}
      {loading ? (
        <ActivityIndicator size="large" color="#20B2AA" style={{ marginTop: 40 }} />
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : capturasUnicas.length === 0 ? (
        <View style={{ width: '100%', alignItems: 'center', marginTop: 40 }}>
          <Text style={styles.emptyTitle}>Você ainda não identificou nenhum animal.</Text>
          <Text style={styles.emptyText}>Capture animais para vê-los aqui no seu almanaque!</Text>
        </View>
      ) : (
        <FlatList
          data={capturasUnicas}
          keyExtractor={(_, idx) => String(idx)}
          contentContainerStyle={styles.grid}
          renderItem={({ item }) => {
            const nivelPerigo = item.animal?.nivel_perigo ?? item.animal?.perigo;
            const nivelExtincao = item.animal?.nivel_extincao;
            // Corrige data para formato ISO
            let dataStr = item.data_identificacao;
            if (dataStr && !dataStr.includes('T')) dataStr = dataStr.replace(' ', 'T');
            let dataFormatada = '';
            if (dataStr) {
              const dataObj = new Date(dataStr);
              dataFormatada = isNaN(dataObj.getTime()) ? item.data_identificacao : dataObj.toLocaleString('pt-BR');
            }
            return (
              <View style={styles.card}>
                <Image
                  source={{
                    uri: item.imagem
                      ? (item.imagem.startsWith('http')
                        ? item.imagem
                        : `http://192.168.0.106:8000${item.imagem}`)
                      : "https://via.placeholder.com/300x200?text=Sem+Imagem"
                  }}
                  style={styles.cardImage}
                  resizeMode="cover"
                />
                <View style={styles.overlay}>
                  <Text style={styles.overlayTitle}>{item.animal?.nome_comum || 'Animal'}</Text>
                  <Text style={styles.overlaySubtitle}>{item.animal?.nome_cientifico || ''}</Text>
                  <Text style={styles.overlayDescription}>
                    {item.animal?.descricao || 'Sem descrição disponível.'}
                  </Text>
                  <View style={styles.overlayFooter}>
                    <Text style={styles.overlayTag}>{getDescricaoPerigo(nivelPerigo)}</Text>
                    <Text style={styles.overlayTag}>{getDescricaoExtincao(nivelExtincao)}</Text>
                    <Text style={styles.overlayDate}>{dataFormatada}</Text>
                  </View>
                </View>
              </View>
            );
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#e8f6ef' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e0e7ef',
    borderBottomWidth: 2,
    borderBottomColor: '#b6e388',
    height: 60,
    paddingHorizontal: 12,
    marginBottom: 8,
    elevation: 2,
    justifyContent: 'center'
  },
  backButton: {
    position: 'absolute',
    left: 12,
    paddingVertical: 6,
    paddingHorizontal: 14,
    backgroundColor: '#e8f6ef',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#b6e388',
    zIndex: 2
  },
  backButtonText: {
    color: '#14532d',
    fontWeight: 'bold',
    fontSize: 16
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#14532d',
    textAlign: 'center'
  },
  grid: {
    padding: 18,
    paddingBottom: 40
  },
  card: {
    backgroundColor: '#111',
    borderRadius: 18,
    marginBottom: 24,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#14532d33',
    elevation: 3
  },
  cardImage: {
    width: '100%',
    height: 180,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    backgroundColor: '#222'
  },
  overlay: {
    padding: 16,
    backgroundColor: 'rgba(10,30,10,0.92)',
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18
  },
  overlayTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#f7ffe0',
    marginBottom: 2
  },
  overlaySubtitle: {
    fontSize: 15,
    color: '#bbf7d0',
    fontStyle: 'italic',
    marginBottom: 6
  },
  overlayDescription: {
    fontSize: 14,
    color: '#e8f6ef',
    marginBottom: 10
  },
  overlayFooter: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    alignItems: 'center'
  },
  overlayTag: {
    backgroundColor: '#a3e635',
    color: '#14532d',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 15,
    fontWeight: 'bold',
    fontSize: 13,
    marginRight: 8,
    marginBottom: 4
  },
  overlayDate: {
    color: '#e8f6ef',
    fontSize: 13,
    fontStyle: 'italic',
    marginTop: 2
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginTop: 30,
    fontSize: 16
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#14532d',
    marginBottom: 8
  },
  emptyText: {
    fontSize: 15,
    color: '#666'
  }
});