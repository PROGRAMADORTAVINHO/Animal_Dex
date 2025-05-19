import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';

export default function HomeBemVindo() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/images/logo.png')} // Substitua pelo caminho correto do logo
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.title}>Bem-vindo ao AnimalDex</Text>
      <Text style={styles.description}>
        Sua jornada pelo mundo animal começa aqui! Explore, aprenda e colecione.
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push('/Login')}
      >
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.registerButton}
        onPress={() => router.push('/Registro')}
      >
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
    alignItems: 'center',
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    color: '#555',
    marginBottom: 32,
  },
  button: {
    backgroundColor: '#008080',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
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