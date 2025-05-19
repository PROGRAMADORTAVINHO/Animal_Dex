import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';

export default function CadastroAnimais() {
  const [nome, setNome] = useState('');
  const [especie, setEspecie] = useState('');
  const [raca, setRaca] = useState('');
  const [idade, setIdade] = useState('');
  const router = useRouter();

  const handleCadastro = () => {
    if (!nome || !especie || !raca || !idade) {
      Alert.alert('Erro', 'Preencha todos os campos!');
      return;
    }

    // Aqui você deve enviar os dados para sua API
    Alert.alert('Sucesso', 'Animal cadastrado com sucesso!');
    setNome('');
    setEspecie('');
    setRaca('');
    setIdade('');
    router.push('/ListaAnimais');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.titulo}>Cadastro de Animais</Text>

      <TextInput
        style={styles.input}
        placeholder="Nome"
        value={nome}
        onChangeText={setNome}
      />
      <TextInput
        style={styles.input}
        placeholder="Espécie"
        value={especie}
        onChangeText={setEspecie}
      />
      <TextInput
        style={styles.input}
        placeholder="Raça"
        value={raca}
        onChangeText={setRaca}
      />
      <TextInput
        style={styles.input}
        placeholder="Idade"
        value={idade}
        onChangeText={setIdade}
        keyboardType="numeric"
      />

      <TouchableOpacity style={styles.button} onPress={handleCadastro}>
        <Text style={styles.buttonText}>Cadastrar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 40,
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
    borderColor: '#aaa',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#008080',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});
