import { useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useFonts, Fredoka_700Bold } from "@expo-google-fonts/fredoka";
import {
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const categorias = [
  { selo: "1ª", texto: "Acertos na 1ª tentativa", cor: "#18864a" },
  { selo: "2ª", texto: "Acertos na 2ª tentativa", cor: "#1561b9" },
  { selo: "3ª", texto: "Acertos na 3ª tentativa", cor: "#875700" },
  { selo: "0", texto: "Sem acerto", cor: "#d52627" },
];

export default function FimProgramaScreen({
  programa = "011",
  pontos = 0,
  pontosMaximos = 90,
  totais = [0, 0, 0, 0],
  onVoltar,
  onJogarDeNovo,
}) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [fonteCarregada] = useFonts({ Fredoka_700Bold });
  const fonte = fonteCarregada ? styles.fredoka : styles.negrito;

  function irAoInicio() {
    router.replace("/home");
  }

  function voltar() {
    if (onVoltar) {
      onVoltar();
    } else if (router.canGoBack()) {
      router.back();
    } else {
      irAoInicio();
    }
  }

  function jogarDeNovo() {
    if (onJogarDeNovo) {
      onJogarDeNovo();
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
          <View style={styles.cabecalho}>
            <Pressable
              style={styles.voltar}
              onPress={voltar}
              accessibilityRole="button"
              accessibilityLabel="Voltar"
            >
              <Ionicons name="chevron-back" size={18} color="#111421" />
            </Pressable>
            <Text accessibilityRole="header" style={[styles.titulo, fonte]}>
              Fim do programa
            </Text>
          </View>

          <View style={styles.placar}>
            <Text>Programa {programa} concluído</Text>
            <Text style={[styles.pontos, fonte]}>{pontos}</Text>
            <Text>de {pontosMaximos} pontos</Text>
          </View>

          {categorias.map((categoria, indice) => (
            <View key={categoria.selo} style={styles.linha}>
              <View style={[styles.selo, { backgroundColor: categoria.cor }]}>
                <Text style={[styles.textoSelo, fonte]}>{categoria.selo}</Text>
              </View>
              <Text style={styles.rotulo}>{categoria.texto}</Text>
              <Text style={styles.negrito}>{totais[indice]}</Text>
            </View>
          ))}

          <View style={styles.rodape}>
            <Pressable
              style={[styles.botao, styles.botaoJogar]}
              onPress={jogarDeNovo}
              accessibilityRole="button"
            >
              <Text style={[styles.textoJogar, fonte]}>Jogar de novo</Text>
            </Pressable>

            <Pressable
              style={[styles.botao, styles.botaoInicio]}
              onPress={irAoInicio}
              accessibilityRole="button"
            >
              <Text style={fonte}>Voltar ao início</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  fundo: { flex: 1, backgroundColor: "#f5f5fb" },
  rolagem: { flexGrow: 1, alignItems: "center" },
  conteudo: { flexGrow: 1, width: "100%", maxWidth: 420, gap: 10 },
  cabecalho: { flexDirection: "row", alignItems: "center", gap: 10 },
  voltar: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    borderRadius: 13,
  },
  titulo: { flex: 1, color: "#111421", fontSize: 24 },
  fredoka: { fontFamily: "Fredoka_700Bold" },
  negrito: { fontWeight: "700" },
  placar: {
    alignItems: "center",
    padding: 16,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: "#f2d581",
    backgroundColor: "#fff5d9",
  },
  pontos: { fontSize: 48, color: "#111421" },
  linha: {
    minHeight: 62,
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    gap: 11,
    backgroundColor: "#fff",
    borderRadius: 17,
  },
  selo: {
    width: 39,
    height: 39,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
  },
  textoSelo: { color: "#fff" },
  rotulo: { flex: 1, color: "#111421", fontWeight: "600" },
  rodape: { marginTop: "auto", paddingTop: 14, gap: 10 },
  botao: {
    minHeight: 46,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 15,
    padding: 12,
  },
  botaoJogar: { backgroundColor: "#d62929" },
  botaoInicio: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#d4cfe5",
  },
  textoJogar: { color: "#fff" },
});
