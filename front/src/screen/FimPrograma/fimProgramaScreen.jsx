import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Fredoka_700Bold, useFonts } from "@expo-google-fonts/fredoka";
import {
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const resultadosPadrao = [
  { selo: "1ª", texto: "Acertos na 1ª tentativa", total: 20, cor: "#18864A" },
  { selo: "2ª", texto: "Acertos na 2ª tentativa", total: 6, cor: "#1561B9" },
  { selo: "3ª", texto: "Acertos na 3ª tentativa", total: 3, cor: "#875700" },
  { selo: "0", texto: "Sem acerto", total: 1, cor: "#D52627" },
];

export default function FimProgramaScreen({
  programa = "021",
  pontos = 75,
  pontosMaximos = 90,
  resultados = resultadosPadrao,
  onJogarDeNovo,
} = {}) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [fontsLoaded] = useFonts({ Fredoka_700Bold });
  const fonteDestaque = fontsLoaded ? styles.fredoka : styles.negrito;

  function voltarAoInicio() {
    router.replace("/");
  }

  function voltar() {
    if (router.canGoBack()) {
      router.back();
    } else {
      voltarAoInicio();
    }
  }

  function jogarDeNovo() {
    if (onJogarDeNovo) {
      onJogarDeNovo();
    } else {
      voltar();
    }
  }

  return (
    <View style={styles.tela}>
      <StatusBar style="dark" />

      <ImageBackground
        source={require("../../../assets/nuvens.png")}
        resizeMode="cover"
        style={styles.fundo}
      >
        <ScrollView
          style={styles.rolagem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.areaSegura,
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
                accessibilityRole="button"
                accessibilityLabel="Voltar"
                onPress={voltar}
                hitSlop={4}
                style={({ pressed }) => [
                  styles.botaoVoltar,
                  pressed && styles.pressionado,
                ]}
              >
                <Ionicons name="chevron-back" size={17} color="#111421" />
              </Pressable>

              <Text
                accessibilityRole="header"
                style={[styles.titulo, fonteDestaque]}
              >
                Fim do programa
              </Text>
            </View>

            <View style={styles.cartaoPontuacao}>
              <Text style={styles.programa}>Programa {programa} concluído</Text>
              <Text style={[styles.pontuacao, fonteDestaque]}>{pontos}</Text>
              <Text style={styles.pontosMaximos}>de {pontosMaximos} pontos</Text>
            </View>

            <View style={styles.lista}>
              {resultados.map(({ selo, texto, total, cor }) => (
                <View key={selo} style={styles.linha}>
                  <View
                    accessible={false}
                    accessibilityElementsHidden
                    importantForAccessibility="no-hide-descendants"
                    style={[styles.selo, { backgroundColor: cor }]}
                  >
                    <Text style={[styles.seloTexto, fonteDestaque]}>
                      {selo}
                    </Text>
                  </View>

                  <Text style={styles.rotulo}>{texto}</Text>
                  <Text style={styles.total}>{total}</Text>
                </View>
              ))}
            </View>

            <View style={styles.rodape}>
              <Pressable
                accessibilityRole="button"
                onPress={jogarDeNovo}
                style={({ pressed }) => [
                  styles.botao,
                  styles.botaoJogar,
                  pressed && styles.pressionado,
                ]}
              >
                <Text style={[styles.textoJogar, fonteDestaque]}>
                  Jogar de novo
                </Text>
              </Pressable>

              <Pressable
                accessibilityRole="button"
                onPress={voltarAoInicio}
                style={({ pressed }) => [
                  styles.botao,
                  styles.botaoInicio,
                  pressed && styles.pressionado,
                ]}
              >
                <Text style={[styles.textoInicio, fonteDestaque]}>
                  Voltar ao início
                </Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  tela: {
    flex: 1,
    backgroundColor: "#F5F5FB",
  },
  fundo: {
    flex: 1,
    width: "100%",
    maxWidth: 480,
    alignSelf: "center",
  },
  rolagem: {
    flex: 1,
  },
  areaSegura: {
    flexGrow: 1,
    alignItems: "center",
  },
  conteudo: {
    flexGrow: 1,
    width: "100%",
    maxWidth: 420,
  },
  fredoka: {
    fontFamily: "Fredoka_700Bold",
  },
  negrito: {
    fontWeight: "700",
  },
  cabecalho: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 10,
  },
  botaoVoltar: {
    width: 37,
    height: 37,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: "#E4E4EE",
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  titulo: {
    flex: 1,
    color: "#111421",
    fontSize: 24,
  },
  cartaoPontuacao: {
    minHeight: 132,
    paddingVertical: 16,
    paddingHorizontal: 12,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 17,
    borderWidth: 1,
    borderColor: "#F2D581",
    backgroundColor: "#FFF5D9",
  },
  programa: {
    color: "#45495C",
    fontSize: 11,
    textAlign: "center",
  },
  pontuacao: {
    color: "#111421",
    fontSize: 48,
    textAlign: "center",
  },
  pontosMaximos: {
    color: "#111421",
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
  lista: {
    marginTop: 10,
    gap: 10,
  },
  linha: {
    minHeight: 62,
    paddingVertical: 10,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 11,
    backgroundColor: "#FCFDFD",
    borderWidth: 1,
    borderColor: "#E4E5EF",
    borderRadius: 17,
  },
  selo: {
    width: 39,
    minHeight: 39,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
  },
  seloTexto: {
    color: "#FFFFFF",
    fontSize: 14,
    textAlign: "center",
  },
  rotulo: {
    flex: 1,
    color: "#111421",
    fontSize: 14,
    fontWeight: "600",
  },
  total: {
    color: "#111421",
    fontSize: 14,
    fontWeight: "600",
    textAlign: "right",
  },
  rodape: {
    marginTop: "auto",
    paddingTop: 24,
    gap: 10,
  },
  botao: {
    minHeight: 45,
    paddingVertical: 10,
    paddingHorizontal: 12,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 15,
  },
  botaoJogar: {
    backgroundColor: "#D62929",
  },
  botaoInicio: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1.5,
    borderColor: "#D4CFE5",
  },
  textoJogar: {
    color: "#FFFFFF",
    fontSize: 14,
    textAlign: "center",
  },
  textoInicio: {
    color: "#111421",
    fontSize: 14,
    textAlign: "center",
  },
  pressionado: {
    opacity: 0.8,
  },
});