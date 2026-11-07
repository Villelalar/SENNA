import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";

import {
  Alert,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
  ImageBackground,
  useWindowDimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function JogoCapScreen() {
  const router = useRouter();
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const telaEstreita = width < 360;
  const telaBaixa = height < 700;

  const margem = telaEstreita ? 16 : 20;

  const larguraConteudo = Math.max(
    0,
    Math.min(
      width - margem * 2 - insets.left - insets.right,
      400
    )
  );

  const espacoBotoes = 10;
  const larguraBotao = (larguraConteudo - espacoBotoes) / 2;

  // Os botões diminuem em telas baixas, sem impedir a rolagem.
  const alturaDisponivel = height - insets.top - insets.bottom;
  const alturaBotao = Math.max(
    112,
    Math.min(
      larguraBotao * 1.13,
      (alturaDisponivel - 330) / 2,
      180
    )
  );

  function opcaoIndisponivel() {
    if (Platform.OS === "web") {
      window.alert("Esta opção está indisponível.");
    } else {
      Alert.alert(
        "Opção indisponível",
        "Esta opção está indisponível."
      );
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.tela}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
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
              paddingTop: insets.top + (telaBaixa ? 18 : 24),
              paddingBottom: insets.bottom + 24,
              paddingLeft: margem + insets.left,
              paddingRight: margem + insets.right,
            },
          ]}
          showsVerticalScrollIndicator={false}
        >
          <View style={{ width: larguraConteudo }}>
            <View style={styles.thatTop}>
              <View style={styles.btnView}>
                <TouchableOpacity
                  style={styles.goBackBTN}
                  onPress={() => {
                    if (router.canGoBack()) {
                      router.back();
                    } else {
                      router.replace("/home");
                    }
                  }}
                  accessibilityRole="button"
                  accessibilityLabel="Voltar"
                >
                  <Text style={styles.btnGoBackTxt}>{"‹"}</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.topTxts}>
                <Text style={styles.capituloTxt1}>Capítulo 1</Text>
                <Text style={styles.capituloTxt2}>
                  Início Ayrton Senna
                </Text>
              </View>

              <View style={styles.ptsView}>
                <View style={styles.pstBackGround}>
                  <Text style={styles.pstTxt}>★ 0 pts</Text>
                </View>
              </View>
            </View>

            <View style={styles.middleView}>
              <View style={styles.countView}>
                <View>
                  <Text style={styles.tectoyTxt}>TECTOY</Text>
                </View>

                <View style={styles.visor}>
                  <Text
                    style={[
                      styles.visorTxt,
                      { fontSize: telaEstreita ? 34 : 40 },
                    ]}
                    adjustsFontSizeToFit
                    numberOfLines={1}
                  >
                    {"021->1:"}
                  </Text>
                </View>

                <View style={styles.tentativasView}>
                  <View style={styles.bolinhaAtiva} />
                  <View style={styles.bolinha} />
                  <View style={styles.bolinha} />

                  <Text style={styles.tentativaTxt}>
                    Tentativa 1 de 3
                  </Text>
                </View>
              </View>

              <View style={styles.respostasView}>
                <View style={styles.linhaRespostas}>
                  <View style={{ width: larguraBotao }}>
                    <TouchableOpacity
                      style={[
                        styles.respostaBTN,
                        styles.respostaA,
                        { minHeight: alturaBotao },
                      ]}
                      onPress={opcaoIndisponivel}
                      activeOpacity={0.8}
                      accessibilityRole="button"
                      accessibilityLabel="Resposta A"
                    >
                      <View>
                        <Text style={styles.respostaTxt}>A</Text>
                      </View>
                    </TouchableOpacity>
                  </View>

                  <View style={{ width: larguraBotao }}>
                    <TouchableOpacity
                      style={[
                        styles.respostaBTN,
                        styles.respostaB,
                        { minHeight: alturaBotao },
                      ]}
                      onPress={opcaoIndisponivel}
                      activeOpacity={0.8}
                      accessibilityRole="button"
                      accessibilityLabel="Resposta B"
                    >
                      <View>
                        <Text
                          style={[
                            styles.respostaTxt,
                            styles.respostaTxtEscuro,
                          ]}
                        >
                          B
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.linhaRespostas}>
                  <View style={{ width: larguraBotao }}>
                    <TouchableOpacity
                      style={[
                        styles.respostaBTN,
                        styles.respostaC,
                        { minHeight: alturaBotao },
                      ]}
                      onPress={opcaoIndisponivel}
                      activeOpacity={0.8}
                      accessibilityRole="button"
                      accessibilityLabel="Resposta C"
                    >
                      <View>
                        <Text style={styles.respostaTxt}>C</Text>
                      </View>
                    </TouchableOpacity>
                  </View>

                  <View style={{ width: larguraBotao }}>
                    <TouchableOpacity
                      style={[
                        styles.respostaBTN,
                        styles.respostaD,
                        { minHeight: alturaBotao },
                      ]}
                      onPress={opcaoIndisponivel}
                      activeOpacity={0.8}
                      accessibilityRole="button"
                      accessibilityLabel="Resposta D"
                    >
                      <View>
                        <Text style={styles.respostaTxt}>D</Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              <View style={styles.progressoView}>
                <View>
                  <Text style={styles.perguntaTxt}>
                    Pergunta 1 de 30
                  </Text>

                  <View
                    style={styles.barraProgresso}
                    accessibilityRole="progressbar"
                    accessibilityValue={{
                      min: 0,
                      max: 30,
                      now: 1,
                    }}
                  >
                    <View style={styles.barraPreenchida} />
                  </View>
                </View>
              </View>

              <View style={styles.reiniciarView}>
                <TouchableOpacity
                  style={styles.reiniciarBTN}
                  onPress={opcaoIndisponivel}
                  activeOpacity={0.8}
                  accessibilityRole="button"
                >
                  <View>
                    <Text style={styles.reiniciarTxt}>
                      Reiniciar jogo
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  tela: {
    flex: 1,
    backgroundColor: "#f5f5fb",
  },

  fundo: {
    flex: 1,
  },

  scroll: {
    flex: 1,
  },

  scrollConteudo: {
    flexGrow: 1,
    alignItems: "center",
  },

  thatTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 10,
  },

  btnView: {
    width: 36,
  },

  goBackBTN: {
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    width: 36,
    height: 36,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: "#e5e2ef",
  },

  btnGoBackTxt: {
    fontSize: 28,
    lineHeight: 30,
    color: "#171721",
  },

  topTxts: {
    flex: 1,
    minWidth: 0,
    justifyContent: "center",
  },

  capituloTxt1: {
    color: "#55515e",
    fontSize: 11,
    marginBottom: 2,
  },

  capituloTxt2: {
    color: "#15141e",
    fontSize: 14,
    fontWeight: "900",
    letterSpacing: -0.4,
  },

  ptsView: {
    alignItems: "flex-end",
    justifyContent: "center",
    flexShrink: 0,
  },

  pstBackGround: {
    backgroundColor: "#fff",
    minWidth: 62,
    minHeight: 32,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },

  pstTxt: {
    color: "#191823",
    fontSize: 12,
    fontWeight: "700",
  },

  middleView: {
    width: "100%",
  },

  countView: {
    backgroundColor: "#f0eac2",
    borderWidth: 1.5,
    borderColor: "#d9ce91",
    borderRadius: 22,
    padding: 12,
  },

  tectoyTxt: {
    color: "#d53c09",
    fontSize: 16,
    fontWeight: "900",
    letterSpacing: 2,
    marginBottom: 9,
  },

  visor: {
    backgroundColor: "#0d0b12",
    minHeight: 72,
    borderRadius: 12,
    justifyContent: "center",
    paddingHorizontal: 14,
    paddingVertical: 12,
  },

  visorTxt: {
    color: "#ff352c",
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
    fontWeight: "700",
    letterSpacing: 1,
  },

  tentativasView: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 6,
    marginTop: 10,
  },

  bolinhaAtiva: {
    width: 11,
    height: 11,
    borderRadius: 6,
    backgroundColor: "#ef610c",
  },

  bolinha: {
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: "#686047",
  },

  tentativaTxt: {
    fontSize: 11,
    color: "#57513c",
  },

  respostasView: {
    marginTop: 10,
    gap: 10,
  },

  linhaRespostas: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },

  respostaBTN: {
    width: "100%",
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },

  respostaA: {
    backgroundColor: "#db292b",
  },

  respostaB: {
    backgroundColor: "#ffd500",
  },

  respostaC: {
    backgroundColor: "#1963c2",
  },

  respostaD: {
    backgroundColor: "#2b8031",
  },

  respostaTxt: {
    color: "#fff",
    fontSize: 44,
    fontWeight: "900",
  },

  respostaTxtEscuro: {
    color: "#171719",
  },

  progressoView: {
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingHorizontal: 13,
    paddingVertical: 11,
    marginTop: 16,
  },

  perguntaTxt: {
    color: "#5b566c",
    fontSize: 11,
    marginBottom: 5,
  },

  barraProgresso: {
    height: 8,
    borderRadius: 4,
    backgroundColor: "#e5e2ef",
    overflow: "hidden",
  },

  barraPreenchida: {
    height: "100%",
    width: `${(1 / 30) * 100}%`,
    borderRadius: 4,
    backgroundColor: "#29b877",
  },

  reiniciarView: {
    marginTop: 10,
  },

  reiniciarBTN: {
    backgroundColor: "#fff",
    minHeight: 46,
    borderWidth: 1.5,
    borderColor: "#d9d3e8",
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },

  reiniciarTxt: {
    color: "#191720",
    fontSize: 14,
    fontWeight: "900",
  },
});