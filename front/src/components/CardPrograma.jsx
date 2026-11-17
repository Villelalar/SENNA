import Ionicons from "@expo/vector-icons/Ionicons";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function CardPrograma({
  id,
  respondidas = 0,
  totalPerguntas = 0,
  cor = "#d62929",
  onSelecionar,
}) {
  const respondidasValidas = Math.min(respondidas, totalPerguntas);
  const progresso =
    totalPerguntas > 0 ? respondidasValidas / totalPerguntas : 0;
  const porcentagem = Math.round(progresso * 100);

  return (
    <Pressable
      onPress={onSelecionar}
      accessibilityRole="button"
      accessibilityLabel={`Programa ${id}, ${respondidasValidas} de ${totalPerguntas} perguntas respondidas`}
      style={({ pressed, hovered }) => [
        styles.card,
        hovered && styles.cardHover,
        pressed && styles.pressionado,
      ]}
    >
      <View style={[styles.selo, { backgroundColor: cor }]}>
        <Text style={styles.textoSelo}>{id}</Text>
      </View>

      <View style={styles.textos}>
        <Text style={styles.titulo}>Programa {id}</Text>

        <View style={styles.progresso}>
          <View style={styles.barra}>
            <View
              style={[styles.barraPreenchida, { width: `${porcentagem}%` }]}
            />
          </View>
          <Text style={styles.contagem}>
            {respondidasValidas} de {totalPerguntas}
          </Text>
        </View>
      </View>

      <Ionicons name="chevron-forward" size={24} color="#9a97a8" />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    padding: 16,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.06)",
    borderRadius: 22,
    boxShadow: "0px 6px 18px rgba(30, 30, 60, 0.06)",
  },
  cardHover: {
    boxShadow: "0px 8px 22px rgba(30, 30, 60, 0.1)",
  },
  pressionado: {
    transform: [{ scale: 0.98 }],
  },
  selo: {
    width: 52,
    height: 52,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  textoSelo: {
    fontSize: 15,
    fontWeight: "800",
    letterSpacing: 0.3,
    color: "#ffffff",
  },
  textos: {
    flex: 1,
    minWidth: 0,
    gap: 6,
  },
  titulo: {
    fontSize: 17,
    fontWeight: "800",
    color: "#15141e",
  },
  progresso: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  barra: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#e5e2ef",
    overflow: "hidden",
  },
  barraPreenchida: {
    height: "100%",
    borderRadius: 3,
    backgroundColor: "#29b877",
  },
  contagem: {
    fontSize: 13,
    color: "#55515e",
  },
});
