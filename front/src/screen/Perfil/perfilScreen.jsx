import Ionicons from "@expo/vector-icons/Ionicons";
import { Fredoka_700Bold, useFonts } from "@expo-google-fonts/fredoka";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import BarraNavegacao from "../../components/BarraNavegacao";
import TelaPadrao from "../../components/TelaPadrao";
import {
  estatisticasIniciais,
  obterEstatisticas,
  zerarProgresso,
} from "../../data/estatisticas";
import { carregarPerfil } from "../../data/perfil";
import { limparSessao } from "../../data/sessao";
import { confirmar } from "../../utils/avisos";

export default function PerfilScreen() {
  const router = useRouter();
  const { nome } = useLocalSearchParams();
  const nomeRecebido = Array.isArray(nome) ? nome[0] : nome;
  const params = nomeRecebido ? { nome: nomeRecebido } : undefined;

  const [fonteCarregada] = useFonts({ Fredoka_700Bold });
  const fredoka = fonteCarregada ? styles.fredoka : null;
  const [estatisticas, setEstatisticas] = useState(estatisticasIniciais);
  const [perfil, setPerfil] = useState(null);
  const [erro, setErro] = useState("");

  useFocusEffect(
    useCallback(() => {
      let ativo = true;

      Promise.all([carregarPerfil(), obterEstatisticas()])
        .then(([dadosPerfil, dadosEstatisticas]) => {
          if (!ativo) return;
          setErro("");
          setPerfil(dadosPerfil);
          setEstatisticas(dadosEstatisticas);
        })
        .catch((falha) => ativo && setErro(falha.message));

      return () => {
        ativo = false;
      };
    }, []),
  );

  const nomeExibido = perfil?.nome ?? (nomeRecebido?.trim() || "Jogador");
  const inicial = nomeExibido.charAt(0).toUpperCase();
  const detalhes = [perfil?.curso, perfil?.instituicao]
    .filter(Boolean)
    .join(" · ");

  const porcentagem =
    estatisticas.totalPerguntasLivro > 0
      ? Math.min(
          Math.round(
            (estatisticas.perguntasRespondidas /
              estatisticas.totalPerguntasLivro) *
              100,
          ),
          100,
        )
      : 0;

  function voltar() {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/home");
    }
  }

  function editarPerfil() {
    router.push({
      pathname: "/editar-perfil",
      params,
    });
  }

  async function zerar() {
    const confirmou = await confirmar(
      "Zerar progresso",
      "Tem certeza que deseja zerar todo o seu progresso?",
      "Zerar",
    );

    if (!confirmou) return;

    try {
      await zerarProgresso();
      setEstatisticas(await obterEstatisticas());
      setErro("");
    } catch (falha) {
      setErro(falha.message);
    }
  }

  function sair() {
    limparSessao();
    router.replace("/login");
  }

  const opcoes = [
    { rotulo: "Editar perfil", acao: editarPerfil },
    { rotulo: "Zerar progresso", acao: zerar },
    { rotulo: "Sair", acao: sair },
  ];

  return (
    <TelaPadrao
      titulo="Perfil"
      onVoltar={voltar}
      fonteTitulo={fredoka}
      rodape={<BarraNavegacao ativo="Perfil" params={params} />}
    >
      {erro ? (
        <Text style={styles.erro} accessibilityRole="alert">
          {erro}
        </Text>
      ) : null}

      <View style={styles.identidade}>
        <View style={styles.avatar} accessibilityElementsHidden>
          <Text style={[styles.textoAvatar, fredoka]}>{inicial}</Text>
        </View>
        <Text style={styles.nome}>{nomeExibido}</Text>
        {detalhes ? <Text style={styles.detalhes}>{detalhes}</Text> : null}
      </View>

      <View style={styles.resumo}>
        <View style={[styles.cardResumo, styles.resumoSequencia]}>
          <Text style={[styles.numeroResumo, fredoka]}>
            {estatisticas.diasSeguidos}
          </Text>
          <Text style={styles.rotuloResumo}>dias seguidos</Text>
        </View>
        <View style={[styles.cardResumo, styles.resumoPontos]}>
          <Text style={[styles.numeroResumo, fredoka]}>
            {estatisticas.pontosTotais}
          </Text>
          <Text style={styles.rotuloResumo}>pontos</Text>
        </View>
      </View>

      <View style={styles.cardProgresso}>
        <Text style={styles.tituloProgresso}>Progresso do livro</Text>
        <Text style={styles.textoProgresso}>
          Início Ayrton Senna · {estatisticas.perguntasRespondidas} de{" "}
          {estatisticas.totalPerguntasLivro} perguntas
        </Text>
        <View
          style={styles.barra}
          accessibilityRole="progressbar"
          accessibilityLabel="Progresso do livro"
          accessibilityValue={{ min: 0, max: 100, now: porcentagem }}
        >
          <View
            style={[styles.barraPreenchida, { width: `${porcentagem}%` }]}
          />
        </View>
      </View>

      {opcoes.map((opcao) => (
        <Pressable
          key={opcao.rotulo}
          onPress={opcao.acao}
          accessibilityRole="button"
          style={({ pressed, hovered }) => [
            styles.opcao,
            hovered && styles.opcaoHover,
            pressed && styles.pressionado,
          ]}
        >
          <Text style={styles.textoOpcao}>{opcao.rotulo}</Text>
          <Ionicons name="chevron-forward" size={24} color="#9a97a8" />
        </Pressable>
      ))}
    </TelaPadrao>
  );
}

