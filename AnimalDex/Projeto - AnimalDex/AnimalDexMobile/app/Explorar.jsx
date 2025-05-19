import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { useRouter } from 'expo-router';

const categorias = [
  { id: '1', nome: 'Mamíferos' },
  { id: '2', nome: 'Aves' },
  { id: '3', nome: 'Répteis' },
  { id: '4', nome: 'Anfíbios' },
  { id: '5', nome: 'Peixes' },
  { id: '6', nome: 'Insetos' },
];

export default function Explorar() {
  const router = useRouter();

  const navegarParaCategoria = (categoria) => {
    // Redirecionar para uma tela futura com detalhes da categoria
    router.push({ pathname: '/Categoria', params: { nome: categoria } });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Explorar Categorias</Text>

      <FlatList
        data={categorias}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.botao}
            onPress={() => navegarParaCategoria(item.nome)}
          >
            <Text style={styles.botaoTexto}>{item.nome}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 24,
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  botao: {
    backgroundColor: '#20B2AA',
    padding: 16,
    borderRadius: 10,
    marginBottom: 16,
    alignItems: 'center',
  },
  botaoTexto: {
    color: '#fff',
    fontSize: 18,
  },
});
