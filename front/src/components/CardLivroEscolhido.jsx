import { Image, StyleSheet, Text, View } from "react-native";

function formatarQuantidade(quantidade, singular, plural) {
  return `${quantidade} ${quantidade === 1 ? singular : plural}`;
}

export default function CardLivroEscolhido({
  titulo,
  programas = [],
  perguntasRespondidas = 0,
  capa,
}) {
  const totalProgramas = programas.length;
  const totalPerguntas = programas.reduce(
    (soma, programa) => soma + programa.totalPerguntas,
    0,
  );

  const progresso =
    totalPerguntas > 0 ? Math.min(perguntasRespondidas / totalPerguntas, 1) : 0;
  const porcentagem = Math.round(progresso * 100);

  return (
    <View style={styles.card}>
      {capa ? (
        <Image
          source={typeof capa === "string" ? { uri: capa } : capa}
          accessibilityLabel={`Capa do livro ${titulo}`}
          style={styles.capa}
          resizeMode="cover"
        />
      ) : (
        <View style={[styles.capa, styles.capaPadrao]}>
          <Text style={styles.textoCapa}>{"PENSE\nBEM\nSENNA"}</Text>
        </View>
      )}

      <View style={styles.textos}>
        <Text style={styles.etiqueta}>Livro escolhido</Text>
        <Text style={styles.titulo} accessibilityRole="header">
          {titulo}
        </Text>

        <Text style={styles.resumo}>
          {formatarQuantidade(totalProgramas, "programa", "programas")} ·{" "}
          {formatarQuantidade(totalPerguntas, "pergunta", "perguntas")}
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
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: 14,
    backgroundColor: "rgba(255, 248, 225, 0.95)",
    borderWidth: 1,
    borderColor: "#f1dc9a",
    borderRadius: 20,
  },
  capa: {
    width: 64,
    height: 88,
    borderRadius: 6,
  },
  capaPadrao: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffd93d",
    borderWidth: 2,
    borderColor: "#1a1a1a",
  },
  textoCapa: {
    fontSize: 11,
    fontWeight: "900",
    lineHeight: 13,
    textAlign: "center",
    color: "#1a1a1a",
  },
  textos: {
    flex: 1,
    minWidth: 0,
  },
  etiqueta: {
    fontSize: 12,
    color: "#6b6757",
  },
  titulo: {
    marginTop: 2,
    fontSize: 17,
    fontWeight: "800",
    color: "#15141e",
  },
  resumo: {
    marginTop: 4,
    fontSize: 12,
    color: "#55515e",
  },
  barra: {
    height: 8,
    marginTop: 10,
    borderRadius: 4,
    backgroundColor: "#e5e2ef",
    overflow: "hidden",
  },
  barraPreenchida: {
    height: "100%",
    borderRadius: 4,
    backgroundColor: "#29b877",
  },
});
