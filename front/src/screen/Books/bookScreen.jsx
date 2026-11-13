import "../../../CSS/Screen/booksScreen.css";

import ArrowBack from "@mui/icons-material/ArrowBack";
import Home from "@mui/icons-material/Home";
import HomeOutlined from "@mui/icons-material/HomeOutlined";
import MenuBook from "@mui/icons-material/MenuBook";
import MenuBookOutlined from "@mui/icons-material/MenuBookOutlined";
import Person from "@mui/icons-material/Person";
import PersonOutlined from "@mui/icons-material/PersonOutlined";
import SportsEsports from "@mui/icons-material/SportsEsports";
import SportsEsportsOutlined from "@mui/icons-material/SportsEsportsOutlined";
import { useLocalSearchParams, usePathname, useRouter } from "expo-router";

import CardLivroEscolhido from "../../components/CardLivroEscolhido";
import CardPrograma from "../../components/CardPrograma";
import { programaDisponivel, programas } from "../../data/partida";

const cores = ["#d62929", "#875700", "#1561b9", "#18864a"];

const programasDoLivro = programas.map((programa) => ({
  id: programa.codigo,
  totalPerguntas: 30,
  disponivel: programaDisponivel(programa),
}));

const navegacao = [
  { rotulo: "Início", rota: "/home", icone: HomeOutlined, ativo: Home },
  {
    rotulo: "Jogos",
    rota: "/games",
    icone: SportsEsportsOutlined,
    ativo: SportsEsports,
  },
  { rotulo: "Livros", rota: "/book", icone: MenuBookOutlined, ativo: MenuBook },
  { rotulo: "Perfil", rota: "/perfil", icone: PersonOutlined, ativo: Person },
];

export default function BookScreen() {
  const router = useRouter();
  const pathname = usePathname();
  const { nome } = useLocalSearchParams();
  const nomeRecebido = Array.isArray(nome) ? nome[0] : nome;
  const params = nomeRecebido ? { nome: nomeRecebido } : undefined;

  function voltar() {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace({ pathname: "/home", params });
    }
  }

  function abrirPrograma(programa) {
    if (!programa.disponivel) {
      window.alert("O gabarito deste programa está incompleto.");
      return;
    }

    router.push({
      pathname: "/jogocap",
      params: { programa: programa.id },
    });
  }

  function navegar(rota) {
    if (pathname === rota) return;

    router.replace({ pathname: rota, params });
  }

  return (
    <div className="container-book">
      <header className="header_games">
        <div className="header_top">
          <button
            className="row_back_book"
            type="button"
            aria-label="Voltar"
            onClick={voltar}
          >
            <ArrowBack aria-hidden="true" />
          </button>
          <h1>Livros</h1>
        </div>

        <div className="livro">
          <CardLivroEscolhido
            titulo="Pense Bem: Fórmula 1"
            programas={programasDoLivro}
            perguntasRespondidas={0}
          />
        </div>
      </header>

      <main className="programas">
        <h2 className="programas_titulo">Programas do livro</h2>

        <ul className="programas_lista">
          {programasDoLivro.map((programa, indice) => (
            <li key={programa.id}>
              <CardPrograma
                id={programa.id}
                respondidas={0}
                totalPerguntas={programa.totalPerguntas}
                cor={cores[indice % cores.length]}
                onSelecionar={() => abrirPrograma(programa)}
              />
              {!programa.disponivel && <small>Gabarito incompleto</small>}
            </li>
          ))}
        </ul>
      </main>

      <nav className="navigationBar_games" aria-label="Navegação principal">
        {navegacao.map((item) => {
          const ativo = pathname === item.rota;
          const Icone = ativo ? item.ativo : item.icone;

          return (
            <button
              key={item.rotulo}
              type="button"
              className={ativo ? "nav_item active" : "nav_item"}
              aria-current={ativo ? "page" : undefined}
              onClick={() => navegar(item.rota)}
            >
              <Icone aria-hidden="true" />
              <span>{item.rotulo}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
