
import { NavigationContainer } from '@react-navigation/native';

import { createNativeStackNavigator } from '@react-navigation/native-stack';

 

import LoginScreen from './screens/LoginScreen';

import ClientesScreen from './screens/ClientesScreen';

import ServiciosScreen from './screens/ServiciosScreen';

import FacturacionScreen from './screens/FacturacionScreen';

import HistorialScreen from './screens/HistorialScreen';

 

const Stack = createNativeStackNavigator(); 

 

export default function App() { 

  return ( 

    <NavigationContainer> 

      <Stack.Navigator initialRouteName="Login"> 

        <Stack.Screen name="Login" component={LoginScreen} /> 

        <Stack.Screen name="Clientes" component={ClientesScreen} /> 

        <Stack.Screen name="Servicios" component={ServiciosScreen} /> 

        <Stack.Screen name="Facturación" component={FacturacionScreen} /> 

        <Stack.Screen name="Historial" component={HistorialScreen} /> 

      </Stack.Navigator> 

    </NavigationContainer> 

  ); 

} 

Forma 
