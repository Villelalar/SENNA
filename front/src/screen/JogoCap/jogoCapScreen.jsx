import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import {
  ImageBackground,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import {
  criarPerguntas,
  novaPartida,
  programaDisponivel,
  programas,
  registrarResposta,
} from "../../data/partida";
import AcertoScreen from "../AcertoPag/acertoScreen";
import FimProgramaScreen from "../FimPrograma/fimProgramaScreen";

const letras = ["A", "B", "C", "D"];
const cores = ["#db292b", "#ffd500", "#1963c2", "#2b8031"];

export default function JogoCapScreen() {
  const router = useRouter();
  const { programa = "011" } = useLocalSearchParams();
  const escolhido = programas.find((item) => item.codigo === programa);

  if (!escolhido || !programaDisponivel(escolhido)) {
    return (
      <View style={styles.erro}>
        <Text style={styles.pergunta}>
          {escolhido
            ? "O gabarito deste programa está incompleto."
            : "Programa não encontrado."}
        </Text>
        <Pressable
          style={styles.botaoBranco}
          onPress={() => router.replace("/games")}
        >
          <Text style={styles.negrito}>Ver programas</Text>
        </Pressable>
      </View>
    );
  }

  return <Partida key={escolhido.codigo} programa={escolhido} />;
}

function Partida({ programa }) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [perguntas, setPerguntas] = useState(() => criarPerguntas(programa));
  const [partida, setPartida] = useState(novaPartida);

  function voltar() {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/games");
    }
  }

  function reiniciar() {
    setPerguntas(criarPerguntas(programa));
    setPartida(novaPartida());
  }

  function avancar() {
    setPartida((atual) => {
      if (!atual.resultado || atual.indice !== partida.indice) return atual;

      return {
        ...atual,
        indice: atual.indice + 1,
        descartadas: [],
        resultado: null,
      };
    });
  }

  const total = perguntas.length;
  const numero = partida.indice + 1;

  if (partida.indice === total) {
    return (
      <FimProgramaScreen
        programa={programa.codigo}
        pontos={partida.pontos}
        pontosMaximos={total * 3}
        totais={partida.totais}
        onVoltar={voltar}
        onJogarDeNovo={reiniciar}
      />
    );
  }

  if (partida.resultado) {
    return (
      <AcertoScreen
        programa={programa.codigo}
        numero={numero}
        total={total}
        pontos={partida.pontos}
        resultado={partida.resultado}
        onProxima={avancar}
      />
    );
  }

  const pergunta = perguntas[partida.indice];
  const tentativa = partida.descartadas.length + 1;

  function responder(indice) {
    setPartida((atual) => {
      if (atual.indice !== partida.indice) return atual;
      return registrarResposta(atual, indice, pergunta.resposta);
    });
  }

  return (
    <ImageBackground
      source={require("../../../assets/nuvens.png")}
      style={styles.fundo}
      resizeMode="cover"
    >
      <StatusBar style="dark" />
      <ScrollView
        contentContainerStyle={[
          styles.rolagem,
          {
            paddingTop: insets.top + 12,
            paddingBottom: insets.bottom + 16,
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
              <Text style={styles.seta}>‹</Text>
            </Pressable>

            <View style={styles.titulo}>
              <Text style={styles.pequeno}>Pense Bem: Fórmula 1</Text>
              <Text style={styles.negrito}>{programa.titulo}</Text>
            </View>

            <Text style={styles.placar}>★ {partida.pontos} pts</Text>
          </View>

          <View style={styles.painel}>
            <Text style={styles.marca}>TECTOY</Text>

            <View style={styles.visor}>
              <Text
                style={styles.codigo}
                adjustsFontSizeToFit
                numberOfLines={1}
              >
                {programa.codigo} → {numero}
              </Text>
            </View>

            <Text style={styles.pequeno}>Tentativa {tentativa} de 3</Text>
            <Text accessibilityRole="header" style={styles.pergunta}>
              {pergunta.enunciado}
            </Text>

            {pergunta.numero !== numero && (
              <Text style={styles.pequeno}>
                Questão {pergunta.numero} no livro
              </Text>
            )}

            {tentativa > 1 && (
              <Text style={styles.aviso} accessibilityLiveRegion="polite">
                Resposta incorreta. Tente novamente.
              </Text>
            )}
          </View>

          <View style={styles.grade}>
            {pergunta.alternativas.map((alternativa, indice) => {
              const descartada = partida.descartadas.includes(indice);
              const corTexto = indice === 1 ? "#171719" : "#fff";

              return (
                <Pressable
                  key={letras[indice]}
                  accessibilityRole="button"
                  accessibilityLabel={`${letras[indice]}. ${alternativa}`}
                  accessibilityState={{ disabled: descartada }}
                  disabled={descartada}
                  onPress={() => responder(indice)}
                  style={[
                    styles.alternativa,
                    { backgroundColor: cores[indice] },
                    descartada && styles.descartada,
                  ]}
                >
                  <Text style={[styles.letra, { color: corTexto }]}>
                    {letras[indice]}
                  </Text>
                  <Text style={[styles.textoAlternativa, { color: corTexto }]}>
                    {alternativa}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <View style={styles.progresso}>
            <Text style={styles.pequeno}>
              Pergunta {numero} de {total}
            </Text>
            <View
              style={styles.trilho}
              accessibilityRole="progressbar"
              accessibilityValue={{ min: 0, max: total, now: partida.indice }}
            >
              <View
                style={[
                  styles.barra,
                  { width: `${(partida.indice / total) * 100}%` },
                ]}
              />
            </View>
          </View>

          <Pressable
            style={styles.botaoBranco}
            accessibilityRole="button"
            onPress={reiniciar}
          >
            <Text style={styles.negrito}>Reiniciar jogo</Text>
          </Pressable>
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  fundo: { flex: 1, backgroundColor: "#f5f5fb" },
  erro: { flex: 1, justifyContent: "center", padding: 20, gap: 12 },
  rolagem: { flexGrow: 1, alignItems: "center" },
  conteudo: { width: "100%", maxWidth: 400, gap: 10 },
  cabecalho: { flexDirection: "row", alignItems: "center", gap: 10 },
  voltar: {
    width: 40,
    height: 40,
    backgroundColor: "#fff",
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
  },
  seta: { fontSize: 28, color: "#171721" },
  titulo: { flex: 1 },
  pequeno: { fontSize: 12, color: "#55515e" },
  negrito: { fontWeight: "800", color: "#171721" },
  placar: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 8,
    color: "#191823",
    fontWeight: "700",
  },
  painel: {
    backgroundColor: "#f0eac2",
    borderWidth: 1,
    borderColor: "#d9ce91",
    borderRadius: 22,
    padding: 12,
    gap: 8,
  },
  marca: { color: "#d53c09", fontWeight: "900", letterSpacing: 2 },
  visor: { backgroundColor: "#0d0b12", padding: 14, borderRadius: 12 },
  codigo: {
    color: "#ff352c",
    fontSize: 34,
    fontWeight: "700",
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
  },
  pergunta: { color: "#15141e", fontSize: 17, fontWeight: "700" },
  aviso: { color: "#821f19", fontWeight: "700" },
  grade: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  alternativa: {
    width: "48%",
    flexGrow: 1,
    minHeight: 100,
    padding: 12,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  descartada: { opacity: 0.45 },
  letra: { fontSize: 28, fontWeight: "900" },
  textoAlternativa: { textAlign: "center", fontWeight: "600" },
  progresso: { backgroundColor: "#fff", padding: 12, borderRadius: 16, gap: 6 },
  trilho: {
    height: 8,
    backgroundColor: "#e5e2ef",
    borderRadius: 4,
    overflow: "hidden",
  },
  barra: { height: "100%", backgroundColor: "#29b877", borderRadius: 4 },
  botaoBranco: {
    minHeight: 46,
    backgroundColor: "#fff",
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
  },
});
