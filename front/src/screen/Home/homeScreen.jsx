import "../../../CSS/Screen/homeScreen.css";

import Ionicons from "@expo/vector-icons/Ionicons";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useCallback, useState } from "react";
import {
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
import { obterEstatisticas } from "../../data/estatisticas.js";
import { carregarProgramas } from "../../data/partida";
import { lerSessao } from "../../data/sessao";
import { avisar } from "../../utils/avisos";

const ehWeb = Platform.OS === "web";
const Fundo = ehWeb ? View : ImageBackground;
const propsFundo = ehWeb
  ? {}
  : { source: require("../../../assets/nuvens.png"), resizeMode: "cover" };

const opcoes = [
  {
    titulo: "Jogos",
    descricao: "Programas do livro",
    rota: "/games",
    icone: "game-controller",
    cor: "#e64e42",
    fundo: "#fde3df",
    borda: "#ee8f86",
    gradiente:
      "linear-gradient(135deg, #f9a89d 0%, #fcd3cd 45%, #fff5f3 100%)",
  },
  {
    titulo: "Livros",
    descricao: "Cap. 1 - Senna",
    rota: "/book",
    icone: "book",
    cor: "#e4c300",
    fundo: "#fff7d1",
    borda: "#e9d46a",
    gradiente:
      "linear-gradient(135deg, #fffdf3 0%, #fff6c9 55%, #ffec98 100%)",
  },
  {
    titulo: "Estatística",
    rota: "/estatistica",
    descricao: "Veja seus pontos",
    icone: "trending-up",
    cor: "#20bf59",
    fundo: "#e1f7e8",
    borda: "#7fd29f",
    gradiente:
      "linear-gradient(135deg, #b6eec6 0%, #dbf7e4 50%, #f4fdf7 100%)",
  },
  {
    titulo: "Perfil",
    rota: "/perfil",
    descricao: "Ver seu progresso",
    icone: "person",
    cor: "#247c9e",
    fundo: "#e3edf2",
    borda: "#7fa6b8",
    gradiente:
      "linear-gradient(135deg, #9dbbca 0%, #d2e1e9 50%, #f8fbfc 100%)",
  },
];

function saudacaoDoHorario() {
  const hora = new Date().getHours();
  if (hora < 12) return "Bom dia";
  if (hora < 18) return "Boa tarde";
  return "Boa noite";
}

export default function HomeScreen() {
  const router = useRouter();
  const { nome } = useLocalSearchParams();
  const [nomeSessao, setNomeSessao] = useState(null);
  const nomeRecebido =
    nomeSessao ?? (Array.isArray(nome) ? nome[0] : nome);
  const inicial = nomeRecebido?.trim().charAt(0).toUpperCase() || "L";
  const { width, height, fontScale } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const [menuAberto, setMenuAberto] = useState(false);
  const [alturaVisivel, setAlturaVisivel] = useState(0);
  const [alturaConteudo, setAlturaConteudo] = useState(0);
  const [proximoPrograma, setProximoPrograma] = useState(null);
  const [diasSeguidos, setDiasSeguidos] = useState(0);
  const [programasDisponiveis, setProgramasDisponiveis] = useState(null);
  const [saudacao, setSaudacao] = useState(saudacaoDoHorario);

  useFocusEffect(
    useCallback(() => {
      let ativo = true;
      setNomeSessao(lerSessao()?.nome ?? null);
      setSaudacao(saudacaoDoHorario());

      carregarProgramas()
        .then((lista) => {
          if (!ativo) return;
          setProgramasDisponiveis(
            lista.filter((programa) => programa.disponivel).length,
          );
        })
        .catch(() => {});

      obterEstatisticas()
        .then((estatisticas) => {
          if (!ativo) return;
          setProximoPrograma(estatisticas.proximoPrograma);
          setDiasSeguidos(estatisticas.diasSeguidos);
        })
        .catch(() => {});

      return () => {
        ativo = false;
      };
    }, []),
  );

  const podeRolar = alturaVisivel > 0 && alturaConteudo > alturaVisivel;

  const larguraUtil = width - insets.left - insets.right;
  const alturaUtil = height - insets.top - insets.bottom;
  const telaEstreita = larguraUtil < 360;
  const telaCompacta = telaEstreita || alturaUtil < 680;
  const margem = telaEstreita ? 12 : 16;
  const larguraConteudo = Math.max(0, Math.min(larguraUtil - margem * 2, 480));
  const colunas = larguraConteudo < 260 || fontScale > 1.3 ? 1 : 2;
  const espaco = telaCompacta ? 10 : 14;
  const larguraCard = (larguraConteudo - espaco * (colunas - 1)) / colunas;
  const tamanhoTitulo = telaCompacta ? 26 : 30;

  function opcaoIndisponivel() {
    avisar("Opção indisponível", "Esta opção está indisponível.");
  }

  function continuarJogo() {
    setMenuAberto(false);

    const params = nomeRecebido ? { nome: nomeRecebido } : {};

    if (proximoPrograma) {
      router.push({
        pathname: "/jogocap",
        params: { ...params, programa: proximoPrograma.codigo },
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

      <Fundo style={styles.fundo} {...propsFundo}>
        {ehWeb && <div className="home-camada home-fundo" aria-hidden="true" />}

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={[
            styles.areaRolagem,
            {
              paddingTop: insets.top + (telaCompacta ? 8 : 16),
              paddingBottom: telaCompacta ? 8 : 12,
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
              <Text style={styles.saudacao}>{saudacao}</Text>

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
                <Text style={styles.dias}>
                  {diasSeguidos} {diasSeguidos === 1 ? "dia" : "dias"}
                </Text>
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
                    {proximoPrograma.revisao
                      ? "Questões sorteadas dos programas anteriores"
                      : `${proximoPrograma.totalPerguntas} questões neste programa`}
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
                  {ehWeb && (
                    <div
                      className="home-camada"
                      aria-hidden="true"
                      style={{ background: opcao.gradiente }}
                    />
                  )}

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
                  <Text style={styles.descricao}>
                    {opcao.rota === "/games" && programasDisponiveis !== null
                      ? `${programasDisponiveis} ${
                          programasDisponiveis === 1
                            ? "disponível"
                            : "disponíveis"
                        }`
                      : opcao.descricao}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>

        <BarraNavegacao
          ativo="Início"
          params={nomeRecebido ? { nome: nomeRecebido } : undefined}
        />
      </Fundo>
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
    position: "absolute",
    top: 56,
    right: 0,
    zIndex: 20,
    elevation: 8,
    width: "100%",
    maxWidth: 320,
    padding: 10,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.97)",
    boxShadow: "0px 8px 24px rgba(30, 30, 60, 0.12)",
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
    paddingLeft: 6,
    paddingRight: 16,
    marginTop: 12,
    backgroundColor: "#fff",
    boxShadow: "0px 4px 14px rgba(30, 30, 60, 0.08)",
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
    fontSize: 15,
    fontWeight: "500",
    color: "#1e1e1e",
  },
  seguidos: {
    fontSize: 11,
    color: "#555",
  },
  continuar: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 12,
    marginTop: 20,
    backgroundColor: "rgba(255,255,255,0.94)",
    borderWidth: 1,
    borderColor: "#ee8f86",
    borderRadius: 12,
    boxShadow: "0px 6px 18px rgba(30, 30, 60, 0.06)",
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
    marginTop: 14,
  },
  card: {
    minHeight: 110,
    padding: 14,
    justifyContent: "center",
    borderWidth: 1,
    borderRadius: 12,
    boxShadow: "0px 6px 18px rgba(30, 30, 60, 0.06)",
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
    position: "relative",
    fontSize: 19,
    fontWeight: "500",
    color: "#1d1d1d",
  },
  descricao: {
    position: "relative",
    fontSize: 12,
    color: "#4f4f4f",
    marginTop: 2,
  },
});
