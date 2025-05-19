import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';

export default function Perfil() {
  const [usuario, setUsuario] = useState({});
  const router = useRouter();

  useEffect(() => {
    // Substituir por chamada real à API no futuro
    setUsuario({
      nome: 'João da Silva',
      email: 'joao@email.com',
      telefone: '(11) 98765-4321',
      endereco: 'Rua dos Animais, 123 - São Paulo',
    });
  }, []);

  const handleEditar = () => {
    router.push('/EditarPerfil');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Perfil do Usuário</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Nome:</Text>
        <Text style={styles.valor}>{usuario.nome}</Text>

        <Text style={styles.label}>Email:</Text>
        <Text style={styles.valor}>{usuario.email}</Text>

        <Text style={styles.label}>Telefone:</Text>
        <Text style={styles.valor}>{usuario.telefone}</Text>

        <Text style={styles.label}>Endereço:</Text>
        <Text style={styles.valor}>{usuario.endereco}</Text>
      </View>

      <TouchableOpacity style={styles.botao} onPress={handleEditar}>
        <Text style={styles.botaoTexto}>Editar Perfil</Text>
      </TouchableOpacity>
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
  card: {
    backgroundColor: '#f2f2f2',
    borderRadius: 10,
    padding: 20,
    marginBottom: 30,
  },
  label: {
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 12,
  },
  valor: {
    fontSize: 16,
    marginTop: 4,
  },
  botao: {
    backgroundColor: '#4682B4',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  botaoTexto: {
    color: '#fff',
    fontSize: 16,
  },
});
