import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';

export default function EditarPerfil() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [endereco, setEndereco] = useState('');
  const router = useRouter();

  useEffect(() => {
    // Dados simulados. Substituir com chamada real à API
    setNome('João da Silva');
    setEmail('joao@email.com');
    setTelefone('(11) 98765-4321');
    setEndereco('Rua dos Animais, 123 - São Paulo');
  }, []);

  const handleSalvar = () => {
    if (!nome || !email || !telefone || !endereco) {
      Alert.alert('Erro', 'Todos os campos devem ser preenchidos!');
      return;
    }

    // Enviar dados atualizados para API aqui
    Alert.alert('Sucesso', 'Perfil atualizado com sucesso!');
    router.push('/Perfil');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.titulo}>Editar Perfil</Text>

      <TextInput
        style={styles.input}
        placeholder="Nome"
        value={nome}
        onChangeText={setNome}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Telefone"
        value={telefone}
        onChangeText={setTelefone}
        keyboardType="phone-pad"
      />
      <TextInput
        style={styles.input}
        placeholder="Endereço"
        value={endereco}
        onChangeText={setEndereco}
      />

      <TouchableOpacity style={styles.botao} onPress={handleSalvar}>
        <Text style={styles.botaoTexto}>Salvar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: '#fff',
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  botao: {
    backgroundColor: '#008080',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
  },
  botaoTexto: {
    color: '#fff',
    fontSize: 16,
  },
});
