import "../../CSS/Screen/editarPerfilScreen.css";

import { Fredoka_700Bold, useFonts } from "@expo-google-fonts/fredoka";
import ArrowBack from "@mui/icons-material/ArrowBack";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";

import { lerPerfilLocal, salvarPerfilLocal } from "../data/perfilLocal";

const perfilInicial = {
  nome: "",
  curso: "",
  instituicao: "",
};

const campos = [
  { nome: "nome", rotulo: "Nome", autocomplete: "name", limite: 80 },
  { nome: "curso", rotulo: "Curso", autocomplete: "off", limite: 100 },
  {
    nome: "instituicao",
    rotulo: "Instituição",
    autocomplete: "organization",
    limite: 100,
  },
];

export default function EditarPerfilScreen() {
  const router = useRouter();
  const { nome } = useLocalSearchParams();
  const nomeRecebido = Array.isArray(nome) ? nome[0] : nome;
  const [fonteCarregada] = useFonts({ Fredoka_700Bold });
  const [perfil, setPerfil] = useState(perfilInicial);
  const [erro, setErro] = useState("");

  useEffect(() => {
    const dados = lerPerfilLocal(nomeRecebido);

    setPerfil({
      nome: dados?.nome ?? nomeRecebido?.trim() ?? "",
      curso: dados?.curso ?? "",
      instituicao: dados?.instituicao ?? "",
    });
  }, [nomeRecebido]);

  function voltar() {
    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace({
      pathname: "/perfil",
      params: nomeRecebido ? { nome: nomeRecebido } : {},
    });
  }

  function salvar(evento) {
    evento.preventDefault();

    const dados = {
      nome: perfil.nome.trim(),
      curso: perfil.curso.trim(),
      instituicao: perfil.instituicao.trim(),
    };

    if (!dados.nome || !dados.curso || !dados.instituicao) {
      setErro("Preencha os três campos.");
      return;
    }

    try {
      salvarPerfilLocal(dados);
    } catch {
      setErro("Não foi possível salvar neste navegador. Tente novamente.");
      return;
    }

    voltar();
  }

  return (
    <div className="editar-perfil">
      <main className="editar-perfil__conteudo">
        <header className="editar-perfil__cabecalho">
          <button type="button" aria-label="Voltar" onClick={voltar}>
            <ArrowBack aria-hidden="true" />
          </button>

          <h1 className={fonteCarregada ? "editar-perfil__fredoka" : undefined}>
            Editar perfil
          </h1>
        </header>

        <form className="editar-perfil__formulario" onSubmit={salvar}>
          {campos.map(({ nome: campo, rotulo, autocomplete, limite }) => (
            <label key={campo}>
              <span>{rotulo}</span>
              <input
                name={campo}
                value={perfil[campo]}
                autoComplete={autocomplete}
                maxLength={limite}
                required
                onChange={(evento) => {
                  const valor = evento.target.value;
                  setPerfil((atual) => ({ ...atual, [campo]: valor }));
                  setErro("");
                }}
              />
            </label>
          ))}

          {erro && (
            <p className="editar-perfil__erro" role="alert">
              {erro}
            </p>
          )}

          <div className="editar-perfil__acoes">
            <button type="submit">Salvar alterações</button>
            <button type="button" onClick={voltar}>
              Cancelar
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
