import ChevronRight from "@mui/icons-material/ChevronRight";
import estilos from "./CardPrograma.module.css";

export default function CardPrograma({
  id,
  respondidas = 0,
  totalPerguntas = 0,
  cor = "#d62929",
  onSelecionar,
}) {
  const respondidasValidas = Math.min(respondidas, totalPerguntas);
  const progresso =
    totalPerguntas > 0 ? respondidasValidas / totalPerguntas : 0;
  const porcentagem = Math.round(progresso * 100);

  return (
    <button
      type="button"
      className={estilos.card}
      onClick={onSelecionar}
      aria-label={`Programa ${id}, ${respondidasValidas} de ${totalPerguntas} perguntas respondidas`}
    >
      <span className={estilos.selo} style={{ backgroundColor: cor }}>
        {id}
      </span>

      <span className={estilos.textos}>
        <span className={estilos.titulo}>Programa {id}</span>

        <span className={estilos.progresso}>
          <span className={estilos.barra} aria-hidden="true">
            <span
              className={estilos.barraPreenchida}
              style={{ width: `${porcentagem}%` }}
            />
          </span>
          <span className={estilos.contagem}>
            {respondidasValidas} de {totalPerguntas}
          </span>
        </span>
      </span>

      <ChevronRight className={estilos.seta} aria-hidden="true" />
    </button>
  );
}
