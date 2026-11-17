import { Fredoka_700Bold, useFonts } from "@expo-google-fonts/fredoka";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from "react-native";

import TelaPadrao from "../components/TelaPadrao";
import { carregarPerfil, salvarPerfil } from "../data/perfil";

const perfilInicial = {
  nome: "",
  curso: "",
  instituicao: "",
};

const campos = [
  {
    nome: "nome",
    rotulo: "Nome *",
    autocomplete: "name",
    limite: 80,
  },
  { nome: "curso", rotulo: "Curso", autocomplete: "off", limite: 100 },
  {
    nome: "instituicao",
    rotulo: "Instituição",
    autocomplete: "off",
    limite: 100,
  },
];

export default function EditarPerfilScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { nome } = useLocalSearchParams();
  const nomeRecebido = Array.isArray(nome) ? nome[0] : nome;
  const [fonteCarregada] = useFonts({ Fredoka_700Bold });
  const [perfil, setPerfil] = useState(perfilInicial);
  const [erro, setErro] = useState("");
  const [salvando, setSalvando] = useState(false);

  const espacoInterno = Math.min(24, Math.max(16, width * 0.04));

  useEffect(() => {
    let ativo = true;

    carregarPerfil()
      .then((dados) => ativo && setPerfil({ ...perfilInicial, ...dados }))
      .catch((falha) => ativo && setErro(falha.message));

    return () => {
      ativo = false;
    };
  }, []);

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

  async function salvar() {
    if (salvando) return;

    const dados = {
      nome: (perfil.nome ?? "").trim(),
      curso: (perfil.curso ?? "").trim(),
      instituicao: (perfil.instituicao ?? "").trim(),
    };

    if (!dados.nome) {
      setErro("Preencha o nome.");
      return;
    }

    setSalvando(true);

    try {
      await salvarPerfil(dados);
    } catch (falha) {
      setErro(falha.message);
      return;
    } finally {
      setSalvando(false);
    }

    voltar();
  }

  return (
    <TelaPadrao
      titulo="Editar perfil"
      onVoltar={voltar}
      fonteTitulo={fonteCarregada ? styles.fredoka : null}
    >
      <View style={[styles.formulario, { padding: espacoInterno }]}>
        {campos.map(({ nome: campo, rotulo, autocomplete, limite }, indice) => (
          <View key={campo} style={styles.campo}>
            <Text style={styles.rotulo} nativeID={`rotulo-${campo}`}>
              {rotulo}
            </Text>
            <TextInput
              style={styles.input}
              value={perfil[campo] ?? ""}
              autoComplete={autocomplete}
              maxLength={limite}
              accessibilityLabel={rotulo}
              accessibilityLabelledBy={`rotulo-${campo}`}
              returnKeyType={indice === campos.length - 1 ? "done" : "next"}
              onSubmitEditing={
                indice === campos.length - 1 ? salvar : undefined
              }
              onChangeText={(valor) => {
                setPerfil((atual) => ({ ...atual, [campo]: valor }));
                setErro("");
              }}
            />
          </View>
        ))}

        {erro ? (
          <Text style={styles.erro} accessibilityRole="alert">
            {erro}
          </Text>
        ) : null}

        <View style={styles.acoes}>
          <Pressable
            onPress={salvar}
            disabled={salvando}
            accessibilityRole="button"
            accessibilityState={{ disabled: salvando, busy: salvando }}
            style={({ pressed }) => [
              styles.botao,
              styles.botaoPrincipal,
              salvando && styles.botaoDesativado,
              pressed && styles.pressionado,
            ]}
          >
            <Text style={[styles.textoBotao, styles.textoBotaoPrincipal]}>
              {salvando ? "Salvando..." : "Salvar alterações"}
            </Text>
          </Pressable>

          <Pressable
            onPress={voltar}
            accessibilityRole="button"
            style={({ pressed }) => [
              styles.botao,
              pressed && styles.pressionado,
            ]}
          >
            <Text style={styles.textoBotao}>Cancelar</Text>
          </Pressable>
        </View>
      </View>
    </TelaPadrao>
  );
}

const styles = StyleSheet.create({
  fredoka: {
    fontFamily: "Fredoka_700Bold",
    fontWeight: "normal",
  },
  formulario: {
    gap: 16,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e4e4ee",
    borderRadius: 22,
    boxShadow: "0px 6px 18px rgba(30, 30, 60, 0.06)",
  },
  campo: {
    gap: 8,
  },
  rotulo: {
    fontWeight: "700",
    color: "#15141e",
  },
  input: {
    minHeight: 48,
    padding: 12,
    borderWidth: 1,
    borderColor: "#cbc8da",
    borderRadius: 12,
    fontSize: 16,
    color: "#15141e",
    backgroundColor: "#ffffff",
  },
  erro: {
    color: "#a22125",
  },
  acoes: {
    gap: 8,
    marginTop: 4,
  },
  botao: {
    minHeight: 48,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#cbc8da",
    borderRadius: 14,
    backgroundColor: "#ffffff",
  },
  botaoPrincipal: {
    borderColor: "#15141e",
    backgroundColor: "#15141e",
  },
  botaoDesativado: {
    opacity: 0.6,
  },
  pressionado: {
    transform: [{ scale: 0.98 }],
  },
  textoBotao: {
    fontWeight: "700",
    color: "#15141e",
  },
  textoBotaoPrincipal: {
    color: "#ffffff",
  },
});
