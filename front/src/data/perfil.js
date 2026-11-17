import { requisitar } from "./api";
import { atualizarSessao, exigirSessao } from "./sessao";

function caminhoUsuario() {
  return `/users/${encodeURIComponent(exigirSessao()._id)}`;
}

function comPadroes(usuario) {
  return {
    nome: usuario.nome?.trim() || "Jogador",
    curso: usuario.curso?.trim() ?? "",
    instituicao: usuario.instituicao?.trim() ?? "",
  };
}

export async function carregarPerfil() {
  const usuario = await requisitar(caminhoUsuario());
  atualizarSessao(usuario);
  return comPadroes(usuario);
}

export async function salvarPerfil(dados) {
  const usuario = await requisitar(caminhoUsuario(), {
    metodo: "PUT",
    corpo: dados,
  });
  atualizarSessao(usuario);
  return comPadroes(usuario);
}
