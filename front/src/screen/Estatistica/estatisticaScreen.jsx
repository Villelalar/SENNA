import "../../../CSS/Screen/estatisticaScreen.css";

import { Fredoka_700Bold, useFonts } from "@expo-google-fonts/fredoka";
import ArrowBack from "@mui/icons-material/ArrowBack";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useState } from "react";

import BarraNavegacao from "../../components/BarraNavegacao";
import {
  estatisticasIniciais,
  obterEstatisticas,
  PONTOS_MAXIMOS_PROGRAMA,
} from "../../data/estatisticas";

const cores = ["#d62929", "#875700", "#1561b9", "#18864a"];

export default function EstatisticaScreen() {
  const router = useRouter();
  const { nome } = useLocalSearchParams();
  const nomeRecebido = Array.isArray(nome) ? nome[0] : nome;
  const [fonteCarregada] = useFonts({ Fredoka_700Bold });
  const [estatisticas, setEstatisticas] = useState(estatisticasIniciais);

  useFocusEffect(
    useCallback(() => {
      setEstatisticas(obterEstatisticas());
    }, []),
  );

  const tentativas = [
    { rotulo: "1ª tentativa", valor: estatisticas.totais[0] },
    { rotulo: "2ª tentativa", valor: estatisticas.totais[1] },
    { rotulo: "3ª tentativa", valor: estatisticas.totais[2] },
    { rotulo: "Sem acerto", valor: estatisticas.semAcerto },
  ];

  function voltar() {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/home");
    }
  }

  return (
    <div
      className={
        fonteCarregada
          ? "container-estatistica fonte-carregada"
          : "container-estatistica"
      }
    >
      <header className="header_estatistica">
        <button
          className="row_back_estatistica"
          type="button"
          aria-label="Voltar"
          onClick={voltar}
        >
          <ArrowBack aria-hidden="true" />
        </button>
        <h1>Estatística</h1>
      </header>

      <main className="conteudo_estatistica">
        <section className="card_pontos_totais" aria-label="Pontos totais">
          <p>Pontos totais</p>
          <strong>{estatisticas.pontosTotais}</strong>
        </section>

        <section
          className="grade_tentativas"
          aria-label="Acertos por tentativa"
        >
          {tentativas.map((item) => (
            <div key={item.rotulo} className="card_tentativa">
              <strong>{item.valor}</strong>
              <span>{item.rotulo}</span>
            </div>
          ))}
        </section>

        <section className="card_grafico" aria-label="Pontos por programa">
          <h2>Pontos por programa</h2>

          <ul className="grafico">
            {estatisticas.pontosPorPrograma.map((item, indice) => {
              const altura = Math.min(
                (item.pontos / PONTOS_MAXIMOS_PROGRAMA) * 100,
                100,
              );
              const temPontos = item.pontos > 0;

              return (
                <li key={item.codigo} className="grafico_coluna">
                  <div className="grafico_area">
                    <div
                      className={
                        temPontos ? "grafico_barra" : "grafico_barra vazia"
                      }
                      style={
                        temPontos
                          ? {
                              height: `${altura}%`,
                              backgroundColor: cores[indice % cores.length],
                            }
                          : undefined
                      }
                      title={`${item.pontos} pontos`}
                    />
                  </div>
                  <span>{item.codigo}</span>
                </li>
              );
            })}
          </ul>
        </section>

        <section className="card_sequencia" aria-label="Sequência de dias">
          <span className="selo_sequencia">{estatisticas.diasSeguidos}</span>
          <p>dias seguidos</p>
        </section>
      </main>

      <BarraNavegacao
        ativo="Início"
        params={nomeRecebido ? { nome: nomeRecebido } : undefined}
      />
    </div>
  );
}
