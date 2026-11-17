import Constants from "expo-constants";
import { Platform } from "react-native";

// De onde vem o endereço do back:
// 1) EXPO_PUBLIC_API_URL, se alguém definir (opcional);
// 2) em desenvolvimento (expo start): o IP do seu PC, porta 3000;
// 3) no APK, na versão web publicada e nas atualizações: "extra.apiUrl"
//    do app.json (endereço do back no Render).
function descobrirApiUrl() {
  const definida = process.env.EXPO_PUBLIC_API_URL?.trim();
  if (definida) return definida;

  if (__DEV__) {
    if (Platform.OS !== "web") {
      // No celular, "localhost" é o próprio aparelho; usamos o IP do PC
      // que o Expo usou para carregar o app.
      const hostUri =
        Constants.expoConfig?.hostUri ||
        Constants.expoGoConfig?.debuggerHost ||
        "";
      const host = hostUri.split(":")[0];
      if (host && !host.endsWith(".exp.direct")) {
        return `http://${host}:3000`;
      }
    }
    return "http://localhost:3000";
  }

  const producao = Constants.expoConfig?.extra?.apiUrl?.trim();
  if (producao) return producao;

  return "http://localhost:3000";
}

const apiUrl = descobrirApiUrl().replace(/\/+$/, "");

export async function requisitar(caminho, { metodo = "GET", corpo } = {}) {
  let resposta;

  try {
    resposta = await fetch(`${apiUrl}/api${caminho}`, {
      method: metodo,
      headers:
        corpo === undefined ? undefined : { "Content-Type": "application/json" },
      body: corpo === undefined ? undefined : JSON.stringify(corpo),
    });
  } catch {
    throw new Error("Não foi possível conectar ao servidor.");
  }

  const dados = await resposta.json().catch(() => null);

  if (!resposta.ok) {
    const erro = new Error(dados?.erro || "Erro inesperado no servidor.");
    erro.status = resposta.status;
    throw erro;
  }

  return dados;
}
