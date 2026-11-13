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

import { programaDisponivel, programas } from "../../data/partida";

const cores = ["#d92525", "#946600", "#1565c0", "#2e7d32"];

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

export default function GameScreen() {
  const router = useRouter();
  const pathname = usePathname();
  const { nome } = useLocalSearchParams();
  const nomeRecebido = Array.isArray(nome) ? nome[0] : nome;
  const params = nomeRecebido ? { nome: nomeRecebido } : undefined;
  const total = programas.filter(programaDisponivel).length;

  function voltar() {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace({ pathname: "/home", params });
    }
  }

  function navegar(rota) {
    if (pathname === rota) return;

    router.replace({ pathname: rota, params });
  }

  return (
    <div className="containe_principal_games">
      <header className="header_games">
        <div className="header_top">
          <button
            className="row_back"
            type="button"
            aria-label="Voltar"
            onClick={voltar}
          >
            <ArrowBack aria-hidden="true" />
          </button>
          <h1>Jogos</h1>
        </div>

        <p className="subtitle_games">
          {total}{" "}
          {total === 1 ? "programa disponível" : "programas disponíveis"}
        </p>
      </header>

      <main className="content_games" aria-label="Programas">
        <div className="lista_programas_games">
          {programas.map((programa, indice) => {
            const disponivel = programaDisponivel(programa);

            return (
              <div key={programa.codigo} className="card_games_container">
                <div
                  className="card_games_badge"
                  style={{ backgroundColor: cores[indice % cores.length] }}
                >
                  <span>{programa.codigo}</span>
                </div>

                <div className="card_games_content">
                  <h2>{programa.titulo}</h2>
                  <p>{disponivel ? "30 perguntas" : "Gabarito incompleto"}</p>

                  <button
                    type="button"
                    disabled={!disponivel}
                    aria-label={`Jogar programa ${programa.codigo}`}
                    onClick={() =>
                      router.push({
                        pathname: "/jogocap",
                        params: { programa: programa.codigo },
                      })
                    }
                  >
                    Jogar
                  </button>
                </div>
              </div>
            );
          })}
        </div>
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
