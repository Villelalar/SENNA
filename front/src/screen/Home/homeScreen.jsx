import "../../../CSS/Screen/homeScreen.css";

import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useCallback, useState } from "react";
import {
  Alert,
  ImageBackground,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import BarraNavegacao from "../../components/BarraNavegacao";
import { obterProximoPrograma } from "../../data/estatisticas.js";

const opcoes = [
  {
    titulo: "Jogos",
    descricao: "12 disponíveis",
    rota: "/games",
    icone: "game-controller",
    cor: "#e64e42",
    fundo: "#fff2f0",
    borda: "#df8a83",
  },
  {
    titulo: "Livros",
    descricao: "Cap. 1 - Senna",
    rota: "/book",
    icone: "book",
    cor: "#e4c300",
    fundo: "#fffbed",
    borda: "#e2cf68",
  },
  {
    titulo: "Estatística",
    rota: "/estatistica",
    descricao: "Veja seus pontos",
    icone: "trending-up",
    cor: "#20bf59",
    fundo: "#eefbf2",
    borda: "#79c99a",
  },
  {
    titulo: "Perfil",
    rota: "/perfil",
    descricao: "Veja seu progresso",
    icone: "person",
    cor: "#247c9e",
    fundo: "#eff8fb",
    borda: "#80adbd",
  },
];

export default function HomeScreen() {
  const router = useRouter();
  const { nome } = useLocalSearchParams();
  const nomeRecebido = Array.isArray(nome) ? nome[0] : nome;
  const inicial = nomeRecebido?.trim().charAt(0).toUpperCase() || "L";
  const { width, height, fontScale } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const [menuAberto, setMenuAberto] = useState(false);
  const [alturaVisivel, setAlturaVisivel] = useState(0);
  const [alturaConteudo, setAlturaConteudo] = useState(0);
  const [proximoPrograma, setProximoPrograma] = useState(null);

  useFocusEffect(
    useCallback(() => {
      setProximoPrograma(obterProximoPrograma());
    }, []),
  );

  const exibirBarraInferior = Platform.OS === "web";
  const podeRolar = alturaVisivel > 0 && alturaConteudo > alturaVisivel;

  const larguraUtil = width - insets.left - insets.right;
  const alturaUtil = height - insets.top - insets.bottom;
  const telaEstreita = larguraUtil < 360;
  const telaCompacta = telaEstreita || alturaUtil < 680;
  const margem = telaEstreita ? 12 : 16;
  const larguraConteudo = Math.max(0, Math.min(larguraUtil - margem * 2, 480));
  const colunas = larguraConteudo < 260 || fontScale > 1.3 ? 1 : 2;
  const espaco = telaCompacta ? 8 : 10;
  const larguraCard = (larguraConteudo - espaco * (colunas - 1)) / colunas;
  const tamanhoTitulo = telaCompacta ? 26 : 30;

  function opcaoIndisponivel() {
    if (Platform.OS === "web") {
      window.alert("Esta opção está indisponível.");
    } else {
      Alert.alert("Opção indisponível", "Esta opção está indisponível.");
    }
  }

  function continuarJogo() {
    setMenuAberto(false);

    const params = nomeRecebido ? { nome: nomeRecebido } : {};
    const programa = obterProximoPrograma();

    if (programa) {
      router.push({
        pathname: "/jogocap",
        params: { ...params, programa: programa.codigo },
      });
    } else {
      router.push({ pathname: "/book", params });
    }
  }

  function selecionarOpcao(opcao) {
    setMenuAberto(false);

    if (opcao.rota) {
      const recebeNome =
        opcao.rota === "/estatistica" || opcao.rota === "/perfil";

      if (recebeNome && nomeRecebido) {
        router.push({ pathname: opcao.rota, params: { nome: nomeRecebido } });
      } else {
        router.push(opcao.rota);
      }
      return;
    }

    opcaoIndisponivel();
  }

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
            styles.areaRolagem,
            {
              paddingTop: insets.top + (telaCompacta ? 8 : 16),
              paddingBottom:
                (exibirBarraInferior ? 0 : insets.bottom) +
                (telaCompacta ? 8 : 12),
              paddingLeft: margem + insets.left,
              paddingRight: margem + insets.right,
            },
          ]}
          onLayout={({ nativeEvent }) => {
            setAlturaVisivel(nativeEvent.layout.height);
          }}
          onContentSizeChange={(_, altura) => setAlturaConteudo(altura)}
          scrollEnabled={podeRolar}
          bounces={false}
          overScrollMode="never"
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={[styles.conteudo, { width: larguraConteudo }]}>
            <View style={styles.cabecalho}>
              <View style={styles.marca}>
                <View style={styles.simbolo}>
                  <View style={[styles.quadrado, styles.vermelho]} />
                  <View style={[styles.quadrado, styles.amarelo]} />
                  <View style={[styles.quadrado, styles.verde]} />
                  <View style={[styles.quadrado, styles.azul]} />
                </View>
                <Text style={styles.nomeMarca}>Tectoy</Text>
              </View>

              <View style={styles.acoes}>
                <TouchableOpacity
                  style={styles.perfil}
                  onPress={() => selecionarOpcao({ rota: "/perfil" })}
                  accessibilityLabel="Abrir perfil"
                  accessibilityRole="button"
                >
                  <Text style={styles.nomePerfil}>{inicial}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.botaoIcone}
                  onPress={() => setMenuAberto((aberto) => !aberto)}
                  accessibilityLabel={menuAberto ? "Fechar menu" : "Abrir menu"}
                  accessibilityRole="button"
                  accessibilityState={{ expanded: menuAberto }}
                >
                  <Ionicons
                    name={menuAberto ? "close" : "menu"}
                    size={28}
                    color="#151515"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {menuAberto && (
              <View style={styles.menu}>
                {opcoes.map((opcao) => (
                  <TouchableOpacity
                    key={opcao.titulo}
                    style={styles.botaoMenu}
                    onPress={() => selecionarOpcao(opcao)}
                    accessibilityRole="button"
                  >
                    <Ionicons name={opcao.icone} size={20} color={opcao.cor} />
                    <Text style={styles.itemMenu}>{opcao.titulo}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            <View
              style={[
                styles.apresentacao,
                { marginTop: telaCompacta ? 12 : 20 },
              ]}
            >
              <Text style={styles.saudacao}>Boa tarde</Text>

              <Text
                style={[
                  styles.titulo,
                  {
                    fontSize: tamanhoTitulo,
                    lineHeight: tamanhoTitulo * 1.2,
                  },
                ]}
              >
                Pronto para{"\n"}
                <Text style={styles.tituloVermelho}>pensar bem</Text>
                {" hoje?"}
              </Text>

              <View style={styles.sequencia}>
                <View style={styles.circuloFogo}>
                  <Ionicons name="flame" size={14} color="#fff" />
                </View>
                <Text style={styles.dias}>6 dias</Text>
                <Text style={styles.seguidos}>seguidos</Text>
              </View>
            </View>

            <TouchableOpacity
              style={[
                styles.continuar,
                telaCompacta && styles.continuarCompacto,
              ]}
              onPress={continuarJogo}
              activeOpacity={0.8}
              accessibilityRole="button"
            >
              <View style={styles.iconePlay}>
                <Ionicons name="play" size={22} color="#fff" />
              </View>

              <View style={styles.textosContinuar}>
                <View style={styles.etiqueta}>
                  <Text style={styles.txtContinuar}>
                    {proximoPrograma ? "Continuar" : "Ver programas"}
                  </Text>
                </View>
                <Text style={styles.capitulo}>
                  {proximoPrograma?.titulo ??
                    "Capítulo 1 - Início Ayrton Senna"}
                </Text>
                {proximoPrograma && (
                  <Text style={styles.questoes}>
                    {proximoPrograma.perguntas.length > 0
                      ? `${proximoPrograma.perguntas.length} questões neste programa`
                      : "Questões sorteadas dos programas anteriores"}
                  </Text>
                )}
              </View>
            </TouchableOpacity>

            <View style={[styles.grade, { gap: espaco }]}>
              {opcoes.map((opcao) => (
                <TouchableOpacity
                  key={opcao.titulo}
                  style={[
                    styles.card,
                    telaCompacta && styles.cardCompacto,
                    {
                      width: larguraCard,
                      backgroundColor: opcao.fundo,
                      borderColor: opcao.borda,
                    },
                  ]}
                  onPress={() => selecionarOpcao(opcao)}
                  activeOpacity={0.8}
                  accessibilityRole="button"
                >
                  <View
                    style={[
                      styles.iconeOpcao,
                      telaCompacta && styles.iconeOpcaoCompacto,
                      { backgroundColor: opcao.cor },
                    ]}
                  >
                    <Ionicons name={opcao.icone} size={22} color="#fff" />
                  </View>

                  <Text style={styles.txtOpcao}>{opcao.titulo}</Text>
                  <Text style={styles.descricao}>{opcao.descricao}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>

        {exibirBarraInferior && (
          <footer className="rodape-home">
            <BarraNavegacao
              ativo="Início"
              params={nomeRecebido ? { nome: nomeRecebido } : undefined}
            />
          </footer>
        )}
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
  },
  scroll: {
    flex: 1,
    minHeight: 0,
  },
  areaRolagem: {
    alignItems: "center",
  },
  conteudo: {
    alignSelf: "center",
  },
  cabecalho: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
  },
  marca: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  simbolo: {
    width: 25,
    height: 29,
    flexShrink: 0,
  },
  quadrado: {
    position: "absolute",
    width: 11,
    height: 11,
  },
  vermelho: {
    top: 0,
    left: 0,
    backgroundColor: "#ff6546",
  },
  amarelo: {
    top: 5,
    right: 0,
    backgroundColor: "#ffdb35",
  },
  verde: {
    top: 12,
    left: 0,
    backgroundColor: "#31d275",
  },
  azul: {
    top: 18,
    right: 0,
    backgroundColor: "#23a7dc",
  },
  nomeMarca: {
    fontSize: 21,
    fontWeight: "800",
    letterSpacing: -0.5,
    color: "#151515",
  },
  acoes: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  perfil: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#5ba9a3",
    justifyContent: "center",
    alignItems: "center",
  },
  nomePerfil: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
  },
  botaoIcone: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  menu: {
    width: "100%",
    maxWidth: 320,
    alignSelf: "flex-end",
    marginTop: 12,
    padding: 10,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.97)",
  },
  botaoMenu: {
    minHeight: 44,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  itemMenu: {
    flexShrink: 1,
    fontSize: 16,
    color: "#222",
  },
  apresentacao: {
    alignItems: "flex-start",
  },
  saudacao: {
    fontSize: 17,
    color: "#555",
    marginBottom: 6,
  },
  titulo: {
    width: "100%",
    fontWeight: "700",
    letterSpacing: -0.7,
    color: "#171717",
  },
  tituloVermelho: {
    color: "#c5463e",
  },
  sequencia: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 6,
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 10,
    marginTop: 8,
    backgroundColor: "#fff",
  },
  circuloFogo: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#e55040",
    justifyContent: "center",
    alignItems: "center",
  },
  dias: {
    fontSize: 13,
    fontWeight: "600",
    color: "#1e1e1e",
  },
  seguidos: {
    fontSize: 12,
    color: "#555",
  },
  continuar: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 12,
    marginTop: 16,
    backgroundColor: "rgba(255,255,255,0.94)",
    borderWidth: 1,
    borderColor: "#dd8e87",
    borderRadius: 12,
  },
  continuarCompacto: {
    marginTop: 12,
    padding: 10,
  },
  iconePlay: {
    width: 44,
    height: 44,
    flexShrink: 0,
    borderRadius: 10,
    backgroundColor: "#e55044",
    justifyContent: "center",
    alignItems: "center",
  },
  textosContinuar: {
    flex: 1,
    minWidth: 0,
    alignItems: "flex-start",
  },
  etiqueta: {
    backgroundColor: "#cce6ff",
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginBottom: 5,
  },
  txtContinuar: {
    fontSize: 12,
    color: "#5483a4",
  },
  capitulo: {
    fontSize: 14,
    fontWeight: "600",
    color: "#222",
  },
  questoes: {
    fontSize: 12,
    color: "#777",
    marginTop: 4,
  },
  grade: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 10,
  },
  card: {
    minHeight: 110,
    padding: 12,
    justifyContent: "center",
    borderWidth: 1,
    borderRadius: 12,
  },
  cardCompacto: {
    minHeight: 92,
    padding: 10,
  },
  iconeOpcao: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 6,
  },
  iconeOpcaoCompacto: {
    width: 34,
    height: 34,
    marginBottom: 4,
  },
  txtOpcao: {
    fontSize: 16,
    fontWeight: "600",
    color: "#202020",
  },
  descricao: {
    fontSize: 12,
    color: "#707070",
    marginTop: 4,
  },
});
