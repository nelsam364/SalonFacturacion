import { Picker } from "@react-native-picker/picker"; // Instalar: npx expo install @react-native-picker/picker
import { useEffect, useState } from "react";
import { Alert, Button, Text, View } from "react-native";
import { supabase } from "../supabase";

export default function FacturacionScreen() {
  const [clientes, setClientes] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
  const [servicioSeleccionado, setServicioSeleccionado] = useState(null);

  async function cargarDatos() {
    const { data: clientesData } = await supabase.from("clientes").select("*");
    const { data: serviciosData } = await supabase.from("servicios").select("*");

    setClientes(clientesData || []);
    setServicios(serviciosData || []);
  }

  useEffect(() => {
    cargarDatos();
  }, []);

  async function crearFactura() {
    if (!clienteSeleccionado || !servicioSeleccionado) {
      Alert.alert("Error", "Selecciona un cliente y un servicio");
      return;
    }

    // Buscar servicio para obtener su precio
    const servicio = servicios.find((s) => s.id === servicioSeleccionado);
    const total = servicio.precio;

    // 1. Crear la factura
    const { data: factura, error: facturaError } = await supabase
      .from("facturas")
      .insert([{ cliente_id: clienteSeleccionado, total }])
      .select()
      .single();

    if (facturaError) {
      Alert.alert("Error", facturaError.message);
      return;
    }

    // 2. Crear el detalle de la factura
    const { error: detalleError } = await supabase.from("factura_detalle").insert([
      {
        factura_id: factura.id,
        servicio_id: servicioSeleccionado,
        cantidad: 1,
        subtotal: total,
      },
    ]);

    if (detalleError) {
      Alert.alert("Error", detalleError.message);
    } else {
      Alert.alert("Éxito", "Factura creada correctamente");
    }
  }

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 22, fontWeight: "bold", marginBottom: 10 }}>Crear Factura</Text>

      <Text>Cliente:</Text>
      <Picker
        selectedValue={clienteSeleccionado}
        onValueChange={(itemValue) => setClienteSeleccionado(itemValue)}
      >
        <Picker.Item label="Selecciona un cliente" value={null} />
        {clientes.map((cliente) => (
          <Picker.Item key={cliente.id} label={cliente.nombre} value={cliente.id} />
        ))}
      </Picker>

      <Text>Servicio:</Text>
      <Picker
        selectedValue={servicioSeleccionado}
        onValueChange={(itemValue) => setServicioSeleccionado(itemValue)}
      >
        <Picker.Item label="Selecciona un servicio" value={null} />
        {servicios.map((servicio) => (
          <Picker.Item
            key={servicio.id}
            label={`${servicio.nombre} - $${servicio.precio}`}
            value={servicio.id}
          />
        ))}
      </Picker>

      <Button title="Generar Factura" onPress={crearFactura} />
    </View>
  );
}