const styles = StyleSheet.create({
  fredoka: {
    fontFamily: "Fredoka_700Bold",
    fontWeight: "normal",
  },
  erro: {
    color: "#a22125",
  },
  identidade: {
    alignItems: "center",
    gap: 6,
    paddingBottom: 8,
  },
  avatar: {
    width: 112,
    height: 112,
    marginBottom: 6,
    borderRadius: 56,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2a8f85",
  },
  textoAvatar: {
    fontSize: 64,
    fontWeight: "800",
    lineHeight: 72,
    color: "#ffffff",
  },
  nome: {
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
    color: "#15141e",
  },
  detalhes: {
    fontSize: 15,
    textAlign: "center",
    color: "#55515e",
  },
  resumo: {
    flexDirection: "row",
    gap: 12,
  },
  cardResumo: {
    flex: 1,
    alignItems: "center",
    gap: 2,
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderRadius: 20,
  },
  resumoSequencia: {
    backgroundColor: "#fff5d9",
    borderColor: "#f2d581",
  },
  resumoPontos: {
    backgroundColor: "#e7f7ec",
    borderColor: "#a6dfb8",
  },
  numeroResumo: {
    fontSize: 40,
    fontWeight: "900",
    lineHeight: 44,
    color: "#15141e",
  },
  rotuloResumo: {
    fontSize: 17,
    color: "#3b3a47",
  },
  cardProgresso: {
    padding: 16,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.06)",
    borderRadius: 22,
    boxShadow: "0px 6px 18px rgba(30, 30, 60, 0.06)",
  },
  tituloProgresso: {
    fontSize: 18,
    fontWeight: "800",
    color: "#15141e",
  },
  textoProgresso: {
    marginTop: 10,
    fontSize: 15,
    color: "#55515e",
  },
  barra: {
    height: 8,
    marginTop: 14,
    borderRadius: 4,
    backgroundColor: "#e5e2ef",
    overflow: "hidden",
  },
  barraPreenchida: {
    height: "100%",
    borderRadius: 4,
    backgroundColor: "#29b877",
  },
  opcao: {
    minHeight: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 18,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.06)",
    borderRadius: 22,
    boxShadow: "0px 6px 18px rgba(30, 30, 60, 0.06)",
  },
  opcaoHover: {
    boxShadow: "0px 8px 22px rgba(30, 30, 60, 0.1)",
  },
  pressionado: {
    transform: [{ scale: 0.98 }],
  },
  textoOpcao: {
    fontSize: 18,
    fontWeight: "800",
    color: "#15141e",
  },
});
