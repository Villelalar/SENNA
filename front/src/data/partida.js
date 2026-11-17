import { requisitar } from "./api";

let programasEmCache = null;

export function carregarProgramas() {
  if (!programasEmCache) {
    programasEmCache = requisitar("/livros").catch((erro) => {
      programasEmCache = null;
      throw erro;
    });
  }

  return programasEmCache;
}

export function carregarPerguntas(codigo) {
  return requisitar(`/livros/${encodeURIComponent(codigo)}/perguntas`);
}

export async function verificarResposta(idPergunta, alternativa) {
  const { acertou } = await requisitar(
    `/perguntas/${encodeURIComponent(idPergunta)}/responder`,
    { metodo: "POST", corpo: { alternativa } },
  );

  return acertou === true;
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

export function registrarResposta(partida, alternativa, acertou) {
  if (partida.resultado || partida.descartadas.includes(alternativa)) {
    return partida;
  }

  const tentativa = partida.descartadas.length + 1;

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