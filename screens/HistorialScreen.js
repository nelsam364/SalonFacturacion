import { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { supabase } from "../supabase";

export default function HistorialScreen() {
  const [facturas, setFacturas] = useState([]);

  async function cargarHistorial() {
    // 1. Obtener facturas con cliente
    const { data: facturasData, error: facturasError } = await supabase
      .from("facturas")
      .select("id, total, fecha, clientes(nombre)")
      .order("fecha", { ascending: false });

    if (facturasError) {
      console.error(facturasError);
      return;
    }

    // 2. Obtener detalles de facturas
    const { data: detallesData, error: detallesError } = await supabase
      .from("factura_detalle")
      .select("factura_id, servicios(nombre, precio), cantidad, subtotal");

    if (detallesError) {
      console.error(detallesError);
      return;
    }

    // 3. Combinar facturas con sus detalles
    const facturasConDetalles = facturasData.map((factura) => {
      const detalles = detallesData.filter(
        (detalle) => detalle.factura_id === factura.id
      );
      return { ...factura, detalles };
    });

    setFacturas(facturasConDetalles);
  }

  useEffect(() => {
    cargarHistorial();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Historial de Facturas</Text>

      <FlatList
        data={facturas}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.facturaCard}>
            <Text style={styles.cliente}>
              Cliente: {item.clientes?.nombre ?? "Desconocido"}
            </Text>
            <Text>Fecha: {new Date(item.fecha).toLocaleString()}</Text>
            <Text style={styles.total}>Total: ${item.total}</Text>

            <Text style={styles.subtitulo}>Servicios:</Text>
            {item.detalles.map((detalle, index) => (
              <View key={index} style={styles.detalle}>
                <Text>
                  {detalle.servicios?.nombre} x {detalle.cantidad} = ${detalle.subtotal}
                </Text>
              </View>
            ))}
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  titulo: { fontSize: 22, fontWeight: "bold", marginBottom: 10 },
  facturaCard: {
    backgroundColor: "#f5f5f5",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  cliente: { fontWeight: "bold", fontSize: 16 },
  total: { fontWeight: "bold", marginTop: 5 },
  subtitulo: { marginTop: 10, fontWeight: "bold" },
  detalle: { marginLeft: 10 },
});