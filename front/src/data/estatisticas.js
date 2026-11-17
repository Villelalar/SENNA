import { requisitar } from "./api";
import { carregarProgramas } from "./partida";
import { exigirSessao } from "./sessao";

export const PONTOS_MAXIMOS_PROGRAMA = 90;
export const PERGUNTAS_POR_PROGRAMA = 30;

const milissegundosPorDia = 86_400_000;

function caminhoPartidas() {
  return `/users/${encodeURIComponent(exigirSessao()._id)}/partidas`;
}

function caminhoAtividade() {
  return `/users/${encodeURIComponent(exigirSessao()._id)}/atividade`;
}

async function lerHistorico() {
  return requisitar(caminhoPartidas());
}

async function lerDiasAtivos() {
  try {
    const { dias } = await requisitar(caminhoAtividade());
    return Array.isArray(dias) ? dias : [];
  } catch {
    return [];
  }
}

function diaLocal(data) {
  return (
    Date.UTC(data.getFullYear(), data.getMonth(), data.getDate()) /
    milissegundosPorDia
  );
}

// Marca o dia de hoje como ativo (basta responder uma pergunta).
// Só faz a requisição uma vez por dia enquanto o app está aberto.
let ultimoDiaRegistrado = null;

export async function registrarAtividadeHoje() {
  const hoje = diaLocal(new Date());
  if (ultimoDiaRegistrado === hoje) return;

  await requisitar(caminhoAtividade(), {
    metodo: "POST",
    corpo: { dia: hoje },
  });
  ultimoDiaRegistrado = hoje;
}

export async function salvarResultadoPartida({ codigo, totais }) {
  return requisitar(caminhoPartidas(), {
    metodo: "POST",
    corpo: { codigo, totais: [...totais], dia: diaLocal(new Date()) },
  });
}

function resumirHistorico(historico, programas, diasAtivos = []) {
  const programasDoLivro = programas.filter(
    (programa) => !programa.revisao && programa.totalPerguntas > 0,
  );
  const totais = [0, 0, 0, 0];
  const melhoresPontos = new Map();
  const diasJogados = new Set(diasAtivos);

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
      (melhoresPontos.has(programa.codigo) ? programa.totalPerguntas : 0),
    0,
  );

  const totalPerguntasLivro = programasDoLivro.reduce(
    (total, programa) => total + programa.totalPerguntas,
    0,
  );

  const proximoPrograma =
    programas.find(
      (programa) => !melhoresPontos.has(programa.codigo) && programa.disponivel,
    ) ?? null;

  return {
    pontosTotais,
    totais,
    semAcerto,
    diasSeguidos,
    perguntasRespondidas,
    totalPerguntasLivro,
    pontosPorPrograma: programasDoLivro.map(({ codigo, totalPerguntas }) => ({
      codigo,
      pontos: melhoresPontos.get(codigo) ?? 0,
      maximo: totalPerguntas * 3 || PONTOS_MAXIMOS_PROGRAMA,
    })),
    programasConcluidos: [...melhoresPontos.keys()],
    proximoPrograma,
  };
}

export const estatisticasIniciais = resumirHistorico([], []);

export async function obterEstatisticas() {
  const [historico, programas, diasAtivos] = await Promise.all([
    lerHistorico(),
    carregarProgramas(),
    lerDiasAtivos(),
  ]);

  return resumirHistorico(historico, programas, diasAtivos);
}

export async function zerarProgresso() {
  ultimoDiaRegistrado = null;
  return requisitar(caminhoPartidas(), { metodo: "DELETE" });
}