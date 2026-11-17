import Ionicons from "@expo/vector-icons/Ionicons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";

import BarraNavegacao from "../../components/BarraNavegacao";
import TelaPadrao from "../../components/TelaPadrao";
import { carregarProgramas } from "../../data/partida";

const cores = ["#d62929", "#875700", "#1561b9", "#18864a"];

export default function GameScreen() {
  const router = useRouter();
  const { width, height } = useWindowDimensions();
  const { nome } = useLocalSearchParams();
  const nomeRecebido = Array.isArray(nome) ? nome[0] : nome;
  const params = nomeRecebido ? { nome: nomeRecebido } : undefined;
  const [programas, setProgramas] = useState([]);
  const [erro, setErro] = useState("");
  const total = programas.filter((programa) => programa.disponivel).length;

  const compacta = width <= 360 || height <= 640;
  const tamanhoSelo = Math.min(52, Math.max(44, width * 0.12));

  useEffect(() => {
    let ativo = true;

    carregarProgramas()
      .then((lista) => ativo && setProgramas(lista))
      .catch((falha) => ativo && setErro(falha.message));

    return () => {
      ativo = false;
    };
  }, []);

  function voltar() {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace({ pathname: "/home", params });
    }
  }

  return (
    <TelaPadrao
      titulo="Jogos"
      onVoltar={voltar}
      espaco={compacta ? 8 : 16}
      extraCabecalho={
        <Text
          style={styles.subtitulo}
          accessibilityRole={erro ? "alert" : undefined}
        >
          {erro ||
            `${total} ${
              total === 1 ? "programa disponível" : "programas disponíveis"
            }`}
        </Text>
      }
      rodape={<BarraNavegacao ativo="Jogos" params={params} />}
    >
      {programas.map((programa, indice) => {
        const disponivel = programa.disponivel;

        return (
          <View
            key={programa.codigo}
            style={[styles.card, compacta && styles.cardCompacto]}
          >
            <View
              style={[
                styles.selo,
                {
                  width: tamanhoSelo,
                  height: tamanhoSelo,
                  backgroundColor: cores[indice % cores.length],
                },
              ]}
            >
              <Text style={styles.textoSelo}>{programa.codigo}</Text>
            </View>

            <View style={styles.conteudo}>
              <Text style={styles.titulo}>{programa.titulo}</Text>
              <Text style={styles.descricao}>
                {disponivel
                  ? `${programa.totalPerguntas} perguntas`
                  : "Gabarito incompleto"}
              </Text>

              <Pressable
                disabled={!disponivel}
                accessibilityRole="button"
                accessibilityLabel={`Jogar programa ${programa.codigo}`}
                accessibilityState={{ disabled: !disponivel }}
                onPress={() =>
                  router.push({
                    pathname: "/jogocap",
                    params: { programa: programa.codigo },
                  })
                }
                style={({ pressed }) => [
                  styles.botaoJogar,
                  !disponivel && styles.botaoDesativado,
                  pressed && styles.pressionado,
                ]}
              >
                <Ionicons
                  name="play"
                  size={18}
                  color={disponivel ? "#ffffff" : "#9a97a8"}
                />
                <Text
                  style={[
                    styles.textoJogar,
                    !disponivel && styles.textoDesativado,
                  ]}
                >
                  Jogar
                </Text>
              </Pressable>
            </View>
          </View>
        );
      })}
    </TelaPadrao>
  );
}

const styles = StyleSheet.create({
  subtitulo: {
    marginTop: 10,
    fontSize: 15,
    color: "#55515e",
  },
  card: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    padding: 16,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.06)",
    borderRadius: 22,
    boxShadow: "0px 6px 18px rgba(30, 30, 60, 0.06)",
  },
  cardCompacto: {
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  selo: {
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  textoSelo: {
    fontSize: 15,
    fontWeight: "800",
    letterSpacing: 0.3,
    color: "#ffffff",
  },
  conteudo: {
    flex: 1,
    minWidth: 0,
    alignItems: "flex-start",
  },
  titulo: {
    fontSize: 17,
    fontWeight: "800",
    lineHeight: 21,
    color: "#15141e",
  },
  descricao: {
    marginTop: 4,
    marginBottom: 10,
    fontSize: 14,
    lineHeight: 18,
    color: "#55515e",
  },
  botaoJogar: {
    minHeight: 36,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingVertical: 6,
    paddingLeft: 10,
    paddingRight: 14,
    backgroundColor: "#15141e",
    borderRadius: 12,
  },
  botaoDesativado: {
    backgroundColor: "#e5e2ef",
  },
  pressionado: {
    transform: [{ scale: 0.96 }],
  },
  textoJogar: {
    fontSize: 14,
    fontWeight: "700",
    color: "#ffffff",
  },
  textoDesativado: {
    color: "#9a97a8",
  },
});
