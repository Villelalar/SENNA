import { StatusBar } from "expo-status-bar";
import Ionicons from "@expo/vector-icons/Ionicons";
import {
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useFonts, Fredoka_700Bold } from "@expo-google-fonts/fredoka";

export default function JogoCapScreen() {
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const [fontsLoaded] = useFonts({ Fredoka_700Bold });

  const larguraFundo = Math.min(width, 440);
  const larguraUtil = larguraFundo - insets.left - insets.right;
  const alturaUtil = height - insets.top - insets.bottom;
  const telaEstreita = larguraUtil < 360;
  const telaBaixa = alturaUtil < 660;

  const margem = telaEstreita ? 12 : 20;
  const larguraConteudo = Math.max(
    0,
    Math.min(larguraUtil - margem * 2, 350),
  );

  const tamanhoImagem = Math.min(
    larguraConteudo * 0.52,
    telaBaixa ? 132 : 180,
  );
  const tamanhoEstrela = telaEstreita || telaBaixa ? 32 : 40;
  const fonteDestaque = fontsLoaded ? styles.fonteFredoka : styles.fontePadrao;

  return (
    <View style={styles.tela}>
      <StatusBar style="dark" />

      <ImageBackground
        source={require("../../../assets/nuvens.png")}
        style={styles.fundo}
        resizeMode="cover"
      >
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={[
            styles.scrollConteudo,
            {
              paddingTop: insets.top + (telaBaixa ? 12 : 24),
              paddingBottom: insets.bottom + (telaBaixa ? 16 : 24),
              paddingLeft: insets.left + margem,
              paddingRight: insets.right + margem,
            },
          ]}
        >
          <View style={[styles.conteudo, { width: larguraConteudo }]}>
            <Text style={styles.programaTxt}>
              Programa 021 · Pergunta 1 de 30
            </Text>

            <View
              style={[
                styles.resultado,
                { paddingVertical: telaBaixa ? 16 : 28 },
              ]}
            >
              <Image
                source={require("../../../assets/acerto.png")}
                style={{ width: tamanhoImagem, height: tamanhoImagem }}
                resizeMode="contain"
              />

              <View style={styles.acertouTxtView}>
                <Text
                  style={[
                    styles.acertouTxt,
                    fonteDestaque,
                    { fontSize: telaEstreita || telaBaixa ? 34 : 40 },
                  ]}
                >
                  Acertou!
                </Text>
                <Text style={styles.acertouTxt2}>Na 1ª tentativa</Text>
              </View>

              <View style={styles.starView}>
                <Ionicons name="star" size={tamanhoEstrela} color="rgb(244, 179, 1)" />
                <Ionicons name="star" size={tamanhoEstrela} color="rgb(244, 179, 1)" />
                <Ionicons name="star" size={tamanhoEstrela} color="rgb(244, 179, 1)" />
              </View>

              <TouchableOpacity style={styles.pontosBtn}>
                <Text
                  style={[
                    styles.pontosBtnTxt,
                    fonteDestaque,
                    { fontSize: telaEstreita || telaBaixa ? 24 : 30 },
                  ]}
                >
                  +3 pontos
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.doubleBtnsView}>
              <TouchableOpacity style={styles.doublebtn1}>
                <Text style={styles.totalTxt}>Total até agora</Text>
                <Text style={[styles.ptsTxt, fonteDestaque]}>3 pts</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.doublebtn2}>
                <Text style={[styles.proxPerguntaTxt, fonteDestaque]}>
                  Próxima pergunta
                </Text>
              </TouchableOpacity>
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
    backgroundColor: "#f5f5fb",
  },
  fundo: {
    flex: 1,
    width: "100%",
    alignSelf: "center",
  },
  scroll: {
    flex: 1,
  },
  scrollConteudo: {
    flexGrow: 1,
    alignItems: "center",
  },
  conteudo: {
    flexGrow: 1,
  },
  programaTxt: {
    color: "rgb(64, 63, 82)",
    textAlign: "center",
  },
  resultado: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  acertouTxtView: {
    alignItems: "center",
  },
  acertouTxt: {
    color: "rgb(20, 20, 30)",
    textAlign: "center",
  },
  fonteFredoka: {
    fontFamily: "Fredoka_700Bold",
  },
  fontePadrao: {
    fontWeight: "bold",
  },
  acertouTxt2: {
    color: "rgb(75, 77, 97)",
    fontSize: 16,
    marginTop: 4,
    textAlign: "center",
  },
  starView: {
    flexDirection: "row",
    gap: 8,
  },
  pontosBtn: {
    maxWidth: "100%",
    minHeight: 48,
    paddingVertical: 8,
    paddingHorizontal: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgb(20, 20, 30)",
    borderRadius: 50,
  },
  pontosBtnTxt: {
    color: "rgb(255, 212, 1)",
    textAlign: "center",
  },
  doubleBtnsView: {
    gap: 10,
  },
  doublebtn1: {
    minHeight: 48,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#fff",
    padding: 13,
    borderRadius: 15,
  },
  totalTxt: {
    color: "rgb(96, 95, 111)",
    flexShrink: 1,
  },
  ptsTxt: {
    color: "rgb(20, 20, 30)",
    fontSize: 23,
  },
  doublebtn2: {
    minHeight: 48,
    justifyContent: "center",
    backgroundColor: "rgb(32, 138, 76)",
    padding: 13,
    borderRadius: 15,
  },
  proxPerguntaTxt: {
    color: "#fff",
    fontSize: 15,
    textAlign: "center",
  },
});