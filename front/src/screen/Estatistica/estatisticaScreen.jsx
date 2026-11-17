import { Fredoka_700Bold, useFonts } from "@expo-google-fonts/fredoka";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { StyleSheet, Text, useWindowDimensions, View } from "react-native";

import BarraNavegacao from "../../components/BarraNavegacao";
import TelaPadrao from "../../components/TelaPadrao";
import {
  estatisticasIniciais,
  obterEstatisticas,
  PONTOS_MAXIMOS_PROGRAMA,
} from "../../data/estatisticas";

const cores = ["#d62929", "#875700", "#1561b9", "#18864a"];

export default function EstatisticaScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { nome } = useLocalSearchParams();
  const nomeRecebido = Array.isArray(nome) ? nome[0] : nome;
  const [fonteCarregada] = useFonts({ Fredoka_700Bold });
  const fredoka = fonteCarregada ? styles.fredoka : null;
  const [estatisticas, setEstatisticas] = useState(estatisticasIniciais);
  const [erro, setErro] = useState("");

  const tamanhoPontos = Math.min(72, Math.max(56, width * 0.16));

  useFocusEffect(
    useCallback(() => {
      let ativo = true;

      obterEstatisticas()
        .then((dados) => {
          if (!ativo) return;
          setErro("");
          setEstatisticas(dados);
        })
        .catch((falha) => ativo && setErro(falha.message));

      return () => {
        ativo = false;
      };
    }, []),
  );

  const tentativas = [
    { rotulo: "1ª tentativa", valor: estatisticas.totais[0] },
    { rotulo: "2ª tentativa", valor: estatisticas.totais[1] },
    { rotulo: "3ª tentativa", valor: estatisticas.totais[2] },
    { rotulo: "Sem acerto", valor: estatisticas.semAcerto },
  ];
  const linhasTentativas = [tentativas.slice(0, 2), tentativas.slice(2, 4)];

  function voltar() {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/home");
    }
  }

  return (
    <TelaPadrao
      titulo="Estatística"
      onVoltar={voltar}
      fonteTitulo={fredoka}
      rodape={
        <BarraNavegacao
          ativo="Início"
          params={nomeRecebido ? { nome: nomeRecebido } : undefined}
        />
      }
    >
      {erro ? (
        <Text style={styles.erro} accessibilityRole="alert">
          {erro}
        </Text>
      ) : null}

      <View style={styles.cardPontos} accessibilityLabel="Pontos totais">
        <Text style={styles.rotuloPontos}>Pontos totais</Text>
        <Text
          style={[
            styles.numeroPontos,
            { fontSize: tamanhoPontos, lineHeight: tamanhoPontos * 1.05 },
            fredoka,
          ]}
        >
          {estatisticas.pontosTotais}
        </Text>
      </View>

      <View style={styles.grade} accessibilityLabel="Acertos por tentativa">
        {linhasTentativas.map((linha, indiceLinha) => (
          <View key={indiceLinha} style={styles.linha}>
            {linha.map((item) => (
              <View key={item.rotulo} style={styles.cardTentativa}>
                <Text style={[styles.numeroTentativa, fredoka]}>
                  {item.valor}
                </Text>
                <Text style={styles.rotuloTentativa}>{item.rotulo}</Text>
              </View>
            ))}
          </View>
        ))}
      </View>

      <View style={styles.cardGrafico} accessibilityLabel="Pontos por programa">
        <Text style={styles.tituloGrafico} accessibilityRole="header">
          Pontos por programa
        </Text>

        <View style={styles.grafico}>
          {estatisticas.pontosPorPrograma.map((item, indice) => {
            const altura = Math.min(
              (item.pontos / (item.maximo || PONTOS_MAXIMOS_PROGRAMA)) * 100,
              100,
            );
            const temPontos = item.pontos > 0;

            return (
              <View
                key={item.codigo}
                style={styles.coluna}
                accessibilityLabel={`Programa ${item.codigo}: ${item.pontos} pontos`}
              >
                <View style={styles.areaGrafico}>
                  <View
                    style={
                      temPontos
                        ? [
                            styles.barraGrafico,
                            {
                              height: `${altura}%`,
                              backgroundColor: cores[indice % cores.length],
                            },
                          ]
                        : styles.barraVazia
                    }
                  />
                </View>
                <Text style={styles.rotuloColuna}>{item.codigo}</Text>
              </View>
            );
          })}
        </View>
      </View>

      <View style={styles.cardSequencia} accessibilityLabel="Sequência de dias">
        <View style={styles.seloSequencia}>
          <Text style={[styles.numeroSequencia, fredoka]}>
            {estatisticas.diasSeguidos}
          </Text>
        </View>
        <Text style={styles.textoSequencia}>dias seguidos</Text>
      </View>
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
  cardPontos: {
    alignItems: "center",
    gap: 4,
    paddingVertical: 24,
    paddingHorizontal: 16,
    backgroundColor: "#e7f7ec",
    borderWidth: 1,
    borderColor: "#a6dfb8",
    borderRadius: 22,
  },
  rotuloPontos: {
    fontSize: 15,
    color: "#55515e",
  },
  numeroPontos: {
    fontWeight: "900",
    color: "#15141e",
  },
  grade: {
    gap: 12,
  },
  linha: {
    flexDirection: "row",
    gap: 12,
  },
  cardTentativa: {
    flex: 1,
    gap: 2,
    padding: 16,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.06)",
    borderRadius: 20,
    boxShadow: "0px 6px 18px rgba(30, 30, 60, 0.06)",
  },
  numeroTentativa: {
    fontSize: 32,
    fontWeight: "900",
    lineHeight: 36,
    color: "#15141e",
  },
  rotuloTentativa: {
    fontSize: 15,
    color: "#55515e",
  },
  cardGrafico: {
    paddingTop: 18,
    paddingHorizontal: 16,
    paddingBottom: 14,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.06)",
    borderRadius: 22,
    boxShadow: "0px 6px 18px rgba(30, 30, 60, 0.06)",
  },
  tituloGrafico: {
    marginBottom: 12,
    fontSize: 18,
    fontWeight: "800",
    color: "#15141e",
  },
  grafico: {
    flexDirection: "row",
    gap: 10,
  },
  coluna: {
    flex: 1,
    minWidth: 0,
    alignItems: "center",
    gap: 10,
  },
  areaGrafico: {
    width: "100%",
    height: 160,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  barraGrafico: {
    width: "100%",
    minHeight: 8,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  barraVazia: {
    width: "100%",
    height: 8,
    backgroundColor: "#d4cfe5",
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
  },
  rotuloColuna: {
    fontSize: 14,
    color: "#55515e",
  },
  cardSequencia: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: "#fff5d9",
    borderWidth: 1,
    borderColor: "#f2d581",
    borderRadius: 20,
  },
  seloSequencia: {
    width: 52,
    height: 52,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#d62929",
    borderRadius: 14,
  },
  numeroSequencia: {
    fontSize: 20,
    fontWeight: "800",
    color: "#ffffff",
  },
  textoSequencia: {
    fontSize: 18,
    fontWeight: "800",
    color: "#15141e",
  },
});
