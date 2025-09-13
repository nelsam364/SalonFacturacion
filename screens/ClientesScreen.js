import React, { useState } from "react";
import { Alert, Button, FlatList, Text, TextInput, View } from "react-native";
import { supabase } from "../supabase";

export default function ClientesScreen() {
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [correo, setCorreo] = useState("");
  const [clientes, setClientes] = useState([]);

  async function guardarCliente() {
    if (!nombre) {
      Alert.alert("Error", "El nombre es obligatorio");
      return;
    }

    const { data, error } = await supabase.from("clientes").insert([
      {
        nombre,
        telefono,
        correo,
      },
    ]);

    if (error) {
      Alert.alert("Error al guardar", error.message);
    } else {
      Alert.alert("Éxito", "Cliente guardado");
      setNombre("");
      setTelefono("");
      setCorreo("");
      cargarClientes(); // para refrescar la lista
    }
  }

  async function cargarClientes() {
    const { data, error } = await supabase.from("clientes").select("*").order("created_at", { ascending: false });

    if (!error && data) {
      setClientes(data);
    }
  }

  // Cargar clientes al inicio
  React.useEffect(() => {
    cargarClientes();
  }, []);

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 22, fontWeight: "bold", marginBottom: 10 }}>Registrar Cliente</Text>

      <TextInput
        placeholder="Nombre"
        style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
        value={nombre}
        onChangeText={setNombre}
      />
      <TextInput
        placeholder="Teléfono"
        style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
        value={telefono}
        onChangeText={setTelefono}
      />
      <TextInput
        placeholder="Correo"
        style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
        value={correo}
        onChangeText={setCorreo}
      />
      <Button title="Guardar Cliente" onPress={guardarCliente} />

      <Text style={{ marginTop: 20, fontSize: 18 }}>Lista de clientes:</Text>
      <FlatList
        data={clientes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{ padding: 10, borderBottomWidth: 1, borderColor: "#ccc" }}>
            <Text style={{ fontWeight: "bold" }}>{item.nombre}</Text>
            <Text>{item.telefono}</Text>
            <Text>{item.correo}</Text>
          </View>
        )}
      />
    </View>
  );
}
