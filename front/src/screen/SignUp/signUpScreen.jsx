import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from "react-native";

import { requisitar } from "../../data/api";

const fonte = Platform.OS === "ios" ? "Courier New" : "monospace";
const dataMinima = "1900-01-01";

function hojeIso() {
  return new Date().toLocaleDateString("sv-SE");
}

export default function SignUpScreen() {
  const router = useRouter();
  const { height } = useWindowDimensions();

  const [dataNascimento, setDataNascimento] = useState("");
  const [nome, setNome] = useState("");
  const [sobrenome, setSobrenome] = useState("");
  const [curso, setCurso] = useState("");
  const [instituicao, setInstituicao] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const cadastroEmAndamento = useRef(false);

  // Rolagem própria dos campos do card + atalho "próximo" no teclado
  const rolagemCampos = useRef(null);
  const campoNome = useRef(null);
  const campoSobrenome = useRef(null);
  const campoCurso = useRef(null);
  const campoInstituicao = useRef(null);
  const campoEmail = useRef(null);
  const campoSenha = useRef(null);
  const alturaCampos = Math.max(220, Math.min(height * 0.42, 420));

  useEffect(() => {
    // Mostra a barra de rolagem por um instante para indicar que dá pra rolar
    const timer = setTimeout(
      () => rolagemCampos.current?.flashScrollIndicators?.(),
      600,
    );
    return () => clearTimeout(timer);
  }, []);

  function mostrarAviso(titulo, mensagem) {
    if (Platform.OS === "web") {
      window.alert(`${titulo}\n\n${mensagem}`);
    } else {
      Alert.alert(titulo, mensagem);
    }
  }

  async function cadastrar() {
    if (cadastroEmAndamento.current) return;

    if (
      !dataNascimento.trim() ||
      !nome.trim() ||
      !sobrenome.trim() ||
      !email.trim() ||
      !senha.trim()
    ) {
      mostrarAviso("Atenção", "Preencha todos os campos obrigatórios (*).");
      return;
    }

    if (
      Platform.OS === "web" &&
      (dataNascimento < dataMinima || dataNascimento > hojeIso())
    ) {
      mostrarAviso("Atenção", "Informe uma data de nascimento válida.");
      return;
    }

    const nomeCompleto = `${nome.trim()} ${sobrenome.trim()}`;
    cadastroEmAndamento.current = true;

    try {
      await requisitar("/users/create", {
        metodo: "POST",
        corpo: {
          nome: nomeCompleto,
          email: email.trim(),
          senha,
          curso: curso.trim(),
          instituicao: instituicao.trim(),
        },
      });

      mostrarAviso("Sucesso", "Cadastro realizado com sucesso.");
      router.replace("/login");
    } catch (erro) {
      mostrarAviso("Erro", erro.message);
    } finally {
      cadastroEmAndamento.current = false;
    }
  }

  function entrarComGoogle() {
    mostrarAviso("Google", "O cadastro com Google ainda está indisponível.");
  }

  return (
    <KeyboardAvoidingView
      style={styles.fundo}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <Image
        source={require("../../../assets/images/gradiente.jpg")}
        style={[styles.gradiente, { height: height * 0.45 }]}
        resizeMode="stretch"
      />

      <ScrollView
        contentContainerStyle={[
          styles.container,
          { paddingTop: height * 0.15 },
        ]}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="interactive"
        automaticallyAdjustKeyboardInsets
      >
        <View style={styles.titulo}>
          <View style={styles.marca}>
            <View style={styles.simbolo}>
              <View style={[styles.quadrado, styles.vermelho]} />
              <View style={[styles.quadrado, styles.amarelo]} />
              <View style={[styles.quadrado, styles.verde]} />
              <View style={[styles.quadrado, styles.azul]} />
            </View>

            <Text style={styles.nomeMarca}>Tectoy</Text>
          </View>

          <Text style={styles.subtitulo}>
            Already have an account?{" "}
            <Text
              style={styles.link}
              onPress={() => router.replace("/login")}
              accessibilityRole="link"
            >
              Log in
            </Text>
          </Text>
        </View>

        <View style={styles.conteudo}>
          <View style={styles.formulario}>
            <Text style={styles.legenda}>* Campos obrigatórios</Text>

            <ScrollView
              ref={rolagemCampos}
              style={[styles.rolagemCampos, { maxHeight: alturaCampos }]}
              contentContainerStyle={styles.campos}
              nestedScrollEnabled
              persistentScrollbar
              showsVerticalScrollIndicator
              keyboardShouldPersistTaps="handled"
              automaticallyAdjustKeyboardInsets
            >
              {Platform.OS === "web" ? (
                <label style={estilosWeb.campoData}>
                  <span style={estilosWeb.rotuloData}>
                    Data de nascimento *
                  </span>
                  <input
                    type="date"
                    value={dataNascimento}
                    min={dataMinima}
                    max={hojeIso()}
                    onChange={(evento) =>
                      setDataNascimento(evento.target.value)
                    }
                    onClick={(evento) => {
                      try {
                        evento.currentTarget.showPicker?.();
                      } catch {}
                    }}
                    style={{
                      ...estilosWeb.inputData,
                      color: dataNascimento ? "#222" : "#777",
                    }}
                  />
                </label>
              ) : (
                <TextInput
                  style={styles.input}
                  placeholder="Data de nascimento (DD/MM/AAAA) *"
                  value={dataNascimento}
                  onChangeText={setDataNascimento}
                  placeholderTextColor="#777"
                  keyboardType="numbers-and-punctuation"
                  returnKeyType="next"
                  blurOnSubmit={false}
                  onSubmitEditing={() => campoNome.current?.focus()}
                />
              )}

              <TextInput
                ref={campoNome}
                style={styles.input}
                placeholder="Nome *"
                returnKeyType="next"
                blurOnSubmit={false}
                onSubmitEditing={() => campoSobrenome.current?.focus()}
                value={nome}
                onChangeText={setNome}
                placeholderTextColor="#777"
                autoCapitalize="words"
              />

              <TextInput
                ref={campoSobrenome}
                style={styles.input}
                placeholder="Sobrenome *"
                returnKeyType="next"
                blurOnSubmit={false}
                onSubmitEditing={() => campoCurso.current?.focus()}
                value={sobrenome}
                onChangeText={setSobrenome}
                placeholderTextColor="#777"
                autoCapitalize="words"
              />

              <TextInput
                ref={campoCurso}
                style={styles.input}
                placeholder="Curso (opcional)"
                returnKeyType="next"
                blurOnSubmit={false}
                onSubmitEditing={() => campoInstituicao.current?.focus()}
                value={curso}
                onChangeText={setCurso}
                placeholderTextColor="#777"
                autoCapitalize="words"
                maxLength={100}
              />

              <TextInput
                ref={campoInstituicao}
                style={styles.input}
                placeholder="Instituição (opcional)"
                returnKeyType="next"
                blurOnSubmit={false}
                onSubmitEditing={() => campoEmail.current?.focus()}
                value={instituicao}
                onChangeText={setInstituicao}
                placeholderTextColor="#777"
                autoCapitalize="words"
                maxLength={100}
              />

              <TextInput
                ref={campoEmail}
                style={styles.input}
                placeholder="E-mail *"
                returnKeyType="next"
                blurOnSubmit={false}
                onSubmitEditing={() => campoSenha.current?.focus()}
                value={email}
                onChangeText={setEmail}
                placeholderTextColor="#777"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="email"
              />

              <TextInput
                ref={campoSenha}
                style={styles.input}
                placeholder="Sua senha *"
                returnKeyType="done"
                blurOnSubmit={true}
                onSubmitEditing={cadastrar}
                value={senha}
                onChangeText={setSenha}
                placeholderTextColor="#777"
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="new-password"
              />
            </ScrollView>

            <Pressable
              style={styles.botao}
              onPress={cadastrar}
              accessibilityRole="button"
            >
              <Text style={styles.textoBotao}>Sign Up</Text>
            </Pressable>

            <Text style={styles.texto}>or</Text>

            <Pressable
              style={styles.botaoGoogle}
              onPress={entrarComGoogle}
              accessibilityRole="button"
            >
              <Text style={styles.texto}>Sign Up with Google</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const estilosWeb = {
  campoData: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    gap: 6,
  },
  rotuloData: {
    fontFamily: fonte,
    fontSize: 12,
    color: "#555",
  },
  inputData: {
    width: "100%",
    boxSizing: "border-box",
    border: "1px solid #ccc",
    borderRadius: 8,
    padding: "13px 12px",
    fontFamily: fonte,
    fontSize: 14,
    backgroundColor: "#fff",
    outline: "none",
    cursor: "pointer",
  },
};

const styles = StyleSheet.create({
  fundo: {
    flex: 1,
    backgroundColor: "#f4f6f8",
  },
  gradiente: {
    position: "absolute",
    top: 0,
    width: "100%",
  },
  container: {
    flexGrow: 1,
    alignItems: "center",
    paddingBottom: 40,
    gap: 30,
  },
  titulo: {
    alignItems: "center",
    gap: 10,
  },
  marca: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  simbolo: {
    width: 38,
    height: 45,
  },
  quadrado: {
    position: "absolute",
    width: 17,
    height: 17,
  },
  vermelho: {
    top: 0,
    left: 0,
    backgroundColor: "#ff6546",
  },
  amarelo: {
    top: 8,
    right: 0,
    backgroundColor: "#ffdb35",
  },
  verde: {
    top: 20,
    left: 0,
    backgroundColor: "#31d275",
  },
  azul: {
    top: 28,
    right: 0,
    backgroundColor: "#23a7dc",
  },
  nomeMarca: {
    fontSize: 36,
    fontWeight: "800",
    letterSpacing: -1.5,
    color: "#151515",
  },
  subtitulo: {
    fontFamily: fonte,
    fontSize: 13,
    color: "#333",
    textAlign: "center",
  },
  link: {
    color: "#2563eb",
    fontWeight: "bold",
  },
  conteudo: {
    width: "90%",
    maxWidth: 380,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 5,
  },
  formulario: {
    width: "100%",
    gap: 15,
    alignItems: "center",
  },
  rolagemCampos: {
    width: "100%",
    flexGrow: 0,
  },
  campos: {
    gap: 15,
    paddingRight: 4,
    paddingBottom: 2,
  },
  legenda: {
    alignSelf: "flex-start",
    fontFamily: fonte,
    fontSize: 12,
    color: "#555",
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 14,
    fontFamily: fonte,
    fontSize: 14,
    color: "#222",
  },
  botao: {
    width: "100%",
    backgroundColor: "#2563eb",
    borderRadius: 8,
    padding: 14,
    alignItems: "center",
  },
  textoBotao: {
    fontFamily: fonte,
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  botaoGoogle: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 14,
    alignItems: "center",
  },
  texto: {
    fontFamily: fonte,
    color: "#333",
    fontSize: 14,
  },
});
