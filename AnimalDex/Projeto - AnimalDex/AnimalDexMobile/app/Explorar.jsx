import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, TextInput, ActivityIndicator, Image, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

// Funções de tradução dos níveis
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

export default function Explorar() {
  const router = useRouter();
  const [animais, setAnimais] = useState([]);
  const [capturados, setCapturados] = useState([]);
  const [imagensCapturadas, setImagensCapturadas] = useState({});
  const [busca, setBusca] = useState('');
  const [filtroPerigo, setFiltroPerigo] = useState('');
  const [filtroExtincao, setFiltroExtincao] = useState('');
  const [loading, setLoading] = useState(true);

  // Busca todos os animais do BD
  useEffect(() => {
    setLoading(true);
    axios.get('http://192.168.0.106:8000/api/animais/')
      .then(res => setAnimais(res.data.results || res.data))
      .catch(() => setAnimais([]))
      .finally(() => setLoading(false));
  }, []);

  // Busca animais capturados pelo usuário e salva a imagem mais recente de cada animal
  useEffect(() => {
    const fetchCapturas = async () => {
      const token = await AsyncStorage.getItem('token');
      if (!token) return;
      try {
        const response = await axios.get('http://192.168.0.106:8000/api/perfil/identificacoes/', {
          headers: { Authorization: `Token ${token}` }
        });
        const capturas = (response.data.results || response.data);
        const capturadosIds = [];
        const imagensPorAnimal = {};
        capturas.forEach(captura => {
          const id = captura.animal?.id;
          if (!id) return;
          capturadosIds.push(id);
          if (
            !imagensPorAnimal[id] ||
            new Date(captura.data_identificacao) > new Date(imagensPorAnimal[id].data_identificacao)
          ) {
            imagensPorAnimal[id] = {
              imagem: captura.imagem,
              data_identificacao: captura.data_identificacao
            };
          }
        });
        setCapturados(capturadosIds);
        setImagensCapturadas(imagensPorAnimal);
      } catch {
        setCapturados([]);
        setImagensCapturadas({});
      }
    };
    fetchCapturas();
  }, []);

  // Filtro e busca
  const animaisFiltrados = animais.filter(animal => {
    const buscaLower = busca.toLowerCase();
    const matchNome = animal.nome_comum?.toLowerCase().includes(buscaLower) || animal.nome_cientifico?.toLowerCase().includes(buscaLower);
    const matchPerigo = filtroPerigo ? String(animal.nivel_perigo) === filtroPerigo : true;
    const matchExtincao = filtroExtincao ? String(animal.nivel_extincao) === filtroExtincao : true;
    return matchNome && matchPerigo && matchExtincao;
  });

  return (
    <View style={styles.container}>
      {/* Filtros */}
      <View style={styles.filtrosContainer}>
        <TextInput
          style={styles.input}
          placeholder="Buscar por nome comum ou científico..."
          value={busca}
          onChangeText={setBusca}
          returnKeyType="search"
        />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtrosScroll}>
          {/* Perigo */}
          <TouchableOpacity
            style={[styles.tag, filtroPerigo === '' && styles.tagActive]}
            onPress={() => setFiltroPerigo('')}
          >
            <Text style={styles.tagText}>Perigo</Text>
          </TouchableOpacity>
          {[1,2,3,4,5].map(n => (
            <TouchableOpacity
              key={n}
              style={[styles.tag, filtroPerigo === String(n) && styles.tagActive]}
              onPress={() => setFiltroPerigo(filtroPerigo === String(n) ? '' : String(n))}
            >
              <Text style={styles.tagText}>{getDescricaoPerigo(n)}</Text>
            </TouchableOpacity>
          ))}
          {/* Extinção */}
          <TouchableOpacity
            style={[styles.tag, filtroExtincao === '' && styles.tagActive]}
            onPress={() => setFiltroExtincao('')}
          >
            <Text style={styles.tagText}>Extinção</Text>
          </TouchableOpacity>
          {[1,2,3,4,5].map(n => (
            <TouchableOpacity
              key={n}
              style={[styles.tag, filtroExtincao === String(n) && styles.tagActive]}
              onPress={() => setFiltroExtincao(filtroExtincao === String(n) ? '' : String(n))}
            >
              <Text style={styles.tagText}>{getDescricaoExtincao(n)}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Lista de animais */}
      {loading ? (
        <ActivityIndicator size="large" color="#20B2AA" style={{ marginTop: 40 }} />
      ) : animaisFiltrados.length === 0 ? (
        <Text style={styles.nenhumAnimal}>Nenhum animal encontrado.</Text>
      ) : (
        <FlatList
          data={animaisFiltrados}
          keyExtractor={item => String(item.id)}
          contentContainerStyle={styles.grid}
          renderItem={({ item }) => {
            const foiCapturado = capturados.includes(item.id);
            let urlImagem = '';
            if (foiCapturado && imagensCapturadas[item.id]?.imagem) {
              urlImagem = imagensCapturadas[item.id].imagem.startsWith('http')
                ? imagensCapturadas[item.id].imagem
                : `http://192.168.0.106:8000${imagensCapturadas[item.id].imagem}`;
            }
            return (
              <View style={styles.card}>
                {foiCapturado && urlImagem ? (
                  <Image
                    source={{ uri: urlImagem }}
                    style={styles.cardImage}
                    resizeMode="cover"
                    onError={e => { e.nativeEvent.target.src = "https://via.placeholder.com/300x200?text=Sem+Imagem"; }}
                  />
                ) : (
                  <View style={[styles.cardImage, styles.cardImageOculta, { justifyContent: 'center', alignItems: 'center' }]}>
                    <Text style={styles.interrogacao}>?</Text>
                  </View>
                )}
                <View style={styles.overlay}>
                  <Text style={styles.overlayTitle}>{item.nome_comum}</Text>
                  <Text style={styles.overlaySubtitle}>{item.nome_cientifico}</Text>
                  <Text style={styles.overlayDescription}>
                    {item.descricao || 'Sem descrição disponível.'}
                  </Text>
                  <View style={styles.overlayFooter}>
                    <Text style={styles.overlayTag}>{getDescricaoPerigo(item.nivel_perigo)}</Text>
                    <Text style={styles.overlayTag}>{getDescricaoExtincao(item.nivel_extincao)}</Text>
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
  container: { flex: 1, backgroundColor: '#e8f6ef', paddingTop: 0 },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e0e7ef',
    borderBottomWidth: 2,
    borderBottomColor: '#b6e388',
    height: 60,
    paddingHorizontal: 12,
    marginBottom: 8,
    elevation: 2
  },
  backButton: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    backgroundColor: '#e8f6ef',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#b6e388',
    marginRight: 10
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
    flex: 1,
    textAlign: 'center',
    marginRight: 40
  },
  filtrosContainer: {
    marginTop: 12,
    marginBottom: 8,
    paddingHorizontal: 10
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#b6e388',
    padding: 10,
    fontSize: 16,
    marginBottom: 10
  },
  filtrosScroll: {
    paddingVertical: 8
  },
  tag: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#b6e388',
    paddingVertical: 6,
    paddingHorizontal: 10,
    marginRight: 6,
    marginBottom: 4
  },
  tagActive: {
    backgroundColor: '#20B2AA',
    borderColor: '#20B2AA'
  },
  tagText: {
    color: '#14532d',
    fontWeight: 'bold'
  },
  grid: {
    paddingBottom: 40
  },
  card: {
    backgroundColor: '#111',
    borderRadius: 18,
    marginBottom: 24,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#14532d33',
    elevation: 3,
    marginHorizontal: 6
  },
  cardImage: {
    width: '100%',
    height: 180,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    backgroundColor: '#222'
  },
  cardImageOculta: {
    backgroundColor: '#111'
  },
  interrogacao: {
    color: '#fff',
    fontSize: 48,
    fontWeight: 'bold',
    textShadowColor: '#000',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 8
  },
  overlay: {
    padding: 16,
    backgroundColor: 'rgba(10,30,10,0.92)'
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
    gap: 8
  },
  overlayTag: {
    backgroundColor: '#a3e635',
    color: '#14532d',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 15,
    fontWeight: 'bold',
    fontSize: 13,
    marginRight: 8
  },
  nenhumAnimal: {
    textAlign: 'center',
    color: '#888',
    fontSize: 16,
    marginTop: 40
  }
});