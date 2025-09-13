import { useState } from 'react';

import { Alert, Button, StyleSheet, Text, TextInput, View } from 'react-native';

import { supabase } from './supabase';

import { useNavigation } from '@react-navigation/native';

 

export default function LoginScreen() { 

  const [email, setEmail] = useState(''); 

  const [password, setPassword] = useState(''); 

  const navigation = useNavigation(); 

 

  const handleLogin = async () => { 

    const { data, error } = await supabase.auth.signInWithPassword({ 

      email, 

      password, 

    }); 

 

    if (error) { 

      Alert.alert('Error', error.message); 

    } else { 

      Alert.alert('Éxito', 'Has iniciado sesión'); 

      navigation.navigate('Home'); // Cambia 'Home' por tu pantalla principal 

    } 

  }; 

 

  return ( 

    <View style={styles.container}> 

      <Text style={styles.title}>Iniciar Sesión</Text> 

      <TextInput 

        style={styles.input} 

        placeholder="Correo" 

        value={email} 

        onChangeText={setEmail} 

        keyboardType="email-address" 

        autoCapitalize="none" 

      /> 

      <TextInput 

        style={styles.input} 

        placeholder="Contraseña" 

        value={password} 

        onChangeText={setPassword} 

        secureTextEntry 

      /> 

      <Button title="Login" onPress={handleLogin} /> 

    </View> 

  ); 

} 

 

const styles = StyleSheet.create({ 

  container: { flex: 1, justifyContent: 'center', padding: 20 }, 

  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' }, 

  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 15, borderRadius: 5 }, 

}); 