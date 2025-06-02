import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import axios from 'axios';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Registro() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [confirmEmail, setConfirmEmail] = useState('');
  const [aceitouTermos, setAceitouTermos] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async () => {
    setError('');
    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }
    if (email !== confirmEmail) {
      setError('Os e-mails não coincidem.');
      return;
    }
    if (!aceitouTermos) {
      setError('Você precisa aceitar os termos de uso.');
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post('http://192.168.0.106:8000/api/registro/', {
        first_name: firstName,
        last_name: lastName,
        username,
        senha: password,
        email,
      });
      const token = response.data.token;
      await AsyncStorage.setItem('token', token);
      router.replace('/HomeUser');
    } catch (err) {
      if (err.response && err.response.data) {
        if (err.response.data.username) {
          setError(err.response.data.username[0]);
        } else {
          setError('Erro ao registrar');
        }
      } else {
        setError('Erro ao registrar');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Criar Conta</Text>
        <TextInput
          style={styles.input}
          placeholder="Nome"
          value={firstName}
          onChangeText={setFirstName}
        />
        <TextInput
          style={styles.input}
          placeholder="Sobrenome"
          value={lastName}
          onChangeText={setLastName}
        />
        <TextInput
          style={styles.input}
          placeholder="Nome de Usuário"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="E-mail"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder="Confirmar E-mail"
          value={confirmEmail}
          onChangeText={setConfirmEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder="Senha"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TextInput
          style={styles.input}
          placeholder="Confirmar Senha"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />
        <View style={styles.termosRow}>
          <TouchableOpacity
            style={styles.checkbox}
            onPress={() => setAceitouTermos(!aceitouTermos)}
          >
            <View style={[styles.checkboxBox, aceitouTermos && styles.checkboxBoxChecked]}>
              {aceitouTermos && <Text style={styles.checkboxCheck}>✓</Text>}
            </View>
          </TouchableOpacity>
          <Text style={styles.termosText}>
            Li e aceito os{' '}
            <Text style={styles.link} onPress={() => Alert.alert('Termos de Uso', 'Exiba os termos de uso aqui.')}>
              termos de uso
            </Text>{' '}
            e a{' '}
            <Text style={styles.link} onPress={() => Alert.alert('Política de Privacidade', 'Exiba a política de privacidade aqui.')}>
              política de privacidade
            </Text>.
          </Text>
        </View>
        <TouchableOpacity
          style={styles.button}
          onPress={handleRegister}
          disabled={loading}
        >
          <Text style={styles.buttonText}>{loading ? 'Criando...' : 'Criar conta'}</Text>
        </TouchableOpacity>
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <Text style={styles.loginText}>
          Já tem uma conta?{' '}
          <Text style={styles.link} onPress={() => router.replace('/Login')}>
            Entrar
          </Text>
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f5f7fa',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 10,
  },
  card: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 12,
    width: '100%',
    maxWidth: 400,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    color: '#333',
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    backgroundColor: '#f8f9fa',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    fontSize: 16,
    marginBottom: 12,
  },
  termosRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 14,
    width: '100%',
  },
  checkbox: {
    marginTop: 2,
    marginRight: 8,
  },
  checkboxBox: {
    width: 22,
    height: 22,
    borderWidth: 2,
    borderColor: '#007bff',
    borderRadius: 5,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxBoxChecked: {
    backgroundColor: '#007bff',
    borderColor: '#007bff',
  },
  checkboxCheck: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  termosText: {
    flex: 1,
    color: '#666',
    fontSize: 14,
    lineHeight: 20,
  },
  link: {
    color: '#007bff',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  button: {
    backgroundColor: '#007bff',
    borderRadius: 6,
    paddingVertical: 14,
    width: '100%',
    alignItems: 'center',
    marginTop: 6,
    marginBottom: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  error: {
    color: '#e74c3c',
    marginTop: 6,
    marginBottom: 2,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  loginText: {
    marginTop: 10,
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
  },
});