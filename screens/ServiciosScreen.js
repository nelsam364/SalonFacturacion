import { useEffect, useState } from "react";
import { Alert, Button, FlatList, Text, TextInput, View } from "react-native";
import { supabase } from "../supabase";

export default function ServiciosScreen() {
  const [nombre, setNombre] = useState("");
  const [precio, setPrecio] = useState("");
  const [servicios, setServicios] = useState([]);

  async function guardarServicio() {
    if (!nombre || !precio) {
      Alert.alert("Error", "Debes ingresar nombre y precio");
      return;
    }

    const { error } = await supabase.from("servicios").insert([
      {
        nombre,
        precio: parseFloat(precio),
      },
    ]);

    if (error) {
      Alert.alert("Error al guardar", error.message);
    } else {
      Alert.alert("Éxito", "Servicio guardado");
      setNombre("");
      setPrecio("");
      cargarServicios();
    }
  }

  async function cargarServicios() {
    const { data, error } = await supabase
      .from("servicios")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error) setServicios(data);
  }

  useEffect(() => {
    cargarServicios();
  }, []);

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 22, fontWeight: "bold", marginBottom: 10 }}>
        Registrar Servicio
      </Text>

      <TextInput
        placeholder="Nombre del servicio"
        style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
        value={nombre}
        onChangeText={setNombre}
      />
      <TextInput
        placeholder="Precio"
        style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
        value={precio}
        onChangeText={setPrecio}
        keyboardType="numeric"
      />
      <Button title="Guardar Servicio" onPress={guardarServicio} />

      <Text style={{ marginTop: 20, fontSize: 18 }}>Lista de servicios:</Text>
      <FlatList
        data={servicios}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{ padding: 10, borderBottomWidth: 1, borderColor: "#ccc" }}>
            <Text style={{ fontWeight: "bold" }}>{item.nombre}</Text>
            <Text>${item.precio}</Text>
          </View>
        )}
      />
    </View>
  );
}
