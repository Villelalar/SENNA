import Ionicons from "@expo/vector-icons/Ionicons";
import { StatusBar } from "expo-status-bar";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import FundoApp from "./FundoApp";

// Layout comum das telas internas: botão voltar + título no topo,
// conteúdo com rolagem no meio e (opcional) a barra de navegação embaixo.
export default function TelaPadrao({
  titulo,
  onVoltar,
  fonteTitulo,
  extraCabecalho,
  rodape,
  espaco = 12,
  children,
}) {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const margem = width < 400 ? 16 : 24;
  const tamanhoTitulo = Math.min(32, Math.max(24, width * 0.06));

  const lados = {
    paddingLeft: margem + insets.left,
    paddingRight: margem + insets.right,
  };

  return (
    <FundoApp style={styles.fundo}>
      <StatusBar style="dark" />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View
          style={[
            styles.coluna,
            lados,
            { paddingTop: Math.max(24, insets.top + 8), paddingBottom: 12 },
          ]}
        >
          <View style={styles.linhaTopo}>
            <Pressable
              onPress={onVoltar}
              accessibilityRole="button"
              accessibilityLabel="Voltar"
              style={({ pressed }) => [
                styles.voltar,
                pressed && styles.pressionado,
              ]}
            >
              <Ionicons name="arrow-back" size={24} color="#1a1a1a" />
            </Pressable>

            <Text
              accessibilityRole="header"
              style={[
                styles.titulo,
                {
                  fontSize: tamanhoTitulo,
                  lineHeight: Math.round(tamanhoTitulo * 1.15),
                },
                fonteTitulo,
              ]}
            >
              {titulo}
            </Text>
          </View>

          {extraCabecalho}
        </View>

        <ScrollView
          style={styles.flex}
          contentContainerStyle={[
            styles.coluna,
            lados,
            {
              gap: espaco,
              paddingTop: 8,
              paddingBottom: rodape ? 16 : 24 + insets.bottom,
            },
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>

        {rodape}
      </KeyboardAvoidingView>
    </FundoApp>
  );
}

const styles = StyleSheet.create({
  fundo: {
    flex: 1,
    backgroundColor: "#f6f6fb",
  },
  flex: {
    flex: 1,
  },
  coluna: {
    width: "100%",
    maxWidth: 560,
    alignSelf: "center",
  },
  linhaTopo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  voltar: {
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.08)",
    borderRadius: 16,
    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.03)",
  },
  pressionado: {
    transform: [{ scale: 0.95 }],
  },
  titulo: {
    flex: 1,
    fontWeight: "800",
    color: "#15141e",
  },
});
