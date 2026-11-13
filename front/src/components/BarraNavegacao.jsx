import { useRouter } from "expo-router";
import Home from "@mui/icons-material/Home";
import HomeOutlined from "@mui/icons-material/HomeOutlined";
import MenuBook from "@mui/icons-material/MenuBook";
import MenuBookOutlined from "@mui/icons-material/MenuBookOutlined";
import Person from "@mui/icons-material/Person";
import PersonOutlined from "@mui/icons-material/PersonOutlined";
import SportsEsports from "@mui/icons-material/SportsEsports";
import SportsEsportsOutlined from "@mui/icons-material/SportsEsportsOutlined";

import estilos from "./BarraNavegacao.module.css";

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

export default function BarraNavegacao({ ativo, params }) {
  const router = useRouter();

  function navegar(item) {
    if (item.rotulo === ativo) return;
    router.replace({ pathname: item.rota, params });
  }

  return (
    <nav className={estilos.barra} aria-label="Navegação principal">
      {navegacao.map((item) => {
        const selecionado = item.rotulo === ativo;
        const Icone = selecionado ? item.ativo : item.icone;

        return (
          <button
            key={item.rotulo}
            type="button"
            className={
              selecionado ? `${estilos.item} ${estilos.ativo}` : estilos.item
            }
            aria-current={selecionado ? "page" : undefined}
            onClick={() => navegar(item)}
          >
            <Icone aria-hidden="true" />
            <span>{item.rotulo}</span>
          </button>
        );
      })}
    </nav>
  );
}
