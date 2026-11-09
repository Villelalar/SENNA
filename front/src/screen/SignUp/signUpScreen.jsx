import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from "react-native";

const fonte = Platform.OS === "ios" ? "Courier New" : "monospace";

export default function SignUpScreen() {

  const [dataNascimento, setDataNascimento] = useState("");
  const [nome, setNome] = useState("");
  const [sobrenome, setSobrenome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const router = useRouter();
  const { height } = useWindowDimensions();

  function mostrarAviso(titulo, mensagem) {
    if (Platform.OS === "web") {
      window.alert(`${titulo}\n\n${mensagem}`);
    } else {
      Alert.alert(titulo, mensagem);
    }
  }

  async function cadastrar() {
    
    if (!email.trim() || !senha.trim() || !nome.trim() || !sobrenome.trim() || !dataNascimento.trim()) {
      mostrarAviso("Atenção", "Preencha todos os campos.");
      return;
    }
    const nomeCompleto = `${nome.trim()} ${sobrenome.trim()}`;
    console.log("Dados do cadastro:", { nomeCompleto, email, senha, dataNascimento });

        try {
          const data = await fetch("http://localhost:3000/api/users/create", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nome: nomeCompleto, email, senha }),
          });  

          const response = await data.json();
          console.log(data.status, response);

        if (data.status == 201) {
          console.log("Cadastro bem-sucedido:", data); 
           mostrarAviso("Sucesso", "Cadastro realizado com sucesso: "); 
           router.replace("/");
        }else {
          mostrarAviso("Erro", "Falha ao realizar cadastro: "  + response.erro);
        }
        }catch (error) {
          mostrarAviso("Erro", "Falha ao realizar cadastro: " + error.message);
        }
  }

  function entrarComGoogle() {
    mostrarAviso("Google", "O cadastro com Google ainda está indisponível.");
  }

  return (
    <View style={styles.fundo}>
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
            <TextInput
              style={styles.input}
              placeholder="Data de nascimento (DD/MM/AAAA)"
              placeholderTextColor="#777"
              keyboardType="numbers-and-punctuation"
              onChangeText={setDataNascimento}
              value={dataNascimento}
            />

            <TextInput
              style={styles.input}
              placeholder="Nome"
              placeholderTextColor="#777"
              autoCapitalize="words"
              onChangeText={setNome}
              value={nome}
            />

            <TextInput
              style={styles.input}
              placeholder="Sobrenome"
              placeholderTextColor="#777"
              autoCapitalize="words"
              onChangeText={setSobrenome}
              value={sobrenome}
            />

            <TextInput
              style={styles.input}
              placeholder="E-mail"
              placeholderTextColor="#777"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="email"
              value={email}
              onChangeText={setEmail}
            />

            <TextInput
              style={styles.input}
              placeholder="Sua senha"
              placeholderTextColor="#777"
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="new-password"
              onChangeText={setSenha}
              value={senha}
            />

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
    </View>
  );
}

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
