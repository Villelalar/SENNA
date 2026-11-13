import { programaDisponivel, programas } from "./partida";

export const PONTOS_MAXIMOS_PROGRAMA = 90;
export const PERGUNTAS_POR_PROGRAMA = 30;

export const perfilPadrao = {
  curso: "Sistemas de Informação",
  instituicao: "UniLaSalle",
};

const chaveHistorico = "senna:partidas-concluidas:v1";
const milissegundosPorDia = 86_400_000;

const programasDoLivro = programas.filter(
  (programa) => programa.perguntas.length > 0,
);

let historicoEmMemoria = [];
let gravacaoBloqueada = false;

function lerHistorico() {
  if (typeof window === "undefined" || gravacaoBloqueada) {
    return historicoEmMemoria;
  }

  try {
    const salvo = JSON.parse(window.localStorage.getItem(chaveHistorico));
    return Array.isArray(salvo) ? salvo : historicoEmMemoria;
  } catch {
    return historicoEmMemoria;
  }
}

function gravarHistorico(historico) {
  historicoEmMemoria = historico;

  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(chaveHistorico, JSON.stringify(historico));
    gravacaoBloqueada = false;
  } catch {
    gravacaoBloqueada = true;
  }
}

function diaLocal(data) {
  return (
    Date.UTC(data.getFullYear(), data.getMonth(), data.getDate()) /
    milissegundosPorDia
  );
}

export function salvarResultadoPartida({ codigo, pontos, totais }) {
  gravarHistorico([
    ...lerHistorico(),
    {
      codigo,
      pontos,
      totais: [...totais],
      dia: diaLocal(new Date()),
    },
  ]);
}

function resumirHistorico(historico) {
  const totais = [0, 0, 0, 0];
  const melhoresPontos = new Map();
  const diasJogados = new Set();

  for (const resultado of historico) {
    totais[0] += resultado.totais[0];
    totais[1] += resultado.totais[1];
    totais[2] += resultado.totais[2];
    totais[3] += resultado.totais[3];

    melhoresPontos.set(
      resultado.codigo,
      Math.max(melhoresPontos.get(resultado.codigo) ?? 0, resultado.pontos),
    );

    diasJogados.add(resultado.dia);
  }

  let dia = diaLocal(new Date());

  if (!diasJogados.has(dia)) {
    dia -= 1;
  }

  let diasSeguidos = 0;

  while (diasJogados.has(dia)) {
    diasSeguidos += 1;
    dia -= 1;
  }

  const [primeira, segunda, terceira, semAcerto] = totais;
  const pontosTotais = primeira * 3 + segunda * 2 + terceira;

  const perguntasRespondidas = programasDoLivro.reduce(
    (total, programa) =>
      total +
      (melhoresPontos.has(programa.codigo) ? programa.perguntas.length : 0),
    0,
  );

  const totalPerguntasLivro = programasDoLivro.reduce(
    (total, programa) => total + programa.perguntas.length,
    0,
  );

  return {
    pontosTotais,
    totais,
    semAcerto,
    diasSeguidos,
    perguntasRespondidas,
    totalPerguntasLivro,
    pontosPorPrograma: programasDoLivro.map(({ codigo }) => ({
      codigo,
      pontos: melhoresPontos.get(codigo) ?? 0,
    })),
  };
}

export const estatisticasIniciais = resumirHistorico([]);

export function obterEstatisticas() {
  return resumirHistorico(lerHistorico());
}

export function zerarProgresso() {
  gravarHistorico([]);
}

export function obterProximoPrograma() {
  const concluidos = new Set(lerHistorico().map(({ codigo }) => codigo));

  return (
    programas.find(
      (programa) =>
        !concluidos.has(programa.codigo) && programaDisponivel(programa),
    ) ?? null
  );
}