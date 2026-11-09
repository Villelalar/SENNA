// Yo, what's up, guys? This is ThomasTheAndrew, and I'm coding :)

import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";

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
  View,
} from "react-native";

export default function LoginScreen() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [lembrar, setLembrar] = useState(false);

  function mostrarAviso(titulo, mensagem) {
    if (Platform.OS === "web") {
      window.alert(`${titulo}\n\n${mensagem}`);
    } else {
      Alert.alert(titulo, mensagem);
    }
  }

  async function entrar() {

    if (!email.trim() || !senha.trim()) {
      mostrarAviso("Atenção", "Preencha o email e a senha.");
      return;
    }
        try {
          const data = await fetch("http://localhost:3000/api/users/login", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, senha }),
          });  

          const response = await data.json();
          console.log(data.status, response);

        if (data.status == 200) {
          console.log("Login bem-sucedido:", data); 
           mostrarAviso("Sucesso", "Login realizado Com Sucesso: "); 
           router.replace({ pathname: "/home" , params: { nome: response.nome } });
        }else {
          mostrarAviso("Erro", "Falha ao realizar login: "  + response.erro);
        }
        }catch (error) {
          mostrarAviso("Erro", "Falha ao realizar login: " + error.message);
        }


}

  function emBreve() {
    mostrarAviso("Em breve", "Esta opção está indisponível.");
  }

  return (
    <KeyboardAvoidingView
      style={styles.tela}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <StatusBar style="dark" />

      <Image
        source={require("../../../assets/images/gradiente.jpg")}
        style={styles.gradiente}
        resizeMode="stretch"
      />

      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.marca}>
          <View style={styles.simbolo}>
            <View style={[styles.quadrado, styles.vermelho]} />
            <View style={[styles.quadrado, styles.amarelo]} />
            <View style={[styles.quadrado, styles.verde]} />
            <View style={[styles.quadrado, styles.azul]} />
          </View>

          <Text style={styles.nomeMarca}>Tectoy</Text>
        </View>

        <View style={styles.cartao}>
          <Pressable
            style={styles.botaoGoogle}
            onPress={emBreve}
            accessibilityRole="button"
          >
            <Text style={styles.googleG}>G</Text>
            <Text style={styles.googleTexto}>Continue with Google</Text>
          </Pressable>

          <View style={styles.divisor}>
            <View style={styles.linha} />
            <Text style={styles.divisorTexto}>Or login with</Text>
            <View style={styles.linha} />
          </View>

          <TextInput
            style={styles.input}
            placeholder="E-mail"
            placeholderTextColor="#929292"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="email"
            accessibilityLabel="E-mail"
          />

          <View style={styles.campoSenha}>
            <TextInput
              style={styles.inputSenha}
              placeholder="Password"
              placeholderTextColor="#929292"
              value={senha}
              onChangeText={setSenha}
              secureTextEntry={!mostrarSenha}
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="current-password"
              accessibilityLabel="Senha"
              onSubmitEditing={entrar}
            />

            <Pressable
              onPress={() => setMostrarSenha((valor) => !valor)}
              hitSlop={10}
              accessibilityRole="button"
              accessibilityLabel={
                mostrarSenha ? "Ocultar senha" : "Mostrar senha"
              }
            >
              <Text style={styles.mostrarSenha}>
                {mostrarSenha ? "Hide" : "Show"}
              </Text>
            </Pressable>
          </View>

          <View style={styles.opcoes}>
            <Pressable
              style={styles.lembrar}
              onPress={() => setLembrar((valor) => !valor)}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: lembrar }}
            >
              <View
                style={[styles.checkbox, lembrar && styles.checkboxMarcado]}
              >
                {lembrar && <Text style={styles.check}>✓</Text>}
              </View>

              <Text style={styles.lembrarTexto}>Remember me</Text>
            </Pressable>

            <Pressable onPress={emBreve} hitSlop={8}>
              <Text style={styles.linkPequeno}>Forgot Password ?</Text>
            </Pressable>
          </View>

          <Pressable
            onPress={entrar}
            accessibilityRole="button"
            style={({ pressed }) => [
              styles.botaoEntrar,
              pressed && styles.pressionado,
            ]}
          >
            <Text style={styles.botaoEntrarTexto}>Log In</Text>
          </Pressable>

          <View style={styles.rodape}>
            <Text style={styles.rodapeTexto}>Don't have an account?</Text>

            <Pressable
              onPress={() => router.push("/signup")}
              hitSlop={8}
              accessibilityRole="button"
            >
              <Text style={styles.linkCadastro}>Sign Up</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  tela: {
    flex: 1,
    backgroundColor: "#f5f5fb",
  },
  gradiente: {
    position: "absolute",
    top: 0,
    width: "100%",
    height: "47%",
  },
  container: {
    flexGrow: 1,
    alignItems: "center",
    paddingTop: 150,
    paddingBottom: 50,
    paddingHorizontal: 24,
  },
  marca: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginBottom: 42,
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
  cartao: {
    width: "100%",
    maxWidth: 380,
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 26,
  },
  botaoGoogle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    borderWidth: 1,
    borderColor: "#e9e9e9",
    borderRadius: 24,
    paddingVertical: 12,
  },
  googleG: {
    color: "#4285f4",
    fontSize: 23,
    fontWeight: "bold",
  },
  googleTexto: {
    fontSize: 14,
    fontWeight: "600",
    color: "#222",
  },
  divisor: {
    flexDirection: "row",
    alignItems: "center",
    gap: 18,
    marginVertical: 26,
  },
  linha: {
    flex: 1,
    height: 1,
    backgroundColor: "#ededed",
  },
  divisorTexto: {
    fontSize: 14,
    color: "#888",
  },
  input: {
    width: "100%",
    height: 46,
    borderWidth: 1,
    borderColor: "#e9e9e9",
    borderRadius: 9,
    paddingHorizontal: 14,
    fontSize: 14,
    color: "#222",
    marginBottom: 16,
  },
  campoSenha: {
    flexDirection: "row",
    alignItems: "center",
    height: 46,
    borderWidth: 1,
    borderColor: "#e9e9e9",
    borderRadius: 9,
    paddingHorizontal: 14,
  },
  inputSenha: {
    flex: 1,
    height: "100%",
    fontSize: 14,
    color: "#222",
  },
  mostrarSenha: {
    fontSize: 12,
    color: "#7b7b7b",
    marginLeft: 8,
  },
  opcoes: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
    marginTop: 20,
  },
  lembrar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  checkbox: {
    width: 15,
    height: 15,
    borderWidth: 1,
    borderColor: "#888",
    borderRadius: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxMarcado: {
    backgroundColor: "#2860e8",
    borderColor: "#2860e8",
  },
  check: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "bold",
  },
  lembrarTexto: {
    fontSize: 11,
    color: "#777",
  },
  linkPequeno: {
    fontSize: 11,
    color: "#3269d5",
  },
  botaoEntrar: {
    width: "70%",
    alignSelf: "center",
    alignItems: "center",
    backgroundColor: "#2d63e9",
    borderRadius: 10,
    paddingVertical: 12,
    marginTop: 28,
    shadowColor: "#2856ce",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  pressionado: {
    opacity: 0.8,
  },
  botaoEntrarTexto: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
  rodape: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
    marginTop: 28,
  },
  rodapeTexto: {
    fontSize: 11,
    color: "#777",
  },
  linkCadastro: {
    fontSize: 12,
    color: "#3269d5",
    fontWeight: "500",
  },
});
