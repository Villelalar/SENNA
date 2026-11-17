const chaveSessao = "senna:sessao:v1";

// No navegador existem localStorage/sessionStorage. No celular (iOS/Android)
// eles não existem, então usamos um armazenamento simples em memória, com
// os mesmos métodos, para o app funcionar igual.
function criarMemoria() {
  const dados = new Map();
  return {
    getItem: (chave) => (dados.has(chave) ? dados.get(chave) : null),
    setItem: (chave, valor) => dados.set(chave, String(valor)),
    removeItem: (chave) => dados.delete(chave),
  };
}

const memoriaPermanente = criarMemoria();
const memoriaTemporaria = criarMemoria();

function obterArmazenamento(nome, reserva) {
  try {
    const armazenamento =
      typeof window !== "undefined" ? window[nome] : undefined;
    if (armazenamento && typeof armazenamento.getItem === "function") {
      return armazenamento;
    }
  } catch {}
  return reserva;
}

function permanente() {
  return obterArmazenamento("localStorage", memoriaPermanente);
}

function temporario() {
  return obterArmazenamento("sessionStorage", memoriaTemporaria);
}

function armazenamentos() {
  return [permanente(), temporario()];
}

function resumirUsuario({ _id, nome, email, curso = "", instituicao = "" }) {
  return { _id, nome, email, curso, instituicao };
}

export function lerSessao() {
  for (const armazenamento of armazenamentos()) {
    try {
      const salvo = JSON.parse(armazenamento.getItem(chaveSessao));
      if (typeof salvo?._id === "string") return salvo;
    } catch {}
  }

  return null;
}

export function exigirSessao() {
  const sessao = lerSessao();

  if (!sessao) {
    const erro = new Error("Sua sessão expirou. Faça login novamente.");
    erro.status = 401;
    throw erro;
  }

  return sessao;
}

export function salvarSessao(usuario, lembrar) {
  limparSessao();

  const armazenamento = lembrar ? permanente() : temporario();
  armazenamento.setItem(chaveSessao, JSON.stringify(resumirUsuario(usuario)));
}

export function atualizarSessao(usuario) {
  const armazenamento = armazenamentos().find((item) =>
    item.getItem(chaveSessao),
  );

  armazenamento?.setItem(chaveSessao, JSON.stringify(resumirUsuario(usuario)));
}

export function limparSessao() {
  for (const armazenamento of armazenamentos()) {
    try {
      armazenamento.removeItem(chaveSessao);
    } catch {}
  }
}
