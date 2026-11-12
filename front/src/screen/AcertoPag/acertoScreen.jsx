import { useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useFonts, Fredoka_700Bold } from "@expo-google-fonts/fredoka";
import {
  Image,
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function AcertoScreen({
  programa = "011",
  numero = 1,
  total = 30,
  pontos = 0,
  resultado = { acertou: false, tentativa: 3, pontosGanhos: 0 },
  onProxima,
}) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [fonteCarregada] = useFonts({ Fredoka_700Bold });
  const fonte = fonteCarregada ? styles.fredoka : styles.negrito;
  const { acertou, tentativa, pontosGanhos } = resultado;

  function continuar() {
    if (onProxima) {
      onProxima();
    } else {
      router.replace({ pathname: "/jogocap", params: { programa } });
    }
  }

  return (
    <ImageBackground
      source={require("../../../assets/nuvens.png")}
      style={styles.fundo}
      resizeMode="cover"
    >
      <ScrollView
        contentContainerStyle={[
          styles.rolagem,
          {
            paddingTop: insets.top + 20,
            paddingBottom: insets.bottom + 20,
            paddingLeft: insets.left + 16,
            paddingRight: insets.right + 16,
          },
        ]}
      >
        <View style={styles.conteudo}>
          <Text style={styles.info}>
            Programa {programa} · Pergunta {numero} de {total}
          </Text>

          <View style={styles.resultado}>
            {acertou && (
              <Image
                source={require("../../../assets/acerto.png")}
                style={styles.imagem}
                resizeMode="contain"
              />
            )}

            <Text accessibilityRole="header" style={[styles.titulo, fonte]}>
              {acertou ? "Acertou!" : "Tentativas esgotadas"}
            </Text>

            <Text style={styles.info}>
              {acertou
                ? `Na ${tentativa}ª tentativa`
                : "Esta pergunta valeu 0 pontos"}
            </Text>

            <View style={styles.estrelas}>
              {[1, 2, 3].map((estrela) => (
                <Ionicons
                  key={estrela}
                  name={estrela <= pontosGanhos ? "star" : "star-outline"}
                  size={34}
                  color={estrela <= pontosGanhos ? "#f4b301" : "#746e7e"}
                />
              ))}
            </View>

            <View style={styles.selo}>
              <Text style={[styles.pontosGanhos, fonte]}>
                +{pontosGanhos} {pontosGanhos === 1 ? "ponto" : "pontos"}
              </Text>
            </View>
          </View>

          <View style={styles.placar}>
            <Text>Total até agora</Text>
            <Text style={[styles.total, fonte]}>{pontos} pts</Text>
          </View>

          <Pressable
            style={styles.botao}
            onPress={continuar}
            accessibilityRole="button"
          >
            <Text style={[styles.textoBotao, fonte]}>
              {numero === total ? "Ver resultado" : "Próxima pergunta"}
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  fundo: { flex: 1, backgroundColor: "#f5f5fb" },
  rolagem: { flexGrow: 1, alignItems: "center" },
  conteudo: { flexGrow: 1, width: "100%", maxWidth: 350, gap: 10 },
  info: { color: "#4b4d61", textAlign: "center" },
  resultado: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 24,
    gap: 10,
  },
  imagem: { width: 140, height: 140 },
  titulo: { fontSize: 34, color: "#14141e", textAlign: "center" },
  fredoka: { fontFamily: "Fredoka_700Bold" },
  negrito: { fontWeight: "bold" },
  estrelas: { flexDirection: "row", gap: 8 },
  selo: { backgroundColor: "#14141e", borderRadius: 24, padding: 10 },
  pontosGanhos: { color: "#ffd401", fontSize: 23, paddingHorizontal: 10 },
  placar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 13,
    borderRadius: 15,
  },
  total: { color: "#14141e", fontSize: 23 },
  botao: {
    minHeight: 48,
    padding: 13,
    justifyContent: "center",
    backgroundColor: "#208a4c",
    borderRadius: 15,
  },
  textoBotao: { color: "#fff", fontSize: 16, textAlign: "center" },
});
