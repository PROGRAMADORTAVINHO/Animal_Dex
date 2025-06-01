import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      {/* Remova a referência ao (tabs) */}
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="Login" />
      <Stack.Screen name="HomeUser" />
      <Stack.Screen name="CadastroAnimais" />
      <Stack.Screen name="ListaAnimais" />
      <Stack.Screen name="Perfil" />
      <Stack.Screen name="EditarPerfil" />
      <Stack.Screen name="Explorar" />
      <Stack.Screen name="AnimalDex" />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}