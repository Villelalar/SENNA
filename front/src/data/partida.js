import catalogo from "./programasFormula1.json";

export const programas = catalogo;

export function programaDisponivel(programa) {
  return (
    programa.codigo === "016" ||
    (programa.perguntas.length === 30 &&
      programa.perguntas.every((pergunta) => pergunta.resposta !== null))
  );
}

export function criarPerguntas(programa) {
  if (programa.codigo !== "016") return programa.perguntas;

  return programas
    .filter((item) => item.perguntas.length > 0)
    .flatMap((item) => {
      const candidatas = item.perguntas.filter(
        (pergunta) => pergunta.resposta !== null,
      );

      for (let i = candidatas.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [candidatas[i], candidatas[j]] = [candidatas[j], candidatas[i]];
      }

      return candidatas.slice(0, 6);
    });
}

export function novaPartida() {
  return {
    indice: 0,
    descartadas: [],
    pontos: 0,
    resultado: null,
    totais: [0, 0, 0, 0],
  };
}

export function registrarResposta(partida, alternativa, correta) {
  if (partida.resultado || partida.descartadas.includes(alternativa)) {
    return partida;
  }

  const tentativa = partida.descartadas.length + 1;
  const acertou = alternativa === correta;

  if (!acertou && tentativa < 3) {
    return {
      ...partida,
      descartadas: [...partida.descartadas, alternativa],
    };
  }

  const pontosGanhos = acertou ? 4 - tentativa : 0;
  const totais = [...partida.totais];
  totais[acertou ? tentativa - 1 : 3] += 1;

  return {
    ...partida,
    pontos: partida.pontos + pontosGanhos,
    resultado: { tentativa, acertou, pontosGanhos },
    totais,
  };
}