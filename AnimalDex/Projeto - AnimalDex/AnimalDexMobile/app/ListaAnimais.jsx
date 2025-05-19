import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function ListaAnimais() {
  const [animais, setAnimais] = useState([]);
  const router = useRouter();

  useEffect(() => {
    // Substitua pela chamada real da API no futuro
    setAnimais([
      { id: 1, nome: 'Leão', raca: 'Africano' },
      { id: 2, nome: 'Tigre', raca: 'Siberiano' },
    ]);
  }, []);

  const handleExcluir = (id) => {
    Alert.alert(
      'Confirmar exclusão',
      'Tem certeza que deseja excluir este animal?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => {
            setAnimais((prev) => prev.filter((animal) => animal.id !== id));
          },
        },
      ]
    );
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.nome}>{item.nome}</Text>
      <Text style={styles.raca}>Raça: {item.raca}</Text>
      <View style={styles.botoes}>
        <TouchableOpacity
          style={styles.botaoEditar}
          onPress={() => router.push(`/EditarAnimal?id=${item.id}`)}
        >
          <Text style={styles.botaoTexto}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.botaoExcluir}
          onPress={() => handleExcluir(item.id)}
        >
          <Text style={styles.botaoTexto}>Excluir</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Lista de Animais</Text>
      <FlatList
        data={animais}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#eee',
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
  },
  nome: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  raca: {
    fontSize: 14,
    marginTop: 4,
  },
  botoes: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
  },
  botaoEditar: {
    marginRight: 12,
    backgroundColor: '#4682B4',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  botaoExcluir: {
    backgroundColor: '#B22222',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  botaoTexto: {
    color: '#fff',
  },
});
