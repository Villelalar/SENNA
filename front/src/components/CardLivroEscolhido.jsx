import estilos from "./CardLivroEscolhido.module.css";

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
    <div className={estilos.card}>
      {capa ? (
        <img
          src={capa}
          alt={`Capa do livro ${titulo}`}
          className={estilos.capa}
        />
      ) : (
        <div className={`${estilos.capa} ${estilos.capaPadrao}`}>
          PENSE
          <br />
          BEM
          <br />
          SENNA
        </div>
      )}

      <div className={estilos.textos}>
        <p className={estilos.etiqueta}>Livro escolhido</p>
        <h2 className={estilos.titulo}>{titulo}</h2>

        <p className={estilos.resumo}>
          {formatarQuantidade(totalProgramas, "programa", "programas")} ·{" "}
          {formatarQuantidade(totalPerguntas, "pergunta", "perguntas")}
        </p>

        <div
          className={estilos.barra}
          role="progressbar"
          aria-label="Progresso do livro"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={porcentagem}
        >
          <div
            className={estilos.barraPreenchida}
            style={{ width: `${porcentagem}%` }}
          />
        </div>
      </div>
    </div>
  );
}
