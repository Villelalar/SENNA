import "../../../CSS/Screen/perfilScreen.css";

import { Fredoka_700Bold, useFonts } from "@expo-google-fonts/fredoka";
import ArrowBack from "@mui/icons-material/ArrowBack";
import ChevronRight from "@mui/icons-material/ChevronRight";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";

import BarraNavegacao from "../../components/BarraNavegacao";
import {
  obterEstatisticas,
  perfilPadrao,
  zerarProgresso,
} from "../../data/estatisticas";

export default function PerfilScreen() {
  const router = useRouter();
  const { nome } = useLocalSearchParams();
  const nomeRecebido = Array.isArray(nome) ? nome[0] : nome;
  const nomeExibido = nomeRecebido?.trim() || "Jogador";
  const inicial = nomeExibido.charAt(0).toUpperCase();
  const [fonteCarregada] = useFonts({ Fredoka_700Bold });
  const [estatisticas, setEstatisticas] = useState(obterEstatisticas);

  const porcentagem =
    estatisticas.totalPerguntasLivro > 0
      ? Math.min(
          Math.round(
            (estatisticas.perguntasRespondidas /
              estatisticas.totalPerguntasLivro) *
              100,
          ),
          100,
        )
      : 0;

  function voltar() {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/home");
    }
  }

  function editarPerfil() {
    window.alert("Esta opção está indisponível.");
  }

  function zerar() {
    const confirmou = window.confirm(
      "Tem certeza que deseja zerar todo o seu progresso?",
    );

    if (!confirmou) return;

    zerarProgresso();
    setEstatisticas(obterEstatisticas());
  }

  function sair() {
    router.replace("/login");
  }

  const opcoes = [
    { rotulo: "Editar perfil", acao: editarPerfil },
    { rotulo: "Zerar progresso", acao: zerar },
    { rotulo: "Sair", acao: sair },
  ];

  return (
    <div
      className={
        fonteCarregada ? "container-perfil fonte-carregada" : "container-perfil"
      }
    >
      <header className="header_perfil">
        <button
          className="row_back_perfil"
          type="button"
          aria-label="Voltar"
          onClick={voltar}
        >
          <ArrowBack aria-hidden="true" />
        </button>
        <h1>Perfil</h1>
      </header>

      <main className="conteudo_perfil">
        <section className="perfil_identidade">
          <div className="perfil_avatar" aria-hidden="true">
            {inicial}
          </div>
          <h2>{nomeExibido}</h2>
          <p>
            {perfilPadrao.curso} · {perfilPadrao.instituicao}
          </p>
        </section>

        <section className="perfil_resumo" aria-label="Resumo">
          <div className="resumo_card resumo_sequencia">
            <strong>{estatisticas.diasSeguidos}</strong>
            <span>dias seguidos</span>
          </div>
          <div className="resumo_card resumo_pontos">
            <strong>{estatisticas.pontosTotais}</strong>
            <span>pontos</span>
          </div>
        </section>

        <section className="card_progresso_livro">
          <h3>Progresso do livro</h3>
          <p>
            Início Ayrton Senna · {estatisticas.perguntasRespondidas} de{" "}
            {estatisticas.totalPerguntasLivro} perguntas
          </p>
          <div
            className="barra_progresso"
            role="progressbar"
            aria-label="Progresso do livro"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={porcentagem}
          >
            <div
              className="barra_progresso_preenchida"
              style={{ width: `${porcentagem}%` }}
            />
          </div>
        </section>

        <ul className="lista_opcoes">
          {opcoes.map((opcao) => (
            <li key={opcao.rotulo}>
              <button type="button" className="opcao_perfil" onClick={opcao.acao}>
                <span>{opcao.rotulo}</span>
                <ChevronRight aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
      </main>

      <BarraNavegacao
        ativo="Perfil"
        params={nomeRecebido ? { nome: nomeRecebido } : undefined}
      />
    </div>
  );
}
