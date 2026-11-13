import { perfilPadrao } from "./estatisticas";

const chavePerfil = "senna:perfil-local:v1";

export function lerPerfilLocal(nome) {
  const padrao = {
    nome: nome?.trim() || "Jogador",
    ...perfilPadrao,
  };

  if (typeof window === "undefined") return padrao;

  try {
    const salvo = JSON.parse(window.localStorage.getItem(chavePerfil));

    return {
      nome: typeof salvo?.nome === "string" ? salvo.nome : padrao.nome,
      curso: typeof salvo?.curso === "string" ? salvo.curso : padrao.curso,
      instituicao:
        typeof salvo?.instituicao === "string"
          ? salvo.instituicao
          : padrao.instituicao,
    };
  } catch {
    return padrao;
  }
}

export function salvarPerfilLocal(perfil) {
  window.localStorage.setItem(chavePerfil, JSON.stringify(perfil));
}