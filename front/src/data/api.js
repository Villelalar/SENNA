import Constants from "expo-constants";
import { Platform } from "react-native";

// No celular, "localhost" aponta para o próprio aparelho, não para o PC.
// Por isso, em desenvolvimento, usamos o mesmo IP que o Expo usa para
// carregar o app (ex.: 192.168.0.10:8081) e trocamos a porta para a do back.
function descobrirApiUrl() {
  const definida = process.env.EXPO_PUBLIC_API_URL?.trim();
  if (definida) return definida;

  if (Platform.OS !== "web") {
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
