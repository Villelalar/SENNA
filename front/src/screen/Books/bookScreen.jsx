import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import BarraNavegacao from "../../components/BarraNavegacao";
import CardLivroEscolhido from "../../components/CardLivroEscolhido";
import CardPrograma from "../../components/CardPrograma";
import TelaPadrao from "../../components/TelaPadrao";
import { obterEstatisticas } from "../../data/estatisticas";
import { carregarProgramas } from "../../data/partida";
import { avisar } from "../../utils/avisos";

const cores = ["#d62929", "#875700", "#1561b9", "#18864a"];

export default function BookScreen() {
  const router = useRouter();
  const { nome } = useLocalSearchParams();
  const nomeRecebido = Array.isArray(nome) ? nome[0] : nome;
  const params = nomeRecebido ? { nome: nomeRecebido } : undefined;
  const [programasDoLivro, setProgramasDoLivro] = useState([]);
  const [concluidos, setConcluidos] = useState([]);
  const [erro, setErro] = useState("");

  useFocusEffect(
    useCallback(() => {
      let ativo = true;

      carregarProgramas()
        .then((lista) => {
          if (!ativo) return;
          setErro("");
          setProgramasDoLivro(
            lista.map((programa) => ({
              id: programa.codigo,
              totalPerguntas: programa.totalPerguntas,
              disponivel: programa.disponivel,
            })),
          );
        })
        .catch((falha) => ativo && setErro(falha.message));

      obterEstatisticas()
        .then(
          (estatisticas) =>
            ativo && setConcluidos(estatisticas.programasConcluidos),
        )
        .catch(() => {});

      return () => {
        ativo = false;
      };
    }, []),
  );

  const perguntasRespondidas = programasDoLivro.reduce(
    (total, programa) =>
      total + (concluidos.includes(programa.id) ? programa.totalPerguntas : 0),
    0,
  );

  function voltar() {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace({ pathname: "/home", params });
    }
  }

  function abrirPrograma(programa) {
    if (!programa.disponivel) {
      avisar(
        "Programa indisponível",
        "O gabarito deste programa está incompleto.",
      );
      return;
    }

    router.push({
      pathname: "/jogocap",
      params: { programa: programa.id },
    });
  }

  return (
    <TelaPadrao
      titulo="Livros"
      onVoltar={voltar}
      espaco={16}
      extraCabecalho={
        <View style={styles.livro}>
          <CardLivroEscolhido
            titulo="Pense Bem: Fórmula 1"
            programas={programasDoLivro}
            perguntasRespondidas={perguntasRespondidas}
          />
        </View>
      }
      rodape={<BarraNavegacao ativo="Livros" params={params} />}
    >
      <Text style={styles.tituloLista} accessibilityRole="header">
        Programas do livro
      </Text>

      {erro ? (
        <Text style={styles.erro} accessibilityRole="alert">
          {erro}
        </Text>
      ) : null}

      {programasDoLivro.map((programa, indice) => (
        <View key={programa.id} style={styles.item}>
          <CardPrograma
            id={programa.id}
            respondidas={
              concluidos.includes(programa.id) ? programa.totalPerguntas : 0
            }
            totalPerguntas={programa.totalPerguntas}
            cor={cores[indice % cores.length]}
            onSelecionar={() => abrirPrograma(programa)}
          />
          {!programa.disponivel && (
            <Text style={styles.aviso}>Gabarito incompleto</Text>
          )}
        </View>
      ))}
    </TelaPadrao>
  );
}

const styles = StyleSheet.create({
  livro: {
    marginTop: 20,
  },
  tituloLista: {
    fontSize: 18,
    fontWeight: "800",
    color: "#1a1a1a",
  },
  erro: {
    color: "#a22125",
  },
  item: {
    gap: 4,
  },
  aviso: {
    marginLeft: 8,
    fontSize: 12,
    color: "#55515e",
  },
});
