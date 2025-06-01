import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ActivityIndicator, Alert, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
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

export default function Identificar() {
  const router = useRouter();
  const [imagem, setImagem] = useState(null);
  const [preview, setPreview] = useState(null);
  const [resultado, setResultado] = useState(null);
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);

  // Modifique selecionarImagem e tirarFoto para já enviar ao selecionar/tirar foto:
  const selecionarImagem = async () => {
    setErro('');
    setResultado(null);
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
      allowsEditing: true,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImagem(result.assets[0]);
      setPreview(result.assets[0].uri);
      handleEnviar(result.assets[0]);
    }
  };

  const tirarFoto = async () => {
    setErro('');
    setResultado(null);
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão necessária', 'Permita o acesso à câmera para tirar uma foto.');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      quality: 0.8,
      allowsEditing: true,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImagem(result.assets[0]);
      setPreview(result.assets[0].uri);
      handleEnviar(result.assets[0]);
    }
  };

  // Altere handleEnviar para aceitar imagem como parâmetro:
  const handleEnviar = async (img = imagem) => {
    setErro('');
    setResultado(null);
    if (!img) {
      setErro('Por favor, selecione ou tire uma foto.');
      return;
    }
    setLoading(true);
    const formData = new FormData();
    formData.append('foto', {
      uri: img.uri,
      name: 'foto.jpg',
      type: 'image/jpeg',
    });
    const token = await AsyncStorage.getItem('token');
    try {
      const response = await axios.post(
        'http://192.168.0.106:8000/api/identificar/',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Token ${token}`,
          },
        }
      );
      setResultado(response.data);
      setErro('');
    } catch (err) {
      setErro(
        err.response?.data?.error ||
        err.response?.data?.detail ||
        'Erro ao identificar o animal.'
      );
      setResultado(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Título */}
      <Text style={styles.title}>Identificar Animal</Text>
      <Text style={styles.subtitle}>Envie uma foto ou tire uma agora para descobrir informações sobre o animal.</Text>

      {/* Preview da imagem */}
      {preview && (
        <Image source={{ uri: preview }} style={styles.preview} />
      )}

      {/* Loading indicador */}
      {loading && (
        <ActivityIndicator color="#2196F3" size="large" style={{ marginBottom: 12 }} />
      )}

      {/* Botões de seleção */}
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.button} onPress={selecionarImagem}>
          <Text style={styles.buttonText}>Selecionar da Galeria</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={tirarFoto}>
          <Text style={styles.buttonText}>Tirar Foto</Text>
        </TouchableOpacity>
      </View>

      {/* Erro */}
      {erro ? <Text style={styles.error}>{erro}</Text> : null}

      {/* Resultado */}
      {resultado && (
        <View style={styles.resultCard}>
          <Text style={styles.resultTitle}>Animal Capturado!</Text>
          <View style={styles.resultRow}>
            <Image
              source={{ uri: resultado.foto_url }}
              style={styles.resultImage}
            />
            <View style={styles.resultInfo}>
              <Text style={styles.resultName}>{resultado.nome_comum}</Text>
              <Text style={styles.resultSci}>{resultado.nome_cientifico}</Text>
            </View>
          </View>
          <View style={styles.resultDetails}>
            <Text><Text style={styles.bold}>Nível de Perigo:</Text> {getDescricaoPerigo(Number(resultado.nivel_perigo))}</Text>
            <Text><Text style={styles.bold}>Nível de Extinção:</Text> {getDescricaoExtincao(Number(resultado.nivel_extincao))}</Text>
            <Text><Text style={styles.bold}>Descrição:</Text> {resultado.descricao}</Text>
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: '#e8f6ef', padding: 18, paddingBottom: 32 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#14532d', marginBottom: 8, marginTop: 10, textAlign: 'center' },
  subtitle: { color: '#666', fontSize: 15, marginBottom: 18, textAlign: 'center' },
  preview: {
    width: 180, height: 180, borderRadius: 18, alignSelf: 'center', marginBottom: 18, borderWidth: 2, borderColor: '#b6e388'
  },
  buttonRow: { flexDirection: 'row', justifyContent: 'center', gap: 12, marginBottom: 14 },
  button: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 14,
    marginHorizontal: 4,
    borderRadius: 10,
    elevation: 2,
    backgroundColor: '#2196F3',
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 8
  },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  error: { color: '#e74c3c', marginTop: 10, fontWeight: 'bold', textAlign: 'center' },
  resultCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 18,
    padding: 18,
    marginTop: 24,
    alignItems: 'center',
    elevation: 2
  },
  resultTitle: { color: '#14532d', fontSize: 20, fontWeight: 'bold', marginBottom: 12 },
  resultRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  resultImage: { width: 90, height: 90, borderRadius: 45, borderWidth: 3, borderColor: '#3B82F6', marginRight: 16 },
  resultInfo: { flexDirection: 'column' },
  resultName: { fontSize: 18, fontWeight: 'bold', color: '#14532d' },
  resultSci: { fontSize: 14, color: '#3B82F6', fontStyle: 'italic' },
  resultDetails: { marginTop: 8, width: '100%' },
  bold: { fontWeight: 'bold', color: '#14532d' }
});