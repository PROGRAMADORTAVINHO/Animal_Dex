import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import axios from 'axios'; // Certifique-se de que o axios está instalado
import AsyncStorage from '@react-native-async-storage/async-storage'; // Importa o AsyncStorage

export default function Login() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [senha, setSenha] = useState('');

  const handleLogin = async () => {
  if (!username || !senha) {
    Alert.alert('Erro', 'Preencha todos os campos!');
    return;
  }

  try {
    const response = await axios.post('http://192.168.0.106:8000/api/login/', {
      username,
      password: senha,
    });

    if (response.data.token) {
      await AsyncStorage.setItem('token', response.data.token); // Salva o token no AsyncStorage
      router.push('/HomeUser'); // Redireciona para a página inicial
    } else {
      Alert.alert('Erro', 'Nome de usuário ou senha inválidos');
    }
  } catch (error) {
    Alert.alert('Erro', 'Ocorreu um erro ao fazer login. Tente novamente.');
  }
};


  const handleRegister = () => {
    router.push('/Registro'); // Redireciona para a página de registro
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <TextInput
        style={styles.input}
        placeholder="Nome de Usuário"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Senha"
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
        <Text style={styles.registerButtonText}>Registrar-se</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    alignSelf: 'center',
    marginBottom: 32,
  },
  input: {
    borderWidth: 1,
    borderColor: '#888',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#008080',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  registerButton: {
    alignItems: 'center',
  },
  registerButtonText: {
    color: '#008080',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
});